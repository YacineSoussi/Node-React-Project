import Conversation from './Conversation';
import React from 'react';
import Modal from '../Modal/Modal';
import { IoCreateOutline } from "react-icons/io5";


const App = (props) => {
    
  
   
    return (
        <div className="col-5 px-0 app-col-message">
            <div className="bg-white">
                <div className="bg-gray px-4 py-2 bg-light d-flex justify-content-between align-items-center">
                    <p className="h5 mb-0 py-1">Recent</p>
                    
                    <IoCreateOutline className="text-primary" 
                    onClick={() => props.setIsOpen(true)} 
                    style={{ fontSize: "x-large", cursor: "pointer"}}/>
        
                        {props.isOpen && <Modal user={props.user} amis={props.amis} setIsOpen={props.setIsOpen} />}
                </div>
                <div className="messages-box">
                    <div className="list-group rounded-0">
                        {props.conversations.map(conversation => {
                            return <Conversation user={props.user} updateSelectedConversationId={ props.updateSelectedConversationId } key={conversation.id} conversation={conversation} />
                        }
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;