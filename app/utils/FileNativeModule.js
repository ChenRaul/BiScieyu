'use strict';


import {NativeModules, Platform} from 'react-native';


/**
 * 原生的文件操作Moudle，目前只有保存文件，主要是故障图片统一保存到一个文件夹，文件夹的名称和APP的名称一样
 *
 * 图片数组保存，android端方法saveImageArray(Array array,type),array是图片路径数组；saveSingleImage（Stirng path,type），path单个图片路径
 *其中type==0照片保存，保存到APP主目录“移动维保”下的“照片”目录，
 * type==1签名保存，保存到APP主目录“移动维保”下的“签名”目录，
 *
 *
 * IOS 端暂不支持
 * */

const saveImageArray=(imagePathList,type)=>{
    if (Platform.OS === 'android') {
        NativeModules.FileNativeModule.saveImageArray(imagePathList,type);
    }else{

    }
}

const saveSingleImage=(imagePath,type)=>{
    if (Platform.OS === 'android') {
        NativeModules.FileNativeModule.saveSingleImage(imagePath,type);
    }else{

    }
}
const FileNativeModule ={
    saveImageArray,
    saveSingleImage
}
module.exports = FileNativeModule;