/*
  Hero cinematográfico
  Three.js: a sala em duas camadas (fundo + móveis recortados da mesma foto) dentro de uma moldura que
  vira tela cheia; cada cena (Comprar, Vender, Alugar) tem sua foto, com transição em cortina orgânica.
  GSAP: abertura em letterbox, textos surgindo de máscaras e plano-sequência guiado pela rolagem.
  initHero() devolve uma função de limpeza (usada pelo React ao desmontar).
*/
import {
  WebGLRenderer, Scene, OrthographicCamera, Mesh, PlaneGeometry, ShaderMaterial,
  TextureLoader, LinearSRGBColorSpace, LinearFilter, type Texture,
} from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { asset } from '@/lib/asset';

gsap.registerPlugin(ScrollTrigger);

const SCENES: { url: string; focal?: [number, number] }[] = [
  { url: asset('/assets/room-bg.jpg') },
  { url: asset('/assets/scene-vender.jpg'), focal: [0.5, 0.55] },
  { url: asset('/assets/scene-alugar.jpg'), focal: [0.55, 0.55] },
];

const VERT = `void main(){ gl_Position = vec4(position.xy, 0.0, 1.0); }`;
const COMMON = `
precision highp float;
uniform vec4 rect; uniform vec2 res; uniform float radius, time, grain, t;
float sdRound(vec2 p, vec2 b, float r){ vec2 q = abs(p) - b + r; return length(max(q,0.)) + min(max(q.x,q.y),0.) - r; }
float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233))) * 43758.5453); }
float noise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
  return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y); }
vec2 px(){ return vec2(gl_FragCoord.x, res.y - gl_FragCoord.y); }
float frameMask(vec2 p){ vec2 c = rect.xy + rect.zw*.5; return 1. - smoothstep(-1., 1., sdRound(p - c, rect.zw*.5, radius)); }
vec2 cover(vec2 p, float aspect, float zoom, vec2 focal){
  vec2 uv = (p - rect.xy) / rect.zw;
  float fa = rect.z / rect.w;
  vec2 sc = (fa > aspect ? vec2(1., aspect/fa) : vec2(fa/aspect, 1.)) / zoom;
  vec2 h = sc*.5; vec2 cc = clamp(focal, h, 1.-h);
  uv = (uv - .5) * sc + cc;
  return vec2(uv.x, 1. - uv.y);
}
float edgeOf(vec2 p){ vec2 s = (p - rect.xy) / rect.zw; return s.x*.72 + (1.-s.y)*.28 + (noise(s*vec2(3.,4.) + 2.3) - .5)*.32; }
float wipe(vec2 p){ float prog = t*1.9 - .4; return 1. - smoothstep(prog - .09, prog + .09, edgeOf(p)); }
`;
const BG_FRAG = COMMON + `
uniform sampler2D texA, texB; uniform float aspA, aspB, zoomA, zoomB; uniform vec2 focA, focB;
void main(){
  vec2 p = px();
  float m = frameMask(p);
  if (m <= 0.) discard;
  float w = wipe(p);
  vec3 a = texture2D(texA, cover(p, aspA, zoomA * (1. + t*.06), focA)).rgb;
  vec3 b = texture2D(texB, cover(p, aspB, zoomB * (1.12 - t*.12), focB)).rgb;
  vec3 col = mix(a, b, w);
  float prog = t*1.9 - .4;
  col += (1. - smoothstep(0., .05, abs(edgeOf(p) - prog))) * .10 * step(.001, t) * step(t, .999);
  col += (hash(floor(p) + fract(time) * 91.7) - .5) * grain;
  gl_FragColor = vec4(col, m);
}`;
const FG_FRAG = COMMON + `
uniform sampler2D map; uniform float aspect, zoom, alphaMul; uniform vec2 focal;
void main(){
  vec2 p = px();
  float m = frameMask(p);
  if (m <= 0.) discard;
  vec4 c = texture2D(map, cover(p, aspect, zoom * (1. + t*.06), focal));
  float a = c.a * m * (1. - wipe(p)) * alphaMul;
  if (a <= .002) discard;
  c.rgb += (hash(floor(p) + fract(time) * 53.1) - .5) * grain;
  gl_FragColor = vec4(c.rgb, a);
}`;

type Rect = { x: number; y: number; w: number; h: number; r: number };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerpRect = (a: Rect, b: Rect, t: number): Rect => ({ x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t), w: lerp(a.w, b.w, t), h: lerp(a.h, b.h, t), r: lerp(a.r, b.r, t) });

