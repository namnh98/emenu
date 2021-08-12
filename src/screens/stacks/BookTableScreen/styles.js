import { StyleSheet } from 'react-native';
import { colors } from '../../../assets';
import { Sizes } from '@dungdang/react-native-basic'

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textHoldel: {
    color: colors.TEXT_GRAY,
  },
  bodyContainer: {
    padding: 10,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: colors.GRAY,
    padding: 5,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: colors.WHITE,
  },
  rowCenter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',

  },
  devicesWidth: {
    width: 8,
  },
  button: {
    width: 100,
    height: 40,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.ORANGE,
    alignSelf: 'flex-end',
    marginTop: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginRight: 10,
    backgroundColor: colors.WHITE,
  },
  buttonText: {
    color: colors.WHITE
  },
  blockError: {
    marginVertical: 10,
    lineHeight: 30,
  },
  textError: {
    color: colors.RED,
    fontStyle: 'italic',
  },
  buttonTimePicker: {
    backgroundColor: 'red',
    justifyContent: 'center',
    left: 200
  },
  backgroundTimePicker: {
    backgroundColor: colors.ORANGE,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '30%', 
    height: 40,
    borderRadius: 10,
  },
  time: {
    textAlign: 'center',
    width: Sizes.s100 + Sizes.s10,
    height: Sizes.s100 - Sizes.s20,
    paddingTop: Sizes.s20,
    fontSize: Sizes.h20 * 2,
    left: Sizes.s100 - Sizes.s10 / 2,
    color: colors.WHITE
  }
});

export default styles;
