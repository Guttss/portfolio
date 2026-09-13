document.addEventListener("DOMContentLoaded", () => {
  console.log("Portfolio do Gustavo carregado com sucesso!");

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  //  brilho que segue o mouse 
  const cursorGlow = document.getElementById("cursorGlow");

  if (cursorGlow && !prefersReducedMotion) {
    let glowX = window.innerWidth / 2;
    let glowY = window.innerHeight / 2;
    let targetX = glowX;
    let targetY = glowY;

    window.addEventListener("pointermove", (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      cursorGlow.style.opacity = "0.18";
    });

    window.addEventListener("pointerleave", () => {
      cursorGlow.style.opacity = "0";
    });

    const animateGlow = () => {
      // suaviza o movimento (efeito "lerp")
      glowX += (targetX - glowX) * 0.30;
      glowY += (targetY - glowY) * 0.30;
      cursorGlow.style.transform = `translate(${glowX}px, ${glowY}px)`;
      requestAnimationFrame(animateGlow);
    };

    animateGlow();
  }

  const canvas = document.getElementById("particles-bg");

  if (canvas && !prefersReducedMotion) {
    const context = canvas.getContext("2d");
    const particles = [];
    let animationFrame;

    const particleConfig = {
      density: 12000,
      maxParticles: 90,
      minParticles: 36,
      linkDistance: 130,
      mouseRadius: 150,
    };

    const pointer = {
      x: null,
      y: null,
    };

    const resizeCanvas = () => {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(window.innerWidth * pixelRatio);
      canvas.height = Math.floor(window.innerHeight * pixelRatio);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      const particleCount = Math.max(
        particleConfig.minParticles,
        Math.min(
          particleConfig.maxParticles,
          Math.floor((window.innerWidth * window.innerHeight) / particleConfig.density)
        )
      );

      particles.length = 0;

      for (let index = 0; index < particleCount; index += 1) {
        particles.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          radius: Math.random() * 1.8 + 0.8,
        });
      }
    };

    const drawParticles = () => {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);

      particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > window.innerWidth) particle.vx *= -1;
        if (particle.y < 0 || particle.y > window.innerHeight) particle.vy *= -1;

        if (pointer.x !== null && pointer.y !== null) {
          const dx = particle.x - pointer.x;
          const dy = particle.y - pointer.y;
          const distance = Math.hypot(dx, dy);

          if (distance < particleConfig.mouseRadius) {
            const force = (particleConfig.mouseRadius - distance) / particleConfig.mouseRadius;
            particle.x += (dx / distance) * force * 1.4;
            particle.y += (dy / distance) * force * 1.4;
          }
        }

        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fillStyle = "rgba(122, 234, 206, 0.62)";
        context.fill();

        for (let nextIndex = index + 1; nextIndex < particles.length; nextIndex += 1) {
          const nextParticle = particles[nextIndex];
          const distance = Math.hypot(particle.x - nextParticle.x, particle.y - nextParticle.y);

          if (distance < particleConfig.linkDistance) {
            context.beginPath();
            context.moveTo(particle.x, particle.y);
            context.lineTo(nextParticle.x, nextParticle.y);
            context.strokeStyle = `rgba(79, 168, 142, ${0.22 * (1 - distance / particleConfig.linkDistance)})`;
            context.lineWidth = 1;
            context.stroke();
          }
        }
      });

      animationFrame = requestAnimationFrame(drawParticles);
    };

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("pointermove", (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    });
    window.addEventListener("pointerleave", () => {
      pointer.x = null;
      pointer.y = null;
    });

    resizeCanvas();
    drawParticles();

    window.addEventListener("beforeunload", () => {
      cancelAnimationFrame(animationFrame);
    });
  }

  const animatedItems = document.querySelectorAll(
    "section, .job, .edu-card, .course-item, .skill-row"
  );

  animatedItems.forEach((item) => {
    item.classList.add("reveal");
  });

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    animatedItems.forEach((item) => {
      revealObserver.observe(item);
    });
  } else {
    animatedItems.forEach((item) => {
      item.classList.add("visible");
    });
  }
});