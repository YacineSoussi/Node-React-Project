
import {UserRegister} from '../ui/views/components/UserRegister';
import {UserLogin} from '../ui/views/components/UserLogin';
import {UserLogout} from '../ui/views/components/UserLogout';
import {UserAnalytic} from '../ui/views/components/UserAnalytic';
import {RedirectToHome} from '../ui/views/components/RedirectToHome';
import {LogsComponent} from '../ui/views/components/LogsComponent';
import { MessagerieApp } from '../ui/views/components/messagerie/MessagerieApp';
import { UserList } from '../ui/views/components/UserList';
import { PendingList } from '../ui/views/components/PendingList';


export const appRouteNames = {

    LOGIN_USER: '/login',
    LOGOUT_USER: '/logout',
    REGISTER_USER: '/register',
    ANALYTIC_SITE: '/analytic',
    LOGS_SITE: '/logs',
    MESSAGERIE: '/messagerie',
    USERLIST: '/users',
    PENDING: '/pendings',
};

export const appRoutes = [
    {path: appRouteNames.REGISTER_USER, component: UserRegister, exact: true },
    { path: appRouteNames.LOGOUT_USER, component: UserLogout, exact: true },
    { path: appRouteNames.LOGIN_USER, component: UserLogin, exact: true },
    { path: appRouteNames.ANALYTIC_SITE, component: UserAnalytic, exact: true },
    { path: appRouteNames.LOGS_SITE, component:LogsComponent, exact: true },
    { path: appRouteNames.MESSAGERIE, component:MessagerieApp, exact: true },
    { path: appRouteNames.USERLIST, component:UserList, exact: true },
    { path: appRouteNames.PENDING, component:PendingList, exact: true },

    
    { path: '*', component: RedirectToHome }
];  