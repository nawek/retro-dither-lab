
import { EffectLayer } from '@/components/LayerSystem';
import { applyDither } from './ditherAlgorithms';

export function processLayers(
  originalImageData: ImageData,
  layers: EffectLayer[]
): ImageData {
  if (layers.length === 0) {
    return originalImageData;
  }

  const visibleLayers = layers.filter(layer => layer.isVisible);
  if (visibleLayers.length === 0) {
    return originalImageData;
  }

  // Start with the original image
  let compositeImageData = new ImageData(
    new Uint8ClampedArray(originalImageData.data),
    originalImageData.width,
    originalImageData.height
  );

  // Process each visible layer
  for (const layer of visibleLayers) {
    // Apply the dithering effect to the original image for this layer
    const layerImageData = new ImageData(
      new Uint8ClampedArray(originalImageData.data),
      originalImageData.width,
      originalImageData.height
    );

    const processedLayer = applyDither(
      layerImageData,
      layer.algorithm,
      layer.settings.brightness,
      layer.settings.contrast,
      layer.settings.threshold,
      layer.settings.noiseLevel,
      layer.settings.saturation,
      layer.settings.posterize,
      layer.settings.blur
    );

    // Blend this layer with the composite
    compositeImageData = blendLayers(
      compositeImageData,
      processedLayer,
      layer.blendMode,
      layer.opacity / 100
    );
  }

  return compositeImageData;
}

function blendLayers(
  base: ImageData,
  overlay: ImageData,
  blendMode: string,
  opacity: number
): ImageData {
  const result = new ImageData(
    new Uint8ClampedArray(base.data),
    base.width,
    base.height
  );

  const baseData = result.data;
  const overlayData = overlay.data;

  for (let i = 0; i < baseData.length; i += 4) {
    const baseR = baseData[i] / 255;
    const baseG = baseData[i + 1] / 255;
    const baseB = baseData[i + 2] / 255;

    const overlayR = overlayData[i] / 255;
    const overlayG = overlayData[i + 1] / 255;
    const overlayB = overlayData[i + 2] / 255;

    let blendedR = baseR;
    let blendedG = baseG;
    let blendedB = baseB;

    switch (blendMode) {
      case 'multiply':
        blendedR = baseR * overlayR;
        blendedG = baseG * overlayG;
        blendedB = baseB * overlayB;
        break;

      case 'screen':
        blendedR = 1 - (1 - baseR) * (1 - overlayR);
        blendedG = 1 - (1 - baseG) * (1 - overlayG);
        blendedB = 1 - (1 - baseB) * (1 - overlayB);
        break;

      case 'overlay':
        blendedR = baseR < 0.5 ? 2 * baseR * overlayR : 1 - 2 * (1 - baseR) * (1 - overlayR);
        blendedG = baseG < 0.5 ? 2 * baseG * overlayG : 1 - 2 * (1 - baseG) * (1 - overlayG);
        blendedB = baseB < 0.5 ? 2 * baseB * overlayB : 1 - 2 * (1 - baseB) * (1 - overlayB);
        break;

      case 'soft-light':
        blendedR = softLightBlend(baseR, overlayR);
        blendedG = softLightBlend(baseG, overlayG);
        blendedB = softLightBlend(baseB, overlayB);
        break;

      case 'normal':
      default:
        blendedR = overlayR;
        blendedG = overlayG;
        blendedB = overlayB;
        break;
    }

    // Apply opacity
    baseData[i] = Math.round((baseR + (blendedR - baseR) * opacity) * 255);
    baseData[i + 1] = Math.round((baseG + (blendedG - baseG) * opacity) * 255);
    baseData[i + 2] = Math.round((baseB + (blendedB - baseB) * opacity) * 255);
  }

  return result;
}

function softLightBlend(base: number, overlay: number): number {
  if (overlay < 0.5) {
    return 2 * base * overlay + base * base * (1 - 2 * overlay);
  } else {
    return 2 * base * (1 - overlay) + Math.sqrt(base) * (2 * overlay - 1);
  }
}
