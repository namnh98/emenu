import PropTypes from 'prop-types';
import React, {useState} from 'react';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import styled from 'styled-components/native';
import {colors} from '../../assets';

const AmountComponent = ({onGetCount, defaultValue}) => {
  const [count, setCount] = useState(defaultValue ? defaultValue : 0);

  const _onMinus = () => {
    if (count === 0) return;
    onGetCount(count - 1);
    setCount(count - 1);
  };

  const _onPlus = () => {
    onGetCount(count + 1);
    setCount(count + 1);
  };

  return (
    <Container>
      <Title>Số lượng </Title>

      <Button onPress={_onMinus}>
        <FontAwesome5 name="minus-circle" color={colors.ORANGE} size={25} />
      </Button>

      <Number>{count}</Number>

      <Button onPress={_onPlus}>
        <FontAwesome5 name="plus-circle" color={colors.ORANGE} size={25} />
      </Button>
    </Container>
  );
};

AmountComponent.prototype = {
  onGetCount: PropTypes.func,
};

export default AmountComponent;

const Container = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
`;

const Title = styled.Text`
  margin-right: 20px;
`;

const Number = styled.Text`
  margin-top: 5px;
  margin-bottom: 5px;
  margin-right: 10px;
  margin-left: 10px;
`;

const Button = styled.TouchableOpacity``;
