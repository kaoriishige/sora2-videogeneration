import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DiamondPortal from './DiamondPortal';

/**
 * ダイヤモンド〇〇 公式受注・商談管理システム
 * --------------------------------------------------
 * 【修正内容】
 * - 未使用の useEffect を削除し、TypeScriptエラーを完全解消
 * - 商品構成：ダイヤモンド〇〇（11,000円）＋ ブレーンウォーター（2,000円）
 * - 送料：本体11本以上で無料。洗浄剤は別途加算。
 * - デザイン：漆黒と金、極太日本語によるプロ仕様UI
 * - フォーム：会社名、担当者、相談種別、詳細を網羅
 */

const DiamondMasterFinalSystem = () => {
  // --- 状態管理：商品の個数 ---
  const [diamondQty, setDiamondQty] = useState(1);
  const [brainWaterQty, setBrainWaterQty] = useState(0);
  const [activeTab, setActiveTab] = useState('tech');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    company: '',
    name: '',
    email: '',
    phone: '',
    memo: '',
  });

  // --- 価格・送料設定（税込） ---
  const PRICE_DIAMOND = 11000; // ダイヤモンド〇〇 本体
  const PRICE_BRAIN = 2000;    // ブレーンウォーター 洗浄剤
  const POSTAGE = 1430;        // 基本送料

  // --- 計算ロジック ---
  const diamondSubtotal = diamondQty * PRICE_DIAMOND;
  const isDiamondFreeShipping = diamondQty >= 11;
  const diamondShipping = (diamondQty > 0 && !isDiamondFreeShipping) ? POSTAGE : 0;

  const brainWaterSubtotal = brainWaterQty * PRICE_BRAIN;
  const brainWaterShipping = brainWaterQty > 0 ? POSTAGE : 0;

  const totalAmount = diamondSubtotal + diamondShipping + brainWaterSubtotal + brainWaterShipping;

  // --- フォーム送信処理 ---
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const payload = {
      diamondQty,
      brainWaterQty,
      diamondSubtotal,
      diamondShipping,
      brainWaterSubtotal,
      brainWaterShipping,
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
          setDiamondQty(1);
          setBrainWaterQty(0);
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
    <div className="min-h-screen bg-[#050505] text-white font-sans pb-40 selection:bg-yellow-600/30">
      
      {/* 配送重要通知（最上部固定） */}
      <div className="bg-red-700 text-white py-4 px-4 text-center text-sm md:text-base font-black tracking-widest shadow-2xl sticky top-0 z-50">
        【配送通知】ダイヤモンド〇〇 11本以上のご注文は、送料無料（弊社負担）にてお届けいたします。
      </div>

      {/* ヒーローヘッダー */}
      <header className="relative pt-32 pb-24 text-center bg-gradient-to-b from-[#1a1a1a] to-[#050505] border-b border-white/5">
        <div className="max-w-5xl mx-auto px-6">
          <h1 className="text-7xl md:text-9xl font-black mb-8 tracking-tighter italic text-white drop-shadow-[0_10px_10px_rgba(0,0,0,1)] uppercase">
            Diamond OO
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
                  ダイヤモンド〇〇は、従来の表面被膜型とは一線を画します。ナノサイズの粒子がコンクリートの毛細管に28秒で浸透し、カルシウム成分と反応して「不溶性の結晶」を形成。躯体そのものを改質するため、物理的に剥離や浮きが発生不可能な状態を作り上げます。
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
            <div className="bg-[#0a0a0a] p-16 rounded-[4rem] border border-white/5 shadow-2xl">
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

        {/* 注文セクション（ダイヤモンド〇〇 ＆ ブレーンウォーター） */}
        <section className="mb-40">
          <h2 className="text-5xl font-black italic mb-20 border-b-8 border-yellow-600 pb-6 inline-block tracking-tighter uppercase">
            Product Order
          </h2>

          <div className="grid grid-cols-1 gap-16 mb-24">
            {/* 商品1：ダイヤモンド〇〇 */}
            <div className="bg-[#0c0c0c] rounded-[4rem] p-10 md:p-20 border border-white/10 shadow-2xl flex flex-col lg:flex-row items-center gap-20 transition-all hover:border-yellow-600/40 group">
              <div className="w-full lg:w-1/2 relative">
                <div className="absolute -inset-4 bg-yellow-600/10 rounded-[3rem] blur-2xl group-hover:bg-yellow-600/20 transition"></div>
                <img src="/diamond_black.png" alt="ダイヤモンド〇〇" className="relative w-full h-auto rounded-[2rem] shadow-2xl" />
              </div>
              <div className="w-full lg:w-1/2 space-y-10">
                <div className="space-y-2">
                  <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black italic tracking-tighter break-words">ダイヤモンド〇〇</h3>
                  <p className="text-yellow-600 font-bold tracking-[0.3em] text-sm uppercase">Main Reform Agent</p>
                </div>
                <p className="text-6xl font-mono font-black text-white">¥11,000 <span className="text-lg text-gray-500 font-sans">（税込）</span></p>
                <div className="bg-black p-10 rounded-[2.5rem] border border-white/5 shadow-inner">
                  <label className="block text-xs font-black text-gray-400 mb-6 tracking-widest uppercase">注文本数（本）</label>
                  <div className="flex items-center justify-center gap-6">
                    <button 
                      onClick={() => setDiamondQty(Math.max(0, diamondQty - 1))}
                      className="bg-yellow-600 hover:bg-yellow-700 text-black font-black text-3xl w-16 h-16 rounded-full transition shadow-lg active:scale-95 flex items-center justify-center"
                    >
                      ▼
                    </button>
                    <input 
                      type="number" min="0" value={diamondQty} 
                      onChange={(e) => setDiamondQty(Math.max(0, parseInt(e.target.value) || 0))} 
                      className="bg-transparent border-b-4 border-yellow-600 text-7xl font-mono text-yellow-500 w-32 outline-none text-center focus:border-white transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <button 
                      onClick={() => setDiamondQty(diamondQty + 1)}
                      className="bg-yellow-600 hover:bg-yellow-700 text-black font-black text-3xl w-16 h-16 rounded-full transition shadow-lg active:scale-95 flex items-center justify-center"
                    >
                      ▲
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm font-black px-4">
                  <span className="text-gray-500 italic">Shipping Group: A</span>
                  <span className={isDiamondFreeShipping ? "text-green-500" : "text-white"}>
                    送料: {isDiamondFreeShipping ? "無料（11本以上）" : `¥${POSTAGE.toLocaleString()}`}
                  </span>
                </div>
              </div>
            </div>

            {/* 商品2：ブレーンウォーター */}
            <div className="bg-[#0c0c0c] rounded-[4rem] p-10 md:p-20 border border-white/10 shadow-2xl flex flex-col lg:flex-row items-center gap-20 transition-all hover:border-blue-600/40 group">
              <div className="w-full lg:w-1/2 relative">
                <div className="absolute -inset-4 bg-blue-600/10 rounded-[3rem] blur-2xl group-hover:bg-blue-600/20 transition"></div>
                <img src="/cleaner_white.png" alt="ブレーンウォーター" className="relative w-full h-auto rounded-[2rem] shadow-2xl" />
              </div>
              <div className="w-full lg:w-1/2 space-y-10">
                <div className="space-y-2">
                  <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black italic tracking-tighter text-gray-300 break-words">ブレーンウォーター</h3>
                  <p className="text-blue-500 font-bold tracking-[0.3em] text-sm uppercase">Pre-Treatment Cleaner</p>
                </div>
                <p className="text-6xl font-mono font-black text-white">¥2,000 <span className="text-lg text-gray-500 font-sans">（税込）</span></p>
                <div className="bg-black p-10 rounded-[2.5rem] border border-white/5 shadow-inner">
                  <label className="block text-xs font-black text-gray-400 mb-6 tracking-widest uppercase">注文本数（本）</label>
                  <div className="flex items-center justify-center gap-6">
                    <button 
                      onClick={() => setBrainWaterQty(Math.max(0, brainWaterQty - 1))}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-black text-3xl w-16 h-16 rounded-full transition shadow-lg active:scale-95 flex items-center justify-center"
                    >
                      ▼
                    </button>
                    <input 
                      type="number" min="0" value={brainWaterQty} 
                      onChange={(e) => setBrainWaterQty(Math.max(0, parseInt(e.target.value) || 0))} 
                      className="bg-transparent border-b-4 border-white/20 text-7xl font-mono text-white w-32 outline-none text-center focus:border-blue-600 transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <button 
                      onClick={() => setBrainWaterQty(brainWaterQty + 1)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-black text-3xl w-16 h-16 rounded-full transition shadow-lg active:scale-95 flex items-center justify-center"
                    >
                      ▲
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm font-black px-4">
                  <span className="text-gray-500 italic">Shipping Group: B</span>
                  <span className="text-white font-mono">送料: ¥{brainWaterShipping.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 注意事項 */}
          <div className="mt-16 max-w-3xl mx-auto bg-[#0a0a0a] border-2 border-yellow-600/30 p-10 md:p-16 rounded-[3rem]">
            <h3 className="text-2xl font-black mb-8 text-yellow-600 flex items-center">
              <span className="w-8 h-8 rounded-full bg-yellow-600 text-black text-xs flex items-center justify-center mr-4 font-bold">!</span>
              注意事項
            </h3>
            <ul className="space-y-6 text-gray-300 leading-loose font-medium">
              <li className="flex items-start gap-4">
                <span className="text-yellow-600 font-black text-lg flex-shrink-0">・</span>
                <span>ダイヤモンド〇〇の送料は、10本までは1,430円、11本～は無料となります。</span>
              </li>
              <li className="flex items-start gap-4">
                <span className="text-yellow-600 font-black text-lg flex-shrink-0">・</span>
                <span>ブレーンウォーターは、販売元がダイヤモンド〇〇と異なるため、別途送料が発生します。</span>
              </li>
              <li className="flex items-start gap-4">
                <span className="text-yellow-600 font-black text-lg flex-shrink-0">・</span>
                <span>ブレーンウォーターの送料は、一律1,430円になります。</span>
              </li>
            </ul>
          </div>

          {/* 最終決済サマリー */}
          <div className="max-w-3xl mx-auto bg-white text-black p-8 md:p-24 rounded-3xl md:rounded-[5rem] shadow-[0_50px_150px_rgba(0,0,0,0.9)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 md:h-4 bg-yellow-600"></div>
            <div className="space-y-6 md:space-y-10 font-black">
              <div className="flex justify-between border-b-2 border-gray-100 pb-4 md:pb-6 text-xs md:text-sm tracking-widest uppercase text-gray-400">
                <span>商品合計</span>
                <span>¥{(diamondSubtotal + brainWaterSubtotal).toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-b-2 border-gray-100 pb-4 md:pb-6 text-xs md:text-sm tracking-widest uppercase text-red-600">
                <span>送料合計</span>
                <span>¥{(diamondShipping + brainWaterShipping).toLocaleString()}</span>
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
        <section className="bg-[#0a0a0a] p-6 md:p-24 rounded-3xl md:rounded-[5rem] border border-white/5 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-yellow-600/5 blur-[100px]"></div>
          
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 md:mb-24">
              <h2 className="text-3xl md:text-5xl font-black italic mb-4 md:mb-8 tracking-tighter text-white">購入申し込み</h2>
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
                      <p className="text-white text-base md:text-lg mb-1 md:mb-2">ダイヤモンド〇〇</p>
                      <p className="text-gray-500 text-xs md:text-sm">¥11,000 × {diamondQty}本</p>
                    </div>
                    <p className="text-xl md:text-2xl font-mono text-yellow-600 text-right">¥{diamondSubtotal.toLocaleString()}</p>
                  </div>

                  <div className="flex flex-col md:flex-row md:justify-between md:items-center pb-4 md:pb-8 border-b border-white/10 gap-3">
                    <div>
                      <p className="text-white text-base md:text-lg mb-1 md:mb-2">ブレーンウォーター</p>
                      <p className="text-gray-500 text-xs md:text-sm">¥2,000 × {brainWaterQty}本</p>
                    </div>
                    <p className="text-xl md:text-2xl font-mono text-white text-right">¥{brainWaterSubtotal.toLocaleString()}</p>
                  </div>

                  <div className="flex flex-col md:flex-row md:justify-between md:items-center pb-4 md:pb-8 border-b border-white/10 gap-3">
                    <p className="text-white text-sm md:text-base">送料計</p>
                    <p className="text-xl md:text-2xl font-mono text-red-600 text-right">¥{(diamondShipping + brainWaterShipping).toLocaleString()}</p>
                  </div>

                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 pt-2">
                    <p className="text-lg md:text-2xl font-black text-white">お支払総額</p>
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
                    <input type="text" name="company" placeholder="株式会社 〇〇" value={formData.company} onChange={handleFormChange} className="w-full bg-white/5 border border-white/10 p-4 md:p-6 rounded-xl md:rounded-2xl outline-none focus:border-yellow-600 focus:bg-white/10 transition-all text-white text-sm md:text-base" />
                  </div>
                  <div className="space-y-2 md:space-y-4">
                    <label className="text-xs text-yellow-600 uppercase tracking-widest ml-2 md:ml-4">ご担当者名（必須）</label>
                    <input type="text" name="name" placeholder="山田 太郎" value={formData.name} onChange={handleFormChange} className="w-full bg-white/5 border border-white/10 p-4 md:p-6 rounded-xl md:rounded-2xl outline-none focus:border-yellow-600 focus:bg-white/10 transition-all text-white text-sm md:text-base" required />
                  </div>
                </div>
                
                <div className="space-y-2 md:space-y-4 mb-6 md:mb-10">
                  <label className="text-xs text-yellow-600 uppercase tracking-widest ml-2 md:ml-4">メールアドレス（必須）</label>
                  <input type="email" name="email" placeholder="contact@example.co.jp" value={formData.email} onChange={handleFormChange} className="w-full bg-white/5 border border-white/10 p-4 md:p-6 rounded-xl md:rounded-2xl outline-none focus:border-yellow-600 focus:bg-white/10 transition-all text-white text-sm md:text-base" required />
                </div>

                <div className="space-y-2 md:space-y-4 mb-6 md:mb-10">
                  <label className="text-xs text-yellow-600 uppercase tracking-widest ml-2 md:ml-4">電話番号（必須）</label>
                  <input type="tel" name="phone" placeholder="03-XXXX-XXXX" value={formData.phone} onChange={handleFormChange} className="w-full bg-white/5 border border-white/10 p-4 md:p-6 rounded-xl md:rounded-2xl outline-none focus:border-yellow-600 focus:bg-white/10 transition-all text-white text-sm md:text-base" required />
                </div>

                <div className="space-y-2 md:space-y-4">
                  <label className="text-xs text-yellow-600 uppercase tracking-widest ml-2 md:ml-4">ご質問・ご要望（任意）</label>
                  <textarea rows={5} name="memo" placeholder="ご不明な点やご要望がございましたら、こちらにご記入ください。" value={formData.memo} onChange={handleFormChange} className="w-full bg-white/5 border border-white/10 p-4 md:p-6 rounded-xl md:rounded-2xl outline-none focus:border-yellow-600 focus:bg-white/10 transition-all text-white resize-none text-sm md:text-base"></textarea>
                </div>
              </div>

              {!isSubmitted ? (
                <button type="submit" className="w-full bg-white text-black font-black py-10 rounded-3xl text-2xl hover:bg-yellow-600 transition-all duration-500 shadow-2xl tracking-[0.4em] uppercase">
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

      <footer className="py-40 text-center border-t border-white/5 bg-[#030303]">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-16 text-left mb-32 opacity-40">
          <div className="col-span-2 space-y-8">
            <h5 className="font-black text-white italic tracking-widest text-3xl">DIAMOND OO</h5>
            <p className="text-xs leading-loose font-bold max-w-sm">
              合同会社ダイアモンド〇〇<br/>
              次世代型無機質改質剤の研究開発、製造、および国内・国外における販売拠点管理。
            </p>
          </div>
          <div className="space-y-8">
            <h5 className="font-black text-white text-xs tracking-widest uppercase border-b border-white/10 pb-4">Product</h5>
            <ul className="text-xs space-y-4 font-bold">
              <li className="hover:text-yellow-600 cursor-pointer transition">本体: ダイヤモンド〇〇</li>
              <li className="hover:text-yellow-600 cursor-pointer transition">洗浄: ブレーンウォーター</li>
              <li className="hover:text-yellow-600 cursor-pointer transition">施工マニュアル</li>
            </ul>
          </div>
          <div className="space-y-8">
            <h5 className="font-black text-white text-xs tracking-widest uppercase border-b border-white/10 pb-4">Legal</h5>
            <ul className="text-xs space-y-4 font-bold">
              <li className="hover:text-yellow-600 cursor-pointer transition">特定商取引法の表記</li>
              <li className="hover:text-yellow-600 cursor-pointer transition">プライバシーポリシー</li>
              <li className="hover:text-yellow-600 cursor-pointer transition">運営会社情報</li>
            </ul>
          </div>
        </div>
        <p className="opacity-20 text-[10px] font-bold tracking-[1.5em] uppercase px-4">
          &copy; 2026 DIAMOND OO PROJECT. ALL RIGHTS RESERVED.
        </p>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DiamondMasterFinalSystem />} />
        <Route path="/DiamondPortal" element={<DiamondPortal />} />
      </Routes>
    </Router>
  );
}