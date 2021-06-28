import React, { useState } from 'react';
import {View, Text, StatusBar, Alert, TextInput, TouchableOpacity, ImageBackground, ScrollView, SafeAreaView} from 'react-native';
import * as firebase from "firebase";
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications

export default class Programeaza extends React.Component {


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
      status: 'In asteptare',
      emailFromUser: '',
    };
  }

  async componentDidMount(){

    try {
      const value = await AsyncStorage.getItem('email')
      if(value !== null) {
        this.setState({emailFromUser:value})
      }
    } catch(e) {
      // error reading value
    }

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

          var numeDoctor = '';
          var prenumeDoctor = '';
          var titluDoctor = '';

          numeDoctor = tempDoctorName.split('_')[0].charAt(0).toUpperCase()+tempDoctorName.split('_')[0].slice(1);
          prenumeDoctor = tempDoctorName.split('_')[1].charAt(0).toUpperCase()+tempDoctorName.split('_')[1].slice(1);
          titluDoctor = 'Dr. '+numeDoctor+' '+prenumeDoctor;
          //doctor
          tempDoctorObject.label = titluDoctor;
          //doctor
          tempDoctorObject.value = titluDoctor;
          tempDoctorsArray.push(tempDoctorObject);
          
      });
      this.setState({doctorsArray:tempDoctorsArray});
    }).catch(function(error) {
      console.log('There has been a problem with your fetch operation: ' + error.message);
    });
  }

  addHourToDatabase = () => {
    if( this.state.nume === '' || 
        this.state.prenume === '' || 
        this.state.simptome === '' ||
        this.state.chosenDoctor === '' ||
        this.date === '' ||
        this.state.pickedHour === '' 
      ){
      Alert.alert('Action!', 'Completeaza toate campurile');
    }else{
          var admin = firebase;
          var db = admin.database();
          var refPath = '/programari'+'/'+this.state.chosenDoctor+'/'+this.date;
          var ref = db.ref(refPath);
          var hoursRef = ref.child(this.state.pickedHour);

          var emailAuth = this.state.emailFromUser;

          hoursRef.set({
                    nume:this.state.nume,
                    prenume:this.state.prenume,
                    simptome:this.state.simptome,
                    status:this.state.status,
                    email:emailAuth,
                }).catch(function(error) {
                  console.log('There has been a problem with your fetch operation: ' + error.message);
                });
                Alert.alert('Action!', 'Te-ai programat cu succes');
                this.props.navigation.reset({index:0, routes:[{name:"Programeaza"}]});
        
      }
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
            tempHour = childSnapshot.key
            tempHoursArray.push(tempHour);
        
      });
      this.setState({scheduleArray:tempHoursArray});
    }).catch(function(error) {
      console.log('There has been a problem with your fetch operation: ' + error.message);
    });
  }

  findDifferentElementsBetweenArrays = () =>{
    if(   this.state.chosenDoctor === '' ||
          this.date === ''){
            Alert.alert('Action!', 'Completeaza data si doctorul dorit!');
    }else{
      this.setState({differenceArray:this.schedule.filter(x => ! this.state.scheduleArray.includes(x))});
    }
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

  // handleProgrameaza(){
  //   this.addHourToDatabase;
  // }

  // handleReset = () =>{
  //   this.props.navigation.reset({index:0, routes:[{name:"Programeaza"}]});
  // }

  render(){
    return(
      <View style={{alignItems:'center',justifyContent:'center', flex:1,flexDirection:'column',backgroundColor:'white',marginTop:50}}>
        <StatusBar barStyle = "dark-content" backgroundColor = 'white'/>
        <View style={{backgroundColor:"white",width:'100%' ,borderBottomLeftRadius:20,borderBottomRightRadius:20,marginBottom:'3%'}}>
          <View style={{backgroundColor:"white",width:'90%',marginHorizontal:'5%', borderBottomLeftRadius:20,borderBottomRightRadius:20}}>
            <Text style={{fontSize:16, fontFamily:'normal-font',color:"#2a6049", marginBottom:'2%',  marginLeft:'1%'}}>Programeaza-te</Text>
            <Text style={{fontSize:28, fontFamily:'bold-font',color:"#2a6049"}}>Completeaza campurile</Text>
          </View>
        </View>
        <ScrollView style={{width:"100%",flex:1,marginTop:'2%'}}>
          <View style={{width:'90%',marginHorizontal:'5%'}}>
            <View style={{marginBottom:'8%', flexDirection:'row',paddingBottom:1, borderColor:"gray", borderBottomWidth:1, borderTopWidth:0, borderLeftWidth:0, borderRightWidth:0}}>
              <MaterialCommunityIcons  name={'account-arrow-right'} color="#2a6049" size={26} style={{marginRight:'2%'}}/>
              <TextInput  style={{flex:1,fontSize:16, fontFamily:'bold-font', color:"#2a6049" }} 
                          underlineColorAndroid="transparent"
                          onChangeText = {this.handleNume}
                          value = {this.state.nume}
                          placeholder = 'Nume'
                          placeholderTextColor = "#d3e0db"
              />
            </View>
            <View style={{marginBottom:'8%', flexDirection:'row',paddingBottom:1, borderColor:"gray", borderBottomWidth:1, borderTopWidth:0, borderLeftWidth:0, borderRightWidth:0}}>
              <MaterialCommunityIcons  name={'account-arrow-right'} color="#2a6049" size={26} style={{marginRight:'2%'}}/>
              <TextInput  style={{flex:1,fontSize:16, fontFamily:'bold-font', color:"#2a6049" }} 
                      underlineColorAndroid="transparent"
                      onChangeText = {this.handlePrenume}
                      value = {this.state.prenume}
                      placeholder = 'Prenume'
                      placeholderTextColor = "#d3e0db"
              />
            </View>
            <View style={{marginBottom:'8%', flexDirection:'row',paddingBottom:1, borderColor:"gray", borderBottomWidth:1, borderTopWidth:0, borderLeftWidth:0, borderRightWidth:0}}>
              <MaterialCommunityIcons  name={'tab-plus'} color="#2a6049" size={22} style={{marginRight:'2%'}}/>
                <TextInput   style={{flex:1,fontSize:16, fontFamily:'bold-font', color:"#2a6049" }}
                            underlineColorAndroid="transparent"
                            multiline={true}
                            onChangeText = {this.handleSimptome}
                            value = {this.state.simptome}
                            placeholder = 'Simptome'
                            placeholderTextColor = "#d3e0db"
                />
           </View>

          <View style={{marginBottom:'8%', zIndex:1}}>
            <DropDownPicker
                items={this.state.doctorsArray}
                placeholder='Alege doctorul'
                //searchablePlaceholder={this.state.label}
                containerStyle={{height: 50}}
                arrowColor={'white'}
                arrowSize={20}
                labelStyle={{fontFamily:'normal-font'}}
                placeholderStyle={{color:'white', fontSize:16}}
                style={{backgroundColor: "#2a6049"}}
                selectedLabelStyle={{color:'white'}}
                onChangeItem={item => this.setState({chosenDoctor:item.value.replace(/\./g,"")})}
            />
          </View>
          <View style={{flexDirection:'row',justifyContent:'space-between',width:'100%',marginBottom:'8%', overflow:'hidden'}}>
            <View >
              <TouchableOpacity onPress={this.showDatePicker} style={{width:170,height:100, backgroundColor:"#2a6049", borderRadius:5, justifyContent:'center', alignItems:'center'}}>
                    <MaterialCommunityIcons  name={'calendar-range'} color="white" size={30}/>
                    <Text style={{fontFamily:'normal-font', color:'white', fontSize:16}}>Alege data</Text>
              </TouchableOpacity>
            </View>

            <View>
              <TouchableOpacity onPress={this.findDifferentElementsBetweenArrays} style={{width:170,height:100, backgroundColor:"#2a6049", borderRadius:5, justifyContent:'center', alignItems:'center'}}>
                    <MaterialCommunityIcons  name={'clock-outline'} color="white" size={30}/>
                    <Text style={{fontFamily:'normal-font', color:'white', fontSize:16}}>Afiseaza Orar</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* <Button style={{marginTop:'5%'}} title="Press" onPress={this.findDifferentElementsBetweenArrays} /> */}
          
           <SafeAreaView style={{marginBottom:'8%',height:50, alignItems:'center', justifyContent:'center',backgroundColor:"#2a6049" ,borderWidth:2, borderColor:"#2a6049", borderRadius:5 }}>
           <ScrollView horizontal={true} style={{ width:'90%'}} contentContainerStyle={{alignItems:'center'}}>

                {
                this.state.differenceArray.map((item) => (
                  <TouchableOpacity onPress={() => {this.setState({pickedHour:item})}}>
                      <Text style={{color:'white', fontSize:20, fontFamily:'normal-font',}}>{item}  </Text>
                  </TouchableOpacity>
                ))
                }
               
        </ScrollView>
        </SafeAreaView>
        <View style={{marginBottom:'8%'}}>
            <TouchableOpacity onPress={this.addHourToDatabase} style={{width:'100%', height:50,  borderRadius:5,backgroundColor:"#2a6049", justifyContent:'center', alignItems:'center',overflow:'hidden'}}>
                  <Text style={{fontFamily:'normal-font', color:'white', fontSize:16}}>Programeaza</Text>
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