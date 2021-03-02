import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
 
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import { NavigationContainer } from '@react-navigation/native';

import SignUp from '../screens/SignUp';
import Login from '../screens/Login';

import HomeUser from '../screens/User/HomeUser';
import Programeaza from '../screens/User/Programeaza';

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
        </Tab.Navigator>
    )
}


const Stack = createStackNavigator();
 
function MyStack() {
    return (
      <NavigationContainer independent={true}>
        <Stack.Navigator>
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="User"
                        component={BottomTabNavigatorUser}
                        options={ ({ navigation, route }) => ({ 
                            headerStyle: {backgroundColor:"#2a6049"},
                            headerTitle: () => (
                                  <View style={{flexDirection:'row', alignContent:'center', justifyContent:'center'}}>
                                    <MaterialCommunityIcons  name={'account'} color="white" size={25}/>
                                    <Text style={{fontWeight:'bold', textAlign:'center', fontSize:20, color:"white"}}>{route.name}</Text>
                                  </View>
                            ),
                            headerRight: () => (
                                    <TouchableOpacity  onPress={ () => navigation.navigate('SignUp')}>
                                        <View style={{flexDirection:'row', alignContent:'center', justifyContent:'center', padding:5}}>
                                          <IonIcons  name={'log-out-outline'} color="white" size={28}/>
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