import React, { Component, Fragment } from 'react';
import { withAlert } from 'react-alert';
import {connect} from 'react-redux';
import {
    AUTH_ERROR,
    BOUNDS_CLEAR,
    TRACKS_CLEAR,
    TRACK_PARTITION_CLEAR,
    UNSELECT_POINT,
    FILES_CLEAR
} from "../actions/types";

class Alerts extends Component {
    componentDidUpdate(prevProps) {
        const {error, alert } = this.props;
        if ( error !== prevProps.error) {
            if (error.msg.non_field_errors) {
                alert.error(error.msg.non_field_errors.join())
            }
            if (error.status === 403) {
                alert.error(error.msg.detail);
                if (error.msg.detail === "Invalid token.") {
                    this.props.authError();
                    this.props.clearAll();
                }
            }
            if (error.status === 400) {
                if (error.msg.track) {
                    alert.error(error.msg.track[0])
                }
                if (error.msg.gpx_file) {
                    alert.error(error.msg.gpx_file[0])
                }
            }
            if (error.status === 401) {
                if (error.msg.pass) {
                    alert.error(error.msg.pass[0])
                }
            }
        }
    }

    render () {
        return <Fragment/>
    }
}

const mapStateToProps = state => ({
    error: state.errors
});

const mapDispatchToProps = dispatch => {
    return {
        authError: () => dispatch({type: AUTH_ERROR}),
        clearAll: () => {
            dispatch({type: TRACKS_CLEAR});
            dispatch({type: FILES_CLEAR});
            dispatch({type: UNSELECT_POINT});
            dispatch({type: TRACK_PARTITION_CLEAR});
            dispatch({type: BOUNDS_CLEAR})
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withAlert()(Alerts));