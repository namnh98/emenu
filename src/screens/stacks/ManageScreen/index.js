import React, { Component } from 'react'
import { Text, View, Dimensions, ScrollView, TouchableOpacity } from 'react-native'
import { styles } from './style'
import { Sizes } from '@dungdang/react-native-basic'
import Header from './custom/Header/index'
import ItemList from './custom/ItemList/index'
import { MANAGEFOOD } from '../../../navigators/ScreenName'

const { width, height } = Dimensions.get('window')


export default class MANAGE extends Component {
    render() {
        const { navigation } = this.props
        return (
            <View style={{ flex: 1 }}>
                <Header isBack isTitle title='QUẢN LÝ' pressGoBack={() => this.props.navigation.goBack()} />
                <ScrollView style={styles.bodyConatiner} contentContainerStyle={styles.itembodyContainer}>
                    <View style={styles.itemlist}>
                        <ItemList
                            title='Quản lý món ăn'
                            onNavigate={() => navigation.navigate(MANAGEFOOD)}
                            isIcon
                            iconName='food-fork-drink'
                        />
                        <View style={{ width: Sizes.h16 }} />
                        {false ? <ItemList /> : <View style={{
                            width: width * 0.45,
                            height: height * 0.2,
                        }} />}
                    </View>
                </ScrollView>
            </View>
        )
    }
}
