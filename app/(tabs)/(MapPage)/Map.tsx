import { Text, View,StyleSheet } from 'react-native'
import React, { Component } from 'react'
import Mapbox from '@rnmapbox/maps';
import { useState,useEffect } from 'react';
import * as Location from 'expo-location';
Mapbox.setAccessToken("sk.eyJ1IjoiNTI0ODc2NDY2IiwiYSI6ImNsc3doZzh4eDBkaWwybGxhN2l1dXVicTUifQ.WRqz-s1fU1St1FQAuQsmDA")

export default function Map()  {
  const [location, setLocation] = useState<Location>();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
      console.log(location);
    })();
  }, []);

    return (
        <View style={styles.container}>
      <Mapbox.MapView style={styles.map}>
        <Mapbox.UserLocation
          onUpdate={(newLocation:Mapbox.Location) => setLocation(newLocation)}
        />
        <Mapbox.Camera followUserLocation followZoomLevel={20} />
      </Mapbox.MapView>
        </View>
    )
  }

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
      flex: 1,
    }
  });