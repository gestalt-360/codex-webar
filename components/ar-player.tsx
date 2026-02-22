'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';

type Props = {
  imageUrl: string;
  videoUrl: string;
  projectName: string;
};

export function ARPlayer({ imageUrl, videoUrl, projectName }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState('Pronto para iniciar');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    return () => {
      setStarted(false);
    };
  }, []);

  const startAR = async () => {
    if (!containerRef.current || started) return;
    setStarted(true);
    setStatus('Carregando engine AR...');

    const module = await import('mind-ar/dist/mindar-image-three.prod.js');
    const { MindARThree } = module as any;

    const mindarThree = new MindARThree({
      container: containerRef.current,
      imageTargetSrc: imageUrl,
      uiLoading: 'no',
      uiScanning: 'no',
      uiError: 'no',
      filterMinCF: 0.0001,
      filterBeta: 0.01
    });

    const { renderer, scene, camera } = mindarThree;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    scene.add(light);

    const video = document.createElement('video');
    video.src = videoUrl;
    video.crossOrigin = 'anonymous';
    video.loop = true;
    video.muted = true;
    video.playsInline = true;

    const texture = new THREE.VideoTexture(video);
    const geometry = new THREE.PlaneGeometry(1, 0.5625);
    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
    const plane = new THREE.Mesh(geometry, material);

    const anchor = mindarThree.addAnchor(0);
    anchor.group.add(plane);
    anchor.onTargetFound = async () => {
      setStatus('Imagem detectada ✔');
      await video.play().catch(() => undefined);
    };
    anchor.onTargetLost = () => {
      setStatus('Aguardando imagem...');
      video.pause();
    };

    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });

    setStatus('Aponte a câmera para a imagem');
  };

  return (
    <div className="relative min-h-screen bg-black text-white">
      <div ref={containerRef} className="h-screen w-full" />
      <div className="pointer-events-none absolute left-0 top-0 w-full bg-gradient-to-b from-black/70 to-transparent p-4">
        <h1 className="text-lg font-semibold">{projectName}</h1>
        <p className="text-sm text-gray-200">{status}</p>
      </div>
      {!started ? (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <Button onClick={startAR} size="lg">
            Start AR
          </Button>
        </div>
      ) : null}
    </div>
  );
}
