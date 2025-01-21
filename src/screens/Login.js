import React, { useState, useRef, useEffect, useContext } from "react";
import styled from "styled-components/native";
import { Image, Input, Button, Spinner } from "../components";
import { images } from "../utils/images";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { validateEmail, removeWhitespace } from "../utils/common";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Alert } from "react-native";
import { login } from "../utils/firebase";
import { ProgressContext, UserContext } from "../contexts";

// styled: 컨테이너 스타일 //
const Container = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: ${({ theme }) => theme.background};
    padding: 0 20px;
    padding-top: ${({ insets: { top } }) => top}px;
    padding-bottom: ${({ insets: { bottom } }) => bottom}px;
`;

// styled: 에러 텍스트 스타일 //
const ErrorText = styled.Text`
    align-itmes: flex-start;
    width: 100%;
    height: 20px;
    margin-bottom: 10px;
    line-height: 20px;
    color: ${({ theme }) => theme.errorText};
`;

// component: Login 함수 //
const Login = ({ navigation }) => {

    // context: 사용자 및 진행 상태 컨텍스트 //
    const { dispatch } = useContext(UserContext);
    const { spinner } = useContext(ProgressContext);

    // variable: 안전 영역 삽입값 //
    const insets = useSafeAreaInsets();

    // state: 이메일, 비밀번호 및 상태 //
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [disabled, setDisabled] = useState(true);

    // ref: 비밀번호 입력 필드 참조 //
    const passwrodRef = useRef();

    // effect: 버튼 활성화 상태 관리 //
    useEffect(() => {
        setDisabled(!(email && password && !errorMessage));
    }, [email, password, errorMessage]);

    // function: 이메일 변경 처리 함수 //
    const handleEmailChange = email => {
        const changedEmail = removeWhitespace(email);
        setEmail(changedEmail);
        setErrorMessage(
            validateEmail(changedEmail) ? '' : '이메일을 입력하세요.'
        );
    };

    // function: 비밀번호 변경 처리 함수 //
    const handlePasswordChange = password => {
        setPassword(removeWhitespace(password));
    }

    // event handler: 로그인 버튼 클릭 이벤트 처리리 //
    const handleLoginButtonPress = async () => {
        try {
            spinner.start();
            const user = await login({ email, password });
            dispatch(user);
        } catch (e) {
            Alert.alert('Login Error', e.message);
        } finally {
            spinner.stop();
        }
    };

    // render: Login 렌더링 //
    return (
        <KeyboardAwareScrollView
            contentContainerStyle={{ flex: 1 }}
            extraScrollHeight={20}
        >
            <Container insets={insets}>
                <Image url={images.logo} imageStyle={{ borderRadius: 8 }} />
                <Input
                    label="이메일"
                    value={email}
                    onChangeText={handleEmailChange}
                    onSubmitEditing={() => passwrodRef.current.focus()}
                    placeholder="이메일을 입력하세요."
                    returnKeyType="next"
                />
                <Input
                    ref={passwrodRef}
                    label="비밀번호"
                    value={password}
                    onChangeText={handlePasswordChange}
                    onSubmitEditing={handleLoginButtonPress}
                    placeholder="비밀번호를 입력하세요."
                    returnKeyType="done"
                    isPassword
                />
                <ErrorText>{errorMessage}</ErrorText>
                <Button
                    title="로그인"
                    onPress={handleLoginButtonPress}
                    disabled={disabled}
                />
                <Button
                    title="회원가입"
                    onPress={() => navigation.navigate('Signup')}
                    isFilled={false}
                />
            </Container>
        </KeyboardAwareScrollView>
    );
};

export default Login;