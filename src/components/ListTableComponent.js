/* eslint-disable react-hooks/exhaustive-deps */
import messaging from '@react-native-firebase/messaging';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState, useRef} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styled from 'styled-components/native';
import {colors, images} from '../assets';
import {TextComponent} from '../components';
import I18n from '../i18n';
import {NOTIFICATION} from '../navigators/ScreenName';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';

const TableItem = ({
  item,
  index,
  isHome,
  onSelectTable,
  isEmptyTable,
  listNotify,
  navigation,
}) => {
  const {
    id,
    name,
    isSelect,
    image,
    seat_number,
    table_type_id,
    orders,
    status,
    is_table_join,
    listMergedTables,
    table_join_id,
  } = item;
  const findTheEarliestOrder = (orders) => {
    if (!orders || orders?.length === 0 || isEmptyTable) return null;
    let res = orders[0];
    for (const item of orders) {
      if (moment(item.check_in) < moment(res.check_in)) {
        res = item;
      }
    }
    return res;
  };
  const [usedTime, setUsedTime] = useState(
    orders?.length
      ? moment() - moment(findTheEarliestOrder(orders)?.check_in)
      : 60 * 1000,
  );
  const curIndex = index + 1;
  const isRight = curIndex % 3 !== 0;
  const isEmpty = status === 0;
  const urlImage = image?.replace('svg', 'png');
  const newOrders = orders?.filter((value) => value.order_status?.id === 1);
  const delOrders = orders?.filter(
    (value) => value.order_status?.id === 31 || value.order_status?.id === 32,
  );
  const timeInterval = useRef();
  useEffect(() => {
    if (isEmptyTable || !findTheEarliestOrder(orders)) {
      return;
    } else {
      timeInterval.current = setInterval(() => {
        setUsedTime(moment() - moment(findTheEarliestOrder(orders)?.check_in));
      }, 1000);
    }
    return () => {
      if (timeInterval.current) clearInterval(timeInterval.current);
    };
  }, [orders]);
  function msToHMS(duration) {
    let minutes = parseInt((duration / (1000 * 60)) % 60);
    let hours = parseInt(duration / (1000 * 60 * 60));
    minutes = minutes < 10 ? '0' + minutes : hours > 99 ? '59' : minutes;
    hours = hours < 10 ? '0' + hours : hours > 99 ? 99 : hours;

    return hours + ':' + minutes;
  }

  const statusOfTable = isEmptyTable
    ? ''
    : orders.length === 0
    ? 'Chưa gọi món'
    : delOrders.length === orders.length
    ? 'Đã huỷ order'
    : newOrders.length === 0
    ? 'Đã Thanh toán'
    : '';
  const groupName = listMergedTables
    ? listMergedTables?.reduce(
        (init, item, index) =>
          init + (index === 0 ? `${item.name}` : `, ${item.name}`),
        '',
      )
    : name;
  const _seat_number = !listMergedTables?.length
    ? seat_number
    : listMergedTables.reduce((init, item) => init + item.seat_number, 0);

  const _renderNotiRequestIntoTable = (item) => {
    return item.idNotiNeedHandle ? (
      <Ionicons name="notifications" size={20} color={colors.ORANGE} />
    ) : null;
  };
  const _renderButtonNotify = (item) => {
    return listNotify.map((value) => {
      if (item.id === value.table_id) {
        return (
          <Notify key={value.id} onPress={() => _onCallNotify(item)}>
            {value.action === 'call_staff' ? (
              <ImageNotify key={value.id} source={images.CALL_USER} />
            ) : value.action === 'request-into-table' ? (
              <Ionicons
                key={value.id}
                name="notifications"
                size={20}
                color={colors.ORANGE}
              />
            ) : null}
          </Notify>
        );
      }
    });
  };
  return (
    <Wrapper
      isMerged={is_table_join}
      isRight={isRight}
      onPress={() => onSelectTable && onSelectTable(item)}>
      <Content isOpacity={isSelect}>
        <TopWrap isEmpty={isEmpty}>
          <TextComponent
            width="85%"
            color={colors.WHITE}
            numberLine={1}
            ellipsizeMode="tail">
            {I18n.t('home.tableName')} {isHome ? groupName : name}
          </TextComponent>
          {_renderNotiRequestIntoTable(item)}
          {_renderButtonNotify(item)}
        </TopWrap>

        <BottomWrap>
          {table_type_id === 2 && (
            <TableType>
              <TextComponent color={colors.ORANGE} bold>
                VIP
              </TextComponent>
            </TableType>
          )}

          <Bottom>
            <Table
              source={
                isEmpty
                  ? {uri: urlImage}
                  : {uri: urlImage?.replace('gray', 'blue')}
              }
            />
            {/* 
              {orders?.length && !newOrders?.length ? ( */}

            <PaymentSuccess>
              <Payment>{statusOfTable}</Payment>
            </PaymentSuccess>

            {/* ) : null} */}
          </Bottom>
          {!isEmptyTable && orders?.length > 0 && (
            <TextComponent
              color={usedTime >= 4 * 60 * 60 * 1000 ? colors.RED : '#000000'}
              heavy
              style={{position: 'absolute', top: '65%'}}>
              {orders.length === 0 ? '' : msToHMS(usedTime)}
            </TextComponent>
          )}
          <TextComponent>
            {isHome? _seat_number : seat_number} {I18n.t('home.seatName')}
          </TextComponent>
          {is_table_join && table_join_id != null && table_join_id != '' && (
            <MaterialCommunityIcons
              name="account-group"
              color={colors.ORANGE}
              size={25}
              style={{
                position: 'absolute',
                top: '34%',
                left: '48%',
                zIndex: 1,
              }}
            />
          )}
        </BottomWrap>
      </Content>
    </Wrapper>
  );
};

