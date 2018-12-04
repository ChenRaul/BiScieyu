import {Dimensions, PixelRatio} from "react-native";

const GlobalConfig = {
    screenWidth: Dimensions.get('window').width,
    screenHeight: Dimensions.get('window').height,
    screenDensity: PixelRatio.get(),
    serverIp:'192.168.50.35',
    serverPort:4000,
    alarmPort:3999,
    commandPort:Math.random() * 60536 | 0 + 5000,

    //socket发送的序列号对应的命令关系
    globalSendIndex:{
        regIndex:0,//注册时发送命令的index
        loginIndex:0,//登录时发送命令的index
        linkIndex:0,//心跳时发送命令的index
        getDeviceListIndex:0,//获取设备列表发送命令的index
        bindDeviceIndex:0,//绑定设备发送命令的index
        deviceCmdIndex:0,//向设备发送命令字符串的index
        //这样写可以区分每个命令，但是由于APP一次只能发送一个命令，所以把deviceCmdIndex当做number
        // {
        //     getDeviceNameIndex:0,
        //     deviceDeploymentIndex:0,//设备布防
        // }
    },
    globalAppId:null,
    globalDeviceId:null,
    appPsw:'',
    globalCommandSocket:null,
    globalAlarmSocket:null,


    linkTimer:null,


};

export default GlobalConfig;
