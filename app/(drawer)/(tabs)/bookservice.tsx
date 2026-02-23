import { AuthContext } from '@/auth/AuthContext';
import firestore from '@react-native-firebase/firestore';
import Storage from '@react-native-firebase/storage';
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { Accuracy, getCurrentPositionAsync, LocationGeocodedAddress, LocationPermissionResponse, requestForegroundPermissionsAsync, reverseGeocodeAsync } from 'expo-location';
import React, { useContext, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';
;

export default function BookCareElement() {
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [emergency, setEmergency] = useState("");
    const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
    const [userAddress, setUserAddress] = useState<string | undefined>(undefined);
    const [isDataSaving, setIsDataSaving] = useState(false);
    const [isFetchingAddress, setIsFetchingAddress] = useState(false);
    const auth = useContext(AuthContext);
    const loggedUser = auth?.user;
    const fileName = `ticket_${Date.now()}.jpg`;
    const storageRef = Storage().ref(`care2home/images/${fileName}`);
    const [location, setLocation] = useState<any>(null);
    const [currentAddress, setCurrentAddress] = useState<LocationGeocodedAddress>();
    const ChooseImageFromDevice = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permission.granted) {
            Alert.alert("Permission required", "Please allow photo access");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: false,
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


    const sendToWhatsApp = async () => {

        try {

            setIsDataSaving(true)

            if (!selectedImage || !phone || !userAddress) {
                setIsDataSaving(false)
                Alert.alert("Missing info", "Please fill all required fields");
                return;
            }
            if (phone.length < 10) {
                setIsDataSaving(false)
                Alert.alert("Missing info", "Please enter correct phone number");
                return;
            }



            const fileName = `ticket_${Date.now()}.jpg`;
            const refStorage = await Storage()
                .ref(`care2home/images/${fileName}`);

            const responseess = await refStorage.putFile(selectedImage);

            const getDownloadUrl = await refStorage.getDownloadURL();


            const addPromise = firestore().collection('Orders').add({
                phone,
                userAddress,
                email,
                "loggedUserId": loggedUser.phoneNumber,
                ImageUrl: getDownloadUrl || ''
            }).then(() => {
                console.log("user added")
                setIsDataSaving(false);
                Alert.alert("Hi Sir", 'Your request has been submitted. Our team will be connecting within 1 hour.')
            }).catch((error) => {
                setIsDataSaving(false)
                Alert.alert("Hi", "Some error has happened, please try later or contact team via whatsapp")
                console.log(error);
            });

            console.log("📝 Add promise created, awaiting...");
            console.log("addPromiseaddPromise", addPromise)

            setPhone('');
            setEmail('');
            setUserAddress('');
            setSelectedImage('');
            setEmergency('');

        } catch (error: any) {
            setIsDataSaving(false);
            console.error('🚨 CATCH BLOCK - Firestore error:', error);
            console.error('🚨 Error type:', typeof error);
            console.error('🚨 Error code:', error?.code);
            console.error('🚨 Error message:', error?.message);
            console.error('🚨 Full error:', JSON.stringify(error, null, 2));
            Alert.alert(
                'Order Error',
                `Code: ${error?.code || 'unknown'}\nMessage: ${error?.message || String(error)}`
            );
        }
    };

    const getCurrentLocation = async () => {
        const request: LocationPermissionResponse = await requestForegroundPermissionsAsync();
        if (request.status != "granted") {
            alert("Permission denied");
            return;
        }

        const currentPosition = await getCurrentPositionAsync({
            accuracy: Accuracy.High,
        })

        setLocation(currentPosition.coords);
        // Wait for reverse geocoding to finish before setting the address
        try {
            const currentAddressArray = await reverseGeocodeAsync(currentPosition.coords);
            if (currentAddressArray && currentAddressArray[0]) {
                setCurrentAddress(currentAddressArray[0]);
            }
        } catch (err) {
            console.warn("Failed to reverse geocode location", err);
        }
    }

    const formatGeocodedAddress = (addr?: LocationGeocodedAddress) => {
        if (!addr) return "";
        const parts = [
            addr.name,
            addr.street,
            addr.district,
            addr.city,
            addr.region,
            addr.postalCode,
            addr.country,
        ].filter(Boolean);
        // Remove duplicates while preserving order
        return Array.from(new Set(parts)).join(", ");
    };

    // Intentionally spelled to match the request ("getCurrrentAddress")
    const getCurrrentAddress = async () => {
        try {
            setIsFetchingAddress(true);
            const request: LocationPermissionResponse = await requestForegroundPermissionsAsync();
            if (request.status !== "granted") {
                Alert.alert("Permission required", "Please allow location access to autofill your address.");
                return;
            }

            const currentPosition = await getCurrentPositionAsync({
                accuracy: Accuracy.High,
            });

            setLocation(currentPosition.coords);

            const currentAddressArray = await reverseGeocodeAsync(currentPosition.coords);
            const addr = currentAddressArray?.[0];
            if (!addr) {
                Alert.alert("Address not found", "Couldn't detect your address. Please type it manually.");
                return;
            }

            setCurrentAddress(addr);
            const formatted = formatGeocodedAddress(addr);
            if (!formatted) {
                Alert.alert("Address not found", "Couldn't format your address. Please type it manually.");
                return;
            }

            setUserAddress(formatted);
        } catch (err) {
            console.warn("Failed to fetch current address", err);
            Alert.alert("Error", "Couldn't fetch your current address. Please try again.");
        } finally {
            setIsFetchingAddress(false);
        }
    };

    useEffect(() => {
        getCurrentLocation();
    }, []);

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
                <Label text="Enter complete pickup/drop address" />

                <Pressable
                    style={[styles.useLocationBtn, isFetchingAddress && styles.useLocationBtnDisabled]}
                    onPress={getCurrrentAddress}
                    disabled={isFetchingAddress}
                >
                    {isFetchingAddress ? (
                        <View style={styles.useLocationBtnInner}>
                            <ActivityIndicator size="small" color="#2563EB" style={{ marginRight: 8 }} />
                            <Text style={styles.useLocationBtnText}>Fetching address…</Text>
                        </View>
                    ) : (
                        <Text style={styles.useLocationBtnText}>Use current location</Text>
                    )}
                </Pressable>

                <TextInput
                    style={styles.addressInput}
                    placeholder="Enter complete pickup/drop address"
                    multiline

                    textAlignVertical="top"
                    value={userAddress}
                    onChangeText={setUserAddress}
                />


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

                <Pressable style={styles.submitBtn} onPress={sendToWhatsApp} disabled={isDataSaving}>
                    {isDataSaving ? (
                        <View style={styles.loadingContainer}>
                            <Text style={styles.submitText}>
                                Sending your requests
                            </Text>
                            <ActivityIndicator size='small' color="#fff" style={styles.loader} />
                        </View>
                    ) : (
                        <Text style={styles.submitText}>
                            Submit Request • We'll Call You
                        </Text>
                    )}
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

    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },

    loader: {
        marginLeft: 8,
    },

    useLocationBtn: {
        alignSelf: "flex-start",
        borderWidth: 1,
        borderColor: "#BFDBFE",
        backgroundColor: "#EFF6FF",
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 999,
        marginBottom: 10,
    },
    useLocationBtnDisabled: {
        opacity: 0.7,
    },
    useLocationBtnInner: {
        flexDirection: "row",
        alignItems: "center",
    },
    useLocationBtnText: {
        color: "#2563EB",
        fontSize: 13,
        fontWeight: "600",
    },

});
