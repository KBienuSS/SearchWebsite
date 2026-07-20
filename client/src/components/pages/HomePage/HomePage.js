import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import AdCard from '../AdCard/AdCard';
import SearchForm from '../../features/SearchForm/SearchForm';
import { fetchAds, getAds, getAdsLoading, getAdsError } from '../../../redux/adsRedux';
import './HomePage.scss';

const HomePage = () => {
  const dispatch = useDispatch();

  const ads = useSelector(getAds);
  const loading = useSelector(getAdsLoading);
  const error = useSelector(getAdsError);

  useEffect(() => {
    dispatch(fetchAds());
  }, [dispatch]);

  const sortedAds = useMemo(() => {
    return [...ads].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [ads]);

  return (
    <Container className="home-page py-5">
      <h1 className="home-title mb-4">All Ads</h1>

      <div className="home-search-wrapper mb-5">
        <SearchForm />
      </div>

      {loading && (
        <div className="home-spinner-wrapper">
          <Spinner animation="border" variant="primary" />
        </div>
      )}

      {!loading && error && (
        <Alert variant="danger">{error}</Alert>
      )}

      {!loading && !error && sortedAds.length === 0 && (
        <div className="home-empty-state">
          <p>No ads to display!</p>
          <span>Be the first to post one.</span>
        </div>
      )}

      {!loading && !error && sortedAds.length > 0 && (
        <Row className="ads-grid g-4">
          {sortedAds.map((ad) => (
            <Col key={ad._id} xs={12} sm={6} md={4}>
              <AdCard ad={ad} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default HomePage;