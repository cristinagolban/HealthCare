import React from 'react'
import { StyleSheet, Text, TextInput, View, Button, Modal, TouchableOpacity, TouchableHighlightBase } from 'react-native'
import * as firebase from "firebase";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

var emailother = '';
var passwordother = '';
 
export default class Login extends React.Component {
 
  constructor(){
 
    super();
 
    this.state = {
      email: '',
      password: '',
      errorMessage: null,
      typeOfUser: '',
      isModalVisible: true,
      isUserFound: false,
      isPasswordFound: false,
    }
 
  }
 
  storeEmail = async() =>{
    try{
      await AsyncStorage.setItem('email', this.state.email)
    }catch(e){

    }
  }

  handleLogin = () => {
    console.log(this.state.typeOfUser);
    if(this.state.typeOfUser === 'doctor'){
      this.getDataFromDatabaseDoctor()
    }else if(this.state.typeOfUser === 'user'){
      this.getDataFromAuth()
    }else if(this.state.typeOfUser === 'asistenta'){
      this.getDataFromDatabaseAsistenta()
    }
  }
 
  getDataFromAuth = () =>{
    firebase
    .auth()
    .signInWithEmailAndPassword(this.state.email, this.state.password)
    .then(() => this.props.navigation.navigate('User'))
    .catch(error => this.setState({ errorMessage: error.message }))
    this.storeEmail();
  }
 
 
  getDataFromDatabaseDoctor = () =>{
    emailother = this.state.email;
    passwordother = this.state.password;
    firebase
    .database()
    .ref("/doctor")
    .once("value")
    .then((snapshot) => {
      snapshot.forEach((childSnapshot) => {
        if(childSnapshot.val().email===emailother && childSnapshot.val().password===passwordother)
        {
          this.props.navigation.navigate('Doctor')
        }
      
    });
  }).catch(function(error) {
    console.log('There has been a problem with your fetch operation: ' + error.message);
     // ADD THIS THROW error
      throw error;
    });;
  }
 


  getDataFromDatabaseAsistenta = () =>{
    emailother = this.state.email;
    passwordother = this.state.password;
    firebase
    .database()
    .ref("/asistenta")
    .once("value")
    .then((snapshot) => {
      snapshot.forEach((childSnapshot) => {
        if(childSnapshot.val().email===emailother && childSnapshot.val().password===passwordother)
        {
          this.props.navigation.navigate('Asistenta')
 
 
        }
      
    });
  }).catch(function(error) {
    console.log('There has been a problem with your fetch operation: ' + error.message);
     // ADD THIS THROW error
      throw error;
    });;
  }
 
  render() {
    return (
 
      <View style={styles.container}>
 
<Modal  animationType="slide"
                    visible={this.state.isModalVisible}
                    transparent = {true}
 
                    >
    <View style={{    flex: 1,
         justifyContent: "center",
         alignItems: "center",marginTop:25}}>
    <View style={{flex:0.85,
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
         elevation: 5}}>
     <Text style={{fontSize:24,textAlign:'center',fontWeight:'bold', marginTop:'5%'}} >Alege tipul de user</Text>
     <View style={{flexDirection:"column",alignItems:'center',justifyContent:"center",marginTop:'5%'}}>
              
      <TouchableOpacity onPress={()=>this.setState({isModalVisible:false, typeOfUser:'doctor'})} style={{marginTop:'5%',width:'75%'}}>
                    <View style={{alignItems:"center"}}>
                      <MaterialCommunityIcons  name={'doctor'} size={100}/>
                      <Text style={{fontSize:18,textAlign:'center',fontWeight:'bold'}} >Doctor</Text>
                    </View>
      </TouchableOpacity>
 
      <View style={{borderWidth:0.5, borderColor:'grey', width:'75%', marginVertical:"5%"}}></View>
 
      <TouchableOpacity onPress={()=>this.setState({isModalVisible:false, typeOfUser:'asistenta'})} >
                    <MaterialCommunityIcons  name={'mother-nurse'} size={100}/>
                    <Text style={{fontSize:18,textAlign:'center',fontWeight:'bold'}}>Asistent</Text>
      </TouchableOpacity>
 
      <View style={{borderWidth:0.5, borderColor:'grey', width:'75%', marginVertical:"5%"}}></View>
 
      <TouchableOpacity onPress={()=>this.setState({isModalVisible:false, typeOfUser:'user'})} >
                    <MaterialCommunityIcons  name={'account'} size={100}/>
                    <Text style={{fontSize:18,textAlign:'center',fontWeight:'bold'}}>User</Text>
      </TouchableOpacity>
            </View>
            </View>
          </View>
          </Modal>
 
        <Text>Login</Text>
        {this.state.errorMessage &&
          <Text style={{ color: 'red' }}>
            {this.state.errorMessage}
          </Text>}
        <TextInput
          style={styles.textInput}
          autoCapitalize="none"
          placeholder="Email"
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
        />
        <TextInput
          secureTextEntry
          style={styles.textInput}
          autoCapitalize="none"
          placeholder="Password"
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
        />
        <Button title="Login"
                onPress={this.handleLogin}
        />
        <Button
          title="Don't have an account? Sign Up"
          onPress={this.getDataFromDatabase}
        />
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'white',
  },
  textInput: {
    height: 40,
    width: '90%',
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 8
  }
})