import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components/native';
import { Dimensions } from 'react-native';
import { getHabit } from '../utils/firebase';
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

    // const deleteTask =( item ) => {
    //     const updateHabits = habits.filter(habit => habit.id !== item.id);
    //     setHabits(updateHabits);
    // };

    // const toggleTask = ( item ) => {
    //     const updateHabits = habits.map(habit =>
    //         habit.id === item.id ? { ...habit, completed: !habit.completed } : habit
    //     );
    //     setHabits(updateHabits);
    // }

    // const updateTask = ( habit ) => {
    //     navigation.navigate('HabitDetail', habit );
    //     console.log("전해지는 정보 : ", habit);
    // };

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

    },[]);

    return (
        <Container>
            <List width={width}>
                {Object.values(habits)
                        .reverse()
                        .map(habit => (
                            <Task key={habit.id}
                                item={habit}
                                // deleteTask={deleteTask}
                                // toggleTask={toggleTask}
                                // updateTask={updateTask}
                            />
                        ))}
            </List>
        </Container>
    );
};

export default HabitHome;