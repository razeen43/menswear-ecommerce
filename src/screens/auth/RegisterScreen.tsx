import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import Button from "../../components/ui/Button";
import { auth } from "../../services/firebase";
import { COLORS } from "../../utils/theme";

type RegisterScreenProps = {
  onGoToLogin?: () => void;
};

export default function RegisterScreen({
  onGoToLogin,
}: RegisterScreenProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();
    const cleanConfirmPassword = confirmPassword.trim();

    if (
      !cleanName ||
      !cleanEmail ||
      !cleanPassword ||
      !cleanConfirmPassword
    ) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    if (cleanPassword.length < 6) {
      Alert.alert(
        "Error",
        "Password must be at least 6 characters"
      );
      return;
    }

    if (cleanPassword !== cleanConfirmPassword) {
      Alert.alert(
        "Error",
        "Passwords do not match"
      );
      return;
    }

    try {
      setLoading(true);

      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          cleanEmail,
          cleanPassword
        );

      console.log(
        "Registered user:",
        userCredential.user.email
      );

      Alert.alert(
        "Account Created",
        `Welcome ${cleanName}`
      );
    } catch (error: any) {
      console.log(
        "Register error:",
        error.code,
        error.message
      );

      let message =
        "Registration failed. Please try again.";

      switch (error.code) {
        case "auth/email-already-in-use":
          message =
            "This email is already registered.";
          break;

        case "auth/invalid-email":
          message =
            "Please enter a valid email address.";
          break;

        case "auth/weak-password":
          message =
            "Password is too weak. Use at least 6 characters.";
          break;

        case "auth/network-request-failed":
          message =
            "Network error. Check your internet connection.";
          break;
      }

      Alert.alert("Register Failed", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>MENSWEAR</Text>

      <Text style={styles.title}>
        Create Account
      </Text>

      <Text style={styles.subtitle}>
        Register to start shopping
      </Text>

      <TextInput
        placeholder="Full Name"
        autoCapitalize="words"
        autoCorrect={false}
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <TextInput
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        placeholder="Confirm Password"
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {loading ? (
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
        />
      ) : (
        <Button
          title="Register"
          onPress={handleRegister}
        />
      )}

      <Pressable onPress={onGoToLogin}>
        <Text style={styles.footer}>
          Already have an account? Login
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 24,
    justifyContent: "center",
  },
  logo: {
    fontSize: 30,
    fontWeight: "800",
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: 30,
    letterSpacing: 2,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.muted,
    marginBottom: 28,
  },
  input: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  footer: {
    textAlign: "center",
    marginTop: 20,
    color: COLORS.primary,
    fontWeight: "600",
  },
});