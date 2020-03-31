import React, {Component} from 'react';
import {Card, Accordion} from "react-bootstrap";
import {connect} from 'react-redux';
import Input from './Input';

import {latLngBounds} from 'leaflet';
import {updatePointLatLng} from "../actions";

export default class SideBarCard extends Component {
    state = {
        coords: this.props.coords
    };

    componentDidUpdate(prevProps) {
        if (prevProps.coords !== this.props.coords) {
            this.setState({coords: this.props.coords})
        }
    }

    changeHandler = (val, idx) => {
        const arr = this.state.coords;
        arr[idx] = parseFloat(val);
        this.setState({coords: arr});
    };

    blurHandler = () => {
        const val = {};
        Object.defineProperties(val, {
            'lat': {
                value: this.state.coords[0],
                writable: true
            },
            'lng': {
                value: this.state.coords[1],
                writable: true
            }
        });
        this.props.updatePointLatLng(this.props.selectedIndex, val);
    };

    render() {

        // if (this.props.render) {
        //     if (latLngBounds(this.props.bounds[0], this.props.bounds[1]).contains(this.props.coords)) {
        //         return (
        //             <Card>
        //                 <Accordion.Toggle as={Card.Header} eventKey={this.props.index} onClick={this.props.onClick} className={this.props.active ? 'selected' : ''}>
        //                     Bod: {this.props.coords[0]}, {this.props.coords[1]}
        //                 </Accordion.Toggle>
        //                 <Accordion.Collapse eventKey={this.props.index}>
        //                     <CardBody coords={this.props.coords} />
        //                 </Accordion.Collapse>
        //             </Card>
        //         );
        //     } else return <></>;
        // }

        return (
            <Card>
                <Accordion.Toggle as={Card.Header} eventKey={this.props.index} onClick={this.props.onClick} className={this.props.active ? 'selected' : ''}>
                    Bod: {this.state.coords[0]}, {this.state.coords[1]}
                </Accordion.Toggle>
                <Accordion.Collapse eventKey={this.props.index}>
                    <Card.Body>
                        <Input label="Lat"
                               val={this.state.coords[0]}
                               onChange={this.changeHandler}
                               onBlur={this.blurHandler}
                        />
                        <Input label="Lng"
                               val={this.state.coords[1]}
                               onChange={this.changeHandler}
                               onBlur={this.blurHandler}
                        />
                    </Card.Body>
                    {/*<CardBody*/}
                        {/*coords={this.props.coords}*/}
                        {/*elevation={this.props.elevation}*/}
                        {/*time={this.props.time}*/}
                        {/*update={() => this.updateCoords()}*/}
                    {/*/>*/}
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

function CardBody(props) {
    return (
        <Card.Body>
            <Input label="Lat" idx={0} update={props.update()} val={props.coords[0]}/>
            <Input label="Lng" idx={1} update={props.update()} val={props.coords[1]}/>
            <Input label="Ele" val={props.elevation}/>
            <Input label="Time" val={props.time}/>
        </Card.Body>
    );
}