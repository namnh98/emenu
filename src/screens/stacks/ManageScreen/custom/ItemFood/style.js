import { StyleSheet, Dimensions } from 'react-native';
import { Sizes } from '@dungdang/react-native-basic'
import { colors } from '../../../../../assets'

const { width, height } = Dimensions.get('window')
const deleteWidth = width * 0.2

export const styles = StyleSheet.create({
    container: {
        width: width,
        backgroundColor: colors.WHITE,//colors.orange1,
        flexDirection: 'row',
        paddingHorizontal: Sizes.h32,
        paddingVertical: Sizes.h16,
        alignItems: 'center',
        justifyContent: 'flex-start',
        overflow: 'hidden',
        paddingTop: Sizes.h32
    },
    buttonFix: {
        width: deleteWidth,
        backgroundColor: colors.PRIMARY,
        justifyContent: 'center',
        alignItems: 'center'
    },
    titleFix: {
        color: colors.WHITE,
        letterSpacing: 0.5,
        fontSize: Sizes.h32,
        fontWeight: '500',
        lineHeight: Sizes.h50
    },
    buttonDelete: {
        width: deleteWidth,
        backgroundColor: colors.RED,
        justifyContent: 'center',
        alignItems: 'center'
    },
    titleDelete: {
        color: colors.WHITE,
        letterSpacing: 0.5,
        fontSize: Sizes.h32,
        fontWeight: '500',
        lineHeight: Sizes.h50
    },
    title: {
        color: colors.BLACK,
        fontSize: Sizes.h30,
        fontWeight: 'bold',
        lineHeight: Sizes.h52,
    },
    title2: {
        color: colors.DARK_GRAY,
        fontSize: Sizes.h30,
        lineHeight: Sizes.h52,
    },
    imageItem: {
        // resizeMode: 'contain',
        width: width * 0.25,
        height: width * 0.25,
    },
    contentItem: {
        paddingLeft: Sizes.h16,
        overflow: 'hidden'
    },
    icon: {
        // backgroundColor: 'red',
        left: width * 0.2
    },
    status: {
        // backgroundColor: colors.PRIMARY,
        width: Sizes.s100 - Sizes.s20,
        height: Sizes.s60 - Sizes.s10,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    statustext: {
        color: colors.WHITE
    }
})