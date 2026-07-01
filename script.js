"use strict";

const PORTFOLIO_CONFIG = {
  emailJS: {
    publicKey: "",
    serviceId: "",
    templateId: ""
  },
  fallbackEmail: "hello@shanusolanki.dev"
};

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

class PortfolioApp {
  constructor() {
    this.loader = document.getElementById("loader");
    this.header = document.getElementById("siteHeader");
    this.navToggle = document.getElementById("navToggle");
    this.navPanel = document.getElementById("navPanel");
    this.themeToggle = document.getElementById("themeToggle");
    this.scrollProgress = document.getElementById("scrollProgress");
    this.backToTop = document.getElementById("backToTop");
    this.cursorDot = document.getElementById("cursorDot");
    this.cursorRing = document.getElementById("cursorRing");
    this.contactForm = document.getElementById("contactForm");
    this.formStatus = document.getElementById("formStatus");
    this.lastScrollY = window.scrollY;
    this.emailJSReady = false;
  }

  init() {
    this.setCurrentYear();
    this.handleLoader();
    this.initTheme();
    this.initNavigation();
    this.initScrollProgress();
    this.initBackToTop();
    this.initRevealAnimations();
    this.initSkillBars();
    this.initCounters();
    this.initMagneticButtons();
    this.initRipples();
    this.initTiltCards();
    this.initCursor();
    this.initParticles();
    this.initParallax();
    this.initContactForm();
    this.initGsapEnhancements();
  }

  setCurrentYear() {
    const year = document.getElementById("currentYear");
    if (year) year.textContent = new Date().getFullYear();
  }

  handleLoader() {
    window.addEventListener("load", () => {
      setTimeout(() => {
        this.loader?.classList.add("is-hidden");
      }, 450);
    });
  }

