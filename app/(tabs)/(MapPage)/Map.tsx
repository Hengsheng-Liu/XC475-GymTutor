import { Text, View,StyleSheet } from 'react-native'
import React, { Component } from 'react'
import Mapbox from '@rnmapbox/maps';
import { useState } from 'react';

Mapbox.setAccessToken("sk.eyJ1IjoiNTI0ODc2NDY2IiwiYSI6ImNsc3doZzh4eDBkaWwybGxhN2l1dXVicTUifQ.WRqz-s1fU1St1FQAuQsmDA")
export default function Map()  {
  const [location, setLocation] = useState<Location>();

    return (
        <View style={styles.container}>
      <Mapbox.MapView style={styles.map}>
        <Mapbox.UserLocation
          onUpdate={(newLocation) => setLocation(newLocation)}
        />
        <Mapbox.Camera followUserLocation followZoomLevel={16} />
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