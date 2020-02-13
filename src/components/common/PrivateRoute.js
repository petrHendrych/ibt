import React from 'react';
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {Route} from "react-router";


const PrivateRoute = ({ component: Component, auth, ...rest }) => (
    <Route
        {...rest}
        render={props => {
            return <Component {...props}/>;
        }}
    />
);

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(PrivateRoute);