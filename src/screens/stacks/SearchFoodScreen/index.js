import React, {useState} from 'react';
import {BodyWrap, BtnSearch, DropDown, Search, Wrapper} from './styles';
import {HeaderComponent} from '../../../components';
import {useSelector} from 'react-redux';

const SearchFood = ({navigation, route}) => {
  const {orders} = useSelector((state) => state);
  const {idSelect, categories, onSetCategory} = route.params || {};
  const ITEM_SELECT = categories.find((value) => value.id === idSelect);
  const ITEMS = categories.map((item) => {
    return {label: item.name, value: item.id};
  });

  const [valueCate, setValueCate] = useState(ITEM_SELECT.id);
  const [valueSearch, setValueSearch] = useState('');

  const _onChangeCate = ({value}) => setValueCate(value);

  const _onChangeSearch = (text) => setValueSearch(text);

  const _onSearch = () => {
    try {
      const filterCate = categories.find((value) => value.id === valueCate);
      const {items} = filterCate;

      const newData = items.filter((item) => {
        const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
        const textData = valueSearch.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      const foods = newData.map((item) => {
        const order = orders.find((order) => order.id === item.id);
        return {
          ...item,
          count: order ? order.count : 0,
          sale_price: order ? order.sale_price : item.sale_price,
        };
      });
      onSetCategory(filterCate, foods);
    } catch (error) {
      console.log('Err @onSearch ', error);
    } finally {
      navigation.goBack();
    }
  };

  return (
    <Wrapper>
      <HeaderComponent title="Tìm kiếm món ăn" />
      <BodyWrap>
        <DropDown
          items={ITEMS}
          defaultValue={ITEM_SELECT.id}
          onChangeItem={_onChangeCate}
        />
        <Search value={valueSearch} onChangeText={_onChangeSearch} />
        <BtnSearch onPress={_onSearch} />
      </BodyWrap>
    </Wrapper>
  );
};

export default SearchFood;
