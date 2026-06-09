import { doc, getDoc, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";

import Button from "../../components/ui/Button";
import { auth, db } from "../../services/firebase";
import { COLORS } from "../../utils/theme";

export default function AddressScreen() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAddress();
  }, []);

  const loadAddress = async () => {
    try {
      const user = auth.currentUser;

      if (!user) return;

      const addressRef = doc(db, "addresses", user.uid);
      const addressSnap = await getDoc(addressRef);

      if (addressSnap.exists()) {
        const data = addressSnap.data();

        setName(data.name || "");
        setPhone(data.phone || "");
        setAddress(data.address || "");
      }
    } catch (error) {
      console.log("Load address error:", error);
    }
  };

  const handleSave = async () => {
    if (!name || !phone || !address) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const user = auth.currentUser;

      if (!user) {
        Alert.alert("Error", "User not logged in");
        return;
      }

      await setDoc(doc(db, "addresses", user.uid), {
        userId: user.uid,
        userEmail: user.email,
        name,
        phone,
        address,
        updatedAt: new Date().toISOString(),
      });

      Alert.alert("Saved", "Address saved successfully");
    } catch (error) {
      console.log("Save address error:", error);
      Alert.alert("Error", "Could not save address");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Shipping Address</Text>

      <TextInput
        placeholder="Full Name"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <TextInput
        placeholder="Phone Number"
        keyboardType="phone-pad"
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
      />

      <TextInput
        placeholder="Full Address"
        multiline
        numberOfLines={4}
        style={[styles.input, styles.addressInput]}
        value={address}
        onChangeText={setAddress}
      />

      <Button
        title={loading ? "Saving..." : "Save Address"}
        onPress={handleSave}
      />
    </View>
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
  input: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  addressInput: {
    height: 120,
    textAlignVertical: "top",
  },
});