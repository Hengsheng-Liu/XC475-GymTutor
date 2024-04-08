
import React, { useEffect, useState } from "react";
import { SvgUri } from "react-native-svg";
export const getSVG = (name: string, achieved: boolean) => {
    if (achieved) {
      return (
        <SvgUri
          width="100%"
          height="100%"
          uri={`/assets/images/achievements/Complete/${name}.svg`}
        />
      );
    } else {
      return (
        <SvgUri
          width="100%"
          height="100%"
          uri={`/assets/images/achievements/Uncomplete/${name}.svg`}
        />
      );
    }
  };