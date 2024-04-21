
import React, { useEffect, useState } from "react";
import { SvgUri } from "react-native-svg";
import { Box } from "native-base";
export const getSVG = (name: string, achieved: boolean) => {
    if (achieved) {
      return (
        <Box
          width="100%"
          height="100%"
          borderRadius={10}
          overflow="hidden"
        >
        <SvgUri
          width="100%"
          height="100%"
          uri={`/assets/images/achievements/Complete/${name.replace(/\s/g, '')}Colored.svg`}
        />
        </Box>
      );
    } else {
      return (
        <Box
          width="100%"
          height="100%"
          borderRadius={10}
          overflow="hidden"
        >
        <SvgUri
          width="100%"
          height="100%"
          uri={`/assets/images/achievements/Uncomplete/${name.replace(/\s/g, '')}Grey.svg`}
        />
        </Box>
      );
    }
  };