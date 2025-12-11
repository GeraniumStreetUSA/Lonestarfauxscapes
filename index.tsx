
declare const THREE: any;
declare const gsap: any;
declare const ScrollTrigger: any;

document.addEventListener('DOMContentLoaded', () => {
    
    // --- UI: Interactive "Live" Cards (Spotlight + Tilt) ---
    const initLiveCards = () => {
        const cards = document.querySelectorAll('.live-card');
        
        cards.forEach((card: Element) => {
            const c = card as HTMLElement;
            
            c.addEventListener('mousemove', (e) => {
                const rect = c.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                // 1. Spotlight Position
                c.style.setProperty('--x', `${x}px`);
                c.style.setProperty('--y', `${y}px`);

                // 2. 3D Tilt Effect
                // Calculate center-based coordinates (-1 to 1)
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -2; // Max rotation deg
                const rotateY = ((x - centerX) / centerX) * 2;

                c.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });

            c.addEventListener('mouseleave', () => {
                c.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            });
        });
    };
    initLiveCards();

    // --- UI: Set Footer Year ---
    const yearSpan = document.getElementById('year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear().toString();

    // --- UI: Mobile Menu ---
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileToggle = document.getElementById('mobile-toggle-btn');
    const mobileClose = document.getElementById('mobile-close-btn');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    function toggleMenu() {
        mobileMenu?.classList.toggle('active');
    }

    mobileToggle?.addEventListener('click', toggleMenu);
    mobileClose?.addEventListener('click', toggleMenu);
    mobileLinks.forEach(link => link.addEventListener('click', toggleMenu));

    // --- GSAP ANIMATIONS ---
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Header Scroll Effect
        const header = document.getElementById('main-header');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header?.classList.add('scrolled');
            } else {
                header?.classList.remove('scrolled');
            }
        });

        // Hero Text Stagger
        const heroElements = document.querySelectorAll('.gs-fade-up');
        gsap.fromTo(heroElements, 
            { y: 50, opacity: 0 },
            { 
                y: 0, 
                opacity: 1, 
                duration: 1.2, 
                stagger: 0.15, 
                ease: 'power3.out',
                delay: 0.2 
            }
        );

        // Scroll Reveal for Sections
        gsap.utils.toArray('.gs-reveal').forEach((elem: any) => {
            gsap.fromTo(elem, 
                { y: 40, opacity: 0 },
                {
                    scrollTrigger: {
                        trigger: elem,
                        start: "top 85%"
                    },
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: "power2.out"
                }
            );
        });
    }

    // --- THREE.JS / WEBGL "DIGITAL HEDGE" ---
    const initThreeJS = () => {
        const container = document.getElementById('canvas-container');
        if (!container || typeof THREE === 'undefined') return;

        // Cleanup
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }

        const scene = new THREE.Scene();
        // Match the deep black-green background
        scene.fog = new THREE.Fog('#050a07', 2, 20);

        const camera = new THREE.PerspectiveCamera(60, container.offsetWidth / container.offsetHeight, 0.1, 100);
        camera.position.set(0, 0, 14);

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(container.offsetWidth, container.offsetHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        // --- TEXTURE LOADING ---
        const loader = new THREE.TextureLoader();
        loader.setCrossOrigin('anonymous');
        const textureUrl = 'https://images.unsplash.com/photo-1530053969600-caed2596d242?q=80&w=2574&auto=format&fit=crop';
        const foliageTexture = loader.load(textureUrl);
        foliageTexture.wrapS = THREE.RepeatWrapping;
        foliageTexture.wrapT = THREE.RepeatWrapping;

        // --- INSTANCED MESH GENERATION ---
        const numCols = 50; 
        const numRows = 40;
        const numInstances = numCols * numRows;

        // 16x16 geometry for vertex displacement
        const geometry = new THREE.PlaneGeometry(1.2, 1.2, 16, 16);

        const instancedGeometry = new THREE.InstancedBufferGeometry();
        instancedGeometry.index = geometry.index;
        instancedGeometry.attributes.position = geometry.attributes.position;
        instancedGeometry.attributes.uv = geometry.attributes.uv;
        instancedGeometry.attributes.normal = geometry.attributes.normal;

        const offsets = new Float32Array(numInstances * 3);
        const uvOffsets = new Float32Array(numInstances * 2);
        const randoms = new Float32Array(numInstances);

        const width = 26;
        const height = 20;

        for (let i = 0; i < numInstances; i++) {
            const col = i % numCols;
            const row = Math.floor(i / numCols);

            const x = (col / numCols) * width - width / 2;
            const y = (row / numRows) * height - height / 2;
            const z = 0;

            offsets[i * 3 + 0] = x;
            offsets[i * 3 + 1] = y;
            offsets[i * 3 + 2] = z;

            uvOffsets[i * 2 + 0] = col / numCols;
            uvOffsets[i * 2 + 1] = row / numRows;

            randoms[i] = Math.random();
        }

        instancedGeometry.setAttribute('aOffset', new THREE.InstancedBufferAttribute(offsets, 3));
        instancedGeometry.setAttribute('aUvOffset', new THREE.InstancedBufferAttribute(uvOffsets, 2));
        instancedGeometry.setAttribute('aRandom', new THREE.InstancedBufferAttribute(randoms, 1));

        // --- SHADER MATERIAL ---
        const vertexShader = `
            uniform float uTime;
            uniform vec2 uMouse;
            
            attribute vec3 aOffset;
            attribute vec2 aUvOffset;
            attribute float aRandom;

            varying vec2 vUv;
            varying float vElevation;
            varying vec3 vNormal;
            varying float vFlow; // For the pattern design
            varying float vLeafDetail; // For internal leaf texture

            // Simplex Noise
            vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
            vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
            vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
            float snoise(vec2 v) {
                const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
                vec2 i  = floor(v + dot(v, C.yy) );
                vec2 x0 = v - i + dot(i, C.xx);
                vec2 i1;
                i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
                vec4 x12 = x0.xyxy + C.xxzz;
                x12.xy -= i1;
                i = mod289(i);
                vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
                vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
                m = m*m ;
                m = m*m ;
                vec3 x = 2.0 * fract(p * C.www) - 1.0;
                vec3 h = abs(x) - 0.5;
                vec3 ox = floor(x + 0.5);
                vec3 a0 = x - ox;
                m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
                vec3 g;
                g.x  = a0.x  * x0.x  + h.x  * x0.y;
                g.yz = a0.yz * x12.xz + h.yz * x12.yw;
                return 130.0 * dot(m, g);
            }

            mat4 rotationMatrix(vec3 axis, float angle) {
                axis = normalize(axis);
                float s = sin(angle);
                float c = cos(angle);
                float oc = 1.0 - c;
                return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                            oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                            oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                            0.0,                                0.0,                                0.0,                                1.0);
            }

            void main() {
                // UV Mapping
                vec2 cellUVSize = vec2(1.0/50.0, 1.0/40.0);
                vUv = aUvOffset + uv * cellUVSize; 

                // -- DESIGN FLOW PATTERN --
                // Use offset for macro noise
                vFlow = snoise(aOffset.xy * 0.15 + vec2(0.0, uTime * 0.1));

                // Setup Position
                vec3 pos = position;
                
                // -- INTERNAL LEAF DETAIL --
                float distToCenter = distance(uv, vec2(0.5));
                float volume = smoothstep(0.6, 0.0, distToCenter); 
                
                float leafFreq = 8.0;
                float leafNoise = snoise(vec2(uv.x * leafFreq, uv.y * leafFreq + uTime * 0.5));
                
                // Apply detail displacement
                pos.z += volume * 0.4; 
                pos.z += leafNoise * 0.15 * volume; 
                
                vLeafDetail = leafNoise;

                // -- INSTANCE ANIMATION --
                float noiseFreq = 0.3;
                float noiseSpeed = 0.3;
                float noiseVal = snoise(vec2(aOffset.x * noiseFreq + uTime * noiseSpeed, aOffset.y * noiseFreq));

                // Mouse Interaction
                vec2 mouseWorld = uMouse * vec2(13.0, 10.0);
                float dist = distance(aOffset.xy, mouseWorld);
                float mouseInfluence = smoothstep(4.0, 0.0, dist);

                // Rotations
                float rotX = noiseVal * 0.5 + mouseInfluence * (aOffset.y - mouseWorld.y);
                float rotY = noiseVal * 0.5 - mouseInfluence * (aOffset.x - mouseWorld.x);

                mat4 rotMat = rotationMatrix(vec3(1.0, 0.0, 0.0), rotX) * rotationMatrix(vec3(0.0, 1.0, 0.0), rotY);
                pos = (rotMat * vec4(pos, 1.0)).xyz;

                // Global Z Waves
                float wave = sin(aOffset.x * 0.5 + uTime * 0.5) * 0.2;
                pos.z += wave;

                pos += aOffset;

                vElevation = pos.z;
                vNormal = (rotMat * vec4(normal, 0.0)).xyz;

                gl_Position = projectionMatrix * viewMatrix * vec4(pos, 1.0);
            }
        `;

        const fragmentShader = `
            uniform sampler2D uTexture;
            
            // The 4 Material Palettes
            uniform vec3 uColorBoxwood;  
            uniform vec3 uColorFern;     
            uniform vec3 uColorSage;     
            uniform vec3 uColorOlive;    

            varying vec2 vUv;
            varying float vElevation;
            varying vec3 vNormal;
            varying float vFlow;
            varying float vLeafDetail;

            // Bayer Matrix 4x4
            float dither(vec2 position, float brightness) {
                int x = int(mod(position.x, 4.0));
                int y = int(mod(position.y, 4.0));
                int index = x + y * 4;
                float limit = 0.0;
                if (index == 0) limit = 0.0625;
                else if (index == 1) limit = 0.5625;
                else if (index == 2) limit = 0.1875;
                else if (index == 3) limit = 0.6875;
                else if (index == 4) limit = 0.8125;
                else if (index == 5) limit = 0.3125;
                else if (index == 6) limit = 0.9375;
                else if (index == 7) limit = 0.4375;
                else if (index == 8) limit = 0.25;
                else if (index == 9) limit = 0.75;
                else if (index == 10) limit = 0.125;
                else if (index == 11) limit = 0.625;
                else if (index == 12) limit = 1.0;
                else if (index == 13) limit = 0.5;
                else if (index == 14) limit = 0.875;
                else if (index == 15) limit = 0.375;
                return brightness < limit ? 0.0 : 1.0;
            }

            void main() {
                // 1. Texture Sample
                vec4 texColor = texture2D(uTexture, vUv);
                float gray = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));

                // 2. Material Mixing Logic (Fluid Design)
                float p = vFlow * 0.5 + 0.5; 

                vec3 c1 = uColorBoxwood;
                vec3 c2 = uColorSage;
                vec3 c3 = uColorFern;
                vec3 c4 = uColorOlive;

                float mix1 = smoothstep(0.25, 0.35, p);
                vec3 layer1 = mix(c1, c2, mix1);
                
                float mix2 = smoothstep(0.50, 0.60, p);
                vec3 layer2 = mix(layer1, c3, mix2);

                float mix3 = smoothstep(0.80, 0.90, p);
                vec3 plantColor = mix(layer2, c4, mix3);

                plantColor += vLeafDetail * 0.05;

                // 3. Lighting
                vec3 lightDir = normalize(vec3(0.3, 0.5, 1.0));
                float light = max(0.0, dot(vNormal, lightDir));
                
                float specular = pow(max(0.0, dot(reflect(-lightDir, vNormal), vec3(0.0,0.0,1.0))), 16.0) * 0.4;

                // 4. Combine
                vec3 finalAlbedo = plantColor * (gray * 1.0 + 0.2) + specular;
                
                float brightness = dot(finalAlbedo, vec3(0.33)) + light * 0.3 + vElevation * 0.1;

                // 5. Dither Application
                float d = dither(gl_FragCoord.xy, brightness);

                vec3 shadowCol = plantColor * 0.3;
                vec3 highlightCol = plantColor * 1.4 + vec3(0.1);

                vec3 finalColor = mix(shadowCol, highlightCol, d);

                gl_FragColor = vec4(finalColor, 1.0);
            }
        `;

        const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                uTime: { value: 0 },
                uMouse: { value: new THREE.Vector2(0, 0) },
                uTexture: { value: foliageTexture },
                // CUSTOM PALETTES
                uColorBoxwood: { value: new THREE.Color('#133316') }, // Deep Dark Green
                uColorFern:    { value: new THREE.Color('#4caf50') }, // Vibrant Standard Green
                uColorSage:    { value: new THREE.Color('#447a68') }, // Cool Blue-Green
                uColorOlive:   { value: new THREE.Color('#b5cc5a') }  // Yellow-Green Accent
            },
            side: THREE.DoubleSide
        });

        const mesh = new THREE.Mesh(instancedGeometry, material);
        mesh.frustumCulled = false; 
        scene.add(mesh);

        // Mouse Handler
        let mouseX = 0;
        let mouseY = 0;
        
        const onMouseMove = (e: MouseEvent) => {
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            mouseX = (x / rect.width) * 2 - 1;
            mouseY = -(y / rect.height) * 2 + 1;
        };
        window.addEventListener('mousemove', onMouseMove);

        // Animation Loop
        const clock = new THREE.Clock();

        const animate = () => {
            requestAnimationFrame(animate);
            
            const time = clock.getElapsedTime();
            material.uniforms.uTime.value = time;

            material.uniforms.uMouse.value.x += (mouseX - material.uniforms.uMouse.value.x) * 0.05;
            material.uniforms.uMouse.value.y += (mouseY - material.uniforms.uMouse.value.y) * 0.05;

            camera.position.x = Math.sin(time * 0.1) * 0.3;
            camera.position.y = Math.cos(time * 0.15) * 0.3;
            camera.lookAt(0, 0, 0);

            renderer.render(scene, camera);
        };

        animate();

        window.addEventListener('resize', () => {
            const width = container.offsetWidth;
            const height = container.offsetHeight;
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        });
    };

    setTimeout(initThreeJS, 100);
});
