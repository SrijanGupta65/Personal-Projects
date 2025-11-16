import React from 'react';

export default function Section({ title, icon, items }) {
  return (
    <section>
      <h2 className="sec-head" style={{ color: '#205624' }}>
        {title}
        {icon && (
          <img
            src={icon}
            alt={`${title} icon`}
            style={{ marginLeft: '8px' }}
          />
        )}
      </h2>
      <div className="section">
        {items.map((item, idx) => (
          <figure 
            className="item" 
            key={idx} 
            onClick={item.onClick}
            style={{ 
              cursor: item.onClick ? 'pointer' : 'default',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              ...item.style
            }}
            onMouseEnter={(e) => {
              if (item.onClick) {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(32, 86, 36, 0.2)';
              }
            }}
            onMouseLeave={(e) => {
              if (item.onClick) {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
          >
            <img src={item.src} alt={item.alt} />
            <a href="#" 
              onClick={e => item.onClick && (e.preventDefault(), item.onClick())}
              style={{ 
                color: '#205624',
                textDecoration: 'none',
                position: 'relative'
              }}
            >
              <figcaption>{item.caption}</figcaption>
            </a>
          </figure>
        ))}
      </div>
    </section>
  );
}