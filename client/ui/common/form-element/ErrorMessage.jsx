import React from 'react';
import Form from 'react-bootstrap/Form';

export const ErrorMessage = ({message}) => {
    return  <Form.Control.Feedback type="invalid">
    {message}
  </Form.Control.Feedback>
}