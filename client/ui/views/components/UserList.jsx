import React, { useState, useEffect, Fragment } from "react";
import { getAccessToken, getUserData } from '../../../adapters/CookiesAppStorage';

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

const generateKey = (str, index) => {
	return `${str}-${index}`;
};



  useEffect(() => {
    fetchUsers();
  }, []);

 
  return (
        <div>
            {users.map((user,key) => (
                <Fragment>
                    
                    <p key={key}> {user.email}</p> 
                    {!hidden &&
                        <button
                            
                            color='blue'
                            size={25}
                            key={generateKey('upd',key)}
                        
                            onClick={() => {
                                addFriend(user.id);
                                setHidden(true)
                                }
                            }
                        > send request {user.id}
                        </button>
                    }
                </Fragment>
                        
            
            ))}
        </div>
    
       

  );
}

