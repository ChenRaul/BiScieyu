import React from "react";
import {Text, TouchableOpacity, View} from "react-native";
import FontSizeUtils from "../utils/FontSizeUtils";

/***
 * 圆弧Text组件，为了兼容IOS
 */
export default class BorderText extends React.Component{
    //默认属性都是地图页面的项目item弹出窗显示的信息
    static defaultProps = {
        text:'',//默认内容
        textSize:FontSizeUtils.convert(14),//文字默认大小
        textColor:'#fff',//文字默认颜色
        marginRight:3,//
        marginLeft:0,
        borderRadius:90,
        backgroundColor:'#FF5945',
        padding:3,
        paddingLeft:10,
        paddingRight:10,
        onPress:null
    }
    render(){
        return(
            <TouchableOpacity
                disabled={this.props.onPress ? false:true}
                onPress={() => {this.props.onPress()}}
                activeOpacity={0.5}>
                <View style={{marginLeft:this.props.marginLeft,
                    marginRight:this.props.marginRight,
                    marginTop:this.props.marginTop,
                    borderRadius:this.props.borderRadius,
                    backgroundColor:this.props.backgroundColor,justifyContent:'center',alignItems:'center',
                    padding:this.props.padding,
                    paddingLeft:this.props.paddingLeft,
                    paddingRight:this.props.paddingRight}}>
                    <Text style={{color:this.props.textColor,fontSize:FontSizeUtils.convert(this.props.textSize),textAlign:'center'}}>
                        {this.props.text}
                    </Text>
                </View>
            </TouchableOpacity>
        )
    }
}
