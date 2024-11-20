import React, { useState } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../../../components/Card';
import { signIn } from '../../../services/user'; // Import the signIn function from user.js
import Logo from '../../../components/partials/components/logo';
import { errorAlert } from '../../../services/alerts';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../../store/authSlice';
import 'lazysizes';

const SignIn = () => {
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await signIn(e.target.email.value, e.target.password.value); // Use the signIn function
      console.log('Login successful, navigating to dashboard', data);
      localStorage.setItem('token', data.token); // Store token in localStorage
      dispatch(loginSuccess({ token: data.token })); // Update authentication state
      navigate('/dashboard'); // Navigate to dashboard after login
    } catch (error) {
      console.error('Login failed', error);
      errorAlert('Login failed, please try again');
    }
    setInputValue({
      email: "",
      password: "",
    });
  };

  return (
    <>
      <section className="login-content">
        <Row className="m-0 align-items-center bg-white vh-100">
          <Col md="6">
            <Row className="justify-content-center">
              <Col md="10">
                <Card className="card-transparent shadow-none d-flex justify-content-center mb-0 auth-card">
                  <Card.Body>
                    <Link to="/" className="navbar-brand d-flex align-items-center mb-3">
                      <Logo></Logo>
                      <h4 className="logo-title ms-3">SeaSOS</h4>
                    </Link>
                    <h2 className="mb-2 text-center">Sign In</h2>
                    <p className="text-center">Login to stay connected.</p>
                    <Form onSubmit={handleSubmit}>
                      <Row>
                        <Col lg="12">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="email" className="">Email</Form.Label>
                            <Form.Control type="email" className="" id="email" aria-describedby="email" name="email"
                              defaultValue={inputValue.email}
                              placeholder="Enter your email"
                            />
                          </Form.Group >
                        </Col>
                        <Col lg="12" className="">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="password" className="">Password</Form.Label>
                            <Form.Control type="password" className="" id="password" aria-describedby="password" name="password"
                              defaultValue={inputValue.password}
                              placeholder="Enter your password"
                            />
                          </Form.Group>
                        </Col>
                        <Col lg="12" className="d-flex justify-content-between">
                          <Link className="mb-3" to="/auth/reset-password">Forgot Password?</Link>
                        </Col>
                      </Row>
                      <div className="d-flex justify-content-center">
                        <Button type="submit" variant="btn btn-primary">Sign In</Button>
                      </div>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
          <Col md="6" className="d-md-block d-none bg-primary p-0 mt-n1 vh-100 overflow-hidden">
            <div className="gradient-top">
              <div className="box">
                <div className="c xl-circle">
                  <div className="c lg-circle">
                    <div className="c md-circle">
                      <div className="c sm-circle">
                        <div className="c xs-circle">
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </section>
    </>
  );
};

export default SignIn;
