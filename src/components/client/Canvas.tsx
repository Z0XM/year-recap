'use client';

import { CaretUpDown, Eraser } from '@phosphor-icons/react';
import { useEffect, useRef, useState } from 'react';

export function Canvas() {
    const [isDrawing, setIsDrawing] = useState(false);

    const [drawColor, setDrawColor] = useState('#ffffff');

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [collapseCanvas, setCollapseCanvas] = useState(true);

    useEffect(
        () => {
            // define the resize function, which uses the re
            const resize = () => {
                const canvas = canvasRef.current;
                const canvasContainer = document.getElementById('canvas-container');
                if (canvas && canvasContainer) {
                    canvas.width = canvasContainer.clientWidth;
                    const heightRatio = 0.6;
                    canvas.height = canvas.width * heightRatio;
                }
            };
            // call resize() once.
            resize();
            // attach event listeners.
            window.addEventListener('resize', resize);
            // remove listeners on unmount.
            return () => {
                window.removeEventListener('resize', resize);
            };
        },
        [] // no dependencies means that it will be called once on mount.
    );

    return (
        <div id="canvas-container" className="relative col-span-8 flex w-full flex-col justify-center gap-2">
            <button
                type="button"
                onClick={() => {
                    setCollapseCanvas((old) => !old);
                }}
                className="flex w-full cursor-pointer items-center justify-between rounded-lg bg-card px-4 py-2"
            >
                <span>Draw your day ?</span> <CaretUpDown size={20} weight="bold" />
            </button>
            <div
                style={{
                    display: collapseCanvas ? 'none' : 'block'
                }}
                className="relative w-full rounded-lg ring-2 ring-card"
            >
                <canvas
                    className="relative"
                    ref={canvasRef}
                    onMouseDown={(e) => {
                        // know that we are drawing, for future mouse movements.
                        setIsDrawing(true);
                        const context = e.currentTarget.getContext('2d');
                        // begin path.
                        if (context) {
                            context.beginPath();
                            context.lineWidth = 3;
                            context.lineCap = 'round';
                            context.lineJoin = 'round';
                            context.strokeStyle = drawColor;
                            context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
                        }
                    }}
                    onMouseMove={(e) => {
                        // only handle mouse moves when the mouse is already down.
                        if (isDrawing) {
                            const context = e.currentTarget.getContext('2d');
                            if (context) {
                                context.lineWidth = 3;
                                context.lineCap = 'round';
                                context.lineJoin = 'round';
                                context.strokeStyle = drawColor;
                                context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
                                context.stroke();
                            }
                        }
                    }}
                    onMouseUp={() => {
                        // end drawing.
                        setIsDrawing(false);
                    }}
                    onTouchStart={(e) => {
                        // know that we are drawing, for future mouse movements.
                        setIsDrawing(true);
                        const context = e.currentTarget.getContext('2d');
                        // begin path.
                        if (context) {
                            context.beginPath();
                            context.lineWidth = 3;
                            context.lineCap = 'round';
                            context.lineJoin = 'round';
                            context.strokeStyle = drawColor;
                            context.moveTo(e.nativeEvent.touches[0].clientX, e.nativeEvent.touches[0].clientY);
                        }
                    }}
                    onTouchMove={(e) => {
                        // only handle mouse moves when the mouse is already down.
                        if (isDrawing) {
                            const context = e.currentTarget.getContext('2d');
                            if (context) {
                                context.lineWidth = 3;
                                context.lineCap = 'round';
                                context.lineJoin = 'round';
                                context.strokeStyle = drawColor;
                                context.lineTo(e.nativeEvent.touches[0].clientX, e.nativeEvent.touches[0].clientY);
                                context.stroke();
                            }
                        }
                    }}
                    onTouchEnd={() => {
                        // end drawing.
                        setIsDrawing(false);
                    }}
                ></canvas>
                <div className="absolute right-0 top-0 z-[1] flex h-full items-center justify-center pr-2">
                    <div className="grid h-fit grid-cols-2 gap-2 xl:grid-cols-1">
                        <button
                            className="h-[1.5rem] w-[1.5rem] rounded-sm bg-white duration-300 hover:scale-110 lg:h-8 lg:w-8"
                            aria-label="White"
                            type="button"
                            onClick={() => setDrawColor('#ffffff')}
                        />

                        <button
                            className="h-[1.5rem] w-[1.5rem] rounded-sm bg-[#eab308] duration-300 hover:scale-110 lg:h-8 lg:w-8"
                            aria-label="Yellow"
                            type="button"
                            onClick={() => setDrawColor('#eab308')}
                        />
                        <button
                            className="h-[1.5rem] w-[1.5rem] rounded-sm bg-[#ff7e01] duration-300 hover:scale-110 lg:h-8 lg:w-8"
                            aria-label="Orange"
                            type="button"
                            onClick={() => setDrawColor('#ff7e01')}
                        />
                        <button
                            className="h-[1.5rem] w-[1.5rem] rounded-sm bg-[#ef4444] duration-300 hover:scale-110 lg:h-8 lg:w-8"
                            aria-label="Red"
                            type="button"
                            onClick={() => setDrawColor('#ef4444')}
                        />
                        <button
                            className="h-[1.5rem] w-[1.5rem] rounded-sm bg-[#22c55e] duration-300 hover:scale-110 lg:h-8 lg:w-8"
                            aria-label="Green"
                            type="button"
                            onClick={() => setDrawColor('#22c55e')}
                        />

                        <button
                            className="h-[1.5rem] w-[1.5rem] rounded-sm bg-[#3b82f6] duration-300 hover:scale-110 lg:h-8 lg:w-8"
                            aria-label="Blue"
                            type="button"
                            onClick={() => setDrawColor('#3b82f6')}
                        />
                        <button
                            className="h-[1.5rem] w-[1.5rem] rounded-sm bg-[#fc77fe] duration-300 hover:scale-110 lg:h-8 lg:w-8"
                            aria-label="Pink"
                            type="button"
                            onClick={() => setDrawColor('#fc77fe')}
                        />
                        <div className="col-span-2 flex items-center justify-center xl:col-span-1 xl:mt-2">
                            <button
                                type="button"
                                className="h-[1.5rem] w-[1.5rem] cursor-pointer bg-transparent text-white duration-200 hover:scale-110 hover:border-primary hover:text-primary lg:h-8 lg:w-8"
                            >
                                <Eraser
                                    weight="fill"
                                    size={32}
                                    onClick={() => {
                                        const canvas = canvasRef.current;
                                        const context = canvas?.getContext('2d');
                                        if (context && canvas) {
                                            context.clearRect(0, 0, canvas.width, canvas.height);
                                            context.beginPath();
                                        }
                                    }}
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
