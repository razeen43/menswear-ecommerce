import { router, useLocalSearchParams } from "expo-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
    Alert,
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

export default function AdminEditProductScreen() {
  const { id } = useLocalSearchParams();

  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const [title, setTitle] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    verifyAdminAndLoadProduct();
  }, [id]);

  const verifyAdminAndLoadProduct = async () => {
    try {
      const adminResult = await checkIsAdmin();
      setIsAdmin(adminResult);

      if (!adminResult) {
        setCheckingAdmin(false);
        return;
      }

      if (!id || typeof id !== "string") {
        setCheckingAdmin(false);
        return;
      }

      const productRef = doc(db, "products", id);
      const productSnap = await getDoc(productRef);

      if (productSnap.exists()) {
        const data = productSnap.data();

        setTitle(data.title || "");
        setBrand(data.brand || "");
        setPrice(String(data.price || ""));
        setCategory(data.category || "");
        setDescription(data.description || "");
        setImage(data.image || "");
      }
    } catch (error) {
      console.log("Load edit product error:", error);
      Alert.alert("Error", "Could not load product");
    } finally {
      setCheckingAdmin(false);
    }
  };

  const handleUpdateProduct = async () => {
    if (!id || typeof id !== "string") {
      Alert.alert("Error", "Invalid product ID");
      return;
    }

    if (!title || !brand || !price || !category || !description || !image) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    const numericPrice = Number(price);

    if (Number.isNaN(numericPrice) || numericPrice <= 0) {
      Alert.alert("Error", "Please enter a valid price");
      return;
    }

    try {
      setLoading(true);

      await updateDoc(doc(db, "products", id), {
        title: title.trim(),
        brand: brand.trim(),
        price: numericPrice,
        image: image.trim(),
        category: category.trim(),
        description: description.trim(),
        updatedAt: new Date().toISOString(),
      });

      Alert.alert("Success", "Product updated successfully");
      router.replace("/admin-products");
    } catch (error) {
      console.log("Update product error:", error);
      Alert.alert("Error", "Could not update product");
    } finally {
      setLoading(false);
    }
  };

  if (checkingAdmin) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>Loading product...</Text>
      </View>
    );
  }

  if (!isAdmin) {
    return (
      <View style={styles.center}>
        <Text style={styles.denied}>Access Denied</Text>
        <Text style={styles.deniedText}>
          You are not allowed to edit products.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.heading}>Edit Product</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Product Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Brand</Text>
        <TextInput
          style={styles.input}
          value={brand}
          onChangeText={setBrand}
        />

        <Text style={styles.label}>Price</Text>
        <TextInput
          keyboardType="numeric"
          style={styles.input}
          value={price}
          onChangeText={setPrice}
        />

        <Text style={styles.label}>Image URL</Text>
        <TextInput
          style={styles.input}
          value={image}
          onChangeText={setImage}
        />

        <Text style={styles.label}>Category</Text>
        <TextInput
          style={styles.input}
          value={category}
          onChangeText={setCategory}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          multiline
          numberOfLines={4}
          style={[styles.input, styles.descriptionInput]}
          value={description}
          onChangeText={setDescription}
        />

        <Button
          title={loading ? "Updating..." : "Update Product"}
          onPress={handleUpdateProduct}
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
});