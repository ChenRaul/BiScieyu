import React from "react";

/**
 * 时间格式化工具
 */
class DateTimeUtil extends React.Component {

    /**
     *
     * @param date
     * @returns {string}
     */
    static forMatDate(date) {
        if(!date){
            return'';
        }
        var tag="0001-01-01";
        if(date.toString().indexOf(tag)!=-1){
            return "0001-01-01";
        }
        try{
            let newdate = date.replace(/-/g,"/");
            var dateObj = new Date(newdate);
            return dateObj.getFullYear() + "-"
                + ((dateObj.getMonth() + 1) > 9 ? (dateObj.getMonth() + 1) : ("0" + (dateObj.getMonth() + 1))) + "-"
                + (dateObj.getDate() > 9 ? dateObj.getDate() : ("0" + dateObj.getDate()));
        }
        catch(ex){
            return date;
        }
    }

    /**
     * 日期格式化，返回年-月-日 时：分：秒
     * @param date
     * @returns {string}
     */
    static forMatDateTime(date) {
        var tag="0001-01-01";
        if(date.toString().indexOf(tag)!=-1){
            return "0001-01-01 00:00:00";
        }
        var dateObj = new Date(date);
        return dateObj.getFullYear() + "-"
            + ((dateObj.getMonth() + 1) > 9 ? (dateObj.getMonth() + 1) : ("0" + (dateObj.getMonth() + 1))) + "-"
            + (dateObj.getDate() > 9 ? dateObj.getDate() : ("0" + dateObj.getDate())) + " "
            + (dateObj.getHours() > 9 ? dateObj.getHours() : ("0" + dateObj.getHours())) + ":"
            + (dateObj.getMinutes() > 9 ? dateObj.getMinutes() : ("0" + dateObj.getMinutes())) + ":"
            + (dateObj.getSeconds() > 9 ? dateObj.getSeconds() : ("0" + dateObj.getSeconds()));
    }

    /**
     * 日期格式化，返回日期 星期几 时 分
     * @param date
     * @returns {string}
     */
    static forMatDateTimeDay(date) {
        let dateObj = new Date(date);
        let day = dateObj.getDay();
        let daystr = '';
        switch(day){
            case 0: daystr='星期日';break;
            case 1: daystr='星期一';break;
            case 2: daystr='星期二';break;
            case 3: daystr='星期三';break;
            case 4: daystr='星期四';break;
            case 5: daystr='星期五';break;
            case 6: daystr='星期六';break;
        }
        return dateObj.getFullYear() + "-"
            + ((dateObj.getMonth() + 1) > 9 ? (dateObj.getMonth() + 1) : ("0" + (dateObj.getMonth() + 1))) + "-"
            + (dateObj.getDate() > 9 ? dateObj.getDate() : ("0" + dateObj.getDate())) + " "
            + daystr+" "
            + (dateObj.getHours() > 9 ? dateObj.getHours() : ("0" + dateObj.getHours())) + ":"
            + (dateObj.getMinutes() > 9 ? dateObj.getMinutes() : ("0" + dateObj.getMinutes()));
    }


    /**
     * 字符串日期格式化，返回日期 星期几 时 分
     * @param date
     * @returns {string}
     */
    static forMatStringDateTimeDay(date) {
        var tag="0001-01-01";
        if(date.toString().indexOf(tag)!=-1){
             return "0001-01-01 00:00";
        }
        let newdate = date.replace(/-/g,"/");
        let dateObj = new Date(newdate);
        let day = dateObj.getDay();
        let daystr = '';
        switch(day){
            case 0: daystr='星期日';break;
            case 1: daystr='星期一';break;
            case 2: daystr='星期二';break;
            case 3: daystr='星期三';break;
            case 4: daystr='星期四';break;
            case 5: daystr='星期五';break;
            case 6: daystr='星期六';break;
        }
        return dateObj.getFullYear() + "-"
            + ((dateObj.getMonth() + 1) > 9 ? (dateObj.getMonth() + 1) : ("0" + (dateObj.getMonth() + 1))) + "-"
            + (dateObj.getDate() > 9 ? dateObj.getDate() : ("0" + dateObj.getDate())) + " "
            + daystr+" "
            + (dateObj.getHours() > 9 ? dateObj.getHours() : ("0" + dateObj.getHours())) + ":"
            + (dateObj.getMinutes() > 9 ? dateObj.getMinutes() : ("0" + dateObj.getMinutes()));
    }


    /**
     * 日期格式化，返回年-月-日 时：分
     * @param date
     * @returns {string}
     */
    static forMatDateTimeExSec(date) {
        var tag="0001-01-01";
        if(date.toString().indexOf(tag)!=-1){
            return "0001-01-01 00:00";
        }
        try{
            let newdate = date.replace(/-/g,"/");
            var dateObj = new Date(newdate);
            // return dateObj.getFullYear() + "-"
            //     + ((dateObj.getMonth() + 1) > 9 ? (dateObj.getMonth() + 1) : ("0" + (dateObj.getMonth() + 1))) + "-"
            //     + (dateObj.getDate() > 9 ? dateObj.getDate() : ("0" + dateObj.getDate())) + " "
            //     + (dateObj.getHours() > 9 ? dateObj.getHours() : ("0" + dateObj.getHours())) + ":"
            //     + (dateObj.getMinutes() > 9 ? dateObj.getMinutes() : ("0" + dateObj.getMinutes()));

            return dateObj.getFullYear() + "-"
            + (Array(2).join(0) + (dateObj.getMonth() + 1)).slice(-2) + "-"
            + (Array(2).join(0) + dateObj.getDate()).slice(-2) + " "
            + (Array(2).join(0) + dateObj.getHours()).slice(-2) + ":"
            + (Array(2).join(0) + dateObj.getMinutes()).slice(-2);
        }
        catch(ex){
            return date;
        }
    }
} 

module.exports = DateTimeUtil;