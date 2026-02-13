import { getAuth, signInWithPhoneNumber } from "@react-native-firebase/auth";
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function LoginScreen() {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [confirm, setConfirm] = useState<any>(null);
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSendCode = async () => {
        if (!phoneNumber.trim()) {
            Alert.alert("Error", "Please enter your phone number");
            return;
        }

        // Format phone number to E.164 format (e.g., +919876543210)
        let formattedPhone = phoneNumber.trim();
        
        // Remove any spaces, dashes, or parentheses
        formattedPhone = formattedPhone.replace(/[\s\-\(\)]/g, '');
        
        // Add country code if not present
        if (!formattedPhone.startsWith('+')) {
            // If it starts with 0, remove it and add +91
            if (formattedPhone.startsWith('0')) {
                formattedPhone = `+91${formattedPhone.substring(1)}`;
            } else {
                formattedPhone = `+91${formattedPhone}`;
            }
        }

        console.log("📱 Formatted phone number:", formattedPhone);
        console.log("📱 Original phone number:", phoneNumber);

        // Validate phone number length (should be 10 digits + country code)
        if (formattedPhone.length < 12 || formattedPhone.length > 15) {
            Alert.alert("Error", "Please enter a valid phone number (10 digits)");
            return;
        }

        setLoading(true);
        try {
            console.log("🔥 Calling signInWithPhoneNumber with:", formattedPhone);
            const confirmation = await signInWithPhoneNumber(getAuth(), formattedPhone);
          
            setConfirm(confirmation);
            Alert.alert(
                "Code Sent", 
                `Verification code has been sent to ${formattedPhone}. Please check your SMS.`
            );
        } catch (error: any) {
            console.error("❌ Phone auth error:", error);
            console.error("❌ Error code:", error.code);
            console.error("❌ Error message:", error.message);
            
            let errorMessage = "Failed to send verification code";
            
            if (error.code === 'auth/invalid-phone-number') {
                errorMessage = "Invalid phone number format. Please enter a valid number.";
            } else if (error.code === 'auth/too-many-requests') {
                errorMessage = "Too many requests. Please try again later.";
            } else if (error.code === 'auth/quota-exceeded') {
                errorMessage = "SMS quota exceeded. Please try again later or contact support.";
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            Alert.alert("Error", errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCode = async () => {
        if (!code.trim()) {
            Alert.alert("Error", "Please enter the verification code");
            return;
        }

        if (!confirm) {
            Alert.alert("Error", "Please send verification code first");
            return;
        }

        setLoading(true);
        try {
            await confirm.confirm(code);
            Alert.alert("Success", "Login successful!");
            
        } catch (error: any) {
            console.error("Code verification error:", error);
            Alert.alert("Error", "Invalid verification code. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>

            <TextInput
                placeholder="Phone Number (e.g., 9876543210)"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                style={styles.input}
                keyboardType="phone-pad"
                editable={!confirm}
            />

            {confirm && (
                <>
                    <Text style={styles.label}>Enter verification code</Text>
                    <TextInput
                        placeholder="6-digit code"
                        value={code}
                        onChangeText={setCode}
                        style={styles.input}
                        keyboardType="number-pad"
                        maxLength={6}
                    />
                </>
            )}

            <TouchableOpacity 
                style={[styles.button, loading && styles.buttonDisabled]} 
                onPress={confirm ? handleVerifyCode : handleSendCode}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    {loading 
                        ? "Please wait..." 
                        : confirm 
                            ? "Verify Code" 
                            : "Send Verification Code"
                    }
                </Text>
            </TouchableOpacity>

            {confirm && (
                <TouchableOpacity 
                    style={styles.linkButton}
                    onPress={() => {
                        setConfirm(null);
                        setCode('');
                    }}
                >
                    <Text style={styles.link}>Change phone number</Text>
                </TouchableOpacity>
            )}

            {/* <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
                <Text style={styles.link}>Don't have an account? Sign up</Text>
            </TouchableOpacity> */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        justifyContent: "center", 
        padding: 20,
        backgroundColor: "#FFF",
    },
    title: { 
        fontSize: 28, 
        fontWeight: "bold", 
        marginBottom: 20, 
        textAlign: "center",
        color: "#111827",
    },
    label: {
        fontSize: 14,
        fontWeight: "500",
        marginBottom: 8,
        color: "#374151",
    },
    input: { 
        borderWidth: 1, 
        borderColor: "#D1D5DB",
        padding: 12, 
        borderRadius: 8, 
        marginBottom: 12,
        fontSize: 16,
        backgroundColor: "#FFF",
    },
    button: { 
        backgroundColor: "#000", 
        padding: 15, 
        borderRadius: 8,
        marginTop: 8,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: { 
        color: "#fff", 
        textAlign: "center", 
        fontWeight: "bold",
        fontSize: 16,
    },
    linkButton: {
        marginTop: 12,
    },
    link: { 
        marginTop: 15, 
        textAlign: "center", 
        color: "#2563EB",
        fontSize: 14,
    },
});
