
function playAudio() {
  const audio = document.getElementById('audio');
  const subtitle = document.getElementById('subtitle');
  if (audio.paused) {
    audio.play();
    subtitle.innerText = "Đang phát thuyết minh...";
  } else {
    audio.pause();
    subtitle.innerText = "Tạm dừng.";
  }
}
