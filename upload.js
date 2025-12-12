function uploadReport() {
  const status = document.getElementById("uploadStatus");
  const fileInput = document.getElementById("reportFile");
  const file = fileInput.files[0];

  if (!file) return (status.textContent = "Choose a file first.");

  const user = firebase.auth().currentUser;
  if (!user) return (window.location.href = "index.html");

  // Folder per user
  const path = `creditReports/${user.uid}/${Date.now()}_${file.name}`;
  const storageRef = firebase.storage().ref().child(path);

  status.textContent = "Uploading…";

  storageRef.put(file)
    .then(snapshot => snapshot.ref.getDownloadURL())
    .then(url => {
      // Save metadata to Firestore
      return firebase.firestore().collection("uploads").add({
        uid: user.uid,
        email: user.email,
        fileName: file.name,
        storagePath: path,
        downloadURL: url,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    })
    .then(() => {
      status.textContent = "✅ Upload complete!";
      fileInput.value = "";
    })
    .catch(err => {
      console.error(err);
      status.textContent = "❌ Upload failed: " + err.message;
    });
}
