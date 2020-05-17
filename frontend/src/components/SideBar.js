import React, {Component} from 'react';
import {Card} from "react-bootstrap";
import { connect } from 'react-redux';
import {List, AutoSizer, CellMeasurer, CellMeasurerCache} from 'react-virtualized';
import _ from 'lodash';

import PointContainer from './PointContainer';
import SideBarHeader from './SideBarHeader';
import { Spinner } from "../utils";
import {deleteTrack, getTrack} from "../actions/tracks";


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
                        <div>
                            <strong>{this.props.trackList[index].name}</strong>
                        </div>
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
        if (this.props.auth.trackIsLoading) {
            return (
                <div className="side-bar d-flex flex-column justify-content-between">
                    <div className="flex-mid">
                        <Spinner size="5x"/>
                    </div>
                    <Footer/>
                </div>
            )
        }
        if (this.props.tracksLoading) {
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
            tracksLoading: state.tracks.trackListIsLoading,
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