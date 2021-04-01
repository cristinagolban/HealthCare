import React, { Component } from "react";
import {View, Text, ScrollView, RefreshControl,StatusBar} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CovidCard from '../../components/covid-card'; 


export default class HomeAsistenta extends React.Component {

  constructor(){
    super()

    this.state={
      emailFromUser: '',
      
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
    
  }


  render(){

    return(
      <View style={{flex:1,backgroundColor:'white',marginTop:50}}>
        <StatusBar barStyle = "dark-content" backgroundColor = 'white'/>
        <View style={{backgroundColor:"white",width:'100%' ,borderBottomLeftRadius:20,borderBottomRightRadius:20}}>
        <View style={{backgroundColor:"white",width:'90%',marginHorizontal:'5%', borderBottomLeftRadius:20,borderBottomRightRadius:20}}>
            <Text style={{fontSize:16, fontFamily:'normal-font',color:"#2a6049", marginBottom:'2%', marginLeft:'0.5%'}}>Bine ai venit</Text>
            <Text style={{fontSize:30, fontFamily:'bold-font',color:"#2a6049"}}>Date COVID-19 Europa</Text>
          </View>
        </View>
        
      </View>
    )
  }

}
