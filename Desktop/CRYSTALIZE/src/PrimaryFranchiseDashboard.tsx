import React, { useState } from "react";

/**
 * PrimaryFranchiseDashboard.tsx
 * 【1次加盟店マイページ】
 * 
 * 機能:
 * - 2次加盟店募集用URL・QRコード生成
 * - 2次加盟店一覧・管理
 * - インセンティブダッシュボード（¥2,000/件、月10個購入条件）
 * - 製品購入・注文履歴
 */

const mockUser = {
  id: "primary001",
  name: "鈴木一郎",
  company: "鈴木建設",
  role: "primary",
};

const mockSecondaryFranchises = [
  { id: "s001", name: "山田工務店", owner: "山田太郎", joinedDate: "2026-02-03", monthlyOrders: 12, status: "active" },
  { id: "s002", name: "佐藤建設", owner: "佐藤花子", joinedDate: "2026-02-07", monthlyOrders: 15, status: "active" },
  { id: "s003", name: "田中リフォーム", owner: "田中次郎", joinedDate: "2026-02-10", monthlyOrders: 8, status: "active" },
  { id: "s004", name: "高橋塗装", owner: "高橋三郎", joinedDate: "2026-02-12", monthlyOrders: 10, status: "active" },
  { id: "s005", name: "伊藤左官", owner: "伊藤四郎", joinedDate: "2026-02-13", monthlyOrders: 11, status: "active" },
];

const mockIncentives = [
  { month: "2026-02", secondaryCount: 5, purchaseCount: 15, amount: 10000, status: "pending", eligible: true },
  { month: "2026-01", secondaryCount: 3, purchaseCount: 12, amount: 6000, status: "paid", eligible: true },
];

const mockOrders = [
  { id: "ord101", date: "2026-02-05", product: "クリスタライズ", quantity: 15, amount: 165000, status: "delivered" },
  { id: "ord102", date: "2026-01-20", product: "クリスタライズ", quantity: 12, amount: 132000, status: "delivered" },
];

