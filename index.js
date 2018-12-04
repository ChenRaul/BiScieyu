/** @format */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import dgram from "react-native-udp";

AppRegistry.registerComponent(appName, () => App);
