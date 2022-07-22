import React from 'react';
import {Route, Switch} from 'react-router-dom';
import Blank from './BlocMessage/Blank';
import Right from './BlocMessage/Right';
import App from './Conversations/App';
import { useEffect, useState } from 'react';
import { getUserData } from '../../../../adapters/CookiesAppStorage';

export const MessagerieApp = () => {
    
    const [conversations, setConversations] = useState([]);
    const [selectedConversationId, setSelectedConversationId] = useState(null);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [Messages, setMessages] = useState([]);
    const [user, setUser] = useState(null);

   
    // use effect to fetch conversations
    useEffect(() => {
        fetchConversations();
        setUser(getUserData());
    }, []);

    const fetchConversations = async () => {
        const response = await fetch(`http://localhost:3000/myconversations/${getUserData().id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZmlyc3ROYW1lIjoiVGhlIHJlcXVlc3QgaGFzIHN1Y2NlZWRlZC4iLCJpYXQiOjE2NTcwMjY5NDksImV4cCI6MTY4ODU4NDU0OX0.Z-f6jbd_wQu6Ae-lDQCqZoYh9cHqZ92f9W7rYjV_2l0'
            }
        })
            .then(response => response.json())
            .then(data => {
                const conversations = data.map(conversation => {
                    const lastMessage = conversation.messages.slice(-1)[0];
                    return {
                        ...conversation,
                        lastMessage
                    }
                }
                );
               setConversations(conversations);
               setSelectedConversationId(conversations[0].id);

            }).catch(error => {
                console.error(error);
            }
            );

        return response;
    }

    // use effect to fetch selected conversation
    useEffect(() => {
        if (selectedConversationId) {
            fetchSelectedConversation();
        }
    }, [selectedConversationId]);

    const fetchSelectedConversation = async () => {
        const response = await fetch(`http://localhost:3000/conversations/${selectedConversationId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZmlyc3ROYW1lIjoiVGhlIHJlcXVlc3QgaGFzIHN1Y2NlZWRlZC4iLCJpYXQiOjE2NTcwMjY5NDksImV4cCI6MTY4ODU4NDU0OX0.Z-f6jbd_wQu6Ae-lDQCqZoYh9cHqZ92f9W7rYjV_2l0'
            }
        })
        .then(response => response.json())
        .then(data => {
                setSelectedConversation(data);
                setMessages(data.messages);
                // console.log(Messages);
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
    

    return (
        <div className="container py-5 px-4">
        <div className="row rounded-lg overflow-hidden shadow d-flex">

            <App user={user} selectedConversationId={selectedConversationId} updateSelectedConversationId={updateSelectedConversationId} conversations={conversations} />
            {/* <Switch>
                <Route path="/messagerie" component={Blank} exact />
                <Route path="/conversation/:id"
                       render={props => <Right {...props} key={props.match.params.id}></Right> }
                />
            </Switch> */}
            <Right user={user} messages={Messages} setMessages={setMessages} selectedConversationId={selectedConversationId} />
           
           
        </div>
       
    </div>
    );
};

