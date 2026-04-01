document.addEventListener("DOMContentLoaded", () => {
    const logo = document.getElementById("logo");
    const nameA = document.getElementById("name-a");
    const nameN = document.getElementById("name-n");
    const header = document.querySelector(".main-header");
    const timeline = document.querySelector(".timeline");
    const timelineProgress = document.querySelector(".timeline-progress");
    const timelineItems = document.querySelectorAll(".timeline-item");
    const skillGroups = document.querySelectorAll(".skill-group");
    const tabs = document.querySelectorAll(".tab-btn");
    const panels = document.querySelectorAll(".tab-panel");
    const tabsWrapper = document.querySelector(".showcase-tabs");
    const cards = document.querySelectorAll(".design-card");
    const showcaseSection = document.querySelector(".showcase-section");

    if (header) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 50) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
            }
        });
    }

    function updateTimelineAnimation() {
        if (!timeline || !timelineProgress || timelineItems.length === 0) return;

        const timelineRect = timeline.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        /* where the animation should start/end in viewport */
        const startPoint = viewportHeight * 0.2;
        const endPoint = viewportHeight * 0.8;

        /* total scroll progress through timeline */
        const totalDistance = timelineRect.height + (endPoint - startPoint);
        const progressed = endPoint - timelineRect.top;

        let progressRatio = progressed / totalDistance;
        progressRatio = Math.max(0, Math.min(1, progressRatio));

        const progressHeight = progressRatio * timelineRect.height;
        timelineProgress.style.height = `${progressHeight}px`;

        timelineItems.forEach((item) => {
            const itemRect = item.getBoundingClientRect();

            /* card reveal logic */
            const triggerBottom = viewportHeight * 0.85;
            if (itemRect.top < triggerBottom && itemRect.bottom > 100) {
                item.classList.add("show");
                item.classList.remove("hidden");
            } else {
                item.classList.remove("show");
                item.classList.add("hidden");
            }

            /* dot reveal logic based on line reaching dot center */
            const dot = item.querySelector(".timeline-dot");
            if (!dot) return;

            const dotRect = dot.getBoundingClientRect();
            const dotCenterInTimeline =
                (dotRect.top + dotRect.height / 2) - timelineRect.top;

            if (progressHeight >= dotCenterInTimeline) {
                item.classList.add("reached");
            } else {
                item.classList.remove("reached");
            }
        });
    }

    function revealSkillsOnScroll() {
        const triggerPoint = window.innerHeight * 0.85;

        skillGroups.forEach(group => {
            const rect = group.getBoundingClientRect();
            const skills = group.querySelectorAll(".skill-item");

            if (rect.top < triggerPoint && rect.bottom > 80) {
                group.classList.add("show-group");

                skills.forEach((skill, index) => {
                    setTimeout(() => {
                        skill.classList.add("show-skill");
                    }, index * 120);
                });
            } else {
                group.classList.remove("show-group");

                skills.forEach(skill => {
                    skill.classList.remove("show-skill");
                });
            }
        });
    }

    function revealCards() {
        const trigger = window.innerHeight * 0.85;

        cards.forEach((card, index) => {
            const top = card.getBoundingClientRect().top;

            if (top < trigger) {
                setTimeout(() => {
                    card.classList.add("show");
                }, index * 120); // 👈 delay between cards
            } else {
                card.classList.remove("show");
            }
        });
    }

    function revealCardsInPanel(panel) {
        if (panel.dataset.revealed === "true") return;

        const cards = panel.querySelectorAll(".hidden-reveal");

        cards.forEach(card => {
            card.classList.remove("show-reveal");
        });

        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add("show-reveal");
            }, index * 140);
        });

        panel.dataset.revealed = "true";
    }

    function isSectionInView(section) {
        const rect = section.getBoundingClientRect();
        return rect.top < window.innerHeight * 0.85 && rect.bottom > 100;
    }

    function revealActivePanelOnScroll() {
        if (!showcaseSection) return;
        if (!isSectionInView(showcaseSection)) return;

        const activePanel = document.querySelector(".tab-panel.active");
        if (activePanel) {
            revealCardsInPanel(activePanel);
        }
    }

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            const target = tab.getAttribute("data-tab");

            tabs.forEach(btn => btn.classList.remove("active"));
            tab.classList.add("active");

            panels.forEach(panel => panel.classList.remove("active"));
            const activePanel = document.getElementById(target);
            activePanel.classList.add("active");

            if (target === "certificates") {
                tabsWrapper.classList.add("cert-active");
            } else {
                tabsWrapper.classList.remove("cert-active");
            }

            revealCardsInPanel(activePanel);
        });
    });

    window.addEventListener("scroll", revealActivePanelOnScroll);
    revealActivePanelOnScroll();

    window.addEventListener("scroll", revealCards);
    revealCards();

    window.addEventListener("scroll", revealSkillsOnScroll);
    revealSkillsOnScroll();

    window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    const scrollPercent = (scrollTop / docHeight) * 100;

    document.getElementById("scrollFill").style.height = `${scrollPercent}%`;
});

    window.addEventListener("scroll", updateTimelineAnimation);
    window.addEventListener("resize", updateTimelineAnimation);
    updateTimelineAnimation();
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();

                const target = document.querySelector(this.getAttribute('href'));
                const headerOffset = 100; // adjust to your header height
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;

                slowScrollTo(offsetPosition, 1200); // 👈 duration in ms (1200 = slower)
            });
        });

        function slowScrollTo(target, duration) {
            const start = window.scrollY;
            const distance = target - start;
            let startTime = null;

            function animation(currentTime) {
                if (!startTime) startTime = currentTime;
                const timeElapsed = currentTime - startTime;

                const run = easeInOutQuad(timeElapsed, start, distance, duration);
                window.scrollTo(0, run);

                if (timeElapsed < duration) {
                    requestAnimationFrame(animation);
                }
            }

            function easeInOutQuad(t, b, c, d) {
                t /= d / 2;
                if (t < 1) return c / 2 * t * t + b;
                t--;
                return -c / 2 * (t * (t - 2) - 1) + b;
            }

            requestAnimationFrame(animation);
        }

    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-left a, .nav-right a");

    window.addEventListener("scroll", () => {
        let current = "";

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (
                window.scrollY >= sectionTop - 120 &&
                window.scrollY < sectionTop + sectionHeight - 120
            ) {
                current = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");

            if (link.getAttribute("href") === "#" + current) {
                link.classList.add("active");
            }
        });
    });

document.querySelectorAll('.like-btn').forEach(button => {
    const id = button.getAttribute('data-id');
    const countSpan = button.querySelector('.like-count');

    // Load saved value
    const savedCount = localStorage.getItem('like-' + id);

    if (savedCount !== null) {
        countSpan.textContent = savedCount;
    }

    button.classList.add("pop");
    setTimeout(() => button.classList.remove("pop"), 200);

    // Click event
    button.addEventListener('click', () => {
        let current = parseInt(countSpan.textContent);

        current++; // always increase
        countSpan.textContent = current;

        // Save to localStorage
        localStorage.setItem('like-' + id, current);
    });
});

document.addEventListener("mousemove", (e) => {
    const bg = document.querySelector(".hero-bg");
    if (!bg) return;

    const rect = bg.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const before = getComputedStyle(bg, "::before");
    const after = getComputedStyle(bg, "::after");

    bg.style.setProperty("--x", x + "px");
    bg.style.setProperty("--y", y + "px");

    bg.style.setProperty("--x2", (x * 0.7) + "px");
    bg.style.setProperty("--y2", (y * 0.7) + "px");
});
