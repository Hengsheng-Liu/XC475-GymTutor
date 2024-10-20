import React, { useEffect, useState } from "react";
import {
  Avatar,
  Flex,
  HStack,
  VStack,
  Text,
  Center,
  Box,
  Heading,
} from "native-base";
import { getUserIcon, IUser } from "../FirebaseUserFunctions";

interface UserProps {
  User: IUser;
  rank: number;
  SortMethod: boolean;
  MorethanTwo?: boolean;
}

export default function LeaderBoard({ User, rank, SortMethod,MorethanTwo }: UserProps) {
  const [profilePic, setProfilePic] = useState<string>();
  const [quantity, setQuantity] = useState<number>(0);
  const [description, setDescription] = useState<string>("Likes");

  useEffect(() => {
    const fetchIcon = async () => {
      const url = await getUserIcon(User.icon);
      setProfilePic(url);
    };
    fetchIcon();
    SortMethod
      ? setQuantity(
          User.checkInHistory.reduce(
            (acc, curr) => acc + (curr.likes ? curr.likes.length : 0),
            0
          )
        )
      : setQuantity(User.checkInHistory.length);
    setDescription(SortMethod ? "Likes" : "Check-ins");
  }, [SortMethod]);

  if (rank <= 3) {
    return (
          <VStack alignItems="center" flex={1} marginBottom={rank == 1 && MorethanTwo ? "16":"0" }
          borderColor={rank == 1 ? "#F76808" : "transparent"} borderWidth={rank == 1 ? "1px" : "0px"} borderRadius={rank == 1 ? "md" : "0px"}
          paddingTop={rank == 1 ? "2" : "0"} paddingBottom={rank == 1 ? "2" : "0"}
          >
            <Heading fontSize="lg" mb={"2"}>{rank}</Heading>
            <Avatar source={{ uri: profilePic }} size="lg" />
            <Center>
              <Heading fontSize="lg" ml={"2.5"}>
                {User.name}
              </Heading>
            </Center>
            <Text>
              {quantity} {description}
            </Text>
          </VStack>
    );
  }
  return (
    <HStack
      justifyContent={"space-between"}
      background={rank % 2 === 1 ? "#00000007" : "#ffffff"}
      padding={"1"}
    >
      <HStack>
        <Center>
          <Heading fontSize="md" mr={"2.5"}>
            {rank}
          </Heading>
        </Center>
        <Avatar source={{ uri: profilePic }} />
        <Center>
          <Heading fontSize="lg" ml={"2.5"}>
            {User.name}
          </Heading>
        </Center>
      </HStack>
      <Flex justifyContent={"center"}>
        <Text>
          {quantity} {description}
        </Text>
      </Flex>
    </HStack>
  );
}
