import styled from 'styled-components/native';
import colors from '../../../assets/colors';

export const Wrapper = styled.View`
  flex: 1;
`;

export const Container = styled.ImageBackground`
  flex: 1;
`;

export const AreaView = styled.SafeAreaView`
  flex: 0;
`;

export const BodyWrap = styled.View`
  flex: 1;
`;

export const HeadingWrap = styled.View`
  flex: 3;
  justify-content: center;
  align-items: center;
`;

export const Logo = styled.Image`
  width: 100%;
  height: 100%;
`;

export const FormWrap = styled.View`
  flex: 6;
  align-items: center;
  padding-top: 50px;
`;

export const InputName = styled.TextInput`
  border-radius: 10px;
  background-color: ${colors.WHITE};
  width: 80%;
  height: 50px;
  padding-left: 10px;
  padding-right: 10px;
  margin-bottom: 20px;
`;

export const PassWrap = styled.View`
  border-radius: 10px;
  background-color: ${colors.WHITE};
  width: 80%;
  height: 50px;
  margin-bottom: 30px;
  padding-left: 10px;
  padding-right: 10px;
  flex-direction: row;
  align-items: center;
`;

export const InputPass = styled.TextInput`
  flex: 1;
`;

export const FootWrap = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  bottom: ${Platform.OS === 'ios' ? '20px' : '10px'};
  justify-content: center;
  align-items: center;
`;
