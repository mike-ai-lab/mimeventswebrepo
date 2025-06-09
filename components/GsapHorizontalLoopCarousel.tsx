
import React, { useLayoutEffect, useRef } from 'react';
// FIX: Changed imports to use a CDN to resolve the module resolution error.
import { gsap } from 'https://esm.sh/gsap';
import { Draggable } from 'https://esm.sh/gsap/Draggable';
import { InertiaPlugin } from 'https://esm.sh/gsap/InertiaPlugin';
import { GalleryImageItem } from '../types';


gsap.registerPlugin(Draggable, InertiaPlugin);

interface GsapHorizontalLoopCarouselProps {
  projects: GalleryImageItem[];
}

// Define a type for the timeline returned by horizontalLoop to avoid `any`
// This adds more type safety to the component
interface LoopTimeline extends gsap.core.Timeline {
  // Custom methods added by the horizontalLoop function
  next: (vars?: gsap.TweenVars) => gsap.core.Tween;
  previous: (vars?: gsap.TweenVars) => gsap.core.Tween;
  toIndex: (index: number, vars?: gsap.TweenVars) => gsap.core.Tween;
  current: () => number;
  closestIndex: (setCurrent?: boolean) => number;
  times: number[];
  draggable?: Draggable; // Assuming Draggable is correctly typed by its import

  // Explicitly declare methods/properties that TypeScript might not find on gsap.core.Timeline from CDN
  // Signatures based on GSAP documentation for Timeline instances

  // Methods for controlling time
  totalTime(): number;
  totalTime(value: number, suppressEvents?: boolean): this;
  rawTime(): number;
  duration(): number;
  duration(value: number): this;
  time(): number;
  time(value: number, suppressEvents?: boolean): this;
  progress(): number;
  progress(value: number, suppressEvents?: boolean): this;

  // Methods for manipulation
  clear(labels?: boolean): this;
  to(targets: gsap.TweenTarget, vars: gsap.TweenVars, position?: any): this;
  fromTo(targets: gsap.TweenTarget, fromVars: gsap.TweenVars, toVars: gsap.TweenVars, position?: any): this;
  add(child: any, position?: any): this;

  // Properties
  labels: { [key: string]: number };

  // Other control methods
  tweenTo(timeOrLabel: number | string, vars?: gsap.TweenVars): gsap.core.Tween;
  pause(atTime?: any, suppressEvents?: boolean): this;
  play(from?: number | string, suppressEvents?: boolean): this;
  resume(from?: number | string, suppressEvents?: boolean): this;
}

