 'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://zyilyfciytbzmdqptuhu.supabase.co',
  'sb_publishable_tEqngQD6BxzQfKdT4TgtQQ_qK-kZKtD'
);

export default function Page() {
  const [products, setProducts] = useState<any[]>([]);
  const [view, setView] = useState<'market' | 'reserve' | 'admin'>('market');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  
  // 예약용 상태
  const [phone, setPhone] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [reserving, setReserving] = useState(false);

  // 관리자용 상태 (예약 목록)
  const [allOrders, setAllOrders] = useState<any[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const { data } = await supabase.from('products').select('*').order('id');
    if (data) setProducts(data);
  }

  async function fetchAllOrders() {
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (data) setAllOrders(data);
  }

  // 예약 처리
  async function handleReserve() {
    if (!phone || phone.length < 10) { alert('정확한 전화번호를 입력해주세요!'); return; }
    setReserving(true);
    
    const { error } = await supabase.from('orders').insert([
      { 
        product_name: selectedProduct.name, 
        phone, 
        quantity, 
        status: '예약중' 
      }
    ]);
    
    if (error) alert('예약 실패: ' + error.message);
    else { 
      alert('🎉 예약이 완료되었습니다!'); 
      setView('market'); 
      setPhone('');
      setQuantity(1);
    }
    setReserving(false);
  }

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', padding: '16px', backgroundColor: '#f4f5f7', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* --- [1] 메인 마켓 화면 --- */}
      {view === 'market' && (
        <>
          <header style={{ textAlign: 'center', marginBottom: '24px', padding: '20px 0' }}>
            <h1 style={{ color: '#137333', fontSize: '24px', fontWeight: 'bold' }}>풍년 프리마켓</h1>
            <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>매일 신선한 상품을 예약해보세요!</div>
          </header>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {products.map((p) => (
              <div key={p.id} style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '18px', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  {/* 사진 영역 */}
                  <div style={{ width: '100px', height: '100px', backgroundColor: '#f0f0f0', borderRadius: '12px', overflow: 'hidden' }}>
                    <img src={p.image_url || 'https://via.placeholder.com/100'} alt={p.name} style={{ width: '100%', height: '100%', objectFit 'cover' }} />
                  </div>
                  
                  {/* 정보 영역 */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '6px' }}>
                      <span style={{ fontSize: '10px', backgroundColor: '#e6f4ea', color: '#137333', padding: '2px 6px', borderRadius: '4px' }}>🚚 입고: {p.arrival_date || '미정'}</span>
                      <span style={{ fontSize: '10px', backgroundColor: '#fff0f0', color: '#d93025', padding: '2px 6px', borderRadius: '4px' }}>⏰ 마감: {p.deadline_date || '조기마감'}</span>
                    </div>
                    <div style={{ fontWeight: 'bold', fontSize: '17px', color: '#1a1a1a' }}>{p.name}</div>
                    <div style={{ color: '#d93025', fontWeight: 'bold', fontSize: '18px', marginTop: '6px' }}>{p.price?.toLocaleString()}원</div>
                  </div>
                </div>
                
                <button 
                  onClick={() => { setSelectedProduct(p); setView('reserve'); }}
                  style={{ width: '100%', backgroundColor: '#137333', color: '#fff', border: 'none', padding: '12px', borderRadius: '12px', marginTop: '14px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  예약하기
                </button>
              </div>
            ))}
          </div>

          <button onClick={() => { setView('admin'); fetchAllOrders(); }} style={{ width: '100%', marginTop: '40px', padding: '10px', color: '#999', backgroundColor: 'transparent', border: '1px dashed #ccc', borderRadius: '8px', fontSize: '12px' }}>
            관리자 모드로 들어가기
          </button>
        </>
      )}

      {/* --- [2] 수량 선택 및 예약 화면 --- */}
      {view === 'reserve' && (
        <div style={{ backgroundColor: '#fff', padding: '28px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', marginTop: '20px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>예약 신청</h2>
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '24px' }}>{selectedProduct?.name}</div>

          {/* 수량 조절 섹션 (- 0 +) */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '14px', color: '#333', display: 'block', marginBottom: '10px' }}>수량 선택</label>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', backgroundColor: '#f8fafc', padding: '10px', borderRadius: '12px' }}>
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #ddd', backgroundColor: '#fff', fontSize: '20px', cursor: 'pointer' }}>-</button>
              <span style={{ fontSize: '24px', fontWeight: 'bold', width: '40px', textAlign: 'center' }}>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #ddd', backgroundColor: '#fff', fontSize: '20px', cursor: 'pointer' }}>+</button>
            </div>
          </div>

          {/* 전화번호 입력 */}
          <div style={{ marginBottom: '30px' }}>
            <label style={{ fontSize: '14px', color: '#333', display: 'block', marginBottom: '10px' }}>연락처</label>
            <input 
              type="tel" 
              placeholder="01012345678" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))} 
              style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '16px' }} 
            />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => { setView('market'); setQuantity(1); }} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid #ddd', backgroundColor: '#fff', fontWeight: 'bold' }}>취소</button>
            <button onClick={handleReserve} disabled={reserving} style={{ flex: 2, padding: '14px', borderRadius: '12px', border: 'none', backgroundColor: '#137333', color: '#fff', fontWeight: 'bold' }}>
              {reserving ? '확인 중...' : '예약 확정'}
            </button>
          </div>
        </div>
      )}

      {/* --- [3] 관리자 화면 (주문 현황) --- */}
      {view === 'admin' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>📋 실시간 예약 현황</h2>
            <button onClick={() => setView('market')} style={{ fontSize: '12px', padding: '6px 12px', backgroundColor: '#666', color: '#fff', border: 'none', borderRadius: '6px' }}>닫기</button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {allOrders.length > 0 ? allOrders.map((order, i) => (
              <div key={i} style={{ backgroundColor: '#fff', padding: '14px', borderRadius: '12px', fontSize: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 'bold' }}>{order.phone}</span>
                  <span style={{ color: '#137333', fontWeight: 'bold' }}>{order.status}</span>
                </div>
                <div style={{ color: '#555' }}>{order.product_name} | {order.quantity}개</div>
              </div>
            )) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>아직 예약 내역이 없습니다.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}