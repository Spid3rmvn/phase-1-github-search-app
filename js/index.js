// Select DOM elements
const form = document.querySelector('#github-form');
const searchInput = document.querySelector('#search');
const userList = document.querySelector('#user-list');
const reposList = document.querySelector('#repos-list');

// State variables
let searchType = 'users'; // Default search type

// API base URL and headers
const API_BASE_URL = 'https://api.github.com';
const HEADERS = {
  Accept: 'application/vnd.github.v3+json',
};

// Function to search for users
async function searchUsers(query) {
  const url = `${API_BASE_URL}/search/users?q=${query}`;
  const response = await fetch(url, { headers: HEADERS });
  if (!response.ok) {
    throw new Error('Failed to fetch user data');
  }
  const data = await response.json();
  return data.items;
}

// Function to search for repositories
async function searchRepos(query) {
  const url = `${API_BASE_URL}/search/repositories?q=${query}`;
  const response = await fetch(url, { headers: HEADERS });
  if (!response.ok) {
    throw new Error('Failed to fetch repository data');
  }
  const data = await response.json();
  return data.items;
}

// Function to fetch user repositories
async function fetchUserRepos(username) {
  const url = `${API_BASE_URL}/users/${username}/repos`;
  const response = await fetch(url, { headers: HEADERS });
  if (!response.ok) {
    throw new Error('Failed to fetch user repositories');
  }
  const data = await response.json();
  return data;
}

// Function to display users
function displayUsers(users) {
  userList.innerHTML = '';
  reposList.innerHTML = '';
  users.forEach((user) => {
    const userItem = document.createElement('li');
    userItem.innerHTML = `
      <img src="${user.avatar_url}" alt="${user.login}'s avatar" width="50">
      <h3>${user.login}</h3>
      <a href="${user.html_url}" target="_blank">View Profile</a>
      <button data-username="${user.login}" class="view-repos">View Repositories</button>
    `;
    userList.appendChild(userItem);
  });

  document.querySelectorAll('.view-repos').forEach((button) => {
    button.addEventListener('click', async (event) => {
      const username = event.target.dataset.username;
      try {
        const repos = await fetchUserRepos(username);
        displayRepos(repos);
      } catch (error) {
        console.error(error);
      }
    });
  });
}

// Function to display repositories
function displayRepos(repos) {
  reposList.innerHTML = '';
  repos.forEach((repo) => {
    const repoItem = document.createElement('li');
    repoItem.innerHTML = `
      <h3>${repo.name}</h3>
      <p>${repo.description || 'No description available'}</p>
      <a href="${repo.html_url}" target="_blank">View Repository</a>
    `;
    reposList.appendChild(repoItem);
  });
}

// Event listener for form submission
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const query = searchInput.value.trim();
  if (!query) return;

  try {
    if (searchType === 'users') {
      const users = await searchUsers(query);
      displayUsers(users);
    } else {
      const repos = await searchRepos(query);
      displayRepos(repos);
    }
  } catch (error) {
    console.error(error);
    userList.innerHTML = '<p>Something went wrong. Please try again later.</p>';
    reposList.innerHTML = '';
  }
});
