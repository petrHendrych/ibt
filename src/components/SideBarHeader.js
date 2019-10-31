import React, {useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faMapMarkedAlt } from '@fortawesome/free-solid-svg-icons'
import {Button, Modal} from "react-bootstrap";

const SideBarHeader = () => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <div className="side-bar-header">
            <div className="box text-center border-right h-100" onClick={handleShow}>
                <FontAwesomeIcon icon={faMapMarkedAlt} className="mr-2"/>
                Moje trasy
            </div>
            <div className="box text-center h-100">
                <FontAwesomeIcon icon={faUser} className="mr-2"/>
                Petr Hendrych
            </div>
            <Modal show={show} onHide={handleClose} backdrop={'static'}>
                <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default SideBarHeader;