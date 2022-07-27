import {appRouteNames} from '../../../configuration/appRoutes';
import { isUserAuthenticated } from '../../../adapters/AuthenticationService';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

export function useMustBeAuthenticateGuard (){
    const history = useHistory();

    useEffect(() => {
        if(!isUserAuthenticated()){
            history.push(appRouteNames.LOGIN_USER);
        }
    }, [history]);
}