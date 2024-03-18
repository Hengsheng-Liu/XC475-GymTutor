import React, { useState, useEffect } from 'react';
import { router } from "expo-router";
import { NativeBaseProvider, Input, IconButton, Row, Flex } from 'native-base';
import { Image, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome, Ionicons,FontAwesome5 } from '@expo/vector-icons';
import { useAuth } from "@/Context/AuthContext";

import { IUser, getUsers, getCurrUser, updateUsers, removeFieldFromUsers} from '@/components/FirebaseUserFunctions';
import UserPreview from "../../../../components/HomeComponents/UserContainer";
import Header from '../../../../components/HomeComponents/Header';
import theme from '@/components/theme';
import updateUser from '@/components/storage';


export default function HomeScreen() {
    const [gym, setGym] = useState<string>(''); // State to store the gym input
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [users, setUsers] = useState<IUser[]>([]); // State to store users
    const [loading, setLoading] = useState<boolean>(false); // State to track loading state
    const {User} = useAuth();
    if (!User) return;

    useEffect(() => {
        // Fetch gym name for current user
        const fetchGym = async () => {
            const user = await getCurrUser(User.uid);
            const userGym = user?.gym|| "Default Gym"; // Use default name if user has no gym
            setGym(userGym);
            handleGetUsers();
        }

        fetchGym();
    }, [User]);

    // TODO: Display user preview when clicked
    const handlePreviewClick = (user: IUser) => {
        // Do something when user is clicked
        // Open Profile
    };

    // Get users from database from gym
    const handleGetUsers = async () => {
        // await updateUser(currUser.uid);
        // updateUsers(); // Uncomment when we want to use it to add fields
        setUsers([]);
        setLoading(true);
        const fetchedUsers = await getUsers(User.uid, gym);
        setUsers(fetchedUsers);
        setLoading(false);
    };

    // Search users by name
    const handleSearchUsers = async () => {
        setUsers([]);
        setLoading(true);
        let fetchedUsers: IUser[];
        if (searchTerm==""){
            fetchedUsers = await getUsers(User.uid);
        } else {
            // fetchedUsers = await getUsers(currUser.uid);
            fetchedUsers = await getUsers(User.uid);
            console.log(fetchedUsers);
        }
        setUsers(fetchedUsers);
        setLoading(false);
    };
    
    return (
        <NativeBaseProvider theme = {theme}>
            <SafeAreaView style= {{backgroundColor: "#FFF", flex:1, padding:15, paddingTop:2}}>
            <ScrollView>
                <Header currUser={User} GymName={gym}/>
                <Input
                    InputLeftElement={
                        <IconButton size="xs" onPress={handleSearchUsers}
                        icon={<FontAwesome name="search" size={24} color="#075985" />}/>
                        }
                    placeholder="Spot someone in this gym"
                    bgColor="trueGray.100" 
                    onChangeText={setSearchTerm}
                    borderRadius="md" borderWidth={1} 
                    />
                <Row mb={1}>  
                    <IconButton size="xs" onPress={handleGetUsers}
                        icon={<Ionicons name="filter" size={24} color="#075985" />}/>
                    <IconButton size="xs" onPress={() => router.push("/Friends")}
                        icon={<FontAwesome5 name="user-friends" size={24} color="#075985" />}/>
                </Row>           
                    {users.map((user) => (
                        < UserPreview friend={user} key={user.uid}/>
                    ))}
                    {loading && <ActivityIndicator size="large" color="#0000ff" />}
            </ScrollView>
            </SafeAreaView>
        </NativeBaseProvider>

        
    )
}
