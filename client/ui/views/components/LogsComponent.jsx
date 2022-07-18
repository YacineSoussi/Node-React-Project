// this component but be renamed actuel "LogsComponent"
import React from 'react';
import { useMustBeAuthenticateGuard } from '../../common/Hooks/useMustBeAuthenticateGuard';

export const LogsComponent = () => {

        useMustBeAuthenticateGuard();
        return (
            <div>il faudra afficher les logs ici </div>
        )

}