import React from 'react';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { images } from '../utils/images';

// styled: 아이콘 스타일 //
const Icon = styled.Image`
    tint-color: ${({ theme }) => theme.text};
    width: 30px;
    height: 30px;
    margin: 10px;
`;

// component: IconButton //
const IconButton = ({ type, onPressOut }) => {

    // render: IconButton 컴포넌트 렌더링 //
    return (
        <TouchableOpacity onPressOut={onPressOut}>
            <Icon source={type} />
        </TouchableOpacity>
    );
};

IconButton.propTypes = {
    type: PropTypes.oneOf(Object.values(images)).isRequired,
    onPressOut: PropTypes.func,
};

export default IconButton;