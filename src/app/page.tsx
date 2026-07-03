'use client';
import { useState } from 'react';

export default function Page() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [view, setView] = useState('list');
  const products = [
    { id: 1, name: '햇양파 1.5kg', price: 1500, image_url: '' },
    { id: 2, name: '국내산 정품 자숙 홍게 2kg', price: 11900, image_url: '' },
    { id: 3, name: '키리 크림치즈', price: 3200, image_url: '' }
  ];

  return (
    <main style={{ padding: '20px' }}>
      <h1>풍년 프리마켓</h1>
      <div style={{ display: 'grid', gap: '20px' }}>
        {products.map((p) => (
          <div key={p.id} style={{ border: '1px solid #ddd', borderRadius: '12px', padding: '16px' }}>
            <h3>{p.name}</h3>
            <p style={{ fontWeight: 'bold', color: '#d9025' }}>{p.price}원</p>
            <button 
              onClick={() => { setSelectedProduct(p); setView('reserve'); }}
              style={{ width: '100%', backgroundColor: '#127333', color: '#fff', padding: '10px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
            >
              예약하기
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}