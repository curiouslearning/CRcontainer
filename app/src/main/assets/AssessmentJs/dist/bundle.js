/*! For license information please see bundle.js.LICENSE.txt */
(() => {
  "use strict";
  var e = {};
  function t() {
    var e = n().get("data");
    return (
      null == e &&
        (console.log("default data file"), (e = "zulu-lettersounds")),
      e
    );
  }
  function n() {
    const e = window.location.search;
    return new URLSearchParams(e);
  }
  e.g = (function () {
    if ("object" == typeof globalThis) return globalThis;
    try {
      return this || new Function("return this")();
    } catch (e) {
      if ("object" == typeof window) return window;
    }
  })();
  var i = function (e, t, n, i) {
    return new (n || (n = Promise))(function (s, o) {
      function a(e) {
        try {
          c(i.next(e));
        } catch (e) {
          o(e);
        }
      }
      function r(e) {
        try {
          c(i.throw(e));
        } catch (e) {
          o(e);
        }
      }
      function c(e) {
        var t;
        e.done
          ? s(e.value)
          : ((t = e.value),
            t instanceof n
              ? t
              : new n(function (e) {
                  e(t);
                })).then(a, r);
      }
      c((i = i.apply(e, t || [])).next());
    });
  };
  function s(e) {
    return "./data/" + e + ".json";
  }
  function o(e) {
    return i(this, void 0, void 0, function* () {
      var t = s(e);
      return fetch(t).then((e) => e.json());
    });
  }
  class a {
    constructor() {
      (this.imageToCache = []),
        (this.wavToCache = []),
        (this.allAudios = {}),
        (this.allImages = {}),
        (this.dataURL = ""),
        (this.correctSoundPath = "dist/audio/Correct.wav"),
        (this.feedbackAudio = null),
        (this.correctAudio = null);
    }
    init() {
      (this.feedbackAudio = new Audio()),
        (this.feedbackAudio.src = this.correctSoundPath),
        (this.correctAudio = new Audio());
    }
    static PrepareAudioAndImagesForSurvey(e, t) {
      a.getInstance().dataURL = t;
      const n = "audio/" + a.getInstance().dataURL + "/answer_feedback.mp3";
      for (var i in (a.getInstance().wavToCache.push(n),
      (a.getInstance().correctAudio.src = n),
      e)) {
        let t = e[i];
        for (var s in (null != t.promptAudio &&
          a.FilterAndAddAudioToAllAudios(t.promptAudio.toLowerCase()),
        null != t.promptImg && a.AddImageToAllImages(t.promptImg),
        t.answers)) {
          let e = t.answers[s];
          null != e.answerImg && a.AddImageToAllImages(e.answerImg);
        }
      }
      console.log(a.getInstance().allAudios),
        console.log(a.getInstance().allImages);
    }
    static AddImageToAllImages(e) {
      console.log("Add image: " + e);
      let t = new Image();
      (t.src = e), (a.getInstance().allImages[e] = t);
    }
    static FilterAndAddAudioToAllAudios(e) {
      console.log("Adding audio: " + e),
        e.includes(".wav")
          ? (e = e.replace(".wav", ".mp3"))
          : e.includes(".mp3") || (e = e.trim() + ".mp3"),
        console.log("Filtered: " + e);
      let t = new Audio();
      ["luganda"].includes(a.getInstance().dataURL.split("-")[0]),
        (t.src = "audio/" + a.getInstance().dataURL + "/" + e),
        (a.getInstance().allAudios[e] = t),
        console.log(t.src);
    }
    static PreloadBucket(e, t) {
      for (var n in ((a.getInstance().dataURL = t),
      (a.getInstance().correctAudio.src =
        "audio/" + a.getInstance().dataURL + "/answer_feedback.mp3"),
      e.items)) {
        var i = e.items[n];
        a.FilterAndAddAudioToAllAudios(i.itemName.toLowerCase());
      }
    }
    static PlayAudio(e, t, n) {
      (e = e.toLowerCase()),
        console.log("trying to play " + e),
        e.includes(".mp3")
          ? ".mp3" != e.slice(-4) && (e = e.trim() + ".mp3")
          : (e = e.trim() + ".mp3"),
        console.log("Pre play all audios: "),
        console.log(a.getInstance().allAudios),
        new Promise((t, i) => {
          const s = a.getInstance().allAudios[e];
          s
            ? (s.addEventListener("play", () => {
                void 0 !== n && n(!0);
              }),
              s.addEventListener("ended", () => {
                void 0 !== n && n(!1), t();
              }),
              s.play().catch((e) => {
                console.error("Error playing audio:", e), t();
              }))
            : (console.warn("Audio file not found:", e), t());
        })
          .then(() => {
            void 0 !== t && t();
          })
          .catch((e) => {
            console.error("Promise error:", e);
          });
    }
    static GetImage(e) {
      return a.getInstance().allImages[e];
    }
    static PlayDing() {
      a.getInstance().feedbackAudio.play();
    }
    static PlayCorrect() {
      a.getInstance().correctAudio.play();
    }
    static getInstance() {
      return (
        null == a.instance && ((a.instance = new a()), a.instance.init()),
        a.instance
      );
    }
  }
  function r(e) {
    return e[Math.floor(Math.random() * e.length)];
  }
  function c(e) {
    for (let t = e.length - 1; t > 0; t--) {
      const n = Math.floor(Math.random() * (t + 1));
      [e[t], e[n]] = [e[n], e[t]];
    }
  }
  a.instance = null;
  class l {
    constructor() {
      (this.landingContainerId = "landWrap"),
        (this.gameContainerId = "gameWrap"),
        (this.endContainerId = "endWrap"),
        (this.starContainerId = "starWrapper"),
        (this.chestContainerId = "chestWrapper"),
        (this.questionsContainerId = "qWrap"),
        (this.feedbackContainerId = "feedbackWrap"),
        (this.answersContainerId = "aWrap"),
        (this.answerButton1Id = "answerButton1"),
        (this.answerButton2Id = "answerButton2"),
        (this.answerButton3Id = "answerButton3"),
        (this.answerButton4Id = "answerButton4"),
        (this.answerButton5Id = "answerButton5"),
        (this.answerButton6Id = "answerButton6"),
        (this.playButtonId = "pbutton"),
        (this.chestImgId = "chestImage"),
        (this.nextQuestion = null),
        (this.contentLoaded = !1),
        (this.shown = !1),
        (this.stars = []),
        (this.shownStarsCount = 0),
        (this.starPositions = Array()),
        (this.qAnsNum = 0),
        (this.buttons = []),
        (this.buttonsActive = !1),
        (this.devModeCorrectLabelVisibility = !1),
        (this.devModeBucketControlsEnabled = !1),
        (this.animationSpeedMultiplier = 1);
    }
    init() {
      (this.landingContainer = document.getElementById(
        this.landingContainerId
      )),
        (this.gameContainer = document.getElementById(this.gameContainerId)),
        (this.endContainer = document.getElementById(this.endContainerId)),
        (this.starContainer = document.getElementById(this.starContainerId)),
        (this.chestContainer = document.getElementById(this.chestContainerId)),
        (this.questionsContainer = document.getElementById(
          this.questionsContainerId
        )),
        (this.feedbackContainer = document.getElementById(
          this.feedbackContainerId
        )),
        (this.answersContainer = document.getElementById(
          this.answersContainerId
        )),
        (this.answerButton1 = document.getElementById(this.answerButton1Id)),
        (this.answerButton2 = document.getElementById(this.answerButton2Id)),
        (this.answerButton3 = document.getElementById(this.answerButton3Id)),
        (this.answerButton4 = document.getElementById(this.answerButton4Id)),
        (this.answerButton5 = document.getElementById(this.answerButton5Id)),
        (this.answerButton6 = document.getElementById(this.answerButton6Id)),
        (this.playButton = document.getElementById(this.playButtonId)),
        (this.chestImg = document.getElementById(this.chestImgId)),
        this.initializeStars(),
        this.initEventListeners();
    }
    initializeStars() {
      for (let e = 0; e < 20; e++) {
        const t = document.createElement("img");
        (t.id = "star" + e),
          t.classList.add("topstarv"),
          this.starContainer.appendChild(t),
          (this.starContainer.innerHTML += ""),
          9 == e && (this.starContainer.innerHTML += "<br>"),
          this.stars.push(e);
      }
      c(this.stars);
    }
    SetAnimationSpeedMultiplier(e) {
      l.getInstance().animationSpeedMultiplier = e;
    }
    SetCorrectLabelVisibility(e) {
      (this.devModeCorrectLabelVisibility = e),
        console.log(
          "Correct label visibility set to ",
          this.devModeCorrectLabelVisibility
        );
    }
    SetBucketControlsVisibility(e) {
      console.log("Bucket controls visibility set to ", e),
        (this.devModeBucketControlsEnabled = e);
    }
    static OverlappingOtherStars(e, t, n, i) {
      if (e.length < 1) return !1;
      for (let s = 0; s < e.length; s++) {
        const o = e[s].x - t,
          a = e[s].y - n;
        if (Math.sqrt(o * o + a * a) < i) return !0;
      }
      return !1;
    }
    initEventListeners() {
      this.answerButton1.addEventListener("click", () => {
        this.answerButtonPress(1);
      }),
        this.buttons.push(this.answerButton1),
        this.answerButton2.addEventListener("click", () => {
          this.answerButtonPress(2);
        }),
        this.buttons.push(this.answerButton2),
        this.answerButton3.addEventListener("click", () => {
          this.answerButtonPress(3);
        }),
        this.buttons.push(this.answerButton3),
        this.answerButton4.addEventListener("click", () => {
          this.answerButtonPress(4);
        }),
        this.buttons.push(this.answerButton4),
        this.answerButton5.addEventListener("click", () => {
          this.answerButtonPress(5);
        }),
        this.buttons.push(this.answerButton5),
        this.answerButton6.addEventListener("click", () => {
          this.answerButtonPress(6);
        }),
        this.buttons.push(this.answerButton6),
        this.landingContainer.addEventListener("click", () => {
          console.log(
            ">>>>>>>>>>>>>>>>",
            localStorage.getItem(t()),
            ">>>>>>>",
            l.getInstance().contentLoaded
          ),
            l.getInstance().contentLoaded && this.showGame();
        });
    }
    showOptions() {
      if (!l.getInstance().shown) {
        const e = l.getInstance().nextQuestion,
          t = l.getInstance().buttons,
          n = l.getInstance().animationSpeedMultiplier;
        let i = 220 * n;
        const s = 150 * n;
        l.getInstance().shown = !0;
        let o = 0;
        t.forEach((e) => {
          (e.style.visibility = "hidden"),
            (e.style.animation = ""),
            (e.innerHTML = "");
        }),
          setTimeout(() => {
            for (let s = 0; s < e.answers.length; s++) {
              const r = e.answers[s],
                c = t[s],
                u = r.answerName === e.correct;
              if (
                ((c.innerHTML = "answerText" in r ? r.answerText : ""),
                u && l.getInstance().devModeCorrectLabelVisibility)
              ) {
                const e = document.createElement("div");
                e.classList.add("correct-label"),
                  (e.innerHTML = "Correct"),
                  c.appendChild(e);
              }
              (c.style.visibility = "hidden"),
                (c.style.boxShadow = "0px 0px 0px 0px rgba(0,0,0,0)"),
                setTimeout(() => {
                  if (
                    ((c.style.visibility = "visible"),
                    (c.style.boxShadow = "0px 6px 8px #606060"),
                    (c.style.animation = `zoomIn ${i * n}ms ease forwards`),
                    "answerImg" in r)
                  ) {
                    const e = a.GetImage(r.answerImg);
                    c.appendChild(e);
                  }
                  c.addEventListener("animationend", () => {
                    o++,
                      o === e.answers.length &&
                        l.getInstance().enableAnswerButton();
                  });
                }, s * i * n * 0.3);
            }
          }, s),
          (l.getInstance().qStart = Date.now());
      }
    }
    enableAnswerButton() {
      l.getInstance().buttonsActive = !0;
    }
    static SetFeedbackText(e) {
      console.log("Feedback text set to " + e),
        (l.getInstance().feedbackContainer.innerHTML = e);
    }
    showLanding() {
      (this.landingContainer.style.display = "flex"),
        (this.gameContainer.style.display = "none"),
        (this.endContainer.style.display = "none");
    }
    static ShowEnd() {
      (l.getInstance().landingContainer.style.display = "none"),
        (l.getInstance().gameContainer.style.display = "none"),
        (l.getInstance().endContainer.style.display = "flex");
    }
    showGame() {
      (this.landingContainer.style.display = "none"),
        (this.gameContainer.style.display = "grid"),
        (this.endContainer.style.display = "none"),
        (this.allStart = Date.now()),
        this.startPressCallback();
    }
    static SetFeedbackVisibile(e, t) {
      e
        ? (l.getInstance().feedbackContainer.classList.remove("hidden"),
          l.getInstance().feedbackContainer.classList.add("visible"),
          (l.getInstance().buttonsActive = !1),
          t
            ? ((l.getInstance().feedbackContainer.style.color =
                "rgb(109, 204, 122)"),
              a.PlayCorrect())
            : (l.getInstance().feedbackContainer.style.color = "red"))
        : (l.getInstance().feedbackContainer.classList.remove("visible"),
          l.getInstance().feedbackContainer.classList.add("hidden"),
          (l.getInstance().buttonsActive = !1));
    }
    static ReadyForNext(e, t = !0) {
      if (null !== e) {
        for (var n in (console.log("ready for next!"),
        (l.getInstance().answersContainer.style.visibility = "hidden"),
        l.getInstance().buttons))
          l.getInstance().buttons[n].style.visibility = "hidden";
        (l.getInstance().shown = !1),
          (l.getInstance().nextQuestion = e),
          (l.getInstance().questionsContainer.innerHTML = ""),
          (l.getInstance().questionsContainer.style.display = "none"),
          l.getInstance().devModeBucketControlsEnabled
            ? l
                .getInstance()
                .externalBucketControlsGenerationHandler(
                  l.getInstance().playButton,
                  () => {
                    console.log(
                      "Call from inside click handler of external bucket controls"
                    ),
                      l.ShowQuestion(),
                      a.PlayAudio(
                        e.promptAudio,
                        l.getInstance().showOptions,
                        l.ShowAudioAnimation
                      );
                  }
                )
            : ((l.getInstance().playButton.innerHTML =
                "<button id='nextqButton'><img class=audio-button width='100px' height='100px' src='./img/SoundButton_Idle.png' type='image/svg+xml'> </img></button>"),
              document
                .getElementById("nextqButton")
                .addEventListener("click", function () {
                  l.ShowQuestion(),
                    a.PlayAudio(
                      e.promptAudio,
                      l.getInstance().showOptions,
                      l.ShowAudioAnimation
                    );
                }));
      }
    }
    static ShowAudioAnimation(e = !1) {
      if (!l.getInstance().devModeBucketControlsEnabled) {
        l.getInstance().playButton.querySelector("img").src = e
          ? "./animation/SoundButton.gif"
          : "./img/SoundButton_Idle.png";
      }
    }
    static ShowQuestion(e) {
      l.getInstance().devModeBucketControlsEnabled
        ? l
            .getInstance()
            .externalBucketControlsGenerationHandler(
              l.getInstance().playButton,
              () => {
                console.log(
                  "Call from inside click handler of external bucket controls #2"
                ),
                  console.log("next question button pressed"),
                  console.log(e.promptAudio),
                  "promptAudio" in e &&
                    a.PlayAudio(e.promptAudio, void 0, l.ShowAudioAnimation);
              }
            )
        : ((l.getInstance().playButton.innerHTML =
            "<button id='nextqButton'><img class=audio-button width='100px' height='100px' src='./img/SoundButton_Idle.png' type='image/svg+xml'> </img></button>"),
          document
            .getElementById("nextqButton")
            .addEventListener("click", function () {
              console.log("next question button pressed"),
                console.log(e.promptAudio),
                "promptAudio" in e &&
                  a.PlayAudio(e.promptAudio, void 0, l.ShowAudioAnimation);
            })),
        (l.getInstance().answersContainer.style.visibility = "visible");
      let t = "";
      if (
        ((l.getInstance().questionsContainer.innerHTML = ""),
        void 0 === e && (e = l.getInstance().nextQuestion),
        "promptImg" in e)
      ) {
        var n = a.GetImage(e.promptImg);
        l.getInstance().questionsContainer.appendChild(n);
      }
      for (var i in ((t += e.promptText),
      (t += "<BR>"),
      (l.getInstance().questionsContainer.innerHTML += t),
      l.getInstance().buttons))
        l.getInstance().buttons[i].style.visibility = "hidden";
    }
    static AddStar() {
      var e = document.getElementById(
        "star" + l.getInstance().stars[l.getInstance().qAnsNum]
      );
      (e.src = "animation/Star.gif"),
        e.classList.add("topstarv"),
        e.classList.remove("topstarh"),
        (e.style.position = "absolute");
      let t = l.getInstance().starContainer.offsetWidth,
        n = l.getInstance().starContainer.offsetHeight;
      console.log("Stars Container dimensions: ", t, n);
      let i = 0,
        s = 0;
      do {
        (i = Math.floor(Math.random() * (t - 0.2 * t))),
          (s = Math.floor(Math.random() * n));
      } while (l.OverlappingOtherStars(l.instance.starPositions, i, s, 28));
      const o = l.getInstance().animationSpeedMultiplier;
      (e.style.transform = "scale(10)"),
        (e.style.transition = `top ${1 * o}s ease, left ${
          1 * o
        }s ease, transform ${0.5 * o}s ease`),
        (e.style.zIndex = "500"),
        (e.style.top = window.innerHeight / 2 + "px"),
        (e.style.left =
          l.instance.gameContainer.offsetWidth / 2 - e.offsetWidth / 2 + "px"),
        setTimeout(() => {
          if (
            ((e.style.transition = `top ${2 * o}s ease, left ${
              2 * o
            }s ease, transform ${2 * o}s ease`),
            i < t / 2 - 30)
          ) {
            const t = 5 + 8 * Math.random();
            console.log("Rotating star to the right", t),
              (e.style.transform = "rotate(-" + t + "deg) scale(1)");
          } else {
            const t = 5 + 8 * Math.random();
            console.log("Rotating star to the left", t),
              (e.style.transform = "rotate(" + t + "deg) scale(1)");
          }
          (e.style.left = 10 + i + "px"),
            (e.style.top = s + "px"),
            setTimeout(() => {
              e.style.filter = "drop-shadow(0px 0px 10px yellow)";
            }, 1900 * o);
        }, 1e3 * o),
        l.instance.starPositions.push({ x: i, y: s }),
        (l.getInstance().qAnsNum += 1),
        (l.getInstance().shownStarsCount += 1);
    }
    static ChangeStarImageAfterAnimation() {
      document.getElementById(
        "star" + l.getInstance().stars[l.getInstance().qAnsNum - 1]
      ).src = "img/star_after_animation.gif";
    }
    answerButtonPress(e) {
      const t = this.buttons.every((e) => "visible" === e.style.visibility);
      if ((console.log(this.buttonsActive, t), !0 === this.buttonsActive)) {
        a.PlayDing();
        const t = Date.now() - this.qStart;
        console.log("answered in " + t), this.buttonPressCallback(e, t);
      }
    }
    static ProgressChest() {
      const e = document.getElementById("chestImage");
      let t = e.src;
      console.log("Chest Progression--\x3e", e),
        console.log("Chest Progression--\x3e", e.src);
      const n = parseInt(t.slice(-6, -4), 10);
      console.log("Chest Progression number--\x3e", n);
      const i = `img/chestprogression/TreasureChestOpen0${(n % 4) + 1}.svg`;
      e.src = i;
    }
    static SetContentLoaded(e) {
      l.getInstance().contentLoaded = e;
    }
    static SetButtonPressAction(e) {
      l.getInstance().buttonPressCallback = e;
    }
    static SetStartAction(e) {
      l.getInstance().startPressCallback = e;
    }
    static SetExternalBucketControlsGenerationHandler(e) {
      l.getInstance().externalBucketControlsGenerationHandler = e;
    }
    static getInstance() {
      return (
        null === l.instance && ((l.instance = new l()), l.instance.init()),
        l.instance
      );
    }
  }
  l.instance = null;
  const u = function (e) {
      const t = [];
      let n = 0;
      for (let i = 0; i < e.length; i++) {
        let s = e.charCodeAt(i);
        s < 128
          ? (t[n++] = s)
          : s < 2048
          ? ((t[n++] = (s >> 6) | 192), (t[n++] = (63 & s) | 128))
          : 55296 == (64512 & s) &&
            i + 1 < e.length &&
            56320 == (64512 & e.charCodeAt(i + 1))
          ? ((s = 65536 + ((1023 & s) << 10) + (1023 & e.charCodeAt(++i))),
            (t[n++] = (s >> 18) | 240),
            (t[n++] = ((s >> 12) & 63) | 128),
            (t[n++] = ((s >> 6) & 63) | 128),
            (t[n++] = (63 & s) | 128))
          : ((t[n++] = (s >> 12) | 224),
            (t[n++] = ((s >> 6) & 63) | 128),
            (t[n++] = (63 & s) | 128));
      }
      return t;
    },
    d = {
      byteToCharMap_: null,
      charToByteMap_: null,
      byteToCharMapWebSafe_: null,
      charToByteMapWebSafe_: null,
      ENCODED_VALS_BASE:
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
      get ENCODED_VALS() {
        return this.ENCODED_VALS_BASE + "+/=";
      },
      get ENCODED_VALS_WEBSAFE() {
        return this.ENCODED_VALS_BASE + "-_.";
      },
      HAS_NATIVE_SUPPORT: "function" == typeof atob,
      encodeByteArray(e, t) {
        if (!Array.isArray(e))
          throw Error("encodeByteArray takes an array as a parameter");
        this.init_();
        const n = t ? this.byteToCharMapWebSafe_ : this.byteToCharMap_,
          i = [];
        for (let t = 0; t < e.length; t += 3) {
          const s = e[t],
            o = t + 1 < e.length,
            a = o ? e[t + 1] : 0,
            r = t + 2 < e.length,
            c = r ? e[t + 2] : 0,
            l = s >> 2,
            u = ((3 & s) << 4) | (a >> 4);
          let d = ((15 & a) << 2) | (c >> 6),
            h = 63 & c;
          r || ((h = 64), o || (d = 64)), i.push(n[l], n[u], n[d], n[h]);
        }
        return i.join("");
      },
      encodeString(e, t) {
        return this.HAS_NATIVE_SUPPORT && !t
          ? btoa(e)
          : this.encodeByteArray(u(e), t);
      },
      decodeString(e, t) {
        return this.HAS_NATIVE_SUPPORT && !t
          ? atob(e)
          : (function (e) {
              const t = [];
              let n = 0,
                i = 0;
              for (; n < e.length; ) {
                const s = e[n++];
                if (s < 128) t[i++] = String.fromCharCode(s);
                else if (s > 191 && s < 224) {
                  const o = e[n++];
                  t[i++] = String.fromCharCode(((31 & s) << 6) | (63 & o));
                } else if (s > 239 && s < 365) {
                  const o =
                    (((7 & s) << 18) |
                      ((63 & e[n++]) << 12) |
                      ((63 & e[n++]) << 6) |
                      (63 & e[n++])) -
                    65536;
                  (t[i++] = String.fromCharCode(55296 + (o >> 10))),
                    (t[i++] = String.fromCharCode(56320 + (1023 & o)));
                } else {
                  const o = e[n++],
                    a = e[n++];
                  t[i++] = String.fromCharCode(
                    ((15 & s) << 12) | ((63 & o) << 6) | (63 & a)
                  );
                }
              }
              return t.join("");
            })(this.decodeStringToByteArray(e, t));
      },
      decodeStringToByteArray(e, t) {
        this.init_();
        const n = t ? this.charToByteMapWebSafe_ : this.charToByteMap_,
          i = [];
        for (let t = 0; t < e.length; ) {
          const s = n[e.charAt(t++)],
            o = t < e.length ? n[e.charAt(t)] : 0;
          ++t;
          const a = t < e.length ? n[e.charAt(t)] : 64;
          ++t;
          const r = t < e.length ? n[e.charAt(t)] : 64;
          if ((++t, null == s || null == o || null == a || null == r))
            throw Error();
          const c = (s << 2) | (o >> 4);
          if ((i.push(c), 64 !== a)) {
            const e = ((o << 4) & 240) | (a >> 2);
            if ((i.push(e), 64 !== r)) {
              const e = ((a << 6) & 192) | r;
              i.push(e);
            }
          }
        }
        return i;
      },
      init_() {
        if (!this.byteToCharMap_) {
          (this.byteToCharMap_ = {}),
            (this.charToByteMap_ = {}),
            (this.byteToCharMapWebSafe_ = {}),
            (this.charToByteMapWebSafe_ = {});
          for (let e = 0; e < this.ENCODED_VALS.length; e++)
            (this.byteToCharMap_[e] = this.ENCODED_VALS.charAt(e)),
              (this.charToByteMap_[this.byteToCharMap_[e]] = e),
              (this.byteToCharMapWebSafe_[e] =
                this.ENCODED_VALS_WEBSAFE.charAt(e)),
              (this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[e]] = e),
              e >= this.ENCODED_VALS_BASE.length &&
                ((this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(e)] = e),
                (this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(e)] = e));
        }
      },
    },
    h = function (e) {
      return (function (e) {
        const t = u(e);
        return d.encodeByteArray(t, !0);
      })(e).replace(/\./g, "");
    };
  function p() {
    return "object" == typeof indexedDB;
  }
  function g() {
    return new Promise((e, t) => {
      try {
        let n = !0;
        const i = "validate-browser-context-for-indexeddb-analytics-module",
          s = self.indexedDB.open(i);
        (s.onsuccess = () => {
          s.result.close(), n || self.indexedDB.deleteDatabase(i), e(!0);
        }),
          (s.onupgradeneeded = () => {
            n = !1;
          }),
          (s.onerror = () => {
            var e;
            t(
              (null === (e = s.error) || void 0 === e ? void 0 : e.message) ||
                ""
            );
          });
      } catch (e) {
        t(e);
      }
    });
  }
  const f = () => {
    try {
      return (
        (function () {
          if ("undefined" != typeof self) return self;
          if ("undefined" != typeof window) return window;
          if (void 0 !== e.g) return e.g;
          throw new Error("Unable to locate global object.");
        })().__FIREBASE_DEFAULTS__ ||
        (() => {
          if ("undefined" == typeof process || void 0 === process.env) return;
          const e = process.env.__FIREBASE_DEFAULTS__;
          return e ? JSON.parse(e) : void 0;
        })() ||
        (() => {
          if ("undefined" == typeof document) return;
          let e;
          try {
            e = document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/);
          } catch (e) {
            return;
          }
          const t =
            e &&
            (function (e) {
              try {
                return d.decodeString(e, !0);
              } catch (e) {
                console.error("base64Decode failed: ", e);
              }
              return null;
            })(e[1]);
          return t && JSON.parse(t);
        })()
      );
    } catch (e) {
      return void console.info(
        `Unable to get __FIREBASE_DEFAULTS__ due to: ${e}`
      );
    }
  };
  class m {
    constructor() {
      (this.reject = () => {}),
        (this.resolve = () => {}),
        (this.promise = new Promise((e, t) => {
          (this.resolve = e), (this.reject = t);
        }));
    }
    wrapCallback(e) {
      return (t, n) => {
        t ? this.reject(t) : this.resolve(n),
          "function" == typeof e &&
            (this.promise.catch(() => {}), 1 === e.length ? e(t) : e(t, n));
      };
    }
  }
  class b extends Error {
    constructor(e, t, n) {
      super(t),
        (this.code = e),
        (this.customData = n),
        (this.name = "FirebaseError"),
        Object.setPrototypeOf(this, b.prototype),
        Error.captureStackTrace &&
          Error.captureStackTrace(this, v.prototype.create);
    }
  }
  class v {
    constructor(e, t, n) {
      (this.service = e), (this.serviceName = t), (this.errors = n);
    }
    create(e, ...t) {
      const n = t[0] || {},
        i = `${this.service}/${e}`,
        s = this.errors[e],
        o = s
          ? (function (e, t) {
              return e.replace(w, (e, n) => {
                const i = t[n];
                return null != i ? String(i) : `<${n}?>`;
              });
            })(s, n)
          : "Error",
        a = `${this.serviceName}: ${o} (${i}).`;
      return new b(i, a, n);
    }
  }
  const w = /\{\$([^}]+)}/g;
  function y(e, t) {
    if (e === t) return !0;
    const n = Object.keys(e),
      i = Object.keys(t);
    for (const s of n) {
      if (!i.includes(s)) return !1;
      const n = e[s],
        o = t[s];
      if (I(n) && I(o)) {
        if (!y(n, o)) return !1;
      } else if (n !== o) return !1;
    }
    for (const e of i) if (!n.includes(e)) return !1;
    return !0;
  }
  function I(e) {
    return null !== e && "object" == typeof e;
  }
  function k(e, t = 1e3, n = 2) {
    const i = t * Math.pow(n, e),
      s = Math.round(0.5 * i * (Math.random() - 0.5) * 2);
    return Math.min(144e5, i + s);
  }
  function B(e) {
    return e && e._delegate ? e._delegate : e;
  }
  class S {
    constructor(e, t, n) {
      (this.name = e),
        (this.instanceFactory = t),
        (this.type = n),
        (this.multipleInstances = !1),
        (this.serviceProps = {}),
        (this.instantiationMode = "LAZY"),
        (this.onInstanceCreated = null);
    }
    setInstantiationMode(e) {
      return (this.instantiationMode = e), this;
    }
    setMultipleInstances(e) {
      return (this.multipleInstances = e), this;
    }
    setServiceProps(e) {
      return (this.serviceProps = e), this;
    }
    setInstanceCreatedCallback(e) {
      return (this.onInstanceCreated = e), this;
    }
  }
  const C = "[DEFAULT]";
  class A {
    constructor(e, t) {
      (this.name = e),
        (this.container = t),
        (this.component = null),
        (this.instances = new Map()),
        (this.instancesDeferred = new Map()),
        (this.instancesOptions = new Map()),
        (this.onInitCallbacks = new Map());
    }
    get(e) {
      const t = this.normalizeInstanceIdentifier(e);
      if (!this.instancesDeferred.has(t)) {
        const e = new m();
        if (
          (this.instancesDeferred.set(t, e),
          this.isInitialized(t) || this.shouldAutoInitialize())
        )
          try {
            const n = this.getOrInitializeService({ instanceIdentifier: t });
            n && e.resolve(n);
          } catch (e) {}
      }
      return this.instancesDeferred.get(t).promise;
    }
    getImmediate(e) {
      var t;
      const n = this.normalizeInstanceIdentifier(
          null == e ? void 0 : e.identifier
        ),
        i = null !== (t = null == e ? void 0 : e.optional) && void 0 !== t && t;
      if (!this.isInitialized(n) && !this.shouldAutoInitialize()) {
        if (i) return null;
        throw Error(`Service ${this.name} is not available`);
      }
      try {
        return this.getOrInitializeService({ instanceIdentifier: n });
      } catch (e) {
        if (i) return null;
        throw e;
      }
    }
    getComponent() {
      return this.component;
    }
    setComponent(e) {
      if (e.name !== this.name)
        throw Error(
          `Mismatching Component ${e.name} for Provider ${this.name}.`
        );
      if (this.component)
        throw Error(`Component for ${this.name} has already been provided`);
      if (((this.component = e), this.shouldAutoInitialize())) {
        if (
          (function (e) {
            return "EAGER" === e.instantiationMode;
          })(e)
        )
          try {
            this.getOrInitializeService({ instanceIdentifier: C });
          } catch (e) {}
        for (const [e, t] of this.instancesDeferred.entries()) {
          const n = this.normalizeInstanceIdentifier(e);
          try {
            const e = this.getOrInitializeService({ instanceIdentifier: n });
            t.resolve(e);
          } catch (e) {}
        }
      }
    }
    clearInstance(e = "[DEFAULT]") {
      this.instancesDeferred.delete(e),
        this.instancesOptions.delete(e),
        this.instances.delete(e);
    }
    async delete() {
      const e = Array.from(this.instances.values());
      await Promise.all([
        ...e.filter((e) => "INTERNAL" in e).map((e) => e.INTERNAL.delete()),
        ...e.filter((e) => "_delete" in e).map((e) => e._delete()),
      ]);
    }
    isComponentSet() {
      return null != this.component;
    }
    isInitialized(e = "[DEFAULT]") {
      return this.instances.has(e);
    }
    getOptions(e = "[DEFAULT]") {
      return this.instancesOptions.get(e) || {};
    }
    initialize(e = {}) {
      const { options: t = {} } = e,
        n = this.normalizeInstanceIdentifier(e.instanceIdentifier);
      if (this.isInitialized(n))
        throw Error(`${this.name}(${n}) has already been initialized`);
      if (!this.isComponentSet())
        throw Error(`Component ${this.name} has not been registered yet`);
      const i = this.getOrInitializeService({
        instanceIdentifier: n,
        options: t,
      });
      for (const [e, t] of this.instancesDeferred.entries())
        n === this.normalizeInstanceIdentifier(e) && t.resolve(i);
      return i;
    }
    onInit(e, t) {
      var n;
      const i = this.normalizeInstanceIdentifier(t),
        s =
          null !== (n = this.onInitCallbacks.get(i)) && void 0 !== n
            ? n
            : new Set();
      s.add(e), this.onInitCallbacks.set(i, s);
      const o = this.instances.get(i);
      return (
        o && e(o, i),
        () => {
          s.delete(e);
        }
      );
    }
    invokeOnInitCallbacks(e, t) {
      const n = this.onInitCallbacks.get(t);
      if (n)
        for (const i of n)
          try {
            i(e, t);
          } catch (e) {}
    }
    getOrInitializeService({ instanceIdentifier: e, options: t = {} }) {
      let n = this.instances.get(e);
      if (
        !n &&
        this.component &&
        ((n = this.component.instanceFactory(this.container, {
          instanceIdentifier: ((i = e), i === C ? void 0 : i),
          options: t,
        })),
        this.instances.set(e, n),
        this.instancesOptions.set(e, t),
        this.invokeOnInitCallbacks(n, e),
        this.component.onInstanceCreated)
      )
        try {
          this.component.onInstanceCreated(this.container, e, n);
        } catch (e) {}
      var i;
      return n || null;
    }
    normalizeInstanceIdentifier(e = "[DEFAULT]") {
      return this.component ? (this.component.multipleInstances ? e : C) : e;
    }
    shouldAutoInitialize() {
      return (
        !!this.component && "EXPLICIT" !== this.component.instantiationMode
      );
    }
  }
  class L {
    constructor(e) {
      (this.name = e), (this.providers = new Map());
    }
    addComponent(e) {
      const t = this.getProvider(e.name);
      if (t.isComponentSet())
        throw new Error(
          `Component ${e.name} has already been registered with ${this.name}`
        );
      t.setComponent(e);
    }
    addOrOverwriteComponent(e) {
      this.getProvider(e.name).isComponentSet() &&
        this.providers.delete(e.name),
        this.addComponent(e);
    }
    getProvider(e) {
      if (this.providers.has(e)) return this.providers.get(e);
      const t = new A(e, this);
      return this.providers.set(e, t), t;
    }
    getProviders() {
      return Array.from(this.providers.values());
    }
  }
  const M = [];
  var E;
  !(function (e) {
    (e[(e.DEBUG = 0)] = "DEBUG"),
      (e[(e.VERBOSE = 1)] = "VERBOSE"),
      (e[(e.INFO = 2)] = "INFO"),
      (e[(e.WARN = 3)] = "WARN"),
      (e[(e.ERROR = 4)] = "ERROR"),
      (e[(e.SILENT = 5)] = "SILENT");
  })(E || (E = {}));
  const T = {
      debug: E.DEBUG,
      verbose: E.VERBOSE,
      info: E.INFO,
      warn: E.WARN,
      error: E.ERROR,
      silent: E.SILENT,
    },
    D = E.INFO,
    x = {
      [E.DEBUG]: "log",
      [E.VERBOSE]: "log",
      [E.INFO]: "info",
      [E.WARN]: "warn",
      [E.ERROR]: "error",
    },
    R = (e, t, ...n) => {
      if (t < e.logLevel) return;
      const i = new Date().toISOString(),
        s = x[t];
      if (!s)
        throw new Error(
          `Attempted to log a message with an invalid logType (value: ${t})`
        );
      console[s](`[${i}]  ${e.name}:`, ...n);
    };
  class N {
    constructor(e) {
      (this.name = e),
        (this._logLevel = D),
        (this._logHandler = R),
        (this._userLogHandler = null),
        M.push(this);
    }
    get logLevel() {
      return this._logLevel;
    }
    set logLevel(e) {
      if (!(e in E))
        throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);
      this._logLevel = e;
    }
    setLogLevel(e) {
      this._logLevel = "string" == typeof e ? T[e] : e;
    }
    get logHandler() {
      return this._logHandler;
    }
    set logHandler(e) {
      if ("function" != typeof e)
        throw new TypeError(
          "Value assigned to `logHandler` must be a function"
        );
      this._logHandler = e;
    }
    get userLogHandler() {
      return this._userLogHandler;
    }
    set userLogHandler(e) {
      this._userLogHandler = e;
    }
    debug(...e) {
      this._userLogHandler && this._userLogHandler(this, E.DEBUG, ...e),
        this._logHandler(this, E.DEBUG, ...e);
    }
    log(...e) {
      this._userLogHandler && this._userLogHandler(this, E.VERBOSE, ...e),
        this._logHandler(this, E.VERBOSE, ...e);
    }
    info(...e) {
      this._userLogHandler && this._userLogHandler(this, E.INFO, ...e),
        this._logHandler(this, E.INFO, ...e);
    }
    warn(...e) {
      this._userLogHandler && this._userLogHandler(this, E.WARN, ...e),
        this._logHandler(this, E.WARN, ...e);
    }
    error(...e) {
      this._userLogHandler && this._userLogHandler(this, E.ERROR, ...e),
        this._logHandler(this, E.ERROR, ...e);
    }
  }
  let P, F;
  const U = new WeakMap(),
    O = new WeakMap(),
    j = new WeakMap(),
    V = new WeakMap(),
    $ = new WeakMap();
  let H = {
    get(e, t, n) {
      if (e instanceof IDBTransaction) {
        if ("done" === t) return O.get(e);
        if ("objectStoreNames" === t) return e.objectStoreNames || j.get(e);
        if ("store" === t)
          return n.objectStoreNames[1]
            ? void 0
            : n.objectStore(n.objectStoreNames[0]);
      }
      return G(e[t]);
    },
    set: (e, t, n) => ((e[t] = n), !0),
    has: (e, t) =>
      (e instanceof IDBTransaction && ("done" === t || "store" === t)) ||
      t in e,
  };
  function q(e) {
    return "function" == typeof e
      ? (t = e) !== IDBDatabase.prototype.transaction ||
        "objectStoreNames" in IDBTransaction.prototype
        ? (
            F ||
            (F = [
              IDBCursor.prototype.advance,
              IDBCursor.prototype.continue,
              IDBCursor.prototype.continuePrimaryKey,
            ])
          ).includes(t)
          ? function (...e) {
              return t.apply(W(this), e), G(U.get(this));
            }
          : function (...e) {
              return G(t.apply(W(this), e));
            }
        : function (e, ...n) {
            const i = t.call(W(this), e, ...n);
            return j.set(i, e.sort ? e.sort() : [e]), G(i);
          }
      : (e instanceof IDBTransaction &&
          (function (e) {
            if (O.has(e)) return;
            const t = new Promise((t, n) => {
              const i = () => {
                  e.removeEventListener("complete", s),
                    e.removeEventListener("error", o),
                    e.removeEventListener("abort", o);
                },
                s = () => {
                  t(), i();
                },
                o = () => {
                  n(e.error || new DOMException("AbortError", "AbortError")),
                    i();
                };
              e.addEventListener("complete", s),
                e.addEventListener("error", o),
                e.addEventListener("abort", o);
            });
            O.set(e, t);
          })(e),
        (n = e),
        (
          P ||
          (P = [
            IDBDatabase,
            IDBObjectStore,
            IDBIndex,
            IDBCursor,
            IDBTransaction,
          ])
        ).some((e) => n instanceof e)
          ? new Proxy(e, H)
          : e);
    var t, n;
  }
  function G(e) {
    if (e instanceof IDBRequest)
      return (function (e) {
        const t = new Promise((t, n) => {
          const i = () => {
              e.removeEventListener("success", s),
                e.removeEventListener("error", o);
            },
            s = () => {
              t(G(e.result)), i();
            },
            o = () => {
              n(e.error), i();
            };
          e.addEventListener("success", s), e.addEventListener("error", o);
        });
        return (
          t
            .then((t) => {
              t instanceof IDBCursor && U.set(t, e);
            })
            .catch(() => {}),
          $.set(t, e),
          t
        );
      })(e);
    if (V.has(e)) return V.get(e);
    const t = q(e);
    return t !== e && (V.set(e, t), $.set(t, e)), t;
  }
  const W = (e) => $.get(e);
  function z(
    e,
    t,
    { blocked: n, upgrade: i, blocking: s, terminated: o } = {}
  ) {
    const a = indexedDB.open(e, t),
      r = G(a);
    return (
      i &&
        a.addEventListener("upgradeneeded", (e) => {
          i(G(a.result), e.oldVersion, e.newVersion, G(a.transaction));
        }),
      n && a.addEventListener("blocked", () => n()),
      r
        .then((e) => {
          o && e.addEventListener("close", () => o()),
            s && e.addEventListener("versionchange", () => s());
        })
        .catch(() => {}),
      r
    );
  }
  const Q = ["get", "getKey", "getAll", "getAllKeys", "count"],
    K = ["put", "add", "delete", "clear"],
    J = new Map();
  function X(e, t) {
    if (!(e instanceof IDBDatabase) || t in e || "string" != typeof t) return;
    if (J.get(t)) return J.get(t);
    const n = t.replace(/FromIndex$/, ""),
      i = t !== n,
      s = K.includes(n);
    if (
      !(n in (i ? IDBIndex : IDBObjectStore).prototype) ||
      (!s && !Q.includes(n))
    )
      return;
    const o = async function (e, ...t) {
      const o = this.transaction(e, s ? "readwrite" : "readonly");
      let a = o.store;
      return (
        i && (a = a.index(t.shift())),
        (await Promise.all([a[n](...t), s && o.done]))[0]
      );
    };
    return J.set(t, o), o;
  }
  var Y;
  (Y = H),
    (H = {
      ...Y,
      get: (e, t, n) => X(e, t) || Y.get(e, t, n),
      has: (e, t) => !!X(e, t) || Y.has(e, t),
    });
  class Z {
    constructor(e) {
      this.container = e;
    }
    getPlatformInfoString() {
      return this.container
        .getProviders()
        .map((e) => {
          if (
            (function (e) {
              const t = e.getComponent();
              return "VERSION" === (null == t ? void 0 : t.type);
            })(e)
          ) {
            const t = e.getImmediate();
            return `${t.library}/${t.version}`;
          }
          return null;
        })
        .filter((e) => e)
        .join(" ");
    }
  }
  const ee = "@firebase/app",
    te = "0.8.2",
    ne = new N("@firebase/app"),
    ie = "[DEFAULT]",
    se = {
      [ee]: "fire-core",
      "@firebase/app-compat": "fire-core-compat",
      "@firebase/analytics": "fire-analytics",
      "@firebase/analytics-compat": "fire-analytics-compat",
      "@firebase/app-check": "fire-app-check",
      "@firebase/app-check-compat": "fire-app-check-compat",
      "@firebase/auth": "fire-auth",
      "@firebase/auth-compat": "fire-auth-compat",
      "@firebase/database": "fire-rtdb",
      "@firebase/database-compat": "fire-rtdb-compat",
      "@firebase/functions": "fire-fn",
      "@firebase/functions-compat": "fire-fn-compat",
      "@firebase/installations": "fire-iid",
      "@firebase/installations-compat": "fire-iid-compat",
      "@firebase/messaging": "fire-fcm",
      "@firebase/messaging-compat": "fire-fcm-compat",
      "@firebase/performance": "fire-perf",
      "@firebase/performance-compat": "fire-perf-compat",
      "@firebase/remote-config": "fire-rc",
      "@firebase/remote-config-compat": "fire-rc-compat",
      "@firebase/storage": "fire-gcs",
      "@firebase/storage-compat": "fire-gcs-compat",
      "@firebase/firestore": "fire-fst",
      "@firebase/firestore-compat": "fire-fst-compat",
      "fire-js": "fire-js",
      firebase: "fire-js-all",
    },
    oe = new Map(),
    ae = new Map();
  function re(e, t) {
    try {
      e.container.addComponent(t);
    } catch (n) {
      ne.debug(
        `Component ${t.name} failed to register with FirebaseApp ${e.name}`,
        n
      );
    }
  }
  function ce(e) {
    const t = e.name;
    if (ae.has(t))
      return (
        ne.debug(`There were multiple attempts to register component ${t}.`), !1
      );
    ae.set(t, e);
    for (const t of oe.values()) re(t, e);
    return !0;
  }
  function le(e, t) {
    const n = e.container
      .getProvider("heartbeat")
      .getImmediate({ optional: !0 });
    return n && n.triggerHeartbeat(), e.container.getProvider(t);
  }
  const ue = new v("app", "Firebase", {
    "no-app":
      "No Firebase App '{$appName}' has been created - call Firebase App.initializeApp()",
    "bad-app-name": "Illegal App name: '{$appName}",
    "duplicate-app":
      "Firebase App named '{$appName}' already exists with different options or config",
    "app-deleted": "Firebase App named '{$appName}' already deleted",
    "no-options":
      "Need to provide options, when not being deployed to hosting via source.",
    "invalid-app-argument":
      "firebase.{$appName}() takes either no argument or a Firebase App instance.",
    "invalid-log-argument":
      "First argument to `onLog` must be null or a function.",
    "idb-open":
      "Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.",
    "idb-get":
      "Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.",
    "idb-set":
      "Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.",
    "idb-delete":
      "Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.",
  });
  class de {
    constructor(e, t, n) {
      (this._isDeleted = !1),
        (this._options = Object.assign({}, e)),
        (this._config = Object.assign({}, t)),
        (this._name = t.name),
        (this._automaticDataCollectionEnabled =
          t.automaticDataCollectionEnabled),
        (this._container = n),
        this.container.addComponent(new S("app", () => this, "PUBLIC"));
    }
    get automaticDataCollectionEnabled() {
      return this.checkDestroyed(), this._automaticDataCollectionEnabled;
    }
    set automaticDataCollectionEnabled(e) {
      this.checkDestroyed(), (this._automaticDataCollectionEnabled = e);
    }
    get name() {
      return this.checkDestroyed(), this._name;
    }
    get options() {
      return this.checkDestroyed(), this._options;
    }
    get config() {
      return this.checkDestroyed(), this._config;
    }
    get container() {
      return this._container;
    }
    get isDeleted() {
      return this._isDeleted;
    }
    set isDeleted(e) {
      this._isDeleted = e;
    }
    checkDestroyed() {
      if (this.isDeleted)
        throw ue.create("app-deleted", { appName: this._name });
    }
  }
  function he(e, t = {}) {
    let n = e;
    "object" != typeof t && (t = { name: t });
    const i = Object.assign(
        { name: ie, automaticDataCollectionEnabled: !1 },
        t
      ),
      s = i.name;
    if ("string" != typeof s || !s)
      throw ue.create("bad-app-name", { appName: String(s) });
    var o;
    if ((n || (n = null === (o = f()) || void 0 === o ? void 0 : o.config), !n))
      throw ue.create("no-options");
    const a = oe.get(s);
    if (a) {
      if (y(n, a.options) && y(i, a.config)) return a;
      throw ue.create("duplicate-app", { appName: s });
    }
    const r = new L(s);
    for (const e of ae.values()) r.addComponent(e);
    const c = new de(n, i, r);
    return oe.set(s, c), c;
  }
  function pe(e, t, n) {
    var i;
    let s = null !== (i = se[e]) && void 0 !== i ? i : e;
    n && (s += `-${n}`);
    const o = s.match(/\s|\//),
      a = t.match(/\s|\//);
    if (o || a) {
      const e = [`Unable to register library "${s}" with version "${t}":`];
      return (
        o &&
          e.push(
            `library name "${s}" contains illegal characters (whitespace or "/")`
          ),
        o && a && e.push("and"),
        a &&
          e.push(
            `version name "${t}" contains illegal characters (whitespace or "/")`
          ),
        void ne.warn(e.join(" "))
      );
    }
    ce(new S(`${s}-version`, () => ({ library: s, version: t }), "VERSION"));
  }
  const ge = "firebase-heartbeat-store";
  let fe = null;
  function me() {
    return (
      fe ||
        (fe = z("firebase-heartbeat-database", 1, {
          upgrade: (e, t) => {
            0 === t && e.createObjectStore(ge);
          },
        }).catch((e) => {
          throw ue.create("idb-open", { originalErrorMessage: e.message });
        })),
      fe
    );
  }
  async function be(e, t) {
    var n;
    try {
      const n = (await me()).transaction(ge, "readwrite"),
        i = n.objectStore(ge);
      return await i.put(t, ve(e)), n.done;
    } catch (e) {
      if (e instanceof b) ne.warn(e.message);
      else {
        const t = ue.create("idb-set", {
          originalErrorMessage:
            null === (n = e) || void 0 === n ? void 0 : n.message,
        });
        ne.warn(t.message);
      }
    }
  }
  function ve(e) {
    return `${e.name}!${e.options.appId}`;
  }
  class we {
    constructor(e) {
      (this.container = e), (this._heartbeatsCache = null);
      const t = this.container.getProvider("app").getImmediate();
      (this._storage = new Ie(t)),
        (this._heartbeatsCachePromise = this._storage
          .read()
          .then((e) => ((this._heartbeatsCache = e), e)));
    }
    async triggerHeartbeat() {
      const e = this.container
          .getProvider("platform-logger")
          .getImmediate()
          .getPlatformInfoString(),
        t = ye();
      if (
        (null === this._heartbeatsCache &&
          (this._heartbeatsCache = await this._heartbeatsCachePromise),
        this._heartbeatsCache.lastSentHeartbeatDate !== t &&
          !this._heartbeatsCache.heartbeats.some((e) => e.date === t))
      )
        return (
          this._heartbeatsCache.heartbeats.push({ date: t, agent: e }),
          (this._heartbeatsCache.heartbeats =
            this._heartbeatsCache.heartbeats.filter((e) => {
              const t = new Date(e.date).valueOf();
              return Date.now() - t <= 2592e6;
            })),
          this._storage.overwrite(this._heartbeatsCache)
        );
    }
    async getHeartbeatsHeader() {
      if (
        (null === this._heartbeatsCache && (await this._heartbeatsCachePromise),
        null === this._heartbeatsCache ||
          0 === this._heartbeatsCache.heartbeats.length)
      )
        return "";
      const e = ye(),
        { heartbeatsToSend: t, unsentEntries: n } = (function (e, t = 1024) {
          const n = [];
          let i = e.slice();
          for (const s of e) {
            const e = n.find((e) => e.agent === s.agent);
            if (e) {
              if ((e.dates.push(s.date), ke(n) > t)) {
                e.dates.pop();
                break;
              }
            } else if (
              (n.push({ agent: s.agent, dates: [s.date] }), ke(n) > t)
            ) {
              n.pop();
              break;
            }
            i = i.slice(1);
          }
          return { heartbeatsToSend: n, unsentEntries: i };
        })(this._heartbeatsCache.heartbeats),
        i = h(JSON.stringify({ version: 2, heartbeats: t }));
      return (
        (this._heartbeatsCache.lastSentHeartbeatDate = e),
        n.length > 0
          ? ((this._heartbeatsCache.heartbeats = n),
            await this._storage.overwrite(this._heartbeatsCache))
          : ((this._heartbeatsCache.heartbeats = []),
            this._storage.overwrite(this._heartbeatsCache)),
        i
      );
    }
  }
  function ye() {
    return new Date().toISOString().substring(0, 10);
  }
  class Ie {
    constructor(e) {
      (this.app = e),
        (this._canUseIndexedDBPromise = this.runIndexedDBEnvironmentCheck());
    }
    async runIndexedDBEnvironmentCheck() {
      return (
        !!p() &&
        g()
          .then(() => !0)
          .catch(() => !1)
      );
    }
    async read() {
      if (await this._canUseIndexedDBPromise) {
        const e = await (async function (e) {
          var t;
          try {
            return (await me()).transaction(ge).objectStore(ge).get(ve(e));
          } catch (e) {
            if (e instanceof b) ne.warn(e.message);
            else {
              const n = ue.create("idb-get", {
                originalErrorMessage:
                  null === (t = e) || void 0 === t ? void 0 : t.message,
              });
              ne.warn(n.message);
            }
          }
        })(this.app);
        return e || { heartbeats: [] };
      }
      return { heartbeats: [] };
    }
    async overwrite(e) {
      var t;
      if (await this._canUseIndexedDBPromise) {
        const n = await this.read();
        return be(this.app, {
          lastSentHeartbeatDate:
            null !== (t = e.lastSentHeartbeatDate) && void 0 !== t
              ? t
              : n.lastSentHeartbeatDate,
          heartbeats: e.heartbeats,
        });
      }
    }
    async add(e) {
      var t;
      if (await this._canUseIndexedDBPromise) {
        const n = await this.read();
        return be(this.app, {
          lastSentHeartbeatDate:
            null !== (t = e.lastSentHeartbeatDate) && void 0 !== t
              ? t
              : n.lastSentHeartbeatDate,
          heartbeats: [...n.heartbeats, ...e.heartbeats],
        });
      }
    }
  }
  function ke(e) {
    return h(JSON.stringify({ version: 2, heartbeats: e })).length;
  }
  ce(new S("platform-logger", (e) => new Z(e), "PRIVATE")),
    ce(new S("heartbeat", (e) => new we(e), "PRIVATE")),
    pe(ee, te, ""),
    pe(ee, te, "esm2017"),
    pe("fire-js", "");
  const Be = "@firebase/installations",
    Se = "0.5.15",
    Ce = "w:0.5.15",
    Ae = new v("installations", "Installations", {
      "missing-app-config-values":
        'Missing App configuration value: "{$valueName}"',
      "not-registered": "Firebase Installation is not registered.",
      "installation-not-found": "Firebase Installation not found.",
      "request-failed":
        '{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',
      "app-offline": "Could not process request. Application offline.",
      "delete-pending-registration":
        "Can't delete installation while there is a pending registration request.",
    });
  function Le(e) {
    return e instanceof b && e.code.includes("request-failed");
  }
  function Me({ projectId: e }) {
    return `https://firebaseinstallations.googleapis.com/v1/projects/${e}/installations`;
  }
  function Ee(e) {
    return {
      token: e.token,
      requestStatus: 2,
      expiresIn: ((t = e.expiresIn), Number(t.replace("s", "000"))),
      creationTime: Date.now(),
    };
    var t;
  }
  async function Te(e, t) {
    const n = (await t.json()).error;
    return Ae.create("request-failed", {
      requestName: e,
      serverCode: n.code,
      serverMessage: n.message,
      serverStatus: n.status,
    });
  }
  function De({ apiKey: e }) {
    return new Headers({
      "Content-Type": "application/json",
      Accept: "application/json",
      "x-goog-api-key": e,
    });
  }
  async function xe(e) {
    const t = await e();
    return t.status >= 500 && t.status < 600 ? e() : t;
  }
  function Re(e) {
    return new Promise((t) => {
      setTimeout(t, e);
    });
  }
  const _e = /^[cdef][\w-]{21}$/;
  function Ne() {
    try {
      const e = new Uint8Array(17);
      (self.crypto || self.msCrypto).getRandomValues(e),
        (e[0] = 112 + (e[0] % 16));
      const t = (function (e) {
        return ((t = e),
        btoa(String.fromCharCode(...t))
          .replace(/\+/g, "-")
          .replace(/\//g, "_")).substr(0, 22);
        var t;
      })(e);
      return _e.test(t) ? t : "";
    } catch (e) {
      return "";
    }
  }
  function Pe(e) {
    return `${e.appName}!${e.appId}`;
  }
  const Fe = new Map();
  function Ue(e, t) {
    const n = Pe(e);
    Oe(n, t),
      (function (e, t) {
        const n =
          (!je &&
            "BroadcastChannel" in self &&
            ((je = new BroadcastChannel("[Firebase] FID Change")),
            (je.onmessage = (e) => {
              Oe(e.data.key, e.data.fid);
            })),
          je);
        n && n.postMessage({ key: e, fid: t }),
          0 === Fe.size && je && (je.close(), (je = null));
      })(n, t);
  }
  function Oe(e, t) {
    const n = Fe.get(e);
    if (n) for (const e of n) e(t);
  }
  let je = null;
  const Ve = "firebase-installations-store";
  let $e = null;
  function He() {
    return (
      $e ||
        ($e = z("firebase-installations-database", 1, {
          upgrade: (e, t) => {
            0 === t && e.createObjectStore(Ve);
          },
        })),
      $e
    );
  }
  async function qe(e, t) {
    const n = Pe(e),
      i = (await He()).transaction(Ve, "readwrite"),
      s = i.objectStore(Ve),
      o = await s.get(n);
    return (
      await s.put(t, n), await i.done, (o && o.fid === t.fid) || Ue(e, t.fid), t
    );
  }
  async function Ge(e) {
    const t = Pe(e),
      n = (await He()).transaction(Ve, "readwrite");
    await n.objectStore(Ve).delete(t), await n.done;
  }
  async function We(e, t) {
    const n = Pe(e),
      i = (await He()).transaction(Ve, "readwrite"),
      s = i.objectStore(Ve),
      o = await s.get(n),
      a = t(o);
    return (
      void 0 === a ? await s.delete(n) : await s.put(a, n),
      await i.done,
      !a || (o && o.fid === a.fid) || Ue(e, a.fid),
      a
    );
  }
  async function ze(e) {
    let t;
    const n = await We(e.appConfig, (n) => {
      const i = (function (e) {
          return Je(e || { fid: Ne(), registrationStatus: 0 });
        })(n),
        s = (function (e, t) {
          if (0 === t.registrationStatus) {
            if (!navigator.onLine)
              return {
                installationEntry: t,
                registrationPromise: Promise.reject(Ae.create("app-offline")),
              };
            const n = {
                fid: t.fid,
                registrationStatus: 1,
                registrationTime: Date.now(),
              },
              i = (async function (e, t) {
                try {
                  const n = await (async function (
                    { appConfig: e, heartbeatServiceProvider: t },
                    { fid: n }
                  ) {
                    const i = Me(e),
                      s = De(e),
                      o = t.getImmediate({ optional: !0 });
                    if (o) {
                      const e = await o.getHeartbeatsHeader();
                      e && s.append("x-firebase-client", e);
                    }
                    const a = {
                        fid: n,
                        authVersion: "FIS_v2",
                        appId: e.appId,
                        sdkVersion: Ce,
                      },
                      r = {
                        method: "POST",
                        headers: s,
                        body: JSON.stringify(a),
                      },
                      c = await xe(() => fetch(i, r));
                    if (c.ok) {
                      const e = await c.json();
                      return {
                        fid: e.fid || n,
                        registrationStatus: 2,
                        refreshToken: e.refreshToken,
                        authToken: Ee(e.authToken),
                      };
                    }
                    throw await Te("Create Installation", c);
                  })(e, t);
                  return qe(e.appConfig, n);
                } catch (n) {
                  throw (
                    (Le(n) && 409 === n.customData.serverCode
                      ? await Ge(e.appConfig)
                      : await qe(e.appConfig, {
                          fid: t.fid,
                          registrationStatus: 0,
                        }),
                    n)
                  );
                }
              })(e, n);
            return { installationEntry: n, registrationPromise: i };
          }
          return 1 === t.registrationStatus
            ? { installationEntry: t, registrationPromise: Qe(e) }
            : { installationEntry: t };
        })(e, i);
      return (t = s.registrationPromise), s.installationEntry;
    });
    return "" === n.fid
      ? { installationEntry: await t }
      : { installationEntry: n, registrationPromise: t };
  }
  async function Qe(e) {
    let t = await Ke(e.appConfig);
    for (; 1 === t.registrationStatus; )
      await Re(100), (t = await Ke(e.appConfig));
    if (0 === t.registrationStatus) {
      const { installationEntry: t, registrationPromise: n } = await ze(e);
      return n || t;
    }
    return t;
  }
  function Ke(e) {
    return We(e, (e) => {
      if (!e) throw Ae.create("installation-not-found");
      return Je(e);
    });
  }
  function Je(e) {
    return 1 === (t = e).registrationStatus &&
      t.registrationTime + 1e4 < Date.now()
      ? { fid: e.fid, registrationStatus: 0 }
      : e;
    var t;
  }
  async function Xe({ appConfig: e, heartbeatServiceProvider: t }, n) {
    const i = (function (e, { fid: t }) {
        return `${Me(e)}/${t}/authTokens:generate`;
      })(e, n),
      s = (function (e, { refreshToken: t }) {
        const n = De(e);
        return (
          n.append(
            "Authorization",
            (function (e) {
              return `FIS_v2 ${e}`;
            })(t)
          ),
          n
        );
      })(e, n),
      o = t.getImmediate({ optional: !0 });
    if (o) {
      const e = await o.getHeartbeatsHeader();
      e && s.append("x-firebase-client", e);
    }
    const a = { installation: { sdkVersion: Ce, appId: e.appId } },
      r = { method: "POST", headers: s, body: JSON.stringify(a) },
      c = await xe(() => fetch(i, r));
    if (c.ok) return Ee(await c.json());
    throw await Te("Generate Auth Token", c);
  }
  async function Ye(e, t = !1) {
    let n;
    const i = await We(e.appConfig, (i) => {
      if (!et(i)) throw Ae.create("not-registered");
      const s = i.authToken;
      if (
        !t &&
        2 === (o = s).requestStatus &&
        !(function (e) {
          const t = Date.now();
          return t < e.creationTime || e.creationTime + e.expiresIn < t + 36e5;
        })(o)
      )
        return i;
      var o;
      if (1 === s.requestStatus)
        return (
          (n = (async function (e, t) {
            let n = await Ze(e.appConfig);
            for (; 1 === n.authToken.requestStatus; )
              await Re(100), (n = await Ze(e.appConfig));
            const i = n.authToken;
            return 0 === i.requestStatus ? Ye(e, t) : i;
          })(e, t)),
          i
        );
      {
        if (!navigator.onLine) throw Ae.create("app-offline");
        const t = (function (e) {
          const t = { requestStatus: 1, requestTime: Date.now() };
          return Object.assign(Object.assign({}, e), { authToken: t });
        })(i);
        return (
          (n = (async function (e, t) {
            try {
              const n = await Xe(e, t),
                i = Object.assign(Object.assign({}, t), { authToken: n });
              return await qe(e.appConfig, i), n;
            } catch (n) {
              if (
                !Le(n) ||
                (401 !== n.customData.serverCode &&
                  404 !== n.customData.serverCode)
              ) {
                const n = Object.assign(Object.assign({}, t), {
                  authToken: { requestStatus: 0 },
                });
                await qe(e.appConfig, n);
              } else await Ge(e.appConfig);
              throw n;
            }
          })(e, t)),
          t
        );
      }
    });
    return n ? await n : i.authToken;
  }
  function Ze(e) {
    return We(e, (e) => {
      if (!et(e)) throw Ae.create("not-registered");
      return 1 === (t = e.authToken).requestStatus &&
        t.requestTime + 1e4 < Date.now()
        ? Object.assign(Object.assign({}, e), {
            authToken: { requestStatus: 0 },
          })
        : e;
      var t;
    });
  }
  function et(e) {
    return void 0 !== e && 2 === e.registrationStatus;
  }
  function tt(e) {
    return Ae.create("missing-app-config-values", { valueName: e });
  }
  const nt = "installations";
  ce(
    new S(
      nt,
      (e) => {
        const t = e.getProvider("app").getImmediate(),
          n = (function (e) {
            if (!e || !e.options) throw tt("App Configuration");
            if (!e.name) throw tt("App Name");
            const t = ["projectId", "apiKey", "appId"];
            for (const n of t) if (!e.options[n]) throw tt(n);
            return {
              appName: e.name,
              projectId: e.options.projectId,
              apiKey: e.options.apiKey,
              appId: e.options.appId,
            };
          })(t);
        return {
          app: t,
          appConfig: n,
          heartbeatServiceProvider: le(t, "heartbeat"),
          _delete: () => Promise.resolve(),
        };
      },
      "PUBLIC"
    )
  ),
    ce(
      new S(
        "installations-internal",
        (e) => {
          const t = le(e.getProvider("app").getImmediate(), nt).getImmediate();
          return {
            getId: () =>
              (async function (e) {
                const t = e,
                  { installationEntry: n, registrationPromise: i } = await ze(
                    t
                  );
                return (
                  i ? i.catch(console.error) : Ye(t).catch(console.error), n.fid
                );
              })(t),
            getToken: (e) =>
              (async function (e, t = !1) {
                const n = e;
                return (
                  await (async function (e) {
                    const { registrationPromise: t } = await ze(e);
                    t && (await t);
                  })(n),
                  (await Ye(n, t)).token
                );
              })(t, e),
          };
        },
        "PRIVATE"
      )
    ),
    pe(Be, Se),
    pe(Be, Se, "esm2017");
  const it = "analytics",
    st = "https://www.googletagmanager.com/gtag/js",
    ot = new N("@firebase/analytics");
  function at(e) {
    return Promise.all(e.map((e) => e.catch((e) => e)));
  }
  const rt = new v("analytics", "Analytics", {
      "already-exists":
        "A Firebase Analytics instance with the appId {$id}  already exists. Only one Firebase Analytics instance can be created for each appId.",
      "already-initialized":
        "initializeAnalytics() cannot be called again with different options than those it was initially called with. It can be called again with the same options to return the existing instance, or getAnalytics() can be used to get a reference to the already-intialized instance.",
      "already-initialized-settings":
        "Firebase Analytics has already been initialized.settings() must be called before initializing any Analytics instanceor it will have no effect.",
      "interop-component-reg-failed":
        "Firebase Analytics Interop Component failed to instantiate: {$reason}",
      "invalid-analytics-context":
        "Firebase Analytics is not supported in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}",
      "indexeddb-unavailable":
        "IndexedDB unavailable or restricted in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}",
      "fetch-throttle":
        "The config fetch request timed out while in an exponential backoff state. Unix timestamp in milliseconds when fetch request throttling ends: {$throttleEndTimeMillis}.",
      "config-fetch-failed":
        "Dynamic config fetch failed: [{$httpStatus}] {$responseMessage}",
      "no-api-key":
        'The "apiKey" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid API key.',
      "no-app-id":
        'The "appId" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid app ID.',
    }),
    ct = new (class {
      constructor(e = {}, t = 1e3) {
        (this.throttleMetadata = e), (this.intervalMillis = t);
      }
      getThrottleMetadata(e) {
        return this.throttleMetadata[e];
      }
      setThrottleMetadata(e, t) {
        this.throttleMetadata[e] = t;
      }
      deleteThrottleMetadata(e) {
        delete this.throttleMetadata[e];
      }
    })();
  function lt(e) {
    return new Headers({ Accept: "application/json", "x-goog-api-key": e });
  }
  async function ut(e, t = ct, n) {
    const { appId: i, apiKey: s, measurementId: o } = e.options;
    if (!i) throw rt.create("no-app-id");
    if (!s) {
      if (o) return { measurementId: o, appId: i };
      throw rt.create("no-api-key");
    }
    const a = t.getThrottleMetadata(i) || {
        backoffCount: 0,
        throttleEndTimeMillis: Date.now(),
      },
      r = new ht();
    return (
      setTimeout(
        async () => {
          r.abort();
        },
        void 0 !== n ? n : 6e4
      ),
      dt({ appId: i, apiKey: s, measurementId: o }, a, r, t)
    );
  }
  async function dt(
    e,
    { throttleEndTimeMillis: t, backoffCount: n },
    i,
    s = ct
  ) {
    var o, a;
    const { appId: r, measurementId: c } = e;
    try {
      await (function (e, t) {
        return new Promise((n, i) => {
          const s = Math.max(t - Date.now(), 0),
            o = setTimeout(n, s);
          e.addEventListener(() => {
            clearTimeout(o),
              i(rt.create("fetch-throttle", { throttleEndTimeMillis: t }));
          });
        });
      })(i, t);
    } catch (e) {
      if (c)
        return (
          ot.warn(
            `Timed out fetching this Firebase app's measurement ID from the server. Falling back to the measurement ID ${c} provided in the "measurementId" field in the local Firebase config. [${
              null === (o = e) || void 0 === o ? void 0 : o.message
            }]`
          ),
          { appId: r, measurementId: c }
        );
      throw e;
    }
    try {
      const t = await (async function (e) {
        var t;
        const { appId: n, apiKey: i } = e,
          s = { method: "GET", headers: lt(i) },
          o =
            "https://firebase.googleapis.com/v1alpha/projects/-/apps/{app-id}/webConfig".replace(
              "{app-id}",
              n
            ),
          a = await fetch(o, s);
        if (200 !== a.status && 304 !== a.status) {
          let e = "";
          try {
            const n = await a.json();
            (null === (t = n.error) || void 0 === t ? void 0 : t.message) &&
              (e = n.error.message);
          } catch (e) {}
          throw rt.create("config-fetch-failed", {
            httpStatus: a.status,
            responseMessage: e,
          });
        }
        return a.json();
      })(e);
      return s.deleteThrottleMetadata(r), t;
    } catch (t) {
      const o = t;
      if (
        !(function (e) {
          if (!(e instanceof b && e.customData)) return !1;
          const t = Number(e.customData.httpStatus);
          return 429 === t || 500 === t || 503 === t || 504 === t;
        })(o)
      ) {
        if ((s.deleteThrottleMetadata(r), c))
          return (
            ot.warn(
              `Failed to fetch this Firebase app's measurement ID from the server. Falling back to the measurement ID ${c} provided in the "measurementId" field in the local Firebase config. [${
                null == o ? void 0 : o.message
              }]`
            ),
            { appId: r, measurementId: c }
          );
        throw t;
      }
      const l =
          503 ===
          Number(
            null === (a = null == o ? void 0 : o.customData) || void 0 === a
              ? void 0
              : a.httpStatus
          )
            ? k(n, s.intervalMillis, 30)
            : k(n, s.intervalMillis),
        u = { throttleEndTimeMillis: Date.now() + l, backoffCount: n + 1 };
      return (
        s.setThrottleMetadata(r, u),
        ot.debug(`Calling attemptFetch again in ${l} millis`),
        dt(e, u, i, s)
      );
    }
  }
  class ht {
    constructor() {
      this.listeners = [];
    }
    addEventListener(e) {
      this.listeners.push(e);
    }
    abort() {
      this.listeners.forEach((e) => e());
    }
  }
  let pt, gt;
  async function ft(e, t, n, i, s, o, a) {
    var r;
    const c = ut(e);
    c
      .then((t) => {
        (n[t.measurementId] = t.appId),
          e.options.measurementId &&
            t.measurementId !== e.options.measurementId &&
            ot.warn(
              `The measurement ID in the local Firebase config (${e.options.measurementId}) does not match the measurement ID fetched from the server (${t.measurementId}). To ensure analytics events are always sent to the correct Analytics property, update the measurement ID field in the local config or remove it from the local config.`
            );
      })
      .catch((e) => ot.error(e)),
      t.push(c);
    const l = (async function () {
        var e;
        if (!p())
          return (
            ot.warn(
              rt.create("indexeddb-unavailable", {
                errorInfo: "IndexedDB is not available in this environment.",
              }).message
            ),
            !1
          );
        try {
          await g();
        } catch (t) {
          return (
            ot.warn(
              rt.create("indexeddb-unavailable", {
                errorInfo:
                  null === (e = t) || void 0 === e ? void 0 : e.toString(),
              }).message
            ),
            !1
          );
        }
        return !0;
      })().then((e) => (e ? i.getId() : void 0)),
      [u, d] = await Promise.all([c, l]);
    (function (e) {
      const t = window.document.getElementsByTagName("script");
      for (const n of Object.values(t))
        if (n.src && n.src.includes(st) && n.src.includes(e)) return n;
      return null;
    })(o) ||
      (function (e, t) {
        const n = document.createElement("script");
        (n.src = `${st}?l=${e}&id=${t}`),
          (n.async = !0),
          document.head.appendChild(n);
      })(o, u.measurementId),
      gt && (s("consent", "default", gt), (gt = void 0)),
      s("js", new Date());
    const h =
      null !== (r = null == a ? void 0 : a.config) && void 0 !== r ? r : {};
    return (
      (h.origin = "firebase"),
      (h.update = !0),
      null != d && (h.firebase_id = d),
      s("config", u.measurementId, h),
      pt && (s("set", pt), (pt = void 0)),
      u.measurementId
    );
  }
  class mt {
    constructor(e) {
      this.app = e;
    }
    _delete() {
      return delete bt[this.app.options.appId], Promise.resolve();
    }
  }
  let bt = {},
    vt = [];
  const wt = {};
  let yt,
    It,
    kt = "dataLayer",
    Bt = !1;
  function St(e, t, n) {
    !(function () {
      const e = [];
      if (
        ((function () {
          const e =
            "object" == typeof chrome
              ? chrome.runtime
              : "object" == typeof browser
              ? browser.runtime
              : void 0;
          return "object" == typeof e && void 0 !== e.id;
        })() && e.push("This is a browser extension environment."),
        ("undefined" != typeof navigator && navigator.cookieEnabled) ||
          e.push("Cookies are not available."),
        e.length > 0)
      ) {
        const t = e.map((e, t) => `(${t + 1}) ${e}`).join(" "),
          n = rt.create("invalid-analytics-context", { errorInfo: t });
        ot.warn(n.message);
      }
    })();
    const i = e.options.appId;
    if (!i) throw rt.create("no-app-id");
    if (!e.options.apiKey) {
      if (!e.options.measurementId) throw rt.create("no-api-key");
      ot.warn(
        `The "apiKey" field is empty in the local Firebase config. This is needed to fetch the latest measurement ID for this Firebase app. Falling back to the measurement ID ${e.options.measurementId} provided in the "measurementId" field in the local Firebase config.`
      );
    }
    if (null != bt[i]) throw rt.create("already-exists", { id: i });
    if (!Bt) {
      !(function (e) {
        let t = [];
        Array.isArray(window.dataLayer)
          ? (t = window.dataLayer)
          : (window.dataLayer = t);
      })();
      const { wrappedGtag: e, gtagCore: t } = (function (e, t, n, i, s) {
        let o = function (...e) {
          window.dataLayer.push(arguments);
        };
        return (
          window.gtag && "function" == typeof window.gtag && (o = window.gtag),
          (window.gtag = (function (e, t, n, i) {
            return async function (s, o, a) {
              try {
                "event" === s
                  ? await (async function (e, t, n, i, s) {
                      try {
                        let o = [];
                        if (s && s.send_to) {
                          let e = s.send_to;
                          Array.isArray(e) || (e = [e]);
                          const i = await at(n);
                          for (const n of e) {
                            const e = i.find((e) => e.measurementId === n),
                              s = e && t[e.appId];
                            if (!s) {
                              o = [];
                              break;
                            }
                            o.push(s);
                          }
                        }
                        0 === o.length && (o = Object.values(t)),
                          await Promise.all(o),
                          e("event", i, s || {});
                      } catch (e) {
                        ot.error(e);
                      }
                    })(e, t, n, o, a)
                  : "config" === s
                  ? await (async function (e, t, n, i, s, o) {
                      const a = i[s];
                      try {
                        if (a) await t[a];
                        else {
                          const e = (await at(n)).find(
                            (e) => e.measurementId === s
                          );
                          e && (await t[e.appId]);
                        }
                      } catch (e) {
                        ot.error(e);
                      }
                      e("config", s, o);
                    })(e, t, n, i, o, a)
                  : "consent" === s
                  ? e("consent", "update", a)
                  : e("set", o);
              } catch (e) {
                ot.error(e);
              }
            };
          })(o, e, t, n)),
          { gtagCore: o, wrappedGtag: window.gtag }
        );
      })(bt, vt, wt);
      (It = e), (yt = t), (Bt = !0);
    }
    return (bt[i] = ft(e, vt, wt, t, yt, kt, n)), new mt(e);
  }
  function Ct(e, t, n, i) {
    (e = B(e)),
      (async function (e, t, n, i, s) {
        if (s && s.global) e("event", n, i);
        else {
          const s = await t;
          e("event", n, Object.assign(Object.assign({}, i), { send_to: s }));
        }
      })(It, bt[e.app.options.appId], t, n, i).catch((e) => ot.error(e));
  }
  const At = "@firebase/analytics",
    Lt = "0.8.3";
  ce(
    new S(
      it,
      (e, { options: t }) =>
        St(
          e.getProvider("app").getImmediate(),
          e.getProvider("installations-internal").getImmediate(),
          t
        ),
      "PUBLIC"
    )
  ),
    ce(
      new S(
        "analytics-internal",
        function (e) {
          try {
            const t = e.getProvider(it).getImmediate();
            return { logEvent: (e, n, i) => Ct(t, e, n, i) };
          } catch (e) {
            throw rt.create("interop-component-reg-failed", { reason: e });
          }
        },
        "PRIVATE"
      )
    ),
    pe(At, Lt),
    pe(At, Lt, "esm2017");
  class Mt {
    constructor() {}
    static getInstance() {
      return Mt.instance || (Mt.instance = new Mt()), Mt.instance;
    }
    static setAssessmentType(e) {
      Mt.assessmentType = e;
    }
    static getLocation() {
      console.log("starting to get location"),
        fetch("https://ipinfo.io/json?token=b6268727178610")
          .then((e) => {
            if ((console.log("got location response"), !e.ok))
              throw Error(e.statusText);
            return e.json();
          })
          .then((e) => {
            console.log(e), (Mt.latlong = e.loc);
            var t = Mt.latlong.split(","),
              n = parseFloat(t[0]).toFixed(2),
              i = parseFloat(t[1]).toFixed(1);
            return (
              (Mt.clat = n),
              (Mt.clon = i),
              (Mt.latlong = ""),
              (t = []),
              Mt.sendLocation(),
              {}
            );
          })
          .catch((e) => {
            console.warn(
              `location failed to update! encountered error ${e.msg}`
            );
          });
    }
    static linkAnalytics(e, t) {
      (Mt.gana = e), (Mt.dataURL = t);
    }
    static setUuid(e, t) {
      (Mt.uuid = e), (Mt.userSource = t);
    }
    static sendInit(e, t) {
      (Mt.appVersion = e), (Mt.contentVersion = t), Mt.getLocation();
      var n = "user " + Mt.uuid + " opened the assessment";
      console.log(n), Ct(Mt.gana, "opened", {});
    }
    static getAppLanguageFromDataURL(e) {
      if (e && "" !== e && e.includes("-")) {
        let t = e.split("-").slice(0, -1).join("-");
        return t.includes("west-african") ? "west-african-english" : t;
      }
      return "NotAvailable";
    }
    static getAppTypeFromDataURL(e) {
      return e && "" !== e && e.includes("-")
        ? e.substring(e.lastIndexOf("-") + 1)
        : "NotAvailable";
    }
    static sendLocation() {
      var e =
        "Sending User coordinates: " +
        Mt.uuid +
        " : " +
        Mt.clat +
        ", " +
        Mt.clon;
      console.log(e),
        Ct(Mt.gana, "user_location", {
          user: Mt.uuid,
          lang: Mt.getAppLanguageFromDataURL(Mt.dataURL),
          app: Mt.getAppTypeFromDataURL(Mt.dataURL),
          latlong: Mt.joinLatLong(Mt.clat, Mt.clon),
        }),
        console.log("INITIALIZED EVENT SENT"),
        console.log(
          "App Language: " + Mt.getAppLanguageFromDataURL(Mt.dataURL)
        ),
        console.log("App Type: " + Mt.getAppTypeFromDataURL(Mt.dataURL)),
        console.log("App Version: " + Mt.appVersion),
        console.log("Content Version: " + Mt.contentVersion),
        Ct(Mt.gana, "initialized", {
          type: "initialized",
          clUserId: Mt.uuid,
          userSource: Mt.userSource,
          latLong: Mt.joinLatLong(Mt.clat, Mt.clon),
          appVersion: Mt.appVersion,
          contentVersion: Mt.contentVersion,
          app: Mt.getAppTypeFromDataURL(Mt.dataURL),
          lang: Mt.getAppLanguageFromDataURL(Mt.dataURL),
        });
    }
    static sendAnswered(e, t, n) {
      var i = e.answers[t - 1],
        s = null,
        o = null;
      "correct" in e && null != e.correct && (s = e.correct == i.answerName),
        "bucket" in e && (o = e.bucket);
      var a =
        "user " + Mt.uuid + " answered " + e.qName + " with " + i.answerName;
      a += ", all answers were [";
      var r = "";
      for (var c in e.answers)
        (a += e.answers[c].answerName + ","),
          (r += e.answers[c].answerName + ",");
      (a += "] "),
        (a += s),
        (a += o),
        console.log(a),
        console.log("Answered App Version: " + Mt.appVersion),
        console.log("Content Version: " + Mt.contentVersion),
        Ct(Mt.gana, "answered", {
          type: "answered",
          clUserId: Mt.uuid,
          userSource: Mt.userSource,
          latLong: Mt.joinLatLong(Mt.clat, Mt.clon),
          app: Mt.getAppTypeFromDataURL(Mt.dataURL),
          lang: Mt.getAppLanguageFromDataURL(Mt.dataURL),
          dt: n,
          question_number: e.qNumber,
          target: e.qTarget,
          question: e.promptText,
          selected_answer: i.answerName,
          iscorrect: s,
          options: r,
          bucket: o,
          appVersion: Mt.appVersion,
          contentVersion: Mt.contentVersion,
        });
    }
    static sendBucket(e, t) {
      var n = e.bucketID,
        i = e.numTried,
        s = e.numCorrect,
        o =
          "user " +
          Mt.uuid +
          " finished the bucket " +
          n +
          " with " +
          s +
          " correct answers out of " +
          i +
          " tried and passed: " +
          t;
      console.log(o),
        console.log("Bucket Completed App Version: " + Mt.appVersion),
        console.log("Content Version: " + Mt.contentVersion),
        Ct(Mt.gana, "bucketCompleted", {
          type: "bucketCompleted",
          clUserId: Mt.uuid,
          userSource: Mt.userSource,
          latLong: Mt.joinLatLong(Mt.clat, Mt.clon),
          app: Mt.getAppTypeFromDataURL(Mt.dataURL),
          lang: Mt.getAppLanguageFromDataURL(Mt.dataURL),
          bucketNumber: n,
          numberTriedInBucket: i,
          numberCorrectInBucket: s,
          passedBucket: t,
          appVersion: Mt.appVersion,
          contentVersion: Mt.contentVersion,
        });
    }
    static sendFinished(e = null, t, n) {
      let i = "user " + Mt.uuid + " finished the assessment";
      console.log(i);
      let s = Mt.getBasalBucketID(e),
        o = Mt.getCeilingBucketID(e);
      0 == s && (s = o);
      let a = Mt.calculateScore(e, s);
      const r = 100 * e.length;
      console.log("Sending completed event"),
        console.log("Score: " + a),
        console.log("Max Score: " + r),
        console.log("Basal Bucket: " + s),
        console.log("BASAL FROM ASSESSMENT: " + t),
        console.log("Ceiling Bucket: " + o),
        console.log("CEILING FROM ASSESSMENT: " + n),
        console.log("Completed App Version: " + Mt.appVersion),
        console.log("Content Version: " + Mt.contentVersion),
        Mt.sendDataToThirdParty(a, Mt.uuid),
        window.parent &&
          window.parent.postMessage(
            { type: "assessment_completed", score: a },
            "https://synapse.curiouscontent.org/"
          ),
        Ct(Mt.gana, "completed", {
          type: "completed",
          clUserId: Mt.uuid,
          userSource: Mt.userSource,
          app: Mt.getAppTypeFromDataURL(Mt.dataURL),
          lang: Mt.getAppLanguageFromDataURL(Mt.dataURL),
          latLong: Mt.joinLatLong(Mt.clat, Mt.clon),
          score: a,
          maxScore: r,
          basalBucket: s,
          ceilingBucket: o,
          appVersion: Mt.appVersion,
          contentVersion: Mt.contentVersion,
        });
    }
    static sendDataToThirdParty(e, t) {
      console.log("Attempting to send score to a third party! Score: ", e);
      const n = new URLSearchParams(window.location.search),
        i = n.get("endpoint"),
        s = (n.get("organization"), new XMLHttpRequest());
      if (!i) return void console.error("No target party URL found!");
      const o = {
          user: t,
          page: "111108121363615",
          event: {
            type: "external",
            value: {
              type: "assessment",
              subType: Mt.assessmentType,
              score: e,
              completed: !0,
            },
          },
        },
        a = JSON.stringify(o);
      try {
        s.open("POST", i, !0),
          s.setRequestHeader("Content-Type", "application/json"),
          (s.onload = function () {
            s.status >= 200 && s.status < 300
              ? console.log("POST success!" + s.responseText)
              : console.error("Request failed with status: " + s.status);
          }),
          s.send(a);
      } catch (e) {
        console.error("Failed to send data to target party: ", e);
      }
    }
    static calculateScore(e, t) {
      console.log("Calculating score"), console.log(e);
      let n = 0;
      console.log("Basal Bucket ID: " + t);
      let i = 0;
      for (const n in e) {
        const s = e[n];
        if (s.bucketID == t) {
          i = s.numCorrect;
          break;
        }
      }
      return (
        console.log(
          "Num Correct: " + i,
          " basal: " + t,
          " buckets: " + e.length
        ),
        t === e.length && i >= 4
          ? (console.log("Perfect score"), 100 * e.length)
          : ((n = 0 | Math.round(100 * (t - 1) + (i / 5) * 100)), n)
      );
    }
    static getBasalBucketID(e) {
      let t = 0;
      for (const n in e) {
        const i = e[n];
        i.tested && !i.passed && (0 == t || i.bucketID < t) && (t = i.bucketID);
      }
      return t;
    }
    static getCeilingBucketID(e) {
      let t = 0;
      for (const n in e) {
        const i = e[n];
        i.tested && i.passed && (0 == t || i.bucketID > t) && (t = i.bucketID);
      }
      return t;
    }
    static joinLatLong(e, t) {
      return e + "," + t;
    }
  }
  class Et {
    constructor() {
      (this.devModeAvailable = !1),
        (this.isInDevMode = !1),
        (this.isCorrectLabelShown = !1),
        (this.isBucketInfoShown = !1),
        (this.isBucketControlsEnabled = !1),
        (this.animationSpeedMultiplier = 1),
        (this.devModeToggleButtonContainerId =
          "devModeModalToggleButtonContainer"),
        (this.devModeToggleButtonId = "devModeModalToggleButton"),
        (this.devModeModalId = "devModeSettingsModal"),
        (this.devModeBucketGenSelectId = "devModeBucketGenSelect"),
        (this.devModeCorrectLabelShownCheckboxId =
          "devModeCorrectLabelShownCheckbox"),
        (this.devModeBucketInfoShownCheckboxId =
          "devModeBucketInfoShownCheckbox"),
        (this.devModeBucketInfoContainerId = "devModeBucketInfoContainer"),
        (this.devModeBucketControlsShownCheckboxId =
          "devModeBucketControlsShownCheckbox"),
        (this.devModeAnimationSpeedMultiplierRangeId =
          "devModeAnimationSpeedMultiplierRange"),
        (this.devModeAnimationSpeedMultiplierValueId =
          "devModeAnimationSpeedMultiplierValue"),
        (this.toggleDevModeModal = () => {
          "block" == this.devModeSettingsModal.style.display
            ? (this.devModeSettingsModal.style.display = "none")
            : (this.devModeSettingsModal.style.display = "block");
        }),
        (this.isInDevMode =
          window.location.href.includes("localhost") ||
          window.location.href.includes("127.0.0.1") ||
          window.location.href.includes("assessmentdev")),
        (this.devModeToggleButtonContainer = document.getElementById(
          this.devModeToggleButtonContainerId
        )),
        (this.devModeSettingsModal = document.getElementById(
          this.devModeModalId
        )),
        (this.devModeBucketGenSelect = document.getElementById(
          this.devModeBucketGenSelectId
        )),
        (this.devModeBucketGenSelect.onchange = (e) => {
          this.handleBucketGenModeChange(e);
        }),
        (this.devModeToggleButton = document.getElementById(
          this.devModeToggleButtonId
        )),
        (this.devModeToggleButton.onclick = this.toggleDevModeModal),
        (this.devModeCorrectLabelShownCheckbox = document.getElementById(
          this.devModeCorrectLabelShownCheckboxId
        )),
        (this.devModeCorrectLabelShownCheckbox.onchange = () => {
          (this.isCorrectLabelShown =
            this.devModeCorrectLabelShownCheckbox.checked),
            this.handleCorrectLabelShownChange();
        }),
        (this.devModeBucketInfoShownCheckbox = document.getElementById(
          this.devModeBucketInfoShownCheckboxId
        )),
        (this.devModeBucketInfoShownCheckbox.onchange = () => {
          (this.isBucketInfoShown =
            this.devModeBucketInfoShownCheckbox.checked),
            (this.devModeBucketInfoContainer.style.display = this
              .isBucketInfoShown
              ? "block"
              : "none"),
            this.handleBucketInfoShownChange();
        }),
        (this.devModeBucketControlsShownCheckbox = document.getElementById(
          this.devModeBucketControlsShownCheckboxId
        )),
        (this.devModeBucketControlsShownCheckbox.onchange = () => {
          (this.isBucketControlsEnabled =
            this.devModeBucketControlsShownCheckbox.checked),
            this.handleBucketControlsShownChange();
        }),
        (this.devModeBucketInfoContainer = document.getElementById(
          this.devModeBucketInfoContainerId
        )),
        (this.devModeAnimationSpeedMultiplierRange = document.getElementById(
          this.devModeAnimationSpeedMultiplierRangeId
        )),
        (this.devModeAnimationSpeedMultiplierValue = document.getElementById(
          this.devModeAnimationSpeedMultiplierValueId
        )),
        (this.devModeAnimationSpeedMultiplierRange.onchange = () => {
          (this.animationSpeedMultiplier = parseFloat(
            this.devModeAnimationSpeedMultiplierRange.value
          )),
            this.animationSpeedMultiplier < 0.2 &&
              ((this.animationSpeedMultiplier = 0.2),
              (this.devModeAnimationSpeedMultiplierRange.value = "0.2")),
            (this.devModeAnimationSpeedMultiplierValue.innerText =
              this.animationSpeedMultiplier.toString()),
            this.handleAnimationSpeedMultiplierChange();
        }),
        this.isInDevMode
          ? (this.devModeToggleButtonContainer.style.display = "block")
          : (this.devModeToggleButtonContainer.style.display = "none"),
        (this.animationSpeedMultiplier = parseFloat(
          this.devModeAnimationSpeedMultiplierRange.value
        ));
    }
    hideDevModeButton() {
      this.devModeToggleButtonContainer.style.display = "none";
    }
    onEnd() {
      l.ShowEnd(), this.app.unityBridge.SendClose();
    }
  }
  class Tt extends Et {
    constructor(e, t) {
      super(),
        (this.handleBucketGenModeChange = () => {
          console.log("Bucket Gen Mode Changed");
        }),
        (this.handleCorrectLabelShownChange = () => {
          console.log("Correct Label Shown Changed");
        }),
        (this.handleBucketInfoShownChange = () => {
          console.log("Bucket Info Shown Changed");
        }),
        (this.handleBucketControlsShownChange = () => {
          console.log("Bucket Controls Shown Changed");
        }),
        (this.startSurvey = () => {
          l.ReadyForNext(this.buildNewQuestion());
        }),
        (this.onQuestionEnd = () => {
          l.SetFeedbackVisibile(!1, !1),
            (this.currentQuestionIndex += 1),
            setTimeout(() => {
              this.HasQuestionsLeft()
                ? l.ReadyForNext(this.buildNewQuestion())
                : (console.log("There are no questions left."), this.onEnd());
            }, 500);
        }),
        (this.handleAnswerButtonPress = (e, t) => {
          Mt.sendAnswered(this.questionsData[this.currentQuestionIndex], e, t),
            l.SetFeedbackVisibile(!0, !0),
            l.AddStar(),
            setTimeout(() => {
              this.onQuestionEnd();
            }, 2e3);
        }),
        (this.buildQuestionList = () =>
          (function (e) {
            return i(this, void 0, void 0, function* () {
              return o(e).then((e) => e.questions);
            });
          })(this.app.dataURL)),
        console.log("Survey initialized"),
        (this.dataURL = e),
        (this.unityBridge = t),
        (this.currentQuestionIndex = 0),
        l.SetButtonPressAction(this.handleAnswerButtonPress),
        l.SetStartAction(this.startSurvey);
    }
    handleAnimationSpeedMultiplierChange() {
      console.log("Animation Speed Multiplier Changed");
    }
    Run(e) {
      return (
        (t = this),
        (n = void 0),
        (s = function* () {
          (this.app = e),
            this.buildQuestionList().then((e) => {
              (this.questionsData = e),
                a.PrepareAudioAndImagesForSurvey(
                  this.questionsData,
                  this.app.GetDataURL()
                ),
                this.unityBridge.SendLoaded();
            });
        }),
        new ((i = void 0) || (i = Promise))(function (e, o) {
          function a(e) {
            try {
              c(s.next(e));
            } catch (e) {
              o(e);
            }
          }
          function r(e) {
            try {
              c(s.throw(e));
            } catch (e) {
              o(e);
            }
          }
          function c(t) {
            var n;
            t.done
              ? e(t.value)
              : ((n = t.value),
                n instanceof i
                  ? n
                  : new i(function (e) {
                      e(n);
                    })).then(a, r);
          }
          c((s = s.apply(t, n || [])).next());
        })
      );
      var t, n, i, s;
    }
    HasQuestionsLeft() {
      return this.currentQuestionIndex <= this.questionsData.length - 1;
    }
    buildNewQuestion() {
      return this.questionsData[this.currentQuestionIndex];
    }
  }
  class Dt {
    constructor(e) {
      (this.value = e), (this.left = null), (this.right = null);
    }
  }
  function xt(e, t, n) {
    if (e > t) return null;
    let i;
    if ((e + t) % 2 == 0 && 1 !== n.size) {
      if (((i = Math.floor((e + t) / 2)), 0 === i)) return null;
    } else
      do {
        (i = Math.floor((e + t) / 2)), (i += Math.floor(2 * Math.random()));
      } while (i > t || n.has(i));
    n.add(i);
    let s = new Dt(i);
    return (s.left = xt(e, i - 1, n)), (s.right = xt(i + 1, t, n)), s;
  }
  var Rt, _t;
  !(function (e) {
    (e[(e.BinarySearch = 0)] = "BinarySearch"),
      (e[(e.LinearSearchUp = 1)] = "LinearSearchUp"),
      (e[(e.LinearSearchDown = 2)] = "LinearSearchDown");
  })(Rt || (Rt = {})),
    (function (e) {
      (e[(e.RandomBST = 0)] = "RandomBST"),
        (e[(e.LinearArrayBased = 1)] = "LinearArrayBased");
    })(_t || (_t = {}));
  class Nt extends Et {
    constructor(e, t) {
      super(),
        (this.bucketGenMode = _t.RandomBST),
        (this.MAX_STARS_COUNT_IN_LINEAR_MODE = 20),
        (this.generateDevModeBucketControlsInContainer = (e, t) => {
          if (this.isInDevMode && this.bucketGenMode === _t.LinearArrayBased) {
            e.innerHTML = "";
            for (let t = 0; t < this.currentBucket.items.length; t++) {
              let n = this.currentBucket.items[t],
                i = document.createElement("button"),
                s = t;
              (i.innerText = n.itemName),
                (i.style.margin = "2px"),
                (i.onclick = () => {
                  (this.currentLinearTargetIndex = s),
                    (this.currentBucket.usedItems = []),
                    console.log(
                      "Clicked on item " +
                        n.itemName +
                        " at index " +
                        this.currentLinearTargetIndex
                    );
                  const e = this.buildNewQuestion();
                  l.getInstance().answersContainer.style.visibility = "hidden";
                  for (let e in l.getInstance().buttons)
                    l.getInstance().buttons[e].style.visibility = "hidden";
                  (l.getInstance().shown = !1),
                    (l.getInstance().nextQuestion = e),
                    (l.getInstance().questionsContainer.innerHTML = ""),
                    (l.getInstance().questionsContainer.style.display = "none"),
                    l.ShowQuestion(e),
                    a.PlayAudio(
                      this.buildNewQuestion().promptAudio,
                      l.getInstance().showOptions,
                      l.ShowAudioAnimation
                    );
                }),
                e.append(i);
            }
            let t = document.createElement("button");
            (t.innerText = "Prev Bucket"),
              0 == this.currentLinearBucketIndex && (t.disabled = !0),
              t.addEventListener("click", () => {
                this.currentLinearBucketIndex > 0 &&
                  (this.currentLinearBucketIndex--,
                  (this.currentLinearTargetIndex = 0),
                  this.tryMoveBucket(!1),
                  l.ReadyForNext(this.buildNewQuestion()),
                  this.updateBucketInfo()),
                  0 == this.currentLinearBucketIndex && (t.disabled = !0);
              });
            let n = document.createElement("button");
            (n.innerText = "Next Bucket"),
              this.currentLinearBucketIndex == this.buckets.length - 1 &&
                (n.disabled = !0),
              n.addEventListener("click", () => {
                this.currentLinearBucketIndex < this.buckets.length - 1 &&
                  (this.currentLinearBucketIndex++,
                  (this.currentLinearTargetIndex = 0),
                  this.tryMoveBucket(!1),
                  l.ReadyForNext(this.buildNewQuestion()),
                  this.updateBucketInfo());
              });
            let i = document.createElement("div");
            (i.style.display = "flex"),
              (i.style.flexDirection = "row"),
              (i.style.justifyContent = "center"),
              (i.style.alignItems = "center"),
              i.appendChild(t),
              i.appendChild(n),
              e.appendChild(i);
          }
        }),
        (this.updateBucketInfo = () => {
          null != this.currentBucket &&
            (this.devModeBucketInfoContainer.innerHTML = `Bucket: ${this.currentBucket.bucketID}<br/>Correct: ${this.currentBucket.numCorrect}<br/>Tried: ${this.currentBucket.numTried}<br/>Failed: ${this.currentBucket.numConsecutiveWrong}`);
        }),
        (this.startAssessment = () => {
          l.ReadyForNext(this.buildNewQuestion()),
            this.isInDevMode && this.hideDevModeButton();
        }),
        (this.buildBuckets = (e) => {
          return (
            (t = this),
            (n = void 0),
            (a = function* () {
              if (void 0 === this.buckets || 0 === this.buckets.length) {
                const e = (function (e) {
                  return i(this, void 0, void 0, function* () {
                    return o(e).then((e) => e.buckets);
                  });
                })(this.app.GetDataURL()).then((e) => {
                  (this.buckets = e),
                    (this.numBuckets = e.length),
                    console.log("buckets: " + this.buckets),
                    (this.bucketArray = Array.from(
                      Array(this.numBuckets),
                      (e, t) => t + 1
                    )),
                    console.log("empty array " + this.bucketArray);
                  let t = new Set();
                  t.add(0);
                  let n = xt(
                      this.buckets[0].bucketID - 1,
                      this.buckets[this.buckets.length - 1].bucketID,
                      t
                    ),
                    i = this.convertToBucketBST(n, this.buckets);
                  console.log(
                    "Generated the buckets root ----------------------------------------------"
                  ),
                    console.log(i),
                    (this.basalBucket = this.numBuckets + 1),
                    (this.ceilingBucket = -1),
                    (this.currentNode = i),
                    this.tryMoveBucket(!1);
                });
                return e;
              }
              return e === _t.RandomBST
                ? new Promise((e, t) => {
                    let n = new Set();
                    n.add(0);
                    let i = xt(
                        this.buckets[0].bucketID - 1,
                        this.buckets[this.buckets.length - 1].bucketID,
                        n
                      ),
                      s = this.convertToBucketBST(i, this.buckets);
                    console.log(
                      "Generated the buckets root ----------------------------------------------"
                    ),
                      console.log(s),
                      (this.basalBucket = this.numBuckets + 1),
                      (this.ceilingBucket = -1),
                      (this.currentNode = s),
                      this.tryMoveBucket(!1),
                      e();
                  })
                : e === _t.LinearArrayBased
                ? new Promise((e, t) => {
                    (this.currentLinearBucketIndex = 0),
                      (this.currentLinearTargetIndex = 0),
                      this.tryMoveBucket(!1),
                      e();
                  })
                : void 0;
            }),
            new ((s = void 0) || (s = Promise))(function (e, i) {
              function o(e) {
                try {
                  c(a.next(e));
                } catch (e) {
                  i(e);
                }
              }
              function r(e) {
                try {
                  c(a.throw(e));
                } catch (e) {
                  i(e);
                }
              }
              function c(t) {
                var n;
                t.done
                  ? e(t.value)
                  : ((n = t.value),
                    n instanceof s
                      ? n
                      : new s(function (e) {
                          e(n);
                        })).then(o, r);
              }
              c((a = a.apply(t, n || [])).next());
            })
          );
          var t, n, s, a;
        }),
        (this.convertToBucketBST = (e, t) => {
          if (null === e) return e;
          let n = e.value;
          return (
            (e.value = t.find((e) => e.bucketID === n)),
            null !== e.left && (e.left = this.convertToBucketBST(e.left, t)),
            null !== e.right && (e.right = this.convertToBucketBST(e.right, t)),
            e
          );
        }),
        (this.initBucket = (e) => {
          (this.currentBucket = e),
            (this.currentBucket.usedItems = []),
            (this.currentBucket.numTried = 0),
            (this.currentBucket.numCorrect = 0),
            (this.currentBucket.numConsecutiveWrong = 0),
            (this.currentBucket.tested = !0),
            (this.currentBucket.passed = !1);
        }),
        (this.handleAnswerButtonPress = (e, t) => {
          this.bucketGenMode === _t.RandomBST &&
            Mt.sendAnswered(this.currentQuestion, e, t),
            this.updateCurrentBucketValuesAfterAnswering(e),
            this.updateFeedbackAfterAnswer(e),
            setTimeout(() => {
              console.log("Completed first Timeout"), this.onQuestionEnd();
            }, 2e3 * this.animationSpeedMultiplier);
        }),
        (this.onQuestionEnd = () => {
          let e = this.HasQuestionsLeft()
            ? 500 * this.animationSpeedMultiplier
            : 4e3 * this.animationSpeedMultiplier;
          const t = () => {
            if (
              (l.SetFeedbackVisibile(!1, !1),
              ((this.bucketGenMode === _t.LinearArrayBased &&
                l.getInstance().shownStarsCount <
                  this.MAX_STARS_COUNT_IN_LINEAR_MODE) ||
                this.bucketGenMode === _t.RandomBST) &&
                l.ChangeStarImageAfterAnimation(),
              this.HasQuestionsLeft())
            ) {
              if (
                this.bucketGenMode === _t.LinearArrayBased &&
                !this.isBucketControlsEnabled &&
                (this.currentLinearTargetIndex <
                  this.buckets[this.currentLinearBucketIndex].items.length &&
                  (this.currentLinearTargetIndex++,
                  (this.currentBucket.usedItems = [])),
                this.currentLinearTargetIndex >=
                  this.buckets[this.currentLinearBucketIndex].items.length &&
                  this.currentLinearBucketIndex < this.buckets.length)
              ) {
                if (
                  (this.currentLinearBucketIndex++,
                  (this.currentLinearTargetIndex = 0),
                  !(this.currentLinearBucketIndex < this.buckets.length))
                )
                  return console.log("No questions left"), void this.onEnd();
                this.tryMoveBucket(!1);
              }
              l.ReadyForNext(this.buildNewQuestion());
            } else console.log("No questions left"), this.onEnd();
          };
          new Promise((t) => {
            setTimeout(() => {
              t();
            }, e);
          }).then(() => {
            t(), this.isInDevMode && this.updateBucketInfo();
          });
        }),
        (this.buildNewQuestion = () => {
          if (this.isLinearArrayExhausted()) return null;
          const e = this.selectTargetItem(),
            t = this.generateFoils(e),
            n = this.shuffleAnswerOptions([e, ...t]),
            i = this.createQuestion(e, n);
          return (this.currentQuestion = i), (this.questionNumber += 1), i;
        }),
        (this.isLinearArrayExhausted = () =>
          this.bucketGenMode === _t.LinearArrayBased &&
          this.currentLinearTargetIndex >=
            this.buckets[this.currentLinearBucketIndex].items.length),
        (this.selectTargetItem = () => {
          let e;
          return (
            this.bucketGenMode === _t.RandomBST
              ? (e = this.selectRandomUnusedItem())
              : this.bucketGenMode === _t.LinearArrayBased &&
                ((e =
                  this.buckets[this.currentLinearBucketIndex].items[
                    this.currentLinearTargetIndex
                  ]),
                this.currentBucket.usedItems.push(e)),
            e
          );
        }),
        (this.selectRandomUnusedItem = () => {
          let e;
          do {
            e = r(this.currentBucket.items);
          } while (this.currentBucket.usedItems.includes(e));
          return this.currentBucket.usedItems.push(e), e;
        }),
        (this.generateFoils = (e) => {
          let t, n, i;
          return (
            this.bucketGenMode === _t.RandomBST
              ? ((t = this.generateRandomFoil(e)),
                (n = this.generateRandomFoil(e, t)),
                (i = this.generateRandomFoil(e, t, n)))
              : this.bucketGenMode === _t.LinearArrayBased &&
                ((t = this.generateLinearFoil(e)),
                (n = this.generateLinearFoil(e, t)),
                (i = this.generateLinearFoil(e, t, n))),
            [t, n, i]
          );
        }),
        (this.generateRandomFoil = (e, ...t) => {
          let n;
          do {
            n = r(this.currentBucket.items);
          } while ([e, ...t].includes(n));
          return n;
        }),
        (this.generateLinearFoil = (e, ...t) => {
          let n;
          do {
            n = r(this.buckets[this.currentLinearBucketIndex].items);
          } while ([e, ...t].includes(n));
          return n;
        }),
        (this.shuffleAnswerOptions = (e) => (c(e), e)),
        (this.createQuestion = (e, t) => ({
          qName: `question-${this.questionNumber}-${e.itemName}`,
          qNumber: this.questionNumber,
          qTarget: e.itemName,
          promptText: "",
          bucket: this.currentBucket.bucketID,
          promptAudio: e.itemName,
          correct: e.itemText,
          answers: t.map((e) => ({
            answerName: e.itemName,
            answerText: e.itemText,
          })),
        })),
        (this.tryMoveBucket = (e) => {
          this.bucketGenMode === _t.RandomBST
            ? this.tryMoveBucketRandomBST(e)
            : this.bucketGenMode === _t.LinearArrayBased &&
              this.tryMoveBucketLinearArrayBased(e);
        }),
        (this.tryMoveBucketRandomBST = (e) => {
          const t = this.currentNode.value;
          null != this.currentBucket &&
            ((this.currentBucket.passed = e),
            Mt.sendBucket(this.currentBucket, e)),
            console.log("new  bucket is " + t.bucketID),
            a.PreloadBucket(t, this.app.GetDataURL()),
            this.initBucket(t);
        }),
        (this.tryMoveBucketLinearArrayBased = (e) => {
          const t = this.buckets[this.currentLinearBucketIndex];
          console.log("New Bucket: " + t.bucketID),
            a.PreloadBucket(t, this.app.GetDataURL()),
            this.initBucket(t);
        }),
        (this.HasQuestionsLeft = () =>
          !this.currentBucket.passed &&
          (this.bucketGenMode === _t.LinearArrayBased
            ? this.hasLinearQuestionsLeft()
            : this.currentBucket.numCorrect >= 4
            ? this.handlePassedBucket()
            : !(
                this.currentBucket.numConsecutiveWrong >= 2 ||
                this.currentBucket.numTried >= 5
              ) || this.handleFailedBucket())),
        (this.hasLinearQuestionsLeft = () =>
          !(
            this.currentLinearBucketIndex >= this.buckets.length &&
            this.currentLinearTargetIndex >=
              this.buckets[this.currentLinearBucketIndex].items.length
          )),
        (this.handlePassedBucket = () => (
          console.log("Passed this bucket " + this.currentBucket.bucketID),
          this.currentBucket.bucketID >= this.numBuckets
            ? this.passHighestBucket()
            : this.moveUpToNextBucket()
        )),
        (this.handleFailedBucket = () => (
          console.log("Failed this bucket " + this.currentBucket.bucketID),
          this.currentBucket.bucketID < this.basalBucket &&
            (this.basalBucket = this.currentBucket.bucketID),
          this.currentBucket.bucketID <= 1
            ? this.failLowestBucket()
            : this.moveDownToPreviousBucket()
        )),
        (this.passHighestBucket = () => (
          console.log("Passed highest bucket"),
          (this.currentBucket.passed = !0),
          this.bucketGenMode === _t.RandomBST &&
            Mt.sendBucket(this.currentBucket, !0),
          l.ProgressChest(),
          !1
        )),
        (this.moveUpToNextBucket = () =>
          null == this.currentNode.right
            ? (console.log("Reached root node"),
              (this.currentBucket.passed = !0),
              this.bucketGenMode === _t.RandomBST &&
                Mt.sendBucket(this.currentBucket, !0),
              l.ProgressChest(),
              !1)
            : (console.log("Moving to right node"),
              this.bucketGenMode === _t.RandomBST
                ? (this.currentNode = this.currentNode.right)
                : this.currentLinearBucketIndex++,
              this.tryMoveBucket(!0),
              !0)),
        (this.failLowestBucket = () => (
          console.log("Failed lowest bucket !"),
          (this.currentBucket.passed = !1),
          this.bucketGenMode === _t.RandomBST &&
            Mt.sendBucket(this.currentBucket, !1),
          !1
        )),
        (this.moveDownToPreviousBucket = () => (
          console.log("Moving down bucket !"),
          null == this.currentNode.left
            ? (console.log("Reached root node !"),
              (this.currentBucket.passed = !1),
              this.bucketGenMode === _t.RandomBST &&
                Mt.sendBucket(this.currentBucket, !1),
              !1)
            : (console.log("Moving to left node"),
              this.bucketGenMode === _t.RandomBST
                ? (this.currentNode = this.currentNode.left)
                : this.currentLinearBucketIndex++,
              this.tryMoveBucket(!1),
              !0)
        )),
        (this.dataURL = e),
        (this.unityBridge = t),
        (this.questionNumber = 0),
        console.log("app initialized"),
        this.setupUIHandlers();
    }
    setupUIHandlers() {
      l.SetButtonPressAction(this.handleAnswerButtonPress),
        l.SetStartAction(this.startAssessment),
        this.hideDevModeButton();
    }
    Run(e) {
      (this.app = e),
        this.buildBuckets(this.bucketGenMode).then((e) => {
          console.log(this.currentBucket), this.unityBridge.SendLoaded();
        });
    }
    handleBucketGenModeChange(e) {
      (this.bucketGenMode = parseInt(this.devModeBucketGenSelect.value)),
        this.buildBuckets(this.bucketGenMode).then(() => {}),
        this.updateBucketInfo();
    }
    handleCorrectLabelShownChange() {
      l.getInstance().SetCorrectLabelVisibility(this.isCorrectLabelShown);
    }
    handleAnimationSpeedMultiplierChange() {
      l.getInstance().SetAnimationSpeedMultiplier(
        this.animationSpeedMultiplier
      );
    }
    handleBucketInfoShownChange() {
      this.updateBucketInfo();
    }
    handleBucketControlsShownChange() {
      l.getInstance().SetBucketControlsVisibility(this.isBucketControlsEnabled);
    }
    updateFeedbackAfterAnswer(e) {
      ((this.bucketGenMode === _t.LinearArrayBased &&
        l.getInstance().shownStarsCount <
          this.MAX_STARS_COUNT_IN_LINEAR_MODE) ||
        this.bucketGenMode === _t.RandomBST) &&
        l.AddStar(),
        l.SetFeedbackVisibile(
          !0,
          this.currentQuestion.answers[e - 1].answerName ==
            this.currentQuestion.correct
        );
    }
    updateCurrentBucketValuesAfterAnswering(e) {
      (this.currentBucket.numTried += 1),
        this.currentQuestion.answers[e - 1].answerName ==
        this.currentQuestion.correct
          ? ((this.currentBucket.numCorrect += 1),
            (this.currentBucket.numConsecutiveWrong = 0),
            console.log("Answered correctly"))
          : ((this.currentBucket.numConsecutiveWrong += 1),
            console.log(
              "Answered incorrectly, " + this.currentBucket.numConsecutiveWrong
            ));
    }
    onEnd() {
      Mt.sendFinished(this.buckets, this.basalBucket, this.ceilingBucket),
        l.ShowEnd(),
        this.app.unityBridge.SendClose();
    }
  }
  class Pt {
    constructor() {
      "undefined" != typeof Unity
        ? (this.unityReference = Unity)
        : (this.unityReference = null);
    }
    SendMessage(e) {
      null !== this.unityReference && this.unityReference.call(e);
    }
    SendLoaded() {
      null !== this.unityReference
        ? this.unityReference.call("loaded")
        : console.log("would call Unity loaded now");
    }
    SendClose() {
      null !== this.unityReference
        ? this.unityReference.call("close")
        : console.log("would close Unity now");
    }
  }
  pe("firebase", "9.12.1", "app");
  try {
    self["workbox:window:7.0.0"] && _();
  } catch (Ft) {}
  function Ft(e, t) {
    return new Promise(function (n) {
      var i = new MessageChannel();
      (i.port1.onmessage = function (e) {
        n(e.data);
      }),
        e.postMessage(t, [i.port2]);
    });
  }
  function Ut(e, t) {
    (null == t || t > e.length) && (t = e.length);
    for (var n = 0, i = new Array(t); n < t; n++) i[n] = e[n];
    return i;
  }
  function Ot(e, t) {
    var n;
    if ("undefined" == typeof Symbol || null == e[Symbol.iterator]) {
      if (
        Array.isArray(e) ||
        (n = (function (e, t) {
          if (e) {
            if ("string" == typeof e) return Ut(e, t);
            var n = Object.prototype.toString.call(e).slice(8, -1);
            return (
              "Object" === n && e.constructor && (n = e.constructor.name),
              "Map" === n || "Set" === n
                ? Array.from(e)
                : "Arguments" === n ||
                  /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
                ? Ut(e, t)
                : void 0
            );
          }
        })(e)) ||
        (t && e && "number" == typeof e.length)
      ) {
        n && (e = n);
        var i = 0;
        return function () {
          return i >= e.length ? { done: !0 } : { done: !1, value: e[i++] };
        };
      }
      throw new TypeError(
        "Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
      );
    }
    return (n = e[Symbol.iterator]()).next.bind(n);
  }
  try {
    self["workbox:core:7.0.0"] && _();
  } catch (Ft) {}
  var jt = function () {
    var e = this;
    this.promise = new Promise(function (t, n) {
      (e.resolve = t), (e.reject = n);
    });
  };
  function Vt(e, t) {
    var n = location.href;
    return new URL(e, n).href === new URL(t, n).href;
  }
  var $t = function (e, t) {
    (this.type = e), Object.assign(this, t);
  };
  function Ht(e, t, n) {
    return n
      ? t
        ? t(e)
        : e
      : ((e && e.then) || (e = Promise.resolve(e)), t ? e.then(t) : e);
  }
  function qt() {}
  var Gt = { type: "SKIP_WAITING" };
  function Wt(e, t) {
    if (!t) return e && e.then ? e.then(qt) : Promise.resolve();
  }
  var zt = (function (e) {
    var t, n;
    function i(t, n) {
      var i, s;
      return (
        void 0 === n && (n = {}),
        ((i = e.call(this) || this).nn = {}),
        (i.tn = 0),
        (i.rn = new jt()),
        (i.en = new jt()),
        (i.on = new jt()),
        (i.un = 0),
        (i.an = new Set()),
        (i.cn = function () {
          var e = i.fn,
            t = e.installing;
          i.tn > 0 ||
          !Vt(t.scriptURL, i.sn.toString()) ||
          performance.now() > i.un + 6e4
            ? ((i.vn = t), e.removeEventListener("updatefound", i.cn))
            : ((i.hn = t), i.an.add(t), i.rn.resolve(t)),
            ++i.tn,
            t.addEventListener("statechange", i.ln);
        }),
        (i.ln = function (e) {
          var t = i.fn,
            n = e.target,
            s = n.state,
            o = n === i.vn,
            a = { sw: n, isExternal: o, originalEvent: e };
          !o && i.mn && (a.isUpdate = !0),
            i.dispatchEvent(new $t(s, a)),
            "installed" === s
              ? (i.wn = self.setTimeout(function () {
                  "installed" === s &&
                    t.waiting === n &&
                    i.dispatchEvent(new $t("waiting", a));
                }, 200))
              : "activating" === s &&
                (clearTimeout(i.wn), o || i.en.resolve(n));
        }),
        (i.dn = function (e) {
          var t = i.hn,
            n = t !== navigator.serviceWorker.controller;
          i.dispatchEvent(
            new $t("controlling", {
              isExternal: n,
              originalEvent: e,
              sw: t,
              isUpdate: i.mn,
            })
          ),
            n || i.on.resolve(t);
        }),
        (i.gn =
          ((s = function (e) {
            var t = e.data,
              n = e.ports,
              s = e.source;
            return Ht(i.getSW(), function () {
              i.an.has(s) &&
                i.dispatchEvent(
                  new $t("message", {
                    data: t,
                    originalEvent: e,
                    ports: n,
                    sw: s,
                  })
                );
            });
          }),
          function () {
            for (var e = [], t = 0; t < arguments.length; t++)
              e[t] = arguments[t];
            try {
              return Promise.resolve(s.apply(this, e));
            } catch (e) {
              return Promise.reject(e);
            }
          })),
        (i.sn = t),
        (i.nn = n),
        navigator.serviceWorker.addEventListener("message", i.gn),
        i
      );
    }
    (n = e),
      ((t = i).prototype = Object.create(n.prototype)),
      (t.prototype.constructor = t),
      (t.__proto__ = n);
    var s,
      o = i.prototype;
    return (
      (o.register = function (e) {
        var t = (void 0 === e ? {} : e).immediate,
          n = void 0 !== t && t;
        try {
          var i = this;
          return (function (e, t) {
            var n = e();
            return n && n.then ? n.then(t) : t();
          })(
            function () {
              if (!n && "complete" !== document.readyState)
                return Wt(
                  new Promise(function (e) {
                    return window.addEventListener("load", e);
                  })
                );
            },
            function () {
              return (
                (i.mn = Boolean(navigator.serviceWorker.controller)),
                (i.yn = i.pn()),
                Ht(i.bn(), function (e) {
                  (i.fn = e),
                    i.yn &&
                      ((i.hn = i.yn),
                      i.en.resolve(i.yn),
                      i.on.resolve(i.yn),
                      i.yn.addEventListener("statechange", i.ln, { once: !0 }));
                  var t = i.fn.waiting;
                  return (
                    t &&
                      Vt(t.scriptURL, i.sn.toString()) &&
                      ((i.hn = t),
                      Promise.resolve()
                        .then(function () {
                          i.dispatchEvent(
                            new $t("waiting", {
                              sw: t,
                              wasWaitingBeforeRegister: !0,
                            })
                          );
                        })
                        .then(function () {})),
                    i.hn && (i.rn.resolve(i.hn), i.an.add(i.hn)),
                    i.fn.addEventListener("updatefound", i.cn),
                    navigator.serviceWorker.addEventListener(
                      "controllerchange",
                      i.dn
                    ),
                    i.fn
                  );
                })
              );
            }
          );
        } catch (e) {
          return Promise.reject(e);
        }
      }),
      (o.update = function () {
        try {
          return this.fn ? Wt(this.fn.update()) : void 0;
        } catch (e) {
          return Promise.reject(e);
        }
      }),
      (o.getSW = function () {
        return void 0 !== this.hn ? Promise.resolve(this.hn) : this.rn.promise;
      }),
      (o.messageSW = function (e) {
        try {
          return Ht(this.getSW(), function (t) {
            return Ft(t, e);
          });
        } catch (e) {
          return Promise.reject(e);
        }
      }),
      (o.messageSkipWaiting = function () {
        this.fn && this.fn.waiting && Ft(this.fn.waiting, Gt);
      }),
      (o.pn = function () {
        var e = navigator.serviceWorker.controller;
        return e && Vt(e.scriptURL, this.sn.toString()) ? e : void 0;
      }),
      (o.bn = function () {
        try {
          var e = this;
          return (function (e, t) {
            try {
              var n = e();
            } catch (e) {
              return t(e);
            }
            return n && n.then ? n.then(void 0, t) : n;
          })(
            function () {
              return Ht(
                navigator.serviceWorker.register(e.sn, e.nn),
                function (t) {
                  return (e.un = performance.now()), t;
                }
              );
            },
            function (e) {
              throw e;
            }
          );
        } catch (e) {
          return Promise.reject(e);
        }
      }),
      (s = [
        {
          key: "active",
          get: function () {
            return this.en.promise;
          },
        },
        {
          key: "controlling",
          get: function () {
            return this.on.promise;
          },
        },
      ]) &&
        (function (e, t) {
          for (var n = 0; n < t.length; n++) {
            var i = t[n];
            (i.enumerable = i.enumerable || !1),
              (i.configurable = !0),
              "value" in i && (i.writable = !0),
              Object.defineProperty(e, i.key, i);
          }
        })(i.prototype, s),
      i
    );
  })(
    (function () {
      function e() {
        this.Pn = new Map();
      }
      var t = e.prototype;
      return (
        (t.addEventListener = function (e, t) {
          this.Sn(e).add(t);
        }),
        (t.removeEventListener = function (e, t) {
          this.Sn(e).delete(t);
        }),
        (t.dispatchEvent = function (e) {
          e.target = this;
          for (var t, n = Ot(this.Sn(e.type)); !(t = n()).done; )
            (0, t.value)(e);
        }),
        (t.Sn = function (e) {
          return this.Pn.has(e) || this.Pn.set(e, new Set()), this.Pn.get(e);
        }),
        e
      );
    })()
  );
  var Qt = function (e, t, n, i) {
    return new (n || (n = Promise))(function (s, o) {
      function a(e) {
        try {
          c(i.next(e));
        } catch (e) {
          o(e);
        }
      }
      function r(e) {
        try {
          c(i.throw(e));
        } catch (e) {
          o(e);
        }
      }
      function c(e) {
        var t;
        e.done
          ? s(e.value)
          : ((t = e.value),
            t instanceof n
              ? t
              : new n(function (e) {
                  e(t);
                })).then(a, r);
      }
      c((i = i.apply(e, t || [])).next());
    });
  };
  let Kt = "",
    Jt = document.getElementById("loadingScreen");
  const Xt = document.getElementById("progressBar"),
    Yt = new BroadcastChannel("as-message-channel");
  function Zt(e) {
    "Loading" == e.data.msg &&
      (function (e, t) {
        t < 40 && t >= 10
          ? (Xt.style.width = t + "%")
          : t >= 100 &&
            ((Xt.style.width = "100%"),
            setTimeout(() => {
              (Jt.style.display = "none"), l.SetContentLoaded(!0);
            }, 1500),
            localStorage.setItem(e.data.data.bookName, "true"),
            (function (e) {
              if (window.Android) {
                let t = null !== localStorage.getItem(e);
                window.Android.cachedStatus(t);
              }
            })(e.data.data.bookName));
      })(e, parseInt(e.data.data.progress)),
      "UpdateFound" == e.data.msg &&
        (console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>.,update Found"), en());
  }
  function en() {
    let e = "Update Found.\nPlease accept the update by pressing Ok.";
    1 == confirm(e)
      ? window.location.reload()
      : (e = "Update will happen on the next launch.");
  }
  Yt.addEventListener("message", Zt);
  const tn = new (class {
    constructor() {
      (this.lang = "english"),
        (this.unityBridge = new Pt()),
        console.log("Initializing app..."),
        (this.dataURL = t()),
        (this.cacheModel = new (class {
          constructor(e, t, n) {
            (this.appName = e),
              (this.contentFilePath = t),
              (this.audioVisualResources = n);
          }
          setAppName(e) {
            this.appName = e;
          }
          setContentFilePath(e) {
            this.contentFilePath = e;
          }
          setAudioVisualResources(e) {
            this.audioVisualResources = e;
          }
          addItemToAudioVisualResources(e) {
            this.audioVisualResources.has(e) ||
              this.audioVisualResources.add(e);
          }
        })(this.dataURL, this.dataURL, new Set()));
      const e = (function (
        e = (function (e = "[DEFAULT]") {
          const t = oe.get(e);
          if (!t && e === ie) return he();
          if (!t) throw ue.create("no-app", { appName: e });
          return t;
        })()
      ) {
        const t = le((e = B(e)), it);
        return t.isInitialized()
          ? t.getImmediate()
          : (function (e, t = {}) {
              const n = le(e, it);
              if (n.isInitialized()) {
                const e = n.getImmediate();
                if (y(t, n.getOptions())) return e;
                throw rt.create("already-initialized");
              }
              return n.initialize({ options: t });
            })(e);
      })(
        he({
          apiKey: "AIzaSyB8c2lBVi26u7YRL9sxOP97Uaq3yN8hTl4",
          authDomain: "ftm-b9d99.firebaseapp.com",
          databaseURL: "https://ftm-b9d99.firebaseio.com",
          projectId: "ftm-b9d99",
          storageBucket: "ftm-b9d99.appspot.com",
          messagingSenderId: "602402387941",
          appId: "1:602402387941:web:7b1b1181864d28b49de10c",
          measurementId: "G-FF1159TGCF",
        })
      );
      (this.analytics = e),
        Ct(e, "notification_received"),
        Ct(e, "test initialization event", {}),
        console.log("firebase initialized");
    }
    spinUp() {
      return Qt(this, void 0, void 0, function* () {
        window.addEventListener("load", () => {
          console.log("Window Loaded!"),
            (() => {
              Qt(this, void 0, void 0, function* () {
                yield (function (e) {
                  return i(this, void 0, void 0, function* () {
                    return o(e).then((e) => e);
                  });
                })(this.dataURL).then((e) => {
                  console.log("Assessment/Survey v1.1.3 initializing!"),
                    console.log("App data loaded!"),
                    console.log(e),
                    this.cacheModel.setContentFilePath(s(this.dataURL)),
                    l.SetFeedbackText(e.feedbackText);
                  let t = e.appType,
                    i = e.assessmentType;
                  if ("survey" == t)
                    this.game = new Tt(this.dataURL, this.unityBridge);
                  else if ("assessment" == t) {
                    let t = e.buckets;
                    for (let n = 0; n < t.length; n++)
                      for (let i = 0; i < t[n].items.length; i++) {
                        let s;
                        (s =
                          e.quizName.includes("Luganda") ||
                          e.quizName
                            .toLowerCase()
                            .includes("west african english")
                            ? "/audio/" +
                              this.dataURL +
                              "/" +
                              t[n].items[i].itemName.toLowerCase().trim() +
                              ".mp3"
                            : "/audio/" +
                              this.dataURL +
                              "/" +
                              t[n].items[i].itemName.trim() +
                              ".mp3"),
                          this.cacheModel.addItemToAudioVisualResources(s);
                      }
                    this.cacheModel.addItemToAudioVisualResources(
                      "/audio/" + this.dataURL + "/answer_feedback.mp3"
                    ),
                      (this.game = new Nt(this.dataURL, this.unityBridge));
                  }
                  var o;
                  (this.game.unityBridge = this.unityBridge),
                    Mt.setUuid(
                      (null == (o = n().get("cr_user_id")) &&
                        (console.log("no uuid provided"), (o = "WebUserNoID")),
                      o),
                      (function () {
                        var e = n().get("userSource");
                        return (
                          null == e &&
                            (console.log("no user source provided"),
                            (e = "WebUserNoSource")),
                          e
                        );
                      })()
                    ),
                    Mt.linkAnalytics(this.analytics, this.dataURL),
                    Mt.setAssessmentType(i),
                    (Kt = e.contentVersion),
                    Mt.sendInit("v1.1.3", e.contentVersion),
                    this.game.Run(this);
                }),
                  (Jt.style.display = "none"),
                  l.SetContentLoaded(!0);
              });
            })();
        });
      });
    }
    registerServiceWorker(e, t = "") {
      return Qt(this, void 0, void 0, function* () {
        console.log("Registering service worker..."),
          "serviceWorker" in navigator
            ? (new zt("./sw.js", {})
                .register()
                .then((e) => {
                  console.log("Service worker registered!"),
                    this.handleServiceWorkerRegistation(e);
                })
                .catch((e) => {
                  console.log("Service worker registration failed: " + e);
                }),
              navigator.serviceWorker.addEventListener("message", Zt),
              yield navigator.serviceWorker.ready,
              console.log("Cache Model: "),
              console.log(this.cacheModel),
              console.log("Checking for content version updates..." + t),
              fetch(
                this.cacheModel.contentFilePath +
                  "?cache-bust=" +
                  new Date().getTime(),
                {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                    "Cache-Control": "no-store",
                  },
                  cache: "no-store",
                }
              )
                .then((e) =>
                  Qt(this, void 0, void 0, function* () {
                    if (!e.ok)
                      return void console.error(
                        "Failed to fetch the content file from the server!"
                      );
                    const t = (yield e.json()).contentVersion;
                    console.log("No Cache Content version: " + t),
                      t &&
                        Kt != t &&
                        (console.log("Content version mismatch! Reloading..."),
                        localStorage.removeItem(this.cacheModel.appName),
                        caches.delete(this.cacheModel.appName),
                        en());
                  })
                )
                .catch((e) => {
                  console.error("Error fetching the content file: " + e);
                }),
              null == localStorage.getItem(this.cacheModel.appName)
                ? (console.log("Caching!" + this.cacheModel.appName),
                  (Jt.style.display = "flex"),
                  Yt.postMessage({
                    command: "Cache",
                    data: { appData: this.cacheModel },
                  }))
                : ((Xt.style.width = "100%"),
                  setTimeout(() => {
                    Jt.style.display = "none";
                  }, 1500)),
              (Yt.onmessage = (e) => {
                console.log(e.data.command + " received from service worker!"),
                  "Activated" == e.data.command &&
                    null == localStorage.getItem(this.cacheModel.appName) &&
                    Yt.postMessage({
                      command: "Cache",
                      data: { appData: this.cacheModel },
                    });
              }))
            : console.warn(
                "Service workers are not supported in this browser."
              );
      });
    }
    handleServiceWorkerRegistation(e) {
      var t;
      try {
        null === (t = null == e ? void 0 : e.installing) ||
          void 0 === t ||
          t.postMessage({ type: "Registartion", value: this.lang });
      } catch (e) {
        console.log("Service worker registration failed: " + e);
      }
    }
    GetDataURL() {
      return this.dataURL;
    }
  })();
  tn.spinUp();
})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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UyxRQUNUcHlCLEtBQU0sQ0FDSmdxQyxRQUFTbnBDLEtBQUtnbkMsZ0JBSWxCakIsR0FBYW44QixNQUFNczhCLE1BQVEsT0FDM0JuOEIsWUFBVyxLQUNUKzdCLEdBQWVsOEIsTUFBTW1CLFFBQVUsTUFBTSxHQUVwQyxPQUdMLEdBQWlCb2QsVUFBYXBKLElBQzVCeGYsUUFBUUMsSUFBSXVmLEVBQU01ZixLQUFLb3lCLFFBQVUsa0NBQ1AsYUFBdEJ4UyxFQUFNNWYsS0FBS295QixTQUEyRSxNQUFqRHJvQixhQUFhQyxRQUFRbkosS0FBS2duQyxXQUFXbmxCLFVBQzVFLEdBQWlCdUcsWUFBWSxDQUMzQm1KLFFBQVMsUUFDVHB5QixLQUFNLENBQ0pncUMsUUFBU25wQyxLQUFLZ25DLGdCQU10QnpuQyxRQUFRMEUsS0FBSyxxREFFakIsSUFFQTJrQywrQkFBK0JELFNBQzdCLElBQzBCLFFBQXhCLEVBQUFBLGFBQVksRUFBWkEsRUFBY3ZGLGtCQUFVLFNBQUVoYixZQUFZLENBQ3BDblMsS0FBTSxlQUNOcEksTUFBTzdOLEtBQUs0MEIsT0FFZCxNQUFPN0QsR0FDUHh4QixRQUFRQyxJQUFJLHVDQUF5Q3V4QixHQUV6RCxDQUVPbUwsYUFDTCxPQUFPbDhCLEtBQUtnQixPQUNkLEdBa0RGMmYsR0FBSW9uQiIsInNvdXJjZXMiOlsid2VicGFjazovL2Fzc2Vzc21lbnQtc3VydmV5LWpzL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2Fzc2Vzc21lbnQtc3VydmV5LWpzLy4vc3JjL3V0aWxzL3VybFV0aWxzLnRzIiwid2VicGFjazovL2Fzc2Vzc21lbnQtc3VydmV5LWpzL3dlYnBhY2svcnVudGltZS9nbG9iYWwiLCJ3ZWJwYWNrOi8vYXNzZXNzbWVudC1zdXJ2ZXktanMvLi9zcmMvdXRpbHMvanNvblV0aWxzLnRzIiwid2VicGFjazovL2Fzc2Vzc21lbnQtc3VydmV5LWpzLy4vc3JjL2NvbXBvbmVudHMvYXVkaW9Db250cm9sbGVyLnRzIiwid2VicGFjazovL2Fzc2Vzc21lbnQtc3VydmV5LWpzLy4vc3JjL3V0aWxzL21hdGhVdGlscy50cyIsIndlYnBhY2s6Ly9hc3Nlc3NtZW50LXN1cnZleS1qcy8uL3NyYy91aS91aUNvbnRyb2xsZXIudHMiLCJ3ZWJwYWNrOi8vYXNzZXNzbWVudC1zdXJ2ZXktanMvLi9ub2RlX21vZHVsZXMvQGZpcmViYXNlL3V0aWwvZGlzdC9pbmRleC5lc20yMDE3LmpzIiwid2VicGFjazovL2Fzc2Vzc21lbnQtc3VydmV5LWpzLy4vbm9kZV9tb2R1bGVzL0BmaXJlYmFzZS9jb21wb25lbnQvZGlzdC9lc20vaW5kZXguZXNtMjAxNy5qcyIsIndlYnBhY2s6Ly9hc3Nlc3NtZW50LXN1cnZleS1qcy8uL25vZGVfbW9kdWxlcy9AZmlyZWJhc2UvbG9nZ2VyL2Rpc3QvZXNtL2luZGV4LmVzbTIwMTcuanMiLCJ3ZWJwYWNrOi8vYXNzZXNzbWVudC1zdXJ2ZXktanMvLi9ub2RlX21vZHVsZXMvaWRiL2J1aWxkL3dyYXAtaWRiLXZhbHVlLmpzIiwid2VicGFjazovL2Fzc2Vzc21lbnQtc3VydmV5LWpzLy4vbm9kZV9tb2R1bGVzL2lkYi9idWlsZC9pbmRleC5qcyIsIndlYnBhY2s6Ly9hc3Nlc3NtZW50LXN1cnZleS1qcy8uL25vZGVfbW9kdWxlcy9AZmlyZWJhc2UvYXBwL2Rpc3QvZXNtL2luZGV4LmVzbTIwMTcuanMiLCJ3ZWJwYWNrOi8vYXNzZXNzbWVudC1zdXJ2ZXktanMvLi9ub2RlX21vZHVsZXMvQGZpcmViYXNlL2luc3RhbGxhdGlvbnMvZGlzdC9lc20vaW5kZXguZXNtMjAxNy5qcyIsIndlYnBhY2s6Ly9hc3Nlc3NtZW50LXN1cnZleS1qcy8uL25vZGVfbW9kdWxlcy9AZmlyZWJhc2UvYW5hbHl0aWNzL2Rpc3QvZXNtL2luZGV4LmVzbTIwMTcuanMiLCJ3ZWJwYWNrOi8vYXNzZXNzbWVudC1zdXJ2ZXktanMvLi9zcmMvYW5hbHl0aWNzL2FuYWx5dGljc0V2ZW50cy50cyIsIndlYnBhY2s6Ly9hc3Nlc3NtZW50LXN1cnZleS1qcy8uL3NyYy9iYXNlUXVpei50cyIsIndlYnBhY2s6Ly9hc3Nlc3NtZW50LXN1cnZleS1qcy8uL3NyYy9zdXJ2ZXkvc3VydmV5LnRzIiwid2VicGFjazovL2Fzc2Vzc21lbnQtc3VydmV5LWpzLy4vc3JjL2NvbXBvbmVudHMvdE5vZGUudHMiLCJ3ZWJwYWNrOi8vYXNzZXNzbWVudC1zdXJ2ZXktanMvLi9zcmMvYXNzZXNzbWVudC9hc3Nlc3NtZW50LnRzIiwid2VicGFjazovL2Fzc2Vzc21lbnQtc3VydmV5LWpzLy4vc3JjL3V0aWxzL3VuaXR5QnJpZGdlLnRzIiwid2VicGFjazovL2Fzc2Vzc21lbnQtc3VydmV5LWpzLy4vbm9kZV9tb2R1bGVzL2ZpcmViYXNlL2FwcC9kaXN0L2luZGV4LmVzbS5qcyIsIndlYnBhY2s6Ly9hc3Nlc3NtZW50LXN1cnZleS1qcy8uL25vZGVfbW9kdWxlcy93b3JrYm94LXdpbmRvdy9idWlsZC93b3JrYm94LXdpbmRvdy5wcm9kLmVzNS5tanMiLCJ3ZWJwYWNrOi8vYXNzZXNzbWVudC1zdXJ2ZXktanMvLi9zcmMvQXBwLnRzIiwid2VicGFjazovL2Fzc2Vzc21lbnQtc3VydmV5LWpzLy4vc3JjL2NvbXBvbmVudHMvY2FjaGVNb2RlbC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBUaGUgcmVxdWlyZSBzY29wZVxudmFyIF9fd2VicGFja19yZXF1aXJlX18gPSB7fTtcblxuIiwiLyoqXG4gKiBDb250YWlucyB1dGlscyBmb3Igd29ya2luZyB3aXRoIFVSTCBzdHJpbmdzLlxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRBcHBUeXBlKCk6IHN0cmluZyB7XG4gIGNvbnN0IHBhdGhQYXJhbXMgPSBnZXRQYXRoTmFtZSgpO1xuICBjb25zdCBhcHBUeXBlID0gcGF0aFBhcmFtcy5nZXQoJ2FwcFR5cGUnKTtcbiAgcmV0dXJuIGFwcFR5cGU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRVVUlEKCk6IHN0cmluZyB7XG4gIGNvbnN0IHBhdGhQYXJhbXMgPSBnZXRQYXRoTmFtZSgpO1xuICB2YXIgbnV1aWQgPSBwYXRoUGFyYW1zLmdldCgnY3JfdXNlcl9pZCcpO1xuICBpZiAobnV1aWQgPT0gdW5kZWZpbmVkKSB7XG4gICAgY29uc29sZS5sb2coJ25vIHV1aWQgcHJvdmlkZWQnKTtcbiAgICBudXVpZCA9ICdXZWJVc2VyTm9JRCc7XG4gIH1cbiAgcmV0dXJuIG51dWlkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VXNlclNvdXJjZSgpOiBzdHJpbmcge1xuICBjb25zdCBwYXRoUGFyYW1zID0gZ2V0UGF0aE5hbWUoKTtcbiAgdmFyIG51dWlkID0gcGF0aFBhcmFtcy5nZXQoJ3VzZXJTb3VyY2UnKTtcbiAgaWYgKG51dWlkID09IHVuZGVmaW5lZCkge1xuICAgIGNvbnNvbGUubG9nKCdubyB1c2VyIHNvdXJjZSBwcm92aWRlZCcpO1xuICAgIG51dWlkID0gJ1dlYlVzZXJOb1NvdXJjZSc7XG4gIH1cbiAgcmV0dXJuIG51dWlkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RGF0YUZpbGUoKTogc3RyaW5nIHtcbiAgY29uc3QgcGF0aFBhcmFtcyA9IGdldFBhdGhOYW1lKCk7XG4gIHZhciBkYXRhID0gcGF0aFBhcmFtcy5nZXQoJ2RhdGEnKTtcbiAgaWYgKGRhdGEgPT0gdW5kZWZpbmVkKSB7XG4gICAgY29uc29sZS5sb2coJ2RlZmF1bHQgZGF0YSBmaWxlJyk7XG4gICAgZGF0YSA9ICd6dWx1LWxldHRlcnNvdW5kcyc7XG4gICAgLy9kYXRhID0gXCJzdXJ2ZXktenVsdVwiO1xuICB9XG4gIHJldHVybiBkYXRhO1xufVxuXG5mdW5jdGlvbiBnZXRQYXRoTmFtZSgpIHtcbiAgY29uc3QgcXVlcnlTdHJpbmcgPSB3aW5kb3cubG9jYXRpb24uc2VhcmNoO1xuICBjb25zdCB1cmxQYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKHF1ZXJ5U3RyaW5nKTtcbiAgcmV0dXJuIHVybFBhcmFtcztcbn1cbiIsIl9fd2VicGFja19yZXF1aXJlX18uZyA9IChmdW5jdGlvbigpIHtcblx0aWYgKHR5cGVvZiBnbG9iYWxUaGlzID09PSAnb2JqZWN0JykgcmV0dXJuIGdsb2JhbFRoaXM7XG5cdHRyeSB7XG5cdFx0cmV0dXJuIHRoaXMgfHwgbmV3IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcpIHJldHVybiB3aW5kb3c7XG5cdH1cbn0pKCk7IiwiLyoqIEpzb24gVXRpbHMgKi9cblxuLy8gaW1wb3J0IHsgc2V0RmVlZGJhY2tUZXh0IH0gZnJvbSAnLi91aUNvbnRyb2xsZXInO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmV0Y2hBcHBEYXRhKHVybDogc3RyaW5nKSB7XG4gIHJldHVybiBsb2FkRGF0YSh1cmwpLnRoZW4oKGRhdGEpID0+IHtcbiAgICByZXR1cm4gZGF0YTtcbiAgfSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmZXRjaEFwcFR5cGUodXJsOiBzdHJpbmcpIHtcbiAgcmV0dXJuIGxvYWREYXRhKHVybCkudGhlbigoZGF0YSkgPT4ge1xuICAgIC8vIHNldEZlZWRiYWNrVGV4dChkYXRhW1wiZmVlZGJhY2tUZXh0XCJdKTtcbiAgICByZXR1cm4gZGF0YVsnYXBwVHlwZSddO1xuICB9KTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZldGNoRmVlZGJhY2sodXJsOiBzdHJpbmcpIHtcbiAgcmV0dXJuIGxvYWREYXRhKHVybCkudGhlbigoZGF0YSkgPT4ge1xuICAgIHJldHVybiBkYXRhWydmZWVkYmFja1RleHQnXTtcbiAgfSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmZXRjaFN1cnZleVF1ZXN0aW9ucyh1cmw6IHN0cmluZykge1xuICByZXR1cm4gbG9hZERhdGEodXJsKS50aGVuKChkYXRhKSA9PiB7XG4gICAgcmV0dXJuIGRhdGFbJ3F1ZXN0aW9ucyddO1xuICB9KTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZldGNoQXNzZXNzbWVudEJ1Y2tldHModXJsOiBzdHJpbmcpIHtcbiAgcmV0dXJuIGxvYWREYXRhKHVybCkudGhlbigoZGF0YSkgPT4ge1xuICAgIHJldHVybiBkYXRhWydidWNrZXRzJ107XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RGF0YVVSTCh1cmw6IHN0cmluZykge1xuICByZXR1cm4gJy9kYXRhLycgKyB1cmwgKyAnLmpzb24nO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q2FzZUluZGVwZW5kZW50TGFuZ0xpc3QoKSB7XG4gIHJldHVybiBbJ2x1Z2FuZGEnXTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gbG9hZERhdGEodXJsOiBzdHJpbmcpIHtcbiAgdmFyIGZ1cmwgPSBnZXREYXRhVVJMKHVybCk7XG4gIC8vIGNvbnNvbGUubG9nKGZ1cmwpO1xuICByZXR1cm4gZmV0Y2goZnVybCkudGhlbigocmVzcG9uc2UpID0+IHJlc3BvbnNlLmpzb24oKSk7XG59XG4iLCIvL2NvZGUgZm9yIGxvYWRpbmcgYXVkaW9zXG5cbmltcG9ydCB7IHFEYXRhIH0gZnJvbSAnLi9xdWVzdGlvbkRhdGEnO1xuaW1wb3J0IHsgYnVja2V0LCBidWNrZXRJdGVtIH0gZnJvbSAnLi4vYXNzZXNzbWVudC9idWNrZXREYXRhJztcbmltcG9ydCB7IGdldENhc2VJbmRlcGVuZGVudExhbmdMaXN0IH0gZnJvbSAnLi4vdXRpbHMvanNvblV0aWxzJztcblxuZXhwb3J0IGNsYXNzIEF1ZGlvQ29udHJvbGxlciB7XG4gIHByaXZhdGUgc3RhdGljIGluc3RhbmNlOiBBdWRpb0NvbnRyb2xsZXIgfCBudWxsID0gbnVsbDtcblxuICBwdWJsaWMgaW1hZ2VUb0NhY2hlOiBzdHJpbmdbXSA9IFtdO1xuICBwdWJsaWMgd2F2VG9DYWNoZTogc3RyaW5nW10gPSBbXTtcblxuICBwdWJsaWMgYWxsQXVkaW9zOiBhbnkgPSB7fTtcbiAgcHVibGljIGFsbEltYWdlczogYW55ID0ge307XG4gIHB1YmxpYyBkYXRhVVJMOiBzdHJpbmcgPSAnJztcblxuICBwcml2YXRlIGNvcnJlY3RTb3VuZFBhdGggPSAnZGlzdC9hdWRpby9Db3JyZWN0Lndhdic7XG5cbiAgcHJpdmF0ZSBmZWVkYmFja0F1ZGlvOiBhbnkgPSBudWxsO1xuICBwcml2YXRlIGNvcnJlY3RBdWRpbzogYW55ID0gbnVsbDtcblxuICBwcml2YXRlIGluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5mZWVkYmFja0F1ZGlvID0gbmV3IEF1ZGlvKCk7XG4gICAgdGhpcy5mZWVkYmFja0F1ZGlvLnNyYyA9IHRoaXMuY29ycmVjdFNvdW5kUGF0aDtcbiAgICB0aGlzLmNvcnJlY3RBdWRpbyA9IG5ldyBBdWRpbygpO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBQcmVwYXJlQXVkaW9BbmRJbWFnZXNGb3JTdXJ2ZXkocXVlc3Rpb25zRGF0YTogcURhdGFbXSwgZGF0YVVSTDogc3RyaW5nKTogdm9pZCB7XG4gICAgQXVkaW9Db250cm9sbGVyLmdldEluc3RhbmNlKCkuZGF0YVVSTCA9IGRhdGFVUkw7XG4gICAgY29uc3QgZmVlZGJhY2tTb3VuZFBhdGggPSAnYXVkaW8vJyArIEF1ZGlvQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLmRhdGFVUkwgKyAnL2Fuc3dlcl9mZWVkYmFjay5tcDMnO1xuXG4gICAgQXVkaW9Db250cm9sbGVyLmdldEluc3RhbmNlKCkud2F2VG9DYWNoZS5wdXNoKGZlZWRiYWNrU291bmRQYXRoKTtcbiAgICBBdWRpb0NvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5jb3JyZWN0QXVkaW8uc3JjID0gZmVlZGJhY2tTb3VuZFBhdGg7XG5cbiAgICBmb3IgKHZhciBxdWVzdGlvbkluZGV4IGluIHF1ZXN0aW9uc0RhdGEpIHtcbiAgICAgIGxldCBxdWVzdGlvbkRhdGEgPSBxdWVzdGlvbnNEYXRhW3F1ZXN0aW9uSW5kZXhdO1xuICAgICAgaWYgKHF1ZXN0aW9uRGF0YS5wcm9tcHRBdWRpbyAhPSBudWxsKSB7XG4gICAgICAgIEF1ZGlvQ29udHJvbGxlci5GaWx0ZXJBbmRBZGRBdWRpb1RvQWxsQXVkaW9zKHF1ZXN0aW9uRGF0YS5wcm9tcHRBdWRpby50b0xvd2VyQ2FzZSgpKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHF1ZXN0aW9uRGF0YS5wcm9tcHRJbWcgIT0gbnVsbCkge1xuICAgICAgICBBdWRpb0NvbnRyb2xsZXIuQWRkSW1hZ2VUb0FsbEltYWdlcyhxdWVzdGlvbkRhdGEucHJvbXB0SW1nKTtcbiAgICAgIH1cblxuICAgICAgZm9yICh2YXIgYW5zd2VySW5kZXggaW4gcXVlc3Rpb25EYXRhLmFuc3dlcnMpIHtcbiAgICAgICAgbGV0IGFuc3dlckRhdGEgPSBxdWVzdGlvbkRhdGEuYW5zd2Vyc1thbnN3ZXJJbmRleF07XG4gICAgICAgIGlmIChhbnN3ZXJEYXRhLmFuc3dlckltZyAhPSBudWxsKSB7XG4gICAgICAgICAgQXVkaW9Db250cm9sbGVyLkFkZEltYWdlVG9BbGxJbWFnZXMoYW5zd2VyRGF0YS5hbnN3ZXJJbWcpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKEF1ZGlvQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLmFsbEF1ZGlvcyk7XG4gICAgY29uc29sZS5sb2coQXVkaW9Db250cm9sbGVyLmdldEluc3RhbmNlKCkuYWxsSW1hZ2VzKTtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgQWRkSW1hZ2VUb0FsbEltYWdlcyhuZXdJbWFnZVVSTDogc3RyaW5nKTogdm9pZCB7XG4gICAgY29uc29sZS5sb2coJ0FkZCBpbWFnZTogJyArIG5ld0ltYWdlVVJMKTtcbiAgICBsZXQgbmV3SW1hZ2UgPSBuZXcgSW1hZ2UoKTtcbiAgICBuZXdJbWFnZS5zcmMgPSBuZXdJbWFnZVVSTDtcbiAgICBBdWRpb0NvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5hbGxJbWFnZXNbbmV3SW1hZ2VVUkxdID0gbmV3SW1hZ2U7XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIEZpbHRlckFuZEFkZEF1ZGlvVG9BbGxBdWRpb3MobmV3QXVkaW9VUkw6IHN0cmluZyk6IHZvaWQge1xuICAgIGNvbnNvbGUubG9nKCdBZGRpbmcgYXVkaW86ICcgKyBuZXdBdWRpb1VSTCk7XG4gICAgaWYgKG5ld0F1ZGlvVVJMLmluY2x1ZGVzKCcud2F2JykpIHtcbiAgICAgIG5ld0F1ZGlvVVJMID0gbmV3QXVkaW9VUkwucmVwbGFjZSgnLndhdicsICcubXAzJyk7XG4gICAgfSBlbHNlIGlmIChuZXdBdWRpb1VSTC5pbmNsdWRlcygnLm1wMycpKSB7XG4gICAgICAvLyBBbHJlYWR5IGNvbnRhaW5zIC5tcDMgbm90IGRvaW5nIGFueXRoaW5nXG4gICAgfSBlbHNlIHtcbiAgICAgIG5ld0F1ZGlvVVJMID0gbmV3QXVkaW9VUkwudHJpbSgpICsgJy5tcDMnO1xuICAgIH1cblxuICAgIGNvbnNvbGUubG9nKCdGaWx0ZXJlZDogJyArIG5ld0F1ZGlvVVJMKTtcblxuICAgIGxldCBuZXdBdWRpbyA9IG5ldyBBdWRpbygpO1xuICAgIGlmIChnZXRDYXNlSW5kZXBlbmRlbnRMYW5nTGlzdCgpLmluY2x1ZGVzKEF1ZGlvQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLmRhdGFVUkwuc3BsaXQoJy0nKVswXSkpIHtcbiAgICAgIG5ld0F1ZGlvLnNyYyA9ICdhdWRpby8nICsgQXVkaW9Db250cm9sbGVyLmdldEluc3RhbmNlKCkuZGF0YVVSTCArICcvJyArIG5ld0F1ZGlvVVJMO1xuICAgIH0gZWxzZSB7XG4gICAgICBuZXdBdWRpby5zcmMgPSAnYXVkaW8vJyArIEF1ZGlvQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLmRhdGFVUkwgKyAnLycgKyBuZXdBdWRpb1VSTDtcbiAgICB9XG5cbiAgICBBdWRpb0NvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5hbGxBdWRpb3NbbmV3QXVkaW9VUkxdID0gbmV3QXVkaW87XG5cbiAgICBjb25zb2xlLmxvZyhuZXdBdWRpby5zcmMpO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBQcmVsb2FkQnVja2V0KG5ld0J1Y2tldDogYnVja2V0LCBkYXRhVVJMKSB7XG4gICAgQXVkaW9Db250cm9sbGVyLmdldEluc3RhbmNlKCkuZGF0YVVSTCA9IGRhdGFVUkw7XG4gICAgQXVkaW9Db250cm9sbGVyLmdldEluc3RhbmNlKCkuY29ycmVjdEF1ZGlvLnNyYyA9XG4gICAgICAnYXVkaW8vJyArIEF1ZGlvQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLmRhdGFVUkwgKyAnL2Fuc3dlcl9mZWVkYmFjay5tcDMnO1xuICAgIGZvciAodmFyIGl0ZW1JbmRleCBpbiBuZXdCdWNrZXQuaXRlbXMpIHtcbiAgICAgIHZhciBpdGVtID0gbmV3QnVja2V0Lml0ZW1zW2l0ZW1JbmRleF07XG4gICAgICBBdWRpb0NvbnRyb2xsZXIuRmlsdGVyQW5kQWRkQXVkaW9Ub0FsbEF1ZGlvcyhpdGVtLml0ZW1OYW1lLnRvTG93ZXJDYXNlKCkpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgUGxheUF1ZGlvKGF1ZGlvTmFtZTogc3RyaW5nLCBmaW5pc2hlZENhbGxiYWNrPzogRnVuY3Rpb24sIGF1ZGlvQW5pbT86IEZ1bmN0aW9uKTogdm9pZCB7XG4gICAgYXVkaW9OYW1lID0gYXVkaW9OYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgY29uc29sZS5sb2coJ3RyeWluZyB0byBwbGF5ICcgKyBhdWRpb05hbWUpO1xuICAgIGlmIChhdWRpb05hbWUuaW5jbHVkZXMoJy5tcDMnKSkge1xuICAgICAgaWYgKGF1ZGlvTmFtZS5zbGljZSgtNCkgIT0gJy5tcDMnKSB7XG4gICAgICAgIGF1ZGlvTmFtZSA9IGF1ZGlvTmFtZS50cmltKCkgKyAnLm1wMyc7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGF1ZGlvTmFtZSA9IGF1ZGlvTmFtZS50cmltKCkgKyAnLm1wMyc7XG4gICAgfVxuXG4gICAgY29uc29sZS5sb2coJ1ByZSBwbGF5IGFsbCBhdWRpb3M6ICcpO1xuICAgIGNvbnNvbGUubG9nKEF1ZGlvQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLmFsbEF1ZGlvcyk7XG5cbiAgICBjb25zdCBwbGF5UHJvbWlzZSA9IG5ldyBQcm9taXNlPHZvaWQ+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IGF1ZGlvID0gQXVkaW9Db250cm9sbGVyLmdldEluc3RhbmNlKCkuYWxsQXVkaW9zW2F1ZGlvTmFtZV07XG4gICAgICBpZiAoYXVkaW8pIHtcbiAgICAgICAgYXVkaW8uYWRkRXZlbnRMaXN0ZW5lcigncGxheScsICgpID0+IHtcbiAgICAgICAgICB0eXBlb2YgYXVkaW9BbmltICE9PSAndW5kZWZpbmVkJyA/IGF1ZGlvQW5pbSh0cnVlKSA6IG51bGw7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGF1ZGlvLmFkZEV2ZW50TGlzdGVuZXIoJ2VuZGVkJywgKCkgPT4ge1xuICAgICAgICAgIHR5cGVvZiBhdWRpb0FuaW0gIT09ICd1bmRlZmluZWQnID8gYXVkaW9BbmltKGZhbHNlKSA6IG51bGw7XG4gICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBhdWRpby5wbGF5KCkuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgcGxheWluZyBhdWRpbzonLCBlcnJvcik7XG4gICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUud2FybignQXVkaW8gZmlsZSBub3QgZm91bmQ6JywgYXVkaW9OYW1lKTtcbiAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcGxheVByb21pc2VcbiAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgdHlwZW9mIGZpbmlzaGVkQ2FsbGJhY2sgIT09ICd1bmRlZmluZWQnID8gZmluaXNoZWRDYWxsYmFjaygpIDogbnVsbDtcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ1Byb21pc2UgZXJyb3I6JywgZXJyb3IpO1xuICAgICAgfSk7XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIEdldEltYWdlKGltYWdlTmFtZTogc3RyaW5nKTogYW55IHtcbiAgICByZXR1cm4gQXVkaW9Db250cm9sbGVyLmdldEluc3RhbmNlKCkuYWxsSW1hZ2VzW2ltYWdlTmFtZV07XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIFBsYXlEaW5nKCk6IHZvaWQge1xuICAgIEF1ZGlvQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLmZlZWRiYWNrQXVkaW8ucGxheSgpO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBQbGF5Q29ycmVjdCgpOiB2b2lkIHtcbiAgICBBdWRpb0NvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5jb3JyZWN0QXVkaW8ucGxheSgpO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBnZXRJbnN0YW5jZSgpOiBBdWRpb0NvbnRyb2xsZXIge1xuICAgIGlmIChBdWRpb0NvbnRyb2xsZXIuaW5zdGFuY2UgPT0gbnVsbCkge1xuICAgICAgQXVkaW9Db250cm9sbGVyLmluc3RhbmNlID0gbmV3IEF1ZGlvQ29udHJvbGxlcigpO1xuICAgICAgQXVkaW9Db250cm9sbGVyLmluc3RhbmNlLmluaXQoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gQXVkaW9Db250cm9sbGVyLmluc3RhbmNlO1xuICB9XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gcmFuZEZyb20oYXJyYXkpIHtcbiAgcmV0dXJuIGFycmF5W01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGFycmF5Lmxlbmd0aCldO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2h1ZmZsZUFycmF5KGFycmF5KSB7XG4gIGZvciAobGV0IGkgPSBhcnJheS5sZW5ndGggLSAxOyBpID4gMDsgaS0tKSB7XG4gICAgY29uc3QgaiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChpICsgMSkpO1xuICAgIFthcnJheVtpXSwgYXJyYXlbal1dID0gW2FycmF5W2pdLCBhcnJheVtpXV07XG4gIH1cbn1cbiIsImltcG9ydCB7IHFEYXRhLCBhbnN3ZXJEYXRhIH0gZnJvbSAnLi4vY29tcG9uZW50cy9xdWVzdGlvbkRhdGEnO1xuaW1wb3J0IHsgQXVkaW9Db250cm9sbGVyIH0gZnJvbSAnLi4vY29tcG9uZW50cy9hdWRpb0NvbnRyb2xsZXInO1xuaW1wb3J0IHsgcmFuZEZyb20sIHNodWZmbGVBcnJheSB9IGZyb20gJy4uL3V0aWxzL21hdGhVdGlscyc7XG5pbXBvcnQgeyBnZXREYXRhRmlsZSB9IGZyb20gJy4uL3V0aWxzL3VybFV0aWxzJztcblxuZXhwb3J0IGNsYXNzIFVJQ29udHJvbGxlciB7XG4gIHByaXZhdGUgc3RhdGljIGluc3RhbmNlOiBVSUNvbnRyb2xsZXIgfCBudWxsID0gbnVsbDtcblxuICBwcml2YXRlIGxhbmRpbmdDb250YWluZXJJZCA9ICdsYW5kV3JhcCc7XG4gIHB1YmxpYyBsYW5kaW5nQ29udGFpbmVyOiBIVE1MRWxlbWVudDtcblxuICBwcml2YXRlIGdhbWVDb250YWluZXJJZCA9ICdnYW1lV3JhcCc7XG4gIHB1YmxpYyBnYW1lQ29udGFpbmVyOiBIVE1MRWxlbWVudDtcblxuICBwcml2YXRlIGVuZENvbnRhaW5lcklkID0gJ2VuZFdyYXAnO1xuICBwdWJsaWMgZW5kQ29udGFpbmVyOiBIVE1MRWxlbWVudDtcblxuICBwcml2YXRlIHN0YXJDb250YWluZXJJZCA9ICdzdGFyV3JhcHBlcic7XG4gIHB1YmxpYyBzdGFyQ29udGFpbmVyOiBIVE1MRWxlbWVudDtcblxuICBwcml2YXRlIGNoZXN0Q29udGFpbmVySWQgPSAnY2hlc3RXcmFwcGVyJztcbiAgcHVibGljIGNoZXN0Q29udGFpbmVyOiBIVE1MRWxlbWVudDtcblxuICBwcml2YXRlIHF1ZXN0aW9uc0NvbnRhaW5lcklkID0gJ3FXcmFwJztcbiAgcHVibGljIHF1ZXN0aW9uc0NvbnRhaW5lcjogSFRNTEVsZW1lbnQ7XG5cbiAgcHJpdmF0ZSBmZWVkYmFja0NvbnRhaW5lcklkID0gJ2ZlZWRiYWNrV3JhcCc7XG4gIHB1YmxpYyBmZWVkYmFja0NvbnRhaW5lcjogSFRNTEVsZW1lbnQ7XG5cbiAgcHJpdmF0ZSBhbnN3ZXJzQ29udGFpbmVySWQgPSAnYVdyYXAnO1xuICBwdWJsaWMgYW5zd2Vyc0NvbnRhaW5lcjogSFRNTEVsZW1lbnQ7XG5cbiAgcHJpdmF0ZSBhbnN3ZXJCdXR0b24xSWQgPSAnYW5zd2VyQnV0dG9uMSc7XG4gIHByaXZhdGUgYW5zd2VyQnV0dG9uMTogSFRNTEVsZW1lbnQ7XG4gIHByaXZhdGUgYW5zd2VyQnV0dG9uMklkID0gJ2Fuc3dlckJ1dHRvbjInO1xuICBwcml2YXRlIGFuc3dlckJ1dHRvbjI6IEhUTUxFbGVtZW50O1xuICBwcml2YXRlIGFuc3dlckJ1dHRvbjNJZCA9ICdhbnN3ZXJCdXR0b24zJztcbiAgcHJpdmF0ZSBhbnN3ZXJCdXR0b24zOiBIVE1MRWxlbWVudDtcbiAgcHJpdmF0ZSBhbnN3ZXJCdXR0b240SWQgPSAnYW5zd2VyQnV0dG9uNCc7XG4gIHByaXZhdGUgYW5zd2VyQnV0dG9uNDogSFRNTEVsZW1lbnQ7XG4gIHByaXZhdGUgYW5zd2VyQnV0dG9uNUlkID0gJ2Fuc3dlckJ1dHRvbjUnO1xuICBwcml2YXRlIGFuc3dlckJ1dHRvbjU6IEhUTUxFbGVtZW50O1xuICBwcml2YXRlIGFuc3dlckJ1dHRvbjZJZCA9ICdhbnN3ZXJCdXR0b242JztcbiAgcHJpdmF0ZSBhbnN3ZXJCdXR0b242OiBIVE1MRWxlbWVudDtcblxuICBwcml2YXRlIHBsYXlCdXR0b25JZCA9ICdwYnV0dG9uJztcbiAgcHJpdmF0ZSBwbGF5QnV0dG9uOiBIVE1MRWxlbWVudDtcblxuICBwcml2YXRlIGNoZXN0SW1nSWQgPSAnY2hlc3RJbWFnZSc7XG4gIHByaXZhdGUgY2hlc3RJbWc6IEhUTUxFbGVtZW50O1xuXG4gIHB1YmxpYyBuZXh0UXVlc3Rpb24gPSBudWxsO1xuXG4gIHB1YmxpYyBjb250ZW50TG9hZGVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgcHVibGljIHFTdGFydDtcbiAgcHVibGljIHNob3duID0gZmFsc2U7XG5cbiAgcHVibGljIHN0YXJzID0gW107XG4gIHB1YmxpYyBzaG93blN0YXJzQ291bnQgPSAwO1xuICBwdWJsaWMgc3RhclBvc2l0aW9uczogQXJyYXk8eyB4OiBudW1iZXI7IHk6IG51bWJlciB9PiA9IEFycmF5PHtcbiAgICB4OiBudW1iZXI7XG4gICAgeTogbnVtYmVyO1xuICB9PigpO1xuICBwdWJsaWMgcUFuc051bSA9IDA7XG5cbiAgcHVibGljIGFsbFN0YXJ0OiBudW1iZXI7XG5cbiAgcHVibGljIGJ1dHRvbnMgPSBbXTtcblxuICBwcml2YXRlIGJ1dHRvblByZXNzQ2FsbGJhY2s6IEZ1bmN0aW9uO1xuICBwcml2YXRlIHN0YXJ0UHJlc3NDYWxsYmFjazogRnVuY3Rpb247XG5cbiAgcHVibGljIGJ1dHRvbnNBY3RpdmU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBwcml2YXRlIGRldk1vZGVDb3JyZWN0TGFiZWxWaXNpYmlsaXR5OiBib29sZWFuID0gZmFsc2U7XG4gIHByaXZhdGUgZGV2TW9kZUJ1Y2tldENvbnRyb2xzRW5hYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIHB1YmxpYyBhbmltYXRpb25TcGVlZE11bHRpcGxpZXI6IG51bWJlciA9IDE7XG5cbiAgcHVibGljIGV4dGVybmFsQnVja2V0Q29udHJvbHNHZW5lcmF0aW9uSGFuZGxlcjogKGNvbnRhaW5lcjogSFRNTEVsZW1lbnQsIGNsaWNrQ2FsbGJhY2s6ICgpID0+IHZvaWQpID0+IHZvaWQ7XG5cbiAgcHJpdmF0ZSBpbml0KCk6IHZvaWQge1xuICAgIC8vIEluaXRpYWxpemUgcmVxdWlyZWQgY29udGFpbmVyc1xuICAgIHRoaXMubGFuZGluZ0NvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMubGFuZGluZ0NvbnRhaW5lcklkKTtcbiAgICB0aGlzLmdhbWVDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmdhbWVDb250YWluZXJJZCk7XG4gICAgdGhpcy5lbmRDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmVuZENvbnRhaW5lcklkKTtcbiAgICB0aGlzLnN0YXJDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLnN0YXJDb250YWluZXJJZCk7XG4gICAgdGhpcy5jaGVzdENvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuY2hlc3RDb250YWluZXJJZCk7XG4gICAgdGhpcy5xdWVzdGlvbnNDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLnF1ZXN0aW9uc0NvbnRhaW5lcklkKTtcbiAgICB0aGlzLmZlZWRiYWNrQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5mZWVkYmFja0NvbnRhaW5lcklkKTtcbiAgICB0aGlzLmFuc3dlcnNDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmFuc3dlcnNDb250YWluZXJJZCk7XG5cbiAgICAvLyBJbml0aWFsaXplIHJlcXVpcmVkIGJ1dHRvbnNcbiAgICB0aGlzLmFuc3dlckJ1dHRvbjEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmFuc3dlckJ1dHRvbjFJZCk7XG4gICAgdGhpcy5hbnN3ZXJCdXR0b24yID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5hbnN3ZXJCdXR0b24ySWQpO1xuICAgIHRoaXMuYW5zd2VyQnV0dG9uMyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuYW5zd2VyQnV0dG9uM0lkKTtcbiAgICB0aGlzLmFuc3dlckJ1dHRvbjQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmFuc3dlckJ1dHRvbjRJZCk7XG4gICAgdGhpcy5hbnN3ZXJCdXR0b241ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5hbnN3ZXJCdXR0b241SWQpO1xuICAgIHRoaXMuYW5zd2VyQnV0dG9uNiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuYW5zd2VyQnV0dG9uNklkKTtcblxuICAgIHRoaXMucGxheUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMucGxheUJ1dHRvbklkKTtcblxuICAgIHRoaXMuY2hlc3RJbWcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmNoZXN0SW1nSWQpO1xuXG4gICAgdGhpcy5pbml0aWFsaXplU3RhcnMoKTtcblxuICAgIHRoaXMuaW5pdEV2ZW50TGlzdGVuZXJzKCk7XG4gIH1cblxuICBwcml2YXRlIGluaXRpYWxpemVTdGFycygpOiB2b2lkIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDIwOyBpKyspIHtcbiAgICAgIGNvbnN0IG5ld1N0YXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcblxuICAgICAgLy8gbmV3U3Rhci5zcmMgPSBcImltZy9zdGFyLnBuZ1wiO1xuICAgICAgbmV3U3Rhci5pZCA9ICdzdGFyJyArIGk7XG5cbiAgICAgIG5ld1N0YXIuY2xhc3NMaXN0LmFkZCgndG9wc3RhcnYnKTtcblxuICAgICAgdGhpcy5zdGFyQ29udGFpbmVyLmFwcGVuZENoaWxkKG5ld1N0YXIpO1xuXG4gICAgICB0aGlzLnN0YXJDb250YWluZXIuaW5uZXJIVE1MICs9ICcnO1xuXG4gICAgICBpZiAoaSA9PSA5KSB7XG4gICAgICAgIHRoaXMuc3RhckNvbnRhaW5lci5pbm5lckhUTUwgKz0gJzxicj4nO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnN0YXJzLnB1c2goaSk7XG4gICAgfVxuXG4gICAgc2h1ZmZsZUFycmF5KHRoaXMuc3RhcnMpO1xuICB9XG5cbiAgcHVibGljIFNldEFuaW1hdGlvblNwZWVkTXVsdGlwbGllcihtdWx0aXBsaWVyOiBudW1iZXIpOiB2b2lkIHtcbiAgICBVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5hbmltYXRpb25TcGVlZE11bHRpcGxpZXIgPSBtdWx0aXBsaWVyO1xuICB9XG5cbiAgcHVibGljIFNldENvcnJlY3RMYWJlbFZpc2liaWxpdHkodmlzaWJsZTogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuZGV2TW9kZUNvcnJlY3RMYWJlbFZpc2liaWxpdHkgPSB2aXNpYmxlO1xuICAgIGNvbnNvbGUubG9nKCdDb3JyZWN0IGxhYmVsIHZpc2liaWxpdHkgc2V0IHRvICcsIHRoaXMuZGV2TW9kZUNvcnJlY3RMYWJlbFZpc2liaWxpdHkpO1xuICB9XG5cbiAgcHVibGljIFNldEJ1Y2tldENvbnRyb2xzVmlzaWJpbGl0eSh2aXNpYmxlOiBib29sZWFuKTogdm9pZCB7XG4gICAgY29uc29sZS5sb2coJ0J1Y2tldCBjb250cm9scyB2aXNpYmlsaXR5IHNldCB0byAnLCB2aXNpYmxlKTtcbiAgICB0aGlzLmRldk1vZGVCdWNrZXRDb250cm9sc0VuYWJsZWQgPSB2aXNpYmxlO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBPdmVybGFwcGluZ090aGVyU3RhcnMoXG4gICAgc3RhclBvc2l0aW9uczogQXJyYXk8eyB4OiBudW1iZXI7IHk6IG51bWJlciB9PixcbiAgICB4OiBudW1iZXIsXG4gICAgeTogbnVtYmVyLFxuICAgIG1pbkRpc3RhbmNlOiBudW1iZXJcbiAgKTogYm9vbGVhbiB7XG4gICAgaWYgKHN0YXJQb3NpdGlvbnMubGVuZ3RoIDwgMSkgcmV0dXJuIGZhbHNlO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdGFyUG9zaXRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBkeCA9IHN0YXJQb3NpdGlvbnNbaV0ueCAtIHg7XG4gICAgICBjb25zdCBkeSA9IHN0YXJQb3NpdGlvbnNbaV0ueSAtIHk7XG4gICAgICBjb25zdCBkaXN0YW5jZSA9IE1hdGguc3FydChkeCAqIGR4ICsgZHkgKiBkeSk7XG4gICAgICBpZiAoZGlzdGFuY2UgPCBtaW5EaXN0YW5jZSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcHJpdmF0ZSBpbml0RXZlbnRMaXN0ZW5lcnMoKTogdm9pZCB7XG4gICAgLy8gVE9ETzogcmVmYWN0b3IgdGhpc1xuICAgIHRoaXMuYW5zd2VyQnV0dG9uMS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIHRoaXMuYW5zd2VyQnV0dG9uUHJlc3MoMSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLmJ1dHRvbnMucHVzaCh0aGlzLmFuc3dlckJ1dHRvbjEpO1xuXG4gICAgdGhpcy5hbnN3ZXJCdXR0b24yLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgdGhpcy5hbnN3ZXJCdXR0b25QcmVzcygyKTtcbiAgICB9KTtcblxuICAgIHRoaXMuYnV0dG9ucy5wdXNoKHRoaXMuYW5zd2VyQnV0dG9uMik7XG5cbiAgICB0aGlzLmFuc3dlckJ1dHRvbjMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICB0aGlzLmFuc3dlckJ1dHRvblByZXNzKDMpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5idXR0b25zLnB1c2godGhpcy5hbnN3ZXJCdXR0b24zKTtcblxuICAgIHRoaXMuYW5zd2VyQnV0dG9uNC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIHRoaXMuYW5zd2VyQnV0dG9uUHJlc3MoNCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLmJ1dHRvbnMucHVzaCh0aGlzLmFuc3dlckJ1dHRvbjQpO1xuXG4gICAgdGhpcy5hbnN3ZXJCdXR0b241LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgdGhpcy5hbnN3ZXJCdXR0b25QcmVzcyg1KTtcbiAgICB9KTtcblxuICAgIHRoaXMuYnV0dG9ucy5wdXNoKHRoaXMuYW5zd2VyQnV0dG9uNSk7XG5cbiAgICB0aGlzLmFuc3dlckJ1dHRvbjYuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICB0aGlzLmFuc3dlckJ1dHRvblByZXNzKDYpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5idXR0b25zLnB1c2godGhpcy5hbnN3ZXJCdXR0b242KTtcblxuICAgIHRoaXMubGFuZGluZ0NvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKFwiPj4+Pj4+Pj4+Pj4+Pj4+PlwiLCBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShnZXREYXRhRmlsZSgpKSwgXCI+Pj4+Pj4+XCIsIFVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLmNvbnRlbnRMb2FkZWQpO1xuICAgICAgaWYgKFVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLmNvbnRlbnRMb2FkZWQpIHtcbiAgICAgICAgdGhpcy5zaG93R2FtZSgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIHNob3dPcHRpb25zKCk6IHZvaWQge1xuICAgIGlmICghVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkuc2hvd24pIHtcbiAgICAgIGNvbnN0IG5ld1EgPSBVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5uZXh0UXVlc3Rpb247XG4gICAgICBjb25zdCBidXR0b25zID0gVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkuYnV0dG9ucztcblxuICAgICAgY29uc3QgYW5pbWF0aW9uU3BlZWRNdWx0aXBsaWVyID0gVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkuYW5pbWF0aW9uU3BlZWRNdWx0aXBsaWVyO1xuXG4gICAgICBsZXQgYW5pbWF0aW9uRHVyYXRpb24gPSAyMjAgKiBhbmltYXRpb25TcGVlZE11bHRpcGxpZXI7XG4gICAgICBjb25zdCBkZWxheUJmb3JlT3B0aW9uID0gMTUwICogYW5pbWF0aW9uU3BlZWRNdWx0aXBsaWVyO1xuICAgICAgVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkuc2hvd24gPSB0cnVlO1xuICAgICAgbGV0IG9wdGlvbnNEaXNwbGF5ZWQgPSAwO1xuXG4gICAgICBidXR0b25zLmZvckVhY2goKGJ1dHRvbikgPT4ge1xuICAgICAgICBidXR0b24uc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuICAgICAgICBidXR0b24uc3R5bGUuYW5pbWF0aW9uID0gJyc7XG4gICAgICAgIGJ1dHRvbi5pbm5lckhUTUwgPSAnJztcbiAgICAgIH0pO1xuXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuZXdRLmFuc3dlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBjb25zdCBjdXJBbnN3ZXIgPSBuZXdRLmFuc3dlcnNbaV07XG4gICAgICAgICAgY29uc3QgYnV0dG9uID0gYnV0dG9uc1tpXSBhcyBIVE1MQnV0dG9uRWxlbWVudDtcblxuICAgICAgICAgIGNvbnN0IGlzQ29ycmVjdCA9IGN1ckFuc3dlci5hbnN3ZXJOYW1lID09PSBuZXdRLmNvcnJlY3Q7XG5cbiAgICAgICAgICBidXR0b24uaW5uZXJIVE1MID0gJ2Fuc3dlclRleHQnIGluIGN1ckFuc3dlciA/IGN1ckFuc3dlci5hbnN3ZXJUZXh0IDogJyc7XG5cbiAgICAgICAgICAvLyBBZGQgYSBsYWJlbCBpbnNpZGUgdGhlIGJ1dHRvbiB0byBzaG93IHRoZSBjb3JyZWN0IGFuc3dlclxuICAgICAgICAgIGlmIChpc0NvcnJlY3QgJiYgVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkuZGV2TW9kZUNvcnJlY3RMYWJlbFZpc2liaWxpdHkpIHtcbiAgICAgICAgICAgIGNvbnN0IGNvcnJlY3RMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgY29ycmVjdExhYmVsLmNsYXNzTGlzdC5hZGQoJ2NvcnJlY3QtbGFiZWwnKTtcbiAgICAgICAgICAgIGNvcnJlY3RMYWJlbC5pbm5lckhUTUwgPSAnQ29ycmVjdCc7XG4gICAgICAgICAgICBidXR0b24uYXBwZW5kQ2hpbGQoY29ycmVjdExhYmVsKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBidXR0b24uc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuICAgICAgICAgIGJ1dHRvbi5zdHlsZS5ib3hTaGFkb3cgPSAnMHB4IDBweCAwcHggMHB4IHJnYmEoMCwwLDAsMCknO1xuICAgICAgICAgIHNldFRpbWVvdXQoXG4gICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgIGJ1dHRvbi5zdHlsZS52aXNpYmlsaXR5ID0gJ3Zpc2libGUnO1xuICAgICAgICAgICAgICBidXR0b24uc3R5bGUuYm94U2hhZG93ID0gJzBweCA2cHggOHB4ICM2MDYwNjAnO1xuICAgICAgICAgICAgICBidXR0b24uc3R5bGUuYW5pbWF0aW9uID0gYHpvb21JbiAke2FuaW1hdGlvbkR1cmF0aW9uICogYW5pbWF0aW9uU3BlZWRNdWx0aXBsaWVyfW1zIGVhc2UgZm9yd2FyZHNgO1xuICAgICAgICAgICAgICBpZiAoJ2Fuc3dlckltZycgaW4gY3VyQW5zd2VyKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdG1waW1nID0gQXVkaW9Db250cm9sbGVyLkdldEltYWdlKGN1ckFuc3dlci5hbnN3ZXJJbWcpO1xuICAgICAgICAgICAgICAgIGJ1dHRvbi5hcHBlbmRDaGlsZCh0bXBpbWcpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdhbmltYXRpb25lbmQnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgb3B0aW9uc0Rpc3BsYXllZCsrO1xuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zRGlzcGxheWVkID09PSBuZXdRLmFuc3dlcnMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICBVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5lbmFibGVBbnN3ZXJCdXR0b24oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGkgKiBhbmltYXRpb25EdXJhdGlvbiAqIGFuaW1hdGlvblNwZWVkTXVsdGlwbGllciAqIDAuM1xuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH0sIGRlbGF5QmZvcmVPcHRpb24pO1xuXG4gICAgICBVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5xU3RhcnQgPSBEYXRlLm5vdygpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZW5hYmxlQW5zd2VyQnV0dG9uKCk6IHZvaWQge1xuICAgIFVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLmJ1dHRvbnNBY3RpdmUgPSB0cnVlO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBTZXRGZWVkYmFja1RleHQobnQ6IHN0cmluZyk6IHZvaWQge1xuICAgIGNvbnNvbGUubG9nKCdGZWVkYmFjayB0ZXh0IHNldCB0byAnICsgbnQpO1xuICAgIFVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLmZlZWRiYWNrQ29udGFpbmVyLmlubmVySFRNTCA9IG50O1xuICB9XG5cbiAgLy9mdW5jdGlvbnMgdG8gc2hvdy9oaWRlIHRoZSBkaWZmZXJlbnQgY29udGFpbmVyc1xuICBwcml2YXRlIHNob3dMYW5kaW5nKCk6IHZvaWQge1xuICAgIHRoaXMubGFuZGluZ0NvbnRhaW5lci5zdHlsZS5kaXNwbGF5ID0gJ2ZsZXgnO1xuICAgIHRoaXMuZ2FtZUNvbnRhaW5lci5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIHRoaXMuZW5kQ29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIFNob3dFbmQoKTogdm9pZCB7XG4gICAgVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkubGFuZGluZ0NvbnRhaW5lci5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIFVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLmdhbWVDb250YWluZXIuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICBVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5lbmRDb250YWluZXIuc3R5bGUuZGlzcGxheSA9ICdmbGV4JztcbiAgfVxuXG4gIHByaXZhdGUgc2hvd0dhbWUoKTogdm9pZCB7XG4gICAgdGhpcy5sYW5kaW5nQ29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgdGhpcy5nYW1lQ29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSAnZ3JpZCc7XG4gICAgdGhpcy5lbmRDb250YWluZXIuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICB0aGlzLmFsbFN0YXJ0ID0gRGF0ZS5ub3coKTtcbiAgICB0aGlzLnN0YXJ0UHJlc3NDYWxsYmFjaygpO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBTZXRGZWVkYmFja1Zpc2liaWxlKHZpc2libGU6IGJvb2xlYW4sIGlzQ29ycmVjdDogYm9vbGVhbikge1xuICAgIGlmICh2aXNpYmxlKSB7XG4gICAgICBVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5mZWVkYmFja0NvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcbiAgICAgIFVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLmZlZWRiYWNrQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3Zpc2libGUnKTtcbiAgICAgIFVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLmJ1dHRvbnNBY3RpdmUgPSBmYWxzZTtcbiAgICAgIGlmIChpc0NvcnJlY3QpIHtcbiAgICAgICAgVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkuZmVlZGJhY2tDb250YWluZXIuc3R5bGUuY29sb3IgPSAncmdiKDEwOSwgMjA0LCAxMjIpJztcbiAgICAgICAgQXVkaW9Db250cm9sbGVyLlBsYXlDb3JyZWN0KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5mZWVkYmFja0NvbnRhaW5lci5zdHlsZS5jb2xvciA9ICdyZWQnO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5mZWVkYmFja0NvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKCd2aXNpYmxlJyk7XG4gICAgICBVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5mZWVkYmFja0NvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcbiAgICAgIFVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLmJ1dHRvbnNBY3RpdmUgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIFJlYWR5Rm9yTmV4dChuZXdROiBxRGF0YSwgcmVHZW5lcmF0ZUl0ZW1zOiBib29sZWFuID0gdHJ1ZSk6IHZvaWQge1xuICAgIGlmIChuZXdRID09PSBudWxsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKCdyZWFkeSBmb3IgbmV4dCEnKTtcbiAgICBVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5hbnN3ZXJzQ29udGFpbmVyLnN0eWxlLnZpc2liaWxpdHkgPSAnaGlkZGVuJztcbiAgICBmb3IgKHZhciBiIGluIFVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLmJ1dHRvbnMpIHtcbiAgICAgIFVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLmJ1dHRvbnNbYl0uc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuICAgIH1cbiAgICBVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5zaG93biA9IGZhbHNlO1xuICAgIFVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLm5leHRRdWVzdGlvbiA9IG5ld1E7XG4gICAgVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkucXVlc3Rpb25zQ29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xuICAgIFVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLnF1ZXN0aW9uc0NvbnRhaW5lci5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIC8vIHBCLmlubmVySFRNTCA9IFwiPGJ1dHRvbiBpZD0nbmV4dHFCdXR0b24nPjxzdmcgd2lkdGg9JzI0JyBoZWlnaHQ9JzI0JyB2aWV3Qm94PScwIDAgMjQgMjQnIGZpbGw9J25vbmUnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc+PHBhdGggZD0nTTkgMThMMTUgMTJMOSA2VjE4WicgZmlsbD0nY3VycmVudENvbG9yJyBzdHJva2U9J2N1cnJlbnRDb2xvcicgc3Ryb2tlLXdpZHRoPScyJyBzdHJva2UtbGluZWNhcD0ncm91bmQnIHN0cm9rZS1saW5lam9pbj0ncm91bmQnPjwvcGF0aD48L3N2Zz48L2J1dHRvbj5cIjtcbiAgICAvLyBVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5wbGF5QnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJhdWRpby1idXR0b25cIik7XG5cbiAgICAvLyBXaGVuIHRoZSBkZXYgbW9kZSBpcyBhY3RpdmUgYW5kIHRoZSBidWNrZXQgbmV4dCwgcHJldmlvdXMgYW5kIHBsYXkgYnV0dG9ucyBhcmUgZW5hYmxlZCwgdXNlIHRoZSBleHRlcm5hbCBidWNrZXQgY29udHJvbHMgZ2VuZXJhdGlvbiBoYW5kbGVyXG4gICAgLy8gaWYgKCFyZUdlbmVyYXRlSXRlbXMpIHtcbiAgICAvLyAgIHJldHVybjtcbiAgICAvLyB9XG4gICAgY29uc3QgaXNCdWNrZXRDb250cm9sc0VuYWJsZWQgPSBVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5kZXZNb2RlQnVja2V0Q29udHJvbHNFbmFibGVkO1xuICAgIGlmIChpc0J1Y2tldENvbnRyb2xzRW5hYmxlZCkge1xuICAgICAgVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkuZXh0ZXJuYWxCdWNrZXRDb250cm9sc0dlbmVyYXRpb25IYW5kbGVyKFVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLnBsYXlCdXR0b24sICgpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coJ0NhbGwgZnJvbSBpbnNpZGUgY2xpY2sgaGFuZGxlciBvZiBleHRlcm5hbCBidWNrZXQgY29udHJvbHMnKTtcbiAgICAgICAgVUlDb250cm9sbGVyLlNob3dRdWVzdGlvbigpO1xuICAgICAgICAvL3BsYXlxdWVzdGlvbmF1ZGlvXG4gICAgICAgIEF1ZGlvQ29udHJvbGxlci5QbGF5QXVkaW8oXG4gICAgICAgICAgbmV3US5wcm9tcHRBdWRpbyxcbiAgICAgICAgICBVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5zaG93T3B0aW9ucyxcbiAgICAgICAgICBVSUNvbnRyb2xsZXIuU2hvd0F1ZGlvQW5pbWF0aW9uXG4gICAgICAgICk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkucGxheUJ1dHRvbi5pbm5lckhUTUwgPVxuICAgICAgICBcIjxidXR0b24gaWQ9J25leHRxQnV0dG9uJz48aW1nIGNsYXNzPWF1ZGlvLWJ1dHRvbiB3aWR0aD0nMTAwcHgnIGhlaWdodD0nMTAwcHgnIHNyYz0nL2ltZy9Tb3VuZEJ1dHRvbl9JZGxlLnBuZycgdHlwZT0naW1hZ2Uvc3ZnK3htbCc+IDwvaW1nPjwvYnV0dG9uPlwiO1xuICAgICAgdmFyIG5leHRRdWVzdGlvbkJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduZXh0cUJ1dHRvbicpO1xuICAgICAgbmV4dFF1ZXN0aW9uQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBVSUNvbnRyb2xsZXIuU2hvd1F1ZXN0aW9uKCk7XG4gICAgICAgIC8vcGxheXF1ZXN0aW9uYXVkaW9cbiAgICAgICAgQXVkaW9Db250cm9sbGVyLlBsYXlBdWRpbyhcbiAgICAgICAgICBuZXdRLnByb21wdEF1ZGlvLFxuICAgICAgICAgIFVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLnNob3dPcHRpb25zLFxuICAgICAgICAgIFVJQ29udHJvbGxlci5TaG93QXVkaW9BbmltYXRpb25cbiAgICAgICAgKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgU2hvd0F1ZGlvQW5pbWF0aW9uKHBsYXlpbmc6IGJvb2xlYW4gPSBmYWxzZSkge1xuICAgIGlmICghVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkuZGV2TW9kZUJ1Y2tldENvbnRyb2xzRW5hYmxlZCkge1xuICAgICAgY29uc3QgcGxheUJ1dHRvbkltZyA9IFVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLnBsYXlCdXR0b24ucXVlcnlTZWxlY3RvcignaW1nJyk7XG4gICAgICBpZiAocGxheWluZykge1xuICAgICAgICBwbGF5QnV0dG9uSW1nLnNyYyA9ICdhbmltYXRpb24vU291bmRCdXR0b24uZ2lmJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBsYXlCdXR0b25JbWcuc3JjID0gJy9pbWcvU291bmRCdXR0b25fSWRsZS5wbmcnO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgU2hvd1F1ZXN0aW9uKG5ld1F1ZXN0aW9uPzogcURhdGEpOiB2b2lkIHtcbiAgICAvLyBwQi5pbm5lckhUTUwgPSBcIjxidXR0b24gaWQ9J25leHRxQnV0dG9uJz48c3ZnIHdpZHRoPScyNCcgaGVpZ2h0PScyNCcgdmlld0JveD0nMCAwIDI0IDI0JyBmaWxsPSdub25lJyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnPjxwYXRoIGQ9J005IDE4TDE1IDEyTDkgNlYxOFonIGZpbGw9J2N1cnJlbnRDb2xvcicgc3Ryb2tlPSdjdXJyZW50Q29sb3InIHN0cm9rZS13aWR0aD0nMicgc3Ryb2tlLWxpbmVjYXA9J3JvdW5kJyBzdHJva2UtbGluZWpvaW49J3JvdW5kJz48L3BhdGg+PC9zdmc+PC9idXR0b24+XCI7XG5cbiAgICAvLyBXaGVuIHRoZSBkZXYgbW9kZSBpcyBhY3RpdmUgYW5kIHRoZSBidWNrZXQgbmV4dCwgcHJldmlvdXMgYW5kIHBsYXkgYnV0dG9ucyBhcmUgZW5hYmxlZCwgdXNlIHRoZSBleHRlcm5hbCBidWNrZXQgY29udHJvbHMgZ2VuZXJhdGlvbiBoYW5kbGVyXG4gICAgY29uc3QgaXNCdWNrZXRDb250cm9sc0VuYWJsZWQgPSBVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5kZXZNb2RlQnVja2V0Q29udHJvbHNFbmFibGVkO1xuICAgIGlmIChpc0J1Y2tldENvbnRyb2xzRW5hYmxlZCkge1xuICAgICAgVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkuZXh0ZXJuYWxCdWNrZXRDb250cm9sc0dlbmVyYXRpb25IYW5kbGVyKFVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLnBsYXlCdXR0b24sICgpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coJ0NhbGwgZnJvbSBpbnNpZGUgY2xpY2sgaGFuZGxlciBvZiBleHRlcm5hbCBidWNrZXQgY29udHJvbHMgIzInKTtcbiAgICAgICAgY29uc29sZS5sb2coJ25leHQgcXVlc3Rpb24gYnV0dG9uIHByZXNzZWQnKTtcbiAgICAgICAgY29uc29sZS5sb2cobmV3UXVlc3Rpb24ucHJvbXB0QXVkaW8pO1xuXG4gICAgICAgIGlmICgncHJvbXB0QXVkaW8nIGluIG5ld1F1ZXN0aW9uKSB7XG4gICAgICAgICAgQXVkaW9Db250cm9sbGVyLlBsYXlBdWRpbyhuZXdRdWVzdGlvbi5wcm9tcHRBdWRpbywgdW5kZWZpbmVkLCBVSUNvbnRyb2xsZXIuU2hvd0F1ZGlvQW5pbWF0aW9uKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIFVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLnBsYXlCdXR0b24uaW5uZXJIVE1MID1cbiAgICAgICAgXCI8YnV0dG9uIGlkPSduZXh0cUJ1dHRvbic+PGltZyBjbGFzcz1hdWRpby1idXR0b24gd2lkdGg9JzEwMHB4JyBoZWlnaHQ9JzEwMHB4JyBzcmM9Jy9pbWcvU291bmRCdXR0b25fSWRsZS5wbmcnIHR5cGU9J2ltYWdlL3N2Zyt4bWwnPiA8L2ltZz48L2J1dHRvbj5cIjtcblxuICAgICAgdmFyIG5leHRRdWVzdGlvbkJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduZXh0cUJ1dHRvbicpO1xuICAgICAgbmV4dFF1ZXN0aW9uQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zb2xlLmxvZygnbmV4dCBxdWVzdGlvbiBidXR0b24gcHJlc3NlZCcpO1xuICAgICAgICBjb25zb2xlLmxvZyhuZXdRdWVzdGlvbi5wcm9tcHRBdWRpbyk7XG5cbiAgICAgICAgaWYgKCdwcm9tcHRBdWRpbycgaW4gbmV3UXVlc3Rpb24pIHtcbiAgICAgICAgICBBdWRpb0NvbnRyb2xsZXIuUGxheUF1ZGlvKG5ld1F1ZXN0aW9uLnByb21wdEF1ZGlvLCB1bmRlZmluZWQsIFVJQ29udHJvbGxlci5TaG93QXVkaW9BbmltYXRpb24pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5hbnN3ZXJzQ29udGFpbmVyLnN0eWxlLnZpc2liaWxpdHkgPSAndmlzaWJsZSc7XG5cbiAgICBsZXQgcUNvZGUgPSAnJztcblxuICAgIFVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLnF1ZXN0aW9uc0NvbnRhaW5lci5pbm5lckhUTUwgPSAnJztcblxuICAgIGlmICh0eXBlb2YgbmV3UXVlc3Rpb24gPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIG5ld1F1ZXN0aW9uID0gVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkubmV4dFF1ZXN0aW9uO1xuICAgIH1cblxuICAgIGlmICgncHJvbXB0SW1nJyBpbiBuZXdRdWVzdGlvbikge1xuICAgICAgdmFyIHRtcGltZyA9IEF1ZGlvQ29udHJvbGxlci5HZXRJbWFnZShuZXdRdWVzdGlvbi5wcm9tcHRJbWcpO1xuICAgICAgVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkucXVlc3Rpb25zQ29udGFpbmVyLmFwcGVuZENoaWxkKHRtcGltZyk7XG4gICAgfVxuXG4gICAgcUNvZGUgKz0gbmV3UXVlc3Rpb24ucHJvbXB0VGV4dDtcblxuICAgIHFDb2RlICs9ICc8QlI+JztcblxuICAgIFVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLnF1ZXN0aW9uc0NvbnRhaW5lci5pbm5lckhUTUwgKz0gcUNvZGU7XG5cbiAgICBmb3IgKHZhciBidXR0b25JbmRleCBpbiBVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5idXR0b25zKSB7XG4gICAgICBVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5idXR0b25zW2J1dHRvbkluZGV4XS5zdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbic7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHN0YXRpYyBBZGRTdGFyKCk6IHZvaWQge1xuICAgIHZhciBzdGFyVG9TaG93ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG4gICAgICAnc3RhcicgKyBVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5zdGFyc1tVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5xQW5zTnVtXVxuICAgICkgYXMgSFRNTEltYWdlRWxlbWVudDtcbiAgICBzdGFyVG9TaG93LnNyYyA9ICcuLi9hbmltYXRpb24vU3Rhci5naWYnO1xuICAgIHN0YXJUb1Nob3cuY2xhc3NMaXN0LmFkZCgndG9wc3RhcnYnKTtcbiAgICBzdGFyVG9TaG93LmNsYXNzTGlzdC5yZW1vdmUoJ3RvcHN0YXJoJyk7XG5cbiAgICBzdGFyVG9TaG93LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcblxuICAgIGxldCBjb250YWluZXJXaWR0aCA9IFVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLnN0YXJDb250YWluZXIub2Zmc2V0V2lkdGg7XG4gICAgbGV0IGNvbnRhaW5lckhlaWdodCA9IFVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLnN0YXJDb250YWluZXIub2Zmc2V0SGVpZ2h0O1xuXG4gICAgY29uc29sZS5sb2coJ1N0YXJzIENvbnRhaW5lciBkaW1lbnNpb25zOiAnLCBjb250YWluZXJXaWR0aCwgY29udGFpbmVySGVpZ2h0KTtcblxuICAgIGxldCByYW5kb21YID0gMDtcbiAgICBsZXQgcmFuZG9tWSA9IDA7XG5cbiAgICBkbyB7XG4gICAgICByYW5kb21YID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKGNvbnRhaW5lcldpZHRoIC0gY29udGFpbmVyV2lkdGggKiAwLjIpKTtcbiAgICAgIHJhbmRvbVkgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjb250YWluZXJIZWlnaHQpO1xuICAgIH0gd2hpbGUgKFVJQ29udHJvbGxlci5PdmVybGFwcGluZ090aGVyU3RhcnMoVUlDb250cm9sbGVyLmluc3RhbmNlLnN0YXJQb3NpdGlvbnMsIHJhbmRvbVgsIHJhbmRvbVksIDI4KSk7XG5cbiAgICBjb25zdCBhbmltYXRpb25TcGVlZE11bHRpcGxpZXIgPSBVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5hbmltYXRpb25TcGVlZE11bHRpcGxpZXI7XG5cbiAgICAvLyBTYXZlIHRoZXNlIHJhbmRvbSB4IGFuZCB5IHZhbHVlcywgbWFrZSB0aGUgc3RhciBhcHBlYXIgaW4gdGhlIGNlbnRlciBvZiB0aGUgc2NyZWVuLCBtYWtlIGl0IDMgdGltZXMgYmlnZ2VyIHVzaW5nIHNjYWxlIGFuZCBzbG93bHkgdHJhbnNpdGlvbiB0byB0aGUgcmFuZG9tIHggYW5kIHkgdmFsdWVzXG4gICAgc3RhclRvU2hvdy5zdHlsZS50cmFuc2Zvcm0gPSAnc2NhbGUoMTApJztcbiAgICBzdGFyVG9TaG93LnN0eWxlLnRyYW5zaXRpb24gPSBgdG9wICR7MSAqIGFuaW1hdGlvblNwZWVkTXVsdGlwbGllcn1zIGVhc2UsIGxlZnQgJHsxICogYW5pbWF0aW9uU3BlZWRNdWx0aXBsaWVyfXMgZWFzZSwgdHJhbnNmb3JtICR7MC41ICogYW5pbWF0aW9uU3BlZWRNdWx0aXBsaWVyfXMgZWFzZWA7XG4gICAgc3RhclRvU2hvdy5zdHlsZS56SW5kZXggPSAnNTAwJztcbiAgICBzdGFyVG9TaG93LnN0eWxlLnRvcCA9IHdpbmRvdy5pbm5lckhlaWdodCAvIDIgKyAncHgnO1xuICAgIHN0YXJUb1Nob3cuc3R5bGUubGVmdCA9IFVJQ29udHJvbGxlci5pbnN0YW5jZS5nYW1lQ29udGFpbmVyLm9mZnNldFdpZHRoIC8gMiAtIHN0YXJUb1Nob3cub2Zmc2V0V2lkdGggLyAyICsgJ3B4JztcblxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgc3RhclRvU2hvdy5zdHlsZS50cmFuc2l0aW9uID0gYHRvcCAkezIgKiBhbmltYXRpb25TcGVlZE11bHRpcGxpZXJ9cyBlYXNlLCBsZWZ0ICR7MiAqIGFuaW1hdGlvblNwZWVkTXVsdGlwbGllcn1zIGVhc2UsIHRyYW5zZm9ybSAkezIgKiBhbmltYXRpb25TcGVlZE11bHRpcGxpZXJ9cyBlYXNlYDtcbiAgICAgIGlmIChyYW5kb21YIDwgY29udGFpbmVyV2lkdGggLyAyIC0gMzApIHtcbiAgICAgICAgLy8gUm90YXRlIHRoZSBzdGFyIHRvIHRoZSByaWdodCBhIGJpdFxuICAgICAgICBjb25zdCByb3RhdGlvbiA9IDUgKyBNYXRoLnJhbmRvbSgpICogODtcbiAgICAgICAgY29uc29sZS5sb2coJ1JvdGF0aW5nIHN0YXIgdG8gdGhlIHJpZ2h0Jywgcm90YXRpb24pO1xuICAgICAgICBzdGFyVG9TaG93LnN0eWxlLnRyYW5zZm9ybSA9ICdyb3RhdGUoLScgKyByb3RhdGlvbiArICdkZWcpIHNjYWxlKDEpJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFJvdGF0ZSB0aGUgc3RhciB0byB0aGUgbGVmdCBhIGJpdFxuICAgICAgICBjb25zdCByb3RhdGlvbiA9IDUgKyBNYXRoLnJhbmRvbSgpICogODtcbiAgICAgICAgY29uc29sZS5sb2coJ1JvdGF0aW5nIHN0YXIgdG8gdGhlIGxlZnQnLCByb3RhdGlvbik7XG4gICAgICAgIHN0YXJUb1Nob3cuc3R5bGUudHJhbnNmb3JtID0gJ3JvdGF0ZSgnICsgcm90YXRpb24gKyAnZGVnKSBzY2FsZSgxKSc7XG4gICAgICB9XG5cbiAgICAgIHN0YXJUb1Nob3cuc3R5bGUubGVmdCA9IDEwICsgcmFuZG9tWCArICdweCc7XG4gICAgICBzdGFyVG9TaG93LnN0eWxlLnRvcCA9IHJhbmRvbVkgKyAncHgnO1xuXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgc3RhclRvU2hvdy5zdHlsZS5maWx0ZXIgPSAnZHJvcC1zaGFkb3coMHB4IDBweCAxMHB4IHllbGxvdyknO1xuICAgICAgfSwgMTkwMCAqIGFuaW1hdGlvblNwZWVkTXVsdGlwbGllcik7XG4gICAgfSwgMTAwMCAqIGFuaW1hdGlvblNwZWVkTXVsdGlwbGllcik7XG5cbiAgICBVSUNvbnRyb2xsZXIuaW5zdGFuY2Uuc3RhclBvc2l0aW9ucy5wdXNoKHsgeDogcmFuZG9tWCwgeTogcmFuZG9tWSB9KTtcblxuICAgIFVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLnFBbnNOdW0gKz0gMTtcblxuICAgIFVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLnNob3duU3RhcnNDb3VudCArPSAxO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBDaGFuZ2VTdGFySW1hZ2VBZnRlckFuaW1hdGlvbigpOiB2b2lkIHtcbiAgICB2YXIgc3RhclRvU2hvdyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuICAgICAgJ3N0YXInICsgVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkuc3RhcnNbVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkucUFuc051bSAtIDFdXG4gICAgKSBhcyBIVE1MSW1hZ2VFbGVtZW50O1xuICAgIHN0YXJUb1Nob3cuc3JjID0gJy4uL2ltZy9zdGFyX2FmdGVyX2FuaW1hdGlvbi5naWYnO1xuICB9XG5cbiAgcHJpdmF0ZSBhbnN3ZXJCdXR0b25QcmVzcyhidXR0b25OdW06IG51bWJlcik6IHZvaWQge1xuICAgIGNvbnN0IGFsbEJ1dHRvbnNWaXNpYmxlID0gdGhpcy5idXR0b25zLmV2ZXJ5KChidXR0b24pID0+IGJ1dHRvbi5zdHlsZS52aXNpYmlsaXR5ID09PSAndmlzaWJsZScpO1xuICAgIGNvbnNvbGUubG9nKHRoaXMuYnV0dG9uc0FjdGl2ZSwgYWxsQnV0dG9uc1Zpc2libGUpO1xuICAgIGlmICh0aGlzLmJ1dHRvbnNBY3RpdmUgPT09IHRydWUpIHtcbiAgICAgIEF1ZGlvQ29udHJvbGxlci5QbGF5RGluZygpO1xuICAgICAgY29uc3QgblByZXNzZWQgPSBEYXRlLm5vdygpO1xuICAgICAgY29uc3QgZFRpbWUgPSBuUHJlc3NlZCAtIHRoaXMucVN0YXJ0O1xuICAgICAgY29uc29sZS5sb2coJ2Fuc3dlcmVkIGluICcgKyBkVGltZSk7XG4gICAgICB0aGlzLmJ1dHRvblByZXNzQ2FsbGJhY2soYnV0dG9uTnVtLCBkVGltZSk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHN0YXRpYyBQcm9ncmVzc0NoZXN0KCkge1xuICAgIGNvbnN0IGNoZXN0SW1hZ2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2hlc3RJbWFnZScpIGFzIEhUTUxJbWFnZUVsZW1lbnQ7XG4gICAgbGV0IGN1cnJlbnRJbWdTcmMgPSBjaGVzdEltYWdlLnNyYztcbiAgICBjb25zb2xlLmxvZygnQ2hlc3QgUHJvZ3Jlc3Npb24tLT4nLCBjaGVzdEltYWdlKTtcbiAgICBjb25zb2xlLmxvZygnQ2hlc3QgUHJvZ3Jlc3Npb24tLT4nLCBjaGVzdEltYWdlLnNyYyk7XG4gICAgY29uc3QgY3VycmVudEltYWdlTnVtYmVyID0gcGFyc2VJbnQoY3VycmVudEltZ1NyYy5zbGljZSgtNiwgLTQpLCAxMCk7XG4gICAgY29uc29sZS5sb2coJ0NoZXN0IFByb2dyZXNzaW9uIG51bWJlci0tPicsIGN1cnJlbnRJbWFnZU51bWJlcik7XG4gICAgY29uc3QgbmV4dEltYWdlTnVtYmVyID0gKGN1cnJlbnRJbWFnZU51bWJlciAlIDQpICsgMTtcbiAgICBjb25zdCBuZXh0SW1hZ2VTcmMgPSBgaW1nL2NoZXN0cHJvZ3Jlc3Npb24vVHJlYXN1cmVDaGVzdE9wZW4wJHtuZXh0SW1hZ2VOdW1iZXJ9LnN2Z2A7XG4gICAgY2hlc3RJbWFnZS5zcmMgPSBuZXh0SW1hZ2VTcmM7XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIFNldENvbnRlbnRMb2FkZWQodmFsdWU6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICBVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5jb250ZW50TG9hZGVkID0gdmFsdWU7XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIFNldEJ1dHRvblByZXNzQWN0aW9uKGNhbGxiYWNrOiBGdW5jdGlvbik6IHZvaWQge1xuICAgIFVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLmJ1dHRvblByZXNzQ2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgU2V0U3RhcnRBY3Rpb24oY2FsbGJhY2s6IEZ1bmN0aW9uKTogdm9pZCB7XG4gICAgVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkuc3RhcnRQcmVzc0NhbGxiYWNrID0gY2FsbGJhY2s7XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIFNldEV4dGVybmFsQnVja2V0Q29udHJvbHNHZW5lcmF0aW9uSGFuZGxlcihcbiAgICBoYW5kbGVyOiAoY29udGFpbmVyOiBIVE1MRWxlbWVudCwgY2xpY2tDYWxsYmFjazogKCkgPT4gdm9pZCkgPT4gdm9pZFxuICApOiB2b2lkIHtcbiAgICBVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5leHRlcm5hbEJ1Y2tldENvbnRyb2xzR2VuZXJhdGlvbkhhbmRsZXIgPSBoYW5kbGVyO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBnZXRJbnN0YW5jZSgpOiBVSUNvbnRyb2xsZXIge1xuICAgIGlmIChVSUNvbnRyb2xsZXIuaW5zdGFuY2UgPT09IG51bGwpIHtcbiAgICAgIFVJQ29udHJvbGxlci5pbnN0YW5jZSA9IG5ldyBVSUNvbnRyb2xsZXIoKTtcbiAgICAgIFVJQ29udHJvbGxlci5pbnN0YW5jZS5pbml0KCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFVJQ29udHJvbGxlci5pbnN0YW5jZTtcbiAgfVxufVxuIiwiLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqXHJcbiAqIEBmaWxlb3ZlcnZpZXcgRmlyZWJhc2UgY29uc3RhbnRzLiAgU29tZSBvZiB0aGVzZSAoQGRlZmluZXMpIGNhbiBiZSBvdmVycmlkZGVuIGF0IGNvbXBpbGUtdGltZS5cclxuICovXHJcbmNvbnN0IENPTlNUQU5UUyA9IHtcclxuICAgIC8qKlxyXG4gICAgICogQGRlZmluZSB7Ym9vbGVhbn0gV2hldGhlciB0aGlzIGlzIHRoZSBjbGllbnQgTm9kZS5qcyBTREsuXHJcbiAgICAgKi9cclxuICAgIE5PREVfQ0xJRU5UOiBmYWxzZSxcclxuICAgIC8qKlxyXG4gICAgICogQGRlZmluZSB7Ym9vbGVhbn0gV2hldGhlciB0aGlzIGlzIHRoZSBBZG1pbiBOb2RlLmpzIFNESy5cclxuICAgICAqL1xyXG4gICAgTk9ERV9BRE1JTjogZmFsc2UsXHJcbiAgICAvKipcclxuICAgICAqIEZpcmViYXNlIFNESyBWZXJzaW9uXHJcbiAgICAgKi9cclxuICAgIFNES19WRVJTSU9OOiAnJHtKU0NPUkVfVkVSU0lPTn0nXHJcbn07XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbi8qKlxyXG4gKiBUaHJvd3MgYW4gZXJyb3IgaWYgdGhlIHByb3ZpZGVkIGFzc2VydGlvbiBpcyBmYWxzeVxyXG4gKi9cclxuY29uc3QgYXNzZXJ0ID0gZnVuY3Rpb24gKGFzc2VydGlvbiwgbWVzc2FnZSkge1xyXG4gICAgaWYgKCFhc3NlcnRpb24pIHtcclxuICAgICAgICB0aHJvdyBhc3NlcnRpb25FcnJvcihtZXNzYWdlKTtcclxuICAgIH1cclxufTtcclxuLyoqXHJcbiAqIFJldHVybnMgYW4gRXJyb3Igb2JqZWN0IHN1aXRhYmxlIGZvciB0aHJvd2luZy5cclxuICovXHJcbmNvbnN0IGFzc2VydGlvbkVycm9yID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcclxuICAgIHJldHVybiBuZXcgRXJyb3IoJ0ZpcmViYXNlIERhdGFiYXNlICgnICtcclxuICAgICAgICBDT05TVEFOVFMuU0RLX1ZFUlNJT04gK1xyXG4gICAgICAgICcpIElOVEVSTkFMIEFTU0VSVCBGQUlMRUQ6ICcgK1xyXG4gICAgICAgIG1lc3NhZ2UpO1xyXG59O1xuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5jb25zdCBzdHJpbmdUb0J5dGVBcnJheSQxID0gZnVuY3Rpb24gKHN0cikge1xyXG4gICAgLy8gVE9ETyh1c2VyKTogVXNlIG5hdGl2ZSBpbXBsZW1lbnRhdGlvbnMgaWYvd2hlbiBhdmFpbGFibGVcclxuICAgIGNvbnN0IG91dCA9IFtdO1xyXG4gICAgbGV0IHAgPSAwO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBsZXQgYyA9IHN0ci5jaGFyQ29kZUF0KGkpO1xyXG4gICAgICAgIGlmIChjIDwgMTI4KSB7XHJcbiAgICAgICAgICAgIG91dFtwKytdID0gYztcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoYyA8IDIwNDgpIHtcclxuICAgICAgICAgICAgb3V0W3ArK10gPSAoYyA+PiA2KSB8IDE5MjtcclxuICAgICAgICAgICAgb3V0W3ArK10gPSAoYyAmIDYzKSB8IDEyODtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoKGMgJiAweGZjMDApID09PSAweGQ4MDAgJiZcclxuICAgICAgICAgICAgaSArIDEgPCBzdHIubGVuZ3RoICYmXHJcbiAgICAgICAgICAgIChzdHIuY2hhckNvZGVBdChpICsgMSkgJiAweGZjMDApID09PSAweGRjMDApIHtcclxuICAgICAgICAgICAgLy8gU3Vycm9nYXRlIFBhaXJcclxuICAgICAgICAgICAgYyA9IDB4MTAwMDAgKyAoKGMgJiAweDAzZmYpIDw8IDEwKSArIChzdHIuY2hhckNvZGVBdCgrK2kpICYgMHgwM2ZmKTtcclxuICAgICAgICAgICAgb3V0W3ArK10gPSAoYyA+PiAxOCkgfCAyNDA7XHJcbiAgICAgICAgICAgIG91dFtwKytdID0gKChjID4+IDEyKSAmIDYzKSB8IDEyODtcclxuICAgICAgICAgICAgb3V0W3ArK10gPSAoKGMgPj4gNikgJiA2MykgfCAxMjg7XHJcbiAgICAgICAgICAgIG91dFtwKytdID0gKGMgJiA2MykgfCAxMjg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBvdXRbcCsrXSA9IChjID4+IDEyKSB8IDIyNDtcclxuICAgICAgICAgICAgb3V0W3ArK10gPSAoKGMgPj4gNikgJiA2MykgfCAxMjg7XHJcbiAgICAgICAgICAgIG91dFtwKytdID0gKGMgJiA2MykgfCAxMjg7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG91dDtcclxufTtcclxuLyoqXHJcbiAqIFR1cm5zIGFuIGFycmF5IG9mIG51bWJlcnMgaW50byB0aGUgc3RyaW5nIGdpdmVuIGJ5IHRoZSBjb25jYXRlbmF0aW9uIG9mIHRoZVxyXG4gKiBjaGFyYWN0ZXJzIHRvIHdoaWNoIHRoZSBudW1iZXJzIGNvcnJlc3BvbmQuXHJcbiAqIEBwYXJhbSBieXRlcyBBcnJheSBvZiBudW1iZXJzIHJlcHJlc2VudGluZyBjaGFyYWN0ZXJzLlxyXG4gKiBAcmV0dXJuIFN0cmluZ2lmaWNhdGlvbiBvZiB0aGUgYXJyYXkuXHJcbiAqL1xyXG5jb25zdCBieXRlQXJyYXlUb1N0cmluZyA9IGZ1bmN0aW9uIChieXRlcykge1xyXG4gICAgLy8gVE9ETyh1c2VyKTogVXNlIG5hdGl2ZSBpbXBsZW1lbnRhdGlvbnMgaWYvd2hlbiBhdmFpbGFibGVcclxuICAgIGNvbnN0IG91dCA9IFtdO1xyXG4gICAgbGV0IHBvcyA9IDAsIGMgPSAwO1xyXG4gICAgd2hpbGUgKHBvcyA8IGJ5dGVzLmxlbmd0aCkge1xyXG4gICAgICAgIGNvbnN0IGMxID0gYnl0ZXNbcG9zKytdO1xyXG4gICAgICAgIGlmIChjMSA8IDEyOCkge1xyXG4gICAgICAgICAgICBvdXRbYysrXSA9IFN0cmluZy5mcm9tQ2hhckNvZGUoYzEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChjMSA+IDE5MSAmJiBjMSA8IDIyNCkge1xyXG4gICAgICAgICAgICBjb25zdCBjMiA9IGJ5dGVzW3BvcysrXTtcclxuICAgICAgICAgICAgb3V0W2MrK10gPSBTdHJpbmcuZnJvbUNoYXJDb2RlKCgoYzEgJiAzMSkgPDwgNikgfCAoYzIgJiA2MykpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChjMSA+IDIzOSAmJiBjMSA8IDM2NSkge1xyXG4gICAgICAgICAgICAvLyBTdXJyb2dhdGUgUGFpclxyXG4gICAgICAgICAgICBjb25zdCBjMiA9IGJ5dGVzW3BvcysrXTtcclxuICAgICAgICAgICAgY29uc3QgYzMgPSBieXRlc1twb3MrK107XHJcbiAgICAgICAgICAgIGNvbnN0IGM0ID0gYnl0ZXNbcG9zKytdO1xyXG4gICAgICAgICAgICBjb25zdCB1ID0gKCgoYzEgJiA3KSA8PCAxOCkgfCAoKGMyICYgNjMpIDw8IDEyKSB8ICgoYzMgJiA2MykgPDwgNikgfCAoYzQgJiA2MykpIC1cclxuICAgICAgICAgICAgICAgIDB4MTAwMDA7XHJcbiAgICAgICAgICAgIG91dFtjKytdID0gU3RyaW5nLmZyb21DaGFyQ29kZSgweGQ4MDAgKyAodSA+PiAxMCkpO1xyXG4gICAgICAgICAgICBvdXRbYysrXSA9IFN0cmluZy5mcm9tQ2hhckNvZGUoMHhkYzAwICsgKHUgJiAxMDIzKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCBjMiA9IGJ5dGVzW3BvcysrXTtcclxuICAgICAgICAgICAgY29uc3QgYzMgPSBieXRlc1twb3MrK107XHJcbiAgICAgICAgICAgIG91dFtjKytdID0gU3RyaW5nLmZyb21DaGFyQ29kZSgoKGMxICYgMTUpIDw8IDEyKSB8ICgoYzIgJiA2MykgPDwgNikgfCAoYzMgJiA2MykpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBvdXQuam9pbignJyk7XHJcbn07XHJcbi8vIFdlIGRlZmluZSBpdCBhcyBhbiBvYmplY3QgbGl0ZXJhbCBpbnN0ZWFkIG9mIGEgY2xhc3MgYmVjYXVzZSBhIGNsYXNzIGNvbXBpbGVkIGRvd24gdG8gZXM1IGNhbid0XHJcbi8vIGJlIHRyZWVzaGFrZWQuIGh0dHBzOi8vZ2l0aHViLmNvbS9yb2xsdXAvcm9sbHVwL2lzc3Vlcy8xNjkxXHJcbi8vIFN0YXRpYyBsb29rdXAgbWFwcywgbGF6aWx5IHBvcHVsYXRlZCBieSBpbml0XygpXHJcbmNvbnN0IGJhc2U2NCA9IHtcclxuICAgIC8qKlxyXG4gICAgICogTWFwcyBieXRlcyB0byBjaGFyYWN0ZXJzLlxyXG4gICAgICovXHJcbiAgICBieXRlVG9DaGFyTWFwXzogbnVsbCxcclxuICAgIC8qKlxyXG4gICAgICogTWFwcyBjaGFyYWN0ZXJzIHRvIGJ5dGVzLlxyXG4gICAgICovXHJcbiAgICBjaGFyVG9CeXRlTWFwXzogbnVsbCxcclxuICAgIC8qKlxyXG4gICAgICogTWFwcyBieXRlcyB0byB3ZWJzYWZlIGNoYXJhY3RlcnMuXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBieXRlVG9DaGFyTWFwV2ViU2FmZV86IG51bGwsXHJcbiAgICAvKipcclxuICAgICAqIE1hcHMgd2Vic2FmZSBjaGFyYWN0ZXJzIHRvIGJ5dGVzLlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgY2hhclRvQnl0ZU1hcFdlYlNhZmVfOiBudWxsLFxyXG4gICAgLyoqXHJcbiAgICAgKiBPdXIgZGVmYXVsdCBhbHBoYWJldCwgc2hhcmVkIGJldHdlZW5cclxuICAgICAqIEVOQ09ERURfVkFMUyBhbmQgRU5DT0RFRF9WQUxTX1dFQlNBRkVcclxuICAgICAqL1xyXG4gICAgRU5DT0RFRF9WQUxTX0JBU0U6ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWicgKyAnYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXonICsgJzAxMjM0NTY3ODknLFxyXG4gICAgLyoqXHJcbiAgICAgKiBPdXIgZGVmYXVsdCBhbHBoYWJldC4gVmFsdWUgNjQgKD0pIGlzIHNwZWNpYWw7IGl0IG1lYW5zIFwibm90aGluZy5cIlxyXG4gICAgICovXHJcbiAgICBnZXQgRU5DT0RFRF9WQUxTKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLkVOQ09ERURfVkFMU19CQVNFICsgJysvPSc7XHJcbiAgICB9LFxyXG4gICAgLyoqXHJcbiAgICAgKiBPdXIgd2Vic2FmZSBhbHBoYWJldC5cclxuICAgICAqL1xyXG4gICAgZ2V0IEVOQ09ERURfVkFMU19XRUJTQUZFKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLkVOQ09ERURfVkFMU19CQVNFICsgJy1fLic7XHJcbiAgICB9LFxyXG4gICAgLyoqXHJcbiAgICAgKiBXaGV0aGVyIHRoaXMgYnJvd3NlciBzdXBwb3J0cyB0aGUgYXRvYiBhbmQgYnRvYSBmdW5jdGlvbnMuIFRoaXMgZXh0ZW5zaW9uXHJcbiAgICAgKiBzdGFydGVkIGF0IE1vemlsbGEgYnV0IGlzIG5vdyBpbXBsZW1lbnRlZCBieSBtYW55IGJyb3dzZXJzLiBXZSB1c2UgdGhlXHJcbiAgICAgKiBBU1NVTUVfKiB2YXJpYWJsZXMgdG8gYXZvaWQgcHVsbGluZyBpbiB0aGUgZnVsbCB1c2VyYWdlbnQgZGV0ZWN0aW9uIGxpYnJhcnlcclxuICAgICAqIGJ1dCBzdGlsbCBhbGxvd2luZyB0aGUgc3RhbmRhcmQgcGVyLWJyb3dzZXIgY29tcGlsYXRpb25zLlxyXG4gICAgICpcclxuICAgICAqL1xyXG4gICAgSEFTX05BVElWRV9TVVBQT1JUOiB0eXBlb2YgYXRvYiA9PT0gJ2Z1bmN0aW9uJyxcclxuICAgIC8qKlxyXG4gICAgICogQmFzZTY0LWVuY29kZSBhbiBhcnJheSBvZiBieXRlcy5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gaW5wdXQgQW4gYXJyYXkgb2YgYnl0ZXMgKG51bWJlcnMgd2l0aFxyXG4gICAgICogICAgIHZhbHVlIGluIFswLCAyNTVdKSB0byBlbmNvZGUuXHJcbiAgICAgKiBAcGFyYW0gd2ViU2FmZSBCb29sZWFuIGluZGljYXRpbmcgd2Ugc2hvdWxkIHVzZSB0aGVcclxuICAgICAqICAgICBhbHRlcm5hdGl2ZSBhbHBoYWJldC5cclxuICAgICAqIEByZXR1cm4gVGhlIGJhc2U2NCBlbmNvZGVkIHN0cmluZy5cclxuICAgICAqL1xyXG4gICAgZW5jb2RlQnl0ZUFycmF5KGlucHV0LCB3ZWJTYWZlKSB7XHJcbiAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGlucHV0KSkge1xyXG4gICAgICAgICAgICB0aHJvdyBFcnJvcignZW5jb2RlQnl0ZUFycmF5IHRha2VzIGFuIGFycmF5IGFzIGEgcGFyYW1ldGVyJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuaW5pdF8oKTtcclxuICAgICAgICBjb25zdCBieXRlVG9DaGFyTWFwID0gd2ViU2FmZVxyXG4gICAgICAgICAgICA/IHRoaXMuYnl0ZVRvQ2hhck1hcFdlYlNhZmVfXHJcbiAgICAgICAgICAgIDogdGhpcy5ieXRlVG9DaGFyTWFwXztcclxuICAgICAgICBjb25zdCBvdXRwdXQgPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGlucHV0Lmxlbmd0aDsgaSArPSAzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGJ5dGUxID0gaW5wdXRbaV07XHJcbiAgICAgICAgICAgIGNvbnN0IGhhdmVCeXRlMiA9IGkgKyAxIDwgaW5wdXQubGVuZ3RoO1xyXG4gICAgICAgICAgICBjb25zdCBieXRlMiA9IGhhdmVCeXRlMiA/IGlucHV0W2kgKyAxXSA6IDA7XHJcbiAgICAgICAgICAgIGNvbnN0IGhhdmVCeXRlMyA9IGkgKyAyIDwgaW5wdXQubGVuZ3RoO1xyXG4gICAgICAgICAgICBjb25zdCBieXRlMyA9IGhhdmVCeXRlMyA/IGlucHV0W2kgKyAyXSA6IDA7XHJcbiAgICAgICAgICAgIGNvbnN0IG91dEJ5dGUxID0gYnl0ZTEgPj4gMjtcclxuICAgICAgICAgICAgY29uc3Qgb3V0Qnl0ZTIgPSAoKGJ5dGUxICYgMHgwMykgPDwgNCkgfCAoYnl0ZTIgPj4gNCk7XHJcbiAgICAgICAgICAgIGxldCBvdXRCeXRlMyA9ICgoYnl0ZTIgJiAweDBmKSA8PCAyKSB8IChieXRlMyA+PiA2KTtcclxuICAgICAgICAgICAgbGV0IG91dEJ5dGU0ID0gYnl0ZTMgJiAweDNmO1xyXG4gICAgICAgICAgICBpZiAoIWhhdmVCeXRlMykge1xyXG4gICAgICAgICAgICAgICAgb3V0Qnl0ZTQgPSA2NDtcclxuICAgICAgICAgICAgICAgIGlmICghaGF2ZUJ5dGUyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3V0Qnl0ZTMgPSA2NDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvdXRwdXQucHVzaChieXRlVG9DaGFyTWFwW291dEJ5dGUxXSwgYnl0ZVRvQ2hhck1hcFtvdXRCeXRlMl0sIGJ5dGVUb0NoYXJNYXBbb3V0Qnl0ZTNdLCBieXRlVG9DaGFyTWFwW291dEJ5dGU0XSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBvdXRwdXQuam9pbignJyk7XHJcbiAgICB9LFxyXG4gICAgLyoqXHJcbiAgICAgKiBCYXNlNjQtZW5jb2RlIGEgc3RyaW5nLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBpbnB1dCBBIHN0cmluZyB0byBlbmNvZGUuXHJcbiAgICAgKiBAcGFyYW0gd2ViU2FmZSBJZiB0cnVlLCB3ZSBzaG91bGQgdXNlIHRoZVxyXG4gICAgICogICAgIGFsdGVybmF0aXZlIGFscGhhYmV0LlxyXG4gICAgICogQHJldHVybiBUaGUgYmFzZTY0IGVuY29kZWQgc3RyaW5nLlxyXG4gICAgICovXHJcbiAgICBlbmNvZGVTdHJpbmcoaW5wdXQsIHdlYlNhZmUpIHtcclxuICAgICAgICAvLyBTaG9ydGN1dCBmb3IgTW96aWxsYSBicm93c2VycyB0aGF0IGltcGxlbWVudFxyXG4gICAgICAgIC8vIGEgbmF0aXZlIGJhc2U2NCBlbmNvZGVyIGluIHRoZSBmb3JtIG9mIFwiYnRvYS9hdG9iXCJcclxuICAgICAgICBpZiAodGhpcy5IQVNfTkFUSVZFX1NVUFBPUlQgJiYgIXdlYlNhZmUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGJ0b2EoaW5wdXQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5lbmNvZGVCeXRlQXJyYXkoc3RyaW5nVG9CeXRlQXJyYXkkMShpbnB1dCksIHdlYlNhZmUpO1xyXG4gICAgfSxcclxuICAgIC8qKlxyXG4gICAgICogQmFzZTY0LWRlY29kZSBhIHN0cmluZy5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gaW5wdXQgdG8gZGVjb2RlLlxyXG4gICAgICogQHBhcmFtIHdlYlNhZmUgVHJ1ZSBpZiB3ZSBzaG91bGQgdXNlIHRoZVxyXG4gICAgICogICAgIGFsdGVybmF0aXZlIGFscGhhYmV0LlxyXG4gICAgICogQHJldHVybiBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSBkZWNvZGVkIHZhbHVlLlxyXG4gICAgICovXHJcbiAgICBkZWNvZGVTdHJpbmcoaW5wdXQsIHdlYlNhZmUpIHtcclxuICAgICAgICAvLyBTaG9ydGN1dCBmb3IgTW96aWxsYSBicm93c2VycyB0aGF0IGltcGxlbWVudFxyXG4gICAgICAgIC8vIGEgbmF0aXZlIGJhc2U2NCBlbmNvZGVyIGluIHRoZSBmb3JtIG9mIFwiYnRvYS9hdG9iXCJcclxuICAgICAgICBpZiAodGhpcy5IQVNfTkFUSVZFX1NVUFBPUlQgJiYgIXdlYlNhZmUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGF0b2IoaW5wdXQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYnl0ZUFycmF5VG9TdHJpbmcodGhpcy5kZWNvZGVTdHJpbmdUb0J5dGVBcnJheShpbnB1dCwgd2ViU2FmZSkpO1xyXG4gICAgfSxcclxuICAgIC8qKlxyXG4gICAgICogQmFzZTY0LWRlY29kZSBhIHN0cmluZy5cclxuICAgICAqXHJcbiAgICAgKiBJbiBiYXNlLTY0IGRlY29kaW5nLCBncm91cHMgb2YgZm91ciBjaGFyYWN0ZXJzIGFyZSBjb252ZXJ0ZWQgaW50byB0aHJlZVxyXG4gICAgICogYnl0ZXMuICBJZiB0aGUgZW5jb2RlciBkaWQgbm90IGFwcGx5IHBhZGRpbmcsIHRoZSBpbnB1dCBsZW5ndGggbWF5IG5vdFxyXG4gICAgICogYmUgYSBtdWx0aXBsZSBvZiA0LlxyXG4gICAgICpcclxuICAgICAqIEluIHRoaXMgY2FzZSwgdGhlIGxhc3QgZ3JvdXAgd2lsbCBoYXZlIGZld2VyIHRoYW4gNCBjaGFyYWN0ZXJzLCBhbmRcclxuICAgICAqIHBhZGRpbmcgd2lsbCBiZSBpbmZlcnJlZC4gIElmIHRoZSBncm91cCBoYXMgb25lIG9yIHR3byBjaGFyYWN0ZXJzLCBpdCBkZWNvZGVzXHJcbiAgICAgKiB0byBvbmUgYnl0ZS4gIElmIHRoZSBncm91cCBoYXMgdGhyZWUgY2hhcmFjdGVycywgaXQgZGVjb2RlcyB0byB0d28gYnl0ZXMuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGlucHV0IElucHV0IHRvIGRlY29kZS5cclxuICAgICAqIEBwYXJhbSB3ZWJTYWZlIFRydWUgaWYgd2Ugc2hvdWxkIHVzZSB0aGUgd2ViLXNhZmUgYWxwaGFiZXQuXHJcbiAgICAgKiBAcmV0dXJuIGJ5dGVzIHJlcHJlc2VudGluZyB0aGUgZGVjb2RlZCB2YWx1ZS5cclxuICAgICAqL1xyXG4gICAgZGVjb2RlU3RyaW5nVG9CeXRlQXJyYXkoaW5wdXQsIHdlYlNhZmUpIHtcclxuICAgICAgICB0aGlzLmluaXRfKCk7XHJcbiAgICAgICAgY29uc3QgY2hhclRvQnl0ZU1hcCA9IHdlYlNhZmVcclxuICAgICAgICAgICAgPyB0aGlzLmNoYXJUb0J5dGVNYXBXZWJTYWZlX1xyXG4gICAgICAgICAgICA6IHRoaXMuY2hhclRvQnl0ZU1hcF87XHJcbiAgICAgICAgY29uc3Qgb3V0cHV0ID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbnB1dC5sZW5ndGg7KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGJ5dGUxID0gY2hhclRvQnl0ZU1hcFtpbnB1dC5jaGFyQXQoaSsrKV07XHJcbiAgICAgICAgICAgIGNvbnN0IGhhdmVCeXRlMiA9IGkgPCBpbnB1dC5sZW5ndGg7XHJcbiAgICAgICAgICAgIGNvbnN0IGJ5dGUyID0gaGF2ZUJ5dGUyID8gY2hhclRvQnl0ZU1hcFtpbnB1dC5jaGFyQXQoaSldIDogMDtcclxuICAgICAgICAgICAgKytpO1xyXG4gICAgICAgICAgICBjb25zdCBoYXZlQnl0ZTMgPSBpIDwgaW5wdXQubGVuZ3RoO1xyXG4gICAgICAgICAgICBjb25zdCBieXRlMyA9IGhhdmVCeXRlMyA/IGNoYXJUb0J5dGVNYXBbaW5wdXQuY2hhckF0KGkpXSA6IDY0O1xyXG4gICAgICAgICAgICArK2k7XHJcbiAgICAgICAgICAgIGNvbnN0IGhhdmVCeXRlNCA9IGkgPCBpbnB1dC5sZW5ndGg7XHJcbiAgICAgICAgICAgIGNvbnN0IGJ5dGU0ID0gaGF2ZUJ5dGU0ID8gY2hhclRvQnl0ZU1hcFtpbnB1dC5jaGFyQXQoaSldIDogNjQ7XHJcbiAgICAgICAgICAgICsraTtcclxuICAgICAgICAgICAgaWYgKGJ5dGUxID09IG51bGwgfHwgYnl0ZTIgPT0gbnVsbCB8fCBieXRlMyA9PSBudWxsIHx8IGJ5dGU0ID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IEVycm9yKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3Qgb3V0Qnl0ZTEgPSAoYnl0ZTEgPDwgMikgfCAoYnl0ZTIgPj4gNCk7XHJcbiAgICAgICAgICAgIG91dHB1dC5wdXNoKG91dEJ5dGUxKTtcclxuICAgICAgICAgICAgaWYgKGJ5dGUzICE9PSA2NCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgb3V0Qnl0ZTIgPSAoKGJ5dGUyIDw8IDQpICYgMHhmMCkgfCAoYnl0ZTMgPj4gMik7XHJcbiAgICAgICAgICAgICAgICBvdXRwdXQucHVzaChvdXRCeXRlMik7XHJcbiAgICAgICAgICAgICAgICBpZiAoYnl0ZTQgIT09IDY0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgb3V0Qnl0ZTMgPSAoKGJ5dGUzIDw8IDYpICYgMHhjMCkgfCBieXRlNDtcclxuICAgICAgICAgICAgICAgICAgICBvdXRwdXQucHVzaChvdXRCeXRlMyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG91dHB1dDtcclxuICAgIH0sXHJcbiAgICAvKipcclxuICAgICAqIExhenkgc3RhdGljIGluaXRpYWxpemF0aW9uIGZ1bmN0aW9uLiBDYWxsZWQgYmVmb3JlXHJcbiAgICAgKiBhY2Nlc3NpbmcgYW55IG9mIHRoZSBzdGF0aWMgbWFwIHZhcmlhYmxlcy5cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIGluaXRfKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5ieXRlVG9DaGFyTWFwXykge1xyXG4gICAgICAgICAgICB0aGlzLmJ5dGVUb0NoYXJNYXBfID0ge307XHJcbiAgICAgICAgICAgIHRoaXMuY2hhclRvQnl0ZU1hcF8gPSB7fTtcclxuICAgICAgICAgICAgdGhpcy5ieXRlVG9DaGFyTWFwV2ViU2FmZV8gPSB7fTtcclxuICAgICAgICAgICAgdGhpcy5jaGFyVG9CeXRlTWFwV2ViU2FmZV8gPSB7fTtcclxuICAgICAgICAgICAgLy8gV2Ugd2FudCBxdWljayBtYXBwaW5ncyBiYWNrIGFuZCBmb3J0aCwgc28gd2UgcHJlY29tcHV0ZSB0d28gbWFwcy5cclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLkVOQ09ERURfVkFMUy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ieXRlVG9DaGFyTWFwX1tpXSA9IHRoaXMuRU5DT0RFRF9WQUxTLmNoYXJBdChpKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2hhclRvQnl0ZU1hcF9bdGhpcy5ieXRlVG9DaGFyTWFwX1tpXV0gPSBpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ieXRlVG9DaGFyTWFwV2ViU2FmZV9baV0gPSB0aGlzLkVOQ09ERURfVkFMU19XRUJTQUZFLmNoYXJBdChpKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2hhclRvQnl0ZU1hcFdlYlNhZmVfW3RoaXMuYnl0ZVRvQ2hhck1hcFdlYlNhZmVfW2ldXSA9IGk7XHJcbiAgICAgICAgICAgICAgICAvLyBCZSBmb3JnaXZpbmcgd2hlbiBkZWNvZGluZyBhbmQgY29ycmVjdGx5IGRlY29kZSBib3RoIGVuY29kaW5ncy5cclxuICAgICAgICAgICAgICAgIGlmIChpID49IHRoaXMuRU5DT0RFRF9WQUxTX0JBU0UubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGFyVG9CeXRlTWFwX1t0aGlzLkVOQ09ERURfVkFMU19XRUJTQUZFLmNoYXJBdChpKV0gPSBpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hhclRvQnl0ZU1hcFdlYlNhZmVfW3RoaXMuRU5DT0RFRF9WQUxTLmNoYXJBdChpKV0gPSBpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG4vKipcclxuICogVVJMLXNhZmUgYmFzZTY0IGVuY29kaW5nXHJcbiAqL1xyXG5jb25zdCBiYXNlNjRFbmNvZGUgPSBmdW5jdGlvbiAoc3RyKSB7XHJcbiAgICBjb25zdCB1dGY4Qnl0ZXMgPSBzdHJpbmdUb0J5dGVBcnJheSQxKHN0cik7XHJcbiAgICByZXR1cm4gYmFzZTY0LmVuY29kZUJ5dGVBcnJheSh1dGY4Qnl0ZXMsIHRydWUpO1xyXG59O1xyXG4vKipcclxuICogVVJMLXNhZmUgYmFzZTY0IGVuY29kaW5nICh3aXRob3V0IFwiLlwiIHBhZGRpbmcgaW4gdGhlIGVuZCkuXHJcbiAqIGUuZy4gVXNlZCBpbiBKU09OIFdlYiBUb2tlbiAoSldUKSBwYXJ0cy5cclxuICovXHJcbmNvbnN0IGJhc2U2NHVybEVuY29kZVdpdGhvdXRQYWRkaW5nID0gZnVuY3Rpb24gKHN0cikge1xyXG4gICAgLy8gVXNlIGJhc2U2NHVybCBlbmNvZGluZyBhbmQgcmVtb3ZlIHBhZGRpbmcgaW4gdGhlIGVuZCAoZG90IGNoYXJhY3RlcnMpLlxyXG4gICAgcmV0dXJuIGJhc2U2NEVuY29kZShzdHIpLnJlcGxhY2UoL1xcLi9nLCAnJyk7XHJcbn07XHJcbi8qKlxyXG4gKiBVUkwtc2FmZSBiYXNlNjQgZGVjb2RpbmdcclxuICpcclxuICogTk9URTogRE8gTk9UIHVzZSB0aGUgZ2xvYmFsIGF0b2IoKSBmdW5jdGlvbiAtIGl0IGRvZXMgTk9UIHN1cHBvcnQgdGhlXHJcbiAqIGJhc2U2NFVybCB2YXJpYW50IGVuY29kaW5nLlxyXG4gKlxyXG4gKiBAcGFyYW0gc3RyIFRvIGJlIGRlY29kZWRcclxuICogQHJldHVybiBEZWNvZGVkIHJlc3VsdCwgaWYgcG9zc2libGVcclxuICovXHJcbmNvbnN0IGJhc2U2NERlY29kZSA9IGZ1bmN0aW9uIChzdHIpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgcmV0dXJuIGJhc2U2NC5kZWNvZGVTdHJpbmcoc3RyLCB0cnVlKTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcignYmFzZTY0RGVjb2RlIGZhaWxlZDogJywgZSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxufTtcblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqXHJcbiAqIERvIGEgZGVlcC1jb3B5IG9mIGJhc2ljIEphdmFTY3JpcHQgT2JqZWN0cyBvciBBcnJheXMuXHJcbiAqL1xyXG5mdW5jdGlvbiBkZWVwQ29weSh2YWx1ZSkge1xyXG4gICAgcmV0dXJuIGRlZXBFeHRlbmQodW5kZWZpbmVkLCB2YWx1ZSk7XHJcbn1cclxuLyoqXHJcbiAqIENvcHkgcHJvcGVydGllcyBmcm9tIHNvdXJjZSB0byB0YXJnZXQgKHJlY3Vyc2l2ZWx5IGFsbG93cyBleHRlbnNpb25cclxuICogb2YgT2JqZWN0cyBhbmQgQXJyYXlzKS4gIFNjYWxhciB2YWx1ZXMgaW4gdGhlIHRhcmdldCBhcmUgb3Zlci13cml0dGVuLlxyXG4gKiBJZiB0YXJnZXQgaXMgdW5kZWZpbmVkLCBhbiBvYmplY3Qgb2YgdGhlIGFwcHJvcHJpYXRlIHR5cGUgd2lsbCBiZSBjcmVhdGVkXHJcbiAqIChhbmQgcmV0dXJuZWQpLlxyXG4gKlxyXG4gKiBXZSByZWN1cnNpdmVseSBjb3B5IGFsbCBjaGlsZCBwcm9wZXJ0aWVzIG9mIHBsYWluIE9iamVjdHMgaW4gdGhlIHNvdXJjZS0gc29cclxuICogdGhhdCBuYW1lc3BhY2UtIGxpa2UgZGljdGlvbmFyaWVzIGFyZSBtZXJnZWQuXHJcbiAqXHJcbiAqIE5vdGUgdGhhdCB0aGUgdGFyZ2V0IGNhbiBiZSBhIGZ1bmN0aW9uLCBpbiB3aGljaCBjYXNlIHRoZSBwcm9wZXJ0aWVzIGluXHJcbiAqIHRoZSBzb3VyY2UgT2JqZWN0IGFyZSBjb3BpZWQgb250byBpdCBhcyBzdGF0aWMgcHJvcGVydGllcyBvZiB0aGUgRnVuY3Rpb24uXHJcbiAqXHJcbiAqIE5vdGU6IHdlIGRvbid0IG1lcmdlIF9fcHJvdG9fXyB0byBwcmV2ZW50IHByb3RvdHlwZSBwb2xsdXRpb25cclxuICovXHJcbmZ1bmN0aW9uIGRlZXBFeHRlbmQodGFyZ2V0LCBzb3VyY2UpIHtcclxuICAgIGlmICghKHNvdXJjZSBpbnN0YW5jZW9mIE9iamVjdCkpIHtcclxuICAgICAgICByZXR1cm4gc291cmNlO1xyXG4gICAgfVxyXG4gICAgc3dpdGNoIChzb3VyY2UuY29uc3RydWN0b3IpIHtcclxuICAgICAgICBjYXNlIERhdGU6XHJcbiAgICAgICAgICAgIC8vIFRyZWF0IERhdGVzIGxpa2Ugc2NhbGFyczsgaWYgdGhlIHRhcmdldCBkYXRlIG9iamVjdCBoYWQgYW55IGNoaWxkXHJcbiAgICAgICAgICAgIC8vIHByb3BlcnRpZXMgLSB0aGV5IHdpbGwgYmUgbG9zdCFcclxuICAgICAgICAgICAgY29uc3QgZGF0ZVZhbHVlID0gc291cmNlO1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IERhdGUoZGF0ZVZhbHVlLmdldFRpbWUoKSk7XHJcbiAgICAgICAgY2FzZSBPYmplY3Q6XHJcbiAgICAgICAgICAgIGlmICh0YXJnZXQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0ID0ge307XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBBcnJheTpcclxuICAgICAgICAgICAgLy8gQWx3YXlzIGNvcHkgdGhlIGFycmF5IHNvdXJjZSBhbmQgb3ZlcndyaXRlIHRoZSB0YXJnZXQuXHJcbiAgICAgICAgICAgIHRhcmdldCA9IFtdO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAvLyBOb3QgYSBwbGFpbiBPYmplY3QgLSB0cmVhdCBpdCBhcyBhIHNjYWxhci5cclxuICAgICAgICAgICAgcmV0dXJuIHNvdXJjZTtcclxuICAgIH1cclxuICAgIGZvciAoY29uc3QgcHJvcCBpbiBzb3VyY2UpIHtcclxuICAgICAgICAvLyB1c2UgaXNWYWxpZEtleSB0byBndWFyZCBhZ2FpbnN0IHByb3RvdHlwZSBwb2xsdXRpb24uIFNlZSBodHRwczovL3NueWsuaW8vdnVsbi9TTllLLUpTLUxPREFTSC00NTAyMDJcclxuICAgICAgICBpZiAoIXNvdXJjZS5oYXNPd25Qcm9wZXJ0eShwcm9wKSB8fCAhaXNWYWxpZEtleShwcm9wKSkge1xyXG4gICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGFyZ2V0W3Byb3BdID0gZGVlcEV4dGVuZCh0YXJnZXRbcHJvcF0sIHNvdXJjZVtwcm9wXSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGFyZ2V0O1xyXG59XHJcbmZ1bmN0aW9uIGlzVmFsaWRLZXkoa2V5KSB7XHJcbiAgICByZXR1cm4ga2V5ICE9PSAnX19wcm90b19fJztcclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG4vKipcclxuICogUmV0dXJucyBuYXZpZ2F0b3IudXNlckFnZW50IHN0cmluZyBvciAnJyBpZiBpdCdzIG5vdCBkZWZpbmVkLlxyXG4gKiBAcmV0dXJuIHVzZXIgYWdlbnQgc3RyaW5nXHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRVQSgpIHtcclxuICAgIGlmICh0eXBlb2YgbmF2aWdhdG9yICE9PSAndW5kZWZpbmVkJyAmJlxyXG4gICAgICAgIHR5cGVvZiBuYXZpZ2F0b3JbJ3VzZXJBZ2VudCddID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgIHJldHVybiBuYXZpZ2F0b3JbJ3VzZXJBZ2VudCddO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuICcnO1xyXG4gICAgfVxyXG59XHJcbi8qKlxyXG4gKiBEZXRlY3QgQ29yZG92YSAvIFBob25lR2FwIC8gSW9uaWMgZnJhbWV3b3JrcyBvbiBhIG1vYmlsZSBkZXZpY2UuXHJcbiAqXHJcbiAqIERlbGliZXJhdGVseSBkb2VzIG5vdCByZWx5IG9uIGNoZWNraW5nIGBmaWxlOi8vYCBVUkxzIChhcyB0aGlzIGZhaWxzIFBob25lR2FwXHJcbiAqIGluIHRoZSBSaXBwbGUgZW11bGF0b3IpIG5vciBDb3Jkb3ZhIGBvbkRldmljZVJlYWR5YCwgd2hpY2ggd291bGQgbm9ybWFsbHlcclxuICogd2FpdCBmb3IgYSBjYWxsYmFjay5cclxuICovXHJcbmZ1bmN0aW9uIGlzTW9iaWxlQ29yZG92YSgpIHtcclxuICAgIHJldHVybiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiZcclxuICAgICAgICAvLyBAdHMtaWdub3JlIFNldHRpbmcgdXAgYW4gYnJvYWRseSBhcHBsaWNhYmxlIGluZGV4IHNpZ25hdHVyZSBmb3IgV2luZG93XHJcbiAgICAgICAgLy8ganVzdCB0byBkZWFsIHdpdGggdGhpcyBjYXNlIHdvdWxkIHByb2JhYmx5IGJlIGEgYmFkIGlkZWEuXHJcbiAgICAgICAgISEod2luZG93Wydjb3Jkb3ZhJ10gfHwgd2luZG93WydwaG9uZWdhcCddIHx8IHdpbmRvd1snUGhvbmVHYXAnXSkgJiZcclxuICAgICAgICAvaW9zfGlwaG9uZXxpcG9kfGlwYWR8YW5kcm9pZHxibGFja2JlcnJ5fGllbW9iaWxlL2kudGVzdChnZXRVQSgpKSk7XHJcbn1cclxuLyoqXHJcbiAqIERldGVjdCBOb2RlLmpzLlxyXG4gKlxyXG4gKiBAcmV0dXJuIHRydWUgaWYgTm9kZS5qcyBlbnZpcm9ubWVudCBpcyBkZXRlY3RlZC5cclxuICovXHJcbi8vIE5vZGUgZGV0ZWN0aW9uIGxvZ2ljIGZyb206IGh0dHBzOi8vZ2l0aHViLmNvbS9pbGlha2FuL2RldGVjdC1ub2RlL1xyXG5mdW5jdGlvbiBpc05vZGUoKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHJldHVybiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGdsb2JhbC5wcm9jZXNzKSA9PT0gJ1tvYmplY3QgcHJvY2Vzc10nKTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG59XHJcbi8qKlxyXG4gKiBEZXRlY3QgQnJvd3NlciBFbnZpcm9ubWVudFxyXG4gKi9cclxuZnVuY3Rpb24gaXNCcm93c2VyKCkge1xyXG4gICAgcmV0dXJuIHR5cGVvZiBzZWxmID09PSAnb2JqZWN0JyAmJiBzZWxmLnNlbGYgPT09IHNlbGY7XHJcbn1cclxuZnVuY3Rpb24gaXNCcm93c2VyRXh0ZW5zaW9uKCkge1xyXG4gICAgY29uc3QgcnVudGltZSA9IHR5cGVvZiBjaHJvbWUgPT09ICdvYmplY3QnXHJcbiAgICAgICAgPyBjaHJvbWUucnVudGltZVxyXG4gICAgICAgIDogdHlwZW9mIGJyb3dzZXIgPT09ICdvYmplY3QnXHJcbiAgICAgICAgICAgID8gYnJvd3Nlci5ydW50aW1lXHJcbiAgICAgICAgICAgIDogdW5kZWZpbmVkO1xyXG4gICAgcmV0dXJuIHR5cGVvZiBydW50aW1lID09PSAnb2JqZWN0JyAmJiBydW50aW1lLmlkICE9PSB1bmRlZmluZWQ7XHJcbn1cclxuLyoqXHJcbiAqIERldGVjdCBSZWFjdCBOYXRpdmUuXHJcbiAqXHJcbiAqIEByZXR1cm4gdHJ1ZSBpZiBSZWFjdE5hdGl2ZSBlbnZpcm9ubWVudCBpcyBkZXRlY3RlZC5cclxuICovXHJcbmZ1bmN0aW9uIGlzUmVhY3ROYXRpdmUoKSB7XHJcbiAgICByZXR1cm4gKHR5cGVvZiBuYXZpZ2F0b3IgPT09ICdvYmplY3QnICYmIG5hdmlnYXRvclsncHJvZHVjdCddID09PSAnUmVhY3ROYXRpdmUnKTtcclxufVxyXG4vKiogRGV0ZWN0cyBFbGVjdHJvbiBhcHBzLiAqL1xyXG5mdW5jdGlvbiBpc0VsZWN0cm9uKCkge1xyXG4gICAgcmV0dXJuIGdldFVBKCkuaW5kZXhPZignRWxlY3Ryb24vJykgPj0gMDtcclxufVxyXG4vKiogRGV0ZWN0cyBJbnRlcm5ldCBFeHBsb3Jlci4gKi9cclxuZnVuY3Rpb24gaXNJRSgpIHtcclxuICAgIGNvbnN0IHVhID0gZ2V0VUEoKTtcclxuICAgIHJldHVybiB1YS5pbmRleE9mKCdNU0lFICcpID49IDAgfHwgdWEuaW5kZXhPZignVHJpZGVudC8nKSA+PSAwO1xyXG59XHJcbi8qKiBEZXRlY3RzIFVuaXZlcnNhbCBXaW5kb3dzIFBsYXRmb3JtIGFwcHMuICovXHJcbmZ1bmN0aW9uIGlzVVdQKCkge1xyXG4gICAgcmV0dXJuIGdldFVBKCkuaW5kZXhPZignTVNBcHBIb3N0LycpID49IDA7XHJcbn1cclxuLyoqXHJcbiAqIERldGVjdCB3aGV0aGVyIHRoZSBjdXJyZW50IFNESyBidWlsZCBpcyB0aGUgTm9kZSB2ZXJzaW9uLlxyXG4gKlxyXG4gKiBAcmV0dXJuIHRydWUgaWYgaXQncyB0aGUgTm9kZSBTREsgYnVpbGQuXHJcbiAqL1xyXG5mdW5jdGlvbiBpc05vZGVTZGsoKSB7XHJcbiAgICByZXR1cm4gQ09OU1RBTlRTLk5PREVfQ0xJRU5UID09PSB0cnVlIHx8IENPTlNUQU5UUy5OT0RFX0FETUlOID09PSB0cnVlO1xyXG59XHJcbi8qKiBSZXR1cm5zIHRydWUgaWYgd2UgYXJlIHJ1bm5pbmcgaW4gU2FmYXJpLiAqL1xyXG5mdW5jdGlvbiBpc1NhZmFyaSgpIHtcclxuICAgIHJldHVybiAoIWlzTm9kZSgpICYmXHJcbiAgICAgICAgbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmNsdWRlcygnU2FmYXJpJykgJiZcclxuICAgICAgICAhbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmNsdWRlcygnQ2hyb21lJykpO1xyXG59XHJcbi8qKlxyXG4gKiBUaGlzIG1ldGhvZCBjaGVja3MgaWYgaW5kZXhlZERCIGlzIHN1cHBvcnRlZCBieSBjdXJyZW50IGJyb3dzZXIvc2VydmljZSB3b3JrZXIgY29udGV4dFxyXG4gKiBAcmV0dXJuIHRydWUgaWYgaW5kZXhlZERCIGlzIHN1cHBvcnRlZCBieSBjdXJyZW50IGJyb3dzZXIvc2VydmljZSB3b3JrZXIgY29udGV4dFxyXG4gKi9cclxuZnVuY3Rpb24gaXNJbmRleGVkREJBdmFpbGFibGUoKSB7XHJcbiAgICByZXR1cm4gdHlwZW9mIGluZGV4ZWREQiA9PT0gJ29iamVjdCc7XHJcbn1cclxuLyoqXHJcbiAqIFRoaXMgbWV0aG9kIHZhbGlkYXRlcyBicm93c2VyL3N3IGNvbnRleHQgZm9yIGluZGV4ZWREQiBieSBvcGVuaW5nIGEgZHVtbXkgaW5kZXhlZERCIGRhdGFiYXNlIGFuZCByZWplY3RcclxuICogaWYgZXJyb3JzIG9jY3VyIGR1cmluZyB0aGUgZGF0YWJhc2Ugb3BlbiBvcGVyYXRpb24uXHJcbiAqXHJcbiAqIEB0aHJvd3MgZXhjZXB0aW9uIGlmIGN1cnJlbnQgYnJvd3Nlci9zdyBjb250ZXh0IGNhbid0IHJ1biBpZGIub3BlbiAoZXg6IFNhZmFyaSBpZnJhbWUsIEZpcmVmb3hcclxuICogcHJpdmF0ZSBicm93c2luZylcclxuICovXHJcbmZ1bmN0aW9uIHZhbGlkYXRlSW5kZXhlZERCT3BlbmFibGUoKSB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGxldCBwcmVFeGlzdCA9IHRydWU7XHJcbiAgICAgICAgICAgIGNvbnN0IERCX0NIRUNLX05BTUUgPSAndmFsaWRhdGUtYnJvd3Nlci1jb250ZXh0LWZvci1pbmRleGVkZGItYW5hbHl0aWNzLW1vZHVsZSc7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlcXVlc3QgPSBzZWxmLmluZGV4ZWREQi5vcGVuKERCX0NIRUNLX05BTUUpO1xyXG4gICAgICAgICAgICByZXF1ZXN0Lm9uc3VjY2VzcyA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlcXVlc3QucmVzdWx0LmNsb3NlKCk7XHJcbiAgICAgICAgICAgICAgICAvLyBkZWxldGUgZGF0YWJhc2Ugb25seSB3aGVuIGl0IGRvZXNuJ3QgcHJlLWV4aXN0XHJcbiAgICAgICAgICAgICAgICBpZiAoIXByZUV4aXN0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5pbmRleGVkREIuZGVsZXRlRGF0YWJhc2UoREJfQ0hFQ0tfTkFNRSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKHRydWUpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXF1ZXN0Lm9udXBncmFkZW5lZWRlZCA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHByZUV4aXN0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJlcXVlc3Qub25lcnJvciA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHZhciBfYTtcclxuICAgICAgICAgICAgICAgIHJlamVjdCgoKF9hID0gcmVxdWVzdC5lcnJvcikgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLm1lc3NhZ2UpIHx8ICcnKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIHJlamVjdChlcnJvcik7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn1cclxuLyoqXHJcbiAqXHJcbiAqIFRoaXMgbWV0aG9kIGNoZWNrcyB3aGV0aGVyIGNvb2tpZSBpcyBlbmFibGVkIHdpdGhpbiBjdXJyZW50IGJyb3dzZXJcclxuICogQHJldHVybiB0cnVlIGlmIGNvb2tpZSBpcyBlbmFibGVkIHdpdGhpbiBjdXJyZW50IGJyb3dzZXJcclxuICovXHJcbmZ1bmN0aW9uIGFyZUNvb2tpZXNFbmFibGVkKCkge1xyXG4gICAgaWYgKHR5cGVvZiBuYXZpZ2F0b3IgPT09ICd1bmRlZmluZWQnIHx8ICFuYXZpZ2F0b3IuY29va2llRW5hYmxlZCkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIHJldHVybiB0cnVlO1xyXG59XHJcbi8qKlxyXG4gKiBQb2x5ZmlsbCBmb3IgYGdsb2JhbFRoaXNgIG9iamVjdC5cclxuICogQHJldHVybnMgdGhlIGBnbG9iYWxUaGlzYCBvYmplY3QgZm9yIHRoZSBnaXZlbiBlbnZpcm9ubWVudC5cclxuICovXHJcbmZ1bmN0aW9uIGdldEdsb2JhbCgpIHtcclxuICAgIGlmICh0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICByZXR1cm4gc2VsZjtcclxuICAgIH1cclxuICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIHJldHVybiB3aW5kb3c7XHJcbiAgICB9XHJcbiAgICBpZiAodHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICByZXR1cm4gZ2xvYmFsO1xyXG4gICAgfVxyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdVbmFibGUgdG8gbG9jYXRlIGdsb2JhbCBvYmplY3QuJyk7XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDIyIEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuY29uc3QgZ2V0RGVmYXVsdHNGcm9tR2xvYmFsID0gKCkgPT4gZ2V0R2xvYmFsKCkuX19GSVJFQkFTRV9ERUZBVUxUU19fO1xyXG4vKipcclxuICogQXR0ZW1wdCB0byByZWFkIGRlZmF1bHRzIGZyb20gYSBKU09OIHN0cmluZyBwcm92aWRlZCB0b1xyXG4gKiBwcm9jZXNzLmVudi5fX0ZJUkVCQVNFX0RFRkFVTFRTX18gb3IgYSBKU09OIGZpbGUgd2hvc2UgcGF0aCBpcyBpblxyXG4gKiBwcm9jZXNzLmVudi5fX0ZJUkVCQVNFX0RFRkFVTFRTX1BBVEhfX1xyXG4gKi9cclxuY29uc3QgZ2V0RGVmYXVsdHNGcm9tRW52VmFyaWFibGUgPSAoKSA9PiB7XHJcbiAgICBpZiAodHlwZW9mIHByb2Nlc3MgPT09ICd1bmRlZmluZWQnIHx8IHR5cGVvZiBwcm9jZXNzLmVudiA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBjb25zdCBkZWZhdWx0c0pzb25TdHJpbmcgPSBwcm9jZXNzLmVudi5fX0ZJUkVCQVNFX0RFRkFVTFRTX187XHJcbiAgICBpZiAoZGVmYXVsdHNKc29uU3RyaW5nKSB7XHJcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UoZGVmYXVsdHNKc29uU3RyaW5nKTtcclxuICAgIH1cclxufTtcclxuY29uc3QgZ2V0RGVmYXVsdHNGcm9tQ29va2llID0gKCkgPT4ge1xyXG4gICAgaWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBsZXQgbWF0Y2g7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIG1hdGNoID0gZG9jdW1lbnQuY29va2llLm1hdGNoKC9fX0ZJUkVCQVNFX0RFRkFVTFRTX189KFteO10rKS8pO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAvLyBTb21lIGVudmlyb25tZW50cyBzdWNoIGFzIEFuZ3VsYXIgVW5pdmVyc2FsIFNTUiBoYXZlIGFcclxuICAgICAgICAvLyBgZG9jdW1lbnRgIG9iamVjdCBidXQgZXJyb3Igb24gYWNjZXNzaW5nIGBkb2N1bWVudC5jb29raWVgLlxyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGNvbnN0IGRlY29kZWQgPSBtYXRjaCAmJiBiYXNlNjREZWNvZGUobWF0Y2hbMV0pO1xyXG4gICAgcmV0dXJuIGRlY29kZWQgJiYgSlNPTi5wYXJzZShkZWNvZGVkKTtcclxufTtcclxuLyoqXHJcbiAqIEdldCB0aGUgX19GSVJFQkFTRV9ERUZBVUxUU19fIG9iamVjdC4gSXQgY2hlY2tzIGluIG9yZGVyOlxyXG4gKiAoMSkgaWYgc3VjaCBhbiBvYmplY3QgZXhpc3RzIGFzIGEgcHJvcGVydHkgb2YgYGdsb2JhbFRoaXNgXHJcbiAqICgyKSBpZiBzdWNoIGFuIG9iamVjdCB3YXMgcHJvdmlkZWQgb24gYSBzaGVsbCBlbnZpcm9ubWVudCB2YXJpYWJsZVxyXG4gKiAoMykgaWYgc3VjaCBhbiBvYmplY3QgZXhpc3RzIGluIGEgY29va2llXHJcbiAqL1xyXG5jb25zdCBnZXREZWZhdWx0cyA9ICgpID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgcmV0dXJuIChnZXREZWZhdWx0c0Zyb21HbG9iYWwoKSB8fFxyXG4gICAgICAgICAgICBnZXREZWZhdWx0c0Zyb21FbnZWYXJpYWJsZSgpIHx8XHJcbiAgICAgICAgICAgIGdldERlZmF1bHRzRnJvbUNvb2tpZSgpKTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQ2F0Y2gtYWxsIGZvciBiZWluZyB1bmFibGUgdG8gZ2V0IF9fRklSRUJBU0VfREVGQVVMVFNfXyBkdWVcclxuICAgICAgICAgKiB0byBhbnkgZW52aXJvbm1lbnQgY2FzZSB3ZSBoYXZlIG5vdCBhY2NvdW50ZWQgZm9yLiBMb2cgdG9cclxuICAgICAgICAgKiBpbmZvIGluc3RlYWQgb2Ygc3dhbGxvd2luZyBzbyB3ZSBjYW4gZmluZCB0aGVzZSB1bmtub3duIGNhc2VzXHJcbiAgICAgICAgICogYW5kIGFkZCBwYXRocyBmb3IgdGhlbSBpZiBuZWVkZWQuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgY29uc29sZS5pbmZvKGBVbmFibGUgdG8gZ2V0IF9fRklSRUJBU0VfREVGQVVMVFNfXyBkdWUgdG86ICR7ZX1gKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbn07XHJcbi8qKlxyXG4gKiBSZXR1cm5zIGVtdWxhdG9yIGhvc3Qgc3RvcmVkIGluIHRoZSBfX0ZJUkVCQVNFX0RFRkFVTFRTX18gb2JqZWN0XHJcbiAqIGZvciB0aGUgZ2l2ZW4gcHJvZHVjdC5cclxuICogQHJldHVybnMgYSBVUkwgaG9zdCBmb3JtYXR0ZWQgbGlrZSBgMTI3LjAuMC4xOjk5OTlgIG9yIGBbOjoxXTo0MDAwYCBpZiBhdmFpbGFibGVcclxuICogQHB1YmxpY1xyXG4gKi9cclxuY29uc3QgZ2V0RGVmYXVsdEVtdWxhdG9ySG9zdCA9IChwcm9kdWN0TmFtZSkgPT4geyB2YXIgX2EsIF9iOyByZXR1cm4gKF9iID0gKF9hID0gZ2V0RGVmYXVsdHMoKSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmVtdWxhdG9ySG9zdHMpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYltwcm9kdWN0TmFtZV07IH07XHJcbi8qKlxyXG4gKiBSZXR1cm5zIGVtdWxhdG9yIGhvc3RuYW1lIGFuZCBwb3J0IHN0b3JlZCBpbiB0aGUgX19GSVJFQkFTRV9ERUZBVUxUU19fIG9iamVjdFxyXG4gKiBmb3IgdGhlIGdpdmVuIHByb2R1Y3QuXHJcbiAqIEByZXR1cm5zIGEgcGFpciBvZiBob3N0bmFtZSBhbmQgcG9ydCBsaWtlIGBbXCI6OjFcIiwgNDAwMF1gIGlmIGF2YWlsYWJsZVxyXG4gKiBAcHVibGljXHJcbiAqL1xyXG5jb25zdCBnZXREZWZhdWx0RW11bGF0b3JIb3N0bmFtZUFuZFBvcnQgPSAocHJvZHVjdE5hbWUpID0+IHtcclxuICAgIGNvbnN0IGhvc3QgPSBnZXREZWZhdWx0RW11bGF0b3JIb3N0KHByb2R1Y3ROYW1lKTtcclxuICAgIGlmICghaG9zdCkge1xyXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICB9XHJcbiAgICBjb25zdCBzZXBhcmF0b3JJbmRleCA9IGhvc3QubGFzdEluZGV4T2YoJzonKTsgLy8gRmluZGluZyB0aGUgbGFzdCBzaW5jZSBJUHY2IGFkZHIgYWxzbyBoYXMgY29sb25zLlxyXG4gICAgaWYgKHNlcGFyYXRvckluZGV4IDw9IDAgfHwgc2VwYXJhdG9ySW5kZXggKyAxID09PSBob3N0Lmxlbmd0aCkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBob3N0ICR7aG9zdH0gd2l0aCBubyBzZXBhcmF0ZSBob3N0bmFtZSBhbmQgcG9ydCFgKTtcclxuICAgIH1cclxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1yZXN0cmljdGVkLWdsb2JhbHNcclxuICAgIGNvbnN0IHBvcnQgPSBwYXJzZUludChob3N0LnN1YnN0cmluZyhzZXBhcmF0b3JJbmRleCArIDEpLCAxMCk7XHJcbiAgICBpZiAoaG9zdFswXSA9PT0gJ1snKSB7XHJcbiAgICAgICAgLy8gQnJhY2tldC1xdW90ZWQgYFtpcHY2YWRkcl06cG9ydGAgPT4gcmV0dXJuIFwiaXB2NmFkZHJcIiAod2l0aG91dCBicmFja2V0cykuXHJcbiAgICAgICAgcmV0dXJuIFtob3N0LnN1YnN0cmluZygxLCBzZXBhcmF0b3JJbmRleCAtIDEpLCBwb3J0XTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBbaG9zdC5zdWJzdHJpbmcoMCwgc2VwYXJhdG9ySW5kZXgpLCBwb3J0XTtcclxuICAgIH1cclxufTtcclxuLyoqXHJcbiAqIFJldHVybnMgRmlyZWJhc2UgYXBwIGNvbmZpZyBzdG9yZWQgaW4gdGhlIF9fRklSRUJBU0VfREVGQVVMVFNfXyBvYmplY3QuXHJcbiAqIEBwdWJsaWNcclxuICovXHJcbmNvbnN0IGdldERlZmF1bHRBcHBDb25maWcgPSAoKSA9PiB7IHZhciBfYTsgcmV0dXJuIChfYSA9IGdldERlZmF1bHRzKCkpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5jb25maWc7IH07XHJcbi8qKlxyXG4gKiBSZXR1cm5zIGFuIGV4cGVyaW1lbnRhbCBzZXR0aW5nIG9uIHRoZSBfX0ZJUkVCQVNFX0RFRkFVTFRTX18gb2JqZWN0IChwcm9wZXJ0aWVzXHJcbiAqIHByZWZpeGVkIGJ5IFwiX1wiKVxyXG4gKiBAcHVibGljXHJcbiAqL1xyXG5jb25zdCBnZXRFeHBlcmltZW50YWxTZXR0aW5nID0gKG5hbWUpID0+IHsgdmFyIF9hOyByZXR1cm4gKF9hID0gZ2V0RGVmYXVsdHMoKSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hW2BfJHtuYW1lfWBdOyB9O1xuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5jbGFzcyBEZWZlcnJlZCB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLnJlamVjdCA9ICgpID0+IHsgfTtcclxuICAgICAgICB0aGlzLnJlc29sdmUgPSAoKSA9PiB7IH07XHJcbiAgICAgICAgdGhpcy5wcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnJlc29sdmUgPSByZXNvbHZlO1xyXG4gICAgICAgICAgICB0aGlzLnJlamVjdCA9IHJlamVjdDtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogT3VyIEFQSSBpbnRlcm5hbHMgYXJlIG5vdCBwcm9taXNlaWZpZWQgYW5kIGNhbm5vdCBiZWNhdXNlIG91ciBjYWxsYmFjayBBUElzIGhhdmUgc3VidGxlIGV4cGVjdGF0aW9ucyBhcm91bmRcclxuICAgICAqIGludm9raW5nIHByb21pc2VzIGlubGluZSwgd2hpY2ggUHJvbWlzZXMgYXJlIGZvcmJpZGRlbiB0byBkby4gVGhpcyBtZXRob2QgYWNjZXB0cyBhbiBvcHRpb25hbCBub2RlLXN0eWxlIGNhbGxiYWNrXHJcbiAgICAgKiBhbmQgcmV0dXJucyBhIG5vZGUtc3R5bGUgY2FsbGJhY2sgd2hpY2ggd2lsbCByZXNvbHZlIG9yIHJlamVjdCB0aGUgRGVmZXJyZWQncyBwcm9taXNlLlxyXG4gICAgICovXHJcbiAgICB3cmFwQ2FsbGJhY2soY2FsbGJhY2spIHtcclxuICAgICAgICByZXR1cm4gKGVycm9yLCB2YWx1ZSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVqZWN0KGVycm9yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVzb2x2ZSh2YWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICAgICAgLy8gQXR0YWNoaW5nIG5vb3AgaGFuZGxlciBqdXN0IGluIGNhc2UgZGV2ZWxvcGVyIHdhc24ndCBleHBlY3RpbmdcclxuICAgICAgICAgICAgICAgIC8vIHByb21pc2VzXHJcbiAgICAgICAgICAgICAgICB0aGlzLnByb21pc2UuY2F0Y2goKCkgPT4geyB9KTtcclxuICAgICAgICAgICAgICAgIC8vIFNvbWUgb2Ygb3VyIGNhbGxiYWNrcyBkb24ndCBleHBlY3QgYSB2YWx1ZSBhbmQgb3VyIG93biB0ZXN0c1xyXG4gICAgICAgICAgICAgICAgLy8gYXNzZXJ0IHRoYXQgdGhlIHBhcmFtZXRlciBsZW5ndGggaXMgMVxyXG4gICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCB2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAyMSBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbmZ1bmN0aW9uIGNyZWF0ZU1vY2tVc2VyVG9rZW4odG9rZW4sIHByb2plY3RJZCkge1xyXG4gICAgaWYgKHRva2VuLnVpZCkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIFwidWlkXCIgZmllbGQgaXMgbm8gbG9uZ2VyIHN1cHBvcnRlZCBieSBtb2NrVXNlclRva2VuLiBQbGVhc2UgdXNlIFwic3ViXCIgaW5zdGVhZCBmb3IgRmlyZWJhc2UgQXV0aCBVc2VyIElELicpO1xyXG4gICAgfVxyXG4gICAgLy8gVW5zZWN1cmVkIEpXVHMgdXNlIFwibm9uZVwiIGFzIHRoZSBhbGdvcml0aG0uXHJcbiAgICBjb25zdCBoZWFkZXIgPSB7XHJcbiAgICAgICAgYWxnOiAnbm9uZScsXHJcbiAgICAgICAgdHlwZTogJ0pXVCdcclxuICAgIH07XHJcbiAgICBjb25zdCBwcm9qZWN0ID0gcHJvamVjdElkIHx8ICdkZW1vLXByb2plY3QnO1xyXG4gICAgY29uc3QgaWF0ID0gdG9rZW4uaWF0IHx8IDA7XHJcbiAgICBjb25zdCBzdWIgPSB0b2tlbi5zdWIgfHwgdG9rZW4udXNlcl9pZDtcclxuICAgIGlmICghc3ViKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibW9ja1VzZXJUb2tlbiBtdXN0IGNvbnRhaW4gJ3N1Yicgb3IgJ3VzZXJfaWQnIGZpZWxkIVwiKTtcclxuICAgIH1cclxuICAgIGNvbnN0IHBheWxvYWQgPSBPYmplY3QuYXNzaWduKHsgXHJcbiAgICAgICAgLy8gU2V0IGFsbCByZXF1aXJlZCBmaWVsZHMgdG8gZGVjZW50IGRlZmF1bHRzXHJcbiAgICAgICAgaXNzOiBgaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tLyR7cHJvamVjdH1gLCBhdWQ6IHByb2plY3QsIGlhdCwgZXhwOiBpYXQgKyAzNjAwLCBhdXRoX3RpbWU6IGlhdCwgc3ViLCB1c2VyX2lkOiBzdWIsIGZpcmViYXNlOiB7XHJcbiAgICAgICAgICAgIHNpZ25faW5fcHJvdmlkZXI6ICdjdXN0b20nLFxyXG4gICAgICAgICAgICBpZGVudGl0aWVzOiB7fVxyXG4gICAgICAgIH0gfSwgdG9rZW4pO1xyXG4gICAgLy8gVW5zZWN1cmVkIEpXVHMgdXNlIHRoZSBlbXB0eSBzdHJpbmcgYXMgYSBzaWduYXR1cmUuXHJcbiAgICBjb25zdCBzaWduYXR1cmUgPSAnJztcclxuICAgIHJldHVybiBbXHJcbiAgICAgICAgYmFzZTY0dXJsRW5jb2RlV2l0aG91dFBhZGRpbmcoSlNPTi5zdHJpbmdpZnkoaGVhZGVyKSksXHJcbiAgICAgICAgYmFzZTY0dXJsRW5jb2RlV2l0aG91dFBhZGRpbmcoSlNPTi5zdHJpbmdpZnkocGF5bG9hZCkpLFxyXG4gICAgICAgIHNpZ25hdHVyZVxyXG4gICAgXS5qb2luKCcuJyk7XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqXHJcbiAqIEBmaWxlb3ZlcnZpZXcgU3RhbmRhcmRpemVkIEZpcmViYXNlIEVycm9yLlxyXG4gKlxyXG4gKiBVc2FnZTpcclxuICpcclxuICogICAvLyBUeXBlc2NyaXB0IHN0cmluZyBsaXRlcmFscyBmb3IgdHlwZS1zYWZlIGNvZGVzXHJcbiAqICAgdHlwZSBFcnIgPVxyXG4gKiAgICAgJ3Vua25vd24nIHxcclxuICogICAgICdvYmplY3Qtbm90LWZvdW5kJ1xyXG4gKiAgICAgO1xyXG4gKlxyXG4gKiAgIC8vIENsb3N1cmUgZW51bSBmb3IgdHlwZS1zYWZlIGVycm9yIGNvZGVzXHJcbiAqICAgLy8gYXQtZW51bSB7c3RyaW5nfVxyXG4gKiAgIHZhciBFcnIgPSB7XHJcbiAqICAgICBVTktOT1dOOiAndW5rbm93bicsXHJcbiAqICAgICBPQkpFQ1RfTk9UX0ZPVU5EOiAnb2JqZWN0LW5vdC1mb3VuZCcsXHJcbiAqICAgfVxyXG4gKlxyXG4gKiAgIGxldCBlcnJvcnM6IE1hcDxFcnIsIHN0cmluZz4gPSB7XHJcbiAqICAgICAnZ2VuZXJpYy1lcnJvcic6IFwiVW5rbm93biBlcnJvclwiLFxyXG4gKiAgICAgJ2ZpbGUtbm90LWZvdW5kJzogXCJDb3VsZCBub3QgZmluZCBmaWxlOiB7JGZpbGV9XCIsXHJcbiAqICAgfTtcclxuICpcclxuICogICAvLyBUeXBlLXNhZmUgZnVuY3Rpb24gLSBtdXN0IHBhc3MgYSB2YWxpZCBlcnJvciBjb2RlIGFzIHBhcmFtLlxyXG4gKiAgIGxldCBlcnJvciA9IG5ldyBFcnJvckZhY3Rvcnk8RXJyPignc2VydmljZScsICdTZXJ2aWNlJywgZXJyb3JzKTtcclxuICpcclxuICogICAuLi5cclxuICogICB0aHJvdyBlcnJvci5jcmVhdGUoRXJyLkdFTkVSSUMpO1xyXG4gKiAgIC4uLlxyXG4gKiAgIHRocm93IGVycm9yLmNyZWF0ZShFcnIuRklMRV9OT1RfRk9VTkQsIHsnZmlsZSc6IGZpbGVOYW1lfSk7XHJcbiAqICAgLi4uXHJcbiAqICAgLy8gU2VydmljZTogQ291bGQgbm90IGZpbGUgZmlsZTogZm9vLnR4dCAoc2VydmljZS9maWxlLW5vdC1mb3VuZCkuXHJcbiAqXHJcbiAqICAgY2F0Y2ggKGUpIHtcclxuICogICAgIGFzc2VydChlLm1lc3NhZ2UgPT09IFwiQ291bGQgbm90IGZpbmQgZmlsZTogZm9vLnR4dC5cIik7XHJcbiAqICAgICBpZiAoKGUgYXMgRmlyZWJhc2VFcnJvcik/LmNvZGUgPT09ICdzZXJ2aWNlL2ZpbGUtbm90LWZvdW5kJykge1xyXG4gKiAgICAgICBjb25zb2xlLmxvZyhcIkNvdWxkIG5vdCByZWFkIGZpbGU6IFwiICsgZVsnZmlsZSddKTtcclxuICogICAgIH1cclxuICogICB9XHJcbiAqL1xyXG5jb25zdCBFUlJPUl9OQU1FID0gJ0ZpcmViYXNlRXJyb3InO1xyXG4vLyBCYXNlZCBvbiBjb2RlIGZyb206XHJcbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0Vycm9yI0N1c3RvbV9FcnJvcl9UeXBlc1xyXG5jbGFzcyBGaXJlYmFzZUVycm9yIGV4dGVuZHMgRXJyb3Ige1xyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAvKiogVGhlIGVycm9yIGNvZGUgZm9yIHRoaXMgZXJyb3IuICovXHJcbiAgICBjb2RlLCBtZXNzYWdlLCBcclxuICAgIC8qKiBDdXN0b20gZGF0YSBmb3IgdGhpcyBlcnJvci4gKi9cclxuICAgIGN1c3RvbURhdGEpIHtcclxuICAgICAgICBzdXBlcihtZXNzYWdlKTtcclxuICAgICAgICB0aGlzLmNvZGUgPSBjb2RlO1xyXG4gICAgICAgIHRoaXMuY3VzdG9tRGF0YSA9IGN1c3RvbURhdGE7XHJcbiAgICAgICAgLyoqIFRoZSBjdXN0b20gbmFtZSBmb3IgYWxsIEZpcmViYXNlRXJyb3JzLiAqL1xyXG4gICAgICAgIHRoaXMubmFtZSA9IEVSUk9SX05BTUU7XHJcbiAgICAgICAgLy8gRml4IEZvciBFUzVcclxuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vTWljcm9zb2Z0L1R5cGVTY3JpcHQtd2lraS9ibG9iL21hc3Rlci9CcmVha2luZy1DaGFuZ2VzLm1kI2V4dGVuZGluZy1idWlsdC1pbnMtbGlrZS1lcnJvci1hcnJheS1hbmQtbWFwLW1heS1uby1sb25nZXItd29ya1xyXG4gICAgICAgIE9iamVjdC5zZXRQcm90b3R5cGVPZih0aGlzLCBGaXJlYmFzZUVycm9yLnByb3RvdHlwZSk7XHJcbiAgICAgICAgLy8gTWFpbnRhaW5zIHByb3BlciBzdGFjayB0cmFjZSBmb3Igd2hlcmUgb3VyIGVycm9yIHdhcyB0aHJvd24uXHJcbiAgICAgICAgLy8gT25seSBhdmFpbGFibGUgb24gVjguXHJcbiAgICAgICAgaWYgKEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKSB7XHJcbiAgICAgICAgICAgIEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKHRoaXMsIEVycm9yRmFjdG9yeS5wcm90b3R5cGUuY3JlYXRlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuY2xhc3MgRXJyb3JGYWN0b3J5IHtcclxuICAgIGNvbnN0cnVjdG9yKHNlcnZpY2UsIHNlcnZpY2VOYW1lLCBlcnJvcnMpIHtcclxuICAgICAgICB0aGlzLnNlcnZpY2UgPSBzZXJ2aWNlO1xyXG4gICAgICAgIHRoaXMuc2VydmljZU5hbWUgPSBzZXJ2aWNlTmFtZTtcclxuICAgICAgICB0aGlzLmVycm9ycyA9IGVycm9ycztcclxuICAgIH1cclxuICAgIGNyZWF0ZShjb2RlLCAuLi5kYXRhKSB7XHJcbiAgICAgICAgY29uc3QgY3VzdG9tRGF0YSA9IGRhdGFbMF0gfHwge307XHJcbiAgICAgICAgY29uc3QgZnVsbENvZGUgPSBgJHt0aGlzLnNlcnZpY2V9LyR7Y29kZX1gO1xyXG4gICAgICAgIGNvbnN0IHRlbXBsYXRlID0gdGhpcy5lcnJvcnNbY29kZV07XHJcbiAgICAgICAgY29uc3QgbWVzc2FnZSA9IHRlbXBsYXRlID8gcmVwbGFjZVRlbXBsYXRlKHRlbXBsYXRlLCBjdXN0b21EYXRhKSA6ICdFcnJvcic7XHJcbiAgICAgICAgLy8gU2VydmljZSBOYW1lOiBFcnJvciBtZXNzYWdlIChzZXJ2aWNlL2NvZGUpLlxyXG4gICAgICAgIGNvbnN0IGZ1bGxNZXNzYWdlID0gYCR7dGhpcy5zZXJ2aWNlTmFtZX06ICR7bWVzc2FnZX0gKCR7ZnVsbENvZGV9KS5gO1xyXG4gICAgICAgIGNvbnN0IGVycm9yID0gbmV3IEZpcmViYXNlRXJyb3IoZnVsbENvZGUsIGZ1bGxNZXNzYWdlLCBjdXN0b21EYXRhKTtcclxuICAgICAgICByZXR1cm4gZXJyb3I7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gcmVwbGFjZVRlbXBsYXRlKHRlbXBsYXRlLCBkYXRhKSB7XHJcbiAgICByZXR1cm4gdGVtcGxhdGUucmVwbGFjZShQQVRURVJOLCAoXywga2V5KSA9PiB7XHJcbiAgICAgICAgY29uc3QgdmFsdWUgPSBkYXRhW2tleV07XHJcbiAgICAgICAgcmV0dXJuIHZhbHVlICE9IG51bGwgPyBTdHJpbmcodmFsdWUpIDogYDwke2tleX0/PmA7XHJcbiAgICB9KTtcclxufVxyXG5jb25zdCBQQVRURVJOID0gL1xce1xcJChbXn1dKyl9L2c7XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbi8qKlxyXG4gKiBFdmFsdWF0ZXMgYSBKU09OIHN0cmluZyBpbnRvIGEgamF2YXNjcmlwdCBvYmplY3QuXHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHIgQSBzdHJpbmcgY29udGFpbmluZyBKU09OLlxyXG4gKiBAcmV0dXJuIHsqfSBUaGUgamF2YXNjcmlwdCBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBzcGVjaWZpZWQgSlNPTi5cclxuICovXHJcbmZ1bmN0aW9uIGpzb25FdmFsKHN0cikge1xyXG4gICAgcmV0dXJuIEpTT04ucGFyc2Uoc3RyKTtcclxufVxyXG4vKipcclxuICogUmV0dXJucyBKU09OIHJlcHJlc2VudGluZyBhIGphdmFzY3JpcHQgb2JqZWN0LlxyXG4gKiBAcGFyYW0geyp9IGRhdGEgSmF2YXNjcmlwdCBvYmplY3QgdG8gYmUgc3RyaW5naWZpZWQuXHJcbiAqIEByZXR1cm4ge3N0cmluZ30gVGhlIEpTT04gY29udGVudHMgb2YgdGhlIG9iamVjdC5cclxuICovXHJcbmZ1bmN0aW9uIHN0cmluZ2lmeShkYXRhKSB7XHJcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoZGF0YSk7XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqXHJcbiAqIERlY29kZXMgYSBGaXJlYmFzZSBhdXRoLiB0b2tlbiBpbnRvIGNvbnN0aXR1ZW50IHBhcnRzLlxyXG4gKlxyXG4gKiBOb3RlczpcclxuICogLSBNYXkgcmV0dXJuIHdpdGggaW52YWxpZCAvIGluY29tcGxldGUgY2xhaW1zIGlmIHRoZXJlJ3Mgbm8gbmF0aXZlIGJhc2U2NCBkZWNvZGluZyBzdXBwb3J0LlxyXG4gKiAtIERvZXNuJ3QgY2hlY2sgaWYgdGhlIHRva2VuIGlzIGFjdHVhbGx5IHZhbGlkLlxyXG4gKi9cclxuY29uc3QgZGVjb2RlID0gZnVuY3Rpb24gKHRva2VuKSB7XHJcbiAgICBsZXQgaGVhZGVyID0ge30sIGNsYWltcyA9IHt9LCBkYXRhID0ge30sIHNpZ25hdHVyZSA9ICcnO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zdCBwYXJ0cyA9IHRva2VuLnNwbGl0KCcuJyk7XHJcbiAgICAgICAgaGVhZGVyID0ganNvbkV2YWwoYmFzZTY0RGVjb2RlKHBhcnRzWzBdKSB8fCAnJyk7XHJcbiAgICAgICAgY2xhaW1zID0ganNvbkV2YWwoYmFzZTY0RGVjb2RlKHBhcnRzWzFdKSB8fCAnJyk7XHJcbiAgICAgICAgc2lnbmF0dXJlID0gcGFydHNbMl07XHJcbiAgICAgICAgZGF0YSA9IGNsYWltc1snZCddIHx8IHt9O1xyXG4gICAgICAgIGRlbGV0ZSBjbGFpbXNbJ2QnXTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlKSB7IH1cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgaGVhZGVyLFxyXG4gICAgICAgIGNsYWltcyxcclxuICAgICAgICBkYXRhLFxyXG4gICAgICAgIHNpZ25hdHVyZVxyXG4gICAgfTtcclxufTtcclxuLyoqXHJcbiAqIERlY29kZXMgYSBGaXJlYmFzZSBhdXRoLiB0b2tlbiBhbmQgY2hlY2tzIHRoZSB2YWxpZGl0eSBvZiBpdHMgdGltZS1iYXNlZCBjbGFpbXMuIFdpbGwgcmV0dXJuIHRydWUgaWYgdGhlXHJcbiAqIHRva2VuIGlzIHdpdGhpbiB0aGUgdGltZSB3aW5kb3cgYXV0aG9yaXplZCBieSB0aGUgJ25iZicgKG5vdC1iZWZvcmUpIGFuZCAnaWF0JyAoaXNzdWVkLWF0KSBjbGFpbXMuXHJcbiAqXHJcbiAqIE5vdGVzOlxyXG4gKiAtIE1heSByZXR1cm4gYSBmYWxzZSBuZWdhdGl2ZSBpZiB0aGVyZSdzIG5vIG5hdGl2ZSBiYXNlNjQgZGVjb2Rpbmcgc3VwcG9ydC5cclxuICogLSBEb2Vzbid0IGNoZWNrIGlmIHRoZSB0b2tlbiBpcyBhY3R1YWxseSB2YWxpZC5cclxuICovXHJcbmNvbnN0IGlzVmFsaWRUaW1lc3RhbXAgPSBmdW5jdGlvbiAodG9rZW4pIHtcclxuICAgIGNvbnN0IGNsYWltcyA9IGRlY29kZSh0b2tlbikuY2xhaW1zO1xyXG4gICAgY29uc3Qgbm93ID0gTWF0aC5mbG9vcihuZXcgRGF0ZSgpLmdldFRpbWUoKSAvIDEwMDApO1xyXG4gICAgbGV0IHZhbGlkU2luY2UgPSAwLCB2YWxpZFVudGlsID0gMDtcclxuICAgIGlmICh0eXBlb2YgY2xhaW1zID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgIGlmIChjbGFpbXMuaGFzT3duUHJvcGVydHkoJ25iZicpKSB7XHJcbiAgICAgICAgICAgIHZhbGlkU2luY2UgPSBjbGFpbXNbJ25iZiddO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChjbGFpbXMuaGFzT3duUHJvcGVydHkoJ2lhdCcpKSB7XHJcbiAgICAgICAgICAgIHZhbGlkU2luY2UgPSBjbGFpbXNbJ2lhdCddO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoY2xhaW1zLmhhc093blByb3BlcnR5KCdleHAnKSkge1xyXG4gICAgICAgICAgICB2YWxpZFVudGlsID0gY2xhaW1zWydleHAnXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIHRva2VuIHdpbGwgZXhwaXJlIGFmdGVyIDI0aCBieSBkZWZhdWx0XHJcbiAgICAgICAgICAgIHZhbGlkVW50aWwgPSB2YWxpZFNpbmNlICsgODY0MDA7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuICghIW5vdyAmJlxyXG4gICAgICAgICEhdmFsaWRTaW5jZSAmJlxyXG4gICAgICAgICEhdmFsaWRVbnRpbCAmJlxyXG4gICAgICAgIG5vdyA+PSB2YWxpZFNpbmNlICYmXHJcbiAgICAgICAgbm93IDw9IHZhbGlkVW50aWwpO1xyXG59O1xyXG4vKipcclxuICogRGVjb2RlcyBhIEZpcmViYXNlIGF1dGguIHRva2VuIGFuZCByZXR1cm5zIGl0cyBpc3N1ZWQgYXQgdGltZSBpZiB2YWxpZCwgbnVsbCBvdGhlcndpc2UuXHJcbiAqXHJcbiAqIE5vdGVzOlxyXG4gKiAtIE1heSByZXR1cm4gbnVsbCBpZiB0aGVyZSdzIG5vIG5hdGl2ZSBiYXNlNjQgZGVjb2Rpbmcgc3VwcG9ydC5cclxuICogLSBEb2Vzbid0IGNoZWNrIGlmIHRoZSB0b2tlbiBpcyBhY3R1YWxseSB2YWxpZC5cclxuICovXHJcbmNvbnN0IGlzc3VlZEF0VGltZSA9IGZ1bmN0aW9uICh0b2tlbikge1xyXG4gICAgY29uc3QgY2xhaW1zID0gZGVjb2RlKHRva2VuKS5jbGFpbXM7XHJcbiAgICBpZiAodHlwZW9mIGNsYWltcyA9PT0gJ29iamVjdCcgJiYgY2xhaW1zLmhhc093blByb3BlcnR5KCdpYXQnKSkge1xyXG4gICAgICAgIHJldHVybiBjbGFpbXNbJ2lhdCddO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGw7XHJcbn07XHJcbi8qKlxyXG4gKiBEZWNvZGVzIGEgRmlyZWJhc2UgYXV0aC4gdG9rZW4gYW5kIGNoZWNrcyB0aGUgdmFsaWRpdHkgb2YgaXRzIGZvcm1hdC4gRXhwZWN0cyBhIHZhbGlkIGlzc3VlZC1hdCB0aW1lLlxyXG4gKlxyXG4gKiBOb3RlczpcclxuICogLSBNYXkgcmV0dXJuIGEgZmFsc2UgbmVnYXRpdmUgaWYgdGhlcmUncyBubyBuYXRpdmUgYmFzZTY0IGRlY29kaW5nIHN1cHBvcnQuXHJcbiAqIC0gRG9lc24ndCBjaGVjayBpZiB0aGUgdG9rZW4gaXMgYWN0dWFsbHkgdmFsaWQuXHJcbiAqL1xyXG5jb25zdCBpc1ZhbGlkRm9ybWF0ID0gZnVuY3Rpb24gKHRva2VuKSB7XHJcbiAgICBjb25zdCBkZWNvZGVkID0gZGVjb2RlKHRva2VuKSwgY2xhaW1zID0gZGVjb2RlZC5jbGFpbXM7XHJcbiAgICByZXR1cm4gISFjbGFpbXMgJiYgdHlwZW9mIGNsYWltcyA9PT0gJ29iamVjdCcgJiYgY2xhaW1zLmhhc093blByb3BlcnR5KCdpYXQnKTtcclxufTtcclxuLyoqXHJcbiAqIEF0dGVtcHRzIHRvIHBlZXIgaW50byBhbiBhdXRoIHRva2VuIGFuZCBkZXRlcm1pbmUgaWYgaXQncyBhbiBhZG1pbiBhdXRoIHRva2VuIGJ5IGxvb2tpbmcgYXQgdGhlIGNsYWltcyBwb3J0aW9uLlxyXG4gKlxyXG4gKiBOb3RlczpcclxuICogLSBNYXkgcmV0dXJuIGEgZmFsc2UgbmVnYXRpdmUgaWYgdGhlcmUncyBubyBuYXRpdmUgYmFzZTY0IGRlY29kaW5nIHN1cHBvcnQuXHJcbiAqIC0gRG9lc24ndCBjaGVjayBpZiB0aGUgdG9rZW4gaXMgYWN0dWFsbHkgdmFsaWQuXHJcbiAqL1xyXG5jb25zdCBpc0FkbWluID0gZnVuY3Rpb24gKHRva2VuKSB7XHJcbiAgICBjb25zdCBjbGFpbXMgPSBkZWNvZGUodG9rZW4pLmNsYWltcztcclxuICAgIHJldHVybiB0eXBlb2YgY2xhaW1zID09PSAnb2JqZWN0JyAmJiBjbGFpbXNbJ2FkbWluJ10gPT09IHRydWU7XHJcbn07XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbmZ1bmN0aW9uIGNvbnRhaW5zKG9iaiwga2V5KSB7XHJcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KTtcclxufVxyXG5mdW5jdGlvbiBzYWZlR2V0KG9iaiwga2V5KSB7XHJcbiAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkge1xyXG4gICAgICAgIHJldHVybiBvYmpba2V5XTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gaXNFbXB0eShvYmopIHtcclxuICAgIGZvciAoY29uc3Qga2V5IGluIG9iaikge1xyXG4gICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxufVxyXG5mdW5jdGlvbiBtYXAob2JqLCBmbiwgY29udGV4dE9iaikge1xyXG4gICAgY29uc3QgcmVzID0ge307XHJcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBvYmopIHtcclxuICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkge1xyXG4gICAgICAgICAgICByZXNba2V5XSA9IGZuLmNhbGwoY29udGV4dE9iaiwgb2JqW2tleV0sIGtleSwgb2JqKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzO1xyXG59XHJcbi8qKlxyXG4gKiBEZWVwIGVxdWFsIHR3byBvYmplY3RzLiBTdXBwb3J0IEFycmF5cyBhbmQgT2JqZWN0cy5cclxuICovXHJcbmZ1bmN0aW9uIGRlZXBFcXVhbChhLCBiKSB7XHJcbiAgICBpZiAoYSA9PT0gYikge1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgY29uc3QgYUtleXMgPSBPYmplY3Qua2V5cyhhKTtcclxuICAgIGNvbnN0IGJLZXlzID0gT2JqZWN0LmtleXMoYik7XHJcbiAgICBmb3IgKGNvbnN0IGsgb2YgYUtleXMpIHtcclxuICAgICAgICBpZiAoIWJLZXlzLmluY2x1ZGVzKGspKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgYVByb3AgPSBhW2tdO1xyXG4gICAgICAgIGNvbnN0IGJQcm9wID0gYltrXTtcclxuICAgICAgICBpZiAoaXNPYmplY3QoYVByb3ApICYmIGlzT2JqZWN0KGJQcm9wKSkge1xyXG4gICAgICAgICAgICBpZiAoIWRlZXBFcXVhbChhUHJvcCwgYlByb3ApKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoYVByb3AgIT09IGJQcm9wKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBmb3IgKGNvbnN0IGsgb2YgYktleXMpIHtcclxuICAgICAgICBpZiAoIWFLZXlzLmluY2x1ZGVzKGspKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxufVxyXG5mdW5jdGlvbiBpc09iamVjdCh0aGluZykge1xyXG4gICAgcmV0dXJuIHRoaW5nICE9PSBudWxsICYmIHR5cGVvZiB0aGluZyA9PT0gJ29iamVjdCc7XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDIyIEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqXHJcbiAqIFJlamVjdHMgaWYgdGhlIGdpdmVuIHByb21pc2UgZG9lc24ndCByZXNvbHZlIGluIHRpbWVJbk1TIG1pbGxpc2Vjb25kcy5cclxuICogQGludGVybmFsXHJcbiAqL1xyXG5mdW5jdGlvbiBwcm9taXNlV2l0aFRpbWVvdXQocHJvbWlzZSwgdGltZUluTVMgPSAyMDAwKSB7XHJcbiAgICBjb25zdCBkZWZlcnJlZFByb21pc2UgPSBuZXcgRGVmZXJyZWQoKTtcclxuICAgIHNldFRpbWVvdXQoKCkgPT4gZGVmZXJyZWRQcm9taXNlLnJlamVjdCgndGltZW91dCEnKSwgdGltZUluTVMpO1xyXG4gICAgcHJvbWlzZS50aGVuKGRlZmVycmVkUHJvbWlzZS5yZXNvbHZlLCBkZWZlcnJlZFByb21pc2UucmVqZWN0KTtcclxuICAgIHJldHVybiBkZWZlcnJlZFByb21pc2UucHJvbWlzZTtcclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG4vKipcclxuICogUmV0dXJucyBhIHF1ZXJ5c3RyaW5nLWZvcm1hdHRlZCBzdHJpbmcgKGUuZy4gJmFyZz12YWwmYXJnMj12YWwyKSBmcm9tIGFcclxuICogcGFyYW1zIG9iamVjdCAoZS5nLiB7YXJnOiAndmFsJywgYXJnMjogJ3ZhbDInfSlcclxuICogTm90ZTogWW91IG11c3QgcHJlcGVuZCBpdCB3aXRoID8gd2hlbiBhZGRpbmcgaXQgdG8gYSBVUkwuXHJcbiAqL1xyXG5mdW5jdGlvbiBxdWVyeXN0cmluZyhxdWVyeXN0cmluZ1BhcmFtcykge1xyXG4gICAgY29uc3QgcGFyYW1zID0gW107XHJcbiAgICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhxdWVyeXN0cmluZ1BhcmFtcykpIHtcclxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgdmFsdWUuZm9yRWFjaChhcnJheVZhbCA9PiB7XHJcbiAgICAgICAgICAgICAgICBwYXJhbXMucHVzaChlbmNvZGVVUklDb21wb25lbnQoa2V5KSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudChhcnJheVZhbCkpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHBhcmFtcy5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChrZXkpICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KHZhbHVlKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHBhcmFtcy5sZW5ndGggPyAnJicgKyBwYXJhbXMuam9pbignJicpIDogJyc7XHJcbn1cclxuLyoqXHJcbiAqIERlY29kZXMgYSBxdWVyeXN0cmluZyAoZS5nLiA/YXJnPXZhbCZhcmcyPXZhbDIpIGludG8gYSBwYXJhbXMgb2JqZWN0XHJcbiAqIChlLmcuIHthcmc6ICd2YWwnLCBhcmcyOiAndmFsMid9KVxyXG4gKi9cclxuZnVuY3Rpb24gcXVlcnlzdHJpbmdEZWNvZGUocXVlcnlzdHJpbmcpIHtcclxuICAgIGNvbnN0IG9iaiA9IHt9O1xyXG4gICAgY29uc3QgdG9rZW5zID0gcXVlcnlzdHJpbmcucmVwbGFjZSgvXlxcPy8sICcnKS5zcGxpdCgnJicpO1xyXG4gICAgdG9rZW5zLmZvckVhY2godG9rZW4gPT4ge1xyXG4gICAgICAgIGlmICh0b2tlbikge1xyXG4gICAgICAgICAgICBjb25zdCBba2V5LCB2YWx1ZV0gPSB0b2tlbi5zcGxpdCgnPScpO1xyXG4gICAgICAgICAgICBvYmpbZGVjb2RlVVJJQ29tcG9uZW50KGtleSldID0gZGVjb2RlVVJJQ29tcG9uZW50KHZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBvYmo7XHJcbn1cclxuLyoqXHJcbiAqIEV4dHJhY3QgdGhlIHF1ZXJ5IHN0cmluZyBwYXJ0IG9mIGEgVVJMLCBpbmNsdWRpbmcgdGhlIGxlYWRpbmcgcXVlc3Rpb24gbWFyayAoaWYgcHJlc2VudCkuXHJcbiAqL1xyXG5mdW5jdGlvbiBleHRyYWN0UXVlcnlzdHJpbmcodXJsKSB7XHJcbiAgICBjb25zdCBxdWVyeVN0YXJ0ID0gdXJsLmluZGV4T2YoJz8nKTtcclxuICAgIGlmICghcXVlcnlTdGFydCkge1xyXG4gICAgICAgIHJldHVybiAnJztcclxuICAgIH1cclxuICAgIGNvbnN0IGZyYWdtZW50U3RhcnQgPSB1cmwuaW5kZXhPZignIycsIHF1ZXJ5U3RhcnQpO1xyXG4gICAgcmV0dXJuIHVybC5zdWJzdHJpbmcocXVlcnlTdGFydCwgZnJhZ21lbnRTdGFydCA+IDAgPyBmcmFnbWVudFN0YXJ0IDogdW5kZWZpbmVkKTtcclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG4vKipcclxuICogQGZpbGVvdmVydmlldyBTSEEtMSBjcnlwdG9ncmFwaGljIGhhc2guXHJcbiAqIFZhcmlhYmxlIG5hbWVzIGZvbGxvdyB0aGUgbm90YXRpb24gaW4gRklQUyBQVUIgMTgwLTM6XHJcbiAqIGh0dHA6Ly9jc3JjLm5pc3QuZ292L3B1YmxpY2F0aW9ucy9maXBzL2ZpcHMxODAtMy9maXBzMTgwLTNfZmluYWwucGRmLlxyXG4gKlxyXG4gKiBVc2FnZTpcclxuICogICB2YXIgc2hhMSA9IG5ldyBzaGExKCk7XHJcbiAqICAgc2hhMS51cGRhdGUoYnl0ZXMpO1xyXG4gKiAgIHZhciBoYXNoID0gc2hhMS5kaWdlc3QoKTtcclxuICpcclxuICogUGVyZm9ybWFuY2U6XHJcbiAqICAgQ2hyb21lIDIzOiAgIH40MDAgTWJpdC9zXHJcbiAqICAgRmlyZWZveCAxNjogIH4yNTAgTWJpdC9zXHJcbiAqXHJcbiAqL1xyXG4vKipcclxuICogU0hBLTEgY3J5cHRvZ3JhcGhpYyBoYXNoIGNvbnN0cnVjdG9yLlxyXG4gKlxyXG4gKiBUaGUgcHJvcGVydGllcyBkZWNsYXJlZCBoZXJlIGFyZSBkaXNjdXNzZWQgaW4gdGhlIGFib3ZlIGFsZ29yaXRobSBkb2N1bWVudC5cclxuICogQGNvbnN0cnVjdG9yXHJcbiAqIEBmaW5hbFxyXG4gKiBAc3RydWN0XHJcbiAqL1xyXG5jbGFzcyBTaGExIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEhvbGRzIHRoZSBwcmV2aW91cyB2YWx1ZXMgb2YgYWNjdW11bGF0ZWQgdmFyaWFibGVzIGEtZSBpbiB0aGUgY29tcHJlc3NfXHJcbiAgICAgICAgICogZnVuY3Rpb24uXHJcbiAgICAgICAgICogQHByaXZhdGVcclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmNoYWluXyA9IFtdO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEEgYnVmZmVyIGhvbGRpbmcgdGhlIHBhcnRpYWxseSBjb21wdXRlZCBoYXNoIHJlc3VsdC5cclxuICAgICAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuYnVmXyA9IFtdO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEFuIGFycmF5IG9mIDgwIGJ5dGVzLCBlYWNoIGEgcGFydCBvZiB0aGUgbWVzc2FnZSB0byBiZSBoYXNoZWQuICBSZWZlcnJlZCB0b1xyXG4gICAgICAgICAqIGFzIHRoZSBtZXNzYWdlIHNjaGVkdWxlIGluIHRoZSBkb2NzLlxyXG4gICAgICAgICAqIEBwcml2YXRlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5XXyA9IFtdO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIENvbnRhaW5zIGRhdGEgbmVlZGVkIHRvIHBhZCBtZXNzYWdlcyBsZXNzIHRoYW4gNjQgYnl0ZXMuXHJcbiAgICAgICAgICogQHByaXZhdGVcclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLnBhZF8gPSBbXTtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBAcHJpdmF0ZSB7bnVtYmVyfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuaW5idWZfID0gMDtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBAcHJpdmF0ZSB7bnVtYmVyfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMudG90YWxfID0gMDtcclxuICAgICAgICB0aGlzLmJsb2NrU2l6ZSA9IDUxMiAvIDg7XHJcbiAgICAgICAgdGhpcy5wYWRfWzBdID0gMTI4O1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgdGhpcy5ibG9ja1NpemU7ICsraSkge1xyXG4gICAgICAgICAgICB0aGlzLnBhZF9baV0gPSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnJlc2V0KCk7XHJcbiAgICB9XHJcbiAgICByZXNldCgpIHtcclxuICAgICAgICB0aGlzLmNoYWluX1swXSA9IDB4Njc0NTIzMDE7XHJcbiAgICAgICAgdGhpcy5jaGFpbl9bMV0gPSAweGVmY2RhYjg5O1xyXG4gICAgICAgIHRoaXMuY2hhaW5fWzJdID0gMHg5OGJhZGNmZTtcclxuICAgICAgICB0aGlzLmNoYWluX1szXSA9IDB4MTAzMjU0NzY7XHJcbiAgICAgICAgdGhpcy5jaGFpbl9bNF0gPSAweGMzZDJlMWYwO1xyXG4gICAgICAgIHRoaXMuaW5idWZfID0gMDtcclxuICAgICAgICB0aGlzLnRvdGFsXyA9IDA7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIEludGVybmFsIGNvbXByZXNzIGhlbHBlciBmdW5jdGlvbi5cclxuICAgICAqIEBwYXJhbSBidWYgQmxvY2sgdG8gY29tcHJlc3MuXHJcbiAgICAgKiBAcGFyYW0gb2Zmc2V0IE9mZnNldCBvZiB0aGUgYmxvY2sgaW4gdGhlIGJ1ZmZlci5cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIGNvbXByZXNzXyhidWYsIG9mZnNldCkge1xyXG4gICAgICAgIGlmICghb2Zmc2V0KSB7XHJcbiAgICAgICAgICAgIG9mZnNldCA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IFcgPSB0aGlzLldfO1xyXG4gICAgICAgIC8vIGdldCAxNiBiaWcgZW5kaWFuIHdvcmRzXHJcbiAgICAgICAgaWYgKHR5cGVvZiBidWYgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTY7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgLy8gVE9ETyh1c2VyKTogW2J1ZyA4MTQwMTIyXSBSZWNlbnQgdmVyc2lvbnMgb2YgU2FmYXJpIGZvciBNYWMgT1MgYW5kIGlPU1xyXG4gICAgICAgICAgICAgICAgLy8gaGF2ZSBhIGJ1ZyB0aGF0IHR1cm5zIHRoZSBwb3N0LWluY3JlbWVudCArKyBvcGVyYXRvciBpbnRvIHByZS1pbmNyZW1lbnRcclxuICAgICAgICAgICAgICAgIC8vIGR1cmluZyBKSVQgY29tcGlsYXRpb24uICBXZSBoYXZlIGNvZGUgdGhhdCBkZXBlbmRzIGhlYXZpbHkgb24gU0hBLTEgZm9yXHJcbiAgICAgICAgICAgICAgICAvLyBjb3JyZWN0bmVzcyBhbmQgd2hpY2ggaXMgYWZmZWN0ZWQgYnkgdGhpcyBidWcsIHNvIEkndmUgcmVtb3ZlZCBhbGwgdXNlc1xyXG4gICAgICAgICAgICAgICAgLy8gb2YgcG9zdC1pbmNyZW1lbnQgKysgaW4gd2hpY2ggdGhlIHJlc3VsdCB2YWx1ZSBpcyB1c2VkLiAgV2UgY2FuIHJldmVydFxyXG4gICAgICAgICAgICAgICAgLy8gdGhpcyBjaGFuZ2Ugb25jZSB0aGUgU2FmYXJpIGJ1Z1xyXG4gICAgICAgICAgICAgICAgLy8gKGh0dHBzOi8vYnVncy53ZWJraXQub3JnL3Nob3dfYnVnLmNnaT9pZD0xMDkwMzYpIGhhcyBiZWVuIGZpeGVkIGFuZFxyXG4gICAgICAgICAgICAgICAgLy8gbW9zdCBjbGllbnRzIGhhdmUgYmVlbiB1cGRhdGVkLlxyXG4gICAgICAgICAgICAgICAgV1tpXSA9XHJcbiAgICAgICAgICAgICAgICAgICAgKGJ1Zi5jaGFyQ29kZUF0KG9mZnNldCkgPDwgMjQpIHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgKGJ1Zi5jaGFyQ29kZUF0KG9mZnNldCArIDEpIDw8IDE2KSB8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIChidWYuY2hhckNvZGVBdChvZmZzZXQgKyAyKSA8PCA4KSB8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1Zi5jaGFyQ29kZUF0KG9mZnNldCArIDMpO1xyXG4gICAgICAgICAgICAgICAgb2Zmc2V0ICs9IDQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTY7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgV1tpXSA9XHJcbiAgICAgICAgICAgICAgICAgICAgKGJ1ZltvZmZzZXRdIDw8IDI0KSB8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIChidWZbb2Zmc2V0ICsgMV0gPDwgMTYpIHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgKGJ1ZltvZmZzZXQgKyAyXSA8PCA4KSB8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZltvZmZzZXQgKyAzXTtcclxuICAgICAgICAgICAgICAgIG9mZnNldCArPSA0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGV4cGFuZCB0byA4MCB3b3Jkc1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAxNjsgaSA8IDgwOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgdCA9IFdbaSAtIDNdIF4gV1tpIC0gOF0gXiBXW2kgLSAxNF0gXiBXW2kgLSAxNl07XHJcbiAgICAgICAgICAgIFdbaV0gPSAoKHQgPDwgMSkgfCAodCA+Pj4gMzEpKSAmIDB4ZmZmZmZmZmY7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBhID0gdGhpcy5jaGFpbl9bMF07XHJcbiAgICAgICAgbGV0IGIgPSB0aGlzLmNoYWluX1sxXTtcclxuICAgICAgICBsZXQgYyA9IHRoaXMuY2hhaW5fWzJdO1xyXG4gICAgICAgIGxldCBkID0gdGhpcy5jaGFpbl9bM107XHJcbiAgICAgICAgbGV0IGUgPSB0aGlzLmNoYWluX1s0XTtcclxuICAgICAgICBsZXQgZiwgaztcclxuICAgICAgICAvLyBUT0RPKHVzZXIpOiBUcnkgdG8gdW5yb2xsIHRoaXMgbG9vcCB0byBzcGVlZCB1cCB0aGUgY29tcHV0YXRpb24uXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA4MDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChpIDwgNDApIHtcclxuICAgICAgICAgICAgICAgIGlmIChpIDwgMjApIHtcclxuICAgICAgICAgICAgICAgICAgICBmID0gZCBeIChiICYgKGMgXiBkKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgayA9IDB4NWE4Mjc5OTk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBmID0gYiBeIGMgXiBkO1xyXG4gICAgICAgICAgICAgICAgICAgIGsgPSAweDZlZDllYmExO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKGkgPCA2MCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGYgPSAoYiAmIGMpIHwgKGQgJiAoYiB8IGMpKTtcclxuICAgICAgICAgICAgICAgICAgICBrID0gMHg4ZjFiYmNkYztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGYgPSBiIF4gYyBeIGQ7XHJcbiAgICAgICAgICAgICAgICAgICAgayA9IDB4Y2E2MmMxZDY7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgdCA9ICgoKGEgPDwgNSkgfCAoYSA+Pj4gMjcpKSArIGYgKyBlICsgayArIFdbaV0pICYgMHhmZmZmZmZmZjtcclxuICAgICAgICAgICAgZSA9IGQ7XHJcbiAgICAgICAgICAgIGQgPSBjO1xyXG4gICAgICAgICAgICBjID0gKChiIDw8IDMwKSB8IChiID4+PiAyKSkgJiAweGZmZmZmZmZmO1xyXG4gICAgICAgICAgICBiID0gYTtcclxuICAgICAgICAgICAgYSA9IHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY2hhaW5fWzBdID0gKHRoaXMuY2hhaW5fWzBdICsgYSkgJiAweGZmZmZmZmZmO1xyXG4gICAgICAgIHRoaXMuY2hhaW5fWzFdID0gKHRoaXMuY2hhaW5fWzFdICsgYikgJiAweGZmZmZmZmZmO1xyXG4gICAgICAgIHRoaXMuY2hhaW5fWzJdID0gKHRoaXMuY2hhaW5fWzJdICsgYykgJiAweGZmZmZmZmZmO1xyXG4gICAgICAgIHRoaXMuY2hhaW5fWzNdID0gKHRoaXMuY2hhaW5fWzNdICsgZCkgJiAweGZmZmZmZmZmO1xyXG4gICAgICAgIHRoaXMuY2hhaW5fWzRdID0gKHRoaXMuY2hhaW5fWzRdICsgZSkgJiAweGZmZmZmZmZmO1xyXG4gICAgfVxyXG4gICAgdXBkYXRlKGJ5dGVzLCBsZW5ndGgpIHtcclxuICAgICAgICAvLyBUT0RPKGpvaG5sZW56KTogdGlnaHRlbiB0aGUgZnVuY3Rpb24gc2lnbmF0dXJlIGFuZCByZW1vdmUgdGhpcyBjaGVja1xyXG4gICAgICAgIGlmIChieXRlcyA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGxlbmd0aCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGxlbmd0aCA9IGJ5dGVzLmxlbmd0aDtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgbGVuZ3RoTWludXNCbG9jayA9IGxlbmd0aCAtIHRoaXMuYmxvY2tTaXplO1xyXG4gICAgICAgIGxldCBuID0gMDtcclxuICAgICAgICAvLyBVc2luZyBsb2NhbCBpbnN0ZWFkIG9mIG1lbWJlciB2YXJpYWJsZXMgZ2l2ZXMgfjUlIHNwZWVkdXAgb24gRmlyZWZveCAxNi5cclxuICAgICAgICBjb25zdCBidWYgPSB0aGlzLmJ1Zl87XHJcbiAgICAgICAgbGV0IGluYnVmID0gdGhpcy5pbmJ1Zl87XHJcbiAgICAgICAgLy8gVGhlIG91dGVyIHdoaWxlIGxvb3Agc2hvdWxkIGV4ZWN1dGUgYXQgbW9zdCB0d2ljZS5cclxuICAgICAgICB3aGlsZSAobiA8IGxlbmd0aCkge1xyXG4gICAgICAgICAgICAvLyBXaGVuIHdlIGhhdmUgbm8gZGF0YSBpbiB0aGUgYmxvY2sgdG8gdG9wIHVwLCB3ZSBjYW4gZGlyZWN0bHkgcHJvY2VzcyB0aGVcclxuICAgICAgICAgICAgLy8gaW5wdXQgYnVmZmVyIChhc3N1bWluZyBpdCBjb250YWlucyBzdWZmaWNpZW50IGRhdGEpLiBUaGlzIGdpdmVzIH4yNSVcclxuICAgICAgICAgICAgLy8gc3BlZWR1cCBvbiBDaHJvbWUgMjMgYW5kIH4xNSUgc3BlZWR1cCBvbiBGaXJlZm94IDE2LCBidXQgcmVxdWlyZXMgdGhhdFxyXG4gICAgICAgICAgICAvLyB0aGUgZGF0YSBpcyBwcm92aWRlZCBpbiBsYXJnZSBjaHVua3MgKG9yIGluIG11bHRpcGxlcyBvZiA2NCBieXRlcykuXHJcbiAgICAgICAgICAgIGlmIChpbmJ1ZiA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKG4gPD0gbGVuZ3RoTWludXNCbG9jaykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29tcHJlc3NfKGJ5dGVzLCBuKTtcclxuICAgICAgICAgICAgICAgICAgICBuICs9IHRoaXMuYmxvY2tTaXplO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgYnl0ZXMgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAobiA8IGxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGJ1ZltpbmJ1Zl0gPSBieXRlcy5jaGFyQ29kZUF0KG4pO1xyXG4gICAgICAgICAgICAgICAgICAgICsraW5idWY7XHJcbiAgICAgICAgICAgICAgICAgICAgKytuO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpbmJ1ZiA9PT0gdGhpcy5ibG9ja1NpemUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb21wcmVzc18oYnVmKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5idWYgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBKdW1wIHRvIHRoZSBvdXRlciBsb29wIHNvIHdlIHVzZSB0aGUgZnVsbC1ibG9jayBvcHRpbWl6YXRpb24uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHdoaWxlIChuIDwgbGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYnVmW2luYnVmXSA9IGJ5dGVzW25dO1xyXG4gICAgICAgICAgICAgICAgICAgICsraW5idWY7XHJcbiAgICAgICAgICAgICAgICAgICAgKytuO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpbmJ1ZiA9PT0gdGhpcy5ibG9ja1NpemUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb21wcmVzc18oYnVmKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5idWYgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBKdW1wIHRvIHRoZSBvdXRlciBsb29wIHNvIHdlIHVzZSB0aGUgZnVsbC1ibG9jayBvcHRpbWl6YXRpb24uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmluYnVmXyA9IGluYnVmO1xyXG4gICAgICAgIHRoaXMudG90YWxfICs9IGxlbmd0aDtcclxuICAgIH1cclxuICAgIC8qKiBAb3ZlcnJpZGUgKi9cclxuICAgIGRpZ2VzdCgpIHtcclxuICAgICAgICBjb25zdCBkaWdlc3QgPSBbXTtcclxuICAgICAgICBsZXQgdG90YWxCaXRzID0gdGhpcy50b3RhbF8gKiA4O1xyXG4gICAgICAgIC8vIEFkZCBwYWQgMHg4MCAweDAwKi5cclxuICAgICAgICBpZiAodGhpcy5pbmJ1Zl8gPCA1Nikge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZSh0aGlzLnBhZF8sIDU2IC0gdGhpcy5pbmJ1Zl8pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGUodGhpcy5wYWRfLCB0aGlzLmJsb2NrU2l6ZSAtICh0aGlzLmluYnVmXyAtIDU2KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIEFkZCAjIGJpdHMuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IHRoaXMuYmxvY2tTaXplIC0gMTsgaSA+PSA1NjsgaS0tKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYnVmX1tpXSA9IHRvdGFsQml0cyAmIDI1NTtcclxuICAgICAgICAgICAgdG90YWxCaXRzIC89IDI1NjsgLy8gRG9uJ3QgdXNlIGJpdC1zaGlmdGluZyBoZXJlIVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmNvbXByZXNzXyh0aGlzLmJ1Zl8pO1xyXG4gICAgICAgIGxldCBuID0gMDtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDU7IGkrKykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMjQ7IGogPj0gMDsgaiAtPSA4KSB7XHJcbiAgICAgICAgICAgICAgICBkaWdlc3Rbbl0gPSAodGhpcy5jaGFpbl9baV0gPj4gaikgJiAyNTU7XHJcbiAgICAgICAgICAgICAgICArK247XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGRpZ2VzdDtcclxuICAgIH1cclxufVxuXG4vKipcclxuICogSGVscGVyIHRvIG1ha2UgYSBTdWJzY3JpYmUgZnVuY3Rpb24gKGp1c3QgbGlrZSBQcm9taXNlIGhlbHBzIG1ha2UgYVxyXG4gKiBUaGVuYWJsZSkuXHJcbiAqXHJcbiAqIEBwYXJhbSBleGVjdXRvciBGdW5jdGlvbiB3aGljaCBjYW4gbWFrZSBjYWxscyB0byBhIHNpbmdsZSBPYnNlcnZlclxyXG4gKiAgICAgYXMgYSBwcm94eS5cclxuICogQHBhcmFtIG9uTm9PYnNlcnZlcnMgQ2FsbGJhY2sgd2hlbiBjb3VudCBvZiBPYnNlcnZlcnMgZ29lcyB0byB6ZXJvLlxyXG4gKi9cclxuZnVuY3Rpb24gY3JlYXRlU3Vic2NyaWJlKGV4ZWN1dG9yLCBvbk5vT2JzZXJ2ZXJzKSB7XHJcbiAgICBjb25zdCBwcm94eSA9IG5ldyBPYnNlcnZlclByb3h5KGV4ZWN1dG9yLCBvbk5vT2JzZXJ2ZXJzKTtcclxuICAgIHJldHVybiBwcm94eS5zdWJzY3JpYmUuYmluZChwcm94eSk7XHJcbn1cclxuLyoqXHJcbiAqIEltcGxlbWVudCBmYW4tb3V0IGZvciBhbnkgbnVtYmVyIG9mIE9ic2VydmVycyBhdHRhY2hlZCB2aWEgYSBzdWJzY3JpYmVcclxuICogZnVuY3Rpb24uXHJcbiAqL1xyXG5jbGFzcyBPYnNlcnZlclByb3h5IHtcclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIGV4ZWN1dG9yIEZ1bmN0aW9uIHdoaWNoIGNhbiBtYWtlIGNhbGxzIHRvIGEgc2luZ2xlIE9ic2VydmVyXHJcbiAgICAgKiAgICAgYXMgYSBwcm94eS5cclxuICAgICAqIEBwYXJhbSBvbk5vT2JzZXJ2ZXJzIENhbGxiYWNrIHdoZW4gY291bnQgb2YgT2JzZXJ2ZXJzIGdvZXMgdG8gemVyby5cclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoZXhlY3V0b3IsIG9uTm9PYnNlcnZlcnMpIHtcclxuICAgICAgICB0aGlzLm9ic2VydmVycyA9IFtdO1xyXG4gICAgICAgIHRoaXMudW5zdWJzY3JpYmVzID0gW107XHJcbiAgICAgICAgdGhpcy5vYnNlcnZlckNvdW50ID0gMDtcclxuICAgICAgICAvLyBNaWNyby10YXNrIHNjaGVkdWxpbmcgYnkgY2FsbGluZyB0YXNrLnRoZW4oKS5cclxuICAgICAgICB0aGlzLnRhc2sgPSBQcm9taXNlLnJlc29sdmUoKTtcclxuICAgICAgICB0aGlzLmZpbmFsaXplZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMub25Ob09ic2VydmVycyA9IG9uTm9PYnNlcnZlcnM7XHJcbiAgICAgICAgLy8gQ2FsbCB0aGUgZXhlY3V0b3IgYXN5bmNocm9ub3VzbHkgc28gc3Vic2NyaWJlcnMgdGhhdCBhcmUgY2FsbGVkXHJcbiAgICAgICAgLy8gc3luY2hyb25vdXNseSBhZnRlciB0aGUgY3JlYXRpb24gb2YgdGhlIHN1YnNjcmliZSBmdW5jdGlvblxyXG4gICAgICAgIC8vIGNhbiBzdGlsbCByZWNlaXZlIHRoZSB2ZXJ5IGZpcnN0IHZhbHVlIGdlbmVyYXRlZCBpbiB0aGUgZXhlY3V0b3IuXHJcbiAgICAgICAgdGhpcy50YXNrXHJcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgZXhlY3V0b3IodGhpcyk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAgICAgLmNhdGNoKGUgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmVycm9yKGUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgbmV4dCh2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMuZm9yRWFjaE9ic2VydmVyKChvYnNlcnZlcikgPT4ge1xyXG4gICAgICAgICAgICBvYnNlcnZlci5uZXh0KHZhbHVlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGVycm9yKGVycm9yKSB7XHJcbiAgICAgICAgdGhpcy5mb3JFYWNoT2JzZXJ2ZXIoKG9ic2VydmVyKSA9PiB7XHJcbiAgICAgICAgICAgIG9ic2VydmVyLmVycm9yKGVycm9yKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmNsb3NlKGVycm9yKTtcclxuICAgIH1cclxuICAgIGNvbXBsZXRlKCkge1xyXG4gICAgICAgIHRoaXMuZm9yRWFjaE9ic2VydmVyKChvYnNlcnZlcikgPT4ge1xyXG4gICAgICAgICAgICBvYnNlcnZlci5jb21wbGV0ZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuY2xvc2UoKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogU3Vic2NyaWJlIGZ1bmN0aW9uIHRoYXQgY2FuIGJlIHVzZWQgdG8gYWRkIGFuIE9ic2VydmVyIHRvIHRoZSBmYW4tb3V0IGxpc3QuXHJcbiAgICAgKlxyXG4gICAgICogLSBXZSByZXF1aXJlIHRoYXQgbm8gZXZlbnQgaXMgc2VudCB0byBhIHN1YnNjcmliZXIgc3ljaHJvbm91c2x5IHRvIHRoZWlyXHJcbiAgICAgKiAgIGNhbGwgdG8gc3Vic2NyaWJlKCkuXHJcbiAgICAgKi9cclxuICAgIHN1YnNjcmliZShuZXh0T3JPYnNlcnZlciwgZXJyb3IsIGNvbXBsZXRlKSB7XHJcbiAgICAgICAgbGV0IG9ic2VydmVyO1xyXG4gICAgICAgIGlmIChuZXh0T3JPYnNlcnZlciA9PT0gdW5kZWZpbmVkICYmXHJcbiAgICAgICAgICAgIGVycm9yID09PSB1bmRlZmluZWQgJiZcclxuICAgICAgICAgICAgY29tcGxldGUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ01pc3NpbmcgT2JzZXJ2ZXIuJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIEFzc2VtYmxlIGFuIE9ic2VydmVyIG9iamVjdCB3aGVuIHBhc3NlZCBhcyBjYWxsYmFjayBmdW5jdGlvbnMuXHJcbiAgICAgICAgaWYgKGltcGxlbWVudHNBbnlNZXRob2RzKG5leHRPck9ic2VydmVyLCBbXHJcbiAgICAgICAgICAgICduZXh0JyxcclxuICAgICAgICAgICAgJ2Vycm9yJyxcclxuICAgICAgICAgICAgJ2NvbXBsZXRlJ1xyXG4gICAgICAgIF0pKSB7XHJcbiAgICAgICAgICAgIG9ic2VydmVyID0gbmV4dE9yT2JzZXJ2ZXI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBvYnNlcnZlciA9IHtcclxuICAgICAgICAgICAgICAgIG5leHQ6IG5leHRPck9ic2VydmVyLFxyXG4gICAgICAgICAgICAgICAgZXJyb3IsXHJcbiAgICAgICAgICAgICAgICBjb21wbGV0ZVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAob2JzZXJ2ZXIubmV4dCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIG9ic2VydmVyLm5leHQgPSBub29wO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAob2JzZXJ2ZXIuZXJyb3IgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBvYnNlcnZlci5lcnJvciA9IG5vb3A7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChvYnNlcnZlci5jb21wbGV0ZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIG9ic2VydmVyLmNvbXBsZXRlID0gbm9vcDtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgdW5zdWIgPSB0aGlzLnVuc3Vic2NyaWJlT25lLmJpbmQodGhpcywgdGhpcy5vYnNlcnZlcnMubGVuZ3RoKTtcclxuICAgICAgICAvLyBBdHRlbXB0IHRvIHN1YnNjcmliZSB0byBhIHRlcm1pbmF0ZWQgT2JzZXJ2YWJsZSAtIHdlXHJcbiAgICAgICAgLy8ganVzdCByZXNwb25kIHRvIHRoZSBPYnNlcnZlciB3aXRoIHRoZSBmaW5hbCBlcnJvciBvciBjb21wbGV0ZVxyXG4gICAgICAgIC8vIGV2ZW50LlxyXG4gICAgICAgIGlmICh0aGlzLmZpbmFsaXplZCkge1xyXG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWZsb2F0aW5nLXByb21pc2VzXHJcbiAgICAgICAgICAgIHRoaXMudGFzay50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZmluYWxFcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvYnNlcnZlci5lcnJvcih0aGlzLmZpbmFsRXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb2JzZXJ2ZXIuY29tcGxldGUoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIG5vdGhpbmdcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMub2JzZXJ2ZXJzLnB1c2gob2JzZXJ2ZXIpO1xyXG4gICAgICAgIHJldHVybiB1bnN1YjtcclxuICAgIH1cclxuICAgIC8vIFVuc3Vic2NyaWJlIGlzIHN5bmNocm9ub3VzIC0gd2UgZ3VhcmFudGVlIHRoYXQgbm8gZXZlbnRzIGFyZSBzZW50IHRvXHJcbiAgICAvLyBhbnkgdW5zdWJzY3JpYmVkIE9ic2VydmVyLlxyXG4gICAgdW5zdWJzY3JpYmVPbmUoaSkge1xyXG4gICAgICAgIGlmICh0aGlzLm9ic2VydmVycyA9PT0gdW5kZWZpbmVkIHx8IHRoaXMub2JzZXJ2ZXJzW2ldID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBkZWxldGUgdGhpcy5vYnNlcnZlcnNbaV07XHJcbiAgICAgICAgdGhpcy5vYnNlcnZlckNvdW50IC09IDE7XHJcbiAgICAgICAgaWYgKHRoaXMub2JzZXJ2ZXJDb3VudCA9PT0gMCAmJiB0aGlzLm9uTm9PYnNlcnZlcnMgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLm9uTm9PYnNlcnZlcnModGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZm9yRWFjaE9ic2VydmVyKGZuKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZmluYWxpemVkKSB7XHJcbiAgICAgICAgICAgIC8vIEFscmVhZHkgY2xvc2VkIGJ5IHByZXZpb3VzIGV2ZW50Li4uLmp1c3QgZWF0IHRoZSBhZGRpdGlvbmFsIHZhbHVlcy5cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBTaW5jZSBzZW5kT25lIGNhbGxzIGFzeW5jaHJvbm91c2x5IC0gdGhlcmUgaXMgbm8gY2hhbmNlIHRoYXRcclxuICAgICAgICAvLyB0aGlzLm9ic2VydmVycyB3aWxsIGJlY29tZSB1bmRlZmluZWQuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm9ic2VydmVycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLnNlbmRPbmUoaSwgZm4pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8vIENhbGwgdGhlIE9ic2VydmVyIHZpYSBvbmUgb2YgaXQncyBjYWxsYmFjayBmdW5jdGlvbi4gV2UgYXJlIGNhcmVmdWwgdG9cclxuICAgIC8vIGNvbmZpcm0gdGhhdCB0aGUgb2JzZXJ2ZSBoYXMgbm90IGJlZW4gdW5zdWJzY3JpYmVkIHNpbmNlIHRoaXMgYXN5bmNocm9ub3VzXHJcbiAgICAvLyBmdW5jdGlvbiBoYWQgYmVlbiBxdWV1ZWQuXHJcbiAgICBzZW5kT25lKGksIGZuKSB7XHJcbiAgICAgICAgLy8gRXhlY3V0ZSB0aGUgY2FsbGJhY2sgYXN5bmNocm9ub3VzbHlcclxuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWZsb2F0aW5nLXByb21pc2VzXHJcbiAgICAgICAgdGhpcy50YXNrLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5vYnNlcnZlcnMgIT09IHVuZGVmaW5lZCAmJiB0aGlzLm9ic2VydmVyc1tpXSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZuKHRoaXMub2JzZXJ2ZXJzW2ldKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gSWdub3JlIGV4Y2VwdGlvbnMgcmFpc2VkIGluIE9ic2VydmVycyBvciBtaXNzaW5nIG1ldGhvZHMgb2YgYW5cclxuICAgICAgICAgICAgICAgICAgICAvLyBPYnNlcnZlci5cclxuICAgICAgICAgICAgICAgICAgICAvLyBMb2cgZXJyb3IgdG8gY29uc29sZS4gYi8zMTQwNDgwNlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcgJiYgY29uc29sZS5lcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgY2xvc2UoZXJyKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZmluYWxpemVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5maW5hbGl6ZWQgPSB0cnVlO1xyXG4gICAgICAgIGlmIChlcnIgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLmZpbmFsRXJyb3IgPSBlcnI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIFByb3h5IGlzIG5vIGxvbmdlciBuZWVkZWQgLSBnYXJiYWdlIGNvbGxlY3QgcmVmZXJlbmNlc1xyXG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZmxvYXRpbmctcHJvbWlzZXNcclxuICAgICAgICB0aGlzLnRhc2sudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMub2JzZXJ2ZXJzID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICB0aGlzLm9uTm9PYnNlcnZlcnMgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuLyoqIFR1cm4gc3luY2hyb25vdXMgZnVuY3Rpb24gaW50byBvbmUgY2FsbGVkIGFzeW5jaHJvbm91c2x5LiAqL1xyXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L2Jhbi10eXBlc1xyXG5mdW5jdGlvbiBhc3luYyhmbiwgb25FcnJvcikge1xyXG4gICAgcmV0dXJuICguLi5hcmdzKSA9PiB7XHJcbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKHRydWUpXHJcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgZm4oLi4uYXJncyk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAgICAgLmNhdGNoKChlcnJvcikgPT4ge1xyXG4gICAgICAgICAgICBpZiAob25FcnJvcikge1xyXG4gICAgICAgICAgICAgICAgb25FcnJvcihlcnJvcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbn1cclxuLyoqXHJcbiAqIFJldHVybiB0cnVlIGlmIHRoZSBvYmplY3QgcGFzc2VkIGluIGltcGxlbWVudHMgYW55IG9mIHRoZSBuYW1lZCBtZXRob2RzLlxyXG4gKi9cclxuZnVuY3Rpb24gaW1wbGVtZW50c0FueU1ldGhvZHMob2JqLCBtZXRob2RzKSB7XHJcbiAgICBpZiAodHlwZW9mIG9iaiAhPT0gJ29iamVjdCcgfHwgb2JqID09PSBudWxsKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgZm9yIChjb25zdCBtZXRob2Qgb2YgbWV0aG9kcykge1xyXG4gICAgICAgIGlmIChtZXRob2QgaW4gb2JqICYmIHR5cGVvZiBvYmpbbWV0aG9kXSA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbn1cclxuZnVuY3Rpb24gbm9vcCgpIHtcclxuICAgIC8vIGRvIG5vdGhpbmdcclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG4vKipcclxuICogQ2hlY2sgdG8gbWFrZSBzdXJlIHRoZSBhcHByb3ByaWF0ZSBudW1iZXIgb2YgYXJndW1lbnRzIGFyZSBwcm92aWRlZCBmb3IgYSBwdWJsaWMgZnVuY3Rpb24uXHJcbiAqIFRocm93cyBhbiBlcnJvciBpZiBpdCBmYWlscy5cclxuICpcclxuICogQHBhcmFtIGZuTmFtZSBUaGUgZnVuY3Rpb24gbmFtZVxyXG4gKiBAcGFyYW0gbWluQ291bnQgVGhlIG1pbmltdW0gbnVtYmVyIG9mIGFyZ3VtZW50cyB0byBhbGxvdyBmb3IgdGhlIGZ1bmN0aW9uIGNhbGxcclxuICogQHBhcmFtIG1heENvdW50IFRoZSBtYXhpbXVtIG51bWJlciBvZiBhcmd1bWVudCB0byBhbGxvdyBmb3IgdGhlIGZ1bmN0aW9uIGNhbGxcclxuICogQHBhcmFtIGFyZ0NvdW50IFRoZSBhY3R1YWwgbnVtYmVyIG9mIGFyZ3VtZW50cyBwcm92aWRlZC5cclxuICovXHJcbmNvbnN0IHZhbGlkYXRlQXJnQ291bnQgPSBmdW5jdGlvbiAoZm5OYW1lLCBtaW5Db3VudCwgbWF4Q291bnQsIGFyZ0NvdW50KSB7XHJcbiAgICBsZXQgYXJnRXJyb3I7XHJcbiAgICBpZiAoYXJnQ291bnQgPCBtaW5Db3VudCkge1xyXG4gICAgICAgIGFyZ0Vycm9yID0gJ2F0IGxlYXN0ICcgKyBtaW5Db3VudDtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGFyZ0NvdW50ID4gbWF4Q291bnQpIHtcclxuICAgICAgICBhcmdFcnJvciA9IG1heENvdW50ID09PSAwID8gJ25vbmUnIDogJ25vIG1vcmUgdGhhbiAnICsgbWF4Q291bnQ7XHJcbiAgICB9XHJcbiAgICBpZiAoYXJnRXJyb3IpIHtcclxuICAgICAgICBjb25zdCBlcnJvciA9IGZuTmFtZSArXHJcbiAgICAgICAgICAgICcgZmFpbGVkOiBXYXMgY2FsbGVkIHdpdGggJyArXHJcbiAgICAgICAgICAgIGFyZ0NvdW50ICtcclxuICAgICAgICAgICAgKGFyZ0NvdW50ID09PSAxID8gJyBhcmd1bWVudC4nIDogJyBhcmd1bWVudHMuJykgK1xyXG4gICAgICAgICAgICAnIEV4cGVjdHMgJyArXHJcbiAgICAgICAgICAgIGFyZ0Vycm9yICtcclxuICAgICAgICAgICAgJy4nO1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihlcnJvcik7XHJcbiAgICB9XHJcbn07XHJcbi8qKlxyXG4gKiBHZW5lcmF0ZXMgYSBzdHJpbmcgdG8gcHJlZml4IGFuIGVycm9yIG1lc3NhZ2UgYWJvdXQgZmFpbGVkIGFyZ3VtZW50IHZhbGlkYXRpb25cclxuICpcclxuICogQHBhcmFtIGZuTmFtZSBUaGUgZnVuY3Rpb24gbmFtZVxyXG4gKiBAcGFyYW0gYXJnTmFtZSBUaGUgbmFtZSBvZiB0aGUgYXJndW1lbnRcclxuICogQHJldHVybiBUaGUgcHJlZml4IHRvIGFkZCB0byB0aGUgZXJyb3IgdGhyb3duIGZvciB2YWxpZGF0aW9uLlxyXG4gKi9cclxuZnVuY3Rpb24gZXJyb3JQcmVmaXgoZm5OYW1lLCBhcmdOYW1lKSB7XHJcbiAgICByZXR1cm4gYCR7Zm5OYW1lfSBmYWlsZWQ6ICR7YXJnTmFtZX0gYXJndW1lbnQgYDtcclxufVxyXG4vKipcclxuICogQHBhcmFtIGZuTmFtZVxyXG4gKiBAcGFyYW0gYXJndW1lbnROdW1iZXJcclxuICogQHBhcmFtIG5hbWVzcGFjZVxyXG4gKiBAcGFyYW0gb3B0aW9uYWxcclxuICovXHJcbmZ1bmN0aW9uIHZhbGlkYXRlTmFtZXNwYWNlKGZuTmFtZSwgbmFtZXNwYWNlLCBvcHRpb25hbCkge1xyXG4gICAgaWYgKG9wdGlvbmFsICYmICFuYW1lc3BhY2UpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBpZiAodHlwZW9mIG5hbWVzcGFjZSAhPT0gJ3N0cmluZycpIHtcclxuICAgICAgICAvL1RPRE86IEkgc2hvdWxkIGRvIG1vcmUgdmFsaWRhdGlvbiBoZXJlLiBXZSBvbmx5IGFsbG93IGNlcnRhaW4gY2hhcnMgaW4gbmFtZXNwYWNlcy5cclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3JQcmVmaXgoZm5OYW1lLCAnbmFtZXNwYWNlJykgKyAnbXVzdCBiZSBhIHZhbGlkIGZpcmViYXNlIG5hbWVzcGFjZS4nKTtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiB2YWxpZGF0ZUNhbGxiYWNrKGZuTmFtZSwgYXJndW1lbnROYW1lLCBcclxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9iYW4tdHlwZXNcclxuY2FsbGJhY2ssIG9wdGlvbmFsKSB7XHJcbiAgICBpZiAob3B0aW9uYWwgJiYgIWNhbGxiYWNrKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgaWYgKHR5cGVvZiBjYWxsYmFjayAhPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihlcnJvclByZWZpeChmbk5hbWUsIGFyZ3VtZW50TmFtZSkgKyAnbXVzdCBiZSBhIHZhbGlkIGZ1bmN0aW9uLicpO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIHZhbGlkYXRlQ29udGV4dE9iamVjdChmbk5hbWUsIGFyZ3VtZW50TmFtZSwgY29udGV4dCwgb3B0aW9uYWwpIHtcclxuICAgIGlmIChvcHRpb25hbCAmJiAhY29udGV4dCkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGlmICh0eXBlb2YgY29udGV4dCAhPT0gJ29iamVjdCcgfHwgY29udGV4dCA9PT0gbnVsbCkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihlcnJvclByZWZpeChmbk5hbWUsIGFyZ3VtZW50TmFtZSkgKyAnbXVzdCBiZSBhIHZhbGlkIGNvbnRleHQgb2JqZWN0LicpO1xyXG4gICAgfVxyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbi8vIENvZGUgb3JpZ2luYWxseSBjYW1lIGZyb20gZ29vZy5jcnlwdC5zdHJpbmdUb1V0ZjhCeXRlQXJyYXksIGJ1dCBmb3Igc29tZSByZWFzb24gdGhleVxyXG4vLyBhdXRvbWF0aWNhbGx5IHJlcGxhY2VkICdcXHJcXG4nIHdpdGggJ1xcbicsIGFuZCB0aGV5IGRpZG4ndCBoYW5kbGUgc3Vycm9nYXRlIHBhaXJzLFxyXG4vLyBzbyBpdCdzIGJlZW4gbW9kaWZpZWQuXHJcbi8vIE5vdGUgdGhhdCBub3QgYWxsIFVuaWNvZGUgY2hhcmFjdGVycyBhcHBlYXIgYXMgc2luZ2xlIGNoYXJhY3RlcnMgaW4gSmF2YVNjcmlwdCBzdHJpbmdzLlxyXG4vLyBmcm9tQ2hhckNvZGUgcmV0dXJucyB0aGUgVVRGLTE2IGVuY29kaW5nIG9mIGEgY2hhcmFjdGVyIC0gc28gc29tZSBVbmljb2RlIGNoYXJhY3RlcnNcclxuLy8gdXNlIDIgY2hhcmFjdGVycyBpbiBKYXZhc2NyaXB0LiAgQWxsIDQtYnl0ZSBVVEYtOCBjaGFyYWN0ZXJzIGJlZ2luIHdpdGggYSBmaXJzdFxyXG4vLyBjaGFyYWN0ZXIgaW4gdGhlIHJhbmdlIDB4RDgwMCAtIDB4REJGRiAodGhlIGZpcnN0IGNoYXJhY3RlciBvZiBhIHNvLWNhbGxlZCBzdXJyb2dhdGVcclxuLy8gcGFpcikuXHJcbi8vIFNlZSBodHRwOi8vd3d3LmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNS4xLyNzZWMtMTUuMS4zXHJcbi8qKlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyXHJcbiAqIEByZXR1cm4ge0FycmF5fVxyXG4gKi9cclxuY29uc3Qgc3RyaW5nVG9CeXRlQXJyYXkgPSBmdW5jdGlvbiAoc3RyKSB7XHJcbiAgICBjb25zdCBvdXQgPSBbXTtcclxuICAgIGxldCBwID0gMDtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IGMgPSBzdHIuY2hhckNvZGVBdChpKTtcclxuICAgICAgICAvLyBJcyB0aGlzIHRoZSBsZWFkIHN1cnJvZ2F0ZSBpbiBhIHN1cnJvZ2F0ZSBwYWlyP1xyXG4gICAgICAgIGlmIChjID49IDB4ZDgwMCAmJiBjIDw9IDB4ZGJmZikge1xyXG4gICAgICAgICAgICBjb25zdCBoaWdoID0gYyAtIDB4ZDgwMDsgLy8gdGhlIGhpZ2ggMTAgYml0cy5cclxuICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgICAgICBhc3NlcnQoaSA8IHN0ci5sZW5ndGgsICdTdXJyb2dhdGUgcGFpciBtaXNzaW5nIHRyYWlsIHN1cnJvZ2F0ZS4nKTtcclxuICAgICAgICAgICAgY29uc3QgbG93ID0gc3RyLmNoYXJDb2RlQXQoaSkgLSAweGRjMDA7IC8vIHRoZSBsb3cgMTAgYml0cy5cclxuICAgICAgICAgICAgYyA9IDB4MTAwMDAgKyAoaGlnaCA8PCAxMCkgKyBsb3c7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChjIDwgMTI4KSB7XHJcbiAgICAgICAgICAgIG91dFtwKytdID0gYztcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoYyA8IDIwNDgpIHtcclxuICAgICAgICAgICAgb3V0W3ArK10gPSAoYyA+PiA2KSB8IDE5MjtcclxuICAgICAgICAgICAgb3V0W3ArK10gPSAoYyAmIDYzKSB8IDEyODtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoYyA8IDY1NTM2KSB7XHJcbiAgICAgICAgICAgIG91dFtwKytdID0gKGMgPj4gMTIpIHwgMjI0O1xyXG4gICAgICAgICAgICBvdXRbcCsrXSA9ICgoYyA+PiA2KSAmIDYzKSB8IDEyODtcclxuICAgICAgICAgICAgb3V0W3ArK10gPSAoYyAmIDYzKSB8IDEyODtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIG91dFtwKytdID0gKGMgPj4gMTgpIHwgMjQwO1xyXG4gICAgICAgICAgICBvdXRbcCsrXSA9ICgoYyA+PiAxMikgJiA2MykgfCAxMjg7XHJcbiAgICAgICAgICAgIG91dFtwKytdID0gKChjID4+IDYpICYgNjMpIHwgMTI4O1xyXG4gICAgICAgICAgICBvdXRbcCsrXSA9IChjICYgNjMpIHwgMTI4O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBvdXQ7XHJcbn07XHJcbi8qKlxyXG4gKiBDYWxjdWxhdGUgbGVuZ3RoIHdpdGhvdXQgYWN0dWFsbHkgY29udmVydGluZzsgdXNlZnVsIGZvciBkb2luZyBjaGVhcGVyIHZhbGlkYXRpb24uXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJcclxuICogQHJldHVybiB7bnVtYmVyfVxyXG4gKi9cclxuY29uc3Qgc3RyaW5nTGVuZ3RoID0gZnVuY3Rpb24gKHN0cikge1xyXG4gICAgbGV0IHAgPSAwO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBjb25zdCBjID0gc3RyLmNoYXJDb2RlQXQoaSk7XHJcbiAgICAgICAgaWYgKGMgPCAxMjgpIHtcclxuICAgICAgICAgICAgcCsrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChjIDwgMjA0OCkge1xyXG4gICAgICAgICAgICBwICs9IDI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGMgPj0gMHhkODAwICYmIGMgPD0gMHhkYmZmKSB7XHJcbiAgICAgICAgICAgIC8vIExlYWQgc3Vycm9nYXRlIG9mIGEgc3Vycm9nYXRlIHBhaXIuICBUaGUgcGFpciB0b2dldGhlciB3aWxsIHRha2UgNCBieXRlcyB0byByZXByZXNlbnQuXHJcbiAgICAgICAgICAgIHAgKz0gNDtcclxuICAgICAgICAgICAgaSsrOyAvLyBza2lwIHRyYWlsIHN1cnJvZ2F0ZS5cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHAgKz0gMztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcDtcclxufTtcblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDIyIEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqXHJcbiAqIENvcGllZCBmcm9tIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yMTE3NTIzXHJcbiAqIEdlbmVyYXRlcyBhIG5ldyB1dWlkLlxyXG4gKiBAcHVibGljXHJcbiAqL1xyXG5jb25zdCB1dWlkdjQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gJ3h4eHh4eHh4LXh4eHgtNHh4eC15eHh4LXh4eHh4eHh4eHh4eCcucmVwbGFjZSgvW3h5XS9nLCBjID0+IHtcclxuICAgICAgICBjb25zdCByID0gKE1hdGgucmFuZG9tKCkgKiAxNikgfCAwLCB2ID0gYyA9PT0gJ3gnID8gciA6IChyICYgMHgzKSB8IDB4ODtcclxuICAgICAgICByZXR1cm4gdi50b1N0cmluZygxNik7XHJcbiAgICB9KTtcclxufTtcblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqXHJcbiAqIFRoZSBhbW91bnQgb2YgbWlsbGlzZWNvbmRzIHRvIGV4cG9uZW50aWFsbHkgaW5jcmVhc2UuXHJcbiAqL1xyXG5jb25zdCBERUZBVUxUX0lOVEVSVkFMX01JTExJUyA9IDEwMDA7XHJcbi8qKlxyXG4gKiBUaGUgZmFjdG9yIHRvIGJhY2tvZmYgYnkuXHJcbiAqIFNob3VsZCBiZSBhIG51bWJlciBncmVhdGVyIHRoYW4gMS5cclxuICovXHJcbmNvbnN0IERFRkFVTFRfQkFDS09GRl9GQUNUT1IgPSAyO1xyXG4vKipcclxuICogVGhlIG1heGltdW0gbWlsbGlzZWNvbmRzIHRvIGluY3JlYXNlIHRvLlxyXG4gKlxyXG4gKiA8cD5WaXNpYmxlIGZvciB0ZXN0aW5nXHJcbiAqL1xyXG5jb25zdCBNQVhfVkFMVUVfTUlMTElTID0gNCAqIDYwICogNjAgKiAxMDAwOyAvLyBGb3VyIGhvdXJzLCBsaWtlIGlPUyBhbmQgQW5kcm9pZC5cclxuLyoqXHJcbiAqIFRoZSBwZXJjZW50YWdlIG9mIGJhY2tvZmYgdGltZSB0byByYW5kb21pemUgYnkuXHJcbiAqIFNlZVxyXG4gKiBodHRwOi8vZ28vc2FmZS1jbGllbnQtYmVoYXZpb3Ijc3RlcC0xLWRldGVybWluZS10aGUtYXBwcm9wcmlhdGUtcmV0cnktaW50ZXJ2YWwtdG8taGFuZGxlLXNwaWtlLXRyYWZmaWNcclxuICogZm9yIGNvbnRleHQuXHJcbiAqXHJcbiAqIDxwPlZpc2libGUgZm9yIHRlc3RpbmdcclxuICovXHJcbmNvbnN0IFJBTkRPTV9GQUNUT1IgPSAwLjU7XHJcbi8qKlxyXG4gKiBCYXNlZCBvbiB0aGUgYmFja29mZiBtZXRob2QgZnJvbVxyXG4gKiBodHRwczovL2dpdGh1Yi5jb20vZ29vZ2xlL2Nsb3N1cmUtbGlicmFyeS9ibG9iL21hc3Rlci9jbG9zdXJlL2dvb2cvbWF0aC9leHBvbmVudGlhbGJhY2tvZmYuanMuXHJcbiAqIEV4dHJhY3RlZCBoZXJlIHNvIHdlIGRvbid0IG5lZWQgdG8gcGFzcyBtZXRhZGF0YSBhbmQgYSBzdGF0ZWZ1bCBFeHBvbmVudGlhbEJhY2tvZmYgb2JqZWN0IGFyb3VuZC5cclxuICovXHJcbmZ1bmN0aW9uIGNhbGN1bGF0ZUJhY2tvZmZNaWxsaXMoYmFja29mZkNvdW50LCBpbnRlcnZhbE1pbGxpcyA9IERFRkFVTFRfSU5URVJWQUxfTUlMTElTLCBiYWNrb2ZmRmFjdG9yID0gREVGQVVMVF9CQUNLT0ZGX0ZBQ1RPUikge1xyXG4gICAgLy8gQ2FsY3VsYXRlcyBhbiBleHBvbmVudGlhbGx5IGluY3JlYXNpbmcgdmFsdWUuXHJcbiAgICAvLyBEZXZpYXRpb246IGNhbGN1bGF0ZXMgdmFsdWUgZnJvbSBjb3VudCBhbmQgYSBjb25zdGFudCBpbnRlcnZhbCwgc28gd2Ugb25seSBuZWVkIHRvIHNhdmUgdmFsdWVcclxuICAgIC8vIGFuZCBjb3VudCB0byByZXN0b3JlIHN0YXRlLlxyXG4gICAgY29uc3QgY3VyckJhc2VWYWx1ZSA9IGludGVydmFsTWlsbGlzICogTWF0aC5wb3coYmFja29mZkZhY3RvciwgYmFja29mZkNvdW50KTtcclxuICAgIC8vIEEgcmFuZG9tIFwiZnV6elwiIHRvIGF2b2lkIHdhdmVzIG9mIHJldHJpZXMuXHJcbiAgICAvLyBEZXZpYXRpb246IHJhbmRvbUZhY3RvciBpcyByZXF1aXJlZC5cclxuICAgIGNvbnN0IHJhbmRvbVdhaXQgPSBNYXRoLnJvdW5kKFxyXG4gICAgLy8gQSBmcmFjdGlvbiBvZiB0aGUgYmFja29mZiB2YWx1ZSB0byBhZGQvc3VidHJhY3QuXHJcbiAgICAvLyBEZXZpYXRpb246IGNoYW5nZXMgbXVsdGlwbGljYXRpb24gb3JkZXIgdG8gaW1wcm92ZSByZWFkYWJpbGl0eS5cclxuICAgIFJBTkRPTV9GQUNUT1IgKlxyXG4gICAgICAgIGN1cnJCYXNlVmFsdWUgKlxyXG4gICAgICAgIC8vIEEgcmFuZG9tIGZsb2F0IChyb3VuZGVkIHRvIGludCBieSBNYXRoLnJvdW5kIGFib3ZlKSBpbiB0aGUgcmFuZ2UgWy0xLCAxXS4gRGV0ZXJtaW5lc1xyXG4gICAgICAgIC8vIGlmIHdlIGFkZCBvciBzdWJ0cmFjdC5cclxuICAgICAgICAoTWF0aC5yYW5kb20oKSAtIDAuNSkgKlxyXG4gICAgICAgIDIpO1xyXG4gICAgLy8gTGltaXRzIGJhY2tvZmYgdG8gbWF4IHRvIGF2b2lkIGVmZmVjdGl2ZWx5IHBlcm1hbmVudCBiYWNrb2ZmLlxyXG4gICAgcmV0dXJuIE1hdGgubWluKE1BWF9WQUxVRV9NSUxMSVMsIGN1cnJCYXNlVmFsdWUgKyByYW5kb21XYWl0KTtcclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG4vKipcclxuICogUHJvdmlkZSBFbmdsaXNoIG9yZGluYWwgbGV0dGVycyBhZnRlciBhIG51bWJlclxyXG4gKi9cclxuZnVuY3Rpb24gb3JkaW5hbChpKSB7XHJcbiAgICBpZiAoIU51bWJlci5pc0Zpbml0ZShpKSkge1xyXG4gICAgICAgIHJldHVybiBgJHtpfWA7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gaSArIGluZGljYXRvcihpKTtcclxufVxyXG5mdW5jdGlvbiBpbmRpY2F0b3IoaSkge1xyXG4gICAgaSA9IE1hdGguYWJzKGkpO1xyXG4gICAgY29uc3QgY2VudCA9IGkgJSAxMDA7XHJcbiAgICBpZiAoY2VudCA+PSAxMCAmJiBjZW50IDw9IDIwKSB7XHJcbiAgICAgICAgcmV0dXJuICd0aCc7XHJcbiAgICB9XHJcbiAgICBjb25zdCBkZWMgPSBpICUgMTA7XHJcbiAgICBpZiAoZGVjID09PSAxKSB7XHJcbiAgICAgICAgcmV0dXJuICdzdCc7XHJcbiAgICB9XHJcbiAgICBpZiAoZGVjID09PSAyKSB7XHJcbiAgICAgICAgcmV0dXJuICduZCc7XHJcbiAgICB9XHJcbiAgICBpZiAoZGVjID09PSAzKSB7XHJcbiAgICAgICAgcmV0dXJuICdyZCc7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gJ3RoJztcclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMjEgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRNb2R1bGFySW5zdGFuY2Uoc2VydmljZSkge1xyXG4gICAgaWYgKHNlcnZpY2UgJiYgc2VydmljZS5fZGVsZWdhdGUpIHtcclxuICAgICAgICByZXR1cm4gc2VydmljZS5fZGVsZWdhdGU7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICByZXR1cm4gc2VydmljZTtcclxuICAgIH1cclxufVxuXG5leHBvcnQgeyBDT05TVEFOVFMsIERlZmVycmVkLCBFcnJvckZhY3RvcnksIEZpcmViYXNlRXJyb3IsIE1BWF9WQUxVRV9NSUxMSVMsIFJBTkRPTV9GQUNUT1IsIFNoYTEsIGFyZUNvb2tpZXNFbmFibGVkLCBhc3NlcnQsIGFzc2VydGlvbkVycm9yLCBhc3luYywgYmFzZTY0LCBiYXNlNjREZWNvZGUsIGJhc2U2NEVuY29kZSwgYmFzZTY0dXJsRW5jb2RlV2l0aG91dFBhZGRpbmcsIGNhbGN1bGF0ZUJhY2tvZmZNaWxsaXMsIGNvbnRhaW5zLCBjcmVhdGVNb2NrVXNlclRva2VuLCBjcmVhdGVTdWJzY3JpYmUsIGRlY29kZSwgZGVlcENvcHksIGRlZXBFcXVhbCwgZGVlcEV4dGVuZCwgZXJyb3JQcmVmaXgsIGV4dHJhY3RRdWVyeXN0cmluZywgZ2V0RGVmYXVsdEFwcENvbmZpZywgZ2V0RGVmYXVsdEVtdWxhdG9ySG9zdCwgZ2V0RGVmYXVsdEVtdWxhdG9ySG9zdG5hbWVBbmRQb3J0LCBnZXRFeHBlcmltZW50YWxTZXR0aW5nLCBnZXRHbG9iYWwsIGdldE1vZHVsYXJJbnN0YW5jZSwgZ2V0VUEsIGlzQWRtaW4sIGlzQnJvd3NlciwgaXNCcm93c2VyRXh0ZW5zaW9uLCBpc0VsZWN0cm9uLCBpc0VtcHR5LCBpc0lFLCBpc0luZGV4ZWREQkF2YWlsYWJsZSwgaXNNb2JpbGVDb3Jkb3ZhLCBpc05vZGUsIGlzTm9kZVNkaywgaXNSZWFjdE5hdGl2ZSwgaXNTYWZhcmksIGlzVVdQLCBpc1ZhbGlkRm9ybWF0LCBpc1ZhbGlkVGltZXN0YW1wLCBpc3N1ZWRBdFRpbWUsIGpzb25FdmFsLCBtYXAsIG9yZGluYWwsIHByb21pc2VXaXRoVGltZW91dCwgcXVlcnlzdHJpbmcsIHF1ZXJ5c3RyaW5nRGVjb2RlLCBzYWZlR2V0LCBzdHJpbmdMZW5ndGgsIHN0cmluZ1RvQnl0ZUFycmF5LCBzdHJpbmdpZnksIHV1aWR2NCwgdmFsaWRhdGVBcmdDb3VudCwgdmFsaWRhdGVDYWxsYmFjaywgdmFsaWRhdGVDb250ZXh0T2JqZWN0LCB2YWxpZGF0ZUluZGV4ZWREQk9wZW5hYmxlLCB2YWxpZGF0ZU5hbWVzcGFjZSB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguZXNtMjAxNy5qcy5tYXBcbiIsImltcG9ydCB7IERlZmVycmVkIH0gZnJvbSAnQGZpcmViYXNlL3V0aWwnO1xuXG4vKipcclxuICogQ29tcG9uZW50IGZvciBzZXJ2aWNlIG5hbWUgVCwgZS5nLiBgYXV0aGAsIGBhdXRoLWludGVybmFsYFxyXG4gKi9cclxuY2xhc3MgQ29tcG9uZW50IHtcclxuICAgIC8qKlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBuYW1lIFRoZSBwdWJsaWMgc2VydmljZSBuYW1lLCBlLmcuIGFwcCwgYXV0aCwgZmlyZXN0b3JlLCBkYXRhYmFzZVxyXG4gICAgICogQHBhcmFtIGluc3RhbmNlRmFjdG9yeSBTZXJ2aWNlIGZhY3RvcnkgcmVzcG9uc2libGUgZm9yIGNyZWF0aW5nIHRoZSBwdWJsaWMgaW50ZXJmYWNlXHJcbiAgICAgKiBAcGFyYW0gdHlwZSB3aGV0aGVyIHRoZSBzZXJ2aWNlIHByb3ZpZGVkIGJ5IHRoZSBjb21wb25lbnQgaXMgcHVibGljIG9yIHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IobmFtZSwgaW5zdGFuY2VGYWN0b3J5LCB0eXBlKSB7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcclxuICAgICAgICB0aGlzLmluc3RhbmNlRmFjdG9yeSA9IGluc3RhbmNlRmFjdG9yeTtcclxuICAgICAgICB0aGlzLnR5cGUgPSB0eXBlO1xyXG4gICAgICAgIHRoaXMubXVsdGlwbGVJbnN0YW5jZXMgPSBmYWxzZTtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBQcm9wZXJ0aWVzIHRvIGJlIGFkZGVkIHRvIHRoZSBzZXJ2aWNlIG5hbWVzcGFjZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuc2VydmljZVByb3BzID0ge307XHJcbiAgICAgICAgdGhpcy5pbnN0YW50aWF0aW9uTW9kZSA9IFwiTEFaWVwiIC8qIExBWlkgKi87XHJcbiAgICAgICAgdGhpcy5vbkluc3RhbmNlQ3JlYXRlZCA9IG51bGw7XHJcbiAgICB9XHJcbiAgICBzZXRJbnN0YW50aWF0aW9uTW9kZShtb2RlKSB7XHJcbiAgICAgICAgdGhpcy5pbnN0YW50aWF0aW9uTW9kZSA9IG1vZGU7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBzZXRNdWx0aXBsZUluc3RhbmNlcyhtdWx0aXBsZUluc3RhbmNlcykge1xyXG4gICAgICAgIHRoaXMubXVsdGlwbGVJbnN0YW5jZXMgPSBtdWx0aXBsZUluc3RhbmNlcztcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHNldFNlcnZpY2VQcm9wcyhwcm9wcykge1xyXG4gICAgICAgIHRoaXMuc2VydmljZVByb3BzID0gcHJvcHM7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBzZXRJbnN0YW5jZUNyZWF0ZWRDYWxsYmFjayhjYWxsYmFjaykge1xyXG4gICAgICAgIHRoaXMub25JbnN0YW5jZUNyZWF0ZWQgPSBjYWxsYmFjaztcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5jb25zdCBERUZBVUxUX0VOVFJZX05BTUUgPSAnW0RFRkFVTFRdJztcblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqXHJcbiAqIFByb3ZpZGVyIGZvciBpbnN0YW5jZSBmb3Igc2VydmljZSBuYW1lIFQsIGUuZy4gJ2F1dGgnLCAnYXV0aC1pbnRlcm5hbCdcclxuICogTmFtZVNlcnZpY2VNYXBwaW5nW1RdIGlzIGFuIGFsaWFzIGZvciB0aGUgdHlwZSBvZiB0aGUgaW5zdGFuY2VcclxuICovXHJcbmNsYXNzIFByb3ZpZGVyIHtcclxuICAgIGNvbnN0cnVjdG9yKG5hbWUsIGNvbnRhaW5lcikge1xyXG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XHJcbiAgICAgICAgdGhpcy5jb21wb25lbnQgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuaW5zdGFuY2VzID0gbmV3IE1hcCgpO1xyXG4gICAgICAgIHRoaXMuaW5zdGFuY2VzRGVmZXJyZWQgPSBuZXcgTWFwKCk7XHJcbiAgICAgICAgdGhpcy5pbnN0YW5jZXNPcHRpb25zID0gbmV3IE1hcCgpO1xyXG4gICAgICAgIHRoaXMub25Jbml0Q2FsbGJhY2tzID0gbmV3IE1hcCgpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0gaWRlbnRpZmllciBBIHByb3ZpZGVyIGNhbiBwcm92aWRlIG11bGl0cGxlIGluc3RhbmNlcyBvZiBhIHNlcnZpY2VcclxuICAgICAqIGlmIHRoaXMuY29tcG9uZW50Lm11bHRpcGxlSW5zdGFuY2VzIGlzIHRydWUuXHJcbiAgICAgKi9cclxuICAgIGdldChpZGVudGlmaWVyKSB7XHJcbiAgICAgICAgLy8gaWYgbXVsdGlwbGVJbnN0YW5jZXMgaXMgbm90IHN1cHBvcnRlZCwgdXNlIHRoZSBkZWZhdWx0IG5hbWVcclxuICAgICAgICBjb25zdCBub3JtYWxpemVkSWRlbnRpZmllciA9IHRoaXMubm9ybWFsaXplSW5zdGFuY2VJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xyXG4gICAgICAgIGlmICghdGhpcy5pbnN0YW5jZXNEZWZlcnJlZC5oYXMobm9ybWFsaXplZElkZW50aWZpZXIpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRlZmVycmVkID0gbmV3IERlZmVycmVkKCk7XHJcbiAgICAgICAgICAgIHRoaXMuaW5zdGFuY2VzRGVmZXJyZWQuc2V0KG5vcm1hbGl6ZWRJZGVudGlmaWVyLCBkZWZlcnJlZCk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzSW5pdGlhbGl6ZWQobm9ybWFsaXplZElkZW50aWZpZXIpIHx8XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNob3VsZEF1dG9Jbml0aWFsaXplKCkpIHtcclxuICAgICAgICAgICAgICAgIC8vIGluaXRpYWxpemUgdGhlIHNlcnZpY2UgaWYgaXQgY2FuIGJlIGF1dG8taW5pdGlhbGl6ZWRcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzLmdldE9ySW5pdGlhbGl6ZVNlcnZpY2Uoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZUlkZW50aWZpZXI6IG5vcm1hbGl6ZWRJZGVudGlmaWVyXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGluc3RhbmNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoaW5zdGFuY2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gd2hlbiB0aGUgaW5zdGFuY2UgZmFjdG9yeSB0aHJvd3MgYW4gZXhjZXB0aW9uIGR1cmluZyBnZXQoKSwgaXQgc2hvdWxkIG5vdCBjYXVzZVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGEgZmF0YWwgZXJyb3IuIFdlIGp1c3QgcmV0dXJuIHRoZSB1bnJlc29sdmVkIHByb21pc2UgaW4gdGhpcyBjYXNlLlxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLmluc3RhbmNlc0RlZmVycmVkLmdldChub3JtYWxpemVkSWRlbnRpZmllcikucHJvbWlzZTtcclxuICAgIH1cclxuICAgIGdldEltbWVkaWF0ZShvcHRpb25zKSB7XHJcbiAgICAgICAgdmFyIF9hO1xyXG4gICAgICAgIC8vIGlmIG11bHRpcGxlSW5zdGFuY2VzIGlzIG5vdCBzdXBwb3J0ZWQsIHVzZSB0aGUgZGVmYXVsdCBuYW1lXHJcbiAgICAgICAgY29uc3Qgbm9ybWFsaXplZElkZW50aWZpZXIgPSB0aGlzLm5vcm1hbGl6ZUluc3RhbmNlSWRlbnRpZmllcihvcHRpb25zID09PSBudWxsIHx8IG9wdGlvbnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9wdGlvbnMuaWRlbnRpZmllcik7XHJcbiAgICAgICAgY29uc3Qgb3B0aW9uYWwgPSAoX2EgPSBvcHRpb25zID09PSBudWxsIHx8IG9wdGlvbnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9wdGlvbnMub3B0aW9uYWwpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IGZhbHNlO1xyXG4gICAgICAgIGlmICh0aGlzLmlzSW5pdGlhbGl6ZWQobm9ybWFsaXplZElkZW50aWZpZXIpIHx8XHJcbiAgICAgICAgICAgIHRoaXMuc2hvdWxkQXV0b0luaXRpYWxpemUoKSkge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0T3JJbml0aWFsaXplU2VydmljZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5zdGFuY2VJZGVudGlmaWVyOiBub3JtYWxpemVkSWRlbnRpZmllclxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChvcHRpb25hbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgLy8gSW4gY2FzZSBhIGNvbXBvbmVudCBpcyBub3QgaW5pdGlhbGl6ZWQgYW5kIHNob3VsZC9jYW4gbm90IGJlIGF1dG8taW5pdGlhbGl6ZWQgYXQgdGhlIG1vbWVudCwgcmV0dXJuIG51bGwgaWYgdGhlIG9wdGlvbmFsIGZsYWcgaXMgc2V0LCBvciB0aHJvd1xyXG4gICAgICAgICAgICBpZiAob3B0aW9uYWwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoYFNlcnZpY2UgJHt0aGlzLm5hbWV9IGlzIG5vdCBhdmFpbGFibGVgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGdldENvbXBvbmVudCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb21wb25lbnQ7XHJcbiAgICB9XHJcbiAgICBzZXRDb21wb25lbnQoY29tcG9uZW50KSB7XHJcbiAgICAgICAgaWYgKGNvbXBvbmVudC5uYW1lICE9PSB0aGlzLm5hbWUpIHtcclxuICAgICAgICAgICAgdGhyb3cgRXJyb3IoYE1pc21hdGNoaW5nIENvbXBvbmVudCAke2NvbXBvbmVudC5uYW1lfSBmb3IgUHJvdmlkZXIgJHt0aGlzLm5hbWV9LmApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5jb21wb25lbnQpIHtcclxuICAgICAgICAgICAgdGhyb3cgRXJyb3IoYENvbXBvbmVudCBmb3IgJHt0aGlzLm5hbWV9IGhhcyBhbHJlYWR5IGJlZW4gcHJvdmlkZWRgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jb21wb25lbnQgPSBjb21wb25lbnQ7XHJcbiAgICAgICAgLy8gcmV0dXJuIGVhcmx5IHdpdGhvdXQgYXR0ZW1wdGluZyB0byBpbml0aWFsaXplIHRoZSBjb21wb25lbnQgaWYgdGhlIGNvbXBvbmVudCByZXF1aXJlcyBleHBsaWNpdCBpbml0aWFsaXphdGlvbiAoY2FsbGluZyBgUHJvdmlkZXIuaW5pdGlhbGl6ZSgpYClcclxuICAgICAgICBpZiAoIXRoaXMuc2hvdWxkQXV0b0luaXRpYWxpemUoKSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGlmIHRoZSBzZXJ2aWNlIGlzIGVhZ2VyLCBpbml0aWFsaXplIHRoZSBkZWZhdWx0IGluc3RhbmNlXHJcbiAgICAgICAgaWYgKGlzQ29tcG9uZW50RWFnZXIoY29tcG9uZW50KSkge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5nZXRPckluaXRpYWxpemVTZXJ2aWNlKHsgaW5zdGFuY2VJZGVudGlmaWVyOiBERUZBVUxUX0VOVFJZX05BTUUgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIC8vIHdoZW4gdGhlIGluc3RhbmNlIGZhY3RvcnkgZm9yIGFuIGVhZ2VyIENvbXBvbmVudCB0aHJvd3MgYW4gZXhjZXB0aW9uIGR1cmluZyB0aGUgZWFnZXJcclxuICAgICAgICAgICAgICAgIC8vIGluaXRpYWxpemF0aW9uLCBpdCBzaG91bGQgbm90IGNhdXNlIGEgZmF0YWwgZXJyb3IuXHJcbiAgICAgICAgICAgICAgICAvLyBUT0RPOiBJbnZlc3RpZ2F0ZSBpZiB3ZSBuZWVkIHRvIG1ha2UgaXQgY29uZmlndXJhYmxlLCBiZWNhdXNlIHNvbWUgY29tcG9uZW50IG1heSB3YW50IHRvIGNhdXNlXHJcbiAgICAgICAgICAgICAgICAvLyBhIGZhdGFsIGVycm9yIGluIHRoaXMgY2FzZT9cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBDcmVhdGUgc2VydmljZSBpbnN0YW5jZXMgZm9yIHRoZSBwZW5kaW5nIHByb21pc2VzIGFuZCByZXNvbHZlIHRoZW1cclxuICAgICAgICAvLyBOT1RFOiBpZiB0aGlzLm11bHRpcGxlSW5zdGFuY2VzIGlzIGZhbHNlLCBvbmx5IHRoZSBkZWZhdWx0IGluc3RhbmNlIHdpbGwgYmUgY3JlYXRlZFxyXG4gICAgICAgIC8vIGFuZCBhbGwgcHJvbWlzZXMgd2l0aCByZXNvbHZlIHdpdGggaXQgcmVnYXJkbGVzcyBvZiB0aGUgaWRlbnRpZmllci5cclxuICAgICAgICBmb3IgKGNvbnN0IFtpbnN0YW5jZUlkZW50aWZpZXIsIGluc3RhbmNlRGVmZXJyZWRdIG9mIHRoaXMuaW5zdGFuY2VzRGVmZXJyZWQuZW50cmllcygpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5vcm1hbGl6ZWRJZGVudGlmaWVyID0gdGhpcy5ub3JtYWxpemVJbnN0YW5jZUlkZW50aWZpZXIoaW5zdGFuY2VJZGVudGlmaWVyKTtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIC8vIGBnZXRPckluaXRpYWxpemVTZXJ2aWNlKClgIHNob3VsZCBhbHdheXMgcmV0dXJuIGEgdmFsaWQgaW5zdGFuY2Ugc2luY2UgYSBjb21wb25lbnQgaXMgZ3VhcmFudGVlZC4gdXNlICEgdG8gbWFrZSB0eXBlc2NyaXB0IGhhcHB5LlxyXG4gICAgICAgICAgICAgICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzLmdldE9ySW5pdGlhbGl6ZVNlcnZpY2Uoe1xyXG4gICAgICAgICAgICAgICAgICAgIGluc3RhbmNlSWRlbnRpZmllcjogbm9ybWFsaXplZElkZW50aWZpZXJcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgaW5zdGFuY2VEZWZlcnJlZC5yZXNvbHZlKGluc3RhbmNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgLy8gd2hlbiB0aGUgaW5zdGFuY2UgZmFjdG9yeSB0aHJvd3MgYW4gZXhjZXB0aW9uLCBpdCBzaG91bGQgbm90IGNhdXNlXHJcbiAgICAgICAgICAgICAgICAvLyBhIGZhdGFsIGVycm9yLiBXZSBqdXN0IGxlYXZlIHRoZSBwcm9taXNlIHVucmVzb2x2ZWQuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBjbGVhckluc3RhbmNlKGlkZW50aWZpZXIgPSBERUZBVUxUX0VOVFJZX05BTUUpIHtcclxuICAgICAgICB0aGlzLmluc3RhbmNlc0RlZmVycmVkLmRlbGV0ZShpZGVudGlmaWVyKTtcclxuICAgICAgICB0aGlzLmluc3RhbmNlc09wdGlvbnMuZGVsZXRlKGlkZW50aWZpZXIpO1xyXG4gICAgICAgIHRoaXMuaW5zdGFuY2VzLmRlbGV0ZShpZGVudGlmaWVyKTtcclxuICAgIH1cclxuICAgIC8vIGFwcC5kZWxldGUoKSB3aWxsIGNhbGwgdGhpcyBtZXRob2Qgb24gZXZlcnkgcHJvdmlkZXIgdG8gZGVsZXRlIHRoZSBzZXJ2aWNlc1xyXG4gICAgLy8gVE9ETzogc2hvdWxkIHdlIG1hcmsgdGhlIHByb3ZpZGVyIGFzIGRlbGV0ZWQ/XHJcbiAgICBhc3luYyBkZWxldGUoKSB7XHJcbiAgICAgICAgY29uc3Qgc2VydmljZXMgPSBBcnJheS5mcm9tKHRoaXMuaW5zdGFuY2VzLnZhbHVlcygpKTtcclxuICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChbXHJcbiAgICAgICAgICAgIC4uLnNlcnZpY2VzXHJcbiAgICAgICAgICAgICAgICAuZmlsdGVyKHNlcnZpY2UgPT4gJ0lOVEVSTkFMJyBpbiBzZXJ2aWNlKSAvLyBsZWdhY3kgc2VydmljZXNcclxuICAgICAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XHJcbiAgICAgICAgICAgICAgICAubWFwKHNlcnZpY2UgPT4gc2VydmljZS5JTlRFUk5BTC5kZWxldGUoKSksXHJcbiAgICAgICAgICAgIC4uLnNlcnZpY2VzXHJcbiAgICAgICAgICAgICAgICAuZmlsdGVyKHNlcnZpY2UgPT4gJ19kZWxldGUnIGluIHNlcnZpY2UpIC8vIG1vZHVsYXJpemVkIHNlcnZpY2VzXHJcbiAgICAgICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxyXG4gICAgICAgICAgICAgICAgLm1hcChzZXJ2aWNlID0+IHNlcnZpY2UuX2RlbGV0ZSgpKVxyXG4gICAgICAgIF0pO1xyXG4gICAgfVxyXG4gICAgaXNDb21wb25lbnRTZXQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29tcG9uZW50ICE9IG51bGw7XHJcbiAgICB9XHJcbiAgICBpc0luaXRpYWxpemVkKGlkZW50aWZpZXIgPSBERUZBVUxUX0VOVFJZX05BTUUpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5pbnN0YW5jZXMuaGFzKGlkZW50aWZpZXIpO1xyXG4gICAgfVxyXG4gICAgZ2V0T3B0aW9ucyhpZGVudGlmaWVyID0gREVGQVVMVF9FTlRSWV9OQU1FKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5zdGFuY2VzT3B0aW9ucy5nZXQoaWRlbnRpZmllcikgfHwge307XHJcbiAgICB9XHJcbiAgICBpbml0aWFsaXplKG9wdHMgPSB7fSkge1xyXG4gICAgICAgIGNvbnN0IHsgb3B0aW9ucyA9IHt9IH0gPSBvcHRzO1xyXG4gICAgICAgIGNvbnN0IG5vcm1hbGl6ZWRJZGVudGlmaWVyID0gdGhpcy5ub3JtYWxpemVJbnN0YW5jZUlkZW50aWZpZXIob3B0cy5pbnN0YW5jZUlkZW50aWZpZXIpO1xyXG4gICAgICAgIGlmICh0aGlzLmlzSW5pdGlhbGl6ZWQobm9ybWFsaXplZElkZW50aWZpZXIpKSB7XHJcbiAgICAgICAgICAgIHRocm93IEVycm9yKGAke3RoaXMubmFtZX0oJHtub3JtYWxpemVkSWRlbnRpZmllcn0pIGhhcyBhbHJlYWR5IGJlZW4gaW5pdGlhbGl6ZWRgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCF0aGlzLmlzQ29tcG9uZW50U2V0KCkpIHtcclxuICAgICAgICAgICAgdGhyb3cgRXJyb3IoYENvbXBvbmVudCAke3RoaXMubmFtZX0gaGFzIG5vdCBiZWVuIHJlZ2lzdGVyZWQgeWV0YCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcy5nZXRPckluaXRpYWxpemVTZXJ2aWNlKHtcclxuICAgICAgICAgICAgaW5zdGFuY2VJZGVudGlmaWVyOiBub3JtYWxpemVkSWRlbnRpZmllcixcclxuICAgICAgICAgICAgb3B0aW9uc1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIC8vIHJlc29sdmUgYW55IHBlbmRpbmcgcHJvbWlzZSB3YWl0aW5nIGZvciB0aGUgc2VydmljZSBpbnN0YW5jZVxyXG4gICAgICAgIGZvciAoY29uc3QgW2luc3RhbmNlSWRlbnRpZmllciwgaW5zdGFuY2VEZWZlcnJlZF0gb2YgdGhpcy5pbnN0YW5jZXNEZWZlcnJlZC5lbnRyaWVzKCkpIHtcclxuICAgICAgICAgICAgY29uc3Qgbm9ybWFsaXplZERlZmVycmVkSWRlbnRpZmllciA9IHRoaXMubm9ybWFsaXplSW5zdGFuY2VJZGVudGlmaWVyKGluc3RhbmNlSWRlbnRpZmllcik7XHJcbiAgICAgICAgICAgIGlmIChub3JtYWxpemVkSWRlbnRpZmllciA9PT0gbm9ybWFsaXplZERlZmVycmVkSWRlbnRpZmllcikge1xyXG4gICAgICAgICAgICAgICAgaW5zdGFuY2VEZWZlcnJlZC5yZXNvbHZlKGluc3RhbmNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gaW5zdGFuY2U7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gY2FsbGJhY2sgLSBhIGZ1bmN0aW9uIHRoYXQgd2lsbCBiZSBpbnZva2VkICBhZnRlciB0aGUgcHJvdmlkZXIgaGFzIGJlZW4gaW5pdGlhbGl6ZWQgYnkgY2FsbGluZyBwcm92aWRlci5pbml0aWFsaXplKCkuXHJcbiAgICAgKiBUaGUgZnVuY3Rpb24gaXMgaW52b2tlZCBTWU5DSFJPTk9VU0xZLCBzbyBpdCBzaG91bGQgbm90IGV4ZWN1dGUgYW55IGxvbmdydW5uaW5nIHRhc2tzIGluIG9yZGVyIHRvIG5vdCBibG9jayB0aGUgcHJvZ3JhbS5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gaWRlbnRpZmllciBBbiBvcHRpb25hbCBpbnN0YW5jZSBpZGVudGlmaWVyXHJcbiAgICAgKiBAcmV0dXJucyBhIGZ1bmN0aW9uIHRvIHVucmVnaXN0ZXIgdGhlIGNhbGxiYWNrXHJcbiAgICAgKi9cclxuICAgIG9uSW5pdChjYWxsYmFjaywgaWRlbnRpZmllcikge1xyXG4gICAgICAgIHZhciBfYTtcclxuICAgICAgICBjb25zdCBub3JtYWxpemVkSWRlbnRpZmllciA9IHRoaXMubm9ybWFsaXplSW5zdGFuY2VJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xyXG4gICAgICAgIGNvbnN0IGV4aXN0aW5nQ2FsbGJhY2tzID0gKF9hID0gdGhpcy5vbkluaXRDYWxsYmFja3MuZ2V0KG5vcm1hbGl6ZWRJZGVudGlmaWVyKSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogbmV3IFNldCgpO1xyXG4gICAgICAgIGV4aXN0aW5nQ2FsbGJhY2tzLmFkZChjYWxsYmFjayk7XHJcbiAgICAgICAgdGhpcy5vbkluaXRDYWxsYmFja3Muc2V0KG5vcm1hbGl6ZWRJZGVudGlmaWVyLCBleGlzdGluZ0NhbGxiYWNrcyk7XHJcbiAgICAgICAgY29uc3QgZXhpc3RpbmdJbnN0YW5jZSA9IHRoaXMuaW5zdGFuY2VzLmdldChub3JtYWxpemVkSWRlbnRpZmllcik7XHJcbiAgICAgICAgaWYgKGV4aXN0aW5nSW5zdGFuY2UpIHtcclxuICAgICAgICAgICAgY2FsbGJhY2soZXhpc3RpbmdJbnN0YW5jZSwgbm9ybWFsaXplZElkZW50aWZpZXIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gKCkgPT4ge1xyXG4gICAgICAgICAgICBleGlzdGluZ0NhbGxiYWNrcy5kZWxldGUoY2FsbGJhY2spO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIEludm9rZSBvbkluaXQgY2FsbGJhY2tzIHN5bmNocm9ub3VzbHlcclxuICAgICAqIEBwYXJhbSBpbnN0YW5jZSB0aGUgc2VydmljZSBpbnN0YW5jZWBcclxuICAgICAqL1xyXG4gICAgaW52b2tlT25Jbml0Q2FsbGJhY2tzKGluc3RhbmNlLCBpZGVudGlmaWVyKSB7XHJcbiAgICAgICAgY29uc3QgY2FsbGJhY2tzID0gdGhpcy5vbkluaXRDYWxsYmFja3MuZ2V0KGlkZW50aWZpZXIpO1xyXG4gICAgICAgIGlmICghY2FsbGJhY2tzKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yIChjb25zdCBjYWxsYmFjayBvZiBjYWxsYmFja3MpIHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGluc3RhbmNlLCBpZGVudGlmaWVyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXRjaCAoX2EpIHtcclxuICAgICAgICAgICAgICAgIC8vIGlnbm9yZSBlcnJvcnMgaW4gdGhlIG9uSW5pdCBjYWxsYmFja1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZ2V0T3JJbml0aWFsaXplU2VydmljZSh7IGluc3RhbmNlSWRlbnRpZmllciwgb3B0aW9ucyA9IHt9IH0pIHtcclxuICAgICAgICBsZXQgaW5zdGFuY2UgPSB0aGlzLmluc3RhbmNlcy5nZXQoaW5zdGFuY2VJZGVudGlmaWVyKTtcclxuICAgICAgICBpZiAoIWluc3RhbmNlICYmIHRoaXMuY29tcG9uZW50KSB7XHJcbiAgICAgICAgICAgIGluc3RhbmNlID0gdGhpcy5jb21wb25lbnQuaW5zdGFuY2VGYWN0b3J5KHRoaXMuY29udGFpbmVyLCB7XHJcbiAgICAgICAgICAgICAgICBpbnN0YW5jZUlkZW50aWZpZXI6IG5vcm1hbGl6ZUlkZW50aWZpZXJGb3JGYWN0b3J5KGluc3RhbmNlSWRlbnRpZmllciksXHJcbiAgICAgICAgICAgICAgICBvcHRpb25zXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLmluc3RhbmNlcy5zZXQoaW5zdGFuY2VJZGVudGlmaWVyLCBpbnN0YW5jZSk7XHJcbiAgICAgICAgICAgIHRoaXMuaW5zdGFuY2VzT3B0aW9ucy5zZXQoaW5zdGFuY2VJZGVudGlmaWVyLCBvcHRpb25zKTtcclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIEludm9rZSBvbkluaXQgbGlzdGVuZXJzLlxyXG4gICAgICAgICAgICAgKiBOb3RlIHRoaXMuY29tcG9uZW50Lm9uSW5zdGFuY2VDcmVhdGVkIGlzIGRpZmZlcmVudCwgd2hpY2ggaXMgdXNlZCBieSB0aGUgY29tcG9uZW50IGNyZWF0b3IsXHJcbiAgICAgICAgICAgICAqIHdoaWxlIG9uSW5pdCBsaXN0ZW5lcnMgYXJlIHJlZ2lzdGVyZWQgYnkgY29uc3VtZXJzIG9mIHRoZSBwcm92aWRlci5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHRoaXMuaW52b2tlT25Jbml0Q2FsbGJhY2tzKGluc3RhbmNlLCBpbnN0YW5jZUlkZW50aWZpZXIpO1xyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogT3JkZXIgaXMgaW1wb3J0YW50XHJcbiAgICAgICAgICAgICAqIG9uSW5zdGFuY2VDcmVhdGVkKCkgc2hvdWxkIGJlIGNhbGxlZCBhZnRlciB0aGlzLmluc3RhbmNlcy5zZXQoaW5zdGFuY2VJZGVudGlmaWVyLCBpbnN0YW5jZSk7IHdoaWNoXHJcbiAgICAgICAgICAgICAqIG1ha2VzIGBpc0luaXRpYWxpemVkKClgIHJldHVybiB0cnVlLlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgaWYgKHRoaXMuY29tcG9uZW50Lm9uSW5zdGFuY2VDcmVhdGVkKSB7XHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29tcG9uZW50Lm9uSW5zdGFuY2VDcmVhdGVkKHRoaXMuY29udGFpbmVyLCBpbnN0YW5jZUlkZW50aWZpZXIsIGluc3RhbmNlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNhdGNoIChfYSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGlnbm9yZSBlcnJvcnMgaW4gdGhlIG9uSW5zdGFuY2VDcmVhdGVkQ2FsbGJhY2tcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gaW5zdGFuY2UgfHwgbnVsbDtcclxuICAgIH1cclxuICAgIG5vcm1hbGl6ZUluc3RhbmNlSWRlbnRpZmllcihpZGVudGlmaWVyID0gREVGQVVMVF9FTlRSWV9OQU1FKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY29tcG9uZW50KSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbXBvbmVudC5tdWx0aXBsZUluc3RhbmNlcyA/IGlkZW50aWZpZXIgOiBERUZBVUxUX0VOVFJZX05BTUU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gaWRlbnRpZmllcjsgLy8gYXNzdW1lIG11bHRpcGxlIGluc3RhbmNlcyBhcmUgc3VwcG9ydGVkIGJlZm9yZSB0aGUgY29tcG9uZW50IGlzIHByb3ZpZGVkLlxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHNob3VsZEF1dG9Jbml0aWFsaXplKCkge1xyXG4gICAgICAgIHJldHVybiAoISF0aGlzLmNvbXBvbmVudCAmJlxyXG4gICAgICAgICAgICB0aGlzLmNvbXBvbmVudC5pbnN0YW50aWF0aW9uTW9kZSAhPT0gXCJFWFBMSUNJVFwiIC8qIEVYUExJQ0lUICovKTtcclxuICAgIH1cclxufVxyXG4vLyB1bmRlZmluZWQgc2hvdWxkIGJlIHBhc3NlZCB0byB0aGUgc2VydmljZSBmYWN0b3J5IGZvciB0aGUgZGVmYXVsdCBpbnN0YW5jZVxyXG5mdW5jdGlvbiBub3JtYWxpemVJZGVudGlmaWVyRm9yRmFjdG9yeShpZGVudGlmaWVyKSB7XHJcbiAgICByZXR1cm4gaWRlbnRpZmllciA9PT0gREVGQVVMVF9FTlRSWV9OQU1FID8gdW5kZWZpbmVkIDogaWRlbnRpZmllcjtcclxufVxyXG5mdW5jdGlvbiBpc0NvbXBvbmVudEVhZ2VyKGNvbXBvbmVudCkge1xyXG4gICAgcmV0dXJuIGNvbXBvbmVudC5pbnN0YW50aWF0aW9uTW9kZSA9PT0gXCJFQUdFUlwiIC8qIEVBR0VSICovO1xyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbi8qKlxyXG4gKiBDb21wb25lbnRDb250YWluZXIgdGhhdCBwcm92aWRlcyBQcm92aWRlcnMgZm9yIHNlcnZpY2UgbmFtZSBULCBlLmcuIGBhdXRoYCwgYGF1dGgtaW50ZXJuYWxgXHJcbiAqL1xyXG5jbGFzcyBDb21wb25lbnRDb250YWluZXIge1xyXG4gICAgY29uc3RydWN0b3IobmFtZSkge1xyXG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcbiAgICAgICAgdGhpcy5wcm92aWRlcnMgPSBuZXcgTWFwKCk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gY29tcG9uZW50IENvbXBvbmVudCBiZWluZyBhZGRlZFxyXG4gICAgICogQHBhcmFtIG92ZXJ3cml0ZSBXaGVuIGEgY29tcG9uZW50IHdpdGggdGhlIHNhbWUgbmFtZSBoYXMgYWxyZWFkeSBiZWVuIHJlZ2lzdGVyZWQsXHJcbiAgICAgKiBpZiBvdmVyd3JpdGUgaXMgdHJ1ZTogb3ZlcndyaXRlIHRoZSBleGlzdGluZyBjb21wb25lbnQgd2l0aCB0aGUgbmV3IGNvbXBvbmVudCBhbmQgY3JlYXRlIGEgbmV3XHJcbiAgICAgKiBwcm92aWRlciB3aXRoIHRoZSBuZXcgY29tcG9uZW50LiBJdCBjYW4gYmUgdXNlZnVsIGluIHRlc3RzIHdoZXJlIHlvdSB3YW50IHRvIHVzZSBkaWZmZXJlbnQgbW9ja3NcclxuICAgICAqIGZvciBkaWZmZXJlbnQgdGVzdHMuXHJcbiAgICAgKiBpZiBvdmVyd3JpdGUgaXMgZmFsc2U6IHRocm93IGFuIGV4Y2VwdGlvblxyXG4gICAgICovXHJcbiAgICBhZGRDb21wb25lbnQoY29tcG9uZW50KSB7XHJcbiAgICAgICAgY29uc3QgcHJvdmlkZXIgPSB0aGlzLmdldFByb3ZpZGVyKGNvbXBvbmVudC5uYW1lKTtcclxuICAgICAgICBpZiAocHJvdmlkZXIuaXNDb21wb25lbnRTZXQoKSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENvbXBvbmVudCAke2NvbXBvbmVudC5uYW1lfSBoYXMgYWxyZWFkeSBiZWVuIHJlZ2lzdGVyZWQgd2l0aCAke3RoaXMubmFtZX1gKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdmlkZXIuc2V0Q29tcG9uZW50KGNvbXBvbmVudCk7XHJcbiAgICB9XHJcbiAgICBhZGRPck92ZXJ3cml0ZUNvbXBvbmVudChjb21wb25lbnQpIHtcclxuICAgICAgICBjb25zdCBwcm92aWRlciA9IHRoaXMuZ2V0UHJvdmlkZXIoY29tcG9uZW50Lm5hbWUpO1xyXG4gICAgICAgIGlmIChwcm92aWRlci5pc0NvbXBvbmVudFNldCgpKSB7XHJcbiAgICAgICAgICAgIC8vIGRlbGV0ZSB0aGUgZXhpc3RpbmcgcHJvdmlkZXIgZnJvbSB0aGUgY29udGFpbmVyLCBzbyB3ZSBjYW4gcmVnaXN0ZXIgdGhlIG5ldyBjb21wb25lbnRcclxuICAgICAgICAgICAgdGhpcy5wcm92aWRlcnMuZGVsZXRlKGNvbXBvbmVudC5uYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5hZGRDb21wb25lbnQoY29tcG9uZW50KTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogZ2V0UHJvdmlkZXIgcHJvdmlkZXMgYSB0eXBlIHNhZmUgaW50ZXJmYWNlIHdoZXJlIGl0IGNhbiBvbmx5IGJlIGNhbGxlZCB3aXRoIGEgZmllbGQgbmFtZVxyXG4gICAgICogcHJlc2VudCBpbiBOYW1lU2VydmljZU1hcHBpbmcgaW50ZXJmYWNlLlxyXG4gICAgICpcclxuICAgICAqIEZpcmViYXNlIFNES3MgcHJvdmlkaW5nIHNlcnZpY2VzIHNob3VsZCBleHRlbmQgTmFtZVNlcnZpY2VNYXBwaW5nIGludGVyZmFjZSB0byByZWdpc3RlclxyXG4gICAgICogdGhlbXNlbHZlcy5cclxuICAgICAqL1xyXG4gICAgZ2V0UHJvdmlkZXIobmFtZSkge1xyXG4gICAgICAgIGlmICh0aGlzLnByb3ZpZGVycy5oYXMobmFtZSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvdmlkZXJzLmdldChuYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gY3JlYXRlIGEgUHJvdmlkZXIgZm9yIGEgc2VydmljZSB0aGF0IGhhc24ndCByZWdpc3RlcmVkIHdpdGggRmlyZWJhc2VcclxuICAgICAgICBjb25zdCBwcm92aWRlciA9IG5ldyBQcm92aWRlcihuYW1lLCB0aGlzKTtcclxuICAgICAgICB0aGlzLnByb3ZpZGVycy5zZXQobmFtZSwgcHJvdmlkZXIpO1xyXG4gICAgICAgIHJldHVybiBwcm92aWRlcjtcclxuICAgIH1cclxuICAgIGdldFByb3ZpZGVycygpIHtcclxuICAgICAgICByZXR1cm4gQXJyYXkuZnJvbSh0aGlzLnByb3ZpZGVycy52YWx1ZXMoKSk7XHJcbiAgICB9XHJcbn1cblxuZXhwb3J0IHsgQ29tcG9uZW50LCBDb21wb25lbnRDb250YWluZXIsIFByb3ZpZGVyIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5lc20yMDE3LmpzLm1hcFxuIiwiLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqXHJcbiAqIEEgY29udGFpbmVyIGZvciBhbGwgb2YgdGhlIExvZ2dlciBpbnN0YW5jZXNcclxuICovXHJcbmNvbnN0IGluc3RhbmNlcyA9IFtdO1xyXG4vKipcclxuICogVGhlIEpTIFNESyBzdXBwb3J0cyA1IGxvZyBsZXZlbHMgYW5kIGFsc28gYWxsb3dzIGEgdXNlciB0aGUgYWJpbGl0eSB0b1xyXG4gKiBzaWxlbmNlIHRoZSBsb2dzIGFsdG9nZXRoZXIuXHJcbiAqXHJcbiAqIFRoZSBvcmRlciBpcyBhIGZvbGxvd3M6XHJcbiAqIERFQlVHIDwgVkVSQk9TRSA8IElORk8gPCBXQVJOIDwgRVJST1JcclxuICpcclxuICogQWxsIG9mIHRoZSBsb2cgdHlwZXMgYWJvdmUgdGhlIGN1cnJlbnQgbG9nIGxldmVsIHdpbGwgYmUgY2FwdHVyZWQgKGkuZS4gaWZcclxuICogeW91IHNldCB0aGUgbG9nIGxldmVsIHRvIGBJTkZPYCwgZXJyb3JzIHdpbGwgc3RpbGwgYmUgbG9nZ2VkLCBidXQgYERFQlVHYCBhbmRcclxuICogYFZFUkJPU0VgIGxvZ3Mgd2lsbCBub3QpXHJcbiAqL1xyXG52YXIgTG9nTGV2ZWw7XHJcbihmdW5jdGlvbiAoTG9nTGV2ZWwpIHtcclxuICAgIExvZ0xldmVsW0xvZ0xldmVsW1wiREVCVUdcIl0gPSAwXSA9IFwiREVCVUdcIjtcclxuICAgIExvZ0xldmVsW0xvZ0xldmVsW1wiVkVSQk9TRVwiXSA9IDFdID0gXCJWRVJCT1NFXCI7XHJcbiAgICBMb2dMZXZlbFtMb2dMZXZlbFtcIklORk9cIl0gPSAyXSA9IFwiSU5GT1wiO1xyXG4gICAgTG9nTGV2ZWxbTG9nTGV2ZWxbXCJXQVJOXCJdID0gM10gPSBcIldBUk5cIjtcclxuICAgIExvZ0xldmVsW0xvZ0xldmVsW1wiRVJST1JcIl0gPSA0XSA9IFwiRVJST1JcIjtcclxuICAgIExvZ0xldmVsW0xvZ0xldmVsW1wiU0lMRU5UXCJdID0gNV0gPSBcIlNJTEVOVFwiO1xyXG59KShMb2dMZXZlbCB8fCAoTG9nTGV2ZWwgPSB7fSkpO1xyXG5jb25zdCBsZXZlbFN0cmluZ1RvRW51bSA9IHtcclxuICAgICdkZWJ1Zyc6IExvZ0xldmVsLkRFQlVHLFxyXG4gICAgJ3ZlcmJvc2UnOiBMb2dMZXZlbC5WRVJCT1NFLFxyXG4gICAgJ2luZm8nOiBMb2dMZXZlbC5JTkZPLFxyXG4gICAgJ3dhcm4nOiBMb2dMZXZlbC5XQVJOLFxyXG4gICAgJ2Vycm9yJzogTG9nTGV2ZWwuRVJST1IsXHJcbiAgICAnc2lsZW50JzogTG9nTGV2ZWwuU0lMRU5UXHJcbn07XHJcbi8qKlxyXG4gKiBUaGUgZGVmYXVsdCBsb2cgbGV2ZWxcclxuICovXHJcbmNvbnN0IGRlZmF1bHRMb2dMZXZlbCA9IExvZ0xldmVsLklORk87XHJcbi8qKlxyXG4gKiBCeSBkZWZhdWx0LCBgY29uc29sZS5kZWJ1Z2AgaXMgbm90IGRpc3BsYXllZCBpbiB0aGUgZGV2ZWxvcGVyIGNvbnNvbGUgKGluXHJcbiAqIGNocm9tZSkuIFRvIGF2b2lkIGZvcmNpbmcgdXNlcnMgdG8gaGF2ZSB0byBvcHQtaW4gdG8gdGhlc2UgbG9ncyB0d2ljZVxyXG4gKiAoaS5lLiBvbmNlIGZvciBmaXJlYmFzZSwgYW5kIG9uY2UgaW4gdGhlIGNvbnNvbGUpLCB3ZSBhcmUgc2VuZGluZyBgREVCVUdgXHJcbiAqIGxvZ3MgdG8gdGhlIGBjb25zb2xlLmxvZ2AgZnVuY3Rpb24uXHJcbiAqL1xyXG5jb25zdCBDb25zb2xlTWV0aG9kID0ge1xyXG4gICAgW0xvZ0xldmVsLkRFQlVHXTogJ2xvZycsXHJcbiAgICBbTG9nTGV2ZWwuVkVSQk9TRV06ICdsb2cnLFxyXG4gICAgW0xvZ0xldmVsLklORk9dOiAnaW5mbycsXHJcbiAgICBbTG9nTGV2ZWwuV0FSTl06ICd3YXJuJyxcclxuICAgIFtMb2dMZXZlbC5FUlJPUl06ICdlcnJvcidcclxufTtcclxuLyoqXHJcbiAqIFRoZSBkZWZhdWx0IGxvZyBoYW5kbGVyIHdpbGwgZm9yd2FyZCBERUJVRywgVkVSQk9TRSwgSU5GTywgV0FSTiwgYW5kIEVSUk9SXHJcbiAqIG1lc3NhZ2VzIG9uIHRvIHRoZWlyIGNvcnJlc3BvbmRpbmcgY29uc29sZSBjb3VudGVycGFydHMgKGlmIHRoZSBsb2cgbWV0aG9kXHJcbiAqIGlzIHN1cHBvcnRlZCBieSB0aGUgY3VycmVudCBsb2cgbGV2ZWwpXHJcbiAqL1xyXG5jb25zdCBkZWZhdWx0TG9nSGFuZGxlciA9IChpbnN0YW5jZSwgbG9nVHlwZSwgLi4uYXJncykgPT4ge1xyXG4gICAgaWYgKGxvZ1R5cGUgPCBpbnN0YW5jZS5sb2dMZXZlbCkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKTtcclxuICAgIGNvbnN0IG1ldGhvZCA9IENvbnNvbGVNZXRob2RbbG9nVHlwZV07XHJcbiAgICBpZiAobWV0aG9kKSB7XHJcbiAgICAgICAgY29uc29sZVttZXRob2RdKGBbJHtub3d9XSAgJHtpbnN0YW5jZS5uYW1lfTpgLCAuLi5hcmdzKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQXR0ZW1wdGVkIHRvIGxvZyBhIG1lc3NhZ2Ugd2l0aCBhbiBpbnZhbGlkIGxvZ1R5cGUgKHZhbHVlOiAke2xvZ1R5cGV9KWApO1xyXG4gICAgfVxyXG59O1xyXG5jbGFzcyBMb2dnZXIge1xyXG4gICAgLyoqXHJcbiAgICAgKiBHaXZlcyB5b3UgYW4gaW5zdGFuY2Ugb2YgYSBMb2dnZXIgdG8gY2FwdHVyZSBtZXNzYWdlcyBhY2NvcmRpbmcgdG9cclxuICAgICAqIEZpcmViYXNlJ3MgbG9nZ2luZyBzY2hlbWUuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIG5hbWUgVGhlIG5hbWUgdGhhdCB0aGUgbG9ncyB3aWxsIGJlIGFzc29jaWF0ZWQgd2l0aFxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcihuYW1lKSB7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBUaGUgbG9nIGxldmVsIG9mIHRoZSBnaXZlbiBMb2dnZXIgaW5zdGFuY2UuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5fbG9nTGV2ZWwgPSBkZWZhdWx0TG9nTGV2ZWw7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogVGhlIG1haW4gKGludGVybmFsKSBsb2cgaGFuZGxlciBmb3IgdGhlIExvZ2dlciBpbnN0YW5jZS5cclxuICAgICAgICAgKiBDYW4gYmUgc2V0IHRvIGEgbmV3IGZ1bmN0aW9uIGluIGludGVybmFsIHBhY2thZ2UgY29kZSBidXQgbm90IGJ5IHVzZXIuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5fbG9nSGFuZGxlciA9IGRlZmF1bHRMb2dIYW5kbGVyO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFRoZSBvcHRpb25hbCwgYWRkaXRpb25hbCwgdXNlci1kZWZpbmVkIGxvZyBoYW5kbGVyIGZvciB0aGUgTG9nZ2VyIGluc3RhbmNlLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuX3VzZXJMb2dIYW5kbGVyID0gbnVsbDtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBDYXB0dXJlIHRoZSBjdXJyZW50IGluc3RhbmNlIGZvciBsYXRlciB1c2VcclxuICAgICAgICAgKi9cclxuICAgICAgICBpbnN0YW5jZXMucHVzaCh0aGlzKTtcclxuICAgIH1cclxuICAgIGdldCBsb2dMZXZlbCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbG9nTGV2ZWw7XHJcbiAgICB9XHJcbiAgICBzZXQgbG9nTGV2ZWwodmFsKSB7XHJcbiAgICAgICAgaWYgKCEodmFsIGluIExvZ0xldmVsKSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGBJbnZhbGlkIHZhbHVlIFwiJHt2YWx9XCIgYXNzaWduZWQgdG8gXFxgbG9nTGV2ZWxcXGBgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fbG9nTGV2ZWwgPSB2YWw7XHJcbiAgICB9XHJcbiAgICAvLyBXb3JrYXJvdW5kIGZvciBzZXR0ZXIvZ2V0dGVyIGhhdmluZyB0byBiZSB0aGUgc2FtZSB0eXBlLlxyXG4gICAgc2V0TG9nTGV2ZWwodmFsKSB7XHJcbiAgICAgICAgdGhpcy5fbG9nTGV2ZWwgPSB0eXBlb2YgdmFsID09PSAnc3RyaW5nJyA/IGxldmVsU3RyaW5nVG9FbnVtW3ZhbF0gOiB2YWw7XHJcbiAgICB9XHJcbiAgICBnZXQgbG9nSGFuZGxlcigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbG9nSGFuZGxlcjtcclxuICAgIH1cclxuICAgIHNldCBsb2dIYW5kbGVyKHZhbCkge1xyXG4gICAgICAgIGlmICh0eXBlb2YgdmFsICE9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1ZhbHVlIGFzc2lnbmVkIHRvIGBsb2dIYW5kbGVyYCBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fbG9nSGFuZGxlciA9IHZhbDtcclxuICAgIH1cclxuICAgIGdldCB1c2VyTG9nSGFuZGxlcigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdXNlckxvZ0hhbmRsZXI7XHJcbiAgICB9XHJcbiAgICBzZXQgdXNlckxvZ0hhbmRsZXIodmFsKSB7XHJcbiAgICAgICAgdGhpcy5fdXNlckxvZ0hhbmRsZXIgPSB2YWw7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFRoZSBmdW5jdGlvbnMgYmVsb3cgYXJlIGFsbCBiYXNlZCBvbiB0aGUgYGNvbnNvbGVgIGludGVyZmFjZVxyXG4gICAgICovXHJcbiAgICBkZWJ1ZyguLi5hcmdzKSB7XHJcbiAgICAgICAgdGhpcy5fdXNlckxvZ0hhbmRsZXIgJiYgdGhpcy5fdXNlckxvZ0hhbmRsZXIodGhpcywgTG9nTGV2ZWwuREVCVUcsIC4uLmFyZ3MpO1xyXG4gICAgICAgIHRoaXMuX2xvZ0hhbmRsZXIodGhpcywgTG9nTGV2ZWwuREVCVUcsIC4uLmFyZ3MpO1xyXG4gICAgfVxyXG4gICAgbG9nKC4uLmFyZ3MpIHtcclxuICAgICAgICB0aGlzLl91c2VyTG9nSGFuZGxlciAmJlxyXG4gICAgICAgICAgICB0aGlzLl91c2VyTG9nSGFuZGxlcih0aGlzLCBMb2dMZXZlbC5WRVJCT1NFLCAuLi5hcmdzKTtcclxuICAgICAgICB0aGlzLl9sb2dIYW5kbGVyKHRoaXMsIExvZ0xldmVsLlZFUkJPU0UsIC4uLmFyZ3MpO1xyXG4gICAgfVxyXG4gICAgaW5mbyguLi5hcmdzKSB7XHJcbiAgICAgICAgdGhpcy5fdXNlckxvZ0hhbmRsZXIgJiYgdGhpcy5fdXNlckxvZ0hhbmRsZXIodGhpcywgTG9nTGV2ZWwuSU5GTywgLi4uYXJncyk7XHJcbiAgICAgICAgdGhpcy5fbG9nSGFuZGxlcih0aGlzLCBMb2dMZXZlbC5JTkZPLCAuLi5hcmdzKTtcclxuICAgIH1cclxuICAgIHdhcm4oLi4uYXJncykge1xyXG4gICAgICAgIHRoaXMuX3VzZXJMb2dIYW5kbGVyICYmIHRoaXMuX3VzZXJMb2dIYW5kbGVyKHRoaXMsIExvZ0xldmVsLldBUk4sIC4uLmFyZ3MpO1xyXG4gICAgICAgIHRoaXMuX2xvZ0hhbmRsZXIodGhpcywgTG9nTGV2ZWwuV0FSTiwgLi4uYXJncyk7XHJcbiAgICB9XHJcbiAgICBlcnJvciguLi5hcmdzKSB7XHJcbiAgICAgICAgdGhpcy5fdXNlckxvZ0hhbmRsZXIgJiYgdGhpcy5fdXNlckxvZ0hhbmRsZXIodGhpcywgTG9nTGV2ZWwuRVJST1IsIC4uLmFyZ3MpO1xyXG4gICAgICAgIHRoaXMuX2xvZ0hhbmRsZXIodGhpcywgTG9nTGV2ZWwuRVJST1IsIC4uLmFyZ3MpO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIHNldExvZ0xldmVsKGxldmVsKSB7XHJcbiAgICBpbnN0YW5jZXMuZm9yRWFjaChpbnN0ID0+IHtcclxuICAgICAgICBpbnN0LnNldExvZ0xldmVsKGxldmVsKTtcclxuICAgIH0pO1xyXG59XHJcbmZ1bmN0aW9uIHNldFVzZXJMb2dIYW5kbGVyKGxvZ0NhbGxiYWNrLCBvcHRpb25zKSB7XHJcbiAgICBmb3IgKGNvbnN0IGluc3RhbmNlIG9mIGluc3RhbmNlcykge1xyXG4gICAgICAgIGxldCBjdXN0b21Mb2dMZXZlbCA9IG51bGw7XHJcbiAgICAgICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5sZXZlbCkge1xyXG4gICAgICAgICAgICBjdXN0b21Mb2dMZXZlbCA9IGxldmVsU3RyaW5nVG9FbnVtW29wdGlvbnMubGV2ZWxdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobG9nQ2FsbGJhY2sgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgaW5zdGFuY2UudXNlckxvZ0hhbmRsZXIgPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaW5zdGFuY2UudXNlckxvZ0hhbmRsZXIgPSAoaW5zdGFuY2UsIGxldmVsLCAuLi5hcmdzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBtZXNzYWdlID0gYXJnc1xyXG4gICAgICAgICAgICAgICAgICAgIC5tYXAoYXJnID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYXJnID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiBhcmcgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhcmc7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiBhcmcgPT09ICdudW1iZXInIHx8IHR5cGVvZiBhcmcgPT09ICdib29sZWFuJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXJnLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKGFyZyBpbnN0YW5jZW9mIEVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhcmcubWVzc2FnZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoYXJnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXRjaCAoaWdub3JlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoYXJnID0+IGFyZylcclxuICAgICAgICAgICAgICAgICAgICAuam9pbignICcpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGxldmVsID49IChjdXN0b21Mb2dMZXZlbCAhPT0gbnVsbCAmJiBjdXN0b21Mb2dMZXZlbCAhPT0gdm9pZCAwID8gY3VzdG9tTG9nTGV2ZWwgOiBpbnN0YW5jZS5sb2dMZXZlbCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBsb2dDYWxsYmFjayh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldmVsOiBMb2dMZXZlbFtsZXZlbF0udG9Mb3dlckNhc2UoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXJncyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogaW5zdGFuY2UubmFtZVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxuXG5leHBvcnQgeyBMb2dMZXZlbCwgTG9nZ2VyLCBzZXRMb2dMZXZlbCwgc2V0VXNlckxvZ0hhbmRsZXIgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmVzbTIwMTcuanMubWFwXG4iLCJjb25zdCBpbnN0YW5jZU9mQW55ID0gKG9iamVjdCwgY29uc3RydWN0b3JzKSA9PiBjb25zdHJ1Y3RvcnMuc29tZSgoYykgPT4gb2JqZWN0IGluc3RhbmNlb2YgYyk7XG5cbmxldCBpZGJQcm94eWFibGVUeXBlcztcbmxldCBjdXJzb3JBZHZhbmNlTWV0aG9kcztcbi8vIFRoaXMgaXMgYSBmdW5jdGlvbiB0byBwcmV2ZW50IGl0IHRocm93aW5nIHVwIGluIG5vZGUgZW52aXJvbm1lbnRzLlxuZnVuY3Rpb24gZ2V0SWRiUHJveHlhYmxlVHlwZXMoKSB7XG4gICAgcmV0dXJuIChpZGJQcm94eWFibGVUeXBlcyB8fFxuICAgICAgICAoaWRiUHJveHlhYmxlVHlwZXMgPSBbXG4gICAgICAgICAgICBJREJEYXRhYmFzZSxcbiAgICAgICAgICAgIElEQk9iamVjdFN0b3JlLFxuICAgICAgICAgICAgSURCSW5kZXgsXG4gICAgICAgICAgICBJREJDdXJzb3IsXG4gICAgICAgICAgICBJREJUcmFuc2FjdGlvbixcbiAgICAgICAgXSkpO1xufVxuLy8gVGhpcyBpcyBhIGZ1bmN0aW9uIHRvIHByZXZlbnQgaXQgdGhyb3dpbmcgdXAgaW4gbm9kZSBlbnZpcm9ubWVudHMuXG5mdW5jdGlvbiBnZXRDdXJzb3JBZHZhbmNlTWV0aG9kcygpIHtcbiAgICByZXR1cm4gKGN1cnNvckFkdmFuY2VNZXRob2RzIHx8XG4gICAgICAgIChjdXJzb3JBZHZhbmNlTWV0aG9kcyA9IFtcbiAgICAgICAgICAgIElEQkN1cnNvci5wcm90b3R5cGUuYWR2YW5jZSxcbiAgICAgICAgICAgIElEQkN1cnNvci5wcm90b3R5cGUuY29udGludWUsXG4gICAgICAgICAgICBJREJDdXJzb3IucHJvdG90eXBlLmNvbnRpbnVlUHJpbWFyeUtleSxcbiAgICAgICAgXSkpO1xufVxuY29uc3QgY3Vyc29yUmVxdWVzdE1hcCA9IG5ldyBXZWFrTWFwKCk7XG5jb25zdCB0cmFuc2FjdGlvbkRvbmVNYXAgPSBuZXcgV2Vha01hcCgpO1xuY29uc3QgdHJhbnNhY3Rpb25TdG9yZU5hbWVzTWFwID0gbmV3IFdlYWtNYXAoKTtcbmNvbnN0IHRyYW5zZm9ybUNhY2hlID0gbmV3IFdlYWtNYXAoKTtcbmNvbnN0IHJldmVyc2VUcmFuc2Zvcm1DYWNoZSA9IG5ldyBXZWFrTWFwKCk7XG5mdW5jdGlvbiBwcm9taXNpZnlSZXF1ZXN0KHJlcXVlc3QpIHtcbiAgICBjb25zdCBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBjb25zdCB1bmxpc3RlbiA9ICgpID0+IHtcbiAgICAgICAgICAgIHJlcXVlc3QucmVtb3ZlRXZlbnRMaXN0ZW5lcignc3VjY2VzcycsIHN1Y2Nlc3MpO1xuICAgICAgICAgICAgcmVxdWVzdC5yZW1vdmVFdmVudExpc3RlbmVyKCdlcnJvcicsIGVycm9yKTtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3Qgc3VjY2VzcyA9ICgpID0+IHtcbiAgICAgICAgICAgIHJlc29sdmUod3JhcChyZXF1ZXN0LnJlc3VsdCkpO1xuICAgICAgICAgICAgdW5saXN0ZW4oKTtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgZXJyb3IgPSAoKSA9PiB7XG4gICAgICAgICAgICByZWplY3QocmVxdWVzdC5lcnJvcik7XG4gICAgICAgICAgICB1bmxpc3RlbigpO1xuICAgICAgICB9O1xuICAgICAgICByZXF1ZXN0LmFkZEV2ZW50TGlzdGVuZXIoJ3N1Y2Nlc3MnLCBzdWNjZXNzKTtcbiAgICAgICAgcmVxdWVzdC5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIGVycm9yKTtcbiAgICB9KTtcbiAgICBwcm9taXNlXG4gICAgICAgIC50aGVuKCh2YWx1ZSkgPT4ge1xuICAgICAgICAvLyBTaW5jZSBjdXJzb3JpbmcgcmV1c2VzIHRoZSBJREJSZXF1ZXN0ICgqc2lnaCopLCB3ZSBjYWNoZSBpdCBmb3IgbGF0ZXIgcmV0cmlldmFsXG4gICAgICAgIC8vIChzZWUgd3JhcEZ1bmN0aW9uKS5cbiAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgSURCQ3Vyc29yKSB7XG4gICAgICAgICAgICBjdXJzb3JSZXF1ZXN0TWFwLnNldCh2YWx1ZSwgcmVxdWVzdCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQ2F0Y2hpbmcgdG8gYXZvaWQgXCJVbmNhdWdodCBQcm9taXNlIGV4Y2VwdGlvbnNcIlxuICAgIH0pXG4gICAgICAgIC5jYXRjaCgoKSA9PiB7IH0pO1xuICAgIC8vIFRoaXMgbWFwcGluZyBleGlzdHMgaW4gcmV2ZXJzZVRyYW5zZm9ybUNhY2hlIGJ1dCBkb2Vzbid0IGRvZXNuJ3QgZXhpc3QgaW4gdHJhbnNmb3JtQ2FjaGUuIFRoaXNcbiAgICAvLyBpcyBiZWNhdXNlIHdlIGNyZWF0ZSBtYW55IHByb21pc2VzIGZyb20gYSBzaW5nbGUgSURCUmVxdWVzdC5cbiAgICByZXZlcnNlVHJhbnNmb3JtQ2FjaGUuc2V0KHByb21pc2UsIHJlcXVlc3QpO1xuICAgIHJldHVybiBwcm9taXNlO1xufVxuZnVuY3Rpb24gY2FjaGVEb25lUHJvbWlzZUZvclRyYW5zYWN0aW9uKHR4KSB7XG4gICAgLy8gRWFybHkgYmFpbCBpZiB3ZSd2ZSBhbHJlYWR5IGNyZWF0ZWQgYSBkb25lIHByb21pc2UgZm9yIHRoaXMgdHJhbnNhY3Rpb24uXG4gICAgaWYgKHRyYW5zYWN0aW9uRG9uZU1hcC5oYXModHgpKVxuICAgICAgICByZXR1cm47XG4gICAgY29uc3QgZG9uZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgY29uc3QgdW5saXN0ZW4gPSAoKSA9PiB7XG4gICAgICAgICAgICB0eC5yZW1vdmVFdmVudExpc3RlbmVyKCdjb21wbGV0ZScsIGNvbXBsZXRlKTtcbiAgICAgICAgICAgIHR4LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgZXJyb3IpO1xuICAgICAgICAgICAgdHgucmVtb3ZlRXZlbnRMaXN0ZW5lcignYWJvcnQnLCBlcnJvcik7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGNvbXBsZXRlID0gKCkgPT4ge1xuICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgdW5saXN0ZW4oKTtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgZXJyb3IgPSAoKSA9PiB7XG4gICAgICAgICAgICByZWplY3QodHguZXJyb3IgfHwgbmV3IERPTUV4Y2VwdGlvbignQWJvcnRFcnJvcicsICdBYm9ydEVycm9yJykpO1xuICAgICAgICAgICAgdW5saXN0ZW4oKTtcbiAgICAgICAgfTtcbiAgICAgICAgdHguYWRkRXZlbnRMaXN0ZW5lcignY29tcGxldGUnLCBjb21wbGV0ZSk7XG4gICAgICAgIHR4LmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgZXJyb3IpO1xuICAgICAgICB0eC5hZGRFdmVudExpc3RlbmVyKCdhYm9ydCcsIGVycm9yKTtcbiAgICB9KTtcbiAgICAvLyBDYWNoZSBpdCBmb3IgbGF0ZXIgcmV0cmlldmFsLlxuICAgIHRyYW5zYWN0aW9uRG9uZU1hcC5zZXQodHgsIGRvbmUpO1xufVxubGV0IGlkYlByb3h5VHJhcHMgPSB7XG4gICAgZ2V0KHRhcmdldCwgcHJvcCwgcmVjZWl2ZXIpIHtcbiAgICAgICAgaWYgKHRhcmdldCBpbnN0YW5jZW9mIElEQlRyYW5zYWN0aW9uKSB7XG4gICAgICAgICAgICAvLyBTcGVjaWFsIGhhbmRsaW5nIGZvciB0cmFuc2FjdGlvbi5kb25lLlxuICAgICAgICAgICAgaWYgKHByb3AgPT09ICdkb25lJylcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJhbnNhY3Rpb25Eb25lTWFwLmdldCh0YXJnZXQpO1xuICAgICAgICAgICAgLy8gUG9seWZpbGwgZm9yIG9iamVjdFN0b3JlTmFtZXMgYmVjYXVzZSBvZiBFZGdlLlxuICAgICAgICAgICAgaWYgKHByb3AgPT09ICdvYmplY3RTdG9yZU5hbWVzJykge1xuICAgICAgICAgICAgICAgIHJldHVybiB0YXJnZXQub2JqZWN0U3RvcmVOYW1lcyB8fCB0cmFuc2FjdGlvblN0b3JlTmFtZXNNYXAuZ2V0KHRhcmdldCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBNYWtlIHR4LnN0b3JlIHJldHVybiB0aGUgb25seSBzdG9yZSBpbiB0aGUgdHJhbnNhY3Rpb24sIG9yIHVuZGVmaW5lZCBpZiB0aGVyZSBhcmUgbWFueS5cbiAgICAgICAgICAgIGlmIChwcm9wID09PSAnc3RvcmUnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlY2VpdmVyLm9iamVjdFN0b3JlTmFtZXNbMV1cbiAgICAgICAgICAgICAgICAgICAgPyB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICAgICAgOiByZWNlaXZlci5vYmplY3RTdG9yZShyZWNlaXZlci5vYmplY3RTdG9yZU5hbWVzWzBdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBFbHNlIHRyYW5zZm9ybSB3aGF0ZXZlciB3ZSBnZXQgYmFjay5cbiAgICAgICAgcmV0dXJuIHdyYXAodGFyZ2V0W3Byb3BdKTtcbiAgICB9LFxuICAgIHNldCh0YXJnZXQsIHByb3AsIHZhbHVlKSB7XG4gICAgICAgIHRhcmdldFtwcm9wXSA9IHZhbHVlO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICAgIGhhcyh0YXJnZXQsIHByb3ApIHtcbiAgICAgICAgaWYgKHRhcmdldCBpbnN0YW5jZW9mIElEQlRyYW5zYWN0aW9uICYmXG4gICAgICAgICAgICAocHJvcCA9PT0gJ2RvbmUnIHx8IHByb3AgPT09ICdzdG9yZScpKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcHJvcCBpbiB0YXJnZXQ7XG4gICAgfSxcbn07XG5mdW5jdGlvbiByZXBsYWNlVHJhcHMoY2FsbGJhY2spIHtcbiAgICBpZGJQcm94eVRyYXBzID0gY2FsbGJhY2soaWRiUHJveHlUcmFwcyk7XG59XG5mdW5jdGlvbiB3cmFwRnVuY3Rpb24oZnVuYykge1xuICAgIC8vIER1ZSB0byBleHBlY3RlZCBvYmplY3QgZXF1YWxpdHkgKHdoaWNoIGlzIGVuZm9yY2VkIGJ5IHRoZSBjYWNoaW5nIGluIGB3cmFwYCksIHdlXG4gICAgLy8gb25seSBjcmVhdGUgb25lIG5ldyBmdW5jIHBlciBmdW5jLlxuICAgIC8vIEVkZ2UgZG9lc24ndCBzdXBwb3J0IG9iamVjdFN0b3JlTmFtZXMgKGJvb28pLCBzbyB3ZSBwb2x5ZmlsbCBpdCBoZXJlLlxuICAgIGlmIChmdW5jID09PSBJREJEYXRhYmFzZS5wcm90b3R5cGUudHJhbnNhY3Rpb24gJiZcbiAgICAgICAgISgnb2JqZWN0U3RvcmVOYW1lcycgaW4gSURCVHJhbnNhY3Rpb24ucHJvdG90eXBlKSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHN0b3JlTmFtZXMsIC4uLmFyZ3MpIHtcbiAgICAgICAgICAgIGNvbnN0IHR4ID0gZnVuYy5jYWxsKHVud3JhcCh0aGlzKSwgc3RvcmVOYW1lcywgLi4uYXJncyk7XG4gICAgICAgICAgICB0cmFuc2FjdGlvblN0b3JlTmFtZXNNYXAuc2V0KHR4LCBzdG9yZU5hbWVzLnNvcnQgPyBzdG9yZU5hbWVzLnNvcnQoKSA6IFtzdG9yZU5hbWVzXSk7XG4gICAgICAgICAgICByZXR1cm4gd3JhcCh0eCk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIC8vIEN1cnNvciBtZXRob2RzIGFyZSBzcGVjaWFsLCBhcyB0aGUgYmVoYXZpb3VyIGlzIGEgbGl0dGxlIG1vcmUgZGlmZmVyZW50IHRvIHN0YW5kYXJkIElEQi4gSW5cbiAgICAvLyBJREIsIHlvdSBhZHZhbmNlIHRoZSBjdXJzb3IgYW5kIHdhaXQgZm9yIGEgbmV3ICdzdWNjZXNzJyBvbiB0aGUgSURCUmVxdWVzdCB0aGF0IGdhdmUgeW91IHRoZVxuICAgIC8vIGN1cnNvci4gSXQncyBraW5kYSBsaWtlIGEgcHJvbWlzZSB0aGF0IGNhbiByZXNvbHZlIHdpdGggbWFueSB2YWx1ZXMuIFRoYXQgZG9lc24ndCBtYWtlIHNlbnNlXG4gICAgLy8gd2l0aCByZWFsIHByb21pc2VzLCBzbyBlYWNoIGFkdmFuY2UgbWV0aG9kcyByZXR1cm5zIGEgbmV3IHByb21pc2UgZm9yIHRoZSBjdXJzb3Igb2JqZWN0LCBvclxuICAgIC8vIHVuZGVmaW5lZCBpZiB0aGUgZW5kIG9mIHRoZSBjdXJzb3IgaGFzIGJlZW4gcmVhY2hlZC5cbiAgICBpZiAoZ2V0Q3Vyc29yQWR2YW5jZU1ldGhvZHMoKS5pbmNsdWRlcyhmdW5jKSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKC4uLmFyZ3MpIHtcbiAgICAgICAgICAgIC8vIENhbGxpbmcgdGhlIG9yaWdpbmFsIGZ1bmN0aW9uIHdpdGggdGhlIHByb3h5IGFzICd0aGlzJyBjYXVzZXMgSUxMRUdBTCBJTlZPQ0FUSU9OLCBzbyB3ZSB1c2VcbiAgICAgICAgICAgIC8vIHRoZSBvcmlnaW5hbCBvYmplY3QuXG4gICAgICAgICAgICBmdW5jLmFwcGx5KHVud3JhcCh0aGlzKSwgYXJncyk7XG4gICAgICAgICAgICByZXR1cm4gd3JhcChjdXJzb3JSZXF1ZXN0TWFwLmdldCh0aGlzKSk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBmdW5jdGlvbiAoLi4uYXJncykge1xuICAgICAgICAvLyBDYWxsaW5nIHRoZSBvcmlnaW5hbCBmdW5jdGlvbiB3aXRoIHRoZSBwcm94eSBhcyAndGhpcycgY2F1c2VzIElMTEVHQUwgSU5WT0NBVElPTiwgc28gd2UgdXNlXG4gICAgICAgIC8vIHRoZSBvcmlnaW5hbCBvYmplY3QuXG4gICAgICAgIHJldHVybiB3cmFwKGZ1bmMuYXBwbHkodW53cmFwKHRoaXMpLCBhcmdzKSk7XG4gICAgfTtcbn1cbmZ1bmN0aW9uIHRyYW5zZm9ybUNhY2hhYmxlVmFsdWUodmFsdWUpIHtcbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nKVxuICAgICAgICByZXR1cm4gd3JhcEZ1bmN0aW9uKHZhbHVlKTtcbiAgICAvLyBUaGlzIGRvZXNuJ3QgcmV0dXJuLCBpdCBqdXN0IGNyZWF0ZXMgYSAnZG9uZScgcHJvbWlzZSBmb3IgdGhlIHRyYW5zYWN0aW9uLFxuICAgIC8vIHdoaWNoIGlzIGxhdGVyIHJldHVybmVkIGZvciB0cmFuc2FjdGlvbi5kb25lIChzZWUgaWRiT2JqZWN0SGFuZGxlcikuXG4gICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgSURCVHJhbnNhY3Rpb24pXG4gICAgICAgIGNhY2hlRG9uZVByb21pc2VGb3JUcmFuc2FjdGlvbih2YWx1ZSk7XG4gICAgaWYgKGluc3RhbmNlT2ZBbnkodmFsdWUsIGdldElkYlByb3h5YWJsZVR5cGVzKCkpKVxuICAgICAgICByZXR1cm4gbmV3IFByb3h5KHZhbHVlLCBpZGJQcm94eVRyYXBzKTtcbiAgICAvLyBSZXR1cm4gdGhlIHNhbWUgdmFsdWUgYmFjayBpZiB3ZSdyZSBub3QgZ29pbmcgdG8gdHJhbnNmb3JtIGl0LlxuICAgIHJldHVybiB2YWx1ZTtcbn1cbmZ1bmN0aW9uIHdyYXAodmFsdWUpIHtcbiAgICAvLyBXZSBzb21ldGltZXMgZ2VuZXJhdGUgbXVsdGlwbGUgcHJvbWlzZXMgZnJvbSBhIHNpbmdsZSBJREJSZXF1ZXN0IChlZyB3aGVuIGN1cnNvcmluZyksIGJlY2F1c2VcbiAgICAvLyBJREIgaXMgd2VpcmQgYW5kIGEgc2luZ2xlIElEQlJlcXVlc3QgY2FuIHlpZWxkIG1hbnkgcmVzcG9uc2VzLCBzbyB0aGVzZSBjYW4ndCBiZSBjYWNoZWQuXG4gICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgSURCUmVxdWVzdClcbiAgICAgICAgcmV0dXJuIHByb21pc2lmeVJlcXVlc3QodmFsdWUpO1xuICAgIC8vIElmIHdlJ3ZlIGFscmVhZHkgdHJhbnNmb3JtZWQgdGhpcyB2YWx1ZSBiZWZvcmUsIHJldXNlIHRoZSB0cmFuc2Zvcm1lZCB2YWx1ZS5cbiAgICAvLyBUaGlzIGlzIGZhc3RlciwgYnV0IGl0IGFsc28gcHJvdmlkZXMgb2JqZWN0IGVxdWFsaXR5LlxuICAgIGlmICh0cmFuc2Zvcm1DYWNoZS5oYXModmFsdWUpKVxuICAgICAgICByZXR1cm4gdHJhbnNmb3JtQ2FjaGUuZ2V0KHZhbHVlKTtcbiAgICBjb25zdCBuZXdWYWx1ZSA9IHRyYW5zZm9ybUNhY2hhYmxlVmFsdWUodmFsdWUpO1xuICAgIC8vIE5vdCBhbGwgdHlwZXMgYXJlIHRyYW5zZm9ybWVkLlxuICAgIC8vIFRoZXNlIG1heSBiZSBwcmltaXRpdmUgdHlwZXMsIHNvIHRoZXkgY2FuJ3QgYmUgV2Vha01hcCBrZXlzLlxuICAgIGlmIChuZXdWYWx1ZSAhPT0gdmFsdWUpIHtcbiAgICAgICAgdHJhbnNmb3JtQ2FjaGUuc2V0KHZhbHVlLCBuZXdWYWx1ZSk7XG4gICAgICAgIHJldmVyc2VUcmFuc2Zvcm1DYWNoZS5zZXQobmV3VmFsdWUsIHZhbHVlKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ld1ZhbHVlO1xufVxuY29uc3QgdW53cmFwID0gKHZhbHVlKSA9PiByZXZlcnNlVHJhbnNmb3JtQ2FjaGUuZ2V0KHZhbHVlKTtcblxuZXhwb3J0IHsgcmV2ZXJzZVRyYW5zZm9ybUNhY2hlIGFzIGEsIGluc3RhbmNlT2ZBbnkgYXMgaSwgcmVwbGFjZVRyYXBzIGFzIHIsIHVud3JhcCBhcyB1LCB3cmFwIGFzIHcgfTtcbiIsImltcG9ydCB7IHcgYXMgd3JhcCwgciBhcyByZXBsYWNlVHJhcHMgfSBmcm9tICcuL3dyYXAtaWRiLXZhbHVlLmpzJztcbmV4cG9ydCB7IHUgYXMgdW53cmFwLCB3IGFzIHdyYXAgfSBmcm9tICcuL3dyYXAtaWRiLXZhbHVlLmpzJztcblxuLyoqXG4gKiBPcGVuIGEgZGF0YWJhc2UuXG4gKlxuICogQHBhcmFtIG5hbWUgTmFtZSBvZiB0aGUgZGF0YWJhc2UuXG4gKiBAcGFyYW0gdmVyc2lvbiBTY2hlbWEgdmVyc2lvbi5cbiAqIEBwYXJhbSBjYWxsYmFja3MgQWRkaXRpb25hbCBjYWxsYmFja3MuXG4gKi9cbmZ1bmN0aW9uIG9wZW5EQihuYW1lLCB2ZXJzaW9uLCB7IGJsb2NrZWQsIHVwZ3JhZGUsIGJsb2NraW5nLCB0ZXJtaW5hdGVkIH0gPSB7fSkge1xuICAgIGNvbnN0IHJlcXVlc3QgPSBpbmRleGVkREIub3BlbihuYW1lLCB2ZXJzaW9uKTtcbiAgICBjb25zdCBvcGVuUHJvbWlzZSA9IHdyYXAocmVxdWVzdCk7XG4gICAgaWYgKHVwZ3JhZGUpIHtcbiAgICAgICAgcmVxdWVzdC5hZGRFdmVudExpc3RlbmVyKCd1cGdyYWRlbmVlZGVkJywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICB1cGdyYWRlKHdyYXAocmVxdWVzdC5yZXN1bHQpLCBldmVudC5vbGRWZXJzaW9uLCBldmVudC5uZXdWZXJzaW9uLCB3cmFwKHJlcXVlc3QudHJhbnNhY3Rpb24pKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChibG9ja2VkKVxuICAgICAgICByZXF1ZXN0LmFkZEV2ZW50TGlzdGVuZXIoJ2Jsb2NrZWQnLCAoKSA9PiBibG9ja2VkKCkpO1xuICAgIG9wZW5Qcm9taXNlXG4gICAgICAgIC50aGVuKChkYikgPT4ge1xuICAgICAgICBpZiAodGVybWluYXRlZClcbiAgICAgICAgICAgIGRiLmFkZEV2ZW50TGlzdGVuZXIoJ2Nsb3NlJywgKCkgPT4gdGVybWluYXRlZCgpKTtcbiAgICAgICAgaWYgKGJsb2NraW5nKVxuICAgICAgICAgICAgZGIuYWRkRXZlbnRMaXN0ZW5lcigndmVyc2lvbmNoYW5nZScsICgpID0+IGJsb2NraW5nKCkpO1xuICAgIH0pXG4gICAgICAgIC5jYXRjaCgoKSA9PiB7IH0pO1xuICAgIHJldHVybiBvcGVuUHJvbWlzZTtcbn1cbi8qKlxuICogRGVsZXRlIGEgZGF0YWJhc2UuXG4gKlxuICogQHBhcmFtIG5hbWUgTmFtZSBvZiB0aGUgZGF0YWJhc2UuXG4gKi9cbmZ1bmN0aW9uIGRlbGV0ZURCKG5hbWUsIHsgYmxvY2tlZCB9ID0ge30pIHtcbiAgICBjb25zdCByZXF1ZXN0ID0gaW5kZXhlZERCLmRlbGV0ZURhdGFiYXNlKG5hbWUpO1xuICAgIGlmIChibG9ja2VkKVxuICAgICAgICByZXF1ZXN0LmFkZEV2ZW50TGlzdGVuZXIoJ2Jsb2NrZWQnLCAoKSA9PiBibG9ja2VkKCkpO1xuICAgIHJldHVybiB3cmFwKHJlcXVlc3QpLnRoZW4oKCkgPT4gdW5kZWZpbmVkKTtcbn1cblxuY29uc3QgcmVhZE1ldGhvZHMgPSBbJ2dldCcsICdnZXRLZXknLCAnZ2V0QWxsJywgJ2dldEFsbEtleXMnLCAnY291bnQnXTtcbmNvbnN0IHdyaXRlTWV0aG9kcyA9IFsncHV0JywgJ2FkZCcsICdkZWxldGUnLCAnY2xlYXInXTtcbmNvbnN0IGNhY2hlZE1ldGhvZHMgPSBuZXcgTWFwKCk7XG5mdW5jdGlvbiBnZXRNZXRob2QodGFyZ2V0LCBwcm9wKSB7XG4gICAgaWYgKCEodGFyZ2V0IGluc3RhbmNlb2YgSURCRGF0YWJhc2UgJiZcbiAgICAgICAgIShwcm9wIGluIHRhcmdldCkgJiZcbiAgICAgICAgdHlwZW9mIHByb3AgPT09ICdzdHJpbmcnKSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChjYWNoZWRNZXRob2RzLmdldChwcm9wKSlcbiAgICAgICAgcmV0dXJuIGNhY2hlZE1ldGhvZHMuZ2V0KHByb3ApO1xuICAgIGNvbnN0IHRhcmdldEZ1bmNOYW1lID0gcHJvcC5yZXBsYWNlKC9Gcm9tSW5kZXgkLywgJycpO1xuICAgIGNvbnN0IHVzZUluZGV4ID0gcHJvcCAhPT0gdGFyZ2V0RnVuY05hbWU7XG4gICAgY29uc3QgaXNXcml0ZSA9IHdyaXRlTWV0aG9kcy5pbmNsdWRlcyh0YXJnZXRGdW5jTmFtZSk7XG4gICAgaWYgKFxuICAgIC8vIEJhaWwgaWYgdGhlIHRhcmdldCBkb2Vzbid0IGV4aXN0IG9uIHRoZSB0YXJnZXQuIEVnLCBnZXRBbGwgaXNuJ3QgaW4gRWRnZS5cbiAgICAhKHRhcmdldEZ1bmNOYW1lIGluICh1c2VJbmRleCA/IElEQkluZGV4IDogSURCT2JqZWN0U3RvcmUpLnByb3RvdHlwZSkgfHxcbiAgICAgICAgIShpc1dyaXRlIHx8IHJlYWRNZXRob2RzLmluY2x1ZGVzKHRhcmdldEZ1bmNOYW1lKSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBtZXRob2QgPSBhc3luYyBmdW5jdGlvbiAoc3RvcmVOYW1lLCAuLi5hcmdzKSB7XG4gICAgICAgIC8vIGlzV3JpdGUgPyAncmVhZHdyaXRlJyA6IHVuZGVmaW5lZCBnemlwcHMgYmV0dGVyLCBidXQgZmFpbHMgaW4gRWRnZSA6KFxuICAgICAgICBjb25zdCB0eCA9IHRoaXMudHJhbnNhY3Rpb24oc3RvcmVOYW1lLCBpc1dyaXRlID8gJ3JlYWR3cml0ZScgOiAncmVhZG9ubHknKTtcbiAgICAgICAgbGV0IHRhcmdldCA9IHR4LnN0b3JlO1xuICAgICAgICBpZiAodXNlSW5kZXgpXG4gICAgICAgICAgICB0YXJnZXQgPSB0YXJnZXQuaW5kZXgoYXJncy5zaGlmdCgpKTtcbiAgICAgICAgLy8gTXVzdCByZWplY3QgaWYgb3AgcmVqZWN0cy5cbiAgICAgICAgLy8gSWYgaXQncyBhIHdyaXRlIG9wZXJhdGlvbiwgbXVzdCByZWplY3QgaWYgdHguZG9uZSByZWplY3RzLlxuICAgICAgICAvLyBNdXN0IHJlamVjdCB3aXRoIG9wIHJlamVjdGlvbiBmaXJzdC5cbiAgICAgICAgLy8gTXVzdCByZXNvbHZlIHdpdGggb3AgdmFsdWUuXG4gICAgICAgIC8vIE11c3QgaGFuZGxlIGJvdGggcHJvbWlzZXMgKG5vIHVuaGFuZGxlZCByZWplY3Rpb25zKVxuICAgICAgICByZXR1cm4gKGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgICAgICAgIHRhcmdldFt0YXJnZXRGdW5jTmFtZV0oLi4uYXJncyksXG4gICAgICAgICAgICBpc1dyaXRlICYmIHR4LmRvbmUsXG4gICAgICAgIF0pKVswXTtcbiAgICB9O1xuICAgIGNhY2hlZE1ldGhvZHMuc2V0KHByb3AsIG1ldGhvZCk7XG4gICAgcmV0dXJuIG1ldGhvZDtcbn1cbnJlcGxhY2VUcmFwcygob2xkVHJhcHMpID0+ICh7XG4gICAgLi4ub2xkVHJhcHMsXG4gICAgZ2V0OiAodGFyZ2V0LCBwcm9wLCByZWNlaXZlcikgPT4gZ2V0TWV0aG9kKHRhcmdldCwgcHJvcCkgfHwgb2xkVHJhcHMuZ2V0KHRhcmdldCwgcHJvcCwgcmVjZWl2ZXIpLFxuICAgIGhhczogKHRhcmdldCwgcHJvcCkgPT4gISFnZXRNZXRob2QodGFyZ2V0LCBwcm9wKSB8fCBvbGRUcmFwcy5oYXModGFyZ2V0LCBwcm9wKSxcbn0pKTtcblxuZXhwb3J0IHsgZGVsZXRlREIsIG9wZW5EQiB9O1xuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBDb21wb25lbnRDb250YWluZXIgfSBmcm9tICdAZmlyZWJhc2UvY29tcG9uZW50JztcbmltcG9ydCB7IExvZ2dlciwgc2V0VXNlckxvZ0hhbmRsZXIsIHNldExvZ0xldmVsIGFzIHNldExvZ0xldmVsJDEgfSBmcm9tICdAZmlyZWJhc2UvbG9nZ2VyJztcbmltcG9ydCB7IEVycm9yRmFjdG9yeSwgZ2V0RGVmYXVsdEFwcENvbmZpZywgZGVlcEVxdWFsLCBGaXJlYmFzZUVycm9yLCBiYXNlNjR1cmxFbmNvZGVXaXRob3V0UGFkZGluZywgaXNJbmRleGVkREJBdmFpbGFibGUsIHZhbGlkYXRlSW5kZXhlZERCT3BlbmFibGUgfSBmcm9tICdAZmlyZWJhc2UvdXRpbCc7XG5leHBvcnQgeyBGaXJlYmFzZUVycm9yIH0gZnJvbSAnQGZpcmViYXNlL3V0aWwnO1xuaW1wb3J0IHsgb3BlbkRCIH0gZnJvbSAnaWRiJztcblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuY2xhc3MgUGxhdGZvcm1Mb2dnZXJTZXJ2aWNlSW1wbCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihjb250YWluZXIpIHtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcclxuICAgIH1cclxuICAgIC8vIEluIGluaXRpYWwgaW1wbGVtZW50YXRpb24sIHRoaXMgd2lsbCBiZSBjYWxsZWQgYnkgaW5zdGFsbGF0aW9ucyBvblxyXG4gICAgLy8gYXV0aCB0b2tlbiByZWZyZXNoLCBhbmQgaW5zdGFsbGF0aW9ucyB3aWxsIHNlbmQgdGhpcyBzdHJpbmcuXHJcbiAgICBnZXRQbGF0Zm9ybUluZm9TdHJpbmcoKSB7XHJcbiAgICAgICAgY29uc3QgcHJvdmlkZXJzID0gdGhpcy5jb250YWluZXIuZ2V0UHJvdmlkZXJzKCk7XHJcbiAgICAgICAgLy8gTG9vcCB0aHJvdWdoIHByb3ZpZGVycyBhbmQgZ2V0IGxpYnJhcnkvdmVyc2lvbiBwYWlycyBmcm9tIGFueSB0aGF0IGFyZVxyXG4gICAgICAgIC8vIHZlcnNpb24gY29tcG9uZW50cy5cclxuICAgICAgICByZXR1cm4gcHJvdmlkZXJzXHJcbiAgICAgICAgICAgIC5tYXAocHJvdmlkZXIgPT4ge1xyXG4gICAgICAgICAgICBpZiAoaXNWZXJzaW9uU2VydmljZVByb3ZpZGVyKHByb3ZpZGVyKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc2VydmljZSA9IHByb3ZpZGVyLmdldEltbWVkaWF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGAke3NlcnZpY2UubGlicmFyeX0vJHtzZXJ2aWNlLnZlcnNpb259YDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICAgICAgLmZpbHRlcihsb2dTdHJpbmcgPT4gbG9nU3RyaW5nKVxyXG4gICAgICAgICAgICAuam9pbignICcpO1xyXG4gICAgfVxyXG59XHJcbi8qKlxyXG4gKlxyXG4gKiBAcGFyYW0gcHJvdmlkZXIgY2hlY2sgaWYgdGhpcyBwcm92aWRlciBwcm92aWRlcyBhIFZlcnNpb25TZXJ2aWNlXHJcbiAqXHJcbiAqIE5PVEU6IFVzaW5nIFByb3ZpZGVyPCdhcHAtdmVyc2lvbic+IGlzIGEgaGFjayB0byBpbmRpY2F0ZSB0aGF0IHRoZSBwcm92aWRlclxyXG4gKiBwcm92aWRlcyBWZXJzaW9uU2VydmljZS4gVGhlIHByb3ZpZGVyIGlzIG5vdCBuZWNlc3NhcmlseSBhICdhcHAtdmVyc2lvbidcclxuICogcHJvdmlkZXIuXHJcbiAqL1xyXG5mdW5jdGlvbiBpc1ZlcnNpb25TZXJ2aWNlUHJvdmlkZXIocHJvdmlkZXIpIHtcclxuICAgIGNvbnN0IGNvbXBvbmVudCA9IHByb3ZpZGVyLmdldENvbXBvbmVudCgpO1xyXG4gICAgcmV0dXJuIChjb21wb25lbnQgPT09IG51bGwgfHwgY29tcG9uZW50ID09PSB2b2lkIDAgPyB2b2lkIDAgOiBjb21wb25lbnQudHlwZSkgPT09IFwiVkVSU0lPTlwiIC8qIFZFUlNJT04gKi87XHJcbn1cblxuY29uc3QgbmFtZSRvID0gXCJAZmlyZWJhc2UvYXBwXCI7XG5jb25zdCB2ZXJzaW9uJDEgPSBcIjAuOC4yXCI7XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbmNvbnN0IGxvZ2dlciA9IG5ldyBMb2dnZXIoJ0BmaXJlYmFzZS9hcHAnKTtcblxuY29uc3QgbmFtZSRuID0gXCJAZmlyZWJhc2UvYXBwLWNvbXBhdFwiO1xuXG5jb25zdCBuYW1lJG0gPSBcIkBmaXJlYmFzZS9hbmFseXRpY3MtY29tcGF0XCI7XG5cbmNvbnN0IG5hbWUkbCA9IFwiQGZpcmViYXNlL2FuYWx5dGljc1wiO1xuXG5jb25zdCBuYW1lJGsgPSBcIkBmaXJlYmFzZS9hcHAtY2hlY2stY29tcGF0XCI7XG5cbmNvbnN0IG5hbWUkaiA9IFwiQGZpcmViYXNlL2FwcC1jaGVja1wiO1xuXG5jb25zdCBuYW1lJGkgPSBcIkBmaXJlYmFzZS9hdXRoXCI7XG5cbmNvbnN0IG5hbWUkaCA9IFwiQGZpcmViYXNlL2F1dGgtY29tcGF0XCI7XG5cbmNvbnN0IG5hbWUkZyA9IFwiQGZpcmViYXNlL2RhdGFiYXNlXCI7XG5cbmNvbnN0IG5hbWUkZiA9IFwiQGZpcmViYXNlL2RhdGFiYXNlLWNvbXBhdFwiO1xuXG5jb25zdCBuYW1lJGUgPSBcIkBmaXJlYmFzZS9mdW5jdGlvbnNcIjtcblxuY29uc3QgbmFtZSRkID0gXCJAZmlyZWJhc2UvZnVuY3Rpb25zLWNvbXBhdFwiO1xuXG5jb25zdCBuYW1lJGMgPSBcIkBmaXJlYmFzZS9pbnN0YWxsYXRpb25zXCI7XG5cbmNvbnN0IG5hbWUkYiA9IFwiQGZpcmViYXNlL2luc3RhbGxhdGlvbnMtY29tcGF0XCI7XG5cbmNvbnN0IG5hbWUkYSA9IFwiQGZpcmViYXNlL21lc3NhZ2luZ1wiO1xuXG5jb25zdCBuYW1lJDkgPSBcIkBmaXJlYmFzZS9tZXNzYWdpbmctY29tcGF0XCI7XG5cbmNvbnN0IG5hbWUkOCA9IFwiQGZpcmViYXNlL3BlcmZvcm1hbmNlXCI7XG5cbmNvbnN0IG5hbWUkNyA9IFwiQGZpcmViYXNlL3BlcmZvcm1hbmNlLWNvbXBhdFwiO1xuXG5jb25zdCBuYW1lJDYgPSBcIkBmaXJlYmFzZS9yZW1vdGUtY29uZmlnXCI7XG5cbmNvbnN0IG5hbWUkNSA9IFwiQGZpcmViYXNlL3JlbW90ZS1jb25maWctY29tcGF0XCI7XG5cbmNvbnN0IG5hbWUkNCA9IFwiQGZpcmViYXNlL3N0b3JhZ2VcIjtcblxuY29uc3QgbmFtZSQzID0gXCJAZmlyZWJhc2Uvc3RvcmFnZS1jb21wYXRcIjtcblxuY29uc3QgbmFtZSQyID0gXCJAZmlyZWJhc2UvZmlyZXN0b3JlXCI7XG5cbmNvbnN0IG5hbWUkMSA9IFwiQGZpcmViYXNlL2ZpcmVzdG9yZS1jb21wYXRcIjtcblxuY29uc3QgbmFtZSA9IFwiZmlyZWJhc2VcIjtcbmNvbnN0IHZlcnNpb24gPSBcIjkuMTIuMVwiO1xuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG4vKipcclxuICogVGhlIGRlZmF1bHQgYXBwIG5hbWVcclxuICpcclxuICogQGludGVybmFsXHJcbiAqL1xyXG5jb25zdCBERUZBVUxUX0VOVFJZX05BTUUgPSAnW0RFRkFVTFRdJztcclxuY29uc3QgUExBVEZPUk1fTE9HX1NUUklORyA9IHtcclxuICAgIFtuYW1lJG9dOiAnZmlyZS1jb3JlJyxcclxuICAgIFtuYW1lJG5dOiAnZmlyZS1jb3JlLWNvbXBhdCcsXHJcbiAgICBbbmFtZSRsXTogJ2ZpcmUtYW5hbHl0aWNzJyxcclxuICAgIFtuYW1lJG1dOiAnZmlyZS1hbmFseXRpY3MtY29tcGF0JyxcclxuICAgIFtuYW1lJGpdOiAnZmlyZS1hcHAtY2hlY2snLFxyXG4gICAgW25hbWUka106ICdmaXJlLWFwcC1jaGVjay1jb21wYXQnLFxyXG4gICAgW25hbWUkaV06ICdmaXJlLWF1dGgnLFxyXG4gICAgW25hbWUkaF06ICdmaXJlLWF1dGgtY29tcGF0JyxcclxuICAgIFtuYW1lJGddOiAnZmlyZS1ydGRiJyxcclxuICAgIFtuYW1lJGZdOiAnZmlyZS1ydGRiLWNvbXBhdCcsXHJcbiAgICBbbmFtZSRlXTogJ2ZpcmUtZm4nLFxyXG4gICAgW25hbWUkZF06ICdmaXJlLWZuLWNvbXBhdCcsXHJcbiAgICBbbmFtZSRjXTogJ2ZpcmUtaWlkJyxcclxuICAgIFtuYW1lJGJdOiAnZmlyZS1paWQtY29tcGF0JyxcclxuICAgIFtuYW1lJGFdOiAnZmlyZS1mY20nLFxyXG4gICAgW25hbWUkOV06ICdmaXJlLWZjbS1jb21wYXQnLFxyXG4gICAgW25hbWUkOF06ICdmaXJlLXBlcmYnLFxyXG4gICAgW25hbWUkN106ICdmaXJlLXBlcmYtY29tcGF0JyxcclxuICAgIFtuYW1lJDZdOiAnZmlyZS1yYycsXHJcbiAgICBbbmFtZSQ1XTogJ2ZpcmUtcmMtY29tcGF0JyxcclxuICAgIFtuYW1lJDRdOiAnZmlyZS1nY3MnLFxyXG4gICAgW25hbWUkM106ICdmaXJlLWdjcy1jb21wYXQnLFxyXG4gICAgW25hbWUkMl06ICdmaXJlLWZzdCcsXHJcbiAgICBbbmFtZSQxXTogJ2ZpcmUtZnN0LWNvbXBhdCcsXHJcbiAgICAnZmlyZS1qcyc6ICdmaXJlLWpzJyxcclxuICAgIFtuYW1lXTogJ2ZpcmUtanMtYWxsJ1xyXG59O1xuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG4vKipcclxuICogQGludGVybmFsXHJcbiAqL1xyXG5jb25zdCBfYXBwcyA9IG5ldyBNYXAoKTtcclxuLyoqXHJcbiAqIFJlZ2lzdGVyZWQgY29tcG9uZW50cy5cclxuICpcclxuICogQGludGVybmFsXHJcbiAqL1xyXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxyXG5jb25zdCBfY29tcG9uZW50cyA9IG5ldyBNYXAoKTtcclxuLyoqXHJcbiAqIEBwYXJhbSBjb21wb25lbnQgLSB0aGUgY29tcG9uZW50IGJlaW5nIGFkZGVkIHRvIHRoaXMgYXBwJ3MgY29udGFpbmVyXHJcbiAqXHJcbiAqIEBpbnRlcm5hbFxyXG4gKi9cclxuZnVuY3Rpb24gX2FkZENvbXBvbmVudChhcHAsIGNvbXBvbmVudCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBhcHAuY29udGFpbmVyLmFkZENvbXBvbmVudChjb21wb25lbnQpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICBsb2dnZXIuZGVidWcoYENvbXBvbmVudCAke2NvbXBvbmVudC5uYW1lfSBmYWlsZWQgdG8gcmVnaXN0ZXIgd2l0aCBGaXJlYmFzZUFwcCAke2FwcC5uYW1lfWAsIGUpO1xyXG4gICAgfVxyXG59XHJcbi8qKlxyXG4gKlxyXG4gKiBAaW50ZXJuYWxcclxuICovXHJcbmZ1bmN0aW9uIF9hZGRPck92ZXJ3cml0ZUNvbXBvbmVudChhcHAsIGNvbXBvbmVudCkge1xyXG4gICAgYXBwLmNvbnRhaW5lci5hZGRPck92ZXJ3cml0ZUNvbXBvbmVudChjb21wb25lbnQpO1xyXG59XHJcbi8qKlxyXG4gKlxyXG4gKiBAcGFyYW0gY29tcG9uZW50IC0gdGhlIGNvbXBvbmVudCB0byByZWdpc3RlclxyXG4gKiBAcmV0dXJucyB3aGV0aGVyIG9yIG5vdCB0aGUgY29tcG9uZW50IGlzIHJlZ2lzdGVyZWQgc3VjY2Vzc2Z1bGx5XHJcbiAqXHJcbiAqIEBpbnRlcm5hbFxyXG4gKi9cclxuZnVuY3Rpb24gX3JlZ2lzdGVyQ29tcG9uZW50KGNvbXBvbmVudCkge1xyXG4gICAgY29uc3QgY29tcG9uZW50TmFtZSA9IGNvbXBvbmVudC5uYW1lO1xyXG4gICAgaWYgKF9jb21wb25lbnRzLmhhcyhjb21wb25lbnROYW1lKSkge1xyXG4gICAgICAgIGxvZ2dlci5kZWJ1ZyhgVGhlcmUgd2VyZSBtdWx0aXBsZSBhdHRlbXB0cyB0byByZWdpc3RlciBjb21wb25lbnQgJHtjb21wb25lbnROYW1lfS5gKTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBfY29tcG9uZW50cy5zZXQoY29tcG9uZW50TmFtZSwgY29tcG9uZW50KTtcclxuICAgIC8vIGFkZCB0aGUgY29tcG9uZW50IHRvIGV4aXN0aW5nIGFwcCBpbnN0YW5jZXNcclxuICAgIGZvciAoY29uc3QgYXBwIG9mIF9hcHBzLnZhbHVlcygpKSB7XHJcbiAgICAgICAgX2FkZENvbXBvbmVudChhcHAsIGNvbXBvbmVudCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxufVxyXG4vKipcclxuICpcclxuICogQHBhcmFtIGFwcCAtIEZpcmViYXNlQXBwIGluc3RhbmNlXHJcbiAqIEBwYXJhbSBuYW1lIC0gc2VydmljZSBuYW1lXHJcbiAqXHJcbiAqIEByZXR1cm5zIHRoZSBwcm92aWRlciBmb3IgdGhlIHNlcnZpY2Ugd2l0aCB0aGUgbWF0Y2hpbmcgbmFtZVxyXG4gKlxyXG4gKiBAaW50ZXJuYWxcclxuICovXHJcbmZ1bmN0aW9uIF9nZXRQcm92aWRlcihhcHAsIG5hbWUpIHtcclxuICAgIGNvbnN0IGhlYXJ0YmVhdENvbnRyb2xsZXIgPSBhcHAuY29udGFpbmVyXHJcbiAgICAgICAgLmdldFByb3ZpZGVyKCdoZWFydGJlYXQnKVxyXG4gICAgICAgIC5nZXRJbW1lZGlhdGUoeyBvcHRpb25hbDogdHJ1ZSB9KTtcclxuICAgIGlmIChoZWFydGJlYXRDb250cm9sbGVyKSB7XHJcbiAgICAgICAgdm9pZCBoZWFydGJlYXRDb250cm9sbGVyLnRyaWdnZXJIZWFydGJlYXQoKTtcclxuICAgIH1cclxuICAgIHJldHVybiBhcHAuY29udGFpbmVyLmdldFByb3ZpZGVyKG5hbWUpO1xyXG59XHJcbi8qKlxyXG4gKlxyXG4gKiBAcGFyYW0gYXBwIC0gRmlyZWJhc2VBcHAgaW5zdGFuY2VcclxuICogQHBhcmFtIG5hbWUgLSBzZXJ2aWNlIG5hbWVcclxuICogQHBhcmFtIGluc3RhbmNlSWRlbnRpZmllciAtIHNlcnZpY2UgaW5zdGFuY2UgaWRlbnRpZmllciBpbiBjYXNlIHRoZSBzZXJ2aWNlIHN1cHBvcnRzIG11bHRpcGxlIGluc3RhbmNlc1xyXG4gKlxyXG4gKiBAaW50ZXJuYWxcclxuICovXHJcbmZ1bmN0aW9uIF9yZW1vdmVTZXJ2aWNlSW5zdGFuY2UoYXBwLCBuYW1lLCBpbnN0YW5jZUlkZW50aWZpZXIgPSBERUZBVUxUX0VOVFJZX05BTUUpIHtcclxuICAgIF9nZXRQcm92aWRlcihhcHAsIG5hbWUpLmNsZWFySW5zdGFuY2UoaW5zdGFuY2VJZGVudGlmaWVyKTtcclxufVxyXG4vKipcclxuICogVGVzdCBvbmx5XHJcbiAqXHJcbiAqIEBpbnRlcm5hbFxyXG4gKi9cclxuZnVuY3Rpb24gX2NsZWFyQ29tcG9uZW50cygpIHtcclxuICAgIF9jb21wb25lbnRzLmNsZWFyKCk7XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuY29uc3QgRVJST1JTID0ge1xyXG4gICAgW1wibm8tYXBwXCIgLyogTk9fQVBQICovXTogXCJObyBGaXJlYmFzZSBBcHAgJ3skYXBwTmFtZX0nIGhhcyBiZWVuIGNyZWF0ZWQgLSBcIiArXHJcbiAgICAgICAgJ2NhbGwgRmlyZWJhc2UgQXBwLmluaXRpYWxpemVBcHAoKScsXHJcbiAgICBbXCJiYWQtYXBwLW5hbWVcIiAvKiBCQURfQVBQX05BTUUgKi9dOiBcIklsbGVnYWwgQXBwIG5hbWU6ICd7JGFwcE5hbWV9XCIsXHJcbiAgICBbXCJkdXBsaWNhdGUtYXBwXCIgLyogRFVQTElDQVRFX0FQUCAqL106IFwiRmlyZWJhc2UgQXBwIG5hbWVkICd7JGFwcE5hbWV9JyBhbHJlYWR5IGV4aXN0cyB3aXRoIGRpZmZlcmVudCBvcHRpb25zIG9yIGNvbmZpZ1wiLFxyXG4gICAgW1wiYXBwLWRlbGV0ZWRcIiAvKiBBUFBfREVMRVRFRCAqL106IFwiRmlyZWJhc2UgQXBwIG5hbWVkICd7JGFwcE5hbWV9JyBhbHJlYWR5IGRlbGV0ZWRcIixcclxuICAgIFtcIm5vLW9wdGlvbnNcIiAvKiBOT19PUFRJT05TICovXTogJ05lZWQgdG8gcHJvdmlkZSBvcHRpb25zLCB3aGVuIG5vdCBiZWluZyBkZXBsb3llZCB0byBob3N0aW5nIHZpYSBzb3VyY2UuJyxcclxuICAgIFtcImludmFsaWQtYXBwLWFyZ3VtZW50XCIgLyogSU5WQUxJRF9BUFBfQVJHVU1FTlQgKi9dOiAnZmlyZWJhc2UueyRhcHBOYW1lfSgpIHRha2VzIGVpdGhlciBubyBhcmd1bWVudCBvciBhICcgK1xyXG4gICAgICAgICdGaXJlYmFzZSBBcHAgaW5zdGFuY2UuJyxcclxuICAgIFtcImludmFsaWQtbG9nLWFyZ3VtZW50XCIgLyogSU5WQUxJRF9MT0dfQVJHVU1FTlQgKi9dOiAnRmlyc3QgYXJndW1lbnQgdG8gYG9uTG9nYCBtdXN0IGJlIG51bGwgb3IgYSBmdW5jdGlvbi4nLFxyXG4gICAgW1wiaWRiLW9wZW5cIiAvKiBJREJfT1BFTiAqL106ICdFcnJvciB0aHJvd24gd2hlbiBvcGVuaW5nIEluZGV4ZWREQi4gT3JpZ2luYWwgZXJyb3I6IHskb3JpZ2luYWxFcnJvck1lc3NhZ2V9LicsXHJcbiAgICBbXCJpZGItZ2V0XCIgLyogSURCX0dFVCAqL106ICdFcnJvciB0aHJvd24gd2hlbiByZWFkaW5nIGZyb20gSW5kZXhlZERCLiBPcmlnaW5hbCBlcnJvcjogeyRvcmlnaW5hbEVycm9yTWVzc2FnZX0uJyxcclxuICAgIFtcImlkYi1zZXRcIiAvKiBJREJfV1JJVEUgKi9dOiAnRXJyb3IgdGhyb3duIHdoZW4gd3JpdGluZyB0byBJbmRleGVkREIuIE9yaWdpbmFsIGVycm9yOiB7JG9yaWdpbmFsRXJyb3JNZXNzYWdlfS4nLFxyXG4gICAgW1wiaWRiLWRlbGV0ZVwiIC8qIElEQl9ERUxFVEUgKi9dOiAnRXJyb3IgdGhyb3duIHdoZW4gZGVsZXRpbmcgZnJvbSBJbmRleGVkREIuIE9yaWdpbmFsIGVycm9yOiB7JG9yaWdpbmFsRXJyb3JNZXNzYWdlfS4nXHJcbn07XHJcbmNvbnN0IEVSUk9SX0ZBQ1RPUlkgPSBuZXcgRXJyb3JGYWN0b3J5KCdhcHAnLCAnRmlyZWJhc2UnLCBFUlJPUlMpO1xuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5jbGFzcyBGaXJlYmFzZUFwcEltcGwge1xyXG4gICAgY29uc3RydWN0b3Iob3B0aW9ucywgY29uZmlnLCBjb250YWluZXIpIHtcclxuICAgICAgICB0aGlzLl9pc0RlbGV0ZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLl9vcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucyk7XHJcbiAgICAgICAgdGhpcy5fY29uZmlnID0gT2JqZWN0LmFzc2lnbih7fSwgY29uZmlnKTtcclxuICAgICAgICB0aGlzLl9uYW1lID0gY29uZmlnLm5hbWU7XHJcbiAgICAgICAgdGhpcy5fYXV0b21hdGljRGF0YUNvbGxlY3Rpb25FbmFibGVkID1cclxuICAgICAgICAgICAgY29uZmlnLmF1dG9tYXRpY0RhdGFDb2xsZWN0aW9uRW5hYmxlZDtcclxuICAgICAgICB0aGlzLl9jb250YWluZXIgPSBjb250YWluZXI7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuYWRkQ29tcG9uZW50KG5ldyBDb21wb25lbnQoJ2FwcCcsICgpID0+IHRoaXMsIFwiUFVCTElDXCIgLyogUFVCTElDICovKSk7XHJcbiAgICB9XHJcbiAgICBnZXQgYXV0b21hdGljRGF0YUNvbGxlY3Rpb25FbmFibGVkKCkge1xyXG4gICAgICAgIHRoaXMuY2hlY2tEZXN0cm95ZWQoKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5fYXV0b21hdGljRGF0YUNvbGxlY3Rpb25FbmFibGVkO1xyXG4gICAgfVxyXG4gICAgc2V0IGF1dG9tYXRpY0RhdGFDb2xsZWN0aW9uRW5hYmxlZCh2YWwpIHtcclxuICAgICAgICB0aGlzLmNoZWNrRGVzdHJveWVkKCk7XHJcbiAgICAgICAgdGhpcy5fYXV0b21hdGljRGF0YUNvbGxlY3Rpb25FbmFibGVkID0gdmFsO1xyXG4gICAgfVxyXG4gICAgZ2V0IG5hbWUoKSB7XHJcbiAgICAgICAgdGhpcy5jaGVja0Rlc3Ryb3llZCgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9uYW1lO1xyXG4gICAgfVxyXG4gICAgZ2V0IG9wdGlvbnMoKSB7XHJcbiAgICAgICAgdGhpcy5jaGVja0Rlc3Ryb3llZCgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9vcHRpb25zO1xyXG4gICAgfVxyXG4gICAgZ2V0IGNvbmZpZygpIHtcclxuICAgICAgICB0aGlzLmNoZWNrRGVzdHJveWVkKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbmZpZztcclxuICAgIH1cclxuICAgIGdldCBjb250YWluZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbnRhaW5lcjtcclxuICAgIH1cclxuICAgIGdldCBpc0RlbGV0ZWQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzRGVsZXRlZDtcclxuICAgIH1cclxuICAgIHNldCBpc0RlbGV0ZWQodmFsKSB7XHJcbiAgICAgICAgdGhpcy5faXNEZWxldGVkID0gdmFsO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIHdpbGwgdGhyb3cgYW4gRXJyb3IgaWYgdGhlIEFwcCBoYXMgYWxyZWFkeSBiZWVuIGRlbGV0ZWQgLVxyXG4gICAgICogdXNlIGJlZm9yZSBwZXJmb3JtaW5nIEFQSSBhY3Rpb25zIG9uIHRoZSBBcHAuXHJcbiAgICAgKi9cclxuICAgIGNoZWNrRGVzdHJveWVkKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmlzRGVsZXRlZCkge1xyXG4gICAgICAgICAgICB0aHJvdyBFUlJPUl9GQUNUT1JZLmNyZWF0ZShcImFwcC1kZWxldGVkXCIgLyogQVBQX0RFTEVURUQgKi8sIHsgYXBwTmFtZTogdGhpcy5fbmFtZSB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqXHJcbiAqIFRoZSBjdXJyZW50IFNESyB2ZXJzaW9uLlxyXG4gKlxyXG4gKiBAcHVibGljXHJcbiAqL1xyXG5jb25zdCBTREtfVkVSU0lPTiA9IHZlcnNpb247XHJcbmZ1bmN0aW9uIGluaXRpYWxpemVBcHAoX29wdGlvbnMsIHJhd0NvbmZpZyA9IHt9KSB7XHJcbiAgICBsZXQgb3B0aW9ucyA9IF9vcHRpb25zO1xyXG4gICAgaWYgKHR5cGVvZiByYXdDb25maWcgIT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgY29uc3QgbmFtZSA9IHJhd0NvbmZpZztcclxuICAgICAgICByYXdDb25maWcgPSB7IG5hbWUgfTtcclxuICAgIH1cclxuICAgIGNvbnN0IGNvbmZpZyA9IE9iamVjdC5hc3NpZ24oeyBuYW1lOiBERUZBVUxUX0VOVFJZX05BTUUsIGF1dG9tYXRpY0RhdGFDb2xsZWN0aW9uRW5hYmxlZDogZmFsc2UgfSwgcmF3Q29uZmlnKTtcclxuICAgIGNvbnN0IG5hbWUgPSBjb25maWcubmFtZTtcclxuICAgIGlmICh0eXBlb2YgbmFtZSAhPT0gJ3N0cmluZycgfHwgIW5hbWUpIHtcclxuICAgICAgICB0aHJvdyBFUlJPUl9GQUNUT1JZLmNyZWF0ZShcImJhZC1hcHAtbmFtZVwiIC8qIEJBRF9BUFBfTkFNRSAqLywge1xyXG4gICAgICAgICAgICBhcHBOYW1lOiBTdHJpbmcobmFtZSlcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIG9wdGlvbnMgfHwgKG9wdGlvbnMgPSBnZXREZWZhdWx0QXBwQ29uZmlnKCkpO1xyXG4gICAgaWYgKCFvcHRpb25zKSB7XHJcbiAgICAgICAgdGhyb3cgRVJST1JfRkFDVE9SWS5jcmVhdGUoXCJuby1vcHRpb25zXCIgLyogTk9fT1BUSU9OUyAqLyk7XHJcbiAgICB9XHJcbiAgICBjb25zdCBleGlzdGluZ0FwcCA9IF9hcHBzLmdldChuYW1lKTtcclxuICAgIGlmIChleGlzdGluZ0FwcCkge1xyXG4gICAgICAgIC8vIHJldHVybiB0aGUgZXhpc3RpbmcgYXBwIGlmIG9wdGlvbnMgYW5kIGNvbmZpZyBkZWVwIGVxdWFsIHRoZSBvbmVzIGluIHRoZSBleGlzdGluZyBhcHAuXHJcbiAgICAgICAgaWYgKGRlZXBFcXVhbChvcHRpb25zLCBleGlzdGluZ0FwcC5vcHRpb25zKSAmJlxyXG4gICAgICAgICAgICBkZWVwRXF1YWwoY29uZmlnLCBleGlzdGluZ0FwcC5jb25maWcpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBleGlzdGluZ0FwcDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKFwiZHVwbGljYXRlLWFwcFwiIC8qIERVUExJQ0FURV9BUFAgKi8sIHsgYXBwTmFtZTogbmFtZSB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBjb25zdCBjb250YWluZXIgPSBuZXcgQ29tcG9uZW50Q29udGFpbmVyKG5hbWUpO1xyXG4gICAgZm9yIChjb25zdCBjb21wb25lbnQgb2YgX2NvbXBvbmVudHMudmFsdWVzKCkpIHtcclxuICAgICAgICBjb250YWluZXIuYWRkQ29tcG9uZW50KGNvbXBvbmVudCk7XHJcbiAgICB9XHJcbiAgICBjb25zdCBuZXdBcHAgPSBuZXcgRmlyZWJhc2VBcHBJbXBsKG9wdGlvbnMsIGNvbmZpZywgY29udGFpbmVyKTtcclxuICAgIF9hcHBzLnNldChuYW1lLCBuZXdBcHApO1xyXG4gICAgcmV0dXJuIG5ld0FwcDtcclxufVxyXG4vKipcclxuICogUmV0cmlldmVzIGEge0BsaW5rIEBmaXJlYmFzZS9hcHAjRmlyZWJhc2VBcHB9IGluc3RhbmNlLlxyXG4gKlxyXG4gKiBXaGVuIGNhbGxlZCB3aXRoIG5vIGFyZ3VtZW50cywgdGhlIGRlZmF1bHQgYXBwIGlzIHJldHVybmVkLiBXaGVuIGFuIGFwcCBuYW1lXHJcbiAqIGlzIHByb3ZpZGVkLCB0aGUgYXBwIGNvcnJlc3BvbmRpbmcgdG8gdGhhdCBuYW1lIGlzIHJldHVybmVkLlxyXG4gKlxyXG4gKiBBbiBleGNlcHRpb24gaXMgdGhyb3duIGlmIHRoZSBhcHAgYmVpbmcgcmV0cmlldmVkIGhhcyBub3QgeWV0IGJlZW5cclxuICogaW5pdGlhbGl6ZWQuXHJcbiAqXHJcbiAqIEBleGFtcGxlXHJcbiAqIGBgYGphdmFzY3JpcHRcclxuICogLy8gUmV0dXJuIHRoZSBkZWZhdWx0IGFwcFxyXG4gKiBjb25zdCBhcHAgPSBnZXRBcHAoKTtcclxuICogYGBgXHJcbiAqXHJcbiAqIEBleGFtcGxlXHJcbiAqIGBgYGphdmFzY3JpcHRcclxuICogLy8gUmV0dXJuIGEgbmFtZWQgYXBwXHJcbiAqIGNvbnN0IG90aGVyQXBwID0gZ2V0QXBwKFwib3RoZXJBcHBcIik7XHJcbiAqIGBgYFxyXG4gKlxyXG4gKiBAcGFyYW0gbmFtZSAtIE9wdGlvbmFsIG5hbWUgb2YgdGhlIGFwcCB0byByZXR1cm4uIElmIG5vIG5hbWUgaXNcclxuICogICBwcm92aWRlZCwgdGhlIGRlZmF1bHQgaXMgYFwiW0RFRkFVTFRdXCJgLlxyXG4gKlxyXG4gKiBAcmV0dXJucyBUaGUgYXBwIGNvcnJlc3BvbmRpbmcgdG8gdGhlIHByb3ZpZGVkIGFwcCBuYW1lLlxyXG4gKiAgIElmIG5vIGFwcCBuYW1lIGlzIHByb3ZpZGVkLCB0aGUgZGVmYXVsdCBhcHAgaXMgcmV0dXJuZWQuXHJcbiAqXHJcbiAqIEBwdWJsaWNcclxuICovXHJcbmZ1bmN0aW9uIGdldEFwcChuYW1lID0gREVGQVVMVF9FTlRSWV9OQU1FKSB7XHJcbiAgICBjb25zdCBhcHAgPSBfYXBwcy5nZXQobmFtZSk7XHJcbiAgICBpZiAoIWFwcCAmJiBuYW1lID09PSBERUZBVUxUX0VOVFJZX05BTUUpIHtcclxuICAgICAgICByZXR1cm4gaW5pdGlhbGl6ZUFwcCgpO1xyXG4gICAgfVxyXG4gICAgaWYgKCFhcHApIHtcclxuICAgICAgICB0aHJvdyBFUlJPUl9GQUNUT1JZLmNyZWF0ZShcIm5vLWFwcFwiIC8qIE5PX0FQUCAqLywgeyBhcHBOYW1lOiBuYW1lIH0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFwcDtcclxufVxyXG4vKipcclxuICogQSAocmVhZC1vbmx5KSBhcnJheSBvZiBhbGwgaW5pdGlhbGl6ZWQgYXBwcy5cclxuICogQHB1YmxpY1xyXG4gKi9cclxuZnVuY3Rpb24gZ2V0QXBwcygpIHtcclxuICAgIHJldHVybiBBcnJheS5mcm9tKF9hcHBzLnZhbHVlcygpKTtcclxufVxyXG4vKipcclxuICogUmVuZGVycyB0aGlzIGFwcCB1bnVzYWJsZSBhbmQgZnJlZXMgdGhlIHJlc291cmNlcyBvZiBhbGwgYXNzb2NpYXRlZFxyXG4gKiBzZXJ2aWNlcy5cclxuICpcclxuICogQGV4YW1wbGVcclxuICogYGBgamF2YXNjcmlwdFxyXG4gKiBkZWxldGVBcHAoYXBwKVxyXG4gKiAgIC50aGVuKGZ1bmN0aW9uKCkge1xyXG4gKiAgICAgY29uc29sZS5sb2coXCJBcHAgZGVsZXRlZCBzdWNjZXNzZnVsbHlcIik7XHJcbiAqICAgfSlcclxuICogICAuY2F0Y2goZnVuY3Rpb24oZXJyb3IpIHtcclxuICogICAgIGNvbnNvbGUubG9nKFwiRXJyb3IgZGVsZXRpbmcgYXBwOlwiLCBlcnJvcik7XHJcbiAqICAgfSk7XHJcbiAqIGBgYFxyXG4gKlxyXG4gKiBAcHVibGljXHJcbiAqL1xyXG5hc3luYyBmdW5jdGlvbiBkZWxldGVBcHAoYXBwKSB7XHJcbiAgICBjb25zdCBuYW1lID0gYXBwLm5hbWU7XHJcbiAgICBpZiAoX2FwcHMuaGFzKG5hbWUpKSB7XHJcbiAgICAgICAgX2FwcHMuZGVsZXRlKG5hbWUpO1xyXG4gICAgICAgIGF3YWl0IFByb21pc2UuYWxsKGFwcC5jb250YWluZXJcclxuICAgICAgICAgICAgLmdldFByb3ZpZGVycygpXHJcbiAgICAgICAgICAgIC5tYXAocHJvdmlkZXIgPT4gcHJvdmlkZXIuZGVsZXRlKCkpKTtcclxuICAgICAgICBhcHAuaXNEZWxldGVkID0gdHJ1ZTtcclxuICAgIH1cclxufVxyXG4vKipcclxuICogUmVnaXN0ZXJzIGEgbGlicmFyeSdzIG5hbWUgYW5kIHZlcnNpb24gZm9yIHBsYXRmb3JtIGxvZ2dpbmcgcHVycG9zZXMuXHJcbiAqIEBwYXJhbSBsaWJyYXJ5IC0gTmFtZSBvZiAxcCBvciAzcCBsaWJyYXJ5IChlLmcuIGZpcmVzdG9yZSwgYW5ndWxhcmZpcmUpXHJcbiAqIEBwYXJhbSB2ZXJzaW9uIC0gQ3VycmVudCB2ZXJzaW9uIG9mIHRoYXQgbGlicmFyeS5cclxuICogQHBhcmFtIHZhcmlhbnQgLSBCdW5kbGUgdmFyaWFudCwgZS5nLiwgbm9kZSwgcm4sIGV0Yy5cclxuICpcclxuICogQHB1YmxpY1xyXG4gKi9cclxuZnVuY3Rpb24gcmVnaXN0ZXJWZXJzaW9uKGxpYnJhcnlLZXlPck5hbWUsIHZlcnNpb24sIHZhcmlhbnQpIHtcclxuICAgIHZhciBfYTtcclxuICAgIC8vIFRPRE86IFdlIGNhbiB1c2UgdGhpcyBjaGVjayB0byB3aGl0ZWxpc3Qgc3RyaW5ncyB3aGVuL2lmIHdlIHNldCB1cFxyXG4gICAgLy8gYSBnb29kIHdoaXRlbGlzdCBzeXN0ZW0uXHJcbiAgICBsZXQgbGlicmFyeSA9IChfYSA9IFBMQVRGT1JNX0xPR19TVFJJTkdbbGlicmFyeUtleU9yTmFtZV0pICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IGxpYnJhcnlLZXlPck5hbWU7XHJcbiAgICBpZiAodmFyaWFudCkge1xyXG4gICAgICAgIGxpYnJhcnkgKz0gYC0ke3ZhcmlhbnR9YDtcclxuICAgIH1cclxuICAgIGNvbnN0IGxpYnJhcnlNaXNtYXRjaCA9IGxpYnJhcnkubWF0Y2goL1xcc3xcXC8vKTtcclxuICAgIGNvbnN0IHZlcnNpb25NaXNtYXRjaCA9IHZlcnNpb24ubWF0Y2goL1xcc3xcXC8vKTtcclxuICAgIGlmIChsaWJyYXJ5TWlzbWF0Y2ggfHwgdmVyc2lvbk1pc21hdGNoKSB7XHJcbiAgICAgICAgY29uc3Qgd2FybmluZyA9IFtcclxuICAgICAgICAgICAgYFVuYWJsZSB0byByZWdpc3RlciBsaWJyYXJ5IFwiJHtsaWJyYXJ5fVwiIHdpdGggdmVyc2lvbiBcIiR7dmVyc2lvbn1cIjpgXHJcbiAgICAgICAgXTtcclxuICAgICAgICBpZiAobGlicmFyeU1pc21hdGNoKSB7XHJcbiAgICAgICAgICAgIHdhcm5pbmcucHVzaChgbGlicmFyeSBuYW1lIFwiJHtsaWJyYXJ5fVwiIGNvbnRhaW5zIGlsbGVnYWwgY2hhcmFjdGVycyAod2hpdGVzcGFjZSBvciBcIi9cIilgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGxpYnJhcnlNaXNtYXRjaCAmJiB2ZXJzaW9uTWlzbWF0Y2gpIHtcclxuICAgICAgICAgICAgd2FybmluZy5wdXNoKCdhbmQnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHZlcnNpb25NaXNtYXRjaCkge1xyXG4gICAgICAgICAgICB3YXJuaW5nLnB1c2goYHZlcnNpb24gbmFtZSBcIiR7dmVyc2lvbn1cIiBjb250YWlucyBpbGxlZ2FsIGNoYXJhY3RlcnMgKHdoaXRlc3BhY2Ugb3IgXCIvXCIpYCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxvZ2dlci53YXJuKHdhcm5pbmcuam9pbignICcpKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBfcmVnaXN0ZXJDb21wb25lbnQobmV3IENvbXBvbmVudChgJHtsaWJyYXJ5fS12ZXJzaW9uYCwgKCkgPT4gKHsgbGlicmFyeSwgdmVyc2lvbiB9KSwgXCJWRVJTSU9OXCIgLyogVkVSU0lPTiAqLykpO1xyXG59XHJcbi8qKlxyXG4gKiBTZXRzIGxvZyBoYW5kbGVyIGZvciBhbGwgRmlyZWJhc2UgU0RLcy5cclxuICogQHBhcmFtIGxvZ0NhbGxiYWNrIC0gQW4gb3B0aW9uYWwgY3VzdG9tIGxvZyBoYW5kbGVyIHRoYXQgZXhlY3V0ZXMgdXNlciBjb2RlIHdoZW5ldmVyXHJcbiAqIHRoZSBGaXJlYmFzZSBTREsgbWFrZXMgYSBsb2dnaW5nIGNhbGwuXHJcbiAqXHJcbiAqIEBwdWJsaWNcclxuICovXHJcbmZ1bmN0aW9uIG9uTG9nKGxvZ0NhbGxiYWNrLCBvcHRpb25zKSB7XHJcbiAgICBpZiAobG9nQ2FsbGJhY2sgIT09IG51bGwgJiYgdHlwZW9mIGxvZ0NhbGxiYWNrICE9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgdGhyb3cgRVJST1JfRkFDVE9SWS5jcmVhdGUoXCJpbnZhbGlkLWxvZy1hcmd1bWVudFwiIC8qIElOVkFMSURfTE9HX0FSR1VNRU5UICovKTtcclxuICAgIH1cclxuICAgIHNldFVzZXJMb2dIYW5kbGVyKGxvZ0NhbGxiYWNrLCBvcHRpb25zKTtcclxufVxyXG4vKipcclxuICogU2V0cyBsb2cgbGV2ZWwgZm9yIGFsbCBGaXJlYmFzZSBTREtzLlxyXG4gKlxyXG4gKiBBbGwgb2YgdGhlIGxvZyB0eXBlcyBhYm92ZSB0aGUgY3VycmVudCBsb2cgbGV2ZWwgYXJlIGNhcHR1cmVkIChpLmUuIGlmXHJcbiAqIHlvdSBzZXQgdGhlIGxvZyBsZXZlbCB0byBgaW5mb2AsIGVycm9ycyBhcmUgbG9nZ2VkLCBidXQgYGRlYnVnYCBhbmRcclxuICogYHZlcmJvc2VgIGxvZ3MgYXJlIG5vdCkuXHJcbiAqXHJcbiAqIEBwdWJsaWNcclxuICovXHJcbmZ1bmN0aW9uIHNldExvZ0xldmVsKGxvZ0xldmVsKSB7XHJcbiAgICBzZXRMb2dMZXZlbCQxKGxvZ0xldmVsKTtcclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMjEgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5jb25zdCBEQl9OQU1FID0gJ2ZpcmViYXNlLWhlYXJ0YmVhdC1kYXRhYmFzZSc7XHJcbmNvbnN0IERCX1ZFUlNJT04gPSAxO1xyXG5jb25zdCBTVE9SRV9OQU1FID0gJ2ZpcmViYXNlLWhlYXJ0YmVhdC1zdG9yZSc7XHJcbmxldCBkYlByb21pc2UgPSBudWxsO1xyXG5mdW5jdGlvbiBnZXREYlByb21pc2UoKSB7XHJcbiAgICBpZiAoIWRiUHJvbWlzZSkge1xyXG4gICAgICAgIGRiUHJvbWlzZSA9IG9wZW5EQihEQl9OQU1FLCBEQl9WRVJTSU9OLCB7XHJcbiAgICAgICAgICAgIHVwZ3JhZGU6IChkYiwgb2xkVmVyc2lvbikgPT4ge1xyXG4gICAgICAgICAgICAgICAgLy8gV2UgZG9uJ3QgdXNlICdicmVhaycgaW4gdGhpcyBzd2l0Y2ggc3RhdGVtZW50LCB0aGUgZmFsbC10aHJvdWdoXHJcbiAgICAgICAgICAgICAgICAvLyBiZWhhdmlvciBpcyB3aGF0IHdlIHdhbnQsIGJlY2F1c2UgaWYgdGhlcmUgYXJlIG11bHRpcGxlIHZlcnNpb25zIGJldHdlZW5cclxuICAgICAgICAgICAgICAgIC8vIHRoZSBvbGQgdmVyc2lvbiBhbmQgdGhlIGN1cnJlbnQgdmVyc2lvbiwgd2Ugd2FudCBBTEwgdGhlIG1pZ3JhdGlvbnNcclxuICAgICAgICAgICAgICAgIC8vIHRoYXQgY29ycmVzcG9uZCB0byB0aG9zZSB2ZXJzaW9ucyB0byBydW4sIG5vdCBvbmx5IHRoZSBsYXN0IG9uZS5cclxuICAgICAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBkZWZhdWx0LWNhc2VcclxuICAgICAgICAgICAgICAgIHN3aXRjaCAob2xkVmVyc2lvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGIuY3JlYXRlT2JqZWN0U3RvcmUoU1RPUkVfTkFNRSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KS5jYXRjaChlID0+IHtcclxuICAgICAgICAgICAgdGhyb3cgRVJST1JfRkFDVE9SWS5jcmVhdGUoXCJpZGItb3BlblwiIC8qIElEQl9PUEVOICovLCB7XHJcbiAgICAgICAgICAgICAgICBvcmlnaW5hbEVycm9yTWVzc2FnZTogZS5tZXNzYWdlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGRiUHJvbWlzZTtcclxufVxyXG5hc3luYyBmdW5jdGlvbiByZWFkSGVhcnRiZWF0c0Zyb21JbmRleGVkREIoYXBwKSB7XHJcbiAgICB2YXIgX2E7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IGRiID0gYXdhaXQgZ2V0RGJQcm9taXNlKCk7XHJcbiAgICAgICAgcmV0dXJuIGRiXHJcbiAgICAgICAgICAgIC50cmFuc2FjdGlvbihTVE9SRV9OQU1FKVxyXG4gICAgICAgICAgICAub2JqZWN0U3RvcmUoU1RPUkVfTkFNRSlcclxuICAgICAgICAgICAgLmdldChjb21wdXRlS2V5KGFwcCkpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICBpZiAoZSBpbnN0YW5jZW9mIEZpcmViYXNlRXJyb3IpIHtcclxuICAgICAgICAgICAgbG9nZ2VyLndhcm4oZS5tZXNzYWdlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGlkYkdldEVycm9yID0gRVJST1JfRkFDVE9SWS5jcmVhdGUoXCJpZGItZ2V0XCIgLyogSURCX0dFVCAqLywge1xyXG4gICAgICAgICAgICAgICAgb3JpZ2luYWxFcnJvck1lc3NhZ2U6IChfYSA9IGUpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5tZXNzYWdlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBsb2dnZXIud2FybihpZGJHZXRFcnJvci5tZXNzYWdlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuYXN5bmMgZnVuY3Rpb24gd3JpdGVIZWFydGJlYXRzVG9JbmRleGVkREIoYXBwLCBoZWFydGJlYXRPYmplY3QpIHtcclxuICAgIHZhciBfYTtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgZGIgPSBhd2FpdCBnZXREYlByb21pc2UoKTtcclxuICAgICAgICBjb25zdCB0eCA9IGRiLnRyYW5zYWN0aW9uKFNUT1JFX05BTUUsICdyZWFkd3JpdGUnKTtcclxuICAgICAgICBjb25zdCBvYmplY3RTdG9yZSA9IHR4Lm9iamVjdFN0b3JlKFNUT1JFX05BTUUpO1xyXG4gICAgICAgIGF3YWl0IG9iamVjdFN0b3JlLnB1dChoZWFydGJlYXRPYmplY3QsIGNvbXB1dGVLZXkoYXBwKSk7XHJcbiAgICAgICAgcmV0dXJuIHR4LmRvbmU7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgIGlmIChlIGluc3RhbmNlb2YgRmlyZWJhc2VFcnJvcikge1xyXG4gICAgICAgICAgICBsb2dnZXIud2FybihlLm1lc3NhZ2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgaWRiR2V0RXJyb3IgPSBFUlJPUl9GQUNUT1JZLmNyZWF0ZShcImlkYi1zZXRcIiAvKiBJREJfV1JJVEUgKi8sIHtcclxuICAgICAgICAgICAgICAgIG9yaWdpbmFsRXJyb3JNZXNzYWdlOiAoX2EgPSBlKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EubWVzc2FnZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgbG9nZ2VyLndhcm4oaWRiR2V0RXJyb3IubWVzc2FnZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIGNvbXB1dGVLZXkoYXBwKSB7XHJcbiAgICByZXR1cm4gYCR7YXBwLm5hbWV9ISR7YXBwLm9wdGlvbnMuYXBwSWR9YDtcclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMjEgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5jb25zdCBNQVhfSEVBREVSX0JZVEVTID0gMTAyNDtcclxuLy8gMzAgZGF5c1xyXG5jb25zdCBTVE9SRURfSEVBUlRCRUFUX1JFVEVOVElPTl9NQVhfTUlMTElTID0gMzAgKiAyNCAqIDYwICogNjAgKiAxMDAwO1xyXG5jbGFzcyBIZWFydGJlYXRTZXJ2aWNlSW1wbCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihjb250YWluZXIpIHtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBJbi1tZW1vcnkgY2FjaGUgZm9yIGhlYXJ0YmVhdHMsIHVzZWQgYnkgZ2V0SGVhcnRiZWF0c0hlYWRlcigpIHRvIGdlbmVyYXRlXHJcbiAgICAgICAgICogdGhlIGhlYWRlciBzdHJpbmcuXHJcbiAgICAgICAgICogU3RvcmVzIG9uZSByZWNvcmQgcGVyIGRhdGUuIFRoaXMgd2lsbCBiZSBjb25zb2xpZGF0ZWQgaW50byB0aGUgc3RhbmRhcmRcclxuICAgICAgICAgKiBmb3JtYXQgb2Ygb25lIHJlY29yZCBwZXIgdXNlciBhZ2VudCBzdHJpbmcgYmVmb3JlIGJlaW5nIHNlbnQgYXMgYSBoZWFkZXIuXHJcbiAgICAgICAgICogUG9wdWxhdGVkIGZyb20gaW5kZXhlZERCIHdoZW4gdGhlIGNvbnRyb2xsZXIgaXMgaW5zdGFudGlhdGVkIGFuZCBzaG91bGRcclxuICAgICAgICAgKiBiZSBrZXB0IGluIHN5bmMgd2l0aCBpbmRleGVkREIuXHJcbiAgICAgICAgICogTGVhdmUgcHVibGljIGZvciBlYXNpZXIgdGVzdGluZy5cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLl9oZWFydGJlYXRzQ2FjaGUgPSBudWxsO1xyXG4gICAgICAgIGNvbnN0IGFwcCA9IHRoaXMuY29udGFpbmVyLmdldFByb3ZpZGVyKCdhcHAnKS5nZXRJbW1lZGlhdGUoKTtcclxuICAgICAgICB0aGlzLl9zdG9yYWdlID0gbmV3IEhlYXJ0YmVhdFN0b3JhZ2VJbXBsKGFwcCk7XHJcbiAgICAgICAgdGhpcy5faGVhcnRiZWF0c0NhY2hlUHJvbWlzZSA9IHRoaXMuX3N0b3JhZ2UucmVhZCgpLnRoZW4ocmVzdWx0ID0+IHtcclxuICAgICAgICAgICAgdGhpcy5faGVhcnRiZWF0c0NhY2hlID0gcmVzdWx0O1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBDYWxsZWQgdG8gcmVwb3J0IGEgaGVhcnRiZWF0LiBUaGUgZnVuY3Rpb24gd2lsbCBnZW5lcmF0ZVxyXG4gICAgICogYSBIZWFydGJlYXRzQnlVc2VyQWdlbnQgb2JqZWN0LCB1cGRhdGUgaGVhcnRiZWF0c0NhY2hlLCBhbmQgcGVyc2lzdCBpdFxyXG4gICAgICogdG8gSW5kZXhlZERCLlxyXG4gICAgICogTm90ZSB0aGF0IHdlIG9ubHkgc3RvcmUgb25lIGhlYXJ0YmVhdCBwZXIgZGF5LiBTbyBpZiBhIGhlYXJ0YmVhdCBmb3IgdG9kYXkgaXNcclxuICAgICAqIGFscmVhZHkgbG9nZ2VkLCBzdWJzZXF1ZW50IGNhbGxzIHRvIHRoaXMgZnVuY3Rpb24gaW4gdGhlIHNhbWUgZGF5IHdpbGwgYmUgaWdub3JlZC5cclxuICAgICAqL1xyXG4gICAgYXN5bmMgdHJpZ2dlckhlYXJ0YmVhdCgpIHtcclxuICAgICAgICBjb25zdCBwbGF0Zm9ybUxvZ2dlciA9IHRoaXMuY29udGFpbmVyXHJcbiAgICAgICAgICAgIC5nZXRQcm92aWRlcigncGxhdGZvcm0tbG9nZ2VyJylcclxuICAgICAgICAgICAgLmdldEltbWVkaWF0ZSgpO1xyXG4gICAgICAgIC8vIFRoaXMgaXMgdGhlIFwiRmlyZWJhc2UgdXNlciBhZ2VudFwiIHN0cmluZyBmcm9tIHRoZSBwbGF0Zm9ybSBsb2dnZXJcclxuICAgICAgICAvLyBzZXJ2aWNlLCBub3QgdGhlIGJyb3dzZXIgdXNlciBhZ2VudC5cclxuICAgICAgICBjb25zdCBhZ2VudCA9IHBsYXRmb3JtTG9nZ2VyLmdldFBsYXRmb3JtSW5mb1N0cmluZygpO1xyXG4gICAgICAgIGNvbnN0IGRhdGUgPSBnZXRVVENEYXRlU3RyaW5nKCk7XHJcbiAgICAgICAgaWYgKHRoaXMuX2hlYXJ0YmVhdHNDYWNoZSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLl9oZWFydGJlYXRzQ2FjaGUgPSBhd2FpdCB0aGlzLl9oZWFydGJlYXRzQ2FjaGVQcm9taXNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBEbyBub3Qgc3RvcmUgYSBoZWFydGJlYXQgaWYgb25lIGlzIGFscmVhZHkgc3RvcmVkIGZvciB0aGlzIGRheVxyXG4gICAgICAgIC8vIG9yIGlmIGEgaGVhZGVyIGhhcyBhbHJlYWR5IGJlZW4gc2VudCB0b2RheS5cclxuICAgICAgICBpZiAodGhpcy5faGVhcnRiZWF0c0NhY2hlLmxhc3RTZW50SGVhcnRiZWF0RGF0ZSA9PT0gZGF0ZSB8fFxyXG4gICAgICAgICAgICB0aGlzLl9oZWFydGJlYXRzQ2FjaGUuaGVhcnRiZWF0cy5zb21lKHNpbmdsZURhdGVIZWFydGJlYXQgPT4gc2luZ2xlRGF0ZUhlYXJ0YmVhdC5kYXRlID09PSBkYXRlKSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBUaGVyZSBpcyBubyBlbnRyeSBmb3IgdGhpcyBkYXRlLiBDcmVhdGUgb25lLlxyXG4gICAgICAgICAgICB0aGlzLl9oZWFydGJlYXRzQ2FjaGUuaGVhcnRiZWF0cy5wdXNoKHsgZGF0ZSwgYWdlbnQgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIFJlbW92ZSBlbnRyaWVzIG9sZGVyIHRoYW4gMzAgZGF5cy5cclxuICAgICAgICB0aGlzLl9oZWFydGJlYXRzQ2FjaGUuaGVhcnRiZWF0cyA9IHRoaXMuX2hlYXJ0YmVhdHNDYWNoZS5oZWFydGJlYXRzLmZpbHRlcihzaW5nbGVEYXRlSGVhcnRiZWF0ID0+IHtcclxuICAgICAgICAgICAgY29uc3QgaGJUaW1lc3RhbXAgPSBuZXcgRGF0ZShzaW5nbGVEYXRlSGVhcnRiZWF0LmRhdGUpLnZhbHVlT2YoKTtcclxuICAgICAgICAgICAgY29uc3Qgbm93ID0gRGF0ZS5ub3coKTtcclxuICAgICAgICAgICAgcmV0dXJuIG5vdyAtIGhiVGltZXN0YW1wIDw9IFNUT1JFRF9IRUFSVEJFQVRfUkVURU5USU9OX01BWF9NSUxMSVM7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N0b3JhZ2Uub3ZlcndyaXRlKHRoaXMuX2hlYXJ0YmVhdHNDYWNoZSk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYSBiYXNlNjQgZW5jb2RlZCBzdHJpbmcgd2hpY2ggY2FuIGJlIGF0dGFjaGVkIHRvIHRoZSBoZWFydGJlYXQtc3BlY2lmaWMgaGVhZGVyIGRpcmVjdGx5LlxyXG4gICAgICogSXQgYWxzbyBjbGVhcnMgYWxsIGhlYXJ0YmVhdHMgZnJvbSBtZW1vcnkgYXMgd2VsbCBhcyBpbiBJbmRleGVkREIuXHJcbiAgICAgKlxyXG4gICAgICogTk9URTogQ29uc3VtaW5nIHByb2R1Y3QgU0RLcyBzaG91bGQgbm90IHNlbmQgdGhlIGhlYWRlciBpZiB0aGlzIG1ldGhvZFxyXG4gICAgICogcmV0dXJucyBhbiBlbXB0eSBzdHJpbmcuXHJcbiAgICAgKi9cclxuICAgIGFzeW5jIGdldEhlYXJ0YmVhdHNIZWFkZXIoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2hlYXJ0YmVhdHNDYWNoZSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICBhd2FpdCB0aGlzLl9oZWFydGJlYXRzQ2FjaGVQcm9taXNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBJZiBpdCdzIHN0aWxsIG51bGwgb3IgdGhlIGFycmF5IGlzIGVtcHR5LCB0aGVyZSBpcyBubyBkYXRhIHRvIHNlbmQuXHJcbiAgICAgICAgaWYgKHRoaXMuX2hlYXJ0YmVhdHNDYWNoZSA9PT0gbnVsbCB8fFxyXG4gICAgICAgICAgICB0aGlzLl9oZWFydGJlYXRzQ2FjaGUuaGVhcnRiZWF0cy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuICcnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBkYXRlID0gZ2V0VVRDRGF0ZVN0cmluZygpO1xyXG4gICAgICAgIC8vIEV4dHJhY3QgYXMgbWFueSBoZWFydGJlYXRzIGZyb20gdGhlIGNhY2hlIGFzIHdpbGwgZml0IHVuZGVyIHRoZSBzaXplIGxpbWl0LlxyXG4gICAgICAgIGNvbnN0IHsgaGVhcnRiZWF0c1RvU2VuZCwgdW5zZW50RW50cmllcyB9ID0gZXh0cmFjdEhlYXJ0YmVhdHNGb3JIZWFkZXIodGhpcy5faGVhcnRiZWF0c0NhY2hlLmhlYXJ0YmVhdHMpO1xyXG4gICAgICAgIGNvbnN0IGhlYWRlclN0cmluZyA9IGJhc2U2NHVybEVuY29kZVdpdGhvdXRQYWRkaW5nKEpTT04uc3RyaW5naWZ5KHsgdmVyc2lvbjogMiwgaGVhcnRiZWF0czogaGVhcnRiZWF0c1RvU2VuZCB9KSk7XHJcbiAgICAgICAgLy8gU3RvcmUgbGFzdCBzZW50IGRhdGUgdG8gcHJldmVudCBhbm90aGVyIGJlaW5nIGxvZ2dlZC9zZW50IGZvciB0aGUgc2FtZSBkYXkuXHJcbiAgICAgICAgdGhpcy5faGVhcnRiZWF0c0NhY2hlLmxhc3RTZW50SGVhcnRiZWF0RGF0ZSA9IGRhdGU7XHJcbiAgICAgICAgaWYgKHVuc2VudEVudHJpZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAvLyBTdG9yZSBhbnkgdW5zZW50IGVudHJpZXMgaWYgdGhleSBleGlzdC5cclxuICAgICAgICAgICAgdGhpcy5faGVhcnRiZWF0c0NhY2hlLmhlYXJ0YmVhdHMgPSB1bnNlbnRFbnRyaWVzO1xyXG4gICAgICAgICAgICAvLyBUaGlzIHNlZW1zIG1vcmUgbGlrZWx5IHRoYW4gZW1wdHlpbmcgdGhlIGFycmF5IChiZWxvdykgdG8gbGVhZCB0byBzb21lIG9kZCBzdGF0ZVxyXG4gICAgICAgICAgICAvLyBzaW5jZSB0aGUgY2FjaGUgaXNuJ3QgZW1wdHkgYW5kIHRoaXMgd2lsbCBiZSBjYWxsZWQgYWdhaW4gb24gdGhlIG5leHQgcmVxdWVzdCxcclxuICAgICAgICAgICAgLy8gYW5kIGlzIHByb2JhYmx5IHNhZmVzdCBpZiB3ZSBhd2FpdCBpdC5cclxuICAgICAgICAgICAgYXdhaXQgdGhpcy5fc3RvcmFnZS5vdmVyd3JpdGUodGhpcy5faGVhcnRiZWF0c0NhY2hlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2hlYXJ0YmVhdHNDYWNoZS5oZWFydGJlYXRzID0gW107XHJcbiAgICAgICAgICAgIC8vIERvIG5vdCB3YWl0IGZvciB0aGlzLCB0byByZWR1Y2UgbGF0ZW5jeS5cclxuICAgICAgICAgICAgdm9pZCB0aGlzLl9zdG9yYWdlLm92ZXJ3cml0ZSh0aGlzLl9oZWFydGJlYXRzQ2FjaGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gaGVhZGVyU3RyaW5nO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIGdldFVUQ0RhdGVTdHJpbmcoKSB7XHJcbiAgICBjb25zdCB0b2RheSA9IG5ldyBEYXRlKCk7XHJcbiAgICAvLyBSZXR1cm5zIGRhdGUgZm9ybWF0ICdZWVlZLU1NLUREJ1xyXG4gICAgcmV0dXJuIHRvZGF5LnRvSVNPU3RyaW5nKCkuc3Vic3RyaW5nKDAsIDEwKTtcclxufVxyXG5mdW5jdGlvbiBleHRyYWN0SGVhcnRiZWF0c0ZvckhlYWRlcihoZWFydGJlYXRzQ2FjaGUsIG1heFNpemUgPSBNQVhfSEVBREVSX0JZVEVTKSB7XHJcbiAgICAvLyBIZWFydGJlYXRzIGdyb3VwZWQgYnkgdXNlciBhZ2VudCBpbiB0aGUgc3RhbmRhcmQgZm9ybWF0IHRvIGJlIHNlbnQgaW5cclxuICAgIC8vIHRoZSBoZWFkZXIuXHJcbiAgICBjb25zdCBoZWFydGJlYXRzVG9TZW5kID0gW107XHJcbiAgICAvLyBTaW5nbGUgZGF0ZSBmb3JtYXQgaGVhcnRiZWF0cyB0aGF0IGFyZSBub3Qgc2VudC5cclxuICAgIGxldCB1bnNlbnRFbnRyaWVzID0gaGVhcnRiZWF0c0NhY2hlLnNsaWNlKCk7XHJcbiAgICBmb3IgKGNvbnN0IHNpbmdsZURhdGVIZWFydGJlYXQgb2YgaGVhcnRiZWF0c0NhY2hlKSB7XHJcbiAgICAgICAgLy8gTG9vayBmb3IgYW4gZXhpc3RpbmcgZW50cnkgd2l0aCB0aGUgc2FtZSB1c2VyIGFnZW50LlxyXG4gICAgICAgIGNvbnN0IGhlYXJ0YmVhdEVudHJ5ID0gaGVhcnRiZWF0c1RvU2VuZC5maW5kKGhiID0+IGhiLmFnZW50ID09PSBzaW5nbGVEYXRlSGVhcnRiZWF0LmFnZW50KTtcclxuICAgICAgICBpZiAoIWhlYXJ0YmVhdEVudHJ5KSB7XHJcbiAgICAgICAgICAgIC8vIElmIG5vIGVudHJ5IGZvciB0aGlzIHVzZXIgYWdlbnQgZXhpc3RzLCBjcmVhdGUgb25lLlxyXG4gICAgICAgICAgICBoZWFydGJlYXRzVG9TZW5kLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgYWdlbnQ6IHNpbmdsZURhdGVIZWFydGJlYXQuYWdlbnQsXHJcbiAgICAgICAgICAgICAgICBkYXRlczogW3NpbmdsZURhdGVIZWFydGJlYXQuZGF0ZV1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGlmIChjb3VudEJ5dGVzKGhlYXJ0YmVhdHNUb1NlbmQpID4gbWF4U2l6ZSkge1xyXG4gICAgICAgICAgICAgICAgLy8gSWYgdGhlIGhlYWRlciB3b3VsZCBleGNlZWQgbWF4IHNpemUsIHJlbW92ZSB0aGUgYWRkZWQgaGVhcnRiZWF0XHJcbiAgICAgICAgICAgICAgICAvLyBlbnRyeSBhbmQgc3RvcCBhZGRpbmcgdG8gdGhlIGhlYWRlci5cclxuICAgICAgICAgICAgICAgIGhlYXJ0YmVhdHNUb1NlbmQucG9wKCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaGVhcnRiZWF0RW50cnkuZGF0ZXMucHVzaChzaW5nbGVEYXRlSGVhcnRiZWF0LmRhdGUpO1xyXG4gICAgICAgICAgICAvLyBJZiB0aGUgaGVhZGVyIHdvdWxkIGV4Y2VlZCBtYXggc2l6ZSwgcmVtb3ZlIHRoZSBhZGRlZCBkYXRlXHJcbiAgICAgICAgICAgIC8vIGFuZCBzdG9wIGFkZGluZyB0byB0aGUgaGVhZGVyLlxyXG4gICAgICAgICAgICBpZiAoY291bnRCeXRlcyhoZWFydGJlYXRzVG9TZW5kKSA+IG1heFNpemUpIHtcclxuICAgICAgICAgICAgICAgIGhlYXJ0YmVhdEVudHJ5LmRhdGVzLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gUG9wIHVuc2VudCBlbnRyeSBmcm9tIHF1ZXVlLiAoU2tpcHBlZCBpZiBhZGRpbmcgdGhlIGVudHJ5IGV4Y2VlZGVkXHJcbiAgICAgICAgLy8gcXVvdGEgYW5kIHRoZSBsb29wIGJyZWFrcyBlYXJseS4pXHJcbiAgICAgICAgdW5zZW50RW50cmllcyA9IHVuc2VudEVudHJpZXMuc2xpY2UoMSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGhlYXJ0YmVhdHNUb1NlbmQsXHJcbiAgICAgICAgdW5zZW50RW50cmllc1xyXG4gICAgfTtcclxufVxyXG5jbGFzcyBIZWFydGJlYXRTdG9yYWdlSW1wbCB7XHJcbiAgICBjb25zdHJ1Y3RvcihhcHApIHtcclxuICAgICAgICB0aGlzLmFwcCA9IGFwcDtcclxuICAgICAgICB0aGlzLl9jYW5Vc2VJbmRleGVkREJQcm9taXNlID0gdGhpcy5ydW5JbmRleGVkREJFbnZpcm9ubWVudENoZWNrKCk7XHJcbiAgICB9XHJcbiAgICBhc3luYyBydW5JbmRleGVkREJFbnZpcm9ubWVudENoZWNrKCkge1xyXG4gICAgICAgIGlmICghaXNJbmRleGVkREJBdmFpbGFibGUoKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gdmFsaWRhdGVJbmRleGVkREJPcGVuYWJsZSgpXHJcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB0cnVlKVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKCgpID0+IGZhbHNlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFJlYWQgYWxsIGhlYXJ0YmVhdHMuXHJcbiAgICAgKi9cclxuICAgIGFzeW5jIHJlYWQoKSB7XHJcbiAgICAgICAgY29uc3QgY2FuVXNlSW5kZXhlZERCID0gYXdhaXQgdGhpcy5fY2FuVXNlSW5kZXhlZERCUHJvbWlzZTtcclxuICAgICAgICBpZiAoIWNhblVzZUluZGV4ZWREQikge1xyXG4gICAgICAgICAgICByZXR1cm4geyBoZWFydGJlYXRzOiBbXSB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgaWRiSGVhcnRiZWF0T2JqZWN0ID0gYXdhaXQgcmVhZEhlYXJ0YmVhdHNGcm9tSW5kZXhlZERCKHRoaXMuYXBwKTtcclxuICAgICAgICAgICAgcmV0dXJuIGlkYkhlYXJ0YmVhdE9iamVjdCB8fCB7IGhlYXJ0YmVhdHM6IFtdIH07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8gb3ZlcndyaXRlIHRoZSBzdG9yYWdlIHdpdGggdGhlIHByb3ZpZGVkIGhlYXJ0YmVhdHNcclxuICAgIGFzeW5jIG92ZXJ3cml0ZShoZWFydGJlYXRzT2JqZWN0KSB7XHJcbiAgICAgICAgdmFyIF9hO1xyXG4gICAgICAgIGNvbnN0IGNhblVzZUluZGV4ZWREQiA9IGF3YWl0IHRoaXMuX2NhblVzZUluZGV4ZWREQlByb21pc2U7XHJcbiAgICAgICAgaWYgKCFjYW5Vc2VJbmRleGVkREIpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgZXhpc3RpbmdIZWFydGJlYXRzT2JqZWN0ID0gYXdhaXQgdGhpcy5yZWFkKCk7XHJcbiAgICAgICAgICAgIHJldHVybiB3cml0ZUhlYXJ0YmVhdHNUb0luZGV4ZWREQih0aGlzLmFwcCwge1xyXG4gICAgICAgICAgICAgICAgbGFzdFNlbnRIZWFydGJlYXREYXRlOiAoX2EgPSBoZWFydGJlYXRzT2JqZWN0Lmxhc3RTZW50SGVhcnRiZWF0RGF0ZSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogZXhpc3RpbmdIZWFydGJlYXRzT2JqZWN0Lmxhc3RTZW50SGVhcnRiZWF0RGF0ZSxcclxuICAgICAgICAgICAgICAgIGhlYXJ0YmVhdHM6IGhlYXJ0YmVhdHNPYmplY3QuaGVhcnRiZWF0c1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyBhZGQgaGVhcnRiZWF0c1xyXG4gICAgYXN5bmMgYWRkKGhlYXJ0YmVhdHNPYmplY3QpIHtcclxuICAgICAgICB2YXIgX2E7XHJcbiAgICAgICAgY29uc3QgY2FuVXNlSW5kZXhlZERCID0gYXdhaXQgdGhpcy5fY2FuVXNlSW5kZXhlZERCUHJvbWlzZTtcclxuICAgICAgICBpZiAoIWNhblVzZUluZGV4ZWREQikge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCBleGlzdGluZ0hlYXJ0YmVhdHNPYmplY3QgPSBhd2FpdCB0aGlzLnJlYWQoKTtcclxuICAgICAgICAgICAgcmV0dXJuIHdyaXRlSGVhcnRiZWF0c1RvSW5kZXhlZERCKHRoaXMuYXBwLCB7XHJcbiAgICAgICAgICAgICAgICBsYXN0U2VudEhlYXJ0YmVhdERhdGU6IChfYSA9IGhlYXJ0YmVhdHNPYmplY3QubGFzdFNlbnRIZWFydGJlYXREYXRlKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBleGlzdGluZ0hlYXJ0YmVhdHNPYmplY3QubGFzdFNlbnRIZWFydGJlYXREYXRlLFxyXG4gICAgICAgICAgICAgICAgaGVhcnRiZWF0czogW1xyXG4gICAgICAgICAgICAgICAgICAgIC4uLmV4aXN0aW5nSGVhcnRiZWF0c09iamVjdC5oZWFydGJlYXRzLFxyXG4gICAgICAgICAgICAgICAgICAgIC4uLmhlYXJ0YmVhdHNPYmplY3QuaGVhcnRiZWF0c1xyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuLyoqXHJcbiAqIENhbGN1bGF0ZSBieXRlcyBvZiBhIEhlYXJ0YmVhdHNCeVVzZXJBZ2VudCBhcnJheSBhZnRlciBiZWluZyB3cmFwcGVkXHJcbiAqIGluIGEgcGxhdGZvcm0gbG9nZ2luZyBoZWFkZXIgSlNPTiBvYmplY3QsIHN0cmluZ2lmaWVkLCBhbmQgY29udmVydGVkXHJcbiAqIHRvIGJhc2UgNjQuXHJcbiAqL1xyXG5mdW5jdGlvbiBjb3VudEJ5dGVzKGhlYXJ0YmVhdHNDYWNoZSkge1xyXG4gICAgLy8gYmFzZTY0IGhhcyBhIHJlc3RyaWN0ZWQgc2V0IG9mIGNoYXJhY3RlcnMsIGFsbCBvZiB3aGljaCBzaG91bGQgYmUgMSBieXRlLlxyXG4gICAgcmV0dXJuIGJhc2U2NHVybEVuY29kZVdpdGhvdXRQYWRkaW5nKFxyXG4gICAgLy8gaGVhcnRiZWF0c0NhY2hlIHdyYXBwZXIgcHJvcGVydGllc1xyXG4gICAgSlNPTi5zdHJpbmdpZnkoeyB2ZXJzaW9uOiAyLCBoZWFydGJlYXRzOiBoZWFydGJlYXRzQ2FjaGUgfSkpLmxlbmd0aDtcclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5mdW5jdGlvbiByZWdpc3RlckNvcmVDb21wb25lbnRzKHZhcmlhbnQpIHtcclxuICAgIF9yZWdpc3RlckNvbXBvbmVudChuZXcgQ29tcG9uZW50KCdwbGF0Zm9ybS1sb2dnZXInLCBjb250YWluZXIgPT4gbmV3IFBsYXRmb3JtTG9nZ2VyU2VydmljZUltcGwoY29udGFpbmVyKSwgXCJQUklWQVRFXCIgLyogUFJJVkFURSAqLykpO1xyXG4gICAgX3JlZ2lzdGVyQ29tcG9uZW50KG5ldyBDb21wb25lbnQoJ2hlYXJ0YmVhdCcsIGNvbnRhaW5lciA9PiBuZXcgSGVhcnRiZWF0U2VydmljZUltcGwoY29udGFpbmVyKSwgXCJQUklWQVRFXCIgLyogUFJJVkFURSAqLykpO1xyXG4gICAgLy8gUmVnaXN0ZXIgYGFwcGAgcGFja2FnZS5cclxuICAgIHJlZ2lzdGVyVmVyc2lvbihuYW1lJG8sIHZlcnNpb24kMSwgdmFyaWFudCk7XHJcbiAgICAvLyBCVUlMRF9UQVJHRVQgd2lsbCBiZSByZXBsYWNlZCBieSB2YWx1ZXMgbGlrZSBlc201LCBlc20yMDE3LCBjanM1LCBldGMgZHVyaW5nIHRoZSBjb21waWxhdGlvblxyXG4gICAgcmVnaXN0ZXJWZXJzaW9uKG5hbWUkbywgdmVyc2lvbiQxLCAnZXNtMjAxNycpO1xyXG4gICAgLy8gUmVnaXN0ZXIgcGxhdGZvcm0gU0RLIGlkZW50aWZpZXIgKG5vIHZlcnNpb24pLlxyXG4gICAgcmVnaXN0ZXJWZXJzaW9uKCdmaXJlLWpzJywgJycpO1xyXG59XG5cbi8qKlxyXG4gKiBGaXJlYmFzZSBBcHBcclxuICpcclxuICogQHJlbWFya3MgVGhpcyBwYWNrYWdlIGNvb3JkaW5hdGVzIHRoZSBjb21tdW5pY2F0aW9uIGJldHdlZW4gdGhlIGRpZmZlcmVudCBGaXJlYmFzZSBjb21wb25lbnRzXHJcbiAqIEBwYWNrYWdlRG9jdW1lbnRhdGlvblxyXG4gKi9cclxucmVnaXN0ZXJDb3JlQ29tcG9uZW50cygnJyk7XG5cbmV4cG9ydCB7IFNES19WRVJTSU9OLCBERUZBVUxUX0VOVFJZX05BTUUgYXMgX0RFRkFVTFRfRU5UUllfTkFNRSwgX2FkZENvbXBvbmVudCwgX2FkZE9yT3ZlcndyaXRlQ29tcG9uZW50LCBfYXBwcywgX2NsZWFyQ29tcG9uZW50cywgX2NvbXBvbmVudHMsIF9nZXRQcm92aWRlciwgX3JlZ2lzdGVyQ29tcG9uZW50LCBfcmVtb3ZlU2VydmljZUluc3RhbmNlLCBkZWxldGVBcHAsIGdldEFwcCwgZ2V0QXBwcywgaW5pdGlhbGl6ZUFwcCwgb25Mb2csIHJlZ2lzdGVyVmVyc2lvbiwgc2V0TG9nTGV2ZWwgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmVzbTIwMTcuanMubWFwXG4iLCJpbXBvcnQgeyBnZXRBcHAsIF9nZXRQcm92aWRlciwgX3JlZ2lzdGVyQ29tcG9uZW50LCByZWdpc3RlclZlcnNpb24gfSBmcm9tICdAZmlyZWJhc2UvYXBwJztcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJ0BmaXJlYmFzZS9jb21wb25lbnQnO1xuaW1wb3J0IHsgRXJyb3JGYWN0b3J5LCBGaXJlYmFzZUVycm9yIH0gZnJvbSAnQGZpcmViYXNlL3V0aWwnO1xuaW1wb3J0IHsgb3BlbkRCIH0gZnJvbSAnaWRiJztcblxuY29uc3QgbmFtZSA9IFwiQGZpcmViYXNlL2luc3RhbGxhdGlvbnNcIjtcbmNvbnN0IHZlcnNpb24gPSBcIjAuNS4xNVwiO1xuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5jb25zdCBQRU5ESU5HX1RJTUVPVVRfTVMgPSAxMDAwMDtcclxuY29uc3QgUEFDS0FHRV9WRVJTSU9OID0gYHc6JHt2ZXJzaW9ufWA7XHJcbmNvbnN0IElOVEVSTkFMX0FVVEhfVkVSU0lPTiA9ICdGSVNfdjInO1xyXG5jb25zdCBJTlNUQUxMQVRJT05TX0FQSV9VUkwgPSAnaHR0cHM6Ly9maXJlYmFzZWluc3RhbGxhdGlvbnMuZ29vZ2xlYXBpcy5jb20vdjEnO1xyXG5jb25zdCBUT0tFTl9FWFBJUkFUSU9OX0JVRkZFUiA9IDYwICogNjAgKiAxMDAwOyAvLyBPbmUgaG91clxyXG5jb25zdCBTRVJWSUNFID0gJ2luc3RhbGxhdGlvbnMnO1xyXG5jb25zdCBTRVJWSUNFX05BTUUgPSAnSW5zdGFsbGF0aW9ucyc7XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbmNvbnN0IEVSUk9SX0RFU0NSSVBUSU9OX01BUCA9IHtcclxuICAgIFtcIm1pc3NpbmctYXBwLWNvbmZpZy12YWx1ZXNcIiAvKiBNSVNTSU5HX0FQUF9DT05GSUdfVkFMVUVTICovXTogJ01pc3NpbmcgQXBwIGNvbmZpZ3VyYXRpb24gdmFsdWU6IFwieyR2YWx1ZU5hbWV9XCInLFxyXG4gICAgW1wibm90LXJlZ2lzdGVyZWRcIiAvKiBOT1RfUkVHSVNURVJFRCAqL106ICdGaXJlYmFzZSBJbnN0YWxsYXRpb24gaXMgbm90IHJlZ2lzdGVyZWQuJyxcclxuICAgIFtcImluc3RhbGxhdGlvbi1ub3QtZm91bmRcIiAvKiBJTlNUQUxMQVRJT05fTk9UX0ZPVU5EICovXTogJ0ZpcmViYXNlIEluc3RhbGxhdGlvbiBub3QgZm91bmQuJyxcclxuICAgIFtcInJlcXVlc3QtZmFpbGVkXCIgLyogUkVRVUVTVF9GQUlMRUQgKi9dOiAneyRyZXF1ZXN0TmFtZX0gcmVxdWVzdCBmYWlsZWQgd2l0aCBlcnJvciBcInskc2VydmVyQ29kZX0geyRzZXJ2ZXJTdGF0dXN9OiB7JHNlcnZlck1lc3NhZ2V9XCInLFxyXG4gICAgW1wiYXBwLW9mZmxpbmVcIiAvKiBBUFBfT0ZGTElORSAqL106ICdDb3VsZCBub3QgcHJvY2VzcyByZXF1ZXN0LiBBcHBsaWNhdGlvbiBvZmZsaW5lLicsXHJcbiAgICBbXCJkZWxldGUtcGVuZGluZy1yZWdpc3RyYXRpb25cIiAvKiBERUxFVEVfUEVORElOR19SRUdJU1RSQVRJT04gKi9dOiBcIkNhbid0IGRlbGV0ZSBpbnN0YWxsYXRpb24gd2hpbGUgdGhlcmUgaXMgYSBwZW5kaW5nIHJlZ2lzdHJhdGlvbiByZXF1ZXN0LlwiXHJcbn07XHJcbmNvbnN0IEVSUk9SX0ZBQ1RPUlkgPSBuZXcgRXJyb3JGYWN0b3J5KFNFUlZJQ0UsIFNFUlZJQ0VfTkFNRSwgRVJST1JfREVTQ1JJUFRJT05fTUFQKTtcclxuLyoqIFJldHVybnMgdHJ1ZSBpZiBlcnJvciBpcyBhIEZpcmViYXNlRXJyb3IgdGhhdCBpcyBiYXNlZCBvbiBhbiBlcnJvciBmcm9tIHRoZSBzZXJ2ZXIuICovXHJcbmZ1bmN0aW9uIGlzU2VydmVyRXJyb3IoZXJyb3IpIHtcclxuICAgIHJldHVybiAoZXJyb3IgaW5zdGFuY2VvZiBGaXJlYmFzZUVycm9yICYmXHJcbiAgICAgICAgZXJyb3IuY29kZS5pbmNsdWRlcyhcInJlcXVlc3QtZmFpbGVkXCIgLyogUkVRVUVTVF9GQUlMRUQgKi8pKTtcclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRJbnN0YWxsYXRpb25zRW5kcG9pbnQoeyBwcm9qZWN0SWQgfSkge1xyXG4gICAgcmV0dXJuIGAke0lOU1RBTExBVElPTlNfQVBJX1VSTH0vcHJvamVjdHMvJHtwcm9qZWN0SWR9L2luc3RhbGxhdGlvbnNgO1xyXG59XHJcbmZ1bmN0aW9uIGV4dHJhY3RBdXRoVG9rZW5JbmZvRnJvbVJlc3BvbnNlKHJlc3BvbnNlKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHRva2VuOiByZXNwb25zZS50b2tlbixcclxuICAgICAgICByZXF1ZXN0U3RhdHVzOiAyIC8qIENPTVBMRVRFRCAqLyxcclxuICAgICAgICBleHBpcmVzSW46IGdldEV4cGlyZXNJbkZyb21SZXNwb25zZUV4cGlyZXNJbihyZXNwb25zZS5leHBpcmVzSW4pLFxyXG4gICAgICAgIGNyZWF0aW9uVGltZTogRGF0ZS5ub3coKVxyXG4gICAgfTtcclxufVxyXG5hc3luYyBmdW5jdGlvbiBnZXRFcnJvckZyb21SZXNwb25zZShyZXF1ZXN0TmFtZSwgcmVzcG9uc2UpIHtcclxuICAgIGNvbnN0IHJlc3BvbnNlSnNvbiA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuICAgIGNvbnN0IGVycm9yRGF0YSA9IHJlc3BvbnNlSnNvbi5lcnJvcjtcclxuICAgIHJldHVybiBFUlJPUl9GQUNUT1JZLmNyZWF0ZShcInJlcXVlc3QtZmFpbGVkXCIgLyogUkVRVUVTVF9GQUlMRUQgKi8sIHtcclxuICAgICAgICByZXF1ZXN0TmFtZSxcclxuICAgICAgICBzZXJ2ZXJDb2RlOiBlcnJvckRhdGEuY29kZSxcclxuICAgICAgICBzZXJ2ZXJNZXNzYWdlOiBlcnJvckRhdGEubWVzc2FnZSxcclxuICAgICAgICBzZXJ2ZXJTdGF0dXM6IGVycm9yRGF0YS5zdGF0dXNcclxuICAgIH0pO1xyXG59XHJcbmZ1bmN0aW9uIGdldEhlYWRlcnMoeyBhcGlLZXkgfSkge1xyXG4gICAgcmV0dXJuIG5ldyBIZWFkZXJzKHtcclxuICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxyXG4gICAgICAgIEFjY2VwdDogJ2FwcGxpY2F0aW9uL2pzb24nLFxyXG4gICAgICAgICd4LWdvb2ctYXBpLWtleSc6IGFwaUtleVxyXG4gICAgfSk7XHJcbn1cclxuZnVuY3Rpb24gZ2V0SGVhZGVyc1dpdGhBdXRoKGFwcENvbmZpZywgeyByZWZyZXNoVG9rZW4gfSkge1xyXG4gICAgY29uc3QgaGVhZGVycyA9IGdldEhlYWRlcnMoYXBwQ29uZmlnKTtcclxuICAgIGhlYWRlcnMuYXBwZW5kKCdBdXRob3JpemF0aW9uJywgZ2V0QXV0aG9yaXphdGlvbkhlYWRlcihyZWZyZXNoVG9rZW4pKTtcclxuICAgIHJldHVybiBoZWFkZXJzO1xyXG59XHJcbi8qKlxyXG4gKiBDYWxscyB0aGUgcGFzc2VkIGluIGZldGNoIHdyYXBwZXIgYW5kIHJldHVybnMgdGhlIHJlc3BvbnNlLlxyXG4gKiBJZiB0aGUgcmV0dXJuZWQgcmVzcG9uc2UgaGFzIGEgc3RhdHVzIG9mIDV4eCwgcmUtcnVucyB0aGUgZnVuY3Rpb24gb25jZSBhbmRcclxuICogcmV0dXJucyB0aGUgcmVzcG9uc2UuXHJcbiAqL1xyXG5hc3luYyBmdW5jdGlvbiByZXRyeUlmU2VydmVyRXJyb3IoZm4pIHtcclxuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGZuKCk7XHJcbiAgICBpZiAocmVzdWx0LnN0YXR1cyA+PSA1MDAgJiYgcmVzdWx0LnN0YXR1cyA8IDYwMCkge1xyXG4gICAgICAgIC8vIEludGVybmFsIFNlcnZlciBFcnJvci4gUmV0cnkgcmVxdWVzdC5cclxuICAgICAgICByZXR1cm4gZm4oKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuZnVuY3Rpb24gZ2V0RXhwaXJlc0luRnJvbVJlc3BvbnNlRXhwaXJlc0luKHJlc3BvbnNlRXhwaXJlc0luKSB7XHJcbiAgICAvLyBUaGlzIHdvcmtzIGJlY2F1c2UgdGhlIHNlcnZlciB3aWxsIG5ldmVyIHJlc3BvbmQgd2l0aCBmcmFjdGlvbnMgb2YgYSBzZWNvbmQuXHJcbiAgICByZXR1cm4gTnVtYmVyKHJlc3BvbnNlRXhwaXJlc0luLnJlcGxhY2UoJ3MnLCAnMDAwJykpO1xyXG59XHJcbmZ1bmN0aW9uIGdldEF1dGhvcml6YXRpb25IZWFkZXIocmVmcmVzaFRva2VuKSB7XHJcbiAgICByZXR1cm4gYCR7SU5URVJOQUxfQVVUSF9WRVJTSU9OfSAke3JlZnJlc2hUb2tlbn1gO1xyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbmFzeW5jIGZ1bmN0aW9uIGNyZWF0ZUluc3RhbGxhdGlvblJlcXVlc3QoeyBhcHBDb25maWcsIGhlYXJ0YmVhdFNlcnZpY2VQcm92aWRlciB9LCB7IGZpZCB9KSB7XHJcbiAgICBjb25zdCBlbmRwb2ludCA9IGdldEluc3RhbGxhdGlvbnNFbmRwb2ludChhcHBDb25maWcpO1xyXG4gICAgY29uc3QgaGVhZGVycyA9IGdldEhlYWRlcnMoYXBwQ29uZmlnKTtcclxuICAgIC8vIElmIGhlYXJ0YmVhdCBzZXJ2aWNlIGV4aXN0cywgYWRkIHRoZSBoZWFydGJlYXQgc3RyaW5nIHRvIHRoZSBoZWFkZXIuXHJcbiAgICBjb25zdCBoZWFydGJlYXRTZXJ2aWNlID0gaGVhcnRiZWF0U2VydmljZVByb3ZpZGVyLmdldEltbWVkaWF0ZSh7XHJcbiAgICAgICAgb3B0aW9uYWw6IHRydWVcclxuICAgIH0pO1xyXG4gICAgaWYgKGhlYXJ0YmVhdFNlcnZpY2UpIHtcclxuICAgICAgICBjb25zdCBoZWFydGJlYXRzSGVhZGVyID0gYXdhaXQgaGVhcnRiZWF0U2VydmljZS5nZXRIZWFydGJlYXRzSGVhZGVyKCk7XHJcbiAgICAgICAgaWYgKGhlYXJ0YmVhdHNIZWFkZXIpIHtcclxuICAgICAgICAgICAgaGVhZGVycy5hcHBlbmQoJ3gtZmlyZWJhc2UtY2xpZW50JywgaGVhcnRiZWF0c0hlYWRlcik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgY29uc3QgYm9keSA9IHtcclxuICAgICAgICBmaWQsXHJcbiAgICAgICAgYXV0aFZlcnNpb246IElOVEVSTkFMX0FVVEhfVkVSU0lPTixcclxuICAgICAgICBhcHBJZDogYXBwQ29uZmlnLmFwcElkLFxyXG4gICAgICAgIHNka1ZlcnNpb246IFBBQ0tBR0VfVkVSU0lPTlxyXG4gICAgfTtcclxuICAgIGNvbnN0IHJlcXVlc3QgPSB7XHJcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgaGVhZGVycyxcclxuICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShib2R5KVxyXG4gICAgfTtcclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgcmV0cnlJZlNlcnZlckVycm9yKCgpID0+IGZldGNoKGVuZHBvaW50LCByZXF1ZXN0KSk7XHJcbiAgICBpZiAocmVzcG9uc2Uub2spIHtcclxuICAgICAgICBjb25zdCByZXNwb25zZVZhbHVlID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG4gICAgICAgIGNvbnN0IHJlZ2lzdGVyZWRJbnN0YWxsYXRpb25FbnRyeSA9IHtcclxuICAgICAgICAgICAgZmlkOiByZXNwb25zZVZhbHVlLmZpZCB8fCBmaWQsXHJcbiAgICAgICAgICAgIHJlZ2lzdHJhdGlvblN0YXR1czogMiAvKiBDT01QTEVURUQgKi8sXHJcbiAgICAgICAgICAgIHJlZnJlc2hUb2tlbjogcmVzcG9uc2VWYWx1ZS5yZWZyZXNoVG9rZW4sXHJcbiAgICAgICAgICAgIGF1dGhUb2tlbjogZXh0cmFjdEF1dGhUb2tlbkluZm9Gcm9tUmVzcG9uc2UocmVzcG9uc2VWYWx1ZS5hdXRoVG9rZW4pXHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gcmVnaXN0ZXJlZEluc3RhbGxhdGlvbkVudHJ5O1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgdGhyb3cgYXdhaXQgZ2V0RXJyb3JGcm9tUmVzcG9uc2UoJ0NyZWF0ZSBJbnN0YWxsYXRpb24nLCByZXNwb25zZSk7XHJcbiAgICB9XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqIFJldHVybnMgYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgYWZ0ZXIgZ2l2ZW4gdGltZSBwYXNzZXMuICovXHJcbmZ1bmN0aW9uIHNsZWVwKG1zKSB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XHJcbiAgICAgICAgc2V0VGltZW91dChyZXNvbHZlLCBtcyk7XHJcbiAgICB9KTtcclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5mdW5jdGlvbiBidWZmZXJUb0Jhc2U2NFVybFNhZmUoYXJyYXkpIHtcclxuICAgIGNvbnN0IGI2NCA9IGJ0b2EoU3RyaW5nLmZyb21DaGFyQ29kZSguLi5hcnJheSkpO1xyXG4gICAgcmV0dXJuIGI2NC5yZXBsYWNlKC9cXCsvZywgJy0nKS5yZXBsYWNlKC9cXC8vZywgJ18nKTtcclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5jb25zdCBWQUxJRF9GSURfUEFUVEVSTiA9IC9eW2NkZWZdW1xcdy1dezIxfSQvO1xyXG5jb25zdCBJTlZBTElEX0ZJRCA9ICcnO1xyXG4vKipcclxuICogR2VuZXJhdGVzIGEgbmV3IEZJRCB1c2luZyByYW5kb20gdmFsdWVzIGZyb20gV2ViIENyeXB0byBBUEkuXHJcbiAqIFJldHVybnMgYW4gZW1wdHkgc3RyaW5nIGlmIEZJRCBnZW5lcmF0aW9uIGZhaWxzIGZvciBhbnkgcmVhc29uLlxyXG4gKi9cclxuZnVuY3Rpb24gZ2VuZXJhdGVGaWQoKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIC8vIEEgdmFsaWQgRklEIGhhcyBleGFjdGx5IDIyIGJhc2U2NCBjaGFyYWN0ZXJzLCB3aGljaCBpcyAxMzIgYml0cywgb3IgMTYuNVxyXG4gICAgICAgIC8vIGJ5dGVzLiBvdXIgaW1wbGVtZW50YXRpb24gZ2VuZXJhdGVzIGEgMTcgYnl0ZSBhcnJheSBpbnN0ZWFkLlxyXG4gICAgICAgIGNvbnN0IGZpZEJ5dGVBcnJheSA9IG5ldyBVaW50OEFycmF5KDE3KTtcclxuICAgICAgICBjb25zdCBjcnlwdG8gPSBzZWxmLmNyeXB0byB8fCBzZWxmLm1zQ3J5cHRvO1xyXG4gICAgICAgIGNyeXB0by5nZXRSYW5kb21WYWx1ZXMoZmlkQnl0ZUFycmF5KTtcclxuICAgICAgICAvLyBSZXBsYWNlIHRoZSBmaXJzdCA0IHJhbmRvbSBiaXRzIHdpdGggdGhlIGNvbnN0YW50IEZJRCBoZWFkZXIgb2YgMGIwMTExLlxyXG4gICAgICAgIGZpZEJ5dGVBcnJheVswXSA9IDBiMDExMTAwMDAgKyAoZmlkQnl0ZUFycmF5WzBdICUgMGIwMDAxMDAwMCk7XHJcbiAgICAgICAgY29uc3QgZmlkID0gZW5jb2RlKGZpZEJ5dGVBcnJheSk7XHJcbiAgICAgICAgcmV0dXJuIFZBTElEX0ZJRF9QQVRURVJOLnRlc3QoZmlkKSA/IGZpZCA6IElOVkFMSURfRklEO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKF9hKSB7XHJcbiAgICAgICAgLy8gRklEIGdlbmVyYXRpb24gZXJyb3JlZFxyXG4gICAgICAgIHJldHVybiBJTlZBTElEX0ZJRDtcclxuICAgIH1cclxufVxyXG4vKiogQ29udmVydHMgYSBGSUQgVWludDhBcnJheSB0byBhIGJhc2U2NCBzdHJpbmcgcmVwcmVzZW50YXRpb24uICovXHJcbmZ1bmN0aW9uIGVuY29kZShmaWRCeXRlQXJyYXkpIHtcclxuICAgIGNvbnN0IGI2NFN0cmluZyA9IGJ1ZmZlclRvQmFzZTY0VXJsU2FmZShmaWRCeXRlQXJyYXkpO1xyXG4gICAgLy8gUmVtb3ZlIHRoZSAyM3JkIGNoYXJhY3RlciB0aGF0IHdhcyBhZGRlZCBiZWNhdXNlIG9mIHRoZSBleHRyYSA0IGJpdHMgYXQgdGhlXHJcbiAgICAvLyBlbmQgb2Ygb3VyIDE3IGJ5dGUgYXJyYXksIGFuZCB0aGUgJz0nIHBhZGRpbmcuXHJcbiAgICByZXR1cm4gYjY0U3RyaW5nLnN1YnN0cigwLCAyMik7XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqIFJldHVybnMgYSBzdHJpbmcga2V5IHRoYXQgY2FuIGJlIHVzZWQgdG8gaWRlbnRpZnkgdGhlIGFwcC4gKi9cclxuZnVuY3Rpb24gZ2V0S2V5KGFwcENvbmZpZykge1xyXG4gICAgcmV0dXJuIGAke2FwcENvbmZpZy5hcHBOYW1lfSEke2FwcENvbmZpZy5hcHBJZH1gO1xyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbmNvbnN0IGZpZENoYW5nZUNhbGxiYWNrcyA9IG5ldyBNYXAoKTtcclxuLyoqXHJcbiAqIENhbGxzIHRoZSBvbklkQ2hhbmdlIGNhbGxiYWNrcyB3aXRoIHRoZSBuZXcgRklEIHZhbHVlLCBhbmQgYnJvYWRjYXN0cyB0aGVcclxuICogY2hhbmdlIHRvIG90aGVyIHRhYnMuXHJcbiAqL1xyXG5mdW5jdGlvbiBmaWRDaGFuZ2VkKGFwcENvbmZpZywgZmlkKSB7XHJcbiAgICBjb25zdCBrZXkgPSBnZXRLZXkoYXBwQ29uZmlnKTtcclxuICAgIGNhbGxGaWRDaGFuZ2VDYWxsYmFja3Moa2V5LCBmaWQpO1xyXG4gICAgYnJvYWRjYXN0RmlkQ2hhbmdlKGtleSwgZmlkKTtcclxufVxyXG5mdW5jdGlvbiBhZGRDYWxsYmFjayhhcHBDb25maWcsIGNhbGxiYWNrKSB7XHJcbiAgICAvLyBPcGVuIHRoZSBicm9hZGNhc3QgY2hhbm5lbCBpZiBpdCdzIG5vdCBhbHJlYWR5IG9wZW4sXHJcbiAgICAvLyB0byBiZSBhYmxlIHRvIGxpc3RlbiB0byBjaGFuZ2UgZXZlbnRzIGZyb20gb3RoZXIgdGFicy5cclxuICAgIGdldEJyb2FkY2FzdENoYW5uZWwoKTtcclxuICAgIGNvbnN0IGtleSA9IGdldEtleShhcHBDb25maWcpO1xyXG4gICAgbGV0IGNhbGxiYWNrU2V0ID0gZmlkQ2hhbmdlQ2FsbGJhY2tzLmdldChrZXkpO1xyXG4gICAgaWYgKCFjYWxsYmFja1NldCkge1xyXG4gICAgICAgIGNhbGxiYWNrU2V0ID0gbmV3IFNldCgpO1xyXG4gICAgICAgIGZpZENoYW5nZUNhbGxiYWNrcy5zZXQoa2V5LCBjYWxsYmFja1NldCk7XHJcbiAgICB9XHJcbiAgICBjYWxsYmFja1NldC5hZGQoY2FsbGJhY2spO1xyXG59XHJcbmZ1bmN0aW9uIHJlbW92ZUNhbGxiYWNrKGFwcENvbmZpZywgY2FsbGJhY2spIHtcclxuICAgIGNvbnN0IGtleSA9IGdldEtleShhcHBDb25maWcpO1xyXG4gICAgY29uc3QgY2FsbGJhY2tTZXQgPSBmaWRDaGFuZ2VDYWxsYmFja3MuZ2V0KGtleSk7XHJcbiAgICBpZiAoIWNhbGxiYWNrU2V0KSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgY2FsbGJhY2tTZXQuZGVsZXRlKGNhbGxiYWNrKTtcclxuICAgIGlmIChjYWxsYmFja1NldC5zaXplID09PSAwKSB7XHJcbiAgICAgICAgZmlkQ2hhbmdlQ2FsbGJhY2tzLmRlbGV0ZShrZXkpO1xyXG4gICAgfVxyXG4gICAgLy8gQ2xvc2UgYnJvYWRjYXN0IGNoYW5uZWwgaWYgdGhlcmUgYXJlIG5vIG1vcmUgY2FsbGJhY2tzLlxyXG4gICAgY2xvc2VCcm9hZGNhc3RDaGFubmVsKCk7XHJcbn1cclxuZnVuY3Rpb24gY2FsbEZpZENoYW5nZUNhbGxiYWNrcyhrZXksIGZpZCkge1xyXG4gICAgY29uc3QgY2FsbGJhY2tzID0gZmlkQ2hhbmdlQ2FsbGJhY2tzLmdldChrZXkpO1xyXG4gICAgaWYgKCFjYWxsYmFja3MpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBmb3IgKGNvbnN0IGNhbGxiYWNrIG9mIGNhbGxiYWNrcykge1xyXG4gICAgICAgIGNhbGxiYWNrKGZpZCk7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gYnJvYWRjYXN0RmlkQ2hhbmdlKGtleSwgZmlkKSB7XHJcbiAgICBjb25zdCBjaGFubmVsID0gZ2V0QnJvYWRjYXN0Q2hhbm5lbCgpO1xyXG4gICAgaWYgKGNoYW5uZWwpIHtcclxuICAgICAgICBjaGFubmVsLnBvc3RNZXNzYWdlKHsga2V5LCBmaWQgfSk7XHJcbiAgICB9XHJcbiAgICBjbG9zZUJyb2FkY2FzdENoYW5uZWwoKTtcclxufVxyXG5sZXQgYnJvYWRjYXN0Q2hhbm5lbCA9IG51bGw7XHJcbi8qKiBPcGVucyBhbmQgcmV0dXJucyBhIEJyb2FkY2FzdENoYW5uZWwgaWYgaXQgaXMgc3VwcG9ydGVkIGJ5IHRoZSBicm93c2VyLiAqL1xyXG5mdW5jdGlvbiBnZXRCcm9hZGNhc3RDaGFubmVsKCkge1xyXG4gICAgaWYgKCFicm9hZGNhc3RDaGFubmVsICYmICdCcm9hZGNhc3RDaGFubmVsJyBpbiBzZWxmKSB7XHJcbiAgICAgICAgYnJvYWRjYXN0Q2hhbm5lbCA9IG5ldyBCcm9hZGNhc3RDaGFubmVsKCdbRmlyZWJhc2VdIEZJRCBDaGFuZ2UnKTtcclxuICAgICAgICBicm9hZGNhc3RDaGFubmVsLm9ubWVzc2FnZSA9IGUgPT4ge1xyXG4gICAgICAgICAgICBjYWxsRmlkQ2hhbmdlQ2FsbGJhY2tzKGUuZGF0YS5rZXksIGUuZGF0YS5maWQpO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYnJvYWRjYXN0Q2hhbm5lbDtcclxufVxyXG5mdW5jdGlvbiBjbG9zZUJyb2FkY2FzdENoYW5uZWwoKSB7XHJcbiAgICBpZiAoZmlkQ2hhbmdlQ2FsbGJhY2tzLnNpemUgPT09IDAgJiYgYnJvYWRjYXN0Q2hhbm5lbCkge1xyXG4gICAgICAgIGJyb2FkY2FzdENoYW5uZWwuY2xvc2UoKTtcclxuICAgICAgICBicm9hZGNhc3RDaGFubmVsID0gbnVsbDtcclxuICAgIH1cclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5jb25zdCBEQVRBQkFTRV9OQU1FID0gJ2ZpcmViYXNlLWluc3RhbGxhdGlvbnMtZGF0YWJhc2UnO1xyXG5jb25zdCBEQVRBQkFTRV9WRVJTSU9OID0gMTtcclxuY29uc3QgT0JKRUNUX1NUT1JFX05BTUUgPSAnZmlyZWJhc2UtaW5zdGFsbGF0aW9ucy1zdG9yZSc7XHJcbmxldCBkYlByb21pc2UgPSBudWxsO1xyXG5mdW5jdGlvbiBnZXREYlByb21pc2UoKSB7XHJcbiAgICBpZiAoIWRiUHJvbWlzZSkge1xyXG4gICAgICAgIGRiUHJvbWlzZSA9IG9wZW5EQihEQVRBQkFTRV9OQU1FLCBEQVRBQkFTRV9WRVJTSU9OLCB7XHJcbiAgICAgICAgICAgIHVwZ3JhZGU6IChkYiwgb2xkVmVyc2lvbikgPT4ge1xyXG4gICAgICAgICAgICAgICAgLy8gV2UgZG9uJ3QgdXNlICdicmVhaycgaW4gdGhpcyBzd2l0Y2ggc3RhdGVtZW50LCB0aGUgZmFsbC10aHJvdWdoXHJcbiAgICAgICAgICAgICAgICAvLyBiZWhhdmlvciBpcyB3aGF0IHdlIHdhbnQsIGJlY2F1c2UgaWYgdGhlcmUgYXJlIG11bHRpcGxlIHZlcnNpb25zIGJldHdlZW5cclxuICAgICAgICAgICAgICAgIC8vIHRoZSBvbGQgdmVyc2lvbiBhbmQgdGhlIGN1cnJlbnQgdmVyc2lvbiwgd2Ugd2FudCBBTEwgdGhlIG1pZ3JhdGlvbnNcclxuICAgICAgICAgICAgICAgIC8vIHRoYXQgY29ycmVzcG9uZCB0byB0aG9zZSB2ZXJzaW9ucyB0byBydW4sIG5vdCBvbmx5IHRoZSBsYXN0IG9uZS5cclxuICAgICAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBkZWZhdWx0LWNhc2VcclxuICAgICAgICAgICAgICAgIHN3aXRjaCAob2xkVmVyc2lvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGIuY3JlYXRlT2JqZWN0U3RvcmUoT0JKRUNUX1NUT1JFX05BTUUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZGJQcm9taXNlO1xyXG59XHJcbi8qKiBBc3NpZ25zIG9yIG92ZXJ3cml0ZXMgdGhlIHJlY29yZCBmb3IgdGhlIGdpdmVuIGtleSB3aXRoIHRoZSBnaXZlbiB2YWx1ZS4gKi9cclxuYXN5bmMgZnVuY3Rpb24gc2V0KGFwcENvbmZpZywgdmFsdWUpIHtcclxuICAgIGNvbnN0IGtleSA9IGdldEtleShhcHBDb25maWcpO1xyXG4gICAgY29uc3QgZGIgPSBhd2FpdCBnZXREYlByb21pc2UoKTtcclxuICAgIGNvbnN0IHR4ID0gZGIudHJhbnNhY3Rpb24oT0JKRUNUX1NUT1JFX05BTUUsICdyZWFkd3JpdGUnKTtcclxuICAgIGNvbnN0IG9iamVjdFN0b3JlID0gdHgub2JqZWN0U3RvcmUoT0JKRUNUX1NUT1JFX05BTUUpO1xyXG4gICAgY29uc3Qgb2xkVmFsdWUgPSAoYXdhaXQgb2JqZWN0U3RvcmUuZ2V0KGtleSkpO1xyXG4gICAgYXdhaXQgb2JqZWN0U3RvcmUucHV0KHZhbHVlLCBrZXkpO1xyXG4gICAgYXdhaXQgdHguZG9uZTtcclxuICAgIGlmICghb2xkVmFsdWUgfHwgb2xkVmFsdWUuZmlkICE9PSB2YWx1ZS5maWQpIHtcclxuICAgICAgICBmaWRDaGFuZ2VkKGFwcENvbmZpZywgdmFsdWUuZmlkKTtcclxuICAgIH1cclxuICAgIHJldHVybiB2YWx1ZTtcclxufVxyXG4vKiogUmVtb3ZlcyByZWNvcmQocykgZnJvbSB0aGUgb2JqZWN0U3RvcmUgdGhhdCBtYXRjaCB0aGUgZ2l2ZW4ga2V5LiAqL1xyXG5hc3luYyBmdW5jdGlvbiByZW1vdmUoYXBwQ29uZmlnKSB7XHJcbiAgICBjb25zdCBrZXkgPSBnZXRLZXkoYXBwQ29uZmlnKTtcclxuICAgIGNvbnN0IGRiID0gYXdhaXQgZ2V0RGJQcm9taXNlKCk7XHJcbiAgICBjb25zdCB0eCA9IGRiLnRyYW5zYWN0aW9uKE9CSkVDVF9TVE9SRV9OQU1FLCAncmVhZHdyaXRlJyk7XHJcbiAgICBhd2FpdCB0eC5vYmplY3RTdG9yZShPQkpFQ1RfU1RPUkVfTkFNRSkuZGVsZXRlKGtleSk7XHJcbiAgICBhd2FpdCB0eC5kb25lO1xyXG59XHJcbi8qKlxyXG4gKiBBdG9taWNhbGx5IHVwZGF0ZXMgYSByZWNvcmQgd2l0aCB0aGUgcmVzdWx0IG9mIHVwZGF0ZUZuLCB3aGljaCBnZXRzXHJcbiAqIGNhbGxlZCB3aXRoIHRoZSBjdXJyZW50IHZhbHVlLiBJZiBuZXdWYWx1ZSBpcyB1bmRlZmluZWQsIHRoZSByZWNvcmQgaXNcclxuICogZGVsZXRlZCBpbnN0ZWFkLlxyXG4gKiBAcmV0dXJuIFVwZGF0ZWQgdmFsdWVcclxuICovXHJcbmFzeW5jIGZ1bmN0aW9uIHVwZGF0ZShhcHBDb25maWcsIHVwZGF0ZUZuKSB7XHJcbiAgICBjb25zdCBrZXkgPSBnZXRLZXkoYXBwQ29uZmlnKTtcclxuICAgIGNvbnN0IGRiID0gYXdhaXQgZ2V0RGJQcm9taXNlKCk7XHJcbiAgICBjb25zdCB0eCA9IGRiLnRyYW5zYWN0aW9uKE9CSkVDVF9TVE9SRV9OQU1FLCAncmVhZHdyaXRlJyk7XHJcbiAgICBjb25zdCBzdG9yZSA9IHR4Lm9iamVjdFN0b3JlKE9CSkVDVF9TVE9SRV9OQU1FKTtcclxuICAgIGNvbnN0IG9sZFZhbHVlID0gKGF3YWl0IHN0b3JlLmdldChrZXkpKTtcclxuICAgIGNvbnN0IG5ld1ZhbHVlID0gdXBkYXRlRm4ob2xkVmFsdWUpO1xyXG4gICAgaWYgKG5ld1ZhbHVlID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBhd2FpdCBzdG9yZS5kZWxldGUoa2V5KTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGF3YWl0IHN0b3JlLnB1dChuZXdWYWx1ZSwga2V5KTtcclxuICAgIH1cclxuICAgIGF3YWl0IHR4LmRvbmU7XHJcbiAgICBpZiAobmV3VmFsdWUgJiYgKCFvbGRWYWx1ZSB8fCBvbGRWYWx1ZS5maWQgIT09IG5ld1ZhbHVlLmZpZCkpIHtcclxuICAgICAgICBmaWRDaGFuZ2VkKGFwcENvbmZpZywgbmV3VmFsdWUuZmlkKTtcclxuICAgIH1cclxuICAgIHJldHVybiBuZXdWYWx1ZTtcclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG4vKipcclxuICogVXBkYXRlcyBhbmQgcmV0dXJucyB0aGUgSW5zdGFsbGF0aW9uRW50cnkgZnJvbSB0aGUgZGF0YWJhc2UuXHJcbiAqIEFsc28gdHJpZ2dlcnMgYSByZWdpc3RyYXRpb24gcmVxdWVzdCBpZiBpdCBpcyBuZWNlc3NhcnkgYW5kIHBvc3NpYmxlLlxyXG4gKi9cclxuYXN5bmMgZnVuY3Rpb24gZ2V0SW5zdGFsbGF0aW9uRW50cnkoaW5zdGFsbGF0aW9ucykge1xyXG4gICAgbGV0IHJlZ2lzdHJhdGlvblByb21pc2U7XHJcbiAgICBjb25zdCBpbnN0YWxsYXRpb25FbnRyeSA9IGF3YWl0IHVwZGF0ZShpbnN0YWxsYXRpb25zLmFwcENvbmZpZywgb2xkRW50cnkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGluc3RhbGxhdGlvbkVudHJ5ID0gdXBkYXRlT3JDcmVhdGVJbnN0YWxsYXRpb25FbnRyeShvbGRFbnRyeSk7XHJcbiAgICAgICAgY29uc3QgZW50cnlXaXRoUHJvbWlzZSA9IHRyaWdnZXJSZWdpc3RyYXRpb25JZk5lY2Vzc2FyeShpbnN0YWxsYXRpb25zLCBpbnN0YWxsYXRpb25FbnRyeSk7XHJcbiAgICAgICAgcmVnaXN0cmF0aW9uUHJvbWlzZSA9IGVudHJ5V2l0aFByb21pc2UucmVnaXN0cmF0aW9uUHJvbWlzZTtcclxuICAgICAgICByZXR1cm4gZW50cnlXaXRoUHJvbWlzZS5pbnN0YWxsYXRpb25FbnRyeTtcclxuICAgIH0pO1xyXG4gICAgaWYgKGluc3RhbGxhdGlvbkVudHJ5LmZpZCA9PT0gSU5WQUxJRF9GSUQpIHtcclxuICAgICAgICAvLyBGSUQgZ2VuZXJhdGlvbiBmYWlsZWQuIFdhaXRpbmcgZm9yIHRoZSBGSUQgZnJvbSB0aGUgc2VydmVyLlxyXG4gICAgICAgIHJldHVybiB7IGluc3RhbGxhdGlvbkVudHJ5OiBhd2FpdCByZWdpc3RyYXRpb25Qcm9taXNlIH07XHJcbiAgICB9XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGluc3RhbGxhdGlvbkVudHJ5LFxyXG4gICAgICAgIHJlZ2lzdHJhdGlvblByb21pc2VcclxuICAgIH07XHJcbn1cclxuLyoqXHJcbiAqIENyZWF0ZXMgYSBuZXcgSW5zdGFsbGF0aW9uIEVudHJ5IGlmIG9uZSBkb2VzIG5vdCBleGlzdC5cclxuICogQWxzbyBjbGVhcnMgdGltZWQgb3V0IHBlbmRpbmcgcmVxdWVzdHMuXHJcbiAqL1xyXG5mdW5jdGlvbiB1cGRhdGVPckNyZWF0ZUluc3RhbGxhdGlvbkVudHJ5KG9sZEVudHJ5KSB7XHJcbiAgICBjb25zdCBlbnRyeSA9IG9sZEVudHJ5IHx8IHtcclxuICAgICAgICBmaWQ6IGdlbmVyYXRlRmlkKCksXHJcbiAgICAgICAgcmVnaXN0cmF0aW9uU3RhdHVzOiAwIC8qIE5PVF9TVEFSVEVEICovXHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIGNsZWFyVGltZWRPdXRSZXF1ZXN0KGVudHJ5KTtcclxufVxyXG4vKipcclxuICogSWYgdGhlIEZpcmViYXNlIEluc3RhbGxhdGlvbiBpcyBub3QgcmVnaXN0ZXJlZCB5ZXQsIHRoaXMgd2lsbCB0cmlnZ2VyIHRoZVxyXG4gKiByZWdpc3RyYXRpb24gYW5kIHJldHVybiBhbiBJblByb2dyZXNzSW5zdGFsbGF0aW9uRW50cnkuXHJcbiAqXHJcbiAqIElmIHJlZ2lzdHJhdGlvblByb21pc2UgZG9lcyBub3QgZXhpc3QsIHRoZSBpbnN0YWxsYXRpb25FbnRyeSBpcyBndWFyYW50ZWVkXHJcbiAqIHRvIGJlIHJlZ2lzdGVyZWQuXHJcbiAqL1xyXG5mdW5jdGlvbiB0cmlnZ2VyUmVnaXN0cmF0aW9uSWZOZWNlc3NhcnkoaW5zdGFsbGF0aW9ucywgaW5zdGFsbGF0aW9uRW50cnkpIHtcclxuICAgIGlmIChpbnN0YWxsYXRpb25FbnRyeS5yZWdpc3RyYXRpb25TdGF0dXMgPT09IDAgLyogTk9UX1NUQVJURUQgKi8pIHtcclxuICAgICAgICBpZiAoIW5hdmlnYXRvci5vbkxpbmUpIHtcclxuICAgICAgICAgICAgLy8gUmVnaXN0cmF0aW9uIHJlcXVpcmVkIGJ1dCBhcHAgaXMgb2ZmbGluZS5cclxuICAgICAgICAgICAgY29uc3QgcmVnaXN0cmF0aW9uUHJvbWlzZVdpdGhFcnJvciA9IFByb21pc2UucmVqZWN0KEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKFwiYXBwLW9mZmxpbmVcIiAvKiBBUFBfT0ZGTElORSAqLykpO1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgaW5zdGFsbGF0aW9uRW50cnksXHJcbiAgICAgICAgICAgICAgICByZWdpc3RyYXRpb25Qcm9taXNlOiByZWdpc3RyYXRpb25Qcm9taXNlV2l0aEVycm9yXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIFRyeSByZWdpc3RlcmluZy4gQ2hhbmdlIHN0YXR1cyB0byBJTl9QUk9HUkVTUy5cclxuICAgICAgICBjb25zdCBpblByb2dyZXNzRW50cnkgPSB7XHJcbiAgICAgICAgICAgIGZpZDogaW5zdGFsbGF0aW9uRW50cnkuZmlkLFxyXG4gICAgICAgICAgICByZWdpc3RyYXRpb25TdGF0dXM6IDEgLyogSU5fUFJPR1JFU1MgKi8sXHJcbiAgICAgICAgICAgIHJlZ2lzdHJhdGlvblRpbWU6IERhdGUubm93KClcclxuICAgICAgICB9O1xyXG4gICAgICAgIGNvbnN0IHJlZ2lzdHJhdGlvblByb21pc2UgPSByZWdpc3Rlckluc3RhbGxhdGlvbihpbnN0YWxsYXRpb25zLCBpblByb2dyZXNzRW50cnkpO1xyXG4gICAgICAgIHJldHVybiB7IGluc3RhbGxhdGlvbkVudHJ5OiBpblByb2dyZXNzRW50cnksIHJlZ2lzdHJhdGlvblByb21pc2UgfTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGluc3RhbGxhdGlvbkVudHJ5LnJlZ2lzdHJhdGlvblN0YXR1cyA9PT0gMSAvKiBJTl9QUk9HUkVTUyAqLykge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGluc3RhbGxhdGlvbkVudHJ5LFxyXG4gICAgICAgICAgICByZWdpc3RyYXRpb25Qcm9taXNlOiB3YWl0VW50aWxGaWRSZWdpc3RyYXRpb24oaW5zdGFsbGF0aW9ucylcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIHsgaW5zdGFsbGF0aW9uRW50cnkgfTtcclxuICAgIH1cclxufVxyXG4vKiogVGhpcyB3aWxsIGJlIGV4ZWN1dGVkIG9ubHkgb25jZSBmb3IgZWFjaCBuZXcgRmlyZWJhc2UgSW5zdGFsbGF0aW9uLiAqL1xyXG5hc3luYyBmdW5jdGlvbiByZWdpc3Rlckluc3RhbGxhdGlvbihpbnN0YWxsYXRpb25zLCBpbnN0YWxsYXRpb25FbnRyeSkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zdCByZWdpc3RlcmVkSW5zdGFsbGF0aW9uRW50cnkgPSBhd2FpdCBjcmVhdGVJbnN0YWxsYXRpb25SZXF1ZXN0KGluc3RhbGxhdGlvbnMsIGluc3RhbGxhdGlvbkVudHJ5KTtcclxuICAgICAgICByZXR1cm4gc2V0KGluc3RhbGxhdGlvbnMuYXBwQ29uZmlnLCByZWdpc3RlcmVkSW5zdGFsbGF0aW9uRW50cnkpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICBpZiAoaXNTZXJ2ZXJFcnJvcihlKSAmJiBlLmN1c3RvbURhdGEuc2VydmVyQ29kZSA9PT0gNDA5KSB7XHJcbiAgICAgICAgICAgIC8vIFNlcnZlciByZXR1cm5lZCBhIFwiRklEIGNhbiBub3QgYmUgdXNlZFwiIGVycm9yLlxyXG4gICAgICAgICAgICAvLyBHZW5lcmF0ZSBhIG5ldyBJRCBuZXh0IHRpbWUuXHJcbiAgICAgICAgICAgIGF3YWl0IHJlbW92ZShpbnN0YWxsYXRpb25zLmFwcENvbmZpZyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBSZWdpc3RyYXRpb24gZmFpbGVkLiBTZXQgRklEIGFzIG5vdCByZWdpc3RlcmVkLlxyXG4gICAgICAgICAgICBhd2FpdCBzZXQoaW5zdGFsbGF0aW9ucy5hcHBDb25maWcsIHtcclxuICAgICAgICAgICAgICAgIGZpZDogaW5zdGFsbGF0aW9uRW50cnkuZmlkLFxyXG4gICAgICAgICAgICAgICAgcmVnaXN0cmF0aW9uU3RhdHVzOiAwIC8qIE5PVF9TVEFSVEVEICovXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aHJvdyBlO1xyXG4gICAgfVxyXG59XHJcbi8qKiBDYWxsIGlmIEZJRCByZWdpc3RyYXRpb24gaXMgcGVuZGluZyBpbiBhbm90aGVyIHJlcXVlc3QuICovXHJcbmFzeW5jIGZ1bmN0aW9uIHdhaXRVbnRpbEZpZFJlZ2lzdHJhdGlvbihpbnN0YWxsYXRpb25zKSB7XHJcbiAgICAvLyBVbmZvcnR1bmF0ZWx5LCB0aGVyZSBpcyBubyB3YXkgb2YgcmVsaWFibHkgb2JzZXJ2aW5nIHdoZW4gYSB2YWx1ZSBpblxyXG4gICAgLy8gSW5kZXhlZERCIGNoYW5nZXMgKHlldCwgc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9XSUNHL2luZGV4ZWQtZGItb2JzZXJ2ZXJzKSxcclxuICAgIC8vIHNvIHdlIG5lZWQgdG8gcG9sbC5cclxuICAgIGxldCBlbnRyeSA9IGF3YWl0IHVwZGF0ZUluc3RhbGxhdGlvblJlcXVlc3QoaW5zdGFsbGF0aW9ucy5hcHBDb25maWcpO1xyXG4gICAgd2hpbGUgKGVudHJ5LnJlZ2lzdHJhdGlvblN0YXR1cyA9PT0gMSAvKiBJTl9QUk9HUkVTUyAqLykge1xyXG4gICAgICAgIC8vIGNyZWF0ZUluc3RhbGxhdGlvbiByZXF1ZXN0IHN0aWxsIGluIHByb2dyZXNzLlxyXG4gICAgICAgIGF3YWl0IHNsZWVwKDEwMCk7XHJcbiAgICAgICAgZW50cnkgPSBhd2FpdCB1cGRhdGVJbnN0YWxsYXRpb25SZXF1ZXN0KGluc3RhbGxhdGlvbnMuYXBwQ29uZmlnKTtcclxuICAgIH1cclxuICAgIGlmIChlbnRyeS5yZWdpc3RyYXRpb25TdGF0dXMgPT09IDAgLyogTk9UX1NUQVJURUQgKi8pIHtcclxuICAgICAgICAvLyBUaGUgcmVxdWVzdCB0aW1lZCBvdXQgb3IgZmFpbGVkIGluIGEgZGlmZmVyZW50IGNhbGwuIFRyeSBhZ2Fpbi5cclxuICAgICAgICBjb25zdCB7IGluc3RhbGxhdGlvbkVudHJ5LCByZWdpc3RyYXRpb25Qcm9taXNlIH0gPSBhd2FpdCBnZXRJbnN0YWxsYXRpb25FbnRyeShpbnN0YWxsYXRpb25zKTtcclxuICAgICAgICBpZiAocmVnaXN0cmF0aW9uUHJvbWlzZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVnaXN0cmF0aW9uUHJvbWlzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIGlmIHRoZXJlIGlzIG5vIHJlZ2lzdHJhdGlvblByb21pc2UsIGVudHJ5IGlzIHJlZ2lzdGVyZWQuXHJcbiAgICAgICAgICAgIHJldHVybiBpbnN0YWxsYXRpb25FbnRyeTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZW50cnk7XHJcbn1cclxuLyoqXHJcbiAqIENhbGxlZCBvbmx5IGlmIHRoZXJlIGlzIGEgQ3JlYXRlSW5zdGFsbGF0aW9uIHJlcXVlc3QgaW4gcHJvZ3Jlc3MuXHJcbiAqXHJcbiAqIFVwZGF0ZXMgdGhlIEluc3RhbGxhdGlvbkVudHJ5IGluIHRoZSBEQiBiYXNlZCBvbiB0aGUgc3RhdHVzIG9mIHRoZVxyXG4gKiBDcmVhdGVJbnN0YWxsYXRpb24gcmVxdWVzdC5cclxuICpcclxuICogUmV0dXJucyB0aGUgdXBkYXRlZCBJbnN0YWxsYXRpb25FbnRyeS5cclxuICovXHJcbmZ1bmN0aW9uIHVwZGF0ZUluc3RhbGxhdGlvblJlcXVlc3QoYXBwQ29uZmlnKSB7XHJcbiAgICByZXR1cm4gdXBkYXRlKGFwcENvbmZpZywgb2xkRW50cnkgPT4ge1xyXG4gICAgICAgIGlmICghb2xkRW50cnkpIHtcclxuICAgICAgICAgICAgdGhyb3cgRVJST1JfRkFDVE9SWS5jcmVhdGUoXCJpbnN0YWxsYXRpb24tbm90LWZvdW5kXCIgLyogSU5TVEFMTEFUSU9OX05PVF9GT1VORCAqLyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjbGVhclRpbWVkT3V0UmVxdWVzdChvbGRFbnRyeSk7XHJcbiAgICB9KTtcclxufVxyXG5mdW5jdGlvbiBjbGVhclRpbWVkT3V0UmVxdWVzdChlbnRyeSkge1xyXG4gICAgaWYgKGhhc0luc3RhbGxhdGlvblJlcXVlc3RUaW1lZE91dChlbnRyeSkpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBmaWQ6IGVudHJ5LmZpZCxcclxuICAgICAgICAgICAgcmVnaXN0cmF0aW9uU3RhdHVzOiAwIC8qIE5PVF9TVEFSVEVEICovXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIHJldHVybiBlbnRyeTtcclxufVxyXG5mdW5jdGlvbiBoYXNJbnN0YWxsYXRpb25SZXF1ZXN0VGltZWRPdXQoaW5zdGFsbGF0aW9uRW50cnkpIHtcclxuICAgIHJldHVybiAoaW5zdGFsbGF0aW9uRW50cnkucmVnaXN0cmF0aW9uU3RhdHVzID09PSAxIC8qIElOX1BST0dSRVNTICovICYmXHJcbiAgICAgICAgaW5zdGFsbGF0aW9uRW50cnkucmVnaXN0cmF0aW9uVGltZSArIFBFTkRJTkdfVElNRU9VVF9NUyA8IERhdGUubm93KCkpO1xyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbmFzeW5jIGZ1bmN0aW9uIGdlbmVyYXRlQXV0aFRva2VuUmVxdWVzdCh7IGFwcENvbmZpZywgaGVhcnRiZWF0U2VydmljZVByb3ZpZGVyIH0sIGluc3RhbGxhdGlvbkVudHJ5KSB7XHJcbiAgICBjb25zdCBlbmRwb2ludCA9IGdldEdlbmVyYXRlQXV0aFRva2VuRW5kcG9pbnQoYXBwQ29uZmlnLCBpbnN0YWxsYXRpb25FbnRyeSk7XHJcbiAgICBjb25zdCBoZWFkZXJzID0gZ2V0SGVhZGVyc1dpdGhBdXRoKGFwcENvbmZpZywgaW5zdGFsbGF0aW9uRW50cnkpO1xyXG4gICAgLy8gSWYgaGVhcnRiZWF0IHNlcnZpY2UgZXhpc3RzLCBhZGQgdGhlIGhlYXJ0YmVhdCBzdHJpbmcgdG8gdGhlIGhlYWRlci5cclxuICAgIGNvbnN0IGhlYXJ0YmVhdFNlcnZpY2UgPSBoZWFydGJlYXRTZXJ2aWNlUHJvdmlkZXIuZ2V0SW1tZWRpYXRlKHtcclxuICAgICAgICBvcHRpb25hbDogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICBpZiAoaGVhcnRiZWF0U2VydmljZSkge1xyXG4gICAgICAgIGNvbnN0IGhlYXJ0YmVhdHNIZWFkZXIgPSBhd2FpdCBoZWFydGJlYXRTZXJ2aWNlLmdldEhlYXJ0YmVhdHNIZWFkZXIoKTtcclxuICAgICAgICBpZiAoaGVhcnRiZWF0c0hlYWRlcikge1xyXG4gICAgICAgICAgICBoZWFkZXJzLmFwcGVuZCgneC1maXJlYmFzZS1jbGllbnQnLCBoZWFydGJlYXRzSGVhZGVyKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBjb25zdCBib2R5ID0ge1xyXG4gICAgICAgIGluc3RhbGxhdGlvbjoge1xyXG4gICAgICAgICAgICBzZGtWZXJzaW9uOiBQQUNLQUdFX1ZFUlNJT04sXHJcbiAgICAgICAgICAgIGFwcElkOiBhcHBDb25maWcuYXBwSWRcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgY29uc3QgcmVxdWVzdCA9IHtcclxuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICBoZWFkZXJzLFxyXG4gICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGJvZHkpXHJcbiAgICB9O1xyXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCByZXRyeUlmU2VydmVyRXJyb3IoKCkgPT4gZmV0Y2goZW5kcG9pbnQsIHJlcXVlc3QpKTtcclxuICAgIGlmIChyZXNwb25zZS5vaykge1xyXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlVmFsdWUgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcbiAgICAgICAgY29uc3QgY29tcGxldGVkQXV0aFRva2VuID0gZXh0cmFjdEF1dGhUb2tlbkluZm9Gcm9tUmVzcG9uc2UocmVzcG9uc2VWYWx1ZSk7XHJcbiAgICAgICAgcmV0dXJuIGNvbXBsZXRlZEF1dGhUb2tlbjtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHRocm93IGF3YWl0IGdldEVycm9yRnJvbVJlc3BvbnNlKCdHZW5lcmF0ZSBBdXRoIFRva2VuJywgcmVzcG9uc2UpO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIGdldEdlbmVyYXRlQXV0aFRva2VuRW5kcG9pbnQoYXBwQ29uZmlnLCB7IGZpZCB9KSB7XHJcbiAgICByZXR1cm4gYCR7Z2V0SW5zdGFsbGF0aW9uc0VuZHBvaW50KGFwcENvbmZpZyl9LyR7ZmlkfS9hdXRoVG9rZW5zOmdlbmVyYXRlYDtcclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG4vKipcclxuICogUmV0dXJucyBhIHZhbGlkIGF1dGhlbnRpY2F0aW9uIHRva2VuIGZvciB0aGUgaW5zdGFsbGF0aW9uLiBHZW5lcmF0ZXMgYSBuZXdcclxuICogdG9rZW4gaWYgb25lIGRvZXNuJ3QgZXhpc3QsIGlzIGV4cGlyZWQgb3IgYWJvdXQgdG8gZXhwaXJlLlxyXG4gKlxyXG4gKiBTaG91bGQgb25seSBiZSBjYWxsZWQgaWYgdGhlIEZpcmViYXNlIEluc3RhbGxhdGlvbiBpcyByZWdpc3RlcmVkLlxyXG4gKi9cclxuYXN5bmMgZnVuY3Rpb24gcmVmcmVzaEF1dGhUb2tlbihpbnN0YWxsYXRpb25zLCBmb3JjZVJlZnJlc2ggPSBmYWxzZSkge1xyXG4gICAgbGV0IHRva2VuUHJvbWlzZTtcclxuICAgIGNvbnN0IGVudHJ5ID0gYXdhaXQgdXBkYXRlKGluc3RhbGxhdGlvbnMuYXBwQ29uZmlnLCBvbGRFbnRyeSA9PiB7XHJcbiAgICAgICAgaWYgKCFpc0VudHJ5UmVnaXN0ZXJlZChvbGRFbnRyeSkpIHtcclxuICAgICAgICAgICAgdGhyb3cgRVJST1JfRkFDVE9SWS5jcmVhdGUoXCJub3QtcmVnaXN0ZXJlZFwiIC8qIE5PVF9SRUdJU1RFUkVEICovKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3Qgb2xkQXV0aFRva2VuID0gb2xkRW50cnkuYXV0aFRva2VuO1xyXG4gICAgICAgIGlmICghZm9yY2VSZWZyZXNoICYmIGlzQXV0aFRva2VuVmFsaWQob2xkQXV0aFRva2VuKSkge1xyXG4gICAgICAgICAgICAvLyBUaGVyZSBpcyBhIHZhbGlkIHRva2VuIGluIHRoZSBEQi5cclxuICAgICAgICAgICAgcmV0dXJuIG9sZEVudHJ5O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChvbGRBdXRoVG9rZW4ucmVxdWVzdFN0YXR1cyA9PT0gMSAvKiBJTl9QUk9HUkVTUyAqLykge1xyXG4gICAgICAgICAgICAvLyBUaGVyZSBhbHJlYWR5IGlzIGEgdG9rZW4gcmVxdWVzdCBpbiBwcm9ncmVzcy5cclxuICAgICAgICAgICAgdG9rZW5Qcm9taXNlID0gd2FpdFVudGlsQXV0aFRva2VuUmVxdWVzdChpbnN0YWxsYXRpb25zLCBmb3JjZVJlZnJlc2gpO1xyXG4gICAgICAgICAgICByZXR1cm4gb2xkRW50cnk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBObyB0b2tlbiBvciB0b2tlbiBleHBpcmVkLlxyXG4gICAgICAgICAgICBpZiAoIW5hdmlnYXRvci5vbkxpbmUpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKFwiYXBwLW9mZmxpbmVcIiAvKiBBUFBfT0ZGTElORSAqLyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgaW5Qcm9ncmVzc0VudHJ5ID0gbWFrZUF1dGhUb2tlblJlcXVlc3RJblByb2dyZXNzRW50cnkob2xkRW50cnkpO1xyXG4gICAgICAgICAgICB0b2tlblByb21pc2UgPSBmZXRjaEF1dGhUb2tlbkZyb21TZXJ2ZXIoaW5zdGFsbGF0aW9ucywgaW5Qcm9ncmVzc0VudHJ5KTtcclxuICAgICAgICAgICAgcmV0dXJuIGluUHJvZ3Jlc3NFbnRyeTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgIGNvbnN0IGF1dGhUb2tlbiA9IHRva2VuUHJvbWlzZVxyXG4gICAgICAgID8gYXdhaXQgdG9rZW5Qcm9taXNlXHJcbiAgICAgICAgOiBlbnRyeS5hdXRoVG9rZW47XHJcbiAgICByZXR1cm4gYXV0aFRva2VuO1xyXG59XHJcbi8qKlxyXG4gKiBDYWxsIG9ubHkgaWYgRklEIGlzIHJlZ2lzdGVyZWQgYW5kIEF1dGggVG9rZW4gcmVxdWVzdCBpcyBpbiBwcm9ncmVzcy5cclxuICpcclxuICogV2FpdHMgdW50aWwgdGhlIGN1cnJlbnQgcGVuZGluZyByZXF1ZXN0IGZpbmlzaGVzLiBJZiB0aGUgcmVxdWVzdCB0aW1lcyBvdXQsXHJcbiAqIHRyaWVzIG9uY2UgaW4gdGhpcyB0aHJlYWQgYXMgd2VsbC5cclxuICovXHJcbmFzeW5jIGZ1bmN0aW9uIHdhaXRVbnRpbEF1dGhUb2tlblJlcXVlc3QoaW5zdGFsbGF0aW9ucywgZm9yY2VSZWZyZXNoKSB7XHJcbiAgICAvLyBVbmZvcnR1bmF0ZWx5LCB0aGVyZSBpcyBubyB3YXkgb2YgcmVsaWFibHkgb2JzZXJ2aW5nIHdoZW4gYSB2YWx1ZSBpblxyXG4gICAgLy8gSW5kZXhlZERCIGNoYW5nZXMgKHlldCwgc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9XSUNHL2luZGV4ZWQtZGItb2JzZXJ2ZXJzKSxcclxuICAgIC8vIHNvIHdlIG5lZWQgdG8gcG9sbC5cclxuICAgIGxldCBlbnRyeSA9IGF3YWl0IHVwZGF0ZUF1dGhUb2tlblJlcXVlc3QoaW5zdGFsbGF0aW9ucy5hcHBDb25maWcpO1xyXG4gICAgd2hpbGUgKGVudHJ5LmF1dGhUb2tlbi5yZXF1ZXN0U3RhdHVzID09PSAxIC8qIElOX1BST0dSRVNTICovKSB7XHJcbiAgICAgICAgLy8gZ2VuZXJhdGVBdXRoVG9rZW4gc3RpbGwgaW4gcHJvZ3Jlc3MuXHJcbiAgICAgICAgYXdhaXQgc2xlZXAoMTAwKTtcclxuICAgICAgICBlbnRyeSA9IGF3YWl0IHVwZGF0ZUF1dGhUb2tlblJlcXVlc3QoaW5zdGFsbGF0aW9ucy5hcHBDb25maWcpO1xyXG4gICAgfVxyXG4gICAgY29uc3QgYXV0aFRva2VuID0gZW50cnkuYXV0aFRva2VuO1xyXG4gICAgaWYgKGF1dGhUb2tlbi5yZXF1ZXN0U3RhdHVzID09PSAwIC8qIE5PVF9TVEFSVEVEICovKSB7XHJcbiAgICAgICAgLy8gVGhlIHJlcXVlc3QgdGltZWQgb3V0IG9yIGZhaWxlZCBpbiBhIGRpZmZlcmVudCBjYWxsLiBUcnkgYWdhaW4uXHJcbiAgICAgICAgcmV0dXJuIHJlZnJlc2hBdXRoVG9rZW4oaW5zdGFsbGF0aW9ucywgZm9yY2VSZWZyZXNoKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBhdXRoVG9rZW47XHJcbiAgICB9XHJcbn1cclxuLyoqXHJcbiAqIENhbGxlZCBvbmx5IGlmIHRoZXJlIGlzIGEgR2VuZXJhdGVBdXRoVG9rZW4gcmVxdWVzdCBpbiBwcm9ncmVzcy5cclxuICpcclxuICogVXBkYXRlcyB0aGUgSW5zdGFsbGF0aW9uRW50cnkgaW4gdGhlIERCIGJhc2VkIG9uIHRoZSBzdGF0dXMgb2YgdGhlXHJcbiAqIEdlbmVyYXRlQXV0aFRva2VuIHJlcXVlc3QuXHJcbiAqXHJcbiAqIFJldHVybnMgdGhlIHVwZGF0ZWQgSW5zdGFsbGF0aW9uRW50cnkuXHJcbiAqL1xyXG5mdW5jdGlvbiB1cGRhdGVBdXRoVG9rZW5SZXF1ZXN0KGFwcENvbmZpZykge1xyXG4gICAgcmV0dXJuIHVwZGF0ZShhcHBDb25maWcsIG9sZEVudHJ5ID0+IHtcclxuICAgICAgICBpZiAoIWlzRW50cnlSZWdpc3RlcmVkKG9sZEVudHJ5KSkge1xyXG4gICAgICAgICAgICB0aHJvdyBFUlJPUl9GQUNUT1JZLmNyZWF0ZShcIm5vdC1yZWdpc3RlcmVkXCIgLyogTk9UX1JFR0lTVEVSRUQgKi8pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBvbGRBdXRoVG9rZW4gPSBvbGRFbnRyeS5hdXRoVG9rZW47XHJcbiAgICAgICAgaWYgKGhhc0F1dGhUb2tlblJlcXVlc3RUaW1lZE91dChvbGRBdXRoVG9rZW4pKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIG9sZEVudHJ5KSwgeyBhdXRoVG9rZW46IHsgcmVxdWVzdFN0YXR1czogMCAvKiBOT1RfU1RBUlRFRCAqLyB9IH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gb2xkRW50cnk7XHJcbiAgICB9KTtcclxufVxyXG5hc3luYyBmdW5jdGlvbiBmZXRjaEF1dGhUb2tlbkZyb21TZXJ2ZXIoaW5zdGFsbGF0aW9ucywgaW5zdGFsbGF0aW9uRW50cnkpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgYXV0aFRva2VuID0gYXdhaXQgZ2VuZXJhdGVBdXRoVG9rZW5SZXF1ZXN0KGluc3RhbGxhdGlvbnMsIGluc3RhbGxhdGlvbkVudHJ5KTtcclxuICAgICAgICBjb25zdCB1cGRhdGVkSW5zdGFsbGF0aW9uRW50cnkgPSBPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIGluc3RhbGxhdGlvbkVudHJ5KSwgeyBhdXRoVG9rZW4gfSk7XHJcbiAgICAgICAgYXdhaXQgc2V0KGluc3RhbGxhdGlvbnMuYXBwQ29uZmlnLCB1cGRhdGVkSW5zdGFsbGF0aW9uRW50cnkpO1xyXG4gICAgICAgIHJldHVybiBhdXRoVG9rZW47XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgIGlmIChpc1NlcnZlckVycm9yKGUpICYmXHJcbiAgICAgICAgICAgIChlLmN1c3RvbURhdGEuc2VydmVyQ29kZSA9PT0gNDAxIHx8IGUuY3VzdG9tRGF0YS5zZXJ2ZXJDb2RlID09PSA0MDQpKSB7XHJcbiAgICAgICAgICAgIC8vIFNlcnZlciByZXR1cm5lZCBhIFwiRklEIG5vdCBmb3VuZFwiIG9yIGEgXCJJbnZhbGlkIGF1dGhlbnRpY2F0aW9uXCIgZXJyb3IuXHJcbiAgICAgICAgICAgIC8vIEdlbmVyYXRlIGEgbmV3IElEIG5leHQgdGltZS5cclxuICAgICAgICAgICAgYXdhaXQgcmVtb3ZlKGluc3RhbGxhdGlvbnMuYXBwQ29uZmlnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHVwZGF0ZWRJbnN0YWxsYXRpb25FbnRyeSA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgaW5zdGFsbGF0aW9uRW50cnkpLCB7IGF1dGhUb2tlbjogeyByZXF1ZXN0U3RhdHVzOiAwIC8qIE5PVF9TVEFSVEVEICovIH0gfSk7XHJcbiAgICAgICAgICAgIGF3YWl0IHNldChpbnN0YWxsYXRpb25zLmFwcENvbmZpZywgdXBkYXRlZEluc3RhbGxhdGlvbkVudHJ5KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhyb3cgZTtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBpc0VudHJ5UmVnaXN0ZXJlZChpbnN0YWxsYXRpb25FbnRyeSkge1xyXG4gICAgcmV0dXJuIChpbnN0YWxsYXRpb25FbnRyeSAhPT0gdW5kZWZpbmVkICYmXHJcbiAgICAgICAgaW5zdGFsbGF0aW9uRW50cnkucmVnaXN0cmF0aW9uU3RhdHVzID09PSAyIC8qIENPTVBMRVRFRCAqLyk7XHJcbn1cclxuZnVuY3Rpb24gaXNBdXRoVG9rZW5WYWxpZChhdXRoVG9rZW4pIHtcclxuICAgIHJldHVybiAoYXV0aFRva2VuLnJlcXVlc3RTdGF0dXMgPT09IDIgLyogQ09NUExFVEVEICovICYmXHJcbiAgICAgICAgIWlzQXV0aFRva2VuRXhwaXJlZChhdXRoVG9rZW4pKTtcclxufVxyXG5mdW5jdGlvbiBpc0F1dGhUb2tlbkV4cGlyZWQoYXV0aFRva2VuKSB7XHJcbiAgICBjb25zdCBub3cgPSBEYXRlLm5vdygpO1xyXG4gICAgcmV0dXJuIChub3cgPCBhdXRoVG9rZW4uY3JlYXRpb25UaW1lIHx8XHJcbiAgICAgICAgYXV0aFRva2VuLmNyZWF0aW9uVGltZSArIGF1dGhUb2tlbi5leHBpcmVzSW4gPCBub3cgKyBUT0tFTl9FWFBJUkFUSU9OX0JVRkZFUik7XHJcbn1cclxuLyoqIFJldHVybnMgYW4gdXBkYXRlZCBJbnN0YWxsYXRpb25FbnRyeSB3aXRoIGFuIEluUHJvZ3Jlc3NBdXRoVG9rZW4uICovXHJcbmZ1bmN0aW9uIG1ha2VBdXRoVG9rZW5SZXF1ZXN0SW5Qcm9ncmVzc0VudHJ5KG9sZEVudHJ5KSB7XHJcbiAgICBjb25zdCBpblByb2dyZXNzQXV0aFRva2VuID0ge1xyXG4gICAgICAgIHJlcXVlc3RTdGF0dXM6IDEgLyogSU5fUFJPR1JFU1MgKi8sXHJcbiAgICAgICAgcmVxdWVzdFRpbWU6IERhdGUubm93KClcclxuICAgIH07XHJcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCBvbGRFbnRyeSksIHsgYXV0aFRva2VuOiBpblByb2dyZXNzQXV0aFRva2VuIH0pO1xyXG59XHJcbmZ1bmN0aW9uIGhhc0F1dGhUb2tlblJlcXVlc3RUaW1lZE91dChhdXRoVG9rZW4pIHtcclxuICAgIHJldHVybiAoYXV0aFRva2VuLnJlcXVlc3RTdGF0dXMgPT09IDEgLyogSU5fUFJPR1JFU1MgKi8gJiZcclxuICAgICAgICBhdXRoVG9rZW4ucmVxdWVzdFRpbWUgKyBQRU5ESU5HX1RJTUVPVVRfTVMgPCBEYXRlLm5vdygpKTtcclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG4vKipcclxuICogQ3JlYXRlcyBhIEZpcmViYXNlIEluc3RhbGxhdGlvbiBpZiB0aGVyZSBpc24ndCBvbmUgZm9yIHRoZSBhcHAgYW5kXHJcbiAqIHJldHVybnMgdGhlIEluc3RhbGxhdGlvbiBJRC5cclxuICogQHBhcmFtIGluc3RhbGxhdGlvbnMgLSBUaGUgYEluc3RhbGxhdGlvbnNgIGluc3RhbmNlLlxyXG4gKlxyXG4gKiBAcHVibGljXHJcbiAqL1xyXG5hc3luYyBmdW5jdGlvbiBnZXRJZChpbnN0YWxsYXRpb25zKSB7XHJcbiAgICBjb25zdCBpbnN0YWxsYXRpb25zSW1wbCA9IGluc3RhbGxhdGlvbnM7XHJcbiAgICBjb25zdCB7IGluc3RhbGxhdGlvbkVudHJ5LCByZWdpc3RyYXRpb25Qcm9taXNlIH0gPSBhd2FpdCBnZXRJbnN0YWxsYXRpb25FbnRyeShpbnN0YWxsYXRpb25zSW1wbCk7XHJcbiAgICBpZiAocmVnaXN0cmF0aW9uUHJvbWlzZSkge1xyXG4gICAgICAgIHJlZ2lzdHJhdGlvblByb21pc2UuY2F0Y2goY29uc29sZS5lcnJvcik7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICAvLyBJZiB0aGUgaW5zdGFsbGF0aW9uIGlzIGFscmVhZHkgcmVnaXN0ZXJlZCwgdXBkYXRlIHRoZSBhdXRoZW50aWNhdGlvblxyXG4gICAgICAgIC8vIHRva2VuIGlmIG5lZWRlZC5cclxuICAgICAgICByZWZyZXNoQXV0aFRva2VuKGluc3RhbGxhdGlvbnNJbXBsKS5jYXRjaChjb25zb2xlLmVycm9yKTtcclxuICAgIH1cclxuICAgIHJldHVybiBpbnN0YWxsYXRpb25FbnRyeS5maWQ7XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqXHJcbiAqIFJldHVybnMgYSBGaXJlYmFzZSBJbnN0YWxsYXRpb25zIGF1dGggdG9rZW4sIGlkZW50aWZ5aW5nIHRoZSBjdXJyZW50XHJcbiAqIEZpcmViYXNlIEluc3RhbGxhdGlvbi5cclxuICogQHBhcmFtIGluc3RhbGxhdGlvbnMgLSBUaGUgYEluc3RhbGxhdGlvbnNgIGluc3RhbmNlLlxyXG4gKiBAcGFyYW0gZm9yY2VSZWZyZXNoIC0gRm9yY2UgcmVmcmVzaCByZWdhcmRsZXNzIG9mIHRva2VuIGV4cGlyYXRpb24uXHJcbiAqXHJcbiAqIEBwdWJsaWNcclxuICovXHJcbmFzeW5jIGZ1bmN0aW9uIGdldFRva2VuKGluc3RhbGxhdGlvbnMsIGZvcmNlUmVmcmVzaCA9IGZhbHNlKSB7XHJcbiAgICBjb25zdCBpbnN0YWxsYXRpb25zSW1wbCA9IGluc3RhbGxhdGlvbnM7XHJcbiAgICBhd2FpdCBjb21wbGV0ZUluc3RhbGxhdGlvblJlZ2lzdHJhdGlvbihpbnN0YWxsYXRpb25zSW1wbCk7XHJcbiAgICAvLyBBdCB0aGlzIHBvaW50IHdlIGVpdGhlciBoYXZlIGEgUmVnaXN0ZXJlZCBJbnN0YWxsYXRpb24gaW4gdGhlIERCLCBvciB3ZSd2ZVxyXG4gICAgLy8gYWxyZWFkeSB0aHJvd24gYW4gZXJyb3IuXHJcbiAgICBjb25zdCBhdXRoVG9rZW4gPSBhd2FpdCByZWZyZXNoQXV0aFRva2VuKGluc3RhbGxhdGlvbnNJbXBsLCBmb3JjZVJlZnJlc2gpO1xyXG4gICAgcmV0dXJuIGF1dGhUb2tlbi50b2tlbjtcclxufVxyXG5hc3luYyBmdW5jdGlvbiBjb21wbGV0ZUluc3RhbGxhdGlvblJlZ2lzdHJhdGlvbihpbnN0YWxsYXRpb25zKSB7XHJcbiAgICBjb25zdCB7IHJlZ2lzdHJhdGlvblByb21pc2UgfSA9IGF3YWl0IGdldEluc3RhbGxhdGlvbkVudHJ5KGluc3RhbGxhdGlvbnMpO1xyXG4gICAgaWYgKHJlZ2lzdHJhdGlvblByb21pc2UpIHtcclxuICAgICAgICAvLyBBIGNyZWF0ZUluc3RhbGxhdGlvbiByZXF1ZXN0IGlzIGluIHByb2dyZXNzLiBXYWl0IHVudGlsIGl0IGZpbmlzaGVzLlxyXG4gICAgICAgIGF3YWl0IHJlZ2lzdHJhdGlvblByb21pc2U7XHJcbiAgICB9XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuYXN5bmMgZnVuY3Rpb24gZGVsZXRlSW5zdGFsbGF0aW9uUmVxdWVzdChhcHBDb25maWcsIGluc3RhbGxhdGlvbkVudHJ5KSB7XHJcbiAgICBjb25zdCBlbmRwb2ludCA9IGdldERlbGV0ZUVuZHBvaW50KGFwcENvbmZpZywgaW5zdGFsbGF0aW9uRW50cnkpO1xyXG4gICAgY29uc3QgaGVhZGVycyA9IGdldEhlYWRlcnNXaXRoQXV0aChhcHBDb25maWcsIGluc3RhbGxhdGlvbkVudHJ5KTtcclxuICAgIGNvbnN0IHJlcXVlc3QgPSB7XHJcbiAgICAgICAgbWV0aG9kOiAnREVMRVRFJyxcclxuICAgICAgICBoZWFkZXJzXHJcbiAgICB9O1xyXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCByZXRyeUlmU2VydmVyRXJyb3IoKCkgPT4gZmV0Y2goZW5kcG9pbnQsIHJlcXVlc3QpKTtcclxuICAgIGlmICghcmVzcG9uc2Uub2spIHtcclxuICAgICAgICB0aHJvdyBhd2FpdCBnZXRFcnJvckZyb21SZXNwb25zZSgnRGVsZXRlIEluc3RhbGxhdGlvbicsIHJlc3BvbnNlKTtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBnZXREZWxldGVFbmRwb2ludChhcHBDb25maWcsIHsgZmlkIH0pIHtcclxuICAgIHJldHVybiBgJHtnZXRJbnN0YWxsYXRpb25zRW5kcG9pbnQoYXBwQ29uZmlnKX0vJHtmaWR9YDtcclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG4vKipcclxuICogRGVsZXRlcyB0aGUgRmlyZWJhc2UgSW5zdGFsbGF0aW9uIGFuZCBhbGwgYXNzb2NpYXRlZCBkYXRhLlxyXG4gKiBAcGFyYW0gaW5zdGFsbGF0aW9ucyAtIFRoZSBgSW5zdGFsbGF0aW9uc2AgaW5zdGFuY2UuXHJcbiAqXHJcbiAqIEBwdWJsaWNcclxuICovXHJcbmFzeW5jIGZ1bmN0aW9uIGRlbGV0ZUluc3RhbGxhdGlvbnMoaW5zdGFsbGF0aW9ucykge1xyXG4gICAgY29uc3QgeyBhcHBDb25maWcgfSA9IGluc3RhbGxhdGlvbnM7XHJcbiAgICBjb25zdCBlbnRyeSA9IGF3YWl0IHVwZGF0ZShhcHBDb25maWcsIG9sZEVudHJ5ID0+IHtcclxuICAgICAgICBpZiAob2xkRW50cnkgJiYgb2xkRW50cnkucmVnaXN0cmF0aW9uU3RhdHVzID09PSAwIC8qIE5PVF9TVEFSVEVEICovKSB7XHJcbiAgICAgICAgICAgIC8vIERlbGV0ZSB0aGUgdW5yZWdpc3RlcmVkIGVudHJ5IHdpdGhvdXQgc2VuZGluZyBhIGRlbGV0ZUluc3RhbGxhdGlvbiByZXF1ZXN0LlxyXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gb2xkRW50cnk7XHJcbiAgICB9KTtcclxuICAgIGlmIChlbnRyeSkge1xyXG4gICAgICAgIGlmIChlbnRyeS5yZWdpc3RyYXRpb25TdGF0dXMgPT09IDEgLyogSU5fUFJPR1JFU1MgKi8pIHtcclxuICAgICAgICAgICAgLy8gQ2FuJ3QgZGVsZXRlIHdoaWxlIHRyeWluZyB0byByZWdpc3Rlci5cclxuICAgICAgICAgICAgdGhyb3cgRVJST1JfRkFDVE9SWS5jcmVhdGUoXCJkZWxldGUtcGVuZGluZy1yZWdpc3RyYXRpb25cIiAvKiBERUxFVEVfUEVORElOR19SRUdJU1RSQVRJT04gKi8pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChlbnRyeS5yZWdpc3RyYXRpb25TdGF0dXMgPT09IDIgLyogQ09NUExFVEVEICovKSB7XHJcbiAgICAgICAgICAgIGlmICghbmF2aWdhdG9yLm9uTGluZSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgRVJST1JfRkFDVE9SWS5jcmVhdGUoXCJhcHAtb2ZmbGluZVwiIC8qIEFQUF9PRkZMSU5FICovKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGF3YWl0IGRlbGV0ZUluc3RhbGxhdGlvblJlcXVlc3QoYXBwQ29uZmlnLCBlbnRyeSk7XHJcbiAgICAgICAgICAgICAgICBhd2FpdCByZW1vdmUoYXBwQ29uZmlnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG4vKipcclxuICogU2V0cyBhIG5ldyBjYWxsYmFjayB0aGF0IHdpbGwgZ2V0IGNhbGxlZCB3aGVuIEluc3RhbGxhdGlvbiBJRCBjaGFuZ2VzLlxyXG4gKiBSZXR1cm5zIGFuIHVuc3Vic2NyaWJlIGZ1bmN0aW9uIHRoYXQgd2lsbCByZW1vdmUgdGhlIGNhbGxiYWNrIHdoZW4gY2FsbGVkLlxyXG4gKiBAcGFyYW0gaW5zdGFsbGF0aW9ucyAtIFRoZSBgSW5zdGFsbGF0aW9uc2AgaW5zdGFuY2UuXHJcbiAqIEBwYXJhbSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayBmdW5jdGlvbiB0aGF0IGlzIGludm9rZWQgd2hlbiBGSUQgY2hhbmdlcy5cclxuICogQHJldHVybnMgQSBmdW5jdGlvbiB0aGF0IGNhbiBiZSBjYWxsZWQgdG8gdW5zdWJzY3JpYmUuXHJcbiAqXHJcbiAqIEBwdWJsaWNcclxuICovXHJcbmZ1bmN0aW9uIG9uSWRDaGFuZ2UoaW5zdGFsbGF0aW9ucywgY2FsbGJhY2spIHtcclxuICAgIGNvbnN0IHsgYXBwQ29uZmlnIH0gPSBpbnN0YWxsYXRpb25zO1xyXG4gICAgYWRkQ2FsbGJhY2soYXBwQ29uZmlnLCBjYWxsYmFjayk7XHJcbiAgICByZXR1cm4gKCkgPT4ge1xyXG4gICAgICAgIHJlbW92ZUNhbGxiYWNrKGFwcENvbmZpZywgY2FsbGJhY2spO1xyXG4gICAgfTtcclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG4vKipcclxuICogUmV0dXJucyBhbiBpbnN0YW5jZSBvZiB7QGxpbmsgSW5zdGFsbGF0aW9uc30gYXNzb2NpYXRlZCB3aXRoIHRoZSBnaXZlblxyXG4gKiB7QGxpbmsgQGZpcmViYXNlL2FwcCNGaXJlYmFzZUFwcH0gaW5zdGFuY2UuXHJcbiAqIEBwYXJhbSBhcHAgLSBUaGUge0BsaW5rIEBmaXJlYmFzZS9hcHAjRmlyZWJhc2VBcHB9IGluc3RhbmNlLlxyXG4gKlxyXG4gKiBAcHVibGljXHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRJbnN0YWxsYXRpb25zKGFwcCA9IGdldEFwcCgpKSB7XHJcbiAgICBjb25zdCBpbnN0YWxsYXRpb25zSW1wbCA9IF9nZXRQcm92aWRlcihhcHAsICdpbnN0YWxsYXRpb25zJykuZ2V0SW1tZWRpYXRlKCk7XHJcbiAgICByZXR1cm4gaW5zdGFsbGF0aW9uc0ltcGw7XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuZnVuY3Rpb24gZXh0cmFjdEFwcENvbmZpZyhhcHApIHtcclxuICAgIGlmICghYXBwIHx8ICFhcHAub3B0aW9ucykge1xyXG4gICAgICAgIHRocm93IGdldE1pc3NpbmdWYWx1ZUVycm9yKCdBcHAgQ29uZmlndXJhdGlvbicpO1xyXG4gICAgfVxyXG4gICAgaWYgKCFhcHAubmFtZSkge1xyXG4gICAgICAgIHRocm93IGdldE1pc3NpbmdWYWx1ZUVycm9yKCdBcHAgTmFtZScpO1xyXG4gICAgfVxyXG4gICAgLy8gUmVxdWlyZWQgYXBwIGNvbmZpZyBrZXlzXHJcbiAgICBjb25zdCBjb25maWdLZXlzID0gW1xyXG4gICAgICAgICdwcm9qZWN0SWQnLFxyXG4gICAgICAgICdhcGlLZXknLFxyXG4gICAgICAgICdhcHBJZCdcclxuICAgIF07XHJcbiAgICBmb3IgKGNvbnN0IGtleU5hbWUgb2YgY29uZmlnS2V5cykge1xyXG4gICAgICAgIGlmICghYXBwLm9wdGlvbnNba2V5TmFtZV0pIHtcclxuICAgICAgICAgICAgdGhyb3cgZ2V0TWlzc2luZ1ZhbHVlRXJyb3Ioa2V5TmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBhcHBOYW1lOiBhcHAubmFtZSxcclxuICAgICAgICBwcm9qZWN0SWQ6IGFwcC5vcHRpb25zLnByb2plY3RJZCxcclxuICAgICAgICBhcGlLZXk6IGFwcC5vcHRpb25zLmFwaUtleSxcclxuICAgICAgICBhcHBJZDogYXBwLm9wdGlvbnMuYXBwSWRcclxuICAgIH07XHJcbn1cclxuZnVuY3Rpb24gZ2V0TWlzc2luZ1ZhbHVlRXJyb3IodmFsdWVOYW1lKSB7XHJcbiAgICByZXR1cm4gRVJST1JfRkFDVE9SWS5jcmVhdGUoXCJtaXNzaW5nLWFwcC1jb25maWctdmFsdWVzXCIgLyogTUlTU0lOR19BUFBfQ09ORklHX1ZBTFVFUyAqLywge1xyXG4gICAgICAgIHZhbHVlTmFtZVxyXG4gICAgfSk7XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuY29uc3QgSU5TVEFMTEFUSU9OU19OQU1FID0gJ2luc3RhbGxhdGlvbnMnO1xyXG5jb25zdCBJTlNUQUxMQVRJT05TX05BTUVfSU5URVJOQUwgPSAnaW5zdGFsbGF0aW9ucy1pbnRlcm5hbCc7XHJcbmNvbnN0IHB1YmxpY0ZhY3RvcnkgPSAoY29udGFpbmVyKSA9PiB7XHJcbiAgICBjb25zdCBhcHAgPSBjb250YWluZXIuZ2V0UHJvdmlkZXIoJ2FwcCcpLmdldEltbWVkaWF0ZSgpO1xyXG4gICAgLy8gVGhyb3dzIGlmIGFwcCBpc24ndCBjb25maWd1cmVkIHByb3Blcmx5LlxyXG4gICAgY29uc3QgYXBwQ29uZmlnID0gZXh0cmFjdEFwcENvbmZpZyhhcHApO1xyXG4gICAgY29uc3QgaGVhcnRiZWF0U2VydmljZVByb3ZpZGVyID0gX2dldFByb3ZpZGVyKGFwcCwgJ2hlYXJ0YmVhdCcpO1xyXG4gICAgY29uc3QgaW5zdGFsbGF0aW9uc0ltcGwgPSB7XHJcbiAgICAgICAgYXBwLFxyXG4gICAgICAgIGFwcENvbmZpZyxcclxuICAgICAgICBoZWFydGJlYXRTZXJ2aWNlUHJvdmlkZXIsXHJcbiAgICAgICAgX2RlbGV0ZTogKCkgPT4gUHJvbWlzZS5yZXNvbHZlKClcclxuICAgIH07XHJcbiAgICByZXR1cm4gaW5zdGFsbGF0aW9uc0ltcGw7XHJcbn07XHJcbmNvbnN0IGludGVybmFsRmFjdG9yeSA9IChjb250YWluZXIpID0+IHtcclxuICAgIGNvbnN0IGFwcCA9IGNvbnRhaW5lci5nZXRQcm92aWRlcignYXBwJykuZ2V0SW1tZWRpYXRlKCk7XHJcbiAgICAvLyBJbnRlcm5hbCBGSVMgaW5zdGFuY2UgcmVsaWVzIG9uIHB1YmxpYyBGSVMgaW5zdGFuY2UuXHJcbiAgICBjb25zdCBpbnN0YWxsYXRpb25zID0gX2dldFByb3ZpZGVyKGFwcCwgSU5TVEFMTEFUSU9OU19OQU1FKS5nZXRJbW1lZGlhdGUoKTtcclxuICAgIGNvbnN0IGluc3RhbGxhdGlvbnNJbnRlcm5hbCA9IHtcclxuICAgICAgICBnZXRJZDogKCkgPT4gZ2V0SWQoaW5zdGFsbGF0aW9ucyksXHJcbiAgICAgICAgZ2V0VG9rZW46IChmb3JjZVJlZnJlc2gpID0+IGdldFRva2VuKGluc3RhbGxhdGlvbnMsIGZvcmNlUmVmcmVzaClcclxuICAgIH07XHJcbiAgICByZXR1cm4gaW5zdGFsbGF0aW9uc0ludGVybmFsO1xyXG59O1xyXG5mdW5jdGlvbiByZWdpc3Rlckluc3RhbGxhdGlvbnMoKSB7XHJcbiAgICBfcmVnaXN0ZXJDb21wb25lbnQobmV3IENvbXBvbmVudChJTlNUQUxMQVRJT05TX05BTUUsIHB1YmxpY0ZhY3RvcnksIFwiUFVCTElDXCIgLyogUFVCTElDICovKSk7XHJcbiAgICBfcmVnaXN0ZXJDb21wb25lbnQobmV3IENvbXBvbmVudChJTlNUQUxMQVRJT05TX05BTUVfSU5URVJOQUwsIGludGVybmFsRmFjdG9yeSwgXCJQUklWQVRFXCIgLyogUFJJVkFURSAqLykpO1xyXG59XG5cbi8qKlxyXG4gKiBGaXJlYmFzZSBJbnN0YWxsYXRpb25zXHJcbiAqXHJcbiAqIEBwYWNrYWdlRG9jdW1lbnRhdGlvblxyXG4gKi9cclxucmVnaXN0ZXJJbnN0YWxsYXRpb25zKCk7XHJcbnJlZ2lzdGVyVmVyc2lvbihuYW1lLCB2ZXJzaW9uKTtcclxuLy8gQlVJTERfVEFSR0VUIHdpbGwgYmUgcmVwbGFjZWQgYnkgdmFsdWVzIGxpa2UgZXNtNSwgZXNtMjAxNywgY2pzNSwgZXRjIGR1cmluZyB0aGUgY29tcGlsYXRpb25cclxucmVnaXN0ZXJWZXJzaW9uKG5hbWUsIHZlcnNpb24sICdlc20yMDE3Jyk7XG5cbmV4cG9ydCB7IGRlbGV0ZUluc3RhbGxhdGlvbnMsIGdldElkLCBnZXRJbnN0YWxsYXRpb25zLCBnZXRUb2tlbiwgb25JZENoYW5nZSB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguZXNtMjAxNy5qcy5tYXBcbiIsImltcG9ydCB7IGdldEFwcCwgX2dldFByb3ZpZGVyLCBfcmVnaXN0ZXJDb21wb25lbnQsIHJlZ2lzdGVyVmVyc2lvbiB9IGZyb20gJ0BmaXJlYmFzZS9hcHAnO1xuaW1wb3J0IHsgTG9nZ2VyIH0gZnJvbSAnQGZpcmViYXNlL2xvZ2dlcic7XG5pbXBvcnQgeyBFcnJvckZhY3RvcnksIGNhbGN1bGF0ZUJhY2tvZmZNaWxsaXMsIEZpcmViYXNlRXJyb3IsIGlzSW5kZXhlZERCQXZhaWxhYmxlLCB2YWxpZGF0ZUluZGV4ZWREQk9wZW5hYmxlLCBpc0Jyb3dzZXJFeHRlbnNpb24sIGFyZUNvb2tpZXNFbmFibGVkLCBnZXRNb2R1bGFySW5zdGFuY2UsIGRlZXBFcXVhbCB9IGZyb20gJ0BmaXJlYmFzZS91dGlsJztcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJ0BmaXJlYmFzZS9jb21wb25lbnQnO1xuaW1wb3J0ICdAZmlyZWJhc2UvaW5zdGFsbGF0aW9ucyc7XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbi8qKlxyXG4gKiBUeXBlIGNvbnN0YW50IGZvciBGaXJlYmFzZSBBbmFseXRpY3MuXHJcbiAqL1xyXG5jb25zdCBBTkFMWVRJQ1NfVFlQRSA9ICdhbmFseXRpY3MnO1xyXG4vLyBLZXkgdG8gYXR0YWNoIEZJRCB0byBpbiBndGFnIHBhcmFtcy5cclxuY29uc3QgR0FfRklEX0tFWSA9ICdmaXJlYmFzZV9pZCc7XHJcbmNvbnN0IE9SSUdJTl9LRVkgPSAnb3JpZ2luJztcclxuY29uc3QgRkVUQ0hfVElNRU9VVF9NSUxMSVMgPSA2MCAqIDEwMDA7XHJcbmNvbnN0IERZTkFNSUNfQ09ORklHX1VSTCA9ICdodHRwczovL2ZpcmViYXNlLmdvb2dsZWFwaXMuY29tL3YxYWxwaGEvcHJvamVjdHMvLS9hcHBzL3thcHAtaWR9L3dlYkNvbmZpZyc7XHJcbmNvbnN0IEdUQUdfVVJMID0gJ2h0dHBzOi8vd3d3Lmdvb2dsZXRhZ21hbmFnZXIuY29tL2d0YWcvanMnO1xuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5jb25zdCBsb2dnZXIgPSBuZXcgTG9nZ2VyKCdAZmlyZWJhc2UvYW5hbHl0aWNzJyk7XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbi8qKlxyXG4gKiBNYWtlc2hpZnQgcG9seWZpbGwgZm9yIFByb21pc2UuYWxsU2V0dGxlZCgpLiBSZXNvbHZlcyB3aGVuIGFsbCBwcm9taXNlc1xyXG4gKiBoYXZlIGVpdGhlciByZXNvbHZlZCBvciByZWplY3RlZC5cclxuICpcclxuICogQHBhcmFtIHByb21pc2VzIEFycmF5IG9mIHByb21pc2VzIHRvIHdhaXQgZm9yLlxyXG4gKi9cclxuZnVuY3Rpb24gcHJvbWlzZUFsbFNldHRsZWQocHJvbWlzZXMpIHtcclxuICAgIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcy5tYXAocHJvbWlzZSA9PiBwcm9taXNlLmNhdGNoKGUgPT4gZSkpKTtcclxufVxyXG4vKipcclxuICogSW5zZXJ0cyBndGFnIHNjcmlwdCB0YWcgaW50byB0aGUgcGFnZSB0byBhc3luY2hyb25vdXNseSBkb3dubG9hZCBndGFnLlxyXG4gKiBAcGFyYW0gZGF0YUxheWVyTmFtZSBOYW1lIG9mIGRhdGFsYXllciAobW9zdCBvZnRlbiB0aGUgZGVmYXVsdCwgXCJfZGF0YUxheWVyXCIpLlxyXG4gKi9cclxuZnVuY3Rpb24gaW5zZXJ0U2NyaXB0VGFnKGRhdGFMYXllck5hbWUsIG1lYXN1cmVtZW50SWQpIHtcclxuICAgIGNvbnN0IHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xyXG4gICAgLy8gV2UgYXJlIG5vdCBwcm92aWRpbmcgYW4gYW5hbHl0aWNzSWQgaW4gdGhlIFVSTCBiZWNhdXNlIGl0IHdvdWxkIHRyaWdnZXIgYSBgcGFnZV92aWV3YFxyXG4gICAgLy8gd2l0aG91dCBmaWQuIFdlIHdpbGwgaW5pdGlhbGl6ZSBnYS1pZCB1c2luZyBndGFnIChjb25maWcpIGNvbW1hbmQgdG9nZXRoZXIgd2l0aCBmaWQuXHJcbiAgICBzY3JpcHQuc3JjID0gYCR7R1RBR19VUkx9P2w9JHtkYXRhTGF5ZXJOYW1lfSZpZD0ke21lYXN1cmVtZW50SWR9YDtcclxuICAgIHNjcmlwdC5hc3luYyA9IHRydWU7XHJcbiAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHNjcmlwdCk7XHJcbn1cclxuLyoqXHJcbiAqIEdldCByZWZlcmVuY2UgdG8sIG9yIGNyZWF0ZSwgZ2xvYmFsIGRhdGFsYXllci5cclxuICogQHBhcmFtIGRhdGFMYXllck5hbWUgTmFtZSBvZiBkYXRhbGF5ZXIgKG1vc3Qgb2Z0ZW4gdGhlIGRlZmF1bHQsIFwiX2RhdGFMYXllclwiKS5cclxuICovXHJcbmZ1bmN0aW9uIGdldE9yQ3JlYXRlRGF0YUxheWVyKGRhdGFMYXllck5hbWUpIHtcclxuICAgIC8vIENoZWNrIGZvciBleGlzdGluZyBkYXRhTGF5ZXIgYW5kIGNyZWF0ZSBpZiBuZWVkZWQuXHJcbiAgICBsZXQgZGF0YUxheWVyID0gW107XHJcbiAgICBpZiAoQXJyYXkuaXNBcnJheSh3aW5kb3dbZGF0YUxheWVyTmFtZV0pKSB7XHJcbiAgICAgICAgZGF0YUxheWVyID0gd2luZG93W2RhdGFMYXllck5hbWVdO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgd2luZG93W2RhdGFMYXllck5hbWVdID0gZGF0YUxheWVyO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGRhdGFMYXllcjtcclxufVxyXG4vKipcclxuICogV3JhcHBlZCBndGFnIGxvZ2ljIHdoZW4gZ3RhZyBpcyBjYWxsZWQgd2l0aCAnY29uZmlnJyBjb21tYW5kLlxyXG4gKlxyXG4gKiBAcGFyYW0gZ3RhZ0NvcmUgQmFzaWMgZ3RhZyBmdW5jdGlvbiB0aGF0IGp1c3QgYXBwZW5kcyB0byBkYXRhTGF5ZXIuXHJcbiAqIEBwYXJhbSBpbml0aWFsaXphdGlvblByb21pc2VzTWFwIE1hcCBvZiBhcHBJZHMgdG8gdGhlaXIgaW5pdGlhbGl6YXRpb24gcHJvbWlzZXMuXHJcbiAqIEBwYXJhbSBkeW5hbWljQ29uZmlnUHJvbWlzZXNMaXN0IEFycmF5IG9mIGR5bmFtaWMgY29uZmlnIGZldGNoIHByb21pc2VzLlxyXG4gKiBAcGFyYW0gbWVhc3VyZW1lbnRJZFRvQXBwSWQgTWFwIG9mIEdBIG1lYXN1cmVtZW50SURzIHRvIGNvcnJlc3BvbmRpbmcgRmlyZWJhc2UgYXBwSWQuXHJcbiAqIEBwYXJhbSBtZWFzdXJlbWVudElkIEdBIE1lYXN1cmVtZW50IElEIHRvIHNldCBjb25maWcgZm9yLlxyXG4gKiBAcGFyYW0gZ3RhZ1BhcmFtcyBHdGFnIGNvbmZpZyBwYXJhbXMgdG8gc2V0LlxyXG4gKi9cclxuYXN5bmMgZnVuY3Rpb24gZ3RhZ09uQ29uZmlnKGd0YWdDb3JlLCBpbml0aWFsaXphdGlvblByb21pc2VzTWFwLCBkeW5hbWljQ29uZmlnUHJvbWlzZXNMaXN0LCBtZWFzdXJlbWVudElkVG9BcHBJZCwgbWVhc3VyZW1lbnRJZCwgZ3RhZ1BhcmFtcykge1xyXG4gICAgLy8gSWYgY29uZmlnIGlzIGFscmVhZHkgZmV0Y2hlZCwgd2Uga25vdyB0aGUgYXBwSWQgYW5kIGNhbiB1c2UgaXQgdG8gbG9vayB1cCB3aGF0IEZJRCBwcm9taXNlIHdlXHJcbiAgICAvLy8gYXJlIHdhaXRpbmcgZm9yLCBhbmQgd2FpdCBvbmx5IG9uIHRoYXQgb25lLlxyXG4gICAgY29uc3QgY29ycmVzcG9uZGluZ0FwcElkID0gbWVhc3VyZW1lbnRJZFRvQXBwSWRbbWVhc3VyZW1lbnRJZF07XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGlmIChjb3JyZXNwb25kaW5nQXBwSWQpIHtcclxuICAgICAgICAgICAgYXdhaXQgaW5pdGlhbGl6YXRpb25Qcm9taXNlc01hcFtjb3JyZXNwb25kaW5nQXBwSWRdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgLy8gSWYgY29uZmlnIGlzIG5vdCBmZXRjaGVkIHlldCwgd2FpdCBmb3IgYWxsIGNvbmZpZ3MgKHdlIGRvbid0IGtub3cgd2hpY2ggb25lIHdlIG5lZWQpIGFuZFxyXG4gICAgICAgICAgICAvLyBmaW5kIHRoZSBhcHBJZCAoaWYgYW55KSBjb3JyZXNwb25kaW5nIHRvIHRoaXMgbWVhc3VyZW1lbnRJZC4gSWYgdGhlcmUgaXMgb25lLCB3YWl0IG9uXHJcbiAgICAgICAgICAgIC8vIHRoYXQgYXBwSWQncyBpbml0aWFsaXphdGlvbiBwcm9taXNlLiBJZiB0aGVyZSBpcyBub25lLCBwcm9taXNlIHJlc29sdmVzIGFuZCBndGFnXHJcbiAgICAgICAgICAgIC8vIGNhbGwgZ29lcyB0aHJvdWdoLlxyXG4gICAgICAgICAgICBjb25zdCBkeW5hbWljQ29uZmlnUmVzdWx0cyA9IGF3YWl0IHByb21pc2VBbGxTZXR0bGVkKGR5bmFtaWNDb25maWdQcm9taXNlc0xpc3QpO1xyXG4gICAgICAgICAgICBjb25zdCBmb3VuZENvbmZpZyA9IGR5bmFtaWNDb25maWdSZXN1bHRzLmZpbmQoY29uZmlnID0+IGNvbmZpZy5tZWFzdXJlbWVudElkID09PSBtZWFzdXJlbWVudElkKTtcclxuICAgICAgICAgICAgaWYgKGZvdW5kQ29uZmlnKSB7XHJcbiAgICAgICAgICAgICAgICBhd2FpdCBpbml0aWFsaXphdGlvblByb21pc2VzTWFwW2ZvdW5kQ29uZmlnLmFwcElkXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgbG9nZ2VyLmVycm9yKGUpO1xyXG4gICAgfVxyXG4gICAgZ3RhZ0NvcmUoXCJjb25maWdcIiAvKiBDT05GSUcgKi8sIG1lYXN1cmVtZW50SWQsIGd0YWdQYXJhbXMpO1xyXG59XHJcbi8qKlxyXG4gKiBXcmFwcGVkIGd0YWcgbG9naWMgd2hlbiBndGFnIGlzIGNhbGxlZCB3aXRoICdldmVudCcgY29tbWFuZC5cclxuICpcclxuICogQHBhcmFtIGd0YWdDb3JlIEJhc2ljIGd0YWcgZnVuY3Rpb24gdGhhdCBqdXN0IGFwcGVuZHMgdG8gZGF0YUxheWVyLlxyXG4gKiBAcGFyYW0gaW5pdGlhbGl6YXRpb25Qcm9taXNlc01hcCBNYXAgb2YgYXBwSWRzIHRvIHRoZWlyIGluaXRpYWxpemF0aW9uIHByb21pc2VzLlxyXG4gKiBAcGFyYW0gZHluYW1pY0NvbmZpZ1Byb21pc2VzTGlzdCBBcnJheSBvZiBkeW5hbWljIGNvbmZpZyBmZXRjaCBwcm9taXNlcy5cclxuICogQHBhcmFtIG1lYXN1cmVtZW50SWQgR0EgTWVhc3VyZW1lbnQgSUQgdG8gbG9nIGV2ZW50IHRvLlxyXG4gKiBAcGFyYW0gZ3RhZ1BhcmFtcyBQYXJhbXMgdG8gbG9nIHdpdGggdGhpcyBldmVudC5cclxuICovXHJcbmFzeW5jIGZ1bmN0aW9uIGd0YWdPbkV2ZW50KGd0YWdDb3JlLCBpbml0aWFsaXphdGlvblByb21pc2VzTWFwLCBkeW5hbWljQ29uZmlnUHJvbWlzZXNMaXN0LCBtZWFzdXJlbWVudElkLCBndGFnUGFyYW1zKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGxldCBpbml0aWFsaXphdGlvblByb21pc2VzVG9XYWl0Rm9yID0gW107XHJcbiAgICAgICAgLy8gSWYgdGhlcmUncyBhICdzZW5kX3RvJyBwYXJhbSwgY2hlY2sgaWYgYW55IElEIHNwZWNpZmllZCBtYXRjaGVzXHJcbiAgICAgICAgLy8gYW4gaW5pdGlhbGl6ZUlkcygpIHByb21pc2Ugd2UgYXJlIHdhaXRpbmcgZm9yLlxyXG4gICAgICAgIGlmIChndGFnUGFyYW1zICYmIGd0YWdQYXJhbXNbJ3NlbmRfdG8nXSkge1xyXG4gICAgICAgICAgICBsZXQgZ2FTZW5kVG9MaXN0ID0gZ3RhZ1BhcmFtc1snc2VuZF90byddO1xyXG4gICAgICAgICAgICAvLyBNYWtlIGl0IGFuIGFycmF5IGlmIGlzIGlzbid0LCBzbyBpdCBjYW4gYmUgZGVhbHQgd2l0aCB0aGUgc2FtZSB3YXkuXHJcbiAgICAgICAgICAgIGlmICghQXJyYXkuaXNBcnJheShnYVNlbmRUb0xpc3QpKSB7XHJcbiAgICAgICAgICAgICAgICBnYVNlbmRUb0xpc3QgPSBbZ2FTZW5kVG9MaXN0XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBDaGVja2luZyAnc2VuZF90bycgZmllbGRzIHJlcXVpcmVzIGhhdmluZyBhbGwgbWVhc3VyZW1lbnQgSUQgcmVzdWx0cyBiYWNrIGZyb21cclxuICAgICAgICAgICAgLy8gdGhlIGR5bmFtaWMgY29uZmlnIGZldGNoLlxyXG4gICAgICAgICAgICBjb25zdCBkeW5hbWljQ29uZmlnUmVzdWx0cyA9IGF3YWl0IHByb21pc2VBbGxTZXR0bGVkKGR5bmFtaWNDb25maWdQcm9taXNlc0xpc3QpO1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IHNlbmRUb0lkIG9mIGdhU2VuZFRvTGlzdCkge1xyXG4gICAgICAgICAgICAgICAgLy8gQW55IGZldGNoZWQgZHluYW1pYyBtZWFzdXJlbWVudCBJRCB0aGF0IG1hdGNoZXMgdGhpcyAnc2VuZF90bycgSURcclxuICAgICAgICAgICAgICAgIGNvbnN0IGZvdW5kQ29uZmlnID0gZHluYW1pY0NvbmZpZ1Jlc3VsdHMuZmluZChjb25maWcgPT4gY29uZmlnLm1lYXN1cmVtZW50SWQgPT09IHNlbmRUb0lkKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGluaXRpYWxpemF0aW9uUHJvbWlzZSA9IGZvdW5kQ29uZmlnICYmIGluaXRpYWxpemF0aW9uUHJvbWlzZXNNYXBbZm91bmRDb25maWcuYXBwSWRdO1xyXG4gICAgICAgICAgICAgICAgaWYgKGluaXRpYWxpemF0aW9uUHJvbWlzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGluaXRpYWxpemF0aW9uUHJvbWlzZXNUb1dhaXRGb3IucHVzaChpbml0aWFsaXphdGlvblByb21pc2UpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gRm91bmQgYW4gaXRlbSBpbiAnc2VuZF90bycgdGhhdCBpcyBub3QgYXNzb2NpYXRlZFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGRpcmVjdGx5IHdpdGggYW4gRklELCBwb3NzaWJseSBhIGdyb3VwLiAgRW1wdHkgdGhpcyBhcnJheSxcclxuICAgICAgICAgICAgICAgICAgICAvLyBleGl0IHRoZSBsb29wIGVhcmx5LCBhbmQgbGV0IGl0IGdldCBwb3B1bGF0ZWQgYmVsb3cuXHJcbiAgICAgICAgICAgICAgICAgICAgaW5pdGlhbGl6YXRpb25Qcm9taXNlc1RvV2FpdEZvciA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIFRoaXMgd2lsbCBiZSB1bnBvcHVsYXRlZCBpZiB0aGVyZSB3YXMgbm8gJ3NlbmRfdG8nIGZpZWxkICwgb3JcclxuICAgICAgICAvLyBpZiBub3QgYWxsIGVudHJpZXMgaW4gdGhlICdzZW5kX3RvJyBmaWVsZCBjb3VsZCBiZSBtYXBwZWQgdG9cclxuICAgICAgICAvLyBhIEZJRC4gSW4gdGhlc2UgY2FzZXMsIHdhaXQgb24gYWxsIHBlbmRpbmcgaW5pdGlhbGl6YXRpb24gcHJvbWlzZXMuXHJcbiAgICAgICAgaWYgKGluaXRpYWxpemF0aW9uUHJvbWlzZXNUb1dhaXRGb3IubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIGluaXRpYWxpemF0aW9uUHJvbWlzZXNUb1dhaXRGb3IgPSBPYmplY3QudmFsdWVzKGluaXRpYWxpemF0aW9uUHJvbWlzZXNNYXApO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBSdW4gY29yZSBndGFnIGZ1bmN0aW9uIHdpdGggYXJncyBhZnRlciBhbGwgcmVsZXZhbnQgaW5pdGlhbGl6YXRpb25cclxuICAgICAgICAvLyBwcm9taXNlcyBoYXZlIGJlZW4gcmVzb2x2ZWQuXHJcbiAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoaW5pdGlhbGl6YXRpb25Qcm9taXNlc1RvV2FpdEZvcik7XHJcbiAgICAgICAgLy8gV29ya2Fyb3VuZCBmb3IgaHR0cDovL2IvMTQxMzcwNDQ5IC0gdGhpcmQgYXJndW1lbnQgY2Fubm90IGJlIHVuZGVmaW5lZC5cclxuICAgICAgICBndGFnQ29yZShcImV2ZW50XCIgLyogRVZFTlQgKi8sIG1lYXN1cmVtZW50SWQsIGd0YWdQYXJhbXMgfHwge30pO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICBsb2dnZXIuZXJyb3IoZSk7XHJcbiAgICB9XHJcbn1cclxuLyoqXHJcbiAqIFdyYXBzIGEgc3RhbmRhcmQgZ3RhZyBmdW5jdGlvbiB3aXRoIGV4dHJhIGNvZGUgdG8gd2FpdCBmb3IgY29tcGxldGlvbiBvZlxyXG4gKiByZWxldmFudCBpbml0aWFsaXphdGlvbiBwcm9taXNlcyBiZWZvcmUgc2VuZGluZyByZXF1ZXN0cy5cclxuICpcclxuICogQHBhcmFtIGd0YWdDb3JlIEJhc2ljIGd0YWcgZnVuY3Rpb24gdGhhdCBqdXN0IGFwcGVuZHMgdG8gZGF0YUxheWVyLlxyXG4gKiBAcGFyYW0gaW5pdGlhbGl6YXRpb25Qcm9taXNlc01hcCBNYXAgb2YgYXBwSWRzIHRvIHRoZWlyIGluaXRpYWxpemF0aW9uIHByb21pc2VzLlxyXG4gKiBAcGFyYW0gZHluYW1pY0NvbmZpZ1Byb21pc2VzTGlzdCBBcnJheSBvZiBkeW5hbWljIGNvbmZpZyBmZXRjaCBwcm9taXNlcy5cclxuICogQHBhcmFtIG1lYXN1cmVtZW50SWRUb0FwcElkIE1hcCBvZiBHQSBtZWFzdXJlbWVudElEcyB0byBjb3JyZXNwb25kaW5nIEZpcmViYXNlIGFwcElkLlxyXG4gKi9cclxuZnVuY3Rpb24gd3JhcEd0YWcoZ3RhZ0NvcmUsIFxyXG4vKipcclxuICogQWxsb3dzIHdyYXBwZWQgZ3RhZyBjYWxscyB0byB3YWl0IG9uIHdoaWNoZXZlciBpbnRpYWxpemF0aW9uIHByb21pc2VzIGFyZSByZXF1aXJlZCxcclxuICogZGVwZW5kaW5nIG9uIHRoZSBjb250ZW50cyBvZiB0aGUgZ3RhZyBwYXJhbXMnIGBzZW5kX3RvYCBmaWVsZCwgaWYgYW55LlxyXG4gKi9cclxuaW5pdGlhbGl6YXRpb25Qcm9taXNlc01hcCwgXHJcbi8qKlxyXG4gKiBXcmFwcGVkIGd0YWcgY2FsbHMgc29tZXRpbWVzIHJlcXVpcmUgYWxsIGR5bmFtaWMgY29uZmlnIGZldGNoZXMgdG8gaGF2ZSByZXR1cm5lZFxyXG4gKiBiZWZvcmUgZGV0ZXJtaW5pbmcgd2hhdCBpbml0aWFsaXphdGlvbiBwcm9taXNlcyAod2hpY2ggaW5jbHVkZSBGSURzKSB0byB3YWl0IGZvci5cclxuICovXHJcbmR5bmFtaWNDb25maWdQcm9taXNlc0xpc3QsIFxyXG4vKipcclxuICogV3JhcHBlZCBndGFnIGNvbmZpZyBjYWxscyBjYW4gbmFycm93IGRvd24gd2hpY2ggaW5pdGlhbGl6YXRpb24gcHJvbWlzZSAod2l0aCBGSUQpXHJcbiAqIHRvIHdhaXQgZm9yIGlmIHRoZSBtZWFzdXJlbWVudElkIGlzIGFscmVhZHkgZmV0Y2hlZCwgYnkgZ2V0dGluZyB0aGUgY29ycmVzcG9uZGluZyBhcHBJZCxcclxuICogd2hpY2ggaXMgdGhlIGtleSBmb3IgdGhlIGluaXRpYWxpemF0aW9uIHByb21pc2VzIG1hcC5cclxuICovXHJcbm1lYXN1cmVtZW50SWRUb0FwcElkKSB7XHJcbiAgICAvKipcclxuICAgICAqIFdyYXBwZXIgYXJvdW5kIGd0YWcgdGhhdCBlbnN1cmVzIEZJRCBpcyBzZW50IHdpdGggZ3RhZyBjYWxscy5cclxuICAgICAqIEBwYXJhbSBjb21tYW5kIEd0YWcgY29tbWFuZCB0eXBlLlxyXG4gICAgICogQHBhcmFtIGlkT3JOYW1lT3JQYXJhbXMgTWVhc3VyZW1lbnQgSUQgaWYgY29tbWFuZCBpcyBFVkVOVC9DT05GSUcsIHBhcmFtcyBpZiBjb21tYW5kIGlzIFNFVC5cclxuICAgICAqIEBwYXJhbSBndGFnUGFyYW1zIFBhcmFtcyBpZiBldmVudCBpcyBFVkVOVC9DT05GSUcuXHJcbiAgICAgKi9cclxuICAgIGFzeW5jIGZ1bmN0aW9uIGd0YWdXcmFwcGVyKGNvbW1hbmQsIGlkT3JOYW1lT3JQYXJhbXMsIGd0YWdQYXJhbXMpIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAvLyBJZiBldmVudCwgY2hlY2sgdGhhdCByZWxldmFudCBpbml0aWFsaXphdGlvbiBwcm9taXNlcyBoYXZlIGNvbXBsZXRlZC5cclxuICAgICAgICAgICAgaWYgKGNvbW1hbmQgPT09IFwiZXZlbnRcIiAvKiBFVkVOVCAqLykge1xyXG4gICAgICAgICAgICAgICAgLy8gSWYgRVZFTlQsIHNlY29uZCBhcmcgbXVzdCBiZSBtZWFzdXJlbWVudElkLlxyXG4gICAgICAgICAgICAgICAgYXdhaXQgZ3RhZ09uRXZlbnQoZ3RhZ0NvcmUsIGluaXRpYWxpemF0aW9uUHJvbWlzZXNNYXAsIGR5bmFtaWNDb25maWdQcm9taXNlc0xpc3QsIGlkT3JOYW1lT3JQYXJhbXMsIGd0YWdQYXJhbXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGNvbW1hbmQgPT09IFwiY29uZmlnXCIgLyogQ09ORklHICovKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBJZiBDT05GSUcsIHNlY29uZCBhcmcgbXVzdCBiZSBtZWFzdXJlbWVudElkLlxyXG4gICAgICAgICAgICAgICAgYXdhaXQgZ3RhZ09uQ29uZmlnKGd0YWdDb3JlLCBpbml0aWFsaXphdGlvblByb21pc2VzTWFwLCBkeW5hbWljQ29uZmlnUHJvbWlzZXNMaXN0LCBtZWFzdXJlbWVudElkVG9BcHBJZCwgaWRPck5hbWVPclBhcmFtcywgZ3RhZ1BhcmFtcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoY29tbWFuZCA9PT0gXCJjb25zZW50XCIgLyogQ09OU0VOVCAqLykge1xyXG4gICAgICAgICAgICAgICAgLy8gSWYgQ09ORklHLCBzZWNvbmQgYXJnIG11c3QgYmUgbWVhc3VyZW1lbnRJZC5cclxuICAgICAgICAgICAgICAgIGd0YWdDb3JlKFwiY29uc2VudFwiIC8qIENPTlNFTlQgKi8sICd1cGRhdGUnLCBndGFnUGFyYW1zKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIElmIFNFVCwgc2Vjb25kIGFyZyBtdXN0IGJlIHBhcmFtcy5cclxuICAgICAgICAgICAgICAgIGd0YWdDb3JlKFwic2V0XCIgLyogU0VUICovLCBpZE9yTmFtZU9yUGFyYW1zKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICBsb2dnZXIuZXJyb3IoZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGd0YWdXcmFwcGVyO1xyXG59XHJcbi8qKlxyXG4gKiBDcmVhdGVzIGdsb2JhbCBndGFnIGZ1bmN0aW9uIG9yIHdyYXBzIGV4aXN0aW5nIG9uZSBpZiBmb3VuZC5cclxuICogVGhpcyB3cmFwcGVkIGZ1bmN0aW9uIGF0dGFjaGVzIEZpcmViYXNlIGluc3RhbmNlIElEIChGSUQpIHRvIGd0YWcgJ2NvbmZpZycgYW5kXHJcbiAqICdldmVudCcgY2FsbHMgdGhhdCBiZWxvbmcgdG8gdGhlIEdBSUQgYXNzb2NpYXRlZCB3aXRoIHRoaXMgRmlyZWJhc2UgaW5zdGFuY2UuXHJcbiAqXHJcbiAqIEBwYXJhbSBpbml0aWFsaXphdGlvblByb21pc2VzTWFwIE1hcCBvZiBhcHBJZHMgdG8gdGhlaXIgaW5pdGlhbGl6YXRpb24gcHJvbWlzZXMuXHJcbiAqIEBwYXJhbSBkeW5hbWljQ29uZmlnUHJvbWlzZXNMaXN0IEFycmF5IG9mIGR5bmFtaWMgY29uZmlnIGZldGNoIHByb21pc2VzLlxyXG4gKiBAcGFyYW0gbWVhc3VyZW1lbnRJZFRvQXBwSWQgTWFwIG9mIEdBIG1lYXN1cmVtZW50SURzIHRvIGNvcnJlc3BvbmRpbmcgRmlyZWJhc2UgYXBwSWQuXHJcbiAqIEBwYXJhbSBkYXRhTGF5ZXJOYW1lIE5hbWUgb2YgZ2xvYmFsIEdBIGRhdGFsYXllciBhcnJheS5cclxuICogQHBhcmFtIGd0YWdGdW5jdGlvbk5hbWUgTmFtZSBvZiBnbG9iYWwgZ3RhZyBmdW5jdGlvbiAoXCJndGFnXCIgaWYgbm90IHVzZXItc3BlY2lmaWVkKS5cclxuICovXHJcbmZ1bmN0aW9uIHdyYXBPckNyZWF0ZUd0YWcoaW5pdGlhbGl6YXRpb25Qcm9taXNlc01hcCwgZHluYW1pY0NvbmZpZ1Byb21pc2VzTGlzdCwgbWVhc3VyZW1lbnRJZFRvQXBwSWQsIGRhdGFMYXllck5hbWUsIGd0YWdGdW5jdGlvbk5hbWUpIHtcclxuICAgIC8vIENyZWF0ZSBhIGJhc2ljIGNvcmUgZ3RhZyBmdW5jdGlvblxyXG4gICAgbGV0IGd0YWdDb3JlID0gZnVuY3Rpb24gKC4uLl9hcmdzKSB7XHJcbiAgICAgICAgLy8gTXVzdCBwdXNoIElBcmd1bWVudHMgb2JqZWN0LCBub3QgYW4gYXJyYXkuXHJcbiAgICAgICAgd2luZG93W2RhdGFMYXllck5hbWVdLnB1c2goYXJndW1lbnRzKTtcclxuICAgIH07XHJcbiAgICAvLyBSZXBsYWNlIGl0IHdpdGggZXhpc3Rpbmcgb25lIGlmIGZvdW5kXHJcbiAgICBpZiAod2luZG93W2d0YWdGdW5jdGlvbk5hbWVdICYmXHJcbiAgICAgICAgdHlwZW9mIHdpbmRvd1tndGFnRnVuY3Rpb25OYW1lXSA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICBndGFnQ29yZSA9IHdpbmRvd1tndGFnRnVuY3Rpb25OYW1lXTtcclxuICAgIH1cclxuICAgIHdpbmRvd1tndGFnRnVuY3Rpb25OYW1lXSA9IHdyYXBHdGFnKGd0YWdDb3JlLCBpbml0aWFsaXphdGlvblByb21pc2VzTWFwLCBkeW5hbWljQ29uZmlnUHJvbWlzZXNMaXN0LCBtZWFzdXJlbWVudElkVG9BcHBJZCk7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGd0YWdDb3JlLFxyXG4gICAgICAgIHdyYXBwZWRHdGFnOiB3aW5kb3dbZ3RhZ0Z1bmN0aW9uTmFtZV1cclxuICAgIH07XHJcbn1cclxuLyoqXHJcbiAqIFJldHVybnMgdGhlIHNjcmlwdCB0YWcgaW4gdGhlIERPTSBtYXRjaGluZyBib3RoIHRoZSBndGFnIHVybCBwYXR0ZXJuXHJcbiAqIGFuZCB0aGUgcHJvdmlkZWQgZGF0YSBsYXllciBuYW1lLlxyXG4gKi9cclxuZnVuY3Rpb24gZmluZEd0YWdTY3JpcHRPblBhZ2UoZGF0YUxheWVyTmFtZSkge1xyXG4gICAgY29uc3Qgc2NyaXB0VGFncyA9IHdpbmRvdy5kb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc2NyaXB0Jyk7XHJcbiAgICBmb3IgKGNvbnN0IHRhZyBvZiBPYmplY3QudmFsdWVzKHNjcmlwdFRhZ3MpKSB7XHJcbiAgICAgICAgaWYgKHRhZy5zcmMgJiZcclxuICAgICAgICAgICAgdGFnLnNyYy5pbmNsdWRlcyhHVEFHX1VSTCkgJiZcclxuICAgICAgICAgICAgdGFnLnNyYy5pbmNsdWRlcyhkYXRhTGF5ZXJOYW1lKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGFnO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBudWxsO1xyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbmNvbnN0IEVSUk9SUyA9IHtcclxuICAgIFtcImFscmVhZHktZXhpc3RzXCIgLyogQUxSRUFEWV9FWElTVFMgKi9dOiAnQSBGaXJlYmFzZSBBbmFseXRpY3MgaW5zdGFuY2Ugd2l0aCB0aGUgYXBwSWQgeyRpZH0gJyArXHJcbiAgICAgICAgJyBhbHJlYWR5IGV4aXN0cy4gJyArXHJcbiAgICAgICAgJ09ubHkgb25lIEZpcmViYXNlIEFuYWx5dGljcyBpbnN0YW5jZSBjYW4gYmUgY3JlYXRlZCBmb3IgZWFjaCBhcHBJZC4nLFxyXG4gICAgW1wiYWxyZWFkeS1pbml0aWFsaXplZFwiIC8qIEFMUkVBRFlfSU5JVElBTElaRUQgKi9dOiAnaW5pdGlhbGl6ZUFuYWx5dGljcygpIGNhbm5vdCBiZSBjYWxsZWQgYWdhaW4gd2l0aCBkaWZmZXJlbnQgb3B0aW9ucyB0aGFuIHRob3NlICcgK1xyXG4gICAgICAgICdpdCB3YXMgaW5pdGlhbGx5IGNhbGxlZCB3aXRoLiBJdCBjYW4gYmUgY2FsbGVkIGFnYWluIHdpdGggdGhlIHNhbWUgb3B0aW9ucyB0byAnICtcclxuICAgICAgICAncmV0dXJuIHRoZSBleGlzdGluZyBpbnN0YW5jZSwgb3IgZ2V0QW5hbHl0aWNzKCkgY2FuIGJlIHVzZWQgJyArXHJcbiAgICAgICAgJ3RvIGdldCBhIHJlZmVyZW5jZSB0byB0aGUgYWxyZWFkeS1pbnRpYWxpemVkIGluc3RhbmNlLicsXHJcbiAgICBbXCJhbHJlYWR5LWluaXRpYWxpemVkLXNldHRpbmdzXCIgLyogQUxSRUFEWV9JTklUSUFMSVpFRF9TRVRUSU5HUyAqL106ICdGaXJlYmFzZSBBbmFseXRpY3MgaGFzIGFscmVhZHkgYmVlbiBpbml0aWFsaXplZC4nICtcclxuICAgICAgICAnc2V0dGluZ3MoKSBtdXN0IGJlIGNhbGxlZCBiZWZvcmUgaW5pdGlhbGl6aW5nIGFueSBBbmFseXRpY3MgaW5zdGFuY2UnICtcclxuICAgICAgICAnb3IgaXQgd2lsbCBoYXZlIG5vIGVmZmVjdC4nLFxyXG4gICAgW1wiaW50ZXJvcC1jb21wb25lbnQtcmVnLWZhaWxlZFwiIC8qIElOVEVST1BfQ09NUE9ORU5UX1JFR19GQUlMRUQgKi9dOiAnRmlyZWJhc2UgQW5hbHl0aWNzIEludGVyb3AgQ29tcG9uZW50IGZhaWxlZCB0byBpbnN0YW50aWF0ZTogeyRyZWFzb259JyxcclxuICAgIFtcImludmFsaWQtYW5hbHl0aWNzLWNvbnRleHRcIiAvKiBJTlZBTElEX0FOQUxZVElDU19DT05URVhUICovXTogJ0ZpcmViYXNlIEFuYWx5dGljcyBpcyBub3Qgc3VwcG9ydGVkIGluIHRoaXMgZW52aXJvbm1lbnQuICcgK1xyXG4gICAgICAgICdXcmFwIGluaXRpYWxpemF0aW9uIG9mIGFuYWx5dGljcyBpbiBhbmFseXRpY3MuaXNTdXBwb3J0ZWQoKSAnICtcclxuICAgICAgICAndG8gcHJldmVudCBpbml0aWFsaXphdGlvbiBpbiB1bnN1cHBvcnRlZCBlbnZpcm9ubWVudHMuIERldGFpbHM6IHskZXJyb3JJbmZvfScsXHJcbiAgICBbXCJpbmRleGVkZGItdW5hdmFpbGFibGVcIiAvKiBJTkRFWEVEREJfVU5BVkFJTEFCTEUgKi9dOiAnSW5kZXhlZERCIHVuYXZhaWxhYmxlIG9yIHJlc3RyaWN0ZWQgaW4gdGhpcyBlbnZpcm9ubWVudC4gJyArXHJcbiAgICAgICAgJ1dyYXAgaW5pdGlhbGl6YXRpb24gb2YgYW5hbHl0aWNzIGluIGFuYWx5dGljcy5pc1N1cHBvcnRlZCgpICcgK1xyXG4gICAgICAgICd0byBwcmV2ZW50IGluaXRpYWxpemF0aW9uIGluIHVuc3VwcG9ydGVkIGVudmlyb25tZW50cy4gRGV0YWlsczogeyRlcnJvckluZm99JyxcclxuICAgIFtcImZldGNoLXRocm90dGxlXCIgLyogRkVUQ0hfVEhST1RUTEUgKi9dOiAnVGhlIGNvbmZpZyBmZXRjaCByZXF1ZXN0IHRpbWVkIG91dCB3aGlsZSBpbiBhbiBleHBvbmVudGlhbCBiYWNrb2ZmIHN0YXRlLicgK1xyXG4gICAgICAgICcgVW5peCB0aW1lc3RhbXAgaW4gbWlsbGlzZWNvbmRzIHdoZW4gZmV0Y2ggcmVxdWVzdCB0aHJvdHRsaW5nIGVuZHM6IHskdGhyb3R0bGVFbmRUaW1lTWlsbGlzfS4nLFxyXG4gICAgW1wiY29uZmlnLWZldGNoLWZhaWxlZFwiIC8qIENPTkZJR19GRVRDSF9GQUlMRUQgKi9dOiAnRHluYW1pYyBjb25maWcgZmV0Y2ggZmFpbGVkOiBbeyRodHRwU3RhdHVzfV0geyRyZXNwb25zZU1lc3NhZ2V9JyxcclxuICAgIFtcIm5vLWFwaS1rZXlcIiAvKiBOT19BUElfS0VZICovXTogJ1RoZSBcImFwaUtleVwiIGZpZWxkIGlzIGVtcHR5IGluIHRoZSBsb2NhbCBGaXJlYmFzZSBjb25maWcuIEZpcmViYXNlIEFuYWx5dGljcyByZXF1aXJlcyB0aGlzIGZpZWxkIHRvJyArXHJcbiAgICAgICAgJ2NvbnRhaW4gYSB2YWxpZCBBUEkga2V5LicsXHJcbiAgICBbXCJuby1hcHAtaWRcIiAvKiBOT19BUFBfSUQgKi9dOiAnVGhlIFwiYXBwSWRcIiBmaWVsZCBpcyBlbXB0eSBpbiB0aGUgbG9jYWwgRmlyZWJhc2UgY29uZmlnLiBGaXJlYmFzZSBBbmFseXRpY3MgcmVxdWlyZXMgdGhpcyBmaWVsZCB0bycgK1xyXG4gICAgICAgICdjb250YWluIGEgdmFsaWQgYXBwIElELidcclxufTtcclxuY29uc3QgRVJST1JfRkFDVE9SWSA9IG5ldyBFcnJvckZhY3RvcnkoJ2FuYWx5dGljcycsICdBbmFseXRpY3MnLCBFUlJPUlMpO1xuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG4vKipcclxuICogQmFja29mZiBmYWN0b3IgZm9yIDUwMyBlcnJvcnMsIHdoaWNoIHdlIHdhbnQgdG8gYmUgY29uc2VydmF0aXZlIGFib3V0XHJcbiAqIHRvIGF2b2lkIG92ZXJsb2FkaW5nIHNlcnZlcnMuIEVhY2ggcmV0cnkgaW50ZXJ2YWwgd2lsbCBiZVxyXG4gKiBCQVNFX0lOVEVSVkFMX01JTExJUyAqIExPTkdfUkVUUllfRkFDVE9SIF4gcmV0cnlDb3VudCwgc28gdGhlIHNlY29uZCBvbmVcclxuICogd2lsbCBiZSB+MzAgc2Vjb25kcyAod2l0aCBmdXp6aW5nKS5cclxuICovXHJcbmNvbnN0IExPTkdfUkVUUllfRkFDVE9SID0gMzA7XHJcbi8qKlxyXG4gKiBCYXNlIHdhaXQgaW50ZXJ2YWwgdG8gbXVsdGlwbGllZCBieSBiYWNrb2ZmRmFjdG9yXmJhY2tvZmZDb3VudC5cclxuICovXHJcbmNvbnN0IEJBU0VfSU5URVJWQUxfTUlMTElTID0gMTAwMDtcclxuLyoqXHJcbiAqIFN0dWJiYWJsZSByZXRyeSBkYXRhIHN0b3JhZ2UgY2xhc3MuXHJcbiAqL1xyXG5jbGFzcyBSZXRyeURhdGEge1xyXG4gICAgY29uc3RydWN0b3IodGhyb3R0bGVNZXRhZGF0YSA9IHt9LCBpbnRlcnZhbE1pbGxpcyA9IEJBU0VfSU5URVJWQUxfTUlMTElTKSB7XHJcbiAgICAgICAgdGhpcy50aHJvdHRsZU1ldGFkYXRhID0gdGhyb3R0bGVNZXRhZGF0YTtcclxuICAgICAgICB0aGlzLmludGVydmFsTWlsbGlzID0gaW50ZXJ2YWxNaWxsaXM7XHJcbiAgICB9XHJcbiAgICBnZXRUaHJvdHRsZU1ldGFkYXRhKGFwcElkKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudGhyb3R0bGVNZXRhZGF0YVthcHBJZF07XHJcbiAgICB9XHJcbiAgICBzZXRUaHJvdHRsZU1ldGFkYXRhKGFwcElkLCBtZXRhZGF0YSkge1xyXG4gICAgICAgIHRoaXMudGhyb3R0bGVNZXRhZGF0YVthcHBJZF0gPSBtZXRhZGF0YTtcclxuICAgIH1cclxuICAgIGRlbGV0ZVRocm90dGxlTWV0YWRhdGEoYXBwSWQpIHtcclxuICAgICAgICBkZWxldGUgdGhpcy50aHJvdHRsZU1ldGFkYXRhW2FwcElkXTtcclxuICAgIH1cclxufVxyXG5jb25zdCBkZWZhdWx0UmV0cnlEYXRhID0gbmV3IFJldHJ5RGF0YSgpO1xyXG4vKipcclxuICogU2V0IEdFVCByZXF1ZXN0IGhlYWRlcnMuXHJcbiAqIEBwYXJhbSBhcGlLZXkgQXBwIEFQSSBrZXkuXHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRIZWFkZXJzKGFwaUtleSkge1xyXG4gICAgcmV0dXJuIG5ldyBIZWFkZXJzKHtcclxuICAgICAgICBBY2NlcHQ6ICdhcHBsaWNhdGlvbi9qc29uJyxcclxuICAgICAgICAneC1nb29nLWFwaS1rZXknOiBhcGlLZXlcclxuICAgIH0pO1xyXG59XHJcbi8qKlxyXG4gKiBGZXRjaGVzIGR5bmFtaWMgY29uZmlnIGZyb20gYmFja2VuZC5cclxuICogQHBhcmFtIGFwcCBGaXJlYmFzZSBhcHAgdG8gZmV0Y2ggY29uZmlnIGZvci5cclxuICovXHJcbmFzeW5jIGZ1bmN0aW9uIGZldGNoRHluYW1pY0NvbmZpZyhhcHBGaWVsZHMpIHtcclxuICAgIHZhciBfYTtcclxuICAgIGNvbnN0IHsgYXBwSWQsIGFwaUtleSB9ID0gYXBwRmllbGRzO1xyXG4gICAgY29uc3QgcmVxdWVzdCA9IHtcclxuICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgIGhlYWRlcnM6IGdldEhlYWRlcnMoYXBpS2V5KVxyXG4gICAgfTtcclxuICAgIGNvbnN0IGFwcFVybCA9IERZTkFNSUNfQ09ORklHX1VSTC5yZXBsYWNlKCd7YXBwLWlkfScsIGFwcElkKTtcclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYXBwVXJsLCByZXF1ZXN0KTtcclxuICAgIGlmIChyZXNwb25zZS5zdGF0dXMgIT09IDIwMCAmJiByZXNwb25zZS5zdGF0dXMgIT09IDMwNCkge1xyXG4gICAgICAgIGxldCBlcnJvck1lc3NhZ2UgPSAnJztcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAvLyBUcnkgdG8gZ2V0IGFueSBlcnJvciBtZXNzYWdlIHRleHQgZnJvbSBzZXJ2ZXIgcmVzcG9uc2UuXHJcbiAgICAgICAgICAgIGNvbnN0IGpzb25SZXNwb25zZSA9IChhd2FpdCByZXNwb25zZS5qc29uKCkpO1xyXG4gICAgICAgICAgICBpZiAoKF9hID0ganNvblJlc3BvbnNlLmVycm9yKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EubWVzc2FnZSkge1xyXG4gICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlID0ganNvblJlc3BvbnNlLmVycm9yLm1lc3NhZ2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2ggKF9pZ25vcmVkKSB7IH1cclxuICAgICAgICB0aHJvdyBFUlJPUl9GQUNUT1JZLmNyZWF0ZShcImNvbmZpZy1mZXRjaC1mYWlsZWRcIiAvKiBDT05GSUdfRkVUQ0hfRkFJTEVEICovLCB7XHJcbiAgICAgICAgICAgIGh0dHBTdGF0dXM6IHJlc3BvbnNlLnN0YXR1cyxcclxuICAgICAgICAgICAgcmVzcG9uc2VNZXNzYWdlOiBlcnJvck1lc3NhZ2VcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXNwb25zZS5qc29uKCk7XHJcbn1cclxuLyoqXHJcbiAqIEZldGNoZXMgZHluYW1pYyBjb25maWcgZnJvbSBiYWNrZW5kLCByZXRyeWluZyBpZiBmYWlsZWQuXHJcbiAqIEBwYXJhbSBhcHAgRmlyZWJhc2UgYXBwIHRvIGZldGNoIGNvbmZpZyBmb3IuXHJcbiAqL1xyXG5hc3luYyBmdW5jdGlvbiBmZXRjaER5bmFtaWNDb25maWdXaXRoUmV0cnkoYXBwLCBcclxuLy8gcmV0cnlEYXRhIGFuZCB0aW1lb3V0TWlsbGlzIGFyZSBwYXJhbWV0ZXJpemVkIHRvIGFsbG93IHBhc3NpbmcgYSBkaWZmZXJlbnQgdmFsdWUgZm9yIHRlc3RpbmcuXHJcbnJldHJ5RGF0YSA9IGRlZmF1bHRSZXRyeURhdGEsIHRpbWVvdXRNaWxsaXMpIHtcclxuICAgIGNvbnN0IHsgYXBwSWQsIGFwaUtleSwgbWVhc3VyZW1lbnRJZCB9ID0gYXBwLm9wdGlvbnM7XHJcbiAgICBpZiAoIWFwcElkKSB7XHJcbiAgICAgICAgdGhyb3cgRVJST1JfRkFDVE9SWS5jcmVhdGUoXCJuby1hcHAtaWRcIiAvKiBOT19BUFBfSUQgKi8pO1xyXG4gICAgfVxyXG4gICAgaWYgKCFhcGlLZXkpIHtcclxuICAgICAgICBpZiAobWVhc3VyZW1lbnRJZCkge1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgbWVhc3VyZW1lbnRJZCxcclxuICAgICAgICAgICAgICAgIGFwcElkXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRocm93IEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKFwibm8tYXBpLWtleVwiIC8qIE5PX0FQSV9LRVkgKi8pO1xyXG4gICAgfVxyXG4gICAgY29uc3QgdGhyb3R0bGVNZXRhZGF0YSA9IHJldHJ5RGF0YS5nZXRUaHJvdHRsZU1ldGFkYXRhKGFwcElkKSB8fCB7XHJcbiAgICAgICAgYmFja29mZkNvdW50OiAwLFxyXG4gICAgICAgIHRocm90dGxlRW5kVGltZU1pbGxpczogRGF0ZS5ub3coKVxyXG4gICAgfTtcclxuICAgIGNvbnN0IHNpZ25hbCA9IG5ldyBBbmFseXRpY3NBYm9ydFNpZ25hbCgpO1xyXG4gICAgc2V0VGltZW91dChhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgLy8gTm90ZSBhIHZlcnkgbG93IGRlbGF5LCBlZyA8IDEwbXMsIGNhbiBlbGFwc2UgYmVmb3JlIGxpc3RlbmVycyBhcmUgaW5pdGlhbGl6ZWQuXHJcbiAgICAgICAgc2lnbmFsLmFib3J0KCk7XHJcbiAgICB9LCB0aW1lb3V0TWlsbGlzICE9PSB1bmRlZmluZWQgPyB0aW1lb3V0TWlsbGlzIDogRkVUQ0hfVElNRU9VVF9NSUxMSVMpO1xyXG4gICAgcmV0dXJuIGF0dGVtcHRGZXRjaER5bmFtaWNDb25maWdXaXRoUmV0cnkoeyBhcHBJZCwgYXBpS2V5LCBtZWFzdXJlbWVudElkIH0sIHRocm90dGxlTWV0YWRhdGEsIHNpZ25hbCwgcmV0cnlEYXRhKTtcclxufVxyXG4vKipcclxuICogUnVucyBvbmUgcmV0cnkgYXR0ZW1wdC5cclxuICogQHBhcmFtIGFwcEZpZWxkcyBOZWNlc3NhcnkgYXBwIGNvbmZpZyBmaWVsZHMuXHJcbiAqIEBwYXJhbSB0aHJvdHRsZU1ldGFkYXRhIE9uZ29pbmcgbWV0YWRhdGEgdG8gZGV0ZXJtaW5lIHRocm90dGxpbmcgdGltZXMuXHJcbiAqIEBwYXJhbSBzaWduYWwgQWJvcnQgc2lnbmFsLlxyXG4gKi9cclxuYXN5bmMgZnVuY3Rpb24gYXR0ZW1wdEZldGNoRHluYW1pY0NvbmZpZ1dpdGhSZXRyeShhcHBGaWVsZHMsIHsgdGhyb3R0bGVFbmRUaW1lTWlsbGlzLCBiYWNrb2ZmQ291bnQgfSwgc2lnbmFsLCByZXRyeURhdGEgPSBkZWZhdWx0UmV0cnlEYXRhIC8vIGZvciB0ZXN0aW5nXHJcbikge1xyXG4gICAgdmFyIF9hLCBfYjtcclxuICAgIGNvbnN0IHsgYXBwSWQsIG1lYXN1cmVtZW50SWQgfSA9IGFwcEZpZWxkcztcclxuICAgIC8vIFN0YXJ0cyB3aXRoIGEgKHBvdGVudGlhbGx5IHplcm8pIHRpbWVvdXQgdG8gc3VwcG9ydCByZXN1bXB0aW9uIGZyb20gc3RvcmVkIHN0YXRlLlxyXG4gICAgLy8gRW5zdXJlcyB0aGUgdGhyb3R0bGUgZW5kIHRpbWUgaXMgaG9ub3JlZCBpZiB0aGUgbGFzdCBhdHRlbXB0IHRpbWVkIG91dC5cclxuICAgIC8vIE5vdGUgdGhlIFNESyB3aWxsIG5ldmVyIG1ha2UgYSByZXF1ZXN0IGlmIHRoZSBmZXRjaCB0aW1lb3V0IGV4cGlyZXMgYXQgdGhpcyBwb2ludC5cclxuICAgIHRyeSB7XHJcbiAgICAgICAgYXdhaXQgc2V0QWJvcnRhYmxlVGltZW91dChzaWduYWwsIHRocm90dGxlRW5kVGltZU1pbGxpcyk7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgIGlmIChtZWFzdXJlbWVudElkKSB7XHJcbiAgICAgICAgICAgIGxvZ2dlci53YXJuKGBUaW1lZCBvdXQgZmV0Y2hpbmcgdGhpcyBGaXJlYmFzZSBhcHAncyBtZWFzdXJlbWVudCBJRCBmcm9tIHRoZSBzZXJ2ZXIuYCArXHJcbiAgICAgICAgICAgICAgICBgIEZhbGxpbmcgYmFjayB0byB0aGUgbWVhc3VyZW1lbnQgSUQgJHttZWFzdXJlbWVudElkfWAgK1xyXG4gICAgICAgICAgICAgICAgYCBwcm92aWRlZCBpbiB0aGUgXCJtZWFzdXJlbWVudElkXCIgZmllbGQgaW4gdGhlIGxvY2FsIEZpcmViYXNlIGNvbmZpZy4gWyR7KF9hID0gZSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLm1lc3NhZ2V9XWApO1xyXG4gICAgICAgICAgICByZXR1cm4geyBhcHBJZCwgbWVhc3VyZW1lbnRJZCB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aHJvdyBlO1xyXG4gICAgfVxyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoRHluYW1pY0NvbmZpZyhhcHBGaWVsZHMpO1xyXG4gICAgICAgIC8vIE5vdGUgdGhlIFNESyBvbmx5IGNsZWFycyB0aHJvdHRsZSBzdGF0ZSBpZiByZXNwb25zZSBpcyBzdWNjZXNzIG9yIG5vbi1yZXRyaWFibGUuXHJcbiAgICAgICAgcmV0cnlEYXRhLmRlbGV0ZVRocm90dGxlTWV0YWRhdGEoYXBwSWQpO1xyXG4gICAgICAgIHJldHVybiByZXNwb25zZTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgY29uc3QgZXJyb3IgPSBlO1xyXG4gICAgICAgIGlmICghaXNSZXRyaWFibGVFcnJvcihlcnJvcikpIHtcclxuICAgICAgICAgICAgcmV0cnlEYXRhLmRlbGV0ZVRocm90dGxlTWV0YWRhdGEoYXBwSWQpO1xyXG4gICAgICAgICAgICBpZiAobWVhc3VyZW1lbnRJZCkge1xyXG4gICAgICAgICAgICAgICAgbG9nZ2VyLndhcm4oYEZhaWxlZCB0byBmZXRjaCB0aGlzIEZpcmViYXNlIGFwcCdzIG1lYXN1cmVtZW50IElEIGZyb20gdGhlIHNlcnZlci5gICtcclxuICAgICAgICAgICAgICAgICAgICBgIEZhbGxpbmcgYmFjayB0byB0aGUgbWVhc3VyZW1lbnQgSUQgJHttZWFzdXJlbWVudElkfWAgK1xyXG4gICAgICAgICAgICAgICAgICAgIGAgcHJvdmlkZWQgaW4gdGhlIFwibWVhc3VyZW1lbnRJZFwiIGZpZWxkIGluIHRoZSBsb2NhbCBGaXJlYmFzZSBjb25maWcuIFske2Vycm9yID09PSBudWxsIHx8IGVycm9yID09PSB2b2lkIDAgPyB2b2lkIDAgOiBlcnJvci5tZXNzYWdlfV1gKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB7IGFwcElkLCBtZWFzdXJlbWVudElkIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IGJhY2tvZmZNaWxsaXMgPSBOdW1iZXIoKF9iID0gZXJyb3IgPT09IG51bGwgfHwgZXJyb3IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGVycm9yLmN1c3RvbURhdGEpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5odHRwU3RhdHVzKSA9PT0gNTAzXHJcbiAgICAgICAgICAgID8gY2FsY3VsYXRlQmFja29mZk1pbGxpcyhiYWNrb2ZmQ291bnQsIHJldHJ5RGF0YS5pbnRlcnZhbE1pbGxpcywgTE9OR19SRVRSWV9GQUNUT1IpXHJcbiAgICAgICAgICAgIDogY2FsY3VsYXRlQmFja29mZk1pbGxpcyhiYWNrb2ZmQ291bnQsIHJldHJ5RGF0YS5pbnRlcnZhbE1pbGxpcyk7XHJcbiAgICAgICAgLy8gSW5jcmVtZW50cyBiYWNrb2ZmIHN0YXRlLlxyXG4gICAgICAgIGNvbnN0IHRocm90dGxlTWV0YWRhdGEgPSB7XHJcbiAgICAgICAgICAgIHRocm90dGxlRW5kVGltZU1pbGxpczogRGF0ZS5ub3coKSArIGJhY2tvZmZNaWxsaXMsXHJcbiAgICAgICAgICAgIGJhY2tvZmZDb3VudDogYmFja29mZkNvdW50ICsgMVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgLy8gUGVyc2lzdHMgc3RhdGUuXHJcbiAgICAgICAgcmV0cnlEYXRhLnNldFRocm90dGxlTWV0YWRhdGEoYXBwSWQsIHRocm90dGxlTWV0YWRhdGEpO1xyXG4gICAgICAgIGxvZ2dlci5kZWJ1ZyhgQ2FsbGluZyBhdHRlbXB0RmV0Y2ggYWdhaW4gaW4gJHtiYWNrb2ZmTWlsbGlzfSBtaWxsaXNgKTtcclxuICAgICAgICByZXR1cm4gYXR0ZW1wdEZldGNoRHluYW1pY0NvbmZpZ1dpdGhSZXRyeShhcHBGaWVsZHMsIHRocm90dGxlTWV0YWRhdGEsIHNpZ25hbCwgcmV0cnlEYXRhKTtcclxuICAgIH1cclxufVxyXG4vKipcclxuICogU3VwcG9ydHMgd2FpdGluZyBvbiBhIGJhY2tvZmYgYnk6XHJcbiAqXHJcbiAqIDx1bD5cclxuICogICA8bGk+UHJvbWlzaWZ5aW5nIHNldFRpbWVvdXQsIHNvIHdlIGNhbiBzZXQgYSB0aW1lb3V0IGluIG91ciBQcm9taXNlIGNoYWluPC9saT5cclxuICogICA8bGk+TGlzdGVuaW5nIG9uIGEgc2lnbmFsIGJ1cyBmb3IgYWJvcnQgZXZlbnRzLCBqdXN0IGxpa2UgdGhlIEZldGNoIEFQSTwvbGk+XHJcbiAqICAgPGxpPkZhaWxpbmcgaW4gdGhlIHNhbWUgd2F5IHRoZSBGZXRjaCBBUEkgZmFpbHMsIHNvIHRpbWluZyBvdXQgYSBsaXZlIHJlcXVlc3QgYW5kIGEgdGhyb3R0bGVkXHJcbiAqICAgICAgIHJlcXVlc3QgYXBwZWFyIHRoZSBzYW1lLjwvbGk+XHJcbiAqIDwvdWw+XHJcbiAqXHJcbiAqIDxwPlZpc2libGUgZm9yIHRlc3RpbmcuXHJcbiAqL1xyXG5mdW5jdGlvbiBzZXRBYm9ydGFibGVUaW1lb3V0KHNpZ25hbCwgdGhyb3R0bGVFbmRUaW1lTWlsbGlzKSB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgIC8vIERlcml2ZXMgYmFja29mZiBmcm9tIGdpdmVuIGVuZCB0aW1lLCBub3JtYWxpemluZyBuZWdhdGl2ZSBudW1iZXJzIHRvIHplcm8uXHJcbiAgICAgICAgY29uc3QgYmFja29mZk1pbGxpcyA9IE1hdGgubWF4KHRocm90dGxlRW5kVGltZU1pbGxpcyAtIERhdGUubm93KCksIDApO1xyXG4gICAgICAgIGNvbnN0IHRpbWVvdXQgPSBzZXRUaW1lb3V0KHJlc29sdmUsIGJhY2tvZmZNaWxsaXMpO1xyXG4gICAgICAgIC8vIEFkZHMgbGlzdGVuZXIsIHJhdGhlciB0aGFuIHNldHMgb25hYm9ydCwgYmVjYXVzZSBzaWduYWwgaXMgYSBzaGFyZWQgb2JqZWN0LlxyXG4gICAgICAgIHNpZ25hbC5hZGRFdmVudExpc3RlbmVyKCgpID0+IHtcclxuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xyXG4gICAgICAgICAgICAvLyBJZiB0aGUgcmVxdWVzdCBjb21wbGV0ZXMgYmVmb3JlIHRoaXMgdGltZW91dCwgdGhlIHJlamVjdGlvbiBoYXMgbm8gZWZmZWN0LlxyXG4gICAgICAgICAgICByZWplY3QoRVJST1JfRkFDVE9SWS5jcmVhdGUoXCJmZXRjaC10aHJvdHRsZVwiIC8qIEZFVENIX1RIUk9UVExFICovLCB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdHRsZUVuZFRpbWVNaWxsaXNcclxuICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn1cclxuLyoqXHJcbiAqIFJldHVybnMgdHJ1ZSBpZiB0aGUge0BsaW5rIEVycm9yfSBpbmRpY2F0ZXMgYSBmZXRjaCByZXF1ZXN0IG1heSBzdWNjZWVkIGxhdGVyLlxyXG4gKi9cclxuZnVuY3Rpb24gaXNSZXRyaWFibGVFcnJvcihlKSB7XHJcbiAgICBpZiAoIShlIGluc3RhbmNlb2YgRmlyZWJhc2VFcnJvcikgfHwgIWUuY3VzdG9tRGF0YSkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIC8vIFVzZXMgc3RyaW5nIGluZGV4IGRlZmluZWQgYnkgRXJyb3JEYXRhLCB3aGljaCBGaXJlYmFzZUVycm9yIGltcGxlbWVudHMuXHJcbiAgICBjb25zdCBodHRwU3RhdHVzID0gTnVtYmVyKGUuY3VzdG9tRGF0YVsnaHR0cFN0YXR1cyddKTtcclxuICAgIHJldHVybiAoaHR0cFN0YXR1cyA9PT0gNDI5IHx8XHJcbiAgICAgICAgaHR0cFN0YXR1cyA9PT0gNTAwIHx8XHJcbiAgICAgICAgaHR0cFN0YXR1cyA9PT0gNTAzIHx8XHJcbiAgICAgICAgaHR0cFN0YXR1cyA9PT0gNTA0KTtcclxufVxyXG4vKipcclxuICogU2hpbXMgYSBtaW5pbWFsIEFib3J0U2lnbmFsIChjb3BpZWQgZnJvbSBSZW1vdGUgQ29uZmlnKS5cclxuICpcclxuICogPHA+QWJvcnRDb250cm9sbGVyJ3MgQWJvcnRTaWduYWwgY29udmVuaWVudGx5IGRlY291cGxlcyBmZXRjaCB0aW1lb3V0IGxvZ2ljIGZyb20gb3RoZXIgYXNwZWN0c1xyXG4gKiBvZiBuZXR3b3JraW5nLCBzdWNoIGFzIHJldHJpZXMuIEZpcmViYXNlIGRvZXNuJ3QgdXNlIEFib3J0Q29udHJvbGxlciBlbm91Z2ggdG8ganVzdGlmeSBhXHJcbiAqIHBvbHlmaWxsIHJlY29tbWVuZGF0aW9uLCBsaWtlIHdlIGRvIHdpdGggdGhlIEZldGNoIEFQSSwgYnV0IHRoaXMgbWluaW1hbCBzaGltIGNhbiBlYXNpbHkgYmVcclxuICogc3dhcHBlZCBvdXQgaWYvd2hlbiB3ZSBkby5cclxuICovXHJcbmNsYXNzIEFuYWx5dGljc0Fib3J0U2lnbmFsIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMubGlzdGVuZXJzID0gW107XHJcbiAgICB9XHJcbiAgICBhZGRFdmVudExpc3RlbmVyKGxpc3RlbmVyKSB7XHJcbiAgICAgICAgdGhpcy5saXN0ZW5lcnMucHVzaChsaXN0ZW5lcik7XHJcbiAgICB9XHJcbiAgICBhYm9ydCgpIHtcclxuICAgICAgICB0aGlzLmxpc3RlbmVycy5mb3JFYWNoKGxpc3RlbmVyID0+IGxpc3RlbmVyKCkpO1xyXG4gICAgfVxyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbi8qKlxyXG4gKiBFdmVudCBwYXJhbWV0ZXJzIHRvIHNldCBvbiAnZ3RhZycgZHVyaW5nIGluaXRpYWxpemF0aW9uLlxyXG4gKi9cclxubGV0IGRlZmF1bHRFdmVudFBhcmFtZXRlcnNGb3JJbml0O1xyXG4vKipcclxuICogTG9ncyBhbiBhbmFseXRpY3MgZXZlbnQgdGhyb3VnaCB0aGUgRmlyZWJhc2UgU0RLLlxyXG4gKlxyXG4gKiBAcGFyYW0gZ3RhZ0Z1bmN0aW9uIFdyYXBwZWQgZ3RhZyBmdW5jdGlvbiB0aGF0IHdhaXRzIGZvciBmaWQgdG8gYmUgc2V0IGJlZm9yZSBzZW5kaW5nIGFuIGV2ZW50XHJcbiAqIEBwYXJhbSBldmVudE5hbWUgR29vZ2xlIEFuYWx5dGljcyBldmVudCBuYW1lLCBjaG9vc2UgZnJvbSBzdGFuZGFyZCBsaXN0IG9yIHVzZSBhIGN1c3RvbSBzdHJpbmcuXHJcbiAqIEBwYXJhbSBldmVudFBhcmFtcyBBbmFseXRpY3MgZXZlbnQgcGFyYW1ldGVycy5cclxuICovXHJcbmFzeW5jIGZ1bmN0aW9uIGxvZ0V2ZW50JDEoZ3RhZ0Z1bmN0aW9uLCBpbml0aWFsaXphdGlvblByb21pc2UsIGV2ZW50TmFtZSwgZXZlbnRQYXJhbXMsIG9wdGlvbnMpIHtcclxuICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMuZ2xvYmFsKSB7XHJcbiAgICAgICAgZ3RhZ0Z1bmN0aW9uKFwiZXZlbnRcIiAvKiBFVkVOVCAqLywgZXZlbnROYW1lLCBldmVudFBhcmFtcyk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgY29uc3QgbWVhc3VyZW1lbnRJZCA9IGF3YWl0IGluaXRpYWxpemF0aW9uUHJvbWlzZTtcclxuICAgICAgICBjb25zdCBwYXJhbXMgPSBPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIGV2ZW50UGFyYW1zKSwgeyAnc2VuZF90byc6IG1lYXN1cmVtZW50SWQgfSk7XHJcbiAgICAgICAgZ3RhZ0Z1bmN0aW9uKFwiZXZlbnRcIiAvKiBFVkVOVCAqLywgZXZlbnROYW1lLCBwYXJhbXMpO1xyXG4gICAgfVxyXG59XHJcbi8qKlxyXG4gKiBTZXQgc2NyZWVuX25hbWUgcGFyYW1ldGVyIGZvciB0aGlzIEdvb2dsZSBBbmFseXRpY3MgSUQuXHJcbiAqXHJcbiAqIEBkZXByZWNhdGVkIFVzZSB7QGxpbmsgbG9nRXZlbnR9IHdpdGggYGV2ZW50TmFtZWAgYXMgJ3NjcmVlbl92aWV3JyBhbmQgYWRkIHJlbGV2YW50IGBldmVudFBhcmFtc2AuXHJcbiAqIFNlZSB7QGxpbmsgaHR0cHM6Ly9maXJlYmFzZS5nb29nbGUuY29tL2RvY3MvYW5hbHl0aWNzL3NjcmVlbnZpZXdzIHwgVHJhY2sgU2NyZWVudmlld3N9LlxyXG4gKlxyXG4gKiBAcGFyYW0gZ3RhZ0Z1bmN0aW9uIFdyYXBwZWQgZ3RhZyBmdW5jdGlvbiB0aGF0IHdhaXRzIGZvciBmaWQgdG8gYmUgc2V0IGJlZm9yZSBzZW5kaW5nIGFuIGV2ZW50XHJcbiAqIEBwYXJhbSBzY3JlZW5OYW1lIFNjcmVlbiBuYW1lIHN0cmluZyB0byBzZXQuXHJcbiAqL1xyXG5hc3luYyBmdW5jdGlvbiBzZXRDdXJyZW50U2NyZWVuJDEoZ3RhZ0Z1bmN0aW9uLCBpbml0aWFsaXphdGlvblByb21pc2UsIHNjcmVlbk5hbWUsIG9wdGlvbnMpIHtcclxuICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMuZ2xvYmFsKSB7XHJcbiAgICAgICAgZ3RhZ0Z1bmN0aW9uKFwic2V0XCIgLyogU0VUICovLCB7ICdzY3JlZW5fbmFtZSc6IHNjcmVlbk5hbWUgfSk7XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgY29uc3QgbWVhc3VyZW1lbnRJZCA9IGF3YWl0IGluaXRpYWxpemF0aW9uUHJvbWlzZTtcclxuICAgICAgICBndGFnRnVuY3Rpb24oXCJjb25maWdcIiAvKiBDT05GSUcgKi8sIG1lYXN1cmVtZW50SWQsIHtcclxuICAgICAgICAgICAgdXBkYXRlOiB0cnVlLFxyXG4gICAgICAgICAgICAnc2NyZWVuX25hbWUnOiBzY3JlZW5OYW1lXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuLyoqXHJcbiAqIFNldCB1c2VyX2lkIHBhcmFtZXRlciBmb3IgdGhpcyBHb29nbGUgQW5hbHl0aWNzIElELlxyXG4gKlxyXG4gKiBAcGFyYW0gZ3RhZ0Z1bmN0aW9uIFdyYXBwZWQgZ3RhZyBmdW5jdGlvbiB0aGF0IHdhaXRzIGZvciBmaWQgdG8gYmUgc2V0IGJlZm9yZSBzZW5kaW5nIGFuIGV2ZW50XHJcbiAqIEBwYXJhbSBpZCBVc2VyIElEIHN0cmluZyB0byBzZXRcclxuICovXHJcbmFzeW5jIGZ1bmN0aW9uIHNldFVzZXJJZCQxKGd0YWdGdW5jdGlvbiwgaW5pdGlhbGl6YXRpb25Qcm9taXNlLCBpZCwgb3B0aW9ucykge1xyXG4gICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5nbG9iYWwpIHtcclxuICAgICAgICBndGFnRnVuY3Rpb24oXCJzZXRcIiAvKiBTRVQgKi8sIHsgJ3VzZXJfaWQnOiBpZCB9KTtcclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBjb25zdCBtZWFzdXJlbWVudElkID0gYXdhaXQgaW5pdGlhbGl6YXRpb25Qcm9taXNlO1xyXG4gICAgICAgIGd0YWdGdW5jdGlvbihcImNvbmZpZ1wiIC8qIENPTkZJRyAqLywgbWVhc3VyZW1lbnRJZCwge1xyXG4gICAgICAgICAgICB1cGRhdGU6IHRydWUsXHJcbiAgICAgICAgICAgICd1c2VyX2lkJzogaWRcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG4vKipcclxuICogU2V0IGFsbCBvdGhlciB1c2VyIHByb3BlcnRpZXMgb3RoZXIgdGhhbiB1c2VyX2lkIGFuZCBzY3JlZW5fbmFtZS5cclxuICpcclxuICogQHBhcmFtIGd0YWdGdW5jdGlvbiBXcmFwcGVkIGd0YWcgZnVuY3Rpb24gdGhhdCB3YWl0cyBmb3IgZmlkIHRvIGJlIHNldCBiZWZvcmUgc2VuZGluZyBhbiBldmVudFxyXG4gKiBAcGFyYW0gcHJvcGVydGllcyBNYXAgb2YgdXNlciBwcm9wZXJ0aWVzIHRvIHNldFxyXG4gKi9cclxuYXN5bmMgZnVuY3Rpb24gc2V0VXNlclByb3BlcnRpZXMkMShndGFnRnVuY3Rpb24sIGluaXRpYWxpemF0aW9uUHJvbWlzZSwgcHJvcGVydGllcywgb3B0aW9ucykge1xyXG4gICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5nbG9iYWwpIHtcclxuICAgICAgICBjb25zdCBmbGF0UHJvcGVydGllcyA9IHt9O1xyXG4gICAgICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKHByb3BlcnRpZXMpKSB7XHJcbiAgICAgICAgICAgIC8vIHVzZSBkb3Qgbm90YXRpb24gZm9yIG1lcmdlIGJlaGF2aW9yIGluIGd0YWcuanNcclxuICAgICAgICAgICAgZmxhdFByb3BlcnRpZXNbYHVzZXJfcHJvcGVydGllcy4ke2tleX1gXSA9IHByb3BlcnRpZXNba2V5XTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZ3RhZ0Z1bmN0aW9uKFwic2V0XCIgLyogU0VUICovLCBmbGF0UHJvcGVydGllcyk7XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgY29uc3QgbWVhc3VyZW1lbnRJZCA9IGF3YWl0IGluaXRpYWxpemF0aW9uUHJvbWlzZTtcclxuICAgICAgICBndGFnRnVuY3Rpb24oXCJjb25maWdcIiAvKiBDT05GSUcgKi8sIG1lYXN1cmVtZW50SWQsIHtcclxuICAgICAgICAgICAgdXBkYXRlOiB0cnVlLFxyXG4gICAgICAgICAgICAndXNlcl9wcm9wZXJ0aWVzJzogcHJvcGVydGllc1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbi8qKlxyXG4gKiBTZXQgd2hldGhlciBjb2xsZWN0aW9uIGlzIGVuYWJsZWQgZm9yIHRoaXMgSUQuXHJcbiAqXHJcbiAqIEBwYXJhbSBlbmFibGVkIElmIHRydWUsIGNvbGxlY3Rpb24gaXMgZW5hYmxlZCBmb3IgdGhpcyBJRC5cclxuICovXHJcbmFzeW5jIGZ1bmN0aW9uIHNldEFuYWx5dGljc0NvbGxlY3Rpb25FbmFibGVkJDEoaW5pdGlhbGl6YXRpb25Qcm9taXNlLCBlbmFibGVkKSB7XHJcbiAgICBjb25zdCBtZWFzdXJlbWVudElkID0gYXdhaXQgaW5pdGlhbGl6YXRpb25Qcm9taXNlO1xyXG4gICAgd2luZG93W2BnYS1kaXNhYmxlLSR7bWVhc3VyZW1lbnRJZH1gXSA9ICFlbmFibGVkO1xyXG59XHJcbi8qKlxyXG4gKiBDb25zZW50IHBhcmFtZXRlcnMgdG8gZGVmYXVsdCB0byBkdXJpbmcgJ2d0YWcnIGluaXRpYWxpemF0aW9uLlxyXG4gKi9cclxubGV0IGRlZmF1bHRDb25zZW50U2V0dGluZ3NGb3JJbml0O1xyXG4vKipcclxuICogU2V0cyB0aGUgdmFyaWFibGUge0BsaW5rIGRlZmF1bHRDb25zZW50U2V0dGluZ3NGb3JJbml0fSBmb3IgdXNlIGluIHRoZSBpbml0aWFsaXphdGlvbiBvZlxyXG4gKiBhbmFseXRpY3MuXHJcbiAqXHJcbiAqIEBwYXJhbSBjb25zZW50U2V0dGluZ3MgTWFwcyB0aGUgYXBwbGljYWJsZSBlbmQgdXNlciBjb25zZW50IHN0YXRlIGZvciBndGFnLmpzLlxyXG4gKi9cclxuZnVuY3Rpb24gX3NldENvbnNlbnREZWZhdWx0Rm9ySW5pdChjb25zZW50U2V0dGluZ3MpIHtcclxuICAgIGRlZmF1bHRDb25zZW50U2V0dGluZ3NGb3JJbml0ID0gY29uc2VudFNldHRpbmdzO1xyXG59XHJcbi8qKlxyXG4gKiBTZXRzIHRoZSB2YXJpYWJsZSBgZGVmYXVsdEV2ZW50UGFyYW1ldGVyc0ZvckluaXRgIGZvciB1c2UgaW4gdGhlIGluaXRpYWxpemF0aW9uIG9mXHJcbiAqIGFuYWx5dGljcy5cclxuICpcclxuICogQHBhcmFtIGN1c3RvbVBhcmFtcyBBbnkgY3VzdG9tIHBhcmFtcyB0aGUgdXNlciBtYXkgcGFzcyB0byBndGFnLmpzLlxyXG4gKi9cclxuZnVuY3Rpb24gX3NldERlZmF1bHRFdmVudFBhcmFtZXRlcnNGb3JJbml0KGN1c3RvbVBhcmFtcykge1xyXG4gICAgZGVmYXVsdEV2ZW50UGFyYW1ldGVyc0ZvckluaXQgPSBjdXN0b21QYXJhbXM7XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuYXN5bmMgZnVuY3Rpb24gdmFsaWRhdGVJbmRleGVkREIoKSB7XHJcbiAgICB2YXIgX2E7XHJcbiAgICBpZiAoIWlzSW5kZXhlZERCQXZhaWxhYmxlKCkpIHtcclxuICAgICAgICBsb2dnZXIud2FybihFUlJPUl9GQUNUT1JZLmNyZWF0ZShcImluZGV4ZWRkYi11bmF2YWlsYWJsZVwiIC8qIElOREVYRUREQl9VTkFWQUlMQUJMRSAqLywge1xyXG4gICAgICAgICAgICBlcnJvckluZm86ICdJbmRleGVkREIgaXMgbm90IGF2YWlsYWJsZSBpbiB0aGlzIGVudmlyb25tZW50LidcclxuICAgICAgICB9KS5tZXNzYWdlKTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBhd2FpdCB2YWxpZGF0ZUluZGV4ZWREQk9wZW5hYmxlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIGxvZ2dlci53YXJuKEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKFwiaW5kZXhlZGRiLXVuYXZhaWxhYmxlXCIgLyogSU5ERVhFRERCX1VOQVZBSUxBQkxFICovLCB7XHJcbiAgICAgICAgICAgICAgICBlcnJvckluZm86IChfYSA9IGUpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS50b1N0cmluZygpXHJcbiAgICAgICAgICAgIH0pLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRydWU7XHJcbn1cclxuLyoqXHJcbiAqIEluaXRpYWxpemUgdGhlIGFuYWx5dGljcyBpbnN0YW5jZSBpbiBndGFnLmpzIGJ5IGNhbGxpbmcgY29uZmlnIGNvbW1hbmQgd2l0aCBmaWQuXHJcbiAqXHJcbiAqIE5PVEU6IFdlIGNvbWJpbmUgYW5hbHl0aWNzIGluaXRpYWxpemF0aW9uIGFuZCBzZXR0aW5nIGZpZCB0b2dldGhlciBiZWNhdXNlIHdlIHdhbnQgZmlkIHRvIGJlXHJcbiAqIHBhcnQgb2YgdGhlIGBwYWdlX3ZpZXdgIGV2ZW50IHRoYXQncyBzZW50IGR1cmluZyB0aGUgaW5pdGlhbGl6YXRpb25cclxuICogQHBhcmFtIGFwcCBGaXJlYmFzZSBhcHBcclxuICogQHBhcmFtIGd0YWdDb3JlIFRoZSBndGFnIGZ1bmN0aW9uIHRoYXQncyBub3Qgd3JhcHBlZC5cclxuICogQHBhcmFtIGR5bmFtaWNDb25maWdQcm9taXNlc0xpc3QgQXJyYXkgb2YgYWxsIGR5bmFtaWMgY29uZmlnIHByb21pc2VzLlxyXG4gKiBAcGFyYW0gbWVhc3VyZW1lbnRJZFRvQXBwSWQgTWFwcyBtZWFzdXJlbWVudElEIHRvIGFwcElELlxyXG4gKiBAcGFyYW0gaW5zdGFsbGF0aW9ucyBfRmlyZWJhc2VJbnN0YWxsYXRpb25zSW50ZXJuYWwgaW5zdGFuY2UuXHJcbiAqXHJcbiAqIEByZXR1cm5zIE1lYXN1cmVtZW50IElELlxyXG4gKi9cclxuYXN5bmMgZnVuY3Rpb24gX2luaXRpYWxpemVBbmFseXRpY3MoYXBwLCBkeW5hbWljQ29uZmlnUHJvbWlzZXNMaXN0LCBtZWFzdXJlbWVudElkVG9BcHBJZCwgaW5zdGFsbGF0aW9ucywgZ3RhZ0NvcmUsIGRhdGFMYXllck5hbWUsIG9wdGlvbnMpIHtcclxuICAgIHZhciBfYTtcclxuICAgIGNvbnN0IGR5bmFtaWNDb25maWdQcm9taXNlID0gZmV0Y2hEeW5hbWljQ29uZmlnV2l0aFJldHJ5KGFwcCk7XHJcbiAgICAvLyBPbmNlIGZldGNoZWQsIG1hcCBtZWFzdXJlbWVudElkcyB0byBhcHBJZCwgZm9yIGVhc2Ugb2YgbG9va3VwIGluIHdyYXBwZWQgZ3RhZyBmdW5jdGlvbi5cclxuICAgIGR5bmFtaWNDb25maWdQcm9taXNlXHJcbiAgICAgICAgLnRoZW4oY29uZmlnID0+IHtcclxuICAgICAgICBtZWFzdXJlbWVudElkVG9BcHBJZFtjb25maWcubWVhc3VyZW1lbnRJZF0gPSBjb25maWcuYXBwSWQ7XHJcbiAgICAgICAgaWYgKGFwcC5vcHRpb25zLm1lYXN1cmVtZW50SWQgJiZcclxuICAgICAgICAgICAgY29uZmlnLm1lYXN1cmVtZW50SWQgIT09IGFwcC5vcHRpb25zLm1lYXN1cmVtZW50SWQpIHtcclxuICAgICAgICAgICAgbG9nZ2VyLndhcm4oYFRoZSBtZWFzdXJlbWVudCBJRCBpbiB0aGUgbG9jYWwgRmlyZWJhc2UgY29uZmlnICgke2FwcC5vcHRpb25zLm1lYXN1cmVtZW50SWR9KWAgK1xyXG4gICAgICAgICAgICAgICAgYCBkb2VzIG5vdCBtYXRjaCB0aGUgbWVhc3VyZW1lbnQgSUQgZmV0Y2hlZCBmcm9tIHRoZSBzZXJ2ZXIgKCR7Y29uZmlnLm1lYXN1cmVtZW50SWR9KS5gICtcclxuICAgICAgICAgICAgICAgIGAgVG8gZW5zdXJlIGFuYWx5dGljcyBldmVudHMgYXJlIGFsd2F5cyBzZW50IHRvIHRoZSBjb3JyZWN0IEFuYWx5dGljcyBwcm9wZXJ0eSxgICtcclxuICAgICAgICAgICAgICAgIGAgdXBkYXRlIHRoZWAgK1xyXG4gICAgICAgICAgICAgICAgYCBtZWFzdXJlbWVudCBJRCBmaWVsZCBpbiB0aGUgbG9jYWwgY29uZmlnIG9yIHJlbW92ZSBpdCBmcm9tIHRoZSBsb2NhbCBjb25maWcuYCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuICAgICAgICAuY2F0Y2goZSA9PiBsb2dnZXIuZXJyb3IoZSkpO1xyXG4gICAgLy8gQWRkIHRvIGxpc3QgdG8gdHJhY2sgc3RhdGUgb2YgYWxsIGR5bmFtaWMgY29uZmlnIHByb21pc2VzLlxyXG4gICAgZHluYW1pY0NvbmZpZ1Byb21pc2VzTGlzdC5wdXNoKGR5bmFtaWNDb25maWdQcm9taXNlKTtcclxuICAgIGNvbnN0IGZpZFByb21pc2UgPSB2YWxpZGF0ZUluZGV4ZWREQigpLnRoZW4oZW52SXNWYWxpZCA9PiB7XHJcbiAgICAgICAgaWYgKGVudklzVmFsaWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGluc3RhbGxhdGlvbnMuZ2V0SWQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICBjb25zdCBbZHluYW1pY0NvbmZpZywgZmlkXSA9IGF3YWl0IFByb21pc2UuYWxsKFtcclxuICAgICAgICBkeW5hbWljQ29uZmlnUHJvbWlzZSxcclxuICAgICAgICBmaWRQcm9taXNlXHJcbiAgICBdKTtcclxuICAgIC8vIERldGVjdCBpZiB1c2VyIGhhcyBhbHJlYWR5IHB1dCB0aGUgZ3RhZyA8c2NyaXB0PiB0YWcgb24gdGhpcyBwYWdlIHdpdGggdGhlIHBhc3NlZCBpblxyXG4gICAgLy8gZGF0YSBsYXllciBuYW1lLlxyXG4gICAgaWYgKCFmaW5kR3RhZ1NjcmlwdE9uUGFnZShkYXRhTGF5ZXJOYW1lKSkge1xyXG4gICAgICAgIGluc2VydFNjcmlwdFRhZyhkYXRhTGF5ZXJOYW1lLCBkeW5hbWljQ29uZmlnLm1lYXN1cmVtZW50SWQpO1xyXG4gICAgfVxyXG4gICAgLy8gRGV0ZWN0cyBpZiB0aGVyZSBhcmUgY29uc2VudCBzZXR0aW5ncyB0aGF0IG5lZWQgdG8gYmUgY29uZmlndXJlZC5cclxuICAgIGlmIChkZWZhdWx0Q29uc2VudFNldHRpbmdzRm9ySW5pdCkge1xyXG4gICAgICAgIGd0YWdDb3JlKFwiY29uc2VudFwiIC8qIENPTlNFTlQgKi8sICdkZWZhdWx0JywgZGVmYXVsdENvbnNlbnRTZXR0aW5nc0ZvckluaXQpO1xyXG4gICAgICAgIF9zZXRDb25zZW50RGVmYXVsdEZvckluaXQodW5kZWZpbmVkKTtcclxuICAgIH1cclxuICAgIC8vIFRoaXMgY29tbWFuZCBpbml0aWFsaXplcyBndGFnLmpzIGFuZCBvbmx5IG5lZWRzIHRvIGJlIGNhbGxlZCBvbmNlIGZvciB0aGUgZW50aXJlIHdlYiBhcHAsXHJcbiAgICAvLyBidXQgc2luY2UgaXQgaXMgaWRlbXBvdGVudCwgd2UgY2FuIGNhbGwgaXQgbXVsdGlwbGUgdGltZXMuXHJcbiAgICAvLyBXZSBrZWVwIGl0IHRvZ2V0aGVyIHdpdGggb3RoZXIgaW5pdGlhbGl6YXRpb24gbG9naWMgZm9yIGJldHRlciBjb2RlIHN0cnVjdHVyZS5cclxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XHJcbiAgICBndGFnQ29yZSgnanMnLCBuZXcgRGF0ZSgpKTtcclxuICAgIC8vIFVzZXIgY29uZmlnIGFkZGVkIGZpcnN0LiBXZSBkb24ndCB3YW50IHVzZXJzIHRvIGFjY2lkZW50YWxseSBvdmVyd3JpdGVcclxuICAgIC8vIGJhc2UgRmlyZWJhc2UgY29uZmlnIHByb3BlcnRpZXMuXHJcbiAgICBjb25zdCBjb25maWdQcm9wZXJ0aWVzID0gKF9hID0gb3B0aW9ucyA9PT0gbnVsbCB8fCBvcHRpb25zID09PSB2b2lkIDAgPyB2b2lkIDAgOiBvcHRpb25zLmNvbmZpZykgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDoge307XHJcbiAgICAvLyBndWFyZCBhZ2FpbnN0IGRldmVsb3BlcnMgYWNjaWRlbnRhbGx5IHNldHRpbmcgcHJvcGVydGllcyB3aXRoIHByZWZpeCBgZmlyZWJhc2VfYFxyXG4gICAgY29uZmlnUHJvcGVydGllc1tPUklHSU5fS0VZXSA9ICdmaXJlYmFzZSc7XHJcbiAgICBjb25maWdQcm9wZXJ0aWVzLnVwZGF0ZSA9IHRydWU7XHJcbiAgICBpZiAoZmlkICE9IG51bGwpIHtcclxuICAgICAgICBjb25maWdQcm9wZXJ0aWVzW0dBX0ZJRF9LRVldID0gZmlkO1xyXG4gICAgfVxyXG4gICAgLy8gSXQgc2hvdWxkIGJlIHRoZSBmaXJzdCBjb25maWcgY29tbWFuZCBjYWxsZWQgb24gdGhpcyBHQS1JRFxyXG4gICAgLy8gSW5pdGlhbGl6ZSB0aGlzIEdBLUlEIGFuZCBzZXQgRklEIG9uIGl0IHVzaW5nIHRoZSBndGFnIGNvbmZpZyBBUEkuXHJcbiAgICAvLyBOb3RlOiBUaGlzIHdpbGwgdHJpZ2dlciBhIHBhZ2VfdmlldyBldmVudCB1bmxlc3MgJ3NlbmRfcGFnZV92aWV3JyBpcyBzZXQgdG8gZmFsc2UgaW5cclxuICAgIC8vIGBjb25maWdQcm9wZXJ0aWVzYC5cclxuICAgIGd0YWdDb3JlKFwiY29uZmlnXCIgLyogQ09ORklHICovLCBkeW5hbWljQ29uZmlnLm1lYXN1cmVtZW50SWQsIGNvbmZpZ1Byb3BlcnRpZXMpO1xyXG4gICAgLy8gRGV0ZWN0cyBpZiB0aGVyZSBpcyBkYXRhIHRoYXQgd2lsbCBiZSBzZXQgb24gZXZlcnkgZXZlbnQgbG9nZ2VkIGZyb20gdGhlIFNESy5cclxuICAgIGlmIChkZWZhdWx0RXZlbnRQYXJhbWV0ZXJzRm9ySW5pdCkge1xyXG4gICAgICAgIGd0YWdDb3JlKFwic2V0XCIgLyogU0VUICovLCBkZWZhdWx0RXZlbnRQYXJhbWV0ZXJzRm9ySW5pdCk7XHJcbiAgICAgICAgX3NldERlZmF1bHRFdmVudFBhcmFtZXRlcnNGb3JJbml0KHVuZGVmaW5lZCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZHluYW1pY0NvbmZpZy5tZWFzdXJlbWVudElkO1xyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbi8qKlxyXG4gKiBBbmFseXRpY3MgU2VydmljZSBjbGFzcy5cclxuICovXHJcbmNsYXNzIEFuYWx5dGljc1NlcnZpY2Uge1xyXG4gICAgY29uc3RydWN0b3IoYXBwKSB7XHJcbiAgICAgICAgdGhpcy5hcHAgPSBhcHA7XHJcbiAgICB9XHJcbiAgICBfZGVsZXRlKCkge1xyXG4gICAgICAgIGRlbGV0ZSBpbml0aWFsaXphdGlvblByb21pc2VzTWFwW3RoaXMuYXBwLm9wdGlvbnMuYXBwSWRdO1xyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcclxuICAgIH1cclxufVxyXG4vKipcclxuICogTWFwcyBhcHBJZCB0byBmdWxsIGluaXRpYWxpemF0aW9uIHByb21pc2UuIFdyYXBwZWQgZ3RhZyBjYWxscyBtdXN0IHdhaXQgb25cclxuICogYWxsIG9yIHNvbWUgb2YgdGhlc2UsIGRlcGVuZGluZyBvbiB0aGUgY2FsbCdzIGBzZW5kX3RvYCBwYXJhbSBhbmQgdGhlIHN0YXR1c1xyXG4gKiBvZiB0aGUgZHluYW1pYyBjb25maWcgZmV0Y2hlcyAoc2VlIGJlbG93KS5cclxuICovXHJcbmxldCBpbml0aWFsaXphdGlvblByb21pc2VzTWFwID0ge307XHJcbi8qKlxyXG4gKiBMaXN0IG9mIGR5bmFtaWMgY29uZmlnIGZldGNoIHByb21pc2VzLiBJbiBjZXJ0YWluIGNhc2VzLCB3cmFwcGVkIGd0YWcgY2FsbHNcclxuICogd2FpdCBvbiBhbGwgdGhlc2UgdG8gYmUgY29tcGxldGUgaW4gb3JkZXIgdG8gZGV0ZXJtaW5lIGlmIGl0IGNhbiBzZWxlY3RpdmVseVxyXG4gKiB3YWl0IGZvciBvbmx5IGNlcnRhaW4gaW5pdGlhbGl6YXRpb24gKEZJRCkgcHJvbWlzZXMgb3IgaWYgaXQgbXVzdCB3YWl0IGZvciBhbGwuXHJcbiAqL1xyXG5sZXQgZHluYW1pY0NvbmZpZ1Byb21pc2VzTGlzdCA9IFtdO1xyXG4vKipcclxuICogTWFwcyBmZXRjaGVkIG1lYXN1cmVtZW50SWRzIHRvIGFwcElkLiBQb3B1bGF0ZWQgd2hlbiB0aGUgYXBwJ3MgZHluYW1pYyBjb25maWdcclxuICogZmV0Y2ggY29tcGxldGVzLiBJZiBhbHJlYWR5IHBvcHVsYXRlZCwgZ3RhZyBjb25maWcgY2FsbHMgY2FuIHVzZSB0aGlzIHRvXHJcbiAqIHNlbGVjdGl2ZWx5IHdhaXQgZm9yIG9ubHkgdGhpcyBhcHAncyBpbml0aWFsaXphdGlvbiBwcm9taXNlIChGSUQpIGluc3RlYWQgb2YgYWxsXHJcbiAqIGluaXRpYWxpemF0aW9uIHByb21pc2VzLlxyXG4gKi9cclxuY29uc3QgbWVhc3VyZW1lbnRJZFRvQXBwSWQgPSB7fTtcclxuLyoqXHJcbiAqIE5hbWUgZm9yIHdpbmRvdyBnbG9iYWwgZGF0YSBsYXllciBhcnJheSB1c2VkIGJ5IEdBOiBkZWZhdWx0cyB0byAnZGF0YUxheWVyJy5cclxuICovXHJcbmxldCBkYXRhTGF5ZXJOYW1lID0gJ2RhdGFMYXllcic7XHJcbi8qKlxyXG4gKiBOYW1lIGZvciB3aW5kb3cgZ2xvYmFsIGd0YWcgZnVuY3Rpb24gdXNlZCBieSBHQTogZGVmYXVsdHMgdG8gJ2d0YWcnLlxyXG4gKi9cclxubGV0IGd0YWdOYW1lID0gJ2d0YWcnO1xyXG4vKipcclxuICogUmVwcm9kdWN0aW9uIG9mIHN0YW5kYXJkIGd0YWcgZnVuY3Rpb24gb3IgcmVmZXJlbmNlIHRvIGV4aXN0aW5nXHJcbiAqIGd0YWcgZnVuY3Rpb24gb24gd2luZG93IG9iamVjdC5cclxuICovXHJcbmxldCBndGFnQ29yZUZ1bmN0aW9uO1xyXG4vKipcclxuICogV3JhcHBlciBhcm91bmQgZ3RhZyBmdW5jdGlvbiB0aGF0IGVuc3VyZXMgRklEIGlzIHNlbnQgd2l0aCBhbGxcclxuICogcmVsZXZhbnQgZXZlbnQgYW5kIGNvbmZpZyBjYWxscy5cclxuICovXHJcbmxldCB3cmFwcGVkR3RhZ0Z1bmN0aW9uO1xyXG4vKipcclxuICogRmxhZyB0byBlbnN1cmUgcGFnZSBpbml0aWFsaXphdGlvbiBzdGVwcyAoY3JlYXRpb24gb3Igd3JhcHBpbmcgb2ZcclxuICogZGF0YUxheWVyIGFuZCBndGFnIHNjcmlwdCkgYXJlIG9ubHkgcnVuIG9uY2UgcGVyIHBhZ2UgbG9hZC5cclxuICovXHJcbmxldCBnbG9iYWxJbml0RG9uZSA9IGZhbHNlO1xyXG4vKipcclxuICogQ29uZmlndXJlcyBGaXJlYmFzZSBBbmFseXRpY3MgdG8gdXNlIGN1c3RvbSBgZ3RhZ2Agb3IgYGRhdGFMYXllcmAgbmFtZXMuXHJcbiAqIEludGVuZGVkIHRvIGJlIHVzZWQgaWYgYGd0YWcuanNgIHNjcmlwdCBoYXMgYmVlbiBpbnN0YWxsZWQgb25cclxuICogdGhpcyBwYWdlIGluZGVwZW5kZW50bHkgb2YgRmlyZWJhc2UgQW5hbHl0aWNzLCBhbmQgaXMgdXNpbmcgbm9uLWRlZmF1bHRcclxuICogbmFtZXMgZm9yIGVpdGhlciB0aGUgYGd0YWdgIGZ1bmN0aW9uIG9yIGZvciBgZGF0YUxheWVyYC5cclxuICogTXVzdCBiZSBjYWxsZWQgYmVmb3JlIGNhbGxpbmcgYGdldEFuYWx5dGljcygpYCBvciBpdCB3b24ndFxyXG4gKiBoYXZlIGFueSBlZmZlY3QuXHJcbiAqXHJcbiAqIEBwdWJsaWNcclxuICpcclxuICogQHBhcmFtIG9wdGlvbnMgLSBDdXN0b20gZ3RhZyBhbmQgZGF0YUxheWVyIG5hbWVzLlxyXG4gKi9cclxuZnVuY3Rpb24gc2V0dGluZ3Mob3B0aW9ucykge1xyXG4gICAgaWYgKGdsb2JhbEluaXREb25lKSB7XHJcbiAgICAgICAgdGhyb3cgRVJST1JfRkFDVE9SWS5jcmVhdGUoXCJhbHJlYWR5LWluaXRpYWxpemVkXCIgLyogQUxSRUFEWV9JTklUSUFMSVpFRCAqLyk7XHJcbiAgICB9XHJcbiAgICBpZiAob3B0aW9ucy5kYXRhTGF5ZXJOYW1lKSB7XHJcbiAgICAgICAgZGF0YUxheWVyTmFtZSA9IG9wdGlvbnMuZGF0YUxheWVyTmFtZTtcclxuICAgIH1cclxuICAgIGlmIChvcHRpb25zLmd0YWdOYW1lKSB7XHJcbiAgICAgICAgZ3RhZ05hbWUgPSBvcHRpb25zLmd0YWdOYW1lO1xyXG4gICAgfVxyXG59XHJcbi8qKlxyXG4gKiBSZXR1cm5zIHRydWUgaWYgbm8gZW52aXJvbm1lbnQgbWlzbWF0Y2ggaXMgZm91bmQuXHJcbiAqIElmIGVudmlyb25tZW50IG1pc21hdGNoZXMgYXJlIGZvdW5kLCB0aHJvd3MgYW4gSU5WQUxJRF9BTkFMWVRJQ1NfQ09OVEVYVFxyXG4gKiBlcnJvciB0aGF0IGFsc28gbGlzdHMgZGV0YWlscyBmb3IgZWFjaCBtaXNtYXRjaCBmb3VuZC5cclxuICovXHJcbmZ1bmN0aW9uIHdhcm5PbkJyb3dzZXJDb250ZXh0TWlzbWF0Y2goKSB7XHJcbiAgICBjb25zdCBtaXNtYXRjaGVkRW52TWVzc2FnZXMgPSBbXTtcclxuICAgIGlmIChpc0Jyb3dzZXJFeHRlbnNpb24oKSkge1xyXG4gICAgICAgIG1pc21hdGNoZWRFbnZNZXNzYWdlcy5wdXNoKCdUaGlzIGlzIGEgYnJvd3NlciBleHRlbnNpb24gZW52aXJvbm1lbnQuJyk7XHJcbiAgICB9XHJcbiAgICBpZiAoIWFyZUNvb2tpZXNFbmFibGVkKCkpIHtcclxuICAgICAgICBtaXNtYXRjaGVkRW52TWVzc2FnZXMucHVzaCgnQ29va2llcyBhcmUgbm90IGF2YWlsYWJsZS4nKTtcclxuICAgIH1cclxuICAgIGlmIChtaXNtYXRjaGVkRW52TWVzc2FnZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIGNvbnN0IGRldGFpbHMgPSBtaXNtYXRjaGVkRW52TWVzc2FnZXNcclxuICAgICAgICAgICAgLm1hcCgobWVzc2FnZSwgaW5kZXgpID0+IGAoJHtpbmRleCArIDF9KSAke21lc3NhZ2V9YClcclxuICAgICAgICAgICAgLmpvaW4oJyAnKTtcclxuICAgICAgICBjb25zdCBlcnIgPSBFUlJPUl9GQUNUT1JZLmNyZWF0ZShcImludmFsaWQtYW5hbHl0aWNzLWNvbnRleHRcIiAvKiBJTlZBTElEX0FOQUxZVElDU19DT05URVhUICovLCB7XHJcbiAgICAgICAgICAgIGVycm9ySW5mbzogZGV0YWlsc1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGxvZ2dlci53YXJuKGVyci5tZXNzYWdlKTtcclxuICAgIH1cclxufVxyXG4vKipcclxuICogQW5hbHl0aWNzIGluc3RhbmNlIGZhY3RvcnkuXHJcbiAqIEBpbnRlcm5hbFxyXG4gKi9cclxuZnVuY3Rpb24gZmFjdG9yeShhcHAsIGluc3RhbGxhdGlvbnMsIG9wdGlvbnMpIHtcclxuICAgIHdhcm5PbkJyb3dzZXJDb250ZXh0TWlzbWF0Y2goKTtcclxuICAgIGNvbnN0IGFwcElkID0gYXBwLm9wdGlvbnMuYXBwSWQ7XHJcbiAgICBpZiAoIWFwcElkKSB7XHJcbiAgICAgICAgdGhyb3cgRVJST1JfRkFDVE9SWS5jcmVhdGUoXCJuby1hcHAtaWRcIiAvKiBOT19BUFBfSUQgKi8pO1xyXG4gICAgfVxyXG4gICAgaWYgKCFhcHAub3B0aW9ucy5hcGlLZXkpIHtcclxuICAgICAgICBpZiAoYXBwLm9wdGlvbnMubWVhc3VyZW1lbnRJZCkge1xyXG4gICAgICAgICAgICBsb2dnZXIud2FybihgVGhlIFwiYXBpS2V5XCIgZmllbGQgaXMgZW1wdHkgaW4gdGhlIGxvY2FsIEZpcmViYXNlIGNvbmZpZy4gVGhpcyBpcyBuZWVkZWQgdG8gZmV0Y2ggdGhlIGxhdGVzdGAgK1xyXG4gICAgICAgICAgICAgICAgYCBtZWFzdXJlbWVudCBJRCBmb3IgdGhpcyBGaXJlYmFzZSBhcHAuIEZhbGxpbmcgYmFjayB0byB0aGUgbWVhc3VyZW1lbnQgSUQgJHthcHAub3B0aW9ucy5tZWFzdXJlbWVudElkfWAgK1xyXG4gICAgICAgICAgICAgICAgYCBwcm92aWRlZCBpbiB0aGUgXCJtZWFzdXJlbWVudElkXCIgZmllbGQgaW4gdGhlIGxvY2FsIEZpcmViYXNlIGNvbmZpZy5gKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKFwibm8tYXBpLWtleVwiIC8qIE5PX0FQSV9LRVkgKi8pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGlmIChpbml0aWFsaXphdGlvblByb21pc2VzTWFwW2FwcElkXSAhPSBudWxsKSB7XHJcbiAgICAgICAgdGhyb3cgRVJST1JfRkFDVE9SWS5jcmVhdGUoXCJhbHJlYWR5LWV4aXN0c1wiIC8qIEFMUkVBRFlfRVhJU1RTICovLCB7XHJcbiAgICAgICAgICAgIGlkOiBhcHBJZFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgaWYgKCFnbG9iYWxJbml0RG9uZSkge1xyXG4gICAgICAgIC8vIFN0ZXBzIGhlcmUgc2hvdWxkIG9ubHkgYmUgZG9uZSBvbmNlIHBlciBwYWdlOiBjcmVhdGlvbiBvciB3cmFwcGluZ1xyXG4gICAgICAgIC8vIG9mIGRhdGFMYXllciBhbmQgZ2xvYmFsIGd0YWcgZnVuY3Rpb24uXHJcbiAgICAgICAgZ2V0T3JDcmVhdGVEYXRhTGF5ZXIoZGF0YUxheWVyTmFtZSk7XHJcbiAgICAgICAgY29uc3QgeyB3cmFwcGVkR3RhZywgZ3RhZ0NvcmUgfSA9IHdyYXBPckNyZWF0ZUd0YWcoaW5pdGlhbGl6YXRpb25Qcm9taXNlc01hcCwgZHluYW1pY0NvbmZpZ1Byb21pc2VzTGlzdCwgbWVhc3VyZW1lbnRJZFRvQXBwSWQsIGRhdGFMYXllck5hbWUsIGd0YWdOYW1lKTtcclxuICAgICAgICB3cmFwcGVkR3RhZ0Z1bmN0aW9uID0gd3JhcHBlZEd0YWc7XHJcbiAgICAgICAgZ3RhZ0NvcmVGdW5jdGlvbiA9IGd0YWdDb3JlO1xyXG4gICAgICAgIGdsb2JhbEluaXREb25lID0gdHJ1ZTtcclxuICAgIH1cclxuICAgIC8vIEFzeW5jIGJ1dCBub24tYmxvY2tpbmcuXHJcbiAgICAvLyBUaGlzIG1hcCByZWZsZWN0cyB0aGUgY29tcGxldGlvbiBzdGF0ZSBvZiBhbGwgcHJvbWlzZXMgZm9yIGVhY2ggYXBwSWQuXHJcbiAgICBpbml0aWFsaXphdGlvblByb21pc2VzTWFwW2FwcElkXSA9IF9pbml0aWFsaXplQW5hbHl0aWNzKGFwcCwgZHluYW1pY0NvbmZpZ1Byb21pc2VzTGlzdCwgbWVhc3VyZW1lbnRJZFRvQXBwSWQsIGluc3RhbGxhdGlvbnMsIGd0YWdDb3JlRnVuY3Rpb24sIGRhdGFMYXllck5hbWUsIG9wdGlvbnMpO1xyXG4gICAgY29uc3QgYW5hbHl0aWNzSW5zdGFuY2UgPSBuZXcgQW5hbHl0aWNzU2VydmljZShhcHApO1xyXG4gICAgcmV0dXJuIGFuYWx5dGljc0luc3RhbmNlO1xyXG59XG5cbi8qIGVzbGludC1kaXNhYmxlIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnkgKi9cclxuLyoqXHJcbiAqIFJldHVybnMgYW4ge0BsaW5rIEFuYWx5dGljc30gaW5zdGFuY2UgZm9yIHRoZSBnaXZlbiBhcHAuXHJcbiAqXHJcbiAqIEBwdWJsaWNcclxuICpcclxuICogQHBhcmFtIGFwcCAtIFRoZSB7QGxpbmsgQGZpcmViYXNlL2FwcCNGaXJlYmFzZUFwcH0gdG8gdXNlLlxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0QW5hbHl0aWNzKGFwcCA9IGdldEFwcCgpKSB7XHJcbiAgICBhcHAgPSBnZXRNb2R1bGFySW5zdGFuY2UoYXBwKTtcclxuICAgIC8vIERlcGVuZGVuY2llc1xyXG4gICAgY29uc3QgYW5hbHl0aWNzUHJvdmlkZXIgPSBfZ2V0UHJvdmlkZXIoYXBwLCBBTkFMWVRJQ1NfVFlQRSk7XHJcbiAgICBpZiAoYW5hbHl0aWNzUHJvdmlkZXIuaXNJbml0aWFsaXplZCgpKSB7XHJcbiAgICAgICAgcmV0dXJuIGFuYWx5dGljc1Byb3ZpZGVyLmdldEltbWVkaWF0ZSgpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGluaXRpYWxpemVBbmFseXRpY3MoYXBwKTtcclxufVxyXG4vKipcclxuICogUmV0dXJucyBhbiB7QGxpbmsgQW5hbHl0aWNzfSBpbnN0YW5jZSBmb3IgdGhlIGdpdmVuIGFwcC5cclxuICpcclxuICogQHB1YmxpY1xyXG4gKlxyXG4gKiBAcGFyYW0gYXBwIC0gVGhlIHtAbGluayBAZmlyZWJhc2UvYXBwI0ZpcmViYXNlQXBwfSB0byB1c2UuXHJcbiAqL1xyXG5mdW5jdGlvbiBpbml0aWFsaXplQW5hbHl0aWNzKGFwcCwgb3B0aW9ucyA9IHt9KSB7XHJcbiAgICAvLyBEZXBlbmRlbmNpZXNcclxuICAgIGNvbnN0IGFuYWx5dGljc1Byb3ZpZGVyID0gX2dldFByb3ZpZGVyKGFwcCwgQU5BTFlUSUNTX1RZUEUpO1xyXG4gICAgaWYgKGFuYWx5dGljc1Byb3ZpZGVyLmlzSW5pdGlhbGl6ZWQoKSkge1xyXG4gICAgICAgIGNvbnN0IGV4aXN0aW5nSW5zdGFuY2UgPSBhbmFseXRpY3NQcm92aWRlci5nZXRJbW1lZGlhdGUoKTtcclxuICAgICAgICBpZiAoZGVlcEVxdWFsKG9wdGlvbnMsIGFuYWx5dGljc1Byb3ZpZGVyLmdldE9wdGlvbnMoKSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGV4aXN0aW5nSW5zdGFuY2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBFUlJPUl9GQUNUT1JZLmNyZWF0ZShcImFscmVhZHktaW5pdGlhbGl6ZWRcIiAvKiBBTFJFQURZX0lOSVRJQUxJWkVEICovKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBjb25zdCBhbmFseXRpY3NJbnN0YW5jZSA9IGFuYWx5dGljc1Byb3ZpZGVyLmluaXRpYWxpemUoeyBvcHRpb25zIH0pO1xyXG4gICAgcmV0dXJuIGFuYWx5dGljc0luc3RhbmNlO1xyXG59XHJcbi8qKlxyXG4gKiBUaGlzIGlzIGEgcHVibGljIHN0YXRpYyBtZXRob2QgcHJvdmlkZWQgdG8gdXNlcnMgdGhhdCB3cmFwcyBmb3VyIGRpZmZlcmVudCBjaGVja3M6XHJcbiAqXHJcbiAqIDEuIENoZWNrIGlmIGl0J3Mgbm90IGEgYnJvd3NlciBleHRlbnNpb24gZW52aXJvbm1lbnQuXHJcbiAqIDIuIENoZWNrIGlmIGNvb2tpZXMgYXJlIGVuYWJsZWQgaW4gY3VycmVudCBicm93c2VyLlxyXG4gKiAzLiBDaGVjayBpZiBJbmRleGVkREIgaXMgc3VwcG9ydGVkIGJ5IHRoZSBicm93c2VyIGVudmlyb25tZW50LlxyXG4gKiA0LiBDaGVjayBpZiB0aGUgY3VycmVudCBicm93c2VyIGNvbnRleHQgaXMgdmFsaWQgZm9yIHVzaW5nIGBJbmRleGVkREIub3BlbigpYC5cclxuICpcclxuICogQHB1YmxpY1xyXG4gKlxyXG4gKi9cclxuYXN5bmMgZnVuY3Rpb24gaXNTdXBwb3J0ZWQoKSB7XHJcbiAgICBpZiAoaXNCcm93c2VyRXh0ZW5zaW9uKCkpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBpZiAoIWFyZUNvb2tpZXNFbmFibGVkKCkpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBpZiAoIWlzSW5kZXhlZERCQXZhaWxhYmxlKCkpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IGlzREJPcGVuYWJsZSA9IGF3YWl0IHZhbGlkYXRlSW5kZXhlZERCT3BlbmFibGUoKTtcclxuICAgICAgICByZXR1cm4gaXNEQk9wZW5hYmxlO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG59XHJcbi8qKlxyXG4gKiBVc2UgZ3RhZyBgY29uZmlnYCBjb21tYW5kIHRvIHNldCBgc2NyZWVuX25hbWVgLlxyXG4gKlxyXG4gKiBAcHVibGljXHJcbiAqXHJcbiAqIEBkZXByZWNhdGVkIFVzZSB7QGxpbmsgbG9nRXZlbnR9IHdpdGggYGV2ZW50TmFtZWAgYXMgJ3NjcmVlbl92aWV3JyBhbmQgYWRkIHJlbGV2YW50IGBldmVudFBhcmFtc2AuXHJcbiAqIFNlZSB7QGxpbmsgaHR0cHM6Ly9maXJlYmFzZS5nb29nbGUuY29tL2RvY3MvYW5hbHl0aWNzL3NjcmVlbnZpZXdzIHwgVHJhY2sgU2NyZWVudmlld3N9LlxyXG4gKlxyXG4gKiBAcGFyYW0gYW5hbHl0aWNzSW5zdGFuY2UgLSBUaGUge0BsaW5rIEFuYWx5dGljc30gaW5zdGFuY2UuXHJcbiAqIEBwYXJhbSBzY3JlZW5OYW1lIC0gU2NyZWVuIG5hbWUgdG8gc2V0LlxyXG4gKi9cclxuZnVuY3Rpb24gc2V0Q3VycmVudFNjcmVlbihhbmFseXRpY3NJbnN0YW5jZSwgc2NyZWVuTmFtZSwgb3B0aW9ucykge1xyXG4gICAgYW5hbHl0aWNzSW5zdGFuY2UgPSBnZXRNb2R1bGFySW5zdGFuY2UoYW5hbHl0aWNzSW5zdGFuY2UpO1xyXG4gICAgc2V0Q3VycmVudFNjcmVlbiQxKHdyYXBwZWRHdGFnRnVuY3Rpb24sIGluaXRpYWxpemF0aW9uUHJvbWlzZXNNYXBbYW5hbHl0aWNzSW5zdGFuY2UuYXBwLm9wdGlvbnMuYXBwSWRdLCBzY3JlZW5OYW1lLCBvcHRpb25zKS5jYXRjaChlID0+IGxvZ2dlci5lcnJvcihlKSk7XHJcbn1cclxuLyoqXHJcbiAqIFVzZSBndGFnIGBjb25maWdgIGNvbW1hbmQgdG8gc2V0IGB1c2VyX2lkYC5cclxuICpcclxuICogQHB1YmxpY1xyXG4gKlxyXG4gKiBAcGFyYW0gYW5hbHl0aWNzSW5zdGFuY2UgLSBUaGUge0BsaW5rIEFuYWx5dGljc30gaW5zdGFuY2UuXHJcbiAqIEBwYXJhbSBpZCAtIFVzZXIgSUQgdG8gc2V0LlxyXG4gKi9cclxuZnVuY3Rpb24gc2V0VXNlcklkKGFuYWx5dGljc0luc3RhbmNlLCBpZCwgb3B0aW9ucykge1xyXG4gICAgYW5hbHl0aWNzSW5zdGFuY2UgPSBnZXRNb2R1bGFySW5zdGFuY2UoYW5hbHl0aWNzSW5zdGFuY2UpO1xyXG4gICAgc2V0VXNlcklkJDEod3JhcHBlZEd0YWdGdW5jdGlvbiwgaW5pdGlhbGl6YXRpb25Qcm9taXNlc01hcFthbmFseXRpY3NJbnN0YW5jZS5hcHAub3B0aW9ucy5hcHBJZF0sIGlkLCBvcHRpb25zKS5jYXRjaChlID0+IGxvZ2dlci5lcnJvcihlKSk7XHJcbn1cclxuLyoqXHJcbiAqIFVzZSBndGFnIGBjb25maWdgIGNvbW1hbmQgdG8gc2V0IGFsbCBwYXJhbXMgc3BlY2lmaWVkLlxyXG4gKlxyXG4gKiBAcHVibGljXHJcbiAqL1xyXG5mdW5jdGlvbiBzZXRVc2VyUHJvcGVydGllcyhhbmFseXRpY3NJbnN0YW5jZSwgcHJvcGVydGllcywgb3B0aW9ucykge1xyXG4gICAgYW5hbHl0aWNzSW5zdGFuY2UgPSBnZXRNb2R1bGFySW5zdGFuY2UoYW5hbHl0aWNzSW5zdGFuY2UpO1xyXG4gICAgc2V0VXNlclByb3BlcnRpZXMkMSh3cmFwcGVkR3RhZ0Z1bmN0aW9uLCBpbml0aWFsaXphdGlvblByb21pc2VzTWFwW2FuYWx5dGljc0luc3RhbmNlLmFwcC5vcHRpb25zLmFwcElkXSwgcHJvcGVydGllcywgb3B0aW9ucykuY2F0Y2goZSA9PiBsb2dnZXIuZXJyb3IoZSkpO1xyXG59XHJcbi8qKlxyXG4gKiBTZXRzIHdoZXRoZXIgR29vZ2xlIEFuYWx5dGljcyBjb2xsZWN0aW9uIGlzIGVuYWJsZWQgZm9yIHRoaXMgYXBwIG9uIHRoaXMgZGV2aWNlLlxyXG4gKiBTZXRzIGdsb2JhbCBgd2luZG93WydnYS1kaXNhYmxlLWFuYWx5dGljc0lkJ10gPSB0cnVlO2BcclxuICpcclxuICogQHB1YmxpY1xyXG4gKlxyXG4gKiBAcGFyYW0gYW5hbHl0aWNzSW5zdGFuY2UgLSBUaGUge0BsaW5rIEFuYWx5dGljc30gaW5zdGFuY2UuXHJcbiAqIEBwYXJhbSBlbmFibGVkIC0gSWYgdHJ1ZSwgZW5hYmxlcyBjb2xsZWN0aW9uLCBpZiBmYWxzZSwgZGlzYWJsZXMgaXQuXHJcbiAqL1xyXG5mdW5jdGlvbiBzZXRBbmFseXRpY3NDb2xsZWN0aW9uRW5hYmxlZChhbmFseXRpY3NJbnN0YW5jZSwgZW5hYmxlZCkge1xyXG4gICAgYW5hbHl0aWNzSW5zdGFuY2UgPSBnZXRNb2R1bGFySW5zdGFuY2UoYW5hbHl0aWNzSW5zdGFuY2UpO1xyXG4gICAgc2V0QW5hbHl0aWNzQ29sbGVjdGlvbkVuYWJsZWQkMShpbml0aWFsaXphdGlvblByb21pc2VzTWFwW2FuYWx5dGljc0luc3RhbmNlLmFwcC5vcHRpb25zLmFwcElkXSwgZW5hYmxlZCkuY2F0Y2goZSA9PiBsb2dnZXIuZXJyb3IoZSkpO1xyXG59XHJcbi8qKlxyXG4gKiBBZGRzIGRhdGEgdGhhdCB3aWxsIGJlIHNldCBvbiBldmVyeSBldmVudCBsb2dnZWQgZnJvbSB0aGUgU0RLLCBpbmNsdWRpbmcgYXV0b21hdGljIG9uZXMuXHJcbiAqIFdpdGggZ3RhZydzIFwic2V0XCIgY29tbWFuZCwgdGhlIHZhbHVlcyBwYXNzZWQgcGVyc2lzdCBvbiB0aGUgY3VycmVudCBwYWdlIGFuZCBhcmUgcGFzc2VkIHdpdGhcclxuICogYWxsIHN1YnNlcXVlbnQgZXZlbnRzLlxyXG4gKiBAcHVibGljXHJcbiAqIEBwYXJhbSBjdXN0b21QYXJhbXMgLSBBbnkgY3VzdG9tIHBhcmFtcyB0aGUgdXNlciBtYXkgcGFzcyB0byBndGFnLmpzLlxyXG4gKi9cclxuZnVuY3Rpb24gc2V0RGVmYXVsdEV2ZW50UGFyYW1ldGVycyhjdXN0b21QYXJhbXMpIHtcclxuICAgIC8vIENoZWNrIGlmIHJlZmVyZW5jZSB0byBleGlzdGluZyBndGFnIGZ1bmN0aW9uIG9uIHdpbmRvdyBvYmplY3QgZXhpc3RzXHJcbiAgICBpZiAod3JhcHBlZEd0YWdGdW5jdGlvbikge1xyXG4gICAgICAgIHdyYXBwZWRHdGFnRnVuY3Rpb24oXCJzZXRcIiAvKiBTRVQgKi8sIGN1c3RvbVBhcmFtcyk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBfc2V0RGVmYXVsdEV2ZW50UGFyYW1ldGVyc0ZvckluaXQoY3VzdG9tUGFyYW1zKTtcclxuICAgIH1cclxufVxyXG4vKipcclxuICogU2VuZHMgYSBHb29nbGUgQW5hbHl0aWNzIGV2ZW50IHdpdGggZ2l2ZW4gYGV2ZW50UGFyYW1zYC4gVGhpcyBtZXRob2RcclxuICogYXV0b21hdGljYWxseSBhc3NvY2lhdGVzIHRoaXMgbG9nZ2VkIGV2ZW50IHdpdGggdGhpcyBGaXJlYmFzZSB3ZWJcclxuICogYXBwIGluc3RhbmNlIG9uIHRoaXMgZGV2aWNlLlxyXG4gKiBMaXN0IG9mIG9mZmljaWFsIGV2ZW50IHBhcmFtZXRlcnMgY2FuIGJlIGZvdW5kIGluIHRoZSBndGFnLmpzXHJcbiAqIHJlZmVyZW5jZSBkb2N1bWVudGF0aW9uOlxyXG4gKiB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vZ3RhZ2pzL3JlZmVyZW5jZS9nYTQtZXZlbnRzXHJcbiAqIHwgdGhlIEdBNCByZWZlcmVuY2UgZG9jdW1lbnRhdGlvbn0uXHJcbiAqXHJcbiAqIEBwdWJsaWNcclxuICovXHJcbmZ1bmN0aW9uIGxvZ0V2ZW50KGFuYWx5dGljc0luc3RhbmNlLCBldmVudE5hbWUsIGV2ZW50UGFyYW1zLCBvcHRpb25zKSB7XHJcbiAgICBhbmFseXRpY3NJbnN0YW5jZSA9IGdldE1vZHVsYXJJbnN0YW5jZShhbmFseXRpY3NJbnN0YW5jZSk7XHJcbiAgICBsb2dFdmVudCQxKHdyYXBwZWRHdGFnRnVuY3Rpb24sIGluaXRpYWxpemF0aW9uUHJvbWlzZXNNYXBbYW5hbHl0aWNzSW5zdGFuY2UuYXBwLm9wdGlvbnMuYXBwSWRdLCBldmVudE5hbWUsIGV2ZW50UGFyYW1zLCBvcHRpb25zKS5jYXRjaChlID0+IGxvZ2dlci5lcnJvcihlKSk7XHJcbn1cclxuLyoqXHJcbiAqIFNldHMgdGhlIGFwcGxpY2FibGUgZW5kIHVzZXIgY29uc2VudCBzdGF0ZSBmb3IgdGhpcyB3ZWIgYXBwIGFjcm9zcyBhbGwgZ3RhZyByZWZlcmVuY2VzIG9uY2VcclxuICogRmlyZWJhc2UgQW5hbHl0aWNzIGlzIGluaXRpYWxpemVkLlxyXG4gKlxyXG4gKiBVc2UgdGhlIHtAbGluayBDb25zZW50U2V0dGluZ3N9IHRvIHNwZWNpZnkgaW5kaXZpZHVhbCBjb25zZW50IHR5cGUgdmFsdWVzLiBCeSBkZWZhdWx0IGNvbnNlbnRcclxuICogdHlwZXMgYXJlIHNldCB0byBcImdyYW50ZWRcIi5cclxuICogQHB1YmxpY1xyXG4gKiBAcGFyYW0gY29uc2VudFNldHRpbmdzIC0gTWFwcyB0aGUgYXBwbGljYWJsZSBlbmQgdXNlciBjb25zZW50IHN0YXRlIGZvciBndGFnLmpzLlxyXG4gKi9cclxuZnVuY3Rpb24gc2V0Q29uc2VudChjb25zZW50U2V0dGluZ3MpIHtcclxuICAgIC8vIENoZWNrIGlmIHJlZmVyZW5jZSB0byBleGlzdGluZyBndGFnIGZ1bmN0aW9uIG9uIHdpbmRvdyBvYmplY3QgZXhpc3RzXHJcbiAgICBpZiAod3JhcHBlZEd0YWdGdW5jdGlvbikge1xyXG4gICAgICAgIHdyYXBwZWRHdGFnRnVuY3Rpb24oXCJjb25zZW50XCIgLyogQ09OU0VOVCAqLywgJ3VwZGF0ZScsIGNvbnNlbnRTZXR0aW5ncyk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBfc2V0Q29uc2VudERlZmF1bHRGb3JJbml0KGNvbnNlbnRTZXR0aW5ncyk7XHJcbiAgICB9XHJcbn1cblxuY29uc3QgbmFtZSA9IFwiQGZpcmViYXNlL2FuYWx5dGljc1wiO1xuY29uc3QgdmVyc2lvbiA9IFwiMC44LjNcIjtcblxuLyoqXHJcbiAqIEZpcmViYXNlIEFuYWx5dGljc1xyXG4gKlxyXG4gKiBAcGFja2FnZURvY3VtZW50YXRpb25cclxuICovXHJcbmZ1bmN0aW9uIHJlZ2lzdGVyQW5hbHl0aWNzKCkge1xyXG4gICAgX3JlZ2lzdGVyQ29tcG9uZW50KG5ldyBDb21wb25lbnQoQU5BTFlUSUNTX1RZUEUsIChjb250YWluZXIsIHsgb3B0aW9uczogYW5hbHl0aWNzT3B0aW9ucyB9KSA9PiB7XHJcbiAgICAgICAgLy8gZ2V0SW1tZWRpYXRlIGZvciBGaXJlYmFzZUFwcCB3aWxsIGFsd2F5cyBzdWNjZWVkXHJcbiAgICAgICAgY29uc3QgYXBwID0gY29udGFpbmVyLmdldFByb3ZpZGVyKCdhcHAnKS5nZXRJbW1lZGlhdGUoKTtcclxuICAgICAgICBjb25zdCBpbnN0YWxsYXRpb25zID0gY29udGFpbmVyXHJcbiAgICAgICAgICAgIC5nZXRQcm92aWRlcignaW5zdGFsbGF0aW9ucy1pbnRlcm5hbCcpXHJcbiAgICAgICAgICAgIC5nZXRJbW1lZGlhdGUoKTtcclxuICAgICAgICByZXR1cm4gZmFjdG9yeShhcHAsIGluc3RhbGxhdGlvbnMsIGFuYWx5dGljc09wdGlvbnMpO1xyXG4gICAgfSwgXCJQVUJMSUNcIiAvKiBQVUJMSUMgKi8pKTtcclxuICAgIF9yZWdpc3RlckNvbXBvbmVudChuZXcgQ29tcG9uZW50KCdhbmFseXRpY3MtaW50ZXJuYWwnLCBpbnRlcm5hbEZhY3RvcnksIFwiUFJJVkFURVwiIC8qIFBSSVZBVEUgKi8pKTtcclxuICAgIHJlZ2lzdGVyVmVyc2lvbihuYW1lLCB2ZXJzaW9uKTtcclxuICAgIC8vIEJVSUxEX1RBUkdFVCB3aWxsIGJlIHJlcGxhY2VkIGJ5IHZhbHVlcyBsaWtlIGVzbTUsIGVzbTIwMTcsIGNqczUsIGV0YyBkdXJpbmcgdGhlIGNvbXBpbGF0aW9uXHJcbiAgICByZWdpc3RlclZlcnNpb24obmFtZSwgdmVyc2lvbiwgJ2VzbTIwMTcnKTtcclxuICAgIGZ1bmN0aW9uIGludGVybmFsRmFjdG9yeShjb250YWluZXIpIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCBhbmFseXRpY3MgPSBjb250YWluZXIuZ2V0UHJvdmlkZXIoQU5BTFlUSUNTX1RZUEUpLmdldEltbWVkaWF0ZSgpO1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgbG9nRXZlbnQ6IChldmVudE5hbWUsIGV2ZW50UGFyYW1zLCBvcHRpb25zKSA9PiBsb2dFdmVudChhbmFseXRpY3MsIGV2ZW50TmFtZSwgZXZlbnRQYXJhbXMsIG9wdGlvbnMpXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIHRocm93IEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKFwiaW50ZXJvcC1jb21wb25lbnQtcmVnLWZhaWxlZFwiIC8qIElOVEVST1BfQ09NUE9ORU5UX1JFR19GQUlMRUQgKi8sIHtcclxuICAgICAgICAgICAgICAgIHJlYXNvbjogZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxucmVnaXN0ZXJBbmFseXRpY3MoKTtcblxuZXhwb3J0IHsgZ2V0QW5hbHl0aWNzLCBpbml0aWFsaXplQW5hbHl0aWNzLCBpc1N1cHBvcnRlZCwgbG9nRXZlbnQsIHNldEFuYWx5dGljc0NvbGxlY3Rpb25FbmFibGVkLCBzZXRDb25zZW50LCBzZXRDdXJyZW50U2NyZWVuLCBzZXREZWZhdWx0RXZlbnRQYXJhbWV0ZXJzLCBzZXRVc2VySWQsIHNldFVzZXJQcm9wZXJ0aWVzLCBzZXR0aW5ncyB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguZXNtMjAxNy5qcy5tYXBcbiIsIi8vIHRoaXMgaXMgd2hlcmUgd2UgY2FuIGhhdmUgdGhlIGNsYXNzZXMgYW5kIGZ1bmN0aW9ucyBmb3IgYnVpbGRpbmcgdGhlIGV2ZW50c1xuLy8gdG8gc2VuZCB0byBhbiBhbmFseXRpY3MgcmVjb3JkZXIgKGZpcmViYXNlPyBscnM/KVxuXG5pbXBvcnQgeyBxRGF0YSwgYW5zd2VyRGF0YSB9IGZyb20gJy4uL2NvbXBvbmVudHMvcXVlc3Rpb25EYXRhJztcbmltcG9ydCB7IGxvZ0V2ZW50IH0gZnJvbSAnZmlyZWJhc2UvYW5hbHl0aWNzJztcbmltcG9ydCB7IGJ1Y2tldCB9IGZyb20gJy4uL2Fzc2Vzc21lbnQvYnVja2V0RGF0YSc7XG5cbi8vIENyZWF0ZSBhIHNpbmdsZXRvbiBjbGFzcyBmb3IgdGhlIGFuYWx5dGljcyBldmVudHNcbmV4cG9ydCBjbGFzcyBBbmFseXRpY3NFdmVudHMge1xuICBwcm90ZWN0ZWQgc3RhdGljIHV1aWQ6IHN0cmluZztcbiAgcHJvdGVjdGVkIHN0YXRpYyB1c2VyU291cmNlOiBzdHJpbmc7XG4gIHByb3RlY3RlZCBzdGF0aWMgY2xhdDtcbiAgcHJvdGVjdGVkIHN0YXRpYyBjbG9uO1xuICBwcm90ZWN0ZWQgc3RhdGljIGdhbmE7XG4gIHByb3RlY3RlZCBzdGF0aWMgbGF0bG9uZztcbiAgLy8gdmFyIGNpdHksIHJlZ2lvbiwgY291bnRyeTtcbiAgcHJvdGVjdGVkIHN0YXRpYyBkYXRhVVJMO1xuXG4gIHByb3RlY3RlZCBzdGF0aWMgYXBwVmVyc2lvbjtcbiAgcHJvdGVjdGVkIHN0YXRpYyBjb250ZW50VmVyc2lvbjtcblxuICBwcm90ZWN0ZWQgc3RhdGljIGFzc2Vzc21lbnRUeXBlOiBzdHJpbmc7XG5cbiAgc3RhdGljIGluc3RhbmNlOiBBbmFseXRpY3NFdmVudHM7XG5cbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcigpIHtcbiAgICAvLyBJbml0aWFsaXplIHRoZSBjbGFzc1xuICB9XG5cbiAgc3RhdGljIGdldEluc3RhbmNlKCk6IEFuYWx5dGljc0V2ZW50cyB7XG4gICAgaWYgKCFBbmFseXRpY3NFdmVudHMuaW5zdGFuY2UpIHtcbiAgICAgIEFuYWx5dGljc0V2ZW50cy5pbnN0YW5jZSA9IG5ldyBBbmFseXRpY3NFdmVudHMoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gQW5hbHl0aWNzRXZlbnRzLmluc3RhbmNlO1xuICB9XG5cbiAgc3RhdGljIHNldEFzc2Vzc21lbnRUeXBlKGFzc2Vzc21lbnRUeXBlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBBbmFseXRpY3NFdmVudHMuYXNzZXNzbWVudFR5cGUgPSBhc3Nlc3NtZW50VHlwZTtcbiAgfVxuXG4gIC8vIEdldCBMb2NhdGlvblxuICBzdGF0aWMgZ2V0TG9jYXRpb24oKTogdm9pZCB7XG4gICAgY29uc29sZS5sb2coJ3N0YXJ0aW5nIHRvIGdldCBsb2NhdGlvbicpO1xuICAgIGZldGNoKGBodHRwczovL2lwaW5mby5pby9qc29uP3Rva2VuPWI2MjY4NzI3MTc4NjEwYClcbiAgICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZygnZ290IGxvY2F0aW9uIHJlc3BvbnNlJyk7XG4gICAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgICAgICB0aHJvdyBFcnJvcihyZXNwb25zZS5zdGF0dXNUZXh0KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuICAgICAgfSlcbiAgICAgIC50aGVuKChqc29uUmVzcG9uc2UpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coanNvblJlc3BvbnNlKTtcbiAgICAgICAgQW5hbHl0aWNzRXZlbnRzLmxhdGxvbmcgPSBqc29uUmVzcG9uc2UubG9jO1xuICAgICAgICB2YXIgbHBpZWNlcyA9IEFuYWx5dGljc0V2ZW50cy5sYXRsb25nLnNwbGl0KCcsJyk7XG4gICAgICAgIHZhciBsYXQgPSBwYXJzZUZsb2F0KGxwaWVjZXNbMF0pLnRvRml4ZWQoMik7XG4gICAgICAgIHZhciBsb24gPSBwYXJzZUZsb2F0KGxwaWVjZXNbMV0pLnRvRml4ZWQoMSk7XG4gICAgICAgIEFuYWx5dGljc0V2ZW50cy5jbGF0ID0gbGF0O1xuICAgICAgICBBbmFseXRpY3NFdmVudHMuY2xvbiA9IGxvbjtcbiAgICAgICAgQW5hbHl0aWNzRXZlbnRzLmxhdGxvbmcgPSAnJztcbiAgICAgICAgbHBpZWNlcyA9IFtdO1xuICAgICAgICAvLyBjaXR5ID0ganNvblJlc3BvbnNlLmNpdHk7XG4gICAgICAgIC8vIHJlZ2lvbiA9IGpzb25SZXNwb25zZS5yZWdpb247XG4gICAgICAgIC8vIGNvdW50cnkgPSBqc29uUmVzcG9uc2UuY291bnRyeTtcbiAgICAgICAgQW5hbHl0aWNzRXZlbnRzLnNlbmRMb2NhdGlvbigpO1xuXG4gICAgICAgIHJldHVybiB7fTtcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICBjb25zb2xlLndhcm4oYGxvY2F0aW9uIGZhaWxlZCB0byB1cGRhdGUhIGVuY291bnRlcmVkIGVycm9yICR7ZXJyLm1zZ31gKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgLy8gTGluayBBbmFseXRpY3NcbiAgc3RhdGljIGxpbmtBbmFseXRpY3MobmV3Z2FuYSwgZGF0YXVybCk6IHZvaWQge1xuICAgIEFuYWx5dGljc0V2ZW50cy5nYW5hID0gbmV3Z2FuYTtcbiAgICBBbmFseXRpY3NFdmVudHMuZGF0YVVSTCA9IGRhdGF1cmw7XG4gIH1cblxuICAvLyBTZXQgVVVJRFxuICBzdGF0aWMgc2V0VXVpZChuZXdVdWlkOiBzdHJpbmcsIG5ld1VzZXJTb3VyY2U6IHN0cmluZyk6IHZvaWQge1xuICAgIEFuYWx5dGljc0V2ZW50cy51dWlkID0gbmV3VXVpZDtcbiAgICBBbmFseXRpY3NFdmVudHMudXNlclNvdXJjZSA9IG5ld1VzZXJTb3VyY2U7XG4gIH1cblxuICAvLyBTZW5kIEluaXRcbiAgc3RhdGljIHNlbmRJbml0KGFwcFZlcnNpb246IHN0cmluZywgY29udGVudFZlcnNpb246IHN0cmluZyk6IHZvaWQge1xuICAgIEFuYWx5dGljc0V2ZW50cy5hcHBWZXJzaW9uID0gYXBwVmVyc2lvbjtcbiAgICBBbmFseXRpY3NFdmVudHMuY29udGVudFZlcnNpb24gPSBjb250ZW50VmVyc2lvbjtcblxuICAgIEFuYWx5dGljc0V2ZW50cy5nZXRMb2NhdGlvbigpO1xuXG4gICAgdmFyIGV2ZW50U3RyaW5nID0gJ3VzZXIgJyArIEFuYWx5dGljc0V2ZW50cy51dWlkICsgJyBvcGVuZWQgdGhlIGFzc2Vzc21lbnQnO1xuXG4gICAgY29uc29sZS5sb2coZXZlbnRTdHJpbmcpO1xuXG4gICAgbG9nRXZlbnQoQW5hbHl0aWNzRXZlbnRzLmdhbmEsICdvcGVuZWQnLCB7fSk7XG4gIH1cblxuICAvLyBHZXQgQXBwIExhbmd1YWdlIEZyb20gRGF0YSBVUkxcbiAgc3RhdGljIGdldEFwcExhbmd1YWdlRnJvbURhdGFVUkwoYXBwVHlwZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAvLyBDaGVjayBpZiBhcHAgdHlwZSBpcyBub3QgZW1wdHkgYW5kIHNwbGl0IHRoZSBzdHJpbmcgYnkgdGhlIGh5cGhlbiB0aGVuIHJldHVybiB0aGUgZmlyc3QgZWxlbWVudFxuICAgIGlmIChhcHBUeXBlICYmIGFwcFR5cGUgIT09ICcnICYmIGFwcFR5cGUuaW5jbHVkZXMoJy0nKSkge1xuICAgICAgbGV0IGxhbmd1YWdlOiBzdHJpbmcgPSBhcHBUeXBlLnNwbGl0KCctJykuc2xpY2UoMCwgLTEpLmpvaW4oJy0nKTtcbiAgICAgIGlmIChsYW5ndWFnZS5pbmNsdWRlcygnd2VzdC1hZnJpY2FuJykpIHtcbiAgICAgICAgcmV0dXJuICd3ZXN0LWFmcmljYW4tZW5nbGlzaCc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbGFuZ3VhZ2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuICdOb3RBdmFpbGFibGUnO1xuICB9XG5cbiAgLy8gR2V0IEFwcCBUeXBlIEZyb20gRGF0YSBVUkxcbiAgc3RhdGljIGdldEFwcFR5cGVGcm9tRGF0YVVSTChhcHBUeXBlOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIC8vIENoZWNrIGlmIGFwcCB0eXBlIGlzIG5vdCBlbXB0eSBhbmQgc3BsaXQgdGhlIHN0cmluZyBieSB0aGUgaHlwaGVuIHRoZW4gcmV0dXJuIHRoZSBsYXN0IGVsZW1lbnRcbiAgICBpZiAoYXBwVHlwZSAmJiBhcHBUeXBlICE9PSAnJyAmJiBhcHBUeXBlLmluY2x1ZGVzKCctJykpIHtcbiAgICAgIHJldHVybiBhcHBUeXBlLnN1YnN0cmluZyhhcHBUeXBlLmxhc3RJbmRleE9mKCctJykgKyAxKTtcbiAgICB9XG5cbiAgICByZXR1cm4gJ05vdEF2YWlsYWJsZSc7XG4gIH1cblxuICAvLyBTZW5kIExvY2F0aW9uXG4gIHN0YXRpYyBzZW5kTG9jYXRpb24oKTogdm9pZCB7XG4gICAgdmFyIGV2ZW50U3RyaW5nID1cbiAgICAgICdTZW5kaW5nIFVzZXIgY29vcmRpbmF0ZXM6ICcgKyBBbmFseXRpY3NFdmVudHMudXVpZCArICcgOiAnICsgQW5hbHl0aWNzRXZlbnRzLmNsYXQgKyAnLCAnICsgQW5hbHl0aWNzRXZlbnRzLmNsb247XG4gICAgY29uc29sZS5sb2coZXZlbnRTdHJpbmcpO1xuXG4gICAgbG9nRXZlbnQoQW5hbHl0aWNzRXZlbnRzLmdhbmEsICd1c2VyX2xvY2F0aW9uJywge1xuICAgICAgdXNlcjogQW5hbHl0aWNzRXZlbnRzLnV1aWQsXG4gICAgICBsYW5nOiBBbmFseXRpY3NFdmVudHMuZ2V0QXBwTGFuZ3VhZ2VGcm9tRGF0YVVSTChBbmFseXRpY3NFdmVudHMuZGF0YVVSTCksXG4gICAgICBhcHA6IEFuYWx5dGljc0V2ZW50cy5nZXRBcHBUeXBlRnJvbURhdGFVUkwoQW5hbHl0aWNzRXZlbnRzLmRhdGFVUkwpLFxuICAgICAgbGF0bG9uZzogQW5hbHl0aWNzRXZlbnRzLmpvaW5MYXRMb25nKEFuYWx5dGljc0V2ZW50cy5jbGF0LCBBbmFseXRpY3NFdmVudHMuY2xvbiksXG4gICAgfSk7XG5cbiAgICBjb25zb2xlLmxvZygnSU5JVElBTElaRUQgRVZFTlQgU0VOVCcpO1xuICAgIGNvbnNvbGUubG9nKCdBcHAgTGFuZ3VhZ2U6ICcgKyBBbmFseXRpY3NFdmVudHMuZ2V0QXBwTGFuZ3VhZ2VGcm9tRGF0YVVSTChBbmFseXRpY3NFdmVudHMuZGF0YVVSTCkpO1xuICAgIGNvbnNvbGUubG9nKCdBcHAgVHlwZTogJyArIEFuYWx5dGljc0V2ZW50cy5nZXRBcHBUeXBlRnJvbURhdGFVUkwoQW5hbHl0aWNzRXZlbnRzLmRhdGFVUkwpKTtcbiAgICBjb25zb2xlLmxvZygnQXBwIFZlcnNpb246ICcgKyBBbmFseXRpY3NFdmVudHMuYXBwVmVyc2lvbik7XG4gICAgY29uc29sZS5sb2coJ0NvbnRlbnQgVmVyc2lvbjogJyArIEFuYWx5dGljc0V2ZW50cy5jb250ZW50VmVyc2lvbik7XG5cbiAgICBsb2dFdmVudChBbmFseXRpY3NFdmVudHMuZ2FuYSwgJ2luaXRpYWxpemVkJywge1xuICAgICAgdHlwZTogJ2luaXRpYWxpemVkJyxcbiAgICAgIGNsVXNlcklkOiBBbmFseXRpY3NFdmVudHMudXVpZCxcbiAgICAgIHVzZXJTb3VyY2U6IEFuYWx5dGljc0V2ZW50cy51c2VyU291cmNlLFxuICAgICAgbGF0TG9uZzogQW5hbHl0aWNzRXZlbnRzLmpvaW5MYXRMb25nKEFuYWx5dGljc0V2ZW50cy5jbGF0LCBBbmFseXRpY3NFdmVudHMuY2xvbiksXG4gICAgICBhcHBWZXJzaW9uOiBBbmFseXRpY3NFdmVudHMuYXBwVmVyc2lvbixcbiAgICAgIGNvbnRlbnRWZXJzaW9uOiBBbmFseXRpY3NFdmVudHMuY29udGVudFZlcnNpb24sXG4gICAgICAvLyBjaXR5OiBjaXR5LFxuICAgICAgLy8gcmVnaW9uOiByZWdpb24sXG4gICAgICAvLyBjb3VudHJ5OiBjb3VudHJ5LFxuICAgICAgYXBwOiBBbmFseXRpY3NFdmVudHMuZ2V0QXBwVHlwZUZyb21EYXRhVVJMKEFuYWx5dGljc0V2ZW50cy5kYXRhVVJMKSxcbiAgICAgIGxhbmc6IEFuYWx5dGljc0V2ZW50cy5nZXRBcHBMYW5ndWFnZUZyb21EYXRhVVJMKEFuYWx5dGljc0V2ZW50cy5kYXRhVVJMKSxcbiAgICB9KTtcbiAgfVxuXG4gIC8vIFNlbmQgQW5zd2VyZWRcbiAgc3RhdGljIHNlbmRBbnN3ZXJlZCh0aGVROiBxRGF0YSwgdGhlQTogbnVtYmVyLCBlbGFwc2VkOiBudW1iZXIpOiB2b2lkIHtcbiAgICB2YXIgYW5zID0gdGhlUS5hbnN3ZXJzW3RoZUEgLSAxXTtcblxuICAgIHZhciBpc2NvcnJlY3QgPSBudWxsO1xuICAgIHZhciBidWNrZXQgPSBudWxsO1xuICAgIGlmICgnY29ycmVjdCcgaW4gdGhlUSkge1xuICAgICAgaWYgKHRoZVEuY29ycmVjdCAhPSBudWxsKSB7XG4gICAgICAgIGlmICh0aGVRLmNvcnJlY3QgPT0gYW5zLmFuc3dlck5hbWUpIHtcbiAgICAgICAgICBpc2NvcnJlY3QgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlzY29ycmVjdCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmICgnYnVja2V0JyBpbiB0aGVRKSB7XG4gICAgICBidWNrZXQgPSB0aGVRLmJ1Y2tldDtcbiAgICB9XG4gICAgdmFyIGV2ZW50U3RyaW5nID0gJ3VzZXIgJyArIEFuYWx5dGljc0V2ZW50cy51dWlkICsgJyBhbnN3ZXJlZCAnICsgdGhlUS5xTmFtZSArICcgd2l0aCAnICsgYW5zLmFuc3dlck5hbWU7XG4gICAgZXZlbnRTdHJpbmcgKz0gJywgYWxsIGFuc3dlcnMgd2VyZSBbJztcbiAgICB2YXIgb3B0cyA9ICcnO1xuICAgIGZvciAodmFyIGFOdW0gaW4gdGhlUS5hbnN3ZXJzKSB7XG4gICAgICBldmVudFN0cmluZyArPSB0aGVRLmFuc3dlcnNbYU51bV0uYW5zd2VyTmFtZSArICcsJztcbiAgICAgIG9wdHMgKz0gdGhlUS5hbnN3ZXJzW2FOdW1dLmFuc3dlck5hbWUgKyAnLCc7XG4gICAgfVxuICAgIGV2ZW50U3RyaW5nICs9ICddICc7XG4gICAgZXZlbnRTdHJpbmcgKz0gaXNjb3JyZWN0O1xuICAgIGV2ZW50U3RyaW5nICs9IGJ1Y2tldDtcbiAgICBjb25zb2xlLmxvZyhldmVudFN0cmluZyk7XG4gICAgY29uc29sZS5sb2coJ0Fuc3dlcmVkIEFwcCBWZXJzaW9uOiAnICsgQW5hbHl0aWNzRXZlbnRzLmFwcFZlcnNpb24pO1xuICAgIGNvbnNvbGUubG9nKCdDb250ZW50IFZlcnNpb246ICcgKyBBbmFseXRpY3NFdmVudHMuY29udGVudFZlcnNpb24pO1xuXG4gICAgbG9nRXZlbnQoQW5hbHl0aWNzRXZlbnRzLmdhbmEsICdhbnN3ZXJlZCcsIHtcbiAgICAgIHR5cGU6ICdhbnN3ZXJlZCcsXG4gICAgICBjbFVzZXJJZDogQW5hbHl0aWNzRXZlbnRzLnV1aWQsXG4gICAgICB1c2VyU291cmNlOiBBbmFseXRpY3NFdmVudHMudXNlclNvdXJjZSxcbiAgICAgIGxhdExvbmc6IEFuYWx5dGljc0V2ZW50cy5qb2luTGF0TG9uZyhBbmFseXRpY3NFdmVudHMuY2xhdCwgQW5hbHl0aWNzRXZlbnRzLmNsb24pLFxuICAgICAgLy8gY2l0eTogY2l0eSxcbiAgICAgIC8vIHJlZ2lvbjogcmVnaW9uLFxuICAgICAgLy8gY291bnRyeTogY291bnRyeSxcbiAgICAgIGFwcDogQW5hbHl0aWNzRXZlbnRzLmdldEFwcFR5cGVGcm9tRGF0YVVSTChBbmFseXRpY3NFdmVudHMuZGF0YVVSTCksXG4gICAgICBsYW5nOiBBbmFseXRpY3NFdmVudHMuZ2V0QXBwTGFuZ3VhZ2VGcm9tRGF0YVVSTChBbmFseXRpY3NFdmVudHMuZGF0YVVSTCksXG4gICAgICBkdDogZWxhcHNlZCxcbiAgICAgIHF1ZXN0aW9uX251bWJlcjogdGhlUS5xTnVtYmVyLFxuICAgICAgdGFyZ2V0OiB0aGVRLnFUYXJnZXQsXG4gICAgICBxdWVzdGlvbjogdGhlUS5wcm9tcHRUZXh0LFxuICAgICAgc2VsZWN0ZWRfYW5zd2VyOiBhbnMuYW5zd2VyTmFtZSxcbiAgICAgIGlzY29ycmVjdDogaXNjb3JyZWN0LFxuICAgICAgb3B0aW9uczogb3B0cyxcbiAgICAgIGJ1Y2tldDogYnVja2V0LFxuICAgICAgYXBwVmVyc2lvbjogQW5hbHl0aWNzRXZlbnRzLmFwcFZlcnNpb24sXG4gICAgICBjb250ZW50VmVyc2lvbjogQW5hbHl0aWNzRXZlbnRzLmNvbnRlbnRWZXJzaW9uLFxuICAgIH0pO1xuICB9XG5cbiAgLy8gU2VuZCBCdWNrZXRcbiAgc3RhdGljIHNlbmRCdWNrZXQodGI6IGJ1Y2tldCwgcGFzc2VkOiBib29sZWFuKTogdm9pZCB7XG4gICAgdmFyIGJuID0gdGIuYnVja2V0SUQ7XG4gICAgdmFyIGJ0cmllZCA9IHRiLm51bVRyaWVkO1xuICAgIHZhciBiY29ycmVjdCA9IHRiLm51bUNvcnJlY3Q7XG5cbiAgICB2YXIgZXZlbnRTdHJpbmcgPVxuICAgICAgJ3VzZXIgJyArXG4gICAgICBBbmFseXRpY3NFdmVudHMudXVpZCArXG4gICAgICAnIGZpbmlzaGVkIHRoZSBidWNrZXQgJyArXG4gICAgICBibiArXG4gICAgICAnIHdpdGggJyArXG4gICAgICBiY29ycmVjdCArXG4gICAgICAnIGNvcnJlY3QgYW5zd2VycyBvdXQgb2YgJyArXG4gICAgICBidHJpZWQgK1xuICAgICAgJyB0cmllZCcgK1xuICAgICAgJyBhbmQgcGFzc2VkOiAnICtcbiAgICAgIHBhc3NlZDtcbiAgICBjb25zb2xlLmxvZyhldmVudFN0cmluZyk7XG4gICAgY29uc29sZS5sb2coJ0J1Y2tldCBDb21wbGV0ZWQgQXBwIFZlcnNpb246ICcgKyBBbmFseXRpY3NFdmVudHMuYXBwVmVyc2lvbik7XG4gICAgY29uc29sZS5sb2coJ0NvbnRlbnQgVmVyc2lvbjogJyArIEFuYWx5dGljc0V2ZW50cy5jb250ZW50VmVyc2lvbik7XG5cbiAgICBsb2dFdmVudChBbmFseXRpY3NFdmVudHMuZ2FuYSwgJ2J1Y2tldENvbXBsZXRlZCcsIHtcbiAgICAgIHR5cGU6ICdidWNrZXRDb21wbGV0ZWQnLFxuICAgICAgY2xVc2VySWQ6IEFuYWx5dGljc0V2ZW50cy51dWlkLFxuICAgICAgdXNlclNvdXJjZTogQW5hbHl0aWNzRXZlbnRzLnVzZXJTb3VyY2UsXG4gICAgICBsYXRMb25nOiBBbmFseXRpY3NFdmVudHMuam9pbkxhdExvbmcoQW5hbHl0aWNzRXZlbnRzLmNsYXQsIEFuYWx5dGljc0V2ZW50cy5jbG9uKSxcbiAgICAgIC8vIGNpdHk6IGNpdHksXG4gICAgICAvLyByZWdpb246IHJlZ2lvbixcbiAgICAgIC8vIGNvdW50cnk6IGNvdW50cnksXG4gICAgICBhcHA6IEFuYWx5dGljc0V2ZW50cy5nZXRBcHBUeXBlRnJvbURhdGFVUkwoQW5hbHl0aWNzRXZlbnRzLmRhdGFVUkwpLFxuICAgICAgbGFuZzogQW5hbHl0aWNzRXZlbnRzLmdldEFwcExhbmd1YWdlRnJvbURhdGFVUkwoQW5hbHl0aWNzRXZlbnRzLmRhdGFVUkwpLFxuICAgICAgYnVja2V0TnVtYmVyOiBibixcbiAgICAgIG51bWJlclRyaWVkSW5CdWNrZXQ6IGJ0cmllZCxcbiAgICAgIG51bWJlckNvcnJlY3RJbkJ1Y2tldDogYmNvcnJlY3QsXG4gICAgICBwYXNzZWRCdWNrZXQ6IHBhc3NlZCxcbiAgICAgIGFwcFZlcnNpb246IEFuYWx5dGljc0V2ZW50cy5hcHBWZXJzaW9uLFxuICAgICAgY29udGVudFZlcnNpb246IEFuYWx5dGljc0V2ZW50cy5jb250ZW50VmVyc2lvbixcbiAgICB9KTtcbiAgfVxuXG4gIC8vIFNlbmQgRmluaXNoZWRcbiAgc3RhdGljIHNlbmRGaW5pc2hlZChidWNrZXRzOiBidWNrZXRbXSA9IG51bGwsIGJhc2FsQnVja2V0OiBudW1iZXIsIGNlaWxpbmdCdWNrZXQ6IG51bWJlcik6IHZvaWQge1xuICAgIGxldCBldmVudFN0cmluZyA9ICd1c2VyICcgKyBBbmFseXRpY3NFdmVudHMudXVpZCArICcgZmluaXNoZWQgdGhlIGFzc2Vzc21lbnQnO1xuICAgIGNvbnNvbGUubG9nKGV2ZW50U3RyaW5nKTtcblxuICAgIGxldCBiYXNhbEJ1Y2tldElEID0gQW5hbHl0aWNzRXZlbnRzLmdldEJhc2FsQnVja2V0SUQoYnVja2V0cyk7XG4gICAgbGV0IGNlaWxpbmdCdWNrZXRJRCA9IEFuYWx5dGljc0V2ZW50cy5nZXRDZWlsaW5nQnVja2V0SUQoYnVja2V0cyk7XG5cbiAgICBpZiAoYmFzYWxCdWNrZXRJRCA9PSAwKSB7XG4gICAgICBiYXNhbEJ1Y2tldElEID0gY2VpbGluZ0J1Y2tldElEO1xuICAgIH1cblxuICAgIGxldCBzY29yZSA9IEFuYWx5dGljc0V2ZW50cy5jYWxjdWxhdGVTY29yZShidWNrZXRzLCBiYXNhbEJ1Y2tldElEKTtcbiAgICBjb25zdCBtYXhTY29yZSA9IGJ1Y2tldHMubGVuZ3RoICogMTAwO1xuXG4gICAgY29uc29sZS5sb2coJ1NlbmRpbmcgY29tcGxldGVkIGV2ZW50Jyk7XG4gICAgY29uc29sZS5sb2coJ1Njb3JlOiAnICsgc2NvcmUpO1xuICAgIGNvbnNvbGUubG9nKCdNYXggU2NvcmU6ICcgKyBtYXhTY29yZSk7XG4gICAgY29uc29sZS5sb2coJ0Jhc2FsIEJ1Y2tldDogJyArIGJhc2FsQnVja2V0SUQpO1xuICAgIGNvbnNvbGUubG9nKCdCQVNBTCBGUk9NIEFTU0VTU01FTlQ6ICcgKyBiYXNhbEJ1Y2tldCk7XG4gICAgY29uc29sZS5sb2coJ0NlaWxpbmcgQnVja2V0OiAnICsgY2VpbGluZ0J1Y2tldElEKTtcbiAgICBjb25zb2xlLmxvZygnQ0VJTElORyBGUk9NIEFTU0VTU01FTlQ6ICcgKyBjZWlsaW5nQnVja2V0KTtcbiAgICBjb25zb2xlLmxvZygnQ29tcGxldGVkIEFwcCBWZXJzaW9uOiAnICsgQW5hbHl0aWNzRXZlbnRzLmFwcFZlcnNpb24pO1xuICAgIGNvbnNvbGUubG9nKCdDb250ZW50IFZlcnNpb246ICcgKyBBbmFseXRpY3NFdmVudHMuY29udGVudFZlcnNpb24pO1xuXG4gICAgQW5hbHl0aWNzRXZlbnRzLnNlbmREYXRhVG9UaGlyZFBhcnR5KHNjb3JlLCBBbmFseXRpY3NFdmVudHMudXVpZCk7XG5cbiAgICAvLyBBdHRlbXB0IHRvIHNlbmQgdGhlIHNjb3JlIHRvIHRoZSBwYXJlbnQgY3VyaW91cyBmcmFtZSBpZiBpdCBleGlzdHNcbiAgICBpZiAod2luZG93LnBhcmVudCkge1xuICAgICAgd2luZG93LnBhcmVudC5wb3N0TWVzc2FnZShcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6ICdhc3Nlc3NtZW50X2NvbXBsZXRlZCcsXG4gICAgICAgICAgc2NvcmU6IHNjb3JlLFxuICAgICAgICAgIC8vIG1heFNjb3JlOiBtYXhTY29yZSxcbiAgICAgICAgICAvLyBiYXNhbEJ1Y2tldDogYmFzYWxCdWNrZXRJRCxcbiAgICAgICAgICAvLyBjZWlsaW5nQnVja2V0OiBjZWlsaW5nQnVja2V0SUQsXG4gICAgICAgICAgLy8gYXBwVmVyc2lvbjogQW5hbHl0aWNzRXZlbnRzLmFwcFZlcnNpb24sXG4gICAgICAgICAgLy8gY29udGVudFZlcnNpb246IEFuYWx5dGljc0V2ZW50cy5jb250ZW50VmVyc2lvbixcbiAgICAgICAgfSxcbiAgICAgICAgJ2h0dHBzOi8vc3luYXBzZS5jdXJpb3VzY29udGVudC5vcmcvJ1xuICAgICAgKTtcbiAgICB9XG5cbiAgICBsb2dFdmVudChBbmFseXRpY3NFdmVudHMuZ2FuYSwgJ2NvbXBsZXRlZCcsIHtcbiAgICAgIHR5cGU6ICdjb21wbGV0ZWQnLFxuICAgICAgY2xVc2VySWQ6IEFuYWx5dGljc0V2ZW50cy51dWlkLFxuICAgICAgdXNlclNvdXJjZTogQW5hbHl0aWNzRXZlbnRzLnVzZXJTb3VyY2UsXG4gICAgICBhcHA6IEFuYWx5dGljc0V2ZW50cy5nZXRBcHBUeXBlRnJvbURhdGFVUkwoQW5hbHl0aWNzRXZlbnRzLmRhdGFVUkwpLFxuICAgICAgbGFuZzogQW5hbHl0aWNzRXZlbnRzLmdldEFwcExhbmd1YWdlRnJvbURhdGFVUkwoQW5hbHl0aWNzRXZlbnRzLmRhdGFVUkwpLFxuICAgICAgbGF0TG9uZzogQW5hbHl0aWNzRXZlbnRzLmpvaW5MYXRMb25nKEFuYWx5dGljc0V2ZW50cy5jbGF0LCBBbmFseXRpY3NFdmVudHMuY2xvbiksXG4gICAgICAvLyBjaXR5OiBjaXR5LFxuICAgICAgLy8gcmVnaW9uOiByZWdpb24sXG4gICAgICAvLyBjb3VudHJ5OiBjb3VudHJ5LFxuICAgICAgc2NvcmU6IHNjb3JlLFxuICAgICAgbWF4U2NvcmU6IG1heFNjb3JlLFxuICAgICAgYmFzYWxCdWNrZXQ6IGJhc2FsQnVja2V0SUQsXG4gICAgICBjZWlsaW5nQnVja2V0OiBjZWlsaW5nQnVja2V0SUQsXG4gICAgICBhcHBWZXJzaW9uOiBBbmFseXRpY3NFdmVudHMuYXBwVmVyc2lvbixcbiAgICAgIGNvbnRlbnRWZXJzaW9uOiBBbmFseXRpY3NFdmVudHMuY29udGVudFZlcnNpb24sXG4gICAgfSk7XG4gIH1cblxuICBzdGF0aWMgc2VuZERhdGFUb1RoaXJkUGFydHkoc2NvcmU6IG51bWJlciwgdXVpZDogc3RyaW5nKTogdm9pZCB7XG4gICAgLy8gU2VuZCBkYXRhIHRvIHRoZSB0aGlyZCBwYXJ0eVxuICAgIGNvbnNvbGUubG9nKCdBdHRlbXB0aW5nIHRvIHNlbmQgc2NvcmUgdG8gYSB0aGlyZCBwYXJ0eSEgU2NvcmU6ICcsIHNjb3JlKTtcblxuICAgIC8vIFJlYWQgdGhlIFVSTCBmcm9tIHV0bSBwYXJhbWV0ZXJzXG4gICAgY29uc3QgdXJsUGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyh3aW5kb3cubG9jYXRpb24uc2VhcmNoKTtcbiAgICBjb25zdCB0YXJnZXRQYXJ0eVVSTCA9IHVybFBhcmFtcy5nZXQoJ2VuZHBvaW50Jyk7XG4gICAgY29uc3Qgb3JnYW5pemF0aW9uID0gdXJsUGFyYW1zLmdldCgnb3JnYW5pemF0aW9uJyk7XG4gICAgY29uc3QgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cbiAgICBpZiAoIXRhcmdldFBhcnR5VVJMKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdObyB0YXJnZXQgcGFydHkgVVJMIGZvdW5kIScpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHBheWxvYWQgPSB7XG4gICAgICB1c2VyOiB1dWlkLFxuICAgICAgcGFnZTogJzExMTEwODEyMTM2MzYxNScsXG4gICAgICBldmVudDoge1xuICAgICAgICB0eXBlOiAnZXh0ZXJuYWwnLFxuICAgICAgICB2YWx1ZToge1xuICAgICAgICAgIHR5cGU6ICdhc3Nlc3NtZW50JyxcbiAgICAgICAgICBzdWJUeXBlOiBBbmFseXRpY3NFdmVudHMuYXNzZXNzbWVudFR5cGUsXG4gICAgICAgICAgc2NvcmU6IHNjb3JlLFxuICAgICAgICAgIGNvbXBsZXRlZDogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfTtcblxuICAgIGNvbnN0IHBheWxvYWRTdHJpbmcgPSBKU09OLnN0cmluZ2lmeShwYXlsb2FkKTtcblxuICAgIHRyeSB7XG4gICAgICB4aHIub3BlbignUE9TVCcsIHRhcmdldFBhcnR5VVJMLCB0cnVlKTtcbiAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuXG4gICAgICB4aHIub25sb2FkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoeGhyLnN0YXR1cyA+PSAyMDAgJiYgeGhyLnN0YXR1cyA8IDMwMCkge1xuICAgICAgICAgIC8vIFJlcXVlc3Qgd2FzIHN1Y2Nlc3NmdWwsIGhhbmRsZSB0aGUgcmVzcG9uc2UgaGVyZVxuICAgICAgICAgIGNvbnNvbGUubG9nKCdQT1NUIHN1Y2Nlc3MhJyArIHhoci5yZXNwb25zZVRleHQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIFJlcXVlc3QgZmFpbGVkXG4gICAgICAgICAgY29uc29sZS5lcnJvcignUmVxdWVzdCBmYWlsZWQgd2l0aCBzdGF0dXM6ICcgKyB4aHIuc3RhdHVzKTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgeGhyLnNlbmQocGF5bG9hZFN0cmluZyk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byBzZW5kIGRhdGEgdG8gdGFyZ2V0IHBhcnR5OiAnLCBlcnJvcik7XG4gICAgfVxuICB9XG5cbiAgLy8gQ2FsY3VsYXRlIFNjb3JlXG4gIHN0YXRpYyBjYWxjdWxhdGVTY29yZShidWNrZXRzOiBidWNrZXRbXSwgYmFzYWxCdWNrZXRJRDogbnVtYmVyKTogbnVtYmVyIHtcbiAgICBjb25zb2xlLmxvZygnQ2FsY3VsYXRpbmcgc2NvcmUnKTtcbiAgICBjb25zb2xlLmxvZyhidWNrZXRzKTtcblxuICAgIGxldCBzY29yZSA9IDA7XG5cbiAgICBjb25zb2xlLmxvZygnQmFzYWwgQnVja2V0IElEOiAnICsgYmFzYWxCdWNrZXRJRCk7XG5cbiAgICAvLyBHZXQgdGhlIG51bWNvcnJlY3QgZnJvbSB0aGUgYmFzYWwgYnVja2V0IGJhc2VkIG9uIGxvb3BpbmcgdGhyb3VnaCBhbmQgZmluZGluZyB0aGUgYnVja2V0IGlkXG4gICAgbGV0IG51bUNvcnJlY3QgPSAwO1xuXG4gICAgZm9yIChjb25zdCBpbmRleCBpbiBidWNrZXRzKSB7XG4gICAgICBjb25zdCBidWNrZXQgPSBidWNrZXRzW2luZGV4XTtcbiAgICAgIGlmIChidWNrZXQuYnVja2V0SUQgPT0gYmFzYWxCdWNrZXRJRCkge1xuICAgICAgICBudW1Db3JyZWN0ID0gYnVja2V0Lm51bUNvcnJlY3Q7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnNvbGUubG9nKCdOdW0gQ29ycmVjdDogJyArIG51bUNvcnJlY3QsICcgYmFzYWw6ICcgKyBiYXNhbEJ1Y2tldElELCAnIGJ1Y2tldHM6ICcgKyBidWNrZXRzLmxlbmd0aCk7XG5cbiAgICBpZiAoYmFzYWxCdWNrZXRJRCA9PT0gYnVja2V0cy5sZW5ndGggJiYgbnVtQ29ycmVjdCA+PSA0KSB7XG4gICAgICAvLyBJZiB0aGUgdXNlciBoYXMgZW5vdWdoIGNvcnJlY3QgYW5zd2VycyBpbiB0aGUgbGFzdCBidWNrZXQsIGdpdmUgdGhlbSBhIHBlcmZlY3Qgc2NvcmVcbiAgICAgIGNvbnNvbGUubG9nKCdQZXJmZWN0IHNjb3JlJyk7XG5cbiAgICAgIHJldHVybiBidWNrZXRzLmxlbmd0aCAqIDEwMDtcbiAgICB9XG5cbiAgICBzY29yZSA9IE1hdGgucm91bmQoKGJhc2FsQnVja2V0SUQgLSAxKSAqIDEwMCArIChudW1Db3JyZWN0IC8gNSkgKiAxMDApIHwgMDtcblxuICAgIHJldHVybiBzY29yZTtcbiAgfVxuXG4gIC8vIEdldCBCYXNhbCBCdWNrZXQgSURcbiAgc3RhdGljIGdldEJhc2FsQnVja2V0SUQoYnVja2V0czogYnVja2V0W10pOiBudW1iZXIge1xuICAgIGxldCBidWNrZXRJRCA9IDA7XG5cbiAgICAvLyBTZWxlY3QgdGhlIGxvd2VzdCBidWNrZXRJRCBidWNrZXQgdGhhdCB0aGUgdXNlciBoYXMgZmFpbGVkXG4gICAgZm9yIChjb25zdCBpbmRleCBpbiBidWNrZXRzKSB7XG4gICAgICBjb25zdCBidWNrZXQgPSBidWNrZXRzW2luZGV4XTtcbiAgICAgIGlmIChidWNrZXQudGVzdGVkICYmICFidWNrZXQucGFzc2VkKSB7XG4gICAgICAgIGlmIChidWNrZXRJRCA9PSAwIHx8IGJ1Y2tldC5idWNrZXRJRCA8IGJ1Y2tldElEKSB7XG4gICAgICAgICAgYnVja2V0SUQgPSBidWNrZXQuYnVja2V0SUQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gYnVja2V0SUQ7XG4gIH1cblxuICAvLyBHZXQgQ2VpbGluZyBCdWNrZXQgSURcbiAgc3RhdGljIGdldENlaWxpbmdCdWNrZXRJRChidWNrZXRzOiBidWNrZXRbXSk6IG51bWJlciB7XG4gICAgbGV0IGJ1Y2tldElEID0gMDtcblxuICAgIC8vIFNlbGVjdCB0aGUgaGl1Z2hlc3QgYnVja2V0SUQgYnVja2V0IHRoYXQgdGhlIHVzZXIgaGFzIHBhc3NlZFxuICAgIGZvciAoY29uc3QgaW5kZXggaW4gYnVja2V0cykge1xuICAgICAgY29uc3QgYnVja2V0ID0gYnVja2V0c1tpbmRleF07XG4gICAgICBpZiAoYnVja2V0LnRlc3RlZCAmJiBidWNrZXQucGFzc2VkKSB7XG4gICAgICAgIGlmIChidWNrZXRJRCA9PSAwIHx8IGJ1Y2tldC5idWNrZXRJRCA+IGJ1Y2tldElEKSB7XG4gICAgICAgICAgYnVja2V0SUQgPSBidWNrZXQuYnVja2V0SUQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gYnVja2V0SUQ7XG4gIH1cblxuICAvLyBKb2luIExhdCBMb25nXG4gIHN0YXRpYyBqb2luTGF0TG9uZyhsYXQ6IHN0cmluZywgbG9uOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiBsYXQgKyAnLCcgKyBsb247XG4gIH1cbn1cbiIsImltcG9ydCB7IEFwcCB9IGZyb20gJy4vQXBwJztcbmltcG9ydCB7IEFuYWx5dGljc0V2ZW50cyB9IGZyb20gJy4vYW5hbHl0aWNzL2FuYWx5dGljc0V2ZW50cyc7XG5pbXBvcnQgeyBVSUNvbnRyb2xsZXIgfSBmcm9tICcuL3VpL3VpQ29udHJvbGxlcic7XG5pbXBvcnQgeyBVbml0eUJyaWRnZSB9IGZyb20gJy4vdXRpbHMvdW5pdHlCcmlkZ2UnO1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQmFzZVF1aXoge1xuICBwcm90ZWN0ZWQgYXBwOiBBcHA7XG4gIHB1YmxpYyBkYXRhVVJMOiBzdHJpbmc7XG4gIHB1YmxpYyB1bml0eUJyaWRnZTogVW5pdHlCcmlkZ2U7XG5cbiAgcHVibGljIGRldk1vZGVBdmFpbGFibGU6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHVibGljIGlzSW5EZXZNb2RlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgcHVibGljIGlzQ29ycmVjdExhYmVsU2hvd246IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHVibGljIGlzQnVja2V0SW5mb1Nob3duOiBib29sZWFuID0gZmFsc2U7XG4gIHB1YmxpYyBpc0J1Y2tldENvbnRyb2xzRW5hYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xuICBwdWJsaWMgYW5pbWF0aW9uU3BlZWRNdWx0aXBsaWVyOiBudW1iZXIgPSAxO1xuXG4gIHB1YmxpYyBkZXZNb2RlVG9nZ2xlQnV0dG9uQ29udGFpbmVySWQ6IHN0cmluZyA9ICdkZXZNb2RlTW9kYWxUb2dnbGVCdXR0b25Db250YWluZXInO1xuICBwdWJsaWMgZGV2TW9kZVRvZ2dsZUJ1dHRvbkNvbnRhaW5lcjogSFRNTEVsZW1lbnQ7XG5cbiAgcHVibGljIGRldk1vZGVUb2dnbGVCdXR0b25JZDogc3RyaW5nID0gJ2Rldk1vZGVNb2RhbFRvZ2dsZUJ1dHRvbic7XG4gIHB1YmxpYyBkZXZNb2RlVG9nZ2xlQnV0dG9uOiBIVE1MQnV0dG9uRWxlbWVudDtcblxuICBwdWJsaWMgZGV2TW9kZU1vZGFsSWQ6IHN0cmluZyA9ICdkZXZNb2RlU2V0dGluZ3NNb2RhbCc7XG4gIHB1YmxpYyBkZXZNb2RlU2V0dGluZ3NNb2RhbDogSFRNTEVsZW1lbnQ7XG5cbiAgcHVibGljIGRldk1vZGVCdWNrZXRHZW5TZWxlY3RJZDogc3RyaW5nID0gJ2Rldk1vZGVCdWNrZXRHZW5TZWxlY3QnO1xuICBwdWJsaWMgZGV2TW9kZUJ1Y2tldEdlblNlbGVjdDogSFRNTFNlbGVjdEVsZW1lbnQ7XG5cbiAgcHVibGljIGRldk1vZGVDb3JyZWN0TGFiZWxTaG93bkNoZWNrYm94SWQ6IHN0cmluZyA9ICdkZXZNb2RlQ29ycmVjdExhYmVsU2hvd25DaGVja2JveCc7XG4gIHB1YmxpYyBkZXZNb2RlQ29ycmVjdExhYmVsU2hvd25DaGVja2JveDogSFRNTElucHV0RWxlbWVudDtcblxuICBwdWJsaWMgZGV2TW9kZUJ1Y2tldEluZm9TaG93bkNoZWNrYm94SWQ6IHN0cmluZyA9ICdkZXZNb2RlQnVja2V0SW5mb1Nob3duQ2hlY2tib3gnO1xuICBwdWJsaWMgZGV2TW9kZUJ1Y2tldEluZm9TaG93bkNoZWNrYm94OiBIVE1MSW5wdXRFbGVtZW50O1xuICBwdWJsaWMgZGV2TW9kZUJ1Y2tldEluZm9Db250YWluZXJJZDogc3RyaW5nID0gJ2Rldk1vZGVCdWNrZXRJbmZvQ29udGFpbmVyJztcbiAgcHVibGljIGRldk1vZGVCdWNrZXRJbmZvQ29udGFpbmVyOiBIVE1MRWxlbWVudDtcblxuICBwdWJsaWMgZGV2TW9kZUJ1Y2tldENvbnRyb2xzU2hvd25DaGVja2JveElkOiBzdHJpbmcgPSAnZGV2TW9kZUJ1Y2tldENvbnRyb2xzU2hvd25DaGVja2JveCc7XG4gIHB1YmxpYyBkZXZNb2RlQnVja2V0Q29udHJvbHNTaG93bkNoZWNrYm94OiBIVE1MSW5wdXRFbGVtZW50O1xuXG4gIHB1YmxpYyBkZXZNb2RlQW5pbWF0aW9uU3BlZWRNdWx0aXBsaWVyUmFuZ2VJZDogc3RyaW5nID0gJ2Rldk1vZGVBbmltYXRpb25TcGVlZE11bHRpcGxpZXJSYW5nZSc7XG4gIHB1YmxpYyBkZXZNb2RlQW5pbWF0aW9uU3BlZWRNdWx0aXBsaWVyUmFuZ2U6IEhUTUxJbnB1dEVsZW1lbnQ7XG5cbiAgcHVibGljIGRldk1vZGVBbmltYXRpb25TcGVlZE11bHRpcGxpZXJWYWx1ZUlkOiBzdHJpbmcgPSAnZGV2TW9kZUFuaW1hdGlvblNwZWVkTXVsdGlwbGllclZhbHVlJztcbiAgcHVibGljIGRldk1vZGVBbmltYXRpb25TcGVlZE11bHRpcGxpZXJWYWx1ZTogSFRNTEVsZW1lbnQ7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5pc0luRGV2TW9kZSA9XG4gICAgICB3aW5kb3cubG9jYXRpb24uaHJlZi5pbmNsdWRlcygnbG9jYWxob3N0JykgfHxcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmLmluY2x1ZGVzKCcxMjcuMC4wLjEnKSB8fFxuICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYuaW5jbHVkZXMoJ2Fzc2Vzc21lbnRkZXYnKTtcbiAgICB0aGlzLmRldk1vZGVUb2dnbGVCdXR0b25Db250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmRldk1vZGVUb2dnbGVCdXR0b25Db250YWluZXJJZCk7XG4gICAgdGhpcy5kZXZNb2RlU2V0dGluZ3NNb2RhbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuZGV2TW9kZU1vZGFsSWQpO1xuXG4gICAgLy8gdGhpcy5kZXZNb2RlU2V0dGluZ3NNb2RhbC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGV2ZW50KSA9PiB7XG4gICAgLy8gXHQvLyBAdHMtaWdub3JlXG4gICAgLy8gXHRjb25zdCBpZCA9IGV2ZW50LnRhcmdldC5pZDtcbiAgICAvLyBcdGlmIChpZCA9PSB0aGlzLmRldk1vZGVNb2RhbElkKSB7XG4gICAgLy8gXHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIC8vIFx0XHR0aGlzLnRvZ2dsZURldk1vZGVNb2RhbCgpO1xuICAgIC8vIFx0fVxuICAgIC8vIH0pO1xuXG4gICAgdGhpcy5kZXZNb2RlQnVja2V0R2VuU2VsZWN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5kZXZNb2RlQnVja2V0R2VuU2VsZWN0SWQpIGFzIEhUTUxTZWxlY3RFbGVtZW50O1xuICAgIHRoaXMuZGV2TW9kZUJ1Y2tldEdlblNlbGVjdC5vbmNoYW5nZSA9IChldmVudCkgPT4ge1xuICAgICAgdGhpcy5oYW5kbGVCdWNrZXRHZW5Nb2RlQ2hhbmdlKGV2ZW50KTtcbiAgICB9O1xuXG4gICAgdGhpcy5kZXZNb2RlVG9nZ2xlQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5kZXZNb2RlVG9nZ2xlQnV0dG9uSWQpIGFzIEhUTUxCdXR0b25FbGVtZW50O1xuICAgIHRoaXMuZGV2TW9kZVRvZ2dsZUJ1dHRvbi5vbmNsaWNrID0gdGhpcy50b2dnbGVEZXZNb2RlTW9kYWw7XG5cbiAgICB0aGlzLmRldk1vZGVDb3JyZWN0TGFiZWxTaG93bkNoZWNrYm94ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG4gICAgICB0aGlzLmRldk1vZGVDb3JyZWN0TGFiZWxTaG93bkNoZWNrYm94SWRcbiAgICApIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgdGhpcy5kZXZNb2RlQ29ycmVjdExhYmVsU2hvd25DaGVja2JveC5vbmNoYW5nZSA9ICgpID0+IHtcbiAgICAgIHRoaXMuaXNDb3JyZWN0TGFiZWxTaG93biA9IHRoaXMuZGV2TW9kZUNvcnJlY3RMYWJlbFNob3duQ2hlY2tib3guY2hlY2tlZDtcbiAgICAgIHRoaXMuaGFuZGxlQ29ycmVjdExhYmVsU2hvd25DaGFuZ2UoKTtcbiAgICB9O1xuXG4gICAgdGhpcy5kZXZNb2RlQnVja2V0SW5mb1Nob3duQ2hlY2tib3ggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcbiAgICAgIHRoaXMuZGV2TW9kZUJ1Y2tldEluZm9TaG93bkNoZWNrYm94SWRcbiAgICApIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgdGhpcy5kZXZNb2RlQnVja2V0SW5mb1Nob3duQ2hlY2tib3gub25jaGFuZ2UgPSAoKSA9PiB7XG4gICAgICB0aGlzLmlzQnVja2V0SW5mb1Nob3duID0gdGhpcy5kZXZNb2RlQnVja2V0SW5mb1Nob3duQ2hlY2tib3guY2hlY2tlZDtcbiAgICAgIHRoaXMuZGV2TW9kZUJ1Y2tldEluZm9Db250YWluZXIuc3R5bGUuZGlzcGxheSA9IHRoaXMuaXNCdWNrZXRJbmZvU2hvd24gPyAnYmxvY2snIDogJ25vbmUnO1xuICAgICAgdGhpcy5oYW5kbGVCdWNrZXRJbmZvU2hvd25DaGFuZ2UoKTtcbiAgICB9O1xuXG4gICAgdGhpcy5kZXZNb2RlQnVja2V0Q29udHJvbHNTaG93bkNoZWNrYm94ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG4gICAgICB0aGlzLmRldk1vZGVCdWNrZXRDb250cm9sc1Nob3duQ2hlY2tib3hJZFxuICAgICkgYXMgSFRNTElucHV0RWxlbWVudDtcbiAgICB0aGlzLmRldk1vZGVCdWNrZXRDb250cm9sc1Nob3duQ2hlY2tib3gub25jaGFuZ2UgPSAoKSA9PiB7XG4gICAgICB0aGlzLmlzQnVja2V0Q29udHJvbHNFbmFibGVkID0gdGhpcy5kZXZNb2RlQnVja2V0Q29udHJvbHNTaG93bkNoZWNrYm94LmNoZWNrZWQ7XG4gICAgICB0aGlzLmhhbmRsZUJ1Y2tldENvbnRyb2xzU2hvd25DaGFuZ2UoKTtcbiAgICB9O1xuXG4gICAgdGhpcy5kZXZNb2RlQnVja2V0SW5mb0NvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuZGV2TW9kZUJ1Y2tldEluZm9Db250YWluZXJJZCk7XG5cbiAgICB0aGlzLmRldk1vZGVBbmltYXRpb25TcGVlZE11bHRpcGxpZXJSYW5nZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuICAgICAgdGhpcy5kZXZNb2RlQW5pbWF0aW9uU3BlZWRNdWx0aXBsaWVyUmFuZ2VJZFxuICAgICkgYXMgSFRNTElucHV0RWxlbWVudDtcblxuICAgIHRoaXMuZGV2TW9kZUFuaW1hdGlvblNwZWVkTXVsdGlwbGllclZhbHVlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5kZXZNb2RlQW5pbWF0aW9uU3BlZWRNdWx0aXBsaWVyVmFsdWVJZCk7XG5cbiAgICB0aGlzLmRldk1vZGVBbmltYXRpb25TcGVlZE11bHRpcGxpZXJSYW5nZS5vbmNoYW5nZSA9ICgpID0+IHtcbiAgICAgIHRoaXMuYW5pbWF0aW9uU3BlZWRNdWx0aXBsaWVyID0gcGFyc2VGbG9hdCh0aGlzLmRldk1vZGVBbmltYXRpb25TcGVlZE11bHRpcGxpZXJSYW5nZS52YWx1ZSk7XG4gICAgICBpZiAodGhpcy5hbmltYXRpb25TcGVlZE11bHRpcGxpZXIgPCAwLjIpIHtcbiAgICAgICAgdGhpcy5hbmltYXRpb25TcGVlZE11bHRpcGxpZXIgPSAwLjI7XG4gICAgICAgIHRoaXMuZGV2TW9kZUFuaW1hdGlvblNwZWVkTXVsdGlwbGllclJhbmdlLnZhbHVlID0gJzAuMic7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuZGV2TW9kZUFuaW1hdGlvblNwZWVkTXVsdGlwbGllclZhbHVlLmlubmVyVGV4dCA9IHRoaXMuYW5pbWF0aW9uU3BlZWRNdWx0aXBsaWVyLnRvU3RyaW5nKCk7XG4gICAgICB0aGlzLmhhbmRsZUFuaW1hdGlvblNwZWVkTXVsdGlwbGllckNoYW5nZSgpO1xuICAgIH07XG5cbiAgICBpZiAoIXRoaXMuaXNJbkRldk1vZGUpIHtcbiAgICAgIHRoaXMuZGV2TW9kZVRvZ2dsZUJ1dHRvbkNvbnRhaW5lci5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmRldk1vZGVUb2dnbGVCdXR0b25Db250YWluZXIuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgfVxuXG4gICAgLy8gSW5pdGlhbGl6ZSB0aGUgYW5pbWF0aW9uIHNwZWVkIG11bHRpcGxpZXIgdmFsdWUgYW5kIHBvc2l0aW9uXG4gICAgdGhpcy5hbmltYXRpb25TcGVlZE11bHRpcGxpZXIgPSBwYXJzZUZsb2F0KHRoaXMuZGV2TW9kZUFuaW1hdGlvblNwZWVkTXVsdGlwbGllclJhbmdlLnZhbHVlKTtcbiAgfVxuXG4gIHB1YmxpYyBoaWRlRGV2TW9kZUJ1dHRvbigpIHtcbiAgICB0aGlzLmRldk1vZGVUb2dnbGVCdXR0b25Db250YWluZXIuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgfVxuXG4gIHB1YmxpYyBhYnN0cmFjdCBoYW5kbGVCdWNrZXRHZW5Nb2RlQ2hhbmdlKGV2ZW50OiBFdmVudCk6IHZvaWQ7XG4gIHB1YmxpYyBhYnN0cmFjdCBoYW5kbGVDb3JyZWN0TGFiZWxTaG93bkNoYW5nZSgpOiB2b2lkO1xuICBwdWJsaWMgYWJzdHJhY3QgaGFuZGxlQnVja2V0SW5mb1Nob3duQ2hhbmdlKCk6IHZvaWQ7XG4gIHB1YmxpYyBhYnN0cmFjdCBoYW5kbGVCdWNrZXRDb250cm9sc1Nob3duQ2hhbmdlKCk6IHZvaWQ7XG4gIHB1YmxpYyBhYnN0cmFjdCBoYW5kbGVBbmltYXRpb25TcGVlZE11bHRpcGxpZXJDaGFuZ2UoKTogdm9pZDtcblxuICBwdWJsaWMgdG9nZ2xlRGV2TW9kZU1vZGFsID0gKCkgPT4ge1xuICAgIGlmICh0aGlzLmRldk1vZGVTZXR0aW5nc01vZGFsLnN0eWxlLmRpc3BsYXkgPT0gJ2Jsb2NrJykge1xuICAgICAgdGhpcy5kZXZNb2RlU2V0dGluZ3NNb2RhbC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmRldk1vZGVTZXR0aW5nc01vZGFsLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgIH1cbiAgfTtcblxuICBwdWJsaWMgYWJzdHJhY3QgUnVuKGFwcGxpbms6IEFwcCk6IHZvaWQ7XG4gIHB1YmxpYyBhYnN0cmFjdCBoYW5kbGVBbnN3ZXJCdXR0b25QcmVzcyhhbnM6IG51bWJlciwgZWxhcHNlZDogbnVtYmVyKTogdm9pZDtcbiAgcHVibGljIGFic3RyYWN0IEhhc1F1ZXN0aW9uc0xlZnQoKTogYm9vbGVhbjtcblxuICBwdWJsaWMgb25FbmQoKTogdm9pZCB7XG4gICAgLy8gc2VuZEZpbmlzaGVkKCk7XG4gICAgVUlDb250cm9sbGVyLlNob3dFbmQoKTtcbiAgICB0aGlzLmFwcC51bml0eUJyaWRnZS5TZW5kQ2xvc2UoKTtcbiAgfVxufVxuIiwiLy90aGlzIGlzIHdoZXJlIHRoZSBjb2RlIHdpbGwgZ28gZm9yIGxpbmVhcmx5IGl0ZXJhdGluZyB0aHJvdWdoIHRoZVxuLy9xdWVzdGlvbnMgaW4gYSBkYXRhLmpzb24gZmlsZSB0aGF0IGlkZW50aWZpZXMgaXRzZWxmIGFzIGEgc3VydmV5XG5cbmltcG9ydCB7IFVJQ29udHJvbGxlciB9IGZyb20gJy4uL3VpL3VpQ29udHJvbGxlcic7XG5pbXBvcnQgeyBBdWRpb0NvbnRyb2xsZXIgfSBmcm9tICcuLi9jb21wb25lbnRzL2F1ZGlvQ29udHJvbGxlcic7XG5pbXBvcnQgeyBxRGF0YSwgYW5zd2VyRGF0YSB9IGZyb20gJy4uL2NvbXBvbmVudHMvcXVlc3Rpb25EYXRhJztcbmltcG9ydCB7IEFuYWx5dGljc0V2ZW50cyB9IGZyb20gJy4uL2FuYWx5dGljcy9hbmFseXRpY3NFdmVudHMnO1xuaW1wb3J0IHsgQXBwIH0gZnJvbSAnLi4vQXBwJztcbmltcG9ydCB7IEJhc2VRdWl6IH0gZnJvbSAnLi4vYmFzZVF1aXonO1xuaW1wb3J0IHsgZmV0Y2hTdXJ2ZXlRdWVzdGlvbnMgfSBmcm9tICcuLi91dGlscy9qc29uVXRpbHMnO1xuaW1wb3J0IHsgVW5pdHlCcmlkZ2UgfSBmcm9tICcuLi91dGlscy91bml0eUJyaWRnZSc7XG5cbmV4cG9ydCBjbGFzcyBTdXJ2ZXkgZXh0ZW5kcyBCYXNlUXVpeiB7XG4gIHB1YmxpYyBxdWVzdGlvbnNEYXRhOiBxRGF0YVtdO1xuICBwdWJsaWMgY3VycmVudFF1ZXN0aW9uSW5kZXg6IG51bWJlcjtcblxuICBjb25zdHJ1Y3RvcihkYXRhVVJMOiBzdHJpbmcsIHVuaXR5QnJpZGdlKSB7XG4gICAgc3VwZXIoKTtcbiAgICBjb25zb2xlLmxvZygnU3VydmV5IGluaXRpYWxpemVkJyk7XG5cbiAgICB0aGlzLmRhdGFVUkwgPSBkYXRhVVJMO1xuICAgIHRoaXMudW5pdHlCcmlkZ2UgPSB1bml0eUJyaWRnZTtcbiAgICB0aGlzLmN1cnJlbnRRdWVzdGlvbkluZGV4ID0gMDtcbiAgICBVSUNvbnRyb2xsZXIuU2V0QnV0dG9uUHJlc3NBY3Rpb24odGhpcy5oYW5kbGVBbnN3ZXJCdXR0b25QcmVzcyk7XG4gICAgVUlDb250cm9sbGVyLlNldFN0YXJ0QWN0aW9uKHRoaXMuc3RhcnRTdXJ2ZXkpO1xuICB9XG5cbiAgcHVibGljIGhhbmRsZUFuaW1hdGlvblNwZWVkTXVsdGlwbGllckNoYW5nZSgpOiB2b2lkIHtcbiAgICBjb25zb2xlLmxvZygnQW5pbWF0aW9uIFNwZWVkIE11bHRpcGxpZXIgQ2hhbmdlZCcpO1xuICB9XG5cbiAgcHVibGljIGhhbmRsZUJ1Y2tldEdlbk1vZGVDaGFuZ2UgPSAoKSA9PiB7XG4gICAgY29uc29sZS5sb2coJ0J1Y2tldCBHZW4gTW9kZSBDaGFuZ2VkJyk7XG4gIH07XG5cbiAgcHVibGljIGhhbmRsZUNvcnJlY3RMYWJlbFNob3duQ2hhbmdlID0gKCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKCdDb3JyZWN0IExhYmVsIFNob3duIENoYW5nZWQnKTtcbiAgfTtcblxuICBwdWJsaWMgaGFuZGxlQnVja2V0SW5mb1Nob3duQ2hhbmdlID0gKCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKCdCdWNrZXQgSW5mbyBTaG93biBDaGFuZ2VkJyk7XG4gIH07XG5cbiAgcHVibGljIGhhbmRsZUJ1Y2tldENvbnRyb2xzU2hvd25DaGFuZ2UgPSAoKSA9PiB7XG4gICAgY29uc29sZS5sb2coJ0J1Y2tldCBDb250cm9scyBTaG93biBDaGFuZ2VkJyk7XG4gIH07XG5cbiAgcHVibGljIGFzeW5jIFJ1bihhcHA6IEFwcCkge1xuICAgIHRoaXMuYXBwID0gYXBwO1xuICAgIHRoaXMuYnVpbGRRdWVzdGlvbkxpc3QoKS50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgIHRoaXMucXVlc3Rpb25zRGF0YSA9IHJlc3VsdDtcbiAgICAgIEF1ZGlvQ29udHJvbGxlci5QcmVwYXJlQXVkaW9BbmRJbWFnZXNGb3JTdXJ2ZXkodGhpcy5xdWVzdGlvbnNEYXRhLCB0aGlzLmFwcC5HZXREYXRhVVJMKCkpO1xuICAgICAgdGhpcy51bml0eUJyaWRnZS5TZW5kTG9hZGVkKCk7XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgc3RhcnRTdXJ2ZXkgPSAoKSA9PiB7XG4gICAgVUlDb250cm9sbGVyLlJlYWR5Rm9yTmV4dCh0aGlzLmJ1aWxkTmV3UXVlc3Rpb24oKSk7XG4gIH07XG5cbiAgcHVibGljIG9uUXVlc3Rpb25FbmQgPSAoKSA9PiB7XG4gICAgVUlDb250cm9sbGVyLlNldEZlZWRiYWNrVmlzaWJpbGUoZmFsc2UsIGZhbHNlKTtcblxuICAgIHRoaXMuY3VycmVudFF1ZXN0aW9uSW5kZXggKz0gMTtcblxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuSGFzUXVlc3Rpb25zTGVmdCgpKSB7XG4gICAgICAgIFVJQ29udHJvbGxlci5SZWFkeUZvck5leHQodGhpcy5idWlsZE5ld1F1ZXN0aW9uKCkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5sb2coJ1RoZXJlIGFyZSBubyBxdWVzdGlvbnMgbGVmdC4nKTtcbiAgICAgICAgdGhpcy5vbkVuZCgpO1xuICAgICAgfVxuICAgIH0sIDUwMCk7XG4gIH07XG5cbiAgcHVibGljIGhhbmRsZUFuc3dlckJ1dHRvblByZXNzID0gKGFuc3dlcjogbnVtYmVyLCBlbGFwc2VkOiBudW1iZXIpID0+IHtcbiAgICBBbmFseXRpY3NFdmVudHMuc2VuZEFuc3dlcmVkKHRoaXMucXVlc3Rpb25zRGF0YVt0aGlzLmN1cnJlbnRRdWVzdGlvbkluZGV4XSwgYW5zd2VyLCBlbGFwc2VkKTtcbiAgICBVSUNvbnRyb2xsZXIuU2V0RmVlZGJhY2tWaXNpYmlsZSh0cnVlLCB0cnVlKTtcbiAgICBVSUNvbnRyb2xsZXIuQWRkU3RhcigpO1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5vblF1ZXN0aW9uRW5kKCk7XG4gICAgfSwgMjAwMCk7XG4gIH07XG5cbiAgcHVibGljIGJ1aWxkUXVlc3Rpb25MaXN0ID0gKCkgPT4ge1xuICAgIGNvbnN0IHN1cnZleVF1ZXN0aW9ucyA9IGZldGNoU3VydmV5UXVlc3Rpb25zKHRoaXMuYXBwLmRhdGFVUkwpO1xuICAgIHJldHVybiBzdXJ2ZXlRdWVzdGlvbnM7XG4gIH07XG5cbiAgcHVibGljIEhhc1F1ZXN0aW9uc0xlZnQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuY3VycmVudFF1ZXN0aW9uSW5kZXggPD0gdGhpcy5xdWVzdGlvbnNEYXRhLmxlbmd0aCAtIDE7XG4gIH1cblxuICBwdWJsaWMgYnVpbGROZXdRdWVzdGlvbigpOiBxRGF0YSB7XG4gICAgdmFyIHF1ZXN0aW9uRGF0YSA9IHRoaXMucXVlc3Rpb25zRGF0YVt0aGlzLmN1cnJlbnRRdWVzdGlvbkluZGV4XTtcbiAgICByZXR1cm4gcXVlc3Rpb25EYXRhO1xuICB9XG59XG4iLCJpbXBvcnQgeyBidWNrZXQgfSBmcm9tICcuLi9hc3Nlc3NtZW50L2J1Y2tldERhdGEnO1xuXG5leHBvcnQgY2xhc3MgVHJlZU5vZGUge1xuICB2YWx1ZTogbnVtYmVyIHwgYnVja2V0O1xuICBsZWZ0OiBUcmVlTm9kZSB8IG51bGw7XG4gIHJpZ2h0OiBUcmVlTm9kZSB8IG51bGw7XG5cbiAgY29uc3RydWN0b3IodmFsdWU6IG51bWJlcikge1xuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICB0aGlzLmxlZnQgPSBudWxsO1xuICAgIHRoaXMucmlnaHQgPSBudWxsO1xuICB9XG59XG5cbi8qKiBHZW5lcmF0ZXMgYSByYW5kb20gYmluYXJ5IHNlYXJjaCB0cmVlIGZyb20gYVxuIC0gSWYgdGhlIHN0YXJ0IGFuZCBlbmQgaW5kaWNlcyBhcmUgdGhlIHNhbWUsIHRoZSBmdW5jdGlvbiByZXR1cm5zIG51bGxcbiAtIElmIHRoZSBtaWRkbGUgaW5kZXggaXMgZXZlbiwgdGhlIGZ1bmN0aW9uIHVzZXMgdGhlIGV4YWN0IG1pZGRsZSBwb2ludFxuIC0gT3RoZXJ3aXNlLCB0aGUgZnVuY3Rpb24gcmFuZG9tbHkgYWRkcyAwIG9yIDEgdG8gdGhlIG1pZGRsZSBpbmRleFxuIC0gUmV0dXJucyB0aGUgcm9vdCBub2RlIG9mIHRoZSBnZW5lcmF0ZWQgYmluYXJ5IHNlYXJjaCB0cmVlIHdoaWNoIGNvbnRhaW5zIHRoZSBidWNrZXRJZHMgaWYgY2FsbGVkIHByb3Blcmx5XG4gLSBleDogbGV0IHJvb3RPZklkcyA9IHNvcnRlZEFycmF5VG9CU1QodGhpcy5idWNrZXRzLCB0aGlzLmJ1Y2tldHNbMF0uYnVja2V0SUQgLSAxLCB0aGlzLmJ1Y2tldHNbdGhpcy5idWNrZXRzLmxlbmd0aCAtIDFdLmJ1Y2tldElELCB1c2VkSW5kaWNlcyk7XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzb3J0ZWRBcnJheVRvSURzQlNUKHN0YXJ0LCBlbmQsIHVzZWRJbmRpY2VzKSB7XG4gIGlmIChzdGFydCA+IGVuZCkgcmV0dXJuIG51bGw7XG5cbiAgLy8gUmFuZG9taXplIG1pZGRsZSBwb2ludCB3aXRoaW4gdW51c2VkIGluZGljZXNcbiAgbGV0IG1pZDtcblxuICBpZiAoKHN0YXJ0ICsgZW5kKSAlIDIgPT09IDAgJiYgdXNlZEluZGljZXMuc2l6ZSAhPT0gMSkge1xuICAgIG1pZCA9IE1hdGguZmxvb3IoKHN0YXJ0ICsgZW5kKSAvIDIpOyAvLyBVc2UgdGhlIGV4YWN0IG1pZGRsZSBwb2ludFxuICAgIGlmIChtaWQgPT09IDApIHJldHVybiBudWxsO1xuICB9IGVsc2Uge1xuICAgIGRvIHtcbiAgICAgIG1pZCA9IE1hdGguZmxvb3IoKHN0YXJ0ICsgZW5kKSAvIDIpO1xuICAgICAgbWlkICs9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDIpOyAvLyBSYW5kb21seSBhZGQgMCBvciAxIHRvIG1pZFxuICAgIH0gd2hpbGUgKG1pZCA+IGVuZCB8fCB1c2VkSW5kaWNlcy5oYXMobWlkKSk7XG4gIH1cblxuICB1c2VkSW5kaWNlcy5hZGQobWlkKTtcblxuICBsZXQgbm9kZSA9IG5ldyBUcmVlTm9kZShtaWQpO1xuXG4gIG5vZGUubGVmdCA9IHNvcnRlZEFycmF5VG9JRHNCU1Qoc3RhcnQsIG1pZCAtIDEsIHVzZWRJbmRpY2VzKTtcbiAgbm9kZS5yaWdodCA9IHNvcnRlZEFycmF5VG9JRHNCU1QobWlkICsgMSwgZW5kLCB1c2VkSW5kaWNlcyk7XG5cbiAgcmV0dXJuIG5vZGU7XG59XG4iLCIvL3RoaXMgaXMgd2hlcmUgdGhlIGxvZ2ljIGZvciBoYW5kbGluZyB0aGUgYnVja2V0cyB3aWxsIGdvXG4vL1xuLy9vbmNlIHdlIHN0YXJ0IGFkZGluZyBpbiB0aGUgYXNzZXNzbWVudCBmdW5jdGlvbmFsaXR5XG5pbXBvcnQgeyBVSUNvbnRyb2xsZXIgfSBmcm9tICcuLi91aS91aUNvbnRyb2xsZXInO1xuaW1wb3J0IHsgcURhdGEsIGFuc3dlckRhdGEgfSBmcm9tICcuLi9jb21wb25lbnRzL3F1ZXN0aW9uRGF0YSc7XG5pbXBvcnQgeyBBbmFseXRpY3NFdmVudHMgfSBmcm9tICcuLi9hbmFseXRpY3MvYW5hbHl0aWNzRXZlbnRzJztcbmltcG9ydCB7IEFwcCB9IGZyb20gJy4uL0FwcCc7XG5pbXBvcnQgeyBidWNrZXQsIGJ1Y2tldEl0ZW0gfSBmcm9tICcuL2J1Y2tldERhdGEnO1xuaW1wb3J0IHsgQmFzZVF1aXogfSBmcm9tICcuLi9iYXNlUXVpeic7XG5pbXBvcnQgeyBmZXRjaEFzc2Vzc21lbnRCdWNrZXRzIH0gZnJvbSAnLi4vdXRpbHMvanNvblV0aWxzJztcbmltcG9ydCB7IFRyZWVOb2RlLCBzb3J0ZWRBcnJheVRvSURzQlNUIH0gZnJvbSAnLi4vY29tcG9uZW50cy90Tm9kZSc7XG5pbXBvcnQgeyByYW5kRnJvbSwgc2h1ZmZsZUFycmF5IH0gZnJvbSAnLi4vdXRpbHMvbWF0aFV0aWxzJztcbmltcG9ydCB7IEF1ZGlvQ29udHJvbGxlciB9IGZyb20gJy4uL2NvbXBvbmVudHMvYXVkaW9Db250cm9sbGVyJztcblxuZW51bSBzZWFyY2hTdGFnZSB7XG4gIEJpbmFyeVNlYXJjaCxcbiAgTGluZWFyU2VhcmNoVXAsXG4gIExpbmVhclNlYXJjaERvd24sXG59XG5cbmVudW0gQnVja2V0R2VuTW9kZSB7XG4gIFJhbmRvbUJTVCxcbiAgTGluZWFyQXJyYXlCYXNlZCxcbn1cblxuZXhwb3J0IGNsYXNzIEFzc2Vzc21lbnQgZXh0ZW5kcyBCYXNlUXVpeiB7XG4gIHB1YmxpYyB1bml0eUJyaWRnZTtcblxuICBwdWJsaWMgY3VycmVudE5vZGU6IFRyZWVOb2RlO1xuICBwdWJsaWMgY3VycmVudFF1ZXN0aW9uOiBxRGF0YTtcbiAgcHVibGljIGJ1Y2tldEFycmF5OiBudW1iZXJbXTtcbiAgcHVibGljIHF1ZXN0aW9uTnVtYmVyOiBudW1iZXI7XG5cbiAgcHVibGljIGJ1Y2tldHM6IGJ1Y2tldFtdO1xuICBwdWJsaWMgY3VycmVudEJ1Y2tldDogYnVja2V0O1xuICBwdWJsaWMgbnVtQnVja2V0czogbnVtYmVyO1xuICBwdWJsaWMgYmFzYWxCdWNrZXQ6IG51bWJlcjtcbiAgcHVibGljIGNlaWxpbmdCdWNrZXQ6IG51bWJlcjtcblxuICBwdWJsaWMgY3VycmVudExpbmVhckJ1Y2tldEluZGV4OiBudW1iZXI7XG4gIHB1YmxpYyBjdXJyZW50TGluZWFyVGFyZ2V0SW5kZXg6IG51bWJlcjtcblxuICBwcm90ZWN0ZWQgYnVja2V0R2VuTW9kZTogQnVja2V0R2VuTW9kZSA9IEJ1Y2tldEdlbk1vZGUuUmFuZG9tQlNUO1xuXG4gIHByaXZhdGUgTUFYX1NUQVJTX0NPVU5UX0lOX0xJTkVBUl9NT0RFID0gMjA7XG5cbiAgY29uc3RydWN0b3IoZGF0YVVSTDogc3RyaW5nLCB1bml0eUJyaWRnZTogYW55KSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLmRhdGFVUkwgPSBkYXRhVVJMO1xuICAgIHRoaXMudW5pdHlCcmlkZ2UgPSB1bml0eUJyaWRnZTtcbiAgICB0aGlzLnF1ZXN0aW9uTnVtYmVyID0gMDtcbiAgICBjb25zb2xlLmxvZygnYXBwIGluaXRpYWxpemVkJyk7XG4gICAgdGhpcy5zZXR1cFVJSGFuZGxlcnMoKTtcbiAgfVxuICBwcml2YXRlIHNldHVwVUlIYW5kbGVycygpOiB2b2lkIHtcbiAgICBVSUNvbnRyb2xsZXIuU2V0QnV0dG9uUHJlc3NBY3Rpb24odGhpcy5oYW5kbGVBbnN3ZXJCdXR0b25QcmVzcyk7XG4gICAgVUlDb250cm9sbGVyLlNldFN0YXJ0QWN0aW9uKHRoaXMuc3RhcnRBc3Nlc3NtZW50KTtcbiAgICB0aGlzLmhpZGVEZXZNb2RlQnV0dG9uKCk7XG4gICAgLy8gVUlDb250cm9sbGVyLlNldEV4dGVybmFsQnVja2V0Q29udHJvbHNHZW5lcmF0aW9uSGFuZGxlcih0aGlzLmdlbmVyYXRlRGV2TW9kZUJ1Y2tldENvbnRyb2xzSW5Db250YWluZXIpO1xuICB9XG4gIHB1YmxpYyBSdW4oYXBwbGluazogQXBwKTogdm9pZCB7XG4gICAgdGhpcy5hcHAgPSBhcHBsaW5rO1xuICAgIHRoaXMuYnVpbGRCdWNrZXRzKHRoaXMuYnVja2V0R2VuTW9kZSkudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyh0aGlzLmN1cnJlbnRCdWNrZXQpO1xuICAgICAgdGhpcy51bml0eUJyaWRnZS5TZW5kTG9hZGVkKCk7XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgaGFuZGxlQnVja2V0R2VuTW9kZUNoYW5nZShldmVudDogRXZlbnQpOiB2b2lkIHtcbiAgICAvLyBUT0RPOiBJbXBsZW1lbnQgaGFuZGxlQnVja2V0R2VuTW9kZUNoYW5nZVxuICAgIHRoaXMuYnVja2V0R2VuTW9kZSA9IHBhcnNlSW50KHRoaXMuZGV2TW9kZUJ1Y2tldEdlblNlbGVjdC52YWx1ZSkgYXMgQnVja2V0R2VuTW9kZTtcbiAgICB0aGlzLmJ1aWxkQnVja2V0cyh0aGlzLmJ1Y2tldEdlbk1vZGUpLnRoZW4oKCkgPT4ge1xuICAgICAgLy8gRmluaXNoZWQgYnVpbGRpbmcgYnVja2V0c1xuICAgIH0pO1xuICAgIHRoaXMudXBkYXRlQnVja2V0SW5mbygpO1xuICB9XG5cbiAgcHVibGljIGhhbmRsZUNvcnJlY3RMYWJlbFNob3duQ2hhbmdlKCk6IHZvaWQge1xuICAgIFVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLlNldENvcnJlY3RMYWJlbFZpc2liaWxpdHkodGhpcy5pc0NvcnJlY3RMYWJlbFNob3duKTtcbiAgfVxuXG4gIHB1YmxpYyBoYW5kbGVBbmltYXRpb25TcGVlZE11bHRpcGxpZXJDaGFuZ2UoKTogdm9pZCB7XG4gICAgVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkuU2V0QW5pbWF0aW9uU3BlZWRNdWx0aXBsaWVyKHRoaXMuYW5pbWF0aW9uU3BlZWRNdWx0aXBsaWVyKTtcbiAgfVxuXG4gIHB1YmxpYyBoYW5kbGVCdWNrZXRJbmZvU2hvd25DaGFuZ2UoKTogdm9pZCB7XG4gICAgdGhpcy51cGRhdGVCdWNrZXRJbmZvKCk7XG4gIH1cblxuICBwdWJsaWMgaGFuZGxlQnVja2V0Q29udHJvbHNTaG93bkNoYW5nZSgpOiB2b2lkIHtcbiAgICBVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5TZXRCdWNrZXRDb250cm9sc1Zpc2liaWxpdHkodGhpcy5pc0J1Y2tldENvbnRyb2xzRW5hYmxlZCk7XG4gIH1cblxuICBwdWJsaWMgZ2VuZXJhdGVEZXZNb2RlQnVja2V0Q29udHJvbHNJbkNvbnRhaW5lciA9IChjb250YWluZXI6IEhUTUxFbGVtZW50LCBjbGlja0hhbmRsZXI6ICgpID0+IHZvaWQpID0+IHtcbiAgICBpZiAodGhpcy5pc0luRGV2TW9kZSAmJiB0aGlzLmJ1Y2tldEdlbk1vZGUgPT09IEJ1Y2tldEdlbk1vZGUuTGluZWFyQXJyYXlCYXNlZCkge1xuICAgICAgLy8gQ3JlYXRlIGJ1dHRvbnMgZm9yIHRoZSBjdXJyZW50IGJ1Y2tldCBpdGVtcywgdGhhdCBhcmUgY2xpY2thYmxlIGFuZCB3aWxsIHRyaWdnZXIgdGhlIGl0ZW0gYXVkaW9cbiAgICAgIC8vIEFkZCAyIGJ1dHRvbnMsIG9uZSBmb3IgbW92aW5nIHVwIGFuZCBvbmUgZm9yIG1vdmluZyBkb3duIHRoZSBidWNrZXQgdHJlZVxuICAgICAgLy8gRW1wdHkgdGhlIGNvbnRhaW5lciBiZWZvcmUgYWRkaW5nIG5ldyBidXR0b25zXG4gICAgICBjb250YWluZXIuaW5uZXJIVE1MID0gJyc7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY3VycmVudEJ1Y2tldC5pdGVtcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBsZXQgaXRlbSA9IHRoaXMuY3VycmVudEJ1Y2tldC5pdGVtc1tpXTtcbiAgICAgICAgbGV0IGl0ZW1CdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgICAgbGV0IGluZGV4ID0gaTtcbiAgICAgICAgaXRlbUJ1dHRvbi5pbm5lclRleHQgPSBpdGVtLml0ZW1OYW1lO1xuICAgICAgICBpdGVtQnV0dG9uLnN0eWxlLm1hcmdpbiA9ICcycHgnO1xuICAgICAgICBpdGVtQnV0dG9uLm9uY2xpY2sgPSAoKSA9PiB7XG4gICAgICAgICAgdGhpcy5jdXJyZW50TGluZWFyVGFyZ2V0SW5kZXggPSBpbmRleDtcbiAgICAgICAgICB0aGlzLmN1cnJlbnRCdWNrZXQudXNlZEl0ZW1zID0gW107XG4gICAgICAgICAgY29uc29sZS5sb2coJ0NsaWNrZWQgb24gaXRlbSAnICsgaXRlbS5pdGVtTmFtZSArICcgYXQgaW5kZXggJyArIHRoaXMuY3VycmVudExpbmVhclRhcmdldEluZGV4KTtcbiAgICAgICAgICAvLyBVSUNvbnRyb2xsZXIuUmVhZHlGb3JOZXh0KHRoaXMuYnVpbGROZXdRdWVzdGlvbigpLCBmYWxzZSk7XG4gICAgICAgICAgY29uc3QgbmV3USA9IHRoaXMuYnVpbGROZXdRdWVzdGlvbigpO1xuICAgICAgICAgIFVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLmFuc3dlcnNDb250YWluZXIuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuICAgICAgICAgIGZvciAobGV0IGIgaW4gVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkuYnV0dG9ucykge1xuICAgICAgICAgICAgVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkuYnV0dG9uc1tiXS5zdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbic7XG4gICAgICAgICAgfVxuICAgICAgICAgIFVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLnNob3duID0gZmFsc2U7XG4gICAgICAgICAgVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkubmV4dFF1ZXN0aW9uID0gbmV3UTtcbiAgICAgICAgICBVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5xdWVzdGlvbnNDb250YWluZXIuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgICAgVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkucXVlc3Rpb25zQ29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgVUlDb250cm9sbGVyLlNob3dRdWVzdGlvbihuZXdRKTtcbiAgICAgICAgICBBdWRpb0NvbnRyb2xsZXIuUGxheUF1ZGlvKFxuICAgICAgICAgICAgdGhpcy5idWlsZE5ld1F1ZXN0aW9uKCkucHJvbXB0QXVkaW8sXG4gICAgICAgICAgICBVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5zaG93T3B0aW9ucyxcbiAgICAgICAgICAgIFVJQ29udHJvbGxlci5TaG93QXVkaW9BbmltYXRpb25cbiAgICAgICAgICApO1xuICAgICAgICAgIC8vIGNsaWNrSGFuZGxlcigpO1xuICAgICAgICB9O1xuICAgICAgICBjb250YWluZXIuYXBwZW5kKGl0ZW1CdXR0b24pO1xuICAgICAgfVxuICAgICAgLy8gQ3JlYXRlIDIgbW9yZSBidXR0b25zIGZvciBtb3ZpbmcgdXAgYW5kIGRvd24gdGhlIGJ1Y2tldCB0cmVlXG4gICAgICBsZXQgcHJldkJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgcHJldkJ1dHRvbi5pbm5lclRleHQgPSAnUHJldiBCdWNrZXQnO1xuICAgICAgaWYgKHRoaXMuY3VycmVudExpbmVhckJ1Y2tldEluZGV4ID09IDApIHtcbiAgICAgICAgcHJldkJ1dHRvbi5kaXNhYmxlZCA9IHRydWU7XG4gICAgICB9XG4gICAgICBwcmV2QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5jdXJyZW50TGluZWFyQnVja2V0SW5kZXggPiAwKSB7XG4gICAgICAgICAgdGhpcy5jdXJyZW50TGluZWFyQnVja2V0SW5kZXgtLTtcbiAgICAgICAgICB0aGlzLmN1cnJlbnRMaW5lYXJUYXJnZXRJbmRleCA9IDA7XG4gICAgICAgICAgdGhpcy50cnlNb3ZlQnVja2V0KGZhbHNlKTtcbiAgICAgICAgICBVSUNvbnRyb2xsZXIuUmVhZHlGb3JOZXh0KHRoaXMuYnVpbGROZXdRdWVzdGlvbigpKTtcbiAgICAgICAgICB0aGlzLnVwZGF0ZUJ1Y2tldEluZm8oKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5jdXJyZW50TGluZWFyQnVja2V0SW5kZXggPT0gMCkge1xuICAgICAgICAgIHByZXZCdXR0b24uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGxldCBuZXh0QnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgICBuZXh0QnV0dG9uLmlubmVyVGV4dCA9ICdOZXh0IEJ1Y2tldCc7XG4gICAgICBpZiAodGhpcy5jdXJyZW50TGluZWFyQnVja2V0SW5kZXggPT0gdGhpcy5idWNrZXRzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgbmV4dEJ1dHRvbi5kaXNhYmxlZCA9IHRydWU7XG4gICAgICB9XG4gICAgICBuZXh0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5jdXJyZW50TGluZWFyQnVja2V0SW5kZXggPCB0aGlzLmJ1Y2tldHMubGVuZ3RoIC0gMSkge1xuICAgICAgICAgIHRoaXMuY3VycmVudExpbmVhckJ1Y2tldEluZGV4Kys7XG4gICAgICAgICAgdGhpcy5jdXJyZW50TGluZWFyVGFyZ2V0SW5kZXggPSAwO1xuICAgICAgICAgIHRoaXMudHJ5TW92ZUJ1Y2tldChmYWxzZSk7XG4gICAgICAgICAgVUlDb250cm9sbGVyLlJlYWR5Rm9yTmV4dCh0aGlzLmJ1aWxkTmV3UXVlc3Rpb24oKSk7XG4gICAgICAgICAgdGhpcy51cGRhdGVCdWNrZXRJbmZvKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICAvLyBBcHBlbmQgdGhlIGJ1dHRvbnMgdG8gdGhlIGNvbnRhaW5lclxuICAgICAgbGV0IGJ1dHRvbnNDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGJ1dHRvbnNDb250YWluZXIuc3R5bGUuZGlzcGxheSA9ICdmbGV4JztcbiAgICAgIGJ1dHRvbnNDb250YWluZXIuc3R5bGUuZmxleERpcmVjdGlvbiA9ICdyb3cnO1xuICAgICAgYnV0dG9uc0NvbnRhaW5lci5zdHlsZS5qdXN0aWZ5Q29udGVudCA9ICdjZW50ZXInO1xuICAgICAgYnV0dG9uc0NvbnRhaW5lci5zdHlsZS5hbGlnbkl0ZW1zID0gJ2NlbnRlcic7XG4gICAgICBidXR0b25zQ29udGFpbmVyLmFwcGVuZENoaWxkKHByZXZCdXR0b24pO1xuICAgICAgYnV0dG9uc0NvbnRhaW5lci5hcHBlbmRDaGlsZChuZXh0QnV0dG9uKTtcblxuICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGJ1dHRvbnNDb250YWluZXIpO1xuICAgIH1cbiAgfTtcblxuICBwdWJsaWMgdXBkYXRlQnVja2V0SW5mbyA9ICgpID0+IHtcbiAgICBpZiAodGhpcy5jdXJyZW50QnVja2V0ICE9IG51bGwpIHtcbiAgICAgIHRoaXMuZGV2TW9kZUJ1Y2tldEluZm9Db250YWluZXIuaW5uZXJIVE1MID0gYEJ1Y2tldDogJHt0aGlzLmN1cnJlbnRCdWNrZXQuYnVja2V0SUR9PGJyLz5Db3JyZWN0OiAke3RoaXMuY3VycmVudEJ1Y2tldC5udW1Db3JyZWN0fTxici8+VHJpZWQ6ICR7dGhpcy5jdXJyZW50QnVja2V0Lm51bVRyaWVkfTxici8+RmFpbGVkOiAke3RoaXMuY3VycmVudEJ1Y2tldC5udW1Db25zZWN1dGl2ZVdyb25nfWA7XG4gICAgfVxuICB9O1xuXG4gIHB1YmxpYyBzdGFydEFzc2Vzc21lbnQgPSAoKSA9PiB7XG4gICAgVUlDb250cm9sbGVyLlJlYWR5Rm9yTmV4dCh0aGlzLmJ1aWxkTmV3UXVlc3Rpb24oKSk7XG4gICAgaWYgKHRoaXMuaXNJbkRldk1vZGUpIHtcbiAgICAgIHRoaXMuaGlkZURldk1vZGVCdXR0b24oKTtcbiAgICB9XG4gIH07XG5cbiAgcHVibGljIGJ1aWxkQnVja2V0cyA9IGFzeW5jIChidWNrZXRHZW5Nb2RlOiBCdWNrZXRHZW5Nb2RlKSA9PiB7XG4gICAgLy8gSWYgd2UgZG9uJ3QgaGF2ZSB0aGUgYnVja2V0cyBsb2FkZWQsIGxvYWQgdGhlbSBhbmQgaW5pdGlhbGl6ZSB0aGUgY3VycmVudCBub2RlLCB3aGljaCBpcyB0aGUgc3RhcnRpbmcgcG9pbnRcbiAgICBpZiAodGhpcy5idWNrZXRzID09PSB1bmRlZmluZWQgfHwgdGhpcy5idWNrZXRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgY29uc3QgcmVzID0gZmV0Y2hBc3Nlc3NtZW50QnVja2V0cyh0aGlzLmFwcC5HZXREYXRhVVJMKCkpLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgICB0aGlzLmJ1Y2tldHMgPSByZXN1bHQ7XG4gICAgICAgIHRoaXMubnVtQnVja2V0cyA9IHJlc3VsdC5sZW5ndGg7XG4gICAgICAgIGNvbnNvbGUubG9nKCdidWNrZXRzOiAnICsgdGhpcy5idWNrZXRzKTtcbiAgICAgICAgdGhpcy5idWNrZXRBcnJheSA9IEFycmF5LmZyb20oQXJyYXkodGhpcy5udW1CdWNrZXRzKSwgKF8sIGkpID0+IGkgKyAxKTtcbiAgICAgICAgY29uc29sZS5sb2coJ2VtcHR5IGFycmF5ICcgKyB0aGlzLmJ1Y2tldEFycmF5KTtcbiAgICAgICAgbGV0IHVzZWRJbmRpY2VzID0gbmV3IFNldDxudW1iZXI+KCk7XG4gICAgICAgIHVzZWRJbmRpY2VzLmFkZCgwKTtcbiAgICAgICAgbGV0IHJvb3RPZklEcyA9IHNvcnRlZEFycmF5VG9JRHNCU1QoXG4gICAgICAgICAgdGhpcy5idWNrZXRzWzBdLmJ1Y2tldElEIC0gMSxcbiAgICAgICAgICB0aGlzLmJ1Y2tldHNbdGhpcy5idWNrZXRzLmxlbmd0aCAtIDFdLmJ1Y2tldElELFxuICAgICAgICAgIHVzZWRJbmRpY2VzXG4gICAgICAgICk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiR2VuZXJhdGVkIHRoZSBidWNrZXRzIHJvb3QgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVwiKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2cocm9vdE9mSURzKTtcbiAgICAgICAgbGV0IGJ1Y2tldHNSb290ID0gdGhpcy5jb252ZXJ0VG9CdWNrZXRCU1Qocm9vdE9mSURzLCB0aGlzLmJ1Y2tldHMpO1xuICAgICAgICBjb25zb2xlLmxvZygnR2VuZXJhdGVkIHRoZSBidWNrZXRzIHJvb3QgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpO1xuICAgICAgICBjb25zb2xlLmxvZyhidWNrZXRzUm9vdCk7XG4gICAgICAgIHRoaXMuYmFzYWxCdWNrZXQgPSB0aGlzLm51bUJ1Y2tldHMgKyAxO1xuICAgICAgICB0aGlzLmNlaWxpbmdCdWNrZXQgPSAtMTtcbiAgICAgICAgdGhpcy5jdXJyZW50Tm9kZSA9IGJ1Y2tldHNSb290O1xuICAgICAgICB0aGlzLnRyeU1vdmVCdWNrZXQoZmFsc2UpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmVzO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoYnVja2V0R2VuTW9kZSA9PT0gQnVja2V0R2VuTW9kZS5SYW5kb21CU1QpIHtcbiAgICAgICAgLy8gSWYgd2UgaGF2ZSB0aGUgYnVja2V0cyBsb2FkZWQsIHdlIGNhbiBpbml0aWFsaXplIHRoZSBjdXJyZW50IG5vZGUsIHdoaWNoIGlzIHRoZSBzdGFydGluZyBwb2ludFxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8dm9pZD4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgIGxldCB1c2VkSW5kaWNlcyA9IG5ldyBTZXQ8bnVtYmVyPigpO1xuICAgICAgICAgIHVzZWRJbmRpY2VzLmFkZCgwKTtcbiAgICAgICAgICBsZXQgcm9vdE9mSURzID0gc29ydGVkQXJyYXlUb0lEc0JTVChcbiAgICAgICAgICAgIHRoaXMuYnVja2V0c1swXS5idWNrZXRJRCAtIDEsXG4gICAgICAgICAgICB0aGlzLmJ1Y2tldHNbdGhpcy5idWNrZXRzLmxlbmd0aCAtIDFdLmJ1Y2tldElELFxuICAgICAgICAgICAgdXNlZEluZGljZXNcbiAgICAgICAgICApO1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiR2VuZXJhdGVkIHRoZSBidWNrZXRzIHJvb3QgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVwiKTtcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyhyb290T2ZJRHMpO1xuICAgICAgICAgIGxldCBidWNrZXRzUm9vdCA9IHRoaXMuY29udmVydFRvQnVja2V0QlNUKHJvb3RPZklEcywgdGhpcy5idWNrZXRzKTtcbiAgICAgICAgICBjb25zb2xlLmxvZygnR2VuZXJhdGVkIHRoZSBidWNrZXRzIHJvb3QgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpO1xuICAgICAgICAgIGNvbnNvbGUubG9nKGJ1Y2tldHNSb290KTtcbiAgICAgICAgICB0aGlzLmJhc2FsQnVja2V0ID0gdGhpcy5udW1CdWNrZXRzICsgMTtcbiAgICAgICAgICB0aGlzLmNlaWxpbmdCdWNrZXQgPSAtMTtcbiAgICAgICAgICB0aGlzLmN1cnJlbnROb2RlID0gYnVja2V0c1Jvb3Q7XG4gICAgICAgICAgdGhpcy50cnlNb3ZlQnVja2V0KGZhbHNlKTtcbiAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIGlmIChidWNrZXRHZW5Nb2RlID09PSBCdWNrZXRHZW5Nb2RlLkxpbmVhckFycmF5QmFzZWQpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPHZvaWQ+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICB0aGlzLmN1cnJlbnRMaW5lYXJCdWNrZXRJbmRleCA9IDA7XG4gICAgICAgICAgdGhpcy5jdXJyZW50TGluZWFyVGFyZ2V0SW5kZXggPSAwO1xuICAgICAgICAgIHRoaXMudHJ5TW92ZUJ1Y2tldChmYWxzZSk7XG4gICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIENvbnZlcnRzIGEgYmluYXJ5IHNlYXJjaCB0cmVlIG9mIG51bWJlcnMgdG8gYSBiaW5hcnkgc2VhcmNoIHRyZWUgb2YgYnVja2V0IG9iamVjdHNcbiAgICogQHBhcmFtIG5vZGUgSXMgYSByb290IG5vZGUgb2YgYSBiaW5hcnkgc2VhcmNoIHRyZWVcbiAgICogQHBhcmFtIGJ1Y2tldHMgSXMgYW4gYXJyYXkgb2YgYnVja2V0IG9iamVjdHNcbiAgICogQHJldHVybnMgQSByb290IG5vZGUgb2YgYSBiaW5hcnkgc2VhcmNoIHRyZWUgd2hlcmUgdGhlIHZhbHVlIG9mIGVhY2ggbm9kZSBpcyBhIGJ1Y2tldCBvYmplY3RcbiAgICovXG4gIHB1YmxpYyBjb252ZXJ0VG9CdWNrZXRCU1QgPSAobm9kZTogVHJlZU5vZGUsIGJ1Y2tldHM6IGJ1Y2tldFtdKSA9PiB7XG4gICAgLy8gVHJhdmVyc2UgZWFjaCBlbGVtZW50IHRha2UgdGhlIHZhbHVlIGFuZCBmaW5kIHRoYXQgYnVja2V0IGluIHRoZSBidWNrZXRzIGFycmF5IGFuZCBhc3NpZ24gdGhhdCBidWNrZXQgaW5zdGVhZCBvZiB0aGUgbnVtYmVyIHZhbHVlXG4gICAgaWYgKG5vZGUgPT09IG51bGwpIHJldHVybiBub2RlO1xuXG4gICAgbGV0IGJ1Y2tldElkID0gbm9kZS52YWx1ZTtcbiAgICBub2RlLnZhbHVlID0gYnVja2V0cy5maW5kKChidWNrZXQpID0+IGJ1Y2tldC5idWNrZXRJRCA9PT0gYnVja2V0SWQpO1xuICAgIGlmIChub2RlLmxlZnQgIT09IG51bGwpIG5vZGUubGVmdCA9IHRoaXMuY29udmVydFRvQnVja2V0QlNUKG5vZGUubGVmdCwgYnVja2V0cyk7XG4gICAgaWYgKG5vZGUucmlnaHQgIT09IG51bGwpIG5vZGUucmlnaHQgPSB0aGlzLmNvbnZlcnRUb0J1Y2tldEJTVChub2RlLnJpZ2h0LCBidWNrZXRzKTtcblxuICAgIHJldHVybiBub2RlO1xuICB9O1xuXG4gIHB1YmxpYyBpbml0QnVja2V0ID0gKGJ1Y2tldDogYnVja2V0KSA9PiB7XG4gICAgdGhpcy5jdXJyZW50QnVja2V0ID0gYnVja2V0O1xuICAgIHRoaXMuY3VycmVudEJ1Y2tldC51c2VkSXRlbXMgPSBbXTtcbiAgICB0aGlzLmN1cnJlbnRCdWNrZXQubnVtVHJpZWQgPSAwO1xuICAgIHRoaXMuY3VycmVudEJ1Y2tldC5udW1Db3JyZWN0ID0gMDtcbiAgICB0aGlzLmN1cnJlbnRCdWNrZXQubnVtQ29uc2VjdXRpdmVXcm9uZyA9IDA7XG4gICAgdGhpcy5jdXJyZW50QnVja2V0LnRlc3RlZCA9IHRydWU7XG4gICAgdGhpcy5jdXJyZW50QnVja2V0LnBhc3NlZCA9IGZhbHNlO1xuICB9O1xuXG4gIHB1YmxpYyBoYW5kbGVBbnN3ZXJCdXR0b25QcmVzcyA9IChhbnN3ZXI6IG51bWJlciwgZWxhcHNlZDogbnVtYmVyKSA9PiB7XG4gICAgaWYgKHRoaXMuYnVja2V0R2VuTW9kZSA9PT0gQnVja2V0R2VuTW9kZS5SYW5kb21CU1QpIHtcbiAgICAgIEFuYWx5dGljc0V2ZW50cy5zZW5kQW5zd2VyZWQodGhpcy5jdXJyZW50UXVlc3Rpb24sIGFuc3dlciwgZWxhcHNlZCk7XG4gICAgfVxuICAgIHRoaXMudXBkYXRlQ3VycmVudEJ1Y2tldFZhbHVlc0FmdGVyQW5zd2VyaW5nKGFuc3dlcik7XG4gICAgdGhpcy51cGRhdGVGZWVkYmFja0FmdGVyQW5zd2VyKGFuc3dlcik7XG5cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKCdDb21wbGV0ZWQgZmlyc3QgVGltZW91dCcpO1xuICAgICAgdGhpcy5vblF1ZXN0aW9uRW5kKCk7XG4gICAgfSwgMjAwMCAqIHRoaXMuYW5pbWF0aW9uU3BlZWRNdWx0aXBsaWVyKTtcbiAgfTtcblxuICBwcml2YXRlIHVwZGF0ZUZlZWRiYWNrQWZ0ZXJBbnN3ZXIoYW5zd2VyOiBudW1iZXIpIHtcbiAgICBpZiAoXG4gICAgICB0aGlzLmJ1Y2tldEdlbk1vZGUgPT09IEJ1Y2tldEdlbk1vZGUuTGluZWFyQXJyYXlCYXNlZCAmJlxuICAgICAgVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkuc2hvd25TdGFyc0NvdW50IDwgdGhpcy5NQVhfU1RBUlNfQ09VTlRfSU5fTElORUFSX01PREVcbiAgICApIHtcbiAgICAgIFVJQ29udHJvbGxlci5BZGRTdGFyKCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmJ1Y2tldEdlbk1vZGUgPT09IEJ1Y2tldEdlbk1vZGUuUmFuZG9tQlNUKSB7XG4gICAgICBVSUNvbnRyb2xsZXIuQWRkU3RhcigpO1xuICAgIH1cbiAgICBVSUNvbnRyb2xsZXIuU2V0RmVlZGJhY2tWaXNpYmlsZShcbiAgICAgIHRydWUsXG4gICAgICB0aGlzLmN1cnJlbnRRdWVzdGlvbi5hbnN3ZXJzW2Fuc3dlciAtIDFdLmFuc3dlck5hbWUgPT0gdGhpcy5jdXJyZW50UXVlc3Rpb24uY29ycmVjdFxuICAgICk7XG4gIH1cbiAgcHJpdmF0ZSB1cGRhdGVDdXJyZW50QnVja2V0VmFsdWVzQWZ0ZXJBbnN3ZXJpbmcoYW5zd2VyOiBudW1iZXIpIHtcbiAgICB0aGlzLmN1cnJlbnRCdWNrZXQubnVtVHJpZWQgKz0gMTtcbiAgICBpZiAodGhpcy5jdXJyZW50UXVlc3Rpb24uYW5zd2Vyc1thbnN3ZXIgLSAxXS5hbnN3ZXJOYW1lID09IHRoaXMuY3VycmVudFF1ZXN0aW9uLmNvcnJlY3QpIHtcbiAgICAgIHRoaXMuY3VycmVudEJ1Y2tldC5udW1Db3JyZWN0ICs9IDE7XG4gICAgICB0aGlzLmN1cnJlbnRCdWNrZXQubnVtQ29uc2VjdXRpdmVXcm9uZyA9IDA7XG4gICAgICBjb25zb2xlLmxvZygnQW5zd2VyZWQgY29ycmVjdGx5Jyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY3VycmVudEJ1Y2tldC5udW1Db25zZWN1dGl2ZVdyb25nICs9IDE7XG4gICAgICBjb25zb2xlLmxvZygnQW5zd2VyZWQgaW5jb3JyZWN0bHksICcgKyB0aGlzLmN1cnJlbnRCdWNrZXQubnVtQ29uc2VjdXRpdmVXcm9uZyk7XG4gICAgfVxuICB9XG4gIHB1YmxpYyBvblF1ZXN0aW9uRW5kID0gKCkgPT4ge1xuICAgIGxldCBxdWVzdGlvbkVuZFRpbWVvdXQgPSB0aGlzLkhhc1F1ZXN0aW9uc0xlZnQoKVxuICAgICAgPyA1MDAgKiB0aGlzLmFuaW1hdGlvblNwZWVkTXVsdGlwbGllclxuICAgICAgOiA0MDAwICogdGhpcy5hbmltYXRpb25TcGVlZE11bHRpcGxpZXI7XG5cbiAgICBjb25zdCBlbmRPcGVyYXRpb25zID0gKCkgPT4ge1xuICAgICAgVUlDb250cm9sbGVyLlNldEZlZWRiYWNrVmlzaWJpbGUoZmFsc2UsIGZhbHNlKTtcbiAgICAgIGlmIChcbiAgICAgICAgdGhpcy5idWNrZXRHZW5Nb2RlID09PSBCdWNrZXRHZW5Nb2RlLkxpbmVhckFycmF5QmFzZWQgJiZcbiAgICAgICAgVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkuc2hvd25TdGFyc0NvdW50IDwgdGhpcy5NQVhfU1RBUlNfQ09VTlRfSU5fTElORUFSX01PREVcbiAgICAgICkge1xuICAgICAgICBVSUNvbnRyb2xsZXIuQ2hhbmdlU3RhckltYWdlQWZ0ZXJBbmltYXRpb24oKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5idWNrZXRHZW5Nb2RlID09PSBCdWNrZXRHZW5Nb2RlLlJhbmRvbUJTVCkge1xuICAgICAgICBVSUNvbnRyb2xsZXIuQ2hhbmdlU3RhckltYWdlQWZ0ZXJBbmltYXRpb24oKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLkhhc1F1ZXN0aW9uc0xlZnQoKSkge1xuICAgICAgICBpZiAodGhpcy5idWNrZXRHZW5Nb2RlID09PSBCdWNrZXRHZW5Nb2RlLkxpbmVhckFycmF5QmFzZWQgJiYgIXRoaXMuaXNCdWNrZXRDb250cm9sc0VuYWJsZWQpIHtcbiAgICAgICAgICBpZiAodGhpcy5jdXJyZW50TGluZWFyVGFyZ2V0SW5kZXggPCB0aGlzLmJ1Y2tldHNbdGhpcy5jdXJyZW50TGluZWFyQnVja2V0SW5kZXhdLml0ZW1zLmxlbmd0aCkge1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50TGluZWFyVGFyZ2V0SW5kZXgrKztcbiAgICAgICAgICAgIC8vIFdlIG5lZWQgdG8gcmVzZXQgdGhlIHVzZWQgaXRlbXMgYXJyYXkgd2hlbiB3ZSBtb3ZlIHRvIHRoZSBuZXh0IHF1ZXN0aW9uIGluIGxpbmVhciBtb2RlXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRCdWNrZXQudXNlZEl0ZW1zID0gW107XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgdGhpcy5jdXJyZW50TGluZWFyVGFyZ2V0SW5kZXggPj0gdGhpcy5idWNrZXRzW3RoaXMuY3VycmVudExpbmVhckJ1Y2tldEluZGV4XS5pdGVtcy5sZW5ndGggJiZcbiAgICAgICAgICAgIHRoaXMuY3VycmVudExpbmVhckJ1Y2tldEluZGV4IDwgdGhpcy5idWNrZXRzLmxlbmd0aFxuICAgICAgICAgICkge1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50TGluZWFyQnVja2V0SW5kZXgrKztcbiAgICAgICAgICAgIHRoaXMuY3VycmVudExpbmVhclRhcmdldEluZGV4ID0gMDtcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRMaW5lYXJCdWNrZXRJbmRleCA8IHRoaXMuYnVja2V0cy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgdGhpcy50cnlNb3ZlQnVja2V0KGZhbHNlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdObyBxdWVzdGlvbnMgbGVmdCcpO1xuICAgICAgICAgICAgICB0aGlzLm9uRW5kKCk7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBVSUNvbnRyb2xsZXIuUmVhZHlGb3JOZXh0KHRoaXMuYnVpbGROZXdRdWVzdGlvbigpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdObyBxdWVzdGlvbnMgbGVmdCcpO1xuICAgICAgICB0aGlzLm9uRW5kKCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIC8vIENyZWF0ZSBhIHByb21pc2UgdGhhdCByZXNvbHZlcyBhZnRlciB0aGUgc3BlY2lmaWVkIHRpbWVvdXRcbiAgICBjb25zdCB0aW1lb3V0UHJvbWlzZSA9IG5ldyBQcm9taXNlPHZvaWQ+KChyZXNvbHZlKSA9PiB7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgfSwgcXVlc3Rpb25FbmRUaW1lb3V0KTtcbiAgICB9KTtcblxuICAgIC8vIEV4ZWN1dGUgZW5kT3BlcmF0aW9ucyBhZnRlciB0aW1lb3V0UHJvbWlzZSByZXNvbHZlc1xuICAgIHRpbWVvdXRQcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgZW5kT3BlcmF0aW9ucygpO1xuXG4gICAgICAvLyBDb21wbGV0ZWQgZW5kIG9wZXJhdGlvbnMsIHNob3VsZCB1cGRhdGUgYnVja2V0IGluZm8gaWYgaW4gZGV2IG1vZGVcbiAgICAgIGlmICh0aGlzLmlzSW5EZXZNb2RlKSB7XG4gICAgICAgIHRoaXMudXBkYXRlQnVja2V0SW5mbygpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuICBwdWJsaWMgYnVpbGROZXdRdWVzdGlvbiA9ICgpID0+IHtcbiAgICBpZiAodGhpcy5pc0xpbmVhckFycmF5RXhoYXVzdGVkKCkpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IHRhcmdldEl0ZW0gPSB0aGlzLnNlbGVjdFRhcmdldEl0ZW0oKTtcbiAgICBjb25zdCBmb2lscyA9IHRoaXMuZ2VuZXJhdGVGb2lscyh0YXJnZXRJdGVtKTtcbiAgICBjb25zdCBhbnN3ZXJPcHRpb25zID0gdGhpcy5zaHVmZmxlQW5zd2VyT3B0aW9ucyhbdGFyZ2V0SXRlbSwgLi4uZm9pbHNdKTtcblxuICAgIGNvbnN0IG5ld1F1ZXN0aW9uID0gdGhpcy5jcmVhdGVRdWVzdGlvbih0YXJnZXRJdGVtLCBhbnN3ZXJPcHRpb25zKTtcbiAgICB0aGlzLmN1cnJlbnRRdWVzdGlvbiA9IG5ld1F1ZXN0aW9uO1xuICAgIHRoaXMucXVlc3Rpb25OdW1iZXIgKz0gMTtcblxuICAgIHJldHVybiBuZXdRdWVzdGlvbjtcbiAgfTtcblxuICBwcml2YXRlIGlzTGluZWFyQXJyYXlFeGhhdXN0ZWQgPSAoKTogYm9vbGVhbiA9PiB7XG4gICAgcmV0dXJuIChcbiAgICAgIHRoaXMuYnVja2V0R2VuTW9kZSA9PT0gQnVja2V0R2VuTW9kZS5MaW5lYXJBcnJheUJhc2VkICYmXG4gICAgICB0aGlzLmN1cnJlbnRMaW5lYXJUYXJnZXRJbmRleCA+PSB0aGlzLmJ1Y2tldHNbdGhpcy5jdXJyZW50TGluZWFyQnVja2V0SW5kZXhdLml0ZW1zLmxlbmd0aFxuICAgICk7XG4gIH07XG5cbiAgcHJpdmF0ZSBzZWxlY3RUYXJnZXRJdGVtID0gKCk6IGFueSA9PiB7XG4gICAgbGV0IHRhcmdldEl0ZW07XG5cbiAgICBpZiAodGhpcy5idWNrZXRHZW5Nb2RlID09PSBCdWNrZXRHZW5Nb2RlLlJhbmRvbUJTVCkge1xuICAgICAgdGFyZ2V0SXRlbSA9IHRoaXMuc2VsZWN0UmFuZG9tVW51c2VkSXRlbSgpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5idWNrZXRHZW5Nb2RlID09PSBCdWNrZXRHZW5Nb2RlLkxpbmVhckFycmF5QmFzZWQpIHtcbiAgICAgIHRhcmdldEl0ZW0gPSB0aGlzLmJ1Y2tldHNbdGhpcy5jdXJyZW50TGluZWFyQnVja2V0SW5kZXhdLml0ZW1zW3RoaXMuY3VycmVudExpbmVhclRhcmdldEluZGV4XTtcbiAgICAgIHRoaXMuY3VycmVudEJ1Y2tldC51c2VkSXRlbXMucHVzaCh0YXJnZXRJdGVtKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGFyZ2V0SXRlbTtcbiAgfTtcblxuICBwcml2YXRlIHNlbGVjdFJhbmRvbVVudXNlZEl0ZW0gPSAoKTogYW55ID0+IHtcbiAgICBsZXQgaXRlbTtcbiAgICBkbyB7XG4gICAgICBpdGVtID0gcmFuZEZyb20odGhpcy5jdXJyZW50QnVja2V0Lml0ZW1zKTtcbiAgICB9IHdoaWxlICh0aGlzLmN1cnJlbnRCdWNrZXQudXNlZEl0ZW1zLmluY2x1ZGVzKGl0ZW0pKTtcblxuICAgIHRoaXMuY3VycmVudEJ1Y2tldC51c2VkSXRlbXMucHVzaChpdGVtKTtcbiAgICByZXR1cm4gaXRlbTtcbiAgfTtcblxuICBwcml2YXRlIGdlbmVyYXRlRm9pbHMgPSAodGFyZ2V0SXRlbTogYW55KTogYW55W10gPT4ge1xuICAgIGxldCBmb2lsMSwgZm9pbDIsIGZvaWwzO1xuXG4gICAgaWYgKHRoaXMuYnVja2V0R2VuTW9kZSA9PT0gQnVja2V0R2VuTW9kZS5SYW5kb21CU1QpIHtcbiAgICAgIGZvaWwxID0gdGhpcy5nZW5lcmF0ZVJhbmRvbUZvaWwodGFyZ2V0SXRlbSk7XG4gICAgICBmb2lsMiA9IHRoaXMuZ2VuZXJhdGVSYW5kb21Gb2lsKHRhcmdldEl0ZW0sIGZvaWwxKTtcbiAgICAgIGZvaWwzID0gdGhpcy5nZW5lcmF0ZVJhbmRvbUZvaWwodGFyZ2V0SXRlbSwgZm9pbDEsIGZvaWwyKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuYnVja2V0R2VuTW9kZSA9PT0gQnVja2V0R2VuTW9kZS5MaW5lYXJBcnJheUJhc2VkKSB7XG4gICAgICBmb2lsMSA9IHRoaXMuZ2VuZXJhdGVMaW5lYXJGb2lsKHRhcmdldEl0ZW0pO1xuICAgICAgZm9pbDIgPSB0aGlzLmdlbmVyYXRlTGluZWFyRm9pbCh0YXJnZXRJdGVtLCBmb2lsMSk7XG4gICAgICBmb2lsMyA9IHRoaXMuZ2VuZXJhdGVMaW5lYXJGb2lsKHRhcmdldEl0ZW0sIGZvaWwxLCBmb2lsMik7XG4gICAgfVxuXG4gICAgcmV0dXJuIFtmb2lsMSwgZm9pbDIsIGZvaWwzXTtcbiAgfTtcblxuICBwcml2YXRlIGdlbmVyYXRlUmFuZG9tRm9pbCA9ICh0YXJnZXRJdGVtOiBhbnksIC4uLmV4aXN0aW5nRm9pbHM6IGFueVtdKTogYW55ID0+IHtcbiAgICBsZXQgZm9pbDtcbiAgICBkbyB7XG4gICAgICBmb2lsID0gcmFuZEZyb20odGhpcy5jdXJyZW50QnVja2V0Lml0ZW1zKTtcbiAgICB9IHdoaWxlIChbdGFyZ2V0SXRlbSwgLi4uZXhpc3RpbmdGb2lsc10uaW5jbHVkZXMoZm9pbCkpO1xuICAgIHJldHVybiBmb2lsO1xuICB9O1xuXG4gIHByaXZhdGUgZ2VuZXJhdGVMaW5lYXJGb2lsID0gKHRhcmdldEl0ZW06IGFueSwgLi4uZXhpc3RpbmdGb2lsczogYW55W10pOiBhbnkgPT4ge1xuICAgIGxldCBmb2lsO1xuICAgIGRvIHtcbiAgICAgIGZvaWwgPSByYW5kRnJvbSh0aGlzLmJ1Y2tldHNbdGhpcy5jdXJyZW50TGluZWFyQnVja2V0SW5kZXhdLml0ZW1zKTtcbiAgICB9IHdoaWxlIChbdGFyZ2V0SXRlbSwgLi4uZXhpc3RpbmdGb2lsc10uaW5jbHVkZXMoZm9pbCkpO1xuICAgIHJldHVybiBmb2lsO1xuICB9O1xuXG4gIHByaXZhdGUgc2h1ZmZsZUFuc3dlck9wdGlvbnMgPSAob3B0aW9uczogYW55W10pOiBhbnlbXSA9PiB7XG4gICAgc2h1ZmZsZUFycmF5KG9wdGlvbnMpO1xuICAgIHJldHVybiBvcHRpb25zO1xuICB9O1xuXG4gIHByaXZhdGUgY3JlYXRlUXVlc3Rpb24gPSAodGFyZ2V0SXRlbTogYW55LCBhbnN3ZXJPcHRpb25zOiBhbnlbXSk6IGFueSA9PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHFOYW1lOiBgcXVlc3Rpb24tJHt0aGlzLnF1ZXN0aW9uTnVtYmVyfS0ke3RhcmdldEl0ZW0uaXRlbU5hbWV9YCxcbiAgICAgIHFOdW1iZXI6IHRoaXMucXVlc3Rpb25OdW1iZXIsXG4gICAgICBxVGFyZ2V0OiB0YXJnZXRJdGVtLml0ZW1OYW1lLFxuICAgICAgcHJvbXB0VGV4dDogJycsXG4gICAgICBidWNrZXQ6IHRoaXMuY3VycmVudEJ1Y2tldC5idWNrZXRJRCxcbiAgICAgIHByb21wdEF1ZGlvOiB0YXJnZXRJdGVtLml0ZW1OYW1lLFxuICAgICAgY29ycmVjdDogdGFyZ2V0SXRlbS5pdGVtVGV4dCxcbiAgICAgIGFuc3dlcnM6IGFuc3dlck9wdGlvbnMubWFwKChvcHRpb24pID0+ICh7XG4gICAgICAgIGFuc3dlck5hbWU6IG9wdGlvbi5pdGVtTmFtZSxcbiAgICAgICAgYW5zd2VyVGV4dDogb3B0aW9uLml0ZW1UZXh0LFxuICAgICAgfSkpLFxuICAgIH07XG4gIH07XG5cbiAgcHVibGljIHRyeU1vdmVCdWNrZXQgPSAocGFzc2VkOiBib29sZWFuKSA9PiB7XG4gICAgaWYgKHRoaXMuYnVja2V0R2VuTW9kZSA9PT0gQnVja2V0R2VuTW9kZS5SYW5kb21CU1QpIHtcbiAgICAgIHRoaXMudHJ5TW92ZUJ1Y2tldFJhbmRvbUJTVChwYXNzZWQpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5idWNrZXRHZW5Nb2RlID09PSBCdWNrZXRHZW5Nb2RlLkxpbmVhckFycmF5QmFzZWQpIHtcbiAgICAgIHRoaXMudHJ5TW92ZUJ1Y2tldExpbmVhckFycmF5QmFzZWQocGFzc2VkKTtcbiAgICB9XG4gIH07XG5cbiAgcHVibGljIHRyeU1vdmVCdWNrZXRSYW5kb21CU1QgPSAocGFzc2VkOiBib29sZWFuKSA9PiB7XG4gICAgY29uc3QgbmV3QnVja2V0ID0gdGhpcy5jdXJyZW50Tm9kZS52YWx1ZSBhcyBidWNrZXQ7XG4gICAgaWYgKHRoaXMuY3VycmVudEJ1Y2tldCAhPSBudWxsKSB7XG4gICAgICB0aGlzLmN1cnJlbnRCdWNrZXQucGFzc2VkID0gcGFzc2VkO1xuICAgICAgQW5hbHl0aWNzRXZlbnRzLnNlbmRCdWNrZXQodGhpcy5jdXJyZW50QnVja2V0LCBwYXNzZWQpO1xuICAgIH1cbiAgICBjb25zb2xlLmxvZygnbmV3ICBidWNrZXQgaXMgJyArIG5ld0J1Y2tldC5idWNrZXRJRCk7XG4gICAgQXVkaW9Db250cm9sbGVyLlByZWxvYWRCdWNrZXQobmV3QnVja2V0LCB0aGlzLmFwcC5HZXREYXRhVVJMKCkpO1xuICAgIHRoaXMuaW5pdEJ1Y2tldChuZXdCdWNrZXQpO1xuICB9O1xuXG4gIHB1YmxpYyB0cnlNb3ZlQnVja2V0TGluZWFyQXJyYXlCYXNlZCA9IChwYXNzZWQ6IGJvb2xlYW4pID0+IHtcbiAgICBjb25zdCBuZXdCdWNrZXQgPSB0aGlzLmJ1Y2tldHNbdGhpcy5jdXJyZW50TGluZWFyQnVja2V0SW5kZXhdO1xuICAgIC8vIEF2b2lkIHBhc3NpbmcgYnVja2V0UGFzc2VkIGV2ZW50IHRvIHRoZSBhbmFseXRpY3Mgd2hlbiB3ZSBhcmUgaW4gbGluZWFyIGRldiBtb2RlXG4gICAgLy8gaWYgKHRoaXMuY3VycmVudEJ1Y2tldCAhPSBudWxsKSB7XG4gICAgLy8gXHR0aGlzLmN1cnJlbnRCdWNrZXQucGFzc2VkID0gcGFzc2VkO1xuICAgIC8vIFx0QW5hbHl0aWNzRXZlbnRzLnNlbmRCdWNrZXQodGhpcy5jdXJyZW50QnVja2V0LCBwYXNzZWQpO1xuICAgIC8vIH1cbiAgICBjb25zb2xlLmxvZygnTmV3IEJ1Y2tldDogJyArIG5ld0J1Y2tldC5idWNrZXRJRCk7XG4gICAgQXVkaW9Db250cm9sbGVyLlByZWxvYWRCdWNrZXQobmV3QnVja2V0LCB0aGlzLmFwcC5HZXREYXRhVVJMKCkpO1xuICAgIHRoaXMuaW5pdEJ1Y2tldChuZXdCdWNrZXQpO1xuICB9O1xuXG4gIHB1YmxpYyBIYXNRdWVzdGlvbnNMZWZ0ID0gKCkgPT4ge1xuICAgIGlmICh0aGlzLmN1cnJlbnRCdWNrZXQucGFzc2VkKSByZXR1cm4gZmFsc2U7XG5cbiAgICBpZiAodGhpcy5idWNrZXRHZW5Nb2RlID09PSBCdWNrZXRHZW5Nb2RlLkxpbmVhckFycmF5QmFzZWQpIHtcbiAgICAgIHJldHVybiB0aGlzLmhhc0xpbmVhclF1ZXN0aW9uc0xlZnQoKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5jdXJyZW50QnVja2V0Lm51bUNvcnJlY3QgPj0gNCkge1xuICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlUGFzc2VkQnVja2V0KCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmN1cnJlbnRCdWNrZXQubnVtQ29uc2VjdXRpdmVXcm9uZyA+PSAyIHx8IHRoaXMuY3VycmVudEJ1Y2tldC5udW1UcmllZCA+PSA1KSB7XG4gICAgICByZXR1cm4gdGhpcy5oYW5kbGVGYWlsZWRCdWNrZXQoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuICBwcml2YXRlIGhhc0xpbmVhclF1ZXN0aW9uc0xlZnQgPSAoKTogYm9vbGVhbiA9PiB7XG4gICAgaWYgKFxuICAgICAgdGhpcy5jdXJyZW50TGluZWFyQnVja2V0SW5kZXggPj0gdGhpcy5idWNrZXRzLmxlbmd0aCAmJlxuICAgICAgdGhpcy5jdXJyZW50TGluZWFyVGFyZ2V0SW5kZXggPj0gdGhpcy5idWNrZXRzW3RoaXMuY3VycmVudExpbmVhckJ1Y2tldEluZGV4XS5pdGVtcy5sZW5ndGhcbiAgICApIHtcbiAgICAgIC8vIE5vIG1vcmUgcXVlc3Rpb25zIGxlZnRcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9O1xuXG4gIHByaXZhdGUgaGFuZGxlUGFzc2VkQnVja2V0ID0gKCk6IGJvb2xlYW4gPT4ge1xuICAgIGNvbnNvbGUubG9nKCdQYXNzZWQgdGhpcyBidWNrZXQgJyArIHRoaXMuY3VycmVudEJ1Y2tldC5idWNrZXRJRCk7XG5cbiAgICBpZiAodGhpcy5jdXJyZW50QnVja2V0LmJ1Y2tldElEID49IHRoaXMubnVtQnVja2V0cykge1xuICAgICAgLy8gUGFzc2VkIHRoZSBoaWdoZXN0IGJ1Y2tldFxuICAgICAgcmV0dXJuIHRoaXMucGFzc0hpZ2hlc3RCdWNrZXQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMubW92ZVVwVG9OZXh0QnVja2V0KCk7XG4gICAgfVxuICB9O1xuXG4gIHByaXZhdGUgaGFuZGxlRmFpbGVkQnVja2V0ID0gKCk6IGJvb2xlYW4gPT4ge1xuICAgIGNvbnNvbGUubG9nKCdGYWlsZWQgdGhpcyBidWNrZXQgJyArIHRoaXMuY3VycmVudEJ1Y2tldC5idWNrZXRJRCk7XG5cbiAgICBpZiAodGhpcy5jdXJyZW50QnVja2V0LmJ1Y2tldElEIDwgdGhpcy5iYXNhbEJ1Y2tldCkge1xuICAgICAgdGhpcy5iYXNhbEJ1Y2tldCA9IHRoaXMuY3VycmVudEJ1Y2tldC5idWNrZXRJRDtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5jdXJyZW50QnVja2V0LmJ1Y2tldElEIDw9IDEpIHtcbiAgICAgIC8vIEZhaWxlZCB0aGUgbG93ZXN0IGJ1Y2tldFxuICAgICAgcmV0dXJuIHRoaXMuZmFpbExvd2VzdEJ1Y2tldCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5tb3ZlRG93blRvUHJldmlvdXNCdWNrZXQoKTtcbiAgICB9XG4gIH07XG5cbiAgcHJpdmF0ZSBwYXNzSGlnaGVzdEJ1Y2tldCA9ICgpOiBib29sZWFuID0+IHtcbiAgICBjb25zb2xlLmxvZygnUGFzc2VkIGhpZ2hlc3QgYnVja2V0Jyk7XG4gICAgdGhpcy5jdXJyZW50QnVja2V0LnBhc3NlZCA9IHRydWU7XG5cbiAgICBpZiAodGhpcy5idWNrZXRHZW5Nb2RlID09PSBCdWNrZXRHZW5Nb2RlLlJhbmRvbUJTVCkge1xuICAgICAgQW5hbHl0aWNzRXZlbnRzLnNlbmRCdWNrZXQodGhpcy5jdXJyZW50QnVja2V0LCB0cnVlKTtcbiAgICB9XG5cbiAgICBVSUNvbnRyb2xsZXIuUHJvZ3Jlc3NDaGVzdCgpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICBwcml2YXRlIG1vdmVVcFRvTmV4dEJ1Y2tldCA9ICgpOiBib29sZWFuID0+IHtcbiAgICBpZiAodGhpcy5jdXJyZW50Tm9kZS5yaWdodCAhPSBudWxsKSB7XG4gICAgICAvLyBNb3ZlIGRvd24gdG8gdGhlIHJpZ2h0XG4gICAgICBjb25zb2xlLmxvZygnTW92aW5nIHRvIHJpZ2h0IG5vZGUnKTtcbiAgICAgIGlmICh0aGlzLmJ1Y2tldEdlbk1vZGUgPT09IEJ1Y2tldEdlbk1vZGUuUmFuZG9tQlNUKSB7XG4gICAgICAgIHRoaXMuY3VycmVudE5vZGUgPSB0aGlzLmN1cnJlbnROb2RlLnJpZ2h0O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5jdXJyZW50TGluZWFyQnVja2V0SW5kZXgrKztcbiAgICAgIH1cbiAgICAgIHRoaXMudHJ5TW92ZUJ1Y2tldCh0cnVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gUmVhY2hlZCByb290IG5vZGVcbiAgICAgIGNvbnNvbGUubG9nKCdSZWFjaGVkIHJvb3Qgbm9kZScpO1xuICAgICAgdGhpcy5jdXJyZW50QnVja2V0LnBhc3NlZCA9IHRydWU7XG5cbiAgICAgIGlmICh0aGlzLmJ1Y2tldEdlbk1vZGUgPT09IEJ1Y2tldEdlbk1vZGUuUmFuZG9tQlNUKSB7XG4gICAgICAgIEFuYWx5dGljc0V2ZW50cy5zZW5kQnVja2V0KHRoaXMuY3VycmVudEJ1Y2tldCwgdHJ1ZSk7XG4gICAgICB9XG5cbiAgICAgIFVJQ29udHJvbGxlci5Qcm9ncmVzc0NoZXN0KCk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgcHJpdmF0ZSBmYWlsTG93ZXN0QnVja2V0ID0gKCk6IGJvb2xlYW4gPT4ge1xuICAgIGNvbnNvbGUubG9nKCdGYWlsZWQgbG93ZXN0IGJ1Y2tldCAhJyk7XG4gICAgdGhpcy5jdXJyZW50QnVja2V0LnBhc3NlZCA9IGZhbHNlO1xuXG4gICAgaWYgKHRoaXMuYnVja2V0R2VuTW9kZSA9PT0gQnVja2V0R2VuTW9kZS5SYW5kb21CU1QpIHtcbiAgICAgIEFuYWx5dGljc0V2ZW50cy5zZW5kQnVja2V0KHRoaXMuY3VycmVudEJ1Y2tldCwgZmFsc2UpO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICBwcml2YXRlIG1vdmVEb3duVG9QcmV2aW91c0J1Y2tldCA9ICgpOiBib29sZWFuID0+IHtcbiAgICBjb25zb2xlLmxvZygnTW92aW5nIGRvd24gYnVja2V0ICEnKTtcblxuICAgIGlmICh0aGlzLmN1cnJlbnROb2RlLmxlZnQgIT0gbnVsbCkge1xuICAgICAgLy8gTW92ZSBkb3duIHRvIHRoZSBsZWZ0XG4gICAgICBjb25zb2xlLmxvZygnTW92aW5nIHRvIGxlZnQgbm9kZScpO1xuICAgICAgaWYgKHRoaXMuYnVja2V0R2VuTW9kZSA9PT0gQnVja2V0R2VuTW9kZS5SYW5kb21CU1QpIHtcbiAgICAgICAgdGhpcy5jdXJyZW50Tm9kZSA9IHRoaXMuY3VycmVudE5vZGUubGVmdDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuY3VycmVudExpbmVhckJ1Y2tldEluZGV4Kys7XG4gICAgICB9XG4gICAgICB0aGlzLnRyeU1vdmVCdWNrZXQoZmFsc2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBSZWFjaGVkIHJvb3Qgbm9kZVxuICAgICAgY29uc29sZS5sb2coJ1JlYWNoZWQgcm9vdCBub2RlICEnKTtcbiAgICAgIHRoaXMuY3VycmVudEJ1Y2tldC5wYXNzZWQgPSBmYWxzZTtcblxuICAgICAgaWYgKHRoaXMuYnVja2V0R2VuTW9kZSA9PT0gQnVja2V0R2VuTW9kZS5SYW5kb21CU1QpIHtcbiAgICAgICAgQW5hbHl0aWNzRXZlbnRzLnNlbmRCdWNrZXQodGhpcy5jdXJyZW50QnVja2V0LCBmYWxzZSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuICBwdWJsaWMgb3ZlcnJpZGUgb25FbmQoKTogdm9pZCB7XG4gICAgQW5hbHl0aWNzRXZlbnRzLnNlbmRGaW5pc2hlZCh0aGlzLmJ1Y2tldHMsIHRoaXMuYmFzYWxCdWNrZXQsIHRoaXMuY2VpbGluZ0J1Y2tldCk7XG4gICAgVUlDb250cm9sbGVyLlNob3dFbmQoKTtcbiAgICB0aGlzLmFwcC51bml0eUJyaWRnZS5TZW5kQ2xvc2UoKTtcbiAgfVxufVxuIiwiLyoqXG4gKiBNb2R1bGUgdGhhdCB3cmFwcyBVbml0eSBjYWxscyBmb3Igc2VuZGluZyBtZXNzYWdlcyBmcm9tIHRoZSB3ZWJ2aWV3IHRvIFVuaXR5LlxuICovXG5cbmRlY2xhcmUgY29uc3QgVW5pdHk7XG5cbmV4cG9ydCBjbGFzcyBVbml0eUJyaWRnZSB7XG4gIHByaXZhdGUgdW5pdHlSZWZlcmVuY2U7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgaWYgKHR5cGVvZiBVbml0eSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHRoaXMudW5pdHlSZWZlcmVuY2UgPSBVbml0eTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy51bml0eVJlZmVyZW5jZSA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIFNlbmRNZXNzYWdlKG1lc3NhZ2U6IHN0cmluZykge1xuICAgIGlmICh0aGlzLnVuaXR5UmVmZXJlbmNlICE9PSBudWxsKSB7XG4gICAgICB0aGlzLnVuaXR5UmVmZXJlbmNlLmNhbGwobWVzc2FnZSk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIFNlbmRMb2FkZWQoKSB7XG4gICAgaWYgKHRoaXMudW5pdHlSZWZlcmVuY2UgIT09IG51bGwpIHtcbiAgICAgIHRoaXMudW5pdHlSZWZlcmVuY2UuY2FsbCgnbG9hZGVkJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKCd3b3VsZCBjYWxsIFVuaXR5IGxvYWRlZCBub3cnKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgU2VuZENsb3NlKCkge1xuICAgIGlmICh0aGlzLnVuaXR5UmVmZXJlbmNlICE9PSBudWxsKSB7XG4gICAgICB0aGlzLnVuaXR5UmVmZXJlbmNlLmNhbGwoJ2Nsb3NlJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKCd3b3VsZCBjbG9zZSBVbml0eSBub3cnKTtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCB7IHJlZ2lzdGVyVmVyc2lvbiB9IGZyb20gJ0BmaXJlYmFzZS9hcHAnO1xuZXhwb3J0ICogZnJvbSAnQGZpcmViYXNlL2FwcCc7XG5cbnZhciBuYW1lID0gXCJmaXJlYmFzZVwiO1xudmFyIHZlcnNpb24gPSBcIjkuMTIuMVwiO1xuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5yZWdpc3RlclZlcnNpb24obmFtZSwgdmVyc2lvbiwgJ2FwcCcpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguZXNtLmpzLm1hcFxuIiwidHJ5e3NlbGZbXCJ3b3JrYm94OndpbmRvdzo3LjAuMFwiXSYmXygpfWNhdGNoKG4pe31mdW5jdGlvbiBuKG4sdCl7cmV0dXJuIG5ldyBQcm9taXNlKChmdW5jdGlvbihyKXt2YXIgZT1uZXcgTWVzc2FnZUNoYW5uZWw7ZS5wb3J0MS5vbm1lc3NhZ2U9ZnVuY3Rpb24obil7cihuLmRhdGEpfSxuLnBvc3RNZXNzYWdlKHQsW2UucG9ydDJdKX0pKX1mdW5jdGlvbiB0KG4sdCl7Zm9yKHZhciByPTA7cjx0Lmxlbmd0aDtyKyspe3ZhciBlPXRbcl07ZS5lbnVtZXJhYmxlPWUuZW51bWVyYWJsZXx8ITEsZS5jb25maWd1cmFibGU9ITAsXCJ2YWx1ZVwiaW4gZSYmKGUud3JpdGFibGU9ITApLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLGUua2V5LGUpfX1mdW5jdGlvbiByKG4sdCl7KG51bGw9PXR8fHQ+bi5sZW5ndGgpJiYodD1uLmxlbmd0aCk7Zm9yKHZhciByPTAsZT1uZXcgQXJyYXkodCk7cjx0O3IrKyllW3JdPW5bcl07cmV0dXJuIGV9ZnVuY3Rpb24gZShuLHQpe3ZhciBlO2lmKFwidW5kZWZpbmVkXCI9PXR5cGVvZiBTeW1ib2x8fG51bGw9PW5bU3ltYm9sLml0ZXJhdG9yXSl7aWYoQXJyYXkuaXNBcnJheShuKXx8KGU9ZnVuY3Rpb24obix0KXtpZihuKXtpZihcInN0cmluZ1wiPT10eXBlb2YgbilyZXR1cm4gcihuLHQpO3ZhciBlPU9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChuKS5zbGljZSg4LC0xKTtyZXR1cm5cIk9iamVjdFwiPT09ZSYmbi5jb25zdHJ1Y3RvciYmKGU9bi5jb25zdHJ1Y3Rvci5uYW1lKSxcIk1hcFwiPT09ZXx8XCJTZXRcIj09PWU/QXJyYXkuZnJvbShuKTpcIkFyZ3VtZW50c1wiPT09ZXx8L14oPzpVaXxJKW50KD86OHwxNnwzMikoPzpDbGFtcGVkKT9BcnJheSQvLnRlc3QoZSk/cihuLHQpOnZvaWQgMH19KG4pKXx8dCYmbiYmXCJudW1iZXJcIj09dHlwZW9mIG4ubGVuZ3RoKXtlJiYobj1lKTt2YXIgaT0wO3JldHVybiBmdW5jdGlvbigpe3JldHVybiBpPj1uLmxlbmd0aD97ZG9uZTohMH06e2RvbmU6ITEsdmFsdWU6bltpKytdfX19dGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgYXR0ZW1wdCB0byBpdGVyYXRlIG5vbi1pdGVyYWJsZSBpbnN0YW5jZS5cXG5JbiBvcmRlciB0byBiZSBpdGVyYWJsZSwgbm9uLWFycmF5IG9iamVjdHMgbXVzdCBoYXZlIGEgW1N5bWJvbC5pdGVyYXRvcl0oKSBtZXRob2QuXCIpfXJldHVybihlPW5bU3ltYm9sLml0ZXJhdG9yXSgpKS5uZXh0LmJpbmQoZSl9dHJ5e3NlbGZbXCJ3b3JrYm94OmNvcmU6Ny4wLjBcIl0mJl8oKX1jYXRjaChuKXt9dmFyIGk9ZnVuY3Rpb24oKXt2YXIgbj10aGlzO3RoaXMucHJvbWlzZT1uZXcgUHJvbWlzZSgoZnVuY3Rpb24odCxyKXtuLnJlc29sdmU9dCxuLnJlamVjdD1yfSkpfTtmdW5jdGlvbiBvKG4sdCl7dmFyIHI9bG9jYXRpb24uaHJlZjtyZXR1cm4gbmV3IFVSTChuLHIpLmhyZWY9PT1uZXcgVVJMKHQscikuaHJlZn12YXIgdT1mdW5jdGlvbihuLHQpe3RoaXMudHlwZT1uLE9iamVjdC5hc3NpZ24odGhpcyx0KX07ZnVuY3Rpb24gYShuLHQscil7cmV0dXJuIHI/dD90KG4pOm46KG4mJm4udGhlbnx8KG49UHJvbWlzZS5yZXNvbHZlKG4pKSx0P24udGhlbih0KTpuKX1mdW5jdGlvbiBjKCl7fXZhciBmPXt0eXBlOlwiU0tJUF9XQUlUSU5HXCJ9O2Z1bmN0aW9uIHMobix0KXtpZighdClyZXR1cm4gbiYmbi50aGVuP24udGhlbihjKTpQcm9taXNlLnJlc29sdmUoKX12YXIgdj1mdW5jdGlvbihyKXt2YXIgZSxjO2Z1bmN0aW9uIHYobix0KXt2YXIgZSxjO3JldHVybiB2b2lkIDA9PT10JiYodD17fSksKGU9ci5jYWxsKHRoaXMpfHx0aGlzKS5ubj17fSxlLnRuPTAsZS5ybj1uZXcgaSxlLmVuPW5ldyBpLGUub249bmV3IGksZS51bj0wLGUuYW49bmV3IFNldCxlLmNuPWZ1bmN0aW9uKCl7dmFyIG49ZS5mbix0PW4uaW5zdGFsbGluZztlLnRuPjB8fCFvKHQuc2NyaXB0VVJMLGUuc24udG9TdHJpbmcoKSl8fHBlcmZvcm1hbmNlLm5vdygpPmUudW4rNmU0PyhlLnZuPXQsbi5yZW1vdmVFdmVudExpc3RlbmVyKFwidXBkYXRlZm91bmRcIixlLmNuKSk6KGUuaG49dCxlLmFuLmFkZCh0KSxlLnJuLnJlc29sdmUodCkpLCsrZS50bix0LmFkZEV2ZW50TGlzdGVuZXIoXCJzdGF0ZWNoYW5nZVwiLGUubG4pfSxlLmxuPWZ1bmN0aW9uKG4pe3ZhciB0PWUuZm4scj1uLnRhcmdldCxpPXIuc3RhdGUsbz1yPT09ZS52bixhPXtzdzpyLGlzRXh0ZXJuYWw6byxvcmlnaW5hbEV2ZW50Om59OyFvJiZlLm1uJiYoYS5pc1VwZGF0ZT0hMCksZS5kaXNwYXRjaEV2ZW50KG5ldyB1KGksYSkpLFwiaW5zdGFsbGVkXCI9PT1pP2Uud249c2VsZi5zZXRUaW1lb3V0KChmdW5jdGlvbigpe1wiaW5zdGFsbGVkXCI9PT1pJiZ0LndhaXRpbmc9PT1yJiZlLmRpc3BhdGNoRXZlbnQobmV3IHUoXCJ3YWl0aW5nXCIsYSkpfSksMjAwKTpcImFjdGl2YXRpbmdcIj09PWkmJihjbGVhclRpbWVvdXQoZS53biksb3x8ZS5lbi5yZXNvbHZlKHIpKX0sZS5kbj1mdW5jdGlvbihuKXt2YXIgdD1lLmhuLHI9dCE9PW5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLmNvbnRyb2xsZXI7ZS5kaXNwYXRjaEV2ZW50KG5ldyB1KFwiY29udHJvbGxpbmdcIix7aXNFeHRlcm5hbDpyLG9yaWdpbmFsRXZlbnQ6bixzdzp0LGlzVXBkYXRlOmUubW59KSkscnx8ZS5vbi5yZXNvbHZlKHQpfSxlLmduPShjPWZ1bmN0aW9uKG4pe3ZhciB0PW4uZGF0YSxyPW4ucG9ydHMsaT1uLnNvdXJjZTtyZXR1cm4gYShlLmdldFNXKCksKGZ1bmN0aW9uKCl7ZS5hbi5oYXMoaSkmJmUuZGlzcGF0Y2hFdmVudChuZXcgdShcIm1lc3NhZ2VcIix7ZGF0YTp0LG9yaWdpbmFsRXZlbnQ6bixwb3J0czpyLHN3Oml9KSl9KSl9LGZ1bmN0aW9uKCl7Zm9yKHZhciBuPVtdLHQ9MDt0PGFyZ3VtZW50cy5sZW5ndGg7dCsrKW5bdF09YXJndW1lbnRzW3RdO3RyeXtyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGMuYXBwbHkodGhpcyxuKSl9Y2F0Y2gobil7cmV0dXJuIFByb21pc2UucmVqZWN0KG4pfX0pLGUuc249bixlLm5uPXQsbmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIuYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIixlLmduKSxlfWM9ciwoZT12KS5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShjLnByb3RvdHlwZSksZS5wcm90b3R5cGUuY29uc3RydWN0b3I9ZSxlLl9fcHJvdG9fXz1jO3ZhciBoLGwsbSx3PXYucHJvdG90eXBlO3JldHVybiB3LnJlZ2lzdGVyPWZ1bmN0aW9uKG4pe3ZhciB0PSh2b2lkIDA9PT1uP3t9Om4pLmltbWVkaWF0ZSxyPXZvaWQgMCE9PXQmJnQ7dHJ5e3ZhciBlPXRoaXM7cmV0dXJuIGZ1bmN0aW9uKG4sdCl7dmFyIHI9bigpO2lmKHImJnIudGhlbilyZXR1cm4gci50aGVuKHQpO3JldHVybiB0KHIpfSgoZnVuY3Rpb24oKXtpZighciYmXCJjb21wbGV0ZVwiIT09ZG9jdW1lbnQucmVhZHlTdGF0ZSlyZXR1cm4gcyhuZXcgUHJvbWlzZSgoZnVuY3Rpb24obil7cmV0dXJuIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLG4pfSkpKX0pLChmdW5jdGlvbigpe3JldHVybiBlLm1uPUJvb2xlYW4obmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIuY29udHJvbGxlciksZS55bj1lLnBuKCksYShlLmJuKCksKGZ1bmN0aW9uKG4pe2UuZm49bixlLnluJiYoZS5obj1lLnluLGUuZW4ucmVzb2x2ZShlLnluKSxlLm9uLnJlc29sdmUoZS55biksZS55bi5hZGRFdmVudExpc3RlbmVyKFwic3RhdGVjaGFuZ2VcIixlLmxuLHtvbmNlOiEwfSkpO3ZhciB0PWUuZm4ud2FpdGluZztyZXR1cm4gdCYmbyh0LnNjcmlwdFVSTCxlLnNuLnRvU3RyaW5nKCkpJiYoZS5obj10LFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKGZ1bmN0aW9uKCl7ZS5kaXNwYXRjaEV2ZW50KG5ldyB1KFwid2FpdGluZ1wiLHtzdzp0LHdhc1dhaXRpbmdCZWZvcmVSZWdpc3RlcjohMH0pKX0pKS50aGVuKChmdW5jdGlvbigpe30pKSksZS5obiYmKGUucm4ucmVzb2x2ZShlLmhuKSxlLmFuLmFkZChlLmhuKSksZS5mbi5hZGRFdmVudExpc3RlbmVyKFwidXBkYXRlZm91bmRcIixlLmNuKSxuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5hZGRFdmVudExpc3RlbmVyKFwiY29udHJvbGxlcmNoYW5nZVwiLGUuZG4pLGUuZm59KSl9KSl9Y2F0Y2gobil7cmV0dXJuIFByb21pc2UucmVqZWN0KG4pfX0sdy51cGRhdGU9ZnVuY3Rpb24oKXt0cnl7cmV0dXJuIHRoaXMuZm4/cyh0aGlzLmZuLnVwZGF0ZSgpKTp2b2lkIDB9Y2F0Y2gobil7cmV0dXJuIFByb21pc2UucmVqZWN0KG4pfX0sdy5nZXRTVz1mdW5jdGlvbigpe3JldHVybiB2b2lkIDAhPT10aGlzLmhuP1Byb21pc2UucmVzb2x2ZSh0aGlzLmhuKTp0aGlzLnJuLnByb21pc2V9LHcubWVzc2FnZVNXPWZ1bmN0aW9uKHQpe3RyeXtyZXR1cm4gYSh0aGlzLmdldFNXKCksKGZ1bmN0aW9uKHIpe3JldHVybiBuKHIsdCl9KSl9Y2F0Y2gobil7cmV0dXJuIFByb21pc2UucmVqZWN0KG4pfX0sdy5tZXNzYWdlU2tpcFdhaXRpbmc9ZnVuY3Rpb24oKXt0aGlzLmZuJiZ0aGlzLmZuLndhaXRpbmcmJm4odGhpcy5mbi53YWl0aW5nLGYpfSx3LnBuPWZ1bmN0aW9uKCl7dmFyIG49bmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIuY29udHJvbGxlcjtyZXR1cm4gbiYmbyhuLnNjcmlwdFVSTCx0aGlzLnNuLnRvU3RyaW5nKCkpP246dm9pZCAwfSx3LmJuPWZ1bmN0aW9uKCl7dHJ5e3ZhciBuPXRoaXM7cmV0dXJuIGZ1bmN0aW9uKG4sdCl7dHJ5e3ZhciByPW4oKX1jYXRjaChuKXtyZXR1cm4gdChuKX1pZihyJiZyLnRoZW4pcmV0dXJuIHIudGhlbih2b2lkIDAsdCk7cmV0dXJuIHJ9KChmdW5jdGlvbigpe3JldHVybiBhKG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLnJlZ2lzdGVyKG4uc24sbi5ubiksKGZ1bmN0aW9uKHQpe3JldHVybiBuLnVuPXBlcmZvcm1hbmNlLm5vdygpLHR9KSl9KSwoZnVuY3Rpb24obil7dGhyb3cgbn0pKX1jYXRjaChuKXtyZXR1cm4gUHJvbWlzZS5yZWplY3Qobil9fSxoPXYsKGw9W3trZXk6XCJhY3RpdmVcIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5lbi5wcm9taXNlfX0se2tleTpcImNvbnRyb2xsaW5nXCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMub24ucHJvbWlzZX19XSkmJnQoaC5wcm90b3R5cGUsbCksbSYmdChoLG0pLHZ9KGZ1bmN0aW9uKCl7ZnVuY3Rpb24gbigpe3RoaXMuUG49bmV3IE1hcH12YXIgdD1uLnByb3RvdHlwZTtyZXR1cm4gdC5hZGRFdmVudExpc3RlbmVyPWZ1bmN0aW9uKG4sdCl7dGhpcy5TbihuKS5hZGQodCl9LHQucmVtb3ZlRXZlbnRMaXN0ZW5lcj1mdW5jdGlvbihuLHQpe3RoaXMuU24obikuZGVsZXRlKHQpfSx0LmRpc3BhdGNoRXZlbnQ9ZnVuY3Rpb24obil7bi50YXJnZXQ9dGhpcztmb3IodmFyIHQscj1lKHRoaXMuU24obi50eXBlKSk7ISh0PXIoKSkuZG9uZTspeygwLHQudmFsdWUpKG4pfX0sdC5Tbj1mdW5jdGlvbihuKXtyZXR1cm4gdGhpcy5Qbi5oYXMobil8fHRoaXMuUG4uc2V0KG4sbmV3IFNldCksdGhpcy5Qbi5nZXQobil9LG59KCkpO2V4cG9ydHt2IGFzIFdvcmtib3gsdSBhcyBXb3JrYm94RXZlbnQsbiBhcyBtZXNzYWdlU1d9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9d29ya2JveC13aW5kb3cucHJvZC5lczUubWpzLm1hcFxuIiwiLyoqXG4gKiBBcHAgY2xhc3MgdGhhdCByZXByZXNlbnRzIGFuIGVudHJ5IHBvaW50IG9mIHRoZSBhcHBsaWNhdGlvbi5cbiAqL1xuXG5pbXBvcnQgeyBnZXRVVUlELCBnZXRVc2VyU291cmNlLCBnZXREYXRhRmlsZSB9IGZyb20gJy4vdXRpbHMvdXJsVXRpbHMnO1xuaW1wb3J0IHsgU3VydmV5IH0gZnJvbSAnLi9zdXJ2ZXkvc3VydmV5JztcbmltcG9ydCB7IEFzc2Vzc21lbnQgfSBmcm9tICcuL2Fzc2Vzc21lbnQvYXNzZXNzbWVudCc7XG5pbXBvcnQgeyBVbml0eUJyaWRnZSB9IGZyb20gJy4vdXRpbHMvdW5pdHlCcmlkZ2UnO1xuaW1wb3J0IHsgQW5hbHl0aWNzRXZlbnRzIH0gZnJvbSAnLi9hbmFseXRpY3MvYW5hbHl0aWNzRXZlbnRzJztcbmltcG9ydCB7IEJhc2VRdWl6IH0gZnJvbSAnLi9iYXNlUXVpeic7XG5pbXBvcnQgeyBmZXRjaEFwcERhdGEsIGdldERhdGFVUkwgfSBmcm9tICcuL3V0aWxzL2pzb25VdGlscyc7XG5pbXBvcnQgeyBpbml0aWFsaXplQXBwIH0gZnJvbSAnZmlyZWJhc2UvYXBwJztcbmltcG9ydCB7IGdldEFuYWx5dGljcywgbG9nRXZlbnQgfSBmcm9tICdmaXJlYmFzZS9hbmFseXRpY3MnO1xuaW1wb3J0IHsgV29ya2JveCB9IGZyb20gJ3dvcmtib3gtd2luZG93JztcbmltcG9ydCBDYWNoZU1vZGVsIGZyb20gJy4vY29tcG9uZW50cy9jYWNoZU1vZGVsJztcbmltcG9ydCB7IFVJQ29udHJvbGxlciB9IGZyb20gJy4vdWkvdWlDb250cm9sbGVyJztcblxuY29uc3QgYXBwVmVyc2lvbjogc3RyaW5nID0gJ3YxLjEuMyc7XG5cbi8qKlxuICogQ29udGVudCB2ZXJzaW9uIGZyb20gdGhlIGRhdGEgZmlsZSBpbiBmb3JtYXQgdjAuMVxuICogR2V0cyBzZXQgd2hlbiB0aGUgY29udGVudCBpcyBsb2FkZWRcbiAqL1xubGV0IGNvbnRlbnRWZXJzaW9uOiBzdHJpbmcgPSAnJztcblxubGV0IGxvYWRpbmdTY3JlZW4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbG9hZGluZ1NjcmVlbicpO1xuY29uc3QgcHJvZ3Jlc3NCYXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncHJvZ3Jlc3NCYXInKTtcbmNvbnN0IGJyb2FkY2FzdENoYW5uZWw6IEJyb2FkY2FzdENoYW5uZWwgPSBuZXcgQnJvYWRjYXN0Q2hhbm5lbCgnYXMtbWVzc2FnZS1jaGFubmVsJyk7XG5cbmV4cG9ydCBjbGFzcyBBcHAge1xuICAvKiogQ291bGQgYmUgJ2Fzc2Vzc21lbnQnIG9yICdzdXJ2ZXknIGJhc2VkIG9uIHRoZSBkYXRhIGZpbGUgKi9cbiAgcHVibGljIGRhdGFVUkw6IHN0cmluZztcblxuICBwdWJsaWMgdW5pdHlCcmlkZ2U7XG4gIHB1YmxpYyBhbmFseXRpY3M7XG4gIHB1YmxpYyBnYW1lOiBCYXNlUXVpejtcblxuICBjYWNoZU1vZGVsOiBDYWNoZU1vZGVsO1xuXG4gIGxhbmc6IHN0cmluZyA9ICdlbmdsaXNoJztcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnVuaXR5QnJpZGdlID0gbmV3IFVuaXR5QnJpZGdlKCk7XG5cbiAgICBjb25zb2xlLmxvZygnSW5pdGlhbGl6aW5nIGFwcC4uLicpO1xuXG4gICAgdGhpcy5kYXRhVVJMID0gZ2V0RGF0YUZpbGUoKTtcbiAgICB0aGlzLmNhY2hlTW9kZWwgPSBuZXcgQ2FjaGVNb2RlbCh0aGlzLmRhdGFVUkwsIHRoaXMuZGF0YVVSTCwgbmV3IFNldDxzdHJpbmc+KCkpO1xuXG4gICAgLy8gY29uc29sZS5sb2coXCJEYXRhIGZpbGU6IFwiICsgdGhpcy5kYXRhVVJMKTtcblxuICAgIGNvbnN0IGZpcmViYXNlQ29uZmlnID0ge1xuICAgICAgYXBpS2V5OiAnQUl6YVN5QjhjMmxCVmkyNnU3WVJMOXN4T1A5N1VhcTN5TjhoVGw0JyxcbiAgICAgIGF1dGhEb21haW46ICdmdG0tYjlkOTkuZmlyZWJhc2VhcHAuY29tJyxcbiAgICAgIGRhdGFiYXNlVVJMOiAnaHR0cHM6Ly9mdG0tYjlkOTkuZmlyZWJhc2Vpby5jb20nLFxuICAgICAgcHJvamVjdElkOiAnZnRtLWI5ZDk5JyxcbiAgICAgIHN0b3JhZ2VCdWNrZXQ6ICdmdG0tYjlkOTkuYXBwc3BvdC5jb20nLFxuICAgICAgbWVzc2FnaW5nU2VuZGVySWQ6ICc2MDI0MDIzODc5NDEnLFxuICAgICAgYXBwSWQ6ICcxOjYwMjQwMjM4Nzk0MTp3ZWI6N2IxYjExODE4NjRkMjhiNDlkZTEwYycsXG4gICAgICBtZWFzdXJlbWVudElkOiAnRy1GRjExNTlUR0NGJyxcbiAgICB9O1xuXG4gICAgY29uc3QgZmFwcCA9IGluaXRpYWxpemVBcHAoZmlyZWJhc2VDb25maWcpO1xuICAgIGNvbnN0IGZhbmFseXRpY3MgPSBnZXRBbmFseXRpY3MoZmFwcCk7XG5cbiAgICB0aGlzLmFuYWx5dGljcyA9IGZhbmFseXRpY3M7XG4gICAgbG9nRXZlbnQoZmFuYWx5dGljcywgJ25vdGlmaWNhdGlvbl9yZWNlaXZlZCcpO1xuICAgIGxvZ0V2ZW50KGZhbmFseXRpY3MsICd0ZXN0IGluaXRpYWxpemF0aW9uIGV2ZW50Jywge30pO1xuXG4gICAgY29uc29sZS5sb2coJ2ZpcmViYXNlIGluaXRpYWxpemVkJyk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgc3BpblVwKCkge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xuICAgICAgY29uc29sZS5sb2coJ1dpbmRvdyBMb2FkZWQhJyk7XG4gICAgICAoYXN5bmMgKCkgPT4ge1xuICAgICAgICBhd2FpdCBmZXRjaEFwcERhdGEodGhpcy5kYXRhVVJMKS50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ0Fzc2Vzc21lbnQvU3VydmV5ICcgKyBhcHBWZXJzaW9uICsgJyBpbml0aWFsaXppbmchJyk7XG4gICAgICAgICAgY29uc29sZS5sb2coJ0FwcCBkYXRhIGxvYWRlZCEnKTtcbiAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcblxuICAgICAgICAgIHRoaXMuY2FjaGVNb2RlbC5zZXRDb250ZW50RmlsZVBhdGgoZ2V0RGF0YVVSTCh0aGlzLmRhdGFVUkwpKTtcblxuICAgICAgICAgIC8vIFRPRE86IFdoeSBkbyB3ZSBuZWVkIHRvIHNldCB0aGUgZmVlZGJhY2sgdGV4dCBoZXJlP1xuICAgICAgICAgIFVJQ29udHJvbGxlci5TZXRGZWVkYmFja1RleHQoZGF0YVsnZmVlZGJhY2tUZXh0J10pO1xuXG4gICAgICAgICAgbGV0IGFwcFR5cGUgPSBkYXRhWydhcHBUeXBlJ107XG4gICAgICAgICAgbGV0IGFzc2Vzc21lbnRUeXBlID0gZGF0YVsnYXNzZXNzbWVudFR5cGUnXTtcblxuICAgICAgICAgIGlmIChhcHBUeXBlID09ICdzdXJ2ZXknKSB7XG4gICAgICAgICAgICB0aGlzLmdhbWUgPSBuZXcgU3VydmV5KHRoaXMuZGF0YVVSTCwgdGhpcy51bml0eUJyaWRnZSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChhcHBUeXBlID09ICdhc3Nlc3NtZW50Jykge1xuICAgICAgICAgICAgLy8gR2V0IGFuZCBhZGQgYWxsIHRoZSBhdWRpbyBhc3NldHMgdG8gdGhlIGNhY2hlIG1vZGVsXG5cbiAgICAgICAgICAgIGxldCBidWNrZXRzID0gZGF0YVsnYnVja2V0cyddO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJ1Y2tldHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBidWNrZXRzW2ldLml0ZW1zLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGF1ZGlvSXRlbVVSTDtcbiAgICAgICAgICAgICAgICAvLyBVc2UgdG8gbG93ZXIgY2FzZSBmb3IgdGhlIEx1Z2FuZGFuIGRhdGFcbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICBkYXRhWydxdWl6TmFtZSddLmluY2x1ZGVzKCdMdWdhbmRhJykgfHxcbiAgICAgICAgICAgICAgICAgIGRhdGFbJ3F1aXpOYW1lJ10udG9Mb3dlckNhc2UoKS5pbmNsdWRlcygnd2VzdCBhZnJpY2FuIGVuZ2xpc2gnKVxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgYXVkaW9JdGVtVVJMID1cbiAgICAgICAgICAgICAgICAgICAgJy9hdWRpby8nICsgdGhpcy5kYXRhVVJMICsgJy8nICsgYnVja2V0c1tpXS5pdGVtc1tqXS5pdGVtTmFtZS50b0xvd2VyQ2FzZSgpLnRyaW0oKSArICcubXAzJztcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgYXVkaW9JdGVtVVJMID0gJy9hdWRpby8nICsgdGhpcy5kYXRhVVJMICsgJy8nICsgYnVja2V0c1tpXS5pdGVtc1tqXS5pdGVtTmFtZS50cmltKCkgKyAnLm1wMyc7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5jYWNoZU1vZGVsLmFkZEl0ZW1Ub0F1ZGlvVmlzdWFsUmVzb3VyY2VzKGF1ZGlvSXRlbVVSTCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5jYWNoZU1vZGVsLmFkZEl0ZW1Ub0F1ZGlvVmlzdWFsUmVzb3VyY2VzKCcvYXVkaW8vJyArIHRoaXMuZGF0YVVSTCArICcvYW5zd2VyX2ZlZWRiYWNrLm1wMycpO1xuXG4gICAgICAgICAgICB0aGlzLmdhbWUgPSBuZXcgQXNzZXNzbWVudCh0aGlzLmRhdGFVUkwsIHRoaXMudW5pdHlCcmlkZ2UpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMuZ2FtZS51bml0eUJyaWRnZSA9IHRoaXMudW5pdHlCcmlkZ2U7XG5cbiAgICAgICAgICBBbmFseXRpY3NFdmVudHMuc2V0VXVpZChnZXRVVUlEKCksIGdldFVzZXJTb3VyY2UoKSk7XG4gICAgICAgICAgQW5hbHl0aWNzRXZlbnRzLmxpbmtBbmFseXRpY3ModGhpcy5hbmFseXRpY3MsIHRoaXMuZGF0YVVSTCk7XG4gICAgICAgICAgQW5hbHl0aWNzRXZlbnRzLnNldEFzc2Vzc21lbnRUeXBlKGFzc2Vzc21lbnRUeXBlKTtcbiAgICAgICAgICBjb250ZW50VmVyc2lvbiA9IGRhdGFbJ2NvbnRlbnRWZXJzaW9uJ107XG4gICAgICAgICAgQW5hbHl0aWNzRXZlbnRzLnNlbmRJbml0KGFwcFZlcnNpb24sIGRhdGFbJ2NvbnRlbnRWZXJzaW9uJ10pO1xuICAgICAgICAgIC8vIHRoaXMuY2FjaGVNb2RlbC5zZXRBcHBOYW1lKHRoaXMuY2FjaGVNb2RlbC5hcHBOYW1lICsgJzonICsgZGF0YVtcImNvbnRlbnRWZXJzaW9uXCJdKTtcblxuICAgICAgICAgIHRoaXMuZ2FtZS5SdW4odGhpcyk7XG4gICAgICAgIH0pO1xuICAgICAgICBsb2FkaW5nU2NyZWVuIS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICBVSUNvbnRyb2xsZXIuU2V0Q29udGVudExvYWRlZCh0cnVlKTtcbiAgICAgICAgLy8gYXdhaXQgdGhpcy5yZWdpc3RlclNlcnZpY2VXb3JrZXIodGhpcy5nYW1lLCB0aGlzLmRhdGFVUkwpO1xuICAgICAgfSkoKTtcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIHJlZ2lzdGVyU2VydmljZVdvcmtlcihnYW1lOiBCYXNlUXVpeiwgZGF0YVVSTDogc3RyaW5nID0gJycpIHtcbiAgICBjb25zb2xlLmxvZygnUmVnaXN0ZXJpbmcgc2VydmljZSB3b3JrZXIuLi4nKTtcblxuICAgIGlmICgnc2VydmljZVdvcmtlcicgaW4gbmF2aWdhdG9yKSB7XG4gICAgICBsZXQgd2IgPSBuZXcgV29ya2JveCgnLi9zdy5qcycsIHt9KTtcblxuICAgICAgd2IucmVnaXN0ZXIoKVxuICAgICAgICAudGhlbigocmVnaXN0cmF0aW9uKSA9PiB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ1NlcnZpY2Ugd29ya2VyIHJlZ2lzdGVyZWQhJyk7XG4gICAgICAgICAgdGhpcy5oYW5kbGVTZXJ2aWNlV29ya2VyUmVnaXN0YXRpb24ocmVnaXN0cmF0aW9uKTtcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnU2VydmljZSB3b3JrZXIgcmVnaXN0cmF0aW9uIGZhaWxlZDogJyArIGVycik7XG4gICAgICAgIH0pO1xuXG4gICAgICBuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgaGFuZGxlU2VydmljZVdvcmtlck1lc3NhZ2UpO1xuXG4gICAgICBhd2FpdCBuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5yZWFkeTtcblxuICAgICAgY29uc29sZS5sb2coJ0NhY2hlIE1vZGVsOiAnKTtcbiAgICAgIGNvbnNvbGUubG9nKHRoaXMuY2FjaGVNb2RlbCk7XG5cbiAgICAgIC8vIFdlIG5lZWQgdG8gY2hlY2sgaWYgdGhlcmUncyBhIG5ldyB2ZXJzaW9uIG9mIHRoZSBjb250ZW50IGZpbGUgYW5kIGluIHRoYXQgY2FzZVxuICAgICAgLy8gcmVtb3ZlIHRoZSBsb2NhbFN0b3JhZ2UgY29udGVudCBuYW1lIGFuZCB2ZXJzaW9uIHZhbHVlXG5cbiAgICAgIGNvbnNvbGUubG9nKCdDaGVja2luZyBmb3IgY29udGVudCB2ZXJzaW9uIHVwZGF0ZXMuLi4nICsgZGF0YVVSTCk7XG5cbiAgICAgIGZldGNoKHRoaXMuY2FjaGVNb2RlbC5jb250ZW50RmlsZVBhdGggKyAnP2NhY2hlLWJ1c3Q9JyArIG5ldyBEYXRlKCkuZ2V0VGltZSgpLCB7XG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgICdDYWNoZS1Db250cm9sJzogJ25vLXN0b3JlJyxcbiAgICAgICAgfSxcbiAgICAgICAgY2FjaGU6ICduby1zdG9yZScsXG4gICAgICB9KVxuICAgICAgICAudGhlbihhc3luYyAocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gZmV0Y2ggdGhlIGNvbnRlbnQgZmlsZSBmcm9tIHRoZSBzZXJ2ZXIhJyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnN0IG5ld0NvbnRlbnRGaWxlRGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgICAgICBjb25zdCBhaGVhZENvbnRlbnRWZXJzaW9uID0gbmV3Q29udGVudEZpbGVEYXRhWydjb250ZW50VmVyc2lvbiddO1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdObyBDYWNoZSBDb250ZW50IHZlcnNpb246ICcgKyBhaGVhZENvbnRlbnRWZXJzaW9uKTtcblxuICAgICAgICAgIC8vIFdlIG5lZWQgdG8gY2hlY2sgaGVyZSBmb3IgdGhlIGNvbnRlbnQgdmVyc2lvbiB1cGRhdGVzXG4gICAgICAgICAgLy8gSWYgdGhlcmUncyBhIG5ldyBjb250ZW50IHZlcnNpb24sIHdlIG5lZWQgdG8gcmVtb3ZlIHRoZSBjYWNoZWQgY29udGVudCBhbmQgcmVsb2FkXG4gICAgICAgICAgLy8gV2UgYXJlIGNvbXBhcmluZyBoZXJlIHRoZSBjb250ZW50VmVyc2lvbiB3aXRoIHRoZSBhaGVhZENvbnRlbnRWZXJzaW9uXG4gICAgICAgICAgaWYgKGFoZWFkQ29udGVudFZlcnNpb24gJiYgY29udGVudFZlcnNpb24gIT0gYWhlYWRDb250ZW50VmVyc2lvbikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0NvbnRlbnQgdmVyc2lvbiBtaXNtYXRjaCEgUmVsb2FkaW5nLi4uJyk7XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSh0aGlzLmNhY2hlTW9kZWwuYXBwTmFtZSk7XG4gICAgICAgICAgICAvLyBDbGVhciB0aGUgY2FjaGUgZm9yIHRodCBwYXJ0aWN1bGFyIGNvbnRlbnRcbiAgICAgICAgICAgIGNhY2hlcy5kZWxldGUodGhpcy5jYWNoZU1vZGVsLmFwcE5hbWUpO1xuICAgICAgICAgICAgaGFuZGxlVXBkYXRlRm91bmRNZXNzYWdlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgZmV0Y2hpbmcgdGhlIGNvbnRlbnQgZmlsZTogJyArIGVycm9yKTtcbiAgICAgICAgfSk7XG5cbiAgICAgIGlmIChsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0aGlzLmNhY2hlTW9kZWwuYXBwTmFtZSkgPT0gbnVsbCkge1xuICAgICAgICBjb25zb2xlLmxvZygnQ2FjaGluZyEnICsgdGhpcy5jYWNoZU1vZGVsLmFwcE5hbWUpO1xuICAgICAgICBsb2FkaW5nU2NyZWVuIS5zdHlsZS5kaXNwbGF5ID0gJ2ZsZXgnO1xuICAgICAgICBicm9hZGNhc3RDaGFubmVsLnBvc3RNZXNzYWdlKHtcbiAgICAgICAgICBjb21tYW5kOiAnQ2FjaGUnLFxuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGFwcERhdGE6IHRoaXMuY2FjaGVNb2RlbCxcbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHByb2dyZXNzQmFyIS5zdHlsZS53aWR0aCA9IDEwMCArICclJztcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgbG9hZGluZ1NjcmVlbiEuc3R5bGUuZGlzcGxheSA9ICdub25lJztcblxuICAgICAgICB9LCAxNTAwKTtcbiAgICAgIH1cblxuICAgICAgYnJvYWRjYXN0Q2hhbm5lbC5vbm1lc3NhZ2UgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coZXZlbnQuZGF0YS5jb21tYW5kICsgJyByZWNlaXZlZCBmcm9tIHNlcnZpY2Ugd29ya2VyIScpO1xuICAgICAgICBpZiAoZXZlbnQuZGF0YS5jb21tYW5kID09ICdBY3RpdmF0ZWQnICYmIGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMuY2FjaGVNb2RlbC5hcHBOYW1lKSA9PSBudWxsKSB7XG4gICAgICAgICAgYnJvYWRjYXN0Q2hhbm5lbC5wb3N0TWVzc2FnZSh7XG4gICAgICAgICAgICBjb21tYW5kOiAnQ2FjaGUnLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICBhcHBEYXRhOiB0aGlzLmNhY2hlTW9kZWwsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLndhcm4oJ1NlcnZpY2Ugd29ya2VycyBhcmUgbm90IHN1cHBvcnRlZCBpbiB0aGlzIGJyb3dzZXIuJyk7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlU2VydmljZVdvcmtlclJlZ2lzdGF0aW9uKHJlZ2lzdHJhdGlvbjogU2VydmljZVdvcmtlclJlZ2lzdHJhdGlvbiB8IHVuZGVmaW5lZCk6IHZvaWQge1xuICAgIHRyeSB7XG4gICAgICByZWdpc3RyYXRpb24/Lmluc3RhbGxpbmc/LnBvc3RNZXNzYWdlKHtcbiAgICAgICAgdHlwZTogJ1JlZ2lzdGFydGlvbicsXG4gICAgICAgIHZhbHVlOiB0aGlzLmxhbmcsXG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdTZXJ2aWNlIHdvcmtlciByZWdpc3RyYXRpb24gZmFpbGVkOiAnICsgZXJyKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgR2V0RGF0YVVSTCgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmRhdGFVUkw7XG4gIH1cbn1cblxuYnJvYWRjYXN0Q2hhbm5lbC5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgaGFuZGxlU2VydmljZVdvcmtlck1lc3NhZ2UpO1xuXG5mdW5jdGlvbiBoYW5kbGVTZXJ2aWNlV29ya2VyTWVzc2FnZShldmVudCk6IHZvaWQge1xuICBpZiAoZXZlbnQuZGF0YS5tc2cgPT0gJ0xvYWRpbmcnKSB7XG4gICAgbGV0IHByb2dyZXNzVmFsdWUgPSBwYXJzZUludChldmVudC5kYXRhLmRhdGEucHJvZ3Jlc3MpO1xuICAgIGhhbmRsZUxvYWRpbmdNZXNzYWdlKGV2ZW50LCBwcm9ncmVzc1ZhbHVlKTtcbiAgfVxuICBpZiAoZXZlbnQuZGF0YS5tc2cgPT0gJ1VwZGF0ZUZvdW5kJykge1xuICAgIGNvbnNvbGUubG9nKCc+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pi4sdXBkYXRlIEZvdW5kJyk7XG4gICAgaGFuZGxlVXBkYXRlRm91bmRNZXNzYWdlKCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gaGFuZGxlTG9hZGluZ01lc3NhZ2UoZXZlbnQsIHByb2dyZXNzVmFsdWUpOiB2b2lkIHtcbiAgaWYgKHByb2dyZXNzVmFsdWUgPCA0MCAmJiBwcm9ncmVzc1ZhbHVlID49IDEwKSB7XG4gICAgcHJvZ3Jlc3NCYXIhLnN0eWxlLndpZHRoID0gcHJvZ3Jlc3NWYWx1ZSArICclJztcbiAgfSBlbHNlIGlmIChwcm9ncmVzc1ZhbHVlID49IDEwMCkge1xuICAgIHByb2dyZXNzQmFyIS5zdHlsZS53aWR0aCA9IDEwMCArICclJztcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGxvYWRpbmdTY3JlZW4hLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICBVSUNvbnRyb2xsZXIuU2V0Q29udGVudExvYWRlZCh0cnVlKTtcbiAgICB9LCAxNTAwKTtcbiAgICAvLyBhZGQgYm9vayB3aXRoIGEgbmFtZSB0byBsb2NhbCBzdG9yYWdlIGFzIGNhY2hlZFxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGV2ZW50LmRhdGEuZGF0YS5ib29rTmFtZSwgJ3RydWUnKTtcbiAgICByZWFkTGFuZ3VhZ2VEYXRhRnJvbUNhY2hlQW5kTm90aWZ5QW5kcm9pZEFwcChldmVudC5kYXRhLmRhdGEuYm9va05hbWUpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHJlYWRMYW5ndWFnZURhdGFGcm9tQ2FjaGVBbmROb3RpZnlBbmRyb2lkQXBwKGJvb2tOYW1lOiBzdHJpbmcpIHtcbiAgLy9AdHMtaWdub3JlXG4gIGlmICh3aW5kb3cuQW5kcm9pZCkge1xuICAgIGxldCBpc0NvbnRlbnRDYWNoZWQ6IGJvb2xlYW4gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShib29rTmFtZSkgIT09IG51bGw7XG4gICAgLy9AdHMtaWdub3JlXG4gICAgd2luZG93LkFuZHJvaWQuY2FjaGVkU3RhdHVzKGlzQ29udGVudENhY2hlZCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gaGFuZGxlVXBkYXRlRm91bmRNZXNzYWdlKCk6IHZvaWQge1xuICBsZXQgdGV4dCA9ICdVcGRhdGUgRm91bmQuXFxuUGxlYXNlIGFjY2VwdCB0aGUgdXBkYXRlIGJ5IHByZXNzaW5nIE9rLic7XG4gIGlmIChjb25maXJtKHRleHQpID09IHRydWUpIHtcbiAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG4gIH0gZWxzZSB7XG4gICAgdGV4dCA9ICdVcGRhdGUgd2lsbCBoYXBwZW4gb24gdGhlIG5leHQgbGF1bmNoLic7XG4gIH1cbn1cblxuY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuYXBwLnNwaW5VcCgpO1xuIiwiLy8gSW50ZXJmYWNlIHRoYXQgZ2V0cyBwYXNzZWQgYXJvdW5kIHRoZSBhcHAgY29tcG9uZW50cyB0byBnYXRoZXIgYWxsIHJlcXVyaWVkIHJlc291cmNlc1xuLy8gYW5kIHRoYXQgZ2V0cyBzZW50IHRvIHRoZSBzZXJ2aWNlIHdvcmtlciBmb3IgY2FjaGluZ1xuXG5pbnRlcmZhY2UgSUNhY2hlTW9kZWwge1xuICBhcHBOYW1lOiBzdHJpbmc7XG4gIGNvbnRlbnRGaWxlUGF0aDogc3RyaW5nO1xuICBhdWRpb1Zpc3VhbFJlc291cmNlczogU2V0PHN0cmluZz47XG59XG5cbmNsYXNzIENhY2hlTW9kZWwgaW1wbGVtZW50cyBJQ2FjaGVNb2RlbCB7XG4gIGFwcE5hbWU6IHN0cmluZztcbiAgY29udGVudEZpbGVQYXRoOiBzdHJpbmc7XG4gIGF1ZGlvVmlzdWFsUmVzb3VyY2VzOiBTZXQ8c3RyaW5nPjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBhcHBOYW1lOiBzdHJpbmcsXG4gICAgY29udGVudEZpbGVQYXRoOiBzdHJpbmcsXG4gICAgYXVkaW9WaXN1YWxSZXNvdXJjZXM6IFNldDxzdHJpbmc+XG4gICkge1xuICAgIHRoaXMuYXBwTmFtZSA9IGFwcE5hbWU7XG4gICAgdGhpcy5jb250ZW50RmlsZVBhdGggPSBjb250ZW50RmlsZVBhdGg7XG4gICAgdGhpcy5hdWRpb1Zpc3VhbFJlc291cmNlcyA9IGF1ZGlvVmlzdWFsUmVzb3VyY2VzO1xuICB9XG5cbiAgcHVibGljIHNldEFwcE5hbWUoYXBwTmFtZTogc3RyaW5nKSB7XG4gICAgdGhpcy5hcHBOYW1lID0gYXBwTmFtZTtcbiAgfVxuXG4gIHB1YmxpYyBzZXRDb250ZW50RmlsZVBhdGgoY29udGVudEZpbGVQYXRoOiBzdHJpbmcpIHtcbiAgICB0aGlzLmNvbnRlbnRGaWxlUGF0aCA9IGNvbnRlbnRGaWxlUGF0aDtcbiAgfVxuXG4gIHB1YmxpYyBzZXRBdWRpb1Zpc3VhbFJlc291cmNlcyhhdWRpb1Zpc3VhbFJlc291cmNlczogU2V0PHN0cmluZz4pIHtcbiAgICB0aGlzLmF1ZGlvVmlzdWFsUmVzb3VyY2VzID0gYXVkaW9WaXN1YWxSZXNvdXJjZXM7XG4gIH1cblxuICBwdWJsaWMgYWRkSXRlbVRvQXVkaW9WaXN1YWxSZXNvdXJjZXMoaXRlbTogc3RyaW5nKSB7XG4gICAgaWYgKCF0aGlzLmF1ZGlvVmlzdWFsUmVzb3VyY2VzLmhhcyhpdGVtKSkge1xuICAgICAgdGhpcy5hdWRpb1Zpc3VhbFJlc291cmNlcy5hZGQoaXRlbSk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENhY2hlTW9kZWw7XG4iXSwibmFtZXMiOlsiX193ZWJwYWNrX3JlcXVpcmVfXyIsImdldERhdGFGaWxlIiwiZGF0YSIsImdldFBhdGhOYW1lIiwiZ2V0IiwidW5kZWZpbmVkIiwiY29uc29sZSIsImxvZyIsInF1ZXJ5U3RyaW5nIiwid2luZG93IiwibG9jYXRpb24iLCJzZWFyY2giLCJVUkxTZWFyY2hQYXJhbXMiLCJnIiwiZ2xvYmFsVGhpcyIsInRoaXMiLCJGdW5jdGlvbiIsImUiLCJnZXREYXRhVVJMIiwidXJsIiwibG9hZERhdGEiLCJmdXJsIiwiZmV0Y2giLCJ0aGVuIiwicmVzcG9uc2UiLCJqc29uIiwiQXVkaW9Db250cm9sbGVyIiwiaW1hZ2VUb0NhY2hlIiwid2F2VG9DYWNoZSIsImFsbEF1ZGlvcyIsImFsbEltYWdlcyIsImRhdGFVUkwiLCJjb3JyZWN0U291bmRQYXRoIiwiZmVlZGJhY2tBdWRpbyIsImNvcnJlY3RBdWRpbyIsImluaXQiLCJBdWRpbyIsInNyYyIsInN0YXRpYyIsInF1ZXN0aW9uc0RhdGEiLCJnZXRJbnN0YW5jZSIsImZlZWRiYWNrU291bmRQYXRoIiwicXVlc3Rpb25JbmRleCIsInB1c2giLCJxdWVzdGlvbkRhdGEiLCJhbnN3ZXJJbmRleCIsInByb21wdEF1ZGlvIiwiRmlsdGVyQW5kQWRkQXVkaW9Ub0FsbEF1ZGlvcyIsInRvTG93ZXJDYXNlIiwicHJvbXB0SW1nIiwiQWRkSW1hZ2VUb0FsbEltYWdlcyIsImFuc3dlcnMiLCJhbnN3ZXJEYXRhIiwiYW5zd2VySW1nIiwibmV3SW1hZ2VVUkwiLCJuZXdJbWFnZSIsIkltYWdlIiwibmV3QXVkaW9VUkwiLCJpbmNsdWRlcyIsInJlcGxhY2UiLCJ0cmltIiwibmV3QXVkaW8iLCJzcGxpdCIsIm5ld0J1Y2tldCIsIml0ZW1JbmRleCIsIml0ZW1zIiwiaXRlbSIsIml0ZW1OYW1lIiwiYXVkaW9OYW1lIiwiZmluaXNoZWRDYWxsYmFjayIsImF1ZGlvQW5pbSIsInNsaWNlIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJhdWRpbyIsImFkZEV2ZW50TGlzdGVuZXIiLCJwbGF5IiwiY2F0Y2giLCJlcnJvciIsIndhcm4iLCJpbWFnZU5hbWUiLCJpbnN0YW5jZSIsInJhbmRGcm9tIiwiYXJyYXkiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJsZW5ndGgiLCJzaHVmZmxlQXJyYXkiLCJpIiwiaiIsIlVJQ29udHJvbGxlciIsImxhbmRpbmdDb250YWluZXJJZCIsImdhbWVDb250YWluZXJJZCIsImVuZENvbnRhaW5lcklkIiwic3RhckNvbnRhaW5lcklkIiwiY2hlc3RDb250YWluZXJJZCIsInF1ZXN0aW9uc0NvbnRhaW5lcklkIiwiZmVlZGJhY2tDb250YWluZXJJZCIsImFuc3dlcnNDb250YWluZXJJZCIsImFuc3dlckJ1dHRvbjFJZCIsImFuc3dlckJ1dHRvbjJJZCIsImFuc3dlckJ1dHRvbjNJZCIsImFuc3dlckJ1dHRvbjRJZCIsImFuc3dlckJ1dHRvbjVJZCIsImFuc3dlckJ1dHRvbjZJZCIsInBsYXlCdXR0b25JZCIsImNoZXN0SW1nSWQiLCJuZXh0UXVlc3Rpb24iLCJjb250ZW50TG9hZGVkIiwic2hvd24iLCJzdGFycyIsInNob3duU3RhcnNDb3VudCIsInN0YXJQb3NpdGlvbnMiLCJBcnJheSIsInFBbnNOdW0iLCJidXR0b25zIiwiYnV0dG9uc0FjdGl2ZSIsImRldk1vZGVDb3JyZWN0TGFiZWxWaXNpYmlsaXR5IiwiZGV2TW9kZUJ1Y2tldENvbnRyb2xzRW5hYmxlZCIsImFuaW1hdGlvblNwZWVkTXVsdGlwbGllciIsImxhbmRpbmdDb250YWluZXIiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwiZ2FtZUNvbnRhaW5lciIsImVuZENvbnRhaW5lciIsInN0YXJDb250YWluZXIiLCJjaGVzdENvbnRhaW5lciIsInF1ZXN0aW9uc0NvbnRhaW5lciIsImZlZWRiYWNrQ29udGFpbmVyIiwiYW5zd2Vyc0NvbnRhaW5lciIsImFuc3dlckJ1dHRvbjEiLCJhbnN3ZXJCdXR0b24yIiwiYW5zd2VyQnV0dG9uMyIsImFuc3dlckJ1dHRvbjQiLCJhbnN3ZXJCdXR0b241IiwiYW5zd2VyQnV0dG9uNiIsInBsYXlCdXR0b24iLCJjaGVzdEltZyIsImluaXRpYWxpemVTdGFycyIsImluaXRFdmVudExpc3RlbmVycyIsIm5ld1N0YXIiLCJjcmVhdGVFbGVtZW50IiwiaWQiLCJjbGFzc0xpc3QiLCJhZGQiLCJhcHBlbmRDaGlsZCIsImlubmVySFRNTCIsIlNldEFuaW1hdGlvblNwZWVkTXVsdGlwbGllciIsIm11bHRpcGxpZXIiLCJTZXRDb3JyZWN0TGFiZWxWaXNpYmlsaXR5IiwidmlzaWJsZSIsIlNldEJ1Y2tldENvbnRyb2xzVmlzaWJpbGl0eSIsIngiLCJ5IiwibWluRGlzdGFuY2UiLCJkeCIsImR5Iiwic3FydCIsImFuc3dlckJ1dHRvblByZXNzIiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsInNob3dHYW1lIiwic2hvd09wdGlvbnMiLCJuZXdRIiwiYW5pbWF0aW9uRHVyYXRpb24iLCJkZWxheUJmb3JlT3B0aW9uIiwib3B0aW9uc0Rpc3BsYXllZCIsImZvckVhY2giLCJidXR0b24iLCJzdHlsZSIsInZpc2liaWxpdHkiLCJhbmltYXRpb24iLCJzZXRUaW1lb3V0IiwiY3VyQW5zd2VyIiwiaXNDb3JyZWN0IiwiYW5zd2VyTmFtZSIsImNvcnJlY3QiLCJhbnN3ZXJUZXh0IiwiY29ycmVjdExhYmVsIiwiYm94U2hhZG93IiwidG1waW1nIiwiR2V0SW1hZ2UiLCJlbmFibGVBbnN3ZXJCdXR0b24iLCJxU3RhcnQiLCJEYXRlIiwibm93IiwibnQiLCJzaG93TGFuZGluZyIsImRpc3BsYXkiLCJhbGxTdGFydCIsInN0YXJ0UHJlc3NDYWxsYmFjayIsInJlbW92ZSIsImNvbG9yIiwiUGxheUNvcnJlY3QiLCJyZUdlbmVyYXRlSXRlbXMiLCJiIiwiZXh0ZXJuYWxCdWNrZXRDb250cm9sc0dlbmVyYXRpb25IYW5kbGVyIiwiU2hvd1F1ZXN0aW9uIiwiUGxheUF1ZGlvIiwiU2hvd0F1ZGlvQW5pbWF0aW9uIiwicGxheWluZyIsInF1ZXJ5U2VsZWN0b3IiLCJuZXdRdWVzdGlvbiIsInFDb2RlIiwiYnV0dG9uSW5kZXgiLCJwcm9tcHRUZXh0Iiwic3RhclRvU2hvdyIsInBvc2l0aW9uIiwiY29udGFpbmVyV2lkdGgiLCJvZmZzZXRXaWR0aCIsImNvbnRhaW5lckhlaWdodCIsIm9mZnNldEhlaWdodCIsInJhbmRvbVgiLCJyYW5kb21ZIiwiT3ZlcmxhcHBpbmdPdGhlclN0YXJzIiwidHJhbnNmb3JtIiwidHJhbnNpdGlvbiIsInpJbmRleCIsInRvcCIsImlubmVySGVpZ2h0IiwibGVmdCIsInJvdGF0aW9uIiwiZmlsdGVyIiwiYnV0dG9uTnVtIiwiYWxsQnV0dG9uc1Zpc2libGUiLCJldmVyeSIsIlBsYXlEaW5nIiwiZFRpbWUiLCJidXR0b25QcmVzc0NhbGxiYWNrIiwiY2hlc3RJbWFnZSIsImN1cnJlbnRJbWdTcmMiLCJjdXJyZW50SW1hZ2VOdW1iZXIiLCJwYXJzZUludCIsIm5leHRJbWFnZVNyYyIsInZhbHVlIiwiY2FsbGJhY2siLCJoYW5kbGVyIiwic3RyaW5nVG9CeXRlQXJyYXkkMSIsInN0ciIsIm91dCIsInAiLCJjIiwiY2hhckNvZGVBdCIsImJhc2U2NCIsImJ5dGVUb0NoYXJNYXBfIiwiY2hhclRvQnl0ZU1hcF8iLCJieXRlVG9DaGFyTWFwV2ViU2FmZV8iLCJjaGFyVG9CeXRlTWFwV2ViU2FmZV8iLCJFTkNPREVEX1ZBTFNfQkFTRSIsIkVOQ09ERURfVkFMUyIsIkVOQ09ERURfVkFMU19XRUJTQUZFIiwiSEFTX05BVElWRV9TVVBQT1JUIiwiYXRvYiIsImVuY29kZUJ5dGVBcnJheSIsImlucHV0Iiwid2ViU2FmZSIsImlzQXJyYXkiLCJFcnJvciIsImluaXRfIiwiYnl0ZVRvQ2hhck1hcCIsIm91dHB1dCIsImJ5dGUxIiwiaGF2ZUJ5dGUyIiwiYnl0ZTIiLCJoYXZlQnl0ZTMiLCJieXRlMyIsIm91dEJ5dGUxIiwib3V0Qnl0ZTIiLCJvdXRCeXRlMyIsIm91dEJ5dGU0Iiwiam9pbiIsImVuY29kZVN0cmluZyIsImJ0b2EiLCJkZWNvZGVTdHJpbmciLCJieXRlcyIsInBvcyIsImMxIiwiU3RyaW5nIiwiZnJvbUNoYXJDb2RlIiwiYzIiLCJ1IiwiYzMiLCJieXRlQXJyYXlUb1N0cmluZyIsImRlY29kZVN0cmluZ1RvQnl0ZUFycmF5IiwiY2hhclRvQnl0ZU1hcCIsImNoYXJBdCIsImJ5dGU0IiwiYmFzZTY0dXJsRW5jb2RlV2l0aG91dFBhZGRpbmciLCJ1dGY4Qnl0ZXMiLCJiYXNlNjRFbmNvZGUiLCJpbmRleGVkREIiLCJwcmVFeGlzdCIsIkRCX0NIRUNLX05BTUUiLCJyZXF1ZXN0Iiwic2VsZiIsIm9wZW4iLCJvbnN1Y2Nlc3MiLCJyZXN1bHQiLCJjbG9zZSIsImRlbGV0ZURhdGFiYXNlIiwib251cGdyYWRlbmVlZGVkIiwib25lcnJvciIsIl9hIiwibWVzc2FnZSIsImdldERlZmF1bHRzIiwiZ2V0R2xvYmFsIiwiX19GSVJFQkFTRV9ERUZBVUxUU19fIiwicHJvY2VzcyIsImVudiIsImRlZmF1bHRzSnNvblN0cmluZyIsIkpTT04iLCJwYXJzZSIsImdldERlZmF1bHRzRnJvbUVudlZhcmlhYmxlIiwibWF0Y2giLCJjb29raWUiLCJkZWNvZGVkIiwiYmFzZTY0RGVjb2RlIiwiZ2V0RGVmYXVsdHNGcm9tQ29va2llIiwiaW5mbyIsIkRlZmVycmVkIiwiY29uc3RydWN0b3IiLCJwcm9taXNlIiwid3JhcENhbGxiYWNrIiwiRmlyZWJhc2VFcnJvciIsImNvZGUiLCJjdXN0b21EYXRhIiwic3VwZXIiLCJuYW1lIiwiT2JqZWN0Iiwic2V0UHJvdG90eXBlT2YiLCJwcm90b3R5cGUiLCJjYXB0dXJlU3RhY2tUcmFjZSIsIkVycm9yRmFjdG9yeSIsImNyZWF0ZSIsInNlcnZpY2UiLCJzZXJ2aWNlTmFtZSIsImVycm9ycyIsImZ1bGxDb2RlIiwidGVtcGxhdGUiLCJQQVRURVJOIiwiXyIsImtleSIsInJlcGxhY2VUZW1wbGF0ZSIsImZ1bGxNZXNzYWdlIiwiZGVlcEVxdWFsIiwiYSIsImFLZXlzIiwia2V5cyIsImJLZXlzIiwiayIsImFQcm9wIiwiYlByb3AiLCJpc09iamVjdCIsInRoaW5nIiwiY2FsY3VsYXRlQmFja29mZk1pbGxpcyIsImJhY2tvZmZDb3VudCIsImludGVydmFsTWlsbGlzIiwiYmFja29mZkZhY3RvciIsImN1cnJCYXNlVmFsdWUiLCJwb3ciLCJyYW5kb21XYWl0Iiwicm91bmQiLCJtaW4iLCJfZGVsZWdhdGUiLCJDb21wb25lbnQiLCJpbnN0YW5jZUZhY3RvcnkiLCJ0eXBlIiwibXVsdGlwbGVJbnN0YW5jZXMiLCJzZXJ2aWNlUHJvcHMiLCJpbnN0YW50aWF0aW9uTW9kZSIsIm9uSW5zdGFuY2VDcmVhdGVkIiwic2V0SW5zdGFudGlhdGlvbk1vZGUiLCJtb2RlIiwic2V0TXVsdGlwbGVJbnN0YW5jZXMiLCJzZXRTZXJ2aWNlUHJvcHMiLCJwcm9wcyIsInNldEluc3RhbmNlQ3JlYXRlZENhbGxiYWNrIiwiREVGQVVMVF9FTlRSWV9OQU1FIiwiUHJvdmlkZXIiLCJjb250YWluZXIiLCJjb21wb25lbnQiLCJpbnN0YW5jZXMiLCJNYXAiLCJpbnN0YW5jZXNEZWZlcnJlZCIsImluc3RhbmNlc09wdGlvbnMiLCJvbkluaXRDYWxsYmFja3MiLCJpZGVudGlmaWVyIiwibm9ybWFsaXplZElkZW50aWZpZXIiLCJub3JtYWxpemVJbnN0YW5jZUlkZW50aWZpZXIiLCJoYXMiLCJkZWZlcnJlZCIsInNldCIsImlzSW5pdGlhbGl6ZWQiLCJzaG91bGRBdXRvSW5pdGlhbGl6ZSIsImdldE9ySW5pdGlhbGl6ZVNlcnZpY2UiLCJpbnN0YW5jZUlkZW50aWZpZXIiLCJnZXRJbW1lZGlhdGUiLCJvcHRpb25zIiwib3B0aW9uYWwiLCJnZXRDb21wb25lbnQiLCJzZXRDb21wb25lbnQiLCJpc0NvbXBvbmVudEVhZ2VyIiwiaW5zdGFuY2VEZWZlcnJlZCIsImVudHJpZXMiLCJjbGVhckluc3RhbmNlIiwiZGVsZXRlIiwiYXN5bmMiLCJzZXJ2aWNlcyIsImZyb20iLCJ2YWx1ZXMiLCJhbGwiLCJtYXAiLCJJTlRFUk5BTCIsIl9kZWxldGUiLCJpc0NvbXBvbmVudFNldCIsImdldE9wdGlvbnMiLCJpbml0aWFsaXplIiwib3B0cyIsIm9uSW5pdCIsImV4aXN0aW5nQ2FsbGJhY2tzIiwiU2V0IiwiZXhpc3RpbmdJbnN0YW5jZSIsImludm9rZU9uSW5pdENhbGxiYWNrcyIsImNhbGxiYWNrcyIsIkNvbXBvbmVudENvbnRhaW5lciIsInByb3ZpZGVycyIsImFkZENvbXBvbmVudCIsInByb3ZpZGVyIiwiZ2V0UHJvdmlkZXIiLCJhZGRPck92ZXJ3cml0ZUNvbXBvbmVudCIsImdldFByb3ZpZGVycyIsIkxvZ0xldmVsIiwibGV2ZWxTdHJpbmdUb0VudW0iLCJERUJVRyIsIlZFUkJPU0UiLCJJTkZPIiwiV0FSTiIsIkVSUk9SIiwiU0lMRU5UIiwiZGVmYXVsdExvZ0xldmVsIiwiQ29uc29sZU1ldGhvZCIsImRlZmF1bHRMb2dIYW5kbGVyIiwibG9nVHlwZSIsImFyZ3MiLCJsb2dMZXZlbCIsInRvSVNPU3RyaW5nIiwibWV0aG9kIiwiTG9nZ2VyIiwiX2xvZ0xldmVsIiwiX2xvZ0hhbmRsZXIiLCJfdXNlckxvZ0hhbmRsZXIiLCJ2YWwiLCJUeXBlRXJyb3IiLCJzZXRMb2dMZXZlbCIsImxvZ0hhbmRsZXIiLCJ1c2VyTG9nSGFuZGxlciIsImRlYnVnIiwiaWRiUHJveHlhYmxlVHlwZXMiLCJjdXJzb3JBZHZhbmNlTWV0aG9kcyIsImN1cnNvclJlcXVlc3RNYXAiLCJXZWFrTWFwIiwidHJhbnNhY3Rpb25Eb25lTWFwIiwidHJhbnNhY3Rpb25TdG9yZU5hbWVzTWFwIiwidHJhbnNmb3JtQ2FjaGUiLCJyZXZlcnNlVHJhbnNmb3JtQ2FjaGUiLCJpZGJQcm94eVRyYXBzIiwidGFyZ2V0IiwicHJvcCIsInJlY2VpdmVyIiwiSURCVHJhbnNhY3Rpb24iLCJvYmplY3RTdG9yZU5hbWVzIiwib2JqZWN0U3RvcmUiLCJ0cmFuc2Zvcm1DYWNoYWJsZVZhbHVlIiwiZnVuYyIsIklEQkRhdGFiYXNlIiwidHJhbnNhY3Rpb24iLCJJREJDdXJzb3IiLCJhZHZhbmNlIiwiY29udGludWUiLCJjb250aW51ZVByaW1hcnlLZXkiLCJhcHBseSIsInVud3JhcCIsInN0b3JlTmFtZXMiLCJ0eCIsImNhbGwiLCJzb3J0IiwiZG9uZSIsInVubGlzdGVuIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImNvbXBsZXRlIiwiRE9NRXhjZXB0aW9uIiwiY2FjaGVEb25lUHJvbWlzZUZvclRyYW5zYWN0aW9uIiwib2JqZWN0IiwiSURCT2JqZWN0U3RvcmUiLCJJREJJbmRleCIsInNvbWUiLCJQcm94eSIsIklEQlJlcXVlc3QiLCJzdWNjZXNzIiwicHJvbWlzaWZ5UmVxdWVzdCIsIm5ld1ZhbHVlIiwib3BlbkRCIiwidmVyc2lvbiIsImJsb2NrZWQiLCJ1cGdyYWRlIiwiYmxvY2tpbmciLCJ0ZXJtaW5hdGVkIiwib3BlblByb21pc2UiLCJldmVudCIsIm9sZFZlcnNpb24iLCJuZXdWZXJzaW9uIiwiZGIiLCJyZWFkTWV0aG9kcyIsIndyaXRlTWV0aG9kcyIsImNhY2hlZE1ldGhvZHMiLCJnZXRNZXRob2QiLCJ0YXJnZXRGdW5jTmFtZSIsInVzZUluZGV4IiwiaXNXcml0ZSIsInN0b3JlTmFtZSIsInN0b3JlIiwiaW5kZXgiLCJzaGlmdCIsIm9sZFRyYXBzIiwiUGxhdGZvcm1Mb2dnZXJTZXJ2aWNlSW1wbCIsImdldFBsYXRmb3JtSW5mb1N0cmluZyIsImlzVmVyc2lvblNlcnZpY2VQcm92aWRlciIsImxpYnJhcnkiLCJsb2dTdHJpbmciLCJuYW1lJG8iLCJ2ZXJzaW9uJDEiLCJsb2dnZXIiLCJQTEFURk9STV9MT0dfU1RSSU5HIiwiX2FwcHMiLCJfY29tcG9uZW50cyIsIl9hZGRDb21wb25lbnQiLCJhcHAiLCJfcmVnaXN0ZXJDb21wb25lbnQiLCJjb21wb25lbnROYW1lIiwiaGVhcnRiZWF0Q29udHJvbGxlciIsInRyaWdnZXJIZWFydGJlYXQiLCJFUlJPUl9GQUNUT1JZIiwiRmlyZWJhc2VBcHBJbXBsIiwiY29uZmlnIiwiX2lzRGVsZXRlZCIsIl9vcHRpb25zIiwiYXNzaWduIiwiX2NvbmZpZyIsIl9uYW1lIiwiX2F1dG9tYXRpY0RhdGFDb2xsZWN0aW9uRW5hYmxlZCIsImF1dG9tYXRpY0RhdGFDb2xsZWN0aW9uRW5hYmxlZCIsIl9jb250YWluZXIiLCJjaGVja0Rlc3Ryb3llZCIsImlzRGVsZXRlZCIsImFwcE5hbWUiLCJpbml0aWFsaXplQXBwIiwicmF3Q29uZmlnIiwiZXhpc3RpbmdBcHAiLCJuZXdBcHAiLCJyZWdpc3RlclZlcnNpb24iLCJsaWJyYXJ5S2V5T3JOYW1lIiwidmFyaWFudCIsImxpYnJhcnlNaXNtYXRjaCIsInZlcnNpb25NaXNtYXRjaCIsIndhcm5pbmciLCJTVE9SRV9OQU1FIiwiZGJQcm9taXNlIiwiZ2V0RGJQcm9taXNlIiwiY3JlYXRlT2JqZWN0U3RvcmUiLCJvcmlnaW5hbEVycm9yTWVzc2FnZSIsIndyaXRlSGVhcnRiZWF0c1RvSW5kZXhlZERCIiwiaGVhcnRiZWF0T2JqZWN0IiwicHV0IiwiY29tcHV0ZUtleSIsImlkYkdldEVycm9yIiwiYXBwSWQiLCJIZWFydGJlYXRTZXJ2aWNlSW1wbCIsIl9oZWFydGJlYXRzQ2FjaGUiLCJfc3RvcmFnZSIsIkhlYXJ0YmVhdFN0b3JhZ2VJbXBsIiwiX2hlYXJ0YmVhdHNDYWNoZVByb21pc2UiLCJyZWFkIiwiYWdlbnQiLCJkYXRlIiwiZ2V0VVRDRGF0ZVN0cmluZyIsImxhc3RTZW50SGVhcnRiZWF0RGF0ZSIsImhlYXJ0YmVhdHMiLCJzaW5nbGVEYXRlSGVhcnRiZWF0IiwiaGJUaW1lc3RhbXAiLCJ2YWx1ZU9mIiwib3ZlcndyaXRlIiwiaGVhcnRiZWF0c1RvU2VuZCIsInVuc2VudEVudHJpZXMiLCJoZWFydGJlYXRzQ2FjaGUiLCJtYXhTaXplIiwiaGVhcnRiZWF0RW50cnkiLCJmaW5kIiwiaGIiLCJkYXRlcyIsImNvdW50Qnl0ZXMiLCJwb3AiLCJleHRyYWN0SGVhcnRiZWF0c0ZvckhlYWRlciIsImhlYWRlclN0cmluZyIsInN0cmluZ2lmeSIsInN1YnN0cmluZyIsIl9jYW5Vc2VJbmRleGVkREJQcm9taXNlIiwicnVuSW5kZXhlZERCRW52aXJvbm1lbnRDaGVjayIsImlkYkhlYXJ0YmVhdE9iamVjdCIsInJlYWRIZWFydGJlYXRzRnJvbUluZGV4ZWREQiIsImhlYXJ0YmVhdHNPYmplY3QiLCJleGlzdGluZ0hlYXJ0YmVhdHNPYmplY3QiLCJQQUNLQUdFX1ZFUlNJT04iLCJpc1NlcnZlckVycm9yIiwiZ2V0SW5zdGFsbGF0aW9uc0VuZHBvaW50IiwicHJvamVjdElkIiwiZXh0cmFjdEF1dGhUb2tlbkluZm9Gcm9tUmVzcG9uc2UiLCJ0b2tlbiIsInJlcXVlc3RTdGF0dXMiLCJleHBpcmVzSW4iLCJyZXNwb25zZUV4cGlyZXNJbiIsIk51bWJlciIsImNyZWF0aW9uVGltZSIsImdldEVycm9yRnJvbVJlc3BvbnNlIiwicmVxdWVzdE5hbWUiLCJlcnJvckRhdGEiLCJzZXJ2ZXJDb2RlIiwic2VydmVyTWVzc2FnZSIsInNlcnZlclN0YXR1cyIsInN0YXR1cyIsImdldEhlYWRlcnMiLCJhcGlLZXkiLCJIZWFkZXJzIiwiQWNjZXB0IiwicmV0cnlJZlNlcnZlckVycm9yIiwiZm4iLCJzbGVlcCIsIm1zIiwiVkFMSURfRklEX1BBVFRFUk4iLCJnZW5lcmF0ZUZpZCIsImZpZEJ5dGVBcnJheSIsIlVpbnQ4QXJyYXkiLCJjcnlwdG8iLCJtc0NyeXB0byIsImdldFJhbmRvbVZhbHVlcyIsImZpZCIsInN1YnN0ciIsImVuY29kZSIsInRlc3QiLCJnZXRLZXkiLCJhcHBDb25maWciLCJmaWRDaGFuZ2VDYWxsYmFja3MiLCJmaWRDaGFuZ2VkIiwiY2FsbEZpZENoYW5nZUNhbGxiYWNrcyIsImNoYW5uZWwiLCJicm9hZGNhc3RDaGFubmVsIiwiQnJvYWRjYXN0Q2hhbm5lbCIsIm9ubWVzc2FnZSIsInBvc3RNZXNzYWdlIiwic2l6ZSIsImJyb2FkY2FzdEZpZENoYW5nZSIsIk9CSkVDVF9TVE9SRV9OQU1FIiwib2xkVmFsdWUiLCJ1cGRhdGUiLCJ1cGRhdGVGbiIsImdldEluc3RhbGxhdGlvbkVudHJ5IiwiaW5zdGFsbGF0aW9ucyIsInJlZ2lzdHJhdGlvblByb21pc2UiLCJpbnN0YWxsYXRpb25FbnRyeSIsIm9sZEVudHJ5IiwiY2xlYXJUaW1lZE91dFJlcXVlc3QiLCJyZWdpc3RyYXRpb25TdGF0dXMiLCJ1cGRhdGVPckNyZWF0ZUluc3RhbGxhdGlvbkVudHJ5IiwiZW50cnlXaXRoUHJvbWlzZSIsIm5hdmlnYXRvciIsIm9uTGluZSIsImluUHJvZ3Jlc3NFbnRyeSIsInJlZ2lzdHJhdGlvblRpbWUiLCJyZWdpc3RlcmVkSW5zdGFsbGF0aW9uRW50cnkiLCJoZWFydGJlYXRTZXJ2aWNlUHJvdmlkZXIiLCJlbmRwb2ludCIsImhlYWRlcnMiLCJoZWFydGJlYXRTZXJ2aWNlIiwiaGVhcnRiZWF0c0hlYWRlciIsImdldEhlYXJ0YmVhdHNIZWFkZXIiLCJhcHBlbmQiLCJib2R5IiwiYXV0aFZlcnNpb24iLCJzZGtWZXJzaW9uIiwib2siLCJyZXNwb25zZVZhbHVlIiwicmVmcmVzaFRva2VuIiwiYXV0aFRva2VuIiwiY3JlYXRlSW5zdGFsbGF0aW9uUmVxdWVzdCIsInJlZ2lzdGVySW5zdGFsbGF0aW9uIiwid2FpdFVudGlsRmlkUmVnaXN0cmF0aW9uIiwidHJpZ2dlclJlZ2lzdHJhdGlvbklmTmVjZXNzYXJ5IiwiZW50cnkiLCJ1cGRhdGVJbnN0YWxsYXRpb25SZXF1ZXN0IiwiZ2VuZXJhdGVBdXRoVG9rZW5SZXF1ZXN0IiwiZ2V0R2VuZXJhdGVBdXRoVG9rZW5FbmRwb2ludCIsImdldEF1dGhvcml6YXRpb25IZWFkZXIiLCJnZXRIZWFkZXJzV2l0aEF1dGgiLCJpbnN0YWxsYXRpb24iLCJyZWZyZXNoQXV0aFRva2VuIiwiZm9yY2VSZWZyZXNoIiwidG9rZW5Qcm9taXNlIiwiaXNFbnRyeVJlZ2lzdGVyZWQiLCJvbGRBdXRoVG9rZW4iLCJpc0F1dGhUb2tlbkV4cGlyZWQiLCJ1cGRhdGVBdXRoVG9rZW5SZXF1ZXN0Iiwid2FpdFVudGlsQXV0aFRva2VuUmVxdWVzdCIsImluUHJvZ3Jlc3NBdXRoVG9rZW4iLCJyZXF1ZXN0VGltZSIsIm1ha2VBdXRoVG9rZW5SZXF1ZXN0SW5Qcm9ncmVzc0VudHJ5IiwidXBkYXRlZEluc3RhbGxhdGlvbkVudHJ5IiwiZmV0Y2hBdXRoVG9rZW5Gcm9tU2VydmVyIiwiZ2V0TWlzc2luZ1ZhbHVlRXJyb3IiLCJ2YWx1ZU5hbWUiLCJJTlNUQUxMQVRJT05TX05BTUUiLCJjb25maWdLZXlzIiwia2V5TmFtZSIsImV4dHJhY3RBcHBDb25maWciLCJnZXRJZCIsImluc3RhbGxhdGlvbnNJbXBsIiwiZ2V0VG9rZW4iLCJjb21wbGV0ZUluc3RhbGxhdGlvblJlZ2lzdHJhdGlvbiIsIkFOQUxZVElDU19UWVBFIiwiR1RBR19VUkwiLCJwcm9taXNlQWxsU2V0dGxlZCIsInByb21pc2VzIiwiZGVmYXVsdFJldHJ5RGF0YSIsInRocm90dGxlTWV0YWRhdGEiLCJnZXRUaHJvdHRsZU1ldGFkYXRhIiwic2V0VGhyb3R0bGVNZXRhZGF0YSIsIm1ldGFkYXRhIiwiZGVsZXRlVGhyb3R0bGVNZXRhZGF0YSIsImZldGNoRHluYW1pY0NvbmZpZ1dpdGhSZXRyeSIsInJldHJ5RGF0YSIsInRpbWVvdXRNaWxsaXMiLCJtZWFzdXJlbWVudElkIiwidGhyb3R0bGVFbmRUaW1lTWlsbGlzIiwic2lnbmFsIiwiQW5hbHl0aWNzQWJvcnRTaWduYWwiLCJhYm9ydCIsImF0dGVtcHRGZXRjaER5bmFtaWNDb25maWdXaXRoUmV0cnkiLCJhcHBGaWVsZHMiLCJfYiIsImJhY2tvZmZNaWxsaXMiLCJtYXgiLCJ0aW1lb3V0IiwiY2xlYXJUaW1lb3V0Iiwic2V0QWJvcnRhYmxlVGltZW91dCIsImFwcFVybCIsImVycm9yTWVzc2FnZSIsImpzb25SZXNwb25zZSIsIl9pZ25vcmVkIiwiaHR0cFN0YXR1cyIsInJlc3BvbnNlTWVzc2FnZSIsImZldGNoRHluYW1pY0NvbmZpZyIsImlzUmV0cmlhYmxlRXJyb3IiLCJsaXN0ZW5lcnMiLCJsaXN0ZW5lciIsImRlZmF1bHRFdmVudFBhcmFtZXRlcnNGb3JJbml0IiwiZGVmYXVsdENvbnNlbnRTZXR0aW5nc0ZvckluaXQiLCJfaW5pdGlhbGl6ZUFuYWx5dGljcyIsImR5bmFtaWNDb25maWdQcm9taXNlc0xpc3QiLCJtZWFzdXJlbWVudElkVG9BcHBJZCIsImd0YWdDb3JlIiwiZGF0YUxheWVyTmFtZSIsImR5bmFtaWNDb25maWdQcm9taXNlIiwiZmlkUHJvbWlzZSIsImVycm9ySW5mbyIsInRvU3RyaW5nIiwidmFsaWRhdGVJbmRleGVkREIiLCJlbnZJc1ZhbGlkIiwiZHluYW1pY0NvbmZpZyIsInNjcmlwdFRhZ3MiLCJnZXRFbGVtZW50c0J5VGFnTmFtZSIsInRhZyIsImZpbmRHdGFnU2NyaXB0T25QYWdlIiwic2NyaXB0IiwiaGVhZCIsImluc2VydFNjcmlwdFRhZyIsImNvbmZpZ1Byb3BlcnRpZXMiLCJBbmFseXRpY3NTZXJ2aWNlIiwiaW5pdGlhbGl6YXRpb25Qcm9taXNlc01hcCIsImd0YWdDb3JlRnVuY3Rpb24iLCJ3cmFwcGVkR3RhZ0Z1bmN0aW9uIiwiZ2xvYmFsSW5pdERvbmUiLCJmYWN0b3J5IiwibWlzbWF0Y2hlZEVudk1lc3NhZ2VzIiwicnVudGltZSIsImNocm9tZSIsImJyb3dzZXIiLCJjb29raWVFbmFibGVkIiwiZGV0YWlscyIsImVyciIsIndhcm5PbkJyb3dzZXJDb250ZXh0TWlzbWF0Y2giLCJkYXRhTGF5ZXIiLCJnZXRPckNyZWF0ZURhdGFMYXllciIsIndyYXBwZWRHdGFnIiwiZ3RhZ0Z1bmN0aW9uTmFtZSIsIl9hcmdzIiwiYXJndW1lbnRzIiwiY29tbWFuZCIsImlkT3JOYW1lT3JQYXJhbXMiLCJndGFnUGFyYW1zIiwiaW5pdGlhbGl6YXRpb25Qcm9taXNlc1RvV2FpdEZvciIsImdhU2VuZFRvTGlzdCIsImR5bmFtaWNDb25maWdSZXN1bHRzIiwic2VuZFRvSWQiLCJmb3VuZENvbmZpZyIsImluaXRpYWxpemF0aW9uUHJvbWlzZSIsImd0YWdPbkV2ZW50IiwiY29ycmVzcG9uZGluZ0FwcElkIiwiZ3RhZ09uQ29uZmlnIiwid3JhcEd0YWciLCJ3cmFwT3JDcmVhdGVHdGFnIiwibG9nRXZlbnQiLCJhbmFseXRpY3NJbnN0YW5jZSIsImV2ZW50TmFtZSIsImV2ZW50UGFyYW1zIiwiZ3RhZ0Z1bmN0aW9uIiwiZ2xvYmFsIiwibG9nRXZlbnQkMSIsImFuYWx5dGljc09wdGlvbnMiLCJhbmFseXRpY3MiLCJyZWFzb24iLCJBbmFseXRpY3NFdmVudHMiLCJhc3Nlc3NtZW50VHlwZSIsInN0YXR1c1RleHQiLCJsYXRsb25nIiwibG9jIiwibHBpZWNlcyIsImxhdCIsInBhcnNlRmxvYXQiLCJ0b0ZpeGVkIiwibG9uIiwiY2xhdCIsImNsb24iLCJzZW5kTG9jYXRpb24iLCJtc2ciLCJuZXdnYW5hIiwiZGF0YXVybCIsImdhbmEiLCJuZXdVdWlkIiwibmV3VXNlclNvdXJjZSIsInV1aWQiLCJ1c2VyU291cmNlIiwiYXBwVmVyc2lvbiIsImNvbnRlbnRWZXJzaW9uIiwiZ2V0TG9jYXRpb24iLCJldmVudFN0cmluZyIsImFwcFR5cGUiLCJsYW5ndWFnZSIsImxhc3RJbmRleE9mIiwidXNlciIsImxhbmciLCJnZXRBcHBMYW5ndWFnZUZyb21EYXRhVVJMIiwiZ2V0QXBwVHlwZUZyb21EYXRhVVJMIiwiam9pbkxhdExvbmciLCJjbFVzZXJJZCIsImxhdExvbmciLCJ0aGVRIiwidGhlQSIsImVsYXBzZWQiLCJhbnMiLCJpc2NvcnJlY3QiLCJidWNrZXQiLCJxTmFtZSIsImFOdW0iLCJkdCIsInF1ZXN0aW9uX251bWJlciIsInFOdW1iZXIiLCJxVGFyZ2V0IiwicXVlc3Rpb24iLCJzZWxlY3RlZF9hbnN3ZXIiLCJ0YiIsInBhc3NlZCIsImJuIiwiYnVja2V0SUQiLCJidHJpZWQiLCJudW1UcmllZCIsImJjb3JyZWN0IiwibnVtQ29ycmVjdCIsImJ1Y2tldE51bWJlciIsIm51bWJlclRyaWVkSW5CdWNrZXQiLCJudW1iZXJDb3JyZWN0SW5CdWNrZXQiLCJwYXNzZWRCdWNrZXQiLCJidWNrZXRzIiwiYmFzYWxCdWNrZXQiLCJjZWlsaW5nQnVja2V0IiwiYmFzYWxCdWNrZXRJRCIsImdldEJhc2FsQnVja2V0SUQiLCJjZWlsaW5nQnVja2V0SUQiLCJnZXRDZWlsaW5nQnVja2V0SUQiLCJzY29yZSIsImNhbGN1bGF0ZVNjb3JlIiwibWF4U2NvcmUiLCJzZW5kRGF0YVRvVGhpcmRQYXJ0eSIsInBhcmVudCIsInVybFBhcmFtcyIsInRhcmdldFBhcnR5VVJMIiwieGhyIiwiWE1MSHR0cFJlcXVlc3QiLCJwYXlsb2FkIiwicGFnZSIsInN1YlR5cGUiLCJjb21wbGV0ZWQiLCJwYXlsb2FkU3RyaW5nIiwic2V0UmVxdWVzdEhlYWRlciIsIm9ubG9hZCIsInJlc3BvbnNlVGV4dCIsInNlbmQiLCJ0ZXN0ZWQiLCJCYXNlUXVpeiIsImRldk1vZGVBdmFpbGFibGUiLCJpc0luRGV2TW9kZSIsImlzQ29ycmVjdExhYmVsU2hvd24iLCJpc0J1Y2tldEluZm9TaG93biIsImlzQnVja2V0Q29udHJvbHNFbmFibGVkIiwiZGV2TW9kZVRvZ2dsZUJ1dHRvbkNvbnRhaW5lcklkIiwiZGV2TW9kZVRvZ2dsZUJ1dHRvbklkIiwiZGV2TW9kZU1vZGFsSWQiLCJkZXZNb2RlQnVja2V0R2VuU2VsZWN0SWQiLCJkZXZNb2RlQ29ycmVjdExhYmVsU2hvd25DaGVja2JveElkIiwiZGV2TW9kZUJ1Y2tldEluZm9TaG93bkNoZWNrYm94SWQiLCJkZXZNb2RlQnVja2V0SW5mb0NvbnRhaW5lcklkIiwiZGV2TW9kZUJ1Y2tldENvbnRyb2xzU2hvd25DaGVja2JveElkIiwiZGV2TW9kZUFuaW1hdGlvblNwZWVkTXVsdGlwbGllclJhbmdlSWQiLCJkZXZNb2RlQW5pbWF0aW9uU3BlZWRNdWx0aXBsaWVyVmFsdWVJZCIsInRvZ2dsZURldk1vZGVNb2RhbCIsImRldk1vZGVTZXR0aW5nc01vZGFsIiwiaHJlZiIsImRldk1vZGVUb2dnbGVCdXR0b25Db250YWluZXIiLCJkZXZNb2RlQnVja2V0R2VuU2VsZWN0Iiwib25jaGFuZ2UiLCJoYW5kbGVCdWNrZXRHZW5Nb2RlQ2hhbmdlIiwiZGV2TW9kZVRvZ2dsZUJ1dHRvbiIsIm9uY2xpY2siLCJkZXZNb2RlQ29ycmVjdExhYmVsU2hvd25DaGVja2JveCIsImNoZWNrZWQiLCJoYW5kbGVDb3JyZWN0TGFiZWxTaG93bkNoYW5nZSIsImRldk1vZGVCdWNrZXRJbmZvU2hvd25DaGVja2JveCIsImRldk1vZGVCdWNrZXRJbmZvQ29udGFpbmVyIiwiaGFuZGxlQnVja2V0SW5mb1Nob3duQ2hhbmdlIiwiZGV2TW9kZUJ1Y2tldENvbnRyb2xzU2hvd25DaGVja2JveCIsImhhbmRsZUJ1Y2tldENvbnRyb2xzU2hvd25DaGFuZ2UiLCJkZXZNb2RlQW5pbWF0aW9uU3BlZWRNdWx0aXBsaWVyUmFuZ2UiLCJkZXZNb2RlQW5pbWF0aW9uU3BlZWRNdWx0aXBsaWVyVmFsdWUiLCJpbm5lclRleHQiLCJoYW5kbGVBbmltYXRpb25TcGVlZE11bHRpcGxpZXJDaGFuZ2UiLCJoaWRlRGV2TW9kZUJ1dHRvbiIsIm9uRW5kIiwiU2hvd0VuZCIsInVuaXR5QnJpZGdlIiwiU2VuZENsb3NlIiwiU3VydmV5Iiwic3RhcnRTdXJ2ZXkiLCJSZWFkeUZvck5leHQiLCJidWlsZE5ld1F1ZXN0aW9uIiwib25RdWVzdGlvbkVuZCIsIlNldEZlZWRiYWNrVmlzaWJpbGUiLCJjdXJyZW50UXVlc3Rpb25JbmRleCIsIkhhc1F1ZXN0aW9uc0xlZnQiLCJoYW5kbGVBbnN3ZXJCdXR0b25QcmVzcyIsImFuc3dlciIsInNlbmRBbnN3ZXJlZCIsIkFkZFN0YXIiLCJidWlsZFF1ZXN0aW9uTGlzdCIsImZldGNoU3VydmV5UXVlc3Rpb25zIiwiU2V0QnV0dG9uUHJlc3NBY3Rpb24iLCJTZXRTdGFydEFjdGlvbiIsIlJ1biIsIlByZXBhcmVBdWRpb0FuZEltYWdlc0ZvclN1cnZleSIsIkdldERhdGFVUkwiLCJTZW5kTG9hZGVkIiwiVHJlZU5vZGUiLCJyaWdodCIsInNvcnRlZEFycmF5VG9JRHNCU1QiLCJzdGFydCIsImVuZCIsInVzZWRJbmRpY2VzIiwibWlkIiwibm9kZSIsInNlYXJjaFN0YWdlIiwiQnVja2V0R2VuTW9kZSIsIkFzc2Vzc21lbnQiLCJidWNrZXRHZW5Nb2RlIiwiUmFuZG9tQlNUIiwiTUFYX1NUQVJTX0NPVU5UX0lOX0xJTkVBUl9NT0RFIiwiZ2VuZXJhdGVEZXZNb2RlQnVja2V0Q29udHJvbHNJbkNvbnRhaW5lciIsImNsaWNrSGFuZGxlciIsIkxpbmVhckFycmF5QmFzZWQiLCJjdXJyZW50QnVja2V0IiwiaXRlbUJ1dHRvbiIsIm1hcmdpbiIsImN1cnJlbnRMaW5lYXJUYXJnZXRJbmRleCIsInVzZWRJdGVtcyIsInByZXZCdXR0b24iLCJjdXJyZW50TGluZWFyQnVja2V0SW5kZXgiLCJkaXNhYmxlZCIsInRyeU1vdmVCdWNrZXQiLCJ1cGRhdGVCdWNrZXRJbmZvIiwibmV4dEJ1dHRvbiIsImJ1dHRvbnNDb250YWluZXIiLCJmbGV4RGlyZWN0aW9uIiwianVzdGlmeUNvbnRlbnQiLCJhbGlnbkl0ZW1zIiwibnVtQ29uc2VjdXRpdmVXcm9uZyIsInN0YXJ0QXNzZXNzbWVudCIsImJ1aWxkQnVja2V0cyIsInJlcyIsImZldGNoQXNzZXNzbWVudEJ1Y2tldHMiLCJudW1CdWNrZXRzIiwiYnVja2V0QXJyYXkiLCJyb290T2ZJRHMiLCJidWNrZXRzUm9vdCIsImNvbnZlcnRUb0J1Y2tldEJTVCIsImN1cnJlbnROb2RlIiwiYnVja2V0SWQiLCJpbml0QnVja2V0IiwiY3VycmVudFF1ZXN0aW9uIiwidXBkYXRlQ3VycmVudEJ1Y2tldFZhbHVlc0FmdGVyQW5zd2VyaW5nIiwidXBkYXRlRmVlZGJhY2tBZnRlckFuc3dlciIsInF1ZXN0aW9uRW5kVGltZW91dCIsImVuZE9wZXJhdGlvbnMiLCJDaGFuZ2VTdGFySW1hZ2VBZnRlckFuaW1hdGlvbiIsImlzTGluZWFyQXJyYXlFeGhhdXN0ZWQiLCJ0YXJnZXRJdGVtIiwic2VsZWN0VGFyZ2V0SXRlbSIsImZvaWxzIiwiZ2VuZXJhdGVGb2lscyIsImFuc3dlck9wdGlvbnMiLCJzaHVmZmxlQW5zd2VyT3B0aW9ucyIsImNyZWF0ZVF1ZXN0aW9uIiwicXVlc3Rpb25OdW1iZXIiLCJzZWxlY3RSYW5kb21VbnVzZWRJdGVtIiwiZm9pbDEiLCJmb2lsMiIsImZvaWwzIiwiZ2VuZXJhdGVSYW5kb21Gb2lsIiwiZ2VuZXJhdGVMaW5lYXJGb2lsIiwiZXhpc3RpbmdGb2lscyIsImZvaWwiLCJpdGVtVGV4dCIsIm9wdGlvbiIsInRyeU1vdmVCdWNrZXRSYW5kb21CU1QiLCJ0cnlNb3ZlQnVja2V0TGluZWFyQXJyYXlCYXNlZCIsInNlbmRCdWNrZXQiLCJQcmVsb2FkQnVja2V0IiwiaGFzTGluZWFyUXVlc3Rpb25zTGVmdCIsImhhbmRsZVBhc3NlZEJ1Y2tldCIsImhhbmRsZUZhaWxlZEJ1Y2tldCIsInBhc3NIaWdoZXN0QnVja2V0IiwibW92ZVVwVG9OZXh0QnVja2V0IiwiZmFpbExvd2VzdEJ1Y2tldCIsIm1vdmVEb3duVG9QcmV2aW91c0J1Y2tldCIsIlByb2dyZXNzQ2hlc3QiLCJzZXR1cFVJSGFuZGxlcnMiLCJhcHBsaW5rIiwic2VuZEZpbmlzaGVkIiwiVW5pdHlCcmlkZ2UiLCJVbml0eSIsInVuaXR5UmVmZXJlbmNlIiwiU2VuZE1lc3NhZ2UiLCJuIiwidCIsInIiLCJNZXNzYWdlQ2hhbm5lbCIsInBvcnQxIiwicG9ydDIiLCJTeW1ib2wiLCJpdGVyYXRvciIsIm5leHQiLCJiaW5kIiwibyIsIlVSTCIsImYiLCJzIiwidiIsIm5uIiwidG4iLCJybiIsImVuIiwib24iLCJ1biIsImFuIiwiY24iLCJpbnN0YWxsaW5nIiwic2NyaXB0VVJMIiwic24iLCJwZXJmb3JtYW5jZSIsInZuIiwiaG4iLCJsbiIsInN0YXRlIiwic3ciLCJpc0V4dGVybmFsIiwib3JpZ2luYWxFdmVudCIsIm1uIiwiaXNVcGRhdGUiLCJkaXNwYXRjaEV2ZW50Iiwid24iLCJ3YWl0aW5nIiwiZG4iLCJzZXJ2aWNlV29ya2VyIiwiY29udHJvbGxlciIsImduIiwicG9ydHMiLCJzb3VyY2UiLCJnZXRTVyIsIl9fcHJvdG9fXyIsImwiLCJ3IiwicmVnaXN0ZXIiLCJpbW1lZGlhdGUiLCJyZWFkeVN0YXRlIiwiQm9vbGVhbiIsInluIiwicG4iLCJvbmNlIiwid2FzV2FpdGluZ0JlZm9yZVJlZ2lzdGVyIiwibWVzc2FnZVNXIiwibWVzc2FnZVNraXBXYWl0aW5nIiwiZW51bWVyYWJsZSIsImNvbmZpZ3VyYWJsZSIsIndyaXRhYmxlIiwiZGVmaW5lUHJvcGVydHkiLCJQbiIsIlNuIiwibG9hZGluZ1NjcmVlbiIsInByb2dyZXNzQmFyIiwiaGFuZGxlU2VydmljZVdvcmtlck1lc3NhZ2UiLCJwcm9ncmVzc1ZhbHVlIiwid2lkdGgiLCJTZXRDb250ZW50TG9hZGVkIiwic2V0SXRlbSIsImJvb2tOYW1lIiwiQW5kcm9pZCIsImlzQ29udGVudENhY2hlZCIsImNhY2hlZFN0YXR1cyIsInJlYWRMYW5ndWFnZURhdGFGcm9tQ2FjaGVBbmROb3RpZnlBbmRyb2lkQXBwIiwiaGFuZGxlTG9hZGluZ01lc3NhZ2UiLCJwcm9ncmVzcyIsImhhbmRsZVVwZGF0ZUZvdW5kTWVzc2FnZSIsInRleHQiLCJjb25maXJtIiwicmVsb2FkIiwiY2FjaGVNb2RlbCIsImNvbnRlbnRGaWxlUGF0aCIsImF1ZGlvVmlzdWFsUmVzb3VyY2VzIiwic2V0QXBwTmFtZSIsInNldENvbnRlbnRGaWxlUGF0aCIsInNldEF1ZGlvVmlzdWFsUmVzb3VyY2VzIiwiYWRkSXRlbVRvQXVkaW9WaXN1YWxSZXNvdXJjZXMiLCJmYW5hbHl0aWNzIiwiYW5hbHl0aWNzUHJvdmlkZXIiLCJpbml0aWFsaXplQW5hbHl0aWNzIiwiZ2V0QW5hbHl0aWNzIiwiYXV0aERvbWFpbiIsImRhdGFiYXNlVVJMIiwic3RvcmFnZUJ1Y2tldCIsIm1lc3NhZ2luZ1NlbmRlcklkIiwic3BpblVwIiwiZmV0Y2hBcHBEYXRhIiwiU2V0RmVlZGJhY2tUZXh0IiwiZ2FtZSIsImF1ZGlvSXRlbVVSTCIsIm51dWlkIiwic2V0VXVpZCIsImdldFVzZXJTb3VyY2UiLCJsaW5rQW5hbHl0aWNzIiwic2V0QXNzZXNzbWVudFR5cGUiLCJzZW5kSW5pdCIsInJlZ2lzdGVyU2VydmljZVdvcmtlciIsInJlZ2lzdHJhdGlvbiIsImhhbmRsZVNlcnZpY2VXb3JrZXJSZWdpc3RhdGlvbiIsInJlYWR5IiwiZ2V0VGltZSIsImNhY2hlIiwiYWhlYWRDb250ZW50VmVyc2lvbiIsInJlbW92ZUl0ZW0iLCJjYWNoZXMiLCJhcHBEYXRhIl0sInNvdXJjZVJvb3QiOiIifQ==
