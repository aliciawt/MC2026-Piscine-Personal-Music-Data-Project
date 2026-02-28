import { getUserIDs, getSong, getListenEvents } from "./data.mjs";

// grabbing DOM elements
const userDropdown = document.getElementById("user-dropdown");
const mostListenedSongByNumber = document.getElementById("most-listened-song")
const mostListenedArtistByNumber = document.getElementById("most-listened-artist")
const mostListenedSongByNumberFriday = document.getElementById("most-listened-song-Friday")
const mostListenedSongByLength = document.getElementById("most-listened-song-v2")
const mostListenedArtistByLength = document.getElementById("most-listened-length-v2")
const mostListenedSongByLengthFriday = document.getElementById("most-listened-song-Friday-v2")
const mostListenedSongInARow = document.getElementById("most-times-in-a-row")
const songListenedToEveryday = document.getElementById("listen-everyday")
const top3Genres = document.getElementById("top-3-genres")

// populating user dropdown

// placeholder
const placeholder = document.createElement("option");
placeholder.value = "";
placeholder.textContent = "Select user...";
placeholder.selected = true;
placeholder.disabled = true;
userDropdown.appendChild(placeholder);

// real users
const userIDs = getUserIDs();
userIDs.forEach(id => {
  const option = document.createElement("option");
  option.value = id;
  option.textContent = `User ${id}`;

  userDropdown.appendChild(option);
});

// detect selected user & event listener for dropdown
let activeUser = userDropdown.value;

userDropdown.addEventListener("change", (e) => {
  activeUser = e.target.value;
  countSongTimes();
  countArtistTimes();
  countSongTimesFridayNight();
})

// function to count NUMBER of songs
function countSongTimes () {
  const listenEvents = getListenEvents(activeUser);
  let count = {};
  listenEvents.forEach(event => {
    const songID = event.song_id;
    count[songID] = (count[songID] || 0) + 1;
  })

  console.log(count);

  let maxCount = 0;
  let topSong = null;

  for (let id in count) {
    if (count[id] > maxCount) {
      maxCount = count[id];
      topSong = id;
    }
  }

  if (topSong !== null) {
    mostListenedSongByNumber.innerHTML =
    `The song you listened to the most is <strong>${topSong}</strong>.`;
  } else {
    mostListenedSongByNumber.innerHTML =
    "You don't have a top song.";
  }
}

// function to count NUMBER of artist
function countArtistTimes () {
  const listenEvents = getListenEvents(activeUser);
  let count = {};
  listenEvents.forEach(event => {
    const songID = event.song_id;
    const artist = getSong(songID).artist;
    count[artist] = (count[artist] || 0) + 1; 
  })

  console.log(count);

  let maxCount = 0;
  let topArtist = null;

  for (let id in count) {
    if (count[id] > maxCount) {
      maxCount = count[id];
      topArtist = id;
    }
  }
  
  if (topArtist !== null) {
    mostListenedArtistByNumber.innerHTML =
    `The artist you listened to the most is <strong>${topArtist}</strong>.`;
  } else {mostListenedArtistByNumber.innerHTML = 
    "You don't have a top artist.";
  }
}

// function to count NUMBER of song on Friday night
function countSongTimesFridayNight () {
  const listenEvents = getListenEvents(activeUser);
  let count = {};
  listenEvents.forEach(event => {
    const songID = event.song_id;
    const time = event.timestamp;
    const date = new Date(time);
    const hour = date.getHours();
    const dayName = date.toString().slice(0,3);
    if (dayName === "Fri" && hour >= 17 || dayName === "Sat" && hour < 4) {
      count[songID] = (count[songID] || 0) + 1;
    };
  })

  console.log(count);

  let maxCount = 0;
  let topSongFriday = null;

  for (let id in count) {
    if (count[id] > maxCount) {
      maxCount = count[id];
      topSongFriday = id;
    }
  }
  
  if (topSongFriday !== null) {
    mostListenedSongByNumberFriday.innerHTML =
    `The song you listened to the most is on Friday nights (between 5pm and 4am) <strong>${topSongFriday}</strong>.`;
  } else {
    mostListenedSongByNumberFriday.innerHTML = 
    "You don't listen to any songs on Friday nights (between 5pm and 4am).";
  }
}

// can the functions be combined somehow...? don't forget to add the friday
// will it be efficient because they are supposed to be inputted in 2 different lines anyway? --> store values in different variables
// edge test for null (no songs listened to in case of user 4) --> return 'you   have no listening history'
// make date, hour, day name global?
// attach results to DOM
// you dont have a top song/top artist? technically incorrect, should do 'no listening history' instead on user 4