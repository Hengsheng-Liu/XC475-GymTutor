import Tags from "../ProfileComponents/Tags";
import { Flex } from "native-base";
import React, { useState } from "react";

interface props{
    description:string[];

}

export default function Attribute({description }:props) {
  const [addTag, setAddTag] = useState("");

  return (
    <>
      <Flex flexDirection="row" wrap="wrap" justifyContent="space-evenly" mt={3}>
        {description.map((str, index) => (
          <Tags key={index} title={str} />
        ))}
      </Flex>
    </>
  );
}