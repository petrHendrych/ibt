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
    render () {
        return (
            <nav className={"navigation text-center " + (_.isEmpty(this.props.partition.indexes) ? "" : "partition")}>
                <NavIcon text="back to tracks"
                         icon={faArrowRight}
                         onClick={() => {
                             this.props.onClose();
                             this.props.clearAll();
                             this.props.onToggle();
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
                             this.props.onDelete();
                         }}
                         class={this.props.toggle ? "text-danger" : ""}
                />
                {
                    this.props.toggle ?
                        <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-disabled">select all</Tooltip>}>
                            <input
                                type="checkbox"
                                className="select-all-checkbox"
                                onClick={() => this.props.onCheckAll()}
                            />
                        </OverlayTrigger> :
                        <></>
                }

                {
                    !_.isEmpty(this.props.partition.indexes) ?
                        <NavIcon text="deselect partition"
                                 icon={faTimes}
                                 class="icon-times"
                                 onClick={() => {
                                     this.props.clearPartition();
                                 }}
                        /> :
                        <></>
                }
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