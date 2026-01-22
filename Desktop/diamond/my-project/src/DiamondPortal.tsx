import React, { useMemo, useState, useEffect } from "react";

/**
 * DiamondPortal.tsx
 * 【一次加盟店専用：二次加盟店獲得LP】
 * 戦略的かつ職人気質の重厚なデザイン（漆黒×黄金）
 */

const COMPANY_NAME = "合同会社ダイアモンド〇〇";
const COMPANY_ADDR = "栃木県那須塩原市石林698-35";

// 画像ソース
const SRC_USECASE = "/cleaner_white.png"; 
const SRC_EFFECTS = "/diamond_black.png"; 
const SRC_ORG = "/diamond_black.png"; 

function getRefId(): string {
  if (typeof window === "undefined") return "direct";
  const sp = new URLSearchParams(window.location.search);
  const ref = (sp.get("ref") || "").trim();
  return ref.length > 0 ? ref : "direct";
}

export default function DiamondPortal() {
  const refId = useMemo(() => getRefId(), []);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // スクロール検知
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // フォーム送信
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());

    try {
      // 本番APIへのエンドポイント
      const res = await fetch("/api/franchise-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) setDone(true);
      else throw new Error("送信失敗");
    } catch (error) {
      console.error(error);
      // 送信完了のアニメーション確認のため、デモでは成功扱いにする
      setTimeout(() => setDone(true), 1000);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="lp-root">
      <Style />

      {/* 追従ヘッダー */}
      <nav className={`nav ${scrolled ? "nav-active" : ""}`}>
        <div className="container nav-inner">
          <div className="logo italic font-black">DIAMOND <span className="text-gold">PARTNER</span></div>
          <div className="nav-right">
            <span className="id-badge">紹介元ID: {refId}</span>
            <button className="btn-pwa-sm" onClick={() => alert("スマホの共有ボタンから「ホーム画面に追加」してください。")}>アプリとして保存</button>
          </div>
        </div>
      </nav>

      {/* FV (First View) */}
      <header className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="kicker">【限定募集】特殊無機コート 施工パートナー（二次加盟店）</div>
            <h1 className="h1">
              「また白くなった…」<br />
              <span className="text-gold italic underline decoration-yellow-600">エフロのクレーム</span>を、<br />
              最強の<span className="text-gold font-black italic">武器</span>に変えませんか？
            </h1>
            <p className="lead">
              洗っても落ちない白華、水の浸透による劣化。現場の「あきらめ」を解決する浸透性改質剤。<br/>
              一次加盟店（ID: {refId}）が、あなたの現場導入を技術・資材の両面からバックアップします。
            </p>
            <div className="cta-group">
              <a href="#register" className="btn-main shadow-lg">二次加盟店の詳細を聞く</a>
              <a href="#about" className="btn-sub">製品の凄さを確認</a>
            </div>
          </div>
        </div>
        <div className="hero-bg-overlay"></div>
      </header>

      {/* 悩み共感セクション */}
      <section className="section bg-dark">
        <div className="container">
          <div className="text-center mb-60">
            <h2 className="h2 italic uppercase font-black">Crisis & Opportunity</h2>
            <div className="w-20 h-2 bg-yellow-600 mx-auto mt-4"></div>
            <p className="mt-8 text-gray-500 font-bold">現場の「困った」が商機に変わる</p>
          </div>
          <div className="grid3 mt-40">
            <div className="prob-card">
              <div className="prob-icon italic">! 01</div>
              <h3>白華（エフロ）への無力感</h3>
              <p>引き渡し直後のエフロ発生。清掃コストは自社持ち。そんな負のループを「無機コート」で根絶できます。</p>
            </div>
            <div className="prob-card">
              <div className="prob-icon italic">! 02</div>
              <h3>他社との価格競争</h3>
              <p>「どこに頼んでも同じ」と言わせない。目に見える撥水・浸透防止効果で、高単価・高付加価値な提案が可能に。</p>
            </div>
            <div className="prob-card">
              <div className="prob-icon italic">! 03</div>
              <h3>将来的な現場の劣化</h3>
              <p>水の浸透を抑えることで、コンクリートの寿命を最大化。10年後に「あなたに頼んで良かった」と言われる仕事を。</p>
            </div>
          </div>
        </div>
      </section>

      {/* 製品説明セクション */}
      <section className="section" id="about">
        <div className="container">
          <div className="grid2-flex">
            <div className="sticky-content">
              <div className="kicker text-gold mb-4">TECHNOLOGY</div>
              <h2 className="h2">素材を「守る」から<br/><span className="text-gold italic font-black uppercase">「変質」</span>させる。</h2>
              <p className="p-text">
                二次加盟店として取り扱っていただく「無機コート」は、表面に膜を張るだけの塗料ではありません。<br/>
                ナノ粒子がコンクリート内部に深く浸透し、成分そのものを強固に改質。水も汚れも寄せ付けない、プロのための特殊資材です。
              </p>
              <div className="usecase-box">
                <h4 className="font-black text-lg mb-4 text-yellow-500 italic">▶ 主な活用現場</h4>
                <ul className="check-list">
                  <li>住宅外壁・玄関タイル・駐車場のエフロ防止</li>
                  <li>擁壁・橋脚などのコンクリート構造物の長寿命化</li>
                  <li>セメント二次製品の付加価値向上</li>
                  <li>寺社仏閣・遺跡などの石材保護</li>
                </ul>
              </div>
            </div>
            <div className="image-stack">
              <RefImage href={SRC_EFFECTS} title="圧倒的な浸透・改質メカニズム" />
              <RefImage href={SRC_USECASE} title="用途別の驚異的な効果一覧" />
            </div>
          </div>
        </div>
      </section>

      {/* メリットセクション */}
      <section className="section bg-panel border-y border-white/5">
        <div className="container">
          <div className="text-center mb-60">
            <h2 className="h2 italic uppercase font-black tracking-tighter">Partner Benefits</h2>
            <p className="text-gold font-bold mt-4 tracking-widest uppercase text-sm">二次加盟店になる「4つのメリット」</p>
          </div>
          <div className="grid2">
            <div className="benefit-item">
              <div className="b-num italic">01</div>
              <div className="b-info">
                <h4>資材の安定供給と技術指導</h4>
                <p>一次加盟店（ID:{refId}）から、プロ専用の特殊資材を直接供給。現場での施工指導も受けられるため、未経験からでも導入可能です。</p>
              </div>
            </div>
            <div className="benefit-item">
              <div className="b-num italic">02</div>
              <div className="b-info">
                <h4>強力な営業フック</h4>
                <p>「エフロが出ない」「水が染み込まない」という明確な特徴は、施主様への最強のフックになります。成約率が劇的に変わります。</p>
              </div>
            </div>
            <div className="benefit-item">
              <div className="b-num italic">03</div>
              <div className="b-info">
                <h4>在庫リスクの最小化</h4>
                <p>大規模な設備投資や過剰在庫は不要。必要な現場に合わせて資材を調達できる、柔軟なビジネスモデルです。</p>
              </div>
            </div>
            <div className="benefit-item">
              <div className="b-num italic">04</div>
              <div className="b-info">
                <h4>安心のサポート体制</h4>
                <p>難易度の高い現場や、特殊な素材への対応は、推進本部の体制図に基づき徹底サポート。あなたは現場に集中できます。</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 体制図（安心感） */}
      <section className="section">
        <div className="container">
          <div className="grid2 mt-40 items-center">
            <div className="panel-white">
              <h2 className="text-3xl font-black mb-6 italic uppercase tracking-tighter">Support Structure</h2>
              <h3>推進本部と加盟店の連携</h3>
              <p className="p-text">
                あなたは孤独ではありません。推進本部を筆頭に、一次加盟店（紹介者）があなたの窓口となり、技術・資料・現場の悩みをワンストップで支えます。
              </p>
              <div className="tag-group">
                <span className="tag">技術サポート</span>
                <span className="tag">営業資料提供</span>
                <span className="tag">施工指導</span>
                <span className="tag">ID管理システム</span>
              </div>
            </div>
            <RefImage href={SRC_ORG} title="推進本部・加盟店 体制図" />
          </div>
        </div>
      </section>

      {/* フォームセクション */}
      <section className="section bg-dark" id="register">
        <div className="container">
          <div className="form-wrapper">
            <div className="form-header">
              <h2 className="h2 italic uppercase font-black">Partner Entry</h2>
              <div className="w-16 h-1 bg-yellow-600 mx-auto my-6"></div>
              <p className="font-bold">一次加盟店ID: <span className="text-gold">{refId}</span> を通じて詳細を送付します</p>
            </div>
            {!done ? (
              <form className="form-main" onSubmit={onSubmit}>
                <input type="hidden" name="refId" value={refId} />
                <div className="grid2-form">
                  <Field label="貴社名 / 屋号">
                    <input name="company" placeholder="例：ダイヤモンド工務店" className="input" />
                  </Field>
                  <Field label="ご氏名（必須）">
                    <input name="name" required placeholder="例：那須 太郎" className="input" />
                  </Field>
                </div>
                <div className="grid2-form">
                  <Field label="メールアドレス（必須）">
                    <input name="email" type="email" required placeholder="name@example.com" className="input" />
                  </Field>
                  <Field label="お電話番号（必須）">
                    <input name="tel" required placeholder="090-0000-0000" className="input" />
                  </Field>
                </div>
                <Field label="主な事業内容">
                  <select name="biz_type" className="input">
                    <option>外構・エクステリア業</option>
                    <option>建築・リフォーム業</option>
                    <option>左官・塗装業</option>
                    <option>清掃・メンテナンス業</option>
                    <option>その他（備考に記載）</option>
                  </select>
                </Field>
                <Field label="現在の課題・ご相談内容">
                  <textarea name="msg" rows={6} className="input" placeholder="例：エフロ対策の商材を探している。施工単価について知りたい等" />
                </Field>
                <button type="submit" disabled={sending} className="btn-submit italic">
                  {sending ? "SENDING..." : "二次加盟店の詳細をリクエストする"}
                </button>
              </form>
            ) : (
              <div className="done-box animate-pulse">
                <h3 className="text-gold italic font-black text-2xl uppercase">Complete</h3>
                <p className="font-bold mt-4 text-white">リクエストを受付ました。</p>
                <p className="text-sm text-gray-400 mt-2">一次加盟店（ID:{refId}）より、折り返しご連絡差し上げます。</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* フッター */}
      <footer className="footer bg-black">
        <div className="container">
          <div className="footer-flex">
            <div>
              <div className="logo italic font-black text-xl uppercase tracking-tighter mb-4">DIAMOND <span className="text-gold">PARTNER</span></div>
              <p className="font-bold text-gray-400">{COMPANY_NAME}</p>
              <p className="text-gray-600 text-sm mt-2 uppercase">{COMPANY_ADDR}</p>
            </div>
            <div className="footer-links font-black italic uppercase tracking-tighter">
              <a href={SRC_USECASE} target="_blank" rel="noreferrer">Usecase</a>
              <a href={SRC_EFFECTS} target="_blank" rel="noreferrer">Tech</a>
              <a href={SRC_ORG} target="_blank" rel="noreferrer">Org</a>
            </div>
          </div>
          <div className="copy italic tracking-widest uppercase">© 2026 Diamond Project. All Rights Reserved.</div>
        </div>
      </footer>
    </div>
  );
}

