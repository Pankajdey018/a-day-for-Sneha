import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Heart, Sparkles, Gift, Stars, ArrowDown } from 'lucide-react';
import './style.css';

const FRIEND_NAME = 'Sneha';

function useScrollReveal() {
  const ref = useRef(null);
  const [revealState, setRevealState] = useState('idle');

  useEffect(() => {
    const element = ref.current;
    if (
      !element ||
      !('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealState('visible');
          observer.unobserve(element);
        }
      },
      { threshold: 0.12 }
    );

    observer.observe(element);
    setRevealState('pending');
    return () => observer.disconnect();
  }, []);

  return {
    ref,
    className: `scroll-reveal${revealState === 'pending' ? ' is-pending' : ''}${revealState === 'visible' ? ' is-visible' : ''}`,
  };
}

function App() {
  const [surpriseOpen, setSurpriseOpen] = useState(false);
  const [celebration, setCelebration] = useState(null);
  const [cakeCelebration, setCakeCelebration] = useState(0);
  const [audioError, setAudioError] = useState('');
  const messageReveal = useScrollReveal();
  const galleryHeadingReveal = useScrollReveal();
  const firstPhotoReveal = useScrollReveal();
  const secondPhotoReveal = useScrollReveal();
  const thirdPhotoReveal = useScrollReveal();
  const firstWishReveal = useScrollReveal();
  const secondWishReveal = useScrollReveal();
  const thirdWishReveal = useScrollReveal();
  const surpriseReveal = useScrollReveal();
  const footerReveal = useScrollReveal();
  const celebrationId = useRef(0);
  const audioContextRef = useRef(null);
  const songOscillatorRef = useRef(null);

  useEffect(() => {
    if (!celebration) return undefined;
    const timeout = window.setTimeout(() => setCelebration(null), 3000);
    return () => window.clearTimeout(timeout);
  }, [celebration]);

  useEffect(() => {
    if (!cakeCelebration) return undefined;
    const timeout = window.setTimeout(() => setCakeCelebration(0), 1400);
    return () => window.clearTimeout(timeout);
  }, [cakeCelebration]);

  useEffect(() => () => {
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      void audioContextRef.current.close();
    }
  }, []);

  const celebrate = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const particles = Array.from({ length: 48 }, (_, index) => {
      const angle = Math.random() * Math.PI * 2;
      const distance = 80 + Math.random() * 180;
      const shape = ['heart', 'star', 'dot', 'paper'][index % 4];

      return {
        shape,
        symbol: shape === 'heart' ? '♡' : shape === 'star' ? '✦' : '',
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance - 55,
        rotation: `${Math.round(Math.random() * 900 - 450)}deg`,
        duration: `${2.2 + Math.random() * 0.7}s`,
        color: ['#d58d9c', '#c4a5d8', '#f4d8c6', '#e5b86f'][index % 4],
      };
    });

    celebrationId.current += 1;
    setCelebration({
      id: celebrationId.current,
      x: bounds.left + bounds.width / 2,
      y: bounds.top + bounds.height / 2,
      particles,
    });
  };

  const playBirthdaySong = async () => {
    const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextConstructor) {
      setAudioError('Audio playback is not supported in this browser.');
      return;
    }

    try {
      let context = audioContextRef.current;
      if (!context || context.state === 'closed') {
        context = new AudioContextConstructor();
        audioContextRef.current = context;
      }

      if (context.state === 'suspended') await context.resume();
      if (songOscillatorRef.current) songOscillatorRef.current.stop();

      const phrases = [
        [[392, 0.75], [392, 0.25], [440, 1], [392, 1], [523.25, 1], [493.88, 2]],
        [[392, 0.75], [392, 0.25], [440, 1], [392, 1], [587.33, 1], [523.25, 2]],
        [[392, 0.75], [392, 0.25], [783.99, 1], [659.25, 1], [523.25, 1], [493.88, 1], [440, 2]],
        [[698.46, 0.75], [698.46, 0.25], [659.25, 1], [523.25, 1], [587.33, 1], [523.25, 2]],
      ];
      const beatDuration = 0.52;
      const phrasePause = (14 - 25 * beatDuration) / (phrases.length - 1);
      const start = context.currentTime + 0.02;
      const oscillator = context.createOscillator();
      const envelope = context.createGain();

      oscillator.type = 'triangle';
      oscillator.connect(envelope);
      envelope.connect(context.destination);

      let elapsed = 0;
      phrases.forEach((phrase, phraseIndex) => {
        phrase.forEach(([frequency, beats]) => {
          const noteStart = start + elapsed;
          const noteDuration = beats * beatDuration;
          oscillator.frequency.setValueAtTime(frequency, noteStart);
          envelope.gain.setValueAtTime(0.0001, noteStart);
          envelope.gain.linearRampToValueAtTime(0.13, noteStart + 0.025);
          envelope.gain.exponentialRampToValueAtTime(0.0001, noteStart + noteDuration * 0.9);
          elapsed += noteDuration;
        });
        if (phraseIndex < phrases.length - 1) elapsed += phrasePause;
      });

      oscillator.onended = () => {
        oscillator.disconnect();
        envelope.disconnect();
        if (songOscillatorRef.current === oscillator) songOscillatorRef.current = null;
      };
      songOscillatorRef.current = oscillator;
      oscillator.start(start);
      oscillator.stop(start + 14);
      setAudioError('');
    } catch (error) {
      console.error('Could not play the birthday tune.', error);
      setAudioError('The birthday tune could not play. Please try clicking the cake again.');
    }
  };

  const celebrateCake = () => {
    setCakeCelebration((run) => run + 1);
    void playBirthdaySong();
  };

  const handleCakeKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      celebrateCake();
    }
  };

  return (
    <main>
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="sparkle sparkle-one">✦</div>
      <div className="sparkle sparkle-two">✧</div>
      <div className="sparkle sparkle-three">✦</div>

      <nav className="topbar">
        <a className="brand" href="#home"><span className="brand-icon"><Heart size={15} fill="currentColor" /></span> a little something</a>
        <span className="top-note">made with good wishes <span>♡</span></span>
      </nav>

      <section className="hero" id="home">
        <div className="floaty floaty-heart heart-a" aria-hidden="true">♡</div>
        <div className="floaty floaty-star star-a" aria-hidden="true">✦</div>
        <div className="floaty floaty-heart heart-b" aria-hidden="true">♡</div>
        <div className="floaty floaty-star star-b" aria-hidden="true">✧</div>
        <div className="floaty floaty-sparkle sparkle-a" aria-hidden="true">✧</div>
        <div className="floaty floaty-heart heart-c" aria-hidden="true">♡</div>
        <div className="floaty floaty-star star-c" aria-hidden="true">✦</div>
        <div className="eyebrow"><Sparkles size={14} /> CHEERS TO 23 YEARS <Sparkles size={14} /></div>
        <div
          className={`cake-illustration${cakeCelebration ? ' is-celebrating' : ''}`}
          role="button"
          tabIndex={0}
          aria-label="Play a birthday tune and make a wish"
          onClick={celebrateCake}
          onKeyDown={handleCakeKeyDown}
        >
          <span className="cake-burst burst-one" aria-hidden="true">✦</span>
          <span className="cake-burst burst-two" aria-hidden="true">✧</span>
          <span className="cake-burst burst-three" aria-hidden="true">♡</span>
          <span className="cake-burst burst-four" aria-hidden="true">✦</span>
          <span className="cake-spark s1">✦</span><span className="cake-spark s2">✧</span>
          <div className="candle"><i /></div><span className="age-number">23</span>
          <div className="cake-top" />
          <div className="cake-body"><span className="icing">♡　♡　♡</span></div>
          <div className="cake-plate" />
        </div>
        {audioError && <p className="audio-notice" role="status">{audioError}</p>}
        <p className="hello">A little celebration for your 23rd</p>
        <h1><span className="headline-line">Happy 23rd Birthday,</span><em className="headline-name">{FRIEND_NAME}!</em></h1>
        <p className="hero-copy">23 looks lovely on you. Here’s to a fresh chapter, new adventures, and so many little things to celebrate.</p>
        <a className="scroll-link" href="#message">SCROLL FOR A LITTLE NOTE <ArrowDown size={14} /></a>
      </section>

      <section className="message-section" id="message">
        <div ref={messageReveal.ref} className={`message-card ${messageReveal.className}`}>
          <div className="card-stamp"><Heart size={20} fill="currentColor" /></div>
          <p className="section-kicker">A BIRTHDAY NOTE</p>
          <h2>Wishing you<br /><em>the loveliest year.</em></h2>
          <div className="tiny-divider"><span />✿<span /></div>
          <p className="message">
            Happy Birthday! I hope this year brings you lots of happiness,
            new adventures, little wins, and countless reasons to smile.
            May you get closer to everything you've been wishing for.
            Keep being your wonderful self, and have an absolutely amazing day!
          </p>
          <p className="signoff">Have the best one <span>♡</span></p>
        </div>
      </section>


     <section className="gallery-section">
    <p className="section-kicker">A LITTLE GALLERY OF GOOD TIMES ♡</p>

    <h2 ref={galleryHeadingReveal.ref} className={galleryHeadingReveal.className}>Little moments with <em>Sneha</em></h2>

    <p className="gallery-intro">
        A few favourite smiles, saved in one little corner.
    </p>

    <div className="photo-grid">
        <div ref={firstPhotoReveal.ref} className={`photo-frame photo-tall ${firstPhotoReveal.className}`}>
            <img src="/photos/sneha-1.jpg" alt="A little moment together" />
            <span className="photo-caption">a little moment ♡</span>
        </div>

        <div ref={secondPhotoReveal.ref} className={`photo-frame ${secondPhotoReveal.className}`}>
            <img src="/photos/sneha-2.jpg" alt="Sneha smiling" />
            <span className="photo-caption">the birthday girl ✨</span>
        </div>

        <div ref={thirdPhotoReveal.ref} className={`photo-frame ${thirdPhotoReveal.className}`}>
            <img src="/photos/sneha-3.jpg" alt="A favourite selfie together" />
            <span className="photo-caption">one for the memories ✿</span>
        </div>
    </div>
</section>

      <section className="wishes-section">
        <p className="section-kicker">A FEW THINGS I WISH FOR YOU</p>
        <h2>May your year be filled with...</h2>
        <div className="wish-grid">
          <article ref={firstWishReveal.ref} className={`wish-card ${firstWishReveal.className}`}><span className="wish-icon peach"><Stars /></span><h3>Little joys</h3><p>The kind that make an ordinary day feel special.</p></article>
          <article ref={secondWishReveal.ref} className={`wish-card ${secondWishReveal.className}`}><span className="wish-icon lilac"><Sparkles /></span><h3>New adventures</h3><p>New places, new stories, and memories to keep.</p></article>
          <article ref={thirdWishReveal.ref} className={`wish-card ${thirdWishReveal.className}`}><span className="wish-icon yellow"><Heart /></span><h3>Good people</h3><p>Kind hearts, genuine laughs, and lovely moments.</p></article>
        </div>
      </section>

      <section className="surprise-section">
        <div ref={surpriseReveal.ref} className={`surprise-box ${surpriseReveal.className}`}>
          <div className="gift-icon"><Gift size={30} /></div>
          <p className="section-kicker">ONE LAST THING</p>
          <h2>There's a little<br /><em>surprise for you.</em></h2>
          <p className="surprise-copy">Because birthdays deserve a little extra sparkle.</p>
          <button className="primary-button" onClick={() => setSurpriseOpen(!surpriseOpen)}>
            {surpriseOpen ? 'Close your surprise' : 'Open your surprise'} <span>✧</span>
          </button>
          {surpriseOpen && <div className="surprise-note">
            <span className="surprise-heart">♡</span>
            <p>Whatever this next chapter looks like, I hope it's kind to you. Enjoy your day and make the most of it!</p>
            <small>— with warm wishes, Pankaj ♡</small>
          </div>}
        </div>
      </section>

      <footer ref={footerReveal.ref} className={footerReveal.className}>
        <p>Made with a little creativity & lots of good wishes <Heart size={13} fill="currentColor" /></p>
        <span>CHEERS TO 23 ✦</span>
      </footer>

      {celebration && <div className="confetti-layer" aria-hidden="true">{celebration.particles.map((particle, index) => <i
        key={`${celebration.id}-${index}`}
        className={`confetti-${particle.shape}`}
        style={{
          left: `${celebration.x}px`,
          top: `${celebration.y}px`,
          '--travel-x': `${particle.x}px`,
          '--travel-y': `${particle.y}px`,
          '--spin': particle.rotation,
          '--duration': particle.duration,
          '--confetti-color': particle.color,
        }}
      >{particle.symbol}</i>)}</div>}
      <button className="celebrate-button" onClick={celebrate} aria-label="Celebrate with confetti"><Sparkles size={18} /> Celebrate</button>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
