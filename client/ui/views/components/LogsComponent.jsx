import React from 'react';
import { useMustBeAdmin } from '../../common/Hooks/useMustBeAdmin';
import { useMustBeAuthenticateGuard } from '../../common/Hooks/useMustBeAuthenticateGuard';

export const LogsComponent = () => {
    useMustBeAuthenticateGuard();
    useMustBeAdmin();
    return (<div>Logs ...</div>);
}