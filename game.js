"use strict";
/**@type {HTMLCanvasElement} */
import {FallingParticles, RisingParticles, StaticBubbleParticles} from "./scripts/ParticleSystems.js";
import{FluidPlayer} from "./scripts/Players.js";

window.onload = init;

function init(){
    const canvas = document.getElementById('gameCanvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');

    window.addEventListener("resize", ()=>{
        window.location.reload();
    })
    //Canvas Gradients
    const gradient1 = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient1.addColorStop(0, "#19ffff");
    gradient1.addColorStop(1, "#ff00ff");
    const gradient2 = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient2.addColorStop(0, "#359edb");
    gradient2.addColorStop(1, "#2d015f");
    const gradient3 = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient3.addColorStop(0, "#6fbdeb");
    gradient3.addColorStop(1, "#4b2774");

    //PLAYER SUB
    const player = new FluidPlayer(canvas, "./images/SubSpritesSimpleSmall.png"); 
    player.sprite.alpha = 0.75;

    //PARTICLES
    const fallingTest = new FallingParticles(canvas);
    fallingTest.emitter.sizeMax = 25;
    fallingTest.emitter.sizeMin = 15;
    fallingTest.emitter.color = gradient1;
    const risingTest = new RisingParticles(canvas);
    risingTest.emitter.color = gradient2;
    risingTest.emitter.alpha = 0.7;
    const staticTest = new StaticBubbleParticles(canvas);
    staticTest.emitter.color = gradient3;

    //logo and direction graphics
    const logo = new Image();
    logo.src = "https://apps4everyone.tech/img/Apps4Logo.svg";
    const directions = new Image();
    directions.src = "./images/DirectionGraphics.png";

    function drawGraphics(){
        ctx.save();
        ctx.globalAlpha = 0.95;
        ctx.drawImage(logo, canvas.width - 200, 15, 175, 175);
        ctx.drawImage(directions, 25, canvas.height - 200, 150, 150);
        ctx.restore();
    }


    function gameLoop(timeStamp) {
        draw();
        requestAnimationFrame(gameLoop);
    }
    
    function draw(){
        ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
        player.draw();
        risingTest.spawn(player.pos);
        staticTest.spawn(player.pos);
        fallingTest.spawn(player.pos);
        drawGraphics();
        
    }

    //start Loop
    requestAnimationFrame(gameLoop);
}



