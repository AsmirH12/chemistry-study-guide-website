import * as THREE from 'three';

export interface AtomData {
  element: string;
  position: [number, number, number];
  color: string;
}

export interface BondData {
  start: number;
  end: number;
}

export interface MoleculeData {
  atoms: AtomData[];
  bonds: BondData[];
}

export const moleculeStructures: Record<string, MoleculeData> = {
  'H2O': {
    atoms: [
      { element: 'O', position: [0, 0, 0], color: '#ff0000' },
      { element: 'H', position: [0.96, 0, 0], color: '#ffffff' },
      { element: 'H', position: [-0.24, 0.93, 0], color: '#ffffff' }
    ],
    bonds: [
      { start: 0, end: 1 },
      { start: 0, end: 2 }
    ]
  },
  'CH4': {
    atoms: [
      { element: 'C', position: [0, 0, 0], color: '#000000' },
      { element: 'H', position: [0.63, 0.63, 0.63], color: '#ffffff' },
      { element: 'H', position: [-0.63, -0.63, 0.63], color: '#ffffff' },
      { element: 'H', position: [-0.63, 0.63, -0.63], color: '#ffffff' },
      { element: 'H', position: [0.63, -0.63, -0.63], color: '#ffffff' }
    ],
    bonds: [
      { start: 0, end: 1 },
      { start: 0, end: 2 },
      { start: 0, end: 3 },
      { start: 0, end: 4 }
    ]
  },
  'NH3': {
    atoms: [
      { element: 'N', position: [0, 0, 0], color: '#0000ff' },
      { element: 'H', position: [0.94, 0, 0.33], color: '#ffffff' },
      { element: 'H', position: [-0.47, 0.81, 0.33], color: '#ffffff' },
      { element: 'H', position: [-0.47, -0.81, 0.33], color: '#ffffff' }
    ],
    bonds: [
      { start: 0, end: 1 },
      { start: 0, end: 2 },
      { start: 0, end: 3 }
    ]
  },
  'CO2': {
    atoms: [
      { element: 'C', position: [0, 0, 0], color: '#000000' },
      { element: 'O', position: [1.16, 0, 0], color: '#ff0000' },
      { element: 'O', position: [-1.16, 0, 0], color: '#ff0000' }
    ],
    bonds: [
      { start: 0, end: 1 },
      { start: 0, end: 2 }
    ]
  }
};

export function createMoleculeScene(moleculeName: string): THREE.Scene | null {
  const structure = moleculeStructures[moleculeName];
  if (!structure) return null;

  const scene = new THREE.Scene();
  
  // Create atoms
  structure.atoms.forEach((atomData, index) => {
    const atomRadius = atomData.element === 'H' ? 0.25 : 0.4;
    const geometry = new THREE.SphereGeometry(atomRadius, 16, 16);
    const material = new THREE.MeshPhongMaterial({ color: atomData.color });
    const atom = new THREE.Mesh(geometry, material);
    
    atom.position.set(...atomData.position);
    atom.userData = { atomIndex: index, element: atomData.element };
    scene.add(atom);
  });

  // Create bonds
  structure.bonds.forEach((bondData) => {
    const startPos = new THREE.Vector3(...structure.atoms[bondData.start].position);
    const endPos = new THREE.Vector3(...structure.atoms[bondData.end].position);
    const direction = new THREE.Vector3().subVectors(endPos, startPos);
    const distance = direction.length();
    
    const geometry = new THREE.CylinderGeometry(0.05, 0.05, distance, 8);
    const material = new THREE.MeshPhongMaterial({ color: 0x666666 });
    const bond = new THREE.Mesh(geometry, material);
    
    bond.position.copy(startPos).add(direction.clone().multiplyScalar(0.5));
    bond.lookAt(endPos);
    bond.rotateX(Math.PI / 2);
    
    scene.add(bond);
  });

  return scene;
}
