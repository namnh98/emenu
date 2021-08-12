import React, { useEffect, useRef, useState } from 'react'
import { View, Text, Alert, Dimensions, Image, FlatList, ActivityIndicator } from 'react-native'

import { styles } from './style'
import HeaderCustom from '../../ManageScreen/custom/Header/index'
import { useNavigation } from '@react-navigation/native';

import axios from 'axios'
import BaseUrl from '../../../../api/BaseUrl';
import { users, userInfo } from '../../../../stores';
import { useIsFocused } from '@react-navigation/native'

import moment from 'moment'
import { images } from '../../../../assets'
import { Sizes } from '@dungdang/react-native-basic';

const { width, height } = Dimensions.get('window')

const HistoryPaymentDetail = ({ navigation, route }) => {
    const {
        bill_id,
        bill_no,
        created_at,
        tablename
    } = route.params;
    const [data, setdata] = useState([])
    const [data2, setdata2] = useState([])
    const [loading, setloading] = useState(false)
    const [loading2, setloading2] = useState(false)
    const focused = useIsFocused();
    const cashier = useRef('')

    useEffect(() => {
        getBillDetail()
        getHistory()
    }, [focused])

    const getBillDetail = async () => {
        const { token } = await users.getListUser();
        // console.log('token', token)
        const baseurl = BaseUrl.URL_v1_0
        const url = `${BaseUrl.URL_v1_0}/Bill/${bill_id}?language=vi`
        await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                if (res?.data?.data?.bill_items.length > 0)
                    setdata(res?.data?.data?.bill_items)
            }).catch((err) => {
                console.log('err', err)
            })
    }

    const getHistory = async () => {
        const { token } = await users.getListUser();
        const user = await users.getListUser();
        cashier.current = user.username
        const baseurl = BaseUrl.URL_v1_0
        const url2 = `${BaseUrl.URL_v1_0}/Bill/History?language=vi&user_id=${user.user_id}`
        setloading2(true)
        await axios.get(url2, {
            headers: {
                Authorization: `Bearer ` + token,
            },
        }).then((res) => {
            if (res?.data?.data.length > 0) {
                setloading2(false)
                setdata2(res?.data?.data)
            }
        }).catch((err) => {
            setloading2(false)
            console.log('err', err)
        })
    }

    const sliceName = (text) => {
        let a = text.search(/-/)
        return text.slice(0, a)
    }

    const slice2Name = (text) => {
        let a = text.search(/-/)
        return text.slice(a + 1, text.length)
    }

    const convertMoney = (money) => {
        return money.toLocaleString('vi', { style: 'currency', currency: 'VND' });
    }
    return (
        <View style={styles.container}>
            <HeaderCustom isTitle title='Chi tiết hóa đơn' isBack pressGoBack={() => navigation.goBack()} />
            {data === undefined && data2 === undefined ? (
                <Text>Dữ liệu đang cập nhật</Text>
            ) : (
                <View style={styles.bodyContainer}>
                    <View style={styles.topbody}>
                        {data2.map((item, index) => {
                            if (item?.bill_no === bill_no)
                                return (
                                    <>
                                        <View key={index} style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                            <Image source={images.OMENU_ORANGE} style={styles.images} />
                                            <View style={[styles.topbody, { alignItems: 'flex-start' }]}>
                                                <Text style={styles.Maintitle}>{sliceName(item?.partner.name)}</Text>
                                                <Text style={styles.Subtitle}>Tel: {item?.partner.tel}</Text>
                                                <Text style={styles.title2}>{slice2Name(item?.partner.name)}</Text>
                                            </View>
                                        </View>
                                        <Text style={styles.title}>HÓA ĐƠN TÍNH TIỀN</Text>
                                        <View style={styles.content}>
                                            <View style={{ alignItems: 'flex-start' }}>
                                                {tablename === item?.table.name ? (<Text>Bàn: {item?.table.name}</Text>) : (<Text>Trống</Text>)}
                                                <Text>Thu ngân: {cashier.current}</Text>
                                            </View>
                                            <View style={{ width: Sizes.s10 }} />
                                            <View style={{ alignItems: 'flex-end' }}>
                                                <Text>Số hóa đơn: {bill_no === item?.bill_no ? item?.bill_no : 'Trống'}</Text>
                                                <Text>Ngày: {item?.created_at === created_at ? moment(item?.created_at).format("DD/MM/YYYY HH:MM ") : 'Trống'}</Text>
                                            </View>
                                        </View>
                                    </>
                                )
                        })}

                    </View>
                    <View style={{ borderWidth: 0.5, borderStyle: 'dotted', width: width * 0.9 }} />
                    <View style={styles.midbody}>
                        <Text style={{ right: 75 }}>Tên món</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                            <Text style={{ left: 20 }}>Đơn giá</Text>
                            <Text style={{ left: 55 }}>SL</Text>
                            <Text style={{ left: 75 }}>Thành tiền</Text>
                        </View>
                    </View>
                    <View style={{ borderWidth: 0.3, width: width * 0.9, }} />
                    {data.map((item, index) => {
                        return (
                            <View key={index} style={styles.midbody}>
                                <Text style={{ left: -60 }}>{item?.item_name}</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ left: -5 }}>{convertMoney(item?.amount)}</Text>
                                    <Text style={{ left: 22 }}>{item?.qty}</Text>
                                    <Text style={{ left: 55 }}>{convertMoney(item?.amount * item?.qty)}</Text>
                                </View>
                            </View>
                        )
                    })}
                    <View style={{ borderWidth: 0.3, width: width * 0.9, }} />
                    {data2.map((item) => {
                        if (item.bill_no === bill_no)
                            return (
                                <>
                                    <View style={styles.midbody}>
                                        <Text style={{ right: 122 }}>TỔNG</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                                            <Text style={{ left: 118 }}>{convertMoney(item?.total_money_drink + item?.total_money_food + item?.vat_value)}</Text>
                                        </View>
                                    </View>
                                    <View style={{ borderWidth: 0.5, borderStyle: 'dotted', width: width * 0.9 }} />
                                    <View style={styles.midbody}>
                                        <Text style={{ right: 125 }}>THUẾ</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                                            <Text style={{ left: 123 }}>{convertMoney(item?.vat_value)}</Text>
                                        </View>
                                    </View>
                                    <View style={{ borderWidth: 0.5, borderStyle: 'dotted', width: width * 0.9 }} />
                                    <View style={styles.midbody}>
                                        <Text style={{ right: 98 }}>THÀNH TIỀN</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                                            <Text style={{ left: 95 }}>{convertMoney(item?.total_payment)}</Text>
                                        </View>
                                    </View>
                                </>
                            )
                    })}

                </View>
            )}

        </View>
    )
}

export default HistoryPaymentDetail