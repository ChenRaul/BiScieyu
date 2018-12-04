
// index	主命令	源类型标识	源ID	 目的ID	数据段	数据段结束标志‘.’(1B)
//接收的数据格式如上

export default class ParseResponseData{

    //解析数据末位是 是否成功的数据段方法。
    //注册，登录，心跳，绑定设备，解除绑定设备,给APP取名字,给设备发送命令,设置设备名字
    static parseIsSuccess(array){
        const responseEndIsSuccess={
            responseIndex:0,//对应发送的序列号
            commandIndex:0,//返回的主命令应该都是8，除了报警
            from:0,////由于数据返回都是服务器，所以应该固定是3
            deviceId:0,//源ID	 设备的id,默认是0
            appId:0,////返回的destinationId其实就是appId
            success:0////是否成功，由于包含一个结束符号'.',s所以实际上成功是'1.',失败时'0.'

        };
        responseEndIsSuccess.responseIndex=array[0];//对应发送的序列号
        responseEndIsSuccess.commandIndex=array[1];//返回的主命令应该都是8，除了报警
        responseEndIsSuccess.from=array[2];//由于数据返回都是服务器，所以应该固定是3
        responseEndIsSuccess.deviceId=array[3];//设备的id,绑定设备是需要
        responseEndIsSuccess.appId=array[4];//返回的destinationId其实就是appId
        responseEndIsSuccess.success=array[5];//是否成功，由于包含一个结束符号'.',s所以实际上成功是'1.',失败时'0.'
        return responseEndIsSuccess;
    }
    //解析返回后的数据末位是数据段的方法
    //获取APP名字,获取设备列表，获取设备名字，获取设备的电话号码
    static parseIsData(array){
        let responseEndIsData={
            responseIndex:0,//对应发送的序列号
            commandIndex:0,//返回的主命令应该都是8，除了报警
            from:0,////由于数据返回都是服务器，所以应该固定是3
            deviceId:0,//源ID	 设备的id,默认是0
            appId:0,////返回的destinationId其实就是appId
            data:0////这是一个数据段,通过数据段的长度判断是否成功

        };
        responseEndIsData.responseIndex=array[0];//对应发送的序列号
        responseEndIsData.commandIndex=array[1];//返回的主命令应该都是8，除了报警
        responseEndIsData.from=array[2];//由于数据返回都是服务器，所以应该固定是3
        responseEndIsData.deviceId=array[3];//设备的id,绑定设备是需要
        responseEndIsData.appId=array[4];//返回的destinationId其实就是appId
        responseEndIsData.data=array[5];//这是一个数据段,通过数据段的长度判断是否成功
        return responseEndIsData;
    }
}