import { getUserIDs } from "./data.mjs";

// grabbing DOM elements
const userDropdown = document.getElementById("user-dropdown");

// populating user dropdown
const userIDs = getUserIDs();

userIDs.forEach(id => {
  const option = document.createElement("option");
  option.value = id;
  option.textContent = `User ${id}`;

  userDropdown.appendChild(option);
});