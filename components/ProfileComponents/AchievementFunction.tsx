import React, { useEffect, useState } from "react";
import { Svg, SvgUri } from "react-native-svg";
import { getAchievement } from "../FirebaseUserFunctions";

const getSVG = (name: string, achieved: boolean) => {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchAchievementUrl = async () => {
      try {
        let achievementPath;
        if (achieved) {
          achievementPath = `/Achievement/Complete/${name.replace(/\s/g, '')}Colored.svg`;
        } else {
          achievementPath = `/Achievement/Incomplete/${name.replace(/\s/g, '')}Grey.svg`;
        }
        const achievementUrl = await getAchievement(achievementPath);
        setUrl(achievementUrl);
      } catch (error) {
        console.error('Error fetching achievement:', error);
      }
    };

    fetchAchievementUrl();
  }, []);
    return (

        <SvgUri uri={url} width="100%" height="100%" />

    );
  }

export default getSVG;
