import React, { useState } from "react";

/**
 * SecondaryFranchiseDashboard.tsx
 * 【2次加盟店マイページ】
 * 
 * 機能:
 * - 製品購入・注文
 * - 注文履歴・配送追跡
 * - 購入統計
 */

const mockUser = {
  id: "secondary001",
  name: "山田太郎",
  company: "山田工務店",
  role: "secondary",
  referredBy: "primary001",
};

const mockOrders = [
  { id: "ord201", date: "2026-02-10", product: "クリスタライズ", quantity: 12, amount: 132000, status: "shipped", trackingNo: "1234567890" },
  { id: "ord202", date: "2026-02-03", product: "クリスタライズ", quantity: 15, amount: 165000, status: "delivered", trackingNo: "0987654321" },
  { id: "ord203", date: "2026-01-25", product: "クリスタライズ", quantity: 10, amount: 110000, status: "delivered", trackingNo: "1122334455" },
  { id: "ord204", date: "2026-01-15", product: "クリスタライズ", quantity: 8, amount: 88000, status: "delivered", trackingNo: "5544332211" },
];

const productInfo = {
  name: "クリスタライズ",
  description: "次世代コンクリート改質剤",
  price: 10000,
  priceWithTax: 11000,
  features: [
    "表層0.6mm浸透技術",
    "浸透度28倍以上（日本建築総合試験所）",
    "10年間メンテナンスフリー",
    "雨で汚れが落ちるセルフクリーニング効果",
  ],
  shipping: "¥1,430（10本まで、11本〜無料）",
};

