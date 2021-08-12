import React, {useState, useEffect, useRef} from 'react';
import {colors, images} from '../../../assets';
import styled from 'styled-components/native';
import {useSelector, useDispatch} from 'react-redux';
import moment from 'moment';
import {
  ButtonComponent,
  TextComponent,
  ModalCheckInOut,
  ModalEnterTimeCheckOut,
} from '../../../components';
import {useIsFocused} from '@react-navigation/native';
import {PartnerApi, StaffApi, LoginApi} from '../../../api';
import {userInfo, users} from '../../../stores';
import {
  BOTTOM_TAB,
  TAB_WITH_CHECK_IN,
  SELECT_USER,
} from '../../../navigators/ScreenName';
import jwt_decode from 'jwt-decode'; //decode token để show role của user
import {shiftsAction, partnerAction} from '../../../redux/actions';
import {AlertModal} from '../../../common';
import {Dimensions} from 'react-native';

export default function CheckInOutScreen({navigation}) {
  const [time, setTime] = useState(moment().format('HH:mm:ss'));
  const [isChecking, setIsChecking] = useState(true);
  const isFocused = useIsFocused();
  const staffIdRef = useRef(null);
  const listShiftPrevDay = useRef([]);
  const listShiftToday = useRef([]);
  const shiftCheckedInWithoutId = useRef(null);
  const shiftOfPrevDay = useRef(null);
  const dispatch = useDispatch();
  const listHaventCheckedOutYet = useRef([]);
  const closestShirt = useRef(null);
  const [detailShift, setDetailShift] = useState(null); // lưu chi tiết ca làm để hiển thị lên pop up
  const [isHaveToCheckIn, setIsHaveToCheckIn] = useState(false); // Kiểm tra xem staff có cần check in hay không
  const [checkingIn, setCheckingIn] = useState(false); // loading checking-in
  const diffTime = useRef(0); // khoảng miliseconds từ hiện tại đến lúc cần check out
  const [isCheckOut, setIsCheckOut] = useState(false); // flag kiểmt tra xem action trong hàm là check in hay check out
  const isCheckedOut = useRef(false);
  const timeOutRef = useRef(); // Ref lưu hàm setTimeOut
  const [needToFindClosShift, setNeedToFindClosShift] = useState(true);
  const titleModalCheckInOut = useRef('');
  const titleBtn = useRef('');
  const [modalCheckInOut, setModalCheckInOut] = useState(false);
  const [checkOutLater, setCheckOutLater] = useState(false);
  const [timeCheckOutLater, setTimeCheckOutLater] = useState('');
  const [moveToTab, setMoveToTab] = useState(false);

  useEffect(() => {
    let setIntTime = setInterval(() => {
      setTime(moment().format('HH:mm:ss'));
    }, 1000);
    return () => clearInterval(setIntTime);
  }, []);
  useEffect(() => {
    checkPartnerSetting();
  }, [isFocused]);

  const checkPartnerSetting = async () => {
    try {
      const user = await userInfo.getListUser();
      staffIdRef.current = user.id;
      const res = await PartnerApi.getPartnerSetting();
      if (res.is_checkin_out) {
        getShifts();
      } else {
        navigation.navigate(BOTTOM_TAB);
        return 0;
      }
    } catch (error) {
      console.log('Err@ GetPartnerSetting', error);
    }
  };
  const getShifts = async () => {
    dispatch(shiftsAction.reset());
    try {
      const {token} = await users.getListUser();
      let decode = jwt_decode(token);
      const {role} = decode;
      if (role.includes('master') || !role.includes('role_18')) {
       return navigation.navigate(BOTTOM_TAB);
      }
      let date = moment().format('DD - MM - YYYY');
      let prevDate = moment().subtract(1, 'days').format('DD-MM-YYYY');
      let res = await StaffApi.gitShifts(staffIdRef.current, prevDate, date);
      listShiftPrevDay.current = res[0].shifts;
      listShiftToday.current = res[1].shifts;
      let getShiftPrevDay = await StaffApi.getListShiftStatus(
        staffIdRef.current,
        prevDate,
        50,
      );
      let getShiftCurrentDay = await StaffApi.getListShiftStatus(
        staffIdRef.current,
        date,
        50,
      );

      listShiftPrevDay.current = listShiftPrevDay.current.map((item) => {
        let itemFound = getShiftPrevDay.find(
          (_item) => _item.shift_id === item.id,
        );
        if (itemFound)
          return {
            ...item,
            check_in: itemFound.check_in,
            check_out: itemFound.check_out,
            check_in_out_at: itemFound.check_in_out_at,
          };
        else return item;
      });
      listShiftToday.current = listShiftToday.current.map((item) => {
        let itemFound = getShiftCurrentDay.find(
          (_item) => _item.shift_id === item.id,
        );
        if (itemFound)
          return {
            ...item,
            check_in: itemFound.check_in,
            check_out: itemFound.check_out,
            check_in_out_at: itemFound.check_in_out_at,
          };
        else return item;
      });
      shiftCheckedInWithoutId.current = findShiftClosestCheckedIn(
        getShiftCurrentDay,
      );

      checkShiftPrev(listShiftPrevDay.current);
    } catch (error) {
      console.log('Err@CallGetShift', error);
    }
  };

  const checkShiftPrev = async (data) => {
    shiftOfPrevDay.current = null;
    if (data.length != 0) {
      for (const item of data) {
        let _item = item;
        const checked = await StaffApi.CheckInStatus(
          staffIdRef.current,
          item.id,
          moment(new Date()).subtract(1, 'days').format('DD - MM - YYYY'), // Thêm subtract
        );
        let splitEndItem = item.end_time.split(':');
        let splitStartItem = item.start_time.split(':');
        let isOverNight =
          convertToMinutes(splitEndItem) <= convertToMinutes(splitStartItem);
        let totalMinOfEndTime = convertToMinutes(splitEndItem);
        let currentTime = new Date();
        let timeNow = currentTime.getHours() * 60 + currentTime.getMinutes();

        if (isOverNight && totalMinOfEndTime > timeNow) {
          shiftOfPrevDay.current = {
            ...item,
            isCheckedIn: checked.status,
            isOverNight: false,
          };
        } else if (
          (item.check_out === null || item.check_out === '') &&
          !listHaventCheckedOutYet.current.find(
            (__item) => __item.id === item.id,
          )
        ) {
          listHaventCheckedOutYet.current.push(_item);
        }
      }
    }
    return checkShiftToday(listShiftToday.current);
  };
  const onCheckOutLater = () => {
    setCheckOutLater(true);
    return;
  };
  const checkShiftToday = async (data) => {
    closestShirt.current = null;
    if (shiftOfPrevDay.current) {
      closestShirt.current = shiftOfPrevDay.current;
      setNeedToFindClosShift(false);
    }
    if (
      data.length === 0 &&
      !closestShirt.current &&
      !listHaventCheckedOutYet.current.length &&
      !shiftCheckedInWithoutId.current
    ) {
      titleModalCheckInOut.current = AlertModal.CONTENT[55];
      // setIsAbleToUseApp(false);

      setDetailShift(null);
      setIsHaveToCheckIn(true);
      titleBtn.current = 'Tôi muốn check-in';
      setIsCheckOut(false);
      // setModalCheckInOut(true);
    } else {
      if (!closestShirt.current) {
        closestShirt.current = {
          end_time: '23:59',
          id: '',
          isOverNight: false,
        };
      }
      for (const item of data) {
        const checked = await StaffApi.CheckInStatus(
          staffIdRef.current,
          item.id,
          moment(new Date()).format('DD - MM - YYYY'),
        );
        let splitEndItem = item.end_time.split(':');
        let splitStartItem = item.start_time.split(':');
        let isOverNight =
          convertToMinutes(splitEndItem) <= convertToMinutes(splitStartItem);
        let totalMinOfEndTime =
          convertToMinutes(splitEndItem) + (isOverNight ? 24 * 60 : 0);
        let splitClosest = closestShirt.current.end_time?.split(':');
        let totalMinOfClosest =
          convertToMinutes(splitClosest) +
          (closestShirt.current.isOverNight ? +24 * 6 : 0);
        let currentTime = new Date();
        let timeNow = currentTime.getHours() * 60 + currentTime.getMinutes();

        if (
          needToFindClosShift &&
          ((isOverNight &&
            closestShirt.current.isOverNight &&
            totalMinOfEndTime <= totalMinOfClosest &&
            checked.status != 4) ||
            (isOverNight &&
              !closestShirt.current.isOverNight &&
              ((totalMinOfEndTime >= totalMinOfClosest &&
                closestShirt.current.id === '') ||
                (totalMinOfEndTime <= totalMinOfClosest &&
                  closestShirt.current.id != '')) &&
              checked.status != 4) ||
            (!isOverNight &&
              totalMinOfEndTime > timeNow &&
              totalMinOfEndTime <= totalMinOfClosest &&
              checked.status != 4))
        ) {
          closestShirt.current = {
            ...item,
            isCheckedIn: checked.status,
            isOverNight: isOverNight,
          };
        }
        if (
          (item.check_out === '' || item.check_out === null) &&
          !listHaventCheckedOutYet.current.find((_item) => _item.id === item.id)
        ) {
          listHaventCheckedOutYet.current.push(item);
        }
      }
      if (
        (closestShirt.current === null || closestShirt.current?.id === '') && //Hiện tại không có ca nào và ca trước đã checkout
        listHaventCheckedOutYet.current.length === 0 &&
        !shiftCheckedInWithoutId.current
      ) {
        titleModalCheckInOut.current = AlertModal.CONTENT[55];
        setDetailShift(null);
        setIsHaveToCheckIn(true);
        titleBtn.current = 'Tôi muốn check-in';
        setIsCheckOut(false);
      } else if (
        (closestShirt.current === null || closestShirt.current?.id === '') && // iện tại không có ca nào và ca trước chưa checkout thì cho check out ca trước
        listHaventCheckedOutYet.current.length > 0
      ) {
        titleModalCheckInOut.current = `Bạn chưa check-out ca làm trước`;
        setDetailShift(null);
        titleBtn.current = 'Check-out tất cả';
        setIsHaveToCheckIn(true);
        setIsCheckOut(true);
      } else if (
        closestShirt.current.isCheckedIn === 3 //Ca hiện tại chưa check in và check out
      ) {
        console.log('checknow');
        titleModalCheckInOut.current = AlertModal.CONTENT[56];
        titleBtn.current = 'Xác nhận check-in';
        setIsHaveToCheckIn(true);
        setIsCheckOut(false);
        let extraInfo = closestShirt.current.isOverNight ? '(Ngày mai)' : '';
        setDetailShift(
          `Ca làm cần check-in: ${closestShirt.current?.start_time || ""} - ${closestShirt.current?.end_time || ""}  ${extraInfo}`,
        );
      } else if (
        closestShirt.current?.isCheckedIn === 1 ||
        shiftCheckedInWithoutId.current // ca hiện tại đã check in hoặc có check in ca ko id phía trước
      ) {
        console.log('use', closestShirt.current);
        dispatch(
          shiftsAction.setShift(
            closestShirt.current?.id === ''
              ? {
                  ...shiftCheckedInWithoutId.current,
                  staffId: staffIdRef.current,
                  id: '',
                }
              : {...closestShirt.current, staffId: staffIdRef.current},
          ),
        );
        if (closestShirt.current?.id === '') {
          closestShirt.current = {
            ...shiftCheckedInWithoutId.current,
            id: '',
          };
        }
        setIsHaveToCheckIn(false);
        return navigation.navigate(BOTTOM_TAB);
      }
    }
    setIsChecking(false);
  };
  const _onLogout = async () => {
    await LoginApi.LogOut()
     users.removeUser();
     userInfo.removeUser();
    await LoginApi.LogOut()
    dispatch(partnerAction.reset());
    dispatch(shiftsAction.reset())
    setModalCheckInOut(false);
    navigation.reset({
      index: 0,
      routes: [{name: SELECT_USER}],
    });
  };
  const onCloseCheckOutLater = () => setCheckOutLater(false);
  const onChangeTimeCheckOutLater = (text) => setTimeCheckOutLater(text);
  const onConfirmCheckOutLater = () => {
    setCheckOutLater(false);
    setModalCheckInOut(false);
    if (parseInt(timeCheckOutLater) <= 0) return;
    if (timeOutRef.current) {
      clearTimeout(timeOutRef.current);
    }
    timeOutRef.current = setTimeout(() => {
      if (isCheckedOut.current) {
        return;
      } else {
        titleModalCheckInOut.current = 'Đã đến giờ check-out';
        let extraInfo = closestShirt.current.isOverNight ? '(Hôm qua)' : '';
        setDetailShift(
          `Ca làm cần check-out: ${closestShirt.current.start_time} ${extraInfo} - ${closestShirt.current.end_time}`,
        );
        titleBtn.current = 'Xác nhận check-out';
        setIsHaveToCheckIn(true);
        setIsCheckOut(true);
        setModalCheckInOut(true);
      }
    }, parseInt(timeCheckOutLater) * 60 * 1000);
  };

  const onModalCheckInPress = async () => {
    if (!isHaveToCheckIn) {
      return;
    } else {
      if (!isCheckOut) {
        try {
          let data = {
            user_id: staffIdRef.current,
            shift_id: closestShirt.current?.id || '',
            check_in_out_at: moment(
              closestShirt.current?.check_in_out_at || new Date(),
            ).format('DD - MM - YYYY'),
            check_in: moment().format('HH:mm'),
            check_out: '',
            description: '',
          };
          setCheckingIn(true);
          const res = await StaffApi.CheckIn(data);
          if (res) {
            isCheckedOut.current = false;
            if (shiftCheckedInWithoutId.current) {
              let dataNoId = {
                user_id: staffIdRef.current,
                shift_id: '',
                check_in_out_at: moment(
                  shiftCheckedInWithoutId.current.check_in_out_at,
                ).format('DD - MM - YYYY'),
                check_in: shiftCheckedInWithoutId.current.check_in,
                check_out: moment().format('HH:mm'),
                description: '',
              };
              await StaffApi.CheckIn(dataNoId);
            }
            if (listHaventCheckedOutYet.current.length > 0) {
              for (item of listHaventCheckedOutYet.current) {
                let _data = {
                  user_id: staffIdRef.current,
                  shift_id: item.id,
                  check_in_out_at: moment(item.check_in_out_at).format(
                    'DD - MM - YYYY',
                  ),
                  check_in: item.check_in,
                  check_out: moment().format('HH:mm'),
                  description: '',
                };
                const _res = await StaffApi.CheckIn(_data);
              }
              listHaventCheckedOutYet.current = [];
            }
            titleModalCheckInOut.current = 'Thành công';
            setCheckingIn(false);
            return navigation.navigate(BOTTOM_TAB);
          }
        } catch (error) {
          console.log('Err@CheckInPress', error);
        }
      } else {
        try {
          if (closestShirt.current != null && closestShirt.current.id != '') {
            let data = {
              user_id: staffIdRef.current,
              shift_id: closestShirt.current.id,
              check_in_out_at: moment(
                closestShirt.current.check_in_out_at,
              ).format('DD - MM - YYYY'),
              check_in: closestShirt.current.check_in,
              check_out: moment().format('HH:mm'),
              description: '',
            };
            const res = await StaffApi.CheckIn(data);
            if (res) {
              dispatch(shiftsAction.reset());
            } else {
              console.log('Check out loi');
            }
          } else if (listHaventCheckedOutYet.current.length > 0) {
            for (item of listHaventCheckedOutYet.current) {
              let data = {
                user_id: staffIdRef.current,
                shift_id: item.id,
                check_in_out_at: moment(item.check_in_out_at).format(
                  'DD - MM - YYYY',
                ),
                check_in: item.check_in,
                check_out: moment(new Date()).format('HH:mm'),
                description: '',
              };
              const _res = await StaffApi.CheckIn(data);
              if (_res) {
                console.log('Check out all thanh cong');
              } else {
                console.log('Check out all that bai');
              }
            }
            listHaventCheckedOutYet.current = [];
          }
          isCheckedOut.current = true;
          setIsCheckOut(false);
          setModalCheckInOut(false);
          return navigation.replace(TAB_WITH_CHECK_IN);
        } catch (error) {
          console.log('Err@CheckOutPress', error);
        }
      }
    }
  };

  const findShiftClosestCheckedIn = (data) => {
    let itemFound = {check_in: '00:00', shift_id: ''};
    for (item of data) {
      let splitClo = itemFound.check_in.split(':');
      let splitItem = item.check_in.split(':');
      if (convertToMinutes(splitItem) > convertToMinutes(splitClo)) {
        itemFound = item;
      }
    }
    if (
      itemFound.shift_id === null &&
      (itemFound.check_out === null || itemFound.check_out === '') &&
      itemFound.check_in != null
    ) {
      return itemFound;
    } else return null;
  };
  const convertToMinutes = (arr) => {
    return parseInt(arr[0]) * 60 + parseInt(arr[1]);
  };
  return (
    <ModalContainer>
      <Wrapper>
        <Header isTop={!isChecking}>
          <Logo source={images.LOGO_STAFF_EMPTY} />
          <TextComponent
            heavy
            color={colors.ORANGE}
            style={{fontSize: 28, marginTop: 10}}>
            {time}
          </TextComponent>
          {isChecking && (
            <TextComponent center>Đang kiểm tra các ca làm việc</TextComponent>
          )}
        </Header>
        {isChecking ? null : (
          <>
            <Image source={isCheckOut ? images.CHECK_OUT : images.CHECK_IN} />

            <TitleModal>{titleModalCheckInOut.current}</TitleModal>
            {detailShift && (
              <TextComponent center mTop={10}>
                {detailShift}
              </TextComponent>
            )}
            <CheckInOutBtn
              title={` ${titleBtn.current}`}
              onPress={onModalCheckInPress}
            />

            {!isCheckOut ? <LogOutButton onPress={_onLogout} /> : null}
          </>
        )}
        <ModalCheckInOut
          visible={modalCheckInOut}
          onPress={onModalCheckInPress}
          title={titleModalCheckInOut.current}
          detail={detailShift}
          isCheckOut={isCheckOut}
          checking={checkingIn}
          titleBtn={titleBtn.current}
          onLogOut={_onLogout}
          onCheckOutLater={onCheckOutLater}>
          <ModalEnterTimeCheckOut
            visible={checkOutLater}
            time={timeCheckOutLater}
            onClose={onCloseCheckOutLater}
            onChangeTime={onChangeTimeCheckOutLater}
            onConfirm={onConfirmCheckOutLater}
          />
        </ModalCheckInOut>
      </Wrapper>
    </ModalContainer>
  );
}
const {height, width} = Dimensions.get('window');
const ModalContainer = styled.View`
  flex: 1;
`;

