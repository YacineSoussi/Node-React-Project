import React from 'react';
import { useState, useEffect } from 'react';
import { getAccessToken } from '../../../../../adapters/CookiesAppStorage';
const Conversation = (props) => {

   const [destinataire, setDestinataire] = useState(null); 
   const otherUser = props.conversation.participants.filter(user => user.userId !== props.user.id)[0];
   

    //  Au chargement du composant on récupère le destinataire & met a jour l'auteur du dernier message
    useEffect(() => {
        fetchUser();
        if (props.conversation.lastMessage) {
            props.setAuthorLastMessage(props.conversation.lastMessage.authorId);
        }
        
    }, []);
    
    // On récupère le destinataire de la conversation
    const fetchUser = async () => {
        const response = await fetch(`http://localhost:3000/users/${otherUser.userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAccessToken()}`
            }
        })
        .then(response => response.json())
        .then(data => {
            setDestinataire(data);
           
        })
        .catch(error => {
            console.error(error);
        }
        );
        return response;
    }
   
    // Gestion de la date
    const ddate = props.conversation.updatedAt;

    const year = ddate.slice(0, 4);
    const month = ddate.slice(5, 7);
    const day = ddate.slice(8, 10);
    const hourUTC = ddate.slice(11, 13);
    const hour = parseInt(hourUTC) + 2
    const minute = ddate.slice(14, 16);
    const date = day + "-" + month + "-" + year + " " +  hour + ":" + minute;

    // Dès qu'on clique sur une conversation, on met à jour le state de la conversation active
   const handleClick = () => {
        props.updateSelectedConversationId(props.conversation.id);
      }
      
//    console.log(props.conversation)

    return (
        <div onClick={handleClick} className="list-group-item list-group-item-action rounded-0">
            <div className="media">
                <img src="https://res.cloudinary.com/mhmd/image/upload/v1564960395/avatar_usae7z.svg" alt="user"
                     width="50" className="rounded-circle"/>
                <div className="media-body ml-4">
                    <div className="d-flex align-items-center justify-content-between mb-1">
                        <h6 className="mb-0">{destinataire ? ( <>
                            {destinataire.firstName} {destinataire.lastName}
                        </>
                        ): null} </h6>
                        <small
                            className="small font-weight-bold">{date}</small>
                    </div>
                    <p className="font-italic mb-0 text-small">
                        
                        {props.authorLastMessage === props.user.id ? 
                        <span className="font-weight-bold font-italic">Moi : </span>
                        : destinataire ? <span className='font-weight-bold'>{destinataire.firstName} {destinataire.lastName} : </span> 
                        : null}
                        {props.conversation.lastMessage ? props.conversation.lastMessage.content : null}
                        
                        </p>
                </div>
            </div>
         </div>
    );
};

export default Conversation;