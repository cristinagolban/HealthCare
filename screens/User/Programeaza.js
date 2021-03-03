import React, { useState } from 'react';
import {View, Text, Button, Alert, TextInput, TouchableOpacity, ScrollView, SafeAreaView} from 'react-native';
import * as firebase from "firebase";
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";

import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications


// var admin = firebase;
// var db = admin.database();
// var day = new Date().getDate();
// var month = new Date().getMonth() + 1;
// var year = new Date().getFullYear();
// var date =   month + '-' + day + '-' + year;
// var hgour = '13:00'

// //var ref = db.ref('/programari/sebi');
// //var usersRef = ref.child(date);

// var refString = '/programari/sebi/' + date ;

// var ref = db.ref(refString)
// var ore = [];
// var bla = '';


//    let temp = '';
//   ref.once("value")
//     .then((snapshot) => {
//       snapshot.forEach((childSnapshot) => {


//           //console.log(childSnapshot.key);
//           temp = childSnapshot.key
//           ore.push(temp);
      
//     });
//   })

// var a = new Date()
// var bla = a.toISOString().split('T')[0]


export default class Programeaza extends React.Component {




//   blaGetData(){
    
//     usersRef.child("13:00").set({
//         nume:"ion",
//         prenume:"ddd",
//         simptome:"aaaanfdfbdsndivnd;f",
//         ora:"13:00"
//     })
//     Alert.alert('Action!', 'A new To-do item was created');
//   }

  /** Print the difference between two arrays (doesn't)
   * var first = [ 1, 2, 3, 4, 5 ];
    var second = [ 4, 5, 6 ];
 
    var difference = first.filter(x => !second.includes(x));
    console.log(difference);
   */

  constructor(){

    super();

    this.day = '';
    this.month = '';
    this.year = '';

    this.date = '';

    this.schedule = ["08:00","09:00", "10:00","11:00","12:00","13:00","14:00","15:00","16:00"];

    this.state = {
      nume: '',
      prenume: '',
      simptome: '',
      doctorsArray : [],
      chosenDoctor : '',
      isDatePickerVisible: false,
      pickedDate: '',
      scheduleArray : [],
      differenceArray : [],
      pickedHour: '',
    };
  }

  async componentDidMount(){
      firebase.database().ref("/doctor").once("value").then((snapshot) => {
        
        var tempDoctorEmail = '';
        var tempDoctorName = '';
        var tempDoctorsArray = [];

        snapshot.forEach((childSnapshot) => {
          // trebuie pus aici pentru ca in JavaScript obiectele sunt pasate prin referinta, de aia era la la fiecare obiect la fel si value si label
          var tempDoctorObject = {
            label: '',
            value: ''
          }
          //doctor@yahoo.com
          tempDoctorEmail = childSnapshot.val().email;
          //[doctor,@yahoo.com][0]
          tempDoctorName = tempDoctorEmail.split('@')[0];
          //doctor
          tempDoctorObject.label = tempDoctorName;
          //doctor
          tempDoctorObject.value = tempDoctorName;
          tempDoctorsArray.push(tempDoctorObject);
          
          
          
      });
      this.setState({doctorsArray:tempDoctorsArray});
      console.log(this.state.doctorsArray);
    }).catch(function(error) {
      console.log('There has been a problem with your fetch operation: ' + error.message);
    });
  }

  addHour = () => {
    var admin = firebase;
    var db = admin.database();
    var refPath = '/programari'+'/'+this.state.chosenDoctor+'/'+this.date;
    var ref = db.ref(refPath);
    var hoursRef = ref.child("15:00");

    hoursRef.set({
              nume:"andrei",
              prenume:"sss",
              simptome:"aaaanfdfbdsndivnd;f",
          }).catch(function(error) {
            console.log('There has been a problem with your fetch operation: ' + error.message);
          });
          Alert.alert('Action!', 'A new To-do item was created');
        
  }

  addHourToDatabase = () => {
    var admin = firebase;
    var db = admin.database();
    var refPath = '/programari'+'/'+this.state.chosenDoctor+'/'+this.date;
    var ref = db.ref(refPath);
    var hoursRef = ref.child(this.state.pickedHour);

    hoursRef.set({
              nume:this.state.nume,
              prenume:this.state.prenume,
              simptome:this.state.simptome,
          }).catch(function(error) {
            console.log('There has been a problem with your fetch operation: ' + error.message);
          });
          Alert.alert('Action!', 'Te-ai programat cu succes');
        
  }

  getScheduleForOneDay = () => {
    var admin = firebase;
    var db = admin.database();
    var refPath = '/programari'+'/'+this.state.chosenDoctor+'/'+this.date;
    var ref = db.ref(refPath);
    
    ref.once("value")
      .then((snapshot) => {

        var tempHoursArray = [];

        snapshot.forEach((childSnapshot) => {
  
            var tempHour = '';
            //console.log(childSnapshot.key);
            tempHour = childSnapshot.key
            tempHoursArray.push(tempHour);
        
      });
      this.setState({scheduleArray:tempHoursArray});
    }).catch(function(error) {
      console.log('There has been a problem with your fetch operation: ' + error.message);
    });
  }

  findDifferentElementsBetweenArrays = () =>{
    
    this.setState({differenceArray:this.schedule.filter(x => ! this.state.scheduleArray.includes(x))});
    
    console.log(this.differenceArray);
  }


  handleNume = (text) => {
    this.setState({nume:text})
  } 

