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

const Container = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: ${({ theme }) => theme.background};
    padding: 0 20px;
    padding-top: ${({ insets: { top } }) => top}px;
    padding-bottom: ${({ insets: { bottom } }) => bottom}px;
`;

const ErrorText = styled.Text`
    align-itmes: flex-start;
    width: 100%;
    height: 20px;
    margin-bottom: 10px;
    line-height: 20px;
    color: ${({ theme }) => theme.errorText};
`;

const Login = ({ navigation }) => {

    const { dispatch } = useContext(UserContext);

    const { spinner } = useContext(ProgressContext);

    const insets = useSafeAreaInsets();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const passwrodRef = useRef();
    const [errorMessage, setErrorMessage] = useState('');
    const [disabled, setDisabled] = useState(true);

    useEffect(() => {
        setDisabled(!(email && password && !errorMessage));
    }, [email, password, errorMessage]);

    const _handleEmailChange = email => {
        const changedEmail = removeWhitespace(email);
        setEmail(changedEmail);
        setErrorMessage(
            validateEmail(changedEmail) ? '' : '이메일을 입력하세요.'
        );
    };

    const _handlePasswordChange = password => {
        setPassword(removeWhitespace(password));
    }

    const _handleLoginButtonPress = async () => {
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
                    onChangeText={_handleEmailChange}
                    onSubmitEditing={() => passwrodRef.current.focus()}
                    placeholder="이메일을 입력하세요."
                    returnKeyType="next"
                />
                <Input
                    ref={passwrodRef}
                    label="비밀번호"
                    value={password}
                    onChangeText={_handlePasswordChange}
                    onSubmitEditing={_handleLoginButtonPress}
                    placeholder="비밀번호를 입력하세요."
                    returnKeyType="done"
                    isPassword
                />
                <ErrorText>{errorMessage}</ErrorText>
                <Button
                    title="로그인"
                    onPress={_handleLoginButtonPress}
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