import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Github, Linkedin, Instagram } from "lucide-react";
import { cn } from "../../../lib/utils";
import void_logo from "../../assets/logo.webp";

// Convert any CSS color to an rgba() string (native, no deps).
export const getRGBA = (
  cssColor: string | undefined,
  fallback = "rgba(180, 180, 180, 1)"
): string => {
  if (typeof window === "undefined") return fallback;
  if (!cssColor) return fallback;
  try {
    const el = document.createElement("div");
    el.style.color = cssColor;
    document.body.appendChild(el);
    const rgb = window.getComputedStyle(el).color; // "rgb(r, g, b)"
    document.body.removeChild(el);
    return rgb.replace(/^rgb\(/, "rgba(").replace(/\)$/, ",1)");
  } catch (e) {
    return fallback;
  }
};

// Set the alpha channel of an rgba()/rgb() string.
export const colorWithOpacity = (color: string, opacity: number): string => {
  if (typeof color !== "string" || !color.startsWith("rgb")) return color;
  const m = color.match(/rgba?\(([^)]+)\)/);
  if (!m) return color;
  const parts = m[1].split(",").map((s) => s.trim());
  return `rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, ${opacity})`;
};

export const useMediaQuery = (query: string) => {
  const [value, setValue] = useState(false);

  useEffect(() => {
    const checkQuery = () => {
      const result = window.matchMedia(query);
      setValue(result.matches);
    };
    checkQuery();
    window.addEventListener("resize", checkQuery);
    const mediaQuery = window.matchMedia(query);
    mediaQuery.addEventListener("change", checkQuery);
    return () => {
      window.removeEventListener("resize", checkQuery);
      mediaQuery.removeEventListener("change", checkQuery);
    };
  }, [query]);

  return value;
};

interface FlickeringGridProps extends React.HTMLAttributes<HTMLDivElement> {
  squareSize?: number;
  gridGap?: number;
  flickerChance?: number;
  color?: string;
  width?: number;
  height?: number;
  maxOpacity?: number;
  text?: string;
  fontSize?: number;
  fontWeight?: number | string;
}

