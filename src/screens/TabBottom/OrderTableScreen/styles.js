import { StyleSheet } from 'react-native';
import { colors } from '../../../assets';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bodyContainer: {
    flex: 1,
    padding: 10,
  },
  itemContainer: {
    marginBottom: 10,
  },
  itemHeaderWrapper: {
    backgroundColor: colors.ORANGE,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemHeaderText: {
    color: colors.WHITE,
  },
  itemHeaderPhone: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemBodyWrapper: {
    backgroundColor: colors.WHITE,
    padding: 10,
  },
  itemBodyBoxWrapper: {
    borderWidth: 1,
    borderColor: colors.TEXT_GRAY,
    borderRadius: 5,
    backgroundColor: colors.GRAY,
  },
  itemBodyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  borWidthGray: {
    borderBottomWidth: 1,
    borderBottomColor: colors.TEXT_GRAY,
  },
  itemBodyBoxBtn: {
    backgroundColor: colors.ORANGE,
    paddingVertical: 5,
    alignItems: 'center',
    marginTop: 10,
    borderRadius: 5,
  },
  itemBodyBoxBtnText: {
    color: colors.WHITE,
  },
  itemFootWrapper: {
    backgroundColor: colors.BLACK_GRAY,
    paddingVertical: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    alignItems: 'center',
  },
  BtnAdd: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 60,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: colors.PRIMARY,
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: colors.WHITE
  },
  searchTextAdd: {
    marginLeft: 5,
    color: colors.PRIMARY,
    fontSize: 13,
  },

});

export default styles;
