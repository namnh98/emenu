import {StatusBar, StyleSheet} from 'react-native';
import colors from '../../../assets/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerWrapper: {
    flex: 3,
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  bodyWrapper: {
    flex: 6,
    padding: 10,
    marginTop: 10,
  },
  itemWrapper: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: colors.GRAY,
    marginBottom: 10,
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemHeaderImage: {
    width: 40,
    height: 40,
    marginRight: 15,
  },
  buttonSelect: {
    backgroundColor: colors.GRAY,
    flexDirection: 'row',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  titleSelect: {
    fontSize: 16,
    fontWeight: '900',
    marginLeft: 10,
    fontWeight: 'bold',
  },
  bodyTitle: {
    fontSize: 16,
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  itemBodyTitle: {
    fontSize: 16,
    fontWeight: '900',
    fontWeight: 'bold',
  },
  statusWrapper: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
  },
});

export default styles;
