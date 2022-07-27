import React, { useState, useEffect, Fragment } from "react";
import { getAccessToken } from '../../../adapters/CookiesAppStorage';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

export const BlockList = () => {

    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        const data = await fetch('http://localhost:3000/block/all', {
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



    useEffect(() => {
        fetchUsers();
    }, []);

    
    const blockUser = async (id) => {
        const data = await fetch('http://localhost:3000/block/no', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAccessToken()}`,
            },
            body: JSON.stringify({
                user_to_unblock: id,
          
            }),
        });
        return await data.json();
    };

   
    const blockClick = (index) => {
        const buttonToClick = document.getElementById(index);
        buttonToClick.style.display = "none";
    }

    return (
        
         <>
         <Row className='justify-content-center mt-4'>
         {users.users_blocked?.map((user,key) => (
         <Col md={4}>
           <Card className='mt-4' style={{ width: '18rem' }}>
                 <Card.Img variant="top" src="https://i.stack.imgur.com/dr5qp.jpg" />
                   <Card.Body>
                     <Card.Title>{user.firstName} {user.lastName}</Card.Title>
                     <Button  id={key} onClick={() => {blockUser(user.id); blockClick(key); } }variant="success">Unblock</Button>
                   </Card.Body>
           </Card>
         </Col>
         ))}
         </Row>
         </>
    
    );
}

