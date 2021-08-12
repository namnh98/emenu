import notifee, {
  EventType,
  IOSAuthorizationStatus,
} from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import { NavigationContainer } from '@react-navigation/native';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import React, { useEffect } from 'react';
import { StatusBar, Linking, Vibration } from 'react-native';
import {
  BookTable,
  BookTableDetail,
  EditFood,
  FoodCategory,
  FoodOrdered,
  Invoice,
  ListBill,
  Login,
  Notification,
  OrderFood,
  OrderPayment,
  Payment,
  PaymentDetail,
  ReportDetail,
  SelectUser,
  StartScreen,
  TakeAwayCategory,
  TakeAwayFood,
  TakeAwayPayment,
  UserDetail,
  BookSearchTable,
  OrderDetails,
  TakeAwaySearchScreen,
  BookTableEdit,
  PayOneByOneScreen,
  SearchFood,
  PrintBillBluetooth,
  CheckInOutScreen,
  Report,
  ContactScreen,
  Manage,
  ManageFood,
  HistoryPayment,
  HistoryPaymentDetail,
  AddFood,
  Editfood,
  FoodDetail
} from '../screens';
import {
  BOOK_TABLE,
  BOOK_TABLE_DETAIL,
  BOTTOM_TAB,
  EDIT_FOOD,
  FOOD_CATEGORY,
  FOOD_ORDERED,
  INVOICE,
  LIST_BILL,
  LOGIN,
  NOTIFICATION,
  ORDER_FOOD,
  ORDER_PAYMENT,
  PAYMENT,
  PAYMENT_DETAIL,
  REPORT_DETAIL,
  SELECT_USER,
  START_SCREEN,
  TAKEAWAY_CATEGORY,
  TAKEAWAY_FOOD,
  TAKEAWAY_PAYMENT,
  USER_DETAIL,
  BOOK_SEARCH_TABLE,
  ORDER_DETAILS,
  TAKEAWAY_SEARCH,
  BOOK_TABLE_EDIT,
  PAY_ONEBYONE,
  SEARCH_FOOD,
  PRINT_BILL_BLUETOOTH,
  CHECK_IN_OUT,
  TAB_WITH_CHECK_IN,
  REPORT,
  CONTACT,
  MANAGE,
  MANAGEFOOD,
  HISTORYPAYMENT,
  HISTORYPAYMENTDETAIL,
  ADDFOOD,
  EDITFOOD,
  FOODDETAIL
} from './ScreenName';
import TabNavWithCheckInCheckOut from './TabNavWithCheckInCheckOut';
import TabNavigator from './TabNavigator';
import linking from './linking';
import { images } from '../assets';

const Stack = createStackNavigator();

