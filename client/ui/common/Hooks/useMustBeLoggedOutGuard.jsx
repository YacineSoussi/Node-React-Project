import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { isUserAuthenticated } from '../../../adapters/AuthenticationService';
import {appRouteNames} from '../../../configuration/appRoutes';

export function useMustBeLoggedOutGuard() {
    const history = useHistory();

    useEffect(() =>{
        if(isUserAuthenticated()) {
            history.push(appRouteNames.ANALYTIC_SITE)
        }
    }, [history]);
}
