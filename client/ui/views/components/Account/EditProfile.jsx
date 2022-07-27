import React, {useState, useEffect} from 'react';
import { Link, useHistory } from 'react-router-dom';
import {appRouteNames} from '../../../../configuration/appRoutes';
import { useToasts } from 'react-toast-notifications';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {EditProfileIcon} from '../../../common/icons/EditProfileIcon';
import {LoadingIcon} from '../../../common/icons/LoadingIcon';
import {PlusIcon} from '../../../common/icons/PlusIcon';
import {PageHeader} from '../../../common/PageHeader';
import { InputWithErrors } from '../../../common/form-element/InputWithErrors';
import {useMustBeAuthenticateGuard} from '../../../common/Hooks/useMustBeAuthenticateGuard';
import {getUserData, getAccessToken, storeUserData, removeAccessToken, removeUserData, storeAccessToken} from '../../../../adapters/CookiesAppStorage';




export const EditProfile = () => {

    useMustBeAuthenticateGuard();

    const userId = getUserData().id;
    const token = getAccessToken();
    const history = useHistory();
    const { addToast } = useToasts()
    const [lastName, setLastName] = useState(getUserData().lastname);
    const [firstName, setFirstName] = useState(getUserData().firstname);
    const [email, setEmail] = useState(getUserData().email);
    const [errorEmail, setErrorEmail] = useState('')
    const [errorLastName, setErrorLastName] = useState('')
    const [errorFirstName, setErrorFirstName] = useState('')
    const [isLoading, setIsLoading] = useState(false);

    return(
        <Row className='justify-content-center'>
        <Col md={8}>
          <Card className='h-100' body>
            <PageHeader>
              Edit Profile <EditProfileIcon/>
            </PageHeader>

            <Form className='mt-4' onSubmit={onSubmit}>
  
              <InputWithErrors label='Nom' value={lastName} onChange={setLastName} error={errorLastName} placeholder='Nom ici'/>
  
              <InputWithErrors label='Prénom' value={firstName} onChange={setFirstName} error={errorFirstName}
                               placeholder='Prénom ici'/>
  
              <InputWithErrors label='Email' value={email} onChange={setEmail} error={errorEmail}
                               placeholder='example@gmail.com'/>

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

    function sendFormData(data, requestOptions = {}){
        requestOptions = {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
         },
          body: JSON.stringify(data)
        };
        console.log(requestOptions);

        try{
          fetch('http://localhost:3000/users/' + userId , requestOptions)
          .then(response =>{
            if(response.status === 200){
                response.json().then(data =>{
                    storeUserData({
                    id: data.id,
                    lastname: data.lastName,
                    firstname: data.firstName,
                    role: data.role,
                    email: data.email,
                    creationDate: data.createdAt
                  });  
                  
                setIsLoading(false);    
                addToast('edit successfully', {
                    appearance: 'success',
                    autoDismiss: true
                });
                history.push(appRouteNames.ACCOUNT_INFO);

                })
              
            }else if(response.status === 404){
                addToast('no changes applied', {
                    appearance: 'warning',
                    autoDismiss: true
                });
    
            }else if(response.status === 401){
                addToast('Email Already Exists', {
                    appearance: 'warning',
                    autoDismiss: true
                });
            } 
        
        })
        }catch(err){
            addToast('Edition échoué Veuillez re éssayer', {
                appearance: 'error',
                autoDismiss: true
            });

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
    
    function clearErrorsSates(){
        setErrorEmail('');
        setErrorFirstName('');
        setErrorLastName('');
    }



     function onSubmit(event){
        event.preventDefault();
        setIsLoading(true);
        clearErrorsSates();
        emailValidator(email);
        isLastNameValid(lastName);
        isFirstNameValid(firstName);
        
        if(errorEmail == '' && errorFirstName == '' && errorLastName == ''){
            console.log("pas d'erreurs");
            sendFormData({email: email, firstName: firstName, lastName: lastName});
        }
        setIsLoading(false);
    }   



}