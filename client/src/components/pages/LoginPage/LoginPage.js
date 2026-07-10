import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Alert
} from 'reactstrap';
import '../../../styles/AuthStyles.scss';

const LoginPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ login: '', password: '' });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.login || !formData.password) {
      setError('Please fill in both fields.');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.message || errData?.error || 'Invalid login or password');
      }

      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="auth-page">
      <h1>Sign In</h1>

      {error && <Alert color="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit} className="auth-form">
        <FormGroup>
          <Label for="login">Login</Label>
          <Input
            type="text"
            name="login"
            id="login"
            value={formData.login}
            onChange={handleChange}
            placeholder="Your login"
          />
        </FormGroup>

        <FormGroup>
          <Label for="password">Password</Label>
          <Input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Your password"
          />
        </FormGroup>

        <Button color="primary" type="submit" disabled={submitting} block>
          {submitting ? 'Signing in...' : 'Sign In'}
        </Button>
      </Form>

      <p className="auth-switch">
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
    </Container>
  );
};

export default LoginPage;