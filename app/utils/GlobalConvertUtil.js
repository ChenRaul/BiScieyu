import React from "react";

/**
 * 时间格式化工具
 */
class GlobalConvertUtil extends React.Component {

    /**
     * swxy
     * @param currentstep
     * @returns {string}
     */
    static getCurrentstepStr(currentstep){
        var resourceStr = "未认领";
        switch(currentstep){
            case 3:
                resourceStr = "未认领"
                break;
            case 4:
                resourceStr = "已变更"
                break;
            case 5:
            case 6:
                resourceStr = "未开始"
                break;
            case 7:
            case 8:
            case 9:
            case 10:
            case 11:
                resourceStr = "进行中"
                break;
            case 12:
            case 13:
            case 14:
                resourceStr = "已完成"
                break;
            default:
                break;
        }
        return resourceStr;
    }
    static getDoingPatrolStepStr(currentStep){
        var resourceStr = "目的签到";
        switch(currentStep){
            case 6:
                resourceStr = "目的签到"
                break;
            case 7:
                resourceStr = "巡检录入"
                break;
            case 8:
                resourceStr = "客户确认"
                break;
            case 9:
                resourceStr = "事后总结"
                break;
            default:
                break;
        }
        return resourceStr;
    }
    /**
     * wxy 巡检管理
     * @param currentstep
     * @returns {string}
     */
    static getCurrentParolstepStr(currentstep){
        var resourceStr = "未认领";
        switch(currentstep){
            case 2:
                resourceStr = "未认领"
                break;
            case 3:
                resourceStr = "未改派"
                break;
            case 4:
            case 5:
                resourceStr = "未开始"
                break;
            case 6:
                resourceStr = "目的签到"
                break;
            case 7:
                resourceStr = "巡检录入"
                break;
            case 8:
                resourceStr = "客户确认"
                break;
            case 9:
                resourceStr = "事后总结"
                break;
            case 10:
            case 11:
            case 12:
                resourceStr = "已完成"
                break;
            default:
                break;
        }
        return resourceStr;
    }

    /**
     * wxy 巡检计划
     * @param currentstep
     * @returns {string}
     */
    static getCurrentPlanstepStr(currentstep){
        var resourceStr = "未执行";
        switch(currentstep){
            case 0:
                resourceStr = "未执行"
                break;
            case 1:
                resourceStr = "执行中"
                break;
            case 2:
                resourceStr = "已执行"
                break;
            case 3:
                resourceStr = "终止"
                break;
        }
        return resourceStr;
    }

    /**
     * wxy 巡检计划
     * @param currentstep
     * @returns {string}
     */
    static getCurrentPlanstepColor(currentstep){
        var resourceStr = "#ffcc00";
        switch(currentstep){
            case 0:
                resourceStr = "#ffcc00"
                break;
            case 1:
                resourceStr = "#FF8039"
                break;
            case 2:
                resourceStr = "#1DC646"
                break;
            case 3:
                resourceStr = "#ff0000"
                break;
        }
        return resourceStr;
    }

    /**
     *
     * @param repairsource
     * @returns {string}
     */
    static getResourceStr(repairsource){
        var resourceStr = "";
        switch(repairsource){
            case 0:
                resourceStr = "电话报修"
                break;
            case 1:
                resourceStr = "服务回访"
                break;
            case 2:
                resourceStr = "远程监控"
                break;
            case 3:
                resourceStr = "客户网站"
                break;
            case 4:
                resourceStr = "移动维保APP"
                break;
            case 5:
                resourceStr = "现场巡检"
                break;
            default:
                break;
        }
        return resourceStr;
    }
    /**
     *
     * @param repairsource
     * @returns {string}
     */
    static getPatrolResourceStr(repairsource){
        var resourceStr = "";
        switch(repairsource){
            case 0:
                resourceStr = "电话报检"
                break;
            case 1:
                resourceStr = "服务回访"
                break;
            case 2:
                resourceStr = "后台巡检计划"
                break;
            case 3:
                resourceStr = "移动维保APP"
                break;
            case 4:
                resourceStr = "客户网站"
                break;
            default:
                break;
        }
        return resourceStr;
    }
    /**
     *
     * @param solveresult
     * @returns {string}
     */
    static getSolveResultStr(solveresult){
        var resourceStr = "";
        switch(solveresult){
            case 0:
                resourceStr = "未修复"
                break;
            case 1:
                resourceStr = "已修复"
                break;
            default:
                resourceStr = ""
                break;
        }
        return resourceStr;
    }

    /**
     * wxy
     * @param state
     * @returns {string}
     */
    static getRepairStateStr(state){
        var resourceStr = "未审核";
        switch(state){
            case 0:
                resourceStr = "未审核"
                break;
            case 1:
                resourceStr = "审核通过"
                break;
            case 2:
                resourceStr = "审核未通过"
                break;
            case 3:
                resourceStr = "终止"
                break;
        }
        return resourceStr;
    }

    /**
     * wxy
     * @param state
     * @returns {string}
     */
    static getRepairColorStr(state){
        var resourceStr = "#ff0000";
        switch(state){
            case 0:
                resourceStr = "#ff0000"
                break;
            case 1:
                resourceStr = "#249F6E"
                break;
            case 2:
                resourceStr = "#ff0000"
                break;
            case 3:
                resourceStr = "#ff0000"
                break;
        }
        return resourceStr;
    }

    /**
     * wxy
     * @param source
     * @returns {string}
     */
    static getPatrolSourceStr(source){
        var resultStr = "电话报检";
        switch(source){
            case 0:
                resultStr = "电话报检"
                break;
            case 1:
                resultStr = "服务回访"
                break;
            case 2:
                resultStr = "后台巡检计划"
                break;
            case 3:
                resultStr = "维保App"
                break;
            case 4:
                resultStr = "客户网站"
                break;
        }
        return resultStr;
    }
}

module.exports = GlobalConvertUtil;
