import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components/native';
import { colors } from '../../assets';
import BottomSheet from '../BottomSheet';
import ButtonComponent from '../ButtonComponent';

const ButtonSearch = ({ isEmpty, onClose, onConfirm }) => {
  const RBSheetRef = useRef();
  const result = useRef({});
  const [tableName, setTableName] = useState('');
  const [seatNumber, setSeatNumber] = useState('0');
  const [isResult, setIsResult] = useState(null);

  useEffect(() => {
    _onSearch();
  }, [isEmpty]);

  const _onSetSeat = (action) => {
    if (action === 1) {
      +seatNumber > 0 &&
        setSeatNumber((seatCur) => {
          const number = +seatCur - 1;
          return number.toString();
        });
    } else {
      setSeatNumber((seatCur) => {
        const number = +seatCur + 1;
        return number.toString();
      });
    }
  };

  const _onClose = () => {
    setIsResult(false);
    setTableName('');
    setSeatNumber('0');
    onClose();
  };

  const _onSearch = () => {
    RBSheetRef.current.close();
    const seatCount = +seatNumber;
    result.current = { name: tableName, seat: seatCount };
    setIsResult(true);
    onConfirm(tableName, seatCount, isEmpty);
  };

  const _renderSearch = () => {
    const { name, seat } = result.current;

    if (!isResult) return <Space />;
    if (!name && seat === 0) return <Space />;

    const nameTitle = name && `Bàn ${name}`;
    const seatTitle = seat > 0 && `Số ghế ${seat}`;
    const title1 = nameTitle && seatTitle && `${nameTitle} | ${seatTitle}`;
    const title2 = title1 || nameTitle || seatTitle;

    return <BtnResult title={title2} onPress={_onClose} />;
  };

  return (
    <Wrapper>
      <RowWrap isBottom>
        {_renderSearch()}

        <BtnSearch onPress={() => RBSheetRef.current.open()} />
      </RowWrap>

      <BottomSheet setRef={RBSheetRef}>
        <BarWrap />
        <BodyWrap>
          <InputName
            value={tableName}
            onChangeText={(name) => setTableName(name)}
          />

          <RowWrap isTop>
            <Row>
              <TextSeat>Số lượng </TextSeat>
              <BtnMinus onPress={() => _onSetSeat(1)} />
              <InputSeat
                value={seatNumber}
                onChangeText={(seat) => setSeatNumber(seat)}
              />
              <BtnPlus onPress={() => _onSetSeat(2)} />
            </Row>

            <Search onPress={_onSearch} />
          </RowWrap>
        </BodyWrap>
      </BottomSheet>
    </Wrapper>
  );
};

const Wrapper = styled.View``;

const BtnResult = styled(ButtonComponent).attrs(() => ({
  iconName: 'close',
  iconColor: colors.RED,
  isIconRight: true,
  rowItem: true,
}))``;

const BtnSearch = styled(ButtonComponent).attrs(() => ({
  title: 'Tìm kiếm theo',
  iconName: 'search',
  titleColor: colors.PRIMARY,
  iconColor: colors.PRIMARY,
  iconSize: 18,
  iconStyle: {
    marginRight: 5,
  },
  // backgroundColor: colors.ORANGE
}))`
  flex-direction: row;
  align-items: center;
`;

const BarWrap = styled.StatusBar.attrs(() => ({
  backgroundColor: '#00000076',
}))``;

const BodyWrap = styled.View`
  flex: 1;
  padding: 10px;
`;

const InputName = styled.TextInput.attrs(() => ({
  placeholder: 'Nhập tên bàn',
}))`
  border: 0.5px solid ${colors.BG_GRAY};
  border-radius: 5px;
  padding: 10px 15px;
`;

const RowWrap = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: ${(props) => (props.isTop ? '10px' : 0)};
  margin-bottom: ${(props) => (props.isBottom ? '10px' : 0)};
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
`;

const TextSeat = styled.Text``;

const BtnMinus = styled(ButtonComponent).attrs(() => ({
  iconName: 'minus-circle',
  iconColor: colors.ORANGE,
  iconSize: 25,
}))``;

const InputSeat = styled.TextInput.attrs(() => ({
  keyboardType: 'numeric',
}))`
  border: 0.5px solid ${colors.BG_GRAY};
  padding: 5px 10px;
  margin-left: 5px;
  margin-right: 5px;
  text-align: center;
  border-radius: 5px;
  font-weight: bold;
`;

const BtnPlus = styled(ButtonComponent).attrs(() => ({
  iconName: 'plus-circle',
  iconColor: colors.ORANGE,
  iconSize: 25,
}))``;

const Search = styled(ButtonComponent).attrs(() => ({
  title: 'Tìm kiếm',
  iconName: 'search',
  titleColor: colors.ORANGE,
  iconColor: colors.ORANGE,
  iconStyle: {
    marginRight: 5,
  },
}))`
  flex-direction: row;
  align-items: center;
  border: 0.5px solid ${colors.ORANGE};
  padding: 5px 10px;
  border-radius: 5px;
  align-self: flex-end;
`;

const Space = styled.View`
  flex: 1;
`;

export default ButtonSearch;
