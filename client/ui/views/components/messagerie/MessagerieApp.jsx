import {Route, Switch} from 'react-router-dom';
import { getAccessToken, getUserData } from '../../../../adapters/CookiesAppStorage';
import { useEffect, useState } from 'react';

import App from './Conversations/App';
import Blank from './BlocMessage/Blank';
import React from 'react';
import Right from './BlocMessage/Right';
import Modal from './Modal/Modal';


export const MessagerieApp = () => {

    const [conversations, setConversations] = useState([]);
    const [selectedConversationId, setSelectedConversationId] = useState(null);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [Messages, setMessages] = useState([]);
    const [user, setUser] = useState(null);
    const [updatedConversation, setUpdatedConversation] = useState(null);
    const [amis, setAmis] = useState([]);

    const [isOpen, setIsOpen] = useState(false);

    // use effect to fetch conversations
    useEffect(() => {
        fetchConversations();
        setUser(getUserData());
    }, [updatedConversation]);

        // use effect to fetch selected conversation
    useEffect(() => {
            if (selectedConversationId) {
                fetchSelectedConversation();
            }
        }, [selectedConversationId]);

    const fetchConversations = async () => {
        const response = await fetch(`http://localhost:3000/myconversations/${getUserData().id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAccessToken()}`
            }
        })
            .then(response => response.json())
            .then(data => {
                const conversations = data.map(conversation => {

                //    find  last element of array
                let lastMessage = null;
                
                if (conversation.messages.length > 0) {
                    
                     lastMessage = conversation.messages.reduce((a, b) => {
                        return a.updatedAt > b.updatedAt ? a : b;
                    }
                    );
                }
                    return {
                        ...conversation,
                      lastMessage
                    }
                }
                );
               setConversations(conversations);

               if (selectedConversationId === null) {
                   setSelectedConversationId(conversations[0].id);
               }

            }).catch(error => {
                console.error(error);
            }
            );

        return response;
    }

    const fetchSelectedConversation = async () => {
        const response = await fetch(`http://localhost:3000/conversations/${selectedConversationId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAccessToken()}`
            }
        })
        .then(response => response.json())
        .then(data => {
                setSelectedConversation(data);
                setMessages(data.messages);
               
            })
        .catch(error => {
                console.error(error);
            }
            );
        return response;
    }

    const updateSelectedConversationId = (id) => {
        setSelectedConversationId(id);
    }

    const fetchUsers = async () => {
        const response = await fetch(`http://localhost:3000/users`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAccessToken()}`
            }
        })
            .then(response => response.json())
            .then(data => {
                setAmis(data);
            }
            ).catch(error => {
                console.error(error);
            }
            );
        return response;
    }

    // get participants of all convsersations
    const participants = [];
    
    const getParticipants = (conversations) => {
        
        conversations.forEach(conversation => {
            // console.log(conversation.participants);
            conversation.participants.forEach(participant => {
                if (participant.userId !== user.id) {
                    participants.push(participant);
                }
            }
            );
        }
        );
        
         return participants;
         
    }
    useEffect(() => {
        fetchUsers();
        
    //    const result = getParticipants(conversations);
    //     setAmis(result);
        
    }, [conversations]);
   

    

    return (
        <div className="container py-5 px-4 message-container">
        <div className="row rounded-lg overflow-hidden shadow d-flex message-row">

            <App amis={amis} isOpen={isOpen} setIsOpen={setIsOpen} conversation={conversations} setConversations={setConversations} user={user} selectedConversationId={selectedConversationId} updateSelectedConversationId={updateSelectedConversationId} conversations={conversations} />

            <Right setUpdatedConversation={setUpdatedConversation} conversation={selectedConversation} setConversation={setSelectedConversation} user={user} messages={Messages} setMessages={setMessages} selectedConversationId={selectedConversationId} />

        </div>

       
    </div>
    );
};

