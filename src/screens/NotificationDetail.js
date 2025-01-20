import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { Alert, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Container = styled.ScrollView`
    flex: 1;
    background-color: ${({ theme }) => theme.background};
    padding: 20px;
`;

const Title = styled.Text`
    font-size: 24px;
    font-weight: bold;
    color: ${({ theme }) => theme.detailTitle};
    margin-bottom: 10px;
`;

const TimeText = styled.Text`
    font-size: 18px;
    color: ${({ theme }) => theme.detailText};
    margin-bottom: 10px;
`;

const ButtonRow = styled.View`
    flex-direction: row;
    justify-content: space-between;
    margin-top: 10px;
`;

const Button = styled.TouchableOpacity`
    background-color: ${({ theme, isCancel }) =>
        isCancel ? theme.deleteButton : theme.buttonBackground};
    padding: 10px 15px;
    border-radius: 8px;
    align-items: center;
    flex: 1;
    margin: 0 5px;
`;

const ButtonText = styled.Text`
    font-size: 14px;
    color: ${({ theme }) => theme.buttonTitle};
    font-weight: bold;
`;

const AlarmContainer = styled.View`
    margin-bottom: 20px;
`;

const AlarmTitle = styled.Text`
    font-size: 20px;
    font-weight: bold;
    color: ${({ theme }) => theme.detailText};
    margin-bottom: 10px;
`;

const NotificationDetail = ({ route }) => {
    const { habit } = route.params;
    const [alarms, setAlarms] = useState(
        Array.from({ length: habit.goal }, () => ({ time: null, notificationId: null }))
    );
    const [showPicker, setShowPicker] = useState(null);

    const ALARM_STORAGE = `@alarms_${habit.id}`;

    useEffect(() => {
        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowAlert: true,
                shouldPlaySound: false,
                shouldSetBadge: false,
            }),
        });

        const loadAlarms = async () => {
            try {
                const storedAlarms = await AsyncStorage.getItem(ALARM_STORAGE);
                if (storedAlarms) {
                    const parsedAlarms = JSON.parse(storedAlarms);
                    setAlarms(
                        parsedAlarms.map(alarm =>
                            alarm && typeof alarm === 'object'
                                ? {
                                    time: alarm.time ? new Date(alarm.time) : null,
                                    notificationId: alarm.notificationId || null,
                                }
                                : { time: null, notificationId: null }
                        )
                    );
                }
            } catch (e) {
                console.error('알람 데이터를 불러오는 중 오류 발생:', e.message);
            }
        };
        loadAlarms();
    }, []);

    const handleTimeChange = (event, date, index) => {
        if (Platform.OS === 'android') {
            if (event.type === 'set') {
                const updatedAlarms = [...alarms];
                updatedAlarms[index] = { ...updatedAlarms[index], time: date };
                setAlarms(updatedAlarms);
                saveAlarmsToStorage(updatedAlarms);
            }
            setShowPicker(null);
        } else {
            if (date) {
                const updatedAlarms = [...alarms];
                updatedAlarms[index] = { ...updatedAlarms[index], time: date };
                setAlarms(updatedAlarms);
                saveAlarmsToStorage(updatedAlarms);
            }
        }
    };

    const saveAlarmsToStorage = async (updatedAlarms) => {
        try {
            await AsyncStorage.setItem(ALARM_STORAGE, JSON.stringify(updatedAlarms));
        } catch (e) {
            console.error('알람 데이터 저장 중 오류 발생: ', e.message);
        }
    };

    const scheduleNotification = async (index) => {
        const alarm = alarms[index];
        if (!alarm.time) {
            Alert.alert('알림 설정 실패', `알람 ${index + 1}의 시간이 설정되지 않았습니다.`);
            return;
        }

        try {
            const notificationId = await Notifications.scheduleNotificationAsync({
                content: {
                    title: `${habit.project} 알림`,
                    body: `${habit.project}를(을) 실행할 시간이에요!`,
                },
                trigger: alarm.time,
            });

            const updatedAlarms = [...alarms];
            updatedAlarms[index] = { ...alarm, notificationId };
            setAlarms(updatedAlarms);
            await saveAlarmsToStorage(updatedAlarms);

            Alert.alert('알림 설정 성공', `알람 ${index + 1}이 설정되었습니다.`);
        } catch (e) {
            Alert.alert('알림 설정 실패', '알림 설정 중 오류가 발생하였습니다.');
        }
    };

    const cancelNotification = async (index) => {
        const alarm = alarms[index];
        if (alarm.notificationId) {
            try {
                await Notifications.cancelScheduledNotificationAsync(alarm.notificationId);

                const updatedAlarms = [...alarms];
                updatedAlarms[index] = { time: null, notificationId: null };
                setAlarms(updatedAlarms);
                await saveAlarmsToStorage(updatedAlarms);

                Alert.alert('알림 취소 성공', `알람 ${index + 1}이 취소되었습니다.`);
            } catch (e) {
                Alert.alert('알림 취소 실패', '알림 취소 중 오류가 발생하였습니다.');
            }
        } else {
            Alert.alert('알림 취소 실패', `알람 ${index + 1}은 설정되지 않았습니다.`);
        }
    };

    return (
        <Container>
            <Title>{habit.project}</Title>
            {alarms.map((alarm, index) => (
                <AlarmContainer key={index}>
                    <AlarmTitle>알람 {index + 1}</AlarmTitle>
                    <TimeText>
                        {alarm.time
                            ? `선택된 알람 시간: ${alarm.time.toLocaleTimeString([], {
                                hour: 'numeric',
                                minute: '2-digit',
                            })}`
                            : '알람 시간이 설정되지 않았습니다.'}
                    </TimeText>
                    <ButtonRow>
                        <Button onPress={() => setShowPicker(index)}>
                            <ButtonText>설정</ButtonText>
                        </Button>
                        <Button onPress={() => scheduleNotification(index)}>
                            <ButtonText>저장</ButtonText>
                        </Button>
                        <Button onPress={() => cancelNotification(index)} isCancel>
                            <ButtonText>취소</ButtonText>
                        </Button>
                    </ButtonRow>
                    {showPicker === index && (
                        <DateTimePicker
                            value={alarm.time || new Date()}
                            mode="time"
                            is24Hour={true}
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={(event, date) => handleTimeChange(event, date, index)}
                        />
                    )}
                </AlarmContainer>
            ))}
        </Container>
    );
};

export default NotificationDetail;
