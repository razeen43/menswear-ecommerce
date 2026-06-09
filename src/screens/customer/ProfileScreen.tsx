import { router } from "expo-router";
import { signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import Button from "../../components/ui/Button";
import { checkIsAdmin } from "../../services/adminService";
import { auth } from "../../services/firebase";
import { COLORS } from "../../utils/theme";

export default function ProfileScreen() {
  const user = auth.currentUser;
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const loadAdmin = async () => {
      const result = await checkIsAdmin();
      setIsAdmin(result);
    };

    loadAdmin();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Profile</Text>

      <View style={styles.card}>
        <Text style={styles.avatar}>👤</Text>
        <Text style={styles.name}>Menswear User</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <View style={styles.menu}>
        <Pressable onPress={() => router.push("/orders")}>
          <Text style={styles.menuItem}>📦 My Orders</Text>
        </Pressable>

        <Pressable onPress={() => router.push("/address")}>
          <Text style={styles.menuItem}>📍 Shipping Address</Text>
        </Pressable>

        {isAdmin ? (
          <>
            <Pressable onPress={() => router.push("/admin-add-product")}>
              <Text style={styles.menuItem}>➕ Admin Add Product</Text>
            </Pressable>

            <Pressable onPress={() => router.push("/admin-products")}>
              <Text style={styles.menuItem}>🛠️ Admin Manage Products</Text>
            </Pressable>

            <Pressable onPress={() => router.push("/admin-orders")}>
              <Text style={styles.menuItem}>📋 Admin Manage Orders</Text>
            </Pressable>
          </>
        ) : null}

        <Text style={styles.menuItem}>💳 Payment Methods</Text>
        <Text style={styles.menuItem}>⚙️ Settings</Text>
      </View>

      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 20 },
  heading: {
    marginTop: 40,
    marginBottom: 24,
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.text,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: { fontSize: 60, marginBottom: 12 },
  name: { fontSize: 22, fontWeight: "800", color: COLORS.text },
  email: { marginTop: 6, color: COLORS.muted },
  menu: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 18,
    marginBottom: 24,
  },
  menuItem: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: "600",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
});