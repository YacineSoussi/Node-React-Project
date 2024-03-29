import { Link, useHistory } from 'react-router-dom';
import React, { FormEvent, useState } from 'react';
import {storeAccessToken, storeUserData} from '../../../adapters/CookiesAppStorage';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import {InputWithErrors} from '../../common/form-element/InputWithErrors';
import {LoadingIcon} from '../../common/icons/LoadingIcon'
import { LoginIcon } from '../../common/icons/LoginIcon';
import {PageHeader} from '../../common/PageHeader';
import {PlusIcon} from '../../common/icons/PlusIcon';
import Row from 'react-bootstrap/Row';
import {appRouteNames} from '../../../configuration/appRoutes';
import {useMustBeLoggedOutGuard} from '../../common/Hooks/useMustBeLoggedOutGuard';
import { useToasts } from 'react-toast-notifications';

export const UserLogin = () => {
    const history = useHistory();
    const { addToast } = useToasts();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorEmail, setErrorEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useMustBeLoggedOutGuard();

    return (
        <Row className='justify-content-center login-form'>
            <Col md={8} className="col-login">
                <Card body>
                    <PageHeader>
                        Connexion <LoginIcon/>
                    </PageHeader>
                    <Form className='mt-4' onSubmit={onSubmit}>
                        <InputWithErrors
                            label='Email'
                            value={email}
                            onChange={setEmail}
                            error={errorEmail}
                            placeholder='example@gmail.com'
                        />
                        <InputWithErrors
                            label='Mot de passe'
                            value={password}
                            onChange={setPassword}
                            error={""}
                            placeholder='password'
                            type='password'
                        />
                        <Link to={appRouteNames.REGISTER_USER} className="login-noAccount">
                            Tu n'as pas de compte? Inscris-toi
                        </Link>
                        <Button className='mt-4 btn-main' type={'submit'} variant='' block="true">
                            {isLoading ?
                                <LoadingIcon/>
                                    :
                                <><PlusIcon/> &nbsp; Valider</>}
                        </Button>
                    </Form>
                </Card>
            </Col>
        </Row>
    );

    async function sendFormData(data, requestOptions = {}) {
        requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        };

        try{
            await fetch('http://localhost:3000/login', requestOptions).then(response => {
                if(response.status === 200){
                    response.json().then((data) => {
                    storeAccessToken(data.token);
                    storeUserData({
                        id: data.userData[0].id,
                        lastname: data.userData[0].lastName,
                        firstname: data.userData[0].firstName,
                        role: data.userData[0].role,
                        email: data.userData[0].email,
                        creationDate: data.userData[0].createdAt
                    });
                    history.push(appRouteNames.ANALYTIC_SITE);

                    })
                } else if(response.status === 401) {
                    addToast('l\'email ou le mot de passe n\'est pas valide', {
                    appearance: 'error',
                    autoDismiss: true
                    })
                }
            })
        } catch(e) {
            addToast('oups !! un problème en cuisine', {
                appearance: 'error',
                autoDismiss: true
            });
        }
        setIsLoading(false)
    }

    function emailValidator(email) {
        const pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        const result = pattern.test(email);

        if(result===false) {
            setErrorEmail('le format de l\'email n\'est pas valide');
            setIsLoading(false);
        }
    }

    function onSubmit(event) {
        event.preventDefault();
        setIsLoading(true);
        setErrorEmail('');
        emailValidator(email);
        if(errorEmail === '' && password !== ''){
            sendFormData({email: email, password: password});
        }
        setIsLoading(false);
    }
}