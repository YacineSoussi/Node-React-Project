import Conversation from './Conversation';
import React, {ReactDOM} from 'react';
import Modal from '../Modal/Modal';
import { IoCreateOutline } from "react-icons/io5";
import { useRef, useEffect } from 'react';

const App = (props) => {
    
    return (
                    <>
        <div id="test2" className="col-5 px-0 app-col-message" >
            <div className="bg-white">
                <div className="bg-gray px-4 py-2 bg-light d-flex justify-content-between align-items-center">
                    <p className="h5 mb-0 py-1">Recent</p>
                    
                    <IoCreateOutline className="text-primary" 
                    onClick={() => props.setIsOpen(true)} 
                    style={{ fontSize: "x-large", cursor: "pointer"}}/>
        
                        {props.isOpen && <Modal  
                        conversations={props.conversations} 
                        updateSelectedConversationId={ props.updateSelectedConversationId } 
                        user={props.user} 
                        amis={props.amis} 
                        setIsOpen={props.setIsOpen}
                        conversation={props.conversation}
                        getParticipants={props.getParticipants}
                        participants={props.participants}
                        />}
                </div>
                <div className="messages-box">
                    <div className="list-group rounded-0">
                        {props.conversations.map(conversation => {
                            return <Conversation 
                            selectedConversation={props.selectedConversation}
                            selectedConversationId={props.selectedConversationId}
                            authorLastMessage={props.authorLastMessage} 
                            setAuthorLastMessage={props.setAuthorLastMessage} 
                            user={props.user} 
                            updateSelectedConversationId={ props.updateSelectedConversationId } 
                            key={conversation.id} 
                            conversation={conversation} />
                        }
                        )}
                    </div>
                </div>
            </div>
                    
        </div>
        </>
    );
};

export default App;