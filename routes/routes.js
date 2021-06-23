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
import DetaliiDoctori from '../screens/User/DetaliiDoctori';
import Consultatii  from '../screens/User/Consultatii';

import HomeAsistenta from '../screens/Asistenta/HomeAsistenta';

import HomeDoctor from '../screens/Doctor/HomeDoctor';
import IstoricDoctor from '../screens/Doctor/IstoricDoctor';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import IonIcons from 'react-native-vector-icons/Ionicons';

const Tab = createMaterialBottomTabNavigator();
const Tab3 = createMaterialBottomTabNavigator();

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
                                                                        tabBarLabel: <Text style={{fontWeight:'bold', fontSize:12}}>Acasa</Text>
                                                                        
                                                                    }}/>
            <Tab.Screen name='Programeaza'  component={Programeaza} options={{ 
                                                                        tabBarIcon: ({color}) => (
                                                                          <MaterialCommunityIcons  name={'calendar-arrow-right'} color={color} size={25}/>
                                                                        ),
                                                                        tabBarLabel: <Text style={{fontWeight:'bold', fontSize:12}}>Programeaza</Text>
                                                                        
                                                                    }}/>
            <Tab.Screen name='ListaProgramari'  component={ListaProgramari} options={{ 
                                                                        tabBarIcon: ({color}) => (
                                                                          <MaterialCommunityIcons  name={'format-list-text'} color={color} size={25}/>
                                                                        ),
                                                                        tabBarLabel: <Text style={{fontWeight:'bold', fontSize:12}}>Programari</Text>
                                                                        
                                                                    }}/>
            <Tab.Screen name='DetaliiDoctori'  component={DetaliiDoctori} options={{ 
                                                        tabBarIcon: ({color}) => (
                                                          <MaterialCommunityIcons  name={'doctor'} color={color} size={25}/>
                                                        ),
                                                        tabBarLabel: <Text style={{fontWeight:'bold', fontSize:12}}>Doctori</Text>
                                                        
                                                    }}/>
            <Tab.Screen name='Consultatii'  component={Consultatii} options={{ 
                                                        tabBarIcon: ({color}) => (
                                                          <MaterialCommunityIcons  name={'file-chart'} color={color} size={25}/>
                                                        ),
                                                        tabBarLabel: <Text style={{fontWeight:'bold', fontSize:12}}>Consultatii</Text>
                                                        
                                                    }}/>                                                          
                                                              
        </Tab.Navigator>
    )
}

function BottomTabNavigatorDoctor(){
  return(
      <Tab3.Navigator  initialRouteName="DoctorProgramari"
                      activeColor='white'
                      barStyle={{ backgroundColor:"#2a6049",
                                  borderTopLeftRadius: 20,
                                  borderTopRightRadius: 20,
                                  overflow: 'hidden',
                                  
                      }}
                      shifting={true}
      >
          <Tab3.Screen name='DoctorProgramari'  component={HomeDoctor} options={{   
                                                                      tabBarIcon: ({color}) => (
                                                                        <MaterialCommunityIcons  name={'format-list-text'} color={color} size={25}/>
                                                                      ),
                                                                      tabBarLabel: <Text style={{fontWeight:'bold', fontSize:14}}>Programari</Text>
                                                                      
                                                                  }}/>
           <Tab3.Screen name='DoctorIstoric'  component={IstoricDoctor} options={{   
                                                                      tabBarIcon: ({color}) => (
                                                                        <MaterialCommunityIcons  name={'history'} color={color} size={25}/>
                                                                      ),
                                                                      tabBarLabel: <Text style={{fontWeight:'bold', fontSize:14}}>Istoric</Text>
                                                                      
                                                                  }}/>                                                       
          
                                                            
      </Tab3.Navigator>
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
          <Stack.Screen name="Asistenta"
                        component={HomeAsistenta}
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
          <Stack.Screen name="HomeDoctor" 
                        component={BottomTabNavigatorDoctor} 
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
                      })} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
 
  export default MyStack;