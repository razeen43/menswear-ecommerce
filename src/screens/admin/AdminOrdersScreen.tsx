import {
    collection,
    doc,
    getDocs,
    orderBy,
    query,
    updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { checkIsAdmin } from "../../services/adminService";
import { db } from "../../services/firebase";
import { COLORS } from "../../utils/theme";

type Order = {
  id: string;
  userEmail: string;
  total: number;
  status: string;
  items: any[];
  address?: {
    name?: string;
    phone?: string;
    address?: string;
  };
};

const statuses = ["Placed", "Processing", "Shipped", "Delivered"];

export default function AdminOrdersScreen() {
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    verifyAdmin();
  }, []);

  const verifyAdmin = async () => {
    const result = await checkIsAdmin();
    setIsAdmin(result);
    setCheckingAdmin(false);

    if (result) {
      loadOrders();
    }
  };

  const loadOrders = async () => {
    try {
      const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      })) as Order[];

      setOrders(data);
    } catch (error) {
      console.log("Load admin orders error:", error);
      Alert.alert("Error", "Could not load orders");
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await updateDoc(doc(db, "orders", orderId), {
        status,
        updatedAt: new Date().toISOString(),
      });

      Alert.alert("Updated", `Order marked as ${status}`);
      loadOrders();
    } catch (error) {
      console.log("Update order status error:", error);
      Alert.alert("Error", "Could not update order status");
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
        <Text style={styles.deniedText}>
          You are not allowed to manage orders.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.heading}>Admin Orders</Text>

      {orders.length === 0 ? (
        <Text style={styles.empty}>No orders found.</Text>
      ) : (
        orders.map((order) => (
          <View key={order.id} style={styles.card}>
            <Text style={styles.orderId}>Order #{order.id.slice(0, 8)}</Text>

            <Text style={styles.sectionTitle}>Customer Details</Text>
            <Text style={styles.text}>Email: {order.userEmail}</Text>

            {order.address ? (
              <>
                <Text style={styles.text}>
                  Name: {order.address.name || "Not available"}
                </Text>
                <Text style={styles.text}>
                  Phone: {order.address.phone || "Not available"}
                </Text>
                <Text style={styles.text}>
                  Address: {order.address.address || "Not available"}
                </Text>
              </>
            ) : (
              <Text style={styles.text}>Address: Not available</Text>
            )}

            <View style={styles.divider} />

            <Text style={styles.sectionTitle}>Order Summary</Text>
            <Text style={styles.text}>Items: {order.items?.length || 0}</Text>
            <Text style={styles.total}>₹{order.total}</Text>
            <Text style={styles.status}>Current Status: {order.status}</Text>

            <View style={styles.statusRow}>
              {statuses.map((status) => (
                <Pressable
                  key={status}
                  style={[
                    styles.statusButton,
                    order.status === status && styles.activeStatusButton,
                  ]}
                  onPress={() => updateOrderStatus(order.id, status)}
                >
                  <Text
                    style={[
                      styles.statusButtonText,
                      order.status === status && styles.activeStatusButtonText,
                    ]}
                  >
                    {status}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        ))
      )}
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
    padding: 18,
    borderRadius: 18,
    marginBottom: 16,
  },
  orderId: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 8,
    marginTop: 4,
  },
  text: {
    color: COLORS.muted,
    marginBottom: 6,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 12,
  },
  total: {
    color: COLORS.accent,
    fontSize: 18,
    fontWeight: "800",
    marginTop: 6,
  },
  status: {
    color: COLORS.text,
    fontWeight: "700",
    marginTop: 10,
    marginBottom: 10,
  },
  statusRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  statusButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  activeStatusButton: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  statusButtonText: {
    color: COLORS.text,
    fontWeight: "700",
    fontSize: 12,
  },
  activeStatusButtonText: {
    color: "#fff",
  },
  empty: {
    color: COLORS.muted,
    fontSize: 16,
  },
});