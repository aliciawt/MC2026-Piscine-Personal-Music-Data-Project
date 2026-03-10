import { getUserIDs, getSong, getListenEvents } from "./data.mjs";

// grabbing DOM elements
const userDropdown = document.getElementById("user-dropdown");
const mostListenedSongByNumber = document.getElementById("most-listened-song")
const mostListenedArtistByNumber = document.getElementById("most-listened-artist")
const mostListenedSongByNumberFriday = document.getElementById("most-listened-song-Friday")
const mostListenedSongByLength = document.getElementById("most-listened-song-v2")
const mostListenedArtistByLength = document.getElementById("most-listened-artist-v2")
const mostListenedSongByLengthFriday = document.getElementById("most-listened-song-Friday-v2")
const mostListenedSongInARow = document.getElementById("most-times-in-a-row")
const songListenedToEveryday = document.getElementById("listen-everyday")
const top3Genres = document.getElementById("top-3-genres")

// placeholder
const placeholder = document.createElement("option");
placeholder.value = "";
placeholder.textContent = "Select user...";
placeholder.selected = true;
placeholder.disabled = true;
userDropdown.appendChild(placeholder);

// populating user dropdown
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
  console.clear();
  countSongTimes();
  countArtistTimes();
  countSongTimesFridayNight();
  topSongStreaks();
  listenEveryday();
})

const listenEvents = getListenEvents(activeUser);

// function to determine top song by times & length listened
function countSongTimes () {
  const listenEvents = getListenEvents(activeUser);
  let count = {};
  let duration = {};
  listenEvents.forEach(event => {
    const songID = event.song_id;
    const songDuration = getSong(songID).duration_seconds;
    count[songID] = (count[songID] || 0) + 1;
    duration[songID] = count[songID] * songDuration;
  })

  console.log(count);
  console.log(duration);

  let maxCountTimes = 0;
  let maxCountDuration = 0;
  let maxCountDurationMinutes = 0;
  let topSongTimes = null;
  let topSongDuration = null;

  for (let id in count) {
    if (count[id] > maxCountTimes) {
      maxCountTimes = count[id];
      topSongTimes = id;
    }
  }

  for (let id in duration) {
    if (duration[id] > maxCountDuration) {
      maxCountDuration = duration[id];
      topSongDuration = id;
    }
  }

  maxCountDurationMinutes = Math.floor(maxCountDuration / 60);

  if (topSongTimes !== null) {
    mostListenedSongByNumber.innerHTML =
    `The song you listened to the most is <strong>${topSongTimes}</strong>. 
    You listened to this song <strong>${maxCountTimes} times</strong>.`;
  } else {
    mostListenedSongByNumber.innerHTML =
    "No data available to display your top song.";
  }

  if (topSongDuration !== null) {
    mostListenedSongByLength.innerHTML =
    `The song you listened to the longest is <strong>${topSongDuration}</strong>. 
    You listened to this song for <strong>more than ${maxCountDurationMinutes} minutes</strong>!
    Are you not sick of it?`;
  } else {
    mostListenedSongByLength.innerHTML =
    "No data available to display your top song.";
  }
}

// function to determine top artist by times & length listened
function countArtistTimes () {
  const listenEvents = getListenEvents(activeUser);
  let count = {};
  let duration = {};
  listenEvents.forEach(event => {
    const songID = event.song_id;
    const songDuration = getSong(songID).duration_seconds;
    const artist = getSong(songID).artist;
    count[artist] = (count[artist] || 0) + 1; 
    duration[artist] = (count[artist]) * songDuration;
  })

  console.log(count);
  console.log(duration);

  let maxCountTimes = 0;
  let maxCountDuration = 0;
  let maxCountDurationMinutes = 0;
  let topArtistTimes = null;
  let topArtistDuration = null;

  for (let id in count) {
    if (count[id] > maxCountTimes) {
      maxCountTimes = count[id];
      topArtistTimes = id;
    }
  }

  for (let id in duration) {
    if (duration[id] > maxCountDuration) {
      maxCountDuration = duration[id];
      topArtistDuration = id;
    }
  }

  maxCountDurationMinutes = Math.floor(maxCountDuration / 60);
  
  if (topArtistTimes !== null) {
    mostListenedArtistByNumber.innerHTML =
    `The artist you listened to the most is <strong>${topArtistTimes}</strong>. 
    You listened to this artist <strong>${maxCountTimes} times</strong>.`;
  } else {mostListenedArtistByNumber.innerHTML = 
    "No data available to display your top artist.";
  }

  if (topArtistDuration !== null) {
    mostListenedArtistByLength.innerHTML =
    `The artist you listened to the longest is <strong>${topArtistDuration}</strong>. 
    You listened to this artist for <strong>more than ${maxCountDurationMinutes} minutes</strong>!
    Obsessed much?`;
  } else {
    mostListenedArtistByLength.innerHTML =
    "No data available to display your top artist.";
  }
}

