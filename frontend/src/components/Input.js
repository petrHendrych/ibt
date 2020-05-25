/**
 * @author Petr Hendrych <xhendr03@fit.vutbr.cz>
 * @file Input component for latitude and longitude
 */

import React, {Component} from 'react';

export default class Input extends Component {
    state = {
        value: this.props.val,
        valid: true
    };

    onInputChange = event => {
        const re = /^[-]?([0-9]{1,3}(\.[0-9]{0,6})?)$/;

        if (event.target.value === '' || re.test(event.target.value)) {
            this.setState({value: event.target.value}, () => {
                if (this.props.label === "Lat") {
                    this.props.onChange(this.state.value, 0);
                } else {
                    this.props.onChange(this.state.value, 1);
                }
            });
        }
    };

    onInputBlur = () => {
        if (this.props.label === "Lat") {
            if (this.validate(0)) {
                this.setState({valid: true});
                this.props.onBlur(true, 0);

            } else {
                this.setState({valid: false});
                this.props.onBlur(false, 0);
            }
        } else {
            if (this.validate(1)) {
                this.setState({valid: true});
                this.props.onBlur(true, 1);

            } else {
                this.setState({valid: false});
                this.props.onBlur(false, 1);
            }
        }
    };

    validate = (idx) => {
        if (idx === 0) {
            return (this.state.value >= -90 && this.state.value <= 90)
        } else {
            return (this.state.value >= -180 && this.state.value <= 180)
        }
    };

    componentDidUpdate(prevProps) {
        if (this.props.val !== prevProps.val) {
            this.setState({value: this.props.val});
            this.setState({valid: true});
        }
    }

    render () {
        const {label} = this.props;
        return (
            <div className="input-group input-group-sm d-inline-flex w-50">
                <div className="input-group-prepend">
                    <span className="input-group-text justify-content-center input-span">{label}</span>
                </div>
                <input
                    className={"pl-1 side-bar-input " + (this.state.valid ? "" : "border-danger")}
                    type="text"
                    value={this.state.value}
                    onChange={this.onInputChange}
                    onBlur={this.onInputBlur}
                    onKeyPress={this.onInputBlur}
                />
                {
                    this.state.valid ? <></> :
                        <label className={"input-error text-danger w-100 mb-0 " + (label === "Lat" ? "left" : "right")}>
                            {label === "Lat" ? "Set value between -90 and 90" : "Set value between -180 and 180"}
                        </label>
                }
            </div>
        );
    }
}