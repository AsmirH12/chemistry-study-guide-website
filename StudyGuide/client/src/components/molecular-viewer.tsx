import { useEffect, useRef, useState } from "react";
import { Box } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { moleculesData } from "@/lib/chemistry-data";

export function MolecularViewer() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedMolecule, setSelectedMolecule] = useState('H₂O');
  const [isLoading, setIsLoading] = useState(true);

  const currentMolecule = moleculesData.find(m => m.formula === selectedMolecule);

  useEffect(() => {
    // Simulate loading time for 3D model
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [selectedMolecule]);

  // Note: In a real implementation, this would initialize Three.js scene
  // For now, we'll show a placeholder that matches the design

  return (
    <Card className="bg-white shadow-lg">
      <CardHeader>
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-ib-accent rounded-lg flex items-center justify-center mr-3">
            <Box className="text-white w-5 h-5" />
          </div>
          <CardTitle className="text-xl text-ib-neutral-800">3D Molecular Models</CardTitle>
        </div>
      </CardHeader>

      <CardContent>
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {moleculesData.map((molecule) => (
              <Button
                key={molecule.formula}
                size="sm"
                variant={selectedMolecule === molecule.formula ? "default" : "outline"}
                onClick={() => setSelectedMolecule(molecule.formula)}
                className={cn(
                  "text-sm",
                  selectedMolecule === molecule.formula 
                    ? "bg-ib-primary text-white" 
                    : "bg-gray-200 text-ib-neutral-700 hover:bg-gray-300"
                )}
              >
                {molecule.formula}
              </Button>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8 text-center">
          <div 
            ref={mountRef}
            className="w-full h-64 bg-white rounded-lg shadow-inner flex items-center justify-center"
          >
            {isLoading ? (
              <div className="text-center">
                <div className="animate-spin w-8 h-8 border-4 border-ib-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600">Loading 3D model...</p>
              </div>
            ) : (
              <div className="text-center">
                <Box className="w-16 h-16 text-ib-primary mb-4 mx-auto animate-pulse" />
                <p className="text-gray-600 font-medium">Interactive 3D model of {selectedMolecule}</p>
                <p className="text-sm text-gray-500 mt-2">Click and drag to rotate</p>
              </div>
            )}
          </div>
        </div>

        {currentMolecule && (
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-50 p-3 rounded-lg">
              <span className="font-medium text-ib-neutral-700">Bond Angle:</span>
              <span className="ml-2 text-ib-primary">{currentMolecule.bondAngle || 'N/A'}</span>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <span className="font-medium text-ib-neutral-700">Geometry:</span>
              <span className="ml-2 text-ib-primary">{currentMolecule.geometry}</span>
            </div>
          </div>
        )}

        {currentMolecule && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-ib-neutral-800">
              <strong>{currentMolecule.name}:</strong> {currentMolecule.description}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
