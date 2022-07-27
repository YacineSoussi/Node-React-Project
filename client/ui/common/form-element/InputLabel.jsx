import Form from 'react-bootstrap/Form';
import React from 'react';

export const InputLabel =  ({children}) => {
    return <Form.Label className='font-weight-bold text-muted'> {children} </Form.Label>
}