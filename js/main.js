
class Electron{
    constructor(info){
        this.position = createVector(info.x, info.y);
        this.velocity = createVector(info.v*cos(info.theta),info.v*sin(info.theta))
        this.raio = 5;
    }
    display(){
        strokeWeight(1);
        fill(0, 0, 255);
        ellipse(this.position.x, this.position.y, 2*this.raio, 2*this.raio);
    }
    update(dt){
        this.position.add(createVector(this.velocity.x * dt, this.velocity.y * dt))
    }
} 

class Matrix{
    constructor(L, np, nl, x0, y0){
        this.r = L;
        this.np = np;
        this.nl = nl;
        this.x0 = x0;
        this.y0 = y0;
        this.dtheta = 2*PI/nl;
        this.ondas = [];
    }

    verifyRadius(R){
        let a = this.ondas[0][0].x - this.ondas[0][0].x0
        let b = this.ondas[0][0].y - this.ondas[0][0].y0
        if((a**2 + b**2)**(1/2) > R){
            this.ondas.shift()
        }
    }

    createPoints(pos){
        let onda = []
        for(let theta = 0; theta < 2*PI; theta += this.dtheta){
            onda.push({
                x: pos.x,
                y: pos.y,
                x0: pos.x,
                y0: pos.y,
                direction: [cos(theta), sin(theta)]
            })
        }
        this.ondas.push(onda)
    }

    display(){
        strokeWeight(1);
        fill(0, 0, 0);
        // for(let i = 0; i < this.ondas.length; i++){
        //     for(let j = 0; j < this.ondas[i].length; j++){
        //         ellipse(this.ondas[i][j].x, this.ondas[i][j].y, 1, 1);
        //     }
        // }
        // if(this.ondas.length > 2)
        for(let i = 0; i < this.ondas.length - 1; i++){
            for(let j = 0; j < this.ondas[i].length; j++){
                line(this.ondas[i][j].x, this.ondas[i][j].y, this.ondas[i + 1][j].x, this.ondas[i+1][j].y)
            }
        }
    }

    update(v, dt){
        for(let i = 0; i < this.ondas.length; i++){
            for(let j = 0; j < this.ondas[i].length; j++){
                this.ondas[i][j].x += v*this.ondas[i][j].direction[0]*dt;
                this.ondas[i][j].y += v*this.ondas[i][j].direction[1]*dt;
            }
        }
    }
}

let electron;
let dx;
let dy;
let dt = 0.01;
let t = 0;
let v = 50;

let x = []

let P;

function setup(){
    createCanvas(800,400);
    
    electron = new Electron({
        x: width/2 - 300,
        y: height/2,
        v: 0,
        theta: 0
    });
    P = new Matrix(
        L = 1000,
        np = 100,
        nl = 40,
        x0 = electron.position.x,
        y0 = electron.position.y,
        dt = dt
    )
    P.createPoints(electron.position)
}

function draw(){
    background(240);
    
    

    if(electron.position.dist(createVector(mouseX, mouseY)) < electron.raio){
        overElectron = true
    } else {
        overElectron = false
    }

    t += 1;
    

    if(t%(1*10) == 0){
        P.createPoints(electron.position)
        P.verifyRadius(800)
    }

    if(t > 500 && t < 1500){
        if(electron.position.x > width/2 - 200 && electron.position.x < width/2 + 10){
            electron.velocity = createVector(v*0.90,v*sin(2*PI*t*dt))
        } else {
            electron.velocity = createVector(v*0.98,0)
        }

    } else {
        // electron.velocity = createVector(v*0.98,0)
        electron.velocity = createVector(0,0)
    }
    // electron.velocity = createVector(0,v*sin(2*PI*t*dt))

 
    
    P.display();
    electron.display();
    electron.update(dt)
    P.update(v, dt)
}

function mousePressed(){
    dx = electron.position.x - mouseX;
    dy = electron.position.y - mouseY;
}

function mouseDragged(){
    if(overElectron) {
        electron.position.x = mouseX + dx;
        electron.position.y = mouseY + dy;
    }
}