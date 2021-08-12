import React from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors, images} from '../assets';
import {FormatNumber} from '../untils';
import TextComponent from './TextComponent';

const ListCategoryFood = ({listCategory, onPress}) => {
  const _keyExtractor = (item, index) => String(index);
  const _renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => onPress(item)}
        style={styles.itemWrapper}>
        <View style={styles.itemCountWrapper}>
          {!!item.countOrder && (
            <TextComponent semi>
              Số món :
              <TextComponent heavy medium color={colors.RED}>
                {item.countOrder}
              </TextComponent>
            </TextComponent>
          )}

          {!!item.countRate && (
            <TextComponent semi>
              Số suất :
              <TextComponent heavy medium color={colors.RED}>
                {item.countRate}
              </TextComponent>
            </TextComponent>
          )}
        </View>

        <Image
          style={[styles.itemImage, item.is_price && {marginTop: 25}]}
          source={item.image ? {uri: item.image} : images.IMAGE_DEFAULT}
        />
        <TextComponent semi medium numberLine={1} mTop={10}>
          {item.name}
        </TextComponent>

        {item.is_price && (
          <ImageBackground source={images.DISCOUNT} style={styles.itemDiscount}>
            <FormatNumber
              titleStyle={{
                textDecorationLine: item.promotion ? 'line-through' : 'none',
                fontSize: item.promotion ? 9 : 10,
                color: item.promotion ? colors.BLACK_GRAY : colors.RED,
              }}
              value={item.price}
              notUnit
              heavy
            />

            {item.promotion && (
              <FormatNumber
                titleStyle={{
                  fontSize: 13,
                  color: colors.RED,
                }}
                value={item.promotion.price_discount}
                notUnit
                heavy
              />
            )}
          </ImageBackground>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={listCategory}
        keyExtractor={_keyExtractor}
        renderItem={_renderItem}
        numColumns={2}
        columnWrapperStyle={styles.wrapperStyle}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default ListCategoryFood;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapperStyle: {
    justifyContent: 'space-between',
  },
  itemWrapper: {
    width: '48%',
    height: 150,
    backgroundColor: colors.WHITE,
    marginBottom: 15,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  itemCountWrapper: {
    width: '100%',
    alignItems: 'flex-end',
    position: 'absolute',
    top: 0,
  },
  itemImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  itemDiscount: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 80,
    height: 50,
    resizeMode: 'contain',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  itemImgDiscount: {
    width: 70,
    height: 50,
    resizeMode: 'contain',
  },
});
