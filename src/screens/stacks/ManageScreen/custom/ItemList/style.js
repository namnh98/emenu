import { StyleSheet, Dimensions } from 'react-native'
import { Sizes } from '@dungdang/react-native-basic'
import { colors } from '../../../../../assets'

const { width, height } = Dimensions.get('window')

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: width * 0.45,
        height: height * 0.2,
        borderRadius: 5,
        elevation: 1,
        backgroundColor: '#fff'

    },
    titleitem: {
        fontSize: Sizes.h40,
        textAlign: 'center',
        textAlignVertical: 'center',
        lineHeight: Sizes.s80,
        color: colors.PRIMARY,
        fontWeight: '500'
    }
})