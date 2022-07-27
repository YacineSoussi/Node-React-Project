import {getAccessToken, getUserPersona} from './CookiesAppStorage';

export function isUserAuthenticated(){
    return getAccessToken() !== '';
}

export function isAdmin(){
    return getUserPersona() === 'admin';

}