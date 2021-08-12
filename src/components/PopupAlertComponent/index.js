import React from 'react';
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors, images} from '../../assets';
import {HeaderPopup} from '../../components';
import I18n from '../../i18n';

const PopupAlertComponent = ({isVisible, onPress}) => {
  if (!isVisible) return null;

  return (
    <View style={styles.container}>
      <ImageBackground style={styles.imageWrapper} source={images.BACKGROUND}>
        <View style={styles.contentWrapper}>
          <HeaderPopup title={I18n.t('alertComponent.title')} />

          <View style={styles.bodyWrapper}>
            <Image style={styles.logoWrapper} source={images.LOGO_STAFF} />

            <Text style={styles.textWrapper}>
              {I18n.t('alertComponent.content1')}
              {'\n'}
              {I18n.t('alertComponent.content2')}
              <Text style={styles.textSupport}>
                {I18n.t('alertComponent.content3')}
              </Text>
              {I18n.t('alertComponent.content4')}
              {'\n'}
              <Text style={styles.textSupport}>
                {I18n.t('alertComponent.content5')}
              </Text>
              {'\n'}
              <Text style={styles.textSupport}>
                {I18n.t('alertComponent.content6')}
              </Text>
              {'\n'}
              {I18n.t('alertComponent.content8')}
              <Text style={styles.textWebsite}>
                {I18n.t('alertComponent.content9')}
              </Text>
              {'\n'}
              <Text style={styles.textTutorial}>
                {I18n.t('alertComponent.content10')}
              </Text>
            </Text>

            <View style={styles.textThanksWrapper}>
              <Text style={styles.textThanks}>
                {I18n.t('alertComponent.content11')}
              </Text>
            </View>

            <TouchableOpacity onPress={onPress} style={styles.buttonWrapper}>
              <Text style={styles.titleButton}>
                {I18n.t('alertComponent.content12')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default PopupAlertComponent;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: colors.BLACK_GRAY,
  },
  imageWrapper: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    alignContent: 'center',
  },
  contentWrapper: {
    backgroundColor: 'white',
    borderRadius: 5,
  },
  bodyWrapper: {
    padding: 10,
    alignItems: 'center',
  },
  logoWrapper: {
    width: 120,
    height: 120,
  },
  textWrapper: {
    textAlign: 'center',
    color: colors.BROWN,
    fontWeight: '900',
    fontSize: 16,
  },
  textSupport: {
    fontWeight: 'bold',
  },
  textWebsite: {
    color: colors.YELLOW,
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  textTutorial: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  textThanksWrapper: {
    width: '80%',
    padding: 5,
    backgroundColor: colors.BROWN,
    marginVertical: 5,
  },
  textThanks: {
    color: 'white',
    textAlign: 'center',
  },
  buttonWrapper: {
    backgroundColor: colors.ORANGE,
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 20,
    marginTop: 10,
  },
  titleButton: {
    color: 'white',
  },
});
