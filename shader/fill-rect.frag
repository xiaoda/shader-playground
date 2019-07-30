#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

bool isBetween (vec2 pointA, vec2 pointB, vec2 pointC, vec2 pointD, float x) {
  return (x - pointA.x) * (x - pointB.x) * (x - pointC.x) * (x - pointD.x) <= 0.;
}
bool isBetweenByOdd (vec2[4] points, float x) {
  int smallerCount = 0;
  int biggerCount = 0;
  for (int i = 0; i < 4; i++) {
    float pointX = mix(x, points[i].x, points[i].y);
    smallerCount = x >= pointX ? smallerCount + 1 : smallerCount;
    biggerCount = x <= pointX ? biggerCount + 1 : biggerCount;
  }
  return bool(smallerCount) && bool(biggerCount) &&
         (mod(float(smallerCount), 2.) != 0. || mod(float(biggerCount), 2.) != 0.);
}
vec3 getPointBetweenPointsByX (vec2 pointA, vec2 pointB, float x) {
  bool outOfRange = (x - pointA.x) * (x - pointB.x) > 0.;
  bool sameX = pointA.x == pointB.x;
  float ratio = (x - pointA.x) / (pointB.x - pointA.x);
  float y = pointA.y + (pointB.y - pointA.y) * ratio;
  return outOfRange || sameX ? vec3(0., 0., 0.) : vec3(x, y, 1.);
}
vec3 getPointBetweenPointsByY (vec2 pointA, vec2 pointB, float y) {
  bool outOfRange = (y - pointA.y) * (y - pointB.y) > 0.;
  bool sameY = pointA.y == pointB.y;
  float ratio = (y - pointA.y) / (pointB.y - pointA.y);
  float x = pointA.x + (pointB.x - pointA.x) * ratio;
  return outOfRange || sameY ? vec3(0., 0., 0.) : vec3(x, y, 1.);
}
bool isPointInRect (vec2[4] vertices, vec2 point) {
  vec2 horizontalPointsX[4];
  vec2 verticalPointsY[4];
  int horizontalPointsXCount = 0;
  int verticalPointsYCount = 0;
  for (int i = 0; i < 4; i++) {
    vec2 thisVertex = vertices[i];
    vec2 nextVertex = i == 3 ? vertices[0] : vertices[i + 1];
    vec3 horizontalPoint = getPointBetweenPointsByY(thisVertex, nextVertex, point.y);
    horizontalPointsX[i] = horizontalPoint.xz;
    horizontalPointsXCount += 1 * int(horizontalPoint.z);
    vec3 verticalPoint = getPointBetweenPointsByX(thisVertex, nextVertex, point.x);
    verticalPointsY[i] = verticalPoint.yz;
    verticalPointsYCount += 1 * int(verticalPoint.z);
  }
  return isBetweenByOdd(horizontalPointsX, point.x) &&
         isBetweenByOdd(verticalPointsY, point.y);
}

void main () {
  vec4 color = vec4(vec3(.5), 1.);
  vec4 colorBg = vec4(vec3(.95), 1.);
  vec2 vertices[4];
  vertices[0] = vec2(.1, .2);
  vertices[1] = vec2(.2, .9);
  vertices[2] = vec2(.9, .8);
  vertices[3] = vec2(.8, .1);
  vec2 st = gl_FragCoord.xy / u_resolution;
  float pct = isPointInRect(vertices, st) ? 1. : 0.;
  gl_FragColor = mix(colorBg, color, pct);
}
