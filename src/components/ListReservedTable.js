import { useNavigation, useScrollToTop } from '@react-navigation/native';
import React, { useRef, useState, useEffect } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../assets';
import I18n from '../i18n';
import FormatMoment from '../untils/FormatMoment';
import { BOOK_TABLE, BOOK_TABLE_DETAIL } from '../navigators/ScreenName';
import ButtonComponent from './ButtonComponent/index';
import TooltipComponent from './TooltipComponent/index';
import { tabNav } from '../redux/actions';
import { useSelector } from 'react-redux';

const ListReservedTable = ({ listReservedTable, onLoadMore, loadMore }) => {
  const navigation = useNavigation();
  const scrollY = useRef(new Animated.Value(0)).current;

  const [isTooltip, setIsTooltip] = useState(false);
  const titleRef = useRef('Lý do');
  const contentRef = useRef('');
  const scroll = useSelector((state) => state.scroll);
  const listRef = useRef();
  const firstRender = useRef(true);
  useScrollToTop(listRef);
  const _onHandleTable = (item) => {
    navigation.navigate(BOOK_TABLE_DETAIL, item);
  };

  const _renderStatus = (number, note) => {
    switch (number) {
      case 1:
        return (
          <View style={styles.itemBodyBox}>
            <Text style={styles.textStatus}> Đợi xác nhận</Text>
          </View>
        );
      case 2:
        return (
          <View style={styles.itemBodyBox}>
            <Text style={styles.textStatus}> Đã xác nhận</Text>
          </View>
        );
      case 3:
        return (
          <View style={styles.itemBodyBox}>
            <Text style={styles.textStatus}> Đã xếp bàn</Text>
          </View>
        );
      case 4:
        return (
          <View style={styles.itemBodyBox}>
            <Text style={[styles.textStatus, { color: colors.RED }]}>Đã hủy</Text>
            <ButtonComponent
              iconName="commenting"
              iconColor={colors.PRIMARY}
              iconSize={25}
              onPress={() => _onShowTooltip(note)}
            />
          </View>
        );
      case 5:
        return (
          <View style={styles.itemBodyBox}>
            <Text style={styles.textStatus}> Khách hàng hủy</Text>
          </View>
        );
      case 6:
        return (
          <View style={styles.itemBodyBox}>
            <Text style={styles.textStatus}> Khách đã vào bàn</Text>
          </View>
        );
      default:
        break;
    }
  };

  const _keyExtractor = (_, index) => String(index);
  const _renderItem = ({ item }) => {
    return (
      <View style={styles.itemContainer}>
        {/* header */}
        <View style={styles.itemHeaderWrapper}>
          <Text style={styles.itemHeaderText}>{item.guest_name}</Text>
          <View style={styles.itemHeaderPhone}>
            <Ionicons name="call" size={18} color="#666666" />
            <Text style={[styles.itemHeaderText, { color: '#666666' }]}>
              {item.phone_number}
            </Text>
          </View>
        </View>

        {/* body */}
        <View style={styles.itemBodyWrapper}>
          {/* info table as date, person, time */}
          <View style={styles.itemBodyBoxWrapper}>
            <View style={[styles.itemBodyBox, styles.borWidthGray]}>
              <Ionicons name="calendar" size={18} color={colors.ORANGE} />
              <Text style={styles.itemText}>
                {FormatMoment.FormatBirthday(item.check_in)}
              </Text>
            </View>
            <View style={[styles.itemBodyBox, styles.borWidthGray]}>
              <Ionicons name="time" size={18} color={colors.ORANGE} />
              <Text style={styles.itemText}>
                {FormatMoment.FormatTime(item.check_in)}
              </Text>
            </View>

            <View style={[styles.itemBodyBox, styles.borWidthGray]}>
              <Ionicons name="person" size={18} color={colors.ORANGE} />
              <Text style={styles.itemText}>
                {item.total_guest_number} người
              </Text>
            </View>

            <View style={[styles.itemBodyBox, styles.borWidthGray]}>
              {item.is_smoking ? (
                <>
                  <FontAwesome5
                    name="smoking"
                    size={18}
                    color={colors.ORANGE}
                  />
                  <Text style={styles.itemText}> Có hút thuốc</Text>
                </>
              ) : (
                <>
                  <FontAwesome5
                    name="smoking-ban"
                    size={18}
                    color={colors.ORANGE}
                  />
                  <Text style={styles.itemText}> Không hút thuốc</Text>
                </>
              )}
            </View>
            {_renderStatus(item.status, item.note_update_status)}
          </View>

          {/* button */}
          <View style={styles.btnProcess}>
            <ButtonComponent
              onPress={() => _onHandleTable(item)}
              style={[styles.itemBodyBoxBtn, { backgroundColor: colors.ORANGE, borderRadius: 20 }]}
              titleStyle={[
                styles.itemBodyBoxBtnText,
                { color: colors.ORANGE, lineHeight: 16 },
              ]}
              title={I18n.t('orderTable.handle')}
              iconName="sync"
              iconColor={colors.WHITE}
              titleColor={colors.WHITE}
            />
          </View>
        </View>
      </View>
    );
  };

  const footer = () => {
    return (
      loadMore && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#F37905" />
        </View>
      )
    );
  };

  //** close tooltips */
  const _onClosePopup = () => {
    contentRef.current = '';
    setIsTooltip(false);
  };

  //** open tootips */
  const _onShowTooltip = (note) => {
    contentRef.current = note;
    setIsTooltip(true);
  };

  //callback parent
  const handleLoadMore = () => onLoadMore();
  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={listRef}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          {
            useNativeDriver: true,
          },
        )}
        data={listReservedTable}
        renderItem={_renderItem}
        keyExtractor={_keyExtractor}
        scrollEventThrottle={16}
        numColumns={1}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() => footer()}
      />
      <TooltipComponent
        isVisible={isTooltip}
        title={titleRef.current}
        content={contentRef.current}
        onClosePopup={() => _onClosePopup()}
      />
    </View>
  );
};

