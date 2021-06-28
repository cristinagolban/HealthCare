import React from 'react'
import { RefreshControl, StyleSheet, Text, ScrollView, View, StatusBar, TouchableOpacity, Alert } from 'react-native'
import * as firebase from "firebase";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Print from 'expo-print';
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";

import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications
export default class Consultatii extends React.Component {

    constructor(){
        super();

        this.bla=this.againFindProgramari.bind(this);

        this.state={
            programari: [],
            refresh: false,
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

    var admin = firebase;
    var db = admin.database();
    var refPath = '/istoric';
    var ref = db.ref(refPath);
    
    var emailAuth = this.state.emailFromUser;

    ref.once("value")
      .then((snapshot) => {

        var objectArrayTemp = [];
        var nameTemp = '';
        var prenumeTemp = '';
        var statusTemp = '';
        var oraTemp = '';
        var doctorTemp = '';
        var dataTemp = '';
        var raportMedicalTemp = '';

        snapshot.forEach((childSnapshot) => {
            childSnapshot.forEach((childChild1) => {
                childChild1.forEach((childChild2) => {
                    if( emailAuth === childChild2.val().email ){         
                        var objectTemp={
                            nume: '',
                            prenume: '',
                            status: '',
                            ora: '',
                            doctor: '',
                            data: '',
                            raportMedical: '',
                        }
                        
                        nameTemp = childChild2.val().nume;
                        prenumeTemp = childChild2.val().prenume;
                        statusTemp = childChild2.val().status;
                        oraTemp = childChild2.key;
                        doctorTemp = childSnapshot.key;
                        dataTemp = childChild1.key
                        raportMedicalTemp = childChild2.val().raportMedical

                        objectTemp.nume = nameTemp;
                        objectTemp.prenume = prenumeTemp;
                        objectTemp.status = statusTemp;
                        objectTemp.ora = oraTemp;
                        objectTemp.doctor = doctorTemp;
                        objectTemp.data = dataTemp;
                        objectTemp.raportMedical = raportMedicalTemp;

                        objectArrayTemp.push(objectTemp);
                    }
                })
            })
      });
      this.setState({programari:objectArrayTemp})
    }).catch(function(error) {
      console.log('There has been a problem with your fetch operation: ' + error.message);
    });
  }

  againFindProgramari = async() =>{

    try {
        const value = await AsyncStorage.getItem('email')
        if(value !== null) {
          this.setState({emailFromUser:value})
        }
      } catch(e) {
        // error reading value
      }

    var admin = firebase;
    var db = admin.database();
    var refPath = '/istoric';
    var ref = db.ref(refPath);
    
    var emailAuth = this.state.emailFromUser;

    ref.once("value")
      .then((snapshot) => {

        
        var objectArrayTemp = [];
        var nameTemp = '';
        var prenumeTemp = '';
        var statusTemp = '';
        var oraTemp = '';
        var doctorTemp = '';
        var dataTemp = '';
        var raportMedicalTemp = '';

        snapshot.forEach((childSnapshot) => {
            childSnapshot.forEach((childChild1) => {
                childChild1.forEach((childChild2) => {
                    if( emailAuth === childChild2.val().email ){         
                        var objectTemp={
                            nume: '',
                            prenume: '',
                            status: '',
                            ora: '',
                            doctor: '',
                            data: '',
                            raportMedical: '',
                        }

                        nameTemp = childChild2.val().nume;
                        prenumeTemp = childChild2.val().prenume;
                        statusTemp = childChild2.val().status;
                        oraTemp = childChild2.key;
                        doctorTemp = childSnapshot.key;
                        dataTemp = childChild1.key;
                        raportMedicalTemp = childChild2.val().raportMedical;

                        objectTemp.nume = nameTemp;
                        objectTemp.prenume = prenumeTemp;
                        objectTemp.status = statusTemp;
                        objectTemp.ora = oraTemp;
                        objectTemp.doctor = doctorTemp;
                        objectTemp.data = dataTemp;
                        objectTemp.raportMedical = raportMedicalTemp;

                        objectArrayTemp.push(objectTemp);
                    }
                })
            })
      });
      this.setState({programari:objectArrayTemp})
    }).catch(function(error) {
      console.log('There has been a problem with your fetch operation: ' + error.message);
    });
  }

  onRefresh(){
    this.setState({refresh: true});
    this.againFindProgramari(); 
    this.setState({refresh:false});
  }

changePDF = async ( raportul, doctor, nume, prenume ) =>{
  
let htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pdf Content</title>
    <style>
        body {
            font-size: 16px;
            color: rgb(42, 96, 73);
        }
        h1 {
            text-align: center;
            font-size: 32px;
        }
        h4 {
           text-align: center;
           font-size: 24px;
           margin-top:200px;
        }
    </style>
</head>
<body>
    <h1>HealthCare Raport Medical</h1>
    <h2>Raportul medical a fost emis pe numele:</h2>
    <h3 style="margin-left: 20px">`+nume+` `+prenume+`</h3>
    <h2>Doctorul dumneavostra:</h2>
    <h3 style="margin-left: 20px">`+doctor+`</h3>
    <h2>Raportul medical:</h2>
    <h3 style="margin-left: 20px">`+raportul+`</h3>
    <h4>Va multumim ca ati ales HealthCare!</h4>
</body>
</html>
`;
  this.createPDF(htmlContent)
}
  
createPDF = async ( html ) => {
  try {
    const { uri } = await Print.printToFileAsync({ html });
    if (Platform.OS === "ios") {
      await Sharing.shareAsync(uri);
    } else {
      const permission = await MediaLibrary.requestPermissionsAsync();
      if (permission.granted) {
        await MediaLibrary.createAssetAsync(uri);
      }
    }
    Alert.alert("Finalizat!","Raportul medical a fost salvat cu succes!")
  } catch (error) {
    console.error(error);
  }
};

  render(){

    return(
      <View style={{flex:1,backgroundColor:'white',marginTop:50}}>
      <StatusBar barStyle = "dark-content" backgroundColor = 'white'/>

      <ScrollView style={{flex:1,backgroundColor:'white',marginTop:'5%'}} 
                refreshControl={
                    <RefreshControl
                    refreshing={this.state.refresh}
                    onRefresh={this.onRefresh.bind(this)}
                    />
                }
        >
          <Text style={{fontSize:20, fontFamily:'bold-font', textAlign:'center'}}>Consultatiile Mele</Text>
        {this.state.programari.length === 0 ?

            <View style={{alignItems:'center'}}>
              <Text style={{color:'gray', textAlign:'center', marginHorizontal:'5%'}}>Nu exista nicio consultatie sau programarile tale nu au fost consultate de catre doctor.</Text>
              <MaterialCommunityIcons  name={'cancel'} size={30} color={'gray'}/>
            </View>

            :

            this.state.programari.map( item =>
                 <View style={{flexDirection:'row', marginHorizontal:'5%', backgroundColor:'#fafafa',height:170, width:'90%', borderRadius:20, alignItems:'center', marginVertical:'2%', overflow:'hidden'}}>
                    <View style={ (item.status === 'In asteptare' ? styles.barStyleAwait : styles.barStyleAccept)}></View>
                    <View style={{width:'100%', height: 170}}>
                      <View style={{position:'absolute', top: 10, left: 10}}>
                        <Text style={styles.textStyleName}>{item.nume} {item.prenume}</Text>
                      </View>
                      <View style={{position:'absolute', top: 10, right: 20}}>
                        <Text style={ (item.status === 'In asteptare' ? styles.textStyleAwait : styles.textStyleAccept) }>{item.status}</Text>  
                      </View>
                      <View style={{position:'absolute', top: 50, left: 10, flexDirection:'row'}}>
                        <View>
                          <Text style={{fontSize:10, fontFamily: 'normal-font'}}>ORA</Text>
                          <Text style={styles.textStyleName2}>{item.ora}</Text>
                        </View>
                        <View style={{marginLeft:'10%'}}>
                          <Text style={{fontSize:10, fontFamily: 'normal-font'}}>DOCTORUL</Text>
                          <Text style={styles.textStyleName2}>{item.doctor}</Text>
                        </View>
                        <View style={{marginLeft:'10%'}}>
                          <Text style={{fontSize:10, fontFamily: 'normal-font'}}>DATA</Text>
                          <Text style={styles.textStyleName2}>{item.data}</Text>
                        </View>
                      </View>
                      <View style={{position:'absolute', top: 110, left: 10, flexDirection:'row'}}>
                        <View style={{width:'100%',height:'100%', justifyContent:'center', alignItems:'center'}}>
                            <TouchableOpacity onPress={()=>this.changePDF(item.raportMedical, item.doctor, item.nume, item.prenume)} style={{width:'50%', height:30,  borderRadius:5,backgroundColor:"#2a6049", justifyContent:'center', alignItems:'center',overflow:'hidden'}}>
                                  <Text style={{fontFamily:'normal-font', color:'white', fontSize:16}}>Descarca Raportul</Text>
                            </TouchableOpacity>
                        </View>
                       </View>
                    </View>
                </View>    
            )
        }
      </ScrollView>
      </View>
    )
  }

}

const styles = StyleSheet.create({
    textStyleName:{
        fontSize:18,
        fontFamily:'normal-font',
        color:'black'
    },
    textStyleName2:{
      fontSize:16,
      fontFamily:'normal-font',
      color:'black'
    },
    textStyleName3:{
        fontSize:12,
        fontFamily:'normal-font',
        color:'black',
        marginRight:'1%'
    },
    textStyleAwait:{
        fontSize:14,
        fontFamily:'bold-font',
        color:'red'
    },
    textStyleAccept:{
        fontSize:14,
        fontFamily:'bold-font',
        color:'green'
    },
    barStyleAccept:{
      flexDirection:'column', 
      height:170,
      width:7, 
      backgroundColor:"green", 
      borderTopLeftRadius:20, 
      borderBottomLeftRadius: 50, 
      overflow:'hidden'
    },
    barStyleAwait:{
      flexDirection:'column', 
      height:170,
      width:7, 
      backgroundColor:"red", 
      borderTopLeftRadius:20, 
      borderBottomLeftRadius: 50, 
      overflow:'hidden'
    }
})

