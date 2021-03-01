import React from 'react'
 
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native'
import SignUp from '../screens/SignUp'
import Login from '../screens/Login'
import HomeUser from '../screens/User/HomeUser'
import Doctor from '../screens/Doctor'
import Asistenta from '../screens/Asistenta'
 
const Stack = createStackNavigator();
 
function MyStack() {
    return (
      <NavigationContainer independent={true}>
        <Stack.Navigator>
          <Stack.Screen name="SignUp" component={SignUp } />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="HomeUser" component={HomeUser} />
          <Stack.Screen name="Doctor" component={Doctor} />
          <Stack.Screen name="Asistenta" component={Asistenta} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
 
  export default MyStack;