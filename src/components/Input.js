import React, {Component} from 'react';

export default class Input extends Component {
    state = { value: this.props.val };

    onInputChange = event => {
        const re = /^[-]?([0-9]+(\.[0-9]*)?)$/;
        if (event.target.value === '' || re.test(event.target.value)) {
            this.setState({value: event.target.value});
        }
    };

    render () {
        return (
            <div className="input-group input-group-sm mb-2 d-inline-flex w-50">
                <div className="input-group-prepend">
                    <span className="input-group-text justify-content-center input-span">{this.props.label}</span>
                </div>
                <input
                    className="pl-1 side-bar-input"
                    type="text"
                    value={this.state.value}
                    onChange={this.onInputChange}
                />
            </div>
        );
    }
}