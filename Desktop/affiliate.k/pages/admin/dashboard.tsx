import type { NextPage } from 'next';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  limit,
  doc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut, User } from 'firebase/auth';
import { db, auth } from '../../lib/firebase';
import { 
  RiUserLine, 
  RiStore2Line, 
  RiMoneyDollarCircleLine, 
  RiDownload2Line,
  RiDashboardLine,
  RiCheckFill,
  RiCloseFill,
  RiDeleteBinLine,
  RiCloseLine,
  RiPhoneLine,
  RiMailLine,
  RiMapPin2Line,
  RiMessage2Line,
  RiShieldCheckLine,
  RiLinksLine,
  RiMenuLine
} from 'react-icons/ri';

const AdminDashboard: NextPage = () => {
  const [activeTab, setActiveTab] = useState<'partners' | 'leads' | 'payments'>('partners');
  const [partners, setPartners] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [payoutOverrides, setPayoutOverrides] = useState<Record<string, number>>({});
  const [calculatedAmounts, setCalculatedAmounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [selectedPartner, setSelectedPartner] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLpUrl, setEditingLpUrl] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 認証状態
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Firebase Auth の状態を監視
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
    } catch (err: any) {
      setLoginError('メールアドレスまたはパスワードが正しくありません。');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  // Fetch data（ログイン済みの場合のみ実行）
  useEffect(() => {
    if (!currentUser) return;
    const fetchData = async () => {
      setLoading(true);
      
      // Partners fetch
      try {
        const pSnap = await getDocs(query(collection(db, 'partners'), orderBy('createdAt', 'desc')));
        setPartners(pSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error('Error fetching partners:', err);
        // Fallback: try without orderBy if it fails (e.g. index issue)
        try {
          const pSnap = await getDocs(collection(db, 'partners'));
          setPartners(pSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (err2) {
          console.error('Fallback partners fetch failed:', err2);
        }
      }

      // Leads fetch
      try {
        const lSnap = await getDocs(query(collection(db, 'leads'), orderBy('created_at', 'desc')));
        setLeads(lSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error('Error fetching leads:', err);
        try {
          const lSnap = await getDocs(collection(db, 'leads'));
          setLeads(lSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (err2) {
          console.error('Fallback leads fetch failed:', err2);
        }
      }

      // Commissions fetch & calculation
      try {
        const cSnap = await getDocs(collection(db, 'commissions'));
        const sums: Record<string, number> = {};
        cSnap.docs.forEach(doc => {
          const data = doc.data();
          if (data.status === 'approved' && data.affiliate_id) {
            sums[data.affiliate_id] = (sums[data.affiliate_id] || 0) + (Number(data.amount) || 0);
          }
        });
        setCalculatedAmounts(sums);
      } catch (err) {
        console.error('Error fetching commissions:', err);
      }

      setLoading(false);
    };
    fetchData();
  }, [activeTab, currentUser]);

  // 楽天銀行用一括振込CSV出力
  const downloadRakutenCSV = () => {
    // 実際には今月の未払い報酬を集計して出力するロジックが必要
    // ここではサンプルとして、口座登録済みのパートナー一覧を出力する形式で作成
    const header = "振込先銀行コード,支店コード,預金種別,口座番号,受取人名,振込金額,新規コード";
    const rows = partners
      .filter(p => p.bankInfo) 
      .map(p => {
        const bi = p.bankInfo;
        // 手動入力があれば優先、なければ自動集計を使用
        const amount = payoutOverrides[p.id] !== undefined ? payoutOverrides[p.id] : (calculatedAmounts[p.id] || 0);
        
        // 金額が0円の人はスキップ
        if (amount <= 0) return null;

        return `0036,${bi.branchCode || '000'},${bi.accountType === '普通' ? '1' : '2'},${bi.accountNumber},${bi.accountHolder},${amount},`;
      })
      .filter(row => row !== null);

    if (rows.length === 0) {
      alert('振込対象（金額が1円以上）のパートナーがいません。');
      return;
    }

    const csvContent = [header, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=shift-jis;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rakuten_payout_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
  };

  // 削除処理
  const handleDelete = async (collectionName: string, id: string) => {
    if (!window.confirm('このデータを削除してもよろしいですか？この操作は取り消せません。')) return;

    try {
      await deleteDoc(doc(db, collectionName, id));
      alert('削除しました');
      
      // ローカルステートを更新
      if (collectionName === 'partners') {
        setPartners(partners.filter(p => p.id !== id));
      } else {
        setLeads(leads.filter(l => l.id !== id));
      }
    } catch (err) {
      console.error(err);
      alert('削除に失敗しました');
    }
  };

  const formatDate = (date: any) => {
    if (!date) return '-';
    if (typeof date.toDate === 'function') {
      return date.toDate().toLocaleDateString('ja-JP');
    }
    const d = new Date(date);
    return isNaN(d.getTime()) ? '-' : d.toLocaleDateString('ja-JP');
  };

  // 認証確認中のローディング
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-bold text-slate-400">認証確認中...</p>
        </div>
      </div>
    );
  }

  // 未ログインの場合はログイン画面を表示
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans">
        <Head>
          <title>管理者ログイン | adtown Affiliate Management</title>
        </Head>
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 text-2xl font-black italic tracking-tighter text-white mb-2">
              <div className="bg-blue-600 text-white w-10 h-10 rounded-xl flex items-center justify-center not-italic text-sm shadow-lg shadow-blue-900">AD</div>
              ADMIN PANEL
            </div>
            <p className="text-slate-400 text-sm font-medium mt-2">管理者アカウントでログインしてください</p>
          </div>

          <form onSubmit={handleLogin} className="bg-white rounded-[32px] p-8 shadow-2xl shadow-black/30">
            <h1 className="text-xl font-black text-slate-900 mb-6">ログイン</h1>

            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm font-bold px-4 py-3 rounded-2xl mb-4">
                {loginError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">メールアドレス</label>
                <input
                  id="admin-email"
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">パスワード</label>
                <input
                  id="admin-password"
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                />
              </div>
            </div>

            <button
              id="admin-login-btn"
              type="submit"
              disabled={loginLoading}
              className="w-full mt-6 bg-blue-600 text-white py-4 rounded-2xl font-black text-sm hover:bg-blue-700 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loginLoading ? 'ログイン中...' : 'ログイン'}
            </button>
          </form>

          <p className="text-center text-slate-500 text-xs font-medium mt-6">
            adtown アフィリエイト管理システム v1.2
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col md:flex-row font-sans">
      <Head>
        <title>管理者パネル | adtown Affiliate Management</title>
      </Head>

      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-slate-900 text-white flex flex-col md:sticky md:top-0 md:h-screen z-50">
        <div className="p-4 md:p-8 flex justify-between items-center">
          <div className="flex items-center gap-3 text-xl md:text-2xl font-black italic tracking-tighter">
            <div className="bg-blue-600 text-white w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center not-italic text-xs md:text-sm shadow-lg shadow-blue-900">AD</div>
            ADMIN PANEL
          </div>
          <button 
            className="md:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <RiCloseLine size={24} /> : <RiMenuLine size={24} />}
          </button>
        </div>

        <nav className={`flex-1 px-4 space-y-2 ${isMobileMenuOpen ? 'block pb-6' : 'hidden'} md:block`}>
          <button 
            onClick={() => { setActiveTab('partners'); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition ${activeTab === 'partners' ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/20' : 'text-slate-400 hover:bg-white/5'}`}
          >
            <RiUserLine /> アフィリエイター管理
          </button>
          <button 
            onClick={() => { setActiveTab('leads'); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition ${activeTab === 'leads' ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/20' : 'text-slate-400 hover:bg-white/5'}`}
          >
            <RiStore2Line /> 登録店舗管理
          </button>
          <button 
            onClick={() => { setActiveTab('payments'); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition ${activeTab === 'payments' ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/20' : 'text-slate-400 hover:bg-white/5'}`}
          >
            <RiMoneyDollarCircleLine /> 報酬支払い (楽天銀行)
          </button>
        </nav>

        <div className="p-8 border-t border-white/5 mt-auto hidden md:block space-y-3">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">v1.2 Managed by adtown</p>
          <button
            onClick={handleLogout}
            className="w-full text-[10px] font-bold text-slate-500 hover:text-red-400 transition text-center uppercase tracking-widest"
          >
            ログアウト
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-10 w-full min-w-0 overflow-hidden">
        <header className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6 md:mb-10">
          <div>
            <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">
              {activeTab === 'partners' && 'アフィリエイター管理'}
              {activeTab === 'leads' && '登録店舗管理'}
              {activeTab === 'payments' && '報酬支払い管理 (CSV出力)'}
            </h1>
            <p className="text-sm md:text-base text-slate-500 font-medium mt-1">
              {loading ? '読み込み中...' : `${activeTab === 'partners' ? partners.length : leads.length} 件のデータが見つかりました`}
            </p>
          </div>
          
          {activeTab === 'payments' && (
            <button 
              onClick={downloadRakutenCSV} 
              className="bg-slate-900 text-white px-4 py-3 md:px-8 md:py-4 rounded-2xl font-black flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition shadow-2xl shadow-slate-300 w-full md:w-auto"
            >
              <RiDownload2Line /> 楽天銀行用CSVを出力
            </button>
          )}
        </header>

        {/* Content Area */}
        <div className="bg-white rounded-[40px] shadow-sm border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="p-20 text-center text-slate-400 font-bold">読み込み中...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                {activeTab === 'partners' && (
                  <>
                    <thead>
                      <tr className="bg-slate-50 text-[11px] font-black text-slate-400 uppercase tracking-widest border-b">
                        <th className="px-4 py-3 md:px-8 md:py-5">名前 / 連絡先</th>
                        <th className="px-4 py-3 md:px-8 md:py-5">登録情報</th>
                        <th className="px-4 py-3 md:px-8 md:py-5">口座設定</th>
                        <th className="px-4 py-3 md:px-8 md:py-5">登録日</th>
                        <th className="px-4 py-3 md:px-8 md:py-5 text-right">アクション</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {partners.map(p => (
                        <tr key={p.id} className="hover:bg-slate-50/50 transition">
                          <td className="px-4 py-4 md:px-8 md:py-6">
                            <p className="font-extrabold text-slate-900">{p.name || '名前なし'}</p>
                            <div className="flex flex-col gap-0.5 mt-1">
                              <p className="text-xs text-slate-500 font-medium">{p.email}</p>
                              <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-tight">ID: {p.id}</p>
                            </div>
                          </td>
                          <td className="px-4 py-4 md:px-8 md:py-6">
                            <div className="text-xs font-bold space-y-1">
                               <p className="text-slate-700">{p.shop || '-'}</p>
                               <p className="text-slate-400">{p.industry || '-'}</p>
                            </div>
                          </td>
                          <td className="px-4 py-4 md:px-8 md:py-6">
                             {p.bankInfo ? (
                               <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase">
                                 <RiCheckFill /> 登録済み
                               </span>
                             ) : (
                               <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-black uppercase">
                                 <RiCloseFill /> 未登録
                               </span>
                             )}
                          </td>
                          <td className="px-4 py-4 md:px-8 md:py-6">
                            <span className="text-xs font-bold text-slate-400">{formatDate(p.createdAt)}</span>
                          </td>
                          <td className="px-4 py-4 md:px-8 md:py-6 text-right flex justify-end gap-2">
                            <button 
                              onClick={() => {
                                setSelectedPartner(p);
                                setEditingLpUrl(p.customLpUrl || '');
                                setIsModalOpen(true);
                              }}
                              className="text-[11px] font-black text-blue-600 bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-600 hover:text-white transition"
                            >
                              詳細
                            </button>
                            <button 
                              onClick={() => handleDelete('partners', p.id)}
                              className="text-[11px] font-black text-red-600 bg-red-50 px-4 py-2 rounded-xl hover:bg-red-600 hover:text-white transition flex items-center gap-1"
                            >
                              <RiDeleteBinLine /> 削除
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </>
                )}

                {activeTab === 'leads' && (
                  <>
                    <thead>
                      <tr className="bg-slate-50 text-[11px] font-black text-slate-400 uppercase tracking-widest border-b">
                        <th className="px-4 py-3 md:px-8 md:py-5">店舗名 / オーナー</th>
                        <th className="px-4 py-3 md:px-8 md:py-5">紹介者 (ID)</th>
                        <th className="px-4 py-3 md:px-8 md:py-5">進捗状況</th>
                        <th className="px-4 py-3 md:px-8 md:py-5 text-right">登録日時</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {leads.map(l => (
                        <tr key={l.id} className="hover:bg-slate-50/50 transition">
                          <td className="px-4 py-4 md:px-8 md:py-6">
                            <p className="font-extrabold text-slate-900">{l.store_name || l.name || '名称未設定'}</p>
                            <div className="flex flex-col gap-0.5 mt-1">
                              <p className="text-xs text-slate-500 font-medium">{l.email}</p>
                              <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-tight">ID: {l.id}</p>
                            </div>
                          </td>
                          <td className="px-4 py-4 md:px-8 md:py-6">
                            <span className="text-xs font-mono font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">{l.affiliate_id || '直接登録'}</span>
                          </td>
                          <td className="px-4 py-4 md:px-8 md:py-6">
                             <span className={`text-[10px] font-black px-3 py-1 rounded-lg ${
                               l.status === 'converted' || l.status === 'converted_direct' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                             }`}>
                               {l.status === 'converted' || l.status === 'converted_direct' ? '有料成約' : '無料診断中'}
                             </span>
                          </td>
                          <td className="px-4 py-4 md:px-8 md:py-6 text-right space-y-1">
                            <p className="text-xs font-bold text-slate-400">
                              {l.created_at ? new Date(l.created_at).toLocaleDateString('ja-JP') : '-'}
                            </p>
                            <button 
                              onClick={() => handleDelete('leads', l.id)}
                              className="text-[10px] font-black text-red-400 hover:text-red-600 transition flex items-center justify-end gap-1 ml-auto"
                            >
                              <RiDeleteBinLine /> データを削除
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </>
                )}

                {activeTab === 'payments' && (
                   <>
                     <thead>
                       <tr className="bg-slate-50 text-[11px] font-black text-slate-400 uppercase tracking-widest border-b">
                         <th className="px-4 py-3 md:px-8 md:py-5">振込先（パートナー）</th>
                         <th className="px-4 py-3 md:px-8 md:py-5">口座情報</th>
                         <th className="px-4 py-3 md:px-8 md:py-5">自動集計額</th>
                         <th className="px-4 py-3 md:px-8 md:py-5 text-right">振込実行額 (手動編集可)</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                       {partners.filter(p => p.bankInfo).map(p => {
                         const autoAmount = calculatedAmounts[p.id] || 0;
                         const currentAmount = payoutOverrides[p.id] !== undefined ? payoutOverrides[p.id] : autoAmount;
                         
                         return (
                           <tr key={p.id} className="hover:bg-slate-50/50 transition">
                             <td className="px-4 py-4 md:px-8 md:py-6">
                               <p className="font-extrabold text-slate-900">{p.name}</p>
                               <p className="text-[10px] text-slate-400 font-mono">{p.id}</p>
                             </td>
                             <td className="px-4 py-4 md:px-8 md:py-6">
                               <div className="text-[11px] font-bold text-slate-600">
                                 <p>{p.bankInfo.bankName} ({p.bankInfo.bankCode})</p>
                                 <p>{p.bankInfo.branchName} ({p.bankInfo.branchCode})</p>
                                 <p>{p.bankInfo.accountType} {p.bankInfo.accountNumber}</p>
                                 <p>{p.bankInfo.accountHolder}</p>
                               </div>
                             </td>
                             <td className="px-4 py-4 md:px-8 md:py-6">
                               <p className="text-sm font-black text-slate-400">¥{autoAmount.toLocaleString()}</p>
                             </td>
                             <td className="px-4 py-4 md:px-8 md:py-6 text-right">
                               <div className="flex items-center justify-end gap-2">
                                 <span className="text-xs font-bold text-slate-400">¥</span>
                                 <input 
                                   type="number"
                                   className="w-32 px-3 py-2 border rounded-xl font-black text-slate-900 text-right focus:ring-2 focus:ring-blue-600 outline-none"
                                   value={currentAmount}
                                   onChange={(e) => setPayoutOverrides({ ...payoutOverrides, [p.id]: Number(e.target.value) })}
                                 />
                               </div>
                             </td>
                           </tr>
                         );
                       })}
                       {partners.filter(p => p.bankInfo).length === 0 && (
                         <tr>
                           <td colSpan={4} className="p-20 text-center text-slate-400 font-bold">
                             口座情報が登録されているパートナーがいません。
                           </td>
                         </tr>
                       )}
                     </tbody>
                   </>
                )}
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Details Modal */}
      {isModalOpen && selectedPartner && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-2 md:p-4">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative bg-white w-full max-w-2xl max-h-[90vh] md:max-h-[85vh] rounded-[30px] md:rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-5 md:px-10 md:py-8 bg-slate-50 border-b border-slate-100 flex justify-between items-center shrink-0">
              <div>
                <h2 className="text-2xl font-black text-slate-900">アフィリエイター詳細</h2>
                <p className="text-sm font-medium text-slate-400 mt-1">ID: {selectedPartner.id}</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-900 transition"
              >
                <RiCloseLine size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-6 md:px-10 md:py-10 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {/* Basic Info */}
                <div className="space-y-6">
                  <section>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">基本プロフィール</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"><RiUserLine /></div>
                        <div>
                          <p className="text-xs text-slate-400 font-bold">お名前</p>
                          <p className="font-extrabold text-slate-900">{selectedPartner.name || '-'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"><RiMailLine /></div>
                        <div>
                          <p className="text-xs text-slate-400 font-bold">メールアドレス</p>
                          <p className="font-extrabold text-slate-900">{selectedPartner.email || '-'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"><RiPhoneLine /></div>
                        <div>
                          <p className="text-xs text-slate-400 font-bold">電話番号</p>
                          <p className="font-extrabold text-slate-900">{selectedPartner.tel || '-'}</p>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">所属・活動情報</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center"><RiStore2Line /></div>
                        <div>
                          <p className="text-xs text-slate-400 font-bold">店名・会社名</p>
                          <p className="font-extrabold text-slate-900">{selectedPartner.shop || '-'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center"><RiMapPin2Line /></div>
                        <div>
                          <p className="text-xs text-slate-400 font-bold">業種</p>
                          <p className="font-extrabold text-slate-900">{selectedPartner.industry || '-'}</p>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>

                {/* Status & Settings */}
                <div className="space-y-6">
                  <section>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">ステータス・規約</h3>
                    <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-500">アカウント状態</span>
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-lg uppercase">{selectedPartner.status || 'active'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-500">即時ログイン</span>
                        <span className="text-xs font-black text-slate-900">{selectedPartner.canLoginImmediately ? '許可' : '制限'}</span>
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                        <span className="text-xs font-bold text-slate-500 flex items-center gap-1"><RiShieldCheckLine /> 注意事項に同意</span>
                        <span className="text-xs font-black text-emerald-600">同意済み</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-500 flex items-center gap-1"><RiShieldCheckLine /> 事例掲載に同意</span>
                        <span className={`text-xs font-black ${selectedPartner.isCaseStudyAgreed ? 'text-emerald-600' : 'text-slate-400'}`}>
                          {selectedPartner.isCaseStudyAgreed ? '同意済み' : '未同意'}
                        </span>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">報酬条件</h3>
                    <div className="text-xs space-y-3 font-bold leading-relaxed text-slate-600">
                      <p>
                        <span className="text-slate-400 block mb-1">報酬体系:</span>
                        {selectedPartner.rewardCondition || '紹介先の月額管理費（9,900円）の30%を還元'}
                      </p>
                      <p>
                        <span className="text-slate-400 block mb-1">停止条件:</span>
                        {selectedPartner.rewardStopCondition || '紹介先の途中解約、未払い等で有料契約が無効となった場合'}
                      </p>
                    </div>
                  </section>
                </div>

                {/* Message */}
                <div className="col-span-2">
                  <section>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <RiMessage2Line /> メッセージ・意気込み
                    </h3>
                    <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-3xl">
                      <p className="text-sm font-bold text-slate-700 whitespace-pre-wrap leading-relaxed">
                        {selectedPartner.message || '（メッセージはありません）'}
                      </p>
                    </div>
                  </section>
                </div>

                {/* Custom LP URL Setting */}
                <div className="col-span-2 mt-4">
                  <section className="p-6 bg-slate-900 rounded-[32px] text-white">
                    <h3 className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <RiLinksLine /> 専用ランディングページ設定
                    </h3>
                    <div className="flex gap-3">
                      <input 
                        type="url"
                        placeholder="https://example.com"
                        value={editingLpUrl}
                        onChange={(e) => setEditingLpUrl(e.target.value)}
                        className="flex-1 bg-white/10 border border-white/20 rounded-2xl px-5 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white/30"
                      />
                      <button 
                        onClick={async () => {
                          try {
                            await updateDoc(doc(db, 'partners', selectedPartner.id), {
                              customLpUrl: editingLpUrl
                            });
                            alert('専用URLを更新しました');
                            // Update local state
                            setPartners(partners.map(p => p.id === selectedPartner.id ? { ...p, customLpUrl: editingLpUrl } : p));
                          } catch (err) {
                            console.error(err);
                            alert('更新に失敗しました');
                          }
                        }}
                        className="bg-white text-slate-900 px-6 py-3 rounded-2xl font-black text-sm hover:bg-slate-100 transition"
                      >
                        保存
                      </button>
                    </div>
                    <p className="mt-3 text-[10px] opacity-50 font-medium">
                      ※URLを入力して保存すると、アフィリエイターのダッシュボードに表示される紹介URLが切り替わります。
                    </p>
                  </section>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-5 md:px-10 md:py-8 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 shrink-0">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-3 md:px-8 md:py-4 bg-slate-200 text-slate-700 rounded-2xl font-black text-sm hover:bg-slate-300 transition"
              >
                閉じる
              </button>
              <button 
                onClick={() => {
                  if (window.confirm('このアフィリエイターを削除してもよろしいですか？')) {
                    handleDelete('partners', selectedPartner.id);
                    setIsModalOpen(false);
                  }
                }}
                className="px-6 py-3 md:px-8 md:py-4 bg-red-50 text-red-600 rounded-2xl font-black text-sm hover:bg-red-600 hover:text-white transition"
              >
                削除する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
