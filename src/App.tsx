import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import LexicalAnalyzer, { Token } from './components/LexicalAnalyzer'
import SyntaxAnalyzer, { TreeNode } from './components/SyntaxAnalyzer'
import DerivationSteps from './components/DerivationSteps'
import SyntaxTree from './components/SyntaxTree'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function App() {
  const [expression, setExpression] = useState<string>('')
  const [tokens, setTokens] = useState<Token[]>([])
  const [syntaxValid, setSyntaxValid] = useState<boolean | null>(null)
  const [derivationSteps, setDerivationSteps] = useState<string[]>([])
  const [astData, setAstData] = useState<TreeNode | null>(null)

  const handleAnalyze = () => {
    try {
      const lexResult = LexicalAnalyzer(expression)
      setTokens(lexResult)

      const { valid, steps, ast } = SyntaxAnalyzer(lexResult)
      setSyntaxValid(valid)
      setDerivationSteps(steps)
      setAstData(ast)

      if (valid) {
        toast.success('Expression analyzed successfully!', {
          position: "top-left",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          style: {
            width: "270px", 
            fontSize: "1rem",
          },
        })
      } else {
        toast.error('Invalid expression!', {
          position: "top-left",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          style: {
            width: "270px", 
            fontSize: "1rem", 
          },
        })
      }
    } catch (error) {
      toast.error('An error occurred during analysis!', {
        position: "top-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        style: {
          width: "200px", 
          fontSize: "0.9rem", 
        },
      })
    }
  }

  const getTokenColor = (type: string) => {
    switch (type) {
      case 'NUMBER':
        return 'bg-blue-500'
      case 'OPERATOR':
        return 'bg-red-500'
      case 'FUNCTION':
        return 'bg-green-500'
      case 'FACTORIAL':
        return 'bg-yellow-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div className="container mx-auto px-28 pt-8">
      <ToastContainer />
      <a href="/"><h1 className="text-2xl font-bold mb-4">Mathematical Expression Analyzer</h1></a>
      <div className="flex space-x-2 mb-4">
        <Input
          type="text"
          placeholder="Enter mathematical expression"
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
        />
        <Button onClick={handleAnalyze}>Analyze</Button>
      </div>
      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="grammar">Grammar</TabsTrigger>
          <TabsTrigger value="lexical">Lexical Analysis</TabsTrigger>
          <TabsTrigger value="syntax">Syntax Analysis</TabsTrigger>
          <TabsTrigger value="derivation">Derivation Steps</TabsTrigger>
          <TabsTrigger value="tree">Abstract Syntax Tree</TabsTrigger>
          <TabsTrigger value="info">Info</TabsTrigger>
        </TabsList>
        <TabsContent value="lexical">
          <Card>
            <CardHeader>
              <CardTitle>Lexical Analysis Result</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Token</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tokens.map((token, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <Badge className={getTokenColor(token.type)}>{token.type}</Badge>
                      </TableCell>
                      <TableCell>{token.value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="syntax">
          <Card>
            <CardHeader>
              <CardTitle>Syntax Analysis Result</CardTitle>
            </CardHeader>
            <CardContent>
              {syntaxValid !== null && (
                <div className={`p-4 rounded-md ${syntaxValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {syntaxValid ? 'Expression is syntactically valid' : 'Expression is not syntactically valid'}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="derivation">
          <DerivationSteps steps={derivationSteps} />
        </TabsContent>
        <TabsContent value="tree">
          <Card>
            <CardHeader>
              <CardTitle>Abstract Syntax Tree</CardTitle>
            </CardHeader>
            <CardContent>
              {astData && <SyntaxTree data={astData} />}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="grammar">
          <Card>
            <CardHeader>
              <CardTitle>Grammar Structure</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                <code>
{`E -> T (( "+" | "-" ) T )*
T -> F (( "*" | "/" ) F )*
F -> P ( "!" )*
P -> V ( "^" V )*
V -> NUMBER
   | "(" E ")"
   | FUNCTION "(" E ")"`}
                </code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="info">
              <Card>
                <CardHeader>
                  <CardTitle>
                    Info
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                    <p>
                      Compiler Design Project.
                    </p>
                    <p>
                      Yusuf KAYA - 201504057
                    </p>
                  </pre>
                </CardContent>
              </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

