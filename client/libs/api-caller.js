export const fetchBooks = url => {
  return fetch(url)
    .then(res => {
      if (!res.ok) return Promise.reject(res.status); // to handle
      return res.json();
    })
    .then(res => res)
    .catch(err => {}) // to handle
};
