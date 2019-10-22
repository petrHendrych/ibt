import React, {Component} from 'react';
import { Accordion } from "react-bootstrap";
import { connect } from 'react-redux';

import SideBarCard from './SideBarCard';
import SideBarHeader from './SideBarHeader';
import { selectPoint } from "../actions";


export default class SideBar extends Component {
    render() {
        return (
            <div className="side-bar">
                <SideBarHeader />
                <Accordion activeKey={this.props.selectedIndex}>
                    {this.props.points.map((coordinates, index) =>
                        <SideBarCard
                            onClick={() => this.props.selectPoint(index)}
                            active={index === this.props.selectedIndex}
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
            points: state.points,
            selectedIndex: state.selectedPoint
        }
    },
    dispatch => {
        return {
            selectPoint: (p) => dispatch(selectPoint(p))
        }
    }
)(SideBar);


