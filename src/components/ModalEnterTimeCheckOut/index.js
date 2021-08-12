import React, {useState} from 'react';
import Modal from 'react-native-modal';
import styled from 'styled-components/native';
import {colors} from '../../assets';
import ButtonComponent from '../ButtonComponent';
import TextComponent from '../TextComponent';
import {Dimensions} from 'react-native';

const DATA = [10, 30, 60, ''];

const ModalEnterTimeCheckOut = ({
  visible,
  time,
  onConfirm,
  onChangeTime,
  onClose,
}) => {
  const [selected, setSelected] = useState();
  const curIndex = DATA.findIndex((data) => data === selected);

  const _onChangeTime = (text) => {
    let c = text.slice(text.length - 1);
    if ((c >= '0' && c <= '9') || text === '') {
      onChangeTime(text);
    } else {
      return;
    }
  };

  const _onSelected = (item) => {
    setSelected(item);
    onChangeTime(item.toString());
  };

  const _renderContent = () => {
    return (
      <Wrapper>
        <TextComponent center heavy medium upperCase>
          Check-out sau
        </TextComponent>
        <OptionWrap>
          {DATA.map((item, index) => (
            <Option
              key={index}
              isSelected={selected === item}
              onPress={() => _onSelected(item)}>
              <TextComponent>
                {index === 3 ? 'Khác' : `${item} (phút)`}
              </TextComponent>
            </Option>
          ))}
        </OptionWrap>
        {curIndex === 3 && (
          <InputQty value={time} onChangeText={_onChangeTime} />
        )}
        <RowWrap>
          <BtnCancel color={colors.RED} onPress={onClose} />
          <BtnConfirm color={colors.PRIMARY} onPress={onConfirm} />
        </RowWrap>
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
      isVisible={visible}
      statusBarTranslucent
      animationIn="zoomInDown"
      animationOut="zoomOutDown"
      animationOutTiming={100}
      onBackdropPress={onClose}
      useNativeDriver
      hideModalContentWhileAnimating>
      {_renderContent()}
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
  width: 45%;
  height: 50px;
  background-color: ${(props) =>
    props.isSelected ? colors.PRIMARY : colors.GRAY};
  padding: 10px;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  border-radius: 5px;
`;

const InputQty = styled.TextInput.attrs(() => ({
  placeholder: 'Nhập số phút',
  keyboardType: 'numeric',
}))`
  background-color: ${colors.GRAY};
  border-radius: 5px;
  padding: 10px;
  margin-top: 15px;
`;

const InputPrice = styled.TextInput.attrs(() => ({
  placeholder: 'Nhập giá',
  keyboardType: 'numeric',
}))`
  background-color: ${colors.GRAY};
  border-radius: 5px;
  padding: 10px;
  margin-top: 15px;
`;

const RowWrap = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 15px;
`;

const Button = styled(ButtonComponent).attrs(() => ({}))`
  background-color: ${(props) => props.color || colors.WHITE};
  padding: 10px 15px;
  border-radius: 20px;
`;

const BtnCancel = styled(Button).attrs(() => ({
  title: 'Huỷ bỏ',
  titleColor: colors.WHITE,
}))`
  margin-right: 10px;
  width: 40%;
  justify-content: center;
  align-items: center;
`;

const BtnConfirm = styled(Button).attrs(() => ({
  title: 'Xác nhận',
  titleColor: colors.WHITE,
}))`
  width: 40%;
  justify-content: center;
  align-items: center;
`;

export default ModalEnterTimeCheckOut;
