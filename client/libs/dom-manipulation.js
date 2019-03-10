export const openDialogue = (elm, f = () => {}) => {
  elm.className = 'opened';
  elm.classList.add('fade-in');
  let timeout = setTimeout(() => {
    clearTimeout(timeout);
    f(true);
  }, 302);
};

export const closeDialogue = (elm, f = () => {}) => {
  f(false);
  elm.classList.remove('fade-in');
  elm.classList.add('fade-out');
  let timeout = setTimeout(() => {
    elm.classList.remove('fade-out');
    elm.className = 'closed';
    clearTimeout(timeout);
  }, 302);
};