#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float getDistanceBetweenPoints (vec2 pointA, vec2 pointB) {
  return sqrt(pow(pointA.x - pointB.x, 2.) + pow(pointA.y - pointB.y, 2.));
}

bool isPointInCircle (vec2 center, float radius, vec2 point) {
  float distance = getDistanceBetweenPoints(center, point);
  return distance <= radius;
}

float getPointDistanceFromCircle (vec2 center, float radius, vec2 point) {
  float distance = getDistanceBetweenPoints(center, point);
  return abs(distance - radius);
}

void main () {
  vec4 color = vec4(vec3(.5), 1.);
  vec4 colorBg = vec4(vec3(.95), 1.);
  vec2 center = vec2(.5, .5);
  float radius = .2;
  vec2 st = gl_FragCoord.xy / u_resolution;
  float pct =
    isPointInCircle(center, radius, st) ?
    1. :
    1. - min(getPointDistanceFromCircle(center, radius, st) * 300., 1.);
  gl_FragColor = mix(colorBg, color, pct);
}
