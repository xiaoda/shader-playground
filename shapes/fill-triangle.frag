#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

bool isBetween (vec2[3] points, float x) {
  return (x - points[0].x) * (x - points[1].x) * (x - points[2].x) <= 0.;
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
bool isPointInTriangle (vec2[3] vertices, vec2 point) {
  vec2 horizontalPointsX[3];
  vec2 verticalPointsY[3];
  int horizontalPointsXCount = 0;
  int verticalPointsYCount = 0;
  for (int i = 0; i < 3; i++) {
    vec2 thisVertex = vertices[i];
    vec2 nextVertex = i == 2 ? vertices[0] : vertices[i + 1];
    vec3 horizontalPoint = getPointBetweenPointsByY(thisVertex, nextVertex, point.y);
    horizontalPointsX[i] = horizontalPoint.xz;
    horizontalPointsXCount += 1 * int(horizontalPoint.z);
    vec3 verticalPoint = getPointBetweenPointsByX(thisVertex, nextVertex, point.x);
    verticalPointsY[i] = verticalPoint.yz;
    verticalPointsYCount += 1 * int(verticalPoint.z);
  }
  bool enoughPoints = horizontalPointsXCount == 2 &&
                      verticalPointsYCount == 2;
  bool inRange = isBetween(horizontalPointsX, point.x) &&
                 isBetween(verticalPointsY, point.y);
  return enoughPoints && inRange;
}

void main () {
  vec4 color = vec4(vec3(.5), 1.);
  vec4 colorBg = vec4(vec3(.95), 1.);
  vec2 vertices[3];
  vertices[0] = vec2(.1, .2);
  vertices[1] = vec2(.3, .6);
  vertices[2] = vec2(.7, .4);
  vec2 st = gl_FragCoord.xy / u_resolution;
  float pct = isPointInTriangle(vertices, st) ? 1. : 0.;
  gl_FragColor = mix(colorBg, color, pct);
}
