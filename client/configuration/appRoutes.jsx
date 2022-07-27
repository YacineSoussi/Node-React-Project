
import {UserRegister} from '../ui/views/components/UserRegister';
import {UserLogin} from '../ui/views/components/UserLogin';
import {UserLogout} from '../ui/views/components/UserLogout';
import {UserAnalytic} from '../ui/views/components/UserAnalytic';
import {RedirectToHome} from '../ui/views/components/RedirectToHome';
import {LogsComponent} from '../ui/views/components/LogsComponent';
import { MessagerieApp } from '../ui/views/components/messagerie/MessagerieApp';
import { UserList } from '../ui/views/components/UserList';
import { PendingList } from '../ui/views/components/PendingList';
import { MyFriends } from '../ui/views/components/MyFriends';
import { SignalList } from '../ui/views/components/UsersSignaled';
import { BlockList } from '../ui/views/components/UsersBlocked';





export const appRouteNames = {

    LOGIN_USER: '/login',
    LOGOUT_USER: '/logout',
    REGISTER_USER: '/register',
    ANALYTIC_SITE: '/analytic',
    LOGS_SITE: '/logs',
    MESSAGERIE: '/messagerie',
    USERLIST: '/users',
    PENDING: '/pendings',
    SHOWFRIENDS: '/my-friends',
    SHOWBLOCKED: '/blocked/users',
    SHOWSIGNALED: '/signaled/users',
};

export const appRoutes = [
    {path: appRouteNames.REGISTER_USER, component: UserRegister, exact: true },
    { path: appRouteNames.LOGOUT_USER, component: UserLogout, exact: true },
    { path: appRouteNames.LOGIN_USER, component: UserLogin, exact: true },
    { path: appRouteNames.ANALYTIC_SITE, component: UserAnalytic, exact: true },
    { path: appRouteNames.LOGS_SITE, component:LogsComponent, exact: true },
    { path: appRouteNames.MESSAGERIE, component:MessagerieApp, exact: true },
    { path: appRouteNames.USERLIST, component:UserList, exact: true },
    { path: appRouteNames.SHOWFRIENDS, component:MyFriends, exact: true },
    { path: appRouteNames.PENDING, component:PendingList, exact: true },
    { path: appRouteNames.SHOWBLOCKED, component:BlockList, exact: true },
    { path: appRouteNames.SHOWSIGNALED, component:SignalList, exact: true },

    
    { path: '*', component: RedirectToHome }
];  