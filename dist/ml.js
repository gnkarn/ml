(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["ML"] = factory();
	else
		root["ML"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 169);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(3).Matrix;
module.exports.Decompositions = module.exports.DC = __webpack_require__(138);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function squaredEuclidean(p, q) {
    var d = 0;
    for (var i = 0; i < p.length; i++) {
        d += (p[i] - q[i]) * (p[i] - q[i]);
    }
    return d;
}

function euclidean(p, q) {
    return Math.sqrt(squaredEuclidean(p, q));
}

module.exports = euclidean;
euclidean.squared = squaredEuclidean;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.array = __webpack_require__(14);
exports.matrix = __webpack_require__(160);


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(139);
var abstractMatrix = __webpack_require__(37);
var util = __webpack_require__(7);

class Matrix extends abstractMatrix(Array) {
    constructor(nRows, nColumns) {
        var i;
        if (arguments.length === 1 && typeof nRows === 'number') {
            return new Array(nRows);
        }
        if (Matrix.isMatrix(nRows)) {
            return nRows.clone();
        } else if (Number.isInteger(nRows) && nRows > 0) { // Create an empty matrix
            super(nRows);
            if (Number.isInteger(nColumns) && nColumns > 0) {
                for (i = 0; i < nRows; i++) {
                    this[i] = new Array(nColumns);
                }
            } else {
                throw new TypeError('nColumns must be a positive integer');
            }
        } else if (Array.isArray(nRows)) { // Copy the values from the 2D array
            const matrix = nRows;
            nRows = matrix.length;
            nColumns = matrix[0].length;
            if (typeof nColumns !== 'number' || nColumns === 0) {
                throw new TypeError('Data must be a 2D array with at least one element');
            }
            super(nRows);
            for (i = 0; i < nRows; i++) {
                if (matrix[i].length !== nColumns) {
                    throw new RangeError('Inconsistent array dimensions');
                }
                this[i] = [].concat(matrix[i]);
            }
        } else {
            throw new TypeError('First argument must be a positive number or an array');
        }
        this.rows = nRows;
        this.columns = nColumns;
        return this;
    }

    set(rowIndex, columnIndex, value) {
        this[rowIndex][columnIndex] = value;
        return this;
    }

    get(rowIndex, columnIndex) {
        return this[rowIndex][columnIndex];
    }

    /**
     * Creates an exact and independent copy of the matrix
     * @return {Matrix}
     */
    clone() {
        var newMatrix = new this.constructor[Symbol.species](this.rows, this.columns);
        for (var row = 0; row < this.rows; row++) {
            for (var column = 0; column < this.columns; column++) {
                newMatrix.set(row, column, this.get(row, column));
            }
        }
        return newMatrix;
    }

    /**
     * Removes a row from the given index
     * @param {number} index - Row index
     * @return {Matrix} this
     */
    removeRow(index) {
        util.checkRowIndex(this, index);
        if (this.rows === 1) {
            throw new RangeError('A matrix cannot have less than one row');
        }
        this.splice(index, 1);
        this.rows -= 1;
        return this;
    }

    /**
     * Adds a row at the given index
     * @param {number} [index = this.rows] - Row index
     * @param {Array|Matrix} array - Array or vector
     * @return {Matrix} this
     */
    addRow(index, array) {
        if (array === undefined) {
            array = index;
            index = this.rows;
        }
        util.checkRowIndex(this, index, true);
        array = util.checkRowVector(this, array, true);
        this.splice(index, 0, array);
        this.rows += 1;
        return this;
    }

    /**
     * Removes a column from the given index
     * @param {number} index - Column index
     * @return {Matrix} this
     */
    removeColumn(index) {
        util.checkColumnIndex(this, index);
        if (this.columns === 1) {
            throw new RangeError('A matrix cannot have less than one column');
        }
        for (var i = 0; i < this.rows; i++) {
            this[i].splice(index, 1);
        }
        this.columns -= 1;
        return this;
    }

    /**
     * Adds a column at the given index
     * @param {number} [index = this.columns] - Column index
     * @param {Array|Matrix} array - Array or vector
     * @return {Matrix} this
     */
    addColumn(index, array) {
        if (typeof array === 'undefined') {
            array = index;
            index = this.columns;
        }
        util.checkColumnIndex(this, index, true);
        array = util.checkColumnVector(this, array);
        for (var i = 0; i < this.rows; i++) {
            this[i].splice(index, 0, array[i]);
        }
        this.columns += 1;
        return this;
    }
}

exports.Matrix = Matrix;
Matrix.abstractMatrix = abstractMatrix;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


class BaseRegression {
    predict(x) {
        var y2;
        if (Array.isArray(x)) {
            y2 = new Array(x.length);
            for (var i = 0; i < x.length; i++) {
                y2[i] = this._predict(x[i]);
            }
        } else if (Number.isFinite(x)) {
            y2 = this._predict(x);
        } else {
            throw new TypeError('x must be a number or array');
        }
        return y2;
    }

    _predict() {
        throw new Error('_compute not implemented');
    }

    train() {
        //Do nothing for this package
    }

    toString() {
        return '';
    }

    toLaTeX() {
        return '';
    }

    /**
     * Return the correlation coefficient of determination (r) and chi-square.
     * @param {Array<number>} x
     * @param {Array<number>} y
     * @return {object}
     */
    modelQuality(x, y) {
        let n = x.length;
        var y2 = new Array(n);
        for (let i = 0; i < n; i++) {
            y2[i] = this._predict(x[i]);
        }
        var xSum = 0;
        var ySum = 0;
        var chi2 = 0;
        var rmsd = 0;
        var xSquared = 0;
        var ySquared = 0;
        var xY = 0;

        for (let i = 0; i < n; i++) {
            xSum += y2[i];
            ySum += y[i];
            xSquared += y2[i] * y2[i];
            ySquared += y[i] * y[i];
            xY += y2[i] * y[i];
            if (y[i] !== 0) {
                chi2 += (y[i] - y2[i]) * (y[i] - y2[i]) / y[i];
            }
            rmsd = (y[i] - y2[i]) * (y[i] - y2[i]);
        }

        var r = (n * xY - xSum * ySum) / Math.sqrt((n * xSquared - xSum * xSum) * (n * ySquared - ySum * ySum));

        return {
            r: r,
            r2: r * r,
            chi2: chi2,
            rmsd: rmsd * rmsd / n
        };
    }

}

module.exports = BaseRegression;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var abstractMatrix = __webpack_require__(37);
var Matrix = __webpack_require__(3);

class BaseView extends abstractMatrix() {
    constructor(matrix, rows, columns) {
        super();
        this.matrix = matrix;
        this.rows = rows;
        this.columns = columns;
    }

    static get [Symbol.species]() {
        return Matrix.Matrix;
    }
}

module.exports = BaseView;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.maybeToPrecision = function maybeToPrecision(value, digits) {
    if (value < 0) {
        value = -1 * value;
        if (digits) {
            return '- ' + value.toPrecision(digits);
        } else {
            return '- ' + value.toString();
        }
    } else {
        if (digits) {
            return value.toPrecision(digits);
        } else {
            return value.toString();
        }
    }
};


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Matrix = __webpack_require__(3);

/**
 * @private
 * Check that a row index is not out of bounds
 * @param {Matrix} matrix
 * @param {number} index
 * @param {boolean} [outer]
 */
exports.checkRowIndex = function checkRowIndex(matrix, index, outer) {
    var max = outer ? matrix.rows : matrix.rows - 1;
    if (index < 0 || index > max) {
        throw new RangeError('Row index out of range');
    }
};

/**
 * @private
 * Check that a column index is not out of bounds
 * @param {Matrix} matrix
 * @param {number} index
 * @param {boolean} [outer]
 */
exports.checkColumnIndex = function checkColumnIndex(matrix, index, outer) {
    var max = outer ? matrix.columns : matrix.columns - 1;
    if (index < 0 || index > max) {
        throw new RangeError('Column index out of range');
    }
};

/**
 * @private
 * Check that the provided vector is an array with the right length
 * @param {Matrix} matrix
 * @param {Array|Matrix} vector
 * @return {Array}
 * @throws {RangeError}
 */
exports.checkRowVector = function checkRowVector(matrix, vector) {
    if (vector.to1DArray) {
        vector = vector.to1DArray();
    }
    if (vector.length !== matrix.columns) {
        throw new RangeError('vector size must be the same as the number of columns');
    }
    return vector;
};

/**
 * @private
 * Check that the provided vector is an array with the right length
 * @param {Matrix} matrix
 * @param {Array|Matrix} vector
 * @return {Array}
 * @throws {RangeError}
 */
exports.checkColumnVector = function checkColumnVector(matrix, vector) {
    if (vector.to1DArray) {
        vector = vector.to1DArray();
    }
    if (vector.length !== matrix.rows) {
        throw new RangeError('vector size must be the same as the number of rows');
    }
    return vector;
};

exports.checkIndices = function checkIndices(matrix, rowIndices, columnIndices) {
    var rowOut = rowIndices.some(r => {
        return r < 0 || r >= matrix.rows;

    });

    var columnOut = columnIndices.some(c => {
        return c < 0 || c >= matrix.columns;
    });

    if (rowOut || columnOut) {
        throw new RangeError('Indices are out of range');
    }

    if (typeof rowIndices !== 'object' || typeof columnIndices !== 'object') {
        throw new TypeError('Unexpected type for row/column indices');
    }
    if (!Array.isArray(rowIndices)) rowIndices = Array.from(rowIndices);
    if (!Array.isArray(columnIndices)) rowIndices = Array.from(columnIndices);

    return {
        row: rowIndices,
        column: columnIndices
    };
};

exports.checkRange = function checkRange(matrix, startRow, endRow, startColumn, endColumn) {
    if (arguments.length !== 5) throw new TypeError('Invalid argument type');
    var notAllNumbers = Array.from(arguments).slice(1).some(function (arg) {
        return typeof arg !== 'number';
    });
    if (notAllNumbers) throw new TypeError('Invalid argument type');
    if (startRow > endRow || startColumn > endColumn || startRow < 0 || startRow >= matrix.rows || endRow < 0 || endRow >= matrix.rows || startColumn < 0 || startColumn >= matrix.columns || endColumn < 0 || endColumn >= matrix.columns) {
        throw new RangeError('Submatrix indices are out of range');
    }
};

exports.getRange = function getRange(from, to) {
    var arr = new Array(to - from + 1);
    for (var i = 0; i < arr.length; i++) {
        arr[i] = from + i;
    }
    return arr;
};

exports.sumByRow = function sumByRow(matrix) {
    var sum = Matrix.Matrix.zeros(matrix.rows, 1);
    for (var i = 0; i < matrix.rows; ++i) {
        for (var j = 0; j < matrix.columns; ++j) {
            sum.set(i, 0, sum.get(i, 0) + matrix.get(i, j));
        }
    }
    return sum;
};

exports.sumByColumn = function sumByColumn(matrix) {
    var sum = Matrix.Matrix.zeros(1, matrix.columns);
    for (var i = 0; i < matrix.rows; ++i) {
        for (var j = 0; j < matrix.columns; ++j) {
            sum.set(0, j, sum.get(0, j) + matrix.get(i, j));
        }
    }
    return sum;
};

exports.sumAll = function sumAll(matrix) {
    var v = 0;
    for (var i = 0; i < matrix.rows; i++) {
        for (var j = 0; j < matrix.columns; j++) {
            v += matrix.get(i, j);
        }
    }
    return v;
};


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const Matrix = __webpack_require__(0);

const GaussianKernel = __webpack_require__(120);
const PolynomialKernel = __webpack_require__(121);
const ANOVAKernel = __webpack_require__(123);
const CauchyKernel = __webpack_require__(124);
const ExponentialKernel = __webpack_require__(125);
const HistogramKernel = __webpack_require__(126);
const LaplacianKernel = __webpack_require__(127);
const MultiquadraticKernel = __webpack_require__(128);
const RationalKernel = __webpack_require__(129);
const SigmoidKernel = __webpack_require__(122);

const kernelType = {
    gaussian: GaussianKernel,
    rbf: GaussianKernel,
    polynomial: PolynomialKernel,
    poly: PolynomialKernel,
    anova: ANOVAKernel,
    cauchy: CauchyKernel,
    exponential: ExponentialKernel,
    histogram: HistogramKernel,
    min: HistogramKernel,
    laplacian: LaplacianKernel,
    multiquadratic: MultiquadraticKernel,
    rational: RationalKernel,
    sigmoid: SigmoidKernel,
    mlp: SigmoidKernel
};

class Kernel {
    constructor(type, options) {
        this.kernelType = type;
        if (type === 'linear') return;

        if (typeof type === 'string') {
            type = type.toLowerCase();

            var KernelConstructor = kernelType[type];
            if (KernelConstructor) {
                this.kernelFunction = new KernelConstructor(options);
            } else {
                throw new Error('unsupported kernel type: ' + type);
            }
        } else if (typeof type === 'object' && typeof type.compute === 'function') {
            this.kernelFunction = type;
        } else {
            throw new TypeError('first argument must be a valid kernel type or instance');
        }
    }

    compute(inputs, landmarks) {
        if (landmarks === undefined) {
            landmarks = inputs;
        }

        if (this.kernelType === 'linear') {
            var matrix = new Matrix(inputs);
            return matrix.mmul(new Matrix(landmarks).transpose());
        }

        const kernelMatrix = new Matrix(inputs.length, landmarks.length);
        var i, j;
        if (inputs === landmarks) { // fast path, matrix is symmetric
            for (i = 0; i < inputs.length; i++) {
                for (j = i; j < inputs.length; j++) {
                    kernelMatrix[i][j] = kernelMatrix[j][i] = this.kernelFunction.compute(inputs[i], inputs[j]);
                }
            }
        } else {
            for (i = 0; i < inputs.length; i++) {
                for (j = 0; j < landmarks.length; j++) {
                    kernelMatrix[i][j] = this.kernelFunction.compute(inputs[i], landmarks[j]);
                }
            }
        }
        return kernelMatrix;
    }
}

module.exports = Kernel;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var hasOwn = Object.prototype.hasOwnProperty;
var toStr = Object.prototype.toString;

var isArray = function isArray(arr) {
	if (typeof Array.isArray === 'function') {
		return Array.isArray(arr);
	}

	return toStr.call(arr) === '[object Array]';
};

var isPlainObject = function isPlainObject(obj) {
	if (!obj || toStr.call(obj) !== '[object Object]') {
		return false;
	}

	var hasOwnConstructor = hasOwn.call(obj, 'constructor');
	var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
	// Not own constructor property must be Object
	if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
		return false;
	}

	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.
	var key;
	for (key in obj) {/**/}

	return typeof key === 'undefined' || hasOwn.call(obj, key);
};

module.exports = function extend() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0],
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if (typeof target === 'boolean') {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	} else if ((typeof target !== 'object' && typeof target !== 'function') || target == null) {
		target = {};
	}

	for (; i < length; ++i) {
		options = arguments[i];
		// Only deal with non-null/undefined values
		if (options != null) {
			// Extend the base object
			for (name in options) {
				src = target[name];
				copy = options[name];

				// Prevent never-ending loop
				if (target !== copy) {
					// Recurse if we're merging plain objects or arrays
					if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
						if (copyIsArray) {
							copyIsArray = false;
							clone = src && isArray(src) ? src : [];
						} else {
							clone = src && isPlainObject(src) ? src : {};
						}

						// Never move original objects, clone them
						target[name] = extend(deep, clone, copy);

					// Don't bring in undefined values
					} else if (typeof copy !== 'undefined') {
						target[name] = copy;
					}
				}
			}
		}
	}

	// Return the modified object
	return target;
};



/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const Heap = __webpack_require__(63);

function Cluster () {
    this.children = [];
    this.distance = -1;
    this.index = [];
}

/**
 * Creates an array of values where maximum distance smaller than the threshold
 * @param {number} threshold
 * @return {Array <Cluster>}
 */
Cluster.prototype.cut = function (threshold) {
    if (threshold < 0) throw new RangeError('Threshold too small');
    var root = new Cluster();
    root.children = this.children;
    root.distance = this.distance;
    root.index = this.index;
    var list = [root];
    var ans = [];
    while (list.length > 0) {
        var aux = list.shift();
        if (threshold >= aux.distance)
            ans.push(aux);
        else
            list = list.concat(aux.children);
    }
    return ans;
};

/**
 * Merge the leaves in the minimum way to have 'minGroups' number of clusters
 * @param {number} minGroups
 * @return {Cluster}
 */
Cluster.prototype.group = function (minGroups) {
    if (!Number.isInteger(minGroups) || minGroups < 1) throw new RangeError('Number of groups must be a positive integer');

    const heap = new Heap(function (a, b) {
        return b.distance - a.distance;
    });

    heap.push(this);

    while (heap.size() < minGroups) {
        var first = heap.pop();
        if (first.children.length === 0) {
            break;
        }
        first.children.forEach(child => heap.push(child));
    }

    var root = new Cluster();
    root.children = heap.toArray();
    root.distance = this.distance;

    return root;
};

module.exports = Cluster;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.hypotenuse = function hypotenuse(a, b) {
    var r;
    if (Math.abs(a) > Math.abs(b)) {
        r = b / a;
        return Math.abs(a) * Math.sqrt(1 + r * r);
    }
    if (b !== 0) {
        r = a / b;
        return Math.abs(b) * Math.sqrt(1 + r * r);
    }
    return 0;
};

// For use in the decomposition algorithms. With big matrices, access time is
// too long on elements from array subclass
// todo check when it is fixed in v8
// http://jsperf.com/access-and-write-array-subclass
exports.getEmpty2DArray = function (rows, columns) {
    var array = new Array(rows);
    for (var i = 0; i < rows; i++) {
        array[i] = new Array(columns);
    }
    return array;
};

exports.getFilled2DArray = function (rows, columns, value) {
    var array = new Array(rows);
    for (var i = 0; i < rows; i++) {
        array[i] = new Array(columns);
        for (var j = 0; j < columns; j++) {
            array[i][j] = value;
        }
    }
    return array;
};


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const Matrix = __webpack_require__(0);
const Stat = __webpack_require__(2);

/**
 * Function that given vector, returns his norm
 * @param {Vector} X
 * @returns {number} Norm of the vector
 */
function norm(X) {
    return Math.sqrt(X.clone().apply(pow2array).sum());
}

/**
 * Function that pow 2 each element of a Matrix or a Vector,
 * used in the apply method of the Matrix object
 * @param i - index i.
 * @param j - index j.
 * @return The Matrix object modified at the index i, j.
 * */
function pow2array(i, j) {
    this[i][j] = this[i][j] * this[i][j];
    return this;
}

/**
 * Function that normalize the dataset and return the means and
 * standard deviation of each feature.
 * @param dataset
 * @returns {{result: Matrix, means: (*|number), std: Matrix}} dataset normalized, means
 *                                                             and standard deviations
 */
function featureNormalize(dataset) {
    var means = Stat.matrix.mean(dataset);
    var std = Stat.matrix.standardDeviation(dataset, means, true);
    var result = Matrix.checkMatrix(dataset).subRowVector(means);
    return {result: result.divRowVector(std), means: means, std: std};
}

module.exports = {
    norm: norm,
    pow2array: pow2array,
    featureNormalize: featureNormalize
};


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var maybeToPrecision = __webpack_require__(6).maybeToPrecision;
const BaseRegression = __webpack_require__(4);


class SimpleLinearRegression extends BaseRegression {

    constructor(x, y, options) {
        options = options || {};
        super();
        if (x === true) {
            this.slope = y.slope;
            this.intercept = y.intercept;
            this.quality = y.quality || {};
            if (y.quality.r) {
                this.quality.r = y.quality.r;
                this.quality.r2 = y.quality.r2;
            }
            if (y.quality.chi2) {
                this.quality.chi2 = y.quality.chi2;
            }
        } else {
            var n = x.length;
            if (n !== y.length) {
                throw new RangeError('input and output array have a different length');
            }

            var xSum = 0;
            var ySum = 0;

            var xSquared = 0;
            var xY = 0;

            for (var i = 0; i < n; i++) {
                xSum += x[i];
                ySum += y[i];
                xSquared += x[i] * x[i];
                xY += x[i] * y[i];
            }

            var numerator = (n * xY - xSum * ySum);


            this.slope = numerator / (n * xSquared - xSum * xSum);
            this.intercept = (1 / n) * ySum - this.slope * (1 / n) * xSum;
            this.coefficients = [this.intercept, this.slope];
            if (options.computeQuality) {
                this.quality = this.modelQuality(x, y);
            }
        }

    }

    toJSON() {
        var out = {
            name: 'simpleLinearRegression',
            slope: this.slope,
            intercept: this.intercept
        };
        if (this.quality) {
            out.quality = this.quality;
        }

        return out;
    }

    _predict(input) {
        return this.slope * input + this.intercept;
    }

    computeX(input) {
        return (input - this.intercept) / this.slope;
    }

    toString(precision) {
        var result = 'f(x) = ';
        if (this.slope) {
            var xFactor = maybeToPrecision(this.slope, precision);
            result += (Math.abs(xFactor - 1) < 1e-5 ? '' : xFactor + ' * ') + 'x';
            if (this.intercept) {
                var absIntercept = Math.abs(this.intercept);
                var operator = absIntercept === this.intercept ? '+' : '-';
                result += ' ' + operator + ' ' + maybeToPrecision(absIntercept, precision);
            }
        } else {
            result += maybeToPrecision(this.intercept, precision);
        }
        return result;
    }

    toLaTeX(precision) {
        return this.toString(precision);
    }

    static load(json) {
        if (json.name !== 'simpleLinearRegression') {
            throw new TypeError('not a SLR model');
        }
        return new SimpleLinearRegression(true, json);
    }
}

module.exports = SimpleLinearRegression;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function compareNumbers(a, b) {
    return a - b;
}

/**
 * Computes the sum of the given values
 * @param {Array} values
 * @returns {number}
 */
exports.sum = function sum(values) {
    var sum = 0;
    for (var i = 0; i < values.length; i++) {
        sum += values[i];
    }
    return sum;
};

/**
 * Computes the maximum of the given values
 * @param {Array} values
 * @returns {number}
 */
exports.max = function max(values) {
    var max = values[0];
    var l = values.length;
    for (var i = 1; i < l; i++) {
        if (values[i] > max) max = values[i];
    }
    return max;
};

/**
 * Computes the minimum of the given values
 * @param {Array} values
 * @returns {number}
 */
exports.min = function min(values) {
    var min = values[0];
    var l = values.length;
    for (var i = 1; i < l; i++) {
        if (values[i] < min) min = values[i];
    }
    return min;
};

/**
 * Computes the min and max of the given values
 * @param {Array} values
 * @returns {{min: number, max: number}}
 */
exports.minMax = function minMax(values) {
    var min = values[0];
    var max = values[0];
    var l = values.length;
    for (var i = 1; i < l; i++) {
        if (values[i] < min) min = values[i];
        if (values[i] > max) max = values[i];
    }
    return {
        min: min,
        max: max
    };
};

/**
 * Computes the arithmetic mean of the given values
 * @param {Array} values
 * @returns {number}
 */
exports.arithmeticMean = function arithmeticMean(values) {
    var sum = 0;
    var l = values.length;
    for (var i = 0; i < l; i++) {
        sum += values[i];
    }
    return sum / l;
};

/**
 * {@link arithmeticMean}
 */
exports.mean = exports.arithmeticMean;

/**
 * Computes the geometric mean of the given values
 * @param {Array} values
 * @returns {number}
 */
exports.geometricMean = function geometricMean(values) {
    var mul = 1;
    var l = values.length;
    for (var i = 0; i < l; i++) {
        mul *= values[i];
    }
    return Math.pow(mul, 1 / l);
};

/**
 * Computes the mean of the log of the given values
 * If the return value is exponentiated, it gives the same result as the
 * geometric mean.
 * @param {Array} values
 * @returns {number}
 */
exports.logMean = function logMean(values) {
    var lnsum = 0;
    var l = values.length;
    for (var i = 0; i < l; i++) {
        lnsum += Math.log(values[i]);
    }
    return lnsum / l;
};

/**
 * Computes the weighted grand mean for a list of means and sample sizes
 * @param {Array} means - Mean values for each set of samples
 * @param {Array} samples - Number of original values for each set of samples
 * @returns {number}
 */
exports.grandMean = function grandMean(means, samples) {
    var sum = 0;
    var n = 0;
    var l = means.length;
    for (var i = 0; i < l; i++) {
        sum += samples[i] * means[i];
        n += samples[i];
    }
    return sum / n;
};

/**
 * Computes the truncated mean of the given values using a given percentage
 * @param {Array} values
 * @param {number} percent - The percentage of values to keep (range: [0,1])
 * @param {boolean} [alreadySorted=false]
 * @returns {number}
 */
exports.truncatedMean = function truncatedMean(values, percent, alreadySorted) {
    if (alreadySorted === undefined) alreadySorted = false;
    if (!alreadySorted) {
        values = [].concat(values).sort(compareNumbers);
    }
    var l = values.length;
    var k = Math.floor(l * percent);
    var sum = 0;
    for (var i = k; i < (l - k); i++) {
        sum += values[i];
    }
    return sum / (l - 2 * k);
};

/**
 * Computes the harmonic mean of the given values
 * @param {Array} values
 * @returns {number}
 */
exports.harmonicMean = function harmonicMean(values) {
    var sum = 0;
    var l = values.length;
    for (var i = 0; i < l; i++) {
        if (values[i] === 0) {
            throw new RangeError('value at index ' + i + 'is zero');
        }
        sum += 1 / values[i];
    }
    return l / sum;
};

/**
 * Computes the contraharmonic mean of the given values
 * @param {Array} values
 * @returns {number}
 */
exports.contraHarmonicMean = function contraHarmonicMean(values) {
    var r1 = 0;
    var r2 = 0;
    var l = values.length;
    for (var i = 0; i < l; i++) {
        r1 += values[i] * values[i];
        r2 += values[i];
    }
    if (r2 < 0) {
        throw new RangeError('sum of values is negative');
    }
    return r1 / r2;
};

/**
 * Computes the median of the given values
 * @param {Array} values
 * @param {boolean} [alreadySorted=false]
 * @returns {number}
 */
exports.median = function median(values, alreadySorted) {
    if (alreadySorted === undefined) alreadySorted = false;
    if (!alreadySorted) {
        values = [].concat(values).sort(compareNumbers);
    }
    var l = values.length;
    var half = Math.floor(l / 2);
    if (l % 2 === 0) {
        return (values[half - 1] + values[half]) * 0.5;
    } else {
        return values[half];
    }
};

/**
 * Computes the variance of the given values
 * @param {Array} values
 * @param {boolean} [unbiased=true] - if true, divide by (n-1); if false, divide by n.
 * @returns {number}
 */
exports.variance = function variance(values, unbiased) {
    if (unbiased === undefined) unbiased = true;
    var theMean = exports.mean(values);
    var theVariance = 0;
    var l = values.length;

    for (var i = 0; i < l; i++) {
        var x = values[i] - theMean;
        theVariance += x * x;
    }

    if (unbiased) {
        return theVariance / (l - 1);
    } else {
        return theVariance / l;
    }
};

/**
 * Computes the standard deviation of the given values
 * @param {Array} values
 * @param {boolean} [unbiased=true] - if true, divide by (n-1); if false, divide by n.
 * @returns {number}
 */
exports.standardDeviation = function standardDeviation(values, unbiased) {
    return Math.sqrt(exports.variance(values, unbiased));
};

exports.standardError = function standardError(values) {
    return exports.standardDeviation(values) / Math.sqrt(values.length);
};

/**
 * IEEE Transactions on biomedical engineering, vol. 52, no. 1, january 2005, p. 76-
 * Calculate the standard deviation via the Median of the absolute deviation
 *  The formula for the standard deviation only holds for Gaussian random variables.
 * @returns {{mean: number, stdev: number}}
 */
exports.robustMeanAndStdev = function robustMeanAndStdev(y) {
    var mean = 0, stdev = 0;
    var length = y.length, i = 0;
    for (i = 0; i < length; i++) {
        mean += y[i];
    }
    mean /= length;
    var averageDeviations = new Array(length);
    for (i = 0; i < length; i++)
        averageDeviations[i] = Math.abs(y[i] - mean);
    averageDeviations.sort(compareNumbers);
    if (length % 2 === 1) {
        stdev = averageDeviations[(length - 1) / 2] / 0.6745;
    } else {
        stdev = 0.5 * (averageDeviations[length / 2] + averageDeviations[length / 2 - 1]) / 0.6745;
    }

    return {
        mean: mean,
        stdev: stdev
    };
};

exports.quartiles = function quartiles(values, alreadySorted) {
    if (typeof (alreadySorted) === 'undefined') alreadySorted = false;
    if (!alreadySorted) {
        values = [].concat(values).sort(compareNumbers);
    }

    var quart = values.length / 4;
    var q1 = values[Math.ceil(quart) - 1];
    var q2 = exports.median(values, true);
    var q3 = values[Math.ceil(quart * 3) - 1];

    return {q1: q1, q2: q2, q3: q3};
};

exports.pooledStandardDeviation = function pooledStandardDeviation(samples, unbiased) {
    return Math.sqrt(exports.pooledVariance(samples, unbiased));
};

exports.pooledVariance = function pooledVariance(samples, unbiased) {
    if (typeof (unbiased) === 'undefined') unbiased = true;
    var sum = 0;
    var length = 0, l = samples.length;
    for (var i = 0; i < l; i++) {
        var values = samples[i];
        var vari = exports.variance(values);

        sum += (values.length - 1) * vari;

        if (unbiased)
            length += values.length - 1;
        else
            length += values.length;
    }
    return sum / length;
};

exports.mode = function mode(values) {
    var l = values.length,
        itemCount = new Array(l),
        i;
    for (i = 0; i < l; i++) {
        itemCount[i] = 0;
    }
    var itemArray = new Array(l);
    var count = 0;

    for (i = 0; i < l; i++) {
        var index = itemArray.indexOf(values[i]);
        if (index >= 0)
            itemCount[index]++;
        else {
            itemArray[count] = values[i];
            itemCount[count] = 1;
            count++;
        }
    }

    var maxValue = 0, maxIndex = 0;
    for (i = 0; i < count; i++) {
        if (itemCount[i] > maxValue) {
            maxValue = itemCount[i];
            maxIndex = i;
        }
    }

    return itemArray[maxIndex];
};

exports.covariance = function covariance(vector1, vector2, unbiased) {
    if (typeof (unbiased) === 'undefined') unbiased = true;
    var mean1 = exports.mean(vector1);
    var mean2 = exports.mean(vector2);

    if (vector1.length !== vector2.length)
        throw 'Vectors do not have the same dimensions';

    var cov = 0, l = vector1.length;
    for (var i = 0; i < l; i++) {
        var x = vector1[i] - mean1;
        var y = vector2[i] - mean2;
        cov += x * y;
    }

    if (unbiased)
        return cov / (l - 1);
    else
        return cov / l;
};

exports.skewness = function skewness(values, unbiased) {
    if (typeof (unbiased) === 'undefined') unbiased = true;
    var theMean = exports.mean(values);

    var s2 = 0, s3 = 0, l = values.length;
    for (var i = 0; i < l; i++) {
        var dev = values[i] - theMean;
        s2 += dev * dev;
        s3 += dev * dev * dev;
    }
    var m2 = s2 / l;
    var m3 = s3 / l;

    var g = m3 / (Math.pow(m2, 3 / 2.0));
    if (unbiased) {
        var a = Math.sqrt(l * (l - 1));
        var b = l - 2;
        return (a / b) * g;
    } else {
        return g;
    }
};

exports.kurtosis = function kurtosis(values, unbiased) {
    if (typeof (unbiased) === 'undefined') unbiased = true;
    var theMean = exports.mean(values);
    var n = values.length, s2 = 0, s4 = 0;

    for (var i = 0; i < n; i++) {
        var dev = values[i] - theMean;
        s2 += dev * dev;
        s4 += dev * dev * dev * dev;
    }
    var m2 = s2 / n;
    var m4 = s4 / n;

    if (unbiased) {
        var v = s2 / (n - 1);
        var a = (n * (n + 1)) / ((n - 1) * (n - 2) * (n - 3));
        var b = s4 / (v * v);
        var c = ((n - 1) * (n - 1)) / ((n - 2) * (n - 3));

        return a * b - 3 * c;
    } else {
        return m4 / (m2 * m2) - 3;
    }
};

exports.entropy = function entropy(values, eps) {
    if (typeof (eps) === 'undefined') eps = 0;
    var sum = 0, l = values.length;
    for (var i = 0; i < l; i++)
        sum += values[i] * Math.log(values[i] + eps);
    return -sum;
};

exports.weightedMean = function weightedMean(values, weights) {
    var sum = 0, l = values.length;
    for (var i = 0; i < l; i++)
        sum += values[i] * weights[i];
    return sum;
};

exports.weightedStandardDeviation = function weightedStandardDeviation(values, weights) {
    return Math.sqrt(exports.weightedVariance(values, weights));
};

exports.weightedVariance = function weightedVariance(values, weights) {
    var theMean = exports.weightedMean(values, weights);
    var vari = 0, l = values.length;
    var a = 0, b = 0;

    for (var i = 0; i < l; i++) {
        var z = values[i] - theMean;
        var w = weights[i];

        vari += w * (z * z);
        b += w;
        a += w * w;
    }

    return vari * (b / (b * b - a));
};

exports.center = function center(values, inPlace) {
    if (typeof (inPlace) === 'undefined') inPlace = false;

    var result = values;
    if (!inPlace)
        result = [].concat(values);

    var theMean = exports.mean(result), l = result.length;
    for (var i = 0; i < l; i++)
        result[i] -= theMean;
};

exports.standardize = function standardize(values, standardDev, inPlace) {
    if (typeof (standardDev) === 'undefined') standardDev = exports.standardDeviation(values);
    if (typeof (inPlace) === 'undefined') inPlace = false;
    var l = values.length;
    var result = inPlace ? values : new Array(l);
    for (var i = 0; i < l; i++)
        result[i] = values[i] / standardDev;
    return result;
};

exports.cumulativeSum = function cumulativeSum(array) {
    var l = array.length;
    var result = new Array(l);
    result[0] = array[0];
    for (var i = 1; i < l; i++)
        result[i] = result[i - 1] + array[i];
    return result;
};


/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = function(haystack, needle, comparator, low, high) {
  var mid, cmp;

  if(low === undefined)
    low = 0;

  else {
    low = low|0;
    if(low < 0 || low >= haystack.length)
      throw new RangeError("invalid lower bound");
  }

  if(high === undefined)
    high = haystack.length - 1;

  else {
    high = high|0;
    if(high < low || high >= haystack.length)
      throw new RangeError("invalid upper bound");
  }

  while(low <= high) {
    /* Note that "(low + high) >>> 1" may overflow, and results in a typecast
     * to double (which gives the wrong results). */
    mid = low + (high - low >> 1);
    cmp = +comparator(haystack[mid], needle, mid, haystack);

    /* Too low. */
    if(cmp < 0.0)
      low  = mid + 1;

    /* Too high. */
    else if(cmp > 0.0)
      high = mid - 1;

    /* Key found. */
    else
      return mid;
  }

  /* Key not found. */
  return ~low;
}


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = exports = __webpack_require__(65);


exports.getEquallySpacedData = __webpack_require__(66).getEquallySpacedData;
exports.SNV = __webpack_require__(67).SNV;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(71);
module.exports.Matrix = __webpack_require__(0);
module.exports.Matrix.algebra = __webpack_require__(22);


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.distance = __webpack_require__(72);
exports.similarity = __webpack_require__(108);

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const newArray = __webpack_require__(162);

const primeFinder = __webpack_require__(117);
const nextPrime = primeFinder.nextPrime;
const largestPrime = primeFinder.largestPrime;

const FREE = 0;
const FULL = 1;
const REMOVED = 2;

const defaultInitialCapacity = 150;
const defaultMinLoadFactor = 1 / 6;
const defaultMaxLoadFactor = 2 / 3;

class HashTable {
    constructor(options = {}) {
        if (options instanceof HashTable) {
            this.table = options.table.slice();
            this.values = options.values.slice();
            this.state = options.state.slice();
            this.minLoadFactor = options.minLoadFactor;
            this.maxLoadFactor = options.maxLoadFactor;
            this.distinct = options.distinct;
            this.freeEntries = options.freeEntries;
            this.lowWaterMark = options.lowWaterMark;
            this.highWaterMark = options.maxLoadFactor;
            return;
        }

        const initialCapacity = options.initialCapacity === undefined ? defaultInitialCapacity : options.initialCapacity;
        if (initialCapacity < 0) {
            throw new RangeError(`initial capacity must not be less than zero: ${initialCapacity}`);
        }

        const minLoadFactor = options.minLoadFactor === undefined ? defaultMinLoadFactor : options.minLoadFactor;
        const maxLoadFactor = options.maxLoadFactor === undefined ? defaultMaxLoadFactor : options.maxLoadFactor;
        if (minLoadFactor < 0 || minLoadFactor >= 1) {
            throw new RangeError(`invalid minLoadFactor: ${minLoadFactor}`);
        }
        if (maxLoadFactor <= 0 || maxLoadFactor >= 1) {
            throw new RangeError(`invalid maxLoadFactor: ${maxLoadFactor}`);
        }
        if (minLoadFactor >= maxLoadFactor) {
            throw new RangeError(`minLoadFactor (${minLoadFactor}) must be smaller than maxLoadFactor (${maxLoadFactor})`);
        }

        let capacity = initialCapacity;
        // User wants to put at least capacity elements. We need to choose the size based on the maxLoadFactor to
        // avoid the need to rehash before this capacity is reached.
        // actualCapacity * maxLoadFactor >= capacity
        capacity = (capacity / maxLoadFactor) | 0;
        capacity = nextPrime(capacity);
        if (capacity === 0) capacity = 1;

        this.table = newArray(capacity, 0);
        this.values = newArray(capacity, 0);
        this.state = newArray(capacity, 0);

        this.minLoadFactor = minLoadFactor;
        if (capacity === largestPrime) {
            this.maxLoadFactor = 1;
        } else {
            this.maxLoadFactor = maxLoadFactor;
        }

        this.distinct = 0;
        this.freeEntries = capacity;

        this.lowWaterMark = 0;
        this.highWaterMark = chooseHighWaterMark(capacity, this.maxLoadFactor);
    }

    clone() {
        return new HashTable(this);
    }

    get size() {
        return this.distinct;
    }

    get(key) {
        const i = this.indexOfKey(key);
        if (i < 0) return 0;
        return this.values[i];
    }

    set(key, value) {
        let i = this.indexOfInsertion(key);
        if (i < 0) {
            i = -i - 1;
            this.values[i] = value;
            return false;
        }

        if (this.distinct > this.highWaterMark) {
            const newCapacity = chooseGrowCapacity(this.distinct + 1, this.minLoadFactor, this.maxLoadFactor);
            this.rehash(newCapacity);
            return this.set(key, value);
        }

        this.table[i] = key;
        this.values[i] = value;
        if (this.state[i] === FREE) this.freeEntries--;
        this.state[i] = FULL;
        this.distinct++;

        if (this.freeEntries < 1) {
            const newCapacity = chooseGrowCapacity(this.distinct + 1, this.minLoadFactor, this.maxLoadFactor);
            this.rehash(newCapacity);
        }

        return true;
    }
    
    remove(key, noRehash) {
        const i = this.indexOfKey(key);
        if (i < 0) return false;

        this.state[i] = REMOVED;
        this.distinct--;

        if (!noRehash) this.maybeShrinkCapacity();

        return true;
    }

    delete(key, noRehash) {
        const i = this.indexOfKey(key);
        if (i < 0) return false;

        this.state[i] = FREE;
        this.distinct--;

        if (!noRehash) this.maybeShrinkCapacity();

        return true;
    }

    maybeShrinkCapacity() {
        if (this.distinct < this.lowWaterMark) {
            const newCapacity = chooseShrinkCapacity(this.distinct, this.minLoadFactor, this.maxLoadFactor);
            this.rehash(newCapacity);
        }
    }

    containsKey(key) {
        return this.indexOfKey(key) >= 0;
    }

    indexOfKey(key) {
        const table = this.table;
        const state = this.state;
        const length = this.table.length;

        const hash = key & 0x7fffffff;
        let i = hash % length;
        let decrement = hash % (length - 2);
        if (decrement === 0) decrement = 1;

        while (state[i] !== FREE && (state[i] === REMOVED || table[i] !== key)) {
            i -= decrement;
            if (i < 0) i += length;
        }

        if (state[i] === FREE) return -1;
        return i;
    }

    containsValue(value) {
        return this.indexOfValue(value) >= 0;
    }

    indexOfValue(value) {
        const values = this.values;
        const state = this.state;

        for (var i = 0; i < state.length; i++) {
            if (state[i] === FULL && values[i] === value) {
                return i;
            }
        }

        return -1;
    }

    indexOfInsertion(key) {
        const table = this.table;
        const state = this.state;
        const length = table.length;


        const hash = key & 0x7fffffff;
        let i = hash % length;
        let decrement = hash % (length - 2);
        if (decrement === 0) decrement = 1;

        while (state[i] === FULL && table[i] !== key) {
            i -= decrement;
            if (i < 0) i += length;
        }

        if (state[i] === REMOVED) {
            const j = i;
            while (state[i] !== FREE && (state[i] === REMOVED || table[i] !== key)) {
                i -= decrement;
                if (i < 0) i += length;
            }
            if (state[i] === FREE) i = j;
        }

        if (state[i] === FULL) {
            return -i - 1;
        }

        return i;
    }

    ensureCapacity(minCapacity) {
        if (this.table.length < minCapacity) {
            const newCapacity = nextPrime(minCapacity);
            this.rehash(newCapacity);
        }
    }

    rehash(newCapacity) {
        const oldCapacity = this.table.length;

        if (newCapacity <= this.distinct) throw new Error('Unexpected');

        const oldTable = this.table;
        const oldValues = this.values;
        const oldState = this.state;

        const newTable = newArray(newCapacity, 0);
        const newValues = newArray(newCapacity, 0);
        const newState = newArray(newCapacity, 0);

        this.lowWaterMark = chooseLowWaterMark(newCapacity, this.minLoadFactor);
        this.highWaterMark = chooseHighWaterMark(newCapacity, this.maxLoadFactor);

        this.table = newTable;
        this.values = newValues;
        this.state = newState;
        this.freeEntries = newCapacity - this.distinct;

        for (var i = 0; i < oldCapacity; i++) {
            if (oldState[i] === FULL) {
                var element = oldTable[i];
                var index = this.indexOfInsertion(element);
                newTable[index] = element;
                newValues[index] = oldValues[i];
                newState[index] = FULL;
            }
        }
    }

    forEachKey(callback) {
        for (var i = 0; i < this.state.length; i++) {
            if (this.state[i] === FULL) {
                if (!callback(this.table[i])) return false;
            }
        }
        return true;
    }

    forEachValue(callback) {
        for (var i = 0; i < this.state.length; i++) {
            if (this.state[i] === FULL) {
                if (!callback(this.values[i])) return false;
            }
        }
        return true;
    }

    forEachPair(callback) {
        for (var i = 0; i < this.state.length; i++) {
            if (this.state[i] === FULL) {
                if (!callback(this.table[i], this.values[i])) return false;
            }
        }
        return true;
    }
}

module.exports = HashTable;

function chooseLowWaterMark(capacity, minLoad) {
    return (capacity * minLoad) | 0;
}

function chooseHighWaterMark(capacity, maxLoad) {
    return Math.min(capacity - 2, (capacity * maxLoad) | 0);
}

function chooseGrowCapacity(size, minLoad, maxLoad) {
    return nextPrime(Math.max(size + 1, (4 * size / (3 * minLoad + maxLoad)) | 0));
}

function chooseShrinkCapacity(size, minLoad, maxLoad) {
    return nextPrime(Math.max(size + 1, (4 * size / (minLoad + 3 * maxLoad)) | 0));
}


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var extend = __webpack_require__(9);

var defaultOptions = {
    size: 1,
    value: 0
};

/**
 * Case when the entry is an array
 * @param data
 * @param options
 * @returns {Array}
 */
function arrayCase(data, options) {
    var len = data.length;
    if (typeof options.size === 'number')
        options.size = [options.size, options.size];

    var cond = len + options.size[0] + options.size[1];

    var output;
    if (options.output) {
        if (options.output.length !== cond)
            throw new RangeError('Wrong output size');
        output = options.output;
    }
    else
        output = new Array(cond);

    var i;

    // circular option
    if (options.value === 'circular') {
        for (i = 0; i < cond; i++) {
            if (i < options.size[0])
                output[i] = data[((len - (options.size[0] % len)) + i) % len];
            else if (i < (options.size[0] + len))
                output[i] = data[i - options.size[0]];
            else
                output[i] = data[(i - options.size[0]) % len];
        }
    }

    // replicate option
    else if (options.value === 'replicate') {
        for (i = 0; i < cond; i++) {
            if (i < options.size[0])
                output[i] = data[0];
            else if (i < (options.size[0] + len))
                output[i] = data[i - options.size[0]];
            else
                output[i] = data[len - 1];
        }
    }

    // symmetric option
    else if (options.value === 'symmetric') {
        if ((options.size[0] > len) || (options.size[1] > len))
            throw new RangeError('expanded value should not be bigger than the data length');
        for (i = 0; i < cond; i++) {
            if (i < options.size[0])
                output[i] = data[options.size[0] - 1 - i];
            else if (i < (options.size[0] + len))
                output[i] = data[i - options.size[0]];
            else
                output[i] = data[2*len + options.size[0] - i - 1];
        }
    }

    // default option
    else {
        for (i = 0; i < cond; i++) {
            if (i < options.size[0])
                output[i] = options.value;
            else if (i < (options.size[0] + len))
                output[i] = data[i - options.size[0]];
            else
                output[i] = options.value;
        }
    }

    return output;
}

/**
 * Case when the entry is a matrix
 * @param data
 * @param options
 * @returns {Array}
 */
function matrixCase(data, options) {
    var row = data.length;
    var col = data[0].length;
    if (options.size[0] === undefined)
        options.size = [options.size, options.size, options.size, options.size];
    throw new Error('matrix not supported yet, sorry');
}

/**
 * Pads and array
 * @param {Array <number>} data
 * @param {object} options
 */
function padArray (data, options) {
    options = extend({}, defaultOptions, options);

    if (Array.isArray(data)) {
        if (Array.isArray(data[0]))
            return matrixCase(data, options);
        else
            return arrayCase(data, options);
    }
    else
        throw new TypeError('data should be an array');
}

module.exports = padArray;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var numberIsNan = __webpack_require__(163);

function assertNum(x) {
	if (typeof x !== 'number' || numberIsNan(x)) {
		throw new TypeError('Expected a number');
	}
}

exports.asc = function (a, b) {
	assertNum(a);
	assertNum(b);
	return a - b;
};

exports.desc = function (a, b) {
	assertNum(a);
	assertNum(b);
	return b - a;
};


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Created by acastillo on 8/24/15.
 */
/**
 * Non in-place function definitions, compatible with mathjs code *
 */



var Matrix = __webpack_require__(0);

function matrix(A,B){
    return new Matrix(A,B);
}

function ones(rows, cols){
    return Matrix.ones(rows,cols);
}

function eye(rows, cols){
    return Matrix.eye(rows, cols);
}

function zeros(rows, cols){
    return Matrix.zeros(rows, cols);
}

function random(rows, cols){
    return Matrix.rand(rows,cols);
}

function transpose(A){
    if(typeof A == 'number')
        return A;
    var result = A.clone();
    return result.transpose();
}

function add(A, B){
    if(typeof A == 'number'&&typeof B === 'number')
        return A+B;
    if(typeof A == 'number')
        return this.add(B,A);

    var result = A.clone();
    return result.add(B);

}

function subtract(A, B){
    if(typeof A == 'number'&&typeof B === 'number')
        return A-B;
    if(typeof A == 'number')
        return this.subtract(B,A);
    var result = A.clone();
    return result.sub(B);
}

function multiply(A, B){
    if(typeof A == 'number'&&typeof B === 'number')
        return A*B;
    if(typeof A == 'number')
        return this.multiply(B,A);

    var result = A.clone();

    if(typeof B === 'number')
        result.mul(B);
    else
        result = result.mmul(B);

    if(result.rows==1&&result.columns==1)
        return result[0][0];
    else
        return result;

}

function dotMultiply(A, B){
    var result = A.clone();
    return result.mul(B);
}

function dotDivide(A, B){
    var result = A.clone();
    return result.div(B);
}

function diag(A){
    var diag = null;
    var rows = A.rows, cols = A.columns, j, r;
    //It is an array
    if(typeof cols === "undefined" && (typeof A)=='object'){
        if(A[0]&&A[0].length){
            rows = A.length;
            cols = A[0].length;
            r = Math.min(rows,cols);
            diag = Matrix.zeros(cols, cols);
            for (j = 0; j < cols; j++) {
                diag[j][j]=A[j][j];
            }
        }
        else{
            cols = A.length;
            diag = Matrix.zeros(cols, cols);
            for (j = 0; j < cols; j++) {
                diag[j][j]=A[j];
            }
        }

    }
    if(rows == 1){
        diag = Matrix.zeros(cols, cols);
        for (j = 0; j < cols; j++) {
            diag[j][j]=A[0][j];
        }
    }
    else{
        if(rows>0 && cols > 0){
            r = Math.min(rows,cols);
            diag = new Array(r);
            for (j = 0; j < r; j++) {
                diag[j] = A[j][j];
            }
        }
    }
    return diag;
}

function min(A, B){
    if(typeof A==='number' && typeof B ==='number')
        return Math.min(A,B);
    var ii = A.rows, jj = A.columns;
    var result = new Matrix(ii,jj);
    for (var i = 0; i < ii; i++) {
        for (var j = 0; j < jj; j++) {
            if (A[i][j] < B[i][j]) {
                result[i][j] = A[i][j];
            }
            else{
                result[i][j] = B[i][j];
            }
        }
    }
    return result;
}

function max(A, B){
    if(typeof A==='number' && typeof B ==='number')
        return Math.max(A,B);
    var ii = A.rows, jj = A.columns;
    var result = new Matrix(ii,jj);
    for (var i = 0; i < ii; i++) {
        for (var j = 0; j < jj; j++) {
            if (A[i][j] > B[i][j]) {
                result[i][j] = A[i][j];
            }
            else{
                result[i][j] = B[i][j];
            }
        }
    }
    return result;
}

function sqrt(A){
    if(typeof A==='number' )
        return Math.sqrt(A);
    var ii = A.rows, jj = A.columns;
    var result = new Matrix(ii,jj);
    for (var i = 0; i < ii; i++) {
        for (var j = 0; j < jj; j++) {
            result[i][j] = Math.sqrt(A[i][j]);

        }
    }
    return result;
}

function abs(A){
    if(typeof A==='number' )
        return Math.abs(A);
    var ii = A.rows, jj = A.columns;
    var result = new Matrix(ii,jj);
    for (var i = 0; i < ii; i++) {
        for (var j = 0; j < jj; j++) {
            result[i][j] = Math.abs(A[i][j]);

        }
    }
    return result;
}

function exp(A){
    if(typeof A==='number' )
        return Math.sqrt(A);
    var ii = A.rows, jj = A.columns;
    var result = new Matrix(ii,jj);
    for (var i = 0; i < ii; i++) {
        for (var j = 0; j < jj; j++) {
            result[i][j] = Math.exp(A[i][j]);
        }
    }
    return result;
}

function dotPow(A, b){
    if(typeof A==='number' )
        return Math.pow(A,b);
    //console.log(A);
    var ii = A.rows, jj = A.columns;
    var result = new Matrix(ii,jj);
    for (var i = 0; i < ii; i++) {
        for (var j = 0; j < jj; j++) {
            result[i][j] = Math.pow(A[i][j],b);
        }
    }
    return result;
}

function solve(A, B){
    return A.solve(B);
}

function inv(A){
    if(typeof A ==="number")
        return 1/A;
    return A.inverse();
}

module.exports = {
    transpose:transpose,
    add:add,
    subtract:subtract,
    multiply:multiply,
    dotMultiply:dotMultiply,
    dotDivide:dotDivide,
    diag:diag,
    min:min,
    max:max,
    solve:solve,
    inv:inv,
    sqrt:sqrt,
    exp:exp,
    dotPow:dotPow,
    abs:abs,
    matrix:matrix,
    ones:ones,
    zeros:zeros,
    random:random,
    eye:eye
};


/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = function dice(a, b) {
    var ii = a.length,
        p = 0,
        q1 = 0,
        q2 = 0;
    for (var i = 0; i < ii ; i++) {
        p += a[i] * a[i];
        q1 += b[i] * b[i];
        q2 += (a[i] - b[i]) * (a[i] - b[i]);
    }
    return q2 / (p + q1);
};


/***/ }),
/* 24 */
/***/ (function(module, exports) {

module.exports = function intersection(a, b) {
    var ii = a.length,
        ans = 0;
    for (var i = 0; i < ii ; i++) {
        ans += Math.min(a[i], b[i]);
    }
    return 1 - ans;
};


/***/ }),
/* 25 */
/***/ (function(module, exports) {

module.exports = function jaccard(a, b) {
    var ii = a.length,
        p1 = 0,
        p2 = 0,
        q1 = 0,
        q2 = 0;
    for (var i = 0; i < ii ; i++) {
        p1 += a[i] * b[i];
        p2 += a[i] * a[i];
        q1 += b[i] * b[i];
        q2 += (a[i] - b[i]) * (a[i] - b[i]);
    }
    return q2 / (p2 + q1 - p1);
};


/***/ }),
/* 26 */
/***/ (function(module, exports) {

module.exports = function kulczynski(a, b) {
    var ii = a.length,
        up = 0,
        down = 0;
    for (var i = 0; i < ii ; i++) {
        up += Math.abs(a[i] - b[i]);
        down += Math.min(a[i],b[i]);
    }
    return up / down;
};


/***/ }),
/* 27 */
/***/ (function(module, exports) {

module.exports = function motyka(a, b) {
    var ii = a.length,
        up = 0,
        down = 0;
    for (var i = 0; i < ii ; i++) {
        up += Math.min(a[i], b[i]);
        down += a[i] + b[i];
    }
    return 1 - (up / down);
};


/***/ }),
/* 28 */
/***/ (function(module, exports) {

module.exports = function squaredChord(a, b) {
    var ii = a.length,
        ans = 0;
    for (var i = 0; i < ii ; i++) {
        ans += (Math.sqrt(a[i]) - Math.sqrt(b[i])) * (Math.sqrt(a[i]) - Math.sqrt(b[i]));
    }
    return ans;
};


/***/ }),
/* 29 */
/***/ (function(module, exports) {

module.exports = function cosine(a, b) {
    var ii = a.length,
        p = 0,
        p2 = 0,
        q2 = 0;
    for (var i = 0; i < ii ; i++) {
        p += a[i] * b[i];
        p2 += a[i] * a[i];
        q2 += b[i] * b[i];
    }
    return p / (Math.sqrt(p2) * Math.sqrt(q2));
};


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function czekanowskiSimilarity(a, b) {
    var up = 0;
    var down = 0;
    for (var i = 0; i < a.length; i++) {
        up += Math.min(a[i], b[i]);
        down += a[i] + b[i];
    }
    return 2 * up / down;
};


/***/ }),
/* 31 */
/***/ (function(module, exports) {

module.exports = function tanimoto(a, b, bitvector) {
    if (bitvector) {
        var inter = 0,
            union = 0;
        for (var j = 0; j < a.length; j++) {
            inter += a[j] && b[j];
            union += a[j] || b[j];
        }
        if (union === 0)
            return 1;
        return inter / union;
    }
    else {
        var ii = a.length,
            p = 0,
            q = 0,
            m = 0;
        for (var i = 0; i < ii ; i++) {
            p += a[i];
            q += b[i];
            m += Math.min(a[i],b[i]);
        }
        return 1 - (p + q - 2 * m) / (p + q - m);
    }
};


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Matrix = __webpack_require__(0);

var Utils = __webpack_require__(34);
const ACTIVATION_FUNCTIONS = __webpack_require__(33);

class Layer {
    /**
     * Create a new layer with the given options
     * @param {object} options
     * @param {number} [options.inputSize] - Number of conections that enter the neurons.
     * @param {number} [options.outputSize] - Number of conections that leave the neurons.
     * @param {number} [options.regularization] - Regularization parameter.
     * @param {number} [options.epsilon] - Learning rate parameter.
     * @param {string} [options.activation] - Activation function parameter from the FeedForwardNeuralNetwork class.
     * @param {number} [options.activationParam] - Activation parameter if needed.
     */
    constructor(options) {
        this.inputSize = options.inputSize;
        this.outputSize = options.outputSize;
        this.regularization = options.regularization;
        this.epsilon = options.epsilon;
        this.activation = options.activation;
        this.activationParam = options.activationParam;

        var selectedFunction = ACTIVATION_FUNCTIONS[options.activation];
        var params = selectedFunction.activation.length;

        var actFunction = params > 1 ? val => selectedFunction.activation(val, options.activationParam) : selectedFunction.activation;
        var derFunction = params > 1 ? val => selectedFunction.derivate(val, options.activationParam) : selectedFunction.derivate;

        this.activationFunction = function (i, j) {
            this[i][j] = actFunction(this[i][j]);
        };
        this.derivate = function (i, j) {
            this[i][j] = derFunction(this[i][j]);
        };

        if (options.model) {
            // load model
            this.W = Matrix.checkMatrix(options.W);
            this.b = Matrix.checkMatrix(options.b);

        } else {
            // default constructor

            this.W = Matrix.rand(this.inputSize, this.outputSize);
            this.b = Matrix.zeros(1, this.outputSize);

            this.W.apply(function (i, j) {
                this[i][j] /= Math.sqrt(options.inputSize);
            });
        }
    }

    /**
     * propagate the given input through the current layer.
     * @param {Matrix} X - input.
     * @return {Matrix} output at the current layer.
     */
    forward(X) {
        var z = X.mmul(this.W).addRowVector(this.b);
        z.apply(this.activationFunction);
        this.a = z.clone();
        return z;
    }

    /**
     * apply backpropagation algorithm at the current layer
     * @param {Matrix} delta - delta values estimated at the following layer.
     * @param {Matrix} a - 'a' values from the following layer.
     * @return {Matrix} the new delta values for the next layer.
     */
    backpropagation(delta, a) {
        this.dW = a.transposeView().mmul(delta);
        this.db = Utils.sumCol(delta);

        var aCopy = a.clone();
        return delta.mmul(this.W.transposeView()).mul(aCopy.apply(this.derivate));
    }

    /**
     * Function that updates the weights at the current layer with the derivatives.
     */
    update() {
        this.dW.add(this.W.clone().mul(this.regularization));
        this.W.add(this.dW.mul(-this.epsilon));
        this.b.add(this.db.mul(-this.epsilon));
    }

    /**
     * Export the current layer to JSON.
     * @return {object} model
     */
    toJSON() {
        return {
            model: 'Layer',
            inputSize: this.inputSize,
            outputSize: this.outputSize,
            regularization: this.regularization,
            epsilon: this.epsilon,
            activation: this.activation,
            W: this.W,
            b: this.b
        };
    }

    /**
     * Creates a new Layer with the given model.
     * @param {object} model
     * @return {Layer}
     */
    static load(model) {
        if (model.model !== 'Layer') {
            throw new RangeError('the current model is not a Layer model');
        }
        return new Layer(model);
    }

}

module.exports = Layer;


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function logistic(val) {
    return 1 / (1 + Math.exp(-val));
}

function expELU(val, param) {
    return val < 0 ? param * (Math.exp(val) - 1) : val;
}

function softExponential(val, param) {
    if (param < 0) {
        return -Math.log(1 - param * (val + param)) / param;
    }
    if (param > 0) {
        return ((Math.exp(param * val) - 1) / param) + param;
    }
    return val;
}

function softExponentialPrime(val, param) {
    if (param < 0) {
        return 1 / (1 - param * (param + val));
    } else {
        return Math.exp(param * val);
    }
}

const ACTIVATION_FUNCTIONS = {
    'tanh': {
        activation: Math.tanh,
        derivate: val => 1 - (val * val)
    },
    'identity': {
        activation: val => val,
        derivate: () => 1
    },
    'logistic': {
        activation: logistic,
        derivate: val => logistic(val) * (1 - logistic(val))
    },
    'arctan': {
        activation: Math.atan,
        derivate: val => 1 / (val * val + 1)
    },
    'softsign': {
        activation: val => val / (1 + Math.abs(val)),
        derivate: val => 1 / ((1 + Math.abs(val)) * (1 + Math.abs(val)))
    },
    'relu': {
        activation: val => val < 0 ? 0 : val,
        derivate: val => val < 0 ? 0 : 1
    },
    'softplus': {
        activation: val => Math.log(1 + Math.exp(val)),
        derivate: val => 1 / (1 + Math.exp(-val))
    },
    'bent': {
        activation: val => ((Math.sqrt(val * val + 1) - 1) / 2) + val,
        derivate: val => (val / (2 * Math.sqrt(val * val + 1))) + 1
    },
    'sinusoid': {
        activation: Math.sin,
        derivate: Math.cos
    },
    'sinc': {
        activation: val => val === 0 ? 1 : Math.sin(val) / val,
        derivate: val => val === 0 ? 0 : (Math.cos(val) / val) - (Math.sin(val) / (val * val))
    },
    'gaussian': {
        activation: val => Math.exp(-(val * val)),
        derivate: val => -2 * val * Math.exp(-(val * val))
    },
    'parametric-relu': {
        activation: (val, param) => val < 0 ? param * val : val,
        derivate: (val, param) => val < 0 ? param : 1
    },
    'exponential-elu': {
        activation: expELU,
        derivate: (val, param) => val < 0 ? expELU(val, param) + param : 1
    },
    'soft-exponential': {
        activation: softExponential,
        derivate: softExponentialPrime
    }
};

module.exports = ACTIVATION_FUNCTIONS;


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Matrix = __webpack_require__(0);

/**
 * Retrieves the sum at each row of the given matrix.
 * @param {Matrix} matrix
 * @return {Matrix}
 */
function sumRow(matrix) {
    var sum = Matrix.zeros(matrix.rows, 1);
    for (var i = 0; i < matrix.rows; ++i) {
        for (var j = 0; j < matrix.columns; ++j) {
            sum[i][0] += matrix[i][j];
        }
    }
    return sum;
}

/**
 * Retrieves the sum at each column of the given matrix.
 * @param {Matrix} matrix
 * @return {Matrix}
 */
function sumCol(matrix) {
    var sum = Matrix.zeros(1, matrix.columns);
    for (var i = 0; i < matrix.rows; ++i) {
        for (var j = 0; j < matrix.columns; ++j) {
            sum[0][j] += matrix[i][j];
        }
    }
    return sum;
}

/**
 * Method that given an array of labels(predictions), returns two dictionaries, one to transform from labels to
 * numbers and other in the reverse way
 * @param {Array} array
 * @return {object}
 */
function dictOutputs(array) {
    var inputs = {}, outputs = {}, l = array.length, index = 0;
    for (var i = 0; i < l; i += 1) {
        if (inputs[array[i]] === undefined) {
            inputs[array[i]] = index;
            outputs[index] = array[i];
            index++;
        }
    }

    return {
        inputs: inputs,
        outputs: outputs
    };
}

module.exports = {
    dictOutputs: dictOutputs,
    sumCol: sumCol,
    sumRow: sumRow
};


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Cluster = __webpack_require__(10);
var util = __webpack_require__(167);

function ClusterLeaf (index) {
    Cluster.call(this);
    this.index = index;
    this.distance = 0;
    this.children = [];
}

util.inherits(ClusterLeaf, Cluster);

module.exports = ClusterLeaf;


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const nearestVector = __webpack_require__(147);

/**
 * Calculates the distance matrix for a given array of points
 * @ignore
 * @param {Array<Array<Number>>} data - the [x,y,z,...] points to cluster
 * @param {Function} distance - Distance function to use between the points
 * @return {Array<Array<Number>>} - matrix with the distance values
 */
function calculateDistanceMatrix(data, distance) {
    var distanceMatrix = new Array(data.length);
    for (var i = 0; i < data.length; ++i) {
        for (var j = i; j < data.length; ++j) {
            if (!distanceMatrix[i]) {
                distanceMatrix[i] = new Array(data.length);
            }
            if (!distanceMatrix[j]) {
                distanceMatrix[j] = new Array(data.length);
            }
            const dist = distance(data[i], data[j]);
            distanceMatrix[i][j] = dist;
            distanceMatrix[j][i] = dist;
        }
    }
    return distanceMatrix;
}

/**
 * Updates the cluster identifier based in the new data
 * @ignore
 * @param {Array<Array<Number>>} data - the [x,y,z,...] points to cluster
 * @param {Array<Array<Number>>} centers - the K centers in format [x,y,z,...]
 * @param {Array <Number>} clusterID - the cluster identifier for each data dot
 * @param {Function} distance - Distance function to use between the points
 * @returns {Array} the cluster identifier for each data dot
 */
function updateClusterID(data, centers, clusterID, distance) {
    for (var i = 0; i < data.length; i++) {
        clusterID[i] = nearestVector(centers, data[i], {distanceFunction: distance});
    }
    return clusterID;
}

/**
 * Update the center values based in the new configurations of the clusters
 * @ignore
 * @param {Array <Array <Number>>} data - the [x,y,z,...] points to cluster
 * @param {Array <Number>} clusterID - the cluster identifier for each data dot
 * @param {Number} K - Number of clusters
 * @returns {Array} he K centers in format [x,y,z,...]
 */
function updateCenters(data, clusterID, K) {
    const nDim = data[0].length;

    // creates empty centers with 0 size
    var centers = new Array(K);
    var centersLen = new Array(K);
    for (var i = 0; i < K; i++) {
        centers[i] = new Array(nDim);
        centersLen[i] = 0;
        for (var j = 0; j < nDim; j++) {
            centers[i][j] = 0;
        }
    }

    // add the value for all dimensions of the point
    for (var l = 0; l < data.length; l++) {
        centersLen[clusterID[l]]++;
        for (var dim = 0; dim < nDim; dim++) {
            centers[clusterID[l]][dim] += data[l][dim];
        }
    }

    // divides by length
    for (var id = 0; id < K; id++) {
        for (var d = 0; d < nDim; d++) {
            centers[id][d] /= centersLen[id];
        }
    }
    return centers;
}

/**
 * The centers have moved more than the tolerance value?
 * @ignore
 * @param {Array<Array<Number>>} centers - the K centers in format [x,y,z,...]
 * @param {Array<Array<Number>>} oldCenters - the K old centers in format [x,y,z,...]
 * @param {Function} distanceFunction - Distance function to use between the points
 * @param {Number} tolerance - Allowed distance for the centroids to move
 * @return {boolean}
 */
function converged(centers, oldCenters, distanceFunction, tolerance) {
    for (var i = 0; i < centers.length; i++) {
        if (distanceFunction(centers[i], oldCenters[i]) > tolerance) {
            return false;
        }
    }
    return true;
}

exports.updateClusterID = updateClusterID;
exports.updateCenters = updateCenters;
exports.calculateDistanceMatrix = calculateDistanceMatrix;
exports.converged = converged;


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = abstractMatrix;

var LuDecomposition = __webpack_require__(38);
var arrayUtils = __webpack_require__(16);
var util = __webpack_require__(7);
var MatrixTransposeView = __webpack_require__(146);
var MatrixRowView = __webpack_require__(143);
var MatrixSubView = __webpack_require__(145);
var MatrixSelectionView = __webpack_require__(144);
var MatrixColumnView = __webpack_require__(140);
var MatrixFlipRowView = __webpack_require__(142);
var MatrixFlipColumnView = __webpack_require__(141);

function abstractMatrix(superCtor) {
    if (superCtor === undefined) superCtor = Object;

    /**
     * Real matrix
     * @class Matrix
     * @param {number|Array|Matrix} nRows - Number of rows of the new matrix,
     * 2D array containing the data or Matrix instance to clone
     * @param {number} [nColumns] - Number of columns of the new matrix
     */
    class Matrix extends superCtor {
        static get [Symbol.species]() {
            return this;
        }

        /**
         * Constructs a Matrix with the chosen dimensions from a 1D array
         * @param {number} newRows - Number of rows
         * @param {number} newColumns - Number of columns
         * @param {Array} newData - A 1D array containing data for the matrix
         * @return {Matrix} - The new matrix
         */
        static from1DArray(newRows, newColumns, newData) {
            var length = newRows * newColumns;
            if (length !== newData.length) {
                throw new RangeError('Data length does not match given dimensions');
            }
            var newMatrix = new this(newRows, newColumns);
            for (var row = 0; row < newRows; row++) {
                for (var column = 0; column < newColumns; column++) {
                    newMatrix.set(row, column, newData[row * newColumns + column]);
                }
            }
            return newMatrix;
        }

        /**
         * Creates a row vector, a matrix with only one row.
         * @param {Array} newData - A 1D array containing data for the vector
         * @return {Matrix} - The new matrix
         */
        static rowVector(newData) {
            var vector = new this(1, newData.length);
            for (var i = 0; i < newData.length; i++) {
                vector.set(0, i, newData[i]);
            }
            return vector;
        }

        /**
         * Creates a column vector, a matrix with only one column.
         * @param {Array} newData - A 1D array containing data for the vector
         * @return {Matrix} - The new matrix
         */
        static columnVector(newData) {
            var vector = new this(newData.length, 1);
            for (var i = 0; i < newData.length; i++) {
                vector.set(i, 0, newData[i]);
            }
            return vector;
        }

        /**
         * Creates an empty matrix with the given dimensions. Values will be undefined. Same as using new Matrix(rows, columns).
         * @param {number} rows - Number of rows
         * @param {number} columns - Number of columns
         * @return {Matrix} - The new matrix
         */
        static empty(rows, columns) {
            return new this(rows, columns);
        }

        /**
         * Creates a matrix with the given dimensions. Values will be set to zero.
         * @param {number} rows - Number of rows
         * @param {number} columns - Number of columns
         * @return {Matrix} - The new matrix
         */
        static zeros(rows, columns) {
            return this.empty(rows, columns).fill(0);
        }

        /**
         * Creates a matrix with the given dimensions. Values will be set to one.
         * @param {number} rows - Number of rows
         * @param {number} columns - Number of columns
         * @return {Matrix} - The new matrix
         */
        static ones(rows, columns) {
            return this.empty(rows, columns).fill(1);
        }

        /**
         * Creates a matrix with the given dimensions. Values will be randomly set.
         * @param {number} rows - Number of rows
         * @param {number} columns - Number of columns
         * @param {function} [rng=Math.random] - Random number generator
         * @return {Matrix} The new matrix
         */
        static rand(rows, columns, rng) {
            if (rng === undefined) rng = Math.random;
            var matrix = this.empty(rows, columns);
            for (var i = 0; i < rows; i++) {
                for (var j = 0; j < columns; j++) {
                    matrix.set(i, j, rng());
                }
            }
            return matrix;
        }

        /**
         * Creates a matrix with the given dimensions. Values will be random integers.
         * @param {number} rows - Number of rows
         * @param {number} columns - Number of columns
         * @param {number} [maxValue=1000] - Maximum value
         * @param {function} [rng=Math.random] - Random number generator
         * @return {Matrix} The new matrix
         */
        static randInt(rows, columns, maxValue, rng) {
            if (maxValue === undefined) maxValue = 1000;
            if (rng === undefined) rng = Math.random;
            var matrix = this.empty(rows, columns);
            for (var i = 0; i < rows; i++) {
                for (var j = 0; j < columns; j++) {
                    var value = Math.floor(rng() * maxValue);
                    matrix.set(i, j, value);
                }
            }
            return matrix;
        }

        /**
         * Creates an identity matrix with the given dimension. Values of the diagonal will be 1 and others will be 0.
         * @param {number} rows - Number of rows
         * @param {number} [columns=rows] - Number of columns
         * @param {number} [value=1] - Value to fill the diagonal with
         * @return {Matrix} - The new identity matrix
         */
        static eye(rows, columns, value) {
            if (columns === undefined) columns = rows;
            if (value === undefined) value = 1;
            var min = Math.min(rows, columns);
            var matrix = this.zeros(rows, columns);
            for (var i = 0; i < min; i++) {
                matrix.set(i, i, value);
            }
            return matrix;
        }

        /**
         * Creates a diagonal matrix based on the given array.
         * @param {Array} data - Array containing the data for the diagonal
         * @param {number} [rows] - Number of rows (Default: data.length)
         * @param {number} [columns] - Number of columns (Default: rows)
         * @return {Matrix} - The new diagonal matrix
         */
        static diag(data, rows, columns) {
            var l = data.length;
            if (rows === undefined) rows = l;
            if (columns === undefined) columns = rows;
            var min = Math.min(l, rows, columns);
            var matrix = this.zeros(rows, columns);
            for (var i = 0; i < min; i++) {
                matrix.set(i, i, data[i]);
            }
            return matrix;
        }

        /**
         * Returns a matrix whose elements are the minimum between matrix1 and matrix2
         * @param {Matrix} matrix1
         * @param {Matrix} matrix2
         * @return {Matrix}
         */
        static min(matrix1, matrix2) {
            matrix1 = this.checkMatrix(matrix1);
            matrix2 = this.checkMatrix(matrix2);
            var rows = matrix1.rows;
            var columns = matrix1.columns;
            var result = new this(rows, columns);
            for (var i = 0; i < rows; i++) {
                for (var j = 0; j < columns; j++) {
                    result.set(i, j, Math.min(matrix1.get(i, j), matrix2.get(i, j)));
                }
            }
            return result;
        }

        /**
         * Returns a matrix whose elements are the maximum between matrix1 and matrix2
         * @param {Matrix} matrix1
         * @param {Matrix} matrix2
         * @return {Matrix}
         */
        static max(matrix1, matrix2) {
            matrix1 = this.checkMatrix(matrix1);
            matrix2 = this.checkMatrix(matrix2);
            var rows = matrix1.rows;
            var columns = matrix1.columns;
            var result = new this(rows, columns);
            for (var i = 0; i < rows; i++) {
                for (var j = 0; j < columns; j++) {
                    result.set(i, j, Math.max(matrix1.get(i, j), matrix2.get(i, j)));
                }
            }
            return result;
        }

        /**
         * Check that the provided value is a Matrix and tries to instantiate one if not
         * @param {*} value - The value to check
         * @return {Matrix}
         */
        static checkMatrix(value) {
            return Matrix.isMatrix(value) ? value : new this(value);
        }

        /**
         * Returns true if the argument is a Matrix, false otherwise
         * @param {*} value - The value to check
         * @return {boolean}
         */
        static isMatrix(value) {
            return (value != null) && (value.klass === 'Matrix');
        }

        /**
         * @prop {number} size - The number of elements in the matrix.
         */
        get size() {
            return this.rows * this.columns;
        }

        /**
         * Applies a callback for each element of the matrix. The function is called in the matrix (this) context.
         * @param {function} callback - Function that will be called with two parameters : i (row) and j (column)
         * @return {Matrix} this
         */
        apply(callback) {
            if (typeof callback !== 'function') {
                throw new TypeError('callback must be a function');
            }
            var ii = this.rows;
            var jj = this.columns;
            for (var i = 0; i < ii; i++) {
                for (var j = 0; j < jj; j++) {
                    callback.call(this, i, j);
                }
            }
            return this;
        }

        /**
         * Returns a new 1D array filled row by row with the matrix values
         * @return {Array}
         */
        to1DArray() {
            var array = new Array(this.size);
            for (var i = 0; i < this.rows; i++) {
                for (var j = 0; j < this.columns; j++) {
                    array[i * this.columns + j] = this.get(i, j);
                }
            }
            return array;
        }

        /**
         * Returns a 2D array containing a copy of the data
         * @return {Array}
         */
        to2DArray() {
            var copy = new Array(this.rows);
            for (var i = 0; i < this.rows; i++) {
                copy[i] = new Array(this.columns);
                for (var j = 0; j < this.columns; j++) {
                    copy[i][j] = this.get(i, j);
                }
            }
            return copy;
        }

        /**
         * @return {boolean} true if the matrix has one row
         */
        isRowVector() {
            return this.rows === 1;
        }

        /**
         * @return {boolean} true if the matrix has one column
         */
        isColumnVector() {
            return this.columns === 1;
        }

        /**
         * @return {boolean} true if the matrix has one row or one column
         */
        isVector() {
            return (this.rows === 1) || (this.columns === 1);
        }

        /**
         * @return {boolean} true if the matrix has the same number of rows and columns
         */
        isSquare() {
            return this.rows === this.columns;
        }

        /**
         * @return {boolean} true if the matrix is square and has the same values on both sides of the diagonal
         */
        isSymmetric() {
            if (this.isSquare()) {
                for (var i = 0; i < this.rows; i++) {
                    for (var j = 0; j <= i; j++) {
                        if (this.get(i, j) !== this.get(j, i)) {
                            return false;
                        }
                    }
                }
                return true;
            }
            return false;
        }

        /**
         * Sets a given element of the matrix. mat.set(3,4,1) is equivalent to mat[3][4]=1
         * @abstract
         * @param {number} rowIndex - Index of the row
         * @param {number} columnIndex - Index of the column
         * @param {number} value - The new value for the element
         * @return {Matrix} this
         */
        set(rowIndex, columnIndex, value) { // eslint-disable-line no-unused-vars
            throw new Error('set method is unimplemented');
        }

        /**
         * Returns the given element of the matrix. mat.get(3,4) is equivalent to matrix[3][4]
         * @abstract
         * @param {number} rowIndex - Index of the row
         * @param {number} columnIndex - Index of the column
         * @return {number}
         */
        get(rowIndex, columnIndex) { // eslint-disable-line no-unused-vars
            throw new Error('get method is unimplemented');
        }

        /**
         * Creates a new matrix that is a repetition of the current matrix. New matrix has rowRep times the number of
         * rows of the matrix, and colRep times the number of columns of the matrix
         * @param {number} rowRep - Number of times the rows should be repeated
         * @param {number} colRep - Number of times the columns should be re
         * @return {Matrix}
         * @example
         * var matrix = new Matrix([[1,2]]);
         * matrix.repeat(2); // [[1,2],[1,2]]
         */
        repeat(rowRep, colRep) {
            rowRep = rowRep || 1;
            colRep = colRep || 1;
            var matrix = new this.constructor[Symbol.species](this.rows * rowRep, this.columns * colRep);
            for (var i = 0; i < rowRep; i++) {
                for (var j = 0; j < colRep; j++) {
                    matrix.setSubMatrix(this, this.rows * i, this.columns * j);
                }
            }
            return matrix;
        }

        /**
         * Fills the matrix with a given value. All elements will be set to this value.
         * @param {number} value - New value
         * @return {Matrix} this
         */
        fill(value) {
            for (var i = 0; i < this.rows; i++) {
                for (var j = 0; j < this.columns; j++) {
                    this.set(i, j, value);
                }
            }
            return this;
        }

        /**
         * Negates the matrix. All elements will be multiplied by (-1)
         * @return {Matrix} this
         */
        neg() {
            return this.mulS(-1);
        }

        /**
         * Returns a new array from the given row index
         * @param {number} index - Row index
         * @return {Array}
         */
        getRow(index) {
            util.checkRowIndex(this, index);
            var row = new Array(this.columns);
            for (var i = 0; i < this.columns; i++) {
                row[i] = this.get(index, i);
            }
            return row;
        }

        /**
         * Returns a new row vector from the given row index
         * @param {number} index - Row index
         * @return {Matrix}
         */
        getRowVector(index) {
            return this.constructor.rowVector(this.getRow(index));
        }

        /**
         * Sets a row at the given index
         * @param {number} index - Row index
         * @param {Array|Matrix} array - Array or vector
         * @return {Matrix} this
         */
        setRow(index, array) {
            util.checkRowIndex(this, index);
            array = util.checkRowVector(this, array);
            for (var i = 0; i < this.columns; i++) {
                this.set(index, i, array[i]);
            }
            return this;
        }

        /**
         * Swaps two rows
         * @param {number} row1 - First row index
         * @param {number} row2 - Second row index
         * @return {Matrix} this
         */
        swapRows(row1, row2) {
            util.checkRowIndex(this, row1);
            util.checkRowIndex(this, row2);
            for (var i = 0; i < this.columns; i++) {
                var temp = this.get(row1, i);
                this.set(row1, i, this.get(row2, i));
                this.set(row2, i, temp);
            }
            return this;
        }

        /**
         * Returns a new array from the given column index
         * @param {number} index - Column index
         * @return {Array}
         */
        getColumn(index) {
            util.checkColumnIndex(this, index);
            var column = new Array(this.rows);
            for (var i = 0; i < this.rows; i++) {
                column[i] = this.get(i, index);
            }
            return column;
        }

        /**
         * Returns a new column vector from the given column index
         * @param {number} index - Column index
         * @return {Matrix}
         */
        getColumnVector(index) {
            return this.constructor.columnVector(this.getColumn(index));
        }

        /**
         * Sets a column at the given index
         * @param {number} index - Column index
         * @param {Array|Matrix} array - Array or vector
         * @return {Matrix} this
         */
        setColumn(index, array) {
            util.checkColumnIndex(this, index);
            array = util.checkColumnVector(this, array);
            for (var i = 0; i < this.rows; i++) {
                this.set(i, index, array[i]);
            }
            return this;
        }

        /**
         * Swaps two columns
         * @param {number} column1 - First column index
         * @param {number} column2 - Second column index
         * @return {Matrix} this
         */
        swapColumns(column1, column2) {
            util.checkColumnIndex(this, column1);
            util.checkColumnIndex(this, column2);
            for (var i = 0; i < this.rows; i++) {
                var temp = this.get(i, column1);
                this.set(i, column1, this.get(i, column2));
                this.set(i, column2, temp);
            }
            return this;
        }

        /**
         * Adds the values of a vector to each row
         * @param {Array|Matrix} vector - Array or vector
         * @return {Matrix} this
         */
        addRowVector(vector) {
            vector = util.checkRowVector(this, vector);
            for (var i = 0; i < this.rows; i++) {
                for (var j = 0; j < this.columns; j++) {
                    this.set(i, j, this.get(i, j) + vector[j]);
                }
            }
            return this;
        }

        /**
         * Subtracts the values of a vector from each row
         * @param {Array|Matrix} vector - Array or vector
         * @return {Matrix} this
         */
        subRowVector(vector) {
            vector = util.checkRowVector(this, vector);
            for (var i = 0; i < this.rows; i++) {
                for (var j = 0; j < this.columns; j++) {
                    this.set(i, j, this.get(i, j) - vector[j]);
                }
            }
            return this;
        }

        /**
         * Multiplies the values of a vector with each row
         * @param {Array|Matrix} vector - Array or vector
         * @return {Matrix} this
         */
        mulRowVector(vector) {
            vector = util.checkRowVector(this, vector);
            for (var i = 0; i < this.rows; i++) {
                for (var j = 0; j < this.columns; j++) {
                    this.set(i, j, this.get(i, j) * vector[j]);
                }
            }
            return this;
        }

        /**
         * Divides the values of each row by those of a vector
         * @param {Array|Matrix} vector - Array or vector
         * @return {Matrix} this
         */
        divRowVector(vector) {
            vector = util.checkRowVector(this, vector);
            for (var i = 0; i < this.rows; i++) {
                for (var j = 0; j < this.columns; j++) {
                    this.set(i, j, this.get(i, j) / vector[j]);
                }
            }
            return this;
        }

        /**
         * Adds the values of a vector to each column
         * @param {Array|Matrix} vector - Array or vector
         * @return {Matrix} this
         */
        addColumnVector(vector) {
            vector = util.checkColumnVector(this, vector);
            for (var i = 0; i < this.rows; i++) {
                for (var j = 0; j < this.columns; j++) {
                    this.set(i, j, this.get(i, j) + vector[i]);
                }
            }
            return this;
        }

        /**
         * Subtracts the values of a vector from each column
         * @param {Array|Matrix} vector - Array or vector
         * @return {Matrix} this
         */
        subColumnVector(vector) {
            vector = util.checkColumnVector(this, vector);
            for (var i = 0; i < this.rows; i++) {
                for (var j = 0; j < this.columns; j++) {
                    this.set(i, j, this.get(i, j) - vector[i]);
                }
            }
            return this;
        }

        /**
         * Multiplies the values of a vector with each column
         * @param {Array|Matrix} vector - Array or vector
         * @return {Matrix} this
         */
        mulColumnVector(vector) {
            vector = util.checkColumnVector(this, vector);
            for (var i = 0; i < this.rows; i++) {
                for (var j = 0; j < this.columns; j++) {
                    this.set(i, j, this.get(i, j) * vector[i]);
                }
            }
            return this;
        }

        /**
         * Divides the values of each column by those of a vector
         * @param {Array|Matrix} vector - Array or vector
         * @return {Matrix} this
         */
        divColumnVector(vector) {
            vector = util.checkColumnVector(this, vector);
            for (var i = 0; i < this.rows; i++) {
                for (var j = 0; j < this.columns; j++) {
                    this.set(i, j, this.get(i, j) / vector[i]);
                }
            }
            return this;
        }

        /**
         * Multiplies the values of a row with a scalar
         * @param {number} index - Row index
         * @param {number} value
         * @return {Matrix} this
         */
        mulRow(index, value) {
            util.checkRowIndex(this, index);
            for (var i = 0; i < this.columns; i++) {
                this.set(index, i, this.get(index, i) * value);
            }
            return this;
        }

        /**
         * Multiplies the values of a column with a scalar
         * @param {number} index - Column index
         * @param {number} value
         * @return {Matrix} this
         */
        mulColumn(index, value) {
            util.checkColumnIndex(this, index);
            for (var i = 0; i < this.rows; i++) {
                this.set(i, index, this.get(i, index) * value);
            }
            return this;
        }

        /**
         * Returns the maximum value of the matrix
         * @return {number}
         */
        max() {
            var v = this.get(0, 0);
            for (var i = 0; i < this.rows; i++) {
                for (var j = 0; j < this.columns; j++) {
                    if (this.get(i, j) > v) {
                        v = this.get(i, j);
                    }
                }
            }
            return v;
        }

        /**
         * Returns the index of the maximum value
         * @return {Array}
         */
        maxIndex() {
            var v = this.get(0, 0);
            var idx = [0, 0];
            for (var i = 0; i < this.rows; i++) {
                for (var j = 0; j < this.columns; j++) {
                    if (this.get(i, j) > v) {
                        v = this.get(i, j);
                        idx[0] = i;
                        idx[1] = j;
                    }
                }
            }
            return idx;
        }

        /**
         * Returns the minimum value of the matrix
         * @return {number}
         */
        min() {
            var v = this.get(0, 0);
            for (var i = 0; i < this.rows; i++) {
                for (var j = 0; j < this.columns; j++) {
                    if (this.get(i, j) < v) {
                        v = this.get(i, j);
                    }
                }
            }
            return v;
        }

        /**
         * Returns the index of the minimum value
         * @return {Array}
         */
        minIndex() {
            var v = this.get(0, 0);
            var idx = [0, 0];
            for (var i = 0; i < this.rows; i++) {
                for (var j = 0; j < this.columns; j++) {
                    if (this.get(i, j) < v) {
                        v = this.get(i, j);
                        idx[0] = i;
                        idx[1] = j;
                    }
                }
            }
            return idx;
        }

        /**
         * Returns the maximum value of one row
         * @param {number} row - Row index
         * @return {number}
         */
        maxRow(row) {
            util.checkRowIndex(this, row);
            var v = this.get(row, 0);
            for (var i = 1; i < this.columns; i++) {
                if (this.get(row, i) > v) {
                    v = this.get(row, i);
                }
            }
            return v;
        }

        /**
         * Returns the index of the maximum value of one row
         * @param {number} row - Row index
         * @return {Array}
         */
        maxRowIndex(row) {
            util.checkRowIndex(this, row);
            var v = this.get(row, 0);
            var idx = [row, 0];
            for (var i = 1; i < this.columns; i++) {
                if (this.get(row, i) > v) {
                    v = this.get(row, i);
                    idx[1] = i;
                }
            }
            return idx;
        }

        /**
         * Returns the minimum value of one row
         * @param {number} row - Row index
         * @return {number}
         */
        minRow(row) {
            util.checkRowIndex(this, row);
            var v = this.get(row, 0);
            for (var i = 1; i < this.columns; i++) {
                if (this.get(row, i) < v) {
                    v = this.get(row, i);
                }
            }
            return v;
        }

        /**
         * Returns the index of the maximum value of one row
         * @param {number} row - Row index
         * @return {Array}
         */
        minRowIndex(row) {
            util.checkRowIndex(this, row);
            var v = this.get(row, 0);
            var idx = [row, 0];
            for (var i = 1; i < this.columns; i++) {
                if (this.get(row, i) < v) {
                    v = this.get(row, i);
                    idx[1] = i;
                }
            }
            return idx;
        }

        /**
         * Returns the maximum value of one column
         * @param {number} column - Column index
         * @return {number}
         */
        maxColumn(column) {
            util.checkColumnIndex(this, column);
            var v = this.get(0, column);
            for (var i = 1; i < this.rows; i++) {
                if (this.get(i, column) > v) {
                    v = this.get(i, column);
                }
            }
            return v;
        }

        /**
         * Returns the index of the maximum value of one column
         * @param {number} column - Column index
         * @return {Array}
         */
        maxColumnIndex(column) {
            util.checkColumnIndex(this, column);
            var v = this.get(0, column);
            var idx = [0, column];
            for (var i = 1; i < this.rows; i++) {
                if (this.get(i, column) > v) {
                    v = this.get(i, column);
                    idx[0] = i;
                }
            }
            return idx;
        }

        /**
         * Returns the minimum value of one column
         * @param {number} column - Column index
         * @return {number}
         */
        minColumn(column) {
            util.checkColumnIndex(this, column);
            var v = this.get(0, column);
            for (var i = 1; i < this.rows; i++) {
                if (this.get(i, column) < v) {
                    v = this.get(i, column);
                }
            }
            return v;
        }

        /**
         * Returns the index of the minimum value of one column
         * @param {number} column - Column index
         * @return {Array}
         */
        minColumnIndex(column) {
            util.checkColumnIndex(this, column);
            var v = this.get(0, column);
            var idx = [0, column];
            for (var i = 1; i < this.rows; i++) {
                if (this.get(i, column) < v) {
                    v = this.get(i, column);
                    idx[0] = i;
                }
            }
            return idx;
        }

        /**
         * Returns an array containing the diagonal values of the matrix
         * @return {Array}
         */
        diag() {
            var min = Math.min(this.rows, this.columns);
            var diag = new Array(min);
            for (var i = 0; i < min; i++) {
                diag[i] = this.get(i, i);
            }
            return diag;
        }

        /**
         * Returns the sum by the argument given, if no argument given,
         * it returns the sum of all elements of the matrix.
         * @param {string} by - sum by 'row' or 'column'.
         * @return {Matrix|number}
         */
        sum(by) {
            switch (by) {
                case 'row':
                    return util.sumByRow(this);
                case 'column':
                    return util.sumByColumn(this);
                default:
                    return util.sumAll(this);
            }
        }

        /**
         * Returns the mean of all elements of the matrix
         * @return {number}
         */
        mean() {
            return this.sum() / this.size;
        }

        /**
         * Returns the product of all elements of the matrix
         * @return {number}
         */
        prod() {
            var prod = 1;
            for (var i = 0; i < this.rows; i++) {
                for (var j = 0; j < this.columns; j++) {
                    prod *= this.get(i, j);
                }
            }
            return prod;
        }

        /**
         * Computes the cumulative sum of the matrix elements (in place, row by row)
         * @return {Matrix} this
         */
        cumulativeSum() {
            var sum = 0;
            for (var i = 0; i < this.rows; i++) {
                for (var j = 0; j < this.columns; j++) {
                    sum += this.get(i, j);
                    this.set(i, j, sum);
                }
            }
            return this;
        }

        /**
         * Computes the dot (scalar) product between the matrix and another
         * @param {Matrix} vector2 vector
         * @return {number}
         */
        dot(vector2) {
            if (Matrix.isMatrix(vector2)) vector2 = vector2.to1DArray();
            var vector1 = this.to1DArray();
            if (vector1.length !== vector2.length) {
                throw new RangeError('vectors do not have the same size');
            }
            var dot = 0;
            for (var i = 0; i < vector1.length; i++) {
                dot += vector1[i] * vector2[i];
            }
            return dot;
        }

        /**
         * Returns the matrix product between this and other
         * @param {Matrix} other
         * @return {Matrix}
         */
        mmul(other) {
            other = this.constructor.checkMatrix(other);
            if (this.columns !== other.rows) {
                // eslint-disable-next-line no-console
                console.warn('Number of columns of left matrix are not equal to number of rows of right matrix.');
            }

            var m = this.rows;
            var n = this.columns;
            var p = other.columns;

            var result = new this.constructor[Symbol.species](m, p);

            var Bcolj = new Array(n);
            for (var j = 0; j < p; j++) {
                for (var k = 0; k < n; k++) {
                    Bcolj[k] = other.get(k, j);
                }

                for (var i = 0; i < m; i++) {
                    var s = 0;
                    for (k = 0; k < n; k++) {
                        s += this.get(i, k) * Bcolj[k];
                    }

                    result.set(i, j, s);
                }
            }
            return result;
        }

        strassen2x2(other) {
            var result = new this.constructor[Symbol.species](2, 2);
            const a11 = this.get(0, 0);
            const b11 = other.get(0, 0);
            const a12 = this.get(0, 1);
            const b12 = other.get(0, 1);
            const a21 = this.get(1, 0);
            const b21 = other.get(1, 0);
            const a22 = this.get(1, 1);
            const b22 = other.get(1, 1);

            // Compute intermediate values.
            const m1 = (a11 + a22) * (b11 + b22);
            const m2 = (a21 + a22) * b11;
            const m3 = a11 * (b12 - b22);
            const m4 = a22 * (b21 - b11);
            const m5 = (a11 + a12) * b22;
            const m6 = (a21 - a11) * (b11 + b12);
            const m7 = (a12 - a22) * (b21 + b22);

            // Combine intermediate values into the output.
            const c00 = m1 + m4 - m5 + m7;
            const c01 = m3 + m5;
            const c10 = m2 + m4;
            const c11 = m1 - m2 + m3 + m6;

            result.set(0, 0, c00);
            result.set(0, 1, c01);
            result.set(1, 0, c10);
            result.set(1, 1, c11);
            return result;
        }

        strassen3x3(other) {
            var result = new this.constructor[Symbol.species](3, 3);

            const a00 = this.get(0, 0);
            const a01 = this.get(0, 1);
            const a02 = this.get(0, 2);
            const a10 = this.get(1, 0);
            const a11 = this.get(1, 1);
            const a12 = this.get(1, 2);
            const a20 = this.get(2, 0);
            const a21 = this.get(2, 1);
            const a22 = this.get(2, 2);

            const b00 = other.get(0, 0);
            const b01 = other.get(0, 1);
            const b02 = other.get(0, 2);
            const b10 = other.get(1, 0);
            const b11 = other.get(1, 1);
            const b12 = other.get(1, 2);
            const b20 = other.get(2, 0);
            const b21 = other.get(2, 1);
            const b22 = other.get(2, 2);

            const m1 = (a00 + a01 + a02 - a10 - a11 - a21 - a22) * b11;
            const m2 = (a00 - a10) * (-b01 + b11);
            const m3 = a11 * (-b00 + b01 + b10 - b11 - b12 - b20 + b22);
            const m4 = (-a00 + a10 + a11) * (b00 - b01 + b11);
            const m5 = (a10 + a11) * (-b00 + b01);
            const m6 = a00 * b00;
            const m7 = (-a00 + a20 + a21) * (b00 - b02 + b12);
            const m8 = (-a00 + a20) * (b02 - b12);
            const m9 = (a20 + a21) * (-b00 + b02);
            const m10 = (a00 + a01 + a02 - a11 - a12 - a20 - a21) * b12;
            const m11 = a21 * (-b00 + b02 + b10 - b11 - b12 - b20 + b21);
            const m12 = (-a02 + a21 + a22) * (b11 + b20 - b21);
            const m13 = (a02 - a22) * (b11 - b21);
            const m14 = a02 * b20;
            const m15 = (a21 + a22) * (-b20 + b21);
            const m16 = (-a02 + a11 + a12) * (b12 + b20 - b22);
            const m17 = (a02 - a12) * (b12 - b22);
            const m18 = (a11 + a12) * (-b20 + b22);
            const m19 = a01 * b10;
            const m20 = a12 * b21;
            const m21 = a10 * b02;
            const m22 = a20 * b01;
            const m23 = a22 * b22;

            const c00 = m6 + m14 + m19;
            const c01 = m1 + m4 + m5 + m6 + m12 + m14 + m15;
            const c02 = m6 + m7 + m9 + m10 + m14 + m16 + m18;
            const c10 = m2 + m3 + m4 + m6 + m14 + m16 + m17;
            const c11 = m2 + m4 + m5 + m6 + m20;
            const c12 = m14 + m16 + m17 + m18 + m21;
            const c20 = m6 + m7 + m8 + m11 + m12 + m13 + m14;
            const c21 = m12 + m13 + m14 + m15 + m22;
            const c22 = m6 + m7 + m8 + m9 + m23;

            result.set(0, 0, c00);
            result.set(0, 1, c01);
            result.set(0, 2, c02);
            result.set(1, 0, c10);
            result.set(1, 1, c11);
            result.set(1, 2, c12);
            result.set(2, 0, c20);
            result.set(2, 1, c21);
            result.set(2, 2, c22);
            return result;
        }

        /**
         * Returns the matrix product between x and y. More efficient than mmul(other) only when we multiply squared matrix and when the size of the matrix is > 1000.
         * @param {Matrix} y
         * @return {Matrix}
         */
        mmulStrassen(y) {
            var x = this.clone();
            var r1 = x.rows;
            var c1 = x.columns;
            var r2 = y.rows;
            var c2 = y.columns;
            if (c1 !== r2) {
                // eslint-disable-next-line no-console
                console.warn(`Multiplying ${r1} x ${c1} and ${r2} x ${c2} matrix: dimensions do not match.`);
            }

            // Put a matrix into the top left of a matrix of zeros.
            // `rows` and `cols` are the dimensions of the output matrix.
            function embed(mat, rows, cols) {
                var r = mat.rows;
                var c = mat.columns;
                if ((r === rows) && (c === cols)) {
                    return mat;
                } else {
                    var resultat = Matrix.zeros(rows, cols);
                    resultat = resultat.setSubMatrix(mat, 0, 0);
                    return resultat;
                }
            }


            // Make sure both matrices are the same size.
            // This is exclusively for simplicity:
            // this algorithm can be implemented with matrices of different sizes.

            var r = Math.max(r1, r2);
            var c = Math.max(c1, c2);
            x = embed(x, r, c);
            y = embed(y, r, c);

            // Our recursive multiplication function.
            function blockMult(a, b, rows, cols) {
                // For small matrices, resort to naive multiplication.
                if (rows <= 512 || cols <= 512) {
                    return a.mmul(b); // a is equivalent to this
                }

                // Apply dynamic padding.
                if ((rows % 2 === 1) && (cols % 2 === 1)) {
                    a = embed(a, rows + 1, cols + 1);
                    b = embed(b, rows + 1, cols + 1);
                } else if (rows % 2 === 1) {
                    a = embed(a, rows + 1, cols);
                    b = embed(b, rows + 1, cols);
                } else if (cols % 2 === 1) {
                    a = embed(a, rows, cols + 1);
                    b = embed(b, rows, cols + 1);
                }

                var halfRows = parseInt(a.rows / 2);
                var halfCols = parseInt(a.columns / 2);
                // Subdivide input matrices.
                var a11 = a.subMatrix(0, halfRows - 1, 0, halfCols - 1);
                var b11 = b.subMatrix(0, halfRows - 1, 0, halfCols - 1);

                var a12 = a.subMatrix(0, halfRows - 1, halfCols, a.columns - 1);
                var b12 = b.subMatrix(0, halfRows - 1, halfCols, b.columns - 1);

                var a21 = a.subMatrix(halfRows, a.rows - 1, 0, halfCols - 1);
                var b21 = b.subMatrix(halfRows, b.rows - 1, 0, halfCols - 1);

                var a22 = a.subMatrix(halfRows, a.rows - 1, halfCols, a.columns - 1);
                var b22 = b.subMatrix(halfRows, b.rows - 1, halfCols, b.columns - 1);

                // Compute intermediate values.
                var m1 = blockMult(Matrix.add(a11, a22), Matrix.add(b11, b22), halfRows, halfCols);
                var m2 = blockMult(Matrix.add(a21, a22), b11, halfRows, halfCols);
                var m3 = blockMult(a11, Matrix.sub(b12, b22), halfRows, halfCols);
                var m4 = blockMult(a22, Matrix.sub(b21, b11), halfRows, halfCols);
                var m5 = blockMult(Matrix.add(a11, a12), b22, halfRows, halfCols);
                var m6 = blockMult(Matrix.sub(a21, a11), Matrix.add(b11, b12), halfRows, halfCols);
                var m7 = blockMult(Matrix.sub(a12, a22), Matrix.add(b21, b22), halfRows, halfCols);

                // Combine intermediate values into the output.
                var c11 = Matrix.add(m1, m4);
                c11.sub(m5);
                c11.add(m7);
                var c12 = Matrix.add(m3, m5);
                var c21 = Matrix.add(m2, m4);
                var c22 = Matrix.sub(m1, m2);
                c22.add(m3);
                c22.add(m6);

                //Crop output to the desired size (undo dynamic padding).
                var resultat = Matrix.zeros(2 * c11.rows, 2 * c11.columns);
                resultat = resultat.setSubMatrix(c11, 0, 0);
                resultat = resultat.setSubMatrix(c12, c11.rows, 0);
                resultat = resultat.setSubMatrix(c21, 0, c11.columns);
                resultat = resultat.setSubMatrix(c22, c11.rows, c11.columns);
                return resultat.subMatrix(0, rows - 1, 0, cols - 1);
            }
            return blockMult(x, y, r, c);
        }

        /**
         * Returns a row-by-row scaled matrix
         * @param {number} [min=0] - Minimum scaled value
         * @param {number} [max=1] - Maximum scaled value
         * @return {Matrix} - The scaled matrix
         */
        scaleRows(min, max) {
            min = min === undefined ? 0 : min;
            max = max === undefined ? 1 : max;
            if (min >= max) {
                throw new RangeError('min should be strictly smaller than max');
            }
            var newMatrix = this.constructor.empty(this.rows, this.columns);
            for (var i = 0; i < this.rows; i++) {
                var scaled = arrayUtils.scale(this.getRow(i), {min, max});
                newMatrix.setRow(i, scaled);
            }
            return newMatrix;
        }

        /**
         * Returns a new column-by-column scaled matrix
         * @param {number} [min=0] - Minimum scaled value
         * @param {number} [max=1] - Maximum scaled value
         * @return {Matrix} - The new scaled matrix
         * @example
         * var matrix = new Matrix([[1,2],[-1,0]]);
         * var scaledMatrix = matrix.scaleColumns(); // [[1,1],[0,0]]
         */
        scaleColumns(min, max) {
            min = min === undefined ? 0 : min;
            max = max === undefined ? 1 : max;
            if (min >= max) {
                throw new RangeError('min should be strictly smaller than max');
            }
            var newMatrix = this.constructor.empty(this.rows, this.columns);
            for (var i = 0; i < this.columns; i++) {
                var scaled = arrayUtils.scale(this.getColumn(i), {
                    min: min,
                    max: max
                });
                newMatrix.setColumn(i, scaled);
            }
            return newMatrix;
        }


        /**
         * Returns the Kronecker product (also known as tensor product) between this and other
         * See https://en.wikipedia.org/wiki/Kronecker_product
         * @param {Matrix} other
         * @return {Matrix}
         */
        kroneckerProduct(other) {
            other = this.constructor.checkMatrix(other);

            var m = this.rows;
            var n = this.columns;
            var p = other.rows;
            var q = other.columns;

            var result = new this.constructor[Symbol.species](m * p, n * q);
            for (var i = 0; i < m; i++) {
                for (var j = 0; j < n; j++) {
                    for (var k = 0; k < p; k++) {
                        for (var l = 0; l < q; l++) {
                            result[p * i + k][q * j + l] = this.get(i, j) * other.get(k, l);
                        }
                    }
                }
            }
            return result;
        }

        /**
         * Transposes the matrix and returns a new one containing the result
         * @return {Matrix}
         */
        transpose() {
            var result = new this.constructor[Symbol.species](this.columns, this.rows);
            for (var i = 0; i < this.rows; i++) {
                for (var j = 0; j < this.columns; j++) {
                    result.set(j, i, this.get(i, j));
                }
            }
            return result;
        }

        /**
         * Sorts the rows (in place)
         * @param {function} compareFunction - usual Array.prototype.sort comparison function
         * @return {Matrix} this
         */
        sortRows(compareFunction) {
            if (compareFunction === undefined) compareFunction = compareNumbers;
            for (var i = 0; i < this.rows; i++) {
                this.setRow(i, this.getRow(i).sort(compareFunction));
            }
            return this;
        }

        /**
         * Sorts the columns (in place)
         * @param {function} compareFunction - usual Array.prototype.sort comparison function
         * @return {Matrix} this
         */
        sortColumns(compareFunction) {
            if (compareFunction === undefined) compareFunction = compareNumbers;
            for (var i = 0; i < this.columns; i++) {
                this.setColumn(i, this.getColumn(i).sort(compareFunction));
            }
            return this;
        }

        /**
         * Returns a subset of the matrix
         * @param {number} startRow - First row index
         * @param {number} endRow - Last row index
         * @param {number} startColumn - First column index
         * @param {number} endColumn - Last column index
         * @return {Matrix}
         */
        subMatrix(startRow, endRow, startColumn, endColumn) {
            util.checkRange(this, startRow, endRow, startColumn, endColumn);
            var newMatrix = new this.constructor[Symbol.species](endRow - startRow + 1, endColumn - startColumn + 1);
            for (var i = startRow; i <= endRow; i++) {
                for (var j = startColumn; j <= endColumn; j++) {
                    newMatrix[i - startRow][j - startColumn] = this.get(i, j);
                }
            }
            return newMatrix;
        }

        /**
         * Returns a subset of the matrix based on an array of row indices
         * @param {Array} indices - Array containing the row indices
         * @param {number} [startColumn = 0] - First column index
         * @param {number} [endColumn = this.columns-1] - Last column index
         * @return {Matrix}
         */
        subMatrixRow(indices, startColumn, endColumn) {
            if (startColumn === undefined) startColumn = 0;
            if (endColumn === undefined) endColumn = this.columns - 1;
            if ((startColumn > endColumn) || (startColumn < 0) || (startColumn >= this.columns) || (endColumn < 0) || (endColumn >= this.columns)) {
                throw new RangeError('Argument out of range');
            }

            var newMatrix = new this.constructor[Symbol.species](indices.length, endColumn - startColumn + 1);
            for (var i = 0; i < indices.length; i++) {
                for (var j = startColumn; j <= endColumn; j++) {
                    if (indices[i] < 0 || indices[i] >= this.rows) {
                        throw new RangeError('Row index out of range: ' + indices[i]);
                    }
                    newMatrix.set(i, j - startColumn, this.get(indices[i], j));
                }
            }
            return newMatrix;
        }

        /**
         * Returns a subset of the matrix based on an array of column indices
         * @param {Array} indices - Array containing the column indices
         * @param {number} [startRow = 0] - First row index
         * @param {number} [endRow = this.rows-1] - Last row index
         * @return {Matrix}
         */
        subMatrixColumn(indices, startRow, endRow) {
            if (startRow === undefined) startRow = 0;
            if (endRow === undefined) endRow = this.rows - 1;
            if ((startRow > endRow) || (startRow < 0) || (startRow >= this.rows) || (endRow < 0) || (endRow >= this.rows)) {
                throw new RangeError('Argument out of range');
            }

            var newMatrix = new this.constructor[Symbol.species](endRow - startRow + 1, indices.length);
            for (var i = 0; i < indices.length; i++) {
                for (var j = startRow; j <= endRow; j++) {
                    if (indices[i] < 0 || indices[i] >= this.columns) {
                        throw new RangeError('Column index out of range: ' + indices[i]);
                    }
                    newMatrix.set(j - startRow, i, this.get(j, indices[i]));
                }
            }
            return newMatrix;
        }

        /**
         * Set a part of the matrix to the given sub-matrix
         * @param {Matrix|Array< Array >} matrix - The source matrix from which to extract values.
         * @param {number} startRow - The index of the first row to set
         * @param {number} startColumn - The index of the first column to set
         * @return {Matrix}
         */
        setSubMatrix(matrix, startRow, startColumn) {
            matrix = this.constructor.checkMatrix(matrix);
            var endRow = startRow + matrix.rows - 1;
            var endColumn = startColumn + matrix.columns - 1;
            util.checkRange(this, startRow, endRow, startColumn, endColumn);
            for (var i = 0; i < matrix.rows; i++) {
                for (var j = 0; j < matrix.columns; j++) {
                    this[startRow + i][startColumn + j] = matrix.get(i, j);
                }
            }
            return this;
        }

        /**
         * Return a new matrix based on a selection of rows and columns
         * @param {Array<number>} rowIndices - The row indices to select. Order matters and an index can be more than once.
         * @param {Array<number>} columnIndices - The column indices to select. Order matters and an index can be use more than once.
         * @return {Matrix} The new matrix
         */
        selection(rowIndices, columnIndices) {
            var indices = util.checkIndices(this, rowIndices, columnIndices);
            var newMatrix = new this.constructor[Symbol.species](rowIndices.length, columnIndices.length);
            for (var i = 0; i < indices.row.length; i++) {
                var rowIndex = indices.row[i];
                for (var j = 0; j < indices.column.length; j++) {
                    var columnIndex = indices.column[j];
                    newMatrix[i][j] = this.get(rowIndex, columnIndex);
                }
            }
            return newMatrix;
        }

        /**
         * Returns the trace of the matrix (sum of the diagonal elements)
         * @return {number}
         */
        trace() {
            var min = Math.min(this.rows, this.columns);
            var trace = 0;
            for (var i = 0; i < min; i++) {
                trace += this.get(i, i);
            }
            return trace;
        }

        /*
         Matrix views
         */

        /**
         * Returns a view of the transposition of the matrix
         * @return {MatrixTransposeView}
         */
        transposeView() {
            return new MatrixTransposeView(this);
        }

        /**
         * Returns a view of the row vector with the given index
         * @param {number} row - row index of the vector
         * @return {MatrixRowView}
         */
        rowView(row) {
            util.checkRowIndex(this, row);
            return new MatrixRowView(this, row);
        }

        /**
         * Returns a view of the column vector with the given index
         * @param {number} column - column index of the vector
         * @return {MatrixColumnView}
         */
        columnView(column) {
            util.checkColumnIndex(this, column);
            return new MatrixColumnView(this, column);
        }

        /**
         * Returns a view of the matrix flipped in the row axis
         * @return {MatrixFlipRowView}
         */
        flipRowView() {
            return new MatrixFlipRowView(this);
        }

        /**
         * Returns a view of the matrix flipped in the column axis
         * @return {MatrixFlipColumnView}
         */
        flipColumnView() {
            return new MatrixFlipColumnView(this);
        }

        /**
         * Returns a view of a submatrix giving the index boundaries
         * @param {number} startRow - first row index of the submatrix
         * @param {number} endRow - last row index of the submatrix
         * @param {number} startColumn - first column index of the submatrix
         * @param {number} endColumn - last column index of the submatrix
         * @return {MatrixSubView}
         */
        subMatrixView(startRow, endRow, startColumn, endColumn) {
            return new MatrixSubView(this, startRow, endRow, startColumn, endColumn);
        }

        /**
         * Returns a view of the cross of the row indices and the column indices
         * @example
         * // resulting vector is [[2], [2]]
         * var matrix = new Matrix([[1,2,3], [4,5,6]]).selectionView([0, 0], [1])
         * @param {Array<number>} rowIndices
         * @param {Array<number>} columnIndices
         * @return {MatrixSelectionView}
         */
        selectionView(rowIndices, columnIndices) {
            return new MatrixSelectionView(this, rowIndices, columnIndices);
        }


        /**
        * Calculates and returns the determinant of a matrix as a Number
        * @example
        *   new Matrix([[1,2,3], [4,5,6]]).det()
        * @return {number}
        */
        det() {
            if (this.isSquare()) {
                var a, b, c, d;
                if (this.columns === 2) {
                    // 2 x 2 matrix
                    a = this.get(0, 0);
                    b = this.get(0, 1);
                    c = this.get(1, 0);
                    d = this.get(1, 1);

                    return a * d - (b * c);
                } else if (this.columns === 3) {
                    // 3 x 3 matrix
                    var subMatrix0, subMatrix1, subMatrix2;
                    subMatrix0 = this.selectionView([1, 2], [1, 2]);
                    subMatrix1 = this.selectionView([1, 2], [0, 2]);
                    subMatrix2 = this.selectionView([1, 2], [0, 1]);
                    a = this.get(0, 0);
                    b = this.get(0, 1);
                    c = this.get(0, 2);

                    return a * subMatrix0.det() - b * subMatrix1.det() + c * subMatrix2.det();
                } else {
                    // general purpose determinant using the LU decomposition
                    return new LuDecomposition(this).determinant;
                }

            } else {
                throw Error('Determinant can only be calculated for a square matrix.');
            }
        }
    }

    Matrix.prototype.klass = 'Matrix';

    /**
     * @private
     * Check that two matrices have the same dimensions
     * @param {Matrix} matrix
     * @param {Matrix} otherMatrix
     */
    function checkDimensions(matrix, otherMatrix) { // eslint-disable-line no-unused-vars
        if (matrix.rows !== otherMatrix.rows ||
            matrix.columns !== otherMatrix.columns) {
            throw new RangeError('Matrices dimensions must be equal');
        }
    }

    function compareNumbers(a, b) {
        return a - b;
    }

    /*
     Synonyms
     */

    Matrix.random = Matrix.rand;
    Matrix.diagonal = Matrix.diag;
    Matrix.prototype.diagonal = Matrix.prototype.diag;
    Matrix.identity = Matrix.eye;
    Matrix.prototype.negate = Matrix.prototype.neg;
    Matrix.prototype.tensorProduct = Matrix.prototype.kroneckerProduct;
    Matrix.prototype.determinant = Matrix.prototype.det;

    /*
     Add dynamically instance and static methods for mathematical operations
     */

    var inplaceOperator = `
(function %name%(value) {
    if (typeof value === 'number') return this.%name%S(value);
    return this.%name%M(value);
})
`;

    var inplaceOperatorScalar = `
(function %name%S(value) {
    for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) %op% value);
        }
    }
    return this;
})
`;

    var inplaceOperatorMatrix = `
(function %name%M(matrix) {
    matrix = this.constructor.checkMatrix(matrix);
    checkDimensions(this, matrix);
    for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) %op% matrix.get(i, j));
        }
    }
    return this;
})
`;

    var staticOperator = `
(function %name%(matrix, value) {
    var newMatrix = new this[Symbol.species](matrix);
    return newMatrix.%name%(value);
})
`;

    var inplaceMethod = `
(function %name%() {
    for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
            this.set(i, j, %method%(this.get(i, j)));
        }
    }
    return this;
})
`;

    var staticMethod = `
(function %name%(matrix) {
    var newMatrix = new this[Symbol.species](matrix);
    return newMatrix.%name%();
})
`;

    var inplaceMethodWithArgs = `
(function %name%(%args%) {
    for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
            this.set(i, j, %method%(this.get(i, j), %args%));
        }
    }
    return this;
})
`;

    var staticMethodWithArgs = `
(function %name%(matrix, %args%) {
    var newMatrix = new this[Symbol.species](matrix);
    return newMatrix.%name%(%args%);
})
`;


    var inplaceMethodWithOneArgScalar = `
(function %name%S(value) {
    for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
            this.set(i, j, %method%(this.get(i, j), value));
        }
    }
    return this;
})
`;
    var inplaceMethodWithOneArgMatrix = `
(function %name%M(matrix) {
    matrix = this.constructor.checkMatrix(matrix);
    checkDimensions(this, matrix);
    for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
            this.set(i, j, %method%(this.get(i, j), matrix.get(i, j)));
        }
    }
    return this;
})
`;

    var inplaceMethodWithOneArg = `
(function %name%(value) {
    if (typeof value === 'number') return this.%name%S(value);
    return this.%name%M(value);
})
`;

    var staticMethodWithOneArg = staticMethodWithArgs;

    var operators = [
        // Arithmetic operators
        ['+', 'add'],
        ['-', 'sub', 'subtract'],
        ['*', 'mul', 'multiply'],
        ['/', 'div', 'divide'],
        ['%', 'mod', 'modulus'],
        // Bitwise operators
        ['&', 'and'],
        ['|', 'or'],
        ['^', 'xor'],
        ['<<', 'leftShift'],
        ['>>', 'signPropagatingRightShift'],
        ['>>>', 'rightShift', 'zeroFillRightShift']
    ];

    var i;

    for (var operator of operators) {
        var inplaceOp = eval(fillTemplateFunction(inplaceOperator, {name: operator[1], op: operator[0]}));
        var inplaceOpS = eval(fillTemplateFunction(inplaceOperatorScalar, {name: operator[1] + 'S', op: operator[0]}));
        var inplaceOpM = eval(fillTemplateFunction(inplaceOperatorMatrix, {name: operator[1] + 'M', op: operator[0]}));
        var staticOp = eval(fillTemplateFunction(staticOperator, {name: operator[1]}));
        for (i = 1; i < operator.length; i++) {
            Matrix.prototype[operator[i]] = inplaceOp;
            Matrix.prototype[operator[i] + 'S'] = inplaceOpS;
            Matrix.prototype[operator[i] + 'M'] = inplaceOpM;
            Matrix[operator[i]] = staticOp;
        }
    }

    var methods = [
        ['~', 'not']
    ];

    [
        'abs', 'acos', 'acosh', 'asin', 'asinh', 'atan', 'atanh', 'cbrt', 'ceil',
        'clz32', 'cos', 'cosh', 'exp', 'expm1', 'floor', 'fround', 'log', 'log1p',
        'log10', 'log2', 'round', 'sign', 'sin', 'sinh', 'sqrt', 'tan', 'tanh', 'trunc'
    ].forEach(function (mathMethod) {
        methods.push(['Math.' + mathMethod, mathMethod]);
    });

    for (var method of methods) {
        var inplaceMeth = eval(fillTemplateFunction(inplaceMethod, {name: method[1], method: method[0]}));
        var staticMeth = eval(fillTemplateFunction(staticMethod, {name: method[1]}));
        for (i = 1; i < method.length; i++) {
            Matrix.prototype[method[i]] = inplaceMeth;
            Matrix[method[i]] = staticMeth;
        }
    }

    var methodsWithArgs = [
        ['Math.pow', 1, 'pow']
    ];

    for (var methodWithArg of methodsWithArgs) {
        var args = 'arg0';
        for (i = 1; i < methodWithArg[1]; i++) {
            args += `, arg${i}`;
        }
        if (methodWithArg[1] !== 1) {
            var inplaceMethWithArgs = eval(fillTemplateFunction(inplaceMethodWithArgs, {
                name: methodWithArg[2],
                method: methodWithArg[0],
                args: args
            }));
            var staticMethWithArgs = eval(fillTemplateFunction(staticMethodWithArgs, {name: methodWithArg[2], args: args}));
            for (i = 2; i < methodWithArg.length; i++) {
                Matrix.prototype[methodWithArg[i]] = inplaceMethWithArgs;
                Matrix[methodWithArg[i]] = staticMethWithArgs;
            }
        } else {
            var tmplVar = {
                name: methodWithArg[2],
                args: args,
                method: methodWithArg[0]
            };
            var inplaceMethod2 = eval(fillTemplateFunction(inplaceMethodWithOneArg, tmplVar));
            var inplaceMethodS = eval(fillTemplateFunction(inplaceMethodWithOneArgScalar, tmplVar));
            var inplaceMethodM = eval(fillTemplateFunction(inplaceMethodWithOneArgMatrix, tmplVar));
            var staticMethod2 = eval(fillTemplateFunction(staticMethodWithOneArg, tmplVar));
            for (i = 2; i < methodWithArg.length; i++) {
                Matrix.prototype[methodWithArg[i]] = inplaceMethod2;
                Matrix.prototype[methodWithArg[i] + 'M'] = inplaceMethodM;
                Matrix.prototype[methodWithArg[i] + 'S'] = inplaceMethodS;
                Matrix[methodWithArg[i]] = staticMethod2;
            }
        }
    }

    function fillTemplateFunction(template, values) {
        for (var value in values) {
            template = template.replace(new RegExp('%' + value + '%', 'g'), values[value]);
        }
        return template;
    }

    return Matrix;
}


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Matrix = __webpack_require__(3);

// https://github.com/lutzroeder/Mapack/blob/master/Source/LuDecomposition.cs
function LuDecomposition(matrix) {
    if (!(this instanceof LuDecomposition)) {
        return new LuDecomposition(matrix);
    }

    matrix = Matrix.Matrix.checkMatrix(matrix);

    var lu = matrix.clone(),
        rows = lu.rows,
        columns = lu.columns,
        pivotVector = new Array(rows),
        pivotSign = 1,
        i, j, k, p, s, t, v,
        LUrowi, LUcolj, kmax;

    for (i = 0; i < rows; i++) {
        pivotVector[i] = i;
    }

    LUcolj = new Array(rows);

    for (j = 0; j < columns; j++) {

        for (i = 0; i < rows; i++) {
            LUcolj[i] = lu[i][j];
        }

        for (i = 0; i < rows; i++) {
            LUrowi = lu[i];
            kmax = Math.min(i, j);
            s = 0;
            for (k = 0; k < kmax; k++) {
                s += LUrowi[k] * LUcolj[k];
            }
            LUrowi[j] = LUcolj[i] -= s;
        }

        p = j;
        for (i = j + 1; i < rows; i++) {
            if (Math.abs(LUcolj[i]) > Math.abs(LUcolj[p])) {
                p = i;
            }
        }

        if (p !== j) {
            for (k = 0; k < columns; k++) {
                t = lu[p][k];
                lu[p][k] = lu[j][k];
                lu[j][k] = t;
            }

            v = pivotVector[p];
            pivotVector[p] = pivotVector[j];
            pivotVector[j] = v;

            pivotSign = -pivotSign;
        }

        if (j < rows && lu[j][j] !== 0) {
            for (i = j + 1; i < rows; i++) {
                lu[i][j] /= lu[j][j];
            }
        }
    }

    this.LU = lu;
    this.pivotVector = pivotVector;
    this.pivotSign = pivotSign;
}

LuDecomposition.prototype = {
    isSingular: function () {
        var data = this.LU,
            col = data.columns;
        for (var j = 0; j < col; j++) {
            if (data[j][j] === 0) {
                return true;
            }
        }
        return false;
    },
    get determinant() {
        var data = this.LU;
        if (!data.isSquare()) {
            throw new Error('Matrix must be square');
        }
        var determinant = this.pivotSign, col = data.columns;
        for (var j = 0; j < col; j++) {
            determinant *= data[j][j];
        }
        return determinant;
    },
    get lowerTriangularMatrix() {
        var data = this.LU,
            rows = data.rows,
            columns = data.columns,
            X = new Matrix.Matrix(rows, columns);
        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < columns; j++) {
                if (i > j) {
                    X[i][j] = data[i][j];
                } else if (i === j) {
                    X[i][j] = 1;
                } else {
                    X[i][j] = 0;
                }
            }
        }
        return X;
    },
    get upperTriangularMatrix() {
        var data = this.LU,
            rows = data.rows,
            columns = data.columns,
            X = new Matrix.Matrix(rows, columns);
        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < columns; j++) {
                if (i <= j) {
                    X[i][j] = data[i][j];
                } else {
                    X[i][j] = 0;
                }
            }
        }
        return X;
    },
    get pivotPermutationVector() {
        return this.pivotVector.slice();
    },
    solve: function (value) {
        value = Matrix.Matrix.checkMatrix(value);

        var lu = this.LU,
            rows = lu.rows;

        if (rows !== value.rows) {
            throw new Error('Invalid matrix dimensions');
        }
        if (this.isSingular()) {
            throw new Error('LU matrix is singular');
        }

        var count = value.columns;
        var X = value.subMatrixRow(this.pivotVector, 0, count - 1);
        var columns = lu.columns;
        var i, j, k;

        for (k = 0; k < columns; k++) {
            for (i = k + 1; i < columns; i++) {
                for (j = 0; j < count; j++) {
                    X[i][j] -= X[k][j] * lu[i][k];
                }
            }
        }
        for (k = columns - 1; k >= 0; k--) {
            for (j = 0; j < count; j++) {
                X[k][j] /= lu[k][k];
            }
            for (i = 0; i < k; i++) {
                for (j = 0; j < count; j++) {
                    X[i][j] -= X[k][j] * lu[i][k];
                }
            }
        }
        return X;
    }
};

module.exports = LuDecomposition;


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Matrix = __webpack_require__(0);
var Stat = __webpack_require__(2);

module.exports.NaiveBayes = NaiveBayes;
module.exports.separateClasses = separateClasses;

/**
 * Constructor for the Naive Bayes classifier, the parameters here is just for loading purposes.
 *
 * @param reload
 * @param model
 * @constructor
 */
function NaiveBayes(reload, model) {
    if(reload) {
        this.means = model.means;
        this.calculateProbabilities = model.calculateProbabilities;
    }
}

/**
 * Function that trains the classifier with a matrix that represents the training set and an array that
 * represents the label of each row in the training set. the labels must be numbers between 0 to n-1 where
 * n represents the number of classes.
 *
 * WARNING: in the case that one class, all the cases in one or more features have the same value, the
 * Naive Bayes classifier will not work well.
 * @param trainingSet
 * @param trainingLabels
 */
NaiveBayes.prototype.train = function (trainingSet, trainingLabels) {
    var C1 = Math.sqrt(2*Math.PI); // constant to precalculate the squared root
    if(!Matrix.isMatrix(trainingSet)) trainingSet = new Matrix(trainingSet);
    else trainingSet = trainingSet.clone();

    if(trainingSet.rows !== trainingLabels.length)
        throw new RangeError("the size of the training set and the training labels must be the same.");

    var separatedClasses = separateClasses(trainingSet, trainingLabels);
    var calculateProbabilities = new Array(separatedClasses.length);
    this.means = new Array(separatedClasses.length);
    for(var i = 0; i < separatedClasses.length; ++i) {
        var means = Stat.matrix.mean(separatedClasses[i]);
        var std = Stat.matrix.standardDeviation(separatedClasses[i], means);

        var logPriorProbability = Math.log(separatedClasses[i].rows / trainingSet.rows);
        calculateProbabilities[i] = new Array(means.length + 1);

        calculateProbabilities[i][0] = logPriorProbability;
        for(var j = 1; j < means.length + 1; ++j) {
            var currentStd = std[j - 1];
            calculateProbabilities[i][j] = [(1 / (C1 * currentStd)), -2*currentStd*currentStd];
        }

        this.means[i] = means;
    }

    this.calculateProbabilities = calculateProbabilities;
};

/**
 * function that predicts each row of the dataset (must be a matrix).
 *
 * @param dataset
 * @returns {Array}
 */
NaiveBayes.prototype.predict = function (dataset) {
    if(dataset[0].length === this.calculateProbabilities[0].length)
        throw new RangeError('the dataset must have the same features as the training set');

    var predictions = new Array(dataset.length);

    for(var i = 0; i < predictions.length; ++i) {
        predictions[i] = getCurrentClass(dataset[i], this.means, this.calculateProbabilities);
    }

    return predictions;
};

/**
 * Function the retrieves a prediction with one case.
 *
 * @param currentCase
 * @param mean - Precalculated means of each class trained
 * @param classes - Precalculated value of each class (Prior probability and probability function of each feature)
 * @returns {number}
 */
function getCurrentClass(currentCase, mean, classes) {
    var maxProbability = 0;
    var predictedClass = -1;

    // going through all precalculated values for the classes
    for(var i = 0; i < classes.length; ++i) {
        var currentProbability = classes[i][0]; // initialize with the prior probability
        for(var j = 1; j < classes[0][1].length + 1; ++j) {
            currentProbability += calculateLogProbability(currentCase[j - 1], mean[i][j - 1], classes[i][j][0], classes[i][j][1]);
        }

        currentProbability = Math.exp(currentProbability);
        if(currentProbability > maxProbability) {
            maxProbability = currentProbability;
            predictedClass = i;
        }
    }

    return predictedClass;
}

/**
 * Function that export the NaiveBayes model.
 * @returns {{modelName: string, means: *, calculateProbabilities: *}}
 */
NaiveBayes.prototype.export = function () {
    return {
        modelName: "NaiveBayes",
        means: this.means,
        calculateProbabilities: this.calculateProbabilities
    };
};

/**
 * Function that create a Naive Bayes classifier with the given model.
 * @param model
 * @returns {NaiveBayes}
 */
NaiveBayes.load = function (model) {
    if(model.modelName !== 'NaiveBayes')
        throw new RangeError("The given model is invalid!");

    return new NaiveBayes(true, model);
};

/**
 * function that retrieves the probability of the feature given the class.
 * @param value - value of the feature.
 * @param mean - mean of the feature for the given class.
 * @param C1 - precalculated value of (1 / (sqrt(2*pi) * std)).
 * @param C2 - precalculated value of (2 * std^2) for the denominator of the exponential.
 * @returns {number}
 */
function calculateLogProbability(value, mean, C1, C2) {
    var value = value - mean;
    return Math.log(C1 * Math.exp((value * value) / C2))
}

/**
 * Function that retuns an array of matrices of the cases that belong to each class.
 * @param X - dataset
 * @param y - predictions
 * @returns {Array}
 */
function separateClasses(X, y) {
    var features = X.columns;

    var classes = 0;
    var totalPerClasses = new Array(100); // max upperbound of classes
    for (var i = 0; i < y.length; i++) {
        if(totalPerClasses[y[i]] === undefined) {
            totalPerClasses[y[i]] = 0;
            classes++;
        }
        totalPerClasses[y[i]]++;
    }
    var separatedClasses = new Array(classes);
    var currentIndex = new Array(classes);
    for(i = 0; i < classes; ++i) {
        separatedClasses[i] = new Matrix(totalPerClasses[i], features);
        currentIndex[i] = 0;
    }
    for(i = 0; i < X.rows; ++i) {
        separatedClasses[y[i]].setRow(currentIndex[y[i]], X.getRow(i));
        currentIndex[y[i]]++;
    }
    return separatedClasses;
}


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Function that return a constants of the M degree polynomial that
 * fit the given points, this constants is given from lower to higher
 * order of the polynomial.
 *
 * @param {Vector} X - Vector of the x positions of the points.
 * @param {Vector} Y - Vector of the y positions of the points.
 * @param {Number|BigNumber} M - Degree of the polynomial.
 * @param {Vector} constants - Vector of constants of the function.
 * Created by acastillo on 5/12/16.
 */

const maybeToPrecision = __webpack_require__(6).maybeToPrecision;
const BaseRegression = __webpack_require__(4);
const Matrix = __webpack_require__(0);


class PolynomialRegression extends BaseRegression {
    /**
     * @constructor
     * @param x: Independent variable
     * @param y: Dependent variable
     * @param M: Maximum degree of the polynomial
     * @param options
     */
    constructor(x, y, M, options) {
        super();
        let opt = options || {};
        if (x === true) { // reloading model
            this.coefficients = y.coefficients;
            this.powers = y.powers;
            this.M = y.M;
            if (y.quality) {
                this.quality = y.quality;
            }
        } else {
            var n = x.length;
            if (n !== y.length) {
                throw new RangeError('input and output array have a different length');
            }

            let powers;
            if (Array.isArray(M)) {
                powers = M;
                M = powers.length;
            } else {
                M++;
                powers = new Array(M);
                for (k = 0; k < M; k++) {
                    powers[k] = k;
                }
            }
            var F = new Matrix(n, M);
            var Y = new Matrix([y]);
            var k, i;
            for (k = 0; k < M; k++) {
                for (i = 0; i < n; i++) {
                    if (powers[k] === 0) {
                        F[i][k] = 1;
                    } else {
                        F[i][k] = Math.pow(x[i], powers[k]);
                    }
                }
            }

            var FT = F.transposeView();
            var A = FT.mmul(F);
            var B = FT.mmul(Y.transposeView());

            this.coefficients = A.solve(B).to1DArray();
            this.powers = powers;
            this.M = M - 1;
            if (opt.computeQuality) {
                this.quality = this.modelQuality(x, y);
            }
        }
    }

    _predict(x) {
        var y = 0;
        for (var  k = 0; k < this.powers.length; k++) {
            y += this.coefficients[k] * Math.pow(x, this.powers[k]);
        }
        return y;
    }

    toJSON() {
        var out = {name: 'polynomialRegression',
            coefficients: this.coefficients,
            powers: this.powers,
            M: this.M
        };

        if (this.quality) {
            out.quality = this.quality;
        }
        return out;
    }

    toString(precision) {
        return this._toFormula(precision, false);
    }

    toLaTeX(precision) {
        return this._toFormula(precision, true);
    }

    _toFormula(precision, isLaTeX) {
        var sup = '^';
        var closeSup = '';
        var times = ' * ';
        if (isLaTeX) {
            sup = '^{';
            closeSup = '}';
            times = '';
        }

        var fn =  '', str;
        for (var k = 0; k < this.coefficients.length; k++) {
            str = '';
            if (this.coefficients[k] !== 0) {
                if (this.powers[k] === 0) {
                    str = maybeToPrecision(this.coefficients[k], precision);
                } else {
                    if (this.powers[k] === 1) {
                        str = maybeToPrecision(this.coefficients[k], precision) + times + 'x';
                    } else {
                        str = maybeToPrecision(this.coefficients[k], precision) + times + 'x' + sup + this.powers[k] + closeSup;
                    }
                }

                if (this.coefficients[k] > 0 && k !== (this.coefficients.length - 1)) {
                    str = ' + ' + str;
                } else if (k !== (this.coefficients.length - 1)) {
                    str = ' ' + str;
                }
            }
            fn = str + fn;
        }
        if (fn.charAt(0) === ' + ') {
            fn = fn.slice(1);
        }

        return 'f(x) = ' + fn;
    }

    static load(json) {
        if (json.name !== 'polynomialRegression') {
            throw new TypeError('not a polynomial regression model');
        }
        return new PolynomialRegression(true, json);
    }
}

module.exports = PolynomialRegression;


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function compareNumbers(a, b) {
    return a - b;
}

/**
 * Computes the sum of the given values
 * @param {Array} values
 * @returns {number}
 */
exports.sum = function sum(values) {
    var sum = 0;
    for (var i = 0; i < values.length; i++) {
        sum += values[i];
    }
    return sum;
};

/**
 * Computes the maximum of the given values
 * @param {Array} values
 * @returns {number}
 */
exports.max = function max(values) {
    var max = -Infinity;
    var l = values.length;
    for (var i = 0; i < l; i++) {
        if (values[i] > max) max = values[i];
    }
    return max;
};

/**
 * Computes the minimum of the given values
 * @param {Array} values
 * @returns {number}
 */
exports.min = function min(values) {
    var min = Infinity;
    var l = values.length;
    for (var i = 0; i < l; i++) {
        if (values[i] < min) min = values[i];
    }
    return min;
};

/**
 * Computes the min and max of the given values
 * @param {Array} values
 * @returns {{min: number, max: number}}
 */
exports.minMax = function minMax(values) {
    var min = Infinity;
    var max = -Infinity;
    var l = values.length;
    for (var i = 0; i < l; i++) {
        if (values[i] < min) min = values[i];
        if (values[i] > max) max = values[i];
    }
    return {
        min: min,
        max: max
    };
};

/**
 * Computes the arithmetic mean of the given values
 * @param {Array} values
 * @returns {number}
 */
exports.arithmeticMean = function arithmeticMean(values) {
    var sum = 0;
    var l = values.length;
    for (var i = 0; i < l; i++) {
        sum += values[i];
    }
    return sum / l;
};

/**
 * {@link arithmeticMean}
 */
exports.mean = exports.arithmeticMean;

/**
 * Computes the geometric mean of the given values
 * @param {Array} values
 * @returns {number}
 */
exports.geometricMean = function geometricMean(values) {
    var mul = 1;
    var l = values.length;
    for (var i = 0; i < l; i++) {
        mul *= values[i];
    }
    return Math.pow(mul, 1 / l);
};

/**
 * Computes the mean of the log of the given values
 * If the return value is exponentiated, it gives the same result as the
 * geometric mean.
 * @param {Array} values
 * @returns {number}
 */
exports.logMean = function logMean(values) {
    var lnsum = 0;
    var l = values.length;
    for (var i = 0; i < l; i++) {
        lnsum += Math.log(values[i]);
    }
    return lnsum / l;
};

/**
 * Computes the weighted grand mean for a list of means and sample sizes
 * @param {Array} means - Mean values for each set of samples
 * @param {Array} samples - Number of original values for each set of samples
 * @returns {number}
 */
exports.grandMean = function grandMean(means, samples) {
    var sum = 0;
    var n = 0;
    var l = means.length;
    for (var i = 0; i < l; i++) {
        sum += samples[i] * means[i];
        n += samples[i];
    }
    return sum / n;
};

/**
 * Computes the truncated mean of the given values using a given percentage
 * @param {Array} values
 * @param {number} percent - The percentage of values to keep (range: [0,1])
 * @param {boolean} [alreadySorted=false]
 * @returns {number}
 */
exports.truncatedMean = function truncatedMean(values, percent, alreadySorted) {
    if (alreadySorted === undefined) alreadySorted = false;
    if (!alreadySorted) {
        values = values.slice().sort(compareNumbers);
    }
    var l = values.length;
    var k = Math.floor(l * percent);
    var sum = 0;
    for (var i = k; i < (l - k); i++) {
        sum += values[i];
    }
    return sum / (l - 2 * k);
};

/**
 * Computes the harmonic mean of the given values
 * @param {Array} values
 * @returns {number}
 */
exports.harmonicMean = function harmonicMean(values) {
    var sum = 0;
    var l = values.length;
    for (var i = 0; i < l; i++) {
        if (values[i] === 0) {
            throw new RangeError('value at index ' + i + 'is zero');
        }
        sum += 1 / values[i];
    }
    return l / sum;
};

/**
 * Computes the contraharmonic mean of the given values
 * @param {Array} values
 * @returns {number}
 */
exports.contraHarmonicMean = function contraHarmonicMean(values) {
    var r1 = 0;
    var r2 = 0;
    var l = values.length;
    for (var i = 0; i < l; i++) {
        r1 += values[i] * values[i];
        r2 += values[i];
    }
    if (r2 < 0) {
        throw new RangeError('sum of values is negative');
    }
    return r1 / r2;
};

/**
 * Computes the median of the given values
 * @param {Array} values
 * @param {boolean} [alreadySorted=false]
 * @returns {number}
 */
exports.median = function median(values, alreadySorted) {
    if (alreadySorted === undefined) alreadySorted = false;
    if (!alreadySorted) {
        values = values.slice().sort(compareNumbers);
    }
    var l = values.length;
    var half = Math.floor(l / 2);
    if (l % 2 === 0) {
        return (values[half - 1] + values[half]) * 0.5;
    } else {
        return values[half];
    }
};

/**
 * Computes the variance of the given values
 * @param {Array} values
 * @param {boolean} [unbiased=true] - if true, divide by (n-1); if false, divide by n.
 * @returns {number}
 */
exports.variance = function variance(values, unbiased) {
    if (unbiased === undefined) unbiased = true;
    var theMean = exports.mean(values);
    var theVariance = 0;
    var l = values.length;

    for (var i = 0; i < l; i++) {
        var x = values[i] - theMean;
        theVariance += x * x;
    }

    if (unbiased) {
        return theVariance / (l - 1);
    } else {
        return theVariance / l;
    }
};

/**
 * Computes the standard deviation of the given values
 * @param {Array} values
 * @param {boolean} [unbiased=true] - if true, divide by (n-1); if false, divide by n.
 * @returns {number}
 */
exports.standardDeviation = function standardDeviation(values, unbiased) {
    return Math.sqrt(exports.variance(values, unbiased));
};

exports.standardError = function standardError(values) {
    return exports.standardDeviation(values) / Math.sqrt(values.length);
};

exports.quartiles = function quartiles(values, alreadySorted) {
    if (typeof(alreadySorted) === 'undefined') alreadySorted = false;
    if (!alreadySorted) {
        values = values.slice();
        values.sort(compareNumbers);
    }

    var quart = values.length / 4;
    var q1 = values[Math.ceil(quart) - 1];
    var q2 = exports.median(values, true);
    var q3 = values[Math.ceil(quart * 3) - 1];

    return {q1: q1, q2: q2, q3: q3};
};

exports.pooledStandardDeviation = function pooledStandardDeviation(samples, unbiased) {
    return Math.sqrt(exports.pooledVariance(samples, unbiased));
};

exports.pooledVariance = function pooledVariance(samples, unbiased) {
    if (typeof(unbiased) === 'undefined') unbiased = true;
    var sum = 0;
    var length = 0, l = samples.length;
    for (var i = 0; i < l; i++) {
        var values = samples[i];
        var vari = exports.variance(values);

        sum += (values.length - 1) * vari;

        if (unbiased)
            length += values.length - 1;
        else
            length += values.length;
    }
    return sum / length;
};

exports.mode = function mode(values) {
    var l = values.length,
        itemCount = new Array(l),
        i;
    for (i = 0; i < l; i++) {
        itemCount[i] = 0;
    }
    var itemArray = new Array(l);
    var count = 0;

    for (i = 0; i < l; i++) {
        var index = itemArray.indexOf(values[i]);
        if (index >= 0)
            itemCount[index]++;
        else {
            itemArray[count] = values[i];
            itemCount[count] = 1;
            count++;
        }
    }

    var maxValue = 0, maxIndex = 0;
    for (i = 0; i < count; i++) {
        if (itemCount[i] > maxValue) {
            maxValue = itemCount[i];
            maxIndex = i;
        }
    }

    return itemArray[maxIndex];
};

exports.covariance = function covariance(vector1, vector2, unbiased) {
    if (typeof(unbiased) === 'undefined') unbiased = true;
    var mean1 = exports.mean(vector1);
    var mean2 = exports.mean(vector2);

    if (vector1.length !== vector2.length)
        throw "Vectors do not have the same dimensions";

    var cov = 0, l = vector1.length;
    for (var i = 0; i < l; i++) {
        var x = vector1[i] - mean1;
        var y = vector2[i] - mean2;
        cov += x * y;
    }

    if (unbiased)
        return cov / (l - 1);
    else
        return cov / l;
};

exports.skewness = function skewness(values, unbiased) {
    if (typeof(unbiased) === 'undefined') unbiased = true;
    var theMean = exports.mean(values);

    var s2 = 0, s3 = 0, l = values.length;
    for (var i = 0; i < l; i++) {
        var dev = values[i] - theMean;
        s2 += dev * dev;
        s3 += dev * dev * dev;
    }
    var m2 = s2 / l;
    var m3 = s3 / l;

    var g = m3 / (Math.pow(m2, 3 / 2.0));
    if (unbiased) {
        var a = Math.sqrt(l * (l - 1));
        var b = l - 2;
        return (a / b) * g;
    }
    else {
        return g;
    }
};

exports.kurtosis = function kurtosis(values, unbiased) {
    if (typeof(unbiased) === 'undefined') unbiased = true;
    var theMean = exports.mean(values);
    var n = values.length, s2 = 0, s4 = 0;

    for (var i = 0; i < n; i++) {
        var dev = values[i] - theMean;
        s2 += dev * dev;
        s4 += dev * dev * dev * dev;
    }
    var m2 = s2 / n;
    var m4 = s4 / n;

    if (unbiased) {
        var v = s2 / (n - 1);
        var a = (n * (n + 1)) / ((n - 1) * (n - 2) * (n - 3));
        var b = s4 / (v * v);
        var c = ((n - 1) * (n - 1)) / ((n - 2) * (n - 3));

        return a * b - 3 * c;
    }
    else {
        return m4 / (m2 * m2) - 3;
    }
};

exports.entropy = function entropy(values, eps) {
    if (typeof(eps) === 'undefined') eps = 0;
    var sum = 0, l = values.length;
    for (var i = 0; i < l; i++)
        sum += values[i] * Math.log(values[i] + eps);
    return -sum;
};

exports.weightedMean = function weightedMean(values, weights) {
    var sum = 0, l = values.length;
    for (var i = 0; i < l; i++)
        sum += values[i] * weights[i];
    return sum;
};

exports.weightedStandardDeviation = function weightedStandardDeviation(values, weights) {
    return Math.sqrt(exports.weightedVariance(values, weights));
};

exports.weightedVariance = function weightedVariance(values, weights) {
    var theMean = exports.weightedMean(values, weights);
    var vari = 0, l = values.length;
    var a = 0, b = 0;

    for (var i = 0; i < l; i++) {
        var z = values[i] - theMean;
        var w = weights[i];

        vari += w * (z * z);
        b += w;
        a += w * w;
    }

    return vari * (b / (b * b - a));
};

exports.center = function center(values, inPlace) {
    if (typeof(inPlace) === 'undefined') inPlace = false;

    var result = values;
    if (!inPlace)
        result = values.slice();

    var theMean = exports.mean(result), l = result.length;
    for (var i = 0; i < l; i++)
        result[i] -= theMean;
};

exports.standardize = function standardize(values, standardDev, inPlace) {
    if (typeof(standardDev) === 'undefined') standardDev = exports.standardDeviation(values);
    if (typeof(inPlace) === 'undefined') inPlace = false;
    var l = values.length;
    var result = inPlace ? values : new Array(l);
    for (var i = 0; i < l; i++)
        result[i] = values[i] / standardDev;
    return result;
};

exports.cumulativeSum = function cumulativeSum(array) {
    var l = array.length;
    var result = new Array(l);
    result[0] = array[0];
    for (var i = 1; i < l; i++)
        result[i] = result[i - 1] + array[i];
    return result;
};


/***/ }),
/* 42 */
/***/ (function(module, exports) {

function NodeSquare(x, y, weights, som) {
    this.x = x;
    this.y = y;
    this.weights = weights;
    this.som = som;
    this.neighbors = {};
}

NodeSquare.prototype.adjustWeights = function adjustWeights(target, learningRate, influence) {
    for (var i = 0, ii = this.weights.length; i < ii; i++) {
        this.weights[i] += learningRate * influence * (target[i] - this.weights[i]);
    }
};

NodeSquare.prototype.getDistance = function getDistance(otherNode) {
    return Math.max(Math.abs(this.x - otherNode.x), Math.abs(this.y - otherNode.y));
};

NodeSquare.prototype.getDistanceTorus = function getDistanceTorus(otherNode) {
    var distX = Math.abs(this.x - otherNode.x),
        distY = Math.abs(this.y - otherNode.y);
    return Math.max(Math.min(distX, this.som.gridDim.x - distX), Math.min(distY, this.som.gridDim.y - distY));
};

NodeSquare.prototype.getNeighbors = function getNeighbors(xy) {
    if (!this.neighbors[xy]) {
        this.neighbors[xy] = new Array(2);

        // left or bottom neighbor
        var v;
        if (this[xy] > 0) {
            v = this[xy] - 1;
        } else if (this.som.torus) {
            v = this.som.gridDim[xy] - 1
        }
        if (typeof v !== 'undefined') {
            var x, y;
            if (xy === 'x') {
                x = v;
                y = this.y;
            } else {
                x = this.x;
                y = v;
            }
            this.neighbors[xy][0] = this.som.nodes[x][y];
        }

        // top or right neighbor
        var w;
        if (this[xy] < (this.som.gridDim[xy] - 1)) {
            w = this[xy] + 1;
        } else if (this.som.torus) {
            w = 0;
        }
        if (typeof w !== 'undefined') {
            if (xy === 'x') {
                x = w;
                y = this.y;
            } else {
                x = this.x;
                y = w;
            }
            this.neighbors[xy][1] = this.som.nodes[x][y];
        }
    }
    return this.neighbors[xy];
};

NodeSquare.prototype.getPos = function getPos(xy, element) {
    var neighbors = this.getNeighbors(xy),
        distance = this.som.distance,
        bestNeighbor,
        direction;
    if(neighbors[0]) {
        if (neighbors[1]) {
            var dist1 = distance(element, neighbors[0].weights),
                dist2 = distance(element, neighbors[1].weights);
            if(dist1 < dist2) {
                bestNeighbor = neighbors[0];
                direction = -1;
            } else {
                bestNeighbor = neighbors[1];
                direction = 1;
            }
        } else {
            bestNeighbor = neighbors[0];
            direction = -1;
        }
    } else {
        bestNeighbor = neighbors[1];
        direction = 1;
    }
    var simA = 1 - distance(element, this.weights),
        simB = 1 - distance(element, bestNeighbor.weights);
    var factor = ((simA - simB) / (2 - simA - simB));
    return 0.5 + 0.5 * factor * direction;
};

NodeSquare.prototype.getPosition = function getPosition(element) {
    return [
        this.getPos('x', element),
        this.getPos('y', element)
    ];
};

module.exports = NodeSquare;

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var eightBits = __webpack_require__(68);

/**
 * Count the number of true values in an array
 * @param {Array} arr
 * @return {number}
 */
function count(arr) {
    var c = 0;
    for (var i = 0; i < arr.length; i++) {
        c += eightBits[arr[i] & 0xff] + eightBits[(arr[i] >> 8) & 0xff] + eightBits[(arr[i] >> 16) & 0xff] + eightBits[(arr[i] >> 24) & 0xff];
    }
    return c;
}

/**
 * Logical AND operation
 * @param {Array} arr1
 * @param {Array} arr2
 * @return {Array}
 */
function and(arr1, arr2) {
    var ans = new Array(arr1.length);
    for (var i = 0; i < arr1.length; i++)
        ans[i] = arr1[i] & arr2[i];
    return ans;
}

/**
 * Logical OR operation
 * @param {Array} arr1
 * @param {Array} arr2
 * @return {Array}
 */
function or(arr1, arr2) {
    var ans = new Array(arr1.length);
    for (var i = 0; i < arr1.length; i++)
        ans[i] = arr1[i] | arr2[i];
    return ans;
}

/**
 * Logical XOR operation
 * @param {Array} arr1
 * @param {Array} arr2
 * @return {Array}
 */
function xor(arr1, arr2) {
    var ans = new Array(arr1.length);
    for (var i = 0; i < arr1.length; i++)
        ans[i] = arr1[i] ^ arr2[i];
    return ans;
}

/**
 * Logical NOT operation
 * @param {Array} arr
 * @return {Array}
 */
function not(arr) {
    var ans = new Array(arr.length);
    for (var i = 0; i < ans.length; i++)
        ans[i] = ~arr[i];
    return ans;
}

/**
 * Gets the n value of array arr
 * @param {Array} arr
 * @param {number} n
 * @return {boolean}
 */
function getBit(arr, n) {
    var index = n >> 5; // Same as Math.floor(n/32)
    var mask = 1 << (31 - n % 32);
    return Boolean(arr[index] & mask);
}

/**
 * Sets the n value of array arr to the value val
 * @param {Array} arr
 * @param {number} n
 * @param {boolean} val
 * @return {Array}
 */
function setBit(arr, n, val) {
    var index = n >> 5; // Same as Math.floor(n/32)
    var mask = 1 << (31 - n % 32);
    if (val)
        arr[index] = mask | arr[index];
    else
        arr[index] = ~mask & arr[index];
    return arr;
}

/**
 * Translates an array of numbers to a string of bits
 * @param {Array} arr
 * @returns {string}
 */
function toBinaryString(arr) {
    var str = '';
    for (var i = 0; i < arr.length; i++) {
        var obj = (arr[i] >>> 0).toString(2);
        str += '00000000000000000000000000000000'.substr(obj.length) + obj;
    }
    return str;
}

/**
 * Creates an array of numbers based on a string of bits
 * @param {string} str
 * @returns {Array}
 */
function parseBinaryString(str) {
    var len = str.length / 32;
    var ans = new Array(len);
    for (var i = 0; i < len; i++) {
        ans[i] = parseInt(str.substr(i*32, 32), 2) | 0;
    }
    return ans;
}

/**
 * Translates an array of numbers to a hex string
 * @param {Array} arr
 * @returns {string}
 */
function toHexString(arr) {
    var str = '';
    for (var i = 0; i < arr.length; i++) {
        var obj = (arr[i] >>> 0).toString(16);
        str += '00000000'.substr(obj.length) + obj;
    }
    return str;
}

/**
 * Creates an array of numbers based on a hex string
 * @param {string} str
 * @returns {Array}
 */
function parseHexString(str) {
    var len = str.length / 8;
    var ans = new Array(len);
    for (var i = 0; i < len; i++) {
        ans[i] = parseInt(str.substr(i*8, 8), 16) | 0;
    }
    return ans;
}

/**
 * Creates a human readable string of the array
 * @param {Array} arr
 * @returns {string}
 */
function toDebug(arr) {
    var binary = toBinaryString(arr);
    var str = '';
    for (var i = 0; i < arr.length; i++) {
        str += '0000'.substr((i * 32).toString(16).length) + (i * 32).toString(16) + ':';
        for (var j = 0; j < 32; j += 4) {
            str += ' ' + binary.substr(i * 32 + j, 4);
        }
        if (i < arr.length - 1) str += '\n';
    }
    return str
}

module.exports = {
    count: count,
    and: and,
    or: or,
    xor: xor,
    not: not,
    getBit: getBit,
    setBit: setBit,
    toBinaryString: toBinaryString,
    parseBinaryString: parseBinaryString,
    toHexString: toHexString,
    parseHexString: parseHexString,
    toDebug: toDebug
};


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const ConfusionMatrix = __webpack_require__(70);

const CV = {};
const combinations = __webpack_require__(69);

/**
 * Performs a leave-one-out cross-validation (LOO-CV) of the given samples. In LOO-CV, 1 observation is used as the validation
 * set while the rest is used as the training set. This is repeated once for each observation. LOO-CV is a special case
 * of LPO-CV. @see leavePout
 * @param {constructor} Classifier - The classifier to use for the cross validation. Expect ml-classifier api.
 * @param {Array} features - The features for all samples of the data-set
 * @param {Array} labels - The classification class of all samples of the data-set
 * @param {Object} classifierOptions - The classifier options with which the classifier should be instantiated.
 * @returns {ConfusionMatrix} - The cross-validation confusion matrix
 */
CV.leaveOneOut = function (Classifier, features, labels, classifierOptions) {
    return CV.leavePOut(Classifier, features, labels, classifierOptions, 1);
};


/**
 * Performs a leave-p-out cross-validation (LPO-CV) of the given samples. In LPO-CV, p observations are used as the
 * validation set while the rest is used as the training set. This is repeated as many times as there are possible
 * ways to combine p observations from the set (unordered without replacement). Be aware that for relatively small
 * data-set size this can require a very large number of training and testing to do!
 * @param Classifier - The classifier to use for the cross validation. Expect ml-classifier api.
 * @param {Array} features - The features for all samples of the data-set
 * @param {Array} labels - The classification class of all samples of the data-set
 * @param {Object} classifierOptions - The classifier options with which the classifier should be instantiated.
 * @param {Number} p - The size of the validation sub-samples' set
 * @returns {ConfusionMatrix} - The cross-validation confusion matrix
 */
CV.leavePOut = function (Classifier, features, labels, classifierOptions, p) {
    check(features, labels);
    const distinct = getDistinct(labels);
    const confusionMatrix = initMatrix(distinct.length, distinct.length);
    var i, N = features.length;
    var gen = combinations(p, N);
    var allIdx = new Array(N);
    for (i = 0; i < N; i++) {
        allIdx[i] = i;
    }
    for (const testIdx of gen) {
        var trainIdx = allIdx.slice();

        for (i = testIdx.length - 1; i >= 0; i--) {
            trainIdx.splice(testIdx[i], 1);
        }

        validate(Classifier, features, labels, classifierOptions, testIdx, trainIdx, confusionMatrix, distinct);
    }

    return new ConfusionMatrix(confusionMatrix, distinct);
};

/**
 * Performs k-fold cross-validation (KF-CV). KF-CV separates the data-set into k random equally sized partitions, and
 * uses each as a validation set, with all other partitions used in the training set. Observations left over from if k
 * does not divide the number of observations are left out of the cross-validation process.
 * @param Classifier - The classifier to use for the cross validation. Expect ml-classifier api.
 * @param {Array} features - The features for all samples of the data-set
 * @param {Array} labels - The classification class of all samples of the data-set
 * @param {Object} classifierOptions - The classifier options with which the classifier should be instantiated.
 * @param {Number} k - The number of partitions to create
 * @returns {ConfusionMatrix} - The cross-validation confusion matrix
 */
CV.kFold = function (Classifier, features, labels, classifierOptions, k) {
    check(features, labels);
    const distinct = getDistinct(labels);
    const confusionMatrix = initMatrix(distinct.length, distinct.length);
    var N = features.length;
    var allIdx = new Array(N);
    for (var i = 0; i < N; i++) {
        allIdx[i] = i;
    }

    var l = Math.floor(N / k);
    // create random k-folds
    var current = [];
    var folds = [];
    while (allIdx.length) {
        var randi = Math.floor(Math.random() * allIdx.length);
        current.push(allIdx[randi]);
        allIdx.splice(randi, 1);
        if (current.length === l) {
            folds.push(current);
            current = [];
        }
    }
    if (current.length) folds.push(current);
    folds = folds.slice(0, k);


    for (i = 0; i < folds.length; i++) {
        var testIdx = folds[i];
        var trainIdx = [];
        for (var j = 0; j < folds.length; j++) {
            if (j !== i) trainIdx = trainIdx.concat(folds[j]);
        }

        validate(Classifier, features, labels, classifierOptions, testIdx, trainIdx, confusionMatrix, distinct);
    }

    return new ConfusionMatrix(confusionMatrix, distinct);
};

function check(features, labels) {
    if (features.length !== labels.length) {
        throw new Error('features and labels should have the same length');
    }
}

function initMatrix(rows, columns) {
    return new Array(rows).fill(0).map(() => new Array(columns).fill(0));
}

function getDistinct(arr) {
    var s = new Set();
    for (let i = 0; i < arr.length; i++) {
        s.add(arr[i]);
    }
    return Array.from(s);
}

function validate(Classifier, features, labels, classifierOptions, testIdx, trainIdx, confusionMatrix, distinct) {
    var testFeatures = testIdx.map(function (index) {
        return features[index];
    });
    var trainFeatures = trainIdx.map(function (index) {
        return features[index];
    });
    var testLabels = testIdx.map(function (index) {
        return labels[index];
    });
    var trainLabels = trainIdx.map(function (index) {
        return labels[index];
    });

    var classifier = new Classifier(classifierOptions);
    classifier.train(trainFeatures, trainLabels);
    var predictedLabels = classifier.predict(testFeatures);
    for (var i = 0; i < predictedLabels.length; i++) {
        confusionMatrix[distinct.indexOf(testLabels[i])][distinct.indexOf(predictedLabels[i])]++;
    }
}

module.exports = CV;


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



/**
 * Computes a distance/similarity matrix given an array of data and a distance/similarity function.
 * @param {Array} data An array of data
 * @param {function} distanceFn  A function that accepts two arguments and computes a distance/similarity between them
 * @return {Array<Array>} The similarity matrix. The similarity matrix is square and has a size equal to the length of
 * the data array
 */
function distanceMatrix(data, distanceFn) {
    const length = data.length;
    let result = Array.from({length}).map(() => Array.from({length}));

    // Compute upper distance matrix
    for (let i = 0; i < length; i++) {
        for (let j = 0; j <= i; j++) {
            result[i][j] = distanceFn(data[i], data[j]);
        }
    }

    // Copy to lower distance matrix
    for (let i = 0; i < length; i++) {
        for (let j = i + 1; j < length; j++) {
            result[i][j] = result[j][i];
        }
    }

    return result;
}

module.exports = distanceMatrix;


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const Matrix = __webpack_require__(0);

const Layer = __webpack_require__(32);
const OutputLayer = __webpack_require__(116);
const Utils = __webpack_require__(34);
const ACTIVATION_FUNCTIONS = __webpack_require__(33);

class FeedForwardNeuralNetworks {

    /**
     * Create a new Feedforword neural network model.
     * @param {object} options
     * @param {Array} [options.hiddenLayers=[10]] - Array that contains the sizes of the hidden layers.
     * @oaram {number} [options.iterations=50] - Number of iterations at the training step.
     * @param {number} [options.learningRate=0.01] - Learning rate of the neural net (also known as epsilon).
     * @poram {number} [options.regularization=0.01] - Regularization parameter af the neural net.
     * @poram {string} [options.activation='tanh'] - activation function to be used. (options: 'tanh'(default),
     * 'identity', 'logistic', 'arctan', 'softsign', 'relu', 'softplus', 'bent', 'sinusoid', 'sinc', 'gaussian').
     * (single-parametric options: 'parametric-relu', 'exponential-relu', 'soft-exponential').
     * @param {number} [options.activationParam=1] - if the selected activation function needs a parameter.
     */
    constructor(options) {
        options = options || {};
        if (options.model) {
            // load network
            this.hiddenLayers = options.hiddenLayers;
            this.iterations = options.iterations;
            this.learningRate = options.learningRate;
            this.regularization = options.regularization;
            this.dicts = options.dicts;
            this.activation = options.activation;
            this.activationParam = options.activationParam;
            this.model = new Array(options.layers.length);

            for (var i = 0; i < this.model.length - 1; ++i) {
                this.model[i] = Layer.load(options.layers[i]);
            }
            this.model[this.model.length - 1] = OutputLayer.load(options.layers[this.model.length - 1]);
        } else {
            // default constructor
            this.hiddenLayers = options.hiddenLayers === undefined ? [10] : options.hiddenLayers;
            this.iterations = options.iterations === undefined ? 50 : options.iterations;

            this.learningRate = options.learningRate === undefined ? 0.01 : options.learningRate;
            //this.momentum = options.momentum === undefined ? 0.1 : options.momentum;
            this.regularization = options.regularization === undefined ? 0.01 : options.regularization;

            this.activation = options.activation === undefined ? 'tanh' : options.activation;
            this.activationParam = options.activationParam === undefined ? 1 : options.activationParam;
            if (!(this.activation in Object.keys(ACTIVATION_FUNCTIONS))) {
                this.activation = 'tanh';
            }
        }
    }

    /**
     * Function that build and initialize the neural net.
     * @param {number} inputSize - total of features to fit.
     * @param {number} outputSize - total of labels of the prediction set.
     */
    buildNetwork(inputSize, outputSize) {
        var size = 2 + (this.hiddenLayers.length - 1);
        this.model = new Array(size);

        // input layer
        this.model[0] = new Layer({
            inputSize: inputSize,
            outputSize: this.hiddenLayers[0],
            activation: this.activation,
            activationParam: this.activationParam,
            regularization: this.regularization,
            epsilon: this.learningRate
        });

        // hidden layers
        for (var i = 1; i < this.hiddenLayers.length; ++i) {
            this.model[i] = new Layer({
                inputSize: this.hiddenLayers[i - 1],
                outputSize: this.hiddenLayers[i],
                activation: this.activation,
                activationParam: this.activationParam,
                regularization: this.regularization,
                epsilon: this.learningRate
            });
        }

        // output layer
        this.model[size - 1] = new OutputLayer({
            inputSize: this.hiddenLayers[this.hiddenLayers.length - 1],
            outputSize: outputSize,
            activation: this.activation,
            activationParam: this.activationParam,
            regularization: this.regularization,
            epsilon: this.learningRate
        });
    }

    /**
     * Train the neural net with the given features and labels.
     * @param {Matrix|Array} features
     * @param {Matrix|Array} labels
     */
    train(features, labels) {
        features = Matrix.checkMatrix(features);
        this.dicts = Utils.dictOutputs(labels);

        var inputSize = features.columns;
        var outputSize = Object.keys(this.dicts.inputs).length;

        this.buildNetwork(inputSize, outputSize);

        for (var i = 0; i < this.iterations; ++i) {
            var probabilities = this.propagate(features);
            this.backpropagation(features, labels, probabilities);
        }
    }

    /**
     * Propagate the input(training set) and retrives the probabilities of each class.
     * @param {Matrix} X
     * @return {Matrix} probabilities of each class.
     */
    propagate(X) {
        var input = X;
        for (var i = 0; i < this.model.length; ++i) {
            //console.log(i);
            input = this.model[i].forward(input);
        }

        // get probabilities
        return input.divColumnVector(Utils.sumRow(input));
    }

    /**
     * Function that applies the backpropagation algorithm on each layer of the network
     * in order to fit the features and labels.
     * @param {Matrix} features
     * @param {Array} labels
     * @param {Matrix} probabilities - probabilities of each class of the feature set.
     */
    backpropagation(features, labels, probabilities) {
        for (var i = 0; i < probabilities.length; ++i) {
            probabilities[i][this.dicts.inputs[labels[i]]] -= 1;
        }

        // remember, the last delta doesn't matter
        var delta = probabilities;
        for (i = this.model.length - 1; i >= 0; --i) {
            var a = i > 0 ? this.model[i - 1].a : features;
            delta = this.model[i].backpropagation(delta, a);
        }

        for (i = 0; i < this.model.length; ++i) {
            this.model[i].update();
        }
    }

    /**
     * Predict the output given the feature set.
     * @param {Array|Matrix} features
     * @return {Array}
     */
    predict(features) {
        features = Matrix.checkMatrix(features);
        var outputs = new Array(features.rows);
        var probabilities = this.propagate(features);
        for (var i = 0; i < features.rows; ++i) {
            outputs[i] = this.dicts.outputs[probabilities.maxRowIndex(i)[1]];
        }

        return outputs;
    }

    /**
     * Export the current model to JSOM.
     * @return {object} model
     */
    toJSON() {
        var model = {
            model: 'FNN',
            hiddenLayers: this.hiddenLayers,
            iterations: this.iterations,
            learningRate: this.learningRate,
            regularization: this.regularization,
            activation: this.activation,
            activationParam: this.activationParam,
            dicts: this.dicts,
            layers: new Array(this.model.length)
        };

        for (var i = 0; i < this.model.length; ++i) {
            model.layers[i] = this.model[i].toJSON();
        }

        return model;
    }

    /**
     * Load a Feedforward Neural Network with the current model.
     * @param {object} model
     * @return {FeedForwardNeuralNetworks}
     */
    static load(model) {
        if (model.model !== 'FNN') {
            throw new RangeError('the current model is not a feed forward network');
        }

        return new FeedForwardNeuralNetworks(model);
    }
}

module.exports = FeedForwardNeuralNetworks;


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

exports.agnes = __webpack_require__(118);
exports.diana = __webpack_require__(119);
//exports.birch = require('./birch');
//exports.cure = require('./cure');
//exports.chameleon = require('./chameleon');


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const utils = __webpack_require__(36);
const init = __webpack_require__(131);
const KMeansResult = __webpack_require__(130);
const squaredDistance = __webpack_require__(1).squared;

const defaultOptions = {
    maxIterations: 100,
    tolerance: 1e-6,
    withIterations: false,
    initialization: 'mostDistant',
    distanceFunction: squaredDistance
};

/**
 * Each step operation for kmeans
 * @ignore
 * @param {Array<Array<Number>>} centers - the K centers in format [x,y,z,...]
 * @param {Array<Array<Number>>} data - the [x,y,z,...] points to cluster
 * @param {Array<Number>} clusterID - the cluster identifier for each data dot
 * @param {Number} K - Number of clusters
 * @param {Object} [options] - Option object
 * @param {Number} iterations - Current number of iterations
 * @return {KMeansResult}
 */
function step(centers, data, clusterID, K, options, iterations) {
    clusterID = utils.updateClusterID(data, centers, clusterID, options.distanceFunction);
    var newCenters = utils.updateCenters(data, clusterID, K);
    var converged = utils.converged(newCenters, centers, options.distanceFunction, options.tolerance);
    return new KMeansResult(clusterID, newCenters, converged, iterations, options.distanceFunction);
}

/**
 * Generator version for the algorithm
 * @ignore
 * @param {Array<Array<Number>>} centers - the K centers in format [x,y,z,...]
 * @param {Array<Array<Number>>} data - the [x,y,z,...] points to cluster
 * @param {Array<Number>} clusterID - the cluster identifier for each data dot
 * @param {Number} K - Number of clusters
 * @param {Object} [options] - Option object
 */
function* kmeansGenerator(centers, data, clusterID, K, options) {
    var converged = false;
    var stepNumber = 0;
    var stepResult;
    while (!converged && (stepNumber < options.maxIterations)) {
        stepResult = step(centers, data, clusterID, K, options, ++stepNumber);
        yield stepResult.computeInformation(data);
        converged = stepResult.converged;
        centers = stepResult.centroids;
    }
}

/**
 * K-means algorithm
 * @param {Array<Array<Number>>} data - Points in the format to cluster [x,y,z,...]
 * @param {Number} K - Number of clusters
 * @param {Object} [options] - Option object
 * @param {Number} [options.maxIterations = 100] - Maximum of iterations allowed
 * @param {Number} [options.tolerance = 1e-6] - Error tolerance
 * @param {Boolean} [options.withIterations = false] - Store clusters and centroids for each iteration
 * @param {Function} [options.distanceFunction = squaredDistance] - Distance function to use between the points
 * @param {String|Array<Array<Number>>} [options.initialization = 'moreDistant'] - K centers in format [x,y,z,...] or a method for initialize the data:
 *  * `'random'` will choose K random different values.
 *  * `'mostDistant'` will choose the more distant points to a first random pick
 * @returns {KMeansResult} - Cluster identifier for each data dot and centroids with the following fields:
 *  * `'clusters'`: Array of indexes for the clusters.
 *  * `'centroids'`: Array with the resulting centroids.
 *  * `'iterations'`: Number of iterations that took to converge
 */
function kmeans(data, K, options) {
    options = Object.assign({}, defaultOptions, options);

    if (K <= 0 || K > data.length || !Number.isInteger(K)) {
        throw new Error('K should be a positive integer bigger than the number of points');
    }

    var centers;
    if (Array.isArray(options.initialization)) {
        if (options.initialization.length !== K) {
            throw new Error('The initial centers should have the same length as K');
        } else {
            centers = options.initialization;
        }
    } else {
        switch (options.initialization) {
            case 'random':
                centers = init.random(data, K);
                break;
            case 'mostDistant':
                centers = init.mostDistant(data, K, utils.calculateDistanceMatrix(data, options.distanceFunction));
                break;
            default:
                throw new Error('Unknown initialization method: "' + options.initialization + '"');
        }
    }

    // infinite loop until convergence
    if (options.maxIterations === 0) {
        options.maxIterations = Number.MAX_VALUE;
    }

    var clusterID = new Array(data.length);
    if (options.withIterations) {
        return kmeansGenerator(centers, data, clusterID, K, options);
    } else {
        var converged = false;
        var stepNumber = 0;
        var stepResult;
        while (!converged && (stepNumber < options.maxIterations)) {
            stepResult = step(centers, data, clusterID, K, options, ++stepNumber);
            converged = stepResult.converged;
            centers = stepResult.centroids;
        }
        return stepResult.computeInformation(data);
    }
}

module.exports = kmeans;


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(133);

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = exports = __webpack_require__(39).NaiveBayes;
exports.separateClasses = __webpack_require__(39).separateClasses;


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var LM = __webpack_require__(17);
var math = LM.Matrix.algebra;
var Matrix = __webpack_require__(0);

/**
 * This function calculates the spectrum as a sum of lorentzian functions. The Lorentzian
 * parameters are divided in 3 batches. 1st: centers; 2nd: heights; 3th: widths;
 * @param t Ordinate values
 * @param p Lorentzian parameters
 * @param c Constant parameters(Not used)
 * @returns {*}
 */
function sumOfLorentzians(t,p,c){
    var nL = p.length/3,factor,i, j,p2, cols = t.rows;
    var result = Matrix.zeros(t.length,1);

    for(i=0;i<nL;i++){
        p2 = Math.pow(p[i+nL*2][0]/2,2);
        factor = p[i+nL][0]*p2;
        for(j=0;j<cols;j++){
            result[j][0]+=factor/(Math.pow(t[j][0]-p[i][0],2)+p2);
        }
    }
    return result;
}

/**
 * This function calculates the spectrum as a sum of gaussian functions. The Gaussian
 * parameters are divided in 3 batches. 1st: centers; 2nd: height; 3th: std's;
 * @param t Ordinate values
 * @param p Gaussian parameters
 * @param c Constant parameters(Not used)
 * @returns {*}
 */
function sumOfGaussians(t,p,c){
    var nL = p.length/3,factor,i, j, cols = t.rows;
    var result = Matrix.zeros(t.length,1);

    for(i=0;i<nL;i++){
        factor = p[i+nL*2][0]*p[i+nL*2][0]/2;
        for(j=0;j<cols;j++){
            result[j][0]+=p[i+nL][0]*Math.exp(-(t[i][0]-p[i][0])*(t[i][0]-p[i][0])/factor);
        }
    }
    return result;
}
/**
 * Single 4 parameter lorentzian function
 * @param t Ordinate values
 * @param p Lorentzian parameters
 * @param c Constant parameters(Not used)
 * @returns {*}
 */
function singleLorentzian(t,p,c){
    var factor = p[1][0]*Math.pow(p[2][0]/2,2);
    var rows = t.rows;
    var result = new Matrix(t.rows, t.columns);
    for(var i=0;i<rows;i++){
        result[i][0]=factor/(Math.pow(t[i][0]-p[0][0],2)+Math.pow(p[2][0]/2,2));
    }
    return result;
}

/**
 * Single 3 parameter gaussian function
 * @param t Ordinate values
 * @param p Gaussian parameters [mean, height, std]
 * @param c Constant parameters(Not used)
 * @returns {*}
 */
function singleGaussian(t,p,c){
    var factor2 = p[2][0]*p[2][0]/2;
    var rows = t.rows;
    var result = new Matrix(t.rows, t.columns);
    for(var i=0;i<rows;i++){
        result[i][0]=p[1][0]*Math.exp(-(t[i][0]-p[0][0])*(t[i][0]-p[0][0])/factor2);
    }
    return result;
}

/**
 * * Fits a set of points to a Lorentzian function. Returns the center of the peak, the width at half height, and the height of the signal.
 * @param data,[y]
 * @returns {*[]}
 */
function optimizeSingleLorentzian(xy, peak, opts) {
    opts = opts || {};
    var xy2 = parseData(xy, opts.percentage||0);

    if(xy2===null||xy2[0].rows<3){
        return null; //Cannot run an optimization with less than 3 points
    }

    var t = xy2[0];
    var y_data = xy2[1];
    var maxY = xy2[2];
    var nbPoints = t.rows, i;

    var weight = [nbPoints / Math.sqrt(y_data.dot(y_data))];

    var opts=Object.create(opts.LMOptions || [  3,    100, 1e-3, 1e-3, 1e-3, 1e-2, 1e-2,    11,    9,        1 ]);
    //var opts = [  3,    100, 1e-3, 1e-3, 1e-3, 1e-2, 1e-2,    11,    9,        1 ];
    var consts = [ ];
    var dt = Math.abs(t[0][0]-t[1][0]);// optional vector of constants
    var dx = new Matrix([[-dt/10000],[-1e-3],[-dt/10000]]);//-Math.abs(t[0][0]-t[1][0])/100;
    var p_init = new Matrix([[peak.x],[1],[peak.width]]);
    var p_min = new Matrix([[peak.x-dt],[0.75],[peak.width/4]]);
    var p_max = new Matrix([[peak.x+dt],[1.25],[peak.width*4]]);

    var p_fit = LM.optimize(singleLorentzian,p_init,t,y_data,weight,dx,p_min,p_max,consts,opts);


    p_fit = p_fit.p;
    return [p_fit[0],[p_fit[1][0]*maxY],p_fit[2]];

}

/**
 * Fits a set of points to a gaussian bell. Returns the mean of the peak, the std and the height of the signal.
 * @param data,[y]
 * @returns {*[]}
 */
function optimizeSingleGaussian(xy, peak, opts) {
    opts = opts || {};
    var xy2 = parseData(xy, opts.percentage||0);

    if(xy2===null||xy2[0].rows<3){
        return null; //Cannot run an optimization with less than 3 points
    }

    var t = xy2[0];
    var y_data = xy2[1];
    var maxY = xy2[2];

    var nbPoints = t.rows, i;



    var weight = [nbPoints / Math.sqrt(y_data.dot(y_data))];

    var opts=Object.create(opts.LMOptions || [  3,    100, 1e-3, 1e-3, 1e-3, 1e-2, 1e-2,    11,    9,        1 ]);
    //var opts = [  3,    100, 1e-3, 1e-3, 1e-3, 1e-2, 1e-2,    11,    9,        1 ];
    var consts = [ ];                         // optional vector of constants
    var dt = Math.abs(t[0][0]-t[1][0]);
    var dx = new Matrix([[-dt/10000],[-1e-3],[-dt/10000]]);//-Math.abs(t[0][0]-t[1][0])/100;

    var dx = new Matrix([[-Math.abs(t[0][0]-t[1][0])/1000],[-1e-3],[-peak.width/1000]]);
    var p_init = new Matrix([[peak.x],[1],[peak.width]]);
    var p_min = new Matrix([[peak.x-dt],[0.75],[peak.width/4]]);
    var p_max = new Matrix([[peak.x+dt],[1.25],[peak.width*4]]);
    //var p_min = new Matrix([[peak.x-peak.width/4],[0.75],[peak.width/3]]);
    //var p_max = new Matrix([[peak.x+peak.width/4],[1.25],[peak.width*3]]);

    var p_fit = LM.optimize(singleGaussian,p_init,t,y_data,weight,dx,p_min,p_max,consts,opts);
    p_fit = p_fit.p;
    return [p_fit[0],[p_fit[1][0]*maxY],p_fit[2]];
}

/*
 peaks on group should sorted
 */
function optimizeLorentzianTrain(xy, group, opts){
    var xy2 = parseData(xy);
    //console.log(xy2[0].rows);
    if(xy2===null||xy2[0].rows<3){
        return null; //Cannot run an optimization with less than 3 points
    }

    var t = xy2[0];
    var y_data = xy2[1];
    var maxY = xy2[2];
    var currentIndex = 0;
    var nbPoints = t.length;
    var nextX;
    var tI, yI, maxY;
    var result=[], current;
    for(var i=0; i<group.length;i++){
        nextX = group[i].x-group[i].width*1.5;
        //console.log(group[i]);
        while(t[currentIndex++]<nextX&&currentIndex<nbPoints);
        nextX = group[i].x+group[i].width*1.5;
        tI = [];
        yI = [];
        while(t[currentIndex]<=nextX&&currentIndex<nbPoints){
            tI.push(t[currentIndex][0]);
            yI.push(y_data[currentIndex][0]*maxY);
            currentIndex++;
        }

        current=optimizeSingleLorentzian([tI, yI], group[i], opts);
        if(current){
            result.push({"x":current[0][0],"y":current[1][0],"width":current[2][0],"opt":true});
        }
        else{
            result.push({"x":group[i].x,"y":group[i].y,"width":group[i].width,"opt":false});
        }
    }

    return result;

}

function optimizeGaussianTrain(xy, group, opts){
    var xy2 = parseData(xy);
    //console.log(xy2[0].rows);
    if(xy2===null||xy2[0].rows<3){
        return null; //Cannot run an optimization with less than 3 points
    }

    var t = xy2[0];
    var y_data = xy2[1];
    var maxY = xy2[2];
    var currentIndex = 0;
    var nbPoints = t.length;
    var nextX;
    var tI, yI, maxY;
    var result=[], current;
    for(var i=0; i<group.length;i++){
        nextX = group[i].x-group[i].width*1.5;
        //console.log(group[i]);
        while(t[currentIndex++]<nextX&&currentIndex<nbPoints);
        nextX = group[i].x+group[i].width*1.5;
        tI = [];
        yI = [];
        while(t[currentIndex]<=nextX&&currentIndex<nbPoints){
            tI.push(t[currentIndex][0]);
            yI.push(y_data[currentIndex][0]*maxY);
            currentIndex++;
        }

        current=optimizeSingleGaussian([tI, yI], group[i], opts);
        if(current){
            result.push({"x":current[0][0],"y":current[1][0],"width":current[2][0],"opt":true});
        }
        else{
            result.push({"x":group[i].x,"y":group[i].y,"width":group[i].width,"opt":false});
        }
    }

    return result;
}



/**
 *
 * @param xy A two column matrix containing the x and y data to be fitted
 * @param group A set of initial lorentzian parameters to be optimized [center, heigth, half_width_at_half_height]
 * @returns {Array} A set of final lorentzian parameters [center, heigth, hwhh*2]
 */
function optimizeLorentzianSum(xy, group, opts){
    var xy2 = parseData(xy);

    if(xy2===null||xy2[0].rows<3){
        return null; //Cannot run an optimization with less than 3 points
    }

    var t = xy2[0];
    var y_data = xy2[1];
    var maxY = xy2[2];
    var nbPoints = t.rows, i;

    var weight = [nbPoints / math.sqrt(y_data.dot(y_data))];
    var opts=Object.create(opts || [  3,    100, 1e-3, 1e-3, 1e-3, 1e-2, 1e-2, 11, 9, 1 ]);
    var consts = [ ];// optional vector of constants

    var nL = group.length;
    var p_init = new Matrix(nL*3,1);
    var p_min =  new Matrix(nL*3,1);
    var p_max =  new Matrix(nL*3,1);
    var dx = new Matrix(nL*3,1);
    var dt = Math.abs(t[0][0]-t[1][0]);
    for( i=0;i<nL;i++){
        p_init[i][0] = group[i].x;
        p_init[i+nL][0] = 1;
        p_init[i+2*nL][0] = group[i].width;

        p_min[i][0] = group[i].x-dt;//-group[i].width/4;
        p_min[i+nL][0] = 0;
        p_min[i+2*nL][0] = group[i].width/4;

        p_max[i][0] = group[i].x+dt;//+group[i].width/4;
        p_max[i+nL][0] = 1.5;
        p_max[i+2*nL][0] = group[i].width*4;

        dx[i][0] = -dt/1000;
        dx[i+nL][0] = -1e-3;
        dx[i+2*nL][0] = -dt/1000;
    }

    var dx = -Math.abs(t[0][0]-t[1][0])/10000;
    var p_fit = LM.optimize(sumOfLorentzians, p_init, t, y_data, weight, dx, p_min, p_max, consts, opts);
    p_fit=p_fit.p;
    //Put back the result in the correct format
    var result = new Array(nL);
    for( i=0;i<nL;i++){
        result[i]=[p_fit[i],[p_fit[i+nL][0]*maxY],p_fit[i+2*nL]];
    }

    return result;

}

/**
 *
 * @param xy A two column matrix containing the x and y data to be fitted
 * @param group A set of initial lorentzian parameters to be optimized [center, heigth, half_width_at_half_height]
 * @returns {Array} A set of final lorentzian parameters [center, heigth, hwhh*2]
 */
function optimizeGaussianSum(xy, group, opts){
    var xy2 = parseData(xy);

    if(xy2===null||xy2[0].rows<3){
        return null; //Cannot run an optimization with less than 3 points
    }

    var t = xy2[0];
    var y_data = xy2[1];
    var maxY = xy2[2];
    var nbPoints = t.rows,i;

    var weight = new Matrix(nbPoints,1);//[nbPoints / math.sqrt(y_data.dot(y_data))];
    var k = nbPoints / math.sqrt(y_data.dot(y_data));
    for(i=0;i<nbPoints;i++){
        weight[i][0]=k;///(y_data[i][0]);
        //weight[i][0]=k*(2-y_data[i][0]);
    }

    var opts=Object.create(opts || [  3,    100, 1e-3, 1e-3, 1e-3, 1e-2, 1e-2,    11,    9,        2 ]);
    //var opts=[  3,    100, 1e-5, 1e-6, 1e-6, 1e-6, 1e-6,    11,    9,        1 ];
    var consts = [ ];// optional vector of constants

    var nL = group.length;
    var p_init = new Matrix(nL*3,1);
    var p_min =  new Matrix(nL*3,1);
    var p_max =  new Matrix(nL*3,1);
    var dx = new Matrix(nL*3,1);
    var dt = Math.abs(t[0][0]-t[1][0]);
    for( i=0;i<nL;i++){
        p_init[i][0] = group[i].x;
        p_init[i+nL][0] = group[i].y/maxY;
        p_init[i+2*nL][0] = group[i].width;

        p_min[i][0] = group[i].x-dt;
        p_min[i+nL][0] = group[i].y*0.8/maxY;
        p_min[i+2*nL][0] = group[i].width/2;

        p_max[i][0] = group[i].x+dt;
        p_max[i+nL][0] = group[i].y*1.2/maxY;
        p_max[i+2*nL][0] = group[i].width*2;

        dx[i][0] = -dt/1000;
        dx[i+nL][0] = -1e-3;
        dx[i+2*nL][0] = -dt/1000;
    }
    //console.log(t);
    var p_fit = LM.optimize(sumOfLorentzians,p_init,t,y_data,weight,dx,p_min,p_max,consts,opts);
    p_fit = p_fit.p;
    //Put back the result in the correct format
    var result = new Array(nL);
    for( i=0;i<nL;i++){
        result[i]=[p_fit[i],[p_fit[i+nL][0]*maxY],p_fit[i+2*nL]];
    }

    return result;

}
/**
 *
 * Converts the given input to the required x, y column matrices. y data is normalized to max(y)=1
 * @param xy
 * @returns {*[]}
 */
function parseData(xy, threshold){
    var nbSeries = xy.length;
    var t = null;
    var y_data = null, x,y;
    var maxY = 0, i,j;

    if(nbSeries==2){
        //Looks like row wise matrix [x,y]
        var nbPoints = xy[0].length;
        //if(nbPoints<3)
        //    throw new Exception(nbPoints);
        //else{
        t = new Array(nbPoints);//new Matrix(nbPoints,1);
        y_data = new Array(nbPoints);//new Matrix(nbPoints,1);
        x = xy[0];
        y = xy[1];
        if(typeof x[0] === "number"){
            for(i=0;i<nbPoints;i++){
                t[i]=x[i];
                y_data[i]=y[i];
                if(y[i]>maxY)
                    maxY = y[i];
            }
        }
        else{
            //It is a colum matrix
            if(typeof x[0] === "object"){
                for(i=0;i<nbPoints;i++){
                    t[i]=x[i][0];
                    y_data[i]=y[i][0];
                    if(y[i][0]>maxY)
                        maxY = y[i][0];
                }
            }

        }

        //}
    }
    else{
        //Looks like a column wise matrix [[x],[y]]
        var nbPoints = nbSeries;
        //if(nbPoints<3)
        //    throw new SizeException(nbPoints);
        //else {
        t = new Array(nbPoints);//new Matrix(nbPoints, 1);
        y_data = new Array(nbPoints);//new Matrix(nbPoints, 1);
        for (i = 0; i < nbPoints; i++) {
            t[i] = xy[i][0];
            y_data[i] = xy[i][1];
            if(y_data[i]>maxY)
                maxY = y_data[i];
        }
        //}
    }
    for (i = 0; i < nbPoints; i++) {
        y_data[i]/=maxY;
    }
    if(threshold){
        for (i = nbPoints-1; i >=0; i--) {
            if(y_data[i]<threshold) {
                y_data.splice(i,1);
                t.splice(i,1);
            }
        }
    }
    if(t.length>0)
        return [(new Matrix([t])).transpose(),(new Matrix([y_data])).transpose(),maxY];
    return null;
}

function sizeException(nbPoints) {
    return new RangeError("Not enough points to perform the optimization: "+nbPoints +"< 3");
}

module.exports.optimizeSingleLorentzian = optimizeSingleLorentzian;
module.exports.optimizeLorentzianSum = optimizeLorentzianSum;
module.exports.optimizeSingleGaussian = optimizeSingleGaussian;
module.exports.optimizeGaussianSum = optimizeGaussianSum;
module.exports.singleGaussian = singleGaussian;
module.exports.singleLorentzian = singleLorentzian;
module.exports.optimizeGaussianTrain = optimizeGaussianTrain;
module.exports.optimizeLorentzianTrain = optimizeLorentzianTrain;

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const Matrix = __webpack_require__(0);
const EVD = Matrix.DC.EVD;
const SVD = Matrix.DC.SVD;
const Stat = __webpack_require__(2).matrix;
const mean = Stat.mean;
const stdev = Stat.standardDeviation;

const defaultOptions = {
    isCovarianceMatrix: false,
    center: true,
    scale: false
};

/**
 * Creates new PCA (Principal Component Analysis) from the dataset
 * @param {Matrix} dataset - dataset or covariance matrix
 * @param {Object} options
 * @param {boolean} [options.isCovarianceMatrix=false] - true if the dataset is a covariance matrix
 * @param {boolean} [options.center=true] - should the data be centered (subtract the mean)
 * @param {boolean} [options.scale=false] - should the data be scaled (divide by the standard deviation)
 * */
class PCA {
    constructor(dataset, options) {
        if (dataset === true) {
            const model = options;
            this.center = model.center;
            this.scale = model.scale;
            this.means = model.means;
            this.stdevs = model.stdevs;
            this.U = Matrix.checkMatrix(model.U);
            this.S = model.S;
            return;
        }

        options = Object.assign({}, defaultOptions, options);

        this.center = false;
        this.scale = false;
        this.means = null;
        this.stdevs = null;

        if (options.isCovarianceMatrix) { // user provided a covariance matrix instead of dataset
            this._computeFromCovarianceMatrix(dataset);
            return;
        }

        var useCovarianceMatrix;
        if (typeof options.useCovarianceMatrix === 'boolean') {
            useCovarianceMatrix = options.useCovarianceMatrix;
        } else {
            useCovarianceMatrix = dataset.length > dataset[0].length;
        }

        if (useCovarianceMatrix) { // user provided a dataset but wants us to compute and use the covariance matrix
            dataset = this._adjust(dataset, options);
            const covarianceMatrix = dataset.transposeView().mmul(dataset).div(dataset.rows - 1);
            this._computeFromCovarianceMatrix(covarianceMatrix);
        } else {
            dataset = this._adjust(dataset, options);
            var svd = new SVD(dataset, {
                computeLeftSingularVectors: false,
                computeRightSingularVectors: true,
                autoTranspose: true
            });

            this.U = svd.rightSingularVectors;

            const singularValues = svd.diagonal;
            const eigenvalues = new Array(singularValues.length);
            for (var i = 0; i < singularValues.length; i++) {
                eigenvalues[i] = singularValues[i] * singularValues[i] / (dataset.length - 1);
            }
            this.S = eigenvalues;
        }
    }

    /**
     * Load a PCA model from JSON
     * @param {Object} model
     * @return {PCA}
     */
    static load(model) {
        if (model.name !== 'PCA')
            throw new RangeError('Invalid model: ' + model.name);
        return new PCA(true, model);
    }

    /**
     * Project the dataset into the PCA space
     * @param {Matrix} dataset
     * @return {Matrix} dataset projected in the PCA space
     */
    predict(dataset) {
        dataset = new Matrix(dataset);

        if (this.center) {
            dataset.subRowVector(this.means);
            if (this.scale) {
                dataset.divRowVector(this.stdevs);
            }
        }

        return dataset.mmul(this.U);
    }

    /**
     * Returns the proportion of variance for each component
     * @return {[number]}
     */
    getExplainedVariance() {
        var sum = 0;
        for (var i = 0; i < this.S.length; i++) {
            sum += this.S[i];
        }
        return this.S.map(value => value / sum);
    }

    /**
     * Returns the cumulative proportion of variance
     * @return {[number]}
     */
    getCumulativeVariance() {
        var explained = this.getExplainedVariance();
        for (var i = 1; i < explained.length; i++) {
            explained[i] += explained[i - 1];
        }
        return explained;
    }

    /**
     * Returns the Eigenvectors of the covariance matrix
     * @returns {Matrix}
     */
    getEigenvectors() {
        return this.U;
    }

    /**
     * Returns the Eigenvalues (on the diagonal)
     * @returns {[number]}
     */
    getEigenvalues() {
        return this.S;
    }

    /**
     * Returns the standard deviations of the principal components
     * @returns {[number]}
     */
    getStandardDeviations() {
        return this.S.map(x => Math.sqrt(x));
    }

    /**
     * Returns the loadings matrix
     * @return {Matrix}
     */
    getLoadings() {
        return this.U.transpose();
    }

    /**
     * Export the current model to a JSON object
     * @return {Object} model
     */
    toJSON() {
        return {
            name: 'PCA',
            center: this.center,
            scale: this.scale,
            means: this.means,
            stdevs: this.stdevs,
            U: this.U,
            S: this.S,
        };
    }

    _adjust(dataset, options) {
        this.center = !!options.center;
        this.scale = !!options.scale;

        dataset = new Matrix(dataset);

        if (this.center) {
            const means = mean(dataset);
            const stdevs = this.scale ? stdev(dataset, means, true) : null;
            this.means = means;
            dataset.subRowVector(means);
            if (this.scale) {
                for (var i = 0; i < stdevs.length; i++) {
                    if (stdevs[i] === 0) {
                        throw new RangeError('Cannot scale the dataset (standard deviation is zero at index ' + i);
                    }
                }
                this.stdevs = stdevs;
                dataset.divRowVector(stdevs);
            }
        }

        return dataset;
    }

    _computeFromCovarianceMatrix(dataset) {
        const evd = new EVD(dataset, {assumeSymmetric: true});
        this.U = evd.eigenvectorMatrix;
        for (var i = 0; i < this.U.length; i++) {
            this.U[i].reverse();
        }
        this.S = evd.realEigenvalues.reverse();
    }
}

module.exports = PCA;


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const measures = __webpack_require__(148);

class Performance {
    /**
     *
     * @param prediction - The prediction matrix
     * @param target - The target matrix (values: truthy for same class, falsy for different class)
     * @param options
     *
     * @option    all    True if the entire matrix must be used. False to ignore the diagonal and lower part (default is false, for similarity/distance matrices)
     * @option    max    True if the max value corresponds to a perfect match (like in similarity matrices), false if it is the min value (default is false, like in distance matrices. All values will be multiplied by -1)
     */
    constructor(prediction, target, options) {
        options = options || {};
        if (prediction.length !== target.length || prediction[0].length !== target[0].length) {
            throw new Error('dimensions of prediction and target do not match');
        }
        const rows = prediction.length;
        const columns = prediction[0].length;
        const isDistance = !options.max;

        const predP = [];

        if (options.all) {
            for (var i = 0; i < rows; i++) {
                for (var j = 0; j < columns; j++) {
                    predP.push({
                        pred: prediction[i][j],
                        targ: target[i][j]
                    });
                }
            }
        } else {
            if (rows < 3 || rows !== columns) {
                throw new Error('When "all" option is false, the prediction matrix must be square and have at least 3 columns');
            }
            for (var i = 0; i < rows - 1; i++) {
                for (var j = i + 1; j < columns; j++) {
                    predP.push({
                        pred: prediction[i][j],
                        targ: target[i][j]
                    });
                }
            }
        }

        if (isDistance) {
            predP.sort((a, b) => a.pred - b.pred);
        } else {
            predP.sort((a, b) => b.pred - a.pred);
        }
        
        const cutoffs = this.cutoffs = [isDistance ? Number.MIN_VALUE : Number.MAX_VALUE];
        const fp = this.fp = [0];
        const tp = this.tp = [0];

        var nPos = 0;
        var nNeg = 0;

        var currentPred = predP[0].pred;
        var nTp = 0;
        var nFp = 0;
        for (var i = 0; i < predP.length; i++) {
            if (predP[i].pred !== currentPred) {
                cutoffs.push(currentPred);
                fp.push(nFp);
                tp.push(nTp);
                currentPred = predP[i].pred;
            }
            if (predP[i].targ) {
                nPos++;
                nTp++;
            } else {
                nNeg++;
                nFp++;
            }
        }
        cutoffs.push(currentPred);
        fp.push(nFp);
        tp.push(nTp);

        const l = cutoffs.length;
        const fn = this.fn = new Array(l);
        const tn = this.tn = new Array(l);
        const nPosPred = this.nPosPred = new Array(l);
        const nNegPred = this.nNegPred = new Array(l);

        for (var i = 0; i < l; i++) {
            fn[i] = nPos - tp[i];
            tn[i] = nNeg - fp[i];

            nPosPred[i] = tp[i] + fp[i];
            nNegPred[i] = tn[i] + fn[i];
        }

        this.nPos = nPos;
        this.nNeg = nNeg;
        this.nSamples = nPos + nNeg;
    }

    /**
     * Computes a measure from the prediction object.
     *
     * Many measures are available and can be combined :
     * To create a ROC curve, you need fpr and tpr
     * To create a DET curve, you need fnr and fpr
     * To create a Lift chart, you need rpp and lift
     *
     * Possible measures are : threshold (Threshold), acc (Accuracy), err (Error rate),
     * fpr (False positive rate), tpr (True positive rate), fnr (False negative rate), tnr (True negative rate), ppv (Positive predictive value),
     * npv (Negative predictive value), pcfall (Prediction-conditioned fallout), pcmiss (Prediction-conditioned miss), lift (Lift value), rpp (Rate of positive predictions), rnp (Rate of negative predictions)
     *
     * @param measure - The short name of the measure
     *
     * @return [number]
     */
    getMeasure(measure) {
        if (typeof measure !== 'string') {
            throw new Error('No measure specified');
        }
        if (!measures[measure]) {
            throw new Error(`The specified measure (${measure}) does not exist`);
        }
        return measures[measure](this);
    }

    /**
     * Returns the area under the ROC curve
     */
    getAURC() {
        const l = this.cutoffs.length;
        const x = new Array(l);
        const y = new Array(l);
        for (var i = 0; i < l; i++) {
            x[i] = this.fp[i] / this.nNeg;
            y[i] = this.tp[i] / this.nPos;
        }
        var auc = 0;
        for (i = 1; i < l; i++) {
            auc += 0.5 * (x[i] - x[i - 1]) * (y[i] + y[i - 1]);
        }
        return auc;
    }

    /**
     * Returns the area under the DET curve
     */
    getAUDC() {
        const l = this.cutoffs.length;
        const x = new Array(l);
        const y = new Array(l);
        for (var i = 0; i < l; i++) {
            x[i] = this.fn[i] / this.nPos;
            y[i] = this.fp[i] / this.nNeg;
        }
        var auc = 0;
        for (i = 1; i < l; i++) {
            auc += 0.5 * (x[i] + x[i - 1]) * (y[i] - y[i - 1]);
        }
        return auc;
    }

    getDistribution(options) {
        options = options || {};
        var cutLength = this.cutoffs.length;
        var cutLow = options.xMin || Math.floor(this.cutoffs[cutLength - 1] * 100) / 100;
        var cutHigh = options.xMax || Math.ceil(this.cutoffs[1] * 100) / 100;
        var interval = options.interval || Math.floor(((cutHigh - cutLow) / 20 * 10000000) - 1) / 10000000; // Trick to avoid the precision problem of float numbers

        var xLabels = [];
        var interValues = [];
        var intraValues = [];
        var interCumPercent = [];
        var intraCumPercent = [];

        var nTP = this.tp[cutLength - 1], currentTP = 0;
        var nFP = this.fp[cutLength - 1], currentFP = 0;

        for (var i = cutLow, j = (cutLength - 1); i <= cutHigh; i += interval) {
            while (this.cutoffs[j] < i)
                j--;

            xLabels.push(i);

            var thisTP = nTP - currentTP - this.tp[j];
            var thisFP = nFP - currentFP - this.fp[j];

            currentTP += thisTP;
            currentFP += thisFP;

            interValues.push(thisFP);
            intraValues.push(thisTP);

            interCumPercent.push(100 - (nFP - this.fp[j]) / nFP * 100);
            intraCumPercent.push(100 - (nTP - this.tp[j]) / nTP * 100);
        }

        return {
            xLabels: xLabels,
            interValues: interValues,
            intraValues: intraValues,
            interCumPercent: interCumPercent,
            intraCumPercent: intraCumPercent
        };
    }
}

Performance.names = {
    acc: 'Accuracy',
    err: 'Error rate',
    fpr: 'False positive rate',
    tpr: 'True positive rate',
    fnr: 'False negative rate',
    tnr: 'True negative rate',
    ppv: 'Positive predictive value',
    npv: 'Negative predictive value',
    pcfall: 'Prediction-conditioned fallout',
    pcmiss: 'Prediction-conditioned miss',
    lift: 'Lift value',
    rpp: 'Rate of positive predictions',
    rnp: 'Rate of negative predictions',
    threshold: 'Threshold'
};

module.exports = Performance;


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = exports = __webpack_require__(150);
exports.Utils = __webpack_require__(12);
exports.OPLS = __webpack_require__(149);


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.SimpleLinearRegression = exports.SLR = __webpack_require__(13);
exports.NonLinearRegression = exports.NLR = {
    PolynomialRegression: __webpack_require__(40),
    PotentialRegression: __webpack_require__(154),
    ExpRegression: __webpack_require__(151),
    PowerRegression: __webpack_require__(155)
};
exports.KernelRidgeRegression = exports.KRR = __webpack_require__(152);
//exports.MultipleLinearRegression = exports.MLR = require('./regression/multiple-linear-regression');
//exports.MultivariateLinearRegression = exports.MVLR = require('./regression/multivariate-linear-regression');
exports.PolinomialFitting2D = __webpack_require__(153);
exports.TheilSenRegression = __webpack_require__(156);


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

//Code translate from Pascal source in http://pubs.acs.org/doi/pdf/10.1021/ac00205a007
var extend = __webpack_require__(9);
var stat = __webpack_require__(157);

var defaultOptions = {
    windowSize: 9,
    derivative: 0,
    polynomial: 3,
};


function SavitzkyGolay(data, h, options) {
    options = extend({}, defaultOptions, options);

    if ((options.windowSize % 2 === 0) || (options.windowSize < 5) || !(Number.isInteger(options.windowSize)))
            throw new RangeError('Invalid window size (should be odd and at least 5 integer number)')


    if (options.windowSize>data.length)
        throw new RangeError('Window size is higher than the data length '+options.windowSize+">"+data.length);
    if ((options.derivative < 0) || !(Number.isInteger(options.derivative)))
        throw new RangeError('Derivative should be a positive integer');
    if ((options.polynomial < 1) || !(Number.isInteger(options.polynomial)))
        throw new RangeError('Polynomial should be a positive integer');
    if (options.polynomial >= 6)
        console.warn('You should not use polynomial grade higher than 5 if you are' +
            ' not sure that your data arises from such a model. Possible polynomial oscillation problems');

    var windowSize = options.windowSize;

    var half = Math.floor(windowSize/2);
    var np = data.length;
    var ans = new Array(np);
    var weights = fullWeights(windowSize,options.polynomial,options.derivative);
    var hs = 0;
    var constantH = true;
    if( Object.prototype.toString.call( h ) === '[object Array]' ) {
        constantH = false;
    }
    else{
        hs = Math.pow(h, options.derivative);
    }
    //console.log("Constant h: "+constantH);
    //For the borders
    for(var i=0;i<half;i++){
        var wg1=weights[half-i-1];
        var wg2=weights[half+i+1];
        var d1 = 0,d2=0;
        for (var l = 0; l < windowSize; l++){
            d1 += wg1[l] * data[l];
            d2 += wg2[l] * data[np-windowSize+l-1];
        }
        if(constantH){
            ans[half-i-1] = d1/hs;
            ans[np-half+i] = d2/hs;
        }
        else{
            hs = getHs(h,half-i-1,half, options.derivative);
            ans[half-i-1] = d1/hs;
            hs = getHs(h,np-half+i,half, options.derivative);
            ans[np-half+i] = d2/hs;
        }
    }
    //For the internal points
    var wg = weights[half];
    for(var i=windowSize;i<np+1;i++){
        var d = 0;
        for (var l = 0; l < windowSize; l++)
            d += wg[l] * data[l+i-windowSize];
        if(!constantH)
            hs = getHs(h,i-half-1,half, options.derivative);
        ans[i-half-1] = d/hs;
    }
    return ans;
}

function getHs(h,center,half,derivative){
    var hs = 0;
    var count = 0;
    for(var i=center-half;i<center+half;i++){
        if(i>=0 && i < h.length-1){
            hs+= (h[i+1]-h[i]);
            count++;
        }
    }
    return Math.pow(hs/count,derivative);
}

function GramPoly(i,m,k,s){
    var Grampoly = 0;
    if(k>0){
        Grampoly = (4*k-2)/(k*(2*m-k+1))*(i*GramPoly(i,m,k-1,s) +
            s*GramPoly(i,m,k-1,s-1)) - ((k-1)*(2*m+k))/(k*(2*m-k+1))*GramPoly(i,m,k-2,s);
    }
    else{
        if(k==0&&s==0){
            Grampoly=1;
        }
        else{
            Grampoly=0;
        }
    }
    //console.log(Grampoly);
    return Grampoly;
}

function GenFact(a,b){
    var gf=1;
    if(a>=b){
        for(var j=a-b+1;j<=a;j++){
            gf*=j;
        }
    }
    return gf;
}

function Weight(i,t,m,n,s){
    var sum=0;
    for(var k=0;k<=n;k++){
        //console.log(k);
        sum+=(2*k+1)*(GenFact(2*m,k)/GenFact(2*m+k+1,k+1))*GramPoly(i,m,k,0)*GramPoly(t,m,k,s)
    }
    return sum;
}

/**
 *
 * @param m  Number of points
 * @param n  Polynomial grade
 * @param s  Derivative
 */
function fullWeights(m,n,s){
    var weights = new Array(m);
    var np = Math.floor(m/2);
    for(var t=-np;t<=np;t++){
        weights[t+np] = new Array(m);
        for(var j=-np;j<=np;j++){
            weights[t+np][j+np]=Weight(j,t,np,n,s);
        }
    }
    return weights;
}

/*function entropy(data,h,options){
    var trend = SavitzkyGolay(data,h,trendOptions);
    var copy = new Array(data.length);
    var sum = 0;
    var max = 0;
    for(var i=0;i<data.length;i++){
        copy[i] = data[i]-trend[i];
    }

    sum/=data.length;
    console.log(sum+" "+max);
    console.log(stat.array.standardDeviation(copy));
    console.log(Math.abs(stat.array.mean(copy))/stat.array.standardDeviation(copy));
    return sum;

}



function guessWindowSize(data, h){
    console.log("entropy "+entropy(data,h,trendOptions));
    return 5;
}
*/
module.exports = SavitzkyGolay;
 


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Matrix = __webpack_require__(0);
var padArray = __webpack_require__(20);
var extend = __webpack_require__(9);

var defaultOptions = {
    windowSize: 5,
    derivative: 1,
    polynomial: 2,
    pad: 'none',
    padValue: 'replicate'
};

/**
 * Savitzky-Golay filter
 * @param {Array <number>} data
 * @param {number} h
 * @param {Object} options
 * @returns {Array}
 */
function SavitzkyGolay (data, h, options) {
    options = extend({}, defaultOptions, options);
    if ((options.windowSize % 2 === 0) || (options.windowSize < 5) || !(Number.isInteger(options.windowSize)))
        throw new RangeError('Invalid window size (should be odd and at least 5 integer number)');
    if ((options.derivative < 0) || !(Number.isInteger(options.derivative)))
        throw new RangeError('Derivative should be a positive integer');
    if ((options.polynomial < 1) || !(Number.isInteger(options.polynomial)))
        throw new RangeError('Polynomial should be a positive integer');

    var C, norm;
    var step = Math.floor(options.windowSize / 2);

    if (options.pad === 'pre') {
        data = padArray(data, {size: step, value: options.padValue});
    }

    var ans =  new Array(data.length - 2*step);

    if ((options.windowSize === 5) && (options.polynomial === 2) && ((options.derivative === 1) || (options.derivative === 2))) {
        if (options.derivative === 1) {
            C = [-2,-1,0,1,2];
            norm = 10;
        }
        else {
            C = [2, -1, -2, -1, 2];
            norm = 7;
        }
    }
    else {
        var J = Matrix.ones(options.windowSize, options.polynomial + 1);
        var inic = -(options.windowSize - 1) / 2;
        for (var i = 0; i < J.length; i++) {
            for (var j = 0; j < J[i].length; j++) {
                if ((inic + 1 !== 0) || (j !== 0))
                    J[i][j] = Math.pow((inic + i), j);
            }
        }
        var Jtranspose = J.transposeView();
        var Jinv = (Jtranspose.mmul(J)).inverse();
        C = Jinv.mmul(Jtranspose);
        C = C[options.derivative];
        norm = 1;
    }
    var det = norm * Math.pow(h, options.derivative);
    for (var k = step; k < (data.length - step); k++) {
        var d = 0;
        for (var l = 0; l < C.length; l++)
            d += C[l] * data[l + k - step] / det;
        ans[k - step] = d;
    }

    if (options.pad === 'post') {
        ans = padArray(ans, {size: step, value: options.padValue});
    }

    return ans;
}

module.exports = SavitzkyGolay;


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var NodeSquare = __webpack_require__(42),
    NodeHexagonal = __webpack_require__(159);

var defaultOptions = {
    fields: 3,
    randomizer: Math.random,
    distance: squareEuclidean,
    iterations: 10,
    learningRate: 0.1,
    gridType: 'rect',
    torus: true,
    method: 'random'
};

function SOM(x, y, options, reload) {

    this.x = x;
    this.y = y;

    options = options || {};
    this.options = {};
    for (var i in defaultOptions) {
        if (options.hasOwnProperty(i)) {
            this.options[i] = options[i];
        } else {
            this.options[i] = defaultOptions[i];
        }
    }

    if (typeof this.options.fields === 'number') {
        this.numWeights = this.options.fields;
    } else if (Array.isArray(this.options.fields)) {
        this.numWeights = this.options.fields.length;
        var converters = getConverters(this.options.fields);
        this.extractor = converters.extractor;
        this.creator = converters.creator;
    } else {
        throw new Error('Invalid fields definition');
    }

    if (this.options.gridType === 'rect') {
        this.nodeType = NodeSquare;
        this.gridDim = {
            x: x,
            y: y
        };
    } else {
        this.nodeType = NodeHexagonal;
        var hx = this.x - Math.floor(this.y / 2);
        this.gridDim = {
            x: hx,
            y: this.y,
            z: -(0 - hx - this.y)
        };
    }

    this.torus = this.options.torus;
    this.distanceMethod = this.torus ? 'getDistanceTorus' : 'getDistance';

    this.distance = this.options.distance;

    this.maxDistance = getMaxDistance(this.distance, this.numWeights);

    if (reload === true) { // For model loading
        this.done = true;
        return;
    }
    if (!(x > 0 && y > 0)) {
        throw new Error('x and y must be positive');
    }

    this.times = {
        findBMU: 0,
        adjust: 0
    };

    this.randomizer = this.options.randomizer;

    this.iterationCount = 0;
    this.iterations = this.options.iterations;

    this.startLearningRate = this.learningRate = this.options.learningRate;

    this.mapRadius = Math.floor(Math.max(x, y) / 2);

    this.algorithmMethod = this.options.method;

    this._initNodes();

    this.done = false;
}

SOM.load = function loadModel(model, distance) {
    if (model.name === 'SOM') {
        var x = model.data.length,
            y = model.data[0].length;
        if (distance) {
            model.options.distance = distance;
        } else if (model.options.distance) {
            model.options.distance = eval('(' + model.options.distance + ')');
        }
        var som = new SOM(x, y, model.options, true);
        som.nodes = new Array(x);
        for (var i = 0; i < x; i++) {
            som.nodes[i] = new Array(y);
            for (var j = 0; j < y; j++) {
                som.nodes[i][j] = new som.nodeType(i, j, model.data[i][j], som);
            }
        }
        return som;
    } else {
        throw new Error('expecting a SOM model');
    }
};

SOM.prototype.export = function exportModel(includeDistance) {
    if (!this.done) {
        throw new Error('model is not ready yet');
    }
    var model = {
        name: 'SOM'
    };
    model.options = {
        fields: this.options.fields,
        gridType: this.options.gridType,
        torus: this.options.torus
    };
    model.data = new Array(this.x);
    for (var i = 0; i < this.x; i++) {
        model.data[i] = new Array(this.y);
        for (var j = 0; j < this.y; j++) {
            model.data[i][j] = this.nodes[i][j].weights;
        }
    }
    if (includeDistance) {
        model.options.distance = this.distance.toString();
    }
    return model;
};

SOM.prototype._initNodes = function initNodes() {
    var now = Date.now(),
        i, j, k;
    this.nodes = new Array(this.x);
    for (i = 0; i < this.x; i++) {
        this.nodes[i] = new Array(this.y);
        for (j = 0; j < this.y; j++) {
            var weights = new Array(this.numWeights);
            for (k = 0; k < this.numWeights; k++) {
                weights[k] = this.randomizer();
            }
            this.nodes[i][j] = new this.nodeType(i, j, weights, this);
        }
    }
    this.times.initNodes = Date.now() - now;
};

SOM.prototype.setTraining = function setTraining(trainingSet) {
    if (this.trainingSet) {
        throw new Error('training set has already been set');
    }
    var now = Date.now();
    var convertedSet = trainingSet;
    var i, l = trainingSet.length;
    if (this.extractor) {
        convertedSet = new Array(l);
        for (i = 0; i < l; i++) {
            convertedSet[i] = this.extractor(trainingSet[i]);
        }
    }
    this.numIterations = this.iterations * l;

    if (this.algorithmMethod === 'random') {
        this.timeConstant = this.numIterations / Math.log(this.mapRadius);
    } else {
        this.timeConstant = l / Math.log(this.mapRadius);
    }
    this.trainingSet = convertedSet;
    this.times.setTraining = Date.now() - now;
};

SOM.prototype.trainOne = function trainOne() {
    if (this.done) {

        return false;

    } else if (this.numIterations-- > 0) {

        var neighbourhoodRadius,
            trainingValue,
            trainingSetFactor;

        if (this.algorithmMethod === 'random') { // Pick a random value of the training set at each step
            neighbourhoodRadius = this.mapRadius * Math.exp(-this.iterationCount / this.timeConstant);
            trainingValue = getRandomValue(this.trainingSet, this.randomizer);
            this._adjust(trainingValue, neighbourhoodRadius);
            this.learningRate = this.startLearningRate * Math.exp(-this.iterationCount / this.numIterations);
        } else { // Get next input vector
            trainingSetFactor = -Math.floor(this.iterationCount / this.trainingSet.length);
            neighbourhoodRadius = this.mapRadius * Math.exp(trainingSetFactor / this.timeConstant);
            trainingValue = this.trainingSet[this.iterationCount % this.trainingSet.length];
            this._adjust(trainingValue, neighbourhoodRadius);
            if (((this.iterationCount + 1) % this.trainingSet.length) === 0) {
                this.learningRate = this.startLearningRate * Math.exp(trainingSetFactor / Math.floor(this.numIterations / this.trainingSet.length));
            }
        }

        this.iterationCount++;

        return true;

    } else {

        this.done = true;
        return false;

    }
};

SOM.prototype._adjust = function adjust(trainingValue, neighbourhoodRadius) {
    var now = Date.now(),
        x, y, dist, influence;

    var bmu = this._findBestMatchingUnit(trainingValue);

    var now2 = Date.now();
    this.times.findBMU += now2 - now;

    var radiusLimit = Math.floor(neighbourhoodRadius);
    var xMin = bmu.x - radiusLimit,
        xMax = bmu.x + radiusLimit,
        yMin = bmu.y - radiusLimit,
        yMax = bmu.y + radiusLimit;

    for (x = xMin; x <= xMax; x++) {
        var theX = x;
        if (x < 0) {
            theX += this.x;
        } else if (x >= this.x) {
            theX -= this.x;
        }
        for (y = yMin; y <= yMax; y++) {
            var theY = y;
            if (y < 0) {
                theY += this.y;
            } else if (y >= this.y) {
                theY -= this.y;
            }

            dist = bmu[this.distanceMethod](this.nodes[theX][theY]);

            if (dist < neighbourhoodRadius) {
                influence = Math.exp(-dist / (2 * neighbourhoodRadius));
                this.nodes[theX][theY].adjustWeights(trainingValue, this.learningRate, influence);
            }

        }
    }

    this.times.adjust += (Date.now() - now2);

};

SOM.prototype.train = function train(trainingSet) {
    if (!this.done) {
        this.setTraining(trainingSet);
        while (this.trainOne()) {
        }
    }
};

SOM.prototype.getConvertedNodes = function getConvertedNodes() {
    var result = new Array(this.x);
    for (var i = 0; i < this.x; i++) {
        result[i] = new Array(this.y);
        for (var j = 0; j < this.y; j++) {
            var node = this.nodes[i][j];
            result[i][j] = this.creator ? this.creator(node.weights) : node.weights;
        }
    }
    return result;
};

SOM.prototype._findBestMatchingUnit = function findBestMatchingUnit(candidate) {

    var bmu,
        lowest = Infinity,
        dist;

    for (var i = 0; i < this.x; i++) {
        for (var j = 0; j < this.y; j++) {
            dist = this.distance(this.nodes[i][j].weights, candidate);
            if (dist < lowest) {
                lowest = dist;
                bmu = this.nodes[i][j];
            }
        }
    }

    return bmu;

};

SOM.prototype.predict = function predict(data, computePosition) {
    if (typeof data === 'boolean') {
        computePosition = data;
        data = null;
    }
    if (!data) {
        data = this.trainingSet;
    }
    if (Array.isArray(data) && (Array.isArray(data[0]) || (typeof data[0] === 'object'))) { // predict a dataset
        var self = this;
        return data.map(function (element) {
            return self._predict(element, computePosition);
        });
    } else { // predict a single element
        return this._predict(data, computePosition);
    }
};

SOM.prototype._predict = function _predict(element, computePosition) {
    if (!Array.isArray(element)) {
        element = this.extractor(element);
    }
    var bmu = this._findBestMatchingUnit(element);
    var result = [bmu.x, bmu.y];
    if (computePosition) {
        result[2] = bmu.getPosition(element);
    }
    return result;
};

// As seen in http://www.scholarpedia.org/article/Kohonen_network
SOM.prototype.getQuantizationError = function getQuantizationError() {
    var fit = this.getFit(),
        l = fit.length,
        sum = 0;
    for (var i = 0; i < l; i++) {
        sum += fit[i];
    }
    return sum / l;
};

SOM.prototype.getFit = function getFit(dataset) {
    if (!dataset) {
        dataset = this.trainingSet;
    }
    var l = dataset.length,
        bmu,
        result = new Array(l);
    for (var i = 0; i < l; i++) {
        bmu = this._findBestMatchingUnit(dataset[i]);
        result[i] = Math.sqrt(this.distance(dataset[i], bmu.weights));
    }
    return result;
};

function getConverters(fields) {
    var l = fields.length,
        normalizers = new Array(l),
        denormalizers = new Array(l);
    for (var i = 0; i < l; i++) {
        normalizers[i] = getNormalizer(fields[i].range);
        denormalizers[i] = getDenormalizer(fields[i].range);
    }
    return {
        extractor: function extractor(value) {
            var result = new Array(l);
            for (var i = 0; i < l; i++) {
                result[i] = normalizers[i](value[fields[i].name]);
            }
            return result;
        },
        creator: function creator(value) {
            var result = {};
            for (var i = 0; i < l; i++) {
                result[fields[i].name] = denormalizers[i](value[i]);
            }
            return result;
        }
    };
}

function getNormalizer(minMax) {
    return function normalizer(value) {
        return (value - minMax[0]) / (minMax[1] - minMax[0]);
    };
}

function getDenormalizer(minMax) {
    return function denormalizer(value) {
        return (minMax[0] + value * (minMax[1] - minMax[0]));
    };
}

function squareEuclidean(a, b) {
    var d = 0;
    for (var i = 0, ii = a.length; i < ii; i++) {
        d += (a[i] - b[i]) * (a[i] - b[i]);
    }
    return d;
}

function getRandomValue(arr, randomizer) {
    return arr[Math.floor(randomizer() * arr.length)];
}

function getMaxDistance(distance, numWeights) {
    var zero = new Array(numWeights),
        one = new Array(numWeights);
    for (var i = 0; i < numWeights; i++) {
        zero[i] = 0;
        one[i] = 1;
    }
    return distance(zero, one);
}

module.exports = SOM;

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

const HashTable = __webpack_require__(19);

class SparseMatrix {
    constructor(rows, columns, options = {}) {
        if (rows instanceof SparseMatrix) { // clone
            const other = rows;
            this._init(other.rows, other.columns, other.elements.clone(), other.threshold);
            return;
        }

        if (Array.isArray(rows)) {
            const matrix = rows;
            rows = matrix.length;
            options = columns || {};
            columns = matrix[0].length;
            this._init(rows, columns, new HashTable(options), options.threshold);
            for (var i = 0; i < rows; i++) {
                for (var j = 0; j < columns; j++) {
                    var value = matrix[i][j];
                    if (this.threshold && Math.abs(value) < this.threshold) value = 0;
                    if (value !== 0) {
                        this.elements.set(i * columns + j, matrix[i][j]);
                    }
                }
            }
        } else {
            this._init(rows, columns, new HashTable(options), options.threshold);
        }
    }

    _init(rows, columns, elements, threshold) {
        this.rows = rows;
        this.columns = columns;
        this.elements = elements;
        this.threshold = threshold || 0;
    }
    
    static eye(rows = 1, columns = rows) {
        const min = Math.min(rows, columns);
        const matrix = new SparseMatrix(rows, columns, {initialCapacity: min});
        for (var i = 0; i < min; i++) {
            matrix.set(i, i, 1);
        }
        return matrix;
    }

    clone() {
        return new SparseMatrix(this);
    }
    
    to2DArray() {
        const copy = new Array(this.rows);
        for (var i = 0; i < this.rows; i++) {
            copy[i] = new Array(this.columns);
            for (var j = 0; j < this.columns; j++) {
                copy[i][j] = this.get(i, j);
            }
        }
        return copy;
    }

    isSquare() {
        return this.rows === this.columns;
    }

    isSymmetric() {
        if (!this.isSquare()) return false;

        var symmetric = true;
        this.forEachNonZero((i, j, v) => {
            if (this.get(j, i) !== v) {
                symmetric = false;
                return false;
            }
            return v;
        });
        return symmetric;
    }

    get cardinality() {
        return this.elements.size;
    }

    get size() {
        return this.rows * this.columns;
    }

    get(row, column) {
        return this.elements.get(row * this.columns + column);
    }

    set(row, column, value) {
        if (this.threshold && Math.abs(value) < this.threshold) value = 0;
        if (value === 0) {
            this.elements.remove(row * this.columns + column);
        } else {
            this.elements.set(row * this.columns + column, value);
        }
        return this;
    }
    
    mmul(other) {
        if (this.columns !== other.rows)
            console.warn('Number of columns of left matrix are not equal to number of rows of right matrix.');
        
        const m = this.rows;
        const p = other.columns;
        
        const result = new SparseMatrix(m, p);
        this.forEachNonZero((i, j, v1) => {
            other.forEachNonZero((k, l, v2) => {
                if (j === k) {
                    result.set(i, l, result.get(i, l) + v1 * v2);
                }
                return v2;
            });
            return v1;
        });
        return result;
    }

    kroneckerProduct(other) {
        const m = this.rows;
        const n = this.columns;
        const p = other.rows;
        const q = other.columns;

        const result = new SparseMatrix(m * p, n * q, {
            initialCapacity: this.cardinality * other.cardinality
        });
        this.forEachNonZero((i, j, v1) => {
            other.forEachNonZero((k, l, v2) => {
                result.set(p * i + k, q * j + l, v1 * v2);
                return v2;
            });
            return v1;
        });
        return result;
    }

    forEachNonZero(callback) {
        this.elements.forEachPair((key, value) => {
            const i = (key / this.columns) | 0;
            const j = key % this.columns;
            let r = callback(i, j, value);
            if (r === false) return false; // stop iteration
            if (this.threshold && Math.abs(r) < this.threshold) r = 0;
            if (r !== value) {
                if (r === 0) {
                    this.elements.remove(key, true);
                } else {
                    this.elements.set(key, r);
                }
            }
            return true;
        });
        this.elements.maybeShrinkCapacity();
        return this;
    }

    getNonZeros() {
        const cardinality = this.cardinality;
        const rows = new Array(cardinality);
        const columns = new Array(cardinality);
        const values = new Array(cardinality);
        var idx = 0;
        this.forEachNonZero((i, j, value) => {
            rows[idx] = i;
            columns[idx] = j;
            values[idx] = value;
            idx++;
            return value;
        });
        return {rows, columns, values};
    }

    setThreshold(newThreshold) {
        if (newThreshold !== 0 && newThreshold !== this.threshold) {
            this.threshold = newThreshold;
            this.forEachNonZero((i, j, v) => v);
        }
        return this;
    }
}

SparseMatrix.prototype.klass = 'Matrix';

SparseMatrix.identity = SparseMatrix.eye;
SparseMatrix.prototype.tensorProduct = SparseMatrix.prototype.kroneckerProduct;

module.exports = SparseMatrix;

/*
 Add dynamically instance and static methods for mathematical operations
 */

var inplaceOperator = `
(function %name%(value) {
    if (typeof value === 'number') return this.%name%S(value);
    return this.%name%M(value);
})
`;

var inplaceOperatorScalar = `
(function %name%S(value) {
    this.forEachNonZero((i, j, v) => v %op% value);
    return this;
})
`;

var inplaceOperatorMatrix = `
(function %name%M(matrix) {
    matrix.forEachNonZero((i, j, v) => {
        this.set(i, j, this.get(i, j) %op% v);
        return v;
    });
    return this;
})
`;

var staticOperator = `
(function %name%(matrix, value) {
    var newMatrix = new SparseMatrix(matrix);
    return newMatrix.%name%(value);
})
`;

var inplaceMethod = `
(function %name%() {
    this.forEachNonZero((i, j, v) => %method%(v));
    return this;
})
`;

var staticMethod = `
(function %name%(matrix) {
    var newMatrix = new SparseMatrix(matrix);
    return newMatrix.%name%();
})
`;

var operators = [
    // Arithmetic operators
    ['+', 'add'],
    ['-', 'sub', 'subtract'],
    ['*', 'mul', 'multiply'],
    ['/', 'div', 'divide'],
    ['%', 'mod', 'modulus'],
    // Bitwise operators
    ['&', 'and'],
    ['|', 'or'],
    ['^', 'xor'],
    ['<<', 'leftShift'],
    ['>>', 'signPropagatingRightShift'],
    ['>>>', 'rightShift', 'zeroFillRightShift']
];

for (var operator of operators) {
    for (var i = 1; i < operator.length; i++) {
        SparseMatrix.prototype[operator[i]] = eval(fillTemplateFunction(inplaceOperator, {name: operator[i], op: operator[0]}));
        SparseMatrix.prototype[operator[i] + 'S'] = eval(fillTemplateFunction(inplaceOperatorScalar, {name: operator[i] + 'S', op: operator[0]}));
        SparseMatrix.prototype[operator[i] + 'M'] = eval(fillTemplateFunction(inplaceOperatorMatrix, {name: operator[i] + 'M', op: operator[0]}));

        SparseMatrix[operator[i]] = eval(fillTemplateFunction(staticOperator, {name: operator[i]}));
    }
}

var methods = [
    ['~', 'not']
];

[
    'abs', 'acos', 'acosh', 'asin', 'asinh', 'atan', 'atanh', 'cbrt', 'ceil',
    'clz32', 'cos', 'cosh', 'exp', 'expm1', 'floor', 'fround', 'log', 'log1p',
    'log10', 'log2', 'round', 'sign', 'sin', 'sinh', 'sqrt', 'tan', 'tanh', 'trunc'
].forEach(function (mathMethod) {
    methods.push(['Math.' + mathMethod, mathMethod]);
});

for (var method of methods) {
    for (var i = 1; i < method.length; i++) {
        SparseMatrix.prototype[method[i]] = eval(fillTemplateFunction(inplaceMethod, {name: method[i], method: method[0]}));
        SparseMatrix[method[i]] = eval(fillTemplateFunction(staticMethod, {name: method[i]}));
    }
}

function fillTemplateFunction(template, values) {
    for (var i in values) {
        template = template.replace(new RegExp('%' + i + '%', 'g'), values[i]);
    }
    return template;
}


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const Kernel = __webpack_require__(8);
const stat = __webpack_require__(2).array;

var defaultOptions = {
    C: 1,
    tol: 1e-4,
    maxPasses: 10,
    maxIterations: 10000,
    kernel: 'linear',
    alphaTol: 1e-6,
    random: Math.random,
    whitening: true
};

/**
 * Simplified version of the Sequential Minimal Optimization algorithm for training
 * support vector machines
 * @param {{Object}} options - SVM options
 * @param {Number} [options.C=1] - regularization parameter
 * @param {Number} [options.tol=1e-4] - numerical tolerance
 * @param {Number} [options.alphaTol=1e-6] - alpha tolerance, threshold to decide support vectors
 * @param {Number} [options.maxPasses=10] - max number of times to iterate over alphas without changing
 * @param {Number} [options.maxIterations=10000] - max number of iterations
 * @param {String} [options.kernel=linear] - the kind of kernel. {@link https://github.com/mljs/kernel/tree/1252de5f9012776e6e0eb06c7b434b8631fb21f0 List of kernels}
 * @param {Function} [options.random=Math.random] - custom random number generator
 * @constructor
 */
function SVM(options) {
    this.options = Object.assign({}, defaultOptions, options);

    this.kernel = new Kernel(this.options.kernel, this.options.kernelOptions);
    this.b = 0;
}

/**
 * Train the SVM model
 * @param {Array <Array <number>>} features - training data features
 * @param {Array <number>} labels - training data labels in the domain {1,-1}
 */
SVM.prototype.train = function (features, labels) {
    if (features.length !== labels.length) {
        throw new Error('Features and labels should have the same length');
    }
    if (features.length < 2) {
        throw new Error('Cannot train with less than 2 observations');
    }
    this._trained = false;
    this._loaded = false;
    this.N = labels.length;
    this.D = features[0].length;
    if (this.options.whitening) {
        this.X = new Array(this.N);
        for (var i = 0; i < this.N; i++) {
            this.X[i] = new Array(this.D);
        }
        this.minMax = new Array(this.D);
        // Apply normalization and keep normalization parameters
        for (var j = 0; j < this.D; j++) {
            var d = new Array(this.N);
            for (i = 0; i < this.N; i++) {
                d[i] = features[i][j];
            }
            this.minMax[j] = stat.minMax(d);
            for (i = 0; i < this.N; i++) {
                this.X[i][j] = (features[i][j] - this.minMax[j].min) / (this.minMax[j].max - this.minMax[j].min);
            }
        }
    } else {
        this.X = features;
    }
    this.Y = labels;
    this.b = 0;
    this.W = undefined;

    var kernel = this.kernel.compute(this.X);
    var m = labels.length;
    var alpha = new Array(m).fill(0);
    this.alphas = alpha;
    for (var a = 0; a < m; a++)
        alpha[a] = 0;

    var b1 = 0,
        b2 = 0,
        iter = 0,
        passes = 0,
        Ei = 0,
        Ej = 0,
        ai = 0,
        aj = 0,
        L = 0,
        H = 0,
        eta = 0;

    while (passes < this.options.maxPasses && iter < this.options.maxIterations) {
        var numChange = 0;
        for (i = 0; i < m; i++) {
            Ei = this._marginOnePrecomputed(i, kernel) - labels[i];
            if (labels[i] * Ei < -this.options.tol && alpha[i] < this.options.C || labels[i] * Ei > this.options.tol && alpha[i] > 0) {
                j = i;
                while (j === i) j = Math.floor(this.options.random() * m);
                Ej = this._marginOnePrecomputed(j, kernel) - labels[j];
                ai = alpha[i];
                aj = alpha[j];
                if (labels[i] === labels[j]) {
                    L = Math.max(0, ai + aj - this.options.C);
                    H = Math.min(this.options.C, ai + aj);
                } else  {
                    L = Math.max(0, aj - ai);
                    H = Math.min(this.options.C, this.options.C + aj + ai);
                }
                if (Math.abs(L - H) < 1e-4) continue;

                eta = 2 * kernel[i][j] - kernel[i][i] - kernel[j][j];
                if (eta >= 0) continue;
                var newaj = alpha[j] - labels[j] * (Ei - Ej) / eta;
                if (newaj > H)
                    newaj = H;
                else if (newaj < L)
                    newaj = L;
                if (Math.abs(aj - newaj) < 10e-4) continue;
                alpha[j] = newaj;
                alpha[i] = alpha[i] + labels[i] * labels[j] * (aj - newaj);
                b1 = this.b - Ei - labels[i] * (alpha[i] - ai) * kernel[i][i] - labels[j] * (alpha[j] - aj) * kernel[i][j];
                b2 = this.b - Ej - labels[i] * (alpha[i] - ai) * kernel[i][j] - labels[j] * (alpha[j] - aj) * kernel[j][j];
                this.b = (b1 + b2) / 2;
                if (alpha[i] < this.options.C && alpha[i] > 0) this.b = b1;
                if (alpha[j] < this.options.C && alpha[j] > 0) this.b = b2;
                numChange += 1;
            }
        }
        iter++;
        if (numChange === 0)
            passes += 1;
        else
            passes = 0;
    }
    if (iter === this.options.maxIterations) {
        throw new Error('max iterations reached');
    }

    this.iterations = iter;

    // Compute the weights (useful for fast decision on new test instances when linear SVM)
    if (this.options.kernel === 'linear') {
        this.W = new Array(this.D);
        for (var r = 0; r < this.D; r++) {
            this.W[r] = 0;
            for (var w = 0; w < m; w++)
                this.W[r] += labels[w] * alpha[w] * this.X[w][r];
        }
    }

    // Keep only support vectors
    // It will compute decision on new test instances faster
    // We also keep the index of the support vectors
    // in the original data
    var nX = [];
    var nY = [];
    var nAlphas = [];
    this._supportVectorIdx = [];
    for (i = 0; i < this.N; i++) {
        if (this.alphas[i] > this.options.alphaTol) {
            nX.push(this.X[i]);
            nY.push(labels[i]);
            nAlphas.push(this.alphas[i]);
            this._supportVectorIdx.push(i);

        }
    }
    this.X = nX;
    this.Y = nY;
    this.N = nX.length;
    this.alphas = nAlphas;


    // A flag to say this SVM has been trained
    this._trained = true;
};

/**
 * Get prediction ({-1,1}) given one observation's features.
 * @private
 * @param p The observation's features.
 * @returns {number} Classification result ({-1,1})
 */
SVM.prototype.predictOne = function (p) {
    var margin = this.marginOne(p);
    return margin > 0 ? 1 : -1;
};

/**
 * Predict the classification outcome of a trained svm given one or several observations' features.
 * @param {Array} features - The observation(s)' features
 * @returns {Array<Number>|Number} An array of {-1, 1} if several observations are given or a number if one observation
 * is given
 */
SVM.prototype.predict = function (features) {
    if (!this._trained && !this._loaded) throw new Error('Cannot predict, you need to train the SVM first');
    if (Array.isArray(features) && Array.isArray(features[0])) {
        return features.map(this.predictOne.bind(this));
    } else {
        return this.predictOne(features);
    }
};

/**
 * Get margin given one observation's features
 * @private
 * @param {Array<Number>} features - Features
 * @returns {Number} - The computed margin
 */
SVM.prototype.marginOne = function (features, noWhitening) {
    // Apply normalization
    if (this.options.whitening && !noWhitening) {
        features = this._applyWhitening(features);
    }
    var ans = this.b, i;
    if (this.options.kernel === 'linear' && this.W) {
        // Use weights, it's faster
        for (i = 0; i < this.W.length; i++) {
            ans += this.W[i] * features[i];
        }
    } else {
        for (i = 0; i < this.N; i++) {
            ans += this.alphas[i] * this.Y[i] * this.kernel.compute([features], [this.X[i]])[0][0];
        }
    }
    return ans;
};


/**
 * Get a margin using the precomputed kernel. Much faster than normal margin computation
 * @private
 * @param {Number} index - Train data index
 * @param {Array< Array<Number> >} kernel - The precomputed kernel
 * @returns {number} Computed margin
 * @private
 */
SVM.prototype._marginOnePrecomputed = function (index, kernel) {
    var ans = this.b, i;
    for (i = 0; i < this.N; i++) {
        ans += this.alphas[i] * this.Y[i] * kernel[index][i];
    }
    return ans;
};


/**
 * Returns the margin of one or several observations given its features
 * @param {Array <Array<Number> >|Array<Number>} features - Features from on or several observations.
 * @returns {Number|Array} The computed margin. Is an Array if several observations' features given, or a Number if
 * only one observation's features given
 */
SVM.prototype.margin = function (features) {
    if (Array.isArray(features)) {
        return features.map(this.marginOne.bind(this));
    } else {
        return this.marginOne(features);
    }
};

/**
 * Get support vectors indexes of the trained classifier. WARINNG: this method does not work for svm instances
 * created from {@link #SVM.load load} if linear kernel
 * @returns {Array<Number>} The indices in the training vector of the support vectors
 */
SVM.prototype.supportVectors = function () {
    if (!this._trained && !this._loaded) throw new Error('Cannot get support vectors, you need to train the SVM first');
    if (this._loaded && this.options.kernel === 'linear') throw new Error('Cannot get support vectors from saved linear model, you need to train the SVM to have them');
    return this._supportVectorIdx;
};

/**
 * Create a SVM instance from a saved model
 * @param {Object} model -  Object such as returned by a trained SVM instance with {@link #SVM#toJSON toJSON}
 * @returns {SVM} Instance of svm classifier
 */
SVM.load = function (model) {
    this._loaded = true;
    this._trained = false;
    var svm = new SVM(model.options);
    if (model.options.kernel === 'linear') {
        svm.W = model.W.slice();
        svm.D = svm.W.length;
    } else {
        svm.X = model.X.slice();
        svm.Y = model.Y.slice();
        svm.alphas = model.alphas.slice();
        svm.N = svm.X.length;
        svm.D = svm.X[0].length;
    }
    svm.minMax = model.minMax;
    svm.b = model.b;
    svm._loaded = true;
    svm._trained = false;
    return svm;
};

/**
 * Export the minimal object that enables to reload the model
 * @returns {Object} Model object that can be reused with {@link #SVM.load load}
 */
SVM.prototype.toJSON = function () {
    if (!this._trained && !this._loaded) throw new Error('Cannot export, you need to train the SVM first');
    var model = {};
    model.options = Object.assign({}, this.options);
    model.b = this.b;
    model.minMax = this.minMax;
    if (model.options.kernel === 'linear') {
        model.W = this.W.slice();
    } else {
        // Exporting non-linear models is heavier
        model.X = this.X.slice();
        model.Y = this.Y.slice();
        model.alphas = this.alphas.slice();
    }
    return model;
};

SVM.prototype._applyWhitening = function (features) {
    if (!this.minMax) throw new Error('Could not apply whitening');
    var whitened = new Array(features.length);
    for (var j = 0; j < features.length; j++) {
        whitened[j] = (features[j] - this.minMax[j].min) / (this.minMax[j].max - this.minMax[j].min);
    }
    return whitened;
};

module.exports = SVM;


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LOOP = 8;
var FLOAT_MUL = 1 / 16777216;

function multiply_uint32(n, m) {
    n >>>= 0;
    m >>>= 0;
    var nlo = n & 0xffff;
    var nhi = n - nlo;
    return (nhi * m >>> 0) + nlo * m >>> 0;
}

var XSadd = (function () {
    function XSadd() {
        var seed = arguments.length <= 0 || arguments[0] === undefined ? Date.now() : arguments[0];

        _classCallCheck(this, XSadd);

        this.state = new Uint32Array(4);
        this.init(seed);
    }

    _createClass(XSadd, [{
        key: "init",
        value: function init(seed) {
            this.state[0] = seed;
            this.state[1] = 0;
            this.state[2] = 0;
            this.state[3] = 0;
            for (var i = 1; i < LOOP; i++) {
                this.state[i & 3] ^= i + multiply_uint32(1812433253, this.state[i - 1 & 3] ^ this.state[i - 1 & 3] >>> 30 >>> 0) >>> 0;
            }
            period_certification(this);
            for (var i = 0; i < LOOP; i++) {
                next_state(this);
            }
        }

        /**
         * Returns a 32-bit integer r (0 <= r < 2^32)
         */
    }, {
        key: "getUint32",
        value: function getUint32() {
            next_state(this);
            return this.state[3] + this.state[2] >>> 0;
        }

        /**
         * Returns a floating point number r (0.0 <= r < 1.0)
         */
    }, {
        key: "getFloat",
        value: function getFloat() {
            return (this.getUint32() >>> 8) * FLOAT_MUL;
        }
    }, {
        key: "random",
        get: function get() {
            if (!this._random) {
                this._random = this.getFloat.bind(this);
            }
            return this._random;
        }
    }]);

    return XSadd;
})();

exports["default"] = XSadd;

function period_certification(xsadd) {
    if (xsadd.state[0] === 0 && xsadd.state[1] === 0 && xsadd.state[2] === 0 && xsadd.state[3] === 0) {
        xsadd.state[0] = 88; // X
        xsadd.state[1] = 83; // S
        xsadd.state[2] = 65; // A
        xsadd.state[3] = 68; // D
    }
}

var sh1 = 15;
var sh2 = 18;
var sh3 = 11;
function next_state(xsadd) {
    var t = xsadd.state[0];
    t ^= t << sh1;
    t ^= t >>> sh2;
    t ^= xsadd.state[3] << sh3;
    xsadd.state[0] = xsadd.state[1];
    xsadd.state[1] = xsadd.state[2];
    xsadd.state[2] = xsadd.state[3];
    xsadd.state[3] = t;
}
module.exports = exports["default"];


/***/ }),
/* 62 */
/***/ (function(module, exports) {

(function(undefined) {
  'use strict';

  // Node.js usage:
  //
  // var Picker = require('RandomSelection').Picker;
  // var greetingPicker = new Picker(['hello', 'hi', 'howdy']);
  // var greeting = greetingPicker.pick();

  // Our namespace. Exported members will be attached to this.
  var ns;

  // Set our namespace based on whether we are running in Node.js or the browser.
  if (typeof module !== 'undefined' && module.exports) {
    // We are running in Node.
    ns = module.exports;
  }
  else {
    // We are running in the browser.
    // `this` is the `window`.
    // Use window.RandomSelection as our namespace.
    ns = this.RandomSelection = {};
  }

  // Gets a shallow copy of the given array.
  function clone(arr) {
  	var newArr = [];
  	for (var i=0; i<arr.length; i++) {
  		newArr.push(arr[i]);
  	}
  	return newArr;
  }

  // Gets a random option until all options have been returns. Then cycles again.
  function pick() {
    if (this._remainingOptions.length === 0) {
      this._remainingOptions = clone(this._originalOptions);
    }

    var index = Math.floor(Math.random() * this._remainingOptions.length);
    return this._remainingOptions.splice(index, 1)[0];
  }

  // Export our Picker object.
  ns.Picker = function(arrayOfOptions) {
    this._originalOptions = arrayOfOptions;
    this._remainingOptions = [];
  };

  ns.Picker.prototype = {
    pick: pick
  };

}).call(this);


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(64);


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// Generated by CoffeeScript 1.8.0
(function() {
  var Heap, defaultCmp, floor, heapify, heappop, heappush, heappushpop, heapreplace, insort, min, nlargest, nsmallest, updateItem, _siftdown, _siftup;

  floor = Math.floor, min = Math.min;


  /*
  Default comparison function to be used
   */

  defaultCmp = function(x, y) {
    if (x < y) {
      return -1;
    }
    if (x > y) {
      return 1;
    }
    return 0;
  };


  /*
  Insert item x in list a, and keep it sorted assuming a is sorted.
  
  If x is already in a, insert it to the right of the rightmost x.
  
  Optional args lo (default 0) and hi (default a.length) bound the slice
  of a to be searched.
   */

  insort = function(a, x, lo, hi, cmp) {
    var mid;
    if (lo == null) {
      lo = 0;
    }
    if (cmp == null) {
      cmp = defaultCmp;
    }
    if (lo < 0) {
      throw new Error('lo must be non-negative');
    }
    if (hi == null) {
      hi = a.length;
    }
    while (lo < hi) {
      mid = floor((lo + hi) / 2);
      if (cmp(x, a[mid]) < 0) {
        hi = mid;
      } else {
        lo = mid + 1;
      }
    }
    return ([].splice.apply(a, [lo, lo - lo].concat(x)), x);
  };


  /*
  Push item onto heap, maintaining the heap invariant.
   */

  heappush = function(array, item, cmp) {
    if (cmp == null) {
      cmp = defaultCmp;
    }
    array.push(item);
    return _siftdown(array, 0, array.length - 1, cmp);
  };


  /*
  Pop the smallest item off the heap, maintaining the heap invariant.
   */

  heappop = function(array, cmp) {
    var lastelt, returnitem;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    lastelt = array.pop();
    if (array.length) {
      returnitem = array[0];
      array[0] = lastelt;
      _siftup(array, 0, cmp);
    } else {
      returnitem = lastelt;
    }
    return returnitem;
  };


  /*
  Pop and return the current smallest value, and add the new item.
  
  This is more efficient than heappop() followed by heappush(), and can be
  more appropriate when using a fixed size heap. Note that the value
  returned may be larger than item! That constrains reasonable use of
  this routine unless written as part of a conditional replacement:
      if item > array[0]
        item = heapreplace(array, item)
   */

  heapreplace = function(array, item, cmp) {
    var returnitem;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    returnitem = array[0];
    array[0] = item;
    _siftup(array, 0, cmp);
    return returnitem;
  };


  /*
  Fast version of a heappush followed by a heappop.
   */

  heappushpop = function(array, item, cmp) {
    var _ref;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    if (array.length && cmp(array[0], item) < 0) {
      _ref = [array[0], item], item = _ref[0], array[0] = _ref[1];
      _siftup(array, 0, cmp);
    }
    return item;
  };


  /*
  Transform list into a heap, in-place, in O(array.length) time.
   */

  heapify = function(array, cmp) {
    var i, _i, _j, _len, _ref, _ref1, _results, _results1;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    _ref1 = (function() {
      _results1 = [];
      for (var _j = 0, _ref = floor(array.length / 2); 0 <= _ref ? _j < _ref : _j > _ref; 0 <= _ref ? _j++ : _j--){ _results1.push(_j); }
      return _results1;
    }).apply(this).reverse();
    _results = [];
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      i = _ref1[_i];
      _results.push(_siftup(array, i, cmp));
    }
    return _results;
  };


  /*
  Update the position of the given item in the heap.
  This function should be called every time the item is being modified.
   */

  updateItem = function(array, item, cmp) {
    var pos;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    pos = array.indexOf(item);
    if (pos === -1) {
      return;
    }
    _siftdown(array, 0, pos, cmp);
    return _siftup(array, pos, cmp);
  };


  /*
  Find the n largest elements in a dataset.
   */

  nlargest = function(array, n, cmp) {
    var elem, result, _i, _len, _ref;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    result = array.slice(0, n);
    if (!result.length) {
      return result;
    }
    heapify(result, cmp);
    _ref = array.slice(n);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      elem = _ref[_i];
      heappushpop(result, elem, cmp);
    }
    return result.sort(cmp).reverse();
  };


  /*
  Find the n smallest elements in a dataset.
   */

  nsmallest = function(array, n, cmp) {
    var elem, i, los, result, _i, _j, _len, _ref, _ref1, _results;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    if (n * 10 <= array.length) {
      result = array.slice(0, n).sort(cmp);
      if (!result.length) {
        return result;
      }
      los = result[result.length - 1];
      _ref = array.slice(n);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        elem = _ref[_i];
        if (cmp(elem, los) < 0) {
          insort(result, elem, 0, null, cmp);
          result.pop();
          los = result[result.length - 1];
        }
      }
      return result;
    }
    heapify(array, cmp);
    _results = [];
    for (i = _j = 0, _ref1 = min(n, array.length); 0 <= _ref1 ? _j < _ref1 : _j > _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
      _results.push(heappop(array, cmp));
    }
    return _results;
  };

  _siftdown = function(array, startpos, pos, cmp) {
    var newitem, parent, parentpos;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    newitem = array[pos];
    while (pos > startpos) {
      parentpos = (pos - 1) >> 1;
      parent = array[parentpos];
      if (cmp(newitem, parent) < 0) {
        array[pos] = parent;
        pos = parentpos;
        continue;
      }
      break;
    }
    return array[pos] = newitem;
  };

  _siftup = function(array, pos, cmp) {
    var childpos, endpos, newitem, rightpos, startpos;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    endpos = array.length;
    startpos = pos;
    newitem = array[pos];
    childpos = 2 * pos + 1;
    while (childpos < endpos) {
      rightpos = childpos + 1;
      if (rightpos < endpos && !(cmp(array[childpos], array[rightpos]) < 0)) {
        childpos = rightpos;
      }
      array[pos] = array[childpos];
      pos = childpos;
      childpos = 2 * pos + 1;
    }
    array[pos] = newitem;
    return _siftdown(array, startpos, pos, cmp);
  };

  Heap = (function() {
    Heap.push = heappush;

    Heap.pop = heappop;

    Heap.replace = heapreplace;

    Heap.pushpop = heappushpop;

    Heap.heapify = heapify;

    Heap.updateItem = updateItem;

    Heap.nlargest = nlargest;

    Heap.nsmallest = nsmallest;

    function Heap(cmp) {
      this.cmp = cmp != null ? cmp : defaultCmp;
      this.nodes = [];
    }

    Heap.prototype.push = function(x) {
      return heappush(this.nodes, x, this.cmp);
    };

    Heap.prototype.pop = function() {
      return heappop(this.nodes, this.cmp);
    };

    Heap.prototype.peek = function() {
      return this.nodes[0];
    };

    Heap.prototype.contains = function(x) {
      return this.nodes.indexOf(x) !== -1;
    };

    Heap.prototype.replace = function(x) {
      return heapreplace(this.nodes, x, this.cmp);
    };

    Heap.prototype.pushpop = function(x) {
      return heappushpop(this.nodes, x, this.cmp);
    };

    Heap.prototype.heapify = function() {
      return heapify(this.nodes, this.cmp);
    };

    Heap.prototype.updateItem = function(x) {
      return updateItem(this.nodes, x, this.cmp);
    };

    Heap.prototype.clear = function() {
      return this.nodes = [];
    };

    Heap.prototype.empty = function() {
      return this.nodes.length === 0;
    };

    Heap.prototype.size = function() {
      return this.nodes.length;
    };

    Heap.prototype.clone = function() {
      var heap;
      heap = new Heap();
      heap.nodes = this.nodes.slice(0);
      return heap;
    };

    Heap.prototype.toArray = function() {
      return this.nodes.slice(0);
    };

    Heap.prototype.insert = Heap.prototype.push;

    Heap.prototype.top = Heap.prototype.peek;

    Heap.prototype.front = Heap.prototype.peek;

    Heap.prototype.has = Heap.prototype.contains;

    Heap.prototype.copy = Heap.prototype.clone;

    return Heap;

  })();

  (function(root, factory) {
    if (true) {
      return !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else if (typeof exports === 'object') {
      return module.exports = factory();
    } else {
      return root.Heap = factory();
    }
  })(this, function() {
    return Heap;
  });

}).call(this);


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const Stat = __webpack_require__(2).array;
/**
 * Function that returns an array of points given 1D array as follows:
 *
 * [x1, y1, .. , x2, y2, ..]
 *
 * And receive the number of dimensions of each point.
 * @param array
 * @param dimensions
 * @returns {Array} - Array of points.
 */
function coordArrayToPoints(array, dimensions) {
    if(array.length % dimensions !== 0) {
        throw new RangeError('Dimensions number must be accordance with the size of the array.');
    }

    var length = array.length / dimensions;
    var pointsArr = new Array(length);

    var k = 0;
    for(var i = 0; i < array.length; i += dimensions) {
        var point = new Array(dimensions);
        for(var j = 0; j < dimensions; ++j) {
            point[j] = array[i + j];
        }

        pointsArr[k] = point;
        k++;
    }

    return pointsArr;
}


/**
 * Function that given an array as follows:
 * [x1, y1, .. , x2, y2, ..]
 *
 * Returns an array as follows:
 * [[x1, x2, ..], [y1, y2, ..], [ .. ]]
 *
 * And receives the number of dimensions of each coordinate.
 * @param array
 * @param dimensions
 * @returns {Array} - Matrix of coordinates
 */
function coordArrayToCoordMatrix(array, dimensions) {
    if(array.length % dimensions !== 0) {
        throw new RangeError('Dimensions number must be accordance with the size of the array.');
    }

    var coordinatesArray = new Array(dimensions);
    var points = array.length / dimensions;
    for (var i = 0; i < coordinatesArray.length; i++) {
        coordinatesArray[i] = new Array(points);
    }

    for(i = 0; i < array.length; i += dimensions) {
        for(var j = 0; j < dimensions; ++j) {
            var currentPoint = Math.floor(i / dimensions);
            coordinatesArray[j][currentPoint] = array[i + j];
        }
    }

    return coordinatesArray;
}

/**
 * Function that receives a coordinate matrix as follows:
 * [[x1, x2, ..], [y1, y2, ..], [ .. ]]
 *
 * Returns an array of coordinates as follows:
 * [x1, y1, .. , x2, y2, ..]
 *
 * @param coordMatrix
 * @returns {Array}
 */
function coordMatrixToCoordArray(coordMatrix) {
    var coodinatesArray = new Array(coordMatrix.length * coordMatrix[0].length);
    var k = 0;
    for(var i = 0; i < coordMatrix[0].length; ++i) {
        for(var j = 0; j < coordMatrix.length; ++j) {
            coodinatesArray[k] = coordMatrix[j][i];
            ++k;
        }
    }

    return coodinatesArray;
}

/**
 * Tranpose a matrix, this method is for coordMatrixToPoints and
 * pointsToCoordMatrix, that because only transposing the matrix
 * you can change your representation.
 *
 * @param matrix
 * @returns {Array}
 */
function transpose(matrix) {
    var resultMatrix = new Array(matrix[0].length);
    for(var i = 0; i < resultMatrix.length; ++i) {
        resultMatrix[i] = new Array(matrix.length);
    }

    for (i = 0; i < matrix.length; ++i) {
        for(var j = 0; j < matrix[0].length; ++j) {
            resultMatrix[j][i] = matrix[i][j];
        }
    }

    return resultMatrix;
}

/**
 * Function that transform an array of points into a coordinates array
 * as follows:
 * [x1, y1, .. , x2, y2, ..]
 *
 * @param points
 * @returns {Array}
 */
function pointsToCoordArray(points) {
    var coodinatesArray = new Array(points.length * points[0].length);
    var k = 0;
    for(var i = 0; i < points.length; ++i) {
        for(var j = 0; j < points[0].length; ++j) {
            coodinatesArray[k] = points[i][j];
            ++k;
        }
    }

    return coodinatesArray;
}

/**
 * Apply the dot product between the smaller vector and a subsets of the
 * largest one.
 *
 * @param firstVector
 * @param secondVector
 * @returns {Array} each dot product of size of the difference between the
 *                  larger and the smallest one.
 */
function applyDotProduct(firstVector, secondVector) {
    var largestVector, smallestVector;
    if(firstVector.length <= secondVector.length) {
        smallestVector = firstVector;
        largestVector = secondVector;
    } else {
        smallestVector = secondVector;
        largestVector = firstVector;
    }

    var difference = largestVector.length - smallestVector.length + 1;
    var dotProductApplied = new Array(difference);

    for (var i = 0; i < difference; ++i) {
        var sum = 0;
        for (var j = 0; j < smallestVector.length; ++j) {
            sum += smallestVector[j] * largestVector[i + j];
        }
        dotProductApplied[i] = sum;
    }

    return dotProductApplied;
}
/**
 * To scale the input array between the specified min and max values. The operation is performed inplace
 * if the options.inplace is specified. If only one of the min or max parameters is specified, then the scaling
 * will multiply the input array by min/min(input) or max/max(input)
 * @param input
 * @param options
 * @returns {*}
 */
function scale(input, options){
    var y;
    if(options.inPlace){
        y = input;
    }
    else{
        y = new Array(input.length);
    }
    const max = options.max;
    const min = options.min;
    if(typeof max === "number"){
        if(typeof min === "number"){
            var minMax = Stat.minMax(input);
            var factor = (max - min)/(minMax.max-minMax.min);
            for(var i=0;i< y.length;i++){
                y[i]=(input[i]-minMax.min)*factor+min;
            }
        }
        else{
            var currentMin = Stat.max(input);
            var factor = max/currentMin;
            for(var i=0;i< y.length;i++){
                y[i] = input[i]*factor;
            }
        }
    }
    else{
        if(typeof min === "number"){
            var currentMin = Stat.min(input);
            var factor = min/currentMin;
            for(var i=0;i< y.length;i++){
                y[i] = input[i]*factor;
            }
        }
    }
    return y;
}

module.exports = {
    coordArrayToPoints: coordArrayToPoints,
    coordArrayToCoordMatrix: coordArrayToCoordMatrix,
    coordMatrixToCoordArray: coordMatrixToCoordArray,
    coordMatrixToPoints: transpose,
    pointsToCoordArray: pointsToCoordArray,
    pointsToCoordMatrix: transpose,
    applyDotProduct: applyDotProduct,
    scale:scale
};



/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 *
 * Function that returns a Number array of equally spaced numberOfPoints
 * containing a representation of intensities of the spectra arguments x
 * and y.
 *
 * The options parameter contains an object in the following form:
 * from: starting point
 * to: last point
 * numberOfPoints: number of points between from and to
 * variant: "slot" or "smooth" - smooth is the default option
 *
 * The slot variant consist that each point in the new array is calculated
 * averaging the existing points between the slot that belongs to the current
 * value. The smooth variant is the same but takes the integral of the range
 * of the slot and divide by the step size between two points in the new array.
 *
 * @param x - sorted increasing x values
 * @param y
 * @param options
 * @returns {Array} new array with the equally spaced data.
 *
 */
function getEquallySpacedData(x, y, options) {
    if (x.length>1 && x[0]>x[1]) {
        x=x.slice().reverse();
        y=y.slice().reverse();
    }

    var xLength = x.length;
    if(xLength !== y.length)
        throw new RangeError("the x and y vector doesn't have the same size.");

    if (options === undefined) options = {};

    var from = options.from === undefined ? x[0] : options.from
    if (isNaN(from) || !isFinite(from)) {
        throw new RangeError("'From' value must be a number");
    }
    var to = options.to === undefined ? x[x.length - 1] : options.to;
    if (isNaN(to) || !isFinite(to)) {
        throw new RangeError("'To' value must be a number");
    }

    var reverse = from > to;
    if(reverse) {
        var temp = from;
        from = to;
        to = temp;
    }

    var numberOfPoints = options.numberOfPoints === undefined ? 100 : options.numberOfPoints;
    if (isNaN(numberOfPoints) || !isFinite(numberOfPoints)) {
        throw new RangeError("'Number of points' value must be a number");
    }
    if(numberOfPoints < 1)
        throw new RangeError("the number of point must be higher than 1");

    var algorithm = options.variant === "slot" ? "slot" : "smooth"; // default value: smooth

    var output = algorithm === "slot" ? getEquallySpacedSlot(x, y, from, to, numberOfPoints) : getEquallySpacedSmooth(x, y, from, to, numberOfPoints);

    return reverse ? output.reverse() : output;
}

/**
 * function that retrieves the getEquallySpacedData with the variant "smooth"
 *
 * @param x
 * @param y
 * @param from - Initial point
 * @param to - Final point
 * @param numberOfPoints
 * @returns {Array} - Array of y's equally spaced with the variant "smooth"
 */
function getEquallySpacedSmooth(x, y, from, to, numberOfPoints) {
    var xLength = x.length;

    var step = (to - from) / (numberOfPoints - 1);
    var halfStep = step / 2;

    var start = from - halfStep;
    var output = new Array(numberOfPoints);

    var initialOriginalStep = x[1] - x[0];
    var lastOriginalStep = x[x.length - 1] - x[x.length - 2];

    // Init main variables
    var min = start;
    var max = start + step;

    var previousX = Number.MIN_VALUE;
    var previousY = 0;
    var nextX = x[0] - initialOriginalStep;
    var nextY = 0;

    var currentValue = 0;
    var slope = 0;
    var intercept = 0;
    var sumAtMin = 0;
    var sumAtMax = 0;

    var i = 0; // index of input
    var j = 0; // index of output

    function getSlope(x0, y0, x1, y1) {
        return (y1 - y0) / (x1 - x0);
    }

    main: while(true) {
        while (nextX - max >= 0) {
            // no overlap with original point, just consume current value
            var add = integral(0, max - previousX, slope, previousY);
            sumAtMax = currentValue + add;

            output[j] = (sumAtMax - sumAtMin) / step;
            j++;

            if (j === numberOfPoints)
                break main;

            min = max;
            max += step;
            sumAtMin = sumAtMax;
        }

        if(previousX <= min && min <= nextX) {
            add = integral(0, min - previousX, slope, previousY);
            sumAtMin = currentValue + add;
        }

        currentValue += integral(previousX, nextX, slope, intercept);

        previousX = nextX;
        previousY = nextY;

        if (i < xLength) {
            nextX = x[i];
            nextY = y[i];
            i++;
        } else if (i === xLength) {
            nextX += lastOriginalStep;
            nextY = 0;
        }
        // updating parameters
        slope = getSlope(previousX, previousY, nextX, nextY);
        intercept = -slope*previousX + previousY;
    }

    return output;
}

/**
 * function that retrieves the getEquallySpacedData with the variant "slot"
 *
 * @param x
 * @param y
 * @param from - Initial point
 * @param to - Final point
 * @param numberOfPoints
 * @returns {Array} - Array of y's equally spaced with the variant "slot"
 */
function getEquallySpacedSlot(x, y, from, to, numberOfPoints) {
    var xLength = x.length;

    var step = (to - from) / (numberOfPoints - 1);
    var halfStep = step / 2;
    var lastStep = x[x.length - 1] - x[x.length - 2];

    var start = from - halfStep;
    var output = new Array(numberOfPoints);

    // Init main variables
    var min = start;
    var max = start + step;

    var previousX = -Number.MAX_VALUE;
    var previousY = 0;
    var nextX = x[0];
    var nextY = y[0];
    var frontOutsideSpectra = 0;
    var backOutsideSpectra = true;

    var currentValue = 0;

    // for slot algorithm
    var currentPoints = 0;

    var i = 1; // index of input
    var j = 0; // index of output

    main: while(true) {
        if (previousX>=nextX) throw (new Error('x must be an increasing serie'));
        while (previousX - max > 0) {
            // no overlap with original point, just consume current value
            if(backOutsideSpectra) {
                currentPoints++;
                backOutsideSpectra = false;
            }

            output[j] = currentPoints <= 0 ? 0 : currentValue / currentPoints;
            j++;

            if (j === numberOfPoints)
                break main;

            min = max;
            max += step;
            currentValue = 0;
            currentPoints = 0;
        }

        if(previousX > min) {
            currentValue += previousY;
            currentPoints++;
        }

        if(previousX === -Number.MAX_VALUE || frontOutsideSpectra > 1)
            currentPoints--;

        previousX = nextX;
        previousY = nextY;

        if (i < xLength) {
            nextX = x[i];
            nextY = y[i];
            i++;
        } else {
            nextX += lastStep;
            nextY = 0;
            frontOutsideSpectra++;
        }
    }

    return output;
}
/**
 * Function that calculates the integral of the line between two
 * x-coordinates, given the slope and intercept of the line.
 *
 * @param x0
 * @param x1
 * @param slope
 * @param intercept
 * @returns {number} integral value.
 */
function integral(x0, x1, slope, intercept) {
    return (0.5 * slope * x1 * x1 + intercept * x1) - (0.5 * slope * x0 * x0 + intercept * x0);
}

exports.getEquallySpacedData = getEquallySpacedData;
exports.integral = integral;

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.SNV = SNV;
var Stat = __webpack_require__(2).array;

/**
 * Function that applies the standard normal variate (SNV) to an array of values.
 *
 * @param data - Array of values.
 * @returns {Array} - applied the SNV.
 */
function SNV(data) {
    var mean = Stat.mean(data);
    var std = Stat.standardDeviation(data);
    var result = data.slice();
    for (var i = 0; i < data.length; i++) {
        result[i] = (result[i] - mean) / std;
    }
    return result;
}


/***/ }),
/* 68 */
/***/ (function(module, exports) {

// auxiliary file to create the 256 look at table elements

var ans = new Array(256);
for (var i = 0; i < 256; i++) {
    var num = i;
    var c = 0;
    while (num) {
        num = num & (num - 1);
        c++;
    }
    ans[i] = c;
}

module.exports = ans;

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const defaultOptions = {
    mode: 'index'
};

module.exports = function *(M, N, options) {
    options = Object.assign({}, defaultOptions, options);
    var a = new Array(N);
    var c = new Array(M);
    var b = new Array(N);
    var p = new Array(N + 2);
    var x, y, z;

    // init a and b
    for (var i = 0; i < N; i++) {
        a[i] = i;
        if (i < N - M) b[i] = 0;
        else b[i] = 1;
    }

    // init c
    for (i = 0; i < M; i++) {
        c[i] = N - M + i;
    }

    // init p
    for (i = 0; i < p.length; i++) {
        if (i === 0) p[i] = N + 1;
        else if (i <= N - M) p[i] = 0;
        else if (i <= N) p[i] = i - N + M;
        else p[i] = -2;
    }

    function twiddle() {
        var i, j, k;
        j = 1;
        while (p[j] <= 0)
            j++;
        if (p[j - 1] === 0) {
            for (i = j - 1; i !== 1; i--)
                p[i] = -1;
            p[j] = 0;
            x = z = 0;
            p[1] = 1;
            y = j - 1;
        } else {
            if (j > 1)
                p[j - 1] = 0;
            do
                j++;
            while (p[j] > 0);
            k = j - 1;
            i = j;
            while (p[i] === 0)
                p[i++] = -1;
            if (p[i] === -1) {
                p[i] = p[k];
                z = p[k] - 1;
                x = i - 1;
                y = k - 1;
                p[k] = -1;
            } else {
                if (i === p[0]) {
                    return 0;
                } else {
                    p[j] = p[i];
                    z = p[i] - 1;
                    p[i] = 0;
                    x = j - 1;
                    y = i - 1;
                }
            }
        }
        return 1;
    }

    if (options.mode === 'index') {
        yield c.slice();
        while (twiddle()) {
            c[z] = a[x];
            yield c.slice();
        }
    } else if (options.mode === 'mask') {
        yield b.slice();
        while (twiddle()) {
            b[x] = 1;
            b[y] = 0;
            yield b.slice();
        }
    } else {
        throw new Error('Invalid mode');
    }
};


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * ConfusionMatrix class
 */
class ConfusionMatrix {
    /**
     * Constructor
     * @param {Array} matrix - The confusion matrix, a 2D Array
     * @param {Array} labels - Labels of the confusion matrix, a 1D Array
     */
    constructor(matrix, labels) {
        if (matrix.length !== matrix[0].length) {
            throw new Error('Confusion matrix must be square');
        }
        if (labels.length !== matrix.length) {
            throw new Error('Confusion matrix and labels should have the same length');
        }
        this.labels = labels;
        this.matrix = matrix;

    }

    /**
     * Compute the general prediction accuracy
     * @returns {number} - The prediction accuracy ([0-1]
     */
    get accuracy() {
        var correct = 0, incorrect = 0;
        for (var i = 0; i < this.matrix.length; i++) {
            for (var j = 0; j < this.matrix.length; j++) {
                if (i === j) correct += this.matrix[i][j];
                else incorrect += this.matrix[i][j];
            }
        }

        return correct / (correct + incorrect);
    }

    /**
     * Compute the number of predicted observations
     * @returns {number} - The number of predicted observations
     */
    get nbPredicted() {
        var predicted = 0;
        for (var i = 0; i < this.matrix.length; i++) {
            for (var j = 0; j < this.matrix.length; j++) {
                predicted += this.matrix[i][j];
            }
        }
        return predicted;
    }
}

module.exports = ConfusionMatrix;


/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by acastillo on 8/5/15.
 */
var Matrix = __webpack_require__(0);
var math = __webpack_require__(22);

var DEBUG = false;
/** Levenberg Marquardt curve-fitting: minimize sum of weighted squared residuals
 ----------  INPUT  VARIABLES  -----------
 func   = function of n independent variables, 't', and m parameters, 'p',
 returning the simulated model: y_hat = func(t,p,c)
 p      = n-vector of initial guess of parameter values
 t      = m-vectors or matrix of independent variables (used as arg to func)
 y_dat  = m-vectors or matrix of data to be fit by func(t,p)
 weight = weighting vector for least squares fit ( weight >= 0 ) ...
 inverse of the standard measurement errors
 Default:  sqrt(d.o.f. / ( y_dat' * y_dat ))
 dp     = fractional increment of 'p' for numerical derivatives
 dp(j)>0 central differences calculated
 dp(j)<0 one sided 'backwards' differences calculated
 dp(j)=0 sets corresponding partials to zero; i.e. holds p(j) fixed
 Default:  0.001;
 p_min  = n-vector of lower bounds for parameter values
 p_max  = n-vector of upper bounds for parameter values
 c      = an optional matrix of values passed to func(t,p,c)
 opts   = vector of algorithmic parameters
 parameter    defaults    meaning
 opts(1)  =  prnt            3        >1 intermediate results; >2 plots
 opts(2)  =  MaxIter      10*Npar     maximum number of iterations
 opts(3)  =  epsilon_1       1e-3     convergence tolerance for gradient
 opts(4)  =  epsilon_2       1e-3     convergence tolerance for parameters
 opts(5)  =  epsilon_3       1e-3     convergence tolerance for Chi-square
 opts(6)  =  epsilon_4       1e-2     determines acceptance of a L-M step
 opts(7)  =  lambda_0        1e-2     initial value of L-M paramter
 opts(8)  =  lambda_UP_fac   11       factor for increasing lambda
 opts(9)  =  lambda_DN_fac    9       factor for decreasing lambda
 opts(10) =  Update_Type      1       1: Levenberg-Marquardt lambda update
 2: Quadratic update
 3: Nielsen's lambda update equations

 ----------  OUTPUT  VARIABLES  -----------
 p       = least-squares optimal estimate of the parameter values
 X2      = Chi squared criteria
 sigma_p = asymptotic standard error of the parameters
 sigma_y = asymptotic standard error of the curve-fit
 corr    = correlation matrix of the parameters
 R_sq    = R-squared cofficient of multiple determination
 cvg_hst = convergence history

 Henri Gavin, Dept. Civil & Environ. Engineering, Duke Univ. 22 Sep 2013
 modified from: http://octave.sourceforge.net/optim/function/leasqr.html
 using references by
 Press, et al., Numerical Recipes, Cambridge Univ. Press, 1992, Chapter 15.
 Sam Roweis       http://www.cs.toronto.edu/~roweis/notes/lm.pdf
 Manolis Lourakis http://www.ics.forth.gr/~lourakis/levmar/levmar.pdf
 Hans Nielson     http://www2.imm.dtu.dk/~hbn/publ/TR9905.ps
 Mathworks        optimization toolbox reference manual
 K. Madsen, H.B., Nielsen, and O. Tingleff
 http://www2.imm.dtu.dk/pubdb/views/edoc_download.php/3215/pdf/imm3215.pdf
 */
var LM = {

    optimize: function(func,p,t,y_dat,weight,dp,p_min,p_max,c,opts){

        var tensor_parameter = 0;			// set to 1 of parameter is a tensor

        var iteration  = 0;			// iteration counter
        //func_calls = 0;			// running count of function evaluations

        if((typeof p[0])!="object"){
            for(var i=0;i< p.length;i++){
                p[i]=[p[i]];
            }

        }
        //p = p(:); y_dat = y_dat(:); 		// make column vectors
        var i,k;
        var eps = 2^-52;
        var Npar   = p.length;//length(p); 			// number of parameters
        var Npnt   = y_dat.length;//length(y_dat);		// number of data points
        var p_old  = Matrix.zeros(Npar,1);		// previous set of parameters
        var y_old  = Matrix.zeros(Npnt,1);		// previous model, y_old = y_hat(t;p_old)
        var X2     = 1e-2/eps;			// a really big initial Chi-sq value
        var X2_old = 1e-2/eps;			// a really big initial Chi-sq value
        var J =  Matrix.zeros(Npnt,Npar);


        if (t.length != y_dat.length) {
            console.log('lm.m error: the length of t must equal the length of y_dat');

            length_t = t.length;
            length_y_dat = y_dat.length;
            var X2 = 0, corr = 0, sigma_p = 0, sigma_y = 0, R_sq = 0, cvg_hist = 0;
            if (!tensor_parameter) {
                return;
            }
        }

        weight = weight||Math.sqrt((Npnt-Npar+1)/(math.multiply(math.transpose(y_dat),y_dat)));
        dp = dp || 0.001;
        p_min   = p_min || math.multiply(Math.abs(p),-100);
        p_max   = p_max || math.multiply(Math.abs(p),100);
        c = c || 1;
        // Algorithmic Paramters
        //prnt MaxIter  eps1  eps2  epx3  eps4  lam0  lamUP lamDN UpdateType
        opts = opts ||[  3,10*Npar, 1e-3, 1e-3, 1e-3, 1e-2, 1e-2, 11, 9, 1 ];

        var prnt          = opts[0];	// >1 intermediate results; >2 plots
        var MaxIter       = opts[1];	// maximum number of iterations
        var epsilon_1     = opts[2];	// convergence tolerance for gradient
        var epsilon_2     = opts[3];	// convergence tolerance for parameter
        var epsilon_3     = opts[4];	// convergence tolerance for Chi-square
        var epsilon_4     = opts[5];	// determines acceptance of a L-M step
        var lambda_0      = opts[6];	// initial value of damping paramter, lambda
        var lambda_UP_fac = opts[7];	// factor for increasing lambda
        var lambda_DN_fac = opts[8];	// factor for decreasing lambda
        var Update_Type   = opts[9];	// 1: Levenberg-Marquardt lambda update
        // 2: Quadratic update
        // 3: Nielsen's lambda update equations

        if ( tensor_parameter && prnt == 3 ) prnt = 2;


        if(!dp.length || dp.length == 1){
            var dp_array = new Array(Npar);
            for(var i=0;i<Npar;i++)
                dp_array[i]=[dp];
            dp=dp_array;
        }

        // indices of the parameters to be fit
        var idx   = [];
        for(i=0;i<dp.length;i++){
            if(dp[i][0]!=0){
                idx.push(i);
            }
        }

        var Nfit = idx.length;			// number of parameters to fit
        var stop = false;				// termination flag

        var weight_sq = null;
        //console.log(weight);
        if ( !weight.length || weight.length < Npnt )	{
            // squared weighting vector
            //weight_sq = ( weight(1)*ones(Npnt,1) ).^2;
            //console.log("weight[0] "+typeof weight[0]);
            var tmp = math.multiply(Matrix.ones(Npnt,1),weight[0]);
            weight_sq = math.dotMultiply(tmp,tmp);
        }
        else{
            //weight_sq = (weight(:)).^2;
            weight_sq = math.dotMultiply(weight,weight);
        }


        // initialize Jacobian with finite difference calculation
        //console.log("J "+weight_sq);
        var result = this.lm_matx(func,t,p_old,y_old,1,J,p,y_dat,weight_sq,dp,c);
        var JtWJ = result.JtWJ,JtWdy=result.JtWdy,X2=result.Chi_sq,y_hat=result.y_hat,J=result.J;
        //[JtWJ,JtWdy,X2,y_hat,J] = this.lm_matx(func,t,p_old,y_old,1,J,p,y_dat,weight_sq,dp,c);
        //console.log(JtWJ);

        if ( Math.max(Math.abs(JtWdy)) < epsilon_1 ){
            console.log(' *** Your Initial Guess is Extremely Close to Optimal ***')
            console.log(' *** epsilon_1 = ', epsilon_1);
            stop = true;
        }


        switch(Update_Type){
            case 1: // Marquardt: init'l lambda
                lambda  = lambda_0;
                break;
            default:    // Quadratic and Nielsen
                lambda  = lambda_0 * Math.max(math.diag(JtWJ));
                nu=2;
        }
        //console.log(X2);
        X2_old = X2; // previous value of X2
        //console.log(MaxIter+" "+Npar);
        //var cvg_hst = Matrix.ones(MaxIter,Npar+3);		// initialize convergence history
        var h = null;
        while ( !stop && iteration <= MaxIter ) {		// --- Main Loop
            iteration = iteration + 1;
            // incremental change in parameters
            switch(Update_Type){
                case 1:					// Marquardt
                    //h = ( JtWJ + lambda * math.diag(math.diag(JtWJ)) ) \ JtWdy;
                    //h = math.multiply(math.inv(JtWdy),math.add(JtWJ,math.multiply(lambda,math.diag(math.diag(Npar)))));
                    h = math.solve(math.add(JtWJ,math.multiply(math.diag(math.diag(JtWJ)),lambda)),JtWdy);
                    break;
                default:					// Quadratic and Nielsen
                    //h = ( JtWJ + lambda * math.eye(Npar) ) \ JtWdy;

                    h = math.solve(math.add(JtWJ,math.multiply( Matrix.eye(Npar),lambda)),JtWdy);
            }

            /*for(var k=0;k< h.length;k++){
             h[k]=[h[k]];
             }*/
            //console.log("h "+h);
            //h=math.matrix(h);
            //  big = max(abs(h./p)) > 2;
            //this is a big step
            // --- Are parameters [p+h] much better than [p] ?
            var hidx = new Array(idx.length);
            for(k=0;k<idx.length;k++){
                hidx[k]=h[idx[k]];
            }
            var p_try = math.add(p, hidx);// update the [idx] elements

            for(k=0;k<p_try.length;k++){
                p_try[k][0]=Math.min(Math.max(p_min[k][0],p_try[k][0]),p_max[k][0]);
            }
            // p_try = Math.min(Math.max(p_min,p_try),p_max);           // apply constraints

            var delta_y = math.subtract(y_dat, func(t,p_try,c));       // residual error using p_try
            //func_calls = func_calls + 1;
            //X2_try = delta_y' * ( delta_y .* weight_sq );  // Chi-squared error criteria

            var X2_try = math.multiply(math.transpose(delta_y),math.dotMultiply(delta_y,weight_sq));

            if ( Update_Type == 2 ){  			  // Quadratic
                //    One step of quadratic line update in the h direction for minimum X2
                //var alpha =  JtWdy'*h / ( (X2_try - X2)/2 + 2*JtWdy'*h ) ;
                var JtWdy_th = math.multiply(math.transpose(JtWdy),h);
                var alpha =  math.multiply(JtWdy_th,math.inv(math.add(math.multiply(math.subtract(X2_try - X2),1/2)),math.multiply(JtWdy_th,2)));//JtWdy'*h / ( (X2_try - X2)/2 + 2*JtWdy'*h ) ;

                h = math.multiply(alpha, h);
                for(var k=0;k<idx.length;k++){
                    hidx[k]=h[idx[k]];
                }

                p_try = math.add(p ,hidx);                     // update only [idx] elements
                p_try = math.min(math.max(p_min,p_try),p_max);          // apply constraints

                delta_y = math.subtract(y_dat, func(t,p_try,c));      // residual error using p_try
                // func_calls = func_calls + 1;
                //X2_try = delta_y' * ( delta_y .* weight_sq ); // Chi-squared error criteria
                X2_try = math.multiply(math.transpose(delta_y), mat.dotMultiply(delta_y, weight_sq));
            }

            //rho = (X2 - X2_try) / ( 2*h' * (lambda * h + JtWdy) ); // Nielsen
            var rho = (X2-X2_try)/math.multiply(math.multiply(math.transpose(h),2),math.add(math.multiply(lambda, h),JtWdy));
            //console.log("rho "+rho);
            if ( rho > epsilon_4 ) {		// it IS significantly better
                //console.log("Here");
                dX2 = X2 - X2_old;
                X2_old = X2;
                p_old = p;
                y_old = y_hat;
                p = p_try;			// accept p_try

                result = this.lm_matx(func, t, p_old, y_old, dX2, J, p, y_dat, weight_sq, dp, c);
                JtWJ = result.JtWJ,JtWdy=result.JtWdy,X2=result.Chi_sq,y_hat=result.y_hat,J=result.J;
                // decrease lambda ==> Gauss-Newton method

                switch (Update_Type) {
                    case 1:							// Levenberg
                        lambda = Math.max(lambda / lambda_DN_fac, 1.e-7);
                        break;
                    case 2:							// Quadratic
                        lambda = Math.max(lambda / (1 + alpha), 1.e-7);
                        break;
                    case 3:							// Nielsen
                        lambda = math.multiply(Math.max(1 / 3, 1 - (2 * rho - 1) ^ 3),lambda);
                        nu = 2;
                        break;
                }
            }
            else {					// it IS NOT better
                X2 = X2_old;			// do not accept p_try
                if (iteration%(2 * Npar)==0) {	// rank-1 update of Jacobian
                    result = this.lm_matx(func, t, p_old, y_old, -1, J, p, y_dat, weight_sq, dp, c);
                    JtWJ = result.JtWJ,JtWdy=result.JtWdy,dX2=result.Chi_sq,y_hat=result.y_hat,J=result.J;
                }

                // increase lambda  ==> gradient descent method
                switch (Update_Type) {
                    case 1:							// Levenberg
                        lambda = Math.min(lambda * lambda_UP_fac, 1.e7);
                        break;
                    case 2:							// Quadratic
                        lambda = lambda + Math.abs((X2_try - X2) / 2 / alpha);
                        break;
                    case 3:						// Nielsen
                        lambda = lambda * nu;
                        nu = 2 * nu;
                        break;
                }
            }
        }// --- End of Main Loop

        // --- convergence achieved, find covariance and confidence intervals

        // equal weights for paramter error analysis
        weight_sq = math.multiply(math.multiply(math.transpose(delta_y),delta_y), Matrix.ones(Npnt,1));

        weight_sq.apply(function(i,j){
            weight_sq[i][j] = (Npnt-Nfit+1)/weight_sq[i][j];
        });
        //console.log(weight_sq);
        result = this.lm_matx(func,t,p_old,y_old,-1,J,p,y_dat,weight_sq,dp,c);
        JtWJ = result.JtWJ,JtWdy=result.JtWdy,X2=result.Chi_sq,y_hat=result.y_hat,J=result.J;

        /*if nargout > 2				// standard error of parameters
         covar = inv(JtWJ);
         sigma_p = sqrt(diag(covar));
         end

         if nargout > 3				// standard error of the fit
         //  sigma_y = sqrt(diag(J * covar * J'));	// slower version of below
         sigma_y = zeros(Npnt,1);
         for i=1:Npnt
         sigma_y(i) = J(i,:) * covar * J(i,:)';
         end
         sigma_y = sqrt(sigma_y);
         end

         if nargout > 4				// parameter correlation matrix
         corr = covar ./ [sigma_p*sigma_p'];
         end

         if nargout > 5				// coefficient of multiple determination
         R_sq = corrcoef([y_dat y_hat]);
         R_sq = R_sq(1,2).^2;
         end

         if nargout > 6				// convergence history
         cvg_hst = cvg_hst(1:iteration,:);
         end*/

        // endfunction  # ---------------------------------------------------------- LM

        return { p:p, X2:X2};
    },

    lm_FD_J:function(func,t,p,y,dp,c) {
        // J = lm_FD_J(func,t,p,y,{dp},{c})
        //
        // partial derivatives (Jacobian) dy/dp for use with lm.m
        // computed via Finite Differences
        // Requires n or 2n function evaluations, n = number of nonzero values of dp
        // -------- INPUT VARIABLES ---------
        // func = function of independent variables, 't', and parameters, 'p',
        //        returning the simulated model: y_hat = func(t,p,c)
        // t  = m-vector of independent variables (used as arg to func)
        // p  = n-vector of current parameter values
        // y  = func(t,p,c) n-vector initialised by user before each call to lm_FD_J
        // dp = fractional increment of p for numerical derivatives
        //      dp(j)>0 central differences calculated
        //      dp(j)<0 one sided differences calculated
        //      dp(j)=0 sets corresponding partials to zero; i.e. holds p(j) fixed
        //      Default:  0.001;
        // c  = optional vector of constants passed to y_hat = func(t,p,c)
        //---------- OUTPUT VARIABLES -------
        // J  = Jacobian Matrix J(i,j)=dy(i)/dp(j)	i=1:n; j=1:m

        //   Henri Gavin, Dept. Civil & Environ. Engineering, Duke Univ. November 2005
        //   modified from: ftp://fly.cnuce.cnr.it/pub/software/octave/leasqr/
        //   Press, et al., Numerical Recipes, Cambridge Univ. Press, 1992, Chapter 15.

        var m = y.length;			// number of data points
        var n = p.length;			// number of parameters

        dp = dp || math.multiply( Matrix.ones(n, 1), 0.001);

        var ps = p.clone();//JSON.parse(JSON.stringify(p));
        //var ps = $.extend(true, [], p);
        var J = new Matrix(m,n), del =new Array(n);         // initialize Jacobian to Zero

        for (var j = 0;j < n; j++) {
            //console.log(j+" "+dp[j]+" "+p[j]+" "+ps[j]+" "+del[j]);
            del[j] = dp[j]*(1+Math.abs(p[j][0]));  // parameter perturbation
            p[j] = [ps[j][0]+del[j]];	      // perturb parameter p(j)
            //console.log(j+" "+dp[j]+" "+p[j]+" "+ps[j]+" "+del[j]);

            if (del[j] != 0){
                y1 = func(t, p, c);
                //func_calls = func_calls + 1;
                if (dp[j][0] < 0) {		// backwards difference
                    //J(:,j) = math.dotDivide(math.subtract(y1, y),del[j]);//. / del[j];
                    //console.log(del[j]);
                    //console.log(y);
                    var column = math.dotDivide(math.subtract(y1, y),del[j]);
                    for(var k=0;k< m;k++){
                        J[k][j]=column[k][0];
                    }
                    //console.log(column);
                }
                else{
                    p[j][0] = ps[j][0] - del[j];
                    //J(:,j) = (y1 - feval(func, t, p, c)). / (2. * del[j]);
                    var column = math.dotDivide(math.subtract(y1,func(t,p,c)),2*del[j]);
                    for(var k=0;k< m;k++){
                        J[k][j]=column[k][0];
                    }

                }			// central difference, additional func call
            }

            p[j] = ps[j];		// restore p(j)

        }
        //console.log("lm_FD_J: "+ JSON.stringify(J));
        return J;

    },

    // endfunction # -------------------------------------------------- LM_FD_J
    lm_Broyden_J: function(p_old,y_old,J,p,y){
        // J = lm_Broyden_J(p_old,y_old,J,p,y)
        // carry out a rank-1 update to the Jacobian matrix using Broyden's equation
        //---------- INPUT VARIABLES -------
        // p_old = previous set of parameters
        // y_old = model evaluation at previous set of parameters, y_hat(t;p_old)
        // J  = current version of the Jacobian matrix
        // p     = current  set of parameters
        // y     = model evaluation at current  set of parameters, y_hat(t;p)
        //---------- OUTPUT VARIABLES -------
        // J = rank-1 update to Jacobian Matrix J(i,j)=dy(i)/dp(j)	i=1:n; j=1:m
        //console.log(p+" X "+ p_old)
        var h  = math.subtract(p, p_old);

        //console.log("hhh "+h);
        var h_t = math.transpose(h);
        h_t.div(math.multiply(h_t,h));

        //console.log(h_t);
        //J = J + ( y - y_old - J*h )*h' / (h'*h);	// Broyden rank-1 update eq'n
        J = math.add(J, math.multiply(math.subtract(y, math.add(y_old,math.multiply(J,h))),h_t));
        return J;
        // endfunction # ---------------------------------------------- LM_Broyden_J
    },

    lm_matx : function (func,t,p_old,y_old,dX2,J,p,y_dat,weight_sq,dp,c,iteration){
        // [JtWJ,JtWdy,Chi_sq,y_hat,J] = this.lm_matx(func,t,p_old,y_old,dX2,J,p,y_dat,weight_sq,{da},{c})
        //
        // Evaluate the linearized fitting matrix, JtWJ, and vector JtWdy,
        // and calculate the Chi-squared error function, Chi_sq
        // Used by Levenberg-Marquard algorithm, lm.m
        // -------- INPUT VARIABLES ---------
        // func   = function ofpn independent variables, p, and m parameters, p,
        //         returning the simulated model: y_hat = func(t,p,c)
        // t      = m-vectors or matrix of independent variables (used as arg to func)
        // p_old  = n-vector of previous parameter values
        // y_old  = m-vector of previous model ... y_old = y_hat(t;p_old);
        // dX2    = previous change in Chi-squared criteria
        // J   = m-by-n Jacobian of model, y_hat, with respect to parameters, p
        // p      = n-vector of current  parameter values
        // y_dat  = n-vector of data to be fit by func(t,p,c)
        // weight_sq = square of the weighting vector for least squares fit ...
        //	    inverse of the standard measurement errors
        // dp     = fractional increment of 'p' for numerical derivatives
        //          dp(j)>0 central differences calculated
        //          dp(j)<0 one sided differences calculated
        //          dp(j)=0 sets corresponding partials to zero; i.e. holds p(j) fixed
        //          Default:  0.001;
        // c      = optional vector of constants passed to y_hat = func(t,p,c)
        //---------- OUTPUT VARIABLES -------
        // JtWJ	 = linearized Hessian matrix (inverse of covariance matrix)
        // JtWdy   = linearized fitting vector
        // Chi_sq = Chi-squared criteria: weighted sum of the squared residuals WSSR
        // y_hat  = model evaluated with parameters 'p'
        // J   = m-by-n Jacobian of model, y_hat, with respect to parameters, p

        //   Henri Gavin, Dept. Civil & Environ. Engineering, Duke Univ. November 2005
        //   modified from: ftp://fly.cnuce.cnr.it/pub/software/octave/leasqr/
        //   Press, et al., Numerical Recipes, Cambridge Univ. Press, 1992, Chapter 15.


        var Npnt = y_dat.length;		// number of data points
        var Npar = p.length;		// number of parameters

        dp = dp || 0.001;


        //var JtWJ = new Matrix.zeros(Npar);
        //var JtWdy  = new Matrix.zeros(Npar,1);

        var y_hat = func(t,p,c);	// evaluate model using parameters 'p'
        //func_calls = func_calls + 1;
        //console.log(J);
        if ( (iteration%(2*Npar))==0 || dX2 > 0 ) {
            //console.log("Par");
            J = this.lm_FD_J(func, t, p, y_hat, dp, c);		// finite difference
        }
        else{
            //console.log("ImPar");
            J = this.lm_Broyden_J(p_old, y_old, J, p, y_hat); // rank-1 update
        }
        //console.log(y_dat);
        //console.log(y_hat);
        var delta_y = math.subtract(y_dat, y_hat);	// residual error between model and data
        //console.log(delta_y[0][0]);
        //console.log(delta_y.rows+" "+delta_y.columns+" "+JSON.stringify(weight_sq));
        //var Chi_sq = delta_y' * ( delta_y .* weight_sq ); 	// Chi-squared error criteria
        var Chi_sq = math.multiply(math.transpose(delta_y),math.dotMultiply(delta_y,weight_sq));
        //JtWJ  = J' * ( J .* ( weight_sq * ones(1,Npar) ) );
        var Jt = math.transpose(J);

        //console.log(weight_sq);

        var JtWJ = math.multiply(Jt, math.dotMultiply(J,math.multiply(weight_sq, Matrix.ones(1,Npar))));

        //JtWdy = J' * ( weight_sq .* delta_y );
        var JtWdy = math.multiply(Jt, math.dotMultiply(weight_sq,delta_y));


        return {JtWJ:JtWJ,JtWdy:JtWdy,Chi_sq:Chi_sq,y_hat:y_hat,J:J};
        // endfunction  # ------------------------------------------------------ LM_MATX
    }



};

module.exports = LM;

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.additiveSymmetric = __webpack_require__(73);
exports.avg = __webpack_require__(74);
exports.bhattacharyya = __webpack_require__(75);
exports.canberra = __webpack_require__(76);
exports.chebyshev = __webpack_require__(77);
exports.clark = __webpack_require__(78);
exports.czekanowski = __webpack_require__(79);
exports.dice = __webpack_require__(23);
exports.divergence = __webpack_require__(80);
exports.euclidean = __webpack_require__(1);
exports.fidelity = __webpack_require__(81);
exports.gower = __webpack_require__(82);
exports.harmonicMean = __webpack_require__(83);
exports.hellinger = __webpack_require__(84);
exports.innerProduct = __webpack_require__(85);
exports.intersection = __webpack_require__(24);
exports.jaccard = __webpack_require__(25);
exports.jeffreys = __webpack_require__(86);
exports.jensenDifference = __webpack_require__(87);
exports.jensenShannon = __webpack_require__(88);
exports.kdivergence = __webpack_require__(89);
exports.kulczynski = __webpack_require__(26);
exports.kullbackLeibler = __webpack_require__(90);
exports.kumarHassebrook = __webpack_require__(91);
exports.kumarJohnson = __webpack_require__(92);
exports.lorentzian = __webpack_require__(93);
exports.manhattan = __webpack_require__(94);
exports.matusita = __webpack_require__(95);
exports.minkowski = __webpack_require__(96);
exports.motyka = __webpack_require__(27);
exports.neyman = __webpack_require__(97);
exports.pearson = __webpack_require__(98);
exports.probabilisticSymmetric = __webpack_require__(99);
exports.ruzicka = __webpack_require__(100);
exports.soergel = __webpack_require__(101);
exports.sorensen = __webpack_require__(102);
exports.squared = __webpack_require__(103);
exports.squaredChord = __webpack_require__(28);
exports.squaredEuclidean = __webpack_require__(1).squared;
exports.taneja = __webpack_require__(104);
exports.tanimoto = __webpack_require__(105);
exports.topsoe = __webpack_require__(106);
exports.tree = __webpack_require__(161);
exports.waveHedges = __webpack_require__(107);


/***/ }),
/* 73 */
/***/ (function(module, exports) {

module.exports = function additiveSymmetric(a, b) {
    var i = 0,
        ii = a.length,
        d = 0;
    for (; i < ii; i++) {
        d += ((a[i] - b[i]) * (a[i] - b[i]) * (a[i] + b[i])) / (a[i] * b[i]);
    }
    return 2 * d;
};


/***/ }),
/* 74 */
/***/ (function(module, exports) {

module.exports = function avg(a, b) {
    var ii = a.length,
        max = 0,
        ans = 0,
        aux = 0;
    for (var i = 0; i < ii ; i++) {
        aux = Math.abs(a[i] - b[i]);
        ans += aux;
        if (max < aux) {
            max = aux;
        }
    }
    return (max + ans) / 2;
};


/***/ }),
/* 75 */
/***/ (function(module, exports) {

module.exports = function bhattacharyya(a, b) {
    var ii = a.length,
        ans = 0;
    for (var i = 0; i < ii ; i++) {
        ans += Math.sqrt(a[i] * b[i]);
    }
    return - Math.log(ans);
};


/***/ }),
/* 76 */
/***/ (function(module, exports) {

module.exports = function canberra(a, b) {
    var ii = a.length,
        ans = 0;
    for (var i = 0; i < ii ; i++) {
        ans += Math.abs(a[i] - b[i]) / (a[i] + b[i]);
    }
    return ans;
};


/***/ }),
/* 77 */
/***/ (function(module, exports) {

module.exports = function chebyshev(a, b) {
    var ii = a.length,
        max = 0,
        aux = 0;
    for (var i = 0; i < ii ; i++) {
        aux = Math.abs(a[i] - b[i]);
        if (max < aux) {
            max = aux;
        }
    }
    return max;
};


/***/ }),
/* 78 */
/***/ (function(module, exports) {

module.exports = function clark(a, b) {
    var i = 0,
        ii = a.length,
        d = 0;
    for (; i < ii; i++) {
        d += Math.sqrt(((a[i] - b[i]) * (a[i] - b[i])) / ((a[i] + b[i]) * (a[i] + b[i])));
    }
    return 2 * d;
};


/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const czekanowskiSimilarity = __webpack_require__(30);

module.exports = function czekanowskiDistance(a, b) {
    return 1 - czekanowskiSimilarity(a, b);
};


/***/ }),
/* 80 */
/***/ (function(module, exports) {

module.exports = function divergence(a, b) {
    var i = 0,
        ii = a.length,
        d = 0;
    for (; i < ii; i++) {
        d += ((a[i] - b[i]) * (a[i] - b[i])) / ((a[i] + b[i]) * (a[i] + b[i]));
    }
    return 2 * d;
};


/***/ }),
/* 81 */
/***/ (function(module, exports) {

module.exports = function fidelity(a, b) {
    var ii = a.length,
        ans = 0;
    for (var i = 0; i < ii ; i++) {
        ans += Math.sqrt(a[i] * b[i]);
    }
    return ans;
};


/***/ }),
/* 82 */
/***/ (function(module, exports) {

module.exports = function gower(a, b) {
    var ii = a.length,
        ans = 0;
    for (var i = 0; i < ii ; i++) {
        ans += Math.abs(a[i] - b[i]);
    }
    return ans / ii;
};


/***/ }),
/* 83 */
/***/ (function(module, exports) {

module.exports = function harmonicMean(a, b) {
    var ii = a.length,
        ans = 0;
    for (var i = 0; i < ii ; i++) {
        ans += (a[i] * b[i]) / (a[i] + b[i]);
    }
    return 2 * ans;
};


/***/ }),
/* 84 */
/***/ (function(module, exports) {

module.exports = function hellinger(a, b) {
    var ii = a.length,
        ans = 0;
    for (var i = 0; i < ii ; i++) {
        ans += Math.sqrt(a[i] * b[i]);
    }
    return 2 * Math.sqrt(1 - ans);
};


/***/ }),
/* 85 */
/***/ (function(module, exports) {

module.exports = function innerProduct(a, b) {
    var ii = a.length,
        ans = 0;
    for (var i = 0; i < ii ; i++) {
        ans += a[i] * b[i];
    }
    return ans;
};


/***/ }),
/* 86 */
/***/ (function(module, exports) {

module.exports = function jeffreys(a, b) {
    var ii = a.length,
        ans = 0;
    for (var i = 0; i < ii ; i++) {
        ans += (a[i] - b[i]) * Math.log(a[i] / b[i]);
    }
    return ans;
};


/***/ }),
/* 87 */
/***/ (function(module, exports) {

module.exports = function jensenDifference(a, b) {
    var ii = a.length,
        ans = 0;
    for (var i = 0; i < ii ; i++) {
        ans += ((a[i] * Math.log(a[i]) + b[i] * Math.log(b[i])) / 2) - ((a[i] + b[i]) / 2) * Math.log((a[i] + b[i]) / 2);
    }
    return ans;
};


/***/ }),
/* 88 */
/***/ (function(module, exports) {

module.exports = function jensenShannon(a, b) {
    var ii = a.length,
        p = 0,
        q = 0;
    for (var i = 0; i < ii ; i++) {
        p += a[i] * Math.log(2 * a[i] / (a[i] + b[i]));
        q += b[i] * Math.log(2 * b[i] / (a[i] + b[i]));
    }
    return (p + q) / 2;
};


/***/ }),
/* 89 */
/***/ (function(module, exports) {

module.exports = function kdivergence(a, b) {
    var ii = a.length,
        ans = 0;
    for (var i = 0; i < ii ; i++) {
        ans += a[i] * Math.log(2 * a[i] / (a[i] + b[i]));
    }
    return ans;
};


/***/ }),
/* 90 */
/***/ (function(module, exports) {

module.exports = function kullbackLeibler(a, b) {
    var ii = a.length,
        ans = 0;
    for (var i = 0; i < ii ; i++) {
        ans += a[i] * Math.log(a[i] / b[i]);
    }
    return ans;
};


/***/ }),
/* 91 */
/***/ (function(module, exports) {

module.exports = function kumarHassebrook(a, b) {
    var ii = a.length,
        p = 0,
        p2 = 0,
        q2 = 0;
    for (var i = 0; i < ii ; i++) {
        p += a[i] * b[i];
        p2 += a[i] * a[i];
        q2 += b[i] * b[i];
    }
    return p / (p2 + q2 - p);
};


/***/ }),
/* 92 */
/***/ (function(module, exports) {

module.exports = function kumarJohnson(a, b) {
    var ii = a.length,
        ans = 0;
    for (var i = 0; i < ii ; i++) {
        ans += Math.pow(a[i] * a[i] - b[i] * b[i],2) / (2 * Math.pow(a[i] * b[i],1.5));
    }
    return ans;
};


/***/ }),
/* 93 */
/***/ (function(module, exports) {

module.exports = function lorentzian(a, b) {
    var ii = a.length,
        ans = 0;
    for (var i = 0; i < ii ; i++) {
        ans += Math.log(Math.abs(a[i] - b[i]) + 1);
    }
    return ans;
};


/***/ }),
/* 94 */
/***/ (function(module, exports) {

module.exports = function manhattan(a, b) {
    var i = 0,
        ii = a.length,
        d = 0;
    for (; i < ii; i++) {
        d += Math.abs(a[i] - b[i]);
    }
    return d;
};


/***/ }),
/* 95 */
/***/ (function(module, exports) {

module.exports = function matusita(a, b) {
    var ii = a.length,
        ans = 0;
    for (var i = 0; i < ii ; i++) {
        ans += Math.sqrt(a[i] * b[i]);
    }
    return Math.sqrt(2 - 2 * ans);
};


/***/ }),
/* 96 */
/***/ (function(module, exports) {

module.exports = function minkowski(a, b, p) {
    var i = 0,
        ii = a.length,
        d = 0;
    for (; i < ii; i++) {
        d += Math.pow(Math.abs(a[i] - b[i]),p);
    }
    return Math.pow(d,(1/p));
};


/***/ }),
/* 97 */
/***/ (function(module, exports) {

module.exports = function neyman(a, b) {
    var i = 0,
        ii = a.length,
        d = 0;
    for (; i < ii; i++) {
        d += ((a[i] - b[i]) * (a[i] - b[i])) / a[i];
    }
    return d;
};


/***/ }),
/* 98 */
/***/ (function(module, exports) {

module.exports = function pearson(a, b) {
    var i = 0,
        ii = a.length,
        d = 0;
    for (; i < ii; i++) {
        d += ((a[i] - b[i]) * (a[i] - b[i])) / b[i];
    }
    return d;
};


/***/ }),
/* 99 */
/***/ (function(module, exports) {

module.exports = function probabilisticSymmetric(a, b) {
    var i = 0,
        ii = a.length,
        d = 0;
    for (; i < ii; i++) {
        d += ((a[i] - b[i]) * (a[i] - b[i])) / (a[i] + b[i]);
    }
    return 2 * d;
};


/***/ }),
/* 100 */
/***/ (function(module, exports) {

module.exports = function ruzicka(a, b) {
    var ii = a.length,
        up = 0,
        down = 0;
    for (var i = 0; i < ii ; i++) {
        up += Math.min(a[i],b[i]);
        down += Math.max(a[i],b[i]);
    }
    return up / down;
};


/***/ }),
/* 101 */
/***/ (function(module, exports) {

module.exports = function soergel(a, b) {
    var ii = a.length,
        up = 0,
        down = 0;
    for (var i = 0; i < ii ; i++) {
        up += Math.abs(a[i] - b[i]);
        down += Math.max(a[i],b[i]);
    }
    return up / down;
};


/***/ }),
/* 102 */
/***/ (function(module, exports) {

module.exports = function sorensen(a, b) {
    var ii = a.length,
        up = 0,
        down = 0;
    for (var i = 0; i < ii ; i++) {
        up += Math.abs(a[i] - b[i]);
        down += a[i] + b[i];
    }
    return up / down;
};


/***/ }),
/* 103 */
/***/ (function(module, exports) {

module.exports = function squared(a, b) {
    var i = 0,
        ii = a.length,
        d = 0;
    for (; i < ii; i++) {
        d += ((a[i] - b[i]) * (a[i] - b[i])) / (a[i] + b[i]);
    }
    return d;
};


/***/ }),
/* 104 */
/***/ (function(module, exports) {

module.exports = function taneja(a, b) {
    var ii = a.length,
        ans = 0;
    for (var i = 0; i < ii ; i++) {
        ans += (a[i] + b[i]) / 2 * Math.log((a[i] + b[i]) / (2 * Math.sqrt(a[i] * b[i])));
    }
    return ans;
};


/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

var tanimotoS = __webpack_require__(31);

module.exports = function tanimoto(a, b, bitvector) {
    if (bitvector)
        return 1 - tanimotoS(a, b, bitvector);
    else {
        var ii = a.length,
            p = 0,
            q = 0,
            m = 0;
        for (var i = 0; i < ii ; i++) {
            p += a[i];
            q += b[i];
            m += Math.min(a[i],b[i]);
        }
        return (p + q - 2 * m) / (p + q - m);
    }
};


/***/ }),
/* 106 */
/***/ (function(module, exports) {

module.exports = function topsoe(a, b) {
    var ii = a.length,
        ans = 0;
    for (var i = 0; i < ii ; i++) {
        ans += a[i] * Math.log(2 * a[i] / (a[i] + b[i])) + b[i] * Math.log(2 * b[i] / (a[i] + b[i]));
    }
    return ans;
};


/***/ }),
/* 107 */
/***/ (function(module, exports) {

module.exports = function waveHedges(a, b) {
    var ii = a.length,
        ans = 0;
    for (var i = 0; i < ii ; i++) {
        ans += 1 - (Math.min(a[i], b[i]) / Math.max(a[i], b[i]));
    }
    return ans;
};


/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.cosine = __webpack_require__(29);
exports.czekanowski = __webpack_require__(30);
exports.dice = __webpack_require__(109);
exports.intersection = __webpack_require__(110);
exports.jaccard = __webpack_require__(111);
exports.kulczynski = __webpack_require__(112);
exports.motyka = __webpack_require__(113);
exports.pearson = __webpack_require__(114);
exports.squaredChord = __webpack_require__(115);
exports.tanimoto = __webpack_require__(31);


/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

var diceD = __webpack_require__(23);

module.exports = function dice(a, b) {
    return 1 - diceD(a,b);
};


/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

var intersectionD = __webpack_require__(24);

module.exports = function intersection(a, b) {
    return 1 - intersectionD(a,b);
};


/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

var jaccardD = __webpack_require__(25);

module.exports = function jaccard(a, b) {
    return 1 - jaccardD(a, b);
};


/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

var kulczynskiD = __webpack_require__(26);

module.exports = function kulczynski(a, b) {
    return 1 / kulczynskiD(a, b);
};


/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

var motykaD = __webpack_require__(27);

module.exports = function motyka(a, b) {
    return 1 - motykaD(a,b);
};


/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var stat=__webpack_require__(2).array;
var cosine=__webpack_require__(29);

module.exports = function pearson(a, b) {
    var avgA=stat.mean(a);
    var avgB=stat.mean(b);

    var newA=new Array(a.length);
    var newB=new Array(b.length);
    for (var i=0; i<newA.length; i++) {
        newA[i]=a[i]-avgA;
        newB[i]=b[i]-avgB;
    }

    return cosine(newA, newB);
};


/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

var squaredChordD = __webpack_require__(28);

module.exports = function squaredChord(a, b) {
    return 1 - squaredChordD(a, b);
};


/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Layer = __webpack_require__(32);

class OutputLayer extends Layer {
    constructor(options) {
        super(options);

        this.activationFunction = function (i, j) {
            this[i][j] = Math.exp(this[i][j]);
        };
    }

    static load(model) {
        if (model.model !== 'Layer') {
            throw new RangeError('the current model is not a Layer model');
        }

        return new OutputLayer(model);
    }
}

module.exports = OutputLayer;


/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

const binarySearch = __webpack_require__(15);
const sortAsc = __webpack_require__(21).asc;

const largestPrime = 0x7fffffff;

const primeNumbers = [
    //chunk #0
    largestPrime, // 2^31-1

    //chunk #1
    5, 11, 23, 47, 97, 197, 397, 797, 1597, 3203, 6421, 12853, 25717, 51437, 102877, 205759,
    411527, 823117, 1646237, 3292489, 6584983, 13169977, 26339969, 52679969, 105359939,
    210719881, 421439783, 842879579, 1685759167,

    //chunk #2
    433, 877, 1759, 3527, 7057, 14143, 28289, 56591, 113189, 226379, 452759, 905551, 1811107,
    3622219, 7244441, 14488931, 28977863, 57955739, 115911563, 231823147, 463646329, 927292699,
    1854585413,

    //chunk #3
    953, 1907, 3821, 7643, 15287, 30577, 61169, 122347, 244703, 489407, 978821, 1957651, 3915341,
    7830701, 15661423, 31322867, 62645741, 125291483, 250582987, 501165979, 1002331963,
    2004663929,

    //chunk #4
    1039, 2081, 4177, 8363, 16729, 33461, 66923, 133853, 267713, 535481, 1070981, 2141977, 4283963,
    8567929, 17135863, 34271747, 68543509, 137087021, 274174111, 548348231, 1096696463,

    //chunk #5
    31, 67, 137, 277, 557, 1117, 2237, 4481, 8963, 17929, 35863, 71741, 143483, 286973, 573953,
    1147921, 2295859, 4591721, 9183457, 18366923, 36733847, 73467739, 146935499, 293871013,
    587742049, 1175484103,

    //chunk #6
    599, 1201, 2411, 4831, 9677, 19373, 38747, 77509, 155027, 310081, 620171, 1240361, 2480729,
    4961459, 9922933, 19845871, 39691759, 79383533, 158767069, 317534141, 635068283, 1270136683,

    //chunk #7
    311, 631, 1277, 2557, 5119, 10243, 20507, 41017, 82037, 164089, 328213, 656429, 1312867,
    2625761, 5251529, 10503061, 21006137, 42012281, 84024581, 168049163, 336098327, 672196673,
    1344393353,

    //chunk #8
    3, 7, 17, 37, 79, 163, 331, 673, 1361, 2729, 5471, 10949, 21911, 43853, 87719, 175447, 350899,
    701819, 1403641, 2807303, 5614657, 11229331, 22458671, 44917381, 89834777, 179669557,
    359339171, 718678369, 1437356741,

    //chunk #9
    43, 89, 179, 359, 719, 1439, 2879, 5779, 11579, 23159, 46327, 92657, 185323, 370661, 741337,
    1482707, 2965421, 5930887, 11861791, 23723597, 47447201, 94894427, 189788857, 379577741,
    759155483, 1518310967,

    //chunk #10
    379, 761, 1523, 3049, 6101, 12203, 24407, 48817, 97649, 195311, 390647, 781301, 1562611,
    3125257, 6250537, 12501169, 25002389, 50004791, 100009607, 200019221, 400038451, 800076929,
    1600153859,

    //chunk #11
    13, 29, 59, 127, 257, 521, 1049, 2099, 4201, 8419, 16843, 33703, 67409, 134837, 269683,
    539389, 1078787, 2157587, 4315183, 8630387, 17260781, 34521589, 69043189, 138086407,
    276172823, 552345671, 1104691373,

    //chunk #12
    19, 41, 83, 167, 337, 677,
    1361, 2729, 5471, 10949, 21911, 43853, 87719, 175447, 350899,
    701819, 1403641, 2807303, 5614657, 11229331, 22458671, 44917381, 89834777, 179669557,
    359339171, 718678369, 1437356741,

    //chunk #13
    53, 107, 223, 449, 907, 1823, 3659, 7321, 14653, 29311, 58631, 117269,
    234539, 469099, 938207, 1876417, 3752839, 7505681, 15011389, 30022781,
    60045577, 120091177, 240182359, 480364727, 960729461, 1921458943
];

primeNumbers.sort(sortAsc);

function nextPrime(value) {
    let index = binarySearch(primeNumbers, value, sortAsc);
    if (index < 0) {
        index = ~index;
    }
    return primeNumbers[index];
}

exports.nextPrime = nextPrime;
exports.largestPrime = largestPrime;


/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var euclidean = __webpack_require__(1);
var ClusterLeaf = __webpack_require__(35);
var Cluster = __webpack_require__(10);

/**
 * @private
 * @param cluster1
 * @param cluster2
 * @param disFun
 * @returns {number}
 */
function simpleLink(cluster1, cluster2, disFun) {
    var m = 10e100;
    for (var i = 0; i < cluster1.length; i++)
        for (var j = 0; j < cluster2.length; j++) {
            var d = disFun[cluster1[i]][ cluster2[j]];
            m = Math.min(d,m);
        }
    return m;
}

/**
 * @private
 * @param cluster1
 * @param cluster2
 * @param disFun
 * @returns {number}
 */
function completeLink(cluster1, cluster2, disFun) {
    var m = -1;
    for (var i = 0; i < cluster1.length; i++)
        for (var j = 0; j < cluster2.length; j++) {
            var d = disFun[cluster1[i]][ cluster2[j]];
            m = Math.max(d,m);
        }
    return m;
}

/**
 * @private
 * @param cluster1
 * @param cluster2
 * @param disFun
 * @returns {number}
 */
function averageLink(cluster1, cluster2, disFun) {
    var m = 0;
    for (var i = 0; i < cluster1.length; i++)
        for (var j = 0; j < cluster2.length; j++)
            m += disFun[cluster1[i]][ cluster2[j]];
    return m / (cluster1.length * cluster2.length);
}

/**
 * @private
 * @param cluster1
 * @param cluster2
 * @param disFun
 * @returns {*}
 */
function centroidLink(cluster1, cluster2, disFun) {
    var m = -1;
    var dist = new Array(cluster1.length*cluster2.length);
    for (var i = 0; i < cluster1.length; i++)
        for (var j = 0; j < cluster2.length; j++) {
            dist[i*cluster1.length+j]=(disFun[cluster1[i]][ cluster2[j]]);
        }
    return median(dist);
}

/**
 * @private
 * @param cluster1
 * @param cluster2
 * @param disFun
 * @returns {number}
 */
function wardLink(cluster1, cluster2, disFun) {
    return centroidLink(cluster1, cluster2, disFun)
        *cluster1.length*cluster2.length / (cluster1.length+cluster2.length);
}

function compareNumbers(a, b) {
    return a - b;
}

function median(values, alreadySorted) {
    if (alreadySorted === undefined) alreadySorted = false;
    if (!alreadySorted) {
        values = [].concat(values).sort(compareNumbers);
    }
    var l = values.length;
    var half = Math.floor(l / 2);
    if (l % 2 === 0) {
        return (values[half - 1] + values[half]) * 0.5;
    } else {
        return values[half];
    }
}

var defaultOptions = {
    disFunc: euclidean,
    kind: 'single',
    isDistanceMatrix:false

};

/**
 * Continuously merge nodes that have the least dissimilarity
 * @param {Array <Array <number>>} distance - Array of points to be clustered
 * @param {json} options
 * @option isDistanceMatrix: Is the input a distance matrix?
 * @constructor
 */
function agnes(data, options) {
    options = Object.assign({}, defaultOptions, options);
    var len = data.length;

    var distance = data;//If source
    if(!options.isDistanceMatrix) {
        distance = new Array(len);
        for(var i = 0;i < len; i++) {
            distance[i] = new Array(len);
            for (var j = 0; j < len; j++) {
                distance[i][j] = options.disFunc(data[i],data[j]);
            }
        }
    }


    // allows to use a string or a given function
    if (typeof options.kind === "string") {
        switch (options.kind) {
            case 'single':
                options.kind = simpleLink;
                break;
            case 'complete':
                options.kind = completeLink;
                break;
            case 'average':
                options.kind = averageLink;
                break;
            case 'centroid':
                options.kind = centroidLink;
                break;
            case 'ward':
                options.kind = wardLink;
                break;
            default:
                throw new RangeError('Unknown kind of similarity');
        }
    }
    else if (typeof options.kind !== "function")
        throw new TypeError('Undefined kind of similarity');

    var list = new Array(len);
    for (var i = 0; i < distance.length; i++)
        list[i] = new ClusterLeaf(i);
    var min  = 10e5,
        d = {},
        dis = 0;

    while (list.length > 1) {
        // calculates the minimum distance
        d = {};
        min = 10e5;
        for (var j = 0; j < list.length; j++){
            for (var k = j + 1; k < list.length; k++) {
                var fdistance, sdistance;
                if (list[j] instanceof ClusterLeaf)
                    fdistance = [list[j].index];
                else {
                    fdistance = new Array(list[j].index.length);
                    for (var e = 0; e < fdistance.length; e++)
                        fdistance[e] = list[j].index[e].index;
                }
                if (list[k] instanceof ClusterLeaf)
                    sdistance = [list[k].index];
                else {
                    sdistance = new Array(list[k].index.length);
                    for (var f = 0; f < sdistance.length; f++)
                        sdistance[f] = list[k].index[f].index;
                }
                dis = options.kind(fdistance, sdistance, distance).toFixed(4);
                if (dis in d) {
                    d[dis].push([list[j], list[k]]);
                }
                else {
                    d[dis] = [[list[j], list[k]]];
                }
                min = Math.min(dis, min);
            }
        }
        // cluster dots
        var dmin = d[min.toFixed(4)];
        var clustered = new Array(dmin.length);
        var aux,
            count = 0;
        while (dmin.length > 0) {
            aux = dmin.shift();
            for (var q = 0; q < dmin.length; q++) {
                var int = dmin[q].filter(function(n) {
                    //noinspection JSReferencingMutableVariableFromClosure
                    return aux.indexOf(n) !== -1
                });
                if (int.length > 0) {
                    var diff = dmin[q].filter(function(n) {
                        //noinspection JSReferencingMutableVariableFromClosure
                        return aux.indexOf(n) === -1
                    });
                    aux = aux.concat(diff);
                    dmin.splice(q-- ,1);
                }
            }
            clustered[count++] = aux;
        }
        clustered.length = count;

        for (var ii = 0; ii < clustered.length; ii++) {
            var obj = new Cluster();
            obj.children = clustered[ii].concat();
            obj.distance = min;
            obj.index = new Array(len);
            var indCount = 0;
            for (var jj = 0; jj < clustered[ii].length; jj++) {
                if (clustered[ii][jj] instanceof ClusterLeaf)
                    obj.index[indCount++] = clustered[ii][jj];
                else {
                    indCount += clustered[ii][jj].index.length;
                    obj.index = clustered[ii][jj].index.concat(obj.index);
                }
                list.splice((list.indexOf(clustered[ii][jj])), 1);
            }
            obj.index.length = indCount;
            list.push(obj);
        }
    }
    return list[0];
}

module.exports = agnes;


/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var euclidean = __webpack_require__(1);
var ClusterLeaf = __webpack_require__(35);
var Cluster = __webpack_require__(10);

/**
 * @private
 * @param {Array <Array <number>>} cluster1
 * @param {Array <Array <number>>} cluster2
 * @param {function} disFun
 * @returns {number}
 */
function simpleLink(cluster1, cluster2, disFun) {
    var m = 10e100;
    for (var i = 0; i < cluster1.length; i++)
        for (var j = i; j < cluster2.length; j++) {
            var d = disFun(cluster1[i], cluster2[j]);
            m = Math.min(d,m);
        }
    return m;
}

/**
 * @private
 * @param {Array <Array <number>>} cluster1
 * @param {Array <Array <number>>} cluster2
 * @param {function} disFun
 * @returns {number}
 */
function completeLink(cluster1, cluster2, disFun) {
    var m = -1;
    for (var i = 0; i < cluster1.length; i++)
        for (var j = i; j < cluster2.length; j++) {
            var d = disFun(cluster1[i], cluster2[j]);
            m = Math.max(d,m);
        }
    return m;
}

/**
 * @private
 * @param {Array <Array <number>>} cluster1
 * @param {Array <Array <number>>} cluster2
 * @param {function} disFun
 * @returns {number}
 */
function averageLink(cluster1, cluster2, disFun) {
    var m = 0;
    for (var i = 0; i < cluster1.length; i++)
        for (var j = 0; j < cluster2.length; j++)
            m += disFun(cluster1[i], cluster2[j]);
    return m / (cluster1.length * cluster2.length);
}

/**
 * @private
 * @param {Array <Array <number>>} cluster1
 * @param {Array <Array <number>>} cluster2
 * @param {function} disFun
 * @returns {number}
 */
function centroidLink(cluster1, cluster2, disFun) {
    var x1 = 0,
        y1 = 0,
        x2 = 0,
        y2 = 0;
    for (var i = 0; i < cluster1.length; i++) {
        x1 += cluster1[i][0];
        y1 += cluster1[i][1];
    }
    for (var j = 0; j < cluster2.length; j++) {
        x2 += cluster2[j][0];
        y2 += cluster2[j][1];
    }
    x1 /= cluster1.length;
    y1 /= cluster1.length;
    x2 /= cluster2.length;
    y2 /= cluster2.length;
    return disFun([x1,y1], [x2,y2]);
}

/**
 * @private
 * @param {Array <Array <number>>} cluster1
 * @param {Array <Array <number>>} cluster2
 * @param {function} disFun
 * @returns {number}
 */
function wardLink(cluster1, cluster2, disFun) {
    var x1 = 0,
        y1 = 0,
        x2 = 0,
        y2 = 0;
    for (var i = 0; i < cluster1.length; i++) {
        x1 += cluster1[i][0];
        y1 += cluster1[i][1];
    }
    for (var j = 0; j < cluster2.length; j++) {
        x2 += cluster2[j][0];
        y2 += cluster2[j][1];
    }
    x1 /= cluster1.length;
    y1 /= cluster1.length;
    x2 /= cluster2.length;
    y2 /= cluster2.length;
    return disFun([x1,y1], [x2,y2])*cluster1.length*cluster2.length / (cluster1.length+cluster2.length);
}

/**
 * @private
 * Returns the most distant point and his distance
 * @param {Array <Array <number>>} splitting - Clusters to split
 * @param {Array <Array <number>>} data - Original data
 * @param {function} disFun - Distance function
 * @returns {{d: number, p: number}} - d: maximum difference between points, p: the point more distant
 */
function diff(splitting, data, disFun) {
    var ans = {
        d:0,
        p:0
    };

    var Ci = new Array(splitting[0].length);
    for (var e = 0; e < splitting[0].length; e++)
        Ci[e] = data[splitting[0][e]];
    var Cj = new Array(splitting[1].length);
    for (var f = 0; f < splitting[1].length; f++)
        Cj[f] = data[splitting[1][f]];

    var dist, ndist;
    for (var i = 0; i < Ci.length; i++) {
        dist = 0;
        for (var j = 0; j < Ci.length; j++)
            if (i !== j)
                dist += disFun(Ci[i], Ci[j]);
        dist /= (Ci.length - 1);
        ndist = 0;
        for (var k = 0; k < Cj.length; k++)
            ndist += disFun(Ci[i], Cj[k]);
        ndist /= Cj.length;
        if ((dist - ndist) > ans.d) {
            ans.d = (dist - ndist);
            ans.p = i;
        }
    }
    return ans;
}

var defaultOptions = {
    dist: euclidean,
    kind: 'single'
};

/**
 * @private
 * Intra-cluster distance
 * @param {Array} index
 * @param {Array} data
 * @param {function} disFun
 * @returns {number}
 */
function intrDist(index, data, disFun) {
    var dist = 0,
        count = 0;
    for (var i = 0; i < index.length; i++)
        for (var j = i; j < index.length; j++) {
            dist += disFun(data[index[i].index], data[index[j].index]);
            count++
        }
    return dist / count;
}

/**
 * Splits the higher level clusters
 * @param {Array <Array <number>>} data - Array of points to be clustered
 * @param {json} options
 * @constructor
 */
function diana(data, options) {
    options = options || {};
    for (var o in defaultOptions)
        if (!(options.hasOwnProperty(o)))
            options[o] = defaultOptions[o];
    if (typeof options.kind === "string") {
        switch (options.kind) {
            case 'single':
                options.kind = simpleLink;
                break;
            case 'complete':
                options.kind = completeLink;
                break;
            case 'average':
                options.kind = averageLink;
                break;
            case 'centroid':
                options.kind = centroidLink;
                break;
            case 'ward':
                options.kind = wardLink;
                break;
            default:
                throw new RangeError('Unknown kind of similarity');
        }
    }
    else if (typeof options.kind !== "function")
        throw new TypeError('Undefined kind of similarity');
    var tree = new Cluster();
    tree.children = new Array(data.length);
    tree.index = new Array(data.length);
    for (var ind = 0; ind < data.length; ind++) {
        tree.children[ind] = new ClusterLeaf(ind);
        tree.index[ind] = new ClusterLeaf(ind);
    }

    tree.distance = intrDist(tree.index, data, options.dist);
    var m, M, clId,
        dist, rebel;
    var list = [tree];
    while (list.length > 0) {
        M = 0;
        clId = 0;
        for (var i = 0; i < list.length; i++) {
            m = 0;
            for (var j = 0; j < list[i].length; j++) {
                for (var l = (j + 1); l < list[i].length; l++) {
                    m = Math.max(options.dist(data[list[i].index[j].index], data[list[i].index[l].index]), m);
                }
            }
            if (m > M) {
                M = m;
                clId = i;
            }
        }
        M = 0;
        if (list[clId].index.length === 2) {
            list[clId].children = [list[clId].index[0], list[clId].index[1]];
            list[clId].distance = options.dist(data[list[clId].index[0].index], data[list[clId].index[1].index]);
        }
        else if (list[clId].index.length === 3) {
            list[clId].children = [list[clId].index[0], list[clId].index[1], list[clId].index[2]];
            var d = [
                options.dist(data[list[clId].index[0].index], data[list[clId].index[1].index]),
                options.dist(data[list[clId].index[1].index], data[list[clId].index[2].index])
            ];
            list[clId].distance = (d[0] + d[1]) / 2;
        }
        else {
            var C = new Cluster();
            var sG = new Cluster();
            var splitting = [new Array(list[clId].index.length), []];
            for (var spl = 0; spl < splitting[0].length; spl++)
                splitting[0][spl] = spl;
            for (var ii = 0; ii < splitting[0].length; ii++) {
                dist = 0;
                for (var jj = 0; jj < splitting[0].length; jj++)
                    if (ii !== jj)
                        dist += options.dist(data[list[clId].index[splitting[0][jj]].index], data[list[clId].index[splitting[0][ii]].index]);
                dist /= (splitting[0].length - 1);
                if (dist > M) {
                    M = dist;
                    rebel = ii;
                }
            }
            splitting[1] = [rebel];
            splitting[0].splice(rebel, 1);
            dist = diff(splitting, data, options.dist);
            while (dist.d > 0) {
                splitting[1].push(splitting[0][dist.p]);
                splitting[0].splice(dist.p, 1);
                dist = diff(splitting, data, options.dist);
            }
            var fData = new Array(splitting[0].length);
            C.index = new Array(splitting[0].length);
            for (var e = 0; e < fData.length; e++) {
                fData[e] = data[list[clId].index[splitting[0][e]].index];
                C.index[e] = list[clId].index[splitting[0][e]];
                C.children[e] = list[clId].index[splitting[0][e]];
            }
            var sData = new Array(splitting[1].length);
            sG.index = new Array(splitting[1].length);
            for (var f = 0; f < sData.length; f++) {
                sData[f] = data[list[clId].index[splitting[1][f]].index];
                sG.index[f] = list[clId].index[splitting[1][f]];
                sG.children[f] = list[clId].index[splitting[1][f]];
            }
            C.distance = intrDist(C.index, data, options.dist);
            sG.distance = intrDist(sG.index, data, options.dist);
            list.push(C);
            list.push(sG);
            list[clId].children = [C, sG];
        }
        list.splice(clId, 1);
    }
    return tree;
}

module.exports = diana;


/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const squaredEuclidean = __webpack_require__(1).squared;

const defaultOptions = {
    sigma: 1
};

class GaussianKernel {
    constructor(options) {
        options = Object.assign({}, defaultOptions, options);
        this.sigma = options.sigma;
        this.divisor = 2 * options.sigma * options.sigma;
    }

    compute(x, y) {
        const distance = squaredEuclidean(x, y);
        return Math.exp(-distance / this.divisor);
    }
}

module.exports = GaussianKernel;


/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const defaultOptions = {
    degree: 1,
    constant: 1,
    scale: 1
};

class PolynomialKernel {
    constructor(options) {
        options = Object.assign({}, defaultOptions, options);

        this.degree = options.degree;
        this.constant = options.constant;
        this.scale = options.scale;
    }

    compute(x, y) {
        var sum = 0;
        for (var i = 0; i < x.length; i++) {
            sum += x[i] * y[i];
        }
        return Math.pow(this.scale * sum + this.constant, this.degree);
    }
}

module.exports = PolynomialKernel;


/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const defaultOptions = {
    alpha: 0.01,
    constant: -Math.E
};

class SigmoidKernel {
    constructor(options) {
        options = Object.assign({}, defaultOptions, options);
        this.alpha = options.alpha;
        this.constant = options.constant;
    }

    compute(x, y) {
        var sum = 0;
        for (var i = 0; i < x.length; i++) {
            sum += x[i] * y[i];
        }
        return Math.tanh(this.alpha * sum + this.constant);
    }
}

module.exports = SigmoidKernel;


/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const defaultOptions = {
    sigma: 1,
    degree: 1
};

class ANOVAKernel {
    constructor(options) {
        options = Object.assign({}, defaultOptions, options);
        this.sigma = options.sigma;
        this.degree = options.degree;
    }

    compute(x, y) {
        var sum = 0;
        var len = Math.min(x.length, y.length);
        for (var i = 1; i <= len; ++i) {
            sum += Math.pow(Math.exp(-this.sigma * Math.pow(Math.pow(x[i - 1], i) -
                    Math.pow(y[i - 1], i), 2)), this.degree);
        }
        return sum;
    }
}

module.exports = ANOVAKernel;


/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const squaredEuclidean = __webpack_require__(1).squared;

const defaultOptions = {
    sigma: 1
};

class CauchyKernel {
    constructor(options) {
        options = Object.assign({}, defaultOptions, options);
        this.sigma = options.sigma;
    }

    compute(x, y) {
        return 1 / (1 + squaredEuclidean(x, y) / (this.sigma * this.sigma));
    }
}

module.exports = CauchyKernel;


/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const euclidean = __webpack_require__(1);

const defaultOptions = {
    sigma: 1
};

class ExponentialKernel {
    constructor(options) {
        options = Object.assign({}, defaultOptions, options);
        this.sigma = options.sigma;
        this.divisor = 2 * options.sigma * options.sigma;
    }

    compute(x, y) {
        const distance = euclidean(x, y);
        return Math.exp(-distance / this.divisor);
    }
}

module.exports = ExponentialKernel;


/***/ }),
/* 126 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


class HistogramIntersectionKernel {
    compute(x, y) {
        var min = Math.min(x.length, y.length);
        var sum = 0;
        for (var i = 0; i < min; ++i)
            sum += Math.min(x[i], y[i]);

        return sum;
    }
}

module.exports = HistogramIntersectionKernel;


/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const euclidean = __webpack_require__(1);

const defaultOptions = {
    sigma: 1
};

class LaplacianKernel {
    constructor(options) {
        options = Object.assign({}, defaultOptions, options);
        this.sigma = options.sigma;
    }

    compute(x, y) {
        const distance = euclidean(x, y);
        return Math.exp(-distance / this.sigma);
    }
}

module.exports = LaplacianKernel;


/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const squaredEuclidean = __webpack_require__(1).squared;

const defaultOptions = {
    constant: 1
};

class MultiquadraticKernel {
    constructor(options) {
        options = Object.assign({}, defaultOptions, options);
        this.constant = options.constant;
    }

    compute(x, y) {
        return Math.sqrt(squaredEuclidean(x, y) + this.constant * this.constant);
    }
}

module.exports = MultiquadraticKernel;


/***/ }),
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const squaredEuclidean = __webpack_require__(1).squared;

const defaultOptions = {
    constant: 1
};

class RationalQuadraticKernel {
    constructor(options) {
        options = Object.assign({}, defaultOptions, options);
        this.constant = options.constant;
    }

    compute(x, y) {
        const distance = squaredEuclidean(x, y);
        return 1 - (distance / (distance + this.constant));
    }
}

module.exports = RationalQuadraticKernel;


/***/ }),
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const utils = __webpack_require__(36);
const distanceSymbol = Symbol('distance');

/**
 * Result of the kmeans algorithm
 * @param {Array<Number>} clusters - the cluster identifier for each data dot
 * @param {Array<Array<Object>>} centroids - the K centers in format [x,y,z,...], the error and size of the cluster
 * @param {Boolean} converged - Converge criteria satisfied
 * @param {Number} iterations - Current number of iterations
 * @param {Function} distance - (*Private*) Distance function to use between the points
 * @constructor
 */
function KMeansResult(clusters, centroids, converged, iterations, distance) {
    this.clusters = clusters;
    this.centroids = centroids;
    this.converged = converged;
    this.iterations = iterations;
    this[distanceSymbol] = distance;
}

/**
 * Allows to compute for a new array of points their cluster id
 * @param {Array<Array<Number>>} data - the [x,y,z,...] points to cluster
 * @return {Array<Number>} - cluster id for each point
 */
KMeansResult.prototype.nearest = function (data) {
    var clusterID = new Array(data.length);
    var centroids = this.centroids.map(function (centroid) {
        return centroid.centroid;
    });
    return utils.updateClusterID(data, centroids, clusterID, this[distanceSymbol]);
};

/**
 * Returns a KMeansResult with the error and size of the cluster
 * @ignore
 * @param {Array<Array<Number>>} data - the [x,y,z,...] points to cluster
 * @return {KMeansResult}
 */
KMeansResult.prototype.computeInformation = function (data) {
    var enrichedCentroids = this.centroids.map(function (centroid) {
        return {
            centroid: centroid,
            error: 0,
            size: 0
        };
    });

    for (var i = 0; i < data.length; i++) {
        enrichedCentroids[this.clusters[i]].error += this[distanceSymbol](data[i], this.centroids[this.clusters[i]]);
        enrichedCentroids[this.clusters[i]].size++;
    }

    for (var j = 0; j < this.centroids.length; j++) {
        enrichedCentroids[j].error /= enrichedCentroids[j].size;
    }

    return new KMeansResult(this.clusters, enrichedCentroids, this.converged, this.iterations, this[distanceSymbol]);
};

module.exports = KMeansResult;


/***/ }),
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const Picker = __webpack_require__(62).Picker;

/**
 * Choose K different random points from the original data
 * @ignore
 * @param {Array<Array<Number>>} data - Points in the format to cluster [x,y,z,...]
 * @param {Number} K - Number of clusters
 * @return {Array<Array<Number>>} - Initial random points
 */
function random(data, K) {
    const rand = new Picker(data);
    var ans = new Array(K);

    for (var i = 0; i < K; ++i) {
        ans[i] = rand.pick();
    }
    return ans;
}

/**
 * Chooses the most distant points to a first random pick
 * @ignore
 * @param {Array<Array<Number>>} data - Points in the format to cluster [x,y,z,...]
 * @param {Number} K - Number of clusters
 * @param {Array<Array<Number>>} distanceMatrix - matrix with the distance values
 * @return {Array<Array<Number>>} - Initial random points
 */
function mostDistant(data, K, distanceMatrix) {
    var ans = new Array(K);

    // chooses a random point as initial cluster
    ans[0] = Math.floor(Math.random() * data.length);

    if (K > 1) {
        // chooses the more distant point
        var maxDist = {dist: -1, index: -1};
        for (var l = 0; l < data.length; ++l) {
            if (distanceMatrix[ans[0]][l] > maxDist.dist) {
                maxDist.dist = distanceMatrix[ans[0]][l];
                maxDist.index = l;
            }
        }
        ans[1] = maxDist.index;

        if (K > 2) {
            // chooses the set of points that maximises the min distance
            for (var k = 2; k < K; ++k) {
                var center = {dist: -1, index: -1};
                for (var m = 0; m < data.length; ++m) {

                    // minimum distance to centers
                    var minDistCent = {dist: Number.MAX_VALUE, index: -1};
                    for (var n = 0; n < k; ++n) {
                        if (distanceMatrix[n][m] < minDistCent.dist && ans.indexOf(m) === -1) {
                            minDistCent = {
                                dist: distanceMatrix[n][m],
                                index: m
                            };
                        }
                    }

                    if (minDistCent.dist !== Number.MAX_VALUE && minDistCent.dist > center.dist) {
                        center = Object.assign({}, minDistCent);
                    }
                }

                ans[k] = center.index;
            }
        }
    }

    return ans.map((index) => data[index]);
}

exports.random = random;
exports.mostDistant = mostDistant;


/***/ }),
/* 132 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
* k-d Tree JavaScript - V 1.01
*
* https://github.com/ubilabs/kd-tree-javascript
*
* @author Mircea Pricop <pricop@ubilabs.net>, 2012
* @author Martin Kleppe <kleppe@ubilabs.net>, 2012
* @author Ubilabs http://ubilabs.net, 2012
* @license MIT License <http://www.opensource.org/licenses/mit-license.php>
*/


function Node(obj, dimension, parent) {
    this.obj = obj;
    this.left = null;
    this.right = null;
    this.parent = parent;
    this.dimension = dimension;
}

function kdTree(points, metric, dimensions) {

    var self = this;

    function buildTree(points, depth, parent) {
        var dim = depth % dimensions.length,
            median,
            node;

        if (points.length === 0) {
            return null;
        }
        if (points.length === 1) {
            return new Node(points[0], dim, parent);
        }

        points.sort(function (a, b) {
            return a[dimensions[dim]] - b[dimensions[dim]];
        });

        median = Math.floor(points.length / 2);
        node = new Node(points[median], dim, parent);
        node.left = buildTree(points.slice(0, median), depth + 1, node);
        node.right = buildTree(points.slice(median + 1), depth + 1, node);

        return node;
    }

    // Reloads a serialied tree
    function loadTree (data) {
        // Just need to restore the `parent` parameter
        self.root = data;

        function restoreParent (root) {
            if (root.left) {
                root.left.parent = root;
                restoreParent(root.left);
            }

            if (root.right) {
                root.right.parent = root;
                restoreParent(root.right);
            }
        }

        restoreParent(self.root);
    }

    // If points is not an array, assume we're loading a pre-built tree
    if (!Array.isArray(points)) loadTree(points, metric, dimensions);
    else this.root = buildTree(points, 0, null);

    // Convert to a JSON serializable structure; this just requires removing
    // the `parent` property
    this.toJSON = function (src) {
        if (!src) src = this.root;
        var dest = new Node(src.obj, src.dimension, null);
        if (src.left) dest.left = self.toJSON(src.left);
        if (src.right) dest.right = self.toJSON(src.right);
        return dest;
    };

    this.insert = function (point) {
        function innerSearch(node, parent) {

            if (node === null) {
                return parent;
            }

            var dimension = dimensions[node.dimension];
            if (point[dimension] < node.obj[dimension]) {
                return innerSearch(node.left, node);
            } else {
                return innerSearch(node.right, node);
            }
        }

        var insertPosition = innerSearch(this.root, null),
            newNode,
            dimension;

        if (insertPosition === null) {
            this.root = new Node(point, 0, null);
            return;
        }

        newNode = new Node(point, (insertPosition.dimension + 1) % dimensions.length, insertPosition);
        dimension = dimensions[insertPosition.dimension];

        if (point[dimension] < insertPosition.obj[dimension]) {
            insertPosition.left = newNode;
        } else {
            insertPosition.right = newNode;
        }
    };

    this.remove = function (point) {
        var node;

        function nodeSearch(node) {
            if (node === null) {
                return null;
            }

            if (node.obj === point) {
                return node;
            }

            var dimension = dimensions[node.dimension];

            if (point[dimension] < node.obj[dimension]) {
                return nodeSearch(node.left, node);
            } else {
                return nodeSearch(node.right, node);
            }
        }

        function removeNode(node) {
            var nextNode,
                nextObj,
                pDimension;

            function findMin(node, dim) {
                var dimension,
                    own,
                    left,
                    right,
                    min;

                if (node === null) {
                    return null;
                }

                dimension = dimensions[dim];

                if (node.dimension === dim) {
                    if (node.left !== null) {
                        return findMin(node.left, dim);
                    }
                    return node;
                }

                own = node.obj[dimension];
                left = findMin(node.left, dim);
                right = findMin(node.right, dim);
                min = node;

                if (left !== null && left.obj[dimension] < own) {
                    min = left;
                }
                if (right !== null && right.obj[dimension] < min.obj[dimension]) {
                    min = right;
                }
                return min;
            }

            if (node.left === null && node.right === null) {
                if (node.parent === null) {
                    self.root = null;
                    return;
                }

                pDimension = dimensions[node.parent.dimension];

                if (node.obj[pDimension] < node.parent.obj[pDimension]) {
                    node.parent.left = null;
                } else {
                    node.parent.right = null;
                }
                return;
            }

            // If the right subtree is not empty, swap with the minimum element on the
            // node's dimension. If it is empty, we swap the left and right subtrees and
            // do the same.
            if (node.right !== null) {
                nextNode = findMin(node.right, node.dimension);
                nextObj = nextNode.obj;
                removeNode(nextNode);
                node.obj = nextObj;
            } else {
                nextNode = findMin(node.left, node.dimension);
                nextObj = nextNode.obj;
                removeNode(nextNode);
                node.right = node.left;
                node.left = null;
                node.obj = nextObj;
            }

        }

        node = nodeSearch(self.root);

        if (node === null) { return; }

        removeNode(node);
    };

    this.nearest = function (point, maxNodes, maxDistance) {
        var i,
            result,
            bestNodes;

        bestNodes = new BinaryHeap(
            function (e) { return -e[1]; }
        );

        function nearestSearch(node) {
            var bestChild,
                dimension = dimensions[node.dimension],
                ownDistance = metric(point, node.obj),
                linearPoint = {},
                linearDistance,
                otherChild,
                i;

            function saveNode(node, distance) {
                bestNodes.push([node, distance]);
                if (bestNodes.size() > maxNodes) {
                    bestNodes.pop();
                }
            }

            for (i = 0; i < dimensions.length; i += 1) {
                if (i === node.dimension) {
                    linearPoint[dimensions[i]] = point[dimensions[i]];
                } else {
                    linearPoint[dimensions[i]] = node.obj[dimensions[i]];
                }
            }

            linearDistance = metric(linearPoint, node.obj);

            if (node.right === null && node.left === null) {
                if (bestNodes.size() < maxNodes || ownDistance < bestNodes.peek()[1]) {
                    saveNode(node, ownDistance);
                }
                return;
            }

            if (node.right === null) {
                bestChild = node.left;
            } else if (node.left === null) {
                bestChild = node.right;
            } else {
                if (point[dimension] < node.obj[dimension]) {
                    bestChild = node.left;
                } else {
                    bestChild = node.right;
                }
            }

            nearestSearch(bestChild);

            if (bestNodes.size() < maxNodes || ownDistance < bestNodes.peek()[1]) {
                saveNode(node, ownDistance);
            }

            if (bestNodes.size() < maxNodes || Math.abs(linearDistance) < bestNodes.peek()[1]) {
                if (bestChild === node.left) {
                    otherChild = node.right;
                } else {
                    otherChild = node.left;
                }
                if (otherChild !== null) {
                    nearestSearch(otherChild);
                }
            }
        }

        if (maxDistance) {
            for (i = 0; i < maxNodes; i += 1) {
                bestNodes.push([null, maxDistance]);
            }
        }

        if(self.root)
            nearestSearch(self.root);

        result = [];

        for (i = 0; i < Math.min(maxNodes, bestNodes.content.length); i += 1) {
            if (bestNodes.content[i][0]) {
                result.push([bestNodes.content[i][0].obj, bestNodes.content[i][1]]);
            }
        }
        return result;
    };

    this.balanceFactor = function () {
        function height(node) {
            if (node === null) {
                return 0;
            }
            return Math.max(height(node.left), height(node.right)) + 1;
        }

        function count(node) {
            if (node === null) {
                return 0;
            }
            return count(node.left) + count(node.right) + 1;
        }

        return height(self.root) / (Math.log(count(self.root)) / Math.log(2));
    };
}

// Binary heap implementation from:
// http://eloquentjavascript.net/appendix2.html

function BinaryHeap(scoreFunction){
    this.content = [];
    this.scoreFunction = scoreFunction;
}

BinaryHeap.prototype = {
    push: function(element) {
        // Add the new element to the end of the array.
        this.content.push(element);
        // Allow it to bubble up.
        this.bubbleUp(this.content.length - 1);
    },

    pop: function() {
        // Store the first element so we can return it later.
        var result = this.content[0];
        // Get the element at the end of the array.
        var end = this.content.pop();
        // If there are any elements left, put the end element at the
        // start, and let it sink down.
        if (this.content.length > 0) {
            this.content[0] = end;
            this.sinkDown(0);
        }
        return result;
    },

    peek: function() {
        return this.content[0];
    },

    remove: function(node) {
        var len = this.content.length;
        // To remove a value, we must search through the array to find
        // it.
        for (var i = 0; i < len; i++) {
            if (this.content[i] == node) {
                // When it is found, the process seen in 'pop' is repeated
                // to fill up the hole.
                var end = this.content.pop();
                if (i != len - 1) {
                    this.content[i] = end;
                    if (this.scoreFunction(end) < this.scoreFunction(node))
                        this.bubbleUp(i);
                    else
                        this.sinkDown(i);
                }
                return;
            }
        }
        throw new Error("Node not found.");
    },

    size: function() {
        return this.content.length;
    },

    bubbleUp: function(n) {
        // Fetch the element that has to be moved.
        var element = this.content[n];
        // When at 0, an element can not go up any further.
        while (n > 0) {
            // Compute the parent element's index, and fetch it.
            var parentN = Math.floor((n + 1) / 2) - 1,
                parent = this.content[parentN];
            // Swap the elements if the parent is greater.
            if (this.scoreFunction(element) < this.scoreFunction(parent)) {
                this.content[parentN] = element;
                this.content[n] = parent;
                // Update 'n' to continue at the new position.
                n = parentN;
            }
            // Found a parent that is less, no need to move it further.
            else {
                break;
            }
        }
    },

    sinkDown: function(n) {
        // Look up the target element and its score.
        var length = this.content.length,
            element = this.content[n],
            elemScore = this.scoreFunction(element);

        while(true) {
            // Compute the indices of the child elements.
            var child2N = (n + 1) * 2, child1N = child2N - 1;
            // This is used to store the new position of the element,
            // if any.
            var swap = null;
            // If the first child exists (is inside the array)...
            if (child1N < length) {
                // Look it up and compute its score.
                var child1 = this.content[child1N],
                    child1Score = this.scoreFunction(child1);
                // If the score is less than our element's, we need to swap.
                if (child1Score < elemScore)
                    swap = child1N;
            }
            // Do the same checks for the other child.
            if (child2N < length) {
                var child2 = this.content[child2N],
                    child2Score = this.scoreFunction(child2);
                if (child2Score < (swap == null ? elemScore : child1Score)){
                    swap = child2N;
                }
            }

            // If the element needs to be moved, swap it, and continue.
            if (swap != null) {
                this.content[n] = this.content[swap];
                this.content[swap] = element;
                n = swap;
            }
            // Otherwise, we are done.
            else {
                break;
            }
        }
    }
};

this.kdTree = kdTree;

exports.kdTree = kdTree;
exports.BinaryHeap = BinaryHeap;


/***/ }),
/* 133 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = KNN;

var KDTree = __webpack_require__(132).kdTree;
var Distances = __webpack_require__(18);

/**
 * K-Nearest neighboor constructor.
 *
 * @param reload - loading purposes.
 * @param model - loading purposes
 * @constructor
 */
function KNN(reload, model) {
    if(reload) {
        this.kdtree = model.kdtree;
        this.k = model.k;
        this.classes = model.classes;
    }
}

/**
 * Function that trains the KNN with the given trainingSet and trainingLabels.
 * The third argument is an object with the following options.
 *  * distance: that represent the distance function applied (default: euclidean)
 *  * k: the number of neighboors to take in count for classify (default: number of features + 1)
 *
 * @param trainingSet
 * @param trainingLabels
 * @param options
 */
KNN.prototype.train = function (trainingSet, trainingLabels, options) {
    if(options === undefined) options = {};
    if(options.distance === undefined) options.distance = Distances.distance.euclidean;
    if(options.k === undefined) options.k = trainingSet[0].length + 1;

    var classes = 0;
    var exist = new Array(1000);
    var j = 0;
    for(var i = 0; i < trainingLabels.length; ++i) {
        if(exist.indexOf(trainingLabels[i]) === -1) {
            classes++;
            exist[j] = trainingLabels[i];
            j++;
        }
    }

    // copy dataset
    var points = new Array(trainingSet.length);
    for(i = 0; i < points.length; ++i) {
        points[i] = trainingSet[i].slice();
    }

    this.features = trainingSet[0].length;
    for(i = 0; i < trainingLabels.length; ++i) {
        points[i].push(trainingLabels[i]);
    }

    var dimensions = new Array(trainingSet[0].length);
    for(i = 0; i < dimensions.length; ++i) {
        dimensions[i] = i;
    }

    this.kdtree = new KDTree(points, options.distance, dimensions);
    this.k = options.k;
    this.classes = classes;
};

/**
 * Function that returns the predictions given the dataset.
 * 
 * @param dataset
 * @returns {Array}
 */
KNN.prototype.predict = function (dataset) {
    var predictions = new Array(dataset.length);
    for(var i = 0; i < dataset.length; ++i) {
        predictions[i] = this.getSinglePrediction(dataset[i]);
    }

    return predictions;
};

/**
 * function that returns a prediction for a single case.
 * @param currentCase
 * @returns {number}
 */
KNN.prototype.getSinglePrediction = function (currentCase) {
    var nearestPoints = this.kdtree.nearest(currentCase, this.k);
    var pointsPerClass = new Array(this.classes);
    var predictedClass = -1;
    var maxPoints = -1;
    var lastElement = nearestPoints[0][0].length - 1;

    for(var i = 0; i < pointsPerClass.length; ++i) {
        pointsPerClass[i] = 0;
    }

    for(i = 0; i < nearestPoints.length; ++i) {
        var currentClass = nearestPoints[i][0][lastElement];
        var currentPoints = ++pointsPerClass[currentClass];
        if(currentPoints > maxPoints) {
            predictedClass = currentClass;
            maxPoints = currentPoints;
        }
    }

    return predictedClass;
};

/**
 * function that returns a KNN classifier with the given model.
 *
 * @param model
 */
KNN.load = function (model) {
    if(model.modelName !== "KNN")
        throw new RangeError("The given model is invalid!");

    return new KNN(true, model);
};

/**
 * function that exports the current KNN classifier.
 */
KNN.prototype.export = function () {
    return {
        modelName: "KNN",
        kdtree: this.kdtree,
        k: this.k,
        classes: this.classes
    };
};

/***/ }),
/* 134 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Matrix = __webpack_require__(3).Matrix;

// https://github.com/lutzroeder/Mapack/blob/master/Source/CholeskyDecomposition.cs
function CholeskyDecomposition(value) {
    if (!(this instanceof CholeskyDecomposition)) {
        return new CholeskyDecomposition(value);
    }
    value = Matrix.checkMatrix(value);
    if (!value.isSymmetric()) {
        throw new Error('Matrix is not symmetric');
    }

    var a = value,
        dimension = a.rows,
        l = new Matrix(dimension, dimension),
        positiveDefinite = true,
        i, j, k;

    for (j = 0; j < dimension; j++) {
        var Lrowj = l[j];
        var d = 0;
        for (k = 0; k < j; k++) {
            var Lrowk = l[k];
            var s = 0;
            for (i = 0; i < k; i++) {
                s += Lrowk[i] * Lrowj[i];
            }
            Lrowj[k] = s = (a[j][k] - s) / l[k][k];
            d = d + s * s;
        }

        d = a[j][j] - d;

        positiveDefinite &= (d > 0);
        l[j][j] = Math.sqrt(Math.max(d, 0));
        for (k = j + 1; k < dimension; k++) {
            l[j][k] = 0;
        }
    }

    if (!positiveDefinite) {
        throw new Error('Matrix is not positive definite');
    }

    this.L = l;
}

CholeskyDecomposition.prototype = {
    get lowerTriangularMatrix() {
        return this.L;
    },
    solve: function (value) {
        value = Matrix.checkMatrix(value);

        var l = this.L,
            dimension = l.rows;

        if (value.rows !== dimension) {
            throw new Error('Matrix dimensions do not match');
        }

        var count = value.columns,
            B = value.clone(),
            i, j, k;

        for (k = 0; k < dimension; k++) {
            for (j = 0; j < count; j++) {
                for (i = 0; i < k; i++) {
                    B[k][j] -= B[i][j] * l[k][i];
                }
                B[k][j] /= l[k][k];
            }
        }

        for (k = dimension - 1; k >= 0; k--) {
            for (j = 0; j < count; j++) {
                for (i = k + 1; i < dimension; i++) {
                    B[k][j] -= B[i][j] * l[i][k];
                }
                B[k][j] /= l[k][k];
            }
        }

        return B;
    }
};

module.exports = CholeskyDecomposition;


/***/ }),
/* 135 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const Matrix = __webpack_require__(3).Matrix;
const util = __webpack_require__(11);
const hypotenuse = util.hypotenuse;
const getFilled2DArray = util.getFilled2DArray;

const defaultOptions = {
    assumeSymmetric: false
};

// https://github.com/lutzroeder/Mapack/blob/master/Source/EigenvalueDecomposition.cs
function EigenvalueDecomposition(matrix, options) {
    options = Object.assign({}, defaultOptions, options);
    if (!(this instanceof EigenvalueDecomposition)) {
        return new EigenvalueDecomposition(matrix, options);
    }
    matrix = Matrix.checkMatrix(matrix);
    if (!matrix.isSquare()) {
        throw new Error('Matrix is not a square matrix');
    }

    var n = matrix.columns,
        V = getFilled2DArray(n, n, 0),
        d = new Array(n),
        e = new Array(n),
        value = matrix,
        i, j;

    var isSymmetric = false;
    if (options.assumeSymmetric) {
        isSymmetric = true;
    } else {
        isSymmetric = matrix.isSymmetric();
    }

    if (isSymmetric) {
        for (i = 0; i < n; i++) {
            for (j = 0; j < n; j++) {
                V[i][j] = value.get(i, j);
            }
        }
        tred2(n, e, d, V);
        tql2(n, e, d, V);
    } else {
        var H = getFilled2DArray(n, n, 0),
            ort = new Array(n);
        for (j = 0; j < n; j++) {
            for (i = 0; i < n; i++) {
                H[i][j] = value.get(i, j);
            }
        }
        orthes(n, H, ort, V);
        hqr2(n, e, d, V, H);
    }

    this.n = n;
    this.e = e;
    this.d = d;
    this.V = V;
}

EigenvalueDecomposition.prototype = {
    get realEigenvalues() {
        return this.d;
    },
    get imaginaryEigenvalues() {
        return this.e;
    },
    get eigenvectorMatrix() {
        if (!Matrix.isMatrix(this.V)) {
            this.V = new Matrix(this.V);
        }
        return this.V;
    },
    get diagonalMatrix() {
        var n = this.n,
            e = this.e,
            d = this.d,
            X = new Matrix(n, n),
            i, j;
        for (i = 0; i < n; i++) {
            for (j = 0; j < n; j++) {
                X[i][j] = 0;
            }
            X[i][i] = d[i];
            if (e[i] > 0) {
                X[i][i + 1] = e[i];
            } else if (e[i] < 0) {
                X[i][i - 1] = e[i];
            }
        }
        return X;
    }
};

function tred2(n, e, d, V) {

    var f, g, h, i, j, k,
        hh, scale;

    for (j = 0; j < n; j++) {
        d[j] = V[n - 1][j];
    }

    for (i = n - 1; i > 0; i--) {
        scale = 0;
        h = 0;
        for (k = 0; k < i; k++) {
            scale = scale + Math.abs(d[k]);
        }

        if (scale === 0) {
            e[i] = d[i - 1];
            for (j = 0; j < i; j++) {
                d[j] = V[i - 1][j];
                V[i][j] = 0;
                V[j][i] = 0;
            }
        } else {
            for (k = 0; k < i; k++) {
                d[k] /= scale;
                h += d[k] * d[k];
            }

            f = d[i - 1];
            g = Math.sqrt(h);
            if (f > 0) {
                g = -g;
            }

            e[i] = scale * g;
            h = h - f * g;
            d[i - 1] = f - g;
            for (j = 0; j < i; j++) {
                e[j] = 0;
            }

            for (j = 0; j < i; j++) {
                f = d[j];
                V[j][i] = f;
                g = e[j] + V[j][j] * f;
                for (k = j + 1; k <= i - 1; k++) {
                    g += V[k][j] * d[k];
                    e[k] += V[k][j] * f;
                }
                e[j] = g;
            }

            f = 0;
            for (j = 0; j < i; j++) {
                e[j] /= h;
                f += e[j] * d[j];
            }

            hh = f / (h + h);
            for (j = 0; j < i; j++) {
                e[j] -= hh * d[j];
            }

            for (j = 0; j < i; j++) {
                f = d[j];
                g = e[j];
                for (k = j; k <= i - 1; k++) {
                    V[k][j] -= (f * e[k] + g * d[k]);
                }
                d[j] = V[i - 1][j];
                V[i][j] = 0;
            }
        }
        d[i] = h;
    }

    for (i = 0; i < n - 1; i++) {
        V[n - 1][i] = V[i][i];
        V[i][i] = 1;
        h = d[i + 1];
        if (h !== 0) {
            for (k = 0; k <= i; k++) {
                d[k] = V[k][i + 1] / h;
            }

            for (j = 0; j <= i; j++) {
                g = 0;
                for (k = 0; k <= i; k++) {
                    g += V[k][i + 1] * V[k][j];
                }
                for (k = 0; k <= i; k++) {
                    V[k][j] -= g * d[k];
                }
            }
        }

        for (k = 0; k <= i; k++) {
            V[k][i + 1] = 0;
        }
    }

    for (j = 0; j < n; j++) {
        d[j] = V[n - 1][j];
        V[n - 1][j] = 0;
    }

    V[n - 1][n - 1] = 1;
    e[0] = 0;
}

function tql2(n, e, d, V) {

    var g, h, i, j, k, l, m, p, r,
        dl1, c, c2, c3, el1, s, s2,
        iter;

    for (i = 1; i < n; i++) {
        e[i - 1] = e[i];
    }

    e[n - 1] = 0;

    var f = 0,
        tst1 = 0,
        eps = Math.pow(2, -52);

    for (l = 0; l < n; l++) {
        tst1 = Math.max(tst1, Math.abs(d[l]) + Math.abs(e[l]));
        m = l;
        while (m < n) {
            if (Math.abs(e[m]) <= eps * tst1) {
                break;
            }
            m++;
        }

        if (m > l) {
            iter = 0;
            do {
                iter = iter + 1;

                g = d[l];
                p = (d[l + 1] - g) / (2 * e[l]);
                r = hypotenuse(p, 1);
                if (p < 0) {
                    r = -r;
                }

                d[l] = e[l] / (p + r);
                d[l + 1] = e[l] * (p + r);
                dl1 = d[l + 1];
                h = g - d[l];
                for (i = l + 2; i < n; i++) {
                    d[i] -= h;
                }

                f = f + h;

                p = d[m];
                c = 1;
                c2 = c;
                c3 = c;
                el1 = e[l + 1];
                s = 0;
                s2 = 0;
                for (i = m - 1; i >= l; i--) {
                    c3 = c2;
                    c2 = c;
                    s2 = s;
                    g = c * e[i];
                    h = c * p;
                    r = hypotenuse(p, e[i]);
                    e[i + 1] = s * r;
                    s = e[i] / r;
                    c = p / r;
                    p = c * d[i] - s * g;
                    d[i + 1] = h + s * (c * g + s * d[i]);

                    for (k = 0; k < n; k++) {
                        h = V[k][i + 1];
                        V[k][i + 1] = s * V[k][i] + c * h;
                        V[k][i] = c * V[k][i] - s * h;
                    }
                }

                p = -s * s2 * c3 * el1 * e[l] / dl1;
                e[l] = s * p;
                d[l] = c * p;

            }
            while (Math.abs(e[l]) > eps * tst1);
        }
        d[l] = d[l] + f;
        e[l] = 0;
    }

    for (i = 0; i < n - 1; i++) {
        k = i;
        p = d[i];
        for (j = i + 1; j < n; j++) {
            if (d[j] < p) {
                k = j;
                p = d[j];
            }
        }

        if (k !== i) {
            d[k] = d[i];
            d[i] = p;
            for (j = 0; j < n; j++) {
                p = V[j][i];
                V[j][i] = V[j][k];
                V[j][k] = p;
            }
        }
    }
}

function orthes(n, H, ort, V) {

    var low = 0,
        high = n - 1,
        f, g, h, i, j, m,
        scale;

    for (m = low + 1; m <= high - 1; m++) {
        scale = 0;
        for (i = m; i <= high; i++) {
            scale = scale + Math.abs(H[i][m - 1]);
        }

        if (scale !== 0) {
            h = 0;
            for (i = high; i >= m; i--) {
                ort[i] = H[i][m - 1] / scale;
                h += ort[i] * ort[i];
            }

            g = Math.sqrt(h);
            if (ort[m] > 0) {
                g = -g;
            }

            h = h - ort[m] * g;
            ort[m] = ort[m] - g;

            for (j = m; j < n; j++) {
                f = 0;
                for (i = high; i >= m; i--) {
                    f += ort[i] * H[i][j];
                }

                f = f / h;
                for (i = m; i <= high; i++) {
                    H[i][j] -= f * ort[i];
                }
            }

            for (i = 0; i <= high; i++) {
                f = 0;
                for (j = high; j >= m; j--) {
                    f += ort[j] * H[i][j];
                }

                f = f / h;
                for (j = m; j <= high; j++) {
                    H[i][j] -= f * ort[j];
                }
            }

            ort[m] = scale * ort[m];
            H[m][m - 1] = scale * g;
        }
    }

    for (i = 0; i < n; i++) {
        for (j = 0; j < n; j++) {
            V[i][j] = (i === j ? 1 : 0);
        }
    }

    for (m = high - 1; m >= low + 1; m--) {
        if (H[m][m - 1] !== 0) {
            for (i = m + 1; i <= high; i++) {
                ort[i] = H[i][m - 1];
            }

            for (j = m; j <= high; j++) {
                g = 0;
                for (i = m; i <= high; i++) {
                    g += ort[i] * V[i][j];
                }

                g = (g / ort[m]) / H[m][m - 1];
                for (i = m; i <= high; i++) {
                    V[i][j] += g * ort[i];
                }
            }
        }
    }
}

function hqr2(nn, e, d, V, H) {
    var n = nn - 1,
        low = 0,
        high = nn - 1,
        eps = Math.pow(2, -52),
        exshift = 0,
        norm = 0,
        p = 0,
        q = 0,
        r = 0,
        s = 0,
        z = 0,
        iter = 0,
        i, j, k, l, m, t, w, x, y,
        ra, sa, vr, vi,
        notlast, cdivres;

    for (i = 0; i < nn; i++) {
        if (i < low || i > high) {
            d[i] = H[i][i];
            e[i] = 0;
        }

        for (j = Math.max(i - 1, 0); j < nn; j++) {
            norm = norm + Math.abs(H[i][j]);
        }
    }

    while (n >= low) {
        l = n;
        while (l > low) {
            s = Math.abs(H[l - 1][l - 1]) + Math.abs(H[l][l]);
            if (s === 0) {
                s = norm;
            }
            if (Math.abs(H[l][l - 1]) < eps * s) {
                break;
            }
            l--;
        }

        if (l === n) {
            H[n][n] = H[n][n] + exshift;
            d[n] = H[n][n];
            e[n] = 0;
            n--;
            iter = 0;
        } else if (l === n - 1) {
            w = H[n][n - 1] * H[n - 1][n];
            p = (H[n - 1][n - 1] - H[n][n]) / 2;
            q = p * p + w;
            z = Math.sqrt(Math.abs(q));
            H[n][n] = H[n][n] + exshift;
            H[n - 1][n - 1] = H[n - 1][n - 1] + exshift;
            x = H[n][n];

            if (q >= 0) {
                z = (p >= 0) ? (p + z) : (p - z);
                d[n - 1] = x + z;
                d[n] = d[n - 1];
                if (z !== 0) {
                    d[n] = x - w / z;
                }
                e[n - 1] = 0;
                e[n] = 0;
                x = H[n][n - 1];
                s = Math.abs(x) + Math.abs(z);
                p = x / s;
                q = z / s;
                r = Math.sqrt(p * p + q * q);
                p = p / r;
                q = q / r;

                for (j = n - 1; j < nn; j++) {
                    z = H[n - 1][j];
                    H[n - 1][j] = q * z + p * H[n][j];
                    H[n][j] = q * H[n][j] - p * z;
                }

                for (i = 0; i <= n; i++) {
                    z = H[i][n - 1];
                    H[i][n - 1] = q * z + p * H[i][n];
                    H[i][n] = q * H[i][n] - p * z;
                }

                for (i = low; i <= high; i++) {
                    z = V[i][n - 1];
                    V[i][n - 1] = q * z + p * V[i][n];
                    V[i][n] = q * V[i][n] - p * z;
                }
            } else {
                d[n - 1] = x + p;
                d[n] = x + p;
                e[n - 1] = z;
                e[n] = -z;
            }

            n = n - 2;
            iter = 0;
        } else {
            x = H[n][n];
            y = 0;
            w = 0;
            if (l < n) {
                y = H[n - 1][n - 1];
                w = H[n][n - 1] * H[n - 1][n];
            }

            if (iter === 10) {
                exshift += x;
                for (i = low; i <= n; i++) {
                    H[i][i] -= x;
                }
                s = Math.abs(H[n][n - 1]) + Math.abs(H[n - 1][n - 2]);
                x = y = 0.75 * s;
                w = -0.4375 * s * s;
            }

            if (iter === 30) {
                s = (y - x) / 2;
                s = s * s + w;
                if (s > 0) {
                    s = Math.sqrt(s);
                    if (y < x) {
                        s = -s;
                    }
                    s = x - w / ((y - x) / 2 + s);
                    for (i = low; i <= n; i++) {
                        H[i][i] -= s;
                    }
                    exshift += s;
                    x = y = w = 0.964;
                }
            }

            iter = iter + 1;

            m = n - 2;
            while (m >= l) {
                z = H[m][m];
                r = x - z;
                s = y - z;
                p = (r * s - w) / H[m + 1][m] + H[m][m + 1];
                q = H[m + 1][m + 1] - z - r - s;
                r = H[m + 2][m + 1];
                s = Math.abs(p) + Math.abs(q) + Math.abs(r);
                p = p / s;
                q = q / s;
                r = r / s;
                if (m === l) {
                    break;
                }
                if (Math.abs(H[m][m - 1]) * (Math.abs(q) + Math.abs(r)) < eps * (Math.abs(p) * (Math.abs(H[m - 1][m - 1]) + Math.abs(z) + Math.abs(H[m + 1][m + 1])))) {
                    break;
                }
                m--;
            }

            for (i = m + 2; i <= n; i++) {
                H[i][i - 2] = 0;
                if (i > m + 2) {
                    H[i][i - 3] = 0;
                }
            }

            for (k = m; k <= n - 1; k++) {
                notlast = (k !== n - 1);
                if (k !== m) {
                    p = H[k][k - 1];
                    q = H[k + 1][k - 1];
                    r = (notlast ? H[k + 2][k - 1] : 0);
                    x = Math.abs(p) + Math.abs(q) + Math.abs(r);
                    if (x !== 0) {
                        p = p / x;
                        q = q / x;
                        r = r / x;
                    }
                }

                if (x === 0) {
                    break;
                }

                s = Math.sqrt(p * p + q * q + r * r);
                if (p < 0) {
                    s = -s;
                }

                if (s !== 0) {
                    if (k !== m) {
                        H[k][k - 1] = -s * x;
                    } else if (l !== m) {
                        H[k][k - 1] = -H[k][k - 1];
                    }

                    p = p + s;
                    x = p / s;
                    y = q / s;
                    z = r / s;
                    q = q / p;
                    r = r / p;

                    for (j = k; j < nn; j++) {
                        p = H[k][j] + q * H[k + 1][j];
                        if (notlast) {
                            p = p + r * H[k + 2][j];
                            H[k + 2][j] = H[k + 2][j] - p * z;
                        }

                        H[k][j] = H[k][j] - p * x;
                        H[k + 1][j] = H[k + 1][j] - p * y;
                    }

                    for (i = 0; i <= Math.min(n, k + 3); i++) {
                        p = x * H[i][k] + y * H[i][k + 1];
                        if (notlast) {
                            p = p + z * H[i][k + 2];
                            H[i][k + 2] = H[i][k + 2] - p * r;
                        }

                        H[i][k] = H[i][k] - p;
                        H[i][k + 1] = H[i][k + 1] - p * q;
                    }

                    for (i = low; i <= high; i++) {
                        p = x * V[i][k] + y * V[i][k + 1];
                        if (notlast) {
                            p = p + z * V[i][k + 2];
                            V[i][k + 2] = V[i][k + 2] - p * r;
                        }

                        V[i][k] = V[i][k] - p;
                        V[i][k + 1] = V[i][k + 1] - p * q;
                    }
                }
            }
        }
    }

    if (norm === 0) {
        return;
    }

    for (n = nn - 1; n >= 0; n--) {
        p = d[n];
        q = e[n];

        if (q === 0) {
            l = n;
            H[n][n] = 1;
            for (i = n - 1; i >= 0; i--) {
                w = H[i][i] - p;
                r = 0;
                for (j = l; j <= n; j++) {
                    r = r + H[i][j] * H[j][n];
                }

                if (e[i] < 0) {
                    z = w;
                    s = r;
                } else {
                    l = i;
                    if (e[i] === 0) {
                        H[i][n] = (w !== 0) ? (-r / w) : (-r / (eps * norm));
                    } else {
                        x = H[i][i + 1];
                        y = H[i + 1][i];
                        q = (d[i] - p) * (d[i] - p) + e[i] * e[i];
                        t = (x * s - z * r) / q;
                        H[i][n] = t;
                        H[i + 1][n] = (Math.abs(x) > Math.abs(z)) ? ((-r - w * t) / x) : ((-s - y * t) / z);
                    }

                    t = Math.abs(H[i][n]);
                    if ((eps * t) * t > 1) {
                        for (j = i; j <= n; j++) {
                            H[j][n] = H[j][n] / t;
                        }
                    }
                }
            }
        } else if (q < 0) {
            l = n - 1;

            if (Math.abs(H[n][n - 1]) > Math.abs(H[n - 1][n])) {
                H[n - 1][n - 1] = q / H[n][n - 1];
                H[n - 1][n] = -(H[n][n] - p) / H[n][n - 1];
            } else {
                cdivres = cdiv(0, -H[n - 1][n], H[n - 1][n - 1] - p, q);
                H[n - 1][n - 1] = cdivres[0];
                H[n - 1][n] = cdivres[1];
            }

            H[n][n - 1] = 0;
            H[n][n] = 1;
            for (i = n - 2; i >= 0; i--) {
                ra = 0;
                sa = 0;
                for (j = l; j <= n; j++) {
                    ra = ra + H[i][j] * H[j][n - 1];
                    sa = sa + H[i][j] * H[j][n];
                }

                w = H[i][i] - p;

                if (e[i] < 0) {
                    z = w;
                    r = ra;
                    s = sa;
                } else {
                    l = i;
                    if (e[i] === 0) {
                        cdivres = cdiv(-ra, -sa, w, q);
                        H[i][n - 1] = cdivres[0];
                        H[i][n] = cdivres[1];
                    } else {
                        x = H[i][i + 1];
                        y = H[i + 1][i];
                        vr = (d[i] - p) * (d[i] - p) + e[i] * e[i] - q * q;
                        vi = (d[i] - p) * 2 * q;
                        if (vr === 0 && vi === 0) {
                            vr = eps * norm * (Math.abs(w) + Math.abs(q) + Math.abs(x) + Math.abs(y) + Math.abs(z));
                        }
                        cdivres = cdiv(x * r - z * ra + q * sa, x * s - z * sa - q * ra, vr, vi);
                        H[i][n - 1] = cdivres[0];
                        H[i][n] = cdivres[1];
                        if (Math.abs(x) > (Math.abs(z) + Math.abs(q))) {
                            H[i + 1][n - 1] = (-ra - w * H[i][n - 1] + q * H[i][n]) / x;
                            H[i + 1][n] = (-sa - w * H[i][n] - q * H[i][n - 1]) / x;
                        } else {
                            cdivres = cdiv(-r - y * H[i][n - 1], -s - y * H[i][n], z, q);
                            H[i + 1][n - 1] = cdivres[0];
                            H[i + 1][n] = cdivres[1];
                        }
                    }

                    t = Math.max(Math.abs(H[i][n - 1]), Math.abs(H[i][n]));
                    if ((eps * t) * t > 1) {
                        for (j = i; j <= n; j++) {
                            H[j][n - 1] = H[j][n - 1] / t;
                            H[j][n] = H[j][n] / t;
                        }
                    }
                }
            }
        }
    }

    for (i = 0; i < nn; i++) {
        if (i < low || i > high) {
            for (j = i; j < nn; j++) {
                V[i][j] = H[i][j];
            }
        }
    }

    for (j = nn - 1; j >= low; j--) {
        for (i = low; i <= high; i++) {
            z = 0;
            for (k = low; k <= Math.min(j, high); k++) {
                z = z + V[i][k] * H[k][j];
            }
            V[i][j] = z;
        }
    }
}

function cdiv(xr, xi, yr, yi) {
    var r, d;
    if (Math.abs(yr) > Math.abs(yi)) {
        r = yi / yr;
        d = yr + r * yi;
        return [(xr + r * xi) / d, (xi - r * xr) / d];
    } else {
        r = yr / yi;
        d = yi + r * yr;
        return [(r * xr + xi) / d, (r * xi - xr) / d];
    }
}

module.exports = EigenvalueDecomposition;


/***/ }),
/* 136 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Matrix = __webpack_require__(3).Matrix;
var hypotenuse = __webpack_require__(11).hypotenuse;

//https://github.com/lutzroeder/Mapack/blob/master/Source/QrDecomposition.cs
function QrDecomposition(value) {
    if (!(this instanceof QrDecomposition)) {
        return new QrDecomposition(value);
    }
    value = Matrix.checkMatrix(value);

    var qr = value.clone(),
        m = value.rows,
        n = value.columns,
        rdiag = new Array(n),
        i, j, k, s;

    for (k = 0; k < n; k++) {
        var nrm = 0;
        for (i = k; i < m; i++) {
            nrm = hypotenuse(nrm, qr[i][k]);
        }
        if (nrm !== 0) {
            if (qr[k][k] < 0) {
                nrm = -nrm;
            }
            for (i = k; i < m; i++) {
                qr[i][k] /= nrm;
            }
            qr[k][k] += 1;
            for (j = k + 1; j < n; j++) {
                s = 0;
                for (i = k; i < m; i++) {
                    s += qr[i][k] * qr[i][j];
                }
                s = -s / qr[k][k];
                for (i = k; i < m; i++) {
                    qr[i][j] += s * qr[i][k];
                }
            }
        }
        rdiag[k] = -nrm;
    }

    this.QR = qr;
    this.Rdiag = rdiag;
}

QrDecomposition.prototype = {
    solve: function (value) {
        value = Matrix.checkMatrix(value);

        var qr = this.QR,
            m = qr.rows;

        if (value.rows !== m) {
            throw new Error('Matrix row dimensions must agree');
        }
        if (!this.isFullRank()) {
            throw new Error('Matrix is rank deficient');
        }

        var count = value.columns;
        var X = value.clone();
        var n = qr.columns;
        var i, j, k, s;

        for (k = 0; k < n; k++) {
            for (j = 0; j < count; j++) {
                s = 0;
                for (i = k; i < m; i++) {
                    s += qr[i][k] * X[i][j];
                }
                s = -s / qr[k][k];
                for (i = k; i < m; i++) {
                    X[i][j] += s * qr[i][k];
                }
            }
        }
        for (k = n - 1; k >= 0; k--) {
            for (j = 0; j < count; j++) {
                X[k][j] /= this.Rdiag[k];
            }
            for (i = 0; i < k; i++) {
                for (j = 0; j < count; j++) {
                    X[i][j] -= X[k][j] * qr[i][k];
                }
            }
        }

        return X.subMatrix(0, n - 1, 0, count - 1);
    },
    isFullRank: function () {
        var columns = this.QR.columns;
        for (var i = 0; i < columns; i++) {
            if (this.Rdiag[i] === 0) {
                return false;
            }
        }
        return true;
    },
    get upperTriangularMatrix() {
        var qr = this.QR,
            n = qr.columns,
            X = new Matrix(n, n),
            i, j;
        for (i = 0; i < n; i++) {
            for (j = 0; j < n; j++) {
                if (i < j) {
                    X[i][j] = qr[i][j];
                } else if (i === j) {
                    X[i][j] = this.Rdiag[i];
                } else {
                    X[i][j] = 0;
                }
            }
        }
        return X;
    },
    get orthogonalMatrix() {
        var qr = this.QR,
            rows = qr.rows,
            columns = qr.columns,
            X = new Matrix(rows, columns),
            i, j, k, s;

        for (k = columns - 1; k >= 0; k--) {
            for (i = 0; i < rows; i++) {
                X[i][k] = 0;
            }
            X[k][k] = 1;
            for (j = k; j < columns; j++) {
                if (qr[k][k] !== 0) {
                    s = 0;
                    for (i = k; i < rows; i++) {
                        s += qr[i][k] * X[i][j];
                    }

                    s = -s / qr[k][k];

                    for (i = k; i < rows; i++) {
                        X[i][j] += s * qr[i][k];
                    }
                }
            }
        }
        return X;
    }
};

module.exports = QrDecomposition;


/***/ }),
/* 137 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Matrix = __webpack_require__(3).Matrix;
var util = __webpack_require__(11);
var hypotenuse = util.hypotenuse;
var getFilled2DArray = util.getFilled2DArray;

// https://github.com/lutzroeder/Mapack/blob/master/Source/SingularValueDecomposition.cs
function SingularValueDecomposition(value, options) {
    if (!(this instanceof SingularValueDecomposition)) {
        return new SingularValueDecomposition(value, options);
    }
    value = Matrix.checkMatrix(value);

    options = options || {};

    var m = value.rows,
        n = value.columns,
        nu = Math.min(m, n);

    var wantu = true, wantv = true;
    if (options.computeLeftSingularVectors === false) wantu = false;
    if (options.computeRightSingularVectors === false) wantv = false;
    var autoTranspose = options.autoTranspose === true;

    var swapped = false;
    var a;
    if (m < n) {
        if (!autoTranspose) {
            a = value.clone();
            // eslint-disable-next-line no-console
            console.warn('Computing SVD on a matrix with more columns than rows. Consider enabling autoTranspose');
        } else {
            a = value.transpose();
            m = a.rows;
            n = a.columns;
            swapped = true;
            var aux = wantu;
            wantu = wantv;
            wantv = aux;
        }
    } else {
        a = value.clone();
    }

    var s = new Array(Math.min(m + 1, n)),
        U = getFilled2DArray(m, nu, 0),
        V = getFilled2DArray(n, n, 0),
        e = new Array(n),
        work = new Array(m);

    var nct = Math.min(m - 1, n);
    var nrt = Math.max(0, Math.min(n - 2, m));

    var i, j, k, p, t, ks, f, cs, sn, max, kase,
        scale, sp, spm1, epm1, sk, ek, b, c, shift, g;

    for (k = 0, max = Math.max(nct, nrt); k < max; k++) {
        if (k < nct) {
            s[k] = 0;
            for (i = k; i < m; i++) {
                s[k] = hypotenuse(s[k], a[i][k]);
            }
            if (s[k] !== 0) {
                if (a[k][k] < 0) {
                    s[k] = -s[k];
                }
                for (i = k; i < m; i++) {
                    a[i][k] /= s[k];
                }
                a[k][k] += 1;
            }
            s[k] = -s[k];
        }

        for (j = k + 1; j < n; j++) {
            if ((k < nct) && (s[k] !== 0)) {
                t = 0;
                for (i = k; i < m; i++) {
                    t += a[i][k] * a[i][j];
                }
                t = -t / a[k][k];
                for (i = k; i < m; i++) {
                    a[i][j] += t * a[i][k];
                }
            }
            e[j] = a[k][j];
        }

        if (wantu && (k < nct)) {
            for (i = k; i < m; i++) {
                U[i][k] = a[i][k];
            }
        }

        if (k < nrt) {
            e[k] = 0;
            for (i = k + 1; i < n; i++) {
                e[k] = hypotenuse(e[k], e[i]);
            }
            if (e[k] !== 0) {
                if (e[k + 1] < 0) {
                    e[k] = 0 - e[k];
                }
                for (i = k + 1; i < n; i++) {
                    e[i] /= e[k];
                }
                e[k + 1] += 1;
            }
            e[k] = -e[k];
            if ((k + 1 < m) && (e[k] !== 0)) {
                for (i = k + 1; i < m; i++) {
                    work[i] = 0;
                }
                for (j = k + 1; j < n; j++) {
                    for (i = k + 1; i < m; i++) {
                        work[i] += e[j] * a[i][j];
                    }
                }
                for (j = k + 1; j < n; j++) {
                    t = -e[j] / e[k + 1];
                    for (i = k + 1; i < m; i++) {
                        a[i][j] += t * work[i];
                    }
                }
            }
            if (wantv) {
                for (i = k + 1; i < n; i++) {
                    V[i][k] = e[i];
                }
            }
        }
    }

    p = Math.min(n, m + 1);
    if (nct < n) {
        s[nct] = a[nct][nct];
    }
    if (m < p) {
        s[p - 1] = 0;
    }
    if (nrt + 1 < p) {
        e[nrt] = a[nrt][p - 1];
    }
    e[p - 1] = 0;

    if (wantu) {
        for (j = nct; j < nu; j++) {
            for (i = 0; i < m; i++) {
                U[i][j] = 0;
            }
            U[j][j] = 1;
        }
        for (k = nct - 1; k >= 0; k--) {
            if (s[k] !== 0) {
                for (j = k + 1; j < nu; j++) {
                    t = 0;
                    for (i = k; i < m; i++) {
                        t += U[i][k] * U[i][j];
                    }
                    t = -t / U[k][k];
                    for (i = k; i < m; i++) {
                        U[i][j] += t * U[i][k];
                    }
                }
                for (i = k; i < m; i++) {
                    U[i][k] = -U[i][k];
                }
                U[k][k] = 1 + U[k][k];
                for (i = 0; i < k - 1; i++) {
                    U[i][k] = 0;
                }
            } else {
                for (i = 0; i < m; i++) {
                    U[i][k] = 0;
                }
                U[k][k] = 1;
            }
        }
    }

    if (wantv) {
        for (k = n - 1; k >= 0; k--) {
            if ((k < nrt) && (e[k] !== 0)) {
                for (j = k + 1; j < n; j++) {
                    t = 0;
                    for (i = k + 1; i < n; i++) {
                        t += V[i][k] * V[i][j];
                    }
                    t = -t / V[k + 1][k];
                    for (i = k + 1; i < n; i++) {
                        V[i][j] += t * V[i][k];
                    }
                }
            }
            for (i = 0; i < n; i++) {
                V[i][k] = 0;
            }
            V[k][k] = 1;
        }
    }

    var pp = p - 1,
        iter = 0,
        eps = Math.pow(2, -52);
    while (p > 0) {
        for (k = p - 2; k >= -1; k--) {
            if (k === -1) {
                break;
            }
            if (Math.abs(e[k]) <= eps * (Math.abs(s[k]) + Math.abs(s[k + 1]))) {
                e[k] = 0;
                break;
            }
        }
        if (k === p - 2) {
            kase = 4;
        } else {
            for (ks = p - 1; ks >= k; ks--) {
                if (ks === k) {
                    break;
                }
                t = (ks !== p ? Math.abs(e[ks]) : 0) + (ks !== k + 1 ? Math.abs(e[ks - 1]) : 0);
                if (Math.abs(s[ks]) <= eps * t) {
                    s[ks] = 0;
                    break;
                }
            }
            if (ks === k) {
                kase = 3;
            } else if (ks === p - 1) {
                kase = 1;
            } else {
                kase = 2;
                k = ks;
            }
        }

        k++;

        switch (kase) {
            case 1: {
                f = e[p - 2];
                e[p - 2] = 0;
                for (j = p - 2; j >= k; j--) {
                    t = hypotenuse(s[j], f);
                    cs = s[j] / t;
                    sn = f / t;
                    s[j] = t;
                    if (j !== k) {
                        f = -sn * e[j - 1];
                        e[j - 1] = cs * e[j - 1];
                    }
                    if (wantv) {
                        for (i = 0; i < n; i++) {
                            t = cs * V[i][j] + sn * V[i][p - 1];
                            V[i][p - 1] = -sn * V[i][j] + cs * V[i][p - 1];
                            V[i][j] = t;
                        }
                    }
                }
                break;
            }
            case 2 : {
                f = e[k - 1];
                e[k - 1] = 0;
                for (j = k; j < p; j++) {
                    t = hypotenuse(s[j], f);
                    cs = s[j] / t;
                    sn = f / t;
                    s[j] = t;
                    f = -sn * e[j];
                    e[j] = cs * e[j];
                    if (wantu) {
                        for (i = 0; i < m; i++) {
                            t = cs * U[i][j] + sn * U[i][k - 1];
                            U[i][k - 1] = -sn * U[i][j] + cs * U[i][k - 1];
                            U[i][j] = t;
                        }
                    }
                }
                break;
            }
            case 3 : {
                scale = Math.max(Math.max(Math.max(Math.max(Math.abs(s[p - 1]), Math.abs(s[p - 2])), Math.abs(e[p - 2])), Math.abs(s[k])), Math.abs(e[k]));
                sp = s[p - 1] / scale;
                spm1 = s[p - 2] / scale;
                epm1 = e[p - 2] / scale;
                sk = s[k] / scale;
                ek = e[k] / scale;
                b = ((spm1 + sp) * (spm1 - sp) + epm1 * epm1) / 2;
                c = (sp * epm1) * (sp * epm1);
                shift = 0;
                if ((b !== 0) || (c !== 0)) {
                    shift = Math.sqrt(b * b + c);
                    if (b < 0) {
                        shift = -shift;
                    }
                    shift = c / (b + shift);
                }
                f = (sk + sp) * (sk - sp) + shift;
                g = sk * ek;
                for (j = k; j < p - 1; j++) {
                    t = hypotenuse(f, g);
                    cs = f / t;
                    sn = g / t;
                    if (j !== k) {
                        e[j - 1] = t;
                    }
                    f = cs * s[j] + sn * e[j];
                    e[j] = cs * e[j] - sn * s[j];
                    g = sn * s[j + 1];
                    s[j + 1] = cs * s[j + 1];
                    if (wantv) {
                        for (i = 0; i < n; i++) {
                            t = cs * V[i][j] + sn * V[i][j + 1];
                            V[i][j + 1] = -sn * V[i][j] + cs * V[i][j + 1];
                            V[i][j] = t;
                        }
                    }
                    t = hypotenuse(f, g);
                    cs = f / t;
                    sn = g / t;
                    s[j] = t;
                    f = cs * e[j] + sn * s[j + 1];
                    s[j + 1] = -sn * e[j] + cs * s[j + 1];
                    g = sn * e[j + 1];
                    e[j + 1] = cs * e[j + 1];
                    if (wantu && (j < m - 1)) {
                        for (i = 0; i < m; i++) {
                            t = cs * U[i][j] + sn * U[i][j + 1];
                            U[i][j + 1] = -sn * U[i][j] + cs * U[i][j + 1];
                            U[i][j] = t;
                        }
                    }
                }
                e[p - 2] = f;
                iter = iter + 1;
                break;
            }
            case 4: {
                if (s[k] <= 0) {
                    s[k] = (s[k] < 0 ? -s[k] : 0);
                    if (wantv) {
                        for (i = 0; i <= pp; i++) {
                            V[i][k] = -V[i][k];
                        }
                    }
                }
                while (k < pp) {
                    if (s[k] >= s[k + 1]) {
                        break;
                    }
                    t = s[k];
                    s[k] = s[k + 1];
                    s[k + 1] = t;
                    if (wantv && (k < n - 1)) {
                        for (i = 0; i < n; i++) {
                            t = V[i][k + 1];
                            V[i][k + 1] = V[i][k];
                            V[i][k] = t;
                        }
                    }
                    if (wantu && (k < m - 1)) {
                        for (i = 0; i < m; i++) {
                            t = U[i][k + 1];
                            U[i][k + 1] = U[i][k];
                            U[i][k] = t;
                        }
                    }
                    k++;
                }
                iter = 0;
                p--;
                break;
            }
            // no default
        }
    }

    if (swapped) {
        var tmp = V;
        V = U;
        U = tmp;
    }

    this.m = m;
    this.n = n;
    this.s = s;
    this.U = U;
    this.V = V;
}

SingularValueDecomposition.prototype = {
    get condition() {
        return this.s[0] / this.s[Math.min(this.m, this.n) - 1];
    },
    get norm2() {
        return this.s[0];
    },
    get rank() {
        var eps = Math.pow(2, -52),
            tol = Math.max(this.m, this.n) * this.s[0] * eps,
            r = 0,
            s = this.s;
        for (var i = 0, ii = s.length; i < ii; i++) {
            if (s[i] > tol) {
                r++;
            }
        }
        return r;
    },
    get diagonal() {
        return this.s;
    },
    // https://github.com/accord-net/framework/blob/development/Sources/Accord.Math/Decompositions/SingularValueDecomposition.cs
    get threshold() {
        return (Math.pow(2, -52) / 2) * Math.max(this.m, this.n) * this.s[0];
    },
    get leftSingularVectors() {
        if (!Matrix.isMatrix(this.U)) {
            this.U = new Matrix(this.U);
        }
        return this.U;
    },
    get rightSingularVectors() {
        if (!Matrix.isMatrix(this.V)) {
            this.V = new Matrix(this.V);
        }
        return this.V;
    },
    get diagonalMatrix() {
        return Matrix.diag(this.s);
    },
    solve: function (value) {

        var Y = value,
            e = this.threshold,
            scols = this.s.length,
            Ls = Matrix.zeros(scols, scols),
            i;

        for (i = 0; i < scols; i++) {
            if (Math.abs(this.s[i]) <= e) {
                Ls[i][i] = 0;
            } else {
                Ls[i][i] = 1 / this.s[i];
            }
        }

        var U = this.U;
        var V = this.rightSingularVectors;

        var VL = V.mmul(Ls),
            vrows = V.rows,
            urows = U.length,
            VLU = Matrix.zeros(vrows, urows),
            j, k, sum;

        for (i = 0; i < vrows; i++) {
            for (j = 0; j < urows; j++) {
                sum = 0;
                for (k = 0; k < scols; k++) {
                    sum += VL[i][k] * U[j][k];
                }
                VLU[i][j] = sum;
            }
        }

        return VLU.mmul(Y);
    },
    solveForDiagonal: function (value) {
        return this.solve(Matrix.diag(value));
    },
    inverse: function () {
        var V = this.V;
        var e = this.threshold,
            vrows = V.length,
            vcols = V[0].length,
            X = new Matrix(vrows, this.s.length),
            i, j;

        for (i = 0; i < vrows; i++) {
            for (j = 0; j < vcols; j++) {
                if (Math.abs(this.s[j]) > e) {
                    X[i][j] = V[i][j] / this.s[j];
                } else {
                    X[i][j] = 0;
                }
            }
        }

        var U = this.U;

        var urows = U.length,
            ucols = U[0].length,
            Y = new Matrix(vrows, urows),
            k, sum;

        for (i = 0; i < vrows; i++) {
            for (j = 0; j < urows; j++) {
                sum = 0;
                for (k = 0; k < ucols; k++) {
                    sum += X[i][k] * U[j][k];
                }
                Y[i][j] = sum;
            }
        }

        return Y;
    }
};

module.exports = SingularValueDecomposition;


/***/ }),
/* 138 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Matrix = __webpack_require__(3).Matrix;

var SingularValueDecomposition = __webpack_require__(137);
var EigenvalueDecomposition = __webpack_require__(135);
var LuDecomposition = __webpack_require__(38);
var QrDecomposition = __webpack_require__(136);
var CholeskyDecomposition = __webpack_require__(134);

function inverse(matrix) {
    matrix = Matrix.checkMatrix(matrix);
    return solve(matrix, Matrix.eye(matrix.rows));
}

/**
 * Returns the inverse
 * @memberOf Matrix
 * @static
 * @param {Matrix} matrix
 * @return {Matrix} matrix
 * @alias inv
 */
Matrix.inverse = Matrix.inv = inverse;

/**
 * Returns the inverse
 * @memberOf Matrix
 * @static
 * @param {Matrix} matrix
 * @return {Matrix} matrix
 * @alias inv
 */
Matrix.prototype.inverse = Matrix.prototype.inv = function () {
    return inverse(this);
};

function solve(leftHandSide, rightHandSide) {
    leftHandSide = Matrix.checkMatrix(leftHandSide);
    rightHandSide = Matrix.checkMatrix(rightHandSide);
    return leftHandSide.isSquare() ? new LuDecomposition(leftHandSide).solve(rightHandSide) : new QrDecomposition(leftHandSide).solve(rightHandSide);
}

Matrix.solve = solve;
Matrix.prototype.solve = function (other) {
    return solve(this, other);
};

module.exports = {
    SingularValueDecomposition: SingularValueDecomposition,
    SVD: SingularValueDecomposition,
    EigenvalueDecomposition: EigenvalueDecomposition,
    EVD: EigenvalueDecomposition,
    LuDecomposition: LuDecomposition,
    LU: LuDecomposition,
    QrDecomposition: QrDecomposition,
    QR: QrDecomposition,
    CholeskyDecomposition: CholeskyDecomposition,
    CHO: CholeskyDecomposition,
    inverse: inverse,
    solve: solve
};


/***/ }),
/* 139 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


if (!Symbol.species) {
    Symbol.species = Symbol.for('@@species');
}


/***/ }),
/* 140 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var BaseView = __webpack_require__(5);

class MatrixColumnView extends BaseView {
    constructor(matrix, column) {
        super(matrix, matrix.rows, 1);
        this.column = column;
    }

    set(rowIndex, columnIndex, value) {
        this.matrix.set(rowIndex, this.column, value);
        return this;
    }

    get(rowIndex) {
        return this.matrix.get(rowIndex, this.column);
    }
}

module.exports = MatrixColumnView;


/***/ }),
/* 141 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var BaseView = __webpack_require__(5);

class MatrixFlipColumnView extends BaseView {
    constructor(matrix) {
        super(matrix, matrix.rows, matrix.columns);
    }

    set(rowIndex, columnIndex, value) {
        this.matrix.set(rowIndex, this.columns - columnIndex - 1, value);
        return this;
    }

    get(rowIndex, columnIndex) {
        return this.matrix.get(rowIndex, this.columns - columnIndex - 1);
    }
}

module.exports = MatrixFlipColumnView;


/***/ }),
/* 142 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var BaseView = __webpack_require__(5);

class MatrixFlipRowView extends BaseView {
    constructor(matrix) {
        super(matrix, matrix.rows, matrix.columns);
    }

    set(rowIndex, columnIndex, value) {
        this.matrix.set(this.rows - rowIndex - 1, columnIndex, value);
        return this;
    }

    get(rowIndex, columnIndex) {
        return this.matrix.get(this.rows - rowIndex - 1, columnIndex);
    }
}

module.exports = MatrixFlipRowView;


/***/ }),
/* 143 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var BaseView = __webpack_require__(5);

class MatrixRowView extends BaseView {
    constructor(matrix, row) {
        super(matrix, 1, matrix.columns);
        this.row = row;
    }

    set(rowIndex, columnIndex, value) {
        this.matrix.set(this.row, columnIndex, value);
        return this;
    }

    get(rowIndex, columnIndex) {
        return this.matrix.get(this.row, columnIndex);
    }
}

module.exports = MatrixRowView;


/***/ }),
/* 144 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var BaseView = __webpack_require__(5);
var util = __webpack_require__(7);

class MatrixSelectionView extends BaseView {
    constructor(matrix, rowIndices, columnIndices) {
        var indices = util.checkIndices(matrix, rowIndices, columnIndices);
        super(matrix, indices.row.length, indices.column.length);
        this.rowIndices = indices.row;
        this.columnIndices = indices.column;
    }

    set(rowIndex, columnIndex, value) {
        this.matrix.set(this.rowIndices[rowIndex], this.columnIndices[columnIndex], value);
        return this;
    }

    get(rowIndex, columnIndex) {
        return this.matrix.get(this.rowIndices[rowIndex], this.columnIndices[columnIndex]);
    }
}

module.exports = MatrixSelectionView;


/***/ }),
/* 145 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var BaseView = __webpack_require__(5);
var util = __webpack_require__(7);

class MatrixSubView extends BaseView {
    constructor(matrix, startRow, endRow, startColumn, endColumn) {
        util.checkRange(matrix, startRow, endRow, startColumn, endColumn);
        super(matrix, endRow - startRow + 1, endColumn - startColumn + 1);
        this.startRow = startRow;
        this.startColumn = startColumn;
    }

    set(rowIndex, columnIndex, value) {
        this.matrix.set(this.startRow + rowIndex, this.startColumn + columnIndex, value);
        return this;
    }

    get(rowIndex, columnIndex) {
        return this.matrix.get(this.startRow + rowIndex, this.startColumn + columnIndex);
    }
}

module.exports = MatrixSubView;


/***/ }),
/* 146 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var BaseView = __webpack_require__(5);

class MatrixTransposeView extends BaseView {
    constructor(matrix) {
        super(matrix, matrix.columns, matrix.rows);
    }

    set(rowIndex, columnIndex, value) {
        this.matrix.set(columnIndex, rowIndex, value);
        return this;
    }

    get(rowIndex, columnIndex) {
        return this.matrix.get(columnIndex, rowIndex);
    }
}

module.exports = MatrixTransposeView;


/***/ }),
/* 147 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const squaredDistance = __webpack_require__(1).squared;

const defaultOptions = {
    distanceFunction: squaredDistance,
    similarityFunction: false,
    returnVector: false
};

/**
 * Find the nearest vector in a list to a sample vector
 * @param {Array<Array<number>>} listVectors - List of vectors with same dimensions
 * @param {Array<number>} vector - Reference vector to "classify"
 * @param {object} [options] - Options object
 * @param {function} [options.distanceFunction = squaredDistance] - Function that receives two vectors and return their distance value as number
 * @param {function} [options.similarityFunction = undefined] - Function that receives two vectors and return their similarity value as number
 * @param {boolean} [options.returnVector = false] - Return the nearest vector instead of its index
 * @return {number|Array<number>} - The index or the content of the nearest vector
 */
function nearestVector(listVectors, vector, options) {
    options = options || defaultOptions;
    const distanceFunction = options.distanceFunction || defaultOptions.distanceFunction;
    const similarityFunction = options.similarityFunction || defaultOptions.similarityFunction;
    const returnVector = options.returnVector || defaultOptions.returnVector;

    var vectorIndex = -1;
    if (typeof similarityFunction === 'function') {

        // maximum similarity
        var maxSim = Number.MIN_VALUE;
        for (var j = 0; j < listVectors.length; j++) {
            var sim = similarityFunction(vector, listVectors[j]);
            if (sim > maxSim) {
                maxSim = sim;
                vectorIndex = j;
            }
        }
    } else if (typeof distanceFunction === 'function') {

        // minimum distance
        var minDist = Number.MAX_VALUE;
        for (var i = 0; i < listVectors.length; i++) {
            var dist = distanceFunction(vector, listVectors[i]);
            if (dist < minDist) {
                minDist = dist;
                vectorIndex = i;
            }
        }
    } else {
        throw new Error('A similarity or distance function it\'s required');
    }

    if (returnVector) {
        return listVectors[vectorIndex];
    } else {
        return vectorIndex;
    }
}

module.exports = nearestVector;


/***/ }),
/* 148 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Accuracy
exports.acc = pred => {
    const l = pred.cutoffs.length;
    const result = new Array(l);
    for (var i = 0; i < l; i++) {
        result[i] = (pred.tn[i] + pred.tp[i]) / (l - 1);
    }
    return result;
};

// Error rate
exports.err = pred => {
    const l = pred.cutoffs.length;
    const result = new Array(l);
    for (var i = 0; i < l; i++) {
        result[i] = (pred.fn[i] + pred.fp[i] / (l - 1));
    }
    return result;
};

// False positive rate
exports.fpr = pred => {
    const l = pred.cutoffs.length;
    const result = new Array(l);
    for (var i = 0; i < l; i++) {
        result[i] = pred.fp[i] / pred.nNeg;
    }
    return result;
};

// True positive rate
exports.tpr = pred => {
    const l = pred.cutoffs.length;
    const result = new Array(l);
    for (var i = 0; i < l; i++) {
        result[i] = pred.tp[i] / pred.nPos;
    }
    return result;
};

// False negative rate
exports.fnr = pred => {
    const l = pred.cutoffs.length;
    const result = new Array(l);
    for (var i = 0; i < l; i++) {
        result[i] = pred.fn[i] / pred.nPos;
    }
    return result;
};

// True negative rate
exports.tnr = pred => {
    const l = pred.cutoffs.length;
    const result = new Array(l);
    for (var i = 0; i < l; i++) {
        result[i] = pred.tn[i] / pred.nNeg;
    }
    return result;
};

// Positive predictive value
exports.ppv = pred => {
    const l = pred.cutoffs.length;
    const result = new Array(l);
    for (var i = 0; i < l; i++) {
        result[i] = (pred.fp[i] + pred.tp[i] !== 0) ? (pred.tp[i] / (pred.fp[i] + pred.tp[i])) : 0;
    }
    return result;
};

// Negative predictive value
exports.npv = pred => {
    const l = pred.cutoffs.length;
    const result = new Array(l);
    for (var i = 0; i < l; i++) {
        result[i] = (pred.fn[i] + pred.tn[i] !== 0) ? (pred.tn[i] / (pred.fn[i] + pred.tn[i])) : 0;
    }
    return result;
};

// Prediction conditioned fallout
exports.pcfall = pred => {
    const l = pred.cutoffs.length;
    const result = new Array(l);
    for (var i = 0; i < l; i++) {
        result[i] = (pred.fp[i] + pred.tp[i] !== 0) ? 1 - (pred.tp[i] / (pred.fp[i] + pred.tp[i])) : 1;
    }
    return result;
};

// Prediction conditioned miss
exports.pcmiss = pred => {
    const l = pred.cutoffs.length;
    const result = new Array(l);
    for (var i = 0; i < l; i++) {
        result[i] = (pred.fn[i] + pred.tn[i] !== 0) ? 1 - (pred.tn[i] / (pred.fn[i] + pred.tn[i])) : 1;
    }
    return result;
};

// Lift value
exports.lift = pred => {
    const l = pred.cutoffs.length;
    const result = new Array(l);
    for (var i = 0; i < l; i++) {
        result[i] = (pred.nPosPred[i] !== 0) ? ((pred.tp[i] / pred.nPos) / (pred.nPosPred[i] / pred.nSamples)) : 0;
    }
    return result;
};

// Rate of positive predictions
exports.rpp = pred => {
    const l = pred.cutoffs.length;
    const result = new Array(l);
    for (var i = 0; i < l; i++) {
        result[i] = pred.nPosPred[i] / pred.nSamples;
    }
    return result;
};

// Rate of negative predictions
exports.rnp = pred => {
    const l = pred.cutoffs.length;
    const result = new Array(l);
    for (var i = 0; i < l; i++) {
        result[i] = pred.nNegPred[i] / pred.nSamples;
    }
    return result;
};

// Threshold
exports.threshold = pred => {
    const clone = pred.cutoffs.slice();
    clone[0] = clone[1]; // Remove the infinite value
    return clone;
};


/***/ }),
/* 149 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Matrix = __webpack_require__(0);
var Utils = __webpack_require__(12);

module.exports = OPLS;

function OPLS(dataset, predictions, numberOSC) {
    var X = new Matrix(dataset);
    var y = new Matrix(predictions);

    X = Utils.featureNormalize(X).result;
    y = Utils.featureNormalize(y).result;

    var rows = X.rows;
    var columns = X.columns;

    var sumOfSquaresX = X.clone().mul(X).sum();
    var w = X.transpose().mmul(y);
    w.div(Utils.norm(w));

    var orthoW = new Array(numberOSC);
    var orthoT = new Array(numberOSC);
    var orthoP = new Array(numberOSC);
    for (var i = 0; i < numberOSC; i++) {
        var t = X.mmul(w);

        var numerator = X.transpose().mmul(t);
        var denominator = t.transpose().mmul(t)[0][0];
        var p =  numerator.div(denominator);

        numerator = w.transpose().mmul(p)[0][0];
        denominator = w.transpose().mmul(w)[0][0];
        var wOsc = p.sub(w.clone().mul(numerator / denominator));
        wOsc.div(Utils.norm(wOsc));

        var tOsc = X.mmul(wOsc);

        numerator = X.transpose().mmul(tOsc);
        denominator = tOsc.transpose().mmul(tOsc)[0][0];
        var pOsc = numerator.div(denominator);

        X.sub(tOsc.mmul(pOsc.transpose()));
        orthoW[i] = wOsc.getColumn(0);
        orthoT[i] = tOsc.getColumn(0);
        orthoP[i] = pOsc.getColumn(0);
    }

    this.Xosc = X;

    var sumOfSquaresXosx = this.Xosc.clone().mul(this.Xosc).sum();
    this.R2X = 1 - sumOfSquaresXosx/sumOfSquaresX;

    this.W = orthoW;
    this.T = orthoT;
    this.P = orthoP;
    this.numberOSC = numberOSC;
}

OPLS.prototype.correctDataset = function (dataset) {
    var X = new Matrix(dataset);

    var sumOfSquaresX = X.clone().mul(X).sum();
    for (var i = 0; i < this.numberOSC; i++) {
        var currentW = this.W.getColumnVector(i);
        var currentP = this.P.getColumnVector(i);

        var t = X.mmul(currentW);
        X.sub(t.mmul(currentP));
    }
    var sumOfSquaresXosx = X.clone().mul(X).sum();

    var R2X = 1 - sumOfSquaresXosx / sumOfSquaresX;

    return {
        datasetOsc: X,
        R2Dataset: R2X
    };
};

/***/ }),
/* 150 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Matrix = __webpack_require__(0);
var Utils = __webpack_require__(12);

class PLS {
    constructor(X, Y) {
        if (X === true) {
            const model = Y;
            this.meanX = model.meanX;
            this.stdDevX = model.stdDevX;
            this.meanY = model.meanY;
            this.stdDevY = model.stdDevY;
            this.PBQ = Matrix.checkMatrix(model.PBQ);
            this.R2X = model.R2X;
        } else {
            if (X.length !== Y.length)
                throw new RangeError('The number of X rows must be equal to the number of Y rows');

            const resultX = Utils.featureNormalize(X);
            this.X = resultX.result;
            this.meanX = resultX.means;
            this.stdDevX = resultX.std;

            const resultY = Utils.featureNormalize(Y);
            this.Y = resultY.result;
            this.meanY = resultY.means;
            this.stdDevY = resultY.std;
        }
    }

    /**
     * Fits the model with the given data and predictions, in this function is calculated the
     * following outputs:
     *
     * T - Score matrix of X
     * P - Loading matrix of X
     * U - Score matrix of Y
     * Q - Loading matrix of Y
     * B - Matrix of regression coefficient
     * W - Weight matrix of X
     *
     * @param {Object} options - recieves the latentVectors and the tolerance of each step of the PLS
     */
    train(options) {
        if(options === undefined) options = {};

        var latentVectors = options.latentVectors;
        if (latentVectors === undefined) {
            latentVectors = Math.min(this.X.length - 1, this.X[0].length);
        }

        var tolerance = options.tolerance;
        if (tolerance === undefined) {
            tolerance = 1e-5;
        }
        
        var X = this.X;
        var Y = this.Y;

        var rx = X.rows;
        var cx = X.columns;
        var ry = Y.rows;
        var cy = Y.columns;

        var ssqXcal = X.clone().mul(X).sum(); // for the r²
        var sumOfSquaresY = Y.clone().mul(Y).sum();

        var n = latentVectors; //Math.max(cx, cy); // components of the pls
        var T = Matrix.zeros(rx, n);
        var P = Matrix.zeros(cx, n);
        var U = Matrix.zeros(ry, n);
        var Q = Matrix.zeros(cy, n);
        var B = Matrix.zeros(n, n);
        var W = P.clone();
        var k = 0;

        while(Utils.norm(Y) > tolerance && k < n) {
            var transposeX = X.transpose();
            var transposeY = Y.transpose();

            var tIndex = maxSumColIndex(X.clone().mulM(X));
            var uIndex = maxSumColIndex(Y.clone().mulM(Y));

            var t1 = X.getColumnVector(tIndex);
            var u = Y.getColumnVector(uIndex);
            var t = Matrix.zeros(rx, 1);

            while(Utils.norm(t1.clone().sub(t)) > tolerance) {
                var w = transposeX.mmul(u);
                w.div(Utils.norm(w));
                t = t1;
                t1 = X.mmul(w);
                var q = transposeY.mmul(t1);
                q.div(Utils.norm(q));
                u = Y.mmul(q);
            }

            t = t1;
            var num = transposeX.mmul(t);
            var den = (t.transpose().mmul(t))[0][0];
            var p = num.div(den);
            var pnorm = Utils.norm(p);
            p.div(pnorm);
            t.mul(pnorm);
            w.mul(pnorm);

            num = u.transpose().mmul(t);
            den = (t.transpose().mmul(t))[0][0];
            var b = (num.div(den))[0][0];
            X.sub(t.mmul(p.transpose()));
            Y.sub(t.clone().mul(b).mmul(q.transpose()));

            T.setColumn(k, t);
            P.setColumn(k, p);
            U.setColumn(k, u);
            Q.setColumn(k, q);
            W.setColumn(k, w);

            B[k][k] = b;
            k++;
        }

        k--;
        T = T.subMatrix(0, T.rows - 1, 0, k);
        P = P.subMatrix(0, P.rows - 1, 0, k);
        U = U.subMatrix(0, U.rows - 1, 0, k);
        Q = Q.subMatrix(0, Q.rows - 1, 0, k);
        W = W.subMatrix(0, W.rows - 1, 0, k);
        B = B.subMatrix(0, k, 0, k);

        // TODO: review of R2Y
        //this.R2Y = t.transpose().mmul(t).mul(q[k][0]*q[k][0]).divS(ssqYcal)[0][0];

        this.ssqYcal = sumOfSquaresY;
        this.E = X;
        this.F = Y;
        this.T = T;
        this.P = P;
        this.U = U;
        this.Q = Q;
        this.W = W;
        this.B = B;
        this.PBQ = P.mmul(B).mmul(Q.transpose());
        this.R2X = t.transpose().mmul(t).mmul(p.transpose().mmul(p)).div(ssqXcal)[0][0];
    }

    /**
     * Predicts the behavior of the given dataset.
     * @param dataset - data to be predicted.
     * @returns {Matrix} - predictions of each element of the dataset.
     */
    predict(dataset) {
        var X = Matrix.checkMatrix(dataset);
        X = X.subRowVector(this.meanX).divRowVector(this.stdDevX);
        var Y = X.mmul(this.PBQ);
        Y = Y.mulRowVector(this.stdDevY).addRowVector(this.meanY);
        return Y;
    }

    /**
     * Returns the explained variance on training of the PLS model
     * @return {number}
     */
    getExplainedVariance() {
        return this.R2X;
    }
    
    toJSON() {
        return {
            name: 'PLS',
            R2X: this.R2X,
            meanX: this.meanX,
            stdDevX: this.stdDevX,
            meanY: this.meanY,
            stdDevY: this.stdDevY,
            PBQ: this.PBQ,
        };
    }

    /**
     * Load a PLS model from a JSON Object
     * @param model
     * @return {PLS} - PLS object from the given model
     */
    static load(model) {
        if (model.name !== 'PLS')
            throw new RangeError('Invalid model: ' + model.name);
        return new PLS(true, model);
    }
}

module.exports = PLS;

/**
 * Retrieves the sum at the column of the given matrix.
 * @param matrix
 * @param column
 * @returns {number}
 */
function getColSum(matrix, column) {
    var sum = 0;
    for (var i = 0; i < matrix.rows; i++) {
        sum += matrix[i][column];
    }
    return sum;
}

/**
 * Function that returns the index where the sum of each
 * column vector is maximum.
 * @param {Matrix} data
 * @returns {number} index of the maximum
 */
function maxSumColIndex(data) {
    var maxIndex = 0;
    var maxSum = -Infinity;
    for(var i = 0; i < data.columns; ++i) {
        var currentSum = getColSum(data, i);
        if(currentSum > maxSum) {
            maxSum = currentSum;
            maxIndex = i;
        }
    }
    return maxIndex;
}


/***/ }),
/* 151 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
 * Function that calculate the linear fit in the form f(x) = Ce^(A * x) and
 * return the A and C coefficient of the given formula.
 *
 * @param {Vector} X - Vector of the x positions of the points.
 * @param {Vector} Y - Vector of the y positions of the points.
 * @return {Object} coefficients - The A and C coefficients.
 *
 * Created by acastillo on 5/12/16.
 */

const maybeToPrecision = __webpack_require__(6).maybeToPrecision;
const SimpleLinearRegression = __webpack_require__(13);
const BaseRegression = __webpack_require__(4);

class ExpRegression extends BaseRegression {
    /**
     * @constructor
     * @param {Array<number>} x - Independent variable
     * @param {Array<number>} y - Dependent variable
     * @param {object} options
     */
    constructor(x, y, options) {
        super();
        let opt = options || {};
        if (x === true) { // reloading model
            this.A = y.A;
            this.C = y.C;
            if (y.quality) {
                this.quality = y.quality;
            }
        } else {
            var n = x.length;
            if (n !== y.length) {
                throw new RangeError('input and output array have a different length');
            }
            var yl = new Array(n);
            for (var i = 0; i < n; i++) {
                yl[i] = Math.log(y[i]);
            }

            var linear = new SimpleLinearRegression(x, yl, {computeCoefficient: false});
            this.A = linear.slope;
            this.C = Math.exp(linear.intercept);
            if (opt.computeQuality) {
                this.quality = this.modelQuality(x, y);
            }
        }
    }

    _predict(newInputs) {
        return this.C * Math.exp(newInputs * this.A);
    }

    toJSON() {
        var out = {name: 'expRegression', A: this.A, C: this.C};
        if (this.quality) {
            out.quality = this.quality;
        }
        return out;
    }

    toString(precision) {
        return 'f(x) = ' + maybeToPrecision(this.C, precision) + ' * exp(' + maybeToPrecision(this.A, precision) + ' * x)';
    }

    toLaTeX(precision) {
        if (this.A >= 0) {
            return 'f(x) = ' + maybeToPrecision(this.C, precision) + 'e^{' + maybeToPrecision(this.A, precision) + 'x}';
        } else {
            return 'f(x) = \\frac{' + maybeToPrecision(this.C, precision) + '}{e^{' + maybeToPrecision(-this.A, precision) + 'x}}';
        }

    }

    static load(json) {
        if (json.name !== 'expRegression') {
            throw new TypeError('not a exp regression model');
        }
        return new ExpRegression(true, json);
    }
}


module.exports = ExpRegression;


/***/ }),
/* 152 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const Matrix = __webpack_require__(0);
const Kernel = __webpack_require__(8);

const BaseRegression = __webpack_require__(4);

const defaultOptions = {
    lambda: 0.1,
    kernelType: 'gaussian',
    kernelOptions: {},
    computeCoefficient: false
};

// Implements the Kernel ridge regression algorithm.
// http://www.ics.uci.edu/~welling/classnotes/papers_class/Kernel-Ridge.pdf
class KernelRidgeRegression extends BaseRegression {
    constructor(inputs, outputs, options) {
        super();
        if (inputs === true) { // reloading model
            this.alpha = outputs.alpha;
            this.inputs = outputs.inputs;
            this.kernelType = outputs.kernelType;
            this.kernelOptions = outputs.kernelOptions;
            this.kernel = new Kernel(outputs.kernelType, outputs.kernelOptions);

            if (outputs.quality) {
                this.quality = outputs.quality;
            }
        } else {
            options = Object.assign({}, defaultOptions, options);

            const kernelFunction = new Kernel(options.kernelType, options.kernelOptions);
            const K = kernelFunction.compute(inputs);
            const n = inputs.length;
            K.add(Matrix.eye(n, n).mul(options.lambda));

            this.alpha = K.solve(outputs);
            this.inputs = inputs;
            this.kernelType = options.kernelType;
            this.kernelOptions = options.kernelOptions;
            this.kernel = kernelFunction;

            if (options.computeQuality) {
                this.quality = this.modelQuality(inputs, outputs);
            }
        }
    }

    _predict(newInputs) {
        return this.kernel.compute([newInputs], this.inputs).mmul(this.alpha)[0];
    }

    toJSON() {
        var out = {
            name: 'kernelRidgeRegression',
            alpha: this.alpha,
            inputs: this.inputs,
            kernelType: this.kernelType,
            kernelOptions: this.kernelOptions
        };
        if (this.quality) {
            out.quality = this.quality;
        }
        return out;
    }

    static load(json) {
        if (json.name !== 'kernelRidgeRegression') {
            throw new TypeError('not a KRR model');
        }
        return new KernelRidgeRegression(true, json);
    }
}

module.exports = KernelRidgeRegression;


/***/ }),
/* 153 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const Matrix = __webpack_require__(0);
const SVD = Matrix.DC.SingularValueDecomposition;
const BaseRegression = __webpack_require__(4);

const defaultOptions = {
    order: 2
};
// Implements the Kernel ridge regression algorithm.
// http://www.ics.uci.edu/~welling/classnotes/papers_class/Kernel-Ridge.pdf
class PolynomialFitRegression2D extends BaseRegression {
    /**
     * Constructor for the 2D polynomial fitting
     *
     * @param inputs
     * @param outputs
     * @param options
     * @constructor
     */
    constructor(inputs, outputs, options) {
        super();
        if (inputs === true) { // reloading model
            this.coefficients = Matrix.columnVector(outputs.coefficients);
            this.order = outputs.order;
            if (outputs.r) {
                this.r = outputs.r;
                this.r2 = outputs.r2;
            }
            if (outputs.chi2) {
                this.chi2 = outputs.chi2;
            }
        } else {
            options = Object.assign({}, defaultOptions, options);
            this.order = options.order;
            this.coefficients = [];
            this.X = inputs;
            this.y = outputs;

            this.train(this.X, this.y, options);

            if (options.computeQuality) {
                this.quality = this.modelQuality(inputs, outputs);
            }
        }
    }

    /**
     * Function that fits the model given the data(X) and predictions(y).
     * The third argument is an object with the following options:
     * * order: order of the polynomial to fit.
     *
     * @param {Matrix} X - A matrix with n rows and 2 columns.
     * @param {Matrix} y - A vector of the prediction values.
     */
    train(X, y) {
        if (!Matrix.isMatrix(X)) X = new Matrix(X);
        if (!Matrix.isMatrix(y)) y = Matrix.columnVector(y);

        //Perhaps y is transpose
        if (y.rows !== X.rows) {
            y = y.transpose();
        }

        if (X.columns !== 2) {
            throw new RangeError('You give X with ' + X.columns + ' columns and it must be 2');
        }
        if (X.rows !== y.rows) {
            throw new RangeError('X and y must have the same rows');
        }

        var examples = X.rows;
        var coefficients = ((this.order + 2) * (this.order + 1)) / 2;
        this.coefficients = new Array(coefficients);

        var x1 = X.getColumnVector(0);
        var x2 = X.getColumnVector(1);

        var scaleX1 = 1.0 / x1.clone().apply(abs).max();
        var scaleX2 = 1.0 / x2.clone().apply(abs).max();
        var scaleY = 1.0 / y.clone().apply(abs).max();

        x1.mulColumn(0, scaleX1);
        x2.mulColumn(0, scaleX2);
        y.mulColumn(0, scaleY);

        var A = new Matrix(examples, coefficients);
        var col = 0;

        for (var i = 0; i <= this.order; ++i) {
            var limit = this.order - i;
            for (var j = 0; j <= limit; ++j) {
                var result = powColVector(x1, i).mulColumnVector(powColVector(x2, j));
                A.setColumn(col, result);
                col++;
            }
        }

        var svd = new SVD(A.transpose(), {
            computeLeftSingularVectors: true,
            computeRightSingularVectors: true,
            autoTranspose: false
        });

        var qqs = Matrix.rowVector(svd.diagonal);
        qqs = qqs.apply(function (i, j) {
            if (this[i][j] >= 1e-15) this[i][j] = 1 / this[i][j];
            else this[i][j] = 0;
        });

        var qqs1 = Matrix.zeros(examples, coefficients);
        for (i = 0; i < coefficients; ++i) {
            qqs1[i][i] = qqs[0][i];
        }

        qqs = qqs1;

        var U = svd.rightSingularVectors;
        var V = svd.leftSingularVectors;

        this.coefficients = V.mmul(qqs.transpose()).mmul(U.transpose()).mmul(y);

        col = 0;

        for (i = 0; i <= coefficients; ++i) {
            limit = this.order - i;
            for (j = 0; j <= limit; ++j) {
                this.coefficients[col][0] = (this.coefficients[col][0] * Math.pow(scaleX1, i) * Math.pow(scaleX2, j)) / scaleY;
                col++;
            }
        }
    }

    _predict(newInputs) {
        var x1 = newInputs[0];
        var x2 = newInputs[1];

        var y = 0;
        var column = 0;

        for (var i = 0; i <= this.order; i++) {
            for (var j = 0; j <= this.order - i; j++) {
                y += Math.pow(x1, i) * (Math.pow(x2, j)) * this.coefficients[column][0];
                column++;
            }
        }

        return y;
    }

    toJSON() {
        var out = {
            name: 'polyfit2D',
            order: this.order,
            coefficients: this.coefficients
        };
        if (this.quality) {
            out.quality = this.quality;
        }
        return out;
    }

    static load(json) {
        if (json.name !== 'polyfit2D') {
            throw new TypeError('not a polyfit2D model');
        }
        return new PolynomialFitRegression2D(true, json);
    }

}

module.exports = PolynomialFitRegression2D;


/**
 * Function that given a column vector return this: vector^power
 *
 * @param x - Column vector.
 * @param power - Pow number.
 * @return {Suite|Matrix}
 */
function powColVector(x, power) {
    var result = x.clone();
    for (var i = 0; i < x.rows; ++i) {
        result[i][0] = Math.pow(result[i][0], power);
    }
    return result;
}

/**
 * Function to use in the apply method to get the absolute value
 * of each element of the matrix
 *
 * @param i - current row.
 * @param j - current column.
 */
function abs(i, j) {
    this[i][j] = Math.abs(this[i][j]);
}


/***/ }),
/* 154 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
 * Function that calculate the potential fit in the form f(x) = A*x^M
 * with a given M and return de A coefficient.
 *
 * @param {Vector} X - Vector of the x positions of the points.
 * @param {Vector} Y - Vector of the x positions of the points.
 * @param {Number, BigNumber} M - The exponent of the potential fit.
 * @return {Number|BigNumber} A - The A coefficient of the potential fit.
 * Created by acastillo on 5/12/16.
 */

const maybeToPrecision = __webpack_require__(6).maybeToPrecision;
const PolynomialRegression = __webpack_require__(40);
// const PowerRegression = require('./power-regression');
const BaseRegression = __webpack_require__(4);

class PotentialRegression extends BaseRegression {
    /**
     * @constructor
     * @param x: Independent variable
     * @param y: Dependent variable
     * @param M
     * @param options
     */
    constructor(x, y, M, options) {
        super();
        let opt = options || {};
        if (x === true) { // reloading model
            this.A = y.A;
            this.M = y.M;
            if (y.quality) {
                this.quality = y.quality;
            }
        } else {
            var n = x.length;
            if (n !== y.length) {
                throw new RangeError('input and output array have a different length');
            }

            var linear = new PolynomialRegression(x, y, [M], {computeCoefficient: true});
            this.A = linear.coefficients[0];
            this.M = M;
            if (opt.computeQuality) {
                this.quality = this.modelQuality(x, y);
            }
        }
    }

    _predict(x) {
        return this.A * Math.pow(x, this.M);
    }

    toJSON() {
        var out = {name: 'potentialRegression', A: this.A, M: this.M};
        if (this.quality) {
            out.quality = this.quality;
        }
        return out;
    }

    toString(precision) {
        return 'f(x) = ' + maybeToPrecision(this.A, precision) + ' * x^' + this.M;
    }

    toLaTeX(precision) {

        if (this.M >= 0) {
            return 'f(x) = ' + maybeToPrecision(this.A, precision) + 'x^{' + this.M + '}';
        } else {
            return 'f(x) = \\frac{' + maybeToPrecision(this.A, precision) + '}{x^{' + (-this.M) + '}}';
        }
    }

    static load(json) {
        if (json.name !== 'potentialRegression') {
            throw new TypeError('not a potential regression model');
        }
        return new PotentialRegression(true, json);
    }
}

module.exports = PotentialRegression;


/***/ }),
/* 155 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * This class implements the power regression f(x)=A*x^B
 * Created by acastillo on 5/12/16.
 */

const maybeToPrecision = __webpack_require__(6).maybeToPrecision;
const SimpleLinearRegression = __webpack_require__(13);
const BaseRegression = __webpack_require__(4);

class PowerRegression extends BaseRegression {
    /**
     * @constructor
     * @param x: Independent variable
     * @param y: Dependent variable
     * @param options
     */
    constructor(x, y, options) {
        super();
        let opt = options || {};
        if (x === true) { // reloading model
            this.A = y.A;
            this.B = y.B;
            this.quality = y.quality || {};
            if (y.quality.r) {
                this.quality.r = y.quality.r;
                this.quality.r2 = y.quality.r2;
            }
            if (y.quality.chi2) {
                this.quality.chi2 = y.quality.chi2;
            }
        } else {
            var n = x.length;
            if (n !== y.length) {
                throw new RangeError('input and output array have a different length');
            }
            var xl = new Array(n), yl = new Array(n);
            for (var i = 0; i < n; i++) {
                xl[i] = Math.log(x[i]);
                yl[i] = Math.log(y[i]);
            }

            var linear = new SimpleLinearRegression(xl, yl, {computeCoefficient: false});
            this.A = Math.exp(linear.intercept);
            this.B = linear.slope;
            if (opt.computeQuality) {
                this.quality = this.modelQuality(x, y);
            }
        }
    }

    _predict(newInputs) {
        return this.A * Math.pow(newInputs, this.B);
    }

    toJSON() {
        var out = {name: 'powerRegression', A: this.A, B: this.B};
        if (this.quality) {
            out.quality = this.quality;
        }
        return out;
    }

    toString(precision) {
        return 'f(x) = ' + maybeToPrecision(this.A, precision) + ' * x^' + maybeToPrecision(this.B, precision);
    }

    toLaTeX(precision) {
        if (this.B >= 0) {
            return 'f(x) = ' + maybeToPrecision(this.A, precision) + 'x^{' + maybeToPrecision(this.B, precision) + '}';
        } else {
            return 'f(x) = \\frac{' + maybeToPrecision(this.A, precision) + '}{x^{' + maybeToPrecision(-this.B, precision) + '}}';
        }
    }

    static load(json) {
        if (json.name !== 'powerRegression') {
            throw new TypeError('not a power regression model');
        }
        return new PowerRegression(true, json);
    }
}

module.exports = PowerRegression;


/***/ }),
/* 156 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const BaseRegression = __webpack_require__(4);
const maybeToPrecision = __webpack_require__(6).maybeToPrecision;
const median = __webpack_require__(14).median;

class TheilSenRegression extends BaseRegression {

    /**
     * Theil–Sen estimator
     * https://en.wikipedia.org/wiki/Theil%E2%80%93Sen_estimator
     * @param {Array<number>} x
     * @param {Array<number>} y
     * @param {object} options
     * @constructor
     */
    constructor(x, y, options) {
        options = options || {};
        super();
        if (x === true) {
            // loads the model
            this.slope = y.slope;
            this.intercept = y.intercept;
            this.quality = Object.assign({}, y.quality, this.quality);
        } else {
            // creates the model
            let len = x.length;
            if (len !== y.length) {
                throw new RangeError('Input and output array have a different length');
            }

            let slopes = new Array(len * len);
            let count = 0;
            for (let i = 0; i < len; ++i) {
                for (let j =  i + 1; j < len; ++j) {
                    if (x[i] !== x[j]) {
                        slopes[count++] = (y[j] - y[i]) / (x[j] - x[i]);
                    }
                }
            }
            slopes.length = count;
            let medianSlope = median(slopes);

            let cuts = new Array(len);
            for (let i = 0; i < len; ++i) {
                cuts[i] = y[i] - medianSlope * x[i];
            }

            this.slope = medianSlope;
            this.intercept = median(cuts);
            this.coefficients = [this.intercept, this.slope];
            if (options.computeQuality) {
                this.quality = this.modelQuality(x, y);
            }
        }

    }

    toJSON() {
        var out = {
            name: 'TheilSenRegression',
            slope: this.slope,
            intercept: this.intercept
        };
        if (this.quality) {
            out.quality = this.quality;
        }

        return out;
    }

    _predict(input) {
        return this.slope * input + this.intercept;
    }

    computeX(input) {
        return (input - this.intercept) / this.slope;
    }

    toString(precision) {
        var result = 'f(x) = ';
        if (this.slope) {
            var xFactor = maybeToPrecision(this.slope, precision);
            result += (Math.abs(xFactor - 1) < 1e-5 ? '' : xFactor + ' * ') + 'x';
            if (this.intercept) {
                var absIntercept = Math.abs(this.intercept);
                var operator = absIntercept === this.intercept ? '+' : '-';
                result += ' ' + operator + ' ' + maybeToPrecision(absIntercept, precision);
            }
        } else {
            result += maybeToPrecision(this.intercept, precision);
        }
        return result;
    }

    toLaTeX(precision) {
        return this.toString(precision);
    }

    static load(json) {
        if (json.name !== 'TheilSenRegression') {
            throw new TypeError('not a Theil-Sen model');
        }
        return new TheilSenRegression(true, json);
    }
}

module.exports = TheilSenRegression;


/***/ }),
/* 157 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.array = __webpack_require__(41);
exports.matrix = __webpack_require__(158);


/***/ }),
/* 158 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var arrayStat = __webpack_require__(41);

// https://github.com/accord-net/framework/blob/development/Sources/Accord.Statistics/Tools.cs

function entropy(matrix, eps) {
    if (typeof(eps) === 'undefined') {
        eps = 0;
    }
    var sum = 0,
        l1 = matrix.length,
        l2 = matrix[0].length;
    for (var i = 0; i < l1; i++) {
        for (var j = 0; j < l2; j++) {
            sum += matrix[i][j] * Math.log(matrix[i][j] + eps);
        }
    }
    return -sum;
}

function mean(matrix, dimension) {
    if (typeof(dimension) === 'undefined') {
        dimension = 0;
    }
    var rows = matrix.length,
        cols = matrix[0].length,
        theMean, N, i, j;

    if (dimension === -1) {
        theMean = [0];
        N = rows * cols;
        for (i = 0; i < rows; i++) {
            for (j = 0; j < cols; j++) {
                theMean[0] += matrix[i][j];
            }
        }
        theMean[0] /= N;
    } else if (dimension === 0) {
        theMean = new Array(cols);
        N = rows;
        for (j = 0; j < cols; j++) {
            theMean[j] = 0;
            for (i = 0; i < rows; i++) {
                theMean[j] += matrix[i][j];
            }
            theMean[j] /= N;
        }
    } else if (dimension === 1) {
        theMean = new Array(rows);
        N = cols;
        for (j = 0; j < rows; j++) {
            theMean[j] = 0;
            for (i = 0; i < cols; i++) {
                theMean[j] += matrix[j][i];
            }
            theMean[j] /= N;
        }
    } else {
        throw new Error('Invalid dimension');
    }
    return theMean;
}

function standardDeviation(matrix, means, unbiased) {
    var vari = variance(matrix, means, unbiased), l = vari.length;
    for (var i = 0; i < l; i++) {
        vari[i] = Math.sqrt(vari[i]);
    }
    return vari;
}

function variance(matrix, means, unbiased) {
    if (typeof(unbiased) === 'undefined') {
        unbiased = true;
    }
    means = means || mean(matrix);
    var rows = matrix.length;
    if (rows === 0) return [];
    var cols = matrix[0].length;
    var vari = new Array(cols);

    for (var j = 0; j < cols; j++) {
        var sum1 = 0, sum2 = 0, x = 0;
        for (var i = 0; i < rows; i++) {
            x = matrix[i][j] - means[j];
            sum1 += x;
            sum2 += x * x;
        }
        if (unbiased) {
            vari[j] = (sum2 - ((sum1 * sum1) / rows)) / (rows - 1);
        } else {
            vari[j] = (sum2 - ((sum1 * sum1) / rows)) / rows;
        }
    }
    return vari;
}

function median(matrix) {
    var rows = matrix.length, cols = matrix[0].length;
    var medians = new Array(cols);

    for (var i = 0; i < cols; i++) {
        var data = new Array(rows);
        for (var j = 0; j < rows; j++) {
            data[j] = matrix[j][i];
        }
        data.sort();
        var N = data.length;
        if (N % 2 === 0) {
            medians[i] = (data[N / 2] + data[(N / 2) - 1]) * 0.5;
        } else {
            medians[i] = data[Math.floor(N / 2)];
        }
    }
    return medians;
}

function mode(matrix) {
    var rows = matrix.length,
        cols = matrix[0].length,
        modes = new Array(cols),
        i, j;
    for (i = 0; i < cols; i++) {
        var itemCount = new Array(rows);
        for (var k = 0; k < rows; k++) {
            itemCount[k] = 0;
        }
        var itemArray = new Array(rows);
        var count = 0;

        for (j = 0; j < rows; j++) {
            var index = itemArray.indexOf(matrix[j][i]);
            if (index >= 0) {
                itemCount[index]++;
            } else {
                itemArray[count] = matrix[j][i];
                itemCount[count] = 1;
                count++;
            }
        }

        var maxValue = 0, maxIndex = 0;
        for (j = 0; j < count; j++) {
            if (itemCount[j] > maxValue) {
                maxValue = itemCount[j];
                maxIndex = j;
            }
        }

        modes[i] = itemArray[maxIndex];
    }
    return modes;
}

function skewness(matrix, unbiased) {
    if (typeof(unbiased) === 'undefined') unbiased = true;
    var means = mean(matrix);
    var n = matrix.length, l = means.length;
    var skew = new Array(l);

    for (var j = 0; j < l; j++) {
        var s2 = 0, s3 = 0;
        for (var i = 0; i < n; i++) {
            var dev = matrix[i][j] - means[j];
            s2 += dev * dev;
            s3 += dev * dev * dev;
        }

        var m2 = s2 / n;
        var m3 = s3 / n;
        var g = m3 / Math.pow(m2, 3 / 2);

        if (unbiased) {
            var a = Math.sqrt(n * (n - 1));
            var b = n - 2;
            skew[j] = (a / b) * g;
        } else {
            skew[j] = g;
        }
    }
    return skew;
}

function kurtosis(matrix, unbiased) {
    if (typeof(unbiased) === 'undefined') unbiased = true;
    var means = mean(matrix);
    var n = matrix.length, m = matrix[0].length;
    var kurt = new Array(m);

    for (var j = 0; j < m; j++) {
        var s2 = 0, s4 = 0;
        for (var i = 0; i < n; i++) {
            var dev = matrix[i][j] - means[j];
            s2 += dev * dev;
            s4 += dev * dev * dev * dev;
        }
        var m2 = s2 / n;
        var m4 = s4 / n;

        if (unbiased) {
            var v = s2 / (n - 1);
            var a = (n * (n + 1)) / ((n - 1) * (n - 2) * (n - 3));
            var b = s4 / (v * v);
            var c = ((n - 1) * (n - 1)) / ((n - 2) * (n - 3));
            kurt[j] = a * b - 3 * c;
        } else {
            kurt[j] = m4 / (m2 * m2) - 3;
        }
    }
    return kurt;
}

function standardError(matrix) {
    var samples = matrix.length;
    var standardDeviations = standardDeviation(matrix), l = standardDeviations.length;
    var standardErrors = new Array(l);
    var sqrtN = Math.sqrt(samples);

    for (var i = 0; i < l; i++) {
        standardErrors[i] = standardDeviations[i] / sqrtN;
    }
    return standardErrors;
}

function covariance(matrix, dimension) {
    return scatter(matrix, undefined, dimension);
}

function scatter(matrix, divisor, dimension) {
    if (typeof(dimension) === 'undefined') {
        dimension = 0;
    }
    if (typeof(divisor) === 'undefined') {
        if (dimension === 0) {
            divisor = matrix.length - 1;
        } else if (dimension === 1) {
            divisor = matrix[0].length - 1;
        }
    }
    var means = mean(matrix, dimension),
        rows = matrix.length;
    if (rows === 0) {
        return [[]];
    }
    var cols = matrix[0].length,
        cov, i, j, s, k;

    if (dimension === 0) {
        cov = new Array(cols);
        for (i = 0; i < cols; i++) {
            cov[i] = new Array(cols);
        }
        for (i = 0; i < cols; i++) {
            for (j = i; j < cols; j++) {
                s = 0;
                for (k = 0; k < rows; k++) {
                    s += (matrix[k][j] - means[j]) * (matrix[k][i] - means[i]);
                }
                s /= divisor;
                cov[i][j] = s;
                cov[j][i] = s;
            }
        }
    } else if (dimension === 1) {
        cov = new Array(rows);
        for (i = 0; i < rows; i++) {
            cov[i] = new Array(rows);
        }
        for (i = 0; i < rows; i++) {
            for (j = i; j < rows; j++) {
                s = 0;
                for (k = 0; k < cols; k++) {
                    s += (matrix[j][k] - means[j]) * (matrix[i][k] - means[i]);
                }
                s /= divisor;
                cov[i][j] = s;
                cov[j][i] = s;
            }
        }
    } else {
        throw new Error('Invalid dimension');
    }

    return cov;
}

function correlation(matrix) {
    var means = mean(matrix),
        standardDeviations = standardDeviation(matrix, true, means),
        scores = zScores(matrix, means, standardDeviations),
        rows = matrix.length,
        cols = matrix[0].length,
        i, j;

    var cor = new Array(cols);
    for (i = 0; i < cols; i++) {
        cor[i] = new Array(cols);
    }
    for (i = 0; i < cols; i++) {
        for (j = i; j < cols; j++) {
            var c = 0;
            for (var k = 0, l = scores.length; k < l; k++) {
                c += scores[k][j] * scores[k][i];
            }
            c /= rows - 1;
            cor[i][j] = c;
            cor[j][i] = c;
        }
    }
    return cor;
}

function zScores(matrix, means, standardDeviations) {
    means = means || mean(matrix);
    if (typeof(standardDeviations) === 'undefined') standardDeviations = standardDeviation(matrix, true, means);
    return standardize(center(matrix, means, false), standardDeviations, true);
}

function center(matrix, means, inPlace) {
    means = means || mean(matrix);
    var result = matrix,
        l = matrix.length,
        i, j, jj;

    if (!inPlace) {
        result = new Array(l);
        for (i = 0; i < l; i++) {
            result[i] = new Array(matrix[i].length);
        }
    }

    for (i = 0; i < l; i++) {
        var row = result[i];
        for (j = 0, jj = row.length; j < jj; j++) {
            row[j] = matrix[i][j] - means[j];
        }
    }
    return result;
}

function standardize(matrix, standardDeviations, inPlace) {
    if (typeof(standardDeviations) === 'undefined') standardDeviations = standardDeviation(matrix);
    var result = matrix,
        l = matrix.length,
        i, j, jj;

    if (!inPlace) {
        result = new Array(l);
        for (i = 0; i < l; i++) {
            result[i] = new Array(matrix[i].length);
        }
    }

    for (i = 0; i < l; i++) {
        var resultRow = result[i];
        var sourceRow = matrix[i];
        for (j = 0, jj = resultRow.length; j < jj; j++) {
            if (standardDeviations[j] !== 0 && !isNaN(standardDeviations[j])) {
                resultRow[j] = sourceRow[j] / standardDeviations[j];
            }
        }
    }
    return result;
}

function weightedVariance(matrix, weights) {
    var means = mean(matrix);
    var rows = matrix.length;
    if (rows === 0) return [];
    var cols = matrix[0].length;
    var vari = new Array(cols);

    for (var j = 0; j < cols; j++) {
        var sum = 0;
        var a = 0, b = 0;

        for (var i = 0; i < rows; i++) {
            var z = matrix[i][j] - means[j];
            var w = weights[i];

            sum += w * (z * z);
            b += w;
            a += w * w;
        }

        vari[j] = sum * (b / (b * b - a));
    }

    return vari;
}

function weightedMean(matrix, weights, dimension) {
    if (typeof(dimension) === 'undefined') {
        dimension = 0;
    }
    var rows = matrix.length;
    if (rows === 0) return [];
    var cols = matrix[0].length,
        means, i, ii, j, w, row;

    if (dimension === 0) {
        means = new Array(cols);
        for (i = 0; i < cols; i++) {
            means[i] = 0;
        }
        for (i = 0; i < rows; i++) {
            row = matrix[i];
            w = weights[i];
            for (j = 0; j < cols; j++) {
                means[j] += row[j] * w;
            }
        }
    } else if (dimension === 1) {
        means = new Array(rows);
        for (i = 0; i < rows; i++) {
            means[i] = 0;
        }
        for (j = 0; j < rows; j++) {
            row = matrix[j];
            w = weights[j];
            for (i = 0; i < cols; i++) {
                means[j] += row[i] * w;
            }
        }
    } else {
        throw new Error('Invalid dimension');
    }

    var weightSum = arrayStat.sum(weights);
    if (weightSum !== 0) {
        for (i = 0, ii = means.length; i < ii; i++) {
            means[i] /= weightSum;
        }
    }
    return means;
}

function weightedCovariance(matrix, weights, means, dimension) {
    dimension = dimension || 0;
    means = means || weightedMean(matrix, weights, dimension);
    var s1 = 0, s2 = 0;
    for (var i = 0, ii = weights.length; i < ii; i++) {
        s1 += weights[i];
        s2 += weights[i] * weights[i];
    }
    var factor = s1 / (s1 * s1 - s2);
    return weightedScatter(matrix, weights, means, factor, dimension);
}

function weightedScatter(matrix, weights, means, factor, dimension) {
    dimension = dimension || 0;
    means = means || weightedMean(matrix, weights, dimension);
    if (typeof(factor) === 'undefined') {
        factor = 1;
    }
    var rows = matrix.length;
    if (rows === 0) {
        return [[]];
    }
    var cols = matrix[0].length,
        cov, i, j, k, s;

    if (dimension === 0) {
        cov = new Array(cols);
        for (i = 0; i < cols; i++) {
            cov[i] = new Array(cols);
        }
        for (i = 0; i < cols; i++) {
            for (j = i; j < cols; j++) {
                s = 0;
                for (k = 0; k < rows; k++) {
                    s += weights[k] * (matrix[k][j] - means[j]) * (matrix[k][i] - means[i]);
                }
                cov[i][j] = s * factor;
                cov[j][i] = s * factor;
            }
        }
    } else if (dimension === 1) {
        cov = new Array(rows);
        for (i = 0; i < rows; i++) {
            cov[i] = new Array(rows);
        }
        for (i = 0; i < rows; i++) {
            for (j = i; j < rows; j++) {
                s = 0;
                for (k = 0; k < cols; k++) {
                    s += weights[k] * (matrix[j][k] - means[j]) * (matrix[i][k] - means[i]);
                }
                cov[i][j] = s * factor;
                cov[j][i] = s * factor;
            }
        }
    } else {
        throw new Error('Invalid dimension');
    }

    return cov;
}

module.exports = {
    entropy: entropy,
    mean: mean,
    standardDeviation: standardDeviation,
    variance: variance,
    median: median,
    mode: mode,
    skewness: skewness,
    kurtosis: kurtosis,
    standardError: standardError,
    covariance: covariance,
    scatter: scatter,
    correlation: correlation,
    zScores: zScores,
    center: center,
    standardize: standardize,
    weightedVariance: weightedVariance,
    weightedMean: weightedMean,
    weightedCovariance: weightedCovariance,
    weightedScatter: weightedScatter
};


/***/ }),
/* 159 */
/***/ (function(module, exports, __webpack_require__) {

var NodeSquare = __webpack_require__(42);

function NodeHexagonal(x, y, weights, som) {

    NodeSquare.call(this, x, y, weights, som);

    this.hX = x - Math.floor(y / 2);
    this.z = 0 - this.hX - y;

}

NodeHexagonal.prototype = new NodeSquare;
NodeHexagonal.prototype.constructor = NodeHexagonal;

NodeHexagonal.prototype.getDistance = function getDistanceHexagonal(otherNode) {
    return Math.max(Math.abs(this.hX - otherNode.hX), Math.abs(this.y - otherNode.y), Math.abs(this.z - otherNode.z));
};

NodeHexagonal.prototype.getDistanceTorus = function getDistanceTorus(otherNode) {
    var distX = Math.abs(this.hX - otherNode.hX),
        distY = Math.abs(this.y - otherNode.y),
        distZ = Math.abs(this.z - otherNode.z);
    return Math.max(Math.min(distX, this.som.gridDim.x - distX), Math.min(distY, this.som.gridDim.y - distY), Math.min(distZ, this.som.gridDim.z - distZ));
};

NodeHexagonal.prototype.getPosition = function getPosition() {
    throw new Error('Unimplemented : cannot get position of the points for hexagonal grid');
};

module.exports = NodeHexagonal;

/***/ }),
/* 160 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var arrayStat = __webpack_require__(14);

function compareNumbers(a, b) {
    return a - b;
}

exports.max = function max(matrix) {
    var max = -Infinity;
    for (var i = 0; i < matrix.length; i++) {
        for (var j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] > max) max = matrix[i][j];
        }
    }
    return max;
};

exports.min = function min(matrix) {
    var min = Infinity;
    for (var i = 0; i < matrix.length; i++) {
        for (var j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] < min) min = matrix[i][j];
        }
    }
    return min;
};

exports.minMax = function minMax(matrix) {
    var min = Infinity;
    var max = -Infinity;
    for (var i = 0; i < matrix.length; i++) {
        for (var j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] < min) min = matrix[i][j];
            if (matrix[i][j] > max) max = matrix[i][j];
        }
    }
    return {
        min:min,
        max:max
    };
};

exports.entropy = function entropy(matrix, eps) {
    if (typeof (eps) === 'undefined') {
        eps = 0;
    }
    var sum = 0,
        l1 = matrix.length,
        l2 = matrix[0].length;
    for (var i = 0; i < l1; i++) {
        for (var j = 0; j < l2; j++) {
            sum += matrix[i][j] * Math.log(matrix[i][j] + eps);
        }
    }
    return -sum;
};

exports.mean = function mean(matrix, dimension) {
    if (typeof (dimension) === 'undefined') {
        dimension = 0;
    }
    var rows = matrix.length,
        cols = matrix[0].length,
        theMean, N, i, j;

    if (dimension === -1) {
        theMean = [0];
        N = rows * cols;
        for (i = 0; i < rows; i++) {
            for (j = 0; j < cols; j++) {
                theMean[0] += matrix[i][j];
            }
        }
        theMean[0] /= N;
    } else if (dimension === 0) {
        theMean = new Array(cols);
        N = rows;
        for (j = 0; j < cols; j++) {
            theMean[j] = 0;
            for (i = 0; i < rows; i++) {
                theMean[j] += matrix[i][j];
            }
            theMean[j] /= N;
        }
    } else if (dimension === 1) {
        theMean = new Array(rows);
        N = cols;
        for (j = 0; j < rows; j++) {
            theMean[j] = 0;
            for (i = 0; i < cols; i++) {
                theMean[j] += matrix[j][i];
            }
            theMean[j] /= N;
        }
    } else {
        throw new Error('Invalid dimension');
    }
    return theMean;
};

exports.sum = function sum(matrix, dimension) {
    if (typeof (dimension) === 'undefined') {
        dimension = 0;
    }
    var rows = matrix.length,
        cols = matrix[0].length,
        theSum, i, j;

    if (dimension === -1) {
        theSum = [0];
        for (i = 0; i < rows; i++) {
            for (j = 0; j < cols; j++) {
                theSum[0] += matrix[i][j];
            }
        }
    } else if (dimension === 0) {
        theSum = new Array(cols);
        for (j = 0; j < cols; j++) {
            theSum[j] = 0;
            for (i = 0; i < rows; i++) {
                theSum[j] += matrix[i][j];
            }
        }
    } else if (dimension === 1) {
        theSum = new Array(rows);
        for (j = 0; j < rows; j++) {
            theSum[j] = 0;
            for (i = 0; i < cols; i++) {
                theSum[j] += matrix[j][i];
            }
        }
    } else {
        throw new Error('Invalid dimension');
    }
    return theSum;
};

exports.product = function product(matrix, dimension) {
    if (typeof (dimension) === 'undefined') {
        dimension = 0;
    }
    var rows = matrix.length,
        cols = matrix[0].length,
        theProduct, i, j;

    if (dimension === -1) {
        theProduct = [1];
        for (i = 0; i < rows; i++) {
            for (j = 0; j < cols; j++) {
                theProduct[0] *= matrix[i][j];
            }
        }
    } else if (dimension === 0) {
        theProduct = new Array(cols);
        for (j = 0; j < cols; j++) {
            theProduct[j] = 1;
            for (i = 0; i < rows; i++) {
                theProduct[j] *= matrix[i][j];
            }
        }
    } else if (dimension === 1) {
        theProduct = new Array(rows);
        for (j = 0; j < rows; j++) {
            theProduct[j] = 1;
            for (i = 0; i < cols; i++) {
                theProduct[j] *= matrix[j][i];
            }
        }
    } else {
        throw new Error('Invalid dimension');
    }
    return theProduct;
};

exports.standardDeviation = function standardDeviation(matrix, means, unbiased) {
    var vari = exports.variance(matrix, means, unbiased), l = vari.length;
    for (var i = 0; i < l; i++) {
        vari[i] = Math.sqrt(vari[i]);
    }
    return vari;
};

exports.variance = function variance(matrix, means, unbiased) {
    if (typeof (unbiased) === 'undefined') {
        unbiased = true;
    }
    means = means || exports.mean(matrix);
    var rows = matrix.length;
    if (rows === 0) return [];
    var cols = matrix[0].length;
    var vari = new Array(cols);

    for (var j = 0; j < cols; j++) {
        var sum1 = 0, sum2 = 0, x = 0;
        for (var i = 0; i < rows; i++) {
            x = matrix[i][j] - means[j];
            sum1 += x;
            sum2 += x * x;
        }
        if (unbiased) {
            vari[j] = (sum2 - ((sum1 * sum1) / rows)) / (rows - 1);
        } else {
            vari[j] = (sum2 - ((sum1 * sum1) / rows)) / rows;
        }
    }
    return vari;
};

exports.median = function median(matrix) {
    var rows = matrix.length, cols = matrix[0].length;
    var medians = new Array(cols);

    for (var i = 0; i < cols; i++) {
        var data = new Array(rows);
        for (var j = 0; j < rows; j++) {
            data[j] = matrix[j][i];
        }
        data.sort(compareNumbers);
        var N = data.length;
        if (N % 2 === 0) {
            medians[i] = (data[N / 2] + data[(N / 2) - 1]) * 0.5;
        } else {
            medians[i] = data[Math.floor(N / 2)];
        }
    }
    return medians;
};

exports.mode = function mode(matrix) {
    var rows = matrix.length,
        cols = matrix[0].length,
        modes = new Array(cols),
        i, j;
    for (i = 0; i < cols; i++) {
        var itemCount = new Array(rows);
        for (var k = 0; k < rows; k++) {
            itemCount[k] = 0;
        }
        var itemArray = new Array(rows);
        var count = 0;

        for (j = 0; j < rows; j++) {
            var index = itemArray.indexOf(matrix[j][i]);
            if (index >= 0) {
                itemCount[index]++;
            } else {
                itemArray[count] = matrix[j][i];
                itemCount[count] = 1;
                count++;
            }
        }

        var maxValue = 0, maxIndex = 0;
        for (j = 0; j < count; j++) {
            if (itemCount[j] > maxValue) {
                maxValue = itemCount[j];
                maxIndex = j;
            }
        }

        modes[i] = itemArray[maxIndex];
    }
    return modes;
};

exports.skewness = function skewness(matrix, unbiased) {
    if (typeof (unbiased) === 'undefined') unbiased = true;
    var means = exports.mean(matrix);
    var n = matrix.length, l = means.length;
    var skew = new Array(l);

    for (var j = 0; j < l; j++) {
        var s2 = 0, s3 = 0;
        for (var i = 0; i < n; i++) {
            var dev = matrix[i][j] - means[j];
            s2 += dev * dev;
            s3 += dev * dev * dev;
        }

        var m2 = s2 / n;
        var m3 = s3 / n;
        var g = m3 / Math.pow(m2, 3 / 2);

        if (unbiased) {
            var a = Math.sqrt(n * (n - 1));
            var b = n - 2;
            skew[j] = (a / b) * g;
        } else {
            skew[j] = g;
        }
    }
    return skew;
};

exports.kurtosis = function kurtosis(matrix, unbiased) {
    if (typeof (unbiased) === 'undefined') unbiased = true;
    var means = exports.mean(matrix);
    var n = matrix.length, m = matrix[0].length;
    var kurt = new Array(m);

    for (var j = 0; j < m; j++) {
        var s2 = 0, s4 = 0;
        for (var i = 0; i < n; i++) {
            var dev = matrix[i][j] - means[j];
            s2 += dev * dev;
            s4 += dev * dev * dev * dev;
        }
        var m2 = s2 / n;
        var m4 = s4 / n;

        if (unbiased) {
            var v = s2 / (n - 1);
            var a = (n * (n + 1)) / ((n - 1) * (n - 2) * (n - 3));
            var b = s4 / (v * v);
            var c = ((n - 1) * (n - 1)) / ((n - 2) * (n - 3));
            kurt[j] = a * b - 3 * c;
        } else {
            kurt[j] = m4 / (m2 * m2) - 3;
        }
    }
    return kurt;
};

exports.standardError = function standardError(matrix) {
    var samples = matrix.length;
    var standardDeviations = exports.standardDeviation(matrix);
    var l = standardDeviations.length;
    var standardErrors = new Array(l);
    var sqrtN = Math.sqrt(samples);

    for (var i = 0; i < l; i++) {
        standardErrors[i] = standardDeviations[i] / sqrtN;
    }
    return standardErrors;
};

exports.covariance = function covariance(matrix, dimension) {
    return exports.scatter(matrix, undefined, dimension);
};

exports.scatter = function scatter(matrix, divisor, dimension) {
    if (typeof (dimension) === 'undefined') {
        dimension = 0;
    }
    if (typeof (divisor) === 'undefined') {
        if (dimension === 0) {
            divisor = matrix.length - 1;
        } else if (dimension === 1) {
            divisor = matrix[0].length - 1;
        }
    }
    var means = exports.mean(matrix, dimension);
    var rows = matrix.length;
    if (rows === 0) {
        return [[]];
    }
    var cols = matrix[0].length,
        cov, i, j, s, k;

    if (dimension === 0) {
        cov = new Array(cols);
        for (i = 0; i < cols; i++) {
            cov[i] = new Array(cols);
        }
        for (i = 0; i < cols; i++) {
            for (j = i; j < cols; j++) {
                s = 0;
                for (k = 0; k < rows; k++) {
                    s += (matrix[k][j] - means[j]) * (matrix[k][i] - means[i]);
                }
                s /= divisor;
                cov[i][j] = s;
                cov[j][i] = s;
            }
        }
    } else if (dimension === 1) {
        cov = new Array(rows);
        for (i = 0; i < rows; i++) {
            cov[i] = new Array(rows);
        }
        for (i = 0; i < rows; i++) {
            for (j = i; j < rows; j++) {
                s = 0;
                for (k = 0; k < cols; k++) {
                    s += (matrix[j][k] - means[j]) * (matrix[i][k] - means[i]);
                }
                s /= divisor;
                cov[i][j] = s;
                cov[j][i] = s;
            }
        }
    } else {
        throw new Error('Invalid dimension');
    }

    return cov;
};

exports.correlation = function correlation(matrix) {
    var means = exports.mean(matrix),
        standardDeviations = exports.standardDeviation(matrix, true, means),
        scores = exports.zScores(matrix, means, standardDeviations),
        rows = matrix.length,
        cols = matrix[0].length,
        i, j;

    var cor = new Array(cols);
    for (i = 0; i < cols; i++) {
        cor[i] = new Array(cols);
    }
    for (i = 0; i < cols; i++) {
        for (j = i; j < cols; j++) {
            var c = 0;
            for (var k = 0, l = scores.length; k < l; k++) {
                c += scores[k][j] * scores[k][i];
            }
            c /= rows - 1;
            cor[i][j] = c;
            cor[j][i] = c;
        }
    }
    return cor;
};

exports.zScores = function zScores(matrix, means, standardDeviations) {
    means = means || exports.mean(matrix);
    if (typeof (standardDeviations) === 'undefined') standardDeviations = exports.standardDeviation(matrix, true, means);
    return exports.standardize(exports.center(matrix, means, false), standardDeviations, true);
};

exports.center = function center(matrix, means, inPlace) {
    means = means || exports.mean(matrix);
    var result = matrix,
        l = matrix.length,
        i, j, jj;

    if (!inPlace) {
        result = new Array(l);
        for (i = 0; i < l; i++) {
            result[i] = new Array(matrix[i].length);
        }
    }

    for (i = 0; i < l; i++) {
        var row = result[i];
        for (j = 0, jj = row.length; j < jj; j++) {
            row[j] = matrix[i][j] - means[j];
        }
    }
    return result;
};

exports.standardize = function standardize(matrix, standardDeviations, inPlace) {
    if (typeof (standardDeviations) === 'undefined') standardDeviations = exports.standardDeviation(matrix);
    var result = matrix,
        l = matrix.length,
        i, j, jj;

    if (!inPlace) {
        result = new Array(l);
        for (i = 0; i < l; i++) {
            result[i] = new Array(matrix[i].length);
        }
    }

    for (i = 0; i < l; i++) {
        var resultRow = result[i];
        var sourceRow = matrix[i];
        for (j = 0, jj = resultRow.length; j < jj; j++) {
            if (standardDeviations[j] !== 0 && !isNaN(standardDeviations[j])) {
                resultRow[j] = sourceRow[j] / standardDeviations[j];
            }
        }
    }
    return result;
};

exports.weightedVariance = function weightedVariance(matrix, weights) {
    var means = exports.mean(matrix);
    var rows = matrix.length;
    if (rows === 0) return [];
    var cols = matrix[0].length;
    var vari = new Array(cols);

    for (var j = 0; j < cols; j++) {
        var sum = 0;
        var a = 0, b = 0;

        for (var i = 0; i < rows; i++) {
            var z = matrix[i][j] - means[j];
            var w = weights[i];

            sum += w * (z * z);
            b += w;
            a += w * w;
        }

        vari[j] = sum * (b / (b * b - a));
    }

    return vari;
};

exports.weightedMean = function weightedMean(matrix, weights, dimension) {
    if (typeof (dimension) === 'undefined') {
        dimension = 0;
    }
    var rows = matrix.length;
    if (rows === 0) return [];
    var cols = matrix[0].length,
        means, i, ii, j, w, row;

    if (dimension === 0) {
        means = new Array(cols);
        for (i = 0; i < cols; i++) {
            means[i] = 0;
        }
        for (i = 0; i < rows; i++) {
            row = matrix[i];
            w = weights[i];
            for (j = 0; j < cols; j++) {
                means[j] += row[j] * w;
            }
        }
    } else if (dimension === 1) {
        means = new Array(rows);
        for (i = 0; i < rows; i++) {
            means[i] = 0;
        }
        for (j = 0; j < rows; j++) {
            row = matrix[j];
            w = weights[j];
            for (i = 0; i < cols; i++) {
                means[j] += row[i] * w;
            }
        }
    } else {
        throw new Error('Invalid dimension');
    }

    var weightSum = arrayStat.sum(weights);
    if (weightSum !== 0) {
        for (i = 0, ii = means.length; i < ii; i++) {
            means[i] /= weightSum;
        }
    }
    return means;
};

exports.weightedCovariance = function weightedCovariance(matrix, weights, means, dimension) {
    dimension = dimension || 0;
    means = means || exports.weightedMean(matrix, weights, dimension);
    var s1 = 0, s2 = 0;
    for (var i = 0, ii = weights.length; i < ii; i++) {
        s1 += weights[i];
        s2 += weights[i] * weights[i];
    }
    var factor = s1 / (s1 * s1 - s2);
    return exports.weightedScatter(matrix, weights, means, factor, dimension);
};

exports.weightedScatter = function weightedScatter(matrix, weights, means, factor, dimension) {
    dimension = dimension || 0;
    means = means || exports.weightedMean(matrix, weights, dimension);
    if (typeof (factor) === 'undefined') {
        factor = 1;
    }
    var rows = matrix.length;
    if (rows === 0) {
        return [[]];
    }
    var cols = matrix[0].length,
        cov, i, j, k, s;

    if (dimension === 0) {
        cov = new Array(cols);
        for (i = 0; i < cols; i++) {
            cov[i] = new Array(cols);
        }
        for (i = 0; i < cols; i++) {
            for (j = i; j < cols; j++) {
                s = 0;
                for (k = 0; k < rows; k++) {
                    s += weights[k] * (matrix[k][j] - means[j]) * (matrix[k][i] - means[i]);
                }
                cov[i][j] = s * factor;
                cov[j][i] = s * factor;
            }
        }
    } else if (dimension === 1) {
        cov = new Array(rows);
        for (i = 0; i < rows; i++) {
            cov[i] = new Array(rows);
        }
        for (i = 0; i < rows; i++) {
            for (j = i; j < rows; j++) {
                s = 0;
                for (k = 0; k < cols; k++) {
                    s += weights[k] * (matrix[j][k] - means[j]) * (matrix[i][k] - means[i]);
                }
                cov[i][j] = s * factor;
                cov[j][i] = s * factor;
            }
        }
    } else {
        throw new Error('Invalid dimension');
    }

    return cov;
};


/***/ }),
/* 161 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Function that creates the tree
 * @param {Array <number>} X - chemical shifts of the signal
 * @param {Array <number>} Y - intensity of the signal
 * @param {number} from - the low limit of x
 * @param {number} to - the top limit of x
 * @param {number} minWindow - smallest range to accept in x
 * @param {number} threshold - smallest range to accept in y
 * @returns {{sum: number, center: number, left: {json}, right: {json}}}
 * left and right have the same structure than the parent, or have a
 * undefined value if are leafs
 */
function createTree (X, Y, from, to, minWindow, threshold) {
    minWindow = minWindow || 0.16;
    threshold = threshold || 0.01;
    if ((to - from) < minWindow)
        return undefined;
    var sum = 0;
    for (var i = 0; X[i] < to; i++) {
        if (X[i] > from)
            sum += Y[i];
    }
    if (sum < threshold) {
        return undefined;
    }
    var center = 0;
    for (var j = 0; X[j] < to; j++) {
        if (X[i] > from)
            center += X[j] * Y[j];
    }
    center = center / sum;
    if (((center - from) < 10e-6) || ((to - center) < 10e-6)) return undefined;
    if ((center - from) < (minWindow /4)) {
        return createTree(X, Y, center, to, minWindow, threshold);
    }
    else {
        if ((to - center) < (minWindow / 4)) {
            return createTree(X, Y, from, center, minWindow, threshold);
        }
        else {
            return {
                'sum': sum,
                'center': center,
                'left': createTree(X, Y, from, center, minWindow, threshold),
                'right': createTree(X, Y, center, to, minWindow, threshold)
            };
        }
    }
}

/**
 * Similarity between two nodes
 * @param {{sum: number, center: number, left: {json}, right: {json}}} a - tree A node
 * @param {{sum: number, center: number, left: {json}, right: {json}}} b - tree B node
 * @param {number} alpha - weights the relative importance of intensity vs. shift match
 * @param {number} beta - weights the relative importance of node matching and children matching
 * @param {number} gamma - controls the attenuation of the effect of chemical shift differences
 * @returns {number} similarity measure between tree nodes
 */
function S(a, b, alpha, beta, gamma) {
    if (a === undefined || b === undefined) {
        return 0;
    }
    else {
        var C = (alpha*Math.min(a.sum, b.sum)/Math.max(a.sum, b.sum)+ (1-alpha)*Math.exp(-gamma*Math.abs(a.center - b.center)));
    }
    return beta*C + (1-beta)*(S(a.left, b.left, alpha, beta, gamma)+S(a.right, b.right, alpha, beta, gamma));
}

/**
 * @type {number} alpha - weights the relative importance of intensity vs. shift match
 * @type {number} beta - weights the relative importance of node matching and children matching
 * @type {number} gamma - controls the attenuation of the effect of chemical shift differences
 * @type {number} minWindow - smallest range to accept in x
 * @type {number} threshold - smallest range to accept in y
 */
var defaultOptions = {
    minWindow: 0.16,
    threshold : 0.01,
    alpha: 0.1,
    beta: 0.33,
    gamma: 0.001
};

/**
 * Builds a tree based in the spectra and compares this trees
 * @param {{x: Array<number>, y: Array<number>}} A - first spectra to be compared
 * @param {{x: Array<number>, y: Array<number>}} B - second spectra to be compared
 * @param {number} from - the low limit of x
 * @param {number} to - the top limit of x
 * @param {{minWindow: number, threshold: number, alpha: number, beta: number, gamma: number}} options
 * @returns {number} similarity measure between the spectra
 */
function tree(A, B, from, to, options) {
    options = options || {};
    for (var o in defaultOptions)
        if (!options.hasOwnProperty(o)) {
            options[o] = defaultOptions[o];
        }
    var Atree, Btree;
    if (A.sum)
        Atree = A;
    else
        Atree = createTree(A.x, A.y, from, to, options.minWindow, options.threshold);
    if (B.sum)
        Btree = B;
    else
        Btree = createTree(B.x, B.y, from, to, options.minWindow, options.threshold);
    return S(Atree, Btree, options.alpha, options.beta, options.gamma);
}

module.exports = {
    calc: tree,
    createTree: createTree
};

/***/ }),
/* 162 */
/***/ (function(module, exports) {

module.exports = newArray

function newArray (n, value) {
  n = n || 0
  var array = new Array(n)
  for (var i = 0; i < n; i++) {
    array[i] = value
  }
  return array
}


/***/ }),
/* 163 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = Number.isNaN || function (x) {
	return x !== x;
};


/***/ }),
/* 164 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 165 */
/***/ (function(module, exports) {

if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}


/***/ }),
/* 166 */
/***/ (function(module, exports) {

module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}

/***/ }),
/* 167 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = __webpack_require__(166);

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = __webpack_require__(165);

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(168), __webpack_require__(164)))

/***/ }),
/* 168 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 169 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Root packages
exports.ArrayUtils = exports.AU = __webpack_require__(16);
exports.BitArray = __webpack_require__(43);
exports.HashTable = __webpack_require__(19);
exports.Matrix = __webpack_require__(0);
exports.PadArray = __webpack_require__(20);
exports.Regression = __webpack_require__(55);
exports.binarySearch = __webpack_require__(15);
exports.numSort = __webpack_require__(21);


// Math packages
var Math = exports.Math = {};

var distance = __webpack_require__(18);
Math.Distance = distance.distance;
Math.Similarity = distance.similarity;
Math.DistanceMatrix = __webpack_require__(45);
Math.SG = __webpack_require__(57);
Math.SGG = __webpack_require__(56);
Math.Matrix = exports.Matrix;
Math.SparseMatrix = __webpack_require__(59);
Math.BellOptimizer = __webpack_require__(51);
Math.CurveFitting = __webpack_require__(17);
Math.Kernel = __webpack_require__(8);


// Statistics packages
var Stat = exports.Stat = {};

Stat.array = __webpack_require__(2).array;
Stat.matrix = __webpack_require__(2).matrix;
Stat.PCA = __webpack_require__(52);
Stat.Performance = __webpack_require__(53);


// Random number generation
var RNG = exports.RNG = {};
RNG.XSadd = __webpack_require__(61);


// Supervised learning
var SL = exports.SL = {};

SL.CV = __webpack_require__(44);
SL.CrossValidation = SL.CV; // Alias
SL.SVM = __webpack_require__(60);
SL.KNN = __webpack_require__(49);
SL.NaiveBayes = __webpack_require__(50);
SL.PLS = __webpack_require__(54);


// Clustering
var Clust = exports.Clust = {};

Clust.kmeans = __webpack_require__(48);
Clust.hclust = __webpack_require__(47);


// Neural networks
var NN = exports.NN = exports.nn = {};

NN.SOM = __webpack_require__(58);
NN.FNN = __webpack_require__(46);


/***/ })
/******/ ]);
});