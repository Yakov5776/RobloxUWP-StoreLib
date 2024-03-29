const perPage = 30;
let currentPage = 1;
let isLoading = false;

document.addEventListener("DOMContentLoaded", async () => {
  await loadReleases(currentPage, perPage);

  window.addEventListener("scroll", async () => {
    const distanceToBottom = document.documentElement.scrollHeight - document.documentElement.scrollTop;
    const shouldLoadMoreReleases = distanceToBottom === document.documentElement.clientHeight;

    if (shouldLoadMoreReleases && !isLoading) {
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

  for (const release of releases) {
    const releaseEntry = document.createElement("div");
    releaseEntry.className = "release-entry";
    releaseEntry.innerHTML = `
      <span>${release.assets[0].name}</span>
      <a href="${release.assets[0].browser_download_url}" class="download-link"><svg class="download-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="480" height="480">
      <path d="M15 1C14.448 1 14 1.448 14 2L14 6L16 6L16 2C16 1.448 15.552 1 15 1 z M 16 6L16 18.585938L18.292969 16.292969C18.683969 15.901969 19.316031 15.901969 19.707031 16.292969C20.098031 16.683969 20.098031 17.316031 19.707031 17.707031L15.707031 21.707031C15.512031 21.902031 15.256 22 15 22C14.744 22 14.487969 21.902031 14.292969 21.707031L10.292969 17.707031C9.9019687 17.316031 9.9019688 16.683969 10.292969 16.292969C10.683969 15.901969 11.316031 15.901969 11.707031 16.292969L14 18.585938L14 6L6 6C4.895 6 4 6.895 4 8L4 25C4 26.105 4.895 27 6 27L24 27C25.105 27 26 26.105 26 25L26 8C26 6.895 25.105 6 24 6L16 6 z" fill="#FFFFFF" />
    </svg></a>
    `;
    releasesWrapper.appendChild(releaseEntry);
  }
}