import { Image } from "expo-image";
import { FlatList, ImageSourcePropType, Pressable, View } from "react-native";


const EmojiList = ({ onSelectEmoji, closeModal }:{onSelectEmoji:(image:ImageSourcePropType)=>void,closeModal:()=>void}) => {

    const emoji = [require("@/assets/images/emoji1.png"),
    require("@/assets/images/emoji2.png"),
    require("@/assets/images/emoji3.png"),
    require("@/assets/images/emoji4.png"),
    require("@/assets/images/emoji5.png"),
    require("@/assets/images/emoji6.png")];
    return <FlatList
        showsHorizontalScrollIndicator
        data={emoji}
        horizontal
        renderItem={({ item, index }) => {
            return <Pressable onPress={() => {
                closeModal()
                onSelectEmoji(item)
            }}><View><Image source={item} key={index} style={{ width: 200, height: 100, borderColor: 'red' }} />
            </View></Pressable>
        }}
    />
}

export default EmojiList;