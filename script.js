const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwMOo6nFBFs5CWF3uPIuxwCbau8PZiPlKHqlv6pNcGoahZykKpx_kOXU_TPlNQyruVA/exec";

let records = [];

async function init() {
  try {
    records = (await fetch(URL).then(r => r.json())).records;

    // Create dropdown options
    ["profession", "gender"].forEach(type => {
      [...new Set(records.map(r => r[type]))]
        .sort()
        .forEach(value => {
          document.getElementById(type).add(new Option(value, value));
        });
    });

    filter();
  } catch (error) {
    document.getElementById("results").textContent = "Error loading data.";
    console.error(error);
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

  const filtered = records.filter(r =>
    (age === "all" || ageGroup(r.age) === age) &&
    (profession === "all" || r.profession === profession) &&
    (gender === "all" || r.gender === gender)
  );

  document.getElementById("results").innerHTML =
    filtered.length
      ? filtered.map(r => `
          <div class="card">
            <h3>${r.name}</h3>
            <p>Age: ${r.age}</p>
            <p>Profession: ${r.profession}</p>
            <p>Gender: ${r.gender}</p>
          </div>
        `).join("")
      : "<p>No records found.</p>";
}

init();
