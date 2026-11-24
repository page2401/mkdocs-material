(function () {
  function syncPortalTheme() {
    var attr = document.documentElement.getAttribute("data-theme");
    if (!attr || !document.body) return false;
    var scheme = attr === "dark" ? "slate" : "default";
    if (document.body.getAttribute("data-md-color-scheme") !== scheme) {
      document.body.setAttribute("data-md-color-scheme", scheme);
      return true;
    }
    return false;
  }

  function renderArithmatex() {
    if (typeof window.renderMathInElement !== "function") return;
    document.querySelectorAll(".arithmatex").forEach(function (el) {
      if (el.getAttribute("data-katex-rendered") === "1") return;
      window.renderMathInElement(el, {
        delimiters: [
          { left: "\\[", right: "\\]", display: true },
          { left: "\\(", right: "\\)", display: false }
        ],
        throwOnError: false
      });
      el.setAttribute("data-katex-rendered", "1");
    });
  }

  async function renderMermaidBlocks() {
    if (!window.mermaid) return;
    // Capture any unrendered <pre class="mermaid"> blocks into light-DOM wrappers
    document.querySelectorAll("pre.mermaid").forEach(function (pre) {
      var codeEl = pre.querySelector("code");
      var raw = (codeEl ? codeEl.textContent : pre.textContent) || "";
      if (!raw.trim()) return;
      var holder = document.createElement("div");
      holder.className = "mkdocs-mermaid-diagram";
      holder.setAttribute("data-mermaid-src", raw);
      holder.style.textAlign = "center";
      holder.style.margin = "1.25rem 0";
      holder.style.overflowX = "auto";
      pre.replaceWith(holder);
    });

    var holders = document.querySelectorAll(".mkdocs-mermaid-diagram[data-mermaid-src]");
    if (!holders.length) return;

    var scheme = document.body ? document.body.getAttribute("data-md-color-scheme") : "default";
    var isDark = scheme === "slate" || document.documentElement.getAttribute("data-theme") === "dark";
    window.mermaid.initialize({
      startOnLoad: false,
      theme: isDark ? "dark" : "default",
      securityLevel: "loose"
    });

    var idx = 0;
    for (var i = 0; i < holders.length; i++) {
      var h = holders[i];
      var src = h.getAttribute("data-mermaid-src") || "";
      if (!src.trim()) continue;
      try {
        var id = "mkdocs-mermaid-" + Date.now() + "-" + idx++;
        var res = await window.mermaid.render(id, src);
        h.innerHTML = res.svg;
      } catch (e) {
        console.error("Mermaid render error:", e);
      }
    }
  }

  function bootAll() {
    syncPortalTheme();
    renderArithmatex();
    void renderMermaidBlocks();
  }

  if (typeof window.document$ !== "undefined" && window.document$.subscribe) {
    window.document$.subscribe(function () {
      bootAll();
    });
  } else if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootAll);
  } else {
    bootAll();
  }

  new MutationObserver(function () {
    if (syncPortalTheme()) {
      void renderMermaidBlocks();
    }
  }).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"]
  });
})();
