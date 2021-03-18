import React from 'react';
import {Text, TouchableOpacity, View } from 'react-native';
 
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import { NavigationContainer } from '@react-navigation/native';

import SignUp from '../screens/SignUp';
import Login from '../screens/Login';

import HomeUser from '../screens/User/HomeUser';
import Programeaza from '../screens/User/Programeaza';
import ListaProgramari from '../screens/User/ListaProgramari';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import IonIcons from 'react-native-vector-icons/Ionicons';

const Tab = createMaterialBottomTabNavigator();

function BottomTabNavigatorUser(){
    return(
        <Tab.Navigator  initialRouteName="Acasa"
                        activeColor='white'
                        barStyle={{ backgroundColor:"#2a6049",
                                    borderTopLeftRadius: 20,
                                    borderTopRightRadius: 20,
                                    overflow: 'hidden',
                                    
                        }}
                        shifting={true}
        >
            <Tab.Screen name='Acasa'  component={HomeUser} options={{   
                                                                        tabBarIcon: ({color}) => (
                                                                          <MaterialCommunityIcons  name={'home'} color={color} size={25}/>
                                                                        ),
                                                                        tabBarLabel: <Text style={{fontWeight:'bold', fontSize:14}}>Acasa</Text>
                                                                        
                                                                    }}/>
            <Tab.Screen name='Programeaza'  component={Programeaza} options={{ 
                                                                        tabBarIcon: ({color}) => (
                                                                          <MaterialCommunityIcons  name={'calendar-arrow-right'} color={color} size={25}/>
                                                                        ),
                                                                        tabBarLabel: <Text style={{fontWeight:'bold', fontSize:14}}>Programeaza</Text>
                                                                        
                                                                    }}/>
            <Tab.Screen name='ListaProgramari'  component={ListaProgramari} options={{ 
                                                                        tabBarIcon: ({color}) => (
                                                                          <MaterialCommunityIcons  name={'format-list-text'} color={color} size={25}/>
                                                                        ),
                                                                        tabBarLabel: <Text style={{fontWeight:'bold', fontSize:14}}>Programari</Text>
                                                                        
                                                                    }}/>
        </Tab.Navigator>
    )
}


const Stack = createStackNavigator();
 
function MyStack() {
    return (
      <NavigationContainer  independent={true}>
        <Stack.Navigator >
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="User"
                        component={BottomTabNavigatorUser}
                        options={ ({ navigation, route }) => ({ 
                            headerTransparent:true,
                            headerBackground: () => (
                                                <View style={{backgroundColor:'white',height:50}} >
                                                </View>
                            ),
                            headerTitle: () => (
                                  <View style={{flexDirection:'row', alignContent:'center', justifyContent:'center'}}>
                                    {/* <MaterialCommunityIcons  name={'account'} color="white" size={25}/> */}
                                    <Text style={{fontWeight:'bold', textAlign:'center', fontSize:20, color:"white"}}></Text>
                                  </View>
                            ),
                            headerRight: () => (
                                    <TouchableOpacity  onPress={ () => navigation.navigate('SignUp')}>
                                        <View style={{padding:6, backgroundColor:"#2a6049", borderTopLeftRadius:20,alignItems:'center'}}>
                                        <MaterialCommunityIcons  name={'logout-variant'} color="white" size={30}/>
                                        </View>
                                    </TouchableOpacity>
                                    
                            ),
                            headerLeft: () =>(
                              <View></View>
                            )
                        })} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
 
  export default MyStack;