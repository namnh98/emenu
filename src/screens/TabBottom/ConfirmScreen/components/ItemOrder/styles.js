import styled from 'styled-components/native';

export const Container = styled.View`
  background-color: white;
  border-radius: 5px;
`;

export const Header = styled.View`
  padding: 10px;
`;

export const RowItem = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const Text = styled.Text`
  color: gray;
  font-size: 13px;
`;
export const SpaceHeader = styled.View`
  height: 10px;
`;

export const NameWrap = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  justify-content: center;
  align-items: center;
`;

export const TextName = styled.Text`
  font-weight: bold;
  font-size: 16px;
`;

export const Body = styled.View`
  background-color: #e6e6e6;
  padding: 12px;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
`;

export const ItemWrap = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-top-width: ${({ index }) => (index !== 0 ? '0.5px' : 0)};
  padding: 5px;
  padding-top: 10px;
  padding-bottom: 10px;
`;

export const BodyWrap = styled.View`
  background-color: white;
  border-radius: 5px;
`;

export const NameFoodWrap = styled.View`
  flex-direction: row;
  align-items: center;
  margin-left: 8px;
`;

export const TextFood = styled.Text`
  margin-right: 5px;
  color: gray;
`;

export const TextQty = styled.Text`
  color: orange;
  font-weight: 700;
  font-size: 15px;
`;

export const BtnMore = styled.Pressable`
  align-self: center;
  padding: 8px 8px 0 8px;
`;

export const TextMore = styled.Text`
  color: #0972ff;
  text-align: center;
`;

export const BtnCheck = styled.Pressable`
  flex-direction:row;
  align-items:center;
  justify-content:center;
  border:1px solid #0972FF;
  border-radius:5px;
  padding:7px 10px;
`;

export const BtnIcon = styled.Pressable`
  padding-left: 4px;
  padding-right: 4px;
`;
