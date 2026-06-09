import { useLocalSearchParams } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { useDispatch } from "react-redux";

import Button from "../../components/ui/Button";
import { db } from "../../services/firebase";
import { addToCart } from "../../store/cartSlice";
import { COLORS } from "../../utils/theme";

type Product = {
  id: string;
  title: string;
  brand: string;
  price: number;
  image: string;
  category?: string;
  description?: string;
};

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const dispatch = useDispatch();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [loading, setLoading] = useState(true);

  const sizes = ["S", "M", "L", "XL"];

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      if (!id || typeof id !== "string") return;

      const productRef = doc(db, "products", id);
      const productSnap = await getDoc(productRef);

      if (productSnap.exists()) {
        setProduct({
          id: productSnap.id,
          ...(productSnap.data() as Omit<Product, "id">),
        });
      }
    } catch (error) {
      console.log("Product detail error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    if (!selectedSize) {
      Alert.alert("Select Size", "Please select a size before adding to cart.");
      return;
    }

    dispatch(
      addToCart({
        productId: product.id,
        title: product.title,
        brand: product.brand,
        price: product.price,
        image: product.image,
        size: selectedSize,
        quantity: 1,
      })
    );

    Alert.alert("Added to Cart", `${product.title} - Size ${selectedSize}`);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>Loading product...</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>Product not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} resizeMode="cover" />

      <View style={styles.content}>
        <Text style={styles.brand}>{product.brand}</Text>
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.price}>₹{product.price}</Text>

        <Text style={styles.sectionTitle}>Select Size</Text>

        <View style={styles.sizeRow}>
          {sizes.map((size) => {
            const isSelected = selectedSize === size;

            return (
              <Pressable
                key={size}
                style={[styles.sizeBox, isSelected && styles.selectedSizeBox]}
                onPress={() => setSelectedSize(size)}
              >
                <Text
                  style={[
                    styles.sizeText,
                    isSelected && styles.selectedSizeText,
                  ]}
                >
                  {size}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>Description</Text>

        <Text style={styles.description}>
          {product.description || "No description available."}
        </Text>

        <Button title="Add to Cart" onPress={handleAddToCart} />
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
  },
  loadingText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "700",
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  image: {
    width: "100%",
    height: 420,
    backgroundColor: "#E5E7EB",
  },
  content: {
    padding: 20,
  },
  brand: {
    color: COLORS.muted,
    fontWeight: "700",
    marginBottom: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 8,
  },
  price: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.accent,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 12,
    marginTop: 10,
  },
  sizeRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 22,
  },
  sizeBox: {
    width: 48,
    height: 48,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  selectedSizeBox: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  sizeText: {
    color: COLORS.text,
    fontWeight: "600",
  },
  selectedSizeText: {
    color: "#fff",
  },
  description: {
    color: COLORS.muted,
    lineHeight: 22,
    marginBottom: 24,
  },
});