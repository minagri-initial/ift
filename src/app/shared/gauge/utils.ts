/*
  Utility methods
*/
function percToDeg(perc) {
    return perc * 360;
}

export function percToRad(perc) {
    return degToRad(percToDeg(perc));
}

function degToRad(deg) {
    return deg * Math.PI / 180;
}
