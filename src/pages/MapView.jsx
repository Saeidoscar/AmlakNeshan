import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { properties, districts, formatPrice, getTypeLabel, getTypeBadgeClass } from '../data/database';
import './MapView.css';

function MapController({ selectedDistrict }) {
  const map = useMap();
  useEffect(() => {
    if (selectedDistrict) {
      map.flyTo([selectedDistrict.lat, selectedDistrict.lng], 14, { duration: 1 });
    }
  }, [selectedDistrict, map]);
  return null;
}

function getColor(type) {
  switch (type) {
    case 'sale': return '#e53935'; // Red for sale
    case 'rent': return '#7b1fa2'; // Purple for rent
    case 'both': return '#2e7d32'; // Green for both
    default: return '#666';
  }
}

function MapView({ user, onLogout }) {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all'); // all, sale, rent, both
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showList, setShowList] = useState(false);

  // Mashhad center coordinates
  const mashhadCenter = [36.2970, 59.6065];

  const filteredProperties = properties.filter(p => {
    if (filter !== 'all' && p.type !== filter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return p.title.includes(q) || p.address.includes(q) || p.district.includes(q);
    }
    return true;
  });

  const getRadius = (property) => {
    if (property.area >= 300) return 18;
    if (property.area >= 150) return 14;
    if (property.area >= 80) return 11;
    return 8;
  };

  return (
    <div className="map-view">
      <header className="header">
        <div className="header-right">
          <h1>🏠 املاک نشان</h1>
        </div>
        <nav className="header-nav">
          <Link to="/dashboard">داشبورد</Link>
          <Link to="/map" className="active">نقشه مشهد</Link>
          <span className="user-info">👤 {user?.name}</span>
          <button onClick={onLogout} className="btn btn-secondary btn-sm">خروج</button>
        </nav>
      </header>

      <div className="map-toolbar">
        <div className="toolbar-search">
          <input
            type="text"
            placeholder="🔍 جستجوی ملک، محله یا آدرس..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="toolbar-filters">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            همه ({properties.length})
          </button>
          <button 
            className={`filter-btn sale ${filter === 'sale' ? 'active' : ''}`}
            onClick={() => setFilter('sale')}
          >
            🔴 فروش ({properties.filter(p => p.type === 'sale').length})
          </button>
          <button 
            className={`filter-btn rent ${filter === 'rent' ? 'active' : ''}`}
            onClick={() => setFilter('rent')}
          >
            🟣 اجاره ({properties.filter(p => p.type === 'rent').length})
          </button>
          <button 
            className={`filter-btn both ${filter === 'both' ? 'active' : ''}`}
            onClick={() => setFilter('both')}
          >
            🟢 فروش و اجاره ({properties.filter(p => p.type === 'both').length})
          </button>
          <button 
            className={`toggle-list-btn ${showList ? 'active' : ''}`}
            onClick={() => setShowList(!showList)}
          >
            {showList ? '🗺️ نقشه' : '📋 لیست'}
          </button>
        </div>
      </div>

      <div className="map-layout">
        {/* Districts Sidebar */}
        <div className="districts-sidebar">
          <h4>محله‌های مشهد</h4>
          <ul>
            {districts.map(d => {
              const count = properties.filter(p => p.district === d.name).length;
              return (
                <li key={d.name} 
                    className={selectedDistrict?.name === d.name ? 'active' : ''}
                    onClick={() => setSelectedDistrict(d)}>
                  <span className="district-name">{d.name}</span>
                  <span className="district-count">{count} ملک</span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Map */}
        <div className={`map-container ${showList ? 'hidden' : ''}`}>
          <MapContainer 
            center={mashhadCenter} 
            zoom={12} 
            style={{ height: '100%', width: '100%' }}
            zoomControl={true}
          >
            <TileLayer
              attribution='&copy; OpenStreetMap'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapController selectedDistrict={selectedDistrict} />
            
            {filteredProperties.map(property => (
              <CircleMarker
                key={property.id}
                center={[property.lat, property.lng]}
                radius={getRadius(property)}
                pathOptions={{
                  color: getColor(property.type),
                  fillColor: getColor(property.type),
                  fillOpacity: 0.7,
                  weight: 2,
                }}
                eventHandlers={{
                  click: () => navigate(`/property/${property.id}`)
                }}
              >
                <Tooltip direction="top" offset={[0, -10]}>
                  <div className="marker-tooltip">
                    <strong>{property.title}</strong>
                    <br />
                    <span className={`badge ${getTypeBadgeClass(property.type)}`}>
                      {getTypeLabel(property.type)}
                    </span>
                    <br />
                    {property.price ? formatPrice(property.price) : `${formatPrice(property.rentMonthly)} / ماه`}
                  </div>
                </Tooltip>
                <Popup>
                  <div className="map-popup">
                    <img 
                      src={property.images[0]} 
                      alt={property.title}
                      onError={(e) => { e.target.src = `https://picsum.photos/seed/${property.id}/300/180`; }}
                    />
                    <h4>{property.title}</h4>
                    <span className={`badge ${getTypeBadgeClass(property.type)}`}>
                      {getTypeLabel(property.type)}
                    </span>
                    <p className="popup-price">
                      {property.price ? formatPrice(property.price) : `${formatPrice(property.rentMonthly)} / ماه`}
                    </p>
                    <p className="popup-details">
                      📐 {property.area} متر | 🛏️ {property.rooms} خواب | 📍 {property.district}
                    </p>
                    <button onClick={() => navigate(`/property/${property.id}`)} className="btn btn-primary btn-sm">
                      مشاهده جزئیات
                    </button>
                  </div>
                </Popup>
              </CircleMarker>
            ))}

            {/* District Labels */}
            {districts.map(d => (
              <CircleMarker
                key={`district-${d.name}`}
                center={[d.lat, d.lng]}
                radius={25}
                pathOptions={{
                  color: '#0078d4',
                  fillColor: '#0078d4',
                  fillOpacity: 0.05,
                  weight: 1,
                  dashArray: '5, 5',
                }}
              >
                <Tooltip permanent direction="center" className="district-label">
                  {d.name}
                </Tooltip>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>

        {/* List View */}
        {showList && (
          <div className="list-view">
            {filteredProperties.map(property => (
              <div key={property.id} className="list-item" onClick={() => navigate(`/property/${property.id}`)}>
                <img 
                  src={property.images[0]} 
                  alt={property.title}
                  onError={(e) => { e.target.src = `https://picsum.photos/seed/${property.id}/120/90`; }}
                />
                <div className="list-item-info">
                  <h4>{property.title}</h4>
                  <span className={`badge ${getTypeBadgeClass(property.type)}`}>
                    {getTypeLabel(property.type)}
                  </span>
                  <p className="list-price">
                    {property.price ? formatPrice(property.price) : `${formatPrice(property.rentMonthly)} / ماه`}
                  </p>
                  <p className="list-details">📐 {property.area} متر | 🛏️ {property.rooms} خواب</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="map-legend">
        <span className="legend-item"><span className="legend-dot sale"></span> فروش</span>
        <span className="legend-item"><span className="legend-dot rent"></span> اجاره</span>
        <span className="legend-item"><span className="legend-dot both"></span> فروش و اجاره</span>
        <span className="legend-item">اندازه دایره = متراژ ملک</span>
      </div>
    </div>
  );
}

export default MapView;
