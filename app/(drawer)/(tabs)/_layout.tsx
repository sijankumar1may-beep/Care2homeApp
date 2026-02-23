import { Ionicons } from '@expo/vector-icons';
import { useDrawerStatus } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { Tabs, useRouter } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Alert, Linking, Pressable, View } from 'react-native';
import { Menu, Provider } from 'react-native-paper';
const TabLayout = () => {
    const navigation = useNavigation();
    const drawerStatus = useDrawerStatus();
    const router = useRouter();
    const [visible, setVisible] = useState(false);
    return <>
        <StatusBar
            style={drawerStatus === 'open' ? 'dark' : 'light'}
            translucent={false}
            backgroundColor="#000" // IMPORTANT
        />
        <Provider ><Tabs
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
                    return (
                        <View style={{ flexDirection: 'row' }}>
                            <Pressable
                                onPress={() => { (navigation as any).openDrawer() }}
                                style={({ pressed }) => [
                                    {
                                        marginHorizontal: 10,
                                        padding: 6,
                                        borderRadius: 20,
                                        backgroundColor: pressed ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                                        opacity: pressed ? 0.8 : 1,
                                        transform: [{ scale: pressed ? 0.95 : 1 }],
                                    }
                                ]}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                                <Ionicons name="person-circle-sharp" size={35} color="#fff" />
                            </Pressable>
                        </View>
                    );
                },
                headerRight: () => {
                    return (
                        <View style={{ flexDirection: 'row' }}>
                            <Pressable
                                onPress={() =>
                                    Alert.alert(
                                        'Need help with booking?',
                                        'Please call us',
                                        [{
                                            text: "Call us", onPress: () => {
                                                Linking.openURL("tel:+919910646415")
                                            }, style: 'default'
                                        }, {
                                            text: "No", onPress: () => {

                                            }, style: 'cancel'
                                        }]
                                    )
                                }
                                style={({ pressed }) => [
                                    {
                                        marginHorizontal: 10,
                                        padding: 6,
                                        borderRadius: 20,
                                       
                                        opacity: pressed ? 0.8 : 1,
                                        transform: [{ scale: pressed ? 0.95 : 1 }],
                                    }
                                ]}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                                <Ionicons name="help-circle-outline" size={26} color="#fff" />
                            </Pressable>
                            <Menu
                                visible={visible}
                                onDismiss={() => setVisible(false)}
                                contentStyle={{backgroundColor: "#fff"}}
                                anchor={
                                    <Pressable
                                        onPress={() => setVisible(true)}
                                        style={({ pressed }) => [
                                            {
                                                marginHorizontal: 10,
                                                padding: 6,
                                                borderRadius: 20,
                                                opacity: pressed ? 0.8 : 1,
                                                transform: [{ scale: pressed ? 0.95 : 1 }],
                                            }
                                        ]}
                                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                    >
                                        <Ionicons name="ellipsis-vertical" size={25} color="#fff" />
                                    </Pressable>
                                }
                            >
                                <Menu.Item 
                                    onPress={() => {
                                        router.push('/contact')
                                        setVisible(false)
                                    }} 
                                    title="Contact us"
                                    titleStyle={{ color: "#000" }}
                                />
                                <Menu.Item 
                                    onPress={() => {
                                        router.push('/about')
                                        setVisible(false)
                                    }} 
                                    title="Who we are"
                                    titleStyle={{ color: "#000" }}
                                />
                            </Menu>
                            
                        </View>
                    );
                }

            }}
        >
            <Tabs.Screen name="index" options={{
                tabBarLabel: 'Home',
                headerTitle: "Care2home", tabBarIcon: (props) => {
                    return <Ionicons name={props.focused ? "home-sharp" : "home-outline"} color={props.color} size={24} />
                },
            }} />
            <Tabs.Screen name="pricing" options={{
                tabBarLabel: 'Pricing',
                headerTitle: "Pricing", tabBarIcon: (props) => {
                    return <Ionicons name={props.focused ? 'pricetag-sharp' : 'pricetag-outline'} color={props.color} size={24} />
                },
            }}
            />
            <Tabs.Screen name="servicelocations" options={{
                tabBarLabel: 'Serving',
                headerTitle: "Service Locations",
                tabBarIcon: (props) => {
                    return <Ionicons name={props.focused ? 'location-sharp' : 'location-outline'} color={props.color} size={24} />
                },
            }} />
            <Tabs.Screen name="bookservice" options={{
                tabBarLabel: 'BookService',
                headerTitle: "Book service", tabBarIcon: (props) => {
                    return <Ionicons name={props.focused ? 'calendar-number' : 'calendar-number-outline'} color={props.color} size={24} />
                },
            }}
            />
        </Tabs >
        </Provider>
    </>
}

export default TabLayout;