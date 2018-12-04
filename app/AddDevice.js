import React,{Component} from 'react'
import {View, StyleSheet, Text, TextInput, DeviceEventEmitter} from "react-native";
import HeaderLeftView from "./common/HeaderLeftView";
import HeaderRightView from "./common/HeaderRightView";
import Colors from "./utils/Colors";
import WidthUtils from "./utils/WidthUtils";
import FontSizeUtils from "./utils/FontSizeUtils";
import BorderText from "./common/BorderText";
import GlobalConfig from "./GlobalConfig";
import AlertTool from "./utils/AlertTool";
import DialogLoadingView from "./common/DialogLoadingView";
import ValidateUtil from "./utils/ValidateUtil";
import ParseResponseData from "./ParseResponseData";
import AppCommandIndex from "./AppCommandIndex";
import TypeConvertUtil from "./TypeConvertUtil";
import GetCommand from "./GetCommand";

let initIndex;
let mDeviceId;//临时保存变量
let response;
let device={
    deviceName:'',
    devicePhone:'',
    deviceId:'',
};
export default class AddDevice extends Component{
    static navigationOptions = ({navigation}) => {
        return {
            headerTitle:'绑定设备',
            headerTitleStyle:{flex: 1,textAlign:'center'},//只有写在此处，标题才会居中
            headerLeft: (<HeaderLeftView clickBtn={() => navigation.goBack()}/>),
            headerRight:(<HeaderRightView content={'  '} />)//加了headerLeft，标题就不会居中，此刻headerRight必须要设置，可以设置和加了headerLeft一样
        };
    };

    constructor(props){
        super(props);
        this.state={
            deviceName:'',
            devicePhone:'',
            devicePwd:'',
            dialogLoadingVisible:false,//是否显示loading
            loadingText:'绑定中...',
        };
    }

