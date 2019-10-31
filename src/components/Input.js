import React, {Component} from 'react';

export default class Input extends Component {
    state = { value: this.props.coords };

    onInputChange = event => {
        //TODO allow to use only numbers in inputs
        this.setState({value: event.target.value});
    };

    render () {
        return (
            <div>
                <input
                    className="pl-1"
                    type="text"
                    value={this.state.value}
                    onChange={this.onInputChange}
                />
            </div>
        );
    }
}