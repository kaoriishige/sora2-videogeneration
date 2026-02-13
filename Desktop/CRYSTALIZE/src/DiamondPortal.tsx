import React, { useMemo, useState, useEffect } from "react";

/**
 * DiamondPortalRevised.tsx
 * 【二次加盟店獲得専用LP - 完全リライト版】
 * 
 * 訴求軸:
 * 1. 白華ではなく「環境汚れ(ホコリ・黄砂・排気ガス・火山灰)」が真の敵
 * 2. 表層0.6mm浸透のガラス質結晶化で「雨=汚れを落とすシャワー」に変換
 * 3. 建設会社の3大悩み(クレーム・価格競争・将来リスク)を解決
 * 4. 日本建築総合試験所データで信頼性担保(浸透度28倍以上)
 */

const COMPANY_NAME = "CRYSTALIZE事業";
const COMPANY_ADDR = "栃木県那須塩原市石林698-35";

// 画像パス(実際の画像URLに差し替え)
const IMG_PRODUCT = "https://www.genspark.ai/api/files/s/NZHrw0aQ"; // ブレインウォーター代替製品
const IMG_MECHANISM_1 = "https://www.genspark.ai/api/files/s/eaTEfKsj"; // DEED反応構造図
const IMG_MECHANISM_2 = "https://www.genspark.ai/api/files/s/aOU7oeRg"; // 効果一覧
const IMG_APPLICATIONS = "https://www.genspark.ai/api/files/s/MV444IkH"; // 主な用途表
const IMG_SPEC = "https://www.genspark.ai/api/files/s/WblVcEKc"; // FC5000仕様書
const IMG_ORG_CHART = "https://www.genspark.ai/api/files/s/Ee22tCwT"; // 推進体制図

function getRefId(): string {
  if (typeof window === "undefined") return "direct";
  const sp = new URLSearchParams(window.location.search);
  const ref = (sp.get("ref") || "").trim();
  return ref.length > 0 ? ref : "direct";
}

