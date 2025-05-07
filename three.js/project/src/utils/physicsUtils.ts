interface PhysicsParams {
    gravity: number;
    damping: number;
    elasticity: number;
  }
  
  export class PhysicsBody {
    public position: number = 0;
    public velocity: number = 0;
    private gravity: number;
    private damping: number;
    private elasticity: number;
    
    constructor(params: PhysicsParams) {
      this.gravity = params.gravity;
      this.damping = params.damping;
      this.elasticity = params.elasticity;
    }
    
    public update() {
      // Apply gravity
      this.velocity += this.gravity;
      
      // Update position
      this.position += this.velocity;
      
      // Ground collision
      if (this.position >= 0 && this.velocity > 0) {
        this.position = 0;
        // Reverse velocity with damping and elasticity
        this.velocity = -this.velocity * this.damping * this.elasticity;
        
        // Stop if velocity is very small
        if (Math.abs(this.velocity) < 0.5) {
          this.velocity = 0;
          this.position = 0;
        }
      }
    }
    
    public applyImpulse(force: number) {
      this.velocity += force;
    }
    
    public reset() {
      this.position = 0;
      this.velocity = 0;
    }
  }