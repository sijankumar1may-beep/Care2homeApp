import { AuthContext } from '@/auth/AuthContext';
import firestore from '@react-native-firebase/firestore';
import { Image } from 'expo-image';
import * as ImagePicker from "expo-image-picker";
import { router } from 'expo-router';
import { useContext, useState } from 'react';
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';



export default function EditProfileScreen() {
    const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
    const Auth = useContext(AuthContext);
    if (!Auth) return null;

    const user = Auth.user;
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


    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');

    const handleSave = () => {
        // 🔹 Later: update Firestore / backend here
        if (email == '' || address == '') {
            Alert.alert("Dear user", "Phone and Addrees can not empty");
            return;
        }
        firestore().collection('Profiles').add({ phone: user?.phoneNumber, address, email: user.email, role: 'Customer' }).then(() => {
            Alert.alert("Dear user", "Your profile changes has been saved", [{ text: 'Ok', onPress: () => { router.back() } }]);

        }).catch((error) => {
            Alert.alert("Dear user", "Currently there are some issues, please try later");
        });


    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Edit Profile</Text>
                <Text style={styles.subTitle}>Update your details and profile photo</Text>

                {/* Upload Profile Image */}
                <Label text="Upload profile image" />
                <Pressable style={styles.avatarPressable} onPress={ChooseImageFromDevice}>
                    <View style={styles.avatarWrap}>
                        {selectedImage ? (
                            <Image
                                source={{ uri: selectedImage }}
                                style={styles.avatarImage}
                                contentFit="cover"
                            />
                        ) : (
                            <View style={styles.avatarPlaceholder}>
                                <Text style={styles.avatarPlaceholderText}>
                                    {(user?.phoneNumber?.replace('+', '').slice(-2) || 'U').toUpperCase()}
                                </Text>
                            </View>
                        )}

                        {/* Always-visible edit badge */}
                        <View style={styles.editBadge}>
                            <Text style={styles.editBadgeText}>Edit</Text>
                        </View>
                    </View>
                    <Text style={styles.avatarHint}>Tap the photo to upload/change</Text>
                </Pressable>

                {/* Email (readonly) */}
                {/* <Label text="Phone" />
                <ReadOnlyField value={user.phoneNumber} /> */}

                {/* Phone */}
                <Label text="Enter email" />
                <TextInput
                    onChangeText={setEmail}
                    keyboardType='email-address'
                    style={inputStyle}
                    placeholder='Enter your email'
                />

                {/* Address */}
                <Label text="Enter address" />
                <TextInput
                    value={address}
                    onChangeText={setAddress}
                    multiline
                    style={[inputStyle, { height: 80 }]}
                />

                {/* Role (readonly) */}
                {/* <Label text="Role" />
                <ReadOnlyField value="Customer" /> */}

                {/* SAVE BUTTON */}
                <Pressable
                    onPress={handleSave}
                    style={{
                        marginTop: 30,
                        backgroundColor: '#364153',
                        paddingVertical: 14,
                        borderRadius: 10,
                        alignItems: 'center',
                    }}
                >
                    <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
                        Save Changes
                    </Text>
                </Pressable>
            </View>
        </ScrollView>
    );
}

/* ---------- Helpers ---------- */

function Label({ text }: { text: string }) {
    return (
        <Text
            style={{
                color: '#64748B',
                fontSize: 13,
                marginBottom: 6,
                marginTop: 14,
            }}
        >
            {text}
        </Text>
    );
}

function ReadOnlyField({ value }: { value: string }) {
    return (
        <View
            style={{
                backgroundColor: '#E5E7EB',
                padding: 14,
                borderRadius: 10,
            }}
        >
            <Text style={{ color: '#374151' }}>{value}</Text>
        </View>
    );
}

const inputStyle = {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#D1D5DB",

};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        paddingTop: 20,
        backgroundColor: '#F5F6FA',
        flexGrow: 1,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 6,
        textAlign: 'center',
    },
    subTitle: {
        fontSize: 12,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 14,
    },
    avatarPressable: {
        alignItems: 'center',
        marginBottom: 6,
    },
    avatarWrap: {
        width: 124,
        height: 124,
        borderRadius: 62,
        borderWidth: 2,
        borderColor: '#BFDBFE',
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        position: 'relative',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
        borderRadius: 62,
        backgroundColor: '#DBEAFE',
    },
    avatarPlaceholder: {
        width: '100%',
        height: '100%',
        borderRadius: 62,
        backgroundColor: '#DBEAFE',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarPlaceholderText: {
        color: '#1E3A8A',
        fontSize: 34,
        fontWeight: '800',
    },
    editBadge: {
        position: 'absolute',
        right: 6,
        bottom: 6,
        backgroundColor: '#2563EB',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    editBadgeText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '700',
    },
    avatarHint: {
        marginTop: 10,
        marginBottom: 4,
        fontSize: 12,
        color: '#2563EB',
        fontWeight: '600',
        textAlign: 'center',
    },
    changeText: {
        fontSize: 12,
        color: '#2563EB',
        textAlign: 'center',
        fontWeight: '600',
    },
});
