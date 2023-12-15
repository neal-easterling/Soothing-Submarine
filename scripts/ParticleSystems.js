"use strict";
/**@type {HTMLCanvasElement} */
import {Particle, ParticleHandler, ParticleEmitter } from "./Particles.js";

class ParticleSystem{
    constructor(canvas){
        this.canvas = {
            canvas: canvas,
            left: canvas.getBoundingClientRect().left,
            top: canvas.getBoundingClientRect().top
        };
    }
}

//falling system
export class FallingParticles extends ParticleSystem{
    constructor(canvas){
        super(canvas);
        this.emitter = new ParticleEmitter(canvas, 0, -50);
        this.emitter.x2 = canvas.width;
        this.emitter.dirYmin = 0.5;
        this.emitter.dirYmax = 1.5;
        this.emitter.dirXmin = -0.5;
        this.emitter.dirXmax = 0.5;
        this.emitter.alpha = 0.8;
        this.emitter.handler.ageLimiter = -1;
    }
    update(x, y, radius){
        this.emitter.handler.particles.forEach((part)=>{
            let dx = x - part.shape.x;
            let dy = y - part.shape.y;
            let distance = Math.sqrt(dx*dx + dy*dy);
            if(distance<radius){
                part.shape.updateInc(-(dx/distance), 0 );
            }
        });
    }
    spawn(object){
        this.update(object.x, object.y, object.radius);
        this.emitter.spawnParticles();
        this.emitter.handler.updateAll();
        this.emitter.handler.drawAll();
    }
}

//rising system
export class RisingParticles extends ParticleSystem{
    constructor(canvas){
        super(canvas);
        this.emitter = new ParticleEmitter(canvas, 0, canvas.height + 50);
        this.emitter.x2 = canvas.width;
        this.emitter.dirYmin = -0.5;
        this.emitter.dirYmax = -1.5;
        this.emitter.dirXmin = -0.5;
        this.emitter.dirXmax = 0.5;
        this.emitter.color = "#006666";
        this.emitter.alpha = 0.8;
        this.emitter.handler.ageLimiter = -1;
    }
    update(x, y, radius){
        this.emitter.handler.particles.forEach((part)=>{
            let dx = x - part.shape.x;
            let dy = y - part.shape.y;
            let distance = Math.sqrt(dx*dx + dy*dy);
            if(distance<radius){
                part.shape.updateInc(-(dx/distance), 0 );
            }
        });
    }
    spawn(object){
        this.update(object.x, object.y, object.radius);
        this.emitter.spawnParticles();
        this.emitter.handler.updateAll();
        this.emitter.handler.drawAll();
    }
}

//explosion system
export class ExplosionParticles extends ParticleSystem{
    constructor(canvas){
        super(canvas);
        this.emitter = new ParticleEmitter(canvas, this.canvas.width * 0.5 - 5, this.canvas.height * 0.5);
        this.emitter.dirXmax = this.emitter.dirYmax = 5;
        this.emitter.dirXmin = this.emitter.dirYmin = -5;
        this.emitter.color = "#ff00ff";
        this.emitter.sizeMax = 5;
        this.emitter.sizeMin = 3;
        this.emitter.active = false;
        this.emitter.rate = 1;
        this.emitter.density = 20;
        this.emitter.handler.ageLimiter = 2;
    }
    update(x, y, active){
        this.emitter.x1 = x;
        this.emitter.x2 = x + 1;
        this.emitter.y1 = this.emitter.y2 = y;
        if(active){
            this.emitter.active = true;
            setTimeout((f)=>{
                this.emitter.active = false;
            }, 100);
        }

    }
    spawn(object){
        this.update(object.x, object.y, object.active);
        this.emitter.spawnParticles();
        this.emitter.handler.updateAll();
        this.emitter.handler.drawAll();
    }
}

//mouse motion system ~ static field
export class StaticBubbleParticles extends ParticleSystem{
    constructor(canvas){
        super(canvas);
        this.emitter = new ParticleEmitter(canvas, 0, 0);
        this.emitter.x2 = canvas.width;
        this.emitter.y2 = canvas.height;
        this.emitter.dirXmax = this.emitter.dirYmax = 0;
        this.emitter.dirXmin = this.emitter.dirYmin = 0;
        this.emitter.color = "#00aaaa";
        this.emitter.alpha = 0.8;
        this.emitter.sizeMax = 5;
        this.emitter.sizeMin = 3;
        this.emitter.rate = 1;
        this.emitter.density = this.canvas.canvas.width * 0.9;
        this.emitter.lifeSpan = 0.01;
        this.emitter.handler.ageLimiter = -1;
    }
    update(x, y, radius){
            this.emitter.handler.particles.forEach((particle)=>{
                let dx = x - particle.shape.x;
                let dy = y - particle.shape.y;
                let distance = Math.sqrt(dx*dx + dy*dy);
                let force =(radius-distance)/radius;
                if(distance<radius){
                    particle.shape.updateInc(-(dx/distance) * force, -(dy/distance) * force );

                }else{
                    if(particle.shape.x != particle.initialX){
                        let dx = particle.shape.x - particle.initialX;
                        particle.shape.updateInc(-dx/10, 0);
                    }
                    if(particle.shape.y != particle.initialY){
                        let dy = particle.shape.y - particle.initialY;
                        particle.shape.updateInc(0, -dy/10);
                    }

                }
            });
            
    }
    spawn(object){
        this.update(object.x, object.y, object.radius);
        this.emitter.spawnParticles(true);
        this.emitter.handler.updateAll();
        this.emitter.handler.drawAll();
    }
}