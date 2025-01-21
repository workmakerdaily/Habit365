import React, { useContext } from "react";
import { ThemeContext } from "styled-components/native";
import { createStackNavigator } from '@react-navigation/stack';
import { Login, Signup } from "../screens";

// variable: 스택 네비게이션 //
const Stack = createStackNavigator();

// component: AuthStack 함수 //
const AuthStack = () => {

    // context: 테마 컨텍스트 //
    const theme = useContext(ThemeContext);

    // render: AuthStack 네비게이션 렌더링 //
    return (
        <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
                headerTitleAlign: 'center',
                cardStyle: { backgroundColor: theme.background },
                headerTintColor: theme.headerTintColor,
            }}
        >
            <Stack.Screen name="Login"
                component={Login}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Signup"
                component={Signup}
                options={{
                    headerBackTitle: '',
                    headerBackTitleVisible: false,
                }}
            />
        </Stack.Navigator>
    );
};

export default AuthStack;