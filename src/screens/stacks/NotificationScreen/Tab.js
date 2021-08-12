import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
  RefreshControl,
} from 'react-native';
import {TabView, SceneMap} from 'react-native-tab-view';
import {colors} from '../../../assets';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {SwipeListView} from 'react-native-swipe-list-view';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from './styles';
import styled from 'styled-components/native';
import ItemNoti from './ItemNoti';
import {NotificationApi} from '../../../api';
import {useNavigation} from '@react-navigation/native';
import {NoDataComponent} from '../../../components';
import I18n from '../../../i18n';
import {users, userInfo} from '../../../stores';
const ListNoti = ({index}) => {
  const layout = useWindowDimensions();

  const [listNoti, setListNoti] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const PAGE_SIZE = 150;
  const navigation = useNavigation();
  const totalNoti = useRef(0);
  const [refreshing, setRefreshing] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    getData(index);
  }, []);

  const getData = async (idx) => {
    const user = await userInfo.getListUser();
    const topic = `area_${user.UserAreas[0].area_id}`;
    const actions =
      idx === 0
        ? []
        : idx === 1
        ? ['request_into_table', 'request_payment']
        : ['confirm_payment'];
    if (idx === 0) {
      const list = await NotificationApi.getListNotify(
        pageIndex,
        PAGE_SIZE,
        null,
        topic,
      );

      setListNoti(
        list.data.map((item, index) => ({key: `${index}`, item: item})) || [],
      );
      totalNoti.current = list.total;
      setIsLoading(false);
    } else {
      for (item of actions) {
        const list = await NotificationApi.getListNotify(
          pageIndex,
          PAGE_SIZE,
          item,
          topic,
        );
        if (list) {
          setListNoti((prev) =>
            prev.concat(
              list.data.map((item, index) => ({key: `${index}`, item: item})),
            ),
          );
          totalNoti.current = list.total;
        } else {
          console.log('Err when call api');
        }
        setIsLoading(false);
      }
    }
  };

  const _keyExtractor = (item, index) => String(index);

  const onClose = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
    getData(index);
    setIsLoading(false);
  };
  const _onDelete = async (item, rowMap) => {
    setIsLoading(true);
    const noti = item.item;
    try {
      const res = await NotificationApi.deleteNotify(
        noti.notification_create_id,
      );
      onClose(rowMap, item.key);
    } catch (error) {
      console.log('Err @OnDelete ', error);
      setIsLoading(false);
    }
  };

  const _renderItem = (data, rowMap) => {
    const item = data.item;
    return <ItemNoti navigation={navigation} item={item.item} />;
  };

  const _renderHiddenItem = (data, rowMap) => {
    const item = data.item;
    return (
      <View style={styles.itemHiddenWrapper}>
        <TouchableOpacity
          onPress={() => _onDelete(item, rowMap)}
          style={{
            backgroundColor: colors.RED,
            ...styles.itemHiddenRight,
          }}>
          <MaterialIcons name="delete" size={20} color={colors.WHITE} />
          <Text style={styles.itemHiddenText}>
            {I18n.t('notification.delete')}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  const _onRefresh = () => {
    setPageIndex(0);
    setIsLoading(true);
    getData(index);
  };

  const Placeholder = () => {
    return (
      <SkeletonPlaceholder>
        <View style={{flexDirection: 'row', alignItems: 'center', margin: 10}}>
          <View style={{width: 60, height: 60, borderRadius: 50}} />
          <View style={{marginLeft: 20}}>
            <View style={{width: 150, height: 20, borderRadius: 4}} />
            <View
              style={{
                marginTop: 6,
                width: layout.width * 0.7,
                height: 20,
                borderRadius: 4,
              }}
            />
          </View>
        </View>
      </SkeletonPlaceholder>
    );
  };

  return isLoading ? (
    <>
      <Placeholder />
      <Placeholder />
      <Placeholder />
      <Placeholder />
      <Placeholder />
      <Placeholder />
      <Placeholder />
      <Placeholder />
      <Placeholder />
    </>
  ) : listNoti.length ? (
    <SwipeListView
      onEndReached={() => {
        setPageIndex((prev) => prev + 1);
        getData(index);
      }}
      refreshControl={
        <RefreshControl
          colors={[colors.ORANGE, colors.WHITE]}
          refreshing={refreshing}
          onRefresh={_onRefresh}
        />
      }
      contentContainerStyle={{marginHorizontal: 10}}
      data={listNoti}
      keyExtractor={_keyExtractor}
      renderItem={_renderItem}
      renderHiddenItem={_renderHiddenItem}
      rightOpenValue={-60}
      showsVerticalScrollIndicator={false}
      disableRightSwipe
    />
  ) : (
    <NoDataComponent title="Không có thông báo" onRefresh={_onRefresh} />
  );
};

const FirstRoute = () => <ListNoti index={0} />;

const SecondRoute = () => <ListNoti index={1} />;

const ThirdRoute = () => <ListNoti index={2} />;

export default function Tab() {
  const layout = useWindowDimensions();
  const [listTotalUnRead, setListTotalUnRead] = useState(Array(3).fill(0));

  useEffect(() => {}, []);

  const getUnRead = async () => {
    const unRead = await NotificationApi.getListNotify(pageIndex, PAGE_SIZE, 0);
  };

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'first', title: 'Toàn bộ'},
    {key: 'second', title: 'Xác nhận'},
    {key: 'third', title: 'Thanh toán'},
  ]);

  const TabBar = ({navigationState, position}) => {
    return (
      <TabBarStyle>
        {navigationState.routes.map((route, i) => {
          return (
            <TouchableOpacity
              style={{
                flex: 1,
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor:
                  navigationState.index === i ? colors.ORANGE : colors.WHITE,
              }}
              onPress={() => setIndex(i)}>
              <Text
                style={{
                  color:
                    navigationState.index === i ? colors.WHITE : colors.GREY,
                  fontSize: 16,
                }}>
                {route.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </TabBarStyle>
    );
  };
  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
    third: ThirdRoute,
  });

  return (
    <TabView
      swipeEnabled={false}
      lazy
      navigationState={{index, routes}}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{width: layout.width}}
      renderTabBar={(props) => <TabBar {...props} />}
    />
  );
}

const TabBarStyle = styled.View`
  flex-direction: row;
  height: 40px;
  margin-horizontal: 10;
  align-self: center;
  margin-top: 10px;
  border-radius: 10px;
  background-color: ${colors.WHITE};
  box-shadow: 0px 2px 1px #ebebeb;
  margin-bottom: 10px;
`;
