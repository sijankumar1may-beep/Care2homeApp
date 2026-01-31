
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Pressable, Text, View } from 'react-native';
type Props = {
    label: string,
    icon: keyof typeof MaterialIcons.glyphMap,
    onPress: () => void;
}
const IconButton = ({ label, icon, onPress }: Props) => {
    return <View>
        <Pressable onPress={onPress}>
            <MaterialIcons name={icon || 'add'} size={24}/>
            <Text>{label}</Text>
        </Pressable>
    </View>
}

export default IconButton;