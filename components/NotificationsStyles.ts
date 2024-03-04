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
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      alignItems: 'center',
    },
    friendContainer: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 10,
      borderWidth: 1,
      borderRadius: 5,
      marginBottom: 10,
    },
    friendName: {
      fontSize: 18,
      marginLeft: 10,
    },
    friendEmail: {
      marginLeft: 'auto',
      marginRight: 10,
    },
    buttonContainer: {
      flexDirection: 'column',
    },
    button: {
      flex: 1,
      borderRadius: 5,
      padding: 5,
      marginTop: 5,
      width: 80,
    },
    buttonText: {
      textAlign: 'center',
      fontWeight: 'bold',
    },
    acceptButton: {
      backgroundColor: 'green',
    },
    rejectButton: {
      backgroundColor: 'red',
    },
});

