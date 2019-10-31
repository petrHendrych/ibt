import React, {Component} from 'react';
import {Card, Accordion} from "react-bootstrap";
import Input from './Input';

export default class SideBarCard extends Component {
    state = {lat: this.props.coords[0], lng: this.props.coords[1]};

    onFormSubmit = event => {
        event.preventDefault();
    };

    render() {
        return (
            <Card>
                <Accordion.Toggle as={Card.Header} eventKey={this.props.index} onClick={this.props.onClick} className={this.props.active ? 'selected' : ''}>
                    Bod: {this.state.lat}, {this.state.lng}
                </Accordion.Toggle>
                <Accordion.Collapse eventKey={this.props.index}>
                    <Card.Body>
                        <div>
                            <form onSubmit={this.onFormSubmit}>
                                <div>
                                    <label className="mr-2">Latitude</label>
                                    <Input coords={this.props.coords[0]}/>
                                </div>
                                <div>
                                    <label className="mr-2">Longitude</label>
                                    <Input coords={this.props.coords[1]}/>
                                </div>
                                <div>
                                    <label className="mr-2">Elevation</label>
                                    <Input coords={this.props.coords[2]}/>
                                </div>
                            </form>
                        </div>
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
        );
    }
}