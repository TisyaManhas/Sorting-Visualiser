const barsContainer = document.getElementById('barsContainer');
let bars = [];
let delay = 50; // Initial speed
let isPaused = false; // To track if sorting is paused
let pausePromiseResolve; // To resolve the pause promise

const context = new (window.AudioContext || window.webkitAudioContext)(); // Create audio context

// Function to play joyful sound
function playSound() {
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, context.currentTime); // Base frequency (A4)
    
    // Modulate the frequency to create a joyful melody
    oscillator.frequency.linearRampToValueAtTime(880, context.currentTime + 0.1); // Ramp up to A5
    
    // Create a short beep sound
    gainNode.gain.setValueAtTime(1, context.currentTime); // Full volume
    gainNode.gain.linearRampToValueAtTime(0, context.currentTime + 0.1); // Fade out quickly
    
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    
    oscillator.start();
    oscillator.stop(context.currentTime + 0.1); // Stop after 0.1 seconds
}

async function bubbleSort() {
    const len = bars.length;

    for (let i = 0; i < len; i++) {
        for (let j = 0; j < len - i - 1; j++) {
            await handlePause(); // Check if sorting is paused

            bars[j].classList.add('active');
            bars[j + 1].classList.add('active');

            await new Promise(resolve => setTimeout(resolve, delay));

            const height1 = parseInt(bars[j].style.height);
            const height2 = parseInt(bars[j + 1].style.height);

            if (height1 > height2) {
                // Play joyful sound
                playSound();

                // Swap bars
                bars[j].style.height = `${height2}px`;
                bars[j + 1].style.height = `${height1}px`;
            }

            // Remove active class after comparison, unless paused
            if (!isPaused) {
                bars[j].classList.remove('active');
                bars[j + 1].classList.remove('active');
            }
        }

        // Add sorted class after inner loop completes
        bars[len - i - 1].classList.add('sorted');
    }
}

function pauseSort() {
    isPaused = true;
}

function resumeSort() {
    isPaused = false;
    if (pausePromiseResolve) {
        pausePromiseResolve();
        pausePromiseResolve = null; // Reset the resolver after resuming
    }
    // Remove 'active' class from all bars when resuming
    bars.forEach(bar => bar.classList.remove('active'));
}

function slowDown() {
    delay += 50; // Increase delay to slow down the sorting
}

function speedUp() {
    if (delay > 50) delay -= 50; // Decrease delay to speed up the sorting
}

async function handlePause() {
    if (isPaused) {
        // Keep active class on bars while paused
        await new Promise(resolve => pausePromiseResolve = resolve);
    }
}

function generateBars(num = 50) {
    barsContainer.innerHTML = '';
    bars = [];

    for (let i = 0; i < num; i++) {
        const bar = document.createElement('div');
        bar.classList.add('bar');
        bar.style.height = `${Math.floor(Math.random() * 300) + 10}px`;
        barsContainer.appendChild(bar);
        bars.push(bar);
    }
}

// Initial array generation
generateBars();