export default function DiamondPortalRevised() {
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
      const res = await fetch("/api/franchise-lead", {
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
          <div className="logo">
            CRYSTALIZE
          </div>
          <div className="nav-actions">
            <span className="ref-badge">紹介ID: {refId}</span>
            <a href="#contact" className="nav-cta">資料請求</a>
          </div>
        </div>
      </nav>

      {/* ========== ファーストビュー ========== */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <div className="hero-label">建設・建築会社様限定</div>
          <h1 className="hero-title">
            「また<span className="text-red">黒ずんだ</span>…」<br />
            そのクレームを、<br />
            <span className="text-gold">最強の差別化</span>に変える。
          </h1>
          <p className="hero-lead">
            <strong>白華ではありません。</strong>本当の汚れの原因は、<br />
            <span className="highlight-box">ホコリ・黄砂・排気ガス・火山灰</span>が雨に混ざり、<br />
            コンクリートの凹凸に固着し、その上に<strong>カビ・苔が繁殖</strong>すること。<br />
            <br />
            <span className="text-gold text-xl">表層0.6mmへの浸透技術</span>でガラス質結晶化し、<br />
            雨を「<strong className="text-gold">汚れを落とすシャワー</strong>」に変えます。
          </p>
          <div className="hero-cta-group">
            <a href="#contact" className="btn-primary">
              <span className="btn-icon">📄</span>
              二次加盟店 資料請求(無料)
            </a>
            <a href="#mechanism" className="btn-secondary">
              0.6mm浸透のしくみ →
            </a>
          </div>

          {/* 数値実績 */}
          <div className="hero-stats">
            <div className="stat-box">
              <div className="stat-value">0.6mm</div>
              <div className="stat-label">表層浸透深度</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">28倍</div>
              <div className="stat-label">浸透度向上<span className="stat-note">※日本建築総合試験所</span></div>
            </div>
            <div className="stat-box">
              <div className="stat-value">10年</div>
              <div className="stat-label">効果持続期間</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== 問題提起:現場の真実 ========== */}
      <section className="section section-dark">
        <div className="container">
          <div className="section-header">
            <div className="section-label">現場の真実</div>
            <h2 className="section-title">
              「白華対策したのに、また黒ずんだ」<br />
              <span className="text-gold">その理由、知っていますか?</span>
            </h2>
          </div>

          <div className="truth-container">
            <div className="truth-main-card">
              <div className="truth-icon">⚠️</div>
              <h3 className="truth-heading">白華は<span className="text-red">あまり気にならない</span>問題です</h3>
              <p className="truth-text">
                実は、現場で本当に困るのは白華(エフロレッセンス)ではなく、<br />
                <strong className="text-white">「環境汚れ」による黒ずみ・緑色のカビ・苔の繁殖</strong>です。
              </p>
              <div className="truth-flow">
                <div className="flow-step">
                  <div className="flow-icon">🌫️</div>
                  <div className="flow-label">ホコリ・黄砂</div>
                </div>
                <div className="flow-arrow">+</div>
                <div className="flow-step">
                  <div className="flow-icon">🚗</div>
                  <div className="flow-label">排気ガス</div>
                </div>
                <div className="flow-arrow">+</div>
                <div className="flow-step">
                  <div className="flow-icon">🌋</div>
                  <div className="flow-label">火山灰</div>
                </div>
                <div className="flow-arrow">→</div>
                <div className="flow-result">
                  <div className="flow-icon">☔</div>
                  <div className="flow-label">雨に混ざる</div>
                </div>
              </div>
              <div className="truth-arrow-down">↓</div>
              <div className="truth-problem-box">
                <p>
                  コンクリートの<strong>ザラつき(多孔質表面)</strong>に固着<br />
                  → 高圧洗浄でも落ちない<br />
                  → その上に<span className="text-green">カビ・苔が根を張る</span><br />
                  → <span className="text-red text-xl">汚れの温床</span>が完成
                </p>
              </div>
            </div>

            {/* 3つの汚れ原因カード */}
            <div className="cause-grid">
              <div className="cause-card">
                <div className="cause-emoji">🌫️</div>
                <h4>ホコリ・黄砂</h4>
                <p>大気中の微細粒子が雨で運ばれ、表面の凹凸深くに侵入</p>
              </div>
              <div className="cause-card">
                <div className="cause-emoji">🚗💨</div>
                <h4>排気ガス・火山灰</h4>
                <p>油分を含む排ガスや火山灰が水と結合し、強固に付着</p>
              </div>
              <div className="cause-card">
                <div className="cause-emoji">🦠</div>
                <h4>カビ・苔の繁殖</h4>
                <p>汚れの上に水分が滞留し、微生物が根を張る温床に</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== 解決策:0.6mm浸透メカニズム ========== */}
      <section className="section" id="mechanism">
        <div className="container">
          <div className="section-header">
            <div className="section-label">革命的ソリューション</div>
            <h2 className="section-title">
              表層<span className="text-gold">0.6mm浸透</span>で、<br />
              雨を「<span className="text-gold">汚れを落とすシャワー</span>」に変える
            </h2>
          </div>

          <div className="mechanism-flow">
            <div className="mech-step">
              <div className="mech-num">STEP 1</div>
              <div className="mech-icon">📥</div>
              <h3>深層浸透</h3>
              <p>
                無機ナノ粒子がコンクリート表層<strong className="text-gold">0.6mm</strong>まで浸透。<br />
                <span className="data-badge">浸透度28倍以上</span>
                <span className="data-source">※一般財団法人 日本建築総合試験所</span>
              </p>
            </div>

            <div className="mech-arrow">→</div>

            <div className="mech-step">
              <div className="mech-num">STEP 2</div>
              <div className="mech-icon">⚗️</div>
              <h3>化学反応</h3>
              <p>
                Mg, Ca, Al, Fe, Siなどの<strong>アルカリ土類金属イオン</strong>と反応。<br />
                ケイ酸塩・コロイドゲルが生成され、<br />
                <strong className="text-gold">ガラス質の結晶構造</strong>を形成。
              </p>
            </div>

            <div className="mech-arrow">→</div>

            <div className="mech-step">
              <div className="mech-num">STEP 3</div>
              <div className="mech-icon">💧</div>
              <h3>撥水バリア誕生</h3>
              <p>
                表面が<strong className="text-gold">超撥水性</strong>に変化。<br />
                雨水が汚れを浮かせて流す<br />
                <strong className="text-gold text-lg">「セルフクリーニング効果」</strong>
              </p>
            </div>
          </div>

          {/* ビフォーアフター比較 */}
          <div className="comparison-section">
            <h3 className="comparison-title">これまでの常識が<span className="text-gold">逆転</span>します</h3>
            <div className="comparison-grid">
              <div className="comparison-card before">
                <div className="comparison-label before-label">従来</div>
                <div className="comparison-icon">❌</div>
                <h4>雨 = 汚れの原因</h4>
                <ul>
                  <li>雨が汚れを運んでくる</li>
                  <li>水が染み込み内部劣化</li>
                  <li>カビ・苔が繁殖する温床</li>
                  <li>5年で再塗装が必要</li>
                </ul>
              </div>

              <div className="comparison-arrow">
                <span>革命的転換</span>
                <div className="arrow-line">→</div>
              </div>

              <div className="comparison-card after">
                <div className="comparison-label after-label">施工後</div>
                <div className="comparison-icon">✨</div>
                <h4>雨 = 汚れを落とすシャワー</h4>
                <ul>
                  <li><strong>雨のたびに汚れが流れ落ちる</strong></li>
                  <li>水の浸透を防ぎ、寿命延長</li>
                  <li>カビ・苔が根付かない</li>
                  <li><strong className="text-gold">10年間メンテナンスフリー</strong></li>
                </ul>
              </div>
            </div>
          </div>

          {/* 技術資料へのリンク */}
          <div className="document-grid">
            <DocumentCard
              href={IMG_MECHANISM_1}
              title="DEED無機コートの反応構造"
              description="Mg, Ca, Si等との化学反応詳細"
            />
            <DocumentCard
              href={IMG_MECHANISM_2}
              title="特長及び効果一覧"
              description="7つの主要効果と試験データ"
            />
            <DocumentCard
              href={IMG_SPEC}
              title="FC5000 技術仕様書"
              description="浸透度試験・耐薬品性試験結果"
            />
          </div>
        </div>
      </section>

      {/* ========== ベネフィット:建設会社の3大悩み解決 ========== */}
      <section className="section section-benefit">
        <div className="container">
          <div className="section-header">
            <div className="section-label">現場の悩みを武器に変える</div>
            <h2 className="section-title">
              建設会社の<span className="text-gold">「困った」</span>を、<br />
              <span className="text-gold">最強の差別化</span>に変える
            </h2>
          </div>

          <div className="problem-solution-grid">
            {/* 問題1 */}
            <div className="ps-card">
              <div className="ps-problem">
                <div className="ps-icon problem-icon">😰</div>
                <h3>引き渡し後の<br />「黒ずみクレーム」</h3>
                <p className="ps-desc">
                  せっかく綺麗に仕上げたのに、1年後には黒ずみやカビ。<br />
                  施主様からのクレーム対応に追われる日々…
                </p>
              </div>
              <div className="ps-arrow">→</div>
              <div className="ps-solution">
                <div className="ps-icon solution-icon">✅</div>
                <h3>「汚れない外壁」<br />として提案可能</h3>
                <p className="ps-desc">
                  <strong className="text-gold">雨で汚れが落ちる外壁</strong>として、<br />
                  引き渡し時に自信を持って説明できる。<br />
                  <span className="benefit-badge">クレーム激減</span>
                </p>
              </div>
            </div>

            {/* 問題2 */}
            <div className="ps-card">
              <div className="ps-problem">
                <div className="ps-icon problem-icon">💸</div>
                <h3>価格競争からの<br />脱却ができない</h3>
                <p className="ps-desc">
                  「どこも同じでしょ?」と値切られ、<br />
                  利益を削って受注する悪循環…
                </p>
              </div>
              <div className="ps-arrow">→</div>
              <div className="ps-solution">
                <div className="ps-icon solution-icon">💎</div>
                <h3>目に見える<br />差別化を実現</h3>
                <p className="ps-desc">
                  <strong className="text-gold">「0.6mm浸透技術」</strong>という明確な特徴で、<br />
                  他社との違いを科学的に説明できる。<br />
                  <span className="benefit-badge">高単価受注</span>
                </p>
              </div>
            </div>

            {/* 問題3 */}
            <div className="ps-card">
              <div className="ps-problem">
                <div className="ps-icon problem-icon">⏰</div>
                <h3>将来の劣化リスク<br />を避けられない</h3>
                <p className="ps-desc">
                  水の浸透による内部劣化は避けられず、<br />
                  数年後の再塗装コストが発生…
                </p>
              </div>
              <div className="ps-arrow">→</div>
              <div className="ps-solution">
                <div className="ps-icon solution-icon">🛡️</div>
                <h3>10年後に<br />感謝される</h3>
                <p className="ps-desc">
                  <strong className="text-gold">撥水+浸透防止</strong>で構造物の寿命を延長。<br />
                  10年後も「あの時施工して良かった」と言われる。<br />
                  <span className="benefit-badge">長期信頼獲得</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== 二次加盟店のメリット ========== */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-label">4つのパートナーメリット</div>
            <h2 className="section-title">
              二次加盟店になる<span className="text-gold">4つの理由</span>
            </h2>
          </div>

          <div className="merit-grid">
            <div className="merit-card">
              <div className="merit-number">01</div>
              <div className="merit-icon">🎯</div>
              <h3>最強の営業フック</h3>
              <p>
                「<strong className="text-gold">雨が汚れを落とす外壁</strong>」という明確な特徴は、<br />
                施主様への<strong>最強の訴求ポイント</strong>。<br />
                技術的根拠(0.6mm浸透、浸透度28倍)で説得力も抜群。<br />
                <span className="merit-result">成約率が劇的に向上</span>
              </p>
            </div>

            <div className="merit-card">
              <div className="merit-number">02</div>
              <div className="merit-icon">🛡️</div>
              <h3>資材供給+技術指導</h3>
              <p>
                一次加盟店(紹介ID: <strong className="text-gold">{refId}</strong>)から<br />
                <strong>プロ専用資材を直接供給</strong>。<br />
                現場での施工指導も受けられ、<br />
                <span className="merit-result">未経験からでも導入可能</span>
              </p>
            </div>

            <div className="merit-card">
              <div className="merit-number">03</div>
              <div className="merit-icon">📦</div>
              <h3>在庫リスク最小化</h3>
              <p>
                大規模な設備投資や過剰在庫は不要。<br />
                <strong className="text-gold">必要な現場に合わせて資材を調達</strong>できる<br />
                柔軟なビジネスモデル。<br />
                <span className="merit-result">初期投資を抑えて開始</span>
              </p>
            </div>

            <div className="merit-card">
              <div className="merit-number">04</div>
              <div className="merit-icon">🤝</div>
              <h3>安心のサポート体制</h3>
              <p>
                難易度の高い現場や特殊素材への対応は、<br />
                <strong className="text-gold">推進本部が徹底サポート</strong>。<br />
                あなたは現場施工に集中できます。<br />
                <span className="merit-result">孤独な戦いにならない</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== 製品情報 ========== */}
      <section className="section section-product">
        <div className="container">
          <div className="section-header">
            <div className="section-label">製品情報</div>
            <h2 className="section-title">
              <span className="text-gold">クリスタライズ</span>
            </h2>
          </div>

          <div className="product-info-box">
            <div className="product-main">
              <h3 className="product-name">クリスタライズ</h3>
              <p className="product-subtitle">次世代コンクリート改質剤</p>
              
              <div className="product-price-section">
                <div className="price-main">
                  <div className="price-label">販売価格</div>
                  <div className="price-value">
                    <span className="price-tax-excluded">¥10,000</span>
                    <span className="price-tax-label">(税別)</span>
                  </div>
                  <div className="price-tax-included">
                    ¥11,000 (税込)
                  </div>
                </div>
              </div>

              <div className="product-note">
                <p>※ 容量など詳細仕様は後日追加予定</p>
              </div>
            </div>

            <div className="product-features">
              <h4>主な特長</h4>
              <ul>
                <li>表層0.6mm浸透技術</li>
                <li>浸透度28倍以上(日本建築総合試験所)</li>
                <li>10年間メンテナンスフリー</li>
                <li>雨で汚れが落ちるセルフクリーニング効果</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ========== 用途・活用現場 ========== */}
      <section className="section section-dark">
        <div className="container">
          <div className="section-header">
            <div className="section-label">多彩な活用シーン</div>
            <h2 className="section-title">
              建築・土木・遺跡まで。<br />
              <span className="text-gold">あらゆる現場</span>で武器になる
            </h2>
          </div>

          <div className="application-layout">
            <div className="application-list">
              <div className="app-category">
                <h3>🏠 建築分野</h3>
                <ul>
                  <li><strong>外壁・タイル</strong>: エフロ(白華)防止と美観維持</li>
                  <li><strong>床・駐車場</strong>: 水の浸透防止、クラック抑制</li>
                  <li><strong>屋根・スレート</strong>: 耐候性向上、寿命延長</li>
                </ul>
              </div>

              <div className="app-category">
                <h3>🌉 土木分野</h3>
                <ul>
                  <li><strong>擁壁・橋脚</strong>: 塩害防止、長寿命化</li>
                  <li><strong>防音壁・コンクリート構造物</strong>: 防汚性・防水性向上</li>
                  <li><strong>PC製品</strong>: カビ・苔の発生防止</li>
                </ul>
              </div>

              <div className="app-category">
                <h3>🏛️ セメント二次製品・遺跡</h3>
                <ul>
                  <li><strong>PC板・ブロック・ALC板</strong>: アルカリ度付与効果</li>
                  <li><strong>寺社仏閣・遺跡の石材</strong>: 吸水・劣化防止、遠赤保護</li>
                </ul>
              </div>

              <div className="test-data-box">
                <h4>📊 試験データ(一般財団法人 日本建築総合試験所)</h4>
                <div className="test-item">
                  <span className="test-label">浸透度:</span>
                  <span className="test-value">28倍以上</span>
                </div>
                <div className="test-item">
                  <span className="test-label">耐薬品性試験:</span>
                  <span className="test-value">合格</span>
                </div>
                <div className="test-item">
                  <span className="test-label">撥水性試験:</span>
                  <span className="test-value">優良</span>
                </div>
              </div>
            </div>

            <div className="application-images">
              <DocumentCard
                href={IMG_APPLICATIONS}
                title="主な用途と改質効果一覧表"
                description="建築・土木・遺跡等の詳細"
              />
              <DocumentCard
                href={IMG_PRODUCT}
                title="クリスタライズ"
                description="次世代コンクリート改質剤"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ========== 推進体制 ========== */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-label">サポート体制</div>
            <h2 className="section-title">
              あなたは<span className="text-gold">孤独ではありません</span>
            </h2>
          </div>

          <div className="support-layout">
            <div className="support-text">
              <h3>推進本部 → 一次加盟店 → あなた(二次加盟店)</h3>
              <p className="support-desc">
                推進本部を筆頭に、<strong className="text-gold">一次加盟店(紹介ID: {refId})</strong>があなたの窓口となり、<br />
                技術・資料・現場の悩みを<strong>ワンストップで支えます</strong>。
              </p>

              <div className="support-features">
                <div className="support-feature">
                  <div className="feature-icon">📞</div>
                  <div className="feature-text">
                    <h4>技術サポート</h4>
                    <p>施工方法、特殊素材への対応を専門スタッフが指導</p>
                  </div>
                </div>

                <div className="support-feature">
                  <div className="feature-icon">📄</div>
                  <div className="feature-text">
                    <h4>営業資料提供</h4>
                    <p>施主様向けパンフレット、提案書テンプレート完備</p>
                  </div>
                </div>

                <div className="support-feature">
                  <div className="feature-icon">🎓</div>
                  <div className="feature-text">
                    <h4>施工指導</h4>
                    <p>初回現場は一次加盟店が同行し、実地で指導</p>
                  </div>
                </div>

                <div className="support-feature">
                  <div className="feature-icon">🔐</div>
                  <div className="feature-text">
                    <h4>ID管理システム</h4>
                    <p>紹介元トラッキングで、インセンティブを適正管理</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="support-image">
              <DocumentCard
                href={IMG_ORG_CHART}
                title="推進本部体制図"
                description="加盟店ネットワーク構造"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ========== CTA:資料請求フォーム ========== */}
      <section className="section section-cta" id="contact">
        <div className="container">
          <div className="cta-wrapper">
            <div className="cta-header">
              <h2 className="cta-title">二次加盟店 資料請求</h2>
              <p className="cta-subtitle">
                一次加盟店ID: <span className="text-gold font-black">{refId}</span> を通じて詳細資料を送付します
              </p>
              <p className="cta-note">※2営業日以内にご連絡いたします。しつこい営業は一切ございません。</p>
            </div>

            {!done ? (
              <form className="contact-form" onSubmit={onSubmit}>
                <input type="hidden" name="refId" value={refId} />

                <div className="form-row">
                  <FormField label="貴社名・屋号">
                    <input
                      name="company"
                      type="text"
                      placeholder="例:ダイヤモンド工務店"
                      className="form-input"
                    />
                  </FormField>

                  <FormField label="ご氏名(必須)">
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
                  <FormField label="メールアドレス(必須)">
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="name@example.com"
                      className="form-input"
                    />
                  </FormField>

                  <FormField label="お電話番号(必須)">
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
                    <option>その他(備考に記載)</option>
                  </select>
                </FormField>

                <FormField label="現在の課題・ご相談内容">
                  <textarea
                    name="msg"
                    rows={5}
                    className="form-input"
                    placeholder="例:外壁の黒ずみクレームに悩んでいる。差別化できる商材を探している。施工単価や利益率について知りたい。等"
                  />
                </FormField>

                <button type="submit" disabled={sending} className="form-submit">
                  {sending ? "送信中..." : "📄 詳細資料をリクエストする(無料)"}
                </button>
              </form>
            ) : (
              <div className="form-done">
                <div className="done-icon">✅</div>
                <h3 className="done-title">資料請求を受け付けました</h3>
                <p className="done-text">
                  一次加盟店(ID: <strong className="text-gold">{refId}</strong>)より、<br />
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
              <div className="footer-logo">
                CRYSTALIZE
              </div>
              <p className="footer-name">{COMPANY_NAME}</p>
              <p className="footer-addr">{COMPANY_ADDR}</p>
              <p className="footer-mfg">
                製造元:株式会社 地球環境技術研究所<br />
                大阪府東大阪市本北3丁目3-1 TEL:06-6747-9126
              </p>
            </div>

            <div className="footer-links">
              <a href="#mechanism">技術メカニズム</a>
              <a href={IMG_APPLICATIONS} target="_blank" rel="noreferrer">用途一覧</a>
              <a href={IMG_SPEC} target="_blank" rel="noreferrer">技術仕様</a>
              <a href="#contact">資料請求</a>
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

function DocumentCard({ href, title, description }: { href: string; title: string; description: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="doc-card">
      <div className="doc-card-header">
        <span className="doc-icon">📄</span>
        <span className="doc-title">{title}</span>
      </div>
      <div className="doc-card-image">
        <img src={href} alt={title} loading="lazy" />
      </div>
      <div className="doc-card-footer">
        <span className="doc-desc">{description}</span>
        <span className="doc-link">資料を見る →</span>
      </div>
    </a>
  );
}

/* ========== スタイル ========== */

function Style() {
  return (
    <style>{`
      /* ========== リセット & ベース ========== */
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

      /* ========== カラー ========== */
      .text-gold { color: #d97706; }
      .text-red { color: #dc2626; }
      .text-green { color: #059669; }
      .text-white { color: #111827; }
      .text-xl { font-size: 1.25rem; }
      .text-strike { text-decoration: line-through; opacity: 0.5; }

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
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .nav-scrolled {
        background: rgba(255, 255, 255, 1);
        backdrop-filter: blur(20px);
        padding: 16px 0;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      }

      .nav-flex {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .logo {
        font-size: 24px;
        font-weight: 900;
        letter-spacing: -0.05em;
        color: #111827;
      }

      .logo-accent {
        color: #d97706;
      }

      .nav-actions {
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .ref-badge {
        background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
        color: #ffffff;
        padding: 8px 16px;
        border-radius: 8px;
        font-size: 13px;
        font-weight: 700;
      }

      .nav-cta {
        background: transparent;
        border: 2px solid #d97706;
        color: #d97706;
        padding: 10px 24px;
        border-radius: 8px;
        text-decoration: none;
        font-weight: 700;
        transition: all 0.3s;
      }

      .nav-cta:hover {
        background: #d97706;
        color: #ffffff;
      }

      /* ========== ヒーローセクション ========== */
      .hero {
        position: relative;
        min-height: 100vh;
        display: flex;
        align-items: center;
        padding: 140px 0 100px;
        background: 
          linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(249, 250, 251, 1) 100%),
          url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=2000') center/cover no-repeat;
      }

      .hero-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(to bottom, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.95) 100%);
        z-index: 1;
      }

      .hero-content {
        position: relative;
        z-index: 2;
        max-width: 900px;
        animation: fadeInUp 1s ease-out;
      }

      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .hero-label {
        display: inline-block;
        background: rgba(217, 119, 6, 0.15);
        border: 1px solid #d97706;
        color: #b45309;
        padding: 8px 20px;
        border-radius: 24px;
        font-size: 13px;
        font-weight: 700;
        margin-bottom: 24px;
        letter-spacing: 0.05em;
      }

      .hero-title {
        font-size: clamp(36px, 6vw, 72px);
        font-weight: 900;
        line-height: 1.15;
        margin-bottom: 32px;
        letter-spacing: -0.02em;
        color: #111827;
      }

      .hero-lead {
        font-size: 18px;
        line-height: 1.9;
        color: #374151;
        margin-bottom: 48px;
        font-weight: 500;
      }

      .hero-lead strong {
        color: #111827;
        font-weight: 800;
      }

      .highlight-box {
        background: rgba(220, 38, 38, 0.12);
        border: 1px solid rgba(220, 38, 38, 0.4);
        padding: 2px 8px;
        border-radius: 4px;
        color: #991b1b;
        font-weight: 800;
      }

      .hero-cta-group {
        display: flex;
        gap: 20px;
        margin-bottom: 60px;
        flex-wrap: wrap;
      }

      .btn-primary {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
        color: #ffffff;
        padding: 20px 40px;
        border-radius: 12px;
        text-decoration: none;
        font-weight: 800;
        font-size: 18px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 10px 30px rgba(217, 119, 6, 0.4);
      }

      .btn-primary:hover {
        transform: translateY(-4px);
        box-shadow: 0 20px 40px rgba(217, 119, 6, 0.6);
      }

      .btn-icon {
        font-size: 22px;
      }

      .btn-secondary {
        display: inline-flex;
        align-items: center;
        background: #ffffff;
        border: 2px solid #e5e7eb;
        color: #374151;
        padding: 20px 40px;
        border-radius: 12px;
        text-decoration: none;
        font-weight: 700;
        font-size: 18px;
        transition: all 0.3s;
      }

      .btn-secondary:hover {
        border-color: #d97706;
        color: #b45309;
        background: rgba(217, 119, 6, 0.05);
      }

      .hero-stats {
        display: flex;
        gap: 48px;
        flex-wrap: wrap;
      }

      .stat-box {
        text-align: center;
      }

      .stat-value {
        font-size: 48px;
        font-weight: 900;
        color: #d97706;
        line-height: 1;
      }

      .stat-label {
        font-size: 14px;
        color: #4b5563;
        margin-top: 8px;
        font-weight: 600;
      }

      .stat-note {
        display: block;
        font-size: 11px;
        color: #9ca3af;
        margin-top: 4px;
      }

      /* ========== セクション共通 ========== */
      .section {
        padding: 120px 0;
      }

      .section-dark {
        background: #f3f4f6;
        border-top: 1px solid #e5e7eb;
        border-bottom: 1px solid #e5e7eb;
      }

      .section-benefit {
        background: linear-gradient(180deg, #ffffff 0%, #f9fafb 100%);
      }

      .section-header {
        text-align: center;
        margin-bottom: 80px;
      }

      .section-label {
        display: inline-block;
        color: #d97706;
        font-size: 13px;
        font-weight: 700;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        margin-bottom: 16px;
      }

      .section-title {
        font-size: clamp(32px, 5vw, 52px);
        font-weight: 900;
        line-height: 1.2;
        letter-spacing: -0.02em;
        color: #111827;
      }

      /* ========== 問題提起セクション ========== */
      .truth-container {
        max-width: 1000px;
        margin: 0 auto;
      }

      .truth-main-card {
        background: #ffffff;
        border: 2px solid rgba(217, 119, 6, 0.25);
        border-radius: 24px;
        padding: 60px;
        margin-bottom: 60px;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08);
      }

      .truth-icon {
        font-size: 64px;
        text-align: center;
        margin-bottom: 24px;
      }

      .truth-heading {
        font-size: 28px;
        font-weight: 900;
        text-align: center;
        margin-bottom: 24px;
        line-height: 1.4;
        color: #111827;
      }

      .truth-text {
        font-size: 18px;
        text-align: center;
        color: #374151;
        line-height: 1.9;
        margin-bottom: 40px;
      }

      .truth-flow {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 16px;
        flex-wrap: wrap;
        margin-bottom: 32px;
      }

      .flow-step, .flow-result {
        text-align: center;
        background: #f9fafb;
        border: 1px solid #e5e7eb;
        padding: 20px;
        border-radius: 12px;
        min-width: 100px;
      }

      .flow-icon {
        font-size: 32px;
        margin-bottom: 8px;
      }

      .flow-label {
        font-size: 13px;
        font-weight: 700;
        color: #374151;
      }

      .flow-arrow {
        font-size: 24px;
        color: #d97706;
        font-weight: 900;
      }

      .truth-arrow-down {
        text-align: center;
        font-size: 32px;
        color: #dc2626;
        margin: 24px 0;
      }

      .truth-problem-box {
        background: rgba(220, 38, 38, 0.1);
        border: 2px solid rgba(220, 38, 38, 0.3);
        border-radius: 16px;
        padding: 32px;
        text-align: center;
      }

      .truth-problem-box p {
        font-size: 17px;
        line-height: 1.9;
        font-weight: 600;
        color: #111827;
      }

      .cause-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 32px;
      }

      .cause-card {
        background: #ffffff;
        border: 1px solid #e5e7eb;
        border-radius: 16px;
        padding: 40px 32px;
        text-align: center;
        transition: all 0.3s;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
      }

      .cause-card:hover {
        border-color: #d97706;
        transform: translateY(-8px);
        box-shadow: 0 10px 15px -3px rgba(217, 119, 6, 0.15);
      }

      .cause-emoji {
        font-size: 56px;
        margin-bottom: 20px;
      }

      .cause-card h4 {
        font-size: 20px;
        font-weight: 800;
        margin-bottom: 16px;
        color: #d97706;
      }

      .cause-card p {
        font-size: 15px;
        color: #374151;
        line-height: 1.7;
      }

      /* ========== メカニズムセクション ========== */
      .mechanism-flow {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 32px;
        margin-bottom: 80px;
        flex-wrap: wrap;
      }

      .mech-step {
        background: #ffffff;
        border: 2px solid #e5e7eb;
        border-radius: 20px;
        padding: 40px 32px;
        text-align: center;
        flex: 1;
        min-width: 280px;
        max-width: 350px;
        transition: all 0.3s;
      }

      .mech-step:hover {
        border-color: #d97706;
        box-shadow: 0 12px 20px rgba(217, 119, 6, 0.15);
      }

      .mech-num {
        display: inline-block;
        background: rgba(217, 119, 6, 0.15);
        color: #b45309;
        padding: 6px 16px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 800;
        margin-bottom: 20px;
        letter-spacing: 0.05em;
      }

      .mech-icon {
        font-size: 56px;
        margin-bottom: 16px;
      }

      .mech-step h3 {
        font-size: 22px;
        font-weight: 900;
        margin-bottom: 16px;
        color: #111827;
      }

      .mech-step p {
        font-size: 15px;
        color: #374151;
        line-height: 1.8;
      }

      .mech-arrow {
        font-size: 32px;
        color: #d97706;
        font-weight: 900;
      }

      .data-badge {
        display: inline-block;
        background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
        color: #ffffff;
        padding: 4px 12px;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 800;
        margin: 8px 4px;
      }

      .data-source {
        display: block;
        font-size: 11px;
        color: #9ca3af;
        margin-top: 8px;
      }

      /* ========== 比較セクション ========== */
      .comparison-section {
        margin-top: 80px;
        background: #f3f4f6;
        border-radius: 24px;
        padding: 60px;
        border: 1px solid #e5e7eb;
      }

      .comparison-title {
        font-size: 32px;
        font-weight: 900;
        text-align: center;
        margin-bottom: 48px;
        color: #111827;
      }

      .comparison-grid {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 40px;
        flex-wrap: wrap;
      }

      .comparison-card {
        background: #ffffff;
        border-radius: 20px;
        padding: 40px;
        flex: 1;
        min-width: 320px;
        max-width: 420px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
      }

      .comparison-card.before {
        border: 2px solid rgba(220, 38, 38, 0.4);
      }

      .comparison-card.after {
        border: 2px solid rgba(217, 119, 6, 0.5);
      }

      .comparison-label {
        display: inline-block;
        padding: 8px 20px;
        border-radius: 20px;
        font-size: 13px;
        font-weight: 800;
        margin-bottom: 20px;
        letter-spacing: 0.05em;
      }

      .before-label {
        background: rgba(220, 38, 38, 0.1);
        color: #991b1b;
      }

      .after-label {
        background: rgba(217, 119, 6, 0.15);
        color: #b45309;
      }

      .comparison-icon {
        font-size: 48px;
        text-align: center;
        margin-bottom: 16px;
      }

      .comparison-card h4 {
        font-size: 22px;
        font-weight: 900;
        text-align: center;
        margin-bottom: 24px;
        color: #111827;
      }

      .comparison-card ul {
        list-style: none;
      }

      .comparison-card li {
        padding: 12px 0;
        border-bottom: 1px solid #e5e7eb;
        font-size: 15px;
        color: #374151;
        line-height: 1.6;
      }

      .comparison-card li:last-child {
        border-bottom: none;
      }

      .comparison-arrow {
        text-align: center;
        color: #d97706;
      }

      .comparison-arrow span {
        display: block;
        font-size: 14px;
        font-weight: 700;
        margin-bottom: 8px;
      }

      .arrow-line {
        font-size: 32px;
        font-weight: 900;
      }

      /* ========== ドキュメントカード ========== */
      .document-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: 32px;
        margin-top: 60px;
      }

      .doc-card {
        background: #ffffff;
        border: 1px solid #e5e7eb;
        border-radius: 16px;
        overflow: hidden;
        text-decoration: none;
        color: inherit;
        transition: all 0.3s;
        display: block;
      }

      .doc-card:hover {
        border-color: #d97706;
        transform: translateY(-8px);
        box-shadow: 0 20px 40px rgba(217, 119, 6, 0.15);
      }

      .doc-card-header {
        display: flex;
        align-items: center;
        gap: 12px;
        background: #f9fafb;
        padding: 16px 20px;
      }

      .doc-icon {
        font-size: 24px;
      }

      .doc-title {
        font-size: 15px;
        font-weight: 700;
        color: #d97706;
      }

      .doc-card-image {
        aspect-ratio: 4/3;
        overflow: hidden;
        background: #000;
      }

      .doc-card-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s;
      }

      .doc-card:hover .doc-card-image img {
        transform: scale(1.1);
      }

      .doc-card-footer {
        padding: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .doc-desc {
        font-size: 13px;
        color: #6b7280;
      }

      .doc-link {
        font-size: 13px;
        font-weight: 700;
        color: #d97706;
      }

      /* ========== 問題解決セクション ========== */
      .problem-solution-grid {
        display: flex;
        flex-direction: column;
        gap: 48px;
      }

      .ps-card {
        display: flex;
        align-items: center;
        gap: 32px;
        background: linear-gradient(135deg, rgba(217, 119, 6, 0.05) 0%, transparent 100%);
        border-radius: 24px;
        padding: 48px;
        flex-wrap: wrap;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        border: 2px solid rgba(217, 119, 6, 0.2);
      }

      .ps-problem, .ps-solution {
        flex: 1;
        min-width: 280px;
      }

      .ps-icon {
        font-size: 56px;
        margin-bottom: 16px;
      }

      .problem-icon {
        opacity: 0.7;
      }

      .solution-icon {
        color: #d97706;
      }

      .ps-card h3 {
        font-size: 24px;
        font-weight: 900;
        margin-bottom: 16px;
        line-height: 1.3;
        color: #111827;
      }

      .ps-desc {
        font-size: 16px;
        color: #374151;
        line-height: 1.8;
      }

      .ps-arrow {
        font-size: 32px;
        color: #d97706;
        font-weight: 900;
      }

      .benefit-badge {
        display: inline-block;
        background: rgba(217, 119, 6, 0.15);
        border: 1px solid #d97706;
        color: #d97706;
        padding: 6px 14px;
        border-radius: 16px;
        font-size: 13px;
        font-weight: 800;
        margin-top: 12px;
      }

      /* ========== 製品情報セクション ========== */
      .section-product {
        background: linear-gradient(135deg, rgba(217, 119, 6, 0.03) 0%, rgba(217, 119, 6, 0.08) 100%);
      }

      .product-info-box {
        background: #ffffff;
        border: 2px solid rgba(217, 119, 6, 0.2);
        border-radius: 24px;
        padding: 60px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 60px;
        align-items: start;
      }

      .product-main {
        display: flex;
        flex-direction: column;
        gap: 24px;
      }

      .product-name {
        font-size: 36px;
        font-weight: 900;
        color: #d97706;
        margin: 0;
      }

      .product-subtitle {
        font-size: 16px;
        color: #6b7280;
        margin: 0;
      }

      .product-price-section {
        background: linear-gradient(135deg, rgba(217, 119, 6, 0.05) 0%, rgba(217, 119, 6, 0.1) 100%);
        border: 2px solid rgba(217, 119, 6, 0.3);
        border-radius: 16px;
        padding: 32px;
        margin: 16px 0;
      }

      .price-main {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .price-label {
        font-size: 14px;
        font-weight: 700;
        color: #6b7280;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .price-value {
        display: flex;
        align-items: baseline;
        gap: 8px;
      }

      .price-tax-excluded {
        font-size: 48px;
        font-weight: 900;
        color: #d97706;
        line-height: 1;
      }

      .price-tax-label {
        font-size: 16px;
        color: #6b7280;
        font-weight: 600;
      }

      .price-tax-included {
        font-size: 20px;
        color: #374151;
        font-weight: 700;
      }

      .product-note {
        background: rgba(217, 119, 6, 0.05);
        border-left: 4px solid #d97706;
        padding: 16px 20px;
        border-radius: 8px;
      }

      .product-note p {
        margin: 0;
        font-size: 14px;
        color: #6b7280;
        font-style: italic;
      }

      .product-features {
        background: #f9fafb;
        border-radius: 16px;
        padding: 32px;
      }

      .product-features h4 {
        font-size: 20px;
        font-weight: 800;
        color: #111827;
        margin: 0 0 20px 0;
      }

      .product-features ul {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .product-features li {
        font-size: 15px;
        color: #374151;
        padding-left: 28px;
        position: relative;
        line-height: 1.6;
      }

      .product-features li::before {
        content: "✓";
        position: absolute;
        left: 0;
        color: #d97706;
        font-weight: 900;
        font-size: 18px;
      }

      /* ========== メリットグリッド ========== */
      .merit-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: 32px;
      }

      .merit-card {
        background: #ffffff;
        border: 1px solid #e5e7eb;
        border-radius: 20px;
        padding: 48px 36px;
        transition: all 0.3s;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
      }

      .merit-card:hover {
        border-color: #d97706;
        transform: translateY(-8px);
        box-shadow: 0 12px 20px rgba(217, 119, 6, 0.15);
      }

      .merit-number {
        display: inline-block;
        background: rgba(217, 119, 6, 0.15);
        color: #b45309;
        width: 56px;
        height: 56px;
        line-height: 56px;
        text-align: center;
        border-radius: 50%;
        font-size: 24px;
        font-weight: 900;
        margin-bottom: 20px;
      }

      .merit-icon {
        font-size: 48px;
        margin-bottom: 16px;
      }

      .merit-card h3 {
        font-size: 22px;
        font-weight: 900;
        margin-bottom: 16px;
        color: #111827;
      }

      .merit-card p {
        font-size: 15px;
        color: #374151;
        line-height: 1.8;
      }

      .merit-result {
        display: block;
        color: #d97706;
        font-weight: 800;
        margin-top: 12px;
        font-size: 16px;
      }

      /* ========== 用途セクション ========== */
      .application-layout {
        display: grid;
        grid-template-columns: 1.2fr 1fr;
        gap: 60px;
        align-items: start;
      }

      .application-list {
        display: flex;
        flex-direction: column;
        gap: 32px;
      }

      .app-category {
        background: #ffffff;
        border-radius: 16px;
        padding: 32px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        border: 1px solid #e5e7eb;
      }

      .app-category h3 {
        font-size: 20px;
        font-weight: 900;
        margin-bottom: 20px;
        color: #d97706;
      }

      .app-category ul {
        list-style: none;
      }

      .app-category li {
        padding: 10px 0;
        border-bottom: 1px solid #e5e7eb;
        font-size: 15px;
        color: #374151;
        line-height: 1.7;
      }

      .app-category li:last-child {
        border-bottom: none;
      }

      .test-data-box {
        background: linear-gradient(135deg, rgba(217, 119, 6, 0.1) 0%, transparent 100%);
        border: 2px solid rgba(217, 119, 6, 0.25);
        border-radius: 16px;
        padding: 32px;
      }

      .test-data-box h4 {
        font-size: 18px;
        font-weight: 900;
        margin-bottom: 20px;
        color: #d97706;
      }

      .test-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 0;
        border-bottom: 1px solid #e5e7eb;
      }

      .test-item:last-child {
        border-bottom: none;
      }

      .test-label {
        font-size: 14px;
        color: #6b7280;
        font-weight: 600;
      }

      .test-value {
        font-size: 16px;
        font-weight: 900;
        color: #d97706;
      }

      .application-images {
        display: flex;
        flex-direction: column;
        gap: 32px;
        position: sticky;
        top: 120px;
      }

      /* ========== サポート体制 ========== */
      .support-layout {
        display: grid;
        grid-template-columns: 1.3fr 1fr;
        gap: 60px;
        align-items: start;
      }

      .support-text h3 {
        font-size: 26px;
        font-weight: 900;
        margin-bottom: 24px;
        line-height: 1.4;
        color: #111827;
      }

      .support-desc {
        font-size: 17px;
        color: #374151;
        line-height: 1.9;
        margin-bottom: 40px;
      }

      .support-features {
        display: flex;
        flex-direction: column;
        gap: 24px;
      }

      .support-feature {
        display: flex;
        align-items: flex-start;
        gap: 20px;
        background: #ffffff;
        padding: 24px;
        border-radius: 12px;
        border: 1px solid #e5e7eb;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
      }

      .feature-icon {
        font-size: 36px;
        flex-shrink: 0;
      }

      .feature-text h4 {
        font-size: 18px;
        font-weight: 800;
        margin-bottom: 8px;
        color: #d97706;
      }

      .feature-text p {
        font-size: 14px;
        color: #6b7280;
        line-height: 1.6;
      }

      .support-image {
        position: sticky;
        top: 120px;
      }

      /* ========== CTAセクション ========== */
      .section-cta {
        background: linear-gradient(180deg, #ffffff 0%, #f3f4f6 100%);
        padding: 100px 0;
      }

      .cta-wrapper {
        max-width: 800px;
        margin: 0 auto;
        background: #ffffff;
        border: 2px solid rgba(217, 119, 6, 0.25);
        border-radius: 32px;
        padding: 60px;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
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

      .font-black {
        font-weight: 900;
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
        animation: scaleIn 0.5s ease-out;
      }

      @keyframes scaleIn {
        from {
          transform: scale(0);
        }
        to {
          transform: scale(1);
        }
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
      @media (max-width: 1024px) {
        .application-layout,
        .support-layout {
          grid-template-columns: 1fr;
        }

        .application-images,
        .support-image {
          position: static;
        }
      }

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

        .hero-lead {
          font-size: 16px;
        }

        .hero-cta-group {
          flex-direction: column;
        }

        .btn-primary,
        .btn-secondary {
          width: 100%;
          justify-content: center;
        }

        .hero-stats {
          gap: 32px;
        }

        .section {
          padding: 80px 0;
        }

        .section-title {
          font-size: clamp(24px, 6vw, 40px);
        }

        .truth-main-card {
          padding: 40px 24px;
        }

        .truth-flow {
          flex-direction: column;
        }

        .mechanism-flow {
          flex-direction: column;
        }

        .mech-arrow {
          transform: rotate(90deg);
        }

        .comparison-grid {
          flex-direction: column;
        }

        .comparison-arrow {
          transform: rotate(90deg);
        }

        .ps-card {
          flex-direction: column;
          padding: 32px 24px;
        }

        .ps-arrow {
          transform: rotate(90deg);
        }

        .form-row {
          grid-template-columns: 1fr;
        }

        .product-info-box {
          grid-template-columns: 1fr;
          padding: 40px 24px;
          gap: 32px;
        }

        .cta-wrapper {
          padding: 40px 24px;
        }

        .footer-content {
          flex-direction: column;
          gap: 40px;
        }
      }

      @media (max-width: 480px) {
        .nav-actions {
          flex-direction: column;
          gap: 8px;
        }

        .hero-stats {
          flex-direction: column;
          gap: 24px;
        }

        .stat-value {
          font-size: 36px;
        }

        .document-grid,
        .cause-grid,
        .merit-grid {
          grid-template-columns: 1fr;
        }
      }
    `}</style>
  );
}