import { useState, useCallback } from 'react';
import api from '../utils/api';

/**
 * Custom hook for making API requests using axios.
 * Standardizes loading, error, and data states.
 */
const useApi = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const request = useCallback(async (method, url, config = {}) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api({
                method,
                url,
                ...config
            });
            setData(response.data);
            return response.data;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const get = useCallback((url, config) => request('get', url, config), [request]);
    const post = useCallback((url, data, config) => request('post', url, { data, ...config }), [request]);
    const put = useCallback((url, data, config) => request('put', url, { data, ...config }), [request]);
    const del = useCallback((url, config) => request('delete', url, config), [request]);

    return { data, loading, error, get, post, put, del, request };
};

export default useApi;
