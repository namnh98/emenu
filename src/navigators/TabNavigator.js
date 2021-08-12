/* eslint-disable react-hooks/exhaustive-deps */
import messaging from '@react-native-firebase/messaging';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React, {useEffect, useState} from 'react';
import {Platform} from 'react-native';
import {Badge} from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components/native';
import {PartnerApi} from '../api';
import {colors} from '../assets';
import I18n from '../i18n';
import {partnerAction} from '../redux/actions';
import {
  Confirm,
  Home,
  OrderFoodWithoutTable,
  OrderTable,
  Report,
  Takeaway,
} from '../screens';
import {ModalCheckInOut} from '../components';
import {
  CONFIRM,
  HOME,
  ODER_TABLE,
  ORDER_FOOD_WITHOUT_TABLE,
  REPORT,
  TAKE_AWAY,
} from './ScreenName';
const Tab = createMaterialTopTabNavigator();

const TabNavigator = () => {
  const [isTable, setIsTable] = useState(null);
  const [isConfirmOrder, setIsConfirmOrder] = useState();
  const {shift} = useSelector((state) => state);
  const [modalCheckInOut, setModalCheckInOut] = useState(false);
  const checkTimeCheckOut = () => {
    if (!shift?.check_in) return true;
    const {isOverNight, end_time, check_in_out, check_in} = shift;
    if (!end_time) return true;
    let splitEndTime = shift?.end_time.split(':');
    let timeNow = new Date().getHours() * 60 + new Date().getMinutes();
    let timeCheckOut =
      parseInt(splitEndTime[0]) * 60 +
      parseInt(splitEndTime[1]) +
      (isOverNight ? 24 * 60 : 0);
    if (timeNow >= timeCheckOut) return false;
    return true;
  };
  // const [isTakeAway, setIsTakeAway] = useState()
  // const [isBooking, setIsBooking] = useState()

  // useEffect(() => {
  //   async function getTokent() {
  //     const { token } = await users.getListUser();
  //     let decode = jwt_decode(token)
  //     const { role } = decode;
  //     isCheckShowBooking(userRoleCheck.role_19, role);
  //     isCheckShowTakeAway(userRoleCheck.role_5, role);
  //   }
  //   getTokent()
  // }, [])

  useEffect(() => {
    getPartnerInfo();
  }, [getPartnerInfo]);

  const getPartnerInfo = async () => {
    try {
      const partnerSetting = await PartnerApi.getPartnerSetting();
      setIsTable(partnerSetting?.is_table || false);
      setIsConfirmOrder(partnerSetting?.is_confirm_order_item);
      dispatch(partnerAction.success(partnerSetting));
    } catch (error) {
      console.log('@getPartnerInfo', error);
    }
  };

  // //check role booking
  // const isCheckShowBooking = (role, listRole) => {
  //   let checkRole = listRole.includes(role);
  //   if (checkRole) {
  //     setIsBooking(true)
  //   } else { setIsBooking(false) }
  // }

  // //check role takeaway
  // const isCheckShowTakeAway = (role, listRole) => {
  //   let checkRole = listRole.includes(role);
  //   if (checkRole) {
  //     setIsTakeAway(true)
  //   } else { setIsTakeAway(false) }
  // }

  const [countTable, setCountTable] = useState(0);
  const [countAway, setCountAway] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    return messaging().onMessage(async (remoteMessage) => {
      const {action, table_id} = remoteMessage.data;
      action === 'staff_order_item' &&
        table_id === '' &&
        setCountAway((countCur) => ++countCur);
      action === 'reservation' && setCountTable((countCur) => ++countCur);
    });
  }, []);

  return (
    <>
      {isTable === null ? null : (
        <>
          <Tab.Navigator
            tabBarPosition="bottom"
            lazy
            tabBarOptions={{
              activeTintColor: colors.ORANGE,
              inactiveTintColor: colors.GRAY,
              style: {backgroundColor: colors.WHITE},
              labelStyle: {fontSize: 12, marginTop: 0},
              indicatorStyle: {height: 0},
              tabStyle: {
                padding: 0,
                paddingTop: 5,
                paddingBottom: Platform.OS === 'ios' ? 20 : 5,
              },
              showIcon: true,
              showLabel: true,
            }}>
            {isTable ? (
              <>
                <Tab.Screen
                  name={HOME}
                  component={Home}
                  options={{
                    tabBarLabel: I18n.t('tabBottom.home'),
                    tabBarIcon: ({focused, color}) => {
                      return (
                        <MaterialCommunityIcons
                          name="table-large"
                          size={24}
                          color={color}
                        />
                      );
                    },
                  }}
                  listeners={({navigation, route}) => ({
                    tabPress: (e) => {
                      if (!checkTimeCheckOut()) {
                        setModalCheckInOut(true);
                      }
                    },
                  })}
                />
                <Tab.Screen
                  name={ODER_TABLE}
                  component={OrderTable}
                  options={{
                    tabBarLabel: I18n.t('tabBottom.order'),
                    tabBarIcon: ({focused, color}) => (
                      <Wrapper>
                        <MaterialCommunityIcons
                          name="table-clock"
                          size={24}
                          color={color}
                        />
                        {countTable > 0 && !focused && (
                          <BadgeWrap>
                            <Badge>{countTable}</Badge>
                          </BadgeWrap>
                        )}
                      </Wrapper>
                    ),
                  }}
                  listeners={({navigation, route}) => ({
                    tabPress: (e) => {
                      setCountTable(0);
                    },
                  })}
                />
              </>
            ) : (
              <Tab.Screen
                name={ORDER_FOOD_WITHOUT_TABLE}
                component={OrderFoodWithoutTable}
                options={{
                  tabBarLabel: I18n.t('tabBottom.orderfood'),
                  tabBarIcon: ({focused, color}) => (
                    <Wrapper>
                      <MaterialCommunityIcons
                        name="food"
                        size={24}
                        color={color}
                      />
                      {countTable > 0 && !focused && (
                        <BadgeWrap>
                          <Badge>{countTable}</Badge>
                        </BadgeWrap>
                      )}
                    </Wrapper>
                  ),
                }}
                listeners={({navigation, route}) => ({
                  tabPress: (e) => {
                    setCountAway(0);
                    if (!checkTimeCheckOut()) {
                      setModalCheckInOut(true);
                    }
                  },
                })}
              />
            )}
            {isTable ? (
              <Tab.Screen
                name={TAKE_AWAY}
                component={Takeaway}
                options={{
                  tabBarLabel: I18n.t('tabBottom.takeAway'),
                  tabBarIcon: ({focused, color}) => (
                    <Wrapper>
                      <MaterialCommunityIcons
                        name="shopping-outline"
                        size={24}
                        color={color}
                      />
                      {countAway > 0 && !focused && (
                        <BadgeWrap>
                          <Badge>{countAway}</Badge>
                        </BadgeWrap>
                      )}
                    </Wrapper>
                  ),
                }}
                listeners={({navigation, route}) => ({
                  tabPress: (e) => {
                    setCountAway(0);
                    if (!checkTimeCheckOut()) {
                      setModalCheckInOut(true);
                    }
                  },
                })}
              />
            ) : (
              <Tab.Screen
                name={HOME}
                component={Home}
                options={{
                  tabBarLabel: I18n.t('tabBottom.home'),
                  tabBarIcon: ({focused, color}) => {
                    return (
                      <MaterialCommunityIcons
                        name="table-large"
                        size={24}
                        color={color}
                      />
                    );
                  },
                }}
                listeners={({navigation, route}) => ({
                  tabPress: (e) => {
                    if (!checkTimeCheckOut()) {
                      setModalCheckInOut(true);
                    }
                  },
                })}
              />
            )}

            {isConfirmOrder !== null && !isConfirmOrder ? (
              <Tab.Screen
                name={REPORT}
                component={Report}
                options={{
                  tabBarLabel: I18n.t('tabBottom.report'),
                  tabBarBadge: 6,
                  tabBarIcon: ({focused, color}) => (
                    <MaterialCommunityIcons
                      name="chart-bar"
                      size={24}
                      color={color}
                    />
                  ),
                }}
                listeners={({navigation, route}) => ({
                  tabPress: (e) => {
                    if (!checkTimeCheckOut()) {
                      setModalCheckInOut(true);
                    }
                  },
                })}
              />
            ) : (
              <Tab.Screen
                name={CONFIRM}
                component={Confirm}
                options={{
                  tabBarLabel: 'XÁC NHẬN',
                  tabBarIcon: ({focused, color}) => (
                    <FontAwesome
                      name="check-square-o"
                      size={24}
                      color={color}
                    />
                  ),
                }}
                listeners={({navigation, route}) => ({
                  tabPress: (e) => {
                    if (!checkTimeCheckOut()) {
                      setModalCheckInOut(true);
                    }
                  },
                })}
              />
            )}
          </Tab.Navigator>
          <ModalCheckInOut
            visible={modalCheckInOut}
            shift={shift}
            onClose={() => setModalCheckInOut(false)}
          />
        </>
      )}
    </>
  );
};

const Wrapper = styled.View``;

const BadgeWrap = styled.View`
  position: absolute;
  top: -6px;
  right: -13px;
  z-index: 20;
`;

export default TabNavigator;
