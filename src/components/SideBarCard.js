import React, {Component} from 'react';
import {Card, Accordion} from "react-bootstrap";
import {connect} from 'react-redux';
import Input from './Input';

import {latLngBounds} from 'leaflet';

export default class SideBarCard extends Component {

    render() {

        // if (this.props.render) {
        //     if (latLngBounds(this.props.bounds[0], this.props.bounds[1]).contains(this.props.track.geometry.coordinates)) {
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
                    Bod: {this.props.coords[0]}, {this.props.coords[1]}
                </Accordion.Toggle>
                <Accordion.Collapse eventKey={this.props.index}>
                    <CardBody
                        coords={this.props.coords}
                        elevation={this.props.elevation}
                        time={this.props.time}
                    />
                </Accordion.Collapse>
            </Card>
        );
    }
}

SideBarCard = connect (
    state => {
        return {
            bounds: state.bounds
        }
    }
)(SideBarCard);

function CardBody(props) {
    return (
        <Card.Body>
            <Input label="Lat" val={props.coords[0]}/>
            <Input label="Lng" val={props.coords[1]}/>
            <Input label="Ele" val={props.elevation}/>
            <Input label="Time" val={props.time}/>
        </Card.Body>
    );
}