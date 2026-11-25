const promptForm = document.querySelector('#prompt-box');
const promptInput = document.querySelector('#prompt-input');
const typedPrompt = document.querySelector('.typed-prompt');
const promptNote = document.querySelector('#prompt-note');

if (promptForm && promptInput && typedPrompt) {
  const prompts = [
    'Помоги придумать идею для нового проекта',
    'Подготовь меня к собеседованию',
    'Составь план изучения английского',
    'Преврати мою идею в яркое изображение'
  ];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let promptIndex = 0;
  let characterIndex = 0;
  let deleting = false;
  let timer;

  function tick() {
    if (document.activeElement === promptInput || promptInput.value || reducedMotion.matches) return;
    const phrase = Array.from(prompts[promptIndex]);
    characterIndex += deleting ? -1 : 1;
    typedPrompt.textContent = phrase.slice(0, characterIndex).join('');

    if (!deleting && characterIndex === phrase.length) {
      deleting = true;
      timer = window.setTimeout(tick, 1900);
    } else if (deleting && characterIndex === 0) {
      deleting = false;
      promptIndex = (promptIndex + 1) % prompts.length;
      timer = window.setTimeout(tick, 480);
    } else {
      timer = window.setTimeout(tick, deleting ? 34 : 72);
    }
  }

  if (reducedMotion.matches) typedPrompt.textContent = prompts[0];
  else timer = window.setTimeout(tick, 700);

  promptInput.addEventListener('focus', () => {
    window.clearTimeout(timer);
    promptForm.classList.add('is-focused');
  });
  promptInput.addEventListener('blur', () => {
    promptForm.classList.remove('is-focused');
    if (!promptInput.value && !reducedMotion.matches) timer = window.setTimeout(tick, 500);
  });
  promptInput.addEventListener('input', () => promptForm.classList.toggle('has-input', Boolean(promptInput.value)));
  promptForm.addEventListener('submit', event => {
    event.preventDefault();
    promptNote.textContent = 'Это демонстрация первого экрана. Отправка запросов появится после подключения сервиса.';
  });
}

const motionHero = document.querySelector('.studio-hero');
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');

const pageNav = document.querySelector('.figma-rebuild .nav');
if (pageNav) {
  const darkSections = document.querySelectorAll('.harizma-concept :is(.studio-hero, .f-models, .f-course, .f-final)');
  const updateNav = () => {
    const currentY = Math.max(0, window.scrollY);
    pageNav.classList.toggle('is-scrolled', currentY > 24);
    const sampleY = pageNav.getBoundingClientRect().bottom / 2;
    const isOnDark = [...darkSections].some(section => {
      const { top, bottom } = section.getBoundingClientRect();
      return top <= sampleY && bottom > sampleY;
    });
    pageNav.classList.toggle('is-on-light', !pageNav.closest('.concept-dark') && (darkSections.length
      ? !isOnDark
      : motionHero?.getBoundingClientRect().bottom <= pageNav.offsetHeight));
  };
  updateNav();
  window.addEventListener('scroll', updateNav, { passive: true });
}

