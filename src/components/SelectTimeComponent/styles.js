import {StyleSheet} from 'react-native';
import {colors} from '../../assets';

const styles = StyleSheet.create({
  container: {
    flex: 1 / 3,
    height: '100%',
    backgroundColor: colors.ORANGE,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  textTime: {
    color: colors.WHITE,
  },
});

export default styles;
