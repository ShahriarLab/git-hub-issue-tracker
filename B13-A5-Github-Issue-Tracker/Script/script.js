const API_BASE = "https://phi-lab-server.vercel.app/api/v1/lab";
let allIssuesData = [];

/**
 Authentication
 */
function handleLogin() {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    if (user === 'admin' && pass === 'admin123') {
        document.getElementById('login-page').classList.add('hidden');
        document.getElementById('main-page').classList.remove('hidden');
        fetchAllIssues();
    } else {
        alert(" Invalid Credentials. Please use the demo login.");
    }
}

/**
  API Connect
 */
async function fetchAllIssues() {
    toggleLoading(true);
    try {
        const response = await fetch(`${API_BASE}/issues`);
        const result = await response.json();
        allIssuesData = result.data || result; 
        displayIssues(allIssuesData);
    } catch (error) {
        console.error("Fetch Error:", error);
    } finally {
        toggleLoading(false);
    }
}

/**
 *  Search Functionality
 */
async function handleSearch() {
    const query = document.getElementById('search-input').value;
    if (!query.trim()) return fetchAllIssues();

    toggleLoading(true);
    try {
        const response = await fetch(`${API_BASE}/issues/search?q=${query}`);
        const result = await response.json();
        displayIssues(result.data || result);
    } catch (error) {
        console.error("Search Error:", error);
    } finally {
        toggleLoading(false);
    }
}

/**
 *  UI Rendering
 */
function displayIssues(issues) {
    const container = document.getElementById('issues-container');
    const countEl = document.getElementById('issue-count');
    
    container.innerHTML = "";
    countEl.innerText = issues.length;

    if (issues.length === 0) {
        container.innerHTML = `<div class="col-span-full text-center py-10 text-gray-400">No issues found.</div>`;
        return;
    }

    issues.forEach(issue => {
        
        const statusLower = issue.status?.toLowerCase();
        const borderClass = statusLower === 'open' ? 'border-t-green-500' : 'border-t-purple-500';

        const card = document.createElement('div');
        // Card layout and styles
        card.className = `card bg-white shadow-sm border border-gray-100 border-t-4 ${borderClass} hover:shadow-md transition-all cursor-pointer`;
        card.onclick = () => showIssueDetails(issue._id);

        card.innerHTML = `
            <div class="card-body p-5">
                <div class="flex justify-between items-start mb-2">
                    <span class="badge badge-sm font-bold ${statusLower === 'open' ? 'badge-success' : 'badge-secondary'} text-white lowercase">
                        ${issue.status}
                    </span>
                    <span class="text-[10px] font-bold text-gray-400 uppercase">${issue.category}</span>
                </div>
                <h2 class="card-title text-base font-bold line-clamp-1">${issue.title}</h2>
                <p class="text-xs text-gray-500 line-clamp-2 my-2">${issue.description}</p>
                
                <div class="flex flex-wrap gap-1 mt-auto pt-4 border-t border-gray-50">
                    <span class="px-2 py-0.5 bg-gray-100 rounded text-[10px] font-medium text-gray-600">${issue.label}</span>
                    <span class="px-2 py-0.5 bg-blue-50 rounded text-[10px] font-medium text-blue-600">${issue.priority}</span>
                </div>

                <div class="flex items-center gap-2 mt-4">
                    <div class="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                        ${issue.author.charAt(0)}
                    </div>
                    <div class="flex flex-col">
                        <span class="text-[11px] font-bold text-gray-700">${issue.author}</span>
                        <span class="text-[10px] text-gray-400">${new Date(issue.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

