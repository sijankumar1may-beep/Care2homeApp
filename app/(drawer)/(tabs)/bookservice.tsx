import firestore from '@react-native-firebase/firebase'
import Storage from '@react-native-firebase/storage';
import * as FileSystem from 'expo-file-system/legacy';
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
    Alert,
    Linking,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View
} from "react-native";
;


export default function BookCareElement() {
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [emergency, setEmergency] = useState("");
    const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
    const [userAddress, setUserAddress] = useState<string | undefined>(undefined);
    // BackHandler.addEventListener('hardwareBackPress',()=>{
    //     return false;
    //   });

    
    const fileName = `ticket_${Date.now()}.jpg`;
    const storageRef = Storage().ref(`care2home/images/${fileName}`);
    const ChooseImageFromDevice = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
        if (!permission.granted) {
          Alert.alert("Permission required", "Please allow photo access");
          return;
        }
      
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          quality: 1,
        });
      
        if (result.canceled) {
          Alert.alert("No image selected");
          return;
        }
      
        try {
          const asset = result.assets[0];      
          setSelectedImage(asset.uri);
        } catch (error) {
          console.error(error);
          Alert.alert("Upload failed", "Please try again");
        }
      };
      

    const sendToWhatsApp =async () => {
        if (!selectedImage || !phone || !emergency || !userAddress) {
            Alert.alert("Missing info", "Please fill all required fields");
            return;
        }
        const fileName = `ticket_${Date.now()}.jpg`;
    //   const responseess=  await Storage()
    //     .ref(`care2home/images/${fileName}`)
    //     .putFile(selectedImage);
console.log("AAAAAAAAAAAAAAAAAAA",{
    phone: phone,
    emergency: emergency,
    userAddress: userAddress,
    selectedImage: selectedImage,
})

try {
    const docRef = await firestore()
      .collection('orders')
      .add({
        phone,
        emergency,
        userAddress,
        selectedImage,
      });

    console.log('🔥 DOC ID:', docRef.id);
    Alert.alert('Order placed', docRef.id);
  } catch (error) {
    console.error('Firestore error:', error);
    Alert.alert('Order Error');
  }
// const docRef = await firestore()
// .collection('orders')
// .add({
//   phone,
//   emergency,
//   userAddress,
//   selectedImage,
// });

// setPhone('');
// setEmail('');
// setUserAddress('');
// setSelectedImage('');
// setEmergency('');
    //     const message = `
    // 📌 *Care2Home Booking Request*
    
    // 📞 Phone: ${phone}
    // 🚨 Emergency Contact: ${emergency}
    // 📍 Address: ${userAddress}
    
    // 🖼️ Ticket Image: Uploaded (will send manually)
    
    // Please confirm the booking.
    // `;

    //     const whatsappNumber = "919910646415"; // Care2Home number (no +)

    //     const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    //         message
    //     )}`;

    //     Linking.openURL(url);
    };


    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>
                <Text style={styles.title}>Book Travel Care Companion Service</Text>

                <Text style={styles.meta}>
                    Available 24/7 • Airport, Railway & Bus Stand pickups • Delhi NCR
                </Text>

                <Text style={styles.desc}>
                    Share your parent&apos;s travel details and we&apos;ll take care of the rest.
                </Text>
            </View>

            {/* FORM CARD */}
            <View style={styles.card}>
                {/* Parent Info */}
                <Text style={styles.sectionTitle}>Parent&apos;s Information</Text>

                <Label text="Upload ticket image" />

                <Pressable style={styles.uploadBox} onPress={ChooseImageFromDevice}>
                    {selectedImage ? (
                        <View style={styles.previewWrapper}>
                            <Image
                                source={{ uri: selectedImage }}
                                style={styles.previewImage}
                                resizeMode="cover"
                            />
                            <Text style={styles.changeText}>Tap to change image</Text>
                        </View>
                    ) : (
                        <Text style={styles.uploadPlaceholder}>
                            Tap to upload ticket image
                        </Text>
                    )}
                </Pressable>
                <Label text="Address" />

                <TextInput
                    style={styles.addressInput}
                    placeholder="Enter complete pickup/drop address"
                    multiline
                    textAlignVertical="top"
                    value={userAddress}
                    onChangeText={setUserAddress}
                />
                {/* Contact Info */}
                <Text style={styles.sectionTitle}>Contact Information</Text>

                <Label text="Your Phone Number" />
                <TextInput
                    style={styles.input}
                    placeholder="For booking confirmation and updates"
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                />

                <Label text="Your Email (Optional)" />
                <TextInput
                    style={styles.input}
                    placeholder="For booking confirmation"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                />

                <Label text="Emergency Contact" />
                <TextInput
                    style={styles.input}
                    placeholder="Alternate contact number"
                    keyboardType="phone-pad"
                    value={emergency}
                    onChangeText={setEmergency}
                />

                {/* INFO BOX */}
                <View style={styles.infoBox}>
                    <Text style={styles.infoSmall}>
                        All Care Companions are background-verified and trained to assist
                        elderly parents
                    </Text>

                    <Text style={styles.infoNote}>
                        <Text style={{ fontWeight: "700" }}>Note:</Text> This is a booking
                        request. Our team will call you within 2 hours to confirm details and
                        payment. No payment is required now.
                    </Text>
                </View>

                {/* SUBMIT */}
                <Pressable style={styles.submitBtn} onPress={sendToWhatsApp}>
                    <Text style={styles.submitText}>
                        Submit Request • We’ll Call You
                    </Text>
                </Pressable>
            </View>
        </ScrollView>
    );
}

