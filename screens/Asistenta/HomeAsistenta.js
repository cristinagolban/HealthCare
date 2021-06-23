import React, { Component } from "react";
import {View, Text, ScrollView, RefreshControl,StatusBar, ImageBackground, TouchableOpacity, Image, Alert, Modal, TextInput, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as firebase from "firebase";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import email from 'react-native-email'

export default class HomeAsistenta extends React.Component {

  #detaliiStergere = {
    refPath:'',
    oraProgramare:'',
    email:''
  }

  #detaliiAcceptare = { 
    refPath:'', 
    oraProgramare:'', 
    nume:'', 
    prenume:'', 
    simptome:'',
    email:''
  }

  constructor(){
    super()

    this.state={
      programari: [],
      refresh: false,
      subiect: '',
      mesaj: '',
      isModalAcceptedEmail: false,
      isModalRefusedEmail: false,
      rememberEmail: ''
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

  handlerRespinge = (refPath, oraProgramare, email) =>{
    

    //Alert.alert('Action!', 'Programarea a fost respinsa cu succes!');
    this.#detaliiStergere.refPath = refPath;
    this.#detaliiStergere.oraProgramare = oraProgramare;
    this.#detaliiStergere.email = email
    this.setState({isModalRefusedEmail: true, rememberEmail: email})
    //this.props.navigation.reset({index:0, routes:[{name:"Acasa"}]});
  }

  handlerAccepta = (refPath, oraProgramare, nume, prenume, simptome, email) =>{
    
    // console.log(refPath);
    // console.log(oraProgramare);
    // console.log(nume + prenume + simptome);
    

    this.#detaliiAcceptare.refPath = refPath;
    this.#detaliiAcceptare.oraProgramare = oraProgramare;
    this.#detaliiAcceptare.nume = nume;
    this.#detaliiAcceptare.prenume = prenume;
    this.#detaliiAcceptare.simptome = simptome;
    this.#detaliiAcceptare.email = email;
    //Alert.alert('Action!', 'Programarea a fost acceptata cu succes!');
    this.setState({isModalAcceptedEmail: true, rememberEmail: email})
    
    //this.props.navigation.reset({index:0, routes:[{name:"Acasa"}]});
  }

  handleEmailAcceptat = () => {
    const to = [this.state.rememberEmail] // string or array of email addresses
    email(to, {
        // Optional additional arguments
        subject: this.state.subiect,
        body: this.state.mesaj
    }).catch(console.error)
    this.firebaseAccepta();
    this.props.navigation.reset({index:0, routes:[{name:"Acasa"}]});
}

firebaseAccepta = () =>{
  firebase.database().ref(this.#detaliiAcceptare.refPath).child(this.#detaliiAcceptare.oraProgramare).set({
    nume:this.#detaliiAcceptare.nume,
    prenume:this.#detaliiAcceptare.prenume,
    simptome:this.#detaliiAcceptare.simptome,
    status:'Acceptata',
    email:this.#detaliiAcceptare.email,
});
}

firebaseRefuza = () =>{
    firebase.database().ref(this.#detaliiStergere.refPath).child(this.#detaliiStergere.oraProgramare).set({
                nume:null,
                prenume:null,
                simptome:null,
                status:null,
                email:null,
    });
}

handleEmailRefuzat = () => {
  const to = [this.state.rememberEmail] // string or array of email addresses
  email(to, {
      // Optional additional arguments
      subject: this.state.subiect,
      body: this.state.mesaj
  }).catch(console.error)
  this.firebaseRefuza()
  this.props.navigation.reset({index:0, routes:[{name:"Acasa"}]});
}

handleAnuleazaAcceptata = () =>{
    this.setState({isModalAcceptedEmail: false})
    this.props.navigation.reset({index:0, routes:[{name:"Acasa"}]});
}

