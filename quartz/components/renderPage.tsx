import { render } from "preact-render-to-string"
import { QuartzComponent, QuartzComponentProps } from "./types"
import HeaderConstructor from "./Header"
import BodyConstructor from "./Body"
import { JSResourceToScriptElement, StaticResources } from "../util/resources"
import { FullSlug, RelativeURL, joinSegments, normalizeHastElement } from "../util/path"
import { clone } from "../util/clone"
import { visit } from "unist-util-visit"
import { Root, Element, ElementContent } from "hast"
import { GlobalConfiguration } from "../cfg"
import { i18n } from "../i18n"
import { styleText } from "util"

interface RenderComponents {
  head: QuartzComponent
  header: QuartzComponent[]
  beforeBody: QuartzComponent[]
  pageBody: QuartzComponent
  afterBody: QuartzComponent[]
  left: QuartzComponent[]
  right: QuartzComponent[]
  footer: QuartzComponent
}

function DappledLight(zIndex: number) {
  return (
    <div id="dappled-light" style={`z-index: ${zIndex};`}>
      <div id="glow"></div>
      <div id="glow-bounce"></div>
      <div class="perspective">
        <div id="leaves"></div>
        <div id="blinds">
          <div class="shutters">
            <div class="shutter"></div>
            <div class="shutter"></div>
            <div class="shutter"></div>
            <div class="shutter"></div>
            <div class="shutter"></div>
            <div class="shutter"></div>
            <div class="shutter"></div>
            <div class="shutter"></div>
            <div class="shutter"></div>
            <div class="shutter"></div>
            <div class="shutter"></div>
            <div class="shutter"></div>
            <div class="shutter"></div>
            <div class="shutter"></div>
            <div class="shutter"></div>
            <div class="shutter"></div>
            <div class="shutter"></div>
          </div>
          <div class="vertical">
            <div class="bar"></div>
            <div class="bar"></div>
            <div class="bar"></div>
            <div class="bar"></div>
            <div class="bar"></div>
            <div class="bar"></div>
          </div>
        </div>
      </div>
      <div id="progressive-blur">
        <div></div>
        <div></div>
      </div>
    </div>
  )
}

function PlumBackground(zIndex: number) {
  return (
    <bg-plum
      class="plum-background"
      style={`z-index: ${zIndex}; position: fixed; top: 0; bottom: 0; left: 0; right: 0; pointer-events: none;`}
    >
      <canvas></canvas>
    </bg-plum>
  )
}

