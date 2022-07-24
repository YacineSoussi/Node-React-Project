import Input from './Input';
import Message from './Message';
import React from 'react';
import { useRef, useEffect, useState } from 'react';

const Right = (props) => {
    
    const [messageUpdate, setMessageUpdate] = useState(null);
    const messagesEndRef = useRef(null);

    // Permet de scroller automatiquement vers le bas
    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    // Au chargement de la page, on scroll automatiquement vers le bas. Cela permet de voir le dernier message.
    // Il réagit au changement de state messages pour que le scroll se fasse automatiquement vers le bas.
    useEffect(() => {
        scrollToBottom();
       
    }
    , [props.messages]);

    const handleClick = (message) => {
        setMessageUpdate(message);
        
    }
    return (
        <div id="test" className="col-7 px-0">
            <div 
                className="px-4 py-5 chat-box bg-white"
                style={
                    {
                        "overflowY": "scroll",
                        "scrollbarColor": "rebeccapurple green",
                        "scrollbarWidth": "thin"
                    }
                }>
                    
                {props.messages ? props.messages.map((message, key) => {
                    return <Message 
                    handleClick={handleClick}
                    user={props.user} 
                    key={key} 
                    message={message} 
                    setMessages={props.setMessages}
                    
                    />
                }) : null}
                <div ref={messagesEndRef} />
            </div>
            {/* {props.messages.length === 0 ? null : <Input/>} */}
            <Input
                authorLastMessage={props.authorLastMessage} 
                setAuthorLastMessage={props.setAuthorLastMessage}
                setUpdatedConversation={props.setUpdatedConversation}
                conversation={props.conversation}
                setConversation={props.setConversation}
                selectedConversationId={props.selectedConversationId}
                user={props.user} 
                messages={props.messages}
                setMessages={props.setMessages}
                messageUpdate={messageUpdate}
                setMessageUpdate={setMessageUpdate}
                conversations={props.conversations}
                setConversations={props.setConversations}

            />
        </div>
    );
};

export default Right;