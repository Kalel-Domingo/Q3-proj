class Paddle {
    constructor(position, graphics) {
        this.leftPaddle = 1;
        this.rightPaddle = 2;
        this.position = position;
        this.fx = graphics;
        this.xpos = 0;
        this.ypos = 0;
        this.width = 0;
        this.height = 0;
        this.offset = 35;
        this.score = 0;
    }

    init() {
        this.height = this.fx.height() * 0.25;
        this.width = this.fx.width() * 0.05;
        this.ypos = this.fx.height()/2 - this.height/2;
        this.xpos = this.position == this.leftPaddle ? 0 : this.fx.width() - this.width;
        this.score = 0;
    }

    reset() {
        this.ypos = this.fx.height()/2 - this.height/2;
        this.xpos = this.position == this.leftPaddle ? 0 : this.fx.width() - this.width;
        this.score = 0;
    }

    draw() {
        this.fx.drawRect(this.xpos,this.ypos,this.width,this.height,"#ffffff");
    }

    move(ball) {
        let centerY = this.ypos + this.height/2;
        if ( centerY < ball.ypos - this.offset ) {
            this.ypos += 10;
        }
        else if ( centerY > ball.ypos + this.offset ) {
            this.ypos -= 10;
        }
    }

    moveWithMouse(event) {
        let rect = this.fx.getCanvas().getBoundingClientRect();
        let root = document.documentElement;
        let mouseY = event.clientY - rect.top - root.scrollTop;
        this.ypos = mouseY - ( this.height/2 );
    }

}

class Fx {

    constructor(canvasId) {
        this.canvas = window.document.getElementById(canvasId);
        this.context = this.canvas.getContext("2d");
    }

    setCanvasToPageSize() {
        window.document.body.style.margin = '0px';
        window.document.body.style.padding = '0px';
        window.document.body.style.width = '100vw';
        window.document.body.style.height = '100vh';
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    dimensions() {
        return {
            x: 0,
            y: 0,
            width: this.canvas.width,
            height: this.canvas.height
        };
    }

    width() {
        return this.canvas.width;
    }

    height() {
        return this.canvas.height;
    }

    getCanvas() {
        return this.canvas;
    }

    fillCanvas(color) {
        this.drawRect(0,0, this.canvas.width,this.canvas.height, color);
    }

    drawRect(x,y, width,height, color) {
        this.context.fillStyle = color;
        this.context.fillRect(x,y, width,height);
    }
    
    stroke(p1x,p1y, p2x,p2y, color, lineWidth, pattern) {
        this.context.strokeStyle = color;
        this.context.lineWidth = lineWidth;
        if ( pattern ) {
            this.context.setLineDash(pattern);
        }
        this.context.beginPath();
        this.context.moveTo(p1x, p1y);
        this.context.lineTo(p2x, p2y);
        this.context.stroke();
    }/**Hi! */

    createTwoColorGradient(color1, color2, p1x, p1y, p2x, p2y) {
        let gradient = this.context.createLinearGradient(p1x, p1y, p2x, p2y);
        gradient.addColorStop(0, color1);
        gradient.addColorStop(1, color2);
        return gradient;
    }

    printText(text, x,y, size,font,color) {
        this.context.fillStyle = color;
        this.context.font = `${size} ${font}`;
        this.context.fillText(text,x,y);
    }
} 

class Ball {
    constructor(graphics) {
        this.xpos = 0;
        this.ypos = 0;
        this.xvel = 0;
        this.yvel = 0;
        this.size = 0;
        this.fx = graphics;
        this.color = "#ffffff";
    }
    
    init() {
        this.size = this.fx.height() * 0.05;
        this.xpos = this.fx.width()/2 - this.size/2;
        this.ypos = this.fx.height()/2 - this.size/2;
        this.xvel = this.fx.width() * 0.005;
        this.yvel = 0;
    }

    reset() {
        this.init();
    }
    
    draw() {
        this.fx.drawRect(this.xpos,this.ypos,this.size,this.size,this.color);
    }
    
    move() {
        this.xpos = this.xpos + this.xvel;
        this.ypos = this.ypos + this.yvel;
    }
    
    deltaY(paddle) {
        return this.ypos - ( paddle.ypos + paddle.height / 2);
    }

    deflection(paddle) {
        this.xvel = -this.xvel;
        this.yvel = this.deltaY(paddle) * 0.25;
    }

    collisions(paddle1, paddle2) {
        this.checkForPerimeterCollisions(paddle1,paddle2);
        this.checkForCollisionWith(paddle1);
        this.checkForCollisionWith(paddle2);
    }

    checkForCollisionWith(paddle) {

        let aLeftOfB = ( paddle.xpos + paddle.width ) < ( this.xpos );
        let aRightOfB = ( paddle.xpos ) > ( this.xpos + this.size );
        let aAboveB = ( paddle.ypos ) > ( this.ypos + this.size );
        let aBelowB = ( paddle.ypos + paddle.height ) < ( this.ypos );

        let collided = !( aLeftOfB || aRightOfB || aAboveB || aBelowB );

        if ( collided ) {
            this.deflection(paddle);
        }
    }

    checkForPerimeterCollisions(paddle1,paddle2) {

        let ballAtTop = ( this.ypos + this.size/2 ) < 0;
        let ballAtBottom = this.ypos > ( this.fx.height() - this.size/2);

        if ( ballAtTop ) {
            this.yvel = Math.abs(this.yvel);
        }
        if ( ballAtBottom ) {
            this.yvel = -Math.abs(this.yvel);
        }

        let ballLeftOfCanvas = ( this.xpos + this.size ) < 0;
        let ballRightOfCanvas = ( this.xpos ) > this.fx.width();

        if ( ballLeftOfCanvas ) {
            paddle2.score++;
            this.reset();
        }
        if ( ballRightOfCanvas ) {
            paddle1.score++;
            this.reset();
        }
    }
}
