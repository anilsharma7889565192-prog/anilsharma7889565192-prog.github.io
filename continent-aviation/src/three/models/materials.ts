import * as THREE from "three";

export const mats = {
  paint: (color = "#f1f0ec") => new THREE.MeshPhysicalMaterial({ color, roughness: 0.3, metalness: 0, clearcoat: 0.8, clearcoatRoughness: 0.12 }),
  polished: () => new THREE.MeshStandardMaterial({ color: "#d9dde2", roughness: 0.12, metalness: 1 }),
  darkMetal: () => new THREE.MeshStandardMaterial({ color: "#2a2d33", roughness: 0.45, metalness: 0.8 }),
  rubber: () => new THREE.MeshStandardMaterial({ color: "#131417", roughness: 0.85, metalness: 0 }),
  strut: () => new THREE.MeshStandardMaterial({ color: "#b9bcc2", roughness: 0.25, metalness: 0.9 }),
  glass: () => new THREE.MeshPhysicalMaterial({ color: "#0b1018", roughness: 0.04, metalness: 0.2, clearcoat: 1 }),
  emissive: (color: string, intensity = 8) => new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(intensity) }),
};
