import React, {useState, useEffect} from "react";
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';
import { Header } from './views/Header';
import { Container } from 'react-bootstrap';


export const App = ({appRoutes}) => {

  return (
    <BrowserRouter>
      <ToastProvider placement={'bottom-center'}>
        <div className="App">
          <Header/>

          <Container fluid='md' className='py-3 h-100'>
            <Switch>
              {appRoutes.map((route, index) =>
                <Route key={index} component={route.component} path={route.path} exact={route.exact}/>
              )}
            </Switch>
          </Container>
        </div>
      </ToastProvider>
    </BrowserRouter>
  )
 
};


