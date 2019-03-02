export const fetchBooks = url => {
  return fetch(url)
    .then(res => {
      if (!res.ok) return Promise.reject(res.status); // to handle
      return res.json();
    })
    .then(res => res)
    .catch(err => {}); // to handle
};

export const fetchNewBook = (url, title) => {
  const initObject = { // think about adding more headers
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title })
  };

  return fetch(url, initObject)
    .then(res => {
      if (!res.ok) return Promise.reject(res.status); // to handle
      return res.json();
    })
    .then(res => res)
    .catch(err => {}); // to handle
};