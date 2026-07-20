import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';
import '../../../styles/AuthStyles.scss';
import { API_URL } from '../../../config';

const RegisterPage = () => {
  const navigate = useNavigate();

  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState(null);

  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append('login', login);
    fd.append('password', password);
    fd.append('phone', phone);
    fd.append('avatar', avatar);

    const options = {
      method:'POST',
      body: fd
    };

    setStatus('loading');
    fetch(`${API_URL}/auth/register`, options)
      .then(res => {
        if (res.status === 200) {
          setStatus('success');
          setTimeout(() => navigate('/login'), 2000);
        } else if (res.status === 409) {
          setStatus('loginTaken');
        } else if (res.status === 400) {
          setStatus('missingFields');
        } else {
          setStatus('error');
        }
    }) 
    .catch (err => {
      setStatus('error');
    });
  };

  return (
    <Container className="auth-page">
      <h1>Sign Up</h1>

      {status === 'success' && (
        <Alert variant="success">
          <Alert.Heading>Success!</Alert.Heading>
          <p>You have been successfully registered! You can now log in...</p>
        </Alert>
      )}

      {status === 'error' && (
        <Alert variant="danger">
          <Alert.Heading>Something went wrong...</Alert.Heading>
          <p>Unexpected error... Try again!</p>
        </Alert>
      )}

      {status === 'missingFields' && (
        <Alert variant="danger">
          <Alert.Heading>Not enough data</Alert.Heading>
          <p>You have to fill all the fields.</p>
        </Alert>
      )}

      {status === 'loginTaken' && (
        <Alert variant="warning">
          <Alert.Heading>Login already in use</Alert.Heading>
          <p>You have to use other login</p>
        </Alert>
      )}

      {status === 'loading' && (
        <Spinner animation='border' role='status' className='block mx-auto'>
          <span className='visually-hidden'>Loading...</span>
        </Spinner>
      )}

      <Form onSubmit={handleSubmit} className="auth-form">
        <Form.Group className="mb-3" controlId="login">
          <Form.Label>Login</Form.Label>
          <Form.Control
            type="text"
            name="login"
            value={login}
            onChange={e => setLogin(e.target.value)}
            placeholder="Enter login"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="phone">
          <Form.Label>Phone</Form.Label>
          <Form.Control
            type="tel"
            name="phone"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="Phone number"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="avatar">
          <Form.Label>Avatar</Form.Label>
          <Form.Control
            type="file"
            name="avatar"
            onChange={e => setAvatar(e.target.files[0])}
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100">
          Sign Up
        </Button>
      </Form>

      <p className="auth-switch">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </Container>
  );
};

export default RegisterPage;