import { Link, useHistory } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import {isAdmin, isUserAuthenticated} from '../../adapters/AuthenticationService';

import {AnalyticIcon} from '../common/icons/AnalyticIcon';
import Button from 'react-bootstrap/Button';
import {LogIcon} from '../common/icons/LogIcon';
import {LoginIcon} from '../common/icons/LoginIcon';
import {LogoutIcon} from '../common/icons/LogoutIcon';
import {MessagingIcon} from '../common/icons/MessagingIcon';
import {MyAccountIcon} from '../common/icons/MyAccountIcon';
import Navbar from 'react-bootstrap/Navbar';
import { appRouteNames } from '../../configuration/appRoutes';
import Dropdown from 'react-bootstrap/Dropdown';


export const Header = () => {
    const history = useHistory();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    function redirectToLogout() {
        history.push(appRouteNames.LOGOUT_USER)
    };

    function redirectToMyAccount() {
        history.push(appRouteNames.ACCOUNT_INFO)
    };

    useEffect(() => {
        setIsAuthenticated(isUserAuthenticated());
    }, [history]);

    return (
        <Navbar
            expand="lg"
            variant={'light'}
            className='d-flex justify-content-between sticky-top'
            style={{ background: '#fff',
            boxShadow: '0px 4px 19px 0px rgba(0,0,0,0.75)' }}>
            <Navbar.Brand>
                <Link to={appRouteNames.MESSAGERIE} style={{ color: 'var(--brown-1)', textDecoration: 'none', fontSize: '1.5rem' }}>
                    Messagerie <MessagingIcon/>
                </Link>
                <Dropdown>
                    <Dropdown.Toggle variant="primary" id="dropdown-basic">
                    Friends
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                    <Dropdown.Item href={appRouteNames.USERLIST}>List of users</Dropdown.Item>
                    <Dropdown.Item href={appRouteNames.PENDING}>Pending requests</Dropdown.Item>
                    <Dropdown.Item href={appRouteNames.SHOWFRIENDS}>My friends</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                {isAdmin() &&
                    <>
                        <Link to={appRouteNames.ANALYTIC_SITE} style={{ color: 'var(--brown-1)', textDecoration: 'none', fontSize: '1.5rem' }}>
                            Analytic <AnalyticIcon/>
                        </Link>
                        <Link to={appRouteNames.LOGS_SITE} style={{ color: 'var(--brown-1)', textDecoration: 'none', fontSize: '1.5rem' }}>
                            Logs
                            <LogIcon/>
                        </Link>
                        <Dropdown>
                            <Dropdown.Toggle variant="warning" id="dropdown-basic">
                            Reports
                            </Dropdown.Toggle>
                
                            <Dropdown.Menu>
                            <Dropdown.Item href={appRouteNames.SHOWSIGNALED}>List of signal</Dropdown.Item>
                            <Dropdown.Item href={appRouteNames.SHOWBLOCKED}>List of blocked </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>

                    </>
                }

                {!isAuthenticated &&
                    <Link
                        to={appRouteNames.LOGIN_USER}
                        style={{
                            color: 'var(--brown-1)',
                            textDecoration: 'none',
                            fontSize: '1.5rem'
                        }}>
                        Connexion
                        <LoginIcon/>
                    </Link>
                }
            </Navbar.Brand>
            {isAuthenticated &&
                <Navbar.Text>
                    <Button
                        variant=""
                        style={{ color: 'var(--brown-1)', borderColor: 'var(--brown-1)' }}
                        onClick={redirectToLogout}>
                        <LogoutIcon/>
                    </Button>
                    <Button
                        variant=""
                        style={{ color: 'var(--brown-1)', borderColor: 'var(--brown-1)' }}
                        onClick={redirectToMyAccount}>
                        <MyAccountIcon/>
                    </Button>
                </Navbar.Text>
            }
        </Navbar>

    );
}