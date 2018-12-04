import React,{Component,} from 'react';
import {
    Text, View, Modal,StyleSheet,ActivityIndicator,BackHandler,Platform
} from "react-native";
import Colors from "../utils/Colors";
import WidthUtils from "../utils/WidthUtils";
import GlobalConfig from "../GlobalConfig";
import FontSizeUtils from "../utils/FontSizeUtils";
/**
 *
 *后台任务进行时的 Loading提示组件，
 * @author chenshuai
* */
export default class DialogLoadingView extends  Component{
    static defaultProps = {
        visible : false,//是否显示
        content:'',//提示内容
        //默认关闭方法是空的，需要父组件来编写该方法的逻辑
        close:()=>{},
    }
    constructor(props){
        super(props);
    }
    _close(){
        //调用父组件的关闭方法，实际上就是在被调用的地方来修改visible属性值
        //也就是说使用该自定义组件时，closeModal这个属性方法必须要写
        this.props.close();
    }
    render(){
        return(
            <Modal
                transparent={true}
                /*由调用的地方来决定是否显示*/
                visible={this.props.visible}
                animationType={'fade'}
                //
                // android必须使用此属性，当手机的物理返回按钮被点击后，就会调用该方法，所以不需要再去监听返回键BackHandler事件了
                onRequestClose={this._close.bind(this)}
                cancelable
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalBorderView}>
                            <ActivityIndicator size={Platform.OS ==='android' ? 30 :'small'} color={Colors.appThemeColor} />
                            <Text style={[styles.modalText]}>
                                {this.props.content}
                            </Text>
                    </View>
                </View>
            </Modal>
        )
    }
}
const styles = StyleSheet.create({
    container:{
        backgroundColor:'white',
        height:GlobalConfig.screenHeight,
    },
    modalContainer:{
        width:GlobalConfig.screenWidth,
        height:GlobalConfig.screenHeight,
        alignItems:'center',
        justifyContent:'center',
    },
    modalBorderView:{
        width:WidthUtils.convert(140),
        height:WidthUtils.convert(140),
        borderRadius:WidthUtils.convert(5),
        backgroundColor:'#808080cc',
        marginBottom:WidthUtils.convert(200),
        alignItems:'center',
        justifyContent:'center',
    },
    modalText:{
        fontSize:FontSizeUtils.convert(14),
        color:'white',
        marginTop:WidthUtils.convert(15),
        textAlign:'center'
    }

})