import React from 'react';
import {getUserData} from '../../../../adapters/CookiesAppStorage';
import {useMustBeAuthenticateGuard} from '../../../common/Hooks/useMustBeAuthenticateGuard';
import { Link, useHistory } from 'react-router-dom';
import { EditProfileIcon } from '../../../common/icons/EditProfileIcon';
import {PasswordIcon} from '../../../common/icons/PasswordIcon';
import { appRouteNames } from '../../../../configuration/appRoutes';

export const MyAccount = () => {

    useMustBeAuthenticateGuard();

    const history = useHistory();
    const userData = getUserData();
    const date = userData.creationDate.substring(0,10); 
    const year = date.substring(0,4);
    const month = date.substring(5,7) + '-';
    const day = date.substring(8) + '-'; 
    const dateCreation = day + month + year;
    const email = userData.email;
    const firstName = userData.firstname;
    const lastName = userData.lastname;
    const persona = userData.role;

    return(

        <div className="container d-flex justify-content-center align-items-center">

              <div className="card">

                <div className="upper d-flex flex-column text-white">

                  <h5 className="mb-0 mt-2 font-weight-bold">{firstName} {lastName}</h5>
                  <small>{email}</small>
                  

                </div>


                <div className="down">

                  <div className="accounts">

                    <div className="d-flex flex-row align-items-center">

                    <Link to={appRouteNames.RESET_PASSWORD}
                        style={{ color: 'var(--brown-1)', textDecoration: 'none', fontSize: '1.0rem' }}>
                        edit password <PasswordIcon/>
                        </Link>

                      <div className="d-flex flex-column ml-3">

                      </div>
                      
                    </div>


                    <div className="subscribe">

                      <span className="d-block">You have subscribed to our premium account since <b>{dateCreation}</b></span>
                      <Link to={appRouteNames.EDIT_PROFILE}
                        style={{ color: 'var(--brown-1)', textDecoration: 'none', fontSize: '1.0rem' }}>
                        Manage Your Count <EditProfileIcon/>
                        </Link>

                    </div>
                    
                  </div>
                  

                </div>
                

              </div>
              

            </div>
    )
    
}