import {Dimensions, PixelRatio} from "react-native";

const GlobalConfig = {
    screenWidth: Dimensions.get('window').width,
    screenHeight: Dimensions.get('window').height,
    screenDensity: PixelRatio.get(),
    serverIp:'192.168.50.35',
    serverPort:4000,
    alarmPort:3999,
    commandPort:Math.random() * 60536 | 0 + 5000,

    //socket���͵����кŶ�Ӧ�������ϵ
    globalSendIndex:{
        regIndex:0,//ע��ʱ���������index
        loginIndex:0,//��¼ʱ���������index
        linkIndex:0,//����ʱ���������index
        getDeviceListIndex:0,//��ȡ�豸�б��������index
        bindDeviceIndex:0,//���豸���������index
        deviceCmdIndex:0,//���豸���������ַ�����index
        //����д��������ÿ�������������APPһ��ֻ�ܷ���һ��������԰�deviceCmdIndex����number
        // {
        //     getDeviceNameIndex:0,
        //     deviceDeploymentIndex:0,//�豸����
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
