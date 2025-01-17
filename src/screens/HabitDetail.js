import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { Alert, FlatList } from 'react-native';
import { updateCheckboxState, getCheckboxState, deleteHabit } from '../utils/firebase';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const Container = styled.View`
    flex: 1;
    background-color: ${({ theme }) => theme.background};
    padding: 20px;
`;

const Header = styled.View`
    margin-bottom: 20px;
`;

const Title = styled.Text`
    font-size: 24px;
    font-weight: bold;
    color: ${({ theme }) => theme.detailTitle};
    margin-bottom: 10px;
`;

const Text = styled.Text`
    font-size: 16px;
    color: ${({ theme }) => theme.detailText};
    margin-bottom: 5px;
`;

const ListContainer = styled.View`
    flex: 1;
    margin-top: 20px;
`;

const CheckboxItem = styled.View`
    flex-direction: row;
    align-items: center;
    background-color: ${({ theme }) => theme.checkboxItem};
    padding: 15px;
    margin-bottom: 10px;
    border-radius: 10px;
    shadow-color: #000;
    shadow-offset: 0px 3px;
    shadow-opacity: 0.1;
    shadow-radius: 4px;
    elevation: 3;
`;

const CheckboxIcon = styled.TouchableOpacity`
    margin-right: 10px;
`;

const ItemText = styled.Text`
    font-size: 18px;
    color: ${({ theme }) => theme.ItemText};
`;

const DeleteButton = styled.TouchableOpacity`
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 12px 20px;
    border-radius: 25px;
    shadow-color: #000;
    shadow-offset: 0px 3px;
    shadow-opacity: 0.2;
    shadow-radius: 5px;
    elevation: 5;
`;

const Gradient = styled(LinearGradient)`
    flex: 1;
    flex-direction: row;
    padding: 10px 0;
    align-items: center;
    justify-content: center;
    border-radius: 25px;
`;

const DeleteText = styled.Text`
    font-size: 16px;
    color: ${({ theme }) => theme.deleteText};
    font-weight: bold;
    margin-left: 10px;
`;

const HabitDetail = ({ route }) => {
    const { habit } = route.params;
    const [checkboxes, setCheckboxes] = useState(
        Array.from({ length: habit.goal }, () => false)
    );

    const navigation = useNavigation();

    useEffect(() => {
        const fetchCheckboxState = async () => {
            const savedData = await getCheckboxState(habit.id);
            if (savedData) {
                const { checkboxes: savedCheckboxes, lastUpdatedDate } = savedData;
                const today = new Date().toISOString().split('T')[0];

                if (lastUpdatedDate !== today) {
                    const resetCheckboxes = Array.from({ length: habit.goal }, () => false);
                    setCheckboxes(resetCheckboxes);
                    await updateCheckboxState(habit.id, resetCheckboxes, today);
                } else {
                    setCheckboxes(savedCheckboxes);
                }
            }
        };
        fetchCheckboxState();
    }, [habit.id]);

    const handleCheckboxToggle = async (index) => {
        const updatedCheckboxes = [...checkboxes];
        updatedCheckboxes[index] = !updatedCheckboxes[index];
        setCheckboxes(updatedCheckboxes);

        const today = new Date().toISOString().split('T')[0];
        await updateCheckboxState(habit.id, updatedCheckboxes, today);
    };

    const handleDeleteHabit = async () => {
        Alert.alert('삭제 확인',`${habit.project}를(을) 삭제하시겠습니까?`,
            [
                { text: '취소', style: 'cancel', },
                {text: '삭제', style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteHabit(habit.id);
                            Alert.alert('삭제 성공', '습관이 삭제되었습니다.');
                            navigation.goBack();
                        } catch (e) {
                            console.error("[삭제 실패]", e.message);
                            Alert.alert('삭제 실패', '삭제 중 오류가 발생하였습니다.');
                        }
                    },
                },
            ], { cancelable: true }
        );
    };

    return (
        <Container>
            <Header>
                <Title>{habit.project}</Title>
                <Text>하루 목표: {habit.goal}</Text>
                <Text>목표 일수: {habit.date}</Text>
                <Text>완료 상태: {habit.completed ? '완료' : '미완료'}</Text>
                <DeleteButton onPress={handleDeleteHabit} activeOpacity={0.8}>
    <Gradient
        colors={['#ff6f61', '#ff4d4d']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
    >
        <MaterialIcons name="delete" size={20} color="#fff" />
        <DeleteText>삭제</DeleteText>
    </Gradient>
</DeleteButton>
            </Header>

            <ListContainer>
                <FlatList
                    data={checkboxes}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => (
                        <CheckboxItem>
                            <CheckboxIcon onPress={() => handleCheckboxToggle(index)}>
                    <MaterialIcons
                        name={item ? "check-box" : "check-box-outline-blank"}
                        size={24}
                        color={item ? "#333" : "#ccc"}
                    />
                </CheckboxIcon>
                            <ItemText>{`${index + 1} 회차`}</ItemText>
                        </CheckboxItem>
                    )}
                />
            </ListContainer>
        </Container>
    );
};

export default HabitDetail;