import React from 'react';
import styled from 'styled-components/native';
import { Image } from 'react-native'
import { colors, images } from '../../assets';
import ButtonComponent from '../ButtonComponent';
import TextComponent from '../TextComponent';

const NoDataComponent = ({ title, onRefresh }) => {
  return (
    <EmptyWrap>
      <IconEmpty source={images.NO_DATA} />
      <TextComponent heavy medium>
        {title}
      </TextComponent>
      <ButtonComponent
        onPress={onRefresh}
        iconName="refresh"
        iconColor={colors.ORANGE}
        iconSize={28}
        mTop={10}
      />
    </EmptyWrap>
  );
};

export default NoDataComponent;

const IconEmpty = styled.Image`
margin-bottom:15px;
`
const EmptyWrap = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
