import { router } from "expo-router";
import {
    addDoc,
    collection,
    doc,
    getDoc,
    serverTimestamp,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import Button from "../../components/ui/Button";
import { auth, db } from "../../services/firebase";
import { clearCart } from "../../store/cartSlice";
import { RootState } from "../../store/store";
import { COLORS } from "../../utils/theme";

type Address = {
  name: string;
  phone: string;
  address: string;
};

export default function CheckoutScreen() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState<Address | null>(null);
  const [paymentMethod] = useState("Cash on Delivery");

  useEffect(() => {
    loadAddress();
  }, []);

  const loadAddress = async () => {
    const user = auth.currentUser;

    if (!user) return;

    const addressRef = doc(db, "addresses", user.uid);
    const addressSnap = await getDoc(addressRef);

    if (addressSnap.exists()) {
      setAddress(addressSnap.data() as Address);
    }
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const shipping = subtotal > 1000 || subtotal === 0 ? 0 : 99;
  const total = subtotal + shipping;

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      Alert.alert("Cart Empty", "Please add products before placing an order.");
      return;
    }

    if (!address) {
      Alert.alert(
        "Address Required",
        "Please save your shipping address first."
      );
      return;
    }

    try {
      setLoading(true);

      await addDoc(collection(db, "orders"), {
        userId: auth.currentUser?.uid,
        userEmail: auth.currentUser?.email,
        address,
        items: cartItems,
        subtotal,
        shipping,
        total,
        paymentMethod,
        paymentStatus: "Pending",
        status: "Placed",
        createdAt: serverTimestamp(),
      });

      dispatch(clearCart());

      Alert.alert("Order Placed", "Your Cash on Delivery order has been placed.");

      router.replace("/");
    } catch (error) {
      console.log("Order error:", error);
      Alert.alert("Order Failed", "Something went wrong while placing order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.heading}>Checkout</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Delivery Address</Text>

        {address ? (
          <>
            <Text style={styles.text}>{address.name}</Text>
            <Text style={styles.text}>{address.address}</Text>
            <Text style={styles.text}>Phone: {address.phone}</Text>
          </>
        ) : (
          <Text style={styles.warning}>
            No address saved. Go to Profile → Shipping Address.
          </Text>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Order Summary</Text>

        {cartItems.map((item) => (
          <View key={`${item.productId}-${item.size}`} style={styles.itemRow}>
            <Text style={styles.itemName}>
              {item.title} x {item.quantity}
            </Text>
            <Text style={styles.itemPrice}>₹{item.price * item.quantity}</Text>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Payment Method</Text>

        <Text style={styles.paymentOption}>Cash on Delivery</Text>
        <Text style={styles.paymentNote}>
          Pay when your order is delivered.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Payment Summary</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Subtotal</Text>
          <Text style={styles.value}>₹{subtotal}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Shipping</Text>
          <Text style={styles.value}>
            {shipping === 0 ? "Free" : `₹${shipping}`}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>₹{total}</Text>
        </View>
      </View>

      <View style={styles.buttonWrapper}>
        <Button
          title={loading ? "Placing Order..." : "Place COD Order"}
          onPress={handlePlaceOrder}
        />
      </View>
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
    marginBottom: 24,
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.text,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 12,
  },
  text: {
    color: COLORS.muted,
    marginBottom: 6,
  },
  warning: {
    color: COLORS.error,
    fontWeight: "600",
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  itemName: {
    flex: 1,
    color: COLORS.text,
    fontWeight: "600",
  },
  itemPrice: {
    color: COLORS.accent,
    fontWeight: "800",
  },
  paymentOption: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
    color: "#fff",
    fontWeight: "800",
    marginBottom: 8,
  },
  paymentNote: {
    color: COLORS.muted,
    fontSize: 13,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  label: {
    color: COLORS.muted,
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
  buttonWrapper: {
    marginBottom: 30,
  },
});