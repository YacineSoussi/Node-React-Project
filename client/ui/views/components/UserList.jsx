import React, { useState, useEffect, Fragment } from "react";
import { getAccessToken } from '../../../adapters/CookiesAppStorage';

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
const handleClick = (key) => {
  const buttonToClick = document.getElementById(key);
  buttonToClick.style.display = "none";
}




  useEffect(() => {
    fetchUsers();
  }, []);
 
  return (
    <div>
      {users.map((user,key) => (
        <Fragment key={key}>  
        <p> {user.email}</p> 
          {!hidden &&
            <button
                id={key}
                color='blue'
                size={25}
            
                onClick={() => {
                    addFriend(user.id);
                    handleClick(key);

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

