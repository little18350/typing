const socket = io();
const input = document.getElementById("input");
const wordContainer = document.getElementById("wordContainer");
const playersDiv = document.getElementById("players");

// สุ่มประโยค
const sentence = "the quick brown fox jumps over the lazy dog";
wordContainer.textContent = sentence;

let progress = 0;

// เมื่อพิมพ์
input.addEventListener("input", () => {
  const typed = input.value;
  const correct = sentence.substring(0, typed.length);

  // ถ้าพิมพ์ถูก
  if (typed === correct) {
    progress = Math.floor((typed.length / sentence.length) * 100);
    socket.emit("progress", progress);
  } else {
    input.style.background = "#ffdddd";
  }

  if (typed === sentence) {
    alert("🎉 คุณพิมพ์ครบแล้ว!");
  }
});

// อัปเดตผู้เล่นทุกคนแบบเรียลไทม์
socket.on("updatePlayers", (players) => {
  playersDiv.innerHTML = "";
  for (const id in players) {
    const player = players[id];
    const div = document.createElement("div");
    div.textContent = `${player.name}: ${player.progress}%`;
    div.style.background = `linear-gradient(to right, #4caf50 ${player.progress}%, #fff ${player.progress}%)`;
    playersDiv.appendChild(div);
  }
});
