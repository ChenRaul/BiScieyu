import React, { Component} from 'react';
import {
    View,
    TouchableOpacity,
    StyleSheet,
    Modal, Dimensions,
} from 'react-native';
import GlobalConfig from "../GlobalConfig";
let modalWidth = Dimensions.get('window').width;

 class AecAlertNoBtnModal extends Component {

     static defaultProps={
         contentMinHeight:200,//弹出框的内容最小高度
     }
     constructor(props) {
         super(props)
         this.state = {
             visible: false,
         };
     }

     /**
      *
      */
     showModal() {
         this.setState({
             visible: true
         });
     }

     /**
      *
      */
     closeModal() {
         if (this.props.delayClose != undefined && this.props.delayClose) {
             setTimeout(() => {
                 this.setState({
                     visible: false
                 });
                 if(this.props.hidenModal)
                 {
                    this.props.hidenModal();
                 }
             }, 500)
         } else {
             console.log('关闭')
             this.setState({
                 visible: false
             });
             if(this.props.hidenModal)
             {
                this.props.hidenModal();
             }
         }
     }


     render() {
         return (
             <Modal
                 onRequestClose={() => {
                     // console.log('点击了返回键')
                     this.setState({
                         visible: false
                     });
                 }}
                 visible={this.state.visible}
                 transparent={true}>
                 {/*<TouchableOpacity style={{flex: 1}} activeOpacity={1} onPress={this.closeModal.bind(this)}>*/}
                     <View style={styles.container}>
                         <View style={[styles.background,{
                             // minHeight: this.props.contentMinHeight,
                             maxHeight:GlobalConfig.screenHeight*0.6
                         }]}>
                             {this.props.renderContent}
                         </View>
                     </View>
                 {/*</TouchableOpacity>*/}
             </Modal>
         )
     }
 }

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent:'center',
        alignItems:'center'
    },
    background: {
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        width: modalWidth * 0.8,
        borderColor: '#fff',
        borderRadius: 5,
        // borderWidth: 1,
    }
})

export default AecAlertNoBtnModal;
