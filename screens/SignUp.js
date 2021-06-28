import React from 'react'
import { StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native'
import * as firebase from "firebase";
 
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications

export default class SignUp extends React.Component {
  
  state = { email: '', password: '', errorMessage: null, fPassword: '' }
  
  handleSignUp = () => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => this.props.navigation.navigate('Login'))
      .catch(error => this.setState({ errorMessage: error.message }))
  }
 
render() {
    return (
      <View style={styles.container}>
        <Text style={{color:'#2a6049', fontFamily:'bold-font', fontSize:30, marginBottom:'5%'}}>Sign Up</Text>
        {this.state.errorMessage &&
            <Text style={{  color: 'red', 
                            fontSize:16, 
                            textAlign:'center', 
                            fontFamily:'bold-font'
                        }}
            >
                    {this.state.errorMessage}
            </Text>
        }
        <View style={{backgroundColor:'#2a6049', flexDirection:'row', borderRadius:20, alignItems:'center', height:50, width:'85%'}}>
            <TextInput
                placeholder="Email"
                placeholderTextColor='white'
                autoCapitalize="none"
                style={styles.textInput}
                onChangeText={email => this.setState({ email })}
                value={this.state.email}
            />
        </View>
        <View style={{backgroundColor:'#2a6049', flexDirection:'row', borderRadius:20, alignItems:'center', height:50, width:'85%', marginTop:'3%'}}>
            <TextInput
                secureTextEntry
                placeholder="Password"
                placeholderTextColor='white'
                autoCapitalize="none"
                style={styles.textInput}
                onChangeText={password => this.setState({ password })}
                value={this.state.password}
            />
        </View>
 
        <TouchableOpacity  onPress={this.handleSignUp} style={{backgroundColor:'#2a6049', marginTop:'5%', borderRadius:20, height:40, justifyContent:'center', alignItems:'center', width:'35%'}}>
            <Text style={{color:'white', fontSize:18, fontFamily:'normal-font'}}>
                Sign Up
            </Text>
        </TouchableOpacity>
 
        <TouchableOpacity  onPress={() => this.props.navigation.navigate('Login')} style={{ marginTop:'5%', borderRadius:20, height:40,  width:'35%'}}>
            <Text style={{color:'black', fontSize:14, fontFamily:'normal-font', textAlign:'center'}}>
                Already have an account? <Text style={{color:"#2a6049", fontSize:14, fontFamily:'bold-font'}}>LOGIN</Text>
            </Text>
        </TouchableOpacity>

      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'white'
  },
  textInput: {
    color:'white',
    width:'90%',
    marginHorizontal:'5%',
    fontSize:16,
    fontFamily:'normal-font'
  }
})