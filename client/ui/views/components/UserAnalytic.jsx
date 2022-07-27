import React from 'react';
import {useMustBeAuthenticateGuard} from '../../common/Hooks/useMustBeAuthenticateGuard';

export const UserAnalytic = () => {
    // TODO this hook(useMustBeAuthenticateGuard) will be after intialise the variables even then useState if there will be
    useMustBeAuthenticateGuard();
    return (
        <div>
            Il faut faire de l'analytic
        </div>
    )
}