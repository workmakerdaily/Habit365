import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { Alert } from 'react-native';
import { updateCheckboxState, getCheckboxState, deleteHabit, updateHabitCompletionStatus } from '../utils/firebase';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const Container = styled.View`
    flex: 1;
    background-color: ${({ theme }) => theme.background};
    padding: 20px;
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

const Row = styled.View`
    flex-direction: row;
    justify-content: flex-start;
    margin-bottom: 10px;
`;

const CheckboxItem = styled.View`
    flex: 1;
    max-width: 30%;
    align-items: center;
    background-color: ${({ theme }) => theme.checkboxItem};
    padding: 15px;
    border-radius: 16px;
    shadow-color: #000;
    shadow-offset: 0px 3px;
    shadow-opacity: 0.1;
    shadow-radius: 4px;
    elevation: 3;
    margin: 5px;
`;

const CheckboxIcon = styled.TouchableOpacity`
    margin-bottom: 10px;
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
            try {
                const savedData = await getCheckboxState(habit.id);
                console.log("Firestore에서 가져온 데이터:", savedData);
    
                if (savedData) {
                    const { checkboxes: savedCheckboxes, lastUpdatedDate } = savedData;
    
                    // 한국 시간(KST)으로 변환된 오늘 날짜
                    const now = new Date();
                    const kstDate = new Date(now.getTime() + 9 * 60 * 60 * 1000); // UTC -> KST
                    const today = kstDate.toISOString().split('T')[0]; // "YYYY-MM-DD" 형식
    
                    console.log(`오늘 날짜(KST): ${today}, 저장된 날짜: ${lastUpdatedDate}`);
    
                    if (lastUpdatedDate !== today) {
                        console.log("날짜가 다릅니다. 체크박스를 초기화합니다.");
                        const resetCheckboxes = Array.from({ length: habit.goal }, () => false);
                        setCheckboxes(resetCheckboxes);
    
                        // Firestore에 업데이트
                        await updateCheckboxState(habit.id, resetCheckboxes, today);
                        await updateHabitCompletionStatus(habit.id, false);
                        console.log("초기화 완료 및 Firestore 업데이트 성공");
                    } else {
                        setCheckboxes(savedCheckboxes);
                        console.log("Firestore에서 체크박스 상태를 가져왔습니다.");
                    }
                }
            } catch (error) {
                console.error("체크박스 상태 불러오기 오류:", error.message);
            }
        };
    
        fetchCheckboxState();
    }, [habit.id]);

    const handleCheckboxToggle = async (index) => {
        const updatedCheckboxes = [...checkboxes];
        updatedCheckboxes[index] = !updatedCheckboxes[index];
        setCheckboxes(updatedCheckboxes);
    
        // 한국 시간 계산
        const now = new Date();
        const koreanTime = new Date(now.getTime() + 9 * 60 * 60 * 1000); // UTC -> KST
        const today = koreanTime.toISOString().split('T')[0]; // "YYYY-MM-DD" 형식
    
        console.log(`한국 시간 기준 오늘 날짜: ${today}`); // 로그 추가
    
        await updateCheckboxState(habit.id, updatedCheckboxes, today);
    
        const isCompleted = updatedCheckboxes.every((checkbox) => checkbox === true);
        await updateHabitCompletionStatus(habit.id, isCompleted);
    };

    const handleDeleteHabit = async () => {
        Alert.alert('삭제 확인', `${habit.project}를(을) 삭제하시겠습니까?`, [
            { text: '취소', style: 'cancel' },
            {
                text: '삭제',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await deleteHabit(habit.id);
                        Alert.alert('삭제 성공', '습관이 삭제되었습니다.');
                        navigation.goBack();
                    } catch (e) {
                        console.error('[삭제 실패]', e.message);
                        Alert.alert('삭제 실패', '삭제 중 오류가 발생하였습니다.');
                    }
                },
            },
        ]);
    };

    return (
        <Container>
            <Title>{habit.project}</Title>
            <Text>하루 목표: {habit.goal}</Text>
            <Text>목표 일수: {habit.date}</Text>
            <DeleteButton onPress={handleDeleteHabit} activeOpacity={0.8}>
                <Gradient colors={['#ff6f61', '#ff4d4d']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                    <MaterialIcons name="delete" size={20} color="#fff" />
                    <DeleteText>삭제</DeleteText>
                </Gradient>
            </DeleteButton>

            <ListContainer>
                {Array.from({ length: Math.ceil(checkboxes.length / 3) }).map((_, rowIndex) => (
                    <Row key={rowIndex}>
                        {checkboxes.slice(rowIndex * 3, rowIndex * 3 + 3).map((item, index) => (
                            <CheckboxItem key={rowIndex * 3 + index}>
                                <CheckboxIcon onPress={() => handleCheckboxToggle(rowIndex * 3 + index)}>
                                    <MaterialIcons
                                        name={item ? 'check-box' : 'check-box-outline-blank'}
                                        size={24}
                                        color={item ? '#333' : '#ccc'}
                                    />
                                </CheckboxIcon>
                                <ItemText>{`${rowIndex * 3 + index + 1} 회차`}</ItemText>
                            </CheckboxItem>
                        ))}
                    </Row>
                ))}
            </ListContainer>
        </Container>
    );
};

export default HabitDetail;
