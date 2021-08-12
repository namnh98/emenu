import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NoDataComponent } from '../../../components';
import HeaderComponent from './../../../components/HeaderComponent';
import LazyLoading from './../../../components/OrderTableComponent/LazyLoadingComponent/index';
import ItemOrder from './components/ItemOrder/index';
import actions from './redux/actions';
import messaging from '@react-native-firebase/messaging';
import { Body, Container, ListData, Separator, TextLength } from './styles';

const ConfirmScreen = () => {
  const dispatch = useDispatch();
  const { data, total, isLoading } = useSelector((state) => state.order);
  const {is_print_item} = useSelector((state) => state.partners);
  useEffect(() => {
    dispatch({
      type: actions.GET_ORDER,
      params: {
        order_item_status_id: 3,
        order_status_id: '[1,2]',
      },
    });
  }, [dispatch]);

  useEffect(() => {
    return messaging().onMessage(async (remoteMessage) => {
      const { action } = remoteMessage.data;
      if (action === 'staff_order_item') {
        _onRefresh();
      }
    });
  }, []);

  const _onRefresh = () => {
    dispatch({
      type: actions.GET_ORDER,
      params: {
        order_item_status_id: 3,
        order_status_id: '[1,2]',
      },
    });
  };

  return (
    <Container>
      <HeaderComponent title="Xác nhận món ăn" isNotBack />
      {isLoading && data === null ? (
        <LazyLoading />
      ) : data?.length ? (
        <Body>
          <TextLength>Có {data.length} kết quả</TextLength>
          <ListData
            data={data}
            keyExtractor={(_, index) => `ConfirmScreen-${index}`}
            renderItem={({ item }) => (
              <ItemOrder item={item} totalItem={data.length} isPrintItem={is_print_item}/>
            )}
            ItemSeparatorComponent={() => <Separator />}
            showsVerticalScrollIndicator={false}
          />
        </Body>
      ) : (
        <NoDataComponent
          title="Chưa có món ăn mới!"
          onRefresh={_onRefresh}
        />
      )}
    </Container>
  );
};

export default ConfirmScreen;
