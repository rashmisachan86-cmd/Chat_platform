import { useState } from 'react';
import api from '../lib/api.js';
import { useNavigate } from 'react-router-dom';

export function useAuth() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const login = async (username: string, password: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const { data } = await api.post('/auth/login', { username, password });
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));
            navigate('/home');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    const signup = async (username: string, _email: string | undefined, password: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const { data } = await api.post('/auth/signup', { username, password });
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));
            navigate('/home');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Signup failed');
        } finally {
            setIsLoading(false);
        }
    };

    const updateProfile = async (profileData: any) => {
        setIsLoading(true);
        setError(null);
        try {
            const { data } = await api.put('/auth/profile', profileData);
            localStorage.setItem('user', JSON.stringify(data));
            return data;
        } catch (err: any) {
            setError(err.response?.data?.message || 'Update failed');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    return { login, signup, updateProfile, isLoading, error, user };
}

