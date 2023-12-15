"use strict";
/**@type {HTMLCanvasElement} */

class Shape{
    constructor(x, y, width, height, fillColor, fillAlpha, strokeSize, strokeColor, strokeAlpha, dottedArray){
        this.id = "l2l";
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.centerX = this.x + this.width*0.5;
        this.centerY = this.y + this.height*0.5;
        this.fillColor = fillColor || "#333333";
        this.fillAlpha = fillAlpha || 1;
        this.strokeSize = strokeSize || 0;
        this.strokeColor = strokeColor || "#666666";
        this.strokeAlpha = strokeAlpha || 1;
        this.dottedArray = dottedArray || [];
    }
    updateInc(moveX, moveY){
        this.x += moveX;
        this.y += moveY;
        this.centerX = this.x + this.width*0.5;
        this.centerY = this.y + this.height*0.5;
    }
    update(x, y){
        this.x = x;
        this.y = y;
        this.centerX = this.x + this.width*0.5;
        this.centerY = this.y + this.height*0.5;  
    }
    beginDraw(context){
        context.save();
        context.fillStyle = this.fillColor;
        context.strokeStyle = this.strokeColor;
        context.lineWidth = this.strokeSize;
        context.globalAlpha = this.fillAlpha;
    }
    endDraw(context){
        context.fill();
        if (this.strokeSize > 0){
            context.globalAlpha = this.strokeAlpha;
            context.setLineDash(this.dottedArray);
            context.stroke();
        }
        context.restore();
    }
}

export class Rectangle extends Shape{
    constructor(x, y, width, height, fillColor, fillAlpha, strokeSize, strokeColor, strokeAlpha){
        super(x, y, width, height, fillColor, fillAlpha, strokeSize, strokeColor, strokeAlpha);
    }
    isMouseOn(mouseX, mouseY){
        if(mouseX >= this.x && mouseX <= this.x + this.width && mouseY >= this.y && mouseY <=this.y + this.height) return true;
        else return false ;     
    }
    draw(context){
        super.beginDraw(context);
        context.beginPath();
        context.rect(this.x, this.y, this.width, this.height);
        context.closePath();
        super.endDraw(context);       
    }
}
export class RoundRectangle extends Shape{
    constructor(x, y, width, height, cornerRadius, fillColor, fillAlpha, strokeSize, strokeColor, strokeAlpha){
        super(x, y, width, height, fillColor, fillAlpha, strokeSize, strokeColor, strokeAlpha);
        this.cornerRadius = cornerRadius;
    }
    isMouseOn(mouseX, mouseY){
        if(mouseX >= this.x && mouseX <= this.x + this.width && mouseY >= this.y && mouseY <=this.y + this.height) return true;
        else return false;      
    }
    draw(context){
        super.beginDraw(context);
        if (this.width < 2 * this.cornerRadius) this.cornerRadius = this.width / 2;
        if (this.height < 2 * this.cornerRadius) this.cornerRadius = this.height / 2;
        context.beginPath();
        context.moveTo(this.x + this.cornerRadius, this.y);
        context.arcTo(this.x + this.width, this.y, this.x + this.width, this.y + this.height, this.cornerRadius);
        context.arcTo(this.x + this.width, this.y + this.height, this.x, this.y + this.height, this.cornerRadius);
        context.arcTo(this.x, this.y + this.height, this.x, this.y, this.cornerRadius);
        context.arcTo(this.x, this.y, this.x + this.width, this.y, this.cornerRadius);
        context.closePath();
        super.endDraw(context);
    }
}
export class Ellipse extends Shape{
    constructor(x, y, width, height, fillColor, fillAlpha, strokeSize, strokeColor, strokeAlpha){
        super(x, y, width, height, fillColor, fillAlpha, strokeSize, strokeColor, strokeAlpha);
        this.radiusX = this.width * 0.5;
        this.radiusY = this.height * 0.5;
    }
    isMouseOn(mouseX, mouseY){
        let distance = Math.pow(mouseX - this.centerX, 2) / Math.pow(this.radiusX, 2) + Math.pow(mouseY - this.centerY,2) / Math.pow(this.radiusY,2);
        if (distance<1) return true;
        else return false;
    }
    draw(context){
        super.beginDraw(context);
        context.beginPath();
        context.ellipse(this.centerX, this.centerY, this.radiusX, this.radiusY, 0, 0, Math.PI * 2);
        context.closePath();
        super.endDraw(context);
    } 
}
export class Triangle extends Shape{
    constructor(x, y, width, height, percentage, rotation, fillColor, fillAlpha, strokeSize, strokeColor, strokeAlpha){
        super(x, y, width, height, fillColor, fillAlpha, strokeSize, strokeColor, strokeAlpha);
        this.centerY = this.y + this.height*0.6;
        this.percentage = percentage || 0.5;
        this.rotation = - rotation || 0;
        this.point1 = [this.x + this.width * this.percentage, this.y];
        this.point2 = [this.x + this.width, this.y + this.height];
        this.point3 = [this.x, this.y + this.height];
    }
    #trigUpdate(){
        this.point1 = [this.x + this.width * this.percentage, this.y];
        this.point2 = [this.x + this.width, this.y + this.height];
        this.point3 = [this.x, this.y + this.height];
        this.point1 = rotate(this.centerX, this.centerY, this.point1[0], this.point1[1], this.rotation);
        this.point2 = rotate(this.centerX, this.centerY, this.point2[0], this.point2[1],this.rotation);
        this.point3 = rotate(this.centerX, this.centerY, this.point3[0], this.point3[1],this.rotation);
        
    }
    update(x,y){
        super.update(x,y);
        this.centerY = this.y + this.height*0.6;
    }
    isMouseOn(mouseX, mouseY){
        let A = trigArea(this.point1[0], this.point1[1], this.point2[0], this.point2[1], this.point3[0], this.point3[1]);
        let A1 = trigArea(mouseX, mouseY, this.point2[0], this.point2[1], this.point3[0], this.point3[1]);
        let A2 = trigArea(this.point1[0], this.point1[1], mouseX, mouseY, this.point3[0], this.point3[1]);
        let A3 = trigArea(this.point1[0], this.point1[1], this.point2[0], this.point2[1], mouseX, mouseY,);
        if(A == A1 + A2 +A3) return true;
        else return false;
    }
    draw(context){
        this.#trigUpdate();
        super.beginDraw(context);
        context.beginPath();
        context.moveTo(this.point1[0], this.point1[1]);
        context.lineTo(this.point2[0], this.point2[1]);
        context.lineTo(this.point3[0], this.point3[1]);
        context.closePath();
        super.endDraw(context);
    } 
}

///==================  Shape Utils ==================

export function rotate(cx, cy, x, y, angle) {
    let radians = (Math.PI / 180) * angle,
        cos = Math.cos(radians),
        sin = Math.sin(radians),
        nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
        ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
    return [nx, ny];
}

export function trigArea(x1, y1, x2, y2, x3, y3){
    return Math.abs((x1*(y2-y3)+ x2*(y3-y1)+x3*(y1-y2))*0.5)
}

