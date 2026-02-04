import { Ionicons } from '@expo/vector-icons';
import { useDrawerStatus } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { Tabs } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { Pressable, View } from 'react-native';
const TabLayout = () => {
    const navigation = useNavigation();
    const drawerStatus = useDrawerStatus();

    return <>
        <StatusBar
            style={drawerStatus === 'open' ? 'dark' : 'light'}
            translucent={false}
            backgroundColor="#000" // IMPORTANT
        /><Tabs
            screenOptions={{
                headerStyle: {
                    backgroundColor: "#364153"
                },
                headerTintColor: "white",
                tabBarStyle: {
                    backgroundColor: "#364153"
                },
                
                tabBarActiveTintColor: "white",
                headerLeft: () => {
                    return <View style={{ flexDirection: 'row' }}>
                        <Pressable onPress={() => { (navigation as any).openDrawer() }} style={{ marginHorizontal: 10 }} >
                            <Ionicons name="person-circle-sharp" size={35} color="#fff" />
                        </Pressable></View>
                },

            }}
        >
            <Tabs.Screen name="index" options={{
                tabBarLabel:'Home',
                headerTitle: "Care2home", tabBarIcon: (props) => {
                    return <Ionicons name={props.focused ? "home-sharp" : "home-outline"} color={props.color} size={24} />
                },
            }} />
            <Tabs.Screen name="pricing" options={{
                 tabBarLabel:'Pricing',
                headerTitle: "Pricing", tabBarIcon: (props) => {
                    return <Ionicons name={props.focused ? 'pricetag-sharp' : 'pricetag-outline'} color={props.color} size={24} />
                },
            }}
            />
            <Tabs.Screen name="servicelocations" options={{
                 tabBarLabel:'Serving',
                headerTitle: "Service Locations",
                tabBarIcon: (props) => {
                    return <Ionicons name={props.focused ? 'location-sharp' : 'location-outline'} color={props.color} size={24} />
                },
            }} />
            <Tabs.Screen name="bookservice" options={{
                 tabBarLabel:'BookService',
                headerTitle: "Book service", tabBarIcon: (props) => {
                    return <Ionicons name={props.focused ? 'calendar-number' : 'calendar-number-outline'} color={props.color} size={24} />
                },
            }}
            />
        </Tabs >
    </>
}

export default TabLayout;