/**
 * Created by Administrator on 2018/1/22.
 */
import React from 'react';
import GlobalConfig from "../GlobalConfig";
import Store from "react-native-simple-store";
import NavigationUtil from "./NavigationUtil";
import Promise from "pinkie";

class HttpFetchUtil extends React.Component {
    /**
     * @param server
     * @param url
     * @param params
     * @param callback
     */
    static sendGet(server, url, params, callback, navigate) {
        let request;
        let full_url = GlobalConfig.serveraddress + url;
        if (params) {
            let paramsArray = [];
            Object.keys(params).forEach(key => paramsArray.push(key + '=' + params[key]))
            if (full_url.search(/\?/) === -1) {
                full_url += '?' + paramsArray.join('&')
            } else {
                full_url += '&' + paramsArray.join('&')
            }
        }
        request = new Request(full_url, {
            method: 'GET',
            headers: ({
                'Content-Type': 'application/json',
                'UserSessionCacheConst': GlobalConfig.sessionid,
            })
        });
        this.promise_fetch(fetch(request))
            .then((response) => response.json())
            .then((jsonData) => {
                this.ValidateBack(jsonData, navigate, callback);
            }).catch((err) => {
            if (err == 'timeout') {
                callback({statuscode: -1});
                Alert.alert("提示", "请求超时，请重试", [{text: "确定"}]);
            } else {
                callback({statuscode: -1});
                Alert.alert("提示", "网络请求失败", [{text: "确定"}]);
            }
        });
    }

    /**
     *
     * @param jsonData
     * @param callback
     * @constructor
     */
    static ValidateBack(jsonData, navigate, callback) {
        switch (jsonData.statuscode) {
            case 2://会话失效
                Alert.alert("提示", "会话无效或异地登录了，请重新登录", [{text: "确定"}]);
                Store.delete('is_login');
                Store.delete('global_config');
                if (navigate != undefined && navigate != null) {
                    NavigationUtil.reset(navigate, 'Login');
                }
                break;
            default:
                callback(jsonData);
                break;
        }
    }

    /**
     *  post
     * @param server
     * @param url
     * @param params
     * @param callback
     */
    static sendPost(server, url, params, callback, navigate) {
        let request;
        let full_url = GlobalConfig.serveraddress + url;
        if (params) {
            let paramsArray = [];
            Object.keys(params).forEach(key => paramsArray.push(key + '=' + params[key]))
            if (full_url.search(/\?/) === -1) {
                full_url += '?' + paramsArray.join('&')
            } else {
                full_url += '&' + paramsArray.join('&')
            }
        }
        full_url = encodeURI(full_url);
        request = new Request(full_url, {
            method: 'POST',
            headers: ({
                'Content-Type': 'application/json',
                'UserSessionCacheConst': GlobalConfig.sessionid,
            })
        });
        this.promise_fetch(fetch(request))
            .then((response) => response.json())
            .then((jsonData) => {
                this.ValidateBack(jsonData, navigate, callback);
            }).catch((err) => {
            if (err == 'timeout') {
                callback({statuscode: -1});
                Alert.alert("提示", "请求超时，请重试", [{text: "确定"}]);
            } else {
                callback({statuscode: -1});
                Alert.alert("提示", "网络请求失败", [{text: "确定"}]);
            }
        });
    }

    /**
     *  post
     * @param server
     * @param url
     * @param params
     * @param callback
     */
    static sendPostBody(server, url, params, callback, navigate) {
        let request;
        let full_url = GlobalConfig.serveraddress + url;
        full_url = encodeURI(full_url);
        request = new Request(full_url, {
            method: 'POST',
            headers: ({
                'Content-Type': 'application/json',
                'UserSessionCacheConst': GlobalConfig.sessionid,
            }),
            body: JSON.stringify(params)
        });
        this.promise_fetch(fetch(request))
            .then((response) => response.json())
            .then((jsonData) => {
                this.ValidateBack(jsonData, navigate, callback);
            }).catch((err) => {
            if (err == 'timeout') {
                callback({statuscode: -1});
                Alert.alert("提示", "请求超时，请重试", [{text: "确定"}]);
            } else {
                callback({statuscode: -1});
                Alert.alert("提示", "网络请求失败", [{text: "确定"}]);
            }
        });
    }

    /**
     * 单张图片上传
     * @param server
     * @param url
     * @param filePath
     * @param fileName
     */
    static async sendUploadImage(server, url, filePath, fileName) {
        let formData = new FormData();
        let full_url = GlobalConfig.serveraddress + url;
        let file = {uri: filePath, type: 'application/octet-stream', name: fileName};
        formData.append("file", file);
        var response = await fetch(full_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data;charset=utf-8',
                'UserSessionCacheConst': GlobalConfig.sessionid,
            },
            body: formData,
        }).catch((err) => {
            Alert.alert("提示", "网络请求失败", [{text: "确定"}]);
            return '';
        });
        return response.json();
    }

    /**
     * 多张图片上传
     * @param server
     * @param url
     * @param filePaths
     * @param fileNames
     */
    static async sendUploadImages(server, url, filePaths, fileNames) {
        let formData = new FormData();
        let full_url = GlobalConfig.serveraddress + url;
        for (var i = 0; i < filePaths.length; i++) {
            let file = {uri: filePaths[i], type: 'multipart/form-data', name: fileNames[i]};
            formData.append("files", file);
        }
        var response = await fetch(full_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data;charset=utf-8',
                'UserSessionCacheConst': GlobalConfig.sessionid,
            },
            body: formData,
        }).catch((err) => {
            Alert.alert("提示", "网络请求失败", [{text: "确定"}]);
            return '';
        });
        return response.json();
    }

    /**
     * @param _fetch
     * @returns {*}
     */
    static promise_fetch(_fetch) {
        return Promise.race([
            _fetch,
            new Promise(function (resolve, reject) {
                setTimeout(() => reject(new Error('timeout')), 20000);
            })
        ]);
    }
}

module.exports = HttpFetchUtil;
