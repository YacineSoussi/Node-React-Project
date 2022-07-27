import React, { useState, useEffect, Fragment } from "react";
import { getAccessToken } from '../../../adapters/CookiesAppStorage';

export const PendingList = () => {

    const [users, setUsers] = useState([]);

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

    const positiveRequestResponse = async (id) => {
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

    const negativeRequestResponse = async (id) => {
        const data = await fetch('http://localhost:3000/friendship/request-answer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAccessToken()}`,
            },
            body: JSON.stringify({
                id_sender: id,
                answer: "decline",
          
            }),
        });
        return await data.json();
    };

    const acceptClick = (key) => {
        const buttonToClick = document.getElementById(key);
        buttonToClick.style.display = "none";
    }
    const declineClick = (index) => {
        const buttonToClick = document.getElementById(index);
        buttonToClick.style.display = "none";
    }

    return (
        <div>
        {users.friends?.map(((user,key) => (
            <Fragment key={key}>  
            <p> {user.email}</p> 
         
                <button
                    id={key}
                    color='blue'
                    size={25}
                
                    onClick={() => {
                        positiveRequestResponse(user.id);
                        acceptClick(key);
                        }
                    }
                > Accept request {user.id}
                </button>
                <button
                    id={key}
                    color='blue'
                    size={25}
                
                    onClick={() => {
                        negativeRequestResponse(user.id);
                        declineClick(key);
                        }
                    }
                > Refuse request {user.id}
                </button>
        
            </Fragment>
                    
        )))}
        </div>
    
    );
}

