import React, {Component} from 'react';
import {Button, Card, Col, Container, Form, Row} from "react-bootstrap";
import {Link} from "react-router-dom";

export default class RegisterView extends Component {
    render() {
        return (
            <Container className="w-50">
                <Row className="justify-content-center align-items-center flex-fill">
                    <Col>
                        <Card className="p-4 mt-5">
                            <Card.Body>
                                <h1>Register</h1>
                                <p className="text-muted">Create new account. All fields are required</p>
                                <RegisterForm />
                                <p className="mt-4">Already have an account? <Link to="/login">Login here!</Link></p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }
}

class RegisterForm extends Component {
    state = {
        username: '',
        email: '',
        password: '',
        password2: ''
    };

    onSubmit = (e) => {
        e.preventDefault();
        console.log('submit');
    };

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    render() {
        const {username, email, password, password2} = this.state;

        return (
            <Form onSubmit={this.onSubmit}>
                <Form.Group controlId="formBasicUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" placeholder="Enter username" onChange={this.onChange} value={username}
                    name="username"/>
                </Form.Group>

                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" placeholder="example@gmail.com" onChange={this.onChange} value={email}
                    name="email"/>
                    <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" onChange={this.onChange} value={password} name="password"/>
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Verity password</Form.Label>
                    <Form.Control type="password" onChange={this.onChange} value={password2} name="password2"/>
                    <Form.Text className="text-muted">
                        Verify password by entering the same password from the above field.
                    </Form.Text>
                </Form.Group>

                <Button variant="primary" type="submit">
                    Register
                </Button>
            </Form>
        );
    }
}