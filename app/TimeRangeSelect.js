import React from "react";
import Picker from "react-native-picker";
import {View, Text, TouchableOpacity, DeviceEventEmitter} from "react-native";
import FontSizeUtils from "./utils/FontSizeUtils";
import Colors from "./utils/Colors";
import HeaderLeftView from "./common/HeaderLeftView";
import HeaderRightView from "./common/HeaderRightView";
import WidthUtils from "./utils/WidthUtils";
import BorderText from "./common/BorderText";
import Communications from "react-native-communications";
import DialogLoadingView from "./common/DialogLoadingView";
import AppCommandIndex from "./AppCommandIndex";
import TypeConvertUtil from "./TypeConvertUtil";
import GetCommand from "./GetCommand";
import GlobalConfig from "./GlobalConfig";
import AlertTool from "./utils/AlertTool";
import ParseResponseData from "./ParseResponseData";

let deviceTel;
let addTimeCommandString='#0:';
let initIndex;
export default class TimeRangeSelect extends React.Component{
    static navigationOptions = ({navigation}) => {
        return {
            headerTitle:'添加时间段',
            headerTitleStyle:{flex: 1,textAlign:'center'},//只有写在此处，标题才会居中
            headerLeft: (<HeaderLeftView clickBtn={() => navigation.goBack()}/>),
            headerRight:(<HeaderRightView content={'  '}

            />)//加了headerLeft，标题就不会居中，此刻headerRight必须要设置，可以设置和加了headerLeft一样
        };
    };
    constructor(props){
        super(props);
        this.state={
            startTime:'',
            endTime:'',
            isClickStart:true,
            dialogLoadingVisible:false,//是否显示loading
            loadingText:'发送中...',
        }
    }
    selectTime(){

    }
    componentWillMount(){
        this.commandSocketMsgListener();
        deviceTel = this.props.navigation.state.params.deviceTel;
        initIndex = this.props.navigation.state.params.initIndex;
        let time=[];
        for(let i=0;i<24;i++){
            time.push(i);
        }
        let min=[];
        for(let i=0;i<60;i++){
            min.push(i);
        }
        let pickerData=[[''],
            time,min,['']
        ];
        let date = new Date();
        let selectedValue = ['',date.getHours(), date.getMinutes(),''];
        Picker.init({
            pickerData:pickerData,
            selectedValue:selectedValue,
            pickerConfirmBtnText:'确认',
            pickerCancelBtnText:'取消',
            pickerTitleText: '选择时间',
            pickerTitleColor:[175,37,27,1],
            pickerConfirmBtnColor:[45,134,223,1],
            pickerCancelBtnColor:[45,134,223,1],
            pickerBg:[243,244,246,1],
            pickerFontColor:[34,34,34,1],
            pickerFontSize:FontSizeUtils.convert(18),
            pickerToolBarFontSize:FontSizeUtils.convert(18),
            onPickerConfirm:(pickerTime)=>{
                if(Number.parseInt(pickerTime[1]) < 10){
                    pickerTime[1] = '0'+pickerTime[1];
                }
                if(Number.parseInt(pickerTime[2]) < 10){
                    pickerTime[2] = '0'+pickerTime[2];
                }
                if(this.state.isClickStart){
                    this.setState({startTime:pickerTime[1]+':'+pickerTime[2]});
                }else{
                    this.setState({endTime:pickerTime[1]+':'+pickerTime[2]});
                }

                // console.log(pickerTime);
            },
            onPickerCancel:(pickerTime)=>{
                this.setState({data:pickerTime});
                // console.log(pickerTime);
            },
            onPickerSelect:(pickerTime)=>{
                this.setState({data:pickerTime});
                console.log(pickerTime);
            },
        });
    }
    componentDidMount(){
        Picker.show();
    }
    componentWillUnmount(){
        this.msgListener.remove();
        this.sendTimer && clearTimeout(this.sendTimer);
        this.props.navigation.state.params.setInitIndex(initIndex);
        Picker.hide();
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
    render(){
        return(
            <View style={{flex:1,backgroundColor:'white',}}>
                <View style={{backgroundColor:Colors.rootBGColor,flexDirection: 'row',justifyContent: 'center',alignItems: 'center'}}>
                    <TouchableOpacity
                        onPress={()=>{
                            this.setState({
                                isClickStart:true,
                            },()=>{
                                if(!Picker.isPickerShow()){
                                    Picker.show();
                                }
                            })

                        }}
                    >
                        <View style={{margin: WidthUtils.convert(20),marginRight:WidthUtils.convert(40),
                            borderBottomColor:this.state.isClickStart ? Colors.appThemeColor:Colors.fontBlack,
                            borderBottomWidth: 1,padding: WidthUtils.convert(20),
                            paddingLeft: WidthUtils.convert(30),paddingRight: WidthUtils.convert(30),

                        }}>
                            <Text style={{fontSize:FontSizeUtils.convert(16),color:this.state.isClickStart ? Colors.appThemeColor:Colors.fontBlack,}}>
                                {this.state.startTime ? this.state.startTime : '开始时间'}
                            </Text>
                        </View>
                    </TouchableOpacity>


                    <Text style={{color:Colors.fontBlack,fontSize:FontSizeUtils.convert(18)}}>
                        至
                    </Text>
                    <TouchableOpacity
                        onPress={()=>{
                            this.setState({
                                isClickStart:false,
                            },()=>{
                                if(!Picker.isPickerShow()){
                                    Picker.show();
                                }
                            })

                        }}
                    >
                        <View style={{margin: WidthUtils.convert(20),marginLeft:WidthUtils.convert(40),
                            borderBottomColor:this.state.isClickStart ? Colors.fontBlack:Colors.appThemeColor,
                            borderBottomWidth: 1,
                            padding: WidthUtils.convert(20),
                            paddingLeft: WidthUtils.convert(30),paddingRight: WidthUtils.convert(30),
                        }}>
                            <Text style={{color:this.state.isClickStart ? Colors.fontBlack:Colors.appThemeColor,
                                    fontSize:FontSizeUtils.convert(16),
                                }}>
                                {this.state.endTime ? this.state.endTime : '结束时间'}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <BorderText
                    text={'网络发送'}
                    textSize={16}
                    backgroundColor={Colors.appThemeColor}
                    borderRadius={WidthUtils.convert(5)}
                    marginTop={WidthUtils.convert(80)}
                    marginRight={WidthUtils.convert(40)}
                    marginLeft={WidthUtils.convert(40)}
                    padding={WidthUtils.convert(25)}
                    onPress={()=>{
                        if(this.state.startTime && this.state.endTime){
                            // Communications.text(deviceTel,addTimeCommandString+this.state.startTime+'-'+this.state.endTime)
                           this.sendDeviceCommand(addTimeCommandString+this.state.startTime+'-'+this.state.endTime);
                        }
                    }}
                />
                <BorderText
                    text={'短信发送'}
                    textSize={16}
                    backgroundColor={Colors.appThemeColor}
                    borderRadius={WidthUtils.convert(5)}
                    marginTop={WidthUtils.convert(80)}
                    marginRight={WidthUtils.convert(40)}
                    marginLeft={WidthUtils.convert(40)}
                    padding={WidthUtils.convert(25)}
                    onPress={()=>{
                        if(this.state.startTime && this.state.endTime){
                            Communications.text(deviceTel,addTimeCommandString+this.state.startTime+'-'+this.state.endTime)
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