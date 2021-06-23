import React, { Component } from "react";
import {View, Text, ScrollView, RefreshControl,StatusBar, ImageBackground, TouchableOpacity, Image, Alert, Modal, TextInput, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as firebase from "firebase";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import email from 'react-native-email'

export default class HomeDoctor extends React.Component {

  #pacientAles = {
    data: "",
    email: "",
    nume: "",
    ora: "",
    prenume: "",
    simptome: "",
  };

  #pathDoctor = "";

  constructor(){
    super()

    this.state={
      emailFromDoctor:'',
      programari:[],
      isModalConsulta: false,
      mesajConsultatie: '',
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
    this.getAppointments()
  }

  getAppointments = () =>{
    var admin = firebase;
    var db = admin.database();

    let mailDr = this.state.emailFromDoctor;
    let prenumeDr = mailDr.split("_")[0].charAt(0).toUpperCase()+mailDr.split("_")[0].slice(1);
    let parteaDeDupaBaraJos = mailDr.split("_")[1];
    let numeDr = parteaDeDupaBaraJos.split("@")[0].charAt(0).toUpperCase() + parteaDeDupaBaraJos.split("@")[0].slice(1);
    let pathDoctor = "Dr " + prenumeDr + " " + numeDr
    this.#pathDoctor = pathDoctor;
    let refPath = "/programari/" + pathDoctor


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
                      status: ''
                    }

                    if( oreSnapshot.val().status === "Acceptata"){
                      programare.data = programariDoctorSnapshot.key;
                      programare.ora = oreSnapshot.key;
                      programare.nume = oreSnapshot.val().nume;
                      programare.prenume = oreSnapshot.val().prenume;
                      programare.simptome = oreSnapshot.val().simptome;
                      programare.email = oreSnapshot.val().email;
                      programare.status = "Acceptata";
                      _tempProgramari.push(programare);
                    }
          })

      })
      this.setState({programari:_tempProgramari});
    })
  }

  handlerConsulta = (item) => {
    this.#pacientAles = item
    this.setState({isModalConsulta:true})
  }

  handleAnuleaza = () =>{
    this.setState({isModalConsulta:false})
  }

  handleTrimite = () =>{
    //TODO: o stergi de la doctor dupa ce consulta si trimite, o treci intr-o tabela istoric si in Istoric Doctor
    // faci fetch acolo in functie de numele doctorului si ca user-ul sa primeasca raspuns trebuie creata alta 
    // tabela la fel in care sa fie raspunsuri, cel mai probabil aceeasi tabela ca si istoric pentru ca ii 
    // va ramane useru-ului

    //ADAUGARE PROGRAMARE IN TABELUL ISTORIC
    if( this.state.mesajConsultatie === ""){
      Alert.alert('Raport Incomplet!', 'Completeaza raportul inainte de a trimtie!');
    }else{
          var admin = firebase;
          var db = admin.database();
          var refPath = '/istoric'+'/'+this.#pathDoctor+'/'+this.#pacientAles.data;
          var ref = db.ref(refPath);
          var hoursRef = ref.child(this.#pacientAles.ora);

          hoursRef.set({
                    nume:this.#pacientAles.nume,
                    prenume:this.#pacientAles.prenume,
                    simptome:this.#pacientAles.simptome,
                    status:this.#pacientAles.status,
                    email:this.#pacientAles.email,
                    raportMedical: this.state.mesajConsultatie
                }).catch(function(error) {
                  console.log('There has been a problem with your fetch operation: ' + error.message);
                });


        //STERGERE PROGRAMARE DIN TABELUL PROGRAMARI
        let pathStergere = "/programari/" + this.#pathDoctor + "/" + this.#pacientAles.data
        firebase.database().ref(pathStergere).child(this.#pacientAles.ora).set({
          nume:null,
          prenume:null,
          simptome:null,
          status:null,
          email:null,
        });

        Alert.alert('Raport trimis!', 'Raportul medical a fost trimis cu succes');
        this.props.navigation.reset({index:0, routes:[{name:"HomeDoctor"}]});
      }
  }

  onRefresh(){
    this.setState({refresh: true});
    this.getAppointments();
    this.setState({refresh:false});
  }

  render(){
    return(
      <View style={{flex:1,backgroundColor:'white',marginTop:50}}>
        <StatusBar barStyle = "dark-content" backgroundColor = 'white'/>
        <Modal  animationType="slide"
                    visible={this.state.isModalConsulta}
                    transparent = {true}
 
                    >
            <View style={{  height:'60%',
                            justifyContent: "center",
                            alignItems: "center",
                            marginVertical:'20%'}}>
                <View style={{  height:'85%',
                                backgroundColor: "white",
                                borderRadius: 20,
                                width:'95%',
                                shadowColor: "#000",
                                shadowOffset: {
                                width: 0,
                                height: 2
                                      },
                                shadowOpacity: 0.25,
                                shadowRadius: 4,
                                elevation: 5}}
                >
                  <Text style={{fontSize:18, color:"#2a6049", fontFamily:'bold-font', textAlign:'center', marginVertical:'5%'}}>Raspuns consultatie catre {this.#pacientAles.nume} {this.#pacientAles.prenume}.</Text>
                  <Text style={{fontSize:18, color:"#2a6049", fontFamily:'bold-font', textAlign:'center', marginVertical:'5%'}}>Cu simptomele: {this.#pacientAles.simptome}</Text>           
                  <View style={{backgroundColor:'#2a6049', flexDirection:'row', borderRadius:20, alignItems:'center', height:150, width:'90%', marginTop:'1%', marginHorizontal:'5%'}}>
                      <TextInput
                          placeholder="Completeaza fisa medicala..."
                          placeholderTextColor='white'
                          autoCapitalize="none"
                          numberOfLines={4}
                          multiline={true}
                          style={styles.textInput}
                          onChangeText={mesajConsultatie => this.setState({ mesajConsultatie })}
                          value={this.state.mesajConsultatie}
                      />
                  </View>
                  <TouchableOpacity  onPress={this.handleTrimite} style={{backgroundColor:'#2a6049', marginTop:'5%', borderRadius:20, height:40, justifyContent:'center', alignItems:'center', width:'40%', marginHorizontal:'30%'}}>
                    <Text style={{color:'white', fontSize:16, fontFamily:'normal-font', textAlign:'center'}}>
                        Trimite Raport Medical
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity  onPress={this.handleAnuleaza} style={{backgroundColor:'#2a6049', marginTop:'3%', borderRadius:20, height:40, justifyContent:'center', alignItems:'center', width:'40%', marginHorizontal:'30%'}}>
                    <Text style={{color:'white', fontSize:18, fontFamily:'normal-font'}}>
                        Anuleaza
                    </Text>
                </TouchableOpacity>
                </View>
            </View>
          </Modal>
          <View style={{backgroundColor:"white",width:'100%' ,borderBottomLeftRadius:20,borderBottomRightRadius:20}}>
            <View style={{backgroundColor:"white",width:'90%',marginHorizontal:'5%', borderBottomLeftRadius:20,borderBottomRightRadius:20}}>
                <Text style={{fontSize:16, fontFamily:'normal-font',color:"#2a6049", marginBottom:'2%', marginLeft:'0.5%'}}>Bine ai venit</Text>
                <Text style={{fontSize:26, fontFamily:'bold-font',color:"#2a6049"}}>Rapoarte medicale</Text>
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
             {this.state.programari.length === 0 ?

                <View style={{alignItems:'center'}}>
                  <Text style={{color:'gray'}}>Nu exista rapoarte medicale momentan.</Text>
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
                        <View style={{flex:0.35, flexDirection:'row', alignItems:'center', justifyContent:'space-around'}}>
                                <TouchableOpacity onPress={()=>this.handlerConsulta(item)}>
                                        <View style={{height:35, width:110, borderRadius:25, backgroundColor:'#38ae7c', alignItems:'center', justifyContent:'center'}}>
                                            <Text style={{fontSize:12,fontFamily:'bold-font', color:'white'}}>Ofera consultatie</Text>
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
const styles = StyleSheet.create({
  textInput: {
    color:'white',
    width:'90%',
    height:'90%',
    marginHorizontal:'5%',
    fontSize:16,
    fontFamily:'normal-font'
  }
})