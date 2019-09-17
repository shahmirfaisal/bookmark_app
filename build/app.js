"use strict";

window.onload = function () {
  var name = document.querySelector("#name"),
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
  backdrop.addEventListener("click", function () {
    closeModal();
  });
  modalBtn.addEventListener("click", function () {
    closeModal();
  });

  function urlValidation() {
    var regex = /^http(s)?:\/\/www\.([a-z])+\.[a-z]+$/i;
    return regex.test(url.value.trim());
  }

  function nameValidation() {
    var valid = false;

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
    setTimeout(function () {
      return alert.style.left = "-200%";
    }, 2300);
  }

  function bookmarkItem(e) {
    e.preventDefault();
    var validName = nameValidation();
    var validUrl = urlValidation();

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
  } // creating unique idz for each site


  var id;

  if (localStorage.getItem("id") == null) {
    id = 0;
  } else {
    id = JSON.parse(localStorage.getItem("id"));
  }

  function createItem() {
    id++;
    localStorage.setItem("id", JSON.stringify(id));
    var div = document.createElement("div");
    div.className = "item";
    div.id = id;
    div.innerHTML = "\n    <h3 class=\"title\">".concat(name.value.trim(), "</h3>\n    <div>\n    <button class=\"visit\"><a href=\"").concat(url.value.trim(), "\" target=\"_blank\">Visit</a></button>\n    <button class=\"delete\">Delete</button>\n  </div>\n    ");
    sites.appendChild(div);
    document.querySelectorAll(".delete").forEach(function (v) {
      return v.addEventListener("click", deleteItem);
    }); // storing in localStorage

    var site = {
      id: id,
      name: name.value.trim(),
      url: url.value.trim()
    };
    storeSite(site);
    showEmptyMsg();
  }

  function deleteItem(e) {
    var node = e.target.parentNode.parentNode;
    sites.removeChild(node);
    showAlert("Site deleted from bookmarks.");
    deleteSitesFromStorage(node.id);
    showEmptyMsg();
  }

  function getSites() {
    var sites;

    if (localStorage.getItem("sites") == null) {
      sites = [];
    } else {
      sites = JSON.parse(localStorage.getItem("sites"));
    }

    return sites;
  }

  function storeSite(site) {
    var sites = getSites();
    sites.push(site);
    localStorage.setItem("sites", JSON.stringify(sites));
  }

  function deleteSitesFromStorage(id) {
    var sites = getSites();
    sites = sites.filter(function (v) {
      return v.id != id;
    });
    localStorage.setItem("sites", JSON.stringify(sites));
  } // displaying sites that are stored in localStorage


  function displaySites(id, name, url) {
    var div = document.createElement("div");
    div.className = "item";
    div.id = id;
    div.innerHTML = "\n  <h3 class=\"title\">".concat(name, "</h3>\n  <div>\n  <button class=\"visit\"><a href=\"").concat(url, "\" target=\"_top\">Visit</a></button>\n  <button class=\"delete\">Delete</button>\n</div>\n  ");
    sites.appendChild(div);
    document.querySelectorAll(".delete").forEach(function (v) {
      return v.addEventListener("click", deleteItem);
    });
  }

  var storeSites = getSites();
  storeSites.forEach(function (v) {
    displaySites(v.id, v.name, v.url);
  });

  function showEmptyMsg() {
    var sites = getSites();
    empty.style.display = sites.length == 0 ? "block" : "none";
  }

  showEmptyMsg();
};