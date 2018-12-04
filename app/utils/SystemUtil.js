import React from "react";
import {Alert, PermissionsAndroid, Platform, Linking} from "react-native";
let DeviceInfo = require('react-native-device-info');

/**
 *
 */
class SystemUtil extends React.Component {

    /**
     * @returns {Promise<boolean>}
     */
    static async requestCameraPermission() {
        try {
            if (Platform.OS === 'ios') {
                return 1;
            }
            let granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
            if (DeviceInfo.getAPILevel() < 23) {
                return granted;
            } else {
                /*调用处根据返回的code来处理相应的事件*/
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    return 1;
                } else if(granted === PermissionsAndroid.RESULTS.DENIED) {//用户拒绝，提示继续获取权限
                    return 2;
                }else if(granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN){//系统已经直接拒绝，提示到系统设置页面设置，后面看能不能直接linking到设置界面
                    return 0;
                }
            }
        } catch (er) {
            return 0;
        }
    }

    /**
     * 获取服务器版本并比较
     * @param localVersion
     * @returns {number} 0表示已经是最新版本 1表示正常更新 2表示强制更新
     */
    static getAppServerVersion(localVersion, formUrl, callback) {
        try {
            fetch(formUrl).then(response => response.text()).then((response) => {
                var parseString = require('react-native-xml2js').parseString;
                parseString(response, function (err, result) {
                    if (SystemUtil.isNewVersion(localVersion, result.VersionDescription.ForceUpdateVersion)) {
                        callback(2, result);
                    } else {
                        if (SystemUtil.isNewVersion(localVersion, result.VersionDescription.Version)) {
                            callback(1, result);
                        } else {
                            callback(0, null);
                        }
                    }
                });
            }).catch((e) => {
                callback(0);
            });
        } catch (e) {
            callback(0);
        }
    }

    /**
     *
     * @param localVersion
     * @param serverVersion
     * @returns {boolean}
     */
    static isNewVersion(localVersion, serverVersion) {
        if (serverVersion.length > 0) {
           var localStrs = localVersion.toString().split('.');
            var serverStrs = serverVersion[0].toString().split('.');
            for (var i = 0; i < localStrs.length; i++) {
                if (parseInt(serverStrs[i]) > parseInt(localStrs[i])) {
                    return true;
                }
                if(parseInt(serverStrs[i]) < parseInt(localStrs[i])) {
                    return false;
                }
            }
        }
        return false;
    }

    /**
     *
     * @param formUrl
     */
    static downAppInstall(formUrl) {
        try {
            Linking.openURL(formUrl);
        } catch (e) {
        }
    }
}
module.exports = SystemUtil;
