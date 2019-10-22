import React, {Component} from 'react';
import { Accordion } from "react-bootstrap";
import { connect } from 'react-redux';

import SideBarCard from './SideBarCard';
import SideBarHeader from './SideBarHeader';


export default class SideBar extends Component {
    render() {
        return (
            <div className="side-bar">
                <SideBarHeader />
                <Accordion>
                    {this.props.points.map((coordinates, index) =>
                        <SideBarCard
                            key={`card-${index}`}
                            index={index}
                            lng={this.props.points[index][1]}
                            lat={this.props.points[index][0]}
                            ele={this.props.points[index][2]}
                        />
                    )}
                </Accordion>
            </div>
        );
    }
}

SideBar = connect (
    state => {
        return {
            points: state.points
        }
    }
)(SideBar);