handleAnuleazaRespins = () =>{
  this.setState({isModalRefusedEmail: false})
  this.props.navigation.reset({index:0, routes:[{name:"Acasa"}]});
}

  render(){

    return(
      <View style={{flex:1,backgroundColor:'white',marginTop:50}}>
        <StatusBar barStyle = "dark-content" backgroundColor = 'white'/>
         
        <Modal  animationType="slide"
                    visible={this.state.isModalAcceptedEmail}
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
                  <Text style={{fontSize:18, color:"#2a6049", fontFamily:'bold-font', textAlign:'center', marginVertical:'5%'}}>Raspuns programare acceptata</Text>
                  <View style={{backgroundColor:'#2a6049', flexDirection:'row', borderRadius:20, alignItems:'center', height:50, width:'90%', marginTop:'3%', marginHorizontal:'5%'}}>
                      <TextInput
                          placeholder="Subiect"
                          placeholderTextColor='white'
                          autoCapitalize="none"
                          style={styles.textInput}
                          onChangeText={subiect => this.setState({ subiect })}
                          value={this.state.subiect}
                      />
                  </View>
                  <View style={{backgroundColor:'#2a6049', flexDirection:'row', borderRadius:20, alignItems:'center', height:150, width:'90%', marginTop:'3%', marginHorizontal:'5%'}}>
                      <TextInput
                          placeholder="Mesaj..."
                          placeholderTextColor='white'
                          autoCapitalize="none"
                          numberOfLines={4}
                          multiline={true}
                          style={styles.textInput}
                          onChangeText={mesaj => this.setState({ mesaj })}
                          value={this.state.mesaj}
                      />
                  </View>
                  <TouchableOpacity  onPress={this.handleEmailAcceptat} style={{backgroundColor:'#2a6049', marginTop:'5%', borderRadius:20, height:40, justifyContent:'center', alignItems:'center', width:'40%', marginHorizontal:'30%'}}>
                    <Text style={{color:'white', fontSize:18, fontFamily:'normal-font'}}>
                        Trimite Mail
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity  onPress={this.handleAnuleazaAcceptata} style={{backgroundColor:'#2a6049', marginTop:'3%', borderRadius:20, height:40, justifyContent:'center', alignItems:'center', width:'40%', marginHorizontal:'30%'}}>
                    <Text style={{color:'white', fontSize:18, fontFamily:'normal-font'}}>
                        Anuleaza
                    </Text>
                </TouchableOpacity>
                </View>
            </View>
          </Modal>
          <Modal  animationType="slide"
                    visible={this.state.isModalRefusedEmail}
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
                  <Text style={{fontSize:18, color:"#2a6049", fontFamily:'bold-font', textAlign:'center', marginVertical:'5%'}}>Raspuns programare refuzata</Text>
                  <View style={{backgroundColor:'#2a6049', flexDirection:'row', borderRadius:20, alignItems:'center', height:50, width:'90%', marginTop:'3%', marginHorizontal:'5%'}}>
                      <TextInput
                          placeholder="Subiect"
                          placeholderTextColor='white'
                          autoCapitalize="none"
                          style={styles.textInput}
                          onChangeText={subiect => this.setState({ subiect })}
                          value={this.state.subiect}
                      />
                  </View>
                  <View style={{backgroundColor:'#2a6049', flexDirection:'row', borderRadius:20, alignItems:'center', height:150, width:'90%', marginTop:'3%', marginHorizontal:'5%'}}>
                      <TextInput
                          placeholder="Mesaj..."
                          placeholderTextColor='white'
                          autoCapitalize="none"
                          numberOfLines={4}
                          multiline={true}
                          style={styles.textInput}
                          onChangeText={mesaj => this.setState({ mesaj })}
                          value={this.state.mesaj}
                      />
                  </View>
                  <TouchableOpacity  onPress={this.handleEmailRefuzat} style={{backgroundColor:'#2a6049', marginTop:'5%', borderRadius:20, height:40, justifyContent:'center', alignItems:'center', width:'40%', marginHorizontal:'30%'}}>
                    <Text style={{color:'white', fontSize:18, fontFamily:'normal-font'}}>
                        Trimite Mail
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity  onPress={this.handleAnuleazaRespins} style={{backgroundColor:'#2a6049', marginTop:'3%', borderRadius:20, height:40, justifyContent:'center', alignItems:'center', width:'40%', marginHorizontal:'30%'}}>
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

            { this.state.programari.length === 0 ?

                <View style={{alignItems:'center'}}>
                  <Text style={{color:'gray'}}>Nu exista programari in asteptare momentan.</Text>
                  <MaterialCommunityIcons  name={'cancel'} size={30} color={'gray'}/>
                </View>

                :

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
                                <TouchableOpacity onPress={()=>this.handlerRespinge('/programari' + '/' + item.numeDoctor.replace(/\./g,"") + '/' + item.data, item.ora, item.email)}>
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

