import React, { Component, useRef } from 'react'
import {
    Text, View, Dimensions, ScrollView,
    TouchableOpacity, FlatList, SafeAreaView, Modal,
    TextInput, Alert
} from 'react-native'
import { styles } from './style'
import Ionicon from 'react-native-vector-icons/Ionicons'

import Header from '../custom/Header/index'
import { Sizes } from '@dungdang/react-native-basic'
import { colors } from '../../../../assets'
import ItemFood from '../custom/ItemFood/index'

import data from './data'
import newdata from './data2'

const { width, height } = Dimensions.get('window')

const data1 = [
    {
        id: 1,
        title: 'title 1',
        type: 'type 1'
    },
    {
        id: 2,
        title: 'title 1',
        type: 'type 1'
    },
    {
        id: 3,
        title: 'title 1',
        type: 'type 1'
    },
    {
        id: 4,
        title: 'title 1',
        type: 'type 1'
    },
    {
        id: 5,
        title: 'title 1',
        type: 'type 1'
    },
    {
        id: 6,
        title: 'title 1',
        type: 'type 1'
    },
]

export default class MANAGEFOOD extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            openIndex: '',
            refresh: false,
            visible: false,
            type: 0,
            foodname: '',
            followPrice: false,
            tax: false,
            status: false,
            bar: false,
            category: false,
            unit: false
        }
    }

    renderItem = ({ item, index }) => {
        return (
            <ItemFood
                index={index}
                onOpen={() => {
                    this.setState({ openIndex: index })
                }}
                Maintitle={item.title}
                MainPrice={item.price}
                MainStatus={item.status}
                MainKind={item.kind}
                MainTax={item.tax}
                onPressItemDetail={() => alert('Nhấn rồi')} />
        )
    }
    showPicker = () => {
        if (!this.state.category)
            return alert('Nhấn rồi cate')
        else
            return alert('nhấn rồi unit')
    }
    handleRefresh = () => {
        alert('123456')
    }
    onPressFix = () => {
        alert('Chức năng sửa đang cập nhật !')
    }
    onPressAdd = () => {
        this.setState({ visible: !this.state.visible })
    }
    checkChooseTypeFood = () => {
        this.setState({ type: 1 })
    }
    checkChooseTypeDrink = () => {
        this.setState({ type: 2 })
    }
    checkChooseTypeOther = () => {
        this.setState({ type: 3 })
    }
    checkFollowPrice = () => {
        this.setState({ followPrice: !this.state.followPrice })
    }
    checkTax = () => {
        this.setState({ tax: !this.state.tax })
    }
    checkStatus = () => {
        this.setState({ status: !this.state.status })
    }
    checkBar = () => {
        this.setState({ bar: !this.state.bar })
    }
    render() {
        console.log('visible', this.state.visible)
        return (
            <View style={{ flex: 1 }}>
                <View>
                    <Header isBack isTitle title='QUẢN LÝ MÓN ĂN' pressGoBack={() => this.props.navigation.goBack()} />
                </View>
                <View>
                    <FlatList
                        style={styles.listItem}
                        data={data}
                        renderItem={this.renderItem}
                        keyExtractor={({ item, index }) => String(index)}
                        contentContainerStyle={{ flexGrow: 1 }}
                        onScroll={() => this.setState({ openedIndex: '' })}
                        showsVerticalScrollIndicator={false}
                        onRefresh={() => this.handleRefresh()}
                        refreshing={this.state.refresh}
                        onEndReached={this.state.isLoadMore && this.handleLoadMoreNoti}
                        onEndReachedThreshold={Platform.OS === 'ios' ? 0 : 0.2}
                        // ListFooterComponent={this.renderFooter}
                        extraData={this.state}
                    />
                </View>
                <View>
                    <TouchableOpacity style={styles.buttoncontainer} onPress={() => { this.onPressAdd() }}>
                        <Ionicon name='ios-add-outline' color={colors.WHITE} size={Sizes.s100} />
                    </TouchableOpacity>
                </View>



            </View >
        )
    }

}


