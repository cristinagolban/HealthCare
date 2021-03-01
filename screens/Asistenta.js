import React from 'react'
import { StyleSheet, Platform, Image, Text, View, TextInput, Button,Alert } from 'react-native'
import * as firebase from "firebase";
 
export default class Doctor extends React.Component {
  state = { currentUser: null, presentToDo: '' }
 
 
 
 
render() {
return (
      <View style={styles.container}>
        <Text>
          Hi Asistenta!
        </Text>
          
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})