const headerRegex = new RegExp(/h[1-6]/)
export function pageResources(
  baseDir: FullSlug | RelativeURL,
  staticResources: StaticResources,
): StaticResources {
  const contentIndexPath = joinSegments(baseDir, "static/contentIndex.json")
  const contentIndexScript = `const fetchData = fetch("${contentIndexPath}").then(data => data.json())`

  const resources: StaticResources = {
    css: [
      {
        content: joinSegments(baseDir, "index.css"),
      },
      ...staticResources.css,
    ],
    js: [
      {
        src: joinSegments(baseDir, "prescript.js"),
        loadTime: "beforeDOMReady",
        contentType: "external",
      },
      {
        loadTime: "beforeDOMReady",
        contentType: "inline",
        spaPreserve: true,
        script: contentIndexScript,
      },
      ...staticResources.js,
    ],
    additionalHead: staticResources.additionalHead,
  }

  resources.js.push({
    src: joinSegments(baseDir, "postscript.js"),
    loadTime: "afterDOMReady",
    moduleType: "module",
    contentType: "external",
  })

  resources.js.push({
    loadTime: "afterDOMReady",
    contentType: "inline",
    spaPreserve: true,
    script: `
      (function() {
        function initCanvas(canvas, width = 400, height = 400, _dpi) {
          const ctx = canvas.getContext('2d');
          const dpr = window.devicePixelRatio || 1;
          const bsr = ctx.webkitBackingStorePixelRatio || ctx.mozBackingStorePixelRatio || ctx.msBackingStorePixelRatio || ctx.oBackingStorePixelRatio || ctx.backingStorePixelRatio || 1;
          const dpi = _dpi || dpr / bsr;
          canvas.style.width = width + 'px';
          canvas.style.height = height + 'px';
          canvas.width = dpi * width;
          canvas.height = dpi * height;
          ctx.scale(dpi, dpi);
          return { ctx, dpi };
        }

        function polar2cart(x = 0, y = 0, r = 0, theta = 0) {
          const dx = r * Math.cos(theta);
          const dy = r * Math.sin(theta);
          return [x + dx, y + dy];
        }

        class BgPlumElement extends HTMLElement {
          constructor() {
            super();
            this.rafId = null;
            this.initialized = false;
          }

          connectedCallback() {
            // Only initialize once, persist across navigation
            if (this.initialized) return;
            this.initialized = true;
            const R180 = Math.PI;
            const R90 = Math.PI / 2;
            const R15 = Math.PI / 12;
            const COLOR = '#88888880';
            const THRESHOLD = 30;
            const LEN = 6;
            const INTERVAL = 1000 / 40;

            const random = Math.random;
            const randomMiddle = () => random() * 0.6 + 0.2;

            let pendingSteps;
            let lastTime = performance.now();

            const width = window.innerWidth;
            const height = window.innerHeight;
            const canvas = this.querySelector('canvas');
            const { ctx } = initCanvas(canvas, width, height);
            ctx.lineWidth = 1;
            ctx.strokeStyle = COLOR;

            const step = (x, y, rad, counter = { value: 0 }) => {
              const length = random() * LEN;
              const [nx, ny] = polar2cart(x, y, length, rad);
              ctx.beginPath();
              ctx.moveTo(x, y);
              ctx.lineTo(nx, ny);
              ctx.stroke();
              counter.value += 1;

              if (nx < -100 || nx > width + 100 || ny < -100 || ny > height + 100)
                return;

              const rad1 = rad + random() * R15;
              const rad2 = rad - random() * R15;
              const rate = counter.value <= THRESHOLD ? 0.8 : 0.5;

              if (random() < rate)
                pendingSteps.push(() => step(nx, ny, rad1, counter));
              if (random() < rate)
                pendingSteps.push(() => step(nx, ny, rad2, counter));
            };

            const frame = () => {
              const now = performance.now();
              if (now - lastTime < INTERVAL) return;
              lastTime = now;

              const steps = [];
              pendingSteps = pendingSteps.filter((i) => {
                if (Math.random() > 0.5) {
                  steps.push(i);
                  return false;
                }
                return true;
              });
              steps.forEach((fn) => fn());
            };

            const startFrame = () => {
              this.rafId = requestAnimationFrame(() => {
                if (pendingSteps.length) {
                  frame();
                  startFrame();
                } else {
                  if (this.rafId) {
                    cancelAnimationFrame(this.rafId);
                    this.rafId = null;
                  }
                }
              });
            };

            const start = () => {
              ctx.clearRect(0, 0, canvas.width, canvas.height);

              pendingSteps = [
                () => step(randomMiddle() * width, -5, R90),
                () => step(randomMiddle() * width, height + 5, -R90),
                () => step(-5, randomMiddle() * height, 0),
                () => step(width + 5, randomMiddle() * height, R180),
              ];
              if (width < 640) pendingSteps = pendingSteps.slice(0, 2);

              startFrame();
            };

            start();
          }

          disconnectedCallback() {
            if (this.rafId) {
              cancelAnimationFrame(this.rafId);
              this.rafId = null;
            }
          }
        }

        if (!customElements.get('bg-plum')) {
          customElements.define('bg-plum', BgPlumElement);
        }
      })();
    `,
  })



  return resources
}

function renderTranscludes(
  root: Root,
  cfg: GlobalConfiguration,
  slug: FullSlug,
  componentData: QuartzComponentProps,
  visited: Set<FullSlug>,
) {
  // process transcludes in componentData
  visit(root, "element", (node, _index, _parent) => {
    if (node.tagName === "blockquote") {
      const classNames = (node.properties?.className ?? []) as string[]
      if (classNames.includes("transclude")) {
        const inner = node.children[0] as Element
        const transcludeTarget = (inner.properties["data-slug"] ?? slug) as FullSlug
        if (visited.has(transcludeTarget)) {
          console.warn(
            styleText(
              "yellow",
              `Warning: Skipping circular transclusion: ${slug} -> ${transcludeTarget}`,
            ),
          )
          node.children = [
            {
              type: "element",
              tagName: "p",
              properties: { style: "color: var(--secondary);" },
              children: [
                {
                  type: "text",
                  value: `Circular transclusion detected: ${transcludeTarget}`,
                },
              ],
            },
          ]
          return
        }
        visited.add(transcludeTarget)

        const page = componentData.allFiles.find((f) => f.slug === transcludeTarget)
        if (!page) {
          return
        }

        let blockRef = node.properties.dataBlock as string | undefined
        if (blockRef?.startsWith("#^")) {
          // block transclude
          blockRef = blockRef.slice("#^".length)
          let blockNode = page.blocks?.[blockRef]
          if (blockNode) {
            if (blockNode.tagName === "li") {
              blockNode = {
                type: "element",
                tagName: "ul",
                properties: {},
                children: [blockNode],
              }
            }

            node.children = [
              normalizeHastElement(blockNode, slug, transcludeTarget),
              {
                type: "element",
                tagName: "a",
                properties: { href: inner.properties?.href, class: ["internal", "transclude-src"] },
                children: [
                  { type: "text", value: i18n(cfg.locale).components.transcludes.linkToOriginal },
                ],
              },
            ]
          }
        } else if (blockRef?.startsWith("#") && page.htmlAst) {
          // header transclude
          blockRef = blockRef.slice(1)
          let startIdx = undefined
          let startDepth = undefined
          let endIdx = undefined
          for (const [i, el] of page.htmlAst.children.entries()) {
            // skip non-headers
            if (!(el.type === "element" && el.tagName.match(headerRegex))) continue
            const depth = Number(el.tagName.substring(1))

            // lookin for our blockref
            if (startIdx === undefined || startDepth === undefined) {
              // skip until we find the blockref that matches
              if (el.properties?.id === blockRef) {
                startIdx = i
                startDepth = depth
              }
            } else if (depth <= startDepth) {
              // looking for new header that is same level or higher
              endIdx = i
              break
            }
          }

          if (startIdx === undefined) {
            return
          }

          node.children = [
            ...(page.htmlAst.children.slice(startIdx, endIdx) as ElementContent[]).map((child) =>
              normalizeHastElement(child as Element, slug, transcludeTarget),
            ),
            {
              type: "element",
              tagName: "a",
              properties: { href: inner.properties?.href, class: ["internal", "transclude-src"] },
              children: [
                { type: "text", value: i18n(cfg.locale).components.transcludes.linkToOriginal },
              ],
            },
          ]
        } else if (page.htmlAst) {
          // page transclude
          node.children = [
            {
              type: "element",
              tagName: "h1",
              properties: {},
              children: [
                {
                  type: "text",
                  value:
                    page.frontmatter?.title ??
                    i18n(cfg.locale).components.transcludes.transcludeOf({
                      targetSlug: page.slug!,
                    }),
                },
              ],
            },
            ...(page.htmlAst.children as ElementContent[]).map((child) =>
              normalizeHastElement(child as Element, slug, transcludeTarget),
            ),
            {
              type: "element",
              tagName: "a",
              properties: { href: inner.properties?.href, class: ["internal", "transclude-src"] },
              children: [
                { type: "text", value: i18n(cfg.locale).components.transcludes.linkToOriginal },
              ],
            },
          ]
        }
      }
    }
  })
}

