// function: 이벤트 유효성 검사 함수 //
export const validateEmail = email => {
    const regex = /^[0-9?A-z0-9?]+(\.)?[0-9?A-z0-9?]+@[0-9?A-z]+\.[A-z]{2}.?[A-z]{0,3}$/;

    return regex.test(email);
};

// function: 공백 제거 함수 //
export const removeWhitespace = text => {
    const regex = /\s/g;
    return text.replace(regex, '');
}