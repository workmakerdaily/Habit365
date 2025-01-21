import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components/native";
import { Dimensions } from 'react-native';
import * as Notifications from "expo-notifications";
import { ProgressContext, UserContext } from "../contexts";
import { useFocusEffect } from "@react-navigation/native";
import { getHabit } from "../utils/firebase";
import { Task } from "../components";

// styled: 컨테이너 스타일 //
const Container = styled.View`
    flex: 1;
    align-items: center;
    background-color: ${({ theme }) => theme.background};
    padding-top : 20px;
`;

// styled: 제목 텍스트 스타일 //
const Title = styled.Text`
    font-size: 18px;
    font-weight: bold;
    color: ${({ theme }) => theme.text};
    margin-bottom: 8px;
`;

// styled: 습관 리스트 스타일 //
const List = styled.ScrollView.attrs(() => ({
    contentContainerStyle: {
        alignItems: 'center',
    },
}))`
    flex: 1;
    width: ${({ width }) => width - 40}px;
    margint-top: ${({ height }) => height * 0.02}px;
`;

// component: NotificationMain 함수 //
const NotificationMain = () => {

    // variable: 화면 너비와 높이 //
    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;

    // context: 사용자 및 진행 상태 컨텍스트 //
    const { user } = useContext(UserContext);
    const { spinner } = useContext(ProgressContext);

    // state: 습관 데이터 상태 //
    const [habits, setHabits] = useState([]);

    // effect: 알림  핸들러 설정 //
    useEffect(() => {
        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowAlert: true,
                shouldPlaySound: false,
                shouldSetBadge: false,
            }),
        });
    }, []);

    // function: firestore에서 습관 데이터 가져오기 함수 //
    const fetchHabits = async () => {
        try {
            spinner.start();
            const userId = user.uid;
            const data = await getHabit(userId);
            setHabits(data);
        } catch (e) {
            console.error("Error fetching habits:", e.message);
        } finally {
            spinner.stop();
        }
    };

    // effect: 화면 포커스 시 습관 데이터 새로고침 //
    useFocusEffect(
        React.useCallback(() => {
            fetchHabits();
        }, [])
    );

    // effect: 알림 관한 요청 //
    useEffect(() => {
        (async () => {
            const { status } = await Notifications.requestPermissionsAsync();
            if (status !== "granted") {
                alert("알림 권한이 거부되었습니다!");
            }
        })();
    }, []);

    // render: NotificationMain 렌더링 //
    return (
        <Container height={height}>
            <Title>알림 설정</Title>
            <List width={width} height={height}>
                {Object.values(habits)
                    .reverse()
                    .map(habit => (
                        <Task key={habit.id}
                            item={habit}
                        />
                    ))}
            </List>
        </Container>
    );
};

export default NotificationMain;