const ListTableComponent = ({
  isHome,
  listTable,
  onSelectTable,
  onConfirmTable,
  isEmptyTable,
}) => {
  const navigation = useNavigation();
  const [listNotify, setListNotify] = useState([]);
  const _listTable = isHome
    ? listTable.filter(
        (item) =>
          !item.is_table_join ||
          (item.is_table_join &&
            (item.table_join_id === null || item.is_table_join === '')) ||
          (item.is_table_join &&
            item.listMergedTables &&
            item.id === item.listMergedTables[0]?.id),
      )
    : listTable;

  useEffect(() => {
    return messaging().onMessage(async (remoteMessage) => {
      const data = remoteMessage.data || {};
      setListNotify([...listNotify, data]);
    });
  }, []);

  const _onCallNotify = (item) => {
    const notify = listNotify.find((value) => value.table_id === item.id);
    notify.action === 'request_into_table'
      ? onConfirmTable(notify.table_id, notify.user_id)
      : navigation.navigate(NOTIFICATION);
  };

  const _keyExtractor = (_, index) => index;
  const _renderItem = ({item, index}) => (
    <TableItem
      key={item.id}
      item={item}
      index={index}
      isHome={isHome}
      onSelectTable={onSelectTable}
      isEmptyTable={isEmptyTable}
      listNotify={listNotify}
      navigation={navigation}
    />
  );
  const _renderNotiRequestIntoTable = (item) => {
    return item.idNotiNeedHandle ? (
      <Ionicons name="notifications" size={20} color={colors.ORANGE} />
    ) : null;
  };
  const _renderButtonNotify = (item) => {
    return listNotify.map((value) => {
      if (item.id === value.table_id) {
        return (
          <Notify onPress={() => _onCallNotify(item)}>
            {value.action === 'call_staff' ? (
              <ImageNotify source={images.CALL_USER} />
            ) : value.action === 'request-into-table' ? (
              <Ionicons name="notifications" size={20} color={colors.ORANGE} />
            ) : null}
          </Notify>
        );
      }
    });
  };

  return (
    <Container>
      <List
        data={_listTable}
        renderItem={_renderItem}
        keyExtractor={(item) => item.id}
      />
    </Container>
  );
};

export default ListTableComponent;

const Container = styled.View`
  flex: 1;
`;

const List = styled.FlatList.attrs(() => ({
  numColumns: 3,
  showsVerticalScrollIndicator: false,
}))``;

const Wrapper = styled.TouchableOpacity`
  flex: ${1 / 3};
  height: 150px;
  margin-bottom: 10px;
  background-color: ${colors.WHITE};
  border-radius: 5px;
  margin-right: ${(props) => (props.isRight ? '10px' : 0)};
`;

const Content = styled.View`
  flex: 1;
  opacity: ${(props) => (props.isOpacity ? '1' : '0.5')};
`;

const TopWrap = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  background-color: ${(props) =>
    props.isEmpty ? colors.BLACK_GRAY : colors.BLUE};
`;

const BottomWrap = styled.View`
  flex: 1;
  padding: 10px;
  justify-content: center;
  align-items: center;
`;

const Bottom = styled.View`
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const Table = styled.Image.attrs(() => ({
  resizeMode: 'contain',
}))`
  width: 80%;
  height: 80%;
`;

const TableType = styled.View`
  position: absolute;
  z-index: 10;
  top: 0;
  right: 0;
`;

const Notify = styled.TouchableOpacity`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  justify-content: center;
  align-items: center;
  padding-left: 10px;
  padding-right: 5px;
`;

const ImageNotify = styled.Image`
  width: 20px;
  height: 20px;
`;

const PaymentSuccess = styled.View`
  position: absolute;
`;

const Payment = styled.Text`
  color: ${colors.RED};
  opacity: 0.6;
  transform: rotate(-20deg);
  text-transform: uppercase;
  font-size: 11px;
  text-align: center;
`;
