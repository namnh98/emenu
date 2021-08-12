import {StyleSheet} from 'react-native';
import {colors} from '../../../assets';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
    padding: 10,
  },
  itemWrapper: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginBottom: 10,
    padding: 10,
    height: 80,
  },
  itemImage: {
    width: 60,
    height: 60,
    marginHorizontal: 20,
  },
  contentWrapper: {
    flex: 7,
    justifyContent: 'center',
  },
  contentTitle: {
    fontSize: 16,
    marginTop: 5,
  },
  contentSubTitle: {
    fontSize: 14,
  },
  timeWrapper: {
    position: 'absolute',
    top: 3,
    right: 5,
  },
  itemHiddenWrapper: {
    height: 80,
    alignSelf: 'flex-end',
    flexDirection: 'row',
  },
  itemHiddenLeft: {
    width: 60,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemHiddenRight: {
    width: 60,
    height: '100%',

    justifyContent: 'center',
    alignItems: 'center',
  },
  itemHiddenText: {
    textAlign: 'center',
    color: colors.WHITE,
    fontSize: 12,
  },
  deviceHeight: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 5,
  },
});

export default styles;
