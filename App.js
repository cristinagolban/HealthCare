import React from 'react'
 
// import the different screens
import * as firebase from "firebase";
 
// Optionally import the services that you want to use
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import "firebase/functions";
import "firebase/storage";
 
// Initialize Firebase
  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  var firebaseConfig = {
    apiKey: "AIzaSyAw6PCRrYCBPo_hfk7BBfP94eZv56POqP4",
    authDomain: "healthcarefinal-7d670.firebaseapp.com",
    projectId: "healthcarefinal-7d670",
    storageBucket: "healthcarefinal-7d670.appspot.com",
    messagingSenderId: "734701130061",
    appId: "1:734701130061:web:80512fb119d7ab7ecae704",
    measurementId: "G-KD0VV5LBRQ"
  };
  // Initialize Firebase
 
  import { LogBox } from 'react-native';
  LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
  LogBox.ignoreAllLogs();//Ignore all log notifications
 
  //Imports for the fonts 
  import * as Font from 'expo-font';
  import  AppLoading from 'expo-app-loading';
 
  import MyStack from './routes/routes.js';

  const customFonts = {
    'normal-font': require('./fonts/Helvetica-Normal.ttf'),
    'light-font': require('./fonts/Helvetica-Light.ttf'),
    'bold-font': require('./fonts/Helvetica-Bold.ttf')
  };

  export default class App extends React.Component{

    constructor(){
  
      super();
  
      this.state = {
        fontsLoaded: false
      }
    }
  
    async _loadFontsAsync(){
      await Font.loadAsync(customFonts);
      this.setState({fontsLoaded:true})
    }
  
    async componentDidMount(){
      this._loadFontsAsync();
      firebase.initializeApp(firebaseConfig);
    }
  
    render(){
        if(this.state.fontsLoaded){
            return(
              <MyStack />
            )
        }else{
            return <AppLoading/>
        }  
    }
  
  }