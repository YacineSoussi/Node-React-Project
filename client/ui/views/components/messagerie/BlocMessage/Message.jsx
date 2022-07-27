import React from 'react';
import { IoTrash, IoPencil } from "react-icons/io5";

const Message = (props) => {
    
    // Gestion des dates
    const ddate = props.message.updatedAt;
    let date = new Date(ddate);
    if (ddate) { 
        const year = ddate.slice(0, 4);
        const month = ddate.slice(5, 7);
        const day = ddate.slice(8, 10);
        const hourUTC = ddate.slice(11, 13);
        const hour = parseInt(hourUTC) + 2
        const minute = ddate.slice(14, 16);
         date = day + "-" + month + "-" + year + " " +  hour + ":" + minute;
    } else {
        date = 'new Date()';
    }

    return (
        <div  className={`media w-50 mb-3 ${props.message.authorId === props.user.id ? `ms-auto` : ``}`} >
           
            <div className="media-body ml-3">
                <div className="d-flex align-items-center">
                   
    
                <div  className={`w-100 rounded py-2 px-3 mb-2 ${props.message.authorId === props.user.id ? 'bg-primary' : 'bg-light'}`}>     
                    <p className={`text-small mb-0 ${props.message.authorId === props.user.id ? 'text-white' : 'text-muted'}`}>
                        
                        {props.message.content}
                        
                        </p>
                </div>
                </div>
                <p className="small text-muted"> 
                
                {props.message.state ===  "updated" ? 
                <> <b style={{textDecoration: "underline" }}> Modifié le </b>:  </> 
                : null} {date}  {props.message.authorId === props.user.id  && props.message.state !== "delete" ? 
                <>
                    <IoTrash 
                   style={{cursor: "pointer"}} 
                   className="m-1 float-right mr-2 text-danger" 
                   onClick={(e) => props.handleDelete(e, props.message)}/>

                    {props.message.state !== "updated" ? <IoPencil
                    style={{cursor: "pointer"}}  
                    onClick={() => props.handleClick(props.message)} 
                    className='m-1 text-primary' /> : null}
                   
                   </>
                    : null}
                   
                   </p> 
            </div>
        </div>
    );
};

export default Message;