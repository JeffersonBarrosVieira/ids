document.addEventListener('contextmenu', event => {
    event.preventDefault();
  });

class Electron{
    constructor(info){
        this.position = createVector(info.x0, info.y0);
        this.vMod = info.v0;
        this.direction = createVector(cos(info.theta0*(PI/180)), -sin(info.theta0*(PI/180)))
        this.velocity = createVector(info.v0*this.direction.x,info.v0*this.direction.y)
        this.raio = 5;
    }
    display(){
        strokeWeight(1);
        fill(0, 0, 255);
        ellipse(this.position.x, this.position.y, 2*this.raio, 2*this.raio);
    }
    update(dt){ 
        this.velocity.x = this.vMod * this.direction.x
        this.velocity.y = this.vMod * this.direction.y
        this.position.add(createVector(this.velocity.x * dt, this.velocity.y * dt))
    }
    directionRotate(theta){
        let dirX0 = this.direction.x
        let dirY0 = this.direction.y
        this.direction.x = dirX0* cos(theta) + dirY0* sin(theta);
        this.direction.y = -dirX0* sin(theta) + dirY0* cos(theta);

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
let dt = 1E-8;
let dtheta = (Math.PI/180)*2
let c = 299792458;
let freq = 2E6;
let T = 0

let mover = true;
let rotacionar = false;

let x = [];

let P;


function setup(){
    var canvas1 = createCanvas(800,400);
    canvas1.parent('canvas1');
    
    electron = new Electron({
        x0: width/2,
        y0: height/2,
        v0: 0.9*c,
        theta0: 0
    });
    P = new Matrix(
        L = 1000,
        np = 100,
        nl = 40,
        x0 = electron.position.x,
        y0 = electron.position.y,
        dt = dt
    )
    P.createPoints(electron.position);
}

function draw(){
    background(240);
    
    if(electron.position.dist(createVector(mouseX, mouseY)) < electron.raio){
        overElectron = true
    } else {
        overElectron = false
    }

    T += 1;
    

    if(T%(2) == 0){
        P.createPoints(electron.position)
        P.verifyRadius(700)
    }

    // Lógica Trajetória
    if(rotacionar){
        electron.directionRotate(dtheta);
    }

    if(mover){
        electron.vMod = 0;
    } else {
        electron.vMod = 0.9*c;
    }
        
    // Fim lógica Trajetória
    
    P.display();
    electron.display();
    P.update(c, dt)
    electron.update(dt)
}

function mousePressed(){
    dx = electron.position.x - mouseX;
    dy = electron.position.y - mouseY;

    mouseButton == LEFT ? mover = !mover : 0
    mouseButton == RIGHT ? rotacionar = !rotacionar : 0
}

function mouseDragged(){
    if(overElectron) {
        electron.position.x = mouseX + dx;
        electron.position.y = mouseY + dy;
    }
}