import GlobalConfig from "../GlobalConfig";

/**
 * UI设计按照1280*720分辨率来设计ui的，所以我们以这个分辨率为参考标准
 * @param height px
 * @returns {*}
 */
const convert = (height) => {
    return GlobalConfig.screenHeight * (height / 1280);
};
export default {
    convert
};
