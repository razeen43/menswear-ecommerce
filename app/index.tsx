import { onAuthStateChanged, User } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

import CustomerTabs from "../src/navigation/CustomerTabs";
import LoginScreen from "../src/screens/auth/LoginScreen";
import RegisterScreen from "../src/screens/auth/RegisterScreen";
import { auth } from "../src/services/firebase";
import { COLORS } from "../src/utils/theme";

export default function Index() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authScreen, setAuthScreen] = useState<"login" | "register">("login");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: COLORS.background,
        }}
      >
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (user) {
    return <CustomerTabs />;
  }

  if (authScreen === "login") {
    return <LoginScreen onGoToRegister={() => setAuthScreen("register")} />;
  }

  return <RegisterScreen onGoToLogin={() => setAuthScreen("login")} />;
}