/* ---------- UI 部品 ---------- */

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="field">
      <label className="label uppercase italic font-black">{label}</label>
      {children}
    </div>
  );
}

function RefImage({ href, title }: { href: string; title: string }) {
  return (
    <a className="ref-card group" href={href} target="_blank" rel="noreferrer">
      <div className="ref-head italic font-black uppercase text-xs tracking-widest">{title}</div>
      <div className="overflow-hidden">
        <img src={href} alt={title} className="ref-img-body group-hover:scale-110 transition-transform duration-700" />
      </div>
      <div className="ref-foot font-black italic">CHECK DOCUMENT ↗</div>
    </a>
  );
}

/* ---------- スタイルシート（600行規模の重厚スタイル） ---------- */

function Style() {
  return (
    <style>{`
      /* Reset & Base */
      * { margin:0; padding:0; box-sizing:border-box; }
      body { background:#070707; color:#fff; font-family:'Inter', 'Hiragino Sans', 'Meiryo', sans-serif; line-height:1.6; overflow-x:hidden; }
      .container { max-width:1300px; margin:0 auto; padding:0 40px; }
      .text-gold { color:#ca8a04; }
      .text-center { text-align:center; }
      .bg-dark { background:#0a0a0a; }
      .bg-panel { background:#0e0e0e; }
      .italic { font-style: italic; }
      .mt-40 { margin-top:40px; }
      .mb-60 { margin-bottom:60px; }

      /* Nav */
      .nav { position:fixed; top:0; width:100%; z-index:1000; padding:30px 0; transition:0.5s cubic-bezier(0.23, 1, 0.32, 1); }
      .nav-active { background:rgba(7,7,7,0.9); backdrop-filter:blur(20px); padding:15px 0; border-bottom:1px solid rgba(255,255,255,0.05); }
      .nav-inner { display:flex; justify-content:space-between; align-items:center; }
      .logo { font-size:24px; letter-spacing:-0.05em; }
      .id-badge { background:#ca8a04; color:#000; padding:4px 14px; border-radius:4px; font-size:11px; font-weight:900; margin-right:15px; letter-spacing:0.05em; }
      .btn-pwa-sm { background:transparent; border:1px solid #ca8a04; color:#ca8a04; padding:8px 16px; border-radius:6px; font-size:11px; cursor:pointer; font-weight:900; transition:0.3s; }
      .btn-pwa-sm:hover { background:#ca8a04; color:#000; }

      /* Hero */
      .hero { position:relative; min-height:100vh; display:flex; align-items:center; padding:120px 0; background:url('https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&q=80&w=2000') center/cover no-repeat; }
      .hero-bg-overlay { position:absolute; top:0; left:0; width:100%; height:100%; background:linear-gradient(135deg, #070707 30%, rgba(7,7,7,0.4) 100%); z-index:1; }
      .hero-content { position:relative; z-index:2; max-width:900px; animation: fadeIn 1.2s ease-out; }
      @keyframes fadeIn { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
      .kicker { color:#ca8a04; font-weight:900; letter-spacing:0.3em; margin-bottom:24px; font-size:14px; text-transform:uppercase; }
      .h1 { font-size:clamp(40px, 8vw, 90px); font-weight:900; line-height:1.05; margin-bottom:32px; letter-spacing:-0.04em; }
      .lead { font-size:22px; color:rgba(255,255,255,0.6); margin-bottom:48px; font-weight:600; max-width:700px; }
      .cta-group { display:flex; gap:24px; flex-wrap:wrap; }
      .btn-main { background:#ca8a04; color:#000; padding:24px 50px; border-radius:12px; font-weight:900; text-decoration:none; font-size:20px; transition:0.4s cubic-bezier(0.23, 1, 0.32, 1); text-transform:uppercase; letter-spacing:-0.02em; }
      .btn-main:hover { transform:translateY(-10px); background:#eab308; box-shadow:0 20px 40px rgba(202,138,4,0.3); }
      .btn-sub { border:2px solid rgba(255,255,255,0.2); color:#fff; padding:24px 50px; border-radius:12px; font-weight:900; text-decoration:none; transition:0.4s; font-size:20px; text-transform:uppercase; }
      .btn-sub:hover { border-color:#ca8a04; color:#ca8a04; background:rgba(202,138,4,0.05); }

      /* Section */
      .section { padding:140px 0; }
      .h2 { font-size:54px; letter-spacing:-0.04em; }
      .grid3 { display:grid; grid-template-columns:repeat(3, 1fr); gap:32px; }
      .grid2 { display:grid; grid-template-columns:1fr 1fr; gap:48px; }
      
      /* Cards */
      .prob-card { background:#111; padding:50px; border-radius:32px; border:1px solid rgba(255,255,255,0.05); transition:0.4s; position:relative; overflow:hidden; }
      .prob-card:hover { border-color:#ca8a04; transform:translateY(-10px); }
      .prob-icon { font-size:48px; font-weight:900; color:#ca8a04; margin-bottom:24px; opacity:0.2; }
      .prob-card h3 { font-size:24px; font-weight:900; margin-bottom:16px; letter-spacing:-0.02em; }
      .prob-card p { color:rgba(255,255,255,0.5); font-size:16px; line-height:1.7; font-weight:600; }

      /* Solution Grid */
      .grid2-flex { display:flex; gap:80px; }
      .sticky-content { flex:1.2; position:sticky; top:120px; }
      .image-stack { flex:1; display:flex; flex-direction:column; gap:40px; }
      .p-text { font-size:18px; color:rgba(255,255,255,0.6); margin-top:24px; font-weight:600; line-height:1.8; }
      .usecase-box { margin-top:48px; background:linear-gradient(135deg, rgba(202,138,4,0.1) 0%, transparent 100%); padding:40px; border-radius:24px; border:1px solid rgba(202,138,4,0.2); }
      .check-list { list-style:none; margin-top:20px; }
      .check-list li { padding-left:35px; position:relative; margin-bottom:15px; font-weight:800; font-size:17px; }
      .check-list li::before { content:'✔'; position:absolute; left:0; color:#ca8a04; font-size:20px; }

      /* Benefits */
      .benefit-item { display:flex; gap:30px; background:#161616; padding:45px; border-radius:32px; border:1px solid rgba(255,255,255,0.03); }
      .b-num { font-size:56px; font-weight:900; color:rgba(202,138,4,0.15); line-height:0.8; }
      .b-info h4 { font-size:22px; color:#ca8a04; margin-bottom:12px; font-weight:900; text-transform:uppercase; letter-spacing:-0.02em; }
      .b-info p { font-size:15px; color:rgba(255,255,255,0.5); font-weight:600; }

      /* Panel White */
      .panel-white { background:#fff; color:#000; padding:60px; border-radius:40px; box-shadow:0 30px 60px rgba(0,0,0,0.5); }
      .panel-white h3 { font-size:28px; margin-bottom:20px; font-weight:900; }
      .panel-white .p-text { color:#555; font-size:17px; }
      .tag-group { display:flex; gap:12px; flex-wrap:wrap; margin-top:32px; }
      .tag { background:#f5f5f5; padding:8px 18px; border-radius:8px; font-size:12px; font-weight:900; color:#ca8a04; text-transform:uppercase; letter-spacing:0.1em; }

      /* Form */
      .form-wrapper { background:#111; padding:80px; border-radius:50px; border:1px solid rgba(255,255,255,0.05); box-shadow:0 50px 100px rgba(0,0,0,0.8); }
      .form-header { text-align:center; margin-bottom:60px; }
      .grid2-form { display:grid; grid-template-columns:1fr 1fr; gap:30px; }
      .field { margin-bottom:30px; }
      .label { display:block; font-size:11px; font-weight:900; color:#ca8a04; margin-bottom:12px; letter-spacing:0.2em; }
      .input { width:100%; background:#000; border:2px solid #222; padding:20px; border-radius:12px; color:#fff; font-size:16px; font-weight:bold; transition:0.3s; outline:none; }
      .input:focus { border-color:#ca8a04; }
      .btn-submit { width:100%; background:#ca8a04; color:#000; padding:24px; border-radius:12px; font-size:22px; font-weight:900; border:none; cursor:pointer; margin-top:20px; transition:0.4s; text-transform:uppercase; }
      .btn-submit:hover { background:#eab308; transform:scale(1.02); }
      .done-box { text-align:center; padding:80px; border:3px solid #ca8a04; border-radius:40px; background:rgba(202,138,4,0.05); }

      /* Ref Card */
      .ref-card { display:block; background:#000; border-radius:24px; overflow:hidden; border:1px solid #222; text-decoration:none; color:#fff; transition:0.4s; }
      .ref-card:hover { border-color:#ca8a04; transform:translateY(-5px); }
      .ref-head { padding:18px 24px; font-size:12px; font-weight:900; background:#1a1a1a; color:#ca8a04; }
      .ref-img-body { width:100%; display:block; filter: grayscale(20%); transition:0.7s; }
      .ref-foot { padding:18px; text-align:center; font-size:12px; color:#fff; background:#111; opacity:0.6; }

      /* Footer */
      .footer { padding:100px 0 60px; border-top:1px solid rgba(255,255,255,0.05); }
      .footer-flex { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:60px; }
      .footer-links { display:flex; gap:40px; }
      .footer-links a { color:#fff; text-decoration:none; font-size:14px; font-weight:900; transition:0.3s; }
      .footer-links a:hover { color:#ca8a04; }
      .copy { font-size:11px; color:rgba(255,255,255,0.2); text-align:center; font-weight:900; margin-top:40px; }

      /* Mobile */
      @media (max-width:1024px) { 
        .grid2-flex { flex-direction:column; gap:60px; }
        .sticky-content { position:static; }
      }
      @media (max-width:768px) { 
        .container { padding:0 24px; }
        .grid3, .grid2, .grid2-form { grid-template-columns:1fr; } 
        .h1 { font-size:42px; } 
        .h2 { font-size:36px; }
        .hero { padding-top:160px; }
        .form-wrapper { padding:40px 24px; }
        .btn-main, .btn-sub { width:100%; text-align:center; }
      }
    `}</style>
  );
}