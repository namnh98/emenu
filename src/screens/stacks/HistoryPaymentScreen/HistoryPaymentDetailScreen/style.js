import { StyleSheet, Dimensions } from 'react-native'
import { colors } from '../../../../assets'
import { Sizes } from '@dungdang/react-native-basic'

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: 'blue'
    },
    bodyContainer: {
        // justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'yellow'
        // paddingVertical: Sizes.h16,
        // top: 10000
    },
    ItemContainer: {
        // justifyContent: 'center',
        // alignItems: 'center',
        // backgroundColor: 'red'
    },
    topbody: {
        alignItems: 'center',
        paddingHorizontal: Sizes.h16,
        paddingVertical: Sizes.h16
    },
    midbody: {
        paddingHorizontal: Sizes.h16,
        paddingVertical: Sizes.h16,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    Maintitle: {
        fontSize: Sizes.h40,
        textAlign: 'left',
        width: Sizes.s200 * 2
    },
    Subtitle: {
        fontSize: Sizes.h28,
        textAlign: 'left',
        // backgroundColor: 'red',
    },
    content: {
        height: Sizes.s100,
        alignItems: 'center',
        flexDirection: 'row',
        // justifyContent: 'space-between'
    },
    title: {
        fontSize: Sizes.h38
    },
    images: {
        resizeMode: 'contain',
        width: Sizes.s100,
        height: Sizes.s100,
        // top: Sizes.s20,
        // right: -Sizes.s60
    },
    title2: {
        fontSize: Sizes.h26,
        textAlign: 'left'
    }
})