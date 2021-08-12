import React, {useEffect, useState, useRef} from 'react';
import {View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {OrderApi, BillApi} from '../../../api';
import {
  HeaderComponent,
  NoDataComponent,
  ListBillComponent,
  ModalCfirmDropdownComponent,
} from '../../../components';
import {HOME} from '../../../navigators/ScreenName';
import {BodyWrapper, Container} from './styles';
import {AlertModal} from '../../../common';

const ListBill = ({navigation, route}) => {
  const listBill = useRef(route.params.listBill);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalAlert, setIsModalAlert] = useState(false);
  const [isNotConfirm, setIsNotConfirm] = useState(false);
  const [isNoteReason, setIsNoteReason] = useState(true);
  const bill = useRef(null);
  const titleModal = useRef('');
  const contentModal = useRef('');
  const [optionSelect, setOptionSelect] = useState([]);
  const [isdisabled, setIsdisabled] = useState(false);

  const _handleDeleteBill = (item) => {
    bill.current = item;
    const options = [
      {label: 'Ghi sai order', value: 'Ghi sai order'},
      {label: 'Khách hàng đổi/trả món', value: 'Khách hàng đổi/trả món'},
      {label: 'Thu ngân tính sai tiền', value: 'Thu ngân tính sai tiền'},
      {label: 'Khác', value: 4},
    ];
    setOptionSelect(options);
    titleModal.current = AlertModal.TITLE[0];
    contentModal.current = `${AlertModal.CONTENT[6]} ${item.customer_name} ${AlertModal.CONTENT[7]}`;
    setIsdisabled(false);
    setIsModalAlert(true);
  };

  //confirm delete bill đọi xử lý
  const _onConfirmBill = async (value) => {
    try {
      const {id, order_id, customer_name} = bill.current;
      const table_id = route.params.id;
      const tableName = route.params.name;
      const areaId = route.params.areaId;
      const res = await OrderApi.deleteOrderById(id, value);
      if (res?.status === 200) {
        setIsNoteReason(false);
        titleModal.current = AlertModal.TITLE[2];
        contentModal.current = `${AlertModal.CONTENT[8]} ${customer_name} ${AlertModal.CONTENT[9]}`;
        listBill.current = listBill.current.filter((item) => item.id != id);
        setIsNotConfirm(true);
        setIsdisabled(true);
        await BillApi.pushNotiDelBill(table_id, tableName, id, areaId); //push notifi khi hủy thanh toán
        const newList = await BillApi.getListBill(table_id);
        // listBill.current = newList;
        navigation.goBack();
      }
    } catch (error) {
      console.log('Err @deleteOrderById ', error);
      titleModal.current = AlertModal.TITLE[3];
      contentModal.current = `${AlertModal.CONTENT[8]} ${customer_name} ${AlertModal.CONTENT[10]}`;
    }
  };

  const _onClosePopup = () => {
    if (listBill.current.length === 1) {
      setIsModalAlert(false);
      navigation.navigate(HOME);
      return;
    }
    setIsModalAlert(false);
  };

  if (isLoading) {
    return (
      <Container>
        <HeaderComponent title="Vui lòng chọn hóa đơn" />
        <BodyWrapper>
          <SkeletonPlaceholder>
            {[1, 1].map((item, index) => {
              return (
                <View
                  key={`loadOrderPayment-${index}`}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 15,
                  }}>
                  <View
                    style={{
                      flex: 0.5,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <View style={{width: 170, height: 20}} />
                    <View style={{width: 170, height: 60, marginTop: 5}} />
                    <View style={{width: 170, height: 20, marginTop: 3}} />
                    <View style={{width: 170, height: 20, marginTop: 3}} />
                  </View>
                  <View
                    style={{
                      flex: 0.5,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <View style={{width: 170, height: 20}} />
                    <View style={{width: 170, height: 60, marginTop: 5}} />
                    <View style={{width: 170, height: 20, marginTop: 3}} />
                    <View style={{width: 170, height: 20, marginTop: 3}} />
                  </View>
                </View>
              );
            })}
          </SkeletonPlaceholder>
        </BodyWrapper>
      </Container>
    );
  }

  return (
    <Container>
      <HeaderComponent title="Vui lòng chọn hóa đơn" />
      <BodyWrapper>
        {listBill.current?.length ? (
          <ListBillComponent
            data={listBill.current}
            onPress={(item) => _handleDeleteBill(item)}
          />
        ) : (
          <NoDataComponent title="Hiện tại bạn không có hóa đơn!" />
        )}
      </BodyWrapper>
      {optionSelect.length > 0 && (
        <ModalCfirmDropdownComponent
          isVisible={isModalAlert}
          title={titleModal.current}
          content={contentModal.current}
          isNotConfirm={isNotConfirm}
          loading={isLoading}
          onClosePopup={() => _onClosePopup()}
          onConfirm={(value) => _onConfirmBill(value)}
          isNote={isNoteReason}
          placeHolder={'Chọn lý do hủy thanh toán'}
          optionSelect={optionSelect}
          isDisabled={isdisabled}
        />
      )}
    </Container>
  );
};

export default ListBill;
