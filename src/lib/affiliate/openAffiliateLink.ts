export function openAffiliateLink(url: string): void {
  console.log("[CJ] openAffiliateLink()", { url });
  if (typeof document === "undefined") {
    console.warn("[CJ] openAffiliateLink() aborted: document undefined");
    return;
  }
  if (!url) {
    console.warn("[CJ] openAffiliateLink() aborted: empty url");
    return;
  }

  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.target = "_blank";
  anchor.rel = "noopener noreferrer";
  anchor.style.display = "none";
  console.log("[CJ] openAffiliateLink() anchor prepared", {
    href: anchor.href,
    target: anchor.target,
    rel: anchor.rel,
  });
  document.body.appendChild(anchor);
  console.log("[CJ] openAffiliateLink() anchor appended");
  anchor.click();
  console.log("[CJ] openAffiliateLink() anchor clicked");
  document.body.removeChild(anchor);
  console.log("[CJ] openAffiliateLink() anchor removed");
}
