import React, { useContext, useEffect } from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { HabitHome, HabitAdd, NotificationMain } from "../screens";
import { ThemeContext } from "styled-components/native";

// variable: Tab 네비게이션 //
const Tab = createBottomTabNavigator();

// component: TabBarIcon 함수 //
const TabBarIcon = ({ focused, name }) => {

    // context: 테마 컨텍스트 //
    const theme = useContext(ThemeContext);

    // render: TabBarIcon 렌더링 //
    return (
        <MaterialIcons
            name={name}
            size={26}
            color={focused ? theme.tabActiveColor : theme.tabInactiveColor}
        />
    );
};

// component: MainTab 함수 //
const MainTab = ({ navigation, route }) => {

    // context: 테마 컨텍스트 //
    const theme = useContext(ThemeContext);

    // effect: 헤더 제목 동적 업데이트 // 
    useEffect(() => {
        const titles = route.state?.routeNames || ['Habit365'];
        const index = route.state?.index || 0;
        navigation.setOptions({
            headerTitle: titles[index],
            headerTitleStyle: {
                fontSize: 24,
                color: theme.title,
            },
        });
    }, [route]);
    
    // render: MainTab 렌더링 //
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