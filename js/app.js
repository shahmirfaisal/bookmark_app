window.onload = () => {
  const name = document.querySelector("#name"),
    url = document.querySelector("#url"),
    form = document.querySelector("form"),
    backdrop = document.querySelector(".backdrop"),
    modal = document.querySelector(".modal"),
    message = document.querySelector(".message"),
    modalBtn = document.querySelector(".modal-Btn"),
    sites = document.querySelector(".sites"),
    alert = document.querySelector(".alert"),
    empty = document.querySelector(".empty");

  form.addEventListener("submit", bookmarkItem);
  backdrop.addEventListener("click", () => {
    closeModal();
  });
  modalBtn.addEventListener("click", () => {
    closeModal();
  });

  function urlValidation() {
    let regex = /^(http(s)?:\/\/)?(www.)?[a-z]+\.[a-z]+$/;

    return regex.test(url.value.trim());
  }

  function nameValidation() {
    let valid = false;

    if (name.value.trim() === "") {
      valid = false;
    } else {
      valid = true;
    }

    return valid;
  }

  function showAlert(msg) {
    alert.style.left = "50%";
    alert.innerHTML = msg;

    setTimeout(() => (alert.style.left = "-200%"), 2300);
  }

  function bookmarkItem(e) {
    e.preventDefault();

    let validName = nameValidation();
    let validUrl = urlValidation();

    if (!validName) {
      showModal("Please fill all the fields");
    } else if (!validUrl) {
      showModal("Please enter a valid url");
    } else {
      createItem();
      showAlert("Site added to bookmarks.");
      form.reset();
    }
  }

  function showModal(msg) {
    modal.style.display = "inline";
    backdrop.style.display = "inline";
    message.innerHTML = msg;
  }

  function closeModal() {
    modal.style.display = "none";
    backdrop.style.display = "none";
  }

  // creating unique idz for each site
  var id;

  if (localStorage.getItem("id") == null) {
    id = 0;
  } else {
    id = JSON.parse(localStorage.getItem("id"));
  }

  function createItem() {
    id++;
    localStorage.setItem("id", JSON.stringify(id));

    let div = document.createElement("div");
    div.className = "item";
    div.id = id;

    div.innerHTML = `
    <h3 class="title">${name.value.trim()}</h3>
    <div>
    <button class="visit"><a href="${url.value.trim()}" target="_top">Visit</a></button>
    <button class="delete">Delete</button>
  </div>
    `;

    sites.appendChild(div);

    document
      .querySelectorAll(".delete")
      .forEach(v => v.addEventListener("click", deleteItem));

    // storing in localStorage
    let site = {
      id: id,
      name: name.value.trim(),
      url: url.value.trim()
    };
    storeSite(site);

    showEmptyMsg();
  }

  function deleteItem(e) {
    let node = e.target.parentNode.parentNode;
    sites.removeChild(node);

    showAlert("Site deleted from bookmarks.");
    deleteSitesFromStorage(node.id);
    showEmptyMsg();
  }

  function getSites() {
    let sites;

    if (localStorage.getItem("sites") == null) {
      sites = [];
    } else {
      sites = JSON.parse(localStorage.getItem("sites"));
    }

    return sites;
  }

  function storeSite(site) {
    let sites = getSites();
    sites.push(site);
    localStorage.setItem("sites", JSON.stringify(sites));
  }

  function deleteSitesFromStorage(id) {
    let sites = getSites();
    sites = sites.filter(v => v.id != id);

    localStorage.setItem("sites", JSON.stringify(sites));
  }

  // displaying sites that are stored in localStorage
  function displaySites(id, name, url) {
    let div = document.createElement("div");
    div.className = "item";
    div.id = id;

    div.innerHTML = `
  <h3 class="title">${name}</h3>
  <div>
  <button class="visit"><a href="${url}" target="_top">Visit</a></button>
  <button class="delete">Delete</button>
</div>
  `;

    sites.appendChild(div);

    document
      .querySelectorAll(".delete")
      .forEach(v => v.addEventListener("click", deleteItem));
  }

  let storeSites = getSites();

  storeSites.forEach(v => {
    displaySites(v.id, v.name, v.url);
  });

  function showEmptyMsg() {
    let sites = getSites();
    empty.style.display = sites.length == 0 ? "block" : "none";
  }
  showEmptyMsg();
};
