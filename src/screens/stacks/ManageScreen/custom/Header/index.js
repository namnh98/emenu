import React from 'react'
import { Text, View, StatusBar, TouchableOpacity, ImageBackground, Dimensions } from 'react-native'

import { images } from '../../../../../assets/images/index';
import { styles } from './style'
import { Sizes } from '@dungdang/react-native-basic'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const { width, height } = Dimensions.get('window')

const Header = (props) => {
    const isBack = () => {
        return (
            <TouchableOpacity style={styles.buttonBack} onPress={() => props.pressGoBack()}>
                <MaterialCommunityIcons name='arrow-left' size={Sizes.s50} color='white' />
            </TouchableOpacity>
        )
    }
    const isTitle = () => {
        return (
            <Text style={styles.headerTitle}>{props.title}</Text>
        )
    }
    return (
        // <View style={styles.headerContanier}>
        //     <StatusBar barStyle={props.barstyle ? 'dark-content' : 'light-content'} />
        //     {props.isBack ? isBack() : null}
        //     {props.isTitle ? isTitle() : null}
        //     <View style={{ width: Sizes.s100 }} />
        // </View>
        <ImageBackground source={require('../../../../../assets/images/bg-header.png')} style={{ width: width, height: height * 0.1 }} >
            <View style={styles.headerContanier}>
                <StatusBar barStyle={props.barstyle ? 'dark-content' : 'light-content'} />
                {props.isBack ? isBack() : null}
                {props.isTitle ? isTitle() : null}
                <View style={{ width: Sizes.s100 }} />
            </View>
        </ImageBackground>
    )
}

export default Header;