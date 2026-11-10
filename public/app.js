const audio = document.getElementById("audio");
const title = document.getElementById("now-title");
const artist = document.getElementById("now-artist");
const cover = document.getElementById("now-cover");
const demoTracks = [
  { title: "Golden Hour", artist: "Amara Skye", id: "amara", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", style: "linear-gradient(135deg,#f5b18e,#e8df75)" },
  { title: "City Lights", artist: "Jay Nova", id: "jay", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", style: "linear-gradient(135deg,#d3e66e,#83b9aa)" },
  { title: "Slow Motion", artist: "Kezi", id: "kezi", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", style: "linear-gradient(135deg,#c8b8e8,#f1a5b8)" },
  { title: "New Day", artist: "Mira Gold", id: "mira", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3", style: "linear-gradient(135deg,#f0d48a,#f2a77f)" }
];
let activeButton = null;
document.getElementById("year").textContent = new Date().getFullYear();

async function loadLeaderboard() {
  try {
    const response = await fetch("/api/leaderboard");
    if (!response.ok) return;
    const singers = await response.json();
    const root = document.getElementById("leaderboard");
    root.innerHTML = singers.map((singer, index) => {
      const initials = singer.name.split(" ").map(part => part[0]).slice(0, 2).join("").toUpperCase();
      return '<div class="leader-row"><span class="rank">' + String(index + 1).padStart(2, "0") + '</span><span class="avatar avatar-' + ["a","b","c","d"][index % 4] + '">' + initials + '</span><span class="singer"><strong>' + singer.name + '</strong><small>' + singer.genre + ' · ' + singer.location + '</small></span><span class="plays">' + Number(singer.plays).toLocaleString() + ' <small>plays</small></span></div>';
    }).join("");
  } catch (error) {
    console.info("Showing the sample chart while the leaderboard loads.");
  }
}

document.querySelectorAll(".play").forEach(button => {
  button.addEventListener("click", async () => {
    const track = demoTracks[Number(button.dataset.track)];
    if (!track) return;
    if (activeButton === button && !audio.paused) {
      audio.pause();
      button.textContent = "▶";
      button.setAttribute("aria-label", "Play " + track.title);
      return;
    }
    if (activeButton) {
      activeButton.textContent = "▶";
      const oldTrack = demoTracks[Number(activeButton.dataset.track)];
      activeButton.setAttribute("aria-label", "Play " + oldTrack.title);
    }
    activeButton = button;
    audio.src = track.url;
    title.textContent = track.title;
    artist.textContent = track.artist + " · Demo audio";
    cover.style.background = track.style;
    button.textContent = "Ⅱ";
    button.setAttribute("aria-label", "Pause " + track.title);
    try {
      await audio.play();
      fetch("/api/play", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ artist_id: track.id }) }).then(loadLeaderboard).catch(() => {});
    } catch (error) {
      button.textContent = "▶";
      button.setAttribute("aria-label", "Play " + track.title);
      artist.textContent = "Audio preview could not load. Please try again.";
    }
  });
});
audio.addEventListener("ended", () => {
  if (activeButton) {
    const track = demoTracks[Number(activeButton.dataset.track)];
    activeButton.textContent = "▶";
    activeButton.setAttribute("aria-label", "Play " + track.title);
  }
});
audio.addEventListener("pause", () => {
  if (activeButton && audio.currentTime > 0 && !audio.ended) {
    const track = demoTracks[Number(activeButton.dataset.track)];
    activeButton.textContent = "▶";
    activeButton.setAttribute("aria-label", "Play " + track.title);
  }
});
loadLeaderboard();