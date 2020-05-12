import React, {Component} from 'react';
import { ReactComponent as Logo } from '../images/markerError.svg'
import {Link} from "react-router-dom";

export default class ErrorView extends Component {
    render() {
        return <div className="error_container">
            <Logo/>
            <div className="text_container">
                <h1 className="border-bottom pb-2 display-4">Page not found</h1>
                <h5>Back to <Link to="/">home</Link> page</h5>
            </div>
        </div>
    }
}