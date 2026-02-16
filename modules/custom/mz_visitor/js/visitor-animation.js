/**
 * Advanced Three.js Background Animation (Mizara Technologie Edition)
 * A visually striking wave of glowing particles.
 */
(function (Drupal, once) {
    Drupal.behaviors.mzVisitorAnimation = {
        attach: function (context, settings) {
            // Use once to target the canvas container directly, more robust than body class.
            once('mz-visitor-animation', '#mz-visitor-canvas', context).forEach(function (element) {
                initThreeJS(element);
            });
        }
    };

    function initThreeJS(container) {
        if (!container) return;

        // SCENE
        const scene = new THREE.Scene();

        // CAMERA
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 1.5, 4);

        // RENDERER
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        // GEOMETRY (WAVE)
        const count = 60;
        const separation = 0.25;
        const amountX = count;
        const amountY = count;

        const numParticles = amountX * amountY;
        const positions = new Float32Array(numParticles * 3);
        const scales = new Float32Array(numParticles);

        let i = 0, j = 0;
        for (let ix = 0; ix < amountX; ix++) {
            for (let iy = 0; iy < amountY; iy++) {
                positions[i] = ix * separation - (amountX * separation) / 2; // x
                positions[i + 1] = 0; // y
                positions[i + 2] = iy * separation - (amountY * separation) / 2; // z

                scales[j] = 1;

                i += 3;
                j++;
            }
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

        // MATERIAL
        const material = new THREE.PointsMaterial({
            size: 0.05,
            color: 0x4fd1c5, // Teal neon
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        const particles = new THREE.Points(geometry, material);
        scene.add(particles);

        // MOUSE INTERACTION
        let mouseX = 0, mouseY = 0;
        let targetX = 0, targetY = 0;
        const windowHalfX = window.innerWidth / 2;
        const windowHalfY = window.innerHeight / 2;

        document.addEventListener('mousemove', (event) => {
            mouseX = (event.clientX - windowHalfX);
            mouseY = (event.clientY - windowHalfY);
        });

        // ANIMATION LOOP
        let step = 0;
        function animate() {
            if (!document.body.contains(container)) return; // Stop if container is removed

            requestAnimationFrame(animate);

            step += 0.04;

            const pos = particles.geometry.attributes.position.array;
            const sc = particles.geometry.attributes.scale.array;

            let i = 0, j = 0;
            for (let ix = 0; ix < amountX; ix++) {
                for (let iy = 0; iy < amountY; iy++) {
                    pos[i + 1] = (Math.sin((ix + step) * 0.3) * 0.5) + (Math.sin((iy + step) * 0.5) * 0.5);
                    sc[j] = (Math.sin((ix + step) * 0.3) + 1) * 8 + (Math.sin((iy + step) * 0.5) + 1) * 8;
                    i += 3;
                    j++;
                }
            }

            particles.geometry.attributes.position.needsUpdate = true;

            targetX = mouseX * 0.0008;
            targetY = mouseY * 0.0008;

            particles.rotation.y += (targetX - particles.rotation.y) * 0.05;
            particles.rotation.x += (targetY - particles.rotation.x) * 0.05;

            renderer.render(scene, camera);
        }

        // RESIZE
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        animate();
    }
})(Drupal, once);
