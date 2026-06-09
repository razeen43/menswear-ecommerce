import React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
} from "react-native";

import { COLORS } from "../../utils/theme";

interface ButtonProps {
  title: string;
  onPress: () => void;
}

export default function Button({
  title,
  onPress,
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
    >
      <Text style={styles.text}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
  },
  text: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
});