  initTheme() {
    const savedTheme = localStorage.getItem("portfolio-theme");
    const systemTheme = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    const initialTheme = savedTheme || systemTheme;

    document.documentElement.setAttribute("data-theme", initialTheme);

    this.themeToggle?.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme");
      const nextTheme = currentTheme === "dark" ? "light" : "dark";

      document.documentElement.setAttribute("data-theme", nextTheme);
      localStorage.setItem("portfolio-theme", nextTheme);
    });
  }

  initNavigation() {
    const navLinks = document.querySelectorAll(".nav-link, .footer-links a, .back-inline");

    this.navToggle?.addEventListener("click", () => {
      const isOpen = this.navPanel.classList.toggle("is-open");
      this.navToggle.classList.toggle("is-active", isOpen);
      this.navToggle.setAttribute("aria-expanded", String(isOpen));
      document.body.classList.toggle("nav-open", isOpen);
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => this.closeMobileNav());
    });

    window.addEventListener("scroll", () => {
      const currentY = window.scrollY;
      const shouldHide = currentY > this.lastScrollY && currentY > 520;

      this.header?.classList.toggle("is-hidden", shouldHide);
      this.lastScrollY = currentY;
    }, { passive: true });

    this.initScrollSpy();
  }

  closeMobileNav() {
    this.navPanel?.classList.remove("is-open");
    this.navToggle?.classList.remove("is-active");
    this.navToggle?.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
  }

  initScrollSpy() {
    const sections = document.querySelectorAll("[data-section]");
    const links = document.querySelectorAll(".nav-link");

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const id = entry.target.getAttribute("id");

        links.forEach((link) => {
          const isActive = link.getAttribute("href") === `#${id}`;
          link.classList.toggle("is-active", isActive);
        });
      });
    }, {
      rootMargin: "-40% 0px -55% 0px",
      threshold: 0
    });

    sections.forEach((section) => observer.observe(section));
  }

  initScrollProgress() {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

      if (this.scrollProgress) {
        this.scrollProgress.style.width = `${progress}%`;
      }
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
  }

  initBackToTop() {
    const toggleBackToTop = () => {
      this.backToTop?.classList.toggle("is-visible", window.scrollY > 780);
    };

    this.backToTop?.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    toggleBackToTop();
    window.addEventListener("scroll", toggleBackToTop, { passive: true });
  }

  initRevealAnimations() {
    const revealEls = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver((entries, instance) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        instance.unobserve(entry.target);
      });
    }, {
      threshold: 0.16,
      rootMargin: "0px 0px -70px 0px"
    });

    revealEls.forEach((el) => observer.observe(el));
  }

  initSkillBars() {
    const skills = document.querySelectorAll(".skill");

    const observer = new IntersectionObserver((entries, instance) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        instance.unobserve(entry.target);
      });
    }, { threshold: 0.36 });

    skills.forEach((skill) => observer.observe(skill));
  }

  initCounters() {
    const counters = document.querySelectorAll("[data-counter]");

    const animateCounter = (counter) => {
      const target = Number(counter.dataset.counter);
      const isDecimal = !Number.isInteger(target);
      const duration = 1400;
      const start = performance.now();

      const update = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        const value = target * eased;

        counter.textContent = isDecimal ? `${value.toFixed(1)}+` : `${Math.round(value)}+`;

        if (progress < 1) {
          requestAnimationFrame(update);
        }
      };

      requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver((entries, instance) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        animateCounter(entry.target);
        instance.unobserve(entry.target);
      });
    }, { threshold: 0.5 });

    counters.forEach((counter) => observer.observe(counter));
  }

  initMagneticButtons() {
    if (prefersReducedMotion) return;

    const magneticItems = document.querySelectorAll(".magnetic");

    magneticItems.forEach((item) => {
      item.addEventListener("mousemove", (event) => {
        const rect = item.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;

        item.style.transform = `translate(${x * 0.16}px, ${y * 0.16}px)`;
      });

      item.addEventListener("mouseleave", () => {
        item.style.transform = "";
      });
    });
  }

  initRipples() {
    const rippleItems = document.querySelectorAll(".ripple");

    rippleItems.forEach((item) => {
      item.addEventListener("click", (event) => {
        const rect = item.getBoundingClientRect();
        const ripple = document.createElement("span");

        ripple.className = "ripple-circle";
        ripple.style.left = `${event.clientX - rect.left}px`;
        ripple.style.top = `${event.clientY - rect.top}px`;

        item.appendChild(ripple);

        ripple.addEventListener("animationend", () => {
          ripple.remove();
        });
      });
    });
  }

  initTiltCards() {
    if (prefersReducedMotion) return;

    const cards = document.querySelectorAll(".tilt-card");

    cards.forEach((card) => {
      card.addEventListener("mousemove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const rotateY = ((x / rect.width) - 0.5) * 8;
        const rotateX = ((y / rect.height) - 0.5) * -8;

        card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }

  initCursor() {
    if (!this.cursorDot || !this.cursorRing || window.matchMedia("(pointer: coarse)").matches || prefersReducedMotion) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener("mousemove", (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;

      this.cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    }, { passive: true });

    const animateCursor = () => {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;

      this.cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      requestAnimationFrame(animateCursor);
    };

    animateCursor();

    document.querySelectorAll("a, button, input, textarea, select, summary").forEach((el) => {
      el.addEventListener("mouseenter", () => this.cursorRing.classList.add("is-hover"));
      el.addEventListener("mouseleave", () => this.cursorRing.classList.remove("is-hover"));
    });
  }

  initParticles() {
    const canvas = document.getElementById("particleCanvas");
    if (!canvas || prefersReducedMotion) return;

    const ctx = canvas.getContext("2d");
    const particles = [];
    const particleCount = Math.min(95, Math.floor(window.innerWidth / 15));
    let width = 0;
    let height = 0;
    let deviceRatio = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      deviceRatio = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = width * deviceRatio;
      canvas.height = height * deviceRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(deviceRatio, 0, 0, deviceRatio, 0, 0);
    };

    const createParticle = () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.8 + 0.45,
      vx: (Math.random() - 0.5) * 0.24,
      vy: (Math.random() - 0.5) * 0.24,
      alpha: Math.random() * 0.5 + 0.14
    });

    const init = () => {
      particles.length = 0;
      for (let i = 0; i < particleCount; i += 1) {
        particles.push(createParticle());
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > height) particle.vy *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(148, 163, 184, ${particle.alpha})`;
        ctx.fill();

        for (let j = index + 1; j < particles.length; j += 1) {
          const other = particles[j];
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 118) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.12 * (1 - distance / 118)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      });

      requestAnimationFrame(draw);
    };

    resize();
    init();
    draw();

    window.addEventListener("resize", () => {
      resize();
      init();
    });
  }

  initParallax() {
    if (prefersReducedMotion) return;

    const parallaxItems = document.querySelectorAll("[data-parallax]");

    window.addEventListener("mousemove", (event) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 18;
      const y = (event.clientY / window.innerHeight - 0.5) * 18;

      parallaxItems.forEach((item) => {
        item.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      });
    }, { passive: true });
  }

  initContactForm() {
    if (!this.contactForm) return;

    const emailConfig = PORTFOLIO_CONFIG.emailJS;
    const hasEmailJSConfig = Boolean(emailConfig.publicKey && emailConfig.serviceId && emailConfig.templateId);

    if (hasEmailJSConfig && window.emailjs) {
      window.emailjs.init({ publicKey: emailConfig.publicKey });
      this.emailJSReady = true;
    }

    this.contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const isValid = this.validateForm();

      if (!isValid) {
        this.setFormStatus("Please fix the highlighted fields.", "error");
        return;
      }

      const button = this.contactForm.querySelector("button[type='submit']");
      const originalText = button.textContent;

      button.disabled = true;
      button.textContent = "Sending...";
      this.setFormStatus("Preparing your message...", "");

      try {
        if (this.emailJSReady) {
          await window.emailjs.sendForm(
            emailConfig.serviceId,
            emailConfig.templateId,
            this.contactForm,
            { publicKey: emailConfig.publicKey }
          );

          this.contactForm.reset();
          this.setFormStatus("Message sent successfully. Shanu will respond soon.", "success");
        } else {
          const mailto = this.buildMailtoLink();
          window.location.href = mailto;
          this.setFormStatus("Your email client has been opened with the message ready.", "success");
        }
      } catch (error) {
        this.setFormStatus("Message could not be sent. Please try again or use the direct email link.", "error");
      } finally {
        button.disabled = false;
        button.textContent = originalText;
      }
    });
  }

  validateForm() {
    const fields = Array.from(this.contactForm.querySelectorAll("input, textarea, select"));
    let isValid = true;

    fields.forEach((field) => {
      const row = field.closest(".form-row");
      const error = row?.querySelector(".field-error");
      const value = field.value.trim();
      let message = "";

      if (field.required && !value) {
        message = "This field is required.";
      }

      if (field.type === "email" && value && !this.isValidEmail(value)) {
        message = "Please enter a valid email address.";
      }

      if (field.id === "message" && value && value.length < 12) {
        message = "Please enter at least 12 characters.";
      }

      row?.classList.toggle("is-invalid", Boolean(message));
      if (error) error.textContent = message;

      if (message) isValid = false;
    });

    return isValid;
  }

  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  buildMailtoLink() {
    const formData = new FormData(this.contactForm);
    const name = formData.get("from_name");
    const email = formData.get("reply_to");
    const projectType = formData.get("project_type");
    const message = formData.get("message");

    const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nProject Type: ${projectType}\n\nMessage:\n${message}`
    );

    return `mailto:${PORTFOLIO_CONFIG.fallbackEmail}?subject=${subject}&body=${body}`;
  }

  setFormStatus(message, type) {
    if (!this.formStatus) return;

    this.formStatus.textContent = message;
    this.formStatus.classList.remove("is-success", "is-error");

    if (type === "success") this.formStatus.classList.add("is-success");
    if (type === "error") this.formStatus.classList.add("is-error");
  }

  initGsapEnhancements() {
    if (prefersReducedMotion || !window.gsap) return;

    const gsap = window.gsap;

    if (window.ScrollTrigger) {
      gsap.registerPlugin(window.ScrollTrigger);
    }

    gsap.from(".brand", {
      y: -18,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
      delay: 0.45
    });

    gsap.from(".nav-link", {
      y: -12,
      opacity: 0,
      duration: 0.65,
      stagger: 0.045,
      ease: "power3.out",
      delay: 0.62
    });

    gsap.from(".hero__title", {
      y: 34,
      opacity: 0,
      duration: 1.1,
      ease: "power4.out",
      delay: 0.72
    });

    gsap.from(".hero__lead, .hero__actions, .hero__socials", {
      y: 24,
      opacity: 0,
      duration: 0.9,
      stagger: 0.12,
      ease: "power3.out",
      delay: 0.96
    });

    gsap.to(".hero__glow--one", {
      x: 48,
      y: -28,
      duration: 6,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    gsap.to(".hero__glow--two", {
      x: -44,
      y: 32,
      duration: 7,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    if (window.ScrollTrigger) {
      gsap.utils.toArray(".section-heading").forEach((heading) => {
        gsap.from(heading, {
          scrollTrigger: {
            trigger: heading,
            start: "top 82%"
          },
          y: 26,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out"
        });
      });
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const app = new PortfolioApp();
  app.init();
});