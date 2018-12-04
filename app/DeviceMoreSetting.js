import React,{Component} from 'react'
import {
    View,
    StyleSheet,
    Text,
    TextInput,
    SectionList,
    Image,
    TouchableOpacity,
    DeviceEventEmitter
} from "react-native";
import HeaderLeftView from "./common/HeaderLeftView";
import HeaderRightView from "./common/HeaderRightView";
import Colors from "./utils/Colors";
import FontSizeUtils from "./utils/FontSizeUtils";
import WidthUtils from "./utils/WidthUtils";
import BorderText from "./common/BorderText";
import HeightUtils from "./utils/HeightUtils";
import Communications from "react-native-communications";
import DialogLoadingView from "./common/DialogLoadingView";
import GlobalConfig from "./GlobalConfig";
import CustomModal from "./common/CustomModal";
import TypeConvertUtil from "./TypeConvertUtil";
import AppCommandIndex from "./AppCommandIndex";
import GetCommand from "./GetCommand";
import AlertTool from "./utils/AlertTool";
import ParseResponseData from "./ParseResponseData";
import Store from "react-native-simple-store";
const oneLevelLabel=['解除绑定',];
const oneLevelCommand=['#9',];

const twoLevelLabel=['添加时间段','删除时间段','修改密码'];
const twoLevelCommand=['#0:','#0:','#7:'];
const threeLevelLabel=['鸣警笛','关警笛','关闭或开启报警','无线学习','开启远程报警和呼叫','关闭远程报警和呼叫','重启','恢复默认密码','恢复出厂设置',]
const threeLevelCommand=['#5','#6','#C','#D','#R','#L','#S','*#','#F',]

let tel='18380265782';
let initIndex;
export default class DeviceMoreSetting extends Component{
    static navigationOptions = ({navigation}) => {
        return {
            headerTitle:'设置',
            headerTitleStyle:{flex: 1,textAlign:'center'},//只有写在此处，标题才会居中
            headerLeft: (<HeaderLeftView clickBtn={() => navigation.goBack()}/>),
            headerRight:(<HeaderRightView content={'  '} />)//加了headerLeft，标题就不会居中，此刻headerRight必须要设置，可以设置和加了headerLeft一样
        };
    };

    constructor(props){
        super(props);
        this.state={
            dialogLoadingVisible:false,//是否显示loading
            loadingText:'发送中...',
            currentCommandString:'',
        }
    }

