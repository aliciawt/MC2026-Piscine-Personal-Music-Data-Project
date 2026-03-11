import { getSong, getListenEvents } from "./data.mjs";

// get all listening info
export function getAllInfo (activeUser) {
  
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
export function getTopSong(songInfo) {

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

  return topSong;
}

// determine top artist
export function getTopArtist(songInfo) {

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

  return topArtist;
}

// friday night stats
export function fridayNightStats (songInfo) {
  
  const fridayNightSongs = songInfo.filter(song => 
    (song.day === "Fri" && song.hour >= 17) || 
    (song.day === "Sat" && song.hour < 4)
  );

  const topSongFriday = getTopSong(fridayNightSongs);

  return { topSongFriday };
}

// get top streak

export function getTopStreak(songInfo) {

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
export function listenEveryday(songInfo) {

  // all unique dates user listened to any song
  const allDays = new Set(songInfo.map(event => event.date));

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

  return songEveryday;
}

// get top genres

export function topGenres(songInfo) {

  const count = songInfo.reduce((acc, song) => {
    const genre = song.genre;
    acc[genre] = (acc[genre] || 0) + 1;
    return acc;
  }, {});

  // convert to array and sort by count descending
  const sortedGenres = Object.entries(count)
    .sort((a, b) => b[1] - a[1]);

  const topGenres = sortedGenres.slice(0, 3).map(([genre]) => genre);

  return topGenres;
}
