import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components/native';
import { Dimensions } from 'react-native';
import { getHabit } from '../utils/firebase';
import { ProgressContext, UserContext } from "../contexts";

const Container = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    padding: 0 20px;
`;

const List = styled.ScrollView`
    flex: 1;
    width: ${({ width }) => width - 40}px;
`;

const HabitItem = styled.View`
    padding: 15px;
    margin-bottom: 10px;
    border-radius: 10px;
    background-color: #f0f8ff;
`;

const HabitText = styled.Text`
    font-size: 16px;
    color: #333;
`;


const HabitHome = () => {

    const width = Dimensions.get('window').width;

    const { user } = useContext(UserContext);
    const { spinner } = useContext(ProgressContext);

    const [habits, setHabits] = useState([]);

    useEffect(() => {
        const fetchHabits = async () => {
            try {
                spinner.start();
                const userId = user.uid;
                const data = await getHabit(userId);
                setHabits(data);
            } catch (e) {
                console.error("Error fetching habits:", error.message);
            } finally {
                spinner.stop();
            }
        };
        fetchHabits();
    }, []);

    return (
        <Container>
            <List width={width}>
            {habits.map((habit) => (
                    <HabitItem key={habit.id}>
                        <HabitText>계획: {habit.project}</HabitText>
                        <HabitText>하루 목표: {habit.goal}</HabitText>
                        <HabitText>목표 일수: {habit.date}</HabitText>
                        <HabitText>종료일: {new Date(habit.finishDay.seconds * 1000).toLocaleDateString()}</HabitText>
                    </HabitItem>
                ))}
            </List>
        </Container>
    );
};

export default HabitHome;