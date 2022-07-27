import { useMustBeAdmin, useMustBeAuthenticateGuard } from '../../common/Hooks/useMustBeAuthenticateGuard';

import React from 'react';

export const LogsComponent = () => {
    useMustBeAuthenticateGuard();
    useMustBeAdmin();
    return (<div>Logs ...</div>);
}