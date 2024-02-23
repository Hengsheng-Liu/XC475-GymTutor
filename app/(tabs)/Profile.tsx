import { StyleSheet, Text, View, SafeAreaView, Image, Button, Alert, Dimensions } from 'react-native'
import React, { Component, useEffect, useState } from 'react'
import { firestore, auth } from "../../firebaseConfig";
import ProfilePage from '@/components/UserProfilePage'

export default function Profile() {
    return (
        <View>
            <ProfilePage/>
        </View>
    ) 
}