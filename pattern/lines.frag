#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float plot(vec2 st, float y){
  int quantity = 7;
  float density = 1. / float(quantity + 1);
  float pct = 0.;
  for (int i = 0; i < 7; i++) {
    float currentY = y - 1. + density * 2. * float(i + 1);
    pct +=
      //*/
      st.y < density ||
      (st.y > density * 3. && st.y < density * 5.) ||
      st.y > density * 7.
      ? 0. :
      /*/
      //*/
      smoothstep( currentY - .01, currentY, st.y) -
      smoothstep( currentY, currentY + .01, st.y);
  }
  return pct;
}

void main () {
  vec4 color = vec4(vec3(.5), 1.);
  vec4 colorBg = vec4(vec3(.95), 1.);
  vec2 st = gl_FragCoord.xy / u_resolution;

  float y = st.x;
  float pct = min(plot(st, y) + plot(st, y * -1. + 1.), 1.);

  gl_FragColor = color * pct + colorBg * (1. - pct);
}
