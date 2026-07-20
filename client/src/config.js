export const API_URL = process.env.NODE_ENV === 'production'
    ? '/'
    : 'http://localhost:3000/';
    
export const IMGS_URL = (process.env.NODE_ENV === 'production') ? '/uploads/' : 'http://localhost:8000/uploads/';