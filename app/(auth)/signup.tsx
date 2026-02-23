import { AuthContext } from "@/auth/AuthContext";
import { createUserWithEmailAndPassword, getAuth } from "@react-native-firebase/auth";
import { router } from "expo-router";

import { useContext, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
// import { auth } from "../firebaseConfig";

export default function SignupScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
 const appContext=useContext(AuthContext);

 if(!appContext){
return null
 }
const setUser=appContext.setUser;


  const handleSignup = async () => {

    if(password.length<6){
      Alert.alert('Dear user',"Password should be at least 6 characters");
      return;
    }
    try {
      createUserWithEmailAndPassword(getAuth(), email, password).then((res)=>{
        Alert.alert('You have successfully logged In');
      }).catch((error)=>{
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
          Alert.alert("Dear user",'You have already an account using this email',[{text:"Forgot password",onPress:()=>{router.push('/(auth)/resetpassword')},style:'default'},{text:"Signup with another email",onPress:()=>{},style:'default'}])
        }
    
        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
          Alert.alert('That email address is invalid!')
        }
    
        console.error(error);
      });
      
             // save user in context
      // router.replace("/(drawer)/(tabs)/bookservice")   // go to protected area
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
        autoCapitalize="words"
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, padding: 12, borderRadius: 8, marginBottom: 12 },
  button: { backgroundColor: "#000", padding: 15, borderRadius: 8 },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
  link: { marginTop: 15, textAlign: "center", color: "blue" },
});
