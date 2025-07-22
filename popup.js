document.addEventListener('DOMContentLoaded', () => {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.scripting.executeScript({
      target: {tabId: tabs[0].id},
      func: extractAudioLinks
    }, (results) => {
      const linksContainer = document.getElementById('audio-links');
      const status = document.getElementById('status');
      
      if (results[0].result.length === 0) {
        status.textContent = 'Nenhuma tag de áudio encontrada!';
        return;
      }
      
      status.textContent = '';
      results[0].result.forEach(url => {
        const linkDiv = document.createElement('div');
        linkDiv.className = 'link-item';
        
        const linkText = document.createElement('a');
        linkText.href = url;
        linkText.textContent = url;
        linkText.target = '_blank';
        linkText.style.display = 'block';
        linkText.style.marginBottom = '5px';
        
        const copyBtn = document.createElement('button');
        copyBtn.textContent = 'Copiar URL';
        copyBtn.className = 'copy-btn';
        copyBtn.onclick = () => {
          navigator.clipboard.writeText(url);
          copyBtn.textContent = 'Copiado!';
          setTimeout(() => copyBtn.textContent = 'Copiar URL', 1500);
        };
        
        linkDiv.appendChild(linkText);
        linkDiv.appendChild(copyBtn);
        linksContainer.appendChild(linkDiv);
      });
    });
  });
});

function extractAudioLinks() {
  return Array.from(document.querySelectorAll('audio'))
    .map(audio => audio.src)
    .filter(src => src !== '');
}