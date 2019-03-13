export const fetchBooks = url => {
  return fetch(url)
    .then(res => {
      if (!res.ok) return Promise.reject(res.status); 
      return res.json();
    })
    .then(res => res)
    .catch(err => {
      throw err;
    });
};

export const fetchNewBook = (url, title) => {
  const initObject = { 
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title })
  };

  return fetch(url, initObject)
    .then(res => {
      if (!res.ok) return Promise.reject(res.status);
      return res.json();
    })
    .then(res => res)
    .catch(err => {
      throw err;
    }); 
};

export const fetchDeleteBooks = url => {
  const initObject = {
    method: 'DELETE'
  };

  return fetch(url, initObject)
    .then(res => {
      if (!res.ok) return Promise.reject(res.status); 
      return res.json();
    })
    .then(res => res)
    .catch(err => {
      throw err;
    });
};

export const fetchComment = (url, comment) => {
  const initObject = {
    method: 'POST', 
    headers: { 'Content-Type': 'application/json' }, 
    body: JSON.stringify({ comment })
  };

  return fetch(url, initObject)
    .then(res => {
      if (!res.ok) return Promise.reject(res.status); 
    })
    .then(res => res)
    .catch(err => {
      throw err;
    }); 
};