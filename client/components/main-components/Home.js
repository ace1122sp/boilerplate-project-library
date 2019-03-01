import React from 'react';
import EmptyLibrary from '../helper-components/EmptyLibrary';

const Home = () => 
  <main>
    <section id='book-list'>
      <EmptyLibrary />
    </section>
    <aside id='controls-main'>
      <button id='add-book'>
        add book
      </button>
      <button id='delete-all'>
        delete all
      </button>
    </aside>
  </main>

export default Home;