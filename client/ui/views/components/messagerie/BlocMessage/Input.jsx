import React from 'react';
import { getAccessToken } from '../../../../../adapters/CookiesAppStorage';
import { useEffect, useRef } from 'react';

const Input = (props) => {
    // fetch new message
    
    const Submit = (e) => {
                
        e.preventDefault();
        if(props.messageUpdate) {
            fetchUpdateMessage(e);
            
        } else {
            fetchNewMessage(e);
        }
    }

    // Permet de post un nouveau message
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
            props.setAuthorLastMessage(userId);
        }
        ).catch(error => {
            console.error(error);
        }
        );
        return response;
    }

    // Permet de mettre à jour un message
    const fetchUpdateMessage = async (e) => {
        
        const message = e.target[0].value;

        const response = await fetch(`http://localhost:3000/messages/${props.messageUpdate.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAccessToken()}`
            },
            body: JSON.stringify({
                "content": message,
                "state": "updated"
            })
        })
        .then(response => response.json())
        .then(data => {

            // Ici on cherche le message qu'on est en train de modifier pour le mettre à jour 
            const messages = props.messages;
            const index = messages.findIndex(message => message.id === data.id);
            
            messages[index] = data;
            props.setMessages(messages);

            e.target[0].value = '';

            
            // On regarde si le message qu'on modifie est le dernier message de la conversation pour le mettre à jour
            let lastMsg = props.conversation.lastMessage;
            
            if(data.id === props.conversation.lastMessageId) {
                lastMsg = data;
            }
            // On modifie ici la conversation active avec le nouveau message afin de modifier le state pour que le coté gauche réagisse
            const conversation = props.conversation;
            const conversationMAJ = {
                lastMessage: lastMsg,
                messages: [...conversation.messages],
                id: conversation.id,
                updatedAt: data.updatedAt,
                lastMessageId: lastMsg.id,
                participants: conversation.participants,
                createdAt: data.createdAt
            };
    
            // Ici on cherche la conversation qu'on a mis a jour et on la met a jour 
            const indexConversation = props.conversations.findIndex(conversation => conversation.id === conversationMAJ.id);
            props.conversations[indexConversation] = conversationMAJ;
           
            // On modifie le state de la conversation active pour changer l'affichage du dernier msg
            props.setConversation(conversationMAJ);
            // Pour pouvoir indiquer qu'actuellement il n'y a pas de message a modifier ou supprimer
            props.setMessageUpdate(null);
        }
        ).catch(error => {
            console.error(error);
        }
        );
        return response;
    }
    
    // Ref qui va permettre de scroll automatiquement au dernier message
    const updateMessageRef = useRef(null);
        
    // A chaque fois qu'un message est cliqué et que le state est modifié, on rempli l'input avec le message
        useEffect(() => {
            if (props.messageUpdate) {
            updateMessageRef.current.value = props.messageUpdate.content;
            console.log(props.messageUpdate);
            }
            
    }, [props.messageUpdate]);

    return (
        <form onSubmit={Submit} action="#" className="bg-light mb-auto form-input">
            <div className="input-group">
                <input ref={updateMessageRef} type="text" placeholder="Envoyer un message"
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