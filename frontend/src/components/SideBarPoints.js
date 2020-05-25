/**
 * @author Petr Hendrych <xhendr03@fit.vutbr.cz>
 * @file Point container component to display points of track
 */

import React, {Component} from 'react';
import {Accordion} from "react-bootstrap";
import { connect } from 'react-redux';
import {List, AutoSizer, CellMeasurer, CellMeasurerCache} from 'react-virtualized';
import _ from 'lodash';

import SideBarCard from './SideBarCard';
import SideBarMenu from "./SideBarMenu";
import {deletePartitionPoints, deletePoints, pointsError, selectPoint} from "../actions/points";
import { Spinner } from "../utils";
import {deleteTrack, updateTrack} from "../actions/tracks";
import {BOUNDS_CLEAR, TRACK_CLEAR, TRACK_PARTITION_CLEAR, UNSELECT_POINT} from "../actions/types";

export default class SideBarPoints extends Component {
    constructor(props) {
        super(props);

        this.cachePoints = new CellMeasurerCache({
            fixedWidth: true,
            defaultHeight: 25
        });
    }

    state = {
        toggleDelete: false,
        checkAll: false,
        checked: []
    };

    componentDidUpdate(pProps) {
        if (this.list) {
            this.cachePoints.clearAll();
            this.list.forceUpdateGrid();
        }
    };

    bindListRef = ref => {
        this.list = ref;
    };

    makeTimeout = () => {
        setTimeout(() => {
            if (this.list) {
                this.cachePoints.clearAll();
                this.list.forceUpdateGrid();
            }
        }, 1)
    };

    toggleCheckboxes = (toggle = true) => {
        if (toggle) {
            this.setState({
                toggleDelete: !this.state.toggleDelete,
                checked: [],
                checkAll: false
            });
        }
    };

    toggleDelete = (indexes) => {
        const trackLength = this.props.track.geometry.coordinates.length;

        if (this.state.toggleDelete && !_.isEmpty(this.state.checked)) {
            if (trackLength - indexes.length === 1) {
                this.props.pointsError();
                return
            }

            if (window.confirm("Are you sure you want to delete these points?")) {
                this.props.selectPoint(this.props.selectedIndex);

                if (indexes.length === trackLength) {
                    this.props.deleteTrack(this.props.track.properties.id);
                    this.props.clearAll();
                    this.props.onChange();
                } else {
                    this.props.deletePoints(indexes);
                    if (!_.isEmpty(this.props.partition.indexes)) {
                        this.props.deletePartitionPoints(indexes);
                    }
                    this.props.updateTrack(this.props.track.properties.id);
                    this.setState({checked: []});
                }
            }
        }
        this.toggleCheckboxes();
    };

    // Function to handle selecting all checkboxes (even with partition)
    checkAll = () => {
        this.setState({checkAll: !this.state.checkAll}, () => {
            let arr = this.state.checked;
            let len = this.props.track.geometry.coordinates.length;

            if (this.state.checkAll) {
                if (this.props.partition.loaded) {
                    len = this.props.partition.indexes.length;
                    for (let i = 0; i < len; i++) {
                        if (arr.includes(this.props.partition.indexes[i])) {
                            continue;
                        }
                        arr = [...arr, this.props.partition.indexes[i]];
                    }
                } else {
                    for (let i = 0; i < len; i++) {
                        if (arr.includes(i)) {continue;}
                        arr = [...arr, i];
                    }
                }
                this.setState({checked: arr});
            } else {
                this.setState({checked: []});
            }
        });
    };

    checkboxHandler = (index) => {
        if (this.state.checked.includes(index)) {
            this.setState({checked: this.state.checked.filter(idx => idx !== index)})
        } else {
            this.setState({checked: [...this.state.checked, index]});
        }
    };

    getIndex = (index) => {
        if (_.isEmpty(this.props.partition.indexes)) {
            return index;
        }
        return this.props.partition.indexes[index];
    };

