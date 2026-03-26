import * as THREE from 'three'
import Experience from './Experience.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export default class Camera {
    constructor(_options) {
        // Options
        this.experience = new Experience()
        this.config = this.experience.config
        this.debug = this.experience.debug
        this.time = this.experience.time
        this.sizes = this.experience.sizes
        this.targetElement = this.experience.targetElement
        this.scenes = this.experience.scenes

        // Set up
        this.mode = 'debug' // default \ debug

        this.setInstance()
        this.setModes()

        // Debug
        if (this.debug.active) {
            const folder = this.debug.ui.getFolder('camera')

            folder
                .add(
                    this,
                    'mode',
                    {
                        debug: 'debug',
                        default: 'default'
                    }
                )
        }
    }

    setInstance() {
        // Set up
        this.instance = new THREE.PerspectiveCamera(45, this.config.width / this.config.height, 0.1, 4000)
        this.instance.rotation.reorder('YXZ')

        this.scenes.space.add(this.instance)
    }

    setModes() {
        this.modes = {}

        // Default
        this.modes.default = {}
        this.modes.default.instance = this.instance.clone()
        this.modes.default.instance.rotation.reorder('YXZ')

        // Debug
        this.modes.debug = {}
        this.modes.debug.instance = this.instance.clone()
        this.modes.debug.instance.rotation.reorder('YXZ')

        // Scroll-driven targets
        this.modes.debug.startPosition = new THREE.Vector3(780, 0.6, 780)
        this.modes.debug.endPosition = new THREE.Vector3(12, 1, 12)
        
        // Convert to spherical targets
        this.modes.debug.startDist = this.modes.debug.startPosition.length()
        this.modes.debug.endDist = this.modes.debug.endPosition.length()
        this.modes.debug.startPolar = Math.acos(THREE.MathUtils.clamp(this.modes.debug.startPosition.y / this.modes.debug.startDist, -1, 1))
        this.modes.debug.endPolar = Math.acos(THREE.MathUtils.clamp(this.modes.debug.endPosition.y / this.modes.debug.endDist, -1, 1))
        
        // Offset tracking
        this.modes.debug.userDistOffset = 0
        this.modes.debug.userPolarOffset = 0

        this.modes.debug.instance.position.copy(this.modes.debug.startPosition)

        this.modes.debug.orbitControls = new OrbitControls(this.modes.debug.instance, this.targetElement)
        this.modes.debug.orbitControls.enabled = true
        this.modes.debug.orbitControls.autoRotate = true
        this.modes.debug.orbitControls.autoRotateSpeed = -0.3
        this.modes.debug.orbitControls.enableDamping = true
        this.modes.debug.orbitControls.dampingFactor = 0.05
    }

    resize() {
        this.instance.aspect = this.config.width / this.config.height
        this.instance.updateProjectionMatrix()

        this.modes.default.instance.aspect = this.config.width / this.config.height
        this.modes.default.instance.updateProjectionMatrix()

        this.modes.debug.instance.aspect = this.config.width / this.config.height
        this.modes.debug.instance.updateProjectionMatrix()
    }

    update() {
        const MathUtils = THREE.MathUtils
        const sRaw = this.experience.scrollProgress
        const s = Number.isFinite(sRaw) ? MathUtils.clamp(sRaw, 0, 1) : 0
        const controls = this.modes.debug.orbitControls
        const debug = this.modes.debug
        if (!controls) return

        // Initialize custom anchors if they don't exist
        if (debug.customStartDist === undefined) {
            debug.customStartDist = debug.startDist
            debug.customStartPolar = debug.startPolar
        }

        controls.autoRotate = true

        if (this.experience.isInteractive) {
            // 1. UNLOCK limits entirely so OrbitControls can process the mouse drag
            controls.minDistance = 1
            controls.maxDistance = 4000
            controls.minPolarAngle = 0
            controls.maxPolarAngle = Math.PI

            // Trackpad gestures: two-finger drag rotates/tilts, pinch zooms.
            const gestureX = this.experience.trackpadDeltaX || 0
            const gestureY = this.experience.trackpadDeltaY || 0
            const isPinchGesture = !!this.experience.trackpadIsPinch
            this.experience.trackpadDeltaX = 0
            this.experience.trackpadDeltaY = 0
            this.experience.trackpadIsPinch = false

            if (Math.abs(gestureX) > 0.001 || Math.abs(gestureY) > 0.001) {
                const absX = Math.abs(gestureX)
                const absY = Math.abs(gestureY)
                const verticalDominant = absY > absX * 1.6 && absY > 1.5
                if (isPinchGesture || verticalDominant) {
                    const zoomScale = Math.exp(Math.min(absY, 100) * 0.0035)
                    if (gestureY > 0) {
                        controls.dollyOut(zoomScale)
                    } else {
                        controls.dollyIn(zoomScale)
                    }
                } else {
                    controls.rotateLeft(gestureX * 0.0045)
                    controls.rotateUp(gestureY * 0.0045)
                }
            }

            // 2. MUST process the drag right now while unlocked
            controls.update()

            // 3. Read the resulting coordinates caused by the user's drag
            const currentDist = debug.instance.position.length()
            const currentPolar = controls.getPolarAngle()

            // 4. Recalculate the virtual 'Start' anchor so that the cinematic path
            // passes exactly through this current user viewpoint.
            // Start = (Current - End * s) / (1 - s)
            if (s < 0.99) {
                const newStartDist = (currentDist - debug.endDist * s) / (1 - s)
                const newStartPolar = (currentPolar - debug.endPolar * s) / (1 - s)

                if (isFinite(newStartDist)) debug.customStartDist = newStartDist
                if (isFinite(newStartPolar)) debug.customStartPolar = THREE.MathUtils.clamp(newStartPolar, 0, Math.PI)
            }
        } else {
            // SCROLLING / IDLE
            controls.update()

            // Once the cinematic reaches the end, restore canonical start anchors.
            // Scrolling back up then always returns to the canonical start position.
            if (s >= 0.999) {
                debug.customStartDist = debug.startDist
                debug.customStartPolar = debug.startPolar
            }

            // Calculate exact target coordinates for current scroll 
            const targetDist = MathUtils.lerp(debug.customStartDist, debug.endDist, s)
            const targetPolar = MathUtils.lerp(debug.customStartPolar, debug.endPolar, s)

            // Converge the OrbitControls limits smoothly. We leave a tiny threshold to prevent
            // math locks within OrbitControls logic.
            controls.minDistance = MathUtils.lerp(controls.minDistance, targetDist - 0.05, 0.1)
            controls.maxDistance = MathUtils.lerp(controls.maxDistance, targetDist + 0.05, 0.1)
            controls.minPolarAngle = MathUtils.lerp(controls.minPolarAngle, targetPolar - 0.005, 0.1)
            controls.maxPolarAngle = MathUtils.lerp(controls.maxPolarAngle, targetPolar + 0.005, 0.1)
        }

        // Apply coordinates to scene camera
        const source = this.modes[this.mode].instance
        source.updateWorldMatrix(true, false)

        this.instance.position.set(0, 0, 0)
        this.instance.quaternion.set(0, 0, 0, 0)
        this.instance.scale.set(1, 1, 1)
        this.instance.applyMatrix4(source.matrixWorld)
    }

    destroy() {
        if (this.modes.debug.orbitControls) {
            this.modes.debug.orbitControls.destroy()
        }
    }
}
