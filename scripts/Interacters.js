"use strict";
/**@type {HTMLCanvasElement} */
import{Triangle} from "./Shapes.js";

export class MouseTracker{
    constructor(canvas){
        this.canvas = {
            canvas: canvas,
            left: canvas.getBoundingClientRect().left,
            top: canvas.getBoundingClientRect().top,
            centerX: canvas.width * 0.5,
            centerY: canvas.height * 0.5
        };
        this.mouse = {
            x: this.canvas.centerX,
            y: this.canvas.centerY,
            radius: 150,
            active: false
        };
        this.canvas.canvas.addEventListener("mousedown", (md)=>{
            this.mouse.active = true;
        });
        this.canvas.canvas.addEventListener("touchstart", (ts)=>{
            ts.preventDefault();
            this.mouse.active = true;
        });
        this.canvas.canvas.addEventListener("mousemove", (mm)=>{
            this.mouse.x = mm.clientX - this.canvas.left;
            this.mouse.y = mm.clientY - this.canvas.top;
        });
        this.canvas.canvas.addEventListener("touchmove", (tm)=>{
            tm.preventDefault();
            this.mouse.x = tm.touches[0].clientX  - this.canvas.left;
            this.mouse.y = tm.touches[0].clientY - this.canvas.top;
        });
        this.canvas.canvas.addEventListener("mouseup", (mu)=>{
            this.mouse.active = false;
        });
        this.canvas.canvas.addEventListener("touchend", (te)=>{
            te.preventDefault();
            this.mouse.active = false;
        });
    }
}

export class KeyboardMotionTracker{
    constructor(canvas){
        this.canvas = {
            object: canvas,
            ctx: canvas.getContext("2d"),
            width: canvas.width,
            height: canvas.height,
            centerX: canvas.width * 0.5,
            centerY: canvas.height * 0.5, 
            box: canvas.getBoundingClientRect(),
            top: canvas.getBoundingClientRect().top,
            right: canvas.getBoundingClientRect().right,
            bottom: canvas.getBoundingClientRect().bottom,
            left: canvas.getBoundingClientRect().left
        }
        this.position = {
            x: this.canvas.centerX,
            y: this.canvas.centerY
        };
        this.states = {
            up: false,
            right: false,
            down: false,
            left: false
        };
        this.speed = 5;
        document.addEventListener("keydown", (e)=>{
            if(e.key === "w" || e.key ==="ArrowUp"){
                this.states.up = true;
            }
            if(e.key === "d" || e.key ==="ArrowRight"){
                this.states.right = true;
            }
            if(e.key === "s" || e.key ==="ArrowDown"){
                this.states.down = true;
            }
            if(e.key === "a" || e.key ==="ArrowLeft"){
                this.states.left = true;
            }
        });
        document.addEventListener("keyup", (e)=>{
            if(e.key === "w" || e.key ==="ArrowUp"){
                this.states.up = false;
            }
            if(e.key === "d" || e.key ==="ArrowRight"){
                this.states.right = false;
            }
            if(e.key === "s" || e.key ==="ArrowDown"){
                this.states.down = false;
            }
            if(e.key === "a" || e.key ==="ArrowLeft"){
                this.states.left = false;
            }
        });
    }
    updatePosition(buffer=0){ // must be placed in gameloop
        if(this.states.up){
            this.position.y -= this.speed;
        } else if(this.states.down) {
            this.position.y += this.speed;
        }
        if(this.states.right){
            this.position.x += this.speed;
        }else if(this.states.left){
            this.position.x -= this.speed;
        }
        if(this.position.x < 0) this.position.x = 0;
        if(this.position.x > this.canvas.width - buffer) this.position.x = this.canvas.width - buffer;
        if(this.position.y< 0) this.position.y = 0;
        if(this.position.y > this.canvas.height - buffer) this.position.y = this.canvas.height - buffer;
    }
}

export class DestinationTracker{
    constructor(canvas){
        this.canvas = {
            object: canvas,
            ctx: canvas.getContext("2d"),
            width: canvas.width,
            height: canvas.height,
            centerX: canvas.width * 0.5,
            centerY: canvas.height * 0.5, 
        };
        this.mouse = new MouseTracker(canvas);
        this.keyboard = new KeyboardMotionTracker(canvas);
        this.position = {
            x: this.keyboard.position.x,
            y: this.keyboard.position.y
        }
        this.shape = new Triangle(this.position.x, this.position.y, 15, 15);
        this.shape.fillColor = "#00ffff";   
    }
    #keyboardUpdate(){
        this.keyboard.updatePosition(15);
        this.position.x = this.keyboard.position.x;
        this.position.y = this.keyboard.position.y;
    }
    #mouseUpdate(){
        if(this.mouse.mouse.active){
            this.position.x = this.keyboard.position.x = this.mouse.mouse.x;
            this.position.y = this.keyboard.position.y = this.mouse.mouse.y;
        }
    }
    update(bool=false){ // must be placed in gameloop
        this.#keyboardUpdate();
        this.#mouseUpdate();
        if(bool){
            this.shape.update(this.position.x, this.position.y);
            this.shape.draw(this.canvas.ctx);
        }   
    }
}