import React, {useState, Component} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faMapMarkedAlt, faClipboardList, faPowerOff } from '@fortawesome/free-solid-svg-icons';
import {Button, Modal, Dropdown} from "react-bootstrap";
import {NavLink} from "react-router-dom";
import { connect } from "react-redux";
import { logoutUser } from "../actions/auth";

class SideBarHeader extends Component {
    state = {
        isShow: false,
        file: null
    };

    onFormSubmit = (e) => {
        e.preventDefault();
        this.fileUpload(this.state.file)
            .then((response) => {
                console.log(response.data);
            })
    };

    onChange = (e) => {
        this.setState({file: e.target.files[0]})
    };

    fileUpload = (file) => {
        const url = 'localhost:8000'
    };

    render() {
        return (
            <div className="side-bar-header">
                {
                    this.props.auth.isAuthenticated
                        ?
                        <div className="box text-center border-right h-100" onClick={() => this.setState({isShow: true})}>
                            <FontAwesomeIcon icon={faMapMarkedAlt} className="mr-2"/>
                            Moje trasy
                        </div>
                        :
                        <NavLink to="/register">
                            <div className="box text-center border-right h-100">
                                <FontAwesomeIcon icon={faClipboardList} className="mr-2"/>
                                Register
                            </div>
                        </NavLink>
                }

                {
                    this.props.auth.isAuthenticated ?
                        <div className="box text-center h-100">
                            <FontAwesomeIcon icon={faUser} className="mr-2"/>
                            {this.props.auth.user.username}
                            <button className="ml-2" onClick={this.props.logoutUser}>logout</button>
                        </div>
                        :
                        <NavLink to="/login">
                            <div className="box text-center h-100">
                                <FontAwesomeIcon icon={faUser} className="mr-2"/>
                                Login
                            </div>
                        </NavLink>
                }

                <Modal show={this.state.isShow} onHide={() => this.setState({isShow: false})} backdrop={'static'}>
                    <Modal.Header closeButton>
                        <Modal.Title>Modal heading</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
                    <Modal.Footer>
                        <form onSubmit={this.onFormSubmit}>

                        </form>
                        <input type="file"/>
                        <Button variant="secondary" onClick={() => this.setState({isShow: false})}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    auth: state.auth
});

export default connect(mapStateToProps, {logoutUser})(SideBarHeader);