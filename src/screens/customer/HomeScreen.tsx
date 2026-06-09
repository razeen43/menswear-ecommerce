import { signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import {
    FlatList,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import ProductCard from "../../components/product/ProductCard";
import Button from "../../components/ui/Button";
import { auth } from "../../services/firebase";
import { getProducts } from "../../services/productService";
import { COLORS } from "../../utils/theme";

const categories = ["All", "Shirts", "Pants"];

type Product = {
  id: string;
  title: string;
  brand: string;
  price: number;
  image: string;
  category?: string;
  description?: string;
};

export default function HomeScreen() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    await signOut(auth);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data as Product[]);
    } catch (error) {
      console.log("Firestore product error:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) => {
    const keyword = search.toLowerCase();

    const matchesSearch =
      product.title.toLowerCase().includes(keyword) ||
      product.brand.toLowerCase().includes(keyword);

    const matchesCategory =
      selectedCategory === "All" ||
      product.category?.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading products...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome</Text>
          <Text style={styles.logo}>MENSWEAR</Text>
        </View>

        <Text style={styles.profile}>👤</Text>
      </View>

      <TextInput
        placeholder="Search shirts, pants, brands..."
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.searchBar}
        value={search}
        onChangeText={setSearch}
      />

      <View style={styles.hero}>
        <Text style={styles.heroTitle}>New Season Collection</Text>
        <Text style={styles.heroSubtitle}>Minimal styles for modern men</Text>
        <Text style={styles.heroButton}>Shop Now</Text>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Categories</Text>
      </View>

      <View style={styles.categoryRow}>
        {categories.map((item) => {
          const isActive = selectedCategory === item;

          return (
            <Pressable
              key={item}
              style={[
                styles.categoryChip,
                isActive && styles.activeCategoryChip,
              ]}
              onPress={() => setSelectedCategory(item)}
            >
              <Text
                style={[
                  styles.categoryText,
                  isActive && styles.activeCategoryText,
                ]}
              >
                {item}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Featured Products</Text>
        <Text style={styles.seeAll}>See All</Text>
      </View>

      <FlatList
        data={filteredProducts}
        horizontal
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <ProductCard
            id={item.id}
            title={item.title}
            brand={item.brand}
            price={item.price}
            image={item.image}
            variant="horizontal"
          />
        )}
      />

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>New Arrivals</Text>
      </View>

      <View style={styles.grid}>
        {filteredProducts.map((item) => (
          <ProductCard
            key={item.id}
            id={item.id}
            title={item.title}
            brand={item.brand}
            price={item.price}
            image={item.image}
            variant="grid"
          />
        ))}
      </View>

      {filteredProducts.length === 0 ? (
        <Text style={styles.noProducts}>No products found.</Text>
      ) : null}

      <View style={styles.logout}>
        <Button title="Logout" onPress={handleLogout} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: COLORS.text,
    fontWeight: "700",
    fontSize: 16,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },
  header: {
    marginTop: 40,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    color: COLORS.muted,
    fontSize: 14,
  },
  logo: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.primary,
    letterSpacing: 2,
  },
  profile: {
    fontSize: 28,
  },
  searchBar: {
    backgroundColor: COLORS.surface,
    padding: 14,
    borderRadius: 14,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  hero: {
    backgroundColor: COLORS.primary,
    borderRadius: 24,
    padding: 24,
    marginBottom: 28,
  },
  heroTitle: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 8,
  },
  heroSubtitle: {
    color: "#E5E7EB",
    fontSize: 14,
    marginBottom: 20,
  },
  heroButton: {
    color: "#fff",
    backgroundColor: COLORS.accent,
    alignSelf: "flex-start",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 999,
    fontWeight: "700",
  },
  sectionHeader: {
    marginBottom: 14,
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
  },
  seeAll: {
    color: COLORS.accent,
    fontWeight: "600",
  },
  categoryRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 22,
  },
  categoryChip: {
    backgroundColor: COLORS.surface,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  activeCategoryChip: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryText: {
    fontWeight: "600",
    color: COLORS.text,
  },
  activeCategoryText: {
    color: "#fff",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  noProducts: {
    textAlign: "center",
    color: COLORS.muted,
    marginTop: 20,
    fontWeight: "600",
  },
  logout: {
    marginVertical: 30,
  },
});