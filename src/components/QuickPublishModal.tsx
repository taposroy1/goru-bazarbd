import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { generateNetlifyDistZip, triggerDownload } from '../utils/distBuilder';
import {
  Download,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  Globe,
  UploadCloud,
  FolderArchive,
  ArrowRight,
  GitBranch,
  X,
  Laptop,
  Check,
  Copy,
} from 'lucide-react';

interface QuickPublishModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickPublishModal: React.FC<QuickPublishModalProps> = ({ isOpen, onClose }) => {
  const { cows, settings, plans, currentUser, githubConfig, syncToGitHub } = useApp();

  const [isBuilding, setIsBuilding] = useState(false);
  const [buildProgress, setBuildProgress] = useState(0);
  const [stepName, setStepName] = useState('');
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [downloadedFileName, setDownloadedFileName] = useState('');
  const [isSyncingGit, setIsSyncingGit] = useState(false);
  const [gitSyncMsg, setGitSyncMsg] = useState<{ success: boolean; text: string } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  // 1-Click Instant Download
  const handleOneClickDownload = async () => {
    setIsBuilding(true);
    setDownloadSuccess(false);
    setBuildProgress(10);
    setStepName('ওয়েবসাইট ও গবাদিপশুর ডাটা প্যাকেজিং শুরু হচ্ছে...');

    try {
      const res = await generateNetlifyDistZip({
        version: '1.2.0',
        adminName: currentUser ? currentUser.name : 'অ্যাডমিন',
        settings,
        cows,
        plans,
        onProgress: (p, s) => {
          setBuildProgress(p);
          setStepName(s);
        },
      });

      triggerDownload(res.blob, res.filename);
      setDownloadedFileName(res.filename);
      setDownloadSuccess(true);
    } catch (err) {
      console.error(err);
      setStepName('ডাউনলোড তৈরিতে সমস্যা হয়েছে। পুনরায় চেষ্টা করুন।');
    } finally {
      setIsBuilding(false);
    }
  };

  // 1-Click GitHub Sync
  const handleGitSync = async () => {
    if (!githubConfig?.token) {
      setGitSyncMsg({
        success: false,
        text: 'GitHub Personal Access Token (PAT) প্রয়োজন। অ্যাডমিন ড্যাশবোর্ডের GitHub ট্যাবে টোকেন সেট করুন।',
      });
      return;
    }
    setIsSyncingGit(true);
    setGitSyncMsg(null);
    try {
      const res = await syncToGitHub('১-ক্লিকে লাইভ সাইট অটো-সিঙ্ক ও আপডেট');
      if (res.success) {
        setGitSyncMsg({ success: true, text: 'সফলভাবে আপনার GitHub রিপোজিটরিতে সকল পরিবর্তন পুশ হয়েছে!' });
      } else {
        setGitSyncMsg({ success: false, text: res.message });
      }
    } catch (e: any) {
      setGitSyncMsg({ success: false, text: e.message || 'সিঙ্ক ব্যর্থ হয়েছে' });
    } finally {
      setIsSyncingGit(false);
    }
  };

  const copyNetlifyUrl = () => {
    navigator.clipboard.writeText('https://app.netlify.com/drop');
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-5 sm:p-7 shadow-2xl border border-neutral-200 space-y-6">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
                ১-ক্লিকে সাইট ডাউনলোড ও লাইভ পাবলিশ
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                কোনো জটিল কোডিং ছাড়াই সম্পূর্ণ তৈরি ওয়েবসাইট ডাউনলোড করুন এবং বিনামূল্যে ইন্টারনেটে লাইভ করুন।
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center text-sm font-bold transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Action: 1-Click Download Button */}
        <div className="p-5 sm:p-6 bg-gradient-to-br from-emerald-950 via-emerald-900 to-neutral-900 rounded-3xl text-white shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-400/30">
                ★ সবচেয়ে সহজ পদ্ধতি
              </span>
              <h3 className="text-lg font-bold text-white mt-2">
                সম্পূর্ণ রেডি ওয়েবসাইট প্যাকেজ (.ZIP)
              </h3>
              <p className="text-xs text-emerald-200/90 mt-1 leading-relaxed">
                সকল গরুর ছবি, রেসপনসিভ ডিজাইন ও ডেটা সহ স্বয়ংসম্পূর্ণ ওয়েবসাইট এক ক্লিকে ডাউনলোড হবে।
              </p>
            </div>
          </div>

          {/* Download Button */}
          <button
            onClick={handleOneClickDownload}
            disabled={isBuilding}
            className="w-full py-4 px-6 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-75 text-neutral-950 rounded-2xl font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all shadow-md active:scale-98 cursor-pointer"
          >
            {isBuilding ? (
              <>
                <div className="w-5 h-5 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin" />
                <span>ফাইল ও ছবি প্যাকেজিং হচ্ছে ({buildProgress}%)...</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5 stroke-[2.5]" />
                <span>১-ক্লিকে ওয়েবসাইট ডাউনলোড করুন (.ZIP)</span>
              </>
            )}
          </button>

