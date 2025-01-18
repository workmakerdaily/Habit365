import React, { useState } from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import IconButton from './IconButton';
import { images } from '../utils/images';
import Input from './Input';
import { useNavigation, useRoute } from '@react-navigation/native';

const Container = styled.TouchableOpacity`
    flex-direction: row;
    align-items: center;
    background-color: ${({ theme, isCompleted }) => 
        isCompleted ? theme.unHabitBackground : theme.habitBackground};
    border-radius: 12px;
    border: 1px solid ${({ theme, isCompleted }) => 
        isCompleted ? theme.unHabitTask : theme.habitTask};
    padding: 15px 20px;
    margin: 8px 0px;

    /* iOS */
    shadow-color: #000;
    shadow-offset: 0px 2px;
    shadow-opacity: 0.1;
    shadow-radius: 4px;

    /* Android */
    elevation: 3;
`;

const Contents = styled.Text`
    flex: 1;
    font-size: 24px;
    color: ${({ theme, isCompleted }) => 
        isCompleted ? theme.unHabitText : theme.habitText};
    text-decoration-line: ${({ isCompleted }) =>
        isCompleted ? 'line-through' : 'none'};
`;

const Task = ({ item, deleteTask, toggleTask, updateTask }) => {

    const navigation = useNavigation();
    const route = useRoute();

    const onPress = () => {
        if (route.name === 'HabitHome') {
            // HabitHome에서 클릭 시 HabitDetail로 이동
            navigation.navigate('HabitDetail', { habit: item });
        } else if (route.name === 'NotificationMain') {
            // NotificationMain에서 클릭 시 NotificationDetail로 이동
            navigation.navigate('NotificationDetail', { habit: item });
        }
    };

    return (
        <Container onPress={onPress} isCompleted={item.isCompleted}>
            {/* <IconButton
                type={item.completed ? images.completed : images.uncompleted}
                id={item.id}
                onPressOut={toggleTask}
                completed={item.completed}
            /> */}
            <Contents isCompleted={item.isCompleted}>{item.project}</Contents>
            {/* <IconButton
                type={images.update}
                id={item.id}
                onPressOut={updateTask}
                completed={item.completed}
            /> */}
            {/* <IconButton
                type={images.delete}
                id={item.id}
                onPressOut={deleteTask}
                completed={item.completed}
            /> */}
        </Container>

    );
};

Task.prototype = {
    item: PropTypes.object.isRequired,
    // deleteTask: PropTypes.func.isRequired,
    // toggleTask: PropTypes.func.isRequired,
    // updateTask: PropTypes.func.isRequired,
};

export default Task;