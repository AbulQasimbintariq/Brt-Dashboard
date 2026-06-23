import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function AuthPanel() {
  const { user, loading, signIn, signUp, signOut, profile, upsertProfile } = useAuth();
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [favouriteStation, setFavouriteStation] = useState(profile?.favourite_station || '');
  const [dailyRoute, setDailyRoute] = useState(profile?.daily_route || '');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');

    if (mode === 'login') {
      const { error } = await signIn({ email, password });
      setMessage(error ? error.message : 'Logged in successfully');
    } else {
      const { error } = await signUp({ email, password });
      setMessage(error ? error.message : 'Check your email for confirmation');
    }
  };

  const handleSaveProfile = async () => {
    const { error } = await upsertProfile({ favourite_station: favouriteStation, daily_route: dailyRoute });
    setMessage(error ? error.message : 'Profile saved successfully');
  };

  if (loading) {
    return <div className="auth-panel">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="auth-panel">
        <div className="auth-header">{mode === 'login' ? 'Login' : 'Create account'}</div>
        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label>
            Password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          <button type="submit" className="auth-button">{mode === 'login' ? 'Login' : 'Sign up'}</button>
          <button type="button" className="auth-switch" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
            {mode === 'login' ? 'Create an account' : 'Already have an account? Login'}
          </button>
          {message && <div className="auth-message">{message}</div>}
        </form>
      </div>
    );
  }

  return (
    <div className="auth-panel">
      <div className="auth-header">Welcome back</div>
      <div className="auth-user">{user.email}</div>
      <div className="auth-form">
        <label>
          Favourite Station
          <input type="text" value={favouriteStation} onChange={(e) => setFavouriteStation(e.target.value)} placeholder="Surjani Terminal" />
        </label>
        <label>
          Daily Route
          <input type="text" value={dailyRoute} onChange={(e) => setDailyRoute(e.target.value)} placeholder="Surjani to Numaish" />
        </label>
        <button type="button" className="auth-button" onClick={handleSaveProfile}>Save Preferences</button>
        <button type="button" className="auth-logout" onClick={signOut}>Logout</button>
        {message && <div className="auth-message">{message}</div>}
        {profile && (
          <div className="auth-summary">
            <div>Favourite Station: {profile.favourite_station || 'N/A'}</div>
            <div>Daily Route: {profile.daily_route || 'N/A'}</div>
          </div>
        )}
      </div>
    </div>
  );
}
