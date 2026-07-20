import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, InputGroup } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import './SearchForm.scss';

const SearchForm = () => {
  const [phrase, setPhrase] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (phrase.trim()) {
      navigate(`/search/${encodeURIComponent(phrase.trim())}`);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="search-form">
      <InputGroup className="search-input-group">
        <Form.Control
          type="text"
          placeholder="Search ads..."
          value={phrase}
          onChange={(e) => setPhrase(e.target.value)}
        />
        <Button variant="primary" type="submit">Search</Button>
      </InputGroup>
    </Form>
  );
};

export default SearchForm;