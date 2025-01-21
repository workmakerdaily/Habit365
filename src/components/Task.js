import React, { useState } from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import IconButton from './IconButton';
import { images } from '../utils/images';
import Input from './Input';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

// styled: 컨테이너 스타일 //
const Container = styled.TouchableOpacity`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    background-color: ${({ theme }) => theme.habitBackground};
    border-radius: 12px;
    border: 1px solid ${({ theme, isCompleted }) =>
        isCompleted ? theme.unHabitTask : theme.habitTask};
    padding: 15px 20px;
    margin: 8px 0px;
`;

// styled: 콘텐츠 스타일 //
const Contents = styled.Text`
    flex: 1;
    font-size: 18px;
    font-weight: 600;
    color: ${({ theme, isCompleted }) =>
        isCompleted ? theme.unHabitText : theme.habitText};
`;

// component: Task //
const Task = ({ item }) => {

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

    // render: Task 컴포넌트 렌더링 //
    return (
        <Container onPress={onPress} isCompleted={route.name === 'HabitHome' ? item.isCompleted : false}>
            <Contents isCompleted={route.name === 'HabitHome' ? item.isCompleted : false}>{item.project}</Contents>
            {route.name === 'HabitHome' && (
                item.isCompleted ? (
                    <MaterialIcons
                        name="task-alt"
                        size={24}
                        color="grey"
                    />
                ) : (
                    <MaterialIcons
                        name="radio-button-unchecked"
                        size={24}
                        color="black"
                    />
                )
            )}
        </Container>

    );
};

Task.prototype = {
    item: PropTypes.object.isRequired,
};

export default Task;