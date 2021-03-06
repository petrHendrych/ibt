/**
 * @author Petr Hendrych <xhendr03@fit.vutbr.cz>
 * @file Header component to handle file uploads and user redirects
 */

import React, {Component} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faClipboardList, faFileUpload } from '@fortawesome/free-solid-svg-icons';
import {Button, Dropdown, Modal} from "react-bootstrap";
import {NavLink} from "react-router-dom";
import { connect } from "react-redux";

import { logoutUser } from "../actions/auth";
import {deleteFile, uploadFile} from "../actions/files";
import {BOUNDS_CLEAR, TRACK_PARTITION_CLEAR, UNSELECT_POINT} from "../actions/types";

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
        this.setState({isShow: false, file: null, title: ''});
    };

    updateState = () => {
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
                            Files
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
                        <Dropdown className="box text-center h-100">
                            <div className="box text-center h-100">
                                <FontAwesomeIcon icon={faUser} className="mr-2"/>
                                {this.props.auth.user.username}
                                <Dropdown.Toggle split id="dropdown-split-basic"/>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => {this.props.clearPartition(); this.props.logoutUser()}}>Logout</Dropdown.Item>
                                </Dropdown.Menu>
                            </div>
                        </Dropdown>

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
                        <Modal.Title>Files</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <TableRender
                            files={this.props.files}
                            updateState={this.updateState}
                        />
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
            clearPartition: () => {
                dispatch({type: UNSELECT_POINT});
                dispatch({type: TRACK_PARTITION_CLEAR});
                dispatch({type: BOUNDS_CLEAR});
            },
        }
    }
)(SideBarHeader);

class TableRender extends Component {

    deleteFileHandler = (id) => {
        let arr = [];
        this.props.tracks.data.forEach(track => {
            if (track.gpx_file === id) {
                arr = [...arr, track.name]
            }
        });

        if (window.confirm("Are you sure you want to delete this file? Following tracks will be also deleted: \n\n" + arr.join(', '))) {
            this.props.deleteFile(id);
        }
    };

    render () {
        return (
            <table className="table table-striped">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th/>
                </tr>
                </thead>
                <tbody>
                {this.props.files.map(file => (
                    <tr key={file.id}>
                        <td>{file.id}</td>
                        <td>{file.title}</td>
                        <td>
                            <button
                                className="btn btn-danger btn-sm"
                                onClick={() => this.deleteFileHandler(file.id)}
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        )
    }
}

TableRender = connect (
    state => {
        return {
            tracks: state.tracks
        }
    },
    dispatch => {
        return {
            deleteFile: (id) => dispatch(deleteFile(id))
        }
    }
)(TableRender);