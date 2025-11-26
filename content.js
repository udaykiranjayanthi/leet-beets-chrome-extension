let userSubmitted = false;
let submitBtn = null;

document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key === "Enter") {
    userSubmitted = true;
  }
});

const observer = new MutationObserver((mutations) => {
  // add event listner to button
  if (!submitBtn) {
    submitBtn = document.querySelector(
      "[data-e2e-locator='console-submit-button']"
    );
    submitBtn.addEventListener("click", () => {
      userSubmitted = true;
    });
  }

  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const child =
          node.querySelector &&
          node.querySelector("[data-e2e-locator='submission-result']");

        if (child && child.textContent.includes("Accepted") && userSubmitted) {
          showOverlay();
        }
      }
    }
  }
});

observer.observe(document.body, {
  childList: true,
  attributes: true,
  subtree: true,
});

function randomImage() {
  const randomNum = Math.ceil(Math.random() * 12);
  const imgUrl = chrome.runtime.getURL(`assets/images/${randomNum}.png`);

  const container = document.createElement("div");
  container.classList.add("imageContainer");

  const image = document.createElement("img");
  image.src = imgUrl;
  image.classList.add("image");

  container.appendChild(image);
  container.appendChild(getTestCaseReport());

  return container;
}

function playAudio() {
  const files = [
    { name: "1.mp3", duration: 5 },
    { name: "2.mp3", duration: 7 },
    { name: "3.mp3", duration: 7 },
    { name: "4.mp3", duration: 8 },
    { name: "5.mp3", duration: 9 },
    { name: "6.mp3", duration: 10 },
    { name: "7.mp3", duration: 11 },
  ];
  const { name, duration } = files[Math.floor(Math.random() * files.length)];
  const audioUrl = chrome.runtime.getURL(`assets/audio/${name}`);

  const audio = new Audio(audioUrl);
  audio.volume = 0.8;
  audio.loop = true;
  audio.play();

  return { audio, duration };
}

function getTestCaseReport() {
  const acceptedSpan = document.querySelector(
    "[data-e2e-locator='submission-result']"
  );

  const testcasesSpan = acceptedSpan.nextElementSibling.querySelector("span");

  const div = document.createElement("div");
  div.classList.add("testcase-report");

  if (testcasesSpan) {
    div.textContent = testcasesSpan.textContent.trim();
  } else {
    console.log("⚠️ Testcases span not found");
  }

  return div;
}

function showOverlay() {
  const overlay = document.createElement("div");
  overlay.classList.add("leetcode-extension-overlay");

  const image = randomImage();
  overlay.appendChild(image);

  const { audio, duration } = playAudio();

  document.body.appendChild(overlay);

  overlay.onclick = () => {
    document.body.removeChild(overlay);
    audio.pause();
    audio.remove();
  };

  setTimeout(() => {
    if (document.body.contains(overlay)) {
      document.body.removeChild(overlay);
      audio.pause();
      audio.remove();
    }
  }, duration * 1000);
}
