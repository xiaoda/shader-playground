#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

bool onStroke (vec2 st, vec4 xywh, float stroke) {
  // todo
  return st.x >= xywh.x && st.y >= xywh.y &&
         st.x <= xywh.x + xywh.z && st.y <= xywh.y + xywh.w;
}

void main () {
  vec4 color = vec4(vec3(.5), 1.);
  vec4 colorBg = vec4(vec3(.95), 1.);

  vec4 xywh = vec4(.1, .1, .2, .2);
  float stroke = .01;
  vec2 st = gl_FragCoord.xy / u_resolution;
  float pct = onStroke(st, xywh, stroke) ? 1. : 0.;

  gl_FragColor = pct * color + (1. - pct) * colorBg;
}
