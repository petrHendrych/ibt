import React, {Component} from 'react';
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faTrashAlt, faSave, faTimes, faDownload } from '@fortawesome/free-solid-svg-icons';
import {connect} from 'react-redux';

import {downloadTrack, updateTrack} from "../actions/tracks";
import {BOUNDS_CLEAR, TRACK_CLEAR, TRACK_PARTITION_CLEAR, UNSELECT_POINT} from "../actions/types";

export default class SideBarNavigation extends Component {
    render () {
        return (
            <nav className={"navigation text-center " + (this.props.partition.loaded ? "partition" : "")}>
                <NavIcon text="back to tracks"
                         icon={faArrowRight}
                         onClick={() => {
                             this.props.onClose();
                             this.props.clearAll();
                             this.props.onToggle();
                         }}
                />
                <div className="ml-5 mr-3  d-inline-block">
                    <NavIcon text="download"
                             icon={faDownload}
                             onClick={() => this.props.downloadTrack()}
                    />
                </div>
                <div className="ml-3 mr-5 d-inline-block">
                    <NavIcon text="save changes"
                             icon={faSave}
                             onClick={() => this.props.updateTrack(this.props.track.properties.id)}
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
                    this.props.partition.loaded ?
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
            track: state.tracks.track,
            selectedIndex: state.selectedIndex,
            partition: state.partition
        }
    },
    dispatch => {
        return {
            updateTrack: (id) => dispatch(updateTrack(id)),
            downloadTrack: () => dispatch(downloadTrack()),
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