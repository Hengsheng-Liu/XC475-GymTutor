import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    userContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        marginVertical: 5,
        backgroundColor: '#eee',
        borderRadius: 5,
        borderBottomWidth: 1,
        borderColor: 'lightgray',
    },
    profilePicture: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'lightgray',
        marginRight: 10,
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
    },
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'flex-start',
    },
});