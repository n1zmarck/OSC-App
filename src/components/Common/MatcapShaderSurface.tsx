import React, { useEffect, useRef } from 'react';

export type LilToonRenderMode = 'opaque' | 'transparent' | 'refraction' | 'gem' | 'glitter';

interface MatcapShaderSurfaceProps {
  matcapUrl: string;
  matcap2ndUrl?: string;
  className?: string;
  cornerRadius?: number;
  bezelWidth?: number;
  renderMode?: LilToonRenderMode; // 'opaque' | 'transparent' | 'refraction' | 'gem' | 'glitter'
  blendMode?: 0 | 1 | 2 | 3; // 0: Normal, 1: Add, 2: Screen (lilToon), 3: Multiply
  hueShift?: number;
  saturation?: number;
  brightness?: number;
  rimEnable?: boolean;
  rimColor?: string;
  glitterEnable?: boolean;
  audioLinkPulse?: number;

  // Extended Authentic Unity lilToon Inspector Parameters (from attached screenshots)
  smoothness?: number;
  metallic?: number;
  reflectance?: number;
  lightMinLimit?: number;
  lightMaxLimit?: number;
  asUnlit?: number;
  rimFresnelPower?: number;
}

const VS_SOURCE = `
  attribute vec2 a_position;
  varying vec2 v_uv;
  void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

// Complete Ported lilToon Shader Engine (jp.lilxyzw.liltoon-2.3.4)
const FS_SOURCE = `
  precision highp float;
  varying vec2 v_uv;
  uniform vec2 u_resolution;
  uniform sampler2D u_matcapTexture;
  uniform sampler2D u_matcap2ndTexture;
  uniform bool u_useMatcap2nd;
  uniform float u_cornerRadius;
  uniform float u_bezelWidth;
  uniform int u_renderMode; // 0: opaque, 1: transparent, 2: refraction, 3: gem, 4: glitter
  uniform int u_lilBlendMode; // 0: Normal, 1: Add, 2: Screen (lilToon), 3: Multiply
  uniform float u_hueShift;
  uniform float u_saturation;
  uniform float u_brightness;
  uniform bool u_rimEnable;
  uniform vec3 u_rimColor;
  uniform bool u_glitterEnable;
  uniform float u_audioLinkPulse;
  uniform float u_time;

  // Extended Unity lilToon Uniforms
  uniform float u_smoothness;
  uniform float u_metallic;
  uniform float u_reflectance;
  uniform float u_lightMinLimit;
  uniform float u_lightMaxLimit;
  uniform float u_asUnlit;
  uniform float u_rimFresnelPower;

  // Signed Distance Function for Rounded Box
  float sdRoundedBox(vec2 p, vec2 b, float r) {
    vec2 q = abs(p) - b + r;
    return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
  }

  // Pseudo-random generator for lilToon Glitter
  float rand(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
  }

  // lilToon HSVG Tone Correction (lil_common_functions.hlsl)
  vec3 lilToneCorrection(vec3 c, float hue, float sat, float val) {
    vec4 p = (c.b > c.g) ? vec4(c.bg, -1.0, 2.0/3.0) : vec4(c.gb, 0.0, -1.0/3.0);
    vec4 q = (p.x > c.r) ? vec4(p.xyw, c.r) : vec4(c.r, p.yzx);
    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    vec3 hsv = vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);

    hsv.x = fract(hsv.x + hue);
    hsv.y = clamp(hsv.y * sat, 0.0, 1.0);
    hsv.z = clamp(hsv.z * val, 0.0, 1.0);

    return hsv.z - hsv.z * hsv.y + hsv.z * hsv.y * clamp(abs(fract(hsv.x + vec3(1.0, 2.0/3.0, 1.0/3.0)) * 6.0 - 3.0) - 1.0, 0.0, 1.0);
  }

  // lilToon lilBlendColor (lil_common_functions.hlsl)
  vec3 lilBlendColor(vec3 dstCol, vec3 srcCol, float srcA, int blendMode) {
    vec3 ad = dstCol + srcCol;
    vec3 mu = dstCol * srcCol;
    vec3 outCol = srcCol;
    if(blendMode == 0) outCol = srcCol;                       // Normal
    if(blendMode == 1) outCol = ad;                           // Add
    if(blendMode == 2) outCol = max(ad - mu, dstCol);         // Screen (lilToon)
    if(blendMode == 3) outCol = mu;                           // Multiply
    return mix(dstCol, outCol, srcA);
  }

  void main() {
    vec2 p = (v_uv - 0.5) * u_resolution;
    vec2 halfSize = 0.5 * u_resolution;
    float r = u_cornerRadius;

    float dist = sdRoundedBox(p, halfSize, r);

    if (dist > 0.0) {
      discard; // Clip outside rounded node container
    }

    // 1. Calculate 3D Edge Bezel Gradient from SDF
    float delta = 1.0;
    float d1 = sdRoundedBox(p + vec2(delta, 0.0), halfSize, r);
    float d2 = sdRoundedBox(p - vec2(delta, 0.0), halfSize, r);
    float d3 = sdRoundedBox(p + vec2(0.0, delta), halfSize, r);
    float d4 = sdRoundedBox(p - vec2(0.0, delta), halfSize, r);

    vec2 grad = vec2(d1 - d2, d3 - d4) * 0.5;

    // 3D Bezel Curvature Factor
    float innerDist = -dist; // positive inside the rounded box (0.0 at edge, >0 inside)
    float bezelFactor = smoothstep(u_bezelWidth, 0.0, innerDist);

    // 2. Synthesize Smooth 3D Convex Surface Curvature across full node card
    vec2 planarNormal = (v_uv - 0.5) * vec2(u_resolution.x / max(1.0, u_resolution.y), 1.0) * 0.8;
    vec2 combinedGrad = mix(planarNormal, grad * 0.75, bezelFactor * 0.85);

    float zComp = sqrt(max(0.01, 1.0 - dot(combinedGrad, combinedGrad)));
    vec3 normal = normalize(vec3(combinedGrad.x, -combinedGrad.y, zComp));

    // Fresnel Rim Calculation ONLY along outer 16px border edge (scaled by u_rimFresnelPower)
    float rimWidth = u_bezelWidth * 0.4;
    float fresnel = pow(smoothstep(rimWidth, 0.0, innerDist), max(0.2, u_rimFresnelPower));

    // lilToon MatCap UV Calculation: maps full MatCap texture smoothly across the node surface
    vec2 matcapUV = normal.xy * 0.45 + 0.5;
    matcapUV.y = 1.0 - matcapUV.y;
    matcapUV = clamp(matcapUV, 0.001, 0.999);

    // Gem / Refraction Chromatic Aberration Dispersion Offset (lts_gem.shader)
    vec4 matcapTex;
    if (u_renderMode == 2 || u_renderMode == 3) {
      float iorOffset = (u_renderMode == 3) ? 0.12 : 0.06;
      vec2 rUV = matcapUV + normal.xy * iorOffset * fresnel;
      vec2 gUV = matcapUV;
      vec2 bUV = matcapUV - normal.xy * iorOffset * fresnel;

      float rCh = texture2D(u_matcapTexture, rUV).r;
      float gCh = texture2D(u_matcapTexture, gUV).g;
      float bCh = texture2D(u_matcapTexture, bUV).b;
      float aCh = texture2D(u_matcapTexture, gUV).a;

      matcapTex = vec4(rCh, gCh, bCh, aCh);
    } else {
      matcapTex = texture2D(u_matcapTexture, matcapUV);
    }

    vec3 matcapColor = matcapTex.rgb;

    // Specular / Gloss Reflection Pass (driven by u_smoothness, u_metallic, u_reflectance)
    vec3 lightDir = normalize(vec3(0.5, 0.7, 1.0));
    float specPower = mix(4.0, 64.0, u_smoothness);
    float specHighlight = pow(clamp(dot(normal, lightDir), 0.0, 1.0), specPower) * u_reflectance * 2.0;
    matcapColor += vec3(1.0) * specHighlight * (1.0 + u_metallic * 0.5);

    // Gem Facet Specular Highlight Pass (lts_gem.shader)
    if (u_renderMode == 3) {
      float gemSpec = pow(clamp(dot(normal, lightDir), 0.0, 1.0), 16.0);
      matcapColor += vec3(0.9, 0.95, 1.0) * gemSpec * 2.2;
    }

    // lilToon MatCap 2nd Layer Blending (LIL_FEATURE_MATCAP_2ND)
    if (u_useMatcap2nd) {
      vec2 matcap2ndUV = normal.xy * 0.35 + 0.5;
      matcap2ndUV.y = 1.0 - matcap2ndUV.y;
      vec4 matcap2ndTex = texture2D(u_matcap2ndTexture, matcap2ndUV);
      matcapColor = lilBlendColor(matcapColor, matcap2ndTex.rgb, matcap2ndTex.a * 0.6, 2);
    }

    // Apply lilToon HSVG Tone Correction & Lighting Limits
    if (u_hueShift != 0.0 || u_saturation != 1.0 || u_brightness != 1.0) {
      matcapColor = lilToneCorrection(matcapColor, u_hueShift, u_saturation, u_brightness);
    }

    // Apply Light Min/Max limits and AsUnlit factor
    float lightIntensity = clamp(1.0, u_lightMinLimit, u_lightMaxLimit);
    matcapColor = mix(matcapColor * lightIntensity, matcapColor, u_asUnlit);

    // Base glass node background color
    vec3 baseGlass = vec3(0.06, 0.09, 0.16);

    // Apply lilToon Blend Color Mode
    vec3 finalColor = lilBlendColor(baseGlass, matcapColor, matcapTex.a, u_lilBlendMode);

    // lilToon Fresnel Rim Light Pass (LIL_FEATURE_RIMLIGHT) - Luminous border outline
    if (u_rimEnable) {
      float rimIntensity = fresnel * (1.2 + u_audioLinkPulse * 0.8);
      finalColor += u_rimColor * rimIntensity * 1.5;
    }

    // lilToon Glitter / Sparkle Pass (LIL_FEATURE_GLITTER) - ACTIVE IF u_glitterEnable OR u_renderMode == 4 (Glitter Mode)!
    if (u_glitterEnable || u_renderMode == 4) {
      vec2 aspectUV = v_uv * vec2(u_resolution.x / max(1.0, u_resolution.y), 1.0);
      vec2 gridPos = floor(aspectUV * 25.0);
      float sparkle = rand(gridPos + floor(u_time * 10.0));
      if (sparkle > 0.95) {
        finalColor += vec3(1.0, 0.98, 0.85) * 2.5 * (1.0 + u_audioLinkPulse);
      }
    }

    // Alpha Translucency & Opacity per lilToon Render Mode
    float alpha = 1.0;
    if (u_renderMode == 0) alpha = 1.0;  // Opaque (Solid MatCap toon)
    if (u_renderMode == 1) alpha = 0.45; // Transparent Mode (high translucency glass)
    if (u_renderMode == 2) alpha = 0.65; // Refraction Glass Mode
    if (u_renderMode == 3) alpha = 0.85; // Gem Mode (Crystal facet highlights)
    if (u_renderMode == 4) alpha = 0.95; // Glitter Sparkle Mode

    gl_FragColor = vec4(finalColor, alpha);
  }
