import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, signup } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');

        // Validation for institutional account
        if (!email.endsWith('@stud.ase.ro')) {
            return setError('Access restricted to @stud.ase.ro accounts only.');
        }

        if (password.length < 6) {
            return setError('Password must be at least 6 characters.');
        }

        try {
            setLoading(true);
            if (isLogin) {
                await login(email, password);
            } else {
                await signup(email, password);
            }
            navigate('/');
        } catch (err) {
            console.error(err);
            let msg = 'Failed to ' + (isLogin ? 'log in' : 'create account');
            if (err.code === 'auth/invalid-credential') msg = 'Invalid email or password.';
            if (err.code === 'auth/email-already-in-use') msg = 'Email already in use.';
            setError(msg);
        }
        setLoading(false);
    }

    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="login-title">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                <p className="login-subtitle">Course Notes Platform</p>

                {error && <div className="alert-error">{error}</div>}

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="email">Institutional Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="student@stud.ase.ro"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button disabled={loading} type="submit" className="btn-primary">
                        {isLogin ? 'Log In' : 'Sign Up'}
                    </button>
                </form>

                <div className="login-footer">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button
                        type="button"
                        className="btn-link"
                        onClick={() => setIsLogin(!isLogin)}
                    >
                        {isLogin ? 'Sign Up' : 'Log In'}
                    </button>
                </div>
            </div>
        </div>
    );
}
