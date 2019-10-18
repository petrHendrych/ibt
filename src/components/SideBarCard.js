import React, {Component} from 'react';
import {Card, Accordion} from "react-bootstrap";
import Input from './Input';

export default class SideBarCard extends Component {
    state = {lat: this.props.lat, lng: this.props.lng};

    onFormSubmit = event => {
        event.preventDefault();
    };

    render() {
        return (
            <Card>
                <Accordion.Toggle as={Card.Header} eventKey={this.props.index}>
                    Bod: {this.state.lat}, {this.state.lng}
                </Accordion.Toggle>
                <Accordion.Collapse eventKey={this.props.index}>
                    <Card.Body>
                        <div>
                            <form onSubmit={this.onFormSubmit}>
                                <div>
                                    <label className="mr-2">Latitude</label>
                                    <Input coords={this.props.lat}/>
                                </div>
                                <div>
                                    <label className="mr-2">Longitude</label>
                                    <Input coords={this.props.lng}/>
                                </div>
                                <div>
                                    <label className="mr-2">Elevation</label>
                                    <Input coords={this.props.ele}/>
                                </div>
                            </form>
                        </div>
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
        );
    }
}