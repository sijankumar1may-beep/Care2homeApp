import { MaterialIcons } from '@expo/vector-icons';
import { PropsWithChildren } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
const EmojiPicker = ({ onPress, isVisible, children }: PropsWithChildren<{ onPress: () => void, isVisible: boolean }>) => {

    return <View style={{position:'relative'}}>
        <Modal visible={isVisible} transparent={true} animationType='slide'>
            <View style={{height:'25%',width:'100%',position:'absolute',bottom:100,borderWidth:2}}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{color:'black',fontSize:24}}>Choose a Sticker</Text>
                    <Pressable onPress={onPress}>
                        <MaterialIcons name='close' color='#000' size={24} />
                    </Pressable>
                </View>
                {children}
            </View>
        </Modal>
    </View>
}

export default EmojiPicker;