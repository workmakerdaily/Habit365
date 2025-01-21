import React, { useContext } from "react";
import { ActivityIndicator } from "react-native";
import styled, { ThemeContext } from "styled-components/native";

// styled: 컨테이너 스타일 //
const Container = styled.View`
    position: absolute;
    z-index: 2;
    opacity: 0.3;
    width: 100%;
    height: 100%;
    justify-content: center;
    background-color: ${({ theme }) => theme.spinnerBackground};
`;

// component: Spinner //
const Spinner = () => {

    const theme = useContext(ThemeContext);

    // render: Spinner 컴포넌트 렌더링 //
    return (
        <Container>
            <ActivityIndicator size={'large'} color={theme.spinnerIndicator} />
        </Container>
    );
};

export default Spinner;