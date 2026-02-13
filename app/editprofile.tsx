import { AuthContext } from '@/auth/AuthContext';
import firestore from '@react-native-firebase/firestore';
import { router } from 'expo-router';
import { useContext, useState } from 'react';
import {
    Alert,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from 'react-native';
export default function EditProfileScreen() {
    const Auth = useContext(AuthContext);
    if (!Auth) return null;

    const user = Auth.user;

    const [phone, setPhone] = useState('+91 85070 64152');
    const [address, setAddress] = useState('Jaipur, Rajasthan');

    const handleSave = () => {
        // 🔹 Later: update Firestore / backend here
        if (phone == '' || address == '') {
            Alert.alert("Dear user", "Phone and Addrees can not empty");
            return;
        }
        firestore().collection('Profiles').add({ phone, address, email: user.email, role: 'Customer' }).then(() => {
            Alert.alert("Dear user", "Your profile changes has been saved",[{text:'Ok',onPress:()=>{router.back()}}]);
            
        }).catch((error) => {
            Alert.alert("Dear user", "Currently there are some issues, please try later");
        });

       
    };

    return (
        <ScrollView style={{ flex: 1, backgroundColor: '#F5F6FA' }}>
            {/* HEADER */}
            {/* FORM */}
            <View style={{ padding: 20 }}>
                {/* Email (readonly) */}
                <Label text="Email" />
                <ReadOnlyField value={user.email} />

                {/* Phone */}
                <Label text="Phone" />
                <TextInput
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    style={inputStyle}
                />

                {/* Address */}
                <Label text="Address" />
                <TextInput
                    value={address}
                    onChangeText={setAddress}
                    multiline
                    style={[inputStyle, { height: 80 }]}
                />

                {/* Role (readonly) */}
                <Label text="Role" />
                <ReadOnlyField value="Customer" />

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
};
