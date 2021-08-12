import PropTypes from 'prop-types';
import React, { useState} from 'react';
import { Image, Text, Dimensions } from 'react-native';
import styled from 'styled-components/native';
import { colors, images } from '../../assets';
import I18n from '../../i18n';
const { width } = Dimensions.get("window");
const ButtonChangeTable = ({
  isEmptyTable,
  countTableEmpty,
  countTableUsed,
  onPress,
}) => {
  const bgEmpty = isEmptyTable ? colors.ORANGE : colors.WHITE;
  const bgUsed = !isEmptyTable ? colors.ORANGE : colors.WHITE;
  const colorEmpty = isEmptyTable ? 'white' : colors.DARK_BROWN;
  const colorUsed = !isEmptyTable ? 'white' : colors.DARK_BROWN;
  const textEmpty = isEmptyTable ? 'white' : colors.ORANGE;
  const textUsed = !isEmptyTable ? 'white' : colors.ORANGE;

  const [selectTab, setSelectTab] = useState(0)
  const onSelectTabA = () => {
    onPress(true)
    setSelectTab(0)
  }
  const onSelectTabB = () => {
    onPress(false)
    setSelectTab(1)
  }

  return (
    <Container>
      <ActiveTab
        style={{
          left: selectTab == 0 ? 2 : null,
          right: selectTab == 1 ? 2 : null
        }}
      />
      <Button onPress={() => onSelectTabA()} >
        <Image style={{ tintColor: colorEmpty }} source={images.EMPTY_TABLE} />
        <Text style={{ color: textEmpty, marginLeft: 5 }}>
          {I18n.t('home.emptyTable')} ({countTableEmpty || 0})
        </Text>
      </Button>
      <Button onPress={() => onSelectTabB()} >
        <Image style={{ tintColor: colorUsed }} source={images.USED_TABLE} />
        <Text style={{ color: textUsed, marginLeft: 5 }}>
          {I18n.t('home.usedTable')} ({countTableUsed || 0})
        </Text>
      </Button>
    </Container>
  );
};

ButtonChangeTable.prototype = {
  isEmptyTable: PropTypes.bool,
  countTableEmpty: PropTypes.number,
  countTableUsed: PropTypes.number,
  onEmptyTable: PropTypes.func,
  onUsedTable: PropTypes.func,
};

export default ButtonChangeTable;

const Container = styled.View`
  position:relative;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
  margin-bottom: 10px;
  border-radius: 25px;
  padding:2px;
  overflow: hidden;
  background-color: ${colors.WHITE};
`;

const Button = styled.TouchableOpacity`
  flex: 1;
  height: 40px;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  /* box-shadow: 0px 5px 5px ${colors.BG_GRAY}; */
  border-radius: 20px;
`;
const ActiveTab = styled.View`
  position: absolute;
  height: 40px;
  width:${(width - 30)/2}px;
  background-color: ${colors.ORANGE};
  border-width:2px;
  border-radius:20px;
  border-color:#fff
`
