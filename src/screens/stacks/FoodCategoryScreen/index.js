import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {FoodApi, PromotionApi, PartnerApi} from '../../../api';
import {
  BottomSheetCategory,
  HeaderComponent,
  ListCategoryFood,
  LoadingCategory,
  ModalAddQuantity,
  ModalCfirmComponent,
  NoDataComponent,
} from '../../../components';
import {ORDER_FOOD} from '../../../navigators/ScreenName';
import {orderAction} from '../../../redux/actions';
import {Body, Container} from './styles';
import {AlertModal} from '../../../common';

const FoodCategory = ({navigation, route}) => {
  const dispatch = useDispatch();
  const partners = useSelector(state => state.partners);

  const RBSheetRef = useRef();
  const isCheck = useRef(0);
  const [listCategory, setListCategory] = useState(null);
  const [isModalQuantity, setIsModalQuantity] = useState(false);
  const [isModalAlert, setIsModalAlert] = useState(false);
  const [categorySelect, setCategorySelect] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadModal, setIsLoadModal] = useState(false);
  const isFocused = useIsFocused()
  useEffect(() => {
    dispatch(orderAction.resetFood());
  }, [isFocused]);

  useEffect(() => {

    fetchApi().finally(() => setIsLoading(false));
  }, []);

  const fetchApi = async () => {
    try {
      const [categories, promotions, allFood] = await Promise.all([
        FoodApi.getComboFoods(),
        PromotionApi.getPromotionCategory(partners.id),
        FoodApi.getFoods(),
      ]);
      const counterAllFoods = allFood.reduce(
        (init, item) => init + item.items.length,
        0,
      );

      // params from edit food
      const {order_combo_items} = route.params;
      if (order_combo_items?.length) {
        return setListCategory(curCategories => {
          return categories.map(category => {
            const isSelected =
              order_combo_items[0]?.combo_item_id === category.id;
            return {
              ...category,
              countRate: isSelected ? order_combo_items[0]?.qty : 0,
              countOrder: 0,
            };
          });
        });
      }
      const res = await PartnerApi.getPartnerSetting();
      let filterList = [];
      if (res.is_buffet === false) {
        filterList = categories.filter(item => item.is_price === false);
      } else {
        filterList = categories;
      }
      let listFoodOfAllCombos = [];
      for (const item of filterList) {
        for (const _item of item.items) {
          if (!listFoodOfAllCombos.find(element => element.id === _item.id)) {
            listFoodOfAllCombos.push(_item);
          }
        }
      }
      if (listFoodOfAllCombos.length != counterAllFoods) {
        filterList.push({
          combo_item_imgs: [],
          id: null,
          image:
            'https://staging-omenu-storage.s3-ap-southeast-1.amazonaws.com/web_root/omenu/static/icon/combo_item/breakfast.png',
          is_price: false,
          name: 'Tất cả',
        });
      }
      setListCategory(curCategories => {
        return filterList.map(category => {
          const promotion = promotions.find(
            promotion => promotion.id === category.id,
          );
          return {...category, countRate: 0, countOrder: 0, promotion};
        });
      });
    } catch (error) {
      console.log('Err @fetchApi ', error);
      setListCategory([]);
    }
  };

  const _onShowAlert = () => setIsModalAlert(!isModalAlert);

  const _onSelectCategory = item => {
    if (!item.is_price) {
      const {orderId, areaId, table} = route.params;
      return navigation.navigate(ORDER_FOOD, {
        orderId,
        area_id: areaId,
        table_id: table.id,
        table_name: table.name,
        combo_id: item.id,
        combo_name: item.name,
        isPrice: false,
        table,
      });
    }
    RBSheetRef.current.open();
    setCategorySelect(item);
  };

  const _onSetNumberFood = () => {
    isCheck.current = 1;
    RBSheetRef.current.close();
  };

  const _onFoodOrder = () => {
    RBSheetRef.current.close();

    const category = listCategory.find(value => value.id === categorySelect.id);
    if (category.countRate > 0) {
      const {orderId, areaId, table} = route.params;
      return navigation.navigate(ORDER_FOOD, {
        orderId,
        area_id: areaId,
        table_id: table.id,
        table_name: table.name,
        combo_id: category.id,
        combo_name: category.name,
        countRate: category.countRate,
        isPrice: true,
        table,
      });
    }

    isCheck.current = 2;
  };

  const _onConfirm = count => {
    if (count === 0) return setIsModalQuantity(false);

    const result = listCategory.map(value => {
      const isSelect = value.id === categorySelect.id;
      return {...value, countRate: isSelect ? count : 0};
    });
    setListCategory(result);
    setIsModalQuantity(false);

    const category = listCategory.find(value => value.id === categorySelect.id);
    const {orderId, areaId, table} = route.params;
    navigation.navigate(ORDER_FOOD, {
      orderId,
      area_id: areaId,
      table_id: table.id,
      table_name: table.name,
      combo_id: category.id,
      combo_name: category.name,
      countRate: count,
      isPrice: true,
      isMoveOver: false,
      table,
    });
  };

  const _onClose = () => {
    if (isCheck.current === 0) return;
    switch (isCheck.current) {
      case 1:
        setIsModalQuantity(!isModalQuantity);
        break;
      case 2:
        _onShowAlert();
        break;

      default:
        break;
    }
    isCheck.current = 0;
  };

  const _onRefresh = () => {};

  const _renderList = () => {
    if (isLoading) return <LoadingCategory />;

    if (!listCategory?.length)
      return (
        <NoDataComponent title="Không tìm thấy suất!" onRefresh={_onRefresh} />
      );
    else {
      return (
        <ListCategoryFood
          listCategory={listCategory}
          onPress={_onSelectCategory}
        />
      );
    }
  };

  return (
    <Container>
      <HeaderComponent title="Danh sách suất ăn" />

      <Body>{_renderList()}</Body>

      <BottomSheetCategory
        setRef={RBSheetRef}
        value={categorySelect}
        onNumberFood={_onSetNumberFood}
        onClose={_onClose}
        onFoodOrder={_onFoodOrder}
      />

      <ModalAddQuantity
        isVisible={isModalQuantity}
        loading={isLoadModal}
        itemSelect={categorySelect}
        onClosePopup={_onSetNumberFood}
        onConfirm={_onConfirm}
      />

      <ModalCfirmComponent
        isVisible={isModalAlert}
        onClosePopup={_onShowAlert}
        content={AlertModal.CONTENT[26]}
      />
    </Container>
  );
};

export default FoodCategory;
