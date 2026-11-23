import {
  CanvasTexture,
  Mesh,
  NoColorSpace,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Vector2,
  WebGLRenderer,
} from 'three'

// Loaded on demand by HeroPortrait (desktop, mouse, motion allowed), so phones
// and the first paint never download Three.js.

const GRID = 256 // height-map resolution and mesh segments per side
const RISE_MS = 1600

/** Ridged value noise, for stone grain in the relief. */
function rock(x: number, y: number) {
  const hash = (a: number, b: number) => {
    const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453
    return s - Math.floor(s)
  }
  const vnoise = (px: number, py: number) => {
    const xi = Math.floor(px), yi = Math.floor(py), xf = px - xi, yf = py - yi
    const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf)
    const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1)
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v
  }
  let sum = 0, amp = 0.5, f = 1
  for (let o = 0; o < 5; o++) {
    sum += amp * (1 - Math.abs(vnoise(x * f, y * f) * 2 - 1))
    amp *= 0.5
    f *= 2.1
  }
  return sum
}

/**
 * Height map from the cut-out: body mass from the blurred silhouette, ridges
 * from a lighter blur, detail from the photo's own light (red channel), and
 * stone grain (green channel).
 */
function heightMap(photo: HTMLImageElement) {
  const layer = (blur: number) => {
    const c = document.createElement('canvas')
    c.width = GRID
    c.height = GRID
    const g = c.getContext('2d', { willReadFrequently: true })!
    g.filter = blur ? `blur(${blur}px)` : 'none'
    g.drawImage(photo, 0, 0, GRID, GRID)
    return g.getImageData(0, 0, GRID, GRID).data
  }
  const sharp = layer(0), soft = layer(12), mid = layer(3)
  const out = document.createElement('canvas')
  out.width = GRID
  out.height = GRID
  const og = out.getContext('2d')!
  const img = og.createImageData(GRID, GRID)
  for (let i = 0; i < GRID * GRID; i++) {
    const a = sharp[i * 4 + 3] / 255
    const l = (0.299 * sharp[i * 4] + 0.587 * sharp[i * 4 + 1] + 0.114 * sharp[i * 4 + 2]) / 255
    const h = 0.6 * (soft[i * 4 + 3] / 255) + 0.25 * (mid[i * 4 + 3] / 255) + 0.15 * l * a
    img.data[i * 4] = Math.round(Math.min(1, h) * 255)
    img.data[i * 4 + 1] = Math.round(rock((i % GRID) / 14, Math.floor(i / GRID) / 14) * 255)
    img.data[i * 4 + 3] = 255
  }
  og.putImageData(img, 0, 0)
  const tex = new CanvasTexture(out)
  tex.colorSpace = NoColorSpace
  return tex
}

const vertexShader = /* glsl */ `
  uniform sampler2D hmap;
  uniform float rise;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying float vRise;
  float height(vec2 uv) {
    vec4 t = texture2D(hmap, uv);
    return t.r + (t.g - 0.5) * 0.07 * t.r;
  }
  void main() {
    vUv = uv;
    float h = height(uv);
    // High ground finishes last, so the figure grows up out of the photo.
    float e = clamp(rise * 1.5 - h * 0.5, 0.0, 1.0);
    e = 1.0 - pow(1.0 - e, 3.0);
    vRise = e;
    float s = 1.0 / ${GRID.toFixed(1)};
    float dx = height(uv - vec2(s, 0.0)) - height(uv + vec2(s, 0.0));
    float dy = height(uv - vec2(0.0, s)) - height(uv + vec2(0.0, s));
    vNormal = normalize(vec3(dx * 38.0 * e, dy * 38.0 * e, 1.0));
    vec3 p = position + vec3(0.0, 0.0, h * 0.22 * e);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  uniform sampler2D map;
  uniform vec2 spot;     // the pointer, in the photo's 0..1 space (can sit outside it)
  uniform float aspect;  // width / height, so the spot stays round
  uniform float glow;    // 0 = resting light, 1 = the pointer is near
  varying vec2 vUv;
  varying vec3 vNormal;
  varying float vRise;
  void main() {
    vec4 c = texture2D(map, vUv);
    if (c.a < 0.01) discard;
    vec3 n = normalize(vNormal);
    // A lamp held just above the pointer: light rakes across the relief from
    // wherever the pointer is, so every ridge shades as it moves.
    vec2 d = (spot - vUv) * vec2(aspect, 1.0);
    vec3 l = normalize(vec3(d, 0.42));
    float diffuse = max(dot(n, l), 0.0);
    float near = exp(-dot(d, d) * 3.2);
    float spec = pow(max(dot(reflect(-l, n), vec3(0.0, 0.0, 1.0)), 0.0), 18.0);
    // Resting: a soft top-left light. Pointer near: the lamp takes over.
    float rest = 0.62 + 0.75 * max(dot(n, normalize(vec3(-0.6, 0.7, 0.9))), 0.0);
    float lamp = 0.42 + 1.15 * diffuse * (0.35 + 0.65 * near);
    float lit = mix(rest, lamp, glow);
    vec3 col = c.rgb * lit + vec3(1.0, 0.72, 0.32) * spec * near * glow * 0.55;
    // Flat, it is exactly the photo; risen, it is lit like carved stone.
    gl_FragColor = vec4(mix(c.rgb, col, vRise), c.a);
  }
`

