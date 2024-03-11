import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

export const styles = StyleSheet.create({
    scrollView: {
        height: '100%',
        width: '100%',
    },
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'flex-start',
    },
    gymContainer: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        paddingVertical: 10,
        alignItems: "center",
        justifyContent: "space-between",
    },
    textContainer: {
        flexDirection: 'column',
        alignItems: "flex-start",
        gap: 6,
    },
    gymText: {
        color: "#171717",
        textAlign: "center",
        fontFamily: "Roboto",
        fontSize: 24,
        fontStyle: "normal",
        lineHeight: 28,
        fontWeight: "700"
    },
    changeGymText: {
        color: "#171717",
        textAlign: "center",
        fontFamily: "Roboto",
        fontSize: 16,
        fontStyle: "normal",
        lineHeight: 20,
        fontWeight: "400",
        letterSpacing: 0.25,
        textDecorationLine: 'underline',
    },
    bellIcon: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
    },
    searchIcon: {
        width: 22,
        height: 22,
        resizeMode: 'contain',
    },
    searchBarContainer: {
        flexDirection: 'row', 
        alignItems: 'center',
        paddingHorizontal: 7,
        paddingVertical: 5,
        marginHorizontal: 15,
        marginBottom: 5,
        gap: 10,

        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#0369A1',
        backgroundColor: '#F5F5F5',
        shadowColor: 'black',
        shadowOffset: {
        width: 0,
        height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 2,
    },
    searchBar: {
        flex: 1,
        color: "#A3A3A3",
        fontFamily: "Roboto",
        fontSize: 16,
        fontStyle: "normal",
        lineHeight: 20,
        fontWeight: "400",
        letterSpacing: 0.25,
    }, 
    buttonContainer: {
        flexDirection: 'row', 
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingHorizontal: 7,
        marginHorizontal: 15,
        marginBottom: 5,
        gap: 5,
    },
    filterIcon: {
        width: 25,
        height: 18,
        resizeMode: 'contain',
    },
    profileIcon: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },
    userContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: 360,
        height: 100,
        padding: 10,
        marginVertical: 3,
        marginHorizontal: 15,

        borderRadius: 8,
        backgroundColor: '#FAFAFA',
        shadowColor: 'black',
        shadowOffset: {
        width: 0,
        height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 2,
    },
    nameStyle: {
        color: "#171717",
        fontFamily: "Roboto",
        fontSize: 20,
        fontStyle: "normal",
        lineHeight: 24,
        fontWeight: "700",
        letterSpacing: 0.15,
    },
    userInfoStyle: {
        marginVertical: 1,
        color: "#171717",
        fontFamily: "Roboto",
        fontSize: 16,
        fontStyle: "normal",
        lineHeight: 18,
        fontWeight: "400",
        letterSpacing: 0.15,
    },
    profilePicture: {
        width: 75,
        height: 75,
        borderRadius: 50,
        backgroundColor: 'lightgray',
    },
    activeIcon: {
        width: 22,
        height: 22,
        flexShrink: 0,
        resizeMode: 'contain',
        top: 25, // Adjust as needed to position the icon in the desired corner
        right: 25, // Adjust as needed to position the icon in the desired corner
        zIndex: 1, // Ensure the icon appears above other content
    },
    userInfo: {
        flex: 1,
    },
    userInfoText: {
        marginBottom: 5,
    },
    addFriendButton: {
        backgroundColor: 'lightblue',
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
    },
    addFriendButtonText: {
        fontSize: 20,
        fontWeight: 'bold',
    }

});