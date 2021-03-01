import React from 'react'
import { StyleSheet, Platform, Image, Text, View, TextInput, Button,Alert } from 'react-native'
import * as firebase from "firebase";
 
export default class Main extends React.Component {
  state = { currentUser: null, presentToDo: '' }
 
  componentDidMount() {
    const { currentUser } = firebase.auth()
    this.setState({ currentUser })
}
 
 
getData(){
  firebase.database().ref('asistenta').push({
    email:'asistenta@yahoo.com',
    password:'123456' 

  
  });
 
}
blaGetData(){
  firebase.database().ref('/programari').push({
    title:"TEST SEBI",
    programare:'02-20-2021',
    boala:'boala copiilor'
  });
  Alert.alert('Action!', 'A new To-do item was created');
}
putStorage(){
  firebase.storage().ref('/assests/icon.png').put('icon.png');
  Alert.alert('Action!', 'Am bagat imaginea boss');
}
 
 
render() {
    const { currentUser } = this.state
return (
      <View style={styles.container}>
        <Text>
          Hi {currentUser && currentUser.email }!
        </Text>
          <Button onPress={this.getData} title='PRESS'/>
          <Button onPress={this.blaGetData} title='PRESS Me 2'/>
 
          <Button onPress={this.putStorage} title='PRESS Me 3'/>
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