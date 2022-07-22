import React from 'react';
import Input from './Input';
import Message from './Message';

const Right = (props) => {
    
    return (
        <div id="test" className="col-7 px-0">
            <div className="px-4 py-5 chat-box bg-white" style={{"overflowY": "scroll", "scrollbarColor": "rebeccapurple green",
  "scrollbarWidth": "thin"}}>
                {props.messages ? props.messages.map(message => {
                    return <Message user={props.user} key={message.id} message={message} setMessages={props.setMessages} />
                    
                }) : null}
            
            </div>
            {/* {props.messages.length === 0 ? null : <Input/>} */}
                <Input />

        </div>
    );
};

export default Right;