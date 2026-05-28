import { useMemo, useRef, useState } from "react";
import "./App.css";
import musicFile from "./assets/music/dumbapp.mp3"; 
import slapSound from "./assets/music/slap.mp3";
import emailjs from "@emailjs/browser";
import sadImage1 from "./assets/sad/sad1.webp";
import sadImage2 from "./assets/sad/sad2.jpg";
import sadImage3 from "./assets/sad/sad3.jpg";
import sadImage4 from "./assets/sad/sad4.avif";
import sadImage5 from "./assets/sad/sad5.jpg";


function App() {
  const [page, setPage] = useState("start");
  const [noPosition, setNoPosition] = useState({ top: 0, left: 0 });
  const [noHasMoved, setNoHasMoved] = useState(false);
  const audioRef = useRef(null);
  const slapAudioRef = useRef(null);
  const startButtonsRef = useRef(null);
  const yesButtonRef = useRef(null);
  const noButtonRef = useRef(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [sadStep, setSadStep] = useState(0);

  const toggleMusic = async () => {
    if (!audioRef.current) return;

    try {
      audioRef.current.volume = 0.35;

      if (isMusicPlaying) {
        audioRef.current.pause();
        setIsMusicPlaying(false);
      } else {
        await audioRef.current.play();
        setIsMusicPlaying(true);
      }
    } catch (error) {
      console.log("Music could not start:", error);
    }
  };
  const [shake, setShake] = useState(false);
  const [slapVisible, setSlapVisible] = useState(false);
  const [choice, setChoice] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [senderEmail, setSenderEmail] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [inviteSending, setInviteSending] = useState(false);
  const [inviteSent, setInviteSent] = useState(false);
  const [generatedInviteLink, setGeneratedInviteLink] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);
  const [inviteMode, setInviteMode] = useState("");
  
  const SERVICE_ID = "service_6o9zavl";
  const INVITATION_TEMPLATE_ID = "template_l1oery5";
  const GENERIC_TEMPLATE_ID = "template_erfij4t";
  const PUBLIC_KEY = "qB89miUVx5SLHbPOq";

  const urlParams = new URLSearchParams(window.location.search);
  const senderFromUrl = urlParams.get("sender") || "";
  const recipientFromUrl = urlParams.get("recipient") || "";
  const isSendPage = window.location.pathname === "/send";

  const createInviteLink = () => {
    return `https://dumbapp.vercel.app/?sender=${encodeURIComponent(
      senderEmail
    )}&recipient=${encodeURIComponent(recipientEmail)}`;
  };

  const sendInvitation = async () => {
    if (!senderEmail || !recipientEmail) return;

    setInviteSending(true);

    const appLink = createInviteLink();
    setGeneratedInviteLink(appLink);
    setLinkCopied(false);
    setInviteMode("email");

    try {
      await emailjs.send(
        SERVICE_ID,
        INVITATION_TEMPLATE_ID,
        {
          sender_email: senderEmail,
          recipient_email: recipientEmail,
          app_link: appLink,
        },
        PUBLIC_KEY
      );

      setInviteSent(true);
    } catch (error) {
      console.log("Invitation could not be sent:", error);
      alert("Something went wrong. Try again.");
    } finally {
      setInviteSending(false);
    }
  };

  const generateInvitationLink = () => {
    if (!senderEmail || !recipientEmail) return;

    const appLink = createInviteLink();
    setGeneratedInviteLink(appLink);
    setInviteSent(false);
    setLinkCopied(false);
    setInviteMode("link");
  };

  const copyInviteLink = async () => {
    if (!generatedInviteLink) return;

    try {
      await navigator.clipboard.writeText(generatedInviteLink);
      setLinkCopied(true);

      setTimeout(() => {
        setLinkCopied(false);
      }, 6000);
    } catch (error) {
      console.log("Could not copy link:", error);
    }
  };

  const moveNoButton = (event) => {
    if (!startButtonsRef.current || !noButtonRef.current || !yesButtonRef.current) return;

    const area = startButtonsRef.current.getBoundingClientRect();
    const noRect = noButtonRef.current.getBoundingClientRect();
    const yesRect = yesButtonRef.current.getBoundingClientRect();

    const isMobile = window.innerWidth <= 600;

    let pointerX;
    let pointerY;

    if (event.touches && event.touches.length > 0) {
      pointerX = event.touches[0].clientX - area.left;
      pointerY = event.touches[0].clientY - area.top;
    } else {
      pointerX = event.clientX - area.left;
      pointerY = event.clientY - area.top;
    }

    let currentLeft = noHasMoved ? noPosition.left : noRect.left - area.left;
    let currentTop = noHasMoved ? noPosition.top : noRect.top - area.top;

    const buttonWidth = noRect.width;
    const buttonHeight = noRect.height;

    const noCenterX = currentLeft + buttonWidth / 2;
    const noCenterY = currentTop + buttonHeight / 2;

    let dx = noCenterX - pointerX;
    let dy = noCenterY - pointerY;

    const distance = Math.sqrt(dx * dx + dy * dy) || 1;

    dx = dx / distance;
    dy = dy / distance;

    const step = isMobile ? 28 : 38;

    let nextLeft = currentLeft + dx * step;
    let nextTop = currentTop + dy * step;

    const maxLeft = area.width - buttonWidth;
    const maxTop = area.height - buttonHeight;

    nextLeft = Math.max(0, Math.min(nextLeft, maxLeft));
    nextTop = Math.max(0, Math.min(nextTop, maxTop));

    const yesSafeZone = {
      left: yesRect.left - area.left - 12,
      right: yesRect.right - area.left + 12,
      top: yesRect.top - area.top - 12,
      bottom: yesRect.bottom - area.top + 12,
    };

    const noNextBox = {
      left: nextLeft,
      right: nextLeft + buttonWidth,
      top: nextTop,
      bottom: nextTop + buttonHeight,
    };

    const overlapsYes =
      noNextBox.left < yesSafeZone.right &&
      noNextBox.right > yesSafeZone.left &&
      noNextBox.top < yesSafeZone.bottom &&
      noNextBox.bottom > yesSafeZone.top;

    if (overlapsYes) {
      if (isMobile) {
        nextLeft = Math.min(maxLeft, yesSafeZone.right + 18);
        nextTop = Math.max(yesSafeZone.bottom + 18, nextTop);

        if (nextLeft > maxLeft) {
          nextLeft = 0;
        }

        if (nextTop > maxTop) {
          nextTop = maxTop;
        }
      } else {
        nextLeft = area.width / 2 + 70;
        nextTop = Math.max(nextTop, 90);
      }
    }

    setNoHasMoved(true);
    setNoPosition({
      top: nextTop,
      left: nextLeft,
    });
  };

  const doSlap = () => {
    setShake(true);
    setSlapVisible(true);

    if (slapAudioRef.current) {
      slapAudioRef.current.currentTime = 0;
      slapAudioRef.current.volume = 0.75;
      slapAudioRef.current.play().catch((error) => {
        console.log("Slap sound could not play:", error);
      });
    }

    setTimeout(() => {
      setShake(false);
      setSlapVisible(false);
    }, 700);
  };

  const sendDateResponse = async () => {
    if (!choice || !date || !time) return;

    const finalSenderEmail = senderFromUrl || "anegrigoriou@gmail.com";
    const finalRecipientEmail = recipientFromUrl || "unknown recipient";

    setIsSending(true);

    try {
      await emailjs.send(
        SERVICE_ID,
        GENERIC_TEMPLATE_ID,
        {
          to_email: finalSenderEmail,
          reply_to: finalRecipientEmail,
          subject: "Someone answered your date app 💗",
          message: `

  Recipient: ${finalRecipientEmail}

  Plan: ${choice}
  Date: ${date}
  Time: ${time}`,
        },
        PUBLIC_KEY
      );

      if (recipientFromUrl) {
        await emailjs.send(
          SERVICE_ID,
          GENERIC_TEMPLATE_ID,
          {
            to_email: finalRecipientEmail,
            reply_to: finalSenderEmail,
            subject: "Your date is set 💗",
            message: `You accepted the invitation 💗

  Plan: ${choice}
  Date: ${date}
  Time: ${time}

  Get ready ✨`,
          },
          PUBLIC_KEY
        );
      }

      setEmailSent(true);
      setPage("final");
    } catch (error) {
      console.log("Email could not be sent:", error);
      setPage("final");
    } finally {
      setIsSending(false);
    }
  };

  const flowers = useMemo(() => {
    return Array.from({ length: 24 }, () => ({
      left: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 6 + Math.random() * 6,
      size: 18 + Math.random() * 12,
    }));
  }, []);

  const timeOptions = [];

  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const formattedHour = String(hour).padStart(2, "0");
      const formattedMinute = String(minute).padStart(2, "0");
      timeOptions.push(`${formattedHour}:${formattedMinute}`);
    }
  }

  const sadLoopImages = [sadImage2, sadImage3, sadImage4, sadImage5];

  const currentSadImage =
    sadStep === 0
      ? sadImage1
      : sadLoopImages[(sadStep - 1) % sadLoopImages.length];

  const sadText =
    sadStep === 0
      ? "Just kidding... you can say no if you want."
      : "Hehehe... no, really, if you want, you can say no.";

  const handleSadNo = () => {
    doSlap();
    setSadStep((prev) => prev + 1);
  };

  if (isSendPage) {
    return (
      <div className="app">
        <div className="flowers">
          {flowers.map((flower, index) => (
            <span
              key={index}
              className="flower"
              style={{
                left: `${flower.left}%`,
                animationDelay: `${flower.delay}s`,
                animationDuration: `${flower.duration}s`,
                fontSize: `${flower.size}px`,
              }}
            >
              🌸
            </span>
          ))}
        </div>

        <div className="card">
          <div className="imageBox">💌</div>

          <h1>Send a tiny invitation</h1>
          <p className="subtitle">
            Fill in the emails and send the little surprise.
          </p>

          <div className="form">
            <label>Your email</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={senderEmail}
              onChange={(e) => setSenderEmail(e.target.value)}
            />

            <label>Who send to?</label>
            <input
              type="email"
              placeholder="her@email.com"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
            />
          </div>

          <div className="sendActions">
            <button
              className="btn yes"
              disabled={!senderEmail || !recipientEmail || inviteSending}
              onClick={sendInvitation}
            >
              {inviteSending ? "sending..." : "send via email 💌"}
            </button>

            <button
              className="btn no"
              disabled={!senderEmail || !recipientEmail || inviteSending}
              onClick={generateInvitationLink}
            >
              generate link 🔗
            </button>
          </div>

          {inviteSent && inviteMode === "email" && (
            <p className="sentMessage">
              Invitation sent successfully 💗
            </p>
          )}

          {generatedInviteLink && (
            <div className="inviteResult">
              {inviteMode === "email" && (
                <p className="subtitle smallSubtitle">
                  You can also copy this link and send it anywhere:
                </p>
              )}

              <div className="linkBox">
                <span>{generatedInviteLink}</span>
              </div>

              <button className="btn no copyButton" onClick={copyInviteLink}>
                {linkCopied ? "copied 💗" : "copy link 📋"}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`app ${shake ? "shake" : ""}`}>
      <audio ref={audioRef} src={musicFile} loop preload="auto" />
      <audio ref={slapAudioRef} src={slapSound} preload="auto" />

      <button className="musicButton" onClick={toggleMusic}>
        {isMusicPlaying ? "music on 🔊" : "music off 🎵"}
      </button>
      <div className="flowers">
        {flowers.map((flower, index) => (
          <span
            key={index}
            className="flower"
            style={{
              left: `${flower.left}%`,
              animationDelay: `${flower.delay}s`,
              animationDuration: `${flower.duration}s`,
              fontSize: `${flower.size}px`,
            }}
          >
            🌸
          </span>
        ))}
      </div>

      {slapVisible && <div className="slap">👋</div>}

      {page === "start" && (
        <div className="card">
          <div className="imageBox">🐰</div>

          <h1>Will you go on a date with me?</h1>
          <p className="subtitle">Please choose carefully 🌸</p>

          <div
            ref={startButtonsRef}
            className={`buttons startButtons ${noHasMoved ? "noMoved" : ""}`}
          >
            <button
              ref={yesButtonRef}
              className="btn yes"
              onClick={() => {
                setSadStep(0);
                setPage("sad");
              }}
            >
              YES 💗
            </button>

            <button
              ref={noButtonRef}
              className={`btn no ${noHasMoved ? "runawayNo" : ""}`}
              style={
                noHasMoved
                  ? {
                      top: `${noPosition.top}px`,
                      left: `${noPosition.left}px`,
                    }
                  : undefined
              }
              onMouseEnter={(e) => moveNoButton(e)}
              onMouseMove={(e) => moveNoButton(e)}
              onTouchStart={(e) => {
                e.preventDefault();
                moveNoButton(e);
              }}
              onTouchMove={(e) => {
                e.preventDefault();
                moveNoButton(e);
              }}
              onClick={(e) => {
                e.preventDefault();
                moveNoButton(e);
              }}
            >
              no... 🙈
            </button>
            {noHasMoved && <span className="noPlaceholder" />}
          </div>
        </div>
      )}

      {page === "sad" && (
        <div className="card">
          <div className="imageBox sadImageBox">
            <img src={currentSadImage} alt="funny reaction" />
          </div>

          <h1>{sadText}</h1>

          <div className="buttons">
            <button className="btn yes" onClick={() => setPage("surprise")}>
              YES 💗
            </button>

            <button className="btn no" onClick={handleSadNo}>
              no...
            </button>
          </div>

          {slapVisible && <p className="warning">Nope. Try again 😤</p>}
        </div>
      )}

      {page === "surprise" && (
        <div className="card">
          <div className="imageBox">😭</div>

          <h1>WAIT... YOU ACTUALLY SAID YES??</h1>
          <p className="subtitle">Wow... I didn’t expect you to say it on the first try 😭</p>

          <button className="btn yes big" onClick={() => setPage("activity")}>
            okay okay! →
          </button>
        </div>
      )}

      {page === "activity" && (
        <div className="card">
          <h1>What are we feeling? ✨</h1>
          <p className="subtitle">Choose our little plan</p>

          <div className="choices">
            <button
              className={`choice ${choice === "Food" ? "selected" : ""}`}
              onClick={() => setChoice("Food")}
            >
              <span>🍽️</span>
              Food
            </button>

            <button
              className={`choice ${choice === "Cinema" ? "selected" : ""}`}
              onClick={() => setChoice("Cinema")}
            >
              <span>🎬</span>
              Cinema
            </button>

            <button
              className={`choice ${choice === "Drink" ? "selected" : ""}`}
              onClick={() => setChoice("Drink")}
            >
              <span>🍸</span>
              Drink
            </button>
          </div>

          <button
            className="btn yes big"
            disabled={!choice}
            onClick={() => setPage("date")}
          >
            continue →
          </button>
        </div>
      )}

      {page === "date" && (
        <div className="card">
          <div className="imageBox">🗓️</div>

          <h1>So... when are you free?</h1>

          <div className="form">
            <label>Pick a day</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            <label>What time?</label>
            <select value={time} onChange={(e) => setTime(e.target.value)}>
              <option value="">Choose time</option>
              {timeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <button
            className="btn yes big"
            disabled={!date || !time || isSending}
            onClick={sendDateResponse}
          >
            {isSending ? "sending..." : "set the date! 💗"}
          </button>
        </div>
      )}

      {page === "final" && (
        <div className="card">
          <div className="imageBox">💗</div>

          <h1>Glad you didn’t say no.</h1>
          <p className="subtitle">
            Be ready with your helmet on… I’m coming on my horse 🐎💗
          </p>

          <div className="summary">
            <p>
              <strong>Plan:</strong> {choice}
            </p>
            <p>
              <strong>Date:</strong> {date}
            </p>
            <p>
              <strong>Time:</strong> {time}
            </p>
          </div>

          {emailSent && (
            <p className="sentMessage">
              Your answer has been sent 💌
            </p>
          )}

          <p className="ps">
            P.S. I hope this made you smile
          </p>
        </div>
      )}
    </div>
  );
}

export default App;