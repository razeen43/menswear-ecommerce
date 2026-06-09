import { signInWithEmailAndPassword } from "firebase/auth";
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

type LoginScreenProps = {
  onGoToRegister?: () => void;
};

export default function LoginScreen({
  onGoToRegister,
}: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        cleanEmail,
        cleanPassword
      );

      console.log(
        "Logged in user:",
        userCredential.user.email
      );

      Alert.alert(
        "Login Successful",
        `Welcome ${userCredential.user.email}`
      );
    } catch (error: any) {
      console.log(
        "Login error:",
        error.code,
        error.message
      );

      let message = "Login failed. Please try again.";

      switch (error.code) {
        case "auth/invalid-credential":
          message = "Wrong email or password.";
          break;

        case "auth/user-not-found":
          message = "No account found with this email.";
          break;

        case "auth/wrong-password":
          message = "Incorrect password.";
          break;

        case "auth/invalid-email":
          message = "Invalid email address.";
          break;

        case "auth/too-many-requests":
          message =
            "Too many login attempts. Try again later.";
          break;
      }

      Alert.alert("Login Failed", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>MENSWEAR</Text>

      <Text style={styles.title}>
        Welcome Back
      </Text>

      <Text style={styles.subtitle}>
        Login to continue shopping
      </Text>

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

      {loading ? (
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
        />
      ) : (
        <Button
          title="Login"
          onPress={handleLogin}
        />
      )}

      <Pressable onPress={onGoToRegister}>
        <Text style={styles.footer}>
          Don't have an account? Register
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