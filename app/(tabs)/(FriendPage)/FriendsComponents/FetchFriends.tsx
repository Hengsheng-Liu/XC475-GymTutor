import { getUser, IUser } from '@/components/FirebaseDataService'; 

export default async function fetchFriends(currUser: IUser): Promise<IUser[]> {
    const fetchedFriends: IUser[] = [];
    
    try {
        // Iterate over each friend UID
        for (const friendUID of currUser.friends) {
            // Fetch user data for the current friend UID
            const friendData = await getUser(friendUID);
            if (friendData !== null) {
              fetchedFriends.push(friendData);
          }
        }
        return fetchedFriends;
    } catch (error) {
        console.error('Error fetching friends:', error);
        throw error;
    } 
  };
