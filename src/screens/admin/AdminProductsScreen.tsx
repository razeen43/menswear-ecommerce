import { router } from "expo-router";
import {
    collection,
    deleteDoc,
    doc,
    getDocs,
} from "firebase/firestore";
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

import { checkIsAdmin } from "../../services/adminService";
import { db } from "../../services/firebase";
import { COLORS } from "../../utils/theme";

type Product = {
  id: string;
  title: string;
  brand: string;
  price: number;
  image: string;
  category: string;
};

export default function AdminProductsScreen() {
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    verifyAdmin();
  }, []);

  const verifyAdmin = async () => {
    const result = await checkIsAdmin();
    setIsAdmin(result);
    setCheckingAdmin(false);

    if (result) {
      loadProducts();
    }
  };

  const loadProducts = async () => {
    const snapshot = await getDocs(collection(db, "products"));

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[];

    setProducts(data);
  };

  const handleDelete = (productId: string) => {
    Alert.alert(
      "Delete Product",
      "Are you sure you want to delete this product?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteDoc(doc(db, "products", productId));
            loadProducts();
          },
        },
      ]
    );
  };

  if (checkingAdmin) {
    return (
      <View style={styles.center}>
        <Text>Checking admin access...</Text>
      </View>
    );
  }

  if (!isAdmin) {
    return (
      <View style={styles.center}>
        <Text style={styles.denied}>Access Denied</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Manage Products</Text>

      {products.map((product) => (
        <View key={product.id} style={styles.card}>
          <Image source={{ uri: product.image }} style={styles.image} />

          <View style={styles.info}>
            <Text style={styles.brand}>{product.brand}</Text>
            <Text style={styles.title}>{product.title}</Text>
            <Text style={styles.text}>Category: {product.category}</Text>
            <Text style={styles.price}>₹{product.price}</Text>

            <View style={styles.actions}>
              <Pressable
                onPress={() =>
                  router.push(`/admin-edit-product?id=${product.id}`)
                }
              >
                <Text style={styles.edit}>Edit</Text>
              </Pressable>

              <Pressable onPress={() => handleDelete(product.id)}>
                <Text style={styles.delete}>Delete</Text>
              </Pressable>
            </View>
          </View>
        </View>
      ))}
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
  denied: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.error,
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
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: 18,
    marginBottom: 16,
  },
  image: {
    width: 100,
    height: 130,
    borderRadius: 14,
    backgroundColor: "#E5E7EB",
  },
  info: {
    flex: 1,
    marginLeft: 14,
  },
  brand: {
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: "700",
  },
  title: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "800",
    marginTop: 4,
  },
  text: {
    color: COLORS.muted,
    marginTop: 6,
  },
  price: {
    color: COLORS.accent,
    fontSize: 18,
    fontWeight: "800",
    marginTop: 8,
  },
  actions: {
    flexDirection: "row",
    gap: 18,
    marginTop: 12,
  },
  edit: {
    color: COLORS.primary,
    fontWeight: "800",
  },
  delete: {
    color: COLORS.error,
    fontWeight: "800",
  },
});