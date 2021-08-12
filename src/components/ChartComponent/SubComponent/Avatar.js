import React from 'react';
import styled from 'styled-components/native';
import {images} from './../../../assets/'

const Container = styled.View`
  width: 50px;
  height: 50px;
  align-items:center;
  justify-content:center;
`
const Image = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 20px;
`;
const Avatar = ({ imageSource }) => {
  const srcImg = imageSource === "" ? images.AVATAR : {uri:imageSource}
  return (
    <Container>
      <Image source={srcImg} />
    </Container>
  );
};
export default Avatar;