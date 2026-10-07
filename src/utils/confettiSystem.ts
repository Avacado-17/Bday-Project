/**
 * Custom Confetti Engine
 * Shapes exclusively consist of:
 * 1. Sunflowers (radiant golden petals & warm seed centers)
 * 2. Coffee Beans (roasted espresso ovals with central curved crease)
 * 3. Kitten Faces (cute cat ears, happy eyes, tiny pink nose & whiskers)
 */

export type ConfettiShape = 'sunflower' | 'coffee_bean' | 'kitten_face';

export interface ConfettiParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotSpeed: number;
  tilt: number;
  tiltSpeed: number;
  opacity: number;
  shape: ConfettiShape;
  wobble: number;
  wobbleSpeed: number;
  isBurst?: boolean;
  decay?: number;
}

// Cat Fur Colors for Kitten Faces
const CAT_COLORS = [
  '#f59e0b', // Ginger / Marmalade
  '#ea580c', // Autumn Amber Tabby
  '#fae8b6', // Cozy Cream
  '#ecd0a8', // Warm Parchment
  '#a3704c', // Caramel Tabby
  '#785438', // Chocolate Mitted
  '#63564e', // Soft Smoky Grey
  '#ffffff', // Pure White Kitty
];

// Coffee Bean Roast Shades
const COFFEE_COLORS = [
  '#3d2112', // Dark Roast
  '#4a2916', // French Roast
  '#59341c', // Medium Espresso
  '#442312', // Roasted Arabica
  '#633c24', // Cinnamon Roast
];

export class ConfettiEngine {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private particles: ConfettiParticle[] = [];
  private animId: number | null = null;
  private isRunning = false;
  private targetContinuousCount = 95;
  private exclusionElement: HTMLElement | null = null;

  constructor() {}

  public setExclusionElement(el: HTMLElement | null) {
    this.exclusionElement = el;
  }

  public init(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    if (!this.ctx) return;

    this.resize();
    window.addEventListener('resize', this.handleResize);

    // Initial population of particles distributed across full viewport
    this.particles = [];
    const width = this.canvas.width || window.innerWidth || 1200;
    const height = this.canvas.height || window.innerHeight || 800;

    for (let i = 0; i < this.targetContinuousCount; i++) {
      this.particles.push(
        this.createContinuousParticle(
          Math.random() * width,
          Math.random() * height
        )
      );
    }

    this.start();
  }

  private handleResize = () => {
    this.resize();
  };

