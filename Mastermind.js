var card1=document.getElementById('card1')
var btns=document.querySelector('.btns')
var type = document.getElementById('type')
type.addEventListener('click', () => {
    location.reload();
})

// ۱. تنظیمات اولیه
const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
let secretCode = [];
let timerInterval;
let startTime;

// دریافت بهترین رکورد از localStorage
let bestTime = localStorage.getItem('bestTime') || Infinity;

// ۲. لود اولیه صفحه
// window.onload = () => {
//     const recordDisplay = document.getElementById('best-record');
//     if (bestTime !== Infinity) {
//         // اگر رکورد عدد بود، آن را نمایش بده، در غیر این صورت علامت --
//         recordDisplay.innerText = bestTime + " ثانیه";
//     } else {
//         recordDisplay.innerText = "--";
//     }
// };

// ۳. تابع تغییر رنگ (برای اسلات‌های حدس کاربر)
function changeColor(index) {
    const el = document.getElementById(`g${index}`);

    // گرفتن رنگ فعلی (اگر اول بازی است که خاکستری یا خالی است)
    let currentColor = el.style.backgroundColor;

    // تبدیل رنگ به نام ساده برای پیدا کردن ایندکس در آرایه
    // چون مرورگر رنگ را به صورت rgb برمی‌گرداند، از یک روش هوشمندانه استفاده می‌کنیم
    let currentIndex = -1;

    // چک می‌کنیم چه رنگی در حال حاضر روی المان هست
    // ما از تابع کمکی استفاده می‌کنیم تا نام رنگ را بفهمیم
    for (let i = 0; i < colors.length; i++) {
        if (isColorMatch(el.style.backgroundColor, colors[i])) {
            currentIndex = i;
            break;
        }
    }

    // حرکت به رنگ بعدی
    let nextIndex = (currentIndex + 1) % colors.length;
    el.style.backgroundColor = colors[nextIndex];
}

// تابع کمکی برای مقایسه دقیق رنگ (RGB vs Name)
function isColorMatch(bgColor, colorName) {
    if (!bgColor || bgColor === "") return false;
    const temp = document.createElement("div");
    temp.style.color = colorName;
    document.body.appendChild(temp);
    const rgbColor = window.getComputedStyle(temp).color;
    document.body.removeChild(temp);

    // مقایسه رنگ فعلی المان با رنگ RGB تولید شده از نام
    const targetTemp = document.createElement("div");
    targetTemp.style.color = bgColor;
    document.body.appendChild(targetTemp);
    const currentRgb = window.getComputedStyle(targetTemp).color;
    document.body.removeChild(targetTemp);

    return rgbColor === currentRgb;
}

// ۴. تابع شروع بازی جدید
function startNewGame() {
    // تولید کد مخفی ۴ رنگی
    secretCode = [];
    for (let i = 0; i < 4; i++) {
        secretCode.push(colors[Math.floor(Math.random() * colors.length)]);
    }
    console.log("Secret Code:", secretCode); // برای تست در کنسول

    // ریست کردن اسلات‌های نمایش نتیجه (s0 تا s3)
    for (let i = 0; i < 4; i++) {
        let sEl = document.getElementById(`s${i}`);
        sEl.classList.add('hidden'); // مخفی کردن مربع‌های بالا
        sEl.style.backgroundColor = 'transparent';
    }

    // ریست کردن اسلات‌های حدس کاربر (g0 تا g3)
    for (let i = 0; i < 4; i++) {
        let gEl = document.getElementById(`g${i}`);
        gEl.style.backgroundColor = 'gray'; // رنگ اولیه خاکستری
    }

    // مدیریت نمایش UI (نمایش کانتینر بازی و مخفی کردن دکمه شروع)
    document.getElementById('all').style.display = 'block';
    document.getElementById('start').style.display = 'none';
    document.getElementById('type').style.display = 'block';

    // شروع تایمر
    clearInterval(timerInterval);
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 1000);

    btns.style.display = 'ruby'
    card1.style.display = 'none'

    
}

// ۵. تابع آپدیت تایمر
function updateTimer() {
    const diff = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(diff / 60).toString().padStart(2, '0');
    const seconds = (diff % 60).toString().padStart(2, '0');

    const timerDisplay = document.getElementById('timer');
    if (timerDisplay) {
        timerDisplay.innerText = `${minutes}:${seconds}`;
    }
}

// ۶. تابع بررسی حدس (checkGuess)
function checkGuess() {
    let win = true;

    for (let i = 0; i < 4; i++) {
        const gEl = document.getElementById(`g${i}`);
        const sEl = document.getElementById(`s${i}`);

        // پیدا کردن نام رنگی که کاربر انتخاب کرده
        let userColorName = "";
        for (let c of colors) {
            if (isColorMatch(gEl.style.backgroundColor, c)) {
                userColorName = c;
                break;
            }
        }

        // اگر رنگ درست بود، اسلات بالا را رنگ کن و اگر اشتباه بود، win را false کن
        if (userColorName === secretCode[i]) {
            sEl.style.backgroundColor = secretCode[i];
            sEl.classList.remove('hidden');
        } else {
            sEl.style.backgroundColor = 'rgba(255,0,0,0.3)'; // قرمز کمرنگ برای خطا
            sEl.classList.remove('hidden');
            win = false;
        }
    }

    if (win) {
        handleWin();
    }
}

// ۷. مدیریت پیروزی
function handleWin() {
    clearInterval(timerInterval);
    const finalTime = Math.floor((Date.now() - startTime) / 1000);

    // ثبت رکورد در localStorage
    if (finalTime < bestTime) {
        bestTime = finalTime;
        localStorage.setItem('bestTime', bestTime);
        document.getElementById('best-record').innerText = bestTime + " ثانیه";
    }

    // پخش صدای پیروزی (اگر فایل داشته باشی)
    const audio = new Audio('win.mp3');
    audio.play().catch(() => { });

    setTimeout(() => {
        alert(`تبریک! پیروز شدی!\nزمان شما: ${finalTime} ثانیه`);
        // startNewGame();
    }, 200);
}
var card=document.getElementById('card')
// ۸. گوش دادن به کلیک‌ها (Event Listeners)
document.getElementById('card').addEventListener('click', startNewGame);
document.getElementById('btn2').addEventListener('click', startNewGame);
