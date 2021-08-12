import React, {useState, useEffect, useRef} from 'react';
import {View, TouchableOpacity, Text, Image} from 'react-native';

import {
  HeaderComponent,
  ListReservedTable,
  HeaderFlatListOrder,
  LoadingComponent,
  NoDataComponent,
  ButtonComponent,
  TextComponent,
} from '../../../components';
import jwt_decode from 'jwt-decode';
import {users} from '../../../stores';
import styles from './styles';
import styled from 'styled-components/native';
import {BOOK_TABLE, BOOK_SEARCH_TABLE} from '../../../navigators/ScreenName';
import BookingTable from '../../../api/BookingTable';
import {colors, images} from '../../../assets';
import {useIsFocused} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import moment from 'moment';
import LazyLoading from '../../../components/OrderTableComponent/LazyLoadingComponent';
import messaging from '@react-native-firebase/messaging';
import {TempContractContent} from '../../../components/PopUpTempContract';

const STATUS = [1, 2, 3, 4, 5, 6];
const FROM_DATE = Date.now();
const TO_DATE = moment().add(7, 'days');

const ContentIfNoRole19 = () => (
  <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
    <View
      style={{
        width: '90%',
        paddingHorizontal: 15,
        paddingVertical: 30,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.WHITE,
        borderRadius: 10,
      }}>
      <Image source={images.WELCOME} style={{height: 100, width: 100}} />
      <Text style={{marginTop: 20, textAlign: 'center'}}>
        Bạn chưa được phân quyền quản lý đặt bàn
      </Text>
      <Text>Vui lòng liên hệ với quản lý nhà hàng</Text>
    </View>
  </View>
);

const OrderTable = ({navigation}) => {
  const {partners} = useSelector(state => state);

  const isFocesed = useIsFocused();
  const [loading, setLoading] = useState(true);
  const [listBookTable, setListBookTable] = useState([]);
  const [countIndex, setCountIndex] = useState(0);

  const [isLoadMore, setIsLoadMore] = useState(false);

  const statusRef = useRef(STATUS);
  const guest_nameRef = useRef('');
  const phone_numberRef = useRef('');
  const from_dateRef = useRef(FROM_DATE);
  const to_dateRef = useRef(TO_DATE);

  const [totalResult, setTotalResult] = useState(0);
  const totalPageRef = useRef(0);
  const nextPageRef = useRef(0);
  const currentPageRef = useRef(1);
  const pageSize = 10;
  const [canUse, setCanUse] = useState(true);

  //Params search default
  const paramsSearch = (
    index,
    status,
    guest_name,
    phone_number,
    from_date,
    to_date,
  ) => {
    return {
      index,
      page_size: 10,
      status,
      guest_name,
      phone_number,
      from_date,
      to_date,
      onSetParams: _onSetParams,
    };
  };

  useEffect(() => {
    getRole();
    return messaging().onMessage(async remoteMessage => {
      const {action} = remoteMessage.data;
      if (action === 'reservation') {
        _onRefresh();
      }
    });
  }, []);

  useEffect(() => {
    getRole();
    getListBookingTable();
  }, [countIndex, isFocesed]);

  const getRole = async () => {
    const {token} = await users.getListUser();
    let decode = jwt_decode(token);
    const {role} = decode;
    if (!role.includes('role_19')) {
      setCanUse(false);
    }
  };
  const getListBookingTable = async () => {
    if (!isFocesed || partners?.contract_type_id === 1) {
      setLoading(false);
      return;
    }
    try {
      const formatFromDate = moment(from_dateRef.current).format('DD-MM-YYYY'); //formate date
      const formatToDate = moment(to_dateRef.current).format('DD-MM-YYYY'); //formate date
      const pageIndex = !isLoadMore ? 0 : countIndex;
      const res = await BookingTable.getListBooking(
        paramsSearch(
          pageIndex,
          statusRef.current,
          guest_nameRef.current,
          phone_numberRef.current,
          formatFromDate,
          formatToDate,
        ),
      );
      if (res) {
        totalPageRef.current = res.total_page;
        nextPageRef.current = res.next_page;
        currentPageRef.current = res.current_page;
        setTotalResult(res.total);
        setListBookTable(res.data);
        if (isLoadMore) {
          setListBookTable([...listBookTable, ...res.data]);
          setIsLoadMore(false);
        }
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      setListBookTable([]);
      setIsLoadMore(false);
      console.log('@getListBookingTable', error);
    }
  };

  const _onSetParams = (staus, guest_name, phone, from_date, to_date) => {
    statusRef.current = staus;
    guest_nameRef.current = guest_name;
    phone_numberRef.current = phone;
    from_dateRef.current = from_date;
    to_dateRef.current = to_date;
  };

  const _onBookTable = () => {
    navigation.navigate(BOOK_TABLE);
  };

  //xử lý load more
  const _onLoadMore = () => {
    if (currentPageRef.current < totalPageRef.current) {
      let from = (nextPageRef.current - 1) * pageSize;
      setIsLoadMore(true);
      setCountIndex(from);
    }
  };

  const _onRefresh = () => {
    setCountIndex(0);
    _onSetParams(STATUS, '', '', FROM_DATE, TO_DATE);
    getListBookingTable();
  };
  const _onBookSearchTable = () => {
    navigation.navigate(
      BOOK_SEARCH_TABLE,
      paramsSearch(
        countIndex,
        statusRef.current,
        guest_nameRef.current,
        phone_numberRef.current,
        from_dateRef.current,
        to_dateRef.current,
      ),
    );
  };

  return (
    <View style={styles.container}>
      <HeaderComponent title="Đặt bàn" isNotBack />
      {partners?.contract_type_id === 1 ? (
        <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
          <TempContractContent />
        </View>
      ) : !canUse ? (
        <ContentIfNoRole19 />
      ) : (
        <>
          <View style={styles.bodyContainer}>
            {loading ? (
              <LazyLoading />
            ) : listBookTable?.length === 0 ? (
              <>
                <HeaderFlatListOrder
                  params={paramsSearch(
                    countIndex,
                    statusRef.current,
                    guest_nameRef.current,
                    phone_numberRef.current,
                    from_dateRef.current,
                    to_dateRef.current,
                  )}
                  results={totalResult}
                  _onBookSearchTable={_onBookSearchTable}
                />
                <NoDataComponent
                  title="Không tìm thấy order đặt bàn"
                  onRefresh={_onRefresh}
                />
              </>
            ) : (
              <>
                <HeaderFlatListOrder
                  params={paramsSearch(
                    countIndex,
                    statusRef.current,
                    guest_nameRef.current,
                    phone_numberRef.current,
                    from_dateRef.current,
                    to_dateRef.current,
                  )}
                  results={totalResult}
                  _onBookSearchTable={_onBookSearchTable}
                />
                <ListReservedTable
                  navigation={navigation}
                  listReservedTable={listBookTable}
                  loadMore={isLoadMore}
                  onLoadMore={value => _onLoadMore(value)}
                />
              </>
            )}
          </View>
          {/* button add booking*/}
          {!loading && <Button onPress={_onBookTable} />}
        </>
      )}
    </View>
  );
};

export default OrderTable;

const Button = styled(ButtonComponent).attrs(() => ({
  title: 'Thêm',
  iconName: 'plus',
  titleColor: colors.PRIMARY,
  iconColor: colors.PRIMARY,
}))`
  border: 1px solid ${colors.PRIMARY};
  position: absolute;
  right: 10px;
  bottom: 10px;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  width: 70px;
  height: 60px;
  background-color: ${colors.WHITE};
`;