    componentDidMount(){
        initIndex = this.props.navigation.state.params.initIndex;
        this.msgListener = DeviceEventEmitter.addListener('commandSocketReceiveMsg', (msg)=> {
            let retArray=msg.split(',');
            //此页面只处理绑定设备，设置设备名字的socket返回的response
            switch (Number.parseInt(retArray[0])){
                case GlobalConfig.globalSendIndex.bindDeviceIndex:
                    //接收到返回的信息就应该清除超时的定时器
                    this.timer && clearTimeout(this.timer);
                    response =ParseResponseData.parseIsSuccess(retArray);
                    console.log('设备绑定response:',response);
                    if(response.success === '1.'){//绑定成功
                        //根据deviceId设置deviceName
                        mDeviceId = response.deviceId;
                        let index = this.getIndex();
                        this.sendCommand(AppCommandIndex.deviceCmd,index,GetCommand.getSetDeviceNameCommand(index,response.deviceId,this.state.deviceName));

                    }else{
                        this.setState({
                            dialogLoadingVisible:false,
                        },()=>{
                            AlertTool.showOneBtnAlert("绑定设备失败，请稍后重试!",
                                ()=>{

                                },
                            )
                        })
                    }
                    break;
                case GlobalConfig.globalSendIndex.deviceCmdIndex:
                    //接收到返回的信息就应该清除超时的定时器
                    this.timer && clearTimeout(this.timer);
                     response = ParseResponseData.parseIsSuccess(retArray);
                     console.log('设置设备名字response:',response);
                    if(response.success === '1.'){//设置成功
                        device.deviceId = mDeviceId;
                        device.deviceName = this.state.deviceName;
                        device.devicePhone = this.state.devicePhone;
                        this.setState({
                            dialogLoadingVisible:false,
                        },()=>{
                            AlertTool.showOneBtnAlert("绑定设备成功",
                                ()=>{
                                    this.props.navigation.state.params.saveDevice(device);
                                    this.props.navigation.state.params.setInitIndex(initIndex);
                                    this.props.navigation.goBack();
                                },
                            )
                        })
                    }else{
                        this.setState({
                            dialogLoadingVisible:false,
                        },()=>{
                            AlertTool.showOneBtnAlert("绑定设备失败，请稍后重试!",
                                ()=>{

                                },
                            )
                        })
                    }
                    break;
            }
        })
    }
    componentWillUnmount(){
        this.msgListener.remove();
    }
    sendCommand(appCommandIndex,currentSendIndex,bufStr){
        let buf = TypeConvertUtil.toByteArray(bufStr);
        GlobalConfig.globalCommandSocket.send(buf, 0, buf.length, GlobalConfig.serverPort, GlobalConfig.serverIp,(err)=>{
            if (err){
                console.log('commandSocket message send error:'+currentSendIndex);
                throw err;
            }
            console.log('commandSocket message send:'+currentSendIndex);
            switch (appCommandIndex){
                case AppCommandIndex.bindDevice:
                    GlobalConfig.globalSendIndex.bindDeviceIndex = currentSendIndex;
                    //发送成功后开始判断是否超时
                    this.onSureSendTimeout(this.getIndex(),AppCommandIndex.bindDevice);
                    break;
                case AppCommandIndex.deviceCmd://此处实际是设置设备名字的
                    GlobalConfig.globalSendIndex.deviceCmdIndex = currentSendIndex;
                    //发送成功后开始判断是否超时,如果超时重新发送
                    this.onSureSendTimeout(this.getIndex(),AppCommandIndex.deviceCmd);
                    break;
            }
        })
    }
    getIndex(){
        if(initIndex >= 255){
            initIndex = 1;
        }else{
            initIndex +=1;
        }
        return initIndex;
    }
    setDeviceName(text){
        this.setState({
            deviceName:text,
        })
    }
    setDeviceId(text){
        this.setState({
            devicePhone:text,
        })
    }
    setDevicePwd(text){
        this.setState({
            devicePwd:text,
        })
    }
    onSureSendTimeout(index,mAppCommandIndex){
        this.timer = setTimeout(()=>{
            if(this.state.dialogLoadingVisible){//表明发送的消息没有返回,需要再次发送
                switch (mAppCommandIndex){
                    case AppCommandIndex.bindDevice:
                        this.sendCommand(AppCommandIndex.bindDevice,index,GetCommand.getBindDeviceCommand(index,GlobalConfig.globalAppId,this.state.devicePhone));
                        setTimeout(()=>{
                            if(this.state.dialogLoadingVisible){//再次发送，还是没有返回则提示发送失败！
                                this.setState({
                                    dialogLoadingVisible:false,
                                },()=>{
                                    console.log('绑定设备失败');
                                    AlertTool.showOneBtnAlert("绑定设备失败!",
                                        ()=>{

                                        },
                                    )
                                });
                            }
                        },3000);
                        break;
                    case AppCommandIndex.deviceCmd:
                        this.sendCommand(AppCommandIndex.deviceCmd,index,GetCommand.getSetDeviceNameCommand(index,mDeviceId,this.state.deviceName));
                        setTimeout(()=>{
                            if(this.state.dialogLoadingVisible){//再次发送，还是没有返回则提示发送失败！
                                this.setState({
                                    dialogLoadingVisible:false,
                                },()=>{
                                    console.log('绑定设备失败');
                                    AlertTool.showOneBtnAlert("绑定设备失败!",
                                        ()=>{

                                        },
                                    )
                                });
                            }
                        },3000);
                        break;
                }
            }
        },3000);
    }
    renderItem(label,placeholder,onChangeText){
        return(
            <View style={{marginBottom: WidthUtils.convert(30)}}>
                <Text style={{color:Colors.fontBlack,fontSize:FontSizeUtils.convert(14)}}>
                    {label}
                </Text>
                <View style={{borderWidth: 1,borderColor:Colors.appThemeColor,borderRadius:WidthUtils.convert(5)}}>
                    <TextInput
                        style={{padding: WidthUtils.convert(10),color:Colors.fontBlack}}
                        underlineColorAndroid={'transparent'}
                        placeholder={placeholder}
                        placeholderColor={Colors.fontGray}
                        onChangeText={(text)=>{
                            onChangeText(text);
                        }}
                    />
                </View>
            </View>
        )
    }
    render(){
        return(
            <View style={{flex:1,backgroundColor:'white',padding: WidthUtils.convert(40)}}>
                {this.renderItem('设备名称','请输入设备名称',(text)=> this.setDeviceName(text))}
                {this.renderItem('设备电话','请输入设备电话号码',(text)=> this.setDeviceId(text))}
                {this.renderItem('设备密码(4位数字)','请输入设备4位数字密码',(text)=> this.setDevicePwd(text))}
                <BorderText
                    text={'绑定'}
                    textSize={16}
                    backgroundColor={Colors.appThemeColor}
                    borderRadius={WidthUtils.convert(5)}
                    marginTop={WidthUtils.convert(30)}
                    padding={WidthUtils.convert(25)}
                    onPress={()=>{
                        if(this.state.deviceName.length <=0  || this.state.deviceName.length >15){
                            AlertTool.showOneBtnAlert('设备名称不能为空且文字个数不大于15');
                        }else if(ValidateUtil.ValidateMobile(this.state.devicePhone)){
                            AlertTool.showOneBtnAlert('设备电话格式有误，请重新输入');
                        }else if(this.state.devicePwd.length === 4 && Number(this.state.devicePwd)){//是数字
                            //先绑定设备，获取到设备Id，在根据设备id设置设备名字，再本地保存

                            let index = this.getIndex();
                            this.sendCommand(AppCommandIndex.bindDevice,index,GetCommand.getBindDeviceCommand(index,GlobalConfig.globalAppId,this.state.devicePhone));
                        }else{
                            AlertTool.showOneBtnAlert('设备密码只能是4位数字密码,请重新输入设备密码');
                        }
                    }}
                />
                <DialogLoadingView
                    visible={this.state.dialogLoadingVisible}
                    content={this.state.loadingText}
                    //设置close属性，也就是关闭Modal
                    close={()=>{
                        this.setState({
                            dialogLoadingVisible:false,
                        })
                    }}
                />
            </View>
        )
    }
}