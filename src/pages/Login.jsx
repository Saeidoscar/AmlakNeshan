import React, { useState } from 'react';
import './Login.css';

function Login({ onLogin }) {
  const [phone, setPhone] = useState('09151234567');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate login
    setTimeout(() => {
      if (phone && password) {
        onLogin({
          id: 'u1',
          name: 'محمد رضایی',
          phone: phone,
          role: 'مشاور املاک',
          avatar: '/images/agent1.jpg',
          company: 'آژانس املاک نشان',
        });
      } else {
        setError('لطفاً شماره موبایل و رمز عبور را وارد کنید');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="login-page">
      <div className="login-bg">
        <div className="login-overlay"></div>
      </div>
      <div className="login-container">
        <div className="login-card">
          <div className="login-logo">
            <div className="logo-icon">🏠</div>
            <h1>املاک نشان</h1>
            <p>سامانه هوشمند املاک مشهد</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="phone">شماره موبایل</label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="09xxxxxxxxx"
                dir="ltr"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">رمز عبور</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="رمز عبور"
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
              {loading ? 'در حال ورود...' : 'ورود به حساب'}
            </button>

            <div className="login-footer">
              <a href="#">فراموشی رمز عبور</a>
              <span>|</span>
              <a href="#">ثبت‌نام مشاور جدید</a>
            </div>
          </form>

          <div className="demo-notice">
            <p>🔑 برای ورود دمو، فقط دکمه ورود را بزنید</p>
          </div>
        </div>

        <div className="login-stats">
          <div className="stat-item">
            <span className="stat-number">۱۲۰۰+</span>
            <span className="stat-label">ملک فعال</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">۳۵۰+</span>
            <span className="stat-label">مشاور</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">۵۰۰۰+</span>
            <span className="stat-label">معامله موفق</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
