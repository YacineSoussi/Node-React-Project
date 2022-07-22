import React from 'react';
import Conversation from './Conversation';

// import ConversationContext from '../MessagerieApp/ConversationContext';

const App = (props) => {

    return (
        <div className="col-5 px-0">
            <div className="bg-white">
                <div className="bg-gray px-4 py-2 bg-light">
                    <p className="h5 mb-0 py-1">Recent</p>
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