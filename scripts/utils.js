function lerp(start, end, t) {
  // linear interpolation; t is a value between 0 and 1
  return start + (end - start) * t; // return the value between start and end
}

function getIntersection(A, B, C, D) {
  // A, B are the start and end of the ray, C, D are the start and end of the road border
  const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x); // numerator of t
  const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y); // numerator of u
  const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y); // denominator

  if (bottom != 0) {
    // if the denominator is not zero
    const t = tTop / bottom; // calculate t
    const u = uTop / bottom; // calculate u

    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      // if t and u are between 0 and 1
      return {
        // return the intersection point
        x: lerp(A.x, B.x, t), // x coordinate of the intersection point
        y: lerp(A.y, B.y, t), // y coordinate of the intersection point
        offset: t, // offset of the intersection point
      };
    }
  }
  return null; // return null if there is no intersection
}
