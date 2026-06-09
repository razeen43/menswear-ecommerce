import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import Button from "../../components/ui/Button";
import { checkIsAdmin } from "../../services/adminService";
import { db } from "../../services/firebase";
import { COLORS } from "../../utils/theme";

const CLOUDINARY_CLOUD_NAME = "dzrhiy7jr";
const CLOUDINARY_UPLOAD_PRESET = "menswear_products";

export default function AdminAddProductScreen() {
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const [title, setTitle] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const [imageUri, setImageUri] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    verifyAdmin();
  }, []);

  const verifyAdmin = async () => {
    const result = await checkIsAdmin();
    setIsAdmin(result);
    setCheckingAdmin(false);
  };

  const pickImage = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission Required", "Please allow photo access.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const uploadImageToCloudinary = async () => {
    if (!imageUri) {
      throw new Error("No image selected");
    }

    const formData = new FormData();

    formData.append("file", {
      uri: imageUri,
      type: "image/jpeg",
      name: "product.jpg",
    } as any);

    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok || !data.secure_url) {
      console.log("Cloudinary error:", data);
      throw new Error(data.error?.message || "Image upload failed");
    }

    return data.secure_url;
  };

  const handleAddProduct = async () => {
    if (!title || !brand || !price || !category || !description || !imageUri) {
      Alert.alert("Error", "Please fill all fields and select an image");
      return;
    }

    const numericPrice = Number(price);

    if (Number.isNaN(numericPrice) || numericPrice <= 0) {
      Alert.alert("Error", "Please enter a valid price");
      return;
    }

    try {
      setLoading(true);

      const imageUrl = await uploadImageToCloudinary();

      await addDoc(collection(db, "products"), {
        title: title.trim(),
        brand: brand.trim(),
        price: numericPrice,
        image: imageUrl,
        category: category.trim(),
        description: description.trim(),
        createdAt: serverTimestamp(),
      });

      Alert.alert("Success", "Product added successfully");

      setTitle("");
      setBrand("");
      setPrice("");
      setCategory("");
      setDescription("");
      setImageUri("");

      router.replace("/");
    } catch (error: any) {
      console.log("Add product error:", error.message || error);
      Alert.alert("Error", error.message || "Could not add product");
    } finally {
      setLoading(false);
    }
  };

  if (checkingAdmin) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>Checking admin access...</Text>
      </View>
    );
  }

  if (!isAdmin) {
    return (
      <View style={styles.center}>
        <Text style={styles.denied}>Access Denied</Text>
        <Text style={styles.deniedText}>You are not allowed to add products.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.heading}>Add Product</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Product Title</Text>
        <TextInput
          placeholder="Example: Slim Fit Shirt"
          placeholderTextColor="#9CA3AF"
          style={styles.input}
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Brand</Text>
        <TextInput
          placeholder="Example: ZARA"
          placeholderTextColor="#9CA3AF"
          style={styles.input}
          value={brand}
          onChangeText={setBrand}
        />

        <Text style={styles.label}>Price</Text>
        <TextInput
          placeholder="Example: 1499"
          placeholderTextColor="#9CA3AF"
          keyboardType="numeric"
          style={styles.input}
          value={price}
          onChangeText={setPrice}
        />

        <Text style={styles.label}>Category</Text>
        <TextInput
          placeholder="Shirts or Pants"
          placeholderTextColor="#9CA3AF"
          style={styles.input}
          value={category}
          onChangeText={setCategory}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          placeholder="Product description"
          placeholderTextColor="#9CA3AF"
          multiline
          numberOfLines={4}
          style={[styles.input, styles.descriptionInput]}
          value={description}
          onChangeText={setDescription}
        />

        <Button title="Pick Product Image" onPress={pickImage} />

        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.previewImage} />
        ) : null}

        <Button
          title={loading ? "Adding..." : "Add Product"}
          onPress={handleAddProduct}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    color: COLORS.text,
    fontWeight: "700",
    fontSize: 16,
  },
  denied: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.error,
    marginBottom: 8,
  },
  deniedText: {
    color: COLORS.muted,
    fontSize: 15,
    textAlign: "center",
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },
  heading: {
    marginTop: 40,
    marginBottom: 24,
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.text,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 18,
    marginBottom: 30,
    gap: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
  },
  input: {
    backgroundColor: COLORS.background,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    color: COLORS.text,
  },
  descriptionInput: {
    height: 120,
    textAlignVertical: "top",
  },
  previewImage: {
    width: "100%",
    height: 220,
    borderRadius: 16,
    backgroundColor: "#E5E7EB",
  },
});