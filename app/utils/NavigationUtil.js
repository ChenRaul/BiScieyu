/**
 * Created by Administrator on 2018/1/22.
 */
import { NavigationActions } from 'react-navigation';

/**
 *  wxy
 * @param navigation
 * @param routeName
 * @param params
 */
const reset = (navigation, routeName, params) => {
    const resetAction = NavigationActions.reset({
        index: 0,
        actions: [
            NavigationActions.navigate({routeName, params})
        ]
    });
    navigation.dispatch(resetAction);
};

export default {
    reset
};
