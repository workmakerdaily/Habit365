import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import MainTab from "./MainTab";
import HabitDetail from "../screens/HabitDetail";
import { ThemeContext } from "styled-components/native";

const Stack = createStackNavigator();

const MainStack = () => {

    const theme = useContext(ThemeContext);

    return (
        <Stack.Navigator 
        initialRouteName="MainTab"
        screenOptions={{
            headerTitleAlign: 'center',
            cardStyle: { backgroundColor: theme.background },
            headerTintColor: theme.headerTintColor,
        }}
        >
            <Stack.Screen name="MainTab" component={MainTab} />
            <Stack.Screen name="HabitDetail" component={HabitDetail} />
        </Stack.Navigator>
    );

};

export default MainStack;