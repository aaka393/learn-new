import { drawBackground } from './sceneUtils';
import { renderStickFigure, StickFigure } from './stickFigureUtils';
import { renderTree, Tree } from './environmentUtils';

export enum AnimationState {
  WALKING = 'walking',
  STOPPING = 'stopping',
  IDLE = 'idle'
}

export class AnimationController {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private stars: { x: number; y: number; size: number; twinkle: number; }[] = [];
  private tree: Tree;
  private stickFigure: StickFigure;
  private animationState: AnimationState = AnimationState.WALKING;
  private walkDuration = 3000; // ms
  private pauseDuration = 1000; // ms
  private startTime: number | null = null;
  private stateTime: number | null = null;
  private animationId: number | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas context not available');
    this.ctx = context;
    
    // Initialize stars
    this.initStars();
    
    // Initialize tree
    this.tree = {
      x: canvas.width / 4 + 300,
      y: canvas.height / 2 - 100,
      width: 30,
      height: 160,
      leavesRadius: 60,
    };
    
    // Scale factor of 2.5 for the stick figure
    const scaleFactor = 2.5;
    const stickY = canvas.height / 2 - (1 + 1 + 1) * scaleFactor;
    this.stickFigure = {
      x: 0,
      y: stickY,
      targetX: canvas.width / 4,
      scale: scaleFactor,
      elasticity: 1.3,
      swing: 0,
      jumpHeight: 0,
      velocity: 0,
      headRadius: 4 * scaleFactor,
      bodyHeight: 15 * scaleFactor,
      armLength: 15 * scaleFactor,
      legLength: 15 * scaleFactor,
      color: '#ff6600'
    };
  }

  private initStars() {
    const STAR_COUNT = 150;
    this.stars = Array.from({ length: STAR_COUNT }).map(() => ({
      x: Math.random() * this.canvas.width,
      y: Math.random() * (this.canvas.height / 2 - 20),
      size: Math.random() * 2.5 + 0.5,
      twinkle: Math.random() * Math.PI * 2
    }));
  }

  private updateState(timestamp: number) {
    if (!this.startTime) {
      this.startTime = timestamp;
      this.stateTime = timestamp;
    }

    const totalElapsed = timestamp - this.startTime;
    const stateElapsed = timestamp - (this.stateTime || 0);

    switch (this.animationState) {
      case AnimationState.WALKING:
        const walkProgress = Math.min(stateElapsed / this.walkDuration, 1);
        this.stickFigure.x = walkProgress * this.stickFigure.targetX;
        this.stickFigure.swing = Math.sin(totalElapsed / 150) * 0.5;

        // Move tree and stars
        this.tree.x -= 2;
        this.stars.forEach(star => {
          star.x -= 0.5;
          if (star.x < 0) {
            star.x = this.canvas.width;
            star.y = Math.random() * (this.canvas.height / 2 - 20);
          }
          star.twinkle += 0.02;
        });

        if (walkProgress >= 1) {
          this.animationState = AnimationState.STOPPING;
          this.stateTime = timestamp;
        }
        break;

      case AnimationState.STOPPING:
        this.stickFigure.swing = Math.sin(totalElapsed / 200) * 0.2;

        if (stateElapsed > this.pauseDuration) {
          this.animationState = AnimationState.IDLE;
          this.stateTime = timestamp;

          // Reset Y position to sit flat on the ground
          this.stickFigure.y = this.canvas.height / 2 - 60 * this.stickFigure.scale;
        }
        break;

      case AnimationState.IDLE:
        // Gentle breathing motion
        this.stickFigure.swing = Math.sin(totalElapsed / 1500) * 0.1;

        // Ensure grounded
        this.stickFigure.y = this.canvas.height / 2 - 60 * this.stickFigure.scale;
        break;
    }
  }

  private render() {
    const { ctx, canvas } = this;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground(ctx, canvas, this.stars);

    // Ground
    ctx.fillStyle = '#228B22';
    ctx.fillRect(0, canvas.height / 2, canvas.width, canvas.height / 2);

    renderTree(ctx, this.tree);
    renderStickFigure(ctx, this.stickFigure);
  }

  public startAnimation() {
    const animate = (timestamp: number) => {
      this.updateState(timestamp);
      this.render();
      this.animationId = requestAnimationFrame(animate);
    };

    this.animationId = requestAnimationFrame(animate);
    return this.animationId;
  }

  public cleanup() {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
    }
  }
}
