import React, { useState, useEffect, Fragment } from "react";
import { getAccessToken } from '../../../adapters/CookiesAppStorage';

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
        
    };



    useEffect(() => {
        fetchUsers();
    }, []);

    const requestResponse = async (id) => {
        const data = await fetch('http://localhost:3000/friendship/request-answer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAccessToken()}`,
            },
            body: JSON.stringify({
                id_sender: id,
                answer: "accept",
          
            }),
        });
        return await data.json();
    };

    const handleClick = (key) => {
        const buttonToClick = document.getElementById(key);
        buttonToClick.style.display = "none";
    }
    return (
        <div>
        {users.friends?.map(((user,key) => (
            <Fragment key={key}>  
            <p> {user.email}</p> 
            {!hidden &&
                <button
                    id={key}
                    color='blue'
                    size={25}
                
                    onClick={() => {
                        requestResponse(user.id);
                        handleClick(key);
                        }
                    }
                > Accept request {user.id}
                </button>
            }
            </Fragment>
                    
        )))}
        </div>
    
    );
}

