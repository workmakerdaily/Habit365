import * as Notifications from "expo-notifications";
import { auth } from "../../firebaseConfig";

// 알림 권한 요청
export const requestNotificationPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
        alert("알림 권한이 필요합니다!");
    } else {
        console.log("알림 권한이 허용되었습니다.");
    }
};

// 알림 예약
export const scheduleNotification = async ({ title, body, hour, minute }) => {
    try {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: title || "습관 리마인더",
                body: body || "습관을 잊지 않고 실천하세요!",
            },
            trigger: {
                hour: hour || 7, // 기본 시간: 오전 7시
                minute: minute || 0,
                repeats: true, // 반복 알림 설정
            },
        });
        console.log("알림 예약 성공!");
    } catch (error) {
        console.error("알림 예약 실패:", error.message);
        throw error;
    }
};

// 사용자별 알림 예약
export const scheduleUserHabitNotification = async (habit) => {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error("로그인된 사용자가 없습니다.");
        }

        // 알림 예약: 습관 정보 기반
        await scheduleNotification({
            title: "습관 리마인더",
            body: `오늘 ${habit.project} 목표를 잊지 마세요!`,
            hour: habit.reminderHour || 7,
            minute: habit.reminderMinute || 0,
        });
        console.log(`알림 예약 성공: ${habit.name}`);
    } catch (error) {
        console.error("사용자 습관 알림 예약 실패:", error.message);
        throw error;
    }
};