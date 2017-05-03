webpackJsonp([1],{

/***/ 4:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tiny_fps__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tiny_fps___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_tiny_fps__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_d3_force_worker_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_d3_force_worker_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_d3_force_worker_js__);



const worker = new __WEBPACK_IMPORTED_MODULE_1_d3_force_worker_js__();
worker.postMessage({bake: 'd3-force'});
worker.addEventListener('message', e => {
    console.log('browser heard worker message', e);
});

/***/ }),

/***/ 6:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_force_worker_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_force_worker_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_d3_force_worker_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_d3_force_browser_js__ = __webpack_require__(4);




/***/ })

},[6]);