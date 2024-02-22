import { Text, View,StyleSheet } from 'react-native'
import React, { Component } from 'react'
import Mapbox from '@rnmapbox/maps';
Mapbox.setAccessToken('<pk.eyJ1IjoiNTI0ODc2NDY2IiwiYSI6ImNsc3V3ZHV4MzA0ODQycXBpMmpra2FrcGcifQ.i8l-tVX4t7vwLo5nabrBhg>');

export class Map extends Component {
  render() {
    return (
        <View style={styles.page}>
        <View style={styles.container}>
          <Mapbox.MapView style={styles.map} />
        </View>
      </View>
    )
  }
}
const styles = StyleSheet.create({
    page: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      height: 300,
      width: 300,
    },
    map: {
      flex: 1
    }
  });
export default Map