/**
 * Turns the hero photo into a lit relief on the given canvas: it starts
 * identical to the photo, rises once, and afterwards the light follows the
 * pointer. It draws only while something is changing. Returns a cleanup.
 */
export function mountTerrain(photo: HTMLImageElement, canvas: HTMLCanvasElement, onReady: () => void) {
  let renderer: WebGLRenderer
  try {
    renderer = new WebGLRenderer({ canvas, alpha: true, premultipliedAlpha: false, antialias: true })
  } catch {
    return () => {}
  }
  renderer.setClearColor(0x000000, 0)
  const scene = new Scene()
  const camera = new PerspectiveCamera(18, 1, 0.1, 20)
  // Copy at the file's own size: handing WebGL the <img> itself uses its
  // laid-out size and the upload fails.
  const copy = document.createElement('canvas')
  copy.width = photo.naturalWidth
  copy.height = photo.naturalHeight
  copy.getContext('2d')!.drawImage(photo, 0, 0)
  const map = new CanvasTexture(copy)
  map.colorSpace = NoColorSpace
  const hmap = heightMap(photo)
  const spot = new Vector2(0.2, 0.15)
  const material = new ShaderMaterial({
    uniforms: {
      map: { value: map },
      hmap: { value: hmap },
      rise: { value: 0 },
      spot: { value: spot },
      aspect: { value: 1 },
      glow: { value: 0 },
    },
    vertexShader,
    fragmentShader,
    transparent: true,
  })
  const mesh = new Mesh(new PlaneGeometry(2, 2, GRID - 1, GRID - 1), material)
  scene.add(mesh)

  const size = () => {
    const w = photo.offsetWidth, h = photo.offsetHeight
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    mesh.scale.set(w / h, 1, 1)
    material.uniforms.aspect.value = w / h
    // Far enough back that the flat plane exactly fills the box.
    camera.position.set(0, 0, 1 / Math.tan((camera.fov * Math.PI) / 360))
    camera.updateProjectionMatrix()
  }
  size()

  let raf = 0, start = 0, glowTarget = 0
  const target = spot.clone()
  const draw = () => renderer.render(scene, camera)
  const tick = (now: number) => {
    raf = 0
    const rise = Math.min(1, (now - start) / RISE_MS)
    material.uniforms.rise.value = rise
    spot.lerp(target, 0.18)
    const glow = material.uniforms.glow.value as number
    material.uniforms.glow.value = glow + (glowTarget - glow) * 0.12
    draw()
    const settled = spot.distanceTo(target) < 0.001 && Math.abs(glowTarget - material.uniforms.glow.value) < 0.004
    if (rise < 1 || !settled) raf = requestAnimationFrame(tick)
  }
  const kick = () => {
    if (!raf) raf = requestAnimationFrame(tick)
  }
  const onMove = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect()
    const u = (e.clientX - r.left) / r.width
    const v = 1 - (e.clientY - r.top) / r.height
    target.set(u, v)
    // The lamp brightens as the pointer comes within half a portrait of it.
    const away = Math.max(0, Math.max(-u, u - 1, -v, v - 1))
    glowTarget = Math.max(0, 1 - away * 2)
    kick()
  }
  const onResize = () => {
    size()
    kick()
  }

  draw() // the first frame matches the photo, so the swap is invisible
  onReady()
  start = performance.now()
  kick()
  window.addEventListener('pointermove', onMove, { passive: true })
  window.addEventListener('resize', onResize)
  return () => {
    cancelAnimationFrame(raf)
    window.removeEventListener('pointermove', onMove)
    window.removeEventListener('resize', onResize)
    mesh.geometry.dispose()
    material.dispose()
    map.dispose()
    hmap.dispose()
    renderer.dispose()
  }
}
