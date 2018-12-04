import {Alert} from "react-native";

export  default class AlertTool{
    static showOneBtnAlert(alertMsg,okClick){
        Alert.alert('提示:',
            alertMsg,
            [
                {
                    text: '确定',
                    onPress: okClick
                },
            ],
            {
                cancelable: false,
            });
    }

    static showTwoBtnAlert(alertMsg,cancelClick,okClick){
        Alert.alert('提示:',
            alertMsg,
            [
                {
                    text: '取消',
                    onPress:cancelClick,
                    style: 'cancel'
                },
                {
                    text: '确定',
                    onPress: okClick
                },
            ],
            {
                cancelable: false,
            });
    }
}