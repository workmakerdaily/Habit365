import React, { useEffect, useRef, useState, useContext } from "react";
import styled from "styled-components/native";
import { Text } from "react-native";
import { removeWhitespace, validateEmail } from "../utils/common";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Image, Input, Button } from "../components";
import { images } from "../utils/images";
import { Alert } from "react-native";
import { signup } from "../utils/firebase";
import { ProgressContext, UserContext } from "../contexts";

// styled: 컨테이너 스타일 //
const Container = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: ${({ theme }) => theme.background};
    padding: 40px 20px;
`;

// styled: 에러 텍스트 스타일 //
const ErrorText = styled.Text`
    align-items: center;
    width: 100%;
    height: 20px;
    margin-bottom: 10px;
    line-height: 20px;
    color: ${({ theme }) => theme.errorText};
`;

// component: Signup 함수 //
const Signup = () => {

    // context: 사용자 및 진행 상태 컨텍스트 //
    const { dispatch } = useContext(UserContext);
    const { spinner } = useContext(ProgressContext);

    // state: 입력 데이터 상태 //
    const [photoUrl, setPhotoUrl] = useState(images.photo);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [disabled, setDisabled] = useState(true);

    // ref: 입력 필드 참조 //
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const didMountRef = useRef();

    // effect: 입력값 유효성 검사 //
    useEffect(() => {
        if (didMountRef.current) {
            let _errorMessage = '';

            if (!name) {
                _errorMessage = '이름을 입력하세요.';
            } else if (!validateEmail(email)) {
                _errorMessage = '이메일을 입력하세요.';
            } else if (password.length < 6) {
                _errorMessage = '여섯 자 이상을 입력하세요.';
            } else if (password !== passwordConfirm) {
                _errorMessage = '동일한 비밀번호를 입력하세요.';
            } else {
                _errorMessage = '';
            }
            setErrorMessage(_errorMessage);
        } else {
            didMountRef.current = true;
        }
    }, [name, email, password, passwordConfirm]);

    // effect: 버튼 활성화 상태 관리 //
    useEffect(() => {
        setDisabled(
            !(name && email && password && passwordConfirm && !errorMessage)
        );
    }, [name, email, password, passwordConfirm, errorMessage]);

    // event handler: 회원가입 버튼 클릭 이벤트 처리 //
    const handleSignupButtonPress = async () => {
        try {
            spinner.start();
            const user = await signup({ email, password, name, photoUrl});
            dispatch(user);
        } catch (e) {
            Alert.alert('Signup Error', e.message);
        } finally {
            spinner.stop();
        }
    };

    // render: Signup 화면 렌더링 //
    return (
        <KeyboardAwareScrollView extraScrollHeight={20}>
            <Container>
                <Image 
                rounded 
                url={photoUrl} 
                showButton
                onChangeImage={url => setPhotoUrl(url)}
                />
                <Input
                    label="이름"
                    value={name}
                    onChangeText={text => setName(text)}
                    onSubmitEditing={() => {
                        setName(name.trim());
                        emailRef.current.focus();
                    }}
                    onBlur={() => setName(name.trim())}
                    placeholder="이름을 입력하세요."
                    returnKeyType="next"
                />
                <Input
                    ref={emailRef}
                    label="이메일"
                    value={email}
                    onChangeText={text => setEmail(removeWhitespace(text))}
                    onSubmitEditing={() => passwordRef.current.focus()}
                    placeholder="이메일을 입력하세요."
                    returnKeyType="next"
                />
                <Input
                    ref={passwordRef}
                    label="비밀번호"
                    value={password}
                    onChangeText={text => setPassword(removeWhitespace(text))}
                    onSubmitEditing={() => passwordConfirmRef.current.focus()}
                    placeholder="비밀번호를 입력하세요"
                    returnKeyType="done"
                    isPassword
                />
                <Input
                    ref={passwordConfirmRef}
                    label="비밀번호 확인"
                    value={passwordConfirm}
                    onChangeText={text => setPasswordConfirm(removeWhitespace(text))}
                    onSubmitEditing={handleSignupButtonPress}
                    placeholder="위와 동일한 비밀번호를 입력해주세요."
                    returnKeyType="done"
                    isPassword
                />
                <ErrorText>{errorMessage}</ErrorText>
                <Button
                    title="회원가입"
                    onPress={handleSignupButtonPress}
                    disabled={disabled}
                />
            </Container>
        </KeyboardAwareScrollView>
    );
};

export default Signup;