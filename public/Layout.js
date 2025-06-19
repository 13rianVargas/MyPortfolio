function toggleLang() {
  const label = document.getElementById('lang-label');
  if (label.textContent === 'ES') {
    label.textContent = 'EN';
  } else {
    label.textContent = 'ES';
  }
}

function toggleDark() {
  document.body.classList.toggle('dark');
  document.body.classList.toggle('bg-gray-950');
  document.body.classList.toggle('text-white');
  document.body.classList.toggle('bg-white');
  document.body.classList.toggle('text-gray-900');
}

window.toggleLang = toggleLang;
window.toggleDark = toggleDark;
