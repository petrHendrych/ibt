import React, {Component} from 'react';
import {Card, Accordion} from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import {connect} from 'react-redux';
import Input from './Input';

import {updatePointLatLng} from "../actions";

export default class SideBarCard extends Component {
    state = {
        coords: [...this.props.coords],
        valid: [true, true]
    };

    componentDidUpdate(prevProps) {
        if (prevProps.coords !== this.props.coords) {
            this.setState({valid: [true, true]});
            this.setState({coords: [...this.props.coords]})
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
                this.props.updatePointLatLng(this.props.selectedIndex, val);
            }
        });
    };

    parseTime = (time) => {
        const split = time.split("T");
        return (
            <label>{split[0]}, {split[1].substring(0,8)}</label>
        )
    };

    render() {
        const {index, coords, elevation, time} = this.props;
        return (
            <Card>
                <Accordion.Toggle as={Card.Header} eventKey={index} onClick={this.props.onClick} className={this.props.active ? 'selected' : ''}>
                    <div className="d-flex">
                        <div className="text-center">
                            {!(this.state.valid[0] && this.state.valid[1]) ?
                            <FontAwesomeIcon icon={faExclamationCircle} className="text-danger"/> :
                            <></>
                            }
                        </div>
                        <div>Point:</div>
                        <div>
                            <div className={"d-inline-block " + (this.state.valid[0] ? "" : "text-danger")}>
                                {this.state.coords[0]},
                            </div>
                            <div className={"d-inline-block " + (this.state.valid[1] ? "" : "text-danger")}>
                                {this.state.coords[1]}
                            </div>
                        </div>
                    </div>
                    {/*{!(this.state.valid[0] && this.state.valid[1]) ?*/}
                        {/*<FontAwesomeIcon icon={faExclamationCircle} className="icon-error text-danger"/> :*/}
                        {/*<></>*/}
                    {/*}*/}
                    {/*Point: <span className={this.state.valid[0] ? "" : "text-danger"}>*/}
                        {/*{this.state.coords[0]}*/}
                    {/*</span>, <span className={this.state.valid[1] ? "" : "text-danger"}>*/}
                        {/*{this.state.coords[1]}*/}
                        {/*</span>*/}
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
            selectedIndex: state.selectedIndex,
        }
    },
    dispatch => {
        return {
            updatePointLatLng: (index, val) => dispatch(updatePointLatLng(index, val))
        }
    }
)(SideBarCard);