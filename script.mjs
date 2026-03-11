import { getUserIDs, getSong } from "./data.mjs";
import { getAllInfo, getTopSong, getTopArtist, fridayNightStats, getTopStreak, listenEveryday, topGenres } from "./common.mjs";

// grabbing DOM elements
const userDropdown = document.getElementById("user-dropdown");
const noData = document.getElementById("no-data")
const mostListenedSongByNumber = document.getElementById("most-listened-song")
const mostListenedArtistByNumber = document.getElementById("most-listened-artist")
const mostListenedSongByNumberFriday = document.getElementById("most-listened-song-Friday")
const mostListenedSongByLength = document.getElementById("most-listened-song-v2")
const mostListenedArtistByLength = document.getElementById("most-listened-artist-v2")
const mostListenedSongByLengthFriday = document.getElementById("most-listened-song-Friday-v2")
const mostListenedSongInARow = document.getElementById("most-times-in-a-row")
const songListenedToEveryday = document.getElementById("listen-everyday")
const topGenresListenedTo = document.getElementById("top-3-genres")

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

  const songInfo = getAllInfo(activeUser);

  if (songInfo.length === 0) {
    noData.innerHTML = "You didn't listen to any songs!";

    mostListenedSongByNumber.style.display = "none";
    mostListenedSongByLength.style.display = "none";
    mostListenedArtistByNumber.style.display = "none";
    mostListenedArtistByLength.style.display = "none";
    mostListenedSongByNumberFriday.style.display = "none";
    mostListenedSongByLengthFriday.style.display = "none";
    mostListenedSongInARow.style.display = "none";
    songListenedToEveryday.style.display = "none";
    topGenresListenedTo.style.display = "none";

    return;
  }

  noData.innerHTML = "";

  const topSong = getTopSong(songInfo);
  const topArtist = getTopArtist(songInfo);
  const { topSongFriday } = fridayNightStats(songInfo);
  const topStreak = getTopStreak(songInfo);
  const songEveryday = listenEveryday(songInfo);
  const topGenresArray = topGenres(songInfo);

  updateDOM({
    topSong,
    topArtist,
    topSongFriday,
    topStreak,
    songEveryday,
    topGenres: topGenresArray
  });
});

// update DOM with results
function updateDOM(results) {
  const {
    topSong,
    topArtist,
    topSongFriday,
    topStreak,
    songEveryday,
    topGenres
  } = results;

  // top song
  if (!topSong.byNumberOfListens) {
    mostListenedSongByNumber.style.display = "none";
    mostListenedSongByLength.style.display = "none";
  } else {
    mostListenedSongByNumber.style.display = "block";
    mostListenedSongByLength.style.display = "block";

    mostListenedSongByNumber.innerHTML =
      `Your top song by number of times played is <strong>${getSong(topSong.byNumberOfListens).title}</strong>.`;

    mostListenedSongByLength.innerHTML =
      `Your top song by listening time is <strong>${getSong(topSong.byListeningTime).title}</strong>.`;
  }

  // top artist
  if (!topArtist.byNumberOfListens) {
    mostListenedArtistByNumber.style.display = "none";
    mostListenedArtistByLength.style.display = "none";
  } else {
    mostListenedArtistByNumber.style.display = "block";
    mostListenedArtistByLength.style.display = "block";

    mostListenedArtistByNumber.innerHTML =
      `Your top artist by number of times played is <strong>${topArtist.byNumberOfListens}</strong>.`;

    mostListenedArtistByLength.innerHTML =
      `Your top artist by listening time is <strong>${topArtist.byListeningTime}</strong>.`;
  }  

  // friday night
  if (!topSongFriday.byNumberOfListens) {
    mostListenedSongByNumberFriday.style.display = "none";
    mostListenedSongByLengthFriday.style.display = "none";
  } else {
    mostListenedSongByNumberFriday.style.display = "block";
    mostListenedSongByLengthFriday.style.display = "block";

    mostListenedSongByNumberFriday.innerHTML =
      `Your top Friday night song by number of times played is <strong>${getSong(topSongFriday.byNumberOfListens).title}</strong>.`;

    mostListenedSongByLengthFriday.innerHTML =
      `Your top Friday night song by listening time is <strong>${getSong(topSongFriday.byListeningTime).title}</strong>.`;
  }

  // streak
  if (!topStreak) {
    mostListenedSongInARow.style.display = "none";
  } else {
    mostListenedSongInARow.style.display = "block";

    mostListenedSongInARow.innerHTML =
      `The song you listened to most in a row is <strong>${getSong(topStreak).title}</strong>.`;
  }

  // everyday
  if (songEveryday.length === 0) {
    songListenedToEveryday.style.display = "none";
  } else {
    songListenedToEveryday.style.display = "block";

    songListenedToEveryday.innerHTML =
      `The song you listened to everyday is <strong>${songEveryday.map(id => getSong(id).title).join(", ")}</strong>.`;
  }

  // top genres
  if (topGenres.length === 0) {
    topGenresListenedTo.style.display = "none";
  } else {
    topGenresListenedTo.style.display = "block";

    let text;
    if (topGenres.length === 1) {
      text = `Your top genre is <strong>${topGenres[0]}</strong>.`;
    } else if (topGenres.length === 2) {
      text = `Your top 2 genres are <strong>${topGenres[0]}</strong> and <strong>${topGenres[1]}</strong>.`;
    } else if (topGenres.length === 3) {
      text = `Your top 3 genres are <strong>${topGenres[0]}</strong>, <strong>${topGenres[1]}</strong>, and <strong>${topGenres[2]}</strong>.`;
    }

    topGenresListenedTo.innerHTML = text;
  }
}