import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components/native";
import { Dimensions } from 'react-native';
import * as Notifications from "expo-notifications";
import { ProgressContext, UserContext } from "../contexts";
import { useFocusEffect } from "@react-navigation/native";
import { getHabit } from "../utils/firebase";
import { Task } from "../components";

const Container = styled.View`
    flex: 1;
    align-items: center;
    background-color: ${({ theme }) => theme.background};
    padding-top : 20px;
`;

const Title = styled.Text`
    font-size: 18px;
    font-weight: bold;
    color: ${({ theme }) => theme.text};
    margin-bottom: 8px;
`;

const NotificationButton = styled.TouchableOpacity`
    background-color: ${({ theme }) => theme.primary};
    padding: 12px 20px;
    border-radius: 25px;
    shadow-color: #000;
    shadow-offset: 0px 3px;
    shadow-opacity: 0.1;
    shadow-radius: 4px;
    elevation: 3;
`;

const ButtonText = styled.Text`
    font-size: 16px;
    color: ${({ theme }) => theme.buttonText};
    font-weight: bold;
`;

const List = styled.ScrollView.attrs(() => ({
    contentContainerStyle: {
        alignItems: 'center',
    },
}))`
    flex: 1;
    width: ${({ width }) => width - 40}px;
    margint-top: ${({ height }) => height * 0.02}px;
`;

const NotificationMain = () => {

    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;

    const { user } = useContext(UserContext);
    const { spinner } = useContext(ProgressContext);

    const [habits, setHabits] = useState([]);

    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: false,
            shouldSetBadge: false,
        }),
    });

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
    
        useFocusEffect(
            React.useCallback(() => {
                fetchHabits();
            }, [])
        );

    useEffect(() => {
        (async () => {
            const { status } = await Notifications.requestPermissionsAsync();
            if (status !== "granted") {
                alert("알림 권한이 거부되었습니다!");
            }
        })();
    }, []);

    const sendNotification = async () => {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "알림 제목 테스트",
                body: "알림 내용 테스트",
            },
            trigger: null,
        });
    };

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
            {/* <NotificationButton onPress={sendNotification}>
                <ButtonText>테스트 알림 보내기</ButtonText>
            </NotificationButton> */}
        </Container>
    );
};

export default NotificationMain;
