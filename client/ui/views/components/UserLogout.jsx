import { removeAccessToken, removeUserData } from "../../../adapters/CookiesAppStorage";

import { appRouteNames } from '../../../configuration/appRoutes';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom'

export const UserLogout = () => {
    const history = useHistory();
    useEffect(() => {
        removeAccessToken();
        removeUserData();
        history.push(appRouteNames.LOGIN_USER)
    }, [history])
};