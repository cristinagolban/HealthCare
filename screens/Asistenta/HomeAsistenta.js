import React, { Component } from "react";
import {View, Text, ScrollView, RefreshControl,StatusBar, ImageBackground, TouchableOpacity, Image, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as firebase from "firebase";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import email from 'react-native-email'

export default class HomeAsistenta extends React.Component {

  constructor(){
    super()

    this.state={
      programari: [],
      refresh: false,
      
    }
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

    this.getAllAppointments();
    
  }

  getAllAppointments = () => {
      var admin = firebase;
      var db = admin.database();

      db.ref("/programari").once("value").then((snapshot) => {
         
        //array temporar in care stochez fiecare obiect temporar de tip programare
        var _tempProgramari = [];

        snapshot.forEach((doctoriSnapshot) =>{
            doctoriSnapshot.forEach( ( dataSnapshot )  => {
                    dataSnapshot.forEach( (oreSnapshot) => {
                      // console.log(doctoriSnapshot.key);
                      // console.log(dataSnapshot.key);
                      // console.log(oreSnapshot.key);
                      // console.log(oreSnapshot.val().nume);
                      // console.log(oreSnapshot.val().prenume);
                      // console.log(oreSnapshot.val().simptome);
                      // console.log('\n');
                    
                      

                      /** obiect temporar care retine o programare
                       * @param doctoriSnapshot.key este numele doctorului
                       * @param dataSnapshot.key este data 
                       * @param oreSnapshot.key este ora
                       * @param oreSnapshot.val reprezinta in functie de ce e apelat dupa: nume, prenume, simptome
                       * */
                      var programare = {
                        numeDoctor: '',
                        data: '',
                        ora: '',
                        nume: '',
                        prenume: '',
                        simptome: '',
                        email: '',
                      }

                      if( oreSnapshot.val().status === 'In asteptare'){
                        //Dr Bla Bla -> Dr. Bla Bla
                        programare.numeDoctor = doctoriSnapshot.key.substr(0,2)+'.'+doctoriSnapshot.key.substr(2);
                        programare.data = dataSnapshot.key;
                        programare.ora = oreSnapshot.key;
                        programare.nume = oreSnapshot.val().nume;
                        programare.prenume = oreSnapshot.val().prenume;
                        programare.simptome = oreSnapshot.val().simptome;
                        programare.email = oreSnapshot.val().email;

                      _tempProgramari.push(programare);
                      }
                    })
            })

        })
        this.setState({programari:_tempProgramari});
        //console.log(this.state.programari);
      })
  }

 

  onRefresh(){
    this.setState({refresh: true});
    this.getAllAppointments(); 
    this.setState({refresh:false});
  }

  handlerRespinge = (refPath, oraProgramare) =>{
    
    firebase.database().ref(refPath).child(oraProgramare).set({
                nume:null,
                prenume:null,
                simptome:null,
                status:null,
                email:null,
    });
    Alert.alert('Action!', 'Programarea a fost respinsa cu succes!');
    this.props.navigation.reset({index:0, routes:[{name:"Acasa"}]});
  }

  handlerAccepta = (refPath, oraProgramare, nume, prenume, simptome, email) =>{
    
    // console.log(refPath);
    // console.log(oraProgramare);
    // console.log(nume + prenume + simptome);
    
    firebase.database().ref(refPath).child(oraProgramare).set({
                nume:nume,
                prenume:prenume,
                simptome:simptome,
                status:'Acceptata',
                email:email,
    });
    Alert.alert('Action!', 'Programarea a fost acceptata cu succes!');
    this.props.navigation.reset({index:0, routes:[{name:"Acasa"}]});
  }

  handleEmail = () => {
    const to = ['sofransebastian@yahoo.com'] // string or array of email addresses
    email(to, {
        // Optional additional arguments
        
       
        subject: 'Test',
        body: 'Test'
    }).catch(console.error)
}

  render(){

    return(
      <View style={{flex:1,backgroundColor:'white',marginTop:50}}>
        <StatusBar barStyle = "dark-content" backgroundColor = 'white'/>
        <View style={{backgroundColor:"white",width:'100%' ,borderBottomLeftRadius:20,borderBottomRightRadius:20}}>
            <View style={{backgroundColor:"white",width:'90%',marginHorizontal:'5%', borderBottomLeftRadius:20,borderBottomRightRadius:20}}>
                <Text style={{fontSize:16, fontFamily:'normal-font',color:"#2a6049", marginBottom:'2%', marginLeft:'0.5%'}}>Bine ai venit</Text>
                <Text style={{fontSize:26, fontFamily:'bold-font',color:"#2a6049"}}>Programari în așteptare</Text>
            </View>
        </View>
        <ScrollView contentContainerStyle={{alignItems:'center'}}
                    refreshControl={
                      <RefreshControl
                      refreshing={this.state.refresh}
                      onRefresh={this.onRefresh.bind(this)}
                      />
                  }
        >

            {
                this.state.programari.map((item) => (
                  <View style={{backgroundColor:"#2a6049",borderRadius:20,width:'90%', height:160, marginVertical:'3%', flexDirection:'column', overflow:'hidden'}}>
                    <ImageBackground    source={require('../../assets/gradient.jpg')}
                                        style={{width: '100%', height: '100%'}}
                    > 
                        <View style={{flex:0.20,flexDirection:'row',marginLeft:'2%', alignItems:'center'}}>
                            <MaterialCommunityIcons  name={'account'} size={20} color={'white'}/>
                            <Text style={{fontSize:18,fontFamily:'bold-font', color:'white',marginLeft:'1%'}}>{item.nume} {item.prenume}</Text>
                        </View>
                        <View style={{flex:0.30, flexDirection:'row',marginLeft:'2%', alignItems:'center'}}>
                            <Image source={require('../../assets/symptoms_icon.png')} resizeMode='contain' style={{height:20,width:20}}/>
                            <Text numberOfLines={2} style={{fontSize:12,fontFamily:'bold-font', color:'white' , marginLeft:"2%"}}>{item.simptome}</Text>
                        </View>
                        <View style={{flex:0.15, flexDirection:'row', alignItems:'center', justifyContent:'space-evenly'}}>
                            <View style={{flexDirection:'row'}}>
                                <MaterialCommunityIcons  name={'clock-time-eight'} size={18} color={'white'}/>
                                <Text style={{fontSize:12,fontFamily:'bold-font', color:'white',marginLeft:'2%'}}>{item.ora}</Text>
                            </View>
                            <View style={{flexDirection:'row'}}>
                                <MaterialCommunityIcons  name={'doctor'} size={17} color={'white'}/>
                                <Text style={{fontSize:12,fontFamily:'bold-font', color:'white',marginLeft:'2%'}}>{item.numeDoctor}</Text>
                            </View>
                            <View style={{flexDirection:'row'}}>
                                <MaterialCommunityIcons  name={'calendar-range'} size={18} color={'white'}/>
                                <Text style={{fontSize:12,fontFamily:'bold-font', color:'white',marginLeft:'2%'}}>{item.data}</Text>
                            </View>
                        </View>
                        <View style={{flex:0.35, flexDirection:'row', alignItems:'center', justifyContent:'space-around'}}>
                                <TouchableOpacity onPress={()=>this.handlerAccepta('/programari' + '/' + item.numeDoctor.replace(/\./g,"") + '/' + item.data, item.ora, item.nume, item.prenume, item.simptome, item.email)}>
                                        <View style={{height:35, width:110, borderRadius:25, backgroundColor:'#38ae7c', alignItems:'center', justifyContent:'center'}}>
                                            <Text style={{fontSize:12,fontFamily:'bold-font', color:'white'}}>Accepta</Text>
                                        </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=>this.handlerRespinge('/programari' + '/' + item.numeDoctor.replace(/\./g,"") + '/' + item.data, item.ora)}>
                                        <View style={{height:35, width:110, borderRadius:25, backgroundColor:'#b13232', alignItems:'center', justifyContent:'center'}}>
                                            <Text style={{fontSize:12,fontFamily:'bold-font', color:'white'}}>Respinge</Text>
                                        </View>
                                </TouchableOpacity>
                        </View>
                    </ImageBackground>
                </View>
                ))
            }
        </ScrollView>
      </View>
    )
  }

}
