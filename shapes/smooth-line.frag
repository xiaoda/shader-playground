#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

bool isBetween (float limitA, float limitB, float x) {
  return (x - limitA) * (x - limitB) <= 0.;
}

float formatAngle (float angle) {
  return abs(angle) > 180. ? angle + 360. * (angle / abs(angle)) * -1. : angle;
}

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
  return formatAngle(angleBX - angleAX);
}

vec2 transformPointByAngle (vec2 point, float angle) {
  float distance = distance(point, vec2(0., 0.));
  float pointAngle = getAngle(vec2(0., 0.), vec2(1., 0.), point);
  float distAngle = formatAngle(pointAngle + angle);
  vec2 distPoint;
  distPoint.x = sqrt(pow(distance, 2.) / (1. + pow(tan(radians(distAngle)), 2.)));
  distPoint.x = distAngle > 90. || distAngle < -90. ? distPoint.x * -1. : distPoint.x;
  distPoint.y =
    abs(distAngle) == 90. ?
    distance * (distAngle / abs(distAngle)) :
    distPoint.x * tan(radians(distAngle));
  return distPoint;
}

float getPointDistanceFromLine (vec2[2] vertices, vec2 point) {
  vec2 thisVertex = vertices[0];
  vec2 nextVertex = vertices[1];
  vec2 translatedNextVertex = nextVertex - thisVertex;
  vec2 translatedPoint = point - thisVertex;
  vec2 transformedNextVertex = vec2(
    distance(translatedNextVertex, vec2(0, 0)), 0
  );
  float angle = getAngle(vec2(0., 0.), translatedNextVertex, transformedNextVertex);
  vec2 trasformedPoint = transformPointByAngle(translatedPoint, angle);
  float distance =
    isBetween(0., transformedNextVertex.x, trasformedPoint.x) ?
    abs(trasformedPoint.y) :
    min(
      distance(trasformedPoint, vec2(0., 0.)),
      distance(trasformedPoint, transformedNextVertex)
    );
  return distance;
}

void main () {
  vec4 color = vec4(vec3(.5), 1.);
  vec4 colorBg = vec4(vec3(.95), 1.);
  vec2 vertices[2];
  vertices[0] = vec2(.1, .2);
  vertices[1] = vec2(.5, .6);
  vec2 st = gl_FragCoord.xy / u_resolution;
  float pct = 1. - smoothstep(.01, .015, getPointDistanceFromLine(vertices, st));
  gl_FragColor = mix(colorBg, color, pct);
}
