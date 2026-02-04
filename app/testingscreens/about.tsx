import { useEffect, useState } from 'react';
import { Alert, Button, Linking, PermissionsAndroid, Text, View } from 'react-native';

const AppURL=`whatsapp://send?phone=919910646415`;
const AboutScreen = () => {
    const [URL,setURL]=useState('');

    useEffect(()=>{
        const getLink=async ()=>{
            const url=await Linking.getInitialURL()||'';
            setURL(url);
            console.log(url);
        }
        getLink();
    },[URL])
    const getCameraPermission=async ()=>{
     const permissionGranted=await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
        title:"Please allow us for Camera Access",
        message:"we need access of Camera",
        buttonNeutral:"Ask me later",
        buttonPositive:"Allowed",
        buttonNegative:"Not Allowed"
    });

    if(permissionGranted===PermissionsAndroid.RESULTS.GRANTED){
        Alert.alert("Permission is granted")
    }else{
        Alert.alert("Permission is not granted");
    }
}
    return <View>
        <Text style={{ color: "green", margin: 100 }}>Welcome to the about screen</Text>
        <Button title="Request Camera Permission" onPress={getCameraPermission}/>
        <Button title="Open URL" onPress={async ()=>{
            const supported=await Linking.canOpenURL(AppURL);
            if(supported){
            Linking.openURL(AppURL);
            }else{
                Alert.alert("Sorry","You do not have any app to open this URL on your device");
            }
        }}/>
          <Button title="Open Settings" onPress={async ()=>{
            Linking.openSettings()
        }}/>
        <Text>Initial URL is :{URL}</Text>

        <Button title="Pay 1 rupee" onPress={async ()=>{ 
           // await Linking.sendIntent('android.settings.WIFI_SETTINGS')
           const upiUrl =
           'upi://pay?' +
           'pa=8507064152@ybl&' +      // Payee VPA
           'pn=Sumitkumar&' +      // Payee name
           'am=1&' +               // Amount
           'cu=INR&'+
           'tn=thank you';             // Transaction note
       
          Linking.openURL(upiUrl);
            }}/>
    </View>
}
export default AboutScreen;