const RootNavigator = () => {
  // Check permission
  useEffect(() => {
    requestUserPermission();
  }, []);

  // Register foreground handler
  useEffect(() => {
    return messaging().onMessage(async (remoteMessage) => {
      const { body, title } = remoteMessage.notification;
      onDisplayNotification(body, title);
      Vibration.vibrate();
    });
  }, []);
  // Subscribe to events
  useEffect(() => {
    return notifee.onForegroundEvent(({ type, detail }) => {
      switch (type) {
        case EventType.DISMISSED:
          break;
        case EventType.PRESS:
          Linking.openURL('omenu://notification');
          break;
      }
    });
  }, []);
  useEffect(() => {
    return notifee.onBackgroundEvent(({ type, detail }) => {
      switch (type) {
        case EventType.DISMISSED:
          break;
        case EventType.PRESS:
          Linking.openURL('omenu://notification');
          break;
      }
    })
  }, []);
  //quyền truy cập
  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    await notifee.requestPermission({
      sound: true,
      inAppNotificationSettings: true,
      soundName: 'default',
    });
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      const fcmToken = await messaging().getToken();
      // console.log('@TokenFirebase ', fcmToken);
      await AsyncStorage.setItem('@fcmToken', fcmToken);
    }
  };
  //khi thông báo hiển thị foreground
  const onDisplayNotification = async (content, title) => {
    const settings = await notifee.requestPermission({
      sound: true
    });
    // Create a channel
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      sound: 'default',
    });
    // Display a notification
    await notifee.displayNotification({
      title,
      body: content,
      android: {
        channelId,
        smallIcon: 'logo_staff',
        largeIcon: images.LOGO_STAFF,
        sound: 'default',
      },
      ios: {
        sound: 'default',
      },
    });
  };

  return (
    <NavigationContainer linking={linking}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <Stack.Navigator
        initialRouteName={StartScreen}
        headerMode="none"
        screenOptions={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          gestureEnabled: true,
        }}>
        {/* start */}
        <Stack.Screen name={START_SCREEN} component={StartScreen} />

        {/* auth */}
        <Stack.Screen name={LOGIN} component={Login} />
        <Stack.Screen name={SELECT_USER} component={SelectUser} />

        {/* main */}
        <Stack.Screen
          name={TAB_WITH_CHECK_IN}
          component={TabNavWithCheckInCheckOut}
        />

        {/* stack */}
        <Stack.Screen name={BOTTOM_TAB} component={TabNavigator} />
        <Stack.Screen name={NOTIFICATION} component={Notification} />
        <Stack.Screen name={USER_DETAIL} component={UserDetail} />
        <Stack.Screen name={BOOK_TABLE} component={BookTable} />
        <Stack.Screen name={BOOK_TABLE_DETAIL} component={BookTableDetail} />
        <Stack.Screen name={FOOD_CATEGORY} component={FoodCategory} />
        <Stack.Screen name={ORDER_FOOD} component={OrderFood} />
        <Stack.Screen name={FOOD_ORDERED} component={FoodOrdered} />
        <Stack.Screen name={ORDER_PAYMENT} component={OrderPayment} />
        <Stack.Screen name={PAYMENT} component={Payment} />
        <Stack.Screen name={PAYMENT_DETAIL} component={PaymentDetail} />
        <Stack.Screen name={INVOICE} component={Invoice} />
        <Stack.Screen name={EDIT_FOOD} component={EditFood} />
        <Stack.Screen name={LIST_BILL} component={ListBill} />
        <Stack.Screen name={REPORT_DETAIL} component={ReportDetail} />
        <Stack.Screen name={TAKEAWAY_PAYMENT} component={TakeAwayPayment} />
        <Stack.Screen name={TAKEAWAY_CATEGORY} component={TakeAwayCategory} />
        <Stack.Screen name={TAKEAWAY_FOOD} component={TakeAwayFood} />
        <Stack.Screen name={BOOK_SEARCH_TABLE} component={BookSearchTable} />
        <Stack.Screen name={ORDER_DETAILS} component={OrderDetails} />
        <Stack.Screen name={TAKEAWAY_SEARCH} component={TakeAwaySearchScreen} />
        <Stack.Screen name={BOOK_TABLE_EDIT} component={BookTableEdit} />
        <Stack.Screen name={PAY_ONEBYONE} component={PayOneByOneScreen} />
        <Stack.Screen name={SEARCH_FOOD} component={SearchFood} />
        <Stack.Screen name={REPORT} component={Report} />
        <Stack.Screen name={CONTACT} component={ContactScreen} />
        <Stack.Screen name={MANAGE} component={Manage} />
        <Stack.Screen name={MANAGEFOOD} component={ManageFood} />
        <Stack.Screen name={ADDFOOD} component={AddFood} />
        <Stack.Screen name={EDITFOOD} component={Editfood} />
        <Stack.Screen name={FOODDETAIL} component={FoodDetail} />
        <Stack.Screen name={HISTORYPAYMENT} component={HistoryPayment} />
        <Stack.Screen name={HISTORYPAYMENTDETAIL} component={HistoryPaymentDetail} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
