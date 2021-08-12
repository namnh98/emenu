import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {colors} from '../../assets';
import I18n from '../../i18n';
import {BOOK_SEARCH_TABLE} from '../../navigators/ScreenName';

const {width} = Dimensions.get('screen');

const HeaderFlatList = ({params, results, _onBookSearchTable}) => {
  // const navigation = useNavigation();
  return (
    <View style={styles.searchTitleWrapper}>
      <Text style={styles.searchTitle}>Có {results} kết quả</Text>
      <TouchableOpacity style={styles.searchBtn} onPress={_onBookSearchTable}>
        <FontAwesome name="search" size={15} color={colors.PRIMARY} />
        <Text style={styles.searchText}>Tìm kiếm theo</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HeaderFlatList;

const styles = StyleSheet.create({
  searchTitleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  searchTitle: {
    fontWeight: 'bold',
    color: colors.BLACK_GRAY,
  },
  searchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },

  searchText: {
    marginLeft: 5,
    color: colors.PRIMARY,
  },
});
