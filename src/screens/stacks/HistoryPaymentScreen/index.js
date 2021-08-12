import React, { useEffect, useState, useRef, createRef, forwardRef } from 'react'
import {
    View, Text,
    TouchableOpacity,
    LayoutAnimation, TextInput,
    Modal, TouchableWithoutFeedback,
    FlatList, Alert, SafeAreaView, ActivityIndicator, Button,
    Dimensions
} from 'react-native'

import { styles } from './style'
import { colors, images } from '../../../assets'

import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import { Sizes } from '@dungdang/react-native-basic'

import Header from '../ManageScreen/custom/Header/index'
import { useNavigation } from '@react-navigation/native';

import BaseUrl from '../../../api/BaseUrl';
import { users, userInfo } from '../../../stores';
import axios from 'axios'
import DatePicker from './custom/DatePicker'
import moment from 'moment'
import { useIsFocused } from '@react-navigation/native'
import { HISTORYPAYMENTDETAIL } from '../../../navigators/ScreenName'
import RBSheet from 'react-native-raw-bottom-sheet'
import _ from 'lodash'

const { width, height } = Dimensions.get('window')
const HistoryPayment = forwardRef((props, ref) => {
    const [isexpand, setisexpand] = useState(false)
    const [billno, setbillno] = useState('')
    const [fullname, setfullname] = useState('')
    const [numbercontact, setnumbercontact] = useState()
    const [datefrom, setdatefrom] = useState('')
    const [dateto, setdateto] = useState('')

    const [isFilter, setisFilter] = useState(false)
    const navigation = useNavigation();
    const [datenow, setdatenow] = useState()
    const focused = useIsFocused();

    const scrollEnd = useRef(null)

    const [data, setdata] = useState([])
    const [data02, setdata02] = useState([])
    const alert = useRef(false)
    const [loading, setloading] = useState(false)
    const [refresh, setrefresh] = useState(false)

    const datefirst = useRef()
    const datelast = useRef()
    const [page, setpage] = useState(1)
    const isEmpty = useRef(false)

    const modalRef = useRef(null)
    const textAlert = useRef('')
    const queryNow = useRef('')

    useEffect(() => {
        getListBill()
    }, [page])

    useEffect(() => {
        getDateDetail()
    }, [])


    const convertDate = (date) => {
        if (!emtyValue(date)) {
            const dateShow = date.slice(0, 10).split('-').reverse().join('/');
            return dateShow;
        } else {
            return '';
        }
    };
    const convertMoney = (money) => {
        return money.toLocaleString('vi', { style: 'currency', currency: 'VND' });

    }
    const getDateDetail = () => {
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        datefirst.current = firstDay
        datelast.current = lastDay
        const date1 = Date.now();
        var today = new Date(date1);
        setdatenow(today)
    }

    const emtyValue = (value) => {
        if (value === undefined || value === null || value.length === 0 || value === {} || value === '') {
            return true;
        } else {
            return false;
        }
    };

    const getListBill = async () => {
        const { token } = await users.getListUser();
        const { partner_id } = await userInfo.getListUser();
        const url = `${BaseUrl.URL_v1_0}/Bill/?language=vi&partner_id=` + partner_id + `&from_date=` + moment(datefirst.current).format("YYYY-MM-DD") + `&to_date` + moment(datenow).format("YYYY-MM-DD") + `&page=` + page
        setloading(true)
        await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((response) => {
            setdata(data.concat(response?.data?.data))
            setdata02(data.concat(response?.data?.data))
            if (data) {
                setloading(false)
                setrefresh(false)
            }

        }).catch((err) => {
            setloading(false)
            Alert.alert('Thông báo', 'Dữ liệu lịch sử hóa đơn đang cập nhật ...',
                [
                    {
                        text: "OK",
                        onPress: () => navigation.goBack(),
                        style: 'cancel'
                    }
                ])
        })
    }

    const renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity style={styles.detailItemlist} key={index} onPress={() => navigation.push(HISTORYPAYMENTDETAIL, {
                bill_id: item.id,
                bill_no: item?.bill_no,
                created_at: item?.created_at,
                tablename: item?.table?.name
            })}>
                <View style={{ alignItems: 'flex-start', flexGrow: 1 }}>
                    <Text style={styles.title}>Số HĐ: {item?.bill_no}</Text>
                    <Text style={styles.title}>Tên KH: {item?.customer_name ? item?.customer_name : 'Trống'}</Text>
                    <Text style={styles.title}>SĐT: {item?.customer_tel ? item?.customer_tel : 'Trống'}</Text>
                </View>
                <View style={{ alignItems: 'flex-end', width: Sizes.s260, paddingHorizontal: Sizes.h10 }}>
                    <View style={[styles.total, { backgroundColor: item?.total_payment ? colors.GREEN : colors.RED }]}>
                        <Text style={styles.texttotal}>{convertMoney(item?.total_payment)}</Text>
                    </View>
                    <Text style={styles.title}>{convertDate(item?.created_at)}</Text>
                    <Text style={styles.title}>{item?.total_payment ?
                        <Text style={{ color: colors.PRIMARY }}>Đã thanh toán</Text>
                        :
                        <Text style={{ color: colors.RED }}>Chưa thanh toán</Text>
                    }</Text>
                </View>
            </TouchableOpacity >
        )
    }

    const separate = () => {
        return (
            <View
                style={{
                    height: Sizes.h10 / 5,
                    width: Sizes.s200,
                    marginTop: 10
                }}
            />
        )
    }

    const footer = () => {
        if (loading === false) return null
        return <View style={{ paddingVertical: Sizes.h16 }}>
            <ActivityIndicator animating size='large' color={colors.ORANGE} />
        </View>
    }


    const handledRefresh = () => {
        setrefresh(true)
        getListBill()
    }

    const loadmore = () => {
        console.log('loading', loading)
        if (loading) return
        setpage(page + 1)
        setloading(true)
        getListBill().then(() => {
            setloading(false)
        }).catch(() => {
            setloading(false)
        })

    }



    const onSearchBillNo = (text) => {
        if (text) {
            const newData = data.filter((item) => {
                const itemData = item?.bill_no ? item?.bill_no : ''
                const textData = text
                return itemData.indexOf(textData) > -1
            })
            // console.log('newData', newData === [])
            if ((newData === []) === false) {
                isEmpty.current === true
            }
            setdata(newData)
            setbillno(text)
        } else {
            Alert.alert('Thông báo', text + 'tìm trong danh sách không có!', [
                {
                    text: 'Tìm lại',
                    onPress: () => modalRef.current.open()
                }
            ])
            setdata(data02)
            setbillno(text)
        }
    }

    const onSearchFullName = (text) => {
        if (text) {
            const newData = data.filter((item) => {
                const itemData = item?.customer_name ? item?.customer_name : ''
                const textData = text
                return itemData.indexOf(textData) > -1
            })
            if ((newData === []) === false) {
                isEmpty.current === true
            }
            setdata(newData)
            setfullname(text)
            if (newData === null || newData === [] || newData === undefined || newData === '') {
                Alert.alert("Thông báo", "Dữ liệu bạn tìm kiếm không có !")
            }
        } else {
            Alert.alert('Thông báo', text + 'tìm trong danh sách không có!', [
                {
                    text: 'Tìm lại',
                    onPress: () => modalRef.current.open()
                }
            ])
            setdata(data02)
            setfullname(text)
        }
    }

    const onSearchNumContact = (text) => {
        if (text) {
            const newData = data.filter((item) => {
                const itemData = item?.customer_tel ? item?.customer_tel : ''
                const textData = text
                return itemData.indexOf(textData) > -1
            })
            if ((newData === []) === false) {
                isEmpty.current === true
            }
            setdata(newData)
            setnumbercontact(text)
            if (newData === null || newData === [] || newData === undefined || newData === '') {
                Alert.alert("Thông báo", "Dữ liệu bạn tìm kiếm không có !")
            }
        } else {
            Alert.alert('Thông báo', text + 'tìm trong danh sách không có!', [
                {
                    text: 'Tìm lại',
                    onPress: () => modalRef.current.open()
                }
            ])
            setdata(data02)
            setnumbercontact(text)
        }
    }

    const onSearchDateFrom = (text_date_from) => {
        if (text_date_from) {
            const textDataFrom = text_date_from
            const today = Date.now()
            const textDataTo = today
            const newData = data.filter((item) => {
                const itemData = item?.created_at ? item?.created_at : ''
                return itemData >= textDataFrom && itemData <= textDataTo
            })
            if ((newData === []) === false) {
                isEmpty.current === true
            }
            setdata(newData)
            setdatefrom(text_date_from)
        } else {
            Alert.alert('Thông báo', 'từ ngày ' + moment().format("DD/MM/YYYY") + ' đến ngày ' + moment(text_date_from).format("DD/MM/YYYY") + 'tìm trong danh sách không có!', [
                {
                    text: 'Tìm lại',
                    onPress: () => modalRef.current.open()
                }
            ])
            setdata(data02)
            setdatefrom(text_date_from)
        }
    }

    const onSearchDateTo = (text_date_to) => {
        if (text_date_to) {
            const today = Date.now()
            const textDataFrom = today
            const textDataTo = text_date_to
            const newData = data.filter((item) => {
                const itemData = item?.created_at ? item?.created_at : ''
                return itemData >= textDataFrom && itemData <= textDataTo
            })
            if ((newData === []) === false) {
                isEmpty.current === true
            }
            setdata(newData)
            setdateto(text_date_to)
        } else {
            Alert.alert('Thông báo', 'từ ngày ' + moment(text_date_to).format("DD/MM/YYYY") + ' đến ngày ' + moment().format("DD/MM/YYYY") + 'tìm trong danh sách không có!', [
                {
                    text: 'Tìm lại',
                    onPress: () => modalRef.current.open()
                }
            ])
            setdata(data02)
            setdateto(text_date_to)
        }
    }

    const onSearchDateFrom_DateTo = (text_date_from, text_date_to) => {
        if (text_date_from && text_date_to) {
            const textDataFrom = text_date_from
            const textDataTo = text_date_to
            const newData = data.filter((item) => {
                const itemData = item?.created_at ? item?.created_at : ''
                return itemData >= textDataFrom && itemData <= textDataTo
            })
            if ((newData === []) === false) {
                isEmpty.current === true
            }
            setdata(newData)
            setdatefrom(text_date_from)
            setdateto(text_date_to)
        } else {
            Alert.alert('Thông báo', 'từ ngày ' + moment(text_date_from).format("DD/MM/YYYY") + ' đến ngày ' + moment(text_date_to).format("DD/MM/YYYY") + 'tìm trong danh sách không có!', [
                {
                    text: 'Tìm lại',
                    onPress: () => modalRef.current.open()
                }
            ])
            setdata(data02)
            setdatefrom(text_date_from)
            setdateto(text_date_to)
        }
    }

    const onSearchAllItem = (text_billno, text_name, text_tel, text_date_from, text_date_to) => {
        if (text_billno && text_name && text_tel && text_date_from && text_date_to) {
            const textDateFrom = text_date_from
            const textDateTo = text_date_to
            const textDataBillNo = text_billno
            const textDataFullname = text_name
            const textDataNumContact = text_tel
            const newData = data.filter((item) => {
                const itemDataBillNo = item?.bill_no ? item?.bill_no : ''
                const _itemDataBillNo = itemDataBillNo.indexOf(textDataBillNo) > -1
                //fullname
                const itemDataFullname = item?.customer_name ? item?.customer_name : ''
                const _itemDataFullname = itemDataFullname.indexOf(textDataFullname) > -1
                //number_contact
                const itemDataNumContact = item?.customer_tel ? item?.customer_tel : ''
                const _itemDataNumContact = itemDataNumContact.indexOf(textDataNumContact) > -1
                //date_from && date_to
                const itemDataCreated = item?.created_at ? item?.created_at : ''
                const _itemDataCreatedFromTo = itemDataCreated >= textDateFrom && itemDataCreated <= textDateTo
                return _itemDataBillNo, _itemDataFullname, _itemDataNumContact, _itemDataCreatedFromTo
            })
            // console.log('1.0')
            if ((newData === []) === false) {
                isEmpty.current === true
            }
            // console.log('1')
            // let a = newData[0]
            setdata(Object.values(newData[0]))
            // console.log('isEmpty', isEmpty.current)
            // console.log('newData', newData[0])
            setbillno(text_billno)
            setfullname(text_name)
            setnumbercontact(text_tel)
            setdatefrom(text_date_from)
            setdateto(text_date_to)
        } else {
            console.log('2')
            Alert.alert('Thông báo', 'từ ngày ' + moment(text_date_from).format("DD/MM/YYYY") + ' đến ngày ' + moment(text_date_to).format("DD/MM/YYYY") + 'tìm trong danh sách không có!', [
                {
                    text: 'Tìm lại',
                    onPress: () => modalRef.current.open()
                }
            ])
            setdata(data02)
            setbillno(text_billno)
            setfullname(text_name)
            setnumbercontact(text_tel)
            setdatefrom(text_date_from)
            setdateto(text_date_to)
        }
    }

    const onSearch = (text_billno, text_name, text_tel, text_date_from, text_date_to) => {
        if ((text_billno && !text_name && !text_tel && !text_date_from && !text_date_to)) {
            Alert.alert('Thông báo', 'Bạn muốn tìm hóa đơn có số hóa đơn ' + text_billno, [
                {
                    text: 'Tìm',
                    onPress: () => onSearchBillNo(text_billno)
                },
                {
                    text: 'Chọn lại',
                    onPress: () => modalRef.current.open()
                }
            ])
        } else if ((!text_billno && text_name && !text_tel && !text_date_from && !text_date_to)) {
            Alert.alert('Thông báo', 'Bạn muốn tìm hóa đơn có tên khách ' + text_name, [
                {
                    text: 'Tìm',
                    onPress: () => onSearchFullName(text_name)
                },
                {
                    text: 'Chọn lại',
                    onPress: () => modalRef.current.open()
                }
            ])
        } else if ((!text_billno && !text_name && text_tel && !text_date_from && !text_date_to)) {
            Alert.alert('Thông báo', 'Bạn muốn tìm hóa đơn có số điện thoại khách ' + text_tel, [
                {
                    text: 'Tìm',
                    onPress: () => onSearchNumContact(text_tel)
                },
                {
                    text: 'Chọn lại',
                    onPress: () => modalRef.current.open()
                }
            ])
        } else if ((!text_billno && !text_name && !text_tel && text_date_from && !text_date_to)) {
            Alert.alert('Thông báo', 'Bạn muốn tìm hóa đơn từ ngày ' + moment(text_date_from).format("DD/MM/YYYY") + ' hôm nay ' + moment().format("DD/MM/YYYY"), [
                {
                    text: 'Tìm',
                    onPress: () => onSearchDateFrom(text_date_from)
                },
                {
                    text: 'Chọn lại',
                    onPress: () => modalRef.current.open()
                }
            ])
        } else if ((!text_billno && !text_name && !text_tel && !text_date_from && text_date_to)) {
            Alert.alert('Thông báo', 'Bạn muốn tìm hóa đơn từ hôm nay ' + moment().format("DD/MM/YYYY") + ' liên quan đến ngày ' + moment(text_date_to).format("DD/MM/YYYY"), [
                {
                    text: 'Tìm',
                    onPress: () => onSearchDateTo(text_date_to)
                },
                {
                    text: 'Chọn lại',
                    onPress: () => modalRef.current.open()
                }
            ])
        } else if ((!text_billno && !text_name && !text_tel && text_date_from && text_date_to)) {
            Alert.alert('Thông báo', 'Bạn muốn tìm hóa đơn từ ngày ' + moment(text_date_from).format("DD/MM/YYYY") + ' đến ngày ' + moment(text_date_to).format("DD/MM/YYYY"), [
                {
                    text: 'Tìm',
                    onPress: () => onSearchDateFrom_DateTo(text_date_from, text_date_to)
                },
                {
                    text: 'Chọn lại',
                    onPress: () => modalRef.current.open()
                }
            ])
        } else if ((text_billno && text_name && text_tel && text_date_from && text_date_to)) {
            Alert.alert('Thông báo', 'Bạn muốn tìm hóa đơn ' + text_billno + ' với tên KH ' + text_name + ' \n và SDT ' + text_tel + ' từ ngày ' + moment(text_date_from).format("DD/MM/YYYY") + ' đến ngày ' + moment(text_date_to).format("DD/MM/YYYY"), [
                {
                    text: 'Tìm',
                    onPress: () => onSearchAllItem(text_billno, text_name, text_tel, text_date_from, text_date_to)
                },
                {
                    text: 'Chọn lại',
                    onPress: () => modalRef.current.open()
                }
            ])
        }

        modalRef.current.close()
    }

    const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
        const paddingToBottom = 20;//còn cách bao xa đến cuối màn hình
        return layoutMeasurement.height + contentOffset.y >=
            contentSize.height - paddingToBottom;
    };

    const isEmptyModal = () => {
        // return(

        // )
    }
    return (
        <View style={styles.container}>
            <Header isBack isTitle title='LỊCH SỬ THANH TOÁN' pressGoBack={() => navigation.goBack()} />
            <View style={styles.bodyContainer}>
                <View style={styles.filterBody}>
                    <Text style={styles.title}>Tháng {moment().format("MM/YYYY")}</Text>
                    <TouchableOpacity style={styles.filterButton} onPress={() => {
                        modalRef.current.open()
                    }}>
                        <AntDesignIcon name='filter' size={Sizes.h32} color={colors.PRIMARY} />
                        <Text style={styles.title1}>Bộ lọc</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.listItemBody}>
                    <FlatList
                        data={data}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => { return index.toString() }}
                        showsVerticalScrollIndicator={false}
                        ItemSeparatorComponent={separate}
                        ListFooterComponent={footer}
                        contentContainerStyle={{
                            paddingBottom: Sizes.s200 + (Sizes.s100 - Sizes.s20)
                        }}
                        refreshing={refresh}
                        onRefresh={handledRefresh}
                        onEndReachedThreshold={.5}
                        onScroll={({ nativeEvent }) => {
                            if (isCloseToBottom(nativeEvent)) {
                                loadmore()
                            }
                        }}
                    />

                </View>
                <RBSheet
                    ref={modalRef}
                    closeOnDragDown={true}
                    closeOnPressMask={false}
                    customStyles={{
                        wrapper: {
                            backgroundColor: "rgba(0,0,0,0.4)"
                        },
                        draggableIcon: {
                            backgroundColor: colors.TEXT_GRAY
                        }
                    }}
                >
                    <TouchableWithoutFeedback onPress={() => modalRef.current.close()}>
                        <View style={styles.modal}>
                            <View style={styles.headermodal}>
                                <TouchableOpacity style={[styles.filterButton2, { backgroundColor: colors.PRIMARY }]} onPress={() => modalRef.current.close()}>
                                    <Text style={styles.title6a}>Thoát</Text>
                                </TouchableOpacity>
                                <Text style={styles.title6}>Bộ lọc</Text>
                                <TouchableOpacity style={styles.filterButton2} onPress={() => {
                                    // modalRef.current.close()
                                    onSearch(billno, fullname, numbercontact, datefrom, dateto)
                                }}>
                                    <Text style={styles.title6a}>Xong</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.lineBorder} />
                            <View style={styles.bodymodal}>
                                <TextInput
                                    placeholder='Số hóa đơn ....'
                                    placeholderTextColor={colors.DARK_GRAY}
                                    style={[styles.input, { borderColor: alert.current ? colors.RED : colors.DARK_GRAY }]}
                                    autoCapitalize='none'
                                    value={billno}
                                    onChangeText={(text) => {
                                        let text1 = text
                                        if (text1.length > 8) {
                                            setbillno(text1.slice(0, 8) + "-" + text1.slice(9, text1.length))
                                        } else {
                                            setbillno(text1)
                                        }
                                        // onSearchBillNo(text1)
                                    }}
                                />
                                <TextInput
                                    placeholder='Họ tên ....'
                                    placeholderTextColor={colors.DARK_GRAY}
                                    autoCapitalize='none'
                                    style={styles.input}
                                    value={fullname}
                                    onChangeText={(text) => {
                                        // onSearchFullName(text)
                                        setfullname(text)
                                    }} />
                                <TextInput
                                    placeholder='Số điện thoại ....'
                                    placeholderTextColor={colors.DARK_GRAY}
                                    autoCapitalize='none'
                                    style={styles.input}
                                    value={numbercontact}
                                    keyboardType='phone-pad'
                                    onChangeText={(text) => {
                                        // onSearchNumContact(text)
                                        setnumbercontact(text)
                                    }} />
                                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                                    <View style={styles.datepicker}>
                                        <Text style={[styles.textdatepicker, { color: datefrom ? colors.BLACK : colors.DARK_GRAY }]}>{datefrom ? moment(datefrom).format("DD/MM/YYYY") : "Từ ngày ..."}</Text>
                                        <View style={{ right: 80, width: Sizes.s200 + Sizes.s160 }}>
                                            <DatePicker
                                                titleBottomSheet='Từ ngày'
                                                onSelect={(res) => {
                                                    let date = new Date();
                                                    date.setDate(res.date);
                                                    date.setMonth(res.month - 1);
                                                    date.setFullYear(res.year);
                                                    setdatefrom(date.toISOString())
                                                }} />
                                        </View>

                                    </View>
                                    <View style={{ width: Sizes.s20 }} />
                                    <View style={styles.datepicker}>
                                        <Text style={[styles.textdatepicker, { color: dateto ? colors.BLACK : colors.DARK_GRAY }]}>{dateto ? moment(dateto).format("DD/MM/YYYY") : "Đến ngày ..."}</Text>
                                        <View style={{ right: 80, width: Sizes.s200 + Sizes.s160 }}>
                                            <DatePicker
                                                titleBottomSheet='Đến ngày'
                                                onSelect={(res) => {
                                                    let date = new Date();
                                                    date.setDate(res.date);
                                                    date.setMonth(res.month - 1);
                                                    date.setFullYear(res.year);
                                                    setdateto(date.toISOString())
                                                }} />
                                        </View>
                                    </View>
                                </View>
                                <View style={{ height: 5 }} />
                                {textAlert.current ? (
                                    <View style={{ height: 15, bottom: 10 }} >
                                        <Text style={{ color: colors.RED, fontSize: Sizes.h24 }}>{textAlert.current}</Text>
                                    </View>
                                ) : null}
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </RBSheet>
            </View>
        </View>
    )
}
)


export default HistoryPayment;