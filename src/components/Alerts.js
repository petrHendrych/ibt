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