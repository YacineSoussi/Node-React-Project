import React, { useState, useEffect, Fragment } from "react";
import { getAccessToken } from '../../../adapters/CookiesAppStorage';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

export const UserList = () => {

const [users, setUsers] = useState([]);
const [hidden, setHidden] = useState(false,'');

const fetchUsers = async () => {
	const data = await fetch('http://localhost:3000/users-list', {
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
    
    
   
    console.log(users);
};

const addFriend = async (id) => {
	const data = await fetch('http://localhost:3000/friendship/add', {
		method: 'POST',
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

const signalUser = async (id) => {
	const data = await fetch('http://localhost:3000/signal/new-request', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${getAccessToken()}`,
		},
		body: JSON.stringify({
        user_id_to_signal: id,
        reason: 'signal',
        comment: 'signal',
      
		}),
	});
	return await data.json();
};




const handleClick = (key) => {
  const buttonToClick = document.getElementById(key);
  buttonToClick.style.display = "none";
}




  useEffect(() => {
    fetchUsers();
  }, []);
 
  return (
    <>
    <Row className='justify-content-center mt-4'>
    {users.map((user,key) => (
    <Col md={4}>
      <Card className='mt-4' style={{ width: '18rem' }}>
            <Card.Img variant="top" src="https://i.stack.imgur.com/dr5qp.jpg" />
              <Card.Body>
                <Card.Title>{user.firstName} {user.lastName}</Card.Title>
              
                <Button  id={key} onClick={() => {addFriend(user.id); handleClick(key); } }variant="primary">Add Friend</Button>
                <Button  id={key} onClick={() => {signalUser(user.id);  } }variant="warning">Report Friend</Button>
              </Card.Body>
      </Card>
    </Col>
    ))}
    </Row>
    </>
    
    
  
  );
}

