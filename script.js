//^ Selection of the elements
const form = document.querySelector(".add-note");
const headingInput = document.querySelector("#noteHeading");
const detailsInput = document.querySelector("#noteDetails");
const addNoteBtn = document.querySelector(".add-note-btn");
const noteContainer = document.querySelector(".noteContainer");

//* All notes array
let notes = JSON.parse(localStorage.getItem("myNotes")) || [];
let isEditingId = null;


//* Toast helper function
function showToast(text, bgColor) {
  Toastify({
    text,
    duration: 3000,
    gravity: "top",
    position: "center",
    style: { background: bgColor },
  }).showToast();
}


//* Save to localStorage
function saveNotes() {
  localStorage.setItem("myNotes", JSON.stringify(notes));
}


//* Validate inputs
function validateInputs() {
  const heading = headingInput.value.trim();
  const details = detailsInput.value.trim();

  if (!heading || !details) {
    showToast("Heading and details cannot be empty!", "#dbcb23");
    return false;
  }

  if (heading.length > 20) {
    alert("Heading should be max 20 characters");
    return false;
  }

  if (details.length > 200) {
    alert("Details should be max 200 characters");
    return false;
  }

  return true;
}


//* Add note function
function addNote() {
  const newNote = {
    id: Date.now(),
    heading: headingInput.value.trim(),
    details: detailsInput.value.trim(),
  };

  notes.unshift(newNote);
  saveNotes();
  showToast("Note added successfully!", "#0d9920");
}


//* Edit note function
function editNoteFunc() {
  notes = notes.map(note =>
    note.id === isEditingId
      ? { ...note, heading: headingInput.value.trim(), details: detailsInput.value.trim() }
      : note
  );

  isEditingId = null;
  addNoteBtn.textContent = "Add note";
  saveNotes();
  showToast("Note updated successfully!", "#374af2");
}


//* Render notes function
function renderNotes() {
  noteContainer.innerHTML = "";

  if (notes.length === 0) {
    noteContainer.innerHTML = `<p class="emptyMsg">No notes yet. Add your first note ✍️</p>`;
    return;
  }

  notes.forEach(note => {
    noteContainer.innerHTML += `
      <div class="note-card" data-id="${note.id}">
        <h2 class="note-heading-data">${note.heading}</h2>
        <p class="note-details-data">${note.details}</p>
        <div class="note-btn-sec">
          <button class="edit-btn">Edit</button>
          <button class="delete-btn">Delete</button>
        </div>
      </div>
    `;
  });
}


//* Delete note function
function deleteNoteFun(id) {
  notes = notes.filter(note => note.id !== id);
  saveNotes();
  renderNotes();
  showToast("Note deleted successfully!", "#e50b0b");
}


//* Form submit event
form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!validateInputs()) return;

  if (isEditingId) {
    editNoteFunc();
  } else {
    addNote();
  }

  renderNotes();
  form.reset();
});


//* Event delegation for edit & delete
noteContainer.addEventListener("click", (e) => {
  const card = e.target.closest(".note-card");
  if (!card) return;

  const noteId = Number(card.dataset.id);

  if (e.target.classList.contains("edit-btn")) {
    const noteToEdit = notes.find(note => note.id === noteId);
    headingInput.value = noteToEdit.heading;
    detailsInput.value = noteToEdit.details;

    isEditingId = noteId;
    addNoteBtn.textContent = "Update note";
  }

  if (e.target.classList.contains("delete-btn")) {
    deleteNoteFun(noteId);
  }
});


// Initial render
renderNotes();
