import { router } from "expo-router";
import React from "react";
import {
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import Button from "../../components/ui/Button";
import {
    decreaseQuantity,
    increaseQuantity,
    removeFromCart,
} from "../../store/cartSlice";
import { RootState } from "../../store/store";
import { COLORS } from "../../utils/theme";

export default function CartScreen() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const shipping = subtotal > 1000 || subtotal === 0 ? 0 : 99;
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🛒</Text>
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptyText}>Add products to see them here.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.heading}>My Cart</Text>

      {cartItems.map((item) => (
        <View key={`${item.productId}-${item.size}`} style={styles.cartItem}>
          <Image source={{ uri: item.image }} style={styles.image} />

          <View style={styles.info}>
            <Text style={styles.brand}>{item.brand}</Text>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.size}>Size: {item.size}</Text>
            <Text style={styles.price}>₹{item.price}</Text>

            <View style={styles.quantityRow}>
              <Pressable
                style={styles.quantityButton}
                onPress={() =>
                  dispatch(
                    decreaseQuantity({
                      productId: item.productId,
                      size: item.size,
                    })
                  )
                }
              >
                <Text style={styles.quantityButtonText}>-</Text>
              </Pressable>

              <Text style={styles.quantityText}>{item.quantity}</Text>

              <Pressable
                style={styles.quantityButton}
                onPress={() =>
                  dispatch(
                    increaseQuantity({
                      productId: item.productId,
                      size: item.size,
                    })
                  )
                }
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </Pressable>
            </View>

            <Pressable
              onPress={() =>
                dispatch(
                  removeFromCart({
                    productId: item.productId,
                    size: item.size,
                  })
                )
              }
            >
              <Text style={styles.remove}>Remove</Text>
            </Pressable>
          </View>
        </View>
      ))}

      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>Price Summary</Text>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>₹{subtotal}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Shipping</Text>
          <Text style={styles.summaryValue}>
            {shipping === 0 ? "Free" : `₹${shipping}`}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>₹{total}</Text>
        </View>
      </View>

      <View style={styles.checkout}>
        <Button
          title="Proceed to Checkout"
          onPress={() => router.push("/checkout")}
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
    marginBottom: 20,
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.text,
  },
  cartItem: {
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
    fontWeight: "700",
    marginTop: 4,
  },
  size: {
    color: COLORS.muted,
    marginTop: 6,
  },
  price: {
    color: COLORS.accent,
    fontSize: 16,
    fontWeight: "800",
    marginTop: 6,
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    gap: 10,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.text,
    minWidth: 24,
    textAlign: "center",
  },
  remove: {
    color: COLORS.error,
    marginTop: 10,
    fontWeight: "700",
  },
  summary: {
    backgroundColor: COLORS.surface,
    padding: 18,
    borderRadius: 18,
    marginTop: 10,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  summaryLabel: {
    color: COLORS.muted,
    fontSize: 15,
  },
  summaryValue: {
    color: COLORS.text,
    fontSize: 15,
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
  checkout: {
    marginVertical: 24,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 8,
  },
  emptyText: {
    color: COLORS.muted,
    fontSize: 15,
  },
});