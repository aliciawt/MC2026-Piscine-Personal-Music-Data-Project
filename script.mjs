import { getUserIDs, getSong, getListenEvents } from "./data.mjs";

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

  const songInfo = getAllInfo();

  if (songInfo.length === 0) {
    noData.innerHTML = "You didn't listen to any songs!";
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

// get all listening info
function getAllInfo () {
  
  const listenEvents = getListenEvents(activeUser);
  const songInfo = [];

  listenEvents.forEach(event => {
    const songID = event.song_id;
    const day = new Date(event.timestamp).toString().slice(0,3);
    const date = new Date(event.timestamp).toISOString().slice(0,10);
    const hour = new Date(event.timestamp).getHours();
    const songArtist = getSong(songID).artist;
    const songDuration = getSong(songID).duration_seconds;
    const songGenre = getSong(songID).genre;

    songInfo.push({
      songID,
      day,
      date,
      hour,
      artist: songArtist,
      duration: songDuration,
      genre: songGenre
    });
  });

  return songInfo;
}

// determine top song
function getTopSong(songInfo) {

  const countNumberOfListens = {};
  const countListeningTime = {};

  let maxTimes = 0;
  let maxLength = 0;

  const topSong = {};

  songInfo.forEach(song => {
    countNumberOfListens[song.songID] =
      (countNumberOfListens[song.songID] || 0) + 1;

    countListeningTime[song.songID] =
      (countListeningTime[song.songID] || 0) + song.duration;

    const times = countNumberOfListens[song.songID];
    const length = countListeningTime[song.songID];

    if (times > maxTimes) {
      maxTimes = times;
      topSong.byNumberOfListens = song.songID;
    }

    if (length > maxLength) {
      maxLength = length;
      topSong.byListeningTime = song.songID;
    }

  });

  console.log(`TOP SONG ${JSON.stringify(topSong)}`);
  return topSong;
}

// determine top artist
function getTopArtist(songInfo) {

  const countNumberOfListens = {};
  const countListeningTime = {};

  let maxTimes = 0;
  let maxLength = 0;

  const topArtist = {};

  songInfo.forEach(song => {
    countNumberOfListens[song.artist] =
      (countNumberOfListens[song.artist] || 0) + 1;

    countListeningTime[song.artist] =
      (countListeningTime[song.artist] || 0) + song.duration;

    const times = countNumberOfListens[song.artist];
    const length = countListeningTime[song.artist];

    if (times > maxTimes) {
      maxTimes = times;
      topArtist.byNumberOfListens = song.artist;
    }

    if (length > maxLength) {
      maxLength = length;
      topArtist.byListeningTime = song.artist;
    }

  });

  console.log(`TOP ARTIST ${JSON.stringify(topArtist)}`);
  return topArtist;
}

// friday night stats
function fridayNightStats (songInfo) {
  
  const fridayNightSongs = songInfo.filter(song => 
    (song.day === "Fri" && song.hour >= 17) || 
    (song.day === "Sat" && song.hour < 4)
  );

  const topSongFriday = getTopSong(fridayNightSongs);
  console.log(`TOP SONG FRIDAY NIGHT ${JSON.stringify(topSongFriday)}`);

  return { topSongFriday };
}

// get top streak

function getTopStreak(songInfo) {

  let topSong = null;
  let maxStreak = 0;
  let currentSong = null;
  let currentStreak = 0;

  songInfo.forEach(song => {
    if (song.songID === currentSong) {
      currentStreak++;
    } else {
      currentSong = song.songID;
      currentStreak = 1;
    }

    if (currentStreak > maxStreak) {
      maxStreak = currentStreak;
      topSong = currentSong;
    }
  });

  return topSong;
}


// get song listened to everyday
function listenEveryday(songInfo) {

  // all unique dates user listened to any song
  const allDays = new Set(songInfo.map(event => event.date));
  console.log(allDays);

  // map each song to a set of dates it was listened to
  const songDays = songInfo.reduce((acc, event) => {
    const songID = event.songID;

    if (!acc[songID]) acc[songID] = new Set();
    acc[songID].add(event.date);

    return acc;
  }, {});

  const totalDays = allDays.size;

  // songs listened to every day
  const songEveryday = Object.entries(songDays)
    .filter(([_, dates]) => dates.size === totalDays)
    .map(([songID]) => songID);

  console.log(songEveryday);
  return songEveryday;
}

// get top genres

function topGenres(songInfo) {

  const count = songInfo.reduce((acc, song) => {
    const genre = song.genre;
    acc[genre] = (acc[genre] || 0) + 1;
    return acc;
  }, {});

  // convert to array and sort by count descending
  const sortedGenres = Object.entries(count)
    .sort((a, b) => b[1] - a[1]);

  const topGenres = sortedGenres.slice(0, 3).map(([genre]) => genre);

  console.log(topGenres);
  return topGenres;
}

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
      `Your top song by number of times played is <strong>${topSong.byNumberOfListens}</strong>.`;

    mostListenedSongByLength.innerHTML =
      `Your top song by listening time is <strong>${topSong.byListeningTime}</strong>.`;
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
      `Your top Friday night song is <strong>${topSongFriday.byNumberOfListens}</strong>.`;

    mostListenedSongByLengthFriday.innerHTML =
      `Your top Friday night song by listening time is <strong>${topSongFriday.byListeningTime}</strong>.`;
  }

  // streak
  if (!topStreak) {
    mostListenedSongInARow.style.display = "none";
  } else {
    mostListenedSongInARow.style.display = "block";

    mostListenedSongInARow.innerHTML =
      `The song you listened to most in a row is <strong>${topStreak}</strong>.`;
  }

  // everyday
  if (songEveryday.length === 0) {
    songListenedToEveryday.style.display = "none";
  } else {
    songListenedToEveryday.style.display = "block";

    songListenedToEveryday.innerHTML =
      `The song you listened to everyday is <strong>${songEveryday.join(", ")}</strong>.`;
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

// handle ties