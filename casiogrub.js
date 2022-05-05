var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var CNode = /** @class */ (function () {
    function CNode() {
    }
    return CNode;
}());
var CNumber = /** @class */ (function (_super) {
    __extends(CNumber, _super);
    function CNumber(val) {
        var _this = _super.call(this) || this;
        _this.val = val;
        return _this;
    }
    CNumber.prototype.eval = function () {
        return this.val;
    };
    return CNumber;
}(CNode));
var COp = /** @class */ (function (_super) {
    __extends(COp, _super);
    function COp(left, right) {
        var _this = _super.call(this) || this;
        _this.left = left;
        _this.right = right;
        return _this;
    }
    return COp;
}(CNode));
var CPlusOp = /** @class */ (function (_super) {
    __extends(CPlusOp, _super);
    function CPlusOp() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CPlusOp.prototype.eval = function () {
        return this.left.eval() + this.right.eval();
    };
    return CPlusOp;
}(COp));
var CSubOp = /** @class */ (function (_super) {
    __extends(CSubOp, _super);
    function CSubOp() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CSubOp.prototype.eval = function () {
        return this.left.eval() - this.right.eval();
    };
    return CSubOp;
}(COp));
var CMulOp = /** @class */ (function (_super) {
    __extends(CMulOp, _super);
    function CMulOp() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CMulOp.prototype.eval = function () {
        return this.left.eval() * this.right.eval();
    };
    return CMulOp;
}(COp));
var CDivOp = /** @class */ (function (_super) {
    __extends(CDivOp, _super);
    function CDivOp() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CDivOp.prototype.eval = function () {
        return Math.floor(this.left.eval() / this.right.eval());
    };
    return CDivOp;
}(COp));
var CModOp = /** @class */ (function (_super) {
    __extends(CModOp, _super);
    function CModOp() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CModOp.prototype.eval = function () {
        return this.left.eval() % this.right.eval();
    };
    return CModOp;
}(COp));
function evalInput(input) {
    return inputToAST(input).eval();
}
function inputToAST(input) {
    return inputToASTRec(input.split(" ").join(""));
}
function inputToASTRec(input) {
    var parenthesisCount = 0;
    var foundParenthesis = false;
    // Make sure there is the right amount of parenthesis
    for (var i = 0; i < input.length; i++) {
        if (input[i] === "(") {
            parenthesisCount++;
            foundParenthesis = true;
        }
        else if (input[i] === ")") {
            parenthesisCount--;
            foundParenthesis = true;
        }
        if (parenthesisCount < 0)
            throw new Error("casiogrub: incorrect amount of parenthesis (unexpected close)");
    }
    if (parenthesisCount > 0)
        throw new Error("casiogrub: incorrect amount of parenthesis (forgot to close)");
    parenthesisCount = 0;
    // First check for precedence 6 operators
    for (var i = input.length; i >= 0; i--) {
        if (input[i] === ")") {
            parenthesisCount++;
        }
        else if (input[i] === "(") {
            parenthesisCount--;
        }
        else if (parenthesisCount === 0) {
            var left = input.substring(0, i);
            var right = input.substring(i + 1, input.length);
            if (input[i] === "+") {
                if (right === "")
                    throw new Error("casiogrub: missing right operand for '+'");
                return new CPlusOp(inputToASTRec(left), inputToASTRec(right));
            }
            else if (input[i] === "-") {
                if (right === "")
                    throw new Error("casiogrub: missing right operand for '-'");
                return new CSubOp(inputToASTRec(left), inputToASTRec(right));
            }
        }
    }
    parenthesisCount = 0;
    // Then check for precedence 5 operators
    for (var i = input.length; i >= 0; i--) {
        if (input[i] === ")") {
            parenthesisCount++;
        }
        else if (input[i] === "(") {
            parenthesisCount--;
        }
        else if (parenthesisCount === 0) {
            var left = input.substring(0, i);
            var right = input.substring(i + 1, input.length);
            if (input[i] === "*" || input[i] === "x") {
                if (right === "")
                    throw new Error("casiogrub: missing right operand for '".concat(input[i], "'"));
                return new CMulOp(inputToASTRec(left), inputToASTRec(right));
            }
            else if (input[i] === "/") {
                if (right === "")
                    throw new Error("casiogrub: missing right operand for '/'");
                return new CDivOp(inputToASTRec(left), inputToASTRec(right));
            }
            else if (input[i] === "%") {
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
    var parsed = parseInt(input, 10);
    if (isNaN(parsed))
        throw new Error("casiogrub: ".concat(input, " is not a number"));
    return new CNumber(parsed);
}
module.exports = { evalInput: evalInput };
/* const myArgs = process.argv.slice(2);

if (myArgs.length !== 1) throw new Error("Too many arguments!");

const ast = inputToAST(myArgs[0]);

console.log(ast);
console.log("Res: " + ast.eval()); */
