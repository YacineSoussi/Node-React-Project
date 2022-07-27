import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { Container } from 'react-bootstrap';
import { Header } from './views/Header';
import React, { useEffect } from "react";
import { ToastProvider } from 'react-toast-notifications';


export const App = ({appRoutes}) => {

  return (
    <BrowserRouter>
      <ToastProvider placement={'bottom-center'}>
        <div className="App">
          <Header/>
          <Container fluid='md' className='main-container'>
            <Switch>
              {appRoutes.map((route, index) =>
                <Route key={index} component={route.component} path={route.path} exact={route.exact}/>
              )}
            </Switch>
          </Container>
         
        </div>
      </ToastProvider>
    </BrowserRouter>
  );
};