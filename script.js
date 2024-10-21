const pieces = document.querySelectorAll('.piece');
const zones = document.querySelectorAll('.drop-zone');
const checkButton = document.getElementById('check-button');
const popup = document.getElementById('popup');
const popupMessage = document.getElementById('popup-message');
const closePopup = document.getElementById('close-popup');

let draggedPiece = null;
let originalPosition = { left: 0, top: 0 };

// دعم السحب والإفلات باستخدام الماوس واللمس
pieces.forEach(piece => {
  piece.addEventListener('dragstart', dragStart);
  piece.addEventListener('dragend', dragEnd);
  piece.addEventListener('touchstart', touchStart);
  piece.addEventListener('touchmove', touchMove);
  piece.addEventListener('touchend', touchEnd);
});

zones.forEach(zone => {
  zone.addEventListener('dragover', dragOver);
  zone.addEventListener('drop', dropPiece);
  zone.addEventListener('touchmove', allowTouchMove);
  zone.addEventListener('touchend', dropPieceOnTouch);
});

function dragStart() {
  draggedPiece = this;
  originalPosition.left = draggedPiece.offsetLeft;
  originalPosition.top = draggedPiece.offsetTop;
}

function dragEnd() {
  draggedPiece = null;
}

function dragOver(e) {
  e.preventDefault();
}

function dropPiece() {
  if (!this.hasChildNodes()) {
    this.appendChild(draggedPiece);
  }
}

function touchStart(e) {
  draggedPiece = this;
  originalPosition.left = draggedPiece.offsetLeft;
  originalPosition.top = draggedPiece.offsetTop;
  e.preventDefault();
}

function touchMove(e) {
  const touch = e.touches[0];
  draggedPiece.style.position = 'absolute';
  draggedPiece.style.left = `${touch.clientX - 35}px`; // استخدام نصف حجم القطعة لتحريكها بشكل صحيح
  draggedPiece.style.top = `${touch.clientY - 35}px`; // استخدام نصف حجم القطعة لتحريكها بشكل صحيح
  e.preventDefault();
}

function touchEnd(e) {
  const zoneDropped = checkZoneDropped(e.changedTouches[0]);

  if (zoneDropped) {
    zoneDropped.appendChild(draggedPiece);
  } else {
    draggedPiece.style.position = 'static';
    draggedPiece.style.left = `${originalPosition.left}px`;
    draggedPiece.style.top = `${originalPosition.top}px`;
  }

  draggedPiece = null;
}

function checkZoneDropped(touch) {
  let foundZone = null;
  zones.forEach(zone => {
    const zoneRect = zone.getBoundingClientRect();
    if (touch.clientX > zoneRect.left && touch.clientX < zoneRect.right && 
        touch.clientY > zoneRect.top && touch.clientY < zoneRect.bottom) {
      foundZone = zone;
    }
  });
  return foundZone;
}

function allowTouchMove(e) {
  e.preventDefault();
}

// تحقق من صحة تجميع البازل
checkButton.addEventListener('click', () => {
  let correct = true;

  zones.forEach((zone, index) => {
    const piece = zone.querySelector('img');
    if (piece && piece.id !== `piece-${index + 1}`) {
      correct = false;
    }
  });

  if (correct) {
    showPopup("You won! 🏆<br>Get ready for the 'Learn How to Learn' session!<br>Prepare for cinema surprises! 🎬");
  } else {
    showPopup("Try again! 😔");
  }
});

function showPopup(message) {
  popupMessage.innerHTML = message;
  popup.classList.remove('hidden');
}

closePopup.addEventListener('click', () => {
  popup.classList.add('hidden');
});
