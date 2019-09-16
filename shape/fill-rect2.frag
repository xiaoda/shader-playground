#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec3 checkYPositive (vec2 vector) {
  bool isPositive = vector.y >= 0.;
  float reversed = isPositive ? 0. : 1.;
  vector = isPositive ? vector : vector * -1.;
  return vec3(vector, reversed);
}

float getAngle (vec2 vertex, vec2 pointA, vec2 pointB) {
  vec3 vectorAXData = checkYPositive(pointA - vertex);
  float angleAX = degrees(atan(vectorAXData.y, vectorAXData.x)) + 180. * vectorAXData.z;
  vec3 vectorBXData = checkYPositive(pointB - vertex);
  float angleBX = degrees(atan(vectorBXData.y, vectorBXData.x)) + 180. * vectorBXData.z;
  float angle = angleBX - angleAX;
  angle = abs(angle) > 180. ? angle + 360. * (angle / abs(angle)) * -1. : angle;
  return angle;
}

bool isPointInRect (vec2[4] vertices, vec2 point) {
  float totalAngle = 0.;
  for (int i = 0; i < 4; i++) {
    vec2 thisVertex = vertices[i];
    vec2 nextVertex = i == 3 ? vertices[0] : vertices[i + 1];
    totalAngle += getAngle(point, thisVertex, nextVertex);
  }
  return abs(totalAngle) >= 359. && abs(totalAngle) <= 361.;
}

void main () {
  vec4 color = vec4(vec3(.5), 1.);
  vec4 colorBg = vec4(vec3(.95), 1.);
  vec2 vertices[4];
  vertices[0] = vec2(.1, .5);
  vertices[1] = vec2(.5, .2);
  vertices[2] = vec2(.9, .5);
  vertices[3] = vec2(.5, .4);
  vec2 st = gl_FragCoord.xy / u_resolution;
  float pct = isPointInRect(vertices, st) ? 1. : 0.;
  gl_FragColor = mix(colorBg, color, pct);
}
