import { isAdmin } from '../../../adapters/AuthenticationService';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

export function useMustBeAdmin() {
    const history = useHistory();

    useEffect(() =>{
        if(!isAdmin()) {
            history.push('/')
        }
    }, [history]);
}