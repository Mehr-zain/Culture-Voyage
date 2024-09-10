import { createContext, useState, useEffect } from "react";
import { auth } from '../firebase/Firebase';
import { onAuthStateChanged } from "firebase/auth";
const UserContext = createContext(null);


// eslint-disable-next-line react/prop-types
const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Load user data from localStorage on initial render
        const storedUser = localStorage.getItem('user');
        if (storedUser != null) {
            setUser({ ...JSON.parse(storedUser) });
        }
        const unsubscribe = onAuthStateChanged(auth, (authUser) => {

            if (authUser) {
                console.log('user found');
                setUser(authUser);
                // Save user data to localStorage
                localStorage.setItem('user', JSON.stringify(authUser));
            } else {
                console.log('no user found');
                setUser(null);
                // Remove user data from localStorage on sign out
                localStorage.removeItem('user');
            }
            // Set loading state to false once user data is loaded
            setIsLoading(false);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, isLoading }}>
            {children}
        </UserContext.Provider>
    );
};

export { AuthProvider, UserContext };
