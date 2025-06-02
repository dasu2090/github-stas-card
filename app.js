// GitHub Stats Card Generator
// Main Application Logic

/**
 * GitHub APIの基本URL
 */
const GITHUB_API_BASE = 'https://api.github.com';

/**
 * DOM要素の参照
 */
const elements = {
    usernameInput: document.getElementById('username'),
    generateBtn: document.getElementById('generateBtn'),
    resultDiv: document.getElementById('result')
};

/**
 * GitHub APIからユーザー情報を取得
 * @param {string} username - GitHubユーザー名
 * @returns {Promise<Object>} ユーザー情報
 */
async function fetchUserData(username) {
    const response = await fetch(`${GITHUB_API_BASE}/users/${username}`);
    
    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('ユーザーが見つかりません');
        } else if (response.status === 403) {
            throw new Error('APIリクエスト制限に達しました。しばらく待ってから再試行してください。');
        } else {
            throw new Error('ユーザー情報の取得に失敗しました');
        }
    }
    
    return await response.json();
}

/**
 * GitHub APIからリポジトリ情報を取得
 * @param {string} username - GitHubユーザー名
 * @returns {Promise<Array>} リポジトリ配列
 */
async function fetchUserRepos(username) {
    const response = await fetch(`${GITHUB_API_BASE}/users/${username}/repos?per_page=100`);
    
    if (!response.ok) {
        console.warn('リポジトリ情報の取得に失敗しました');
        return [];
    }
    
    return await response.json();
}

/**
 * リポジトリ配列から総スター数を計算
 * @param {Array} repos - リポジトリ配列
 * @returns {number} 総スター数
 */
function calculateTotalStars(repos) {
    return repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
}

/**
 * SVG統計カードを生成
 * @param {Object} stats - 統計情報
 * @param {string} stats.name - 表示名
 * @param {string} stats.username - ユーザー名
 * @param {number} stats.stars - 総スター数
 * @param {number} stats.repos - リポジトリ数
 * @param {number} stats.followers - フォロワー数
 * @returns {string} SVG文字列
 */
function createStatsCard({ name, username, stars, repos, followers }) {
    return `
        <svg width="495" height="195" viewBox="0 0 495 195" fill="none" xmlns="http://www.w3.org/2000/svg" class="svg-card">
            <style>
                .header { font: 600 18px 'Segoe UI', Ubuntu, Sans-Serif; fill: #2f80ed; }
                .stat { font: 600 14px 'Segoe UI', Ubuntu, Sans-Serif; fill: #333; }
                .stname { font: 400 12px 'Segoe UI', Ubuntu, Sans-Serif; fill: #666; }
                .icon { fill: #4c71f2; }
                .bold { font-weight: 700; }
            </style>
            
            <rect x="0.5" y="0.5" rx="4.5" height="99%" width="99%" fill="#fffefe" stroke="#e4e2e2"/>
            
            <g transform="translate(25, 35)">
                <g transform="translate(0, 0)">
                    <text x="0" y="0" class="header">${escapeHtml(name)}のGitHub統計</text>
                </g>
            </g>
            
            <g transform="translate(25, 70)">
                <g transform="translate(0, 25)">
                    <g class="stat">
                        <circle cx="8" cy="6" r="4" class="icon"/>
                        <text class="stat bold" x="25" y="12.5">総スター数:</text>
                        <text class="stat" x="120" y="12.5">${stars.toLocaleString()}</text>
                    </g>
                </g>
                
                <g transform="translate(220, 25)">
                    <g class="stat">
                        <rect x="4" y="2" width="8" height="8" rx="2" class="icon"/>
                        <text class="stat bold" x="25" y="12.5">総リポジトリ数:</text>
                        <text class="stat" x="140" y="12.5">${repos.toLocaleString()}</text>
                    </g>
                </g>
                
                <g transform="translate(0, 50)">
                    <g class="stat">
                        <circle cx="8" cy="6" r="3" fill="none" stroke="#4c71f2" stroke-width="2"/>
                        <circle cx="6" cy="4" r="1" class="icon"/>
                        <circle cx="10" cy="4" r="1" class="icon"/>
                        <text class="stat bold" x="25" y="12.5">フォロワー数:</text>
                        <text class="stat" x="120" y="12.5">${followers.toLocaleString()}</text>
                    </g>
                </g>
            </g>
        </svg>
    `;
}

/**
 * HTMLエスケープ処理
 * @param {string} text - エスケープするテキスト
 * @returns {string} エスケープされたテキスト
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * ローディング状態を設定
 * @param {boolean} isLoading - ローディング状態
 */
function setLoadingState(isLoading) {
    if (isLoading) {
        elements.generateBtn.disabled = true;
        elements.generateBtn.innerHTML = '<span class="loading"></span>生成中...';
    } else {
        elements.generateBtn.disabled = false;
        elements.generateBtn.innerHTML = 'カードを生成';
    }
}

/**
 * エラーメッセージを表示
 * @param {string} message - エラーメッセージ
 */
function showError(message) {
    elements.resultDiv.innerHTML = `<div class="error">エラー: ${escapeHtml(message)}</div>`;
}

/**
 * 成功時の結果を表示
 * @param {string} svg - SVG文字列
 * @param {string} username - ユーザー名
 */
function showResult(svg, username) {
    elements.resultDiv.innerHTML = `
        <div class="card-container">
            ${svg}
            <button class="download-btn" onclick="downloadSVG('${escapeHtml(username)}')">
                📥 SVGをダウンロード
            </button>
        </div>
    `;
}

/**
 * SVGファイルをダウンロード
 * @param {string} username - ユーザー名
 */
function downloadSVG(username) {
    const svg = document.querySelector('.svg-card').outerHTML;
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${username}-github-stats.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * GitHub統計カードを生成するメイン関数
 */
async function generateCard() {
    const username = elements.usernameInput.value.trim();
    
    // バリデーション
    if (!username) {
        showError('ユーザー名を入力してください');
        return;
    }

    // ローディング開始
    setLoadingState(true);
    elements.resultDiv.innerHTML = '';

    try {
        // GitHub APIからデータを取得
        const [userData, reposData] = await Promise.all([
            fetchUserData(username),
            fetchUserRepos(username)
        ]);
        
        // 統計情報を計算
        const stats = {
            name: userData.name || userData.login,
            username: userData.login,
            stars: calculateTotalStars(reposData),
            repos: userData.public_repos,
            followers: userData.followers
        };
        
        // SVGカードを生成して表示
        const svg = createStatsCard(stats);
        showResult(svg, username);
        
    } catch (error) {
        console.error('カード生成エラー:', error);
        showError(error.message);
    } finally {
        setLoadingState(false);
    }
}

/**
 * イベントリスナーの設定
 */
function initializeEventListeners() {
    // Enterキーでカード生成
    elements.usernameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            generateCard();
        }
    });
    
    // フォーカス時に前回のエラーをクリア
    elements.usernameInput.addEventListener('focus', function() {
        const errorDiv = elements.resultDiv.querySelector('.error');
        if (errorDiv) {
            elements.resultDiv.innerHTML = '';
        }
    });
}

/**
 * アプリケーションの初期化
 */
function initializeApp() {
    console.log('GitHub Stats Card Generator が起動しました');
    initializeEventListeners();
}

// DOMContentLoaded時にアプリケーションを初期化
document.addEventListener('DOMContentLoaded', initializeApp);
