import React from 'react'
import { RefreshControl, StyleSheet, Text, ScrollView, View, StatusBar } from 'react-native'
import * as firebase from "firebase";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

export default class ListaProgramari extends React.Component {


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
    var refPath = '/programari';
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
                        }
                        
                        nameTemp = childChild2.val().nume;
                        prenumeTemp = childChild2.val().prenume;
                        statusTemp = childChild2.val().status;
                        oraTemp = childChild2.key;
                        doctorTemp = childSnapshot.key;
                        dataTemp = childChild1.key

                        objectTemp.nume = nameTemp;
                        objectTemp.prenume = prenumeTemp;
                        objectTemp.status = statusTemp;
                        objectTemp.ora = oraTemp;
                        objectTemp.doctor = doctorTemp;
                        objectTemp.data = dataTemp;

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
    var refPath = '/programari';
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
                            data: ''
                        }

                        nameTemp = childChild2.val().nume;
                        prenumeTemp = childChild2.val().prenume;
                        statusTemp = childChild2.val().status;
                        oraTemp = childChild2.key;
                        doctorTemp = childSnapshot.key;
                        dataTemp = childChild1.key;

                        objectTemp.nume = nameTemp;
                        objectTemp.prenume = prenumeTemp;
                        objectTemp.status = statusTemp;
                        objectTemp.ora = oraTemp;
                        objectTemp.doctor = doctorTemp;
                        objectTemp.data = dataTemp;

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
          <Text style={{fontSize:20, fontFamily:'bold-font', textAlign:'center'}}>Programarile Mele</Text>
        {
            this.state.programari.map( item =>
                 <View style={{flexDirection:'row', marginHorizontal:'5%', backgroundColor:'#fafafa',height:120, width:'90%', borderRadius:20, alignItems:'center', marginVertical:'2%', overflow:'hidden'}}>
                    <View style={ (item.status === 'In asteptare' ? styles.barStyleAwait : styles.barStyleAccept)}></View>
                    <View style={{width:'100%', height: 120}}>
                      <View style={{position:'absolute', top: 20, left: 10}}>
                        <Text style={styles.textStyleName}>{item.nume} {item.prenume}</Text>
                      </View>
                      <View style={{position:'absolute', top: 20, right: 20}}>
                        <Text style={ (item.status === 'In asteptare' ? styles.textStyleAwait : styles.textStyleAccept) }>{item.status}</Text>  
                      </View>
                      <View style={{position:'absolute', top: 60, left: 10, flexDirection:'row'}}>
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
      height:150,
      width:7, 
      backgroundColor:"green", 
      borderTopLeftRadius:20, 
      borderBottomLeftRadius: 50, 
      overflow:'hidden'
    },
    barStyleAwait:{
      flexDirection:'column', 
      height:150,
      width:7, 
      backgroundColor:"red", 
      borderTopLeftRadius:20, 
      borderBottomLeftRadius: 50, 
      overflow:'hidden'
    }
})

