import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { Dimensions, Alert } from 'react-native';
import { getHabit, deleteHabit } from '../utils/firebase';
import { ProgressContext, UserContext } from "../contexts";
import { Task } from '../components';
import { useFocusEffect } from '@react-navigation/native';

const Container = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    padding: 0 20px;
    background-color: ${({ theme }) => theme.background};
`;

const List = styled.ScrollView.attrs(() => ({
    contentContainerStyle: {
        alignItems: 'center',
    },
}))`
    flex: 1;
    width: ${({ width }) => width - 40}px;
`;

const HabitHome = () => {
    const width = Dimensions.get('window').width;

    const { user } = useContext(UserContext);
    const { spinner } = useContext(ProgressContext);

    const [habits, setHabits] = useState([]);

    const fetchHabits = async () => {
        try {
            spinner.start();
            const userId = user.uid;
            const data = await getHabit(userId);

            // 현재 한국 시간 기준으로 날짜와 시간을 가져오기
            const now = new Date();
            const koreanTime = new Date(now.getTime() + 9 * 60 * 60 * 1000); // UTC -> KST
            console.log("현재 한국 시간:", koreanTime);

            const updatedHabits = [];

            for (const habit of data) {
                const finishDate = new Date(habit.finishDay);
                finishDate.setDate(finishDate.getDate() + 1); // 다음날
                finishDate.setHours(12, 0, 0, 0); // 한국 시간 정오 설정

                console.log(`습관 마감 시간: ${finishDate}, 현재 한국 시간: ${koreanTime}`);

                if (koreanTime >= finishDate) {
                    try {
                        await deleteHabit(habit.id);
                        Alert.alert('습관 삭제', `${habit.project} 습관이 완료되어 삭제되었습니다.`);
                    } catch (error) {
                        console.error(`[자동 삭제 실패] 습관 ID: ${habit.id}`, error.message);
                    }
                } else {
                    updatedHabits.push({
                        ...habit,
                        isCompleted: habit.isCompleted ?? false,
                    });
                }
            }

            setHabits(updatedHabits);
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

    return (
        <Container>
            <List width={width}>
                {habits
                    .reverse()
                    .map((habit) => (
                        <Task
                            key={habit.id}
                            item={habit}
                            isCompleted={habit.isCompleted}
                        />
                    ))}
            </List>
        </Container>
    );
};

export default HabitHome;
