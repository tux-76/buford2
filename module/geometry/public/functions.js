//----------------------------------------------triangle
var triangle = {};
triangle.hasValidAngles = function (a1, a2, a3) {
    return (a1 + a2 + a3 === 180);
}
triangle.hasValidSides = function (s1, s2, s3) {
    // the sum of two sides must be greater than the other side
    return (s1 + s2 > s3 && s2 + s3 > s1 && s1 + s3 > s2);
}

export { triangle }