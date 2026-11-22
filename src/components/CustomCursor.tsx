import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const ring = ringRef.current;
    if (!cursor || !ring) return;

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let cursorScale = 1;
    let rafId: number | null = null;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.transform = `translate(${mouseX - 8}px, ${mouseY - 8}px) scale(${cursorScale})`;
    };

    const animate = () => {
      // increase lerp factor to make the ring follow faster (less perceived lag)
      const lerp = 0.28;
      ringX += (mouseX - ringX - 12) * lerp;
      ringY += (mouseY - ringY - 12) * lerp;
      ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
      rafId = requestAnimationFrame(animate);
    };

    const onMouseEnterLink = () => {
      cursorScale = 1.6;
      cursor.style.transform = `translate(${mouseX - 8}px, ${mouseY - 8}px) scale(${cursorScale})`;
      ring.style.width = '48px';
      ring.style.height = '48px';
    };

    const onMouseLeaveLink = () => {
      cursorScale = 1;
      cursor.style.transform = `translate(${mouseX - 8}px, ${mouseY - 8}px) scale(${cursorScale})`;
      ring.style.width = '36px';
      ring.style.height = '36px';
    };

    document.addEventListener('mousemove', onMouseMove);
    animate();

    const links = Array.from(document.querySelectorAll('a, button'));
    links.forEach(link => {
      link.addEventListener('mouseenter', onMouseEnterLink);
      link.addEventListener('mouseleave', onMouseLeaveLink);
    });

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      links.forEach(link => {
        link.removeEventListener('mouseenter', onMouseEnterLink);
        link.removeEventListener('mouseleave', onMouseLeaveLink);
      });
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="custom-cursor" />
      <div ref={ringRef} className="custom-cursor-ring" />
    </>
  );
}