    componentDidMount(){
        initIndex = this.props.navigation.state.params.initIndex;
        this.commandSocketMsgListener();
    }
    componentWillUnmount(){
        this.sendTimer && clearTimeout(this.sendTimer);
        this.msgListener.remove();
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
    renderTwoLevelItem(item){
        return(
           <TouchableOpacity
               onPress={() => {
                   if(item === twoLevelLabel[0]){
                       this.props.navigation.navigate('TimeRangeSelect',{tel:tel,initIndex:initIndex,setInitIndex:(index)=>{initIndex = index}})
                   }else if(item === twoLevelLabel[2]){
                       this.props.navigation.navigate('ModifyPassword',{deviceName:'hhhh',deviceTel:'183802655782',type:'modify',title:'修改密码',initIndex:initIndex,setInitIndex:(index)=>{initIndex = index}});
                   }else if(item === '关于'){

                   }else if(item === oneLevelLabel[0]){
                       this.props.navigation.navigate('ModifyPassword',{deviceName:'hhhh',deviceTel:'183802655782',type:'remove',title:'解除绑定',initIndex:initIndex,setInitIndex:(index)=>{initIndex = index}});

                   }
                    }
               }
               activeOpacity={0.5}
           >
               <View style={{flex:1,flexDirection:'row',justifyContent:'space-between',alignItems:'center',
                   padding:WidthUtils.convert(15),
                   backgroundColor:'white',marginBottom:WidthUtils.convert(10)}}>
                   <Text style={{color:Colors.fontBlack,fontSize:FontSizeUtils.convert(14)}}>
                       {item}
                   </Text>
                   <Image    style={{width:WidthUtils.convert(40),height:HeightUtils.convert(40)}}
                             resizeMode={'contain'}
                             source={require('./img/arrow_right.png')}/>
               </View>
           </TouchableOpacity>
        )
    }
    renderThreeLevelItem(item,index,section){
        return(
            <View style={{flex:1,flexDirection:'row',justifyContent:'space-between',alignItems:'center',
                padding:WidthUtils.convert(15),
                backgroundColor:'white',marginBottom:WidthUtils.convert(10)}}>
                <Text style={{color:Colors.fontBlack,fontSize:FontSizeUtils.convert(14)}}>
                    {item}
                </Text>
                <BorderText
                    text={'发送'}
                    textSize={16}
                    textColor={'white'}
                    backgroundColor={Colors.appThemeColor}
                    borderRadius={WidthUtils.convert(5)}
                    marginTop={WidthUtils.convert(0)}
                    padding={WidthUtils.convert(10)}
                    paddingLeft={WidthUtils.convert(30)}
                    paddingRight={WidthUtils.convert(30)}
                    onPress={()=>{
                        if(section.title === '二级命令'){
                            this.setState({
                                currentCommandString:twoLevelCommand[index]
                            },()=>{
                                this.sendNetOrCommunicationsCommand.showModal();
                            })
                        }else{
                            this.setState({
                                currentCommandString:threeLevelCommand[index]
                            },()=>{
                                this.sendNetOrCommunicationsCommand.showModal();
                            })
                        }

                    }}
                />
            </View>
        )
    }
    //短信或者网络发送命令的选择框
    renderNetOrCommunications(){
        return(
            <View style={{width: GlobalConfig.screenWidth * 0.8,backgroundColor:'white'}}>
                <Text style={{width: GlobalConfig.screenWidth * 0.8,textAlign:'center',padding:WidthUtils.convert(20),fontSize:FontSizeUtils.convert(18),color:'white',backgroundColor:Colors.appThemeColor}}>
                    发送方式
                </Text>
                <Text style={{width: GlobalConfig.screenWidth * 0.8,textAlign:'center',padding:WidthUtils.convert(30),fontSize:FontSizeUtils.convert(16),color:Colors.fontBlack
                }}
                      onPress={()=>{

                      }}
                >
                    短信
                </Text>
                <View style={{width: GlobalConfig.screenWidth * 0.8,backgroundColor:Colors.appThemeColor,height:1}}/>
                <Text style={{width: GlobalConfig.screenWidth * 0.8,textAlign:'center',padding:WidthUtils.convert(30),fontSize:FontSizeUtils.convert(16),color:Colors.fontBlack}}
                      onPress={()=>{
                          this.sendDeviceCommand(this.state.currentCommandString);
                      }}
                >
                    网络
                </Text>
            </View>
        )

    }
    render(){
        return(
            <View style={{flex:1,backgroundColor:Colors.rootBGColor}}>
                <SectionList
                    renderItem={({ item, index, section }) =>{
                        if(item === oneLevelLabel[0] || item === twoLevelLabel[0] || item === twoLevelLabel[2] ||item === '关于'){
                            return this.renderTwoLevelItem(item,index,section);
                        }else{
                            return this.renderThreeLevelItem(item,index,section);
                        }
                    }}
                    renderSectionHeader={({ section: { title } }) => (
                        <Text style={{color:Colors.fontGray,fontSize:FontSizeUtils.convert(18),margin:WidthUtils.convert(20)}}>{title}</Text>
                    )}
                    sections={[
                        { title: "一级命令", data: oneLevelLabel,},
                        { title: "二级命令", data: twoLevelLabel,},
                        { title: "三级命令", data: threeLevelLabel,},
                        { title: "", data: ["关于"] ,}
                    ]}
                    keyExtractor={(item, index) => item + index}

                />
                <CustomModal
                    ref={o => this.sendNetOrCommunicationsCommand = o}
                    renderContent={this.renderNetOrCommunications()}
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