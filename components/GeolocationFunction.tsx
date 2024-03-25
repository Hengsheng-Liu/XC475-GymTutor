import * as Location from "expo-location";
import { Geometry } from "react-native-google-places-autocomplete";
import { useState } from "react";
import firebase from "firebase/app";
import { GeoPoint } from "firebase/firestore";
import { Firestore } from "firebase/firestore";
export const GetUserLocation = async (): Promise<number[] | undefined> => {
  try {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      return;
    }
    const location = await Location.getCurrentPositionAsync({});
    return [location.coords.latitude, location.coords.longitude];
  } catch (error) {
    console.log("Error fetching location:", error);
  }
};
export const nominatimGymSearch = async (Gymlocation: Geometry) => {
    const Vertexs:GeoPoint[] = [];
  try {
    let url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${Gymlocation.location.lat}&lon=${Gymlocation.location.lng}`;
    let response = await fetch(url);
    const Gymdata = await response.json();
    const place_id = Gymdata.place_id;
    url = `https://nominatim.openstreetmap.org/details.php?place_id=${place_id}&format=json&polygon_geojson=1`;
    response = await fetch(url);
    const GymBouding = await response.json();
    const Coordinates = GymBouding.geometry.coordinates.flat(Infinity);
    for (let i = 0; i < Coordinates.length; i+=2) {
        let newVertext = new GeoPoint(Coordinates[i+1], Coordinates[i]);
        Vertexs.push(newVertext);
    }; 
    return Vertexs;
  } catch (error) {
    console.error("Error fetching nearby gyms:", error);
  }
};