  handlePrenume = (text) => {
    this.setState({prenume:text})
  } 

  handleSimptome = (text) => {
    this.setState({simptome:text})
  } 

  showDatePicker = () => {
    this.setState({isDatePickerVisible:!this.state.isDatePickerVisible})
  };

  hideDatePicker = () => {
    this.setState({isDatePickerVisible:!this.state.isDatePickerVisible})
  };

  handleConfirm = (date) => {
    this.day = date.getDate();
    this.month = date.getMonth() + 1;
    this.year = date.getFullYear();
    this.date =   this.month + '-' + this.day + '-' + this.year; 
    this.getScheduleForOneDay();
    this.setState({isDatePickerVisible:false})
    
  };



  render(){
    return(
      <View style={{alignItems:'center',justifyContent:'center', flex:1,flexDirection:'column',backgroundColor:'white',}}>

        <ScrollView style={{width:"100%",flex:1,marginTop:'2%'}}>
          <View style={{width:'90%',marginHorizontal:'5%'}}>
          <Text style={{fontSize:14, fontFamily:'normal-font', color:"#2a6049"}}>Nume</Text>
          <TextInput  style={{marginBottom:'5%', borderColor:"gray", borderBottomWidth:1, borderTopWidth:0, borderLeftWidth:0, borderRightWidth:0,fontSize:16, fontFamily:'bold-font', color:"#2a6049" }} 
                      underlineColorAndroid="transparent"
                      onChangeText = {this.handleNume}
                      value = {this.state.nume}
          />
          <Text style={{ fontSize:14, fontFamily:'normal-font', color:"#2a6049"}}>Prenume</Text>
          <TextInput  style={{marginBottom:'5%', borderColor:"gray", borderWidth:0.5, borderTopWidth:0, borderLeftWidth:0, borderRightWidth:0,fontSize:16, fontFamily:'bold-font', color:"#2a6049" }} 
                      underlineColorAndroid="transparent"
                      onChangeText = {this.handlePrenume}
                      value = {this.state.prenume}
          />
          <Text style={{fontSize:14, fontFamily:'normal-font', color:"#2a6049"}}>Simptome</Text>
          <TextInput  style={{marginBottom:'5%', textAlignVertical:'top', borderColor:"gray", borderWidth:0.5, borderTopWidth:0, borderLeftWidth:0, borderRightWidth:0,fontSize:16, fontFamily:'bold-font', color:"#2a6049" }} 
                      underlineColorAndroid="transparent"
                      multiline={true}
                      numberOfLines={5}
                      onChangeText = {this.handleSimptome}
                      value = {this.state.simptome}
          />
          <View style={{marginVertical:'3%', zIndex:1}}>
            <DropDownPicker
                items={this.state.doctorsArray}
                placeholder="Alege doctor"
                containerStyle={{height: 40}}
                style={{backgroundColor: '#fafafa', zIndex:1}}
                containerStyle={{zIndex:1}}
                onChangeItem={item => this.setState({chosenDoctor:item.value})}
            />
          </View>
          <View style={{marginVertical:'4%'}}>
            <TouchableOpacity onPress={this.showDatePicker} style={{width:'100%', height:50, backgroundColor:"#2a6049", borderRadius:40, justifyContent:'center', alignItems:'center'}}>
                  <Text style={{fontFamily:'bold-font', color:'white', fontSize:18}}>Alege data</Text>
            </TouchableOpacity>
          </View>

          <View style={{marginVertical:'4%'}}>
            <TouchableOpacity onPress={this.findDifferentElementsBetweenArrays} style={{width:'100%', height:50, backgroundColor:"#2a6049", borderRadius:40, justifyContent:'center', alignItems:'center'}}>
                  <Text style={{fontFamily:'bold-font', color:'white', fontSize:18}}>Vezi orele disponibile</Text>
            </TouchableOpacity>
          </View>
          
          {/* <Button style={{marginTop:'5%'}} title="Press" onPress={this.findDifferentElementsBetweenArrays} /> */}
          
           <SafeAreaView style={{marginVertical:'4%',height:50, alignItems:'center', justifyContent:'center',backgroundColor:"#2a6049" ,borderWidth:2, borderColor:"#2a6049", borderRadius:40 }}>
           <ScrollView horizontal={true} style={{ width:'90%'}}>

                {
                this.state.differenceArray.map((item) => (
                  <TouchableOpacity onPress={() => {this.setState({pickedHour:item}),console.log(this.state.pickedHour)}}>
                      <Text style={{color:'white', fontSize:22, fontFamily:'bold-font'}}>{item}  </Text>
                  </TouchableOpacity>
                ))
                }
               
        </ScrollView>
        </SafeAreaView>
        <View style={{marginBottom:'4%'}}>
            <TouchableOpacity onPress={this.addHourToDatabase} style={{width:'100%', height:50, backgroundColor:"#2a6049", borderRadius:40, justifyContent:'center', alignItems:'center'}}>
                  <Text style={{fontFamily:'bold-font', color:'white', fontSize:18}}>Programeaza</Text>
            </TouchableOpacity>
          </View>
          </View>
        </ScrollView>
        
        <DateTimePickerModal
                isVisible={this.state.isDatePickerVisible}
                mode="date"
                onConfirm={this.handleConfirm}
                onCancel={this.hideDatePicker}
                minimumDate={new Date()}
        />
      </View>
    )
  }

}
