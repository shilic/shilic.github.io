function updateScrollProgress() {
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = (window.scrollY / scrollHeight) * 100 + '%';
  
  let indicator = document.querySelector('.vertical-scroll-indicator');
  if (!indicator) {
    indicator = document.createElement('div');
    indicator.className = 'vertical-scroll-indicator';
    document.body.appendChild(indicator);
  }
  
  indicator.style.setProperty('--scroll-percent', scrollPercent);
}

// 初始化
window.addEventListener('load', () => {
  updateScrollProgress();
  window.addEventListener('scroll', updateScrollProgress);
});