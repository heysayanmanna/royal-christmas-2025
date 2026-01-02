/* =========================================
   1. GLOBAL INITIALIZATION & PRELOADER
   ========================================= */

// Initialize AOS Animation
if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 1000, once: false, mirror: true });
}

// Preloader Logic (Force Remove after 3 seconds)
window.addEventListener("load", function() {
    removePreloader();
});

// Backup: If load fails, remove anyway after 3.5s
setTimeout(removePreloader, 3500);

function removePreloader() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.style.transition = "opacity 0.8s ease";
        preloader.style.opacity = '0';
        setTimeout(() => { preloader.style.display = 'none'; }, 800);
    }
}

/* =========================================
   2. GLOBAL EFFECTS (Snow, Music, Mouse)
   ========================================= */

// --- ❄️ Realistic Emoji Snowfall ---
function createSnow() {
    const snowContainer = document.getElementById('snow-container');
    if (!snowContainer) return;

    const snow = document.createElement('div');
    snow.classList.add('snowflake');
    
    const symbols = ['❄', '❅', '❆', '•'];
    snow.innerText = symbols[Math.floor(Math.random() * symbols.length)];

    snow.style.left = Math.random() * 100 + 'vw';
    const size = Math.random() * 15 + 10;
    snow.style.fontSize = size + 'px';
    
    const duration = Math.random() * 3 + 3;
    snow.style.animationDuration = duration + 's';
    snow.style.opacity = Math.random() * 0.7 + 0.3;
    
    snowContainer.appendChild(snow);
    setTimeout(() => { snow.remove(); }, 6000);
}
setInterval(createSnow, 100);

// --- 🎵 Global Music Player (Auto-Play Fix) ---
let isMusicPlaying = false;

function toggleMusic() {
    const audio = document.getElementById('bg-music');
    const icon = document.getElementById('music-icon');
    if (!audio) return;

    if (isMusicPlaying) {
        audio.pause();
        if(icon) {
            icon.className = "fas fa-music text-warning";
            icon.style.color = "#fcf6ba";
        }
    } else {
        audio.play().catch(e => console.log("Interaction needed"));
        if(icon) {
            icon.className = "fas fa-pause text-white";
            icon.style.color = "white";
        }
    }
    isMusicPlaying = !isMusicPlaying;
}

// Auto-play on first click anywhere on the page
document.body.addEventListener('click', function() {
    const audio = document.getElementById('bg-music');
    const icon = document.getElementById('music-icon');
    if (audio && audio.paused) {
        audio.play().then(() => {
            isMusicPlaying = true;
            if(icon) icon.className = "fas fa-pause text-white";
        }).catch(e => console.log("Audio waiting for interaction"));
    }
}, { once: true });

// --- ✨ Magic Mouse Trail ---
document.addEventListener('mousemove', (e) => {
    const trail = document.createElement('div');
    trail.className = 'sparkle'; // Ensure this class is in CSS
    // Fallback CSS for sparkle if missing
    trail.style.position = 'absolute';
    trail.style.width = '6px'; trail.style.height = '6px';
    trail.style.background = '#fcf6ba'; trail.style.borderRadius = '50%';
    trail.style.pointerEvents = 'none'; trail.style.zIndex = '9999';
    
    trail.style.left = e.pageX + 'px';
    trail.style.top = e.pageY + 'px';
    document.body.appendChild(trail);
    
    // Simple fade out animation
    const anim = trail.animate([
        { opacity: 1, transform: 'scale(1)' },
        { opacity: 0, transform: 'scale(0)' }
    ], { duration: 800 });

    anim.onfinish = () => trail.remove();
});


/* =========================================
   3. HOME PAGE LOGIC (Countdown)
   ========================================= */
