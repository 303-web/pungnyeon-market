'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://zyilyfciytbzmdqptuhu.supabase.co',
  'sb_publishable_tEqngQD6BxzQfKdT4TgtQQ_qK-kZKtD'
);

export default function Page() {
  const [products, setProducts] = useState<any[]>([]);
  const [view, setView] = useState<'market' | 'inquiry' | 'result' | 'reserve'>('market');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [phone, setPhone] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [reserving, setReserving] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      const { data } = await supabase.from('products').select('*').order('id');
      if (data) setProducts(data);
    }
    fetchProducts();
  }, []);

  async function handleReserve() {
    if (!phone) { alert('전화번호를 입력해주세요!'); return; }
    setReserving(true);
    const { error } = await supabase.from('orders').insert([
      { product_name: selectedProduct.name, phone, quantity, status: '예약중' }
    ]);
    
    if (error) alert('예약 실패: ' + error.message);
    else { alert('예약 완료!'); setView('market'); }
    
    setReserving(false);
  }

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', padding: '16px', backgroundColor: '#f4f5f7', minHeight: '100vh' }}>
      
      {/* 1. 마켓 메인 화면 */}
      {view === 'market' && (
        <>
          <h1 style={{ textAlign: 'center', color: '#ff4d4d', fontWeight: 'bold', fontSize: '20px' }}>풍년 프리마켓</h1>
          <main style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {products.map((p) => (
              <div key={p.id} style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 'bold' }}>{p.name}</div>
                  <div style={{ color: '#ff3b30' }}>{p.price.toLocaleString()}원</div>
                </div>
                <button 
                  onClick={() => { setSelectedProduct(p); setView('reserve'); }}
                  style={{ backgroundColor: '#137333', color: '#fff', padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
                >
                  예약하기
                </button>
              </div>
            ))}
          </main>
        </>
      )}

      {/* 2. 예약 입력 화면 */}
      {view === 'reserve' && (
        <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '16px' }}>
          <h2 style={{ fontSize: '18px' }}>{selectedProduct.name} 예약</h2>
          <input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} placeholder="수량" style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="전화번호 (01012345678)" style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setView('market')} style={{ flex: 1, padding: '10px' }}>취소</button>
            <button onClick={handleReserve} disabled={reserving} style={{ flex: 2, padding: '10px', backgroundColor: '#137333', color: '#fff', border: 'none' }}>
              {reserving ? '예약 중...' : '확정하기'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}