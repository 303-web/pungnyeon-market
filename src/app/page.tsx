'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://zyilyfciytbzmdqptuhu.supabase.co',
  'sb_publishable_tEqngQD6BxzQfKdT4TgtQQ_qK-kZKtD'
);

export default function Page() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 화면 전환용 상태 (market: 마켓홈, inquiry: 번호입력, result: 결과창)
  const [view, setView] = useState<'market' | 'inquiry' | 'result'>('market');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [myOrders, setMyOrders] = useState<any[]>([]); // 진짜 예약 내역을 담을 곳
  const [inquiryLoading, setInquiryLoading] = useState(false);

  // 1. 상품 목록 실시간 가져오기
  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, price')
        .order('id', { ascending: true });
      
      if (!error && data) setProducts(data);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  // 2. 예약 내역 진짜로 데이터베이스에서 조회하기
  async function handleInquiry() {
    if (!phoneNumber.trim()) {
      alert('전화번호를 입력해 주세요!');
      return;
    }
    
    setInquiryLoading(true);
    
    // 사장님이 만드신 orders 표에서 입력한 번호와 일치하는 것만 쏙 골라옵니다!
    const { data, error } = await supabase
      .from('orders')
      .select('created_at, product_name, status')
      .eq('phone', phoneNumber.trim());

    if (!error && data) {
      setMyOrders(data);
    }
    
    setInquiryLoading(false);
    setView('result'); // 결과 화면으로 이동
  }

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>로딩 중...</div>;

  return (
    <div style={{ 
      maxWidth: '480px', 
      margin: '0 auto', 
      padding: '16px', 
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
      backgroundColor: '#f4f5f7',
      minHeight: '100vh',
      position: 'relative'
    }}>
      
      {/* [화면 1] 메인 마켓 홈 화면 */}
      {view === 'market' && (
        <>
          <header style={{ textAlign: 'center', padding: '20px 0', backgroundColor: '#fff', borderRadius: '16px', marginBottom: '16px', position: 'relative' }}>
            <button 
              onClick={() => setView('inquiry')}
              style={{
                position: 'absolute', right: '16px', top: '16px',
                padding: '6px 12px', borderRadius: '8px', border: '1px solid #ddd',
                backgroundColor: '#fff', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer'
              }}
            >
              예약조회
            </button>

            <h1 style={{ margin: '10px 0 0 0', fontSize: '20px', fontWeight: 'bold', color: '#ff4d4d' }}>
              풍년 <span style={{ color: '#4a4a4a' }}>프리마켓</span>
            </h1>
            <div style={{ backgroundColor: '#e6f4ea', color: '#137333', display: 'inline-block', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', marginTop: '8px', fontWeight: 'bold' }}>
              📢 [공지] 이번 주 홍게 수령은 목요일부터 가능합니다!
            </div>
          </header>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            {['전체', '예약중', '준비중', '수령중'].map((tab, i) => (
              <button key={tab} style={{
                padding: '6px 14px', borderRadius: '20px', border: 'none',
                backgroundColor: i === 0 ? '#137333' : '#fff', color: i === 0 ? '#fff' : '#4a4a4a',
                fontSize: '13px', fontWeight: 'bold', cursor: 'pointer'
              }}>{tab}</button>
            ))}
          </div>

          <main style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {products.map((p) => (
              <div key={p.id} style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '16px', display: 'flex', gap: '16px', position: 'relative', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ width: '80px', height: '80px', backgroundColor: '#eee', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                  {p.name.includes('홍게') ? '🦀' : p.name.includes('양파') ? '🧅' : '📦'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '15px', fontWeight: 'bold' }}>{p.name}</span>
                    <span style={{ backgroundColor: '#ffefe6', color: '#ff6b00', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>예약중</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#8a8a8a', marginBottom: '8px' }}>남은 수량: 50개 내외</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                    <span style={{ color: '#ff3b30', fontWeight: 'bold', fontSize: '16px' }}>40%</span>
                    <span style={{ fontWeight: 'bold', fontSize: '18px' }}>{p.price?.toLocaleString()}원</span>
                  </div>
                </div>
                <button style={{ position: 'absolute', right: '16px', bottom: '16px', backgroundColor: '#137333', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>예약</button>
              </div>
            ))}
          </main>
        </>
      )}

      {/* [화면 2] 전화번호 입력 화면 */}
      {view === 'inquiry' && (
        <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '24px', marginTop: '40px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>주문 / 예약 조회</h2>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '24px' }}>주문할 때 입력했던 휴대폰 번호를 입력해 주세요.</p>
          
          <input 
            type="tel" 
            placeholder="숫자만 입력 (예: 01012345678)"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px', marginBottom: '16px', boxSizing: 'border-box' }}
          />

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setView('market')} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ddd', backgroundColor: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>취소</button>
            <button 
              onClick={handleInquiry} 
              disabled={inquiryLoading}
              style={{ flex: 2, padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#137333', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
            >
              {inquiryLoading ? '조회 중...' : '조회하기'}
            </button>
          </div>
        </div>
      )}

      {/* [화면 3] 조회 결과 내역 화면 */}
      {view === 'result' && (
        <div style={{ marginTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>📋 예약 내역 결과</h2>
            <button onClick={() => { setView('market'); setPhoneNumber(''); setMyOrders([]); }} style={{ padding: '6px 12px', borderRadius: '8px', border: 'none', backgroundColor: '#137333', color: '#fff', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>홈으로 가기</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {myOrders.length > 0 ? (
              myOrders.map((order, idx) => {
                const dateObj = new Date(order.created_at);
                const dateStr = `${dateObj.getFullYear()}/${String(dateObj.getMonth() + 1).padStart(2, '0')}/${String(dateObj.getDate()).padStart(2, '0')}`;
                return (
                  <div key={idx} style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '16px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '13px', color: '#8a8a8a' }}>주문일: {dateStr}</span>
                      <span style={{ backgroundColor: '#e6f4ea', color: '#137333', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>{order.status}</span>
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1a1a1a' }}>{order.product_name}</div>
                  </div>
                );
              })
            ) : (
              <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '40px', textAlign: 'center', color: '#8a8a8a' }}>
                입력하신 번호({phoneNumber})로 등록된 예약 내역이 없습니다.
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}