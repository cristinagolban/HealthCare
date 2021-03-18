import React, { Component } from "react";
import {View, Text, Button, ScrollView, Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CovidCard from '../../components/covid-card'; 


export default class HomeUser extends React.Component {

  constructor(){
    super()

    this.state={
      emailFromUser: '',
      romania: {
        country: '',
        new: '',
        total: '',
        recovered: '',
      },
      germania: {
        country: '',
        new: '',
        total: '',
        recovered: '',
      },
      spania: {
        country: '',
        new: '',
        total: '',
        recovered: '',
      },
      italia: {
        country: '',
        new: '',
        total: '',
        recovered: '',
      },
      franta: {
        country: '',
        new: '',
        total: '',
        recovered: '',
      },
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
    this.getDataForEachCountry();
  }

  getDataForEachCountry = () => {
    /* ROMANIA */
    fetch("https://covid-193.p.rapidapi.com/statistics?country=romania", {
                                                                            "method": "GET",
                                                                            "headers":{
                                                                                        "x-rapidapi-key": "baf44d4290msh54dc398cb97add8p194c17jsn9aab1e258a32",
                                                                                        "x-rapidapi-host": "covid-193.p.rapidapi.com"
                                                                                      }
                                                                          }
          ).then( 
                  (response) => response.json()
                ).then( (responseData) => this.setState({ romania:{ country:  responseData.response[0].country, 
                                                                    new:responseData.response[0].cases.new,
                                                                    total:responseData.response[0].cases.total,
                                                                    recovered:responseData.response[0].cases.recovered
                                                                  }
                                                        })
                      )

    /* GERMANIA */
     fetch("https://covid-193.p.rapidapi.com/statistics?country=germany", {
                                                                            "method": "GET",
                                                                            "headers":{
                                                                                        "x-rapidapi-key": "baf44d4290msh54dc398cb97add8p194c17jsn9aab1e258a32",
                                                                                        "x-rapidapi-host": "covid-193.p.rapidapi.com"
                                                                                      }
                                                                          }
          ).then( 
                  (response) => response.json()
                ).then( (responseData) => this.setState({ germania:{  country:responseData.response[0].country, 
                                                                      new:responseData.response[0].cases.new,
                                                                      total:responseData.response[0].cases.total,
                                                                      recovered:responseData.response[0].cases.recovered
                                                                  }
                                                        })
                )

      /* SPANIA */
     fetch("https://covid-193.p.rapidapi.com/statistics?country=spain", {
                                                                            "method": "GET",
                                                                            "headers":{
                                                                                        "x-rapidapi-key": "baf44d4290msh54dc398cb97add8p194c17jsn9aab1e258a32",
                                                                                        "x-rapidapi-host": "covid-193.p.rapidapi.com"
                                                                                      }
                                                                          }
          ).then( 
                  (response) => response.json()
                ).then( (responseData) => this.setState({ spania:{  country:responseData.response[0].country, 
                                                                      new:responseData.response[0].cases.new,
                                                                      total:responseData.response[0].cases.total,
                                                                      recovered:responseData.response[0].cases.recovered
                                                                  }
                                                        })
                )

    /* ITALIA */
     fetch("https://covid-193.p.rapidapi.com/statistics?country=italy", {
                                                                            "method": "GET",
                                                                            "headers":{
                                                                                        "x-rapidapi-key": "baf44d4290msh54dc398cb97add8p194c17jsn9aab1e258a32",
                                                                                        "x-rapidapi-host": "covid-193.p.rapidapi.com"
                                                                                      }
                                                                          }
          ).then( 
                  (response) => response.json()
                ).then( (responseData) => this.setState({ italia:{  country:responseData.response[0].country, 
                                                                      new:responseData.response[0].cases.new,
                                                                      total:responseData.response[0].cases.total,
                                                                      recovered:responseData.response[0].cases.recovered
                                                                  }
                                                        })
                )

      /* FRANTA */
     fetch("https://covid-193.p.rapidapi.com/statistics?country=france", {
                                                                            "method": "GET",
                                                                            "headers":{
                                                                                        "x-rapidapi-key": "baf44d4290msh54dc398cb97add8p194c17jsn9aab1e258a32",
                                                                                        "x-rapidapi-host": "covid-193.p.rapidapi.com"
                                                                                      }
                                                                          }
          ).then( 
                  (response) => response.json()
                ).then( (responseData) => this.setState({ franta:{  country:responseData.response[0].country, 
                                                                      new:responseData.response[0].cases.new,
                                                                      total:responseData.response[0].cases.total,
                                                                      recovered:responseData.response[0].cases.recovered
                                                                  }
                                                        })
                )
  
}

  render(){

    return(
      <View style={{flex:1,backgroundColor:'white',marginTop:80}}>
        <ScrollView contentContainerStyle={{alignItems:'center'}}>
        <View style={{backgroundColor:"white",width:'100%' ,borderBottomLeftRadius:20,borderBottomRightRadius:20}}>
        <View style={{backgroundColor:"white",width:'90%',marginHorizontal:'5%', borderBottomLeftRadius:20,borderBottomRightRadius:20}}>
            <Text style={{fontSize:16, fontFamily:'normal-font',color:"#2a6049"}}>Bine ai venit</Text>
            <Text style={{fontSize:30, fontFamily:'bold-font',color:"#2a6049"}}>Date COVID-19 Europa</Text>
          </View>
          </View>
        <CovidCard  countryName={this.state.romania.country} 
                    flagPath={require('../../assets/RomaniaFlag.png')} 
                    shapePath={require('../../assets/RomaniaShape.png')}
                    newCases={this.state.romania.new}
                    totalCases={this.state.romania.total}
                    recoveredCases={this.state.romania.recovered}
        />
        <CovidCard  countryName={'Germania'} 
                    flagPath={require('../../assets/GermaniaFlag.png')} 
                    shapePath={require('../../assets/GermaniaShape.png')}
                    newCases={this.state.germania.new}
                    totalCases={this.state.germania.total}
                    recoveredCases={this.state.germania.recovered}
        />
        <CovidCard  countryName={'Spania'} 
                    flagPath={require('../../assets/SpaniaFlag.png')} 
                    shapePath={require('../../assets/SpaniaShape.png')}
                    newCases={this.state.spania.new}
                    totalCases={this.state.spania.total}
                    recoveredCases={this.state.spania.recovered}
        />
        <CovidCard  countryName={'Italia'} 
                    flagPath={require('../../assets/ItaliaFlag.png')} 
                    shapePath={require('../../assets/ItaliaShape.png')}
                    newCases={this.state.italia.new}
                    totalCases={this.state.italia.total}
                    recoveredCases={this.state.italia.recovered}
        />
        <CovidCard  countryName={'Franta'} 
                    flagPath={require('../../assets/FrantaFlag.png')} 
                    shapePath={require('../../assets/FrantaShape.png')}
                    newCases={this.state.franta.new}
                    totalCases={this.state.franta.total}
                    recoveredCases={this.state.franta.recovered}
        />
         
        </ScrollView>
      </View>
    )
  }

}
