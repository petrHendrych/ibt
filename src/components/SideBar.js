import React, {Component} from 'react';
import { Accordion } from "react-bootstrap";
import { connect } from 'react-redux';
// import {List} from 'react-virtualized';
import _ from 'lodash';

import SideBarCard from './SideBarCard';
import SideBarHeader from './SideBarHeader';
import { selectPoint } from "../actions";
import { Spinner } from "../utils";


export default class SideBar extends Component {

    renderRow = ({index, key}) => {
        return (
            <SideBarCard
                onClick={() => this.props.selectPoint(index)}
                active={index === this.props.selectedIndex}
                key={`card-${key}`}
                index={index}
                coords={this.props.data.features[1].geometry.coordinates[index]}
                render={this.props.bounds.length === 2}
            />
        //     <List
        // height={700}
        // width={400}
        // rowHeight={35}
        // rowCount={this.props.data.features[1].geometry.coordinates.length}
        // rowRenderer={this.renderRow}
        // />
        );
    };

    render() {

        if (_.isEmpty(this.props.data)) {
            return (
                <div className="side-bar">
                    <SideBarHeader/>
                    <div className="flex-mid h-100">
                        <Spinner size="5x"/>
                    </div>
                </div>
            );
        }

        return (
            <div className="side-bar">
                <SideBarHeader />
                <Accordion activeKey={this.props.selectedIndex}>
                    {this.props.data.features[1].geometry.coordinates.map((coordinates, index) =>
                        <SideBarCard
                            onClick={() => this.props.selectPoint(index)}
                            active={index === this.props.selectedIndex}
                            key={`card-${index}`}
                            index={index}
                            coords={coordinates}
                            render={this.props.bounds.length === 2}
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
            bounds: state.bounds,
            selectedIndex: state.selectedIndex,
            data: state.data
        }
    },
    dispatch => {
        return {
            selectPoint: (p) => dispatch(selectPoint(p))
        }
    }
)(SideBar);