// function to determine top song on Friday night by times & length listened
function countSongTimesFridayNight () {
  const listenEvents = getListenEvents(activeUser);
  let count = {};
  let duration = {};
  listenEvents.forEach(event => {
    const songID = event.song_id;
    const time = event.timestamp;
    const date = new Date(time);
    const hour = date.getHours();
    const dayName = date.toString().slice(0,3);
    if (dayName === "Fri" && hour >= 17 || dayName === "Sat" && hour < 4) {
      const songDuration = getSong(songID).duration_seconds;
      count[songID] = (count[songID] || 0) + 1;
      duration[songID] = count[songID] * songDuration;
    };
  })

  console.log(count);
  console.log(duration);

  let maxCountTimes = 0;
  let maxCountDuration = 0;
  let maxCountDurationMinutes = 0;
  let topSongTimesFriday = null;
  let topSongDurationFriday = null;

  for (let id in count) {
    if (count[id] > maxCountTimes) {
      maxCountTimes = count[id];
      topSongTimesFriday = id;
    }
  }

  for (let id in duration) {
    if (duration[id] > maxCountDuration) {
      maxCountDuration = duration[id];
      topSongDurationFriday = id;
    }
  }

  maxCountDurationMinutes = Math.floor(maxCountDuration / 60);
  
  if (topSongTimesFriday !== null) {
    mostListenedSongByNumberFriday.innerHTML =
    `The song you listened to the most on Friday nights (between 5pm and 4am) is <strong>${topSongTimesFriday}</strong>.
    You listened to this song for <strong>${maxCountTimes} times</strong>.
    You okay baby?`;
  } else {
    mostListenedSongByNumberFriday.innerHTML = 
    "No data available to display your top song on Friday nights (between 5pm and 4am).";
  }

  if (topSongDurationFriday !== null) {
    mostListenedSongByLengthFriday.innerHTML =
    `The song you listened to the most on Friday nights (between 5pm and 4am) is <strong>${topSongDurationFriday}</strong>.
    You listened to this song for more than <strong>${maxCountDurationMinutes} minutes</strong>!
    You okay baby?`;
  } else {
    mostListenedSongByLengthFriday.innerHTML = 
    "No data available to display your top song on Friday nights (between 5pm and 4am).";
  }
}

// function to determine top song by consecutive listens
function topSongStreaks() {
  const listenEvents = getListenEvents(activeUser);
  let count = {};
  let currentSong = null;
  let currentStreak = 0;

  listenEvents.forEach(event => {
    const songID = event.song_id;

    if (songID === currentSong) {
      currentStreak++;
    } else {
      if (currentSong !== null) {
        count[currentSong] = Math.max(
          count[currentSong] || 0,
          currentStreak
        );
      }

      // reset streak
      currentSong = songID;
      currentStreak = 1;
    }
  });

  // handle last streak
  if (currentSong !== null) {
    count[currentSong] = Math.max(
      count[currentSong] || 0,
      currentStreak
    );
  }

  console.log(count);
  
  // finding longest streak
  let maxCountStreak = 0;
  let topSongStreak = null;

  for (let id in count) {
    if (count[id] > maxCountStreak) {
      maxCountStreak = count[id];
      topSongStreak = id;
    }
  }

  if (topSongStreak !== null) {
    mostListenedSongInARow.innerHTML =
    `The song you listened to the most in succession is <strong>${topSongStreak}</strong>. 
    You listened to this song for <strong>${maxCountStreak} times</strong> in a row.`;
  } else {
    mostListenedSongInARow.innerHTML =
    "No data available to display your top song listened in succession.";
  }

}

// function to determine song user listened to everyday
function listenEveryday () {
  const listenEvents = getListenEvents(activeUser);
  
  // collect unique days user listened to music
  const allDays = new Set();
  const allDaysCount = allDays.size;
  const songDays = {};

  listenEvents.forEach(event => {
    const day = new Date (event.timestamp).toISOString().slice(0,10);
    allDays.add(day);

     if (!songDays[event.song_id]) {
        songDays[event.song_id] = new Set();
    }

    songDays[event.song_id].add(day);
  })

  console.log(allDays);
  console.log(songDays);

  const songEveryday = Object.entries(songDays).filter(([song, set]) => set.size === allDaysCount).map(([song, set]) => song);

  console.log(songEveryday);

  if (songEveryday.length !== 0) {
    songListenedToEveryday.innerHTML = 
    `The song you listened to everyday <strong>${songEveryday}</strong>.`;
  }

}

// refactor
// will it be efficient because they are supposed to be inputted in 2 different lines anyway? --> store values in different variables
// edge test for null (no songs listened to in case of user 4) --> return 'you have no listening history'
// make date, hour, day name global?
// separate functions: grab object data, determining top, and attaching to DOM?