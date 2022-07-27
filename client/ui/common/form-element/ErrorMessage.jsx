import Form from 'react-bootstrap/Form';
import React from 'react';

export const ErrorMessage = ({message}) => {
  return <Form.Control.Feedback type="invalid">{message}</Form.Control.Feedback>
}