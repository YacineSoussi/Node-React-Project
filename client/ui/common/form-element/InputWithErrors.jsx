import { ErrorMessage } from './ErrorMessage';
import Form from 'react-bootstrap/Form';
import { InputLabel } from './InputLabel';
import React from 'react';

export const InputWithErrors = ({ label, value, onChange, error, type = 'text', placeholder }) => {
    return (
        <Form.Group>
            <InputLabel>{label}</InputLabel>
            <Form.Control
                type={type}
                placeholder={placeholder}
                isInvalid={isInvalid(error)}
                value={value}
                onChange={handleChange}
            />
        {isInvalid(error) && <ErrorMessage message={error}/>}
        </Form.Group>
    );

    function isInvalid(error){
        if(error) {
            console.log(error)
            return error !== ''
        }
        return false;
    }

    function handleChange(e) {
        onChange(e.target.value);
    }
}