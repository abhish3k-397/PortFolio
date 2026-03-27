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
        const isMobile = this.config.width < 768
        this.modes.debug.startPosition = isMobile ? new THREE.Vector3(1780, 0.6, 1780) : new THREE.Vector3(780, 0.6, 780)
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
            debug._debugCameraLogCount = 0
            debug._debugZoomLogCount = 0
            debug._debugAnchorInteractLogCount = 0
            debug._debugAnchorResetLogCount = 0
            debug._debugEdgeLogCount = 0
            debug._debugNearEndLogCount = 0
            debug.hasInteracted = false
            debug.leftTopSinceInteract = false
            debug.leftBottomSinceInteract = false
        }

        controls.autoRotate = true

        if (this.experience.isInteractive) {
            // 1. UNLOCK limits entirely so OrbitControls can process the mouse drag
            controls.minDistance = 1
            controls.maxDistance = 4000
            controls.minPolarAngle = 0
            controls.maxPolarAngle = Math.PI

            // 2. MUST process the drag right now while unlocked
            controls.update()
            const finiteState = Number.isFinite(debug.instance.position.x) && Number.isFinite(debug.instance.position.y) && Number.isFinite(debug.instance.position.z) && Number.isFinite(debug.instance.position.length())
            if (!finiteState) {

            }

            // 3. Read the resulting coordinates caused by the user's drag
            const currentDist = debug.instance.position.length()
            const currentPolar = controls.getPolarAngle()

            // 4. Recalculate the virtual 'Start' anchor so that the cinematic path
            // passes exactly through this current user viewpoint.
            // We solve in Cartesian space for better stability:
            // startPos = (currentPos - endPos * s) / (1 - s)
            if (s < 0.99) {
                const denominator = 1 - s
                const solvedStartPosition = debug.instance.position.clone().sub(debug.endPosition.clone().multiplyScalar(s)).multiplyScalar(1 / denominator)
                const solvedStartDist = solvedStartPosition.length()
                const solvedStartPolar = Math.acos(THREE.MathUtils.clamp(solvedStartPosition.y / Math.max(solvedStartDist, 0.0001), -1, 1))

                if (Number.isFinite(solvedStartDist)) debug.customStartDist = solvedStartDist
                if (Number.isFinite(solvedStartPolar)) debug.customStartPolar = solvedStartPolar
                debug.hasInteracted = true
                if (debug._debugAnchorInteractLogCount < 8) {
                    debug._debugAnchorInteractLogCount += 1

                }
            } else if (debug._debugNearEndLogCount < 6) {
                debug._debugNearEndLogCount += 1

            }
        } else {
            // SCROLLING / IDLE
            controls.update()

            const atTop = s <= 0.001
            const atBottom = s >= 0.999
            if (debug.hasInteracted) {
                if (!atTop) debug.leftTopSinceInteract = true
                if (!atBottom) debug.leftBottomSinceInteract = true

                const shouldResetFromTopReturn = atTop && debug.leftTopSinceInteract
                const shouldResetFromBottomReturn = atBottom && debug.leftBottomSinceInteract
                if (shouldResetFromTopReturn || shouldResetFromBottomReturn) {
                    debug.customStartDist = debug.startDist
                    debug.customStartPolar = debug.startPolar
                    debug.hasInteracted = false
                    debug.leftTopSinceInteract = false
                    debug.leftBottomSinceInteract = false
                    if (debug._debugAnchorResetLogCount < 8) {
                        debug._debugAnchorResetLogCount += 1

                    }
                }
            }

            // Calculate exact target coordinates for current scroll 
            const holdTopInteractiveState = debug.hasInteracted && atTop && !debug.leftTopSinceInteract
            const holdBottomInteractiveState = debug.hasInteracted && atBottom && !debug.leftBottomSinceInteract
            if (holdTopInteractiveState || holdBottomInteractiveState) {
                if (debug._debugEdgeLogCount < 8) {
                    debug._debugEdgeLogCount += 1

                }
                const source = this.modes[this.mode].instance
                source.updateWorldMatrix(true, false)
                this.instance.position.set(0, 0, 0)
                this.instance.quaternion.set(0, 0, 0, 0)
                this.instance.scale.set(1, 1, 1)
                this.instance.applyMatrix4(source.matrixWorld)
                return
            }

            const targetDist = MathUtils.lerp(debug.customStartDist, debug.endDist, s)
            const targetPolar = MathUtils.lerp(debug.customStartPolar, debug.endPolar, s)
            if ((atTop || atBottom) && debug._debugEdgeLogCount < 8) {
                debug._debugEdgeLogCount += 1

            }
            const currentAzimuth = controls.getAzimuthalAngle()
            const targetPosition = new THREE.Vector3().setFromSpherical(
                new THREE.Spherical(targetDist, targetPolar, currentAzimuth)
            )
            const currentDistBefore = debug.instance.position.length()
            debug.instance.position.lerp(targetPosition, 0.12)
            debug.instance.lookAt(0, 0, 0)
            const currentDistAfter = debug.instance.position.length()
            if (debug._debugCameraLogCount < 14 && (s > 0 || debug._debugCameraLogCount < 4)) {
                debug._debugCameraLogCount += 1

            }

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
