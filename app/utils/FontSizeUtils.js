import {Platform} from 'react-native';
import GlobalConfig from "../GlobalConfig";

/**
 *
 * @param sizeDp
 * @returns {*}
 */
const convert = (sizeDp) => {
    if (Platform.OS == 'ios') {
        return sizeDp - GlobalConfig.screenDensity;
    } else {
        return sizeDp;
    }
};
export default {
    convert
};
