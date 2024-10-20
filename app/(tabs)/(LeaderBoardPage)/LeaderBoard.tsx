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
} from "native-base";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { getUserIcon, IUser } from "@/components/FirebaseUserFunctions";
import { getAllUsers } from "@/components/FirebaseUserFunctions";
import User from "@/components/LeaderComponents/User";
export default function LeaderBoard() {
  const [SortMethod, SetSortMethod] = useState(true);
  const [Users, SetUsers] = useState<IUser[]>([]);

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
        <Box alignItems={"center"} marginTop={"3"} borderWidth={1} marginBottom={"3"}>
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
        {Users.length > 0 ? (
          <FlatList
            data={Users}
            keyExtractor={(item) => item.uid}
            renderItem={({ item, index }) => {
              return (
                <User
                  User={item}
                  rank={index + 1}
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
