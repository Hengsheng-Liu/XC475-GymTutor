import Tags from "../ProfileComponents/Tags";
import { Flex, Badge } from "native-base";
import React, { useState } from "react";

interface props{
    description:string[];

}

export default function Attribute({description }:props) {

  return (
    <>
      <Flex flexDirection="row" wrap="wrap" justifyContent="space-evenly" mt={3}>
        {description.map((tag) => (
          <Badge m = {2} ml={0} colorScheme={"muted"} shadow={1} borderRadius={4}>
              {tag}
          </Badge>
        ))}
      </Flex>
    </>
  );
}