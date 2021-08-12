import React, { useState } from 'react';
import { Dimensions, StatusBar, StyleSheet, View } from 'react-native';
import { colors } from '../../assets';
import BottomSheet from '../BottomSheet';
import ButtonComponent from '../ButtonComponent';
import ButtonSelectArea from '../HomeComponent/ButtonSelectArea';
import ListAreaComponent from '../ListAreaComponent';
import ListTableComponent from '../ListTableComponent';
import TextComponent from '../TextComponent';

const { height } = Dimensions.get('screen');

const ModalTablesComponent = (props) => {
  const {
    setRef,
    listTable,
    onSelectTable,
    onSelectArea,
    onConfirm,
    areaName,
    areaLength,
    action,
    tableSelected,
    onClose,
  } = props;
  const [isModalArea, setIsModalArea] = useState(false);
  const _onSelectArea = () => setIsModalArea(!isModalArea);
  const _groupName = listTable.reduce((init, item, index) => {
    return init + (index === 0 ? item.name : `, ${item.name}`);
  }, '');

  return (
    <BottomSheet
      onClose={() => onClose()}
      setRef={setRef}
      height={height / 1.5}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: action ? 'flex-end' : 'space-between',
          alignItems: 'center',
          marginBottom: 10,
        }}>
        <StatusBar backgroundColor="#00000076" />
        {areaLength !== 1 && (action === undefined || action === null) && (
          <ButtonSelectArea
            onSelectArea={onSelectArea}
            areaName={areaName}
            showIcon={false}
          />
        )}
        {(action === null || action != 1) && (
          <ButtonComponent
            onPress={onConfirm}
            title="Xác nhận"
            titleColor={colors.WHITE}
            titleStyle={{ marginLeft: 5 }}
            iconName="check-circle"
            iconColor={colors.WHITE}
            row
            // right
            bgButton={colors.WHITE}
            borRadius={10}
            padding={5}
          />
        )}
      </View>

      <TextComponent center heavy mBottom={10}>
        {action === 1
          ? `NHÓM BÀN GHÉP ${_groupName}`
          : action === 3
            ? 'CHỌN BÀN GHÉP THÊM'
            : action === 2
              ? 'CHỌN BÀN CẦN TÁCH'
              : action === 4
                ? 'CHỌN BÀN MUỐN CHUYỂN'
                : 'DANH SÁCH BÀN'}
      </TextComponent>

      <ListTableComponent
        listTable={listTable}
        isEmptyTable={true}
        isOpacity
        onSelectTable={action === 1 ? null : onSelectTable}
      />

      {props.children}
    </BottomSheet>
  );
};

export default ModalTablesComponent;

const styles = StyleSheet.create({});
