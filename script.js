/* =========================================================
   Collins Osas — Portfolio
   Main script (vanilla JS)
   ========================================================= */

(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const mobileQuery = window.matchMedia("(max-width: 760px)");

  /* ---------- 1. Image fallback ---------- */
  function initImageFallback() {
    $$("main img").forEach((img) => {
      const swap = () => {
        const placeholder = document.createElement("div");
        placeholder.className = "img-placeholder";
        placeholder.textContent = img.alt;
        img.replaceWith(placeholder);
      };
      if (img.complete && img.naturalWidth === 0) swap();
      else img.addEventListener("error", swap, { once: true });
    });
  }

  /* ---------- 2. Mobile menu ---------- */
  function initMenu() {
    const toggle = $("#navToggle");
    const links = $("#navLinks");

    const setOpen = (open) => {
      links.classList.toggle("open", open);
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      document.body.classList.toggle("menu-open", open);
    };

    toggle.addEventListener("click", () => setOpen(!links.classList.contains("open")));
    links.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });

    // Close on outside tap (the overlay), Escape, or when leaving the mobile layout
    document.addEventListener("click", (e) => {
      if (!links.classList.contains("open")) return;
      if (e.target.closest("#navLinks, #navToggle, #themeToggle")) return;
      setOpen(false);
    });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
    mobileQuery.addEventListener("change", (e) => { if (!e.matches) setOpen(false); });
  }

  /* ---------- 3. Scroll effects: navbar, back-to-top ---------- */
  function initScrollEffects() {
    const nav = $("#nav");
    const toTop = $("#toTop");
    const footer = $(".footer");
    const baseOffset = 20; // px from the viewport bottom
    let ticking = false;

    const update = () => {
      const y = window.scrollY;
      nav.classList.toggle("scrolled", y > 40);
      toTop.classList.toggle("show", y > 600);

      // Keep the button above the footer once it scrolls into view
      const overlap = Math.max(0, window.innerHeight - footer.getBoundingClientRect().top);
      toTop.style.bottom = `${baseOffset + overlap}px`;
      ticking = false;
    };

    const requestUpdate = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    update();
  }

  /* ---------- 4. Active nav link ---------- */
  function initActiveLink() {
    const anchors = $$("#navLinks a:not(.btn)");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const href = `#${entry.target.id}`;
          anchors.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === href));
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    $$("main section[id]").forEach((section) => observer.observe(section));
  }

  /* ---------- 5. Typing effect ---------- */
  function initTyping() {
    const el = $("#typed");
    const words = ["production-ready UIs.", "React & Next.js apps.", "mobile-first websites.", "products people enjoy."];
    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const tick = () => {
      const word = words[wordIndex];
      el.textContent = word.slice(0, charIndex);

      if (!deleting && charIndex < word.length) {
        charIndex++;
        setTimeout(tick, 75);
      } else if (!deleting) {
        deleting = true;
        setTimeout(tick, 1700);
      } else if (charIndex > 0) {
        charIndex--;
        setTimeout(tick, 35);
      } else {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        setTimeout(tick, 300);
      }
    };
    tick();
  }

  /* ---------- 6. Tech marquee ----------
     Items are duplicated so the -50% translate loops seamlessly. */
  function initMarquee() {
    const track = $("#marqueeTrack");
    track.innerHTML += track.innerHTML;
  }

  /* ---------- 7. Scroll reveal & counters ---------- */
  function animateCount(el) {
    const target = Number(el.dataset.target);
    const suffix = el.dataset.suffix || "";
    const duration = 1200;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  function initReveal() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("visible");
          $$(".count", entry.target).forEach(animateCount);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15 }
    );
    $$(".reveal").forEach((el) => observer.observe(el));
  }

  /* ---------- 8. Experience / Education tabs ---------- */
  function initTabs() {
    const tabs = $$(".tab");

    const select = (tab) => {
      tabs.forEach((t) => {
        const active = t === tab;
        t.classList.toggle("active", active);
        t.setAttribute("aria-selected", String(active));
        t.tabIndex = active ? 0 : -1;
      });
      $$(".tab-panel").forEach((panel) => {
        const active = panel.id === tab.dataset.tab;
        panel.classList.toggle("active", active);
        panel.hidden = !active;
        if (active) $$(".reveal", panel).forEach((card) => card.classList.add("visible"));
      });
    };

    tabs.forEach((tab, i) => {
      tab.addEventListener("click", () => select(tab));
      tab.addEventListener("keydown", (e) => {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
        const next = tabs[(i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length];
        select(next);
        next.focus();
      });
    });
    select($(".tab.active") || tabs[0]);
  }

  /* ---------- 9. Toast & copy email ---------- */
  const toast = $("#toast");
  let toastTimer;

  function showToast(text) {
    toast.textContent = text;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
  }

  function initCopyEmail() {
    $("#copyEmail").addEventListener("click", async () => {
      const email = $("#emailLink").textContent.trim();
      try {
        await navigator.clipboard.writeText(email);
        showToast("Email copied to clipboard ✓");
      } catch {
        showToast(email); // Clipboard API unavailable: show the address instead
      }
    });
  }

  /* ---------- 10. Contact form ---------- */
  function initContactForm() {
    const form = $("#contactForm");
    const status = $("#formStatus");
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const { name, email, message } = form.elements;

    const setError = (input, text) => {
      const field = input.closest(".field");
      field.classList.toggle("invalid", Boolean(text));
      input.setAttribute("aria-invalid", String(Boolean(text)));
      $(".error", field).textContent = text;
      return !text;
    };

    const validate = () => {
      const okName = setError(name, name.value.trim().length < 2 ? "Please enter your name." : "");
      const okEmail = setError(email, emailPattern.test(email.value.trim()) ? "" : "Please enter a valid email.");
      const okMessage = setError(message, message.value.trim().length < 10 ? "Message should be at least 10 characters." : "");
      return okName && okEmail && okMessage;
    };

    form.addEventListener("input", (e) => {
      if (e.target.closest(".field")?.classList.contains("invalid")) validate();
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      status.textContent = "";
      if (!validate()) return;

      const subject = encodeURIComponent(`Opportunity for Collins — from ${name.value.trim()}`);
      const body = encodeURIComponent(`${message.value.trim()}\n\n— ${name.value.trim()} (${email.value.trim()})`);
      window.location.href = `mailto:user.collins.add@gmail.com?subject=${subject}&body=${body}`;

      status.textContent = "Thanks! Your email app should open with the message ready to send.";
      form.reset();
    });
  }

  /* ---------- 11. Theme toggle ---------- */
  function initTheme() {
    const btn = $("#themeToggle");
    const root = document.documentElement;
    const systemLight = window.matchMedia("(prefers-color-scheme: light)");

    const apply = (theme) => {
      root.setAttribute("data-theme", theme);
      btn.setAttribute("aria-label", theme === "light" ? "Switch to dark mode" : "Switch to light mode");
    };

    const saved = () => {
      try { return localStorage.getItem("theme"); } catch { return null; }
    };

    btn.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      apply(next);
      try { localStorage.setItem("theme", next); } catch { /* storage unavailable */ }
    });

    // Follow the OS setting until the visitor picks a theme
    systemLight.addEventListener("change", (e) => {
      if (!saved()) apply(e.matches ? "light" : "dark");
    });

    apply(root.getAttribute("data-theme") || "dark");
  }

  /* ---------- 12. Code editor card ----------
     Rendered from JS to keep the markup formatter-friendly,
     since whitespace inside <pre> is significant. */
  function initCodeCard() {
    const codeEl = $("#profileCode");
    if (!codeEl) return;

    // Each line is a list of [className, text] tokens ("" = plain text)
    const lines = [
      [["k", "const"], ["", " "], ["v", "collins"], ["", " = {"]],
      [["", "  "], ["p", "role"], ["", ": "], ["s", '"Frontend Developer"'], ["", ","]],
      [["", "  "], ["p", "company"], ["", ": "], ["s", '"7Forge LTD"'], ["", ","]],
      [["", "  "], ["p", "stack"], ["", ": ["], ["s", '"React"'], ["", ", "], ["s", '"Next.js"'], ["", ", "], ["s", '"TypeScript"'], ["", "],"]],
      [["", "  "], ["p", "strengths"], ["", ": ["]],
      [["", "    "], ["s", '"clean UI"'], ["", ","]],
      [["", "    "], ["s", '"mobile-first"'], ["", ","]],
      [["", "    "], ["s", '"fast learner"'], ["", ","]],
      [["", "  ],"]],
      [["", "  "], ["p", "openToWork"], ["", ": "], ["b", "true"], ["", ","]],
      [["", "};"]],
      [],
      [["v", "collins"], ["", "."], ["f", "hire"], ["", "(); "], ["c", "// 👉 scroll to contact"]],
    ];

    const fragment = document.createDocumentFragment();
    lines.forEach((tokens, i) => {
      tokens.forEach(([cls, text]) => {
        if (!cls) {
          fragment.append(text);
          return;
        }
        const span = document.createElement("span");
        span.className = cls;
        span.textContent = text;
        fragment.append(span);
      });
      if (i < lines.length - 1) fragment.append("\n");
    });
    codeEl.append(fragment);

    // collins.hire() scrolls to the contact section
    const hire = $(".f", codeEl);
    const goToContact = () => $("#contact").scrollIntoView({ behavior: "smooth" });
    hire.title = "Go to contact";
    hire.tabIndex = 0;
    hire.setAttribute("role", "link");
    hire.addEventListener("click", goToContact);
    hire.addEventListener("keydown", (e) => { if (e.key === "Enter") goToContact(); });
  }

  /* ---------- 13. Footer year ---------- */
  function initYear() {
    $("#year").textContent = new Date().getFullYear();
  }

  /* ---------- Init ---------- */
  initImageFallback();
  initTheme();
  initMenu();
  initScrollEffects();
  initActiveLink();
  initTyping();
  initMarquee();
  initReveal();
  initTabs();
  initCopyEmail();
  initContactForm();
  initCodeCard();
  initYear();
})();
