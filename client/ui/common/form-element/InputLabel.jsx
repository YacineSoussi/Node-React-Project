import React from 'react';
import Form from 'react-bootstrap/Form';

export const InputLabel =  ({children}) => {
    return <Form.Label className='font-weight-bold text-muted'> {children} </Form.Label>

}