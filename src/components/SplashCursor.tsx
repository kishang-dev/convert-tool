'use client';

import React, { useEffect, useState } from 'react';

const MOBILE_QUERY = '(max-width: 767px), (pointer: coarse)';

const SplashCursor: React.FC = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia(MOBILE_QUERY);
        const updateIsMobile = () => setIsMobile(mediaQuery.matches);

        updateIsMobile();
        mediaQuery.addEventListener('change', updateIsMobile);

        return () => mediaQuery.removeEventListener('change', updateIsMobile);
    }, []);

    useEffect(() => {
        if (isMobile) return;

        const canvas = document.createElement('canvas');
        canvas.className = 'fixed inset-0 pointer-events-none z-[9999]';
        canvas.style.mixBlendMode = 'screen';
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        let mouseX = width / 2;
        let mouseY = height / 2;
        let ringX = mouseX;
        let ringY = mouseY;

        const particles: { x: number; y: number; vx: number; vy: number; life: number; color: string; size: number }[] = [];

        const handleMouseMove = (e: MouseEvent) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Add tiny sparkle particles
            for (let i = 0; i < 2; i++) {
                particles.push({
                    x: mouseX,
                    y: mouseY,
                    vx: (Math.random() - 0.5) * 1.5,
                    vy: (Math.random() - 0.5) * 1.5,
                    life: 1.0,
                    size: Math.random() * 2 + 0.5,
                    color: ['#8b5cf6', '#ec4899', '#3b82f6', '#ffffff'][Math.floor(Math.random() * 4)]
                });
            }
        };

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('resize', handleResize);

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // 1. Update and draw tiny sparkles
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.life -= 0.03;

                if (p.life <= 0) {
                    particles.splice(i, 1);
                    continue;
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.life;
                ctx.fill();
            }
            ctx.globalAlpha = 1;

            // 2. Micro-Inertia Ring
            ringX += (mouseX - ringX) * 0.2;
            ringY += (mouseY - ringY) * 0.2;

            ctx.beginPath();
            ctx.arc(ringX, ringY, 8, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.lineWidth = 1;
            ctx.stroke();

            // 3. Central Precision Dot
            ctx.beginPath();
            ctx.arc(mouseX, mouseY, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = '#fff';
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#8b5cf6';
            ctx.fill();
            ctx.shadowBlur = 0;

            requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
            canvas.remove();
        };
    }, [isMobile]);

    return null;
};

export default SplashCursor;
