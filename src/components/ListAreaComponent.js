import React, { useEffect, useState } from 'react';
import ContentLoader, { Rect } from 'react-content-loader/native';
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Dimensions,
} from 'react-native';
import Modal from 'react-native-modal';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { TableApi } from '../api';
import { colors } from '../assets';
import { HeaderPopup } from '../components';
import I18n from '../i18n';

import { Sizes } from '@dungdang/react-native-basic'

const ListAreaComponent = (props) => {
  const { isVisible, areaId, onClose, onConfirm } = props;
  const [listArea, setListArea] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { height, width } = Dimensions.get('window');

  useEffect(() => {
    getListArea();
  }, [isVisible]);

  const getListArea = async () => {
    try {
      setIsLoading(true);
      const resArea = await TableApi.getListArea();
      const curIndex = resArea.findIndex((value) => value.id === areaId);

      const result = resArea.map((value, index) => {
        if (index === curIndex) {
          return { ...value, isSelect: true };
        }
        return { ...value, isSelect: false };
      });

      if (result.length) {
        setListArea(result);
      }
      setIsLoading(false);
    } catch (error) {
      console.log('Err @getListArea ', error);
      setListArea([]);
      setIsLoading(false);
    }
  };

  const _onSelectItem = (item) => {
    const arrArea = listArea.map((value) => {
      if (value.id === item.id) {
        return { ...value, isSelect: true };
      }
      return { ...value, isSelect: false };
    });
    setListArea(arrArea);
  };

  const _onSubmitArea = async () => {
    if (!listArea.length) return;
    const result = listArea.find((value) => value.isSelect);
    onConfirm(result);
  };

  const _keyExtractor = (_, index) => String(index);
  const _renderItem = ({ item, index }) => {
    return (
      <TouchableWithoutFeedback onPress={() => _onSelectItem(item)}>
        <View style={styles.itemAreaWrapper}>
          <View
            style={[
              styles.rowCenter,
              item.isSelect ? styles.itemAreaActivity : styles.itemArea,
            ]}>
            <Text
              style={[styles.title, { color: item.isSelect ? colors.WHITE : colors.BLACK }]}>
              {item.name.length > 12 ? item.name.trim().slice(0, 12) + "..." : item.name}
            </Text>
            <FontAwesome5
              name={item.is_smoke ? 'smoking' : 'smoking-ban'}
              size={18}
              color={item.isSelect ? 'white' : 'black'}
            />
          </View>

          <View
            style={[
              styles.itemAreaBodyWrapper,
              {
                backgroundColor: item.isSelect
                  ? colors.LIGHT_BLUE
                  : colors.GRAY,
              },
            ]}>
            <View style={styles.itemAreaBody}>
              <Text>
                {I18n.t('home.tableEmpty')}: {item.table_empty}
              </Text>
              <Text>
                {I18n.t('home.tableUsed')}: {item.table_used}
              </Text>
              <Text>
                {I18n.t('home.vipTable')}: {item.table_vip}
              </Text>
              <Text>
                {I18n.t('home.normalTable')}: {item.table_normal}
              </Text>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  const MyLoader = () => (
    <ContentLoader viewBox="0 0 350 140">
      {/* left */}
      <Rect x="10" y="10" rx="0" ry="0" width="35%" height="30" />
      <Rect x="39%" y="10" rx="0" ry="0" width="30" height="30" />
      <Rect x="15" y="51" rx="5" ry="5" width="41%" height="10" />
      <Rect x="15" y="71" rx="5" ry="5" width="41%" height="10" />
      <Rect x="15" y="91" rx="5" ry="5" width="41%" height="10" />
      <Rect x="15" y="111" rx="5" ry="5" width="41%" height="10" />
      {/* right */}
      <Rect x="53%" y="10" rx="0" ry="0" width="35%" height="30" />
      <Rect x="89%" y="10" rx="0" ry="0" width="30" height="30" />
      <Rect x="55%" y="51" rx="5" ry="5" width="41%" height="10" />
      <Rect x="55%" y="71" rx="5" ry="5" width="41%" height="10" />
      <Rect x="55%" y="91" rx="5" ry="5" width="41%" height="10" />
      <Rect x="55%" y="111" rx="5" ry="5" width="41%" height="10" />
    </ContentLoader>
  );

  return (
    <Modal
      isVisible={isVisible}
      statusBarTranslucent
      animationIn="zoomInDown"
      animationOut="zoomOutUp"
      onBackdropPress={onClose}
      useNativeDriver
      hideModalContentWhileAnimating>
      <TouchableWithoutFeedback onPressOut={onClose}>
        <View style={styles.popupTable}>
          <SafeAreaView style={{ flex: 0 }} />
          <View style={styles.popupTableContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.popupSelect}>
                <HeaderPopup title={I18n.t('home.titlePopup')} />
                {isLoading ? (
                  <View style={{ height: 140 }}>
                    <MyLoader />
                  </View>
                ) : (
                  <FlatList
                    style={{ height: listArea.length <= 4 ? height * 0.5 : height * 0.75 }}
                    data={listArea}
                    keyExtractor={_keyExtractor}
                    renderItem={_renderItem}
                    numColumns={2}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listAreaWrapper}
                    columnWrapperStyle={{ justifyContent: 'space-between' }}
                  />
                )}

                <View style={styles.buttonAreaWrapper}>
                  <TouchableOpacity
                    onPress={onClose}
                    style={[
                      styles.buttonArea,
                      {
                        backgroundColor: colors.RED,
                        borderRadius: 20,
                        width: Sizes.s160,
                        height: Sizes.s100 - Sizes.s20,
                        justifyContent: 'space-evenly',
                      },
                    ]}>
                    <Text style={{ color: colors.WHITE }}>
                      {I18n.t('home.cancel')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={_onSubmitArea}
                    style={[
                      styles.buttonArea,
                      {
                        backgroundColor: colors.ORANGE,
                        borderRadius: 20,
                        width: Sizes.s160 + Sizes.s20,
                        height: Sizes.s100 - Sizes.s20,
                        justifyContent: 'space-evenly',
                      },
                    ]}>
                    <Text style={{ color: colors.WHITE }}>
                      {I18n.t('home.oke')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </TouchableWithoutFeedback>
      {props.children}
    </Modal>
  );
};

export default ListAreaComponent;

const styles = StyleSheet.create({
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  popupTable: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  popupTableContainer: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupSelect: {
    width: '100%',
    maxHeight: '100%',
    backgroundColor: 'white',
    borderRadius: 5,
  },
  listAreaWrapper: {
    padding: 10,
  },
  buttonAreaWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingVertical: 10,
    paddingHorizontal: Sizes.h30 * 4
  },
  itemAreaWrapper: {
    width: '48%',
    marginBottom: 10,
  },
  itemArea: {
    backgroundColor: colors.TEXT_GRAY,
    padding: 10,
    justifyContent: 'space-between',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  itemAreaActivity: {
    backgroundColor: colors.DARK_BLUE,
    padding: 10,
    justifyContent: 'space-between',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  buttonArea: {
    flexDirection: 'row',
    alignItems: 'center',
    // borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  itemAreaBodyWrapper: {
    padding: 10,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  itemAreaBody: {
    backgroundColor: colors.WHITE,
    padding: 5,
    borderRadius: 5,
  },
  title: {
    width: Sizes.s200,
    height: Sizes.s40,
    paddingTop: Sizes.h10 / 2,
  }
});
