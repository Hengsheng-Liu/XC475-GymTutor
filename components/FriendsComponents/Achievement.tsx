import { Flex, HStack, Heading, VStack } from "native-base";
import DefaultDisplay from "@/components/FriendsComponents/DefaultDisplay";
import React, { useEffect } from "react";
import  getSVG from "@/components/ProfileComponents/AchievementFunction";
interface AchievementProps {
  display: string[];
}

export default function Achievement(
 { display }: AchievementProps
) 
{  
  const renderDisplay = () => {
    return Array.from({ length: 3 }, (_, index) => {
      const name = display[index] || "default"; 
      if (name === "default") {
        return <DefaultDisplay key={index} display = {display}/>;
      } else {
        return (
          <Flex
            key={index}
            width={"1/4"}
            height={"24"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            {getSVG(name,true)}
          </Flex>
        );
      }
    });
  }
  
  
  return (
    <VStack mt={4}>
      <HStack>
        <Heading color="black" mr={3}>Achievements</Heading>
      </HStack>
      <HStack justifyContent={"space-around"} mt={2} alignItems={"center"}>
        {renderDisplay()}
      </HStack>
    </VStack>
  );
}
