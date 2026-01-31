import { Pressable, Text } from "react-native";

type Props = {
    label: string;
    onPress:()=>void;
}
const CustomButton = (props: Props) => {
    return <Pressable onPress={props.onPress}
        style={{ padding: 10, backgroundColor: "gray", margin: 10, borderRadius: 10, width: '90%' }}>
        <Text style={{ color: "white" }}>{props.label}</Text></Pressable>
}

export default CustomButton;