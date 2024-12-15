import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface DerivationStepsProps {
  steps: string[];
}

const DerivationSteps: React.FC<DerivationStepsProps> = ({ steps }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Derivation Steps</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Step</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {steps.map((step, index) => {
              const [type, content] = step.split(': ')
              return (
                <TableRow key={index}>
                  <TableCell className="font-medium">{type}</TableCell>
                  <TableCell>{content}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default DerivationSteps

