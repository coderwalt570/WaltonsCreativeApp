// Fetch logged-in user details and data for manager dashboard
async function loadManagerData() {
  try {
    const response = await fetch("/data/manager");
    const result = await response.json();
  
    if (!response.ok) {
    window.location.href = "/login.html";
      return;
    }

    // Display welcome message
    document.getElementById("welcome").innerText = `Welcome, ${result.username}! 👋`;
    
    // Display Projects Count
    document.getElementById("projectsCount").innerText = result.projectsCount;
    
    // Display Expenses Count
    document.getElementById("expensesCount").innerText = result.expensesCount;
    
  } catch (err) {
    console.error("Manager Dashboard Error:", err);
  }
}

// Logout Function
function logout() {
  fetch("/logout", { method: "POST" })
    .then(() => (window.location.href = "/login.html"))
    .catch((err) => console.error("Logout Error:", err));
}

// Load data when the page opens
loadManagerData();
