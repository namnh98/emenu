
package com.facebook.react;

import android.app.Application;
import android.content.Context;
import android.content.res.Resources;

import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainPackageConfig;
import com.facebook.react.shell.MainReactPackage;
import java.util.Arrays;
import java.util.ArrayList;

// @notifee/react-native
import io.invertase.notifee.NotifeePackage;
// @react-native-async-storage/async-storage
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
// @react-native-clipboard/clipboard
import com.reactnativecommunity.clipboard.ClipboardPackage;
// @react-native-community/art
import com.reactnativecommunity.art.ARTPackage;
// @react-native-community/datetimepicker
import com.reactcommunity.rndatetimepicker.RNDateTimePickerPackage;
// @react-native-community/masked-view
import org.reactnative.maskedview.RNCMaskedViewPackage;
// @react-native-community/netinfo
import com.reactnativecommunity.netinfo.NetInfoPackage;
// @react-native-firebase/app
import io.invertase.firebase.app.ReactNativeFirebaseAppPackage;
// @react-native-firebase/messaging
import io.invertase.firebase.messaging.ReactNativeFirebaseMessagingPackage;
// react-native-code-push
import com.microsoft.codepush.react.CodePush;
// react-native-device-info
import com.learnium.RNDeviceInfo.RNDeviceInfo;
// react-native-extra-dimensions-android
import ca.jaysoo.extradimensions.ExtraDimensionsPackage;
// react-native-gesture-handler
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
// react-native-i18n
import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
// react-native-image-base64
import fr.snapp.imagebase64.RNImgToBase64Package;
// react-native-linear-gradient
import com.BV.LinearGradient.LinearGradientPackage;
// react-native-reanimated
import com.swmansion.reanimated.ReanimatedPackage;
// react-native-safe-area-context
import com.th3rdwave.safeareacontext.SafeAreaContextPackage;
// react-native-screens
import com.swmansion.rnscreens.RNScreensPackage;
// react-native-svg
import com.horcrux.svg.SvgPackage;
// react-native-system-setting
import com.ninty.system.setting.SystemSettingPackage;
// react-native-thermal-receipt-printer
import com.pinmi.react.printer.RNPrinterPackage;
// react-native-vector-icons
import com.oblador.vectoricons.VectorIconsPackage;
// react-native-view-shot
import fr.greweb.reactnativeviewshot.RNViewShotPackage;
// react-native-wheel-picker-android
import com.wheelpicker.WheelPickerPackage;

public class PackageList {
  private Application application;
  private ReactNativeHost reactNativeHost;
  private MainPackageConfig mConfig;

  public PackageList(ReactNativeHost reactNativeHost) {
    this(reactNativeHost, null);
  }

  public PackageList(Application application) {
    this(application, null);
  }

  public PackageList(ReactNativeHost reactNativeHost, MainPackageConfig config) {
    this.reactNativeHost = reactNativeHost;
    mConfig = config;
  }

  public PackageList(Application application, MainPackageConfig config) {
    this.reactNativeHost = null;
    this.application = application;
    mConfig = config;
  }

  private ReactNativeHost getReactNativeHost() {
    return this.reactNativeHost;
  }

  private Resources getResources() {
    return this.getApplication().getResources();
  }

  private Application getApplication() {
    if (this.reactNativeHost == null) return this.application;
    return this.reactNativeHost.getApplication();
  }

  private Context getApplicationContext() {
    return this.getApplication().getApplicationContext();
  }

  public ArrayList<ReactPackage> getPackages() {
    return new ArrayList<>(Arrays.<ReactPackage>asList(
      new MainReactPackage(mConfig),
      new NotifeePackage(),
      new AsyncStoragePackage(),
      new ClipboardPackage(),
      new ARTPackage(),
      new RNDateTimePickerPackage(),
      new RNCMaskedViewPackage(),
      new NetInfoPackage(),
      new ReactNativeFirebaseAppPackage(),
      new ReactNativeFirebaseMessagingPackage(),
      new CodePush(getResources().getString(com.omenustaff.R.string.CodePushDeploymentKey), getApplicationContext(), com.omenustaff.BuildConfig.DEBUG),
      new RNDeviceInfo(),
      new ExtraDimensionsPackage(),
      new RNGestureHandlerPackage(),
      new RNI18nPackage(),
      new RNImgToBase64Package(),
      new LinearGradientPackage(),
      new ReanimatedPackage(),
      new SafeAreaContextPackage(),
      new RNScreensPackage(),
      new SvgPackage(),
      new SystemSettingPackage(),
      new RNPrinterPackage(),
      new VectorIconsPackage(),
      new RNViewShotPackage(),
      new WheelPickerPackage()
    ));
  }
}
