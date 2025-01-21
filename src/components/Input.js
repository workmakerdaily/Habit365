import React, { useState, forwardRef } from "react";
import styled from "styled-components/native";
import PropTypes from "prop-types";

// styled: 컨테이너 스타일 //
const Container = styled.View`
    flex-direction: column;
    width: 100%;
    margin-bottom: 20px;
`;

// styled: 라벨 스타일 //
const Label = styled.Text`
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 8px;
    color: ${({ theme }) => theme.text};
`;

// styled: 텍스트 입력 스타일 //
const StyledTextInput = styled.TextInput.attrs(({ theme }) => ({
    placeholderTextColor: theme.inputPlaceholder,
}))`
    color: ${({ theme }) => theme.text};
    padding: 12px 0;
    font-size: 16px;
    border-bottom-width: 1px;
    border-bottom-color: ${({ theme, isFocused }) =>
        isFocused ? theme.inputBorderActive : theme.inputBorder};
`;

// component: Input //
const Input = forwardRef(
    (
        {
            label,
            value,
            onChangeText = () => {},
            onSubmitEditing = () => {},
            onBlur = () => {},
            placeholder,
            isPassword,
            returnKeyType,
            maxLength,
            disabled,
        },
        ref
    ) => {
        // state: 포커스 상태 //
        const [isFocused, setIsFocused] = useState(false);

        // render: Input 컴포넌트 렌더링 //
        return (
            <Container>
                <Label>{label}</Label>
                <StyledTextInput
                    ref={ref}
                    isFocused={isFocused}
                    value={value}
                    onChangeText={onChangeText}
                    onSubmitEditing={onSubmitEditing}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => {
                        setIsFocused(false);
                        onBlur();
                    }}
                    placeholder={placeholder}
                    secureTextEntry={isPassword}
                    returnKeyType={returnKeyType}
                    maxLength={maxLength}
                    autoCapitalize="none"
                    autoCorrect={false}
                    textContentType="none" // iOS only
                    underlineColorAndroid="transparent" // Android only
                    editable={!disabled}
                />
            </Container>
        );
    }
);

Input.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChangeText: PropTypes.func,
    onSubmitEditing: PropTypes.func,
    onBlur: PropTypes.func,
    placeholder: PropTypes.string,
    isPassword: PropTypes.bool,
    returnKeyType: PropTypes.oneOf(["done", "next"]),
    maxLength: PropTypes.number,
    disabled: PropTypes.bool,
};

export default Input;
