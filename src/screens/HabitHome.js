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

            const currentTime = new Date();
            const updatedHabits = [];

            for (const habit of data) {
                const finishDate = new Date(habit.finishDay);
                finishDate.setDate(finishDate.getDate() + 1);
                finishDate.setHours(12, 0, 0, 0);

                if (currentTime >= finishDate) {
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
