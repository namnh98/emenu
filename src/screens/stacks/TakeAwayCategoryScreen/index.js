import React, {useEffect, useState} from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {useDispatch, useSelector} from 'react-redux';
import {FoodApi} from '../../../api';
import {images} from '../../../assets';
import {
  LoadingCategory,
  NoDataComponent,
  TextComponent,
  ModalCfirmComponent,
} from '../../../components';
import HeaderComponent from '../../../components/HeaderComponent';
import {FOOD_ORDERED, TAKEAWAY_FOOD} from '../../../navigators/ScreenName';
import {orderAction} from '../../../redux/actions';
import {
  BodyWrap,
  BtnDetails,
  CardImage,
  CardWrap,
  ListCategory,
  Wrapper,
} from './styles';
import {BackHandler} from 'react-native';

const TakeAwayCategory = ({navigation, route}) => {
  const {} = route.params || {};

  const dispatch = useDispatch();
  const {orders} = useSelector((state) => state);
  const [modalWarning, setModalWarning] = useState(false);

  const [listCategory, setListCategory] = useState(null);
  const _handelBack = () => {
    if (navigation.isFocused()) {
      if (orders.length != 0) {
        setModalWarning(true);
      } else {
        navigation.goBack();
      }
      return true;
    } else {
      return false;
    }
  };
  useEffect(() => {
    _getDataCategory();
    dispatch(orderAction.resetFood());
  }, []);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', _handelBack);
    return () =>
      BackHandler.removeEventListener('hardwareBackPress', _handelBack);
  });

  const _getDataCategory = async () => {
    try {
      const resCategory = await FoodApi.getComboFoods();
      const allFood = await FoodApi.getFoods();
      const cateNoPrice = resCategory.filter((cate) => !cate.is_price);
      const counterAllFoods = allFood.reduce(
        (init, item) => init + item.items.length,
        0,
      );
      let listFoodOfAllCombos = [];
      for (const item of cateNoPrice) {
        for (const _item of item.items) {
          if (!listFoodOfAllCombos.find((element) => element.id === _item.id)) {
            listFoodOfAllCombos.push(_item);
          }
        }
      }
      if (listFoodOfAllCombos.length != counterAllFoods) {
        cateNoPrice.push({
          combo_item_imgs: [],
          id: null,
          image:
            'https://staging-omenu-storage.s3-ap-southeast-1.amazonaws.com/web_root/omenu/static/icon/combo_item/breakfast.png',
          is_price: false,
          name: 'Tất cả',
        });
      }
      setListCategory(cateNoPrice || []);
    } catch (error) {
      console.log('Err @getDataCategory', error);
      setListCategory([]);
    }
  };

  //EVENT
  const _onMoveFood = (item) => navigation.navigate(TAKEAWAY_FOOD, item);

  const _onShowFood = () => {
    navigation.navigate(FOOD_ORDERED, {isEdit: true});
  };

  //RENDER COMPONENT
  const _renderList = () => {
    if (listCategory === null) return <LoadingCategory />;

    if (!listCategory.length)
      return <NoDataComponent title="Hiện tại chưa có suất ăn" />;

    return (
      <ListCategory
        data={listCategory}
        renderItem={_renderItem}
        keyExtractor={_keyExtractor}
      />
    );
  };

  const _renderItem = ({item}) => {
    return (
      <CardWrap onPress={() => _onMoveFood(item)}>
        <CardImage
          source={item.image ? {uri: item.image} : images.IMAGE_DEFAULT}
        />
        <TextComponent mTop={15} upperCase center>
          {item.name}
        </TextComponent>
      </CardWrap>
    );
  };

  const _keyExtractor = (item, index) => String(index);

  const _onClose = () => {
    setModalWarning(false);
  };

  const _onComfrim = () => {
    setModalWarning(false);
    navigation.goBack();
  };

  //RENDER MAIN
  return (
    <Wrapper>
      <HeaderComponent
        title="Danh sách suất ăn"
        isNotify
        onGoBack={_handelBack}
      />
      <ModalCfirmComponent
        isVisible={modalWarning}
        title="Bạn có chắc"
        content="Bạn muốn hủy chọn món?"
        onClosePopup={_onClose}
        onConfirm={_onComfrim}
      />

      <BodyWrap>
        {_renderList()}
        <BtnDetails badge={orders.length} onPress={_onShowFood} />
      </BodyWrap>
    </Wrapper>
  );
};

export default TakeAwayCategory;
