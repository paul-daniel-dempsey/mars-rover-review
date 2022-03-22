const DEFAULTXLIMIT = 5;
const DEFAULTYLIMIT = DEFAULTXLIMIT;
 
export class Boundary {

    private xLimit : number = DEFAULTXLIMIT;
    private yLimit : number = DEFAULTYLIMIT;
    private xyAllowGrid : string[][];

    // Allow anyone to check Boundary setup correct and name of area
    identifier : string;
    validSetup : boolean;

    constructor(xySetup : string, xyGrid: string[][], identifer? : string) {
        
        // SetUp string correct?
        const CODE_PATTERN = new RegExp('^([0-' + DEFAULTXLIMIT + ']{1} [0-' + DEFAULTXLIMIT + ']{1})$')
        this.validSetup = CODE_PATTERN.test(xySetup) || !(xyGrid === undefined);
        
        if (this.validSetup && (xyGrid === undefined)) {
            // Parse string to xlimit, ylimit (starts at zero so add 1)
            let params = xySetup.split(' ');
            this.xLimit=parseInt(params[0])+1;
            this.yLimit=parseInt(params[1])+1; 
            this.xyAllowGrid = Array(this.xLimit).fill('Y').map(() => Array(this.yLimit).fill('Y'));
        }
        else if (this.validSetup) {
            // Take Custom Grid (N=vehicle not allowed to enter)
        this.xLimit=xyGrid[1].length;
        this.yLimit=xyGrid.length;
        this.xyAllowGrid = xyGrid.slice().reverse(); // copy/duplicate array, invert Y-axis  
        }
        this.identifier = (identifer === undefined ? '' : identifer);
    }

    // Check location
    validateLocation(x : number, y :number) : boolean {
        return (this.validSetup && x < this.xLimit && x >= 0 && y < this.yLimit && y >= 0) ? (this.xyAllowGrid[y][x] !== 'N') : false;
    }
}