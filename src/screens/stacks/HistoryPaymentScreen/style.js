import { StyleSheet, Dimensions } from 'react-native';

import { Sizes } from '@dungdang/react-native-basic'
import { colors } from '../../../assets'

const { width, height } = Dimensions.get('window')

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bodyContainer: {
        width: width,
        height: height * 0.1,
    },
    filterBody: {
        flexDirection: 'row',
        backgroundColor: colors.GRAY,
        width: width,
        height: height * 0.1 / 2,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Sizes.h16,
        borderBottomWidth: 0.5,
        borderBottomColor: colors.DARK_GRAY
    },
    filterContent: {
        backgroundColor: 'yellow',
        height: 500,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: Sizes.h28,
        padding: Sizes.s10
    },
    title1: {
        fontSize: Sizes.h28,
        color: colors.PRIMARY
    },
    title2: {
        fontSize: Sizes.h28,
        color: colors.WHITE
    },
    title3: {
        fontSize: Sizes.h28,
        // borderWidth: 0.5,
        // borderRadius: 10,
        // width: Sizes.s200 - Sizes.s20,
        // height: Sizes.s80 - Sizes.s20,
        textAlign: 'center',
        paddingVertical: Sizes.h10,
        left: Sizes.h65 - Sizes.h10 / 2,
        right: 0
    },
    title3a: {
        fontSize: Sizes.h28,
        textAlign: 'center',
        paddingVertical: Sizes.h10,
        left: Sizes.h65 - Sizes.h10 / 2,
        right: 0,
        color: '#b5b5b5'
    },
    title4: {
        fontSize: Sizes.h28,
        fontWeight: '500',
        color: colors.RED
    },
    title5: {
        fontSize: Sizes.h32,
    },
    title6: {
        fontSize: Sizes.h40,
        color: colors.ORANGE
    },
    title6a: {
        fontSize: Sizes.h36,
        color: colors.WHITE
    },
    filterButton: {
        flexDirection: 'row',
        backgroundColor: colors.DARK_WHITE,
        width: width * 0.2,
        height: height * 0.1 / 3,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 0.3,
        borderColor: colors.GRAY
    },
    filterButton1: {
        backgroundColor: colors.PRIMARY,
        width: width * 0.2,
        height: height * 0.1 / 3,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 0.3
    },
    filterButton2: {
        backgroundColor: colors.ORANGE,
        width: width * 0.2,
        height: height * 0.1 / 3,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        borderRadius: 20
    },
    input: {
        fontSize: Sizes.h26,
        width: width * 0.95,
        height: Sizes.s80 - Sizes.s10,
        borderWidth: 0.3,
        borderRadius: 10,
        borderColor: colors.DARK_GRAY,
        paddingHorizontal: Sizes.s10
    },
    input1: {
        fontSize: Sizes.h26,
        // backgroundColor: colors.WHITE,
        width: Sizes.s200 - Sizes.s20,
        height: Sizes.s80 - Sizes.s20,
        textAlign: 'center',
        borderWidth: 0.3,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    input2: {
        width: Sizes.s200,
        height: Sizes.s80 - Sizes.s20,
        borderRadius: 5,
        justifyContent: 'space-around',
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 0.3,
    },
    listItemBody: {
        backgroundColor: colors.GRAY,
        width: width,
        height: height,
        alignItems: 'center',
        paddingVertical: Sizes.h16,
        // flex: 1
    },
    detailItemlist: {
        backgroundColor: colors.DARK_WHITE,
        width: width * 0.9,
        height: height * 0.13,
        alignItems: 'center',
        paddingHorizontal: Sizes.h16,
        paddingVertical: Sizes.h16,
        borderRadius: 10,
        flexDirection: 'row',
        flex: 1,
    },
    backgroundModal: {
        backgroundColor: 'rgba(0,0,0,0.4)'

    },
    itemContain: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    itemContain1: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    itemContain2: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    itemContain3: {
        flexDirection: 'row',
        alignItems: 'center',
        // justifyContent: 'space-between'
    },
    datepicker: {
        width: Sizes.s160 * 2.4,
        height: Sizes.s100 - Sizes.s20,
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        borderWidth: 0.3,
        borderRadius: 10,
        borderColor: colors.DARK_GRAY,
    },
    textdatepicker: {
        textAlign: 'left',
        paddingHorizontal: Sizes.s10,
        color: colors.DARK_GRAY,
    },
    modalBox: {

    },
    texttotal: {
        color: colors.WHITE,
        fontSize: Sizes.h28,
    },
    total: {
        width: Sizes.s200,
        height: Sizes.s50,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        flex: 1
    },
    headermodal: {
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingHorizontal: Sizes.h16
    },
    lineBorder: {
        borderBottomColor: colors.GRAY,
        borderBottomWidth: 0.6,
        padding: Sizes.h10 / 2,
        width: width * 0.95,
        left: Sizes.s30 / 2
    },
    bodymodal: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: Sizes.h16,
        justifyContent: 'space-between'
    }
})