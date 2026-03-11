import assert from "node:assert";
import { getTopSong, getTopArtist, fridayNightStats, getTopStreak, listenEveryday, topGenres } from "./common.mjs";

// sample data, chronologically sorted Mon–Fri
const songInfo = [
  { songID: "s1", duration: 200, artist: "a1", genre: "pop", day: "Mon", date: "2026-03-01", hour: 10 },
  { songID: "s1", duration: 200, artist: "a1", genre: "pop", day: "Mon", date: "2026-03-01", hour: 11 },
  { songID: "s1", duration: 200, artist: "a1", genre: "pop", day: "Mon", date: "2026-03-01", hour: 12 },
  { songID: "s5", duration: 100, artist: "a5", genre: "electronic", day: "Mon", date: "2026-03-01", hour: 15 },
  { songID: "s2", duration: 500, artist: "a2", genre: "rock", day: "Tue", date: "2026-03-02", hour: 13 },
  { songID: "s1", duration: 200, artist: "a1", genre: "pop", day: "Tue", date: "2026-03-02", hour: 14 },
  { songID: "s5", duration: 100, artist: "a5", genre: "electronic", day: "Tue", date: "2026-03-02", hour: 16 },
  { songID: "s5", duration: 100, artist: "a5", genre: "electronic", day: "Wed", date: "2026-03-03", hour: 17 },
  { songID: "s4", duration: 300, artist: "a4", genre: "rock", day: "Wed", date: "2026-03-03", hour: 18 },
  { songID: "s5", duration: 100, artist: "a5", genre: "electronic", day: "Thu", date: "2026-03-04", hour: 18 },
  { songID: "s5", duration: 100, artist: "a5", genre: "electronic", day: "Fri", date: "2026-03-05", hour: 19 },
  { songID: "s3", duration: 100, artist: "a3", genre: "jazz", day: "Fri", date: "2026-03-05", hour: 20 },
  { songID: "s3", duration: 100, artist: "a3", genre: "jazz", day: "Fri", date: "2026-03-05", hour: 21 },
  { songID: "s2", duration: 500, artist: "a2", genre: "rock", day: "Fri", date: "2026-03-05", hour: 22 }
];

// ----- top song -----
const topSongResult = getTopSong(songInfo);
assert.strictEqual(topSongResult.byNumberOfListens, "s5", "s5 should be top by number of listens");
assert.strictEqual(topSongResult.byListeningTime, "s2", "s2 should be top by listening time");

// ----- top artist -----
const topArtistResult = getTopArtist(songInfo);
assert.strictEqual(topArtistResult.byNumberOfListens, "a5", "a5 should be top artist by listens");
assert.strictEqual(topArtistResult.byListeningTime, "a2", "a2 should be top artist by listening time");

// ----- Friday night stats -----
const { topSongFriday } = fridayNightStats(songInfo);
assert.strictEqual(topSongFriday.byNumberOfListens, "s3", "s3 should be top Friday night song by number");
assert.strictEqual(topSongFriday.byListeningTime, "s2", "s2 should be top Friday night song by listening time");

// ----- streak -----
const topStreak = getTopStreak(songInfo);
assert.strictEqual(topStreak, "s1", "s1 should have the longest consecutive streak");

// ----- songs listened to everyday -----
const songEveryday = listenEveryday(songInfo);
assert.deepStrictEqual(songEveryday, ["s5"], "s5 listened every day");

// ----- top genres -----
const topGenresResult = topGenres(songInfo);
assert.deepStrictEqual(topGenresResult, ["electronic","pop", "rock"], "Top 3 genres should be electronic, pop, rock");

console.log("All tests passed ^_^");