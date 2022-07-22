import React from 'react';

const Message = (props) => {
    
    const ddate = props.message.createdAt;
    const year = ddate.slice(0, 4);
    const month = ddate.slice(5, 7);
    const day = ddate.slice(8, 10);
    const hour = ddate.slice(11, 13);
    const minute = ddate.slice(14, 16);
    const date = day + "-" + month + "-" + year + " " +  hour + ":" + minute;
   
    return (
        <div className={`media w-50 mb-3 ${props.message.authorId === props.user.id ? `ms-auto` : ``}`} >
           
            <div className="media-body ml-3">
                <div className={`rounded py-2 px-3 mb-2 ${props.message.authorId === props.user.id ? 'bg-primary' : 'bg-light'}`}>
                    
                    <p className={`text-small mb-0 ${props.message.authorId === props.user.id ? 'text-white' : 'text-muted'}`}>{props.message.content}</p>
                </div>
                <p className="small text-muted">{date}</p>
            </div>
        </div>
    );
};

export default Message;