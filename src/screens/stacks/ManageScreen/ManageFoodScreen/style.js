import { StyleSheet, Dimensions } from 'react-native'
import { Sizes } from '@dungdang/react-native-basic'
import { colors } from '../../../../assets'

const { width, height } = Dimensions.get('window')

export const styles = StyleSheet.create({
    otheritemlist: {
        justifyContent: 'space-around',
        flexDirection: 'row'
    },
    buttonarea: {
        top: height * 0.2,
        alignItems: 'flex-end',
        paddingHorizontal: Sizes.h40
    },
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
    },
    bodycontainer: {
        width: width,
        height: height,
        // justifyContent: 'center',
        // alignItems: "center",
    },
    modalView: {
        height: height,
        width: width,
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    buttoncontainer: {
        position: 'absolute',
        bottom: height * 0.15,
        left: width * 0.75,
        justifyContent: 'center',
        alignItems: 'center',
        height: Sizes.s140,
        width: Sizes.s140,
        backgroundColor: colors.ORANGE,
        borderRadius: Sizes.s80,
        // marginTop: Sizes.s200 * 3,
        // marginLeft: Sizes.s200 * 2.8
    },
    contentmodal: {
        backgroundColor: '#fff',
        width: width * 0.9,
        height: height * 0.6,
        paddingHorizontal: Sizes.h16,
        paddingVertical: Sizes.h16,
        borderRadius: 10
        // justifyContent: 'center',
        // alignItems: 'center'
    },
    titleContentModal: {
        height: Sizes.s100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleModal: {
        fontSize: Sizes.h48,
        fontWeight: '600'
    },
    listItem: {
        height: height,
    },
    requireText: {
        color: 'red',
    },
    titleTypeModal: {
        fontSize: Sizes.h38
    },
    checkboxType: {
        backgroundColor: colors.ORANGE,
        width: Sizes.s40,
        height: Sizes.s40,
        borderRadius: Sizes.s50,
        borderWidth: 2,
        borderColor: colors.RED
    },
    checkboxType2: {
        backgroundColor: colors.ORANGE,
        width: Sizes.s40,
        height: Sizes.s40,
        borderWidth: 2,
        borderColor: colors.RED
    },
    titlecheckboxType: {
        fontWeight: '400',
        fontSize: Sizes.h28,
    },
    titleTypeModal2: {
        fontSize: Sizes.h32,
        color: colors.WHITE,
        fontWeight: '500'
    },
    titleTypeModal3: {
        fontSize: Sizes.h32,
        textAlign: 'center',
        borderRadius: 10,
        borderWidth: 1,
        width: Sizes.s100 + Sizes.s20,
        height: Sizes.s40 + Sizes.s10 / 2,
    },
    buttonRandom: {
        backgroundColor: colors.ORANGE,
        width: Sizes.s200,
        height: Sizes.s80,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    inputfoodname: {
        color: '#000',
        fontSize: Sizes.h32,
        borderWidth: 1,
        width: Sizes.s260 + Sizes.s140,
        height: Sizes.s80,
        textAlign: 'center',
        paddingHorizontal: Sizes.h16,
        borderRadius: 10
    },
    buttonBack: {
        backgroundColor: colors.DARK_GRAY,
        width: Sizes.s200,
        height: Sizes.s60,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    buttonAdd: {
        backgroundColor: colors.ORANGE,
        width: Sizes.s200,
        height: Sizes.s60,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    lineItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        paddingHorizontal: Sizes.h10,
        paddingVertical: Sizes.h10
    },
    checkboxStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    showPicker: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 1,
        width: width * 0.5,
        height: height * 0.045
    },
    titlePicker: {
        fontSize: Sizes.h32
    }
})