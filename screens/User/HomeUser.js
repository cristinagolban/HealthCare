import React, { Component } from "react";
import {View, Text} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 


export default class HomeUser extends React.Component {

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
      <View style={{flex:1}}>
        <Text>{this.state.emailFromUser}</Text>

      </View>
    )
  }

}
