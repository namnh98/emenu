import { Dimensions, StyleSheet } from 'react-native'
import { Sizes } from '@dungdang/react-native-basic'

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    bodyConatiner: {
        paddingVertical: Sizes.h16,
    },
    itembodyContainer: {
        alignItems: 'center',
    },
    itemlist: {
        flexDirection: 'row',
        paddingHorizontal: Sizes.h32
    }
})