const GsapHorizontalLoopCarousel: React.FC<GsapHorizontalLoopCarouselProps> = ({ projects }) => {
  const mainWrapperRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const navCounterRef = useRef<HTMLDivElement>(null);
  const prevButtonRef = useRef<HTMLButtonElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);

  function slideImgUpdate() {
    if (!carouselRef.current) return;
    const slidesNodeList = carouselRef.current.querySelectorAll<HTMLDivElement>(".carousel-slide");
    slidesNodeList.forEach(slide => {
      const img = slide.querySelector("img");
      if (img) {
        const rect = slide.getBoundingClientRect();
        const prog = gsap.utils.mapRange(-rect.width, window.innerWidth, 0, 1, rect.x);
        const val = gsap.utils.clamp(0, 1, prog);

        const scaleFactor = 1.2; 
        const max_xPercent_shift = 8; 
        const xShift = gsap.utils.interpolate(max_xPercent_shift, -max_xPercent_shift, val); 

        gsap.set(img, { 
          scale: scaleFactor, 
          xPercent: xShift 
        });
      }
    });
  }

  useLayoutEffect(() => {
    // A GSAP context is used for easier cleanup.
    let ctx = gsap.context(() => {
      if (!carouselRef.current || projects.length === 0) return;

      const slidesArray = gsap.utils.toArray<HTMLDivElement>(".carousel-slide", carouselRef.current);

      if (slidesArray.length === 0) return;

      let activeSlide: HTMLDivElement | null = null;
      let firstRun = true;

      // Ensure .carousel-nav is found by GSAP context
      // gsap.set(".carousel-nav", { display: "flex" }); // Removed: display:flex is handled by CSS
      gsap.set(carouselRef.current, { overflow: "visible", "scroll-snap-type": "none" });


      function horizontalLoop(items: HTMLDivElement[], config: any): LoopTimeline {
        let timeline: LoopTimeline;
        items = gsap.utils.toArray<HTMLDivElement>(items);
        config = config || {};

        let onChange = config.onChange,
          lastIndex = 0,
          tl = gsap.timeline({
            repeat: config.repeat,
            onUpdate: function(this: gsap.core.Timeline) {
              slideImgUpdate(); // Call the parallax update function
              if (onChange) {
                let i = (tl as LoopTimeline).closestIndex();
                if (lastIndex !== i) {
                  lastIndex = i;
                  onChange(items[i], i);
                }
              }
            },
            paused: config.paused,
            defaults: { ease: "none" },
            onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100)
          }) as LoopTimeline,
          length = items.length,
          startX = items[0].offsetLeft,
          times: number[] = [],
          widths: number[] = [],
          spaceBefore: number[] = [],
          xPercents: number[] = [],
          curIndex = 0,
          indexIsDirty = false,
          center = config.center,
          pixelsPerSecond = (config.speed || 1) * 100,
          snap = config.snap === false ? (v: number) => v : gsap.utils.snap(config.snap || 1),
          timeOffset = 0,
          container = center === true ? items[0].parentNode as HTMLElement : gsap.utils.toArray(center)[0] as HTMLElement || items[0].parentNode as HTMLElement,
          totalWidth: number,
          getTotalWidth = () => items[length - 1].offsetLeft + xPercents[length - 1] / 100 * widths[length - 1] - startX + spaceBefore[0] + items[length - 1].offsetWidth * Number(gsap.getProperty(items[length - 1], "scaleX")) + (parseFloat(config.paddingRight) || 0),
          populateWidths = () => {
            let b1 = container.getBoundingClientRect(), b2;
            items.forEach((el, i) => {
              widths[i] = parseFloat(gsap.getProperty(el, "width", "px") as string);
              xPercents[i] = snap(parseFloat(gsap.getProperty(el, "x", "px") as string) / widths[i] * 100 + Number(gsap.getProperty(el, "xPercent")));
              b2 = el.getBoundingClientRect();
              spaceBefore[i] = b2.left - (i ? b1.right : b1.left);
              b1 = b2;
            });
            gsap.set(items, { xPercent: i => xPercents[i] });
            totalWidth = getTotalWidth();
          },
          timeWrap: (time: number) => number,
          populateOffsets = () => {
            timeOffset = center ? tl.duration() * (container.offsetWidth / 2) / totalWidth : 0;
            center && times.forEach((t, i) => {
              times[i] = timeWrap(tl.labels!["label" + i] + tl.duration() * widths[i] / 2 / totalWidth - timeOffset);
            });
          },
          getClosest = (values: number[], value: number, wrap: number) => {
            let i = values.length,
              closest = 1e10,
              index = 0, d;
            while (i--) {
              d = Math.abs(values[i] - value);
              if (d > wrap / 2) { d = wrap - d; }
              if (d < closest) { closest = d; index = i; }
            }
            return index;
          },
          populateTimeline = () => {
            let i: number, item: HTMLElement, curX: number, distanceToStart: number, distanceToLoop: number;
            tl.clear();
            for (i = 0; i < length; i++) {
              item = items[i];
              curX = xPercents[i] / 100 * widths[i];
              distanceToStart = item.offsetLeft + curX - startX + spaceBefore[0];
              distanceToLoop = distanceToStart + widths[i] * Number(gsap.getProperty(item, "scaleX"));
              tl.to(item, { xPercent: snap((curX - distanceToLoop) / widths[i] * 100), duration: distanceToLoop / pixelsPerSecond }, 0)
                .fromTo(item, { xPercent: snap((curX - distanceToLoop + totalWidth) / widths[i] * 100) }, { xPercent: xPercents[i], duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond, immediateRender: false }, distanceToLoop / pixelsPerSecond)
                .add("label" + i, distanceToStart / pixelsPerSecond);
              times[i] = distanceToStart / pixelsPerSecond;
            }
            timeWrap = gsap.utils.wrap(0, tl.duration());
          },
          refresh = (deep?: boolean) => {
            let progress = tl.progress();
            tl.progress(0, true);
            populateWidths();
            deep && populateTimeline();
            populateOffsets();
            deep && tl.draggable && (tl.draggable as any).applyBounds && (tl.draggable as any).applyBounds();
            tl.progress(progress, true);
          },
          onResize = () => refresh(true),
          proxy: HTMLDivElement;

        gsap.set(items, { x: 0 });
        populateWidths();
        populateTimeline();
        populateOffsets();
        window.addEventListener("resize", onResize);

        function toIndex(index: number, vars: any) {
          vars = vars || {};
          (Math.abs(index - curIndex) > length / 2) && (index += index > curIndex ? -length : length);
          let newIndex = gsap.utils.wrap(0, length, index),
            time = times[newIndex];
          if (time > tl.time() !== index > curIndex && index !== curIndex) {
            vars.modifiers = { time: timeWrap };
            time += tl.duration() * (index > curIndex ? 1 : -1);
          }
          if (vars.duration === undefined) {
            vars.duration = gsap.utils.clamp(0.5, 2.5, Math.abs(time - tl.time()) / pixelsPerSecond / 5);
          }
          curIndex = newIndex;
          vars.overwrite = true;
          gsap.killTweensOf(proxy);
          return tl.tweenTo(time, vars);
        }
        tl.toIndex = (index, vars) => toIndex(index, vars);
        tl.closestIndex = setCurrent => {
          let index = getClosest(times, tl.time(), tl.duration());
          if (setCurrent) { curIndex = index; indexIsDirty = false; }
          return index;
        };
        tl.current = () => indexIsDirty ? tl.closestIndex(true) : curIndex;
        tl.next = vars => toIndex(tl.current() + 1, vars);
        tl.previous = vars => toIndex(tl.current() - 1, vars);
        tl.times = times;
        tl.progress(1, true).progress(0, true);

        if (config.draggable && typeof (Draggable) === "function") {
          proxy = document.createElement("div")
          let wrap = gsap.utils.wrap(0, 1),
            ratio: number, startProgress: number, draggable: Draggable,
            align = () => tl.progress(wrap(startProgress + (draggable.startX - draggable.x) * ratio)),
            syncIndex = () => tl.closestIndex(true);

          draggable = Draggable.create(proxy, {
            trigger: carouselRef.current,
            type: "x",
            onPressInit() {
              gsap.killTweensOf(tl);
              tl.pause();
              startProgress = tl.progress();
              refresh();
              ratio = 1 / totalWidth;
              gsap.set(proxy, { x: startProgress / -ratio });
            },
            onDrag: align,
            onThrowUpdate: align,
            inertia: true,
            snap(value) {
              let time = -(value * ratio) * tl.duration(),
                wrappedTime = timeWrap(time),
                snapTime = times[getClosest(times, wrappedTime, tl.duration())],
                dif = snapTime - wrappedTime;
              Math.abs(dif) > tl.duration() / 2 && (dif += dif < 0 ? tl.duration() : -tl.duration());
              return (time + dif) / tl.duration() / -ratio;
            },
            onRelease() { syncIndex(); if (draggable.isThrowing) indexIsDirty = true; },
            onThrowComplete: syncIndex
          })[0];
          tl.draggable = draggable;
        }
        tl.closestIndex(true);
        lastIndex = curIndex;
        onChange && onChange(items[curIndex], curIndex);
        timeline = tl;
        return timeline;
      }

      const loop = horizontalLoop(slidesArray, {
        paused: true,
        center: true,
        draggable: true,
        paddingRight: 10,
        onChange: (slide: HTMLDivElement, index: number) => {
          if (activeSlide) {
            gsap.to(activeSlide.querySelectorAll("h2, p.project-category"), { overwrite: true, opacity: 0, ease: "power3.inOut" });
            gsap.to(activeSlide, { opacity: 0.3, ease: "power2.inOut" });
            activeSlide.classList.remove("active");
          }
          slide.classList.add("active");
          activeSlide = slide;

          if (navCounterRef.current) {
            gsap.timeline({ defaults:{ ease:"power1.inOut" } })
              .to(activeSlide, { opacity: 1, ease: "power2.inOut" }, 0)
              .to(navCounterRef.current, { duration: 0.2, opacity: 0, ease: "power1.in" }, 0)
              .set(navCounterRef.current, { innerText: `${index + 1}/${slidesArray.length}` }, 0.2)
              .to(navCounterRef.current, { duration: 0.4, opacity: 0.6, ease: "power1.inOut" }, 0.2)
              .to(activeSlide.querySelectorAll("h2, p.project-category"), { opacity: 1, ease: "power1.inOut" }, 0.3)
              .fromTo(activeSlide.querySelectorAll("h2, p.project-category"), { y: (i) => [40, 60][i] }, { duration: 1.5, y: 0, ease: "expo" }, 0.3)
              .progress(firstRun ? 1 : 0);
          }
        }
      });

      function arrowBtnOver(e: PointerEvent) { gsap.to(e.target as HTMLElement, { opacity: 0.7, scale: 1.1 }); }
      function arrowBtnOut(e: PointerEvent) { gsap.to(e.target as HTMLElement, { opacity: 1, scale: 1 }); }

      nextButtonRef.current?.addEventListener("pointerover", arrowBtnOver);
      nextButtonRef.current?.addEventListener("pointerout", arrowBtnOut);
      nextButtonRef.current?.addEventListener("click", () => loop.next({ duration: 1, ease: "expo" }));

      prevButtonRef.current?.addEventListener("pointerover", arrowBtnOver);
      prevButtonRef.current?.addEventListener("pointerout", arrowBtnOut);
      prevButtonRef.current?.addEventListener("click", () => loop.previous({ duration: 1, ease: "expo" }));

      slidesArray.forEach((slide, i) => {
        slide.addEventListener("click", () => loop.toIndex(i, { duration: 1, ease: "expo" }));
      });

      gsap.set(slidesArray, { opacity: (i) => (i === 0 ? 1 : 0.3) });
      gsap.set(slidesArray[0]?.querySelectorAll("h2, p.project-category"), { opacity: 1 });

      loop.toIndex(0, { duration: 0 });
      firstRun = false;
    }, mainWrapperRef); // Use mainWrapperRef for the GSAP context

    return () => ctx.revert(); // Cleanup GSAP animations and event listeners
  }, [projects]); 

  return (
    <div ref={mainWrapperRef}>
      <div ref={carouselRef} className="carousel" aria-label="Horizontal carousel of projects">
        {projects.map((project) => (
          <div key={project.id} className="carousel-slide">
            <img src={project.src} alt="" /> {/* Alt text is on h2 as per design */}
            <h2>{project.alt}</h2>
            <p className="project-category">{project.category}</p> {/* Changed h5 to p */}
          </div>
        ))}
      </div>
      <nav className="carousel-nav">
        <button ref={prevButtonRef} className="prev" tabIndex={0} aria-label="Previous Slide"></button>
        <div ref={navCounterRef}>1/{projects.length}</div>
        <button ref={nextButtonRef} className="next" tabIndex={0} aria-label="Next Slide"></button>
      </nav>
    </div>
  );
};

export default GsapHorizontalLoopCarousel;