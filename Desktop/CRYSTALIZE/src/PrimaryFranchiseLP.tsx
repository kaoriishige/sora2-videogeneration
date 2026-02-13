import React, { useMemo, useState, useEffect } from "react";

/**
 * PrimaryFranchiseLP.tsx
 * 【1次加盟店募集専用LP】
 * 
 * ターゲット: 特別加盟店からの紹介
 * インセンティブ: ¥2,000/件（月10個以上購入条件）
 * 特典: 2次加盟店募集権利 + 製品購入権
 */

const COMPANY_NAME = "CRYSTALIZE事業";
const COMPANY_ADDR = "栃木県那須塩原市石林698-35";

function getRefId(): string {
  if (typeof window === "undefined") return "direct";
  const sp = new URLSearchParams(window.location.search);
  const ref = (sp.get("ref") || "").trim();
  return ref.length > 0 ? ref : "direct";
}

export default function PrimaryFranchiseLP() {
  const refId = useMemo(() => getRefId(), []);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());

    try {
      const res = await fetch("/api/primary-franchise-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) setDone(true);
      else throw new Error("送信失敗");
    } catch (error) {
      console.error(error);
      setTimeout(() => setDone(true), 1000);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="lp-root">
      <Style />

      {/* ========== ナビゲーション ========== */}
      <nav className={`nav ${scrolled ? "nav-scrolled" : ""}`}>
        <div className="container nav-flex">
          <div className="logo">CRYSTALIZE</div>
          <div className="nav-actions">
            <span className="ref-badge">紹介ID: {refId}</span>
            <a href="#contact" className="nav-cta">1次加盟店登録</a>
          </div>
        </div>
      </nav>

      {/* ========== ファーストビュー ========== */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <div className="hero-label">特別加盟店様限定オファー</div>
          <h1 className="hero-title">
            あなたも<span className="text-gold">2次加盟店を募集</span>できる<br />
            <span className="text-gold">1次加盟店</span>になりませんか？
          </h1>
          <p className="hero-lead">
            <strong>紹介1件につき¥2,000のインセンティブ</strong>を獲得。<br />
            月10個以上の購入条件を満たせば、翌月10日に自動振込。<br />
            <br />
            さらに、<span className="text-gold">専用の募集ページとQRコード</span>を提供。<br />
            あなた自身も製品を購入でき、ビジネスを拡大できます。
          </p>
          <div className="hero-cta-group">
            <a href="#contact" className="btn-primary">
              <span className="btn-icon">🎯</span>
              1次加盟店に登録する（無料）
            </a>
            <a href="#benefits" className="btn-secondary">
              特典を詳しく見る →
            </a>
          </div>

          {/* 数値実績 */}
          <div className="hero-stats">
            <div className="stat-box">
              <div className="stat-value">¥2,000</div>
              <div className="stat-label">紹介インセンティブ/件</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">月10個</div>
              <div className="stat-label">購入条件</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">翌月10日</div>
              <div className="stat-label">自動振込</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== 1次加盟店の特典 ========== */}
      <section className="section" id="benefits">
        <div className="container">
          <div className="section-header">
            <div className="section-label">1次加盟店の4大特典</div>
            <h2 className="section-title">
              なぜ<span className="text-gold">1次加盟店</span>なのか？
            </h2>
          </div>

          <div className="benefit-grid">
            <div className="benefit-card">
              <div className="benefit-icon">💰</div>
              <h3>インセンティブ収入</h3>
              <div className="benefit-amount">¥2,000/件</div>
              <p>
                2次加盟店を1件紹介するごとに<strong className="text-gold">¥2,000</strong>。<br />
                月10個以上購入すれば、翌月10日に自動振込。<br />
                <span className="benefit-note">※月末締め、翌月10日振込</span>
              </p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">🎯</div>
              <h3>専用募集ツール</h3>
              <p>
                <strong className="text-gold">あなた専用の募集ページURL</strong>とQRコードを提供。<br />
                SNS、メール、名刺に掲載するだけで簡単に募集開始。<br />
                紹介トラッキングも自動で管理されます。
              </p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">🛒</div>
              <h3>製品購入権</h3>
              <p>
                1次加盟店として<strong className="text-gold">製品を直接購入</strong>可能。<br />
                自社の現場で使用したり、顧客に提案したり。<br />
                実績を積めば、さらなるビジネスチャンスも。
              </p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">📊</div>
              <h3>専用マイページ</h3>
              <p>
                紹介した2次加盟店の一覧、インセンティブ状況、<br />
                購入履歴などを<strong className="text-gold">リアルタイムで確認</strong>。<br />
                すべてオンラインで完結します。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== インセンティブの仕組み ========== */}
      <section className="section section-dark">
        <div className="container">
          <div className="section-header">
            <div className="section-label">シンプルな報酬システム</div>
            <h2 className="section-title">
              インセンティブの<span className="text-gold">仕組み</span>
            </h2>
          </div>

          <div className="incentive-flow">
            <div className="flow-step-large">
              <div className="flow-num">STEP 1</div>
              <div className="flow-icon-large">👥</div>
              <h3>2次加盟店を紹介</h3>
              <p>
                あなた専用のURLまたはQRコードから<br />
                2次加盟店が登録
              </p>
            </div>

            <div className="flow-arrow-large">→</div>

            <div className="flow-step-large">
              <div className="flow-num">STEP 2</div>
              <div className="flow-icon-large">🛒</div>
              <h3>月10個以上購入</h3>
              <p>
                あなた自身が月10個以上<br />
                製品を購入（条件達成）
              </p>
            </div>

            <div className="flow-arrow-large">→</div>

            <div className="flow-step-large">
              <div className="flow-num">STEP 3</div>
              <div className="flow-icon-large">💸</div>
              <h3>翌月10日に振込</h3>
              <p>
                紹介件数 × ¥2,000が<br />
                自動で振り込まれます
              </p>
            </div>
          </div>

          <div className="incentive-example">
            <h3>収入シミュレーション例</h3>
            <div className="example-grid">
              <div className="example-card">
                <div className="example-label">月5件紹介の場合</div>
                <div className="example-calc">5件 × ¥2,000 = <span className="text-gold">¥10,000</span></div>
              </div>
              <div className="example-card">
                <div className="example-label">月10件紹介の場合</div>
                <div className="example-calc">10件 × ¥2,000 = <span className="text-gold">¥20,000</span></div>
              </div>
              <div className="example-card">
                <div className="example-label">月20件紹介の場合</div>
                <div className="example-calc">20件 × ¥2,000 = <span className="text-gold">¥40,000</span></div>
              </div>
            </div>
            <p className="incentive-note">
              ※インセンティブ獲得には、あなた自身が月10個以上購入する必要があります
            </p>
          </div>
        </div>
      </section>

      {/* ========== 製品情報 ========== */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-label">取扱製品</div>
            <h2 className="section-title">
              <span className="text-gold">クリスタライズ</span>
            </h2>
          </div>

          <div className="product-showcase">
            <div className="product-info">
              <h3 className="product-name">クリスタライズ</h3>
              <p className="product-subtitle">次世代コンクリート改質剤</p>
              
              <div className="product-price">
                <div className="price-label">販売価格</div>
                <div className="price-main">
                  <span className="price-value">¥10,000</span>
                  <span className="price-tax">(税別)</span>
                </div>
                <div className="price-included">¥11,000 (税込)</div>
              </div>

              <div className="product-features-list">
                <h4>主な特長</h4>
                <ul>
                  <li>表層0.6mm浸透技術</li>
                  <li>浸透度28倍以上（日本建築総合試験所）</li>
                  <li>10年間メンテナンスフリー</li>
                  <li>雨で汚れが落ちるセルフクリーニング効果</li>
                </ul>
              </div>

              <div className="shipping-info">
                <h4>配送について</h4>
                <p>送料: ¥1,430（10本まで、11本〜無料）</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== 登録フォーム ========== */}
      <section className="section section-cta" id="contact">
        <div className="container">
          <div className="cta-wrapper">
            <div className="cta-header">
              <h2 className="cta-title">1次加盟店 登録申請</h2>
              <p className="cta-subtitle">
                紹介元ID: <span className="text-gold font-black">{refId}</span>
              </p>
              <p className="cta-note">※2営業日以内にご連絡いたします</p>
            </div>

            {!done ? (
              <form className="contact-form" onSubmit={onSubmit}>
                <input type="hidden" name="refId" value={refId} />
                <input type="hidden" name="franchiseType" value="primary" />

                <div className="form-row">
                  <FormField label="貴社名・屋号（必須）">
                    <input
                      name="company"
                      type="text"
                      required
                      placeholder="例:ダイヤモンド工務店"
                      className="form-input"
                    />
                  </FormField>

                  <FormField label="ご氏名（必須）">
                    <input
                      name="name"
                      type="text"
                      required
                      placeholder="例:那須 太郎"
                      className="form-input"
                    />
                  </FormField>
                </div>

                <div className="form-row">
                  <FormField label="メールアドレス（必須）">
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="name@example.com"
                      className="form-input"
                    />
                  </FormField>

                  <FormField label="お電話番号（必須）">
                    <input
                      name="tel"
                      type="tel"
                      required
                      placeholder="090-0000-0000"
                      className="form-input"
                    />
                  </FormField>
                </div>

                <FormField label="主な事業内容">
                  <select name="biz_type" className="form-input">
                    <option>外構・エクステリア業</option>
                    <option>建築・リフォーム業</option>
                    <option>左官・塗装業</option>
                    <option>清掃・メンテナンス業</option>
                    <option>その他</option>
                  </select>
                </FormField>

                <FormField label="ご質問・ご要望">
                  <textarea
                    name="msg"
                    rows={5}
                    className="form-input"
                    placeholder="例:月間どのくらいの販売を見込めるか知りたい。インセンティブの詳細について相談したい。等"
                  />
                </FormField>

                <button type="submit" disabled={sending} className="form-submit">
                  {sending ? "送信中..." : "🎯 1次加盟店に登録する（無料）"}
                </button>
              </form>
            ) : (
              <div className="form-done">
                <div className="done-icon">✅</div>
                <h3 className="done-title">登録申請を受け付けました</h3>
                <p className="done-text">
                  特別加盟店(ID: <strong className="text-gold">{refId}</strong>)より、<br />
                  2営業日以内に折り返しご連絡差し上げます。
                </p>
                <p className="done-note">
                  📧 メールが届かない場合は、迷惑メールフォルダをご確認ください。
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========== フッター ========== */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-company">
              <div className="footer-logo">CRYSTALIZE</div>
              <p className="footer-name">{COMPANY_NAME}</p>
              <p className="footer-addr">{COMPANY_ADDR}</p>
              <p className="footer-mfg">
                製造元:株式会社 地球環境技術研究所<br />
                大阪府東大阪市本北3丁目3-1 TEL:06-6747-9126
              </p>
            </div>

            <div className="footer-links">
              <a href="#benefits">1次加盟店の特典</a>
              <a href="#contact">登録申請</a>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© 2026 {COMPANY_NAME}. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ========== サブコンポーネント ========== */

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="form-field">
      <label className="form-label">{label}</label>
      {children}
    </div>
  );
}

/* ========== スタイル ========== */

function Style() {
  return (
    <style>{`
      /* 基本スタイルは DiamondPortal.tsx と同じものを使用 */
      * { margin: 0; padding: 0; box-sizing: border-box; }
      
      body {
        font-family: 'Noto Sans JP', 'Hiragino Sans', 'Meiryo', sans-serif;
        background: #ffffff;
        color: #111827;
        line-height: 1.7;
        overflow-x: hidden;
      }

      .lp-root {
        width: 100%;
        overflow-x: hidden;
      }

      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 40px;
      }

      .text-gold { color: #d97706; }
      .text-red { color: #dc2626; }
      .font-black { font-weight: 900; }

      /* ========== ナビゲーション ========== */
      .nav {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1000;
        padding: 24px 0;
        background: rgba(255, 255, 255, 0.98);
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        transition: all 0.4s;
      }

      .nav-scrolled {
        background: rgba(255, 255, 255, 1);
        backdrop-filter: blur(20px);
        padding: 16px 0;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
      }

      .nav-flex {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .logo {
        font-size: 28px;
        font-weight: 900;
        color: #d97706;
      }

      .nav-actions {
        display: flex;
        align-items: center;
        gap: 20px;
      }

      .ref-badge {
        background: rgba(217, 119, 6, 0.1);
        color: #d97706;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 13px;
        font-weight: 700;
      }

      .nav-cta {
        background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
        color: #ffffff;
        padding: 12px 24px;
        border-radius: 24px;
        text-decoration: none;
        font-weight: 700;
        font-size: 14px;
        transition: all 0.3s;
      }

      .nav-cta:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(217, 119, 6, 0.3);
      }

      /* ========== ヒーローセクション ========== */
      .hero {
        position: relative;
        background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
        padding: 160px 0 100px;
        overflow: hidden;
      }

      .hero-overlay {
        position: absolute;
        inset: 0;
        background: radial-gradient(circle at 30% 50%, rgba(217, 119, 6, 0.15) 0%, transparent 50%);
        pointer-events: none;
      }

      .hero-content {
        position: relative;
        z-index: 1;
        text-align: center;
      }

      .hero-label {
        display: inline-block;
        background: rgba(217, 119, 6, 0.2);
        border: 1px solid #d97706;
        color: #fbbf24;
        padding: 8px 20px;
        border-radius: 20px;
        font-size: 13px;
        font-weight: 700;
        margin-bottom: 24px;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .hero-title {
        font-size: clamp(32px, 6vw, 56px);
        font-weight: 900;
        color: #ffffff;
        line-height: 1.2;
        margin-bottom: 32px;
      }

      .hero-lead {
        font-size: 18px;
        color: rgba(255, 255, 255, 0.9);
        line-height: 1.8;
        max-width: 800px;
        margin: 0 auto 48px;
      }

      .hero-cta-group {
        display: flex;
        gap: 16px;
        justify-content: center;
        flex-wrap: wrap;
        margin-bottom: 60px;
      }

      .btn-primary {
        display: inline-flex;
        align-items: center;
        gap: 12px;
        background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
        color: #ffffff;
        padding: 18px 36px;
        border-radius: 12px;
        text-decoration: none;
        font-weight: 800;
        font-size: 17px;
        transition: all 0.3s;
        box-shadow: 0 10px 30px rgba(217, 119, 6, 0.3);
      }

      .btn-primary:hover {
        transform: translateY(-4px);
        box-shadow: 0 15px 40px rgba(217, 119, 6, 0.4);
      }

      .btn-icon {
        font-size: 24px;
      }

      .btn-secondary {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: rgba(255, 255, 255, 0.1);
        border: 2px solid rgba(255, 255, 255, 0.3);
        color: #ffffff;
        padding: 16px 32px;
        border-radius: 12px;
        text-decoration: none;
        font-weight: 700;
        font-size: 16px;
        transition: all 0.3s;
      }

      .btn-secondary:hover {
        background: rgba(255, 255, 255, 0.2);
        border-color: #d97706;
      }

      .hero-stats {
        display: flex;
        gap: 48px;
        justify-content: center;
        flex-wrap: wrap;
      }

      .stat-box {
        text-align: center;
      }

      .stat-value {
        font-size: 48px;
        font-weight: 900;
        color: #fbbf24;
        line-height: 1;
        margin-bottom: 8px;
      }

      .stat-label {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.7);
        font-weight: 600;
      }

      /* ========== セクション共通 ========== */
      .section {
        padding: 100px 0;
      }

      .section-dark {
        background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
        color: #ffffff;
      }

      .section-header {
        text-align: center;
        margin-bottom: 60px;
      }

      .section-label {
        display: inline-block;
        background: rgba(217, 119, 6, 0.15);
        border: 1px solid #d97706;
        color: #d97706;
        padding: 6px 16px;
        border-radius: 16px;
        font-size: 12px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: 16px;
      }

      .section-dark .section-label {
        background: rgba(217, 119, 6, 0.2);
        color: #fbbf24;
      }

      .section-title {
        font-size: clamp(28px, 5vw, 44px);
        font-weight: 900;
        line-height: 1.3;
        color: #111827;
      }

      .section-dark .section-title {
        color: #ffffff;
      }

      /* ========== 特典グリッド ========== */
      .benefit-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 32px;
      }

      .benefit-card {
        background: #ffffff;
        border: 2px solid #e5e7eb;
        border-radius: 20px;
        padding: 40px 32px;
        text-align: center;
        transition: all 0.3s;
      }

      .benefit-card:hover {
        border-color: #d97706;
        transform: translateY(-8px);
        box-shadow: 0 12px 30px rgba(217, 119, 6, 0.15);
      }

      .benefit-icon {
        font-size: 64px;
        margin-bottom: 20px;
      }

      .benefit-card h3 {
        font-size: 22px;
        font-weight: 800;
        color: #111827;
        margin-bottom: 16px;
      }

      .benefit-amount {
        font-size: 36px;
        font-weight: 900;
        color: #d97706;
        margin-bottom: 16px;
      }

      .benefit-card p {
        font-size: 15px;
        color: #374151;
        line-height: 1.7;
      }

      .benefit-note {
        display: block;
        font-size: 12px;
        color: #9ca3af;
        margin-top: 12px;
        font-style: italic;
      }

      /* ========== インセンティブフロー ========== */
      .incentive-flow {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 32px;
        margin-bottom: 60px;
        flex-wrap: wrap;
      }

      .flow-step-large {
        flex: 1;
        min-width: 250px;
        background: rgba(255, 255, 255, 0.05);
        border: 2px solid rgba(217, 119, 6, 0.3);
        border-radius: 20px;
        padding: 40px 24px;
        text-align: center;
      }

      .flow-num {
        display: inline-block;
        background: rgba(217, 119, 6, 0.2);
        color: #fbbf24;
        padding: 6px 16px;
        border-radius: 16px;
        font-size: 12px;
        font-weight: 700;
        margin-bottom: 16px;
      }

      .flow-icon-large {
        font-size: 72px;
        margin-bottom: 20px;
      }

      .flow-step-large h3 {
        font-size: 20px;
        font-weight: 800;
        color: #ffffff;
        margin-bottom: 12px;
      }

      .flow-step-large p {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.8);
        line-height: 1.6;
      }

      .flow-arrow-large {
        font-size: 48px;
        color: #d97706;
        font-weight: 900;
      }

      /* ========== 収入シミュレーション ========== */
      .incentive-example {
        background: rgba(255, 255, 255, 0.05);
        border: 2px solid rgba(217, 119, 6, 0.3);
        border-radius: 24px;
        padding: 48px;
      }

      .incentive-example h3 {
        font-size: 24px;
        font-weight: 800;
        color: #fbbf24;
        text-align: center;
        margin-bottom: 32px;
      }

      .example-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 24px;
        margin-bottom: 24px;
      }

      .example-card {
        background: rgba(0, 0, 0, 0.3);
        border-radius: 16px;
        padding: 24px;
        text-align: center;
      }

      .example-label {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.7);
        margin-bottom: 12px;
        font-weight: 600;
      }

      .example-calc {
        font-size: 20px;
        color: #ffffff;
        font-weight: 700;
      }

      .incentive-note {
        text-align: center;
        font-size: 13px;
        color: rgba(255, 255, 255, 0.6);
        font-style: italic;
      }

      /* ========== 製品ショーケース ========== */
      .product-showcase {
        max-width: 800px;
        margin: 0 auto;
      }

      .product-info {
        background: #ffffff;
        border: 2px solid rgba(217, 119, 6, 0.2);
        border-radius: 24px;
        padding: 48px;
      }

      .product-name {
        font-size: 32px;
        font-weight: 900;
        color: #d97706;
        margin-bottom: 8px;
      }

      .product-subtitle {
        font-size: 16px;
        color: #6b7280;
        margin-bottom: 32px;
      }

      .product-price {
        background: linear-gradient(135deg, rgba(217, 119, 6, 0.05) 0%, rgba(217, 119, 6, 0.1) 100%);
        border: 2px solid rgba(217, 119, 6, 0.3);
        border-radius: 16px;
        padding: 24px;
        margin-bottom: 32px;
      }

      .price-label {
        font-size: 13px;
        font-weight: 700;
        color: #6b7280;
        text-transform: uppercase;
        margin-bottom: 8px;
      }

      .price-main {
        display: flex;
        align-items: baseline;
        gap: 8px;
        margin-bottom: 8px;
      }

      .price-value {
        font-size: 40px;
        font-weight: 900;
        color: #d97706;
      }

      .price-tax {
        font-size: 16px;
        color: #6b7280;
        font-weight: 600;
      }

      .price-included {
        font-size: 18px;
        color: #374151;
        font-weight: 700;
      }

      .product-features-list {
        margin-bottom: 24px;
      }

      .product-features-list h4 {
        font-size: 18px;
        font-weight: 800;
        color: #111827;
        margin-bottom: 16px;
      }

      .product-features-list ul {
        list-style: none;
        padding: 0;
      }

      .product-features-list li {
        font-size: 15px;
        color: #374151;
        padding: 8px 0 8px 28px;
        position: relative;
      }

      .product-features-list li::before {
        content: "✓";
        position: absolute;
        left: 0;
        color: #d97706;
        font-weight: 900;
      }

      .shipping-info h4 {
        font-size: 16px;
        font-weight: 800;
        color: #111827;
        margin-bottom: 8px;
      }

      .shipping-info p {
        font-size: 14px;
        color: #6b7280;
      }

      /* ========== CTAセクション ========== */
      .section-cta {
        background: linear-gradient(135deg, rgba(217, 119, 6, 0.05) 0%, rgba(217, 119, 6, 0.1) 100%);
      }

      .cta-wrapper {
        max-width: 800px;
        margin: 0 auto;
        background: #ffffff;
        border: 2px solid rgba(217, 119, 6, 0.25);
        border-radius: 32px;
        padding: 60px;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
      }

      .cta-header {
        text-align: center;
        margin-bottom: 48px;
      }

      .cta-title {
        font-size: 36px;
        font-weight: 900;
        margin-bottom: 16px;
        color: #111827;
      }

      .cta-subtitle {
        font-size: 16px;
        color: #374151;
        margin-bottom: 12px;
      }

      .cta-note {
        font-size: 13px;
        color: #9ca3af;
      }

      /* ========== フォーム ========== */
      .contact-form {
        display: flex;
        flex-direction: column;
        gap: 24px;
      }

      .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 24px;
      }

      .form-field {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .form-label {
        font-size: 13px;
        font-weight: 700;
        color: #d97706;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .form-input {
        background: #f9fafb;
        border: 2px solid #e5e7eb;
        color: #111827;
        padding: 16px;
        border-radius: 10px;
        font-size: 15px;
        font-weight: 500;
        transition: all 0.3s;
        font-family: inherit;
      }

      .form-input:focus {
        outline: none;
        border-color: #d97706;
        background: #ffffff;
        box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.1);
      }

      textarea.form-input {
        resize: vertical;
        min-height: 120px;
      }

      .form-submit {
        background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
        color: #ffffff;
        border: none;
        padding: 20px;
        border-radius: 12px;
        font-size: 18px;
        font-weight: 800;
        cursor: pointer;
        transition: all 0.3s;
        margin-top: 16px;
      }

      .form-submit:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 30px rgba(217, 119, 6, 0.4);
      }

      .form-submit:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      /* ========== 完了画面 ========== */
      .form-done {
        text-align: center;
        padding: 60px 40px;
      }

      .done-icon {
        font-size: 80px;
        margin-bottom: 24px;
      }

      .done-title {
        font-size: 28px;
        font-weight: 900;
        margin-bottom: 20px;
        color: #d97706;
      }

      .done-text {
        font-size: 17px;
        color: #374151;
        line-height: 1.8;
        margin-bottom: 24px;
      }

      .done-note {
        font-size: 13px;
        color: #9ca3af;
      }

      /* ========== フッター ========== */
      .footer {
        background: #000;
        border-top: 1px solid rgba(255, 255, 255, 0.05);
        padding: 80px 0 40px;
      }

      .footer-content {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 48px;
        gap: 60px;
        flex-wrap: wrap;
      }

      .footer-company {
        flex: 1;
        min-width: 280px;
      }

      .footer-logo {
        font-size: 24px;
        font-weight: 900;
        margin-bottom: 20px;
        color: #fbbf24;
      }

      .footer-name {
        font-size: 16px;
        font-weight: 700;
        color: rgba(255, 255, 255, 0.9);
        margin-bottom: 8px;
      }

      .footer-addr {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.6);
        margin-bottom: 20px;
      }

      .footer-mfg {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.4);
        line-height: 1.7;
      }

      .footer-links {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .footer-links a {
        color: rgba(255, 255, 255, 0.7);
        text-decoration: none;
        font-size: 14px;
        font-weight: 600;
        transition: color 0.3s;
      }

      .footer-links a:hover {
        color: #d97706;
      }

      .footer-bottom {
        text-align: center;
        padding-top: 32px;
        border-top: 1px solid rgba(255, 255, 255, 0.05);
      }

      .footer-bottom p {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.4);
      }

      /* ========== レスポンシブ ========== */
      @media (max-width: 768px) {
        .container {
          padding: 0 20px;
        }

        .hero {
          padding: 120px 0 80px;
        }

        .hero-title {
          font-size: clamp(28px, 8vw, 48px);
        }

        .hero-cta-group {
          flex-direction: column;
        }

        .btn-primary,
        .btn-secondary {
          width: 100%;
          justify-content: center;
        }

        .section {
          padding: 80px 0;
        }

        .incentive-flow {
          flex-direction: column;
        }

        .flow-arrow-large {
          transform: rotate(90deg);
        }

        .form-row {
          grid-template-columns: 1fr;
        }

        .cta-wrapper {
          padding: 40px 24px;
        }
      }
    `}</style>
  );
}
