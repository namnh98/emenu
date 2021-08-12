import React, {useRef, useState, useEffect} from 'react';
import Modal from 'react-native-modal';
import styled from 'styled-components/native';
import {colors} from '../../assets';
import ButtonComponent from '../ButtonComponent';
import TextComponent from '../TextComponent';
import {Dimensions} from 'react-native';
import {FormatNumber} from '../../untils';
import {useSelector} from 'react-redux';
const DATA = [5, 10, 30, 50, 100, 'Khác'];

const ModalEnterQty = ({useVisible, item, onConfirm}) => {
  const {count, is_open_price, sale_price, unit_item} = item || {};
  const [isVisible, setIsVisible] = useVisible || [];
  const [qty, setQty] = useState(count || item?.qty || '');
  const [price, setPrice] = useState(
    sale_price || item?.price || '',
  );
  const [selected, setSelected] = useState();
  const curIndex = DATA.findIndex(data => data === selected);
  const {partners} = useSelector(s => s);
  const textAlert = useRef('');
  const _onModalShow = () => {
    if (count > 0 || item.qty > 0) {
      setPrice(sale_price || item?.price);
      const dataCheck = DATA.find(value => value === count);
      if (dataCheck) {
        setQty('');
        setSelected(dataCheck);
      } else {
        setSelected('Khác');
        setQty(count || item.qty);
      }
    }
  };

  const _onClose = () => setIsVisible(false);

  const _onChangePrice = text => {
    let c = text.slice(text.length - 1);
    if ((c >= '0' && c <= '9') || text === '') {
      setPrice(text);
    } else {
      return;
    }
  };
  const onclose = () => {
    setPrice('');
    setQty('');
  };
  const _onChangeQty = text => {
    let c = text.slice(text.length - 1);
    if (
      (c >= '0' && c <= '9') ||
      text === '' ||
      (unit_item?.qty_type === 1 &&
        c === '.' &&
        text.split('.').length - 1 <= 1)
    ) {
      setQty(text);
    } else {
      return;
    }
  };

  const _onSelected = item => {
    setQty('');
    setSelected(item);
  };

  const _onConfirm = () => {
    if (price <= 0 && qty <= 0) {
      textAlert.current = 'Giá và số lượng chưa nhập !';
    } else if (price > 0 && qty > 0) {
      _onClose();
    }

    if (is_open_price) {
      setQty('');
      return onConfirm(qty, price);
    }
    const newSelect = curIndex === 5 ? 0 : selected;
    const value = qty || newSelect;
    onConfirm(value || 0);
    _onClose();
  };

  const _renderContent1 = () => {
    return (
      <Wrapper>
        <TextComponent center heavy medium upperCase>
          Nhập số lượng
        </TextComponent>
        <OptionWrap>
          {DATA.map((item, index) => (
            <Option
              key={index}
              isSelected={selected === item}
              onPress={() => _onSelected(item)}>
              <TextComponent>{item}</TextComponent>
            </Option>
          ))}
        </OptionWrap>
        {curIndex === 5 && <InputQty value={qty} onChangeText={_onChangeQty} />}
        <RowWrap>
          <BtnCancel color={colors.RED} onPress={_onClose} />
          <BtnConfirm color={colors.PRIMARY} onPress={_onConfirm} />
        </RowWrap>
      </Wrapper>
    );
  };

  const _renderContent2 = () => {
    return (
      <Wrapper>
        <TextComponent center heavy medium upperCase>
          Nhập giá và số lượng
        </TextComponent>
        <TextComponent heavy mLeft={2} mTop={8}>
          Giá ({partners?.currency?.name_vn || ''})
        </TextComponent>
        <InputPrice value={price} onChangeText={_onChangePrice} />
        {price && price <= 0 ? (
          <TextComponent mTop={5} color="red">
            Giá phải lớn hơn 0
          </TextComponent>
        ) : null}
        <TextComponent heavy mLeft={2} mTop={8}>
          Số lượng ({unit_item?.name || ''})
        </TextComponent>
        <TextComponent mLeft={2} mTop={0} italic color={colors.RED}>
          {unit_item.qty_type === 1
            ? '* Bạn được phép nhập số thập phân, ví dụ 1.2,...'
            : '* Bạn không được phép nhập số thập phân, ví dụ 1.2,...'}
        </TextComponent>
        <InputQty value={qty} onChangeText={_onChangeQty} />
        {qty && qty <= 0 ? (
          <TextComponent mTop={5} color="red">
            Số lượng phải lớn hơn 0
          </TextComponent>
        ) : null}
        <RowWrap>
          <BtnCancel color={colors.RED} onPress={_onClose} />
          <BtnConfirm color={colors.PRIMARY} onPress={_onConfirm} />
        </RowWrap>
        {price && price <= 0 && qty && qty <= 0 ? (
          <TextComponent mTop={5} color="red">
            {textAlert.current}
          </TextComponent>
        ) : null}
      </Wrapper>
    );
  };
  const deviceWidth = Dimensions.get('window').width;
  const deviceHeight =
    Platform.OS === 'ios'
      ? Dimensions.get('window').height
      : require('react-native-extra-dimensions-android').get(
          'REAL_WINDOW_HEIGHT',
        );
  return (
    <Modal
      deviceWidth={deviceWidth}
      deviceHeight={deviceHeight}
      isVisible={isVisible}
      statusBarTranslucent
      animationIn="zoomInDown"
      animationOut="zoomOutDown"
      animationOutTiming={100}
      onBackdropPress={_onClose}
      onModalWillShow={_onModalShow}
      onModalHide={onclose}
      useNativeDriver
      hideModalContentWhileAnimating>
      {is_open_price ? _renderContent2() : _renderContent1()}
    </Modal>
  );
};

const Wrapper = styled.View`
  background-color: ${colors.WHITE};
  padding: 15px;
  border-radius: 5px;
`;

const OptionWrap = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 10px;
`;

const Option = styled.TouchableOpacity`
  width: 30%;
  height: 50px;
  background-color: ${props =>
    props.isSelected ? colors.PRIMARY : colors.GRAY};
  padding: 10px;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  border-radius: 5px;
`;

const InputQty = styled.TextInput.attrs(() => ({
  placeholder: 'Nhập số lượng',
  keyboardType: 'numeric',
}))`
  background-color: ${colors.GRAY};
  border-radius: 5px;
  padding: 10px;
  margin-top: 5px;
`;

const InputPrice = styled.TextInput.attrs(() => ({
  placeholder: 'Nhập giá',
  keyboardType: 'numeric',
}))`
  background-color: ${colors.GRAY};
  border-radius: 5px;
  padding: 10px;
  margin-top: 5px;
`;

const RowWrap = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 15px;
`;

const Button = styled(ButtonComponent).attrs(() => ({}))`
  background-color: ${props => props.color || colors.WHITE};
  padding: 10px 15px;
  border-radius: 20px;
`;

const BtnCancel = styled(Button).attrs(() => ({
  title: 'Huỷ bỏ',
  titleColor: colors.WHITE,
}))`
  margin-right: 10px;
`;

const BtnConfirm = styled(Button).attrs(() => ({
  title: 'Đồng ý',
  titleColor: colors.WHITE,
}))``;

export default ModalEnterQty;
