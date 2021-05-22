const auth = "563492ad6f917000010000011cdef58e40f147748a253ecb18328d47";
const gallery = document.querySelector(".gallery");
const searchInput = document.querySelector(".search-input");
const form = document.querySelector(".search-form");
const more = document.querySelector(".more");
let searchValue;
let page = 1;
let fetchlink;
let curSearch;

//event listener
searchInput.addEventListener("input", updateInput);
form.addEventListener("submit", (e) => {
  curSearch = searchValue;
  e.preventDefault();

  searchPhotos(searchValue);
});

more.addEventListener("click", loadmore);

async function fetchApi(url) {
  const dataFetch = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: auth,
    },
  });
  const data = await dataFetch.json();
  return data;
}

function generatePictures(data) {
  data.photos.forEach((photo) => {
    const galleryImg = document.createElement("div");
    galleryImg.classList.add("gallery-img");
    galleryImg.innerHTML = `
        <div class="gallery-info">
        <a href="${photo.photographer_url}" target="_blank" class="name">${photo.photographer}</a>
        <a href=${photo.src.original} target="_blank">Download</a>
        </div>
        <img src=${photo.src.large}></img>`;
    gallery.appendChild(galleryImg);
  });
}

async function curatedPhotos() {
  fetchlink = "https://api.pexels.com/v1/curated/?page=1&per_page=15";
  const data = await fetchApi(fetchlink);

  generatePictures(data);
}

async function searchPhotos(query) {
  clear();
  fetchlink = `https://api.pexels.com/v1/search?query=${query}+query&per_page=15`;
  const data = await fetchApi(fetchlink);

  generatePictures(data);
}

function updateInput(e) {
  searchValue = e.target.value;
}
async function loadmore() {
  page++;
  if (curSearch) {
    fetchlink = `https://api.pexels.com/v1/search?query=${curSearch}+query&per_page=15&page=${page}`;
  } else {
    fetchlink = `https://api.pexels.com/v1/curated/?page=${page}&per_page=15`;
  }
  const data = await fetchApi(fetchlink);
  generatePictures(data);
}
function clear() {
  gallery.innerHTML = "";
  searchInput.value = "";
}
curatedPhotos();
