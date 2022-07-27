import React, {useState} from 'react';
import { Link, useHistory } from 'react-router-dom';
import {appRouteNames} from '../../../../configuration/appRoutes';
import { useToasts } from 'react-toast-notifications';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {PasswordIcon} from '../../../common/icons/PasswordIcon';
import {LoadingIcon} from '../../../common/icons/LoadingIcon';
import {PlusIcon} from '../../../common/icons/PlusIcon';
import {PageHeader} from '../../../common/PageHeader';
import { InputWithErrors } from '../../../common/form-element/InputWithErrors';
import {useMustBeAuthenticateGuard} from '../../../common/Hooks/useMustBeAuthenticateGuard';
import {getUserData, getAccessToken, storeUserData, removeAccessToken, removeUserData, storeAccessToken} from '../../../../adapters/CookiesAppStorage';


export const ResetPassword = () => {


    useMustBeAuthenticateGuard();
    const history = useHistory();
    const [isLoading, setIsLoading] = useState(false);
    const [password, setPassword] = useState("");
    const [isCorrectPassword, setIsCorrectPassword] = useState();
    const [newPassword, setNewPassword ] = useState("");
    const [errorPassword, setErrorPassword] = useState("");
    const [errorNewPassword, setErrorNewPassword] = useState("");
    const email = getUserData().email;
    const userId = getUserData().id;
    const token = getAccessToken();
    
    return (
        <Row className='justify-content-center'>
        <Col md={8}>
          <Card className='h-100' body>
            <PageHeader>
              Edit Password <PasswordIcon/>
            </PageHeader>

            <Form className='mt-4' onSubmit={onSubmit}>
  
            <InputWithErrors label='Mot de passe' value={password} onChange={setPassword} error={""}
                                 placeholder='password' type='password'/>
  
            <InputWithErrors label='Nouveau Mot de passe' value={newPassword} onChange={setNewPassword} error={errorNewPassword}
                                 placeholder='password' type='password'/>

              <Button className="mt-4 btn-main" type={'submit'} variant='' block="true">
                {isLoading
                  ? <LoadingIcon/>
                  : <><PlusIcon/> &nbsp; valider</>}
              </Button>
  
            </Form>
          </Card>
        </Col>
      </Row>

    )

    async function sendFormData(data, requestOptions = {}){
        console.log('je suis dans le send')
        requestOptions = {
            method: 'PUT',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token,
           },
            body: JSON.stringify(data)
          };

        try {
            await fetch('http://localhost:3000/resetPassword/' + userId, requestOptions).then(response => {
                if(response.status === 200){
                    setIsLoading(false);
                    history.push(appRouteNames.LOGOUT_USER)

                }else if(response.status === 401) {
                    console.log("je suis dans le 401")
                }
            })
            

        }  catch (err){
            await addToast('Erreur Server', {
                appearance: 'error',
                autoDismiss: true
            });
        }
    }


    async function VerifyActualPassword(data, requestOptions = {}) {
        let response = {};
        requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          };
        try {
            response = await fetch('http://localhost:3000/login', requestOptions);
        }catch(err){
            await addToast('please try again !', {
                appearance: 'error',
                autoDismiss: true
            });
        }
        if (response.status === 200) {
            setIsCorrectPassword(true);
        }
    
    }


    function isFormatPasswordValid(string){
        const mediumRegex = /[A-Z]+.*[0-9]+.*[^\w]+|[A-Z]+.*[^\w]+.*[0-9]+|[0-9]+.*[A-Z]+.*[^\w]+|[0-9]+.*[^\w]+.*[A-Z]+|[^\w]+.*[A-Z]+.*[0-9]+|[^\w]+.*[0-9]+.*[A-Z]+/g;
        console.log(string);
        if(string === password){
            setErrorNewPassword('Veuillez taper un mot de passe different');   
            console.log(errorNewPassword);
        }else if(!mediumRegex.test(string)){
            console.log("je suis la aussi") 
            setErrorNewPassword('1 majuscule, 1 minuscule, 1 Numéric, 8 caractère ou plus !');
        } 
    }

    function clearErrorsSates(){
        setErrorPassword('');
        setErrorNewPassword('');
    }

    async function onSubmit (event){
        event.preventDefault();
        setIsLoading(true);
        clearErrorsSates();
        isFormatPasswordValid(newPassword);
        if(errorNewPassword === ''){
            await VerifyActualPassword({email: email, password: password});
            
            if(isCorrectPassword){
               await sendFormData({password: newPassword})
            }else {
                setIsLoading(false);
                await addToast('Invalid Password', {
                    appearance: 'error',
                    autoDismiss: true
                });
            }
        }
        setIsLoading(false);
    }
    
}