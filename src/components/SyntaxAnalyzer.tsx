import { Token } from './LexicalAnalyzer'

interface ASTNode {
  type: string;
  [key: string]: any;
}

export interface TreeNode {
  name: string;
  children?: TreeNode[];
}

export interface SyntaxAnalysisResult {
  valid: boolean;
  steps: string[];
  ast: TreeNode;
}

const SyntaxAnalyzer = (tokens: Token[]): SyntaxAnalysisResult => {
  let current = 0
  const steps: string[] = []

  const expression = (): ASTNode => {
    let node = term()
    while (current < tokens.length) {
      let token = tokens[current]
      if (token.type === 'OPERATOR' && (token.value === '+' || token.value === '-')) {
        current++
        node = {
          type: 'BinaryExpression',
          operator: token.value,
          left: node,
          right: term()
        }
        steps.push(`Expression: Created binary expression with operator '${token.value}'`)
      } else {
        break
      }
    }
    return node
  }

  const term = (): ASTNode => {
    let node = factor()
    while (current < tokens.length) {
      let token = tokens[current]
      if (token.type === 'OPERATOR' && (token.value === '*' || token.value === '/')) {
        current++
        node = {
          type: 'BinaryExpression',
          operator: token.value,
          left: node,
          right: factor()
        }
        steps.push(`Term: Created binary expression with operator '${token.value}'`)
      } else {
        break
      }
    }
    return node
  }

  const factor = (): ASTNode => {
    let node = power()
    while (current < tokens.length) {
      let token = tokens[current]
      if (token.type === 'FACTORIAL') {
        current++
        node = {
          type: 'UnaryExpression',
          operator: '!',
          argument: node
        }
        steps.push(`Factor: Created factorial expression`)
      } else {
        break
      }
    }
    return node
  }

  const power = (): ASTNode => {
    let node = primary()
    while (current < tokens.length) {
      let token = tokens[current]
      if (token.type === 'OPERATOR' && token.value === '^') {
        current++
        node = {
          type: 'BinaryExpression',
          operator: '^',
          left: node,
          right: primary()
        }
        steps.push(`Power: Created power expression`)
      } else {
        break
      }
    }
    return node
  }

  const primary = (): ASTNode => {
    let token = tokens[current]
    if (token.type === 'NUMBER') {
      current++
      steps.push(`Primary: Found number literal '${token.value}'`)
      return { type: 'NumberLiteral', value: token.value }
    } else if (token.type === 'OPERATOR' && token.value === '(') {
      current++
      steps.push(`Primary: Found opening parenthesis, starting subexpression`)
      let node = expression()
      if (tokens[current].type !== 'OPERATOR' || tokens[current].value !== ')') {
        throw new Error('Unmatched parenthesis')
      }
      current++
      steps.push(`Primary: Found closing parenthesis, ending subexpression`)
      return node
    } else if (token.type === 'FUNCTION') {
      current++
      if (tokens[current].type !== 'OPERATOR' || tokens[current].value !== '(') {
        throw new Error('Function must be followed by parenthesis')
      }
      current++
      steps.push(`Primary: Found function '${token.value}', parsing argument`)
      let arg = expression()
      if (tokens[current].type !== 'OPERATOR' || tokens[current].value !== ')') {
        throw new Error('Unmatched parenthesis in function call')
      }
      current++
      steps.push(`Primary: Completed function '${token.value}' call`)
      return { type: 'FunctionCall', name: token.value, argument: arg }
    }
    throw new Error(`Unexpected token: ${JSON.stringify(token)}`)
  }

  const astToTreeNode = (ast: ASTNode): TreeNode => {
    if (ast.type === 'NumberLiteral') {
      return { name: ast.value }
    } else if (ast.type === 'BinaryExpression') {
      return {
        name: ast.operator,
        children: [
          astToTreeNode(ast.left),
          astToTreeNode(ast.right)
        ]
      }
    } else if (ast.type === 'UnaryExpression') {
      return {
        name: ast.operator,
        children: [astToTreeNode(ast.argument)]
      }
    } else if (ast.type === 'FunctionCall') {
      return {
        name: ast.name,
        children: [astToTreeNode(ast.argument)]
      }
    }
    return { name: 'Unknown' }
  }

  try {
    const ast = expression()
    steps.push(`Analysis complete: Expression is valid`)
    if (current !== tokens.length) {
      throw new Error('Unexpected tokens at end of input')
    }
    return { valid: true, steps, ast: astToTreeNode(ast) }
  } catch (error) {
    if (error instanceof Error) {
      steps.push(`Error: ${error.message}`)
    } else {
      steps.push('An unknown error occurred')
    }
    return { valid: false, steps, ast: { name: 'Error' } }
  }
}

export default SyntaxAnalyzer

