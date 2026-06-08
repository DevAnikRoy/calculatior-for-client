const ordersSlider = document.getElementById('ordersSlider');
const picksSlider = document.getElementById('picksSlider');
const palletsSlider = document.getElementById('palletsSlider');

const ordersVal = document.getElementById('ordersVal');
const picksVal = document.getElementById('picksVal');
const palletsVal = document.getElementById('palletsVal');
const totalPriceDisplay = document.getElementById('totalPrice');
const skuButtons = document.querySelectorAll('.sku-btn');

const boxVideo = document.getElementById('dynamicBoxVideo');
const videoSource = document.getElementById('videoSource');

let currentSku = '<20';
let lastVideoSrc = ''; 

// জার্মান কারেন্সি ফরম্যাটের জন্য ফাংশন
function formatGermanNumber(num, decimal = false) {
  return num.toLocaleString('de-DE', decimal ? { minimumFractionDigits: 2, maximumFractionDigits: 2 } : {});
}

// স্লাইডার ট্র্যাক গ্রাডিয়েন্ট স্টাইল করার জন্য ফাংশন
function styleTrackGradient(slider) {
  const min = slider.min ? parseFloat(slider.min) : 0;
  const max = slider.max ? parseFloat(slider.max) : 100;
  const val = parseFloat(slider.value);
  const percentage = ((val - min) / (max - min)) * 100;
  
  slider.style.background = `linear-gradient(to right, #004bb3 0%, #3b82f6 ${percentage}%, #f3f4f6 ${percentage}%, #f3f4f6 100%)`;
}

// প্রাইস এবং ভিডিও রেন্ডার আপডেট ফাংশন
function updateCalculatorOutputs() {
  const currentOrders = parseInt(ordersSlider.value) || 0;
  const currentPicks = parseInt(picksSlider.value) || 0;
  const currentPallets = parseInt(palletsSlider.value) || 0;

  ordersVal.textContent = formatGermanNumber(currentOrders);
  picksVal.textContent = formatGermanNumber(currentPicks);
  palletsVal.textContent = formatGermanNumber(currentPallets);

  styleTrackGradient(ordersSlider);
  styleTrackGradient(picksSlider);
  styleTrackGradient(palletsSlider);

  // বেস প্রাইস লজিক
  let basePrice = 500; 
  if (currentSku === '<100') basePrice = 800;
  if (currentSku === '>100') basePrice = 1200;

  // ফাইনাল ক্যালকুলেশন ফর্মুলা
  let calculatedTotal = basePrice + (currentOrders * 1.2) + (currentPicks * 0.15) + (currentPallets * 15);
  totalPriceDisplay.textContent = formatGermanNumber(calculatedTotal, true);

  // ডাইনামিক ভিডিও সোর্স পরিবর্তনের লজিক
  let nextVideoSrc = 'Fly-fulfillment video 1.mp4'; 

  if (calculatedTotal > 35000 && calculatedTotal <= 65000) {
    nextVideoSrc = 'Fly-fulfillment video 2.mp4'; 
  } else if (calculatedTotal > 65000) {
    nextVideoSrc = 'Fly-fulfillment video 3.mp4'; 
  }

  // ভিডিও চেঞ্জ ও অটো-প্লে ট্রিগার
  if (videoSource && boxVideo && lastVideoSrc !== nextVideoSrc) {
    lastVideoSrc = nextVideoSrc;
    videoSource.setAttribute('src', nextVideoSrc);
    boxVideo.load();
    
    boxVideo.play().catch(error => {
      console.log("Autoplay context: ", error);
    });
  }
}

// SKU বাটন টগল হ্যান্ডলার
skuButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    skuButtons.forEach(b => {
      b.classList.remove('active');
      b.classList.add('inactive');
    });

    btn.classList.add('active');
    btn.classList.remove('inactive');

    currentSku = btn.getAttribute('data-value');
    updateCalculatorOutputs();
  });
});

// স্লাইডার ইনপুট লিসেনারস
ordersSlider.addEventListener('input', updateCalculatorOutputs);
picksSlider.addEventListener('input', updateCalculatorOutputs);
palletsSlider.addEventListener('input', updateCalculatorOutputs);

// ইনিশিয়াল লোড রান
updateCalculatorOutputs();