import React, {useRef, useState} from 'react';
import styled from 'styled-components/native';
import {colors} from '../../assets';
import {FormatNumber} from '../../untils';
import ButtonComponent from '../ButtonComponent';
import TextComponent from '../TextComponent';

const SplitTheMoney = ({money}) => {
  const [moneyCur, setMoneyCur] = useState(money);
  const [count, setCount] = useState(1);

  const _onPlus = () => {
    if (moneyCur === 0) return;
    const countCur = count + 1;
    setCount(countCur);
    setMoneyCur(Math.floor(money / countCur));
  };
  const _onMinus = () => {
    if (count === 1) return;
    const countCur = count - 1;
    setCount(countCur);
    setMoneyCur(Math.floor(money / countCur));
  };

  return (
    <Container>
      <TextComponent heavy>Số tiền của mỗi người</TextComponent>
      <RowWrapper>
        <TextComponent>Số người</TextComponent>
        <CountWrapper>
          <ButtonComponent
            onPress={_onMinus}
            iconName="minus-circle"
            iconColor={colors.ORANGE}
          />
          <TextComponent width={30} center>
            {count}
          </TextComponent>
          <ButtonComponent
            onPress={_onPlus}
            iconName="plus-circle"
            iconColor={colors.ORANGE}
          />
        </CountWrapper>
      </RowWrapper>
      <RowWrapper>
        <TextComponent>Mỗi người</TextComponent>
        <TextComponent color={colors.ORANGE} heavy>
          <FormatNumber value={moneyCur} />
        </TextComponent>
      </RowWrapper>
    </Container>
  );
};

export default SplitTheMoney;

const Container = styled.View`
  background-color: ${colors.WHITE};
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 20px;
`;

const RowWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
`;

const CountWrapper = styled.View`
  flex-direction: row;
  align-items: center;
`;
