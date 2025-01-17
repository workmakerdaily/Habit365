import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import MainTab from "./MainTab";
import HabitDetail from "../screens/HabitDetail";

const Stack = createStackNavigator();

const MainStack = () => {

    return (
        <Stack.Navigator initialRouteName="MainTab">
            <Stack.Screen name="MainTab" component={MainTab} />
            <Stack.Screen name="HabitDetail" component={HabitDetail} />
        </Stack.Navigator>
    );

};

export default MainStack;