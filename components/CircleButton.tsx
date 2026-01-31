
import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, View } from 'react-native';
const CircleButton = ({ onPress }: { onPress: () => void }) => {


    return <View style={{ borderRadius: '100%', justifyContent: 'center', alignItems: 'center' }}>
        <Pressable onPress={onPress} style={{ backgroundColor: 'black', borderWidth: 2, borderRadius: '100%' }}>
            <MaterialIcons name="add" size={38} color='#fff' style={{ borderColor: 'yellow', borderWidth: 2, borderRadius: '100%' }} />
        </Pressable>
    </View>
}

export default CircleButton;