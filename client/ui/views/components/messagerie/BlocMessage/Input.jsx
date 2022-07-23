import React from 'react';
import { getAccessToken } from '../../../../../adapters/CookiesAppStorage';

const Input = (props) => {
    // fetch new message
    const fetchNewMessage = async (e) => {
        e.preventDefault();
        const message = e.target[0].value;
        const conversationId = props.selectedConversationId;
        const userId = props.user.id;
        const response = await fetch(`http://localhost:3000/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAccessToken()}`
            },
            body: JSON.stringify({
                "content": message,
                "conversationId": conversationId,
                "authorId": userId
            })
        })
        .then(response => response.json())
        .then(data => {
            const messages = props.messages;
            props.setMessages([...messages, data]);
            e.target[0].value = '';
            // On modifie ici la conversation active avec le nouveau message afin de modifier le state pour que le coté gauche réagisse
            const conversation = props.conversation;
            const conversationMAJ = {
                lastMessage: data,
                messages: [...conversation.messages, data],
                id: conversationId,
                authorId: userId,
                updatedAt: data.updatedAt,
                lastMessageId: data.id,
                participants: conversation.participants,
                createdAt: data.createdAt
            };
            props.setConversation(conversationMAJ);
            props.setUpdatedConversation(conversationMAJ);
        }
        ).catch(error => {
            console.error(error);
        }
        );
        return response;
    }


    const handleSubmit = (event) => {
        event.preventDefault();
        const messages = props.messages;
        props.setMessages([...messages, {
            authorId: props.user.id,
            content: event.target[0].value
        }])
       
    }

    return (
        <form onSubmit={fetchNewMessage} action="#" className="bg-light mb-auto form-input">
            <div className="input-group">
                <input type="text" placeholder="Type a message"
                    aria-describedby="button-addon2"
                    className="form-control rounded-0 border-0 py-4 bg-light"/>
                <div className="input-group-append">
                    <button id="button-addon2" type="submit"className="btn btn-link">
                        <i className="fa fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        </form>
    )
};

export default Input;