import styled from 'styled-components/native';
import colors from '../../assets/colors';

export const Container = styled.View`
  padding: 10px;
  background-color: ${colors.WHITE};
  margin-bottom: 1px;
`;

export const Wrapper = styled.View`
  align-items: center;
  flex-direction: row;
`;

export const Avatar = styled.Image`
  width: 100px;
  height: 80px;
  border-radius: 10px;
`;

export const Content = styled.View`
  flex: 1;
`;

export const PersonWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const Option = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 5px;
  margin-bottom: 5px;
`;

export const TakeAway = styled.View`
flex-direction: row;
align-items: center;
`;

export const NoteWrapper = styled.TouchableOpacity`
flex-direction: row;
height:45px;
align-items: center;
justify-content:flex-start;

`;

export const RowItem = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: ${(props) =>
    props.isBetween ? 'space-between' : 'flex-start'};
  margin-top: ${(props) => (props.isTop ? '5px' : 0)};
`;
