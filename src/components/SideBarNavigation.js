import React, {Component} from 'react';
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faTrashAlt, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import {connect} from 'react-redux';
import _ from 'lodash';


import {updateTrack} from "../actions/tracks";
import {deletePoints, selectPoint} from "../actions/points";
import {BOUNDS_CLEAR, TRACK_CLEAR, TRACK_PARTITION_CLEAR, UNSELECT_POINT} from "../actions/types";

export default class SideBarNavigation extends Component {

    checkAll = () => {
        this.setState({checkAll: !this.state.checkAll}, () => {
            let arr = this.state.checked;

            if (this.state.checkAll) {
                for (let i = 0; i < this.props.track.geometry.coordinates[0].length; i++) {
                    if (arr.includes(i)) {continue;}
                    arr = [...arr, i];
                }
                this.setState({checked: arr});
            } else {
                this.setState({checked: []});
            }
        });
    };

    render () {
        return (
            <nav className={"navigation text-center " + (_.isEmpty(this.props.partition.data) ? "" : "partition")}>
                <NavIcon text="back to tracks"
                         icon={faArrowRight}
                         onClick={() => {
                             this.props.onChange();
                             this.props.clearAll();
                             // this.toggleCheckboxes(this.state.toggleDelete)
                         }}
                />
                <div className="mx-5 d-inline-block">
                    <NavIcon text="save changes"
                             icon={faSave}
                             onClick={() => this.props.updateTrack(this.props.track.properties.id, this.props.track)}
                    />
                </div>
                <NavIcon text="delete multiple points"
                         icon={faTrashAlt}
                         onClick={() => {
                             this.props.onDelete(this.props.checked);
                             this.props.selectPoint(this.props.selectedIndex);
                         }}
                />
                <NavIcon text="deselect partition"
                         icon={faTimes}
                         class="icon-times"
                         onClick={() => {
                             this.props.clearPartition();
                         }}
                />
            </nav>
        )
    }
}

SideBarNavigation = connect (
    state => {
        return {
            bounds: state.bounds,
            track: state.tracks.track,
            selectedIndex: state.selectedIndex,
            partition: state.partition
        }
    },
    dispatch => {
        return {
            selectPoint: (p) => dispatch(selectPoint(p)),
            updateTrack: (id, track) => dispatch(updateTrack(id, track)),
            deletePoints: (indexes) => dispatch(deletePoints(indexes)),
            clearPartition: () => {
                dispatch({type: BOUNDS_CLEAR});
                dispatch({type: UNSELECT_POINT});
                dispatch({type: TRACK_PARTITION_CLEAR});
            },
            clearAll: () => {
                dispatch({type: TRACK_CLEAR});
                dispatch({type: UNSELECT_POINT});
                dispatch({type: TRACK_PARTITION_CLEAR});
                dispatch({type: BOUNDS_CLEAR})
            }
        }
    }
)(SideBarNavigation);

function NavIcon(props) {
    return (
        <OverlayTrigger placement="bottom" overlay={<Tooltip className="nav-tooltip" id="tooltip-disabled">{props.text}</Tooltip>}>
            <FontAwesomeIcon
                onClick={() => props.onClick()}
                icon={props.icon}
                className={"pointer " + props.class}
            />
        </OverlayTrigger>
    )
}