import { getAuth, onAuthStateChanged } from '@react-native-firebase/auth';
import { createContext, useEffect, useState } from "react";

interface AuthContextType {
    user: any;
    loading: boolean;
    setUser?:(a:any)=>void;
    setLoading?:(b:boolean)=>void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider = ({ children }: any) => {
    const [user, setUser] = useState<any>();
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {

        const unsubscribe = onAuthStateChanged(getAuth(), (u) => {

            setUser(u);
            setLoading(false);

        });

        return () => {

            unsubscribe();
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading,setUser,setLoading }}>
            {children}
        </AuthContext.Provider>
    );
};
