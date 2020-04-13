import React, {Component} from 'react';
import {Card, Accordion} from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import {connect} from 'react-redux';
import _ from 'lodash';

import Input from './Input';
import {deletePartitionPoint, deletePoint, updatePointLatLng} from "../actions/points";
import {UNSELECT_POINT} from "../actions/types";

export default class SideBarCard extends Component {
    state = {
        coords: [...this.props.coords],
        valid: [true, true],
        checked: false
    };

    // updating after marker is moved
    componentDidUpdate(prevProps) {
        if (prevProps.coords !== this.props.coords) {
            this.setState({
                valid: [true, true],
                coords: [...this.props.coords],
            });
        }
        if (prevProps.delete !== this.props.delete) {
            this.setState({ checked: false})
        }
    }

    changeHandler = (val, idx) => {
        const arr = this.state.coords;
        arr[idx] = parseFloat(val);
        if (isNaN(arr[idx])) {
            arr[idx] = '';
        }
        this.setState({coords: arr});
    };

    blurHandler = (val, idx) => {
        let arr = [...this.state.valid];
        arr[idx] = val;

        this.setState({valid: arr}, () => {
            if (this.state.valid[0] && this.state.valid[1]) {
                const val =  {
                    lat: this.state.coords[0],
                    lng: this.state.coords[1],
                };
                this.props.updatePointLatLng(this.props.index, val);
            }
        });
    };

    parseTime = (time) => {
        const split = time.split("T");
        return (
            <label>{split[0]}, {split[1].substring(0,8)}</label>
        )
    };

    deletePointHandler = (index) => {
        if (!_.isEmpty(this.props.track)) {
            if (window.confirm("Really want to delete this point?")) {
                this.props.deletePoint(index);
                if (!_.isEmpty(this.props.partition.indexes)) {
                    this.props.deletePartitionPoint(index);
                }
            }
        }
    };

    render() {
        const {index, coords, elevation, time} = this.props;
        const cardClass = this.props.delete ? "disable " : (this.props.active ? "selected" : "");

        return (
            <Card>
                <Accordion.Toggle as={Card.Header} eventKey={index}
                                  onClick={() => this.props.selectPointClick()}
                                  className={`${cardClass}`}
                >
                    <div className="left-exclamation">
                        {!(this.state.valid[0] && this.state.valid[1]) ?
                            <FontAwesomeIcon icon={faExclamationCircle} className="text-danger"/> :
                            <></>
                        }
                    </div>
                    <div className="center-block d-inline-block">
                        <div className="d-inline-block position-absolute" style={{left: "24px"}}>Point:</div>
                        <div className="d-inline-block position-relative" style={{left: "40px"}}>
                            <span className={this.state.valid[0] ? "" : "text-danger"}>
                                {this.state.coords[0]},
                            </span>
                                <span className={this.state.valid[1] ? "" : "text-danger"}>
                                {this.state.coords[1]}
                            </span>
                        </div>
                    </div>
                    { this.props.delete ?
                        <input
                            type="checkbox"
                            className="delete-checkbox"
                            onChange={() => {
                                this.setState({checked: !this.state.checked});
                                this.props.checked(index)
                            }}
                            onClick={e => e.stopPropagation()}
                            checked={this.state.checked}
                        /> :
                        <div className="right-trash-bin d-inline-block">
                            <FontAwesomeIcon
                                icon={faTrashAlt}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    this.props.clearIndex();
                                    this.deletePointHandler(index)}
                                }
                                className={this.props.delete ? "disable" : ""}
                            />
                        </div>
                    }
                </Accordion.Toggle>
                <Accordion.Collapse eventKey={index}>
                    <Card.Body>
                        <Input label="Lat"
                               val={coords[0]}
                               onChange={this.changeHandler}
                               onBlur={this.blurHandler}
                        />
                        <Input label="Lng"
                               val={coords[1]}
                               onChange={this.changeHandler}
                               onBlur={this.blurHandler}
                        />
                        <div className="d-flex mt-1">
                            <div className="w-50 small text-left">Elevation: {elevation}</div>
                            <div className="w-50 small text-right">Time: {this.parseTime(time)}</div>
                        </div>
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
        );
    }
}

SideBarCard = connect (
    state => {
        return {
            bounds: state.bounds,
            track: state.tracks.track,
            partition: state.partition
        }
    },
    dispatch => {
        return {
            clearIndex: () => dispatch({type: UNSELECT_POINT}),
            deletePoint: (index) => dispatch(deletePoint(index)),
            deletePartitionPoint: (index) => dispatch(deletePartitionPoint(index)),
            updatePointLatLng: (index, val) => dispatch(updatePointLatLng(index, val))
        }
    }
)(SideBarCard);