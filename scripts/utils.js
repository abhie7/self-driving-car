function lerp(start, end, t) {
  // linear interpolation; t is a value between 0 and 1
  return start + (end - start) * t; // return the value between start and end
}
