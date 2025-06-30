import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  Platform,
} from "react-native";

const SignInScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = () => {
    if (email && password) {
      Alert.alert(
        "Thành công",
        `Đăng nhập với Email: ${email} và Mật khẩu: ${password}`
      );
    } else {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ email và mật khẩu.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.welcomeText}>Chào mừng trở lại!</Text>
        <Text style={styles.subTitle}>Đăng nhập để tiếp tục</Text>

        <View style={styles.card}>
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="nhập email của bạn"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.inputLabel}>Mật khẩu</Text>
          <TextInput
            style={styles.input}
            placeholder="nhập mật khẩu của bạn"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.button} onPress={handleSignIn}>
            <Text style={styles.buttonText}>Đăng nhập</Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.signUpContainer}>
          <Text style={styles.signUpPrompt}>Bạn chưa có tài khoản?</Text>
          <TouchableOpacity>
            <Text style={styles.signUpLink}>Đăng ký ngay</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#E0F2F7",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#263238",
    marginBottom: 8,
  },
  subTitle: {
    fontSize: 18,
    color: "#455A64",
    marginBottom: 40,
  },
  card: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 25,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
    marginBottom: 30,
  },
  inputLabel: {
    fontSize: 16,
    color: "#455A64",
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 15,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  forgotPasswordText: {
    color: "#007AFF",
    fontSize: 14,
    textAlign: "center",
    marginTop: 5,
  },
  signUpContainer: {
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  signUpPrompt: {
    fontSize: 16,
    color: "#607D8B",
    marginRight: 5,
  },
  signUpLink: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "bold",
  },
});

export default SignInScreen;