export default function PrimaryFranchiseDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "recruitment" | "franchises" | "incentives" | "orders">("overview");

  const recruitmentUrl = `https://crystalize.com/secondary?ref=${mockUser.id}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(recruitmentUrl)}`;

  const currentMonthPurchase = mockIncentives[0].purchaseCount;
  const isEligible = currentMonthPurchase >= 10;

  return (
    <div className="dashboard-root">
      <PrimaryStyle />

      {/* Header */}
      <header className="dashboard-header">
        <div className="container header-content">
          <div className="logo">CRYSTALIZE</div>
          <div className="user-info">
            <span className="user-role primary">1次加盟店</span>
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
            <button className={`nav-item ${activeTab === "recruitment" ? "active" : ""}`} onClick={() => setActiveTab("recruitment")}>
              <span className="nav-icon">🎯</span><span>募集ツール</span>
            </button>
            <button className={`nav-item ${activeTab === "franchises" ? "active" : ""}`} onClick={() => setActiveTab("franchises")}>
              <span className="nav-icon">👥</span><span>2次加盟店管理</span>
            </button>
            <button className={`nav-item ${activeTab === "incentives" ? "active" : ""}`} onClick={() => setActiveTab("incentives")}>
              <span className="nav-icon">💰</span><span>インセンティブ</span>
            </button>
            <button className={`nav-item ${activeTab === "orders" ? "active" : ""}`} onClick={() => setActiveTab("orders")}>
              <span className="nav-icon">📦</span><span>注文・購入</span>
            </button>
          </nav>
        </aside>

        <main className="main-content">
          {activeTab === "overview" && (
            <div className="content-section">
              <h1 className="page-title">ダッシュボード</h1>
              
              {!isEligible ? (
                <div className="alert alert-warning">
                  <div className="alert-icon">⚠️</div>
                  <div className="alert-content">
                    <div className="alert-title">インセンティブ獲得条件未達成</div>
                    <div className="alert-desc">
                      今月の購入数: {currentMonthPurchase}個 / 必要数: 10個以上<br />
                      あと<strong>{10 - currentMonthPurchase}個</strong>購入すると、インセンティブが獲得できます！
                    </div>
                  </div>
                </div>
              ) : (
                <div className="alert alert-success">
                  <div className="alert-icon">✅</div>
                  <div className="alert-content">
                    <div className="alert-title">インセンティブ獲得条件達成！</div>
                    <div className="alert-desc">
                      今月の購入数: {currentMonthPurchase}個（条件クリア）<br />
                      紹介インセンティブが翌月10日に振り込まれます。
                    </div>
                  </div>
                </div>
              )}

              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">👥</div>
                  <div className="stat-content">
                    <div className="stat-label">2次加盟店数</div>
                    <div className="stat-value">{mockSecondaryFranchises.length}</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📦</div>
                  <div className="stat-content">
                    <div className="stat-label">今月の購入数</div>
                    <div className="stat-value">{currentMonthPurchase}個</div>
                    <div className="stat-note">{isEligible ? "条件達成" : `あと${10 - currentMonthPurchase}個`}</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">💰</div>
                  <div className="stat-content">
                    <div className="stat-label">今月のインセンティブ</div>
                    <div className="stat-value">¥{mockIncentives[0].amount.toLocaleString()}</div>
                    <div className="stat-note">{isEligible ? "確定待ち" : "条件未達成"}</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📈</div>
                  <div className="stat-content">
                    <div className="stat-label">累計インセンティブ</div>
                    <div className="stat-value">¥{mockIncentives.reduce((sum, i) => sum + (i.eligible ? i.amount : 0), 0).toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "recruitment" && (
            <div className="content-section">
              <h1 className="page-title">2次加盟店募集ツール</h1>
              
              <div className="recruitment-tools">
                <div className="tool-card">
                  <h3>専用募集URL</h3>
                  <p className="tool-desc">このURLを共有して2次加盟店を募集できます</p>
                  <div className="url-box">
                    <input type="text" value={recruitmentUrl} readOnly className="url-input" />
                    <button className="btn-copy" onClick={() => navigator.clipboard.writeText(recruitmentUrl)}>📋 コピー</button>
                  </div>
                </div>

                <div className="tool-card">
                  <h3>QRコード</h3>
                  <p className="tool-desc">名刺やチラシに印刷して使用できます</p>
                  <div className="qr-container">
                    <img src={qrCodeUrl} alt="QR Code" className="qr-image" />
                  </div>
                  <button className="btn-download">⬇️ QRコードをダウンロード</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "franchises" && (
            <div className="content-section">
              <h1 className="page-title">2次加盟店管理</h1>
              
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>会社名</th>
                      <th>担当者</th>
                      <th>登録日</th>
                      <th>月間注文数</th>
                      <th>ステータス</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockSecondaryFranchises.map((franchise) => (
                      <tr key={franchise.id}>
                        <td>{franchise.name}</td>
                        <td>{franchise.owner}</td>
                        <td>{franchise.joinedDate}</td>
                        <td>{franchise.monthlyOrders}個</td>
                        <td><span className="status-badge active">アクティブ</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "incentives" && (
            <div className="content-section">
              <h1 className="page-title">インセンティブ管理</h1>
              
              <div className="incentive-summary">
                <div className={`summary-card ${isEligible ? "" : "not-eligible"}`}>
                  <h3>今月の見込み</h3>
                  <div className="summary-amount">¥{mockIncentives[0].amount.toLocaleString()}</div>
                  <div className="summary-detail">2次加盟店 {mockIncentives[0].secondaryCount}件 × ¥2,000</div>
                  {isEligible ? (
                    <div className="summary-note">✅ 購入条件達成（{currentMonthPurchase}個 ≥ 10個）</div>
                  ) : (
                    <div className="summary-note">⚠️ 購入条件未達成（{currentMonthPurchase}個 / 10個）</div>
                  )}
                </div>
              </div>

              <h2 className="section-title">インセンティブ履歴</h2>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>対象月</th>
                      <th>2次加盟店数</th>
                      <th>購入数</th>
                      <th>金額</th>
                      <th>ステータス</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockIncentives.map((incentive) => (
                      <tr key={incentive.month}>
                        <td>{incentive.month}</td>
                        <td>{incentive.secondaryCount}件</td>
                        <td>{incentive.purchaseCount}個 {incentive.eligible && <span className="badge-success">✓</span>}</td>
                        <td>¥{incentive.amount.toLocaleString()}</td>
                        <td><span className={`status-badge ${incentive.status}`}>{incentive.status === "paid" ? "支払済" : "確定待ち"}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="content-section">
              <h1 className="page-title">注文・購入</h1>
              
              <div className="order-actions">
                <button className="btn-primary">🛒 新規注文</button>
              </div>

              <div className="purchase-reminder">
                <div className="reminder-icon">💡</div>
                <div className="reminder-content">
                  <strong>インセンティブ獲得のために:</strong><br />
                  月10個以上の購入で、紹介インセンティブが獲得できます。<br />
                  今月の購入数: <strong className="text-gold">{currentMonthPurchase}個</strong>
                  {!isEligible && ` / あと${10 - currentMonthPurchase}個必要`}
                </div>
              </div>

              <h2 className="section-title">注文履歴</h2>
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
                        <td><span className="status-badge delivered">配送完了</span></td>
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

function PrimaryStyle() {
  return (
    <style>{`
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: 'Noto Sans JP', sans-serif; background: #f3f4f6; color: #111827; line-height: 1.6; }
      .dashboard-root { min-height: 100vh; display: flex; flex-direction: column; }
      .container { max-width: 1400px; margin: 0 auto; padding: 0 24px; }
      .text-gold { color: #d97706; }
      .dashboard-header { background: #fff; border-bottom: 1px solid #e5e7eb; padding: 16px 0; position: sticky; top: 0; z-index: 100; }
      .header-content { display: flex; justify-content: space-between; align-items: center; }
      .logo { font-size: 24px; font-weight: 900; color: #d97706; }
      .user-info { display: flex; align-items: center; gap: 16px; }
      .user-role { background: rgba(59,130,246,0.1); color: #2563eb; padding: 6px 12px; border-radius: 12px; font-size: 12px; font-weight: 700; }
      .user-name { font-weight: 600; color: #374151; }
      .btn-logout { background: #f3f4f6; border: 1px solid #e5e7eb; color: #6b7280; padding: 8px 16px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
      .btn-logout:hover { background: #e5e7eb; color: #374151; }
      .dashboard-layout { display: flex; flex: 1; }
      .sidebar { width: 260px; background: #fff; border-right: 1px solid #e5e7eb; padding: 24px 0; }
      .sidebar-nav { display: flex; flex-direction: column; gap: 4px; padding: 0 12px; }
      .nav-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border: none; background: transparent; border-radius: 8px; font-size: 14px; font-weight: 600; color: #6b7280; cursor: pointer; transition: all 0.2s; text-align: left; }
      .nav-item:hover { background: #f3f4f6; color: #374151; }
      .nav-item.active { background: rgba(59,130,246,0.1); color: #2563eb; }
      .nav-icon { font-size: 20px; }
      .main-content { flex: 1; padding: 32px; overflow-y: auto; }
      .content-section { max-width: 1200px; }
      .page-title { font-size: 28px; font-weight: 900; color: #111827; margin-bottom: 24px; }
      .section-title { font-size: 20px; font-weight: 800; color: #111827; margin: 32px 0 16px; }
      .alert { display: flex; gap: 16px; padding: 20px; border-radius: 12px; margin-bottom: 24px; }
      .alert-warning { background: rgba(251,191,36,0.1); border: 2px solid #fbbf24; }
      .alert-success { background: rgba(16,185,129,0.1); border: 2px solid #10b981; }
      .alert-icon { font-size: 32px; }
      .alert-content { flex: 1; }
      .alert-title { font-size: 16px; font-weight: 800; color: #111827; margin-bottom: 8px; }
      .alert-desc { font-size: 14px; color: #374151; line-height: 1.6; }
      .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 32px; }
      .stat-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; display: flex; align-items: center; gap: 16px; transition: all 0.2s; }
      .stat-card:hover { border-color: #2563eb; box-shadow: 0 4px 12px rgba(59,130,246,0.1); }
      .stat-icon { font-size: 40px; }
      .stat-content { flex: 1; }
      .stat-label { font-size: 13px; color: #6b7280; font-weight: 600; margin-bottom: 4px; }
      .stat-value { font-size: 32px; font-weight: 900; color: #111827; line-height: 1; }
      .stat-note { font-size: 12px; color: #9ca3af; margin-top: 4px; }
      .recruitment-tools { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 24px; margin-bottom: 32px; }
      .tool-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; }
      .tool-card h3 { font-size: 18px; font-weight: 800; color: #111827; margin-bottom: 8px; }
      .tool-desc { font-size: 14px; color: #6b7280; margin-bottom: 16px; }
      .url-box { display: flex; gap: 8px; margin-bottom: 16px; }
      .url-input { flex: 1; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 14px; font-family: monospace; }
      .btn-copy { background: #2563eb; color: #fff; border: none; padding: 12px 20px; border-radius: 8px; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
      .btn-copy:hover { background: #1d4ed8; }
      .qr-container { text-align: center; margin: 20px 0; }
      .qr-image { max-width: 200px; border: 2px solid #e5e7eb; border-radius: 8px; }
      .btn-download { width: 100%; background: #2563eb; color: #fff; border: none; padding: 12px; border-radius: 8px; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
      .btn-download:hover { background: #1d4ed8; }
      .table-container { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; }
      .data-table { width: 100%; border-collapse: collapse; }
      .data-table thead { background: #f9fafb; }
      .data-table th { padding: 12px 16px; text-align: left; font-size: 13px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; }
      .data-table td { padding: 16px; border-top: 1px solid #e5e7eb; font-size: 14px; color: #374151; }
      .status-badge { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 700; }
      .status-badge.active { background: rgba(16,185,129,0.1); color: #059669; }
      .status-badge.paid { background: rgba(16,185,129,0.1); color: #059669; }
      .status-badge.pending { background: rgba(251,191,36,0.1); color: #d97706; }
      .status-badge.delivered { background: rgba(16,185,129,0.1); color: #059669; }
      .badge-success { display: inline-block; margin-left: 8px; color: #10b981; font-weight: 900; }
      .incentive-summary { margin-bottom: 32px; }
      .summary-card { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: #fff; border-radius: 12px; padding: 32px; text-align: center; }
      .summary-card.not-eligible { background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%); }
      .summary-card h3 { font-size: 16px; font-weight: 700; margin-bottom: 16px; opacity: 0.9; }
      .summary-amount { font-size: 48px; font-weight: 900; margin-bottom: 12px; }
      .summary-detail { font-size: 16px; margin-bottom: 8px; opacity: 0.9; }
      .summary-note { font-size: 13px; opacity: 0.8; }
      .order-actions { margin-bottom: 24px; }
      .btn-primary { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: #fff; border: none; padding: 12px 24px; border-radius: 8px; font-size: 15px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
      .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(59,130,246,0.3); }
      .purchase-reminder { display: flex; gap: 16px; background: rgba(59,130,246,0.1); border: 2px solid #3b82f6; border-radius: 12px; padding: 20px; margin-bottom: 24px; }
      .reminder-icon { font-size: 32px; }
      .reminder-content { flex: 1; font-size: 14px; color: #374151; line-height: 1.7; }
      @media (max-width: 1024px) {
        .dashboard-layout { flex-direction: column; }
        .sidebar { width: 100%; border-right: none; border-bottom: 1px solid #e5e7eb; }
        .sidebar-nav { flex-direction: row; overflow-x: auto; }
        .nav-item { flex-shrink: 0; }
      }
      @media (max-width: 768px) {
        .main-content { padding: 16px; }
        .stats-grid { grid-template-columns: 1fr; }
        .recruitment-tools { grid-template-columns: 1fr; }
        .table-container { overflow-x: auto; }
        .data-table { min-width: 600px; }
      }
    `}</style>
  );
}
