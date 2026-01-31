import CustomButton from '@/components/Button';
import CircleButton from '@/components/CircleButton';
import EmojiList from '@/components/EmojiList';
import EmojiPicker from '@/components/EmojiPicker';
import IconButton from '@/components/IconButton';
import CustomImage from '@/components/Image';
import ImageSticker from '@/components/ImageSticket';
import { launchImageLibraryAsync } from 'expo-image-picker';
import { useState } from 'react';
import { ImageSourcePropType, Text, View } from 'react-native';
const imageSource = require("@/assets/images/icon.png");
const BookingService = () => {
    const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
    const [showAppOptions, setShowAppOptions] = useState<boolean>(false);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [selectEmoji,setSelectEmoji]=useState<ImageSourcePropType|undefined>(undefined);
    const ChooseImageFromDevice = async () => {
        const result = await launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 1,
            allowsMultipleSelection: true
        })
        if (!result.canceled) {
            console.log("cc", result);
            setSelectedImage(result.assets[0].uri);
            setShowAppOptions(true);
        } else {
            alert("You did not select any image");
        }
    }

    const Reset = () => {

        alert("reset button is clicked");
    }

    const SaveImage = () => {

        alert("Save button is clicked");
    }

    const OnCloseModal=()=>{

        setIsModalVisible(false);
    }
    return <View>
        <Text>Booking Service</Text>
        <Text>Please upload ticket image</Text>
        {<CustomImage source={selectedImage || imageSource} />}
        <CustomButton label='Choose ticket image' onPress={ChooseImageFromDevice} />
        <EmojiPicker onPress={OnCloseModal} isVisible={isModalVisible} >
            <EmojiList onSelectEmoji={setSelectEmoji} closeModal={OnCloseModal}/>
        </EmojiPicker>
        {selectEmoji &&<ImageSticker image={selectEmoji} size={50}/>}
        {showAppOptions ? <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', }} >
            <IconButton label='Reset' icon='refresh' onPress={Reset} />
            <CircleButton onPress={()=>{setIsModalVisible(true)}}/>
            <IconButton label='Save' icon='save-alt' onPress={SaveImage} /></View> : <CustomButton label='Choose the default image' onPress={()=>{setShowAppOptions(true)}} />}
    </View>
}

export default BookingService;