import React, {Component} from 'react';
import {Card, Accordion} from "react-bootstrap";
import {connect} from 'react-redux';
import Input from './Input';

import {latLngBounds} from 'leaflet';

export default class SideBarCard extends Component {
    render() {

        if (this.props.render) {
            if (latLngBounds(this.props.bounds[0], this.props.bounds[1]).contains(this.props.coords)) {
                return (
                    <Card>
                        <Accordion.Toggle as={Card.Header} eventKey={this.props.index} onClick={this.props.onClick} className={this.props.active ? 'selected' : ''}>
                            Bod: {this.props.coords[0]}, {this.props.coords[1]}
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey={this.props.index}>
                            <CardBody coords={this.props.coords} />
                        </Accordion.Collapse>
                    </Card>
                );
            } else return <></>;
        }

        return (
            <Card>
                <Accordion.Toggle as={Card.Header} eventKey={this.props.index} onClick={this.props.onClick} className={this.props.active ? 'selected' : ''}>
                    Bod: {this.props.coords[0]}, {this.props.coords[1]}
                </Accordion.Toggle>
                <Accordion.Collapse eventKey={this.props.index}>
                    <CardBody coords={this.props.coords} />
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
            <Input label="Lat" coords={props.coords[0]}/>
            <Input label="Lng" coords={props.coords[1]}/>
            <Input label="Ele" coords={props.coords[2]}/>
            <Input label="Time" coords={props.coords[2]}/>
        </Card.Body>
    );
}