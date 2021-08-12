import { Sizes } from '@dungdang/react-native-basic';
import { arrayIsEmpty } from '@dungdang/react-native-basic/src/Functions';
import React, { useEffect, useRef, useState } from 'react';
import {
   View,
   Text,
   Modal,
   TouchableWithoutFeedback,
   StyleSheet,
   Animated,
   Dimensions,
   Image,
   TouchableOpacity,
   FlatList,
   Alert,
   SafeAreaView,
} from 'react-native';
import { colors } from '../../../../assets'
import TextInputAnimated from './TextInputAnimated';

import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import FeatherIcon from 'react-native-vector-icons/Feather'

const screenHeight = Dimensions.get('window').height;

const Picker = (props) => {
   const listItemRef = useRef(); // flatlist ref
   const [show, setShow] = useState(false); //is show picker
   const [selectedItem, setSelectedItem] = useState(''); //item đã chọn
   const [selectedIndex, setSelectedIndex] = useState(0); //index của item đã chọn
   const modalHeight = screenHeight * 0.2;
   const translateY = new Animated.Value(modalHeight);
   const modalShowTime = 300; //thời gian ẩn hiện modal (milisecond)

   // hiện modal/////////////////
   const showModal = () => {
      Animated.timing(translateY, {
         toValue: 0,
         duration: modalShowTime,
         useNativeDriver: true,
      }).start();
      //scroll tới item đã chọn
      setTimeout(() => {
         listItemRef.current.scrollToIndex({
            animated: true,
            index: selectedIndex,
         });
      }, 100);
   };

   //ẩn modal/////////////////
   const hideModal = () => {
      Animated.timing(translateY, {
         toValue: modalHeight,
         duration: modalShowTime,
         useNativeDriver: true,
      }).start();
   };

   //giá trị chiều cao của picker tăng dần và giảm dần
   // const modalHeight = height.interpolate({
   //    inputRange: [0, 1],
   //    outputRange: [0, screenHeight * 0.5],
   // });

   ///////ẩn hiện picker////////////
   useEffect(() => {
      show ? showModal() : hideModal();
   }, [show]);

   //get prevProps của data
   const usePrevious = (data) => {
      const ref = React.useRef();
      useEffect(() => {
         ref.current = data;
      }, [data]);
      return ref.current;
   };
   var prevData = usePrevious(props.data);

   //set Selected Item = '' khi data thay đổi
   useEffect(() => {
      if (prevData !== props.data) {
         setSelectedItem('');
      }
   }, [props.data]);

   //ẩn picker khi nhấn ngoài hoặc X
   const onPressHideModal = () => {
      hideModal();
      setTimeout(() => {
         setShow(!show);
      }, modalShowTime);
   };

   //item list chọn/////////////////
   const renderItemPicker = ({ item, index }) => (
      <TouchableOpacity
         onPress={() => {
            hideModal();
            setTimeout(() => {
               setSelectedItem(item);
               setSelectedIndex(index);
               props.onChangeItem(item);
               setShow(false);
            }, modalShowTime);
         }}
         style={[
            styles.itemPicker,
            selectedItem === item && { backgroundColor: colors.BLUE },
         ]}>
         <Text style={styles.textItem}>{item.label}</Text>
         {selectedItem === item && (
            <MaterialIcon
               name='check-circle'
               size={Sizes.h48} />
         )}
      </TouchableOpacity>
   );
   //////////////////////////////////////////////////
   return (
      <View style={{ width: Sizes.s200 * 2 }}>
         <TextInputAnimated
            styleLabel={{ color: colors.gray1 }}
            activeOpacity={0.5}
            onPress={() => {
               arrayIsEmpty(props.data)
                  ? Alert.alert('Thông báo', props.noDataMessage)
                  : setShow(!show);
            }}
            isPicker
            value={selectedItem === '' ? '' : selectedItem.label.toString()}
            label={props.label}
         />
         <Modal
            visible={show}
            transparent={true}
            animationType="fade"
            statusBarTranslucent={true}>
            <TouchableWithoutFeedback onPress={() => onPressHideModal()}>
               <View
                  style={{
                     flex: 1,
                     justifyContent: 'flex-end',
                     backgroundColor: 'rgba(0, 0, 0, 0.2)',
                  }}>
                  <TouchableWithoutFeedback>
                     <Animated.View
                        style={[
                           styles.modal,
                           {
                              transform: [{ translateY: translateY }],
                              height: modalHeight,
                           },
                        ]}>
                        {/* ///////title picker//////////////////// */}
                        <View style={styles.modalTitle}>
                           <TouchableOpacity
                              onPress={() => {
                                 onPressHideModal();
                              }}
                              style={{
                                 position: 'absolute',
                                 left: Sizes.h32,
                                 top: Sizes.h32,
                              }}>
                              <FeatherIcon
                                 name='x'
                                 size={Sizes.h48}
                                 color='#000' />
                           </TouchableOpacity>
                           <Text
                              style={{
                                 fontSize: Sizes.h32,
                                 color: colors.black,
                              }}>
                              {props.title}
                           </Text>
                        </View>
                        {/* ///////list item//////////////////// */}
                        <FlatList
                           ref={listItemRef}
                           keyboardShouldPersistTaps="always"
                           showsVerticalScrollIndicator={false}
                           data={props.data}
                           keyExtractor={(item, index) => {
                              String(index);
                           }}
                           renderItem={renderItemPicker}
                        />
                        <SafeAreaView />
                     </Animated.View>
                  </TouchableWithoutFeedback>
               </View>
            </TouchableWithoutFeedback>
         </Modal>
      </View>
   );
};

export default Picker;

Picker.defaultProps = {
   data: [],
   value: '',
   label: 'Vui lòng chọn',
   title: 'Vui lòng chọn',
   noDataMessage: 'Không có dữ liệu',
   onChangeItem: () => { },
};
const styles = StyleSheet.create({
   modal: {
      backgroundColor: colors.white,
      borderTopRightRadius: Sizes.h24,
      borderTopLeftRadius: Sizes.h24,
   },
   modalTitle: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      padding: Sizes.h32,
      backgroundColor: '#fff'
   },
   itemPicker: {
      height: Sizes.h28 * 4,
      paddingHorizontal: Sizes.h32,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#fff'
   },
   textItem: {
      fontSize: Sizes.h32,
      color: colors.black,
   },
});
