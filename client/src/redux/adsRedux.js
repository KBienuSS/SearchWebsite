const createActionName = (actionName) => `app/ads/${actionName}`;

const FETCH_START = createActionName('FETCH_START');
const FETCH_SUCCESS = createActionName('FETCH_SUCCESS');
const FETCH_ERROR = createActionName('FETCH_ERROR');
const SET_AD = createActionName('SET_AD');
const ADD_SUCCESS = createActionName('ADD_SUCCESS');
const UPDATE_SUCCESS = createActionName('UPDATE_SUCCESS');
const REMOVE_SUCCESS = createActionName('REMOVE_SUCCESS');

const fetchStart = () => ({ type: FETCH_START });
const fetchSuccess = (payload) => ({ type: FETCH_SUCCESS, payload });
const fetchError = (payload) => ({ type: FETCH_ERROR, payload });
const setAd = (payload) => ({ type: SET_AD, payload });
const addSuccess = (payload) => ({ type: ADD_SUCCESS, payload });
const updateSuccess = (payload) => ({ type: UPDATE_SUCCESS, payload });
const removeSuccess = (payload) => ({ type: REMOVE_SUCCESS, payload });

export const fetchAds = () => {
  return async (dispatch) => {
    dispatch(fetchStart());
    try {
      const res = await fetch('/api/ads', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch ads');
      const data = await res.json();
      dispatch(fetchSuccess(data));
    } catch (err) {
      dispatch(fetchError(err.message));
    }
  };
};

export const fetchAdsByPhrase = (searchPhrase) => {
  return async (dispatch) => {
    dispatch(fetchStart());
    try {
      const res = await fetch(`/api/ads/search/${searchPhrase}`, { credentials: 'include' });
      if (res.status === 404) {
        dispatch(fetchSuccess([]));
        return;
      }
      if (!res.ok) throw new Error('Failed to fetch ads');
      const data = await res.json();
      dispatch(fetchSuccess(data));
    } catch (err) {
      dispatch(fetchError(err.message));
    }
  };
};

export const fetchAdById = (id) => {
  return async (dispatch) => {
    dispatch(fetchStart());
    try {
      const res = await fetch(`/api/ads/${id}`, { credentials: 'include' });
      if (res.status === 404) {
        dispatch(fetchError('Ad not found'));
        return;
      }
      if (!res.ok) throw new Error('Failed to fetch ad');
      const data = await res.json();
      dispatch(setAd(data));
    } catch (err) {
      dispatch(fetchError(err.message));
    }
  };
};

export const addAd = (formData) => {
  return async (dispatch) => {
    const res = await fetch('/api/ads-add', {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => null);
      throw new Error(errData?.error || errData?.message || 'Failed to create ad');
    }

    const created = await res.json();
    dispatch(addSuccess(created));
    return created;
  };
};

export const updateAd = (id, formData) => {
  return async (dispatch) => {
    const res = await fetch(`/api/ads-update/${id}`, {
      method: 'PUT',
      credentials: 'include',
      body: formData,
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => null);
      throw new Error(errData?.error || errData?.message || 'Failed to update ad');
    }

    const updated = await res.json();
    dispatch(updateSuccess(updated));
    return updated;
  };
};

export const deleteAd = (id) => {
  return async (dispatch) => {
    const res = await fetch(`/api/ads-delete/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => null);
      throw new Error(errData?.error || errData?.message || 'Failed to delete ad');
    }

    dispatch(removeSuccess(id));
  };
};

export const getAds = (state) => state.ads.data;
export const getAdsLoading = (state) => state.ads.loading;
export const getAdsError = (state) => state.ads.error;
export const getAdById = (id) => (state) => state.ads.data.find((ad) => ad._id === id);

const initialState = {
  data: [],
  loading: false,
  error: null,
};

const upsertAd = (data, ad) => {
  const exists = data.some((item) => item._id === ad._id);
  if (exists) {
    return data.map((item) => (item._id === ad._id ? ad : item));
  }
  return [ad, ...data];
};

const adsReducer = (statePart = initialState, action) => {
  switch (action.type) {
    case FETCH_START:
      return { ...statePart, loading: true, error: null };
    case FETCH_SUCCESS:
      return { ...statePart, loading: false, data: action.payload };
    case FETCH_ERROR:
      return { ...statePart, loading: false, error: action.payload };
    case SET_AD:
      return { ...statePart, loading: false, data: upsertAd(statePart.data, action.payload) };
    case ADD_SUCCESS:
      return { ...statePart, data: [action.payload, ...statePart.data] };
    case UPDATE_SUCCESS:
      return { ...statePart, data: upsertAd(statePart.data, action.payload) };
    case REMOVE_SUCCESS:
      return { ...statePart, data: statePart.data.filter((ad) => ad._id !== action.payload) };
    default:
      return statePart;
  }
};

export default adsReducer;