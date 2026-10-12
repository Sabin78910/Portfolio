// Hero aurora: one full-screen fragment shader, ~2 KB. Pauses offscreen; renders one still frame for reduced motion.
const FRAG = `
precision mediump float;
uniform vec2 r; uniform float t; uniform vec2 m;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
  return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+1.),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p*=2.02;a*=.5;}return v;}
void main(){
  vec2 uv=gl_FragCoord.xy/r;
  vec2 p=uv*vec2(r.x/r.y,1.)*1.7;
  float q=fbm(p+vec2(t*.045,-t*.03));
  float w=fbm(p+q*1.9-vec2(t*.035,t*.02));
  vec3 violet=vec3(.545,.486,1.), cyan=vec3(.24,.85,.92), mint=vec3(.27,.94,.71);
  vec3 c=mix(violet,cyan,smoothstep(.38,.78,w));
  c=mix(c,mint,smoothstep(.62,.95,q*w*1.7));
  vec2 ctr=mix(vec2(.78,.72),m,.18);
  float glow=1.-smoothstep(0.,1.15,length((uv-ctr)*vec2(1.15,1.))); // edge0<edge1, else undefined in GLSL
  float a=glow*smoothstep(.15,.85,w)*.95;
  gl_FragColor=vec4(vec3(.027,.031,.043)+c*a,1.);
}`;
const VERT = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';

export function startAurora(canvas: HTMLCanvasElement, still: boolean): ((paused: boolean) => void) | undefined {
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
  if (!gl) return; // CSS gradient fallback stays visible

  const sh = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  };
  const prog = gl.createProgram()!;
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
  gl.useProgram(prog);

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const uR = gl.getUniformLocation(prog, 'r');
  const uT = gl.getUniformLocation(prog, 't');
  const uM = gl.getUniformLocation(prog, 'm');
  const mouse = { x: 0.78, y: 0.72, tx: 0.78, ty: 0.72 };

  // Render at reduced resolution — it's a soft gradient, nobody sees the pixels.
  const resize = () => {
    const scale = Math.min(devicePixelRatio, 1) * 0.5;
    canvas.width = Math.max(1, Math.round(canvas.clientWidth * scale));
    canvas.height = Math.max(1, Math.round(canvas.clientHeight * scale));
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uR, canvas.width, canvas.height);
  };

  const draw = (time: number) => {
    mouse.x += (mouse.tx - mouse.x) * 0.04;
    mouse.y += (mouse.ty - mouse.y) * 0.04;
    gl.uniform1f(uT, time / 1000);
    gl.uniform2f(uM, mouse.x, mouse.y);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  resize();
  addEventListener('resize', () => (resize(), draw(performance.now())));
  draw(12000); // first frame now, even if the animation loop never starts
  canvas.classList.add('is-ready');

  addEventListener('pointermove', (e) => {
    mouse.tx = e.clientX / innerWidth;
    mouse.ty = 1 - e.clientY / innerHeight;
  });

  let raf = 0;
  let onScreen = true;
  let paused = still;
  const loop = (time: number) => {
    draw(time);
    raf = requestAnimationFrame(loop);
  };
  const run = () => {
    cancelAnimationFrame(raf);
    if (!paused && onScreen && !document.hidden) raf = requestAnimationFrame(loop);
  };
  new IntersectionObserver(([e]) => {
    onScreen = e.isIntersecting;
    run();
  }).observe(canvas);
  document.addEventListener('visibilitychange', run);

  return (p: boolean) => {
    paused = still || p; // OS reduced-motion always wins over the page toggle
    run();
  };
}
