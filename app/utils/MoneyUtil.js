import React from "react";

/**
 * 金额格式化工具
 */
class MoneyUtil extends React.Component {
    
    /**
     * 格式化money
     * s为要格式化的money
     * n为小数位数
     */
    static forMartMoney(s, n){   
        if(s==='')
           return;
        n = n > 0 && n <= 20 ? n : 2;   
        s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";   
        var l = s.split(".")[0].split("").reverse(),   
        r = s.split(".")[1];   
        var t = "";   
        for(let i = 0; i < l.length; i ++ ) {   
            t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");   
        }   
        return t.split("").reverse().join("") + "." + r;   
   } 


   /**
     * 格式化数字为百分比 100%
     * 直接加%
     */
    static forMatPercent(s){
        try{
            var f = parseFloat(s);
            var s_str=f.toFixed()+"%";
            return s_str;
        }
        catch(msg)
        {
            return "0%";
        }
   }

   /**
     * 格式化数字为百分比 100%
     * 乘以100后加%
     */
    static forMatPercentX(s){
        try{
            var f = parseFloat(s)*100;
            var s_str=f.toFixed()+"%";
            return s_str;
        }
        catch(msg)
        {
            return "0%";
        }
   }
}

module.exports = MoneyUtil;