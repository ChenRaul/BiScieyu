/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import Main from "./app/Main";
import {createStackNavigator, StackNavigator} from "react-navigation";
import Colors from "./app/utils/Colors";
import FontSizeUtils from "./app/utils/FontSizeUtils";
import AddDevice from "./app/AddDevice";
import DeviceMoreSetting from "./app/DeviceMoreSetting";
import TimeRangeSelect from "./app/TimeRangeSelect";
import ModifyPassword from "./app/ModifyPassword";
function randomPort() {
    return Math.random() * 60536 | 0 + 5000 // 60536-65536
}
function toByteArray(obj) {
    var uint = new Uint8Array(obj.length);
    for (var i = 0, l = obj.length; i < l; i++){
        uint[i] = obj.charCodeAt(i);
    }

    return new Uint8Array(uint);
}
function stringToBytes ( str ) {
    var ch, st, re = [];
    for (var i = 0; i < str.length; i++ ) {
        ch = str.charCodeAt(i);  // get char   
        st = [];                 // set up "stack"  
        do {
            st.push( ch & 0xFF );  // push byte to stack  
            ch = ch >> 8;          // shift value down by 1 byte  
        }
        while ( ch );
        // add stack contents to result  
        // done because chars have "wrong" endianness  
        re = re.concat( st.reverse() );
    }
    // return an array of bytes  
    // console.log(re);
    return re;
}
const Root = createStackNavigator(
    {
        Main:{
          screen:Main,
        },
        AddDevice:{
            screen:AddDevice,
        },
        DeviceMoreSetting:{
            screen:DeviceMoreSetting
        },
        TimeRangeSelect:{screen:TimeRangeSelect},
        ModifyPassword:{screen:ModifyPassword},

    },
    {
        headerMode: 'screen',
        navigationOptions: {
            headerStyle: {
                backgroundColor: Colors.appThemeColor,
                height:40,
            },
            headerTitleStyle: {
                color: '#fff',
                fontSize: FontSizeUtils.convert(18),
            },
            headerTintColor: '#fff'
        }
    }
)

export default class App extends Component<Props> {
  render() {
    return (
      <Root/>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
