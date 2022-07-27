import React, { useState, useEffect, Fragment } from "react";
import { getAccessToken } from '../../../adapters/CookiesAppStorage';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

export const MyFriends = () => {

    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        const data = await fetch('http://localhost:3000/friendship/show', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAccessToken()}`
            },
        })
        .then(data => data.json())
        .then(data => {
            setUsers(data);
        })
        ;
        
    };

    const deleteFriend = async (id) => {
        const data = await fetch('http://localhost:3000/friendship/delete', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAccessToken()}`,
            },
            body: JSON.stringify({
                id_receiver: id,
          
            }),
        });
        return await data.json();
    };


    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <>
        <Row className='justify-content-center mt-4'>
        {users.friends?.map((user,key) => (
        <Col md={4}>
          <Card className='mt-4' style={{ width: '18rem' }}>
                <Card.Img variant="top" src="https://i.stack.imgur.com/dr5qp.jpg" />
                  <Card.Body>
                    <Card.Title>{user.firstName} {user.lastName}</Card.Title>
                  
                    <Button  id={key} onClick={() => {deleteFriend(user.id);  } }variant="danger">Delete Friend</Button>
                  </Card.Body>
          </Card>
        </Col>
        ))}
        </Row>
        </>
     );
    
}

