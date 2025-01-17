import React, { useEffect } from "react";
import { theme } from "./theme";
import { StatusBar } from 'react-native';
import { ThemeProvider } from 'styled-components/native';
import Navigation from "./navigations";
import { ProgressProvider, UserProvider } from "./contexts";
import { requestNotificationPermissions } from "./utils/Notification";


const App = () => {

    useEffect(() => {
        requestNotificationPermissions();
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <UserProvider>
                <ProgressProvider>
                    <StatusBar barStyle="dark-content" />
                    <Navigation />
                </ProgressProvider>
            </UserProvider>
        </ThemeProvider >
    );
};

export default App;