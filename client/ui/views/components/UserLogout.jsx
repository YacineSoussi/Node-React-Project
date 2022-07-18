import React, {useEffect} from 'react';
import { useHistory } from 'react-router-dom'
import { removeAccessToken, removeUserData } from "../../../adapters/CookiesAppStorage";
import {appRouteNames} from '../../../configuration/appRoutes';

export const UserLogout = () => {
    const history = useHistory();
    useEffect(() => {
        removeAccessToken();
        removeUserData();
        history.push(appRouteNames.LOGIN_USER)
    }, [history])
};