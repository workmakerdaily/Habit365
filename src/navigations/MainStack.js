import React, { useContext } from "react";
import styled from "styled-components/native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import MainTab from "./MainTab";
import HabitDetail from "../screens/HabitDetail";
import { ThemeContext } from "styled-components/native";
import NotificationDetail from "../screens/NotificationDetail";
import { ProgressContext, UserContext } from "../contexts";
import { MaterialIcons } from '@expo/vector-icons';
import { Alert } from "react-native";

// styled: 로그아웃 버튼 스타일 //
const LogoutButton = styled.TouchableOpacity`
    margin-right: 16px;
`;

// variable: 스택 네비게이션 //
const Stack = createStackNavigator();

// component: MainStack 함수 //
const MainStack = () => {

    // context: 테마, 사용자, 진행 상태 컨텍스트 //
    const theme = useContext(ThemeContext);
    const { dispatch } = useContext(UserContext);
    const { spinner } = useContext(ProgressContext);

    // function: 로그아웃 처리 함수 //
    const handleLogout = async () => {
        try {
            spinner.start();
            await logout();
        } catch (e) {
            console.log('[Profile] logout: ', e.massage);
        } finally {
            dispatch({});
            spinner.stop();
        }
    };

    // function: 로그아웃 확인 알림창 함수 //
    const showLogoutAlert = () => {
        Alert.alert(
            "로그아웃",
            "정말 로그아웃 하시겠습니까?",
            [
                { text: "취소", style: "cancel" },
                { text: "확인", onPress: handleLogout },
            ],
            { cancelable: true }
        );
    };

    // render: MainStack 네비게이션 렌더링 //
    return (
        <Stack.Navigator
            initialRouteName="MainTab"
            screenOptions={{
                headerTitleAlign: 'left',
                cardStyle: { backgroundColor: theme.background },
                headerTintColor: theme.headerTintColor,
            }}
        >
            <Stack.Screen
                name="MainTab"
                component={MainTab}
                options={{
                    title: "Habit365",
                    headerRight: () => (
                        <LogoutButton onPress={showLogoutAlert}>
                            <MaterialIcons name="logout" size={24} color={theme.buttonLogout} />
                        </LogoutButton>
                    )
                }}
            />
            <Stack.Screen
                name="HabitDetail"
                component={HabitDetail}
                options={{
                    headerTitle: "",
                    headerBackTitle: "",
                }}
            />
            <Stack.Screen
                name="NotificationDetail"
                component={NotificationDetail}
                options={{
                    headerTitle: "",
                    headerBackTitle: "",
                }}
            />
        </Stack.Navigator>
    );

};

export default MainStack;