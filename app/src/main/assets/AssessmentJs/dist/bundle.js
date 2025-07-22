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
          ? "animation/SoundButton.gif"
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
      (e.src = "../../AssessmentJs/animation/Star.gif"),
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
      ).src = "../../AssessmentJs/img/star_after_animation.gif";
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
      const i = `./img/chestprogression/TreasureChestOpen0${(n % 4) + 1}.svg`;
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
        l.SetExternalBucketControlsGenerationHandler(
          this.generateDevModeBucketControlsInContainer
        );
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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cWQsWUFBWSxDQUMzQm1KLFFBQVMsUUFDVHB5QixLQUFNLENBQ0ppcUMsUUFBU3BwQyxLQUFLaW5DLGdCQUlsQmpCLEdBQWFwOEIsTUFBTXU4QixNQUFRLE9BQzNCcDhCLFlBQVcsS0FDVGc4QixHQUFlbjhCLE1BQU1tQixRQUFVLE1BQU0sR0FFcEMsT0FHTCxHQUFpQm9kLFVBQWFwSixJQUM1QnhmLFFBQVFDLElBQUl1ZixFQUFNNWYsS0FBS295QixRQUFVLGtDQUNQLGFBQXRCeFMsRUFBTTVmLEtBQUtveUIsU0FBMkUsTUFBakRyb0IsYUFBYUMsUUFBUW5KLEtBQUtpbkMsV0FBV3BsQixVQUM1RSxHQUFpQnVHLFlBQVksQ0FDM0JtSixRQUFTLFFBQ1RweUIsS0FBTSxDQUNKaXFDLFFBQVNwcEMsS0FBS2luQyxnQkFNdEIxbkMsUUFBUTBFLEtBQUsscURBRWpCLElBRUE0a0MsK0JBQStCRCxTQUM3QixJQUMwQixRQUF4QixFQUFBQSxhQUFZLEVBQVpBLEVBQWN2RixrQkFBVSxTQUFFamIsWUFBWSxDQUNwQ25TLEtBQU0sZUFDTnBJLE1BQU83TixLQUFLNDBCLE9BRWQsTUFBTzdELEdBQ1B4eEIsUUFBUUMsSUFBSSx1Q0FBeUN1eEIsR0FFekQsQ0FFT21MLGFBQ0wsT0FBT2w4QixLQUFLZ0IsT0FDZCxHQWtERjJmLEdBQUlxbkIiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9hc3Nlc3NtZW50LXN1cnZleS1qcy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9hc3Nlc3NtZW50LXN1cnZleS1qcy8uL3NyYy91dGlscy91cmxVdGlscy50cyIsIndlYnBhY2s6Ly9hc3Nlc3NtZW50LXN1cnZleS1qcy93ZWJwYWNrL3J1bnRpbWUvZ2xvYmFsIiwid2VicGFjazovL2Fzc2Vzc21lbnQtc3VydmV5LWpzLy4vc3JjL3V0aWxzL2pzb25VdGlscy50cyIsIndlYnBhY2s6Ly9hc3Nlc3NtZW50LXN1cnZleS1qcy8uL3NyYy9jb21wb25lbnRzL2F1ZGlvQ29udHJvbGxlci50cyIsIndlYnBhY2s6Ly9hc3Nlc3NtZW50LXN1cnZleS1qcy8uL3NyYy91dGlscy9tYXRoVXRpbHMudHMiLCJ3ZWJwYWNrOi8vYXNzZXNzbWVudC1zdXJ2ZXktanMvLi9zcmMvdWkvdWlDb250cm9sbGVyLnRzIiwid2VicGFjazovL2Fzc2Vzc21lbnQtc3VydmV5LWpzLy4vbm9kZV9tb2R1bGVzL0BmaXJlYmFzZS91dGlsL2Rpc3QvaW5kZXguZXNtMjAxNy5qcyIsIndlYnBhY2s6Ly9hc3Nlc3NtZW50LXN1cnZleS1qcy8uL25vZGVfbW9kdWxlcy9AZmlyZWJhc2UvY29tcG9uZW50L2Rpc3QvZXNtL2luZGV4LmVzbTIwMTcuanMiLCJ3ZWJwYWNrOi8vYXNzZXNzbWVudC1zdXJ2ZXktanMvLi9ub2RlX21vZHVsZXMvQGZpcmViYXNlL2xvZ2dlci9kaXN0L2VzbS9pbmRleC5lc20yMDE3LmpzIiwid2VicGFjazovL2Fzc2Vzc21lbnQtc3VydmV5LWpzLy4vbm9kZV9tb2R1bGVzL2lkYi9idWlsZC93cmFwLWlkYi12YWx1ZS5qcyIsIndlYnBhY2s6Ly9hc3Nlc3NtZW50LXN1cnZleS1qcy8uL25vZGVfbW9kdWxlcy9pZGIvYnVpbGQvaW5kZXguanMiLCJ3ZWJwYWNrOi8vYXNzZXNzbWVudC1zdXJ2ZXktanMvLi9ub2RlX21vZHVsZXMvQGZpcmViYXNlL2FwcC9kaXN0L2VzbS9pbmRleC5lc20yMDE3LmpzIiwid2VicGFjazovL2Fzc2Vzc21lbnQtc3VydmV5LWpzLy4vbm9kZV9tb2R1bGVzL0BmaXJlYmFzZS9pbnN0YWxsYXRpb25zL2Rpc3QvZXNtL2luZGV4LmVzbTIwMTcuanMiLCJ3ZWJwYWNrOi8vYXNzZXNzbWVudC1zdXJ2ZXktanMvLi9ub2RlX21vZHVsZXMvQGZpcmViYXNlL2FuYWx5dGljcy9kaXN0L2VzbS9pbmRleC5lc20yMDE3LmpzIiwid2VicGFjazovL2Fzc2Vzc21lbnQtc3VydmV5LWpzLy4vc3JjL2FuYWx5dGljcy9hbmFseXRpY3NFdmVudHMudHMiLCJ3ZWJwYWNrOi8vYXNzZXNzbWVudC1zdXJ2ZXktanMvLi9zcmMvYmFzZVF1aXoudHMiLCJ3ZWJwYWNrOi8vYXNzZXNzbWVudC1zdXJ2ZXktanMvLi9zcmMvc3VydmV5L3N1cnZleS50cyIsIndlYnBhY2s6Ly9hc3Nlc3NtZW50LXN1cnZleS1qcy8uL3NyYy9jb21wb25lbnRzL3ROb2RlLnRzIiwid2VicGFjazovL2Fzc2Vzc21lbnQtc3VydmV5LWpzLy4vc3JjL2Fzc2Vzc21lbnQvYXNzZXNzbWVudC50cyIsIndlYnBhY2s6Ly9hc3Nlc3NtZW50LXN1cnZleS1qcy8uL3NyYy91dGlscy91bml0eUJyaWRnZS50cyIsIndlYnBhY2s6Ly9hc3Nlc3NtZW50LXN1cnZleS1qcy8uL25vZGVfbW9kdWxlcy9maXJlYmFzZS9hcHAvZGlzdC9pbmRleC5lc20uanMiLCJ3ZWJwYWNrOi8vYXNzZXNzbWVudC1zdXJ2ZXktanMvLi9ub2RlX21vZHVsZXMvd29ya2JveC13aW5kb3cvYnVpbGQvd29ya2JveC13aW5kb3cucHJvZC5lczUubWpzIiwid2VicGFjazovL2Fzc2Vzc21lbnQtc3VydmV5LWpzLy4vc3JjL0FwcC50cyIsIndlYnBhY2s6Ly9hc3Nlc3NtZW50LXN1cnZleS1qcy8uL3NyYy9jb21wb25lbnRzL2NhY2hlTW9kZWwudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gVGhlIHJlcXVpcmUgc2NvcGVcbnZhciBfX3dlYnBhY2tfcmVxdWlyZV9fID0ge307XG5cbiIsIi8qKlxuICogQ29udGFpbnMgdXRpbHMgZm9yIHdvcmtpbmcgd2l0aCBVUkwgc3RyaW5ncy5cbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QXBwVHlwZSgpOiBzdHJpbmcge1xuICBjb25zdCBwYXRoUGFyYW1zID0gZ2V0UGF0aE5hbWUoKTtcbiAgY29uc3QgYXBwVHlwZSA9IHBhdGhQYXJhbXMuZ2V0KCdhcHBUeXBlJyk7XG4gIHJldHVybiBhcHBUeXBlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VVVJRCgpOiBzdHJpbmcge1xuICBjb25zdCBwYXRoUGFyYW1zID0gZ2V0UGF0aE5hbWUoKTtcbiAgdmFyIG51dWlkID0gcGF0aFBhcmFtcy5nZXQoJ2NyX3VzZXJfaWQnKTtcbiAgaWYgKG51dWlkID09IHVuZGVmaW5lZCkge1xuICAgIGNvbnNvbGUubG9nKCdubyB1dWlkIHByb3ZpZGVkJyk7XG4gICAgbnV1aWQgPSAnV2ViVXNlck5vSUQnO1xuICB9XG4gIHJldHVybiBudXVpZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFVzZXJTb3VyY2UoKTogc3RyaW5nIHtcbiAgY29uc3QgcGF0aFBhcmFtcyA9IGdldFBhdGhOYW1lKCk7XG4gIHZhciBudXVpZCA9IHBhdGhQYXJhbXMuZ2V0KCd1c2VyU291cmNlJyk7XG4gIGlmIChudXVpZCA9PSB1bmRlZmluZWQpIHtcbiAgICBjb25zb2xlLmxvZygnbm8gdXNlciBzb3VyY2UgcHJvdmlkZWQnKTtcbiAgICBudXVpZCA9ICdXZWJVc2VyTm9Tb3VyY2UnO1xuICB9XG4gIHJldHVybiBudXVpZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldERhdGFGaWxlKCk6IHN0cmluZyB7XG4gIGNvbnN0IHBhdGhQYXJhbXMgPSBnZXRQYXRoTmFtZSgpO1xuICB2YXIgZGF0YSA9IHBhdGhQYXJhbXMuZ2V0KCdkYXRhJyk7XG4gIGlmIChkYXRhID09IHVuZGVmaW5lZCkge1xuICAgIGNvbnNvbGUubG9nKCdkZWZhdWx0IGRhdGEgZmlsZScpO1xuICAgIGRhdGEgPSAnenVsdS1sZXR0ZXJzb3VuZHMnO1xuICAgIC8vZGF0YSA9IFwic3VydmV5LXp1bHVcIjtcbiAgfVxuICByZXR1cm4gZGF0YTtcbn1cblxuZnVuY3Rpb24gZ2V0UGF0aE5hbWUoKSB7XG4gIGNvbnN0IHF1ZXJ5U3RyaW5nID0gd2luZG93LmxvY2F0aW9uLnNlYXJjaDtcbiAgY29uc3QgdXJsUGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyhxdWVyeVN0cmluZyk7XG4gIHJldHVybiB1cmxQYXJhbXM7XG59XG4iLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmcgPSAoZnVuY3Rpb24oKSB7XG5cdGlmICh0eXBlb2YgZ2xvYmFsVGhpcyA9PT0gJ29iamVjdCcpIHJldHVybiBnbG9iYWxUaGlzO1xuXHR0cnkge1xuXHRcdHJldHVybiB0aGlzIHx8IG5ldyBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0aWYgKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnKSByZXR1cm4gd2luZG93O1xuXHR9XG59KSgpOyIsIi8qKiBKc29uIFV0aWxzICovXG5cbi8vIGltcG9ydCB7IHNldEZlZWRiYWNrVGV4dCB9IGZyb20gJy4vdWlDb250cm9sbGVyJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZldGNoQXBwRGF0YSh1cmw6IHN0cmluZykge1xuICByZXR1cm4gbG9hZERhdGEodXJsKS50aGVuKChkYXRhKSA9PiB7XG4gICAgcmV0dXJuIGRhdGE7XG4gIH0pO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmV0Y2hBcHBUeXBlKHVybDogc3RyaW5nKSB7XG4gIHJldHVybiBsb2FkRGF0YSh1cmwpLnRoZW4oKGRhdGEpID0+IHtcbiAgICAvLyBzZXRGZWVkYmFja1RleHQoZGF0YVtcImZlZWRiYWNrVGV4dFwiXSk7XG4gICAgcmV0dXJuIGRhdGFbJ2FwcFR5cGUnXTtcbiAgfSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmZXRjaEZlZWRiYWNrKHVybDogc3RyaW5nKSB7XG4gIHJldHVybiBsb2FkRGF0YSh1cmwpLnRoZW4oKGRhdGEpID0+IHtcbiAgICByZXR1cm4gZGF0YVsnZmVlZGJhY2tUZXh0J107XG4gIH0pO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmV0Y2hTdXJ2ZXlRdWVzdGlvbnModXJsOiBzdHJpbmcpIHtcbiAgcmV0dXJuIGxvYWREYXRhKHVybCkudGhlbigoZGF0YSkgPT4ge1xuICAgIHJldHVybiBkYXRhWydxdWVzdGlvbnMnXTtcbiAgfSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmZXRjaEFzc2Vzc21lbnRCdWNrZXRzKHVybDogc3RyaW5nKSB7XG4gIHJldHVybiBsb2FkRGF0YSh1cmwpLnRoZW4oKGRhdGEpID0+IHtcbiAgICByZXR1cm4gZGF0YVsnYnVja2V0cyddO1xuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldERhdGFVUkwodXJsOiBzdHJpbmcpIHtcbiAgcmV0dXJuICcvZGF0YS8nICsgdXJsICsgJy5qc29uJztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENhc2VJbmRlcGVuZGVudExhbmdMaXN0KCkge1xuICByZXR1cm4gWydsdWdhbmRhJ107XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGxvYWREYXRhKHVybDogc3RyaW5nKSB7XG4gIHZhciBmdXJsID0gZ2V0RGF0YVVSTCh1cmwpO1xuICAvLyBjb25zb2xlLmxvZyhmdXJsKTtcbiAgcmV0dXJuIGZldGNoKGZ1cmwpLnRoZW4oKHJlc3BvbnNlKSA9PiByZXNwb25zZS5qc29uKCkpO1xufVxuIiwiLy9jb2RlIGZvciBsb2FkaW5nIGF1ZGlvc1xuXG5pbXBvcnQgeyBxRGF0YSB9IGZyb20gJy4vcXVlc3Rpb25EYXRhJztcbmltcG9ydCB7IGJ1Y2tldCwgYnVja2V0SXRlbSB9IGZyb20gJy4uL2Fzc2Vzc21lbnQvYnVja2V0RGF0YSc7XG5pbXBvcnQgeyBnZXRDYXNlSW5kZXBlbmRlbnRMYW5nTGlzdCB9IGZyb20gJy4uL3V0aWxzL2pzb25VdGlscyc7XG5cbmV4cG9ydCBjbGFzcyBBdWRpb0NvbnRyb2xsZXIge1xuICBwcml2YXRlIHN0YXRpYyBpbnN0YW5jZTogQXVkaW9Db250cm9sbGVyIHwgbnVsbCA9IG51bGw7XG5cbiAgcHVibGljIGltYWdlVG9DYWNoZTogc3RyaW5nW10gPSBbXTtcbiAgcHVibGljIHdhdlRvQ2FjaGU6IHN0cmluZ1tdID0gW107XG5cbiAgcHVibGljIGFsbEF1ZGlvczogYW55ID0ge307XG4gIHB1YmxpYyBhbGxJbWFnZXM6IGFueSA9IHt9O1xuICBwdWJsaWMgZGF0YVVSTDogc3RyaW5nID0gJyc7XG5cbiAgcHJpdmF0ZSBjb3JyZWN0U291bmRQYXRoID0gJ2Rpc3QvYXVkaW8vQ29ycmVjdC53YXYnO1xuXG4gIHByaXZhdGUgZmVlZGJhY2tBdWRpbzogYW55ID0gbnVsbDtcbiAgcHJpdmF0ZSBjb3JyZWN0QXVkaW86IGFueSA9IG51bGw7XG5cbiAgcHJpdmF0ZSBpbml0KCk6IHZvaWQge1xuICAgIHRoaXMuZmVlZGJhY2tBdWRpbyA9IG5ldyBBdWRpbygpO1xuICAgIHRoaXMuZmVlZGJhY2tBdWRpby5zcmMgPSB0aGlzLmNvcnJlY3RTb3VuZFBhdGg7XG4gICAgdGhpcy5jb3JyZWN0QXVkaW8gPSBuZXcgQXVkaW8oKTtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgUHJlcGFyZUF1ZGlvQW5kSW1hZ2VzRm9yU3VydmV5KHF1ZXN0aW9uc0RhdGE6IHFEYXRhW10sIGRhdGFVUkw6IHN0cmluZyk6IHZvaWQge1xuICAgIEF1ZGlvQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLmRhdGFVUkwgPSBkYXRhVVJMO1xuICAgIGNvbnN0IGZlZWRiYWNrU291bmRQYXRoID0gJ2F1ZGlvLycgKyBBdWRpb0NvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5kYXRhVVJMICsgJy9hbnN3ZXJfZmVlZGJhY2subXAzJztcblxuICAgIEF1ZGlvQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLndhdlRvQ2FjaGUucHVzaChmZWVkYmFja1NvdW5kUGF0aCk7XG4gICAgQXVkaW9Db250cm9sbGVyLmdldEluc3RhbmNlKCkuY29ycmVjdEF1ZGlvLnNyYyA9IGZlZWRiYWNrU291bmRQYXRoO1xuXG4gICAgZm9yICh2YXIgcXVlc3Rpb25JbmRleCBpbiBxdWVzdGlvbnNEYXRhKSB7XG4gICAgICBsZXQgcXVlc3Rpb25EYXRhID0gcXVlc3Rpb25zRGF0YVtxdWVzdGlvbkluZGV4XTtcbiAgICAgIGlmIChxdWVzdGlvbkRhdGEucHJvbXB0QXVkaW8gIT0gbnVsbCkge1xuICAgICAgICBBdWRpb0NvbnRyb2xsZXIuRmlsdGVyQW5kQWRkQXVkaW9Ub0FsbEF1ZGlvcyhxdWVzdGlvbkRhdGEucHJvbXB0QXVkaW8udG9Mb3dlckNhc2UoKSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChxdWVzdGlvbkRhdGEucHJvbXB0SW1nICE9IG51bGwpIHtcbiAgICAgICAgQXVkaW9Db250cm9sbGVyLkFkZEltYWdlVG9BbGxJbWFnZXMocXVlc3Rpb25EYXRhLnByb21wdEltZyk7XG4gICAgICB9XG5cbiAgICAgIGZvciAodmFyIGFuc3dlckluZGV4IGluIHF1ZXN0aW9uRGF0YS5hbnN3ZXJzKSB7XG4gICAgICAgIGxldCBhbnN3ZXJEYXRhID0gcXVlc3Rpb25EYXRhLmFuc3dlcnNbYW5zd2VySW5kZXhdO1xuICAgICAgICBpZiAoYW5zd2VyRGF0YS5hbnN3ZXJJbWcgIT0gbnVsbCkge1xuICAgICAgICAgIEF1ZGlvQ29udHJvbGxlci5BZGRJbWFnZVRvQWxsSW1hZ2VzKGFuc3dlckRhdGEuYW5zd2VySW1nKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBjb25zb2xlLmxvZyhBdWRpb0NvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5hbGxBdWRpb3MpO1xuICAgIGNvbnNvbGUubG9nKEF1ZGlvQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLmFsbEltYWdlcyk7XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIEFkZEltYWdlVG9BbGxJbWFnZXMobmV3SW1hZ2VVUkw6IHN0cmluZyk6IHZvaWQge1xuICAgIGNvbnNvbGUubG9nKCdBZGQgaW1hZ2U6ICcgKyBuZXdJbWFnZVVSTCk7XG4gICAgbGV0IG5ld0ltYWdlID0gbmV3IEltYWdlKCk7XG4gICAgbmV3SW1hZ2Uuc3JjID0gbmV3SW1hZ2VVUkw7XG4gICAgQXVkaW9Db250cm9sbGVyLmdldEluc3RhbmNlKCkuYWxsSW1hZ2VzW25ld0ltYWdlVVJMXSA9IG5ld0ltYWdlO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBGaWx0ZXJBbmRBZGRBdWRpb1RvQWxsQXVkaW9zKG5ld0F1ZGlvVVJMOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBjb25zb2xlLmxvZygnQWRkaW5nIGF1ZGlvOiAnICsgbmV3QXVkaW9VUkwpO1xuICAgIGlmIChuZXdBdWRpb1VSTC5pbmNsdWRlcygnLndhdicpKSB7XG4gICAgICBuZXdBdWRpb1VSTCA9IG5ld0F1ZGlvVVJMLnJlcGxhY2UoJy53YXYnLCAnLm1wMycpO1xuICAgIH0gZWxzZSBpZiAobmV3QXVkaW9VUkwuaW5jbHVkZXMoJy5tcDMnKSkge1xuICAgICAgLy8gQWxyZWFkeSBjb250YWlucyAubXAzIG5vdCBkb2luZyBhbnl0aGluZ1xuICAgIH0gZWxzZSB7XG4gICAgICBuZXdBdWRpb1VSTCA9IG5ld0F1ZGlvVVJMLnRyaW0oKSArICcubXAzJztcbiAgICB9XG5cbiAgICBjb25zb2xlLmxvZygnRmlsdGVyZWQ6ICcgKyBuZXdBdWRpb1VSTCk7XG5cbiAgICBsZXQgbmV3QXVkaW8gPSBuZXcgQXVkaW8oKTtcbiAgICBpZiAoZ2V0Q2FzZUluZGVwZW5kZW50TGFuZ0xpc3QoKS5pbmNsdWRlcyhBdWRpb0NvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5kYXRhVVJMLnNwbGl0KCctJylbMF0pKSB7XG4gICAgICBuZXdBdWRpby5zcmMgPSAnYXVkaW8vJyArIEF1ZGlvQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLmRhdGFVUkwgKyAnLycgKyBuZXdBdWRpb1VSTDtcbiAgICB9IGVsc2Uge1xuICAgICAgbmV3QXVkaW8uc3JjID0gJ2F1ZGlvLycgKyBBdWRpb0NvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5kYXRhVVJMICsgJy8nICsgbmV3QXVkaW9VUkw7XG4gICAgfVxuXG4gICAgQXVkaW9Db250cm9sbGVyLmdldEluc3RhbmNlKCkuYWxsQXVkaW9zW25ld0F1ZGlvVVJMXSA9IG5ld0F1ZGlvO1xuXG4gICAgY29uc29sZS5sb2cobmV3QXVkaW8uc3JjKTtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgUHJlbG9hZEJ1Y2tldChuZXdCdWNrZXQ6IGJ1Y2tldCwgZGF0YVVSTCkge1xuICAgIEF1ZGlvQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLmRhdGFVUkwgPSBkYXRhVVJMO1xuICAgIEF1ZGlvQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLmNvcnJlY3RBdWRpby5zcmMgPVxuICAgICAgJ2F1ZGlvLycgKyBBdWRpb0NvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5kYXRhVVJMICsgJy9hbnN3ZXJfZmVlZGJhY2subXAzJztcbiAgICBmb3IgKHZhciBpdGVtSW5kZXggaW4gbmV3QnVja2V0Lml0ZW1zKSB7XG4gICAgICB2YXIgaXRlbSA9IG5ld0J1Y2tldC5pdGVtc1tpdGVtSW5kZXhdO1xuICAgICAgQXVkaW9Db250cm9sbGVyLkZpbHRlckFuZEFkZEF1ZGlvVG9BbGxBdWRpb3MoaXRlbS5pdGVtTmFtZS50b0xvd2VyQ2FzZSgpKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIFBsYXlBdWRpbyhhdWRpb05hbWU6IHN0cmluZywgZmluaXNoZWRDYWxsYmFjaz86IEZ1bmN0aW9uLCBhdWRpb0FuaW0/OiBGdW5jdGlvbik6IHZvaWQge1xuICAgIGF1ZGlvTmFtZSA9IGF1ZGlvTmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgIGNvbnNvbGUubG9nKCd0cnlpbmcgdG8gcGxheSAnICsgYXVkaW9OYW1lKTtcbiAgICBpZiAoYXVkaW9OYW1lLmluY2x1ZGVzKCcubXAzJykpIHtcbiAgICAgIGlmIChhdWRpb05hbWUuc2xpY2UoLTQpICE9ICcubXAzJykge1xuICAgICAgICBhdWRpb05hbWUgPSBhdWRpb05hbWUudHJpbSgpICsgJy5tcDMnO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBhdWRpb05hbWUgPSBhdWRpb05hbWUudHJpbSgpICsgJy5tcDMnO1xuICAgIH1cblxuICAgIGNvbnNvbGUubG9nKCdQcmUgcGxheSBhbGwgYXVkaW9zOiAnKTtcbiAgICBjb25zb2xlLmxvZyhBdWRpb0NvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5hbGxBdWRpb3MpO1xuXG4gICAgY29uc3QgcGxheVByb21pc2UgPSBuZXcgUHJvbWlzZTx2b2lkPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCBhdWRpbyA9IEF1ZGlvQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLmFsbEF1ZGlvc1thdWRpb05hbWVdO1xuICAgICAgaWYgKGF1ZGlvKSB7XG4gICAgICAgIGF1ZGlvLmFkZEV2ZW50TGlzdGVuZXIoJ3BsYXknLCAoKSA9PiB7XG4gICAgICAgICAgdHlwZW9mIGF1ZGlvQW5pbSAhPT0gJ3VuZGVmaW5lZCcgPyBhdWRpb0FuaW0odHJ1ZSkgOiBudWxsO1xuICAgICAgICB9KTtcblxuICAgICAgICBhdWRpby5hZGRFdmVudExpc3RlbmVyKCdlbmRlZCcsICgpID0+IHtcbiAgICAgICAgICB0eXBlb2YgYXVkaW9BbmltICE9PSAndW5kZWZpbmVkJyA/IGF1ZGlvQW5pbShmYWxzZSkgOiBudWxsO1xuICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgYXVkaW8ucGxheSgpLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIHBsYXlpbmcgYXVkaW86JywgZXJyb3IpO1xuICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLndhcm4oJ0F1ZGlvIGZpbGUgbm90IGZvdW5kOicsIGF1ZGlvTmFtZSk7XG4gICAgICAgIHJlc29sdmUoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHBsYXlQcm9taXNlXG4gICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgIHR5cGVvZiBmaW5pc2hlZENhbGxiYWNrICE9PSAndW5kZWZpbmVkJyA/IGZpbmlzaGVkQ2FsbGJhY2soKSA6IG51bGw7XG4gICAgICB9KVxuICAgICAgLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdQcm9taXNlIGVycm9yOicsIGVycm9yKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBHZXRJbWFnZShpbWFnZU5hbWU6IHN0cmluZyk6IGFueSB7XG4gICAgcmV0dXJuIEF1ZGlvQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLmFsbEltYWdlc1tpbWFnZU5hbWVdO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBQbGF5RGluZygpOiB2b2lkIHtcbiAgICBBdWRpb0NvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5mZWVkYmFja0F1ZGlvLnBsYXkoKTtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgUGxheUNvcnJlY3QoKTogdm9pZCB7XG4gICAgQXVkaW9Db250cm9sbGVyLmdldEluc3RhbmNlKCkuY29ycmVjdEF1ZGlvLnBsYXkoKTtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgZ2V0SW5zdGFuY2UoKTogQXVkaW9Db250cm9sbGVyIHtcbiAgICBpZiAoQXVkaW9Db250cm9sbGVyLmluc3RhbmNlID09IG51bGwpIHtcbiAgICAgIEF1ZGlvQ29udHJvbGxlci5pbnN0YW5jZSA9IG5ldyBBdWRpb0NvbnRyb2xsZXIoKTtcbiAgICAgIEF1ZGlvQ29udHJvbGxlci5pbnN0YW5jZS5pbml0KCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIEF1ZGlvQ29udHJvbGxlci5pbnN0YW5jZTtcbiAgfVxufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIHJhbmRGcm9tKGFycmF5KSB7XG4gIHJldHVybiBhcnJheVtNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBhcnJheS5sZW5ndGgpXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNodWZmbGVBcnJheShhcnJheSkge1xuICBmb3IgKGxldCBpID0gYXJyYXkubGVuZ3RoIC0gMTsgaSA+IDA7IGktLSkge1xuICAgIGNvbnN0IGogPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoaSArIDEpKTtcbiAgICBbYXJyYXlbaV0sIGFycmF5W2pdXSA9IFthcnJheVtqXSwgYXJyYXlbaV1dO1xuICB9XG59XG4iLCJpbXBvcnQgeyBxRGF0YSwgYW5zd2VyRGF0YSB9IGZyb20gJy4uL2NvbXBvbmVudHMvcXVlc3Rpb25EYXRhJztcbmltcG9ydCB7IEF1ZGlvQ29udHJvbGxlciB9IGZyb20gJy4uL2NvbXBvbmVudHMvYXVkaW9Db250cm9sbGVyJztcbmltcG9ydCB7IHJhbmRGcm9tLCBzaHVmZmxlQXJyYXkgfSBmcm9tICcuLi91dGlscy9tYXRoVXRpbHMnO1xuaW1wb3J0IHsgZ2V0RGF0YUZpbGUgfSBmcm9tICcuLi91dGlscy91cmxVdGlscyc7XG5cbmV4cG9ydCBjbGFzcyBVSUNvbnRyb2xsZXIge1xuICBwcml2YXRlIHN0YXRpYyBpbnN0YW5jZTogVUlDb250cm9sbGVyIHwgbnVsbCA9IG51bGw7XG5cbiAgcHJpdmF0ZSBsYW5kaW5nQ29udGFpbmVySWQgPSAnbGFuZFdyYXAnO1xuICBwdWJsaWMgbGFuZGluZ0NvbnRhaW5lcjogSFRNTEVsZW1lbnQ7XG5cbiAgcHJpdmF0ZSBnYW1lQ29udGFpbmVySWQgPSAnZ2FtZVdyYXAnO1xuICBwdWJsaWMgZ2FtZUNvbnRhaW5lcjogSFRNTEVsZW1lbnQ7XG5cbiAgcHJpdmF0ZSBlbmRDb250YWluZXJJZCA9ICdlbmRXcmFwJztcbiAgcHVibGljIGVuZENvbnRhaW5lcjogSFRNTEVsZW1lbnQ7XG5cbiAgcHJpdmF0ZSBzdGFyQ29udGFpbmVySWQgPSAnc3RhcldyYXBwZXInO1xuICBwdWJsaWMgc3RhckNvbnRhaW5lcjogSFRNTEVsZW1lbnQ7XG5cbiAgcHJpdmF0ZSBjaGVzdENvbnRhaW5lcklkID0gJ2NoZXN0V3JhcHBlcic7XG4gIHB1YmxpYyBjaGVzdENvbnRhaW5lcjogSFRNTEVsZW1lbnQ7XG5cbiAgcHJpdmF0ZSBxdWVzdGlvbnNDb250YWluZXJJZCA9ICdxV3JhcCc7XG4gIHB1YmxpYyBxdWVzdGlvbnNDb250YWluZXI6IEhUTUxFbGVtZW50O1xuXG4gIHByaXZhdGUgZmVlZGJhY2tDb250YWluZXJJZCA9ICdmZWVkYmFja1dyYXAnO1xuICBwdWJsaWMgZmVlZGJhY2tDb250YWluZXI6IEhUTUxFbGVtZW50O1xuXG4gIHByaXZhdGUgYW5zd2Vyc0NvbnRhaW5lcklkID0gJ2FXcmFwJztcbiAgcHVibGljIGFuc3dlcnNDb250YWluZXI6IEhUTUxFbGVtZW50O1xuXG4gIHByaXZhdGUgYW5zd2VyQnV0dG9uMUlkID0gJ2Fuc3dlckJ1dHRvbjEnO1xuICBwcml2YXRlIGFuc3dlckJ1dHRvbjE6IEhUTUxFbGVtZW50O1xuICBwcml2YXRlIGFuc3dlckJ1dHRvbjJJZCA9ICdhbnN3ZXJCdXR0b24yJztcbiAgcHJpdmF0ZSBhbnN3ZXJCdXR0b24yOiBIVE1MRWxlbWVudDtcbiAgcHJpdmF0ZSBhbnN3ZXJCdXR0b24zSWQgPSAnYW5zd2VyQnV0dG9uMyc7XG4gIHByaXZhdGUgYW5zd2VyQnV0dG9uMzogSFRNTEVsZW1lbnQ7XG4gIHByaXZhdGUgYW5zd2VyQnV0dG9uNElkID0gJ2Fuc3dlckJ1dHRvbjQnO1xuICBwcml2YXRlIGFuc3dlckJ1dHRvbjQ6IEhUTUxFbGVtZW50O1xuICBwcml2YXRlIGFuc3dlckJ1dHRvbjVJZCA9ICdhbnN3ZXJCdXR0b241JztcbiAgcHJpdmF0ZSBhbnN3ZXJCdXR0b241OiBIVE1MRWxlbWVudDtcbiAgcHJpdmF0ZSBhbnN3ZXJCdXR0b242SWQgPSAnYW5zd2VyQnV0dG9uNic7XG4gIHByaXZhdGUgYW5zd2VyQnV0dG9uNjogSFRNTEVsZW1lbnQ7XG5cbiAgcHJpdmF0ZSBwbGF5QnV0dG9uSWQgPSAncGJ1dHRvbic7XG4gIHByaXZhdGUgcGxheUJ1dHRvbjogSFRNTEVsZW1lbnQ7XG5cbiAgcHJpdmF0ZSBjaGVzdEltZ0lkID0gJ2NoZXN0SW1hZ2UnO1xuICBwcml2YXRlIGNoZXN0SW1nOiBIVE1MRWxlbWVudDtcblxuICBwdWJsaWMgbmV4dFF1ZXN0aW9uID0gbnVsbDtcblxuICBwdWJsaWMgY29udGVudExvYWRlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIHB1YmxpYyBxU3RhcnQ7XG4gIHB1YmxpYyBzaG93biA9IGZhbHNlO1xuXG4gIHB1YmxpYyBzdGFycyA9IFtdO1xuICBwdWJsaWMgc2hvd25TdGFyc0NvdW50ID0gMDtcbiAgcHVibGljIHN0YXJQb3NpdGlvbnM6IEFycmF5PHsgeDogbnVtYmVyOyB5OiBudW1iZXIgfT4gPSBBcnJheTx7XG4gICAgeDogbnVtYmVyO1xuICAgIHk6IG51bWJlcjtcbiAgfT4oKTtcbiAgcHVibGljIHFBbnNOdW0gPSAwO1xuXG4gIHB1YmxpYyBhbGxTdGFydDogbnVtYmVyO1xuXG4gIHB1YmxpYyBidXR0b25zID0gW107XG5cbiAgcHJpdmF0ZSBidXR0b25QcmVzc0NhbGxiYWNrOiBGdW5jdGlvbjtcbiAgcHJpdmF0ZSBzdGFydFByZXNzQ2FsbGJhY2s6IEZ1bmN0aW9uO1xuXG4gIHB1YmxpYyBidXR0b25zQWN0aXZlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgcHJpdmF0ZSBkZXZNb2RlQ29ycmVjdExhYmVsVmlzaWJpbGl0eTogYm9vbGVhbiA9IGZhbHNlO1xuICBwcml2YXRlIGRldk1vZGVCdWNrZXRDb250cm9sc0VuYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBwdWJsaWMgYW5pbWF0aW9uU3BlZWRNdWx0aXBsaWVyOiBudW1iZXIgPSAxO1xuXG4gIHB1YmxpYyBleHRlcm5hbEJ1Y2tldENvbnRyb2xzR2VuZXJhdGlvbkhhbmRsZXI6IChjb250YWluZXI6IEhUTUxFbGVtZW50LCBjbGlja0NhbGxiYWNrOiAoKSA9PiB2b2lkKSA9PiB2b2lkO1xuXG4gIHByaXZhdGUgaW5pdCgpOiB2b2lkIHtcbiAgICAvLyBJbml0aWFsaXplIHJlcXVpcmVkIGNvbnRhaW5lcnNcbiAgICB0aGlzLmxhbmRpbmdDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmxhbmRpbmdDb250YWluZXJJZCk7XG4gICAgdGhpcy5nYW1lQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5nYW1lQ29udGFpbmVySWQpO1xuICAgIHRoaXMuZW5kQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5lbmRDb250YWluZXJJZCk7XG4gICAgdGhpcy5zdGFyQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5zdGFyQ29udGFpbmVySWQpO1xuICAgIHRoaXMuY2hlc3RDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmNoZXN0Q29udGFpbmVySWQpO1xuICAgIHRoaXMucXVlc3Rpb25zQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5xdWVzdGlvbnNDb250YWluZXJJZCk7XG4gICAgdGhpcy5mZWVkYmFja0NvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuZmVlZGJhY2tDb250YWluZXJJZCk7XG4gICAgdGhpcy5hbnN3ZXJzQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5hbnN3ZXJzQ29udGFpbmVySWQpO1xuXG4gICAgLy8gSW5pdGlhbGl6ZSByZXF1aXJlZCBidXR0b25zXG4gICAgdGhpcy5hbnN3ZXJCdXR0b24xID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5hbnN3ZXJCdXR0b24xSWQpO1xuICAgIHRoaXMuYW5zd2VyQnV0dG9uMiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuYW5zd2VyQnV0dG9uMklkKTtcbiAgICB0aGlzLmFuc3dlckJ1dHRvbjMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmFuc3dlckJ1dHRvbjNJZCk7XG4gICAgdGhpcy5hbnN3ZXJCdXR0b240ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5hbnN3ZXJCdXR0b240SWQpO1xuICAgIHRoaXMuYW5zd2VyQnV0dG9uNSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuYW5zd2VyQnV0dG9uNUlkKTtcbiAgICB0aGlzLmFuc3dlckJ1dHRvbjYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmFuc3dlckJ1dHRvbjZJZCk7XG5cbiAgICB0aGlzLnBsYXlCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLnBsYXlCdXR0b25JZCk7XG5cbiAgICB0aGlzLmNoZXN0SW1nID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5jaGVzdEltZ0lkKTtcblxuICAgIHRoaXMuaW5pdGlhbGl6ZVN0YXJzKCk7XG5cbiAgICB0aGlzLmluaXRFdmVudExpc3RlbmVycygpO1xuICB9XG5cbiAgcHJpdmF0ZSBpbml0aWFsaXplU3RhcnMoKTogdm9pZCB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAyMDsgaSsrKSB7XG4gICAgICBjb25zdCBuZXdTdGFyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG5cbiAgICAgIC8vIG5ld1N0YXIuc3JjID0gXCJpbWcvc3Rhci5wbmdcIjtcbiAgICAgIG5ld1N0YXIuaWQgPSAnc3RhcicgKyBpO1xuXG4gICAgICBuZXdTdGFyLmNsYXNzTGlzdC5hZGQoJ3RvcHN0YXJ2Jyk7XG5cbiAgICAgIHRoaXMuc3RhckNvbnRhaW5lci5hcHBlbmRDaGlsZChuZXdTdGFyKTtcblxuICAgICAgdGhpcy5zdGFyQ29udGFpbmVyLmlubmVySFRNTCArPSAnJztcblxuICAgICAgaWYgKGkgPT0gOSkge1xuICAgICAgICB0aGlzLnN0YXJDb250YWluZXIuaW5uZXJIVE1MICs9ICc8YnI+JztcbiAgICAgIH1cblxuICAgICAgdGhpcy5zdGFycy5wdXNoKGkpO1xuICAgIH1cblxuICAgIHNodWZmbGVBcnJheSh0aGlzLnN0YXJzKTtcbiAgfVxuXG4gIHB1YmxpYyBTZXRBbmltYXRpb25TcGVlZE11bHRpcGxpZXIobXVsdGlwbGllcjogbnVtYmVyKTogdm9pZCB7XG4gICAgVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkuYW5pbWF0aW9uU3BlZWRNdWx0aXBsaWVyID0gbXVsdGlwbGllcjtcbiAgfVxuXG4gIHB1YmxpYyBTZXRDb3JyZWN0TGFiZWxWaXNpYmlsaXR5KHZpc2libGU6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLmRldk1vZGVDb3JyZWN0TGFiZWxWaXNpYmlsaXR5ID0gdmlzaWJsZTtcbiAgICBjb25zb2xlLmxvZygnQ29ycmVjdCBsYWJlbCB2aXNpYmlsaXR5IHNldCB0byAnLCB0aGlzLmRldk1vZGVDb3JyZWN0TGFiZWxWaXNpYmlsaXR5KTtcbiAgfVxuXG4gIHB1YmxpYyBTZXRCdWNrZXRDb250cm9sc1Zpc2liaWxpdHkodmlzaWJsZTogYm9vbGVhbik6IHZvaWQge1xuICAgIGNvbnNvbGUubG9nKCdCdWNrZXQgY29udHJvbHMgdmlzaWJpbGl0eSBzZXQgdG8gJywgdmlzaWJsZSk7XG4gICAgdGhpcy5kZXZNb2RlQnVja2V0Q29udHJvbHNFbmFibGVkID0gdmlzaWJsZTtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgT3ZlcmxhcHBpbmdPdGhlclN0YXJzKFxuICAgIHN0YXJQb3NpdGlvbnM6IEFycmF5PHsgeDogbnVtYmVyOyB5OiBudW1iZXIgfT4sXG4gICAgeDogbnVtYmVyLFxuICAgIHk6IG51bWJlcixcbiAgICBtaW5EaXN0YW5jZTogbnVtYmVyXG4gICk6IGJvb2xlYW4ge1xuICAgIGlmIChzdGFyUG9zaXRpb25zLmxlbmd0aCA8IDEpIHJldHVybiBmYWxzZTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RhclBvc2l0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgZHggPSBzdGFyUG9zaXRpb25zW2ldLnggLSB4O1xuICAgICAgY29uc3QgZHkgPSBzdGFyUG9zaXRpb25zW2ldLnkgLSB5O1xuICAgICAgY29uc3QgZGlzdGFuY2UgPSBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpO1xuICAgICAgaWYgKGRpc3RhbmNlIDwgbWluRGlzdGFuY2UpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHByaXZhdGUgaW5pdEV2ZW50TGlzdGVuZXJzKCk6IHZvaWQge1xuICAgIC8vIFRPRE86IHJlZmFjdG9yIHRoaXNcbiAgICB0aGlzLmFuc3dlckJ1dHRvbjEuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICB0aGlzLmFuc3dlckJ1dHRvblByZXNzKDEpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5idXR0b25zLnB1c2godGhpcy5hbnN3ZXJCdXR0b24xKTtcblxuICAgIHRoaXMuYW5zd2VyQnV0dG9uMi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIHRoaXMuYW5zd2VyQnV0dG9uUHJlc3MoMik7XG4gICAgfSk7XG5cbiAgICB0aGlzLmJ1dHRvbnMucHVzaCh0aGlzLmFuc3dlckJ1dHRvbjIpO1xuXG4gICAgdGhpcy5hbnN3ZXJCdXR0b24zLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgdGhpcy5hbnN3ZXJCdXR0b25QcmVzcygzKTtcbiAgICB9KTtcblxuICAgIHRoaXMuYnV0dG9ucy5wdXNoKHRoaXMuYW5zd2VyQnV0dG9uMyk7XG5cbiAgICB0aGlzLmFuc3dlckJ1dHRvbjQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICB0aGlzLmFuc3dlckJ1dHRvblByZXNzKDQpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5idXR0b25zLnB1c2godGhpcy5hbnN3ZXJCdXR0b240KTtcblxuICAgIHRoaXMuYW5zd2VyQnV0dG9uNS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIHRoaXMuYW5zd2VyQnV0dG9uUHJlc3MoNSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLmJ1dHRvbnMucHVzaCh0aGlzLmFuc3dlckJ1dHRvbjUpO1xuXG4gICAgdGhpcy5hbnN3ZXJCdXR0b242LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgdGhpcy5hbnN3ZXJCdXR0b25QcmVzcyg2KTtcbiAgICB9KTtcblxuICAgIHRoaXMuYnV0dG9ucy5wdXNoKHRoaXMuYW5zd2VyQnV0dG9uNik7XG5cbiAgICB0aGlzLmxhbmRpbmdDb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhcIj4+Pj4+Pj4+Pj4+Pj4+Pj5cIiwgbG9jYWxTdG9yYWdlLmdldEl0ZW0oZ2V0RGF0YUZpbGUoKSksIFwiPj4+Pj4+PlwiLCBVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5jb250ZW50TG9hZGVkKTtcbiAgICAgIGlmIChVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5jb250ZW50TG9hZGVkKSB7XG4gICAgICAgIHRoaXMuc2hvd0dhbWUoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBzaG93T3B0aW9ucygpOiB2b2lkIHtcbiAgICBpZiAoIVVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLnNob3duKSB7XG4gICAgICBjb25zdCBuZXdRID0gVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkubmV4dFF1ZXN0aW9uO1xuICAgICAgY29uc3QgYnV0dG9ucyA9IFVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLmJ1dHRvbnM7XG5cbiAgICAgIGNvbnN0IGFuaW1hdGlvblNwZWVkTXVsdGlwbGllciA9IFVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLmFuaW1hdGlvblNwZWVkTXVsdGlwbGllcjtcblxuICAgICAgbGV0IGFuaW1hdGlvbkR1cmF0aW9uID0gMjIwICogYW5pbWF0aW9uU3BlZWRNdWx0aXBsaWVyO1xuICAgICAgY29uc3QgZGVsYXlCZm9yZU9wdGlvbiA9IDE1MCAqIGFuaW1hdGlvblNwZWVkTXVsdGlwbGllcjtcbiAgICAgIFVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLnNob3duID0gdHJ1ZTtcbiAgICAgIGxldCBvcHRpb25zRGlzcGxheWVkID0gMDtcblxuICAgICAgYnV0dG9ucy5mb3JFYWNoKChidXR0b24pID0+IHtcbiAgICAgICAgYnV0dG9uLnN0eWxlLnZpc2liaWxpdHkgPSAnaGlkZGVuJztcbiAgICAgICAgYnV0dG9uLnN0eWxlLmFuaW1hdGlvbiA9ICcnO1xuICAgICAgICBidXR0b24uaW5uZXJIVE1MID0gJyc7XG4gICAgICB9KTtcblxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbmV3US5hbnN3ZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgY29uc3QgY3VyQW5zd2VyID0gbmV3US5hbnN3ZXJzW2ldO1xuICAgICAgICAgIGNvbnN0IGJ1dHRvbiA9IGJ1dHRvbnNbaV0gYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XG5cbiAgICAgICAgICBjb25zdCBpc0NvcnJlY3QgPSBjdXJBbnN3ZXIuYW5zd2VyTmFtZSA9PT0gbmV3US5jb3JyZWN0O1xuXG4gICAgICAgICAgYnV0dG9uLmlubmVySFRNTCA9ICdhbnN3ZXJUZXh0JyBpbiBjdXJBbnN3ZXIgPyBjdXJBbnN3ZXIuYW5zd2VyVGV4dCA6ICcnO1xuXG4gICAgICAgICAgLy8gQWRkIGEgbGFiZWwgaW5zaWRlIHRoZSBidXR0b24gdG8gc2hvdyB0aGUgY29ycmVjdCBhbnN3ZXJcbiAgICAgICAgICBpZiAoaXNDb3JyZWN0ICYmIFVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLmRldk1vZGVDb3JyZWN0TGFiZWxWaXNpYmlsaXR5KSB7XG4gICAgICAgICAgICBjb25zdCBjb3JyZWN0TGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIGNvcnJlY3RMYWJlbC5jbGFzc0xpc3QuYWRkKCdjb3JyZWN0LWxhYmVsJyk7XG4gICAgICAgICAgICBjb3JyZWN0TGFiZWwuaW5uZXJIVE1MID0gJ0NvcnJlY3QnO1xuICAgICAgICAgICAgYnV0dG9uLmFwcGVuZENoaWxkKGNvcnJlY3RMYWJlbCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgYnV0dG9uLnN0eWxlLnZpc2liaWxpdHkgPSAnaGlkZGVuJztcbiAgICAgICAgICBidXR0b24uc3R5bGUuYm94U2hhZG93ID0gJzBweCAwcHggMHB4IDBweCByZ2JhKDAsMCwwLDApJztcbiAgICAgICAgICBzZXRUaW1lb3V0KFxuICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICBidXR0b24uc3R5bGUudmlzaWJpbGl0eSA9ICd2aXNpYmxlJztcbiAgICAgICAgICAgICAgYnV0dG9uLnN0eWxlLmJveFNoYWRvdyA9ICcwcHggNnB4IDhweCAjNjA2MDYwJztcbiAgICAgICAgICAgICAgYnV0dG9uLnN0eWxlLmFuaW1hdGlvbiA9IGB6b29tSW4gJHthbmltYXRpb25EdXJhdGlvbiAqIGFuaW1hdGlvblNwZWVkTXVsdGlwbGllcn1tcyBlYXNlIGZvcndhcmRzYDtcbiAgICAgICAgICAgICAgaWYgKCdhbnN3ZXJJbWcnIGluIGN1ckFuc3dlcikge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRtcGltZyA9IEF1ZGlvQ29udHJvbGxlci5HZXRJbWFnZShjdXJBbnN3ZXIuYW5zd2VySW1nKTtcbiAgICAgICAgICAgICAgICBidXR0b24uYXBwZW5kQ2hpbGQodG1waW1nKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignYW5pbWF0aW9uZW5kJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIG9wdGlvbnNEaXNwbGF5ZWQrKztcbiAgICAgICAgICAgICAgICBpZiAob3B0aW9uc0Rpc3BsYXllZCA9PT0gbmV3US5hbnN3ZXJzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkuZW5hYmxlQW5zd2VyQnV0dG9uKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBpICogYW5pbWF0aW9uRHVyYXRpb24gKiBhbmltYXRpb25TcGVlZE11bHRpcGxpZXIgKiAwLjNcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9LCBkZWxheUJmb3JlT3B0aW9uKTtcblxuICAgICAgVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkucVN0YXJ0ID0gRGF0ZS5ub3coKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGVuYWJsZUFuc3dlckJ1dHRvbigpOiB2b2lkIHtcbiAgICBVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5idXR0b25zQWN0aXZlID0gdHJ1ZTtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgU2V0RmVlZGJhY2tUZXh0KG50OiBzdHJpbmcpOiB2b2lkIHtcbiAgICBjb25zb2xlLmxvZygnRmVlZGJhY2sgdGV4dCBzZXQgdG8gJyArIG50KTtcbiAgICBVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5mZWVkYmFja0NvbnRhaW5lci5pbm5lckhUTUwgPSBudDtcbiAgfVxuXG4gIC8vZnVuY3Rpb25zIHRvIHNob3cvaGlkZSB0aGUgZGlmZmVyZW50IGNvbnRhaW5lcnNcbiAgcHJpdmF0ZSBzaG93TGFuZGluZygpOiB2b2lkIHtcbiAgICB0aGlzLmxhbmRpbmdDb250YWluZXIuc3R5bGUuZGlzcGxheSA9ICdmbGV4JztcbiAgICB0aGlzLmdhbWVDb250YWluZXIuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICB0aGlzLmVuZENvbnRhaW5lci5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBTaG93RW5kKCk6IHZvaWQge1xuICAgIFVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLmxhbmRpbmdDb250YWluZXIuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICBVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5nYW1lQ29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkuZW5kQ29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSAnZmxleCc7XG4gIH1cblxuICBwcml2YXRlIHNob3dHYW1lKCk6IHZvaWQge1xuICAgIHRoaXMubGFuZGluZ0NvbnRhaW5lci5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIHRoaXMuZ2FtZUNvbnRhaW5lci5zdHlsZS5kaXNwbGF5ID0gJ2dyaWQnO1xuICAgIHRoaXMuZW5kQ29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgdGhpcy5hbGxTdGFydCA9IERhdGUubm93KCk7XG4gICAgdGhpcy5zdGFydFByZXNzQ2FsbGJhY2soKTtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgU2V0RmVlZGJhY2tWaXNpYmlsZSh2aXNpYmxlOiBib29sZWFuLCBpc0NvcnJlY3Q6IGJvb2xlYW4pIHtcbiAgICBpZiAodmlzaWJsZSkge1xuICAgICAgVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkuZmVlZGJhY2tDb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJyk7XG4gICAgICBVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5mZWVkYmFja0NvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCd2aXNpYmxlJyk7XG4gICAgICBVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5idXR0b25zQWN0aXZlID0gZmFsc2U7XG4gICAgICBpZiAoaXNDb3JyZWN0KSB7XG4gICAgICAgIFVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLmZlZWRiYWNrQ29udGFpbmVyLnN0eWxlLmNvbG9yID0gJ3JnYigxMDksIDIwNCwgMTIyKSc7XG4gICAgICAgIEF1ZGlvQ29udHJvbGxlci5QbGF5Q29ycmVjdCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkuZmVlZGJhY2tDb250YWluZXIuc3R5bGUuY29sb3IgPSAncmVkJztcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkuZmVlZGJhY2tDb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSgndmlzaWJsZScpO1xuICAgICAgVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkuZmVlZGJhY2tDb250YWluZXIuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG4gICAgICBVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5idXR0b25zQWN0aXZlID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHN0YXRpYyBSZWFkeUZvck5leHQobmV3UTogcURhdGEsIHJlR2VuZXJhdGVJdGVtczogYm9vbGVhbiA9IHRydWUpOiB2b2lkIHtcbiAgICBpZiAobmV3USA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zb2xlLmxvZygncmVhZHkgZm9yIG5leHQhJyk7XG4gICAgVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkuYW5zd2Vyc0NvbnRhaW5lci5zdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbic7XG4gICAgZm9yICh2YXIgYiBpbiBVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5idXR0b25zKSB7XG4gICAgICBVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5idXR0b25zW2JdLnN0eWxlLnZpc2liaWxpdHkgPSAnaGlkZGVuJztcbiAgICB9XG4gICAgVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkuc2hvd24gPSBmYWxzZTtcbiAgICBVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5uZXh0UXVlc3Rpb24gPSBuZXdRO1xuICAgIFVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLnF1ZXN0aW9uc0NvbnRhaW5lci5pbm5lckhUTUwgPSAnJztcbiAgICBVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5xdWVzdGlvbnNDb250YWluZXIuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAvLyBwQi5pbm5lckhUTUwgPSBcIjxidXR0b24gaWQ9J25leHRxQnV0dG9uJz48c3ZnIHdpZHRoPScyNCcgaGVpZ2h0PScyNCcgdmlld0JveD0nMCAwIDI0IDI0JyBmaWxsPSdub25lJyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnPjxwYXRoIGQ9J005IDE4TDE1IDEyTDkgNlYxOFonIGZpbGw9J2N1cnJlbnRDb2xvcicgc3Ryb2tlPSdjdXJyZW50Q29sb3InIHN0cm9rZS13aWR0aD0nMicgc3Ryb2tlLWxpbmVjYXA9J3JvdW5kJyBzdHJva2UtbGluZWpvaW49J3JvdW5kJz48L3BhdGg+PC9zdmc+PC9idXR0b24+XCI7XG4gICAgLy8gVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkucGxheUJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwiYXVkaW8tYnV0dG9uXCIpO1xuXG4gICAgLy8gV2hlbiB0aGUgZGV2IG1vZGUgaXMgYWN0aXZlIGFuZCB0aGUgYnVja2V0IG5leHQsIHByZXZpb3VzIGFuZCBwbGF5IGJ1dHRvbnMgYXJlIGVuYWJsZWQsIHVzZSB0aGUgZXh0ZXJuYWwgYnVja2V0IGNvbnRyb2xzIGdlbmVyYXRpb24gaGFuZGxlclxuICAgIC8vIGlmICghcmVHZW5lcmF0ZUl0ZW1zKSB7XG4gICAgLy8gICByZXR1cm47XG4gICAgLy8gfVxuICAgIGNvbnN0IGlzQnVja2V0Q29udHJvbHNFbmFibGVkID0gVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkuZGV2TW9kZUJ1Y2tldENvbnRyb2xzRW5hYmxlZDtcbiAgICBpZiAoaXNCdWNrZXRDb250cm9sc0VuYWJsZWQpIHtcbiAgICAgIFVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLmV4dGVybmFsQnVja2V0Q29udHJvbHNHZW5lcmF0aW9uSGFuZGxlcihVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5wbGF5QnV0dG9uLCAoKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdDYWxsIGZyb20gaW5zaWRlIGNsaWNrIGhhbmRsZXIgb2YgZXh0ZXJuYWwgYnVja2V0IGNvbnRyb2xzJyk7XG4gICAgICAgIFVJQ29udHJvbGxlci5TaG93UXVlc3Rpb24oKTtcbiAgICAgICAgLy9wbGF5cXVlc3Rpb25hdWRpb1xuICAgICAgICBBdWRpb0NvbnRyb2xsZXIuUGxheUF1ZGlvKFxuICAgICAgICAgIG5ld1EucHJvbXB0QXVkaW8sXG4gICAgICAgICAgVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkuc2hvd09wdGlvbnMsXG4gICAgICAgICAgVUlDb250cm9sbGVyLlNob3dBdWRpb0FuaW1hdGlvblxuICAgICAgICApO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIFVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLnBsYXlCdXR0b24uaW5uZXJIVE1MID1cbiAgICAgICAgXCI8YnV0dG9uIGlkPSduZXh0cUJ1dHRvbic+PGltZyBjbGFzcz1hdWRpby1idXR0b24gd2lkdGg9JzEwMHB4JyBoZWlnaHQ9JzEwMHB4JyBzcmM9Jy9pbWcvU291bmRCdXR0b25fSWRsZS5wbmcnIHR5cGU9J2ltYWdlL3N2Zyt4bWwnPiA8L2ltZz48L2J1dHRvbj5cIjtcbiAgICAgIHZhciBuZXh0UXVlc3Rpb25CdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmV4dHFCdXR0b24nKTtcbiAgICAgIG5leHRRdWVzdGlvbkJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgVUlDb250cm9sbGVyLlNob3dRdWVzdGlvbigpO1xuICAgICAgICAvL3BsYXlxdWVzdGlvbmF1ZGlvXG4gICAgICAgIEF1ZGlvQ29udHJvbGxlci5QbGF5QXVkaW8oXG4gICAgICAgICAgbmV3US5wcm9tcHRBdWRpbyxcbiAgICAgICAgICBVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5zaG93T3B0aW9ucyxcbiAgICAgICAgICBVSUNvbnRyb2xsZXIuU2hvd0F1ZGlvQW5pbWF0aW9uXG4gICAgICAgICk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIFNob3dBdWRpb0FuaW1hdGlvbihwbGF5aW5nOiBib29sZWFuID0gZmFsc2UpIHtcbiAgICBpZiAoIVVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLmRldk1vZGVCdWNrZXRDb250cm9sc0VuYWJsZWQpIHtcbiAgICAgIGNvbnN0IHBsYXlCdXR0b25JbWcgPSBVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5wbGF5QnV0dG9uLnF1ZXJ5U2VsZWN0b3IoJ2ltZycpO1xuICAgICAgaWYgKHBsYXlpbmcpIHtcbiAgICAgICAgcGxheUJ1dHRvbkltZy5zcmMgPSAnYW5pbWF0aW9uL1NvdW5kQnV0dG9uLmdpZic7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwbGF5QnV0dG9uSW1nLnNyYyA9ICcvaW1nL1NvdW5kQnV0dG9uX0lkbGUucG5nJztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIFNob3dRdWVzdGlvbihuZXdRdWVzdGlvbj86IHFEYXRhKTogdm9pZCB7XG4gICAgLy8gcEIuaW5uZXJIVE1MID0gXCI8YnV0dG9uIGlkPSduZXh0cUJ1dHRvbic+PHN2ZyB3aWR0aD0nMjQnIGhlaWdodD0nMjQnIHZpZXdCb3g9JzAgMCAyNCAyNCcgZmlsbD0nbm9uZScgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48cGF0aCBkPSdNOSAxOEwxNSAxMkw5IDZWMThaJyBmaWxsPSdjdXJyZW50Q29sb3InIHN0cm9rZT0nY3VycmVudENvbG9yJyBzdHJva2Utd2lkdGg9JzInIHN0cm9rZS1saW5lY2FwPSdyb3VuZCcgc3Ryb2tlLWxpbmVqb2luPSdyb3VuZCc+PC9wYXRoPjwvc3ZnPjwvYnV0dG9uPlwiO1xuXG4gICAgLy8gV2hlbiB0aGUgZGV2IG1vZGUgaXMgYWN0aXZlIGFuZCB0aGUgYnVja2V0IG5leHQsIHByZXZpb3VzIGFuZCBwbGF5IGJ1dHRvbnMgYXJlIGVuYWJsZWQsIHVzZSB0aGUgZXh0ZXJuYWwgYnVja2V0IGNvbnRyb2xzIGdlbmVyYXRpb24gaGFuZGxlclxuICAgIGNvbnN0IGlzQnVja2V0Q29udHJvbHNFbmFibGVkID0gVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkuZGV2TW9kZUJ1Y2tldENvbnRyb2xzRW5hYmxlZDtcbiAgICBpZiAoaXNCdWNrZXRDb250cm9sc0VuYWJsZWQpIHtcbiAgICAgIFVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLmV4dGVybmFsQnVja2V0Q29udHJvbHNHZW5lcmF0aW9uSGFuZGxlcihVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5wbGF5QnV0dG9uLCAoKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdDYWxsIGZyb20gaW5zaWRlIGNsaWNrIGhhbmRsZXIgb2YgZXh0ZXJuYWwgYnVja2V0IGNvbnRyb2xzICMyJyk7XG4gICAgICAgIGNvbnNvbGUubG9nKCduZXh0IHF1ZXN0aW9uIGJ1dHRvbiBwcmVzc2VkJyk7XG4gICAgICAgIGNvbnNvbGUubG9nKG5ld1F1ZXN0aW9uLnByb21wdEF1ZGlvKTtcblxuICAgICAgICBpZiAoJ3Byb21wdEF1ZGlvJyBpbiBuZXdRdWVzdGlvbikge1xuICAgICAgICAgIEF1ZGlvQ29udHJvbGxlci5QbGF5QXVkaW8obmV3UXVlc3Rpb24ucHJvbXB0QXVkaW8sIHVuZGVmaW5lZCwgVUlDb250cm9sbGVyLlNob3dBdWRpb0FuaW1hdGlvbik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5wbGF5QnV0dG9uLmlubmVySFRNTCA9XG4gICAgICAgIFwiPGJ1dHRvbiBpZD0nbmV4dHFCdXR0b24nPjxpbWcgY2xhc3M9YXVkaW8tYnV0dG9uIHdpZHRoPScxMDBweCcgaGVpZ2h0PScxMDBweCcgc3JjPScvaW1nL1NvdW5kQnV0dG9uX0lkbGUucG5nJyB0eXBlPSdpbWFnZS9zdmcreG1sJz4gPC9pbWc+PC9idXR0b24+XCI7XG5cbiAgICAgIHZhciBuZXh0UXVlc3Rpb25CdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmV4dHFCdXR0b24nKTtcbiAgICAgIG5leHRRdWVzdGlvbkJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ25leHQgcXVlc3Rpb24gYnV0dG9uIHByZXNzZWQnKTtcbiAgICAgICAgY29uc29sZS5sb2cobmV3UXVlc3Rpb24ucHJvbXB0QXVkaW8pO1xuXG4gICAgICAgIGlmICgncHJvbXB0QXVkaW8nIGluIG5ld1F1ZXN0aW9uKSB7XG4gICAgICAgICAgQXVkaW9Db250cm9sbGVyLlBsYXlBdWRpbyhuZXdRdWVzdGlvbi5wcm9tcHRBdWRpbywgdW5kZWZpbmVkLCBVSUNvbnRyb2xsZXIuU2hvd0F1ZGlvQW5pbWF0aW9uKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkuYW5zd2Vyc0NvbnRhaW5lci5zdHlsZS52aXNpYmlsaXR5ID0gJ3Zpc2libGUnO1xuXG4gICAgbGV0IHFDb2RlID0gJyc7XG5cbiAgICBVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5xdWVzdGlvbnNDb250YWluZXIuaW5uZXJIVE1MID0gJyc7XG5cbiAgICBpZiAodHlwZW9mIG5ld1F1ZXN0aW9uID09ICd1bmRlZmluZWQnKSB7XG4gICAgICBuZXdRdWVzdGlvbiA9IFVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLm5leHRRdWVzdGlvbjtcbiAgICB9XG5cbiAgICBpZiAoJ3Byb21wdEltZycgaW4gbmV3UXVlc3Rpb24pIHtcbiAgICAgIHZhciB0bXBpbWcgPSBBdWRpb0NvbnRyb2xsZXIuR2V0SW1hZ2UobmV3UXVlc3Rpb24ucHJvbXB0SW1nKTtcbiAgICAgIFVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLnF1ZXN0aW9uc0NvbnRhaW5lci5hcHBlbmRDaGlsZCh0bXBpbWcpO1xuICAgIH1cblxuICAgIHFDb2RlICs9IG5ld1F1ZXN0aW9uLnByb21wdFRleHQ7XG5cbiAgICBxQ29kZSArPSAnPEJSPic7XG5cbiAgICBVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5xdWVzdGlvbnNDb250YWluZXIuaW5uZXJIVE1MICs9IHFDb2RlO1xuXG4gICAgZm9yICh2YXIgYnV0dG9uSW5kZXggaW4gVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkuYnV0dG9ucykge1xuICAgICAgVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkuYnV0dG9uc1tidXR0b25JbmRleF0uc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgQWRkU3RhcigpOiB2b2lkIHtcbiAgICB2YXIgc3RhclRvU2hvdyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuICAgICAgJ3N0YXInICsgVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkuc3RhcnNbVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkucUFuc051bV1cbiAgICApIGFzIEhUTUxJbWFnZUVsZW1lbnQ7XG4gICAgc3RhclRvU2hvdy5zcmMgPSAnLi4vYW5pbWF0aW9uL1N0YXIuZ2lmJztcbiAgICBzdGFyVG9TaG93LmNsYXNzTGlzdC5hZGQoJ3RvcHN0YXJ2Jyk7XG4gICAgc3RhclRvU2hvdy5jbGFzc0xpc3QucmVtb3ZlKCd0b3BzdGFyaCcpO1xuXG4gICAgc3RhclRvU2hvdy5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG5cbiAgICBsZXQgY29udGFpbmVyV2lkdGggPSBVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5zdGFyQ29udGFpbmVyLm9mZnNldFdpZHRoO1xuICAgIGxldCBjb250YWluZXJIZWlnaHQgPSBVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5zdGFyQ29udGFpbmVyLm9mZnNldEhlaWdodDtcblxuICAgIGNvbnNvbGUubG9nKCdTdGFycyBDb250YWluZXIgZGltZW5zaW9uczogJywgY29udGFpbmVyV2lkdGgsIGNvbnRhaW5lckhlaWdodCk7XG5cbiAgICBsZXQgcmFuZG9tWCA9IDA7XG4gICAgbGV0IHJhbmRvbVkgPSAwO1xuXG4gICAgZG8ge1xuICAgICAgcmFuZG9tWCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChjb250YWluZXJXaWR0aCAtIGNvbnRhaW5lcldpZHRoICogMC4yKSk7XG4gICAgICByYW5kb21ZID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY29udGFpbmVySGVpZ2h0KTtcbiAgICB9IHdoaWxlIChVSUNvbnRyb2xsZXIuT3ZlcmxhcHBpbmdPdGhlclN0YXJzKFVJQ29udHJvbGxlci5pbnN0YW5jZS5zdGFyUG9zaXRpb25zLCByYW5kb21YLCByYW5kb21ZLCAyOCkpO1xuXG4gICAgY29uc3QgYW5pbWF0aW9uU3BlZWRNdWx0aXBsaWVyID0gVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkuYW5pbWF0aW9uU3BlZWRNdWx0aXBsaWVyO1xuXG4gICAgLy8gU2F2ZSB0aGVzZSByYW5kb20geCBhbmQgeSB2YWx1ZXMsIG1ha2UgdGhlIHN0YXIgYXBwZWFyIGluIHRoZSBjZW50ZXIgb2YgdGhlIHNjcmVlbiwgbWFrZSBpdCAzIHRpbWVzIGJpZ2dlciB1c2luZyBzY2FsZSBhbmQgc2xvd2x5IHRyYW5zaXRpb24gdG8gdGhlIHJhbmRvbSB4IGFuZCB5IHZhbHVlc1xuICAgIHN0YXJUb1Nob3cuc3R5bGUudHJhbnNmb3JtID0gJ3NjYWxlKDEwKSc7XG4gICAgc3RhclRvU2hvdy5zdHlsZS50cmFuc2l0aW9uID0gYHRvcCAkezEgKiBhbmltYXRpb25TcGVlZE11bHRpcGxpZXJ9cyBlYXNlLCBsZWZ0ICR7MSAqIGFuaW1hdGlvblNwZWVkTXVsdGlwbGllcn1zIGVhc2UsIHRyYW5zZm9ybSAkezAuNSAqIGFuaW1hdGlvblNwZWVkTXVsdGlwbGllcn1zIGVhc2VgO1xuICAgIHN0YXJUb1Nob3cuc3R5bGUuekluZGV4ID0gJzUwMCc7XG4gICAgc3RhclRvU2hvdy5zdHlsZS50b3AgPSB3aW5kb3cuaW5uZXJIZWlnaHQgLyAyICsgJ3B4JztcbiAgICBzdGFyVG9TaG93LnN0eWxlLmxlZnQgPSBVSUNvbnRyb2xsZXIuaW5zdGFuY2UuZ2FtZUNvbnRhaW5lci5vZmZzZXRXaWR0aCAvIDIgLSBzdGFyVG9TaG93Lm9mZnNldFdpZHRoIC8gMiArICdweCc7XG5cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHN0YXJUb1Nob3cuc3R5bGUudHJhbnNpdGlvbiA9IGB0b3AgJHsyICogYW5pbWF0aW9uU3BlZWRNdWx0aXBsaWVyfXMgZWFzZSwgbGVmdCAkezIgKiBhbmltYXRpb25TcGVlZE11bHRpcGxpZXJ9cyBlYXNlLCB0cmFuc2Zvcm0gJHsyICogYW5pbWF0aW9uU3BlZWRNdWx0aXBsaWVyfXMgZWFzZWA7XG4gICAgICBpZiAocmFuZG9tWCA8IGNvbnRhaW5lcldpZHRoIC8gMiAtIDMwKSB7XG4gICAgICAgIC8vIFJvdGF0ZSB0aGUgc3RhciB0byB0aGUgcmlnaHQgYSBiaXRcbiAgICAgICAgY29uc3Qgcm90YXRpb24gPSA1ICsgTWF0aC5yYW5kb20oKSAqIDg7XG4gICAgICAgIGNvbnNvbGUubG9nKCdSb3RhdGluZyBzdGFyIHRvIHRoZSByaWdodCcsIHJvdGF0aW9uKTtcbiAgICAgICAgc3RhclRvU2hvdy5zdHlsZS50cmFuc2Zvcm0gPSAncm90YXRlKC0nICsgcm90YXRpb24gKyAnZGVnKSBzY2FsZSgxKSc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBSb3RhdGUgdGhlIHN0YXIgdG8gdGhlIGxlZnQgYSBiaXRcbiAgICAgICAgY29uc3Qgcm90YXRpb24gPSA1ICsgTWF0aC5yYW5kb20oKSAqIDg7XG4gICAgICAgIGNvbnNvbGUubG9nKCdSb3RhdGluZyBzdGFyIHRvIHRoZSBsZWZ0Jywgcm90YXRpb24pO1xuICAgICAgICBzdGFyVG9TaG93LnN0eWxlLnRyYW5zZm9ybSA9ICdyb3RhdGUoJyArIHJvdGF0aW9uICsgJ2RlZykgc2NhbGUoMSknO1xuICAgICAgfVxuXG4gICAgICBzdGFyVG9TaG93LnN0eWxlLmxlZnQgPSAxMCArIHJhbmRvbVggKyAncHgnO1xuICAgICAgc3RhclRvU2hvdy5zdHlsZS50b3AgPSByYW5kb21ZICsgJ3B4JztcblxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHN0YXJUb1Nob3cuc3R5bGUuZmlsdGVyID0gJ2Ryb3Atc2hhZG93KDBweCAwcHggMTBweCB5ZWxsb3cpJztcbiAgICAgIH0sIDE5MDAgKiBhbmltYXRpb25TcGVlZE11bHRpcGxpZXIpO1xuICAgIH0sIDEwMDAgKiBhbmltYXRpb25TcGVlZE11bHRpcGxpZXIpO1xuXG4gICAgVUlDb250cm9sbGVyLmluc3RhbmNlLnN0YXJQb3NpdGlvbnMucHVzaCh7IHg6IHJhbmRvbVgsIHk6IHJhbmRvbVkgfSk7XG5cbiAgICBVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5xQW5zTnVtICs9IDE7XG5cbiAgICBVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5zaG93blN0YXJzQ291bnQgKz0gMTtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgQ2hhbmdlU3RhckltYWdlQWZ0ZXJBbmltYXRpb24oKTogdm9pZCB7XG4gICAgdmFyIHN0YXJUb1Nob3cgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcbiAgICAgICdzdGFyJyArIFVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLnN0YXJzW1VJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLnFBbnNOdW0gLSAxXVxuICAgICkgYXMgSFRNTEltYWdlRWxlbWVudDtcbiAgICBzdGFyVG9TaG93LnNyYyA9ICcuLi9pbWcvc3Rhcl9hZnRlcl9hbmltYXRpb24uZ2lmJztcbiAgfVxuXG4gIHByaXZhdGUgYW5zd2VyQnV0dG9uUHJlc3MoYnV0dG9uTnVtOiBudW1iZXIpOiB2b2lkIHtcbiAgICBjb25zdCBhbGxCdXR0b25zVmlzaWJsZSA9IHRoaXMuYnV0dG9ucy5ldmVyeSgoYnV0dG9uKSA9PiBidXR0b24uc3R5bGUudmlzaWJpbGl0eSA9PT0gJ3Zpc2libGUnKTtcbiAgICBjb25zb2xlLmxvZyh0aGlzLmJ1dHRvbnNBY3RpdmUsIGFsbEJ1dHRvbnNWaXNpYmxlKTtcbiAgICBpZiAodGhpcy5idXR0b25zQWN0aXZlID09PSB0cnVlKSB7XG4gICAgICBBdWRpb0NvbnRyb2xsZXIuUGxheURpbmcoKTtcbiAgICAgIGNvbnN0IG5QcmVzc2VkID0gRGF0ZS5ub3coKTtcbiAgICAgIGNvbnN0IGRUaW1lID0gblByZXNzZWQgLSB0aGlzLnFTdGFydDtcbiAgICAgIGNvbnNvbGUubG9nKCdhbnN3ZXJlZCBpbiAnICsgZFRpbWUpO1xuICAgICAgdGhpcy5idXR0b25QcmVzc0NhbGxiYWNrKGJ1dHRvbk51bSwgZFRpbWUpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgUHJvZ3Jlc3NDaGVzdCgpIHtcbiAgICBjb25zdCBjaGVzdEltYWdlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NoZXN0SW1hZ2UnKSBhcyBIVE1MSW1hZ2VFbGVtZW50O1xuICAgIGxldCBjdXJyZW50SW1nU3JjID0gY2hlc3RJbWFnZS5zcmM7XG4gICAgY29uc29sZS5sb2coJ0NoZXN0IFByb2dyZXNzaW9uLS0+JywgY2hlc3RJbWFnZSk7XG4gICAgY29uc29sZS5sb2coJ0NoZXN0IFByb2dyZXNzaW9uLS0+JywgY2hlc3RJbWFnZS5zcmMpO1xuICAgIGNvbnN0IGN1cnJlbnRJbWFnZU51bWJlciA9IHBhcnNlSW50KGN1cnJlbnRJbWdTcmMuc2xpY2UoLTYsIC00KSwgMTApO1xuICAgIGNvbnNvbGUubG9nKCdDaGVzdCBQcm9ncmVzc2lvbiBudW1iZXItLT4nLCBjdXJyZW50SW1hZ2VOdW1iZXIpO1xuICAgIGNvbnN0IG5leHRJbWFnZU51bWJlciA9IChjdXJyZW50SW1hZ2VOdW1iZXIgJSA0KSArIDE7XG4gICAgY29uc3QgbmV4dEltYWdlU3JjID0gYGltZy9jaGVzdHByb2dyZXNzaW9uL1RyZWFzdXJlQ2hlc3RPcGVuMCR7bmV4dEltYWdlTnVtYmVyfS5zdmdgO1xuICAgIGNoZXN0SW1hZ2Uuc3JjID0gbmV4dEltYWdlU3JjO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBTZXRDb250ZW50TG9hZGVkKHZhbHVlOiBib29sZWFuKTogdm9pZCB7XG4gICAgVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkuY29udGVudExvYWRlZCA9IHZhbHVlO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBTZXRCdXR0b25QcmVzc0FjdGlvbihjYWxsYmFjazogRnVuY3Rpb24pOiB2b2lkIHtcbiAgICBVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5idXR0b25QcmVzc0NhbGxiYWNrID0gY2FsbGJhY2s7XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIFNldFN0YXJ0QWN0aW9uKGNhbGxiYWNrOiBGdW5jdGlvbik6IHZvaWQge1xuICAgIFVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLnN0YXJ0UHJlc3NDYWxsYmFjayA9IGNhbGxiYWNrO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBTZXRFeHRlcm5hbEJ1Y2tldENvbnRyb2xzR2VuZXJhdGlvbkhhbmRsZXIoXG4gICAgaGFuZGxlcjogKGNvbnRhaW5lcjogSFRNTEVsZW1lbnQsIGNsaWNrQ2FsbGJhY2s6ICgpID0+IHZvaWQpID0+IHZvaWRcbiAgKTogdm9pZCB7XG4gICAgVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkuZXh0ZXJuYWxCdWNrZXRDb250cm9sc0dlbmVyYXRpb25IYW5kbGVyID0gaGFuZGxlcjtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgZ2V0SW5zdGFuY2UoKTogVUlDb250cm9sbGVyIHtcbiAgICBpZiAoVUlDb250cm9sbGVyLmluc3RhbmNlID09PSBudWxsKSB7XG4gICAgICBVSUNvbnRyb2xsZXIuaW5zdGFuY2UgPSBuZXcgVUlDb250cm9sbGVyKCk7XG4gICAgICBVSUNvbnRyb2xsZXIuaW5zdGFuY2UuaW5pdCgpO1xuICAgIH1cblxuICAgIHJldHVybiBVSUNvbnRyb2xsZXIuaW5zdGFuY2U7XG4gIH1cbn1cbiIsIi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbi8qKlxyXG4gKiBAZmlsZW92ZXJ2aWV3IEZpcmViYXNlIGNvbnN0YW50cy4gIFNvbWUgb2YgdGhlc2UgKEBkZWZpbmVzKSBjYW4gYmUgb3ZlcnJpZGRlbiBhdCBjb21waWxlLXRpbWUuXHJcbiAqL1xyXG5jb25zdCBDT05TVEFOVFMgPSB7XHJcbiAgICAvKipcclxuICAgICAqIEBkZWZpbmUge2Jvb2xlYW59IFdoZXRoZXIgdGhpcyBpcyB0aGUgY2xpZW50IE5vZGUuanMgU0RLLlxyXG4gICAgICovXHJcbiAgICBOT0RFX0NMSUVOVDogZmFsc2UsXHJcbiAgICAvKipcclxuICAgICAqIEBkZWZpbmUge2Jvb2xlYW59IFdoZXRoZXIgdGhpcyBpcyB0aGUgQWRtaW4gTm9kZS5qcyBTREsuXHJcbiAgICAgKi9cclxuICAgIE5PREVfQURNSU46IGZhbHNlLFxyXG4gICAgLyoqXHJcbiAgICAgKiBGaXJlYmFzZSBTREsgVmVyc2lvblxyXG4gICAgICovXHJcbiAgICBTREtfVkVSU0lPTjogJyR7SlNDT1JFX1ZFUlNJT059J1xyXG59O1xuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG4vKipcclxuICogVGhyb3dzIGFuIGVycm9yIGlmIHRoZSBwcm92aWRlZCBhc3NlcnRpb24gaXMgZmFsc3lcclxuICovXHJcbmNvbnN0IGFzc2VydCA9IGZ1bmN0aW9uIChhc3NlcnRpb24sIG1lc3NhZ2UpIHtcclxuICAgIGlmICghYXNzZXJ0aW9uKSB7XHJcbiAgICAgICAgdGhyb3cgYXNzZXJ0aW9uRXJyb3IobWVzc2FnZSk7XHJcbiAgICB9XHJcbn07XHJcbi8qKlxyXG4gKiBSZXR1cm5zIGFuIEVycm9yIG9iamVjdCBzdWl0YWJsZSBmb3IgdGhyb3dpbmcuXHJcbiAqL1xyXG5jb25zdCBhc3NlcnRpb25FcnJvciA9IGZ1bmN0aW9uIChtZXNzYWdlKSB7XHJcbiAgICByZXR1cm4gbmV3IEVycm9yKCdGaXJlYmFzZSBEYXRhYmFzZSAoJyArXHJcbiAgICAgICAgQ09OU1RBTlRTLlNES19WRVJTSU9OICtcclxuICAgICAgICAnKSBJTlRFUk5BTCBBU1NFUlQgRkFJTEVEOiAnICtcclxuICAgICAgICBtZXNzYWdlKTtcclxufTtcblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuY29uc3Qgc3RyaW5nVG9CeXRlQXJyYXkkMSA9IGZ1bmN0aW9uIChzdHIpIHtcclxuICAgIC8vIFRPRE8odXNlcik6IFVzZSBuYXRpdmUgaW1wbGVtZW50YXRpb25zIGlmL3doZW4gYXZhaWxhYmxlXHJcbiAgICBjb25zdCBvdXQgPSBbXTtcclxuICAgIGxldCBwID0gMDtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IGMgPSBzdHIuY2hhckNvZGVBdChpKTtcclxuICAgICAgICBpZiAoYyA8IDEyOCkge1xyXG4gICAgICAgICAgICBvdXRbcCsrXSA9IGM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGMgPCAyMDQ4KSB7XHJcbiAgICAgICAgICAgIG91dFtwKytdID0gKGMgPj4gNikgfCAxOTI7XHJcbiAgICAgICAgICAgIG91dFtwKytdID0gKGMgJiA2MykgfCAxMjg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKChjICYgMHhmYzAwKSA9PT0gMHhkODAwICYmXHJcbiAgICAgICAgICAgIGkgKyAxIDwgc3RyLmxlbmd0aCAmJlxyXG4gICAgICAgICAgICAoc3RyLmNoYXJDb2RlQXQoaSArIDEpICYgMHhmYzAwKSA9PT0gMHhkYzAwKSB7XHJcbiAgICAgICAgICAgIC8vIFN1cnJvZ2F0ZSBQYWlyXHJcbiAgICAgICAgICAgIGMgPSAweDEwMDAwICsgKChjICYgMHgwM2ZmKSA8PCAxMCkgKyAoc3RyLmNoYXJDb2RlQXQoKytpKSAmIDB4MDNmZik7XHJcbiAgICAgICAgICAgIG91dFtwKytdID0gKGMgPj4gMTgpIHwgMjQwO1xyXG4gICAgICAgICAgICBvdXRbcCsrXSA9ICgoYyA+PiAxMikgJiA2MykgfCAxMjg7XHJcbiAgICAgICAgICAgIG91dFtwKytdID0gKChjID4+IDYpICYgNjMpIHwgMTI4O1xyXG4gICAgICAgICAgICBvdXRbcCsrXSA9IChjICYgNjMpIHwgMTI4O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgb3V0W3ArK10gPSAoYyA+PiAxMikgfCAyMjQ7XHJcbiAgICAgICAgICAgIG91dFtwKytdID0gKChjID4+IDYpICYgNjMpIHwgMTI4O1xyXG4gICAgICAgICAgICBvdXRbcCsrXSA9IChjICYgNjMpIHwgMTI4O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBvdXQ7XHJcbn07XHJcbi8qKlxyXG4gKiBUdXJucyBhbiBhcnJheSBvZiBudW1iZXJzIGludG8gdGhlIHN0cmluZyBnaXZlbiBieSB0aGUgY29uY2F0ZW5hdGlvbiBvZiB0aGVcclxuICogY2hhcmFjdGVycyB0byB3aGljaCB0aGUgbnVtYmVycyBjb3JyZXNwb25kLlxyXG4gKiBAcGFyYW0gYnl0ZXMgQXJyYXkgb2YgbnVtYmVycyByZXByZXNlbnRpbmcgY2hhcmFjdGVycy5cclxuICogQHJldHVybiBTdHJpbmdpZmljYXRpb24gb2YgdGhlIGFycmF5LlxyXG4gKi9cclxuY29uc3QgYnl0ZUFycmF5VG9TdHJpbmcgPSBmdW5jdGlvbiAoYnl0ZXMpIHtcclxuICAgIC8vIFRPRE8odXNlcik6IFVzZSBuYXRpdmUgaW1wbGVtZW50YXRpb25zIGlmL3doZW4gYXZhaWxhYmxlXHJcbiAgICBjb25zdCBvdXQgPSBbXTtcclxuICAgIGxldCBwb3MgPSAwLCBjID0gMDtcclxuICAgIHdoaWxlIChwb3MgPCBieXRlcy5sZW5ndGgpIHtcclxuICAgICAgICBjb25zdCBjMSA9IGJ5dGVzW3BvcysrXTtcclxuICAgICAgICBpZiAoYzEgPCAxMjgpIHtcclxuICAgICAgICAgICAgb3V0W2MrK10gPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGMxKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoYzEgPiAxOTEgJiYgYzEgPCAyMjQpIHtcclxuICAgICAgICAgICAgY29uc3QgYzIgPSBieXRlc1twb3MrK107XHJcbiAgICAgICAgICAgIG91dFtjKytdID0gU3RyaW5nLmZyb21DaGFyQ29kZSgoKGMxICYgMzEpIDw8IDYpIHwgKGMyICYgNjMpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoYzEgPiAyMzkgJiYgYzEgPCAzNjUpIHtcclxuICAgICAgICAgICAgLy8gU3Vycm9nYXRlIFBhaXJcclxuICAgICAgICAgICAgY29uc3QgYzIgPSBieXRlc1twb3MrK107XHJcbiAgICAgICAgICAgIGNvbnN0IGMzID0gYnl0ZXNbcG9zKytdO1xyXG4gICAgICAgICAgICBjb25zdCBjNCA9IGJ5dGVzW3BvcysrXTtcclxuICAgICAgICAgICAgY29uc3QgdSA9ICgoKGMxICYgNykgPDwgMTgpIHwgKChjMiAmIDYzKSA8PCAxMikgfCAoKGMzICYgNjMpIDw8IDYpIHwgKGM0ICYgNjMpKSAtXHJcbiAgICAgICAgICAgICAgICAweDEwMDAwO1xyXG4gICAgICAgICAgICBvdXRbYysrXSA9IFN0cmluZy5mcm9tQ2hhckNvZGUoMHhkODAwICsgKHUgPj4gMTApKTtcclxuICAgICAgICAgICAgb3V0W2MrK10gPSBTdHJpbmcuZnJvbUNoYXJDb2RlKDB4ZGMwMCArICh1ICYgMTAyMykpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgYzIgPSBieXRlc1twb3MrK107XHJcbiAgICAgICAgICAgIGNvbnN0IGMzID0gYnl0ZXNbcG9zKytdO1xyXG4gICAgICAgICAgICBvdXRbYysrXSA9IFN0cmluZy5mcm9tQ2hhckNvZGUoKChjMSAmIDE1KSA8PCAxMikgfCAoKGMyICYgNjMpIDw8IDYpIHwgKGMzICYgNjMpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gb3V0LmpvaW4oJycpO1xyXG59O1xyXG4vLyBXZSBkZWZpbmUgaXQgYXMgYW4gb2JqZWN0IGxpdGVyYWwgaW5zdGVhZCBvZiBhIGNsYXNzIGJlY2F1c2UgYSBjbGFzcyBjb21waWxlZCBkb3duIHRvIGVzNSBjYW4ndFxyXG4vLyBiZSB0cmVlc2hha2VkLiBodHRwczovL2dpdGh1Yi5jb20vcm9sbHVwL3JvbGx1cC9pc3N1ZXMvMTY5MVxyXG4vLyBTdGF0aWMgbG9va3VwIG1hcHMsIGxhemlseSBwb3B1bGF0ZWQgYnkgaW5pdF8oKVxyXG5jb25zdCBiYXNlNjQgPSB7XHJcbiAgICAvKipcclxuICAgICAqIE1hcHMgYnl0ZXMgdG8gY2hhcmFjdGVycy5cclxuICAgICAqL1xyXG4gICAgYnl0ZVRvQ2hhck1hcF86IG51bGwsXHJcbiAgICAvKipcclxuICAgICAqIE1hcHMgY2hhcmFjdGVycyB0byBieXRlcy5cclxuICAgICAqL1xyXG4gICAgY2hhclRvQnl0ZU1hcF86IG51bGwsXHJcbiAgICAvKipcclxuICAgICAqIE1hcHMgYnl0ZXMgdG8gd2Vic2FmZSBjaGFyYWN0ZXJzLlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgYnl0ZVRvQ2hhck1hcFdlYlNhZmVfOiBudWxsLFxyXG4gICAgLyoqXHJcbiAgICAgKiBNYXBzIHdlYnNhZmUgY2hhcmFjdGVycyB0byBieXRlcy5cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIGNoYXJUb0J5dGVNYXBXZWJTYWZlXzogbnVsbCxcclxuICAgIC8qKlxyXG4gICAgICogT3VyIGRlZmF1bHQgYWxwaGFiZXQsIHNoYXJlZCBiZXR3ZWVuXHJcbiAgICAgKiBFTkNPREVEX1ZBTFMgYW5kIEVOQ09ERURfVkFMU19XRUJTQUZFXHJcbiAgICAgKi9cclxuICAgIEVOQ09ERURfVkFMU19CQVNFOiAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVonICsgJ2FiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6JyArICcwMTIzNDU2Nzg5JyxcclxuICAgIC8qKlxyXG4gICAgICogT3VyIGRlZmF1bHQgYWxwaGFiZXQuIFZhbHVlIDY0ICg9KSBpcyBzcGVjaWFsOyBpdCBtZWFucyBcIm5vdGhpbmcuXCJcclxuICAgICAqL1xyXG4gICAgZ2V0IEVOQ09ERURfVkFMUygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5FTkNPREVEX1ZBTFNfQkFTRSArICcrLz0nO1xyXG4gICAgfSxcclxuICAgIC8qKlxyXG4gICAgICogT3VyIHdlYnNhZmUgYWxwaGFiZXQuXHJcbiAgICAgKi9cclxuICAgIGdldCBFTkNPREVEX1ZBTFNfV0VCU0FGRSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5FTkNPREVEX1ZBTFNfQkFTRSArICctXy4nO1xyXG4gICAgfSxcclxuICAgIC8qKlxyXG4gICAgICogV2hldGhlciB0aGlzIGJyb3dzZXIgc3VwcG9ydHMgdGhlIGF0b2IgYW5kIGJ0b2EgZnVuY3Rpb25zLiBUaGlzIGV4dGVuc2lvblxyXG4gICAgICogc3RhcnRlZCBhdCBNb3ppbGxhIGJ1dCBpcyBub3cgaW1wbGVtZW50ZWQgYnkgbWFueSBicm93c2Vycy4gV2UgdXNlIHRoZVxyXG4gICAgICogQVNTVU1FXyogdmFyaWFibGVzIHRvIGF2b2lkIHB1bGxpbmcgaW4gdGhlIGZ1bGwgdXNlcmFnZW50IGRldGVjdGlvbiBsaWJyYXJ5XHJcbiAgICAgKiBidXQgc3RpbGwgYWxsb3dpbmcgdGhlIHN0YW5kYXJkIHBlci1icm93c2VyIGNvbXBpbGF0aW9ucy5cclxuICAgICAqXHJcbiAgICAgKi9cclxuICAgIEhBU19OQVRJVkVfU1VQUE9SVDogdHlwZW9mIGF0b2IgPT09ICdmdW5jdGlvbicsXHJcbiAgICAvKipcclxuICAgICAqIEJhc2U2NC1lbmNvZGUgYW4gYXJyYXkgb2YgYnl0ZXMuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGlucHV0IEFuIGFycmF5IG9mIGJ5dGVzIChudW1iZXJzIHdpdGhcclxuICAgICAqICAgICB2YWx1ZSBpbiBbMCwgMjU1XSkgdG8gZW5jb2RlLlxyXG4gICAgICogQHBhcmFtIHdlYlNhZmUgQm9vbGVhbiBpbmRpY2F0aW5nIHdlIHNob3VsZCB1c2UgdGhlXHJcbiAgICAgKiAgICAgYWx0ZXJuYXRpdmUgYWxwaGFiZXQuXHJcbiAgICAgKiBAcmV0dXJuIFRoZSBiYXNlNjQgZW5jb2RlZCBzdHJpbmcuXHJcbiAgICAgKi9cclxuICAgIGVuY29kZUJ5dGVBcnJheShpbnB1dCwgd2ViU2FmZSkge1xyXG4gICAgICAgIGlmICghQXJyYXkuaXNBcnJheShpbnB1dCkpIHtcclxuICAgICAgICAgICAgdGhyb3cgRXJyb3IoJ2VuY29kZUJ5dGVBcnJheSB0YWtlcyBhbiBhcnJheSBhcyBhIHBhcmFtZXRlcicpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmluaXRfKCk7XHJcbiAgICAgICAgY29uc3QgYnl0ZVRvQ2hhck1hcCA9IHdlYlNhZmVcclxuICAgICAgICAgICAgPyB0aGlzLmJ5dGVUb0NoYXJNYXBXZWJTYWZlX1xyXG4gICAgICAgICAgICA6IHRoaXMuYnl0ZVRvQ2hhck1hcF87XHJcbiAgICAgICAgY29uc3Qgb3V0cHV0ID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbnB1dC5sZW5ndGg7IGkgKz0gMykge1xyXG4gICAgICAgICAgICBjb25zdCBieXRlMSA9IGlucHV0W2ldO1xyXG4gICAgICAgICAgICBjb25zdCBoYXZlQnl0ZTIgPSBpICsgMSA8IGlucHV0Lmxlbmd0aDtcclxuICAgICAgICAgICAgY29uc3QgYnl0ZTIgPSBoYXZlQnl0ZTIgPyBpbnB1dFtpICsgMV0gOiAwO1xyXG4gICAgICAgICAgICBjb25zdCBoYXZlQnl0ZTMgPSBpICsgMiA8IGlucHV0Lmxlbmd0aDtcclxuICAgICAgICAgICAgY29uc3QgYnl0ZTMgPSBoYXZlQnl0ZTMgPyBpbnB1dFtpICsgMl0gOiAwO1xyXG4gICAgICAgICAgICBjb25zdCBvdXRCeXRlMSA9IGJ5dGUxID4+IDI7XHJcbiAgICAgICAgICAgIGNvbnN0IG91dEJ5dGUyID0gKChieXRlMSAmIDB4MDMpIDw8IDQpIHwgKGJ5dGUyID4+IDQpO1xyXG4gICAgICAgICAgICBsZXQgb3V0Qnl0ZTMgPSAoKGJ5dGUyICYgMHgwZikgPDwgMikgfCAoYnl0ZTMgPj4gNik7XHJcbiAgICAgICAgICAgIGxldCBvdXRCeXRlNCA9IGJ5dGUzICYgMHgzZjtcclxuICAgICAgICAgICAgaWYgKCFoYXZlQnl0ZTMpIHtcclxuICAgICAgICAgICAgICAgIG91dEJ5dGU0ID0gNjQ7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWhhdmVCeXRlMikge1xyXG4gICAgICAgICAgICAgICAgICAgIG91dEJ5dGUzID0gNjQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3V0cHV0LnB1c2goYnl0ZVRvQ2hhck1hcFtvdXRCeXRlMV0sIGJ5dGVUb0NoYXJNYXBbb3V0Qnl0ZTJdLCBieXRlVG9DaGFyTWFwW291dEJ5dGUzXSwgYnl0ZVRvQ2hhck1hcFtvdXRCeXRlNF0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gb3V0cHV0LmpvaW4oJycpO1xyXG4gICAgfSxcclxuICAgIC8qKlxyXG4gICAgICogQmFzZTY0LWVuY29kZSBhIHN0cmluZy5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gaW5wdXQgQSBzdHJpbmcgdG8gZW5jb2RlLlxyXG4gICAgICogQHBhcmFtIHdlYlNhZmUgSWYgdHJ1ZSwgd2Ugc2hvdWxkIHVzZSB0aGVcclxuICAgICAqICAgICBhbHRlcm5hdGl2ZSBhbHBoYWJldC5cclxuICAgICAqIEByZXR1cm4gVGhlIGJhc2U2NCBlbmNvZGVkIHN0cmluZy5cclxuICAgICAqL1xyXG4gICAgZW5jb2RlU3RyaW5nKGlucHV0LCB3ZWJTYWZlKSB7XHJcbiAgICAgICAgLy8gU2hvcnRjdXQgZm9yIE1vemlsbGEgYnJvd3NlcnMgdGhhdCBpbXBsZW1lbnRcclxuICAgICAgICAvLyBhIG5hdGl2ZSBiYXNlNjQgZW5jb2RlciBpbiB0aGUgZm9ybSBvZiBcImJ0b2EvYXRvYlwiXHJcbiAgICAgICAgaWYgKHRoaXMuSEFTX05BVElWRV9TVVBQT1JUICYmICF3ZWJTYWZlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBidG9hKGlucHV0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZW5jb2RlQnl0ZUFycmF5KHN0cmluZ1RvQnl0ZUFycmF5JDEoaW5wdXQpLCB3ZWJTYWZlKTtcclxuICAgIH0sXHJcbiAgICAvKipcclxuICAgICAqIEJhc2U2NC1kZWNvZGUgYSBzdHJpbmcuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGlucHV0IHRvIGRlY29kZS5cclxuICAgICAqIEBwYXJhbSB3ZWJTYWZlIFRydWUgaWYgd2Ugc2hvdWxkIHVzZSB0aGVcclxuICAgICAqICAgICBhbHRlcm5hdGl2ZSBhbHBoYWJldC5cclxuICAgICAqIEByZXR1cm4gc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgZGVjb2RlZCB2YWx1ZS5cclxuICAgICAqL1xyXG4gICAgZGVjb2RlU3RyaW5nKGlucHV0LCB3ZWJTYWZlKSB7XHJcbiAgICAgICAgLy8gU2hvcnRjdXQgZm9yIE1vemlsbGEgYnJvd3NlcnMgdGhhdCBpbXBsZW1lbnRcclxuICAgICAgICAvLyBhIG5hdGl2ZSBiYXNlNjQgZW5jb2RlciBpbiB0aGUgZm9ybSBvZiBcImJ0b2EvYXRvYlwiXHJcbiAgICAgICAgaWYgKHRoaXMuSEFTX05BVElWRV9TVVBQT1JUICYmICF3ZWJTYWZlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBhdG9iKGlucHV0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGJ5dGVBcnJheVRvU3RyaW5nKHRoaXMuZGVjb2RlU3RyaW5nVG9CeXRlQXJyYXkoaW5wdXQsIHdlYlNhZmUpKTtcclxuICAgIH0sXHJcbiAgICAvKipcclxuICAgICAqIEJhc2U2NC1kZWNvZGUgYSBzdHJpbmcuXHJcbiAgICAgKlxyXG4gICAgICogSW4gYmFzZS02NCBkZWNvZGluZywgZ3JvdXBzIG9mIGZvdXIgY2hhcmFjdGVycyBhcmUgY29udmVydGVkIGludG8gdGhyZWVcclxuICAgICAqIGJ5dGVzLiAgSWYgdGhlIGVuY29kZXIgZGlkIG5vdCBhcHBseSBwYWRkaW5nLCB0aGUgaW5wdXQgbGVuZ3RoIG1heSBub3RcclxuICAgICAqIGJlIGEgbXVsdGlwbGUgb2YgNC5cclxuICAgICAqXHJcbiAgICAgKiBJbiB0aGlzIGNhc2UsIHRoZSBsYXN0IGdyb3VwIHdpbGwgaGF2ZSBmZXdlciB0aGFuIDQgY2hhcmFjdGVycywgYW5kXHJcbiAgICAgKiBwYWRkaW5nIHdpbGwgYmUgaW5mZXJyZWQuICBJZiB0aGUgZ3JvdXAgaGFzIG9uZSBvciB0d28gY2hhcmFjdGVycywgaXQgZGVjb2Rlc1xyXG4gICAgICogdG8gb25lIGJ5dGUuICBJZiB0aGUgZ3JvdXAgaGFzIHRocmVlIGNoYXJhY3RlcnMsIGl0IGRlY29kZXMgdG8gdHdvIGJ5dGVzLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBpbnB1dCBJbnB1dCB0byBkZWNvZGUuXHJcbiAgICAgKiBAcGFyYW0gd2ViU2FmZSBUcnVlIGlmIHdlIHNob3VsZCB1c2UgdGhlIHdlYi1zYWZlIGFscGhhYmV0LlxyXG4gICAgICogQHJldHVybiBieXRlcyByZXByZXNlbnRpbmcgdGhlIGRlY29kZWQgdmFsdWUuXHJcbiAgICAgKi9cclxuICAgIGRlY29kZVN0cmluZ1RvQnl0ZUFycmF5KGlucHV0LCB3ZWJTYWZlKSB7XHJcbiAgICAgICAgdGhpcy5pbml0XygpO1xyXG4gICAgICAgIGNvbnN0IGNoYXJUb0J5dGVNYXAgPSB3ZWJTYWZlXHJcbiAgICAgICAgICAgID8gdGhpcy5jaGFyVG9CeXRlTWFwV2ViU2FmZV9cclxuICAgICAgICAgICAgOiB0aGlzLmNoYXJUb0J5dGVNYXBfO1xyXG4gICAgICAgIGNvbnN0IG91dHB1dCA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5wdXQubGVuZ3RoOykge1xyXG4gICAgICAgICAgICBjb25zdCBieXRlMSA9IGNoYXJUb0J5dGVNYXBbaW5wdXQuY2hhckF0KGkrKyldO1xyXG4gICAgICAgICAgICBjb25zdCBoYXZlQnl0ZTIgPSBpIDwgaW5wdXQubGVuZ3RoO1xyXG4gICAgICAgICAgICBjb25zdCBieXRlMiA9IGhhdmVCeXRlMiA/IGNoYXJUb0J5dGVNYXBbaW5wdXQuY2hhckF0KGkpXSA6IDA7XHJcbiAgICAgICAgICAgICsraTtcclxuICAgICAgICAgICAgY29uc3QgaGF2ZUJ5dGUzID0gaSA8IGlucHV0Lmxlbmd0aDtcclxuICAgICAgICAgICAgY29uc3QgYnl0ZTMgPSBoYXZlQnl0ZTMgPyBjaGFyVG9CeXRlTWFwW2lucHV0LmNoYXJBdChpKV0gOiA2NDtcclxuICAgICAgICAgICAgKytpO1xyXG4gICAgICAgICAgICBjb25zdCBoYXZlQnl0ZTQgPSBpIDwgaW5wdXQubGVuZ3RoO1xyXG4gICAgICAgICAgICBjb25zdCBieXRlNCA9IGhhdmVCeXRlNCA/IGNoYXJUb0J5dGVNYXBbaW5wdXQuY2hhckF0KGkpXSA6IDY0O1xyXG4gICAgICAgICAgICArK2k7XHJcbiAgICAgICAgICAgIGlmIChieXRlMSA9PSBudWxsIHx8IGJ5dGUyID09IG51bGwgfHwgYnl0ZTMgPT0gbnVsbCB8fCBieXRlNCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IG91dEJ5dGUxID0gKGJ5dGUxIDw8IDIpIHwgKGJ5dGUyID4+IDQpO1xyXG4gICAgICAgICAgICBvdXRwdXQucHVzaChvdXRCeXRlMSk7XHJcbiAgICAgICAgICAgIGlmIChieXRlMyAhPT0gNjQpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG91dEJ5dGUyID0gKChieXRlMiA8PCA0KSAmIDB4ZjApIHwgKGJ5dGUzID4+IDIpO1xyXG4gICAgICAgICAgICAgICAgb3V0cHV0LnB1c2gob3V0Qnl0ZTIpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGJ5dGU0ICE9PSA2NCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG91dEJ5dGUzID0gKChieXRlMyA8PCA2KSAmIDB4YzApIHwgYnl0ZTQ7XHJcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0LnB1c2gob3V0Qnl0ZTMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBvdXRwdXQ7XHJcbiAgICB9LFxyXG4gICAgLyoqXHJcbiAgICAgKiBMYXp5IHN0YXRpYyBpbml0aWFsaXphdGlvbiBmdW5jdGlvbi4gQ2FsbGVkIGJlZm9yZVxyXG4gICAgICogYWNjZXNzaW5nIGFueSBvZiB0aGUgc3RhdGljIG1hcCB2YXJpYWJsZXMuXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBpbml0XygpIHtcclxuICAgICAgICBpZiAoIXRoaXMuYnl0ZVRvQ2hhck1hcF8pIHtcclxuICAgICAgICAgICAgdGhpcy5ieXRlVG9DaGFyTWFwXyA9IHt9O1xyXG4gICAgICAgICAgICB0aGlzLmNoYXJUb0J5dGVNYXBfID0ge307XHJcbiAgICAgICAgICAgIHRoaXMuYnl0ZVRvQ2hhck1hcFdlYlNhZmVfID0ge307XHJcbiAgICAgICAgICAgIHRoaXMuY2hhclRvQnl0ZU1hcFdlYlNhZmVfID0ge307XHJcbiAgICAgICAgICAgIC8vIFdlIHdhbnQgcXVpY2sgbWFwcGluZ3MgYmFjayBhbmQgZm9ydGgsIHNvIHdlIHByZWNvbXB1dGUgdHdvIG1hcHMuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5FTkNPREVEX1ZBTFMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYnl0ZVRvQ2hhck1hcF9baV0gPSB0aGlzLkVOQ09ERURfVkFMUy5jaGFyQXQoaSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNoYXJUb0J5dGVNYXBfW3RoaXMuYnl0ZVRvQ2hhck1hcF9baV1dID0gaTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYnl0ZVRvQ2hhck1hcFdlYlNhZmVfW2ldID0gdGhpcy5FTkNPREVEX1ZBTFNfV0VCU0FGRS5jaGFyQXQoaSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNoYXJUb0J5dGVNYXBXZWJTYWZlX1t0aGlzLmJ5dGVUb0NoYXJNYXBXZWJTYWZlX1tpXV0gPSBpO1xyXG4gICAgICAgICAgICAgICAgLy8gQmUgZm9yZ2l2aW5nIHdoZW4gZGVjb2RpbmcgYW5kIGNvcnJlY3RseSBkZWNvZGUgYm90aCBlbmNvZGluZ3MuXHJcbiAgICAgICAgICAgICAgICBpZiAoaSA+PSB0aGlzLkVOQ09ERURfVkFMU19CQVNFLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hhclRvQnl0ZU1hcF9bdGhpcy5FTkNPREVEX1ZBTFNfV0VCU0FGRS5jaGFyQXQoaSldID0gaTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYXJUb0J5dGVNYXBXZWJTYWZlX1t0aGlzLkVOQ09ERURfVkFMUy5jaGFyQXQoaSldID0gaTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufTtcclxuLyoqXHJcbiAqIFVSTC1zYWZlIGJhc2U2NCBlbmNvZGluZ1xyXG4gKi9cclxuY29uc3QgYmFzZTY0RW5jb2RlID0gZnVuY3Rpb24gKHN0cikge1xyXG4gICAgY29uc3QgdXRmOEJ5dGVzID0gc3RyaW5nVG9CeXRlQXJyYXkkMShzdHIpO1xyXG4gICAgcmV0dXJuIGJhc2U2NC5lbmNvZGVCeXRlQXJyYXkodXRmOEJ5dGVzLCB0cnVlKTtcclxufTtcclxuLyoqXHJcbiAqIFVSTC1zYWZlIGJhc2U2NCBlbmNvZGluZyAod2l0aG91dCBcIi5cIiBwYWRkaW5nIGluIHRoZSBlbmQpLlxyXG4gKiBlLmcuIFVzZWQgaW4gSlNPTiBXZWIgVG9rZW4gKEpXVCkgcGFydHMuXHJcbiAqL1xyXG5jb25zdCBiYXNlNjR1cmxFbmNvZGVXaXRob3V0UGFkZGluZyA9IGZ1bmN0aW9uIChzdHIpIHtcclxuICAgIC8vIFVzZSBiYXNlNjR1cmwgZW5jb2RpbmcgYW5kIHJlbW92ZSBwYWRkaW5nIGluIHRoZSBlbmQgKGRvdCBjaGFyYWN0ZXJzKS5cclxuICAgIHJldHVybiBiYXNlNjRFbmNvZGUoc3RyKS5yZXBsYWNlKC9cXC4vZywgJycpO1xyXG59O1xyXG4vKipcclxuICogVVJMLXNhZmUgYmFzZTY0IGRlY29kaW5nXHJcbiAqXHJcbiAqIE5PVEU6IERPIE5PVCB1c2UgdGhlIGdsb2JhbCBhdG9iKCkgZnVuY3Rpb24gLSBpdCBkb2VzIE5PVCBzdXBwb3J0IHRoZVxyXG4gKiBiYXNlNjRVcmwgdmFyaWFudCBlbmNvZGluZy5cclxuICpcclxuICogQHBhcmFtIHN0ciBUbyBiZSBkZWNvZGVkXHJcbiAqIEByZXR1cm4gRGVjb2RlZCByZXN1bHQsIGlmIHBvc3NpYmxlXHJcbiAqL1xyXG5jb25zdCBiYXNlNjREZWNvZGUgPSBmdW5jdGlvbiAoc3RyKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHJldHVybiBiYXNlNjQuZGVjb2RlU3RyaW5nKHN0ciwgdHJ1ZSk7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ2Jhc2U2NERlY29kZSBmYWlsZWQ6ICcsIGUpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGw7XHJcbn07XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbi8qKlxyXG4gKiBEbyBhIGRlZXAtY29weSBvZiBiYXNpYyBKYXZhU2NyaXB0IE9iamVjdHMgb3IgQXJyYXlzLlxyXG4gKi9cclxuZnVuY3Rpb24gZGVlcENvcHkodmFsdWUpIHtcclxuICAgIHJldHVybiBkZWVwRXh0ZW5kKHVuZGVmaW5lZCwgdmFsdWUpO1xyXG59XHJcbi8qKlxyXG4gKiBDb3B5IHByb3BlcnRpZXMgZnJvbSBzb3VyY2UgdG8gdGFyZ2V0IChyZWN1cnNpdmVseSBhbGxvd3MgZXh0ZW5zaW9uXHJcbiAqIG9mIE9iamVjdHMgYW5kIEFycmF5cykuICBTY2FsYXIgdmFsdWVzIGluIHRoZSB0YXJnZXQgYXJlIG92ZXItd3JpdHRlbi5cclxuICogSWYgdGFyZ2V0IGlzIHVuZGVmaW5lZCwgYW4gb2JqZWN0IG9mIHRoZSBhcHByb3ByaWF0ZSB0eXBlIHdpbGwgYmUgY3JlYXRlZFxyXG4gKiAoYW5kIHJldHVybmVkKS5cclxuICpcclxuICogV2UgcmVjdXJzaXZlbHkgY29weSBhbGwgY2hpbGQgcHJvcGVydGllcyBvZiBwbGFpbiBPYmplY3RzIGluIHRoZSBzb3VyY2UtIHNvXHJcbiAqIHRoYXQgbmFtZXNwYWNlLSBsaWtlIGRpY3Rpb25hcmllcyBhcmUgbWVyZ2VkLlxyXG4gKlxyXG4gKiBOb3RlIHRoYXQgdGhlIHRhcmdldCBjYW4gYmUgYSBmdW5jdGlvbiwgaW4gd2hpY2ggY2FzZSB0aGUgcHJvcGVydGllcyBpblxyXG4gKiB0aGUgc291cmNlIE9iamVjdCBhcmUgY29waWVkIG9udG8gaXQgYXMgc3RhdGljIHByb3BlcnRpZXMgb2YgdGhlIEZ1bmN0aW9uLlxyXG4gKlxyXG4gKiBOb3RlOiB3ZSBkb24ndCBtZXJnZSBfX3Byb3RvX18gdG8gcHJldmVudCBwcm90b3R5cGUgcG9sbHV0aW9uXHJcbiAqL1xyXG5mdW5jdGlvbiBkZWVwRXh0ZW5kKHRhcmdldCwgc291cmNlKSB7XHJcbiAgICBpZiAoIShzb3VyY2UgaW5zdGFuY2VvZiBPYmplY3QpKSB7XHJcbiAgICAgICAgcmV0dXJuIHNvdXJjZTtcclxuICAgIH1cclxuICAgIHN3aXRjaCAoc291cmNlLmNvbnN0cnVjdG9yKSB7XHJcbiAgICAgICAgY2FzZSBEYXRlOlxyXG4gICAgICAgICAgICAvLyBUcmVhdCBEYXRlcyBsaWtlIHNjYWxhcnM7IGlmIHRoZSB0YXJnZXQgZGF0ZSBvYmplY3QgaGFkIGFueSBjaGlsZFxyXG4gICAgICAgICAgICAvLyBwcm9wZXJ0aWVzIC0gdGhleSB3aWxsIGJlIGxvc3QhXHJcbiAgICAgICAgICAgIGNvbnN0IGRhdGVWYWx1ZSA9IHNvdXJjZTtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBEYXRlKGRhdGVWYWx1ZS5nZXRUaW1lKCkpO1xyXG4gICAgICAgIGNhc2UgT2JqZWN0OlxyXG4gICAgICAgICAgICBpZiAodGFyZ2V0ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHRhcmdldCA9IHt9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgQXJyYXk6XHJcbiAgICAgICAgICAgIC8vIEFsd2F5cyBjb3B5IHRoZSBhcnJheSBzb3VyY2UgYW5kIG92ZXJ3cml0ZSB0aGUgdGFyZ2V0LlxyXG4gICAgICAgICAgICB0YXJnZXQgPSBbXTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgLy8gTm90IGEgcGxhaW4gT2JqZWN0IC0gdHJlYXQgaXQgYXMgYSBzY2FsYXIuXHJcbiAgICAgICAgICAgIHJldHVybiBzb3VyY2U7XHJcbiAgICB9XHJcbiAgICBmb3IgKGNvbnN0IHByb3AgaW4gc291cmNlKSB7XHJcbiAgICAgICAgLy8gdXNlIGlzVmFsaWRLZXkgdG8gZ3VhcmQgYWdhaW5zdCBwcm90b3R5cGUgcG9sbHV0aW9uLiBTZWUgaHR0cHM6Ly9zbnlrLmlvL3Z1bG4vU05ZSy1KUy1MT0RBU0gtNDUwMjAyXHJcbiAgICAgICAgaWYgKCFzb3VyY2UuaGFzT3duUHJvcGVydHkocHJvcCkgfHwgIWlzVmFsaWRLZXkocHJvcCkpIHtcclxuICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRhcmdldFtwcm9wXSA9IGRlZXBFeHRlbmQodGFyZ2V0W3Byb3BdLCBzb3VyY2VbcHJvcF0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRhcmdldDtcclxufVxyXG5mdW5jdGlvbiBpc1ZhbGlkS2V5KGtleSkge1xyXG4gICAgcmV0dXJuIGtleSAhPT0gJ19fcHJvdG9fXyc7XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqXHJcbiAqIFJldHVybnMgbmF2aWdhdG9yLnVzZXJBZ2VudCBzdHJpbmcgb3IgJycgaWYgaXQncyBub3QgZGVmaW5lZC5cclxuICogQHJldHVybiB1c2VyIGFnZW50IHN0cmluZ1xyXG4gKi9cclxuZnVuY3Rpb24gZ2V0VUEoKSB7XHJcbiAgICBpZiAodHlwZW9mIG5hdmlnYXRvciAhPT0gJ3VuZGVmaW5lZCcgJiZcclxuICAgICAgICB0eXBlb2YgbmF2aWdhdG9yWyd1c2VyQWdlbnQnXSA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICByZXR1cm4gbmF2aWdhdG9yWyd1c2VyQWdlbnQnXTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHJldHVybiAnJztcclxuICAgIH1cclxufVxyXG4vKipcclxuICogRGV0ZWN0IENvcmRvdmEgLyBQaG9uZUdhcCAvIElvbmljIGZyYW1ld29ya3Mgb24gYSBtb2JpbGUgZGV2aWNlLlxyXG4gKlxyXG4gKiBEZWxpYmVyYXRlbHkgZG9lcyBub3QgcmVseSBvbiBjaGVja2luZyBgZmlsZTovL2AgVVJMcyAoYXMgdGhpcyBmYWlscyBQaG9uZUdhcFxyXG4gKiBpbiB0aGUgUmlwcGxlIGVtdWxhdG9yKSBub3IgQ29yZG92YSBgb25EZXZpY2VSZWFkeWAsIHdoaWNoIHdvdWxkIG5vcm1hbGx5XHJcbiAqIHdhaXQgZm9yIGEgY2FsbGJhY2suXHJcbiAqL1xyXG5mdW5jdGlvbiBpc01vYmlsZUNvcmRvdmEoKSB7XHJcbiAgICByZXR1cm4gKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmXHJcbiAgICAgICAgLy8gQHRzLWlnbm9yZSBTZXR0aW5nIHVwIGFuIGJyb2FkbHkgYXBwbGljYWJsZSBpbmRleCBzaWduYXR1cmUgZm9yIFdpbmRvd1xyXG4gICAgICAgIC8vIGp1c3QgdG8gZGVhbCB3aXRoIHRoaXMgY2FzZSB3b3VsZCBwcm9iYWJseSBiZSBhIGJhZCBpZGVhLlxyXG4gICAgICAgICEhKHdpbmRvd1snY29yZG92YSddIHx8IHdpbmRvd1sncGhvbmVnYXAnXSB8fCB3aW5kb3dbJ1Bob25lR2FwJ10pICYmXHJcbiAgICAgICAgL2lvc3xpcGhvbmV8aXBvZHxpcGFkfGFuZHJvaWR8YmxhY2tiZXJyeXxpZW1vYmlsZS9pLnRlc3QoZ2V0VUEoKSkpO1xyXG59XHJcbi8qKlxyXG4gKiBEZXRlY3QgTm9kZS5qcy5cclxuICpcclxuICogQHJldHVybiB0cnVlIGlmIE5vZGUuanMgZW52aXJvbm1lbnQgaXMgZGV0ZWN0ZWQuXHJcbiAqL1xyXG4vLyBOb2RlIGRldGVjdGlvbiBsb2dpYyBmcm9tOiBodHRwczovL2dpdGh1Yi5jb20vaWxpYWthbi9kZXRlY3Qtbm9kZS9cclxuZnVuY3Rpb24gaXNOb2RlKCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICByZXR1cm4gKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChnbG9iYWwucHJvY2VzcykgPT09ICdbb2JqZWN0IHByb2Nlc3NdJyk7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxufVxyXG4vKipcclxuICogRGV0ZWN0IEJyb3dzZXIgRW52aXJvbm1lbnRcclxuICovXHJcbmZ1bmN0aW9uIGlzQnJvd3NlcigpIHtcclxuICAgIHJldHVybiB0eXBlb2Ygc2VsZiA9PT0gJ29iamVjdCcgJiYgc2VsZi5zZWxmID09PSBzZWxmO1xyXG59XHJcbmZ1bmN0aW9uIGlzQnJvd3NlckV4dGVuc2lvbigpIHtcclxuICAgIGNvbnN0IHJ1bnRpbWUgPSB0eXBlb2YgY2hyb21lID09PSAnb2JqZWN0J1xyXG4gICAgICAgID8gY2hyb21lLnJ1bnRpbWVcclxuICAgICAgICA6IHR5cGVvZiBicm93c2VyID09PSAnb2JqZWN0J1xyXG4gICAgICAgICAgICA/IGJyb3dzZXIucnVudGltZVxyXG4gICAgICAgICAgICA6IHVuZGVmaW5lZDtcclxuICAgIHJldHVybiB0eXBlb2YgcnVudGltZSA9PT0gJ29iamVjdCcgJiYgcnVudGltZS5pZCAhPT0gdW5kZWZpbmVkO1xyXG59XHJcbi8qKlxyXG4gKiBEZXRlY3QgUmVhY3QgTmF0aXZlLlxyXG4gKlxyXG4gKiBAcmV0dXJuIHRydWUgaWYgUmVhY3ROYXRpdmUgZW52aXJvbm1lbnQgaXMgZGV0ZWN0ZWQuXHJcbiAqL1xyXG5mdW5jdGlvbiBpc1JlYWN0TmF0aXZlKCkge1xyXG4gICAgcmV0dXJuICh0eXBlb2YgbmF2aWdhdG9yID09PSAnb2JqZWN0JyAmJiBuYXZpZ2F0b3JbJ3Byb2R1Y3QnXSA9PT0gJ1JlYWN0TmF0aXZlJyk7XHJcbn1cclxuLyoqIERldGVjdHMgRWxlY3Ryb24gYXBwcy4gKi9cclxuZnVuY3Rpb24gaXNFbGVjdHJvbigpIHtcclxuICAgIHJldHVybiBnZXRVQSgpLmluZGV4T2YoJ0VsZWN0cm9uLycpID49IDA7XHJcbn1cclxuLyoqIERldGVjdHMgSW50ZXJuZXQgRXhwbG9yZXIuICovXHJcbmZ1bmN0aW9uIGlzSUUoKSB7XHJcbiAgICBjb25zdCB1YSA9IGdldFVBKCk7XHJcbiAgICByZXR1cm4gdWEuaW5kZXhPZignTVNJRSAnKSA+PSAwIHx8IHVhLmluZGV4T2YoJ1RyaWRlbnQvJykgPj0gMDtcclxufVxyXG4vKiogRGV0ZWN0cyBVbml2ZXJzYWwgV2luZG93cyBQbGF0Zm9ybSBhcHBzLiAqL1xyXG5mdW5jdGlvbiBpc1VXUCgpIHtcclxuICAgIHJldHVybiBnZXRVQSgpLmluZGV4T2YoJ01TQXBwSG9zdC8nKSA+PSAwO1xyXG59XHJcbi8qKlxyXG4gKiBEZXRlY3Qgd2hldGhlciB0aGUgY3VycmVudCBTREsgYnVpbGQgaXMgdGhlIE5vZGUgdmVyc2lvbi5cclxuICpcclxuICogQHJldHVybiB0cnVlIGlmIGl0J3MgdGhlIE5vZGUgU0RLIGJ1aWxkLlxyXG4gKi9cclxuZnVuY3Rpb24gaXNOb2RlU2RrKCkge1xyXG4gICAgcmV0dXJuIENPTlNUQU5UUy5OT0RFX0NMSUVOVCA9PT0gdHJ1ZSB8fCBDT05TVEFOVFMuTk9ERV9BRE1JTiA9PT0gdHJ1ZTtcclxufVxyXG4vKiogUmV0dXJucyB0cnVlIGlmIHdlIGFyZSBydW5uaW5nIGluIFNhZmFyaS4gKi9cclxuZnVuY3Rpb24gaXNTYWZhcmkoKSB7XHJcbiAgICByZXR1cm4gKCFpc05vZGUoKSAmJlxyXG4gICAgICAgIG5hdmlnYXRvci51c2VyQWdlbnQuaW5jbHVkZXMoJ1NhZmFyaScpICYmXHJcbiAgICAgICAgIW5hdmlnYXRvci51c2VyQWdlbnQuaW5jbHVkZXMoJ0Nocm9tZScpKTtcclxufVxyXG4vKipcclxuICogVGhpcyBtZXRob2QgY2hlY2tzIGlmIGluZGV4ZWREQiBpcyBzdXBwb3J0ZWQgYnkgY3VycmVudCBicm93c2VyL3NlcnZpY2Ugd29ya2VyIGNvbnRleHRcclxuICogQHJldHVybiB0cnVlIGlmIGluZGV4ZWREQiBpcyBzdXBwb3J0ZWQgYnkgY3VycmVudCBicm93c2VyL3NlcnZpY2Ugd29ya2VyIGNvbnRleHRcclxuICovXHJcbmZ1bmN0aW9uIGlzSW5kZXhlZERCQXZhaWxhYmxlKCkge1xyXG4gICAgcmV0dXJuIHR5cGVvZiBpbmRleGVkREIgPT09ICdvYmplY3QnO1xyXG59XHJcbi8qKlxyXG4gKiBUaGlzIG1ldGhvZCB2YWxpZGF0ZXMgYnJvd3Nlci9zdyBjb250ZXh0IGZvciBpbmRleGVkREIgYnkgb3BlbmluZyBhIGR1bW15IGluZGV4ZWREQiBkYXRhYmFzZSBhbmQgcmVqZWN0XHJcbiAqIGlmIGVycm9ycyBvY2N1ciBkdXJpbmcgdGhlIGRhdGFiYXNlIG9wZW4gb3BlcmF0aW9uLlxyXG4gKlxyXG4gKiBAdGhyb3dzIGV4Y2VwdGlvbiBpZiBjdXJyZW50IGJyb3dzZXIvc3cgY29udGV4dCBjYW4ndCBydW4gaWRiLm9wZW4gKGV4OiBTYWZhcmkgaWZyYW1lLCBGaXJlZm94XHJcbiAqIHByaXZhdGUgYnJvd3NpbmcpXHJcbiAqL1xyXG5mdW5jdGlvbiB2YWxpZGF0ZUluZGV4ZWREQk9wZW5hYmxlKCkge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBsZXQgcHJlRXhpc3QgPSB0cnVlO1xyXG4gICAgICAgICAgICBjb25zdCBEQl9DSEVDS19OQU1FID0gJ3ZhbGlkYXRlLWJyb3dzZXItY29udGV4dC1mb3ItaW5kZXhlZGRiLWFuYWx5dGljcy1tb2R1bGUnO1xyXG4gICAgICAgICAgICBjb25zdCByZXF1ZXN0ID0gc2VsZi5pbmRleGVkREIub3BlbihEQl9DSEVDS19OQU1FKTtcclxuICAgICAgICAgICAgcmVxdWVzdC5vbnN1Y2Nlc3MgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXF1ZXN0LnJlc3VsdC5jbG9zZSgpO1xyXG4gICAgICAgICAgICAgICAgLy8gZGVsZXRlIGRhdGFiYXNlIG9ubHkgd2hlbiBpdCBkb2Vzbid0IHByZS1leGlzdFxyXG4gICAgICAgICAgICAgICAgaWYgKCFwcmVFeGlzdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuaW5kZXhlZERCLmRlbGV0ZURhdGFiYXNlKERCX0NIRUNLX05BTUUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh0cnVlKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmVxdWVzdC5vbnVwZ3JhZGVuZWVkZWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBwcmVFeGlzdCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXF1ZXN0Lm9uZXJyb3IgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB2YXIgX2E7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoKChfYSA9IHJlcXVlc3QuZXJyb3IpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5tZXNzYWdlKSB8fCAnJyk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICByZWplY3QoZXJyb3IpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59XHJcbi8qKlxyXG4gKlxyXG4gKiBUaGlzIG1ldGhvZCBjaGVja3Mgd2hldGhlciBjb29raWUgaXMgZW5hYmxlZCB3aXRoaW4gY3VycmVudCBicm93c2VyXHJcbiAqIEByZXR1cm4gdHJ1ZSBpZiBjb29raWUgaXMgZW5hYmxlZCB3aXRoaW4gY3VycmVudCBicm93c2VyXHJcbiAqL1xyXG5mdW5jdGlvbiBhcmVDb29raWVzRW5hYmxlZCgpIHtcclxuICAgIGlmICh0eXBlb2YgbmF2aWdhdG9yID09PSAndW5kZWZpbmVkJyB8fCAhbmF2aWdhdG9yLmNvb2tpZUVuYWJsZWQpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxufVxyXG4vKipcclxuICogUG9seWZpbGwgZm9yIGBnbG9iYWxUaGlzYCBvYmplY3QuXHJcbiAqIEByZXR1cm5zIHRoZSBgZ2xvYmFsVGhpc2Agb2JqZWN0IGZvciB0aGUgZ2l2ZW4gZW52aXJvbm1lbnQuXHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRHbG9iYWwoKSB7XHJcbiAgICBpZiAodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgcmV0dXJuIHNlbGY7XHJcbiAgICB9XHJcbiAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICByZXR1cm4gd2luZG93O1xyXG4gICAgfVxyXG4gICAgaWYgKHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgcmV0dXJuIGdsb2JhbDtcclxuICAgIH1cclxuICAgIHRocm93IG5ldyBFcnJvcignVW5hYmxlIHRvIGxvY2F0ZSBnbG9iYWwgb2JqZWN0LicpO1xyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAyMiBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbmNvbnN0IGdldERlZmF1bHRzRnJvbUdsb2JhbCA9ICgpID0+IGdldEdsb2JhbCgpLl9fRklSRUJBU0VfREVGQVVMVFNfXztcclxuLyoqXHJcbiAqIEF0dGVtcHQgdG8gcmVhZCBkZWZhdWx0cyBmcm9tIGEgSlNPTiBzdHJpbmcgcHJvdmlkZWQgdG9cclxuICogcHJvY2Vzcy5lbnYuX19GSVJFQkFTRV9ERUZBVUxUU19fIG9yIGEgSlNPTiBmaWxlIHdob3NlIHBhdGggaXMgaW5cclxuICogcHJvY2Vzcy5lbnYuX19GSVJFQkFTRV9ERUZBVUxUU19QQVRIX19cclxuICovXHJcbmNvbnN0IGdldERlZmF1bHRzRnJvbUVudlZhcmlhYmxlID0gKCkgPT4ge1xyXG4gICAgaWYgKHR5cGVvZiBwcm9jZXNzID09PSAndW5kZWZpbmVkJyB8fCB0eXBlb2YgcHJvY2Vzcy5lbnYgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgY29uc3QgZGVmYXVsdHNKc29uU3RyaW5nID0gcHJvY2Vzcy5lbnYuX19GSVJFQkFTRV9ERUZBVUxUU19fO1xyXG4gICAgaWYgKGRlZmF1bHRzSnNvblN0cmluZykge1xyXG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKGRlZmF1bHRzSnNvblN0cmluZyk7XHJcbiAgICB9XHJcbn07XHJcbmNvbnN0IGdldERlZmF1bHRzRnJvbUNvb2tpZSA9ICgpID0+IHtcclxuICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgbGV0IG1hdGNoO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBtYXRjaCA9IGRvY3VtZW50LmNvb2tpZS5tYXRjaCgvX19GSVJFQkFTRV9ERUZBVUxUU19fPShbXjtdKykvKTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgLy8gU29tZSBlbnZpcm9ubWVudHMgc3VjaCBhcyBBbmd1bGFyIFVuaXZlcnNhbCBTU1IgaGF2ZSBhXHJcbiAgICAgICAgLy8gYGRvY3VtZW50YCBvYmplY3QgYnV0IGVycm9yIG9uIGFjY2Vzc2luZyBgZG9jdW1lbnQuY29va2llYC5cclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBjb25zdCBkZWNvZGVkID0gbWF0Y2ggJiYgYmFzZTY0RGVjb2RlKG1hdGNoWzFdKTtcclxuICAgIHJldHVybiBkZWNvZGVkICYmIEpTT04ucGFyc2UoZGVjb2RlZCk7XHJcbn07XHJcbi8qKlxyXG4gKiBHZXQgdGhlIF9fRklSRUJBU0VfREVGQVVMVFNfXyBvYmplY3QuIEl0IGNoZWNrcyBpbiBvcmRlcjpcclxuICogKDEpIGlmIHN1Y2ggYW4gb2JqZWN0IGV4aXN0cyBhcyBhIHByb3BlcnR5IG9mIGBnbG9iYWxUaGlzYFxyXG4gKiAoMikgaWYgc3VjaCBhbiBvYmplY3Qgd2FzIHByb3ZpZGVkIG9uIGEgc2hlbGwgZW52aXJvbm1lbnQgdmFyaWFibGVcclxuICogKDMpIGlmIHN1Y2ggYW4gb2JqZWN0IGV4aXN0cyBpbiBhIGNvb2tpZVxyXG4gKi9cclxuY29uc3QgZ2V0RGVmYXVsdHMgPSAoKSA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHJldHVybiAoZ2V0RGVmYXVsdHNGcm9tR2xvYmFsKCkgfHxcclxuICAgICAgICAgICAgZ2V0RGVmYXVsdHNGcm9tRW52VmFyaWFibGUoKSB8fFxyXG4gICAgICAgICAgICBnZXREZWZhdWx0c0Zyb21Db29raWUoKSk7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIENhdGNoLWFsbCBmb3IgYmVpbmcgdW5hYmxlIHRvIGdldCBfX0ZJUkVCQVNFX0RFRkFVTFRTX18gZHVlXHJcbiAgICAgICAgICogdG8gYW55IGVudmlyb25tZW50IGNhc2Ugd2UgaGF2ZSBub3QgYWNjb3VudGVkIGZvci4gTG9nIHRvXHJcbiAgICAgICAgICogaW5mbyBpbnN0ZWFkIG9mIHN3YWxsb3dpbmcgc28gd2UgY2FuIGZpbmQgdGhlc2UgdW5rbm93biBjYXNlc1xyXG4gICAgICAgICAqIGFuZCBhZGQgcGF0aHMgZm9yIHRoZW0gaWYgbmVlZGVkLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGNvbnNvbGUuaW5mbyhgVW5hYmxlIHRvIGdldCBfX0ZJUkVCQVNFX0RFRkFVTFRTX18gZHVlIHRvOiAke2V9YCk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG59O1xyXG4vKipcclxuICogUmV0dXJucyBlbXVsYXRvciBob3N0IHN0b3JlZCBpbiB0aGUgX19GSVJFQkFTRV9ERUZBVUxUU19fIG9iamVjdFxyXG4gKiBmb3IgdGhlIGdpdmVuIHByb2R1Y3QuXHJcbiAqIEByZXR1cm5zIGEgVVJMIGhvc3QgZm9ybWF0dGVkIGxpa2UgYDEyNy4wLjAuMTo5OTk5YCBvciBgWzo6MV06NDAwMGAgaWYgYXZhaWxhYmxlXHJcbiAqIEBwdWJsaWNcclxuICovXHJcbmNvbnN0IGdldERlZmF1bHRFbXVsYXRvckhvc3QgPSAocHJvZHVjdE5hbWUpID0+IHsgdmFyIF9hLCBfYjsgcmV0dXJuIChfYiA9IChfYSA9IGdldERlZmF1bHRzKCkpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5lbXVsYXRvckhvc3RzKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2JbcHJvZHVjdE5hbWVdOyB9O1xyXG4vKipcclxuICogUmV0dXJucyBlbXVsYXRvciBob3N0bmFtZSBhbmQgcG9ydCBzdG9yZWQgaW4gdGhlIF9fRklSRUJBU0VfREVGQVVMVFNfXyBvYmplY3RcclxuICogZm9yIHRoZSBnaXZlbiBwcm9kdWN0LlxyXG4gKiBAcmV0dXJucyBhIHBhaXIgb2YgaG9zdG5hbWUgYW5kIHBvcnQgbGlrZSBgW1wiOjoxXCIsIDQwMDBdYCBpZiBhdmFpbGFibGVcclxuICogQHB1YmxpY1xyXG4gKi9cclxuY29uc3QgZ2V0RGVmYXVsdEVtdWxhdG9ySG9zdG5hbWVBbmRQb3J0ID0gKHByb2R1Y3ROYW1lKSA9PiB7XHJcbiAgICBjb25zdCBob3N0ID0gZ2V0RGVmYXVsdEVtdWxhdG9ySG9zdChwcm9kdWN0TmFtZSk7XHJcbiAgICBpZiAoIWhvc3QpIHtcclxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG4gICAgY29uc3Qgc2VwYXJhdG9ySW5kZXggPSBob3N0Lmxhc3RJbmRleE9mKCc6Jyk7IC8vIEZpbmRpbmcgdGhlIGxhc3Qgc2luY2UgSVB2NiBhZGRyIGFsc28gaGFzIGNvbG9ucy5cclxuICAgIGlmIChzZXBhcmF0b3JJbmRleCA8PSAwIHx8IHNlcGFyYXRvckluZGV4ICsgMSA9PT0gaG9zdC5sZW5ndGgpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgaG9zdCAke2hvc3R9IHdpdGggbm8gc2VwYXJhdGUgaG9zdG5hbWUgYW5kIHBvcnQhYCk7XHJcbiAgICB9XHJcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcmVzdHJpY3RlZC1nbG9iYWxzXHJcbiAgICBjb25zdCBwb3J0ID0gcGFyc2VJbnQoaG9zdC5zdWJzdHJpbmcoc2VwYXJhdG9ySW5kZXggKyAxKSwgMTApO1xyXG4gICAgaWYgKGhvc3RbMF0gPT09ICdbJykge1xyXG4gICAgICAgIC8vIEJyYWNrZXQtcXVvdGVkIGBbaXB2NmFkZHJdOnBvcnRgID0+IHJldHVybiBcImlwdjZhZGRyXCIgKHdpdGhvdXQgYnJhY2tldHMpLlxyXG4gICAgICAgIHJldHVybiBbaG9zdC5zdWJzdHJpbmcoMSwgc2VwYXJhdG9ySW5kZXggLSAxKSwgcG9ydF07XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICByZXR1cm4gW2hvc3Quc3Vic3RyaW5nKDAsIHNlcGFyYXRvckluZGV4KSwgcG9ydF07XHJcbiAgICB9XHJcbn07XHJcbi8qKlxyXG4gKiBSZXR1cm5zIEZpcmViYXNlIGFwcCBjb25maWcgc3RvcmVkIGluIHRoZSBfX0ZJUkVCQVNFX0RFRkFVTFRTX18gb2JqZWN0LlxyXG4gKiBAcHVibGljXHJcbiAqL1xyXG5jb25zdCBnZXREZWZhdWx0QXBwQ29uZmlnID0gKCkgPT4geyB2YXIgX2E7IHJldHVybiAoX2EgPSBnZXREZWZhdWx0cygpKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuY29uZmlnOyB9O1xyXG4vKipcclxuICogUmV0dXJucyBhbiBleHBlcmltZW50YWwgc2V0dGluZyBvbiB0aGUgX19GSVJFQkFTRV9ERUZBVUxUU19fIG9iamVjdCAocHJvcGVydGllc1xyXG4gKiBwcmVmaXhlZCBieSBcIl9cIilcclxuICogQHB1YmxpY1xyXG4gKi9cclxuY29uc3QgZ2V0RXhwZXJpbWVudGFsU2V0dGluZyA9IChuYW1lKSA9PiB7IHZhciBfYTsgcmV0dXJuIChfYSA9IGdldERlZmF1bHRzKCkpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYVtgXyR7bmFtZX1gXTsgfTtcblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuY2xhc3MgRGVmZXJyZWQge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5yZWplY3QgPSAoKSA9PiB7IH07XHJcbiAgICAgICAgdGhpcy5yZXNvbHZlID0gKCkgPT4geyB9O1xyXG4gICAgICAgIHRoaXMucHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5yZXNvbHZlID0gcmVzb2x2ZTtcclxuICAgICAgICAgICAgdGhpcy5yZWplY3QgPSByZWplY3Q7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIE91ciBBUEkgaW50ZXJuYWxzIGFyZSBub3QgcHJvbWlzZWlmaWVkIGFuZCBjYW5ub3QgYmVjYXVzZSBvdXIgY2FsbGJhY2sgQVBJcyBoYXZlIHN1YnRsZSBleHBlY3RhdGlvbnMgYXJvdW5kXHJcbiAgICAgKiBpbnZva2luZyBwcm9taXNlcyBpbmxpbmUsIHdoaWNoIFByb21pc2VzIGFyZSBmb3JiaWRkZW4gdG8gZG8uIFRoaXMgbWV0aG9kIGFjY2VwdHMgYW4gb3B0aW9uYWwgbm9kZS1zdHlsZSBjYWxsYmFja1xyXG4gICAgICogYW5kIHJldHVybnMgYSBub2RlLXN0eWxlIGNhbGxiYWNrIHdoaWNoIHdpbGwgcmVzb2x2ZSBvciByZWplY3QgdGhlIERlZmVycmVkJ3MgcHJvbWlzZS5cclxuICAgICAqL1xyXG4gICAgd3JhcENhbGxiYWNrKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgcmV0dXJuIChlcnJvciwgdmFsdWUpID0+IHtcclxuICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlamVjdChlcnJvcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlc29sdmUodmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgIC8vIEF0dGFjaGluZyBub29wIGhhbmRsZXIganVzdCBpbiBjYXNlIGRldmVsb3BlciB3YXNuJ3QgZXhwZWN0aW5nXHJcbiAgICAgICAgICAgICAgICAvLyBwcm9taXNlc1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wcm9taXNlLmNhdGNoKCgpID0+IHsgfSk7XHJcbiAgICAgICAgICAgICAgICAvLyBTb21lIG9mIG91ciBjYWxsYmFja3MgZG9uJ3QgZXhwZWN0IGEgdmFsdWUgYW5kIG91ciBvd24gdGVzdHNcclxuICAgICAgICAgICAgICAgIC8vIGFzc2VydCB0aGF0IHRoZSBwYXJhbWV0ZXIgbGVuZ3RoIGlzIDFcclxuICAgICAgICAgICAgICAgIGlmIChjYWxsYmFjay5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnJvcik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgdmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMjEgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5mdW5jdGlvbiBjcmVhdGVNb2NrVXNlclRva2VuKHRva2VuLCBwcm9qZWN0SWQpIHtcclxuICAgIGlmICh0b2tlbi51aWQpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBcInVpZFwiIGZpZWxkIGlzIG5vIGxvbmdlciBzdXBwb3J0ZWQgYnkgbW9ja1VzZXJUb2tlbi4gUGxlYXNlIHVzZSBcInN1YlwiIGluc3RlYWQgZm9yIEZpcmViYXNlIEF1dGggVXNlciBJRC4nKTtcclxuICAgIH1cclxuICAgIC8vIFVuc2VjdXJlZCBKV1RzIHVzZSBcIm5vbmVcIiBhcyB0aGUgYWxnb3JpdGhtLlxyXG4gICAgY29uc3QgaGVhZGVyID0ge1xyXG4gICAgICAgIGFsZzogJ25vbmUnLFxyXG4gICAgICAgIHR5cGU6ICdKV1QnXHJcbiAgICB9O1xyXG4gICAgY29uc3QgcHJvamVjdCA9IHByb2plY3RJZCB8fCAnZGVtby1wcm9qZWN0JztcclxuICAgIGNvbnN0IGlhdCA9IHRva2VuLmlhdCB8fCAwO1xyXG4gICAgY29uc3Qgc3ViID0gdG9rZW4uc3ViIHx8IHRva2VuLnVzZXJfaWQ7XHJcbiAgICBpZiAoIXN1Yikge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIm1vY2tVc2VyVG9rZW4gbXVzdCBjb250YWluICdzdWInIG9yICd1c2VyX2lkJyBmaWVsZCFcIik7XHJcbiAgICB9XHJcbiAgICBjb25zdCBwYXlsb2FkID0gT2JqZWN0LmFzc2lnbih7IFxyXG4gICAgICAgIC8vIFNldCBhbGwgcmVxdWlyZWQgZmllbGRzIHRvIGRlY2VudCBkZWZhdWx0c1xyXG4gICAgICAgIGlzczogYGh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS8ke3Byb2plY3R9YCwgYXVkOiBwcm9qZWN0LCBpYXQsIGV4cDogaWF0ICsgMzYwMCwgYXV0aF90aW1lOiBpYXQsIHN1YiwgdXNlcl9pZDogc3ViLCBmaXJlYmFzZToge1xyXG4gICAgICAgICAgICBzaWduX2luX3Byb3ZpZGVyOiAnY3VzdG9tJyxcclxuICAgICAgICAgICAgaWRlbnRpdGllczoge31cclxuICAgICAgICB9IH0sIHRva2VuKTtcclxuICAgIC8vIFVuc2VjdXJlZCBKV1RzIHVzZSB0aGUgZW1wdHkgc3RyaW5nIGFzIGEgc2lnbmF0dXJlLlxyXG4gICAgY29uc3Qgc2lnbmF0dXJlID0gJyc7XHJcbiAgICByZXR1cm4gW1xyXG4gICAgICAgIGJhc2U2NHVybEVuY29kZVdpdGhvdXRQYWRkaW5nKEpTT04uc3RyaW5naWZ5KGhlYWRlcikpLFxyXG4gICAgICAgIGJhc2U2NHVybEVuY29kZVdpdGhvdXRQYWRkaW5nKEpTT04uc3RyaW5naWZ5KHBheWxvYWQpKSxcclxuICAgICAgICBzaWduYXR1cmVcclxuICAgIF0uam9pbignLicpO1xyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbi8qKlxyXG4gKiBAZmlsZW92ZXJ2aWV3IFN0YW5kYXJkaXplZCBGaXJlYmFzZSBFcnJvci5cclxuICpcclxuICogVXNhZ2U6XHJcbiAqXHJcbiAqICAgLy8gVHlwZXNjcmlwdCBzdHJpbmcgbGl0ZXJhbHMgZm9yIHR5cGUtc2FmZSBjb2Rlc1xyXG4gKiAgIHR5cGUgRXJyID1cclxuICogICAgICd1bmtub3duJyB8XHJcbiAqICAgICAnb2JqZWN0LW5vdC1mb3VuZCdcclxuICogICAgIDtcclxuICpcclxuICogICAvLyBDbG9zdXJlIGVudW0gZm9yIHR5cGUtc2FmZSBlcnJvciBjb2Rlc1xyXG4gKiAgIC8vIGF0LWVudW0ge3N0cmluZ31cclxuICogICB2YXIgRXJyID0ge1xyXG4gKiAgICAgVU5LTk9XTjogJ3Vua25vd24nLFxyXG4gKiAgICAgT0JKRUNUX05PVF9GT1VORDogJ29iamVjdC1ub3QtZm91bmQnLFxyXG4gKiAgIH1cclxuICpcclxuICogICBsZXQgZXJyb3JzOiBNYXA8RXJyLCBzdHJpbmc+ID0ge1xyXG4gKiAgICAgJ2dlbmVyaWMtZXJyb3InOiBcIlVua25vd24gZXJyb3JcIixcclxuICogICAgICdmaWxlLW5vdC1mb3VuZCc6IFwiQ291bGQgbm90IGZpbmQgZmlsZTogeyRmaWxlfVwiLFxyXG4gKiAgIH07XHJcbiAqXHJcbiAqICAgLy8gVHlwZS1zYWZlIGZ1bmN0aW9uIC0gbXVzdCBwYXNzIGEgdmFsaWQgZXJyb3IgY29kZSBhcyBwYXJhbS5cclxuICogICBsZXQgZXJyb3IgPSBuZXcgRXJyb3JGYWN0b3J5PEVycj4oJ3NlcnZpY2UnLCAnU2VydmljZScsIGVycm9ycyk7XHJcbiAqXHJcbiAqICAgLi4uXHJcbiAqICAgdGhyb3cgZXJyb3IuY3JlYXRlKEVyci5HRU5FUklDKTtcclxuICogICAuLi5cclxuICogICB0aHJvdyBlcnJvci5jcmVhdGUoRXJyLkZJTEVfTk9UX0ZPVU5ELCB7J2ZpbGUnOiBmaWxlTmFtZX0pO1xyXG4gKiAgIC4uLlxyXG4gKiAgIC8vIFNlcnZpY2U6IENvdWxkIG5vdCBmaWxlIGZpbGU6IGZvby50eHQgKHNlcnZpY2UvZmlsZS1ub3QtZm91bmQpLlxyXG4gKlxyXG4gKiAgIGNhdGNoIChlKSB7XHJcbiAqICAgICBhc3NlcnQoZS5tZXNzYWdlID09PSBcIkNvdWxkIG5vdCBmaW5kIGZpbGU6IGZvby50eHQuXCIpO1xyXG4gKiAgICAgaWYgKChlIGFzIEZpcmViYXNlRXJyb3IpPy5jb2RlID09PSAnc2VydmljZS9maWxlLW5vdC1mb3VuZCcpIHtcclxuICogICAgICAgY29uc29sZS5sb2coXCJDb3VsZCBub3QgcmVhZCBmaWxlOiBcIiArIGVbJ2ZpbGUnXSk7XHJcbiAqICAgICB9XHJcbiAqICAgfVxyXG4gKi9cclxuY29uc3QgRVJST1JfTkFNRSA9ICdGaXJlYmFzZUVycm9yJztcclxuLy8gQmFzZWQgb24gY29kZSBmcm9tOlxyXG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9FcnJvciNDdXN0b21fRXJyb3JfVHlwZXNcclxuY2xhc3MgRmlyZWJhc2VFcnJvciBleHRlbmRzIEVycm9yIHtcclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgLyoqIFRoZSBlcnJvciBjb2RlIGZvciB0aGlzIGVycm9yLiAqL1xyXG4gICAgY29kZSwgbWVzc2FnZSwgXHJcbiAgICAvKiogQ3VzdG9tIGRhdGEgZm9yIHRoaXMgZXJyb3IuICovXHJcbiAgICBjdXN0b21EYXRhKSB7XHJcbiAgICAgICAgc3VwZXIobWVzc2FnZSk7XHJcbiAgICAgICAgdGhpcy5jb2RlID0gY29kZTtcclxuICAgICAgICB0aGlzLmN1c3RvbURhdGEgPSBjdXN0b21EYXRhO1xyXG4gICAgICAgIC8qKiBUaGUgY3VzdG9tIG5hbWUgZm9yIGFsbCBGaXJlYmFzZUVycm9ycy4gKi9cclxuICAgICAgICB0aGlzLm5hbWUgPSBFUlJPUl9OQU1FO1xyXG4gICAgICAgIC8vIEZpeCBGb3IgRVM1XHJcbiAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL01pY3Jvc29mdC9UeXBlU2NyaXB0LXdpa2kvYmxvYi9tYXN0ZXIvQnJlYWtpbmctQ2hhbmdlcy5tZCNleHRlbmRpbmctYnVpbHQtaW5zLWxpa2UtZXJyb3ItYXJyYXktYW5kLW1hcC1tYXktbm8tbG9uZ2VyLXdvcmtcclxuICAgICAgICBPYmplY3Quc2V0UHJvdG90eXBlT2YodGhpcywgRmlyZWJhc2VFcnJvci5wcm90b3R5cGUpO1xyXG4gICAgICAgIC8vIE1haW50YWlucyBwcm9wZXIgc3RhY2sgdHJhY2UgZm9yIHdoZXJlIG91ciBlcnJvciB3YXMgdGhyb3duLlxyXG4gICAgICAgIC8vIE9ubHkgYXZhaWxhYmxlIG9uIFY4LlxyXG4gICAgICAgIGlmIChFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSkge1xyXG4gICAgICAgICAgICBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh0aGlzLCBFcnJvckZhY3RvcnkucHJvdG90eXBlLmNyZWF0ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmNsYXNzIEVycm9yRmFjdG9yeSB7XHJcbiAgICBjb25zdHJ1Y3RvcihzZXJ2aWNlLCBzZXJ2aWNlTmFtZSwgZXJyb3JzKSB7XHJcbiAgICAgICAgdGhpcy5zZXJ2aWNlID0gc2VydmljZTtcclxuICAgICAgICB0aGlzLnNlcnZpY2VOYW1lID0gc2VydmljZU5hbWU7XHJcbiAgICAgICAgdGhpcy5lcnJvcnMgPSBlcnJvcnM7XHJcbiAgICB9XHJcbiAgICBjcmVhdGUoY29kZSwgLi4uZGF0YSkge1xyXG4gICAgICAgIGNvbnN0IGN1c3RvbURhdGEgPSBkYXRhWzBdIHx8IHt9O1xyXG4gICAgICAgIGNvbnN0IGZ1bGxDb2RlID0gYCR7dGhpcy5zZXJ2aWNlfS8ke2NvZGV9YDtcclxuICAgICAgICBjb25zdCB0ZW1wbGF0ZSA9IHRoaXMuZXJyb3JzW2NvZGVdO1xyXG4gICAgICAgIGNvbnN0IG1lc3NhZ2UgPSB0ZW1wbGF0ZSA/IHJlcGxhY2VUZW1wbGF0ZSh0ZW1wbGF0ZSwgY3VzdG9tRGF0YSkgOiAnRXJyb3InO1xyXG4gICAgICAgIC8vIFNlcnZpY2UgTmFtZTogRXJyb3IgbWVzc2FnZSAoc2VydmljZS9jb2RlKS5cclxuICAgICAgICBjb25zdCBmdWxsTWVzc2FnZSA9IGAke3RoaXMuc2VydmljZU5hbWV9OiAke21lc3NhZ2V9ICgke2Z1bGxDb2RlfSkuYDtcclxuICAgICAgICBjb25zdCBlcnJvciA9IG5ldyBGaXJlYmFzZUVycm9yKGZ1bGxDb2RlLCBmdWxsTWVzc2FnZSwgY3VzdG9tRGF0YSk7XHJcbiAgICAgICAgcmV0dXJuIGVycm9yO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIHJlcGxhY2VUZW1wbGF0ZSh0ZW1wbGF0ZSwgZGF0YSkge1xyXG4gICAgcmV0dXJuIHRlbXBsYXRlLnJlcGxhY2UoUEFUVEVSTiwgKF8sIGtleSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHZhbHVlID0gZGF0YVtrZXldO1xyXG4gICAgICAgIHJldHVybiB2YWx1ZSAhPSBudWxsID8gU3RyaW5nKHZhbHVlKSA6IGA8JHtrZXl9Pz5gO1xyXG4gICAgfSk7XHJcbn1cclxuY29uc3QgUEFUVEVSTiA9IC9cXHtcXCQoW159XSspfS9nO1xuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG4vKipcclxuICogRXZhbHVhdGVzIGEgSlNPTiBzdHJpbmcgaW50byBhIGphdmFzY3JpcHQgb2JqZWN0LlxyXG4gKlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyIEEgc3RyaW5nIGNvbnRhaW5pbmcgSlNPTi5cclxuICogQHJldHVybiB7Kn0gVGhlIGphdmFzY3JpcHQgb2JqZWN0IHJlcHJlc2VudGluZyB0aGUgc3BlY2lmaWVkIEpTT04uXHJcbiAqL1xyXG5mdW5jdGlvbiBqc29uRXZhbChzdHIpIHtcclxuICAgIHJldHVybiBKU09OLnBhcnNlKHN0cik7XHJcbn1cclxuLyoqXHJcbiAqIFJldHVybnMgSlNPTiByZXByZXNlbnRpbmcgYSBqYXZhc2NyaXB0IG9iamVjdC5cclxuICogQHBhcmFtIHsqfSBkYXRhIEphdmFzY3JpcHQgb2JqZWN0IHRvIGJlIHN0cmluZ2lmaWVkLlxyXG4gKiBAcmV0dXJuIHtzdHJpbmd9IFRoZSBKU09OIGNvbnRlbnRzIG9mIHRoZSBvYmplY3QuXHJcbiAqL1xyXG5mdW5jdGlvbiBzdHJpbmdpZnkoZGF0YSkge1xyXG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGRhdGEpO1xyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbi8qKlxyXG4gKiBEZWNvZGVzIGEgRmlyZWJhc2UgYXV0aC4gdG9rZW4gaW50byBjb25zdGl0dWVudCBwYXJ0cy5cclxuICpcclxuICogTm90ZXM6XHJcbiAqIC0gTWF5IHJldHVybiB3aXRoIGludmFsaWQgLyBpbmNvbXBsZXRlIGNsYWltcyBpZiB0aGVyZSdzIG5vIG5hdGl2ZSBiYXNlNjQgZGVjb2Rpbmcgc3VwcG9ydC5cclxuICogLSBEb2Vzbid0IGNoZWNrIGlmIHRoZSB0b2tlbiBpcyBhY3R1YWxseSB2YWxpZC5cclxuICovXHJcbmNvbnN0IGRlY29kZSA9IGZ1bmN0aW9uICh0b2tlbikge1xyXG4gICAgbGV0IGhlYWRlciA9IHt9LCBjbGFpbXMgPSB7fSwgZGF0YSA9IHt9LCBzaWduYXR1cmUgPSAnJztcclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgcGFydHMgPSB0b2tlbi5zcGxpdCgnLicpO1xyXG4gICAgICAgIGhlYWRlciA9IGpzb25FdmFsKGJhc2U2NERlY29kZShwYXJ0c1swXSkgfHwgJycpO1xyXG4gICAgICAgIGNsYWltcyA9IGpzb25FdmFsKGJhc2U2NERlY29kZShwYXJ0c1sxXSkgfHwgJycpO1xyXG4gICAgICAgIHNpZ25hdHVyZSA9IHBhcnRzWzJdO1xyXG4gICAgICAgIGRhdGEgPSBjbGFpbXNbJ2QnXSB8fCB7fTtcclxuICAgICAgICBkZWxldGUgY2xhaW1zWydkJ107XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZSkgeyB9XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGhlYWRlcixcclxuICAgICAgICBjbGFpbXMsXHJcbiAgICAgICAgZGF0YSxcclxuICAgICAgICBzaWduYXR1cmVcclxuICAgIH07XHJcbn07XHJcbi8qKlxyXG4gKiBEZWNvZGVzIGEgRmlyZWJhc2UgYXV0aC4gdG9rZW4gYW5kIGNoZWNrcyB0aGUgdmFsaWRpdHkgb2YgaXRzIHRpbWUtYmFzZWQgY2xhaW1zLiBXaWxsIHJldHVybiB0cnVlIGlmIHRoZVxyXG4gKiB0b2tlbiBpcyB3aXRoaW4gdGhlIHRpbWUgd2luZG93IGF1dGhvcml6ZWQgYnkgdGhlICduYmYnIChub3QtYmVmb3JlKSBhbmQgJ2lhdCcgKGlzc3VlZC1hdCkgY2xhaW1zLlxyXG4gKlxyXG4gKiBOb3RlczpcclxuICogLSBNYXkgcmV0dXJuIGEgZmFsc2UgbmVnYXRpdmUgaWYgdGhlcmUncyBubyBuYXRpdmUgYmFzZTY0IGRlY29kaW5nIHN1cHBvcnQuXHJcbiAqIC0gRG9lc24ndCBjaGVjayBpZiB0aGUgdG9rZW4gaXMgYWN0dWFsbHkgdmFsaWQuXHJcbiAqL1xyXG5jb25zdCBpc1ZhbGlkVGltZXN0YW1wID0gZnVuY3Rpb24gKHRva2VuKSB7XHJcbiAgICBjb25zdCBjbGFpbXMgPSBkZWNvZGUodG9rZW4pLmNsYWltcztcclxuICAgIGNvbnN0IG5vdyA9IE1hdGguZmxvb3IobmV3IERhdGUoKS5nZXRUaW1lKCkgLyAxMDAwKTtcclxuICAgIGxldCB2YWxpZFNpbmNlID0gMCwgdmFsaWRVbnRpbCA9IDA7XHJcbiAgICBpZiAodHlwZW9mIGNsYWltcyA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICBpZiAoY2xhaW1zLmhhc093blByb3BlcnR5KCduYmYnKSkge1xyXG4gICAgICAgICAgICB2YWxpZFNpbmNlID0gY2xhaW1zWyduYmYnXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoY2xhaW1zLmhhc093blByb3BlcnR5KCdpYXQnKSkge1xyXG4gICAgICAgICAgICB2YWxpZFNpbmNlID0gY2xhaW1zWydpYXQnXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGNsYWltcy5oYXNPd25Qcm9wZXJ0eSgnZXhwJykpIHtcclxuICAgICAgICAgICAgdmFsaWRVbnRpbCA9IGNsYWltc1snZXhwJ107XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAvLyB0b2tlbiB3aWxsIGV4cGlyZSBhZnRlciAyNGggYnkgZGVmYXVsdFxyXG4gICAgICAgICAgICB2YWxpZFVudGlsID0gdmFsaWRTaW5jZSArIDg2NDAwO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiAoISFub3cgJiZcclxuICAgICAgICAhIXZhbGlkU2luY2UgJiZcclxuICAgICAgICAhIXZhbGlkVW50aWwgJiZcclxuICAgICAgICBub3cgPj0gdmFsaWRTaW5jZSAmJlxyXG4gICAgICAgIG5vdyA8PSB2YWxpZFVudGlsKTtcclxufTtcclxuLyoqXHJcbiAqIERlY29kZXMgYSBGaXJlYmFzZSBhdXRoLiB0b2tlbiBhbmQgcmV0dXJucyBpdHMgaXNzdWVkIGF0IHRpbWUgaWYgdmFsaWQsIG51bGwgb3RoZXJ3aXNlLlxyXG4gKlxyXG4gKiBOb3RlczpcclxuICogLSBNYXkgcmV0dXJuIG51bGwgaWYgdGhlcmUncyBubyBuYXRpdmUgYmFzZTY0IGRlY29kaW5nIHN1cHBvcnQuXHJcbiAqIC0gRG9lc24ndCBjaGVjayBpZiB0aGUgdG9rZW4gaXMgYWN0dWFsbHkgdmFsaWQuXHJcbiAqL1xyXG5jb25zdCBpc3N1ZWRBdFRpbWUgPSBmdW5jdGlvbiAodG9rZW4pIHtcclxuICAgIGNvbnN0IGNsYWltcyA9IGRlY29kZSh0b2tlbikuY2xhaW1zO1xyXG4gICAgaWYgKHR5cGVvZiBjbGFpbXMgPT09ICdvYmplY3QnICYmIGNsYWltcy5oYXNPd25Qcm9wZXJ0eSgnaWF0JykpIHtcclxuICAgICAgICByZXR1cm4gY2xhaW1zWydpYXQnXTtcclxuICAgIH1cclxuICAgIHJldHVybiBudWxsO1xyXG59O1xyXG4vKipcclxuICogRGVjb2RlcyBhIEZpcmViYXNlIGF1dGguIHRva2VuIGFuZCBjaGVja3MgdGhlIHZhbGlkaXR5IG9mIGl0cyBmb3JtYXQuIEV4cGVjdHMgYSB2YWxpZCBpc3N1ZWQtYXQgdGltZS5cclxuICpcclxuICogTm90ZXM6XHJcbiAqIC0gTWF5IHJldHVybiBhIGZhbHNlIG5lZ2F0aXZlIGlmIHRoZXJlJ3Mgbm8gbmF0aXZlIGJhc2U2NCBkZWNvZGluZyBzdXBwb3J0LlxyXG4gKiAtIERvZXNuJ3QgY2hlY2sgaWYgdGhlIHRva2VuIGlzIGFjdHVhbGx5IHZhbGlkLlxyXG4gKi9cclxuY29uc3QgaXNWYWxpZEZvcm1hdCA9IGZ1bmN0aW9uICh0b2tlbikge1xyXG4gICAgY29uc3QgZGVjb2RlZCA9IGRlY29kZSh0b2tlbiksIGNsYWltcyA9IGRlY29kZWQuY2xhaW1zO1xyXG4gICAgcmV0dXJuICEhY2xhaW1zICYmIHR5cGVvZiBjbGFpbXMgPT09ICdvYmplY3QnICYmIGNsYWltcy5oYXNPd25Qcm9wZXJ0eSgnaWF0Jyk7XHJcbn07XHJcbi8qKlxyXG4gKiBBdHRlbXB0cyB0byBwZWVyIGludG8gYW4gYXV0aCB0b2tlbiBhbmQgZGV0ZXJtaW5lIGlmIGl0J3MgYW4gYWRtaW4gYXV0aCB0b2tlbiBieSBsb29raW5nIGF0IHRoZSBjbGFpbXMgcG9ydGlvbi5cclxuICpcclxuICogTm90ZXM6XHJcbiAqIC0gTWF5IHJldHVybiBhIGZhbHNlIG5lZ2F0aXZlIGlmIHRoZXJlJ3Mgbm8gbmF0aXZlIGJhc2U2NCBkZWNvZGluZyBzdXBwb3J0LlxyXG4gKiAtIERvZXNuJ3QgY2hlY2sgaWYgdGhlIHRva2VuIGlzIGFjdHVhbGx5IHZhbGlkLlxyXG4gKi9cclxuY29uc3QgaXNBZG1pbiA9IGZ1bmN0aW9uICh0b2tlbikge1xyXG4gICAgY29uc3QgY2xhaW1zID0gZGVjb2RlKHRva2VuKS5jbGFpbXM7XHJcbiAgICByZXR1cm4gdHlwZW9mIGNsYWltcyA9PT0gJ29iamVjdCcgJiYgY2xhaW1zWydhZG1pbiddID09PSB0cnVlO1xyXG59O1xuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5mdW5jdGlvbiBjb250YWlucyhvYmosIGtleSkge1xyXG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSk7XHJcbn1cclxuZnVuY3Rpb24gc2FmZUdldChvYmosIGtleSkge1xyXG4gICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIHtcclxuICAgICAgICByZXR1cm4gb2JqW2tleV07XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIGlzRW1wdHkob2JqKSB7XHJcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBvYmopIHtcclxuICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRydWU7XHJcbn1cclxuZnVuY3Rpb24gbWFwKG9iaiwgZm4sIGNvbnRleHRPYmopIHtcclxuICAgIGNvbnN0IHJlcyA9IHt9O1xyXG4gICAgZm9yIChjb25zdCBrZXkgaW4gb2JqKSB7XHJcbiAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIHtcclxuICAgICAgICAgICAgcmVzW2tleV0gPSBmbi5jYWxsKGNvbnRleHRPYmosIG9ialtrZXldLCBrZXksIG9iaik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlcztcclxufVxyXG4vKipcclxuICogRGVlcCBlcXVhbCB0d28gb2JqZWN0cy4gU3VwcG9ydCBBcnJheXMgYW5kIE9iamVjdHMuXHJcbiAqL1xyXG5mdW5jdGlvbiBkZWVwRXF1YWwoYSwgYikge1xyXG4gICAgaWYgKGEgPT09IGIpIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgIGNvbnN0IGFLZXlzID0gT2JqZWN0LmtleXMoYSk7XHJcbiAgICBjb25zdCBiS2V5cyA9IE9iamVjdC5rZXlzKGIpO1xyXG4gICAgZm9yIChjb25zdCBrIG9mIGFLZXlzKSB7XHJcbiAgICAgICAgaWYgKCFiS2V5cy5pbmNsdWRlcyhrKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IGFQcm9wID0gYVtrXTtcclxuICAgICAgICBjb25zdCBiUHJvcCA9IGJba107XHJcbiAgICAgICAgaWYgKGlzT2JqZWN0KGFQcm9wKSAmJiBpc09iamVjdChiUHJvcCkpIHtcclxuICAgICAgICAgICAgaWYgKCFkZWVwRXF1YWwoYVByb3AsIGJQcm9wKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGFQcm9wICE9PSBiUHJvcCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZm9yIChjb25zdCBrIG9mIGJLZXlzKSB7XHJcbiAgICAgICAgaWYgKCFhS2V5cy5pbmNsdWRlcyhrKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRydWU7XHJcbn1cclxuZnVuY3Rpb24gaXNPYmplY3QodGhpbmcpIHtcclxuICAgIHJldHVybiB0aGluZyAhPT0gbnVsbCAmJiB0eXBlb2YgdGhpbmcgPT09ICdvYmplY3QnO1xyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAyMiBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbi8qKlxyXG4gKiBSZWplY3RzIGlmIHRoZSBnaXZlbiBwcm9taXNlIGRvZXNuJ3QgcmVzb2x2ZSBpbiB0aW1lSW5NUyBtaWxsaXNlY29uZHMuXHJcbiAqIEBpbnRlcm5hbFxyXG4gKi9cclxuZnVuY3Rpb24gcHJvbWlzZVdpdGhUaW1lb3V0KHByb21pc2UsIHRpbWVJbk1TID0gMjAwMCkge1xyXG4gICAgY29uc3QgZGVmZXJyZWRQcm9taXNlID0gbmV3IERlZmVycmVkKCk7XHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IGRlZmVycmVkUHJvbWlzZS5yZWplY3QoJ3RpbWVvdXQhJyksIHRpbWVJbk1TKTtcclxuICAgIHByb21pc2UudGhlbihkZWZlcnJlZFByb21pc2UucmVzb2x2ZSwgZGVmZXJyZWRQcm9taXNlLnJlamVjdCk7XHJcbiAgICByZXR1cm4gZGVmZXJyZWRQcm9taXNlLnByb21pc2U7XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqXHJcbiAqIFJldHVybnMgYSBxdWVyeXN0cmluZy1mb3JtYXR0ZWQgc3RyaW5nIChlLmcuICZhcmc9dmFsJmFyZzI9dmFsMikgZnJvbSBhXHJcbiAqIHBhcmFtcyBvYmplY3QgKGUuZy4ge2FyZzogJ3ZhbCcsIGFyZzI6ICd2YWwyJ30pXHJcbiAqIE5vdGU6IFlvdSBtdXN0IHByZXBlbmQgaXQgd2l0aCA/IHdoZW4gYWRkaW5nIGl0IHRvIGEgVVJMLlxyXG4gKi9cclxuZnVuY3Rpb24gcXVlcnlzdHJpbmcocXVlcnlzdHJpbmdQYXJhbXMpIHtcclxuICAgIGNvbnN0IHBhcmFtcyA9IFtdO1xyXG4gICAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMocXVlcnlzdHJpbmdQYXJhbXMpKSB7XHJcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XHJcbiAgICAgICAgICAgIHZhbHVlLmZvckVhY2goYXJyYXlWYWwgPT4ge1xyXG4gICAgICAgICAgICAgICAgcGFyYW1zLnB1c2goZW5jb2RlVVJJQ29tcG9uZW50KGtleSkgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQoYXJyYXlWYWwpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBwYXJhbXMucHVzaChlbmNvZGVVUklDb21wb25lbnQoa2V5KSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudCh2YWx1ZSkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBwYXJhbXMubGVuZ3RoID8gJyYnICsgcGFyYW1zLmpvaW4oJyYnKSA6ICcnO1xyXG59XHJcbi8qKlxyXG4gKiBEZWNvZGVzIGEgcXVlcnlzdHJpbmcgKGUuZy4gP2FyZz12YWwmYXJnMj12YWwyKSBpbnRvIGEgcGFyYW1zIG9iamVjdFxyXG4gKiAoZS5nLiB7YXJnOiAndmFsJywgYXJnMjogJ3ZhbDInfSlcclxuICovXHJcbmZ1bmN0aW9uIHF1ZXJ5c3RyaW5nRGVjb2RlKHF1ZXJ5c3RyaW5nKSB7XHJcbiAgICBjb25zdCBvYmogPSB7fTtcclxuICAgIGNvbnN0IHRva2VucyA9IHF1ZXJ5c3RyaW5nLnJlcGxhY2UoL15cXD8vLCAnJykuc3BsaXQoJyYnKTtcclxuICAgIHRva2Vucy5mb3JFYWNoKHRva2VuID0+IHtcclxuICAgICAgICBpZiAodG9rZW4pIHtcclxuICAgICAgICAgICAgY29uc3QgW2tleSwgdmFsdWVdID0gdG9rZW4uc3BsaXQoJz0nKTtcclxuICAgICAgICAgICAgb2JqW2RlY29kZVVSSUNvbXBvbmVudChrZXkpXSA9IGRlY29kZVVSSUNvbXBvbmVudCh2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gb2JqO1xyXG59XHJcbi8qKlxyXG4gKiBFeHRyYWN0IHRoZSBxdWVyeSBzdHJpbmcgcGFydCBvZiBhIFVSTCwgaW5jbHVkaW5nIHRoZSBsZWFkaW5nIHF1ZXN0aW9uIG1hcmsgKGlmIHByZXNlbnQpLlxyXG4gKi9cclxuZnVuY3Rpb24gZXh0cmFjdFF1ZXJ5c3RyaW5nKHVybCkge1xyXG4gICAgY29uc3QgcXVlcnlTdGFydCA9IHVybC5pbmRleE9mKCc/Jyk7XHJcbiAgICBpZiAoIXF1ZXJ5U3RhcnQpIHtcclxuICAgICAgICByZXR1cm4gJyc7XHJcbiAgICB9XHJcbiAgICBjb25zdCBmcmFnbWVudFN0YXJ0ID0gdXJsLmluZGV4T2YoJyMnLCBxdWVyeVN0YXJ0KTtcclxuICAgIHJldHVybiB1cmwuc3Vic3RyaW5nKHF1ZXJ5U3RhcnQsIGZyYWdtZW50U3RhcnQgPiAwID8gZnJhZ21lbnRTdGFydCA6IHVuZGVmaW5lZCk7XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqXHJcbiAqIEBmaWxlb3ZlcnZpZXcgU0hBLTEgY3J5cHRvZ3JhcGhpYyBoYXNoLlxyXG4gKiBWYXJpYWJsZSBuYW1lcyBmb2xsb3cgdGhlIG5vdGF0aW9uIGluIEZJUFMgUFVCIDE4MC0zOlxyXG4gKiBodHRwOi8vY3NyYy5uaXN0Lmdvdi9wdWJsaWNhdGlvbnMvZmlwcy9maXBzMTgwLTMvZmlwczE4MC0zX2ZpbmFsLnBkZi5cclxuICpcclxuICogVXNhZ2U6XHJcbiAqICAgdmFyIHNoYTEgPSBuZXcgc2hhMSgpO1xyXG4gKiAgIHNoYTEudXBkYXRlKGJ5dGVzKTtcclxuICogICB2YXIgaGFzaCA9IHNoYTEuZGlnZXN0KCk7XHJcbiAqXHJcbiAqIFBlcmZvcm1hbmNlOlxyXG4gKiAgIENocm9tZSAyMzogICB+NDAwIE1iaXQvc1xyXG4gKiAgIEZpcmVmb3ggMTY6ICB+MjUwIE1iaXQvc1xyXG4gKlxyXG4gKi9cclxuLyoqXHJcbiAqIFNIQS0xIGNyeXB0b2dyYXBoaWMgaGFzaCBjb25zdHJ1Y3Rvci5cclxuICpcclxuICogVGhlIHByb3BlcnRpZXMgZGVjbGFyZWQgaGVyZSBhcmUgZGlzY3Vzc2VkIGluIHRoZSBhYm92ZSBhbGdvcml0aG0gZG9jdW1lbnQuXHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKiBAZmluYWxcclxuICogQHN0cnVjdFxyXG4gKi9cclxuY2xhc3MgU2hhMSB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBIb2xkcyB0aGUgcHJldmlvdXMgdmFsdWVzIG9mIGFjY3VtdWxhdGVkIHZhcmlhYmxlcyBhLWUgaW4gdGhlIGNvbXByZXNzX1xyXG4gICAgICAgICAqIGZ1bmN0aW9uLlxyXG4gICAgICAgICAqIEBwcml2YXRlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5jaGFpbl8gPSBbXTtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBBIGJ1ZmZlciBob2xkaW5nIHRoZSBwYXJ0aWFsbHkgY29tcHV0ZWQgaGFzaCByZXN1bHQuXHJcbiAgICAgICAgICogQHByaXZhdGVcclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmJ1Zl8gPSBbXTtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBBbiBhcnJheSBvZiA4MCBieXRlcywgZWFjaCBhIHBhcnQgb2YgdGhlIG1lc3NhZ2UgdG8gYmUgaGFzaGVkLiAgUmVmZXJyZWQgdG9cclxuICAgICAgICAgKiBhcyB0aGUgbWVzc2FnZSBzY2hlZHVsZSBpbiB0aGUgZG9jcy5cclxuICAgICAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuV18gPSBbXTtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBDb250YWlucyBkYXRhIG5lZWRlZCB0byBwYWQgbWVzc2FnZXMgbGVzcyB0aGFuIDY0IGJ5dGVzLlxyXG4gICAgICAgICAqIEBwcml2YXRlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5wYWRfID0gW107XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQHByaXZhdGUge251bWJlcn1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmluYnVmXyA9IDA7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQHByaXZhdGUge251bWJlcn1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLnRvdGFsXyA9IDA7XHJcbiAgICAgICAgdGhpcy5ibG9ja1NpemUgPSA1MTIgLyA4O1xyXG4gICAgICAgIHRoaXMucGFkX1swXSA9IDEyODtcclxuICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IHRoaXMuYmxvY2tTaXplOyArK2kpIHtcclxuICAgICAgICAgICAgdGhpcy5wYWRfW2ldID0gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5yZXNldCgpO1xyXG4gICAgfVxyXG4gICAgcmVzZXQoKSB7XHJcbiAgICAgICAgdGhpcy5jaGFpbl9bMF0gPSAweDY3NDUyMzAxO1xyXG4gICAgICAgIHRoaXMuY2hhaW5fWzFdID0gMHhlZmNkYWI4OTtcclxuICAgICAgICB0aGlzLmNoYWluX1syXSA9IDB4OThiYWRjZmU7XHJcbiAgICAgICAgdGhpcy5jaGFpbl9bM10gPSAweDEwMzI1NDc2O1xyXG4gICAgICAgIHRoaXMuY2hhaW5fWzRdID0gMHhjM2QyZTFmMDtcclxuICAgICAgICB0aGlzLmluYnVmXyA9IDA7XHJcbiAgICAgICAgdGhpcy50b3RhbF8gPSAwO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBJbnRlcm5hbCBjb21wcmVzcyBoZWxwZXIgZnVuY3Rpb24uXHJcbiAgICAgKiBAcGFyYW0gYnVmIEJsb2NrIHRvIGNvbXByZXNzLlxyXG4gICAgICogQHBhcmFtIG9mZnNldCBPZmZzZXQgb2YgdGhlIGJsb2NrIGluIHRoZSBidWZmZXIuXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBjb21wcmVzc18oYnVmLCBvZmZzZXQpIHtcclxuICAgICAgICBpZiAoIW9mZnNldCkge1xyXG4gICAgICAgICAgICBvZmZzZXQgPSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBXID0gdGhpcy5XXztcclxuICAgICAgICAvLyBnZXQgMTYgYmlnIGVuZGlhbiB3b3Jkc1xyXG4gICAgICAgIGlmICh0eXBlb2YgYnVmID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDE2OyBpKyspIHtcclxuICAgICAgICAgICAgICAgIC8vIFRPRE8odXNlcik6IFtidWcgODE0MDEyMl0gUmVjZW50IHZlcnNpb25zIG9mIFNhZmFyaSBmb3IgTWFjIE9TIGFuZCBpT1NcclxuICAgICAgICAgICAgICAgIC8vIGhhdmUgYSBidWcgdGhhdCB0dXJucyB0aGUgcG9zdC1pbmNyZW1lbnQgKysgb3BlcmF0b3IgaW50byBwcmUtaW5jcmVtZW50XHJcbiAgICAgICAgICAgICAgICAvLyBkdXJpbmcgSklUIGNvbXBpbGF0aW9uLiAgV2UgaGF2ZSBjb2RlIHRoYXQgZGVwZW5kcyBoZWF2aWx5IG9uIFNIQS0xIGZvclxyXG4gICAgICAgICAgICAgICAgLy8gY29ycmVjdG5lc3MgYW5kIHdoaWNoIGlzIGFmZmVjdGVkIGJ5IHRoaXMgYnVnLCBzbyBJJ3ZlIHJlbW92ZWQgYWxsIHVzZXNcclxuICAgICAgICAgICAgICAgIC8vIG9mIHBvc3QtaW5jcmVtZW50ICsrIGluIHdoaWNoIHRoZSByZXN1bHQgdmFsdWUgaXMgdXNlZC4gIFdlIGNhbiByZXZlcnRcclxuICAgICAgICAgICAgICAgIC8vIHRoaXMgY2hhbmdlIG9uY2UgdGhlIFNhZmFyaSBidWdcclxuICAgICAgICAgICAgICAgIC8vIChodHRwczovL2J1Z3Mud2Via2l0Lm9yZy9zaG93X2J1Zy5jZ2k/aWQ9MTA5MDM2KSBoYXMgYmVlbiBmaXhlZCBhbmRcclxuICAgICAgICAgICAgICAgIC8vIG1vc3QgY2xpZW50cyBoYXZlIGJlZW4gdXBkYXRlZC5cclxuICAgICAgICAgICAgICAgIFdbaV0gPVxyXG4gICAgICAgICAgICAgICAgICAgIChidWYuY2hhckNvZGVBdChvZmZzZXQpIDw8IDI0KSB8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIChidWYuY2hhckNvZGVBdChvZmZzZXQgKyAxKSA8PCAxNikgfFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAoYnVmLmNoYXJDb2RlQXQob2Zmc2V0ICsgMikgPDwgOCkgfFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBidWYuY2hhckNvZGVBdChvZmZzZXQgKyAzKTtcclxuICAgICAgICAgICAgICAgIG9mZnNldCArPSA0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDE2OyBpKyspIHtcclxuICAgICAgICAgICAgICAgIFdbaV0gPVxyXG4gICAgICAgICAgICAgICAgICAgIChidWZbb2Zmc2V0XSA8PCAyNCkgfFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAoYnVmW29mZnNldCArIDFdIDw8IDE2KSB8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIChidWZbb2Zmc2V0ICsgMl0gPDwgOCkgfFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBidWZbb2Zmc2V0ICsgM107XHJcbiAgICAgICAgICAgICAgICBvZmZzZXQgKz0gNDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBleHBhbmQgdG8gODAgd29yZHNcclxuICAgICAgICBmb3IgKGxldCBpID0gMTY7IGkgPCA4MDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHQgPSBXW2kgLSAzXSBeIFdbaSAtIDhdIF4gV1tpIC0gMTRdIF4gV1tpIC0gMTZdO1xyXG4gICAgICAgICAgICBXW2ldID0gKCh0IDw8IDEpIHwgKHQgPj4+IDMxKSkgJiAweGZmZmZmZmZmO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgYSA9IHRoaXMuY2hhaW5fWzBdO1xyXG4gICAgICAgIGxldCBiID0gdGhpcy5jaGFpbl9bMV07XHJcbiAgICAgICAgbGV0IGMgPSB0aGlzLmNoYWluX1syXTtcclxuICAgICAgICBsZXQgZCA9IHRoaXMuY2hhaW5fWzNdO1xyXG4gICAgICAgIGxldCBlID0gdGhpcy5jaGFpbl9bNF07XHJcbiAgICAgICAgbGV0IGYsIGs7XHJcbiAgICAgICAgLy8gVE9ETyh1c2VyKTogVHJ5IHRvIHVucm9sbCB0aGlzIGxvb3AgdG8gc3BlZWQgdXAgdGhlIGNvbXB1dGF0aW9uLlxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgODA7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoaSA8IDQwKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaSA8IDIwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZiA9IGQgXiAoYiAmIChjIF4gZCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGsgPSAweDVhODI3OTk5O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZiA9IGIgXiBjIF4gZDtcclxuICAgICAgICAgICAgICAgICAgICBrID0gMHg2ZWQ5ZWJhMTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmIChpIDwgNjApIHtcclxuICAgICAgICAgICAgICAgICAgICBmID0gKGIgJiBjKSB8IChkICYgKGIgfCBjKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgayA9IDB4OGYxYmJjZGM7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBmID0gYiBeIGMgXiBkO1xyXG4gICAgICAgICAgICAgICAgICAgIGsgPSAweGNhNjJjMWQ2O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IHQgPSAoKChhIDw8IDUpIHwgKGEgPj4+IDI3KSkgKyBmICsgZSArIGsgKyBXW2ldKSAmIDB4ZmZmZmZmZmY7XHJcbiAgICAgICAgICAgIGUgPSBkO1xyXG4gICAgICAgICAgICBkID0gYztcclxuICAgICAgICAgICAgYyA9ICgoYiA8PCAzMCkgfCAoYiA+Pj4gMikpICYgMHhmZmZmZmZmZjtcclxuICAgICAgICAgICAgYiA9IGE7XHJcbiAgICAgICAgICAgIGEgPSB0O1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmNoYWluX1swXSA9ICh0aGlzLmNoYWluX1swXSArIGEpICYgMHhmZmZmZmZmZjtcclxuICAgICAgICB0aGlzLmNoYWluX1sxXSA9ICh0aGlzLmNoYWluX1sxXSArIGIpICYgMHhmZmZmZmZmZjtcclxuICAgICAgICB0aGlzLmNoYWluX1syXSA9ICh0aGlzLmNoYWluX1syXSArIGMpICYgMHhmZmZmZmZmZjtcclxuICAgICAgICB0aGlzLmNoYWluX1szXSA9ICh0aGlzLmNoYWluX1szXSArIGQpICYgMHhmZmZmZmZmZjtcclxuICAgICAgICB0aGlzLmNoYWluX1s0XSA9ICh0aGlzLmNoYWluX1s0XSArIGUpICYgMHhmZmZmZmZmZjtcclxuICAgIH1cclxuICAgIHVwZGF0ZShieXRlcywgbGVuZ3RoKSB7XHJcbiAgICAgICAgLy8gVE9ETyhqb2hubGVueik6IHRpZ2h0ZW4gdGhlIGZ1bmN0aW9uIHNpZ25hdHVyZSBhbmQgcmVtb3ZlIHRoaXMgY2hlY2tcclxuICAgICAgICBpZiAoYnl0ZXMgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChsZW5ndGggPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBsZW5ndGggPSBieXRlcy5sZW5ndGg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IGxlbmd0aE1pbnVzQmxvY2sgPSBsZW5ndGggLSB0aGlzLmJsb2NrU2l6ZTtcclxuICAgICAgICBsZXQgbiA9IDA7XHJcbiAgICAgICAgLy8gVXNpbmcgbG9jYWwgaW5zdGVhZCBvZiBtZW1iZXIgdmFyaWFibGVzIGdpdmVzIH41JSBzcGVlZHVwIG9uIEZpcmVmb3ggMTYuXHJcbiAgICAgICAgY29uc3QgYnVmID0gdGhpcy5idWZfO1xyXG4gICAgICAgIGxldCBpbmJ1ZiA9IHRoaXMuaW5idWZfO1xyXG4gICAgICAgIC8vIFRoZSBvdXRlciB3aGlsZSBsb29wIHNob3VsZCBleGVjdXRlIGF0IG1vc3QgdHdpY2UuXHJcbiAgICAgICAgd2hpbGUgKG4gPCBsZW5ndGgpIHtcclxuICAgICAgICAgICAgLy8gV2hlbiB3ZSBoYXZlIG5vIGRhdGEgaW4gdGhlIGJsb2NrIHRvIHRvcCB1cCwgd2UgY2FuIGRpcmVjdGx5IHByb2Nlc3MgdGhlXHJcbiAgICAgICAgICAgIC8vIGlucHV0IGJ1ZmZlciAoYXNzdW1pbmcgaXQgY29udGFpbnMgc3VmZmljaWVudCBkYXRhKS4gVGhpcyBnaXZlcyB+MjUlXHJcbiAgICAgICAgICAgIC8vIHNwZWVkdXAgb24gQ2hyb21lIDIzIGFuZCB+MTUlIHNwZWVkdXAgb24gRmlyZWZveCAxNiwgYnV0IHJlcXVpcmVzIHRoYXRcclxuICAgICAgICAgICAgLy8gdGhlIGRhdGEgaXMgcHJvdmlkZWQgaW4gbGFyZ2UgY2h1bmtzIChvciBpbiBtdWx0aXBsZXMgb2YgNjQgYnl0ZXMpLlxyXG4gICAgICAgICAgICBpZiAoaW5idWYgPT09IDApIHtcclxuICAgICAgICAgICAgICAgIHdoaWxlIChuIDw9IGxlbmd0aE1pbnVzQmxvY2spIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbXByZXNzXyhieXRlcywgbik7XHJcbiAgICAgICAgICAgICAgICAgICAgbiArPSB0aGlzLmJsb2NrU2l6ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGJ5dGVzID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKG4gPCBsZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICBidWZbaW5idWZdID0gYnl0ZXMuY2hhckNvZGVBdChuKTtcclxuICAgICAgICAgICAgICAgICAgICArK2luYnVmO1xyXG4gICAgICAgICAgICAgICAgICAgICsrbjtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaW5idWYgPT09IHRoaXMuYmxvY2tTaXplKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29tcHJlc3NfKGJ1Zik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluYnVmID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gSnVtcCB0byB0aGUgb3V0ZXIgbG9vcCBzbyB3ZSB1c2UgdGhlIGZ1bGwtYmxvY2sgb3B0aW1pemF0aW9uLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAobiA8IGxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGJ1ZltpbmJ1Zl0gPSBieXRlc1tuXTtcclxuICAgICAgICAgICAgICAgICAgICArK2luYnVmO1xyXG4gICAgICAgICAgICAgICAgICAgICsrbjtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaW5idWYgPT09IHRoaXMuYmxvY2tTaXplKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29tcHJlc3NfKGJ1Zik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluYnVmID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gSnVtcCB0byB0aGUgb3V0ZXIgbG9vcCBzbyB3ZSB1c2UgdGhlIGZ1bGwtYmxvY2sgb3B0aW1pemF0aW9uLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5pbmJ1Zl8gPSBpbmJ1ZjtcclxuICAgICAgICB0aGlzLnRvdGFsXyArPSBsZW5ndGg7XHJcbiAgICB9XHJcbiAgICAvKiogQG92ZXJyaWRlICovXHJcbiAgICBkaWdlc3QoKSB7XHJcbiAgICAgICAgY29uc3QgZGlnZXN0ID0gW107XHJcbiAgICAgICAgbGV0IHRvdGFsQml0cyA9IHRoaXMudG90YWxfICogODtcclxuICAgICAgICAvLyBBZGQgcGFkIDB4ODAgMHgwMCouXHJcbiAgICAgICAgaWYgKHRoaXMuaW5idWZfIDwgNTYpIHtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGUodGhpcy5wYWRfLCA1NiAtIHRoaXMuaW5idWZfKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlKHRoaXMucGFkXywgdGhpcy5ibG9ja1NpemUgLSAodGhpcy5pbmJ1Zl8gLSA1NikpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBBZGQgIyBiaXRzLlxyXG4gICAgICAgIGZvciAobGV0IGkgPSB0aGlzLmJsb2NrU2l6ZSAtIDE7IGkgPj0gNTY7IGktLSkge1xyXG4gICAgICAgICAgICB0aGlzLmJ1Zl9baV0gPSB0b3RhbEJpdHMgJiAyNTU7XHJcbiAgICAgICAgICAgIHRvdGFsQml0cyAvPSAyNTY7IC8vIERvbid0IHVzZSBiaXQtc2hpZnRpbmcgaGVyZSFcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jb21wcmVzc18odGhpcy5idWZfKTtcclxuICAgICAgICBsZXQgbiA9IDA7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA1OyBpKyspIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDI0OyBqID49IDA7IGogLT0gOCkge1xyXG4gICAgICAgICAgICAgICAgZGlnZXN0W25dID0gKHRoaXMuY2hhaW5fW2ldID4+IGopICYgMjU1O1xyXG4gICAgICAgICAgICAgICAgKytuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBkaWdlc3Q7XHJcbiAgICB9XHJcbn1cblxuLyoqXHJcbiAqIEhlbHBlciB0byBtYWtlIGEgU3Vic2NyaWJlIGZ1bmN0aW9uIChqdXN0IGxpa2UgUHJvbWlzZSBoZWxwcyBtYWtlIGFcclxuICogVGhlbmFibGUpLlxyXG4gKlxyXG4gKiBAcGFyYW0gZXhlY3V0b3IgRnVuY3Rpb24gd2hpY2ggY2FuIG1ha2UgY2FsbHMgdG8gYSBzaW5nbGUgT2JzZXJ2ZXJcclxuICogICAgIGFzIGEgcHJveHkuXHJcbiAqIEBwYXJhbSBvbk5vT2JzZXJ2ZXJzIENhbGxiYWNrIHdoZW4gY291bnQgb2YgT2JzZXJ2ZXJzIGdvZXMgdG8gemVyby5cclxuICovXHJcbmZ1bmN0aW9uIGNyZWF0ZVN1YnNjcmliZShleGVjdXRvciwgb25Ob09ic2VydmVycykge1xyXG4gICAgY29uc3QgcHJveHkgPSBuZXcgT2JzZXJ2ZXJQcm94eShleGVjdXRvciwgb25Ob09ic2VydmVycyk7XHJcbiAgICByZXR1cm4gcHJveHkuc3Vic2NyaWJlLmJpbmQocHJveHkpO1xyXG59XHJcbi8qKlxyXG4gKiBJbXBsZW1lbnQgZmFuLW91dCBmb3IgYW55IG51bWJlciBvZiBPYnNlcnZlcnMgYXR0YWNoZWQgdmlhIGEgc3Vic2NyaWJlXHJcbiAqIGZ1bmN0aW9uLlxyXG4gKi9cclxuY2xhc3MgT2JzZXJ2ZXJQcm94eSB7XHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSBleGVjdXRvciBGdW5jdGlvbiB3aGljaCBjYW4gbWFrZSBjYWxscyB0byBhIHNpbmdsZSBPYnNlcnZlclxyXG4gICAgICogICAgIGFzIGEgcHJveHkuXHJcbiAgICAgKiBAcGFyYW0gb25Ob09ic2VydmVycyBDYWxsYmFjayB3aGVuIGNvdW50IG9mIE9ic2VydmVycyBnb2VzIHRvIHplcm8uXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKGV4ZWN1dG9yLCBvbk5vT2JzZXJ2ZXJzKSB7XHJcbiAgICAgICAgdGhpcy5vYnNlcnZlcnMgPSBbXTtcclxuICAgICAgICB0aGlzLnVuc3Vic2NyaWJlcyA9IFtdO1xyXG4gICAgICAgIHRoaXMub2JzZXJ2ZXJDb3VudCA9IDA7XHJcbiAgICAgICAgLy8gTWljcm8tdGFzayBzY2hlZHVsaW5nIGJ5IGNhbGxpbmcgdGFzay50aGVuKCkuXHJcbiAgICAgICAgdGhpcy50YXNrID0gUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgICAgICAgdGhpcy5maW5hbGl6ZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLm9uTm9PYnNlcnZlcnMgPSBvbk5vT2JzZXJ2ZXJzO1xyXG4gICAgICAgIC8vIENhbGwgdGhlIGV4ZWN1dG9yIGFzeW5jaHJvbm91c2x5IHNvIHN1YnNjcmliZXJzIHRoYXQgYXJlIGNhbGxlZFxyXG4gICAgICAgIC8vIHN5bmNocm9ub3VzbHkgYWZ0ZXIgdGhlIGNyZWF0aW9uIG9mIHRoZSBzdWJzY3JpYmUgZnVuY3Rpb25cclxuICAgICAgICAvLyBjYW4gc3RpbGwgcmVjZWl2ZSB0aGUgdmVyeSBmaXJzdCB2YWx1ZSBnZW5lcmF0ZWQgaW4gdGhlIGV4ZWN1dG9yLlxyXG4gICAgICAgIHRoaXMudGFza1xyXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgIGV4ZWN1dG9yKHRoaXMpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5jYXRjaChlID0+IHtcclxuICAgICAgICAgICAgdGhpcy5lcnJvcihlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIG5leHQodmFsdWUpIHtcclxuICAgICAgICB0aGlzLmZvckVhY2hPYnNlcnZlcigob2JzZXJ2ZXIpID0+IHtcclxuICAgICAgICAgICAgb2JzZXJ2ZXIubmV4dCh2YWx1ZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBlcnJvcihlcnJvcikge1xyXG4gICAgICAgIHRoaXMuZm9yRWFjaE9ic2VydmVyKChvYnNlcnZlcikgPT4ge1xyXG4gICAgICAgICAgICBvYnNlcnZlci5lcnJvcihlcnJvcik7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5jbG9zZShlcnJvcik7XHJcbiAgICB9XHJcbiAgICBjb21wbGV0ZSgpIHtcclxuICAgICAgICB0aGlzLmZvckVhY2hPYnNlcnZlcigob2JzZXJ2ZXIpID0+IHtcclxuICAgICAgICAgICAgb2JzZXJ2ZXIuY29tcGxldGUoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmNsb3NlKCk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFN1YnNjcmliZSBmdW5jdGlvbiB0aGF0IGNhbiBiZSB1c2VkIHRvIGFkZCBhbiBPYnNlcnZlciB0byB0aGUgZmFuLW91dCBsaXN0LlxyXG4gICAgICpcclxuICAgICAqIC0gV2UgcmVxdWlyZSB0aGF0IG5vIGV2ZW50IGlzIHNlbnQgdG8gYSBzdWJzY3JpYmVyIHN5Y2hyb25vdXNseSB0byB0aGVpclxyXG4gICAgICogICBjYWxsIHRvIHN1YnNjcmliZSgpLlxyXG4gICAgICovXHJcbiAgICBzdWJzY3JpYmUobmV4dE9yT2JzZXJ2ZXIsIGVycm9yLCBjb21wbGV0ZSkge1xyXG4gICAgICAgIGxldCBvYnNlcnZlcjtcclxuICAgICAgICBpZiAobmV4dE9yT2JzZXJ2ZXIgPT09IHVuZGVmaW5lZCAmJlxyXG4gICAgICAgICAgICBlcnJvciA9PT0gdW5kZWZpbmVkICYmXHJcbiAgICAgICAgICAgIGNvbXBsZXRlID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nIE9ic2VydmVyLicpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBBc3NlbWJsZSBhbiBPYnNlcnZlciBvYmplY3Qgd2hlbiBwYXNzZWQgYXMgY2FsbGJhY2sgZnVuY3Rpb25zLlxyXG4gICAgICAgIGlmIChpbXBsZW1lbnRzQW55TWV0aG9kcyhuZXh0T3JPYnNlcnZlciwgW1xyXG4gICAgICAgICAgICAnbmV4dCcsXHJcbiAgICAgICAgICAgICdlcnJvcicsXHJcbiAgICAgICAgICAgICdjb21wbGV0ZSdcclxuICAgICAgICBdKSkge1xyXG4gICAgICAgICAgICBvYnNlcnZlciA9IG5leHRPck9ic2VydmVyO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgb2JzZXJ2ZXIgPSB7XHJcbiAgICAgICAgICAgICAgICBuZXh0OiBuZXh0T3JPYnNlcnZlcixcclxuICAgICAgICAgICAgICAgIGVycm9yLFxyXG4gICAgICAgICAgICAgICAgY29tcGxldGVcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG9ic2VydmVyLm5leHQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBvYnNlcnZlci5uZXh0ID0gbm9vcDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG9ic2VydmVyLmVycm9yID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgb2JzZXJ2ZXIuZXJyb3IgPSBub29wO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAob2JzZXJ2ZXIuY29tcGxldGUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBvYnNlcnZlci5jb21wbGV0ZSA9IG5vb3A7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHVuc3ViID0gdGhpcy51bnN1YnNjcmliZU9uZS5iaW5kKHRoaXMsIHRoaXMub2JzZXJ2ZXJzLmxlbmd0aCk7XHJcbiAgICAgICAgLy8gQXR0ZW1wdCB0byBzdWJzY3JpYmUgdG8gYSB0ZXJtaW5hdGVkIE9ic2VydmFibGUgLSB3ZVxyXG4gICAgICAgIC8vIGp1c3QgcmVzcG9uZCB0byB0aGUgT2JzZXJ2ZXIgd2l0aCB0aGUgZmluYWwgZXJyb3Igb3IgY29tcGxldGVcclxuICAgICAgICAvLyBldmVudC5cclxuICAgICAgICBpZiAodGhpcy5maW5hbGl6ZWQpIHtcclxuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1mbG9hdGluZy1wcm9taXNlc1xyXG4gICAgICAgICAgICB0aGlzLnRhc2sudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmZpbmFsRXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb2JzZXJ2ZXIuZXJyb3IodGhpcy5maW5hbEVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9ic2VydmVyLmNvbXBsZXRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBub3RoaW5nXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLm9ic2VydmVycy5wdXNoKG9ic2VydmVyKTtcclxuICAgICAgICByZXR1cm4gdW5zdWI7XHJcbiAgICB9XHJcbiAgICAvLyBVbnN1YnNjcmliZSBpcyBzeW5jaHJvbm91cyAtIHdlIGd1YXJhbnRlZSB0aGF0IG5vIGV2ZW50cyBhcmUgc2VudCB0b1xyXG4gICAgLy8gYW55IHVuc3Vic2NyaWJlZCBPYnNlcnZlci5cclxuICAgIHVuc3Vic2NyaWJlT25lKGkpIHtcclxuICAgICAgICBpZiAodGhpcy5vYnNlcnZlcnMgPT09IHVuZGVmaW5lZCB8fCB0aGlzLm9ic2VydmVyc1tpXSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZGVsZXRlIHRoaXMub2JzZXJ2ZXJzW2ldO1xyXG4gICAgICAgIHRoaXMub2JzZXJ2ZXJDb3VudCAtPSAxO1xyXG4gICAgICAgIGlmICh0aGlzLm9ic2VydmVyQ291bnQgPT09IDAgJiYgdGhpcy5vbk5vT2JzZXJ2ZXJzICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5vbk5vT2JzZXJ2ZXJzKHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGZvckVhY2hPYnNlcnZlcihmbikge1xyXG4gICAgICAgIGlmICh0aGlzLmZpbmFsaXplZCkge1xyXG4gICAgICAgICAgICAvLyBBbHJlYWR5IGNsb3NlZCBieSBwcmV2aW91cyBldmVudC4uLi5qdXN0IGVhdCB0aGUgYWRkaXRpb25hbCB2YWx1ZXMuXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gU2luY2Ugc2VuZE9uZSBjYWxscyBhc3luY2hyb25vdXNseSAtIHRoZXJlIGlzIG5vIGNoYW5jZSB0aGF0XHJcbiAgICAgICAgLy8gdGhpcy5vYnNlcnZlcnMgd2lsbCBiZWNvbWUgdW5kZWZpbmVkLlxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5vYnNlcnZlcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5zZW5kT25lKGksIGZuKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyBDYWxsIHRoZSBPYnNlcnZlciB2aWEgb25lIG9mIGl0J3MgY2FsbGJhY2sgZnVuY3Rpb24uIFdlIGFyZSBjYXJlZnVsIHRvXHJcbiAgICAvLyBjb25maXJtIHRoYXQgdGhlIG9ic2VydmUgaGFzIG5vdCBiZWVuIHVuc3Vic2NyaWJlZCBzaW5jZSB0aGlzIGFzeW5jaHJvbm91c1xyXG4gICAgLy8gZnVuY3Rpb24gaGFkIGJlZW4gcXVldWVkLlxyXG4gICAgc2VuZE9uZShpLCBmbikge1xyXG4gICAgICAgIC8vIEV4ZWN1dGUgdGhlIGNhbGxiYWNrIGFzeW5jaHJvbm91c2x5XHJcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1mbG9hdGluZy1wcm9taXNlc1xyXG4gICAgICAgIHRoaXMudGFzay50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgaWYgKHRoaXMub2JzZXJ2ZXJzICE9PSB1bmRlZmluZWQgJiYgdGhpcy5vYnNlcnZlcnNbaV0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICBmbih0aGlzLm9ic2VydmVyc1tpXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIElnbm9yZSBleGNlcHRpb25zIHJhaXNlZCBpbiBPYnNlcnZlcnMgb3IgbWlzc2luZyBtZXRob2RzIG9mIGFuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gT2JzZXJ2ZXIuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gTG9nIGVycm9yIHRvIGNvbnNvbGUuIGIvMzE0MDQ4MDZcclxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnICYmIGNvbnNvbGUuZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGNsb3NlKGVycikge1xyXG4gICAgICAgIGlmICh0aGlzLmZpbmFsaXplZCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZmluYWxpemVkID0gdHJ1ZTtcclxuICAgICAgICBpZiAoZXJyICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5maW5hbEVycm9yID0gZXJyO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBQcm94eSBpcyBubyBsb25nZXIgbmVlZGVkIC0gZ2FyYmFnZSBjb2xsZWN0IHJlZmVyZW5jZXNcclxuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWZsb2F0aW5nLXByb21pc2VzXHJcbiAgICAgICAgdGhpcy50YXNrLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLm9ic2VydmVycyA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgdGhpcy5vbk5vT2JzZXJ2ZXJzID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbi8qKiBUdXJuIHN5bmNocm9ub3VzIGZ1bmN0aW9uIGludG8gb25lIGNhbGxlZCBhc3luY2hyb25vdXNseS4gKi9cclxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9iYW4tdHlwZXNcclxuZnVuY3Rpb24gYXN5bmMoZm4sIG9uRXJyb3IpIHtcclxuICAgIHJldHVybiAoLi4uYXJncykgPT4ge1xyXG4gICAgICAgIFByb21pc2UucmVzb2x2ZSh0cnVlKVxyXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgIGZuKC4uLmFyZ3MpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5jYXRjaCgoZXJyb3IpID0+IHtcclxuICAgICAgICAgICAgaWYgKG9uRXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIG9uRXJyb3IoZXJyb3IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG59XHJcbi8qKlxyXG4gKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgb2JqZWN0IHBhc3NlZCBpbiBpbXBsZW1lbnRzIGFueSBvZiB0aGUgbmFtZWQgbWV0aG9kcy5cclxuICovXHJcbmZ1bmN0aW9uIGltcGxlbWVudHNBbnlNZXRob2RzKG9iaiwgbWV0aG9kcykge1xyXG4gICAgaWYgKHR5cGVvZiBvYmogIT09ICdvYmplY3QnIHx8IG9iaiA9PT0gbnVsbCkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIGZvciAoY29uc3QgbWV0aG9kIG9mIG1ldGhvZHMpIHtcclxuICAgICAgICBpZiAobWV0aG9kIGluIG9iaiAmJiB0eXBlb2Ygb2JqW21ldGhvZF0gPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG59XHJcbmZ1bmN0aW9uIG5vb3AoKSB7XHJcbiAgICAvLyBkbyBub3RoaW5nXHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqXHJcbiAqIENoZWNrIHRvIG1ha2Ugc3VyZSB0aGUgYXBwcm9wcmlhdGUgbnVtYmVyIG9mIGFyZ3VtZW50cyBhcmUgcHJvdmlkZWQgZm9yIGEgcHVibGljIGZ1bmN0aW9uLlxyXG4gKiBUaHJvd3MgYW4gZXJyb3IgaWYgaXQgZmFpbHMuXHJcbiAqXHJcbiAqIEBwYXJhbSBmbk5hbWUgVGhlIGZ1bmN0aW9uIG5hbWVcclxuICogQHBhcmFtIG1pbkNvdW50IFRoZSBtaW5pbXVtIG51bWJlciBvZiBhcmd1bWVudHMgdG8gYWxsb3cgZm9yIHRoZSBmdW5jdGlvbiBjYWxsXHJcbiAqIEBwYXJhbSBtYXhDb3VudCBUaGUgbWF4aW11bSBudW1iZXIgb2YgYXJndW1lbnQgdG8gYWxsb3cgZm9yIHRoZSBmdW5jdGlvbiBjYWxsXHJcbiAqIEBwYXJhbSBhcmdDb3VudCBUaGUgYWN0dWFsIG51bWJlciBvZiBhcmd1bWVudHMgcHJvdmlkZWQuXHJcbiAqL1xyXG5jb25zdCB2YWxpZGF0ZUFyZ0NvdW50ID0gZnVuY3Rpb24gKGZuTmFtZSwgbWluQ291bnQsIG1heENvdW50LCBhcmdDb3VudCkge1xyXG4gICAgbGV0IGFyZ0Vycm9yO1xyXG4gICAgaWYgKGFyZ0NvdW50IDwgbWluQ291bnQpIHtcclxuICAgICAgICBhcmdFcnJvciA9ICdhdCBsZWFzdCAnICsgbWluQ291bnQ7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChhcmdDb3VudCA+IG1heENvdW50KSB7XHJcbiAgICAgICAgYXJnRXJyb3IgPSBtYXhDb3VudCA9PT0gMCA/ICdub25lJyA6ICdubyBtb3JlIHRoYW4gJyArIG1heENvdW50O1xyXG4gICAgfVxyXG4gICAgaWYgKGFyZ0Vycm9yKSB7XHJcbiAgICAgICAgY29uc3QgZXJyb3IgPSBmbk5hbWUgK1xyXG4gICAgICAgICAgICAnIGZhaWxlZDogV2FzIGNhbGxlZCB3aXRoICcgK1xyXG4gICAgICAgICAgICBhcmdDb3VudCArXHJcbiAgICAgICAgICAgIChhcmdDb3VudCA9PT0gMSA/ICcgYXJndW1lbnQuJyA6ICcgYXJndW1lbnRzLicpICtcclxuICAgICAgICAgICAgJyBFeHBlY3RzICcgK1xyXG4gICAgICAgICAgICBhcmdFcnJvciArXHJcbiAgICAgICAgICAgICcuJztcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3IpO1xyXG4gICAgfVxyXG59O1xyXG4vKipcclxuICogR2VuZXJhdGVzIGEgc3RyaW5nIHRvIHByZWZpeCBhbiBlcnJvciBtZXNzYWdlIGFib3V0IGZhaWxlZCBhcmd1bWVudCB2YWxpZGF0aW9uXHJcbiAqXHJcbiAqIEBwYXJhbSBmbk5hbWUgVGhlIGZ1bmN0aW9uIG5hbWVcclxuICogQHBhcmFtIGFyZ05hbWUgVGhlIG5hbWUgb2YgdGhlIGFyZ3VtZW50XHJcbiAqIEByZXR1cm4gVGhlIHByZWZpeCB0byBhZGQgdG8gdGhlIGVycm9yIHRocm93biBmb3IgdmFsaWRhdGlvbi5cclxuICovXHJcbmZ1bmN0aW9uIGVycm9yUHJlZml4KGZuTmFtZSwgYXJnTmFtZSkge1xyXG4gICAgcmV0dXJuIGAke2ZuTmFtZX0gZmFpbGVkOiAke2FyZ05hbWV9IGFyZ3VtZW50IGA7XHJcbn1cclxuLyoqXHJcbiAqIEBwYXJhbSBmbk5hbWVcclxuICogQHBhcmFtIGFyZ3VtZW50TnVtYmVyXHJcbiAqIEBwYXJhbSBuYW1lc3BhY2VcclxuICogQHBhcmFtIG9wdGlvbmFsXHJcbiAqL1xyXG5mdW5jdGlvbiB2YWxpZGF0ZU5hbWVzcGFjZShmbk5hbWUsIG5hbWVzcGFjZSwgb3B0aW9uYWwpIHtcclxuICAgIGlmIChvcHRpb25hbCAmJiAhbmFtZXNwYWNlKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgaWYgKHR5cGVvZiBuYW1lc3BhY2UgIT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgLy9UT0RPOiBJIHNob3VsZCBkbyBtb3JlIHZhbGlkYXRpb24gaGVyZS4gV2Ugb25seSBhbGxvdyBjZXJ0YWluIGNoYXJzIGluIG5hbWVzcGFjZXMuXHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGVycm9yUHJlZml4KGZuTmFtZSwgJ25hbWVzcGFjZScpICsgJ211c3QgYmUgYSB2YWxpZCBmaXJlYmFzZSBuYW1lc3BhY2UuJyk7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gdmFsaWRhdGVDYWxsYmFjayhmbk5hbWUsIGFyZ3VtZW50TmFtZSwgXHJcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvYmFuLXR5cGVzXHJcbmNhbGxiYWNrLCBvcHRpb25hbCkge1xyXG4gICAgaWYgKG9wdGlvbmFsICYmICFjYWxsYmFjaykge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgIT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3JQcmVmaXgoZm5OYW1lLCBhcmd1bWVudE5hbWUpICsgJ211c3QgYmUgYSB2YWxpZCBmdW5jdGlvbi4nKTtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiB2YWxpZGF0ZUNvbnRleHRPYmplY3QoZm5OYW1lLCBhcmd1bWVudE5hbWUsIGNvbnRleHQsIG9wdGlvbmFsKSB7XHJcbiAgICBpZiAob3B0aW9uYWwgJiYgIWNvbnRleHQpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBpZiAodHlwZW9mIGNvbnRleHQgIT09ICdvYmplY3QnIHx8IGNvbnRleHQgPT09IG51bGwpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3JQcmVmaXgoZm5OYW1lLCBhcmd1bWVudE5hbWUpICsgJ211c3QgYmUgYSB2YWxpZCBjb250ZXh0IG9iamVjdC4nKTtcclxuICAgIH1cclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG4vLyBDb2RlIG9yaWdpbmFsbHkgY2FtZSBmcm9tIGdvb2cuY3J5cHQuc3RyaW5nVG9VdGY4Qnl0ZUFycmF5LCBidXQgZm9yIHNvbWUgcmVhc29uIHRoZXlcclxuLy8gYXV0b21hdGljYWxseSByZXBsYWNlZCAnXFxyXFxuJyB3aXRoICdcXG4nLCBhbmQgdGhleSBkaWRuJ3QgaGFuZGxlIHN1cnJvZ2F0ZSBwYWlycyxcclxuLy8gc28gaXQncyBiZWVuIG1vZGlmaWVkLlxyXG4vLyBOb3RlIHRoYXQgbm90IGFsbCBVbmljb2RlIGNoYXJhY3RlcnMgYXBwZWFyIGFzIHNpbmdsZSBjaGFyYWN0ZXJzIGluIEphdmFTY3JpcHQgc3RyaW5ncy5cclxuLy8gZnJvbUNoYXJDb2RlIHJldHVybnMgdGhlIFVURi0xNiBlbmNvZGluZyBvZiBhIGNoYXJhY3RlciAtIHNvIHNvbWUgVW5pY29kZSBjaGFyYWN0ZXJzXHJcbi8vIHVzZSAyIGNoYXJhY3RlcnMgaW4gSmF2YXNjcmlwdC4gIEFsbCA0LWJ5dGUgVVRGLTggY2hhcmFjdGVycyBiZWdpbiB3aXRoIGEgZmlyc3RcclxuLy8gY2hhcmFjdGVyIGluIHRoZSByYW5nZSAweEQ4MDAgLSAweERCRkYgKHRoZSBmaXJzdCBjaGFyYWN0ZXIgb2YgYSBzby1jYWxsZWQgc3Vycm9nYXRlXHJcbi8vIHBhaXIpLlxyXG4vLyBTZWUgaHR0cDovL3d3dy5lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzUuMS8jc2VjLTE1LjEuM1xyXG4vKipcclxuICogQHBhcmFtIHtzdHJpbmd9IHN0clxyXG4gKiBAcmV0dXJuIHtBcnJheX1cclxuICovXHJcbmNvbnN0IHN0cmluZ1RvQnl0ZUFycmF5ID0gZnVuY3Rpb24gKHN0cikge1xyXG4gICAgY29uc3Qgb3V0ID0gW107XHJcbiAgICBsZXQgcCA9IDA7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGxldCBjID0gc3RyLmNoYXJDb2RlQXQoaSk7XHJcbiAgICAgICAgLy8gSXMgdGhpcyB0aGUgbGVhZCBzdXJyb2dhdGUgaW4gYSBzdXJyb2dhdGUgcGFpcj9cclxuICAgICAgICBpZiAoYyA+PSAweGQ4MDAgJiYgYyA8PSAweGRiZmYpIHtcclxuICAgICAgICAgICAgY29uc3QgaGlnaCA9IGMgLSAweGQ4MDA7IC8vIHRoZSBoaWdoIDEwIGJpdHMuXHJcbiAgICAgICAgICAgIGkrKztcclxuICAgICAgICAgICAgYXNzZXJ0KGkgPCBzdHIubGVuZ3RoLCAnU3Vycm9nYXRlIHBhaXIgbWlzc2luZyB0cmFpbCBzdXJyb2dhdGUuJyk7XHJcbiAgICAgICAgICAgIGNvbnN0IGxvdyA9IHN0ci5jaGFyQ29kZUF0KGkpIC0gMHhkYzAwOyAvLyB0aGUgbG93IDEwIGJpdHMuXHJcbiAgICAgICAgICAgIGMgPSAweDEwMDAwICsgKGhpZ2ggPDwgMTApICsgbG93O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoYyA8IDEyOCkge1xyXG4gICAgICAgICAgICBvdXRbcCsrXSA9IGM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGMgPCAyMDQ4KSB7XHJcbiAgICAgICAgICAgIG91dFtwKytdID0gKGMgPj4gNikgfCAxOTI7XHJcbiAgICAgICAgICAgIG91dFtwKytdID0gKGMgJiA2MykgfCAxMjg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGMgPCA2NTUzNikge1xyXG4gICAgICAgICAgICBvdXRbcCsrXSA9IChjID4+IDEyKSB8IDIyNDtcclxuICAgICAgICAgICAgb3V0W3ArK10gPSAoKGMgPj4gNikgJiA2MykgfCAxMjg7XHJcbiAgICAgICAgICAgIG91dFtwKytdID0gKGMgJiA2MykgfCAxMjg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBvdXRbcCsrXSA9IChjID4+IDE4KSB8IDI0MDtcclxuICAgICAgICAgICAgb3V0W3ArK10gPSAoKGMgPj4gMTIpICYgNjMpIHwgMTI4O1xyXG4gICAgICAgICAgICBvdXRbcCsrXSA9ICgoYyA+PiA2KSAmIDYzKSB8IDEyODtcclxuICAgICAgICAgICAgb3V0W3ArK10gPSAoYyAmIDYzKSB8IDEyODtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gb3V0O1xyXG59O1xyXG4vKipcclxuICogQ2FsY3VsYXRlIGxlbmd0aCB3aXRob3V0IGFjdHVhbGx5IGNvbnZlcnRpbmc7IHVzZWZ1bCBmb3IgZG9pbmcgY2hlYXBlciB2YWxpZGF0aW9uLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyXHJcbiAqIEByZXR1cm4ge251bWJlcn1cclxuICovXHJcbmNvbnN0IHN0cmluZ0xlbmd0aCA9IGZ1bmN0aW9uIChzdHIpIHtcclxuICAgIGxldCBwID0gMDtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgY29uc3QgYyA9IHN0ci5jaGFyQ29kZUF0KGkpO1xyXG4gICAgICAgIGlmIChjIDwgMTI4KSB7XHJcbiAgICAgICAgICAgIHArKztcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoYyA8IDIwNDgpIHtcclxuICAgICAgICAgICAgcCArPSAyO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChjID49IDB4ZDgwMCAmJiBjIDw9IDB4ZGJmZikge1xyXG4gICAgICAgICAgICAvLyBMZWFkIHN1cnJvZ2F0ZSBvZiBhIHN1cnJvZ2F0ZSBwYWlyLiAgVGhlIHBhaXIgdG9nZXRoZXIgd2lsbCB0YWtlIDQgYnl0ZXMgdG8gcmVwcmVzZW50LlxyXG4gICAgICAgICAgICBwICs9IDQ7XHJcbiAgICAgICAgICAgIGkrKzsgLy8gc2tpcCB0cmFpbCBzdXJyb2dhdGUuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBwICs9IDM7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHA7XHJcbn07XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAyMiBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbi8qKlxyXG4gKiBDb3BpZWQgZnJvbSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMjExNzUyM1xyXG4gKiBHZW5lcmF0ZXMgYSBuZXcgdXVpZC5cclxuICogQHB1YmxpY1xyXG4gKi9cclxuY29uc3QgdXVpZHY0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuICd4eHh4eHh4eC14eHh4LTR4eHgteXh4eC14eHh4eHh4eHh4eHgnLnJlcGxhY2UoL1t4eV0vZywgYyA9PiB7XHJcbiAgICAgICAgY29uc3QgciA9IChNYXRoLnJhbmRvbSgpICogMTYpIHwgMCwgdiA9IGMgPT09ICd4JyA/IHIgOiAociAmIDB4MykgfCAweDg7XHJcbiAgICAgICAgcmV0dXJuIHYudG9TdHJpbmcoMTYpO1xyXG4gICAgfSk7XHJcbn07XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbi8qKlxyXG4gKiBUaGUgYW1vdW50IG9mIG1pbGxpc2Vjb25kcyB0byBleHBvbmVudGlhbGx5IGluY3JlYXNlLlxyXG4gKi9cclxuY29uc3QgREVGQVVMVF9JTlRFUlZBTF9NSUxMSVMgPSAxMDAwO1xyXG4vKipcclxuICogVGhlIGZhY3RvciB0byBiYWNrb2ZmIGJ5LlxyXG4gKiBTaG91bGQgYmUgYSBudW1iZXIgZ3JlYXRlciB0aGFuIDEuXHJcbiAqL1xyXG5jb25zdCBERUZBVUxUX0JBQ0tPRkZfRkFDVE9SID0gMjtcclxuLyoqXHJcbiAqIFRoZSBtYXhpbXVtIG1pbGxpc2Vjb25kcyB0byBpbmNyZWFzZSB0by5cclxuICpcclxuICogPHA+VmlzaWJsZSBmb3IgdGVzdGluZ1xyXG4gKi9cclxuY29uc3QgTUFYX1ZBTFVFX01JTExJUyA9IDQgKiA2MCAqIDYwICogMTAwMDsgLy8gRm91ciBob3VycywgbGlrZSBpT1MgYW5kIEFuZHJvaWQuXHJcbi8qKlxyXG4gKiBUaGUgcGVyY2VudGFnZSBvZiBiYWNrb2ZmIHRpbWUgdG8gcmFuZG9taXplIGJ5LlxyXG4gKiBTZWVcclxuICogaHR0cDovL2dvL3NhZmUtY2xpZW50LWJlaGF2aW9yI3N0ZXAtMS1kZXRlcm1pbmUtdGhlLWFwcHJvcHJpYXRlLXJldHJ5LWludGVydmFsLXRvLWhhbmRsZS1zcGlrZS10cmFmZmljXHJcbiAqIGZvciBjb250ZXh0LlxyXG4gKlxyXG4gKiA8cD5WaXNpYmxlIGZvciB0ZXN0aW5nXHJcbiAqL1xyXG5jb25zdCBSQU5ET01fRkFDVE9SID0gMC41O1xyXG4vKipcclxuICogQmFzZWQgb24gdGhlIGJhY2tvZmYgbWV0aG9kIGZyb21cclxuICogaHR0cHM6Ly9naXRodWIuY29tL2dvb2dsZS9jbG9zdXJlLWxpYnJhcnkvYmxvYi9tYXN0ZXIvY2xvc3VyZS9nb29nL21hdGgvZXhwb25lbnRpYWxiYWNrb2ZmLmpzLlxyXG4gKiBFeHRyYWN0ZWQgaGVyZSBzbyB3ZSBkb24ndCBuZWVkIHRvIHBhc3MgbWV0YWRhdGEgYW5kIGEgc3RhdGVmdWwgRXhwb25lbnRpYWxCYWNrb2ZmIG9iamVjdCBhcm91bmQuXHJcbiAqL1xyXG5mdW5jdGlvbiBjYWxjdWxhdGVCYWNrb2ZmTWlsbGlzKGJhY2tvZmZDb3VudCwgaW50ZXJ2YWxNaWxsaXMgPSBERUZBVUxUX0lOVEVSVkFMX01JTExJUywgYmFja29mZkZhY3RvciA9IERFRkFVTFRfQkFDS09GRl9GQUNUT1IpIHtcclxuICAgIC8vIENhbGN1bGF0ZXMgYW4gZXhwb25lbnRpYWxseSBpbmNyZWFzaW5nIHZhbHVlLlxyXG4gICAgLy8gRGV2aWF0aW9uOiBjYWxjdWxhdGVzIHZhbHVlIGZyb20gY291bnQgYW5kIGEgY29uc3RhbnQgaW50ZXJ2YWwsIHNvIHdlIG9ubHkgbmVlZCB0byBzYXZlIHZhbHVlXHJcbiAgICAvLyBhbmQgY291bnQgdG8gcmVzdG9yZSBzdGF0ZS5cclxuICAgIGNvbnN0IGN1cnJCYXNlVmFsdWUgPSBpbnRlcnZhbE1pbGxpcyAqIE1hdGgucG93KGJhY2tvZmZGYWN0b3IsIGJhY2tvZmZDb3VudCk7XHJcbiAgICAvLyBBIHJhbmRvbSBcImZ1enpcIiB0byBhdm9pZCB3YXZlcyBvZiByZXRyaWVzLlxyXG4gICAgLy8gRGV2aWF0aW9uOiByYW5kb21GYWN0b3IgaXMgcmVxdWlyZWQuXHJcbiAgICBjb25zdCByYW5kb21XYWl0ID0gTWF0aC5yb3VuZChcclxuICAgIC8vIEEgZnJhY3Rpb24gb2YgdGhlIGJhY2tvZmYgdmFsdWUgdG8gYWRkL3N1YnRyYWN0LlxyXG4gICAgLy8gRGV2aWF0aW9uOiBjaGFuZ2VzIG11bHRpcGxpY2F0aW9uIG9yZGVyIHRvIGltcHJvdmUgcmVhZGFiaWxpdHkuXHJcbiAgICBSQU5ET01fRkFDVE9SICpcclxuICAgICAgICBjdXJyQmFzZVZhbHVlICpcclxuICAgICAgICAvLyBBIHJhbmRvbSBmbG9hdCAocm91bmRlZCB0byBpbnQgYnkgTWF0aC5yb3VuZCBhYm92ZSkgaW4gdGhlIHJhbmdlIFstMSwgMV0uIERldGVybWluZXNcclxuICAgICAgICAvLyBpZiB3ZSBhZGQgb3Igc3VidHJhY3QuXHJcbiAgICAgICAgKE1hdGgucmFuZG9tKCkgLSAwLjUpICpcclxuICAgICAgICAyKTtcclxuICAgIC8vIExpbWl0cyBiYWNrb2ZmIHRvIG1heCB0byBhdm9pZCBlZmZlY3RpdmVseSBwZXJtYW5lbnQgYmFja29mZi5cclxuICAgIHJldHVybiBNYXRoLm1pbihNQVhfVkFMVUVfTUlMTElTLCBjdXJyQmFzZVZhbHVlICsgcmFuZG9tV2FpdCk7XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqXHJcbiAqIFByb3ZpZGUgRW5nbGlzaCBvcmRpbmFsIGxldHRlcnMgYWZ0ZXIgYSBudW1iZXJcclxuICovXHJcbmZ1bmN0aW9uIG9yZGluYWwoaSkge1xyXG4gICAgaWYgKCFOdW1iZXIuaXNGaW5pdGUoaSkpIHtcclxuICAgICAgICByZXR1cm4gYCR7aX1gO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGkgKyBpbmRpY2F0b3IoaSk7XHJcbn1cclxuZnVuY3Rpb24gaW5kaWNhdG9yKGkpIHtcclxuICAgIGkgPSBNYXRoLmFicyhpKTtcclxuICAgIGNvbnN0IGNlbnQgPSBpICUgMTAwO1xyXG4gICAgaWYgKGNlbnQgPj0gMTAgJiYgY2VudCA8PSAyMCkge1xyXG4gICAgICAgIHJldHVybiAndGgnO1xyXG4gICAgfVxyXG4gICAgY29uc3QgZGVjID0gaSAlIDEwO1xyXG4gICAgaWYgKGRlYyA9PT0gMSkge1xyXG4gICAgICAgIHJldHVybiAnc3QnO1xyXG4gICAgfVxyXG4gICAgaWYgKGRlYyA9PT0gMikge1xyXG4gICAgICAgIHJldHVybiAnbmQnO1xyXG4gICAgfVxyXG4gICAgaWYgKGRlYyA9PT0gMykge1xyXG4gICAgICAgIHJldHVybiAncmQnO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuICd0aCc7XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDIxIEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0TW9kdWxhckluc3RhbmNlKHNlcnZpY2UpIHtcclxuICAgIGlmIChzZXJ2aWNlICYmIHNlcnZpY2UuX2RlbGVnYXRlKSB7XHJcbiAgICAgICAgcmV0dXJuIHNlcnZpY2UuX2RlbGVnYXRlO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIHNlcnZpY2U7XHJcbiAgICB9XHJcbn1cblxuZXhwb3J0IHsgQ09OU1RBTlRTLCBEZWZlcnJlZCwgRXJyb3JGYWN0b3J5LCBGaXJlYmFzZUVycm9yLCBNQVhfVkFMVUVfTUlMTElTLCBSQU5ET01fRkFDVE9SLCBTaGExLCBhcmVDb29raWVzRW5hYmxlZCwgYXNzZXJ0LCBhc3NlcnRpb25FcnJvciwgYXN5bmMsIGJhc2U2NCwgYmFzZTY0RGVjb2RlLCBiYXNlNjRFbmNvZGUsIGJhc2U2NHVybEVuY29kZVdpdGhvdXRQYWRkaW5nLCBjYWxjdWxhdGVCYWNrb2ZmTWlsbGlzLCBjb250YWlucywgY3JlYXRlTW9ja1VzZXJUb2tlbiwgY3JlYXRlU3Vic2NyaWJlLCBkZWNvZGUsIGRlZXBDb3B5LCBkZWVwRXF1YWwsIGRlZXBFeHRlbmQsIGVycm9yUHJlZml4LCBleHRyYWN0UXVlcnlzdHJpbmcsIGdldERlZmF1bHRBcHBDb25maWcsIGdldERlZmF1bHRFbXVsYXRvckhvc3QsIGdldERlZmF1bHRFbXVsYXRvckhvc3RuYW1lQW5kUG9ydCwgZ2V0RXhwZXJpbWVudGFsU2V0dGluZywgZ2V0R2xvYmFsLCBnZXRNb2R1bGFySW5zdGFuY2UsIGdldFVBLCBpc0FkbWluLCBpc0Jyb3dzZXIsIGlzQnJvd3NlckV4dGVuc2lvbiwgaXNFbGVjdHJvbiwgaXNFbXB0eSwgaXNJRSwgaXNJbmRleGVkREJBdmFpbGFibGUsIGlzTW9iaWxlQ29yZG92YSwgaXNOb2RlLCBpc05vZGVTZGssIGlzUmVhY3ROYXRpdmUsIGlzU2FmYXJpLCBpc1VXUCwgaXNWYWxpZEZvcm1hdCwgaXNWYWxpZFRpbWVzdGFtcCwgaXNzdWVkQXRUaW1lLCBqc29uRXZhbCwgbWFwLCBvcmRpbmFsLCBwcm9taXNlV2l0aFRpbWVvdXQsIHF1ZXJ5c3RyaW5nLCBxdWVyeXN0cmluZ0RlY29kZSwgc2FmZUdldCwgc3RyaW5nTGVuZ3RoLCBzdHJpbmdUb0J5dGVBcnJheSwgc3RyaW5naWZ5LCB1dWlkdjQsIHZhbGlkYXRlQXJnQ291bnQsIHZhbGlkYXRlQ2FsbGJhY2ssIHZhbGlkYXRlQ29udGV4dE9iamVjdCwgdmFsaWRhdGVJbmRleGVkREJPcGVuYWJsZSwgdmFsaWRhdGVOYW1lc3BhY2UgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmVzbTIwMTcuanMubWFwXG4iLCJpbXBvcnQgeyBEZWZlcnJlZCB9IGZyb20gJ0BmaXJlYmFzZS91dGlsJztcblxuLyoqXHJcbiAqIENvbXBvbmVudCBmb3Igc2VydmljZSBuYW1lIFQsIGUuZy4gYGF1dGhgLCBgYXV0aC1pbnRlcm5hbGBcclxuICovXHJcbmNsYXNzIENvbXBvbmVudCB7XHJcbiAgICAvKipcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gbmFtZSBUaGUgcHVibGljIHNlcnZpY2UgbmFtZSwgZS5nLiBhcHAsIGF1dGgsIGZpcmVzdG9yZSwgZGF0YWJhc2VcclxuICAgICAqIEBwYXJhbSBpbnN0YW5jZUZhY3RvcnkgU2VydmljZSBmYWN0b3J5IHJlc3BvbnNpYmxlIGZvciBjcmVhdGluZyB0aGUgcHVibGljIGludGVyZmFjZVxyXG4gICAgICogQHBhcmFtIHR5cGUgd2hldGhlciB0aGUgc2VydmljZSBwcm92aWRlZCBieSB0aGUgY29tcG9uZW50IGlzIHB1YmxpYyBvciBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKG5hbWUsIGluc3RhbmNlRmFjdG9yeSwgdHlwZSkge1xyXG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcbiAgICAgICAgdGhpcy5pbnN0YW5jZUZhY3RvcnkgPSBpbnN0YW5jZUZhY3Rvcnk7XHJcbiAgICAgICAgdGhpcy50eXBlID0gdHlwZTtcclxuICAgICAgICB0aGlzLm11bHRpcGxlSW5zdGFuY2VzID0gZmFsc2U7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogUHJvcGVydGllcyB0byBiZSBhZGRlZCB0byB0aGUgc2VydmljZSBuYW1lc3BhY2VcclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLnNlcnZpY2VQcm9wcyA9IHt9O1xyXG4gICAgICAgIHRoaXMuaW5zdGFudGlhdGlvbk1vZGUgPSBcIkxBWllcIiAvKiBMQVpZICovO1xyXG4gICAgICAgIHRoaXMub25JbnN0YW5jZUNyZWF0ZWQgPSBudWxsO1xyXG4gICAgfVxyXG4gICAgc2V0SW5zdGFudGlhdGlvbk1vZGUobW9kZSkge1xyXG4gICAgICAgIHRoaXMuaW5zdGFudGlhdGlvbk1vZGUgPSBtb2RlO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgc2V0TXVsdGlwbGVJbnN0YW5jZXMobXVsdGlwbGVJbnN0YW5jZXMpIHtcclxuICAgICAgICB0aGlzLm11bHRpcGxlSW5zdGFuY2VzID0gbXVsdGlwbGVJbnN0YW5jZXM7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBzZXRTZXJ2aWNlUHJvcHMocHJvcHMpIHtcclxuICAgICAgICB0aGlzLnNlcnZpY2VQcm9wcyA9IHByb3BzO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgc2V0SW5zdGFuY2VDcmVhdGVkQ2FsbGJhY2soY2FsbGJhY2spIHtcclxuICAgICAgICB0aGlzLm9uSW5zdGFuY2VDcmVhdGVkID0gY2FsbGJhY2s7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuY29uc3QgREVGQVVMVF9FTlRSWV9OQU1FID0gJ1tERUZBVUxUXSc7XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbi8qKlxyXG4gKiBQcm92aWRlciBmb3IgaW5zdGFuY2UgZm9yIHNlcnZpY2UgbmFtZSBULCBlLmcuICdhdXRoJywgJ2F1dGgtaW50ZXJuYWwnXHJcbiAqIE5hbWVTZXJ2aWNlTWFwcGluZ1tUXSBpcyBhbiBhbGlhcyBmb3IgdGhlIHR5cGUgb2YgdGhlIGluc3RhbmNlXHJcbiAqL1xyXG5jbGFzcyBQcm92aWRlciB7XHJcbiAgICBjb25zdHJ1Y3RvcihuYW1lLCBjb250YWluZXIpIHtcclxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyO1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50ID0gbnVsbDtcclxuICAgICAgICB0aGlzLmluc3RhbmNlcyA9IG5ldyBNYXAoKTtcclxuICAgICAgICB0aGlzLmluc3RhbmNlc0RlZmVycmVkID0gbmV3IE1hcCgpO1xyXG4gICAgICAgIHRoaXMuaW5zdGFuY2VzT3B0aW9ucyA9IG5ldyBNYXAoKTtcclxuICAgICAgICB0aGlzLm9uSW5pdENhbGxiYWNrcyA9IG5ldyBNYXAoKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIGlkZW50aWZpZXIgQSBwcm92aWRlciBjYW4gcHJvdmlkZSBtdWxpdHBsZSBpbnN0YW5jZXMgb2YgYSBzZXJ2aWNlXHJcbiAgICAgKiBpZiB0aGlzLmNvbXBvbmVudC5tdWx0aXBsZUluc3RhbmNlcyBpcyB0cnVlLlxyXG4gICAgICovXHJcbiAgICBnZXQoaWRlbnRpZmllcikge1xyXG4gICAgICAgIC8vIGlmIG11bHRpcGxlSW5zdGFuY2VzIGlzIG5vdCBzdXBwb3J0ZWQsIHVzZSB0aGUgZGVmYXVsdCBuYW1lXHJcbiAgICAgICAgY29uc3Qgbm9ybWFsaXplZElkZW50aWZpZXIgPSB0aGlzLm5vcm1hbGl6ZUluc3RhbmNlSWRlbnRpZmllcihpZGVudGlmaWVyKTtcclxuICAgICAgICBpZiAoIXRoaXMuaW5zdGFuY2VzRGVmZXJyZWQuaGFzKG5vcm1hbGl6ZWRJZGVudGlmaWVyKSkge1xyXG4gICAgICAgICAgICBjb25zdCBkZWZlcnJlZCA9IG5ldyBEZWZlcnJlZCgpO1xyXG4gICAgICAgICAgICB0aGlzLmluc3RhbmNlc0RlZmVycmVkLnNldChub3JtYWxpemVkSWRlbnRpZmllciwgZGVmZXJyZWQpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc0luaXRpYWxpemVkKG5vcm1hbGl6ZWRJZGVudGlmaWVyKSB8fFxyXG4gICAgICAgICAgICAgICAgdGhpcy5zaG91bGRBdXRvSW5pdGlhbGl6ZSgpKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBpbml0aWFsaXplIHRoZSBzZXJ2aWNlIGlmIGl0IGNhbiBiZSBhdXRvLWluaXRpYWxpemVkXHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcy5nZXRPckluaXRpYWxpemVTZXJ2aWNlKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5zdGFuY2VJZGVudGlmaWVyOiBub3JtYWxpemVkSWRlbnRpZmllclxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpbnN0YW5jZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKGluc3RhbmNlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHdoZW4gdGhlIGluc3RhbmNlIGZhY3RvcnkgdGhyb3dzIGFuIGV4Y2VwdGlvbiBkdXJpbmcgZ2V0KCksIGl0IHNob3VsZCBub3QgY2F1c2VcclxuICAgICAgICAgICAgICAgICAgICAvLyBhIGZhdGFsIGVycm9yLiBXZSBqdXN0IHJldHVybiB0aGUgdW5yZXNvbHZlZCBwcm9taXNlIGluIHRoaXMgY2FzZS5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5pbnN0YW5jZXNEZWZlcnJlZC5nZXQobm9ybWFsaXplZElkZW50aWZpZXIpLnByb21pc2U7XHJcbiAgICB9XHJcbiAgICBnZXRJbW1lZGlhdGUob3B0aW9ucykge1xyXG4gICAgICAgIHZhciBfYTtcclxuICAgICAgICAvLyBpZiBtdWx0aXBsZUluc3RhbmNlcyBpcyBub3Qgc3VwcG9ydGVkLCB1c2UgdGhlIGRlZmF1bHQgbmFtZVxyXG4gICAgICAgIGNvbnN0IG5vcm1hbGl6ZWRJZGVudGlmaWVyID0gdGhpcy5ub3JtYWxpemVJbnN0YW5jZUlkZW50aWZpZXIob3B0aW9ucyA9PT0gbnVsbCB8fCBvcHRpb25zID09PSB2b2lkIDAgPyB2b2lkIDAgOiBvcHRpb25zLmlkZW50aWZpZXIpO1xyXG4gICAgICAgIGNvbnN0IG9wdGlvbmFsID0gKF9hID0gb3B0aW9ucyA9PT0gbnVsbCB8fCBvcHRpb25zID09PSB2b2lkIDAgPyB2b2lkIDAgOiBvcHRpb25zLm9wdGlvbmFsKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBmYWxzZTtcclxuICAgICAgICBpZiAodGhpcy5pc0luaXRpYWxpemVkKG5vcm1hbGl6ZWRJZGVudGlmaWVyKSB8fFxyXG4gICAgICAgICAgICB0aGlzLnNob3VsZEF1dG9Jbml0aWFsaXplKCkpIHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldE9ySW5pdGlhbGl6ZVNlcnZpY2Uoe1xyXG4gICAgICAgICAgICAgICAgICAgIGluc3RhbmNlSWRlbnRpZmllcjogbm9ybWFsaXplZElkZW50aWZpZXJcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAob3B0aW9uYWwpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IGU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIEluIGNhc2UgYSBjb21wb25lbnQgaXMgbm90IGluaXRpYWxpemVkIGFuZCBzaG91bGQvY2FuIG5vdCBiZSBhdXRvLWluaXRpYWxpemVkIGF0IHRoZSBtb21lbnQsIHJldHVybiBudWxsIGlmIHRoZSBvcHRpb25hbCBmbGFnIGlzIHNldCwgb3IgdGhyb3dcclxuICAgICAgICAgICAgaWYgKG9wdGlvbmFsKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRocm93IEVycm9yKGBTZXJ2aWNlICR7dGhpcy5uYW1lfSBpcyBub3QgYXZhaWxhYmxlYCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBnZXRDb21wb25lbnQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29tcG9uZW50O1xyXG4gICAgfVxyXG4gICAgc2V0Q29tcG9uZW50KGNvbXBvbmVudCkge1xyXG4gICAgICAgIGlmIChjb21wb25lbnQubmFtZSAhPT0gdGhpcy5uYW1lKSB7XHJcbiAgICAgICAgICAgIHRocm93IEVycm9yKGBNaXNtYXRjaGluZyBDb21wb25lbnQgJHtjb21wb25lbnQubmFtZX0gZm9yIFByb3ZpZGVyICR7dGhpcy5uYW1lfS5gKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuY29tcG9uZW50KSB7XHJcbiAgICAgICAgICAgIHRocm93IEVycm9yKGBDb21wb25lbnQgZm9yICR7dGhpcy5uYW1lfSBoYXMgYWxyZWFkeSBiZWVuIHByb3ZpZGVkYCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY29tcG9uZW50ID0gY29tcG9uZW50O1xyXG4gICAgICAgIC8vIHJldHVybiBlYXJseSB3aXRob3V0IGF0dGVtcHRpbmcgdG8gaW5pdGlhbGl6ZSB0aGUgY29tcG9uZW50IGlmIHRoZSBjb21wb25lbnQgcmVxdWlyZXMgZXhwbGljaXQgaW5pdGlhbGl6YXRpb24gKGNhbGxpbmcgYFByb3ZpZGVyLmluaXRpYWxpemUoKWApXHJcbiAgICAgICAgaWYgKCF0aGlzLnNob3VsZEF1dG9Jbml0aWFsaXplKCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBpZiB0aGUgc2VydmljZSBpcyBlYWdlciwgaW5pdGlhbGl6ZSB0aGUgZGVmYXVsdCBpbnN0YW5jZVxyXG4gICAgICAgIGlmIChpc0NvbXBvbmVudEVhZ2VyKGNvbXBvbmVudCkpIHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2V0T3JJbml0aWFsaXplU2VydmljZSh7IGluc3RhbmNlSWRlbnRpZmllcjogREVGQVVMVF9FTlRSWV9OQU1FIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAvLyB3aGVuIHRoZSBpbnN0YW5jZSBmYWN0b3J5IGZvciBhbiBlYWdlciBDb21wb25lbnQgdGhyb3dzIGFuIGV4Y2VwdGlvbiBkdXJpbmcgdGhlIGVhZ2VyXHJcbiAgICAgICAgICAgICAgICAvLyBpbml0aWFsaXphdGlvbiwgaXQgc2hvdWxkIG5vdCBjYXVzZSBhIGZhdGFsIGVycm9yLlxyXG4gICAgICAgICAgICAgICAgLy8gVE9ETzogSW52ZXN0aWdhdGUgaWYgd2UgbmVlZCB0byBtYWtlIGl0IGNvbmZpZ3VyYWJsZSwgYmVjYXVzZSBzb21lIGNvbXBvbmVudCBtYXkgd2FudCB0byBjYXVzZVxyXG4gICAgICAgICAgICAgICAgLy8gYSBmYXRhbCBlcnJvciBpbiB0aGlzIGNhc2U/XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gQ3JlYXRlIHNlcnZpY2UgaW5zdGFuY2VzIGZvciB0aGUgcGVuZGluZyBwcm9taXNlcyBhbmQgcmVzb2x2ZSB0aGVtXHJcbiAgICAgICAgLy8gTk9URTogaWYgdGhpcy5tdWx0aXBsZUluc3RhbmNlcyBpcyBmYWxzZSwgb25seSB0aGUgZGVmYXVsdCBpbnN0YW5jZSB3aWxsIGJlIGNyZWF0ZWRcclxuICAgICAgICAvLyBhbmQgYWxsIHByb21pc2VzIHdpdGggcmVzb2x2ZSB3aXRoIGl0IHJlZ2FyZGxlc3Mgb2YgdGhlIGlkZW50aWZpZXIuXHJcbiAgICAgICAgZm9yIChjb25zdCBbaW5zdGFuY2VJZGVudGlmaWVyLCBpbnN0YW5jZURlZmVycmVkXSBvZiB0aGlzLmluc3RhbmNlc0RlZmVycmVkLmVudHJpZXMoKSkge1xyXG4gICAgICAgICAgICBjb25zdCBub3JtYWxpemVkSWRlbnRpZmllciA9IHRoaXMubm9ybWFsaXplSW5zdGFuY2VJZGVudGlmaWVyKGluc3RhbmNlSWRlbnRpZmllcik7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAvLyBgZ2V0T3JJbml0aWFsaXplU2VydmljZSgpYCBzaG91bGQgYWx3YXlzIHJldHVybiBhIHZhbGlkIGluc3RhbmNlIHNpbmNlIGEgY29tcG9uZW50IGlzIGd1YXJhbnRlZWQuIHVzZSAhIHRvIG1ha2UgdHlwZXNjcmlwdCBoYXBweS5cclxuICAgICAgICAgICAgICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcy5nZXRPckluaXRpYWxpemVTZXJ2aWNlKHtcclxuICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZUlkZW50aWZpZXI6IG5vcm1hbGl6ZWRJZGVudGlmaWVyXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGluc3RhbmNlRGVmZXJyZWQucmVzb2x2ZShpbnN0YW5jZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIC8vIHdoZW4gdGhlIGluc3RhbmNlIGZhY3RvcnkgdGhyb3dzIGFuIGV4Y2VwdGlvbiwgaXQgc2hvdWxkIG5vdCBjYXVzZVxyXG4gICAgICAgICAgICAgICAgLy8gYSBmYXRhbCBlcnJvci4gV2UganVzdCBsZWF2ZSB0aGUgcHJvbWlzZSB1bnJlc29sdmVkLlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgY2xlYXJJbnN0YW5jZShpZGVudGlmaWVyID0gREVGQVVMVF9FTlRSWV9OQU1FKSB7XHJcbiAgICAgICAgdGhpcy5pbnN0YW5jZXNEZWZlcnJlZC5kZWxldGUoaWRlbnRpZmllcik7XHJcbiAgICAgICAgdGhpcy5pbnN0YW5jZXNPcHRpb25zLmRlbGV0ZShpZGVudGlmaWVyKTtcclxuICAgICAgICB0aGlzLmluc3RhbmNlcy5kZWxldGUoaWRlbnRpZmllcik7XHJcbiAgICB9XHJcbiAgICAvLyBhcHAuZGVsZXRlKCkgd2lsbCBjYWxsIHRoaXMgbWV0aG9kIG9uIGV2ZXJ5IHByb3ZpZGVyIHRvIGRlbGV0ZSB0aGUgc2VydmljZXNcclxuICAgIC8vIFRPRE86IHNob3VsZCB3ZSBtYXJrIHRoZSBwcm92aWRlciBhcyBkZWxldGVkP1xyXG4gICAgYXN5bmMgZGVsZXRlKCkge1xyXG4gICAgICAgIGNvbnN0IHNlcnZpY2VzID0gQXJyYXkuZnJvbSh0aGlzLmluc3RhbmNlcy52YWx1ZXMoKSk7XHJcbiAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoW1xyXG4gICAgICAgICAgICAuLi5zZXJ2aWNlc1xyXG4gICAgICAgICAgICAgICAgLmZpbHRlcihzZXJ2aWNlID0+ICdJTlRFUk5BTCcgaW4gc2VydmljZSkgLy8gbGVnYWN5IHNlcnZpY2VzXHJcbiAgICAgICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxyXG4gICAgICAgICAgICAgICAgLm1hcChzZXJ2aWNlID0+IHNlcnZpY2UuSU5URVJOQUwuZGVsZXRlKCkpLFxyXG4gICAgICAgICAgICAuLi5zZXJ2aWNlc1xyXG4gICAgICAgICAgICAgICAgLmZpbHRlcihzZXJ2aWNlID0+ICdfZGVsZXRlJyBpbiBzZXJ2aWNlKSAvLyBtb2R1bGFyaXplZCBzZXJ2aWNlc1xyXG4gICAgICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcclxuICAgICAgICAgICAgICAgIC5tYXAoc2VydmljZSA9PiBzZXJ2aWNlLl9kZWxldGUoKSlcclxuICAgICAgICBdKTtcclxuICAgIH1cclxuICAgIGlzQ29tcG9uZW50U2V0KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbXBvbmVudCAhPSBudWxsO1xyXG4gICAgfVxyXG4gICAgaXNJbml0aWFsaXplZChpZGVudGlmaWVyID0gREVGQVVMVF9FTlRSWV9OQU1FKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5zdGFuY2VzLmhhcyhpZGVudGlmaWVyKTtcclxuICAgIH1cclxuICAgIGdldE9wdGlvbnMoaWRlbnRpZmllciA9IERFRkFVTFRfRU5UUllfTkFNRSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmluc3RhbmNlc09wdGlvbnMuZ2V0KGlkZW50aWZpZXIpIHx8IHt9O1xyXG4gICAgfVxyXG4gICAgaW5pdGlhbGl6ZShvcHRzID0ge30pIHtcclxuICAgICAgICBjb25zdCB7IG9wdGlvbnMgPSB7fSB9ID0gb3B0cztcclxuICAgICAgICBjb25zdCBub3JtYWxpemVkSWRlbnRpZmllciA9IHRoaXMubm9ybWFsaXplSW5zdGFuY2VJZGVudGlmaWVyKG9wdHMuaW5zdGFuY2VJZGVudGlmaWVyKTtcclxuICAgICAgICBpZiAodGhpcy5pc0luaXRpYWxpemVkKG5vcm1hbGl6ZWRJZGVudGlmaWVyKSkge1xyXG4gICAgICAgICAgICB0aHJvdyBFcnJvcihgJHt0aGlzLm5hbWV9KCR7bm9ybWFsaXplZElkZW50aWZpZXJ9KSBoYXMgYWxyZWFkeSBiZWVuIGluaXRpYWxpemVkYCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghdGhpcy5pc0NvbXBvbmVudFNldCgpKSB7XHJcbiAgICAgICAgICAgIHRocm93IEVycm9yKGBDb21wb25lbnQgJHt0aGlzLm5hbWV9IGhhcyBub3QgYmVlbiByZWdpc3RlcmVkIHlldGApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuZ2V0T3JJbml0aWFsaXplU2VydmljZSh7XHJcbiAgICAgICAgICAgIGluc3RhbmNlSWRlbnRpZmllcjogbm9ybWFsaXplZElkZW50aWZpZXIsXHJcbiAgICAgICAgICAgIG9wdGlvbnNcclxuICAgICAgICB9KTtcclxuICAgICAgICAvLyByZXNvbHZlIGFueSBwZW5kaW5nIHByb21pc2Ugd2FpdGluZyBmb3IgdGhlIHNlcnZpY2UgaW5zdGFuY2VcclxuICAgICAgICBmb3IgKGNvbnN0IFtpbnN0YW5jZUlkZW50aWZpZXIsIGluc3RhbmNlRGVmZXJyZWRdIG9mIHRoaXMuaW5zdGFuY2VzRGVmZXJyZWQuZW50cmllcygpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5vcm1hbGl6ZWREZWZlcnJlZElkZW50aWZpZXIgPSB0aGlzLm5vcm1hbGl6ZUluc3RhbmNlSWRlbnRpZmllcihpbnN0YW5jZUlkZW50aWZpZXIpO1xyXG4gICAgICAgICAgICBpZiAobm9ybWFsaXplZElkZW50aWZpZXIgPT09IG5vcm1hbGl6ZWREZWZlcnJlZElkZW50aWZpZXIpIHtcclxuICAgICAgICAgICAgICAgIGluc3RhbmNlRGVmZXJyZWQucmVzb2x2ZShpbnN0YW5jZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGNhbGxiYWNrIC0gYSBmdW5jdGlvbiB0aGF0IHdpbGwgYmUgaW52b2tlZCAgYWZ0ZXIgdGhlIHByb3ZpZGVyIGhhcyBiZWVuIGluaXRpYWxpemVkIGJ5IGNhbGxpbmcgcHJvdmlkZXIuaW5pdGlhbGl6ZSgpLlxyXG4gICAgICogVGhlIGZ1bmN0aW9uIGlzIGludm9rZWQgU1lOQ0hST05PVVNMWSwgc28gaXQgc2hvdWxkIG5vdCBleGVjdXRlIGFueSBsb25ncnVubmluZyB0YXNrcyBpbiBvcmRlciB0byBub3QgYmxvY2sgdGhlIHByb2dyYW0uXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGlkZW50aWZpZXIgQW4gb3B0aW9uYWwgaW5zdGFuY2UgaWRlbnRpZmllclxyXG4gICAgICogQHJldHVybnMgYSBmdW5jdGlvbiB0byB1bnJlZ2lzdGVyIHRoZSBjYWxsYmFja1xyXG4gICAgICovXHJcbiAgICBvbkluaXQoY2FsbGJhY2ssIGlkZW50aWZpZXIpIHtcclxuICAgICAgICB2YXIgX2E7XHJcbiAgICAgICAgY29uc3Qgbm9ybWFsaXplZElkZW50aWZpZXIgPSB0aGlzLm5vcm1hbGl6ZUluc3RhbmNlSWRlbnRpZmllcihpZGVudGlmaWVyKTtcclxuICAgICAgICBjb25zdCBleGlzdGluZ0NhbGxiYWNrcyA9IChfYSA9IHRoaXMub25Jbml0Q2FsbGJhY2tzLmdldChub3JtYWxpemVkSWRlbnRpZmllcikpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IG5ldyBTZXQoKTtcclxuICAgICAgICBleGlzdGluZ0NhbGxiYWNrcy5hZGQoY2FsbGJhY2spO1xyXG4gICAgICAgIHRoaXMub25Jbml0Q2FsbGJhY2tzLnNldChub3JtYWxpemVkSWRlbnRpZmllciwgZXhpc3RpbmdDYWxsYmFja3MpO1xyXG4gICAgICAgIGNvbnN0IGV4aXN0aW5nSW5zdGFuY2UgPSB0aGlzLmluc3RhbmNlcy5nZXQobm9ybWFsaXplZElkZW50aWZpZXIpO1xyXG4gICAgICAgIGlmIChleGlzdGluZ0luc3RhbmNlKSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKGV4aXN0aW5nSW5zdGFuY2UsIG5vcm1hbGl6ZWRJZGVudGlmaWVyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuICgpID0+IHtcclxuICAgICAgICAgICAgZXhpc3RpbmdDYWxsYmFja3MuZGVsZXRlKGNhbGxiYWNrKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBJbnZva2Ugb25Jbml0IGNhbGxiYWNrcyBzeW5jaHJvbm91c2x5XHJcbiAgICAgKiBAcGFyYW0gaW5zdGFuY2UgdGhlIHNlcnZpY2UgaW5zdGFuY2VgXHJcbiAgICAgKi9cclxuICAgIGludm9rZU9uSW5pdENhbGxiYWNrcyhpbnN0YW5jZSwgaWRlbnRpZmllcikge1xyXG4gICAgICAgIGNvbnN0IGNhbGxiYWNrcyA9IHRoaXMub25Jbml0Q2FsbGJhY2tzLmdldChpZGVudGlmaWVyKTtcclxuICAgICAgICBpZiAoIWNhbGxiYWNrcykge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAoY29uc3QgY2FsbGJhY2sgb2YgY2FsbGJhY2tzKSB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhpbnN0YW5jZSwgaWRlbnRpZmllcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2F0Y2ggKF9hKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBpZ25vcmUgZXJyb3JzIGluIHRoZSBvbkluaXQgY2FsbGJhY2tcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGdldE9ySW5pdGlhbGl6ZVNlcnZpY2UoeyBpbnN0YW5jZUlkZW50aWZpZXIsIG9wdGlvbnMgPSB7fSB9KSB7XHJcbiAgICAgICAgbGV0IGluc3RhbmNlID0gdGhpcy5pbnN0YW5jZXMuZ2V0KGluc3RhbmNlSWRlbnRpZmllcik7XHJcbiAgICAgICAgaWYgKCFpbnN0YW5jZSAmJiB0aGlzLmNvbXBvbmVudCkge1xyXG4gICAgICAgICAgICBpbnN0YW5jZSA9IHRoaXMuY29tcG9uZW50Lmluc3RhbmNlRmFjdG9yeSh0aGlzLmNvbnRhaW5lciwge1xyXG4gICAgICAgICAgICAgICAgaW5zdGFuY2VJZGVudGlmaWVyOiBub3JtYWxpemVJZGVudGlmaWVyRm9yRmFjdG9yeShpbnN0YW5jZUlkZW50aWZpZXIpLFxyXG4gICAgICAgICAgICAgICAgb3B0aW9uc1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy5pbnN0YW5jZXMuc2V0KGluc3RhbmNlSWRlbnRpZmllciwgaW5zdGFuY2UpO1xyXG4gICAgICAgICAgICB0aGlzLmluc3RhbmNlc09wdGlvbnMuc2V0KGluc3RhbmNlSWRlbnRpZmllciwgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBJbnZva2Ugb25Jbml0IGxpc3RlbmVycy5cclxuICAgICAgICAgICAgICogTm90ZSB0aGlzLmNvbXBvbmVudC5vbkluc3RhbmNlQ3JlYXRlZCBpcyBkaWZmZXJlbnQsIHdoaWNoIGlzIHVzZWQgYnkgdGhlIGNvbXBvbmVudCBjcmVhdG9yLFxyXG4gICAgICAgICAgICAgKiB3aGlsZSBvbkluaXQgbGlzdGVuZXJzIGFyZSByZWdpc3RlcmVkIGJ5IGNvbnN1bWVycyBvZiB0aGUgcHJvdmlkZXIuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB0aGlzLmludm9rZU9uSW5pdENhbGxiYWNrcyhpbnN0YW5jZSwgaW5zdGFuY2VJZGVudGlmaWVyKTtcclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIE9yZGVyIGlzIGltcG9ydGFudFxyXG4gICAgICAgICAgICAgKiBvbkluc3RhbmNlQ3JlYXRlZCgpIHNob3VsZCBiZSBjYWxsZWQgYWZ0ZXIgdGhpcy5pbnN0YW5jZXMuc2V0KGluc3RhbmNlSWRlbnRpZmllciwgaW5zdGFuY2UpOyB3aGljaFxyXG4gICAgICAgICAgICAgKiBtYWtlcyBgaXNJbml0aWFsaXplZCgpYCByZXR1cm4gdHJ1ZS5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbXBvbmVudC5vbkluc3RhbmNlQ3JlYXRlZCkge1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbXBvbmVudC5vbkluc3RhbmNlQ3JlYXRlZCh0aGlzLmNvbnRhaW5lciwgaW5zdGFuY2VJZGVudGlmaWVyLCBpbnN0YW5jZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjYXRjaCAoX2EpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBpZ25vcmUgZXJyb3JzIGluIHRoZSBvbkluc3RhbmNlQ3JlYXRlZENhbGxiYWNrXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGluc3RhbmNlIHx8IG51bGw7XHJcbiAgICB9XHJcbiAgICBub3JtYWxpemVJbnN0YW5jZUlkZW50aWZpZXIoaWRlbnRpZmllciA9IERFRkFVTFRfRU5UUllfTkFNRSkge1xyXG4gICAgICAgIGlmICh0aGlzLmNvbXBvbmVudCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jb21wb25lbnQubXVsdGlwbGVJbnN0YW5jZXMgPyBpZGVudGlmaWVyIDogREVGQVVMVF9FTlRSWV9OQU1FO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIGlkZW50aWZpZXI7IC8vIGFzc3VtZSBtdWx0aXBsZSBpbnN0YW5jZXMgYXJlIHN1cHBvcnRlZCBiZWZvcmUgdGhlIGNvbXBvbmVudCBpcyBwcm92aWRlZC5cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBzaG91bGRBdXRvSW5pdGlhbGl6ZSgpIHtcclxuICAgICAgICByZXR1cm4gKCEhdGhpcy5jb21wb25lbnQgJiZcclxuICAgICAgICAgICAgdGhpcy5jb21wb25lbnQuaW5zdGFudGlhdGlvbk1vZGUgIT09IFwiRVhQTElDSVRcIiAvKiBFWFBMSUNJVCAqLyk7XHJcbiAgICB9XHJcbn1cclxuLy8gdW5kZWZpbmVkIHNob3VsZCBiZSBwYXNzZWQgdG8gdGhlIHNlcnZpY2UgZmFjdG9yeSBmb3IgdGhlIGRlZmF1bHQgaW5zdGFuY2VcclxuZnVuY3Rpb24gbm9ybWFsaXplSWRlbnRpZmllckZvckZhY3RvcnkoaWRlbnRpZmllcikge1xyXG4gICAgcmV0dXJuIGlkZW50aWZpZXIgPT09IERFRkFVTFRfRU5UUllfTkFNRSA/IHVuZGVmaW5lZCA6IGlkZW50aWZpZXI7XHJcbn1cclxuZnVuY3Rpb24gaXNDb21wb25lbnRFYWdlcihjb21wb25lbnQpIHtcclxuICAgIHJldHVybiBjb21wb25lbnQuaW5zdGFudGlhdGlvbk1vZGUgPT09IFwiRUFHRVJcIiAvKiBFQUdFUiAqLztcclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG4vKipcclxuICogQ29tcG9uZW50Q29udGFpbmVyIHRoYXQgcHJvdmlkZXMgUHJvdmlkZXJzIGZvciBzZXJ2aWNlIG5hbWUgVCwgZS5nLiBgYXV0aGAsIGBhdXRoLWludGVybmFsYFxyXG4gKi9cclxuY2xhc3MgQ29tcG9uZW50Q29udGFpbmVyIHtcclxuICAgIGNvbnN0cnVjdG9yKG5hbWUpIHtcclxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgICAgIHRoaXMucHJvdmlkZXJzID0gbmV3IE1hcCgpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGNvbXBvbmVudCBDb21wb25lbnQgYmVpbmcgYWRkZWRcclxuICAgICAqIEBwYXJhbSBvdmVyd3JpdGUgV2hlbiBhIGNvbXBvbmVudCB3aXRoIHRoZSBzYW1lIG5hbWUgaGFzIGFscmVhZHkgYmVlbiByZWdpc3RlcmVkLFxyXG4gICAgICogaWYgb3ZlcndyaXRlIGlzIHRydWU6IG92ZXJ3cml0ZSB0aGUgZXhpc3RpbmcgY29tcG9uZW50IHdpdGggdGhlIG5ldyBjb21wb25lbnQgYW5kIGNyZWF0ZSBhIG5ld1xyXG4gICAgICogcHJvdmlkZXIgd2l0aCB0aGUgbmV3IGNvbXBvbmVudC4gSXQgY2FuIGJlIHVzZWZ1bCBpbiB0ZXN0cyB3aGVyZSB5b3Ugd2FudCB0byB1c2UgZGlmZmVyZW50IG1vY2tzXHJcbiAgICAgKiBmb3IgZGlmZmVyZW50IHRlc3RzLlxyXG4gICAgICogaWYgb3ZlcndyaXRlIGlzIGZhbHNlOiB0aHJvdyBhbiBleGNlcHRpb25cclxuICAgICAqL1xyXG4gICAgYWRkQ29tcG9uZW50KGNvbXBvbmVudCkge1xyXG4gICAgICAgIGNvbnN0IHByb3ZpZGVyID0gdGhpcy5nZXRQcm92aWRlcihjb21wb25lbnQubmFtZSk7XHJcbiAgICAgICAgaWYgKHByb3ZpZGVyLmlzQ29tcG9uZW50U2V0KCkpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDb21wb25lbnQgJHtjb21wb25lbnQubmFtZX0gaGFzIGFscmVhZHkgYmVlbiByZWdpc3RlcmVkIHdpdGggJHt0aGlzLm5hbWV9YCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3ZpZGVyLnNldENvbXBvbmVudChjb21wb25lbnQpO1xyXG4gICAgfVxyXG4gICAgYWRkT3JPdmVyd3JpdGVDb21wb25lbnQoY29tcG9uZW50KSB7XHJcbiAgICAgICAgY29uc3QgcHJvdmlkZXIgPSB0aGlzLmdldFByb3ZpZGVyKGNvbXBvbmVudC5uYW1lKTtcclxuICAgICAgICBpZiAocHJvdmlkZXIuaXNDb21wb25lbnRTZXQoKSkge1xyXG4gICAgICAgICAgICAvLyBkZWxldGUgdGhlIGV4aXN0aW5nIHByb3ZpZGVyIGZyb20gdGhlIGNvbnRhaW5lciwgc28gd2UgY2FuIHJlZ2lzdGVyIHRoZSBuZXcgY29tcG9uZW50XHJcbiAgICAgICAgICAgIHRoaXMucHJvdmlkZXJzLmRlbGV0ZShjb21wb25lbnQubmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuYWRkQ29tcG9uZW50KGNvbXBvbmVudCk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIGdldFByb3ZpZGVyIHByb3ZpZGVzIGEgdHlwZSBzYWZlIGludGVyZmFjZSB3aGVyZSBpdCBjYW4gb25seSBiZSBjYWxsZWQgd2l0aCBhIGZpZWxkIG5hbWVcclxuICAgICAqIHByZXNlbnQgaW4gTmFtZVNlcnZpY2VNYXBwaW5nIGludGVyZmFjZS5cclxuICAgICAqXHJcbiAgICAgKiBGaXJlYmFzZSBTREtzIHByb3ZpZGluZyBzZXJ2aWNlcyBzaG91bGQgZXh0ZW5kIE5hbWVTZXJ2aWNlTWFwcGluZyBpbnRlcmZhY2UgdG8gcmVnaXN0ZXJcclxuICAgICAqIHRoZW1zZWx2ZXMuXHJcbiAgICAgKi9cclxuICAgIGdldFByb3ZpZGVyKG5hbWUpIHtcclxuICAgICAgICBpZiAodGhpcy5wcm92aWRlcnMuaGFzKG5hbWUpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb3ZpZGVycy5nZXQobmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGNyZWF0ZSBhIFByb3ZpZGVyIGZvciBhIHNlcnZpY2UgdGhhdCBoYXNuJ3QgcmVnaXN0ZXJlZCB3aXRoIEZpcmViYXNlXHJcbiAgICAgICAgY29uc3QgcHJvdmlkZXIgPSBuZXcgUHJvdmlkZXIobmFtZSwgdGhpcyk7XHJcbiAgICAgICAgdGhpcy5wcm92aWRlcnMuc2V0KG5hbWUsIHByb3ZpZGVyKTtcclxuICAgICAgICByZXR1cm4gcHJvdmlkZXI7XHJcbiAgICB9XHJcbiAgICBnZXRQcm92aWRlcnMoKSB7XHJcbiAgICAgICAgcmV0dXJuIEFycmF5LmZyb20odGhpcy5wcm92aWRlcnMudmFsdWVzKCkpO1xyXG4gICAgfVxyXG59XG5cbmV4cG9ydCB7IENvbXBvbmVudCwgQ29tcG9uZW50Q29udGFpbmVyLCBQcm92aWRlciB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguZXNtMjAxNy5qcy5tYXBcbiIsIi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbi8qKlxyXG4gKiBBIGNvbnRhaW5lciBmb3IgYWxsIG9mIHRoZSBMb2dnZXIgaW5zdGFuY2VzXHJcbiAqL1xyXG5jb25zdCBpbnN0YW5jZXMgPSBbXTtcclxuLyoqXHJcbiAqIFRoZSBKUyBTREsgc3VwcG9ydHMgNSBsb2cgbGV2ZWxzIGFuZCBhbHNvIGFsbG93cyBhIHVzZXIgdGhlIGFiaWxpdHkgdG9cclxuICogc2lsZW5jZSB0aGUgbG9ncyBhbHRvZ2V0aGVyLlxyXG4gKlxyXG4gKiBUaGUgb3JkZXIgaXMgYSBmb2xsb3dzOlxyXG4gKiBERUJVRyA8IFZFUkJPU0UgPCBJTkZPIDwgV0FSTiA8IEVSUk9SXHJcbiAqXHJcbiAqIEFsbCBvZiB0aGUgbG9nIHR5cGVzIGFib3ZlIHRoZSBjdXJyZW50IGxvZyBsZXZlbCB3aWxsIGJlIGNhcHR1cmVkIChpLmUuIGlmXHJcbiAqIHlvdSBzZXQgdGhlIGxvZyBsZXZlbCB0byBgSU5GT2AsIGVycm9ycyB3aWxsIHN0aWxsIGJlIGxvZ2dlZCwgYnV0IGBERUJVR2AgYW5kXHJcbiAqIGBWRVJCT1NFYCBsb2dzIHdpbGwgbm90KVxyXG4gKi9cclxudmFyIExvZ0xldmVsO1xyXG4oZnVuY3Rpb24gKExvZ0xldmVsKSB7XHJcbiAgICBMb2dMZXZlbFtMb2dMZXZlbFtcIkRFQlVHXCJdID0gMF0gPSBcIkRFQlVHXCI7XHJcbiAgICBMb2dMZXZlbFtMb2dMZXZlbFtcIlZFUkJPU0VcIl0gPSAxXSA9IFwiVkVSQk9TRVwiO1xyXG4gICAgTG9nTGV2ZWxbTG9nTGV2ZWxbXCJJTkZPXCJdID0gMl0gPSBcIklORk9cIjtcclxuICAgIExvZ0xldmVsW0xvZ0xldmVsW1wiV0FSTlwiXSA9IDNdID0gXCJXQVJOXCI7XHJcbiAgICBMb2dMZXZlbFtMb2dMZXZlbFtcIkVSUk9SXCJdID0gNF0gPSBcIkVSUk9SXCI7XHJcbiAgICBMb2dMZXZlbFtMb2dMZXZlbFtcIlNJTEVOVFwiXSA9IDVdID0gXCJTSUxFTlRcIjtcclxufSkoTG9nTGV2ZWwgfHwgKExvZ0xldmVsID0ge30pKTtcclxuY29uc3QgbGV2ZWxTdHJpbmdUb0VudW0gPSB7XHJcbiAgICAnZGVidWcnOiBMb2dMZXZlbC5ERUJVRyxcclxuICAgICd2ZXJib3NlJzogTG9nTGV2ZWwuVkVSQk9TRSxcclxuICAgICdpbmZvJzogTG9nTGV2ZWwuSU5GTyxcclxuICAgICd3YXJuJzogTG9nTGV2ZWwuV0FSTixcclxuICAgICdlcnJvcic6IExvZ0xldmVsLkVSUk9SLFxyXG4gICAgJ3NpbGVudCc6IExvZ0xldmVsLlNJTEVOVFxyXG59O1xyXG4vKipcclxuICogVGhlIGRlZmF1bHQgbG9nIGxldmVsXHJcbiAqL1xyXG5jb25zdCBkZWZhdWx0TG9nTGV2ZWwgPSBMb2dMZXZlbC5JTkZPO1xyXG4vKipcclxuICogQnkgZGVmYXVsdCwgYGNvbnNvbGUuZGVidWdgIGlzIG5vdCBkaXNwbGF5ZWQgaW4gdGhlIGRldmVsb3BlciBjb25zb2xlIChpblxyXG4gKiBjaHJvbWUpLiBUbyBhdm9pZCBmb3JjaW5nIHVzZXJzIHRvIGhhdmUgdG8gb3B0LWluIHRvIHRoZXNlIGxvZ3MgdHdpY2VcclxuICogKGkuZS4gb25jZSBmb3IgZmlyZWJhc2UsIGFuZCBvbmNlIGluIHRoZSBjb25zb2xlKSwgd2UgYXJlIHNlbmRpbmcgYERFQlVHYFxyXG4gKiBsb2dzIHRvIHRoZSBgY29uc29sZS5sb2dgIGZ1bmN0aW9uLlxyXG4gKi9cclxuY29uc3QgQ29uc29sZU1ldGhvZCA9IHtcclxuICAgIFtMb2dMZXZlbC5ERUJVR106ICdsb2cnLFxyXG4gICAgW0xvZ0xldmVsLlZFUkJPU0VdOiAnbG9nJyxcclxuICAgIFtMb2dMZXZlbC5JTkZPXTogJ2luZm8nLFxyXG4gICAgW0xvZ0xldmVsLldBUk5dOiAnd2FybicsXHJcbiAgICBbTG9nTGV2ZWwuRVJST1JdOiAnZXJyb3InXHJcbn07XHJcbi8qKlxyXG4gKiBUaGUgZGVmYXVsdCBsb2cgaGFuZGxlciB3aWxsIGZvcndhcmQgREVCVUcsIFZFUkJPU0UsIElORk8sIFdBUk4sIGFuZCBFUlJPUlxyXG4gKiBtZXNzYWdlcyBvbiB0byB0aGVpciBjb3JyZXNwb25kaW5nIGNvbnNvbGUgY291bnRlcnBhcnRzIChpZiB0aGUgbG9nIG1ldGhvZFxyXG4gKiBpcyBzdXBwb3J0ZWQgYnkgdGhlIGN1cnJlbnQgbG9nIGxldmVsKVxyXG4gKi9cclxuY29uc3QgZGVmYXVsdExvZ0hhbmRsZXIgPSAoaW5zdGFuY2UsIGxvZ1R5cGUsIC4uLmFyZ3MpID0+IHtcclxuICAgIGlmIChsb2dUeXBlIDwgaW5zdGFuY2UubG9nTGV2ZWwpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCk7XHJcbiAgICBjb25zdCBtZXRob2QgPSBDb25zb2xlTWV0aG9kW2xvZ1R5cGVdO1xyXG4gICAgaWYgKG1ldGhvZCkge1xyXG4gICAgICAgIGNvbnNvbGVbbWV0aG9kXShgWyR7bm93fV0gICR7aW5zdGFuY2UubmFtZX06YCwgLi4uYXJncyk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEF0dGVtcHRlZCB0byBsb2cgYSBtZXNzYWdlIHdpdGggYW4gaW52YWxpZCBsb2dUeXBlICh2YWx1ZTogJHtsb2dUeXBlfSlgKTtcclxuICAgIH1cclxufTtcclxuY2xhc3MgTG9nZ2VyIHtcclxuICAgIC8qKlxyXG4gICAgICogR2l2ZXMgeW91IGFuIGluc3RhbmNlIG9mIGEgTG9nZ2VyIHRvIGNhcHR1cmUgbWVzc2FnZXMgYWNjb3JkaW5nIHRvXHJcbiAgICAgKiBGaXJlYmFzZSdzIGxvZ2dpbmcgc2NoZW1lLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBuYW1lIFRoZSBuYW1lIHRoYXQgdGhlIGxvZ3Mgd2lsbCBiZSBhc3NvY2lhdGVkIHdpdGhcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IobmFtZSkge1xyXG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogVGhlIGxvZyBsZXZlbCBvZiB0aGUgZ2l2ZW4gTG9nZ2VyIGluc3RhbmNlLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuX2xvZ0xldmVsID0gZGVmYXVsdExvZ0xldmVsO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFRoZSBtYWluIChpbnRlcm5hbCkgbG9nIGhhbmRsZXIgZm9yIHRoZSBMb2dnZXIgaW5zdGFuY2UuXHJcbiAgICAgICAgICogQ2FuIGJlIHNldCB0byBhIG5ldyBmdW5jdGlvbiBpbiBpbnRlcm5hbCBwYWNrYWdlIGNvZGUgYnV0IG5vdCBieSB1c2VyLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuX2xvZ0hhbmRsZXIgPSBkZWZhdWx0TG9nSGFuZGxlcjtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBUaGUgb3B0aW9uYWwsIGFkZGl0aW9uYWwsIHVzZXItZGVmaW5lZCBsb2cgaGFuZGxlciBmb3IgdGhlIExvZ2dlciBpbnN0YW5jZS5cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLl91c2VyTG9nSGFuZGxlciA9IG51bGw7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQ2FwdHVyZSB0aGUgY3VycmVudCBpbnN0YW5jZSBmb3IgbGF0ZXIgdXNlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgaW5zdGFuY2VzLnB1c2godGhpcyk7XHJcbiAgICB9XHJcbiAgICBnZXQgbG9nTGV2ZWwoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xvZ0xldmVsO1xyXG4gICAgfVxyXG4gICAgc2V0IGxvZ0xldmVsKHZhbCkge1xyXG4gICAgICAgIGlmICghKHZhbCBpbiBMb2dMZXZlbCkpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihgSW52YWxpZCB2YWx1ZSBcIiR7dmFsfVwiIGFzc2lnbmVkIHRvIFxcYGxvZ0xldmVsXFxgYCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2xvZ0xldmVsID0gdmFsO1xyXG4gICAgfVxyXG4gICAgLy8gV29ya2Fyb3VuZCBmb3Igc2V0dGVyL2dldHRlciBoYXZpbmcgdG8gYmUgdGhlIHNhbWUgdHlwZS5cclxuICAgIHNldExvZ0xldmVsKHZhbCkge1xyXG4gICAgICAgIHRoaXMuX2xvZ0xldmVsID0gdHlwZW9mIHZhbCA9PT0gJ3N0cmluZycgPyBsZXZlbFN0cmluZ1RvRW51bVt2YWxdIDogdmFsO1xyXG4gICAgfVxyXG4gICAgZ2V0IGxvZ0hhbmRsZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xvZ0hhbmRsZXI7XHJcbiAgICB9XHJcbiAgICBzZXQgbG9nSGFuZGxlcih2YWwpIHtcclxuICAgICAgICBpZiAodHlwZW9mIHZhbCAhPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdWYWx1ZSBhc3NpZ25lZCB0byBgbG9nSGFuZGxlcmAgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2xvZ0hhbmRsZXIgPSB2YWw7XHJcbiAgICB9XHJcbiAgICBnZXQgdXNlckxvZ0hhbmRsZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3VzZXJMb2dIYW5kbGVyO1xyXG4gICAgfVxyXG4gICAgc2V0IHVzZXJMb2dIYW5kbGVyKHZhbCkge1xyXG4gICAgICAgIHRoaXMuX3VzZXJMb2dIYW5kbGVyID0gdmFsO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgZnVuY3Rpb25zIGJlbG93IGFyZSBhbGwgYmFzZWQgb24gdGhlIGBjb25zb2xlYCBpbnRlcmZhY2VcclxuICAgICAqL1xyXG4gICAgZGVidWcoLi4uYXJncykge1xyXG4gICAgICAgIHRoaXMuX3VzZXJMb2dIYW5kbGVyICYmIHRoaXMuX3VzZXJMb2dIYW5kbGVyKHRoaXMsIExvZ0xldmVsLkRFQlVHLCAuLi5hcmdzKTtcclxuICAgICAgICB0aGlzLl9sb2dIYW5kbGVyKHRoaXMsIExvZ0xldmVsLkRFQlVHLCAuLi5hcmdzKTtcclxuICAgIH1cclxuICAgIGxvZyguLi5hcmdzKSB7XHJcbiAgICAgICAgdGhpcy5fdXNlckxvZ0hhbmRsZXIgJiZcclxuICAgICAgICAgICAgdGhpcy5fdXNlckxvZ0hhbmRsZXIodGhpcywgTG9nTGV2ZWwuVkVSQk9TRSwgLi4uYXJncyk7XHJcbiAgICAgICAgdGhpcy5fbG9nSGFuZGxlcih0aGlzLCBMb2dMZXZlbC5WRVJCT1NFLCAuLi5hcmdzKTtcclxuICAgIH1cclxuICAgIGluZm8oLi4uYXJncykge1xyXG4gICAgICAgIHRoaXMuX3VzZXJMb2dIYW5kbGVyICYmIHRoaXMuX3VzZXJMb2dIYW5kbGVyKHRoaXMsIExvZ0xldmVsLklORk8sIC4uLmFyZ3MpO1xyXG4gICAgICAgIHRoaXMuX2xvZ0hhbmRsZXIodGhpcywgTG9nTGV2ZWwuSU5GTywgLi4uYXJncyk7XHJcbiAgICB9XHJcbiAgICB3YXJuKC4uLmFyZ3MpIHtcclxuICAgICAgICB0aGlzLl91c2VyTG9nSGFuZGxlciAmJiB0aGlzLl91c2VyTG9nSGFuZGxlcih0aGlzLCBMb2dMZXZlbC5XQVJOLCAuLi5hcmdzKTtcclxuICAgICAgICB0aGlzLl9sb2dIYW5kbGVyKHRoaXMsIExvZ0xldmVsLldBUk4sIC4uLmFyZ3MpO1xyXG4gICAgfVxyXG4gICAgZXJyb3IoLi4uYXJncykge1xyXG4gICAgICAgIHRoaXMuX3VzZXJMb2dIYW5kbGVyICYmIHRoaXMuX3VzZXJMb2dIYW5kbGVyKHRoaXMsIExvZ0xldmVsLkVSUk9SLCAuLi5hcmdzKTtcclxuICAgICAgICB0aGlzLl9sb2dIYW5kbGVyKHRoaXMsIExvZ0xldmVsLkVSUk9SLCAuLi5hcmdzKTtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBzZXRMb2dMZXZlbChsZXZlbCkge1xyXG4gICAgaW5zdGFuY2VzLmZvckVhY2goaW5zdCA9PiB7XHJcbiAgICAgICAgaW5zdC5zZXRMb2dMZXZlbChsZXZlbCk7XHJcbiAgICB9KTtcclxufVxyXG5mdW5jdGlvbiBzZXRVc2VyTG9nSGFuZGxlcihsb2dDYWxsYmFjaywgb3B0aW9ucykge1xyXG4gICAgZm9yIChjb25zdCBpbnN0YW5jZSBvZiBpbnN0YW5jZXMpIHtcclxuICAgICAgICBsZXQgY3VzdG9tTG9nTGV2ZWwgPSBudWxsO1xyXG4gICAgICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMubGV2ZWwpIHtcclxuICAgICAgICAgICAgY3VzdG9tTG9nTGV2ZWwgPSBsZXZlbFN0cmluZ1RvRW51bVtvcHRpb25zLmxldmVsXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGxvZ0NhbGxiYWNrID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGluc3RhbmNlLnVzZXJMb2dIYW5kbGVyID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGluc3RhbmNlLnVzZXJMb2dIYW5kbGVyID0gKGluc3RhbmNlLCBsZXZlbCwgLi4uYXJncykgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9IGFyZ3NcclxuICAgICAgICAgICAgICAgICAgICAubWFwKGFyZyA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFyZyA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICh0eXBlb2YgYXJnID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXJnO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICh0eXBlb2YgYXJnID09PSAnbnVtYmVyJyB8fCB0eXBlb2YgYXJnID09PSAnYm9vbGVhbicpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFyZy50b1N0cmluZygpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChhcmcgaW5zdGFuY2VvZiBFcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXJnLm1lc3NhZ2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGFyZyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2F0Y2ggKGlnbm9yZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKGFyZyA9PiBhcmcpXHJcbiAgICAgICAgICAgICAgICAgICAgLmpvaW4oJyAnKTtcclxuICAgICAgICAgICAgICAgIGlmIChsZXZlbCA+PSAoY3VzdG9tTG9nTGV2ZWwgIT09IG51bGwgJiYgY3VzdG9tTG9nTGV2ZWwgIT09IHZvaWQgMCA/IGN1c3RvbUxvZ0xldmVsIDogaW5zdGFuY2UubG9nTGV2ZWwpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9nQ2FsbGJhY2soe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXZlbDogTG9nTGV2ZWxbbGV2ZWxdLnRvTG93ZXJDYXNlKCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZ3MsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IGluc3RhbmNlLm5hbWVcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cblxuZXhwb3J0IHsgTG9nTGV2ZWwsIExvZ2dlciwgc2V0TG9nTGV2ZWwsIHNldFVzZXJMb2dIYW5kbGVyIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5lc20yMDE3LmpzLm1hcFxuIiwiY29uc3QgaW5zdGFuY2VPZkFueSA9IChvYmplY3QsIGNvbnN0cnVjdG9ycykgPT4gY29uc3RydWN0b3JzLnNvbWUoKGMpID0+IG9iamVjdCBpbnN0YW5jZW9mIGMpO1xuXG5sZXQgaWRiUHJveHlhYmxlVHlwZXM7XG5sZXQgY3Vyc29yQWR2YW5jZU1ldGhvZHM7XG4vLyBUaGlzIGlzIGEgZnVuY3Rpb24gdG8gcHJldmVudCBpdCB0aHJvd2luZyB1cCBpbiBub2RlIGVudmlyb25tZW50cy5cbmZ1bmN0aW9uIGdldElkYlByb3h5YWJsZVR5cGVzKCkge1xuICAgIHJldHVybiAoaWRiUHJveHlhYmxlVHlwZXMgfHxcbiAgICAgICAgKGlkYlByb3h5YWJsZVR5cGVzID0gW1xuICAgICAgICAgICAgSURCRGF0YWJhc2UsXG4gICAgICAgICAgICBJREJPYmplY3RTdG9yZSxcbiAgICAgICAgICAgIElEQkluZGV4LFxuICAgICAgICAgICAgSURCQ3Vyc29yLFxuICAgICAgICAgICAgSURCVHJhbnNhY3Rpb24sXG4gICAgICAgIF0pKTtcbn1cbi8vIFRoaXMgaXMgYSBmdW5jdGlvbiB0byBwcmV2ZW50IGl0IHRocm93aW5nIHVwIGluIG5vZGUgZW52aXJvbm1lbnRzLlxuZnVuY3Rpb24gZ2V0Q3Vyc29yQWR2YW5jZU1ldGhvZHMoKSB7XG4gICAgcmV0dXJuIChjdXJzb3JBZHZhbmNlTWV0aG9kcyB8fFxuICAgICAgICAoY3Vyc29yQWR2YW5jZU1ldGhvZHMgPSBbXG4gICAgICAgICAgICBJREJDdXJzb3IucHJvdG90eXBlLmFkdmFuY2UsXG4gICAgICAgICAgICBJREJDdXJzb3IucHJvdG90eXBlLmNvbnRpbnVlLFxuICAgICAgICAgICAgSURCQ3Vyc29yLnByb3RvdHlwZS5jb250aW51ZVByaW1hcnlLZXksXG4gICAgICAgIF0pKTtcbn1cbmNvbnN0IGN1cnNvclJlcXVlc3RNYXAgPSBuZXcgV2Vha01hcCgpO1xuY29uc3QgdHJhbnNhY3Rpb25Eb25lTWFwID0gbmV3IFdlYWtNYXAoKTtcbmNvbnN0IHRyYW5zYWN0aW9uU3RvcmVOYW1lc01hcCA9IG5ldyBXZWFrTWFwKCk7XG5jb25zdCB0cmFuc2Zvcm1DYWNoZSA9IG5ldyBXZWFrTWFwKCk7XG5jb25zdCByZXZlcnNlVHJhbnNmb3JtQ2FjaGUgPSBuZXcgV2Vha01hcCgpO1xuZnVuY3Rpb24gcHJvbWlzaWZ5UmVxdWVzdChyZXF1ZXN0KSB7XG4gICAgY29uc3QgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgY29uc3QgdW5saXN0ZW4gPSAoKSA9PiB7XG4gICAgICAgICAgICByZXF1ZXN0LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3N1Y2Nlc3MnLCBzdWNjZXNzKTtcbiAgICAgICAgICAgIHJlcXVlc3QucmVtb3ZlRXZlbnRMaXN0ZW5lcignZXJyb3InLCBlcnJvcik7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IHN1Y2Nlc3MgPSAoKSA9PiB7XG4gICAgICAgICAgICByZXNvbHZlKHdyYXAocmVxdWVzdC5yZXN1bHQpKTtcbiAgICAgICAgICAgIHVubGlzdGVuKCk7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGVycm9yID0gKCkgPT4ge1xuICAgICAgICAgICAgcmVqZWN0KHJlcXVlc3QuZXJyb3IpO1xuICAgICAgICAgICAgdW5saXN0ZW4oKTtcbiAgICAgICAgfTtcbiAgICAgICAgcmVxdWVzdC5hZGRFdmVudExpc3RlbmVyKCdzdWNjZXNzJywgc3VjY2Vzcyk7XG4gICAgICAgIHJlcXVlc3QuYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCBlcnJvcik7XG4gICAgfSk7XG4gICAgcHJvbWlzZVxuICAgICAgICAudGhlbigodmFsdWUpID0+IHtcbiAgICAgICAgLy8gU2luY2UgY3Vyc29yaW5nIHJldXNlcyB0aGUgSURCUmVxdWVzdCAoKnNpZ2gqKSwgd2UgY2FjaGUgaXQgZm9yIGxhdGVyIHJldHJpZXZhbFxuICAgICAgICAvLyAoc2VlIHdyYXBGdW5jdGlvbikuXG4gICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIElEQkN1cnNvcikge1xuICAgICAgICAgICAgY3Vyc29yUmVxdWVzdE1hcC5zZXQodmFsdWUsIHJlcXVlc3QpO1xuICAgICAgICB9XG4gICAgICAgIC8vIENhdGNoaW5nIHRvIGF2b2lkIFwiVW5jYXVnaHQgUHJvbWlzZSBleGNlcHRpb25zXCJcbiAgICB9KVxuICAgICAgICAuY2F0Y2goKCkgPT4geyB9KTtcbiAgICAvLyBUaGlzIG1hcHBpbmcgZXhpc3RzIGluIHJldmVyc2VUcmFuc2Zvcm1DYWNoZSBidXQgZG9lc24ndCBkb2Vzbid0IGV4aXN0IGluIHRyYW5zZm9ybUNhY2hlLiBUaGlzXG4gICAgLy8gaXMgYmVjYXVzZSB3ZSBjcmVhdGUgbWFueSBwcm9taXNlcyBmcm9tIGEgc2luZ2xlIElEQlJlcXVlc3QuXG4gICAgcmV2ZXJzZVRyYW5zZm9ybUNhY2hlLnNldChwcm9taXNlLCByZXF1ZXN0KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbn1cbmZ1bmN0aW9uIGNhY2hlRG9uZVByb21pc2VGb3JUcmFuc2FjdGlvbih0eCkge1xuICAgIC8vIEVhcmx5IGJhaWwgaWYgd2UndmUgYWxyZWFkeSBjcmVhdGVkIGEgZG9uZSBwcm9taXNlIGZvciB0aGlzIHRyYW5zYWN0aW9uLlxuICAgIGlmICh0cmFuc2FjdGlvbkRvbmVNYXAuaGFzKHR4KSlcbiAgICAgICAgcmV0dXJuO1xuICAgIGNvbnN0IGRvbmUgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGNvbnN0IHVubGlzdGVuID0gKCkgPT4ge1xuICAgICAgICAgICAgdHgucmVtb3ZlRXZlbnRMaXN0ZW5lcignY29tcGxldGUnLCBjb21wbGV0ZSk7XG4gICAgICAgICAgICB0eC5yZW1vdmVFdmVudExpc3RlbmVyKCdlcnJvcicsIGVycm9yKTtcbiAgICAgICAgICAgIHR4LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2Fib3J0JywgZXJyb3IpO1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCBjb21wbGV0ZSA9ICgpID0+IHtcbiAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgIHVubGlzdGVuKCk7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGVycm9yID0gKCkgPT4ge1xuICAgICAgICAgICAgcmVqZWN0KHR4LmVycm9yIHx8IG5ldyBET01FeGNlcHRpb24oJ0Fib3J0RXJyb3InLCAnQWJvcnRFcnJvcicpKTtcbiAgICAgICAgICAgIHVubGlzdGVuKCk7XG4gICAgICAgIH07XG4gICAgICAgIHR4LmFkZEV2ZW50TGlzdGVuZXIoJ2NvbXBsZXRlJywgY29tcGxldGUpO1xuICAgICAgICB0eC5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIGVycm9yKTtcbiAgICAgICAgdHguYWRkRXZlbnRMaXN0ZW5lcignYWJvcnQnLCBlcnJvcik7XG4gICAgfSk7XG4gICAgLy8gQ2FjaGUgaXQgZm9yIGxhdGVyIHJldHJpZXZhbC5cbiAgICB0cmFuc2FjdGlvbkRvbmVNYXAuc2V0KHR4LCBkb25lKTtcbn1cbmxldCBpZGJQcm94eVRyYXBzID0ge1xuICAgIGdldCh0YXJnZXQsIHByb3AsIHJlY2VpdmVyKSB7XG4gICAgICAgIGlmICh0YXJnZXQgaW5zdGFuY2VvZiBJREJUcmFuc2FjdGlvbikge1xuICAgICAgICAgICAgLy8gU3BlY2lhbCBoYW5kbGluZyBmb3IgdHJhbnNhY3Rpb24uZG9uZS5cbiAgICAgICAgICAgIGlmIChwcm9wID09PSAnZG9uZScpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRyYW5zYWN0aW9uRG9uZU1hcC5nZXQodGFyZ2V0KTtcbiAgICAgICAgICAgIC8vIFBvbHlmaWxsIGZvciBvYmplY3RTdG9yZU5hbWVzIGJlY2F1c2Ugb2YgRWRnZS5cbiAgICAgICAgICAgIGlmIChwcm9wID09PSAnb2JqZWN0U3RvcmVOYW1lcycpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGFyZ2V0Lm9iamVjdFN0b3JlTmFtZXMgfHwgdHJhbnNhY3Rpb25TdG9yZU5hbWVzTWFwLmdldCh0YXJnZXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gTWFrZSB0eC5zdG9yZSByZXR1cm4gdGhlIG9ubHkgc3RvcmUgaW4gdGhlIHRyYW5zYWN0aW9uLCBvciB1bmRlZmluZWQgaWYgdGhlcmUgYXJlIG1hbnkuXG4gICAgICAgICAgICBpZiAocHJvcCA9PT0gJ3N0b3JlJykge1xuICAgICAgICAgICAgICAgIHJldHVybiByZWNlaXZlci5vYmplY3RTdG9yZU5hbWVzWzFdXG4gICAgICAgICAgICAgICAgICAgID8gdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgICAgIDogcmVjZWl2ZXIub2JqZWN0U3RvcmUocmVjZWl2ZXIub2JqZWN0U3RvcmVOYW1lc1swXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gRWxzZSB0cmFuc2Zvcm0gd2hhdGV2ZXIgd2UgZ2V0IGJhY2suXG4gICAgICAgIHJldHVybiB3cmFwKHRhcmdldFtwcm9wXSk7XG4gICAgfSxcbiAgICBzZXQodGFyZ2V0LCBwcm9wLCB2YWx1ZSkge1xuICAgICAgICB0YXJnZXRbcHJvcF0gPSB2YWx1ZTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgICBoYXModGFyZ2V0LCBwcm9wKSB7XG4gICAgICAgIGlmICh0YXJnZXQgaW5zdGFuY2VvZiBJREJUcmFuc2FjdGlvbiAmJlxuICAgICAgICAgICAgKHByb3AgPT09ICdkb25lJyB8fCBwcm9wID09PSAnc3RvcmUnKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHByb3AgaW4gdGFyZ2V0O1xuICAgIH0sXG59O1xuZnVuY3Rpb24gcmVwbGFjZVRyYXBzKGNhbGxiYWNrKSB7XG4gICAgaWRiUHJveHlUcmFwcyA9IGNhbGxiYWNrKGlkYlByb3h5VHJhcHMpO1xufVxuZnVuY3Rpb24gd3JhcEZ1bmN0aW9uKGZ1bmMpIHtcbiAgICAvLyBEdWUgdG8gZXhwZWN0ZWQgb2JqZWN0IGVxdWFsaXR5ICh3aGljaCBpcyBlbmZvcmNlZCBieSB0aGUgY2FjaGluZyBpbiBgd3JhcGApLCB3ZVxuICAgIC8vIG9ubHkgY3JlYXRlIG9uZSBuZXcgZnVuYyBwZXIgZnVuYy5cbiAgICAvLyBFZGdlIGRvZXNuJ3Qgc3VwcG9ydCBvYmplY3RTdG9yZU5hbWVzIChib29vKSwgc28gd2UgcG9seWZpbGwgaXQgaGVyZS5cbiAgICBpZiAoZnVuYyA9PT0gSURCRGF0YWJhc2UucHJvdG90eXBlLnRyYW5zYWN0aW9uICYmXG4gICAgICAgICEoJ29iamVjdFN0b3JlTmFtZXMnIGluIElEQlRyYW5zYWN0aW9uLnByb3RvdHlwZSkpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChzdG9yZU5hbWVzLCAuLi5hcmdzKSB7XG4gICAgICAgICAgICBjb25zdCB0eCA9IGZ1bmMuY2FsbCh1bndyYXAodGhpcyksIHN0b3JlTmFtZXMsIC4uLmFyZ3MpO1xuICAgICAgICAgICAgdHJhbnNhY3Rpb25TdG9yZU5hbWVzTWFwLnNldCh0eCwgc3RvcmVOYW1lcy5zb3J0ID8gc3RvcmVOYW1lcy5zb3J0KCkgOiBbc3RvcmVOYW1lc10pO1xuICAgICAgICAgICAgcmV0dXJuIHdyYXAodHgpO1xuICAgICAgICB9O1xuICAgIH1cbiAgICAvLyBDdXJzb3IgbWV0aG9kcyBhcmUgc3BlY2lhbCwgYXMgdGhlIGJlaGF2aW91ciBpcyBhIGxpdHRsZSBtb3JlIGRpZmZlcmVudCB0byBzdGFuZGFyZCBJREIuIEluXG4gICAgLy8gSURCLCB5b3UgYWR2YW5jZSB0aGUgY3Vyc29yIGFuZCB3YWl0IGZvciBhIG5ldyAnc3VjY2Vzcycgb24gdGhlIElEQlJlcXVlc3QgdGhhdCBnYXZlIHlvdSB0aGVcbiAgICAvLyBjdXJzb3IuIEl0J3Mga2luZGEgbGlrZSBhIHByb21pc2UgdGhhdCBjYW4gcmVzb2x2ZSB3aXRoIG1hbnkgdmFsdWVzLiBUaGF0IGRvZXNuJ3QgbWFrZSBzZW5zZVxuICAgIC8vIHdpdGggcmVhbCBwcm9taXNlcywgc28gZWFjaCBhZHZhbmNlIG1ldGhvZHMgcmV0dXJucyBhIG5ldyBwcm9taXNlIGZvciB0aGUgY3Vyc29yIG9iamVjdCwgb3JcbiAgICAvLyB1bmRlZmluZWQgaWYgdGhlIGVuZCBvZiB0aGUgY3Vyc29yIGhhcyBiZWVuIHJlYWNoZWQuXG4gICAgaWYgKGdldEN1cnNvckFkdmFuY2VNZXRob2RzKCkuaW5jbHVkZXMoZnVuYykpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICguLi5hcmdzKSB7XG4gICAgICAgICAgICAvLyBDYWxsaW5nIHRoZSBvcmlnaW5hbCBmdW5jdGlvbiB3aXRoIHRoZSBwcm94eSBhcyAndGhpcycgY2F1c2VzIElMTEVHQUwgSU5WT0NBVElPTiwgc28gd2UgdXNlXG4gICAgICAgICAgICAvLyB0aGUgb3JpZ2luYWwgb2JqZWN0LlxuICAgICAgICAgICAgZnVuYy5hcHBseSh1bndyYXAodGhpcyksIGFyZ3MpO1xuICAgICAgICAgICAgcmV0dXJuIHdyYXAoY3Vyc29yUmVxdWVzdE1hcC5nZXQodGhpcykpO1xuICAgICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gZnVuY3Rpb24gKC4uLmFyZ3MpIHtcbiAgICAgICAgLy8gQ2FsbGluZyB0aGUgb3JpZ2luYWwgZnVuY3Rpb24gd2l0aCB0aGUgcHJveHkgYXMgJ3RoaXMnIGNhdXNlcyBJTExFR0FMIElOVk9DQVRJT04sIHNvIHdlIHVzZVxuICAgICAgICAvLyB0aGUgb3JpZ2luYWwgb2JqZWN0LlxuICAgICAgICByZXR1cm4gd3JhcChmdW5jLmFwcGx5KHVud3JhcCh0aGlzKSwgYXJncykpO1xuICAgIH07XG59XG5mdW5jdGlvbiB0cmFuc2Zvcm1DYWNoYWJsZVZhbHVlKHZhbHVlKSB7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgcmV0dXJuIHdyYXBGdW5jdGlvbih2YWx1ZSk7XG4gICAgLy8gVGhpcyBkb2Vzbid0IHJldHVybiwgaXQganVzdCBjcmVhdGVzIGEgJ2RvbmUnIHByb21pc2UgZm9yIHRoZSB0cmFuc2FjdGlvbixcbiAgICAvLyB3aGljaCBpcyBsYXRlciByZXR1cm5lZCBmb3IgdHJhbnNhY3Rpb24uZG9uZSAoc2VlIGlkYk9iamVjdEhhbmRsZXIpLlxuICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIElEQlRyYW5zYWN0aW9uKVxuICAgICAgICBjYWNoZURvbmVQcm9taXNlRm9yVHJhbnNhY3Rpb24odmFsdWUpO1xuICAgIGlmIChpbnN0YW5jZU9mQW55KHZhbHVlLCBnZXRJZGJQcm94eWFibGVUeXBlcygpKSlcbiAgICAgICAgcmV0dXJuIG5ldyBQcm94eSh2YWx1ZSwgaWRiUHJveHlUcmFwcyk7XG4gICAgLy8gUmV0dXJuIHRoZSBzYW1lIHZhbHVlIGJhY2sgaWYgd2UncmUgbm90IGdvaW5nIHRvIHRyYW5zZm9ybSBpdC5cbiAgICByZXR1cm4gdmFsdWU7XG59XG5mdW5jdGlvbiB3cmFwKHZhbHVlKSB7XG4gICAgLy8gV2Ugc29tZXRpbWVzIGdlbmVyYXRlIG11bHRpcGxlIHByb21pc2VzIGZyb20gYSBzaW5nbGUgSURCUmVxdWVzdCAoZWcgd2hlbiBjdXJzb3JpbmcpLCBiZWNhdXNlXG4gICAgLy8gSURCIGlzIHdlaXJkIGFuZCBhIHNpbmdsZSBJREJSZXF1ZXN0IGNhbiB5aWVsZCBtYW55IHJlc3BvbnNlcywgc28gdGhlc2UgY2FuJ3QgYmUgY2FjaGVkLlxuICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIElEQlJlcXVlc3QpXG4gICAgICAgIHJldHVybiBwcm9taXNpZnlSZXF1ZXN0KHZhbHVlKTtcbiAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IHRyYW5zZm9ybWVkIHRoaXMgdmFsdWUgYmVmb3JlLCByZXVzZSB0aGUgdHJhbnNmb3JtZWQgdmFsdWUuXG4gICAgLy8gVGhpcyBpcyBmYXN0ZXIsIGJ1dCBpdCBhbHNvIHByb3ZpZGVzIG9iamVjdCBlcXVhbGl0eS5cbiAgICBpZiAodHJhbnNmb3JtQ2FjaGUuaGFzKHZhbHVlKSlcbiAgICAgICAgcmV0dXJuIHRyYW5zZm9ybUNhY2hlLmdldCh2YWx1ZSk7XG4gICAgY29uc3QgbmV3VmFsdWUgPSB0cmFuc2Zvcm1DYWNoYWJsZVZhbHVlKHZhbHVlKTtcbiAgICAvLyBOb3QgYWxsIHR5cGVzIGFyZSB0cmFuc2Zvcm1lZC5cbiAgICAvLyBUaGVzZSBtYXkgYmUgcHJpbWl0aXZlIHR5cGVzLCBzbyB0aGV5IGNhbid0IGJlIFdlYWtNYXAga2V5cy5cbiAgICBpZiAobmV3VmFsdWUgIT09IHZhbHVlKSB7XG4gICAgICAgIHRyYW5zZm9ybUNhY2hlLnNldCh2YWx1ZSwgbmV3VmFsdWUpO1xuICAgICAgICByZXZlcnNlVHJhbnNmb3JtQ2FjaGUuc2V0KG5ld1ZhbHVlLCB2YWx1ZSk7XG4gICAgfVxuICAgIHJldHVybiBuZXdWYWx1ZTtcbn1cbmNvbnN0IHVud3JhcCA9ICh2YWx1ZSkgPT4gcmV2ZXJzZVRyYW5zZm9ybUNhY2hlLmdldCh2YWx1ZSk7XG5cbmV4cG9ydCB7IHJldmVyc2VUcmFuc2Zvcm1DYWNoZSBhcyBhLCBpbnN0YW5jZU9mQW55IGFzIGksIHJlcGxhY2VUcmFwcyBhcyByLCB1bndyYXAgYXMgdSwgd3JhcCBhcyB3IH07XG4iLCJpbXBvcnQgeyB3IGFzIHdyYXAsIHIgYXMgcmVwbGFjZVRyYXBzIH0gZnJvbSAnLi93cmFwLWlkYi12YWx1ZS5qcyc7XG5leHBvcnQgeyB1IGFzIHVud3JhcCwgdyBhcyB3cmFwIH0gZnJvbSAnLi93cmFwLWlkYi12YWx1ZS5qcyc7XG5cbi8qKlxuICogT3BlbiBhIGRhdGFiYXNlLlxuICpcbiAqIEBwYXJhbSBuYW1lIE5hbWUgb2YgdGhlIGRhdGFiYXNlLlxuICogQHBhcmFtIHZlcnNpb24gU2NoZW1hIHZlcnNpb24uXG4gKiBAcGFyYW0gY2FsbGJhY2tzIEFkZGl0aW9uYWwgY2FsbGJhY2tzLlxuICovXG5mdW5jdGlvbiBvcGVuREIobmFtZSwgdmVyc2lvbiwgeyBibG9ja2VkLCB1cGdyYWRlLCBibG9ja2luZywgdGVybWluYXRlZCB9ID0ge30pIHtcbiAgICBjb25zdCByZXF1ZXN0ID0gaW5kZXhlZERCLm9wZW4obmFtZSwgdmVyc2lvbik7XG4gICAgY29uc3Qgb3BlblByb21pc2UgPSB3cmFwKHJlcXVlc3QpO1xuICAgIGlmICh1cGdyYWRlKSB7XG4gICAgICAgIHJlcXVlc3QuYWRkRXZlbnRMaXN0ZW5lcigndXBncmFkZW5lZWRlZCcsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgdXBncmFkZSh3cmFwKHJlcXVlc3QucmVzdWx0KSwgZXZlbnQub2xkVmVyc2lvbiwgZXZlbnQubmV3VmVyc2lvbiwgd3JhcChyZXF1ZXN0LnRyYW5zYWN0aW9uKSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoYmxvY2tlZClcbiAgICAgICAgcmVxdWVzdC5hZGRFdmVudExpc3RlbmVyKCdibG9ja2VkJywgKCkgPT4gYmxvY2tlZCgpKTtcbiAgICBvcGVuUHJvbWlzZVxuICAgICAgICAudGhlbigoZGIpID0+IHtcbiAgICAgICAgaWYgKHRlcm1pbmF0ZWQpXG4gICAgICAgICAgICBkYi5hZGRFdmVudExpc3RlbmVyKCdjbG9zZScsICgpID0+IHRlcm1pbmF0ZWQoKSk7XG4gICAgICAgIGlmIChibG9ja2luZylcbiAgICAgICAgICAgIGRiLmFkZEV2ZW50TGlzdGVuZXIoJ3ZlcnNpb25jaGFuZ2UnLCAoKSA9PiBibG9ja2luZygpKTtcbiAgICB9KVxuICAgICAgICAuY2F0Y2goKCkgPT4geyB9KTtcbiAgICByZXR1cm4gb3BlblByb21pc2U7XG59XG4vKipcbiAqIERlbGV0ZSBhIGRhdGFiYXNlLlxuICpcbiAqIEBwYXJhbSBuYW1lIE5hbWUgb2YgdGhlIGRhdGFiYXNlLlxuICovXG5mdW5jdGlvbiBkZWxldGVEQihuYW1lLCB7IGJsb2NrZWQgfSA9IHt9KSB7XG4gICAgY29uc3QgcmVxdWVzdCA9IGluZGV4ZWREQi5kZWxldGVEYXRhYmFzZShuYW1lKTtcbiAgICBpZiAoYmxvY2tlZClcbiAgICAgICAgcmVxdWVzdC5hZGRFdmVudExpc3RlbmVyKCdibG9ja2VkJywgKCkgPT4gYmxvY2tlZCgpKTtcbiAgICByZXR1cm4gd3JhcChyZXF1ZXN0KS50aGVuKCgpID0+IHVuZGVmaW5lZCk7XG59XG5cbmNvbnN0IHJlYWRNZXRob2RzID0gWydnZXQnLCAnZ2V0S2V5JywgJ2dldEFsbCcsICdnZXRBbGxLZXlzJywgJ2NvdW50J107XG5jb25zdCB3cml0ZU1ldGhvZHMgPSBbJ3B1dCcsICdhZGQnLCAnZGVsZXRlJywgJ2NsZWFyJ107XG5jb25zdCBjYWNoZWRNZXRob2RzID0gbmV3IE1hcCgpO1xuZnVuY3Rpb24gZ2V0TWV0aG9kKHRhcmdldCwgcHJvcCkge1xuICAgIGlmICghKHRhcmdldCBpbnN0YW5jZW9mIElEQkRhdGFiYXNlICYmXG4gICAgICAgICEocHJvcCBpbiB0YXJnZXQpICYmXG4gICAgICAgIHR5cGVvZiBwcm9wID09PSAnc3RyaW5nJykpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoY2FjaGVkTWV0aG9kcy5nZXQocHJvcCkpXG4gICAgICAgIHJldHVybiBjYWNoZWRNZXRob2RzLmdldChwcm9wKTtcbiAgICBjb25zdCB0YXJnZXRGdW5jTmFtZSA9IHByb3AucmVwbGFjZSgvRnJvbUluZGV4JC8sICcnKTtcbiAgICBjb25zdCB1c2VJbmRleCA9IHByb3AgIT09IHRhcmdldEZ1bmNOYW1lO1xuICAgIGNvbnN0IGlzV3JpdGUgPSB3cml0ZU1ldGhvZHMuaW5jbHVkZXModGFyZ2V0RnVuY05hbWUpO1xuICAgIGlmIChcbiAgICAvLyBCYWlsIGlmIHRoZSB0YXJnZXQgZG9lc24ndCBleGlzdCBvbiB0aGUgdGFyZ2V0LiBFZywgZ2V0QWxsIGlzbid0IGluIEVkZ2UuXG4gICAgISh0YXJnZXRGdW5jTmFtZSBpbiAodXNlSW5kZXggPyBJREJJbmRleCA6IElEQk9iamVjdFN0b3JlKS5wcm90b3R5cGUpIHx8XG4gICAgICAgICEoaXNXcml0ZSB8fCByZWFkTWV0aG9kcy5pbmNsdWRlcyh0YXJnZXRGdW5jTmFtZSkpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgbWV0aG9kID0gYXN5bmMgZnVuY3Rpb24gKHN0b3JlTmFtZSwgLi4uYXJncykge1xuICAgICAgICAvLyBpc1dyaXRlID8gJ3JlYWR3cml0ZScgOiB1bmRlZmluZWQgZ3ppcHBzIGJldHRlciwgYnV0IGZhaWxzIGluIEVkZ2UgOihcbiAgICAgICAgY29uc3QgdHggPSB0aGlzLnRyYW5zYWN0aW9uKHN0b3JlTmFtZSwgaXNXcml0ZSA/ICdyZWFkd3JpdGUnIDogJ3JlYWRvbmx5Jyk7XG4gICAgICAgIGxldCB0YXJnZXQgPSB0eC5zdG9yZTtcbiAgICAgICAgaWYgKHVzZUluZGV4KVxuICAgICAgICAgICAgdGFyZ2V0ID0gdGFyZ2V0LmluZGV4KGFyZ3Muc2hpZnQoKSk7XG4gICAgICAgIC8vIE11c3QgcmVqZWN0IGlmIG9wIHJlamVjdHMuXG4gICAgICAgIC8vIElmIGl0J3MgYSB3cml0ZSBvcGVyYXRpb24sIG11c3QgcmVqZWN0IGlmIHR4LmRvbmUgcmVqZWN0cy5cbiAgICAgICAgLy8gTXVzdCByZWplY3Qgd2l0aCBvcCByZWplY3Rpb24gZmlyc3QuXG4gICAgICAgIC8vIE11c3QgcmVzb2x2ZSB3aXRoIG9wIHZhbHVlLlxuICAgICAgICAvLyBNdXN0IGhhbmRsZSBib3RoIHByb21pc2VzIChubyB1bmhhbmRsZWQgcmVqZWN0aW9ucylcbiAgICAgICAgcmV0dXJuIChhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICAgICAgICB0YXJnZXRbdGFyZ2V0RnVuY05hbWVdKC4uLmFyZ3MpLFxuICAgICAgICAgICAgaXNXcml0ZSAmJiB0eC5kb25lLFxuICAgICAgICBdKSlbMF07XG4gICAgfTtcbiAgICBjYWNoZWRNZXRob2RzLnNldChwcm9wLCBtZXRob2QpO1xuICAgIHJldHVybiBtZXRob2Q7XG59XG5yZXBsYWNlVHJhcHMoKG9sZFRyYXBzKSA9PiAoe1xuICAgIC4uLm9sZFRyYXBzLFxuICAgIGdldDogKHRhcmdldCwgcHJvcCwgcmVjZWl2ZXIpID0+IGdldE1ldGhvZCh0YXJnZXQsIHByb3ApIHx8IG9sZFRyYXBzLmdldCh0YXJnZXQsIHByb3AsIHJlY2VpdmVyKSxcbiAgICBoYXM6ICh0YXJnZXQsIHByb3ApID0+ICEhZ2V0TWV0aG9kKHRhcmdldCwgcHJvcCkgfHwgb2xkVHJhcHMuaGFzKHRhcmdldCwgcHJvcCksXG59KSk7XG5cbmV4cG9ydCB7IGRlbGV0ZURCLCBvcGVuREIgfTtcbiIsImltcG9ydCB7IENvbXBvbmVudCwgQ29tcG9uZW50Q29udGFpbmVyIH0gZnJvbSAnQGZpcmViYXNlL2NvbXBvbmVudCc7XG5pbXBvcnQgeyBMb2dnZXIsIHNldFVzZXJMb2dIYW5kbGVyLCBzZXRMb2dMZXZlbCBhcyBzZXRMb2dMZXZlbCQxIH0gZnJvbSAnQGZpcmViYXNlL2xvZ2dlcic7XG5pbXBvcnQgeyBFcnJvckZhY3RvcnksIGdldERlZmF1bHRBcHBDb25maWcsIGRlZXBFcXVhbCwgRmlyZWJhc2VFcnJvciwgYmFzZTY0dXJsRW5jb2RlV2l0aG91dFBhZGRpbmcsIGlzSW5kZXhlZERCQXZhaWxhYmxlLCB2YWxpZGF0ZUluZGV4ZWREQk9wZW5hYmxlIH0gZnJvbSAnQGZpcmViYXNlL3V0aWwnO1xuZXhwb3J0IHsgRmlyZWJhc2VFcnJvciB9IGZyb20gJ0BmaXJlYmFzZS91dGlsJztcbmltcG9ydCB7IG9wZW5EQiB9IGZyb20gJ2lkYic7XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbmNsYXNzIFBsYXRmb3JtTG9nZ2VyU2VydmljZUltcGwge1xyXG4gICAgY29uc3RydWN0b3IoY29udGFpbmVyKSB7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XHJcbiAgICB9XHJcbiAgICAvLyBJbiBpbml0aWFsIGltcGxlbWVudGF0aW9uLCB0aGlzIHdpbGwgYmUgY2FsbGVkIGJ5IGluc3RhbGxhdGlvbnMgb25cclxuICAgIC8vIGF1dGggdG9rZW4gcmVmcmVzaCwgYW5kIGluc3RhbGxhdGlvbnMgd2lsbCBzZW5kIHRoaXMgc3RyaW5nLlxyXG4gICAgZ2V0UGxhdGZvcm1JbmZvU3RyaW5nKCkge1xyXG4gICAgICAgIGNvbnN0IHByb3ZpZGVycyA9IHRoaXMuY29udGFpbmVyLmdldFByb3ZpZGVycygpO1xyXG4gICAgICAgIC8vIExvb3AgdGhyb3VnaCBwcm92aWRlcnMgYW5kIGdldCBsaWJyYXJ5L3ZlcnNpb24gcGFpcnMgZnJvbSBhbnkgdGhhdCBhcmVcclxuICAgICAgICAvLyB2ZXJzaW9uIGNvbXBvbmVudHMuXHJcbiAgICAgICAgcmV0dXJuIHByb3ZpZGVyc1xyXG4gICAgICAgICAgICAubWFwKHByb3ZpZGVyID0+IHtcclxuICAgICAgICAgICAgaWYgKGlzVmVyc2lvblNlcnZpY2VQcm92aWRlcihwcm92aWRlcikpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHNlcnZpY2UgPSBwcm92aWRlci5nZXRJbW1lZGlhdGUoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBgJHtzZXJ2aWNlLmxpYnJhcnl9LyR7c2VydmljZS52ZXJzaW9ufWA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5maWx0ZXIobG9nU3RyaW5nID0+IGxvZ1N0cmluZylcclxuICAgICAgICAgICAgLmpvaW4oJyAnKTtcclxuICAgIH1cclxufVxyXG4vKipcclxuICpcclxuICogQHBhcmFtIHByb3ZpZGVyIGNoZWNrIGlmIHRoaXMgcHJvdmlkZXIgcHJvdmlkZXMgYSBWZXJzaW9uU2VydmljZVxyXG4gKlxyXG4gKiBOT1RFOiBVc2luZyBQcm92aWRlcjwnYXBwLXZlcnNpb24nPiBpcyBhIGhhY2sgdG8gaW5kaWNhdGUgdGhhdCB0aGUgcHJvdmlkZXJcclxuICogcHJvdmlkZXMgVmVyc2lvblNlcnZpY2UuIFRoZSBwcm92aWRlciBpcyBub3QgbmVjZXNzYXJpbHkgYSAnYXBwLXZlcnNpb24nXHJcbiAqIHByb3ZpZGVyLlxyXG4gKi9cclxuZnVuY3Rpb24gaXNWZXJzaW9uU2VydmljZVByb3ZpZGVyKHByb3ZpZGVyKSB7XHJcbiAgICBjb25zdCBjb21wb25lbnQgPSBwcm92aWRlci5nZXRDb21wb25lbnQoKTtcclxuICAgIHJldHVybiAoY29tcG9uZW50ID09PSBudWxsIHx8IGNvbXBvbmVudCA9PT0gdm9pZCAwID8gdm9pZCAwIDogY29tcG9uZW50LnR5cGUpID09PSBcIlZFUlNJT05cIiAvKiBWRVJTSU9OICovO1xyXG59XG5cbmNvbnN0IG5hbWUkbyA9IFwiQGZpcmViYXNlL2FwcFwiO1xuY29uc3QgdmVyc2lvbiQxID0gXCIwLjguMlwiO1xuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5jb25zdCBsb2dnZXIgPSBuZXcgTG9nZ2VyKCdAZmlyZWJhc2UvYXBwJyk7XG5cbmNvbnN0IG5hbWUkbiA9IFwiQGZpcmViYXNlL2FwcC1jb21wYXRcIjtcblxuY29uc3QgbmFtZSRtID0gXCJAZmlyZWJhc2UvYW5hbHl0aWNzLWNvbXBhdFwiO1xuXG5jb25zdCBuYW1lJGwgPSBcIkBmaXJlYmFzZS9hbmFseXRpY3NcIjtcblxuY29uc3QgbmFtZSRrID0gXCJAZmlyZWJhc2UvYXBwLWNoZWNrLWNvbXBhdFwiO1xuXG5jb25zdCBuYW1lJGogPSBcIkBmaXJlYmFzZS9hcHAtY2hlY2tcIjtcblxuY29uc3QgbmFtZSRpID0gXCJAZmlyZWJhc2UvYXV0aFwiO1xuXG5jb25zdCBuYW1lJGggPSBcIkBmaXJlYmFzZS9hdXRoLWNvbXBhdFwiO1xuXG5jb25zdCBuYW1lJGcgPSBcIkBmaXJlYmFzZS9kYXRhYmFzZVwiO1xuXG5jb25zdCBuYW1lJGYgPSBcIkBmaXJlYmFzZS9kYXRhYmFzZS1jb21wYXRcIjtcblxuY29uc3QgbmFtZSRlID0gXCJAZmlyZWJhc2UvZnVuY3Rpb25zXCI7XG5cbmNvbnN0IG5hbWUkZCA9IFwiQGZpcmViYXNlL2Z1bmN0aW9ucy1jb21wYXRcIjtcblxuY29uc3QgbmFtZSRjID0gXCJAZmlyZWJhc2UvaW5zdGFsbGF0aW9uc1wiO1xuXG5jb25zdCBuYW1lJGIgPSBcIkBmaXJlYmFzZS9pbnN0YWxsYXRpb25zLWNvbXBhdFwiO1xuXG5jb25zdCBuYW1lJGEgPSBcIkBmaXJlYmFzZS9tZXNzYWdpbmdcIjtcblxuY29uc3QgbmFtZSQ5ID0gXCJAZmlyZWJhc2UvbWVzc2FnaW5nLWNvbXBhdFwiO1xuXG5jb25zdCBuYW1lJDggPSBcIkBmaXJlYmFzZS9wZXJmb3JtYW5jZVwiO1xuXG5jb25zdCBuYW1lJDcgPSBcIkBmaXJlYmFzZS9wZXJmb3JtYW5jZS1jb21wYXRcIjtcblxuY29uc3QgbmFtZSQ2ID0gXCJAZmlyZWJhc2UvcmVtb3RlLWNvbmZpZ1wiO1xuXG5jb25zdCBuYW1lJDUgPSBcIkBmaXJlYmFzZS9yZW1vdGUtY29uZmlnLWNvbXBhdFwiO1xuXG5jb25zdCBuYW1lJDQgPSBcIkBmaXJlYmFzZS9zdG9yYWdlXCI7XG5cbmNvbnN0IG5hbWUkMyA9IFwiQGZpcmViYXNlL3N0b3JhZ2UtY29tcGF0XCI7XG5cbmNvbnN0IG5hbWUkMiA9IFwiQGZpcmViYXNlL2ZpcmVzdG9yZVwiO1xuXG5jb25zdCBuYW1lJDEgPSBcIkBmaXJlYmFzZS9maXJlc3RvcmUtY29tcGF0XCI7XG5cbmNvbnN0IG5hbWUgPSBcImZpcmViYXNlXCI7XG5jb25zdCB2ZXJzaW9uID0gXCI5LjEyLjFcIjtcblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqXHJcbiAqIFRoZSBkZWZhdWx0IGFwcCBuYW1lXHJcbiAqXHJcbiAqIEBpbnRlcm5hbFxyXG4gKi9cclxuY29uc3QgREVGQVVMVF9FTlRSWV9OQU1FID0gJ1tERUZBVUxUXSc7XHJcbmNvbnN0IFBMQVRGT1JNX0xPR19TVFJJTkcgPSB7XHJcbiAgICBbbmFtZSRvXTogJ2ZpcmUtY29yZScsXHJcbiAgICBbbmFtZSRuXTogJ2ZpcmUtY29yZS1jb21wYXQnLFxyXG4gICAgW25hbWUkbF06ICdmaXJlLWFuYWx5dGljcycsXHJcbiAgICBbbmFtZSRtXTogJ2ZpcmUtYW5hbHl0aWNzLWNvbXBhdCcsXHJcbiAgICBbbmFtZSRqXTogJ2ZpcmUtYXBwLWNoZWNrJyxcclxuICAgIFtuYW1lJGtdOiAnZmlyZS1hcHAtY2hlY2stY29tcGF0JyxcclxuICAgIFtuYW1lJGldOiAnZmlyZS1hdXRoJyxcclxuICAgIFtuYW1lJGhdOiAnZmlyZS1hdXRoLWNvbXBhdCcsXHJcbiAgICBbbmFtZSRnXTogJ2ZpcmUtcnRkYicsXHJcbiAgICBbbmFtZSRmXTogJ2ZpcmUtcnRkYi1jb21wYXQnLFxyXG4gICAgW25hbWUkZV06ICdmaXJlLWZuJyxcclxuICAgIFtuYW1lJGRdOiAnZmlyZS1mbi1jb21wYXQnLFxyXG4gICAgW25hbWUkY106ICdmaXJlLWlpZCcsXHJcbiAgICBbbmFtZSRiXTogJ2ZpcmUtaWlkLWNvbXBhdCcsXHJcbiAgICBbbmFtZSRhXTogJ2ZpcmUtZmNtJyxcclxuICAgIFtuYW1lJDldOiAnZmlyZS1mY20tY29tcGF0JyxcclxuICAgIFtuYW1lJDhdOiAnZmlyZS1wZXJmJyxcclxuICAgIFtuYW1lJDddOiAnZmlyZS1wZXJmLWNvbXBhdCcsXHJcbiAgICBbbmFtZSQ2XTogJ2ZpcmUtcmMnLFxyXG4gICAgW25hbWUkNV06ICdmaXJlLXJjLWNvbXBhdCcsXHJcbiAgICBbbmFtZSQ0XTogJ2ZpcmUtZ2NzJyxcclxuICAgIFtuYW1lJDNdOiAnZmlyZS1nY3MtY29tcGF0JyxcclxuICAgIFtuYW1lJDJdOiAnZmlyZS1mc3QnLFxyXG4gICAgW25hbWUkMV06ICdmaXJlLWZzdC1jb21wYXQnLFxyXG4gICAgJ2ZpcmUtanMnOiAnZmlyZS1qcycsXHJcbiAgICBbbmFtZV06ICdmaXJlLWpzLWFsbCdcclxufTtcblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqXHJcbiAqIEBpbnRlcm5hbFxyXG4gKi9cclxuY29uc3QgX2FwcHMgPSBuZXcgTWFwKCk7XHJcbi8qKlxyXG4gKiBSZWdpc3RlcmVkIGNvbXBvbmVudHMuXHJcbiAqXHJcbiAqIEBpbnRlcm5hbFxyXG4gKi9cclxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcclxuY29uc3QgX2NvbXBvbmVudHMgPSBuZXcgTWFwKCk7XHJcbi8qKlxyXG4gKiBAcGFyYW0gY29tcG9uZW50IC0gdGhlIGNvbXBvbmVudCBiZWluZyBhZGRlZCB0byB0aGlzIGFwcCdzIGNvbnRhaW5lclxyXG4gKlxyXG4gKiBAaW50ZXJuYWxcclxuICovXHJcbmZ1bmN0aW9uIF9hZGRDb21wb25lbnQoYXBwLCBjb21wb25lbnQpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgYXBwLmNvbnRhaW5lci5hZGRDb21wb25lbnQoY29tcG9uZW50KTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgbG9nZ2VyLmRlYnVnKGBDb21wb25lbnQgJHtjb21wb25lbnQubmFtZX0gZmFpbGVkIHRvIHJlZ2lzdGVyIHdpdGggRmlyZWJhc2VBcHAgJHthcHAubmFtZX1gLCBlKTtcclxuICAgIH1cclxufVxyXG4vKipcclxuICpcclxuICogQGludGVybmFsXHJcbiAqL1xyXG5mdW5jdGlvbiBfYWRkT3JPdmVyd3JpdGVDb21wb25lbnQoYXBwLCBjb21wb25lbnQpIHtcclxuICAgIGFwcC5jb250YWluZXIuYWRkT3JPdmVyd3JpdGVDb21wb25lbnQoY29tcG9uZW50KTtcclxufVxyXG4vKipcclxuICpcclxuICogQHBhcmFtIGNvbXBvbmVudCAtIHRoZSBjb21wb25lbnQgdG8gcmVnaXN0ZXJcclxuICogQHJldHVybnMgd2hldGhlciBvciBub3QgdGhlIGNvbXBvbmVudCBpcyByZWdpc3RlcmVkIHN1Y2Nlc3NmdWxseVxyXG4gKlxyXG4gKiBAaW50ZXJuYWxcclxuICovXHJcbmZ1bmN0aW9uIF9yZWdpc3RlckNvbXBvbmVudChjb21wb25lbnQpIHtcclxuICAgIGNvbnN0IGNvbXBvbmVudE5hbWUgPSBjb21wb25lbnQubmFtZTtcclxuICAgIGlmIChfY29tcG9uZW50cy5oYXMoY29tcG9uZW50TmFtZSkpIHtcclxuICAgICAgICBsb2dnZXIuZGVidWcoYFRoZXJlIHdlcmUgbXVsdGlwbGUgYXR0ZW1wdHMgdG8gcmVnaXN0ZXIgY29tcG9uZW50ICR7Y29tcG9uZW50TmFtZX0uYCk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgX2NvbXBvbmVudHMuc2V0KGNvbXBvbmVudE5hbWUsIGNvbXBvbmVudCk7XHJcbiAgICAvLyBhZGQgdGhlIGNvbXBvbmVudCB0byBleGlzdGluZyBhcHAgaW5zdGFuY2VzXHJcbiAgICBmb3IgKGNvbnN0IGFwcCBvZiBfYXBwcy52YWx1ZXMoKSkge1xyXG4gICAgICAgIF9hZGRDb21wb25lbnQoYXBwLCBjb21wb25lbnQpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRydWU7XHJcbn1cclxuLyoqXHJcbiAqXHJcbiAqIEBwYXJhbSBhcHAgLSBGaXJlYmFzZUFwcCBpbnN0YW5jZVxyXG4gKiBAcGFyYW0gbmFtZSAtIHNlcnZpY2UgbmFtZVxyXG4gKlxyXG4gKiBAcmV0dXJucyB0aGUgcHJvdmlkZXIgZm9yIHRoZSBzZXJ2aWNlIHdpdGggdGhlIG1hdGNoaW5nIG5hbWVcclxuICpcclxuICogQGludGVybmFsXHJcbiAqL1xyXG5mdW5jdGlvbiBfZ2V0UHJvdmlkZXIoYXBwLCBuYW1lKSB7XHJcbiAgICBjb25zdCBoZWFydGJlYXRDb250cm9sbGVyID0gYXBwLmNvbnRhaW5lclxyXG4gICAgICAgIC5nZXRQcm92aWRlcignaGVhcnRiZWF0JylcclxuICAgICAgICAuZ2V0SW1tZWRpYXRlKHsgb3B0aW9uYWw6IHRydWUgfSk7XHJcbiAgICBpZiAoaGVhcnRiZWF0Q29udHJvbGxlcikge1xyXG4gICAgICAgIHZvaWQgaGVhcnRiZWF0Q29udHJvbGxlci50cmlnZ2VySGVhcnRiZWF0KCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXBwLmNvbnRhaW5lci5nZXRQcm92aWRlcihuYW1lKTtcclxufVxyXG4vKipcclxuICpcclxuICogQHBhcmFtIGFwcCAtIEZpcmViYXNlQXBwIGluc3RhbmNlXHJcbiAqIEBwYXJhbSBuYW1lIC0gc2VydmljZSBuYW1lXHJcbiAqIEBwYXJhbSBpbnN0YW5jZUlkZW50aWZpZXIgLSBzZXJ2aWNlIGluc3RhbmNlIGlkZW50aWZpZXIgaW4gY2FzZSB0aGUgc2VydmljZSBzdXBwb3J0cyBtdWx0aXBsZSBpbnN0YW5jZXNcclxuICpcclxuICogQGludGVybmFsXHJcbiAqL1xyXG5mdW5jdGlvbiBfcmVtb3ZlU2VydmljZUluc3RhbmNlKGFwcCwgbmFtZSwgaW5zdGFuY2VJZGVudGlmaWVyID0gREVGQVVMVF9FTlRSWV9OQU1FKSB7XHJcbiAgICBfZ2V0UHJvdmlkZXIoYXBwLCBuYW1lKS5jbGVhckluc3RhbmNlKGluc3RhbmNlSWRlbnRpZmllcik7XHJcbn1cclxuLyoqXHJcbiAqIFRlc3Qgb25seVxyXG4gKlxyXG4gKiBAaW50ZXJuYWxcclxuICovXHJcbmZ1bmN0aW9uIF9jbGVhckNvbXBvbmVudHMoKSB7XHJcbiAgICBfY29tcG9uZW50cy5jbGVhcigpO1xyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbmNvbnN0IEVSUk9SUyA9IHtcclxuICAgIFtcIm5vLWFwcFwiIC8qIE5PX0FQUCAqL106IFwiTm8gRmlyZWJhc2UgQXBwICd7JGFwcE5hbWV9JyBoYXMgYmVlbiBjcmVhdGVkIC0gXCIgK1xyXG4gICAgICAgICdjYWxsIEZpcmViYXNlIEFwcC5pbml0aWFsaXplQXBwKCknLFxyXG4gICAgW1wiYmFkLWFwcC1uYW1lXCIgLyogQkFEX0FQUF9OQU1FICovXTogXCJJbGxlZ2FsIEFwcCBuYW1lOiAneyRhcHBOYW1lfVwiLFxyXG4gICAgW1wiZHVwbGljYXRlLWFwcFwiIC8qIERVUExJQ0FURV9BUFAgKi9dOiBcIkZpcmViYXNlIEFwcCBuYW1lZCAneyRhcHBOYW1lfScgYWxyZWFkeSBleGlzdHMgd2l0aCBkaWZmZXJlbnQgb3B0aW9ucyBvciBjb25maWdcIixcclxuICAgIFtcImFwcC1kZWxldGVkXCIgLyogQVBQX0RFTEVURUQgKi9dOiBcIkZpcmViYXNlIEFwcCBuYW1lZCAneyRhcHBOYW1lfScgYWxyZWFkeSBkZWxldGVkXCIsXHJcbiAgICBbXCJuby1vcHRpb25zXCIgLyogTk9fT1BUSU9OUyAqL106ICdOZWVkIHRvIHByb3ZpZGUgb3B0aW9ucywgd2hlbiBub3QgYmVpbmcgZGVwbG95ZWQgdG8gaG9zdGluZyB2aWEgc291cmNlLicsXHJcbiAgICBbXCJpbnZhbGlkLWFwcC1hcmd1bWVudFwiIC8qIElOVkFMSURfQVBQX0FSR1VNRU5UICovXTogJ2ZpcmViYXNlLnskYXBwTmFtZX0oKSB0YWtlcyBlaXRoZXIgbm8gYXJndW1lbnQgb3IgYSAnICtcclxuICAgICAgICAnRmlyZWJhc2UgQXBwIGluc3RhbmNlLicsXHJcbiAgICBbXCJpbnZhbGlkLWxvZy1hcmd1bWVudFwiIC8qIElOVkFMSURfTE9HX0FSR1VNRU5UICovXTogJ0ZpcnN0IGFyZ3VtZW50IHRvIGBvbkxvZ2AgbXVzdCBiZSBudWxsIG9yIGEgZnVuY3Rpb24uJyxcclxuICAgIFtcImlkYi1vcGVuXCIgLyogSURCX09QRU4gKi9dOiAnRXJyb3IgdGhyb3duIHdoZW4gb3BlbmluZyBJbmRleGVkREIuIE9yaWdpbmFsIGVycm9yOiB7JG9yaWdpbmFsRXJyb3JNZXNzYWdlfS4nLFxyXG4gICAgW1wiaWRiLWdldFwiIC8qIElEQl9HRVQgKi9dOiAnRXJyb3IgdGhyb3duIHdoZW4gcmVhZGluZyBmcm9tIEluZGV4ZWREQi4gT3JpZ2luYWwgZXJyb3I6IHskb3JpZ2luYWxFcnJvck1lc3NhZ2V9LicsXHJcbiAgICBbXCJpZGItc2V0XCIgLyogSURCX1dSSVRFICovXTogJ0Vycm9yIHRocm93biB3aGVuIHdyaXRpbmcgdG8gSW5kZXhlZERCLiBPcmlnaW5hbCBlcnJvcjogeyRvcmlnaW5hbEVycm9yTWVzc2FnZX0uJyxcclxuICAgIFtcImlkYi1kZWxldGVcIiAvKiBJREJfREVMRVRFICovXTogJ0Vycm9yIHRocm93biB3aGVuIGRlbGV0aW5nIGZyb20gSW5kZXhlZERCLiBPcmlnaW5hbCBlcnJvcjogeyRvcmlnaW5hbEVycm9yTWVzc2FnZX0uJ1xyXG59O1xyXG5jb25zdCBFUlJPUl9GQUNUT1JZID0gbmV3IEVycm9yRmFjdG9yeSgnYXBwJywgJ0ZpcmViYXNlJywgRVJST1JTKTtcblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuY2xhc3MgRmlyZWJhc2VBcHBJbXBsIHtcclxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMsIGNvbmZpZywgY29udGFpbmVyKSB7XHJcbiAgICAgICAgdGhpcy5faXNEZWxldGVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5fb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMpO1xyXG4gICAgICAgIHRoaXMuX2NvbmZpZyA9IE9iamVjdC5hc3NpZ24oe30sIGNvbmZpZyk7XHJcbiAgICAgICAgdGhpcy5fbmFtZSA9IGNvbmZpZy5uYW1lO1xyXG4gICAgICAgIHRoaXMuX2F1dG9tYXRpY0RhdGFDb2xsZWN0aW9uRW5hYmxlZCA9XHJcbiAgICAgICAgICAgIGNvbmZpZy5hdXRvbWF0aWNEYXRhQ29sbGVjdGlvbkVuYWJsZWQ7XHJcbiAgICAgICAgdGhpcy5fY29udGFpbmVyID0gY29udGFpbmVyO1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmFkZENvbXBvbmVudChuZXcgQ29tcG9uZW50KCdhcHAnLCAoKSA9PiB0aGlzLCBcIlBVQkxJQ1wiIC8qIFBVQkxJQyAqLykpO1xyXG4gICAgfVxyXG4gICAgZ2V0IGF1dG9tYXRpY0RhdGFDb2xsZWN0aW9uRW5hYmxlZCgpIHtcclxuICAgICAgICB0aGlzLmNoZWNrRGVzdHJveWVkKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2F1dG9tYXRpY0RhdGFDb2xsZWN0aW9uRW5hYmxlZDtcclxuICAgIH1cclxuICAgIHNldCBhdXRvbWF0aWNEYXRhQ29sbGVjdGlvbkVuYWJsZWQodmFsKSB7XHJcbiAgICAgICAgdGhpcy5jaGVja0Rlc3Ryb3llZCgpO1xyXG4gICAgICAgIHRoaXMuX2F1dG9tYXRpY0RhdGFDb2xsZWN0aW9uRW5hYmxlZCA9IHZhbDtcclxuICAgIH1cclxuICAgIGdldCBuYW1lKCkge1xyXG4gICAgICAgIHRoaXMuY2hlY2tEZXN0cm95ZWQoKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbmFtZTtcclxuICAgIH1cclxuICAgIGdldCBvcHRpb25zKCkge1xyXG4gICAgICAgIHRoaXMuY2hlY2tEZXN0cm95ZWQoKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5fb3B0aW9ucztcclxuICAgIH1cclxuICAgIGdldCBjb25maWcoKSB7XHJcbiAgICAgICAgdGhpcy5jaGVja0Rlc3Ryb3llZCgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb25maWc7XHJcbiAgICB9XHJcbiAgICBnZXQgY29udGFpbmVyKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb250YWluZXI7XHJcbiAgICB9XHJcbiAgICBnZXQgaXNEZWxldGVkKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9pc0RlbGV0ZWQ7XHJcbiAgICB9XHJcbiAgICBzZXQgaXNEZWxldGVkKHZhbCkge1xyXG4gICAgICAgIHRoaXMuX2lzRGVsZXRlZCA9IHZhbDtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogVGhpcyBmdW5jdGlvbiB3aWxsIHRocm93IGFuIEVycm9yIGlmIHRoZSBBcHAgaGFzIGFscmVhZHkgYmVlbiBkZWxldGVkIC1cclxuICAgICAqIHVzZSBiZWZvcmUgcGVyZm9ybWluZyBBUEkgYWN0aW9ucyBvbiB0aGUgQXBwLlxyXG4gICAgICovXHJcbiAgICBjaGVja0Rlc3Ryb3llZCgpIHtcclxuICAgICAgICBpZiAodGhpcy5pc0RlbGV0ZWQpIHtcclxuICAgICAgICAgICAgdGhyb3cgRVJST1JfRkFDVE9SWS5jcmVhdGUoXCJhcHAtZGVsZXRlZFwiIC8qIEFQUF9ERUxFVEVEICovLCB7IGFwcE5hbWU6IHRoaXMuX25hbWUgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbi8qKlxyXG4gKiBUaGUgY3VycmVudCBTREsgdmVyc2lvbi5cclxuICpcclxuICogQHB1YmxpY1xyXG4gKi9cclxuY29uc3QgU0RLX1ZFUlNJT04gPSB2ZXJzaW9uO1xyXG5mdW5jdGlvbiBpbml0aWFsaXplQXBwKF9vcHRpb25zLCByYXdDb25maWcgPSB7fSkge1xyXG4gICAgbGV0IG9wdGlvbnMgPSBfb3B0aW9ucztcclxuICAgIGlmICh0eXBlb2YgcmF3Q29uZmlnICE9PSAnb2JqZWN0Jykge1xyXG4gICAgICAgIGNvbnN0IG5hbWUgPSByYXdDb25maWc7XHJcbiAgICAgICAgcmF3Q29uZmlnID0geyBuYW1lIH07XHJcbiAgICB9XHJcbiAgICBjb25zdCBjb25maWcgPSBPYmplY3QuYXNzaWduKHsgbmFtZTogREVGQVVMVF9FTlRSWV9OQU1FLCBhdXRvbWF0aWNEYXRhQ29sbGVjdGlvbkVuYWJsZWQ6IGZhbHNlIH0sIHJhd0NvbmZpZyk7XHJcbiAgICBjb25zdCBuYW1lID0gY29uZmlnLm5hbWU7XHJcbiAgICBpZiAodHlwZW9mIG5hbWUgIT09ICdzdHJpbmcnIHx8ICFuYW1lKSB7XHJcbiAgICAgICAgdGhyb3cgRVJST1JfRkFDVE9SWS5jcmVhdGUoXCJiYWQtYXBwLW5hbWVcIiAvKiBCQURfQVBQX05BTUUgKi8sIHtcclxuICAgICAgICAgICAgYXBwTmFtZTogU3RyaW5nKG5hbWUpXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBvcHRpb25zIHx8IChvcHRpb25zID0gZ2V0RGVmYXVsdEFwcENvbmZpZygpKTtcclxuICAgIGlmICghb3B0aW9ucykge1xyXG4gICAgICAgIHRocm93IEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKFwibm8tb3B0aW9uc1wiIC8qIE5PX09QVElPTlMgKi8pO1xyXG4gICAgfVxyXG4gICAgY29uc3QgZXhpc3RpbmdBcHAgPSBfYXBwcy5nZXQobmFtZSk7XHJcbiAgICBpZiAoZXhpc3RpbmdBcHApIHtcclxuICAgICAgICAvLyByZXR1cm4gdGhlIGV4aXN0aW5nIGFwcCBpZiBvcHRpb25zIGFuZCBjb25maWcgZGVlcCBlcXVhbCB0aGUgb25lcyBpbiB0aGUgZXhpc3RpbmcgYXBwLlxyXG4gICAgICAgIGlmIChkZWVwRXF1YWwob3B0aW9ucywgZXhpc3RpbmdBcHAub3B0aW9ucykgJiZcclxuICAgICAgICAgICAgZGVlcEVxdWFsKGNvbmZpZywgZXhpc3RpbmdBcHAuY29uZmlnKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZXhpc3RpbmdBcHA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBFUlJPUl9GQUNUT1JZLmNyZWF0ZShcImR1cGxpY2F0ZS1hcHBcIiAvKiBEVVBMSUNBVEVfQVBQICovLCB7IGFwcE5hbWU6IG5hbWUgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgY29uc3QgY29udGFpbmVyID0gbmV3IENvbXBvbmVudENvbnRhaW5lcihuYW1lKTtcclxuICAgIGZvciAoY29uc3QgY29tcG9uZW50IG9mIF9jb21wb25lbnRzLnZhbHVlcygpKSB7XHJcbiAgICAgICAgY29udGFpbmVyLmFkZENvbXBvbmVudChjb21wb25lbnQpO1xyXG4gICAgfVxyXG4gICAgY29uc3QgbmV3QXBwID0gbmV3IEZpcmViYXNlQXBwSW1wbChvcHRpb25zLCBjb25maWcsIGNvbnRhaW5lcik7XHJcbiAgICBfYXBwcy5zZXQobmFtZSwgbmV3QXBwKTtcclxuICAgIHJldHVybiBuZXdBcHA7XHJcbn1cclxuLyoqXHJcbiAqIFJldHJpZXZlcyBhIHtAbGluayBAZmlyZWJhc2UvYXBwI0ZpcmViYXNlQXBwfSBpbnN0YW5jZS5cclxuICpcclxuICogV2hlbiBjYWxsZWQgd2l0aCBubyBhcmd1bWVudHMsIHRoZSBkZWZhdWx0IGFwcCBpcyByZXR1cm5lZC4gV2hlbiBhbiBhcHAgbmFtZVxyXG4gKiBpcyBwcm92aWRlZCwgdGhlIGFwcCBjb3JyZXNwb25kaW5nIHRvIHRoYXQgbmFtZSBpcyByZXR1cm5lZC5cclxuICpcclxuICogQW4gZXhjZXB0aW9uIGlzIHRocm93biBpZiB0aGUgYXBwIGJlaW5nIHJldHJpZXZlZCBoYXMgbm90IHlldCBiZWVuXHJcbiAqIGluaXRpYWxpemVkLlxyXG4gKlxyXG4gKiBAZXhhbXBsZVxyXG4gKiBgYGBqYXZhc2NyaXB0XHJcbiAqIC8vIFJldHVybiB0aGUgZGVmYXVsdCBhcHBcclxuICogY29uc3QgYXBwID0gZ2V0QXBwKCk7XHJcbiAqIGBgYFxyXG4gKlxyXG4gKiBAZXhhbXBsZVxyXG4gKiBgYGBqYXZhc2NyaXB0XHJcbiAqIC8vIFJldHVybiBhIG5hbWVkIGFwcFxyXG4gKiBjb25zdCBvdGhlckFwcCA9IGdldEFwcChcIm90aGVyQXBwXCIpO1xyXG4gKiBgYGBcclxuICpcclxuICogQHBhcmFtIG5hbWUgLSBPcHRpb25hbCBuYW1lIG9mIHRoZSBhcHAgdG8gcmV0dXJuLiBJZiBubyBuYW1lIGlzXHJcbiAqICAgcHJvdmlkZWQsIHRoZSBkZWZhdWx0IGlzIGBcIltERUZBVUxUXVwiYC5cclxuICpcclxuICogQHJldHVybnMgVGhlIGFwcCBjb3JyZXNwb25kaW5nIHRvIHRoZSBwcm92aWRlZCBhcHAgbmFtZS5cclxuICogICBJZiBubyBhcHAgbmFtZSBpcyBwcm92aWRlZCwgdGhlIGRlZmF1bHQgYXBwIGlzIHJldHVybmVkLlxyXG4gKlxyXG4gKiBAcHVibGljXHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRBcHAobmFtZSA9IERFRkFVTFRfRU5UUllfTkFNRSkge1xyXG4gICAgY29uc3QgYXBwID0gX2FwcHMuZ2V0KG5hbWUpO1xyXG4gICAgaWYgKCFhcHAgJiYgbmFtZSA9PT0gREVGQVVMVF9FTlRSWV9OQU1FKSB7XHJcbiAgICAgICAgcmV0dXJuIGluaXRpYWxpemVBcHAoKTtcclxuICAgIH1cclxuICAgIGlmICghYXBwKSB7XHJcbiAgICAgICAgdGhyb3cgRVJST1JfRkFDVE9SWS5jcmVhdGUoXCJuby1hcHBcIiAvKiBOT19BUFAgKi8sIHsgYXBwTmFtZTogbmFtZSB9KTtcclxuICAgIH1cclxuICAgIHJldHVybiBhcHA7XHJcbn1cclxuLyoqXHJcbiAqIEEgKHJlYWQtb25seSkgYXJyYXkgb2YgYWxsIGluaXRpYWxpemVkIGFwcHMuXHJcbiAqIEBwdWJsaWNcclxuICovXHJcbmZ1bmN0aW9uIGdldEFwcHMoKSB7XHJcbiAgICByZXR1cm4gQXJyYXkuZnJvbShfYXBwcy52YWx1ZXMoKSk7XHJcbn1cclxuLyoqXHJcbiAqIFJlbmRlcnMgdGhpcyBhcHAgdW51c2FibGUgYW5kIGZyZWVzIHRoZSByZXNvdXJjZXMgb2YgYWxsIGFzc29jaWF0ZWRcclxuICogc2VydmljZXMuXHJcbiAqXHJcbiAqIEBleGFtcGxlXHJcbiAqIGBgYGphdmFzY3JpcHRcclxuICogZGVsZXRlQXBwKGFwcClcclxuICogICAudGhlbihmdW5jdGlvbigpIHtcclxuICogICAgIGNvbnNvbGUubG9nKFwiQXBwIGRlbGV0ZWQgc3VjY2Vzc2Z1bGx5XCIpO1xyXG4gKiAgIH0pXHJcbiAqICAgLmNhdGNoKGZ1bmN0aW9uKGVycm9yKSB7XHJcbiAqICAgICBjb25zb2xlLmxvZyhcIkVycm9yIGRlbGV0aW5nIGFwcDpcIiwgZXJyb3IpO1xyXG4gKiAgIH0pO1xyXG4gKiBgYGBcclxuICpcclxuICogQHB1YmxpY1xyXG4gKi9cclxuYXN5bmMgZnVuY3Rpb24gZGVsZXRlQXBwKGFwcCkge1xyXG4gICAgY29uc3QgbmFtZSA9IGFwcC5uYW1lO1xyXG4gICAgaWYgKF9hcHBzLmhhcyhuYW1lKSkge1xyXG4gICAgICAgIF9hcHBzLmRlbGV0ZShuYW1lKTtcclxuICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChhcHAuY29udGFpbmVyXHJcbiAgICAgICAgICAgIC5nZXRQcm92aWRlcnMoKVxyXG4gICAgICAgICAgICAubWFwKHByb3ZpZGVyID0+IHByb3ZpZGVyLmRlbGV0ZSgpKSk7XHJcbiAgICAgICAgYXBwLmlzRGVsZXRlZCA9IHRydWU7XHJcbiAgICB9XHJcbn1cclxuLyoqXHJcbiAqIFJlZ2lzdGVycyBhIGxpYnJhcnkncyBuYW1lIGFuZCB2ZXJzaW9uIGZvciBwbGF0Zm9ybSBsb2dnaW5nIHB1cnBvc2VzLlxyXG4gKiBAcGFyYW0gbGlicmFyeSAtIE5hbWUgb2YgMXAgb3IgM3AgbGlicmFyeSAoZS5nLiBmaXJlc3RvcmUsIGFuZ3VsYXJmaXJlKVxyXG4gKiBAcGFyYW0gdmVyc2lvbiAtIEN1cnJlbnQgdmVyc2lvbiBvZiB0aGF0IGxpYnJhcnkuXHJcbiAqIEBwYXJhbSB2YXJpYW50IC0gQnVuZGxlIHZhcmlhbnQsIGUuZy4sIG5vZGUsIHJuLCBldGMuXHJcbiAqXHJcbiAqIEBwdWJsaWNcclxuICovXHJcbmZ1bmN0aW9uIHJlZ2lzdGVyVmVyc2lvbihsaWJyYXJ5S2V5T3JOYW1lLCB2ZXJzaW9uLCB2YXJpYW50KSB7XHJcbiAgICB2YXIgX2E7XHJcbiAgICAvLyBUT0RPOiBXZSBjYW4gdXNlIHRoaXMgY2hlY2sgdG8gd2hpdGVsaXN0IHN0cmluZ3Mgd2hlbi9pZiB3ZSBzZXQgdXBcclxuICAgIC8vIGEgZ29vZCB3aGl0ZWxpc3Qgc3lzdGVtLlxyXG4gICAgbGV0IGxpYnJhcnkgPSAoX2EgPSBQTEFURk9STV9MT0dfU1RSSU5HW2xpYnJhcnlLZXlPck5hbWVdKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBsaWJyYXJ5S2V5T3JOYW1lO1xyXG4gICAgaWYgKHZhcmlhbnQpIHtcclxuICAgICAgICBsaWJyYXJ5ICs9IGAtJHt2YXJpYW50fWA7XHJcbiAgICB9XHJcbiAgICBjb25zdCBsaWJyYXJ5TWlzbWF0Y2ggPSBsaWJyYXJ5Lm1hdGNoKC9cXHN8XFwvLyk7XHJcbiAgICBjb25zdCB2ZXJzaW9uTWlzbWF0Y2ggPSB2ZXJzaW9uLm1hdGNoKC9cXHN8XFwvLyk7XHJcbiAgICBpZiAobGlicmFyeU1pc21hdGNoIHx8IHZlcnNpb25NaXNtYXRjaCkge1xyXG4gICAgICAgIGNvbnN0IHdhcm5pbmcgPSBbXHJcbiAgICAgICAgICAgIGBVbmFibGUgdG8gcmVnaXN0ZXIgbGlicmFyeSBcIiR7bGlicmFyeX1cIiB3aXRoIHZlcnNpb24gXCIke3ZlcnNpb259XCI6YFxyXG4gICAgICAgIF07XHJcbiAgICAgICAgaWYgKGxpYnJhcnlNaXNtYXRjaCkge1xyXG4gICAgICAgICAgICB3YXJuaW5nLnB1c2goYGxpYnJhcnkgbmFtZSBcIiR7bGlicmFyeX1cIiBjb250YWlucyBpbGxlZ2FsIGNoYXJhY3RlcnMgKHdoaXRlc3BhY2Ugb3IgXCIvXCIpYCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChsaWJyYXJ5TWlzbWF0Y2ggJiYgdmVyc2lvbk1pc21hdGNoKSB7XHJcbiAgICAgICAgICAgIHdhcm5pbmcucHVzaCgnYW5kJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh2ZXJzaW9uTWlzbWF0Y2gpIHtcclxuICAgICAgICAgICAgd2FybmluZy5wdXNoKGB2ZXJzaW9uIG5hbWUgXCIke3ZlcnNpb259XCIgY29udGFpbnMgaWxsZWdhbCBjaGFyYWN0ZXJzICh3aGl0ZXNwYWNlIG9yIFwiL1wiKWApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsb2dnZXIud2Fybih3YXJuaW5nLmpvaW4oJyAnKSk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgX3JlZ2lzdGVyQ29tcG9uZW50KG5ldyBDb21wb25lbnQoYCR7bGlicmFyeX0tdmVyc2lvbmAsICgpID0+ICh7IGxpYnJhcnksIHZlcnNpb24gfSksIFwiVkVSU0lPTlwiIC8qIFZFUlNJT04gKi8pKTtcclxufVxyXG4vKipcclxuICogU2V0cyBsb2cgaGFuZGxlciBmb3IgYWxsIEZpcmViYXNlIFNES3MuXHJcbiAqIEBwYXJhbSBsb2dDYWxsYmFjayAtIEFuIG9wdGlvbmFsIGN1c3RvbSBsb2cgaGFuZGxlciB0aGF0IGV4ZWN1dGVzIHVzZXIgY29kZSB3aGVuZXZlclxyXG4gKiB0aGUgRmlyZWJhc2UgU0RLIG1ha2VzIGEgbG9nZ2luZyBjYWxsLlxyXG4gKlxyXG4gKiBAcHVibGljXHJcbiAqL1xyXG5mdW5jdGlvbiBvbkxvZyhsb2dDYWxsYmFjaywgb3B0aW9ucykge1xyXG4gICAgaWYgKGxvZ0NhbGxiYWNrICE9PSBudWxsICYmIHR5cGVvZiBsb2dDYWxsYmFjayAhPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIHRocm93IEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKFwiaW52YWxpZC1sb2ctYXJndW1lbnRcIiAvKiBJTlZBTElEX0xPR19BUkdVTUVOVCAqLyk7XHJcbiAgICB9XHJcbiAgICBzZXRVc2VyTG9nSGFuZGxlcihsb2dDYWxsYmFjaywgb3B0aW9ucyk7XHJcbn1cclxuLyoqXHJcbiAqIFNldHMgbG9nIGxldmVsIGZvciBhbGwgRmlyZWJhc2UgU0RLcy5cclxuICpcclxuICogQWxsIG9mIHRoZSBsb2cgdHlwZXMgYWJvdmUgdGhlIGN1cnJlbnQgbG9nIGxldmVsIGFyZSBjYXB0dXJlZCAoaS5lLiBpZlxyXG4gKiB5b3Ugc2V0IHRoZSBsb2cgbGV2ZWwgdG8gYGluZm9gLCBlcnJvcnMgYXJlIGxvZ2dlZCwgYnV0IGBkZWJ1Z2AgYW5kXHJcbiAqIGB2ZXJib3NlYCBsb2dzIGFyZSBub3QpLlxyXG4gKlxyXG4gKiBAcHVibGljXHJcbiAqL1xyXG5mdW5jdGlvbiBzZXRMb2dMZXZlbChsb2dMZXZlbCkge1xyXG4gICAgc2V0TG9nTGV2ZWwkMShsb2dMZXZlbCk7XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDIxIEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuY29uc3QgREJfTkFNRSA9ICdmaXJlYmFzZS1oZWFydGJlYXQtZGF0YWJhc2UnO1xyXG5jb25zdCBEQl9WRVJTSU9OID0gMTtcclxuY29uc3QgU1RPUkVfTkFNRSA9ICdmaXJlYmFzZS1oZWFydGJlYXQtc3RvcmUnO1xyXG5sZXQgZGJQcm9taXNlID0gbnVsbDtcclxuZnVuY3Rpb24gZ2V0RGJQcm9taXNlKCkge1xyXG4gICAgaWYgKCFkYlByb21pc2UpIHtcclxuICAgICAgICBkYlByb21pc2UgPSBvcGVuREIoREJfTkFNRSwgREJfVkVSU0lPTiwge1xyXG4gICAgICAgICAgICB1cGdyYWRlOiAoZGIsIG9sZFZlcnNpb24pID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIFdlIGRvbid0IHVzZSAnYnJlYWsnIGluIHRoaXMgc3dpdGNoIHN0YXRlbWVudCwgdGhlIGZhbGwtdGhyb3VnaFxyXG4gICAgICAgICAgICAgICAgLy8gYmVoYXZpb3IgaXMgd2hhdCB3ZSB3YW50LCBiZWNhdXNlIGlmIHRoZXJlIGFyZSBtdWx0aXBsZSB2ZXJzaW9ucyBiZXR3ZWVuXHJcbiAgICAgICAgICAgICAgICAvLyB0aGUgb2xkIHZlcnNpb24gYW5kIHRoZSBjdXJyZW50IHZlcnNpb24sIHdlIHdhbnQgQUxMIHRoZSBtaWdyYXRpb25zXHJcbiAgICAgICAgICAgICAgICAvLyB0aGF0IGNvcnJlc3BvbmQgdG8gdGhvc2UgdmVyc2lvbnMgdG8gcnVuLCBub3Qgb25seSB0aGUgbGFzdCBvbmUuXHJcbiAgICAgICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZGVmYXVsdC1jYXNlXHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKG9sZFZlcnNpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRiLmNyZWF0ZU9iamVjdFN0b3JlKFNUT1JFX05BTUUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSkuY2F0Y2goZSA9PiB7XHJcbiAgICAgICAgICAgIHRocm93IEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKFwiaWRiLW9wZW5cIiAvKiBJREJfT1BFTiAqLywge1xyXG4gICAgICAgICAgICAgICAgb3JpZ2luYWxFcnJvck1lc3NhZ2U6IGUubWVzc2FnZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHJldHVybiBkYlByb21pc2U7XHJcbn1cclxuYXN5bmMgZnVuY3Rpb24gcmVhZEhlYXJ0YmVhdHNGcm9tSW5kZXhlZERCKGFwcCkge1xyXG4gICAgdmFyIF9hO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zdCBkYiA9IGF3YWl0IGdldERiUHJvbWlzZSgpO1xyXG4gICAgICAgIHJldHVybiBkYlxyXG4gICAgICAgICAgICAudHJhbnNhY3Rpb24oU1RPUkVfTkFNRSlcclxuICAgICAgICAgICAgLm9iamVjdFN0b3JlKFNUT1JFX05BTUUpXHJcbiAgICAgICAgICAgIC5nZXQoY29tcHV0ZUtleShhcHApKTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgaWYgKGUgaW5zdGFuY2VvZiBGaXJlYmFzZUVycm9yKSB7XHJcbiAgICAgICAgICAgIGxvZ2dlci53YXJuKGUubWVzc2FnZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCBpZGJHZXRFcnJvciA9IEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKFwiaWRiLWdldFwiIC8qIElEQl9HRVQgKi8sIHtcclxuICAgICAgICAgICAgICAgIG9yaWdpbmFsRXJyb3JNZXNzYWdlOiAoX2EgPSBlKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EubWVzc2FnZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgbG9nZ2VyLndhcm4oaWRiR2V0RXJyb3IubWVzc2FnZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmFzeW5jIGZ1bmN0aW9uIHdyaXRlSGVhcnRiZWF0c1RvSW5kZXhlZERCKGFwcCwgaGVhcnRiZWF0T2JqZWN0KSB7XHJcbiAgICB2YXIgX2E7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IGRiID0gYXdhaXQgZ2V0RGJQcm9taXNlKCk7XHJcbiAgICAgICAgY29uc3QgdHggPSBkYi50cmFuc2FjdGlvbihTVE9SRV9OQU1FLCAncmVhZHdyaXRlJyk7XHJcbiAgICAgICAgY29uc3Qgb2JqZWN0U3RvcmUgPSB0eC5vYmplY3RTdG9yZShTVE9SRV9OQU1FKTtcclxuICAgICAgICBhd2FpdCBvYmplY3RTdG9yZS5wdXQoaGVhcnRiZWF0T2JqZWN0LCBjb21wdXRlS2V5KGFwcCkpO1xyXG4gICAgICAgIHJldHVybiB0eC5kb25lO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICBpZiAoZSBpbnN0YW5jZW9mIEZpcmViYXNlRXJyb3IpIHtcclxuICAgICAgICAgICAgbG9nZ2VyLndhcm4oZS5tZXNzYWdlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGlkYkdldEVycm9yID0gRVJST1JfRkFDVE9SWS5jcmVhdGUoXCJpZGItc2V0XCIgLyogSURCX1dSSVRFICovLCB7XHJcbiAgICAgICAgICAgICAgICBvcmlnaW5hbEVycm9yTWVzc2FnZTogKF9hID0gZSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLm1lc3NhZ2VcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGxvZ2dlci53YXJuKGlkYkdldEVycm9yLm1lc3NhZ2UpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBjb21wdXRlS2V5KGFwcCkge1xyXG4gICAgcmV0dXJuIGAke2FwcC5uYW1lfSEke2FwcC5vcHRpb25zLmFwcElkfWA7XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDIxIEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuY29uc3QgTUFYX0hFQURFUl9CWVRFUyA9IDEwMjQ7XHJcbi8vIDMwIGRheXNcclxuY29uc3QgU1RPUkVEX0hFQVJUQkVBVF9SRVRFTlRJT05fTUFYX01JTExJUyA9IDMwICogMjQgKiA2MCAqIDYwICogMTAwMDtcclxuY2xhc3MgSGVhcnRiZWF0U2VydmljZUltcGwge1xyXG4gICAgY29uc3RydWN0b3IoY29udGFpbmVyKSB7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSW4tbWVtb3J5IGNhY2hlIGZvciBoZWFydGJlYXRzLCB1c2VkIGJ5IGdldEhlYXJ0YmVhdHNIZWFkZXIoKSB0byBnZW5lcmF0ZVxyXG4gICAgICAgICAqIHRoZSBoZWFkZXIgc3RyaW5nLlxyXG4gICAgICAgICAqIFN0b3JlcyBvbmUgcmVjb3JkIHBlciBkYXRlLiBUaGlzIHdpbGwgYmUgY29uc29saWRhdGVkIGludG8gdGhlIHN0YW5kYXJkXHJcbiAgICAgICAgICogZm9ybWF0IG9mIG9uZSByZWNvcmQgcGVyIHVzZXIgYWdlbnQgc3RyaW5nIGJlZm9yZSBiZWluZyBzZW50IGFzIGEgaGVhZGVyLlxyXG4gICAgICAgICAqIFBvcHVsYXRlZCBmcm9tIGluZGV4ZWREQiB3aGVuIHRoZSBjb250cm9sbGVyIGlzIGluc3RhbnRpYXRlZCBhbmQgc2hvdWxkXHJcbiAgICAgICAgICogYmUga2VwdCBpbiBzeW5jIHdpdGggaW5kZXhlZERCLlxyXG4gICAgICAgICAqIExlYXZlIHB1YmxpYyBmb3IgZWFzaWVyIHRlc3RpbmcuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5faGVhcnRiZWF0c0NhY2hlID0gbnVsbDtcclxuICAgICAgICBjb25zdCBhcHAgPSB0aGlzLmNvbnRhaW5lci5nZXRQcm92aWRlcignYXBwJykuZ2V0SW1tZWRpYXRlKCk7XHJcbiAgICAgICAgdGhpcy5fc3RvcmFnZSA9IG5ldyBIZWFydGJlYXRTdG9yYWdlSW1wbChhcHApO1xyXG4gICAgICAgIHRoaXMuX2hlYXJ0YmVhdHNDYWNoZVByb21pc2UgPSB0aGlzLl9zdG9yYWdlLnJlYWQoKS50aGVuKHJlc3VsdCA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX2hlYXJ0YmVhdHNDYWNoZSA9IHJlc3VsdDtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogQ2FsbGVkIHRvIHJlcG9ydCBhIGhlYXJ0YmVhdC4gVGhlIGZ1bmN0aW9uIHdpbGwgZ2VuZXJhdGVcclxuICAgICAqIGEgSGVhcnRiZWF0c0J5VXNlckFnZW50IG9iamVjdCwgdXBkYXRlIGhlYXJ0YmVhdHNDYWNoZSwgYW5kIHBlcnNpc3QgaXRcclxuICAgICAqIHRvIEluZGV4ZWREQi5cclxuICAgICAqIE5vdGUgdGhhdCB3ZSBvbmx5IHN0b3JlIG9uZSBoZWFydGJlYXQgcGVyIGRheS4gU28gaWYgYSBoZWFydGJlYXQgZm9yIHRvZGF5IGlzXHJcbiAgICAgKiBhbHJlYWR5IGxvZ2dlZCwgc3Vic2VxdWVudCBjYWxscyB0byB0aGlzIGZ1bmN0aW9uIGluIHRoZSBzYW1lIGRheSB3aWxsIGJlIGlnbm9yZWQuXHJcbiAgICAgKi9cclxuICAgIGFzeW5jIHRyaWdnZXJIZWFydGJlYXQoKSB7XHJcbiAgICAgICAgY29uc3QgcGxhdGZvcm1Mb2dnZXIgPSB0aGlzLmNvbnRhaW5lclxyXG4gICAgICAgICAgICAuZ2V0UHJvdmlkZXIoJ3BsYXRmb3JtLWxvZ2dlcicpXHJcbiAgICAgICAgICAgIC5nZXRJbW1lZGlhdGUoKTtcclxuICAgICAgICAvLyBUaGlzIGlzIHRoZSBcIkZpcmViYXNlIHVzZXIgYWdlbnRcIiBzdHJpbmcgZnJvbSB0aGUgcGxhdGZvcm0gbG9nZ2VyXHJcbiAgICAgICAgLy8gc2VydmljZSwgbm90IHRoZSBicm93c2VyIHVzZXIgYWdlbnQuXHJcbiAgICAgICAgY29uc3QgYWdlbnQgPSBwbGF0Zm9ybUxvZ2dlci5nZXRQbGF0Zm9ybUluZm9TdHJpbmcoKTtcclxuICAgICAgICBjb25zdCBkYXRlID0gZ2V0VVRDRGF0ZVN0cmluZygpO1xyXG4gICAgICAgIGlmICh0aGlzLl9oZWFydGJlYXRzQ2FjaGUgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5faGVhcnRiZWF0c0NhY2hlID0gYXdhaXQgdGhpcy5faGVhcnRiZWF0c0NhY2hlUHJvbWlzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gRG8gbm90IHN0b3JlIGEgaGVhcnRiZWF0IGlmIG9uZSBpcyBhbHJlYWR5IHN0b3JlZCBmb3IgdGhpcyBkYXlcclxuICAgICAgICAvLyBvciBpZiBhIGhlYWRlciBoYXMgYWxyZWFkeSBiZWVuIHNlbnQgdG9kYXkuXHJcbiAgICAgICAgaWYgKHRoaXMuX2hlYXJ0YmVhdHNDYWNoZS5sYXN0U2VudEhlYXJ0YmVhdERhdGUgPT09IGRhdGUgfHxcclxuICAgICAgICAgICAgdGhpcy5faGVhcnRiZWF0c0NhY2hlLmhlYXJ0YmVhdHMuc29tZShzaW5nbGVEYXRlSGVhcnRiZWF0ID0+IHNpbmdsZURhdGVIZWFydGJlYXQuZGF0ZSA9PT0gZGF0ZSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgLy8gVGhlcmUgaXMgbm8gZW50cnkgZm9yIHRoaXMgZGF0ZS4gQ3JlYXRlIG9uZS5cclxuICAgICAgICAgICAgdGhpcy5faGVhcnRiZWF0c0NhY2hlLmhlYXJ0YmVhdHMucHVzaCh7IGRhdGUsIGFnZW50IH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBSZW1vdmUgZW50cmllcyBvbGRlciB0aGFuIDMwIGRheXMuXHJcbiAgICAgICAgdGhpcy5faGVhcnRiZWF0c0NhY2hlLmhlYXJ0YmVhdHMgPSB0aGlzLl9oZWFydGJlYXRzQ2FjaGUuaGVhcnRiZWF0cy5maWx0ZXIoc2luZ2xlRGF0ZUhlYXJ0YmVhdCA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGhiVGltZXN0YW1wID0gbmV3IERhdGUoc2luZ2xlRGF0ZUhlYXJ0YmVhdC5kYXRlKS52YWx1ZU9mKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IG5vdyA9IERhdGUubm93KCk7XHJcbiAgICAgICAgICAgIHJldHVybiBub3cgLSBoYlRpbWVzdGFtcCA8PSBTVE9SRURfSEVBUlRCRUFUX1JFVEVOVElPTl9NQVhfTUlMTElTO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zdG9yYWdlLm92ZXJ3cml0ZSh0aGlzLl9oZWFydGJlYXRzQ2FjaGUpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgYmFzZTY0IGVuY29kZWQgc3RyaW5nIHdoaWNoIGNhbiBiZSBhdHRhY2hlZCB0byB0aGUgaGVhcnRiZWF0LXNwZWNpZmljIGhlYWRlciBkaXJlY3RseS5cclxuICAgICAqIEl0IGFsc28gY2xlYXJzIGFsbCBoZWFydGJlYXRzIGZyb20gbWVtb3J5IGFzIHdlbGwgYXMgaW4gSW5kZXhlZERCLlxyXG4gICAgICpcclxuICAgICAqIE5PVEU6IENvbnN1bWluZyBwcm9kdWN0IFNES3Mgc2hvdWxkIG5vdCBzZW5kIHRoZSBoZWFkZXIgaWYgdGhpcyBtZXRob2RcclxuICAgICAqIHJldHVybnMgYW4gZW1wdHkgc3RyaW5nLlxyXG4gICAgICovXHJcbiAgICBhc3luYyBnZXRIZWFydGJlYXRzSGVhZGVyKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9oZWFydGJlYXRzQ2FjaGUgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgYXdhaXQgdGhpcy5faGVhcnRiZWF0c0NhY2hlUHJvbWlzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gSWYgaXQncyBzdGlsbCBudWxsIG9yIHRoZSBhcnJheSBpcyBlbXB0eSwgdGhlcmUgaXMgbm8gZGF0YSB0byBzZW5kLlxyXG4gICAgICAgIGlmICh0aGlzLl9oZWFydGJlYXRzQ2FjaGUgPT09IG51bGwgfHxcclxuICAgICAgICAgICAgdGhpcy5faGVhcnRiZWF0c0NhY2hlLmhlYXJ0YmVhdHMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAnJztcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgZGF0ZSA9IGdldFVUQ0RhdGVTdHJpbmcoKTtcclxuICAgICAgICAvLyBFeHRyYWN0IGFzIG1hbnkgaGVhcnRiZWF0cyBmcm9tIHRoZSBjYWNoZSBhcyB3aWxsIGZpdCB1bmRlciB0aGUgc2l6ZSBsaW1pdC5cclxuICAgICAgICBjb25zdCB7IGhlYXJ0YmVhdHNUb1NlbmQsIHVuc2VudEVudHJpZXMgfSA9IGV4dHJhY3RIZWFydGJlYXRzRm9ySGVhZGVyKHRoaXMuX2hlYXJ0YmVhdHNDYWNoZS5oZWFydGJlYXRzKTtcclxuICAgICAgICBjb25zdCBoZWFkZXJTdHJpbmcgPSBiYXNlNjR1cmxFbmNvZGVXaXRob3V0UGFkZGluZyhKU09OLnN0cmluZ2lmeSh7IHZlcnNpb246IDIsIGhlYXJ0YmVhdHM6IGhlYXJ0YmVhdHNUb1NlbmQgfSkpO1xyXG4gICAgICAgIC8vIFN0b3JlIGxhc3Qgc2VudCBkYXRlIHRvIHByZXZlbnQgYW5vdGhlciBiZWluZyBsb2dnZWQvc2VudCBmb3IgdGhlIHNhbWUgZGF5LlxyXG4gICAgICAgIHRoaXMuX2hlYXJ0YmVhdHNDYWNoZS5sYXN0U2VudEhlYXJ0YmVhdERhdGUgPSBkYXRlO1xyXG4gICAgICAgIGlmICh1bnNlbnRFbnRyaWVzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgLy8gU3RvcmUgYW55IHVuc2VudCBlbnRyaWVzIGlmIHRoZXkgZXhpc3QuXHJcbiAgICAgICAgICAgIHRoaXMuX2hlYXJ0YmVhdHNDYWNoZS5oZWFydGJlYXRzID0gdW5zZW50RW50cmllcztcclxuICAgICAgICAgICAgLy8gVGhpcyBzZWVtcyBtb3JlIGxpa2VseSB0aGFuIGVtcHR5aW5nIHRoZSBhcnJheSAoYmVsb3cpIHRvIGxlYWQgdG8gc29tZSBvZGQgc3RhdGVcclxuICAgICAgICAgICAgLy8gc2luY2UgdGhlIGNhY2hlIGlzbid0IGVtcHR5IGFuZCB0aGlzIHdpbGwgYmUgY2FsbGVkIGFnYWluIG9uIHRoZSBuZXh0IHJlcXVlc3QsXHJcbiAgICAgICAgICAgIC8vIGFuZCBpcyBwcm9iYWJseSBzYWZlc3QgaWYgd2UgYXdhaXQgaXQuXHJcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuX3N0b3JhZ2Uub3ZlcndyaXRlKHRoaXMuX2hlYXJ0YmVhdHNDYWNoZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl9oZWFydGJlYXRzQ2FjaGUuaGVhcnRiZWF0cyA9IFtdO1xyXG4gICAgICAgICAgICAvLyBEbyBub3Qgd2FpdCBmb3IgdGhpcywgdG8gcmVkdWNlIGxhdGVuY3kuXHJcbiAgICAgICAgICAgIHZvaWQgdGhpcy5fc3RvcmFnZS5vdmVyd3JpdGUodGhpcy5faGVhcnRiZWF0c0NhY2hlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGhlYWRlclN0cmluZztcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBnZXRVVENEYXRlU3RyaW5nKCkge1xyXG4gICAgY29uc3QgdG9kYXkgPSBuZXcgRGF0ZSgpO1xyXG4gICAgLy8gUmV0dXJucyBkYXRlIGZvcm1hdCAnWVlZWS1NTS1ERCdcclxuICAgIHJldHVybiB0b2RheS50b0lTT1N0cmluZygpLnN1YnN0cmluZygwLCAxMCk7XHJcbn1cclxuZnVuY3Rpb24gZXh0cmFjdEhlYXJ0YmVhdHNGb3JIZWFkZXIoaGVhcnRiZWF0c0NhY2hlLCBtYXhTaXplID0gTUFYX0hFQURFUl9CWVRFUykge1xyXG4gICAgLy8gSGVhcnRiZWF0cyBncm91cGVkIGJ5IHVzZXIgYWdlbnQgaW4gdGhlIHN0YW5kYXJkIGZvcm1hdCB0byBiZSBzZW50IGluXHJcbiAgICAvLyB0aGUgaGVhZGVyLlxyXG4gICAgY29uc3QgaGVhcnRiZWF0c1RvU2VuZCA9IFtdO1xyXG4gICAgLy8gU2luZ2xlIGRhdGUgZm9ybWF0IGhlYXJ0YmVhdHMgdGhhdCBhcmUgbm90IHNlbnQuXHJcbiAgICBsZXQgdW5zZW50RW50cmllcyA9IGhlYXJ0YmVhdHNDYWNoZS5zbGljZSgpO1xyXG4gICAgZm9yIChjb25zdCBzaW5nbGVEYXRlSGVhcnRiZWF0IG9mIGhlYXJ0YmVhdHNDYWNoZSkge1xyXG4gICAgICAgIC8vIExvb2sgZm9yIGFuIGV4aXN0aW5nIGVudHJ5IHdpdGggdGhlIHNhbWUgdXNlciBhZ2VudC5cclxuICAgICAgICBjb25zdCBoZWFydGJlYXRFbnRyeSA9IGhlYXJ0YmVhdHNUb1NlbmQuZmluZChoYiA9PiBoYi5hZ2VudCA9PT0gc2luZ2xlRGF0ZUhlYXJ0YmVhdC5hZ2VudCk7XHJcbiAgICAgICAgaWYgKCFoZWFydGJlYXRFbnRyeSkge1xyXG4gICAgICAgICAgICAvLyBJZiBubyBlbnRyeSBmb3IgdGhpcyB1c2VyIGFnZW50IGV4aXN0cywgY3JlYXRlIG9uZS5cclxuICAgICAgICAgICAgaGVhcnRiZWF0c1RvU2VuZC5wdXNoKHtcclxuICAgICAgICAgICAgICAgIGFnZW50OiBzaW5nbGVEYXRlSGVhcnRiZWF0LmFnZW50LFxyXG4gICAgICAgICAgICAgICAgZGF0ZXM6IFtzaW5nbGVEYXRlSGVhcnRiZWF0LmRhdGVdXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBpZiAoY291bnRCeXRlcyhoZWFydGJlYXRzVG9TZW5kKSA+IG1heFNpemUpIHtcclxuICAgICAgICAgICAgICAgIC8vIElmIHRoZSBoZWFkZXIgd291bGQgZXhjZWVkIG1heCBzaXplLCByZW1vdmUgdGhlIGFkZGVkIGhlYXJ0YmVhdFxyXG4gICAgICAgICAgICAgICAgLy8gZW50cnkgYW5kIHN0b3AgYWRkaW5nIHRvIHRoZSBoZWFkZXIuXHJcbiAgICAgICAgICAgICAgICBoZWFydGJlYXRzVG9TZW5kLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGhlYXJ0YmVhdEVudHJ5LmRhdGVzLnB1c2goc2luZ2xlRGF0ZUhlYXJ0YmVhdC5kYXRlKTtcclxuICAgICAgICAgICAgLy8gSWYgdGhlIGhlYWRlciB3b3VsZCBleGNlZWQgbWF4IHNpemUsIHJlbW92ZSB0aGUgYWRkZWQgZGF0ZVxyXG4gICAgICAgICAgICAvLyBhbmQgc3RvcCBhZGRpbmcgdG8gdGhlIGhlYWRlci5cclxuICAgICAgICAgICAgaWYgKGNvdW50Qnl0ZXMoaGVhcnRiZWF0c1RvU2VuZCkgPiBtYXhTaXplKSB7XHJcbiAgICAgICAgICAgICAgICBoZWFydGJlYXRFbnRyeS5kYXRlcy5wb3AoKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIFBvcCB1bnNlbnQgZW50cnkgZnJvbSBxdWV1ZS4gKFNraXBwZWQgaWYgYWRkaW5nIHRoZSBlbnRyeSBleGNlZWRlZFxyXG4gICAgICAgIC8vIHF1b3RhIGFuZCB0aGUgbG9vcCBicmVha3MgZWFybHkuKVxyXG4gICAgICAgIHVuc2VudEVudHJpZXMgPSB1bnNlbnRFbnRyaWVzLnNsaWNlKDEpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBoZWFydGJlYXRzVG9TZW5kLFxyXG4gICAgICAgIHVuc2VudEVudHJpZXNcclxuICAgIH07XHJcbn1cclxuY2xhc3MgSGVhcnRiZWF0U3RvcmFnZUltcGwge1xyXG4gICAgY29uc3RydWN0b3IoYXBwKSB7XHJcbiAgICAgICAgdGhpcy5hcHAgPSBhcHA7XHJcbiAgICAgICAgdGhpcy5fY2FuVXNlSW5kZXhlZERCUHJvbWlzZSA9IHRoaXMucnVuSW5kZXhlZERCRW52aXJvbm1lbnRDaGVjaygpO1xyXG4gICAgfVxyXG4gICAgYXN5bmMgcnVuSW5kZXhlZERCRW52aXJvbm1lbnRDaGVjaygpIHtcclxuICAgICAgICBpZiAoIWlzSW5kZXhlZERCQXZhaWxhYmxlKCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHZhbGlkYXRlSW5kZXhlZERCT3BlbmFibGUoKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4gdHJ1ZSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaCgoKSA9PiBmYWxzZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBSZWFkIGFsbCBoZWFydGJlYXRzLlxyXG4gICAgICovXHJcbiAgICBhc3luYyByZWFkKCkge1xyXG4gICAgICAgIGNvbnN0IGNhblVzZUluZGV4ZWREQiA9IGF3YWl0IHRoaXMuX2NhblVzZUluZGV4ZWREQlByb21pc2U7XHJcbiAgICAgICAgaWYgKCFjYW5Vc2VJbmRleGVkREIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHsgaGVhcnRiZWF0czogW10gfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGlkYkhlYXJ0YmVhdE9iamVjdCA9IGF3YWl0IHJlYWRIZWFydGJlYXRzRnJvbUluZGV4ZWREQih0aGlzLmFwcCk7XHJcbiAgICAgICAgICAgIHJldHVybiBpZGJIZWFydGJlYXRPYmplY3QgfHwgeyBoZWFydGJlYXRzOiBbXSB9O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8vIG92ZXJ3cml0ZSB0aGUgc3RvcmFnZSB3aXRoIHRoZSBwcm92aWRlZCBoZWFydGJlYXRzXHJcbiAgICBhc3luYyBvdmVyd3JpdGUoaGVhcnRiZWF0c09iamVjdCkge1xyXG4gICAgICAgIHZhciBfYTtcclxuICAgICAgICBjb25zdCBjYW5Vc2VJbmRleGVkREIgPSBhd2FpdCB0aGlzLl9jYW5Vc2VJbmRleGVkREJQcm9taXNlO1xyXG4gICAgICAgIGlmICghY2FuVXNlSW5kZXhlZERCKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGV4aXN0aW5nSGVhcnRiZWF0c09iamVjdCA9IGF3YWl0IHRoaXMucmVhZCgpO1xyXG4gICAgICAgICAgICByZXR1cm4gd3JpdGVIZWFydGJlYXRzVG9JbmRleGVkREIodGhpcy5hcHAsIHtcclxuICAgICAgICAgICAgICAgIGxhc3RTZW50SGVhcnRiZWF0RGF0ZTogKF9hID0gaGVhcnRiZWF0c09iamVjdC5sYXN0U2VudEhlYXJ0YmVhdERhdGUpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IGV4aXN0aW5nSGVhcnRiZWF0c09iamVjdC5sYXN0U2VudEhlYXJ0YmVhdERhdGUsXHJcbiAgICAgICAgICAgICAgICBoZWFydGJlYXRzOiBoZWFydGJlYXRzT2JqZWN0LmhlYXJ0YmVhdHNcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8gYWRkIGhlYXJ0YmVhdHNcclxuICAgIGFzeW5jIGFkZChoZWFydGJlYXRzT2JqZWN0KSB7XHJcbiAgICAgICAgdmFyIF9hO1xyXG4gICAgICAgIGNvbnN0IGNhblVzZUluZGV4ZWREQiA9IGF3YWl0IHRoaXMuX2NhblVzZUluZGV4ZWREQlByb21pc2U7XHJcbiAgICAgICAgaWYgKCFjYW5Vc2VJbmRleGVkREIpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgZXhpc3RpbmdIZWFydGJlYXRzT2JqZWN0ID0gYXdhaXQgdGhpcy5yZWFkKCk7XHJcbiAgICAgICAgICAgIHJldHVybiB3cml0ZUhlYXJ0YmVhdHNUb0luZGV4ZWREQih0aGlzLmFwcCwge1xyXG4gICAgICAgICAgICAgICAgbGFzdFNlbnRIZWFydGJlYXREYXRlOiAoX2EgPSBoZWFydGJlYXRzT2JqZWN0Lmxhc3RTZW50SGVhcnRiZWF0RGF0ZSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogZXhpc3RpbmdIZWFydGJlYXRzT2JqZWN0Lmxhc3RTZW50SGVhcnRiZWF0RGF0ZSxcclxuICAgICAgICAgICAgICAgIGhlYXJ0YmVhdHM6IFtcclxuICAgICAgICAgICAgICAgICAgICAuLi5leGlzdGluZ0hlYXJ0YmVhdHNPYmplY3QuaGVhcnRiZWF0cyxcclxuICAgICAgICAgICAgICAgICAgICAuLi5oZWFydGJlYXRzT2JqZWN0LmhlYXJ0YmVhdHNcclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbi8qKlxyXG4gKiBDYWxjdWxhdGUgYnl0ZXMgb2YgYSBIZWFydGJlYXRzQnlVc2VyQWdlbnQgYXJyYXkgYWZ0ZXIgYmVpbmcgd3JhcHBlZFxyXG4gKiBpbiBhIHBsYXRmb3JtIGxvZ2dpbmcgaGVhZGVyIEpTT04gb2JqZWN0LCBzdHJpbmdpZmllZCwgYW5kIGNvbnZlcnRlZFxyXG4gKiB0byBiYXNlIDY0LlxyXG4gKi9cclxuZnVuY3Rpb24gY291bnRCeXRlcyhoZWFydGJlYXRzQ2FjaGUpIHtcclxuICAgIC8vIGJhc2U2NCBoYXMgYSByZXN0cmljdGVkIHNldCBvZiBjaGFyYWN0ZXJzLCBhbGwgb2Ygd2hpY2ggc2hvdWxkIGJlIDEgYnl0ZS5cclxuICAgIHJldHVybiBiYXNlNjR1cmxFbmNvZGVXaXRob3V0UGFkZGluZyhcclxuICAgIC8vIGhlYXJ0YmVhdHNDYWNoZSB3cmFwcGVyIHByb3BlcnRpZXNcclxuICAgIEpTT04uc3RyaW5naWZ5KHsgdmVyc2lvbjogMiwgaGVhcnRiZWF0czogaGVhcnRiZWF0c0NhY2hlIH0pKS5sZW5ndGg7XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuZnVuY3Rpb24gcmVnaXN0ZXJDb3JlQ29tcG9uZW50cyh2YXJpYW50KSB7XHJcbiAgICBfcmVnaXN0ZXJDb21wb25lbnQobmV3IENvbXBvbmVudCgncGxhdGZvcm0tbG9nZ2VyJywgY29udGFpbmVyID0+IG5ldyBQbGF0Zm9ybUxvZ2dlclNlcnZpY2VJbXBsKGNvbnRhaW5lciksIFwiUFJJVkFURVwiIC8qIFBSSVZBVEUgKi8pKTtcclxuICAgIF9yZWdpc3RlckNvbXBvbmVudChuZXcgQ29tcG9uZW50KCdoZWFydGJlYXQnLCBjb250YWluZXIgPT4gbmV3IEhlYXJ0YmVhdFNlcnZpY2VJbXBsKGNvbnRhaW5lciksIFwiUFJJVkFURVwiIC8qIFBSSVZBVEUgKi8pKTtcclxuICAgIC8vIFJlZ2lzdGVyIGBhcHBgIHBhY2thZ2UuXHJcbiAgICByZWdpc3RlclZlcnNpb24obmFtZSRvLCB2ZXJzaW9uJDEsIHZhcmlhbnQpO1xyXG4gICAgLy8gQlVJTERfVEFSR0VUIHdpbGwgYmUgcmVwbGFjZWQgYnkgdmFsdWVzIGxpa2UgZXNtNSwgZXNtMjAxNywgY2pzNSwgZXRjIGR1cmluZyB0aGUgY29tcGlsYXRpb25cclxuICAgIHJlZ2lzdGVyVmVyc2lvbihuYW1lJG8sIHZlcnNpb24kMSwgJ2VzbTIwMTcnKTtcclxuICAgIC8vIFJlZ2lzdGVyIHBsYXRmb3JtIFNESyBpZGVudGlmaWVyIChubyB2ZXJzaW9uKS5cclxuICAgIHJlZ2lzdGVyVmVyc2lvbignZmlyZS1qcycsICcnKTtcclxufVxuXG4vKipcclxuICogRmlyZWJhc2UgQXBwXHJcbiAqXHJcbiAqIEByZW1hcmtzIFRoaXMgcGFja2FnZSBjb29yZGluYXRlcyB0aGUgY29tbXVuaWNhdGlvbiBiZXR3ZWVuIHRoZSBkaWZmZXJlbnQgRmlyZWJhc2UgY29tcG9uZW50c1xyXG4gKiBAcGFja2FnZURvY3VtZW50YXRpb25cclxuICovXHJcbnJlZ2lzdGVyQ29yZUNvbXBvbmVudHMoJycpO1xuXG5leHBvcnQgeyBTREtfVkVSU0lPTiwgREVGQVVMVF9FTlRSWV9OQU1FIGFzIF9ERUZBVUxUX0VOVFJZX05BTUUsIF9hZGRDb21wb25lbnQsIF9hZGRPck92ZXJ3cml0ZUNvbXBvbmVudCwgX2FwcHMsIF9jbGVhckNvbXBvbmVudHMsIF9jb21wb25lbnRzLCBfZ2V0UHJvdmlkZXIsIF9yZWdpc3RlckNvbXBvbmVudCwgX3JlbW92ZVNlcnZpY2VJbnN0YW5jZSwgZGVsZXRlQXBwLCBnZXRBcHAsIGdldEFwcHMsIGluaXRpYWxpemVBcHAsIG9uTG9nLCByZWdpc3RlclZlcnNpb24sIHNldExvZ0xldmVsIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5lc20yMDE3LmpzLm1hcFxuIiwiaW1wb3J0IHsgZ2V0QXBwLCBfZ2V0UHJvdmlkZXIsIF9yZWdpc3RlckNvbXBvbmVudCwgcmVnaXN0ZXJWZXJzaW9uIH0gZnJvbSAnQGZpcmViYXNlL2FwcCc7XG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdAZmlyZWJhc2UvY29tcG9uZW50JztcbmltcG9ydCB7IEVycm9yRmFjdG9yeSwgRmlyZWJhc2VFcnJvciB9IGZyb20gJ0BmaXJlYmFzZS91dGlsJztcbmltcG9ydCB7IG9wZW5EQiB9IGZyb20gJ2lkYic7XG5cbmNvbnN0IG5hbWUgPSBcIkBmaXJlYmFzZS9pbnN0YWxsYXRpb25zXCI7XG5jb25zdCB2ZXJzaW9uID0gXCIwLjUuMTVcIjtcblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuY29uc3QgUEVORElOR19USU1FT1VUX01TID0gMTAwMDA7XHJcbmNvbnN0IFBBQ0tBR0VfVkVSU0lPTiA9IGB3OiR7dmVyc2lvbn1gO1xyXG5jb25zdCBJTlRFUk5BTF9BVVRIX1ZFUlNJT04gPSAnRklTX3YyJztcclxuY29uc3QgSU5TVEFMTEFUSU9OU19BUElfVVJMID0gJ2h0dHBzOi8vZmlyZWJhc2VpbnN0YWxsYXRpb25zLmdvb2dsZWFwaXMuY29tL3YxJztcclxuY29uc3QgVE9LRU5fRVhQSVJBVElPTl9CVUZGRVIgPSA2MCAqIDYwICogMTAwMDsgLy8gT25lIGhvdXJcclxuY29uc3QgU0VSVklDRSA9ICdpbnN0YWxsYXRpb25zJztcclxuY29uc3QgU0VSVklDRV9OQU1FID0gJ0luc3RhbGxhdGlvbnMnO1xuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5jb25zdCBFUlJPUl9ERVNDUklQVElPTl9NQVAgPSB7XHJcbiAgICBbXCJtaXNzaW5nLWFwcC1jb25maWctdmFsdWVzXCIgLyogTUlTU0lOR19BUFBfQ09ORklHX1ZBTFVFUyAqL106ICdNaXNzaW5nIEFwcCBjb25maWd1cmF0aW9uIHZhbHVlOiBcInskdmFsdWVOYW1lfVwiJyxcclxuICAgIFtcIm5vdC1yZWdpc3RlcmVkXCIgLyogTk9UX1JFR0lTVEVSRUQgKi9dOiAnRmlyZWJhc2UgSW5zdGFsbGF0aW9uIGlzIG5vdCByZWdpc3RlcmVkLicsXHJcbiAgICBbXCJpbnN0YWxsYXRpb24tbm90LWZvdW5kXCIgLyogSU5TVEFMTEFUSU9OX05PVF9GT1VORCAqL106ICdGaXJlYmFzZSBJbnN0YWxsYXRpb24gbm90IGZvdW5kLicsXHJcbiAgICBbXCJyZXF1ZXN0LWZhaWxlZFwiIC8qIFJFUVVFU1RfRkFJTEVEICovXTogJ3skcmVxdWVzdE5hbWV9IHJlcXVlc3QgZmFpbGVkIHdpdGggZXJyb3IgXCJ7JHNlcnZlckNvZGV9IHskc2VydmVyU3RhdHVzfTogeyRzZXJ2ZXJNZXNzYWdlfVwiJyxcclxuICAgIFtcImFwcC1vZmZsaW5lXCIgLyogQVBQX09GRkxJTkUgKi9dOiAnQ291bGQgbm90IHByb2Nlc3MgcmVxdWVzdC4gQXBwbGljYXRpb24gb2ZmbGluZS4nLFxyXG4gICAgW1wiZGVsZXRlLXBlbmRpbmctcmVnaXN0cmF0aW9uXCIgLyogREVMRVRFX1BFTkRJTkdfUkVHSVNUUkFUSU9OICovXTogXCJDYW4ndCBkZWxldGUgaW5zdGFsbGF0aW9uIHdoaWxlIHRoZXJlIGlzIGEgcGVuZGluZyByZWdpc3RyYXRpb24gcmVxdWVzdC5cIlxyXG59O1xyXG5jb25zdCBFUlJPUl9GQUNUT1JZID0gbmV3IEVycm9yRmFjdG9yeShTRVJWSUNFLCBTRVJWSUNFX05BTUUsIEVSUk9SX0RFU0NSSVBUSU9OX01BUCk7XHJcbi8qKiBSZXR1cm5zIHRydWUgaWYgZXJyb3IgaXMgYSBGaXJlYmFzZUVycm9yIHRoYXQgaXMgYmFzZWQgb24gYW4gZXJyb3IgZnJvbSB0aGUgc2VydmVyLiAqL1xyXG5mdW5jdGlvbiBpc1NlcnZlckVycm9yKGVycm9yKSB7XHJcbiAgICByZXR1cm4gKGVycm9yIGluc3RhbmNlb2YgRmlyZWJhc2VFcnJvciAmJlxyXG4gICAgICAgIGVycm9yLmNvZGUuaW5jbHVkZXMoXCJyZXF1ZXN0LWZhaWxlZFwiIC8qIFJFUVVFU1RfRkFJTEVEICovKSk7XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0SW5zdGFsbGF0aW9uc0VuZHBvaW50KHsgcHJvamVjdElkIH0pIHtcclxuICAgIHJldHVybiBgJHtJTlNUQUxMQVRJT05TX0FQSV9VUkx9L3Byb2plY3RzLyR7cHJvamVjdElkfS9pbnN0YWxsYXRpb25zYDtcclxufVxyXG5mdW5jdGlvbiBleHRyYWN0QXV0aFRva2VuSW5mb0Zyb21SZXNwb25zZShyZXNwb25zZSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0b2tlbjogcmVzcG9uc2UudG9rZW4sXHJcbiAgICAgICAgcmVxdWVzdFN0YXR1czogMiAvKiBDT01QTEVURUQgKi8sXHJcbiAgICAgICAgZXhwaXJlc0luOiBnZXRFeHBpcmVzSW5Gcm9tUmVzcG9uc2VFeHBpcmVzSW4ocmVzcG9uc2UuZXhwaXJlc0luKSxcclxuICAgICAgICBjcmVhdGlvblRpbWU6IERhdGUubm93KClcclxuICAgIH07XHJcbn1cclxuYXN5bmMgZnVuY3Rpb24gZ2V0RXJyb3JGcm9tUmVzcG9uc2UocmVxdWVzdE5hbWUsIHJlc3BvbnNlKSB7XHJcbiAgICBjb25zdCByZXNwb25zZUpzb24gPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcbiAgICBjb25zdCBlcnJvckRhdGEgPSByZXNwb25zZUpzb24uZXJyb3I7XHJcbiAgICByZXR1cm4gRVJST1JfRkFDVE9SWS5jcmVhdGUoXCJyZXF1ZXN0LWZhaWxlZFwiIC8qIFJFUVVFU1RfRkFJTEVEICovLCB7XHJcbiAgICAgICAgcmVxdWVzdE5hbWUsXHJcbiAgICAgICAgc2VydmVyQ29kZTogZXJyb3JEYXRhLmNvZGUsXHJcbiAgICAgICAgc2VydmVyTWVzc2FnZTogZXJyb3JEYXRhLm1lc3NhZ2UsXHJcbiAgICAgICAgc2VydmVyU3RhdHVzOiBlcnJvckRhdGEuc3RhdHVzXHJcbiAgICB9KTtcclxufVxyXG5mdW5jdGlvbiBnZXRIZWFkZXJzKHsgYXBpS2V5IH0pIHtcclxuICAgIHJldHVybiBuZXcgSGVhZGVycyh7XHJcbiAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcclxuICAgICAgICBBY2NlcHQ6ICdhcHBsaWNhdGlvbi9qc29uJyxcclxuICAgICAgICAneC1nb29nLWFwaS1rZXknOiBhcGlLZXlcclxuICAgIH0pO1xyXG59XHJcbmZ1bmN0aW9uIGdldEhlYWRlcnNXaXRoQXV0aChhcHBDb25maWcsIHsgcmVmcmVzaFRva2VuIH0pIHtcclxuICAgIGNvbnN0IGhlYWRlcnMgPSBnZXRIZWFkZXJzKGFwcENvbmZpZyk7XHJcbiAgICBoZWFkZXJzLmFwcGVuZCgnQXV0aG9yaXphdGlvbicsIGdldEF1dGhvcml6YXRpb25IZWFkZXIocmVmcmVzaFRva2VuKSk7XHJcbiAgICByZXR1cm4gaGVhZGVycztcclxufVxyXG4vKipcclxuICogQ2FsbHMgdGhlIHBhc3NlZCBpbiBmZXRjaCB3cmFwcGVyIGFuZCByZXR1cm5zIHRoZSByZXNwb25zZS5cclxuICogSWYgdGhlIHJldHVybmVkIHJlc3BvbnNlIGhhcyBhIHN0YXR1cyBvZiA1eHgsIHJlLXJ1bnMgdGhlIGZ1bmN0aW9uIG9uY2UgYW5kXHJcbiAqIHJldHVybnMgdGhlIHJlc3BvbnNlLlxyXG4gKi9cclxuYXN5bmMgZnVuY3Rpb24gcmV0cnlJZlNlcnZlckVycm9yKGZuKSB7XHJcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBmbigpO1xyXG4gICAgaWYgKHJlc3VsdC5zdGF0dXMgPj0gNTAwICYmIHJlc3VsdC5zdGF0dXMgPCA2MDApIHtcclxuICAgICAgICAvLyBJbnRlcm5hbCBTZXJ2ZXIgRXJyb3IuIFJldHJ5IHJlcXVlc3QuXHJcbiAgICAgICAgcmV0dXJuIGZuKCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcbmZ1bmN0aW9uIGdldEV4cGlyZXNJbkZyb21SZXNwb25zZUV4cGlyZXNJbihyZXNwb25zZUV4cGlyZXNJbikge1xyXG4gICAgLy8gVGhpcyB3b3JrcyBiZWNhdXNlIHRoZSBzZXJ2ZXIgd2lsbCBuZXZlciByZXNwb25kIHdpdGggZnJhY3Rpb25zIG9mIGEgc2Vjb25kLlxyXG4gICAgcmV0dXJuIE51bWJlcihyZXNwb25zZUV4cGlyZXNJbi5yZXBsYWNlKCdzJywgJzAwMCcpKTtcclxufVxyXG5mdW5jdGlvbiBnZXRBdXRob3JpemF0aW9uSGVhZGVyKHJlZnJlc2hUb2tlbikge1xyXG4gICAgcmV0dXJuIGAke0lOVEVSTkFMX0FVVEhfVkVSU0lPTn0gJHtyZWZyZXNoVG9rZW59YDtcclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5hc3luYyBmdW5jdGlvbiBjcmVhdGVJbnN0YWxsYXRpb25SZXF1ZXN0KHsgYXBwQ29uZmlnLCBoZWFydGJlYXRTZXJ2aWNlUHJvdmlkZXIgfSwgeyBmaWQgfSkge1xyXG4gICAgY29uc3QgZW5kcG9pbnQgPSBnZXRJbnN0YWxsYXRpb25zRW5kcG9pbnQoYXBwQ29uZmlnKTtcclxuICAgIGNvbnN0IGhlYWRlcnMgPSBnZXRIZWFkZXJzKGFwcENvbmZpZyk7XHJcbiAgICAvLyBJZiBoZWFydGJlYXQgc2VydmljZSBleGlzdHMsIGFkZCB0aGUgaGVhcnRiZWF0IHN0cmluZyB0byB0aGUgaGVhZGVyLlxyXG4gICAgY29uc3QgaGVhcnRiZWF0U2VydmljZSA9IGhlYXJ0YmVhdFNlcnZpY2VQcm92aWRlci5nZXRJbW1lZGlhdGUoe1xyXG4gICAgICAgIG9wdGlvbmFsOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIGlmIChoZWFydGJlYXRTZXJ2aWNlKSB7XHJcbiAgICAgICAgY29uc3QgaGVhcnRiZWF0c0hlYWRlciA9IGF3YWl0IGhlYXJ0YmVhdFNlcnZpY2UuZ2V0SGVhcnRiZWF0c0hlYWRlcigpO1xyXG4gICAgICAgIGlmIChoZWFydGJlYXRzSGVhZGVyKSB7XHJcbiAgICAgICAgICAgIGhlYWRlcnMuYXBwZW5kKCd4LWZpcmViYXNlLWNsaWVudCcsIGhlYXJ0YmVhdHNIZWFkZXIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGNvbnN0IGJvZHkgPSB7XHJcbiAgICAgICAgZmlkLFxyXG4gICAgICAgIGF1dGhWZXJzaW9uOiBJTlRFUk5BTF9BVVRIX1ZFUlNJT04sXHJcbiAgICAgICAgYXBwSWQ6IGFwcENvbmZpZy5hcHBJZCxcclxuICAgICAgICBzZGtWZXJzaW9uOiBQQUNLQUdFX1ZFUlNJT05cclxuICAgIH07XHJcbiAgICBjb25zdCByZXF1ZXN0ID0ge1xyXG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgIGhlYWRlcnMsXHJcbiAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoYm9keSlcclxuICAgIH07XHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHJldHJ5SWZTZXJ2ZXJFcnJvcigoKSA9PiBmZXRjaChlbmRwb2ludCwgcmVxdWVzdCkpO1xyXG4gICAgaWYgKHJlc3BvbnNlLm9rKSB7XHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2VWYWx1ZSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuICAgICAgICBjb25zdCByZWdpc3RlcmVkSW5zdGFsbGF0aW9uRW50cnkgPSB7XHJcbiAgICAgICAgICAgIGZpZDogcmVzcG9uc2VWYWx1ZS5maWQgfHwgZmlkLFxyXG4gICAgICAgICAgICByZWdpc3RyYXRpb25TdGF0dXM6IDIgLyogQ09NUExFVEVEICovLFxyXG4gICAgICAgICAgICByZWZyZXNoVG9rZW46IHJlc3BvbnNlVmFsdWUucmVmcmVzaFRva2VuLFxyXG4gICAgICAgICAgICBhdXRoVG9rZW46IGV4dHJhY3RBdXRoVG9rZW5JbmZvRnJvbVJlc3BvbnNlKHJlc3BvbnNlVmFsdWUuYXV0aFRva2VuKVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIHJlZ2lzdGVyZWRJbnN0YWxsYXRpb25FbnRyeTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHRocm93IGF3YWl0IGdldEVycm9yRnJvbVJlc3BvbnNlKCdDcmVhdGUgSW5zdGFsbGF0aW9uJywgcmVzcG9uc2UpO1xyXG4gICAgfVxyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbi8qKiBSZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIGFmdGVyIGdpdmVuIHRpbWUgcGFzc2VzLiAqL1xyXG5mdW5jdGlvbiBzbGVlcChtcykge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xyXG4gICAgICAgIHNldFRpbWVvdXQocmVzb2x2ZSwgbXMpO1xyXG4gICAgfSk7XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuZnVuY3Rpb24gYnVmZmVyVG9CYXNlNjRVcmxTYWZlKGFycmF5KSB7XHJcbiAgICBjb25zdCBiNjQgPSBidG9hKFN0cmluZy5mcm9tQ2hhckNvZGUoLi4uYXJyYXkpKTtcclxuICAgIHJldHVybiBiNjQucmVwbGFjZSgvXFwrL2csICctJykucmVwbGFjZSgvXFwvL2csICdfJyk7XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuY29uc3QgVkFMSURfRklEX1BBVFRFUk4gPSAvXltjZGVmXVtcXHctXXsyMX0kLztcclxuY29uc3QgSU5WQUxJRF9GSUQgPSAnJztcclxuLyoqXHJcbiAqIEdlbmVyYXRlcyBhIG5ldyBGSUQgdXNpbmcgcmFuZG9tIHZhbHVlcyBmcm9tIFdlYiBDcnlwdG8gQVBJLlxyXG4gKiBSZXR1cm5zIGFuIGVtcHR5IHN0cmluZyBpZiBGSUQgZ2VuZXJhdGlvbiBmYWlscyBmb3IgYW55IHJlYXNvbi5cclxuICovXHJcbmZ1bmN0aW9uIGdlbmVyYXRlRmlkKCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICAvLyBBIHZhbGlkIEZJRCBoYXMgZXhhY3RseSAyMiBiYXNlNjQgY2hhcmFjdGVycywgd2hpY2ggaXMgMTMyIGJpdHMsIG9yIDE2LjVcclxuICAgICAgICAvLyBieXRlcy4gb3VyIGltcGxlbWVudGF0aW9uIGdlbmVyYXRlcyBhIDE3IGJ5dGUgYXJyYXkgaW5zdGVhZC5cclxuICAgICAgICBjb25zdCBmaWRCeXRlQXJyYXkgPSBuZXcgVWludDhBcnJheSgxNyk7XHJcbiAgICAgICAgY29uc3QgY3J5cHRvID0gc2VsZi5jcnlwdG8gfHwgc2VsZi5tc0NyeXB0bztcclxuICAgICAgICBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKGZpZEJ5dGVBcnJheSk7XHJcbiAgICAgICAgLy8gUmVwbGFjZSB0aGUgZmlyc3QgNCByYW5kb20gYml0cyB3aXRoIHRoZSBjb25zdGFudCBGSUQgaGVhZGVyIG9mIDBiMDExMS5cclxuICAgICAgICBmaWRCeXRlQXJyYXlbMF0gPSAwYjAxMTEwMDAwICsgKGZpZEJ5dGVBcnJheVswXSAlIDBiMDAwMTAwMDApO1xyXG4gICAgICAgIGNvbnN0IGZpZCA9IGVuY29kZShmaWRCeXRlQXJyYXkpO1xyXG4gICAgICAgIHJldHVybiBWQUxJRF9GSURfUEFUVEVSTi50ZXN0KGZpZCkgPyBmaWQgOiBJTlZBTElEX0ZJRDtcclxuICAgIH1cclxuICAgIGNhdGNoIChfYSkge1xyXG4gICAgICAgIC8vIEZJRCBnZW5lcmF0aW9uIGVycm9yZWRcclxuICAgICAgICByZXR1cm4gSU5WQUxJRF9GSUQ7XHJcbiAgICB9XHJcbn1cclxuLyoqIENvbnZlcnRzIGEgRklEIFVpbnQ4QXJyYXkgdG8gYSBiYXNlNjQgc3RyaW5nIHJlcHJlc2VudGF0aW9uLiAqL1xyXG5mdW5jdGlvbiBlbmNvZGUoZmlkQnl0ZUFycmF5KSB7XHJcbiAgICBjb25zdCBiNjRTdHJpbmcgPSBidWZmZXJUb0Jhc2U2NFVybFNhZmUoZmlkQnl0ZUFycmF5KTtcclxuICAgIC8vIFJlbW92ZSB0aGUgMjNyZCBjaGFyYWN0ZXIgdGhhdCB3YXMgYWRkZWQgYmVjYXVzZSBvZiB0aGUgZXh0cmEgNCBiaXRzIGF0IHRoZVxyXG4gICAgLy8gZW5kIG9mIG91ciAxNyBieXRlIGFycmF5LCBhbmQgdGhlICc9JyBwYWRkaW5nLlxyXG4gICAgcmV0dXJuIGI2NFN0cmluZy5zdWJzdHIoMCwgMjIpO1xyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbi8qKiBSZXR1cm5zIGEgc3RyaW5nIGtleSB0aGF0IGNhbiBiZSB1c2VkIHRvIGlkZW50aWZ5IHRoZSBhcHAuICovXHJcbmZ1bmN0aW9uIGdldEtleShhcHBDb25maWcpIHtcclxuICAgIHJldHVybiBgJHthcHBDb25maWcuYXBwTmFtZX0hJHthcHBDb25maWcuYXBwSWR9YDtcclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5jb25zdCBmaWRDaGFuZ2VDYWxsYmFja3MgPSBuZXcgTWFwKCk7XHJcbi8qKlxyXG4gKiBDYWxscyB0aGUgb25JZENoYW5nZSBjYWxsYmFja3Mgd2l0aCB0aGUgbmV3IEZJRCB2YWx1ZSwgYW5kIGJyb2FkY2FzdHMgdGhlXHJcbiAqIGNoYW5nZSB0byBvdGhlciB0YWJzLlxyXG4gKi9cclxuZnVuY3Rpb24gZmlkQ2hhbmdlZChhcHBDb25maWcsIGZpZCkge1xyXG4gICAgY29uc3Qga2V5ID0gZ2V0S2V5KGFwcENvbmZpZyk7XHJcbiAgICBjYWxsRmlkQ2hhbmdlQ2FsbGJhY2tzKGtleSwgZmlkKTtcclxuICAgIGJyb2FkY2FzdEZpZENoYW5nZShrZXksIGZpZCk7XHJcbn1cclxuZnVuY3Rpb24gYWRkQ2FsbGJhY2soYXBwQ29uZmlnLCBjYWxsYmFjaykge1xyXG4gICAgLy8gT3BlbiB0aGUgYnJvYWRjYXN0IGNoYW5uZWwgaWYgaXQncyBub3QgYWxyZWFkeSBvcGVuLFxyXG4gICAgLy8gdG8gYmUgYWJsZSB0byBsaXN0ZW4gdG8gY2hhbmdlIGV2ZW50cyBmcm9tIG90aGVyIHRhYnMuXHJcbiAgICBnZXRCcm9hZGNhc3RDaGFubmVsKCk7XHJcbiAgICBjb25zdCBrZXkgPSBnZXRLZXkoYXBwQ29uZmlnKTtcclxuICAgIGxldCBjYWxsYmFja1NldCA9IGZpZENoYW5nZUNhbGxiYWNrcy5nZXQoa2V5KTtcclxuICAgIGlmICghY2FsbGJhY2tTZXQpIHtcclxuICAgICAgICBjYWxsYmFja1NldCA9IG5ldyBTZXQoKTtcclxuICAgICAgICBmaWRDaGFuZ2VDYWxsYmFja3Muc2V0KGtleSwgY2FsbGJhY2tTZXQpO1xyXG4gICAgfVxyXG4gICAgY2FsbGJhY2tTZXQuYWRkKGNhbGxiYWNrKTtcclxufVxyXG5mdW5jdGlvbiByZW1vdmVDYWxsYmFjayhhcHBDb25maWcsIGNhbGxiYWNrKSB7XHJcbiAgICBjb25zdCBrZXkgPSBnZXRLZXkoYXBwQ29uZmlnKTtcclxuICAgIGNvbnN0IGNhbGxiYWNrU2V0ID0gZmlkQ2hhbmdlQ2FsbGJhY2tzLmdldChrZXkpO1xyXG4gICAgaWYgKCFjYWxsYmFja1NldCkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGNhbGxiYWNrU2V0LmRlbGV0ZShjYWxsYmFjayk7XHJcbiAgICBpZiAoY2FsbGJhY2tTZXQuc2l6ZSA9PT0gMCkge1xyXG4gICAgICAgIGZpZENoYW5nZUNhbGxiYWNrcy5kZWxldGUoa2V5KTtcclxuICAgIH1cclxuICAgIC8vIENsb3NlIGJyb2FkY2FzdCBjaGFubmVsIGlmIHRoZXJlIGFyZSBubyBtb3JlIGNhbGxiYWNrcy5cclxuICAgIGNsb3NlQnJvYWRjYXN0Q2hhbm5lbCgpO1xyXG59XHJcbmZ1bmN0aW9uIGNhbGxGaWRDaGFuZ2VDYWxsYmFja3Moa2V5LCBmaWQpIHtcclxuICAgIGNvbnN0IGNhbGxiYWNrcyA9IGZpZENoYW5nZUNhbGxiYWNrcy5nZXQoa2V5KTtcclxuICAgIGlmICghY2FsbGJhY2tzKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgZm9yIChjb25zdCBjYWxsYmFjayBvZiBjYWxsYmFja3MpIHtcclxuICAgICAgICBjYWxsYmFjayhmaWQpO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIGJyb2FkY2FzdEZpZENoYW5nZShrZXksIGZpZCkge1xyXG4gICAgY29uc3QgY2hhbm5lbCA9IGdldEJyb2FkY2FzdENoYW5uZWwoKTtcclxuICAgIGlmIChjaGFubmVsKSB7XHJcbiAgICAgICAgY2hhbm5lbC5wb3N0TWVzc2FnZSh7IGtleSwgZmlkIH0pO1xyXG4gICAgfVxyXG4gICAgY2xvc2VCcm9hZGNhc3RDaGFubmVsKCk7XHJcbn1cclxubGV0IGJyb2FkY2FzdENoYW5uZWwgPSBudWxsO1xyXG4vKiogT3BlbnMgYW5kIHJldHVybnMgYSBCcm9hZGNhc3RDaGFubmVsIGlmIGl0IGlzIHN1cHBvcnRlZCBieSB0aGUgYnJvd3Nlci4gKi9cclxuZnVuY3Rpb24gZ2V0QnJvYWRjYXN0Q2hhbm5lbCgpIHtcclxuICAgIGlmICghYnJvYWRjYXN0Q2hhbm5lbCAmJiAnQnJvYWRjYXN0Q2hhbm5lbCcgaW4gc2VsZikge1xyXG4gICAgICAgIGJyb2FkY2FzdENoYW5uZWwgPSBuZXcgQnJvYWRjYXN0Q2hhbm5lbCgnW0ZpcmViYXNlXSBGSUQgQ2hhbmdlJyk7XHJcbiAgICAgICAgYnJvYWRjYXN0Q2hhbm5lbC5vbm1lc3NhZ2UgPSBlID0+IHtcclxuICAgICAgICAgICAgY2FsbEZpZENoYW5nZUNhbGxiYWNrcyhlLmRhdGEua2V5LCBlLmRhdGEuZmlkKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGJyb2FkY2FzdENoYW5uZWw7XHJcbn1cclxuZnVuY3Rpb24gY2xvc2VCcm9hZGNhc3RDaGFubmVsKCkge1xyXG4gICAgaWYgKGZpZENoYW5nZUNhbGxiYWNrcy5zaXplID09PSAwICYmIGJyb2FkY2FzdENoYW5uZWwpIHtcclxuICAgICAgICBicm9hZGNhc3RDaGFubmVsLmNsb3NlKCk7XHJcbiAgICAgICAgYnJvYWRjYXN0Q2hhbm5lbCA9IG51bGw7XHJcbiAgICB9XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuY29uc3QgREFUQUJBU0VfTkFNRSA9ICdmaXJlYmFzZS1pbnN0YWxsYXRpb25zLWRhdGFiYXNlJztcclxuY29uc3QgREFUQUJBU0VfVkVSU0lPTiA9IDE7XHJcbmNvbnN0IE9CSkVDVF9TVE9SRV9OQU1FID0gJ2ZpcmViYXNlLWluc3RhbGxhdGlvbnMtc3RvcmUnO1xyXG5sZXQgZGJQcm9taXNlID0gbnVsbDtcclxuZnVuY3Rpb24gZ2V0RGJQcm9taXNlKCkge1xyXG4gICAgaWYgKCFkYlByb21pc2UpIHtcclxuICAgICAgICBkYlByb21pc2UgPSBvcGVuREIoREFUQUJBU0VfTkFNRSwgREFUQUJBU0VfVkVSU0lPTiwge1xyXG4gICAgICAgICAgICB1cGdyYWRlOiAoZGIsIG9sZFZlcnNpb24pID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIFdlIGRvbid0IHVzZSAnYnJlYWsnIGluIHRoaXMgc3dpdGNoIHN0YXRlbWVudCwgdGhlIGZhbGwtdGhyb3VnaFxyXG4gICAgICAgICAgICAgICAgLy8gYmVoYXZpb3IgaXMgd2hhdCB3ZSB3YW50LCBiZWNhdXNlIGlmIHRoZXJlIGFyZSBtdWx0aXBsZSB2ZXJzaW9ucyBiZXR3ZWVuXHJcbiAgICAgICAgICAgICAgICAvLyB0aGUgb2xkIHZlcnNpb24gYW5kIHRoZSBjdXJyZW50IHZlcnNpb24sIHdlIHdhbnQgQUxMIHRoZSBtaWdyYXRpb25zXHJcbiAgICAgICAgICAgICAgICAvLyB0aGF0IGNvcnJlc3BvbmQgdG8gdGhvc2UgdmVyc2lvbnMgdG8gcnVuLCBub3Qgb25seSB0aGUgbGFzdCBvbmUuXHJcbiAgICAgICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZGVmYXVsdC1jYXNlXHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKG9sZFZlcnNpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRiLmNyZWF0ZU9iamVjdFN0b3JlKE9CSkVDVF9TVE9SRV9OQU1FKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGRiUHJvbWlzZTtcclxufVxyXG4vKiogQXNzaWducyBvciBvdmVyd3JpdGVzIHRoZSByZWNvcmQgZm9yIHRoZSBnaXZlbiBrZXkgd2l0aCB0aGUgZ2l2ZW4gdmFsdWUuICovXHJcbmFzeW5jIGZ1bmN0aW9uIHNldChhcHBDb25maWcsIHZhbHVlKSB7XHJcbiAgICBjb25zdCBrZXkgPSBnZXRLZXkoYXBwQ29uZmlnKTtcclxuICAgIGNvbnN0IGRiID0gYXdhaXQgZ2V0RGJQcm9taXNlKCk7XHJcbiAgICBjb25zdCB0eCA9IGRiLnRyYW5zYWN0aW9uKE9CSkVDVF9TVE9SRV9OQU1FLCAncmVhZHdyaXRlJyk7XHJcbiAgICBjb25zdCBvYmplY3RTdG9yZSA9IHR4Lm9iamVjdFN0b3JlKE9CSkVDVF9TVE9SRV9OQU1FKTtcclxuICAgIGNvbnN0IG9sZFZhbHVlID0gKGF3YWl0IG9iamVjdFN0b3JlLmdldChrZXkpKTtcclxuICAgIGF3YWl0IG9iamVjdFN0b3JlLnB1dCh2YWx1ZSwga2V5KTtcclxuICAgIGF3YWl0IHR4LmRvbmU7XHJcbiAgICBpZiAoIW9sZFZhbHVlIHx8IG9sZFZhbHVlLmZpZCAhPT0gdmFsdWUuZmlkKSB7XHJcbiAgICAgICAgZmlkQ2hhbmdlZChhcHBDb25maWcsIHZhbHVlLmZpZCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdmFsdWU7XHJcbn1cclxuLyoqIFJlbW92ZXMgcmVjb3JkKHMpIGZyb20gdGhlIG9iamVjdFN0b3JlIHRoYXQgbWF0Y2ggdGhlIGdpdmVuIGtleS4gKi9cclxuYXN5bmMgZnVuY3Rpb24gcmVtb3ZlKGFwcENvbmZpZykge1xyXG4gICAgY29uc3Qga2V5ID0gZ2V0S2V5KGFwcENvbmZpZyk7XHJcbiAgICBjb25zdCBkYiA9IGF3YWl0IGdldERiUHJvbWlzZSgpO1xyXG4gICAgY29uc3QgdHggPSBkYi50cmFuc2FjdGlvbihPQkpFQ1RfU1RPUkVfTkFNRSwgJ3JlYWR3cml0ZScpO1xyXG4gICAgYXdhaXQgdHgub2JqZWN0U3RvcmUoT0JKRUNUX1NUT1JFX05BTUUpLmRlbGV0ZShrZXkpO1xyXG4gICAgYXdhaXQgdHguZG9uZTtcclxufVxyXG4vKipcclxuICogQXRvbWljYWxseSB1cGRhdGVzIGEgcmVjb3JkIHdpdGggdGhlIHJlc3VsdCBvZiB1cGRhdGVGbiwgd2hpY2ggZ2V0c1xyXG4gKiBjYWxsZWQgd2l0aCB0aGUgY3VycmVudCB2YWx1ZS4gSWYgbmV3VmFsdWUgaXMgdW5kZWZpbmVkLCB0aGUgcmVjb3JkIGlzXHJcbiAqIGRlbGV0ZWQgaW5zdGVhZC5cclxuICogQHJldHVybiBVcGRhdGVkIHZhbHVlXHJcbiAqL1xyXG5hc3luYyBmdW5jdGlvbiB1cGRhdGUoYXBwQ29uZmlnLCB1cGRhdGVGbikge1xyXG4gICAgY29uc3Qga2V5ID0gZ2V0S2V5KGFwcENvbmZpZyk7XHJcbiAgICBjb25zdCBkYiA9IGF3YWl0IGdldERiUHJvbWlzZSgpO1xyXG4gICAgY29uc3QgdHggPSBkYi50cmFuc2FjdGlvbihPQkpFQ1RfU1RPUkVfTkFNRSwgJ3JlYWR3cml0ZScpO1xyXG4gICAgY29uc3Qgc3RvcmUgPSB0eC5vYmplY3RTdG9yZShPQkpFQ1RfU1RPUkVfTkFNRSk7XHJcbiAgICBjb25zdCBvbGRWYWx1ZSA9IChhd2FpdCBzdG9yZS5nZXQoa2V5KSk7XHJcbiAgICBjb25zdCBuZXdWYWx1ZSA9IHVwZGF0ZUZuKG9sZFZhbHVlKTtcclxuICAgIGlmIChuZXdWYWx1ZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgYXdhaXQgc3RvcmUuZGVsZXRlKGtleSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBhd2FpdCBzdG9yZS5wdXQobmV3VmFsdWUsIGtleSk7XHJcbiAgICB9XHJcbiAgICBhd2FpdCB0eC5kb25lO1xyXG4gICAgaWYgKG5ld1ZhbHVlICYmICghb2xkVmFsdWUgfHwgb2xkVmFsdWUuZmlkICE9PSBuZXdWYWx1ZS5maWQpKSB7XHJcbiAgICAgICAgZmlkQ2hhbmdlZChhcHBDb25maWcsIG5ld1ZhbHVlLmZpZCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbmV3VmFsdWU7XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqXHJcbiAqIFVwZGF0ZXMgYW5kIHJldHVybnMgdGhlIEluc3RhbGxhdGlvbkVudHJ5IGZyb20gdGhlIGRhdGFiYXNlLlxyXG4gKiBBbHNvIHRyaWdnZXJzIGEgcmVnaXN0cmF0aW9uIHJlcXVlc3QgaWYgaXQgaXMgbmVjZXNzYXJ5IGFuZCBwb3NzaWJsZS5cclxuICovXHJcbmFzeW5jIGZ1bmN0aW9uIGdldEluc3RhbGxhdGlvbkVudHJ5KGluc3RhbGxhdGlvbnMpIHtcclxuICAgIGxldCByZWdpc3RyYXRpb25Qcm9taXNlO1xyXG4gICAgY29uc3QgaW5zdGFsbGF0aW9uRW50cnkgPSBhd2FpdCB1cGRhdGUoaW5zdGFsbGF0aW9ucy5hcHBDb25maWcsIG9sZEVudHJ5ID0+IHtcclxuICAgICAgICBjb25zdCBpbnN0YWxsYXRpb25FbnRyeSA9IHVwZGF0ZU9yQ3JlYXRlSW5zdGFsbGF0aW9uRW50cnkob2xkRW50cnkpO1xyXG4gICAgICAgIGNvbnN0IGVudHJ5V2l0aFByb21pc2UgPSB0cmlnZ2VyUmVnaXN0cmF0aW9uSWZOZWNlc3NhcnkoaW5zdGFsbGF0aW9ucywgaW5zdGFsbGF0aW9uRW50cnkpO1xyXG4gICAgICAgIHJlZ2lzdHJhdGlvblByb21pc2UgPSBlbnRyeVdpdGhQcm9taXNlLnJlZ2lzdHJhdGlvblByb21pc2U7XHJcbiAgICAgICAgcmV0dXJuIGVudHJ5V2l0aFByb21pc2UuaW5zdGFsbGF0aW9uRW50cnk7XHJcbiAgICB9KTtcclxuICAgIGlmIChpbnN0YWxsYXRpb25FbnRyeS5maWQgPT09IElOVkFMSURfRklEKSB7XHJcbiAgICAgICAgLy8gRklEIGdlbmVyYXRpb24gZmFpbGVkLiBXYWl0aW5nIGZvciB0aGUgRklEIGZyb20gdGhlIHNlcnZlci5cclxuICAgICAgICByZXR1cm4geyBpbnN0YWxsYXRpb25FbnRyeTogYXdhaXQgcmVnaXN0cmF0aW9uUHJvbWlzZSB9O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBpbnN0YWxsYXRpb25FbnRyeSxcclxuICAgICAgICByZWdpc3RyYXRpb25Qcm9taXNlXHJcbiAgICB9O1xyXG59XHJcbi8qKlxyXG4gKiBDcmVhdGVzIGEgbmV3IEluc3RhbGxhdGlvbiBFbnRyeSBpZiBvbmUgZG9lcyBub3QgZXhpc3QuXHJcbiAqIEFsc28gY2xlYXJzIHRpbWVkIG91dCBwZW5kaW5nIHJlcXVlc3RzLlxyXG4gKi9cclxuZnVuY3Rpb24gdXBkYXRlT3JDcmVhdGVJbnN0YWxsYXRpb25FbnRyeShvbGRFbnRyeSkge1xyXG4gICAgY29uc3QgZW50cnkgPSBvbGRFbnRyeSB8fCB7XHJcbiAgICAgICAgZmlkOiBnZW5lcmF0ZUZpZCgpLFxyXG4gICAgICAgIHJlZ2lzdHJhdGlvblN0YXR1czogMCAvKiBOT1RfU1RBUlRFRCAqL1xyXG4gICAgfTtcclxuICAgIHJldHVybiBjbGVhclRpbWVkT3V0UmVxdWVzdChlbnRyeSk7XHJcbn1cclxuLyoqXHJcbiAqIElmIHRoZSBGaXJlYmFzZSBJbnN0YWxsYXRpb24gaXMgbm90IHJlZ2lzdGVyZWQgeWV0LCB0aGlzIHdpbGwgdHJpZ2dlciB0aGVcclxuICogcmVnaXN0cmF0aW9uIGFuZCByZXR1cm4gYW4gSW5Qcm9ncmVzc0luc3RhbGxhdGlvbkVudHJ5LlxyXG4gKlxyXG4gKiBJZiByZWdpc3RyYXRpb25Qcm9taXNlIGRvZXMgbm90IGV4aXN0LCB0aGUgaW5zdGFsbGF0aW9uRW50cnkgaXMgZ3VhcmFudGVlZFxyXG4gKiB0byBiZSByZWdpc3RlcmVkLlxyXG4gKi9cclxuZnVuY3Rpb24gdHJpZ2dlclJlZ2lzdHJhdGlvbklmTmVjZXNzYXJ5KGluc3RhbGxhdGlvbnMsIGluc3RhbGxhdGlvbkVudHJ5KSB7XHJcbiAgICBpZiAoaW5zdGFsbGF0aW9uRW50cnkucmVnaXN0cmF0aW9uU3RhdHVzID09PSAwIC8qIE5PVF9TVEFSVEVEICovKSB7XHJcbiAgICAgICAgaWYgKCFuYXZpZ2F0b3Iub25MaW5lKSB7XHJcbiAgICAgICAgICAgIC8vIFJlZ2lzdHJhdGlvbiByZXF1aXJlZCBidXQgYXBwIGlzIG9mZmxpbmUuXHJcbiAgICAgICAgICAgIGNvbnN0IHJlZ2lzdHJhdGlvblByb21pc2VXaXRoRXJyb3IgPSBQcm9taXNlLnJlamVjdChFUlJPUl9GQUNUT1JZLmNyZWF0ZShcImFwcC1vZmZsaW5lXCIgLyogQVBQX09GRkxJTkUgKi8pKTtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIGluc3RhbGxhdGlvbkVudHJ5LFxyXG4gICAgICAgICAgICAgICAgcmVnaXN0cmF0aW9uUHJvbWlzZTogcmVnaXN0cmF0aW9uUHJvbWlzZVdpdGhFcnJvclxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBUcnkgcmVnaXN0ZXJpbmcuIENoYW5nZSBzdGF0dXMgdG8gSU5fUFJPR1JFU1MuXHJcbiAgICAgICAgY29uc3QgaW5Qcm9ncmVzc0VudHJ5ID0ge1xyXG4gICAgICAgICAgICBmaWQ6IGluc3RhbGxhdGlvbkVudHJ5LmZpZCxcclxuICAgICAgICAgICAgcmVnaXN0cmF0aW9uU3RhdHVzOiAxIC8qIElOX1BST0dSRVNTICovLFxyXG4gICAgICAgICAgICByZWdpc3RyYXRpb25UaW1lOiBEYXRlLm5vdygpXHJcbiAgICAgICAgfTtcclxuICAgICAgICBjb25zdCByZWdpc3RyYXRpb25Qcm9taXNlID0gcmVnaXN0ZXJJbnN0YWxsYXRpb24oaW5zdGFsbGF0aW9ucywgaW5Qcm9ncmVzc0VudHJ5KTtcclxuICAgICAgICByZXR1cm4geyBpbnN0YWxsYXRpb25FbnRyeTogaW5Qcm9ncmVzc0VudHJ5LCByZWdpc3RyYXRpb25Qcm9taXNlIH07XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChpbnN0YWxsYXRpb25FbnRyeS5yZWdpc3RyYXRpb25TdGF0dXMgPT09IDEgLyogSU5fUFJPR1JFU1MgKi8pIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBpbnN0YWxsYXRpb25FbnRyeSxcclxuICAgICAgICAgICAgcmVnaXN0cmF0aW9uUHJvbWlzZTogd2FpdFVudGlsRmlkUmVnaXN0cmF0aW9uKGluc3RhbGxhdGlvbnMpXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHJldHVybiB7IGluc3RhbGxhdGlvbkVudHJ5IH07XHJcbiAgICB9XHJcbn1cclxuLyoqIFRoaXMgd2lsbCBiZSBleGVjdXRlZCBvbmx5IG9uY2UgZm9yIGVhY2ggbmV3IEZpcmViYXNlIEluc3RhbGxhdGlvbi4gKi9cclxuYXN5bmMgZnVuY3Rpb24gcmVnaXN0ZXJJbnN0YWxsYXRpb24oaW5zdGFsbGF0aW9ucywgaW5zdGFsbGF0aW9uRW50cnkpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgcmVnaXN0ZXJlZEluc3RhbGxhdGlvbkVudHJ5ID0gYXdhaXQgY3JlYXRlSW5zdGFsbGF0aW9uUmVxdWVzdChpbnN0YWxsYXRpb25zLCBpbnN0YWxsYXRpb25FbnRyeSk7XHJcbiAgICAgICAgcmV0dXJuIHNldChpbnN0YWxsYXRpb25zLmFwcENvbmZpZywgcmVnaXN0ZXJlZEluc3RhbGxhdGlvbkVudHJ5KTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgaWYgKGlzU2VydmVyRXJyb3IoZSkgJiYgZS5jdXN0b21EYXRhLnNlcnZlckNvZGUgPT09IDQwOSkge1xyXG4gICAgICAgICAgICAvLyBTZXJ2ZXIgcmV0dXJuZWQgYSBcIkZJRCBjYW4gbm90IGJlIHVzZWRcIiBlcnJvci5cclxuICAgICAgICAgICAgLy8gR2VuZXJhdGUgYSBuZXcgSUQgbmV4dCB0aW1lLlxyXG4gICAgICAgICAgICBhd2FpdCByZW1vdmUoaW5zdGFsbGF0aW9ucy5hcHBDb25maWcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgLy8gUmVnaXN0cmF0aW9uIGZhaWxlZC4gU2V0IEZJRCBhcyBub3QgcmVnaXN0ZXJlZC5cclxuICAgICAgICAgICAgYXdhaXQgc2V0KGluc3RhbGxhdGlvbnMuYXBwQ29uZmlnLCB7XHJcbiAgICAgICAgICAgICAgICBmaWQ6IGluc3RhbGxhdGlvbkVudHJ5LmZpZCxcclxuICAgICAgICAgICAgICAgIHJlZ2lzdHJhdGlvblN0YXR1czogMCAvKiBOT1RfU1RBUlRFRCAqL1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhyb3cgZTtcclxuICAgIH1cclxufVxyXG4vKiogQ2FsbCBpZiBGSUQgcmVnaXN0cmF0aW9uIGlzIHBlbmRpbmcgaW4gYW5vdGhlciByZXF1ZXN0LiAqL1xyXG5hc3luYyBmdW5jdGlvbiB3YWl0VW50aWxGaWRSZWdpc3RyYXRpb24oaW5zdGFsbGF0aW9ucykge1xyXG4gICAgLy8gVW5mb3J0dW5hdGVseSwgdGhlcmUgaXMgbm8gd2F5IG9mIHJlbGlhYmx5IG9ic2VydmluZyB3aGVuIGEgdmFsdWUgaW5cclxuICAgIC8vIEluZGV4ZWREQiBjaGFuZ2VzICh5ZXQsIHNlZSBodHRwczovL2dpdGh1Yi5jb20vV0lDRy9pbmRleGVkLWRiLW9ic2VydmVycyksXHJcbiAgICAvLyBzbyB3ZSBuZWVkIHRvIHBvbGwuXHJcbiAgICBsZXQgZW50cnkgPSBhd2FpdCB1cGRhdGVJbnN0YWxsYXRpb25SZXF1ZXN0KGluc3RhbGxhdGlvbnMuYXBwQ29uZmlnKTtcclxuICAgIHdoaWxlIChlbnRyeS5yZWdpc3RyYXRpb25TdGF0dXMgPT09IDEgLyogSU5fUFJPR1JFU1MgKi8pIHtcclxuICAgICAgICAvLyBjcmVhdGVJbnN0YWxsYXRpb24gcmVxdWVzdCBzdGlsbCBpbiBwcm9ncmVzcy5cclxuICAgICAgICBhd2FpdCBzbGVlcCgxMDApO1xyXG4gICAgICAgIGVudHJ5ID0gYXdhaXQgdXBkYXRlSW5zdGFsbGF0aW9uUmVxdWVzdChpbnN0YWxsYXRpb25zLmFwcENvbmZpZyk7XHJcbiAgICB9XHJcbiAgICBpZiAoZW50cnkucmVnaXN0cmF0aW9uU3RhdHVzID09PSAwIC8qIE5PVF9TVEFSVEVEICovKSB7XHJcbiAgICAgICAgLy8gVGhlIHJlcXVlc3QgdGltZWQgb3V0IG9yIGZhaWxlZCBpbiBhIGRpZmZlcmVudCBjYWxsLiBUcnkgYWdhaW4uXHJcbiAgICAgICAgY29uc3QgeyBpbnN0YWxsYXRpb25FbnRyeSwgcmVnaXN0cmF0aW9uUHJvbWlzZSB9ID0gYXdhaXQgZ2V0SW5zdGFsbGF0aW9uRW50cnkoaW5zdGFsbGF0aW9ucyk7XHJcbiAgICAgICAgaWYgKHJlZ2lzdHJhdGlvblByb21pc2UpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlZ2lzdHJhdGlvblByb21pc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBpZiB0aGVyZSBpcyBubyByZWdpc3RyYXRpb25Qcm9taXNlLCBlbnRyeSBpcyByZWdpc3RlcmVkLlxyXG4gICAgICAgICAgICByZXR1cm4gaW5zdGFsbGF0aW9uRW50cnk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGVudHJ5O1xyXG59XHJcbi8qKlxyXG4gKiBDYWxsZWQgb25seSBpZiB0aGVyZSBpcyBhIENyZWF0ZUluc3RhbGxhdGlvbiByZXF1ZXN0IGluIHByb2dyZXNzLlxyXG4gKlxyXG4gKiBVcGRhdGVzIHRoZSBJbnN0YWxsYXRpb25FbnRyeSBpbiB0aGUgREIgYmFzZWQgb24gdGhlIHN0YXR1cyBvZiB0aGVcclxuICogQ3JlYXRlSW5zdGFsbGF0aW9uIHJlcXVlc3QuXHJcbiAqXHJcbiAqIFJldHVybnMgdGhlIHVwZGF0ZWQgSW5zdGFsbGF0aW9uRW50cnkuXHJcbiAqL1xyXG5mdW5jdGlvbiB1cGRhdGVJbnN0YWxsYXRpb25SZXF1ZXN0KGFwcENvbmZpZykge1xyXG4gICAgcmV0dXJuIHVwZGF0ZShhcHBDb25maWcsIG9sZEVudHJ5ID0+IHtcclxuICAgICAgICBpZiAoIW9sZEVudHJ5KSB7XHJcbiAgICAgICAgICAgIHRocm93IEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKFwiaW5zdGFsbGF0aW9uLW5vdC1mb3VuZFwiIC8qIElOU1RBTExBVElPTl9OT1RfRk9VTkQgKi8pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY2xlYXJUaW1lZE91dFJlcXVlc3Qob2xkRW50cnkpO1xyXG4gICAgfSk7XHJcbn1cclxuZnVuY3Rpb24gY2xlYXJUaW1lZE91dFJlcXVlc3QoZW50cnkpIHtcclxuICAgIGlmIChoYXNJbnN0YWxsYXRpb25SZXF1ZXN0VGltZWRPdXQoZW50cnkpKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgZmlkOiBlbnRyeS5maWQsXHJcbiAgICAgICAgICAgIHJlZ2lzdHJhdGlvblN0YXR1czogMCAvKiBOT1RfU1RBUlRFRCAqL1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZW50cnk7XHJcbn1cclxuZnVuY3Rpb24gaGFzSW5zdGFsbGF0aW9uUmVxdWVzdFRpbWVkT3V0KGluc3RhbGxhdGlvbkVudHJ5KSB7XHJcbiAgICByZXR1cm4gKGluc3RhbGxhdGlvbkVudHJ5LnJlZ2lzdHJhdGlvblN0YXR1cyA9PT0gMSAvKiBJTl9QUk9HUkVTUyAqLyAmJlxyXG4gICAgICAgIGluc3RhbGxhdGlvbkVudHJ5LnJlZ2lzdHJhdGlvblRpbWUgKyBQRU5ESU5HX1RJTUVPVVRfTVMgPCBEYXRlLm5vdygpKTtcclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5hc3luYyBmdW5jdGlvbiBnZW5lcmF0ZUF1dGhUb2tlblJlcXVlc3QoeyBhcHBDb25maWcsIGhlYXJ0YmVhdFNlcnZpY2VQcm92aWRlciB9LCBpbnN0YWxsYXRpb25FbnRyeSkge1xyXG4gICAgY29uc3QgZW5kcG9pbnQgPSBnZXRHZW5lcmF0ZUF1dGhUb2tlbkVuZHBvaW50KGFwcENvbmZpZywgaW5zdGFsbGF0aW9uRW50cnkpO1xyXG4gICAgY29uc3QgaGVhZGVycyA9IGdldEhlYWRlcnNXaXRoQXV0aChhcHBDb25maWcsIGluc3RhbGxhdGlvbkVudHJ5KTtcclxuICAgIC8vIElmIGhlYXJ0YmVhdCBzZXJ2aWNlIGV4aXN0cywgYWRkIHRoZSBoZWFydGJlYXQgc3RyaW5nIHRvIHRoZSBoZWFkZXIuXHJcbiAgICBjb25zdCBoZWFydGJlYXRTZXJ2aWNlID0gaGVhcnRiZWF0U2VydmljZVByb3ZpZGVyLmdldEltbWVkaWF0ZSh7XHJcbiAgICAgICAgb3B0aW9uYWw6IHRydWVcclxuICAgIH0pO1xyXG4gICAgaWYgKGhlYXJ0YmVhdFNlcnZpY2UpIHtcclxuICAgICAgICBjb25zdCBoZWFydGJlYXRzSGVhZGVyID0gYXdhaXQgaGVhcnRiZWF0U2VydmljZS5nZXRIZWFydGJlYXRzSGVhZGVyKCk7XHJcbiAgICAgICAgaWYgKGhlYXJ0YmVhdHNIZWFkZXIpIHtcclxuICAgICAgICAgICAgaGVhZGVycy5hcHBlbmQoJ3gtZmlyZWJhc2UtY2xpZW50JywgaGVhcnRiZWF0c0hlYWRlcik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgY29uc3QgYm9keSA9IHtcclxuICAgICAgICBpbnN0YWxsYXRpb246IHtcclxuICAgICAgICAgICAgc2RrVmVyc2lvbjogUEFDS0FHRV9WRVJTSU9OLFxyXG4gICAgICAgICAgICBhcHBJZDogYXBwQ29uZmlnLmFwcElkXHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIGNvbnN0IHJlcXVlc3QgPSB7XHJcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgaGVhZGVycyxcclxuICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShib2R5KVxyXG4gICAgfTtcclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgcmV0cnlJZlNlcnZlckVycm9yKCgpID0+IGZldGNoKGVuZHBvaW50LCByZXF1ZXN0KSk7XHJcbiAgICBpZiAocmVzcG9uc2Uub2spIHtcclxuICAgICAgICBjb25zdCByZXNwb25zZVZhbHVlID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG4gICAgICAgIGNvbnN0IGNvbXBsZXRlZEF1dGhUb2tlbiA9IGV4dHJhY3RBdXRoVG9rZW5JbmZvRnJvbVJlc3BvbnNlKHJlc3BvbnNlVmFsdWUpO1xyXG4gICAgICAgIHJldHVybiBjb21wbGV0ZWRBdXRoVG9rZW47XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICB0aHJvdyBhd2FpdCBnZXRFcnJvckZyb21SZXNwb25zZSgnR2VuZXJhdGUgQXV0aCBUb2tlbicsIHJlc3BvbnNlKTtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBnZXRHZW5lcmF0ZUF1dGhUb2tlbkVuZHBvaW50KGFwcENvbmZpZywgeyBmaWQgfSkge1xyXG4gICAgcmV0dXJuIGAke2dldEluc3RhbGxhdGlvbnNFbmRwb2ludChhcHBDb25maWcpfS8ke2ZpZH0vYXV0aFRva2VuczpnZW5lcmF0ZWA7XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqXHJcbiAqIFJldHVybnMgYSB2YWxpZCBhdXRoZW50aWNhdGlvbiB0b2tlbiBmb3IgdGhlIGluc3RhbGxhdGlvbi4gR2VuZXJhdGVzIGEgbmV3XHJcbiAqIHRva2VuIGlmIG9uZSBkb2Vzbid0IGV4aXN0LCBpcyBleHBpcmVkIG9yIGFib3V0IHRvIGV4cGlyZS5cclxuICpcclxuICogU2hvdWxkIG9ubHkgYmUgY2FsbGVkIGlmIHRoZSBGaXJlYmFzZSBJbnN0YWxsYXRpb24gaXMgcmVnaXN0ZXJlZC5cclxuICovXHJcbmFzeW5jIGZ1bmN0aW9uIHJlZnJlc2hBdXRoVG9rZW4oaW5zdGFsbGF0aW9ucywgZm9yY2VSZWZyZXNoID0gZmFsc2UpIHtcclxuICAgIGxldCB0b2tlblByb21pc2U7XHJcbiAgICBjb25zdCBlbnRyeSA9IGF3YWl0IHVwZGF0ZShpbnN0YWxsYXRpb25zLmFwcENvbmZpZywgb2xkRW50cnkgPT4ge1xyXG4gICAgICAgIGlmICghaXNFbnRyeVJlZ2lzdGVyZWQob2xkRW50cnkpKSB7XHJcbiAgICAgICAgICAgIHRocm93IEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKFwibm90LXJlZ2lzdGVyZWRcIiAvKiBOT1RfUkVHSVNURVJFRCAqLyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IG9sZEF1dGhUb2tlbiA9IG9sZEVudHJ5LmF1dGhUb2tlbjtcclxuICAgICAgICBpZiAoIWZvcmNlUmVmcmVzaCAmJiBpc0F1dGhUb2tlblZhbGlkKG9sZEF1dGhUb2tlbikpIHtcclxuICAgICAgICAgICAgLy8gVGhlcmUgaXMgYSB2YWxpZCB0b2tlbiBpbiB0aGUgREIuXHJcbiAgICAgICAgICAgIHJldHVybiBvbGRFbnRyeTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAob2xkQXV0aFRva2VuLnJlcXVlc3RTdGF0dXMgPT09IDEgLyogSU5fUFJPR1JFU1MgKi8pIHtcclxuICAgICAgICAgICAgLy8gVGhlcmUgYWxyZWFkeSBpcyBhIHRva2VuIHJlcXVlc3QgaW4gcHJvZ3Jlc3MuXHJcbiAgICAgICAgICAgIHRva2VuUHJvbWlzZSA9IHdhaXRVbnRpbEF1dGhUb2tlblJlcXVlc3QoaW5zdGFsbGF0aW9ucywgZm9yY2VSZWZyZXNoKTtcclxuICAgICAgICAgICAgcmV0dXJuIG9sZEVudHJ5O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgLy8gTm8gdG9rZW4gb3IgdG9rZW4gZXhwaXJlZC5cclxuICAgICAgICAgICAgaWYgKCFuYXZpZ2F0b3Iub25MaW5lKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBFUlJPUl9GQUNUT1JZLmNyZWF0ZShcImFwcC1vZmZsaW5lXCIgLyogQVBQX09GRkxJTkUgKi8pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IGluUHJvZ3Jlc3NFbnRyeSA9IG1ha2VBdXRoVG9rZW5SZXF1ZXN0SW5Qcm9ncmVzc0VudHJ5KG9sZEVudHJ5KTtcclxuICAgICAgICAgICAgdG9rZW5Qcm9taXNlID0gZmV0Y2hBdXRoVG9rZW5Gcm9tU2VydmVyKGluc3RhbGxhdGlvbnMsIGluUHJvZ3Jlc3NFbnRyeSk7XHJcbiAgICAgICAgICAgIHJldHVybiBpblByb2dyZXNzRW50cnk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICBjb25zdCBhdXRoVG9rZW4gPSB0b2tlblByb21pc2VcclxuICAgICAgICA/IGF3YWl0IHRva2VuUHJvbWlzZVxyXG4gICAgICAgIDogZW50cnkuYXV0aFRva2VuO1xyXG4gICAgcmV0dXJuIGF1dGhUb2tlbjtcclxufVxyXG4vKipcclxuICogQ2FsbCBvbmx5IGlmIEZJRCBpcyByZWdpc3RlcmVkIGFuZCBBdXRoIFRva2VuIHJlcXVlc3QgaXMgaW4gcHJvZ3Jlc3MuXHJcbiAqXHJcbiAqIFdhaXRzIHVudGlsIHRoZSBjdXJyZW50IHBlbmRpbmcgcmVxdWVzdCBmaW5pc2hlcy4gSWYgdGhlIHJlcXVlc3QgdGltZXMgb3V0LFxyXG4gKiB0cmllcyBvbmNlIGluIHRoaXMgdGhyZWFkIGFzIHdlbGwuXHJcbiAqL1xyXG5hc3luYyBmdW5jdGlvbiB3YWl0VW50aWxBdXRoVG9rZW5SZXF1ZXN0KGluc3RhbGxhdGlvbnMsIGZvcmNlUmVmcmVzaCkge1xyXG4gICAgLy8gVW5mb3J0dW5hdGVseSwgdGhlcmUgaXMgbm8gd2F5IG9mIHJlbGlhYmx5IG9ic2VydmluZyB3aGVuIGEgdmFsdWUgaW5cclxuICAgIC8vIEluZGV4ZWREQiBjaGFuZ2VzICh5ZXQsIHNlZSBodHRwczovL2dpdGh1Yi5jb20vV0lDRy9pbmRleGVkLWRiLW9ic2VydmVycyksXHJcbiAgICAvLyBzbyB3ZSBuZWVkIHRvIHBvbGwuXHJcbiAgICBsZXQgZW50cnkgPSBhd2FpdCB1cGRhdGVBdXRoVG9rZW5SZXF1ZXN0KGluc3RhbGxhdGlvbnMuYXBwQ29uZmlnKTtcclxuICAgIHdoaWxlIChlbnRyeS5hdXRoVG9rZW4ucmVxdWVzdFN0YXR1cyA9PT0gMSAvKiBJTl9QUk9HUkVTUyAqLykge1xyXG4gICAgICAgIC8vIGdlbmVyYXRlQXV0aFRva2VuIHN0aWxsIGluIHByb2dyZXNzLlxyXG4gICAgICAgIGF3YWl0IHNsZWVwKDEwMCk7XHJcbiAgICAgICAgZW50cnkgPSBhd2FpdCB1cGRhdGVBdXRoVG9rZW5SZXF1ZXN0KGluc3RhbGxhdGlvbnMuYXBwQ29uZmlnKTtcclxuICAgIH1cclxuICAgIGNvbnN0IGF1dGhUb2tlbiA9IGVudHJ5LmF1dGhUb2tlbjtcclxuICAgIGlmIChhdXRoVG9rZW4ucmVxdWVzdFN0YXR1cyA9PT0gMCAvKiBOT1RfU1RBUlRFRCAqLykge1xyXG4gICAgICAgIC8vIFRoZSByZXF1ZXN0IHRpbWVkIG91dCBvciBmYWlsZWQgaW4gYSBkaWZmZXJlbnQgY2FsbC4gVHJ5IGFnYWluLlxyXG4gICAgICAgIHJldHVybiByZWZyZXNoQXV0aFRva2VuKGluc3RhbGxhdGlvbnMsIGZvcmNlUmVmcmVzaCk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICByZXR1cm4gYXV0aFRva2VuO1xyXG4gICAgfVxyXG59XHJcbi8qKlxyXG4gKiBDYWxsZWQgb25seSBpZiB0aGVyZSBpcyBhIEdlbmVyYXRlQXV0aFRva2VuIHJlcXVlc3QgaW4gcHJvZ3Jlc3MuXHJcbiAqXHJcbiAqIFVwZGF0ZXMgdGhlIEluc3RhbGxhdGlvbkVudHJ5IGluIHRoZSBEQiBiYXNlZCBvbiB0aGUgc3RhdHVzIG9mIHRoZVxyXG4gKiBHZW5lcmF0ZUF1dGhUb2tlbiByZXF1ZXN0LlxyXG4gKlxyXG4gKiBSZXR1cm5zIHRoZSB1cGRhdGVkIEluc3RhbGxhdGlvbkVudHJ5LlxyXG4gKi9cclxuZnVuY3Rpb24gdXBkYXRlQXV0aFRva2VuUmVxdWVzdChhcHBDb25maWcpIHtcclxuICAgIHJldHVybiB1cGRhdGUoYXBwQ29uZmlnLCBvbGRFbnRyeSA9PiB7XHJcbiAgICAgICAgaWYgKCFpc0VudHJ5UmVnaXN0ZXJlZChvbGRFbnRyeSkpIHtcclxuICAgICAgICAgICAgdGhyb3cgRVJST1JfRkFDVE9SWS5jcmVhdGUoXCJub3QtcmVnaXN0ZXJlZFwiIC8qIE5PVF9SRUdJU1RFUkVEICovKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3Qgb2xkQXV0aFRva2VuID0gb2xkRW50cnkuYXV0aFRva2VuO1xyXG4gICAgICAgIGlmIChoYXNBdXRoVG9rZW5SZXF1ZXN0VGltZWRPdXQob2xkQXV0aFRva2VuKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCBvbGRFbnRyeSksIHsgYXV0aFRva2VuOiB7IHJlcXVlc3RTdGF0dXM6IDAgLyogTk9UX1NUQVJURUQgKi8gfSB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG9sZEVudHJ5O1xyXG4gICAgfSk7XHJcbn1cclxuYXN5bmMgZnVuY3Rpb24gZmV0Y2hBdXRoVG9rZW5Gcm9tU2VydmVyKGluc3RhbGxhdGlvbnMsIGluc3RhbGxhdGlvbkVudHJ5KSB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IGF1dGhUb2tlbiA9IGF3YWl0IGdlbmVyYXRlQXV0aFRva2VuUmVxdWVzdChpbnN0YWxsYXRpb25zLCBpbnN0YWxsYXRpb25FbnRyeSk7XHJcbiAgICAgICAgY29uc3QgdXBkYXRlZEluc3RhbGxhdGlvbkVudHJ5ID0gT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCBpbnN0YWxsYXRpb25FbnRyeSksIHsgYXV0aFRva2VuIH0pO1xyXG4gICAgICAgIGF3YWl0IHNldChpbnN0YWxsYXRpb25zLmFwcENvbmZpZywgdXBkYXRlZEluc3RhbGxhdGlvbkVudHJ5KTtcclxuICAgICAgICByZXR1cm4gYXV0aFRva2VuO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICBpZiAoaXNTZXJ2ZXJFcnJvcihlKSAmJlxyXG4gICAgICAgICAgICAoZS5jdXN0b21EYXRhLnNlcnZlckNvZGUgPT09IDQwMSB8fCBlLmN1c3RvbURhdGEuc2VydmVyQ29kZSA9PT0gNDA0KSkge1xyXG4gICAgICAgICAgICAvLyBTZXJ2ZXIgcmV0dXJuZWQgYSBcIkZJRCBub3QgZm91bmRcIiBvciBhIFwiSW52YWxpZCBhdXRoZW50aWNhdGlvblwiIGVycm9yLlxyXG4gICAgICAgICAgICAvLyBHZW5lcmF0ZSBhIG5ldyBJRCBuZXh0IHRpbWUuXHJcbiAgICAgICAgICAgIGF3YWl0IHJlbW92ZShpbnN0YWxsYXRpb25zLmFwcENvbmZpZyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCB1cGRhdGVkSW5zdGFsbGF0aW9uRW50cnkgPSBPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIGluc3RhbGxhdGlvbkVudHJ5KSwgeyBhdXRoVG9rZW46IHsgcmVxdWVzdFN0YXR1czogMCAvKiBOT1RfU1RBUlRFRCAqLyB9IH0pO1xyXG4gICAgICAgICAgICBhd2FpdCBzZXQoaW5zdGFsbGF0aW9ucy5hcHBDb25maWcsIHVwZGF0ZWRJbnN0YWxsYXRpb25FbnRyeSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRocm93IGU7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gaXNFbnRyeVJlZ2lzdGVyZWQoaW5zdGFsbGF0aW9uRW50cnkpIHtcclxuICAgIHJldHVybiAoaW5zdGFsbGF0aW9uRW50cnkgIT09IHVuZGVmaW5lZCAmJlxyXG4gICAgICAgIGluc3RhbGxhdGlvbkVudHJ5LnJlZ2lzdHJhdGlvblN0YXR1cyA9PT0gMiAvKiBDT01QTEVURUQgKi8pO1xyXG59XHJcbmZ1bmN0aW9uIGlzQXV0aFRva2VuVmFsaWQoYXV0aFRva2VuKSB7XHJcbiAgICByZXR1cm4gKGF1dGhUb2tlbi5yZXF1ZXN0U3RhdHVzID09PSAyIC8qIENPTVBMRVRFRCAqLyAmJlxyXG4gICAgICAgICFpc0F1dGhUb2tlbkV4cGlyZWQoYXV0aFRva2VuKSk7XHJcbn1cclxuZnVuY3Rpb24gaXNBdXRoVG9rZW5FeHBpcmVkKGF1dGhUb2tlbikge1xyXG4gICAgY29uc3Qgbm93ID0gRGF0ZS5ub3coKTtcclxuICAgIHJldHVybiAobm93IDwgYXV0aFRva2VuLmNyZWF0aW9uVGltZSB8fFxyXG4gICAgICAgIGF1dGhUb2tlbi5jcmVhdGlvblRpbWUgKyBhdXRoVG9rZW4uZXhwaXJlc0luIDwgbm93ICsgVE9LRU5fRVhQSVJBVElPTl9CVUZGRVIpO1xyXG59XHJcbi8qKiBSZXR1cm5zIGFuIHVwZGF0ZWQgSW5zdGFsbGF0aW9uRW50cnkgd2l0aCBhbiBJblByb2dyZXNzQXV0aFRva2VuLiAqL1xyXG5mdW5jdGlvbiBtYWtlQXV0aFRva2VuUmVxdWVzdEluUHJvZ3Jlc3NFbnRyeShvbGRFbnRyeSkge1xyXG4gICAgY29uc3QgaW5Qcm9ncmVzc0F1dGhUb2tlbiA9IHtcclxuICAgICAgICByZXF1ZXN0U3RhdHVzOiAxIC8qIElOX1BST0dSRVNTICovLFxyXG4gICAgICAgIHJlcXVlc3RUaW1lOiBEYXRlLm5vdygpXHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgb2xkRW50cnkpLCB7IGF1dGhUb2tlbjogaW5Qcm9ncmVzc0F1dGhUb2tlbiB9KTtcclxufVxyXG5mdW5jdGlvbiBoYXNBdXRoVG9rZW5SZXF1ZXN0VGltZWRPdXQoYXV0aFRva2VuKSB7XHJcbiAgICByZXR1cm4gKGF1dGhUb2tlbi5yZXF1ZXN0U3RhdHVzID09PSAxIC8qIElOX1BST0dSRVNTICovICYmXHJcbiAgICAgICAgYXV0aFRva2VuLnJlcXVlc3RUaW1lICsgUEVORElOR19USU1FT1VUX01TIDwgRGF0ZS5ub3coKSk7XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqXHJcbiAqIENyZWF0ZXMgYSBGaXJlYmFzZSBJbnN0YWxsYXRpb24gaWYgdGhlcmUgaXNuJ3Qgb25lIGZvciB0aGUgYXBwIGFuZFxyXG4gKiByZXR1cm5zIHRoZSBJbnN0YWxsYXRpb24gSUQuXHJcbiAqIEBwYXJhbSBpbnN0YWxsYXRpb25zIC0gVGhlIGBJbnN0YWxsYXRpb25zYCBpbnN0YW5jZS5cclxuICpcclxuICogQHB1YmxpY1xyXG4gKi9cclxuYXN5bmMgZnVuY3Rpb24gZ2V0SWQoaW5zdGFsbGF0aW9ucykge1xyXG4gICAgY29uc3QgaW5zdGFsbGF0aW9uc0ltcGwgPSBpbnN0YWxsYXRpb25zO1xyXG4gICAgY29uc3QgeyBpbnN0YWxsYXRpb25FbnRyeSwgcmVnaXN0cmF0aW9uUHJvbWlzZSB9ID0gYXdhaXQgZ2V0SW5zdGFsbGF0aW9uRW50cnkoaW5zdGFsbGF0aW9uc0ltcGwpO1xyXG4gICAgaWYgKHJlZ2lzdHJhdGlvblByb21pc2UpIHtcclxuICAgICAgICByZWdpc3RyYXRpb25Qcm9taXNlLmNhdGNoKGNvbnNvbGUuZXJyb3IpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgLy8gSWYgdGhlIGluc3RhbGxhdGlvbiBpcyBhbHJlYWR5IHJlZ2lzdGVyZWQsIHVwZGF0ZSB0aGUgYXV0aGVudGljYXRpb25cclxuICAgICAgICAvLyB0b2tlbiBpZiBuZWVkZWQuXHJcbiAgICAgICAgcmVmcmVzaEF1dGhUb2tlbihpbnN0YWxsYXRpb25zSW1wbCkuY2F0Y2goY29uc29sZS5lcnJvcik7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gaW5zdGFsbGF0aW9uRW50cnkuZmlkO1xyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbi8qKlxyXG4gKiBSZXR1cm5zIGEgRmlyZWJhc2UgSW5zdGFsbGF0aW9ucyBhdXRoIHRva2VuLCBpZGVudGlmeWluZyB0aGUgY3VycmVudFxyXG4gKiBGaXJlYmFzZSBJbnN0YWxsYXRpb24uXHJcbiAqIEBwYXJhbSBpbnN0YWxsYXRpb25zIC0gVGhlIGBJbnN0YWxsYXRpb25zYCBpbnN0YW5jZS5cclxuICogQHBhcmFtIGZvcmNlUmVmcmVzaCAtIEZvcmNlIHJlZnJlc2ggcmVnYXJkbGVzcyBvZiB0b2tlbiBleHBpcmF0aW9uLlxyXG4gKlxyXG4gKiBAcHVibGljXHJcbiAqL1xyXG5hc3luYyBmdW5jdGlvbiBnZXRUb2tlbihpbnN0YWxsYXRpb25zLCBmb3JjZVJlZnJlc2ggPSBmYWxzZSkge1xyXG4gICAgY29uc3QgaW5zdGFsbGF0aW9uc0ltcGwgPSBpbnN0YWxsYXRpb25zO1xyXG4gICAgYXdhaXQgY29tcGxldGVJbnN0YWxsYXRpb25SZWdpc3RyYXRpb24oaW5zdGFsbGF0aW9uc0ltcGwpO1xyXG4gICAgLy8gQXQgdGhpcyBwb2ludCB3ZSBlaXRoZXIgaGF2ZSBhIFJlZ2lzdGVyZWQgSW5zdGFsbGF0aW9uIGluIHRoZSBEQiwgb3Igd2UndmVcclxuICAgIC8vIGFscmVhZHkgdGhyb3duIGFuIGVycm9yLlxyXG4gICAgY29uc3QgYXV0aFRva2VuID0gYXdhaXQgcmVmcmVzaEF1dGhUb2tlbihpbnN0YWxsYXRpb25zSW1wbCwgZm9yY2VSZWZyZXNoKTtcclxuICAgIHJldHVybiBhdXRoVG9rZW4udG9rZW47XHJcbn1cclxuYXN5bmMgZnVuY3Rpb24gY29tcGxldGVJbnN0YWxsYXRpb25SZWdpc3RyYXRpb24oaW5zdGFsbGF0aW9ucykge1xyXG4gICAgY29uc3QgeyByZWdpc3RyYXRpb25Qcm9taXNlIH0gPSBhd2FpdCBnZXRJbnN0YWxsYXRpb25FbnRyeShpbnN0YWxsYXRpb25zKTtcclxuICAgIGlmIChyZWdpc3RyYXRpb25Qcm9taXNlKSB7XHJcbiAgICAgICAgLy8gQSBjcmVhdGVJbnN0YWxsYXRpb24gcmVxdWVzdCBpcyBpbiBwcm9ncmVzcy4gV2FpdCB1bnRpbCBpdCBmaW5pc2hlcy5cclxuICAgICAgICBhd2FpdCByZWdpc3RyYXRpb25Qcm9taXNlO1xyXG4gICAgfVxyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbmFzeW5jIGZ1bmN0aW9uIGRlbGV0ZUluc3RhbGxhdGlvblJlcXVlc3QoYXBwQ29uZmlnLCBpbnN0YWxsYXRpb25FbnRyeSkge1xyXG4gICAgY29uc3QgZW5kcG9pbnQgPSBnZXREZWxldGVFbmRwb2ludChhcHBDb25maWcsIGluc3RhbGxhdGlvbkVudHJ5KTtcclxuICAgIGNvbnN0IGhlYWRlcnMgPSBnZXRIZWFkZXJzV2l0aEF1dGgoYXBwQ29uZmlnLCBpbnN0YWxsYXRpb25FbnRyeSk7XHJcbiAgICBjb25zdCByZXF1ZXN0ID0ge1xyXG4gICAgICAgIG1ldGhvZDogJ0RFTEVURScsXHJcbiAgICAgICAgaGVhZGVyc1xyXG4gICAgfTtcclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgcmV0cnlJZlNlcnZlckVycm9yKCgpID0+IGZldGNoKGVuZHBvaW50LCByZXF1ZXN0KSk7XHJcbiAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XHJcbiAgICAgICAgdGhyb3cgYXdhaXQgZ2V0RXJyb3JGcm9tUmVzcG9uc2UoJ0RlbGV0ZSBJbnN0YWxsYXRpb24nLCByZXNwb25zZSk7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gZ2V0RGVsZXRlRW5kcG9pbnQoYXBwQ29uZmlnLCB7IGZpZCB9KSB7XHJcbiAgICByZXR1cm4gYCR7Z2V0SW5zdGFsbGF0aW9uc0VuZHBvaW50KGFwcENvbmZpZyl9LyR7ZmlkfWA7XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqXHJcbiAqIERlbGV0ZXMgdGhlIEZpcmViYXNlIEluc3RhbGxhdGlvbiBhbmQgYWxsIGFzc29jaWF0ZWQgZGF0YS5cclxuICogQHBhcmFtIGluc3RhbGxhdGlvbnMgLSBUaGUgYEluc3RhbGxhdGlvbnNgIGluc3RhbmNlLlxyXG4gKlxyXG4gKiBAcHVibGljXHJcbiAqL1xyXG5hc3luYyBmdW5jdGlvbiBkZWxldGVJbnN0YWxsYXRpb25zKGluc3RhbGxhdGlvbnMpIHtcclxuICAgIGNvbnN0IHsgYXBwQ29uZmlnIH0gPSBpbnN0YWxsYXRpb25zO1xyXG4gICAgY29uc3QgZW50cnkgPSBhd2FpdCB1cGRhdGUoYXBwQ29uZmlnLCBvbGRFbnRyeSA9PiB7XHJcbiAgICAgICAgaWYgKG9sZEVudHJ5ICYmIG9sZEVudHJ5LnJlZ2lzdHJhdGlvblN0YXR1cyA9PT0gMCAvKiBOT1RfU1RBUlRFRCAqLykge1xyXG4gICAgICAgICAgICAvLyBEZWxldGUgdGhlIHVucmVnaXN0ZXJlZCBlbnRyeSB3aXRob3V0IHNlbmRpbmcgYSBkZWxldGVJbnN0YWxsYXRpb24gcmVxdWVzdC5cclxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG9sZEVudHJ5O1xyXG4gICAgfSk7XHJcbiAgICBpZiAoZW50cnkpIHtcclxuICAgICAgICBpZiAoZW50cnkucmVnaXN0cmF0aW9uU3RhdHVzID09PSAxIC8qIElOX1BST0dSRVNTICovKSB7XHJcbiAgICAgICAgICAgIC8vIENhbid0IGRlbGV0ZSB3aGlsZSB0cnlpbmcgdG8gcmVnaXN0ZXIuXHJcbiAgICAgICAgICAgIHRocm93IEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKFwiZGVsZXRlLXBlbmRpbmctcmVnaXN0cmF0aW9uXCIgLyogREVMRVRFX1BFTkRJTkdfUkVHSVNUUkFUSU9OICovKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoZW50cnkucmVnaXN0cmF0aW9uU3RhdHVzID09PSAyIC8qIENPTVBMRVRFRCAqLykge1xyXG4gICAgICAgICAgICBpZiAoIW5hdmlnYXRvci5vbkxpbmUpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKFwiYXBwLW9mZmxpbmVcIiAvKiBBUFBfT0ZGTElORSAqLyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBhd2FpdCBkZWxldGVJbnN0YWxsYXRpb25SZXF1ZXN0KGFwcENvbmZpZywgZW50cnkpO1xyXG4gICAgICAgICAgICAgICAgYXdhaXQgcmVtb3ZlKGFwcENvbmZpZyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqXHJcbiAqIFNldHMgYSBuZXcgY2FsbGJhY2sgdGhhdCB3aWxsIGdldCBjYWxsZWQgd2hlbiBJbnN0YWxsYXRpb24gSUQgY2hhbmdlcy5cclxuICogUmV0dXJucyBhbiB1bnN1YnNjcmliZSBmdW5jdGlvbiB0aGF0IHdpbGwgcmVtb3ZlIHRoZSBjYWxsYmFjayB3aGVuIGNhbGxlZC5cclxuICogQHBhcmFtIGluc3RhbGxhdGlvbnMgLSBUaGUgYEluc3RhbGxhdGlvbnNgIGluc3RhbmNlLlxyXG4gKiBAcGFyYW0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgZnVuY3Rpb24gdGhhdCBpcyBpbnZva2VkIHdoZW4gRklEIGNoYW5nZXMuXHJcbiAqIEByZXR1cm5zIEEgZnVuY3Rpb24gdGhhdCBjYW4gYmUgY2FsbGVkIHRvIHVuc3Vic2NyaWJlLlxyXG4gKlxyXG4gKiBAcHVibGljXHJcbiAqL1xyXG5mdW5jdGlvbiBvbklkQ2hhbmdlKGluc3RhbGxhdGlvbnMsIGNhbGxiYWNrKSB7XHJcbiAgICBjb25zdCB7IGFwcENvbmZpZyB9ID0gaW5zdGFsbGF0aW9ucztcclxuICAgIGFkZENhbGxiYWNrKGFwcENvbmZpZywgY2FsbGJhY2spO1xyXG4gICAgcmV0dXJuICgpID0+IHtcclxuICAgICAgICByZW1vdmVDYWxsYmFjayhhcHBDb25maWcsIGNhbGxiYWNrKTtcclxuICAgIH07XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqXHJcbiAqIFJldHVybnMgYW4gaW5zdGFuY2Ugb2Yge0BsaW5rIEluc3RhbGxhdGlvbnN9IGFzc29jaWF0ZWQgd2l0aCB0aGUgZ2l2ZW5cclxuICoge0BsaW5rIEBmaXJlYmFzZS9hcHAjRmlyZWJhc2VBcHB9IGluc3RhbmNlLlxyXG4gKiBAcGFyYW0gYXBwIC0gVGhlIHtAbGluayBAZmlyZWJhc2UvYXBwI0ZpcmViYXNlQXBwfSBpbnN0YW5jZS5cclxuICpcclxuICogQHB1YmxpY1xyXG4gKi9cclxuZnVuY3Rpb24gZ2V0SW5zdGFsbGF0aW9ucyhhcHAgPSBnZXRBcHAoKSkge1xyXG4gICAgY29uc3QgaW5zdGFsbGF0aW9uc0ltcGwgPSBfZ2V0UHJvdmlkZXIoYXBwLCAnaW5zdGFsbGF0aW9ucycpLmdldEltbWVkaWF0ZSgpO1xyXG4gICAgcmV0dXJuIGluc3RhbGxhdGlvbnNJbXBsO1xyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbmZ1bmN0aW9uIGV4dHJhY3RBcHBDb25maWcoYXBwKSB7XHJcbiAgICBpZiAoIWFwcCB8fCAhYXBwLm9wdGlvbnMpIHtcclxuICAgICAgICB0aHJvdyBnZXRNaXNzaW5nVmFsdWVFcnJvcignQXBwIENvbmZpZ3VyYXRpb24nKTtcclxuICAgIH1cclxuICAgIGlmICghYXBwLm5hbWUpIHtcclxuICAgICAgICB0aHJvdyBnZXRNaXNzaW5nVmFsdWVFcnJvcignQXBwIE5hbWUnKTtcclxuICAgIH1cclxuICAgIC8vIFJlcXVpcmVkIGFwcCBjb25maWcga2V5c1xyXG4gICAgY29uc3QgY29uZmlnS2V5cyA9IFtcclxuICAgICAgICAncHJvamVjdElkJyxcclxuICAgICAgICAnYXBpS2V5JyxcclxuICAgICAgICAnYXBwSWQnXHJcbiAgICBdO1xyXG4gICAgZm9yIChjb25zdCBrZXlOYW1lIG9mIGNvbmZpZ0tleXMpIHtcclxuICAgICAgICBpZiAoIWFwcC5vcHRpb25zW2tleU5hbWVdKSB7XHJcbiAgICAgICAgICAgIHRocm93IGdldE1pc3NpbmdWYWx1ZUVycm9yKGtleU5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgYXBwTmFtZTogYXBwLm5hbWUsXHJcbiAgICAgICAgcHJvamVjdElkOiBhcHAub3B0aW9ucy5wcm9qZWN0SWQsXHJcbiAgICAgICAgYXBpS2V5OiBhcHAub3B0aW9ucy5hcGlLZXksXHJcbiAgICAgICAgYXBwSWQ6IGFwcC5vcHRpb25zLmFwcElkXHJcbiAgICB9O1xyXG59XHJcbmZ1bmN0aW9uIGdldE1pc3NpbmdWYWx1ZUVycm9yKHZhbHVlTmFtZSkge1xyXG4gICAgcmV0dXJuIEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKFwibWlzc2luZy1hcHAtY29uZmlnLXZhbHVlc1wiIC8qIE1JU1NJTkdfQVBQX0NPTkZJR19WQUxVRVMgKi8sIHtcclxuICAgICAgICB2YWx1ZU5hbWVcclxuICAgIH0pO1xyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbmNvbnN0IElOU1RBTExBVElPTlNfTkFNRSA9ICdpbnN0YWxsYXRpb25zJztcclxuY29uc3QgSU5TVEFMTEFUSU9OU19OQU1FX0lOVEVSTkFMID0gJ2luc3RhbGxhdGlvbnMtaW50ZXJuYWwnO1xyXG5jb25zdCBwdWJsaWNGYWN0b3J5ID0gKGNvbnRhaW5lcikgPT4ge1xyXG4gICAgY29uc3QgYXBwID0gY29udGFpbmVyLmdldFByb3ZpZGVyKCdhcHAnKS5nZXRJbW1lZGlhdGUoKTtcclxuICAgIC8vIFRocm93cyBpZiBhcHAgaXNuJ3QgY29uZmlndXJlZCBwcm9wZXJseS5cclxuICAgIGNvbnN0IGFwcENvbmZpZyA9IGV4dHJhY3RBcHBDb25maWcoYXBwKTtcclxuICAgIGNvbnN0IGhlYXJ0YmVhdFNlcnZpY2VQcm92aWRlciA9IF9nZXRQcm92aWRlcihhcHAsICdoZWFydGJlYXQnKTtcclxuICAgIGNvbnN0IGluc3RhbGxhdGlvbnNJbXBsID0ge1xyXG4gICAgICAgIGFwcCxcclxuICAgICAgICBhcHBDb25maWcsXHJcbiAgICAgICAgaGVhcnRiZWF0U2VydmljZVByb3ZpZGVyLFxyXG4gICAgICAgIF9kZWxldGU6ICgpID0+IFByb21pc2UucmVzb2x2ZSgpXHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIGluc3RhbGxhdGlvbnNJbXBsO1xyXG59O1xyXG5jb25zdCBpbnRlcm5hbEZhY3RvcnkgPSAoY29udGFpbmVyKSA9PiB7XHJcbiAgICBjb25zdCBhcHAgPSBjb250YWluZXIuZ2V0UHJvdmlkZXIoJ2FwcCcpLmdldEltbWVkaWF0ZSgpO1xyXG4gICAgLy8gSW50ZXJuYWwgRklTIGluc3RhbmNlIHJlbGllcyBvbiBwdWJsaWMgRklTIGluc3RhbmNlLlxyXG4gICAgY29uc3QgaW5zdGFsbGF0aW9ucyA9IF9nZXRQcm92aWRlcihhcHAsIElOU1RBTExBVElPTlNfTkFNRSkuZ2V0SW1tZWRpYXRlKCk7XHJcbiAgICBjb25zdCBpbnN0YWxsYXRpb25zSW50ZXJuYWwgPSB7XHJcbiAgICAgICAgZ2V0SWQ6ICgpID0+IGdldElkKGluc3RhbGxhdGlvbnMpLFxyXG4gICAgICAgIGdldFRva2VuOiAoZm9yY2VSZWZyZXNoKSA9PiBnZXRUb2tlbihpbnN0YWxsYXRpb25zLCBmb3JjZVJlZnJlc2gpXHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIGluc3RhbGxhdGlvbnNJbnRlcm5hbDtcclxufTtcclxuZnVuY3Rpb24gcmVnaXN0ZXJJbnN0YWxsYXRpb25zKCkge1xyXG4gICAgX3JlZ2lzdGVyQ29tcG9uZW50KG5ldyBDb21wb25lbnQoSU5TVEFMTEFUSU9OU19OQU1FLCBwdWJsaWNGYWN0b3J5LCBcIlBVQkxJQ1wiIC8qIFBVQkxJQyAqLykpO1xyXG4gICAgX3JlZ2lzdGVyQ29tcG9uZW50KG5ldyBDb21wb25lbnQoSU5TVEFMTEFUSU9OU19OQU1FX0lOVEVSTkFMLCBpbnRlcm5hbEZhY3RvcnksIFwiUFJJVkFURVwiIC8qIFBSSVZBVEUgKi8pKTtcclxufVxuXG4vKipcclxuICogRmlyZWJhc2UgSW5zdGFsbGF0aW9uc1xyXG4gKlxyXG4gKiBAcGFja2FnZURvY3VtZW50YXRpb25cclxuICovXHJcbnJlZ2lzdGVySW5zdGFsbGF0aW9ucygpO1xyXG5yZWdpc3RlclZlcnNpb24obmFtZSwgdmVyc2lvbik7XHJcbi8vIEJVSUxEX1RBUkdFVCB3aWxsIGJlIHJlcGxhY2VkIGJ5IHZhbHVlcyBsaWtlIGVzbTUsIGVzbTIwMTcsIGNqczUsIGV0YyBkdXJpbmcgdGhlIGNvbXBpbGF0aW9uXHJcbnJlZ2lzdGVyVmVyc2lvbihuYW1lLCB2ZXJzaW9uLCAnZXNtMjAxNycpO1xuXG5leHBvcnQgeyBkZWxldGVJbnN0YWxsYXRpb25zLCBnZXRJZCwgZ2V0SW5zdGFsbGF0aW9ucywgZ2V0VG9rZW4sIG9uSWRDaGFuZ2UgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmVzbTIwMTcuanMubWFwXG4iLCJpbXBvcnQgeyBnZXRBcHAsIF9nZXRQcm92aWRlciwgX3JlZ2lzdGVyQ29tcG9uZW50LCByZWdpc3RlclZlcnNpb24gfSBmcm9tICdAZmlyZWJhc2UvYXBwJztcbmltcG9ydCB7IExvZ2dlciB9IGZyb20gJ0BmaXJlYmFzZS9sb2dnZXInO1xuaW1wb3J0IHsgRXJyb3JGYWN0b3J5LCBjYWxjdWxhdGVCYWNrb2ZmTWlsbGlzLCBGaXJlYmFzZUVycm9yLCBpc0luZGV4ZWREQkF2YWlsYWJsZSwgdmFsaWRhdGVJbmRleGVkREJPcGVuYWJsZSwgaXNCcm93c2VyRXh0ZW5zaW9uLCBhcmVDb29raWVzRW5hYmxlZCwgZ2V0TW9kdWxhckluc3RhbmNlLCBkZWVwRXF1YWwgfSBmcm9tICdAZmlyZWJhc2UvdXRpbCc7XG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdAZmlyZWJhc2UvY29tcG9uZW50JztcbmltcG9ydCAnQGZpcmViYXNlL2luc3RhbGxhdGlvbnMnO1xuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG4vKipcclxuICogVHlwZSBjb25zdGFudCBmb3IgRmlyZWJhc2UgQW5hbHl0aWNzLlxyXG4gKi9cclxuY29uc3QgQU5BTFlUSUNTX1RZUEUgPSAnYW5hbHl0aWNzJztcclxuLy8gS2V5IHRvIGF0dGFjaCBGSUQgdG8gaW4gZ3RhZyBwYXJhbXMuXHJcbmNvbnN0IEdBX0ZJRF9LRVkgPSAnZmlyZWJhc2VfaWQnO1xyXG5jb25zdCBPUklHSU5fS0VZID0gJ29yaWdpbic7XHJcbmNvbnN0IEZFVENIX1RJTUVPVVRfTUlMTElTID0gNjAgKiAxMDAwO1xyXG5jb25zdCBEWU5BTUlDX0NPTkZJR19VUkwgPSAnaHR0cHM6Ly9maXJlYmFzZS5nb29nbGVhcGlzLmNvbS92MWFscGhhL3Byb2plY3RzLy0vYXBwcy97YXBwLWlkfS93ZWJDb25maWcnO1xyXG5jb25zdCBHVEFHX1VSTCA9ICdodHRwczovL3d3dy5nb29nbGV0YWdtYW5hZ2VyLmNvbS9ndGFnL2pzJztcblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuY29uc3QgbG9nZ2VyID0gbmV3IExvZ2dlcignQGZpcmViYXNlL2FuYWx5dGljcycpO1xuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG4vKipcclxuICogTWFrZXNoaWZ0IHBvbHlmaWxsIGZvciBQcm9taXNlLmFsbFNldHRsZWQoKS4gUmVzb2x2ZXMgd2hlbiBhbGwgcHJvbWlzZXNcclxuICogaGF2ZSBlaXRoZXIgcmVzb2x2ZWQgb3IgcmVqZWN0ZWQuXHJcbiAqXHJcbiAqIEBwYXJhbSBwcm9taXNlcyBBcnJheSBvZiBwcm9taXNlcyB0byB3YWl0IGZvci5cclxuICovXHJcbmZ1bmN0aW9uIHByb21pc2VBbGxTZXR0bGVkKHByb21pc2VzKSB7XHJcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMubWFwKHByb21pc2UgPT4gcHJvbWlzZS5jYXRjaChlID0+IGUpKSk7XHJcbn1cclxuLyoqXHJcbiAqIEluc2VydHMgZ3RhZyBzY3JpcHQgdGFnIGludG8gdGhlIHBhZ2UgdG8gYXN5bmNocm9ub3VzbHkgZG93bmxvYWQgZ3RhZy5cclxuICogQHBhcmFtIGRhdGFMYXllck5hbWUgTmFtZSBvZiBkYXRhbGF5ZXIgKG1vc3Qgb2Z0ZW4gdGhlIGRlZmF1bHQsIFwiX2RhdGFMYXllclwiKS5cclxuICovXHJcbmZ1bmN0aW9uIGluc2VydFNjcmlwdFRhZyhkYXRhTGF5ZXJOYW1lLCBtZWFzdXJlbWVudElkKSB7XHJcbiAgICBjb25zdCBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcclxuICAgIC8vIFdlIGFyZSBub3QgcHJvdmlkaW5nIGFuIGFuYWx5dGljc0lkIGluIHRoZSBVUkwgYmVjYXVzZSBpdCB3b3VsZCB0cmlnZ2VyIGEgYHBhZ2Vfdmlld2BcclxuICAgIC8vIHdpdGhvdXQgZmlkLiBXZSB3aWxsIGluaXRpYWxpemUgZ2EtaWQgdXNpbmcgZ3RhZyAoY29uZmlnKSBjb21tYW5kIHRvZ2V0aGVyIHdpdGggZmlkLlxyXG4gICAgc2NyaXB0LnNyYyA9IGAke0dUQUdfVVJMfT9sPSR7ZGF0YUxheWVyTmFtZX0maWQ9JHttZWFzdXJlbWVudElkfWA7XHJcbiAgICBzY3JpcHQuYXN5bmMgPSB0cnVlO1xyXG4gICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzY3JpcHQpO1xyXG59XHJcbi8qKlxyXG4gKiBHZXQgcmVmZXJlbmNlIHRvLCBvciBjcmVhdGUsIGdsb2JhbCBkYXRhbGF5ZXIuXHJcbiAqIEBwYXJhbSBkYXRhTGF5ZXJOYW1lIE5hbWUgb2YgZGF0YWxheWVyIChtb3N0IG9mdGVuIHRoZSBkZWZhdWx0LCBcIl9kYXRhTGF5ZXJcIikuXHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRPckNyZWF0ZURhdGFMYXllcihkYXRhTGF5ZXJOYW1lKSB7XHJcbiAgICAvLyBDaGVjayBmb3IgZXhpc3RpbmcgZGF0YUxheWVyIGFuZCBjcmVhdGUgaWYgbmVlZGVkLlxyXG4gICAgbGV0IGRhdGFMYXllciA9IFtdO1xyXG4gICAgaWYgKEFycmF5LmlzQXJyYXkod2luZG93W2RhdGFMYXllck5hbWVdKSkge1xyXG4gICAgICAgIGRhdGFMYXllciA9IHdpbmRvd1tkYXRhTGF5ZXJOYW1lXTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHdpbmRvd1tkYXRhTGF5ZXJOYW1lXSA9IGRhdGFMYXllcjtcclxuICAgIH1cclxuICAgIHJldHVybiBkYXRhTGF5ZXI7XHJcbn1cclxuLyoqXHJcbiAqIFdyYXBwZWQgZ3RhZyBsb2dpYyB3aGVuIGd0YWcgaXMgY2FsbGVkIHdpdGggJ2NvbmZpZycgY29tbWFuZC5cclxuICpcclxuICogQHBhcmFtIGd0YWdDb3JlIEJhc2ljIGd0YWcgZnVuY3Rpb24gdGhhdCBqdXN0IGFwcGVuZHMgdG8gZGF0YUxheWVyLlxyXG4gKiBAcGFyYW0gaW5pdGlhbGl6YXRpb25Qcm9taXNlc01hcCBNYXAgb2YgYXBwSWRzIHRvIHRoZWlyIGluaXRpYWxpemF0aW9uIHByb21pc2VzLlxyXG4gKiBAcGFyYW0gZHluYW1pY0NvbmZpZ1Byb21pc2VzTGlzdCBBcnJheSBvZiBkeW5hbWljIGNvbmZpZyBmZXRjaCBwcm9taXNlcy5cclxuICogQHBhcmFtIG1lYXN1cmVtZW50SWRUb0FwcElkIE1hcCBvZiBHQSBtZWFzdXJlbWVudElEcyB0byBjb3JyZXNwb25kaW5nIEZpcmViYXNlIGFwcElkLlxyXG4gKiBAcGFyYW0gbWVhc3VyZW1lbnRJZCBHQSBNZWFzdXJlbWVudCBJRCB0byBzZXQgY29uZmlnIGZvci5cclxuICogQHBhcmFtIGd0YWdQYXJhbXMgR3RhZyBjb25maWcgcGFyYW1zIHRvIHNldC5cclxuICovXHJcbmFzeW5jIGZ1bmN0aW9uIGd0YWdPbkNvbmZpZyhndGFnQ29yZSwgaW5pdGlhbGl6YXRpb25Qcm9taXNlc01hcCwgZHluYW1pY0NvbmZpZ1Byb21pc2VzTGlzdCwgbWVhc3VyZW1lbnRJZFRvQXBwSWQsIG1lYXN1cmVtZW50SWQsIGd0YWdQYXJhbXMpIHtcclxuICAgIC8vIElmIGNvbmZpZyBpcyBhbHJlYWR5IGZldGNoZWQsIHdlIGtub3cgdGhlIGFwcElkIGFuZCBjYW4gdXNlIGl0IHRvIGxvb2sgdXAgd2hhdCBGSUQgcHJvbWlzZSB3ZVxyXG4gICAgLy8vIGFyZSB3YWl0aW5nIGZvciwgYW5kIHdhaXQgb25seSBvbiB0aGF0IG9uZS5cclxuICAgIGNvbnN0IGNvcnJlc3BvbmRpbmdBcHBJZCA9IG1lYXN1cmVtZW50SWRUb0FwcElkW21lYXN1cmVtZW50SWRdO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBpZiAoY29ycmVzcG9uZGluZ0FwcElkKSB7XHJcbiAgICAgICAgICAgIGF3YWl0IGluaXRpYWxpemF0aW9uUHJvbWlzZXNNYXBbY29ycmVzcG9uZGluZ0FwcElkXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIElmIGNvbmZpZyBpcyBub3QgZmV0Y2hlZCB5ZXQsIHdhaXQgZm9yIGFsbCBjb25maWdzICh3ZSBkb24ndCBrbm93IHdoaWNoIG9uZSB3ZSBuZWVkKSBhbmRcclxuICAgICAgICAgICAgLy8gZmluZCB0aGUgYXBwSWQgKGlmIGFueSkgY29ycmVzcG9uZGluZyB0byB0aGlzIG1lYXN1cmVtZW50SWQuIElmIHRoZXJlIGlzIG9uZSwgd2FpdCBvblxyXG4gICAgICAgICAgICAvLyB0aGF0IGFwcElkJ3MgaW5pdGlhbGl6YXRpb24gcHJvbWlzZS4gSWYgdGhlcmUgaXMgbm9uZSwgcHJvbWlzZSByZXNvbHZlcyBhbmQgZ3RhZ1xyXG4gICAgICAgICAgICAvLyBjYWxsIGdvZXMgdGhyb3VnaC5cclxuICAgICAgICAgICAgY29uc3QgZHluYW1pY0NvbmZpZ1Jlc3VsdHMgPSBhd2FpdCBwcm9taXNlQWxsU2V0dGxlZChkeW5hbWljQ29uZmlnUHJvbWlzZXNMaXN0KTtcclxuICAgICAgICAgICAgY29uc3QgZm91bmRDb25maWcgPSBkeW5hbWljQ29uZmlnUmVzdWx0cy5maW5kKGNvbmZpZyA9PiBjb25maWcubWVhc3VyZW1lbnRJZCA9PT0gbWVhc3VyZW1lbnRJZCk7XHJcbiAgICAgICAgICAgIGlmIChmb3VuZENvbmZpZykge1xyXG4gICAgICAgICAgICAgICAgYXdhaXQgaW5pdGlhbGl6YXRpb25Qcm9taXNlc01hcFtmb3VuZENvbmZpZy5hcHBJZF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgIGxvZ2dlci5lcnJvcihlKTtcclxuICAgIH1cclxuICAgIGd0YWdDb3JlKFwiY29uZmlnXCIgLyogQ09ORklHICovLCBtZWFzdXJlbWVudElkLCBndGFnUGFyYW1zKTtcclxufVxyXG4vKipcclxuICogV3JhcHBlZCBndGFnIGxvZ2ljIHdoZW4gZ3RhZyBpcyBjYWxsZWQgd2l0aCAnZXZlbnQnIGNvbW1hbmQuXHJcbiAqXHJcbiAqIEBwYXJhbSBndGFnQ29yZSBCYXNpYyBndGFnIGZ1bmN0aW9uIHRoYXQganVzdCBhcHBlbmRzIHRvIGRhdGFMYXllci5cclxuICogQHBhcmFtIGluaXRpYWxpemF0aW9uUHJvbWlzZXNNYXAgTWFwIG9mIGFwcElkcyB0byB0aGVpciBpbml0aWFsaXphdGlvbiBwcm9taXNlcy5cclxuICogQHBhcmFtIGR5bmFtaWNDb25maWdQcm9taXNlc0xpc3QgQXJyYXkgb2YgZHluYW1pYyBjb25maWcgZmV0Y2ggcHJvbWlzZXMuXHJcbiAqIEBwYXJhbSBtZWFzdXJlbWVudElkIEdBIE1lYXN1cmVtZW50IElEIHRvIGxvZyBldmVudCB0by5cclxuICogQHBhcmFtIGd0YWdQYXJhbXMgUGFyYW1zIHRvIGxvZyB3aXRoIHRoaXMgZXZlbnQuXHJcbiAqL1xyXG5hc3luYyBmdW5jdGlvbiBndGFnT25FdmVudChndGFnQ29yZSwgaW5pdGlhbGl6YXRpb25Qcm9taXNlc01hcCwgZHluYW1pY0NvbmZpZ1Byb21pc2VzTGlzdCwgbWVhc3VyZW1lbnRJZCwgZ3RhZ1BhcmFtcykge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBsZXQgaW5pdGlhbGl6YXRpb25Qcm9taXNlc1RvV2FpdEZvciA9IFtdO1xyXG4gICAgICAgIC8vIElmIHRoZXJlJ3MgYSAnc2VuZF90bycgcGFyYW0sIGNoZWNrIGlmIGFueSBJRCBzcGVjaWZpZWQgbWF0Y2hlc1xyXG4gICAgICAgIC8vIGFuIGluaXRpYWxpemVJZHMoKSBwcm9taXNlIHdlIGFyZSB3YWl0aW5nIGZvci5cclxuICAgICAgICBpZiAoZ3RhZ1BhcmFtcyAmJiBndGFnUGFyYW1zWydzZW5kX3RvJ10pIHtcclxuICAgICAgICAgICAgbGV0IGdhU2VuZFRvTGlzdCA9IGd0YWdQYXJhbXNbJ3NlbmRfdG8nXTtcclxuICAgICAgICAgICAgLy8gTWFrZSBpdCBhbiBhcnJheSBpZiBpcyBpc24ndCwgc28gaXQgY2FuIGJlIGRlYWx0IHdpdGggdGhlIHNhbWUgd2F5LlxyXG4gICAgICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkoZ2FTZW5kVG9MaXN0KSkge1xyXG4gICAgICAgICAgICAgICAgZ2FTZW5kVG9MaXN0ID0gW2dhU2VuZFRvTGlzdF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gQ2hlY2tpbmcgJ3NlbmRfdG8nIGZpZWxkcyByZXF1aXJlcyBoYXZpbmcgYWxsIG1lYXN1cmVtZW50IElEIHJlc3VsdHMgYmFjayBmcm9tXHJcbiAgICAgICAgICAgIC8vIHRoZSBkeW5hbWljIGNvbmZpZyBmZXRjaC5cclxuICAgICAgICAgICAgY29uc3QgZHluYW1pY0NvbmZpZ1Jlc3VsdHMgPSBhd2FpdCBwcm9taXNlQWxsU2V0dGxlZChkeW5hbWljQ29uZmlnUHJvbWlzZXNMaXN0KTtcclxuICAgICAgICAgICAgZm9yIChjb25zdCBzZW5kVG9JZCBvZiBnYVNlbmRUb0xpc3QpIHtcclxuICAgICAgICAgICAgICAgIC8vIEFueSBmZXRjaGVkIGR5bmFtaWMgbWVhc3VyZW1lbnQgSUQgdGhhdCBtYXRjaGVzIHRoaXMgJ3NlbmRfdG8nIElEXHJcbiAgICAgICAgICAgICAgICBjb25zdCBmb3VuZENvbmZpZyA9IGR5bmFtaWNDb25maWdSZXN1bHRzLmZpbmQoY29uZmlnID0+IGNvbmZpZy5tZWFzdXJlbWVudElkID09PSBzZW5kVG9JZCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpbml0aWFsaXphdGlvblByb21pc2UgPSBmb3VuZENvbmZpZyAmJiBpbml0aWFsaXphdGlvblByb21pc2VzTWFwW2ZvdW5kQ29uZmlnLmFwcElkXTtcclxuICAgICAgICAgICAgICAgIGlmIChpbml0aWFsaXphdGlvblByb21pc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBpbml0aWFsaXphdGlvblByb21pc2VzVG9XYWl0Rm9yLnB1c2goaW5pdGlhbGl6YXRpb25Qcm9taXNlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIEZvdW5kIGFuIGl0ZW0gaW4gJ3NlbmRfdG8nIHRoYXQgaXMgbm90IGFzc29jaWF0ZWRcclxuICAgICAgICAgICAgICAgICAgICAvLyBkaXJlY3RseSB3aXRoIGFuIEZJRCwgcG9zc2libHkgYSBncm91cC4gIEVtcHR5IHRoaXMgYXJyYXksXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gZXhpdCB0aGUgbG9vcCBlYXJseSwgYW5kIGxldCBpdCBnZXQgcG9wdWxhdGVkIGJlbG93LlxyXG4gICAgICAgICAgICAgICAgICAgIGluaXRpYWxpemF0aW9uUHJvbWlzZXNUb1dhaXRGb3IgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBUaGlzIHdpbGwgYmUgdW5wb3B1bGF0ZWQgaWYgdGhlcmUgd2FzIG5vICdzZW5kX3RvJyBmaWVsZCAsIG9yXHJcbiAgICAgICAgLy8gaWYgbm90IGFsbCBlbnRyaWVzIGluIHRoZSAnc2VuZF90bycgZmllbGQgY291bGQgYmUgbWFwcGVkIHRvXHJcbiAgICAgICAgLy8gYSBGSUQuIEluIHRoZXNlIGNhc2VzLCB3YWl0IG9uIGFsbCBwZW5kaW5nIGluaXRpYWxpemF0aW9uIHByb21pc2VzLlxyXG4gICAgICAgIGlmIChpbml0aWFsaXphdGlvblByb21pc2VzVG9XYWl0Rm9yLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICBpbml0aWFsaXphdGlvblByb21pc2VzVG9XYWl0Rm9yID0gT2JqZWN0LnZhbHVlcyhpbml0aWFsaXphdGlvblByb21pc2VzTWFwKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gUnVuIGNvcmUgZ3RhZyBmdW5jdGlvbiB3aXRoIGFyZ3MgYWZ0ZXIgYWxsIHJlbGV2YW50IGluaXRpYWxpemF0aW9uXHJcbiAgICAgICAgLy8gcHJvbWlzZXMgaGF2ZSBiZWVuIHJlc29sdmVkLlxyXG4gICAgICAgIGF3YWl0IFByb21pc2UuYWxsKGluaXRpYWxpemF0aW9uUHJvbWlzZXNUb1dhaXRGb3IpO1xyXG4gICAgICAgIC8vIFdvcmthcm91bmQgZm9yIGh0dHA6Ly9iLzE0MTM3MDQ0OSAtIHRoaXJkIGFyZ3VtZW50IGNhbm5vdCBiZSB1bmRlZmluZWQuXHJcbiAgICAgICAgZ3RhZ0NvcmUoXCJldmVudFwiIC8qIEVWRU5UICovLCBtZWFzdXJlbWVudElkLCBndGFnUGFyYW1zIHx8IHt9KTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgbG9nZ2VyLmVycm9yKGUpO1xyXG4gICAgfVxyXG59XHJcbi8qKlxyXG4gKiBXcmFwcyBhIHN0YW5kYXJkIGd0YWcgZnVuY3Rpb24gd2l0aCBleHRyYSBjb2RlIHRvIHdhaXQgZm9yIGNvbXBsZXRpb24gb2ZcclxuICogcmVsZXZhbnQgaW5pdGlhbGl6YXRpb24gcHJvbWlzZXMgYmVmb3JlIHNlbmRpbmcgcmVxdWVzdHMuXHJcbiAqXHJcbiAqIEBwYXJhbSBndGFnQ29yZSBCYXNpYyBndGFnIGZ1bmN0aW9uIHRoYXQganVzdCBhcHBlbmRzIHRvIGRhdGFMYXllci5cclxuICogQHBhcmFtIGluaXRpYWxpemF0aW9uUHJvbWlzZXNNYXAgTWFwIG9mIGFwcElkcyB0byB0aGVpciBpbml0aWFsaXphdGlvbiBwcm9taXNlcy5cclxuICogQHBhcmFtIGR5bmFtaWNDb25maWdQcm9taXNlc0xpc3QgQXJyYXkgb2YgZHluYW1pYyBjb25maWcgZmV0Y2ggcHJvbWlzZXMuXHJcbiAqIEBwYXJhbSBtZWFzdXJlbWVudElkVG9BcHBJZCBNYXAgb2YgR0EgbWVhc3VyZW1lbnRJRHMgdG8gY29ycmVzcG9uZGluZyBGaXJlYmFzZSBhcHBJZC5cclxuICovXHJcbmZ1bmN0aW9uIHdyYXBHdGFnKGd0YWdDb3JlLCBcclxuLyoqXHJcbiAqIEFsbG93cyB3cmFwcGVkIGd0YWcgY2FsbHMgdG8gd2FpdCBvbiB3aGljaGV2ZXIgaW50aWFsaXphdGlvbiBwcm9taXNlcyBhcmUgcmVxdWlyZWQsXHJcbiAqIGRlcGVuZGluZyBvbiB0aGUgY29udGVudHMgb2YgdGhlIGd0YWcgcGFyYW1zJyBgc2VuZF90b2AgZmllbGQsIGlmIGFueS5cclxuICovXHJcbmluaXRpYWxpemF0aW9uUHJvbWlzZXNNYXAsIFxyXG4vKipcclxuICogV3JhcHBlZCBndGFnIGNhbGxzIHNvbWV0aW1lcyByZXF1aXJlIGFsbCBkeW5hbWljIGNvbmZpZyBmZXRjaGVzIHRvIGhhdmUgcmV0dXJuZWRcclxuICogYmVmb3JlIGRldGVybWluaW5nIHdoYXQgaW5pdGlhbGl6YXRpb24gcHJvbWlzZXMgKHdoaWNoIGluY2x1ZGUgRklEcykgdG8gd2FpdCBmb3IuXHJcbiAqL1xyXG5keW5hbWljQ29uZmlnUHJvbWlzZXNMaXN0LCBcclxuLyoqXHJcbiAqIFdyYXBwZWQgZ3RhZyBjb25maWcgY2FsbHMgY2FuIG5hcnJvdyBkb3duIHdoaWNoIGluaXRpYWxpemF0aW9uIHByb21pc2UgKHdpdGggRklEKVxyXG4gKiB0byB3YWl0IGZvciBpZiB0aGUgbWVhc3VyZW1lbnRJZCBpcyBhbHJlYWR5IGZldGNoZWQsIGJ5IGdldHRpbmcgdGhlIGNvcnJlc3BvbmRpbmcgYXBwSWQsXHJcbiAqIHdoaWNoIGlzIHRoZSBrZXkgZm9yIHRoZSBpbml0aWFsaXphdGlvbiBwcm9taXNlcyBtYXAuXHJcbiAqL1xyXG5tZWFzdXJlbWVudElkVG9BcHBJZCkge1xyXG4gICAgLyoqXHJcbiAgICAgKiBXcmFwcGVyIGFyb3VuZCBndGFnIHRoYXQgZW5zdXJlcyBGSUQgaXMgc2VudCB3aXRoIGd0YWcgY2FsbHMuXHJcbiAgICAgKiBAcGFyYW0gY29tbWFuZCBHdGFnIGNvbW1hbmQgdHlwZS5cclxuICAgICAqIEBwYXJhbSBpZE9yTmFtZU9yUGFyYW1zIE1lYXN1cmVtZW50IElEIGlmIGNvbW1hbmQgaXMgRVZFTlQvQ09ORklHLCBwYXJhbXMgaWYgY29tbWFuZCBpcyBTRVQuXHJcbiAgICAgKiBAcGFyYW0gZ3RhZ1BhcmFtcyBQYXJhbXMgaWYgZXZlbnQgaXMgRVZFTlQvQ09ORklHLlxyXG4gICAgICovXHJcbiAgICBhc3luYyBmdW5jdGlvbiBndGFnV3JhcHBlcihjb21tYW5kLCBpZE9yTmFtZU9yUGFyYW1zLCBndGFnUGFyYW1zKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgLy8gSWYgZXZlbnQsIGNoZWNrIHRoYXQgcmVsZXZhbnQgaW5pdGlhbGl6YXRpb24gcHJvbWlzZXMgaGF2ZSBjb21wbGV0ZWQuXHJcbiAgICAgICAgICAgIGlmIChjb21tYW5kID09PSBcImV2ZW50XCIgLyogRVZFTlQgKi8pIHtcclxuICAgICAgICAgICAgICAgIC8vIElmIEVWRU5ULCBzZWNvbmQgYXJnIG11c3QgYmUgbWVhc3VyZW1lbnRJZC5cclxuICAgICAgICAgICAgICAgIGF3YWl0IGd0YWdPbkV2ZW50KGd0YWdDb3JlLCBpbml0aWFsaXphdGlvblByb21pc2VzTWFwLCBkeW5hbWljQ29uZmlnUHJvbWlzZXNMaXN0LCBpZE9yTmFtZU9yUGFyYW1zLCBndGFnUGFyYW1zKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChjb21tYW5kID09PSBcImNvbmZpZ1wiIC8qIENPTkZJRyAqLykge1xyXG4gICAgICAgICAgICAgICAgLy8gSWYgQ09ORklHLCBzZWNvbmQgYXJnIG11c3QgYmUgbWVhc3VyZW1lbnRJZC5cclxuICAgICAgICAgICAgICAgIGF3YWl0IGd0YWdPbkNvbmZpZyhndGFnQ29yZSwgaW5pdGlhbGl6YXRpb25Qcm9taXNlc01hcCwgZHluYW1pY0NvbmZpZ1Byb21pc2VzTGlzdCwgbWVhc3VyZW1lbnRJZFRvQXBwSWQsIGlkT3JOYW1lT3JQYXJhbXMsIGd0YWdQYXJhbXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGNvbW1hbmQgPT09IFwiY29uc2VudFwiIC8qIENPTlNFTlQgKi8pIHtcclxuICAgICAgICAgICAgICAgIC8vIElmIENPTkZJRywgc2Vjb25kIGFyZyBtdXN0IGJlIG1lYXN1cmVtZW50SWQuXHJcbiAgICAgICAgICAgICAgICBndGFnQ29yZShcImNvbnNlbnRcIiAvKiBDT05TRU5UICovLCAndXBkYXRlJywgZ3RhZ1BhcmFtcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBJZiBTRVQsIHNlY29uZCBhcmcgbXVzdCBiZSBwYXJhbXMuXHJcbiAgICAgICAgICAgICAgICBndGFnQ29yZShcInNldFwiIC8qIFNFVCAqLywgaWRPck5hbWVPclBhcmFtcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBndGFnV3JhcHBlcjtcclxufVxyXG4vKipcclxuICogQ3JlYXRlcyBnbG9iYWwgZ3RhZyBmdW5jdGlvbiBvciB3cmFwcyBleGlzdGluZyBvbmUgaWYgZm91bmQuXHJcbiAqIFRoaXMgd3JhcHBlZCBmdW5jdGlvbiBhdHRhY2hlcyBGaXJlYmFzZSBpbnN0YW5jZSBJRCAoRklEKSB0byBndGFnICdjb25maWcnIGFuZFxyXG4gKiAnZXZlbnQnIGNhbGxzIHRoYXQgYmVsb25nIHRvIHRoZSBHQUlEIGFzc29jaWF0ZWQgd2l0aCB0aGlzIEZpcmViYXNlIGluc3RhbmNlLlxyXG4gKlxyXG4gKiBAcGFyYW0gaW5pdGlhbGl6YXRpb25Qcm9taXNlc01hcCBNYXAgb2YgYXBwSWRzIHRvIHRoZWlyIGluaXRpYWxpemF0aW9uIHByb21pc2VzLlxyXG4gKiBAcGFyYW0gZHluYW1pY0NvbmZpZ1Byb21pc2VzTGlzdCBBcnJheSBvZiBkeW5hbWljIGNvbmZpZyBmZXRjaCBwcm9taXNlcy5cclxuICogQHBhcmFtIG1lYXN1cmVtZW50SWRUb0FwcElkIE1hcCBvZiBHQSBtZWFzdXJlbWVudElEcyB0byBjb3JyZXNwb25kaW5nIEZpcmViYXNlIGFwcElkLlxyXG4gKiBAcGFyYW0gZGF0YUxheWVyTmFtZSBOYW1lIG9mIGdsb2JhbCBHQSBkYXRhbGF5ZXIgYXJyYXkuXHJcbiAqIEBwYXJhbSBndGFnRnVuY3Rpb25OYW1lIE5hbWUgb2YgZ2xvYmFsIGd0YWcgZnVuY3Rpb24gKFwiZ3RhZ1wiIGlmIG5vdCB1c2VyLXNwZWNpZmllZCkuXHJcbiAqL1xyXG5mdW5jdGlvbiB3cmFwT3JDcmVhdGVHdGFnKGluaXRpYWxpemF0aW9uUHJvbWlzZXNNYXAsIGR5bmFtaWNDb25maWdQcm9taXNlc0xpc3QsIG1lYXN1cmVtZW50SWRUb0FwcElkLCBkYXRhTGF5ZXJOYW1lLCBndGFnRnVuY3Rpb25OYW1lKSB7XHJcbiAgICAvLyBDcmVhdGUgYSBiYXNpYyBjb3JlIGd0YWcgZnVuY3Rpb25cclxuICAgIGxldCBndGFnQ29yZSA9IGZ1bmN0aW9uICguLi5fYXJncykge1xyXG4gICAgICAgIC8vIE11c3QgcHVzaCBJQXJndW1lbnRzIG9iamVjdCwgbm90IGFuIGFycmF5LlxyXG4gICAgICAgIHdpbmRvd1tkYXRhTGF5ZXJOYW1lXS5wdXNoKGFyZ3VtZW50cyk7XHJcbiAgICB9O1xyXG4gICAgLy8gUmVwbGFjZSBpdCB3aXRoIGV4aXN0aW5nIG9uZSBpZiBmb3VuZFxyXG4gICAgaWYgKHdpbmRvd1tndGFnRnVuY3Rpb25OYW1lXSAmJlxyXG4gICAgICAgIHR5cGVvZiB3aW5kb3dbZ3RhZ0Z1bmN0aW9uTmFtZV0gPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgZ3RhZ0NvcmUgPSB3aW5kb3dbZ3RhZ0Z1bmN0aW9uTmFtZV07XHJcbiAgICB9XHJcbiAgICB3aW5kb3dbZ3RhZ0Z1bmN0aW9uTmFtZV0gPSB3cmFwR3RhZyhndGFnQ29yZSwgaW5pdGlhbGl6YXRpb25Qcm9taXNlc01hcCwgZHluYW1pY0NvbmZpZ1Byb21pc2VzTGlzdCwgbWVhc3VyZW1lbnRJZFRvQXBwSWQpO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBndGFnQ29yZSxcclxuICAgICAgICB3cmFwcGVkR3RhZzogd2luZG93W2d0YWdGdW5jdGlvbk5hbWVdXHJcbiAgICB9O1xyXG59XHJcbi8qKlxyXG4gKiBSZXR1cm5zIHRoZSBzY3JpcHQgdGFnIGluIHRoZSBET00gbWF0Y2hpbmcgYm90aCB0aGUgZ3RhZyB1cmwgcGF0dGVyblxyXG4gKiBhbmQgdGhlIHByb3ZpZGVkIGRhdGEgbGF5ZXIgbmFtZS5cclxuICovXHJcbmZ1bmN0aW9uIGZpbmRHdGFnU2NyaXB0T25QYWdlKGRhdGFMYXllck5hbWUpIHtcclxuICAgIGNvbnN0IHNjcmlwdFRhZ3MgPSB3aW5kb3cuZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3NjcmlwdCcpO1xyXG4gICAgZm9yIChjb25zdCB0YWcgb2YgT2JqZWN0LnZhbHVlcyhzY3JpcHRUYWdzKSkge1xyXG4gICAgICAgIGlmICh0YWcuc3JjICYmXHJcbiAgICAgICAgICAgIHRhZy5zcmMuaW5jbHVkZXMoR1RBR19VUkwpICYmXHJcbiAgICAgICAgICAgIHRhZy5zcmMuaW5jbHVkZXMoZGF0YUxheWVyTmFtZSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRhZztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5jb25zdCBFUlJPUlMgPSB7XHJcbiAgICBbXCJhbHJlYWR5LWV4aXN0c1wiIC8qIEFMUkVBRFlfRVhJU1RTICovXTogJ0EgRmlyZWJhc2UgQW5hbHl0aWNzIGluc3RhbmNlIHdpdGggdGhlIGFwcElkIHskaWR9ICcgK1xyXG4gICAgICAgICcgYWxyZWFkeSBleGlzdHMuICcgK1xyXG4gICAgICAgICdPbmx5IG9uZSBGaXJlYmFzZSBBbmFseXRpY3MgaW5zdGFuY2UgY2FuIGJlIGNyZWF0ZWQgZm9yIGVhY2ggYXBwSWQuJyxcclxuICAgIFtcImFscmVhZHktaW5pdGlhbGl6ZWRcIiAvKiBBTFJFQURZX0lOSVRJQUxJWkVEICovXTogJ2luaXRpYWxpemVBbmFseXRpY3MoKSBjYW5ub3QgYmUgY2FsbGVkIGFnYWluIHdpdGggZGlmZmVyZW50IG9wdGlvbnMgdGhhbiB0aG9zZSAnICtcclxuICAgICAgICAnaXQgd2FzIGluaXRpYWxseSBjYWxsZWQgd2l0aC4gSXQgY2FuIGJlIGNhbGxlZCBhZ2FpbiB3aXRoIHRoZSBzYW1lIG9wdGlvbnMgdG8gJyArXHJcbiAgICAgICAgJ3JldHVybiB0aGUgZXhpc3RpbmcgaW5zdGFuY2UsIG9yIGdldEFuYWx5dGljcygpIGNhbiBiZSB1c2VkICcgK1xyXG4gICAgICAgICd0byBnZXQgYSByZWZlcmVuY2UgdG8gdGhlIGFscmVhZHktaW50aWFsaXplZCBpbnN0YW5jZS4nLFxyXG4gICAgW1wiYWxyZWFkeS1pbml0aWFsaXplZC1zZXR0aW5nc1wiIC8qIEFMUkVBRFlfSU5JVElBTElaRURfU0VUVElOR1MgKi9dOiAnRmlyZWJhc2UgQW5hbHl0aWNzIGhhcyBhbHJlYWR5IGJlZW4gaW5pdGlhbGl6ZWQuJyArXHJcbiAgICAgICAgJ3NldHRpbmdzKCkgbXVzdCBiZSBjYWxsZWQgYmVmb3JlIGluaXRpYWxpemluZyBhbnkgQW5hbHl0aWNzIGluc3RhbmNlJyArXHJcbiAgICAgICAgJ29yIGl0IHdpbGwgaGF2ZSBubyBlZmZlY3QuJyxcclxuICAgIFtcImludGVyb3AtY29tcG9uZW50LXJlZy1mYWlsZWRcIiAvKiBJTlRFUk9QX0NPTVBPTkVOVF9SRUdfRkFJTEVEICovXTogJ0ZpcmViYXNlIEFuYWx5dGljcyBJbnRlcm9wIENvbXBvbmVudCBmYWlsZWQgdG8gaW5zdGFudGlhdGU6IHskcmVhc29ufScsXHJcbiAgICBbXCJpbnZhbGlkLWFuYWx5dGljcy1jb250ZXh0XCIgLyogSU5WQUxJRF9BTkFMWVRJQ1NfQ09OVEVYVCAqL106ICdGaXJlYmFzZSBBbmFseXRpY3MgaXMgbm90IHN1cHBvcnRlZCBpbiB0aGlzIGVudmlyb25tZW50LiAnICtcclxuICAgICAgICAnV3JhcCBpbml0aWFsaXphdGlvbiBvZiBhbmFseXRpY3MgaW4gYW5hbHl0aWNzLmlzU3VwcG9ydGVkKCkgJyArXHJcbiAgICAgICAgJ3RvIHByZXZlbnQgaW5pdGlhbGl6YXRpb24gaW4gdW5zdXBwb3J0ZWQgZW52aXJvbm1lbnRzLiBEZXRhaWxzOiB7JGVycm9ySW5mb30nLFxyXG4gICAgW1wiaW5kZXhlZGRiLXVuYXZhaWxhYmxlXCIgLyogSU5ERVhFRERCX1VOQVZBSUxBQkxFICovXTogJ0luZGV4ZWREQiB1bmF2YWlsYWJsZSBvciByZXN0cmljdGVkIGluIHRoaXMgZW52aXJvbm1lbnQuICcgK1xyXG4gICAgICAgICdXcmFwIGluaXRpYWxpemF0aW9uIG9mIGFuYWx5dGljcyBpbiBhbmFseXRpY3MuaXNTdXBwb3J0ZWQoKSAnICtcclxuICAgICAgICAndG8gcHJldmVudCBpbml0aWFsaXphdGlvbiBpbiB1bnN1cHBvcnRlZCBlbnZpcm9ubWVudHMuIERldGFpbHM6IHskZXJyb3JJbmZvfScsXHJcbiAgICBbXCJmZXRjaC10aHJvdHRsZVwiIC8qIEZFVENIX1RIUk9UVExFICovXTogJ1RoZSBjb25maWcgZmV0Y2ggcmVxdWVzdCB0aW1lZCBvdXQgd2hpbGUgaW4gYW4gZXhwb25lbnRpYWwgYmFja29mZiBzdGF0ZS4nICtcclxuICAgICAgICAnIFVuaXggdGltZXN0YW1wIGluIG1pbGxpc2Vjb25kcyB3aGVuIGZldGNoIHJlcXVlc3QgdGhyb3R0bGluZyBlbmRzOiB7JHRocm90dGxlRW5kVGltZU1pbGxpc30uJyxcclxuICAgIFtcImNvbmZpZy1mZXRjaC1mYWlsZWRcIiAvKiBDT05GSUdfRkVUQ0hfRkFJTEVEICovXTogJ0R5bmFtaWMgY29uZmlnIGZldGNoIGZhaWxlZDogW3skaHR0cFN0YXR1c31dIHskcmVzcG9uc2VNZXNzYWdlfScsXHJcbiAgICBbXCJuby1hcGkta2V5XCIgLyogTk9fQVBJX0tFWSAqL106ICdUaGUgXCJhcGlLZXlcIiBmaWVsZCBpcyBlbXB0eSBpbiB0aGUgbG9jYWwgRmlyZWJhc2UgY29uZmlnLiBGaXJlYmFzZSBBbmFseXRpY3MgcmVxdWlyZXMgdGhpcyBmaWVsZCB0bycgK1xyXG4gICAgICAgICdjb250YWluIGEgdmFsaWQgQVBJIGtleS4nLFxyXG4gICAgW1wibm8tYXBwLWlkXCIgLyogTk9fQVBQX0lEICovXTogJ1RoZSBcImFwcElkXCIgZmllbGQgaXMgZW1wdHkgaW4gdGhlIGxvY2FsIEZpcmViYXNlIGNvbmZpZy4gRmlyZWJhc2UgQW5hbHl0aWNzIHJlcXVpcmVzIHRoaXMgZmllbGQgdG8nICtcclxuICAgICAgICAnY29udGFpbiBhIHZhbGlkIGFwcCBJRC4nXHJcbn07XHJcbmNvbnN0IEVSUk9SX0ZBQ1RPUlkgPSBuZXcgRXJyb3JGYWN0b3J5KCdhbmFseXRpY3MnLCAnQW5hbHl0aWNzJywgRVJST1JTKTtcblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqXHJcbiAqIEJhY2tvZmYgZmFjdG9yIGZvciA1MDMgZXJyb3JzLCB3aGljaCB3ZSB3YW50IHRvIGJlIGNvbnNlcnZhdGl2ZSBhYm91dFxyXG4gKiB0byBhdm9pZCBvdmVybG9hZGluZyBzZXJ2ZXJzLiBFYWNoIHJldHJ5IGludGVydmFsIHdpbGwgYmVcclxuICogQkFTRV9JTlRFUlZBTF9NSUxMSVMgKiBMT05HX1JFVFJZX0ZBQ1RPUiBeIHJldHJ5Q291bnQsIHNvIHRoZSBzZWNvbmQgb25lXHJcbiAqIHdpbGwgYmUgfjMwIHNlY29uZHMgKHdpdGggZnV6emluZykuXHJcbiAqL1xyXG5jb25zdCBMT05HX1JFVFJZX0ZBQ1RPUiA9IDMwO1xyXG4vKipcclxuICogQmFzZSB3YWl0IGludGVydmFsIHRvIG11bHRpcGxpZWQgYnkgYmFja29mZkZhY3Rvcl5iYWNrb2ZmQ291bnQuXHJcbiAqL1xyXG5jb25zdCBCQVNFX0lOVEVSVkFMX01JTExJUyA9IDEwMDA7XHJcbi8qKlxyXG4gKiBTdHViYmFibGUgcmV0cnkgZGF0YSBzdG9yYWdlIGNsYXNzLlxyXG4gKi9cclxuY2xhc3MgUmV0cnlEYXRhIHtcclxuICAgIGNvbnN0cnVjdG9yKHRocm90dGxlTWV0YWRhdGEgPSB7fSwgaW50ZXJ2YWxNaWxsaXMgPSBCQVNFX0lOVEVSVkFMX01JTExJUykge1xyXG4gICAgICAgIHRoaXMudGhyb3R0bGVNZXRhZGF0YSA9IHRocm90dGxlTWV0YWRhdGE7XHJcbiAgICAgICAgdGhpcy5pbnRlcnZhbE1pbGxpcyA9IGludGVydmFsTWlsbGlzO1xyXG4gICAgfVxyXG4gICAgZ2V0VGhyb3R0bGVNZXRhZGF0YShhcHBJZCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnRocm90dGxlTWV0YWRhdGFbYXBwSWRdO1xyXG4gICAgfVxyXG4gICAgc2V0VGhyb3R0bGVNZXRhZGF0YShhcHBJZCwgbWV0YWRhdGEpIHtcclxuICAgICAgICB0aGlzLnRocm90dGxlTWV0YWRhdGFbYXBwSWRdID0gbWV0YWRhdGE7XHJcbiAgICB9XHJcbiAgICBkZWxldGVUaHJvdHRsZU1ldGFkYXRhKGFwcElkKSB7XHJcbiAgICAgICAgZGVsZXRlIHRoaXMudGhyb3R0bGVNZXRhZGF0YVthcHBJZF07XHJcbiAgICB9XHJcbn1cclxuY29uc3QgZGVmYXVsdFJldHJ5RGF0YSA9IG5ldyBSZXRyeURhdGEoKTtcclxuLyoqXHJcbiAqIFNldCBHRVQgcmVxdWVzdCBoZWFkZXJzLlxyXG4gKiBAcGFyYW0gYXBpS2V5IEFwcCBBUEkga2V5LlxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0SGVhZGVycyhhcGlLZXkpIHtcclxuICAgIHJldHVybiBuZXcgSGVhZGVycyh7XHJcbiAgICAgICAgQWNjZXB0OiAnYXBwbGljYXRpb24vanNvbicsXHJcbiAgICAgICAgJ3gtZ29vZy1hcGkta2V5JzogYXBpS2V5XHJcbiAgICB9KTtcclxufVxyXG4vKipcclxuICogRmV0Y2hlcyBkeW5hbWljIGNvbmZpZyBmcm9tIGJhY2tlbmQuXHJcbiAqIEBwYXJhbSBhcHAgRmlyZWJhc2UgYXBwIHRvIGZldGNoIGNvbmZpZyBmb3IuXHJcbiAqL1xyXG5hc3luYyBmdW5jdGlvbiBmZXRjaER5bmFtaWNDb25maWcoYXBwRmllbGRzKSB7XHJcbiAgICB2YXIgX2E7XHJcbiAgICBjb25zdCB7IGFwcElkLCBhcGlLZXkgfSA9IGFwcEZpZWxkcztcclxuICAgIGNvbnN0IHJlcXVlc3QgPSB7XHJcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICBoZWFkZXJzOiBnZXRIZWFkZXJzKGFwaUtleSlcclxuICAgIH07XHJcbiAgICBjb25zdCBhcHBVcmwgPSBEWU5BTUlDX0NPTkZJR19VUkwucmVwbGFjZSgne2FwcC1pZH0nLCBhcHBJZCk7XHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGFwcFVybCwgcmVxdWVzdCk7XHJcbiAgICBpZiAocmVzcG9uc2Uuc3RhdHVzICE9PSAyMDAgJiYgcmVzcG9uc2Uuc3RhdHVzICE9PSAzMDQpIHtcclxuICAgICAgICBsZXQgZXJyb3JNZXNzYWdlID0gJyc7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgLy8gVHJ5IHRvIGdldCBhbnkgZXJyb3IgbWVzc2FnZSB0ZXh0IGZyb20gc2VydmVyIHJlc3BvbnNlLlxyXG4gICAgICAgICAgICBjb25zdCBqc29uUmVzcG9uc2UgPSAoYXdhaXQgcmVzcG9uc2UuanNvbigpKTtcclxuICAgICAgICAgICAgaWYgKChfYSA9IGpzb25SZXNwb25zZS5lcnJvcikgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLm1lc3NhZ2UpIHtcclxuICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZSA9IGpzb25SZXNwb25zZS5lcnJvci5tZXNzYWdlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIChfaWdub3JlZCkgeyB9XHJcbiAgICAgICAgdGhyb3cgRVJST1JfRkFDVE9SWS5jcmVhdGUoXCJjb25maWctZmV0Y2gtZmFpbGVkXCIgLyogQ09ORklHX0ZFVENIX0ZBSUxFRCAqLywge1xyXG4gICAgICAgICAgICBodHRwU3RhdHVzOiByZXNwb25zZS5zdGF0dXMsXHJcbiAgICAgICAgICAgIHJlc3BvbnNlTWVzc2FnZTogZXJyb3JNZXNzYWdlXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xyXG59XHJcbi8qKlxyXG4gKiBGZXRjaGVzIGR5bmFtaWMgY29uZmlnIGZyb20gYmFja2VuZCwgcmV0cnlpbmcgaWYgZmFpbGVkLlxyXG4gKiBAcGFyYW0gYXBwIEZpcmViYXNlIGFwcCB0byBmZXRjaCBjb25maWcgZm9yLlxyXG4gKi9cclxuYXN5bmMgZnVuY3Rpb24gZmV0Y2hEeW5hbWljQ29uZmlnV2l0aFJldHJ5KGFwcCwgXHJcbi8vIHJldHJ5RGF0YSBhbmQgdGltZW91dE1pbGxpcyBhcmUgcGFyYW1ldGVyaXplZCB0byBhbGxvdyBwYXNzaW5nIGEgZGlmZmVyZW50IHZhbHVlIGZvciB0ZXN0aW5nLlxyXG5yZXRyeURhdGEgPSBkZWZhdWx0UmV0cnlEYXRhLCB0aW1lb3V0TWlsbGlzKSB7XHJcbiAgICBjb25zdCB7IGFwcElkLCBhcGlLZXksIG1lYXN1cmVtZW50SWQgfSA9IGFwcC5vcHRpb25zO1xyXG4gICAgaWYgKCFhcHBJZCkge1xyXG4gICAgICAgIHRocm93IEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKFwibm8tYXBwLWlkXCIgLyogTk9fQVBQX0lEICovKTtcclxuICAgIH1cclxuICAgIGlmICghYXBpS2V5KSB7XHJcbiAgICAgICAgaWYgKG1lYXN1cmVtZW50SWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIG1lYXN1cmVtZW50SWQsXHJcbiAgICAgICAgICAgICAgICBhcHBJZFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aHJvdyBFUlJPUl9GQUNUT1JZLmNyZWF0ZShcIm5vLWFwaS1rZXlcIiAvKiBOT19BUElfS0VZICovKTtcclxuICAgIH1cclxuICAgIGNvbnN0IHRocm90dGxlTWV0YWRhdGEgPSByZXRyeURhdGEuZ2V0VGhyb3R0bGVNZXRhZGF0YShhcHBJZCkgfHwge1xyXG4gICAgICAgIGJhY2tvZmZDb3VudDogMCxcclxuICAgICAgICB0aHJvdHRsZUVuZFRpbWVNaWxsaXM6IERhdGUubm93KClcclxuICAgIH07XHJcbiAgICBjb25zdCBzaWduYWwgPSBuZXcgQW5hbHl0aWNzQWJvcnRTaWduYWwoKTtcclxuICAgIHNldFRpbWVvdXQoYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgIC8vIE5vdGUgYSB2ZXJ5IGxvdyBkZWxheSwgZWcgPCAxMG1zLCBjYW4gZWxhcHNlIGJlZm9yZSBsaXN0ZW5lcnMgYXJlIGluaXRpYWxpemVkLlxyXG4gICAgICAgIHNpZ25hbC5hYm9ydCgpO1xyXG4gICAgfSwgdGltZW91dE1pbGxpcyAhPT0gdW5kZWZpbmVkID8gdGltZW91dE1pbGxpcyA6IEZFVENIX1RJTUVPVVRfTUlMTElTKTtcclxuICAgIHJldHVybiBhdHRlbXB0RmV0Y2hEeW5hbWljQ29uZmlnV2l0aFJldHJ5KHsgYXBwSWQsIGFwaUtleSwgbWVhc3VyZW1lbnRJZCB9LCB0aHJvdHRsZU1ldGFkYXRhLCBzaWduYWwsIHJldHJ5RGF0YSk7XHJcbn1cclxuLyoqXHJcbiAqIFJ1bnMgb25lIHJldHJ5IGF0dGVtcHQuXHJcbiAqIEBwYXJhbSBhcHBGaWVsZHMgTmVjZXNzYXJ5IGFwcCBjb25maWcgZmllbGRzLlxyXG4gKiBAcGFyYW0gdGhyb3R0bGVNZXRhZGF0YSBPbmdvaW5nIG1ldGFkYXRhIHRvIGRldGVybWluZSB0aHJvdHRsaW5nIHRpbWVzLlxyXG4gKiBAcGFyYW0gc2lnbmFsIEFib3J0IHNpZ25hbC5cclxuICovXHJcbmFzeW5jIGZ1bmN0aW9uIGF0dGVtcHRGZXRjaER5bmFtaWNDb25maWdXaXRoUmV0cnkoYXBwRmllbGRzLCB7IHRocm90dGxlRW5kVGltZU1pbGxpcywgYmFja29mZkNvdW50IH0sIHNpZ25hbCwgcmV0cnlEYXRhID0gZGVmYXVsdFJldHJ5RGF0YSAvLyBmb3IgdGVzdGluZ1xyXG4pIHtcclxuICAgIHZhciBfYSwgX2I7XHJcbiAgICBjb25zdCB7IGFwcElkLCBtZWFzdXJlbWVudElkIH0gPSBhcHBGaWVsZHM7XHJcbiAgICAvLyBTdGFydHMgd2l0aCBhIChwb3RlbnRpYWxseSB6ZXJvKSB0aW1lb3V0IHRvIHN1cHBvcnQgcmVzdW1wdGlvbiBmcm9tIHN0b3JlZCBzdGF0ZS5cclxuICAgIC8vIEVuc3VyZXMgdGhlIHRocm90dGxlIGVuZCB0aW1lIGlzIGhvbm9yZWQgaWYgdGhlIGxhc3QgYXR0ZW1wdCB0aW1lZCBvdXQuXHJcbiAgICAvLyBOb3RlIHRoZSBTREsgd2lsbCBuZXZlciBtYWtlIGEgcmVxdWVzdCBpZiB0aGUgZmV0Y2ggdGltZW91dCBleHBpcmVzIGF0IHRoaXMgcG9pbnQuXHJcbiAgICB0cnkge1xyXG4gICAgICAgIGF3YWl0IHNldEFib3J0YWJsZVRpbWVvdXQoc2lnbmFsLCB0aHJvdHRsZUVuZFRpbWVNaWxsaXMpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICBpZiAobWVhc3VyZW1lbnRJZCkge1xyXG4gICAgICAgICAgICBsb2dnZXIud2FybihgVGltZWQgb3V0IGZldGNoaW5nIHRoaXMgRmlyZWJhc2UgYXBwJ3MgbWVhc3VyZW1lbnQgSUQgZnJvbSB0aGUgc2VydmVyLmAgK1xyXG4gICAgICAgICAgICAgICAgYCBGYWxsaW5nIGJhY2sgdG8gdGhlIG1lYXN1cmVtZW50IElEICR7bWVhc3VyZW1lbnRJZH1gICtcclxuICAgICAgICAgICAgICAgIGAgcHJvdmlkZWQgaW4gdGhlIFwibWVhc3VyZW1lbnRJZFwiIGZpZWxkIGluIHRoZSBsb2NhbCBGaXJlYmFzZSBjb25maWcuIFskeyhfYSA9IGUpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5tZXNzYWdlfV1gKTtcclxuICAgICAgICAgICAgcmV0dXJuIHsgYXBwSWQsIG1lYXN1cmVtZW50SWQgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhyb3cgZTtcclxuICAgIH1cclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaER5bmFtaWNDb25maWcoYXBwRmllbGRzKTtcclxuICAgICAgICAvLyBOb3RlIHRoZSBTREsgb25seSBjbGVhcnMgdGhyb3R0bGUgc3RhdGUgaWYgcmVzcG9uc2UgaXMgc3VjY2VzcyBvciBub24tcmV0cmlhYmxlLlxyXG4gICAgICAgIHJldHJ5RGF0YS5kZWxldGVUaHJvdHRsZU1ldGFkYXRhKGFwcElkKTtcclxuICAgICAgICByZXR1cm4gcmVzcG9uc2U7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgIGNvbnN0IGVycm9yID0gZTtcclxuICAgICAgICBpZiAoIWlzUmV0cmlhYmxlRXJyb3IoZXJyb3IpKSB7XHJcbiAgICAgICAgICAgIHJldHJ5RGF0YS5kZWxldGVUaHJvdHRsZU1ldGFkYXRhKGFwcElkKTtcclxuICAgICAgICAgICAgaWYgKG1lYXN1cmVtZW50SWQpIHtcclxuICAgICAgICAgICAgICAgIGxvZ2dlci53YXJuKGBGYWlsZWQgdG8gZmV0Y2ggdGhpcyBGaXJlYmFzZSBhcHAncyBtZWFzdXJlbWVudCBJRCBmcm9tIHRoZSBzZXJ2ZXIuYCArXHJcbiAgICAgICAgICAgICAgICAgICAgYCBGYWxsaW5nIGJhY2sgdG8gdGhlIG1lYXN1cmVtZW50IElEICR7bWVhc3VyZW1lbnRJZH1gICtcclxuICAgICAgICAgICAgICAgICAgICBgIHByb3ZpZGVkIGluIHRoZSBcIm1lYXN1cmVtZW50SWRcIiBmaWVsZCBpbiB0aGUgbG9jYWwgRmlyZWJhc2UgY29uZmlnLiBbJHtlcnJvciA9PT0gbnVsbCB8fCBlcnJvciA9PT0gdm9pZCAwID8gdm9pZCAwIDogZXJyb3IubWVzc2FnZX1dYCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4geyBhcHBJZCwgbWVhc3VyZW1lbnRJZCB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBiYWNrb2ZmTWlsbGlzID0gTnVtYmVyKChfYiA9IGVycm9yID09PSBudWxsIHx8IGVycm9yID09PSB2b2lkIDAgPyB2b2lkIDAgOiBlcnJvci5jdXN0b21EYXRhKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IuaHR0cFN0YXR1cykgPT09IDUwM1xyXG4gICAgICAgICAgICA/IGNhbGN1bGF0ZUJhY2tvZmZNaWxsaXMoYmFja29mZkNvdW50LCByZXRyeURhdGEuaW50ZXJ2YWxNaWxsaXMsIExPTkdfUkVUUllfRkFDVE9SKVxyXG4gICAgICAgICAgICA6IGNhbGN1bGF0ZUJhY2tvZmZNaWxsaXMoYmFja29mZkNvdW50LCByZXRyeURhdGEuaW50ZXJ2YWxNaWxsaXMpO1xyXG4gICAgICAgIC8vIEluY3JlbWVudHMgYmFja29mZiBzdGF0ZS5cclxuICAgICAgICBjb25zdCB0aHJvdHRsZU1ldGFkYXRhID0ge1xyXG4gICAgICAgICAgICB0aHJvdHRsZUVuZFRpbWVNaWxsaXM6IERhdGUubm93KCkgKyBiYWNrb2ZmTWlsbGlzLFxyXG4gICAgICAgICAgICBiYWNrb2ZmQ291bnQ6IGJhY2tvZmZDb3VudCArIDFcclxuICAgICAgICB9O1xyXG4gICAgICAgIC8vIFBlcnNpc3RzIHN0YXRlLlxyXG4gICAgICAgIHJldHJ5RGF0YS5zZXRUaHJvdHRsZU1ldGFkYXRhKGFwcElkLCB0aHJvdHRsZU1ldGFkYXRhKTtcclxuICAgICAgICBsb2dnZXIuZGVidWcoYENhbGxpbmcgYXR0ZW1wdEZldGNoIGFnYWluIGluICR7YmFja29mZk1pbGxpc30gbWlsbGlzYCk7XHJcbiAgICAgICAgcmV0dXJuIGF0dGVtcHRGZXRjaER5bmFtaWNDb25maWdXaXRoUmV0cnkoYXBwRmllbGRzLCB0aHJvdHRsZU1ldGFkYXRhLCBzaWduYWwsIHJldHJ5RGF0YSk7XHJcbiAgICB9XHJcbn1cclxuLyoqXHJcbiAqIFN1cHBvcnRzIHdhaXRpbmcgb24gYSBiYWNrb2ZmIGJ5OlxyXG4gKlxyXG4gKiA8dWw+XHJcbiAqICAgPGxpPlByb21pc2lmeWluZyBzZXRUaW1lb3V0LCBzbyB3ZSBjYW4gc2V0IGEgdGltZW91dCBpbiBvdXIgUHJvbWlzZSBjaGFpbjwvbGk+XHJcbiAqICAgPGxpPkxpc3RlbmluZyBvbiBhIHNpZ25hbCBidXMgZm9yIGFib3J0IGV2ZW50cywganVzdCBsaWtlIHRoZSBGZXRjaCBBUEk8L2xpPlxyXG4gKiAgIDxsaT5GYWlsaW5nIGluIHRoZSBzYW1lIHdheSB0aGUgRmV0Y2ggQVBJIGZhaWxzLCBzbyB0aW1pbmcgb3V0IGEgbGl2ZSByZXF1ZXN0IGFuZCBhIHRocm90dGxlZFxyXG4gKiAgICAgICByZXF1ZXN0IGFwcGVhciB0aGUgc2FtZS48L2xpPlxyXG4gKiA8L3VsPlxyXG4gKlxyXG4gKiA8cD5WaXNpYmxlIGZvciB0ZXN0aW5nLlxyXG4gKi9cclxuZnVuY3Rpb24gc2V0QWJvcnRhYmxlVGltZW91dChzaWduYWwsIHRocm90dGxlRW5kVGltZU1pbGxpcykge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAvLyBEZXJpdmVzIGJhY2tvZmYgZnJvbSBnaXZlbiBlbmQgdGltZSwgbm9ybWFsaXppbmcgbmVnYXRpdmUgbnVtYmVycyB0byB6ZXJvLlxyXG4gICAgICAgIGNvbnN0IGJhY2tvZmZNaWxsaXMgPSBNYXRoLm1heCh0aHJvdHRsZUVuZFRpbWVNaWxsaXMgLSBEYXRlLm5vdygpLCAwKTtcclxuICAgICAgICBjb25zdCB0aW1lb3V0ID0gc2V0VGltZW91dChyZXNvbHZlLCBiYWNrb2ZmTWlsbGlzKTtcclxuICAgICAgICAvLyBBZGRzIGxpc3RlbmVyLCByYXRoZXIgdGhhbiBzZXRzIG9uYWJvcnQsIGJlY2F1c2Ugc2lnbmFsIGlzIGEgc2hhcmVkIG9iamVjdC5cclxuICAgICAgICBzaWduYWwuYWRkRXZlbnRMaXN0ZW5lcigoKSA9PiB7XHJcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcclxuICAgICAgICAgICAgLy8gSWYgdGhlIHJlcXVlc3QgY29tcGxldGVzIGJlZm9yZSB0aGlzIHRpbWVvdXQsIHRoZSByZWplY3Rpb24gaGFzIG5vIGVmZmVjdC5cclxuICAgICAgICAgICAgcmVqZWN0KEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKFwiZmV0Y2gtdGhyb3R0bGVcIiAvKiBGRVRDSF9USFJPVFRMRSAqLywge1xyXG4gICAgICAgICAgICAgICAgdGhyb3R0bGVFbmRUaW1lTWlsbGlzXHJcbiAgICAgICAgICAgIH0pKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59XHJcbi8qKlxyXG4gKiBSZXR1cm5zIHRydWUgaWYgdGhlIHtAbGluayBFcnJvcn0gaW5kaWNhdGVzIGEgZmV0Y2ggcmVxdWVzdCBtYXkgc3VjY2VlZCBsYXRlci5cclxuICovXHJcbmZ1bmN0aW9uIGlzUmV0cmlhYmxlRXJyb3IoZSkge1xyXG4gICAgaWYgKCEoZSBpbnN0YW5jZW9mIEZpcmViYXNlRXJyb3IpIHx8ICFlLmN1c3RvbURhdGEpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICAvLyBVc2VzIHN0cmluZyBpbmRleCBkZWZpbmVkIGJ5IEVycm9yRGF0YSwgd2hpY2ggRmlyZWJhc2VFcnJvciBpbXBsZW1lbnRzLlxyXG4gICAgY29uc3QgaHR0cFN0YXR1cyA9IE51bWJlcihlLmN1c3RvbURhdGFbJ2h0dHBTdGF0dXMnXSk7XHJcbiAgICByZXR1cm4gKGh0dHBTdGF0dXMgPT09IDQyOSB8fFxyXG4gICAgICAgIGh0dHBTdGF0dXMgPT09IDUwMCB8fFxyXG4gICAgICAgIGh0dHBTdGF0dXMgPT09IDUwMyB8fFxyXG4gICAgICAgIGh0dHBTdGF0dXMgPT09IDUwNCk7XHJcbn1cclxuLyoqXHJcbiAqIFNoaW1zIGEgbWluaW1hbCBBYm9ydFNpZ25hbCAoY29waWVkIGZyb20gUmVtb3RlIENvbmZpZykuXHJcbiAqXHJcbiAqIDxwPkFib3J0Q29udHJvbGxlcidzIEFib3J0U2lnbmFsIGNvbnZlbmllbnRseSBkZWNvdXBsZXMgZmV0Y2ggdGltZW91dCBsb2dpYyBmcm9tIG90aGVyIGFzcGVjdHNcclxuICogb2YgbmV0d29ya2luZywgc3VjaCBhcyByZXRyaWVzLiBGaXJlYmFzZSBkb2Vzbid0IHVzZSBBYm9ydENvbnRyb2xsZXIgZW5vdWdoIHRvIGp1c3RpZnkgYVxyXG4gKiBwb2x5ZmlsbCByZWNvbW1lbmRhdGlvbiwgbGlrZSB3ZSBkbyB3aXRoIHRoZSBGZXRjaCBBUEksIGJ1dCB0aGlzIG1pbmltYWwgc2hpbSBjYW4gZWFzaWx5IGJlXHJcbiAqIHN3YXBwZWQgb3V0IGlmL3doZW4gd2UgZG8uXHJcbiAqL1xyXG5jbGFzcyBBbmFseXRpY3NBYm9ydFNpZ25hbCB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmxpc3RlbmVycyA9IFtdO1xyXG4gICAgfVxyXG4gICAgYWRkRXZlbnRMaXN0ZW5lcihsaXN0ZW5lcikge1xyXG4gICAgICAgIHRoaXMubGlzdGVuZXJzLnB1c2gobGlzdGVuZXIpO1xyXG4gICAgfVxyXG4gICAgYWJvcnQoKSB7XHJcbiAgICAgICAgdGhpcy5saXN0ZW5lcnMuZm9yRWFjaChsaXN0ZW5lciA9PiBsaXN0ZW5lcigpKTtcclxuICAgIH1cclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG4vKipcclxuICogRXZlbnQgcGFyYW1ldGVycyB0byBzZXQgb24gJ2d0YWcnIGR1cmluZyBpbml0aWFsaXphdGlvbi5cclxuICovXHJcbmxldCBkZWZhdWx0RXZlbnRQYXJhbWV0ZXJzRm9ySW5pdDtcclxuLyoqXHJcbiAqIExvZ3MgYW4gYW5hbHl0aWNzIGV2ZW50IHRocm91Z2ggdGhlIEZpcmViYXNlIFNESy5cclxuICpcclxuICogQHBhcmFtIGd0YWdGdW5jdGlvbiBXcmFwcGVkIGd0YWcgZnVuY3Rpb24gdGhhdCB3YWl0cyBmb3IgZmlkIHRvIGJlIHNldCBiZWZvcmUgc2VuZGluZyBhbiBldmVudFxyXG4gKiBAcGFyYW0gZXZlbnROYW1lIEdvb2dsZSBBbmFseXRpY3MgZXZlbnQgbmFtZSwgY2hvb3NlIGZyb20gc3RhbmRhcmQgbGlzdCBvciB1c2UgYSBjdXN0b20gc3RyaW5nLlxyXG4gKiBAcGFyYW0gZXZlbnRQYXJhbXMgQW5hbHl0aWNzIGV2ZW50IHBhcmFtZXRlcnMuXHJcbiAqL1xyXG5hc3luYyBmdW5jdGlvbiBsb2dFdmVudCQxKGd0YWdGdW5jdGlvbiwgaW5pdGlhbGl6YXRpb25Qcm9taXNlLCBldmVudE5hbWUsIGV2ZW50UGFyYW1zLCBvcHRpb25zKSB7XHJcbiAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLmdsb2JhbCkge1xyXG4gICAgICAgIGd0YWdGdW5jdGlvbihcImV2ZW50XCIgLyogRVZFTlQgKi8sIGV2ZW50TmFtZSwgZXZlbnRQYXJhbXMpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGNvbnN0IG1lYXN1cmVtZW50SWQgPSBhd2FpdCBpbml0aWFsaXphdGlvblByb21pc2U7XHJcbiAgICAgICAgY29uc3QgcGFyYW1zID0gT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCBldmVudFBhcmFtcyksIHsgJ3NlbmRfdG8nOiBtZWFzdXJlbWVudElkIH0pO1xyXG4gICAgICAgIGd0YWdGdW5jdGlvbihcImV2ZW50XCIgLyogRVZFTlQgKi8sIGV2ZW50TmFtZSwgcGFyYW1zKTtcclxuICAgIH1cclxufVxyXG4vKipcclxuICogU2V0IHNjcmVlbl9uYW1lIHBhcmFtZXRlciBmb3IgdGhpcyBHb29nbGUgQW5hbHl0aWNzIElELlxyXG4gKlxyXG4gKiBAZGVwcmVjYXRlZCBVc2Uge0BsaW5rIGxvZ0V2ZW50fSB3aXRoIGBldmVudE5hbWVgIGFzICdzY3JlZW5fdmlldycgYW5kIGFkZCByZWxldmFudCBgZXZlbnRQYXJhbXNgLlxyXG4gKiBTZWUge0BsaW5rIGh0dHBzOi8vZmlyZWJhc2UuZ29vZ2xlLmNvbS9kb2NzL2FuYWx5dGljcy9zY3JlZW52aWV3cyB8IFRyYWNrIFNjcmVlbnZpZXdzfS5cclxuICpcclxuICogQHBhcmFtIGd0YWdGdW5jdGlvbiBXcmFwcGVkIGd0YWcgZnVuY3Rpb24gdGhhdCB3YWl0cyBmb3IgZmlkIHRvIGJlIHNldCBiZWZvcmUgc2VuZGluZyBhbiBldmVudFxyXG4gKiBAcGFyYW0gc2NyZWVuTmFtZSBTY3JlZW4gbmFtZSBzdHJpbmcgdG8gc2V0LlxyXG4gKi9cclxuYXN5bmMgZnVuY3Rpb24gc2V0Q3VycmVudFNjcmVlbiQxKGd0YWdGdW5jdGlvbiwgaW5pdGlhbGl6YXRpb25Qcm9taXNlLCBzY3JlZW5OYW1lLCBvcHRpb25zKSB7XHJcbiAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLmdsb2JhbCkge1xyXG4gICAgICAgIGd0YWdGdW5jdGlvbihcInNldFwiIC8qIFNFVCAqLywgeyAnc2NyZWVuX25hbWUnOiBzY3JlZW5OYW1lIH0pO1xyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGNvbnN0IG1lYXN1cmVtZW50SWQgPSBhd2FpdCBpbml0aWFsaXphdGlvblByb21pc2U7XHJcbiAgICAgICAgZ3RhZ0Z1bmN0aW9uKFwiY29uZmlnXCIgLyogQ09ORklHICovLCBtZWFzdXJlbWVudElkLCB7XHJcbiAgICAgICAgICAgIHVwZGF0ZTogdHJ1ZSxcclxuICAgICAgICAgICAgJ3NjcmVlbl9uYW1lJzogc2NyZWVuTmFtZVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbi8qKlxyXG4gKiBTZXQgdXNlcl9pZCBwYXJhbWV0ZXIgZm9yIHRoaXMgR29vZ2xlIEFuYWx5dGljcyBJRC5cclxuICpcclxuICogQHBhcmFtIGd0YWdGdW5jdGlvbiBXcmFwcGVkIGd0YWcgZnVuY3Rpb24gdGhhdCB3YWl0cyBmb3IgZmlkIHRvIGJlIHNldCBiZWZvcmUgc2VuZGluZyBhbiBldmVudFxyXG4gKiBAcGFyYW0gaWQgVXNlciBJRCBzdHJpbmcgdG8gc2V0XHJcbiAqL1xyXG5hc3luYyBmdW5jdGlvbiBzZXRVc2VySWQkMShndGFnRnVuY3Rpb24sIGluaXRpYWxpemF0aW9uUHJvbWlzZSwgaWQsIG9wdGlvbnMpIHtcclxuICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMuZ2xvYmFsKSB7XHJcbiAgICAgICAgZ3RhZ0Z1bmN0aW9uKFwic2V0XCIgLyogU0VUICovLCB7ICd1c2VyX2lkJzogaWQgfSk7XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgY29uc3QgbWVhc3VyZW1lbnRJZCA9IGF3YWl0IGluaXRpYWxpemF0aW9uUHJvbWlzZTtcclxuICAgICAgICBndGFnRnVuY3Rpb24oXCJjb25maWdcIiAvKiBDT05GSUcgKi8sIG1lYXN1cmVtZW50SWQsIHtcclxuICAgICAgICAgICAgdXBkYXRlOiB0cnVlLFxyXG4gICAgICAgICAgICAndXNlcl9pZCc6IGlkXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuLyoqXHJcbiAqIFNldCBhbGwgb3RoZXIgdXNlciBwcm9wZXJ0aWVzIG90aGVyIHRoYW4gdXNlcl9pZCBhbmQgc2NyZWVuX25hbWUuXHJcbiAqXHJcbiAqIEBwYXJhbSBndGFnRnVuY3Rpb24gV3JhcHBlZCBndGFnIGZ1bmN0aW9uIHRoYXQgd2FpdHMgZm9yIGZpZCB0byBiZSBzZXQgYmVmb3JlIHNlbmRpbmcgYW4gZXZlbnRcclxuICogQHBhcmFtIHByb3BlcnRpZXMgTWFwIG9mIHVzZXIgcHJvcGVydGllcyB0byBzZXRcclxuICovXHJcbmFzeW5jIGZ1bmN0aW9uIHNldFVzZXJQcm9wZXJ0aWVzJDEoZ3RhZ0Z1bmN0aW9uLCBpbml0aWFsaXphdGlvblByb21pc2UsIHByb3BlcnRpZXMsIG9wdGlvbnMpIHtcclxuICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMuZ2xvYmFsKSB7XHJcbiAgICAgICAgY29uc3QgZmxhdFByb3BlcnRpZXMgPSB7fTtcclxuICAgICAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhwcm9wZXJ0aWVzKSkge1xyXG4gICAgICAgICAgICAvLyB1c2UgZG90IG5vdGF0aW9uIGZvciBtZXJnZSBiZWhhdmlvciBpbiBndGFnLmpzXHJcbiAgICAgICAgICAgIGZsYXRQcm9wZXJ0aWVzW2B1c2VyX3Byb3BlcnRpZXMuJHtrZXl9YF0gPSBwcm9wZXJ0aWVzW2tleV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGd0YWdGdW5jdGlvbihcInNldFwiIC8qIFNFVCAqLywgZmxhdFByb3BlcnRpZXMpO1xyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGNvbnN0IG1lYXN1cmVtZW50SWQgPSBhd2FpdCBpbml0aWFsaXphdGlvblByb21pc2U7XHJcbiAgICAgICAgZ3RhZ0Z1bmN0aW9uKFwiY29uZmlnXCIgLyogQ09ORklHICovLCBtZWFzdXJlbWVudElkLCB7XHJcbiAgICAgICAgICAgIHVwZGF0ZTogdHJ1ZSxcclxuICAgICAgICAgICAgJ3VzZXJfcHJvcGVydGllcyc6IHByb3BlcnRpZXNcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG4vKipcclxuICogU2V0IHdoZXRoZXIgY29sbGVjdGlvbiBpcyBlbmFibGVkIGZvciB0aGlzIElELlxyXG4gKlxyXG4gKiBAcGFyYW0gZW5hYmxlZCBJZiB0cnVlLCBjb2xsZWN0aW9uIGlzIGVuYWJsZWQgZm9yIHRoaXMgSUQuXHJcbiAqL1xyXG5hc3luYyBmdW5jdGlvbiBzZXRBbmFseXRpY3NDb2xsZWN0aW9uRW5hYmxlZCQxKGluaXRpYWxpemF0aW9uUHJvbWlzZSwgZW5hYmxlZCkge1xyXG4gICAgY29uc3QgbWVhc3VyZW1lbnRJZCA9IGF3YWl0IGluaXRpYWxpemF0aW9uUHJvbWlzZTtcclxuICAgIHdpbmRvd1tgZ2EtZGlzYWJsZS0ke21lYXN1cmVtZW50SWR9YF0gPSAhZW5hYmxlZDtcclxufVxyXG4vKipcclxuICogQ29uc2VudCBwYXJhbWV0ZXJzIHRvIGRlZmF1bHQgdG8gZHVyaW5nICdndGFnJyBpbml0aWFsaXphdGlvbi5cclxuICovXHJcbmxldCBkZWZhdWx0Q29uc2VudFNldHRpbmdzRm9ySW5pdDtcclxuLyoqXHJcbiAqIFNldHMgdGhlIHZhcmlhYmxlIHtAbGluayBkZWZhdWx0Q29uc2VudFNldHRpbmdzRm9ySW5pdH0gZm9yIHVzZSBpbiB0aGUgaW5pdGlhbGl6YXRpb24gb2ZcclxuICogYW5hbHl0aWNzLlxyXG4gKlxyXG4gKiBAcGFyYW0gY29uc2VudFNldHRpbmdzIE1hcHMgdGhlIGFwcGxpY2FibGUgZW5kIHVzZXIgY29uc2VudCBzdGF0ZSBmb3IgZ3RhZy5qcy5cclxuICovXHJcbmZ1bmN0aW9uIF9zZXRDb25zZW50RGVmYXVsdEZvckluaXQoY29uc2VudFNldHRpbmdzKSB7XHJcbiAgICBkZWZhdWx0Q29uc2VudFNldHRpbmdzRm9ySW5pdCA9IGNvbnNlbnRTZXR0aW5ncztcclxufVxyXG4vKipcclxuICogU2V0cyB0aGUgdmFyaWFibGUgYGRlZmF1bHRFdmVudFBhcmFtZXRlcnNGb3JJbml0YCBmb3IgdXNlIGluIHRoZSBpbml0aWFsaXphdGlvbiBvZlxyXG4gKiBhbmFseXRpY3MuXHJcbiAqXHJcbiAqIEBwYXJhbSBjdXN0b21QYXJhbXMgQW55IGN1c3RvbSBwYXJhbXMgdGhlIHVzZXIgbWF5IHBhc3MgdG8gZ3RhZy5qcy5cclxuICovXHJcbmZ1bmN0aW9uIF9zZXREZWZhdWx0RXZlbnRQYXJhbWV0ZXJzRm9ySW5pdChjdXN0b21QYXJhbXMpIHtcclxuICAgIGRlZmF1bHRFdmVudFBhcmFtZXRlcnNGb3JJbml0ID0gY3VzdG9tUGFyYW1zO1xyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbmFzeW5jIGZ1bmN0aW9uIHZhbGlkYXRlSW5kZXhlZERCKCkge1xyXG4gICAgdmFyIF9hO1xyXG4gICAgaWYgKCFpc0luZGV4ZWREQkF2YWlsYWJsZSgpKSB7XHJcbiAgICAgICAgbG9nZ2VyLndhcm4oRVJST1JfRkFDVE9SWS5jcmVhdGUoXCJpbmRleGVkZGItdW5hdmFpbGFibGVcIiAvKiBJTkRFWEVEREJfVU5BVkFJTEFCTEUgKi8sIHtcclxuICAgICAgICAgICAgZXJyb3JJbmZvOiAnSW5kZXhlZERCIGlzIG5vdCBhdmFpbGFibGUgaW4gdGhpcyBlbnZpcm9ubWVudC4nXHJcbiAgICAgICAgfSkubWVzc2FnZSk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgYXdhaXQgdmFsaWRhdGVJbmRleGVkREJPcGVuYWJsZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICBsb2dnZXIud2FybihFUlJPUl9GQUNUT1JZLmNyZWF0ZShcImluZGV4ZWRkYi11bmF2YWlsYWJsZVwiIC8qIElOREVYRUREQl9VTkFWQUlMQUJMRSAqLywge1xyXG4gICAgICAgICAgICAgICAgZXJyb3JJbmZvOiAoX2EgPSBlKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EudG9TdHJpbmcoKVxyXG4gICAgICAgICAgICB9KS5tZXNzYWdlKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB0cnVlO1xyXG59XHJcbi8qKlxyXG4gKiBJbml0aWFsaXplIHRoZSBhbmFseXRpY3MgaW5zdGFuY2UgaW4gZ3RhZy5qcyBieSBjYWxsaW5nIGNvbmZpZyBjb21tYW5kIHdpdGggZmlkLlxyXG4gKlxyXG4gKiBOT1RFOiBXZSBjb21iaW5lIGFuYWx5dGljcyBpbml0aWFsaXphdGlvbiBhbmQgc2V0dGluZyBmaWQgdG9nZXRoZXIgYmVjYXVzZSB3ZSB3YW50IGZpZCB0byBiZVxyXG4gKiBwYXJ0IG9mIHRoZSBgcGFnZV92aWV3YCBldmVudCB0aGF0J3Mgc2VudCBkdXJpbmcgdGhlIGluaXRpYWxpemF0aW9uXHJcbiAqIEBwYXJhbSBhcHAgRmlyZWJhc2UgYXBwXHJcbiAqIEBwYXJhbSBndGFnQ29yZSBUaGUgZ3RhZyBmdW5jdGlvbiB0aGF0J3Mgbm90IHdyYXBwZWQuXHJcbiAqIEBwYXJhbSBkeW5hbWljQ29uZmlnUHJvbWlzZXNMaXN0IEFycmF5IG9mIGFsbCBkeW5hbWljIGNvbmZpZyBwcm9taXNlcy5cclxuICogQHBhcmFtIG1lYXN1cmVtZW50SWRUb0FwcElkIE1hcHMgbWVhc3VyZW1lbnRJRCB0byBhcHBJRC5cclxuICogQHBhcmFtIGluc3RhbGxhdGlvbnMgX0ZpcmViYXNlSW5zdGFsbGF0aW9uc0ludGVybmFsIGluc3RhbmNlLlxyXG4gKlxyXG4gKiBAcmV0dXJucyBNZWFzdXJlbWVudCBJRC5cclxuICovXHJcbmFzeW5jIGZ1bmN0aW9uIF9pbml0aWFsaXplQW5hbHl0aWNzKGFwcCwgZHluYW1pY0NvbmZpZ1Byb21pc2VzTGlzdCwgbWVhc3VyZW1lbnRJZFRvQXBwSWQsIGluc3RhbGxhdGlvbnMsIGd0YWdDb3JlLCBkYXRhTGF5ZXJOYW1lLCBvcHRpb25zKSB7XHJcbiAgICB2YXIgX2E7XHJcbiAgICBjb25zdCBkeW5hbWljQ29uZmlnUHJvbWlzZSA9IGZldGNoRHluYW1pY0NvbmZpZ1dpdGhSZXRyeShhcHApO1xyXG4gICAgLy8gT25jZSBmZXRjaGVkLCBtYXAgbWVhc3VyZW1lbnRJZHMgdG8gYXBwSWQsIGZvciBlYXNlIG9mIGxvb2t1cCBpbiB3cmFwcGVkIGd0YWcgZnVuY3Rpb24uXHJcbiAgICBkeW5hbWljQ29uZmlnUHJvbWlzZVxyXG4gICAgICAgIC50aGVuKGNvbmZpZyA9PiB7XHJcbiAgICAgICAgbWVhc3VyZW1lbnRJZFRvQXBwSWRbY29uZmlnLm1lYXN1cmVtZW50SWRdID0gY29uZmlnLmFwcElkO1xyXG4gICAgICAgIGlmIChhcHAub3B0aW9ucy5tZWFzdXJlbWVudElkICYmXHJcbiAgICAgICAgICAgIGNvbmZpZy5tZWFzdXJlbWVudElkICE9PSBhcHAub3B0aW9ucy5tZWFzdXJlbWVudElkKSB7XHJcbiAgICAgICAgICAgIGxvZ2dlci53YXJuKGBUaGUgbWVhc3VyZW1lbnQgSUQgaW4gdGhlIGxvY2FsIEZpcmViYXNlIGNvbmZpZyAoJHthcHAub3B0aW9ucy5tZWFzdXJlbWVudElkfSlgICtcclxuICAgICAgICAgICAgICAgIGAgZG9lcyBub3QgbWF0Y2ggdGhlIG1lYXN1cmVtZW50IElEIGZldGNoZWQgZnJvbSB0aGUgc2VydmVyICgke2NvbmZpZy5tZWFzdXJlbWVudElkfSkuYCArXHJcbiAgICAgICAgICAgICAgICBgIFRvIGVuc3VyZSBhbmFseXRpY3MgZXZlbnRzIGFyZSBhbHdheXMgc2VudCB0byB0aGUgY29ycmVjdCBBbmFseXRpY3MgcHJvcGVydHksYCArXHJcbiAgICAgICAgICAgICAgICBgIHVwZGF0ZSB0aGVgICtcclxuICAgICAgICAgICAgICAgIGAgbWVhc3VyZW1lbnQgSUQgZmllbGQgaW4gdGhlIGxvY2FsIGNvbmZpZyBvciByZW1vdmUgaXQgZnJvbSB0aGUgbG9jYWwgY29uZmlnLmApO1xyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKGUgPT4gbG9nZ2VyLmVycm9yKGUpKTtcclxuICAgIC8vIEFkZCB0byBsaXN0IHRvIHRyYWNrIHN0YXRlIG9mIGFsbCBkeW5hbWljIGNvbmZpZyBwcm9taXNlcy5cclxuICAgIGR5bmFtaWNDb25maWdQcm9taXNlc0xpc3QucHVzaChkeW5hbWljQ29uZmlnUHJvbWlzZSk7XHJcbiAgICBjb25zdCBmaWRQcm9taXNlID0gdmFsaWRhdGVJbmRleGVkREIoKS50aGVuKGVudklzVmFsaWQgPT4ge1xyXG4gICAgICAgIGlmIChlbnZJc1ZhbGlkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBpbnN0YWxsYXRpb25zLmdldElkKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgY29uc3QgW2R5bmFtaWNDb25maWcsIGZpZF0gPSBhd2FpdCBQcm9taXNlLmFsbChbXHJcbiAgICAgICAgZHluYW1pY0NvbmZpZ1Byb21pc2UsXHJcbiAgICAgICAgZmlkUHJvbWlzZVxyXG4gICAgXSk7XHJcbiAgICAvLyBEZXRlY3QgaWYgdXNlciBoYXMgYWxyZWFkeSBwdXQgdGhlIGd0YWcgPHNjcmlwdD4gdGFnIG9uIHRoaXMgcGFnZSB3aXRoIHRoZSBwYXNzZWQgaW5cclxuICAgIC8vIGRhdGEgbGF5ZXIgbmFtZS5cclxuICAgIGlmICghZmluZEd0YWdTY3JpcHRPblBhZ2UoZGF0YUxheWVyTmFtZSkpIHtcclxuICAgICAgICBpbnNlcnRTY3JpcHRUYWcoZGF0YUxheWVyTmFtZSwgZHluYW1pY0NvbmZpZy5tZWFzdXJlbWVudElkKTtcclxuICAgIH1cclxuICAgIC8vIERldGVjdHMgaWYgdGhlcmUgYXJlIGNvbnNlbnQgc2V0dGluZ3MgdGhhdCBuZWVkIHRvIGJlIGNvbmZpZ3VyZWQuXHJcbiAgICBpZiAoZGVmYXVsdENvbnNlbnRTZXR0aW5nc0ZvckluaXQpIHtcclxuICAgICAgICBndGFnQ29yZShcImNvbnNlbnRcIiAvKiBDT05TRU5UICovLCAnZGVmYXVsdCcsIGRlZmF1bHRDb25zZW50U2V0dGluZ3NGb3JJbml0KTtcclxuICAgICAgICBfc2V0Q29uc2VudERlZmF1bHRGb3JJbml0KHVuZGVmaW5lZCk7XHJcbiAgICB9XHJcbiAgICAvLyBUaGlzIGNvbW1hbmQgaW5pdGlhbGl6ZXMgZ3RhZy5qcyBhbmQgb25seSBuZWVkcyB0byBiZSBjYWxsZWQgb25jZSBmb3IgdGhlIGVudGlyZSB3ZWIgYXBwLFxyXG4gICAgLy8gYnV0IHNpbmNlIGl0IGlzIGlkZW1wb3RlbnQsIHdlIGNhbiBjYWxsIGl0IG11bHRpcGxlIHRpbWVzLlxyXG4gICAgLy8gV2Uga2VlcCBpdCB0b2dldGhlciB3aXRoIG90aGVyIGluaXRpYWxpemF0aW9uIGxvZ2ljIGZvciBiZXR0ZXIgY29kZSBzdHJ1Y3R1cmUuXHJcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxyXG4gICAgZ3RhZ0NvcmUoJ2pzJywgbmV3IERhdGUoKSk7XHJcbiAgICAvLyBVc2VyIGNvbmZpZyBhZGRlZCBmaXJzdC4gV2UgZG9uJ3Qgd2FudCB1c2VycyB0byBhY2NpZGVudGFsbHkgb3ZlcndyaXRlXHJcbiAgICAvLyBiYXNlIEZpcmViYXNlIGNvbmZpZyBwcm9wZXJ0aWVzLlxyXG4gICAgY29uc3QgY29uZmlnUHJvcGVydGllcyA9IChfYSA9IG9wdGlvbnMgPT09IG51bGwgfHwgb3B0aW9ucyA9PT0gdm9pZCAwID8gdm9pZCAwIDogb3B0aW9ucy5jb25maWcpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IHt9O1xyXG4gICAgLy8gZ3VhcmQgYWdhaW5zdCBkZXZlbG9wZXJzIGFjY2lkZW50YWxseSBzZXR0aW5nIHByb3BlcnRpZXMgd2l0aCBwcmVmaXggYGZpcmViYXNlX2BcclxuICAgIGNvbmZpZ1Byb3BlcnRpZXNbT1JJR0lOX0tFWV0gPSAnZmlyZWJhc2UnO1xyXG4gICAgY29uZmlnUHJvcGVydGllcy51cGRhdGUgPSB0cnVlO1xyXG4gICAgaWYgKGZpZCAhPSBudWxsKSB7XHJcbiAgICAgICAgY29uZmlnUHJvcGVydGllc1tHQV9GSURfS0VZXSA9IGZpZDtcclxuICAgIH1cclxuICAgIC8vIEl0IHNob3VsZCBiZSB0aGUgZmlyc3QgY29uZmlnIGNvbW1hbmQgY2FsbGVkIG9uIHRoaXMgR0EtSURcclxuICAgIC8vIEluaXRpYWxpemUgdGhpcyBHQS1JRCBhbmQgc2V0IEZJRCBvbiBpdCB1c2luZyB0aGUgZ3RhZyBjb25maWcgQVBJLlxyXG4gICAgLy8gTm90ZTogVGhpcyB3aWxsIHRyaWdnZXIgYSBwYWdlX3ZpZXcgZXZlbnQgdW5sZXNzICdzZW5kX3BhZ2VfdmlldycgaXMgc2V0IHRvIGZhbHNlIGluXHJcbiAgICAvLyBgY29uZmlnUHJvcGVydGllc2AuXHJcbiAgICBndGFnQ29yZShcImNvbmZpZ1wiIC8qIENPTkZJRyAqLywgZHluYW1pY0NvbmZpZy5tZWFzdXJlbWVudElkLCBjb25maWdQcm9wZXJ0aWVzKTtcclxuICAgIC8vIERldGVjdHMgaWYgdGhlcmUgaXMgZGF0YSB0aGF0IHdpbGwgYmUgc2V0IG9uIGV2ZXJ5IGV2ZW50IGxvZ2dlZCBmcm9tIHRoZSBTREsuXHJcbiAgICBpZiAoZGVmYXVsdEV2ZW50UGFyYW1ldGVyc0ZvckluaXQpIHtcclxuICAgICAgICBndGFnQ29yZShcInNldFwiIC8qIFNFVCAqLywgZGVmYXVsdEV2ZW50UGFyYW1ldGVyc0ZvckluaXQpO1xyXG4gICAgICAgIF9zZXREZWZhdWx0RXZlbnRQYXJhbWV0ZXJzRm9ySW5pdCh1bmRlZmluZWQpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGR5bmFtaWNDb25maWcubWVhc3VyZW1lbnRJZDtcclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG4vKipcclxuICogQW5hbHl0aWNzIFNlcnZpY2UgY2xhc3MuXHJcbiAqL1xyXG5jbGFzcyBBbmFseXRpY3NTZXJ2aWNlIHtcclxuICAgIGNvbnN0cnVjdG9yKGFwcCkge1xyXG4gICAgICAgIHRoaXMuYXBwID0gYXBwO1xyXG4gICAgfVxyXG4gICAgX2RlbGV0ZSgpIHtcclxuICAgICAgICBkZWxldGUgaW5pdGlhbGl6YXRpb25Qcm9taXNlc01hcFt0aGlzLmFwcC5vcHRpb25zLmFwcElkXTtcclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgICB9XHJcbn1cclxuLyoqXHJcbiAqIE1hcHMgYXBwSWQgdG8gZnVsbCBpbml0aWFsaXphdGlvbiBwcm9taXNlLiBXcmFwcGVkIGd0YWcgY2FsbHMgbXVzdCB3YWl0IG9uXHJcbiAqIGFsbCBvciBzb21lIG9mIHRoZXNlLCBkZXBlbmRpbmcgb24gdGhlIGNhbGwncyBgc2VuZF90b2AgcGFyYW0gYW5kIHRoZSBzdGF0dXNcclxuICogb2YgdGhlIGR5bmFtaWMgY29uZmlnIGZldGNoZXMgKHNlZSBiZWxvdykuXHJcbiAqL1xyXG5sZXQgaW5pdGlhbGl6YXRpb25Qcm9taXNlc01hcCA9IHt9O1xyXG4vKipcclxuICogTGlzdCBvZiBkeW5hbWljIGNvbmZpZyBmZXRjaCBwcm9taXNlcy4gSW4gY2VydGFpbiBjYXNlcywgd3JhcHBlZCBndGFnIGNhbGxzXHJcbiAqIHdhaXQgb24gYWxsIHRoZXNlIHRvIGJlIGNvbXBsZXRlIGluIG9yZGVyIHRvIGRldGVybWluZSBpZiBpdCBjYW4gc2VsZWN0aXZlbHlcclxuICogd2FpdCBmb3Igb25seSBjZXJ0YWluIGluaXRpYWxpemF0aW9uIChGSUQpIHByb21pc2VzIG9yIGlmIGl0IG11c3Qgd2FpdCBmb3IgYWxsLlxyXG4gKi9cclxubGV0IGR5bmFtaWNDb25maWdQcm9taXNlc0xpc3QgPSBbXTtcclxuLyoqXHJcbiAqIE1hcHMgZmV0Y2hlZCBtZWFzdXJlbWVudElkcyB0byBhcHBJZC4gUG9wdWxhdGVkIHdoZW4gdGhlIGFwcCdzIGR5bmFtaWMgY29uZmlnXHJcbiAqIGZldGNoIGNvbXBsZXRlcy4gSWYgYWxyZWFkeSBwb3B1bGF0ZWQsIGd0YWcgY29uZmlnIGNhbGxzIGNhbiB1c2UgdGhpcyB0b1xyXG4gKiBzZWxlY3RpdmVseSB3YWl0IGZvciBvbmx5IHRoaXMgYXBwJ3MgaW5pdGlhbGl6YXRpb24gcHJvbWlzZSAoRklEKSBpbnN0ZWFkIG9mIGFsbFxyXG4gKiBpbml0aWFsaXphdGlvbiBwcm9taXNlcy5cclxuICovXHJcbmNvbnN0IG1lYXN1cmVtZW50SWRUb0FwcElkID0ge307XHJcbi8qKlxyXG4gKiBOYW1lIGZvciB3aW5kb3cgZ2xvYmFsIGRhdGEgbGF5ZXIgYXJyYXkgdXNlZCBieSBHQTogZGVmYXVsdHMgdG8gJ2RhdGFMYXllcicuXHJcbiAqL1xyXG5sZXQgZGF0YUxheWVyTmFtZSA9ICdkYXRhTGF5ZXInO1xyXG4vKipcclxuICogTmFtZSBmb3Igd2luZG93IGdsb2JhbCBndGFnIGZ1bmN0aW9uIHVzZWQgYnkgR0E6IGRlZmF1bHRzIHRvICdndGFnJy5cclxuICovXHJcbmxldCBndGFnTmFtZSA9ICdndGFnJztcclxuLyoqXHJcbiAqIFJlcHJvZHVjdGlvbiBvZiBzdGFuZGFyZCBndGFnIGZ1bmN0aW9uIG9yIHJlZmVyZW5jZSB0byBleGlzdGluZ1xyXG4gKiBndGFnIGZ1bmN0aW9uIG9uIHdpbmRvdyBvYmplY3QuXHJcbiAqL1xyXG5sZXQgZ3RhZ0NvcmVGdW5jdGlvbjtcclxuLyoqXHJcbiAqIFdyYXBwZXIgYXJvdW5kIGd0YWcgZnVuY3Rpb24gdGhhdCBlbnN1cmVzIEZJRCBpcyBzZW50IHdpdGggYWxsXHJcbiAqIHJlbGV2YW50IGV2ZW50IGFuZCBjb25maWcgY2FsbHMuXHJcbiAqL1xyXG5sZXQgd3JhcHBlZEd0YWdGdW5jdGlvbjtcclxuLyoqXHJcbiAqIEZsYWcgdG8gZW5zdXJlIHBhZ2UgaW5pdGlhbGl6YXRpb24gc3RlcHMgKGNyZWF0aW9uIG9yIHdyYXBwaW5nIG9mXHJcbiAqIGRhdGFMYXllciBhbmQgZ3RhZyBzY3JpcHQpIGFyZSBvbmx5IHJ1biBvbmNlIHBlciBwYWdlIGxvYWQuXHJcbiAqL1xyXG5sZXQgZ2xvYmFsSW5pdERvbmUgPSBmYWxzZTtcclxuLyoqXHJcbiAqIENvbmZpZ3VyZXMgRmlyZWJhc2UgQW5hbHl0aWNzIHRvIHVzZSBjdXN0b20gYGd0YWdgIG9yIGBkYXRhTGF5ZXJgIG5hbWVzLlxyXG4gKiBJbnRlbmRlZCB0byBiZSB1c2VkIGlmIGBndGFnLmpzYCBzY3JpcHQgaGFzIGJlZW4gaW5zdGFsbGVkIG9uXHJcbiAqIHRoaXMgcGFnZSBpbmRlcGVuZGVudGx5IG9mIEZpcmViYXNlIEFuYWx5dGljcywgYW5kIGlzIHVzaW5nIG5vbi1kZWZhdWx0XHJcbiAqIG5hbWVzIGZvciBlaXRoZXIgdGhlIGBndGFnYCBmdW5jdGlvbiBvciBmb3IgYGRhdGFMYXllcmAuXHJcbiAqIE11c3QgYmUgY2FsbGVkIGJlZm9yZSBjYWxsaW5nIGBnZXRBbmFseXRpY3MoKWAgb3IgaXQgd29uJ3RcclxuICogaGF2ZSBhbnkgZWZmZWN0LlxyXG4gKlxyXG4gKiBAcHVibGljXHJcbiAqXHJcbiAqIEBwYXJhbSBvcHRpb25zIC0gQ3VzdG9tIGd0YWcgYW5kIGRhdGFMYXllciBuYW1lcy5cclxuICovXHJcbmZ1bmN0aW9uIHNldHRpbmdzKG9wdGlvbnMpIHtcclxuICAgIGlmIChnbG9iYWxJbml0RG9uZSkge1xyXG4gICAgICAgIHRocm93IEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKFwiYWxyZWFkeS1pbml0aWFsaXplZFwiIC8qIEFMUkVBRFlfSU5JVElBTElaRUQgKi8pO1xyXG4gICAgfVxyXG4gICAgaWYgKG9wdGlvbnMuZGF0YUxheWVyTmFtZSkge1xyXG4gICAgICAgIGRhdGFMYXllck5hbWUgPSBvcHRpb25zLmRhdGFMYXllck5hbWU7XHJcbiAgICB9XHJcbiAgICBpZiAob3B0aW9ucy5ndGFnTmFtZSkge1xyXG4gICAgICAgIGd0YWdOYW1lID0gb3B0aW9ucy5ndGFnTmFtZTtcclxuICAgIH1cclxufVxyXG4vKipcclxuICogUmV0dXJucyB0cnVlIGlmIG5vIGVudmlyb25tZW50IG1pc21hdGNoIGlzIGZvdW5kLlxyXG4gKiBJZiBlbnZpcm9ubWVudCBtaXNtYXRjaGVzIGFyZSBmb3VuZCwgdGhyb3dzIGFuIElOVkFMSURfQU5BTFlUSUNTX0NPTlRFWFRcclxuICogZXJyb3IgdGhhdCBhbHNvIGxpc3RzIGRldGFpbHMgZm9yIGVhY2ggbWlzbWF0Y2ggZm91bmQuXHJcbiAqL1xyXG5mdW5jdGlvbiB3YXJuT25Ccm93c2VyQ29udGV4dE1pc21hdGNoKCkge1xyXG4gICAgY29uc3QgbWlzbWF0Y2hlZEVudk1lc3NhZ2VzID0gW107XHJcbiAgICBpZiAoaXNCcm93c2VyRXh0ZW5zaW9uKCkpIHtcclxuICAgICAgICBtaXNtYXRjaGVkRW52TWVzc2FnZXMucHVzaCgnVGhpcyBpcyBhIGJyb3dzZXIgZXh0ZW5zaW9uIGVudmlyb25tZW50LicpO1xyXG4gICAgfVxyXG4gICAgaWYgKCFhcmVDb29raWVzRW5hYmxlZCgpKSB7XHJcbiAgICAgICAgbWlzbWF0Y2hlZEVudk1lc3NhZ2VzLnB1c2goJ0Nvb2tpZXMgYXJlIG5vdCBhdmFpbGFibGUuJyk7XHJcbiAgICB9XHJcbiAgICBpZiAobWlzbWF0Y2hlZEVudk1lc3NhZ2VzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICBjb25zdCBkZXRhaWxzID0gbWlzbWF0Y2hlZEVudk1lc3NhZ2VzXHJcbiAgICAgICAgICAgIC5tYXAoKG1lc3NhZ2UsIGluZGV4KSA9PiBgKCR7aW5kZXggKyAxfSkgJHttZXNzYWdlfWApXHJcbiAgICAgICAgICAgIC5qb2luKCcgJyk7XHJcbiAgICAgICAgY29uc3QgZXJyID0gRVJST1JfRkFDVE9SWS5jcmVhdGUoXCJpbnZhbGlkLWFuYWx5dGljcy1jb250ZXh0XCIgLyogSU5WQUxJRF9BTkFMWVRJQ1NfQ09OVEVYVCAqLywge1xyXG4gICAgICAgICAgICBlcnJvckluZm86IGRldGFpbHNcclxuICAgICAgICB9KTtcclxuICAgICAgICBsb2dnZXIud2FybihlcnIubWVzc2FnZSk7XHJcbiAgICB9XHJcbn1cclxuLyoqXHJcbiAqIEFuYWx5dGljcyBpbnN0YW5jZSBmYWN0b3J5LlxyXG4gKiBAaW50ZXJuYWxcclxuICovXHJcbmZ1bmN0aW9uIGZhY3RvcnkoYXBwLCBpbnN0YWxsYXRpb25zLCBvcHRpb25zKSB7XHJcbiAgICB3YXJuT25Ccm93c2VyQ29udGV4dE1pc21hdGNoKCk7XHJcbiAgICBjb25zdCBhcHBJZCA9IGFwcC5vcHRpb25zLmFwcElkO1xyXG4gICAgaWYgKCFhcHBJZCkge1xyXG4gICAgICAgIHRocm93IEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKFwibm8tYXBwLWlkXCIgLyogTk9fQVBQX0lEICovKTtcclxuICAgIH1cclxuICAgIGlmICghYXBwLm9wdGlvbnMuYXBpS2V5KSB7XHJcbiAgICAgICAgaWYgKGFwcC5vcHRpb25zLm1lYXN1cmVtZW50SWQpIHtcclxuICAgICAgICAgICAgbG9nZ2VyLndhcm4oYFRoZSBcImFwaUtleVwiIGZpZWxkIGlzIGVtcHR5IGluIHRoZSBsb2NhbCBGaXJlYmFzZSBjb25maWcuIFRoaXMgaXMgbmVlZGVkIHRvIGZldGNoIHRoZSBsYXRlc3RgICtcclxuICAgICAgICAgICAgICAgIGAgbWVhc3VyZW1lbnQgSUQgZm9yIHRoaXMgRmlyZWJhc2UgYXBwLiBGYWxsaW5nIGJhY2sgdG8gdGhlIG1lYXN1cmVtZW50IElEICR7YXBwLm9wdGlvbnMubWVhc3VyZW1lbnRJZH1gICtcclxuICAgICAgICAgICAgICAgIGAgcHJvdmlkZWQgaW4gdGhlIFwibWVhc3VyZW1lbnRJZFwiIGZpZWxkIGluIHRoZSBsb2NhbCBGaXJlYmFzZSBjb25maWcuYCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBFUlJPUl9GQUNUT1JZLmNyZWF0ZShcIm5vLWFwaS1rZXlcIiAvKiBOT19BUElfS0VZICovKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAoaW5pdGlhbGl6YXRpb25Qcm9taXNlc01hcFthcHBJZF0gIT0gbnVsbCkge1xyXG4gICAgICAgIHRocm93IEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKFwiYWxyZWFkeS1leGlzdHNcIiAvKiBBTFJFQURZX0VYSVNUUyAqLywge1xyXG4gICAgICAgICAgICBpZDogYXBwSWRcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGlmICghZ2xvYmFsSW5pdERvbmUpIHtcclxuICAgICAgICAvLyBTdGVwcyBoZXJlIHNob3VsZCBvbmx5IGJlIGRvbmUgb25jZSBwZXIgcGFnZTogY3JlYXRpb24gb3Igd3JhcHBpbmdcclxuICAgICAgICAvLyBvZiBkYXRhTGF5ZXIgYW5kIGdsb2JhbCBndGFnIGZ1bmN0aW9uLlxyXG4gICAgICAgIGdldE9yQ3JlYXRlRGF0YUxheWVyKGRhdGFMYXllck5hbWUpO1xyXG4gICAgICAgIGNvbnN0IHsgd3JhcHBlZEd0YWcsIGd0YWdDb3JlIH0gPSB3cmFwT3JDcmVhdGVHdGFnKGluaXRpYWxpemF0aW9uUHJvbWlzZXNNYXAsIGR5bmFtaWNDb25maWdQcm9taXNlc0xpc3QsIG1lYXN1cmVtZW50SWRUb0FwcElkLCBkYXRhTGF5ZXJOYW1lLCBndGFnTmFtZSk7XHJcbiAgICAgICAgd3JhcHBlZEd0YWdGdW5jdGlvbiA9IHdyYXBwZWRHdGFnO1xyXG4gICAgICAgIGd0YWdDb3JlRnVuY3Rpb24gPSBndGFnQ29yZTtcclxuICAgICAgICBnbG9iYWxJbml0RG9uZSA9IHRydWU7XHJcbiAgICB9XHJcbiAgICAvLyBBc3luYyBidXQgbm9uLWJsb2NraW5nLlxyXG4gICAgLy8gVGhpcyBtYXAgcmVmbGVjdHMgdGhlIGNvbXBsZXRpb24gc3RhdGUgb2YgYWxsIHByb21pc2VzIGZvciBlYWNoIGFwcElkLlxyXG4gICAgaW5pdGlhbGl6YXRpb25Qcm9taXNlc01hcFthcHBJZF0gPSBfaW5pdGlhbGl6ZUFuYWx5dGljcyhhcHAsIGR5bmFtaWNDb25maWdQcm9taXNlc0xpc3QsIG1lYXN1cmVtZW50SWRUb0FwcElkLCBpbnN0YWxsYXRpb25zLCBndGFnQ29yZUZ1bmN0aW9uLCBkYXRhTGF5ZXJOYW1lLCBvcHRpb25zKTtcclxuICAgIGNvbnN0IGFuYWx5dGljc0luc3RhbmNlID0gbmV3IEFuYWx5dGljc1NlcnZpY2UoYXBwKTtcclxuICAgIHJldHVybiBhbmFseXRpY3NJbnN0YW5jZTtcclxufVxuXG4vKiBlc2xpbnQtZGlzYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55ICovXHJcbi8qKlxyXG4gKiBSZXR1cm5zIGFuIHtAbGluayBBbmFseXRpY3N9IGluc3RhbmNlIGZvciB0aGUgZ2l2ZW4gYXBwLlxyXG4gKlxyXG4gKiBAcHVibGljXHJcbiAqXHJcbiAqIEBwYXJhbSBhcHAgLSBUaGUge0BsaW5rIEBmaXJlYmFzZS9hcHAjRmlyZWJhc2VBcHB9IHRvIHVzZS5cclxuICovXHJcbmZ1bmN0aW9uIGdldEFuYWx5dGljcyhhcHAgPSBnZXRBcHAoKSkge1xyXG4gICAgYXBwID0gZ2V0TW9kdWxhckluc3RhbmNlKGFwcCk7XHJcbiAgICAvLyBEZXBlbmRlbmNpZXNcclxuICAgIGNvbnN0IGFuYWx5dGljc1Byb3ZpZGVyID0gX2dldFByb3ZpZGVyKGFwcCwgQU5BTFlUSUNTX1RZUEUpO1xyXG4gICAgaWYgKGFuYWx5dGljc1Byb3ZpZGVyLmlzSW5pdGlhbGl6ZWQoKSkge1xyXG4gICAgICAgIHJldHVybiBhbmFseXRpY3NQcm92aWRlci5nZXRJbW1lZGlhdGUoKTtcclxuICAgIH1cclxuICAgIHJldHVybiBpbml0aWFsaXplQW5hbHl0aWNzKGFwcCk7XHJcbn1cclxuLyoqXHJcbiAqIFJldHVybnMgYW4ge0BsaW5rIEFuYWx5dGljc30gaW5zdGFuY2UgZm9yIHRoZSBnaXZlbiBhcHAuXHJcbiAqXHJcbiAqIEBwdWJsaWNcclxuICpcclxuICogQHBhcmFtIGFwcCAtIFRoZSB7QGxpbmsgQGZpcmViYXNlL2FwcCNGaXJlYmFzZUFwcH0gdG8gdXNlLlxyXG4gKi9cclxuZnVuY3Rpb24gaW5pdGlhbGl6ZUFuYWx5dGljcyhhcHAsIG9wdGlvbnMgPSB7fSkge1xyXG4gICAgLy8gRGVwZW5kZW5jaWVzXHJcbiAgICBjb25zdCBhbmFseXRpY3NQcm92aWRlciA9IF9nZXRQcm92aWRlcihhcHAsIEFOQUxZVElDU19UWVBFKTtcclxuICAgIGlmIChhbmFseXRpY3NQcm92aWRlci5pc0luaXRpYWxpemVkKCkpIHtcclxuICAgICAgICBjb25zdCBleGlzdGluZ0luc3RhbmNlID0gYW5hbHl0aWNzUHJvdmlkZXIuZ2V0SW1tZWRpYXRlKCk7XHJcbiAgICAgICAgaWYgKGRlZXBFcXVhbChvcHRpb25zLCBhbmFseXRpY3NQcm92aWRlci5nZXRPcHRpb25zKCkpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBleGlzdGluZ0luc3RhbmNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgRVJST1JfRkFDVE9SWS5jcmVhdGUoXCJhbHJlYWR5LWluaXRpYWxpemVkXCIgLyogQUxSRUFEWV9JTklUSUFMSVpFRCAqLyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgY29uc3QgYW5hbHl0aWNzSW5zdGFuY2UgPSBhbmFseXRpY3NQcm92aWRlci5pbml0aWFsaXplKHsgb3B0aW9ucyB9KTtcclxuICAgIHJldHVybiBhbmFseXRpY3NJbnN0YW5jZTtcclxufVxyXG4vKipcclxuICogVGhpcyBpcyBhIHB1YmxpYyBzdGF0aWMgbWV0aG9kIHByb3ZpZGVkIHRvIHVzZXJzIHRoYXQgd3JhcHMgZm91ciBkaWZmZXJlbnQgY2hlY2tzOlxyXG4gKlxyXG4gKiAxLiBDaGVjayBpZiBpdCdzIG5vdCBhIGJyb3dzZXIgZXh0ZW5zaW9uIGVudmlyb25tZW50LlxyXG4gKiAyLiBDaGVjayBpZiBjb29raWVzIGFyZSBlbmFibGVkIGluIGN1cnJlbnQgYnJvd3Nlci5cclxuICogMy4gQ2hlY2sgaWYgSW5kZXhlZERCIGlzIHN1cHBvcnRlZCBieSB0aGUgYnJvd3NlciBlbnZpcm9ubWVudC5cclxuICogNC4gQ2hlY2sgaWYgdGhlIGN1cnJlbnQgYnJvd3NlciBjb250ZXh0IGlzIHZhbGlkIGZvciB1c2luZyBgSW5kZXhlZERCLm9wZW4oKWAuXHJcbiAqXHJcbiAqIEBwdWJsaWNcclxuICpcclxuICovXHJcbmFzeW5jIGZ1bmN0aW9uIGlzU3VwcG9ydGVkKCkge1xyXG4gICAgaWYgKGlzQnJvd3NlckV4dGVuc2lvbigpKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgaWYgKCFhcmVDb29raWVzRW5hYmxlZCgpKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgaWYgKCFpc0luZGV4ZWREQkF2YWlsYWJsZSgpKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zdCBpc0RCT3BlbmFibGUgPSBhd2FpdCB2YWxpZGF0ZUluZGV4ZWREQk9wZW5hYmxlKCk7XHJcbiAgICAgICAgcmV0dXJuIGlzREJPcGVuYWJsZTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxufVxyXG4vKipcclxuICogVXNlIGd0YWcgYGNvbmZpZ2AgY29tbWFuZCB0byBzZXQgYHNjcmVlbl9uYW1lYC5cclxuICpcclxuICogQHB1YmxpY1xyXG4gKlxyXG4gKiBAZGVwcmVjYXRlZCBVc2Uge0BsaW5rIGxvZ0V2ZW50fSB3aXRoIGBldmVudE5hbWVgIGFzICdzY3JlZW5fdmlldycgYW5kIGFkZCByZWxldmFudCBgZXZlbnRQYXJhbXNgLlxyXG4gKiBTZWUge0BsaW5rIGh0dHBzOi8vZmlyZWJhc2UuZ29vZ2xlLmNvbS9kb2NzL2FuYWx5dGljcy9zY3JlZW52aWV3cyB8IFRyYWNrIFNjcmVlbnZpZXdzfS5cclxuICpcclxuICogQHBhcmFtIGFuYWx5dGljc0luc3RhbmNlIC0gVGhlIHtAbGluayBBbmFseXRpY3N9IGluc3RhbmNlLlxyXG4gKiBAcGFyYW0gc2NyZWVuTmFtZSAtIFNjcmVlbiBuYW1lIHRvIHNldC5cclxuICovXHJcbmZ1bmN0aW9uIHNldEN1cnJlbnRTY3JlZW4oYW5hbHl0aWNzSW5zdGFuY2UsIHNjcmVlbk5hbWUsIG9wdGlvbnMpIHtcclxuICAgIGFuYWx5dGljc0luc3RhbmNlID0gZ2V0TW9kdWxhckluc3RhbmNlKGFuYWx5dGljc0luc3RhbmNlKTtcclxuICAgIHNldEN1cnJlbnRTY3JlZW4kMSh3cmFwcGVkR3RhZ0Z1bmN0aW9uLCBpbml0aWFsaXphdGlvblByb21pc2VzTWFwW2FuYWx5dGljc0luc3RhbmNlLmFwcC5vcHRpb25zLmFwcElkXSwgc2NyZWVuTmFtZSwgb3B0aW9ucykuY2F0Y2goZSA9PiBsb2dnZXIuZXJyb3IoZSkpO1xyXG59XHJcbi8qKlxyXG4gKiBVc2UgZ3RhZyBgY29uZmlnYCBjb21tYW5kIHRvIHNldCBgdXNlcl9pZGAuXHJcbiAqXHJcbiAqIEBwdWJsaWNcclxuICpcclxuICogQHBhcmFtIGFuYWx5dGljc0luc3RhbmNlIC0gVGhlIHtAbGluayBBbmFseXRpY3N9IGluc3RhbmNlLlxyXG4gKiBAcGFyYW0gaWQgLSBVc2VyIElEIHRvIHNldC5cclxuICovXHJcbmZ1bmN0aW9uIHNldFVzZXJJZChhbmFseXRpY3NJbnN0YW5jZSwgaWQsIG9wdGlvbnMpIHtcclxuICAgIGFuYWx5dGljc0luc3RhbmNlID0gZ2V0TW9kdWxhckluc3RhbmNlKGFuYWx5dGljc0luc3RhbmNlKTtcclxuICAgIHNldFVzZXJJZCQxKHdyYXBwZWRHdGFnRnVuY3Rpb24sIGluaXRpYWxpemF0aW9uUHJvbWlzZXNNYXBbYW5hbHl0aWNzSW5zdGFuY2UuYXBwLm9wdGlvbnMuYXBwSWRdLCBpZCwgb3B0aW9ucykuY2F0Y2goZSA9PiBsb2dnZXIuZXJyb3IoZSkpO1xyXG59XHJcbi8qKlxyXG4gKiBVc2UgZ3RhZyBgY29uZmlnYCBjb21tYW5kIHRvIHNldCBhbGwgcGFyYW1zIHNwZWNpZmllZC5cclxuICpcclxuICogQHB1YmxpY1xyXG4gKi9cclxuZnVuY3Rpb24gc2V0VXNlclByb3BlcnRpZXMoYW5hbHl0aWNzSW5zdGFuY2UsIHByb3BlcnRpZXMsIG9wdGlvbnMpIHtcclxuICAgIGFuYWx5dGljc0luc3RhbmNlID0gZ2V0TW9kdWxhckluc3RhbmNlKGFuYWx5dGljc0luc3RhbmNlKTtcclxuICAgIHNldFVzZXJQcm9wZXJ0aWVzJDEod3JhcHBlZEd0YWdGdW5jdGlvbiwgaW5pdGlhbGl6YXRpb25Qcm9taXNlc01hcFthbmFseXRpY3NJbnN0YW5jZS5hcHAub3B0aW9ucy5hcHBJZF0sIHByb3BlcnRpZXMsIG9wdGlvbnMpLmNhdGNoKGUgPT4gbG9nZ2VyLmVycm9yKGUpKTtcclxufVxyXG4vKipcclxuICogU2V0cyB3aGV0aGVyIEdvb2dsZSBBbmFseXRpY3MgY29sbGVjdGlvbiBpcyBlbmFibGVkIGZvciB0aGlzIGFwcCBvbiB0aGlzIGRldmljZS5cclxuICogU2V0cyBnbG9iYWwgYHdpbmRvd1snZ2EtZGlzYWJsZS1hbmFseXRpY3NJZCddID0gdHJ1ZTtgXHJcbiAqXHJcbiAqIEBwdWJsaWNcclxuICpcclxuICogQHBhcmFtIGFuYWx5dGljc0luc3RhbmNlIC0gVGhlIHtAbGluayBBbmFseXRpY3N9IGluc3RhbmNlLlxyXG4gKiBAcGFyYW0gZW5hYmxlZCAtIElmIHRydWUsIGVuYWJsZXMgY29sbGVjdGlvbiwgaWYgZmFsc2UsIGRpc2FibGVzIGl0LlxyXG4gKi9cclxuZnVuY3Rpb24gc2V0QW5hbHl0aWNzQ29sbGVjdGlvbkVuYWJsZWQoYW5hbHl0aWNzSW5zdGFuY2UsIGVuYWJsZWQpIHtcclxuICAgIGFuYWx5dGljc0luc3RhbmNlID0gZ2V0TW9kdWxhckluc3RhbmNlKGFuYWx5dGljc0luc3RhbmNlKTtcclxuICAgIHNldEFuYWx5dGljc0NvbGxlY3Rpb25FbmFibGVkJDEoaW5pdGlhbGl6YXRpb25Qcm9taXNlc01hcFthbmFseXRpY3NJbnN0YW5jZS5hcHAub3B0aW9ucy5hcHBJZF0sIGVuYWJsZWQpLmNhdGNoKGUgPT4gbG9nZ2VyLmVycm9yKGUpKTtcclxufVxyXG4vKipcclxuICogQWRkcyBkYXRhIHRoYXQgd2lsbCBiZSBzZXQgb24gZXZlcnkgZXZlbnQgbG9nZ2VkIGZyb20gdGhlIFNESywgaW5jbHVkaW5nIGF1dG9tYXRpYyBvbmVzLlxyXG4gKiBXaXRoIGd0YWcncyBcInNldFwiIGNvbW1hbmQsIHRoZSB2YWx1ZXMgcGFzc2VkIHBlcnNpc3Qgb24gdGhlIGN1cnJlbnQgcGFnZSBhbmQgYXJlIHBhc3NlZCB3aXRoXHJcbiAqIGFsbCBzdWJzZXF1ZW50IGV2ZW50cy5cclxuICogQHB1YmxpY1xyXG4gKiBAcGFyYW0gY3VzdG9tUGFyYW1zIC0gQW55IGN1c3RvbSBwYXJhbXMgdGhlIHVzZXIgbWF5IHBhc3MgdG8gZ3RhZy5qcy5cclxuICovXHJcbmZ1bmN0aW9uIHNldERlZmF1bHRFdmVudFBhcmFtZXRlcnMoY3VzdG9tUGFyYW1zKSB7XHJcbiAgICAvLyBDaGVjayBpZiByZWZlcmVuY2UgdG8gZXhpc3RpbmcgZ3RhZyBmdW5jdGlvbiBvbiB3aW5kb3cgb2JqZWN0IGV4aXN0c1xyXG4gICAgaWYgKHdyYXBwZWRHdGFnRnVuY3Rpb24pIHtcclxuICAgICAgICB3cmFwcGVkR3RhZ0Z1bmN0aW9uKFwic2V0XCIgLyogU0VUICovLCBjdXN0b21QYXJhbXMpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgX3NldERlZmF1bHRFdmVudFBhcmFtZXRlcnNGb3JJbml0KGN1c3RvbVBhcmFtcyk7XHJcbiAgICB9XHJcbn1cclxuLyoqXHJcbiAqIFNlbmRzIGEgR29vZ2xlIEFuYWx5dGljcyBldmVudCB3aXRoIGdpdmVuIGBldmVudFBhcmFtc2AuIFRoaXMgbWV0aG9kXHJcbiAqIGF1dG9tYXRpY2FsbHkgYXNzb2NpYXRlcyB0aGlzIGxvZ2dlZCBldmVudCB3aXRoIHRoaXMgRmlyZWJhc2Ugd2ViXHJcbiAqIGFwcCBpbnN0YW5jZSBvbiB0aGlzIGRldmljZS5cclxuICogTGlzdCBvZiBvZmZpY2lhbCBldmVudCBwYXJhbWV0ZXJzIGNhbiBiZSBmb3VuZCBpbiB0aGUgZ3RhZy5qc1xyXG4gKiByZWZlcmVuY2UgZG9jdW1lbnRhdGlvbjpcclxuICoge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL2d0YWdqcy9yZWZlcmVuY2UvZ2E0LWV2ZW50c1xyXG4gKiB8IHRoZSBHQTQgcmVmZXJlbmNlIGRvY3VtZW50YXRpb259LlxyXG4gKlxyXG4gKiBAcHVibGljXHJcbiAqL1xyXG5mdW5jdGlvbiBsb2dFdmVudChhbmFseXRpY3NJbnN0YW5jZSwgZXZlbnROYW1lLCBldmVudFBhcmFtcywgb3B0aW9ucykge1xyXG4gICAgYW5hbHl0aWNzSW5zdGFuY2UgPSBnZXRNb2R1bGFySW5zdGFuY2UoYW5hbHl0aWNzSW5zdGFuY2UpO1xyXG4gICAgbG9nRXZlbnQkMSh3cmFwcGVkR3RhZ0Z1bmN0aW9uLCBpbml0aWFsaXphdGlvblByb21pc2VzTWFwW2FuYWx5dGljc0luc3RhbmNlLmFwcC5vcHRpb25zLmFwcElkXSwgZXZlbnROYW1lLCBldmVudFBhcmFtcywgb3B0aW9ucykuY2F0Y2goZSA9PiBsb2dnZXIuZXJyb3IoZSkpO1xyXG59XHJcbi8qKlxyXG4gKiBTZXRzIHRoZSBhcHBsaWNhYmxlIGVuZCB1c2VyIGNvbnNlbnQgc3RhdGUgZm9yIHRoaXMgd2ViIGFwcCBhY3Jvc3MgYWxsIGd0YWcgcmVmZXJlbmNlcyBvbmNlXHJcbiAqIEZpcmViYXNlIEFuYWx5dGljcyBpcyBpbml0aWFsaXplZC5cclxuICpcclxuICogVXNlIHRoZSB7QGxpbmsgQ29uc2VudFNldHRpbmdzfSB0byBzcGVjaWZ5IGluZGl2aWR1YWwgY29uc2VudCB0eXBlIHZhbHVlcy4gQnkgZGVmYXVsdCBjb25zZW50XHJcbiAqIHR5cGVzIGFyZSBzZXQgdG8gXCJncmFudGVkXCIuXHJcbiAqIEBwdWJsaWNcclxuICogQHBhcmFtIGNvbnNlbnRTZXR0aW5ncyAtIE1hcHMgdGhlIGFwcGxpY2FibGUgZW5kIHVzZXIgY29uc2VudCBzdGF0ZSBmb3IgZ3RhZy5qcy5cclxuICovXHJcbmZ1bmN0aW9uIHNldENvbnNlbnQoY29uc2VudFNldHRpbmdzKSB7XHJcbiAgICAvLyBDaGVjayBpZiByZWZlcmVuY2UgdG8gZXhpc3RpbmcgZ3RhZyBmdW5jdGlvbiBvbiB3aW5kb3cgb2JqZWN0IGV4aXN0c1xyXG4gICAgaWYgKHdyYXBwZWRHdGFnRnVuY3Rpb24pIHtcclxuICAgICAgICB3cmFwcGVkR3RhZ0Z1bmN0aW9uKFwiY29uc2VudFwiIC8qIENPTlNFTlQgKi8sICd1cGRhdGUnLCBjb25zZW50U2V0dGluZ3MpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgX3NldENvbnNlbnREZWZhdWx0Rm9ySW5pdChjb25zZW50U2V0dGluZ3MpO1xyXG4gICAgfVxyXG59XG5cbmNvbnN0IG5hbWUgPSBcIkBmaXJlYmFzZS9hbmFseXRpY3NcIjtcbmNvbnN0IHZlcnNpb24gPSBcIjAuOC4zXCI7XG5cbi8qKlxyXG4gKiBGaXJlYmFzZSBBbmFseXRpY3NcclxuICpcclxuICogQHBhY2thZ2VEb2N1bWVudGF0aW9uXHJcbiAqL1xyXG5mdW5jdGlvbiByZWdpc3RlckFuYWx5dGljcygpIHtcclxuICAgIF9yZWdpc3RlckNvbXBvbmVudChuZXcgQ29tcG9uZW50KEFOQUxZVElDU19UWVBFLCAoY29udGFpbmVyLCB7IG9wdGlvbnM6IGFuYWx5dGljc09wdGlvbnMgfSkgPT4ge1xyXG4gICAgICAgIC8vIGdldEltbWVkaWF0ZSBmb3IgRmlyZWJhc2VBcHAgd2lsbCBhbHdheXMgc3VjY2VlZFxyXG4gICAgICAgIGNvbnN0IGFwcCA9IGNvbnRhaW5lci5nZXRQcm92aWRlcignYXBwJykuZ2V0SW1tZWRpYXRlKCk7XHJcbiAgICAgICAgY29uc3QgaW5zdGFsbGF0aW9ucyA9IGNvbnRhaW5lclxyXG4gICAgICAgICAgICAuZ2V0UHJvdmlkZXIoJ2luc3RhbGxhdGlvbnMtaW50ZXJuYWwnKVxyXG4gICAgICAgICAgICAuZ2V0SW1tZWRpYXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIGZhY3RvcnkoYXBwLCBpbnN0YWxsYXRpb25zLCBhbmFseXRpY3NPcHRpb25zKTtcclxuICAgIH0sIFwiUFVCTElDXCIgLyogUFVCTElDICovKSk7XHJcbiAgICBfcmVnaXN0ZXJDb21wb25lbnQobmV3IENvbXBvbmVudCgnYW5hbHl0aWNzLWludGVybmFsJywgaW50ZXJuYWxGYWN0b3J5LCBcIlBSSVZBVEVcIiAvKiBQUklWQVRFICovKSk7XHJcbiAgICByZWdpc3RlclZlcnNpb24obmFtZSwgdmVyc2lvbik7XHJcbiAgICAvLyBCVUlMRF9UQVJHRVQgd2lsbCBiZSByZXBsYWNlZCBieSB2YWx1ZXMgbGlrZSBlc201LCBlc20yMDE3LCBjanM1LCBldGMgZHVyaW5nIHRoZSBjb21waWxhdGlvblxyXG4gICAgcmVnaXN0ZXJWZXJzaW9uKG5hbWUsIHZlcnNpb24sICdlc20yMDE3Jyk7XHJcbiAgICBmdW5jdGlvbiBpbnRlcm5hbEZhY3RvcnkoY29udGFpbmVyKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgYW5hbHl0aWNzID0gY29udGFpbmVyLmdldFByb3ZpZGVyKEFOQUxZVElDU19UWVBFKS5nZXRJbW1lZGlhdGUoKTtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIGxvZ0V2ZW50OiAoZXZlbnROYW1lLCBldmVudFBhcmFtcywgb3B0aW9ucykgPT4gbG9nRXZlbnQoYW5hbHl0aWNzLCBldmVudE5hbWUsIGV2ZW50UGFyYW1zLCBvcHRpb25zKVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICB0aHJvdyBFUlJPUl9GQUNUT1JZLmNyZWF0ZShcImludGVyb3AtY29tcG9uZW50LXJlZy1mYWlsZWRcIiAvKiBJTlRFUk9QX0NPTVBPTkVOVF9SRUdfRkFJTEVEICovLCB7XHJcbiAgICAgICAgICAgICAgICByZWFzb246IGVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbnJlZ2lzdGVyQW5hbHl0aWNzKCk7XG5cbmV4cG9ydCB7IGdldEFuYWx5dGljcywgaW5pdGlhbGl6ZUFuYWx5dGljcywgaXNTdXBwb3J0ZWQsIGxvZ0V2ZW50LCBzZXRBbmFseXRpY3NDb2xsZWN0aW9uRW5hYmxlZCwgc2V0Q29uc2VudCwgc2V0Q3VycmVudFNjcmVlbiwgc2V0RGVmYXVsdEV2ZW50UGFyYW1ldGVycywgc2V0VXNlcklkLCBzZXRVc2VyUHJvcGVydGllcywgc2V0dGluZ3MgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmVzbTIwMTcuanMubWFwXG4iLCIvLyB0aGlzIGlzIHdoZXJlIHdlIGNhbiBoYXZlIHRoZSBjbGFzc2VzIGFuZCBmdW5jdGlvbnMgZm9yIGJ1aWxkaW5nIHRoZSBldmVudHNcbi8vIHRvIHNlbmQgdG8gYW4gYW5hbHl0aWNzIHJlY29yZGVyIChmaXJlYmFzZT8gbHJzPylcblxuaW1wb3J0IHsgcURhdGEsIGFuc3dlckRhdGEgfSBmcm9tICcuLi9jb21wb25lbnRzL3F1ZXN0aW9uRGF0YSc7XG5pbXBvcnQgeyBsb2dFdmVudCB9IGZyb20gJ2ZpcmViYXNlL2FuYWx5dGljcyc7XG5pbXBvcnQgeyBidWNrZXQgfSBmcm9tICcuLi9hc3Nlc3NtZW50L2J1Y2tldERhdGEnO1xuXG4vLyBDcmVhdGUgYSBzaW5nbGV0b24gY2xhc3MgZm9yIHRoZSBhbmFseXRpY3MgZXZlbnRzXG5leHBvcnQgY2xhc3MgQW5hbHl0aWNzRXZlbnRzIHtcbiAgcHJvdGVjdGVkIHN0YXRpYyB1dWlkOiBzdHJpbmc7XG4gIHByb3RlY3RlZCBzdGF0aWMgdXNlclNvdXJjZTogc3RyaW5nO1xuICBwcm90ZWN0ZWQgc3RhdGljIGNsYXQ7XG4gIHByb3RlY3RlZCBzdGF0aWMgY2xvbjtcbiAgcHJvdGVjdGVkIHN0YXRpYyBnYW5hO1xuICBwcm90ZWN0ZWQgc3RhdGljIGxhdGxvbmc7XG4gIC8vIHZhciBjaXR5LCByZWdpb24sIGNvdW50cnk7XG4gIHByb3RlY3RlZCBzdGF0aWMgZGF0YVVSTDtcblxuICBwcm90ZWN0ZWQgc3RhdGljIGFwcFZlcnNpb247XG4gIHByb3RlY3RlZCBzdGF0aWMgY29udGVudFZlcnNpb247XG5cbiAgcHJvdGVjdGVkIHN0YXRpYyBhc3Nlc3NtZW50VHlwZTogc3RyaW5nO1xuXG4gIHN0YXRpYyBpbnN0YW5jZTogQW5hbHl0aWNzRXZlbnRzO1xuXG4gIHByaXZhdGUgY29uc3RydWN0b3IoKSB7XG4gICAgLy8gSW5pdGlhbGl6ZSB0aGUgY2xhc3NcbiAgfVxuXG4gIHN0YXRpYyBnZXRJbnN0YW5jZSgpOiBBbmFseXRpY3NFdmVudHMge1xuICAgIGlmICghQW5hbHl0aWNzRXZlbnRzLmluc3RhbmNlKSB7XG4gICAgICBBbmFseXRpY3NFdmVudHMuaW5zdGFuY2UgPSBuZXcgQW5hbHl0aWNzRXZlbnRzKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIEFuYWx5dGljc0V2ZW50cy5pbnN0YW5jZTtcbiAgfVxuXG4gIHN0YXRpYyBzZXRBc3Nlc3NtZW50VHlwZShhc3Nlc3NtZW50VHlwZTogc3RyaW5nKTogdm9pZCB7XG4gICAgQW5hbHl0aWNzRXZlbnRzLmFzc2Vzc21lbnRUeXBlID0gYXNzZXNzbWVudFR5cGU7XG4gIH1cblxuICAvLyBHZXQgTG9jYXRpb25cbiAgc3RhdGljIGdldExvY2F0aW9uKCk6IHZvaWQge1xuICAgIGNvbnNvbGUubG9nKCdzdGFydGluZyB0byBnZXQgbG9jYXRpb24nKTtcbiAgICBmZXRjaChgaHR0cHM6Ly9pcGluZm8uaW8vanNvbj90b2tlbj1iNjI2ODcyNzE3ODYxMGApXG4gICAgICAudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coJ2dvdCBsb2NhdGlvbiByZXNwb25zZScpO1xuICAgICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICAgICAgdGhyb3cgRXJyb3IocmVzcG9uc2Uuc3RhdHVzVGV4dCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcbiAgICAgIH0pXG4gICAgICAudGhlbigoanNvblJlc3BvbnNlKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKGpzb25SZXNwb25zZSk7XG4gICAgICAgIEFuYWx5dGljc0V2ZW50cy5sYXRsb25nID0ganNvblJlc3BvbnNlLmxvYztcbiAgICAgICAgdmFyIGxwaWVjZXMgPSBBbmFseXRpY3NFdmVudHMubGF0bG9uZy5zcGxpdCgnLCcpO1xuICAgICAgICB2YXIgbGF0ID0gcGFyc2VGbG9hdChscGllY2VzWzBdKS50b0ZpeGVkKDIpO1xuICAgICAgICB2YXIgbG9uID0gcGFyc2VGbG9hdChscGllY2VzWzFdKS50b0ZpeGVkKDEpO1xuICAgICAgICBBbmFseXRpY3NFdmVudHMuY2xhdCA9IGxhdDtcbiAgICAgICAgQW5hbHl0aWNzRXZlbnRzLmNsb24gPSBsb247XG4gICAgICAgIEFuYWx5dGljc0V2ZW50cy5sYXRsb25nID0gJyc7XG4gICAgICAgIGxwaWVjZXMgPSBbXTtcbiAgICAgICAgLy8gY2l0eSA9IGpzb25SZXNwb25zZS5jaXR5O1xuICAgICAgICAvLyByZWdpb24gPSBqc29uUmVzcG9uc2UucmVnaW9uO1xuICAgICAgICAvLyBjb3VudHJ5ID0ganNvblJlc3BvbnNlLmNvdW50cnk7XG4gICAgICAgIEFuYWx5dGljc0V2ZW50cy5zZW5kTG9jYXRpb24oKTtcblxuICAgICAgICByZXR1cm4ge307XG4gICAgICB9KVxuICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgY29uc29sZS53YXJuKGBsb2NhdGlvbiBmYWlsZWQgdG8gdXBkYXRlISBlbmNvdW50ZXJlZCBlcnJvciAke2Vyci5tc2d9YCk7XG4gICAgICB9KTtcbiAgfVxuXG4gIC8vIExpbmsgQW5hbHl0aWNzXG4gIHN0YXRpYyBsaW5rQW5hbHl0aWNzKG5ld2dhbmEsIGRhdGF1cmwpOiB2b2lkIHtcbiAgICBBbmFseXRpY3NFdmVudHMuZ2FuYSA9IG5ld2dhbmE7XG4gICAgQW5hbHl0aWNzRXZlbnRzLmRhdGFVUkwgPSBkYXRhdXJsO1xuICB9XG5cbiAgLy8gU2V0IFVVSURcbiAgc3RhdGljIHNldFV1aWQobmV3VXVpZDogc3RyaW5nLCBuZXdVc2VyU291cmNlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBBbmFseXRpY3NFdmVudHMudXVpZCA9IG5ld1V1aWQ7XG4gICAgQW5hbHl0aWNzRXZlbnRzLnVzZXJTb3VyY2UgPSBuZXdVc2VyU291cmNlO1xuICB9XG5cbiAgLy8gU2VuZCBJbml0XG4gIHN0YXRpYyBzZW5kSW5pdChhcHBWZXJzaW9uOiBzdHJpbmcsIGNvbnRlbnRWZXJzaW9uOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBBbmFseXRpY3NFdmVudHMuYXBwVmVyc2lvbiA9IGFwcFZlcnNpb247XG4gICAgQW5hbHl0aWNzRXZlbnRzLmNvbnRlbnRWZXJzaW9uID0gY29udGVudFZlcnNpb247XG5cbiAgICBBbmFseXRpY3NFdmVudHMuZ2V0TG9jYXRpb24oKTtcblxuICAgIHZhciBldmVudFN0cmluZyA9ICd1c2VyICcgKyBBbmFseXRpY3NFdmVudHMudXVpZCArICcgb3BlbmVkIHRoZSBhc3Nlc3NtZW50JztcblxuICAgIGNvbnNvbGUubG9nKGV2ZW50U3RyaW5nKTtcblxuICAgIGxvZ0V2ZW50KEFuYWx5dGljc0V2ZW50cy5nYW5hLCAnb3BlbmVkJywge30pO1xuICB9XG5cbiAgLy8gR2V0IEFwcCBMYW5ndWFnZSBGcm9tIERhdGEgVVJMXG4gIHN0YXRpYyBnZXRBcHBMYW5ndWFnZUZyb21EYXRhVVJMKGFwcFR5cGU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgLy8gQ2hlY2sgaWYgYXBwIHR5cGUgaXMgbm90IGVtcHR5IGFuZCBzcGxpdCB0aGUgc3RyaW5nIGJ5IHRoZSBoeXBoZW4gdGhlbiByZXR1cm4gdGhlIGZpcnN0IGVsZW1lbnRcbiAgICBpZiAoYXBwVHlwZSAmJiBhcHBUeXBlICE9PSAnJyAmJiBhcHBUeXBlLmluY2x1ZGVzKCctJykpIHtcbiAgICAgIGxldCBsYW5ndWFnZTogc3RyaW5nID0gYXBwVHlwZS5zcGxpdCgnLScpLnNsaWNlKDAsIC0xKS5qb2luKCctJyk7XG4gICAgICBpZiAobGFuZ3VhZ2UuaW5jbHVkZXMoJ3dlc3QtYWZyaWNhbicpKSB7XG4gICAgICAgIHJldHVybiAnd2VzdC1hZnJpY2FuLWVuZ2xpc2gnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGxhbmd1YWdlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiAnTm90QXZhaWxhYmxlJztcbiAgfVxuXG4gIC8vIEdldCBBcHAgVHlwZSBGcm9tIERhdGEgVVJMXG4gIHN0YXRpYyBnZXRBcHBUeXBlRnJvbURhdGFVUkwoYXBwVHlwZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAvLyBDaGVjayBpZiBhcHAgdHlwZSBpcyBub3QgZW1wdHkgYW5kIHNwbGl0IHRoZSBzdHJpbmcgYnkgdGhlIGh5cGhlbiB0aGVuIHJldHVybiB0aGUgbGFzdCBlbGVtZW50XG4gICAgaWYgKGFwcFR5cGUgJiYgYXBwVHlwZSAhPT0gJycgJiYgYXBwVHlwZS5pbmNsdWRlcygnLScpKSB7XG4gICAgICByZXR1cm4gYXBwVHlwZS5zdWJzdHJpbmcoYXBwVHlwZS5sYXN0SW5kZXhPZignLScpICsgMSk7XG4gICAgfVxuXG4gICAgcmV0dXJuICdOb3RBdmFpbGFibGUnO1xuICB9XG5cbiAgLy8gU2VuZCBMb2NhdGlvblxuICBzdGF0aWMgc2VuZExvY2F0aW9uKCk6IHZvaWQge1xuICAgIHZhciBldmVudFN0cmluZyA9XG4gICAgICAnU2VuZGluZyBVc2VyIGNvb3JkaW5hdGVzOiAnICsgQW5hbHl0aWNzRXZlbnRzLnV1aWQgKyAnIDogJyArIEFuYWx5dGljc0V2ZW50cy5jbGF0ICsgJywgJyArIEFuYWx5dGljc0V2ZW50cy5jbG9uO1xuICAgIGNvbnNvbGUubG9nKGV2ZW50U3RyaW5nKTtcblxuICAgIGxvZ0V2ZW50KEFuYWx5dGljc0V2ZW50cy5nYW5hLCAndXNlcl9sb2NhdGlvbicsIHtcbiAgICAgIHVzZXI6IEFuYWx5dGljc0V2ZW50cy51dWlkLFxuICAgICAgbGFuZzogQW5hbHl0aWNzRXZlbnRzLmdldEFwcExhbmd1YWdlRnJvbURhdGFVUkwoQW5hbHl0aWNzRXZlbnRzLmRhdGFVUkwpLFxuICAgICAgYXBwOiBBbmFseXRpY3NFdmVudHMuZ2V0QXBwVHlwZUZyb21EYXRhVVJMKEFuYWx5dGljc0V2ZW50cy5kYXRhVVJMKSxcbiAgICAgIGxhdGxvbmc6IEFuYWx5dGljc0V2ZW50cy5qb2luTGF0TG9uZyhBbmFseXRpY3NFdmVudHMuY2xhdCwgQW5hbHl0aWNzRXZlbnRzLmNsb24pLFxuICAgIH0pO1xuXG4gICAgY29uc29sZS5sb2coJ0lOSVRJQUxJWkVEIEVWRU5UIFNFTlQnKTtcbiAgICBjb25zb2xlLmxvZygnQXBwIExhbmd1YWdlOiAnICsgQW5hbHl0aWNzRXZlbnRzLmdldEFwcExhbmd1YWdlRnJvbURhdGFVUkwoQW5hbHl0aWNzRXZlbnRzLmRhdGFVUkwpKTtcbiAgICBjb25zb2xlLmxvZygnQXBwIFR5cGU6ICcgKyBBbmFseXRpY3NFdmVudHMuZ2V0QXBwVHlwZUZyb21EYXRhVVJMKEFuYWx5dGljc0V2ZW50cy5kYXRhVVJMKSk7XG4gICAgY29uc29sZS5sb2coJ0FwcCBWZXJzaW9uOiAnICsgQW5hbHl0aWNzRXZlbnRzLmFwcFZlcnNpb24pO1xuICAgIGNvbnNvbGUubG9nKCdDb250ZW50IFZlcnNpb246ICcgKyBBbmFseXRpY3NFdmVudHMuY29udGVudFZlcnNpb24pO1xuXG4gICAgbG9nRXZlbnQoQW5hbHl0aWNzRXZlbnRzLmdhbmEsICdpbml0aWFsaXplZCcsIHtcbiAgICAgIHR5cGU6ICdpbml0aWFsaXplZCcsXG4gICAgICBjbFVzZXJJZDogQW5hbHl0aWNzRXZlbnRzLnV1aWQsXG4gICAgICB1c2VyU291cmNlOiBBbmFseXRpY3NFdmVudHMudXNlclNvdXJjZSxcbiAgICAgIGxhdExvbmc6IEFuYWx5dGljc0V2ZW50cy5qb2luTGF0TG9uZyhBbmFseXRpY3NFdmVudHMuY2xhdCwgQW5hbHl0aWNzRXZlbnRzLmNsb24pLFxuICAgICAgYXBwVmVyc2lvbjogQW5hbHl0aWNzRXZlbnRzLmFwcFZlcnNpb24sXG4gICAgICBjb250ZW50VmVyc2lvbjogQW5hbHl0aWNzRXZlbnRzLmNvbnRlbnRWZXJzaW9uLFxuICAgICAgLy8gY2l0eTogY2l0eSxcbiAgICAgIC8vIHJlZ2lvbjogcmVnaW9uLFxuICAgICAgLy8gY291bnRyeTogY291bnRyeSxcbiAgICAgIGFwcDogQW5hbHl0aWNzRXZlbnRzLmdldEFwcFR5cGVGcm9tRGF0YVVSTChBbmFseXRpY3NFdmVudHMuZGF0YVVSTCksXG4gICAgICBsYW5nOiBBbmFseXRpY3NFdmVudHMuZ2V0QXBwTGFuZ3VhZ2VGcm9tRGF0YVVSTChBbmFseXRpY3NFdmVudHMuZGF0YVVSTCksXG4gICAgfSk7XG4gIH1cblxuICAvLyBTZW5kIEFuc3dlcmVkXG4gIHN0YXRpYyBzZW5kQW5zd2VyZWQodGhlUTogcURhdGEsIHRoZUE6IG51bWJlciwgZWxhcHNlZDogbnVtYmVyKTogdm9pZCB7XG4gICAgdmFyIGFucyA9IHRoZVEuYW5zd2Vyc1t0aGVBIC0gMV07XG5cbiAgICB2YXIgaXNjb3JyZWN0ID0gbnVsbDtcbiAgICB2YXIgYnVja2V0ID0gbnVsbDtcbiAgICBpZiAoJ2NvcnJlY3QnIGluIHRoZVEpIHtcbiAgICAgIGlmICh0aGVRLmNvcnJlY3QgIT0gbnVsbCkge1xuICAgICAgICBpZiAodGhlUS5jb3JyZWN0ID09IGFucy5hbnN3ZXJOYW1lKSB7XG4gICAgICAgICAgaXNjb3JyZWN0ID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpc2NvcnJlY3QgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoJ2J1Y2tldCcgaW4gdGhlUSkge1xuICAgICAgYnVja2V0ID0gdGhlUS5idWNrZXQ7XG4gICAgfVxuICAgIHZhciBldmVudFN0cmluZyA9ICd1c2VyICcgKyBBbmFseXRpY3NFdmVudHMudXVpZCArICcgYW5zd2VyZWQgJyArIHRoZVEucU5hbWUgKyAnIHdpdGggJyArIGFucy5hbnN3ZXJOYW1lO1xuICAgIGV2ZW50U3RyaW5nICs9ICcsIGFsbCBhbnN3ZXJzIHdlcmUgWyc7XG4gICAgdmFyIG9wdHMgPSAnJztcbiAgICBmb3IgKHZhciBhTnVtIGluIHRoZVEuYW5zd2Vycykge1xuICAgICAgZXZlbnRTdHJpbmcgKz0gdGhlUS5hbnN3ZXJzW2FOdW1dLmFuc3dlck5hbWUgKyAnLCc7XG4gICAgICBvcHRzICs9IHRoZVEuYW5zd2Vyc1thTnVtXS5hbnN3ZXJOYW1lICsgJywnO1xuICAgIH1cbiAgICBldmVudFN0cmluZyArPSAnXSAnO1xuICAgIGV2ZW50U3RyaW5nICs9IGlzY29ycmVjdDtcbiAgICBldmVudFN0cmluZyArPSBidWNrZXQ7XG4gICAgY29uc29sZS5sb2coZXZlbnRTdHJpbmcpO1xuICAgIGNvbnNvbGUubG9nKCdBbnN3ZXJlZCBBcHAgVmVyc2lvbjogJyArIEFuYWx5dGljc0V2ZW50cy5hcHBWZXJzaW9uKTtcbiAgICBjb25zb2xlLmxvZygnQ29udGVudCBWZXJzaW9uOiAnICsgQW5hbHl0aWNzRXZlbnRzLmNvbnRlbnRWZXJzaW9uKTtcblxuICAgIGxvZ0V2ZW50KEFuYWx5dGljc0V2ZW50cy5nYW5hLCAnYW5zd2VyZWQnLCB7XG4gICAgICB0eXBlOiAnYW5zd2VyZWQnLFxuICAgICAgY2xVc2VySWQ6IEFuYWx5dGljc0V2ZW50cy51dWlkLFxuICAgICAgdXNlclNvdXJjZTogQW5hbHl0aWNzRXZlbnRzLnVzZXJTb3VyY2UsXG4gICAgICBsYXRMb25nOiBBbmFseXRpY3NFdmVudHMuam9pbkxhdExvbmcoQW5hbHl0aWNzRXZlbnRzLmNsYXQsIEFuYWx5dGljc0V2ZW50cy5jbG9uKSxcbiAgICAgIC8vIGNpdHk6IGNpdHksXG4gICAgICAvLyByZWdpb246IHJlZ2lvbixcbiAgICAgIC8vIGNvdW50cnk6IGNvdW50cnksXG4gICAgICBhcHA6IEFuYWx5dGljc0V2ZW50cy5nZXRBcHBUeXBlRnJvbURhdGFVUkwoQW5hbHl0aWNzRXZlbnRzLmRhdGFVUkwpLFxuICAgICAgbGFuZzogQW5hbHl0aWNzRXZlbnRzLmdldEFwcExhbmd1YWdlRnJvbURhdGFVUkwoQW5hbHl0aWNzRXZlbnRzLmRhdGFVUkwpLFxuICAgICAgZHQ6IGVsYXBzZWQsXG4gICAgICBxdWVzdGlvbl9udW1iZXI6IHRoZVEucU51bWJlcixcbiAgICAgIHRhcmdldDogdGhlUS5xVGFyZ2V0LFxuICAgICAgcXVlc3Rpb246IHRoZVEucHJvbXB0VGV4dCxcbiAgICAgIHNlbGVjdGVkX2Fuc3dlcjogYW5zLmFuc3dlck5hbWUsXG4gICAgICBpc2NvcnJlY3Q6IGlzY29ycmVjdCxcbiAgICAgIG9wdGlvbnM6IG9wdHMsXG4gICAgICBidWNrZXQ6IGJ1Y2tldCxcbiAgICAgIGFwcFZlcnNpb246IEFuYWx5dGljc0V2ZW50cy5hcHBWZXJzaW9uLFxuICAgICAgY29udGVudFZlcnNpb246IEFuYWx5dGljc0V2ZW50cy5jb250ZW50VmVyc2lvbixcbiAgICB9KTtcbiAgfVxuXG4gIC8vIFNlbmQgQnVja2V0XG4gIHN0YXRpYyBzZW5kQnVja2V0KHRiOiBidWNrZXQsIHBhc3NlZDogYm9vbGVhbik6IHZvaWQge1xuICAgIHZhciBibiA9IHRiLmJ1Y2tldElEO1xuICAgIHZhciBidHJpZWQgPSB0Yi5udW1UcmllZDtcbiAgICB2YXIgYmNvcnJlY3QgPSB0Yi5udW1Db3JyZWN0O1xuXG4gICAgdmFyIGV2ZW50U3RyaW5nID1cbiAgICAgICd1c2VyICcgK1xuICAgICAgQW5hbHl0aWNzRXZlbnRzLnV1aWQgK1xuICAgICAgJyBmaW5pc2hlZCB0aGUgYnVja2V0ICcgK1xuICAgICAgYm4gK1xuICAgICAgJyB3aXRoICcgK1xuICAgICAgYmNvcnJlY3QgK1xuICAgICAgJyBjb3JyZWN0IGFuc3dlcnMgb3V0IG9mICcgK1xuICAgICAgYnRyaWVkICtcbiAgICAgICcgdHJpZWQnICtcbiAgICAgICcgYW5kIHBhc3NlZDogJyArXG4gICAgICBwYXNzZWQ7XG4gICAgY29uc29sZS5sb2coZXZlbnRTdHJpbmcpO1xuICAgIGNvbnNvbGUubG9nKCdCdWNrZXQgQ29tcGxldGVkIEFwcCBWZXJzaW9uOiAnICsgQW5hbHl0aWNzRXZlbnRzLmFwcFZlcnNpb24pO1xuICAgIGNvbnNvbGUubG9nKCdDb250ZW50IFZlcnNpb246ICcgKyBBbmFseXRpY3NFdmVudHMuY29udGVudFZlcnNpb24pO1xuXG4gICAgbG9nRXZlbnQoQW5hbHl0aWNzRXZlbnRzLmdhbmEsICdidWNrZXRDb21wbGV0ZWQnLCB7XG4gICAgICB0eXBlOiAnYnVja2V0Q29tcGxldGVkJyxcbiAgICAgIGNsVXNlcklkOiBBbmFseXRpY3NFdmVudHMudXVpZCxcbiAgICAgIHVzZXJTb3VyY2U6IEFuYWx5dGljc0V2ZW50cy51c2VyU291cmNlLFxuICAgICAgbGF0TG9uZzogQW5hbHl0aWNzRXZlbnRzLmpvaW5MYXRMb25nKEFuYWx5dGljc0V2ZW50cy5jbGF0LCBBbmFseXRpY3NFdmVudHMuY2xvbiksXG4gICAgICAvLyBjaXR5OiBjaXR5LFxuICAgICAgLy8gcmVnaW9uOiByZWdpb24sXG4gICAgICAvLyBjb3VudHJ5OiBjb3VudHJ5LFxuICAgICAgYXBwOiBBbmFseXRpY3NFdmVudHMuZ2V0QXBwVHlwZUZyb21EYXRhVVJMKEFuYWx5dGljc0V2ZW50cy5kYXRhVVJMKSxcbiAgICAgIGxhbmc6IEFuYWx5dGljc0V2ZW50cy5nZXRBcHBMYW5ndWFnZUZyb21EYXRhVVJMKEFuYWx5dGljc0V2ZW50cy5kYXRhVVJMKSxcbiAgICAgIGJ1Y2tldE51bWJlcjogYm4sXG4gICAgICBudW1iZXJUcmllZEluQnVja2V0OiBidHJpZWQsXG4gICAgICBudW1iZXJDb3JyZWN0SW5CdWNrZXQ6IGJjb3JyZWN0LFxuICAgICAgcGFzc2VkQnVja2V0OiBwYXNzZWQsXG4gICAgICBhcHBWZXJzaW9uOiBBbmFseXRpY3NFdmVudHMuYXBwVmVyc2lvbixcbiAgICAgIGNvbnRlbnRWZXJzaW9uOiBBbmFseXRpY3NFdmVudHMuY29udGVudFZlcnNpb24sXG4gICAgfSk7XG4gIH1cblxuICAvLyBTZW5kIEZpbmlzaGVkXG4gIHN0YXRpYyBzZW5kRmluaXNoZWQoYnVja2V0czogYnVja2V0W10gPSBudWxsLCBiYXNhbEJ1Y2tldDogbnVtYmVyLCBjZWlsaW5nQnVja2V0OiBudW1iZXIpOiB2b2lkIHtcbiAgICBsZXQgZXZlbnRTdHJpbmcgPSAndXNlciAnICsgQW5hbHl0aWNzRXZlbnRzLnV1aWQgKyAnIGZpbmlzaGVkIHRoZSBhc3Nlc3NtZW50JztcbiAgICBjb25zb2xlLmxvZyhldmVudFN0cmluZyk7XG5cbiAgICBsZXQgYmFzYWxCdWNrZXRJRCA9IEFuYWx5dGljc0V2ZW50cy5nZXRCYXNhbEJ1Y2tldElEKGJ1Y2tldHMpO1xuICAgIGxldCBjZWlsaW5nQnVja2V0SUQgPSBBbmFseXRpY3NFdmVudHMuZ2V0Q2VpbGluZ0J1Y2tldElEKGJ1Y2tldHMpO1xuXG4gICAgaWYgKGJhc2FsQnVja2V0SUQgPT0gMCkge1xuICAgICAgYmFzYWxCdWNrZXRJRCA9IGNlaWxpbmdCdWNrZXRJRDtcbiAgICB9XG5cbiAgICBsZXQgc2NvcmUgPSBBbmFseXRpY3NFdmVudHMuY2FsY3VsYXRlU2NvcmUoYnVja2V0cywgYmFzYWxCdWNrZXRJRCk7XG4gICAgY29uc3QgbWF4U2NvcmUgPSBidWNrZXRzLmxlbmd0aCAqIDEwMDtcblxuICAgIGNvbnNvbGUubG9nKCdTZW5kaW5nIGNvbXBsZXRlZCBldmVudCcpO1xuICAgIGNvbnNvbGUubG9nKCdTY29yZTogJyArIHNjb3JlKTtcbiAgICBjb25zb2xlLmxvZygnTWF4IFNjb3JlOiAnICsgbWF4U2NvcmUpO1xuICAgIGNvbnNvbGUubG9nKCdCYXNhbCBCdWNrZXQ6ICcgKyBiYXNhbEJ1Y2tldElEKTtcbiAgICBjb25zb2xlLmxvZygnQkFTQUwgRlJPTSBBU1NFU1NNRU5UOiAnICsgYmFzYWxCdWNrZXQpO1xuICAgIGNvbnNvbGUubG9nKCdDZWlsaW5nIEJ1Y2tldDogJyArIGNlaWxpbmdCdWNrZXRJRCk7XG4gICAgY29uc29sZS5sb2coJ0NFSUxJTkcgRlJPTSBBU1NFU1NNRU5UOiAnICsgY2VpbGluZ0J1Y2tldCk7XG4gICAgY29uc29sZS5sb2coJ0NvbXBsZXRlZCBBcHAgVmVyc2lvbjogJyArIEFuYWx5dGljc0V2ZW50cy5hcHBWZXJzaW9uKTtcbiAgICBjb25zb2xlLmxvZygnQ29udGVudCBWZXJzaW9uOiAnICsgQW5hbHl0aWNzRXZlbnRzLmNvbnRlbnRWZXJzaW9uKTtcblxuICAgIEFuYWx5dGljc0V2ZW50cy5zZW5kRGF0YVRvVGhpcmRQYXJ0eShzY29yZSwgQW5hbHl0aWNzRXZlbnRzLnV1aWQpO1xuXG4gICAgLy8gQXR0ZW1wdCB0byBzZW5kIHRoZSBzY29yZSB0byB0aGUgcGFyZW50IGN1cmlvdXMgZnJhbWUgaWYgaXQgZXhpc3RzXG4gICAgaWYgKHdpbmRvdy5wYXJlbnQpIHtcbiAgICAgIHdpbmRvdy5wYXJlbnQucG9zdE1lc3NhZ2UoXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlOiAnYXNzZXNzbWVudF9jb21wbGV0ZWQnLFxuICAgICAgICAgIHNjb3JlOiBzY29yZSxcbiAgICAgICAgICAvLyBtYXhTY29yZTogbWF4U2NvcmUsXG4gICAgICAgICAgLy8gYmFzYWxCdWNrZXQ6IGJhc2FsQnVja2V0SUQsXG4gICAgICAgICAgLy8gY2VpbGluZ0J1Y2tldDogY2VpbGluZ0J1Y2tldElELFxuICAgICAgICAgIC8vIGFwcFZlcnNpb246IEFuYWx5dGljc0V2ZW50cy5hcHBWZXJzaW9uLFxuICAgICAgICAgIC8vIGNvbnRlbnRWZXJzaW9uOiBBbmFseXRpY3NFdmVudHMuY29udGVudFZlcnNpb24sXG4gICAgICAgIH0sXG4gICAgICAgICdodHRwczovL3N5bmFwc2UuY3VyaW91c2NvbnRlbnQub3JnLydcbiAgICAgICk7XG4gICAgfVxuXG4gICAgbG9nRXZlbnQoQW5hbHl0aWNzRXZlbnRzLmdhbmEsICdjb21wbGV0ZWQnLCB7XG4gICAgICB0eXBlOiAnY29tcGxldGVkJyxcbiAgICAgIGNsVXNlcklkOiBBbmFseXRpY3NFdmVudHMudXVpZCxcbiAgICAgIHVzZXJTb3VyY2U6IEFuYWx5dGljc0V2ZW50cy51c2VyU291cmNlLFxuICAgICAgYXBwOiBBbmFseXRpY3NFdmVudHMuZ2V0QXBwVHlwZUZyb21EYXRhVVJMKEFuYWx5dGljc0V2ZW50cy5kYXRhVVJMKSxcbiAgICAgIGxhbmc6IEFuYWx5dGljc0V2ZW50cy5nZXRBcHBMYW5ndWFnZUZyb21EYXRhVVJMKEFuYWx5dGljc0V2ZW50cy5kYXRhVVJMKSxcbiAgICAgIGxhdExvbmc6IEFuYWx5dGljc0V2ZW50cy5qb2luTGF0TG9uZyhBbmFseXRpY3NFdmVudHMuY2xhdCwgQW5hbHl0aWNzRXZlbnRzLmNsb24pLFxuICAgICAgLy8gY2l0eTogY2l0eSxcbiAgICAgIC8vIHJlZ2lvbjogcmVnaW9uLFxuICAgICAgLy8gY291bnRyeTogY291bnRyeSxcbiAgICAgIHNjb3JlOiBzY29yZSxcbiAgICAgIG1heFNjb3JlOiBtYXhTY29yZSxcbiAgICAgIGJhc2FsQnVja2V0OiBiYXNhbEJ1Y2tldElELFxuICAgICAgY2VpbGluZ0J1Y2tldDogY2VpbGluZ0J1Y2tldElELFxuICAgICAgYXBwVmVyc2lvbjogQW5hbHl0aWNzRXZlbnRzLmFwcFZlcnNpb24sXG4gICAgICBjb250ZW50VmVyc2lvbjogQW5hbHl0aWNzRXZlbnRzLmNvbnRlbnRWZXJzaW9uLFxuICAgIH0pO1xuICB9XG5cbiAgc3RhdGljIHNlbmREYXRhVG9UaGlyZFBhcnR5KHNjb3JlOiBudW1iZXIsIHV1aWQ6IHN0cmluZyk6IHZvaWQge1xuICAgIC8vIFNlbmQgZGF0YSB0byB0aGUgdGhpcmQgcGFydHlcbiAgICBjb25zb2xlLmxvZygnQXR0ZW1wdGluZyB0byBzZW5kIHNjb3JlIHRvIGEgdGhpcmQgcGFydHkhIFNjb3JlOiAnLCBzY29yZSk7XG5cbiAgICAvLyBSZWFkIHRoZSBVUkwgZnJvbSB1dG0gcGFyYW1ldGVyc1xuICAgIGNvbnN0IHVybFBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMod2luZG93LmxvY2F0aW9uLnNlYXJjaCk7XG4gICAgY29uc3QgdGFyZ2V0UGFydHlVUkwgPSB1cmxQYXJhbXMuZ2V0KCdlbmRwb2ludCcpO1xuICAgIGNvbnN0IG9yZ2FuaXphdGlvbiA9IHVybFBhcmFtcy5nZXQoJ29yZ2FuaXphdGlvbicpO1xuICAgIGNvbnN0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXG4gICAgaWYgKCF0YXJnZXRQYXJ0eVVSTCkge1xuICAgICAgY29uc29sZS5lcnJvcignTm8gdGFyZ2V0IHBhcnR5IFVSTCBmb3VuZCEnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBwYXlsb2FkID0ge1xuICAgICAgdXNlcjogdXVpZCxcbiAgICAgIHBhZ2U6ICcxMTExMDgxMjEzNjM2MTUnLFxuICAgICAgZXZlbnQ6IHtcbiAgICAgICAgdHlwZTogJ2V4dGVybmFsJyxcbiAgICAgICAgdmFsdWU6IHtcbiAgICAgICAgICB0eXBlOiAnYXNzZXNzbWVudCcsXG4gICAgICAgICAgc3ViVHlwZTogQW5hbHl0aWNzRXZlbnRzLmFzc2Vzc21lbnRUeXBlLFxuICAgICAgICAgIHNjb3JlOiBzY29yZSxcbiAgICAgICAgICBjb21wbGV0ZWQ6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH07XG5cbiAgICBjb25zdCBwYXlsb2FkU3RyaW5nID0gSlNPTi5zdHJpbmdpZnkocGF5bG9hZCk7XG5cbiAgICB0cnkge1xuICAgICAgeGhyLm9wZW4oJ1BPU1QnLCB0YXJnZXRQYXJ0eVVSTCwgdHJ1ZSk7XG4gICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcblxuICAgICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHhoci5zdGF0dXMgPj0gMjAwICYmIHhoci5zdGF0dXMgPCAzMDApIHtcbiAgICAgICAgICAvLyBSZXF1ZXN0IHdhcyBzdWNjZXNzZnVsLCBoYW5kbGUgdGhlIHJlc3BvbnNlIGhlcmVcbiAgICAgICAgICBjb25zb2xlLmxvZygnUE9TVCBzdWNjZXNzIScgKyB4aHIucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBSZXF1ZXN0IGZhaWxlZFxuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1JlcXVlc3QgZmFpbGVkIHdpdGggc3RhdHVzOiAnICsgeGhyLnN0YXR1cyk7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHhoci5zZW5kKHBheWxvYWRTdHJpbmcpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gc2VuZCBkYXRhIHRvIHRhcmdldCBwYXJ0eTogJywgZXJyb3IpO1xuICAgIH1cbiAgfVxuXG4gIC8vIENhbGN1bGF0ZSBTY29yZVxuICBzdGF0aWMgY2FsY3VsYXRlU2NvcmUoYnVja2V0czogYnVja2V0W10sIGJhc2FsQnVja2V0SUQ6IG51bWJlcik6IG51bWJlciB7XG4gICAgY29uc29sZS5sb2coJ0NhbGN1bGF0aW5nIHNjb3JlJyk7XG4gICAgY29uc29sZS5sb2coYnVja2V0cyk7XG5cbiAgICBsZXQgc2NvcmUgPSAwO1xuXG4gICAgY29uc29sZS5sb2coJ0Jhc2FsIEJ1Y2tldCBJRDogJyArIGJhc2FsQnVja2V0SUQpO1xuXG4gICAgLy8gR2V0IHRoZSBudW1jb3JyZWN0IGZyb20gdGhlIGJhc2FsIGJ1Y2tldCBiYXNlZCBvbiBsb29waW5nIHRocm91Z2ggYW5kIGZpbmRpbmcgdGhlIGJ1Y2tldCBpZFxuICAgIGxldCBudW1Db3JyZWN0ID0gMDtcblxuICAgIGZvciAoY29uc3QgaW5kZXggaW4gYnVja2V0cykge1xuICAgICAgY29uc3QgYnVja2V0ID0gYnVja2V0c1tpbmRleF07XG4gICAgICBpZiAoYnVja2V0LmJ1Y2tldElEID09IGJhc2FsQnVja2V0SUQpIHtcbiAgICAgICAgbnVtQ29ycmVjdCA9IGJ1Y2tldC5udW1Db3JyZWN0O1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zb2xlLmxvZygnTnVtIENvcnJlY3Q6ICcgKyBudW1Db3JyZWN0LCAnIGJhc2FsOiAnICsgYmFzYWxCdWNrZXRJRCwgJyBidWNrZXRzOiAnICsgYnVja2V0cy5sZW5ndGgpO1xuXG4gICAgaWYgKGJhc2FsQnVja2V0SUQgPT09IGJ1Y2tldHMubGVuZ3RoICYmIG51bUNvcnJlY3QgPj0gNCkge1xuICAgICAgLy8gSWYgdGhlIHVzZXIgaGFzIGVub3VnaCBjb3JyZWN0IGFuc3dlcnMgaW4gdGhlIGxhc3QgYnVja2V0LCBnaXZlIHRoZW0gYSBwZXJmZWN0IHNjb3JlXG4gICAgICBjb25zb2xlLmxvZygnUGVyZmVjdCBzY29yZScpO1xuXG4gICAgICByZXR1cm4gYnVja2V0cy5sZW5ndGggKiAxMDA7XG4gICAgfVxuXG4gICAgc2NvcmUgPSBNYXRoLnJvdW5kKChiYXNhbEJ1Y2tldElEIC0gMSkgKiAxMDAgKyAobnVtQ29ycmVjdCAvIDUpICogMTAwKSB8IDA7XG5cbiAgICByZXR1cm4gc2NvcmU7XG4gIH1cblxuICAvLyBHZXQgQmFzYWwgQnVja2V0IElEXG4gIHN0YXRpYyBnZXRCYXNhbEJ1Y2tldElEKGJ1Y2tldHM6IGJ1Y2tldFtdKTogbnVtYmVyIHtcbiAgICBsZXQgYnVja2V0SUQgPSAwO1xuXG4gICAgLy8gU2VsZWN0IHRoZSBsb3dlc3QgYnVja2V0SUQgYnVja2V0IHRoYXQgdGhlIHVzZXIgaGFzIGZhaWxlZFxuICAgIGZvciAoY29uc3QgaW5kZXggaW4gYnVja2V0cykge1xuICAgICAgY29uc3QgYnVja2V0ID0gYnVja2V0c1tpbmRleF07XG4gICAgICBpZiAoYnVja2V0LnRlc3RlZCAmJiAhYnVja2V0LnBhc3NlZCkge1xuICAgICAgICBpZiAoYnVja2V0SUQgPT0gMCB8fCBidWNrZXQuYnVja2V0SUQgPCBidWNrZXRJRCkge1xuICAgICAgICAgIGJ1Y2tldElEID0gYnVja2V0LmJ1Y2tldElEO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGJ1Y2tldElEO1xuICB9XG5cbiAgLy8gR2V0IENlaWxpbmcgQnVja2V0IElEXG4gIHN0YXRpYyBnZXRDZWlsaW5nQnVja2V0SUQoYnVja2V0czogYnVja2V0W10pOiBudW1iZXIge1xuICAgIGxldCBidWNrZXRJRCA9IDA7XG5cbiAgICAvLyBTZWxlY3QgdGhlIGhpdWdoZXN0IGJ1Y2tldElEIGJ1Y2tldCB0aGF0IHRoZSB1c2VyIGhhcyBwYXNzZWRcbiAgICBmb3IgKGNvbnN0IGluZGV4IGluIGJ1Y2tldHMpIHtcbiAgICAgIGNvbnN0IGJ1Y2tldCA9IGJ1Y2tldHNbaW5kZXhdO1xuICAgICAgaWYgKGJ1Y2tldC50ZXN0ZWQgJiYgYnVja2V0LnBhc3NlZCkge1xuICAgICAgICBpZiAoYnVja2V0SUQgPT0gMCB8fCBidWNrZXQuYnVja2V0SUQgPiBidWNrZXRJRCkge1xuICAgICAgICAgIGJ1Y2tldElEID0gYnVja2V0LmJ1Y2tldElEO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGJ1Y2tldElEO1xuICB9XG5cbiAgLy8gSm9pbiBMYXQgTG9uZ1xuICBzdGF0aWMgam9pbkxhdExvbmcobGF0OiBzdHJpbmcsIGxvbjogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gbGF0ICsgJywnICsgbG9uO1xuICB9XG59XG4iLCJpbXBvcnQgeyBBcHAgfSBmcm9tICcuL0FwcCc7XG5pbXBvcnQgeyBBbmFseXRpY3NFdmVudHMgfSBmcm9tICcuL2FuYWx5dGljcy9hbmFseXRpY3NFdmVudHMnO1xuaW1wb3J0IHsgVUlDb250cm9sbGVyIH0gZnJvbSAnLi91aS91aUNvbnRyb2xsZXInO1xuaW1wb3J0IHsgVW5pdHlCcmlkZ2UgfSBmcm9tICcuL3V0aWxzL3VuaXR5QnJpZGdlJztcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEJhc2VRdWl6IHtcbiAgcHJvdGVjdGVkIGFwcDogQXBwO1xuICBwdWJsaWMgZGF0YVVSTDogc3RyaW5nO1xuICBwdWJsaWMgdW5pdHlCcmlkZ2U6IFVuaXR5QnJpZGdlO1xuXG4gIHB1YmxpYyBkZXZNb2RlQXZhaWxhYmxlOiBib29sZWFuID0gZmFsc2U7XG4gIHB1YmxpYyBpc0luRGV2TW9kZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIHB1YmxpYyBpc0NvcnJlY3RMYWJlbFNob3duOiBib29sZWFuID0gZmFsc2U7XG4gIHB1YmxpYyBpc0J1Y2tldEluZm9TaG93bjogYm9vbGVhbiA9IGZhbHNlO1xuICBwdWJsaWMgaXNCdWNrZXRDb250cm9sc0VuYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHVibGljIGFuaW1hdGlvblNwZWVkTXVsdGlwbGllcjogbnVtYmVyID0gMTtcblxuICBwdWJsaWMgZGV2TW9kZVRvZ2dsZUJ1dHRvbkNvbnRhaW5lcklkOiBzdHJpbmcgPSAnZGV2TW9kZU1vZGFsVG9nZ2xlQnV0dG9uQ29udGFpbmVyJztcbiAgcHVibGljIGRldk1vZGVUb2dnbGVCdXR0b25Db250YWluZXI6IEhUTUxFbGVtZW50O1xuXG4gIHB1YmxpYyBkZXZNb2RlVG9nZ2xlQnV0dG9uSWQ6IHN0cmluZyA9ICdkZXZNb2RlTW9kYWxUb2dnbGVCdXR0b24nO1xuICBwdWJsaWMgZGV2TW9kZVRvZ2dsZUJ1dHRvbjogSFRNTEJ1dHRvbkVsZW1lbnQ7XG5cbiAgcHVibGljIGRldk1vZGVNb2RhbElkOiBzdHJpbmcgPSAnZGV2TW9kZVNldHRpbmdzTW9kYWwnO1xuICBwdWJsaWMgZGV2TW9kZVNldHRpbmdzTW9kYWw6IEhUTUxFbGVtZW50O1xuXG4gIHB1YmxpYyBkZXZNb2RlQnVja2V0R2VuU2VsZWN0SWQ6IHN0cmluZyA9ICdkZXZNb2RlQnVja2V0R2VuU2VsZWN0JztcbiAgcHVibGljIGRldk1vZGVCdWNrZXRHZW5TZWxlY3Q6IEhUTUxTZWxlY3RFbGVtZW50O1xuXG4gIHB1YmxpYyBkZXZNb2RlQ29ycmVjdExhYmVsU2hvd25DaGVja2JveElkOiBzdHJpbmcgPSAnZGV2TW9kZUNvcnJlY3RMYWJlbFNob3duQ2hlY2tib3gnO1xuICBwdWJsaWMgZGV2TW9kZUNvcnJlY3RMYWJlbFNob3duQ2hlY2tib3g6IEhUTUxJbnB1dEVsZW1lbnQ7XG5cbiAgcHVibGljIGRldk1vZGVCdWNrZXRJbmZvU2hvd25DaGVja2JveElkOiBzdHJpbmcgPSAnZGV2TW9kZUJ1Y2tldEluZm9TaG93bkNoZWNrYm94JztcbiAgcHVibGljIGRldk1vZGVCdWNrZXRJbmZvU2hvd25DaGVja2JveDogSFRNTElucHV0RWxlbWVudDtcbiAgcHVibGljIGRldk1vZGVCdWNrZXRJbmZvQ29udGFpbmVySWQ6IHN0cmluZyA9ICdkZXZNb2RlQnVja2V0SW5mb0NvbnRhaW5lcic7XG4gIHB1YmxpYyBkZXZNb2RlQnVja2V0SW5mb0NvbnRhaW5lcjogSFRNTEVsZW1lbnQ7XG5cbiAgcHVibGljIGRldk1vZGVCdWNrZXRDb250cm9sc1Nob3duQ2hlY2tib3hJZDogc3RyaW5nID0gJ2Rldk1vZGVCdWNrZXRDb250cm9sc1Nob3duQ2hlY2tib3gnO1xuICBwdWJsaWMgZGV2TW9kZUJ1Y2tldENvbnRyb2xzU2hvd25DaGVja2JveDogSFRNTElucHV0RWxlbWVudDtcblxuICBwdWJsaWMgZGV2TW9kZUFuaW1hdGlvblNwZWVkTXVsdGlwbGllclJhbmdlSWQ6IHN0cmluZyA9ICdkZXZNb2RlQW5pbWF0aW9uU3BlZWRNdWx0aXBsaWVyUmFuZ2UnO1xuICBwdWJsaWMgZGV2TW9kZUFuaW1hdGlvblNwZWVkTXVsdGlwbGllclJhbmdlOiBIVE1MSW5wdXRFbGVtZW50O1xuXG4gIHB1YmxpYyBkZXZNb2RlQW5pbWF0aW9uU3BlZWRNdWx0aXBsaWVyVmFsdWVJZDogc3RyaW5nID0gJ2Rldk1vZGVBbmltYXRpb25TcGVlZE11bHRpcGxpZXJWYWx1ZSc7XG4gIHB1YmxpYyBkZXZNb2RlQW5pbWF0aW9uU3BlZWRNdWx0aXBsaWVyVmFsdWU6IEhUTUxFbGVtZW50O1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuaXNJbkRldk1vZGUgPVxuICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYuaW5jbHVkZXMoJ2xvY2FsaG9zdCcpIHx8XG4gICAgICB3aW5kb3cubG9jYXRpb24uaHJlZi5pbmNsdWRlcygnMTI3LjAuMC4xJykgfHxcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmLmluY2x1ZGVzKCdhc3Nlc3NtZW50ZGV2Jyk7XG4gICAgdGhpcy5kZXZNb2RlVG9nZ2xlQnV0dG9uQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5kZXZNb2RlVG9nZ2xlQnV0dG9uQ29udGFpbmVySWQpO1xuICAgIHRoaXMuZGV2TW9kZVNldHRpbmdzTW9kYWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmRldk1vZGVNb2RhbElkKTtcblxuICAgIC8vIHRoaXMuZGV2TW9kZVNldHRpbmdzTW9kYWwuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChldmVudCkgPT4ge1xuICAgIC8vIFx0Ly8gQHRzLWlnbm9yZVxuICAgIC8vIFx0Y29uc3QgaWQgPSBldmVudC50YXJnZXQuaWQ7XG4gICAgLy8gXHRpZiAoaWQgPT0gdGhpcy5kZXZNb2RlTW9kYWxJZCkge1xuICAgIC8vIFx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAvLyBcdFx0dGhpcy50b2dnbGVEZXZNb2RlTW9kYWwoKTtcbiAgICAvLyBcdH1cbiAgICAvLyB9KTtcblxuICAgIHRoaXMuZGV2TW9kZUJ1Y2tldEdlblNlbGVjdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuZGV2TW9kZUJ1Y2tldEdlblNlbGVjdElkKSBhcyBIVE1MU2VsZWN0RWxlbWVudDtcbiAgICB0aGlzLmRldk1vZGVCdWNrZXRHZW5TZWxlY3Qub25jaGFuZ2UgPSAoZXZlbnQpID0+IHtcbiAgICAgIHRoaXMuaGFuZGxlQnVja2V0R2VuTW9kZUNoYW5nZShldmVudCk7XG4gICAgfTtcblxuICAgIHRoaXMuZGV2TW9kZVRvZ2dsZUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuZGV2TW9kZVRvZ2dsZUJ1dHRvbklkKSBhcyBIVE1MQnV0dG9uRWxlbWVudDtcbiAgICB0aGlzLmRldk1vZGVUb2dnbGVCdXR0b24ub25jbGljayA9IHRoaXMudG9nZ2xlRGV2TW9kZU1vZGFsO1xuXG4gICAgdGhpcy5kZXZNb2RlQ29ycmVjdExhYmVsU2hvd25DaGVja2JveCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuICAgICAgdGhpcy5kZXZNb2RlQ29ycmVjdExhYmVsU2hvd25DaGVja2JveElkXG4gICAgKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICAgIHRoaXMuZGV2TW9kZUNvcnJlY3RMYWJlbFNob3duQ2hlY2tib3gub25jaGFuZ2UgPSAoKSA9PiB7XG4gICAgICB0aGlzLmlzQ29ycmVjdExhYmVsU2hvd24gPSB0aGlzLmRldk1vZGVDb3JyZWN0TGFiZWxTaG93bkNoZWNrYm94LmNoZWNrZWQ7XG4gICAgICB0aGlzLmhhbmRsZUNvcnJlY3RMYWJlbFNob3duQ2hhbmdlKCk7XG4gICAgfTtcblxuICAgIHRoaXMuZGV2TW9kZUJ1Y2tldEluZm9TaG93bkNoZWNrYm94ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG4gICAgICB0aGlzLmRldk1vZGVCdWNrZXRJbmZvU2hvd25DaGVja2JveElkXG4gICAgKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICAgIHRoaXMuZGV2TW9kZUJ1Y2tldEluZm9TaG93bkNoZWNrYm94Lm9uY2hhbmdlID0gKCkgPT4ge1xuICAgICAgdGhpcy5pc0J1Y2tldEluZm9TaG93biA9IHRoaXMuZGV2TW9kZUJ1Y2tldEluZm9TaG93bkNoZWNrYm94LmNoZWNrZWQ7XG4gICAgICB0aGlzLmRldk1vZGVCdWNrZXRJbmZvQ29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSB0aGlzLmlzQnVja2V0SW5mb1Nob3duID8gJ2Jsb2NrJyA6ICdub25lJztcbiAgICAgIHRoaXMuaGFuZGxlQnVja2V0SW5mb1Nob3duQ2hhbmdlKCk7XG4gICAgfTtcblxuICAgIHRoaXMuZGV2TW9kZUJ1Y2tldENvbnRyb2xzU2hvd25DaGVja2JveCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuICAgICAgdGhpcy5kZXZNb2RlQnVja2V0Q29udHJvbHNTaG93bkNoZWNrYm94SWRcbiAgICApIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgdGhpcy5kZXZNb2RlQnVja2V0Q29udHJvbHNTaG93bkNoZWNrYm94Lm9uY2hhbmdlID0gKCkgPT4ge1xuICAgICAgdGhpcy5pc0J1Y2tldENvbnRyb2xzRW5hYmxlZCA9IHRoaXMuZGV2TW9kZUJ1Y2tldENvbnRyb2xzU2hvd25DaGVja2JveC5jaGVja2VkO1xuICAgICAgdGhpcy5oYW5kbGVCdWNrZXRDb250cm9sc1Nob3duQ2hhbmdlKCk7XG4gICAgfTtcblxuICAgIHRoaXMuZGV2TW9kZUJ1Y2tldEluZm9Db250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmRldk1vZGVCdWNrZXRJbmZvQ29udGFpbmVySWQpO1xuXG4gICAgdGhpcy5kZXZNb2RlQW5pbWF0aW9uU3BlZWRNdWx0aXBsaWVyUmFuZ2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcbiAgICAgIHRoaXMuZGV2TW9kZUFuaW1hdGlvblNwZWVkTXVsdGlwbGllclJhbmdlSWRcbiAgICApIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG5cbiAgICB0aGlzLmRldk1vZGVBbmltYXRpb25TcGVlZE11bHRpcGxpZXJWYWx1ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuZGV2TW9kZUFuaW1hdGlvblNwZWVkTXVsdGlwbGllclZhbHVlSWQpO1xuXG4gICAgdGhpcy5kZXZNb2RlQW5pbWF0aW9uU3BlZWRNdWx0aXBsaWVyUmFuZ2Uub25jaGFuZ2UgPSAoKSA9PiB7XG4gICAgICB0aGlzLmFuaW1hdGlvblNwZWVkTXVsdGlwbGllciA9IHBhcnNlRmxvYXQodGhpcy5kZXZNb2RlQW5pbWF0aW9uU3BlZWRNdWx0aXBsaWVyUmFuZ2UudmFsdWUpO1xuICAgICAgaWYgKHRoaXMuYW5pbWF0aW9uU3BlZWRNdWx0aXBsaWVyIDwgMC4yKSB7XG4gICAgICAgIHRoaXMuYW5pbWF0aW9uU3BlZWRNdWx0aXBsaWVyID0gMC4yO1xuICAgICAgICB0aGlzLmRldk1vZGVBbmltYXRpb25TcGVlZE11bHRpcGxpZXJSYW5nZS52YWx1ZSA9ICcwLjInO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmRldk1vZGVBbmltYXRpb25TcGVlZE11bHRpcGxpZXJWYWx1ZS5pbm5lclRleHQgPSB0aGlzLmFuaW1hdGlvblNwZWVkTXVsdGlwbGllci50b1N0cmluZygpO1xuICAgICAgdGhpcy5oYW5kbGVBbmltYXRpb25TcGVlZE11bHRpcGxpZXJDaGFuZ2UoKTtcbiAgICB9O1xuXG4gICAgaWYgKCF0aGlzLmlzSW5EZXZNb2RlKSB7XG4gICAgICB0aGlzLmRldk1vZGVUb2dnbGVCdXR0b25Db250YWluZXIuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kZXZNb2RlVG9nZ2xlQnV0dG9uQ29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgIH1cblxuICAgIC8vIEluaXRpYWxpemUgdGhlIGFuaW1hdGlvbiBzcGVlZCBtdWx0aXBsaWVyIHZhbHVlIGFuZCBwb3NpdGlvblxuICAgIHRoaXMuYW5pbWF0aW9uU3BlZWRNdWx0aXBsaWVyID0gcGFyc2VGbG9hdCh0aGlzLmRldk1vZGVBbmltYXRpb25TcGVlZE11bHRpcGxpZXJSYW5nZS52YWx1ZSk7XG4gIH1cblxuICBwdWJsaWMgaGlkZURldk1vZGVCdXR0b24oKSB7XG4gICAgdGhpcy5kZXZNb2RlVG9nZ2xlQnV0dG9uQ29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gIH1cblxuICBwdWJsaWMgYWJzdHJhY3QgaGFuZGxlQnVja2V0R2VuTW9kZUNoYW5nZShldmVudDogRXZlbnQpOiB2b2lkO1xuICBwdWJsaWMgYWJzdHJhY3QgaGFuZGxlQ29ycmVjdExhYmVsU2hvd25DaGFuZ2UoKTogdm9pZDtcbiAgcHVibGljIGFic3RyYWN0IGhhbmRsZUJ1Y2tldEluZm9TaG93bkNoYW5nZSgpOiB2b2lkO1xuICBwdWJsaWMgYWJzdHJhY3QgaGFuZGxlQnVja2V0Q29udHJvbHNTaG93bkNoYW5nZSgpOiB2b2lkO1xuICBwdWJsaWMgYWJzdHJhY3QgaGFuZGxlQW5pbWF0aW9uU3BlZWRNdWx0aXBsaWVyQ2hhbmdlKCk6IHZvaWQ7XG5cbiAgcHVibGljIHRvZ2dsZURldk1vZGVNb2RhbCA9ICgpID0+IHtcbiAgICBpZiAodGhpcy5kZXZNb2RlU2V0dGluZ3NNb2RhbC5zdHlsZS5kaXNwbGF5ID09ICdibG9jaycpIHtcbiAgICAgIHRoaXMuZGV2TW9kZVNldHRpbmdzTW9kYWwuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kZXZNb2RlU2V0dGluZ3NNb2RhbC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICB9XG4gIH07XG5cbiAgcHVibGljIGFic3RyYWN0IFJ1bihhcHBsaW5rOiBBcHApOiB2b2lkO1xuICBwdWJsaWMgYWJzdHJhY3QgaGFuZGxlQW5zd2VyQnV0dG9uUHJlc3MoYW5zOiBudW1iZXIsIGVsYXBzZWQ6IG51bWJlcik6IHZvaWQ7XG4gIHB1YmxpYyBhYnN0cmFjdCBIYXNRdWVzdGlvbnNMZWZ0KCk6IGJvb2xlYW47XG5cbiAgcHVibGljIG9uRW5kKCk6IHZvaWQge1xuICAgIC8vIHNlbmRGaW5pc2hlZCgpO1xuICAgIFVJQ29udHJvbGxlci5TaG93RW5kKCk7XG4gICAgdGhpcy5hcHAudW5pdHlCcmlkZ2UuU2VuZENsb3NlKCk7XG4gIH1cbn1cbiIsIi8vdGhpcyBpcyB3aGVyZSB0aGUgY29kZSB3aWxsIGdvIGZvciBsaW5lYXJseSBpdGVyYXRpbmcgdGhyb3VnaCB0aGVcbi8vcXVlc3Rpb25zIGluIGEgZGF0YS5qc29uIGZpbGUgdGhhdCBpZGVudGlmaWVzIGl0c2VsZiBhcyBhIHN1cnZleVxuXG5pbXBvcnQgeyBVSUNvbnRyb2xsZXIgfSBmcm9tICcuLi91aS91aUNvbnRyb2xsZXInO1xuaW1wb3J0IHsgQXVkaW9Db250cm9sbGVyIH0gZnJvbSAnLi4vY29tcG9uZW50cy9hdWRpb0NvbnRyb2xsZXInO1xuaW1wb3J0IHsgcURhdGEsIGFuc3dlckRhdGEgfSBmcm9tICcuLi9jb21wb25lbnRzL3F1ZXN0aW9uRGF0YSc7XG5pbXBvcnQgeyBBbmFseXRpY3NFdmVudHMgfSBmcm9tICcuLi9hbmFseXRpY3MvYW5hbHl0aWNzRXZlbnRzJztcbmltcG9ydCB7IEFwcCB9IGZyb20gJy4uL0FwcCc7XG5pbXBvcnQgeyBCYXNlUXVpeiB9IGZyb20gJy4uL2Jhc2VRdWl6JztcbmltcG9ydCB7IGZldGNoU3VydmV5UXVlc3Rpb25zIH0gZnJvbSAnLi4vdXRpbHMvanNvblV0aWxzJztcbmltcG9ydCB7IFVuaXR5QnJpZGdlIH0gZnJvbSAnLi4vdXRpbHMvdW5pdHlCcmlkZ2UnO1xuXG5leHBvcnQgY2xhc3MgU3VydmV5IGV4dGVuZHMgQmFzZVF1aXoge1xuICBwdWJsaWMgcXVlc3Rpb25zRGF0YTogcURhdGFbXTtcbiAgcHVibGljIGN1cnJlbnRRdWVzdGlvbkluZGV4OiBudW1iZXI7XG5cbiAgY29uc3RydWN0b3IoZGF0YVVSTDogc3RyaW5nLCB1bml0eUJyaWRnZSkge1xuICAgIHN1cGVyKCk7XG4gICAgY29uc29sZS5sb2coJ1N1cnZleSBpbml0aWFsaXplZCcpO1xuXG4gICAgdGhpcy5kYXRhVVJMID0gZGF0YVVSTDtcbiAgICB0aGlzLnVuaXR5QnJpZGdlID0gdW5pdHlCcmlkZ2U7XG4gICAgdGhpcy5jdXJyZW50UXVlc3Rpb25JbmRleCA9IDA7XG4gICAgVUlDb250cm9sbGVyLlNldEJ1dHRvblByZXNzQWN0aW9uKHRoaXMuaGFuZGxlQW5zd2VyQnV0dG9uUHJlc3MpO1xuICAgIFVJQ29udHJvbGxlci5TZXRTdGFydEFjdGlvbih0aGlzLnN0YXJ0U3VydmV5KTtcbiAgfVxuXG4gIHB1YmxpYyBoYW5kbGVBbmltYXRpb25TcGVlZE11bHRpcGxpZXJDaGFuZ2UoKTogdm9pZCB7XG4gICAgY29uc29sZS5sb2coJ0FuaW1hdGlvbiBTcGVlZCBNdWx0aXBsaWVyIENoYW5nZWQnKTtcbiAgfVxuXG4gIHB1YmxpYyBoYW5kbGVCdWNrZXRHZW5Nb2RlQ2hhbmdlID0gKCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKCdCdWNrZXQgR2VuIE1vZGUgQ2hhbmdlZCcpO1xuICB9O1xuXG4gIHB1YmxpYyBoYW5kbGVDb3JyZWN0TGFiZWxTaG93bkNoYW5nZSA9ICgpID0+IHtcbiAgICBjb25zb2xlLmxvZygnQ29ycmVjdCBMYWJlbCBTaG93biBDaGFuZ2VkJyk7XG4gIH07XG5cbiAgcHVibGljIGhhbmRsZUJ1Y2tldEluZm9TaG93bkNoYW5nZSA9ICgpID0+IHtcbiAgICBjb25zb2xlLmxvZygnQnVja2V0IEluZm8gU2hvd24gQ2hhbmdlZCcpO1xuICB9O1xuXG4gIHB1YmxpYyBoYW5kbGVCdWNrZXRDb250cm9sc1Nob3duQ2hhbmdlID0gKCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKCdCdWNrZXQgQ29udHJvbHMgU2hvd24gQ2hhbmdlZCcpO1xuICB9O1xuXG4gIHB1YmxpYyBhc3luYyBSdW4oYXBwOiBBcHApIHtcbiAgICB0aGlzLmFwcCA9IGFwcDtcbiAgICB0aGlzLmJ1aWxkUXVlc3Rpb25MaXN0KCkudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICB0aGlzLnF1ZXN0aW9uc0RhdGEgPSByZXN1bHQ7XG4gICAgICBBdWRpb0NvbnRyb2xsZXIuUHJlcGFyZUF1ZGlvQW5kSW1hZ2VzRm9yU3VydmV5KHRoaXMucXVlc3Rpb25zRGF0YSwgdGhpcy5hcHAuR2V0RGF0YVVSTCgpKTtcbiAgICAgIHRoaXMudW5pdHlCcmlkZ2UuU2VuZExvYWRlZCgpO1xuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIHN0YXJ0U3VydmV5ID0gKCkgPT4ge1xuICAgIFVJQ29udHJvbGxlci5SZWFkeUZvck5leHQodGhpcy5idWlsZE5ld1F1ZXN0aW9uKCkpO1xuICB9O1xuXG4gIHB1YmxpYyBvblF1ZXN0aW9uRW5kID0gKCkgPT4ge1xuICAgIFVJQ29udHJvbGxlci5TZXRGZWVkYmFja1Zpc2liaWxlKGZhbHNlLCBmYWxzZSk7XG5cbiAgICB0aGlzLmN1cnJlbnRRdWVzdGlvbkluZGV4ICs9IDE7XG5cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGlmICh0aGlzLkhhc1F1ZXN0aW9uc0xlZnQoKSkge1xuICAgICAgICBVSUNvbnRyb2xsZXIuUmVhZHlGb3JOZXh0KHRoaXMuYnVpbGROZXdRdWVzdGlvbigpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdUaGVyZSBhcmUgbm8gcXVlc3Rpb25zIGxlZnQuJyk7XG4gICAgICAgIHRoaXMub25FbmQoKTtcbiAgICAgIH1cbiAgICB9LCA1MDApO1xuICB9O1xuXG4gIHB1YmxpYyBoYW5kbGVBbnN3ZXJCdXR0b25QcmVzcyA9IChhbnN3ZXI6IG51bWJlciwgZWxhcHNlZDogbnVtYmVyKSA9PiB7XG4gICAgQW5hbHl0aWNzRXZlbnRzLnNlbmRBbnN3ZXJlZCh0aGlzLnF1ZXN0aW9uc0RhdGFbdGhpcy5jdXJyZW50UXVlc3Rpb25JbmRleF0sIGFuc3dlciwgZWxhcHNlZCk7XG4gICAgVUlDb250cm9sbGVyLlNldEZlZWRiYWNrVmlzaWJpbGUodHJ1ZSwgdHJ1ZSk7XG4gICAgVUlDb250cm9sbGVyLkFkZFN0YXIoKTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMub25RdWVzdGlvbkVuZCgpO1xuICAgIH0sIDIwMDApO1xuICB9O1xuXG4gIHB1YmxpYyBidWlsZFF1ZXN0aW9uTGlzdCA9ICgpID0+IHtcbiAgICBjb25zdCBzdXJ2ZXlRdWVzdGlvbnMgPSBmZXRjaFN1cnZleVF1ZXN0aW9ucyh0aGlzLmFwcC5kYXRhVVJMKTtcbiAgICByZXR1cm4gc3VydmV5UXVlc3Rpb25zO1xuICB9O1xuXG4gIHB1YmxpYyBIYXNRdWVzdGlvbnNMZWZ0KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmN1cnJlbnRRdWVzdGlvbkluZGV4IDw9IHRoaXMucXVlc3Rpb25zRGF0YS5sZW5ndGggLSAxO1xuICB9XG5cbiAgcHVibGljIGJ1aWxkTmV3UXVlc3Rpb24oKTogcURhdGEge1xuICAgIHZhciBxdWVzdGlvbkRhdGEgPSB0aGlzLnF1ZXN0aW9uc0RhdGFbdGhpcy5jdXJyZW50UXVlc3Rpb25JbmRleF07XG4gICAgcmV0dXJuIHF1ZXN0aW9uRGF0YTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgYnVja2V0IH0gZnJvbSAnLi4vYXNzZXNzbWVudC9idWNrZXREYXRhJztcblxuZXhwb3J0IGNsYXNzIFRyZWVOb2RlIHtcbiAgdmFsdWU6IG51bWJlciB8IGJ1Y2tldDtcbiAgbGVmdDogVHJlZU5vZGUgfCBudWxsO1xuICByaWdodDogVHJlZU5vZGUgfCBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKHZhbHVlOiBudW1iZXIpIHtcbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgdGhpcy5sZWZ0ID0gbnVsbDtcbiAgICB0aGlzLnJpZ2h0ID0gbnVsbDtcbiAgfVxufVxuXG4vKiogR2VuZXJhdGVzIGEgcmFuZG9tIGJpbmFyeSBzZWFyY2ggdHJlZSBmcm9tIGFcbiAtIElmIHRoZSBzdGFydCBhbmQgZW5kIGluZGljZXMgYXJlIHRoZSBzYW1lLCB0aGUgZnVuY3Rpb24gcmV0dXJucyBudWxsXG4gLSBJZiB0aGUgbWlkZGxlIGluZGV4IGlzIGV2ZW4sIHRoZSBmdW5jdGlvbiB1c2VzIHRoZSBleGFjdCBtaWRkbGUgcG9pbnRcbiAtIE90aGVyd2lzZSwgdGhlIGZ1bmN0aW9uIHJhbmRvbWx5IGFkZHMgMCBvciAxIHRvIHRoZSBtaWRkbGUgaW5kZXhcbiAtIFJldHVybnMgdGhlIHJvb3Qgbm9kZSBvZiB0aGUgZ2VuZXJhdGVkIGJpbmFyeSBzZWFyY2ggdHJlZSB3aGljaCBjb250YWlucyB0aGUgYnVja2V0SWRzIGlmIGNhbGxlZCBwcm9wZXJseVxuIC0gZXg6IGxldCByb290T2ZJZHMgPSBzb3J0ZWRBcnJheVRvQlNUKHRoaXMuYnVja2V0cywgdGhpcy5idWNrZXRzWzBdLmJ1Y2tldElEIC0gMSwgdGhpcy5idWNrZXRzW3RoaXMuYnVja2V0cy5sZW5ndGggLSAxXS5idWNrZXRJRCwgdXNlZEluZGljZXMpO1xuICovXG5leHBvcnQgZnVuY3Rpb24gc29ydGVkQXJyYXlUb0lEc0JTVChzdGFydCwgZW5kLCB1c2VkSW5kaWNlcykge1xuICBpZiAoc3RhcnQgPiBlbmQpIHJldHVybiBudWxsO1xuXG4gIC8vIFJhbmRvbWl6ZSBtaWRkbGUgcG9pbnQgd2l0aGluIHVudXNlZCBpbmRpY2VzXG4gIGxldCBtaWQ7XG5cbiAgaWYgKChzdGFydCArIGVuZCkgJSAyID09PSAwICYmIHVzZWRJbmRpY2VzLnNpemUgIT09IDEpIHtcbiAgICBtaWQgPSBNYXRoLmZsb29yKChzdGFydCArIGVuZCkgLyAyKTsgLy8gVXNlIHRoZSBleGFjdCBtaWRkbGUgcG9pbnRcbiAgICBpZiAobWlkID09PSAwKSByZXR1cm4gbnVsbDtcbiAgfSBlbHNlIHtcbiAgICBkbyB7XG4gICAgICBtaWQgPSBNYXRoLmZsb29yKChzdGFydCArIGVuZCkgLyAyKTtcbiAgICAgIG1pZCArPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyKTsgLy8gUmFuZG9tbHkgYWRkIDAgb3IgMSB0byBtaWRcbiAgICB9IHdoaWxlIChtaWQgPiBlbmQgfHwgdXNlZEluZGljZXMuaGFzKG1pZCkpO1xuICB9XG5cbiAgdXNlZEluZGljZXMuYWRkKG1pZCk7XG5cbiAgbGV0IG5vZGUgPSBuZXcgVHJlZU5vZGUobWlkKTtcblxuICBub2RlLmxlZnQgPSBzb3J0ZWRBcnJheVRvSURzQlNUKHN0YXJ0LCBtaWQgLSAxLCB1c2VkSW5kaWNlcyk7XG4gIG5vZGUucmlnaHQgPSBzb3J0ZWRBcnJheVRvSURzQlNUKG1pZCArIDEsIGVuZCwgdXNlZEluZGljZXMpO1xuXG4gIHJldHVybiBub2RlO1xufVxuIiwiLy90aGlzIGlzIHdoZXJlIHRoZSBsb2dpYyBmb3IgaGFuZGxpbmcgdGhlIGJ1Y2tldHMgd2lsbCBnb1xuLy9cbi8vb25jZSB3ZSBzdGFydCBhZGRpbmcgaW4gdGhlIGFzc2Vzc21lbnQgZnVuY3Rpb25hbGl0eVxuaW1wb3J0IHsgVUlDb250cm9sbGVyIH0gZnJvbSAnLi4vdWkvdWlDb250cm9sbGVyJztcbmltcG9ydCB7IHFEYXRhLCBhbnN3ZXJEYXRhIH0gZnJvbSAnLi4vY29tcG9uZW50cy9xdWVzdGlvbkRhdGEnO1xuaW1wb3J0IHsgQW5hbHl0aWNzRXZlbnRzIH0gZnJvbSAnLi4vYW5hbHl0aWNzL2FuYWx5dGljc0V2ZW50cyc7XG5pbXBvcnQgeyBBcHAgfSBmcm9tICcuLi9BcHAnO1xuaW1wb3J0IHsgYnVja2V0LCBidWNrZXRJdGVtIH0gZnJvbSAnLi9idWNrZXREYXRhJztcbmltcG9ydCB7IEJhc2VRdWl6IH0gZnJvbSAnLi4vYmFzZVF1aXonO1xuaW1wb3J0IHsgZmV0Y2hBc3Nlc3NtZW50QnVja2V0cyB9IGZyb20gJy4uL3V0aWxzL2pzb25VdGlscyc7XG5pbXBvcnQgeyBUcmVlTm9kZSwgc29ydGVkQXJyYXlUb0lEc0JTVCB9IGZyb20gJy4uL2NvbXBvbmVudHMvdE5vZGUnO1xuaW1wb3J0IHsgcmFuZEZyb20sIHNodWZmbGVBcnJheSB9IGZyb20gJy4uL3V0aWxzL21hdGhVdGlscyc7XG5pbXBvcnQgeyBBdWRpb0NvbnRyb2xsZXIgfSBmcm9tICcuLi9jb21wb25lbnRzL2F1ZGlvQ29udHJvbGxlcic7XG5cbmVudW0gc2VhcmNoU3RhZ2Uge1xuICBCaW5hcnlTZWFyY2gsXG4gIExpbmVhclNlYXJjaFVwLFxuICBMaW5lYXJTZWFyY2hEb3duLFxufVxuXG5lbnVtIEJ1Y2tldEdlbk1vZGUge1xuICBSYW5kb21CU1QsXG4gIExpbmVhckFycmF5QmFzZWQsXG59XG5cbmV4cG9ydCBjbGFzcyBBc3Nlc3NtZW50IGV4dGVuZHMgQmFzZVF1aXoge1xuICBwdWJsaWMgdW5pdHlCcmlkZ2U7XG5cbiAgcHVibGljIGN1cnJlbnROb2RlOiBUcmVlTm9kZTtcbiAgcHVibGljIGN1cnJlbnRRdWVzdGlvbjogcURhdGE7XG4gIHB1YmxpYyBidWNrZXRBcnJheTogbnVtYmVyW107XG4gIHB1YmxpYyBxdWVzdGlvbk51bWJlcjogbnVtYmVyO1xuXG4gIHB1YmxpYyBidWNrZXRzOiBidWNrZXRbXTtcbiAgcHVibGljIGN1cnJlbnRCdWNrZXQ6IGJ1Y2tldDtcbiAgcHVibGljIG51bUJ1Y2tldHM6IG51bWJlcjtcbiAgcHVibGljIGJhc2FsQnVja2V0OiBudW1iZXI7XG4gIHB1YmxpYyBjZWlsaW5nQnVja2V0OiBudW1iZXI7XG5cbiAgcHVibGljIGN1cnJlbnRMaW5lYXJCdWNrZXRJbmRleDogbnVtYmVyO1xuICBwdWJsaWMgY3VycmVudExpbmVhclRhcmdldEluZGV4OiBudW1iZXI7XG5cbiAgcHJvdGVjdGVkIGJ1Y2tldEdlbk1vZGU6IEJ1Y2tldEdlbk1vZGUgPSBCdWNrZXRHZW5Nb2RlLlJhbmRvbUJTVDtcblxuICBwcml2YXRlIE1BWF9TVEFSU19DT1VOVF9JTl9MSU5FQVJfTU9ERSA9IDIwO1xuXG4gIGNvbnN0cnVjdG9yKGRhdGFVUkw6IHN0cmluZywgdW5pdHlCcmlkZ2U6IGFueSkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5kYXRhVVJMID0gZGF0YVVSTDtcbiAgICB0aGlzLnVuaXR5QnJpZGdlID0gdW5pdHlCcmlkZ2U7XG4gICAgdGhpcy5xdWVzdGlvbk51bWJlciA9IDA7XG4gICAgY29uc29sZS5sb2coJ2FwcCBpbml0aWFsaXplZCcpO1xuICAgIHRoaXMuc2V0dXBVSUhhbmRsZXJzKCk7XG4gIH1cbiAgcHJpdmF0ZSBzZXR1cFVJSGFuZGxlcnMoKTogdm9pZCB7XG4gICAgVUlDb250cm9sbGVyLlNldEJ1dHRvblByZXNzQWN0aW9uKHRoaXMuaGFuZGxlQW5zd2VyQnV0dG9uUHJlc3MpO1xuICAgIFVJQ29udHJvbGxlci5TZXRTdGFydEFjdGlvbih0aGlzLnN0YXJ0QXNzZXNzbWVudCk7XG4gICAgVUlDb250cm9sbGVyLlNldEV4dGVybmFsQnVja2V0Q29udHJvbHNHZW5lcmF0aW9uSGFuZGxlcih0aGlzLmdlbmVyYXRlRGV2TW9kZUJ1Y2tldENvbnRyb2xzSW5Db250YWluZXIpO1xuICB9XG4gIHB1YmxpYyBSdW4oYXBwbGluazogQXBwKTogdm9pZCB7XG4gICAgdGhpcy5hcHAgPSBhcHBsaW5rO1xuICAgIHRoaXMuYnVpbGRCdWNrZXRzKHRoaXMuYnVja2V0R2VuTW9kZSkudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyh0aGlzLmN1cnJlbnRCdWNrZXQpO1xuICAgICAgdGhpcy51bml0eUJyaWRnZS5TZW5kTG9hZGVkKCk7XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgaGFuZGxlQnVja2V0R2VuTW9kZUNoYW5nZShldmVudDogRXZlbnQpOiB2b2lkIHtcbiAgICAvLyBUT0RPOiBJbXBsZW1lbnQgaGFuZGxlQnVja2V0R2VuTW9kZUNoYW5nZVxuICAgIHRoaXMuYnVja2V0R2VuTW9kZSA9IHBhcnNlSW50KHRoaXMuZGV2TW9kZUJ1Y2tldEdlblNlbGVjdC52YWx1ZSkgYXMgQnVja2V0R2VuTW9kZTtcbiAgICB0aGlzLmJ1aWxkQnVja2V0cyh0aGlzLmJ1Y2tldEdlbk1vZGUpLnRoZW4oKCkgPT4ge1xuICAgICAgLy8gRmluaXNoZWQgYnVpbGRpbmcgYnVja2V0c1xuICAgIH0pO1xuICAgIHRoaXMudXBkYXRlQnVja2V0SW5mbygpO1xuICB9XG5cbiAgcHVibGljIGhhbmRsZUNvcnJlY3RMYWJlbFNob3duQ2hhbmdlKCk6IHZvaWQge1xuICAgIFVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLlNldENvcnJlY3RMYWJlbFZpc2liaWxpdHkodGhpcy5pc0NvcnJlY3RMYWJlbFNob3duKTtcbiAgfVxuXG4gIHB1YmxpYyBoYW5kbGVBbmltYXRpb25TcGVlZE11bHRpcGxpZXJDaGFuZ2UoKTogdm9pZCB7XG4gICAgVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkuU2V0QW5pbWF0aW9uU3BlZWRNdWx0aXBsaWVyKHRoaXMuYW5pbWF0aW9uU3BlZWRNdWx0aXBsaWVyKTtcbiAgfVxuXG4gIHB1YmxpYyBoYW5kbGVCdWNrZXRJbmZvU2hvd25DaGFuZ2UoKTogdm9pZCB7XG4gICAgdGhpcy51cGRhdGVCdWNrZXRJbmZvKCk7XG4gIH1cblxuICBwdWJsaWMgaGFuZGxlQnVja2V0Q29udHJvbHNTaG93bkNoYW5nZSgpOiB2b2lkIHtcbiAgICBVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5TZXRCdWNrZXRDb250cm9sc1Zpc2liaWxpdHkodGhpcy5pc0J1Y2tldENvbnRyb2xzRW5hYmxlZCk7XG4gIH1cblxuICBwdWJsaWMgZ2VuZXJhdGVEZXZNb2RlQnVja2V0Q29udHJvbHNJbkNvbnRhaW5lciA9IChjb250YWluZXI6IEhUTUxFbGVtZW50LCBjbGlja0hhbmRsZXI6ICgpID0+IHZvaWQpID0+IHtcbiAgICBpZiAodGhpcy5pc0luRGV2TW9kZSAmJiB0aGlzLmJ1Y2tldEdlbk1vZGUgPT09IEJ1Y2tldEdlbk1vZGUuTGluZWFyQXJyYXlCYXNlZCkge1xuICAgICAgLy8gQ3JlYXRlIGJ1dHRvbnMgZm9yIHRoZSBjdXJyZW50IGJ1Y2tldCBpdGVtcywgdGhhdCBhcmUgY2xpY2thYmxlIGFuZCB3aWxsIHRyaWdnZXIgdGhlIGl0ZW0gYXVkaW9cbiAgICAgIC8vIEFkZCAyIGJ1dHRvbnMsIG9uZSBmb3IgbW92aW5nIHVwIGFuZCBvbmUgZm9yIG1vdmluZyBkb3duIHRoZSBidWNrZXQgdHJlZVxuICAgICAgLy8gRW1wdHkgdGhlIGNvbnRhaW5lciBiZWZvcmUgYWRkaW5nIG5ldyBidXR0b25zXG4gICAgICBjb250YWluZXIuaW5uZXJIVE1MID0gJyc7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY3VycmVudEJ1Y2tldC5pdGVtcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBsZXQgaXRlbSA9IHRoaXMuY3VycmVudEJ1Y2tldC5pdGVtc1tpXTtcbiAgICAgICAgbGV0IGl0ZW1CdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgICAgbGV0IGluZGV4ID0gaTtcbiAgICAgICAgaXRlbUJ1dHRvbi5pbm5lclRleHQgPSBpdGVtLml0ZW1OYW1lO1xuICAgICAgICBpdGVtQnV0dG9uLnN0eWxlLm1hcmdpbiA9ICcycHgnO1xuICAgICAgICBpdGVtQnV0dG9uLm9uY2xpY2sgPSAoKSA9PiB7XG4gICAgICAgICAgdGhpcy5jdXJyZW50TGluZWFyVGFyZ2V0SW5kZXggPSBpbmRleDtcbiAgICAgICAgICB0aGlzLmN1cnJlbnRCdWNrZXQudXNlZEl0ZW1zID0gW107XG4gICAgICAgICAgY29uc29sZS5sb2coJ0NsaWNrZWQgb24gaXRlbSAnICsgaXRlbS5pdGVtTmFtZSArICcgYXQgaW5kZXggJyArIHRoaXMuY3VycmVudExpbmVhclRhcmdldEluZGV4KTtcbiAgICAgICAgICAvLyBVSUNvbnRyb2xsZXIuUmVhZHlGb3JOZXh0KHRoaXMuYnVpbGROZXdRdWVzdGlvbigpLCBmYWxzZSk7XG4gICAgICAgICAgY29uc3QgbmV3USA9IHRoaXMuYnVpbGROZXdRdWVzdGlvbigpO1xuICAgICAgICAgIFVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLmFuc3dlcnNDb250YWluZXIuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuICAgICAgICAgIGZvciAobGV0IGIgaW4gVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkuYnV0dG9ucykge1xuICAgICAgICAgICAgVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkuYnV0dG9uc1tiXS5zdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbic7XG4gICAgICAgICAgfVxuICAgICAgICAgIFVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLnNob3duID0gZmFsc2U7XG4gICAgICAgICAgVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkubmV4dFF1ZXN0aW9uID0gbmV3UTtcbiAgICAgICAgICBVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5xdWVzdGlvbnNDb250YWluZXIuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgICAgVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkucXVlc3Rpb25zQ29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgVUlDb250cm9sbGVyLlNob3dRdWVzdGlvbihuZXdRKTtcbiAgICAgICAgICBBdWRpb0NvbnRyb2xsZXIuUGxheUF1ZGlvKFxuICAgICAgICAgICAgdGhpcy5idWlsZE5ld1F1ZXN0aW9uKCkucHJvbXB0QXVkaW8sXG4gICAgICAgICAgICBVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5zaG93T3B0aW9ucyxcbiAgICAgICAgICAgIFVJQ29udHJvbGxlci5TaG93QXVkaW9BbmltYXRpb25cbiAgICAgICAgICApO1xuICAgICAgICAgIC8vIGNsaWNrSGFuZGxlcigpO1xuICAgICAgICB9O1xuICAgICAgICBjb250YWluZXIuYXBwZW5kKGl0ZW1CdXR0b24pO1xuICAgICAgfVxuICAgICAgLy8gQ3JlYXRlIDIgbW9yZSBidXR0b25zIGZvciBtb3ZpbmcgdXAgYW5kIGRvd24gdGhlIGJ1Y2tldCB0cmVlXG4gICAgICBsZXQgcHJldkJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgcHJldkJ1dHRvbi5pbm5lclRleHQgPSAnUHJldiBCdWNrZXQnO1xuICAgICAgaWYgKHRoaXMuY3VycmVudExpbmVhckJ1Y2tldEluZGV4ID09IDApIHtcbiAgICAgICAgcHJldkJ1dHRvbi5kaXNhYmxlZCA9IHRydWU7XG4gICAgICB9XG4gICAgICBwcmV2QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5jdXJyZW50TGluZWFyQnVja2V0SW5kZXggPiAwKSB7XG4gICAgICAgICAgdGhpcy5jdXJyZW50TGluZWFyQnVja2V0SW5kZXgtLTtcbiAgICAgICAgICB0aGlzLmN1cnJlbnRMaW5lYXJUYXJnZXRJbmRleCA9IDA7XG4gICAgICAgICAgdGhpcy50cnlNb3ZlQnVja2V0KGZhbHNlKTtcbiAgICAgICAgICBVSUNvbnRyb2xsZXIuUmVhZHlGb3JOZXh0KHRoaXMuYnVpbGROZXdRdWVzdGlvbigpKTtcbiAgICAgICAgICB0aGlzLnVwZGF0ZUJ1Y2tldEluZm8oKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5jdXJyZW50TGluZWFyQnVja2V0SW5kZXggPT0gMCkge1xuICAgICAgICAgIHByZXZCdXR0b24uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGxldCBuZXh0QnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgICBuZXh0QnV0dG9uLmlubmVyVGV4dCA9ICdOZXh0IEJ1Y2tldCc7XG4gICAgICBpZiAodGhpcy5jdXJyZW50TGluZWFyQnVja2V0SW5kZXggPT0gdGhpcy5idWNrZXRzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgbmV4dEJ1dHRvbi5kaXNhYmxlZCA9IHRydWU7XG4gICAgICB9XG4gICAgICBuZXh0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5jdXJyZW50TGluZWFyQnVja2V0SW5kZXggPCB0aGlzLmJ1Y2tldHMubGVuZ3RoIC0gMSkge1xuICAgICAgICAgIHRoaXMuY3VycmVudExpbmVhckJ1Y2tldEluZGV4Kys7XG4gICAgICAgICAgdGhpcy5jdXJyZW50TGluZWFyVGFyZ2V0SW5kZXggPSAwO1xuICAgICAgICAgIHRoaXMudHJ5TW92ZUJ1Y2tldChmYWxzZSk7XG4gICAgICAgICAgVUlDb250cm9sbGVyLlJlYWR5Rm9yTmV4dCh0aGlzLmJ1aWxkTmV3UXVlc3Rpb24oKSk7XG4gICAgICAgICAgdGhpcy51cGRhdGVCdWNrZXRJbmZvKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICAvLyBBcHBlbmQgdGhlIGJ1dHRvbnMgdG8gdGhlIGNvbnRhaW5lclxuICAgICAgbGV0IGJ1dHRvbnNDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGJ1dHRvbnNDb250YWluZXIuc3R5bGUuZGlzcGxheSA9ICdmbGV4JztcbiAgICAgIGJ1dHRvbnNDb250YWluZXIuc3R5bGUuZmxleERpcmVjdGlvbiA9ICdyb3cnO1xuICAgICAgYnV0dG9uc0NvbnRhaW5lci5zdHlsZS5qdXN0aWZ5Q29udGVudCA9ICdjZW50ZXInO1xuICAgICAgYnV0dG9uc0NvbnRhaW5lci5zdHlsZS5hbGlnbkl0ZW1zID0gJ2NlbnRlcic7XG4gICAgICBidXR0b25zQ29udGFpbmVyLmFwcGVuZENoaWxkKHByZXZCdXR0b24pO1xuICAgICAgYnV0dG9uc0NvbnRhaW5lci5hcHBlbmRDaGlsZChuZXh0QnV0dG9uKTtcblxuICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGJ1dHRvbnNDb250YWluZXIpO1xuICAgIH1cbiAgfTtcblxuICBwdWJsaWMgdXBkYXRlQnVja2V0SW5mbyA9ICgpID0+IHtcbiAgICBpZiAodGhpcy5jdXJyZW50QnVja2V0ICE9IG51bGwpIHtcbiAgICAgIHRoaXMuZGV2TW9kZUJ1Y2tldEluZm9Db250YWluZXIuaW5uZXJIVE1MID0gYEJ1Y2tldDogJHt0aGlzLmN1cnJlbnRCdWNrZXQuYnVja2V0SUR9PGJyLz5Db3JyZWN0OiAke3RoaXMuY3VycmVudEJ1Y2tldC5udW1Db3JyZWN0fTxici8+VHJpZWQ6ICR7dGhpcy5jdXJyZW50QnVja2V0Lm51bVRyaWVkfTxici8+RmFpbGVkOiAke3RoaXMuY3VycmVudEJ1Y2tldC5udW1Db25zZWN1dGl2ZVdyb25nfWA7XG4gICAgfVxuICB9O1xuXG4gIHB1YmxpYyBzdGFydEFzc2Vzc21lbnQgPSAoKSA9PiB7XG4gICAgVUlDb250cm9sbGVyLlJlYWR5Rm9yTmV4dCh0aGlzLmJ1aWxkTmV3UXVlc3Rpb24oKSk7XG4gICAgaWYgKHRoaXMuaXNJbkRldk1vZGUpIHtcbiAgICAgIHRoaXMuaGlkZURldk1vZGVCdXR0b24oKTtcbiAgICB9XG4gIH07XG5cbiAgcHVibGljIGJ1aWxkQnVja2V0cyA9IGFzeW5jIChidWNrZXRHZW5Nb2RlOiBCdWNrZXRHZW5Nb2RlKSA9PiB7XG4gICAgLy8gSWYgd2UgZG9uJ3QgaGF2ZSB0aGUgYnVja2V0cyBsb2FkZWQsIGxvYWQgdGhlbSBhbmQgaW5pdGlhbGl6ZSB0aGUgY3VycmVudCBub2RlLCB3aGljaCBpcyB0aGUgc3RhcnRpbmcgcG9pbnRcbiAgICBpZiAodGhpcy5idWNrZXRzID09PSB1bmRlZmluZWQgfHwgdGhpcy5idWNrZXRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgY29uc3QgcmVzID0gZmV0Y2hBc3Nlc3NtZW50QnVja2V0cyh0aGlzLmFwcC5HZXREYXRhVVJMKCkpLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgICB0aGlzLmJ1Y2tldHMgPSByZXN1bHQ7XG4gICAgICAgIHRoaXMubnVtQnVja2V0cyA9IHJlc3VsdC5sZW5ndGg7XG4gICAgICAgIGNvbnNvbGUubG9nKCdidWNrZXRzOiAnICsgdGhpcy5idWNrZXRzKTtcbiAgICAgICAgdGhpcy5idWNrZXRBcnJheSA9IEFycmF5LmZyb20oQXJyYXkodGhpcy5udW1CdWNrZXRzKSwgKF8sIGkpID0+IGkgKyAxKTtcbiAgICAgICAgY29uc29sZS5sb2coJ2VtcHR5IGFycmF5ICcgKyB0aGlzLmJ1Y2tldEFycmF5KTtcbiAgICAgICAgbGV0IHVzZWRJbmRpY2VzID0gbmV3IFNldDxudW1iZXI+KCk7XG4gICAgICAgIHVzZWRJbmRpY2VzLmFkZCgwKTtcbiAgICAgICAgbGV0IHJvb3RPZklEcyA9IHNvcnRlZEFycmF5VG9JRHNCU1QoXG4gICAgICAgICAgdGhpcy5idWNrZXRzWzBdLmJ1Y2tldElEIC0gMSxcbiAgICAgICAgICB0aGlzLmJ1Y2tldHNbdGhpcy5idWNrZXRzLmxlbmd0aCAtIDFdLmJ1Y2tldElELFxuICAgICAgICAgIHVzZWRJbmRpY2VzXG4gICAgICAgICk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiR2VuZXJhdGVkIHRoZSBidWNrZXRzIHJvb3QgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVwiKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2cocm9vdE9mSURzKTtcbiAgICAgICAgbGV0IGJ1Y2tldHNSb290ID0gdGhpcy5jb252ZXJ0VG9CdWNrZXRCU1Qocm9vdE9mSURzLCB0aGlzLmJ1Y2tldHMpO1xuICAgICAgICBjb25zb2xlLmxvZygnR2VuZXJhdGVkIHRoZSBidWNrZXRzIHJvb3QgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpO1xuICAgICAgICBjb25zb2xlLmxvZyhidWNrZXRzUm9vdCk7XG4gICAgICAgIHRoaXMuYmFzYWxCdWNrZXQgPSB0aGlzLm51bUJ1Y2tldHMgKyAxO1xuICAgICAgICB0aGlzLmNlaWxpbmdCdWNrZXQgPSAtMTtcbiAgICAgICAgdGhpcy5jdXJyZW50Tm9kZSA9IGJ1Y2tldHNSb290O1xuICAgICAgICB0aGlzLnRyeU1vdmVCdWNrZXQoZmFsc2UpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmVzO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoYnVja2V0R2VuTW9kZSA9PT0gQnVja2V0R2VuTW9kZS5SYW5kb21CU1QpIHtcbiAgICAgICAgLy8gSWYgd2UgaGF2ZSB0aGUgYnVja2V0cyBsb2FkZWQsIHdlIGNhbiBpbml0aWFsaXplIHRoZSBjdXJyZW50IG5vZGUsIHdoaWNoIGlzIHRoZSBzdGFydGluZyBwb2ludFxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8dm9pZD4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgIGxldCB1c2VkSW5kaWNlcyA9IG5ldyBTZXQ8bnVtYmVyPigpO1xuICAgICAgICAgIHVzZWRJbmRpY2VzLmFkZCgwKTtcbiAgICAgICAgICBsZXQgcm9vdE9mSURzID0gc29ydGVkQXJyYXlUb0lEc0JTVChcbiAgICAgICAgICAgIHRoaXMuYnVja2V0c1swXS5idWNrZXRJRCAtIDEsXG4gICAgICAgICAgICB0aGlzLmJ1Y2tldHNbdGhpcy5idWNrZXRzLmxlbmd0aCAtIDFdLmJ1Y2tldElELFxuICAgICAgICAgICAgdXNlZEluZGljZXNcbiAgICAgICAgICApO1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiR2VuZXJhdGVkIHRoZSBidWNrZXRzIHJvb3QgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVwiKTtcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyhyb290T2ZJRHMpO1xuICAgICAgICAgIGxldCBidWNrZXRzUm9vdCA9IHRoaXMuY29udmVydFRvQnVja2V0QlNUKHJvb3RPZklEcywgdGhpcy5idWNrZXRzKTtcbiAgICAgICAgICBjb25zb2xlLmxvZygnR2VuZXJhdGVkIHRoZSBidWNrZXRzIHJvb3QgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpO1xuICAgICAgICAgIGNvbnNvbGUubG9nKGJ1Y2tldHNSb290KTtcbiAgICAgICAgICB0aGlzLmJhc2FsQnVja2V0ID0gdGhpcy5udW1CdWNrZXRzICsgMTtcbiAgICAgICAgICB0aGlzLmNlaWxpbmdCdWNrZXQgPSAtMTtcbiAgICAgICAgICB0aGlzLmN1cnJlbnROb2RlID0gYnVja2V0c1Jvb3Q7XG4gICAgICAgICAgdGhpcy50cnlNb3ZlQnVja2V0KGZhbHNlKTtcbiAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIGlmIChidWNrZXRHZW5Nb2RlID09PSBCdWNrZXRHZW5Nb2RlLkxpbmVhckFycmF5QmFzZWQpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPHZvaWQ+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICB0aGlzLmN1cnJlbnRMaW5lYXJCdWNrZXRJbmRleCA9IDA7XG4gICAgICAgICAgdGhpcy5jdXJyZW50TGluZWFyVGFyZ2V0SW5kZXggPSAwO1xuICAgICAgICAgIHRoaXMudHJ5TW92ZUJ1Y2tldChmYWxzZSk7XG4gICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIENvbnZlcnRzIGEgYmluYXJ5IHNlYXJjaCB0cmVlIG9mIG51bWJlcnMgdG8gYSBiaW5hcnkgc2VhcmNoIHRyZWUgb2YgYnVja2V0IG9iamVjdHNcbiAgICogQHBhcmFtIG5vZGUgSXMgYSByb290IG5vZGUgb2YgYSBiaW5hcnkgc2VhcmNoIHRyZWVcbiAgICogQHBhcmFtIGJ1Y2tldHMgSXMgYW4gYXJyYXkgb2YgYnVja2V0IG9iamVjdHNcbiAgICogQHJldHVybnMgQSByb290IG5vZGUgb2YgYSBiaW5hcnkgc2VhcmNoIHRyZWUgd2hlcmUgdGhlIHZhbHVlIG9mIGVhY2ggbm9kZSBpcyBhIGJ1Y2tldCBvYmplY3RcbiAgICovXG4gIHB1YmxpYyBjb252ZXJ0VG9CdWNrZXRCU1QgPSAobm9kZTogVHJlZU5vZGUsIGJ1Y2tldHM6IGJ1Y2tldFtdKSA9PiB7XG4gICAgLy8gVHJhdmVyc2UgZWFjaCBlbGVtZW50IHRha2UgdGhlIHZhbHVlIGFuZCBmaW5kIHRoYXQgYnVja2V0IGluIHRoZSBidWNrZXRzIGFycmF5IGFuZCBhc3NpZ24gdGhhdCBidWNrZXQgaW5zdGVhZCBvZiB0aGUgbnVtYmVyIHZhbHVlXG4gICAgaWYgKG5vZGUgPT09IG51bGwpIHJldHVybiBub2RlO1xuXG4gICAgbGV0IGJ1Y2tldElkID0gbm9kZS52YWx1ZTtcbiAgICBub2RlLnZhbHVlID0gYnVja2V0cy5maW5kKChidWNrZXQpID0+IGJ1Y2tldC5idWNrZXRJRCA9PT0gYnVja2V0SWQpO1xuICAgIGlmIChub2RlLmxlZnQgIT09IG51bGwpIG5vZGUubGVmdCA9IHRoaXMuY29udmVydFRvQnVja2V0QlNUKG5vZGUubGVmdCwgYnVja2V0cyk7XG4gICAgaWYgKG5vZGUucmlnaHQgIT09IG51bGwpIG5vZGUucmlnaHQgPSB0aGlzLmNvbnZlcnRUb0J1Y2tldEJTVChub2RlLnJpZ2h0LCBidWNrZXRzKTtcblxuICAgIHJldHVybiBub2RlO1xuICB9O1xuXG4gIHB1YmxpYyBpbml0QnVja2V0ID0gKGJ1Y2tldDogYnVja2V0KSA9PiB7XG4gICAgdGhpcy5jdXJyZW50QnVja2V0ID0gYnVja2V0O1xuICAgIHRoaXMuY3VycmVudEJ1Y2tldC51c2VkSXRlbXMgPSBbXTtcbiAgICB0aGlzLmN1cnJlbnRCdWNrZXQubnVtVHJpZWQgPSAwO1xuICAgIHRoaXMuY3VycmVudEJ1Y2tldC5udW1Db3JyZWN0ID0gMDtcbiAgICB0aGlzLmN1cnJlbnRCdWNrZXQubnVtQ29uc2VjdXRpdmVXcm9uZyA9IDA7XG4gICAgdGhpcy5jdXJyZW50QnVja2V0LnRlc3RlZCA9IHRydWU7XG4gICAgdGhpcy5jdXJyZW50QnVja2V0LnBhc3NlZCA9IGZhbHNlO1xuICB9O1xuXG4gIHB1YmxpYyBoYW5kbGVBbnN3ZXJCdXR0b25QcmVzcyA9IChhbnN3ZXI6IG51bWJlciwgZWxhcHNlZDogbnVtYmVyKSA9PiB7XG4gICAgaWYgKHRoaXMuYnVja2V0R2VuTW9kZSA9PT0gQnVja2V0R2VuTW9kZS5SYW5kb21CU1QpIHtcbiAgICAgIEFuYWx5dGljc0V2ZW50cy5zZW5kQW5zd2VyZWQodGhpcy5jdXJyZW50UXVlc3Rpb24sIGFuc3dlciwgZWxhcHNlZCk7XG4gICAgfVxuICAgIHRoaXMudXBkYXRlQ3VycmVudEJ1Y2tldFZhbHVlc0FmdGVyQW5zd2VyaW5nKGFuc3dlcik7XG4gICAgdGhpcy51cGRhdGVGZWVkYmFja0FmdGVyQW5zd2VyKGFuc3dlcik7XG5cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKCdDb21wbGV0ZWQgZmlyc3QgVGltZW91dCcpO1xuICAgICAgdGhpcy5vblF1ZXN0aW9uRW5kKCk7XG4gICAgfSwgMjAwMCAqIHRoaXMuYW5pbWF0aW9uU3BlZWRNdWx0aXBsaWVyKTtcbiAgfTtcblxuICBwcml2YXRlIHVwZGF0ZUZlZWRiYWNrQWZ0ZXJBbnN3ZXIoYW5zd2VyOiBudW1iZXIpIHtcbiAgICBpZiAoXG4gICAgICB0aGlzLmJ1Y2tldEdlbk1vZGUgPT09IEJ1Y2tldEdlbk1vZGUuTGluZWFyQXJyYXlCYXNlZCAmJlxuICAgICAgVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkuc2hvd25TdGFyc0NvdW50IDwgdGhpcy5NQVhfU1RBUlNfQ09VTlRfSU5fTElORUFSX01PREVcbiAgICApIHtcbiAgICAgIFVJQ29udHJvbGxlci5BZGRTdGFyKCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmJ1Y2tldEdlbk1vZGUgPT09IEJ1Y2tldEdlbk1vZGUuUmFuZG9tQlNUKSB7XG4gICAgICBVSUNvbnRyb2xsZXIuQWRkU3RhcigpO1xuICAgIH1cbiAgICBVSUNvbnRyb2xsZXIuU2V0RmVlZGJhY2tWaXNpYmlsZShcbiAgICAgIHRydWUsXG4gICAgICB0aGlzLmN1cnJlbnRRdWVzdGlvbi5hbnN3ZXJzW2Fuc3dlciAtIDFdLmFuc3dlck5hbWUgPT0gdGhpcy5jdXJyZW50UXVlc3Rpb24uY29ycmVjdFxuICAgICk7XG4gIH1cbiAgcHJpdmF0ZSB1cGRhdGVDdXJyZW50QnVja2V0VmFsdWVzQWZ0ZXJBbnN3ZXJpbmcoYW5zd2VyOiBudW1iZXIpIHtcbiAgICB0aGlzLmN1cnJlbnRCdWNrZXQubnVtVHJpZWQgKz0gMTtcbiAgICBpZiAodGhpcy5jdXJyZW50UXVlc3Rpb24uYW5zd2Vyc1thbnN3ZXIgLSAxXS5hbnN3ZXJOYW1lID09IHRoaXMuY3VycmVudFF1ZXN0aW9uLmNvcnJlY3QpIHtcbiAgICAgIHRoaXMuY3VycmVudEJ1Y2tldC5udW1Db3JyZWN0ICs9IDE7XG4gICAgICB0aGlzLmN1cnJlbnRCdWNrZXQubnVtQ29uc2VjdXRpdmVXcm9uZyA9IDA7XG4gICAgICBjb25zb2xlLmxvZygnQW5zd2VyZWQgY29ycmVjdGx5Jyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY3VycmVudEJ1Y2tldC5udW1Db25zZWN1dGl2ZVdyb25nICs9IDE7XG4gICAgICBjb25zb2xlLmxvZygnQW5zd2VyZWQgaW5jb3JyZWN0bHksICcgKyB0aGlzLmN1cnJlbnRCdWNrZXQubnVtQ29uc2VjdXRpdmVXcm9uZyk7XG4gICAgfVxuICB9XG4gIHB1YmxpYyBvblF1ZXN0aW9uRW5kID0gKCkgPT4ge1xuICAgIGxldCBxdWVzdGlvbkVuZFRpbWVvdXQgPSB0aGlzLkhhc1F1ZXN0aW9uc0xlZnQoKVxuICAgICAgPyA1MDAgKiB0aGlzLmFuaW1hdGlvblNwZWVkTXVsdGlwbGllclxuICAgICAgOiA0MDAwICogdGhpcy5hbmltYXRpb25TcGVlZE11bHRpcGxpZXI7XG5cbiAgICBjb25zdCBlbmRPcGVyYXRpb25zID0gKCkgPT4ge1xuICAgICAgVUlDb250cm9sbGVyLlNldEZlZWRiYWNrVmlzaWJpbGUoZmFsc2UsIGZhbHNlKTtcbiAgICAgIGlmIChcbiAgICAgICAgdGhpcy5idWNrZXRHZW5Nb2RlID09PSBCdWNrZXRHZW5Nb2RlLkxpbmVhckFycmF5QmFzZWQgJiZcbiAgICAgICAgVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkuc2hvd25TdGFyc0NvdW50IDwgdGhpcy5NQVhfU1RBUlNfQ09VTlRfSU5fTElORUFSX01PREVcbiAgICAgICkge1xuICAgICAgICBVSUNvbnRyb2xsZXIuQ2hhbmdlU3RhckltYWdlQWZ0ZXJBbmltYXRpb24oKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5idWNrZXRHZW5Nb2RlID09PSBCdWNrZXRHZW5Nb2RlLlJhbmRvbUJTVCkge1xuICAgICAgICBVSUNvbnRyb2xsZXIuQ2hhbmdlU3RhckltYWdlQWZ0ZXJBbmltYXRpb24oKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLkhhc1F1ZXN0aW9uc0xlZnQoKSkge1xuICAgICAgICBpZiAodGhpcy5idWNrZXRHZW5Nb2RlID09PSBCdWNrZXRHZW5Nb2RlLkxpbmVhckFycmF5QmFzZWQgJiYgIXRoaXMuaXNCdWNrZXRDb250cm9sc0VuYWJsZWQpIHtcbiAgICAgICAgICBpZiAodGhpcy5jdXJyZW50TGluZWFyVGFyZ2V0SW5kZXggPCB0aGlzLmJ1Y2tldHNbdGhpcy5jdXJyZW50TGluZWFyQnVja2V0SW5kZXhdLml0ZW1zLmxlbmd0aCkge1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50TGluZWFyVGFyZ2V0SW5kZXgrKztcbiAgICAgICAgICAgIC8vIFdlIG5lZWQgdG8gcmVzZXQgdGhlIHVzZWQgaXRlbXMgYXJyYXkgd2hlbiB3ZSBtb3ZlIHRvIHRoZSBuZXh0IHF1ZXN0aW9uIGluIGxpbmVhciBtb2RlXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRCdWNrZXQudXNlZEl0ZW1zID0gW107XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgdGhpcy5jdXJyZW50TGluZWFyVGFyZ2V0SW5kZXggPj0gdGhpcy5idWNrZXRzW3RoaXMuY3VycmVudExpbmVhckJ1Y2tldEluZGV4XS5pdGVtcy5sZW5ndGggJiZcbiAgICAgICAgICAgIHRoaXMuY3VycmVudExpbmVhckJ1Y2tldEluZGV4IDwgdGhpcy5idWNrZXRzLmxlbmd0aFxuICAgICAgICAgICkge1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50TGluZWFyQnVja2V0SW5kZXgrKztcbiAgICAgICAgICAgIHRoaXMuY3VycmVudExpbmVhclRhcmdldEluZGV4ID0gMDtcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRMaW5lYXJCdWNrZXRJbmRleCA8IHRoaXMuYnVja2V0cy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgdGhpcy50cnlNb3ZlQnVja2V0KGZhbHNlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdObyBxdWVzdGlvbnMgbGVmdCcpO1xuICAgICAgICAgICAgICB0aGlzLm9uRW5kKCk7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBVSUNvbnRyb2xsZXIuUmVhZHlGb3JOZXh0KHRoaXMuYnVpbGROZXdRdWVzdGlvbigpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdObyBxdWVzdGlvbnMgbGVmdCcpO1xuICAgICAgICB0aGlzLm9uRW5kKCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIC8vIENyZWF0ZSBhIHByb21pc2UgdGhhdCByZXNvbHZlcyBhZnRlciB0aGUgc3BlY2lmaWVkIHRpbWVvdXRcbiAgICBjb25zdCB0aW1lb3V0UHJvbWlzZSA9IG5ldyBQcm9taXNlPHZvaWQ+KChyZXNvbHZlKSA9PiB7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgfSwgcXVlc3Rpb25FbmRUaW1lb3V0KTtcbiAgICB9KTtcblxuICAgIC8vIEV4ZWN1dGUgZW5kT3BlcmF0aW9ucyBhZnRlciB0aW1lb3V0UHJvbWlzZSByZXNvbHZlc1xuICAgIHRpbWVvdXRQcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgZW5kT3BlcmF0aW9ucygpO1xuXG4gICAgICAvLyBDb21wbGV0ZWQgZW5kIG9wZXJhdGlvbnMsIHNob3VsZCB1cGRhdGUgYnVja2V0IGluZm8gaWYgaW4gZGV2IG1vZGVcbiAgICAgIGlmICh0aGlzLmlzSW5EZXZNb2RlKSB7XG4gICAgICAgIHRoaXMudXBkYXRlQnVja2V0SW5mbygpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuICBwdWJsaWMgYnVpbGROZXdRdWVzdGlvbiA9ICgpID0+IHtcbiAgICBpZiAodGhpcy5pc0xpbmVhckFycmF5RXhoYXVzdGVkKCkpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IHRhcmdldEl0ZW0gPSB0aGlzLnNlbGVjdFRhcmdldEl0ZW0oKTtcbiAgICBjb25zdCBmb2lscyA9IHRoaXMuZ2VuZXJhdGVGb2lscyh0YXJnZXRJdGVtKTtcbiAgICBjb25zdCBhbnN3ZXJPcHRpb25zID0gdGhpcy5zaHVmZmxlQW5zd2VyT3B0aW9ucyhbdGFyZ2V0SXRlbSwgLi4uZm9pbHNdKTtcblxuICAgIGNvbnN0IG5ld1F1ZXN0aW9uID0gdGhpcy5jcmVhdGVRdWVzdGlvbih0YXJnZXRJdGVtLCBhbnN3ZXJPcHRpb25zKTtcbiAgICB0aGlzLmN1cnJlbnRRdWVzdGlvbiA9IG5ld1F1ZXN0aW9uO1xuICAgIHRoaXMucXVlc3Rpb25OdW1iZXIgKz0gMTtcblxuICAgIHJldHVybiBuZXdRdWVzdGlvbjtcbiAgfTtcblxuICBwcml2YXRlIGlzTGluZWFyQXJyYXlFeGhhdXN0ZWQgPSAoKTogYm9vbGVhbiA9PiB7XG4gICAgcmV0dXJuIChcbiAgICAgIHRoaXMuYnVja2V0R2VuTW9kZSA9PT0gQnVja2V0R2VuTW9kZS5MaW5lYXJBcnJheUJhc2VkICYmXG4gICAgICB0aGlzLmN1cnJlbnRMaW5lYXJUYXJnZXRJbmRleCA+PSB0aGlzLmJ1Y2tldHNbdGhpcy5jdXJyZW50TGluZWFyQnVja2V0SW5kZXhdLml0ZW1zLmxlbmd0aFxuICAgICk7XG4gIH07XG5cbiAgcHJpdmF0ZSBzZWxlY3RUYXJnZXRJdGVtID0gKCk6IGFueSA9PiB7XG4gICAgbGV0IHRhcmdldEl0ZW07XG5cbiAgICBpZiAodGhpcy5idWNrZXRHZW5Nb2RlID09PSBCdWNrZXRHZW5Nb2RlLlJhbmRvbUJTVCkge1xuICAgICAgdGFyZ2V0SXRlbSA9IHRoaXMuc2VsZWN0UmFuZG9tVW51c2VkSXRlbSgpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5idWNrZXRHZW5Nb2RlID09PSBCdWNrZXRHZW5Nb2RlLkxpbmVhckFycmF5QmFzZWQpIHtcbiAgICAgIHRhcmdldEl0ZW0gPSB0aGlzLmJ1Y2tldHNbdGhpcy5jdXJyZW50TGluZWFyQnVja2V0SW5kZXhdLml0ZW1zW3RoaXMuY3VycmVudExpbmVhclRhcmdldEluZGV4XTtcbiAgICAgIHRoaXMuY3VycmVudEJ1Y2tldC51c2VkSXRlbXMucHVzaCh0YXJnZXRJdGVtKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGFyZ2V0SXRlbTtcbiAgfTtcblxuICBwcml2YXRlIHNlbGVjdFJhbmRvbVVudXNlZEl0ZW0gPSAoKTogYW55ID0+IHtcbiAgICBsZXQgaXRlbTtcbiAgICBkbyB7XG4gICAgICBpdGVtID0gcmFuZEZyb20odGhpcy5jdXJyZW50QnVja2V0Lml0ZW1zKTtcbiAgICB9IHdoaWxlICh0aGlzLmN1cnJlbnRCdWNrZXQudXNlZEl0ZW1zLmluY2x1ZGVzKGl0ZW0pKTtcblxuICAgIHRoaXMuY3VycmVudEJ1Y2tldC51c2VkSXRlbXMucHVzaChpdGVtKTtcbiAgICByZXR1cm4gaXRlbTtcbiAgfTtcblxuICBwcml2YXRlIGdlbmVyYXRlRm9pbHMgPSAodGFyZ2V0SXRlbTogYW55KTogYW55W10gPT4ge1xuICAgIGxldCBmb2lsMSwgZm9pbDIsIGZvaWwzO1xuXG4gICAgaWYgKHRoaXMuYnVja2V0R2VuTW9kZSA9PT0gQnVja2V0R2VuTW9kZS5SYW5kb21CU1QpIHtcbiAgICAgIGZvaWwxID0gdGhpcy5nZW5lcmF0ZVJhbmRvbUZvaWwodGFyZ2V0SXRlbSk7XG4gICAgICBmb2lsMiA9IHRoaXMuZ2VuZXJhdGVSYW5kb21Gb2lsKHRhcmdldEl0ZW0sIGZvaWwxKTtcbiAgICAgIGZvaWwzID0gdGhpcy5nZW5lcmF0ZVJhbmRvbUZvaWwodGFyZ2V0SXRlbSwgZm9pbDEsIGZvaWwyKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuYnVja2V0R2VuTW9kZSA9PT0gQnVja2V0R2VuTW9kZS5MaW5lYXJBcnJheUJhc2VkKSB7XG4gICAgICBmb2lsMSA9IHRoaXMuZ2VuZXJhdGVMaW5lYXJGb2lsKHRhcmdldEl0ZW0pO1xuICAgICAgZm9pbDIgPSB0aGlzLmdlbmVyYXRlTGluZWFyRm9pbCh0YXJnZXRJdGVtLCBmb2lsMSk7XG4gICAgICBmb2lsMyA9IHRoaXMuZ2VuZXJhdGVMaW5lYXJGb2lsKHRhcmdldEl0ZW0sIGZvaWwxLCBmb2lsMik7XG4gICAgfVxuXG4gICAgcmV0dXJuIFtmb2lsMSwgZm9pbDIsIGZvaWwzXTtcbiAgfTtcblxuICBwcml2YXRlIGdlbmVyYXRlUmFuZG9tRm9pbCA9ICh0YXJnZXRJdGVtOiBhbnksIC4uLmV4aXN0aW5nRm9pbHM6IGFueVtdKTogYW55ID0+IHtcbiAgICBsZXQgZm9pbDtcbiAgICBkbyB7XG4gICAgICBmb2lsID0gcmFuZEZyb20odGhpcy5jdXJyZW50QnVja2V0Lml0ZW1zKTtcbiAgICB9IHdoaWxlIChbdGFyZ2V0SXRlbSwgLi4uZXhpc3RpbmdGb2lsc10uaW5jbHVkZXMoZm9pbCkpO1xuICAgIHJldHVybiBmb2lsO1xuICB9O1xuXG4gIHByaXZhdGUgZ2VuZXJhdGVMaW5lYXJGb2lsID0gKHRhcmdldEl0ZW06IGFueSwgLi4uZXhpc3RpbmdGb2lsczogYW55W10pOiBhbnkgPT4ge1xuICAgIGxldCBmb2lsO1xuICAgIGRvIHtcbiAgICAgIGZvaWwgPSByYW5kRnJvbSh0aGlzLmJ1Y2tldHNbdGhpcy5jdXJyZW50TGluZWFyQnVja2V0SW5kZXhdLml0ZW1zKTtcbiAgICB9IHdoaWxlIChbdGFyZ2V0SXRlbSwgLi4uZXhpc3RpbmdGb2lsc10uaW5jbHVkZXMoZm9pbCkpO1xuICAgIHJldHVybiBmb2lsO1xuICB9O1xuXG4gIHByaXZhdGUgc2h1ZmZsZUFuc3dlck9wdGlvbnMgPSAob3B0aW9uczogYW55W10pOiBhbnlbXSA9PiB7XG4gICAgc2h1ZmZsZUFycmF5KG9wdGlvbnMpO1xuICAgIHJldHVybiBvcHRpb25zO1xuICB9O1xuXG4gIHByaXZhdGUgY3JlYXRlUXVlc3Rpb24gPSAodGFyZ2V0SXRlbTogYW55LCBhbnN3ZXJPcHRpb25zOiBhbnlbXSk6IGFueSA9PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHFOYW1lOiBgcXVlc3Rpb24tJHt0aGlzLnF1ZXN0aW9uTnVtYmVyfS0ke3RhcmdldEl0ZW0uaXRlbU5hbWV9YCxcbiAgICAgIHFOdW1iZXI6IHRoaXMucXVlc3Rpb25OdW1iZXIsXG4gICAgICBxVGFyZ2V0OiB0YXJnZXRJdGVtLml0ZW1OYW1lLFxuICAgICAgcHJvbXB0VGV4dDogJycsXG4gICAgICBidWNrZXQ6IHRoaXMuY3VycmVudEJ1Y2tldC5idWNrZXRJRCxcbiAgICAgIHByb21wdEF1ZGlvOiB0YXJnZXRJdGVtLml0ZW1OYW1lLFxuICAgICAgY29ycmVjdDogdGFyZ2V0SXRlbS5pdGVtVGV4dCxcbiAgICAgIGFuc3dlcnM6IGFuc3dlck9wdGlvbnMubWFwKChvcHRpb24pID0+ICh7XG4gICAgICAgIGFuc3dlck5hbWU6IG9wdGlvbi5pdGVtTmFtZSxcbiAgICAgICAgYW5zd2VyVGV4dDogb3B0aW9uLml0ZW1UZXh0LFxuICAgICAgfSkpLFxuICAgIH07XG4gIH07XG5cbiAgcHVibGljIHRyeU1vdmVCdWNrZXQgPSAocGFzc2VkOiBib29sZWFuKSA9PiB7XG4gICAgaWYgKHRoaXMuYnVja2V0R2VuTW9kZSA9PT0gQnVja2V0R2VuTW9kZS5SYW5kb21CU1QpIHtcbiAgICAgIHRoaXMudHJ5TW92ZUJ1Y2tldFJhbmRvbUJTVChwYXNzZWQpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5idWNrZXRHZW5Nb2RlID09PSBCdWNrZXRHZW5Nb2RlLkxpbmVhckFycmF5QmFzZWQpIHtcbiAgICAgIHRoaXMudHJ5TW92ZUJ1Y2tldExpbmVhckFycmF5QmFzZWQocGFzc2VkKTtcbiAgICB9XG4gIH07XG5cbiAgcHVibGljIHRyeU1vdmVCdWNrZXRSYW5kb21CU1QgPSAocGFzc2VkOiBib29sZWFuKSA9PiB7XG4gICAgY29uc3QgbmV3QnVja2V0ID0gdGhpcy5jdXJyZW50Tm9kZS52YWx1ZSBhcyBidWNrZXQ7XG4gICAgaWYgKHRoaXMuY3VycmVudEJ1Y2tldCAhPSBudWxsKSB7XG4gICAgICB0aGlzLmN1cnJlbnRCdWNrZXQucGFzc2VkID0gcGFzc2VkO1xuICAgICAgQW5hbHl0aWNzRXZlbnRzLnNlbmRCdWNrZXQodGhpcy5jdXJyZW50QnVja2V0LCBwYXNzZWQpO1xuICAgIH1cbiAgICBjb25zb2xlLmxvZygnbmV3ICBidWNrZXQgaXMgJyArIG5ld0J1Y2tldC5idWNrZXRJRCk7XG4gICAgQXVkaW9Db250cm9sbGVyLlByZWxvYWRCdWNrZXQobmV3QnVja2V0LCB0aGlzLmFwcC5HZXREYXRhVVJMKCkpO1xuICAgIHRoaXMuaW5pdEJ1Y2tldChuZXdCdWNrZXQpO1xuICB9O1xuXG4gIHB1YmxpYyB0cnlNb3ZlQnVja2V0TGluZWFyQXJyYXlCYXNlZCA9IChwYXNzZWQ6IGJvb2xlYW4pID0+IHtcbiAgICBjb25zdCBuZXdCdWNrZXQgPSB0aGlzLmJ1Y2tldHNbdGhpcy5jdXJyZW50TGluZWFyQnVja2V0SW5kZXhdO1xuICAgIC8vIEF2b2lkIHBhc3NpbmcgYnVja2V0UGFzc2VkIGV2ZW50IHRvIHRoZSBhbmFseXRpY3Mgd2hlbiB3ZSBhcmUgaW4gbGluZWFyIGRldiBtb2RlXG4gICAgLy8gaWYgKHRoaXMuY3VycmVudEJ1Y2tldCAhPSBudWxsKSB7XG4gICAgLy8gXHR0aGlzLmN1cnJlbnRCdWNrZXQucGFzc2VkID0gcGFzc2VkO1xuICAgIC8vIFx0QW5hbHl0aWNzRXZlbnRzLnNlbmRCdWNrZXQodGhpcy5jdXJyZW50QnVja2V0LCBwYXNzZWQpO1xuICAgIC8vIH1cbiAgICBjb25zb2xlLmxvZygnTmV3IEJ1Y2tldDogJyArIG5ld0J1Y2tldC5idWNrZXRJRCk7XG4gICAgQXVkaW9Db250cm9sbGVyLlByZWxvYWRCdWNrZXQobmV3QnVja2V0LCB0aGlzLmFwcC5HZXREYXRhVVJMKCkpO1xuICAgIHRoaXMuaW5pdEJ1Y2tldChuZXdCdWNrZXQpO1xuICB9O1xuXG4gIHB1YmxpYyBIYXNRdWVzdGlvbnNMZWZ0ID0gKCkgPT4ge1xuICAgIGlmICh0aGlzLmN1cnJlbnRCdWNrZXQucGFzc2VkKSByZXR1cm4gZmFsc2U7XG5cbiAgICBpZiAodGhpcy5idWNrZXRHZW5Nb2RlID09PSBCdWNrZXRHZW5Nb2RlLkxpbmVhckFycmF5QmFzZWQpIHtcbiAgICAgIHJldHVybiB0aGlzLmhhc0xpbmVhclF1ZXN0aW9uc0xlZnQoKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5jdXJyZW50QnVja2V0Lm51bUNvcnJlY3QgPj0gNCkge1xuICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlUGFzc2VkQnVja2V0KCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmN1cnJlbnRCdWNrZXQubnVtQ29uc2VjdXRpdmVXcm9uZyA+PSAyIHx8IHRoaXMuY3VycmVudEJ1Y2tldC5udW1UcmllZCA+PSA1KSB7XG4gICAgICByZXR1cm4gdGhpcy5oYW5kbGVGYWlsZWRCdWNrZXQoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuICBwcml2YXRlIGhhc0xpbmVhclF1ZXN0aW9uc0xlZnQgPSAoKTogYm9vbGVhbiA9PiB7XG4gICAgaWYgKFxuICAgICAgdGhpcy5jdXJyZW50TGluZWFyQnVja2V0SW5kZXggPj0gdGhpcy5idWNrZXRzLmxlbmd0aCAmJlxuICAgICAgdGhpcy5jdXJyZW50TGluZWFyVGFyZ2V0SW5kZXggPj0gdGhpcy5idWNrZXRzW3RoaXMuY3VycmVudExpbmVhckJ1Y2tldEluZGV4XS5pdGVtcy5sZW5ndGhcbiAgICApIHtcbiAgICAgIC8vIE5vIG1vcmUgcXVlc3Rpb25zIGxlZnRcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9O1xuXG4gIHByaXZhdGUgaGFuZGxlUGFzc2VkQnVja2V0ID0gKCk6IGJvb2xlYW4gPT4ge1xuICAgIGNvbnNvbGUubG9nKCdQYXNzZWQgdGhpcyBidWNrZXQgJyArIHRoaXMuY3VycmVudEJ1Y2tldC5idWNrZXRJRCk7XG5cbiAgICBpZiAodGhpcy5jdXJyZW50QnVja2V0LmJ1Y2tldElEID49IHRoaXMubnVtQnVja2V0cykge1xuICAgICAgLy8gUGFzc2VkIHRoZSBoaWdoZXN0IGJ1Y2tldFxuICAgICAgcmV0dXJuIHRoaXMucGFzc0hpZ2hlc3RCdWNrZXQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMubW92ZVVwVG9OZXh0QnVja2V0KCk7XG4gICAgfVxuICB9O1xuXG4gIHByaXZhdGUgaGFuZGxlRmFpbGVkQnVja2V0ID0gKCk6IGJvb2xlYW4gPT4ge1xuICAgIGNvbnNvbGUubG9nKCdGYWlsZWQgdGhpcyBidWNrZXQgJyArIHRoaXMuY3VycmVudEJ1Y2tldC5idWNrZXRJRCk7XG5cbiAgICBpZiAodGhpcy5jdXJyZW50QnVja2V0LmJ1Y2tldElEIDwgdGhpcy5iYXNhbEJ1Y2tldCkge1xuICAgICAgdGhpcy5iYXNhbEJ1Y2tldCA9IHRoaXMuY3VycmVudEJ1Y2tldC5idWNrZXRJRDtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5jdXJyZW50QnVja2V0LmJ1Y2tldElEIDw9IDEpIHtcbiAgICAgIC8vIEZhaWxlZCB0aGUgbG93ZXN0IGJ1Y2tldFxuICAgICAgcmV0dXJuIHRoaXMuZmFpbExvd2VzdEJ1Y2tldCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5tb3ZlRG93blRvUHJldmlvdXNCdWNrZXQoKTtcbiAgICB9XG4gIH07XG5cbiAgcHJpdmF0ZSBwYXNzSGlnaGVzdEJ1Y2tldCA9ICgpOiBib29sZWFuID0+IHtcbiAgICBjb25zb2xlLmxvZygnUGFzc2VkIGhpZ2hlc3QgYnVja2V0Jyk7XG4gICAgdGhpcy5jdXJyZW50QnVja2V0LnBhc3NlZCA9IHRydWU7XG5cbiAgICBpZiAodGhpcy5idWNrZXRHZW5Nb2RlID09PSBCdWNrZXRHZW5Nb2RlLlJhbmRvbUJTVCkge1xuICAgICAgQW5hbHl0aWNzRXZlbnRzLnNlbmRCdWNrZXQodGhpcy5jdXJyZW50QnVja2V0LCB0cnVlKTtcbiAgICB9XG5cbiAgICBVSUNvbnRyb2xsZXIuUHJvZ3Jlc3NDaGVzdCgpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICBwcml2YXRlIG1vdmVVcFRvTmV4dEJ1Y2tldCA9ICgpOiBib29sZWFuID0+IHtcbiAgICBpZiAodGhpcy5jdXJyZW50Tm9kZS5yaWdodCAhPSBudWxsKSB7XG4gICAgICAvLyBNb3ZlIGRvd24gdG8gdGhlIHJpZ2h0XG4gICAgICBjb25zb2xlLmxvZygnTW92aW5nIHRvIHJpZ2h0IG5vZGUnKTtcbiAgICAgIGlmICh0aGlzLmJ1Y2tldEdlbk1vZGUgPT09IEJ1Y2tldEdlbk1vZGUuUmFuZG9tQlNUKSB7XG4gICAgICAgIHRoaXMuY3VycmVudE5vZGUgPSB0aGlzLmN1cnJlbnROb2RlLnJpZ2h0O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5jdXJyZW50TGluZWFyQnVja2V0SW5kZXgrKztcbiAgICAgIH1cbiAgICAgIHRoaXMudHJ5TW92ZUJ1Y2tldCh0cnVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gUmVhY2hlZCByb290IG5vZGVcbiAgICAgIGNvbnNvbGUubG9nKCdSZWFjaGVkIHJvb3Qgbm9kZScpO1xuICAgICAgdGhpcy5jdXJyZW50QnVja2V0LnBhc3NlZCA9IHRydWU7XG5cbiAgICAgIGlmICh0aGlzLmJ1Y2tldEdlbk1vZGUgPT09IEJ1Y2tldEdlbk1vZGUuUmFuZG9tQlNUKSB7XG4gICAgICAgIEFuYWx5dGljc0V2ZW50cy5zZW5kQnVja2V0KHRoaXMuY3VycmVudEJ1Y2tldCwgdHJ1ZSk7XG4gICAgICB9XG5cbiAgICAgIFVJQ29udHJvbGxlci5Qcm9ncmVzc0NoZXN0KCk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgcHJpdmF0ZSBmYWlsTG93ZXN0QnVja2V0ID0gKCk6IGJvb2xlYW4gPT4ge1xuICAgIGNvbnNvbGUubG9nKCdGYWlsZWQgbG93ZXN0IGJ1Y2tldCAhJyk7XG4gICAgdGhpcy5jdXJyZW50QnVja2V0LnBhc3NlZCA9IGZhbHNlO1xuXG4gICAgaWYgKHRoaXMuYnVja2V0R2VuTW9kZSA9PT0gQnVja2V0R2VuTW9kZS5SYW5kb21CU1QpIHtcbiAgICAgIEFuYWx5dGljc0V2ZW50cy5zZW5kQnVja2V0KHRoaXMuY3VycmVudEJ1Y2tldCwgZmFsc2UpO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICBwcml2YXRlIG1vdmVEb3duVG9QcmV2aW91c0J1Y2tldCA9ICgpOiBib29sZWFuID0+IHtcbiAgICBjb25zb2xlLmxvZygnTW92aW5nIGRvd24gYnVja2V0ICEnKTtcblxuICAgIGlmICh0aGlzLmN1cnJlbnROb2RlLmxlZnQgIT0gbnVsbCkge1xuICAgICAgLy8gTW92ZSBkb3duIHRvIHRoZSBsZWZ0XG4gICAgICBjb25zb2xlLmxvZygnTW92aW5nIHRvIGxlZnQgbm9kZScpO1xuICAgICAgaWYgKHRoaXMuYnVja2V0R2VuTW9kZSA9PT0gQnVja2V0R2VuTW9kZS5SYW5kb21CU1QpIHtcbiAgICAgICAgdGhpcy5jdXJyZW50Tm9kZSA9IHRoaXMuY3VycmVudE5vZGUubGVmdDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuY3VycmVudExpbmVhckJ1Y2tldEluZGV4Kys7XG4gICAgICB9XG4gICAgICB0aGlzLnRyeU1vdmVCdWNrZXQoZmFsc2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBSZWFjaGVkIHJvb3Qgbm9kZVxuICAgICAgY29uc29sZS5sb2coJ1JlYWNoZWQgcm9vdCBub2RlICEnKTtcbiAgICAgIHRoaXMuY3VycmVudEJ1Y2tldC5wYXNzZWQgPSBmYWxzZTtcblxuICAgICAgaWYgKHRoaXMuYnVja2V0R2VuTW9kZSA9PT0gQnVja2V0R2VuTW9kZS5SYW5kb21CU1QpIHtcbiAgICAgICAgQW5hbHl0aWNzRXZlbnRzLnNlbmRCdWNrZXQodGhpcy5jdXJyZW50QnVja2V0LCBmYWxzZSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuICBwdWJsaWMgb3ZlcnJpZGUgb25FbmQoKTogdm9pZCB7XG4gICAgQW5hbHl0aWNzRXZlbnRzLnNlbmRGaW5pc2hlZCh0aGlzLmJ1Y2tldHMsIHRoaXMuYmFzYWxCdWNrZXQsIHRoaXMuY2VpbGluZ0J1Y2tldCk7XG4gICAgVUlDb250cm9sbGVyLlNob3dFbmQoKTtcbiAgICB0aGlzLmFwcC51bml0eUJyaWRnZS5TZW5kQ2xvc2UoKTtcbiAgfVxufVxuIiwiLyoqXG4gKiBNb2R1bGUgdGhhdCB3cmFwcyBVbml0eSBjYWxscyBmb3Igc2VuZGluZyBtZXNzYWdlcyBmcm9tIHRoZSB3ZWJ2aWV3IHRvIFVuaXR5LlxuICovXG5cbmRlY2xhcmUgY29uc3QgVW5pdHk7XG5cbmV4cG9ydCBjbGFzcyBVbml0eUJyaWRnZSB7XG4gIHByaXZhdGUgdW5pdHlSZWZlcmVuY2U7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgaWYgKHR5cGVvZiBVbml0eSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHRoaXMudW5pdHlSZWZlcmVuY2UgPSBVbml0eTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy51bml0eVJlZmVyZW5jZSA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIFNlbmRNZXNzYWdlKG1lc3NhZ2U6IHN0cmluZykge1xuICAgIGlmICh0aGlzLnVuaXR5UmVmZXJlbmNlICE9PSBudWxsKSB7XG4gICAgICB0aGlzLnVuaXR5UmVmZXJlbmNlLmNhbGwobWVzc2FnZSk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIFNlbmRMb2FkZWQoKSB7XG4gICAgaWYgKHRoaXMudW5pdHlSZWZlcmVuY2UgIT09IG51bGwpIHtcbiAgICAgIHRoaXMudW5pdHlSZWZlcmVuY2UuY2FsbCgnbG9hZGVkJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKCd3b3VsZCBjYWxsIFVuaXR5IGxvYWRlZCBub3cnKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgU2VuZENsb3NlKCkge1xuICAgIGlmICh0aGlzLnVuaXR5UmVmZXJlbmNlICE9PSBudWxsKSB7XG4gICAgICB0aGlzLnVuaXR5UmVmZXJlbmNlLmNhbGwoJ2Nsb3NlJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKCd3b3VsZCBjbG9zZSBVbml0eSBub3cnKTtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCB7IHJlZ2lzdGVyVmVyc2lvbiB9IGZyb20gJ0BmaXJlYmFzZS9hcHAnO1xuZXhwb3J0ICogZnJvbSAnQGZpcmViYXNlL2FwcCc7XG5cbnZhciBuYW1lID0gXCJmaXJlYmFzZVwiO1xudmFyIHZlcnNpb24gPSBcIjkuMTIuMVwiO1xuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5yZWdpc3RlclZlcnNpb24obmFtZSwgdmVyc2lvbiwgJ2FwcCcpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguZXNtLmpzLm1hcFxuIiwidHJ5e3NlbGZbXCJ3b3JrYm94OndpbmRvdzo3LjAuMFwiXSYmXygpfWNhdGNoKG4pe31mdW5jdGlvbiBuKG4sdCl7cmV0dXJuIG5ldyBQcm9taXNlKChmdW5jdGlvbihyKXt2YXIgZT1uZXcgTWVzc2FnZUNoYW5uZWw7ZS5wb3J0MS5vbm1lc3NhZ2U9ZnVuY3Rpb24obil7cihuLmRhdGEpfSxuLnBvc3RNZXNzYWdlKHQsW2UucG9ydDJdKX0pKX1mdW5jdGlvbiB0KG4sdCl7Zm9yKHZhciByPTA7cjx0Lmxlbmd0aDtyKyspe3ZhciBlPXRbcl07ZS5lbnVtZXJhYmxlPWUuZW51bWVyYWJsZXx8ITEsZS5jb25maWd1cmFibGU9ITAsXCJ2YWx1ZVwiaW4gZSYmKGUud3JpdGFibGU9ITApLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLGUua2V5LGUpfX1mdW5jdGlvbiByKG4sdCl7KG51bGw9PXR8fHQ+bi5sZW5ndGgpJiYodD1uLmxlbmd0aCk7Zm9yKHZhciByPTAsZT1uZXcgQXJyYXkodCk7cjx0O3IrKyllW3JdPW5bcl07cmV0dXJuIGV9ZnVuY3Rpb24gZShuLHQpe3ZhciBlO2lmKFwidW5kZWZpbmVkXCI9PXR5cGVvZiBTeW1ib2x8fG51bGw9PW5bU3ltYm9sLml0ZXJhdG9yXSl7aWYoQXJyYXkuaXNBcnJheShuKXx8KGU9ZnVuY3Rpb24obix0KXtpZihuKXtpZihcInN0cmluZ1wiPT10eXBlb2YgbilyZXR1cm4gcihuLHQpO3ZhciBlPU9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChuKS5zbGljZSg4LC0xKTtyZXR1cm5cIk9iamVjdFwiPT09ZSYmbi5jb25zdHJ1Y3RvciYmKGU9bi5jb25zdHJ1Y3Rvci5uYW1lKSxcIk1hcFwiPT09ZXx8XCJTZXRcIj09PWU/QXJyYXkuZnJvbShuKTpcIkFyZ3VtZW50c1wiPT09ZXx8L14oPzpVaXxJKW50KD86OHwxNnwzMikoPzpDbGFtcGVkKT9BcnJheSQvLnRlc3QoZSk/cihuLHQpOnZvaWQgMH19KG4pKXx8dCYmbiYmXCJudW1iZXJcIj09dHlwZW9mIG4ubGVuZ3RoKXtlJiYobj1lKTt2YXIgaT0wO3JldHVybiBmdW5jdGlvbigpe3JldHVybiBpPj1uLmxlbmd0aD97ZG9uZTohMH06e2RvbmU6ITEsdmFsdWU6bltpKytdfX19dGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgYXR0ZW1wdCB0byBpdGVyYXRlIG5vbi1pdGVyYWJsZSBpbnN0YW5jZS5cXG5JbiBvcmRlciB0byBiZSBpdGVyYWJsZSwgbm9uLWFycmF5IG9iamVjdHMgbXVzdCBoYXZlIGEgW1N5bWJvbC5pdGVyYXRvcl0oKSBtZXRob2QuXCIpfXJldHVybihlPW5bU3ltYm9sLml0ZXJhdG9yXSgpKS5uZXh0LmJpbmQoZSl9dHJ5e3NlbGZbXCJ3b3JrYm94OmNvcmU6Ny4wLjBcIl0mJl8oKX1jYXRjaChuKXt9dmFyIGk9ZnVuY3Rpb24oKXt2YXIgbj10aGlzO3RoaXMucHJvbWlzZT1uZXcgUHJvbWlzZSgoZnVuY3Rpb24odCxyKXtuLnJlc29sdmU9dCxuLnJlamVjdD1yfSkpfTtmdW5jdGlvbiBvKG4sdCl7dmFyIHI9bG9jYXRpb24uaHJlZjtyZXR1cm4gbmV3IFVSTChuLHIpLmhyZWY9PT1uZXcgVVJMKHQscikuaHJlZn12YXIgdT1mdW5jdGlvbihuLHQpe3RoaXMudHlwZT1uLE9iamVjdC5hc3NpZ24odGhpcyx0KX07ZnVuY3Rpb24gYShuLHQscil7cmV0dXJuIHI/dD90KG4pOm46KG4mJm4udGhlbnx8KG49UHJvbWlzZS5yZXNvbHZlKG4pKSx0P24udGhlbih0KTpuKX1mdW5jdGlvbiBjKCl7fXZhciBmPXt0eXBlOlwiU0tJUF9XQUlUSU5HXCJ9O2Z1bmN0aW9uIHMobix0KXtpZighdClyZXR1cm4gbiYmbi50aGVuP24udGhlbihjKTpQcm9taXNlLnJlc29sdmUoKX12YXIgdj1mdW5jdGlvbihyKXt2YXIgZSxjO2Z1bmN0aW9uIHYobix0KXt2YXIgZSxjO3JldHVybiB2b2lkIDA9PT10JiYodD17fSksKGU9ci5jYWxsKHRoaXMpfHx0aGlzKS5ubj17fSxlLnRuPTAsZS5ybj1uZXcgaSxlLmVuPW5ldyBpLGUub249bmV3IGksZS51bj0wLGUuYW49bmV3IFNldCxlLmNuPWZ1bmN0aW9uKCl7dmFyIG49ZS5mbix0PW4uaW5zdGFsbGluZztlLnRuPjB8fCFvKHQuc2NyaXB0VVJMLGUuc24udG9TdHJpbmcoKSl8fHBlcmZvcm1hbmNlLm5vdygpPmUudW4rNmU0PyhlLnZuPXQsbi5yZW1vdmVFdmVudExpc3RlbmVyKFwidXBkYXRlZm91bmRcIixlLmNuKSk6KGUuaG49dCxlLmFuLmFkZCh0KSxlLnJuLnJlc29sdmUodCkpLCsrZS50bix0LmFkZEV2ZW50TGlzdGVuZXIoXCJzdGF0ZWNoYW5nZVwiLGUubG4pfSxlLmxuPWZ1bmN0aW9uKG4pe3ZhciB0PWUuZm4scj1uLnRhcmdldCxpPXIuc3RhdGUsbz1yPT09ZS52bixhPXtzdzpyLGlzRXh0ZXJuYWw6byxvcmlnaW5hbEV2ZW50Om59OyFvJiZlLm1uJiYoYS5pc1VwZGF0ZT0hMCksZS5kaXNwYXRjaEV2ZW50KG5ldyB1KGksYSkpLFwiaW5zdGFsbGVkXCI9PT1pP2Uud249c2VsZi5zZXRUaW1lb3V0KChmdW5jdGlvbigpe1wiaW5zdGFsbGVkXCI9PT1pJiZ0LndhaXRpbmc9PT1yJiZlLmRpc3BhdGNoRXZlbnQobmV3IHUoXCJ3YWl0aW5nXCIsYSkpfSksMjAwKTpcImFjdGl2YXRpbmdcIj09PWkmJihjbGVhclRpbWVvdXQoZS53biksb3x8ZS5lbi5yZXNvbHZlKHIpKX0sZS5kbj1mdW5jdGlvbihuKXt2YXIgdD1lLmhuLHI9dCE9PW5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLmNvbnRyb2xsZXI7ZS5kaXNwYXRjaEV2ZW50KG5ldyB1KFwiY29udHJvbGxpbmdcIix7aXNFeHRlcm5hbDpyLG9yaWdpbmFsRXZlbnQ6bixzdzp0LGlzVXBkYXRlOmUubW59KSkscnx8ZS5vbi5yZXNvbHZlKHQpfSxlLmduPShjPWZ1bmN0aW9uKG4pe3ZhciB0PW4uZGF0YSxyPW4ucG9ydHMsaT1uLnNvdXJjZTtyZXR1cm4gYShlLmdldFNXKCksKGZ1bmN0aW9uKCl7ZS5hbi5oYXMoaSkmJmUuZGlzcGF0Y2hFdmVudChuZXcgdShcIm1lc3NhZ2VcIix7ZGF0YTp0LG9yaWdpbmFsRXZlbnQ6bixwb3J0czpyLHN3Oml9KSl9KSl9LGZ1bmN0aW9uKCl7Zm9yKHZhciBuPVtdLHQ9MDt0PGFyZ3VtZW50cy5sZW5ndGg7dCsrKW5bdF09YXJndW1lbnRzW3RdO3RyeXtyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGMuYXBwbHkodGhpcyxuKSl9Y2F0Y2gobil7cmV0dXJuIFByb21pc2UucmVqZWN0KG4pfX0pLGUuc249bixlLm5uPXQsbmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIuYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIixlLmduKSxlfWM9ciwoZT12KS5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShjLnByb3RvdHlwZSksZS5wcm90b3R5cGUuY29uc3RydWN0b3I9ZSxlLl9fcHJvdG9fXz1jO3ZhciBoLGwsbSx3PXYucHJvdG90eXBlO3JldHVybiB3LnJlZ2lzdGVyPWZ1bmN0aW9uKG4pe3ZhciB0PSh2b2lkIDA9PT1uP3t9Om4pLmltbWVkaWF0ZSxyPXZvaWQgMCE9PXQmJnQ7dHJ5e3ZhciBlPXRoaXM7cmV0dXJuIGZ1bmN0aW9uKG4sdCl7dmFyIHI9bigpO2lmKHImJnIudGhlbilyZXR1cm4gci50aGVuKHQpO3JldHVybiB0KHIpfSgoZnVuY3Rpb24oKXtpZighciYmXCJjb21wbGV0ZVwiIT09ZG9jdW1lbnQucmVhZHlTdGF0ZSlyZXR1cm4gcyhuZXcgUHJvbWlzZSgoZnVuY3Rpb24obil7cmV0dXJuIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLG4pfSkpKX0pLChmdW5jdGlvbigpe3JldHVybiBlLm1uPUJvb2xlYW4obmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIuY29udHJvbGxlciksZS55bj1lLnBuKCksYShlLmJuKCksKGZ1bmN0aW9uKG4pe2UuZm49bixlLnluJiYoZS5obj1lLnluLGUuZW4ucmVzb2x2ZShlLnluKSxlLm9uLnJlc29sdmUoZS55biksZS55bi5hZGRFdmVudExpc3RlbmVyKFwic3RhdGVjaGFuZ2VcIixlLmxuLHtvbmNlOiEwfSkpO3ZhciB0PWUuZm4ud2FpdGluZztyZXR1cm4gdCYmbyh0LnNjcmlwdFVSTCxlLnNuLnRvU3RyaW5nKCkpJiYoZS5obj10LFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKGZ1bmN0aW9uKCl7ZS5kaXNwYXRjaEV2ZW50KG5ldyB1KFwid2FpdGluZ1wiLHtzdzp0LHdhc1dhaXRpbmdCZWZvcmVSZWdpc3RlcjohMH0pKX0pKS50aGVuKChmdW5jdGlvbigpe30pKSksZS5obiYmKGUucm4ucmVzb2x2ZShlLmhuKSxlLmFuLmFkZChlLmhuKSksZS5mbi5hZGRFdmVudExpc3RlbmVyKFwidXBkYXRlZm91bmRcIixlLmNuKSxuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5hZGRFdmVudExpc3RlbmVyKFwiY29udHJvbGxlcmNoYW5nZVwiLGUuZG4pLGUuZm59KSl9KSl9Y2F0Y2gobil7cmV0dXJuIFByb21pc2UucmVqZWN0KG4pfX0sdy51cGRhdGU9ZnVuY3Rpb24oKXt0cnl7cmV0dXJuIHRoaXMuZm4/cyh0aGlzLmZuLnVwZGF0ZSgpKTp2b2lkIDB9Y2F0Y2gobil7cmV0dXJuIFByb21pc2UucmVqZWN0KG4pfX0sdy5nZXRTVz1mdW5jdGlvbigpe3JldHVybiB2b2lkIDAhPT10aGlzLmhuP1Byb21pc2UucmVzb2x2ZSh0aGlzLmhuKTp0aGlzLnJuLnByb21pc2V9LHcubWVzc2FnZVNXPWZ1bmN0aW9uKHQpe3RyeXtyZXR1cm4gYSh0aGlzLmdldFNXKCksKGZ1bmN0aW9uKHIpe3JldHVybiBuKHIsdCl9KSl9Y2F0Y2gobil7cmV0dXJuIFByb21pc2UucmVqZWN0KG4pfX0sdy5tZXNzYWdlU2tpcFdhaXRpbmc9ZnVuY3Rpb24oKXt0aGlzLmZuJiZ0aGlzLmZuLndhaXRpbmcmJm4odGhpcy5mbi53YWl0aW5nLGYpfSx3LnBuPWZ1bmN0aW9uKCl7dmFyIG49bmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIuY29udHJvbGxlcjtyZXR1cm4gbiYmbyhuLnNjcmlwdFVSTCx0aGlzLnNuLnRvU3RyaW5nKCkpP246dm9pZCAwfSx3LmJuPWZ1bmN0aW9uKCl7dHJ5e3ZhciBuPXRoaXM7cmV0dXJuIGZ1bmN0aW9uKG4sdCl7dHJ5e3ZhciByPW4oKX1jYXRjaChuKXtyZXR1cm4gdChuKX1pZihyJiZyLnRoZW4pcmV0dXJuIHIudGhlbih2b2lkIDAsdCk7cmV0dXJuIHJ9KChmdW5jdGlvbigpe3JldHVybiBhKG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLnJlZ2lzdGVyKG4uc24sbi5ubiksKGZ1bmN0aW9uKHQpe3JldHVybiBuLnVuPXBlcmZvcm1hbmNlLm5vdygpLHR9KSl9KSwoZnVuY3Rpb24obil7dGhyb3cgbn0pKX1jYXRjaChuKXtyZXR1cm4gUHJvbWlzZS5yZWplY3Qobil9fSxoPXYsKGw9W3trZXk6XCJhY3RpdmVcIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5lbi5wcm9taXNlfX0se2tleTpcImNvbnRyb2xsaW5nXCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMub24ucHJvbWlzZX19XSkmJnQoaC5wcm90b3R5cGUsbCksbSYmdChoLG0pLHZ9KGZ1bmN0aW9uKCl7ZnVuY3Rpb24gbigpe3RoaXMuUG49bmV3IE1hcH12YXIgdD1uLnByb3RvdHlwZTtyZXR1cm4gdC5hZGRFdmVudExpc3RlbmVyPWZ1bmN0aW9uKG4sdCl7dGhpcy5TbihuKS5hZGQodCl9LHQucmVtb3ZlRXZlbnRMaXN0ZW5lcj1mdW5jdGlvbihuLHQpe3RoaXMuU24obikuZGVsZXRlKHQpfSx0LmRpc3BhdGNoRXZlbnQ9ZnVuY3Rpb24obil7bi50YXJnZXQ9dGhpcztmb3IodmFyIHQscj1lKHRoaXMuU24obi50eXBlKSk7ISh0PXIoKSkuZG9uZTspeygwLHQudmFsdWUpKG4pfX0sdC5Tbj1mdW5jdGlvbihuKXtyZXR1cm4gdGhpcy5Qbi5oYXMobil8fHRoaXMuUG4uc2V0KG4sbmV3IFNldCksdGhpcy5Qbi5nZXQobil9LG59KCkpO2V4cG9ydHt2IGFzIFdvcmtib3gsdSBhcyBXb3JrYm94RXZlbnQsbiBhcyBtZXNzYWdlU1d9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9d29ya2JveC13aW5kb3cucHJvZC5lczUubWpzLm1hcFxuIiwiLyoqXG4gKiBBcHAgY2xhc3MgdGhhdCByZXByZXNlbnRzIGFuIGVudHJ5IHBvaW50IG9mIHRoZSBhcHBsaWNhdGlvbi5cbiAqL1xuXG5pbXBvcnQgeyBnZXRVVUlELCBnZXRVc2VyU291cmNlLCBnZXREYXRhRmlsZSB9IGZyb20gJy4vdXRpbHMvdXJsVXRpbHMnO1xuaW1wb3J0IHsgU3VydmV5IH0gZnJvbSAnLi9zdXJ2ZXkvc3VydmV5JztcbmltcG9ydCB7IEFzc2Vzc21lbnQgfSBmcm9tICcuL2Fzc2Vzc21lbnQvYXNzZXNzbWVudCc7XG5pbXBvcnQgeyBVbml0eUJyaWRnZSB9IGZyb20gJy4vdXRpbHMvdW5pdHlCcmlkZ2UnO1xuaW1wb3J0IHsgQW5hbHl0aWNzRXZlbnRzIH0gZnJvbSAnLi9hbmFseXRpY3MvYW5hbHl0aWNzRXZlbnRzJztcbmltcG9ydCB7IEJhc2VRdWl6IH0gZnJvbSAnLi9iYXNlUXVpeic7XG5pbXBvcnQgeyBmZXRjaEFwcERhdGEsIGdldERhdGFVUkwgfSBmcm9tICcuL3V0aWxzL2pzb25VdGlscyc7XG5pbXBvcnQgeyBpbml0aWFsaXplQXBwIH0gZnJvbSAnZmlyZWJhc2UvYXBwJztcbmltcG9ydCB7IGdldEFuYWx5dGljcywgbG9nRXZlbnQgfSBmcm9tICdmaXJlYmFzZS9hbmFseXRpY3MnO1xuaW1wb3J0IHsgV29ya2JveCB9IGZyb20gJ3dvcmtib3gtd2luZG93JztcbmltcG9ydCBDYWNoZU1vZGVsIGZyb20gJy4vY29tcG9uZW50cy9jYWNoZU1vZGVsJztcbmltcG9ydCB7IFVJQ29udHJvbGxlciB9IGZyb20gJy4vdWkvdWlDb250cm9sbGVyJztcblxuY29uc3QgYXBwVmVyc2lvbjogc3RyaW5nID0gJ3YxLjEuMyc7XG5cbi8qKlxuICogQ29udGVudCB2ZXJzaW9uIGZyb20gdGhlIGRhdGEgZmlsZSBpbiBmb3JtYXQgdjAuMVxuICogR2V0cyBzZXQgd2hlbiB0aGUgY29udGVudCBpcyBsb2FkZWRcbiAqL1xubGV0IGNvbnRlbnRWZXJzaW9uOiBzdHJpbmcgPSAnJztcblxubGV0IGxvYWRpbmdTY3JlZW4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbG9hZGluZ1NjcmVlbicpO1xuY29uc3QgcHJvZ3Jlc3NCYXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncHJvZ3Jlc3NCYXInKTtcbmNvbnN0IGJyb2FkY2FzdENoYW5uZWw6IEJyb2FkY2FzdENoYW5uZWwgPSBuZXcgQnJvYWRjYXN0Q2hhbm5lbCgnYXMtbWVzc2FnZS1jaGFubmVsJyk7XG5cbmV4cG9ydCBjbGFzcyBBcHAge1xuICAvKiogQ291bGQgYmUgJ2Fzc2Vzc21lbnQnIG9yICdzdXJ2ZXknIGJhc2VkIG9uIHRoZSBkYXRhIGZpbGUgKi9cbiAgcHVibGljIGRhdGFVUkw6IHN0cmluZztcblxuICBwdWJsaWMgdW5pdHlCcmlkZ2U7XG4gIHB1YmxpYyBhbmFseXRpY3M7XG4gIHB1YmxpYyBnYW1lOiBCYXNlUXVpejtcblxuICBjYWNoZU1vZGVsOiBDYWNoZU1vZGVsO1xuXG4gIGxhbmc6IHN0cmluZyA9ICdlbmdsaXNoJztcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnVuaXR5QnJpZGdlID0gbmV3IFVuaXR5QnJpZGdlKCk7XG5cbiAgICBjb25zb2xlLmxvZygnSW5pdGlhbGl6aW5nIGFwcC4uLicpO1xuXG4gICAgdGhpcy5kYXRhVVJMID0gZ2V0RGF0YUZpbGUoKTtcbiAgICB0aGlzLmNhY2hlTW9kZWwgPSBuZXcgQ2FjaGVNb2RlbCh0aGlzLmRhdGFVUkwsIHRoaXMuZGF0YVVSTCwgbmV3IFNldDxzdHJpbmc+KCkpO1xuXG4gICAgLy8gY29uc29sZS5sb2coXCJEYXRhIGZpbGU6IFwiICsgdGhpcy5kYXRhVVJMKTtcblxuICAgIGNvbnN0IGZpcmViYXNlQ29uZmlnID0ge1xuICAgICAgYXBpS2V5OiAnQUl6YVN5QjhjMmxCVmkyNnU3WVJMOXN4T1A5N1VhcTN5TjhoVGw0JyxcbiAgICAgIGF1dGhEb21haW46ICdmdG0tYjlkOTkuZmlyZWJhc2VhcHAuY29tJyxcbiAgICAgIGRhdGFiYXNlVVJMOiAnaHR0cHM6Ly9mdG0tYjlkOTkuZmlyZWJhc2Vpby5jb20nLFxuICAgICAgcHJvamVjdElkOiAnZnRtLWI5ZDk5JyxcbiAgICAgIHN0b3JhZ2VCdWNrZXQ6ICdmdG0tYjlkOTkuYXBwc3BvdC5jb20nLFxuICAgICAgbWVzc2FnaW5nU2VuZGVySWQ6ICc2MDI0MDIzODc5NDEnLFxuICAgICAgYXBwSWQ6ICcxOjYwMjQwMjM4Nzk0MTp3ZWI6N2IxYjExODE4NjRkMjhiNDlkZTEwYycsXG4gICAgICBtZWFzdXJlbWVudElkOiAnRy1GRjExNTlUR0NGJyxcbiAgICB9O1xuXG4gICAgY29uc3QgZmFwcCA9IGluaXRpYWxpemVBcHAoZmlyZWJhc2VDb25maWcpO1xuICAgIGNvbnN0IGZhbmFseXRpY3MgPSBnZXRBbmFseXRpY3MoZmFwcCk7XG5cbiAgICB0aGlzLmFuYWx5dGljcyA9IGZhbmFseXRpY3M7XG4gICAgbG9nRXZlbnQoZmFuYWx5dGljcywgJ25vdGlmaWNhdGlvbl9yZWNlaXZlZCcpO1xuICAgIGxvZ0V2ZW50KGZhbmFseXRpY3MsICd0ZXN0IGluaXRpYWxpemF0aW9uIGV2ZW50Jywge30pO1xuXG4gICAgY29uc29sZS5sb2coJ2ZpcmViYXNlIGluaXRpYWxpemVkJyk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgc3BpblVwKCkge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xuICAgICAgY29uc29sZS5sb2coJ1dpbmRvdyBMb2FkZWQhJyk7XG4gICAgICAoYXN5bmMgKCkgPT4ge1xuICAgICAgICBhd2FpdCBmZXRjaEFwcERhdGEodGhpcy5kYXRhVVJMKS50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ0Fzc2Vzc21lbnQvU3VydmV5ICcgKyBhcHBWZXJzaW9uICsgJyBpbml0aWFsaXppbmchJyk7XG4gICAgICAgICAgY29uc29sZS5sb2coJ0FwcCBkYXRhIGxvYWRlZCEnKTtcbiAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcblxuICAgICAgICAgIHRoaXMuY2FjaGVNb2RlbC5zZXRDb250ZW50RmlsZVBhdGgoZ2V0RGF0YVVSTCh0aGlzLmRhdGFVUkwpKTtcblxuICAgICAgICAgIC8vIFRPRE86IFdoeSBkbyB3ZSBuZWVkIHRvIHNldCB0aGUgZmVlZGJhY2sgdGV4dCBoZXJlP1xuICAgICAgICAgIFVJQ29udHJvbGxlci5TZXRGZWVkYmFja1RleHQoZGF0YVsnZmVlZGJhY2tUZXh0J10pO1xuXG4gICAgICAgICAgbGV0IGFwcFR5cGUgPSBkYXRhWydhcHBUeXBlJ107XG4gICAgICAgICAgbGV0IGFzc2Vzc21lbnRUeXBlID0gZGF0YVsnYXNzZXNzbWVudFR5cGUnXTtcblxuICAgICAgICAgIGlmIChhcHBUeXBlID09ICdzdXJ2ZXknKSB7XG4gICAgICAgICAgICB0aGlzLmdhbWUgPSBuZXcgU3VydmV5KHRoaXMuZGF0YVVSTCwgdGhpcy51bml0eUJyaWRnZSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChhcHBUeXBlID09ICdhc3Nlc3NtZW50Jykge1xuICAgICAgICAgICAgLy8gR2V0IGFuZCBhZGQgYWxsIHRoZSBhdWRpbyBhc3NldHMgdG8gdGhlIGNhY2hlIG1vZGVsXG5cbiAgICAgICAgICAgIGxldCBidWNrZXRzID0gZGF0YVsnYnVja2V0cyddO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJ1Y2tldHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBidWNrZXRzW2ldLml0ZW1zLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGF1ZGlvSXRlbVVSTDtcbiAgICAgICAgICAgICAgICAvLyBVc2UgdG8gbG93ZXIgY2FzZSBmb3IgdGhlIEx1Z2FuZGFuIGRhdGFcbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICBkYXRhWydxdWl6TmFtZSddLmluY2x1ZGVzKCdMdWdhbmRhJykgfHxcbiAgICAgICAgICAgICAgICAgIGRhdGFbJ3F1aXpOYW1lJ10udG9Mb3dlckNhc2UoKS5pbmNsdWRlcygnd2VzdCBhZnJpY2FuIGVuZ2xpc2gnKVxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgYXVkaW9JdGVtVVJMID1cbiAgICAgICAgICAgICAgICAgICAgJy9hdWRpby8nICsgdGhpcy5kYXRhVVJMICsgJy8nICsgYnVja2V0c1tpXS5pdGVtc1tqXS5pdGVtTmFtZS50b0xvd2VyQ2FzZSgpLnRyaW0oKSArICcubXAzJztcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgYXVkaW9JdGVtVVJMID0gJy9hdWRpby8nICsgdGhpcy5kYXRhVVJMICsgJy8nICsgYnVja2V0c1tpXS5pdGVtc1tqXS5pdGVtTmFtZS50cmltKCkgKyAnLm1wMyc7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5jYWNoZU1vZGVsLmFkZEl0ZW1Ub0F1ZGlvVmlzdWFsUmVzb3VyY2VzKGF1ZGlvSXRlbVVSTCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5jYWNoZU1vZGVsLmFkZEl0ZW1Ub0F1ZGlvVmlzdWFsUmVzb3VyY2VzKCcvYXVkaW8vJyArIHRoaXMuZGF0YVVSTCArICcvYW5zd2VyX2ZlZWRiYWNrLm1wMycpO1xuXG4gICAgICAgICAgICB0aGlzLmdhbWUgPSBuZXcgQXNzZXNzbWVudCh0aGlzLmRhdGFVUkwsIHRoaXMudW5pdHlCcmlkZ2UpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMuZ2FtZS51bml0eUJyaWRnZSA9IHRoaXMudW5pdHlCcmlkZ2U7XG5cbiAgICAgICAgICBBbmFseXRpY3NFdmVudHMuc2V0VXVpZChnZXRVVUlEKCksIGdldFVzZXJTb3VyY2UoKSk7XG4gICAgICAgICAgQW5hbHl0aWNzRXZlbnRzLmxpbmtBbmFseXRpY3ModGhpcy5hbmFseXRpY3MsIHRoaXMuZGF0YVVSTCk7XG4gICAgICAgICAgQW5hbHl0aWNzRXZlbnRzLnNldEFzc2Vzc21lbnRUeXBlKGFzc2Vzc21lbnRUeXBlKTtcbiAgICAgICAgICBjb250ZW50VmVyc2lvbiA9IGRhdGFbJ2NvbnRlbnRWZXJzaW9uJ107XG4gICAgICAgICAgQW5hbHl0aWNzRXZlbnRzLnNlbmRJbml0KGFwcFZlcnNpb24sIGRhdGFbJ2NvbnRlbnRWZXJzaW9uJ10pO1xuICAgICAgICAgIC8vIHRoaXMuY2FjaGVNb2RlbC5zZXRBcHBOYW1lKHRoaXMuY2FjaGVNb2RlbC5hcHBOYW1lICsgJzonICsgZGF0YVtcImNvbnRlbnRWZXJzaW9uXCJdKTtcblxuICAgICAgICAgIHRoaXMuZ2FtZS5SdW4odGhpcyk7XG4gICAgICAgIH0pO1xuICAgICAgICBsb2FkaW5nU2NyZWVuIS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICBVSUNvbnRyb2xsZXIuU2V0Q29udGVudExvYWRlZCh0cnVlKTtcbiAgICAgICAgLy8gYXdhaXQgdGhpcy5yZWdpc3RlclNlcnZpY2VXb3JrZXIodGhpcy5nYW1lLCB0aGlzLmRhdGFVUkwpO1xuICAgICAgfSkoKTtcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIHJlZ2lzdGVyU2VydmljZVdvcmtlcihnYW1lOiBCYXNlUXVpeiwgZGF0YVVSTDogc3RyaW5nID0gJycpIHtcbiAgICBjb25zb2xlLmxvZygnUmVnaXN0ZXJpbmcgc2VydmljZSB3b3JrZXIuLi4nKTtcblxuICAgIGlmICgnc2VydmljZVdvcmtlcicgaW4gbmF2aWdhdG9yKSB7XG4gICAgICBsZXQgd2IgPSBuZXcgV29ya2JveCgnLi9zdy5qcycsIHt9KTtcblxuICAgICAgd2IucmVnaXN0ZXIoKVxuICAgICAgICAudGhlbigocmVnaXN0cmF0aW9uKSA9PiB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ1NlcnZpY2Ugd29ya2VyIHJlZ2lzdGVyZWQhJyk7XG4gICAgICAgICAgdGhpcy5oYW5kbGVTZXJ2aWNlV29ya2VyUmVnaXN0YXRpb24ocmVnaXN0cmF0aW9uKTtcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnU2VydmljZSB3b3JrZXIgcmVnaXN0cmF0aW9uIGZhaWxlZDogJyArIGVycik7XG4gICAgICAgIH0pO1xuXG4gICAgICBuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgaGFuZGxlU2VydmljZVdvcmtlck1lc3NhZ2UpO1xuXG4gICAgICBhd2FpdCBuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5yZWFkeTtcblxuICAgICAgY29uc29sZS5sb2coJ0NhY2hlIE1vZGVsOiAnKTtcbiAgICAgIGNvbnNvbGUubG9nKHRoaXMuY2FjaGVNb2RlbCk7XG5cbiAgICAgIC8vIFdlIG5lZWQgdG8gY2hlY2sgaWYgdGhlcmUncyBhIG5ldyB2ZXJzaW9uIG9mIHRoZSBjb250ZW50IGZpbGUgYW5kIGluIHRoYXQgY2FzZVxuICAgICAgLy8gcmVtb3ZlIHRoZSBsb2NhbFN0b3JhZ2UgY29udGVudCBuYW1lIGFuZCB2ZXJzaW9uIHZhbHVlXG5cbiAgICAgIGNvbnNvbGUubG9nKCdDaGVja2luZyBmb3IgY29udGVudCB2ZXJzaW9uIHVwZGF0ZXMuLi4nICsgZGF0YVVSTCk7XG5cbiAgICAgIGZldGNoKHRoaXMuY2FjaGVNb2RlbC5jb250ZW50RmlsZVBhdGggKyAnP2NhY2hlLWJ1c3Q9JyArIG5ldyBEYXRlKCkuZ2V0VGltZSgpLCB7XG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgICdDYWNoZS1Db250cm9sJzogJ25vLXN0b3JlJyxcbiAgICAgICAgfSxcbiAgICAgICAgY2FjaGU6ICduby1zdG9yZScsXG4gICAgICB9KVxuICAgICAgICAudGhlbihhc3luYyAocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gZmV0Y2ggdGhlIGNvbnRlbnQgZmlsZSBmcm9tIHRoZSBzZXJ2ZXIhJyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnN0IG5ld0NvbnRlbnRGaWxlRGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgICAgICBjb25zdCBhaGVhZENvbnRlbnRWZXJzaW9uID0gbmV3Q29udGVudEZpbGVEYXRhWydjb250ZW50VmVyc2lvbiddO1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdObyBDYWNoZSBDb250ZW50IHZlcnNpb246ICcgKyBhaGVhZENvbnRlbnRWZXJzaW9uKTtcblxuICAgICAgICAgIC8vIFdlIG5lZWQgdG8gY2hlY2sgaGVyZSBmb3IgdGhlIGNvbnRlbnQgdmVyc2lvbiB1cGRhdGVzXG4gICAgICAgICAgLy8gSWYgdGhlcmUncyBhIG5ldyBjb250ZW50IHZlcnNpb24sIHdlIG5lZWQgdG8gcmVtb3ZlIHRoZSBjYWNoZWQgY29udGVudCBhbmQgcmVsb2FkXG4gICAgICAgICAgLy8gV2UgYXJlIGNvbXBhcmluZyBoZXJlIHRoZSBjb250ZW50VmVyc2lvbiB3aXRoIHRoZSBhaGVhZENvbnRlbnRWZXJzaW9uXG4gICAgICAgICAgaWYgKGFoZWFkQ29udGVudFZlcnNpb24gJiYgY29udGVudFZlcnNpb24gIT0gYWhlYWRDb250ZW50VmVyc2lvbikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0NvbnRlbnQgdmVyc2lvbiBtaXNtYXRjaCEgUmVsb2FkaW5nLi4uJyk7XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSh0aGlzLmNhY2hlTW9kZWwuYXBwTmFtZSk7XG4gICAgICAgICAgICAvLyBDbGVhciB0aGUgY2FjaGUgZm9yIHRodCBwYXJ0aWN1bGFyIGNvbnRlbnRcbiAgICAgICAgICAgIGNhY2hlcy5kZWxldGUodGhpcy5jYWNoZU1vZGVsLmFwcE5hbWUpO1xuICAgICAgICAgICAgaGFuZGxlVXBkYXRlRm91bmRNZXNzYWdlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgZmV0Y2hpbmcgdGhlIGNvbnRlbnQgZmlsZTogJyArIGVycm9yKTtcbiAgICAgICAgfSk7XG5cbiAgICAgIGlmIChsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0aGlzLmNhY2hlTW9kZWwuYXBwTmFtZSkgPT0gbnVsbCkge1xuICAgICAgICBjb25zb2xlLmxvZygnQ2FjaGluZyEnICsgdGhpcy5jYWNoZU1vZGVsLmFwcE5hbWUpO1xuICAgICAgICBsb2FkaW5nU2NyZWVuIS5zdHlsZS5kaXNwbGF5ID0gJ2ZsZXgnO1xuICAgICAgICBicm9hZGNhc3RDaGFubmVsLnBvc3RNZXNzYWdlKHtcbiAgICAgICAgICBjb21tYW5kOiAnQ2FjaGUnLFxuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGFwcERhdGE6IHRoaXMuY2FjaGVNb2RlbCxcbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHByb2dyZXNzQmFyIS5zdHlsZS53aWR0aCA9IDEwMCArICclJztcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgbG9hZGluZ1NjcmVlbiEuc3R5bGUuZGlzcGxheSA9ICdub25lJztcblxuICAgICAgICB9LCAxNTAwKTtcbiAgICAgIH1cblxuICAgICAgYnJvYWRjYXN0Q2hhbm5lbC5vbm1lc3NhZ2UgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coZXZlbnQuZGF0YS5jb21tYW5kICsgJyByZWNlaXZlZCBmcm9tIHNlcnZpY2Ugd29ya2VyIScpO1xuICAgICAgICBpZiAoZXZlbnQuZGF0YS5jb21tYW5kID09ICdBY3RpdmF0ZWQnICYmIGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMuY2FjaGVNb2RlbC5hcHBOYW1lKSA9PSBudWxsKSB7XG4gICAgICAgICAgYnJvYWRjYXN0Q2hhbm5lbC5wb3N0TWVzc2FnZSh7XG4gICAgICAgICAgICBjb21tYW5kOiAnQ2FjaGUnLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICBhcHBEYXRhOiB0aGlzLmNhY2hlTW9kZWwsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLndhcm4oJ1NlcnZpY2Ugd29ya2VycyBhcmUgbm90IHN1cHBvcnRlZCBpbiB0aGlzIGJyb3dzZXIuJyk7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlU2VydmljZVdvcmtlclJlZ2lzdGF0aW9uKHJlZ2lzdHJhdGlvbjogU2VydmljZVdvcmtlclJlZ2lzdHJhdGlvbiB8IHVuZGVmaW5lZCk6IHZvaWQge1xuICAgIHRyeSB7XG4gICAgICByZWdpc3RyYXRpb24/Lmluc3RhbGxpbmc/LnBvc3RNZXNzYWdlKHtcbiAgICAgICAgdHlwZTogJ1JlZ2lzdGFydGlvbicsXG4gICAgICAgIHZhbHVlOiB0aGlzLmxhbmcsXG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdTZXJ2aWNlIHdvcmtlciByZWdpc3RyYXRpb24gZmFpbGVkOiAnICsgZXJyKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgR2V0RGF0YVVSTCgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmRhdGFVUkw7XG4gIH1cbn1cblxuYnJvYWRjYXN0Q2hhbm5lbC5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgaGFuZGxlU2VydmljZVdvcmtlck1lc3NhZ2UpO1xuXG5mdW5jdGlvbiBoYW5kbGVTZXJ2aWNlV29ya2VyTWVzc2FnZShldmVudCk6IHZvaWQge1xuICBpZiAoZXZlbnQuZGF0YS5tc2cgPT0gJ0xvYWRpbmcnKSB7XG4gICAgbGV0IHByb2dyZXNzVmFsdWUgPSBwYXJzZUludChldmVudC5kYXRhLmRhdGEucHJvZ3Jlc3MpO1xuICAgIGhhbmRsZUxvYWRpbmdNZXNzYWdlKGV2ZW50LCBwcm9ncmVzc1ZhbHVlKTtcbiAgfVxuICBpZiAoZXZlbnQuZGF0YS5tc2cgPT0gJ1VwZGF0ZUZvdW5kJykge1xuICAgIGNvbnNvbGUubG9nKCc+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pi4sdXBkYXRlIEZvdW5kJyk7XG4gICAgaGFuZGxlVXBkYXRlRm91bmRNZXNzYWdlKCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gaGFuZGxlTG9hZGluZ01lc3NhZ2UoZXZlbnQsIHByb2dyZXNzVmFsdWUpOiB2b2lkIHtcbiAgaWYgKHByb2dyZXNzVmFsdWUgPCA0MCAmJiBwcm9ncmVzc1ZhbHVlID49IDEwKSB7XG4gICAgcHJvZ3Jlc3NCYXIhLnN0eWxlLndpZHRoID0gcHJvZ3Jlc3NWYWx1ZSArICclJztcbiAgfSBlbHNlIGlmIChwcm9ncmVzc1ZhbHVlID49IDEwMCkge1xuICAgIHByb2dyZXNzQmFyIS5zdHlsZS53aWR0aCA9IDEwMCArICclJztcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGxvYWRpbmdTY3JlZW4hLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICBVSUNvbnRyb2xsZXIuU2V0Q29udGVudExvYWRlZCh0cnVlKTtcbiAgICB9LCAxNTAwKTtcbiAgICAvLyBhZGQgYm9vayB3aXRoIGEgbmFtZSB0byBsb2NhbCBzdG9yYWdlIGFzIGNhY2hlZFxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGV2ZW50LmRhdGEuZGF0YS5ib29rTmFtZSwgJ3RydWUnKTtcbiAgICByZWFkTGFuZ3VhZ2VEYXRhRnJvbUNhY2hlQW5kTm90aWZ5QW5kcm9pZEFwcChldmVudC5kYXRhLmRhdGEuYm9va05hbWUpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHJlYWRMYW5ndWFnZURhdGFGcm9tQ2FjaGVBbmROb3RpZnlBbmRyb2lkQXBwKGJvb2tOYW1lOiBzdHJpbmcpIHtcbiAgLy9AdHMtaWdub3JlXG4gIGlmICh3aW5kb3cuQW5kcm9pZCkge1xuICAgIGxldCBpc0NvbnRlbnRDYWNoZWQ6IGJvb2xlYW4gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShib29rTmFtZSkgIT09IG51bGw7XG4gICAgLy9AdHMtaWdub3JlXG4gICAgd2luZG93LkFuZHJvaWQuY2FjaGVkU3RhdHVzKGlzQ29udGVudENhY2hlZCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gaGFuZGxlVXBkYXRlRm91bmRNZXNzYWdlKCk6IHZvaWQge1xuICBsZXQgdGV4dCA9ICdVcGRhdGUgRm91bmQuXFxuUGxlYXNlIGFjY2VwdCB0aGUgdXBkYXRlIGJ5IHByZXNzaW5nIE9rLic7XG4gIGlmIChjb25maXJtKHRleHQpID09IHRydWUpIHtcbiAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG4gIH0gZWxzZSB7XG4gICAgdGV4dCA9ICdVcGRhdGUgd2lsbCBoYXBwZW4gb24gdGhlIG5leHQgbGF1bmNoLic7XG4gIH1cbn1cblxuY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuYXBwLnNwaW5VcCgpO1xuIiwiLy8gSW50ZXJmYWNlIHRoYXQgZ2V0cyBwYXNzZWQgYXJvdW5kIHRoZSBhcHAgY29tcG9uZW50cyB0byBnYXRoZXIgYWxsIHJlcXVyaWVkIHJlc291cmNlc1xuLy8gYW5kIHRoYXQgZ2V0cyBzZW50IHRvIHRoZSBzZXJ2aWNlIHdvcmtlciBmb3IgY2FjaGluZ1xuXG5pbnRlcmZhY2UgSUNhY2hlTW9kZWwge1xuICBhcHBOYW1lOiBzdHJpbmc7XG4gIGNvbnRlbnRGaWxlUGF0aDogc3RyaW5nO1xuICBhdWRpb1Zpc3VhbFJlc291cmNlczogU2V0PHN0cmluZz47XG59XG5cbmNsYXNzIENhY2hlTW9kZWwgaW1wbGVtZW50cyBJQ2FjaGVNb2RlbCB7XG4gIGFwcE5hbWU6IHN0cmluZztcbiAgY29udGVudEZpbGVQYXRoOiBzdHJpbmc7XG4gIGF1ZGlvVmlzdWFsUmVzb3VyY2VzOiBTZXQ8c3RyaW5nPjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBhcHBOYW1lOiBzdHJpbmcsXG4gICAgY29udGVudEZpbGVQYXRoOiBzdHJpbmcsXG4gICAgYXVkaW9WaXN1YWxSZXNvdXJjZXM6IFNldDxzdHJpbmc+XG4gICkge1xuICAgIHRoaXMuYXBwTmFtZSA9IGFwcE5hbWU7XG4gICAgdGhpcy5jb250ZW50RmlsZVBhdGggPSBjb250ZW50RmlsZVBhdGg7XG4gICAgdGhpcy5hdWRpb1Zpc3VhbFJlc291cmNlcyA9IGF1ZGlvVmlzdWFsUmVzb3VyY2VzO1xuICB9XG5cbiAgcHVibGljIHNldEFwcE5hbWUoYXBwTmFtZTogc3RyaW5nKSB7XG4gICAgdGhpcy5hcHBOYW1lID0gYXBwTmFtZTtcbiAgfVxuXG4gIHB1YmxpYyBzZXRDb250ZW50RmlsZVBhdGgoY29udGVudEZpbGVQYXRoOiBzdHJpbmcpIHtcbiAgICB0aGlzLmNvbnRlbnRGaWxlUGF0aCA9IGNvbnRlbnRGaWxlUGF0aDtcbiAgfVxuXG4gIHB1YmxpYyBzZXRBdWRpb1Zpc3VhbFJlc291cmNlcyhhdWRpb1Zpc3VhbFJlc291cmNlczogU2V0PHN0cmluZz4pIHtcbiAgICB0aGlzLmF1ZGlvVmlzdWFsUmVzb3VyY2VzID0gYXVkaW9WaXN1YWxSZXNvdXJjZXM7XG4gIH1cblxuICBwdWJsaWMgYWRkSXRlbVRvQXVkaW9WaXN1YWxSZXNvdXJjZXMoaXRlbTogc3RyaW5nKSB7XG4gICAgaWYgKCF0aGlzLmF1ZGlvVmlzdWFsUmVzb3VyY2VzLmhhcyhpdGVtKSkge1xuICAgICAgdGhpcy5hdWRpb1Zpc3VhbFJlc291cmNlcy5hZGQoaXRlbSk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENhY2hlTW9kZWw7XG4iXSwibmFtZXMiOlsiX193ZWJwYWNrX3JlcXVpcmVfXyIsImdldERhdGFGaWxlIiwiZGF0YSIsImdldFBhdGhOYW1lIiwiZ2V0IiwidW5kZWZpbmVkIiwiY29uc29sZSIsImxvZyIsInF1ZXJ5U3RyaW5nIiwid2luZG93IiwibG9jYXRpb24iLCJzZWFyY2giLCJVUkxTZWFyY2hQYXJhbXMiLCJnIiwiZ2xvYmFsVGhpcyIsInRoaXMiLCJGdW5jdGlvbiIsImUiLCJnZXREYXRhVVJMIiwidXJsIiwibG9hZERhdGEiLCJmdXJsIiwiZmV0Y2giLCJ0aGVuIiwicmVzcG9uc2UiLCJqc29uIiwiQXVkaW9Db250cm9sbGVyIiwiaW1hZ2VUb0NhY2hlIiwid2F2VG9DYWNoZSIsImFsbEF1ZGlvcyIsImFsbEltYWdlcyIsImRhdGFVUkwiLCJjb3JyZWN0U291bmRQYXRoIiwiZmVlZGJhY2tBdWRpbyIsImNvcnJlY3RBdWRpbyIsImluaXQiLCJBdWRpbyIsInNyYyIsInN0YXRpYyIsInF1ZXN0aW9uc0RhdGEiLCJnZXRJbnN0YW5jZSIsImZlZWRiYWNrU291bmRQYXRoIiwicXVlc3Rpb25JbmRleCIsInB1c2giLCJxdWVzdGlvbkRhdGEiLCJhbnN3ZXJJbmRleCIsInByb21wdEF1ZGlvIiwiRmlsdGVyQW5kQWRkQXVkaW9Ub0FsbEF1ZGlvcyIsInRvTG93ZXJDYXNlIiwicHJvbXB0SW1nIiwiQWRkSW1hZ2VUb0FsbEltYWdlcyIsImFuc3dlcnMiLCJhbnN3ZXJEYXRhIiwiYW5zd2VySW1nIiwibmV3SW1hZ2VVUkwiLCJuZXdJbWFnZSIsIkltYWdlIiwibmV3QXVkaW9VUkwiLCJpbmNsdWRlcyIsInJlcGxhY2UiLCJ0cmltIiwibmV3QXVkaW8iLCJzcGxpdCIsIm5ld0J1Y2tldCIsIml0ZW1JbmRleCIsIml0ZW1zIiwiaXRlbSIsIml0ZW1OYW1lIiwiYXVkaW9OYW1lIiwiZmluaXNoZWRDYWxsYmFjayIsImF1ZGlvQW5pbSIsInNsaWNlIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJhdWRpbyIsImFkZEV2ZW50TGlzdGVuZXIiLCJwbGF5IiwiY2F0Y2giLCJlcnJvciIsIndhcm4iLCJpbWFnZU5hbWUiLCJpbnN0YW5jZSIsInJhbmRGcm9tIiwiYXJyYXkiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJsZW5ndGgiLCJzaHVmZmxlQXJyYXkiLCJpIiwiaiIsIlVJQ29udHJvbGxlciIsImxhbmRpbmdDb250YWluZXJJZCIsImdhbWVDb250YWluZXJJZCIsImVuZENvbnRhaW5lcklkIiwic3RhckNvbnRhaW5lcklkIiwiY2hlc3RDb250YWluZXJJZCIsInF1ZXN0aW9uc0NvbnRhaW5lcklkIiwiZmVlZGJhY2tDb250YWluZXJJZCIsImFuc3dlcnNDb250YWluZXJJZCIsImFuc3dlckJ1dHRvbjFJZCIsImFuc3dlckJ1dHRvbjJJZCIsImFuc3dlckJ1dHRvbjNJZCIsImFuc3dlckJ1dHRvbjRJZCIsImFuc3dlckJ1dHRvbjVJZCIsImFuc3dlckJ1dHRvbjZJZCIsInBsYXlCdXR0b25JZCIsImNoZXN0SW1nSWQiLCJuZXh0UXVlc3Rpb24iLCJjb250ZW50TG9hZGVkIiwic2hvd24iLCJzdGFycyIsInNob3duU3RhcnNDb3VudCIsInN0YXJQb3NpdGlvbnMiLCJBcnJheSIsInFBbnNOdW0iLCJidXR0b25zIiwiYnV0dG9uc0FjdGl2ZSIsImRldk1vZGVDb3JyZWN0TGFiZWxWaXNpYmlsaXR5IiwiZGV2TW9kZUJ1Y2tldENvbnRyb2xzRW5hYmxlZCIsImFuaW1hdGlvblNwZWVkTXVsdGlwbGllciIsImxhbmRpbmdDb250YWluZXIiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwiZ2FtZUNvbnRhaW5lciIsImVuZENvbnRhaW5lciIsInN0YXJDb250YWluZXIiLCJjaGVzdENvbnRhaW5lciIsInF1ZXN0aW9uc0NvbnRhaW5lciIsImZlZWRiYWNrQ29udGFpbmVyIiwiYW5zd2Vyc0NvbnRhaW5lciIsImFuc3dlckJ1dHRvbjEiLCJhbnN3ZXJCdXR0b24yIiwiYW5zd2VyQnV0dG9uMyIsImFuc3dlckJ1dHRvbjQiLCJhbnN3ZXJCdXR0b241IiwiYW5zd2VyQnV0dG9uNiIsInBsYXlCdXR0b24iLCJjaGVzdEltZyIsImluaXRpYWxpemVTdGFycyIsImluaXRFdmVudExpc3RlbmVycyIsIm5ld1N0YXIiLCJjcmVhdGVFbGVtZW50IiwiaWQiLCJjbGFzc0xpc3QiLCJhZGQiLCJhcHBlbmRDaGlsZCIsImlubmVySFRNTCIsIlNldEFuaW1hdGlvblNwZWVkTXVsdGlwbGllciIsIm11bHRpcGxpZXIiLCJTZXRDb3JyZWN0TGFiZWxWaXNpYmlsaXR5IiwidmlzaWJsZSIsIlNldEJ1Y2tldENvbnRyb2xzVmlzaWJpbGl0eSIsIngiLCJ5IiwibWluRGlzdGFuY2UiLCJkeCIsImR5Iiwic3FydCIsImFuc3dlckJ1dHRvblByZXNzIiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsInNob3dHYW1lIiwic2hvd09wdGlvbnMiLCJuZXdRIiwiYW5pbWF0aW9uRHVyYXRpb24iLCJkZWxheUJmb3JlT3B0aW9uIiwib3B0aW9uc0Rpc3BsYXllZCIsImZvckVhY2giLCJidXR0b24iLCJzdHlsZSIsInZpc2liaWxpdHkiLCJhbmltYXRpb24iLCJzZXRUaW1lb3V0IiwiY3VyQW5zd2VyIiwiaXNDb3JyZWN0IiwiYW5zd2VyTmFtZSIsImNvcnJlY3QiLCJhbnN3ZXJUZXh0IiwiY29ycmVjdExhYmVsIiwiYm94U2hhZG93IiwidG1waW1nIiwiR2V0SW1hZ2UiLCJlbmFibGVBbnN3ZXJCdXR0b24iLCJxU3RhcnQiLCJEYXRlIiwibm93IiwibnQiLCJzaG93TGFuZGluZyIsImRpc3BsYXkiLCJhbGxTdGFydCIsInN0YXJ0UHJlc3NDYWxsYmFjayIsInJlbW92ZSIsImNvbG9yIiwiUGxheUNvcnJlY3QiLCJyZUdlbmVyYXRlSXRlbXMiLCJiIiwiZXh0ZXJuYWxCdWNrZXRDb250cm9sc0dlbmVyYXRpb25IYW5kbGVyIiwiU2hvd1F1ZXN0aW9uIiwiUGxheUF1ZGlvIiwiU2hvd0F1ZGlvQW5pbWF0aW9uIiwicGxheWluZyIsInF1ZXJ5U2VsZWN0b3IiLCJuZXdRdWVzdGlvbiIsInFDb2RlIiwiYnV0dG9uSW5kZXgiLCJwcm9tcHRUZXh0Iiwic3RhclRvU2hvdyIsInBvc2l0aW9uIiwiY29udGFpbmVyV2lkdGgiLCJvZmZzZXRXaWR0aCIsImNvbnRhaW5lckhlaWdodCIsIm9mZnNldEhlaWdodCIsInJhbmRvbVgiLCJyYW5kb21ZIiwiT3ZlcmxhcHBpbmdPdGhlclN0YXJzIiwidHJhbnNmb3JtIiwidHJhbnNpdGlvbiIsInpJbmRleCIsInRvcCIsImlubmVySGVpZ2h0IiwibGVmdCIsInJvdGF0aW9uIiwiZmlsdGVyIiwiYnV0dG9uTnVtIiwiYWxsQnV0dG9uc1Zpc2libGUiLCJldmVyeSIsIlBsYXlEaW5nIiwiZFRpbWUiLCJidXR0b25QcmVzc0NhbGxiYWNrIiwiY2hlc3RJbWFnZSIsImN1cnJlbnRJbWdTcmMiLCJjdXJyZW50SW1hZ2VOdW1iZXIiLCJwYXJzZUludCIsIm5leHRJbWFnZVNyYyIsInZhbHVlIiwiY2FsbGJhY2siLCJoYW5kbGVyIiwic3RyaW5nVG9CeXRlQXJyYXkkMSIsInN0ciIsIm91dCIsInAiLCJjIiwiY2hhckNvZGVBdCIsImJhc2U2NCIsImJ5dGVUb0NoYXJNYXBfIiwiY2hhclRvQnl0ZU1hcF8iLCJieXRlVG9DaGFyTWFwV2ViU2FmZV8iLCJjaGFyVG9CeXRlTWFwV2ViU2FmZV8iLCJFTkNPREVEX1ZBTFNfQkFTRSIsIkVOQ09ERURfVkFMUyIsIkVOQ09ERURfVkFMU19XRUJTQUZFIiwiSEFTX05BVElWRV9TVVBQT1JUIiwiYXRvYiIsImVuY29kZUJ5dGVBcnJheSIsImlucHV0Iiwid2ViU2FmZSIsImlzQXJyYXkiLCJFcnJvciIsImluaXRfIiwiYnl0ZVRvQ2hhck1hcCIsIm91dHB1dCIsImJ5dGUxIiwiaGF2ZUJ5dGUyIiwiYnl0ZTIiLCJoYXZlQnl0ZTMiLCJieXRlMyIsIm91dEJ5dGUxIiwib3V0Qnl0ZTIiLCJvdXRCeXRlMyIsIm91dEJ5dGU0Iiwiam9pbiIsImVuY29kZVN0cmluZyIsImJ0b2EiLCJkZWNvZGVTdHJpbmciLCJieXRlcyIsInBvcyIsImMxIiwiU3RyaW5nIiwiZnJvbUNoYXJDb2RlIiwiYzIiLCJ1IiwiYzMiLCJieXRlQXJyYXlUb1N0cmluZyIsImRlY29kZVN0cmluZ1RvQnl0ZUFycmF5IiwiY2hhclRvQnl0ZU1hcCIsImNoYXJBdCIsImJ5dGU0IiwiYmFzZTY0dXJsRW5jb2RlV2l0aG91dFBhZGRpbmciLCJ1dGY4Qnl0ZXMiLCJiYXNlNjRFbmNvZGUiLCJpbmRleGVkREIiLCJwcmVFeGlzdCIsIkRCX0NIRUNLX05BTUUiLCJyZXF1ZXN0Iiwic2VsZiIsIm9wZW4iLCJvbnN1Y2Nlc3MiLCJyZXN1bHQiLCJjbG9zZSIsImRlbGV0ZURhdGFiYXNlIiwib251cGdyYWRlbmVlZGVkIiwib25lcnJvciIsIl9hIiwibWVzc2FnZSIsImdldERlZmF1bHRzIiwiZ2V0R2xvYmFsIiwiX19GSVJFQkFTRV9ERUZBVUxUU19fIiwicHJvY2VzcyIsImVudiIsImRlZmF1bHRzSnNvblN0cmluZyIsIkpTT04iLCJwYXJzZSIsImdldERlZmF1bHRzRnJvbUVudlZhcmlhYmxlIiwibWF0Y2giLCJjb29raWUiLCJkZWNvZGVkIiwiYmFzZTY0RGVjb2RlIiwiZ2V0RGVmYXVsdHNGcm9tQ29va2llIiwiaW5mbyIsIkRlZmVycmVkIiwiY29uc3RydWN0b3IiLCJwcm9taXNlIiwid3JhcENhbGxiYWNrIiwiRmlyZWJhc2VFcnJvciIsImNvZGUiLCJjdXN0b21EYXRhIiwic3VwZXIiLCJuYW1lIiwiT2JqZWN0Iiwic2V0UHJvdG90eXBlT2YiLCJwcm90b3R5cGUiLCJjYXB0dXJlU3RhY2tUcmFjZSIsIkVycm9yRmFjdG9yeSIsImNyZWF0ZSIsInNlcnZpY2UiLCJzZXJ2aWNlTmFtZSIsImVycm9ycyIsImZ1bGxDb2RlIiwidGVtcGxhdGUiLCJQQVRURVJOIiwiXyIsImtleSIsInJlcGxhY2VUZW1wbGF0ZSIsImZ1bGxNZXNzYWdlIiwiZGVlcEVxdWFsIiwiYSIsImFLZXlzIiwia2V5cyIsImJLZXlzIiwiayIsImFQcm9wIiwiYlByb3AiLCJpc09iamVjdCIsInRoaW5nIiwiY2FsY3VsYXRlQmFja29mZk1pbGxpcyIsImJhY2tvZmZDb3VudCIsImludGVydmFsTWlsbGlzIiwiYmFja29mZkZhY3RvciIsImN1cnJCYXNlVmFsdWUiLCJwb3ciLCJyYW5kb21XYWl0Iiwicm91bmQiLCJtaW4iLCJfZGVsZWdhdGUiLCJDb21wb25lbnQiLCJpbnN0YW5jZUZhY3RvcnkiLCJ0eXBlIiwibXVsdGlwbGVJbnN0YW5jZXMiLCJzZXJ2aWNlUHJvcHMiLCJpbnN0YW50aWF0aW9uTW9kZSIsIm9uSW5zdGFuY2VDcmVhdGVkIiwic2V0SW5zdGFudGlhdGlvbk1vZGUiLCJtb2RlIiwic2V0TXVsdGlwbGVJbnN0YW5jZXMiLCJzZXRTZXJ2aWNlUHJvcHMiLCJwcm9wcyIsInNldEluc3RhbmNlQ3JlYXRlZENhbGxiYWNrIiwiREVGQVVMVF9FTlRSWV9OQU1FIiwiUHJvdmlkZXIiLCJjb250YWluZXIiLCJjb21wb25lbnQiLCJpbnN0YW5jZXMiLCJNYXAiLCJpbnN0YW5jZXNEZWZlcnJlZCIsImluc3RhbmNlc09wdGlvbnMiLCJvbkluaXRDYWxsYmFja3MiLCJpZGVudGlmaWVyIiwibm9ybWFsaXplZElkZW50aWZpZXIiLCJub3JtYWxpemVJbnN0YW5jZUlkZW50aWZpZXIiLCJoYXMiLCJkZWZlcnJlZCIsInNldCIsImlzSW5pdGlhbGl6ZWQiLCJzaG91bGRBdXRvSW5pdGlhbGl6ZSIsImdldE9ySW5pdGlhbGl6ZVNlcnZpY2UiLCJpbnN0YW5jZUlkZW50aWZpZXIiLCJnZXRJbW1lZGlhdGUiLCJvcHRpb25zIiwib3B0aW9uYWwiLCJnZXRDb21wb25lbnQiLCJzZXRDb21wb25lbnQiLCJpc0NvbXBvbmVudEVhZ2VyIiwiaW5zdGFuY2VEZWZlcnJlZCIsImVudHJpZXMiLCJjbGVhckluc3RhbmNlIiwiZGVsZXRlIiwiYXN5bmMiLCJzZXJ2aWNlcyIsImZyb20iLCJ2YWx1ZXMiLCJhbGwiLCJtYXAiLCJJTlRFUk5BTCIsIl9kZWxldGUiLCJpc0NvbXBvbmVudFNldCIsImdldE9wdGlvbnMiLCJpbml0aWFsaXplIiwib3B0cyIsIm9uSW5pdCIsImV4aXN0aW5nQ2FsbGJhY2tzIiwiU2V0IiwiZXhpc3RpbmdJbnN0YW5jZSIsImludm9rZU9uSW5pdENhbGxiYWNrcyIsImNhbGxiYWNrcyIsIkNvbXBvbmVudENvbnRhaW5lciIsInByb3ZpZGVycyIsImFkZENvbXBvbmVudCIsInByb3ZpZGVyIiwiZ2V0UHJvdmlkZXIiLCJhZGRPck92ZXJ3cml0ZUNvbXBvbmVudCIsImdldFByb3ZpZGVycyIsIkxvZ0xldmVsIiwibGV2ZWxTdHJpbmdUb0VudW0iLCJERUJVRyIsIlZFUkJPU0UiLCJJTkZPIiwiV0FSTiIsIkVSUk9SIiwiU0lMRU5UIiwiZGVmYXVsdExvZ0xldmVsIiwiQ29uc29sZU1ldGhvZCIsImRlZmF1bHRMb2dIYW5kbGVyIiwibG9nVHlwZSIsImFyZ3MiLCJsb2dMZXZlbCIsInRvSVNPU3RyaW5nIiwibWV0aG9kIiwiTG9nZ2VyIiwiX2xvZ0xldmVsIiwiX2xvZ0hhbmRsZXIiLCJfdXNlckxvZ0hhbmRsZXIiLCJ2YWwiLCJUeXBlRXJyb3IiLCJzZXRMb2dMZXZlbCIsImxvZ0hhbmRsZXIiLCJ1c2VyTG9nSGFuZGxlciIsImRlYnVnIiwiaWRiUHJveHlhYmxlVHlwZXMiLCJjdXJzb3JBZHZhbmNlTWV0aG9kcyIsImN1cnNvclJlcXVlc3RNYXAiLCJXZWFrTWFwIiwidHJhbnNhY3Rpb25Eb25lTWFwIiwidHJhbnNhY3Rpb25TdG9yZU5hbWVzTWFwIiwidHJhbnNmb3JtQ2FjaGUiLCJyZXZlcnNlVHJhbnNmb3JtQ2FjaGUiLCJpZGJQcm94eVRyYXBzIiwidGFyZ2V0IiwicHJvcCIsInJlY2VpdmVyIiwiSURCVHJhbnNhY3Rpb24iLCJvYmplY3RTdG9yZU5hbWVzIiwib2JqZWN0U3RvcmUiLCJ0cmFuc2Zvcm1DYWNoYWJsZVZhbHVlIiwiZnVuYyIsIklEQkRhdGFiYXNlIiwidHJhbnNhY3Rpb24iLCJJREJDdXJzb3IiLCJhZHZhbmNlIiwiY29udGludWUiLCJjb250aW51ZVByaW1hcnlLZXkiLCJhcHBseSIsInVud3JhcCIsInN0b3JlTmFtZXMiLCJ0eCIsImNhbGwiLCJzb3J0IiwiZG9uZSIsInVubGlzdGVuIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImNvbXBsZXRlIiwiRE9NRXhjZXB0aW9uIiwiY2FjaGVEb25lUHJvbWlzZUZvclRyYW5zYWN0aW9uIiwib2JqZWN0IiwiSURCT2JqZWN0U3RvcmUiLCJJREJJbmRleCIsInNvbWUiLCJQcm94eSIsIklEQlJlcXVlc3QiLCJzdWNjZXNzIiwicHJvbWlzaWZ5UmVxdWVzdCIsIm5ld1ZhbHVlIiwib3BlbkRCIiwidmVyc2lvbiIsImJsb2NrZWQiLCJ1cGdyYWRlIiwiYmxvY2tpbmciLCJ0ZXJtaW5hdGVkIiwib3BlblByb21pc2UiLCJldmVudCIsIm9sZFZlcnNpb24iLCJuZXdWZXJzaW9uIiwiZGIiLCJyZWFkTWV0aG9kcyIsIndyaXRlTWV0aG9kcyIsImNhY2hlZE1ldGhvZHMiLCJnZXRNZXRob2QiLCJ0YXJnZXRGdW5jTmFtZSIsInVzZUluZGV4IiwiaXNXcml0ZSIsInN0b3JlTmFtZSIsInN0b3JlIiwiaW5kZXgiLCJzaGlmdCIsIm9sZFRyYXBzIiwiUGxhdGZvcm1Mb2dnZXJTZXJ2aWNlSW1wbCIsImdldFBsYXRmb3JtSW5mb1N0cmluZyIsImlzVmVyc2lvblNlcnZpY2VQcm92aWRlciIsImxpYnJhcnkiLCJsb2dTdHJpbmciLCJuYW1lJG8iLCJ2ZXJzaW9uJDEiLCJsb2dnZXIiLCJQTEFURk9STV9MT0dfU1RSSU5HIiwiX2FwcHMiLCJfY29tcG9uZW50cyIsIl9hZGRDb21wb25lbnQiLCJhcHAiLCJfcmVnaXN0ZXJDb21wb25lbnQiLCJjb21wb25lbnROYW1lIiwiaGVhcnRiZWF0Q29udHJvbGxlciIsInRyaWdnZXJIZWFydGJlYXQiLCJFUlJPUl9GQUNUT1JZIiwiRmlyZWJhc2VBcHBJbXBsIiwiY29uZmlnIiwiX2lzRGVsZXRlZCIsIl9vcHRpb25zIiwiYXNzaWduIiwiX2NvbmZpZyIsIl9uYW1lIiwiX2F1dG9tYXRpY0RhdGFDb2xsZWN0aW9uRW5hYmxlZCIsImF1dG9tYXRpY0RhdGFDb2xsZWN0aW9uRW5hYmxlZCIsIl9jb250YWluZXIiLCJjaGVja0Rlc3Ryb3llZCIsImlzRGVsZXRlZCIsImFwcE5hbWUiLCJpbml0aWFsaXplQXBwIiwicmF3Q29uZmlnIiwiZXhpc3RpbmdBcHAiLCJuZXdBcHAiLCJyZWdpc3RlclZlcnNpb24iLCJsaWJyYXJ5S2V5T3JOYW1lIiwidmFyaWFudCIsImxpYnJhcnlNaXNtYXRjaCIsInZlcnNpb25NaXNtYXRjaCIsIndhcm5pbmciLCJTVE9SRV9OQU1FIiwiZGJQcm9taXNlIiwiZ2V0RGJQcm9taXNlIiwiY3JlYXRlT2JqZWN0U3RvcmUiLCJvcmlnaW5hbEVycm9yTWVzc2FnZSIsIndyaXRlSGVhcnRiZWF0c1RvSW5kZXhlZERCIiwiaGVhcnRiZWF0T2JqZWN0IiwicHV0IiwiY29tcHV0ZUtleSIsImlkYkdldEVycm9yIiwiYXBwSWQiLCJIZWFydGJlYXRTZXJ2aWNlSW1wbCIsIl9oZWFydGJlYXRzQ2FjaGUiLCJfc3RvcmFnZSIsIkhlYXJ0YmVhdFN0b3JhZ2VJbXBsIiwiX2hlYXJ0YmVhdHNDYWNoZVByb21pc2UiLCJyZWFkIiwiYWdlbnQiLCJkYXRlIiwiZ2V0VVRDRGF0ZVN0cmluZyIsImxhc3RTZW50SGVhcnRiZWF0RGF0ZSIsImhlYXJ0YmVhdHMiLCJzaW5nbGVEYXRlSGVhcnRiZWF0IiwiaGJUaW1lc3RhbXAiLCJ2YWx1ZU9mIiwib3ZlcndyaXRlIiwiaGVhcnRiZWF0c1RvU2VuZCIsInVuc2VudEVudHJpZXMiLCJoZWFydGJlYXRzQ2FjaGUiLCJtYXhTaXplIiwiaGVhcnRiZWF0RW50cnkiLCJmaW5kIiwiaGIiLCJkYXRlcyIsImNvdW50Qnl0ZXMiLCJwb3AiLCJleHRyYWN0SGVhcnRiZWF0c0ZvckhlYWRlciIsImhlYWRlclN0cmluZyIsInN0cmluZ2lmeSIsInN1YnN0cmluZyIsIl9jYW5Vc2VJbmRleGVkREJQcm9taXNlIiwicnVuSW5kZXhlZERCRW52aXJvbm1lbnRDaGVjayIsImlkYkhlYXJ0YmVhdE9iamVjdCIsInJlYWRIZWFydGJlYXRzRnJvbUluZGV4ZWREQiIsImhlYXJ0YmVhdHNPYmplY3QiLCJleGlzdGluZ0hlYXJ0YmVhdHNPYmplY3QiLCJQQUNLQUdFX1ZFUlNJT04iLCJpc1NlcnZlckVycm9yIiwiZ2V0SW5zdGFsbGF0aW9uc0VuZHBvaW50IiwicHJvamVjdElkIiwiZXh0cmFjdEF1dGhUb2tlbkluZm9Gcm9tUmVzcG9uc2UiLCJ0b2tlbiIsInJlcXVlc3RTdGF0dXMiLCJleHBpcmVzSW4iLCJyZXNwb25zZUV4cGlyZXNJbiIsIk51bWJlciIsImNyZWF0aW9uVGltZSIsImdldEVycm9yRnJvbVJlc3BvbnNlIiwicmVxdWVzdE5hbWUiLCJlcnJvckRhdGEiLCJzZXJ2ZXJDb2RlIiwic2VydmVyTWVzc2FnZSIsInNlcnZlclN0YXR1cyIsInN0YXR1cyIsImdldEhlYWRlcnMiLCJhcGlLZXkiLCJIZWFkZXJzIiwiQWNjZXB0IiwicmV0cnlJZlNlcnZlckVycm9yIiwiZm4iLCJzbGVlcCIsIm1zIiwiVkFMSURfRklEX1BBVFRFUk4iLCJnZW5lcmF0ZUZpZCIsImZpZEJ5dGVBcnJheSIsIlVpbnQ4QXJyYXkiLCJjcnlwdG8iLCJtc0NyeXB0byIsImdldFJhbmRvbVZhbHVlcyIsImZpZCIsInN1YnN0ciIsImVuY29kZSIsInRlc3QiLCJnZXRLZXkiLCJhcHBDb25maWciLCJmaWRDaGFuZ2VDYWxsYmFja3MiLCJmaWRDaGFuZ2VkIiwiY2FsbEZpZENoYW5nZUNhbGxiYWNrcyIsImNoYW5uZWwiLCJicm9hZGNhc3RDaGFubmVsIiwiQnJvYWRjYXN0Q2hhbm5lbCIsIm9ubWVzc2FnZSIsInBvc3RNZXNzYWdlIiwic2l6ZSIsImJyb2FkY2FzdEZpZENoYW5nZSIsIk9CSkVDVF9TVE9SRV9OQU1FIiwib2xkVmFsdWUiLCJ1cGRhdGUiLCJ1cGRhdGVGbiIsImdldEluc3RhbGxhdGlvbkVudHJ5IiwiaW5zdGFsbGF0aW9ucyIsInJlZ2lzdHJhdGlvblByb21pc2UiLCJpbnN0YWxsYXRpb25FbnRyeSIsIm9sZEVudHJ5IiwiY2xlYXJUaW1lZE91dFJlcXVlc3QiLCJyZWdpc3RyYXRpb25TdGF0dXMiLCJ1cGRhdGVPckNyZWF0ZUluc3RhbGxhdGlvbkVudHJ5IiwiZW50cnlXaXRoUHJvbWlzZSIsIm5hdmlnYXRvciIsIm9uTGluZSIsImluUHJvZ3Jlc3NFbnRyeSIsInJlZ2lzdHJhdGlvblRpbWUiLCJyZWdpc3RlcmVkSW5zdGFsbGF0aW9uRW50cnkiLCJoZWFydGJlYXRTZXJ2aWNlUHJvdmlkZXIiLCJlbmRwb2ludCIsImhlYWRlcnMiLCJoZWFydGJlYXRTZXJ2aWNlIiwiaGVhcnRiZWF0c0hlYWRlciIsImdldEhlYXJ0YmVhdHNIZWFkZXIiLCJhcHBlbmQiLCJib2R5IiwiYXV0aFZlcnNpb24iLCJzZGtWZXJzaW9uIiwib2siLCJyZXNwb25zZVZhbHVlIiwicmVmcmVzaFRva2VuIiwiYXV0aFRva2VuIiwiY3JlYXRlSW5zdGFsbGF0aW9uUmVxdWVzdCIsInJlZ2lzdGVySW5zdGFsbGF0aW9uIiwid2FpdFVudGlsRmlkUmVnaXN0cmF0aW9uIiwidHJpZ2dlclJlZ2lzdHJhdGlvbklmTmVjZXNzYXJ5IiwiZW50cnkiLCJ1cGRhdGVJbnN0YWxsYXRpb25SZXF1ZXN0IiwiZ2VuZXJhdGVBdXRoVG9rZW5SZXF1ZXN0IiwiZ2V0R2VuZXJhdGVBdXRoVG9rZW5FbmRwb2ludCIsImdldEF1dGhvcml6YXRpb25IZWFkZXIiLCJnZXRIZWFkZXJzV2l0aEF1dGgiLCJpbnN0YWxsYXRpb24iLCJyZWZyZXNoQXV0aFRva2VuIiwiZm9yY2VSZWZyZXNoIiwidG9rZW5Qcm9taXNlIiwiaXNFbnRyeVJlZ2lzdGVyZWQiLCJvbGRBdXRoVG9rZW4iLCJpc0F1dGhUb2tlbkV4cGlyZWQiLCJ1cGRhdGVBdXRoVG9rZW5SZXF1ZXN0Iiwid2FpdFVudGlsQXV0aFRva2VuUmVxdWVzdCIsImluUHJvZ3Jlc3NBdXRoVG9rZW4iLCJyZXF1ZXN0VGltZSIsIm1ha2VBdXRoVG9rZW5SZXF1ZXN0SW5Qcm9ncmVzc0VudHJ5IiwidXBkYXRlZEluc3RhbGxhdGlvbkVudHJ5IiwiZmV0Y2hBdXRoVG9rZW5Gcm9tU2VydmVyIiwiZ2V0TWlzc2luZ1ZhbHVlRXJyb3IiLCJ2YWx1ZU5hbWUiLCJJTlNUQUxMQVRJT05TX05BTUUiLCJjb25maWdLZXlzIiwia2V5TmFtZSIsImV4dHJhY3RBcHBDb25maWciLCJnZXRJZCIsImluc3RhbGxhdGlvbnNJbXBsIiwiZ2V0VG9rZW4iLCJjb21wbGV0ZUluc3RhbGxhdGlvblJlZ2lzdHJhdGlvbiIsIkFOQUxZVElDU19UWVBFIiwiR1RBR19VUkwiLCJwcm9taXNlQWxsU2V0dGxlZCIsInByb21pc2VzIiwiZGVmYXVsdFJldHJ5RGF0YSIsInRocm90dGxlTWV0YWRhdGEiLCJnZXRUaHJvdHRsZU1ldGFkYXRhIiwic2V0VGhyb3R0bGVNZXRhZGF0YSIsIm1ldGFkYXRhIiwiZGVsZXRlVGhyb3R0bGVNZXRhZGF0YSIsImZldGNoRHluYW1pY0NvbmZpZ1dpdGhSZXRyeSIsInJldHJ5RGF0YSIsInRpbWVvdXRNaWxsaXMiLCJtZWFzdXJlbWVudElkIiwidGhyb3R0bGVFbmRUaW1lTWlsbGlzIiwic2lnbmFsIiwiQW5hbHl0aWNzQWJvcnRTaWduYWwiLCJhYm9ydCIsImF0dGVtcHRGZXRjaER5bmFtaWNDb25maWdXaXRoUmV0cnkiLCJhcHBGaWVsZHMiLCJfYiIsImJhY2tvZmZNaWxsaXMiLCJtYXgiLCJ0aW1lb3V0IiwiY2xlYXJUaW1lb3V0Iiwic2V0QWJvcnRhYmxlVGltZW91dCIsImFwcFVybCIsImVycm9yTWVzc2FnZSIsImpzb25SZXNwb25zZSIsIl9pZ25vcmVkIiwiaHR0cFN0YXR1cyIsInJlc3BvbnNlTWVzc2FnZSIsImZldGNoRHluYW1pY0NvbmZpZyIsImlzUmV0cmlhYmxlRXJyb3IiLCJsaXN0ZW5lcnMiLCJsaXN0ZW5lciIsImRlZmF1bHRFdmVudFBhcmFtZXRlcnNGb3JJbml0IiwiZGVmYXVsdENvbnNlbnRTZXR0aW5nc0ZvckluaXQiLCJfaW5pdGlhbGl6ZUFuYWx5dGljcyIsImR5bmFtaWNDb25maWdQcm9taXNlc0xpc3QiLCJtZWFzdXJlbWVudElkVG9BcHBJZCIsImd0YWdDb3JlIiwiZGF0YUxheWVyTmFtZSIsImR5bmFtaWNDb25maWdQcm9taXNlIiwiZmlkUHJvbWlzZSIsImVycm9ySW5mbyIsInRvU3RyaW5nIiwidmFsaWRhdGVJbmRleGVkREIiLCJlbnZJc1ZhbGlkIiwiZHluYW1pY0NvbmZpZyIsInNjcmlwdFRhZ3MiLCJnZXRFbGVtZW50c0J5VGFnTmFtZSIsInRhZyIsImZpbmRHdGFnU2NyaXB0T25QYWdlIiwic2NyaXB0IiwiaGVhZCIsImluc2VydFNjcmlwdFRhZyIsImNvbmZpZ1Byb3BlcnRpZXMiLCJBbmFseXRpY3NTZXJ2aWNlIiwiaW5pdGlhbGl6YXRpb25Qcm9taXNlc01hcCIsImd0YWdDb3JlRnVuY3Rpb24iLCJ3cmFwcGVkR3RhZ0Z1bmN0aW9uIiwiZ2xvYmFsSW5pdERvbmUiLCJmYWN0b3J5IiwibWlzbWF0Y2hlZEVudk1lc3NhZ2VzIiwicnVudGltZSIsImNocm9tZSIsImJyb3dzZXIiLCJjb29raWVFbmFibGVkIiwiZGV0YWlscyIsImVyciIsIndhcm5PbkJyb3dzZXJDb250ZXh0TWlzbWF0Y2giLCJkYXRhTGF5ZXIiLCJnZXRPckNyZWF0ZURhdGFMYXllciIsIndyYXBwZWRHdGFnIiwiZ3RhZ0Z1bmN0aW9uTmFtZSIsIl9hcmdzIiwiYXJndW1lbnRzIiwiY29tbWFuZCIsImlkT3JOYW1lT3JQYXJhbXMiLCJndGFnUGFyYW1zIiwiaW5pdGlhbGl6YXRpb25Qcm9taXNlc1RvV2FpdEZvciIsImdhU2VuZFRvTGlzdCIsImR5bmFtaWNDb25maWdSZXN1bHRzIiwic2VuZFRvSWQiLCJmb3VuZENvbmZpZyIsImluaXRpYWxpemF0aW9uUHJvbWlzZSIsImd0YWdPbkV2ZW50IiwiY29ycmVzcG9uZGluZ0FwcElkIiwiZ3RhZ09uQ29uZmlnIiwid3JhcEd0YWciLCJ3cmFwT3JDcmVhdGVHdGFnIiwibG9nRXZlbnQiLCJhbmFseXRpY3NJbnN0YW5jZSIsImV2ZW50TmFtZSIsImV2ZW50UGFyYW1zIiwiZ3RhZ0Z1bmN0aW9uIiwiZ2xvYmFsIiwibG9nRXZlbnQkMSIsImFuYWx5dGljc09wdGlvbnMiLCJhbmFseXRpY3MiLCJyZWFzb24iLCJBbmFseXRpY3NFdmVudHMiLCJhc3Nlc3NtZW50VHlwZSIsInN0YXR1c1RleHQiLCJsYXRsb25nIiwibG9jIiwibHBpZWNlcyIsImxhdCIsInBhcnNlRmxvYXQiLCJ0b0ZpeGVkIiwibG9uIiwiY2xhdCIsImNsb24iLCJzZW5kTG9jYXRpb24iLCJtc2ciLCJuZXdnYW5hIiwiZGF0YXVybCIsImdhbmEiLCJuZXdVdWlkIiwibmV3VXNlclNvdXJjZSIsInV1aWQiLCJ1c2VyU291cmNlIiwiYXBwVmVyc2lvbiIsImNvbnRlbnRWZXJzaW9uIiwiZ2V0TG9jYXRpb24iLCJldmVudFN0cmluZyIsImFwcFR5cGUiLCJsYW5ndWFnZSIsImxhc3RJbmRleE9mIiwidXNlciIsImxhbmciLCJnZXRBcHBMYW5ndWFnZUZyb21EYXRhVVJMIiwiZ2V0QXBwVHlwZUZyb21EYXRhVVJMIiwiam9pbkxhdExvbmciLCJjbFVzZXJJZCIsImxhdExvbmciLCJ0aGVRIiwidGhlQSIsImVsYXBzZWQiLCJhbnMiLCJpc2NvcnJlY3QiLCJidWNrZXQiLCJxTmFtZSIsImFOdW0iLCJkdCIsInF1ZXN0aW9uX251bWJlciIsInFOdW1iZXIiLCJxVGFyZ2V0IiwicXVlc3Rpb24iLCJzZWxlY3RlZF9hbnN3ZXIiLCJ0YiIsInBhc3NlZCIsImJuIiwiYnVja2V0SUQiLCJidHJpZWQiLCJudW1UcmllZCIsImJjb3JyZWN0IiwibnVtQ29ycmVjdCIsImJ1Y2tldE51bWJlciIsIm51bWJlclRyaWVkSW5CdWNrZXQiLCJudW1iZXJDb3JyZWN0SW5CdWNrZXQiLCJwYXNzZWRCdWNrZXQiLCJidWNrZXRzIiwiYmFzYWxCdWNrZXQiLCJjZWlsaW5nQnVja2V0IiwiYmFzYWxCdWNrZXRJRCIsImdldEJhc2FsQnVja2V0SUQiLCJjZWlsaW5nQnVja2V0SUQiLCJnZXRDZWlsaW5nQnVja2V0SUQiLCJzY29yZSIsImNhbGN1bGF0ZVNjb3JlIiwibWF4U2NvcmUiLCJzZW5kRGF0YVRvVGhpcmRQYXJ0eSIsInBhcmVudCIsInVybFBhcmFtcyIsInRhcmdldFBhcnR5VVJMIiwieGhyIiwiWE1MSHR0cFJlcXVlc3QiLCJwYXlsb2FkIiwicGFnZSIsInN1YlR5cGUiLCJjb21wbGV0ZWQiLCJwYXlsb2FkU3RyaW5nIiwic2V0UmVxdWVzdEhlYWRlciIsIm9ubG9hZCIsInJlc3BvbnNlVGV4dCIsInNlbmQiLCJ0ZXN0ZWQiLCJCYXNlUXVpeiIsImRldk1vZGVBdmFpbGFibGUiLCJpc0luRGV2TW9kZSIsImlzQ29ycmVjdExhYmVsU2hvd24iLCJpc0J1Y2tldEluZm9TaG93biIsImlzQnVja2V0Q29udHJvbHNFbmFibGVkIiwiZGV2TW9kZVRvZ2dsZUJ1dHRvbkNvbnRhaW5lcklkIiwiZGV2TW9kZVRvZ2dsZUJ1dHRvbklkIiwiZGV2TW9kZU1vZGFsSWQiLCJkZXZNb2RlQnVja2V0R2VuU2VsZWN0SWQiLCJkZXZNb2RlQ29ycmVjdExhYmVsU2hvd25DaGVja2JveElkIiwiZGV2TW9kZUJ1Y2tldEluZm9TaG93bkNoZWNrYm94SWQiLCJkZXZNb2RlQnVja2V0SW5mb0NvbnRhaW5lcklkIiwiZGV2TW9kZUJ1Y2tldENvbnRyb2xzU2hvd25DaGVja2JveElkIiwiZGV2TW9kZUFuaW1hdGlvblNwZWVkTXVsdGlwbGllclJhbmdlSWQiLCJkZXZNb2RlQW5pbWF0aW9uU3BlZWRNdWx0aXBsaWVyVmFsdWVJZCIsInRvZ2dsZURldk1vZGVNb2RhbCIsImRldk1vZGVTZXR0aW5nc01vZGFsIiwiaHJlZiIsImRldk1vZGVUb2dnbGVCdXR0b25Db250YWluZXIiLCJkZXZNb2RlQnVja2V0R2VuU2VsZWN0Iiwib25jaGFuZ2UiLCJoYW5kbGVCdWNrZXRHZW5Nb2RlQ2hhbmdlIiwiZGV2TW9kZVRvZ2dsZUJ1dHRvbiIsIm9uY2xpY2siLCJkZXZNb2RlQ29ycmVjdExhYmVsU2hvd25DaGVja2JveCIsImNoZWNrZWQiLCJoYW5kbGVDb3JyZWN0TGFiZWxTaG93bkNoYW5nZSIsImRldk1vZGVCdWNrZXRJbmZvU2hvd25DaGVja2JveCIsImRldk1vZGVCdWNrZXRJbmZvQ29udGFpbmVyIiwiaGFuZGxlQnVja2V0SW5mb1Nob3duQ2hhbmdlIiwiZGV2TW9kZUJ1Y2tldENvbnRyb2xzU2hvd25DaGVja2JveCIsImhhbmRsZUJ1Y2tldENvbnRyb2xzU2hvd25DaGFuZ2UiLCJkZXZNb2RlQW5pbWF0aW9uU3BlZWRNdWx0aXBsaWVyUmFuZ2UiLCJkZXZNb2RlQW5pbWF0aW9uU3BlZWRNdWx0aXBsaWVyVmFsdWUiLCJpbm5lclRleHQiLCJoYW5kbGVBbmltYXRpb25TcGVlZE11bHRpcGxpZXJDaGFuZ2UiLCJoaWRlRGV2TW9kZUJ1dHRvbiIsIm9uRW5kIiwiU2hvd0VuZCIsInVuaXR5QnJpZGdlIiwiU2VuZENsb3NlIiwiU3VydmV5Iiwic3RhcnRTdXJ2ZXkiLCJSZWFkeUZvck5leHQiLCJidWlsZE5ld1F1ZXN0aW9uIiwib25RdWVzdGlvbkVuZCIsIlNldEZlZWRiYWNrVmlzaWJpbGUiLCJjdXJyZW50UXVlc3Rpb25JbmRleCIsIkhhc1F1ZXN0aW9uc0xlZnQiLCJoYW5kbGVBbnN3ZXJCdXR0b25QcmVzcyIsImFuc3dlciIsInNlbmRBbnN3ZXJlZCIsIkFkZFN0YXIiLCJidWlsZFF1ZXN0aW9uTGlzdCIsImZldGNoU3VydmV5UXVlc3Rpb25zIiwiU2V0QnV0dG9uUHJlc3NBY3Rpb24iLCJTZXRTdGFydEFjdGlvbiIsIlJ1biIsIlByZXBhcmVBdWRpb0FuZEltYWdlc0ZvclN1cnZleSIsIkdldERhdGFVUkwiLCJTZW5kTG9hZGVkIiwiVHJlZU5vZGUiLCJyaWdodCIsInNvcnRlZEFycmF5VG9JRHNCU1QiLCJzdGFydCIsImVuZCIsInVzZWRJbmRpY2VzIiwibWlkIiwibm9kZSIsInNlYXJjaFN0YWdlIiwiQnVja2V0R2VuTW9kZSIsIkFzc2Vzc21lbnQiLCJidWNrZXRHZW5Nb2RlIiwiUmFuZG9tQlNUIiwiTUFYX1NUQVJTX0NPVU5UX0lOX0xJTkVBUl9NT0RFIiwiZ2VuZXJhdGVEZXZNb2RlQnVja2V0Q29udHJvbHNJbkNvbnRhaW5lciIsImNsaWNrSGFuZGxlciIsIkxpbmVhckFycmF5QmFzZWQiLCJjdXJyZW50QnVja2V0IiwiaXRlbUJ1dHRvbiIsIm1hcmdpbiIsImN1cnJlbnRMaW5lYXJUYXJnZXRJbmRleCIsInVzZWRJdGVtcyIsInByZXZCdXR0b24iLCJjdXJyZW50TGluZWFyQnVja2V0SW5kZXgiLCJkaXNhYmxlZCIsInRyeU1vdmVCdWNrZXQiLCJ1cGRhdGVCdWNrZXRJbmZvIiwibmV4dEJ1dHRvbiIsImJ1dHRvbnNDb250YWluZXIiLCJmbGV4RGlyZWN0aW9uIiwianVzdGlmeUNvbnRlbnQiLCJhbGlnbkl0ZW1zIiwibnVtQ29uc2VjdXRpdmVXcm9uZyIsInN0YXJ0QXNzZXNzbWVudCIsImJ1aWxkQnVja2V0cyIsInJlcyIsImZldGNoQXNzZXNzbWVudEJ1Y2tldHMiLCJudW1CdWNrZXRzIiwiYnVja2V0QXJyYXkiLCJyb290T2ZJRHMiLCJidWNrZXRzUm9vdCIsImNvbnZlcnRUb0J1Y2tldEJTVCIsImN1cnJlbnROb2RlIiwiYnVja2V0SWQiLCJpbml0QnVja2V0IiwiY3VycmVudFF1ZXN0aW9uIiwidXBkYXRlQ3VycmVudEJ1Y2tldFZhbHVlc0FmdGVyQW5zd2VyaW5nIiwidXBkYXRlRmVlZGJhY2tBZnRlckFuc3dlciIsInF1ZXN0aW9uRW5kVGltZW91dCIsImVuZE9wZXJhdGlvbnMiLCJDaGFuZ2VTdGFySW1hZ2VBZnRlckFuaW1hdGlvbiIsImlzTGluZWFyQXJyYXlFeGhhdXN0ZWQiLCJ0YXJnZXRJdGVtIiwic2VsZWN0VGFyZ2V0SXRlbSIsImZvaWxzIiwiZ2VuZXJhdGVGb2lscyIsImFuc3dlck9wdGlvbnMiLCJzaHVmZmxlQW5zd2VyT3B0aW9ucyIsImNyZWF0ZVF1ZXN0aW9uIiwicXVlc3Rpb25OdW1iZXIiLCJzZWxlY3RSYW5kb21VbnVzZWRJdGVtIiwiZm9pbDEiLCJmb2lsMiIsImZvaWwzIiwiZ2VuZXJhdGVSYW5kb21Gb2lsIiwiZ2VuZXJhdGVMaW5lYXJGb2lsIiwiZXhpc3RpbmdGb2lscyIsImZvaWwiLCJpdGVtVGV4dCIsIm9wdGlvbiIsInRyeU1vdmVCdWNrZXRSYW5kb21CU1QiLCJ0cnlNb3ZlQnVja2V0TGluZWFyQXJyYXlCYXNlZCIsInNlbmRCdWNrZXQiLCJQcmVsb2FkQnVja2V0IiwiaGFzTGluZWFyUXVlc3Rpb25zTGVmdCIsImhhbmRsZVBhc3NlZEJ1Y2tldCIsImhhbmRsZUZhaWxlZEJ1Y2tldCIsInBhc3NIaWdoZXN0QnVja2V0IiwibW92ZVVwVG9OZXh0QnVja2V0IiwiZmFpbExvd2VzdEJ1Y2tldCIsIm1vdmVEb3duVG9QcmV2aW91c0J1Y2tldCIsIlByb2dyZXNzQ2hlc3QiLCJzZXR1cFVJSGFuZGxlcnMiLCJTZXRFeHRlcm5hbEJ1Y2tldENvbnRyb2xzR2VuZXJhdGlvbkhhbmRsZXIiLCJhcHBsaW5rIiwic2VuZEZpbmlzaGVkIiwiVW5pdHlCcmlkZ2UiLCJVbml0eSIsInVuaXR5UmVmZXJlbmNlIiwiU2VuZE1lc3NhZ2UiLCJuIiwidCIsInIiLCJNZXNzYWdlQ2hhbm5lbCIsInBvcnQxIiwicG9ydDIiLCJTeW1ib2wiLCJpdGVyYXRvciIsIm5leHQiLCJiaW5kIiwibyIsIlVSTCIsImYiLCJzIiwidiIsIm5uIiwidG4iLCJybiIsImVuIiwib24iLCJ1biIsImFuIiwiY24iLCJpbnN0YWxsaW5nIiwic2NyaXB0VVJMIiwic24iLCJwZXJmb3JtYW5jZSIsInZuIiwiaG4iLCJsbiIsInN0YXRlIiwic3ciLCJpc0V4dGVybmFsIiwib3JpZ2luYWxFdmVudCIsIm1uIiwiaXNVcGRhdGUiLCJkaXNwYXRjaEV2ZW50Iiwid24iLCJ3YWl0aW5nIiwiZG4iLCJzZXJ2aWNlV29ya2VyIiwiY29udHJvbGxlciIsImduIiwicG9ydHMiLCJzb3VyY2UiLCJnZXRTVyIsIl9fcHJvdG9fXyIsImwiLCJ3IiwicmVnaXN0ZXIiLCJpbW1lZGlhdGUiLCJyZWFkeVN0YXRlIiwiQm9vbGVhbiIsInluIiwicG4iLCJvbmNlIiwid2FzV2FpdGluZ0JlZm9yZVJlZ2lzdGVyIiwibWVzc2FnZVNXIiwibWVzc2FnZVNraXBXYWl0aW5nIiwiZW51bWVyYWJsZSIsImNvbmZpZ3VyYWJsZSIsIndyaXRhYmxlIiwiZGVmaW5lUHJvcGVydHkiLCJQbiIsIlNuIiwibG9hZGluZ1NjcmVlbiIsInByb2dyZXNzQmFyIiwiaGFuZGxlU2VydmljZVdvcmtlck1lc3NhZ2UiLCJwcm9ncmVzc1ZhbHVlIiwid2lkdGgiLCJTZXRDb250ZW50TG9hZGVkIiwic2V0SXRlbSIsImJvb2tOYW1lIiwiQW5kcm9pZCIsImlzQ29udGVudENhY2hlZCIsImNhY2hlZFN0YXR1cyIsInJlYWRMYW5ndWFnZURhdGFGcm9tQ2FjaGVBbmROb3RpZnlBbmRyb2lkQXBwIiwiaGFuZGxlTG9hZGluZ01lc3NhZ2UiLCJwcm9ncmVzcyIsImhhbmRsZVVwZGF0ZUZvdW5kTWVzc2FnZSIsInRleHQiLCJjb25maXJtIiwicmVsb2FkIiwiY2FjaGVNb2RlbCIsImNvbnRlbnRGaWxlUGF0aCIsImF1ZGlvVmlzdWFsUmVzb3VyY2VzIiwic2V0QXBwTmFtZSIsInNldENvbnRlbnRGaWxlUGF0aCIsInNldEF1ZGlvVmlzdWFsUmVzb3VyY2VzIiwiYWRkSXRlbVRvQXVkaW9WaXN1YWxSZXNvdXJjZXMiLCJmYW5hbHl0aWNzIiwiYW5hbHl0aWNzUHJvdmlkZXIiLCJpbml0aWFsaXplQW5hbHl0aWNzIiwiZ2V0QW5hbHl0aWNzIiwiYXV0aERvbWFpbiIsImRhdGFiYXNlVVJMIiwic3RvcmFnZUJ1Y2tldCIsIm1lc3NhZ2luZ1NlbmRlcklkIiwic3BpblVwIiwiZmV0Y2hBcHBEYXRhIiwiU2V0RmVlZGJhY2tUZXh0IiwiZ2FtZSIsImF1ZGlvSXRlbVVSTCIsIm51dWlkIiwic2V0VXVpZCIsImdldFVzZXJTb3VyY2UiLCJsaW5rQW5hbHl0aWNzIiwic2V0QXNzZXNzbWVudFR5cGUiLCJzZW5kSW5pdCIsInJlZ2lzdGVyU2VydmljZVdvcmtlciIsInJlZ2lzdHJhdGlvbiIsImhhbmRsZVNlcnZpY2VXb3JrZXJSZWdpc3RhdGlvbiIsInJlYWR5IiwiZ2V0VGltZSIsImNhY2hlIiwiYWhlYWRDb250ZW50VmVyc2lvbiIsInJlbW92ZUl0ZW0iLCJjYWNoZXMiLCJhcHBEYXRhIl0sInNvdXJjZVJvb3QiOiIifQ==
