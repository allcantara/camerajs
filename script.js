function start() {
  navigator.mediaDevices
    .getUserMedia({
      audio: true,
      video: {
        width: 300
      }
    })
    .then((stream) => {
      init.Video(stream);
      init.Audio(stream);
    })
    .catch(console.error);
}

const init = {
  Video(stream) {
    const { video } = getElements();
    video.srcObject = stream;
  },

  Audio(stream) {
    let mediaRecorder = null;
    const { audio: divAudio } = getElements();
    mediaRecorder = new MediaRecorder(stream);
    let chunks = [];
    mediaRecorder.ondataavailable = ({ data }) => {
      chunks.push(data);
    };
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: "audio/ogg; code=opus" });
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const audio = document.createElement("audio");
        audio.src = reader.result;
        audio.controls = true;
        if (divAudio.childNodes > 0) {
          divAudio.childNodes[0] = audio;
        } else divAudio.append(audio);
      };
    };
    // mediaRecorder.start();
    const button = document.querySelector("#btn-gravar");
    button.addEventListener("click", () => {
      if (button.textContent === "Gravar Audio") {
        mediaRecorder.start();
        button.textContent = "Parar gravação";
      } else {
        mediaRecorder.stop();
        button.textContent = "Gravar Audio";
      }
    });
  },
};

function createImage() {
  let { video, canvas, image } = getElements();
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext("2d").drawImage(video, 0, 0);
  // image.src = canvas.toDataURL("image/png");
}

function getElements() {
  const video = document.querySelector("#video");
  const canvas = document.querySelector("#canvas");
  const image = document.querySelector("#image");
  const audio = document.querySelector("#audio");
  return { video, canvas, image, audio };
}

window.addEventListener("DOMContentLoaded", start);
