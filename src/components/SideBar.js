import React, {Component} from 'react';
import {Accordion, Card} from "react-bootstrap";
import { connect } from 'react-redux';
import {List, AutoSizer, CellMeasurer, CellMeasurerCache} from 'react-virtualized';
import _ from 'lodash';

import SideBarCard from './SideBarCard';
import SideBarHeader from './SideBarHeader';
import {deletePoints, selectPoint} from "../actions/points";
import { Spinner } from "../utils";
import {deleteTrack, getTrack, updateTrack} from "../actions/tracks";
import {BOUNDS_CLEAR, TRACK_CLEAR, TRACK_PARTITION_CLEAR, UNSELECT_POINT} from "../actions/types";
import SideBarNavigation from "./SideBarNavigation";


export default class SideBar extends Component {
    constructor(props) {
        super(props);

        this.cacheTracks = new CellMeasurerCache({
            fixedWidth: true,
            defaultHeight: 50
        });

        this.state = {
            isShow: false
        };

        this.isShow = this.isShow.bind(this);
    }

    isShow = () => {
        this.setState({isShow: !this.state.isShow});
    };

    getFileName = (id) => {
        let result = "";
        this.props.files.forEach(track => {
            if (track.id === id) {
                result = track.title;
            }
        });
        return result;
    };

    deleteTrackHandler = (id) => {
        if (window.confirm("Are you sure you want to delete this track?")) {
            this.props.deleteTrack(id);
        }
    };

    tracksRenderer = ({index, key, style, parent}) => {
        return (
            <CellMeasurer
                parent={parent}
                key={key}
                cache={this.cacheTracks}
                columnIndex={0}
                rowIndex={index}
            >
                <div className="p-2 clearfix" style={style}>
                    <Card className="side-card"
                          border="success"
                          onClick={() => {this.props.getTrack(this.props.trackList[index].id); this.isShow()}}
                    >
                        <div><strong>{this.props.trackList[index].name}</strong></div>
                        <div>
                            <span className="float-left pt-2">File: {this.getFileName(this.props.trackList[index].gpx_file)}</span>
                            <button
                                className="btn btn-danger btn-sm float-right m-2"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    this.deleteTrackHandler(this.props.trackList[index].id);
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </Card>
                </div>
            </CellMeasurer>
        )
    };

    render() {
        if (this.props.auth.isLoading || this.props.tracksLoading) {
            return (
                <div className="side-bar d-flex flex-column justify-content-between">
                    <SideBarHeader/>
                    <div className="flex-mid">
                        <Spinner size="5x"/>
                    </div>
                    <Footer/>
                </div>
            );
        }

        if (_.isEmpty(this.props.trackList) && this.props.auth.isAuthenticated) {
            return (
                <div className="side-bar d-flex flex-column justify-content-between">
                    <SideBarHeader/>
                    <div className="flex-mid">
                        <span className="new-line text-center">{"No tracks \nUpload gpx file"}</span>
                    </div>
                    <Footer/>
                </div>
            )
        }

        if (_.isEmpty(this.props.trackList)) {
            return (
                <div className="side-bar d-flex flex-column justify-content-between">
                    <SideBarHeader/>
                    <div className="flex-mid">
                        <span
                            className="new-line text-center">{"No tracks available \nPlease login or create new account"}</span>
                    </div>
                    <Footer/>
                </div>
            )
        }

        return (
            <div className="side-bar d-flex flex-column justify-content-between">
                <SideBarHeader />
                <div style={{ flex: '1 1 auto', overflow: 'hidden' }}>
                    <AutoSizer>
                        {({ height, width }) => (
                            <List
                                rowCount={this.props.trackList.length}
                                width={width}
                                height={height}
                                defferedMeasurementCache={this.cacheTracks}
                                rowHeight={this.cacheTracks.rowHeight}
                                rowRenderer={this.tracksRenderer}
                                overscanRowCount={5}
                            />
                        )}
                    </AutoSizer>
                    <PointContainer show={this.state.isShow} onChange={this.isShow}/>
                </div>
                <Footer/>
            </div>
        );
    }
}

