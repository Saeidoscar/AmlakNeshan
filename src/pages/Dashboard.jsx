import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { properties, userContracts, formatPrice, getTypeLabel, getTypeBadgeClass, getStatusLabel } from '../data/database';
import './Dashboard.css';

function Dashboard({ user, onLogout }) {
  const navigate = useNavigate();
  const featuredProperties = properties.filter(p => p.featured);
  const recentProperties = properties.slice(0, 6);

  return (
    <div className="dashboard">
      <header className="header">
        <div className="header-right">
          <h1>🏠 املاک نشان</h1>
        </div>
        <nav className="header-nav">
          <Link to="/dashboard" className="active">داشبورد</Link>
          <Link to="/map">نقشه مشهد</Link>
          <span className="user-info">👤 {user?.name}</span>
          <button onClick={onLogout} className="btn btn-secondary btn-sm">خروج</button>
        </nav>
      </header>

      <div className="dashboard-content">
        {/* Welcome Section */}
        <section className="welcome-section">
          <div className="welcome-text">
            <h2>خوش آمدید، {user?.name} 👋</h2>
            <p>به سامانه هوشمند املاک نشان مشهد خوش آمدید. از اینجا می‌توانید املاک فعال، قراردادهای خود و نقشه مشهد را مدیریت کنید.</p>
          </div>
          <button onClick={() => navigate('/map')} className="btn btn-primary">
            🗺️ مشاهده نقشه مشهد
          </button>
        </section>

        {/* Stats Cards */}
        <section className="stats-section">
          <div className="stat-card stat-blue">
            <div className="stat-icon">🏢</div>
            <div className="stat-info">
              <span className="stat-value">{properties.length}</span>
              <span className="stat-title">ملک فعال</span>
            </div>
          </div>
          <div className="stat-card stat-green">
            <div className="stat-icon">📋</div>
            <div className="stat-info">
              <span className="stat-value">{userContracts.length}</span>
              <span className="stat-title">قرارداد فعال</span>
            </div>
          </div>
          <div className="stat-card stat-orange">
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <span className="stat-value">۱۲</span>
              <span className="stat-title">پیشنهاد جدید</span>
            </div>
          </div>
          <div className="stat-card stat-purple">
            <div className="stat-icon">👁️</div>
            <div className="stat-info">
              <span className="stat-value">۳۴۵</span>
              <span className="stat-title">بازدید امروز</span>
            </div>
          </div>
        </section>

        {/* Active Contracts */}
        <section className="contracts-section">
          <h3>📋 قراردادهای فعال</h3>
          <div className="contracts-list">
            {userContracts.map(contract => (
              <div key={contract.id} className={`contract-card ${contract.status}`}>
                <div className="contract-header">
                  <span className={`contract-status ${contract.status}`}>
                    {getStatusLabel(contract.status)}
                  </span>
                  <span className="contract-type">{contract.type === 'rent' ? '🏠 اجاره' : '🏷️ فروش'}</span>
                </div>
                <h4>{contract.propertyName}</h4>
                <p className="contract-address">📍 {contract.address}</p>
                <div className="contract-details">
                  {contract.type === 'rent' ? (
                    <>
                      <span>اجاره ماهیانه: {formatPrice(contract.monthlyRent)}</span>
                      <span>ودیعه: {formatPrice(contract.deposit)}</span>
                      <span>مدت: {contract.startDate} تا {contract.endDate}</span>
                    </>
                  ) : (
                    <>
                      <span>مبلغ: {formatPrice(contract.agreedPrice)}</span>
                      <span>تاریخ عقد: {contract.signedDate}</span>
                      <span>تاریخ تحویل: {contract.closingDate}</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Properties */}
        <section className="featured-section">
          <h3>⭐ املاک ویژه</h3>
          <div className="grid">
            {featuredProperties.map(property => (
              <div key={property.id} className="card" onClick={() => navigate(`/property/${property.id}`)}>
                <div className="card-image-container">
                  <img 
                    src={property.images[0]} 
                    alt={property.title}
                    className="card-image"
                    onError={(e) => { e.target.src = `https://picsum.photos/seed/${property.id}/400/250`; }}
                  />
                  <span className={`badge ${getTypeBadgeClass(property.type)}`}>
                    {getTypeLabel(property.type)}
                  </span>
                  {property.featured && <span className="featured-badge">⭐ ویژه</span>}
                </div>
                <div className="card-content">
                  <h4 className="card-title">{property.title}</h4>
                  <p className="card-price">
                    {property.price ? formatPrice(property.price) : `${formatPrice(property.rentMonthly)} / ماه`}
                  </p>
                  <p className="card-address">📍 {property.district}، {property.address.split('،')[0]}</p>
                  <div className="card-details">
                    <span className="card-detail">📐 {property.area} متر</span>
                    {property.rooms > 0 && <span className="card-detail">🛏️ {property.rooms} خواب</span>}
                    {property.bathrooms > 0 && <span className="card-detail">🚿 {property.bathrooms} حمام</span>}
                  </div>
                  <div className="card-meta">
                    <span>👁️ {property.views}</span>
                    <span>❤️ {property.favorites}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Properties */}
        <section className="recent-section">
          <div className="section-header">
            <h3>🏘️ آخرین املاک</h3>
            <button onClick={() => navigate('/map')} className="btn btn-secondary btn-sm">مشاهده همه در نقشه</button>
          </div>
          <div className="grid">
            {recentProperties.map(property => (
              <div key={property.id} className="card" onClick={() => navigate(`/property/${property.id}`)}>
                <div className="card-image-container">
                  <img 
                    src={property.images[0]} 
                    alt={property.title}
                    className="card-image"
                    onError={(e) => { e.target.src = `https://picsum.photos/seed/${property.id}/400/250`; }}
                  />
                  <span className={`badge ${getTypeBadgeClass(property.type)}`}>
                    {getTypeLabel(property.type)}
                  </span>
                </div>
                <div className="card-content">
                  <h4 className="card-title">{property.title}</h4>
                  <p className="card-price">
                    {property.price ? formatPrice(property.price) : `${formatPrice(property.rentMonthly)} / ماه`}
                  </p>
                  <div className="card-details">
                    <span className="card-detail">📐 {property.area} متر</span>
                    {property.rooms > 0 && <span className="card-detail">🛏️ {property.rooms} خواب</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
