import { EditProfile } from '../ui/views/components/Account/EditProfile';
import { LogsComponent } from '../ui/views/components/LogsComponent';
import { MessagerieApp } from '../ui/views/components/messagerie/MessagerieApp';
import { MyAccount } from '../ui/views/components/Account/MyAccount';
import { RedirectToHome } from '../ui/views/components/RedirectToHome';
import { ResetPassword } from '../ui/views/components/Account/ResetPassword';
import { UserAnalytic } from '../ui/views/components/UserAnalytic';
import { UserLogin } from '../ui/views/components/UserLogin';
import { UserLogout } from '../ui/views/components/UserLogout';
import { UserRegister } from '../ui/views/components/UserRegister';

export const appRouteNames = {
    LOGIN_USER: '/login',
    LOGOUT_USER: '/logout',
    ACCOUNT_INFO: '/profile',
    EDIT_PROFILE: '/profile/edit',
    REGISTER_USER: '/register',
    ANALYTIC_SITE: '/analytic',
    LOGS_SITE: '/logs',
    RESET_PASSWORD: '/profile/resetPassword',
    MESSAGERIE: '/messagerie'
};

export const appRoutes = [
    {path: appRouteNames.REGISTER_USER, component: UserRegister, exact: true },
    { path: appRouteNames.LOGOUT_USER, component: UserLogout, exact: true },
    { path: appRouteNames.LOGIN_USER, component: UserLogin, exact: true },
    {path: appRouteNames.EDIT_PROFILE, component: EditProfile, exact: true },
    { path: appRouteNames.ANALYTIC_SITE, component: UserAnalytic, exact: true },
    { path: appRouteNames.LOGS_SITE, component:LogsComponent, exact: true },
    { path: appRouteNames.MESSAGERIE, component:MessagerieApp, exact: true },
    { path: appRouteNames.ACCOUNT_INFO, component:MyAccount, exact: true},
    { path: appRouteNames.RESET_PASSWORD, component:ResetPassword, exact: true},
    { path: '/', component: RedirectToHome }
];