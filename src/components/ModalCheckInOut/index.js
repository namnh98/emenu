import React, {useState, useEffect} from 'react';
import {colors, images} from '../../assets';
import styled from 'styled-components/native';
import Modal from 'react-native-modal';
import TextComponent from '../TextComponent';
import moment from 'moment';
import {ButtonComponent, ModalEnterTimeCheckOut} from '../../components';
import {useDispatch} from 'react-redux';
import {StaffApi} from '../../api';
import {useNavigation} from '@react-navigation/native';
import {TAB_WITH_CHECK_IN} from '../../navigators/ScreenName';
import {shiftsAction} from '../../redux/actions';
import {Dimensions} from 'react-native'

export default function ModalCheckInOut({visible, shift, onClose}) {
  const {
    isOverNight,
    start_time,
    end_time,
    check_in,
    staffId,
    id,
    check_in_out_at,
  } = shift || {};
  const [time, setTime] = useState('');
  const [timeCheckOut, setTimeCheckOut] = useState('');
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [checkOutLater, setCheckOutLater] = useState(false);
  useEffect(() => {
    let setIntTime = setInterval(() => {
      setTime(moment().format('HH:mm:ss'));
    }, 1000);
    return () => clearInterval(setIntTime);
  }, []);
  const onCheckOut = async () => {
    let data = {
      user_id: staffId || '',
      shift_id: id || null,
      check_in_out_at: moment(check_in_out_at).format('DD - MM - YYYY') || '',
      check_in: check_in,
      check_out: moment().format('HH:mm'),
      description: '',
    };
    const res = await StaffApi.CheckIn(data);
    if (res) {
      dispatch(shiftsAction.reset());
      onClose()
      navigation.reset({
        index: 0,
        routes: [{name: TAB_WITH_CHECK_IN}],
      });
    } else {
      console.log('Check out loi');
    }
  };
  const onCheckOutLater = () => setCheckOutLater(true);
  const onCloseCheckOutLater = () => {
    setTimeCheckOut('');
    setCheckOutLater(false);
  };
  const onChangeTimeCheckOut = (text) => {
    setTimeCheckOut(text);
  };
  const onConfirmCheckOutLater = () =>{
    let newTimeCheckOut = moment(
      moment().add(parseInt(timeCheckOut), 'minutes'),
    ).format('HH:mm');
    console.log(newTimeCheckOut);
    let newShift = {...shift, end_time: newTimeCheckOut};
    dispatch(shiftsAction.setShift(newShift))
    setCheckOutLater(false);
    onClose()
  }
  return (
    <Modal
      statusBarTranslucent
      animationIn="zoomInDown"
      animationOut="zoomOutDown"
      animationOutTiming={500}
      useNativeDriver={true}
      hideModalContentWhileAnimating
      isVisible={visible}>
      <ModalContainer>
        <Wrapper>
          <Header>
            <Logo source={images.OMENU_ORANGE_2} />
            <TextComponent
              heavy
              color={colors.ORANGE}
              style={{fontSize: 28, marginTop: 10}}>
              {time}
            </TextComponent>
          </Header>

          <Image source={images.CHECK_OUT} />

          <TitleModal>Đã đến giờ check-out</TitleModal>
          <TextComponent center mTop={10}>
            Ca làm cần check-out: {start_time || ''}{' '}
            {isOverNight ? '(Hôm qua)' : ''} - {end_time || ''}
          </TextComponent>
          <CheckInOutBtn title="Xác nhận check-out" onPress={onCheckOut} />
          <CheckOutLaterButton onPress={onCheckOutLater} />
        </Wrapper>
        <ModalEnterTimeCheckOut
          visible={checkOutLater}
          onClose={onCloseCheckOutLater}
          onChangeTime={onChangeTimeCheckOut}
          onConfirm={onConfirmCheckOutLater}
        />
      </ModalContainer>
    </Modal>
  );
}
const {height, width} = Dimensions.get('window')
const ModalContainer = styled.View`
  justify-content: center;
  padding: 10px;
  background-color: ${colors.WHITE};
  height: 90%;
  width: 90%;
  align-self: center;
  border-radius: 10px;
`;

const Wrapper = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
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
  top: 1px;
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
  bottom: 20px;
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
  bottom: 20px;
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
  margin-top: 20px;
  justify-content: center;
`;

const TitleBtn = styled.Text`
  color: ${colors.WHITE};
  font-size: 15px;
`;

const TitleModal = styled.Text`
  color: ${colors.DARK_PRIMARY};
  text-align: center;
  font-size: 17px;
  margin-top: 10px;
`;
