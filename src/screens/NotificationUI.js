import React, { useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import * as Notifications from 'expo-notifications';
import { requestNotificationPermissions, scheduleNotification } from "../utils/Notification";

const NotificationUI = () => {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: false,
            shouldSetBadge: false,
        }),
    });

    useEffect(() => {
        (async () => {
            const { status } = await Notifications.requestPermissionsAsync();
            if (status !== 'granted') {
                alert('알림 권한이 거부되었습니다!');
            }
        })();
    }, []);

    const sendNotification = async () => {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: '알림 제목 테스트',
                body: '알림 내용 테스트',
            },
            trigger: null,
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>알림 설정</Text>
            <Button title="테스트 알림 보내기" onPress={sendNotification} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20,
    },
});

export default NotificationUI;
