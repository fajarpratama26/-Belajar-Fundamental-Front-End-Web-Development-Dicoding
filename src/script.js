class AppBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        header {
          background: #6200ea;
          color: white;
          text-align: center;
          padding: 15px;
          font-size: 1.5rem;
        }
      </style>
      <header>Notes App</header>
    `;
  }
}
customElements.define('app-bar', AppBar);

class NoteForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        form {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        input, textarea, button {
          padding: 10px;
          font-size: 16px;
        }
      </style>
      <form id="noteForm">
        <input type="text" id="title" placeholder="Judul Catatan" required>
        <textarea id="body" placeholder="Isi Catatan" required></textarea>
        <button type="submit">Tambah Catatan</button>
      </form>
    `;
  }

  connectedCallback() {
    this.shadowRoot.querySelector('#noteForm').addEventListener('submit', this.addNote.bind(this));
  }

  async addNote(event) {
    event.preventDefault();
    const title = this.shadowRoot.querySelector('#title').value;
    const body = this.shadowRoot.querySelector('#body').value;
    const loader = document.getElementById('loader'); // Panggil loader dengan ID

    if (title && body) {
      try {
        loader.style.display = 'block'; // Tampilkan loader sebelum fetch
        const response = await fetch('https://notes-api.dicoding.dev/v2/notes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, body }),
        });
        const result = await response.json();
        if (result.status === 'success') {
          fetchNotes();
        }
      } catch (error) {
        console.error('Gagal menambahkan catatan:', error);
      } finally {
        loader.style.display = 'none'; // Sembunyikan loader setelah selesai
      }
      this.shadowRoot.querySelector('#noteForm').reset();
    }
  }
}
customElements.define('note-form', NoteForm);

class NoteItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  set note(data) {
    this.shadowRoot.innerHTML = `
      <style>
        .note-card {
          background: white;
          padding: 15px;
          border-radius: 8px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
          margin-bottom: 10px;
        }
        .note-card h3 {
          margin: 0 0 10px;
        }
        .note-card p {
          margin: 0 0 10px;
        }
        .note-card small {
          color: gray;
        }
        .delete-btn {
          background: red;
          color: white;
          padding: 5px 10px;
          border: none;
          cursor: pointer;
        }
      </style>
      <div class="note-card">
        <h3>${data.title}</h3>
        <p>${data.body}</p>
        <small>${new Date(data.createdAt).toLocaleString('id-ID')}</small>
        <button class="delete-btn">Hapus</button>
      </div>
    `;
    this.shadowRoot.querySelector('.delete-btn').addEventListener('click', () => {
      deleteNote(data.id);
    });
  }
}
customElements.define('note-item', NoteItem);

async function fetchNotes() {
  const loader = document.getElementById('loader'); // Panggil loader dengan ID
  try {
    loader.style.display = 'block'; // Tampilkan loader sebelum fetch
    const response = await fetch('https://notes-api.dicoding.dev/v2/notes');
    const result = await response.json();
    if (result.status === 'success') {
      displayNotes(result.data);
    }
  } catch (error) {
    console.error('Gagal mengambil catatan:', error);
  } finally {
    loader.style.display = 'none'; // Sembunyikan loader setelah selesai
  }
}

function displayNotes(notes) {
  const notesList = document.getElementById('notesList');
  if (!notesList) return;
  notesList.innerHTML = '';

  notes.forEach((note) => {
    const noteElement = document.createElement('note-item');
    noteElement.note = note;
    notesList.appendChild(noteElement);
  });
}

async function deleteNote(id) {
  const loader = document.getElementById('loader'); // Panggil loader dengan ID
  try {
    loader.style.display = 'block'; // Tampilkan loader sebelum fetch
    await fetch(`https://notes-api.dicoding.dev/v2/notes/${id}`, {
      method: 'DELETE',
    });
    fetchNotes();
  } catch (error) {
    console.error('Gagal menghapus catatan:', error);
  } finally {
    loader.style.display = 'none'; // Sembunyikan loader setelah selesai
  }
}

document.addEventListener('DOMContentLoaded', fetchNotes);
