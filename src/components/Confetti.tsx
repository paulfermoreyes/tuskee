"use client";

import { useRef, useEffect, useState } from "react";

export interface IConfettiParticle {
    id: string;
    color: string;
    left: number; // Percentage of viewport width
    animationDelay: number; // Seconds
}

export interface IConfettiCannon {
    fire: number; // Number of times to fire the cannon
}

export const ConfettiParticle = ({ id, color, left, animationDelay }: IConfettiParticle) => {
    const particleRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const timer = setTimeout(() => { if (particleRef.current) particleRef.current.remove(); }, 3000);
        return () => clearTimeout(timer);
    }, []);
    const fallAnimation = `fall-${id} 3s ease-out forwards`;
    if (typeof window !== 'undefined' && document.styleSheets.length > 0) {
        const styleSheet = document.styleSheets[0];
        const keyframes = `@keyframes fall-${id} { 0% { opacity: 1; transform: translateY(0) translateX(0) rotateZ(0deg); } 100% { opacity: 0; transform: translateY(100vh) translateX(${(Math.random() - 0.5) * 200}px) rotateZ(720deg); } }`;
        try {
            const ruleExists = Array.from(styleSheet.cssRules).some(
                rule => rule instanceof window.CSSKeyframesRule &&
                        rule.name === `fall-${id}`
            );
            if (!ruleExists) styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
        } catch (e) { console.warn("Could not insert confetti keyframes:", e); }
    }
    return <div ref={particleRef} className="fixed w-2.5 h-2.5 rounded-full pointer-events-none opacity-0 z-[9999]" style={{ backgroundColor: color, left: `${left}vw`, top: '-20px', animation: fallAnimation, animationDelay: `${animationDelay}s` }} />;
};
export const ConfettiCannon = ({ fire }: IConfettiCannon) => {
    const [particles, setParticles] = useState<IConfettiParticle[]>([]);
    useEffect(() => {
        if (fire > 0) {
            const newParticles = Array.from({ length: 100 }).map((_, i) => {
                const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'];
                return { id: `particle-${Date.now()}-${i}`, color: colors[Math.floor(Math.random() * colors.length)], left: Math.random() * 100, animationDelay: Math.random() * 0.5 };
            });
            setParticles(prev => [...prev, ...newParticles]);
            const timer = setTimeout(() => setParticles(currentParticles => currentParticles.slice(newParticles.length)), 3500);
            return () => clearTimeout(timer);
        }
    }, [fire]);
    return <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[9998]">{particles.map(p => <ConfettiParticle key={p.id} {...p} />)}</div>;
};