const Wrapper = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const Image = styled.Image`
  height: ${height / 8};
  width: ${height / 8};
`;
const Logo = styled.Image`
  height: ${height / 12};
  width: ${height / 12};
`;
const Header = styled.View`
  justify-content: center;
  align-items: center;
  position: absolute;
  top: ${(props) => (props.isTop ? 70 : 0.45 * height)};
`;
export const LogOutButton = styled(ButtonComponent).attrs(() => ({
  title: 'Đăng xuất',
  iconName: 'logout',
  titleColor: colors.ORANGE,
  iconColor: colors.ORANGE,
}))`
  border: 1px solid ${colors.ORANGE};
  border-radius: 5px;
  flex-direction: row;
  align-items: center;
  padding-vertical: 5px;
  width: 50%;
  margin-top: 20px;
  justify-content: center;
  position: absolute;
  bottom: 25px;
`;

export const CheckOutLaterButton = styled(ButtonComponent).attrs(() => ({
  title: 'Check-out sau',
  iconName: 'clock',
  titleColor: colors.ORANGE,
  iconColor: colors.ORANGE,
  rowItem: true,
}))`
  border: 1px solid ${colors.ORANGE};
  border-radius: 5px;
  flex-direction: row;
  align-items: center;
  padding-vertical: 5px;
  width: 50%;
  margin-top: 20px;
  justify-content: center;
  position: absolute;
  bottom: 25px;
`;

export const CheckInOutBtn = styled(ButtonComponent).attrs((props) => ({
  title: props.title,
  titleColor: colors.WHITE,
  iconColor: colors.WHITE,
}))`
  border: 1px solid ${colors.DARK_PRIMARY};
  border-radius: 5px;
  flex-direction: row;
  align-items: center;
  padding-vertical: 8px;
  background-color: ${colors.DARK_PRIMARY};
  width: 50%;
  margin-top: 10px;
  justify-content: center;
`;



const TitleModal = styled.Text`
  color: ${colors.DARK_PRIMARY};
  text-align: center;
  font-size: 17px;
  margin-top: 10px;
`;
