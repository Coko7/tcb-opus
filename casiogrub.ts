abstract class CNode {
  abstract eval(): number;
}

class CNumber extends CNode {
  val: number;

  constructor(val: number) {
    super();
    this.val = val;
  }

  eval(): number {
    return this.val;
  }
}

abstract class COp extends CNode {
  left: CNode;
  right: CNode;

  constructor(left: CNode, right: CNode) {
    super();
    this.left = left;
    this.right = right;
  }
}

class CPlusOp extends COp {
  eval(): number {
    return this.left.eval() + this.right.eval();
  }
}

class CSubOp extends COp {
  eval(): number {
    return this.left.eval() - this.right.eval();
  }
}

class CMulOp extends COp {
  eval(): number {
    return this.left.eval() * this.right.eval();
  }
}

class CDivOp extends COp {
  eval(): number {
    return Math.floor(this.left.eval() / this.right.eval());
  }
}

class CModOp extends COp {
  eval(): number {
    return this.left.eval() % this.right.eval();
  }
}

function evalInput(input: string): number {
  return inputToAST(input).eval();
}

function inputToAST(input: string): CNode {
  return inputToASTRec(input.split(" ").join(""));
}

function inputToASTRec(input: string): CNode {
  let parenthesisCount = 0;
  let foundParenthesis = false;

  // Make sure there is the right amount of parenthesis
  for (let i = 0; i < input.length; i++) {
    if (input[i] === "(") {
      parenthesisCount++;
      foundParenthesis = true;
    } else if (input[i] === ")") {
      parenthesisCount--;
      foundParenthesis = true;
    }

    if (parenthesisCount < 0)
      throw new Error(
        "casiogrub: incorrect amount of parenthesis (unexpected close)"
      );
  }

  if (parenthesisCount > 0)
    throw new Error(
      "casiogrub: incorrect amount of parenthesis (forgot to close)"
    );

  parenthesisCount = 0;

  // First check for precedence 6 operators
  for (let i = input.length; i >= 0; i--) {
    if (input[i] === ")") {
      parenthesisCount++;
    } else if (input[i] === "(") {
      parenthesisCount--;
    } else if (parenthesisCount === 0) {
      const left = input.substring(0, i);
      const right = input.substring(i + 1, input.length);

      if (input[i] === "+") {
        if (right === "")
          throw new Error("casiogrub: missing right operand for '+'");
        return new CPlusOp(inputToASTRec(left), inputToASTRec(right));
      } else if (input[i] === "-") {
        if (right === "")
          throw new Error("casiogrub: missing right operand for '-'");
        return new CSubOp(inputToASTRec(left), inputToASTRec(right));
      }
    }
  }

  parenthesisCount = 0;

  // Then check for precedence 5 operators
  for (let i = input.length; i >= 0; i--) {
    if (input[i] === ")") {
      parenthesisCount++;
    } else if (input[i] === "(") {
      parenthesisCount--;
    } else if (parenthesisCount === 0) {
      const left = input.substring(0, i);
      const right = input.substring(i + 1, input.length);

      if (input[i] === "*" || input[i] === "x") {
        if (right === "")
          throw new Error(`casiogrub: missing right operand for '${input[i]}'`);
        return new CMulOp(inputToASTRec(left), inputToASTRec(right));
      } else if (input[i] === "/") {
        if (right === "")
          throw new Error("casiogrub: missing right operand for '/'");
        return new CDivOp(inputToASTRec(left), inputToASTRec(right));
      } else if (input[i] === "%") {
        if (right === "")
          throw new Error("casiogrub: missing right operand for '%'");
        return new CModOp(inputToASTRec(left), inputToASTRec(right));
      }
    }
  }

  // If we manage to arrive here and there are parenthesis in the expression then that means they can be removed.
  // If so, we remove them and recursively call the function.
  if (foundParenthesis) {
    input = input.substring(1, input.length - 1);
    return inputToASTRec(input);
  }

  if (input === "") {
    return new CNumber(0);
  }

  const parsed = parseInt(input, 10);
  if (isNaN(parsed)) throw new Error(`casiogrub: ${input} is not a number`);

  return new CNumber(parsed);
}

module.exports = { evalInput };

/* const myArgs = process.argv.slice(2);

if (myArgs.length !== 1) throw new Error("Too many arguments!");

const ast = inputToAST(myArgs[0]);

console.log(ast);
console.log("Res: " + ast.eval()); */