    pointsRenderer = ({index, key, style, parent}) => {

        const coords = this.props.track.geometry.coordinates[this.getIndex(index)];
        const time = this.props.track.properties.times[this.getIndex(index)];
        const elevation = this.props.track.properties.elevations[this.getIndex(index)];

        if (this.props.partition.loaded && _.isEmpty(this.props.partition.indexes)) {
            return <div style={style} key={key} className="text-center">No points in selected bounds.</div>
        }

        if (_.isEmpty(this.props.track.geometry.coordinates)) {
            return <div style={style} key={key} className="text-center">Track doesn't have any points.</div>
        }

        return (
            <CellMeasurer
                parent={parent}
                key={key}
                cache={this.cachePoints}
                columnIndex={0}
                rowIndex={index}
            >
                <div style={style}>
                    <Accordion activeKey={this.props.selectedIndex}>
                        <SideBarCard
                            selectPointClick={() => {this.props.selectPoint(this.getIndex(index)); this.makeTimeout()}}
                            active={this.getIndex(index) === this.props.selectedIndex}
                            key={`card-${this.getIndex(index)}`}
                            index={this.getIndex(index)}
                            coords={coords}
                            elevation={elevation}
                            time={time}
                            delete={this.state.toggleDelete}
                            checked={this.checkboxHandler}
                            checkAll={this.state.checkAll}
                        />
                    </Accordion>
                </div>
            </CellMeasurer>
        )
    };

    getPointsLength = () => {
        if (this.props.partition.loaded) {
            if (_.isEmpty(this.props.partition.indexes)) {
                return 1
            }
            return this.props.partition.indexes.length
        }
        if (_.isEmpty(this.props.track.geometry.coordinates)) {
            return 1
        }
        return this.props.track.geometry.coordinates.length
    };

    render() {

        return (
            <div className={"point-container " + (this.props.show ? "show" : "")}>
                <SideBarMenu onClose={this.props.onChange}
                             toggle={this.state.toggleDelete}
                             onDelete={() => this.toggleDelete(this.state.checked)}
                             onToggle={() => this.toggleCheckboxes(this.state.toggleDelete)}
                             onCheckAll={() => this.checkAll()}
                />

                {!_.isEmpty(this.props.track) && !this.props.partition.trackIsLoading && !this.props.trackLoading ?
                    <div style={{ flex: '1 1 auto' }}>
                        <AutoSizer>
                            {({ height, width }) => (
                                <List
                                    ref={this.bindListRef}
                                    rowCount={this.getPointsLength()}
                                    height={height}
                                    width={width}
                                    defferedMeasurementCache={this.cachePoints}
                                    rowHeight={this.cachePoints.rowHeight}
                                    rowRenderer={this.pointsRenderer}
                                    overscanRowCount={10}
                                />
                            )}
                        </AutoSizer>
                    </div>
                    :
                    <div className="flex-mid">
                        <Spinner size="5x"/>
                    </div>
                }
            </div>
        )
    }
}

SideBarPoints = connect (
    state => {
        return {
            track: state.tracks.track,
            partition: state.partition,
            selectedIndex: state.selectedIndex,
            trackLoading: state.tracks.trackIsLoading
        }
    },
    dispatch => {
        return {
            selectPoint: (p) => dispatch(selectPoint(p)),
            deleteTrack: (id) => dispatch(deleteTrack(id)),
            updateTrack: (id) => dispatch(updateTrack(id)),
            deletePoints: (indexes) => dispatch(deletePoints(indexes)),
            pointsError: () => dispatch(pointsError()),
            deletePartitionPoints: (indexes) => dispatch(deletePartitionPoints(indexes)),
            clearAll: () => {
                dispatch({type: TRACK_CLEAR});
                dispatch({type: UNSELECT_POINT});
                dispatch({type: TRACK_PARTITION_CLEAR});
                dispatch({type: BOUNDS_CLEAR})
            }
        }
    }
)(SideBarPoints);