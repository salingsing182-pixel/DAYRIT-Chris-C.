const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwMOo6nFBFs5CWF3uPIuxwCbau8PZiPlKHqlv6pNcGoahZykKpx_kOXU_TPlNQyruVA/exec";

let records = [];

async function init() {
  try {
    const response = await fetch(APPS_SCRIPT_URL);

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();

    records = data.records || [];

    // Create dropdown options
    ["profession", "gender"].forEach(function(type) {
      const select = document.getElementById(type);

      // Remove existing dynamic options, keeping "All"
      select.querySelectorAll("option:not([value='all'])")
        .forEach(option => option.remove());

      const values = [
        ...new Set(
          records
            .map(r => r[type])
            .filter(value => value !== null && value !== "")
        )
      ];

      values
        .sort()
        .forEach(function(value) {
          select.add(new Option(value, value));
        });
    });

    filter();

  } catch (error) {
    document.getElementById("results").textContent =
      "Error loading data.";

    console.error("Error loading records:", error);
  }
}


function ageGroup(age) {
  const a = parseInt(age, 10);

  if (isNaN(a)) return null;

  if (a >= 18 && a <= 20) return "18-20";
  if (a >= 21 && a <= 25) return "21-25";
  if (a >= 26 && a <= 30) return "26-30";
  if (a >= 31 && a <= 35) return "31-35";
  if (a >= 36 && a <= 40) return "36-40";
  if (a >= 41 && a <= 45) return "41-45";
  if (a >= 46 && a <= 50) return "46-50";
  if (a >= 51 && a <= 55) return "51-55";
  if (a >= 56 && a <= 60) return "56-60";
  if (a >= 61) return "61+";

  return null;
}


function filter() {
  const age = document.getElementById("age").value;
  const profession = document.getElementById("profession").value;
  const gender = document.getElementById("gender").value;

  const filtered = records.filter(function(r) {
    return (
      (age === "all" || ageGroup(r.age) === age) &&
      (profession === "all" || r.profession === profession) &&
      (gender === "all" || r.gender === gender)
    );
  });

  const results = document.getElementById("results");

  if (!filtered.length) {
    results.innerHTML = "<p>No records found.</p>";
    return;
  }

  results.innerHTML = filtered.map(function(r) {
    return `
      <div class="card">
        <h3>${escapeHTML(r.name)}</h3>
        <p>Age: ${escapeHTML(r.age)}</p>
        <p>Profession: ${escapeHTML(r.profession)}</p>
        <p>Gender: ${escapeHTML(r.gender)}</p>
      </div>
    `;
  }).join("");
}


function escapeHTML(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


// Run when page loads
init();
