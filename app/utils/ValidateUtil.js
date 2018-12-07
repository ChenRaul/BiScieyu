import React from "react";

/**
 * 文本输入框验证
 */
class ValidateUtil extends React.Component {

    /**
     * 正整数
     * @param value
     * @returns {boolean}
     * @constructor
     */
    static ValidateInt(value) {
        if (null == value || value == '') {
            return false;
        } else {
            var regu =  "^[+]{0,1}(\\d+)$";
            var reg = new RegExp(regu);
            return reg.test(value);
        }
    }

    /**
     * 正浮 点数
     * @param value
     * @returns {boolean}
     * @constructor
     */
    static ValidateFloat(value) {
        if (null == value || value == '') {
            return false;
        } else {
            var regu =  "^([1-9]+(\\.\\d+)?|0\\.\\d+)$";
            var reg = new RegExp(regu);
            return reg.test(value);
        }
    }

    /**
     * 正浮点数(包括小数验证)
     * @param value
     * @returns {boolean}
     * @constructor
     */
    static ValidateNumber(value) {
        if (null == value || value == '') {
            return false;
        } else {
            var regu = /^[1-9]\d*\.\d*|0\.\d*[1-9]\d*$/;
            // var reg = new RegExp(regu);
            return regu.test(value);
        }
    }

    /**
     * 验证钱或者价格的输入格式，实际上是非负实数验证 >=0
     */
    static ValidateMoney(value){
        if (null == value || value == '') {
            return false;
        } else {
            //验证浮点数，
            //let reg = /^[0-9]+(.[0-9]{1,})?$/;
            let regu="^\\d+(\\.[0-9]{0,})?$";
            var reg = new RegExp(regu);
            return reg.test(value);
        }
    }

    /**
     * 座机 不识别区号
     * @param value
     * @returns {boolean}
     * @constructor
     */
    static ValidateTelphone(value) {
        if (null == value || value == '') {
            return false;
        } else {
            var regu =  "^([0-9]{3,4}-)?[0-9]{7,8}$";
            var reg = new RegExp(regu);
            return reg.test(value);
        }
    }
    /**
     * 验证手机号码
     * @param value
     * @returns {boolean}
     * @constructor
     */
    static ValidateMobile(value) {
        if (null == value || value == '') {
            return false;
        } else {
            var regu =  "^1(3|4|5|7|8)\\d{11}$";
            var reg = new RegExp(regu);
            return reg.test(value);
        }
    }
    /**
     *能识别电话号码包括座机(是否含区号)。手机
     */
    static ValidateMobileAndTelPhone(value){
        if (null == value || value == '') {
            return false;
        } else {
            var regu =  "((\\d{11})|^((\\d{7,8})|(\\d{4}|\\d{3})-(\\d{7,8})|(\\d{4}|\\d{3})-(\\d{7,8})-(\\d{4}|\\d{3}|\\d{2}|\\d{1})|(\\d{7,8})-(\\d{4}|\\d{3}|\\d{2}|\\d{1}))$)";
            var reg = new RegExp(regu);
            return reg.test(value);
        }
    }

    /**
     *
     * @param value
     * @returns {boolean}
     * @constructor
     */
    static ValidateEmail(value) {
        if (null == value || value == '') {
            return false;
        } else {
            return true;
        }
    }

    /**
     * 验证IP地址
     * @param IP
     * @returns {boolean} true是 false否
     * @constructor
     */
    static ValidateIP(value) {
        if (null == value || value == '') {
            return false;
        } else {
            let reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
            return reg.test(value);
        }
    }

    /**
     * 验证 数字和26个英文字母(不区分大小写)组成的字符串,设备编号40位
     * @param value
     * @param count 最多多少位
     * @returns {boolean}
     * @constructor
     */
    static ValidateLetterOrNumber(value, count){
        if(null == value || value == ''){
            return false;
        }else {
            let reg = eval("/^[A-Za-z0-9]{1," + count + "}?$/");
            return reg.test(value)
        }
    }
}

module.exports = ValidateUtil;
