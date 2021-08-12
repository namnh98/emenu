import {StyleSheet} from 'react-native';
import {colors} from '../../assets';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    borderWidth: 1,
    borderColor: colors.BG_GRAY,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  time: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default styles;
