import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
`;

export const Body = styled.View`
  flex: 1;
  padding: 12px;
  background-color: #fff;
`;

export const RowItem = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const Text = styled.Text`
  color: black;
`;

export const SpaceHeader = styled.View`
  height: 10px;
`;

export const BtnCheck = styled.Pressable`
 flex-direction:row;
  align-items:center;
  justify-content:center;
  border:1px solid #0972FF;
  border-radius:5px;
  padding:7px 10px;
`;

export const ListData = styled.FlatList``;

export const Separator = styled.View`
  height: 15px;
`;

export const ItemWrap = styled.Pressable`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-top: 15px;
  border-top-width: 0.5px;
`;

export const NameFoodWrap = styled.View`
  flex-direction: row;
  align-items: center;
  margin-left: 8px;
`;

export const TextFood = styled.Text`
  margin-right: 5px;
  color: black;
`;

export const TextQty = styled.Text`
  color: orange;
  font-weight: 700;
  font-size: 15px;
`;

export const SpaceItem = styled.View`
  width: 100%;
  height: 1px;
  background-color: gray;
`;

export const BtnIcon = styled.Pressable`
  padding-left: 4px;
  padding-right: 4px;
`;
