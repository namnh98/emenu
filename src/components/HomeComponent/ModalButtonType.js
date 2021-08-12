import PropTypes from 'prop-types';
import React, { useState, useEffect, useRef } from 'react';
import { Platform, StatusBar, View } from 'react-native';
import styled from 'styled-components/native';
import { colors } from '../../assets';
import I18n from '../../i18n';
import BottomSheet from '../BottomSheet';
import ButtonComponent from '../ButtonComponent';
import TextComponent from '../TextComponent';
import moment from 'moment';

import { Sizes } from '@dungdang/react-native-basic'
import { Dimensions } from 'react-native'
const { width, height } = Dimensions.get('window')

const ModalButtonType = ({
  isMerged,
  setRef,
  itemSelect,
  isEmptyTable,
  onPress,
  onCloseSheet,
  isDelOrder,
  isDelPayment,
  isHaveRequestIntoTable,
  orders,
  num,
  num2,
  timeUsed,
}) => {
  const timeInterval = useRef();
  const [usedTime, setUsedTime] = useState(0);



  const HEIGHT = isEmptyTable ? 350 : 450;
  const isPress = useRef(false)

  const isPaid = orders?.filter((item) => item.order_status?.id === 1).length;
  const _renderButtonEmpty = () => (
    <EmptyWrap>
      <Row>
        <BtnOrder onPress={() => onPress(1)} isRight />
        <BtnQrCode onPress={() => onPress(3)} />
      </Row>

      <Row>
        {isMerged ? (
          <BtnAddTable
            isRight
            onPress={() => {
              onPress(6);
            }}
          />
        ) : (
          <Space />
        )}
        {isMerged ? <BtnMerged onPress={() => onPress(4)} /> : <Space />}
      </Row>
      <Row>
        {isHaveRequestIntoTable ? (
          <BtnConfirmTable isRight onPress={() => onPress(2)} />
        ) : (
          <Space />
        )}
        {isMerged ? (
          <BtnSplit
            onPress={() => {
              onPress(5);
            }}
          />
        ) : (
          <Space />
        )}
      </Row>
    </EmptyWrap>
  );

  const _renderButtonUsed = () => (
    <UsedWrap>
      <Row>
        <BtnAddFood onPress={() => onPress(1)} isRight />
        <BtnPayment
          isDisable={isPaid === 0}
          onPress={() => {
            isPaid === 0 ? null : onPress(2);
          }}
        />
      </Row>

      <Row>
        <BtnChangeEmpty
          isDisable={!(isPaid === 0)}
          onPress={() => {
            isPaid === 0 ? onPress(3) : null;
          }}
          isRight
        />
        <BtnListOrder onPress={() => onPress(4)} />
      </Row>
      <Row>
        <BtnChangeTable isRight onPress={() => onPress(10)} />
        <BtnAddTable
          isDisable={isPaid === 0 && orders.length > 0}
          onPress={() => {
            isPaid === 0 && orders.length > 0 ? null : onPress(9);
          }}
        />
      </Row>

      {isMerged && (
        <Row>
          <BtnSplit
            isRight
            isDisable={isPaid === 0 && orders.length > 0}
            onPress={() => {
              isPaid === 0 && orders.length > 0 ? null : onPress(8);
            }}
          />
          <BtnMerged onPress={() => onPress(7)} />
        </Row>
      )}
      <Row>
        {isDelPayment ? (
          <BtnDeletePayment onPress={() => onPress(5)} />
        ) : (
          <Space />
        )}
        <Space />
      </Row>

      {/* <Row>
         <BtnChangeTable onPress={() => onPress(5)} isRight />
        <BtnDeleteOrder onPress={() => onPress(6)} />
      </Row> */}
    </UsedWrap>
  );

  return (
    <BottomSheet setRef={setRef} height={HEIGHT} onClose={onCloseSheet}>
      <Container showsVerticalScrollIndicator={false}>
        <StatusBar backgroundColor="#00000076" />

        <TextComponent center heavy medium numberLine={1} mTop={10}>
          {I18n.t('home.tableName')} {itemSelect?.name}
        </TextComponent>
        {isEmptyTable ? _renderButtonEmpty() : _renderButtonUsed()}
      </Container>
      {isEmptyTable ? null : (
        <View
          style={{
            backgroundColor: colors.ORANGE,
            width: 30,
            height: 30,
            borderRadius: 30,
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: width * 0.9,
            marginTop: Platform.OS === 'android' ? height * 0.17 : height * 0.155
          }}>
          <TextComponent color="white" medium>
            {num > 99 ? +num : num}
          </TextComponent>
        </View>
      )}
      {!isEmptyTable && orders?.length > 0 && (
        <TextComponent
          style={{ position: 'absolute', left: 0, right: 0, bottom: 15 }}
          mTop={20}
          medium
          heavy
          color={timeUsed >= 4 * 60 * 60 * 1000 ? colors.RED : colors.ORANGE}
          center>
          Đã sử dụng: {timeUsed || '00 giờ 00 phút'}
        </TextComponent>
      )}
    </BottomSheet>
  );
};

