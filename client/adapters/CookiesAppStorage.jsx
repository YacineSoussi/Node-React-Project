import Cookies from 'js-cookie';

const ACCESS_TOKEN_COOKIE_KEY = 'access_token';
const USER_ID_COOKIE_KEY = 'id';
const USER_LASTNAME_COOKIE_KEY = 'lastname';
const USER_FIRSTNAME_COOKIE_KEY = 'firstname';
const USER_ROLE_COOKIE_KEY = 'persona';
const USER_EMAIL_COOKIE_KEY = 'email';
const USER_CREATED_AT_COOKIE_KEY = 'created_at';

export function storeAccessToken(accessToken) {
    Cookies.set(ACCESS_TOKEN_COOKIE_KEY, accessToken, { expires: getDateOfExpiration() });
}

export function removeAccessToken(){
    Cookies.remove(ACCESS_TOKEN_COOKIE_KEY);
}

export function getAccessToken(){
    return Cookies.get(ACCESS_TOKEN_COOKIE_KEY) || '';
}

export function storeUserData(user){
    Cookies.set(USER_ID_COOKIE_KEY, user.id.toString(), { expires: getDateOfExpiration() })
    Cookies.set(USER_LASTNAME_COOKIE_KEY, user.lastname, { expires: getDateOfExpiration() })
    Cookies.set(USER_FIRSTNAME_COOKIE_KEY, user.firstname, { expires: getDateOfExpiration() })
    Cookies.set(USER_EMAIL_COOKIE_KEY, user.email, { expires: getDateOfExpiration() })
    Cookies.set(USER_ROLE_COOKIE_KEY, user.role, { expires: getDateOfExpiration() })
    Cookies.set(USER_CREATED_AT_COOKIE_KEY, user.creationDate, { expires: getDateOfExpiration() })

}

export function getUserData(){
    return {
        id: Cookies.get(USER_ID_COOKIE_KEY) ? Number(Cookies.get(USER_ID_COOKIE_KEY)) : 0,
        lastname: Cookies.get(USER_LASTNAME_COOKIE_KEY) || '',
        firstname: Cookies.get(USER_FIRSTNAME_COOKIE_KEY) || '',
        email: Cookies.get(USER_EMAIL_COOKIE_KEY) || '',
        role: Cookies.get(USER_ROLE_COOKIE_KEY) || '',
        creationDate: Cookies.get(USER_CREATED_AT_COOKIE_KEY) || ''
    }
}

export function removeUserData(){
    Cookies.remove(USER_ID_COOKIE_KEY);
    Cookies.remove(USER_ROLE_COOKIE_KEY);
    Cookies.remove(USER_FIRSTNAME_COOKIE_KEY);
    Cookies.remove(USER_LASTNAME_COOKIE_KEY);
    Cookies.remove(USER_EMAIL_COOKIE_KEY);
    Cookies.remove(USER_CREATED_AT_COOKIE_KEY);
}

function getDateOfExpiration() {
    const date = new Date();
    date.setDate(date.getDate() + 350);
    return date;
}