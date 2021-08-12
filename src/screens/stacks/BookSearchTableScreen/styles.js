import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../../assets';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bodyContainer: {
    padding: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.GRAY,
    padding: 5,
    borderRadius: 5,
    marginBottom: 10,
    height: 40,
    backgroundColor: colors.WHITE,
  },
  rowCenter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  datePicker: { flex: 1, paddingLeft: 15 },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    height: Dimensions.get('window').height * 0.1 / 2,
    // backgroundColor: 'blue'
  },
  devicesWidth: {
    width: 20,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: colors.ORANGE,
    backgroundColor: colors.WHITE,
    alignSelf: 'flex-end',
    marginTop: 15,
    borderRadius: 20,
    flexDirection: 'row',
  },
  buttonText: {
    color: colors.ORANGE,
    paddingLeft: 5,
  },
});

export default styles;
