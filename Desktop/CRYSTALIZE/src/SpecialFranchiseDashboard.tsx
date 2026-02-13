import React, { useState } from "react";

/**
 * SpecialFranchiseDashboard.tsx
 * 【特別加盟店マイページ】
 * 
 * 機能:
 * - 1次加盟店募集用URL・QRコード生成
 * - 1次加盟店一覧・管理
 * - インセンティブダッシュボード（¥1,000/件）
 * - 売上統計・レポート
 * - 製品購入・注文履歴
 */

const COMPANY_NAME = "CRYSTALIZE事業";

// モックデータ（実際はFirestoreから取得）
const mockUser = {
  id: "special001",
  name: "山田太郎",
  company: "株式会社adtown",
  email: "yamada@adtown.com",
  role: "special",
  joinedDate: "2026-01-15",
};

const mockPrimaryFranchises = [
  { id: "p001", name: "鈴木建設", owner: "鈴木一郎", joinedDate: "2026-02-01", secondaryCount: 5, status: "active" },
  { id: "p002", name: "田中工務店", owner: "田中花子", joinedDate: "2026-02-05", secondaryCount: 3, status: "active" },
  { id: "p003", name: "佐藤リフォーム", owner: "佐藤次郎", joinedDate: "2026-02-10", secondaryCount: 2, status: "active" },
];

const mockIncentives = [
  { month: "2026-02", primaryCount: 3, amount: 3000, status: "pending" },
  { month: "2026-01", primaryCount: 2, amount: 2000, status: "paid" },
];

const mockOrders = [
  { id: "ord001", date: "2026-02-10", product: "クリスタライズ", quantity: 15, amount: 165000, status: "shipped" },
  { id: "ord002", date: "2026-01-25", product: "クリスタライズ", quantity: 10, amount: 110000, status: "delivered" },
];

