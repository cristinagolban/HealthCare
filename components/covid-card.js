import React from 'react';
import {
    Dimensions,
    View,
    Text,
    TouchableOpacity,
    Image
} from 'react-native';

export default class CovidCard extends React.Component{


        // #roPaths = {
        //     flagPath: require('../assets/RomaniaFlag.png'),
        //     shapePath: require('../assets/RomaniaShape.png')
        // }


        render(){
            return(
                <View style={{backgroundColor:"#2a6049",borderRadius:20,width:'90%', height:120, marginVertical:'3%', flexDirection:'column', overflow:'hidden'}}>
                    <View style={{flex:0.4, flexDirection:'row', alignItems:'center',marginTop:'2%'}}>
                        <View style={{flex:0.7, flexDirection:'row',alignItems:'center'}}>
                            <Image source={this.props.flagPath} resizeMode='center' style={{width:Dimensions.get('screen').width/13,marginLeft:'5%'}}/>
                            <Text style={{fontSize:22,fontFamily:'bold-font', color:'white',marginLeft:'2%'}}>{this.props.countryName}</Text>
                        </View>
                        <View style={{flex:0.3}}>
                            <Image source={this.props.shapePath} resizeMode='center' style={{width:Dimensions.get('screen').width/9,marginLeft:'35%'}} tintColor='white'/>
                        </View>
                    </View>
                    <View style={{flex:0.6, flexDirection:'row', justifyContent:'space-around',marginTop:'2%'}}>
                        <View style={{flexDirection:'column', alignItems:'center'}}>
                            <Text style={{fontSize:18,fontFamily:'bold-font', color:'white'}}>{this.props.totalCases}</Text>
                            <Text style={{fontSize:12,fontFamily:'normal-font', color:'white'}}>Total cazuri</Text>
                        </View>
                        <View style={{flexDirection:'column', alignItems:'center'}}>
                            <Text style={{fontSize:18,fontFamily:'bold-font', color:'white'}}>{this.props.recoveredCases}</Text>
                            <Text style={{fontSize:12,fontFamily:'normal-font', color:'white'}}>S-au vindecat</Text>
                        </View>
                        <View style={{flexDirection:'column', alignItems:'center'}}>
                            <Text style={{fontSize:18,fontFamily:'bold-font', color:'white'}}>{this.props.newCases}</Text>
                            <Text style={{fontSize:12,fontFamily:'normal-font', color:'white'}}>Cazuri Noi</Text>
                        </View>
                    </View>
                </View>
            )
        }
}