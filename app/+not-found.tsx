import { Stack } from 'expo-router';
import { Text, View } from 'react-native';
const NotFoundScreen=()=>{


    return <View>
        <Stack.Screen options={{headerTitle:"Opps 404",headerTintColor:"green"}}/>
    <Text >This page does not exist</Text>
    </View>
}

export default NotFoundScreen;