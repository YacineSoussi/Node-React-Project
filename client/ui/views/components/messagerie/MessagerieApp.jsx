import { getAccessToken, getUserData } from '../../../../adapters/CookiesAppStorage';
import { useEffect, useState } from 'react';

import App from './Conversations/App';
import React from 'react';
import Right from './BlocMessage/Right';
import {useMustBeAuthenticateGuard} from '../../../common/Hooks/useMustBeAuthenticateGuard';

export const MessagerieApp = () => {
    useMustBeAuthenticateGuard();

    const [authorLastMessage, setAuthorLastMessage] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [selectedConversationId, setSelectedConversationId] = useState(null);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [Messages, setMessages] = useState([]);
    const [user, setUser] = useState(null);
    const [updatedConversation, setUpdatedConversation] = useState(null);
    const [amis, setAmis] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    // On remet à jour la liste des conversations lorsqu'on modifie une conversation
    useEffect(() => {
        fetchConversations();
        setUser(getUserData());
    }, [updatedConversation]);

    // On met a jour la conversation selectionnée dès le chargement de la page avec la premiere
    useEffect(() => {
        if (selectedConversationId) {
            fetchSelectedConversation();
        }
    }, [selectedConversationId]);

    // Récupère les conversations de l'utilisateur connecté
    const fetchConversations = async () => {
        const response = await fetch(`http://localhost:3000/myconversations/${getUserData().id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAccessToken()}`
            }
        }).then(response => response.json()).then(data => {
            // Trier les conversations par date de dernier message
            data.sort((a, b) => {
                    return new Date(b.updatedAt) - new Date(a.updatedAt);
            });

            const conversations = data.map(conversation => {
                    // Trier les messages de la conversation par createdAt
                    const sortedConversation = conversation.messages.sort((a, b) => {
                        return new Date(a.createdAt) - new Date(b.createdAt);
                    });

                    conversation.messages = sortedConversation;
                    let lastMessage = null;

                if (conversation.messages.length > 0) {
                    // On récupère ici le dernier elemement du tableau pour le mettre dans lastMessage
                    lastMessage = conversation.messages[conversation.messages.length-1];
                }

                return {
                    ...conversation,
                    lastMessage
                }
            });

            setConversations(conversations);

            if (selectedConversationId === null) {
                setSelectedConversationId(conversations[0].id);
            }
        }).catch(error => {
            console.error(error);
        });

        return response;
    }

    // Récupère la conversation selectionnée
    const fetchSelectedConversation = async () => {
        const response = await fetch(`http://localhost:3000/conversations/${selectedConversationId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAccessToken()}`
            }
        }).then(response => response.json()).then(data => {
            // On trie les messages par date de creation pour eviter de changer l'ordre des messages quand ils sont modifié
            const sortedConversation = data.messages.sort((a, b) => {
                return new Date(a.createdAt) - new Date(b.createdAt);
            });

            data.messages = sortedConversation;

            let lastMessage = null;

            if (data.messages.length > 0) {
                lastMessage = data.messages[data.messages.length-1];
            }

            const newConversation = {
                ...data,
                lastMessage
            }

            setSelectedConversation(newConversation);
            setMessages(data.messages);

        }).catch(error => {
            console.error(error);
        });

        return response;
    }

    // Permet de récuperer la liste d'amis (users en attendant d'avoir la route pour les amis)
    const fetchUsers = async () => {
        const response = await fetch(`http://localhost:3000/friendship/show`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAccessToken()}`
            }
        }).then(response => response.json()).then(data => {
            
            setAmis(data.friends);
        }).catch(error => {
            console.error(error);
        });

        return response;
    }

    // Permet de récuperer tous les participants qui ont une conversation avec l'user connecté
    const participants = [];
    const getParticipants = (conversations) => {
        conversations.forEach(conversation => {
            conversation.participants.forEach(participant => {
                if (participant.userId !== user.id) {
                    participants.push(participant);
                }
            }
            );
        });
        return participants;
    }

    // Met à jour la liste d'amis dès qu'une conversations est modifiée/crée
    useEffect(() => {
        fetchUsers();
    }, [conversations]);

    // console.log(Messages)
    return (
        <div className="container py-5 px-4 message-container">
        <div className="row rounded-lg overflow-hidden shadow d-flex message-row">
            <App
                authorLastMessage={authorLastMessage}
                setAuthorLastMessage={setAuthorLastMessage}
                amis={amis}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                setConversations={setConversations}
                user={user}
                selectedConversationId={selectedConversationId}
                updateSelectedConversationId={setSelectedConversationId}
                selectedConversation={selectedConversation}
                conversations={conversations}
                getParticipants={getParticipants}
                participants={participants} />

            <Right
                authorLastMessage={authorLastMessage}
                setAuthorLastMessage={setAuthorLastMessage}
                setUpdatedConversation={setUpdatedConversation}
                conversation={selectedConversation}
                setConversation={setSelectedConversation}
                user={user}
                messages={Messages}
                setMessages={setMessages}
                selectedConversationId={selectedConversationId}
                conversations={conversations}
                setConversations={setConversations}
            />
        </div>
    </div>
    );
};