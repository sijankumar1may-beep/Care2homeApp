import { Drawer } from 'expo-router/drawer';

import { StatusBar } from 'expo-status-bar';
import CustomDrawerContent from '../../components/customdrawercontent';
export default function DrawerLayout() {

    return (
        <>
            <StatusBar
                style="dark"
                translucent={false}
                backgroundColor="#000"
            />
            <Drawer
                drawerContent={(props) => <CustomDrawerContent {...props} />}
                screenOptions={{
                    headerShown: false,
                    drawerType: 'front',
                    headerStyle: {
                        backgroundColor: "#000"
                    },
                    drawerStyle: {
                        backgroundColor: '#fff',
                        width: '75%',
                    }

                }}
            >
            </Drawer>

        </>
    );
}
