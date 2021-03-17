import React from 'react'
import { RefreshControl, StyleSheet, Text, ScrollView, View, FlatList } from 'react-native'
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

        snapshot.forEach((childSnapshot) => {
            childSnapshot.forEach((childChild1) => {
                childChild1.forEach((childChild2) => {
                    if( emailAuth === childChild2.val().email ){         
                        var objectTemp={
                            nume: '',
                            prenume: '',
                            status: '',
                        }

                        nameTemp = childChild2.val().nume;
                        prenumeTemp = childChild2.val().prenume;
                        statusTemp = childChild2.val().status;


                        objectTemp.nume = nameTemp;
                        objectTemp.prenume = prenumeTemp;
                        objectTemp.status = statusTemp;

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

        snapshot.forEach((childSnapshot) => {
            childSnapshot.forEach((childChild1) => {
                childChild1.forEach((childChild2) => {
                    if( emailAuth === childChild2.val().email ){         
                        var objectTemp={
                            nume: '',
                            prenume: '',
                            status: '',
                        }

                        nameTemp = childChild2.val().nume;
                        prenumeTemp = childChild2.val().prenume;
                        statusTemp = childChild2.val().status;


                        objectTemp.nume = nameTemp;
                        objectTemp.prenume = prenumeTemp;
                        objectTemp.status = statusTemp;

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
      <ScrollView style={{flex:1}} 
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
                 <View style={{flexDirection:'row', justifyContent:'space-around', marginHorizontal:'2%', backgroundColor:'#fafafa',height:40, borderRadius:30, alignItems:'center', marginVertical:'2%'}}>
                    <Text style={styles.textStyleName}>{item.nume}</Text>
                    <Text style={styles.textStyleName}>{item.prenume}</Text>
                    <Text style={ (item.status === 'In asteptare' ? styles.textStyleAwait : styles.textStyleAccept) }>{item.status}</Text>  
                </View>    
            )
        }
      </ScrollView>
    )
  }

}

const styles = StyleSheet.create({
    textStyleName:{
        fontSize:14,
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
        fontFamily:'normal-font',
        color:'green'
    }
})

