import { Boundary } from "./boundary";
 
const DEFAULTXLIMIT = 5;
const DEFAULTVEHICLESTEP = 1;
const ALLHEADINGS = 'NESW';

export class Vehicle {

    private step : number;
    x : number;
    y : number;
    private direction : string;

    private moveRecord : string;

    // Allow anyone to check Vehicle setup correct and licence plate
    identifier : string;
    validSetup : boolean;

    constructor(setup : string, boundary : Boundary, identifier? : string) {
           
        // SetUp String correct?
        //const CODE_PATTERN = new RegExp('^([0-' + DEFAULTXLIMIT + ']{1} [0-' + DEFAULTXLIMIT + ']{1} [N|S|E|W]{1}\s?[0-' + DEFAULTXLIMIT + ']?)$');
        const CODE_PATTERN = new RegExp('^([0-' + DEFAULTXLIMIT + ']{1} [0-' + DEFAULTXLIMIT + ']{1} [N|S|E|W]{1}' + 
                                        ((setup.length>6) ? ' [0-' + DEFAULTXLIMIT + ']?' : '') + ')$');
        this.validSetup = CODE_PATTERN.test(setup) && boundary.validSetup;;

        // Parse string to x, y, direction
        if (this.validSetup) {
            let params = setup.split(' '); 
            this.x = parseInt(params[0]);
            this.y = parseInt(params[1]);
            this.direction = params[2];
            this.step = ((params[3] === undefined) ? DEFAULTVEHICLESTEP : parseInt(params[3]));
            this.moveRecord = `(${this.x} ${this.y})`;
            this.validSetup &&= boundary.validateLocation(this.x,this.y);  
        }
        this.identifier = (identifier === undefined ? '' : identifier);
    }

    // Traverse foward moves and rotates
    move(commands : string, boundary : Boundary) {
        commands.split('').forEach(cmd => { this.isRotate(cmd) ? this.rotate(cmd) : this.isTravel(cmd) ? this.travel(boundary,cmd) : 0})
    }

    // Retreive location
    location(boundary : Boundary) : string {
        //console.log(`${this.moves}`)
        return (this.validSetup) ? `${boundary.identifier} ${this.identifier} ${this.x} ${this.y} ${this.direction}`.trim() : ``;
    }

    // Modify Vehicle coverage
    distance(stepSize : number) {
        this.step = stepSize;
    }

    // Alter direction ('NESW') dependent on rotation (L,R)
    private rotate(rotation : string) {
        let pos = ALLHEADINGS.indexOf(this.direction);
        pos = (rotation === 'L'? ((pos === 0)?ALLHEADINGS.length-1:pos += -1) : ((pos === ALLHEADINGS.length-1)?0:pos += 1));
        this.direction = ALLHEADINGS.substring(pos,pos+1);
    }
    
    // Change x, y based upon direction
    private travel(boundary : Boundary, direction : string) {
        const invert = ((direction==='B')? -1 : 1);
        const xStep = ((this.direction==='E')? this.step*invert: ((this.direction==='W')? -this.step*invert: 0)); 
        const yStep = ((this.direction==='N')? this.step*invert: ((this.direction==='S')? -this.step*invert: 0)); 
        if (boundary.validateLocation(this.x + xStep,this.y + yStep)) {
            this.x += xStep;
            this.y += yStep; 
            this.moveRecord += `(${this.x} ${this.y})`;
        } 
    }

    private isRotate(cmd : string): Boolean {
        return (cmd === 'L' || cmd === 'R'); }
    
    private isTravel(cmd : string): Boolean {
        return (cmd === 'M' || cmd === 'F' || cmd === 'B'); }      
}

