(function () {
  const sections = [
    { slug: "slider", label: "Слайдер", tiles: ["tile-slider-oZvpKw"] },
    { slug: "categories", label: "Категории", tiles: ["tile-category-collection-3hWmf9"] },
    { slug: "bouquets", label: "Букеты", tiles: ["tile-category-products-Nu8HUq"] },
    { slug: "collections", label: "Коллекции", tiles: ["tile-category-products-zLqjS9"] },
    { slug: "extras", label: "Дополнительно", tiles: ["tile-category-products-xuhALr"] },
    { slug: "faq", label: "FAQ", tiles: ["tile-feature-list-6YdhER"] },
    { slug: "contacts", label: "Контакты", tiles: ["tile-location-zsWsko"] },
    { slug: "reviews", label: "Отзывы", tiles: ["tile-customer-review-ZDkxsU"] },
    { slug: "why", label: "Почему мы", tiles: ["tile-feature-list-ww3hoe"] }
  ];

  const persistentTiles = new Set(["tile-header-fcHJMd", "tile-footer-MNure7"]);

  function currentSlug() {
    const parts = window.location.pathname.split("/").filter(Boolean);
    const last = parts[parts.length - 1];
    if (parts.indexOf("ru") === -1) return "slider";
    return sections.some((section) => section.slug === last) ? last : "slider";
  }

  function installRouterNav(activeSlug) {
    const header = document.getElementById("tile-header-fcHJMd");
    if (!header || document.querySelector(".ins-section-router")) return;

    const nav = document.createElement("nav");
    nav.className = "ins-section-router";
    nav.setAttribute("aria-label", "Разделы главной страницы");

    sections.forEach((section) => {
      const link = document.createElement("a");
      link.href = `/dina-lesson-2-artefact/ru/${section.slug}/`;
      link.textContent = section.label;
      if (section.slug === activeSlug) link.setAttribute("aria-current", "page");
      nav.appendChild(link);
    });

    header.insertAdjacentElement("afterend", nav);
  }

  function showSection() {
    const activeSlug = currentSlug();
    const active = sections.find((section) => section.slug === activeSlug) || sections[0];
    const visibleTiles = new Set([...persistentTiles, ...active.tiles]);

    sections.flatMap((section) => section.tiles).forEach((tileId) => {
      const tile = document.getElementById(tileId);
      if (tile) tile.hidden = !visibleTiles.has(tileId);
    });

    installRouterNav(active.slug);
    document.documentElement.dataset.sectionPage = active.slug;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", showSection);
  } else {
    showSection();
  }
})();
