import React, {Component} from 'react';
import {Accordion} from "react-bootstrap";
import SideBarCard from "./SideBarCard";


export default class SideBar extends Component {
    render() {
        return (
            <div className="side-bar">
                <Accordion>
                    {this.props.coordinates.map((coordinates, index) =>
                        <SideBarCard
                            key={`card-${index}`}
                            index={index}
                            lng={this.props.coordinates[index][0]}
                            lat={this.props.coordinates[index][1]}
                            ele={this.props.coordinates[index][2]}
                        />
                    )}
                </Accordion>
            </div>
        );
    }
}

