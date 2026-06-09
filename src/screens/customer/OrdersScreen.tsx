import { router } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text
} from "react-native";

import { auth, db } from "../../services/firebase";
import { COLORS } from "../../utils/theme";

type Order = {
  id: string;
  total: number;
  status: string;
  userEmail: string;
  items: any[];
};

export default function OrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const q = query(
        collection(db, "orders"),
        where("userId", "==", auth.currentUser?.uid)
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Order[];

      setOrders(data);
    } catch (error) {
      console.log("Load orders error:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>My Orders</Text>

      {orders.length === 0 ? (
        <Text style={styles.empty}>No orders yet.</Text>
      ) : (
        orders.map((order) => (
          <Pressable
            key={order.id}
            style={styles.card}
            onPress={() =>
              router.push(`/order-detail?id=${order.id}`)
            }
          >
            <Text style={styles.orderId}>
              Order #{order.id.slice(0, 8)}
            </Text>

            <Text style={styles.text}>
              Items: {order.items.length}
            </Text>

            <Text style={styles.text}>
              Status: {order.status}
            </Text>

            <Text style={styles.total}>
              ₹{order.total}
            </Text>

            <Text style={styles.viewDetails}>
              View Details →
            </Text>
          </Pressable>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },
  heading: {
    marginTop: 40,
    marginBottom: 20,
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.text,
  },
  card: {
    backgroundColor: COLORS.surface,
    padding: 18,
    borderRadius: 18,
    marginBottom: 16,
  },
  orderId: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 8,
  },
  text: {
    color: COLORS.muted,
    marginBottom: 6,
  },
  total: {
    color: COLORS.accent,
    fontSize: 18,
    fontWeight: "800",
    marginTop: 8,
  },
  viewDetails: {
    marginTop: 10,
    color: COLORS.primary,
    fontWeight: "700",
  },
  empty: {
    color: COLORS.muted,
    fontSize: 16,
  },
});