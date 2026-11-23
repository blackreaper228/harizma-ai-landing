const modelCards = document.querySelector('#model-cards');
const modelData = {
  text: [['ChatGPT', 'Идеи, тексты, анализ и программирование', 'chatgpt.svg'], ['Claude', 'Вдумчивая работа с текстом и документами', 'claude.svg']],
  images: [['Nano Banana', 'Создание и редактирование изображений', 'banana.svg'], ['ChatGPT', 'Визуальные идеи и иллюстрации', 'chatgpt.svg']],
  video: [['Kling', 'Видео по вашему описанию', 'banana.svg'], ['Veo', 'Сцены и ролики из идеи', 'chatgpt.svg']],
  audio: [['ElevenLabs', 'Озвучка и работа с голосом', 'claude.svg'], ['Музыка', 'Звуковые идеи и композиции', 'banana.svg']]
};
document.querySelectorAll('[data-model]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-model]').forEach(tab => tab.classList.toggle('active', tab === button));
  modelCards.replaceChildren(...modelData[button.dataset.model].map(([name, description, icon]) => {
    const card = document.createElement('article');
    const image = document.createElement('img'); image.src = `assets/${icon}`; image.alt = '';
    const heading = document.createElement('h3'); heading.textContent = name;
    const paragraph = document.createElement('p'); paragraph.textContent = description;
    card.append(image, heading, paragraph);
    return card;
  }));
}));
const agentTrack = document.querySelector('#agent-track');
document.querySelector('#agents-prev')?.addEventListener('click', () => agentTrack.scrollBy({left: -agentTrack.clientWidth * .55, behavior: 'smooth'}));
document.querySelector('#agents-next')?.addEventListener('click', () => agentTrack.scrollBy({left: agentTrack.clientWidth * .55, behavior: 'smooth'}));
document.querySelectorAll('[data-agent-filter]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-agent-filter]').forEach(tab => tab.classList.toggle('active', tab === button));
  agentTrack.scrollTo({left: button.dataset.agentFilter === 'work' ? agentTrack.scrollWidth : 0, behavior: 'smooth'});
}));
