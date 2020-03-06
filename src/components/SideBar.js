import React, {Component} from 'react';
import { Accordion, Card } from "react-bootstrap";
import { connect } from 'react-redux';
import {List, AutoSizer, CellMeasurer, CellMeasurerCache} from 'react-virtualized';
import _ from 'lodash';

import SideBarCard from './SideBarCard';
import SideBarHeader from './SideBarHeader';
import { selectPoint } from "../actions";
import { Spinner } from "../utils";
import {getTrack} from "../actions/tracks";


export default class SideBar extends Component {
    constructor(props) {
        super(props);

        this.cache = new CellMeasurerCache({
            fixedWidth: true,
            defaultHeight: 50
        })
    }

    getFileName = (id) => {
        let result = "";
        this.props.files.forEach(track => {
            if (track.id === id) {
                result = track.title;
            }
        });
        return result;
    };

    rowRenderer = ({index, key, isScrolling, style, parent}) => {
        return (
            <CellMeasurer
                parent={parent}
                key={key}
                cache={this.cache}
                columnIndex={0}
                rowIndex={index}
            >
                <div className="p-2 clearfix" style={style}>
                    <Card className="side-card"
                          border="success"
                          onClick={() => this.props.getTrack(this.props.trackList[index].id)}
                    >
                        <div><strong>{this.props.trackList[index].name}</strong></div>
                        <div>
                            <span className="float-left pt-2">File: {this.getFileName(this.props.trackList[index].gpx_file)}</span>
                            <button className="btn btn-danger btn-sm float-right m-2">Delete</button>
                        </div>
                    </Card>
                </div>
            </CellMeasurer>
        )
    };

    render() {

        if (this.props.auth.isLoading || this.props.trackLoading) {
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
                <div style={{ flex: '1 1 auto' }}>
                    <AutoSizer>
                        {({ height, width }) => (
                            <List
                                rowCount={this.props.trackList.length}
                                width={width}
                                height={height}
                                defferedMeasurementCache={this.cache}
                                rowHeight={this.cache.rowHeight}
                                rowRenderer={this.rowRenderer}
                                overscanRowCount={3}
                            />
                        )}
                    </AutoSizer>
                </div>
                <Footer/>
                {/*<Accordion activeKey={this.props.selectedIndex}>*/}
                    {/*{this.props.data.features[1].geometry.coordinates.map((coordinates, index) =>*/}
                        {/*<SideBarCard*/}
                            {/*onClick={() => this.props.selectPoint(index)}*/}
                            {/*active={index === this.props.selectedIndex}*/}
                            {/*key={`card-${index}`}*/}
                            {/*index={index}*/}
                            {/*coords={coordinates}*/}
                            {/*render={this.props.bounds.length === 2}*/}
                        {/*/>*/}
                    {/*)}*/}
                {/*</Accordion>*/}
            </div>
        );
    }
}

function Footer(props) {
    return (
        <div className="footer p-2">
            <span className="small">Tato práce byla vytvořena jako bakalářská práce na <a href="https://www.fit.vut.cz/">Fakultě informačních technologií VUT v Brně</a>
            </span>
        </div>
    )
}

SideBar = connect (
    state => {
        return {
            bounds: state.bounds,
            selectedIndex: state.selectedIndex,
            trackLoading: state.tracks.isLoading,
            trackList: state.tracks.data ? state.tracks.data : [],
            files: state.files.data ? state.files.data : [],
            auth: state.auth
        }
    },
    dispatch => {
        return {
            selectPoint: (p) => dispatch(selectPoint(p)),
            getTrack: (id) => dispatch(getTrack(id))
        }
    }
)(SideBar);