export function renderPage(
  cfg: GlobalConfiguration,
  slug: FullSlug,
  componentData: QuartzComponentProps,
  components: RenderComponents,
  pageResources: StaticResources,
): string {
  // make a deep copy of the tree so we don't remove the transclusion references
  // for the file cached in contentMap in build.ts
  const root = clone(componentData.tree) as Root
  const visited = new Set<FullSlug>([slug])
  renderTranscludes(root, cfg, slug, componentData, visited)

  // set componentData.tree to the edited html that has transclusions rendered
  componentData.tree = root

  const {
    head: Head,
    header,
    beforeBody,
    pageBody: Content,
    afterBody,
    left,
    right,
    footer: Footer,
  } = components
  const Header = HeaderConstructor()
  const Body = BodyConstructor()

  const LeftComponent = (
    <div class="left sidebar">
      {left.map((BodyComponent) => (
        <BodyComponent {...componentData} />
      ))}
    </div>
  )

  const RightComponent = (
    <div class="right sidebar">
      {right.map((BodyComponent) => (
        <BodyComponent {...componentData} />
      ))}
    </div>
  )

  const lang = componentData.fileData.frontmatter?.lang ?? cfg.locale?.split("-")[0] ?? "en"
  const direction = i18n(cfg.locale).direction ?? "ltr"
  
  // Get layer settings from config
  const layers = cfg.layers ?? {
    grain: { enabled: true, zIndex: 9999 },
    plum: { enabled: false, zIndex: 1 },
    shutters: { enabled: true, zIndex: 0 },
  }
  
  const doc = (
    <html lang={lang} dir={direction}>
      <Head {...componentData} />
      <body data-slug={slug} class={layers.grain.enabled ? "grain-enabled" : ""} style={layers.grain.enabled ? `--grain-z-index: ${layers.grain.zIndex};` : ""}>
        {layers.plum.enabled && PlumBackground(layers.plum.zIndex)}
        {layers.shutters.enabled && DappledLight(layers.shutters.zIndex)}
        <div id="quartz-root" class="page">
          <Body {...componentData}>
            {LeftComponent}
            <div class="center">
              <div class="page-header">
                <Header {...componentData}>
                  {header.map((HeaderComponent) => (
                    <HeaderComponent {...componentData} />
                  ))}
                </Header>
                <div class="popover-hint">
                  {beforeBody.map((BodyComponent) => (
                    <BodyComponent {...componentData} />
                  ))}
                </div>
              </div>
              <Content {...componentData} />
              <hr />
              <div class="page-footer">
                {afterBody.map((BodyComponent) => (
                  <BodyComponent {...componentData} />
                ))}
              </div>
            </div>
            {RightComponent}
            <Footer {...componentData} />
          </Body>
        </div>
      </body>
      {pageResources.js
        .filter((resource) => resource.loadTime === "afterDOMReady")
        .map((res) => JSResourceToScriptElement(res, true))}
    </html>
  )

  return "<!DOCTYPE html>\n" + render(doc)
}
