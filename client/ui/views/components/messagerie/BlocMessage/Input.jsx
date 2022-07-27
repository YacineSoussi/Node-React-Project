import React from 'react';
import { getAccessToken, getUserData } from '../../../../../adapters/CookiesAppStorage';
import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import socket from '../../../../common/config/socket.js'

const Input = (props) => {


const socketRef = useRef(null);

useEffect(() => { 
    const userId = getUserData().id;
    // On récupère l'instance de connexion aux sockets
     socketRef.current = socket;
    // On enregistre l'id de l'utilisateur dans le socket auth 
     socketRef.current.auth = { userId };
    //  On se connecte au socket 
     socketRef.current.connect();
     
     socketRef.current.on("connect", () => {
        console.log("connected");
    });

    // À chaque fois qu'un message est envoyé à l'utilisateur connecté à qui est adressé le message, on récupère le message et on l'affiche dans la conversation
      socketRef.current.on("private_message", ({conversationMAJ, author, data, allMessages }) => {
    
        props.setUpdatedConversation(conversationMAJ);
        props.setAuthorLastMessage(author);
    
         props.setMessages([...allMessages, data]);
      });
      
      socketRef.current.on("update_message", ({content, from, conversations, newConversation, to, conversationAMAJ, author }) => {
        console.log("update_message");
        // Ici on cherche la conversation qu'on a mis a jour et on la met a jour 
        conversations[conversationAMAJ] = newConversation;
       console.log([...newConversation.messages]);
       console.log(conversations[conversationAMAJ]);
        // On modifie le state de la conversation active pour changer l'affichage du dernier msg
        props.setConversation(newConversation);
        props.setMessages([...newConversation.messages]);

        props.setUpdatedConversation(newConversation);
        props.setAuthorLastMessage(author);
        // Pour pouvoir indiquer qu'actuellement il n'y a pas de message a modifier ou supprimer
        props.setMessageUpdate(null);
      });
    
    socketRef.current.on("connect_error", (err) => {
        if (err.message === "invalid username") {
          console.log("invalid username");
        }
      });

    return () => socketRef.current.close();

}, []);


    
    const Submit = (e) => {
        e.preventDefault();
        const socket = socketRef.current;
        
        const destinataire = props.conversation.participants.filter(user => user.userId !== props.user.id)[0];
        const content = e.target[0].value;
        if(props.messageUpdate) {
            fetchUpdateMessage(e, socket, destinataire.userId);
            
        } else {
            fetchNewMessage(e, socket, destinataire.userId);
        }
    }

    // Permet de post un nouveau message
    const fetchNewMessage = async (e, socket, destinataire) => {
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
           
            // On envoi le message au destinataire dans l'event "private_message" qui est défini dans le fichier index.js

            socket.emit("private_message", {
                content: message,
                to: destinataire,
                conversationMAJ: conversationMAJ,
                author: userId,
                allMessages: props.messages,
                data: data
            });
            
        }
        ).catch(error => {
            console.error(error);
        }
        );
        return response;
    }

    // Permet de mettre à jour un message
    const fetchUpdateMessage = async (e, socket, destinataire) => {
        
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
            console.log("data", data);
            // Ici on cherche le message qu'on est en train de modifier pour le mettre à jour 
            const messages = props.messages;
            const index = messages.findIndex(message => message.id === data.id);
            
            messages[index] = data;
            console.log("messages", messages[index]);
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
           
            console.log("conversatoinMAJ", conversationMAJ);
            // On modifie le state de la conversation active pour changer l'affichage du dernier msg
            props.setConversation(conversationMAJ);
            // Pour pouvoir indiquer qu'actuellement il n'y a pas de message a modifier ou supprimer
            props.setMessageUpdate(null);

            socket.emit("update_message", {
                content: message,
                to: destinataire,
                conversationAMAJ: indexConversation,
                newConversation: conversationMAJ,
                conversations: props.conversations,
                author: props.user.id,
                messages: messages
            })

        }
        ).catch(error => {
            console.error(error);
        }
        );
        return response;
    }

    // Permet de supprimer un message
    const fetchDeleteMessage = async () => {

        const response = await fetch(`http://localhost:3000/messages/${props.messageUpdate.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAccessToken()}`
            },
            body: JSON.stringify({
                "content": "Ce message a été supprimé",
                "state": "delete"
            })
        })
        .then(response => response.json())
        .then(data => {

            // Ici on cherche le message qu'on est en train de modifier pour le mettre à jour 
            const messages = props.messages;
            const index = messages.findIndex(message => message.id === data.id);
            
            messages[index] = data;
            props.setMessages(messages);

            
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
            if (props.messageUpdate && props.messageUpdate.state !== undefined && props.messageUpdate.state !== "delete") {
            updateMessageRef.current.value = props.messageUpdate.content;
            } else if(props.messageUpdate && props.messageUpdate.state === "delete") {
                fetchDeleteMessage();
            }
            
    }, [props.messageUpdate]);

    return (
        <>
        
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
        </>
    )
};

export default Input;