export default ListReservedTable;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  itemContainer: {
    marginBottom: 15,
  },

  itemHeaderWrapper: {
    backgroundColor: colors.WHITE,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },

  itemHeaderText: {
    color: colors.BLACK,
    textTransform: 'uppercase',
    lineHeight: 25,
    fontSize: 15,
    fontWeight: 'bold',
  },

  itemHeaderPhone: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  itemBodyWrapper: {
    backgroundColor: '#E1E1E1',
    padding: 20,
  },
  itemBodyBoxWrapper: {
    borderWidth: 1,
    borderColor: colors.TEXT_GRAY,
    borderRadius: 5,
    backgroundColor: colors.WHITE,
  },
  itemBodyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  borWidthGray: {
    borderBottomWidth: 0.75,
    borderBottomColor: colors.TEXT_GRAY,
  },
  btnProcess: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    flex: 1,
  },

  itemText: {
    paddingLeft: 10,
    color: '#666666',
  },
  textStatus: {
    flex: 1,
    textAlign: 'center',
    textTransform: 'uppercase',
    color: colors.ORANGE,
  },
  itemBodyBoxBtnText: {
    color: colors.ORANGE,
    paddingLeft: 10,
  },
  itemFootWrapper: {
    backgroundColor: colors.BLACK_GRAY,
    paddingVertical: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    alignItems: 'center',
  },
  titleList: {
    fontSize: 15,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  itemBodyBoxBtnText: {
    color: colors.ORANGE,
    paddingLeft: 10,
  },

  btnProcess: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    flex: 1,
  },
  itemBodyBoxBtn: {
    borderColor: colors.ORANGE,
    borderWidth: 1,
    paddingVertical: 5,
    alignItems: 'center',
    borderRadius: 5,
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    width: 90,
    height: 40,
    backgroundColor: colors.WHITE,
  },
});
