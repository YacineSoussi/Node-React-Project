
import React, { useEffect, useState } from 'react';
import Navbar from 'react-bootstrap/Navbar';

import { appRouteNames } from '../../configuration/appRoutes';
import { Link, useHistory } from 'react-router-dom';
import {isUserAuthenticated} from '../../adapters/AuthenticationService';
import {LogoutIcon} from '../common/icons/LogoutIcon';
import {AnalyticIcon} from '../common/icons/AnalyticIcon';
import {LoginIcon} from '../common/icons/LoginIcon';
import {LogIcon} from '../common/icons/LogIcon';
import Button from 'react-bootstrap/Button';

export const Header = () => {

    const history = useHistory();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    function redirectToLogout() {
        history.push(appRouteNames.LOGOUT_USER)
    };

    useEffect(() => {
        setIsAuthenticated(isUserAuthenticated());
    }, [history]);


    return (
        <Navbar expand="lg" variant={'light'} className='d-flex justify-content-between sticky-top'
                style={{ background: '#fff', boxShadow: '0px 4px 19px 0px rgba(0,0,0,0.75)' }}>
        <Navbar.Brand>
        <Link to={appRouteNames.MESSAGERIE}
                style={{ color: 'var(--brown-1)', textDecoration: 'none', fontSize: '1.5rem' }}>
            Messagerie <AnalyticIcon/>
            </Link>
            <Link to={appRouteNames.ANALYTIC_SITE}
                style={{ color: 'var(--brown-1)', textDecoration: 'none', fontSize: '1.5rem' }}>
            Analytic <AnalyticIcon/>
            </Link>
            <Link to={appRouteNames.LOGS_SITE}
                style={{ color: 'var(--brown-1)', textDecoration: 'none', fontSize: '1.5rem' }}>
            Logs <LogIcon/>
            </Link>
           {!isAuthenticated &&
                <Link to={appRouteNames.LOGIN_USER}
                style={{ color: 'var(--brown-1)', textDecoration: 'none', fontSize: '1.5rem' }}>
            connexion <LoginIcon/>
            </Link>
           } 
            
        </Navbar.Brand>

        {isAuthenticated &&
        <Navbar.Text>
            <Button variant=""
                    style={{ color: 'var(--brown-1)', borderColor: 'var(--brown-1)' }}
                    onClick={redirectToLogout}>
            <LogoutIcon/>
            </Button>
        </Navbar.Text>
        }
        </Navbar>
    );
    }



