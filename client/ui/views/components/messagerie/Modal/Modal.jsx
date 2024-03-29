import React from "react";
import {RiCloseLine}  from 'react-icons/ri';
import { getAccessToken } from '../../../../../adapters/CookiesAppStorage';
import styles from "./Modal.module.css";
const Modal = (props) => {

// Permet de créer une nouvelle conversation
const fetchPostConversation = async (secondUserId) => {
    const response = await fetch(`http://localhost:3000/conversations`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAccessToken()}`
        },
        body: JSON.stringify({
            "secondUserId": secondUserId,
            "firstUserId": props.user.id
        })
    })
    .then(response => response.json())
    .then(data => {
        props.updateSelectedConversationId(data.id);
        props.setIsOpen(false);

        let conversations = props.conversations;
        conversations.push(data);

    }).catch(error => {
        console.error(error);
    });
    return response;
}

    return (
    <>
    <div className={styles.darkBG} onClick={() => props.setIsOpen(false)} />
        <div className={styles.centered}>
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <h5 className={styles.heading}>Séléctionner un ami</h5>
                </div>
                <button className={styles.closeBtn} onClick={() => props.setIsOpen(false)}>
                    <RiCloseLine style={{ marginBottom: "-3px" }} />
                </button>
                <div className={styles.modalContent}>
                    
                    {props.amis.length > 0 ? props.amis.map((ami, key) => {
                        return (
                            <>
                                <div onClick={() => fetchPostConversation(ami.id)} key={key} style={{cursor: "pointer"}}>{ami.lastName} {ami.firstName}</div>
                            </>
                        );
                    }) : "Ooups vous n'avez pas d'amis"}
                </div>
            </div>
        </div>
    </>
    );
};

export default Modal;