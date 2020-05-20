import React, {Component} from 'react';
import {Button, Card, Col, Container, Form, Row} from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import {Link} from "react-router-dom";
import {Redirect} from "react-router";
import {connect} from "react-redux";
import PropTypes from "prop-types";

import { loginUser } from '../actions/auth';
import Alerts from "../components/Alerts";

class LoginView extends Component {
    render() {
        if (this.props.isAuthenticated) {
            return <Redirect to={"/"}/>
        }
        return (
            <Container className="w-50">
                <Alerts/>
                <Row className="justify-content-center align-items-center flex-fill">
                    <Col>
                        <Card className="p-4 mt-5">
                            <Card.Body>
                                <h1>Login</h1>
                                <p className="text-muted">All fields are required</p>
                                <LoginForm  loginUser={this.props.loginUser} />
                                <p className="mt-4">Do not have an account, yet? <Link to="/register">Register here!</Link></p>
                                <p><Link to="/"><FontAwesomeIcon icon={faArrowLeft} className="mr-2"/>Back to homepage</Link></p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { loginUser })(LoginView);


class LoginForm extends Component {
    state = {
        username: '',
        password: ''
    };

    static propTypes = {
        loginUser: PropTypes.func.isRequired,
        isAuthenticated: PropTypes.bool
    };

    onSubmit = (e) => {
        e.preventDefault();
        this.props.loginUser(this.state.username, this.state.password);
    };

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    render() {
        const {username, password} = this.state;

        return (
            <Form onSubmit={this.onSubmit}>
                <Form.Group controlId="formBasicUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" placeholder="Enter username" name="username" value={username} onChange={this.onChange} required/>
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" name="password" value={password} onChange={this.onChange} required/>
                </Form.Group>
                <Button variant="primary" type="submit">
                    Login
                </Button>
            </Form>
        );
    }
}