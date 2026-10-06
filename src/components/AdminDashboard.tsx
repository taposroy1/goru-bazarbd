import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Cow,
  User,
  Order,
  PaymentRecord,
  SubscriptionPlan,
  OrderStatus,
  BuildHistoryRecord,
} from '../types';
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Package,
  ShoppingBag,
  CreditCard,
  Crown,
  Settings,
  FileText,
  Download,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Sparkles,
  Search,
  Filter,
  Trash2,
  Edit,
  ExternalLink,
  Plus,
  Play,
  Check,
  RefreshCw,
  Upload,
  Camera,
  Image,
  Phone,
  MessageCircle,
  GitBranch,
  Copy,
  Key,
  Globe,
  Save,
} from 'lucide-react';
import { generateNetlifyDistZip, triggerDownload } from '../utils/distBuilder';
import { BD_DISTRICTS, COW_BREEDS } from '../data/mockData';
import { generateGitCliCommands } from '../utils/githubSync';

export const AdminDashboard: React.FC = () => {
  const {
    currentUser,
    users,
    cows,
    orders,
    payments,
    plans,
    auditLogs,
    settings,
    buildHistory,
    approveCow,
    toggleFeaturedCow,
    deleteCow,
    updateCow,
    adminAddCow,
    verifySeller,
    toggleUserStatus,
    adminAddUser,
    updateUser,
    deleteUser,
    updateOrderStatus,
    adminAddOrder,
    updateOrder,
    deleteOrder,
    updateSubscriptionPlan,
    createSubscriptionPlan,
    deleteSubscriptionPlan,
    updateSettings,
    addBuildRecord,
    changeAdminCredentials,
    githubConfig,
    updateGitHubConfig,
    syncToGitHub,
    testGitHub,
    setQuickPublishModalOpen,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'users'
    | 'sellers'
    | 'cows'
    | 'orders'
    | 'payments'
    | 'plans'
    | 'settings'
    | 'audit'
    | 'build'
    | 'github'
  >('overview');

  // Search/Filter states
  const [cowFilter, setCowFilter] = useState<'all' | 'pending' | 'approved' | 'featured'>('all');
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [userRoleFilter, setUserRoleFilter] = useState<string>('all');

  // Dist build states
  const [buildVersion, setBuildVersion] = useState('1.0.2');
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildProgress, setBuildProgress] = useState(0);
  const [buildStepName, setBuildStepName] = useState('');
  const [lastBuiltBlob, setLastBuiltBlob] = useState<{ blob: Blob; filename: string; sizeKb: number } | null>(null);

  // Settings form states
  const [siteSettingsForm, setSiteSettingsForm] = useState(settings);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Admin Credentials form state (Requirement: change admin username and password)
  const [adminNewUsername, setAdminNewUsername] = useState(settings.adminUsername || 'admin');
  const [adminCurrentPassword, setAdminCurrentPassword] = useState('');
  const [adminNewPassword, setAdminNewPassword] = useState('');
  const [adminConfirmPassword, setAdminConfirmPassword] = useState('');
  const [credFeedback, setCredFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // New Plan form modal/state
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [isNewPlanOpen, setIsNewPlanOpen] = useState(false);
  const [isEditPlanOpen, setIsEditPlanOpen] = useState(false);
  const [newPlanForm, setNewPlanForm] = useState<SubscriptionPlan>({
    id: `plan-${Date.now()}`,
    name: 'Custom Package',
    nameBn: 'কাস্টম প্যাকেজ',
    price: 1500,
    durationDays: 60,
    listingLimit: 15,
    featuredSlots: 3,
    isPrioritySupport: true,
    isFreePackage: false,
    features: ['১৫টি গরু লিস্টিং', '৬০ দিন মেয়াদ', '৩টি ফিচার্ড স্লট', 'অগ্রাধিকার সাপোর্ট'],
    isActive: true,
  });

  // Admin Cow Modal States
  const [isAddCowOpen, setIsAddCowOpen] = useState(false);
  const [editingCow, setEditingCow] = useState<Cow | null>(null);
  const [cowFormData, setCowFormData] = useState<Partial<Cow>>({
    name: '',
    breed: COW_BREEDS[0],
    category: 'qurbani',
    categoryLabelBn: 'কোরবানি ও মাংস',
    gender: 'ষাঁড়',
    ageYears: 3,
    ageMonths: 0,
    weightKg: 500,
    heightInch: 54,
    price: 220000,
    advanceType: 'percentage',
    advanceValue: 10,
    district: 'ঢাকা',
    upazila: 'মিরপুর',
    fullAddress: 'মিরপুর গাবতলী হাট সংলগ্ন',
    healthStatus: 'সম্পূর্ণ সুস্থ ও ভ্যাকসিনেটেড',
    vaccinations: ['খুরা রোগ (FMD)', 'অ্যানথ্রাক্স (তড়কা)'],
    feedingHabit: 'ঘাস ও প্রাকৃতিক খাদ্য',
    description: '',
    images: ['/images/cow_sahiwal.jpg'],
    sellerName: 'অ্যাডমিন লিস্টিং',
    sellerPhone: '০১৭১২-৩৪৫৬৭৮',
    sellerWhatsapp: '০১৭১২-৩৪৫৬৭৮',
    sellerFarmName: 'গরু বাজার সেন্ট্রাল ফার্ম',
    sellerBkash: '০১৭১২-৩৪৫৬৭৮',
    sellerNagad: '০১৭১২-৩৪৫৬৭৮',
    sellerRocket: '',
    status: 'approved',
    isFeatured: false,
  });

  // Admin User Modal States
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userFormData, setUserFormData] = useState<Partial<User>>({
    name: '',
    phone: '',
    email: '',
    role: 'seller',
    district: 'ঢাকা',
    status: 'active',
  });

  // Admin Order Modal States
  const [isAddOrderOpen, setIsAddOrderOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [orderFormData, setOrderFormData] = useState<Partial<Order>>({
    cowName: 'শাহীওয়াল লাল ষাঁড়',
    cowCode: 'GB-7025',
    buyerName: 'ক্রেতা নাম',
    buyerPhone: '০১৭০০-০০০০০০',
    buyerAddress: 'ঢাকা',
    sellerName: 'হাজী রফিকুল ইসলাম',
    sellerFarmName: 'গ্রিন ডেইরি ফার্ম',
    sellerPhone: '০১৭১২-৩৪৫৬৭৮',
    cowTotalAmount: 250000,
    advanceAmount: 25000,
    remainingAmount: 225000,
    orderStatus: 'confirmed',
    paymentMethod: 'bkash',
    deliveryType: 'farm_pickup',
  });

  // Logo upload for Site Settings
  const handleSiteLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSiteSettingsForm((prev) => ({
          ...prev,
          logoUrl: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Analytics Computations
  const totalCows = cows.length;
  const pendingCows = cows.filter((c) => c.status === 'pending');
  const totalBuyers = users.filter((u) => u.role === 'buyer').length;
  const totalSellers = users.filter((u) => u.role === 'seller').length;
  const pendingSellers = users.filter((u) => u.role === 'seller' && u.sellerProfile?.verificationStatus === 'pending');
  
  const totalAdvanceCollected = payments
    .filter((p) => p.paymentType === 'advance' && p.status === 'verified')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalSubRevenue = payments
    .filter((p) => p.paymentType === 'subscription' && p.status === 'verified')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalMarketVolume = cows
    .filter((c) => c.status === 'approved')
    .reduce((sum, c) => sum + c.price, 0);

  // Build Dist Netlify Execution
  const handleStartBuild = async () => {
    setIsBuilding(true);
    setBuildProgress(5);
    setBuildStepName('প্রস্তুতি চলছে...');
    setLastBuiltBlob(null);

    try {
      const res = await generateNetlifyDistZip({
        version: buildVersion,
        adminName: currentUser ? currentUser.name : 'Super Admin',
        settings,
        cows,
        plans,
        onProgress: (pct, msg) => {
          setBuildProgress(pct);
          setBuildStepName(msg);
        },
      });

      setLastBuiltBlob(res);

      const record: BuildHistoryRecord = {
        id: `build-${Date.now()}`,
        version: buildVersion,
        buildDate: new Date().toLocaleString('bn-BD'),
        adminName: currentUser ? `${currentUser.name} (${currentUser.role})` : 'Super Admin',
        status: 'success',
        zipSizeKb: res.sizeKb,
        totalFiles: 54,
        targetPlatform: 'Netlify SPA Production',
      };
      addBuildRecord(record);
    } catch (err) {
      console.error(err);
      setBuildStepName('বিল্ডে ত্রুটি ঘটেছে');
    } finally {
      setIsBuilding(false);
    }
  };

  const handleDownloadDist = () => {
    if (lastBuiltBlob) {
      triggerDownload(lastBuiltBlob.blob, lastBuiltBlob.filename);
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(siteSettingsForm);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  const handleUpdateAdminCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    setCredFeedback(null);

    const targetUser = adminNewUsername.trim();
    if (!targetUser) {
      setCredFeedback({ type: 'error', message: 'নতুন অ্যাডমিন ইউজারনেম ফাঁকা রাখা যাবে না।' });
      return;
    }
    if (!adminCurrentPassword) {
      setCredFeedback({ type: 'error', message: 'নিরাপত্তার স্বার্থে অনুগ্রহ করে বর্তমান পাসওয়ার্ড দিন।' });
      return;
    }
    if (!adminNewPassword || adminNewPassword.length < 4) {
      setCredFeedback({ type: 'error', message: 'নতুন পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে।' });
      return;
    }
    if (adminNewPassword !== adminConfirmPassword) {
      setCredFeedback({ type: 'error', message: 'নতুন পাসওয়ার্ড ও কনফার্ম পাসওয়ার্ড দুটি হুবহু এক হতে হবে।' });
      return;
    }

    const res = changeAdminCredentials(targetUser, adminNewPassword, adminCurrentPassword);
    if (res.success) {
      setCredFeedback({ type: 'success', message: `${res.message} নতুন ইউজারনেম: "${targetUser}"` });
      setAdminCurrentPassword('');
      setAdminNewPassword('');
      setAdminConfirmPassword('');
      // Update form representation
      setSiteSettingsForm((prev) => ({
        ...prev,
        adminUsername: targetUser,
        adminPassword: adminNewPassword,
      }));
    } else {
      setCredFeedback({ type: 'error', message: res.message });
    }
  };

  // GitHub Auto-Sync & Integration state
  const [githubForm, setGithubForm] = useState({
    owner: githubConfig?.owner || 'taposroy616',
    repo: githubConfig?.repo || 'goru-bazar',
    branch: githubConfig?.branch || 'main',
    token: githubConfig?.token || '',
    autoSyncEnabled: githubConfig?.autoSyncEnabled ?? true,
  });
  const [isTestingGitHub, setIsTestingGitHub] = useState(false);
  const [gitTestResult, setGitTestResult] = useState<{ success: boolean; message: string; details?: any } | null>(null);
  const [isSyncingGitHub, setIsSyncingGitHub] = useState(false);
  const [gitSyncResult, setGitSyncResult] = useState<{ success: boolean; message: string; commitSha?: string } | null>(null);
  const [showToken, setShowToken] = useState(false);
  const [customCommitMsg, setCustomCommitMsg] = useState('');
  const [copiedCli, setCopiedCli] = useState(false);
  const [configSavedToast, setConfigSavedToast] = useState(false);

  const handleSaveGitHubConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateGitHubConfig(githubForm);
    setConfigSavedToast(true);
    setTimeout(() => setConfigSavedToast(false), 3000);
  };

  const handleTestGitHub = async () => {
    setIsTestingGitHub(true);
    setGitTestResult(null);
    try {
      // Temporarily save so test uses updated credentials
      updateGitHubConfig(githubForm);
      const res = await testGitHub();
      setGitTestResult(res);
    } catch (err: any) {
      setGitTestResult({ success: false, message: err.message || 'কানেকশন টেস্টে ত্রুটি' });
    } finally {
      setIsTestingGitHub(false);
    }
  };

  const handleManualSyncGitHub = async () => {
    setIsSyncingGitHub(true);
    setGitSyncResult(null);
    try {
      updateGitHubConfig(githubForm);
      const msg = customCommitMsg.trim() || undefined;
      const res = await syncToGitHub(msg);
      setGitSyncResult(res);
      if (res.success) {
        setCustomCommitMsg('');
      }
    } catch (err: any) {
      setGitSyncResult({ success: false, message: err.message || 'সিঙ্ক ব্যর্থ হয়েছে' });
    } finally {
      setIsSyncingGitHub(false);
    }
  };

  const handleCopyCli = () => {
    const commands = generateGitCliCommands(githubForm.owner, githubForm.repo, githubForm.branch);
    navigator.clipboard.writeText(commands);
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      
      {/* Top Banner with Admin Context */}
      <div className="bg-neutral-900 text-white rounded-2xl p-6 shadow-lg mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">সেন্ট্রাল কন্ট্রোল প্যানেল</span>
          </div>
          <h1 className="text-xl font-bold mt-1">গরু বাজার অ্যাডমিন ড্যাশবোর্ড</h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            লগইন রয়েছেন: <strong className="text-emerald-400">{currentUser?.name}</strong> ({currentUser?.role})
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setQuickPublishModalOpen(true)}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>⚡ ১-ক্লিকে সাইট ডাউনলোড ও পাবলিশ</span>
          </button>

          <button
            onClick={() => setActiveTab('github')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm border ${
              activeTab === 'github'
                ? 'bg-neutral-800 text-emerald-400 border-emerald-500/50 shadow-md ring-1 ring-emerald-500/30'
                : 'bg-neutral-800/90 hover:bg-neutral-700 text-neutral-200 border-neutral-700'
            }`}
          >
            <GitBranch className="w-4 h-4 text-emerald-400" />
            <span>GitHub সিঙ্ক ও অটোমেশন</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
          </button>

          <button
            onClick={() => setActiveTab('build')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Netlify DIST বিল্ড ও ডাউনলোড</span>
          </button>
        </div>
      </div>

      {/* Admin Nav Tabs */}
      <div className="flex items-center gap-1.5 border-b border-neutral-200 mb-6 overflow-x-auto scrollbar-none pb-2">
        {[
          { key: 'overview', label: 'ওভারভিউ', icon: LayoutDashboard },
          { key: 'cows', label: `গরু ব্যবস্থাপনা (${pendingCows.length ? `! ${pendingCows.length}` : cows.length})`, icon: Package },
          { key: 'sellers', label: `খামারি যাচাই (${pendingSellers.length})`, icon: ShieldCheck },
          { key: 'orders', label: `অর্ডারসমূহ (${orders.length})`, icon: ShoppingBag },
          { key: 'payments', label: `পেমেন্ট ও রাজস্ব`, icon: CreditCard },
          { key: 'users', label: `ব্যবহারকারী (${users.length})`, icon: Users },
          { key: 'plans', label: `সাবস্ক্রিপশন প্যাকেজ`, icon: Crown },
          { key: 'settings', label: `সাইট সেটিংস`, icon: Settings },
          { key: 'github', label: `GitHub সিঙ্ক ও অটোমেশন`, icon: GitBranch },
          { key: 'audit', label: `অডিট লগ`, icon: FileText },
          { key: 'build', label: `Netlify DIST বিল্ডার`, icon: Download },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap flex items-center gap-1.5 transition-colors ${
                isActive
                  ? 'bg-neutral-900 text-white shadow-sm'
                  : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Dedicated 1-Click Operations Hub: Site Download & Publish + Instant GitHub Sync */}
          <div className="bg-gradient-to-r from-emerald-950 via-neutral-900 to-neutral-950 rounded-2xl p-5 border border-emerald-500/30 text-white shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="space-y-1.5 max-w-xl">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-900/50 px-2.5 py-0.5 rounded-full border border-emerald-700/50">
                <Sparkles className="w-3.5 h-3.5" />
                <span>অ্যাডমিন ১-ক্লিক কন্ট্রোল হাব</span>
              </div>
              <h2 className="text-lg font-bold text-white">
                ১-ক্লিকে সাইট ডাউনলোড, লাইভ পাবলিশ ও GitHub ইনস্ট্যান্ট সিঙ্ক
              </h2>
              <p className="text-xs text-neutral-300 leading-relaxed">
                ওয়েবসাইটের সকল তথ্য, ডাটাবেস ও ডিজাইন ১-ক্লিকে জিপ আকারে ডাউনলোড করে Netlify/Vercel-এ হোস্ট করুন অথবা সরাসরি আপনার GitHub রিপোজিটরিতে (<span className="text-emerald-300 font-mono">{githubConfig?.owner}/{githubConfig?.repo}</span>) লাইভ পুশ করুন।
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                onClick={() => setQuickPublishModalOpen(true)}
                className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all shadow-md cursor-pointer hover:scale-[1.02]"
              >
                <Download className="w-4 h-4 stroke-[2.5]" />
                <span>⚡ ১-ক্লিকে সাইট ডাউনলোড ও পাবলিশ</span>
              </button>

              <button
                onClick={handleManualSyncGitHub}
                disabled={isSyncingGitHub}
                className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2 border border-emerald-500/40 transition-all shadow-sm cursor-pointer disabled:opacity-50"
              >
                <GitBranch className={`w-4 h-4 text-emerald-400 ${isSyncingGitHub ? 'animate-spin' : ''}`} />
                <span>{isSyncingGitHub ? 'GitHub-এ পুশ হচ্ছে...' : '🔄 এখনই GitHub সিঙ্ক করুন'}</span>
              </button>

              <button
                onClick={() => setActiveTab('github')}
                className="px-3 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 rounded-xl text-xs font-medium border border-neutral-700 transition-colors cursor-pointer"
                title="GitHub বিস্তারিত কনফিগারেশন"
              >
                সেটিংস
              </button>
            </div>
          </div>

          {gitSyncResult && (
            <div
              className={`p-3.5 rounded-xl text-xs flex items-center justify-between border ${
                gitSyncResult.success
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-red-50 border-red-300 text-red-900'
              }`}
            >
              <span>{gitSyncResult.message}</span>
              <button onClick={() => setGitSyncResult(null)} className="font-bold underline ml-2">
                বন্ধ করুন
              </button>
            </div>
          )}

          {/* Metrics KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm">
              <div className="text-xs text-neutral-500">মোট সংগৃহীত বুকিং অ্যাডভান্স</div>
              <div className="text-2xl font-bold font-mono text-emerald-700 mt-1">
                ৳ {totalAdvanceCollected.toLocaleString('bn-BD')}
              </div>
              <div className="text-[11px] text-neutral-500 mt-1">এসক্রো হেফাজতে সংরক্ষিত</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm">
              <div className="text-xs text-neutral-500">সাবস্ক্রিপশন বাবদ আয়</div>
              <div className="text-2xl font-bold font-mono text-neutral-900 mt-1">
                ৳ {totalSubRevenue.toLocaleString('bn-BD')}
              </div>
              <div className="text-[11px] text-emerald-600 mt-1">খামারি প্যাকেজ ক্রয় থেকে</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm">
              <div className="text-xs text-neutral-500">সক্রিয় গরুর মূল্যমান</div>
              <div className="text-2xl font-bold font-mono text-neutral-900 mt-1">
                ৳ {(totalMarketVolume / 100000).toFixed(1)} লাখ
              </div>
              <div className="text-[11px] text-neutral-500 mt-1">{totalCows}টি গরু তালিকাভুক্ত</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm">
              <div className="text-xs text-neutral-500">অনুমোদন অপেক্ষমান গরু</div>
              <div className="text-2xl font-bold font-mono text-amber-600 mt-1">
                {pendingCows.length}টি
              </div>
              <div className="text-[11px] text-amber-700 mt-1">দ্রুত রিভিউ প্রয়োজন</div>
            </div>
          </div>

          {/* Quick Tasks & Alerts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Pending Approvals */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>অনুমোদন অপেক্ষমান গরু ({pendingCows.length})</span>
                </h3>
                <button onClick={() => setActiveTab('cows')} className="text-xs text-emerald-700 font-semibold hover:underline">
                  সকল গরু
                </button>
              </div>

              <div className="space-y-3">
                {pendingCows.length > 0 ? (
                  pendingCows.map((c) => (
                    <div key={c.id} className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5">
                        <img src={c.images[0]} alt={c.name} className="w-10 h-10 rounded-lg object-cover" />
                        <div>
                          <div className="font-bold text-neutral-900">{c.name} ({c.cowCode})</div>
                          <div className="text-neutral-500">খামারি: {c.sellerFarmName} ({c.sellerPhone})</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => approveCow(c.id, true)}
                          className="px-2.5 py-1 bg-emerald-700 text-white rounded-lg font-semibold hover:bg-emerald-800"
                        >
                          অনুমোদন
                        </button>
                        <button
                          onClick={() => approveCow(c.id, false)}
                          className="px-2.5 py-1 bg-neutral-200 text-neutral-700 rounded-lg font-semibold hover:bg-red-50 hover:text-red-700"
                        >
                          বাতিল
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-xs text-neutral-500">
                    কোনো অপেক্ষমান গরু নেই। সকল লিস্টিং অনুমোদিত!
                  </div>
                )}
              </div>
            </div>

            {/* Pending Seller Verifications */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>খামারি ভেরিফিকেশন আবেদন ({pendingSellers.length})</span>
                </h3>
                <button onClick={() => setActiveTab('sellers')} className="text-xs text-emerald-700 font-semibold hover:underline">
                  সকল খামারি
                </button>
              </div>

              <div className="space-y-3">
                {pendingSellers.length > 0 ? (
                  pendingSellers.map((s) => (
                    <div key={s.id} className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl flex items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="font-bold text-neutral-900">{s.sellerProfile?.farmName}</div>
                        <div className="text-neutral-500">মালিক: {s.name} · মোবাইল: {s.phone}</div>
                        <div className="text-[11px] text-neutral-400 font-mono">NID: {s.sellerProfile?.nidNumber || 'প্রদত্ত নয়'}</div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => verifySeller(s.id, true)}
                          className="px-2.5 py-1 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                        >
                          ভেরিফাই
                        </button>
                        <button
                          onClick={() => verifySeller(s.id, false)}
                          className="px-2.5 py-1 bg-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-300"
                        >
                          বাতিল
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-xs text-neutral-500">
                    কোনো নতুন ভেরিফিকেশন আবেদন পেন্ডিং নেই।
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: COW MANAGEMENT */}
      {activeTab === 'cows' && (
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-sm font-bold text-neutral-900">সকল গরু ও লিস্টিং ব্যবস্থাপনা ({cows.length})</h2>
            
            <div className="flex items-center gap-2">
              <select
                value={cowFilter}
                onChange={(e) => setCowFilter(e.target.value as any)}
                className="text-xs p-2 border border-neutral-300 rounded-lg bg-white"
              >
                <option value="all">সকল গরু</option>
                <option value="pending">অনুমোদন পেন্ডিং</option>
                <option value="approved">অনুমোদিত</option>
                <option value="featured">ফিচার্ড গরু</option>
              </select>

              <button
                type="button"
                onClick={() => {
                  setCowFormData({
                    name: '',
                    breed: COW_BREEDS[0],
                    category: 'qurbani',
                    categoryLabelBn: 'কোরবানি ও মাংস',
                    gender: 'ষাঁড়',
                    ageYears: 3,
                    ageMonths: 0,
                    weightKg: 500,
                    heightInch: 54,
                    price: 220000,
                    advanceType: 'percentage',
                    advanceValue: 10,
                    district: 'ঢাকা',
                    upazila: 'মিরপুর',
                    fullAddress: 'মিরপুর গাবতলী হাট সংলগ্ন',
                    healthStatus: 'সম্পূর্ণ সুস্থ ও ভ্যাকসিনেটেড',
                    vaccinations: ['খুরা রোগ (FMD)', 'অ্যানথ্রাক্স (তড়কা)'],
                    feedingHabit: 'ঘাস ও প্রাকৃতিক খাদ্য',
                    description: '',
                    images: ['/images/cow_sahiwal.jpg'],
                    sellerName: 'অ্যাডমিন লিস্টিং',
                    sellerPhone: settings.adminPhone || '০১৭০০-০০০১১১',
                    sellerWhatsapp: settings.adminPhone || '০১৭০০-০০০১১১',
                    sellerFarmName: 'গরু বাজার সেন্ট্রাল ফার্ম',
                    sellerBkash: settings.bkashNumber || '০১৭১১-৮৮৯৯০০',
                    sellerNagad: settings.nagadNumber || '০১৭২২-৩৩৪৪৫৫',
                    sellerRocket: settings.rocketNumber || '',
                    status: 'approved',
                    isFeatured: false,
                  });
                  setIsAddCowOpen(true);
                }}
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ নতুন গরু যোগ করুন</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-600">
              <thead className="bg-neutral-50 text-neutral-700 font-semibold border-b border-neutral-200">
                <tr>
                  <th className="p-3">কোড ও নাম</th>
                  <th className="p-3">জাত ও বয়স</th>
                  <th className="p-3">মূল্য ও বুকিং অ্যাডভান্স</th>
                  <th className="p-3">খামারি ও জেলা</th>
                  <th className="p-3">স্ট্যাটাস</th>
                  <th className="p-3">ফিচার্ড</th>
                  <th className="p-3 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {cows
                  .filter((c) => {
                    if (cowFilter === 'pending') return c.status === 'pending';
                    if (cowFilter === 'approved') return c.status === 'approved';
                    if (cowFilter === 'featured') return c.isFeatured;
                    return true;
                  })
                  .map((cow) => (
                    <tr key={cow.id} className="hover:bg-neutral-50/50">
                      <td className="p-3 flex items-center gap-2.5">
                        <img src={cow.images[0]} alt={cow.name} className="w-10 h-10 rounded-lg object-cover" />
                        <div>
                          <div className="font-bold text-neutral-900">{cow.name}</div>
                          <div className="text-[11px] text-neutral-400 font-mono">{cow.cowCode}</div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div>{cow.breed}</div>
                        <div className="text-[11px] text-neutral-500">{cow.gender} · {cow.ageYears} বছর</div>
                      </td>
                      <td className="p-3 font-mono">
                        <div className="font-bold text-neutral-900">৳{cow.price.toLocaleString('bn-BD')}</div>
                        <div className="text-[11px] text-emerald-700">Adv: ৳{cow.calculatedAdvanceAmount.toLocaleString('bn-BD')}</div>
                      </td>
                      <td className="p-3">
                        <div className="font-medium text-neutral-900">{cow.sellerFarmName}</div>
                        <div className="text-[11px] text-neutral-500">{cow.district} · {cow.sellerPhone}</div>
                      </td>
                      <td className="p-3">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          cow.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : cow.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {cow.status === 'approved' ? 'অনুমোদিত' : cow.status === 'pending' ? 'পেন্ডিং' : 'বাতিল'}
                        </span>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => toggleFeaturedCow(cow.id)}
                          className={`text-xs px-2 py-0.5 rounded font-medium border ${
                            cow.isFeatured
                              ? 'bg-amber-500 text-white border-amber-600'
                              : 'border-neutral-300 text-neutral-600 hover:bg-neutral-100'
                          }`}
                        >
                          {cow.isFeatured ? '★ ফিচার্ড' : '+ ফিচার্ড করুন'}
                        </button>
                      </td>
                      <td className="p-3 text-right space-x-1 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCow(cow);
                            setCowFormData({ ...cow });
                          }}
                          className="p-1.5 text-neutral-500 hover:text-blue-600 rounded hover:bg-neutral-100"
                          title="সম্পাদনা / এডিট"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        {cow.status === 'pending' ? (
                          <button
                            onClick={() => approveCow(cow.id, true)}
                            className="px-2 py-1 bg-emerald-700 text-white rounded font-semibold text-[11px]"
                          >
                            অনুমোদন
                          </button>
                        ) : (
                          <button
                            onClick={() => approveCow(cow.id, false)}
                            className="px-2 py-1 bg-neutral-200 text-neutral-700 rounded text-[11px] hover:bg-red-50 hover:text-red-700"
                          >
                            বাতিল
                          </button>
                        )}
                        <button
                          onClick={() => deleteCow(cow.id)}
                          className="p-1.5 text-neutral-400 hover:text-red-600 rounded"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: SELLER VERIFICATION */}
      {activeTab === 'sellers' && (
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-neutral-200">
            <h2 className="text-sm font-bold text-neutral-900">খামারি ও সেলার তালিকা এবং ভেরিফিকেশন</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-600">
              <thead className="bg-neutral-50 text-neutral-700 font-semibold border-b border-neutral-200">
                <tr>
                  <th className="p-3">খামারের নাম ও মালিক</th>
                  <th className="p-3">মোবাইল ও ইমেইল</th>
                  <th className="p-3">অবস্থান</th>
                  <th className="p-3">ট্রেড লাইসেন্স ও NID</th>
                  <th className="p-3">লিস্টিং ব্যবহার</th>
                  <th className="p-3">ভেরিফিকেশন স্ট্যাটাস</th>
                  <th className="p-3 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {users
                  .filter((u) => u.role === 'seller')
                  .map((s) => (
                    <tr key={s.id} className="hover:bg-neutral-50/50">
                      <td className="p-3 font-medium text-neutral-900">
                        <div className="font-bold">{s.sellerProfile?.farmName}</div>
                        <div className="text-neutral-500">{s.name}</div>
                      </td>
                      <td className="p-3 font-mono">
                        <div>{s.phone}</div>
                        <div className="text-[11px] text-neutral-400">{s.email}</div>
                      </td>
                      <td className="p-3">{s.district}</td>
                      <td className="p-3 font-mono text-[11px]">
                        <div>NID: {s.sellerProfile?.nidNumber || 'তথ্য নেই'}</div>
                        <div>TRAD: {s.sellerProfile?.tradeLicenseNumber || 'তথ্য নেই'}</div>
                      </td>
                      <td className="p-3 font-mono">
                        {s.sellerProfile?.currentListingsCount || 0} / {s.sellerProfile?.totalListingsAllowed || 1}টি
                      </td>
                      <td className="p-3">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          s.sellerProfile?.isVerified
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {s.sellerProfile?.isVerified ? 'যাচাইকৃত (Verified)' : 'অপেক্ষমান'}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        {s.sellerProfile?.isVerified ? (
                          <button
                            onClick={() => verifySeller(s.id, false)}
                            className="px-2 py-1 bg-neutral-200 text-neutral-700 rounded text-[11px]"
                          >
                            বাতিল করুন
                          </button>
                        ) : (
                          <button
                            onClick={() => verifySeller(s.id, true)}
                            className="px-2 py-1 bg-blue-600 text-white rounded text-[11px] font-semibold"
                          >
                            অনুমোদন দিন
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: ORDER & ADVANCE MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
            <h2 className="text-sm font-bold text-neutral-900">ক্রেতা অর্ডার ও অ্যাডভান্স ট্র্যাকিং ({orders.length})</h2>
            <button
              type="button"
              onClick={() => {
                setOrderFormData({
                  cowName: cows[0]?.name || 'শাহীওয়াল ষাঁড়',
                  cowCode: cows[0]?.cowCode || 'GB-7025',
                  buyerName: 'নতুন ক্রেতা',
                  buyerPhone: '০১৭১১-০০০০০০',
                  buyerAddress: 'ঢাকা',
                  sellerName: cows[0]?.sellerName || 'হাজী রফিকুল ইসলাম',
                  sellerFarmName: cows[0]?.sellerFarmName || 'গ্রিন ডেইরি ফার্ম',
                  sellerPhone: cows[0]?.sellerPhone || '০১৭১২-৩৪৫৬৭৮',
                  cowTotalAmount: 200000,
                  advanceAmount: 20000,
                  remainingAmount: 180000,
                  orderStatus: 'confirmed',
                  paymentMethod: 'bkash',
                  deliveryType: 'farm_pickup',
                });
                setIsAddOrderOpen(true);
              }}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ নতুন অর্ডার তৈরি</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-600">
              <thead className="bg-neutral-50 text-neutral-700 font-semibold border-b border-neutral-200">
                <tr>
                  <th className="p-3">অর্ডার নং</th>
                  <th className="p-3">গরু ও কোড</th>
                  <th className="p-3">ক্রেতার তথ্য</th>
                  <th className="p-3">খামারি</th>
                  <th className="p-3">বুকিং অ্যাডভান্স</th>
                  <th className="p-3">বর্তমান স্ট্যাটাস</th>
                  <th className="p-3 text-right">স্ট্যাটাস পরিবর্তন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-neutral-50/50">
                    <td className="p-3 font-mono font-bold text-neutral-900">{ord.orderNumber}</td>
                    <td className="p-3">
                      <div className="font-bold text-neutral-900">{ord.cowName}</div>
                      <div className="text-[11px] text-neutral-400 font-mono">{ord.cowCode}</div>
                    </td>
                    <td className="p-3">
                      <div>{ord.buyerName}</div>
                      <div className="text-[11px] text-neutral-400 font-mono">{ord.buyerPhone}</div>
                    </td>
                    <td className="p-3">
                      <div>{ord.sellerFarmName}</div>
                      <div className="text-[11px] text-neutral-400">{ord.sellerPhone}</div>
                    </td>
                    <td className="p-3 font-mono">
                      <div className="font-bold text-emerald-700">৳{ord.advanceAmount.toLocaleString('bn-BD')}</div>
                      <div className="text-[11px] text-neutral-400">মোট: ৳{ord.cowTotalAmount.toLocaleString('bn-BD')}</div>
                    </td>
                    <td className="p-3">
                      <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                        {ord.orderStatus}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-1 whitespace-nowrap">
                      <select
                        value={ord.orderStatus}
                        onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                        className="text-xs p-1 border border-neutral-300 rounded bg-white"
                      >
                        <option value="advance_paid">Advance Paid</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="ready_for_delivery">Ready for Delivery</option>
                        <option value="completed">Completed</option>
                        <option value="refunded">Refunded</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingOrder(ord);
                          setOrderFormData({ ...ord });
                        }}
                        className="p-1 text-neutral-500 hover:text-blue-600 rounded"
                        title="অর্ডার এডিট"
                      >
                        <Edit className="w-3.5 h-3.5 inline" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteOrder(ord.id)}
                        className="p-1 text-neutral-400 hover:text-red-600 rounded"
                        title="অর্ডার ডিলিট"
                      >
                        <Trash2 className="w-3.5 h-3.5 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: PAYMENTS & REVENUE */}
      {activeTab === 'payments' && (
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-neutral-200">
            <h2 className="text-sm font-bold text-neutral-900">সকল লেনদেন ও পেমেন্ট রেকর্ড ({payments.length})</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-600">
              <thead className="bg-neutral-50 text-neutral-700 font-semibold border-b border-neutral-200">
                <tr>
                  <th className="p-3">লেনদেন আইডি (Txn ID)</th>
                  <th className="p-3">ধরন</th>
                  <th className="p-3">ব্যবহারকারী</th>
                  <th className="p-3">পরিমাণ</th>
                  <th className="p-3">মাধ্যম</th>
                  <th className="p-3">স্ট্যাটাস</th>
                  <th className="p-3">তারিখ ও সময়</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-neutral-50/50">
                    <td className="p-3 font-mono font-bold text-neutral-900">{p.transactionId}</td>
                    <td className="p-3">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        p.paymentType === 'advance' ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {p.paymentType === 'advance' ? 'বুকিং অ্যাডভান্স' : 'সাবস্ক্রিপশন'}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-neutral-900">{p.userName}</div>
                      <div className="text-[11px] text-neutral-400 font-mono">{p.userPhone}</div>
                    </td>
                    <td className="p-3 font-mono font-bold text-neutral-900">
                      ৳ {p.amount.toLocaleString('bn-BD')}
                    </td>
                    <td className="p-3">
                      <div className="uppercase font-mono font-bold text-neutral-800">{p.method}</div>
                      {p.notes && (
                        <div className="text-[10px] text-neutral-500 max-w-xs truncate mt-0.5" title={p.notes}>
                          {p.notes}
                        </div>
                      )}
                    </td>
                    <td className="p-3">
                      <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3 text-neutral-500">{p.verifiedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: SUBSCRIPTION PLANS MANAGEMENT */}
      {activeTab === 'plans' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-neutral-900">সাবস্ক্রিপশন প্যাকেজ ম্যানেজমেন্ট</h2>
            <button
              onClick={() => setIsNewPlanOpen(!isNewPlanOpen)}
              className="px-3 py-1.5 bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>নতুন প্যাকেজ তৈরি করুন</span>
            </button>
          </div>

          {/* Form to create new plan if opened */}
          {isNewPlanOpen && (
            <div className="p-5 bg-neutral-50 border border-neutral-200 rounded-2xl space-y-4 text-xs">
              <h3 className="font-bold text-neutral-900 text-sm">নতুন সাবস্ক্রিপশন প্যাকেজ ফর্ম</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">প্যাকেজের বাংলা নাম:</label>
                  <input
                    type="text"
                    value={newPlanForm.nameBn}
                    onChange={(e) => setNewPlanForm({ ...newPlanForm, nameBn: e.target.value })}
                    className="w-full p-2 border rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">মূল্য (টাকা):</label>
                  <input
                    type="number"
                    value={newPlanForm.price}
                    onChange={(e) => setNewPlanForm({ ...newPlanForm, price: Number(e.target.value) })}
                    className="w-full p-2 border rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">মেয়াদ (দিন):</label>
                  <input
                    type="number"
                    value={newPlanForm.durationDays}
                    onChange={(e) => setNewPlanForm({ ...newPlanForm, durationDays: Number(e.target.value) })}
                    className="w-full p-2 border rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">লিস্টিং সীমা (গরুর সংখ্যা):</label>
                  <input
                    type="number"
                    value={newPlanForm.listingLimit}
                    onChange={(e) => setNewPlanForm({ ...newPlanForm, listingLimit: Number(e.target.value) })}
                    className="w-full p-2 border rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">ফিচার্ড স্লট:</label>
                  <input
                    type="number"
                    value={newPlanForm.featuredSlots}
                    onChange={(e) => setNewPlanForm({ ...newPlanForm, featuredSlots: Number(e.target.value) })}
                    className="w-full p-2 border rounded-lg bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewPlanOpen(false)}
                  className="px-3 py-1.5 border rounded-lg text-neutral-600"
                >
                  বাতিল
                </button>
                <button
                  type="button"
                  onClick={() => {
                    createSubscriptionPlan({ ...newPlanForm, id: `plan-${Date.now()}` });
                    setIsNewPlanOpen(false);
                  }}
                  className="px-4 py-1.5 bg-emerald-700 text-white rounded-lg font-semibold"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {plans.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-neutral-900">{p.nameBn}</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingPlan(p);
                        setIsEditPlanOpen(true);
                      }}
                      className="text-neutral-400 hover:text-blue-600 p-1 rounded"
                      title="প্যাকেজ সম্পাদনা"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteSubscriptionPlan(p.id)}
                      className="text-neutral-400 hover:text-red-600 p-1 rounded"
                      title="মুছে ফেলুন"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="text-xl font-bold font-mono text-emerald-800">
                  ৳ {p.price.toLocaleString('bn-BD')}
                </div>

                <div className="text-xs text-neutral-600 space-y-1">
                  <div>মেয়াদ: <strong className="font-mono">{p.durationDays} দিন</strong></div>
                  <div>লিস্টিং সীমা: <strong className="font-mono text-emerald-700">{p.listingLimit}টি গরু</strong></div>
                  <div>ফিচার্ড স্লট: <strong className="font-mono">{p.featuredSlots}টি</strong></div>
                </div>

                <div className="pt-2 border-t border-neutral-100">
                  <label className="block text-[11px] font-semibold text-neutral-500 mb-1">মূল্য পরিবর্তন:</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      defaultValue={p.price}
                      onBlur={(e) => updateSubscriptionPlan(p.id, { price: Number(e.target.value) })}
                      className="w-full text-xs p-1.5 border rounded-lg font-mono"
                    />
                    <span className="text-xs text-neutral-500">টাকা</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: USER MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
            <h2 className="text-sm font-bold text-neutral-900">ব্যবহারকারী ও রোল ম্যানেজমেন্ট ({users.length})</h2>
            <button
              type="button"
              onClick={() => {
                setUserFormData({
                  name: '',
                  phone: '',
                  email: '',
                  password: 'password123',
                  role: 'seller',
                  district: 'ঢাকা',
                  status: 'active',
                });
                setIsAddUserOpen(true);
              }}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ নতুন ইউজার যোগ</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-600">
              <thead className="bg-neutral-50 text-neutral-700 font-semibold border-b border-neutral-200">
                <tr>
                  <th className="p-3">নাম</th>
                  <th className="p-3">মোবাইল</th>
                  <th className="p-3">ইমেইল</th>
                  <th className="p-3">রোল</th>
                  <th className="p-3">জেলা</th>
                  <th className="p-3">স্ট্যাটাস</th>
                  <th className="p-3 text-right">ব্লক / আনব্লক</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-neutral-50/50">
                    <td className="p-3 font-bold text-neutral-900">{u.name}</td>
                    <td className="p-3 font-mono">{u.phone}</td>
                    <td className="p-3 font-mono">{u.email}</td>
                    <td className="p-3">
                      <span className="text-[10px] font-semibold bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded uppercase">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3">{u.district || 'ঢাকা'}</td>
                    <td className="p-3">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        u.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-1 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => toggleUserStatus(u.id)}
                        className={`px-2 py-1 rounded text-[11px] font-medium ${
                          u.status === 'active' ? 'bg-red-50 text-red-700 hover:bg-red-100' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                        }`}
                      >
                        {u.status === 'active' ? 'ব্লক' : 'সক্রিয়'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingUser(u);
                          setUserFormData({ ...u });
                        }}
                        className="p-1 text-neutral-500 hover:text-blue-600 rounded"
                        title="ইউজার এডিট"
                      >
                        <Edit className="w-3.5 h-3.5 inline" />
                      </button>
                      {u.role !== 'super_admin' && (
                        <button
                          type="button"
                          onClick={() => deleteUser(u.id)}
                          className="p-1 text-neutral-400 hover:text-red-600 rounded"
                          title="ইউজার ডিলিট"
                        >
                          <Trash2 className="w-3.5 h-3.5 inline" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 8: SITE SETTINGS */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 max-w-3xl shadow-sm">
          <h2 className="text-base font-bold text-neutral-900 mb-4 pb-2 border-b border-neutral-100">
            মার্কেটপ্লেস ও অ্যাডভান্স পেমেন্ট রুলস সেটিংস
          </h2>

          {settingsSaved && (
            <div className="mb-4 p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>সেটিংস সফলভাবে সংরক্ষিত হয়েছে!</span>
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-5 text-xs">
            {/* ২) ওয়েবসাইট নাম ও লোগো ব্যবস্থাপনা */}
            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-3">
              <h3 className="font-bold text-neutral-900 text-xs flex items-center gap-1.5">
                <Image className="w-4 h-4 text-emerald-700" />
                <span>২) ওয়েবসাইট নাম ও লোগো ব্যবস্থাপনা (Website Name & Logo):</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">ওয়েবসাইটের নাম (Site Name):</label>
                  <input
                    type="text"
                    value={siteSettingsForm.siteName}
                    onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, siteName: e.target.value })}
                    className="w-full p-2.5 border rounded-xl bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">ট্যাগলাইন (Tagline):</label>
                  <input
                    type="text"
                    value={siteSettingsForm.tagline}
                    onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, tagline: e.target.value })}
                    className="w-full p-2.5 border rounded-xl bg-white"
                  />
                </div>
              </div>

              {/* Logo Upload & Preview */}
              <div>
                <label className="block font-semibold mb-1 text-neutral-800">
                  ওয়েবসাইট লোগো (ছবি আপলোড অথবা অনলাইন লিংক):
                </label>
                <div className="flex items-center gap-4">
                  {siteSettingsForm.logoUrl ? (
                    <img
                      src={siteSettingsForm.logoUrl}
                      alt="Logo preview"
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-600 shrink-0 shadow-sm"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-emerald-700 text-white font-bold text-2xl flex items-center justify-center shrink-0">
                      {siteSettingsForm.logoText || 'গ'}
                    </div>
                  )}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-xs">
                        <Upload className="w-3.5 h-3.5" />
                        <span>ডিভাইস থেকে লোগো আপলোড</span>
                        <input type="file" accept="image/*" onChange={handleSiteLogoUpload} className="hidden" />
                      </label>
                      {siteSettingsForm.logoUrl && (
                        <button
                          type="button"
                          onClick={() => setSiteSettingsForm({ ...siteSettingsForm, logoUrl: '' })}
                          className="text-xs text-neutral-500 hover:text-red-600 underline"
                        >
                          ডিফল্ট টেক্সট লোগো
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={siteSettingsForm.logoUrl || ''}
                        onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, logoUrl: e.target.value })}
                        placeholder="বা লোগো ইমেজ URL দিন"
                        className="w-full p-2 border rounded-xl bg-white text-xs"
                      />
                      <input
                        type="text"
                        value={siteSettingsForm.logoText || ''}
                        onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, logoText: e.target.value })}
                        placeholder="শর্ট লোগো অক্ষর (যেমন: গ)"
                        className="w-full p-2 border rounded-xl bg-white text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ৪) অ্যাডমিন নাম তানভীর আহমেদ ও নাম্বার ০১৭০০-০০০১১১ পরিবর্তন */}
            <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-3">
              <h3 className="font-bold text-emerald-950 text-xs flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-emerald-700" />
                <span>৪) অ্যাডমিন নাম তানভীর আহমেদ ও নাম্বার ০১৭০০-০০০১১১ পরিবর্তন:</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1 text-neutral-800">অ্যাডমিন নাম (Admin Name):</label>
                  <input
                    type="text"
                    value={siteSettingsForm.adminName || 'তানভীর আহমেদ'}
                    onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, adminName: e.target.value })}
                    placeholder="তানভীর আহমেদ"
                    className="w-full p-2.5 border rounded-xl bg-white font-medium"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-neutral-800">অ্যাডমিন মোবাইল নাম্বার (Admin Phone):</label>
                  <input
                    type="text"
                    value={siteSettingsForm.adminPhone || '০১৭০০-০০০১১১'}
                    onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, adminPhone: e.target.value })}
                    placeholder="০১৭০০-০০০১১১"
                    className="w-full p-2.5 border rounded-xl bg-white font-mono font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div>
                <label className="block font-semibold mb-1">হটলাইন নম্বর:</label>
                <input
                  type="text"
                  value={siteSettingsForm.hotline}
                  onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, hotline: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">ডিফল্ট বুকিং অ্যাডভান্স হার (%):</label>
                <input
                  type="number"
                  value={siteSettingsForm.defaultAdvancePercentage}
                  onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, defaultAdvancePercentage: Number(e.target.value) })}
                  className="w-full p-2.5 border rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">নতুন খামারির ফ্রি লিস্টিং সংখ্যা:</label>
                <input
                  type="number"
                  value={siteSettingsForm.freeListingLimit}
                  onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, freeListingLimit: Number(e.target.value) })}
                  className="w-full p-2.5 border rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-emerald-900">
                  অ্যাডমিন বিকাশ নম্বর (টাকা গ্রহণের বিকাশ নম্বর):
                </label>
                <input
                  type="text"
                  value={siteSettingsForm.bkashNumber}
                  onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, bkashNumber: e.target.value })}
                  placeholder="যেমন: ০১৭১১-৮৮৯৯০০ (মার্চেন্ট/পার্সোনাল)"
                  className="w-full p-2.5 border rounded-xl font-mono bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-emerald-900">
                  অ্যাডমিন নগদ নম্বর (টাকা গ্রহণের নগদ নম্বর):
                </label>
                <input
                  type="text"
                  value={siteSettingsForm.nagadNumber}
                  onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, nagadNumber: e.target.value })}
                  placeholder="যেমন: ০১৭২২-৩৩৪৪৫৫ (মার্চেন্ট/পার্সোনাল)"
                  className="w-full p-2.5 border rounded-xl font-mono bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-emerald-900">
                  অ্যাডমিন রকেট নম্বর (টাকা গ্রহণের রকেট নম্বর):
                </label>
                <input
                  type="text"
                  value={siteSettingsForm.rocketNumber}
                  onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, rocketNumber: e.target.value })}
                  placeholder="যেমন: ০১৯১১-২২৩৩৪৪-৮ (মার্চেন্ট/পার্সোনাল)"
                  className="w-full p-2.5 border rounded-xl font-mono bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-emerald-900">
                  অ্যাডমিন ব্যাংক অ্যাকাউন্ট ও ব্রাঞ্চ তথ্য:
                </label>
                <input
                  type="text"
                  value={siteSettingsForm.bankAccountDetails}
                  onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, bankAccountDetails: e.target.value })}
                  placeholder="ব্যাংকের নাম, হিসাব নম্বর, ব্রাঞ্চ"
                  className="w-full p-2.5 border rounded-xl bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">টপ অ্যানাউন্সমেন্ট নোটিশ:</label>
              <input
                type="text"
                value={siteSettingsForm.announcementText}
                onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, announcementText: e.target.value })}
                className="w-full p-2.5 border rounded-xl"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl"
              >
                পরিবর্তন সংরক্ষণ করুন
              </button>
            </div>
          </form>

          {/* Dedicated Section for Admin Credentials Change (Mandatory Requirement) */}
          <div className="mt-8 pt-6 border-t border-neutral-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center font-bold text-sm">
                <Crown className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-neutral-900">
                  অ্যাডমিন ইউজারনেম ও পাসওয়ার্ড পরিবর্তন (Admin Credentials)
                </h3>
                <p className="text-[11px] text-neutral-500">
                  অ্যাডমিন প্যানেলে প্রবেশের মূল ইউজারনেম ও পাসওয়ার্ড এখান থেকে পরিবর্তন করুন।
                </p>
              </div>
            </div>

            <div className="my-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-neutral-500">বর্তমান ইউজারনেম: </span>
                <code className="font-bold text-neutral-900 bg-white px-2 py-0.5 rounded border border-neutral-200 font-mono">
                  {settings.adminUsername || 'admin'}
                </code>
              </div>
              <div className="text-[11px] text-neutral-400">
                (ডিফল্ট পাসওয়ার্ড: <span className="font-mono">admin12345</span>)
              </div>
            </div>

            {credFeedback && (
              <div
                className={`mb-4 p-3 rounded-xl text-xs flex items-center gap-2 ${
                  credFeedback.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {credFeedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{credFeedback.message}</span>
              </div>
            )}

            <form onSubmit={handleUpdateAdminCredentials} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1 text-neutral-700">
                    নতুন অ্যাডমিন ইউজারনেম (New Username):
                  </label>
                  <input
                    type="text"
                    required
                    value={adminNewUsername}
                    onChange={(e) => setAdminNewUsername(e.target.value)}
                    placeholder="যেমন: admin বা admin_director"
                    className="w-full p-2.5 border border-neutral-300 rounded-xl font-mono focus:ring-2 focus:ring-neutral-800 focus:outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-neutral-700">
                    বর্তমান পাসওয়ার্ড যাচাই (Current Password):
                  </label>
                  <input
                    type="password"
                    required
                    value={adminCurrentPassword}
                    onChange={(e) => setAdminCurrentPassword(e.target.value)}
                    placeholder="বর্তমান পাসওয়ার্ড দিন"
                    className="w-full p-2.5 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-neutral-800 focus:outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-neutral-700">
                    নতুন পাসওয়ার্ড (New Password):
                  </label>
                  <input
                    type="password"
                    required
                    value={adminNewPassword}
                    onChange={(e) => setAdminNewPassword(e.target.value)}
                    placeholder="কমপক্ষে ৪ অক্ষরের নতুন পাসওয়ার্ড"
                    className="w-full p-2.5 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-neutral-800 focus:outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-neutral-700">
                    নতুন পাসওয়ার্ড নিশ্চিত করুন (Confirm Password):
                  </label>
                  <input
                    type="password"
                    required
                    value={adminConfirmPassword}
                    onChange={(e) => setAdminConfirmPassword(e.target.value)}
                    placeholder="নতুন পাসওয়ার্ডটি পুনরায় লিখুন"
                    className="w-full p-2.5 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-neutral-800 focus:outline-none bg-white"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-bold rounded-xl flex items-center gap-2 shadow-sm transition-colors"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>অ্যাডমিন ক্রেডেনশিয়াল আপডেট করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 9: AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-neutral-200">
            <h2 className="text-sm font-bold text-neutral-900">সিস্টেম ও অ্যাডমিন অডিট হিস্টোরি ({auditLogs.length})</h2>
          </div>

          <div className="divide-y divide-neutral-100 text-xs">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3.5 flex items-start justify-between gap-4 hover:bg-neutral-50/50">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-neutral-900">{log.adminName}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 font-mono text-neutral-600">
                      {log.action}
                    </span>
                  </div>
                  <p className="text-neutral-600">{log.details}</p>
                </div>
                <div className="text-[11px] text-neutral-400 shrink-0 font-mono">{log.timestamp}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 10: WEBSITE BUILD & NETLIFY DIST DOWNLOAD (Mandatory Requirement 15) */}
      {activeTab === 'build' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
            <div className="flex items-start justify-between border-b border-neutral-100 pb-4 mb-4">
              <div>
                <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                  <Download className="w-5 h-5 text-emerald-700" />
                  <span>Website Production Build & Netlify DIST Generator</span>
                </h2>
                <p className="text-xs text-neutral-500 mt-1">
                  অ্যাডমিন ড্যাশবোর্ড থেকে সরাসরি সম্পূর্ণ Production Build প্যাকেজ (.ZIP) তৈরি ও ডাউনলোড করুন।
                  এই ZIP ফাইলটি সরাসরি Netlify-তে ড্র্যাগ-অ্যান্ড-ড্রপ করে লাইভ করা যাবে।
                </p>
              </div>
            </div>

            {/* Build Controls */}
            <div className="p-5 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-4 max-w-xl">
              <div className="flex items-center gap-3">
                <div className="w-48">
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">বিল্ড সংস্করণ (Version):</label>
                  <input
                    type="text"
                    value={buildVersion}
                    onChange={(e) => setBuildVersion(e.target.value)}
                    placeholder="1.0.2"
                    className="w-full text-xs p-2 border border-neutral-300 rounded-lg bg-white font-mono font-bold"
                  />
                </div>
                <div className="flex-1 pt-5">
                  <button
                    type="button"
                    disabled={isBuilding}
                    onClick={handleStartBuild}
                    className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm"
                  >
                    {isBuilding ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>বিল্ড প্রক্রিয়া চলছে...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-white" />
                        <span>Build Website</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Build Progress Visual */}
              {isBuilding && (
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs text-neutral-600 font-medium">
                    <span>{buildStepName}</span>
                    <span className="font-mono">{buildProgress}%</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${buildProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Ready to Download Strip */}
              {lastBuiltBlob && !isBuilding && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3">
                  <div className="flex items-center gap-2.5 text-xs text-emerald-900 font-semibold">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>প্রোডাকশন বিল্ড প্রস্তুত! ফাইল: {lastBuiltBlob.filename} ({lastBuiltBlob.sizeKb} KB)</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleDownloadDist}
                    className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download DIST (ZIP)</span>
                  </button>
                </div>
              )}
            </div>

            {/* Netlify Specification Checklist */}
            <div className="mt-6 p-4 bg-neutral-50 rounded-xl border border-neutral-200 text-xs text-neutral-600 space-y-2">
              <div className="font-bold text-neutral-900">ডাউনলোড প্যাকেজের অন্তর্ভুক্ত ফাইলসমূহ:</div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-disc list-inside">
                <li><code>images/</code> (সকল গরুর ছবি ও ব্যানার প্যাকেজে স্বয়ংক্রিয়ভাবে অন্তর্ভুক্ত)</li>
                <li><code>index.html</code> (রেসপনসিভ এসইও ও ফুল মার্কেটপ্লেস কোড সহ)</li>
                <li><code>_redirects</code> (Netlify SPA রিডাইরেক্ট রুল: <code>/* /index.html 200</code>)</li>
                <li><code>netlify.toml</code> (সিকিউরিটি হেডার ও ইমেজ ক্যাশিং কনফিগ)</li>
                <li><code>robots.txt</code> & <code>sitemap.xml</code> (সার্চ ইঞ্জিন ফ্রেন্ডলি)</li>
                <li><code>README_NETLIFY.md</code> (১ মিনিটের ইনস্টলেশন ও ড্র্যাগ-ড্রপ গাইড)</li>
              </ul>
            </div>
          </div>

          {/* Build History Table */}
          <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-neutral-200">
              <h3 className="text-sm font-bold text-neutral-900">বিল্ড ও ডিপ্লয়মেন্ট ইতিহাস (Build History)</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-neutral-600">
                <thead className="bg-neutral-50 text-neutral-700 font-semibold border-b border-neutral-200">
                  <tr>
                    <th className="p-3">ভার্সন</th>
                    <th className="p-3">বিল্ড তারিখ</th>
                    <th className="p-3">অ্যাডমিন</th>
                    <th className="p-3">টার্গেট প্ল্যাটফর্ম</th>
                    <th className="p-3">আকার (Size)</th>
                    <th className="p-3">স্ট্যাটাস</th>
                    <th className="p-3 text-right">ডাউনলোড</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {buildHistory.map((bh) => (
                    <tr key={bh.id} className="hover:bg-neutral-50/50">
                      <td className="p-3 font-mono font-bold text-neutral-900">v{bh.version}</td>
                      <td className="p-3">{bh.buildDate}</td>
                      <td className="p-3">{bh.adminName}</td>
                      <td className="p-3">{bh.targetPlatform}</td>
                      <td className="p-3 font-mono">{bh.zipSizeKb} KB</td>
                      <td className="p-3">
                        <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                          {bh.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={handleStartBuild}
                          className="px-2 py-1 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 rounded font-medium text-[11px]"
                        >
                          পুনরায় ডাউনলোড
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB: GITHUB AUTO-SYNC & REPOSITORY INTEGRATION */}
      {activeTab === 'github' && (
        <div className="space-y-6">
          {/* Main GitHub Status Card */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-neutral-900 flex items-center justify-center text-white shrink-0 shadow-sm">
                  <GitBranch className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-neutral-900">GitHub অটো-সিঙ্ক ও রিপোজিটরি ইন্টিগ্রেশন</h2>
                    {githubConfig?.token ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                        সিঙ্ক সক্রিয় (Ready)
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                        টোকেন প্রয়োজন
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">
                    ওয়েবসাইটে যেকোনো পরিবর্তন (গরু লিস্টিং, সেটিংস, অর্ডার ও কোড) তাৎক্ষণিকভাবে আপনার GitHub রিপোজিটরিতে সিঙ্ক হবে।
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleTestGitHub}
                  disabled={isTestingGitHub}
                  className="px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border border-neutral-200 disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isTestingGitHub ? 'animate-spin' : ''}`} />
                  <span>{isTestingGitHub ? 'যাচাই হচ্ছে...' : 'কানেকশন টেস্ট করুন'}</span>
                </button>

                <a
                  href={`https://github.com/${githubForm.owner}/${githubForm.repo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                  <span>GitHub রিপোজিটরি খুলুন</span>
                </a>
              </div>
            </div>

            {/* Test Connection Banner */}
            {gitTestResult && (
              <div
                className={`p-4 rounded-xl border text-xs flex items-start gap-3 ${
                  gitTestResult.success
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-red-50 border-red-200 text-red-900'
                }`}
              >
                {gitTestResult.success ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                )}
                <div className="flex-1 space-y-1">
                  <div className="font-bold">{gitTestResult.message}</div>
                  {gitTestResult.details && (
                    <div className="text-[11px] text-emerald-700 flex flex-wrap gap-x-4 gap-y-1 pt-1">
                      <span>রিপোজিটরি: <strong>{gitTestResult.details.fullName}</strong></span>
                      <span>ডিফল্ট ব্রাঞ্চ: <strong>{gitTestResult.details.defaultBranch}</strong></span>
                      {gitTestResult.details.latestCommitSha && (
                        <span>সর্বশেষ কমিট: <strong className="font-mono">{gitTestResult.details.latestCommitSha}</strong></span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Manual Sync Result Banner */}
            {gitSyncResult && (
              <div
                className={`p-4 rounded-xl border text-xs flex items-start gap-3 ${
                  gitSyncResult.success
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-red-50 border-red-200 text-red-900'
                }`}
              >
                {gitSyncResult.success ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                )}
                <div className="flex-1 space-y-1">
                  <div className="font-bold">{gitSyncResult.message}</div>
                  {gitSyncResult.commitSha && (
                    <div className="text-[11px] text-emerald-700 font-mono">
                      কমিট হ্যাশ: {gitSyncResult.commitSha}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-100">
                <div className="text-neutral-500 text-[11px]">টার্গেট রিপোজিটরি</div>
                <div className="font-bold text-neutral-900 font-mono mt-0.5 truncate" title={`${githubForm.owner}/${githubForm.repo}`}>
                  {githubForm.owner}/{githubForm.repo}
                </div>
              </div>
              <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-100">
                <div className="text-neutral-500 text-[11px]">টার্গেট ব্রাঞ্চ</div>
                <div className="font-bold text-neutral-900 font-mono mt-0.5">
                  {githubForm.branch || 'main'}
                </div>
              </div>
              <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-100">
                <div className="text-neutral-500 text-[11px]">সর্বশেষ সফল সিঙ্ক</div>
                <div className="font-bold text-emerald-700 font-mono mt-0.5">
                  {githubConfig?.lastSyncedAt || 'এখনো সিঙ্ক হয়নি'}
                </div>
              </div>
              <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-100">
                <div className="text-neutral-500 text-[11px]">স্বয়ংক্রিয় অটো-সিঙ্ক</div>
                <div className="font-bold text-neutral-900 mt-0.5 flex items-center gap-1.5">
                  {githubForm.autoSyncEnabled ? (
                    <>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span className="text-emerald-700">সক্রিয় (চালু)</span>
                    </>
                  ) : (
                    <>
                      <span className="w-2 h-2 rounded-full bg-neutral-400"></span>
                      <span className="text-neutral-500">নিষ্ক্রিয় (বন্ধ)</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Instant Push Section */}
            <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>১-ক্লিকে তাৎক্ষণিক ডেটা ও পরিবর্তন GitHub-এ পুশ করুন</span>
                  </h3>
                  <p className="text-[11px] text-emerald-800 mt-0.5">
                    বর্তমানে থাকা {cows.length}টি গরু, সাইট সেটিংস ও মার্কেটপ্লেস ডেটা সরাসরি GitHub-এর <code>data/database.json</code> ও <code>src/data/marketplace-data.json</code> ফাইলে পুশ হবে।
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                <input
                  type="text"
                  value={customCommitMsg}
                  onChange={(e) => setCustomCommitMsg(e.target.value)}
                  placeholder="ঐচ্ছিক কমিট মেসেজ (যেমন: নতুন শাহীওয়াল গরু যুক্ত ও প্রাইস আপডেট)..."
                  className="flex-1 px-3.5 py-2 text-xs bg-white border border-emerald-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={handleManualSyncGitHub}
                  disabled={isSyncingGitHub}
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-sm shrink-0"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncingGitHub ? 'animate-spin' : ''}`} />
                  <span>{isSyncingGitHub ? 'GitHub-এ পুশ হচ্ছে...' : 'এখনই GitHub-এ পুশ করুন'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* GitHub Configuration Form */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                  <Key className="w-4 h-4 text-emerald-700" />
                  <span>GitHub সংযোগ কনফিগারেশন (Repository Settings)</span>
                </h3>
                <p className="text-xs text-neutral-500">আপনার GitHub অ্যাকাউন্ট ও পার্সোনাল অ্যাক্সেস টোকেন কনফিগার করুন</p>
              </div>
              {configSavedToast && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 animate-in fade-in">
                  ✓ কনফিগারেশন সংরক্ষিত হয়েছে!
                </span>
              )}
            </div>

            <form onSubmit={handleSaveGitHubConfig} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold mb-1 text-neutral-700">
                    GitHub ইউজারনেম / অর্গানাইজেশন:
                  </label>
                  <input
                    type="text"
                    required
                    value={githubForm.owner}
                    onChange={(e) => setGithubForm({ ...githubForm, owner: e.target.value })}
                    placeholder="যেমন: taposroy616"
                    className="w-full p-2.5 border rounded-xl bg-white font-mono"
                  />
                  <p className="text-[10px] text-neutral-400 mt-1">আপনার GitHub প্রোফাইলের নাম</p>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-neutral-700">
                    রিপোজিটরির নাম (Repository Name):
                  </label>
                  <input
                    type="text"
                    required
                    value={githubForm.repo}
                    onChange={(e) => setGithubForm({ ...githubForm, repo: e.target.value })}
                    placeholder="যেমন: goru-bazar"
                    className="w-full p-2.5 border rounded-xl bg-white font-mono"
                  />
                  <p className="text-[10px] text-neutral-400 mt-1">GitHub-এ তৈরি করা রিপোজিটরির নাম</p>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-neutral-700">
                    টার্গেট ব্রাঞ্চ (Target Branch):
                  </label>
                  <input
                    type="text"
                    required
                    value={githubForm.branch}
                    onChange={(e) => setGithubForm({ ...githubForm, branch: e.target.value })}
                    placeholder="main"
                    className="w-full p-2.5 border rounded-xl bg-white font-mono"
                  />
                  <p className="text-[10px] text-neutral-400 mt-1">সাধারণত <code>main</code> বা <code>master</code></p>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-neutral-700">
                  GitHub Personal Access Token (PAT):
                </label>
                <div className="relative">
                  <input
                    type={showToken ? 'text' : 'password'}
                    value={githubForm.token}
                    onChange={(e) => setGithubForm({ ...githubForm, token: e.target.value })}
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    className="w-full p-2.5 pr-20 border rounded-xl bg-white font-mono text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowToken(!showToken)}
                    className="absolute right-2.5 top-2.5 text-neutral-500 hover:text-neutral-800 text-[11px] font-semibold px-2 py-0.5 rounded"
                  >
                    {showToken ? 'লুকান' : 'দেখান'}
                  </button>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 mt-1.5 text-[11px] text-neutral-500">
                  <span>
                    🔑 টোকেন পেতে: GitHub-এ যান ➔ <strong>Settings</strong> ➔ <strong>Developer Settings</strong> ➔ <strong>Personal Access Tokens (classic)</strong> ➔ টিক দিন <code>repo</code>
                  </span>
                  <a
                    href="https://github.com/settings/tokens/new?scopes=repo&description=Goru+Bazar+Auto+Sync"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-700 hover:underline font-semibold flex items-center gap-1"
                  >
                    <span>১-ক্লিকে টোকেন তৈরি করুন</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Auto Sync Toggle */}
              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-neutral-900 text-xs">স্বয়ংক্রিয় ব্যাকগ্রাউন্ড অটো-সিঙ্ক (Auto-commit on changes)</div>
                  <div className="text-[11px] text-neutral-500 mt-0.5">
                    চালু থাকলে ড্যাশবোর্ড থেকে নতুন গরু যোগ, অনুমোদন বা সেটিংস পরিবর্তনের সাথে সাথে GitHub-এ স্বয়ংক্রিয় কমিট চলে যাবে।
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={githubForm.autoSyncEnabled}
                    onChange={(e) => setGithubForm({ ...githubForm, autoSyncEnabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>কনফিগারেশন সংরক্ষণ করুন</span>
                </button>
              </div>
            </form>
          </div>

          {/* 3 Methods Guide Card */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-700" />
              <span>GitHub-এ সম্পূর্ণ ওয়েবসাইট ও পরিবর্তন সিঙ্ক করার ৩টি সহজ উপায়</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
              {/* Method 1: Google AI Studio Interface Button */}
              <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50 space-y-2.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-[11px]">১</span>
                    <h4 className="font-bold text-neutral-900 text-xs">AI Studio অফিসিয়াল এক্সপোর্ট</h4>
                  </div>
                  <p className="text-[11px] text-neutral-600 mt-2 leading-relaxed">
                    AI Studio ইন্টারফেসের উপরে ডানদিকের <strong>"Export to GitHub"</strong> বা <strong>"Push to GitHub"</strong> বাটনে ক্লিক করে আপনার <code>{githubForm.owner}/{githubForm.repo}</code> রিপোজিটরির সাথে লিংক করুন। AI-এর মাধ্যমে প্রতিটি পরিবর্তন স্বয়ংক্রিয়ভাবে গিটহাবে জমা হবে।
                  </p>
                </div>
                <div className="text-[11px] text-emerald-800 font-semibold bg-emerald-100/60 p-2 rounded-lg">
                  ★ সবচেয়ে সহজ উপায়: সম্পূর্ণ কোড সিঙ্ক
                </div>
              </div>

              {/* Method 2: In-App Live API Sync */}
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-[11px]">২</span>
                    <h4 className="font-bold text-neutral-900 text-xs">ইন-অ্যাপ রিয়েল-টাইম অটো-সিঙ্ক</h4>
                  </div>
                  <p className="text-[11px] text-neutral-600 mt-2 leading-relaxed">
                    উপরে দেওয়া টোকেন ইনপুট বক্সে আপনার Personal Access Token দিয়ে সংরক্ষণ করুন। এর ফলে ড্যাশবোর্ড থেকে আপনি বা যে কেউ গরু, অর্ডার বা সেটিংস পরিবর্তন করলেই তা তৎক্ষণাৎ GitHub REST API দিয়ে কমিট হয়ে যাবে।
                  </p>
                </div>
                <div className="text-[11px] text-emerald-800 font-semibold bg-emerald-100/60 p-2 rounded-lg">
                  ★ লাইভ ডেটাবেস ও লিস্টিং অটো-সিঙ্ক
                </div>
              </div>

              {/* Method 3: Local Git CLI Terminal */}
              <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50 space-y-2.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-[11px]">৩</span>
                    <h4 className="font-bold text-neutral-900 text-xs">লোকাল গিট টার্মিনাল কমান্ড</h4>
                  </div>
                  <p className="text-[11px] text-neutral-600 mt-2 leading-relaxed">
                    আপনার কম্পিউটারের টার্মিনালে নিচের কমান্ডগুলো রান করে সম্পূর্ণ প্রজেক্ট রিপোজিটরিতে একবার পুশ করে নিলেই পরবর্তীতে <code>git push</code> করলেই পরিবর্তন চলে যাবে।
                  </p>
                </div>
                <div className="text-[11px] text-emerald-800 font-semibold bg-emerald-100/60 p-2 rounded-lg">
                  ★ ডেভেলপার ও CLI ফ্রেন্ডলি
                </div>
              </div>
            </div>

            {/* Terminal CLI Command Box */}
            <div className="mt-4 p-4 bg-neutral-900 text-neutral-100 rounded-xl space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between text-neutral-400 font-sans text-xs pb-1 border-b border-neutral-800">
                <span className="flex items-center gap-1.5 font-mono">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  টার্মিনাল কমান্ডস (Copy-Paste Git Commands)
                </span>
                <button
                  type="button"
                  onClick={handleCopyCli}
                  className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-white rounded text-[11px] flex items-center gap-1 transition-colors"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedCli ? 'কপি হয়েছে!' : 'কমান্ডগুলো কপি করুন'}</span>
                </button>
              </div>
              <pre className="overflow-x-auto py-2 text-[11px] text-emerald-300 leading-relaxed">
                {generateGitCliCommands(githubForm.owner, githubForm.repo, githubForm.branch)}
              </pre>
            </div>
          </div>

          {/* CI/CD & Audit Logs for GitHub */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-700" />
              <span>GitHub অ্যাক্টিভিটি ও সিঙ্ক লগ (Sync Activity Logs)</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-neutral-600">
                <thead className="bg-neutral-50 text-neutral-700 font-semibold border-b border-neutral-200">
                  <tr>
                    <th className="p-3">অ্যাকশন</th>
                    <th className="p-3">রিপোজিটরি</th>
                    <th className="p-3">বিবরণ</th>
                    <th className="p-3">তারিখ ও সময়</th>
                    <th className="p-3 text-right">স্ট্যাটাস</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {auditLogs.filter((l) => l.targetType === 'github').length > 0 ? (
                    auditLogs
                      .filter((l) => l.targetType === 'github')
                      .map((l) => (
                        <tr key={l.id} className="hover:bg-neutral-50/50">
                          <td className="p-3 font-semibold text-neutral-900">{l.action}</td>
                          <td className="p-3 font-mono">{l.targetId}</td>
                          <td className="p-3">{l.details}</td>
                          <td className="p-3">{l.timestamp}</td>
                          <td className="p-3 text-right">
                            <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                              সফল
                            </span>
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-neutral-400">
                        এখনো কোনো সিঙ্ক অ্যাক্টিভিটি রেকর্ড নেই। উপরে &quot;এখনই GitHub-এ পুশ করুন&quot; বাটনে ক্লিক করে সিঙ্ক সম্পন্ন করুন।
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN MODAL 1: ADD / EDIT COW */}
      {(isAddCowOpen || editingCow) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-neutral-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div>
                <h3 className="text-base font-bold text-neutral-900">
                  {editingCow ? `গরু তথ্য সম্পাদনা (Edit Cow: ${editingCow.cowCode})` : 'নতুন গরু সরাসরি যুক্ত করুন (Admin Add Cow)'}
                </h3>
                <p className="text-xs text-neutral-500">অ্যাডমিন হিসেবে সরাসরি মার্কেটপ্লেসে গরু যুক্ত বা পরিবর্তন করুন।</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAddCowOpen(false);
                  setEditingCow(null);
                }}
                className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (editingCow) {
                  updateCow(editingCow.id, cowFormData);
                  setEditingCow(null);
                } else {
                  const codeNumber = 8000 + cows.length + 1;
                  const price = Number(cowFormData.price) || 200000;
                  const advVal = Number(cowFormData.advanceValue) || 10;
                  const advType = cowFormData.advanceType || 'percentage';
                  const calcAdv = advType === 'percentage' ? Math.round((price * advVal) / 100) : advVal;
                  const newCow: Cow = {
                    id: `cow-admin-${Date.now()}`,
                    cowCode: `GB-${codeNumber}`,
                    name: cowFormData.name || 'উন্নত জাতের গরু',
                    breed: cowFormData.breed || COW_BREEDS[0],
                    category: cowFormData.category || 'qurbani',
                    categoryLabelBn: cowFormData.categoryLabelBn || 'কোরবানি ও মাংস',
                    gender: cowFormData.gender || 'ষাঁড়',
                    ageYears: Number(cowFormData.ageYears) || 3,
                    ageMonths: Number(cowFormData.ageMonths) || 0,
                    weightKg: Number(cowFormData.weightKg) || 500,
                    heightInch: Number(cowFormData.heightInch) || 54,
                    milkProductionLitersDaily: cowFormData.milkProductionLitersDaily,
                    price,
                    advanceType: advType,
                    advanceValue: advVal,
                    calculatedAdvanceAmount: calcAdv,
                    remainingAmount: price - calcAdv,
                    images: cowFormData.images && cowFormData.images.length > 0 ? cowFormData.images : ['/images/cow_sahiwal.jpg'],
                    district: cowFormData.district || 'ঢাকা',
                    upazila: cowFormData.upazila || 'সদর',
                    fullAddress: cowFormData.fullAddress || 'ঢাকা',
                    healthStatus: cowFormData.healthStatus || 'সম্পূর্ণ সুস্থ ও ভ্যাকসিনেটেড',
                    vaccinations: cowFormData.vaccinations || ['খুরা রোগ (FMD)'],
                    feedingHabit: cowFormData.feedingHabit || 'ঘাস ও ভুসি',
                    description: cowFormData.description || 'উন্নত জাতের সুস্থ ও আকর্ষণীয় গরু।',
                    sellerId: 'admin-user',
                    sellerName: cowFormData.sellerName || settings.adminName || 'তানভীর আহমেদ',
                    sellerPhone: cowFormData.sellerPhone || settings.adminPhone || '০১৭০০-০০০১১১',
                    sellerWhatsapp: cowFormData.sellerWhatsapp || settings.adminPhone || '০১৭০০-০০০১১১',
                    sellerFarmName: cowFormData.sellerFarmName || 'গরু বাজার সেন্ট্রাল ফার্ম',
                    sellerBkash: cowFormData.sellerBkash || settings.bkashNumber,
                    sellerNagad: cowFormData.sellerNagad || settings.nagadNumber,
                    sellerRocket: cowFormData.sellerRocket || settings.rocketNumber,
                    sellerIsVerified: true,
                    status: cowFormData.status || 'approved',
                    isFeatured: !!cowFormData.isFeatured,
                    viewsCount: 0,
                    createdAt: new Date().toISOString().split('T')[0],
                  };
                  adminAddCow(newCow);
                  setIsAddCowOpen(false);
                }
              }}
              className="space-y-4 text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">গরুর নাম:</label>
                  <input
                    type="text"
                    required
                    value={cowFormData.name || ''}
                    onChange={(e) => setCowFormData({ ...cowFormData, name: e.target.value })}
                    placeholder="যেমন: লাল বাদশা"
                    className="w-full p-2.5 border rounded-xl bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">জাত (Breed):</label>
                  <select
                    value={cowFormData.breed || COW_BREEDS[0]}
                    onChange={(e) => setCowFormData({ ...cowFormData, breed: e.target.value })}
                    className="w-full p-2.5 border rounded-xl bg-white"
                  >
                    {COW_BREEDS.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-semibold mb-1">মূল্য (টাকা):</label>
                  <input
                    type="number"
                    required
                    value={cowFormData.price || 0}
                    onChange={(e) => setCowFormData({ ...cowFormData, price: Number(e.target.value) })}
                    className="w-full p-2 border rounded-xl bg-white font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">অ্যাডভান্স হার (%):</label>
                  <input
                    type="number"
                    value={cowFormData.advanceValue || 10}
                    onChange={(e) => setCowFormData({ ...cowFormData, advanceValue: Number(e.target.value) })}
                    className="w-full p-2 border rounded-xl bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">ওজন (কেজি):</label>
                  <input
                    type="number"
                    value={cowFormData.weightKg || 500}
                    onChange={(e) => setCowFormData({ ...cowFormData, weightKg: Number(e.target.value) })}
                    className="w-full p-2 border rounded-xl bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">বয়স (বছর):</label>
                  <input
                    type="number"
                    value={cowFormData.ageYears || 3}
                    onChange={(e) => setCowFormData({ ...cowFormData, ageYears: Number(e.target.value) })}
                    className="w-full p-2 border rounded-xl bg-white font-mono"
                  />
                </div>
              </div>

              {/* Photo Upload & URL */}
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
                <label className="block font-semibold text-neutral-800">গরুর ছবি আপলোড / লিংক:</label>
                <div className="flex items-center gap-3">
                  <img
                    src={cowFormData.images?.[0] || '/images/cow_sahiwal.jpg'}
                    alt="Preview"
                    className="w-16 h-16 rounded-xl object-cover border border-emerald-600 shrink-0"
                  />
                  <div className="flex-1 space-y-1">
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 text-white rounded-lg font-semibold text-xs">
                      <Camera className="w-3.5 h-3.5" />
                      <span>ডিভাইস থেকে ছবি আপলোড</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setCowFormData({
                                ...cowFormData,
                                images: [reader.result as string],
                              });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                    <input
                      type="text"
                      value={cowFormData.images?.[0] || ''}
                      onChange={(e) => setCowFormData({ ...cowFormData, images: [e.target.value] })}
                      placeholder="বা ছবির লিংক দিন"
                      className="w-full p-1.5 border rounded-lg bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold mb-1">গরুর বিস্তারিত বিবরণ:</label>
                <textarea
                  rows={2}
                  value={cowFormData.description || ''}
                  onChange={(e) => setCowFormData({ ...cowFormData, description: e.target.value })}
                  placeholder="গরুর খাদ্য তালিকা, স্বাস্থ্য অবস্থা ইত্যাদি..."
                  className="w-full p-2 border rounded-xl bg-white"
                />
              </div>

              {/* Seller details & Contacts */}
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
                <span className="font-bold text-neutral-800">খামারি ও যোগাযোগ তথ্য:</span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={cowFormData.sellerFarmName || ''}
                    onChange={(e) => setCowFormData({ ...cowFormData, sellerFarmName: e.target.value })}
                    placeholder="খামারের নাম"
                    className="p-2 border rounded-lg bg-white"
                  />
                  <input
                    type="text"
                    value={cowFormData.sellerName || ''}
                    onChange={(e) => setCowFormData({ ...cowFormData, sellerName: e.target.value })}
                    placeholder="মালিকের নাম"
                    className="p-2 border rounded-lg bg-white"
                  />
                  <input
                    type="text"
                    value={cowFormData.sellerPhone || ''}
                    onChange={(e) => setCowFormData({ ...cowFormData, sellerPhone: e.target.value })}
                    placeholder="মোবাইল নম্বর"
                    className="p-2 border rounded-lg bg-white font-mono"
                  />
                  <input
                    type="text"
                    value={cowFormData.sellerWhatsapp || ''}
                    onChange={(e) => setCowFormData({ ...cowFormData, sellerWhatsapp: e.target.value })}
                    placeholder="WhatsApp নম্বর"
                    className="p-2 border rounded-lg bg-white font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={cowFormData.status === 'approved'}
                      onChange={(e) => setCowFormData({ ...cowFormData, status: e.target.checked ? 'approved' : 'pending' })}
                      className="rounded text-emerald-600"
                    />
                    <span>অনুমোদিত (Approved)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer ml-3">
                    <input
                      type="checkbox"
                      checked={!!cowFormData.isFeatured}
                      onChange={(e) => setCowFormData({ ...cowFormData, isFeatured: e.target.checked })}
                      className="rounded text-amber-600"
                    />
                    <span>ফিচার্ড গরু</span>
                  </label>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddCowOpen(false);
                      setEditingCow(null);
                    }}
                    className="px-4 py-2 border rounded-xl text-neutral-600 hover:bg-neutral-100 font-semibold"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold shadow-xs"
                  >
                    {editingCow ? 'আপডেট করুন' : 'সংরক্ষণ ও পাবলিশ'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADMIN MODAL 2: EDIT SUBSCRIPTION PLAN */}
      {isEditPlanOpen && editingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-neutral-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="text-base font-bold text-neutral-900">সাবস্ক্রিপশন প্যাকেজ সম্পাদনা</h3>
              <button
                type="button"
                onClick={() => {
                  setIsEditPlanOpen(false);
                  setEditingPlan(null);
                }}
                className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateSubscriptionPlan(editingPlan.id, editingPlan);
                setIsEditPlanOpen(false);
                setEditingPlan(null);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-semibold mb-1">প্যাকেজের বাংলা নাম:</label>
                <input
                  type="text"
                  required
                  value={editingPlan.nameBn}
                  onChange={(e) => setEditingPlan({ ...editingPlan, nameBn: e.target.value })}
                  className="w-full p-2.5 border rounded-xl bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">মূল্য (টাকা):</label>
                  <input
                    type="number"
                    required
                    value={editingPlan.price}
                    onChange={(e) => setEditingPlan({ ...editingPlan, price: Number(e.target.value) })}
                    className="w-full p-2 border rounded-xl bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">মেয়াদ (দিন):</label>
                  <input
                    type="number"
                    required
                    value={editingPlan.durationDays}
                    onChange={(e) => setEditingPlan({ ...editingPlan, durationDays: Number(e.target.value) })}
                    className="w-full p-2 border rounded-xl bg-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">লিস্টিং সীমা (গরু):</label>
                  <input
                    type="number"
                    required
                    value={editingPlan.listingLimit}
                    onChange={(e) => setEditingPlan({ ...editingPlan, listingLimit: Number(e.target.value) })}
                    className="w-full p-2 border rounded-xl bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">ফিচার্ড স্লট:</label>
                  <input
                    type="number"
                    value={editingPlan.featuredSlots}
                    onChange={(e) => setEditingPlan({ ...editingPlan, featuredSlots: Number(e.target.value) })}
                    className="w-full p-2 border rounded-xl bg-white font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditPlanOpen(false);
                    setEditingPlan(null);
                  }}
                  className="px-4 py-2 border rounded-xl text-neutral-600 hover:bg-neutral-100"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold shadow-xs"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADMIN MODAL 3: ADD / EDIT USER */}
      {(isAddUserOpen || editingUser) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-neutral-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="text-base font-bold text-neutral-900">
                {editingUser ? `ব্যবহারকারী সম্পাদনা (${editingUser.name})` : 'নতুন ব্যবহারকারী / খামারি তৈরি'}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsAddUserOpen(false);
                  setEditingUser(null);
                }}
                className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (editingUser) {
                  updateUser(editingUser.id, userFormData);
                  setEditingUser(null);
                } else {
                  adminAddUser(userFormData);
                  setIsAddUserOpen(false);
                }
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-semibold mb-1">পূর্ণ নাম:</label>
                <input
                  type="text"
                  required
                  value={userFormData.name || ''}
                  onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })}
                  placeholder="যেমন: হাজী রফিকুল ইসলাম"
                  className="w-full p-2.5 border rounded-xl bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">মোবাইল নম্বর:</label>
                  <input
                    type="tel"
                    required
                    value={userFormData.phone || ''}
                    onChange={(e) => setUserFormData({ ...userFormData, phone: e.target.value })}
                    placeholder="০১৭১২-XXXXXX"
                    className="w-full p-2 border rounded-xl bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">রোল (Role):</label>
                  <select
                    value={userFormData.role || 'seller'}
                    onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value as any })}
                    className="w-full p-2 border rounded-xl bg-white"
                  >
                    <option value="seller">খামারি (Seller)</option>
                    <option value="buyer">ক্রেতা (Buyer)</option>
                    <option value="admin">অ্যাডমিন (Admin)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">ইমেইল ঠিকানা:</label>
                <input
                  type="email"
                  value={userFormData.email || ''}
                  onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                  placeholder="user@gorubazar.com"
                  className="w-full p-2.5 border rounded-xl bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">জেলা:</label>
                  <input
                    type="text"
                    value={userFormData.district || 'ঢাকা'}
                    onChange={(e) => setUserFormData({ ...userFormData, district: e.target.value })}
                    className="w-full p-2 border rounded-xl bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">পাসওয়ার্ড:</label>
                  <input
                    type="text"
                    value={userFormData.password || '123456'}
                    onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                    className="w-full p-2 border rounded-xl bg-white font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddUserOpen(false);
                    setEditingUser(null);
                  }}
                  className="px-4 py-2 border rounded-xl text-neutral-600 hover:bg-neutral-100"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold shadow-xs"
                >
                  {editingUser ? 'আপডেট করুন' : 'তৈরি করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADMIN MODAL 4: ADD / EDIT ORDER */}
      {(isAddOrderOpen || editingOrder) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-neutral-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="text-base font-bold text-neutral-900">
                {editingOrder ? `অর্ডার তথ্য সম্পাদনা (${editingOrder.orderNumber})` : 'ম্যানুয়াল অর্ডার তৈরি'}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsAddOrderOpen(false);
                  setEditingOrder(null);
                }}
                className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (editingOrder) {
                  updateOrder(editingOrder.id, orderFormData);
                  setEditingOrder(null);
                } else {
                  adminAddOrder(orderFormData);
                  setIsAddOrderOpen(false);
                }
              }}
              className="space-y-3 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">গরুর নাম:</label>
                  <input
                    type="text"
                    required
                    value={orderFormData.cowName || ''}
                    onChange={(e) => setOrderFormData({ ...orderFormData, cowName: e.target.value })}
                    className="w-full p-2 border rounded-xl bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">গরুর কোড:</label>
                  <input
                    type="text"
                    required
                    value={orderFormData.cowCode || 'GB-7025'}
                    onChange={(e) => setOrderFormData({ ...orderFormData, cowCode: e.target.value })}
                    className="w-full p-2 border rounded-xl bg-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">ক্রেতার নাম:</label>
                  <input
                    type="text"
                    required
                    value={orderFormData.buyerName || ''}
                    onChange={(e) => setOrderFormData({ ...orderFormData, buyerName: e.target.value })}
                    className="w-full p-2 border rounded-xl bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">ক্রেতার মোবাইল:</label>
                  <input
                    type="text"
                    required
                    value={orderFormData.buyerPhone || ''}
                    onChange={(e) => setOrderFormData({ ...orderFormData, buyerPhone: e.target.value })}
                    className="w-full p-2 border rounded-xl bg-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">মোট মূল্য (টাকা):</label>
                  <input
                    type="number"
                    required
                    value={orderFormData.cowTotalAmount || 0}
                    onChange={(e) => {
                      const total = Number(e.target.value);
                      const adv = Number(orderFormData.advanceAmount) || 0;
                      setOrderFormData({
                        ...orderFormData,
                        cowTotalAmount: total,
                        remainingAmount: Math.max(0, total - adv),
                      });
                    }}
                    className="w-full p-2 border rounded-xl bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">পরিশোধিত অ্যাডভান্স (টাকা):</label>
                  <input
                    type="number"
                    required
                    value={orderFormData.advanceAmount || 0}
                    onChange={(e) => {
                      const adv = Number(e.target.value);
                      const total = Number(orderFormData.cowTotalAmount) || 0;
                      setOrderFormData({
                        ...orderFormData,
                        advanceAmount: adv,
                        remainingAmount: Math.max(0, total - adv),
                      });
                    }}
                    className="w-full p-2 border rounded-xl bg-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">অর্ডার স্ট্যাটাস:</label>
                  <select
                    value={orderFormData.orderStatus || 'confirmed'}
                    onChange={(e) => setOrderFormData({ ...orderFormData, orderStatus: e.target.value as any })}
                    className="w-full p-2 border rounded-xl bg-white"
                  >
                    <option value="advance_paid">Advance Paid</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="ready_for_delivery">Ready for Delivery</option>
                    <option value="completed">Completed</option>
                    <option value="refunded">Refunded</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">পেমেন্ট মাধ্যম:</label>
                  <select
                    value={orderFormData.paymentMethod || 'bkash'}
                    onChange={(e) => setOrderFormData({ ...orderFormData, paymentMethod: e.target.value as any })}
                    className="w-full p-2 border rounded-xl bg-white uppercase"
                  >
                    <option value="bkash">bKash</option>
                    <option value="nagad">Nagad</option>
                    <option value="rocket">Rocket</option>
                    <option value="bank_transfer">Bank Transfer</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddOrderOpen(false);
                    setEditingOrder(null);
                  }}
                  className="px-4 py-2 border rounded-xl text-neutral-600 hover:bg-neutral-100"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold shadow-xs"
                >
                  {editingOrder ? 'আপডেট করুন' : 'অর্ডার নিশ্চিত করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
