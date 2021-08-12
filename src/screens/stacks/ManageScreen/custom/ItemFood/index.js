import React, { useState, useRef, useEffect } from 'react';
import {
  Text,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  Easing,
  View,
  LayoutAnimation,
  Platform,
  UIManager,
  Pressable
} from 'react-native';
import { Sizes } from '@dungdang/react-native-basic';
import { styles } from './style';

import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../../../../assets';

const { width, height } = Dimensions.get('window');
const deleteWidth = width * 0.2;

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ItemFood = (props) => {
  const [isFix, setisFix] = useState(props.isFix);
  const [isDelete, setisDelete] = useState(props.isDelete);
  const scrollRef = useRef();
  const [showmore, setShowMore] = useState(false);
  const index = props.index; //index của item
  const openindex = props.openindexitem; //index của item đã open
  const valueexpand = useRef(new Animated.Value(0)).current;

  //item a tự động đóng khi item b mở
  // useEffect(() => {
  //   if (index !== openindex) {
  //     scrollRef.current.scrollTo({ x: 0, y: 0, animated: true });
  //   }
  // })

  // const onPressDelete = () => {
  //   props.onPressDelete();
  //   setisDelete(!isDelete)
  // }
  // const onPressShowMore = () => {
  //   LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  //   setShowMore(!showmore)
  // }
  return (
    <Pressable onPress={() => props.onPressItemDetail()} style={({ pressed }) => [{
      backgroundColor: pressed ? colors.ORANGE : null
    }, styles.container]}>
      <Image source={require('../../../../../assets/1.jpeg')} style={styles.imageItem} />
      <View style={styles.contentItem}>
        <Text style={styles.title}>
          Tên món: {props.Maintitle}
        </Text>
        <Text style={styles.title2}>
          Giá: {props.MainPrice}
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: Sizes.s200 * 2.5 }}>
          <Text style={styles.title2}>
            Đơn vị: {props.MainKind}
          </Text>
          <View style={[styles.status, { backgroundColor: colors.PRIMARY }]}>
            <Text style={styles.statustext}>Còn</Text>
          </View>
        </View>
      </View>
    </Pressable>
  )
}
export default ItemFood

