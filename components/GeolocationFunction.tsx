import * as Location from "expo-location";
import { Geometry } from "react-native-google-places-autocomplete";
import { useState } from "react";
import firebase from "firebase/app";
import { GeoPoint } from "firebase/firestore";
import { useAuth } from "@/Context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "@/firebaseConfig";
import { Gym } from "@/components/FirebaseUserFunctions";
import pointInPolygon from "point-in-polygon";
import { router } from "expo-router";
import { CalendarUtils } from "react-native-calendars";
/*
import Geolocation from '@react-native-community/geolocation';
const  locationConfig = {skipPermissionRequests:true,authorizationLevel:"whenInUse"}
Geolocation.setRNConfiguration(locationConfig);
*/
export const GetUserLocation = async (): Promise<number[] | undefined> => {
  try {
    const location = await Location.getCurrentPositionAsync({});
    return [location.coords.latitude, location.coords.longitude];
  } catch (error) {
    console.log("Error fetching location:", error);
  }
};
export const nominatimGymSearch = async (Gymlocation: Geometry) => {
  const Vertexs: GeoPoint[] = [];
  try {
    let url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${Gymlocation.location.lat}&lon=${Gymlocation.location.lng}`;
    let response = await fetch(url);
    const Gymdata = await response.json();
    const place_id = Gymdata.place_id;
    url = `https://nominatim.openstreetmap.org/details.php?place_id=${place_id}&format=json&polygon_geojson=1`;
    response = await fetch(url);
    const GymBouding = await response.json();
    const Coordinates = GymBouding.geometry.coordinates.flat(Infinity);
    for (let i = 0; i < Coordinates.length; i += 2) {
      let newVertext = new GeoPoint(Coordinates[i + 1], Coordinates[i]);
      Vertexs.push(newVertext);
    }
    return Vertexs;
  } catch (error) {
    console.error("Error fetching nearby gyms:", error);
  }
};
export const fetchGym = async (userGym:[string, string]): Promise<number[][]> => {
  const bound: number[][] = [];
  if (userGym) {
    try {
      const gymDocRef = doc(firestore, "Gyms", userGym[0]);
      const userGym2 = (await getDoc(gymDocRef)).data() as Gym;

      userGym2.bounding.forEach((point) => {
        bound.push([point.latitude, point.longitude]);
      });
    } catch (error) {
      console.log("Error fetching user:", error);
    }
  }
  return bound;
};
export const checkUser = (checkInHistory:string[]) => {
  const Day = new Date();

  const Today = CalendarUtils.getCalendarDateString(Day);
    const History = checkInHistory;
    if (History && History.includes(Today)) {
      return true;
    }
  return false;
};
export const handleCheckIn = async (userGym:[string, string] | undefined, checkInHistory:string[]) => {
  try {
    
    const location = await GetUserLocation();
    const checkIn = checkUser(checkInHistory);
    const GymBound = await fetchGym(userGym? userGym : ["", ""]);
    if (checkIn) {
      alert("You have already checked in today");
      return;
    } else {
      if (location) {
        if (pointInPolygon(location, GymBound)) {
          router.replace("/CheckIn");
        } else {
          alert(
            "You are not at the gym location, please check in at the gym location"
          );
        }
      } else {
        alert("Please enable location services to check in");
      }
    }
  } catch (error) {
    console.error("Error checking in: ", error);
  }
};
