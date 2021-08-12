import { StyleSheet } from 'react-native'
import { Sizes } from '@dungdang/react-native-basic'

import colors from '../../../../../assets/colors'

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerContanier: {
        // backgroundColor: colors.ORANGE,
        height: Sizes.s160,
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        flexDirection: 'row',
    },
    buttonBack: {
        // backgroundColor: 'blue',
        alignItems: 'center',
        justifyContent: 'center',
        width: Sizes.s100,
        height: Sizes.s100
    },
    headerTitle: {
        color: 'white',
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: Sizes.h20 * 2,
        bottom: Sizes.h20
    }
})