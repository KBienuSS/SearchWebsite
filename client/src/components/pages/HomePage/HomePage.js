import { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner } from 'reactstrap';
import AdCard from '../AdCard/AdCard';
import SearchForm from '../../features/SearchForm/SearchForm';
import './HomePage.scss';

const HomePage = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await fetch('/api/ads');
        if (!response.ok) throw new Error('Failed to fetch ads');
        const data = await response.json();
        const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setAds(sorted);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, []);

  return (
    <Container className="home-page">
      <h1>All Ads</h1>
      <SearchForm />

      {loading && (
        <div className="home-spinner-wrapper">
          <Spinner color="primary" />
        </div>
      )}

      {error && <p className="home-error">{error}</p>}

      {!loading && !error && ads.length === 0 && (
        <p className="home-empty-state">No ads to display!</p>
      )}

      {!loading && !error && ads.length > 0 && (
        <Row className="ads-grid">
          {ads.map((ad) => (
            <Col key={ad._id} md={4} className="mb-4">
              <AdCard ad={ad} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default HomePage;