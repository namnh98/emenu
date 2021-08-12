import PropTypes from 'prop-types';
import React from 'react';
import {Dimensions} from 'react-native';
import Modal from 'react-native-modal';
import styled from 'styled-components/native';
import {colors, images} from '../../assets';

const {width} = Dimensions.get('screen');

const Loading = ({isVisible}) => {
  return (
    <Modal
      style={{margin: 0}}
      isVisible={isVisible}
      statusBarTranslucent
      animationIn="fadeIn"
      animationInTiming={1}
      animationOut="fadeOut">
      <Container>
        <Image source={images.LOGO_LOADING} />
      </Container>
    </Modal>
  );
};

Loading.prototype = {
  isVisible: PropTypes.bool,
};

export default Loading;

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${colors.WHITE};
`;

const Image = styled.Image`
  width: ${width / 2}px;
  height: ${width / 2}px;
`;
