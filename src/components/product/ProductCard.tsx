import { router } from "expo-router";
import React from "react";
import {
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../../store/store";
import {
    toggleWishlist,
    WishlistItem,
} from "../../store/WishlistSlice";
import { COLORS } from "../../utils/theme";

type ProductCardProps = {
  id: string;
  title: string;
  brand: string;
  price: number;
  image: string;
  variant?: "horizontal" | "grid";
};

export default function ProductCard({
  id,
  title,
  brand,
  price,
  image,
  variant = "grid",
}: ProductCardProps) {
  const dispatch = useDispatch();

  const wishlistItems = useSelector(
    (state: RootState) => state.wishlist.items
  );

  const isWishlisted = wishlistItems.some(
    (item) => item.productId === id
  );

  const product: WishlistItem = {
    productId: id,
    title,
    brand,
    price,
    image,
  };

  const handleWishlist = () => {
    dispatch(toggleWishlist(product));
  };

  return (
    <Pressable
      onPress={() => router.push(`/Product-detail?id=${id}`)}
      style={[
        styles.card,
        variant === "horizontal"
          ? styles.horizontalCard
          : styles.gridCard,
      ]}
    >
      <View>
        <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />

        <Pressable style={styles.heartButton} onPress={handleWishlist}>
          <Text style={styles.heart}>{isWishlisted ? "❤️" : "🤍"}</Text>
        </Pressable>
      </View>

      <Text style={styles.brand}>{brand}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.price}>₹{price}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 10,
    marginBottom: 16,
  },
  horizontalCard: {
    width: 170,
    marginRight: 16,
  },
  gridCard: {
    width: "48%",
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 14,
    backgroundColor: "#E5E7EB",
    marginBottom: 10,
  },
  heartButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#FFFFFF",
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
  },
  heart: {
    fontSize: 18,
  },
  brand: {
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: "600",
  },
  title: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "600",
    marginTop: 4,
  },
  price: {
    color: COLORS.accent,
    fontSize: 15,
    fontWeight: "800",
    marginTop: 6,
  },
});