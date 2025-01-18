import React, { useContext, useEffect } from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { HabitHome, HabitAdd, NotificationMain } from "../screens";
import { ThemeContext } from "styled-components/native";

const Tab = createBottomTabNavigator();

const TabBarIcon = ({ focused, name }) => {

    const theme = useContext(ThemeContext);

    return (
        <MaterialIcons
            name={name}
            size={26}
            color={focused ? theme.tabActiveColor : theme.tabInactiveColor}
        />
    );
};

const MainTab = ({ navigation, route }) => {

    const theme = useContext(ThemeContext);

    useEffect(() => {
        const titles = route.state?.routeNames || ['Habit365'];
        const index = route.state?.index || 0;
        navigation.setOptions({
            headerTitle: titles[index],
            headerTitleStyle: {
                fontSize: 24,
                fontWeight: "bold",
                color: theme.title,
            },
        });
    }, [route]);

    return (
        <Tab.Navigator
            tabBarOptions={{
                activeTintColor: theme.tabActiveColor,
                inactiveTintColor: theme.tabInactiveColor,
            }}
            screenOptions={{
                tabBarActiveTintColor: theme.tabBarActiveTintColor,
                tabBarInactiveTintColor: theme.tabBarInactiveTintColor,
                tabBarShowLabel: false,
            }}
        >
            <Tab.Screen
                name="HabitHome"
                component={HabitHome}
                options={{
                    tabBarIcon: ({ focused }) =>
                        TabBarIcon({
                            focused,
                            name: focused ? 'list-alt' : 'list',
                        }),
                    headerShown: false,
                }}
            />
            <Tab.Screen
                name="HabitAdd"
                component={HabitAdd}
                options={{
                    tabBarIcon: ({ focused }) =>
                        TabBarIcon({
                            focused,
                            name: focused ? 'add-circle' : 'add-circle-outline',
                        }),
                    headerShown: false,
                }}
            />
            <Tab.Screen
                name="NotificationMain"
                component={NotificationMain}
                options={{
                    tabBarIcon: ({ focused }) =>
                        TabBarIcon({
                            focused,
                            name: focused ? 'notifications-active' : 'notifications-none',
                        }),
                    headerShown: false,
                }}
            />
        </Tab.Navigator>
    );
};

export default MainTab;