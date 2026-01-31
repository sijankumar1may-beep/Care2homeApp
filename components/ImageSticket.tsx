import { Image, } from "expo-image";
import { ImageSourcePropType, View } from "react-native";
const ImageSticker=({size,image}:{size:number,image:ImageSourcePropType|undefined})=>{


    return <View style={{top:-350,left:150}}><Image source={image} style={{width:size,height:size}}/></View>
}

export default ImageSticker;