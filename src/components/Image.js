import React, { useEffect } from "react";
import styled from "styled-components/native";
import PropTypes from "prop-types";
import { MaterialIcons } from '@expo/vector-icons';
import { Alert, Platform } from "react-native";
import * as ImagePicker from 'expo-image-picker';

// styled: 컨테이너 스타일 //
const Container = styled.View`
    align-self: center;
    margin-bottom: 30px;
`;

// styled: 이미지 스타일 //
const StyledImage = styled.Image`
    background-color: ${({ theme }) => theme.imageBackground};
    width: 100px;
    height: 100px;
    border-radius: ${({ rounded }) => (rounded ? 50 : 0)}px;
`;

// styled: 버튼 컨테이너 스타일 //
const ButtonContainer = styled.TouchableOpacity`
    background-color: ${({ theme }) => theme.imageButtonBackground};
    position: absolute;
    bottom: 0;
    right: 0;
    width: 30px;
    height: 30px;
    border-radius: 15px;
    justify-content: center;
    align-items: center;
`;

// styled: 버튼 아이콘 스타일 //
const ButtonIcon = styled(MaterialIcons).attrs({
    name: 'photo-camera',
    size: 22,
})`
    color: ${({ theme }) => theme.imageButtonIcon};
`;

// component: PhotoButton //
const PhotoButton = ({ onPress }) => {
    
    // render: PhotoButton 컴포넌트 렌더링 //
    return (
        <ButtonContainer onPress={onPress}>
            <ButtonIcon />
        </ButtonContainer>
    );
};

// component: Image //
const Image = ({ url, imageStyle, rounded, showButton = false, onChangeImage = () => { } }) => {

    // effect: 권한 요청 //
    useEffect(() => {
        (async () => {
            try {
                if (Platform.OS === 'ios') {
                    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                    if (status !== 'granted') {
                        Alert.alert(
                            'Photo Permission',
                            'Please turn on the camera roll permissions.'
                        );
                    }
                }
            } catch (e) {
                Alert.alert('Photo Permission Error', e.message);
            }
        })();
    }, []);

    // function: 이미지 편집 버튼 핸들러 //
    const handleEditButton = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });

            if (!result.canceled) {
                onChangeImage(result.uri);
            }
            // expo-image-picker의 최신 버전은 result.uri 대신 result.assets[0].uri를 사용한다.
            // 반환된 result.assets는 선택된 이미지들의 배열이다. 일반적으로 첫 번째 이미지를 사용한다.
            onChangeImage(result.assets[0].uri);
        } catch (e) {
            Alert.alert('Pho to Error.', e.message);
        }
    };

    // render: Image 컴포넌트 렌더링 //
    return (
        <Container>
            <StyledImage source={{ uri: url }} style={imageStyle} rounded={rounded} />
            {showButton && <PhotoButton onPress={handleEditButton} />}
        </Container>
    );
};

Image.propTypes = {
    uri: PropTypes.string,
    imageStyle: PropTypes.object,
    rounded: PropTypes.bool,
    showButton: PropTypes.bool,
    onChangeImage: PropTypes.func,
};

export default Image;