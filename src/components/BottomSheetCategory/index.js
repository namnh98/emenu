import PropTypes from 'prop-types';
import React from 'react';
import {StatusBar, StyleSheet} from 'react-native';
import styled from 'styled-components/native';
import {colors} from '../../assets';
import BottomSheet from '../BottomSheet';
import ButtonComponent from '../ButtonComponent';
import TextComponent from '../TextComponent';

const BottomSheetCategory = ({
  setRef,
  value,
  onClose,
  onNumberFood,
  onFoodOrder,
}) => {
  return (
    <BottomSheet setRef={setRef} onClose={onClose}>
      <Container>
        <StatusBar backgroundColor="#00000076" />
        <TextComponent center heavy medium mBottom={15}>
          {value.name}
        </TextComponent>

        <ButtonComponent
          onPress={onNumberFood}
          title="Số suất"
          iconName="table-plus"
          titleCenter
          style={styles.button}
          iconStyle={styles.icon}
          titleColor={colors.WHITE}
          bgButton={colors.PRIMARY}
          paddingV={15}
          borRadius={30}
          mBottom={15}
        />
        <ButtonComponent
          onPress={onFoodOrder}
          title="Danh sách chọn món"
          iconName="food"
          titleCenter
          style={styles.button}
          iconStyle={styles.icon}
          titleColor={colors.WHITE}
          bgButton={colors.PRIMARY}
          paddingV={15}
          borRadius={30}
        />
      </Container>
    </BottomSheet>
  );
};

BottomSheetCategory.prototype = {
  setRef: PropTypes.shape({current: PropTypes.any}),
  value: PropTypes.object,
  onClose: PropTypes.func,
  onNumberFood: PropTypes.func,
  onFoodOrder: PropTypes.func,
};

const Container = styled.View`
  flex: 1;
  padding: 10px;
`;

const styles = StyleSheet.create({
  icon: {
    position: 'absolute',
    left: 15,
    borderWidth: 2,
    borderColor: colors.WHITE,
    borderRadius: 50,
    padding: 5,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BottomSheetCategory;
