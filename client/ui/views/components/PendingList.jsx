import React, { useState, useEffect, Fragment } from "react";
import { getAccessToken, getUserData } from '../../../adapters/CookiesAppStorage';

export const PendingList = () => {

const [users, setUsers] = useState([]);
const [hidden, setHidden] = useState(false,'');

const fetchUsers = async () => {
	const data = await fetch('http://localhost:3000/friendship/pendings', {
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




  useEffect(() => {
    fetchUsers();
  }, []);

 console.log(users);
  return (
        <div>
            {users.firends.map((user,key) => (
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

