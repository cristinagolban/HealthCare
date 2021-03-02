import React, { Component } from "react";
import {View, Text, Button, Alert} from 'react-native';
import * as firebase from "firebase";


var admin = firebase;
var db = admin.database();
var day = new Date().getDate();
var month = new Date().getMonth() + 1;
var year = new Date().getFullYear();
var date =   day + '-' + month + '-' + year;
var hgour = '13:00'

//var ref = db.ref('/programari/sebi');
//var usersRef = ref.child(date);

var refString = '/programari/sebi/' + date ;

var ref = db.ref(refString)
var ore = [];
var bla = '';

export default class Programeaza extends React.Component {

 componentDidMount(){
   
   let temp = '';
  ref.once("value")
    .then((snapshot) => {
      snapshot.forEach((childSnapshot) => {


          //console.log(childSnapshot.key);
          temp = childSnapshot.key
          ore.push(temp);
      
    });
  })
  
}



  blaGetData(){
    
    usersRef.child("13:00").set({
        nume:"ion",
        prenume:"ddd",
        simptome:"aaaanfdfbdsndivnd;f",
        ora:"13:00"
    })
    Alert.alert('Action!', 'A new To-do item was created');
  }

  render(){
    return(
      <View>
        <Text>Programeaza</Text>
        <Button title="abc" onPress={()=>{console.log(ore)}}/>
        <Text> if(array[i].isIn(ore)</Text>
      </View>
    )
  }

}