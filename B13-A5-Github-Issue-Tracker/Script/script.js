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
