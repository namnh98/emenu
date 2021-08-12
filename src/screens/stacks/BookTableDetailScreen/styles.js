import { StyleSheet } from 'react-native';
import { colors } from '../../../assets';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bodyContainer: {
    padding: 10,
  },
  itemCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowCenter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',

  },
  button: {
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginRight: 10,
    width: 100,
    height: 70,
  },
  buttonEdit: {
    width: 70,
    height: 60,
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: colors.WHITE,
    borderWidth: 1,
    borderColor: colors.PRIMARY,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    marginTop: 5,
  },
  deviceWidth: {
    width: 20,
  },
});

export default styles;
