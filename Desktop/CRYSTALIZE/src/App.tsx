import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DiamondPortal from './DiamondPortal';
import PrimaryFranchiseLP from './PrimaryFranchiseLP';
import SpecialFranchiseDashboard from './SpecialFranchiseDashboard';
import PrimaryFranchiseDashboard from './PrimaryFranchiseDashboard';
import SecondaryFranchiseDashboard from './SecondaryFranchiseDashboard';

/**
 * CRYSTALIZE 公式受注・商談管理システム
 * --------------------------------------------------
 * 【修正内容】
 * - 未使用の useEffect を削除し、TypeScriptエラーを完全解消
 * - 商品構成：CRYSTALIZE（11,000円）＋ CRYSTALIZE（2,000円）
 * - 送料：本体11本以上で無料。洗浄剤は別途加算。
 * - デザイン：漆黒と金、極太日本語によるプロ仕様UI
 * - フォーム：会社名、担当者、相談種別、詳細を網羅
 */

const DiamondMasterFinalSystem = () => {
  // --- 状態管理：商品の個数 ---
  const [crystallizeMainQty, setCrystallizeMainQty] = useState(1);
  const [crystallizeCleanerQty, setCrystallizeCleanerQty] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    company: '',
    name: '',
    email: '',
    phone: '',
    memo: '',
  });

  // --- 価格・送料設定（税込） ---
  const PRICE_CRYSTALIZE_MAIN = 11000; // CRYSTALIZE 本体
  const PRICE_CRYSTALIZE_CLEANER = 2000;    // CRYSTALIZE 洗浄剤
  const POSTAGE = 1430;        // 基本送料

  // --- 計算ロジック ---
  const crystallizeMainSubtotal = crystallizeMainQty * PRICE_CRYSTALIZE_MAIN;
  const isCrystallizeMainFreeShipping = crystallizeMainQty >= 11;
  const crystallizeMainShipping = (crystallizeMainQty > 0 && !isCrystallizeMainFreeShipping) ? POSTAGE : 0;

  const crystallizeCleanerSubtotal = crystallizeCleanerQty * PRICE_CRYSTALIZE_CLEANER;
  const crystallizeCleanerShipping = crystallizeCleanerQty > 0 ? POSTAGE : 0;

  const totalAmount = crystallizeMainSubtotal + crystallizeMainShipping + crystallizeCleanerSubtotal + crystallizeCleanerShipping;

  // --- フォーム送信処理 ---
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      crystallizeMainQty,
      crystallizeCleanerQty,
      crystallizeMainSubtotal,
      crystallizeMainShipping,
      crystallizeCleanerSubtotal,
      crystallizeCleanerShipping,
      totalAmount,
      ...formData,
    };

    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setIsSubmitted(true);
        // 成功メッセージの表示後、3秒後にリセット
        setTimeout(() => {
          setIsSubmitted(false);
          setCrystallizeMainQty(1);
          setCrystallizeCleanerQty(0);
          setFormData({ company: '', name: '', email: '', phone: '', memo: '' });
        }, 3000);
      } else {
        alert('注文の送信に失敗しました。もう一度お試しください。');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('エラーが発生しました。');
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans pb-40 selection:bg-yellow-600/30">

      {/* 配送重要通知（最上部固定） */}
      <div className="bg-red-700 text-white py-4 px-4 text-center text-sm md:text-base font-black tracking-widest shadow-2xl sticky top-0 z-50">
        【配送通知】CRYSTALIZE 11本以上のご注文は、送料無料（弊社負担）にてお届けいたします。
      </div>

      {/* ヒーローヘッダー */}
      <header className="relative pt-32 pb-24 text-center bg-gradient-to-b from-gray-50 to-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6">
          <h1 className="text-7xl md:text-9xl font-black mb-8 tracking-tighter italic text-gray-900 drop-shadow-xl uppercase">
            CRYSTALIZE
          </h1>
          <p className="text-yellow-500 text-xl md:text-3xl font-bold tracking-[0.5em] mb-12">
            究極の無機質浸透改質剤
          </p>
          <div className="w-48 h-2 bg-yellow-600 mx-auto shadow-[0_0_30px_rgba(202,138,4,1)]"></div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-20">

        {/* 技術・導入メリット解説セクション（両方表示） */}
        <section className="mb-40">
          {/* 独自技術の証明 */}
          <div className="mb-20">
            <h2 className="text-5xl font-black italic mb-16 border-b-8 border-yellow-600 pb-6 inline-block tracking-tighter uppercase">独自技術の証明</h2>
            <div className="grid md:grid-cols-2 gap-10">
              <div className="bg-[#0a0a0a] p-12 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-3 h-full bg-yellow-600"></div>
                <h3 className="text-2xl font-black mb-8 text-white flex items-center">
                  <span className="w-8 h-8 rounded-full bg-yellow-600 text-black text-xs flex items-center justify-center mr-4">01</span>
                  深層浸透・結晶化理論
                </h3>
                <p className="text-gray-400 leading-[2.2] text-lg font-medium">
                  CRYSTALIZEは、従来の表面被膜型とは一線を画します。ナノサイズの粒子がコンクリートの毛細管に28秒で浸透し、カルシウム成分と反応して「不溶性の結晶」を形成。躯体そのものを改質するため、物理的に剥離や浮きが発生不可能な状態を作り上げます。
                </p>
              </div>
              <div className="bg-[#0a0a0a] p-12 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-3 h-full bg-yellow-600"></div>
                <h3 className="text-2xl font-black mb-8 text-white flex items-center">
                  <span className="w-8 h-8 rounded-full bg-yellow-600 text-black text-xs flex items-center justify-center mr-4">02</span>
                  完全吸水遮断と透湿性
                </h3>
                <p className="text-gray-400 leading-[2.2] text-lg font-medium">
                  雨水の吸い込みを完璧にシャットアウト。鉄筋の酸化（サビ）を止める一方で、コンクリート内部の湿気は外へ逃がす「透湿性」を維持します。これにより、爆裂現象を未然に防ぎ、建物の構造寿命を劇的に延ばすことが実証されています。
                </p>
              </div>
            </div>
          </div>

          {/* 圧倒的な導入メリット */}
          <div>
            <h2 className="text-5xl font-black italic mb-16 border-b-8 border-yellow-600 pb-6 inline-block tracking-tighter uppercase">圧倒的な導入メリット</h2>
            <div className="bg-white p-16 rounded-[4rem] border border-gray-200 shadow-xl">
              <div className="grid md:grid-cols-3 gap-16">
                <div className="space-y-6">
                  <div className="text-4xl font-black text-yellow-600 italic">Fast.</div>
                  <h4 className="text-xl font-black">劇的な工期短縮</h4>
                  <p className="text-gray-500 text-sm leading-loose font-bold">
                    浸透スピードが極めて早く、施工後の乾燥時間も大幅に短縮。現場の回転率を飛躍的に高め、人件費コストを削減します。
                  </p>
                </div>
                <div className="space-y-6">
                  <div className="text-4xl font-black text-yellow-600 italic">Strong.</div>
                  <h4 className="text-xl font-black">驚異の耐薬品性</h4>
                  <p className="text-gray-500 text-sm leading-loose font-bold">
                    油、塩害、酸性雨に対して圧倒的な耐性を発揮。過酷な環境下にあるガソリンスタンドや湾岸施設の保護にも最適です。
                  </p>
                </div>
                <div className="space-y-6">
                  <div className="text-4xl font-black text-yellow-600 italic">Green.</div>
                  <h4 className="text-xl font-black">環境・人体への安全</h4>
                  <p className="text-gray-500 text-sm leading-loose font-bold">
                    完全無機質な素材をベースとしているため、有害なVOC（揮発性有機化合物）を含みません。室内施工も安心です。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 注文セクション（CRYSTALIZE (本体) ＆ CRYSTALIZE (洗浄剤)） */}
        <section className="mb-40">
          <h2 className="text-5xl font-black italic mb-20 border-b-8 border-yellow-600 pb-6 inline-block tracking-tighter uppercase">
            Product Order
          </h2>

          <div className="grid grid-cols-1 gap-16 mb-24">
            {/* 商品1：CRYSTALIZE (本体) */}
            <div className="bg-white rounded-[4rem] p-10 md:p-20 border border-gray-200 shadow-2xl flex flex-col lg:flex-row items-center gap-20 transition-all hover:border-yellow-600/40 group">
              <div className="w-full lg:w-1/2 relative">
                <div className="absolute -inset-4 bg-yellow-600/10 rounded-[3rem] blur-2xl group-hover:bg-yellow-600/20 transition"></div>
                <img src="/CRYSTALIZE.jpg" alt="CRYSTALIZE" className="relative w-full h-auto rounded-[2rem] shadow-2xl" />
              </div>
              <div className="w-full lg:w-1/2 space-y-10">
                <div className="space-y-2">
                  <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black italic tracking-tighter break-words">CRYSTALIZE</h3>
                  <p className="text-yellow-600 font-bold tracking-[0.3em] text-sm uppercase">Main Reform Agent</p>
                </div>
                <p className="text-6xl font-mono font-black text-gray-900">¥11,000 <span className="text-lg text-gray-500 font-sans">（税込）</span></p>
                <div className="bg-gray-50 p-10 rounded-[2.5rem] border border-gray-200 shadow-inner">
                  <label className="block text-xs font-black text-gray-500 mb-6 tracking-widest uppercase">注文本数（本）</label>
                  <div className="flex items-center justify-center gap-6">
                    <button
                      onClick={() => setCrystallizeMainQty(Math.max(0, crystallizeMainQty - 1))}
                      className="bg-yellow-600 hover:bg-yellow-700 text-black font-black text-3xl w-16 h-16 rounded-full transition shadow-lg active:scale-95 flex items-center justify-center"
                    >
                      ▼
                    </button>
                    <input
                      type="number" min="0" value={crystallizeMainQty}
                      onChange={(e) => setCrystallizeMainQty(Math.max(0, parseInt(e.target.value) || 0))}
                      className="bg-transparent border-b-4 border-yellow-600 text-7xl font-mono text-yellow-600 w-32 outline-none text-center focus:border-gray-400 transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <button
                      onClick={() => setCrystallizeMainQty(crystallizeMainQty + 1)}
                      className="bg-yellow-600 hover:bg-yellow-700 text-black font-black text-3xl w-16 h-16 rounded-full transition shadow-lg active:scale-95 flex items-center justify-center"
                    >
                      ▲
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm font-black px-4">
                  <span className="text-gray-500 italic">Shipping Group: A</span>
                  <span className={isCrystallizeMainFreeShipping ? "text-green-600" : "text-gray-900"}>
                    送料: {isCrystallizeMainFreeShipping ? "無料（11本以上）" : `¥${POSTAGE.toLocaleString()}`}
                  </span>
                </div>
              </div>
            </div>

            {/* 商品2：CRYSTALIZE (洗浄剤) */}
            <div className="bg-white rounded-[4rem] p-10 md:p-20 border border-gray-200 shadow-2xl flex flex-col lg:flex-row items-center gap-20 transition-all hover:border-blue-600/40 group">
              <div className="w-full lg:w-1/2 relative">
                <div className="absolute -inset-4 bg-blue-600/10 rounded-[3rem] blur-2xl group-hover:bg-blue-600/20 transition"></div>
                <img src="/CRYSTALIZE.jpg" alt="CRYSTALIZE" className="relative w-full h-auto rounded-[2rem] shadow-2xl" />
              </div>
              <div className="w-full lg:w-1/2 space-y-10">
                <div className="space-y-2">
                  <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black italic tracking-tighter text-gray-300 break-words">CRYSTALIZE</h3>
                  <p className="text-blue-500 font-bold tracking-[0.3em] text-sm uppercase">Pre-Treatment Cleaner</p>
                </div>
                <p className="text-6xl font-mono font-black text-gray-900">¥2,000 <span className="text-lg text-gray-500 font-sans">（税込）</span></p>
                <div className="bg-gray-50 p-10 rounded-[2.5rem] border border-gray-200 shadow-inner">
                  <label className="block text-xs font-black text-gray-500 mb-6 tracking-widest uppercase">注文本数（本）</label>
                  <div className="flex items-center justify-center gap-6">
                    <button
                      onClick={() => setCrystallizeCleanerQty(Math.max(0, crystallizeCleanerQty - 1))}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-black text-3xl w-16 h-16 rounded-full transition shadow-lg active:scale-95 flex items-center justify-center"
                    >
                      ▼
                    </button>
                    <input
                      type="number" min="0" value={crystallizeCleanerQty}
                      onChange={(e) => setCrystallizeCleanerQty(Math.max(0, parseInt(e.target.value) || 0))}
                      className="bg-transparent border-b-4 border-gray-300 text-7xl font-mono text-gray-900 w-32 outline-none text-center focus:border-blue-600 transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <button
                      onClick={() => setCrystallizeCleanerQty(crystallizeCleanerQty + 1)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-black text-3xl w-16 h-16 rounded-full transition shadow-lg active:scale-95 flex items-center justify-center"
                    >
                      ▲
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm font-black px-4">
                  <span className="text-gray-500 italic">Shipping Group: B</span>
                  <span className="text-gray-900 font-mono">送料: ¥{crystallizeCleanerShipping.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 注意事項 */}
          <div className="mt-16 max-w-3xl mx-auto bg-white border-2 border-yellow-600/30 p-10 md:p-16 rounded-[3rem] shadow-xl">
            <h3 className="text-2xl font-black mb-8 text-yellow-600 flex items-center">
              <span className="w-8 h-8 rounded-full bg-yellow-600 text-black text-xs flex items-center justify-center mr-4 font-bold">!</span>
              注意事項
            </h3>
            <ul className="space-y-6 text-gray-600 leading-loose font-medium">
              <li className="flex items-start gap-4">
                <span className="text-yellow-600 font-black text-lg flex-shrink-0">・</span>
                <span>CRYSTALIZEの送料は、10本までは1,430円、11本～は無料となります。</span>
              </li>
              <li className="flex items-start gap-4">
                <span className="text-yellow-600 font-black text-lg flex-shrink-0">・</span>
                <span>CRYSTALIZEは、販売元がCRYSTALIZEと異なるため、別途送料が発生します。</span>
              </li>
              <li className="flex items-start gap-4">
                <span className="text-yellow-600 font-black text-lg flex-shrink-0">・</span>
                <span>CRYSTALIZEの送料は、一律1,430円になります。</span>
              </li>
            </ul>
          </div>

          {/* 最終決済サマリー */}
          <div className="max-w-3xl mx-auto bg-white text-black p-8 md:p-24 rounded-3xl md:rounded-[5rem] shadow-2xl relative overflow-hidden border border-gray-100">
            <div className="absolute top-0 left-0 w-full h-2 md:h-4 bg-yellow-600"></div>
            <div className="space-y-6 md:space-y-10 font-black">
              <div className="flex justify-between border-b-2 border-gray-100 pb-4 md:pb-6 text-xs md:text-sm tracking-widest uppercase text-gray-400">
                <span>商品合計</span>
                <span>¥{(crystallizeMainSubtotal + crystallizeCleanerSubtotal).toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-b-2 border-gray-100 pb-4 md:pb-6 text-xs md:text-sm tracking-widest uppercase text-red-600">
                <span>送料合計</span>
                <span>¥{(crystallizeMainShipping + crystallizeCleanerShipping).toLocaleString()}</span>
              </div>
              <div className="flex flex-col md:flex-row md:justify-between md:items-end pt-6 md:pt-12 gap-4 md:gap-0">
                <span className="text-2xl md:text-3xl italic tracking-tighter">お支払総額</span>
                <div className="text-right">
                  <span className="text-5xl md:text-8xl font-mono tracking-tighter underline decoration-[8px] md:decoration-[12px] decoration-yellow-600/30">
                    ¥{totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 購入申し込みフォーム */}
        <section className="bg-white p-6 md:p-24 rounded-3xl md:rounded-[5rem] border border-gray-200 shadow-xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-yellow-600/5 blur-[100px]"></div>

          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 md:mb-24">
              <h2 className="text-3xl md:text-5xl font-black italic mb-4 md:mb-8 tracking-tighter text-gray-900">購入申し込み</h2>
              <p className="text-gray-500 text-sm md:text-lg leading-relaxed font-bold max-w-2xl mx-auto">
                下記フォームに、ご購入情報とお客様情報をご入力ください。
              </p>
            </div>

            <form id="order-form" onSubmit={handleSubmit} className="space-y-8 md:space-y-12 font-black">
              {/* 購入商品情報 */}
              <div className="bg-[#111] p-6 md:p-16 rounded-2xl md:rounded-[3rem] border border-white/10">
                <h3 className="text-xl md:text-2xl font-black mb-6 md:mb-10 text-yellow-600">ご購入商品</h3>

                <div className="space-y-4 md:space-y-8">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center pb-4 md:pb-8 border-b border-white/10 gap-3">
                    <div>
                      <p className="text-white text-base md:text-lg mb-1 md:mb-2">CRYSTALIZE</p>
                      <p className="text-gray-500 text-xs md:text-sm">¥11,000 × {crystallizeMainQty}本</p>
                    </div>
                    <p className="text-xl md:text-2xl font-mono text-yellow-600 text-right">¥{crystallizeMainSubtotal.toLocaleString()}</p>
                  </div>

                  <div className="flex flex-col md:flex-row md:justify-between md:items-center pb-4 md:pb-8 border-b border-white/10 gap-3">
                    <div>
                      <p className="text-white text-base md:text-lg mb-1 md:mb-2">CRYSTALIZE</p>
                      <p className="text-gray-500 text-xs md:text-sm">¥2,000 × {crystallizeCleanerQty}本</p>
                    </div>
                    <p className="text-xl md:text-2xl font-mono text-gray-900 text-right">¥{crystallizeCleanerSubtotal.toLocaleString()}</p>
                  </div>

                  <div className="flex flex-col md:flex-row md:justify-between md:items-center pb-4 md:pb-8 border-b border-white/10 gap-3">
                    <p className="text-gray-900 text-sm md:text-base">送料計</p>
                    <p className="text-xl md:text-2xl font-mono text-red-600 text-right">¥{(crystallizeMainShipping + crystallizeCleanerShipping).toLocaleString()}</p>
                  </div>

                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 pt-2">
                    <p className="text-lg md:text-2xl font-black text-gray-900">お支払総額</p>
                    <p className="text-3xl md:text-4xl font-mono text-yellow-600 text-right">¥{totalAmount.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* お客様情報 */}
              <div className="bg-[#111] p-6 md:p-16 rounded-2xl md:rounded-[3rem] border border-white/10">
                <h3 className="text-xl md:text-2xl font-black mb-6 md:mb-10 text-yellow-600">お客様情報</h3>

                <div className="grid md:grid-cols-2 gap-6 md:gap-10 mb-6 md:mb-10">
                  <div className="space-y-2 md:space-y-4">
                    <label className="text-xs text-yellow-600 uppercase tracking-widest ml-2 md:ml-4">貴社名 / 屋号</label>
                    <input type="text" name="company" placeholder="株式会社 〇〇" value={formData.company} onChange={handleFormChange} className="w-full bg-white border border-gray-300 p-4 md:p-6 rounded-xl md:rounded-2xl outline-none focus:border-yellow-600 focus:bg-white transition-all text-gray-900 text-sm md:text-base" />
                  </div>
                  <div className="space-y-2 md:space-y-4">
                    <label className="text-xs text-yellow-600 uppercase tracking-widest ml-2 md:ml-4">ご担当者名（必須）</label>
                    <input type="text" name="name" placeholder="山田 太郎" value={formData.name} onChange={handleFormChange} className="w-full bg-white border border-gray-300 p-4 md:p-6 rounded-xl md:rounded-2xl outline-none focus:border-yellow-600 focus:bg-white transition-all text-gray-900 text-sm md:text-base" required />
                  </div>
                </div>

                <div className="space-y-2 md:space-y-4 mb-6 md:mb-10">
                  <label className="text-xs text-yellow-600 uppercase tracking-widest ml-2 md:ml-4">メールアドレス（必須）</label>
                  <input type="email" name="email" placeholder="contact@example.co.jp" value={formData.email} onChange={handleFormChange} className="w-full bg-white border border-gray-300 p-4 md:p-6 rounded-xl md:rounded-2xl outline-none focus:border-yellow-600 focus:bg-white transition-all text-gray-900 text-sm md:text-base" required />
                </div>

                <div className="space-y-2 md:space-y-4 mb-6 md:mb-10">
                  <label className="text-xs text-yellow-600 uppercase tracking-widest ml-2 md:ml-4">電話番号（必須）</label>
                  <input type="tel" name="phone" placeholder="03-XXXX-XXXX" value={formData.phone} onChange={handleFormChange} className="w-full bg-white border border-gray-300 p-4 md:p-6 rounded-xl md:rounded-2xl outline-none focus:border-yellow-600 focus:bg-white transition-all text-gray-900 text-sm md:text-base" required />
                </div>

                <div className="space-y-2 md:space-y-4">
                  <label className="text-xs text-yellow-600 uppercase tracking-widest ml-2 md:ml-4">ご質問・ご要望（任意）</label>
                  <textarea rows={5} name="memo" placeholder="ご不明な点やご要望がございましたら、こちらにご記入ください。" value={formData.memo} onChange={handleFormChange} className="w-full bg-white border border-gray-300 p-4 md:p-6 rounded-xl md:rounded-2xl outline-none focus:border-yellow-600 focus:bg-white transition-all text-gray-900 resize-none text-sm md:text-base"></textarea>
                </div>
              </div>

              {!isSubmitted ? (
                <button type="submit" className="w-full bg-black text-white font-black py-10 rounded-3xl text-2xl hover:bg-yellow-600 hover:text-black transition-all duration-500 shadow-2xl tracking-[0.4em] uppercase">
                  注文内容を確認・決済する
                </button>
              ) : (
                <div className="w-full bg-green-600/20 border-2 border-green-600 text-green-400 font-black py-10 rounded-3xl text-2xl text-center animate-pulse tracking-[0.2em] uppercase">
                  ✓ 注文を受け付けました
                </div>
              )}
            </form>
          </div>
        </section>
      </main>

      <footer className="py-40 text-center border-t border-gray-200 bg-white text-gray-900">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-16 text-left mb-32 opacity-40">
          <div className="col-span-2 space-y-8">
            <h5 className="font-black text-gray-900 italic tracking-widest text-3xl">CRYSTALIZE</h5>
            <p className="text-xs leading-loose font-bold max-w-sm">
              合同会社CRYSTALIZE<br />
              次世代型無機質改質剤の研究開発、製造、および国内・国外における販売拠点管理。
            </p>
          </div>
          <div className="space-y-8">
            <h5 className="font-black text-gray-900 text-xs tracking-widest uppercase border-b border-gray-200 pb-4">Product</h5>
            <ul className="text-xs space-y-4 font-bold">
              <li className="hover:text-yellow-600 cursor-pointer transition">本体: CRYSTALIZE</li>
              <li className="hover:text-yellow-600 cursor-pointer transition">洗浄: CRYSTALIZE</li>
              <li className="hover:text-yellow-600 cursor-pointer transition">施工マニュアル</li>
            </ul>
          </div>
          <div className="space-y-8">
            <h5 className="font-black text-gray-900 text-xs tracking-widest uppercase border-b border-gray-200 pb-4">Legal</h5>
            <ul className="text-xs space-y-4 font-bold">
              <li className="hover:text-yellow-600 cursor-pointer transition">特定商取引法の表記</li>
              <li className="hover:text-yellow-600 cursor-pointer transition">プライバシーポリシー</li>
              <li className="hover:text-yellow-600 cursor-pointer transition">運営会社情報</li>
            </ul>
          </div>
        </div>
        <p className="opacity-20 text-[10px] font-bold tracking-[1.5em] uppercase px-4">
          &copy; 2026 CRYSTALIZE PROJECT. ALL RIGHTS RESERVED.
        </p>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        {/* メインシステム（既存） */}
        <Route path="/" element={<DiamondMasterFinalSystem />} />
        
        {/* ランディングページ */}
        <Route path="/secondary" element={<DiamondPortal />} />
        <Route path="/primary" element={<PrimaryFranchiseLP />} />
        
        {/* マイページ（ダッシュボード） */}
        <Route path="/dashboard/special" element={<SpecialFranchiseDashboard />} />
        <Route path="/dashboard/primary" element={<PrimaryFranchiseDashboard />} />
        <Route path="/dashboard/secondary" element={<SecondaryFranchiseDashboard />} />
        
        {/* 後方互換性のため */}
        <Route path="/DiamondPortal" element={<DiamondPortal />} />
      </Routes>
    </Router>
  );
}