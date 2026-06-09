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

import { toggleWishlist } from "../../store/WishlistSlice";
import { RootState } from "../../store/store";
import { COLORS } from "../../utils/theme";

export default function WishlistScreen() {
  const dispatch = useDispatch();

  const wishlistItems = useSelector(
    (state: RootState) => state.wishlist.items
  );

  if (wishlistItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.icon}>❤️</Text>
        <Text style={styles.title}>Wishlist Empty</Text>
        <Text style={styles.subtitle}>
          Save products to view them later.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.heading}>My Wishlist</Text>

      {wishlistItems.map((item) => (
        <View
          key={item.productId}
          style={styles.card}
        >
          <Image
            source={{ uri: item.image }}
            style={styles.image}
          />

          <View style={styles.info}>
            <Text style={styles.brand}>
              {item.brand}
            </Text>

            <Text style={styles.productTitle}>
              {item.title}
            </Text>

            <Text style={styles.price}>
              ₹{item.price}
            </Text>

            <Pressable
              onPress={() =>
                dispatch(toggleWishlist(item))
              }
            >
              <Text style={styles.remove}>
                Remove from Wishlist
              </Text>
            </Pressable>
          </View>
        </View>
      ))}
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
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 12,
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
    justifyContent: "center",
  },
  brand: {
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: "700",
  },
  productTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "700",
    marginTop: 4,
  },
  price: {
    color: COLORS.accent,
    fontSize: 18,
    fontWeight: "800",
    marginTop: 8,
  },
  remove: {
    color: "#DC2626",
    marginTop: 12,
    fontWeight: "700",
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  icon: {
    fontSize: 60,
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    color: COLORS.muted,
    fontSize: 15,
  },
});