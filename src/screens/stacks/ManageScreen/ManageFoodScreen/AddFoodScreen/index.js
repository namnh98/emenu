import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { colors } from '../../../../../assets'
import { Sizes } from '@dungdang/react-native-basic'

import { styles } from './style'

export default class AddFood extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>AddFood Screen</Text>
            </View>
        )
    }
}