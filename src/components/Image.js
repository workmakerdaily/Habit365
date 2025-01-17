import React, { useEffect } from "react";
import styled from "styled-components/native";
import PropTypes from "prop-types";
import { MaterialIcons } from '@expo/vector-icons';
import { Alert, Platform } from "react-native";
import * as ImagePicker from 'expo-image-picker';

const Container = styled.View`
    align-self: center;
    margin-bottom: 30px;
`;

const StyledImage = styled.Image`
    background-color: ${({ theme }) => theme.imageBackground};
    width: 100px;
    height: 100px;
    border-radius: ${({ rounded }) => (rounded ? 50 : 0)}px;
`;

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

const ButtonIcon = styled(MaterialIcons).attrs({
    name: 'photo-camera',
    size: 22,
})`
    color: ${({ theme }) => theme.imageButtonIcon};
`;

const PhotoButton = ({ onPress }) => {
    return (
        <ButtonContainer onPress={onPress}>
            <ButtonIcon />
        </ButtonContainer>
    );
};

const Image = ({ url, imageStyle, rounded, showButton = false, onChangeImage = () => { } }) => {

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

    const _handleEditButton = async () => {
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

    return (
        <Container>
            <StyledImage source={{ uri: url }} style={imageStyle} rounded={rounded} />
            {showButton && <PhotoButton onPress={_handleEditButton} />}
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