document.addEventListener("DOMContentLoaded", function() {
    const timerDisplay = document.getElementById("timer");
    const startBtn = document.getElementById("startBtn");
    const pauseBtn = document.getElementById("pauseBtn");
    const resetBtn = document.getElementById("resetBtn");
    const message = document.getElementById("message");
    const images = ["images/city.png", "images/focus.png", "images/break.png"];
images.forEach(src => {
    const img = new Image();
    img.src = src;
});
    // Sons
    const debut = new Audio('sounds/ding.mp3');   
    const millieux = new Audio('sounds/chargevegeta.wav');   
    const repos = new Audio('sounds/minecraft.mp3');

    let time = 10; 
    let interval = null;
    let phase = "prepare"; // "prepare", "focus", "break"
    let isPaused = false;

    function updateDisplay() {
        let minutes = Math.floor(time / 60);
        let seconds = time % 60;
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    // Nouvelle fonction : gérer les transitions
    function setPhase(newPhase, newTime, bgImage, msg, sound) {
        phase = newPhase;
        time = newTime;
    
        const overlay = document.getElementById('bg-overlay');
        overlay.style.opacity = 0;
        setTimeout(() => {
            overlay.style.background = `url('${bgImage}') center/cover no-repeat`;
            overlay.style.opacity = 1;
        }, 200);
    
        message.textContent = msg;
        message.style.opacity = 0;
        setTimeout(() => { message.style.opacity = 1; }, 50);
        if (sound) sound.play();
        updateDisplay();
    }
    
    

    function tick() {
        if (time > 0) {
            time--;
            updateDisplay();
        } else {
            clearInterval(interval);

            if (phase === "prepare") {
                setPhase("focus", 1500, "images/focus.png", "Focus time! Get back to work!", millieux);
            } else if (phase === "focus") {
                setPhase("break", 300, "images/break.png", "Chill now, drink water, walk a bit.", repos);
            } else {
                setPhase("focus", 1500, "images/focus.png", "Focus time again!", debut);
            }
            

            interval = setInterval(tick, 1000);
        }
    }

    // Pause
    pauseBtn.addEventListener("click", function() {
        if (!interval && !isPaused) return;

        if (!isPaused) {
            clearInterval(interval);
            interval = null;
            pauseBtn.textContent = "Reprendre";
            isPaused = true;
        } else {
            interval = setInterval(tick, 1000);
            pauseBtn.textContent = "Pause";
            isPaused = false;
        }
    });

  
        // Start
        startBtn.addEventListener("click", function() {
            if (interval) return; 
            debut.play().catch(() => {});
            interval = setInterval(tick, 1000);
        });
    
        // Reset
        resetBtn.addEventListener("click", function() {
            clearInterval(interval);
            interval = null;
            setPhase("prepare", 1500, "radial-gradient(circle, #A0522D 0%, #3E2723 100%)", "Prépare-toi, ça va commencer !", null);
            pauseBtn.textContent = "Pause";
            isPaused = false;
        });
    
        updateDisplay(); 
    });
    
