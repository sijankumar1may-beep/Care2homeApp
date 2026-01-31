
import { Image } from 'expo-image';
type Props={
    source:string;
}
const CustomImage = (props:Props) => {


    return <Image source={props.source} style={{ width: 350, height: 300, borderRadius: 10 }} contentFit='contain' />
}

export default CustomImage;