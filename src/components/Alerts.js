import React, { Component, Fragment } from 'react';
import { withAlert } from 'react-alert';
import {connect} from 'react-redux';

class Alerts extends Component {
    componentDidUpdate(prevProps) {
        const {error, alert } = this.props;
        if ( error !== prevProps.error) {
            if (error.msg.non_field_errors) {
                alert.error(error.msg.non_field_errors.join())
            }
            if (error.status === 403) {
                alert.error(error.msg.detail)
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

export default connect(mapStateToProps)(withAlert()(Alerts));