export function initHero(): () => void {
  const $ = <T extends Element = HTMLElement>(s: string) => document.querySelector(s) as T;
  const $$ = (s: string) => [...document.querySelectorAll<HTMLElement>(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(pointer: fine)').matches;
  const stage = $('.stage');
  const canvas = $<HTMLCanvasElement>('#gl');
  const fallback = $<HTMLImageElement>('.frame-fallback');
  if (!stage || !canvas) return () => {};

  const S = { open: reduce ? 1 : 0, introZoom: reduce ? 0 : 1, f1: 0, f2: 0, dolly: 0, focalY: 0.64, scene: 0, kb1: 0, kb2: 0, mx: 0, my: 0 };

  let renderer: WebGLRenderer | null = null;
  try { renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' }); } catch { renderer = null; }
  if (!renderer) document.documentElement.classList.add('no-webgl');
  const scene = new Scene();
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
  if (renderer) { renderer.outputColorSpace = LinearSRGBColorSpace; renderer.setClearColor(0xffffff, 0); }

  const quad = (frag: string, uniforms: Record<string, { value: unknown }>, order: number) => {
    const base = { rect: { value: [0, 0, 1, 1] }, res: { value: [1, 1] }, radius: { value: 28 }, time: { value: 0 }, grain: { value: 0.03 }, t: { value: 0 } };
    const mat = new ShaderMaterial({ vertexShader: VERT, fragmentShader: frag, transparent: true, depthTest: false, depthWrite: false, uniforms: { ...base, ...uniforms } });
    const m = new Mesh(new PlaneGeometry(2, 2), mat);
    m.frustumCulled = false; m.renderOrder = order; scene.add(m);
    return m;
  };

  const loader = new TextureLoader();
  const textures: Texture[] = [];
  const load = (url: string) => new Promise<Texture>((res, rej) => loader.load(url, tx => {
    tx.generateMipmaps = false; tx.minFilter = LinearFilter; tx.magFilter = LinearFilter; textures.push(tx); res(tx);
  }, undefined, rej));

  let bg: Mesh<PlaneGeometry, ShaderMaterial> | null = null;
  let fg: Mesh<PlaneGeometry, ShaderMaterial> | null = null;
  let tex: { tx: Texture; aspect: number }[] = [];
  let W = 1, H = 1, dpr = 1;
  let L: { A: Rect; F: Rect; E: Rect; mobile: boolean } | null = null;
  let raf = 0, disposed = false, visible = true;
  const ctx = gsap.context(() => {});

  function layout() {
    W = stage.clientWidth; H = stage.clientHeight;
    const nav = $('.nav')?.offsetHeight ?? 76;
    const pad = Math.max(20, Math.min(56, W * 0.04));
    const mobile = W < 900;
    let A: Rect;
    if (mobile) {
      const copy = $('.copy');
      const y = copy.offsetTop + copy.offsetHeight + 22;
      A = { x: pad, y, w: W - pad * 2, h: Math.max(160, H - y - 56), r: 22 };
    } else {
      const x = Math.round(W * 0.53);
      A = { x, y: nav + 26, w: W - pad - x, h: H - nav - 26 - 62, r: 28 };
    }
    const F = { x: 0, y: nav, w: W, h: H - nav, r: 0 };
    const finalH = $('.final').offsetHeight;
    const ew = W - pad * 2;
    const room = H - nav - 24 - finalH - H * (mobile ? 0.05 : 0.07) - 36;
    const E = { x: pad, y: nav + 24, w: ew, h: Math.max(140, mobile ? room : Math.min(ew / 2.39, room)), r: mobile ? 16 : 20 };
    return { A, F, E, mobile };
  }
  function resize() {
    L = layout();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (!renderer) return;
    renderer.setPixelRatio(dpr);
    renderer.setSize(W, H, false);
  }

  function startIntro() {
    const done = () => { document.body.classList.remove('is-intro'); ScrollTrigger.refresh(); };
    if (reduce) { gsap.set('.letterbox', { display: 'none' }); done(); return; }
    document.body.classList.add('is-intro');
    gsap.set('.headline .mask > span', { yPercent: 110 });
    gsap.set('.headline .wd', { fontVariationSettings: '"wdth" 72' });
    gsap.set(['.lede', '.copy .actions', '.nav', '.cue'], { autoAlpha: 0, y: 14 });
    gsap.timeline({ onComplete: done })
      .to('.letterbox .mark :is(rect,path)', { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut', stagger: 0.15 })
      .to('.letterbox .mark', { opacity: 0, duration: 0.35 }, '+=0.05')
      .to('.letterbox .top', { yPercent: -101, duration: 1.3, ease: 'expo.inOut' }, '<')
      .to('.letterbox .bottom', { yPercent: 101, duration: 1.3, ease: 'expo.inOut' }, '<')
      .to(S, { open: 1, duration: 1.7, ease: 'expo.inOut' }, '<0.2')
      .to(S, { introZoom: 0, duration: 2.6, ease: 'power3.out' }, '<')
      .to('.headline .mask > span', { yPercent: 0, duration: 1.3, ease: 'power4.out', stagger: 0.12 }, '<0.55')
      .to('.headline .wd', { fontVariationSettings: '"wdth" 106', duration: 1.8, ease: 'power3.out', stagger: 0.12 }, '<')
      .to(['.lede', '.copy .actions', '.nav', '.cue'], { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08 }, '<0.35')
      .add(() => gsap.set('.nav', { clearProps: 'transform,opacity,visibility' }));
  }

  function buildScroll() {
    const beats = $$('.beat');
    beats.forEach(b => gsap.set(b.querySelectorAll('.mask > span'), { yPercent: 110 }));
    gsap.set('.beat-index', { opacity: 0 });
    gsap.set('.final .mask > span', { yPercent: 110 });
    gsap.set('.final .actions', { autoAlpha: 0, y: 16 });
    const final = $('.final');
    const st = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: '.hero', start: 'top top', end: 'bottom bottom', scrub: reduce ? true : 1,
        onUpdate: self => final.classList.toggle('is-live', self.progress > 0.92),
      },
    });
    const O = 0.3;
    st.to(S, { f1: 1, duration: 2.6, ease: 'power2.inOut' }, O)
      .to('.copy', { y: -120, autoAlpha: 0, duration: 1.3, ease: 'power2.in' }, O)
      .to('.cue', { autoAlpha: 0, duration: 0.4 }, 0)
      .to(S, { dolly: 0.3, duration: 2.6 }, O)
      .to('.scrim', { opacity: 1, duration: 0.8 }, O + 2.0);
    const T0 = O + 2.7, GAP = 2.3;
    st.to(S, { dolly: 1, focalY: 0.45, duration: 2.2 }, O + 2.6);
    beats.forEach((b, i) => {
      const t0 = T0 + i * GAP;
      const h2 = b.querySelectorAll('h2 .mask > span');
      const ps = b.querySelectorAll('p .mask > span');
      const idx = b.querySelector('.beat-index');
      st.to(idx, { opacity: 1, duration: 0.25 }, t0)
        .to(h2, { yPercent: 0, duration: 0.6, ease: 'power3.out' }, t0)
        .to(ps, { yPercent: 0, duration: 0.5, ease: 'power3.out', stagger: 0.08 }, t0 + 0.15)
        .to(h2, { yPercent: -140, opacity: 0, duration: 0.45, ease: 'power3.in' }, t0 + 1.2)
        .to(ps, { yPercent: -140, opacity: 0, duration: 0.4, ease: 'power3.in', stagger: 0.05 }, t0 + 1.2)
        .to(idx, { opacity: 0, duration: 0.25 }, t0 + 1.35);
      if (i < beats.length - 1) st.to(S, { scene: i + 1, duration: 1.0, ease: 'power2.inOut' }, t0 + 1.25);
    });
    st.to(S, { kb1: 1, duration: GAP + 0.8 }, T0 + GAP - 1.0).to(S, { kb2: 1, duration: GAP + 1.6 }, T0 + GAP * 2 - 1.0);
    const F = T0 + GAP * 2 + 1.6;
    st.to(S, { f2: 1, duration: 1.6, ease: 'power3.inOut' }, F)
      .to('.scrim', { opacity: 0, duration: 0.8 }, F)
      .to('.final h2 .mask > span', { yPercent: 0, duration: 0.7, ease: 'power3.out' }, F + 0.9)
      .to('.final p .mask > span', { yPercent: 0, duration: 0.6, ease: 'power3.out' }, F + 1.05)
      .to('.final .actions', { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out' }, F + 1.2)
      .to({}, { duration: 0.6 });
  }

  let pmx = 0, pmy = 0;
  const onPointer = (e: PointerEvent) => { pmx = e.clientX / innerWidth - 0.5; pmy = e.clientY / innerHeight - 0.5; };
  if (!reduce && finePointer) addEventListener('pointermove', onPointer, { passive: true });
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
  io.observe($('.hero'));
  const ro = new ResizeObserver(resize);

  const frameRect = (): Rect => {
    const r = lerpRect(lerpRect(L!.A, L!.F, S.f1), L!.E, S.f2);
    const w = r.w * Math.max(0.004, S.open);
    return { ...r, x: r.x + (r.w - w) / 2, w, r: Math.min(r.r, w / 2) };
  };
  const framing = (i: number, depth: number, pan: number) => {
    const k = reduce ? 0.3 : 1;
    if (i === 0) return { zoom: (1.05 + S.dolly * k * depth) * (1 + S.introZoom * 0.28), focal: [0.5 + S.mx * pan, S.focalY + S.my * pan] };
    const kb = i === 1 ? S.kb1 : S.kb2;
    const f = SCENES[i].focal!;
    return { zoom: 1.04 + kb * 0.09 * k, focal: [f[0] + S.mx * pan, f[1] + S.my * pan] };
  };

  function loop(tms: number) {
    raf = requestAnimationFrame(loop);
    if (!visible || !L) return;
    const time = (tms || 0) / 1000;
    S.mx += (pmx - S.mx) * 0.06; S.my += (pmy - S.my) * 0.06;
    const r = frameRect();
    if (!renderer || !bg || !fg) {
      Object.assign(fallback.style, { left: r.x + 'px', top: r.y + 'px', width: r.w + 'px', height: r.h + 'px', borderRadius: r.r + 'px' });
      return;
    }
    const i = Math.min(Math.floor(S.scene), SCENES.length - 2);
    const t = clamp(S.scene - i);
    const rect = [r.x * dpr, r.y * dpr, r.w * dpr, r.h * dpr];
    const res = [W * dpr, H * dpr];
    for (const q of [bg, fg]) {
      const u = q.material.uniforms;
      u.rect.value = rect; u.res.value = res; u.radius.value = r.r * dpr; u.time.value = time; u.t.value = t;
    }
    const a = framing(i, 0.10, 0.006), b = framing(i + 1, 0.10, 0.006);
    const bu = bg.material.uniforms;
    bu.texA.value = tex[i].tx; bu.texB.value = tex[i + 1].tx;
    bu.aspA.value = tex[i].aspect; bu.aspB.value = tex[i + 1].aspect;
    bu.zoomA.value = a.zoom; bu.zoomB.value = b.zoom; bu.focA.value = a.focal; bu.focB.value = b.focal;
    const fu = fg.material.uniforms;
    const ff = framing(0, 0.125, 0.009);
    fu.zoom.value = ff.zoom; fu.focal.value = ff.focal; fu.alphaMul.value = i === 0 ? 1 : 0;
    renderer.render(scene, camera);
  }

  async function init() {
    if (renderer) {
      try {
        const [tFg, ...tS] = await Promise.all([load(asset('/assets/room-fg.webp')), ...SCENES.map(s => load(s.url))]);
        if (disposed) return;
        tex = tS.map(tx => ({ tx, aspect: (tx.image as HTMLImageElement).width / (tx.image as HTMLImageElement).height }));
        bg = quad(BG_FRAG, {
          texA: { value: tex[0].tx }, texB: { value: tex[1].tx }, aspA: { value: 1 }, aspB: { value: 1 },
          zoomA: { value: 1 }, zoomB: { value: 1 }, focA: { value: [0.5, 0.5] }, focB: { value: [0.5, 0.5] },
        }, 0) as Mesh<PlaneGeometry, ShaderMaterial>;
        const img = tFg.image as HTMLImageElement;
        fg = quad(FG_FRAG, { map: { value: tFg }, aspect: { value: img.width / img.height }, zoom: { value: 1 }, focal: { value: [0.5, 0.6] }, alphaMul: { value: 1 } }, 1) as Mesh<PlaneGeometry, ShaderMaterial>;
        fg.material.uniforms.grain.value = 0.02;
      } catch {
        renderer.dispose(); renderer = null;
        document.documentElement.classList.add('no-webgl');
      }
    }
    if (disposed) return;
    resize();
    ro.observe(stage);
    ctx.add(() => { startIntro(); buildScroll(); });
    raf = requestAnimationFrame(loop);
  }

  init();

  return () => {
    disposed = true;
    cancelAnimationFrame(raf);
    ro.disconnect(); io.disconnect();
    removeEventListener('pointermove', onPointer);
    ctx.revert();
    document.body.classList.remove('is-intro');
    scene.traverse(o => { if ((o as Mesh).isMesh) { (o as Mesh).geometry.dispose(); ((o as Mesh).material as ShaderMaterial).dispose(); } });
    textures.forEach(tx => tx.dispose());
    renderer?.dispose();
  };
}
