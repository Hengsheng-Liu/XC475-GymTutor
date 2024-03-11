import { getUser, IUser } from '@/components/FirebaseDataService'; 

export default async function fetchUsers(currUser: IUser, requests: string[]): Promise<IUser[]> {
    const fetchedUsers: IUser[] = [];
    
    try {
        // Iterate over each friend UID
        for (const userUID of requests) {
            // Fetch user data for the current friend UID
            const userData = await getUser(userUID);
            if (userData !== null) {
              fetchedUsers.push(userData);
          }
        }
        return fetchedUsers;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    } 
  };
