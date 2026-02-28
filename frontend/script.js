// Check if JS is working
console.log("JS is working!");

// Wait until page loads
document.addEventListener("DOMContentLoaded", function () {

  // =========================
  // 📌 UPLOAD NOTES SECTION
  // =========================
  const form = document.getElementById("uploadForm");

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      const subject = document.getElementById("subject").value;
      const description = document.getElementById("description").value;
      const fileInput = document.getElementById("file");

      const file = fileInput.files[0];

      if (!file) {
        alert("Please select a PDF file!");
        return;
      }

      // ⚠️ Limit file size (VERY IMPORTANT to avoid crash)
      if (file.size > 500000) { // 500KB limit
        alert("File too large! Please upload a file smaller than 500KB.");
        return;
      }

      const reader = new FileReader();

      reader.onload = function () {
        const fileData = reader.result;

        const note = {
          subject: subject,
          description: description,
          fileName: file.name,
          fileData: fileData
        };

        let notes = JSON.parse(localStorage.getItem("notes")) || [];

        notes.push(note);

        localStorage.setItem("notes", JSON.stringify(notes));

        alert("Note Uploaded Successfully!");

        form.reset();
      };

      reader.readAsDataURL(file);
    });
  }

  // =========================
  // 📌 VIEW NOTES SECTION
  // =========================
  const notesContainer = document.getElementById("notesContainer");

  if (notesContainer) {
    let notes = JSON.parse(localStorage.getItem("notes")) || [];

    if (notes.length === 0) {
      notesContainer.innerHTML = "<p>No notes uploaded yet.</p>";
    } else {
      notes.forEach(function (note, index) {

        const div = document.createElement("div");
        div.classList.add("note");

        div.innerHTML = `
          <h3>${note.subject}</h3>
          <p>${note.description}</p>

          <a href="${note.fileData}" download="${note.fileName}">
            Download PDF
          </a>

          <br><br>

          <button onclick="deleteNote(${index})">
            Delete
          </button>

          <hr>
        `;

        notesContainer.appendChild(div);
      });
    }
  }

});

// =========================
// 🗑️ DELETE FUNCTION
// =========================
function deleteNote(index) {
  let notes = JSON.parse(localStorage.getItem("notes")) || [];

  notes.splice(index, 1);

  localStorage.setItem("notes", JSON.stringify(notes));

  location.reload();
}