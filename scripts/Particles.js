"use strict";
/**@type {HTMLCanvasElement} */
import { Ellipse} from "./Shapes.js";

//base particle
//ALL PARTICLES ARE ASSUMED TO HAVE AN EQUAL WIDTH AND HEIGHT
export class Particle{
    constructor(x, y, dirX, dirY, color, size){
        this.initialX = x;
        this.initialY = y;
        this.dirX = dirX || 0;
        this.dirY = dirY || 0;
        this.fillColor = color || "#666666";
        this.size = size || 15;
        this.forceX = 0;
        this.forceY = 0;
        this.age = 0;
        this.shape = new Ellipse(this.initialX, this.initialY, this.size, this.size, this.fillColor);
    }
    update(newX, newY){
        this.shape.updateInc(newX, newY);
    }
    draw(context){
        this.shape.draw(context);
    }
}

//base particle handler
export class ParticleHandler{
    constructor(canvas){
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
        this.particles = [];
        this.edgeBuffer = 100;
        this.shiftX = 0;
        this.shiftY = 0;
        this.ageLimiter = 3;
    }
    deletionCheck(part){
        if(part.shape.y > this.canvas.clientHeight + this.edgeBuffer||
            part.shape.y < 0 - this.edgeBuffer ||
            part.shape.x < 0 - this.edgeBuffer ||
            part.shape.x > this.canvas.clientWidth + this.edgeBuffer ||
            part.shape.fillAlpha <= 0.1){
                const index = this.particles.indexOf(part);
                if(index >-1){
                    this.particles.splice(index, 1);
                }
        }
        if(this.ageLimiter != -1){
            part.age ++;
            part.shape.fillAlpha -= (part.age/6000)/this.ageLimiter;
        }
    }
    updateAll(){
        this.particles.forEach((part)=>{
            this.deletionCheck(part);
            let newX = this.shiftX + part.dirX + part.forceX;
            let newY = this.shiftY + part.dirY + part.forceY; 
            part.update(newX, newY);
        });
    }
    drawAll(){
        this.particles.forEach((part)=>{
            part.draw(this.ctx); 
        });
    }
}

//base particle emitter
export class ParticleEmitter{
    constructor(canvas, x1, y1){
        this.canvas = canvas;
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x1 + 10;
        this.y2 = y1;
        this.rate = 10; // ticks per particles spawn || average of 60 ticks per second
        this.density = 1; // number of particles spawned per rate (number of ticks)
        this.tickTracker = 0;
        this.lifeSpan = -1;
        this.spanTracker = 0;
        this.active = true;
        this.sizeMin = 10; // ALL MIN and MAX are whole numbers
        this.sizeMax = 20;
        this.dirXmin = -1;
        this.dirXmax = 1;
        this.dirYmin = -1;
        this.dirYmax = 1;
        this.color = "#66ffff";
        this.alpha = 1;
        this.handler = new ParticleHandler(this.canvas); 
    }
    spawnParticles(bool=false){
        let span = this.lifeSpan * 60;
        if(this.lifeSpan != -1){
            if(this.spanTracker >= span) this.active = false;
        }
        if (this.active){
            this.spanTracker ++;
            this.tickTracker ++;
            if(this.tickTracker >= this.rate){
                for(let i = this.density; i>0; i--){
                    let particle = new Particle(
                        randomNumberDecimal(this.x1, this.x2),
                        randomNumberDecimal(this.y1, this.y2),
                        (bool)? 0: removeZeroRandom(this.dirXmin, this.dirXmax),
                        (bool)? 0: removeZeroRandom(this.dirYmin, this.dirYmax),
                        this.color,
                        randomNumberDecimal(this.sizeMin, this.sizeMax)
                    );
                    particle.shape.fillAlpha = this.alpha;
                    this.handler.particles.push(particle);
                }
                this.tickTracker = 0;
            };
        }
         

    }
}

// ================   UTILS ============== //
export function randomNumberDecimal(min, max) { 
    return Math.random() * (max - min) + min;
}
export function randomNumberWhole(min, max) { 
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
export function removeZeroRandom(min, max){
    let num = randomNumberDecimal(min, max);
    if(num == 0) return 0.3;
    else return num;
}