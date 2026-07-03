'use client';
import { useState } from 'react';

export default function Page() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [view, setView] = useState('list');
  const products = []; // 사장님의 상품 데이터가 여기에 있어야 합니다.

  return (
    <main style={{ padding: '20px' }}>
      <h1>풍년 프리마켓</h1>
      <div style={{ display: 'grid', gap: '20px' }}>
        {products.map((p) => (
          <div key={p.id} style={{ border: '1px solid #ddd', borderRadius: '12px', padding: '16px' }}>
            <img 
              src={p.image_url || 'https://via.placeholder.com/100'} 
              alt={p.name} 
              style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }} 
            />
            <h3>{p.name}</h3>
            <p style={{ color: '#d9025', fontWeight: 'bold' }}>{p.price}원</p>
            <button 
              onClick={() => { setSelectedProduct(p); setView('reserve'); }}
              style={{ width: '100%', backgroundColor: '#127333', color: '#fff', padding: '10px', borderRadius: '8px', border: 'none' }}
            >
              예약하기
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}