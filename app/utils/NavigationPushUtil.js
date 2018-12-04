/**
 * Created by wxy on 2018/7/12.
 */
import { NavigationActions } from 'react-navigation';
import GlobalConfig from "../actions/GlobalConfig";

/**
 *  wxy
 * @param navigation
 * @param routeName
 * @param params
 */
const push = (navigation, routeName, params) => {
    const navigationAction = NavigationActions.navigate({
        key: routeName,
        routeName: routeName,
        params: params
    });
    GlobalConfig.currentPageName = routeName;
    navigation.dispatch(navigationAction);
};

export default {
    push
};
