import { useLocalSearchParams } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

import { db } from "../../services/firebase";
import { COLORS } from "../../utils/theme";

type OrderItem = {
  productId: string;
  title: string;
  brand: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
};

type Order = {
  id: string;
  total: number;
  subtotal: number;
  shipping: number;
  status: string;
  items: OrderItem[];
  address?: {
    name: string;
    phone: string;
    address: string;
  };
};

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      if (!id || typeof id !== "string") return;

      const orderRef = doc(db, "orders", id);
      const orderSnap = await getDoc(orderRef);

      if (orderSnap.exists()) {
        setOrder({
          id: orderSnap.id,
          ...(orderSnap.data() as Omit<Order, "id">),
        });
      }
    } catch (error) {
      console.log("Order detail error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading order...</Text>
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.center}>
        <Text>Order not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Order Details</Text>

      <View style={styles.card}>
        <Text style={styles.orderId}>Order #{order.id.slice(0, 8)}</Text>
        <Text style={styles.status}>Status: {order.status}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Items</Text>

        {order.items.map((item) => (
          <View key={`${item.productId}-${item.size}`} style={styles.itemRow}>
            <Image source={{ uri: item.image }} style={styles.image} />

            <View style={styles.itemInfo}>
              <Text style={styles.brand}>{item.brand}</Text>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.text}>Size: {item.size}</Text>
              <Text style={styles.text}>Qty: {item.quantity}</Text>
              <Text style={styles.price}>₹{item.price * item.quantity}</Text>
            </View>
          </View>
        ))}
      </View>

      {order.address ? (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <Text style={styles.text}>{order.address.name}</Text>
          <Text style={styles.text}>{order.address.address}</Text>
          <Text style={styles.text}>Phone: {order.address.phone}</Text>
        </View>
      ) : null}

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Payment Summary</Text>

        <View style={styles.summaryRow}>
          <Text style={styles.text}>Subtotal</Text>
          <Text style={styles.value}>₹{order.subtotal}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.text}>Shipping</Text>
          <Text style={styles.value}>
            {order.shipping === 0 ? "Free" : `₹${order.shipping}`}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>₹{order.total}</Text>
        </View>
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
  status: {
    color: COLORS.accent,
    fontWeight: "800",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 14,
  },
  itemRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  image: {
    width: 90,
    height: 110,
    borderRadius: 14,
    backgroundColor: "#E5E7EB",
  },
  itemInfo: {
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
    marginTop: 5,
  },
  price: {
    color: COLORS.accent,
    fontWeight: "800",
    marginTop: 8,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  value: {
    color: COLORS.text,
    fontWeight: "700",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.accent,
  },
});