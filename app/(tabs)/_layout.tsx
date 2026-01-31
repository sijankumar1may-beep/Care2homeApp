import { Ionicons } from '@expo/vector-icons';
import { Tabs } from "expo-router";
import { StatusBar } from 'expo-status-bar';

const TabLayout = () => {

    return <> <StatusBar style='light'/><Tabs
        screenOptions={{
            headerStyle: {
                backgroundColor: "#364153"
            },
            headerTintColor: "white",
            tabBarStyle: {
                backgroundColor: "#364153"
            },
            tabBarActiveTintColor: "white"
        }}
    >
        <Tabs.Screen name="index" options={{
            headerTitle: "Care2home", tabBarIcon: (props) => {
                return <Ionicons name={props.focused ? "home-sharp" : "home-outline"} color={props.color} size={24} />
            },
        }} />
        <Tabs.Screen name="about" options={{
            headerTitle: "About us",
            tabBarIcon: (props) => {
                return <Ionicons name={props.focused ? "information-circle" : "information-circle-outline"} color={props.color} size={24} />
            },
        }} />
        <Tabs.Screen name="contact" options={{
            headerTitle: "Contact us",
            tabBarIcon: (props) => {
                return <Ionicons name={props.focused ? 'person-circle-sharp' : 'person-circle-outline'} color={props.color} size={24} />
            },
        }} />
        <Tabs.Screen name="pricing" options={{
            headerTitle: "Pricing", tabBarIcon: (props) => {
                return <Ionicons name={props.focused ? 'pricetag-sharp' : 'pricetag-outline'} color={props.color} size={24} />
            },
        }}
        />
        <Tabs.Screen name="booking" options={{
            headerTitle: "Book service", tabBarIcon: (props) => {
                return <Ionicons name={props.focused ? 'calendar-number' : 'calendar-number-outline'} color={props.color} size={24} />
            },
        }}
        />
    </Tabs >
    </>
}

export default TabLayout;