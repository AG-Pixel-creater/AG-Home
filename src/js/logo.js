export class AGLogo {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.theme = document.body.getAttribute('data-theme');
        this.setupCanvas();
    }

    setupCanvas() {
        // Set canvas size with device pixel ratio
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();
        
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.ctx.scale(dpr, dpr);
        
        this.width = rect.width;
        this.height = rect.height;
    }

    updateTheme(theme) {
        this.theme = theme;
        this.draw();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        const colors = this.theme === 'dark' 
            ? { primary: '#ffffff', secondary: '#7f70ff' }
            : { primary: '#333333', secondary: '#6c63ff' };

        // Set canvas properties
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        // Draw main letters
        this.ctx.font = 'bold 80px Arial';
        this.ctx.fillStyle = colors.primary;
        
        // Draw A
        this.ctx.fillText('A', this.width * 0.35, this.height * 0.5);
        
        // Draw G
        this.ctx.fillStyle = colors.secondary;
        this.ctx.fillText('G', this.width * 0.65, this.height * 0.5);

        // Draw connecting line
        this.ctx.beginPath();
        this.ctx.moveTo(this.width * 0.3, this.height * 0.65);
        this.ctx.lineTo(this.width * 0.7, this.height * 0.65);
        this.ctx.strokeStyle = colors.secondary;
        this.ctx.lineWidth = 3;
        this.ctx.stroke();

        // Add glow effect
        this.ctx.shadowColor = colors.secondary;
        this.ctx.shadowBlur = 20;
        this.ctx.beginPath();
        this.ctx.arc(this.width * 0.5, this.height * 0.5, 80, 0, Math.PI * 2);
        this.ctx.strokeStyle = colors.secondary;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        this.ctx.shadowBlur = 0;
    }
}