if (motionHero && !motionPreference.matches) {
  motionHero.classList.add('motion-ready');
  const sleep = ms => new Promise(resolve => window.setTimeout(resolve, ms));
  // A shared ring spans the hero while leaving the heading and prompt clear.
  const orbit = [[.07,.2],[.3,.13],[.65,.13],[.9,.2],[.94,.4],[.93,.66],
    [.84,.85],[.57,.9],[.28,.89],[.07,.78],[.05,.55],[.05,.34]];
  const routes = [
    { cursor: '.cursor-one', start: 0, direction: 1, delay: 120, pace: 3.5, pauseEvery: 17 },
    { cursor: '.cursor-two', start: 4, direction: -1, delay: 430, pace: 3.9, pauseEvery: 19 },
    { cursor: '.cursor-three', start: 8, direction: 1, delay: 760, pace: 3.2, pauseEvery: 23 }
  ];
  const clearOfContent = (from, to) => {
    for (let i = 0; i <= 24; i++) {
      const t = i / 24;
      const x = from[0] + (to[0] - from[0]) * t;
      const y = from[1] + (to[1] - from[1]) * t;
      if (x > .23 && x < .77 && y > .24 && y < .76) return false;
    }
    return true;
  };

  async function runRoute(route) {
    const cursor = route.element || motionHero.querySelector(route.cursor);
    if (!cursor) return;
    let position = { x: 0, y: 0 };
    let leg = 0;
    await sleep(route.delay);

    while (cursor.isConnected && !route.expiring && !motionPreference.matches) {
      let targetIndex = route.start;
      let targetPoint = orbit[targetIndex];
      if (leg > 0) {
        let found = false;
        for (let attempt = 0; attempt < 12; attempt++) {
          const direction = Math.random() < .3 ? -route.direction : route.direction;
          const hops = 1 + Math.floor(Math.random() * 3);
          const index = (route.index + direction * hops + orbit.length * 2) % orbit.length;
          const point = orbit[index].map(value => value + (Math.random() - .5) * .025);
          const apart = routes.every(other => other === route || !other.point ||
            Math.hypot(point[0] - other.point[0], point[1] - other.point[1]) > .14);
          if (apart && clearOfContent(route.point, point)) {
            targetIndex = index;
            targetPoint = point;
            route.direction = direction;
            found = true;
            break;
          }
        }
        if (!found) {
          for (const direction of [route.direction, -route.direction]) {
            const index = (route.index + direction + orbit.length) % orbit.length;
            if (clearOfContent(route.point, orbit[index])) {
              targetIndex = index;
              targetPoint = orbit[index];
              route.direction = direction;
              break;
            }
          }
        }
      }
      const [xRatio, yRatio] = targetPoint;
        const desiredX = motionHero.clientWidth * xRatio - cursor.offsetWidth / 2 - cursor.offsetLeft;
        const desiredY = motionHero.clientHeight * yRatio - cursor.offsetTop;
        const next = {
          x: Math.max(10 - cursor.offsetLeft, Math.min(desiredX, motionHero.clientWidth - cursor.offsetLeft - cursor.offsetWidth - 10)),
          y: Math.max(80 - cursor.offsetTop, Math.min(desiredY, motionHero.clientHeight - cursor.offsetTop - cursor.offsetHeight - 12))
        };
        const dx = next.x - position.x;
        const dy = next.y - position.y;
        const distance = Math.hypot(dx, dy);
        const bend = Math.min(30, Math.max(8, distance * .1));
        const outward = ((position.x + next.x) / 2 + cursor.offsetLeft < motionHero.clientWidth / 2 ? -1 : 1);
        let middle = {
          x: (position.x + next.x) / 2 - dy / Math.max(distance, 1) * bend * outward,
          y: (position.y + next.y) / 2 + dx / Math.max(distance, 1) * bend * outward
        };
        const middleRatio = [(middle.x + cursor.offsetLeft + cursor.offsetWidth / 2) / motionHero.clientWidth,
          (middle.y + cursor.offsetTop) / motionHero.clientHeight];
        if (!clearOfContent(route.point || targetPoint, middleRatio) || !clearOfContent(middleRatio, targetPoint)) {
          middle = { x: (position.x + next.x) / 2, y: (position.y + next.y) / 2 };
        }
        const to = `translate(${next.x}px, ${next.y}px)`;
        const movement = cursor.animate([
          { transform: `translate(${position.x}px, ${position.y}px)` },
          { transform: `translate(${middle.x}px, ${middle.y}px)` },
          { transform: to }
        ], {
          duration: Math.max(1050, Math.min(2800, distance * route.pace)),
          easing: 'cubic-bezier(.35,.08,.65,.92)', fill: 'forwards'
        });
        route.movement = movement;
        try { await movement.finished; } catch { return; }
        if (route.expiring) return;
        cursor.style.transform = to;
        movement.cancel();
        route.movement = null;
        position = next;
        route.index = targetIndex;
        route.point = targetPoint;
        leg++;
        if (leg % route.pauseEvery === 0) await sleep(90 + (leg % 3) * 30);
    }
  }

  routes.forEach(runRoute);

  const guests = [
    { name: 'Gemini', icon: 'cursor-chatgpt.svg', color: '#8057e8' },
    { name: 'DeepSeek', icon: 'cursor-claude.svg', color: '#366bdc' },
    { name: 'Grok', icon: 'cursor-banana.svg', color: '#df477a' },
    { name: 'Perplexity', icon: 'cursor-chatgpt.svg', color: '#148f9a' },
    { name: 'Midjourney', icon: 'cursor-claude.svg', color: '#7354b8' },
    { name: 'FLUX', icon: 'cursor-banana.svg', color: '#e86a3e' },
    { name: 'Kling', icon: 'cursor-chatgpt.svg', color: '#4971d8' },
    { name: 'ElevenLabs', icon: 'cursor-claude.svg', color: '#bd397f' }
  ];
  let guestIndex = 0;

  function showClickBurst(x, y) {
    const burst = document.createElement('div');
    burst.className = 'cursor-burst';
    burst.setAttribute('aria-hidden', 'true');
    burst.style.left = `${x}px`;
    burst.style.top = `${y}px`;
    for (let i = 0; i < 8; i++) {
      const spark = document.createElement('i');
      spark.style.setProperty('--angle', `${i * 45 + Math.random() * 14 - 7}deg`);
      spark.style.setProperty('--distance', `${20 + Math.random() * 16}px`);
      burst.append(spark);
    }
    motionHero.append(burst);
    window.setTimeout(() => burst.remove(), 650);
  }

  motionHero.addEventListener('click', event => {
    if (event.button !== 0 || event.target.closest('a,button,input,textarea,.prompt-box,.agent-cursor')) return;
    const bounds = motionHero.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    const point = [x / bounds.width, y / bounds.height];
    showClickBurst(x, y);

    const guest = guests[guestIndex++ % guests.length];
    const cursor = document.createElement('div');
    cursor.className = 'agent-cursor cursor-guest';
    cursor.setAttribute('aria-hidden', 'true');
    cursor.style.left = `${Math.min(x, bounds.width - 110)}px`;
    cursor.style.top = `${Math.min(y, bounds.height - 40)}px`;
    cursor.style.setProperty('--cursor-accent', guest.color);
    const icon = document.createElement('img');
    icon.src = `assets/${guest.icon}`;
    icon.alt = '';
    const label = document.createElement('span');
    label.textContent = guest.name;
    const inner = document.createElement('div');
    inner.className = 'cursor-guest-inner';
    inner.append(icon, label);
    cursor.append(inner);
    motionHero.append(cursor);
    window.requestAnimationFrame(() => cursor.classList.add('is-visible'));

    const start = orbit.map((stop, index) => ({ index, distance: Math.hypot(stop[0] - point[0], stop[1] - point[1]), stop }))
      .filter(candidate => clearOfContent(point, candidate.stop))
      .sort((a, b) => a.distance - b.distance)[0]?.index ?? 0;
    const route = { element: cursor, start, direction: Math.random() < .5 ? -1 : 1,
      delay: 0, pace: 3.4 + Math.random() * .8, pauseEvery: 19, point };
    routes.push(route);
    runRoute(route);

    window.setTimeout(() => {
      route.expiring = true;
      if (route.movement) {
        cursor.style.transform = getComputedStyle(cursor).transform;
        route.movement.cancel();
        route.movement = null;
      }
      cursor.classList.add('is-expiring');
      routes.splice(routes.indexOf(route), 1);
      window.setTimeout(() => cursor.remove(), 420);
    }, 10000);
  });
}