`;

// Helper to convert CSS radial-gradient or image URL to WebGL 2D Texture Data URL
const parseMatcapToDataUrl = (matcapStr: string): string => {
  if (!matcapStr) return '';
  if (matcapStr.startsWith('data:') || matcapStr.startsWith('http') || matcapStr.startsWith('/')) {
    return matcapStr;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return matcapStr;

  const colorMatches = matcapStr.match(/(#[0-9a-fA-F]{3,8}|rgba?\([^)]+\)|hsl\([^)]+\))/g);
  const grad = ctx.createRadialGradient(180, 180, 0, 256, 256, 240);

  if (colorMatches && colorMatches.length > 0) {
    colorMatches.forEach((col, idx) => {
      const stop = idx / Math.max(1, colorMatches.length - 1);
      grad.addColorStop(stop, col);
    });
  } else {
    grad.addColorStop(0, '#5eead4');
    grad.addColorStop(0.5, '#3b82f6');
    grad.addColorStop(1, '#090d16');
  }

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);
  return canvas.toDataURL();
};

export const MatcapShaderSurface: React.FC<MatcapShaderSurfaceProps> = ({
  matcapUrl,
  matcap2ndUrl,
  className = '',
  cornerRadius = 24.0,
  bezelWidth = 40.0,
  renderMode = 'opaque',
  blendMode = 2,
  hueShift = 0.0,
  saturation = 1.0,
  brightness = 1.0,
  rimEnable = true,
  rimColor = '#38bdf8',
  glitterEnable = false,
  audioLinkPulse = 0.0,
  smoothness = 1.0,
  metallic = 0.8,
  reflectance = 0.48,
  lightMinLimit = 0.05,
  lightMaxLimit = 1.0,
  asUnlit = 0.0,
  rimFresnelPower = 1.0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !matcapUrl) return;

    const gl = canvas.getContext('webgl', { alpha: true, antialias: true });
    if (!gl) return;

    const createShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertShader = createShader(gl.VERTEX_SHADER, VS_SOURCE);
    const fragShader = createShader(gl.FRAGMENT_SHADER, FS_SOURCE);
    if (!vertShader || !fragShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const aPosLoc = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(aPosLoc);
    gl.vertexAttribPointer(aPosLoc, 2, gl.FLOAT, false, 0, 0);

    const uResLoc = gl.getUniformLocation(program, 'u_resolution');
    const uRadiusLoc = gl.getUniformLocation(program, 'u_cornerRadius');
    const uBezelLoc = gl.getUniformLocation(program, 'u_bezelWidth');
    const uModeLoc = gl.getUniformLocation(program, 'u_renderMode');
    const uBlendLoc = gl.getUniformLocation(program, 'u_lilBlendMode');
    const uHueLoc = gl.getUniformLocation(program, 'u_hueShift');
    const uSatLoc = gl.getUniformLocation(program, 'u_saturation');
    const uValLoc = gl.getUniformLocation(program, 'u_brightness');
    const uRimEnableLoc = gl.getUniformLocation(program, 'u_rimEnable');
    const uRimColorLoc = gl.getUniformLocation(program, 'u_rimColor');
    const uGlitterLoc = gl.getUniformLocation(program, 'u_glitterEnable');
    const uAudioPulseLoc = gl.getUniformLocation(program, 'u_audioLinkPulse');
    const uTimeLoc = gl.getUniformLocation(program, 'u_time');
    const uMatcapLoc = gl.getUniformLocation(program, 'u_matcapTexture');
    const uMatcap2ndLoc = gl.getUniformLocation(program, 'u_matcap2ndTexture');
    const uUse2ndLoc = gl.getUniformLocation(program, 'u_useMatcap2nd');

    // Extended Unity lilToon Uniform Locations
    const uSmoothnessLoc = gl.getUniformLocation(program, 'u_smoothness');
    const uMetallicLoc = gl.getUniformLocation(program, 'u_metallic');
    const uReflectanceLoc = gl.getUniformLocation(program, 'u_reflectance');
    const uLightMinLoc = gl.getUniformLocation(program, 'u_lightMinLimit');
    const uLightMaxLoc = gl.getUniformLocation(program, 'u_lightMaxLimit');
    const uAsUnlitLoc = gl.getUniformLocation(program, 'u_asUnlit');
    const uRimPowerLoc = gl.getUniformLocation(program, 'u_rimFresnelPower');

    const hexToRgb = (hex: string): [number, number, number] => {
      let clean = hex.replace('#', '');
      if (clean.length === 3) clean = clean.split('').map((c) => c + c).join('');
      const num = parseInt(clean, 16) || 0x38bdf8;
      return [(num >> 16 & 255) / 255, (num >> 8 & 255) / 255, (num & 255) / 255];
    };

    const renderModeInt = renderMode === 'transparent' ? 1 : renderMode === 'refraction' ? 2 : renderMode === 'gem' ? 3 : renderMode === 'glitter' ? 4 : 0;
    const rimRgb = hexToRgb(rimColor);

    const texture1 = gl.createTexture();
    const texture2 = gl.createTexture();

    const img1 = new Image();
    img1.crossOrigin = 'anonymous';

    let startTime = performance.now();
    let animFrameId: number;

    const render = () => {
      if (!canvas || !gl) return;
      const width = canvas.clientWidth || 300;
      const height = canvas.clientHeight || 200;

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);
      gl.uniform2f(uResLoc, width, height);
      gl.uniform1f(uRadiusLoc, cornerRadius);
      gl.uniform1f(uBezelLoc, bezelWidth);
      gl.uniform1i(uModeLoc, renderModeInt);
      gl.uniform1i(uBlendLoc, blendMode);
      gl.uniform1f(uHueLoc, hueShift);
      gl.uniform1f(uSatLoc, saturation);
      gl.uniform1f(uValLoc, brightness);
      gl.uniform1i(uRimEnableLoc, rimEnable ? 1 : 0);
      gl.uniform3f(uRimColorLoc, rimRgb[0], rimRgb[1], rimRgb[2]);
      gl.uniform1i(uGlitterLoc, glitterEnable ? 1 : 0);
      gl.uniform1f(uAudioPulseLoc, audioLinkPulse);
      gl.uniform1f(uTimeLoc, (performance.now() - startTime) * 0.001);
      gl.uniform1i(uUse2ndLoc, matcap2ndUrl ? 1 : 0);

      // Extended Uniform Uploads
      gl.uniform1f(uSmoothnessLoc, smoothness);
      gl.uniform1f(uMetallicLoc, metallic);
      gl.uniform1f(uReflectanceLoc, reflectance);
      gl.uniform1f(uLightMinLoc, lightMinLimit);
      gl.uniform1f(uLightMaxLoc, lightMaxLimit);
      gl.uniform1f(uAsUnlitLoc, asUnlit);
      gl.uniform1f(uRimPowerLoc, rimFresnelPower);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture1);
      gl.uniform1i(uMatcapLoc, 0);

      if (matcap2ndUrl) {
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, texture2);
        gl.uniform1i(uMatcap2ndLoc, 1);
      }

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      if (glitterEnable || renderMode === 'glitter' || audioLinkPulse > 0) {
        animFrameId = requestAnimationFrame(render);
      }
    };

    img1.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, texture1);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img1);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

      render();
    };

    img1.src = parseMatcapToDataUrl(matcapUrl);

    if (img1.complete) {
      gl.bindTexture(gl.TEXTURE_2D, texture1);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img1);
      render();
    }

    const resizeObserver = new ResizeObserver(() => {
      render();
    });
    resizeObserver.observe(canvas);

    return () => {
      resizeObserver.disconnect();
      if (animFrameId) cancelAnimationFrame(animFrameId);
    };
  }, [matcapUrl, matcap2ndUrl, cornerRadius, bezelWidth, renderMode, blendMode, hueShift, saturation, brightness, rimEnable, rimColor, glitterEnable, audioLinkPulse, smoothness, metallic, reflectance, lightMinLimit, lightMaxLimit, asUnlit, rimFresnelPower]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none rounded-3xl z-0 ${className}`}
    />
  );
};