ModalButtonType.prototype = {
  setRef: PropTypes.shape({ current: PropTypes.any }),
  itemSelect: PropTypes.object,
  isEmptyTable: PropTypes.bool,
  onOrderFood: PropTypes.func,
  onPayment: PropTypes.func,
  onFoodOrder: PropTypes.func,
};

export default ModalButtonType;

const Container = styled.ScrollView``;

const EmptyWrap = styled.View`
  padding-bottom: 10px;
`;

const Row = styled.View`
  flex-direction: row;
`;

const Space = styled.View`
  flex: 1;
  margin-left: 30px;
`;

const UsedWrap = styled.View`
  padding-bottom: 10px;
`;

const Button = styled(ButtonComponent).attrs(() => ({
  bgButton: colors.WHITE,
  padding: 10,
  iconColor: colors.PRIMARY,
  titleColor: colors.PRIMARY,
  shadow: true,
  iconStyle: {
    marginRight: 10,
    borderWidth: 3,
    width: 40,
    height: 40,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.PRIMARY,
  },
  titleStyle: {
    flex: 1,
  },
  textLine: 2,
}))`
  flex: 1;
  margin-top: 10px;
  margin-right: ${(props) => (props.isRight ? '10px' : 0)};
  border-radius: 100px;
  flex-direction: row;
  align-items: center;
  opacity: ${(props) => (props.isDisable ? 0.3 : 2)};
`;

const BtnOrder = styled(Button).attrs(() => ({
  title: 'Gọi món',
  iconName: 'food',
  iconSize: 25,
}))``;

const BtnConfirmTable = styled(Button).attrs(() => ({
  title: 'Xác nhận vào bàn',
  iconName: 'user-plus',
}))``;

const BtnQrCode = styled(Button).attrs(() => ({
  title: 'Qr-code',
  iconName: 'qr-code',
  iconSize: 25,
}))``;

const BtnSplit = styled(Button).attrs(() => ({
  title: 'Tách bàn',
  iconName: 'split-table',
}))``;
const BtnAddTable = styled(Button).attrs(() => ({
  title: 'Ghép thêm bàn',
  iconName: 'table-plus',
}))``;
const BtnMerged = styled(Button).attrs(() => ({
  title: 'Thông tin bàn ghép',
  iconName: 'list-merged',
}))``;

const BtnAddFood = styled(Button).attrs(() => ({
  title: 'Danh sách món',
  iconName: 'clipboard-list',
}))``;

const BtnPayment = styled(Button).attrs(() => ({
  title: 'Thanh toán',
  iconName: 'dollar-sign',
}))``;

const BtnChangeEmpty = styled(Button).attrs(() => ({
  title: 'Chuyển bàn trống',
  iconName: 'change-empty',
}))``;

const BtnAddOrder = styled(Button).attrs(() => ({
  title: 'Thêm order',
  iconName: 'cart-plus',
}))``;

const BtnChangeTable = styled(Button).attrs(() => ({
  title: 'Chuyển bàn',
  iconName: 'exchange-alt',
}))``;

const BtnListOrder = styled(Button).attrs(() => ({
  title: 'Danh sách order',
  iconName: 'list-order',
}))``;

const BtnDeletePayment = styled(Button).attrs(() => ({
  title: 'Hủy thanh toán',
  iconName: 'delete',
}))``;
