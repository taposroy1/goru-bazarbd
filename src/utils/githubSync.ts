import { GitHubSyncConfig } from '../types';

export interface GitHubRepoDetails {
  fullName: string;
  htmlUrl: string;
  defaultBranch: string;
  description: string;
  isPrivate: boolean;
  updatedAt: string;
  latestCommitSha?: string;
  latestCommitMessage?: string;
}

/**
 * Safely encode UTF-8 string (including Bengali unicode characters) to Base64
 */
export function utf8ToBase64(str: string): string {
  try {
    return window.btoa(
      encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) =>
        String.fromCharCode(parseInt(p1, 16))
      )
    );
  } catch (e) {
    console.error('Base64 encoding error:', e);
    return window.btoa(unescape(encodeURIComponent(str)));
  }
}

/**
 * Decode Base64 string to UTF-8
 */
export function base64ToUtf8(str: string): string {
  try {
    return decodeURIComponent(
      Array.prototype.map
        .call(window.atob(str), (c: string) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
  } catch (e) {
    return decodeURIComponent(escape(window.atob(str)));
  }
}

/**
 * Test connectivity with user's GitHub repository using their Token
 */
export async function testGitHubConnection(
  config: Pick<GitHubSyncConfig, 'owner' | 'repo' | 'token'>
): Promise<{ success: boolean; message: string; details?: GitHubRepoDetails }> {
  const { owner, repo, token } = config;

  if (!owner || !repo) {
    return { success: false, message: 'GitHub ব্যবহারকারীর নাম এবং রিপোজিটরির নাম পূরণ করুন।' };
  }

  const cleanOwner = owner.trim();
  const cleanRepo = repo.trim().replace(/^https:\/\/github\.com\//, '').replace(/\.git$/, '');
  const cleanToken = token ? token.trim() : '';

  try {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github.v3+json',
    };
    if (cleanToken) {
      headers.Authorization = `Bearer ${cleanToken}`;
    }

    const res = await fetch(`https://api.github.com/repos/${cleanOwner}/${cleanRepo}`, {
      headers,
    });

    if (!res.ok) {
      if (res.status === 401) {
        return {
          success: false,
          message: 'GitHub টোকেন অবৈধ বা মেয়াদোত্তীর্ণ। অনুগ্রহ করে নতুন Personal Access Token (PAT) দিন।',
        };
      }
      if (res.status === 404) {
        return {
          success: false,
          message: `রিপোজিটরি "${cleanOwner}/${cleanRepo}" পাওয়া যায়নি। অনুগ্রহ করে রিপোজিটরির নাম সঠিক কিনা অথবা টোকেনের "repo" পারমিশন আছে কিনা যাচাই করুন।`,
        };
      }
      return {
        success: false,
        message: `GitHub API ত্রুটি (${res.status}): ${res.statusText}`,
      };
    }

    const repoData = await res.json();

    // Check latest commit
    let latestCommitSha = '';
    let latestCommitMessage = '';
    try {
      const commitRes = await fetch(
        `https://api.github.com/repos/${cleanOwner}/${cleanRepo}/commits?per_page=1`,
        { headers }
      );
      if (commitRes.ok) {
        const commits = await commitRes.json();
        if (commits && commits.length > 0) {
          latestCommitSha = commits[0].sha?.substring(0, 7) || '';
          latestCommitMessage = commits[0].commit?.message?.split('\n')[0] || '';
        }
      }
    } catch {
      // commit check failure is non-fatal
    }

    return {
      success: true,
      message: `সফলভাবে সংযুক্ত হয়েছে: ${repoData.full_name}`,
      details: {
        fullName: repoData.full_name,
        htmlUrl: repoData.html_url,
        defaultBranch: repoData.default_branch || 'main',
        description: repoData.description || 'গরু বাজার অনলাইন মার্কেটপ্লেস',
        isPrivate: repoData.private,
        updatedAt: repoData.updated_at,
        latestCommitSha,
        latestCommitMessage,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      message: `কানেকশন ব্যর্থ হয়েছে: ${error.message || 'নেটওয়ার্ক সমস্যা'}`,
    };
  }
}

/**
 * Commit a single file to GitHub via GitHub Contents API
 */
export async function commitFileToGitHub(options: {
  owner: string;
  repo: string;
  branch: string;
  token: string;
  filePath: string;
  content: string;
  commitMessage: string;
}): Promise<{ success: boolean; message: string; sha?: string; commitSha?: string }> {
  const { owner, repo, branch, token, filePath, content, commitMessage } = options;

  if (!token) {
    return {
      success: false,
      message: 'GitHub-এ পুশ করার জন্য Personal Access Token (PAT) আবশ্যক।',
    };
  }

  const cleanOwner = owner.trim();
  const cleanRepo = repo.trim().replace(/^https:\/\/github\.com\//, '').replace(/\.git$/, '');
  const cleanBranch = branch.trim() || 'main';
  const cleanToken = token.trim();

  const headers = {
    Authorization: `Bearer ${cleanToken}`,
    Accept: 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
  };

  try {
    // 1. Get existing file SHA if it exists
    let existingSha: string | undefined;
    const checkRes = await fetch(
      `https://api.github.com/repos/${cleanOwner}/${cleanRepo}/contents/${filePath}?ref=${cleanBranch}`,
      { headers }
    );

    if (checkRes.ok) {
      const existingData = await checkRes.json();
      existingSha = existingData.sha;
    }

    // 2. Put file contents
    const base64Content = utf8ToBase64(content);
    const putPayload: any = {
      message: commitMessage,
      content: base64Content,
      branch: cleanBranch,
    };
    if (existingSha) {
      putPayload.sha = existingSha;
    }

    const putRes = await fetch(
      `https://api.github.com/repos/${cleanOwner}/${cleanRepo}/contents/${filePath}`,
      {
        method: 'PUT',
        headers,
        body: JSON.stringify(putPayload),
      }
    );

    if (!putRes.ok) {
      const errJson = await putRes.json().catch(() => ({}));
      return {
        success: false,
        message: `GitHub কমিট ত্রুটি (${putRes.status}): ${errJson.message || putRes.statusText}`,
      };
    }

    const putResult = await putRes.json();
    return {
      success: true,
      message: `সফলভাবে GitHub-এ পুশ হয়েছে: ${filePath}`,
      sha: putResult.content?.sha,
      commitSha: putResult.commit?.sha?.substring(0, 7),
    };
  } catch (error: any) {
    return {
      success: false,
      message: `GitHub সিঙ্ক করতে সমস্যা হয়েছে: ${error.message || 'নেটওয়ার্ক ত্রুটি'}`,
    };
  }
}

/**
 * Synchronize full marketplace database state to GitHub
 */
export async function syncMarketplaceStateToGitHub(
  config: GitHubSyncConfig,
  state: {
    cows: any[];
    settings: any;
    plans: any[];
    orders: any[];
    users: any[];
  },
  customCommitMessage?: string
): Promise<{ success: boolean; message: string; commitSha?: string }> {
  if (!config.token) {
    return {
      success: false,
      message: 'GitHub Personal Access Token (PAT) প্রদান করা হয়নি। অনুগ্রহ করে সেটিংসে টোকেন দিন।',
    };
  }

  const now = new Date();
  const banglaTimestamp = now.toLocaleString('bn-BD', { timeZone: 'Asia/Dhaka' });
  const defaultMsg = `গবাদিপশু মার্কেটপ্লেস অটো-সিঙ্ক [${banglaTimestamp}]`;
  const commitMessage = customCommitMessage || defaultMsg;

  // JSON payload
  const databasePayload = {
    version: '1.2.0',
    lastSyncTimestamp: now.toISOString(),
    lastSyncBangla: banglaTimestamp,
    totalCows: state.cows.length,
    siteSettings: state.settings,
    cows: state.cows,
    subscriptionPlans: state.plans,
    recentOrders: state.orders.slice(0, 50),
    meta: {
      generator: 'Goru Bazar Live GitHub Auto-Sync Engine',
      app: 'গরু বাজার | বাংলাদেশের বিশ্বস্ত গবাদিপশু মার্কেটপ্লেস',
    },
  };

  const jsonString = JSON.stringify(databasePayload, null, 2);

  // Commit to 'data/database.json'
  const result1 = await commitFileToGitHub({
    owner: config.owner,
    repo: config.repo,
    branch: config.branch || 'main',
    token: config.token,
    filePath: 'data/database.json',
    content: jsonString,
    commitMessage,
  });

  if (!result1.success) {
    return result1;
  }

  // Also commit to 'src/data/marketplace-data.json' for direct import compatibility
  await commitFileToGitHub({
    owner: config.owner,
    repo: config.repo,
    branch: config.branch || 'main',
    token: config.token,
    filePath: 'src/data/marketplace-data.json',
    content: jsonString,
    commitMessage: `Update frontend marketplace data bundle [${banglaTimestamp}]`,
  }).catch(() => {
    // optional secondary file
  });

  return {
    success: true,
    message: `সফলভাবে GitHub-এ ডেটা পুশ ও সিঙ্ক সম্পন্ন হয়েছে! (${banglaTimestamp})`,
    commitSha: result1.commitSha,
  };
}

/**
 * Generate standard Git CLI terminal commands for local linking
 */
export function generateGitCliCommands(owner: string, repo: string, branch = 'main'): string {
  const cleanOwner = (owner || 'taposroy616').trim();
  const cleanRepo = (repo || 'goru-bazar').trim().replace(/\.git$/, '');
  const cleanBranch = (branch || 'main').trim();

  return `# ১. গিট ইনিশিয়ালাইজ করুন (যদি পূর্বে না করা থাকে)
git init

# ২. মেইন ব্রাঞ্চ নির্বাচন করুন
git branch -M ${cleanBranch}

# ৩. আপনার GitHub রিপোজিটরি রিমোট হিসেবে যোগ করুন
git remote add origin https://github.com/${cleanOwner}/${cleanRepo}.git

# ৪. সকল ফাইল যুক্ত করুন ও কমিট করুন
git add .
git commit -m "গরু বাজার মার্কেটপ্লেস - প্রোডাকশন আপডেট"

# ৫. GitHub-এ সরাসরি পুশ করুন
git push -u origin ${cleanBranch}`;
}
