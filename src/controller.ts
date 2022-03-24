import {Boundary} from './boundary';
import {Vehicle} from './vehicle';
 
// Single Rover
export function Go (boundary : string, boundaryCustom : string[][], vehicle : string, commands : string, identBoundary? : string, identVehicle? :string) : string {

    let plateau = new Boundary(boundary,boundaryCustom,identBoundary);
    let rover = new Vehicle(vehicle,plateau,identVehicle);
    rover.move(commands,plateau);
    return rover.location(plateau);
}

// Multiple Sequential Rovers Supported On Same Boundary/Plateau
// Vehicles array input (string[][]) => [['startX startY startDirection','moves','VehicleNameA'],['startX startY startDirection','moves','VehicleNameB'],...]
// Vehicles resting place returned (string) => 'VehicleNameA X Y Direction,VehicleNameB X Y Direction,...'
export function GoMultiple (boundary : string, boundaryCustom : string[][], 
                             vehiclePosCmdsId : string[][], identBoundary? : string,) : string {

    let plateau = new Boundary(boundary,boundaryCustom,identBoundary);
    let lastValidVehicleLocation : string = '';

    vehiclePosCmdsId.forEach(vehicle => { 
        
        let rover = new Vehicle(vehicle[0],plateau,vehicle[2]);
        rover.move(vehicle[1],plateau);
        if (rover.location(plateau) !== '') {
            plateau.inValidateLocation(rover.x,rover.y);
            lastValidVehicleLocation += rover.location(plateau) + ',';
        }
    });
    return lastValidVehicleLocation;
}

module.exports = {
    Go,GoMultiple
};