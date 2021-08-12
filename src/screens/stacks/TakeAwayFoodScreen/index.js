import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {Transition, Transitioning} from 'react-native-reanimated';
import {useDispatch, useSelector} from 'react-redux';
import {FoodApi, OrderApi, PromotionApi, NotifyApi} from '../../../api';
import {colors} from '../../../assets';
import {userInfo} from '../../../stores';
import Modal from 'react-native-modal';
import {
  HeaderComponent,
  ListFood,
  LoadingFood,
  ModalEnterQty,
  NoDataComponent,
  TextComponent,
} from '../../../components';
import {
  FOOD_ORDERED,
  SEARCH_FOOD,
  TAKEAWAY_PAYMENT,
} from '../../../navigators/ScreenName';
import {orderAction} from '../../../redux/actions';
import {ConvertCategory} from '../../../untils';
import {
  Body,
  BtnDetails,
  BtnPayment,
  FootWrap,
  HeaderWrap,
  CateWrap,
  RowWrap,
  BtnSearch,
} from './styles';

const transition = (
  <Transition.Together>
    <Transition.In type="fade" durationMs={200} />
    <Transition.Change />
    <Transition.Out type="fade" durationMs={200} />
  </Transition.Together>
);

const TakeAwayFood = ({navigation, route}) => {
  const {isMoveOverCate, id, name, isMoveOver} = route.params || {};

  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const {orders, partners} = useSelector((state) => state);

  const ref = useRef();
  const foodSelectRef = useRef({});
  const listCateRef = useRef(null);
  const [listCategory, setListCategory] = useState(null);
  const [listFood, setListFood] = useState([]);
  const [isModalQty, setIsModalQty] = useState(false);
  const [isNoFood, setIsNoFood] = useState(false);

  useEffect(() => {
    const foodCur = listFood.map((food) => {
      const order = orders.find((order) => order.id === food.id);
      return {
        ...food,
        count: order ? order.count : 0,
        sale_price: order ? order.sale_price : food.sale_price,
      };
    });
    setListFood(foodCur);
  }, [isFocused]);

  useEffect(() => {
    fetchApi();
  }, []);

  const fetchApi = async () => {
    try {
      //call api
      const [foods, comboFoods, promotions] = await Promise.all([
        FoodApi.getFoods(),
        FoodApi.getComboItemById(id),
        PromotionApi.getPromotionFood(partners.id),
      ]);
      //check combo or not
      const categoryFoods = comboFoods.length ? comboFoods : foods;
      //convert add list
      if (!categoryFoods.length) setIsNoFood(true);
      const [categoryAll, arrCate] = ConvertCategory(categoryFoods, promotions);
      //set list
      const arrFood = categoryAll?.items.map((food) => {
        const order = orders.find((order) => order.id === food.id);
        return {
          ...food,
          count: order ? order.count : 0,
          sale_price: order ? order.sale_price : food.sale_price,
        };
      });
      listCateRef.current = arrCate || [];
      setListCategory([categoryAll] || []);
      setListFood(arrFood || []);
    } catch (error) {
      console.log('Err @fetchApi ', error);
      setListCategory([]);
    }
  };

  //EVENT

  const _onRefresh = () => fetchApi();

  const _onMoveScreen = async (actionType) => {
    try {
      switch (actionType) {
        case 1:
          navigation.navigate(FOOD_ORDERED, {isEdit: true});
          break;
        case 2:
          _onComfirm();
          break;

        default:
          break;
      }
    } catch (error) {
      console.log('Err @onMoveScreen ', error);
    }
  };

  const _onComfirm = async () => {
    navigation.navigate(TAKEAWAY_PAYMENT, {isOrderTake: true, isMoveOver});
  };

  const _onSetCount = (item, action) => {
    const {id, count, unit_item, is_open_price} = item || {};

    // check qty
    if (is_open_price || (!is_open_price && unit_item?.qty_type === 1)) {
      foodSelectRef.current = item;
      setIsModalQty(true);
      return;
    }
    // update store food ordered
    action === 1
      ? dispatch(orderAction.addFood(item))
      : dispatch(orderAction.removeFood(item));
    // set quantity food
    const countCur = action === 1 ? count + 1 : count - 1;
    const arrFood = listFood.map((value) => {
      const isSelected = value.id === id;
      return {...value, count: isSelected ? countCur : value.count};
    });
    setListFood(arrFood);
  };

  const _onConfirmQty = (qty = 0, price = 0) => {
    const item = foodSelectRef.current;
    item.sale_price = price > 0 ? price : item.sale_price;

    // update store food ordered
    dispatch(orderAction.addQtyFood(item, qty, price));

    // set quantity food
    setListFood((curFoods) => {
      return curFoods.map((food) => {
        const isSelected = food.id === item.id;
        return {...food, count: isSelected ? qty : food.count};
      });
    });
  };

  const _onCloseCate = () => {
    const filterCate = listCateRef.current.find((value) => value.id === 'all');
    // const foods = filterCate.items.map((item) => {
    //   const order = orders.find((order) => order.id === item.id);
    //   return {
    //     ...item,
    //     count: order ? order.count : 0,
    //     sale_price: order ? order.sale_price : item.sale_price,
    //   };
    // });
    // setListCategory([filterCate] || []);
    // setListFood(foods || []);
  };

  const _onGoSearch = () => {
    navigation.navigate(SEARCH_FOOD, {
      idSelect: listCategory[0].id,
      categories: listCateRef.current,
      onSetCategory,
    });
  };

  const onSetCategory = (category = {}, foods) => {
    setListCategory([category] || []);
    setListFood(foods);
  };

  //RENDER COMPONENT

  const _renderHeader = () => {
    if (listCategory === null || !listCategory.length) return null;

    return (
      <HeaderWrap>
        {listCategory[0]?.id !== 'all' &&
          (listCategory === null || !listCategory.length) && (
            <CateWrap title={listCategory[0]?.name} onPress={_onCloseCate} />
          )}
        <RowWrap>
          <TextComponent medium>
            Tổng số món: <TextComponent heavy>{listFood.length}</TextComponent>
          </TextComponent>
          <BtnSearch onPress={_onGoSearch} />
        </RowWrap>
      </HeaderWrap>
    );
  };

  const _renderListFood = () => {
    if (listCategory === null) return <LoadingFood />;

    if (isNoFood) {
      return (
        <NoDataComponent
          title="Hiện tại nhà hàng chưa có món ăn!"
          onRefresh={_onRefresh}
        />
      );
    } else
      return (
        <ListFood
          data={listFood}
          isCategoryPrice={false}
          onPress={_onSetCount}
        />
      );
  };

  const _renderFooter = () => {
    if (!orders.length) return null;

    return (
      <FootWrap>
        <BtnDetails
          color={colors.PRIMARY}
          badge={orders.length}
          onPress={() => _onMoveScreen(1)}
        />
        <BtnPayment color={colors.ORANGE} onPress={() => _onMoveScreen(2)} />
      </FootWrap>
    );
  };

  //RENDER MAIN
  return (
    <Transitioning.View ref={ref} style={{flex: 1}} transition={transition}>
      <HeaderComponent title={name} />

      <Body>
        {_renderHeader()}
        {_renderListFood()}
        {_renderFooter()}
      </Body>

      <ModalEnterQty
        useVisible={[isModalQty, setIsModalQty]}
        item={foodSelectRef.current}
        onConfirm={_onConfirmQty}
      />
    </Transitioning.View>
  );
};

export default TakeAwayFood;
