const modelCards = document.querySelector('#model-cards');
const modelData = {
  text: [['ChatGPT', 'Идеи, тексты, анализ и программирование', 'model-chatgpt.webp'], ['Claude', 'Вдумчивая работа с текстом и документами', 'model-claude.webp']],
  images: [['Nano Banana', 'Создание и редактирование изображений', 'banana.svg'], ['ChatGPT', 'Визуальные идеи и иллюстрации', 'model-chatgpt.webp']],
  video: [['Kling', 'Видео по вашему описанию', 'banana.svg'], ['Veo', 'Сцены и ролики из идеи', 'model-chatgpt.webp']],
  audio: [['ElevenLabs', 'Озвучка и работа с голосом', 'claude.svg'], ['Музыка', 'Звуковые идеи и композиции', 'banana.svg']]
};
document.querySelectorAll('[data-model]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-model]').forEach(tab => {
    tab.classList.toggle('active', tab === button);
    if (tab.hasAttribute('aria-pressed')) tab.setAttribute('aria-pressed', String(tab === button));
  });
  modelCards.replaceChildren(...modelData[button.dataset.model].map(([name, description, icon]) => {
    const card = document.createElement('article');
    const image = document.createElement('img'); image.src = `assets/${icon}`; image.alt = '';
    const heading = document.createElement('h3'); heading.textContent = name;
    const paragraph = document.createElement('p'); paragraph.textContent = description;
    if (icon.endsWith('.webp')) {
      const frame = document.createElement('span');
      frame.className = `f-model-icon ${icon.replace('.webp', '')}`;
      frame.append(image);
      card.append(frame);
    } else {
      card.append(image);
    }
    card.append(heading, paragraph);
    return card;
  }));
}));
const agentTrack = document.querySelector('#agent-track');
document.querySelector('#agents-prev')?.addEventListener('click', () => agentTrack.scrollBy({left: -agentTrack.clientWidth * .55, behavior: 'smooth'}));
document.querySelector('#agents-next')?.addEventListener('click', () => agentTrack.scrollBy({left: agentTrack.clientWidth * .55, behavior: 'smooth'}));
document.querySelectorAll('[data-agent-filter]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-agent-filter]').forEach(tab => {
    tab.classList.toggle('active', tab === button);
    if (tab.hasAttribute('aria-pressed')) tab.setAttribute('aria-pressed', String(tab === button));
  });
  agentTrack.scrollTo({left: button.dataset.agentFilter === 'work' ? agentTrack.scrollWidth : 0, behavior: 'smooth'});
}));
