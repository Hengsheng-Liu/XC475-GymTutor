
import React, { useEffect, useState } from "react";
import { SvgUri } from "react-native-svg";
import { Box } from "native-base";
export const getSVG = (name: string, achieved: boolean) => {
    if (achieved) {
      return (
        <SvgUri
          width="100%"
          height="100%"
          uri={`/assets/images/achievements/Complete/${name.replace(/\s/g, '')}Colored.svg`}
        />
      );
    } else {
      return (
        <SvgUri
          width="100%"
          height="100%"
          uri={`/assets/images/achievements/Uncomplete/${name.replace(/\s/g, '')}Grey.svg`}
        />
      );
    }
  };