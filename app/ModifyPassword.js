import React from "react";
import {View, Text, TouchableOpacity, TextInput, DeviceEventEmitter} from "react-native";
import WidthUtils from "./utils/WidthUtils";
import Colors from "./utils/Colors";
import FontSizeUtils from "./utils/FontSizeUtils";
import BorderText from "./common/BorderText";
import HeaderLeftView from "./common/HeaderLeftView";
import HeaderRightView from "./common/HeaderRightView";
import Communications from "react-native-communications";
import AlertTool from "./utils/AlertTool";
import Picker from "react-native-picker";
import GlobalConfig from "./GlobalConfig";
import ParseResponseData from "./ParseResponseData";
import AppCommandIndex from "./AppCommandIndex";
import TypeConvertUtil from "./TypeConvertUtil";
import GetCommand from "./GetCommand";
import DialogLoadingView from "./common/DialogLoadingView";

let deviceName='';
let deviceTel='';
let type='';
let initIndex;
export default class ModifyPassword extends React.Component{
    static navigationOptions = ({navigation}) => {
        return {
            headerTitle:`${navigation.state.params.title}`,
            headerTitleStyle:{flex: 1,textAlign:'center'},//只有写在此处，标题才会居中
            headerLeft: (<HeaderLeftView clickBtn={() => navigation.goBack()}/>),
            headerRight:(<HeaderRightView content={'  '}

            />)//加了headerLeft，标题就不会居中，此刻headerRight必须要设置，可以设置和加了headerLeft一样
        };
    };
    constructor(props){
        super(props);
        this.state={
            devicePwd:'',
            dialogLoadingVisible:false,//是否显示loading
            loadingText:'发送中...',
        }
    }
    componentWillMount(){
        deviceName=this.props.navigation.state.params.deviceName;
        deviceTel=this.props.navigation.state.params.deviceTel;
        type=this.props.navigation.state.params.type;
        initIndex = this.props.navigation.state.params.initIndex;
        this.commandSocketMsgListener();
    }
    setDevicePwd(text){
        this.setState({
            devicePwd:text,
        })
    }
    componentWillUnmount(){
        this.msgListener.remove();
        this.sendTimer && clearTimeout(this.sendTimer);
        this.props.navigation.state.params.setInitIndex(initIndex);
    }
    commandSocketMsgListener(){
        this.msgListener = DeviceEventEmitter.addListener('commandSocketReceiveMsg', (msg)=>{
            console.log('DeviceEventEmitter:',msg);
            console.log('GlobalConfig.globalSendIndex:',GlobalConfig.globalSendIndex);
            let retArray=msg.split(',');
            switch (Number.parseInt(retArray[0])){
                case GlobalConfig.globalSendIndex.deviceCmdIndex:
                    this.sendTimer && clearTimeout(this.sendTimer);
                    this.setState({
                        dialogLoadingVisible:false,
                    },()=>{
                        let response = ParseResponseData.parseIsSuccess(retArray);
                        if(response.success === '1.'){
                            AlertTool.showOneBtnAlert("发送命令成功",()=>{});
                        }else{
                            AlertTool.showOneBtnAlert("发送命令失败",()=>{});
                        }
                    })
                    break;
            }
        })
    }
    sendDeviceCommand(deviceCmdString){
        this.setState({
            dialogLoadingVisible:true,
            loadingText:'发送中...',
        },()=>{
            let index = this.getIndex();
            this.sendCommand(AppCommandIndex.deviceCmd,index,TypeConvertUtil.toByteArray(GetCommand.getDeviceCommand(index,GlobalConfig.globalAppId,GlobalConfig.globalDeviceId,deviceCmdString)),deviceCmdString);

        });
    }
    getIndex(){
        if(initIndex >= 255){
            initIndex = 1;
        }else{
            initIndex +=1;
        }
        return initIndex;
    }
    sendCommand(appCommandIndex,currentSendIndex,buf,deviceCmdString){
        GlobalConfig.globalCommandSocket.send(buf, 0, buf.length, GlobalConfig.serverPort, GlobalConfig.serverIp,(err)=>{
            if (err){
                console.log('commandSocket message send error:'+currentSendIndex);
                throw err;
            }
            console.log('commandSocket message send:'+currentSendIndex);
            switch (appCommandIndex){
                case AppCommandIndex.deviceCmd:
                    GlobalConfig.globalSendIndex.deviceCmdIndex = currentSendIndex;
                    // if(deviceCmdString === firstLevelCommand[0]){//布防
                    //判断发送命令是否超时，
                    this.onSureSendTimeout(this.getIndex(),AppCommandIndex.deviceCmd,deviceCmdString);
                // }

            }
        })
    }
    onSureSendTimeout(index,mAppCommandIndex,deviceCmdString){
        this.sendTimer = setTimeout(()=>{
            if(this.state.dialogLoadingVisible){//表明发送的消息没有返回,需要再次发送
                console.log('')
                switch (mAppCommandIndex){
                    case AppCommandIndex.deviceCmd:
                        this.sendCommand(AppCommandIndex.deviceCmd,index,TypeConvertUtil.toByteArray(GetCommand.getDeviceCommand(index,GlobalConfig.globalAppId,GlobalConfig.globalDeviceId,deviceCmdString)),deviceCmdString);
                        setTimeout(()=>{
                            if(this.state.dialogLoadingVisible){//再次发送，还是没有返回则提示发送失败！
                                this.setState({
                                    dialogLoadingVisible:false,
                                },()=>{
                                    AlertTool.showOneBtnAlert("命令发送超时!",
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
    renderItem(label,value,onChangeText){
        return(
            <View style={{marginBottom: WidthUtils.convert(30)}}>
                <Text style={{color:Colors.fontBlack,fontSize:FontSizeUtils.convert(14)}}>
                    {label}
                </Text>
                <View style={{borderWidth: 1,borderColor:Colors.appThemeColor,borderRadius:WidthUtils.convert(5)}}>
                    <TextInput
                        style={{padding: WidthUtils.convert(10),color:Colors.fontBlack}}
                        editable={value? false:true}
                        underlineColorAndroid={'transparent'}
                        value={value}
                        placeholder={(type ==='modify'?'请输入新的' :'请输入')+label}
                        placeholderColor={Colors.fontGray}
                        onChangeText={(text)=>{
                            onChangeText && onChangeText(text);
                        }}
                    />
                </View>
            </View>
        )
    }
    render(){
        return(
            <View style={{flex:1,backgroundColor:'white',padding: WidthUtils.convert(40)}}>
                {this.renderItem('设备名称',deviceName,null)}
                {this.renderItem('设备手机号码',deviceTel,null)}
                {this.renderItem(type ==='modify'?'设备密码(4位数字)':'设备密码',null,(text)=> this.setDevicePwd(text))}
                <BorderText
                    text={type==='modify'?'网络修改':'解除'}
                    textSize={16}
                    backgroundColor={Colors.appThemeColor}
                    borderRadius={WidthUtils.convert(5)}
                    marginTop={WidthUtils.convert(80)}
                    padding={WidthUtils.convert(25)}
                    onPress={()=>{
                        if(this.state.devicePwd.length === 4 && Number(this.state.devicePwd)){
                            this.sendDeviceCommand('#7:'+this.state.devicePwd);
                        }else{
                            AlertTool.showOneBtnAlert('设备密码只能是4位数字密码,请重新输入设备密码');
                        }
                    }}
                />
                {type==='modify' && <BorderText
                    text={'短信修改'}
                    textSize={16}
                    backgroundColor={Colors.appThemeColor}
                    borderRadius={WidthUtils.convert(5)}
                    marginTop={WidthUtils.convert(80)}
                    padding={WidthUtils.convert(25)}
                    onPress={()=>{
                        if(this.state.devicePwd.length === 4 && Number(this.state.devicePwd)){
                            Communications.text(deviceTel,'#7:'+this.state.devicePwd);
                        }else{
                            AlertTool.showOneBtnAlert('设备密码只能是4位数字密码,请重新输入设备密码');
                        }
                    }}
                />}
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