import { useRef, useState, useEffect } from 'react'
import './NimbuMirchi.css'

export function NimbuMirchi() {
    const wrapRef = useRef<HTMLDivElement>(null)
    const ropeRef = useRef<SVGGElement>(null)
    const payloadRef = useRef<SVGGElement>(null)

    const isDraggingRef = useRef(false)
    const pivotRef = useRef({ x: 0, y: 0, height: 135 })

    // Continuous physics state
    const physicsRef = useRef({
        angle: 0,
        angleVel: 0,
        extraY: 0,
        extraYVel: 0,
        targetAngle: 0,
        targetExtraY: 0,
        lastPluckY: 0,
    })

    const audioCtxRef = useRef<AudioContext | null>(null)
    const noiseBufferRef = useRef<AudioBuffer | null>(null)
    const [isPulling, setIsPulling] = useState(false)

    // Audio synthesizer using Web Audio API for organic rope / twine friction & snap
    const getAudioContext = () => {
        if (!audioCtxRef.current) {
            const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
            if (AudioCtx) {
                audioCtxRef.current = new AudioCtx()
            }
        }
        if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
            audioCtxRef.current.resume()
        }
        return audioCtxRef.current
    }

    const getNoiseBuffer = (ctx: AudioContext) => {
        if (!noiseBufferRef.current) {
            const bufferSize = Math.floor(ctx.sampleRate * 0.4)
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
            const data = buffer.getChannelData(0)
            for (let i = 0; i < bufferSize; i++) {
                // Granular fibrous friction noise
                data[i] = (Math.random() * 2 - 1) * 0.6
            }
            noiseBufferRef.current = buffer
        }
        return noiseBufferRef.current
    }

    // Authentic rope / jute twine stretch creak
    const playRopeStretchSound = (tension = 0.5) => {
        try {
            const ctx = getAudioContext()
            if (!ctx) return
            const now = ctx.currentTime

            // 1. Fibrous friction noise burst (jute fibers sliding under tension)
            const noise = ctx.createBufferSource()
            noise.buffer = getNoiseBuffer(ctx)

            const noiseFilter = ctx.createBiquadFilter()
            noiseFilter.type = 'bandpass'
            const centerFreq = 480 + Math.min(550, tension * 300)
            noiseFilter.frequency.setValueAtTime(centerFreq, now)
            noiseFilter.Q.setValueAtTime(3.8, now)

            const noiseGain = ctx.createGain()
            const noiseVol = 0.05 + Math.min(0.07, tension * 0.04)
            noiseGain.gain.setValueAtTime(noiseVol, now)
            noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.065)

            noise.connect(noiseFilter)
            noiseFilter.connect(noiseGain)
            noiseGain.connect(ctx.destination)

            noise.start(now)
            noise.stop(now + 0.075)

            // 2. Low-frequency cord strain resonance (taut rope body groan)
            const osc = ctx.createOscillator()
            const oscGain = ctx.createGain()
            const oscFilter = ctx.createBiquadFilter()

            osc.type = 'sawtooth'
            const strainPitch = 135 + Math.min(90, tension * 50)
            osc.frequency.setValueAtTime(strainPitch, now)
            osc.frequency.linearRampToValueAtTime(strainPitch * 1.12, now + 0.05)

            oscFilter.type = 'lowpass'
            oscFilter.frequency.setValueAtTime(380, now)

            oscGain.gain.setValueAtTime(0.035, now)
            oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.055)

            osc.connect(oscFilter)
            oscFilter.connect(oscGain)
            oscGain.connect(ctx.destination)

            osc.start(now)
            osc.stop(now + 0.065)
        } catch {
            // Audio policy fallback
        }
    }

    // Authentic taut cord snap & whip recoil on release
    const playRopeReleaseSound = (intensity = 1) => {
        try {
            const ctx = getAudioContext()
            if (!ctx) return
            const now = ctx.currentTime

            // 1. Taut cord whip snap
            const noise = ctx.createBufferSource()
            noise.buffer = getNoiseBuffer(ctx)

            const snapFilter = ctx.createBiquadFilter()
            snapFilter.type = 'bandpass'
            snapFilter.frequency.setValueAtTime(1050, now)
            snapFilter.frequency.exponentialRampToValueAtTime(220, now + 0.16)
            snapFilter.Q.setValueAtTime(2.2, now)

            const snapGain = ctx.createGain()
            snapGain.gain.setValueAtTime(0.13 * Math.min(1.4, intensity), now)
            snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16)

            noise.connect(snapFilter)
            snapFilter.connect(snapGain)
            snapGain.connect(ctx.destination)

            noise.start(now)
            noise.stop(now + 0.17)

            // 2. Low-end cord tension thud
            const osc = ctx.createOscillator()
            const oscGain = ctx.createGain()

            osc.type = 'triangle'
            const baseFreq = 130 + Math.min(70, intensity * 35)
            osc.frequency.setValueAtTime(baseFreq, now)
            osc.frequency.exponentialRampToValueAtTime(45, now + 0.2)

            oscGain.gain.setValueAtTime(0.1 * Math.min(1.4, intensity), now)
            oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2)

            osc.connect(oscGain)
            oscGain.connect(ctx.destination)

            osc.start(now)
            osc.stop(now + 0.21)
        } catch {
            // Audio policy fallback
        }
    }

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        if (e.button !== 0 && e.pointerType === 'mouse') return

        const wrap = wrapRef.current
        if (!wrap) return

        try {
            wrap.setPointerCapture(e.pointerId)
        } catch {
            // Ignore if pointer capture is unsupported
        }

        isDraggingRef.current = true
        setIsPulling(true)

        // Exact invariant top anchor pivot coordinates where rope hangs from the navbar
        const parent = wrap.parentElement || wrap
        const headerRect = parent.getBoundingClientRect()
        const computedStyle = window.getComputedStyle(wrap)
        const rightOffset = parseFloat(computedStyle.right) || 24
        const pivotX = headerRect.right - rightOffset - (wrap.offsetWidth / 2)
        const pivotY = headerRect.bottom
        const defaultHeight = wrap.offsetHeight || 135

        pivotRef.current = { x: pivotX, y: pivotY, height: defaultHeight }

        // Initial drag target calculation
        const dx = e.clientX - pivotX
        const dy = e.clientY - pivotY
        const rawAngle = -Math.atan2(dx, Math.max(15, dy)) * (180 / Math.PI)
        const clampedAngle = Math.max(-65, Math.min(65, rawAngle))

        const dist = Math.hypot(dx, Math.max(15, dy))
        const stretchDist = Math.max(0, dist - defaultHeight)
        const extraY = Math.log10(1 + stretchDist * 0.04) * 60

        physicsRef.current.targetAngle = clampedAngle
        physicsRef.current.targetExtraY = extraY
        physicsRef.current.lastPluckY = extraY

        playRopeStretchSound(0.2)
    }

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isDraggingRef.current) return

        const pivot = pivotRef.current
        const dx = e.clientX - pivot.x
        const dy = e.clientY - pivot.y

        // Angle inverted so dragging left pulls left and dragging right pulls right
        const rawAngle = -Math.atan2(dx, Math.max(15, dy)) * (180 / Math.PI)
        const clampedAngle = Math.max(-65, Math.min(65, rawAngle))

        // Distance and rope stretch
        const dist = Math.hypot(dx, Math.max(15, dy))
        const defaultHeight = pivot.height || 135
        const stretchDist = Math.max(0, dist - defaultHeight)
        const extraY = Math.log10(1 + stretchDist * 0.04) * 60

        physicsRef.current.targetAngle = clampedAngle
        physicsRef.current.targetExtraY = extraY

        // Play subtle acoustic tension clicks as user stretches further
        if (Math.abs(extraY - physicsRef.current.lastPluckY) > 8) {
            playRopeStretchSound(extraY / 35)
            physicsRef.current.lastPluckY = extraY
        }
    }

    const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isDraggingRef.current) return
        isDraggingRef.current = false
        setIsPulling(false)

        const totalEnergy = Math.hypot(physicsRef.current.angle / 30, physicsRef.current.extraY / 20)
        playRopeReleaseSound(Math.min(2, Math.max(0.5, totalEnergy)))

        if (wrapRef.current && wrapRef.current.hasPointerCapture(e.pointerId)) {
            try {
                wrapRef.current.releasePointerCapture(e.pointerId)
            } catch {
                // Ignore if release fails
            }
        }
    }

    // Unified self-sustaining limit-cycle physics loop
    useEffect(() => {
        let animId: number
        let lastTime = performance.now()

        const tick = (now: number) => {
            const dt = Math.min(0.033, Math.max(0.001, (now - lastTime) / 1000))
            lastTime = now

            const phys = physicsRef.current
            const dragging = isDraggingRef.current

            if (dragging) {
                // While dragging: follow cursor with instant response & compute release velocity
                const prevAngle = phys.angle
                const prevExtraY = phys.extraY

                phys.angle = phys.targetAngle
                phys.extraY = phys.targetExtraY

                phys.angleVel = (phys.angle - prevAngle) / dt
                phys.extraYVel = (phys.extraY - prevExtraY) / dt
            } else {
                // Natural physical pendulum equation
                const omega0 = 4.2
                const omega0Sq = omega0 * omega0

                const rad = (phys.angle * Math.PI) / 180
                const gravityTorque = -omega0Sq * Math.sin(rad) * (180 / Math.PI)

                // Current instantaneous energy amplitude (in degrees)
                const currentAmp = Math.hypot(phys.angle, phys.angleVel / omega0)
                const defaultAmp = 6.5

                // When amplitude is high from a user pull, gradually dissipate excess energy.
                // When amplitude reaches the default 6.5° speed, maintain constant steady swing in user's phase!
                let dampingFactor = 0.32
                if (currentAmp <= defaultAmp * 1.05) {
                    dampingFactor = 0.2 * (currentAmp / defaultAmp - 1)
                }

                const airDrag = -dampingFactor * phys.angleVel

                phys.angleVel += (gravityTorque + airDrag) * dt
                phys.angle += phys.angleVel * dt

                // Vertical elastic rope recoil with gentle springiness
                const ropeForce = -140 * phys.extraY
                const ropeDamping = -4.5 * phys.extraYVel
                phys.extraYVel += (ropeForce + ropeDamping) * dt
                phys.extraY += phys.extraYVel * dt
            }

            const ropeScaleY = Math.max(0.4, (60 + phys.extraY) / 60)

            if (wrapRef.current) {
                wrapRef.current.style.transform = `rotate(${phys.angle}deg)`
            }
            if (ropeRef.current) {
                ropeRef.current.style.transform = `scale(1, ${ropeScaleY})`
            }
            if (payloadRef.current) {
                payloadRef.current.style.transform = `translateY(${phys.extraY}px)`
            }

            animId = requestAnimationFrame(tick)
        }

        animId = requestAnimationFrame(tick)
        return () => {
            cancelAnimationFrame(animId)
            if (audioCtxRef.current) {
                audioCtxRef.current.close().catch(() => {})
            }
        }
    }, [])

    return (
        <div
            ref={wrapRef}
            className={`nimbu-mirchi-wrap${isPulling ? ' is-pulling' : ''}`}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            title="Pull me!"
        >
            <svg
                className="nimbu-mirchi"
                viewBox="0 0 120 230"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
            >
                <defs>
                    {/* =====================================================
                        LEMON GRADIENT
                    ====================================================== */}
                    <radialGradient id="lemonGradient" cx="32%" cy="25%">
                        <stop offset="0%" stopColor="#FFF27A" />
                        <stop offset="45%" stopColor="#FFD52F" />
                        <stop offset="100%" stopColor="#D99A08" />
                    </radialGradient>

                    {/* =====================================================
                        CHILLI GRADIENT
                    ====================================================== */}
                    <linearGradient id="chiliGradient" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#72D84F" />
                        <stop offset="45%" stopColor="#29963A" />
                        <stop offset="100%" stopColor="#0E6028" />
                    </linearGradient>

                    {/* =====================================================
                        ROPE & JUTE GRADIENTS
                    ====================================================== */}
                    {/* Main cylindrical 3D rope gradient */}
                    <linearGradient id="ropeGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#5C3412" />
                        <stop offset="25%" stopColor="#A86E32" />
                        <stop offset="50%" stopColor="#E5B26A" />
                        <stop offset="72%" stopColor="#B37837" />
                        <stop offset="100%" stopColor="#532E0E" />
                    </linearGradient>

                    {/* Twisted strand diagonal highlight gradient */}
                    <linearGradient id="strandGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#54300E" />
                        <stop offset="20%" stopColor="#9C642B" />
                        <stop offset="50%" stopColor="#F5C87E" />
                        <stop offset="80%" stopColor="#AC7333" />
                        <stop offset="100%" stopColor="#48260A" />
                    </linearGradient>

                    {/* Tight coil wrap gradient */}
                    <linearGradient id="coilGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#633914" />
                        <stop offset="28%" stopColor="#B87B37" />
                        <stop offset="52%" stopColor="#ECC07B" />
                        <stop offset="78%" stopColor="#A56A2B" />
                        <stop offset="100%" stopColor="#502A0B" />
                    </linearGradient>

                    {/* =====================================================
                        BLACK STONE / CHARM
                    ====================================================== */}
                    <linearGradient id="stoneGradient" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#3A3A3A" />
                        <stop offset="50%" stopColor="#171717" />
                        <stop offset="100%" stopColor="#080808" />
                    </linearGradient>

                    {/* =====================================================
                        SHADOW
                    ====================================================== */}
                    <filter id="softShadow">
                        <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity=".2" />
                    </filter>
                </defs>

                {/* =====================================================
                    TOP HANGING LOOP & ATTACHMENT
                ====================================================== */}
                <g className="rope-top-loop">
                    {/* Hanging eyelet loop */}
                    <path
                        d="M 58 0 C 57 4 54.5 9 56 13 C 57.2 16 60 17 60 17 C 60 17 62.8 16 64 13 C 65.5 9 63 4 62 0"
                        fill="none"
                        stroke="url(#ropeGrad)"
                        strokeWidth="2.8"
                        strokeLinecap="round"
                    />
                    {/* Inner highlight for loop */}
                    <path
                        d="M 57.8 2 C 56.5 6 56 11 58.5 14.5"
                        fill="none"
                        stroke="#FFE4A8"
                        strokeWidth="0.8"
                        opacity="0.85"
                        strokeLinecap="round"
                    />
                    <path
                        d="M 62.2 2 C 63.5 6 64 11 61.5 14.5"
                        fill="none"
                        stroke="#5A3210"
                        strokeWidth="0.8"
                        opacity="0.7"
                        strokeLinecap="round"
                    />

                    {/* Loop neck binding coils (tightly wrapped sutli thread) */}
                    <g className="neck-coils">
                        <ellipse cx="60" cy="14" rx="4.2" ry="1.2" fill="url(#coilGrad)" stroke="#4A2609" strokeWidth="0.4" />
                        <ellipse cx="60" cy="16" rx="4.4" ry="1.2" fill="url(#coilGrad)" stroke="#4A2609" strokeWidth="0.4" />
                        <ellipse cx="60" cy="18" rx="4.2" ry="1.2" fill="url(#coilGrad)" stroke="#4A2609" strokeWidth="0.4" />
                        {/* Coil sheen */}
                        <path d="M 58 13.8 C 59.5 14.3 61.5 14.3 62 13.8" fill="none" stroke="#FFEBB5" strokeWidth="0.6" strokeLinecap="round" />
                        <path d="M 57.8 15.8 C 59.5 16.3 61.5 16.3 62.2 15.8" fill="none" stroke="#FFEBB5" strokeWidth="0.6" strokeLinecap="round" />
                        <path d="M 58 17.8 C 59.5 18.3 61.5 18.3 62 17.8" fill="none" stroke="#FFEBB5" strokeWidth="0.6" strokeLinecap="round" />
                    </g>
                </g>

                {/* =====================================================
                    TWISTED BRAIDED ROPE SHAFT (y=18 to y=78)
                    Scales dynamically when pulled, extending the rope!
                ====================================================== */}
                <g ref={ropeRef} className="rope-shaft" style={{ transformOrigin: '60px 18px' }}>
                    {/* Underlying braided base with natural subtle drape */}
                    <path
                        d="M 60 18 Q 59.5 32 60 48 Q 60.5 63 60 78"
                        fill="none"
                        stroke="url(#ropeGrad)"
                        strokeWidth="4.2"
                        strokeLinecap="round"
                    />

                    {/* Repeating Twisted Helical Strand Segments */}
                    {/* Segment 1 (y: 18 - 25) */}
                    <g className="twist-unit">
                        <path d="M 57.6 19.5 C 57.2 21.5 59.2 24 62.6 22.8 C 63.1 21.2 61.8 18.8 57.6 19.5 Z" fill="url(#strandGrad)" />
                        <path d="M 58.2 20.2 C 59.5 21.8 61.2 22.2 62.2 21.5" fill="none" stroke="#FFE6A4" strokeWidth="0.9" strokeLinecap="round" opacity="0.85" />
                        <path d="M 57.4 22.8 C 59.5 24.2 61.8 23.5 62.6 22.8" fill="none" stroke="#4A2508" strokeWidth="0.8" strokeLinecap="round" />
                    </g>

                    {/* Segment 2 (y: 24 - 31) */}
                    <g className="twist-unit">
                        <path d="M 57.4 25.5 C 57.0 27.5 59.0 30 62.5 28.8 C 63.0 27.2 61.6 24.8 57.4 25.5 Z" fill="url(#strandGrad)" />
                        <path d="M 58.0 26.2 C 59.3 27.8 61.0 28.2 62.0 27.5" fill="none" stroke="#FFE6A4" strokeWidth="0.9" strokeLinecap="round" opacity="0.85" />
                        <path d="M 57.2 28.8 C 59.3 30.2 61.6 29.5 62.5 28.8" fill="none" stroke="#4A2508" strokeWidth="0.8" strokeLinecap="round" />
                    </g>

                    {/* Segment 3 (y: 30 - 37) */}
                    <g className="twist-unit">
                        <path d="M 57.3 31.5 C 56.9 33.5 58.9 36 62.4 34.8 C 62.9 33.2 61.5 30.8 57.3 31.5 Z" fill="url(#strandGrad)" />
                        <path d="M 57.9 32.2 C 59.2 33.8 60.9 34.2 61.9 33.5" fill="none" stroke="#FFE6A4" strokeWidth="0.9" strokeLinecap="round" opacity="0.85" />
                        <path d="M 57.1 34.8 C 59.2 36.2 61.5 35.5 62.4 34.8" fill="none" stroke="#4A2508" strokeWidth="0.8" strokeLinecap="round" />
                    </g>

                    {/* Segment 4 (y: 36 - 43) */}
                    <g className="twist-unit">
                        <path d="M 57.4 37.5 C 57.0 39.5 59.0 42 62.5 40.8 C 63.0 39.2 61.6 36.8 57.4 37.5 Z" fill="url(#strandGrad)" />
                        <path d="M 58.0 38.2 C 59.3 39.8 61.0 40.2 62.0 39.5" fill="none" stroke="#FFE6A4" strokeWidth="0.9" strokeLinecap="round" opacity="0.85" />
                        <path d="M 57.2 40.8 C 59.3 42.2 61.6 41.5 62.5 40.8" fill="none" stroke="#4A2508" strokeWidth="0.8" strokeLinecap="round" />
                    </g>

                    {/* Segment 5 (y: 42 - 49) */}
                    <g className="twist-unit">
                        <path d="M 57.5 43.5 C 57.1 45.5 59.1 48 62.6 46.8 C 63.1 45.2 61.7 42.8 57.5 43.5 Z" fill="url(#strandGrad)" />
                        <path d="M 58.1 44.2 C 59.4 45.8 61.1 46.2 62.1 45.5" fill="none" stroke="#FFE6A4" strokeWidth="0.9" strokeLinecap="round" opacity="0.85" />
                        <path d="M 57.3 46.8 C 59.4 48.2 61.7 47.5 62.6 46.8" fill="none" stroke="#4A2508" strokeWidth="0.8" strokeLinecap="round" />
                    </g>

                    {/* Segment 6 (y: 48 - 55) */}
                    <g className="twist-unit">
                        <path d="M 57.6 49.5 C 57.2 51.5 59.2 54 62.7 52.8 C 63.2 51.2 61.8 48.8 57.6 49.5 Z" fill="url(#strandGrad)" />
                        <path d="M 58.2 50.2 C 59.5 51.8 61.2 52.2 62.2 51.5" fill="none" stroke="#FFE6A4" strokeWidth="0.9" strokeLinecap="round" opacity="0.85" />
                        <path d="M 57.4 52.8 C 59.5 54.2 61.8 53.5 62.7 52.8" fill="none" stroke="#4A2508" strokeWidth="0.8" strokeLinecap="round" />
                    </g>

                    {/* Segment 7 (y: 54 - 61) */}
                    <g className="twist-unit">
                        <path d="M 57.6 55.5 C 57.2 57.5 59.2 60 62.7 58.8 C 63.2 57.2 61.8 54.8 57.6 55.5 Z" fill="url(#strandGrad)" />
                        <path d="M 58.2 56.2 C 59.5 57.8 61.2 58.2 62.2 57.5" fill="none" stroke="#FFE6A4" strokeWidth="0.9" strokeLinecap="round" opacity="0.85" />
                        <path d="M 57.4 58.8 C 59.5 60.2 61.8 59.5 62.7 58.8" fill="none" stroke="#4A2508" strokeWidth="0.8" strokeLinecap="round" />
                    </g>

                    {/* Segment 8 (y: 60 - 67) */}
                    <g className="twist-unit">
                        <path d="M 57.5 61.5 C 57.1 63.5 59.1 66 62.6 64.8 C 63.1 63.2 61.7 60.8 57.5 61.5 Z" fill="url(#strandGrad)" />
                        <path d="M 58.1 62.2 C 59.4 63.8 61.1 64.2 62.1 63.5" fill="none" stroke="#FFE6A4" strokeWidth="0.9" strokeLinecap="round" opacity="0.85" />
                        <path d="M 57.3 64.8 C 59.4 66.2 61.7 65.5 62.6 64.8" fill="none" stroke="#4A2508" strokeWidth="0.8" strokeLinecap="round" />
                    </g>

                    {/* Segment 9 (y: 66 - 73) */}
                    <g className="twist-unit">
                        <path d="M 57.4 67.5 C 57.0 69.5 59.0 72 62.5 70.8 C 63.0 69.2 61.6 66.8 57.4 67.5 Z" fill="url(#strandGrad)" />
                        <path d="M 58.0 68.2 C 59.3 69.8 61.0 70.2 62.0 69.5" fill="none" stroke="#FFE6A4" strokeWidth="0.9" strokeLinecap="round" opacity="0.85" />
                        <path d="M 57.2 70.8 C 59.3 72.2 61.6 71.5 62.5 70.8" fill="none" stroke="#4A2508" strokeWidth="0.8" strokeLinecap="round" />
                    </g>

                    {/* Segment 10 (y: 72 - 78) */}
                    <g className="twist-unit">
                        <path d="M 57.3 73.5 C 56.9 75.5 58.9 78 62.4 76.8 C 62.9 75.2 61.5 72.8 57.3 73.5 Z" fill="url(#strandGrad)" />
                        <path d="M 57.9 74.2 C 59.2 75.8 60.9 76.2 61.9 75.5" fill="none" stroke="#FFE6A4" strokeWidth="0.9" strokeLinecap="round" opacity="0.85" />
                        <path d="M 57.1 76.8 C 59.2 78.2 61.5 77.5 62.4 76.8" fill="none" stroke="#4A2508" strokeWidth="0.8" strokeLinecap="round" />
                    </g>

                    {/* Continuous helical ridge weave lines */}
                    <path
                        d="M 57.5 19 C 62 23 58 27 62.5 31 C 58 35 62.5 39 58 43 C 62.5 47 58 51 62.5 55 C 58 59 62.5 63 58 67 C 62.5 71 58 75 62 78"
                        fill="none"
                        stroke="#FFEAB3"
                        strokeWidth="0.65"
                        opacity="0.8"
                        strokeLinecap="round"
                    />
                    <path
                        d="M 62 20 C 57.5 24 61.5 28 57 32 C 61.5 36 57 40 61.5 44 C 57 48 61.5 52 57 56 C 61.5 60 57 64 61.5 68 C 57 72 61.5 76 57.5 78"
                        fill="none"
                        stroke="#452306"
                        strokeWidth="0.75"
                        opacity="0.75"
                        strokeLinecap="round"
                    />

                    {/* Organic Jute Fiber Wisps / Fuzz along the rope */}
                    <g className="jute-fuzz" strokeLinecap="round" opacity="0.75">
                        <path d="M 57.2 23 C 55.8 22.2 55.2 21 54.6 20.4" fill="none" stroke="#D19C4F" strokeWidth="0.55" />
                        <path d="M 62.8 27 C 64.2 26.2 65 25.2 65.6 24.5" fill="none" stroke="#C48E42" strokeWidth="0.5" />
                        <path d="M 57.0 35 C 55.5 35.8 54.8 37 54.2 38" fill="none" stroke="#D19C4F" strokeWidth="0.5" />
                        <path d="M 62.7 41 C 64.5 40.5 65.5 39.5 66.2 39" fill="none" stroke="#B88339" strokeWidth="0.55" />
                        <path d="M 57.1 48 C 55.8 47.4 55 46.2 54.4 45.6" fill="none" stroke="#D19C4F" strokeWidth="0.5" />
                        <path d="M 62.9 54 C 64.3 54.8 65.2 56 65.8 57.2" fill="none" stroke="#C48E42" strokeWidth="0.5" />
                        <path d="M 57.0 62 C 55.4 61.2 54.6 60 54 59.2" fill="none" stroke="#D19C4F" strokeWidth="0.55" />
                        <path d="M 62.8 69 C 64.4 68.2 65.4 67.2 66.1 66.4" fill="none" stroke="#B88339" strokeWidth="0.5" />
                        <path d="M 57.2 73 C 55.8 73.8 55.0 75 54.5 76" fill="none" stroke="#D19C4F" strokeWidth="0.5" />
                    </g>
                </g>

                {/* =====================================================
                    HANGING PAYLOAD (Knot, Chillies, Lemon, Charm, Tassel)
                    Translates down when rope stretches, without any
                    shape distortion of the lemon, chillies or stone!
                ====================================================== */}
                <g ref={payloadRef} className="nimbu-payload">

                {/* =====================================================
                    TOP KNOT & BUNCH TIE (y=76 to y=96)
                    Layered 3D overhand knot tying chillies
                ====================================================== */}
                <g className="top-knot">
                    {/* Knot back loop */}
                    <path
                        d="M 54 77 C 47 79 46 86 51 90 C 55 93 60 90 62 86"
                        fill="none"
                        stroke="url(#ropeGrad)"
                        strokeWidth="4.2"
                        strokeLinecap="round"
                    />

                    {/* Knot front bulge & loop */}
                    <path
                        d="M 52 79 C 55 74 64 75 67 80 C 70 85 67 91 61 92 C 55 93 49 87 52 79 Z"
                        fill="url(#strandGrad)"
                        stroke="#452306"
                        strokeWidth="0.8"
                    />

                    {/* Knot highlight curves */}
                    <path
                        d="M 53.5 80 C 57 84.5 62.5 86 65.5 80"
                        fill="none"
                        stroke="#FFE7AA"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        opacity="0.9"
                    />
                    <path
                        d="M 53 85.5 C 57 82 62 82 65.5 85.5"
                        fill="none"
                        stroke="#502808"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                    />
                    <path
                        d="M 54 76 C 58 74 62 75 65 77.5"
                        fill="none"
                        stroke="#FFE4A6"
                        strokeWidth="1"
                        strokeLinecap="round"
                        opacity="0.8"
                    />

                    {/* Knot binding wrap coils underneath knot */}
                    <ellipse cx="60" cy="92" rx="4.8" ry="1.4" fill="url(#coilGrad)" stroke="#4A2609" strokeWidth="0.5" />
                    <ellipse cx="60" cy="94.5" rx="5" ry="1.4" fill="url(#coilGrad)" stroke="#4A2609" strokeWidth="0.5" />
                    <ellipse cx="60" cy="97" rx="4.8" ry="1.4" fill="url(#coilGrad)" stroke="#4A2609" strokeWidth="0.5" />
                    {/* Wrap sheen */}
                    <path d="M 57.5 91.8 C 59.5 92.4 61.5 92.4 62.5 91.8" fill="none" stroke="#FFE9B0" strokeWidth="0.7" strokeLinecap="round" />
                    <path d="M 57.2 94.3 C 59.5 94.9 61.8 94.9 62.8 94.3" fill="none" stroke="#FFE9B0" strokeWidth="0.7" strokeLinecap="round" />
                    <path d="M 57.5 96.8 C 59.5 97.4 61.5 97.4 62.5 96.8" fill="none" stroke="#FFE9B0" strokeWidth="0.7" strokeLinecap="round" />
                </g>

                {/* =====================================================
                    UPPER LEFT CHILLI
                ====================================================== */}
                <g filter="url(#softShadow)">
                    <path
                        d="
              M57 99
              C47 94 35 92 23 95
              C16 96 11 99 7 103
              C15 101 22 102 30 105
              C40 109 49 110 57 107
              C59 104 59 101 57 99Z
            "
                        fill="url(#chiliGradient)"
                        stroke="#155C29"
                        strokeWidth="1"
                    />

                    <path
                        d="M8 103 C5 104 4 107 3 109"
                        fill="none"
                        stroke="#155C29"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />

                    <path
                        d="M13 101 C26 98 40 102 53 105"
                        fill="none"
                        stroke="#A1E87A"
                        strokeWidth="2"
                        strokeLinecap="round"
                        opacity=".65"
                    />
                </g>

                {/* =====================================================
                    UPPER RIGHT CHILLI
                ====================================================== */}
                <g filter="url(#softShadow)">
                    <path
                        d="
              M63 99
              C73 94 85 92 97 95
              C104 96 109 100 113 104
              C105 102 98 102 90 105
              C80 109 71 110 63 107
              C61 104 61 101 63 99Z
            "
                        fill="url(#chiliGradient)"
                        stroke="#155C29"
                        strokeWidth="1"
                    />

                    <path
                        d="M112 104 C115 105 117 108 118 110"
                        fill="none"
                        stroke="#155C29"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />

                    <path
                        d="M67 104 C80 99 93 99 107 103"
                        fill="none"
                        stroke="#A1E87A"
                        strokeWidth="2"
                        strokeLinecap="round"
                        opacity=".65"
                    />
                </g>

                {/* =====================================================
                    SECOND LEFT CHILLI
                ====================================================== */}
                <path
                    d="
            M55 107
            C44 104 33 107 25 113
            C20 117 17 121 14 126
            C22 121 30 120 37 121
            C45 122 52 119 58 114
            C58 111 57 109 55 107Z
          "
                    fill="url(#chiliGradient)"
                    stroke="#155C29"
                    strokeWidth="1"
                />

                {/* =====================================================
                    SECOND RIGHT CHILLI
                ====================================================== */}
                <path
                    d="
            M65 107
            C76 104 87 107 95 113
            C100 117 103 121 106 126
            C98 121 90 120 83 121
            C75 122 68 119 62 114
            C62 111 63 109 65 107Z
          "
                    fill="url(#chiliGradient)"
                    stroke="#155C29"
                    strokeWidth="1"
                />

                {/* =====================================================
                    UPPER ROPE TIE / SUTLI WRAP
                    Twine wrapped tightly around upper chilli stems
                ====================================================== */}
                <g className="upper-rope-tie">
                    {/* Multi-turn coiled wrap binding the chilli stalks */}
                    <path
                        d="M 53 101 C 53 105.5 56 108.5 60 110.5 C 64 108.5 67 105.5 67 101"
                        fill="none"
                        stroke="url(#ropeGrad)"
                        strokeWidth="3.4"
                        strokeLinecap="round"
                    />
                    <path
                        d="M 54 103 C 54 106.5 56.5 109 60 110"
                        fill="none"
                        stroke="#FFE7AA"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        opacity="0.85"
                    />
                    <path
                        d="M 53.5 100 C 56 103.5 64 103.5 66.5 100"
                        fill="none"
                        stroke="#502808"
                        strokeWidth="1"
                        strokeLinecap="round"
                    />
                    {/* Cross-knot tie strand */}
                    <path
                        d="M 55 99 L 65 105"
                        fill="none"
                        stroke="url(#strandGrad)"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                    />
                    <path
                        d="M 56 99.5 L 64 104.5"
                        fill="none"
                        stroke="#FFE6A4"
                        strokeWidth="0.6"
                        strokeLinecap="round"
                        opacity="0.8"
                    />
                </g>

                {/* =====================================================
                    LEMON
                ====================================================== */}
                <g filter="url(#softShadow)">
                    <path
                        d="
              M60 107
              C48 107 39 114 37 125
              C35 137 42 148 52 153
              C58 156 63 156 69 153
              C79 148 85 137 83 125
              C81 114 72 107 60 107Z
            "
                        fill="url(#lemonGradient)"
                        stroke="#C8950B"
                        strokeWidth="1.2"
                    />

                    <ellipse
                        cx="51"
                        cy="119"
                        rx="6"
                        ry="9"
                        fill="#FFF8B0"
                        opacity=".55"
                    />

                    <g fill="#DDA713" opacity=".55">
                        <circle cx="45" cy="128" r="1" />
                        <circle cx="50" cy="134" r=".8" />
                        <circle cx="57" cy="122" r=".9" />
                        <circle cx="64" cy="117" r=".8" />
                        <circle cx="71" cy="126" r="1" />
                        <circle cx="75" cy="134" r=".8" />
                        <circle cx="55" cy="144" r="1" />
                        <circle cx="66" cy="144" r=".9" />
                    </g>
                </g>

                {/* =====================================================
                    ROPE THROUGH LEMON (Top Entry & Bottom Exit)
                    Twisted rope passing through the lemon with realistic
                    puncture dimples and holding knots
                ====================================================== */}
                {/* Top Entry */}
                <g className="rope-lemon-entry">
                    {/* Entry puncture hole shadow */}
                    <ellipse cx="60" cy="107.5" rx="3.2" ry="1.2" fill="#8C5C05" opacity="0.6" />
                    {/* Twisted cord entering lemon */}
                    <path
                        d="M 58 104 C 57.5 107 59.5 111 62 112"
                        fill="none"
                        stroke="url(#strandGrad)"
                        strokeWidth="3.2"
                        strokeLinecap="round"
                    />
                    <path
                        d="M 58.5 105 C 59 108 60.5 110.5 61.5 111"
                        fill="none"
                        stroke="#FFE7AA"
                        strokeWidth="0.8"
                        strokeLinecap="round"
                        opacity="0.85"
                    />
                </g>

                {/* Bottom Exit */}
                <g className="rope-lemon-exit">
                    {/* Exit puncture hole shadow */}
                    <ellipse cx="60" cy="154.5" rx="3" ry="1.1" fill="#8C5C05" opacity="0.6" />
                    {/* Knot holding lemon base */}
                    <ellipse cx="60" cy="155.5" rx="3.6" ry="1.5" fill="url(#coilGrad)" stroke="#4A2609" strokeWidth="0.5" />
                    <path
                        d="M 57.5 155 C 59 156 61 156 62.5 155"
                        fill="none"
                        stroke="#FFE9B0"
                        strokeWidth="0.7"
                        strokeLinecap="round"
                    />
                    {/* Twisted cord emerging from lemon base */}
                    <path
                        d="M 59.5 146 Q 61 151 59.5 158"
                        fill="none"
                        stroke="url(#ropeGrad)"
                        strokeWidth="3.4"
                        strokeLinecap="round"
                    />
                    <path
                        d="M 58.5 148 C 60 152 61 155 59.2 158"
                        fill="none"
                        stroke="#FFE7AA"
                        strokeWidth="0.8"
                        strokeLinecap="round"
                        opacity="0.8"
                    />
                </g>

                {/* =====================================================
                    LOWER LEFT CHILLI
                ====================================================== */}
                <path
                    d="
            M55 160
            C44 157 33 160 25 166
            C20 170 17 175 14 180
            C22 176 30 175 37 176
            C45 177 52 173 57 168
            C58 165 57 162 55 160Z
          "
                    fill="url(#chiliGradient)"
                    stroke="#155C29"
                    strokeWidth="1"
                />

                {/* =====================================================
                    LOWER RIGHT CHILLI
                ====================================================== */}
                <path
                    d="
            M65 160
            C76 157 87 160 95 166
            C100 170 103 175 106 180
            C98 176 90 175 83 176
            C75 177 68 173 63 168
            C62 165 63 162 65 160Z
          "
                    fill="url(#chiliGradient)"
                    stroke="#155C29"
                    strokeWidth="1"
                />

                {/* =====================================================
                    LOWER CHILLI HIGHLIGHTS
                ====================================================== */}
                <path
                    d="M19 176 C30 170 42 171 53 166"
                    fill="none"
                    stroke="#9BE36D"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    opacity=".6"
                />

                <path
                    d="M67 166 C79 171 90 171 101 176"
                    fill="none"
                    stroke="#9BE36D"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    opacity=".6"
                />

                {/* =====================================================
                    LOWER ROPE TIE
                    Sutli wrap bundling lower chillies
                ====================================================== */}
                <g className="lower-rope-tie">
                    <path
                        d="M 53.5 163 C 53.5 167.5 56 170.5 60 172.5 C 64 170.5 66.5 167.5 66.5 163"
                        fill="none"
                        stroke="url(#ropeGrad)"
                        strokeWidth="3.2"
                        strokeLinecap="round"
                    />
                    <path
                        d="M 54.5 164.5 C 54.5 167.5 57 169.5 60 170.5"
                        fill="none"
                        stroke="#FFE7AA"
                        strokeWidth="1.1"
                        strokeLinecap="round"
                        opacity="0.85"
                    />
                    <ellipse cx="60" cy="165" rx="4.5" ry="1.2" fill="url(#coilGrad)" stroke="#4A2609" strokeWidth="0.4" />
                </g>

                {/* =====================================================
                    ROPE TO BLACK CHARM (y=170 to y=183)
                    Twisted 2-ply cord segment
                ====================================================== */}
                <g className="rope-to-charm">
                    <path
                        d="M 60 171 Q 59 176 60.5 182"
                        fill="none"
                        stroke="url(#ropeGrad)"
                        strokeWidth="3.6"
                        strokeLinecap="round"
                    />
                    {/* Diagonal twist highlights */}
                    <path
                        d="M 58.2 173 C 59.5 174.5 61.5 174.8 62.2 174"
                        fill="none"
                        stroke="#FFE6A4"
                        strokeWidth="0.85"
                        strokeLinecap="round"
                    />
                    <path
                        d="M 57.8 177.5 C 59.2 179 61.2 179.3 62 178.5"
                        fill="none"
                        stroke="#FFE6A4"
                        strokeWidth="0.85"
                        strokeLinecap="round"
                    />
                    <path
                        d="M 57.5 175.5 L 62.5 176"
                        fill="none"
                        stroke="#452306"
                        strokeWidth="0.75"
                        strokeLinecap="round"
                    />
                </g>

                {/* =====================================================
                    BLACK CHARM / NAZAR BATTU
                ====================================================== */}
                <g filter="url(#softShadow)">
                    <path
                        d="
              M60 180
              L70 186
              L67 199
              L60 203
              L53 199
              L50 186
              Z
            "
                        fill="url(#stoneGradient)"
                        stroke="#080808"
                        strokeWidth="1"
                    />

                    <path
                        d="M51 186 L60 182 L68 187"
                        fill="none"
                        stroke="#555"
                        strokeWidth="1.5"
                    />

                    <path
                        d="M54 197 L60 201 L66 196"
                        fill="none"
                        stroke="#363636"
                        strokeWidth="1"
                    />

                    <path
                        d="M56 189 L61 186 L65 190"
                        fill="none"
                        stroke="#4A4A4A"
                        strokeWidth="1"
                    />

                    {/* Charcoal cord tie lashing across the stone */}
                    <path
                        d="M 53 189 C 56 187 64 187 67 189"
                        fill="none"
                        stroke="url(#ropeGrad)"
                        strokeWidth="1.8"
                        opacity="0.85"
                    />
                    <path
                        d="M 54 188.5 C 57 187 63 187 66 188.5"
                        fill="none"
                        stroke="#FFE6A4"
                        strokeWidth="0.6"
                        opacity="0.7"
                    />
                </g>

                {/* =====================================================
                    BOTTOM ROPE & KNOT (y=201 to y=214)
                ====================================================== */}
                <g className="bottom-rope-knot">
                    {/* Cord emerging below stone */}
                    <path
                        d="M 60 201 Q 59 205 60.2 209"
                        fill="none"
                        stroke="url(#ropeGrad)"
                        strokeWidth="3.4"
                        strokeLinecap="round"
                    />
                    <path
                        d="M 58.5 204 C 59.8 205.5 61.2 205.8 62 205"
                        fill="none"
                        stroke="#FFE7AA"
                        strokeWidth="0.8"
                        strokeLinecap="round"
                    />

                    {/* Heavy Finishing Knot */}
                    <path
                        d="M 53.5 208 C 49 211 50 216.5 55.5 218.5 C 60 220.5 65.5 217.5 66.5 214 C 67.5 209.5 63 207.5 59.5 208.5 Z"
                        fill="url(#strandGrad)"
                        stroke="#452306"
                        strokeWidth="0.7"
                    />
                    {/* Knot Highlight & Shadows */}
                    <path
                        d="M 53.5 211.5 C 57.5 215 62 216 66 211.5"
                        fill="none"
                        stroke="#FFE8AE"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        opacity="0.9"
                    />
                    <path
                        d="M 53 214.5 C 57 217.5 62.5 218 66 214"
                        fill="none"
                        stroke="#482508"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                    />
                    <ellipse cx="60" cy="214.5" rx="3.8" ry="1.2" fill="url(#coilGrad)" stroke="#4A2609" strokeWidth="0.4" />
                </g>

                {/* =====================================================
                    FRAYED JUTE TASSEL / LOOSE ROPE FIBERS (y=214 to y=225)
                    Organic splayed cut twine fibers with realistic wisps
                ====================================================== */}
                <g className="frayed-tassel" strokeLinecap="round">
                    {/* Center main fiber bundles */}
                    <path d="M 60 214.5 C 60 217.5 59.5 221 59.2 225" fill="none" stroke="#A86E32" strokeWidth="2.2" />
                    <path d="M 59.8 215 C 59.8 217.8 59.4 221 59.2 224.5" fill="none" stroke="#FFE6A4" strokeWidth="0.7" opacity="0.85" />

                    {/* Left splayed strands */}
                    <path d="M 58 214.5 C 56 217 54 220 52 223" fill="none" stroke="#8F5825" strokeWidth="1.8" />
                    <path d="M 57.5 215 C 55.8 217.2 54 219.8 52.4 222.5" fill="none" stroke="#E5B26A" strokeWidth="0.6" opacity="0.8" />

                    <path d="M 56.5 215 C 54.5 218 53.2 221 51 224" fill="none" stroke="#B87B37" strokeWidth="1.3" />
                    <path d="M 55.5 215.5 C 53.5 217.5 50.5 220 48.5 222" fill="none" stroke="#9C642B" strokeWidth="0.9" />

                    {/* Right splayed strands */}
                    <path d="M 62 214.5 C 64 217 66 220 68 223" fill="none" stroke="#8F5825" strokeWidth="1.8" />
                    <path d="M 62.5 215 C 64.2 217.2 66 219.8 67.6 222.5" fill="none" stroke="#E5B26A" strokeWidth="0.6" opacity="0.8" />

                    <path d="M 63.5 215 C 65.5 218 66.8 221 69 224" fill="none" stroke="#B87B37" strokeWidth="1.3" />
                    <path d="M 64.5 215.5 C 66.5 217.5 69.5 220 71.5 222" fill="none" stroke="#9C642B" strokeWidth="0.9" />

                    {/* Fine loose jute hairs curling at tassel ends */}
                    <g className="tassel-hairs" opacity="0.85">
                        <path d="M 53 221 C 51.5 222.5 49 223.5 47 223" fill="none" stroke="#CCA059" strokeWidth="0.55" />
                        <path d="M 56 222 C 55 223.5 54.2 224.8 53.5 225.5" fill="none" stroke="#E0B066" strokeWidth="0.5" />
                        <path d="M 60.5 222 C 61.2 223.5 62 224.8 62.8 225.5" fill="none" stroke="#E0B066" strokeWidth="0.5" />
                        <path d="M 67 221 C 68.5 222.5 71 223.5 73 223" fill="none" stroke="#CCA059" strokeWidth="0.55" />
                        <path d="M 59 224.5 C 58.5 225.2 58 225.8 57.5 226" fill="none" stroke="#8A5524" strokeWidth="0.5" />
                        <path d="M 60 224.5 C 60.5 225.2 61 225.8 61.5 226" fill="none" stroke="#8A5524" strokeWidth="0.5" />
                    </g>
                </g>
                </g>
            </svg>
        </div>
    )
}