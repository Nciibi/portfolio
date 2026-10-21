/* ==========================================================================
   datamosh.js — canvas-2D signal corruption.

   Reproduces the artefacts of a damaged video stream:
     · horizontal band displacement (density-driven, so it reads as a fault
       rather than as static)
     · RGB channel separation (red pulled left, blue pushed right)
     · rectangular block displacement — the MPEG motion-vector look
     · luminance pixel sorting on random bands

   The corruption amount decays toward zero, so a transition resolves back
   into a clean frame. Runs on a capped resolution and only for the
   duration of the transition, then hands the canvas back.
   ========================================================================== */
(function () {
  "use strict";

  const MAX_WIDTH = 900;
  const MAX_HEIGHT = 560;

  function fitCover(image, w, h) {
    const iw = image.naturalWidth || image.width;
    const ih = image.naturalHeight || image.height;
    if (!iw || !ih) return { sx: 0, sy: 0, sw: w, sh: h };
    const scale = Math.max(w / iw, h / ih);
    const sw = w / scale;
    const sh = h / scale;
    return {
      sx: (iw - sw) / 2,
      sy: (ih - sh) / 2,
      sw,
      sh
    };
  }

  /* --- Corruption core ----------------------------------------------------- */
  function corrupt(src, w, h, params) {
    const out = new Uint8ClampedArray(src);
    const density = params.density || 0;
    const maxShift = params.maxShift || 0;
    const split = Math.round(params.channelSplit || 0);
    const blockChance = params.blockChance || 0;
    const blockSize = params.blockSize || 32;

    /* 1 — horizontal band displacement */
    if (density > 0 && maxShift > 0) {
      for (let y = 0; y < h; y += 1) {
        if (Math.random() > density) continue;
        const shift = Math.round((Math.random() * 2 - 1) * maxShift);
        if (!shift) continue;
        const row = y * w * 4;
        for (let x = 0; x < w; x += 1) {
          const sx = (x + shift + w) % w;
          const si = row + sx * 4;
          const di = row + x * 4;
          out[di] = src[si];
          out[di + 1] = src[si + 1];
          out[di + 2] = src[si + 2];
          out[di + 3] = src[si + 3];
        }
      }
    }

    /* 2 — RGB channel separation */
    if (split > 0) {
      for (let y = 0; y < h; y += 1) {
        const row = y * w * 4;
        for (let x = 0; x < w; x += 1) {
          const di = row + x * 4;
          const rx = row + Math.max(0, x - split) * 4;
          const bx = row + Math.min(w - 1, x + split) * 4;
          out[di] = out[rx];
          out[di + 2] = out[bx + 2];
        }
      }
    }

    /* 3 — block displacement */
    if (blockChance > 0) {
      const attempts = Math.round(blockChance * 18);
      for (let k = 0; k < attempts; k += 1) {
        const bw = Math.round(blockSize * (0.5 + Math.random()));
        const bh = Math.round(blockSize * (0.25 + Math.random() * 0.9));
        const sx = Math.floor(Math.random() * Math.max(1, w - bw));
        const sy = Math.floor(Math.random() * Math.max(1, h - bh));
        const dx = Math.floor(Math.random() * Math.max(1, w - bw));
        const dy = Math.floor(Math.random() * Math.max(1, h - bh));
        const copy = new Uint8ClampedArray(bw * bh * 4);
        for (let y = 0; y < bh; y += 1) {
          const so = ((sy + y) * w + sx) * 4;
          copy.set(src.subarray(so, so + bw * 4), y * bw * 4);
        }
        for (let y = 0; y < bh; y += 1) {
          const dof = ((dy + y) * w + dx) * 4;
          out.set(copy.subarray(y * bw * 4, (y + 1) * bw * 4), dof);
        }
      }
    }

    /* 4 — luminance pixel sort on a couple of random bands */
    if (params.pixelSort) {
      const bands = 2;
      for (let b = 0; b < bands; b += 1) {
        const y0 = Math.floor(Math.random() * Math.max(1, h - 6));
        const rows = 2 + Math.floor(Math.random() * 6);
        for (let y = y0; y < Math.min(h, y0 + rows); y += 1) {
          const row = y * w * 4;
          const pixels = [];
          for (let x = 0; x < w; x += 1) {
            const i = row + x * 4;
            pixels.push({
              r: out[i],
              g: out[i + 1],
              b: out[i + 2],
              a: out[i + 3],
              l: 0.299 * out[i] + 0.587 * out[i + 1] + 0.114 * out[i + 2]
            });
          }
          pixels.sort((p, q) => q.l - p.l);
          for (let x = 0; x < w; x += 1) {
            const i = row + x * 4;
            const p = pixels[x];
            out[i] = p.r;
            out[i + 1] = p.g;
            out[i + 2] = p.b;
            out[i + 3] = p.a;
          }
        }
      }
    }

    return out;
  }

  /* --- Runner -------------------------------------------------------------- */
  function run(canvas, image, options) {
    const opts = Object.assign(
      {
        duration: 520,
        intensity: 1,
        onDone: null,
        overlay: null
      },
      options
    );

    if (!canvas || !image) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const reduced = window.FX && window.FX.reduced;
    const rect = canvas.getBoundingClientRect();
    const scale = Math.min(1, MAX_WIDTH / Math.max(1, rect.width), MAX_HEIGHT / Math.max(1, rect.height));
    const w = Math.max(2, Math.round((rect.width || canvas.clientWidth || 640) * scale));
    const h = Math.max(2, Math.round((rect.height || canvas.clientHeight || 360) * scale));
    canvas.width = w;
    canvas.height = h;

    /* Work canvas holds the clean frame; the visible canvas holds the
       corrupted frame. */
    const work = document.createElement("canvas");
    work.width = w;
    work.height = h;
    const workCtx = work.getContext("2d", { willReadFrequently: true });
    const cover = fitCover(image, w, h);
    workCtx.clearRect(0, 0, w, h);
    workCtx.drawImage(image, cover.sx, cover.sy, cover.sw, cover.sh, 0, 0, w, h);

    if (reduced || opts.duration <= 0) {
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(work, 0, 0);
      if (opts.onDone) opts.onDone();
      return;
    }

    const clean = workCtx.getImageData(0, 0, w, h);
    const start = performance.now();
    let lastStep = -1;

    const stop = window.FX.onTick((delta, now) => {
      const t = Math.min(1, (now - start) / opts.duration);
      const decay = Math.pow(1 - t, 1.7);
      const step = Math.floor((now - start) / 55);

      if (step !== lastStep) {
        lastStep = step;
        const params = {
          density: Math.min(0.55, 0.5 * decay * opts.intensity),
          maxShift: Math.round(58 * decay * opts.intensity),
          channelSplit: Math.round(11 * decay * opts.intensity),
          blockChance: 0.55 * decay * opts.intensity,
          blockSize: 26 + Math.round(40 * decay),
          pixelSort: decay > 0.45
        };
        const broken = corrupt(clean.data, w, h, params);
        const frame = ctx.createImageData(w, h);
        frame.data.set(broken);
        ctx.putImageData(frame, 0, 0);
      }

      if (t >= 1) {
        stop();
        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(work, 0, 0);
        if (opts.onDone) opts.onDone();
      }
    });
  }

  /* --- One-shot corruption for a static frame ----------------------------- */
  function glitchStill(canvas, image, intensity) {
    if (!canvas || !image) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const scale = Math.min(1, MAX_WIDTH / Math.max(1, rect.width), MAX_HEIGHT / Math.max(1, rect.height));
    const w = Math.max(2, Math.round((rect.width || 640) * scale));
    const h = Math.max(2, Math.round((rect.height || 360) * scale));
    canvas.width = w;
    canvas.height = h;
    const cover = fitCover(image, w, h);
    ctx.drawImage(image, cover.sx, cover.sy, cover.sw, cover.sh, 0, 0, w, h);
    const frame = ctx.getImageData(0, 0, w, h);
    const broken = corrupt(frame.data, w, h, {
      density: 0.4 * intensity,
      maxShift: Math.round(34 * intensity),
      channelSplit: Math.round(9 * intensity),
      blockChance: 0.4 * intensity,
      blockSize: 30,
      pixelSort: false
    });
    const out = ctx.createImageData(w, h);
    out.data.set(broken);
    ctx.putImageData(out, 0, 0);
  }

  window.Datamosh = { run, corrupt, glitchStill };
})();