export default function SecondaryFranchiseDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "order" | "history">("overview");
  const [orderQuantity, setOrderQuantity] = useState(10);

  const totalOrders = mockOrders.reduce((sum, order) => sum + order.quantity, 0);
  const totalSpent = mockOrders.reduce((sum, order) => sum + order.amount, 0);
  const thisMonthOrders = mockOrders.filter(o => o.date.startsWith("2026-02")).reduce((sum, order) => sum + order.quantity, 0);

  const orderTotal = orderQuantity * productInfo.priceWithTax;
  const shippingFee = orderQuantity >= 11 ? 0 : 1430;
  const grandTotal = orderTotal + shippingFee;

  return (
    <div className="dashboard-root">
      <SecondaryStyle />

      {/* Header */}
      <header className="dashboard-header">
        <div className="container header-content">
          <div className="logo">CRYSTALIZE</div>
          <div className="user-info">
            <span className="user-role secondary">2次加盟店</span>
            <span className="user-name">{mockUser.name}</span>
            <button className="btn-logout">ログアウト</button>
          </div>
        </div>
      </header>

      {/* Layout */}
      <div className="dashboard-layout">
        <aside className="sidebar">
          <nav className="sidebar-nav">
            <button className={`nav-item ${activeTab === "overview" ? "active" : ""}`} onClick={() => setActiveTab("overview")}>
              <span className="nav-icon">📊</span><span>ダッシュボード</span>
            </button>
            <button className={`nav-item ${activeTab === "order" ? "active" : ""}`} onClick={() => setActiveTab("order")}>
              <span className="nav-icon">🛒</span><span>製品注文</span>
            </button>
            <button className={`nav-item ${activeTab === "history" ? "active" : ""}`} onClick={() => setActiveTab("history")}>
              <span className="nav-icon">📦</span><span>注文履歴</span>
            </button>
          </nav>
        </aside>

        <main className="main-content">
          {activeTab === "overview" && (
            <div className="content-section">
              <h1 className="page-title">ダッシュボード</h1>
              
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">📦</div>
                  <div className="stat-content">
                    <div className="stat-label">今月の注文数</div>
                    <div className="stat-value">{thisMonthOrders}個</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📈</div>
                  <div className="stat-content">
                    <div className="stat-label">累計注文数</div>
                    <div className="stat-value">{totalOrders}個</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">💰</div>
                  <div className="stat-content">
                    <div className="stat-label">累計購入金額</div>
                    <div className="stat-value">¥{totalSpent.toLocaleString()}</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🚚</div>
                  <div className="stat-content">
                    <div className="stat-label">配送中の注文</div>
                    <div className="stat-value">{mockOrders.filter(o => o.status === "shipped").length}</div>
                  </div>
                </div>
              </div>

              <div className="product-showcase">
                <h2 className="section-title">取扱製品</h2>
                <div className="product-card">
                  <div className="product-header">
                    <h3 className="product-name">{productInfo.name}</h3>
                    <p className="product-desc">{productInfo.description}</p>
                  </div>
                  <div className="product-price">
                    <div className="price-label">販売価格</div>
                    <div className="price-main">
                      <span className="price-value">¥{productInfo.price.toLocaleString()}</span>
                      <span className="price-tax">(税別)</span>
                    </div>
                    <div className="price-included">¥{productInfo.priceWithTax.toLocaleString()} (税込)</div>
                  </div>
                  <div className="product-features">
                    <h4>主な特長</h4>
                    <ul>
                      {productInfo.features.map((feature, idx) => (
                        <li key={idx}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                  <button className="btn-order" onClick={() => setActiveTab("order")}>🛒 注文する</button>
                </div>
              </div>

              <div className="recent-orders">
                <h2 className="section-title">最近の注文</h2>
                <div className="order-list">
                  {mockOrders.slice(0, 3).map((order) => (
                    <div key={order.id} className="order-item">
                      <div className="order-info">
                        <div className="order-id">注文番号: {order.id}</div>
                        <div className="order-details">
                          {order.product} × {order.quantity}個 | ¥{order.amount.toLocaleString()}
                        </div>
                        <div className="order-date">{order.date}</div>
                      </div>
                      <div className="order-status">
                        <span className={`status-badge ${order.status}`}>
                          {order.status === "shipped" ? "配送中" : "配送完了"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "order" && (
            <div className="content-section">
              <h1 className="page-title">製品注文</h1>
              
              <div className="order-form-container">
                <div className="order-product-info">
                  <h3>{productInfo.name}</h3>
                  <p className="product-subtitle">{productInfo.description}</p>
                  <div className="price-display">
                    <span className="price-amount">¥{productInfo.priceWithTax.toLocaleString()}</span>
                    <span className="price-unit">/本（税込）</span>
                  </div>
                </div>

                <div className="order-form">
                  <div className="form-group">
                    <label className="form-label">注文数量</label>
                    <div className="quantity-selector">
                      <button className="qty-btn" onClick={() => setOrderQuantity(Math.max(1, orderQuantity - 1))}>−</button>
                      <input 
                        type="number" 
                        value={orderQuantity} 
                        onChange={(e) => setOrderQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="qty-input"
                        min="1"
                      />
                      <button className="qty-btn" onClick={() => setOrderQuantity(orderQuantity + 1)}>+</button>
                    </div>
                    {orderQuantity >= 11 && (
                      <div className="shipping-notice">✅ 送料無料（11本以上）</div>
                    )}
                  </div>

                  <div className="order-summary">
                    <h4>注文内容</h4>
                    <div className="summary-row">
                      <span>商品小計</span>
                      <span>¥{orderTotal.toLocaleString()}</span>
                    </div>
                    <div className="summary-row">
                      <span>送料</span>
                      <span>{shippingFee === 0 ? "無料" : `¥${shippingFee.toLocaleString()}`}</span>
                    </div>
                    <div className="summary-row total">
                      <span>合計金額</span>
                      <span>¥{grandTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  <button className="btn-submit-order">🛒 注文を確定する</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "history" && (
            <div className="content-section">
              <h1 className="page-title">注文履歴</h1>
              
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>注文番号</th>
                      <th>注文日</th>
                      <th>商品</th>
                      <th>数量</th>
                      <th>金額</th>
                      <th>ステータス</th>
                      <th>追跡番号</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockOrders.map((order) => (
                      <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.date}</td>
                        <td>{order.product}</td>
                        <td>{order.quantity}本</td>
                        <td>¥{order.amount.toLocaleString()}</td>
                        <td>
                          <span className={`status-badge ${order.status}`}>
                            {order.status === "shipped" ? "配送中" : "配送完了"}
                          </span>
                        </td>
                        <td className="tracking-no">{order.trackingNo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function SecondaryStyle() {
  return (
    <style>{`
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: 'Noto Sans JP', sans-serif; background: #f3f4f6; color: #111827; line-height: 1.6; }
      .dashboard-root { min-height: 100vh; display: flex; flex-direction: column; }
      .container { max-width: 1400px; margin: 0 auto; padding: 0 24px; }
      .dashboard-header { background: #fff; border-bottom: 1px solid #e5e7eb; padding: 16px 0; position: sticky; top: 0; z-index: 100; }
      .header-content { display: flex; justify-content: space-between; align-items: center; }
      .logo { font-size: 24px; font-weight: 900; color: #d97706; }
      .user-info { display: flex; align-items: center; gap: 16px; }
      .user-role { background: rgba(16,185,129,0.1); color: #059669; padding: 6px 12px; border-radius: 12px; font-size: 12px; font-weight: 700; }
      .user-name { font-weight: 600; color: #374151; }
      .btn-logout { background: #f3f4f6; border: 1px solid #e5e7eb; color: #6b7280; padding: 8px 16px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
      .btn-logout:hover { background: #e5e7eb; color: #374151; }
      .dashboard-layout { display: flex; flex: 1; }
      .sidebar { width: 260px; background: #fff; border-right: 1px solid #e5e7eb; padding: 24px 0; }
      .sidebar-nav { display: flex; flex-direction: column; gap: 4px; padding: 0 12px; }
      .nav-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border: none; background: transparent; border-radius: 8px; font-size: 14px; font-weight: 600; color: #6b7280; cursor: pointer; transition: all 0.2s; text-align: left; }
      .nav-item:hover { background: #f3f4f6; color: #374151; }
      .nav-item.active { background: rgba(16,185,129,0.1); color: #059669; }
      .nav-icon { font-size: 20px; }
      .main-content { flex: 1; padding: 32px; overflow-y: auto; }
      .content-section { max-width: 1200px; }
      .page-title { font-size: 28px; font-weight: 900; color: #111827; margin-bottom: 24px; }
      .section-title { font-size: 20px; font-weight: 800; color: #111827; margin: 32px 0 16px; }
      .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 32px; }
      .stat-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; display: flex; align-items: center; gap: 16px; transition: all 0.2s; }
      .stat-card:hover { border-color: #10b981; box-shadow: 0 4px 12px rgba(16,185,129,0.1); }
      .stat-icon { font-size: 40px; }
      .stat-content { flex: 1; }
      .stat-label { font-size: 13px; color: #6b7280; font-weight: 600; margin-bottom: 4px; }
      .stat-value { font-size: 32px; font-weight: 900; color: #111827; line-height: 1; }
      .product-showcase { margin-bottom: 32px; }
      .product-card { background: #fff; border: 2px solid rgba(217,119,6,0.2); border-radius: 16px; padding: 32px; }
      .product-header { margin-bottom: 24px; }
      .product-name { font-size: 28px; font-weight: 900; color: #d97706; margin-bottom: 8px; }
      .product-desc { font-size: 16px; color: #6b7280; }
      .product-price { background: linear-gradient(135deg, rgba(217,119,6,0.05) 0%, rgba(217,119,6,0.1) 100%); border: 2px solid rgba(217,119,6,0.3); border-radius: 12px; padding: 20px; margin-bottom: 24px; }
      .price-label { font-size: 13px; font-weight: 700; color: #6b7280; text-transform: uppercase; margin-bottom: 8px; }
      .price-main { display: flex; align-items: baseline; gap: 8px; margin-bottom: 8px; }
      .price-value { font-size: 36px; font-weight: 900; color: #d97706; }
      .price-tax { font-size: 16px; color: #6b7280; font-weight: 600; }
      .price-included { font-size: 18px; color: #374151; font-weight: 700; }
      .product-features { margin-bottom: 24px; }
      .product-features h4 { font-size: 16px; font-weight: 800; color: #111827; margin-bottom: 12px; }
      .product-features ul { list-style: none; padding: 0; }
      .product-features li { font-size: 14px; color: #374151; padding: 6px 0 6px 24px; position: relative; }
      .product-features li::before { content: "✓"; position: absolute; left: 0; color: #d97706; font-weight: 900; }
      .btn-order { width: 100%; background: linear-gradient(135deg, #d97706 0%, #b45309 100%); color: #fff; border: none; padding: 16px; border-radius: 10px; font-size: 16px; font-weight: 800; cursor: pointer; transition: all 0.2s; }
      .btn-order:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(217,119,6,0.3); }
      .recent-orders { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; }
      .order-list { display: flex; flex-direction: column; gap: 12px; }
      .order-item { display: flex; justify-content: space-between; align-items: center; padding: 16px; background: #f9fafb; border-radius: 8px; }
      .order-info { flex: 1; }
      .order-id { font-size: 14px; font-weight: 700; color: #111827; margin-bottom: 4px; }
      .order-details { font-size: 14px; color: #374151; margin-bottom: 4px; }
      .order-date { font-size: 12px; color: #9ca3af; }
      .order-status { }
      .status-badge { display: inline-block; padding: 6px 14px; border-radius: 12px; font-size: 12px; font-weight: 700; }
      .status-badge.shipped { background: rgba(59,130,246,0.1); color: #2563eb; }
      .status-badge.delivered { background: rgba(16,185,129,0.1); color: #059669; }
      .order-form-container { max-width: 700px; }
      .order-product-info { background: #fff; border: 2px solid rgba(217,119,6,0.2); border-radius: 12px; padding: 24px; margin-bottom: 24px; }
      .order-product-info h3 { font-size: 24px; font-weight: 900; color: #d97706; margin-bottom: 8px; }
      .product-subtitle { font-size: 14px; color: #6b7280; margin-bottom: 16px; }
      .price-display { display: flex; align-items: baseline; gap: 8px; }
      .price-amount { font-size: 32px; font-weight: 900; color: #d97706; }
      .price-unit { font-size: 16px; color: #6b7280; }
      .order-form { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 32px; }
      .form-group { margin-bottom: 24px; }
      .form-label { display: block; font-size: 14px; font-weight: 700; color: #374151; margin-bottom: 12px; }
      .quantity-selector { display: flex; align-items: center; gap: 12px; }
      .qty-btn { background: #f3f4f6; border: 1px solid #e5e7eb; color: #374151; width: 40px; height: 40px; border-radius: 8px; font-size: 20px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
      .qty-btn:hover { background: #e5e7eb; }
      .qty-input { flex: 1; max-width: 120px; padding: 10px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 18px; font-weight: 700; text-align: center; }
      .shipping-notice { margin-top: 8px; font-size: 14px; color: #059669; font-weight: 600; }
      .order-summary { background: #f9fafb; border-radius: 12px; padding: 24px; margin-bottom: 24px; }
      .order-summary h4 { font-size: 16px; font-weight: 800; color: #111827; margin-bottom: 16px; }
      .summary-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 15px; color: #374151; }
      .summary-row.total { border-top: 2px solid #e5e7eb; margin-top: 12px; padding-top: 16px; font-size: 18px; font-weight: 800; color: #111827; }
      .btn-submit-order { width: 100%; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #fff; border: none; padding: 16px; border-radius: 10px; font-size: 16px; font-weight: 800; cursor: pointer; transition: all 0.2s; }
      .btn-submit-order:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(16,185,129,0.3); }
      .table-container { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; }
      .data-table { width: 100%; border-collapse: collapse; }
      .data-table thead { background: #f9fafb; }
      .data-table th { padding: 12px 16px; text-align: left; font-size: 13px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; }
      .data-table td { padding: 16px; border-top: 1px solid #e5e7eb; font-size: 14px; color: #374151; }
      .tracking-no { font-family: monospace; font-size: 13px; color: #6b7280; }
      @media (max-width: 1024px) {
        .dashboard-layout { flex-direction: column; }
        .sidebar { width: 100%; border-right: none; border-bottom: 1px solid #e5e7eb; }
        .sidebar-nav { flex-direction: row; overflow-x: auto; }
        .nav-item { flex-shrink: 0; }
      }
      @media (max-width: 768px) {
        .main-content { padding: 16px; }
        .stats-grid { grid-template-columns: 1fr; }
        .table-container { overflow-x: auto; }
        .data-table { min-width: 700px; }
      }
    `}</style>
  );
}
