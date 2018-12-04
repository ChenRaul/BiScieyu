import AppCommandIndex from "./AppCommandIndex";

const from = 1;//源类型标识都是APP
export default class GetCommand{

    //'1,1,1,0,0,1234.';
    static getRegCommand(index,password){

        return index+','+AppCommandIndex.register+','+from+',0,0,'+password+'.';
    }
    //'1,1,1,0,0,1234.';
    static getLoginCommand(index,appId,password){

        return index+','+AppCommandIndex.login+','+from+','+appId+',0,'+password+'.';
    }

    static getLinkCommand(index,appId,){
        return index+','+AppCommandIndex.link+','+from+','+appId+',0.';
    }
    //绑定
    static getBindDeviceCommand(index,appId,devicePhone){
        return index+','+AppCommandIndex.bindDevice+','+from+','+appId+',0,'+devicePhone+'.';
    }
    //解除绑定
    static getUnbindDeviceCommand(index,appId,deviceId){
        return index+','+AppCommandIndex.unBindDevice+','+from+','+appId+','+deviceId+'.';
    }
    //设置APPname
    static getSetAppNameCommand(index,appId,appName){
        return index+','+AppCommandIndex.appName+','+from+','+appId+',0,'+appName+'.';
    }
    //获取APP Name
    static getAppNameCommand(index,appId){
        return index+','+AppCommandIndex.appName+','+from+','+appId+',0'+'.';
    }
    //获取设备列表
    static getDeviceListCommand(index,appId){
        return index+','+AppCommandIndex.getDeviceList+','+from+','+appId+',0'+'.';
    }
    //给设备发送命令，这些命令与发送短信的一致
    static getDeviceCommand(index,appId,deviceId,deviceCmdString){
        return index+','+AppCommandIndex.deviceCmd+','+from+','+appId+','+deviceId+','+deviceCmdString+'.';
    }

    //设置设备的名字
    static getSetDeviceNameCommand(index,appId,deviceId,deviceNameString){
        return index+','+AppCommandIndex.deviceCmd+','+from+','+appId+','+deviceId+','+'#N:'+deviceNameString+'.';
    }
    //获取设备的名字
    static getDeviceNameCommand(index,appId,deviceId){
        return index+','+AppCommandIndex.deviceCmd+','+from+','+appId+','+deviceId+','+'#N'+'.';
    }
    //获取设备的电话
    static getDevicePhoneCommand(index,appId,deviceId){
        return index+','+AppCommandIndex.deviceCmd+','+from+','+appId+','+deviceId+','+'#T'+'.';
    }

}
// index	主命令	源类型标识	源ID	 目的ID	数据段	数据段结束标志‘.’(1B)