export const FlickeringGrid: React.FC<FlickeringGridProps> = ({
  squareSize = 3,
  gridGap = 3,
  flickerChance = 0.2,
  color = "#4DA3FF",
  width,
  height,
  className,
  maxOpacity = 0.15,
  text = "",
  fontSize = 140,
  fontWeight = 600,
  ...props
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  const memoizedColor = useMemo(() => getRGBA(color), [color]);

  // Rasterise the text once per size change and record which grid cells it
  // covers. Sampling the mask with getImageData for every cell on every frame
  // (the old approach) was thousands of reads per frame and stalled the canvas,
  // so the wordmark often never appeared.
  const buildTextMask = useCallback(
    (cssWidth: number, cssHeight: number, cols: number, rows: number, dpr: number) => {
      const mask = new Uint8Array(cols * rows);
      if (!text || cssWidth <= 0 || cssHeight <= 0) return mask;

      const maskCanvas = document.createElement("canvas");
      maskCanvas.width = Math.max(1, Math.round(cssWidth * dpr));
      maskCanvas.height = Math.max(1, Math.round(cssHeight * dpr));
      const maskCtx = maskCanvas.getContext("2d", { willReadFrequently: true });
      if (!maskCtx) return mask;

      maskCtx.scale(dpr, dpr);
      maskCtx.fillStyle = "#ffffff";
      maskCtx.font = `${fontWeight} ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
      maskCtx.textAlign = "center";
      maskCtx.textBaseline = "middle";
      maskCtx.fillText(text, cssWidth / 2, cssHeight / 2);

      const data = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height).data;
      const step = squareSize + gridGap;
      const sw = Math.max(1, Math.round(squareSize * dpr));
      const sh = Math.max(1, Math.round(squareSize * dpr));

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = Math.round(i * step * dpr);
          const y = Math.round(j * step * dpr);
          let hit = 0;
          for (let yy = y; yy < y + sh && yy < maskCanvas.height; yy++) {
            const rowOffset = yy * maskCanvas.width;
            for (let xx = x; xx < x + sw && xx < maskCanvas.width; xx++) {
              if (data[(rowOffset + xx) * 4 + 3] > 10) {
                hit = 1;
                break;
              }
            }
            if (hit) break;
          }
          mask[i * rows + j] = hit;
        }
      }

      return mask;
    },
    [text, fontSize, fontWeight, squareSize, gridGap]
  );

  const drawGrid = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      pixelWidth: number,
      pixelHeight: number,
      cols: number,
      rows: number,
      squares: Float32Array,
      textMask: Uint8Array,
      dpr: number
    ) => {
      ctx.clearRect(0, 0, pixelWidth, pixelHeight);
      const step = squareSize + gridGap;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const index = i * rows + j;
          const base = squares[index];
          // Cells under the text stay brighter than the flicker, so the
          // wordmark reads clearly through the noise.
          const opacity = textMask[index] ? Math.min(1, base * 3 + 0.5) : base;
          ctx.fillStyle = colorWithOpacity(memoizedColor, opacity);
          ctx.fillRect(i * step * dpr, j * step * dpr, squareSize * dpr, squareSize * dpr);
        }
      }
    },
    [memoizedColor, squareSize, gridGap]
  );

  const setupCanvas = useCallback(
    (canvas: HTMLCanvasElement, cssWidth: number, cssHeight: number) => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.round(cssWidth * dpr));
      canvas.height = Math.max(1, Math.round(cssHeight * dpr));
      canvas.style.width = `${cssWidth}px`;
      canvas.style.height = `${cssHeight}px`;

      const cols = Math.max(1, Math.ceil(cssWidth / (squareSize + gridGap)));
      const rows = Math.max(1, Math.ceil(cssHeight / (squareSize + gridGap)));

      const squares = new Float32Array(cols * rows);
      for (let i = 0; i < squares.length; i++) {
        squares[i] = Math.random() * maxOpacity;
      }

      const textMask = buildTextMask(cssWidth, cssHeight, cols, rows, dpr);

      return { cols, rows, squares, textMask, dpr };
    },
    [squareSize, gridGap, maxOpacity, buildTextMask]
  );

  const updateSquares = useCallback(
    (squares: Float32Array, deltaTime: number) => {
      for (let i = 0; i < squares.length; i++) {
        if (Math.random() < flickerChance * deltaTime) {
          squares[i] = Math.random() * maxOpacity;
        }
      }
    },
    [flickerChance, maxOpacity]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let gridParams: ReturnType<typeof setupCanvas> | null = null;

    const render = (params: ReturnType<typeof setupCanvas>) => {
      drawGrid(
        ctx,
        canvas.width,
        canvas.height,
        params.cols,
        params.rows,
        params.squares,
        params.textMask,
        params.dpr
      );
    };

    const updateCanvasSize = () => {
      const newWidth = width || container.clientWidth;
      const newHeight = height || container.clientHeight;
      setCanvasSize({ width: newWidth, height: newHeight });
      gridParams = setupCanvas(canvas, newWidth, newHeight);
      // Paint one static frame straight away, so the wordmark is visible even
      // before the first animation tick or if the observer is slow to fire.
      render(gridParams);
    };

    updateCanvasSize();

    let lastTime = 0;
    const animate = (time: number) => {
      if (!isInView || !gridParams) return;
      const deltaTime = lastTime ? (time - lastTime) / 1000 : 0;
      lastTime = time;

      updateSquares(gridParams.squares, deltaTime);
      render(gridParams);
      animationFrameId = requestAnimationFrame(animate);
    };

    const resizeObserver = new ResizeObserver(() => updateCanvasSize());
    resizeObserver.observe(container);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0 }
    );
    intersectionObserver.observe(canvas);

    if (isInView) {
      animationFrameId = requestAnimationFrame(animate);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, [setupCanvas, updateSquares, drawGrid, width, height, isInView]);

  return (
    <div ref={containerRef} className={cn("h-full w-full", className)} {...props}>
      <canvas
        ref={canvasRef}
        className="pointer-events-none"
        style={{ width: canvasSize.width, height: canvasSize.height }}
      />
    </div>
  );
};

const footerLinks = [
  {
    title: "Explore",
    links: [
      { id: 1, title: "Projects", to: "/achievements" },
      { id: 2, title: "Research", to: "/resources" },
      { id: 3, title: "Labs", to: "/terminal" },
      { id: 4, title: "Articles", to: "/resources" },
    ],
  },
  {
    title: "Community",
    links: [
      { id: 5, title: "GitHub", href: "https://github.com/V-O-I-D-Society" },
      {
        id: 6,
        title: "LinkedIn",
        href: "https://www.linkedin.com/company/void-society/",
      },
      {
        id: 7,
        title: "Instagram",
        href: "https://www.instagram.com/kiet_voidsociety?igsh=YXZzcGwzOWRvOXZl",
      },
      { id: 8, title: "IRC Chat", to: "/irc" },
    ],
  },
  {
    title: "System",
    links: [
      { id: 9, title: "About Us", to: "/about-us" },
      { id: 10, title: "FAQ", to: "/FAQ" },
      { id: 11, title: "Contact", to: "/contact-us" },
    ],
  },
];

const socialLinks = [
  { href: "https://github.com/V-O-I-D-Society", label: "GitHub", Icon: Github },
  {
    href: "https://www.linkedin.com/company/void-society/",
    label: "LinkedIn",
    Icon: Linkedin,
  },
  {
    href: "https://www.instagram.com/kiet_voidsociety?igsh=YXZzcGwzOWRvOXZl",
    label: "Instagram",
    Icon: Instagram,
  },
];

export const Component = () => {
  const tablet = useMediaQuery("(max-width: 1024px)");

  return (
    <footer
      id="footer"
      className="relative w-full text-[#F4F7FB]"
      style={{
        background:
          "linear-gradient(to bottom, rgba(5,9,20,0) 0%, rgba(5,9,20,0.55) 20%, #050914 34%)",
      }}
    >
      {/* Soft blend blur at the divider with the section above */}

      <div className="flex flex-col px-10 pb-10 pt-16 md:flex-row md:items-start md:justify-between md:pt-20">
        {/* Brand */}
        <div className="mx-0 flex max-w-xs flex-col items-start justify-start gap-y-5">
          <Link to="/" className="flex items-center">
            <img src={void_logo} alt="VOID Logo" className="h-12 w-auto" />
          </Link>
          <p className="font-medium tracking-tight text-[#8493A8]">
            VOID is an experimental engineering and technology community focused
            on building ambitious systems, research, and open-source projects.
          </p>
          <div className="flex items-center gap-3">
            {socialLinks.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-[#8493A8] transition-colors hover:border-[#4DA3FF] hover:text-[#4DA3FF]"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* Link columns */}
        <div className="pt-10 md:w-1/2 md:pt-0">
          <div className="flex flex-col items-start justify-start gap-y-10 md:flex-row md:items-center md:justify-between lg:pl-10">
            {footerLinks.map((column, columnIndex) => (
              <ul key={columnIndex} className="flex flex-col gap-y-2">
                <li className="mb-2 text-sm font-semibold text-white">
                  {column.title}
                </li>
                {column.links.map((link) => (
                  <li
                    key={link.id}
                    className="group inline-flex cursor-pointer items-center justify-start gap-1 text-[15px]/snug text-[#8493A8]"
                  >
                    {"to" in link ? (
                      <Link to={link.to} className="transition-colors hover:text-[#4DA3FF]">
                        {link.title}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors hover:text-[#4DA3FF]"
                      >
                        {link.title}
                      </a>
                    )}
                    <div className="flex size-4 translate-x-0 transform items-center justify-center rounded border border-white/15 opacity-0 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:opacity-100">
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>

      {/* Flickering grid */}
      <div className="relative z-0 mt-24 h-48 w-full md:h-64">
        <div className="absolute inset-0 mx-6">
          <FlickeringGrid
            text={tablet ? "VOID" : "ENTER THE VOID"}
            fontSize={tablet ? 80 : 90}
            className="h-full w-full"
            squareSize={2}
            gridGap={tablet ? 2 : 3}
            color="#4DA3FF"
            maxOpacity={0.25}
            flickerChance={0.1}
          />
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="border-t border-white/10 px-6"
        style={{
          paddingTop: "1.5rem",
          paddingBottom: "calc(1.5rem + env(safe-area-inset-bottom))",
        }}
      >
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-sm text-white md:flex-row">
          <p>&copy; {new Date().getFullYear()} VOID Society. All Rights Reserved.</p>
          <p className="flex items-center gap-2">
            JOIN US ! 
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Component;
