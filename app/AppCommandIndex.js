
const AppCommandIndex = {
    //主命令序号
    register:1,
    login:2,
    link:3,
    bindDevice:4,
    unBindDevice:5,
    appName:6,
    deviceCmd:7,
    serverResponse:8,
    getDeviceList:9,

    //设备控制命令的序号，也就是主命令为7的子命令的序号

    //接收的报警序号
    alarmMC:10,
    alarmHW:11,
    alarmHWCNT:12,
    alarmYG:13,
    alarmSJFDQ:14,
    alarmDD:15,//		: ”15”断电
    alarmYBQ:16,//		: ”16”迎宾器
    alarmML:17,//		: ”17”门铃
    alarmCAll:18,//	：老人呼叫


}

 export default AppCommandIndex;