function Footer() {
    return (
        <div className="footer p-2">
            <span className="small">
                Tato práce byla vytvořena jako bakalářská práce na <a href="https://www.fit.vut.cz/">Fakultě informačních technologií VUT v Brně</a>
            </span>
        </div>
    )
}

SideBar = connect (
    state => {
        return {
            auth: state.auth,
            track: state.tracks.track,
            selectedIndex: state.selectedIndex,
            partition: state.partition,
            tracksLoading: state.tracks.isLoadings,
            files: state.files.data ? state.files.data : [],
            trackList: state.tracks.data ? state.tracks.data : []
        }
    },
    dispatch => {
        return {
            getTrack: (id) => dispatch(getTrack(id)),
            deleteTrack: (id) => dispatch(deleteTrack(id)),
        }
    }
)(SideBar);

class PointContainer extends Component {
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
        if (this.state.toggleDelete) {
            if (window.confirm("Are you sure you want to delete these points?")) {
                this.props.deletePoints(indexes);
                this.toggleCheckboxes();
            }
        } else {
            this.toggleCheckboxes();
        }
    };

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

    checkboxHandler = (index) => {
        if (this.state.checked.includes(index)) {
            this.setState({checked: this.state.checked.filter(idx => idx !== index)})
        } else {
            this.setState({checked: [...this.state.checked, index]});
        }
    };

    pointsRenderer = ({index, key, style, parent}) => {
        let coords = [], time = [], elevation = [];

        if (!_.isEmpty(this.props.partition.data)) {
            coords = this.props.partition.data.points[index];
            time = this.props.partition.data.times[index];
            elevation = this.props.partition.data.elevations[index];
        } else {
            coords = this.props.track.geometry.coordinates[0][index];
            time = this.props.track.properties.times[index];
            elevation = this.props.track.properties.elevations[index];
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
                            onClick={() => {this.props.selectPoint(index); this.makeTimeout()}}
                            active={index === this.props.selectedIndex}
                            key={`card-${index}`}
                            index={index}
                            coords={coords}
                            elevation={elevation}
                            time={time}
                            delete={this.state.toggleDelete}
                            checked={this.checkboxHandler}
                            all={this.state.checkAll}
                        />
                    </Accordion>
                </div>
            </CellMeasurer>
        )
    };

    getPointsLength = () => {
        if (!_.isEmpty(this.props.partition.data)) {
            return this.props.partition.data.points.length;
        } else {
            return this.props.track.geometry.coordinates[0].length;
        }
    };

    render() {

        return (
            <div className={"point-container " + (this.props.show ? "show" : "")}>
                <SideBarNavigation onChange={this.props.onChange}
                                   onDelete={() => this.toggleDelete(this.state.checked)}
                                   toggleState={this.state.toggleDelete}
                                   checked={this.state.checked}
                />

                {!_.isEmpty(this.props.track) && !this.props.partition.isLoading && !this.props.trackLoading ?
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
                                    overscanRowCount={45}
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

PointContainer = connect (
    state => {
        return {
            bounds: state.bounds,
            track: state.tracks.track,
            partition: state.partition,
            selectedIndex: state.selectedIndex,
            trackLoading: state.tracks.isLoading
        }
    },
    dispatch => {
        return {
            selectPoint: (p) => dispatch(selectPoint(p)),
            updateTrack: (id, track) => dispatch(updateTrack(id, track)),
            deletePoints: (indexes) => dispatch(deletePoints(indexes)),
            clearAll: () => {
                dispatch({type: TRACK_CLEAR});
                dispatch({type: UNSELECT_POINT});
                dispatch({type: TRACK_PARTITION_CLEAR});
                dispatch({type: BOUNDS_CLEAR})
            }
        }
    }
)(PointContainer);
