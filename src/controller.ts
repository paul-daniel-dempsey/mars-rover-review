import {Boundary} from './boundary';
import {Vehicle} from './vehicle';
 
export function Go (boundary : string, boundaryCustom : string[][], vehicle : string, commands : string, identBoundary? : string, identVehicle? :string) : string {

    let plateau = new Boundary(boundary,boundaryCustom,identBoundary);
    let rover = new Vehicle(vehicle,plateau,identVehicle);
    rover.move(commands,plateau);
    return rover.location(plateau);
}

module.exports = {
    Go
};