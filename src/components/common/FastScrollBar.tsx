
import { useCallback, useEffect, useRef, useState } from "react";

interface FastScrollBarProps {
    scrollElement: HTMLDivElement | null;
}

export default function FastScrollBar({
    scrollElement,
}: FastScrollBarProps) {
    const trackRef = useRef<HTMLDivElement>(null);
    const draggingRef = useRef(false);
    const dragOffsetRef = useRef(0);

    const [scrollInfo, setScrollInfo] = useState({
        top: 0,
        height: 0,
    });

    const updateScrollInfo = useCallback(() => {
        const element = scrollElement;
        if (!element) return;

        const viewport = element.clientHeight;
        const total = element.scrollHeight;

        if (total <= viewport || viewport === 0) {
            setScrollInfo({ top: 0, height: 0 });
            return;
        }

        const height = Math.max(
            36,
            (viewport / total) * viewport
        );

        const maxTop = viewport - height;
        const top =
            (element.scrollTop / (total - viewport)) * maxTop;

        setScrollInfo({ top, height });
    }, [scrollElement]);

    function moveThumb(clientY: number) {
        const element = scrollElement;
        const track = trackRef.current;

        if (!element || !track) return;

        const trackRect = track.getBoundingClientRect();
        const trackHeight = trackRect.height;

        const thumbHeight = scrollInfo.height;
        const maxThumbTop = trackHeight - thumbHeight;

        if (maxThumbTop <= 0) return;

        const desiredTop =
            clientY - trackRect.top - dragOffsetRef.current;

        const clampedTop = Math.max(
            0,
            Math.min(desiredTop, maxThumbTop)
        );

        const ratio = clampedTop / maxThumbTop;

        element.scrollTo({
            top: ratio * (element.scrollHeight - element.clientHeight),
            behavior: "instant",
        });
    }

    function handlePointerDown(
        event: React.PointerEvent<HTMLDivElement>
    ) {
        if (!scrollElement || !trackRef.current) return;
        if (scrollInfo.height === 0) return;

        event.preventDefault();

        const thumb = event.currentTarget.querySelector(
            "[data-scroll-thumb]"
        );

        const thumbRect = thumb?.getBoundingClientRect();
        const isThumb = thumbRect &&
            event.clientY >= thumbRect.top &&
            event.clientY <= thumbRect.bottom;

        dragOffsetRef.current = isThumb
            ? event.clientY - thumbRect.top
            : scrollInfo.height / 2;

        draggingRef.current = true;
        event.currentTarget.setPointerCapture(event.pointerId);

        moveThumb(event.clientY);
    }

    function handlePointerMove(
        event: React.PointerEvent<HTMLDivElement>
    ) {
        if (!draggingRef.current) return;

        moveThumb(event.clientY);
    }

    function handlePointerUp() {
        draggingRef.current = false;
    }

    useEffect(() => {
        if (!scrollElement) return;

        scrollElement.addEventListener("scroll", updateScrollInfo);

        const resizeObserver = new ResizeObserver(updateScrollInfo);
        resizeObserver.observe(scrollElement);

        const frame = requestAnimationFrame(updateScrollInfo);

        return () => {
            cancelAnimationFrame(frame);
            scrollElement.removeEventListener("scroll", updateScrollInfo);
            resizeObserver.disconnect();
        };
    }, [scrollElement, updateScrollInfo]);

    return (
        <div
            ref={trackRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className="absolute -right-1 top-0 z-20 flex h-full w-7 justify-center touch-none"
        >
            {scrollInfo.height > 0 && (
                <div
                    data-scroll-thumb
                    style={{
                        height: `${scrollInfo.height}px`,
                        transform: `translateY(${scrollInfo.top}px)`,
                    }}
                    className="absolute top-0 w-2 rounded-full bg-purple-400/80 transition-colors hover:bg-purple-300"
                />
            )}
        </div>
    );
}
