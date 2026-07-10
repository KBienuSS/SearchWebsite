import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, InputGroup } from 'reactstrap';
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
        <Input
          type="text"
          placeholder="Search ads..."
          value={phrase}
          onChange={(e) => setPhrase(e.target.value)}
        />
        <Button color="primary" type="submit">Search</Button>
      </InputGroup>
    </Form>
  );
};

export default SearchForm;