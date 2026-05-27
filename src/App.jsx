import { useMemo, useRef, useState } from "react";
import "./App.css";
import musicFile from "./assets/music/dumbapp.mp3"; 
import slapSound from "./assets/music/slap.mp3";
import emailjs from "@emailjs/browser";

function App() {
  const [page, setPage] = useState("start");
  const [yesPosition, setYesPosition] = useState({ top: 0, left: 0 });
  const [yesHasMoved, setYesHasMoved] = useState(false);
  const audioRef = useRef(null);
  const slapAudioRef = useRef(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

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

  const moveYesButton = () => {
    const isMobile = window.innerWidth <= 600;

    const desktopPositions = [
      { top: 0, left: 20 },
      { top: 0, left: 390 },
      { top: 70, left: 20 },
      { top: 70, left: 390 },
      { top: 125, left: 20 },
      { top: 125, left: 390 },
    ];

    const mobilePositions = [
      { top: 0, left: 10 },
      { top: 60, left: 10 },
      { top: 120, left: 10 },
      { top: 0, left: 95 },
      { top: 60, left: 95 },
      { top: 120, left: 95 },
    ];

    const positions = isMobile ? mobilePositions : desktopPositions;
    const randomPosition = positions[Math.floor(Math.random() * positions.length)];

    setYesHasMoved(true);
    setYesPosition(randomPosition);
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

    setIsSending(true);

    try {
      await emailjs.send(
        "service_6o9zavl",
        "template_erfij4t",
        {
          plan: choice,
          date: date,
          time: time,
        },
        "qB89miUVx5SLHbPOq"
      );

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

          <div className={`buttons startButtons ${yesHasMoved ? "yesMoved" : ""}`}>
            <button
              className={`btn yes ${yesHasMoved ? "runaway" : ""}`}
              style={
                yesHasMoved
                  ? {
                      top: `${yesPosition.top}px`,
                      left: `${yesPosition.left}px`,
                    }
                  : undefined
              }
              onClick={(e) => {
                e.preventDefault();
                moveYesButton();
              }}
              onTouchStart={(e) => {
                e.preventDefault();
                moveYesButton();
              }}
            >
              YES 💗
            </button>

            <button className="btn no" onClick={() => setPage("sad")}>
              no... 🙈
            </button>
          </div>
        </div>
      )}

      {page === "sad" && (
        <div className="card">
          <div className="imageBox sadBunny">🥺</div>

          <h1>You chose no?</h1>
          <p className="subtitle">
            Ouch... that hurt a little.
            <br />
            Please try again 🥺
          </p>

          <div className="buttons">
            <button className="btn yes" onClick={() => setPage("surprise")}>
              YES 💗
            </button>

            <button className="btn no" onClick={doSlap}>
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
          <p className="subtitle">I was so ready for you to say no 😭</p>

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