export default function SpecialFranchiseDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "recruitment" | "franchises" | "incentives" | "orders">("overview");
  const [showQR, setShowQR] = useState(false);

  const recruitmentUrl = `https://crystalize.com/primary?ref=${mockUser.id}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(recruitmentUrl)}`;

  return (
    <div className="dashboard-root">
      <Style />

      {/* ========== ヘッダー ========== */}
      <header className="dashboard-header">
        <div className="container header-content">
          <div className="logo">CRYSTALIZE</div>
          <div className="user-info">
            <span className="user-role">特別加盟店</span>
            <span className="user-name">{mockUser.name}</span>
            <button className="btn-logout">ログアウト</button>
          </div>
        </div>
      </header>

      {/* ========== サイドバー ========== */}
      <div className="dashboard-layout">
        <aside className="sidebar">
          <nav className="sidebar-nav">
            <button
              className={`nav-item ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              <span className="nav-icon">📊</span>
              <span>ダッシュボード</span>
            </button>
            <button
              className={`nav-item ${activeTab === "recruitment" ? "active" : ""}`}
              onClick={() => setActiveTab("recruitment")}
            >
              <span className="nav-icon">🎯</span>
              <span>募集ツール</span>
            </button>
            <button
              className={`nav-item ${activeTab === "franchises" ? "active" : ""}`}
              onClick={() => setActiveTab("franchises")}
            >
              <span className="nav-icon">👥</span>
              <span>1次加盟店管理</span>
            </button>
            <button
              className={`nav-item ${activeTab === "incentives" ? "active" : ""}`}
              onClick={() => setActiveTab("incentives")}
            >
              <span className="nav-icon">💰</span>
              <span>インセンティブ</span>
            </button>
            <button
              className={`nav-item ${activeTab === "orders" ? "active" : ""}`}
              onClick={() => setActiveTab("orders")}
            >
              <span className="nav-icon">📦</span>
              <span>注文履歴</span>
            </button>
          </nav>
        </aside>

        {/* ========== メインコンテンツ ========== */}
        <main className="main-content">
          {activeTab === "overview" && (
            <div className="content-section">
              <h1 className="page-title">ダッシュボード</h1>
              
              {/* 統計カード */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">👥</div>
                  <div className="stat-content">
                    <div className="stat-label">1次加盟店数</div>
                    <div className="stat-value">{mockPrimaryFranchises.length}</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🏢</div>
                  <div className="stat-content">
                    <div className="stat-label">2次加盟店数（合計）</div>
                    <div className="stat-value">{mockPrimaryFranchises.reduce((sum, f) => sum + f.secondaryCount, 0)}</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">💰</div>
                  <div className="stat-content">
                    <div className="stat-label">今月のインセンティブ</div>
                    <div className="stat-value">¥{mockIncentives[0].amount.toLocaleString()}</div>
                    <div className="stat-note">確定待ち</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📦</div>
                  <div className="stat-content">
                    <div className="stat-label">今月の注文数</div>
                    <div className="stat-value">{mockOrders.length}</div>
                  </div>
                </div>
              </div>

              {/* 最近の活動 */}
              <div className="activity-section">
                <h2 className="section-title">最近の活動</h2>
                <div className="activity-list">
                  <div className="activity-item">
                    <div className="activity-icon">✅</div>
                    <div className="activity-content">
                      <div className="activity-title">新規1次加盟店登録</div>
                      <div className="activity-desc">佐藤リフォーム様が登録されました</div>
                      <div className="activity-time">2026-02-10</div>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-icon">📦</div>
                    <div className="activity-content">
                      <div className="activity-title">注文発送完了</div>
                      <div className="activity-desc">注文 #ord001 が発送されました</div>
                      <div className="activity-time">2026-02-10</div>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-icon">✅</div>
                    <div className="activity-content">
                      <div className="activity-title">新規1次加盟店登録</div>
                      <div className="activity-desc">田中工務店様が登録されました</div>
                      <div className="activity-time">2026-02-05</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "recruitment" && (
            <div className="content-section">
              <h1 className="page-title">1次加盟店募集ツール</h1>
              
              <div className="recruitment-tools">
                <div className="tool-card">
                  <h3>専用募集URL</h3>
                  <p className="tool-desc">このURLを共有して1次加盟店を募集できます</p>
                  <div className="url-box">
                    <input type="text" value={recruitmentUrl} readOnly className="url-input" />
                    <button className="btn-copy" onClick={() => navigator.clipboard.writeText(recruitmentUrl)}>
                      📋 コピー
                    </button>
                  </div>
                  <div className="share-buttons">
                    <button className="btn-share">📧 メールで共有</button>
                    <button className="btn-share">💬 LINEで共有</button>
                    <button className="btn-share">🐦 Twitterで共有</button>
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

                <div className="tool-card">
                  <h3>募集実績</h3>
                  <div className="recruitment-stats">
                    <div className="recruitment-stat">
                      <div className="recruitment-stat-label">URL クリック数</div>
                      <div className="recruitment-stat-value">24</div>
                    </div>
                    <div className="recruitment-stat">
                      <div className="recruitment-stat-label">登録完了数</div>
                      <div className="recruitment-stat-value">3</div>
                    </div>
                    <div className="recruitment-stat">
                      <div className="recruitment-stat-label">コンバージョン率</div>
                      <div className="recruitment-stat-value">12.5%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "franchises" && (
            <div className="content-section">
              <h1 className="page-title">1次加盟店管理</h1>
              
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>会社名</th>
                      <th>担当者</th>
                      <th>登録日</th>
                      <th>2次加盟店数</th>
                      <th>ステータス</th>
                      <th>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockPrimaryFranchises.map((franchise) => (
                      <tr key={franchise.id}>
                        <td>{franchise.name}</td>
                        <td>{franchise.owner}</td>
                        <td>{franchise.joinedDate}</td>
                        <td>{franchise.secondaryCount}</td>
                        <td>
                          <span className="status-badge active">アクティブ</span>
                        </td>
                        <td>
                          <button className="btn-action">詳細</button>
                        </td>
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
                <div className="summary-card">
                  <h3>今月の見込み</h3>
                  <div className="summary-amount">¥{mockIncentives[0].amount.toLocaleString()}</div>
                  <div className="summary-detail">1次加盟店 {mockIncentives[0].primaryCount}件 × ¥1,000</div>
                  <div className="summary-note">※月末締め、翌月10日振込予定</div>
                </div>
              </div>

              <h2 className="section-title">インセンティブ履歴</h2>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>対象月</th>
                      <th>1次加盟店数</th>
                      <th>金額</th>
                      <th>ステータス</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockIncentives.map((incentive) => (
                      <tr key={incentive.month}>
                        <td>{incentive.month}</td>
                        <td>{incentive.primaryCount}件</td>
                        <td>¥{incentive.amount.toLocaleString()}</td>
                        <td>
                          <span className={`status-badge ${incentive.status}`}>
                            {incentive.status === "paid" ? "支払済" : "確定待ち"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="content-section">
              <h1 className="page-title">注文履歴</h1>
              
              <div className="order-actions">
                <button className="btn-primary">🛒 新規注文</button>
              </div>

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
                        <td>
                          <span className={`status-badge ${order.status}`}>
                            {order.status === "shipped" ? "発送済" : "配送完了"}
                          </span>
                        </td>
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

/* ========== スタイル ========== */

function Style() {
  return (
    <style>{`
      * { margin: 0; padding: 0; box-sizing: border-box; }
      
      body {
        font-family: 'Noto Sans JP', 'Hiragino Sans', 'Meiryo', sans-serif;
        background: #f3f4f6;
        color: #111827;
        line-height: 1.6;
      }

      .dashboard-root {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
      }

      .container {
        max-width: 1400px;
        margin: 0 auto;
        padding: 0 24px;
      }

      /* ========== ヘッダー ========== */
      .dashboard-header {
        background: #ffffff;
        border-bottom: 1px solid #e5e7eb;
        padding: 16px 0;
        position: sticky;
        top: 0;
        z-index: 100;
      }

      .header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .logo {
        font-size: 24px;
        font-weight: 900;
        color: #d97706;
      }

      .user-info {
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .user-role {
        background: rgba(217, 119, 6, 0.1);
        color: #d97706;
        padding: 6px 12px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 700;
      }

      .user-name {
        font-weight: 600;
        color: #374151;
      }

      .btn-logout {
        background: #f3f4f6;
        border: 1px solid #e5e7eb;
        color: #6b7280;
        padding: 8px 16px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
      }

      .btn-logout:hover {
        background: #e5e7eb;
        color: #374151;
      }

      /* ========== レイアウト ========== */
      .dashboard-layout {
        display: flex;
        flex: 1;
      }

      .sidebar {
        width: 260px;
        background: #ffffff;
        border-right: 1px solid #e5e7eb;
        padding: 24px 0;
      }

      .sidebar-nav {
        display: flex;
        flex-direction: column;
        gap: 4px;
        padding: 0 12px;
      }

      .nav-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        border: none;
        background: transparent;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        color: #6b7280;
        cursor: pointer;
        transition: all 0.2s;
        text-align: left;
      }

      .nav-item:hover {
        background: #f3f4f6;
        color: #374151;
      }

      .nav-item.active {
        background: rgba(217, 119, 6, 0.1);
        color: #d97706;
      }

      .nav-icon {
        font-size: 20px;
      }

      /* ========== メインコンテンツ ========== */
      .main-content {
        flex: 1;
        padding: 32px;
        overflow-y: auto;
      }

      .content-section {
        max-width: 1200px;
      }

      .page-title {
        font-size: 28px;
        font-weight: 900;
        color: #111827;
        margin-bottom: 24px;
      }

      .section-title {
        font-size: 20px;
        font-weight: 800;
        color: #111827;
        margin: 32px 0 16px;
      }

      /* ========== 統計カード ========== */
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        margin-bottom: 32px;
      }

      .stat-card {
        background: #ffffff;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        padding: 24px;
        display: flex;
        align-items: center;
        gap: 16px;
        transition: all 0.2s;
      }

      .stat-card:hover {
        border-color: #d97706;
        box-shadow: 0 4px 12px rgba(217, 119, 6, 0.1);
      }

      .stat-icon {
        font-size: 40px;
      }

      .stat-content {
        flex: 1;
      }

      .stat-label {
        font-size: 13px;
        color: #6b7280;
        font-weight: 600;
        margin-bottom: 4px;
      }

      .stat-value {
        font-size: 32px;
        font-weight: 900;
        color: #111827;
        line-height: 1;
      }

      .stat-note {
        font-size: 12px;
        color: #9ca3af;
        margin-top: 4px;
      }

      /* ========== 活動リスト ========== */
      .activity-section {
        background: #ffffff;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        padding: 24px;
      }

      .activity-list {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .activity-item {
        display: flex;
        gap: 16px;
        padding: 16px;
        background: #f9fafb;
        border-radius: 8px;
      }

      .activity-icon {
        font-size: 24px;
      }

      .activity-content {
        flex: 1;
      }

      .activity-title {
        font-size: 15px;
        font-weight: 700;
        color: #111827;
        margin-bottom: 4px;
      }

      .activity-desc {
        font-size: 14px;
        color: #6b7280;
        margin-bottom: 4px;
      }

      .activity-time {
        font-size: 12px;
        color: #9ca3af;
      }

      /* ========== 募集ツール ========== */
      .recruitment-tools {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 24px;
      }

      .tool-card {
        background: #ffffff;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        padding: 24px;
      }

      .tool-card h3 {
        font-size: 18px;
        font-weight: 800;
        color: #111827;
        margin-bottom: 8px;
      }

      .tool-desc {
        font-size: 14px;
        color: #6b7280;
        margin-bottom: 16px;
      }

      .url-box {
        display: flex;
        gap: 8px;
        margin-bottom: 16px;
      }

      .url-input {
        flex: 1;
        padding: 12px;
        border: 2px solid #e5e7eb;
        border-radius: 8px;
        font-size: 14px;
        font-family: monospace;
      }

      .btn-copy {
        background: #d97706;
        color: #ffffff;
        border: none;
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.2s;
      }

      .btn-copy:hover {
        background: #b45309;
      }

      .share-buttons {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }

      .btn-share {
        flex: 1;
        min-width: 120px;
        background: #f3f4f6;
        border: 1px solid #e5e7eb;
        color: #374151;
        padding: 10px 16px;
        border-radius: 8px;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
      }

      .btn-share:hover {
        background: #e5e7eb;
      }

      .qr-container {
        text-align: center;
        margin: 20px 0;
      }

      .qr-image {
        max-width: 200px;
        border: 2px solid #e5e7eb;
        border-radius: 8px;
      }

      .btn-download {
        width: 100%;
        background: #d97706;
        color: #ffffff;
        border: none;
        padding: 12px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.2s;
      }

      .btn-download:hover {
        background: #b45309;
      }

      .recruitment-stats {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
        margin-top: 16px;
      }

      .recruitment-stat {
        text-align: center;
        padding: 16px;
        background: #f9fafb;
        border-radius: 8px;
      }

      .recruitment-stat-label {
        font-size: 12px;
        color: #6b7280;
        margin-bottom: 8px;
      }

      .recruitment-stat-value {
        font-size: 24px;
        font-weight: 900;
        color: #d97706;
      }

      /* ========== テーブル ========== */
      .table-container {
        background: #ffffff;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        overflow: hidden;
      }

      .data-table {
        width: 100%;
        border-collapse: collapse;
      }

      .data-table thead {
        background: #f9fafb;
      }

      .data-table th {
        padding: 12px 16px;
        text-align: left;
        font-size: 13px;
        font-weight: 700;
        color: #6b7280;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .data-table td {
        padding: 16px;
        border-top: 1px solid #e5e7eb;
        font-size: 14px;
        color: #374151;
      }

      .status-badge {
        display: inline-block;
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 700;
      }

      .status-badge.active {
        background: rgba(16, 185, 129, 0.1);
        color: #059669;
      }

      .status-badge.paid {
        background: rgba(16, 185, 129, 0.1);
        color: #059669;
      }

      .status-badge.pending {
        background: rgba(251, 191, 36, 0.1);
        color: #d97706;
      }

      .status-badge.shipped {
        background: rgba(59, 130, 246, 0.1);
        color: #2563eb;
      }

      .status-badge.delivered {
        background: rgba(16, 185, 129, 0.1);
        color: #059669;
      }

      .btn-action {
        background: #f3f4f6;
        border: 1px solid #e5e7eb;
        color: #374151;
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
      }

      .btn-action:hover {
        background: #e5e7eb;
      }

      /* ========== インセンティブ ========== */
      .incentive-summary {
        margin-bottom: 32px;
      }

      .summary-card {
        background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
        color: #ffffff;
        border-radius: 12px;
        padding: 32px;
        text-align: center;
      }

      .summary-card h3 {
        font-size: 16px;
        font-weight: 700;
        margin-bottom: 16px;
        opacity: 0.9;
      }

      .summary-amount {
        font-size: 48px;
        font-weight: 900;
        margin-bottom: 12px;
      }

      .summary-detail {
        font-size: 16px;
        margin-bottom: 8px;
        opacity: 0.9;
      }

      .summary-note {
        font-size: 13px;
        opacity: 0.7;
      }

      /* ========== 注文 ========== */
      .order-actions {
        margin-bottom: 24px;
      }

      .btn-primary {
        background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
        color: #ffffff;
        border: none;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 15px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.2s;
      }

      .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(217, 119, 6, 0.3);
      }

      /* ========== レスポンシブ ========== */
      @media (max-width: 1024px) {
        .dashboard-layout {
          flex-direction: column;
        }

        .sidebar {
          width: 100%;
          border-right: none;
          border-bottom: 1px solid #e5e7eb;
        }

        .sidebar-nav {
          flex-direction: row;
          overflow-x: auto;
        }

        .nav-item {
          flex-shrink: 0;
        }
      }

      @media (max-width: 768px) {
        .main-content {
          padding: 16px;
        }

        .stats-grid {
          grid-template-columns: 1fr;
        }

        .recruitment-tools {
          grid-template-columns: 1fr;
        }

        .table-container {
          overflow-x: auto;
        }

        .data-table {
          min-width: 600px;
        }
      }
    `}</style>
  );
}