  private resize() {
    if (!this.canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.canvas.width = w * dpr;
    this.canvas.height = h * dpr;
    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${h}px`;
    if (this.ctx) {
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  }

  private createContinuousParticle(x?: number, y?: number): ConfettiParticle {
    const w = window.innerWidth || 1200;
    const shapes: ConfettiShape[] = ['sunflower', 'coffee_bean', 'kitten_face'];
    const chosenShape = shapes[Math.floor(Math.random() * shapes.length)];

    let color = '#f59e0b';
    if (chosenShape === 'kitten_face') {
      color = CAT_COLORS[Math.floor(Math.random() * CAT_COLORS.length)];
    } else if (chosenShape === 'coffee_bean') {
      color = COFFEE_COLORS[Math.floor(Math.random() * COFFEE_COLORS.length)];
    } else {
      color = '#f59e0b'; // Sunflower base
    }

    return {
      x: x !== undefined ? x : Math.random() * w,
      y: y !== undefined ? y : -25 - Math.random() * 50,
      vx: (Math.random() - 0.5) * 1.4,
      vy: Math.random() * 1.5 + 1.1, // Smooth floating fall speed
      size: Math.random() * 6 + 11, // 11px to 17px visible size
      color,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 2.5,
      tilt: Math.random() * Math.PI,
      tiltSpeed: Math.random() * 0.06 + 0.03,
      opacity: Math.random() * 0.2 + 0.8,
      shape: chosenShape,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.04 + 0.02,
      isBurst: false,
    };
  }

  public burst(originX?: number, originY?: number, count = 65) {
    if (!this.canvas) return;
    const w = window.innerWidth || 1200;
    const h = window.innerHeight || 800;
    const x = originX !== undefined ? originX : w / 2;
    const y = originY !== undefined ? originY : h / 2;

    const shapes: ConfettiShape[] = ['sunflower', 'coffee_bean', 'kitten_face'];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 10 + 4;
      const chosenShape = shapes[Math.floor(Math.random() * shapes.length)];

      let color = '#f59e0b';
      if (chosenShape === 'kitten_face') {
        color = CAT_COLORS[Math.floor(Math.random() * CAT_COLORS.length)];
      } else if (chosenShape === 'coffee_bean') {
        color = COFFEE_COLORS[Math.floor(Math.random() * COFFEE_COLORS.length)];
      }

      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - Math.random() * 3.5,
        size: Math.random() * 7 + 12,
        color,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 8,
        tilt: Math.random() * Math.PI,
        tiltSpeed: Math.random() * 0.12 + 0.04,
        opacity: 1,
        shape: chosenShape,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.07 + 0.03,
        isBurst: true,
        decay: Math.random() * 0.009 + 0.006,
      });
    }
  }

  private drawSunflower(ctx: CanvasRenderingContext2D, size: number) {
    const numPetals = 8;
    const petalLength = size;
    const petalWidth = size * 0.42;
    const centerRadius = size * 0.42;

    // Golden Outer Petals
    ctx.fillStyle = '#f59e0b';
    for (let i = 0; i < numPetals; i++) {
      const angle = (i * 2 * Math.PI) / numPetals;
      ctx.save();
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.ellipse(petalLength * 0.65, 0, petalLength * 0.45, petalWidth * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Sunny Bright Inner Petals
    ctx.fillStyle = '#fbbf24';
    for (let i = 0; i < numPetals; i++) {
      const angle = ((i + 0.5) * 2 * Math.PI) / numPetals;
      ctx.save();
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.ellipse(petalLength * 0.55, 0, petalLength * 0.35, petalWidth * 0.38, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Warm Chocolate Seed Core
    ctx.beginPath();
    ctx.arc(0, 0, centerRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#45230c';
    ctx.fill();

    // Subtle Core Texture
    ctx.beginPath();
    ctx.arc(0, 0, centerRadius * 0.55, 0, Math.PI * 2);
    ctx.fillStyle = '#2c1405';
    ctx.fill();
  }

  private drawCoffeeBean(ctx: CanvasRenderingContext2D, size: number, beanColor: string) {
    const rx = size * 0.62;
    const ry = size;

    // Roasted Oval Bean Body
    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
    ctx.fillStyle = beanColor;
    ctx.fill();

    // Subtle Roasted Sheen
    ctx.beginPath();
    ctx.ellipse(-rx * 0.32, -ry * 0.22, rx * 0.28, ry * 0.42, -0.2, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 235, 210, 0.2)';
    ctx.fill();

    // Iconic Center S-Crease
    ctx.beginPath();
    ctx.moveTo(0, -ry * 0.82);
    ctx.bezierCurveTo(rx * 0.24, -ry * 0.3, -rx * 0.24, ry * 0.3, 0, ry * 0.82);
    ctx.lineWidth = Math.max(1.2, size * 0.12);
    ctx.strokeStyle = '#220f05';
    ctx.lineCap = 'round';
    ctx.stroke();

    // Crease Highlight
    ctx.beginPath();
    ctx.moveTo(rx * 0.1, -ry * 0.5);
    ctx.bezierCurveTo(rx * 0.25, -ry * 0.15, -rx * 0.05, ry * 0.3, rx * 0.1, ry * 0.55);
    ctx.lineWidth = Math.max(0.6, size * 0.05);
    ctx.strokeStyle = 'rgba(255, 220, 180, 0.25)';
    ctx.stroke();
  }

  private drawKittenFace(ctx: CanvasRenderingContext2D, size: number, furColor: string) {
    const headRadius = size * 0.75;

    // Head Base
    ctx.beginPath();
    ctx.arc(0, size * 0.1, headRadius, 0, Math.PI * 2);
    ctx.fillStyle = furColor;
    ctx.fill();

    // Subtle Fur Border for White/Light Kitties
    ctx.lineWidth = 0.8;
    ctx.strokeStyle = 'rgba(80, 50, 30, 0.25)';
    ctx.stroke();

    // Left Ear
    ctx.beginPath();
    ctx.moveTo(-headRadius * 0.8, -size * 0.15);
    ctx.lineTo(-headRadius * 0.72, -size * 0.95);
    ctx.lineTo(-headRadius * 0.1, -size * 0.4);
    ctx.closePath();
    ctx.fillStyle = furColor;
    ctx.fill();
    ctx.stroke();

    // Left Inner Ear (Sweet Pink)
    ctx.beginPath();
    ctx.moveTo(-headRadius * 0.7, -size * 0.2);
    ctx.lineTo(-headRadius * 0.65, -size * 0.76);
    ctx.lineTo(-headRadius * 0.2, -size * 0.4);
    ctx.closePath();
    ctx.fillStyle = '#fca5a5';
    ctx.fill();

    // Right Ear
    ctx.beginPath();
    ctx.moveTo(headRadius * 0.8, -size * 0.15);
    ctx.lineTo(headRadius * 0.72, -size * 0.95);
    ctx.lineTo(headRadius * 0.1, -size * 0.4);
    ctx.closePath();
    ctx.fillStyle = furColor;
    ctx.fill();
    ctx.stroke();

    // Right Inner Ear (Sweet Pink)
    ctx.beginPath();
    ctx.moveTo(headRadius * 0.7, -size * 0.2);
    ctx.lineTo(headRadius * 0.65, -size * 0.76);
    ctx.lineTo(headRadius * 0.2, -size * 0.4);
    ctx.closePath();
    ctx.fillStyle = '#fca5a5';
    ctx.fill();

    // Happy Kitten Eyes (Sweet Smiling Arches ^_^)
    ctx.lineWidth = Math.max(1, size * 0.08);
    ctx.strokeStyle = '#351e0e';
    ctx.lineCap = 'round';

    ctx.beginPath();
    ctx.arc(-headRadius * 0.38, size * 0.06, size * 0.14, Math.PI, 0, false);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(headRadius * 0.38, size * 0.06, size * 0.14, Math.PI, 0, false);
    ctx.stroke();

    // Tiny Pink Nose
    ctx.beginPath();
    ctx.moveTo(0, size * 0.24);
    ctx.lineTo(-size * 0.09, size * 0.15);
    ctx.lineTo(size * 0.09, size * 0.15);
    ctx.closePath();
    ctx.fillStyle = '#f472b6';
    ctx.fill();

    // Delicate Whiskers
    ctx.lineWidth = Math.max(0.6, size * 0.04);
    ctx.strokeStyle = 'rgba(65, 35, 15, 0.45)';

    // Left Whiskers
    ctx.beginPath();
    ctx.moveTo(-headRadius * 0.32, size * 0.24);
    ctx.lineTo(-headRadius * 1.05, size * 0.18);
    ctx.moveTo(-headRadius * 0.32, size * 0.3);
    ctx.lineTo(-headRadius * 1.0, size * 0.38);
    ctx.stroke();

    // Right Whiskers
    ctx.beginPath();
    ctx.moveTo(headRadius * 0.32, size * 0.24);
    ctx.lineTo(headRadius * 1.05, size * 0.18);
    ctx.moveTo(headRadius * 0.32, size * 0.3);
    ctx.lineTo(headRadius * 1.0, size * 0.38);
    ctx.stroke();
  }

  private start() {
    if (this.isRunning) return;
    this.isRunning = true;

    const render = () => {
      if (!this.ctx || !this.canvas) return;
      const w = window.innerWidth;
      const h = window.innerHeight;

      this.ctx.clearRect(0, 0, w, h);

      // Bounding box of excluded element (e.g. opened letter container)
      let exRect: DOMRect | null = null;
      if (this.exclusionElement && document.body.contains(this.exclusionElement)) {
        exRect = this.exclusionElement.getBoundingClientRect();
      }

      // Maintain continuous confetti density
      let continuousCount = 0;
      for (let i = 0; i < this.particles.length; i++) {
        if (!this.particles[i].isBurst) continuousCount++;
      }

      while (continuousCount < this.targetContinuousCount) {
        this.particles.push(this.createContinuousParticle());
        continuousCount++;
      }

      // Update & render particles
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];

        if (p.isBurst) {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.2; // gravity
          p.vx *= 0.96; // air drag
          p.opacity -= p.decay || 0.007;

          if (p.opacity <= 0 || p.y > h + 50) {
            this.particles.splice(i, 1);
            continue;
          }
        } else {
          p.wobble += p.wobbleSpeed;
          p.x += p.vx + Math.sin(p.wobble) * 1.0;
          p.y += p.vy;

          if (p.y > h + 30) {
            // Respawn at the top
            p.y = -20 - Math.random() * 40;
            p.x = Math.random() * w;
            p.opacity = Math.random() * 0.2 + 0.8;
          }
          if (p.x < -30) p.x = w + 20;
          if (p.x > w + 30) p.x = -20;
        }

        p.rotation += p.rotSpeed;
        p.tilt += p.tiltSpeed;

        // Ensure no confetti renders inside the excluded div block so user can read text easily
        if (exRect && exRect.width > 0 && exRect.height > 0) {
          const margin = p.size * 0.4;
          if (
            p.x >= exRect.left - margin &&
            p.x <= exRect.right + margin &&
            p.y >= exRect.top - margin &&
            p.y <= exRect.bottom + margin
          ) {
            continue; // Skip rendering inside this block
          }
        }

        // 3D paper flutter scale calculation
        const flutterScale = Math.cos(p.tilt);

        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate((p.rotation * Math.PI) / 180);
        this.ctx.scale(1, flutterScale);
        this.ctx.globalAlpha = Math.max(0, p.opacity);

        // Render exclusively the requested thematic shapes
        if (p.shape === 'sunflower') {
          this.drawSunflower(this.ctx, p.size);
        } else if (p.shape === 'coffee_bean') {
          this.drawCoffeeBean(this.ctx, p.size, p.color);
        } else if (p.shape === 'kitten_face') {
          this.drawKittenFace(this.ctx, p.size, p.color);
        }

        this.ctx.restore();
      }

      this.animId = requestAnimationFrame(render);
    };

    this.animId = requestAnimationFrame(render);
  }

  public cleanup() {
    this.isRunning = false;
    this.exclusionElement = null;
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
    window.removeEventListener('resize', this.handleResize);
    this.particles = [];
  }
}

export const confettiEngine = new ConfettiEngine();
