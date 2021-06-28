import React from "react";
import {View, Text, ScrollView, RefreshControl,StatusBar, ImageBackground, Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as firebase from "firebase";


export default class IstoricDoctor extends React.Component {

  constructor(){
    super()

    this.state={
      emailFromDoctor:'',
      programari:[],
      refresh: false,
    }
  }

  async componentDidMount(){
    try {
      const value = await AsyncStorage.getItem('email')
      if(value !== null) {
        this.setState({emailFromDoctor:value})
      }
    } catch(e) {
      // error reading value
    }
    this.getHistoryAppointments()
  }

  getHistoryAppointments = () =>{
    var admin = firebase;
    var db = admin.database();

    let mailDr = this.state.emailFromDoctor;
    let prenumeDr = mailDr.split("_")[0].charAt(0).toUpperCase()+mailDr.split("_")[0].slice(1);
    let parteaDeDupaBaraJos = mailDr.split("_")[1];
    let numeDr = parteaDeDupaBaraJos.split("@")[0].charAt(0).toUpperCase() + parteaDeDupaBaraJos.split("@")[0].slice(1);
    let pathDoctor = "Dr " + prenumeDr + " " + numeDr
    let refPath = "/istoric/" + pathDoctor


    db.ref(refPath).once("value").then((snapshot) => {
       
      //array temporar in care stochez fiecare obiect temporar de tip programare
      var _tempProgramari = [];

      snapshot.forEach((programariDoctorSnapshot) =>{
          programariDoctorSnapshot.forEach( ( oreSnapshot )  => {

                    /** obiect temporar care retine o programare
                     * @param dprogramariDoctorSnapshot.key este data programarii
                     * @param oreSnapshot.key este ora fiecarei programari dintr-o anumita data
                     * */
                    var programare = {
                      data: '',
                      ora: '',
                      nume: '',
                      prenume: '',
                      simptome: '',
                      email: '',
                      status: '',
                      raportMedical: ''
                    }

                   
                      programare.data = programariDoctorSnapshot.key;
                      programare.ora = oreSnapshot.key;
                      programare.nume = oreSnapshot.val().nume;
                      programare.prenume = oreSnapshot.val().prenume;
                      programare.simptome = oreSnapshot.val().simptome;
                      programare.email = oreSnapshot.val().email;
                      programare.status = "Acceptata";
                      programare.raportMedical = oreSnapshot.val().raportMedical
                      _tempProgramari.push(programare);
          })

      })
      this.setState({programari:_tempProgramari});
    })
  }

  onRefresh(){
    this.setState({refresh: true});
    this.getHistoryAppointments();
    this.setState({refresh:false});
  }

  render(){

    return(
      <View style={{flex:1,backgroundColor:'white',marginTop:50}}>
        <StatusBar barStyle = "dark-content" backgroundColor = 'white'/>
        <View style={{backgroundColor:"white",width:'100%' ,borderBottomLeftRadius:20,borderBottomRightRadius:20}}>
            <View style={{backgroundColor:"white",width:'90%',marginHorizontal:'5%', borderBottomLeftRadius:20,borderBottomRightRadius:20}}>
                <Text style={{fontSize:16, fontFamily:'normal-font',color:"#2a6049", marginBottom:'2%', marginLeft:'0.5%'}}>Bine ai venit</Text>
                <Text style={{fontSize:26, fontFamily:'bold-font',color:"#2a6049"}}>Istoric rapoarte medicale</Text>
            </View>
        </View>
        <ScrollView contentContainerStyle={{alignItems:'center'}}
                    refreshControl={
                      <RefreshControl
                      refreshing={this.state.refresh}
                      onRefresh={this.onRefresh.bind(this)}
                      />
                  }
                  style={{marginTop:'5%'}}
        >
             { this.state.programari.length === 0 ?

                <View style={{alignItems:'center'}}>
                  <Text style={{color:'gray'}}>Nu exista un istoric cu rapoarte medicale momentan.</Text>
                  <MaterialCommunityIcons  name={'cancel'} size={30} color={'gray'}/>
                </View>

                :

                this.state.programari.map((item) => (
                  <View style={{backgroundColor:"#2a6049",borderRadius:20,width:'90%', height:160, marginVertical:'3%', flexDirection:'column', overflow:'hidden'}} key={item.simptome + Math.random().toString()}>
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
                                <MaterialCommunityIcons  name={'calendar-range'} size={18} color={'white'}/>
                                <Text style={{fontSize:12,fontFamily:'bold-font', color:'white',marginLeft:'2%'}}>{item.data}</Text>
                            </View>
                        </View>
                        <View style={{flex:0.35, flexDirection:'row', alignItems:'center'}}>
                            <MaterialCommunityIcons  name={'file-chart'} size={18} color={'white'} style={{marginLeft:'2%', marginRight:'1%'}}/>
                            <Text style={{fontSize:12,fontFamily:'bold-font', color:'white'}}>{item.raportMedical}</Text>
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
