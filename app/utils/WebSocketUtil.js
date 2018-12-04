
/**
 *
 */
import {
    Alert
} from 'react-native';
import GlobalConfig from "../actions/GlobalConfig";

/**
 * Websocket操作
 * @param props
 */
const connectServer = (props)=> {
    let wsServer = new WebSocket(GlobalConfig.socketaddress);
    wsServer.onopen = () => {
        Alert.alert("提示", "推送服务连接成功", [{text: "确定"}]);
    };
    wsServer.onmessage = (e) => {
        //props.actions.updateMainMessage(e.data);
        alert(e.data.toString());
    };
    wsServer.onerror = (e) => {
        //Alert.alert("提示", "推送服务异常", [{text: "确定"}]);
    };
    wsServer.onclose = (e) => {
        wsServer = null;
    };
};

/**
 *
 */
export default {
    connectServer
};
