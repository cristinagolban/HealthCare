import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';

import SignUp from '../screens/SignUp';
import HomeUser from '../screens/User/HomeUser';
import Programeaza from '../screens/User/Programeaza';

import MyStack from './routes.js';

const Tab = createMaterialBottomTabNavigator();

export default function BottomTabNavigatorUser(){
    return(
        <Tab.Navigator initialRouteName="Programeaza">
            <Tab.Screen name='Programeaza' component={Programeaza} />
            <Tab.Screen name='Logout' component={MyStack} />
        </Tab.Navigator>
    )
}