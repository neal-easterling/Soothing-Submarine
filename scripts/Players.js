"use strict";
/**@type {HTMLCanvasElement} */
import {DestinationTracker} from "./Interacters.js";

class Player{
    constructor(canvas, imgPath){
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
        this.sprite = {
            object: new Image(),
            imgPath: imgPath,
            width: 300,
            height: 300,
            totFrames: 4,
            frame: 0,
            row: 0, 
            alpha: 1
        }
        this.sprite.object.src = this.sprite.imgPath;
        this.animationCounter = 0;
        this.animationSpeed = 10;  // divisor of animationCounter for tick
        this.pos = {
            x: this.canvas.centerX, // centerX
            y: this.canvas.centerY, // centerY
            imgX:this.canvas.centerX - this.sprite.width * 0.25,
            imgY:this.canvas.centerY - this.sprite.height * 0.25,
            dirX: 0,
            dirY: 0,
            width: this.sprite.width * 0.5,
            height: this.sprite.height * 0.5,
            radius: this.sprite.width * 0.5, 
            angle: 0,
            angleDir: 1
        }
    }
}

export class FluidPlayer extends Player{
    constructor(canvas, imgPath){
        super(canvas, imgPath);
        this.tracker = new DestinationTracker(canvas);
        this.speed = 50;  //denominator of dx & dy

        this.states = {
            LEFT: 0,
            IDLE:1,
            RIGHT:2
        }
    }
    #updateState(){
        if(this.pos.dirX<-0.1 && Math.abs(this.pos.dirY) > 0){
            this.sprite.row = this.states.LEFT;
            this.pos.angleDir = 1;
        }else if(this.pos.dirX>0.1 && Math.abs(this.pos.dirY) > 0){
            this.sprite.row = this.states.RIGHT;
            this.pos.angleDir = -1;
        }else{
            this.sprite.row = this.states.IDLE;
            this.pos.angleDir = 0;
        }
    }
    #updateFrame(){
        if(this.animationCounter % this.animationSpeed == 0){
            this.sprite.frame ++;
            this.animationCounter ++;
            if(this.sprite.frame >= this.sprite.totFrames) this.sprite.frame = 0;
        }else this.animationCounter ++;
    }
    #updatePos(){
        // from current to destination
        let dx = this.pos.x - this.tracker.position.x;
        let dy = this.pos.y - this.tracker.position.y;
        let distance = Math.sqrt(dx*dx + dy*dy);

        //set dirX & dirY values
        if(distance > 1) {
            this.pos.dirX = -dx/this.speed;
            this.pos.dirY = -dy/this.speed;
            this.pos.angle = (1/((this.canvas.height - dy)/this.canvas.height)-1) * this.pos.angleDir;
        }else{
            this.pos.dirX = this.pos.dirY = this.pos.angle = 0;
        }

        //update center and img values
        this.pos.x += this.pos.dirX;
        this.pos.y += this.pos.dirY;
        this.pos.imgX = this.pos.x - this.pos.width * 0.5;
        this.pos.imgY = this.pos.y - this.pos.height * 0.5;
    }
    update(bool){
        this.tracker.update(bool);
        this.#updatePos();
        this.#updateState();
        this.#updateFrame();
    }
    draw(bool=false){
        this.update(bool);
        this.canvas.ctx.save();
        this.canvas.ctx.translate(this.pos.x, this.pos.y);
        this.canvas.ctx.rotate(this.pos.angle);
        this.canvas.ctx.globalAlpha = this.sprite.alpha;
        this.canvas.ctx.drawImage(this.sprite.object, this.sprite.width * this.sprite.frame, this.sprite.height * this.sprite.row, this.sprite.width, this.sprite.height, 0-this.pos.width/2, 0-this.pos.height/2, this.pos.width, this.pos.height);
        this.canvas.ctx.restore();
    }
}