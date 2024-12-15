export interface Token {
    type: string;
    value: string;
  }
  
  const LexicalAnalyzer = (input: string): Token[] => {
    const tokens: Token[] = []
    let current = 0
  
    while (current < input.length) {
      let char = input[current]
  
      if (/\s/.test(char)) {
        current++
        continue
      }
  
      if (/\d/.test(char)) {
        let value = ''
        while (/\d/.test(char)) {
          value += char
          char = input[++current]
        }
        tokens.push({ type: 'NUMBER', value })
        continue
      }
  
      if (/[+\-*/^()]/.test(char)) {
        tokens.push({ type: 'OPERATOR', value: char })
        current++
        continue
      }
  
      if (/[a-z]/.test(char)) {
        let value = ''
        while (/[a-z]/.test(char)) {
          value += char
          char = input[++current]
        }
        if (['sin', 'cos'].includes(value)) {
          tokens.push({ type: 'FUNCTION', value })
        } else {
          throw new Error(`Unexpected identifier: ${value}`)
        }
        continue
      }
  
      if (char === '!') {
        tokens.push({ type: 'FACTORIAL', value: char })
        current++
        continue
      }
  
      throw new Error(`Unexpected character: ${char}`)
    }
  
    return tokens
  }
  
  export default LexicalAnalyzer
  
  