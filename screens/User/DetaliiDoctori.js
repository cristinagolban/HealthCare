import React, { useState } from 'react';
import {View, Text, StatusBar, Alert, TextInput, TouchableOpacity, ImageBackground, ScrollView, SafeAreaView, Image, FlatList} from 'react-native';
import * as firebase from "firebase";
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications




export default class DetaliiDoctori extends React.Component {



  constructor(){

    super();

    this.state = {
        doctorsArray: [],
    };
  }

 componentDidMount(){
    this._handleDoctori()

 }


 _handleDoctori = () =>{
    firebase.database().ref("/doctor").once("value").then((snapshot) => {
        
        var tempDoctorEmail = '';
        var tempDoctorName = '';
        var tempDoctorSpecializare = '';
        var tempDoctorImagine = '';
        var tempDoctorsArray = [];

        snapshot.forEach((childSnapshot) => {
          // trebuie pus aici pentru ca in JavaScript obiectele sunt pasate prin referinta, de aia era la la fiecare obiect la fel si value si label
          var tempDoctorObject = {
            titlu: '',
            email: '',
            specializare:'',
            imagine: ''
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
          tempDoctorSpecializare = childSnapshot.val().specializare;
          tempDoctorImagine = childSnapshot.val().imagine;
          //doctor
          tempDoctorObject.titlu = titluDoctor;
          //doctor
          tempDoctorObject.email = tempDoctorEmail;
          tempDoctorObject.specializare = tempDoctorSpecializare;
          tempDoctorObject.imagine = tempDoctorImagine;
          tempDoctorsArray.push(tempDoctorObject);
          
      });
      this.setState({doctorsArray:tempDoctorsArray});
    }).catch(function(error) {
      console.log('There has been a problem with your fetch operation: ' + error.message);
    });
 }

  render(){
    return(
      <View style={{alignItems:'center',justifyContent:'center', flex:1,flexDirection:'column',backgroundColor:'white',marginTop:50}}>
        <StatusBar barStyle = "dark-content" backgroundColor = 'white'/>

            <FlatList 
                style={{width:'100%'}}
                contentContainerStyle={{alignItems:'center', justifyContent:'center'}}
                data={this.state.doctorsArray}
                renderItem = {({item})=>(
                    <View style={{ marginHorizontal:2, marginVertical:6, width:170, height:300, backgroundColor:'#2a6049', borderRadius:20}}>
                        <View style={{overflow:'hidden', borderTopLeftRadius:20, borderTopRightRadius:20}}>
                            <Image source={{uri:item.imagine}} resizeMode='contain' style={{height:170,width:170, overflow:'hidden'}}/>
                        </View>
                        <View style={{position:'absolute', top:'50%', left:15}}>
                            <Image source={ item.specializare === 'Medic Specialist Imunologie' ? require('../../assets/icon_imunologie.png') :
                                                item.specializare === 'Medic Specialist Cardiologie' ? require('../../assets/icon_cardiologie.png') :
                                                    item.specializare === 'Medic Specialist Nefrologie' ? require('../../assets/icon_nefrologie.png') :
                                                        item.specializare === 'Medic Primar Nutritie' ? require('../../assets/icon_nutritie.png') :
                                                            require('../../assets/icon_url.png')
                                          } 
                                    resizeMode='contain' style={{height:50,width:50, overflow:'hidden'}}/>
                        </View>
                        <Text style={{color:'white', fontSize:10, fontFamily:'bold-font', marginLeft:'5%', marginTop:'25%'}}>{item.specializare}</Text>
                        <Text style={{color:'white', fontSize:16, fontFamily:'bold-font', marginLeft:'5%'}}>{item.titlu}</Text>
                        <View style={{borderWidth:0.5, borderColor:'white', marginLeft:'6%', width:'30%', marginTop:'2%'}}></View>
                        <View style={{flexDirection:'row', alignItems:'center', marginLeft:'5%', marginTop:'5%'}}>
                            <MaterialCommunityIcons  name={'email'} size={12} color={'white'}/>
                            <Text style={{color:'white', fontSize:10, fontFamily:'normal-font', marginLeft:'1%'}}>{item.email}</Text>
                        </View>
                    </View>
                )}
                numColumns={2}
                keyExtractor={(item)=>item.email}
            />
      </View>
    )
  }

}