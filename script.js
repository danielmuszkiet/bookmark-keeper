const showModalBtn = document.getElementById("show-modal");
const closeModalBtn = document.getElementById("close-modal");
const modal = document.getElementById("modal");
const bookmarkForm = document.getElementById("bookmark-form");
const inputWebsiteName = document.getElementById("website-name");
const bookmarksContainer = document.getElementById("bookmarks-container");
let bookmarks = [];

function showModal() {
  modal.classList.add("show-modal");
  inputWebsiteName.focus();
}

function hideModal() {
  modal.classList.remove("show-modal");
  bookmarkForm.reset();
}

function inputIsValid(nameValue, urlValue) {
  const expression =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
  const regex = new RegExp(expression);
  if (!nameValue || !urlValue) {
    alert("Please submit values for both fields!");
    return false;
  }
  if (!urlValue.match(regex)) {
    alert("Please provide a valid web adress!");
    return false;
  }
  return true;
}

function deleteBookmark(url) {
  bookmarks.forEach((bm, index) => {
    if (bm.url === url) {
      bookmarks.splice(index, 1);
    }
  });

  // Update local storage
  localStorage.setItem("bmData", JSON.stringify(bookmarks));
  loadBookmarks();
}

//Build Bookmarks DOM
function buildBookmarks() {
  // Remove all bookmark elemnts
  bookmarksContainer.textContent = "";
  bookmarks.forEach((bMark) => {
    const { name, url } = bMark;
    // Item
    const item = document.createElement("div");
    item.classList.add("item");
    // Close Icon
    const closeIcon = document.createElement("i");
    closeIcon.classList.add("fa-solid", "fa-close");
    closeIcon.setAttribute("title", "Delete Bookmark");
    closeIcon.setAttribute("onclick", `deleteBookmark('${url}')`);
    // Favicon / Link Container
    const linkInfo = document.createElement("div");
    linkInfo.classList.add("name");
    // Favicon
    const favicon = document.createElement("img");
    favicon.setAttribute(
      "src",
      `https://www.google.com/s2/favicons?domain=${url}&sz=50`
    );
    favicon.setAttribute("alt", "Favicon");
    // Link
    const link = document.createElement("a");
    link.setAttribute("href", `${url}`);
    link.setAttribute("target", "_blank");
    link.textContent = name;

    // Append to bookmars container
    linkInfo.append(favicon, link);
    item.append(closeIcon, linkInfo);
    bookmarksContainer.appendChild(item);
  });
}

// Fetch Bookmarks from Storage
function loadBookmarks() {
  const bookmarksData = JSON.parse(localStorage.getItem("bmData"));
  if (bookmarksData) {
    bookmarks = bookmarksData;
  } else {
    // Add Default Bookmark
    bookmarks.push(
      { name: "Google", url: "https://www.google.de" },
      { name: "YouTube", url: "https://www.youtube.com" }
    );
    localStorage.setItem("bmData", JSON.stringify(bookmarks));
  }
  buildBookmarks();
}

function storeBookmark(e) {
  e.preventDefault();
  const formData = new FormData(bookmarkForm);
  const websiteName = formData.get("website-name");
  let websiteUrl = formData.get("website-url");

  if (!websiteUrl.includes("http://", "https://")) {
    websiteUrl = `https://${websiteUrl}`;
  }

  if (!inputIsValid(websiteName, websiteUrl)) {
    return false;
  }

  bookmarks.push({ name: websiteName, url: websiteUrl });
  localStorage.setItem("bmData", JSON.stringify(bookmarks));
  loadBookmarks(); // <---- Check if this is nessacary?
  bookmarkForm.reset();
  inputWebsiteName.focus();
}

// Event Listeners
showModalBtn.addEventListener("click", showModal);
closeModalBtn.addEventListener("click", hideModal);
window.addEventListener("click", (e) =>
  e.target === modal ? hideModal() : false
);
bookmarkForm.addEventListener("submit", storeBookmark);
// On Load Fetch Bookmarks
loadBookmarks();
