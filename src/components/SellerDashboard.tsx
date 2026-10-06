import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Cow, CowCategory } from '../types';
import {
  LayoutDashboard,
  PlusCircle,
  Package,
  ShoppingBag,
  UserCheck,
  ShieldCheck,
  Crown,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Edit3,
  ExternalLink,
  Zap,
  Camera,
  Upload,
  Phone,
  MessageCircle,
  Youtube,
  Facebook,
  CreditCard,
  Building,
  Settings as SettingsIcon,
} from 'lucide-react';
import { BD_DISTRICTS, COW_BREEDS } from '../data/mockData';

export const SellerDashboard: React.FC = () => {
  const {
    currentUser,
    cows,
    orders,
    addCow,
    updateCow,
    deleteCow,
    updateUser,
    setSubscriptionModalOpen,
    getSellerRemainingListings,
    setSelectedCowId,
    setActivePage,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'cows' | 'add' | 'orders' | 'subscription' | 'profile'>('overview');

  // Form states for adding cow
  const [name, setName] = useState('');
  const [breed, setBreed] = useState(COW_BREEDS[0]);
  const [category, setCategory] = useState<CowCategory>('qurbani');
  const [ageYears, setAgeYears] = useState(3);
  const [ageMonths, setAgeMonths] = useState(0);
  const [gender, setGender] = useState<'ষাঁড়' | 'গাভী' | 'বকনা' | 'দামড়া'>('ষাঁড়');
  const [weightKg, setWeightKg] = useState(550);
  const [heightInch, setHeightInch] = useState(56);
  const [milkProduction, setMilkProduction] = useState(0);
  const [price, setPrice] = useState(250000);
  const [advanceType, setAdvanceType] = useState<'percentage' | 'fixed'>('percentage');
  const [advanceValue, setAdvanceValue] = useState(10);
  const [district, setDistrict] = useState(currentUser?.district || 'পাবনা');
  const [upazila, setUpazila] = useState(currentUser?.upazila || 'চাটমোহর');
  const [address, setAddress] = useState(currentUser?.address || 'গ্রিন ডেইরি ফার্ম');
  const [healthStatus, setHealthStatus] = useState('সম্পূর্ণ সুস্থ, নিয়মিত ডিওয়ার্মিং ও সুষম খাদ্যপ্রাপ্ত');
  const [vaccinations, setVaccinations] = useState<string[]>(['খুরা রোগ (FMD)', 'অ্যানথ্রাক্স (তড়কা)', 'এলএসডি (LSD)']);
  const [customVaccine, setCustomVaccine] = useState('');
  const [feedingHabit, setFeedingHabit] = useState('কাঁচা ঘাস, খড়, ভুসি ও সাইলেজ');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('/images/cow_sahiwal.jpg');
  const [videoUrl, setVideoUrl] = useState('');
  const [sellerPhone, setSellerPhone] = useState(currentUser?.phone || '');
  const [sellerWhatsapp, setSellerWhatsapp] = useState(currentUser?.sellerProfile?.whatsappNumber || currentUser?.phone || '');
  const [sellerBkash, setSellerBkash] = useState(currentUser?.sellerProfile?.bkashNumber || '');
  const [sellerNagad, setSellerNagad] = useState(currentUser?.sellerProfile?.nagadNumber || '');
  const [sellerRocket, setSellerRocket] = useState(currentUser?.sellerProfile?.rocketNumber || '');
  const [sellerBankDetails, setSellerBankDetails] = useState(currentUser?.sellerProfile?.bankAccountDetails || '');
  const [formFeedback, setFormFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Profile Settings form states
  const [profileFarmName, setProfileFarmName] = useState(currentUser?.sellerProfile?.farmName || '');
  const [profileLogo, setProfileLogo] = useState(currentUser?.sellerProfile?.farmLogo || '');
  const [profileWhatsapp, setProfileWhatsapp] = useState(currentUser?.sellerProfile?.whatsappNumber || currentUser?.phone || '');
  const [profileYoutube, setProfileYoutube] = useState(currentUser?.sellerProfile?.youtubeUrl || '');
  const [profileFacebook, setProfileFacebook] = useState(currentUser?.sellerProfile?.facebookUrl || '');
  const [profileBkash, setProfileBkash] = useState(currentUser?.sellerProfile?.bkashNumber || '');
  const [profileNagad, setProfileNagad] = useState(currentUser?.sellerProfile?.nagadNumber || '');
  const [profileRocket, setProfileRocket] = useState(currentUser?.sellerProfile?.rocketNumber || '');
  const [profileBank, setProfileBank] = useState(currentUser?.sellerProfile?.bankAccountDetails || '');
  const [profileSaved, setProfileSaved] = useState(false);

  // Edit Cow State
  const [editingCow, setEditingCow] = useState<Cow | null>(null);
  const [editForm, setEditForm] = useState<Partial<Cow>>({});
  const [editCustomVaccine, setEditCustomVaccine] = useState('');

  // Phone image upload for cow
  const handleCowImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Farm logo upload
  const handleFarmLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const openEditCow = (cow: Cow) => {
    setEditingCow(cow);
    setEditForm({ ...cow });
  };

  const handleEditCowImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm((prev) => ({
          ...prev,
          images: [reader.result as string, ...(prev.images?.slice(1) || [])],
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveEditedCow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCow) return;
    updateCow(editingCow.id, editForm);
    setEditingCow(null);
  };

  if (!currentUser) return null;

  // Filter seller's own cows and orders
  const myCows = cows.filter((c) => c.sellerId === currentUser.id);
  const myOrders = orders.filter((o) => o.sellerId === currentUser.id);
  const listingStats = getSellerRemainingListings(currentUser.id);

  const handleAddCowSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormFeedback(null);

    const categoryLabels: Record<CowCategory, string> = {
      dairy: 'দুধের গাভী',
      beef: 'মাংসের ষাঁড়',
      qurbani: 'কোরবানি স্পেশাল',
      heifer: 'বকনা বাছুর',
      breeding: 'প্রজনন জাত',
    };

    const res = addCow({
      name,
      breed,
      category,
      categoryLabelBn: categoryLabels[category],
      ageYears,
      ageMonths,
      gender,
      weightKg,
      heightInch,
      milkProductionLitersDaily: category === 'dairy' ? milkProduction : undefined,
      price,
      advanceType,
      advanceValue,
      images: [imageUrl],
      videoUrl: videoUrl || undefined,
      district,
      upazila,
      fullAddress: `${address}, ${upazila}, ${district}`,
      healthStatus,
      vaccinations,
      feedingHabit,
      description: description || `${name} - সুস্থ ও চমৎকার গঠনের গরু।`,
      sellerId: currentUser.id,
      sellerName: currentUser.name,
      sellerPhone: sellerPhone.trim() || currentUser.phone,
      sellerWhatsapp: sellerWhatsapp.trim() || currentUser.phone,
      sellerBkash: sellerBkash.trim() || currentUser.sellerProfile?.bkashNumber,
      sellerNagad: sellerNagad.trim() || currentUser.sellerProfile?.nagadNumber,
      sellerRocket: sellerRocket.trim() || currentUser.sellerProfile?.rocketNumber,
      sellerBankDetails: sellerBankDetails.trim() || currentUser.sellerProfile?.bankAccountDetails,
      sellerLogo: currentUser.sellerProfile?.farmLogo,
      sellerYoutube: currentUser.sellerProfile?.youtubeUrl,
      sellerFacebook: currentUser.sellerProfile?.facebookUrl,
      sellerFarmName: currentUser.sellerProfile?.farmName || currentUser.name,
      sellerIsVerified: currentUser.sellerProfile?.isVerified || false,
      isFeatured: false,
    });

    if (res.success) {
      setFormFeedback({ type: 'success', message: res.message });
      setName('');
      setDescription('');
      setTimeout(() => setActiveTab('cows'), 1200);
    } else {
      setFormFeedback({ type: 'error', message: res.message });
    }
  };

  const toggleVaccination = (v: string) => {
    if (vaccinations.includes(v)) {
      setVaccinations(vaccinations.filter((x) => x !== v));
    } else {
      setVaccinations([...vaccinations, v]);
    }
  };

  const handleAddCustomVaccine = () => {
    if (customVaccine.trim() && !vaccinations.includes(customVaccine.trim())) {
      setVaccinations([...vaccinations, customVaccine.trim()]);
      setCustomVaccine('');
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    updateUser(currentUser.id, {
      sellerProfile: {
        ...(currentUser.sellerProfile as any),
        farmName: profileFarmName.trim() || currentUser.sellerProfile?.farmName,
        farmLogo: profileLogo.trim(),
        whatsappNumber: profileWhatsapp.trim(),
        youtubeUrl: profileYoutube.trim(),
        facebookUrl: profileFacebook.trim(),
        bkashNumber: profileBkash.trim(),
        nagadNumber: profileNagad.trim(),
        rocketNumber: profileRocket.trim(),
        bankAccountDetails: profileBank.trim(),
      },
    });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      
      {/* Requirement 3: Warning banner if package is expired or listing quota is full */}
      {listingStats.isExpired ? (
        <div className="mb-6 p-4 bg-red-50 border-2 border-red-300 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-red-900 shadow-sm animate-pulse">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-sm font-bold text-red-800 block">
                আপনার সাবস্ক্রিপশন প্যাকেজের মেয়াদ শেষ হয়ে গেছে (Auto OFF সক্রিয়)!
              </strong>
              <p className="text-red-700 mt-0.5">
                আপনার লাইভ লিস্টিং সাময়িকভাবে স্থগিত করা হয়েছে। গরুর লিস্টিং পুনরায় চালু ও নতুন গরু যুক্ত করতে এখনই প্যাকেজ রিনিউ করুন।
              </p>
            </div>
          </div>
          <button
            onClick={() => setSubscriptionModalOpen(true)}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-xs shrink-0 whitespace-nowrap"
          >
            প্যাকেজ রিনিউ করুন
          </button>
        </div>
      ) : !listingStats.canAdd ? (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-300 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-amber-950 shadow-sm">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-sm font-bold text-amber-900 block">
                আপনার বর্তমান প্যাকেজের লিস্টিং কোটা পূর্ণ ({listingStats.totalAllowed}টি ব্যবহৃত)!
              </strong>
              <p className="text-amber-800 mt-0.5">
                আরও বেশি গরু ও গাভী লিস্টিং করতে সাবস্ক্রিপশন প্যাকেজ আপগ্রেড করুন।
              </p>
            </div>
          </div>
          <button
            onClick={() => setSubscriptionModalOpen(true)}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-xs shrink-0 whitespace-nowrap"
          >
            প্যাকেজ আপগ্রেড
          </button>
        </div>
      ) : null}

      {/* Top Banner with Seller Info & Subscription status */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {currentUser.sellerProfile?.farmLogo ? (
            <img
              src={currentUser.sellerProfile.farmLogo}
              alt="Farm Logo"
              className="w-14 h-14 rounded-2xl object-cover border border-emerald-600 shadow-sm shrink-0"
            />
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-emerald-700 text-white font-bold text-2xl flex items-center justify-center shrink-0">
              {currentUser.name.charAt(0)}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-neutral-900">
                {currentUser.sellerProfile?.farmName || currentUser.name}
              </h1>
              {currentUser.sellerProfile?.isVerified ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>ভেরিফাইড খামারি</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  <span>ভেরিফিকেশন অপেক্ষমান</span>
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              স্বত্বাধিকারী: {currentUser.name} · মোবাইল: {currentUser.phone} · অবস্থান: {currentUser.district}
            </p>
          </div>
        </div>

        {/* Subscription Status Card */}
        <div className={`rounded-xl p-3.5 border flex items-center justify-between gap-4 ${
          listingStats.isExpired ? 'bg-red-50 border-red-200 text-red-900' : 'bg-emerald-50 border-emerald-200'
        }`}>
          <div>
            <div className="text-[11px] font-medium">
              {listingStats.isExpired ? 'প্যাকেজের মেয়াদ সমাপ্ত' : 'সক্রিয় সাবস্ক্রিপশন'}
            </div>
            <div className="text-sm font-bold flex items-center gap-1.5">
              <Crown className={`w-4 h-4 ${listingStats.isExpired ? 'text-red-500' : 'text-amber-500'}`} />
              <span>{listingStats.planName}</span>
              {listingStats.isExpired && (
                <span className="text-[10px] bg-red-200 text-red-800 px-1.5 py-0.2 rounded font-bold">Auto OFF</span>
              )}
            </div>
            <div className="text-xs text-neutral-600 mt-0.5">
              লিস্টিং বাকি: <strong className="text-emerald-800 font-mono">{listingStats.remaining}</strong>/{listingStats.totalAllowed}টি
              {listingStats.expiryDate && (
                <span className="block text-[11px] text-neutral-500 font-mono">মেয়াদ: {listingStats.expiryDate}</span>
              )}
            </div>
          </div>

          <button
            onClick={() => setSubscriptionModalOpen(true)}
            className={`px-3 py-2 text-white text-xs font-semibold rounded-lg shadow-sm whitespace-nowrap ${
              listingStats.isExpired ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-700 hover:bg-emerald-800'
            }`}
          >
            {listingStats.isExpired ? 'প্যাকেজ রিনিউ' : 'প্যাকেজ আপগ্রেড'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-200 mb-6 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
            activeTab === 'overview' ? 'border-emerald-700 text-emerald-700' : 'border-transparent text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>ওভারভিউ</span>
        </button>
        <button
          onClick={() => setActiveTab('cows')}
          className={`pb-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
            activeTab === 'cows' ? 'border-emerald-700 text-emerald-700' : 'border-transparent text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>আমার গরু তালিকা ({myCows.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('add')}
          className={`pb-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
            activeTab === 'add' ? 'border-emerald-700 text-emerald-700' : 'border-transparent text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>নতুন গরু যোগ করুন</span>
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
            activeTab === 'orders' ? 'border-emerald-700 text-emerald-700' : 'border-transparent text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>প্রাপ্ত অর্ডারসমূহ ({myOrders.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('subscription')}
          className={`pb-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
            activeTab === 'subscription' ? 'border-emerald-700 text-emerald-700' : 'border-transparent text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <Crown className="w-4 h-4" />
          <span>সাবস্ক্রিপশন ও বিলিং</span>
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
            activeTab === 'profile' ? 'border-emerald-700 text-emerald-700' : 'border-transparent text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <SettingsIcon className="w-4 h-4" />
          <span>খামার ও পেমেন্ট সেটিংস</span>
        </button>
      </div>

      {/* TAB 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-neutral-200">
              <div className="text-xs text-neutral-500 font-medium">মোট লিস্টিং</div>
              <div className="text-2xl font-bold font-mono text-neutral-900 mt-1">{myCows.length}টি</div>
              <div className="text-[11px] text-emerald-700 mt-1">সর্বোচ্চ সীমা: {listingStats.totalAllowed}টি</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-neutral-200">
              <div className="text-xs text-neutral-500 font-medium">সক্রিয় লাইভ গরু</div>
              <div className="text-2xl font-bold font-mono text-emerald-700 mt-1">
                {myCows.filter((c) => c.status === 'approved').length}টি
              </div>
              <div className="text-[11px] text-neutral-500 mt-1">মার্কেটপ্লেসে দৃশ্যমান</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-neutral-200">
              <div className="text-xs text-neutral-500 font-medium">প্রাপ্ত অর্ডার</div>
              <div className="text-2xl font-bold font-mono text-blue-700 mt-1">{myOrders.length}টি</div>
              <div className="text-[11px] text-blue-600 mt-1">অ্যাডভান্স পেমেন্ট সম্পন্ন</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-neutral-200">
              <div className="text-xs text-neutral-500 font-medium">মোট বিক্রয় ও আয়</div>
              <div className="text-2xl font-bold font-mono text-neutral-900 mt-1">
                ৳{(currentUser.sellerProfile?.totalEarnings || 320000).toLocaleString('bn-BD')}
              </div>
              <div className="text-[11px] text-emerald-700 mt-1">১৪+ টি গরু বিক্রিত</div>
            </div>
          </div>

          {/* Quick Action Banner */}
          <div className="p-5 bg-gradient-to-r from-emerald-800 to-emerald-950 text-white rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold">নতুন কোনো গরু বিক্রির জন্য প্রস্তুত আছে?</h3>
              <p className="text-xs text-emerald-200 mt-1">
                ছবি, ভিডিও লিংক ও বিস্তারিত স্বাস্থ্য তথ্য দিয়ে দ্রুত ক্রেতার কাছে পৌঁছে দিন।
              </p>
            </div>
            <button
              onClick={() => setActiveTab('add')}
              className="px-4 py-2.5 bg-white text-emerald-900 hover:bg-emerald-50 rounded-xl text-xs font-bold shrink-0 transition-colors shadow-sm"
            >
              + নতুন গরু লিস্টিং করুন
            </button>
          </div>

          {/* Recent Listings Summary */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-neutral-900">সাম্প্রতিক লিস্টিং</h3>
              <button onClick={() => setActiveTab('cows')} className="text-xs text-emerald-700 font-semibold hover:underline">
                সবগুলো দেখুন
              </button>
            </div>

            <div className="space-y-3">
              {myCows.slice(0, 3).map((cow) => (
                <div key={cow.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <img src={cow.images[0]} alt={cow.name} className="w-12 h-12 rounded-lg object-cover" />
                    <div>
                      <div className="text-xs font-bold text-neutral-900">{cow.name} ({cow.cowCode})</div>
                      <div className="text-[11px] text-neutral-500">{cow.breed} · ওজন: {cow.weightKg} কেজি</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold font-mono text-neutral-900">৳{cow.price.toLocaleString('bn-BD')}</div>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                      cow.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {cow.status === 'approved' ? 'অনুমোদিত' : 'অপেক্ষমান'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: My Cows List */}
      {activeTab === 'cows' && (
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
            <h2 className="text-sm font-bold text-neutral-900">আমার সকল গরু ({myCows.length}টি)</h2>
            <button
              onClick={() => setActiveTab('add')}
              className="px-3 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>গরু যোগ করুন</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-600">
              <thead className="bg-neutral-50 text-neutral-700 font-semibold border-b border-neutral-200">
                <tr>
                  <th className="p-3">গরুর ছবি ও কোড</th>
                  <th className="p-3">জাত ও ক্যাটাগরি</th>
                  <th className="p-3">মূল্য ও অ্যাডভান্স</th>
                  <th className="p-3">ওজন / দুধ</th>
                  <th className="p-3">স্ট্যাটাস</th>
                  <th className="p-3 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {myCows.map((c) => (
                  <tr key={c.id} className="hover:bg-neutral-50/50">
                    <td className="p-3 flex items-center gap-2.5">
                      <img src={c.images[0]} alt={c.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <div className="font-bold text-neutral-900">{c.name}</div>
                        <div className="text-[11px] text-neutral-400 font-mono">{c.cowCode}</div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div>{c.breed}</div>
                      <div className="text-[11px] text-neutral-400">{c.gender} · {c.ageYears} বছর</div>
                    </td>
                    <td className="p-3">
                      <div className="font-mono font-bold text-neutral-900">৳{c.price.toLocaleString('bn-BD')}</div>
                      <div className="text-[11px] text-emerald-700">অ্যাডভান্স: ৳{c.calculatedAdvanceAmount.toLocaleString('bn-BD')}</div>
                    </td>
                    <td className="p-3 font-mono">
                      {c.weightKg} কেজি
                      {c.milkProductionLitersDaily ? ` · ${c.milkProductionLitersDaily}L` : ''}
                    </td>
                    <td className="p-3">
                      {c.isPackageExpired ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-800 border border-red-200 block text-center">
                          Auto OFF (মেয়াদ শেষ)
                        </span>
                      ) : (
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          c.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : c.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-neutral-100 text-neutral-800'
                        }`}>
                          {c.status === 'approved' ? 'অনুমোদিত' : c.status === 'pending' ? 'অনুমোদন পেন্ডিং' : 'বিক্রিত'}
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right space-x-1">
                      <button
                        onClick={() => openEditCow(c)}
                        className="p-1.5 text-neutral-600 hover:text-blue-600 rounded hover:bg-neutral-100"
                        title="এডিট করুন"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedCowId(c.id);
                          setActivePage('cow-details');
                        }}
                        className="p-1.5 text-neutral-600 hover:text-emerald-700 rounded hover:bg-neutral-100"
                        title="দেখুন"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteCow(c.id)}
                        className="p-1.5 text-neutral-400 hover:text-red-600 rounded hover:bg-red-50"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Add Cow Form */}
      {activeTab === 'add' && (
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm max-w-4xl mx-auto">
          <div className="border-b border-neutral-100 pb-4 mb-6">
            <h2 className="text-lg font-bold text-neutral-900">গরুর বিবরণ ও বিক্রয় তথ্য ফরম</h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              সবগুলো তথ্য সঠিকভাবে পূরণ করুন যাতে ক্রেতারা সহজে আকৃষ্ট হন।
            </p>
          </div>

          {formFeedback && (
            <div className={`p-4 rounded-xl text-xs mb-6 flex items-center gap-2 ${
              formFeedback.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {formFeedback.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
              <span>{formFeedback.message}</span>
            </div>
          )}

          <form onSubmit={handleAddCowSubmit} className="space-y-6">
            
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">গরুর নাম বা ডাকনাম:</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="যেমন: লাল বাহাদুর, সুন্দর আলী"
                  className="w-full text-xs p-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">গরুর জাত (Breed):</label>
                <select
                  value={breed}
                  onChange={(e) => setBreed(e.target.value)}
                  className="w-full text-xs p-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  {COW_BREEDS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">ক্যাটাগরি:</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CowCategory)}
                  className="w-full text-xs p-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="qurbani">কোরবানি ও মাংসের ষাঁড়</option>
                  <option value="dairy">উচ্চ উৎপাদনশীল দুধের গাভী</option>
                  <option value="beef">মোটাতাজাকরণ ষাঁড়</option>
                  <option value="breeding">প্রজনন জাত / বকনা</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">লিঙ্গ:</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full text-xs p-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="ষাঁড়">ষাঁড় (Bull)</option>
                  <option value="গাভী">গাভী (Cow)</option>
                  <option value="বকনা">বকনা (Heifer)</option>
                  <option value="দামড়া">দামড়া (Steer)</option>
                </select>
              </div>
            </div>

            {/* Measurements */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">বয়স (বছর):</label>
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={ageYears}
                  onChange={(e) => setAgeYears(Number(e.target.value))}
                  className="w-full text-xs p-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">বয়স (মাস):</label>
                <input
                  type="number"
                  min={0}
                  max={11}
                  value={ageMonths}
                  onChange={(e) => setAgeMonths(Number(e.target.value))}
                  className="w-full text-xs p-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">লাইভ ওজন (কেজি):</label>
                <input
                  type="number"
                  min={100}
                  max={1500}
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full text-xs p-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">উচ্চতা (ইঞ্চি):</label>
                <input
                  type="number"
                  min={30}
                  max={80}
                  value={heightInch}
                  onChange={(e) => setHeightInch(Number(e.target.value))}
                  className="w-full text-xs p-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>
            </div>

            {/* Dairy conditional */}
            {category === 'dairy' && (
              <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl">
                <label className="block text-xs font-bold text-blue-900 mb-1">
                  দৈনিক দুধ উৎপাদন ক্ষমতা (লিটার):
                </label>
                <input
                  type="number"
                  min={1}
                  max={45}
                  value={milkProduction}
                  onChange={(e) => setMilkProduction(Number(e.target.value))}
                  placeholder="যেমন: ২০ লিটার"
                  className="w-full text-xs p-2.5 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-mono"
                />
              </div>
            )}

            {/* Price & Advance Settings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-neutral-50 rounded-xl border border-neutral-200">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">মোট বিক্রয়মূল্য (টাকা):</label>
                <input
                  type="number"
                  required
                  step={5000}
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full text-xs p-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">বুকিং অ্যাডভান্স ধরন:</label>
                <select
                  value={advanceType}
                  onChange={(e) => setAdvanceType(e.target.value as any)}
                  className="w-full text-xs p-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="percentage">শতকরা হার (%)</option>
                  <option value="fixed">নির্দিষ্ট টাকা (Fixed Tk)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  অ্যাডভান্স মান ({advanceType === 'percentage' ? '%' : 'টাকা'}):
                </label>
                <input
                  type="number"
                  value={advanceValue}
                  onChange={(e) => setAdvanceValue(Number(e.target.value))}
                  className="w-full text-xs p-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>
            </div>

            {/* ১) প্রদানকৃত ভ্যাকসিন টিকাসমূহ */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-neutral-700">
                ১) গরুর স্বাস্থ্য ও প্রদানকৃত ভ্যাকসিন টিকাসমূহ (টিকাসমূহ সিলেক্ট করুন বা আরো নতুন টিকা যোগ করুন):
              </label>
              <div className="flex flex-wrap gap-2">
                {['খুরা রোগ (FMD)', 'অ্যানথ্রাক্স (তড়কা)', 'বাদলা (BQ)', 'এলএসডি (LSD)', 'গলাফোলা (HS)'].map((vac) => (
                  <button
                    key={vac}
                    type="button"
                    onClick={() => toggleVaccination(vac)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                      vaccinations.includes(vac)
                        ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                        : 'border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    {vaccinations.includes(vac) ? '✓ ' : '+ '} {vac}
                  </button>
                ))}
                {vaccinations
                  .filter((v) => !['খুরা রোগ (FMD)', 'অ্যানথ্রাক্স (তড়কা)', 'বাদলা (BQ)', 'এলএসডি (LSD)', 'গলাফোলা (HS)'].includes(v))
                  .map((vac) => (
                    <span
                      key={vac}
                      className="px-3 py-1.5 rounded-lg border text-xs font-medium bg-emerald-600 text-white border-emerald-700 flex items-center gap-1.5 shadow-xs"
                    >
                      <span>✓ {vac}</span>
                      <button
                        type="button"
                        onClick={() => setVaccinations(vaccinations.filter((x) => x !== vac))}
                        className="hover:text-red-200 font-bold ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
              </div>

              {/* Add Custom Vaccine Input */}
              <div className="flex items-center gap-2 max-w-md pt-1">
                <input
                  type="text"
                  value={customVaccine}
                  onChange={(e) => setCustomVaccine(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustomVaccine();
                    }
                  }}
                  placeholder="যেমন: কৃমিনাশক টিকা, ব্রুসেলা ইত্যাদি"
                  className="flex-1 text-xs p-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                />
                <button
                  type="button"
                  onClick={handleAddCustomVaccine}
                  className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-xl shrink-0 transition-colors"
                >
                  + টিকা যোগ করুন
                </button>
              </div>
            </div>

            {/* ২) গরুর প্রধান ছবি ফোন থেকে আপলোড */}
            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-3">
              <label className="block text-xs font-bold text-neutral-800">
                ২) গরুর প্রধান ছবি (ফোন বা কম্পিউটার থেকে সরাসরি আপলোড করুন):
              </label>
              
              <div className="flex flex-col sm:flex-row items-center gap-4">
                {imageUrl ? (
                  <div className="relative group shrink-0">
                    <img
                      src={imageUrl}
                      alt="Cow Preview"
                      className="w-28 h-28 rounded-2xl object-cover border-2 border-emerald-600 shadow-sm"
                    />
                    <div className="text-[10px] text-center text-emerald-700 font-semibold mt-1">প্রিভিউ ছবি</div>
                  </div>
                ) : (
                  <div className="w-28 h-28 rounded-2xl bg-neutral-200 border-2 border-dashed border-neutral-300 flex flex-col items-center justify-center text-neutral-500 text-xs shrink-0">
                    <Camera className="w-6 h-6 mb-1 text-neutral-400" />
                    <span>কোনো ছবি নেই</span>
                  </div>
                )}

                <div className="flex-1 space-y-2 w-full">
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl text-xs flex items-center gap-2 transition-colors shadow-xs">
                      <Camera className="w-4 h-4" />
                      <span>ফোন থেকে ছবি তুলুন / গ্যালারি থেকে দিন</span>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleCowImageUpload}
                        className="hidden"
                      />
                    </label>
                    {imageUrl && imageUrl !== '/images/cow_sahiwal.jpg' && (
                      <button
                        type="button"
                        onClick={() => setImageUrl('/images/cow_sahiwal.jpg')}
                        className="text-xs text-neutral-500 hover:text-red-600 underline"
                      >
                        ডিফল্ট ছবি
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-neutral-500">
                    মোবাইলের ক্যামেরা দিয়ে সরাসরি গরুর ছবি তুলুন অথবা ফোন গ্যালারি থেকে সিলেক্ট করুন।
                  </p>
                  <div>
                    <input
                      type="text"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="বা ছবির অনলাইন লিংক দিন (যেমন: /images/cow_sahiwal.jpg)"
                      className="w-full text-xs p-2 border border-neutral-300 rounded-lg bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Video link */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">ভিডিও লিংক (ইউটিউব/ফেসবুক):</label>
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full text-xs p-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>

            {/* ৩) গরুর বিস্তারিত বিবরণ */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                ৩) গরুর বিস্তারিত বিবরণ ও খামারের বৈশিষ্ট্য:
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="গরুর খাদ্য অভ্যাস, শান্ত স্বভাব, বাছুরের অবস্থা, স্বাস্থ্যগত তথ্য ইত্যাদি বিস্তারিত লিখুন..."
                className="w-full text-xs p-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>

            {/* ৪) সেলারের ফোন নাম্বার ও WhatsApp নাম্বার */}
            <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 space-y-3">
              <div className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-emerald-700" />
                <span>৪) বিক্রেতা / খামারির যোগাযোগ নম্বর (কাস্টমার এই নম্বরে ফোন বা চ্যাট করবে):</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                    মোবাইল নম্বর (সরাসরি কলের জন্য):
                  </label>
                  <input
                    type="tel"
                    required
                    value={sellerPhone}
                    onChange={(e) => setSellerPhone(e.target.value)}
                    placeholder="০১৭১২-XXXXXX"
                    className="w-full text-xs p-2.5 border border-neutral-300 rounded-xl bg-white font-mono"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-semibold text-neutral-700">
                      WhatsApp নম্বর (সরাসরি চ্যাট):
                    </label>
                    <button
                      type="button"
                      onClick={() => setSellerWhatsapp(sellerPhone)}
                      className="text-[10px] text-emerald-700 hover:underline font-semibold"
                    >
                      কল নম্বরটিই WhatsApp
                    </button>
                  </div>
                  <input
                    type="tel"
                    value={sellerWhatsapp}
                    onChange={(e) => setSellerWhatsapp(e.target.value)}
                    placeholder="০১৭১২-XXXXXX"
                    className="w-full text-xs p-2.5 border border-neutral-300 rounded-xl bg-white font-mono"
                  />
                </div>
              </div>
            </div>

            {/* ৫) সেলার বিকাশ, নগদ, রকেট ও ব্যাংক একাউন্ট নম্বর */}
            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-3">
              <div className="text-xs font-bold text-neutral-900 flex items-center justify-between">
                <span>৫) খামারির পেমেন্ট গ্রহণ নম্বর (বিকাশ / নগদ / রকেট / ব্যাংক):</span>
              </div>
              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                <span>
                  <strong>লেনদেন নির্দেশিকা:</strong> যখন কাস্টমার গরু কিনবে তখন আপনার এই নাম্বারে বিকাশ, নগদ, রকেট বা ব্যাংকে টাকা লেনদেন করতে পারবে। তবে লেনদেন করার আগে কাস্টমার অবশ্যই আপনার সাথে কথা বলে নিবে।
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">বিকাশ নম্বর:</label>
                  <input
                    type="text"
                    value={sellerBkash}
                    onChange={(e) => setSellerBkash(e.target.value)}
                    placeholder="যেমন: ০১৭১২-৩৪৫৬৭৮"
                    className="w-full text-xs p-2.5 border border-neutral-300 rounded-xl bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">নগদ নম্বর:</label>
                  <input
                    type="text"
                    value={sellerNagad}
                    onChange={(e) => setSellerNagad(e.target.value)}
                    placeholder="যেমন: ০১৭২২-৩৩৪৪৫৫"
                    className="w-full text-xs p-2.5 border border-neutral-300 rounded-xl bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">রকেট নম্বর:</label>
                  <input
                    type="text"
                    value={sellerRocket}
                    onChange={(e) => setSellerRocket(e.target.value)}
                    placeholder="যেমন: ০১৯১১-২২৩৩৪৪-৮"
                    className="w-full text-xs p-2.5 border border-neutral-300 rounded-xl bg-white font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 mb-1">ব্যাংক অ্যাকাউন্ট ও শাখা (যদি থাকে):</label>
                <input
                  type="text"
                  value={sellerBankDetails}
                  onChange={(e) => setSellerBankDetails(e.target.value)}
                  placeholder="ব্যাংকের নাম, হিসাব নম্বর, ব্রাঞ্চ"
                  className="w-full text-xs p-2.5 border border-neutral-300 rounded-xl bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-sm transition-all shadow-md"
            >
              গরু লিস্টিং প্রকাশ করুন
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: Orders Received */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-neutral-200">
            <h2 className="text-sm font-bold text-neutral-900">ক্রেতাদের বুকিং ও প্রাপ্ত অর্ডার ({myOrders.length}টি)</h2>
          </div>

          <div className="divide-y divide-neutral-100">
            {myOrders.length > 0 ? (
              myOrders.map((ord) => (
                <div key={ord.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img src={ord.cowImage} alt={ord.cowName} className="w-14 h-14 rounded-xl object-cover" />
                    <div>
                      <div className="font-bold text-neutral-900 text-sm">{ord.cowName} ({ord.cowCode})</div>
                      <div className="text-xs text-neutral-600">
                        ক্রেতা: <strong>{ord.buyerName}</strong> ({ord.buyerPhone})
                      </div>
                      <div className="text-xs text-neutral-500">
                        ঠিকানা: {ord.buyerAddress} · মাধ্যম: {ord.deliveryType === 'home_delivery' ? 'হোম ডেলিভারি' : 'খামার পিকআপ'}
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex flex-col md:items-end gap-1">
                    <div className="text-xs text-emerald-800 font-bold font-mono">
                      অ্যাডভান্স পরিশোধিত: ৳{ord.advanceAmount.toLocaleString('bn-BD')}
                    </div>
                    <div className="text-xs text-neutral-500 font-mono">
                      বাকি টাকা: ৳{ord.remainingAmount.toLocaleString('bn-BD')}
                    </div>
                    <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                      {ord.orderStatus === 'confirmed' ? 'কনফার্মড' : 'অ্যাডভান্স পেইড'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-neutral-500">
                এখনো কোনো ক্রেতার অর্ডার আসেনি। নতুন গরু লিস্টিং করলে তা ক্রেতাদের কাছে পৌঁছাবে।
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: Subscription Info */}
      {activeTab === 'subscription' && (
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 max-w-2xl mx-auto shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900">{listingStats.planName}</h2>
              <p className="text-xs text-neutral-500">মেয়াদ উত্তীর্ণের তারিখ: {currentUser.sellerProfile?.planExpiryDate || '৩০ দিন'}</p>
            </div>
          </div>

          <div className="p-4 bg-neutral-50 rounded-xl space-y-2 text-xs">
            <div className="flex justify-between">
              <span>মোট অনুমোদিত লিস্টিং:</span>
              <strong className="font-mono">{listingStats.totalAllowed}টি গরু</strong>
            </div>
            <div className="flex justify-between">
              <span>বর্তমানে ব্যবহৃত লিস্টিং:</span>
              <strong className="font-mono">{listingStats.used}টি</strong>
            </div>
            <div className="flex justify-between text-emerald-700 font-bold">
              <span>অবশিষ্ট খালি স্লট:</span>
              <strong className="font-mono">{listingStats.remaining}টি</strong>
            </div>
          </div>

          <button
            onClick={() => setSubscriptionModalOpen(true)}
            className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl text-xs transition-colors"
          >
            অন্যান্য প্রিমিয়াম প্যাকেজ দেখুন ও কিনুন
          </button>
        </div>
      )}

      {/* TAB 6: Farm & Payment Profile Settings */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm max-w-3xl mx-auto space-y-6">
          <div className="border-b border-neutral-100 pb-3">
            <h2 className="text-base font-bold text-neutral-900">খামার ও পেমেন্ট প্রোফাইল সেটিংস</h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              খামারির লোগো, সামাজিক যোগাযোগ লিংক ও পেমেন্ট নম্বর হালনাগাদ রাখুন।
            </p>
          </div>

          {profileSaved && (
            <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>খামারের প্রোফাইল ও পেমেন্ট তথ্য সফলভাবে সংরক্ষিত হয়েছে!</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-5 text-xs">
            {/* 1. Farm Logo Upload */}
            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-3">
              <label className="block text-xs font-bold text-neutral-800">
                ১) খামারির লোগো (ফোন / কম্পিউটার থেকে আপলোড করুন):
              </label>
              <div className="flex items-center gap-4">
                {profileLogo ? (
                  <img
                    src={profileLogo}
                    alt="Farm Logo"
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-600 shrink-0 shadow-sm"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-neutral-200 border-2 border-dashed border-neutral-300 flex items-center justify-center text-xs text-neutral-500 shrink-0">
                    লোগো
                  </div>
                )}
                <div className="flex-1 space-y-2">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold">
                    <Upload className="w-3.5 h-3.5" />
                    <span>লোগো আপলোড করুন</span>
                    <input type="file" accept="image/*" onChange={handleFarmLogoUpload} className="hidden" />
                  </label>
                  <input
                    type="text"
                    value={profileLogo}
                    onChange={(e) => setProfileLogo(e.target.value)}
                    placeholder="বা লোগোর অনলাইন ইমেজ URL দিন"
                    className="w-full p-2 border rounded-xl bg-white text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Farm Name */}
            <div>
              <label className="block font-semibold mb-1">খামারের নাম:</label>
              <input
                type="text"
                value={profileFarmName}
                onChange={(e) => setProfileFarmName(e.target.value)}
                placeholder="যেমন: গ্রিন ডেইরি অ্যান্ড ক্যাটল ফার্ম"
                className="w-full p-2.5 border rounded-xl bg-white"
              />
            </div>

            {/* 2. YouTube & Facebook */}
            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-3">
              <label className="block text-xs font-bold text-neutral-800">
                ২) ইউটিউব ও ফেসবুক পেজ লিংক:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1 flex items-center gap-1.5">
                    <Youtube className="w-4 h-4 text-red-600" />
                    <span>ইউটিউব চ্যানেল / ভিডিও লিংক:</span>
                  </label>
                  <input
                    type="url"
                    value={profileYoutube}
                    onChange={(e) => setProfileYoutube(e.target.value)}
                    placeholder="https://youtube.com/@farm"
                    className="w-full p-2.5 border rounded-xl bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1 flex items-center gap-1.5">
                    <Facebook className="w-4 h-4 text-blue-600" />
                    <span>ফেসবুক পেজ লিংক:</span>
                  </label>
                  <input
                    type="url"
                    value={profileFacebook}
                    onChange={(e) => setProfileFacebook(e.target.value)}
                    placeholder="https://facebook.com/farm"
                    className="w-full p-2.5 border rounded-xl bg-white"
                  />
                </div>
              </div>
            </div>

            {/* 3. Phone & WhatsApp */}
            <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 space-y-3">
              <label className="block text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-emerald-700" />
                <span>৩) যোগাযোগের ফোন নম্বর ও WhatsApp নম্বর:</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                    মোবাইল নম্বর (প্রধান):
                  </label>
                  <input
                    type="tel"
                    disabled
                    value={currentUser.phone}
                    className="w-full p-2.5 border rounded-xl bg-neutral-100 font-mono text-neutral-600 cursor-not-allowed"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-semibold text-neutral-700 flex items-center gap-1">
                      <MessageCircle className="w-3.5 h-3.5 text-green-600" />
                      <span>WhatsApp নম্বর:</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setProfileWhatsapp(currentUser.phone)}
                      className="text-[10px] text-emerald-700 hover:underline font-semibold"
                    >
                      মোবাইল নম্বরটিই WhatsApp
                    </button>
                  </div>
                  <input
                    type="tel"
                    value={profileWhatsapp}
                    onChange={(e) => setProfileWhatsapp(e.target.value)}
                    placeholder="০১৭১২-XXXXXX"
                    className="w-full p-2.5 border rounded-xl bg-white font-mono"
                  />
                </div>
              </div>
            </div>

            {/* 4. Payment Accounts */}
            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-3">
              <label className="block text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-emerald-700" />
                <span>৪) খামারির সরাসরি টাকা লেনদেনের মাধ্যম (বিকাশ / নগদ / রকেট / ব্যাংক):</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">বিকাশ নম্বর:</label>
                  <input
                    type="text"
                    value={profileBkash}
                    onChange={(e) => setProfileBkash(e.target.value)}
                    placeholder="০১৭১২-XXXXXX"
                    className="w-full p-2.5 border rounded-xl bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">নগদ নম্বর:</label>
                  <input
                    type="text"
                    value={profileNagad}
                    onChange={(e) => setProfileNagad(e.target.value)}
                    placeholder="০১৭২২-XXXXXX"
                    className="w-full p-2.5 border rounded-xl bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">রকেট নম্বর:</label>
                  <input
                    type="text"
                    value={profileRocket}
                    onChange={(e) => setProfileRocket(e.target.value)}
                    placeholder="০১৯১১-XXXXXX"
                    className="w-full p-2.5 border rounded-xl bg-white font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 mb-1">ব্যাংক অ্যাকাউন্ট ও শাখা:</label>
                <input
                  type="text"
                  value={profileBank}
                  onChange={(e) => setProfileBank(e.target.value)}
                  placeholder="যেমন: ইসলামী ব্যাংক, হিসাব: ২০৫০..., শাখা: পাবনা সদর"
                  className="w-full p-2.5 border rounded-xl bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-md transition-colors"
            >
              প্রোফাইল তথ্য সংরক্ষণ করুন
            </button>
          </form>
        </div>
      )}

      {/* Edit Cow Modal */}
      {editingCow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-neutral-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div>
                <h3 className="text-base font-bold text-neutral-900">গরুর তথ্য সম্পাদনা (Edit Listing)</h3>
                <span className="text-xs text-neutral-400 font-mono">{editingCow.cowCode}</span>
              </div>
              <button
                type="button"
                onClick={() => setEditingCow(null)}
                className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditedCow} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">গরুর নাম:</label>
                  <input
                    type="text"
                    required
                    value={editForm.name || ''}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full p-2.5 border rounded-xl bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">মোট বিক্রয়মূল্য (টাকা):</label>
                  <input
                    type="number"
                    required
                    value={editForm.price || 0}
                    onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                    className="w-full p-2.5 border rounded-xl bg-white font-mono font-bold"
                  />
                </div>
              </div>

              {/* Photo Upload for Edit */}
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
                <label className="block font-semibold text-neutral-800">গরুর ছবি পরিবর্তন:</label>
                <div className="flex items-center gap-3">
                  <img
                    src={editForm.images?.[0] || editingCow.images[0]}
                    alt="Edit preview"
                    className="w-16 h-16 rounded-xl object-cover border border-emerald-600 shrink-0"
                  />
                  <div className="flex-1 space-y-1">
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 text-white rounded-lg font-semibold text-xs">
                      <Camera className="w-3.5 h-3.5" />
                      <span>নতুন ছবি আপলোড করুন</span>
                      <input type="file" accept="image/*" onChange={handleEditCowImageUpload} className="hidden" />
                    </label>
                    <input
                      type="text"
                      value={editForm.images?.[0] || ''}
                      onChange={(e) => setEditForm({ ...editForm, images: [e.target.value] })}
                      placeholder="বা ছবির লিংক দিন"
                      className="w-full p-1.5 border rounded-lg bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">লাইভ ওজন (কেজি):</label>
                  <input
                    type="number"
                    value={editForm.weightKg || 0}
                    onChange={(e) => setEditForm({ ...editForm, weightKg: Number(e.target.value) })}
                    className="w-full p-2 border rounded-xl bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">বয়স (বছর):</label>
                  <input
                    type="number"
                    value={editForm.ageYears || 0}
                    onChange={(e) => setEditForm({ ...editForm, ageYears: Number(e.target.value) })}
                    className="w-full p-2 border rounded-xl bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">উচ্চতা (ইঞ্চি):</label>
                  <input
                    type="number"
                    value={editForm.heightInch || 0}
                    onChange={(e) => setEditForm({ ...editForm, heightInch: Number(e.target.value) })}
                    className="w-full p-2 border rounded-xl bg-white font-mono"
                  />
                </div>
              </div>

              {/* Edit Vaccines */}
              <div>
                <label className="block font-semibold mb-1">ভ্যাকসিন ও টিকাসমূহ:</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {(editForm.vaccinations || []).map((vac) => (
                    <span key={vac} className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-xs flex items-center gap-1">
                      <span>✓ {vac}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setEditForm({
                            ...editForm,
                            vaccinations: editForm.vaccinations?.filter((v) => v !== vac),
                          })
                        }
                        className="hover:text-red-700 font-bold ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editCustomVaccine}
                    onChange={(e) => setEditCustomVaccine(e.target.value)}
                    placeholder="টিকা নাম লিখে যোগ করুন"
                    className="flex-1 p-2 border rounded-xl bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (editCustomVaccine.trim()) {
                        setEditForm({
                          ...editForm,
                          vaccinations: [...(editForm.vaccinations || []), editCustomVaccine.trim()],
                        });
                        setEditCustomVaccine('');
                      }
                    }}
                    className="px-3 py-2 bg-neutral-900 text-white rounded-xl font-semibold"
                  >
                    + যোগ
                  </button>
                </div>
              </div>

              {/* Edit Description */}
              <div>
                <label className="block font-semibold mb-1">গরুর বিস্তারিত বিবরণ:</label>
                <textarea
                  rows={3}
                  value={editForm.description || ''}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full p-2.5 border rounded-xl bg-white"
                />
              </div>

              {/* Seller Contact & Payments */}
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
                <span className="font-bold text-neutral-800">যোগাযোগ ও পেমেন্ট নম্বর:</span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={editForm.sellerPhone || ''}
                    onChange={(e) => setEditForm({ ...editForm, sellerPhone: e.target.value })}
                    placeholder="মোবাইল নম্বর"
                    className="p-2 border rounded-xl bg-white font-mono"
                  />
                  <input
                    type="text"
                    value={editForm.sellerWhatsapp || ''}
                    onChange={(e) => setEditForm({ ...editForm, sellerWhatsapp: e.target.value })}
                    placeholder="WhatsApp নম্বর"
                    className="p-2 border rounded-xl bg-white font-mono"
                  />
                  <input
                    type="text"
                    value={editForm.sellerBkash || ''}
                    onChange={(e) => setEditForm({ ...editForm, sellerBkash: e.target.value })}
                    placeholder="বিকাশ নম্বর"
                    className="p-2 border rounded-xl bg-white font-mono"
                  />
                  <input
                    type="text"
                    value={editForm.sellerNagad || ''}
                    onChange={(e) => setEditForm({ ...editForm, sellerNagad: e.target.value })}
                    placeholder="নগদ নম্বর"
                    className="p-2 border rounded-xl bg-white font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingCow(null)}
                  className="px-4 py-2 border rounded-xl text-neutral-600 hover:bg-neutral-100 font-semibold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold shadow-xs"
                >
                  পরিবর্তন সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
