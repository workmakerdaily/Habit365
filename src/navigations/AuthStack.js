import React, { useContext } from "react";
import { ThemeContext } from "styled-components/native";
import { createStackNavigator } from '@react-navigation/stack';
import { Login, Signup } from "../screens";

const Stack = createStackNavigator();

const AuthStack = () => {

    const theme = useContext(ThemeContext);

    return (
        <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
                headerTitleAlign: 'center',
                cardStyle: { backgroundColor: theme.backgroundColor },
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
                    headerBackTitle: '', // 뒤로 가기 버튼의 타이틀을 빈 문자열로 설정
                    headerBackTitleVisible: false, // 타이틀 숨기기
                }}
            />
        </Stack.Navigator>
    );
};

export default AuthStack;