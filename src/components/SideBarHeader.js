import React, {Component} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faClipboardList, faFileUpload } from '@fortawesome/free-solid-svg-icons';
import {Button, Modal} from "react-bootstrap";
import {NavLink} from "react-router-dom";
import { connect } from "react-redux";

import { logoutUser } from "../actions/auth";
import { uploadFile } from "../actions/files";

export default class SideBarHeader extends Component {
    state = {
        isShow: false,
        file: null,
        title: ''
    };

    onChange = (e) => {
        this.setState({
            file: e.target.files[0],
            title: e.target.files[0].name
        });
    };

    formSubmit = (e) => {
        e.preventDefault();
        this.props.uploadFile(this.state.file, this.state.title);
        this.setState({isShow: false});

    };

    render() {
        return (
            <div className="side-bar-header">
                {
                    this.props.auth.isAuthenticated
                        ?
                        <div className="box text-center border-right h-100" onClick={() => this.setState({isShow: true})}>
                            <FontAwesomeIcon icon={faFileUpload} className="mr-2"/>
                            Upload file
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
                        <Modal.Title>Upload new file</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {
                            this.props.files.map(file =>
                                <li key={file.id}>{file.title}</li>
                            )}
                    </Modal.Body>
                    <Modal.Footer>
                        <form onSubmit={this.formSubmit}>
                            <input type="file" name="gpx_file" onChange={this.onChange}/>
                            <Button type="submit" variant="success" value="Submit">
                                Upload
                            </Button>
                        </form>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}
//
// const mapStateToProps = (state) => ({
//     auth: state.auth,
//     files: state.files.data ? state.files.data : []
// });
//
// export default connect(mapStateToProps, {logoutUser})(SideBarHeader);

SideBarHeader = connect (
    state => {
        return {
            auth: state.auth,
            files: state.files.data ? state.files.data : []
        }
    },
    dispatch => {
        return {
            logoutUser: () => dispatch(logoutUser()),
            uploadFile: (file, title) => dispatch(uploadFile(file, title)),
        }
    }
)(SideBarHeader);