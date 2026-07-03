'use client';
import { useState, useEffect } from 'react';

export default function Page() {
  const [products, setProducts] = useState([
    { id: 1, name: '햇양파 1.5kg', price: 1500, image_url: '' },
    { id: 2, name: '국내산 정품 자숙 홍게 2kg', price: 11900, image_url: '' },
    { id: 3, name: '키리 크림치즈', price: 3200, image_url: '' }
  ]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [view, setView] = useState('list');

  return (
    <main style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h1>풍년 프리마켓</h1>
      <div style={{ display: 'grid', gap: '20px' }}>
        {products.map((p) => (
          <div key={p.id} style={{ border: '1px solid #eee', borderRadius: '12px', padding: '16px', backgroundColor: '#f9f9f9' }}>
            <h3>{p.name}</h3>
            <p style={{ color: '#d9025', fontWeight: 'bold' }}>{p.price}원</p>
            <button 
              onClick={() => { setSelectedProduct(p); setView('reserve'); alert(p.name + ' 예약창으로 이동!'); }}
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