const perPage = 30;
let currentPage = 1;
let isLoading = false;
let hasMoreReleases = true;

document.addEventListener("DOMContentLoaded", async () => {
  await loadReleases(currentPage, perPage);

  window.addEventListener("scroll", async () => {
    const distanceToBottom = document.documentElement.scrollHeight - document.documentElement.scrollTop;
    const shouldLoadMoreReleases = distanceToBottom === document.documentElement.clientHeight;

    if (shouldLoadMoreReleases && !isLoading && hasMoreReleases) {
      isLoading = true;
      currentPage++;
      await loadReleases(currentPage, perPage);
      isLoading = false;
    }
  });
});

async function loadReleases(page, perPage) {
  const releasesWrapper = document.getElementById("releases-wrapper");
  const response = await fetch(`https://api.github.com/repos/Yakov5776/RobloxUWP-StoreLib/releases?per_page=${perPage}&page=${page}`);
  const releases = await response.json();

  if (releases.length < perPage)
    hasMoreReleases = false;

  for (const release of releases) {
    const releaseEntry = document.createElement("div");
    releaseEntry.className = "release-entry";
    releaseEntry.innerHTML = `
      <span>${release.assets[0].name}</span>
      <a href="${release.assets[0].browser_download_url}" class="download-link"><svg class="download-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M10.5 2C9.6829372 2 9 2.6829372 9 3.5L9 10L4.5859375 10L12 17.414062L19.414062 10L15 10L15 3.5C15 2.6829372 14.317063 2 13.5 2L10.5 2 z M 11 4L13 4L13 12L14.585938 12L12 14.585938L9.4140625 12L11 12L11 4 z M 2 20L2 22L22 22L22 20L2 20 z" fill="#FFFFFF"></path>
      </svg></a>
    `;
    releasesWrapper.appendChild(releaseEntry);
  }
}
