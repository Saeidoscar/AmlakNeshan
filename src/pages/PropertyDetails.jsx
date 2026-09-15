import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { properties, formatPrice, getTypeLabel, getTypeBadgeClass, getBidStatusLabel } from '../data/database';
import './PropertyDetails.css';

function PropertyDetails({ user, onLogout }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const property = properties.find(p => p.id === id);
  const [activeImage, setActiveImage] = useState(0);
  const [showBidForm, setShowBidForm] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [bidSubmitted, setBidSubmitted] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showContact, setShowContact] = useState(false);

  if (!property) {
    return (
      <div className="not-found">
        <h2>ملک مورد نظر یافت نشد</h2>
        <button onClick={() => navigate('/map')} className="btn btn-primary">بازگشت به نقشه</button>
      </div>
    );
  }

  const handleBid = (e) => {
    e.preventDefault();
    setBidSubmitted(true);
    setTimeout(() => {
      setShowBidForm(false);
      setBidSubmitted(false);
      setBidAmount('');
    }, 2000);
  };

  const similarProperties = properties
    .filter(p => p.id !== property.id && p.district === property.district)
    .slice(0, 3);

  return (
    <div className="property-page">
      <header className="header">
        <div className="header-right">
          <h1>🏠 املاک نشان</h1>
        </div>
        <nav className="header-nav">
          <Link to="/dashboard">داشبورد</Link>
          <Link to="/map">نقشه مشهد</Link>
          <span className="user-info">👤 {user?.name}</span>
          <button onClick={onLogout} className="btn btn-secondary btn-sm">خروج</button>
        </nav>
      </header>

      <div className="property-content">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/dashboard">داشبورد</Link>
          <span>/</span>
          <Link to="/map">نقشه</Link>
          <span>/</span>
          <span>{property.district}</span>
        </div>

        {/* Image Gallery */}
        <div className="image-gallery">
          <div className="main-image">
            <img 
              src={property.images[activeImage]} 
              alt={property.title}
              onError={(e) => { e.target.src = `https://picsum.photos/seed/${property.id}/${activeImage}/800/500`; }}
            />
            <div className="image-badges">
              <span className={`badge ${getTypeBadgeClass(property.type)}`}>
                {getTypeLabel(property.type)}
              </span>
              {property.featured && <span className="featured-badge">⭐ ویژه</span>}
            </div>
            <button 
              className={`favorite-btn ${isFavorite ? 'active' : ''}`}
              onClick={() => setIsFavorite(!isFavorite)}
            >
              {isFavorite ? '❤️' : '🤍'}
            </button>
          </div>
          <div className="thumbnail-strip">
            {property.images.map((img, i) => (
              <img 
                key={i}
                src={img}
                alt={`تصویر ${i + 1}`}
                className={`thumbnail ${activeImage === i ? 'active' : ''}`}
                onClick={() => setActiveImage(i)}
                onError={(e) => { e.target.src = `https://picsum.photos/seed/${property.id}/${i}/120/90`; }}
              />
            ))}
          </div>
        </div>

        <div className="property-grid">
          {/* Main Info */}
          <div className="property-main">
            <div className="property-header">
              <h2>{property.title}</h2>
              <p className="property-address">📍 {property.address}</p>
            </div>

            <div className="price-section">
              {property.price && (
                <div className="price-item">
                  <span className="price-label">قیمت فروش</span>
                  <span className="price-value">{formatPrice(property.price)}</span>
                  <span className="price-per-meter">متری {formatPrice(Math.round(property.price / property.area))}</span>
                </div>
              )}
              {property.rentMonthly && (
                <div className="price-item">
                  <span className="price-label">اجاره ماهیانه</span>
                  <span className="price-value">{formatPrice(property.rentMonthly)}</span>
                  <span className="price-per-meter">ودیعه: {formatPrice(property.rentDeposit)}</span>
                </div>
              )}
            </div>

            {/* Key Details */}
            <div className="key-details">
              <div className="detail-box">
                <span className="detail-icon">📐</span>
                <span className="detail-value">{property.area}</span>
                <span className="detail-label">متر مربع</span>
              </div>
              {property.rooms > 0 && (
                <div className="detail-box">
                  <span className="detail-icon">🛏️</span>
                  <span className="detail-value">{property.rooms}</span>
                  <span className="detail-label">اتاق خواب</span>
                </div>
              )}
              {property.bathrooms > 0 && (
                <div className="detail-box">
                  <span className="detail-icon">🚿</span>
                  <span className="detail-value">{property.bathrooms}</span>
                  <span className="detail-label">حمام</span>
                </div>
              )}
              {property.floor > 0 && (
                <div className="detail-box">
                  <span className="detail-icon">🏢</span>
                  <span className="detail-value">{property.floor}/{property.totalFloors}</span>
                  <span className="detail-label">طبقه</span>
                </div>
              )}
              <div className="detail-box">
                <span className="detail-icon">🅿️</span>
                <span className="detail-value">{property.parking}</span>
                <span className="detail-label">پارکینگ</span>
              </div>
              <div className="detail-box">
                <span className="detail-icon">📅</span>
                <span className="detail-value">{property.yearBuilt || '-'}</span>
                <span className="detail-label">سال ساخت</span>
              </div>
            </div>

            {/* Description */}
            <div className="section">
              <h3>توضیحات</h3>
              <p className="description">{property.description}</p>
            </div>

            {/* Features */}
            <div className="section">
              <h3>امکانات و ویژگی‌ها</h3>
              <div className="features-grid">
                {property.features.map((feature, i) => (
                  <div key={i} className="feature-item">
                    ✅ {feature}
                  </div>
                ))}
                {property.elevator && <div className="feature-item">✅ آسانسور</div>}
                {property.storage && <div className="feature-item">✅ انباری</div>}
                {property.parking > 0 && <div className="feature-item">✅ پارکینگ ({property.parking} عدد)</div>}
              </div>
            </div>

            {/* Bids Section */}
            <div className="section">
              <div className="section-header-inline">
                <h3>💰 پیشنهادها ({property.bids.length})</h3>
                {(property.type === 'sale' || property.type === 'both') && (
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => setShowBidForm(!showBidForm)}
                  >
                    ارسال پیشنهاد
                  </button>
                )}
              </div>

              {showBidForm && (
                <form className="bid-form" onSubmit={handleBid}>
                  {bidSubmitted ? (
                    <div className="bid-success">✅ پیشنهاد شما با موفقیت ثبت شد!</div>
                  ) : (
                    <>
                      <div className="form-row">
                        <label>مبلغ پیشنهادی (تومان):</label>
                        <input
                          type="text"
                          value={bidAmount}
                          onChange={(e) => setBidAmount(e.target.value)}
                          placeholder="مبلغ را وارد کنید"
                          required
                          dir="ltr"
                        />
                        {bidAmount && (
                          <span className="bid-hint">{formatPrice(parseInt(bidAmount) || 0)}</span>
                        )}
                      </div>
                      <button type="submit" className="btn btn-primary">ثبت پیشنهاد</button>
                    </>
                  )}
                </form>
              )}

              <div className="bids-list">
                {property.bids.length === 0 ? (
                  <p className="no-bids">هنوز پیشنهادی ثبت نشده است. اولین نفر باشید!</p>
                ) : (
                  property.bids.map(bid => (
                    <div key={bid.id} className={`bid-item ${bid.status}`}>
                      <div className="bid-info">
                        <span className="bid-amount">{formatPrice(bid.amount)}</span>
                        <span className="bid-bidder">توسط: {bid.bidder}</span>
                        <span className="bid-date">📅 {bid.date}</span>
                      </div>
                      <span className={`bid-status ${bid.status}`}>
                        {getBidStatusLabel(bid.status)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Map Location */}
            <div className="section">
              <h3>📍 موقعیت روی نقشه</h3>
              <div className="mini-map">
                <img 
                  src={`https://maps.googleapis.com/maps/api/staticmap?center=${property.lat},${property.lng}&zoom=15&size=600x300&markers=color:red%7C${property.lat},${property.lng}&key=placeholder`}
                  alt="موقعیت ملک"
                  onError={(e) => { 
                    e.target.src = `https://www.openstreetmap.org/export/embed.html?bbox=${property.lng-0.01}%2C${property.lat-0.01}%2C${property.lng+0.01}%2C${property.lat+0.01}&layer=mapnik&marker=${property.lat}%2C${property.lng}`;
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="map-placeholder" style={{display: 'none'}}>
                  <span>📍</span>
                  <p>{property.address}</p>
                  <p>منطقه: {property.district}</p>
                  <p>مختصات: {property.lat}, {property.lng}</p>
                  <button onClick={() => navigate('/map')} className="btn btn-primary btn-sm" style={{marginTop: 12}}>
                    مشاهده در نقشه بزرگ
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="property-sidebar">
            {/* Agent Card */}
            <div className="agent-card">
              <img 
                src={property.agent.photo} 
                alt={property.agent.name}
                onError={(e) => { e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="40" r="20" fill="%230078d4"/><circle cx="50" cy="100" r="40" fill="%230078d4"/></svg>'; }}
              />
              <h4>{property.agent.name}</h4>
              <p>مشاور املاک</p>
              <button 
                className="btn btn-primary" 
                style={{width: '100%', marginTop: 12}}
                onClick={() => setShowContact(!showContact)}
              >
                {showContact ? property.agent.phone : '📞 تماس'}
              </button>
              <button className="btn btn-secondary" style={{width: '100%', marginTop: 8}}>
                💬 ارسال پیام
              </button>
            </div>

            {/* Quick Info */}
            <div className="quick-info-card">
              <h4>اطلاعات سریع</h4>
              <ul>
                <li><span>نوع:</span> <strong>{getTypeLabel(property.type)}</strong></li>
                <li><span>منطقه:</span> <strong>{property.district}</strong></li>
                <li><span>متراژ:</span> <strong>{property.area} متر</strong></li>
                <li><span>بازدید:</span> <strong>{property.views} بار</strong></li>
                <li><span>علاقه‌مندی:</span> <strong>{property.favorites} نفر</strong></li>
                <li><span>تاریخ آگهی:</span> <strong>{property.listed}</strong></li>
              </ul>
            </div>

            {/* Mortgage Calculator */}
            {property.price && (
              <div className="mortgage-card">
                <h4>💳 محاسبه اقساط</h4>
                <div className="mortgage-info">
                  <p>پیش‌پرداخت ۳۰٪:</p>
                  <strong>{formatPrice(Math.round(property.price * 0.3))}</strong>
                  <p style={{marginTop: 12}}>قسط ماهیانه (۵ ساله):</p>
                  <strong>{formatPrice(Math.round((property.price * 0.7) / 60))}</strong>
                  <p className="mortgage-note">* محاسبه تقریبی بدون سود</p>
                </div>
              </div>
            )}

            {/* Share */}
            <div className="share-card">
              <h4>اشتراک‌گذاری</h4>
              <div className="share-buttons">
                <button className="share-btn telegram">📱 تلگرام</button>
                <button className="share-btn whatsapp">💬 واتساپ</button>
                <button className="share-btn copy">📋 کپی لینک</button>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Properties */}
        {similarProperties.length > 0 && (
          <div className="similar-section">
            <h3>🏘️ املاک مشابه در {property.district}</h3>
            <div className="grid">
              {similarProperties.map(p => (
                <div key={p.id} className="card" onClick={() => navigate(`/property/${p.id}`)}>
                  <div className="card-image-container">
                    <img 
                      src={p.images[0]} 
                      alt={p.title}
                      className="card-image"
                      onError={(e) => { e.target.src = `https://picsum.photos/seed/${p.id}/400/250`; }}
                    />
                    <span className={`badge ${getTypeBadgeClass(p.type)}`}>
                      {getTypeLabel(p.type)}
                    </span>
                  </div>
                  <div className="card-content">
                    <h4 className="card-title">{p.title}</h4>
                    <p className="card-price">
                      {p.price ? formatPrice(p.price) : `${formatPrice(p.rentMonthly)} / ماه`}
                    </p>
                    <div className="card-details">
                      <span className="card-detail">📐 {p.area} متر</span>
                      {p.rooms > 0 && <span className="card-detail">🛏️ {p.rooms} خواب</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PropertyDetails;
