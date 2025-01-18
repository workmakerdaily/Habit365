import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components/native';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button, Input } from '../components';
import { addHabit } from '../utils/firebase'
import { Alert } from "react-native";

const Container = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: ${({ theme }) => theme.background};
    padding: 0 20px;
`;

const ErrorText = styled.Text`
    align-itmes: flex-start;
    width: 100%;
    height: 20px;
    margin-bottom: 10px;
    line-height: 20px;
    color: ${({ theme }) => theme.errorText};
`;

const HabitAdd = () => {

    const [project, setProject] = useState('');
    const [goal, setGoal] = useState('');
    const [date, setDate] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [disabled, setDisabled] = useState(true);
    const createdAt = new Date();
        
        useEffect(() => {
            setDisabled(!(project && goal && date && !errorMessage));  
        }, [project, goal, date, errorMessage]);

    const goalRef = useRef();
    const dateRef = useRef();
    const didMountRef = useRef();

    const handleProjectChange = ( text ) => {
        setProject(text);
    };

    const handleGoalChange = (text) => {
        const regex = text.replace(/[^0-9]/g, '');
        if (regex === '' || parseInt(regex, 10) < 1) {
            setGoal('');
        } else {
            setGoal(regex);
        }
    };
    
    const handleDateChange = (text) => {
        const regex = text.replace(/[^0-9]/g, '');
        if (regex === '' || parseInt(regex, 10) < 1) {
            setDate('');
        } else {
            setDate(regex);
        }
    };

    const handleAddHabit = async () => {
        if (!project || !goal || ! date) {
            Alert.alert('AddHabit Error', e.message);
            return;
        }
        
    const finishDay = new Date(createdAt);
    finishDay.setDate(finishDay.getDate() + parseInt(date, 10) - 1);

    const habitData = {
        project,
        goal: parseInt(goal, 10),
        date: parseInt(date, 10),
        finishDay,
    };

    try {
        await addHabit(habitData);
        Alert.alert('성공적으로 등록되었습니다.');
        setProject('');
        setGoal('');
        setDate('');
    } catch (e) {
        Alert.alert('습관 추가 중 오류가 발생하였습니다. 다시 시도해주세요.')
    }
};

    useEffect(() => {
        if (didMountRef.current) {
            let _errorMessage = '';

            if (!project) {
                _errorMessage = '계획을 입력하세요.';
            } else if (!goal) {
                _errorMessage = '하루 목표를 입력하세요.';
            } else if (!date) {
                _errorMessage = '목표 일수를 입력하세요.';
            } else {
                _errorMessage = '';
            }
            setErrorMessage(_errorMessage);
        } else {
            didMountRef.current = true;
        }
    }, [project, goal, date]);

    return (
                <KeyboardAwareScrollView
                    contentContainerStyle={{ flex: 1 }}
                    extraScrollHeight={20}
                >
        <Container>
            <Input
                label="계획"
                value={project}
                onChangeText={handleProjectChange}
                placeholder="계획을 입력하세요."
                onSubmitEditing={() => goalRef.current.focus()}
                returnKeyType="next"
            />
            <Input
                ref={goalRef}
                label="하루 목표"
                value={goal}
                onChangeText={handleGoalChange}
                placeholder="하루 목표 횟수를를 입력하세요."
                onSubmitEditing={() => dateRef.current.focus()}
                returnKeyType="next"
                maxLength={999}
            />
            <Input 
                ref={dateRef}
                label="목표 일"
                value={date}
                onChangeText={handleDateChange}
                placeholder="며칠간 도전할지 입력하세요."
                returnKeyType="done"
                maxLength={999}
            />
            <ErrorText>{errorMessage}</ErrorText>
            <Button 
                title="추가하기"
                onPress={handleAddHabit}
                disabled={disabled}
            />
        </Container>
        </KeyboardAwareScrollView>
    );
};

export default HabitAdd;