/* ---------- HELPERS ---------- */

function Label({ text }: { text: string }) {
    return <Text style={styles.label}>{text}</Text>;
}

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
    container: {
        paddingVertical: 24,
        paddingHorizontal: 16,
        backgroundColor: "#EFF6FF", // blue-50
    },

    header: {
        alignItems: "center",
        marginBottom: 22,
    },

    title: {
        fontSize: 26,
        fontWeight: "700",
        color: "#111827",
        marginBottom: 12,
    },

    meta: {
        fontSize: 12,
        color: "#6B7280",
        textAlign: "center",
        marginBottom: 12,
    },

    desc: {
        fontSize: 16,
        color: "#4B5563",
        textAlign: "center",
    },

    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#111827",
        marginVertical: 14,
    },

    label: {
        fontSize: 13,
        fontWeight: "500",
        color: "#374151",
        marginBottom: 6,
    },

    input: {
        borderWidth: 1,
        borderColor: "#D1D5DB",
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 15,
        color: "#111827",
        marginBottom: 14,
    },

    infoBox: {
        backgroundColor: "#DBEAFE",
        borderRadius: 12,
        padding: 14,
        marginVertical: 16,
    },

    infoSmall: {
        fontSize: 12,
        color: "#4B5563",
        textAlign: "center",
        marginBottom: 6,
    },

    infoNote: {
        fontSize: 14,
        color: "#1E3A8A",
    },

    submitBtn: {
        backgroundColor: "#2563EB",
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: "center",
    },

    submitText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
    },

    footer: {
        fontSize: 12,
        color: "#4B5563",
        textAlign: "center",
        marginTop: 20,
    },

    link: {
        textDecorationLine: "underline",
        fontWeight: "600",
    },
    addressInput: {
        borderWidth: 1,
        borderColor: "#D1D5DB",
        borderRadius: 14,
        padding: 14,
        height: 120,
        fontSize: 15,
        color: "#111827",
        backgroundColor: "#F9FAFB",
        marginBottom: 16,
    },
    uploadBox: {
        borderWidth: 1,
        borderStyle: "dashed",
        borderColor: "#93C5FD",
        borderRadius: 16,
        padding: 14,
        backgroundColor: "#EFF6FF",
        marginBottom: 18,
    },

    previewWrapper: {
        alignItems: "center",
    },

    previewImage: {
        width: "100%",
        height: 160,
        borderRadius: 12,
        marginBottom: 8,
    },

    uploadPlaceholder: {
        textAlign: "center",
        color: "#2563EB",
        fontSize: 14,
        fontWeight: "600",
        paddingVertical: 24,
    },

    changeText: {
        fontSize: 12,
        color: "#2563EB",
        textAlign: "center",
        marginTop: 4,
    },


});
