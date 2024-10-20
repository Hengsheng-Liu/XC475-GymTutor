import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import {
  View,
  NativeBaseProvider,
  extendTheme,
  Box,
  Flex,
  FlatList,
  Heading,
  Text,
  Pressable,
  Spacer,
  Button,
  HStack,
} from "native-base";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { getUserIcon, IUser } from "@/components/FirebaseUserFunctions";
import { getAllUsers } from "@/components/FirebaseUserFunctions";
import User from "@/components/LeaderComponents/User";
interface UserWithRank extends IUser {
  rank: number;
}
export default function LeaderBoard() {
  const [SortMethod, SetSortMethod] = useState(true);
  const [Users, SetUsers] = useState<IUser[]>([]);
  const [TopThree, SetTopThree] = useState<UserWithRank[]>([]);
  useEffect(() => {
    const fetchUsers = async () => {
      const users = await getAllUsers();
      users.sort((a, b) => {
        if (SortMethod) {
          return (
            b.checkInHistory.reduce(
              (acc, curr) => acc + (curr.likes ? curr.likes.length : 0),
              0
            ) -
            a.checkInHistory.reduce(
              (acc, curr) => acc + (curr.likes ? curr.likes.length : 0),
              0
            )
          );
        } else {
          return b.checkInHistory.length - a.checkInHistory.length;
        }
      });
      SetUsers(users);
      let TopThree = users.slice(0,3) as UserWithRank[];
      TopThree.forEach((user, index) => {
        user.rank = index + 1;
      });
      if (TopThree.length > 2) {
        let tmp = TopThree[1];
        TopThree[1] = TopThree[0];
        TopThree[0] = tmp;
        TopThree[0].rank = 2
        TopThree[1].rank = 1;
        
      }
      if(TopThree.length > 2){
        TopThree[2].rank = 3;
      }
      SetTopThree(TopThree);

    };
  
    fetchUsers();
  }, [SortMethod]);

  return (
    <SafeAreaView style={styles.container}>
      <Box margin={2} mt={3}>
        <Flex flexDirection={"row"} alignItems={"center"} justifyContent={"right"}>
          <Box>
            <Heading> Leaderboard </Heading>
            <Text> Who makes the most check-in</Text>
          </Box>
          <Spacer />
          <MaterialIcons name="sports-gymnastics" size={50} color="#EA580C" />
        </Flex>
        <Box alignItems={"center"} marginTop={"3"} marginBottom={"3"}>
          <Button.Group variant="solid" isAttached space={1}>
            <Button
              background={SortMethod ? "#FF8B3E" : "#FEEADD"}
              _text={{ color: "#161616" }}
              onPress={() => SetSortMethod(true)}
              width={"2/5"}
            >
              Sorted by likes
            </Button>
            <Button
              background={!SortMethod ? "#FF8B3E" : "#FEEADD"}
              _text={{ color: "#161616" }}
              onPress={() => SetSortMethod(false)}
              width={"2/5"}
            >
              Sorted by check-in
            </Button>
          </Button.Group>
        </Box>
        <HStack justifyContent="center" alignItems="center" space={4}>
       {TopThree.map((user, index) => {
          return (
            <User
              User={user}
              rank={user.rank}
              key={user.uid}
              SortMethod={SortMethod}
              MorethanTwo={TopThree.length > 2}
            />
          );
        })}
        </HStack>
        {Users ? (
          <FlatList
            data={Users.slice(3)}
            keyExtractor={(item) => item.uid}
            renderItem={({ item, index }) => {
              return (
                <User
                  User={item}
                  rank={index + TopThree.length + 1}
                  key={item.uid}
                  SortMethod={SortMethod}
                />
              );
            }}
          />
        ) : (
          <Text>Loading...</Text>
        )}
      </Box>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
});
