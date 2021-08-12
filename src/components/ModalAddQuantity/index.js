import React, {useState} from 'react';
import {ActivityIndicator} from 'react-native';
import Modal from 'react-native-modal';
import {colors} from '../../assets';
import HeaderPopup from '../HeaderPopup';
import TextComponent from '../TextComponent';
import {
  Confirm,
  Container,
  ContentWrapper,
  Minus,
  Option,
  Plus,
} from './styles';

const ModalAddQuantity = ({
  isVisible,
  itemSelect,
  loading,
  onClosePopup,
  onConfirm,
}) => {
  const [count, setCount] = useState(0);

  const _onModalWillShow = () => {
    setCount(itemSelect.countRate);
  };

  const _onMinus = () => {
    if (count === 0) return;
    setCount(count - 1);
  };
  const _onPlus = () => setCount(count + 1);

  return (
    <Modal
      backdropColor={'transparent'}
      style={{margin: 0, backgroundColor: 'rgba(0,0,0,.6)'}}
      isVisible={isVisible}
      onBackdropPress={onClosePopup}
      onModalWillShow={_onModalWillShow}
      statusBarTranslucent
      animationIn="zoomInDown"
      animationOut="zoomOutDown"
      useNativeDriver
      hideModalContentWhileAnimating>
      <Container>
        <HeaderPopup title="Số suất" onClose={onClosePopup} />

        <ContentWrapper>
          <Option>
            <TextComponent mRight={10}>Số lượng</TextComponent>

            <Minus onPress={_onMinus} />
            <TextComponent heavy medium marginH={8}>
              {count}
            </TextComponent>
            <Plus onPress={_onPlus} />

            <TextComponent mLeft={10}>Suất</TextComponent>
          </Option>

          <Confirm onPress={() => onConfirm(count)}>
            {loading ? (
              <ActivityIndicator color={colors.WHITE} size="small" />
            ) : (
              <TextComponent color={colors.WHITE}>Đồng ý</TextComponent>
            )}
          </Confirm>
        </ContentWrapper>
      </Container>
    </Modal>
  );
};

export default ModalAddQuantity;
