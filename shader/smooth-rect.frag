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

float getDistanceBetweenPoints (vec2 pointA, vec2 pointB) {
  return sqrt(pow(pointA.x - pointB.x, 2.) + pow(pointA.y - pointB.y, 2.));
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
  float distance = getDistanceBetweenPoints(point, vec2(0., 0.));
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

bool isPointInRect (vec2[4] vertices, vec2 point) {
  float totalAngle = 0.;
  for (int i = 0; i < 4; i++) {
    vec2 thisVertex = vertices[i];
    vec2 nextVertex = i == 3 ? vertices[0] : vertices[i + 1];
    totalAngle += getAngle(point, thisVertex, nextVertex);
  }
  return abs(totalAngle) >= 359. && abs(totalAngle) <= 361.;
}

float getPointDistanceFromRect (vec2[4] vertices, vec2 point) {
  float distances[4];
  for (int i = 0; i < 4; i++) {
    vec2 thisVertex = vertices[i];
    vec2 nextVertex = i == 3 ? vertices[0] : vertices[i + 1];
    vec2 translatedNextVertex = nextVertex - thisVertex;
    vec2 translatedPoint = point - thisVertex;
    vec2 transformedNextVertex = vec2(
      getDistanceBetweenPoints(translatedNextVertex, vec2(0, 0)), 0
    );
    float angle = getAngle(vec2(0., 0.), translatedNextVertex, transformedNextVertex);
    vec2 trasformedPoint = transformPointByAngle(translatedPoint, angle);
    float distance =
      isBetween(0., transformedNextVertex.x, trasformedPoint.x) ?
      abs(trasformedPoint.y) :
      min(
        getDistanceBetweenPoints(trasformedPoint, vec2(0., 0.)),
        getDistanceBetweenPoints(trasformedPoint, transformedNextVertex)
      );
    distances[i] = distance;
  }
  return min(min(min(distances[0], distances[1]), distances[2]), distances[3]);
}

void main () {
  vec4 color = vec4(vec3(.5), 1.);
  vec4 colorBg = vec4(vec3(.95), 1.);
  vec2 vertices[4];
  vertices[0] = vec2(.2, .5);
  vertices[1] = vec2(.5, .8);
  vertices[2] = vec2(.8, .5);
  vertices[3] = vec2(.5, .2);
  vec2 st = gl_FragCoord.xy / u_resolution;
  float pct =
    isPointInRect(vertices, st) ?
    1. :
    1. - min(getPointDistanceFromRect(vertices, st) * 300., 1.);
  gl_FragColor = mix(colorBg, color, pct);
}
