import {StyleSheet} from 'react-native';
import {colors} from '../../../assets';

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
    backgroundColor: colors.WHITE,
  },
  rowCenter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  devicesWidth: {
    width: 8,
  },
  button: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: colors.PRIMARY,
    alignSelf: 'flex-end',
    marginTop: 20,
    borderRadius: 5,
  },
  buttonSave: {
    width: 70,
    height: 70,
    position: 'absolute',
    right: 10,
    bottom: 10,
    backgroundColor: colors.WHITE,
    borderWidth: 1,
    borderColor: colors.PRIMARY,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: colors.PRIMARY,
  },
  blockError: {
    marginVertical: 10,
    lineHeight: 30,
  },
  textError: {
    color: colors.RED,
    fontStyle: 'italic',
  },
});

export default styles;
