import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { Alert, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

// styled: 컨테이너 스타일 //
const Container = styled.ScrollView`
    flex: 1;
    background-color: ${({ theme }) => theme.background};
    padding: 20px;
`;

// styled: 제목 스타일 //
const Title = styled.Text`
    font-size: 24px;
    font-weight: bold;
    color: ${({ theme }) => theme.detailTitle};
    margin-bottom: 10px;
`;

// styled: 시간 텍스트 스타일 //
const TimeText = styled.Text`
    font-size: 18px;
    color: ${({ theme }) => theme.detailText};
    margin-bottom: 10px;
`;

// styled: 버튼 행 스타일 //
const ButtonRow = styled.View`
    flex-direction: row;
    justify-content: space-between;
    margin-top: 10px;
`;

// styled: 버튼 스타일 //
const Button = styled.TouchableOpacity`
    background-color: ${({ theme, isCancel }) =>
        isCancel ? theme.deleteButton : theme.buttonBackground};
    padding: 10px 15px;
    border-radius: 8px;
    align-items: center;
    flex: 1;
    margin: 0 5px;
`;

// styled: 버튼 텍스트 스타일 //
const ButtonText = styled.Text`
    font-size: 14px;
    color: ${({ theme }) => theme.buttonTitle};
    font-weight: bold;
`;

// styled: 알람 컨테이너 스타일 //
const AlarmContainer = styled.View`
    margin-bottom: 20px;
`;

// styled: 알람 제목 스타일 //
const AlarmTitle = styled.Text`
    font-size: 20px;
    font-weight: bold;
    color: ${({ theme }) => theme.detailText};
    margin-bottom: 10px;
`;

// component: NotificationDetail 함수 //
const NotificationDetail = ({ route }) => {

    // state: 알람 상태 및 시간 선택기 표시 상태 //
    const { habit } = route.params;
    const [alarms, setAlarms] = useState(
        Array.from({ length: habit.goal }, () => ({ time: null, notificationId: null }))
    );
    const [showPicker, setShowPicker] = useState(null);

    const ALARM_STORAGE = `@alarms_${habit.id}`;

    // effect: 알람 데이터 불러오기 //
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

    // function: 알람 시간 변경 처리 함수 //
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

    // function: 알람 데이터 로컬 스토리지 저장 함수 //
    const saveAlarmsToStorage = async (updatedAlarms) => {
        try {
            await AsyncStorage.setItem(ALARM_STORAGE, JSON.stringify(updatedAlarms));
        } catch (e) {
            console.error('알람 데이터 저장 중 오류 발생: ', e.message);
        }
    };

    // function: 알람 스케줄링 //
    const scheduleNotification = async (index, time = null) => {
        const alarm = alarms[index];
        const notificationTime = time || alarm.time;
    
        if (!notificationTime) {
            Alert.alert('알림 설정 실패', `알람 ${index + 1}의 시간이 설정되지 않았습니다.`);
            return;
        }
    
        try {
            // 기존 알람 취소
            if (alarm.notificationId) {
                await Notifications.cancelScheduledNotificationAsync(alarm.notificationId);
            }
    
            // 새 알람 스케줄링
            const notificationId = await Notifications.scheduleNotificationAsync({
                content: {
                    title: `${habit.project} 알림`,
                    body: `${habit.project}를(을) 실행할 시간이에요!`,
                },
                trigger: notificationTime,
            });
    
            const updatedAlarms = [...alarms];
            updatedAlarms[index] = { time: notificationTime, notificationId };
            setAlarms(updatedAlarms);
            await saveAlarmsToStorage(updatedAlarms);
    
            Alert.alert('알림 설정 성공', `알람 ${index + 1}이 설정되었습니다.`);
        } catch (e) {
            Alert.alert('알림 설정 실패', '알림 설정 중 오류가 발생하였습니다.');
        }
    };
    
    // function: 알림 취소 함수 //
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


    // render: NotificationDetail 렌더링 //
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
