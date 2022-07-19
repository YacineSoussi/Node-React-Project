import {getAccessToken} from './CookiesAppStorage';

export function isUserAuthenticated(){
    return getAccessToken() !== '';
}