import * as Notifications from "expo-notifications";
import { auth } from "../../firebaseConfig";

// function: 알림 권한 요청 //
export const requestNotificationPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
        alert("알림 권한이 필요합니다!");
    } else {
        console.log("알림 권한이 허용되었습니다.");
    }
};

// function: 알림 예약 //
export const scheduleNotification = async ({ title, body, hour, minute }) => {
    try {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: title || "습관 리마인더",
                body: body || "습관을 잊지 않고 실천하세요!",
            },
            trigger: {
                hour: hour || 7,
                minute: minute || 0,
                repeats: true,
            },
        });
        console.log("알림 예약 성공!");
    } catch (e) {
        console.error("알림 예약 실패:", e.message);
        throw error;
    }
};

// function: 사용자 습관 알림 예약 //
export const scheduleUserHabitNotification = async (habit) => {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error("로그인된 사용자가 없습니다.");
        }

        await scheduleNotification({
            title: "습관 리마인더",
            body: `오늘 ${habit.project} 목표를 잊지 마세요!`,
            hour: habit.reminderHour || 7,
            minute: habit.reminderMinute || 0,
        });
        console.log(`알림 예약 성공: ${habit.name}`);
    } catch (e) {
        console.error("사용자 습관 알림 예약 실패:", e.message);
        throw error;
    }
};