          {/* Progress bar during generation */}
          {isBuilding && (
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-[11px] text-emerald-200 font-mono">
                <span>{stepName}</span>
                <span>{buildProgress}%</span>
              </div>
              <div className="w-full bg-emerald-950/80 rounded-full h-2 overflow-hidden border border-emerald-800">
                <div
                  className="bg-emerald-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${buildProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Download Success Banner */}
          {downloadSuccess && (
            <div className="p-4 bg-emerald-800/60 border border-emerald-400/50 rounded-2xl text-xs space-y-2 animate-in fade-in">
              <div className="flex items-center gap-2 text-emerald-200 font-bold">
                <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
                <span>সফলভাবে ডাউনলোড সম্পন্ন হয়েছে! ({downloadedFileName})</span>
              </div>
              <p className="text-[11px] text-emerald-100">
                ফাইলটি আপনার কম্পিউটারে সেভ হয়েছে। এবার নিচে দেওয়া <strong>Netlify Drop</strong> লিংকে ফাইলটি টেনে ছেড়ে দিলেই সাথে সাথে সম্পূর্ণ বিনামূল্যে সাইটটি লাইভ হয়ে যাবে!
              </p>
              <div className="pt-1">
                <a
                  href="https://app.netlify.com/drop"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-emerald-950 font-bold rounded-xl text-xs hover:bg-emerald-50 transition-colors shadow-sm"
                >
                  <span>এখনই Netlify Drop খুলুন ও লাইভ করুন</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* 3 Step Live Publishing Guide */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            ডাউনলোড করার পর কীভাবে সাইট লাইভ পাবলিশ করবেন?
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {/* Step 1 */}
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2">
              <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                ১
              </div>
              <div className="font-bold text-neutral-900">ফাইলটি আনজিপ করুন</div>
              <p className="text-[11px] text-neutral-500 leading-relaxed">
                ডাউনলোড করা ZIP ফাইলটির উপর রাইট ক্লিক করে <strong>Extract / Unzip</strong> করুন।
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2">
              <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                ২
              </div>
              <div className="font-bold text-neutral-900">Netlify Drop খুলুন</div>
              <p className="text-[11px] text-neutral-500 leading-relaxed">
                ফ্রি হোস্টিংয়ের জন্য ব্রাউজারে <a href="https://app.netlify.com/drop" target="_blank" rel="noopener noreferrer" className="text-emerald-700 font-semibold underline">app.netlify.com/drop</a> ওপেন করুন।
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-2">
              <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                ৩
              </div>
              <div className="font-bold text-emerald-950">ড্র্যাগ অ্যান্ড ড্রপ করুন</div>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                আনজিপ করা ফোল্ডারটি মাউস দিয়ে টেনে Netlify স্ক্রিনে ছেড়ে দিন। ১০ সেকেন্ডে সাইট লাইভ!
              </p>
            </div>
          </div>
        </div>

        {/* Alternative Publishing Methods */}
        <div className="border-t pt-4 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            অন্যান্য সহজ উপায়সমূহ (Alternative Options)
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Offline Local Preview */}
            <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 flex items-start gap-3">
              <div className="p-2 bg-neutral-200 rounded-xl text-neutral-700 shrink-0">
                <Laptop className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-neutral-900">ইন্টারনেট ছাড়াই কম্পিউটারে দেখা</div>
                <p className="text-[11px] text-neutral-500 mt-0.5 leading-relaxed">
                  আনজিপ করা ফোল্ডারের <code>index.html</code> ফাইলে ডাবল ক্লিক করলেই যেকোনো ব্রাউজারে পুরো সাইট অফলাইনে চলবে।
                </p>
              </div>
            </div>

            {/* Custom Domain / cPanel */}
            <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 flex items-start gap-3">
              <div className="p-2 bg-neutral-200 rounded-xl text-neutral-700 shrink-0">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-neutral-900">নিজস্ব ডোমেইন ও cPanel হোস্টিং</div>
                <p className="text-[11px] text-neutral-500 mt-0.5 leading-relaxed">
                  আপনার হোস্টিংয়ের <code>public_html</code> ফোল্ডারে এই ফাইলগুলো আপলোড করলেই নিজস্ব ডোমেইনে সাইট লাইভ হয়ে যাবে।
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* GitHub 1-Click Sync Status */}
        <div className="p-4 bg-neutral-100/90 rounded-2xl border border-neutral-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-neutral-900 text-white rounded-xl shrink-0">
              <GitBranch className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="font-bold text-neutral-900">
                GitHub রিপোজিটরি: <span className="font-mono text-emerald-800">{githubConfig?.owner || 'taposroy616'}/{githubConfig?.repo || 'goru-bazar'}</span>
              </div>
              <div className="text-[11px] text-neutral-500">
                {githubConfig?.token
                  ? 'টোকেন সংযুক্ত আছে। ১-ক্লিকে লাইভ সিঙ্ক সম্ভব।'
                  : 'টোকেন অ্যাডমিন ড্যাশবোর্ডের GitHub সেটিংসে সংরক্ষণ করা যায়।'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {githubConfig?.token ? (
              <button
                onClick={handleGitSync}
                disabled={isSyncingGit}
                className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <GitBranch className={`w-3.5 h-3.5 ${isSyncingGit ? 'animate-spin' : ''}`} />
                <span>{isSyncingGit ? 'সিঙ্ক হচ্ছে...' : 'GitHub-এ পুশ করুন'}</span>
              </button>
            ) : (
              <a
                href={`https://github.com/${githubConfig?.owner || 'taposroy616'}/${githubConfig?.repo || 'goru-bazar'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <span>GitHub দেখুন</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        {gitSyncMsg && (
          <div
            className={`p-3 rounded-xl text-xs font-semibold ${
              gitSyncMsg.success ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-red-50 text-red-900 border border-red-200'
            }`}
          >
            {gitSyncMsg.text}
          </div>
        )}

        {/* Footer info & close */}
        <div className="flex items-center justify-between pt-2 border-t text-xs text-neutral-500">
          <span>প্যাকেজে অন্তর্ভুক্ত: HTML, CSS, JavaScript, Images, Netlify Config</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 rounded-xl font-bold transition-colors"
          >
            বন্ধ করুন
          </button>
        </div>

      </div>
    </div>
  );
};
