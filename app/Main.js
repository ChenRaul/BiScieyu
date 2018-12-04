import React from "react";
import {
    View, StyleSheet, Text, Image, TouchableOpacity, Animated, FlatList, DeviceEventEmitter,
    TextInput
} from "react-native";
import WidthUtils from "./utils/WidthUtils";
import Colors from "./utils/Colors";
import HeightUtils from "./utils/HeightUtils";
import FontSizeUtils from "./utils/FontSizeUtils";
import GlobalConfig from "./GlobalConfig";
import CustomModal from "./common/CustomModal";
import Store from "react-native-simple-store";
import dgram from "react-native-udp";
import GetCommand from "./GetCommand";
import DialogLoadingView from "./common/DialogLoadingView";
import AppCommandIndex from "./AppCommandIndex";
import AlertTool from "./utils/AlertTool";
import BorderText from "./common/BorderText";
import Communications from "react-native-communications";
import ParseResponseData from "./ParseResponseData";
import TypeConvertUtil from "./TypeConvertUtil";
let initIndex=0;
const firstLevelCommand=['#1','#2'];
let device = {deviceName:'设备1',
    devicePhone:'18380265782',
    deviceId:'1'};
export default class Main extends React.Component{

    static navigationOptions = ({navigation}) => {
        return {
            headerTitle:'设备控制',
            headerTitleStyle:{flex: 1,textAlign:'center'},//只有写在此处，标题才会居中
            // headerLeft: (<HeaderLeftView clickBtn={() => navigation.goBack()}/>),
            // headerRight:(<HeaderRightView content={'  '} />)//加了headerLeft，标题就不会居中，此刻headerRight必须要设置，可以设置和加了headerLeft一样
        };
    };
    constructor(props){
        super(props);
        this.state={
            imgRotateZValue:new Animated.Value(0),//动画初始值
            deviceList:[],
            currentDeviceIndex:0,
            dialogLoadingVisible:false,//是否显示loading
            loadingText:'发送中...',
            regOrLoginTitle:'',
            regOrLoginBtn:'',
            sendDeviceCmd:'',
        };
    }
    componentWillMount(){
        Store.push('device',device);//测试用
        Store.save('AppId',null);
        Store.save('AppPassword',null);
        //获取本地保存的设备数据,保存的是数组，获取的也是数组
        Store.get('device').then((deviceList) => {
            console.log('设备列表：',deviceList)
            this.setState({
                deviceList: deviceList? deviceList:[],
            });
        });
    }
    componentWillUnmount(){
        console.log('Main componentWillUnmount');
        Store.delete('device');
        GlobalConfig.linkTimer && clearTimeout(GlobalConfig.linkTimer);
        this.msgListener.remove();
    }
    componentDidMount(){
        this.setState({
            dialogLoadingVisible:false,
            loadingText:'登录中...',
        });
        this.commandSocketMsgListener();
        this.receiveAlarmInfo();
        this.commandSocketInit();
        let _this = this;


    }
    showRegOrLogin(type){
        this.setState({
            regOrLoginTitle:type==='reg' ? '注册':'登录',
            regOrLoginBtn:type==='reg' ? '注册':'登录',
        },()=>{
            this.RegLoginCustomModal.showModal();
        });
    }
    commandSocketMsgListener(){
        this.msgListener = DeviceEventEmitter.addListener('commandSocketReceiveMsg', (msg)=>{
            console.log('DeviceEventEmitter:',msg);
            console.log('GlobalConfig.globalSendIndex:',GlobalConfig.globalSendIndex);

            let retArray=msg.split(',');
            switch (Number.parseInt(retArray[0])){
                case GlobalConfig.globalSendIndex.regIndex:
                    let response = ParseResponseData.parseIsSuccess(retArray);
                    if(response.success ==='1.'){//注册成功,直接登录
                        this.setState({
                            dialogLoadingVisible:true,
                            loadingText:'登录中...',
                        },()=>{
                            this.RegLoginCustomModal.closeModal();
                            GlobalConfig.globalAppId  = response.appId;
                            let index =  this.getIndex();
                            //注册成功保存APPid,AppPassword
                            Store.save('AppId',response.appId);
                            Store.save('AppPassword',GlobalConfig.appPsw);
                            this.sendCommand(AppCommandIndex.login,index,TypeConvertUtil.toByteArray(GetCommand.getLoginCommand(index,response.appId,GlobalConfig.appPsw)))

                        });
                    }else{
                        this.setState({
                            dialogLoadingVisible:false,
                        },()=>{
                            AlertTool.showOneBtnAlert("注册失败，点击确定重新注册!",
                                ()=>{

                                },
                            )
                        })
                    }
                    break;
                case GlobalConfig.globalSendIndex.loginIndex:
                    if(retArray[retArray.length-1] ==='1.'){//登录成功，//发送心跳
                        this.setState({
                            loadingText:'获取设备列表',
                        },()=>{
                            //登录成功，还应该获取设备列表
                            console.log('登录成功：id:'+GlobalConfig.globalAppId);
                            //由于APP删除后需要重新注册，也需要重新绑定设备，所以此处暂时这样，
                            //设备列表直接获取本地的保存。
                            let index = this.getIndex();
                            this.sendCommand(AppCommandIndex.getDeviceList,index,TypeConvertUtil.toByteArray(GetCommand.getDeviceListCommand(index,GlobalConfig.globalAppId)))

                        });
                    }else{
                        this.setState({
                            dialogLoadingVisible:false,
                        },()=>{
                            AlertTool.showOneBtnAlert("登录失败，点击确定重新登录!",
                                ()=>{

                                },
                            )
                        })
                    }
                    break;
                case GlobalConfig.globalSendIndex.getDeviceListIndex:
                    //接收到返回的信息就应该清除超时的定时器
                    this.sendTimer&& clearTimeout(this.sendTimer);
                    //获取绑定设备后就应该发送心跳信息，
                    let index = this.getIndex();
                    this.sendLink(TypeConvertUtil.toByteArray(GetCommand.getLinkCommand(index, GlobalConfig.globalAppId)));
                    if(retArray[retArray.length-1] ==='0.'){//暂时没有设备列表
                        this.setState({
                                dialogLoadingVisible:false,
                            },()=>{
                            AlertTool.showOneBtnAlert("您没有绑定任何设备,请添加设备!",
                                ()=>{

                                },
                            )
                        });

                    }else{//获取到设备
                        this.setState({
                            dialogLoadingVisible:false,
                        },()=>{
                            response = ParseResponseData.parseIsData(retArray);
                            console.log(response);
                        })
                    }

                    break;
                case GlobalConfig.globalSendIndex.deviceCmdIndex:
                    this.sendTimer && clearTimeout(this.sendTimer);
                    this.setState({
                        dialogLoadingVisible:false,
                    },()=>{
                        response = ParseResponseData.parseIsSuccess(retArray);
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
    onSureSendTimeout(index,mAppCommandIndex,deviceCmdString){
        this.sendTimer = setTimeout(()=>{
            if(this.state.dialogLoadingVisible){//表明发送的消息没有返回,需要再次发送
                console.log('')
                switch (mAppCommandIndex){
                    case AppCommandIndex.register:
                        this.sendCommand(AppCommandIndex.register,index,TypeConvertUtil.toByteArray(GetCommand.getRegCommand(index,GlobalConfig.appPsw)));
                        setTimeout(()=>{
                            if(this.state.dialogLoadingVisible){//再次发送，还是没有返回则提示发送失败！
                                this.setState({
                                    dialogLoadingVisible:false,
                                },()=>{
                                    AlertTool.showOneBtnAlert("注册超时!",
                                        ()=>{

                                        },
                                    )
                                });
                            }
                        },3000);
                        break;
                    case AppCommandIndex.login:
                        break;
                    case AppCommandIndex.getDeviceList:
                        this.sendCommand(AppCommandIndex.getDeviceList,index,TypeConvertUtil.toByteArray(GetCommand.getDeviceListCommand(index,GlobalConfig.globalAppId)))

                        setTimeout(()=>{
                           if(this.state.dialogLoadingVisible){//再次发送，还是没有返回则提示发送失败！
                               this.setState({
                                   dialogLoadingVisible:false,
                               },()=>{
                                   AlertTool.showOneBtnAlert("获取设备列表超时!",
                                       ()=>{

                                       },
                                   )
                               });
                           }
                        },3000);
                        break;
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
    commandSocketInit(){
        GlobalConfig.globalCommandSocket = dgram.createSocket('udp4');
        GlobalConfig.globalCommandSocket.bind(GlobalConfig.commandPort,(err)=> {
            if (err) {
                console.log('commandSocket绑定端口失败：',err);
                throw err;
            }
            console.log('commandSocket绑定端口成功');
            //先注册，如果没有注册则先注册，否则直接登录
            Store.get('AppId').then((appId) => {
                console.log('appId:',appId);
                if(appId === null){//说明没有注册

                    this.showRegOrLogin('reg');

                }else{
                    GlobalConfig.globalAppId = appId;
                    this.showRegOrLogin('login');
                }
            });
        });
        GlobalConfig.globalCommandSocket.on('message', (data,rinfo)=> {
            let retStr =TypeConvertUtil.byteToString(data);
            DeviceEventEmitter.emit('commandSocketReceiveMsg',retStr);

        })
    }
    sendCommand(appCommandIndex,currentSendIndex,buf,deviceCmdString){
        GlobalConfig.globalCommandSocket.send(buf, 0, buf.length, GlobalConfig.serverPort, GlobalConfig.serverIp,(err)=>{
            if (err){
                console.log('commandSocket message send error:'+currentSendIndex);
                throw err;
            }
            console.log('commandSocket message send:'+currentSendIndex);
            switch (appCommandIndex){
                case AppCommandIndex.register:
                    GlobalConfig.globalSendIndex.regIndex = currentSendIndex;
                    //判断发送命令是否超时，
                    this.onSureSendTimeout(this.getIndex(),AppCommandIndex.register);
                    break;
                case AppCommandIndex.login:
                    GlobalConfig.globalSendIndex.loginIndex = currentSendIndex;
                    break;
                case AppCommandIndex.getDeviceList:
                    GlobalConfig.globalSendIndex.getDeviceListIndex = currentSendIndex;
                    //判断发送命令是否超时，
                    this.onSureSendTimeout(this.getIndex(),AppCommandIndex.getDeviceList);
                    break;
                case AppCommandIndex.deviceCmd:
                    GlobalConfig.globalSendIndex.deviceCmdIndex = currentSendIndex;
                    // if(deviceCmdString === firstLevelCommand[0]){//布防
                        //判断发送命令是否超时，
                        this.onSureSendTimeout(this.getIndex(),AppCommandIndex.deviceCmd,deviceCmdString);
                    // }

            }
        })
    }
    sendLink(buf){
        GlobalConfig.linkTimer = setTimeout(()=>{
            //这个socket只会发送心跳
            GlobalConfig.globalAlartSocket.send(buf, 0, buf.length, GlobalConfig.serverPort, GlobalConfig.serverIp, (err)=>{
                if (err) throw err
                console.log('alarmSocket link send')
                GlobalConfig.globalSendIndex.linkIndex = 3;
            })
            let index = this.getIndex();
            this.sendLink(TypeConvertUtil.toByteArray(GetCommand.getLinkCommand(index, GlobalConfig.globalAppId)));
        },1000*300);
    }
    getIndex(){
        if(initIndex >= 255){
            initIndex = 1;
        }else{
            initIndex +=1;
        }
        return initIndex;
    }

    receiveAlarmInfo(){
        GlobalConfig.globalAlartSocket = dgram.createSocket('udp4');
        GlobalConfig.globalAlartSocket.bind(GlobalConfig.alarmPort, function(err) {
            if (err) {
                console.log('alarmSocket绑定失败：',err);
                throw err;
            }
            // self.updateChatter('a bound to ' + JSON.stringify(a.address()));
        })
        GlobalConfig.globalAlartSocket.on('message',(data, rinfo)=> {
            let retStr =TypeConvertUtil.byteToString(data);
            let retArray=retStr.split(',');
            console.log('alarmSocket接收到的命令：',retArray);
            console.log('GlobalConfig.globalSendIndex:',GlobalConfig.globalSendIndex);
            // DeviceEventEmitter.emit('commandSocketReceiveMsg',retStr);
            //报警socekt根据返回的字符串第二个来决定是心跳还是报警，心跳返回的是8，
            switch (retArray[1]){
                case 3://心跳返回,会面会修改为8
                    if(retArray[0] === GlobalConfig.globalSendIndex.linkIndex && retArray[retArray.length-1] ==='1.'){//心跳返回成功
                        console.log('心跳返回成功');
                    }

                    break;
            }


        })
    }


    /***
     * 点击设备时的动画，以及打开设备选择列表
     */
    modalOpenImgAnimation(){
            Animated.timing(
                this.state.imgRotateZValue,
                {
                    toValue:1,
                    duration:50,//动画的持续时间（毫秒），默认500ms
                },
            ).start(()=>this.CustomModal.showModal());
    }
    /***
     * 设备选择列表关闭时，需要执行的动画和方法
     */
    modalCloseImageAnimation(deviceIndex){
        Animated.timing(
            this.state.imgRotateZValue,
            {
                toValue:0,
                duration:50,//动画的持续时间（毫秒），默认500ms
            },
        ).start(()=>{
            this.CustomModal.closeModal();
            deviceIndex && this.setState({
                currentDeviceIndex:deviceIndex,
            })
        });
    }
    renderRegOrLoginItem(label,value,onChangeText){
        return(
            <View style={{width: GlobalConfig.screenWidth * 0.8,padding: WidthUtils.convert(10),flexDirection:'row',alignItems:'center'}}>
                <Text style={{color:Colors.fontBlack,fontSize:FontSizeUtils.convert(14),margin:WidthUtils.convert(10)}}>
                    {label}
                </Text>
                <View style={{flex:1,borderWidth: 1,marginLeft:WidthUtils.convert(10),marginRight:WidthUtils.convert(10),borderColor:Colors.appThemeColor,borderRadius:WidthUtils.convert(5)}}>
                    <TextInput
                        style={{padding: WidthUtils.convert(3),color:Colors.fontBlack}}
                        underlineColorAndroid={'transparent'}
                        defaultValue={value}
                        placeholder={'请输入4位数字密码'}
                        placeholderColor={Colors.fontGray}
                        onChangeText={(text)=>{
                            onChangeText(text);
                        }}
                    />
                </View>
            </View>
        )
    }
    renderRegOrLogin(title,btn){
        return(
            <View style={{width: GlobalConfig.screenWidth * 0.8,height:HeightUtils.convert(400),backgroundColor:'white',flexDirection:'column',justifyContent:'space-between',alignItems:'center'}}>
                <Text style={{width: GlobalConfig.screenWidth * 0.8,textAlign:'center',padding:WidthUtils.convert(30),fontSize:FontSizeUtils.convert(20),color:'white',backgroundColor:Colors.appThemeColor}}>
                    {title}
                </Text>

                {btn==='登录' && this.renderRegOrLoginItem('APPId:  ',GlobalConfig.globalAppId,null)}
                {this.renderRegOrLoginItem('APP密码:','',(text)=>{GlobalConfig.appPsw = text})}
                {btn==='注册' && <Text style={{width: GlobalConfig.screenWidth * 0.8,textAlign:'center',padding:WidthUtils.convert(10),fontSize:FontSizeUtils.convert(14),color:Colors.appThemeColor,backgroundColor:'white'}}>
                    您尚未注册,注册后方可登录使用,请在上面输入密码进行注册
                </Text>}
                <View style={{width: GlobalConfig.screenWidth * 0.8,flexDirection:'row',padding:WidthUtils.convert(10),alignItems:'center',justifyContent:'space-around'}}>
                    <BorderText text={"取消"}
                                textSize={16}
                                textColor={'white'}
                                backgroundColor={Colors.appThemeColor}
                                borderRadius={WidthUtils.convert(5)}
                                marginTop={WidthUtils.convert(0)}
                                padding={WidthUtils.convert(10)}
                                paddingLeft={WidthUtils.convert(40)}
                                paddingRight={WidthUtils.convert(40)}
                                onPress={()=>{
                                   this.RegLoginCustomModal.closeModal();
                                   AlertTool.showTwoBtnAlert(title==='注册'?"您尚未注册，注册后方可使用，点击取消退出APP，点击确定前往注册!":"您尚未登录，登录后方可使用，点击取消退出APP，点击确定前往登录!",
                                       ()=>{
                                            //TODO 退出
                                       },
                                       ()=>{
                                            console.log('显示注册界面');
                                            this.showRegOrLogin(title==='注册'?'reg':'login');
                                       }
                                   )
                                }}/>
                    <BorderText text={btn}
                                textSize={16}
                                textColor={'white'}
                                backgroundColor={Colors.appThemeColor}
                                borderRadius={WidthUtils.convert(5)}
                                marginTop={WidthUtils.convert(0)}
                                padding={WidthUtils.convert(10)}
                                paddingLeft={WidthUtils.convert(40)}
                                paddingRight={WidthUtils.convert(40)}
                                onPress={()=>{
                                    if(btn === '注册'){
                                       this.setState({
                                           dialogLoadingVisible:true,
                                           loadingText:'注册中...',
                                       },()=>{
                                           let index =  this.getIndex();
                                           this.sendCommand(AppCommandIndex.register,index,TypeConvertUtil.toByteArray(GetCommand.getRegCommand(index,GlobalConfig.appPsw)));
                                       })
                                    }else{
                                        //登录
                                        let index =  this.getIndex();
                                        this.sendCommand(AppCommandIndex.login,index,TypeConvertUtil.toByteArray(GetCommand.getLoginCommand(index,GlobalConfig.globalAppId,'1234')))
                                    }
                                }}/>
                </View>
            </View>
        )
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
    renderItem(img,text,type,isBorder){
        return(
            <TouchableOpacity
                style={{flex:1,}}
                disabled={this.state.deviceList.length > 0 ? false:true}
                activeOpacity={0.5}
                onPress={()=>{
                    switch (type){
                        case 1://布防
                            this.setState({
                                sendDeviceCmd:firstLevelCommand[0],
                            },()=>{
                                this.sendNetOrCommunicationsCommand.showModal();
                            });
                            break;
                        case 2:
                            this.setState({
                                sendDeviceCmd:firstLevelCommand[1],
                            },()=>{
                                this.sendNetOrCommunicationsCommand.showModal();
                            });
                            break;
                        case 3://智能设备开
                            break;
                        case 4:
                            break;
                    }
                }}
            >
                <View style={[styles.itemView,{
                    borderLeftColor:isBorder ? Colors.fontGray:'white',
                    borderLeftWidth:isBorder ? 1:null,
                    padding:HeightUtils.convert(15),
                }]}>
                    <Image
                        style={{width:WidthUtils.convert(80),height:HeightUtils.convert(80)}}
                        resizeMode={'contain'}
                        source={img}
                    />
                    <Text style={{fontSize: FontSizeUtils.convert(16),color:Colors.fontBlack,margin:WidthUtils.convert(10)}}>
                        {text}
                    </Text>
                </View>
            </TouchableOpacity>
        )
    }
    /**
     * 设备选择的 列表
     * */
    renderDeviceList(){
        return(
            <View style={{width: GlobalConfig.screenWidth * 0.8,backgroundColor:'white'}}>
                <Text style={{width: GlobalConfig.screenWidth * 0.8,textAlign:'center',padding:WidthUtils.convert(20),fontSize:FontSizeUtils.convert(18),color:'white',backgroundColor:Colors.appThemeColor}}>
                    设备选择
                </Text>
                <FlatList
                    keyExtractor={(item,index) => index+''}
                    data={this.state.deviceList}
                    renderItem={({item,index}) =>
                       <TouchableOpacity
                           style={{flex:1}}
                           activeOpacity={0.5}
                           onPress={()=>{
                               this.modalCloseImageAnimation(index);
                           }}
                       >
                           <View style={{padding:WidthUtils.convert(20),justifyContent:'center',alignItems:'center',
                                borderBottomColor:Colors.fontGray,borderBottomWidth:1,
                           }}>
                               <Text style={{fontSize:FontSizeUtils.convert(16),color:Colors.fontBlack}}>
                                   {item.deviceName}
                               </Text>
                           </View>
                       </TouchableOpacity>
                    }
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
                        Communications.text(this.state.deviceList[this.state.currentDeviceIndex].devicePhone,this.state.sendDeviceCmd);

                    }}
                >
                    短信
                </Text>
                <View style={{width: GlobalConfig.screenWidth * 0.8,backgroundColor:Colors.appThemeColor,height:1}}/>
                <Text style={{width: GlobalConfig.screenWidth * 0.8,textAlign:'center',padding:WidthUtils.convert(30),fontSize:FontSizeUtils.convert(16),color:Colors.fontBlack}}
                      onPress={()=>{
                          this.sendDeviceCommand(this.state.sendDeviceCmd);
                      }}
                >
                    网络
                </Text>
            </View>
        )

    }
    render(){
        return(
            <View style={styles.root}>
                <View style={{flexDirection:'row'}}>
                    {/*<Text style={{padding:WidthUtils.convert(50)}}*/}
                        {/*onPress={()=>{*/}
                            {/*Communications.text('18380265782','ahhahahahahhahewrwerwerwerwe');*/}
                        {/*}}*/}
                    {/*>*/}
                        {/**/}
                    {/*</Text>*/}
                    <TouchableOpacity
                        style={{flex:1}}
                        disabled={this.state.deviceList.length > 0 ? false:true}
                        activeOpacity={0.5}
                        onPress={()=>{
                             this.modalOpenImgAnimation();
                        }}
                    >
                        <View style={{flexDirection:'row',alignItems:'center',height:HeightUtils.convert(80),backgroundColor:Colors.appThemeColor,margin:WidthUtils.convert(30),borderRadius:WidthUtils.convert(3),}}>
                            <Text style={{flex:1,padding:WidthUtils.convert(20),fontSize:FontSizeUtils.convert(16),textAlign:'left',color:'white',}}>
                                {this.state.deviceList.length>0 ? this.state.deviceList[this.state.currentDeviceIndex].deviceName:'暂无设备,请添加设备'}
                            </Text>
                            <Animated.Image
                                source={require('./img/triangle.png')}
                                style={{width:WidthUtils.convert(40),height:HeightUtils.convert(40),marginRight:WidthUtils.convert(10),
                                    transform:[{rotateZ:this.state.imgRotateZValue.interpolate(
                                            {
                                                inputRange:[0,1],
                                                outputRange:['0deg','90deg']
                                            }
                                        )}]
                                }}
                                resizeMode={'contain'}
                            />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={()=>{
                            this.props.navigation.navigate('AddDevice',{initIndex:initIndex,saveDevice:(device)=>{
                                    // deviceList.push(device);
                                    Store.push('device',device);
                                },setInitIndex:(index)=>{initIndex = index}});
                        }}
                    >
                        <View style={{width:HeightUtils.convert(80),height:HeightUtils.convert(80),backgroundColor:Colors.appThemeColor,borderRadius:WidthUtils.convert(3),margin:WidthUtils.convert(30),justifyContent:'center',alignItems:'center'}}>
                            <Text  style={{color:'white',fontSize:FontSizeUtils.convert(30)}}
                            >
                                +
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{marginTop: WidthUtils.convert(120)}}>
                    <View style={{flexDirection:'row',justifyContent:'space-around'}}>
                        {this.renderItem(require('./img/open.png'),'布防',1)}
                        {this.renderItem(require('./img/close.png'),'撤防',2,true)}
                    </View>
                    <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-around',margin:WidthUtils.convert(30)}}>
                        <View style={{flex:1,backgroundColor:Colors.fontGray,height:1,margin:WidthUtils.convert(40)}}/>
                        <TouchableOpacity
                            activeOpacity={0.5}
                            disabled={this.state.deviceList.length > 0 ? false:true}
                            onPress={()=>{
                                this.props.navigation.navigate('DeviceMoreSetting',{initIndex:initIndex,setInitIndex:(index)=>{initIndex = index}});
                            }}
                        >
                            <View style={{width:WidthUtils.convert(140),height:WidthUtils.convert(140),backgroundColor:Colors.appThemeColor,borderRadius:90,justifyContent:'center'}}>
                                <Text style={{fontSize:16,color:'white',alignSelf: 'center'}}>
                                    设置
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <View style={{flex:1,backgroundColor:Colors.fontGray,height:1,margin:WidthUtils.convert(40)}}/>

                    </View>
                    <View style={{flexDirection:'row'}}>
                        {this.renderItem(require('./img/device_open.png'),'智能设备开',3)}
                        {this.renderItem(require('./img/device_close.png'),'智能设备关',4,true)}
                    </View>
                </View>

                <CustomModal
                    ref={o => this.CustomModal = o}
                    renderContent={this.renderDeviceList()}
                />
                <CustomModal
                    ref={o => this.RegLoginCustomModal = o}
                    renderContent={this.renderRegOrLogin(this.state.regOrLoginTitle,this.state.regOrLoginBtn)}
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
const styles=StyleSheet.create({
    root:{
        flex:1,
        backgroundColor:'white',
        // justifyContent:'space-around',
        // alignItems:'center'
    },
    itemView:{
        justifyContent: 'center',
        alignItems: 'center',
    },
})