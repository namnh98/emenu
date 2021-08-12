import React from 'react';
import {StatusBar} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import {colors} from '../../assets';

const BottomSheet = ({setRef, height, onOpen, onClose, children}) => {
  return (
    <RBSheet
      ref={setRef}
      height={height || 260}
      closeOnDragDown
      onOpen={onOpen}
      onClose={onClose}
      customStyles={{
        container: {
          paddingHorizontal: 10,
          backgroundColor: colors.DARK_WHITE,
          paddingBottom: 30,
          borderTopRightRadius: 5,
          borderTopLeftRadius: 5,
        },
        draggableIcon: {
          width: 40,
          height: 10,
        },
      }}>
      <StatusBar backgroundColor="#00000076" />
      {children}
    </RBSheet>
  );
};

export default BottomSheet;
