import React from 'react'
import { View, Text, TouchableOpacity, Dimensions } from 'react-native'
import { styles } from './style'

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { MANAGEFOOD } from '../../../../../navigators/ScreenName'
import { Sizes } from '@dungdang/react-native-basic'
import { colors } from '../../../../../assets'

const ItemList = (props) => {
    const isIcon = () => {
        return (
            <MaterialCommunityIcons name={props.iconName} size={Sizes.s60} color={colors.PRIMARY} />
        )
    }
    return (
        <TouchableOpacity onPress={() => props.onNavigate()} style={styles.container}>
            <Text style={styles.titleitem}>{props.title}</Text>
            { props.isIcon ? isIcon() : null}
        </TouchableOpacity >

    )
}

export default ItemList;