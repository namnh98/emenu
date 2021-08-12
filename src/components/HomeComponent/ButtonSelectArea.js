import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components/native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {colors, images} from '../../assets';

const ButtonSelectArea = ({areaName, onSelectArea, showIcon}) => {
  return (
    <Container onPress={onSelectArea}>
      <Title numberOfLines={1} ellipsizeMode="tail">
        {areaName || ''}
      </Title>
      {showIcon && (
        <FontAwesome5
          name="pen"
          color={colors.ORANGE}
          size={17}
          style={{marginLeft: 5}}
        />
      )}
    </Container>
  );
};

ButtonSelectArea.prototype = {
  areaName: PropTypes.string,
  onSelectArea: PropTypes.func,
};

export default ButtonSelectArea;

const Container = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  background-color: ${colors.WHITE};
  height: 40px;
  width: 50%;
  padding-horizontal: 10px;
`;

const Title = styled.Text`
  font-size: 16px;
  font-weight: 500;
  font-weight: bold;
`;
