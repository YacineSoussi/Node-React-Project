import { Link, useHistory } from 'react-router-dom';
import React, {useEffect, useState} from 'react';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { InputWithErrors } from '../../common/form-element/InputWithErrors';
import {LoadingIcon} from '../../common/icons/LoadingIcon';
import {PageHeader} from '../../common/PageHeader';
import {PlusIcon} from '../../common/icons/PlusIcon';
import Row from 'react-bootstrap/Row';
import {UserIcon} from '../../common/icons/UserIcon';
import {appRouteNames} from '../../../configuration/appRoutes';
import {useMustBeLoggedOutGuard} from '../../common/Hooks/useMustBeLoggedOutGuard';
import { useToasts } from 'react-toast-notifications';

export const UserRegister = () => {
    const history = useHistory()
    const { addToast } = useToasts()
    const [lastName, setLastName] = useState('')
    const [response, setResponse] = useState()
    const [firstName, setFirstName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')
    const [errorPassword, setErrorPassword] = useState('')
    const [errorEmail, setErrorEmail] = useState('')
    const [errorLastName, setErrorLastName] = useState('')
    const [errorFirstName, setErrorFirstName] = useState('')
    const [errorPasswordConfirmation, setErrorPasswordConfirmation] = useState('');
    const [isLoading, setIsLoading] = useState(false)

    useMustBeLoggedOutGuard();

    return (
        <Row className='justify-content-center'>
            <Col md={8}>
                <Card className='h-100' body>
                    <PageHeader>
                        Inscription <UserIcon/>
                    </PageHeader>
                    <Form className='mt-4' onSubmit={onSubmit}>
                        <InputWithErrors
                            label='Nom'
                            value={lastName}
                            onChange={setLastName}
                            error={errorLastName}
                            placeholder='Nom ici'
                        />
                        <InputWithErrors
                            label='Prénom'
                            value={firstName}
                            onChange={setFirstName}
                            error={errorFirstName}
                            placeholder='Prénom ici'
                        />
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
                            error={errorPassword}
                            placeholder='password'
                            type='password'
                        />
                        <InputWithErrors
                            label='Confirmation de mot de passe'
                            value={passwordConfirmation}
                            onChange={setPasswordConfirmation}
                            error={errorPasswordConfirmation}
                            placeholder='password'
                            type='password'
                        />
                        <Link to={appRouteNames.LOGIN_USER}>
                            Déjà inscrit? Connecte-toi
                        </Link>
                        <Button className="mt-4 btn-main" type={'submit'} variant='' block="true">
                            {isLoading ?
                                <LoadingIcon/>
                                    :
                                <><PlusIcon/> &nbsp; valider</>}
                        </Button>
                    </Form>
                </Card>
            </Col>
        </Row>
    );


    function sendFormData(data, requestOptions = {}) {
        requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        };
        try {
            fetch('http://localhost:3000/register', requestOptions)
            .then(response =>{
            if(response.status === 201){
                setResponse(response);
                history.push(appRouteNames.LOGIN_USER);
            }else {
                if(isLoading){
                setIsLoading(false)
                }
                addToast('Inscription échoué Veuillez re éssayer', {
                appearance: 'error',
                autoDismiss: true
                });
            }
            })
        } catch(err) {
            setIsLoading(false)
            addToast('oups !! un problème en cuisine', {
            appearance: 'error',
            autoDismiss: true
            })
        }
    }


    function emailValidator(email) {
        const pattern = /[a-zA-Z0-9]+[\.]?([a-zA-Z0-9]+)?[\@][a-z]{3,9}[\.][a-z]{2,5}/g;
        const result = pattern.test(email)
        if(result===false){
            setErrorEmail('le format de l\'email n\'est pas valide')
            if(isLoading){
            setIsLoading(false)
            }
        }
    }

    function isPasswordAndPasswordConfirmationAreEquals(password, passwordConfirmation){
        if(password !== passwordConfirmation){
            setErrorPasswordConfirmation('Les mots de passes ne sont pas Identiques');

            if(isLoading){
            setIsLoading(false)
            }
        }
    }

    function isLastNameValid(lastName){
        if(lastName === undefined || lastName === ''){
            setErrorLastName('Veillez remplir ce champs')
            setIsLoading(false)
        }
    }

    function isFirstNameValid(firstName){
        if(firstName === undefined || firstName === ''){
            setErrorFirstName('Veillez remplir ce champs')
            setIsLoading(false)
        }
    }

    function isFormatPasswordValid(password){
        const mediumRegex = /[A-Z]+.*[0-9]+.*[^\w]+|[A-Z]+.*[^\w]+.*[0-9]+|[0-9]+.*[A-Z]+.*[^\w]+|[0-9]+.*[^\w]+.*[A-Z]+|[^\w]+.*[A-Z]+.*[0-9]+|[^\w]+.*[0-9]+.*[A-Z]+/g;
        if(!mediumRegex.test(password)) {
            setIsLoading(false);
            setErrorPassword('1 majuscule, 1 minuscule, 1 Numéric, 8 caractère ou plus !');
        }
    }

    function clearErrorsSates(){
        setErrorEmail('');
        setErrorPassword('');
        setErrorFirstName('');
        setErrorLastName('');
        setErrorPasswordConfirmation('');
    }

    function onSubmit(event){
        event.preventDefault();
        setIsLoading(true);
        clearErrorsSates();
        emailValidator(email);
        isLastNameValid(lastName);
        isFirstNameValid(firstName);
        isFormatPasswordValid(password);
        isPasswordAndPasswordConfirmationAreEquals(password, passwordConfirmation);
        if(errorEmail === '' && errorPasswordConfirmation === '' && errorFirstName === '' && errorLastName === '' && errorPasswordConfirmation === '') {
            console.log(email, password, lastName, firstName);
            sendFormData({email: email, password: password, firstName: firstName, lastName: lastName})
        }
        setIsLoading(false)
    }
};