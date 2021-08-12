import React, { useState } from 'react';
import styles from './styles';
import { Image, Text, View, TouchableHighlight } from 'react-native';
import { colors, images } from '../../../assets';
import { NotificationApi, TableApi, OrderApi } from '../../../api';
import { RelativeTime } from '../../../common';
import { ModalCfirmComponent } from '../../../components';
import {
  BOTTOM_TAB,
  ODER_TABLE,
  TAKE_AWAY,
  TAB_WITH_CHECK_IN,
} from '../../../navigators/ScreenName';

export default function ItemNoti({ navigation, item }) {
  const [showModal, setShowModal] = useState(false);
  const [titlePopUp, setTitlePopUp] = useState('');
  const [contentPopUp, setContentPopUp] = useState('');
  const [status, setStatus] = useState(item.status === 1);
  const onClosePopUp = () => {
    setShowModal(false);
  };
  const _onRead = async () => {
    try {
      if (
        (item.action == 'request_into_table' ||
          item.action == 'request_into_table') &&
        item.status_action === 0
      ) {
        setTitlePopUp(`Xác nhận ${item.title}`);
        setContentPopUp(item.content);
        setShowModal(true);
      } else if (item.action == 'reservation') {
        navigation.navigate(BOTTOM_TAB, { screen: ODER_TABLE });
      } else if (
        item.action == 'staff_order_item' &&
        !item.body_data.table_id
      ) {
        navigation.navigate(BOTTOM_TAB, { screen: TAKE_AWAY });
      }
      setStatus(true);
      const res = await NotificationApi.changeStatusNotify(
        item.notification_create_id,
        1,
      );
    } catch (error) {
      console.log('Err @OnRead ', error);
      setIsLoading(false);
    }
  };

  const onConfirm = async () => {
    try {
      const order = await OrderApi.addOrderFood(
        item.body_data.table_id,
        [],
        {},
      );
      if (order) {
        await NotificationApi.updateHandledStatusNoti(
          item.notification_create_id,
          2,
        );
        await TableApi.pushNotiConfirmIntoTable(
          item.body_data.table_id,
          item.body_data.table_name,
          item.body_data.area_id,
          order.order_id,
          item.body_data.user_id,
        );
        setShowModal(false);
      }
    } catch (error) {
      console.log('Err @onUpdateStatusTable ', error);
    }
  };
  return (
    <TouchableHighlight
      underlayColor={colors.BG_GRAY}
      onPress={() => {
        _onRead();
      }}>
      <View style={styles.itemWrapper}>
        <View
          style={{
            ...styles.deviceHeight,
            backgroundColor: status ? colors.ORANGE : colors.BLUE,
          }}
        />

        {status ? (<Image
          style={[styles.itemImage, { tintColor: colors.TEXT_GRAY }]}
          source={images.OMENU_WHITE}
          resizeMode="contain"
        />) : (<Image
          style={[styles.itemImage, { tintColor: colors.ORANGE }]}
          source={images.OMENU_WHITE}
          resizeMode="contain"
        />)}


        <View style={styles.contentWrapper}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[styles.contentTitle, { color: status && colors.TEXT_GRAY }]}>
            {item.title}
          </Text>
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={[
              styles.contentSubTitle,
              { color: status && colors.TEXT_GRAY },
            ]}>
            {item.content}
          </Text>
        </View>

        <View style={styles.timeWrapper}>
          <Text style={{ color: status && colors.TEXT_GRAY, fontSize: 12 }}>
            {RelativeTime(item.created_at)}
          </Text>
        </View>
        {/* Modal */}
        <ModalCfirmComponent
          isVisible={showModal}
          content={contentPopUp}
          title={titlePopUp}
          onClosePopup={onClosePopUp}
          isNotConfirm={false}
          onConfirm={onConfirm}
        />
      </View>
    </TouchableHighlight>
  );
}
