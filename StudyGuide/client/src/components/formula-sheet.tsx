import { ExternalLink, Calculator } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formulaSheetData } from "@/lib/chemistry-data";

export function FormulaSheet() {
  return (
    <>
      <Card className="bg-white shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-ib-neutral-800 flex items-center">
              <Calculator className="w-5 h-5 mr-2 text-ib-primary" />
              Formula Sheet
            </CardTitle>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-ib-primary hover:text-ib-primary-dark"
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Complete Formula Sheet</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 max-h-96 overflow-y-auto">
                  {formulaSheetData.map((category, index) => (
                    <div key={index}>
                      <h3 className="text-lg font-semibold text-ib-neutral-800 mb-3">
                        {category.category}
                      </h3>
                      <div className="space-y-3">
                        {category.formulas.map((formula, fIndex) => (
                          <div
                            key={fIndex}
                            className="bg-gray-50 p-4 rounded-lg"
                          >
                            <p className="font-medium text-ib-neutral-800 mb-1">
                              {formula.name}
                            </p>
                            <p className="font-mono text-ib-primary text-lg mb-2">
                              {formula.formula}
                            </p>
                            <p className="text-sm text-gray-600">
                              {formula.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            {formulaSheetData[0]?.formulas.slice(0, 3).map((formula, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-ib-neutral-800">
                  {formula.name}
                </p>
                <p className="text-sm font-mono text-ib-primary">
                  {formula.formula}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