const countdownElement = document.getElementById('days');
if (countdownElement) {
    const targetDate = new Date("Dec 25, 2025 00:00:00").getTime();
    setInterval(() => {
        const now = new Date().getTime();
        const d = targetDate - now;
        
        if (d < 0) {
            document.getElementById("days").innerText = "00";
        } else {
            document.getElementById("days").innerText = Math.floor(d / (1000 * 60 * 60 * 24));
            document.getElementById("hours").innerText = Math.floor((d % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            document.getElementById("minutes").innerText = Math.floor((d % (1000 * 60 * 60)) / (1000 * 60));
            document.getElementById("seconds").innerText = Math.floor((d % (1000 * 60)) / 1000);
        }
    }, 1000);
}


/* =========================================
   4. CELEBRATION PAGE LOGIC
   ========================================= */
function imageLoaded(img) {
    const card = img.closest('.celebration-card');
    const skeleton = card.querySelector('.skeleton');
    if(skeleton) skeleton.style.display = 'none';
    card.classList.add('img-loaded');
}

function toggleLike(btn) {
    btn.classList.toggle('liked');
}

// Weather Simulation
if (document.querySelector('.weather-badge')) {
    document.querySelectorAll('.weather-badge').forEach(badge => {
        // Random temperature logic can be added here if dynamic data is passed
        // For now, it respects the HTML data (if any) or stays static
    });
}


/* =========================================
   5. WISHES PAGE LOGIC
   ========================================= */
const wishesDB = {
    joy: ["May your Christmas be filled with laughter! 🎉", "Eat, drink, and be merry! 🎸", "Ho! Ho! Ho! Santa is coming! 🎅", "Jingle all the way! 🔔"],
    grateful: ["Grateful for family and friends. 🙏", "Counting my blessings. Merry Christmas.", "God's love surround you. ✝️"],
    peace: ["Peace and joy to you. 🕊️", "Silent night, holy night.", "Relax and enjoy the magic. ❄️", "Tranquil vibes to you."]
};

function selectMood(mood) {
    document.querySelectorAll('.mood-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    const grid = document.getElementById('wishes-grid');
    if(!grid) return;
    
    const category = wishesDB[mood];
    const shuffled = category.sort(() => 0.5 - Math.random()).slice(0, 3);
    
    grid.innerHTML = ''; 
    shuffled.forEach((text, index) => {
        const col = document.createElement('div');
        col.className = 'col-md-4';
        col.innerHTML = `
            <div class="wish-display-card" style="transition-delay: ${index * 100}ms">
                <div class="wish-category"><i class="fas fa-star text-warning"></i> ${mood.toUpperCase()} VIBES</div>
                <p class="wish-text">"${text}"</p>
                <button class="btn btn-sm btn-outline-light rounded-pill" onclick="copyText(this, '${text}')">Copy</button>
            </div>`;
        grid.appendChild(col);
        setTimeout(() => { col.querySelector('.wish-display-card').classList.add('show'); }, 50);
    });
}

function copyText(btn, text) {
    navigator.clipboard.writeText(text);
    btn.innerText = "Copied!";
    setTimeout(() => btn.innerText = "Copy", 2000);
}

function postWish(e) {
    const nameInput = document.getElementById('user-name');
    const wishInput = document.getElementById('user-wish');
    const wall = document.getElementById('community-wall');
    
    if (!nameInput || !wishInput || !wall) return;

    const name = nameInput.value || "Anonymous";
    const wish = wishInput.value;

    if(!wish) {
        alert("Please type a wish first!");
        return;
    }

    // Sparkle Effect on Button
    const btn = e.target;
    const rect = btn.getBoundingClientRect();
    for(let i=0; i<10; i++) {
        const sparkle = document.createElement('div');
        sparkle.classList.add('sparkle'); // Needs CSS
        sparkle.style.left = rect.width/2 + 'px';
        sparkle.style.top = rect.height/2 + 'px';
        btn.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 800);
    }

    // Add to Wall (Top with Gold Border)
    const newCardHTML = `
        <div class="wall-card" style="border: 2px solid gold; box-shadow: 0 0 15px gold;">
            <h5 style="color: #fff;">${name} (You)</h5>
            <p>"${wish}"</p>
        </div>
    `;
    wall.insertAdjacentHTML('afterbegin', newCardHTML);

    // Reset Animation for Visibility
    wall.style.animation = 'none';
    wall.offsetHeight; /* Trigger reflow */
    wall.style.animation = 'autoScroll 30s linear infinite';

    wishInput.value = '';
    alert("Your wish is posted on the Wall! Look at the top! 🎄");
}

// Seamless Wall Scrolling Init
if (document.getElementById('community-wall')) {
    const wall = document.getElementById('community-wall');
    wall.innerHTML += wall.innerHTML; // Duplicate for seamless loop
}


/* =========================================
   6. SNAPZONE (CAMERA) LOGIC
   ========================================= */
const video = document.getElementById('camera-video');

// Only run camera logic if video element exists (SnapZone Page)
if (video) {
    let currentMode = 'classic';
    const canvas = document.getElementById('capture-canvas');
    const ctx = canvas.getContext('2d');
    const THEME_GOLD = '#bf953f';

    // Init Camera
    async function initCamera() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { width: { ideal: 3840 }, height: { ideal: 2160 }, facingMode: "user" } 
            });
            video.srcObject = stream;
            generateMessage();
        } catch (err) { console.log("Camera access needed"); }
    }
    initCamera();

    // Magic Messages
    const funMessages = ["Santa is watching! 🎅", "You look SLEIGH-in'! 🛷", "Naughty or Nice? 🤔", "Warning: Cuteness! 😍", "Elf Aura! 🧝", "Shine like a Star! ⭐"];
    function generateMessage() {
        const textBox = document.getElementById('magic-text');
        if(!textBox) return;
        const msg = funMessages[Math.floor(Math.random() * funMessages.length)];
        textBox.style.opacity = 0;
        setTimeout(() => { textBox.innerText = msg; textBox.style.opacity = 1; }, 300);
    }

    // Mode Switcher
    window.setMode = function(mode) {
        currentMode = mode;
        document.querySelectorAll('.mode-pill').forEach(p => p.classList.remove('active'));
        const btn = document.getElementById(`btn-${mode}`);
        if(btn) btn.classList.add('active');
        
        const frame = document.getElementById('asset-frame');
        const hat = document.getElementById('asset-hat');
        const input = document.getElementById('custom-input');

        if(frame) frame.style.display = 'none';
        if(hat) hat.style.display = 'none';
        if(input) input.style.display = 'none';
        
        if(mode === 'classic') {
            if(frame) frame.style.display = 'block';
            video.style.filter = "contrast(1.15) saturate(1.2)";
        } else if(mode === 'santa') {
            if(hat) hat.style.display = 'block';
            video.style.filter = "none";
        } else {
            if(input) input.style.display = 'block';
            video.style.filter = "contrast(1.2)";
        }
    };

    // Snap Photo Function
    window.snapPhoto = function() {
        const flash = document.getElementById('flash-overlay');
        if(flash) {
            flash.classList.remove('flash-active');
            void flash.offsetWidth; 
            flash.classList.add('flash-active');
        }
        
        const shutter = document.getElementById('shutter-sound');
        if(shutter) { shutter.currentTime = 0; shutter.play(); }
        
        generateMessage();

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
        ctx.restore();

        let caption = "Royal Christmas";
        let aiTag = "✨ Pure Magic";

        if(currentMode === 'classic') {
            ctx.strokeStyle = THEME_GOLD; ctx.lineWidth = 40; 
            ctx.strokeRect(0,0,canvas.width,canvas.height);
            ctx.font = `bold ${canvas.width*0.06}px 'Great Vibes'`;
            ctx.fillStyle = THEME_GOLD; ctx.textAlign = "center";
            ctx.shadowColor="black"; ctx.shadowBlur=15;
            ctx.fillText("Merry Christmas 2025", canvas.width/2, canvas.height-80);
            caption = "Royal Edition"; aiTag = "👑 Royal Aura Detected";
        } 
        else if (currentMode === 'santa') {
            /* ✅ SANTA HAT DRAWING LOGIC */
            const img = document.getElementById('asset-hat');
            if (img) {
                const w = canvas.width * 0.45;
                const h = w * 0.6;
                const x = (canvas.width / 2) - (w / 2);
                const y = 20;
                ctx.drawImage(img, x, y, w, h);
            }

            const statuses = ["NICE 😇", "NAUGHTY 😈", "SANTA'S FAV 🎅", "ELF 🧝", "GRINCH 💚"];
            const result = statuses[Math.floor(Math.random() * statuses.length)];
            
            ctx.font = `bold ${canvas.width*0.04}px 'Rajdhani'`;
            ctx.fillStyle = "#ff3333"; ctx.textAlign = "center";
            ctx.shadowColor = "white"; ctx.shadowBlur = 5;
            ctx.fillText(`AI SCAN: ${result}`, canvas.width/2, canvas.height-80);
            
            caption = "Santa AI Scan"; aiTag = result;
        }
        else if (currentMode === 'custom') {
            const input = document.getElementById('custom-input');
            const txt = (input && input.value) ? input.value : "My Wish";
            ctx.font = `italic ${canvas.width*0.05}px 'Playfair Display'`;
            ctx.fillStyle = "white"; ctx.textAlign = "center";
            ctx.shadowColor="black"; ctx.shadowBlur=10;
            ctx.fillText(txt, canvas.width/2, canvas.height-100);
            ctx.font = `${canvas.width*0.02}px 'Courier New'`;
            ctx.fillText("RAW 4K • 25.12.2025", canvas.width/2, canvas.height-50);
            caption = "Pro Custom"; aiTag = "📸 Perfect Exposure";
        }

        const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
        document.getElementById('final-image').src = dataUrl;
        document.getElementById('final-caption').innerText = caption;
        document.getElementById('ai-comment').innerText = aiTag;
        
        const dlBtn = document.getElementById('download-btn');
        if(dlBtn) {
            dlBtn.href = dataUrl;
            dlBtn.download = `Royal_Xmas_${Date.now()}.jpg`;
        }

        const modal = document.getElementById('preview-modal');
        if(modal) modal.style.display = 'flex';
        
        const printSound = document.getElementById('print-sound');
        if(printSound) { printSound.currentTime = 0; printSound.play(); }

        const polaroid = document.getElementById('polaroid-card');
        if(polaroid) {
            polaroid.classList.remove('develop');
            void polaroid.offsetWidth; 
            setTimeout(() => polaroid.classList.add('develop'), 100);
        }
    };

    window.closeModal = function() { 
        document.getElementById('preview-modal').style.display = 'none'; 
    };
}