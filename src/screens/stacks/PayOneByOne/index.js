import React, {useState, useEffect, useRef} from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {View} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {
  HeaderComponent,
  ListFoodPayment,
  TextComponent,
} from '../../../components';
import {Container, ListWrap} from './styles';
import {OrderApi} from '../../../api';
import {useDispatch} from 'react-redux';
import {paymentAction} from '../../../redux/actions';
import {colors} from '../../../assets';

const PayOneByOneScreen = ({navigation, route}) => {
  const [listFood, setListFood] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const {table, areaId} = route.params;

  //reset list food checked to pay when this screen is focused
  useEffect(() => {
    dispatch(paymentAction.resetPayment());
  }, [isFocused]);

  const orderInfo = useRef({});
  useEffect(() => {
    setIsLoading(true);
    getListFood();
  }, []);

  const getListFood = async () => {
    try {
      const data = await OrderApi.getOrderedById(route.params.id);
      orderInfo.current = data;
      const {order_items} = data;
      setListFood(order_items || []);
      setIsLoading(false);
    } catch (error) {
      console.log('Err @getListFood ', error);
      setListFood([]);
    }
  };
  if (isLoading) {
    return (
      <Container>
        <HeaderComponent title="Chọn món thanh toán" />
        <ListWrap
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{padding: 10}}>
          <SkeletonPlaceholder>
            {[1, 1, 2, 3].map((item, index) => {
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
        </ListWrap>
      </Container>
    );
  }
  return (
    <Container>
      <HeaderComponent title="Chọn món thanh toán" />
      {listFood.length > 0 ? (
        <ListWrap>
          <ListFoodPayment
            table={table}
            data={listFood}
            isPayOneByOne={true}
            isCombo={false}
            navigation={navigation}
            id={route.params.id}
            areaId={areaId}
          />
        </ListWrap>
      ) : (
        <TextComponent
          color={colors.BLACK}
          heavy
          large
          center
          mTop={'50%'}
          marginH={20}>
          Không có món ăn để thanh toán!
        </TextComponent>
      )}
    </Container>
  );
};

export default PayOneByOneScreen;
