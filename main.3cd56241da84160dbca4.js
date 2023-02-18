"use strict";
(self["webpackChunkgame_tag"] = self["webpackChunkgame_tag"] || []).push([[179],{

/***/ 81:
/***/ (() => {


;// CONCATENATED MODULE: ./node_modules/redom/dist/redom.es.js
function createElement (query, ns) {
  var ref = parse(query);
  var tag = ref.tag;
  var id = ref.id;
  var className = ref.className;
  var element = ns ? document.createElementNS(ns, tag) : document.createElement(tag);

  if (id) {
    element.id = id;
  }

  if (className) {
    if (ns) {
      element.setAttribute('class', className);
    } else {
      element.className = className;
    }
  }

  return element;
}

function parse (query) {
  var chunks = query.split(/([.#])/);
  var className = '';
  var id = '';

  for (var i = 1; i < chunks.length; i += 2) {
    switch (chunks[i]) {
      case '.':
        className += " " + (chunks[i + 1]);
        break;

      case '#':
        id = chunks[i + 1];
    }
  }

  return {
    className: className.trim(),
    tag: chunks[0] || 'div',
    id: id
  };
}

function unmount (parent, child) {
  var parentEl = getEl(parent);
  var childEl = getEl(child);

  if (child === childEl && childEl.__redom_view) {
    // try to look up the view if not provided
    child = childEl.__redom_view;
  }

  if (childEl.parentNode) {
    doUnmount(child, childEl, parentEl);

    parentEl.removeChild(childEl);
  }

  return child;
}

function doUnmount (child, childEl, parentEl) {
  var hooks = childEl.__redom_lifecycle;

  if (hooksAreEmpty(hooks)) {
    childEl.__redom_lifecycle = {};
    return;
  }

  var traverse = parentEl;

  if (childEl.__redom_mounted) {
    trigger(childEl, 'onunmount');
  }

  while (traverse) {
    var parentHooks = traverse.__redom_lifecycle || {};

    for (var hook in hooks) {
      if (parentHooks[hook]) {
        parentHooks[hook] -= hooks[hook];
      }
    }

    if (hooksAreEmpty(parentHooks)) {
      traverse.__redom_lifecycle = null;
    }

    traverse = traverse.parentNode;
  }
}

function hooksAreEmpty (hooks) {
  if (hooks == null) {
    return true;
  }
  for (var key in hooks) {
    if (hooks[key]) {
      return false;
    }
  }
  return true;
}

/* global Node, ShadowRoot */

var hookNames = ['onmount', 'onremount', 'onunmount'];
var shadowRootAvailable = typeof window !== 'undefined' && 'ShadowRoot' in window;

function mount (parent, child, before, replace) {
  var parentEl = getEl(parent);
  var childEl = getEl(child);

  if (child === childEl && childEl.__redom_view) {
    // try to look up the view if not provided
    child = childEl.__redom_view;
  }

  if (child !== childEl) {
    childEl.__redom_view = child;
  }

  var wasMounted = childEl.__redom_mounted;
  var oldParent = childEl.parentNode;

  if (wasMounted && (oldParent !== parentEl)) {
    doUnmount(child, childEl, oldParent);
  }

  if (before != null) {
    if (replace) {
      var beforeEl = getEl(before);

      if (beforeEl.__redom_mounted) {
        trigger(beforeEl, 'onunmount');
      }

      parentEl.replaceChild(childEl, beforeEl);
    } else {
      parentEl.insertBefore(childEl, getEl(before));
    }
  } else {
    parentEl.appendChild(childEl);
  }

  doMount(child, childEl, parentEl, oldParent);

  return child;
}

function trigger (el, eventName) {
  if (eventName === 'onmount' || eventName === 'onremount') {
    el.__redom_mounted = true;
  } else if (eventName === 'onunmount') {
    el.__redom_mounted = false;
  }

  var hooks = el.__redom_lifecycle;

  if (!hooks) {
    return;
  }

  var view = el.__redom_view;
  var hookCount = 0;

  view && view[eventName] && view[eventName]();

  for (var hook in hooks) {
    if (hook) {
      hookCount++;
    }
  }

  if (hookCount) {
    var traverse = el.firstChild;

    while (traverse) {
      var next = traverse.nextSibling;

      trigger(traverse, eventName);

      traverse = next;
    }
  }
}

function doMount (child, childEl, parentEl, oldParent) {
  var hooks = childEl.__redom_lifecycle || (childEl.__redom_lifecycle = {});
  var remount = (parentEl === oldParent);
  var hooksFound = false;

  for (var i = 0, list = hookNames; i < list.length; i += 1) {
    var hookName = list[i];

    if (!remount) { // if already mounted, skip this phase
      if (child !== childEl) { // only Views can have lifecycle events
        if (hookName in child) {
          hooks[hookName] = (hooks[hookName] || 0) + 1;
        }
      }
    }
    if (hooks[hookName]) {
      hooksFound = true;
    }
  }

  if (!hooksFound) {
    childEl.__redom_lifecycle = {};
    return;
  }

  var traverse = parentEl;
  var triggered = false;

  if (remount || (traverse && traverse.__redom_mounted)) {
    trigger(childEl, remount ? 'onremount' : 'onmount');
    triggered = true;
  }

  while (traverse) {
    var parent = traverse.parentNode;
    var parentHooks = traverse.__redom_lifecycle || (traverse.__redom_lifecycle = {});

    for (var hook in hooks) {
      parentHooks[hook] = (parentHooks[hook] || 0) + hooks[hook];
    }

    if (triggered) {
      break;
    } else {
      if (traverse.nodeType === Node.DOCUMENT_NODE ||
        (shadowRootAvailable && (traverse instanceof ShadowRoot)) ||
        (parent && parent.__redom_mounted)
      ) {
        trigger(traverse, remount ? 'onremount' : 'onmount');
        triggered = true;
      }
      traverse = parent;
    }
  }
}

function setStyle (view, arg1, arg2) {
  var el = getEl(view);

  if (typeof arg1 === 'object') {
    for (var key in arg1) {
      setStyleValue(el, key, arg1[key]);
    }
  } else {
    setStyleValue(el, arg1, arg2);
  }
}

function setStyleValue (el, key, value) {
  el.style[key] = value == null ? '' : value;
}

/* global SVGElement */

var xlinkns = 'http://www.w3.org/1999/xlink';

function setAttr (view, arg1, arg2) {
  setAttrInternal(view, arg1, arg2);
}

function setAttrInternal (view, arg1, arg2, initial) {
  var el = getEl(view);

  var isObj = typeof arg1 === 'object';

  if (isObj) {
    for (var key in arg1) {
      setAttrInternal(el, key, arg1[key], initial);
    }
  } else {
    var isSVG = el instanceof SVGElement;
    var isFunc = typeof arg2 === 'function';

    if (arg1 === 'style' && typeof arg2 === 'object') {
      setStyle(el, arg2);
    } else if (isSVG && isFunc) {
      el[arg1] = arg2;
    } else if (arg1 === 'dataset') {
      setData(el, arg2);
    } else if (!isSVG && (arg1 in el || isFunc) && (arg1 !== 'list')) {
      el[arg1] = arg2;
    } else {
      if (isSVG && (arg1 === 'xlink')) {
        setXlink(el, arg2);
        return;
      }
      if (initial && arg1 === 'class') {
        arg2 = el.className + ' ' + arg2;
      }
      if (arg2 == null) {
        el.removeAttribute(arg1);
      } else {
        el.setAttribute(arg1, arg2);
      }
    }
  }
}

function setXlink (el, arg1, arg2) {
  if (typeof arg1 === 'object') {
    for (var key in arg1) {
      setXlink(el, key, arg1[key]);
    }
  } else {
    if (arg2 != null) {
      el.setAttributeNS(xlinkns, arg1, arg2);
    } else {
      el.removeAttributeNS(xlinkns, arg1, arg2);
    }
  }
}

function setData (el, arg1, arg2) {
  if (typeof arg1 === 'object') {
    for (var key in arg1) {
      setData(el, key, arg1[key]);
    }
  } else {
    if (arg2 != null) {
      el.dataset[arg1] = arg2;
    } else {
      delete el.dataset[arg1];
    }
  }
}

function redom_es_text (str) {
  return document.createTextNode((str != null) ? str : '');
}

function parseArgumentsInternal (element, args, initial) {
  for (var i = 0, list = args; i < list.length; i += 1) {
    var arg = list[i];

    if (arg !== 0 && !arg) {
      continue;
    }

    var type = typeof arg;

    if (type === 'function') {
      arg(element);
    } else if (type === 'string' || type === 'number') {
      element.appendChild(redom_es_text(arg));
    } else if (isNode(getEl(arg))) {
      mount(element, arg);
    } else if (arg.length) {
      parseArgumentsInternal(element, arg, initial);
    } else if (type === 'object') {
      setAttrInternal(element, arg, null, initial);
    }
  }
}

function ensureEl (parent) {
  return typeof parent === 'string' ? html(parent) : getEl(parent);
}

function getEl (parent) {
  return (parent.nodeType && parent) || (!parent.el && parent) || getEl(parent.el);
}

function isNode (arg) {
  return arg && arg.nodeType;
}

function html (query) {
  var args = [], len = arguments.length - 1;
  while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

  var element;

  var type = typeof query;

  if (type === 'string') {
    element = createElement(query);
  } else if (type === 'function') {
    var Query = query;
    element = new (Function.prototype.bind.apply( Query, [ null ].concat( args) ));
  } else {
    throw new Error('At least one argument required');
  }

  parseArgumentsInternal(getEl(element), args, true);

  return element;
}

var el = html;
var h = (/* unused pure expression or super */ null && (html));

html.extend = function extendHtml () {
  var args = [], len = arguments.length;
  while ( len-- ) args[ len ] = arguments[ len ];

  return html.bind.apply(html, [ this ].concat( args ));
};

function setChildren (parent) {
  var children = [], len = arguments.length - 1;
  while ( len-- > 0 ) children[ len ] = arguments[ len + 1 ];

  var parentEl = getEl(parent);
  var current = traverse(parent, children, parentEl.firstChild);

  while (current) {
    var next = current.nextSibling;

    unmount(parent, current);

    current = next;
  }
}

function traverse (parent, children, _current) {
  var current = _current;

  var childEls = Array(children.length);

  for (var i = 0; i < children.length; i++) {
    childEls[i] = children[i] && getEl(children[i]);
  }

  for (var i$1 = 0; i$1 < children.length; i$1++) {
    var child = children[i$1];

    if (!child) {
      continue;
    }

    var childEl = childEls[i$1];

    if (childEl === current) {
      current = current.nextSibling;
      continue;
    }

    if (isNode(childEl)) {
      var next = current && current.nextSibling;
      var exists = child.__redom_index != null;
      var replace = exists && next === childEls[i$1 + 1];

      mount(parent, child, current, replace);

      if (replace) {
        current = next;
      }

      continue;
    }

    if (child.length != null) {
      current = traverse(parent, child, current);
    }
  }

  return current;
}

function listPool (View, key, initData) {
  return new ListPool(View, key, initData);
}

var ListPool = function ListPool (View, key, initData) {
  this.View = View;
  this.initData = initData;
  this.oldLookup = {};
  this.lookup = {};
  this.oldViews = [];
  this.views = [];

  if (key != null) {
    this.key = typeof key === 'function' ? key : propKey(key);
  }
};

ListPool.prototype.update = function update (data, context) {
  var ref = this;
    var View = ref.View;
    var key = ref.key;
    var initData = ref.initData;
  var keySet = key != null;

  var oldLookup = this.lookup;
  var newLookup = {};

  var newViews = Array(data.length);
  var oldViews = this.views;

  for (var i = 0; i < data.length; i++) {
    var item = data[i];
    var view = (void 0);

    if (keySet) {
      var id = key(item);

      view = oldLookup[id] || new View(initData, item, i, data);
      newLookup[id] = view;
      view.__redom_id = id;
    } else {
      view = oldViews[i] || new View(initData, item, i, data);
    }
    view.update && view.update(item, i, data, context);

    var el = getEl(view.el);

    el.__redom_view = view;
    newViews[i] = view;
  }

  this.oldViews = oldViews;
  this.views = newViews;

  this.oldLookup = oldLookup;
  this.lookup = newLookup;
};

function propKey (key) {
  return function (item) {
    return item[key];
  };
}

function list (parent, View, key, initData) {
  return new List(parent, View, key, initData);
}

var List = function List (parent, View, key, initData) {
  this.View = View;
  this.initData = initData;
  this.views = [];
  this.pool = new ListPool(View, key, initData);
  this.el = ensureEl(parent);
  this.keySet = key != null;
};

List.prototype.update = function update (data, context) {
    if ( data === void 0 ) data = [];

  var ref = this;
    var keySet = ref.keySet;
  var oldViews = this.views;

  this.pool.update(data, context);

  var ref$1 = this.pool;
    var views = ref$1.views;
    var lookup = ref$1.lookup;

  if (keySet) {
    for (var i = 0; i < oldViews.length; i++) {
      var oldView = oldViews[i];
      var id = oldView.__redom_id;

      if (lookup[id] == null) {
        oldView.__redom_index = null;
        unmount(this, oldView);
      }
    }
  }

  for (var i$1 = 0; i$1 < views.length; i$1++) {
    var view = views[i$1];

    view.__redom_index = i$1;
  }

  setChildren(this, views);

  if (keySet) {
    this.lookup = lookup;
  }
  this.views = views;
};

List.extend = function extendList (parent, View, key, initData) {
  return List.bind(List, parent, View, key, initData);
};

list.extend = List.extend;

/* global Node */

function place (View, initData) {
  return new Place(View, initData);
}

var Place = function Place (View, initData) {
  this.el = redom_es_text('');
  this.visible = false;
  this.view = null;
  this._placeholder = this.el;

  if (View instanceof Node) {
    this._el = View;
  } else if (View.el instanceof Node) {
    this._el = View;
    this.view = View;
  } else {
    this._View = View;
  }

  this._initData = initData;
};

Place.prototype.update = function update (visible, data) {
  var placeholder = this._placeholder;
  var parentNode = this.el.parentNode;

  if (visible) {
    if (!this.visible) {
      if (this._el) {
        mount(parentNode, this._el, placeholder);
        unmount(parentNode, placeholder);

        this.el = getEl(this._el);
        this.visible = visible;
      } else {
        var View = this._View;
        var view = new View(this._initData);

        this.el = getEl(view);
        this.view = view;

        mount(parentNode, view, placeholder);
        unmount(parentNode, placeholder);
      }
    }
    this.view && this.view.update && this.view.update(data);
  } else {
    if (this.visible) {
      if (this._el) {
        mount(parentNode, placeholder, this._el);
        unmount(parentNode, this._el);

        this.el = placeholder;
        this.visible = visible;

        return;
      }
      mount(parentNode, placeholder, this.view);
      unmount(parentNode, this.view);

      this.el = placeholder;
      this.view = null;
    }
  }
  this.visible = visible;
};

/* global Node */

function router (parent, Views, initData) {
  return new Router(parent, Views, initData);
}

var Router = function Router (parent, Views, initData) {
  this.el = ensureEl(parent);
  this.Views = Views;
  this.initData = initData;
};

Router.prototype.update = function update (route, data) {
  if (route !== this.route) {
    var Views = this.Views;
    var View = Views[route];

    this.route = route;

    if (View && (View instanceof Node || View.el instanceof Node)) {
      this.view = View;
    } else {
      this.view = View && new View(this.initData, data);
    }

    setChildren(this.el, [this.view]);
  }
  this.view && this.view.update && this.view.update(data, route);
};

var ns = 'http://www.w3.org/2000/svg';

function svg (query) {
  var args = [], len = arguments.length - 1;
  while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

  var element;

  var type = typeof query;

  if (type === 'string') {
    element = createElement(query, ns);
  } else if (type === 'function') {
    var Query = query;
    element = new (Function.prototype.bind.apply( Query, [ null ].concat( args) ));
  } else {
    throw new Error('At least one argument required');
  }

  parseArgumentsInternal(getEl(element), args, true);

  return element;
}

var s = (/* unused pure expression or super */ null && (svg));

svg.extend = function extendSvg () {
  var args = [], len = arguments.length;
  while ( len-- ) args[ len ] = arguments[ len ];

  return svg.bind.apply(svg, [ this ].concat( args ));
};

svg.ns = ns;



;// CONCATENATED MODULE: ./src/scripts/view/app/mainpage.js

function createMainField() {
  var container = el("div.page.text-center");
  var title = el("h1.title", "Game of tag");
  var wrap = el("div.game-field");
  var row = el("div.fifteen", {
    id: "main-block"
  });
  var radioBtns = createRadioBtns();
  for (var i = 0; i < 16; i++) {
    var item = el("button.items", {
      "data-matrix-id": i + 1
    }, el("span.items-span.d-flex.justify-content-center.align-items-center", i + 1));
    row.append(item);
  }
  var btn = el("div.d-flex.justify-content-center.align-items-center", el("button.btn-layout", {
    id: "js-button"
  }, "Mix"));
  setChildren(wrap, row);
  container.append(title, radioBtns, wrap, btn);
  return container;
}
function createRadioBtns() {
  var bodyRadioBtn = el("div.mb-4.js-radio-btns", "Choose the difficulty level");
  var firstInner = el("div.form-check.form-check-inline");
  var firstInput = el("input.form-check-input", {
    type: "radio",
    name: "inlineRadioOptions",
    id: "first-btn"
  });
  var firstLabel = el("label.form-check-label", {
    "for": "first-btn"
  }, "Easy");
  var secondInner = el("div.form-check.form-check-inline");
  var secondInput = el("input.form-check-input", {
    type: "radio",
    name: "inlineRadioOptions",
    id: "second-btn"
  });
  var secondLabel = el("label.form-check-label", {
    "for": "second-btn"
  }, "Medium");
  var thirdInner = el("div.form-check.form-check-inline");
  var thirdInput = el("input.form-check-input", {
    type: "radio",
    name: "inlineRadioOptions",
    id: "third-btn"
  });
  var thirdLabel = el("label.form-check-label", {
    "for": "second-btn"
  }, "Hard");
  setChildren(firstInner, [firstInput, firstLabel]);
  setChildren(secondInner, [secondInput, secondLabel]);
  setChildren(thirdInner, [thirdInput, thirdLabel]);
  setChildren(bodyRadioBtn, [firstInner, secondInner, thirdInner]);
  return bodyRadioBtn;
}
;// CONCATENATED MODULE: ./src/scripts/view/components/createMatrix.js
function getMatrix(arr) {
  var matrix = [[], [], [], []];
  var y = 0;
  var x = 0;
  for (var i = 0; i < arr.length; i++) {
    if (x >= 4) {
      y++;
      x = 0;
    }
    matrix[y][x] = arr[i];
    x++;
  }
  return matrix;
}
;// CONCATENATED MODULE: ./src/scripts/view/components/setPositionElem.js
function setPositionMatrix(matrix, items) {
  for (var y = 0; y < matrix.length; y++) {
    for (var x = 0; x < matrix[y].length; x++) {
      var value = matrix[y][x];
      var node = items[value - 1];
      setNodeStyles(node, x, y);
    }
  }
}

//добавдение стилей элементам, выстраивание их по сетке
function setNodeStyles(node, x, y) {
  var shiftPs = 100;
  node.style.transform = "translate3D(".concat(x * shiftPs, "%, ").concat(y * shiftPs, "%, 0)");
}
;// CONCATENATED MODULE: ./src/scripts/view/utils/findBtnCoordinates.js
function findCoordBtn(number, matrix) {
  for (var y = 0; y < matrix.length; y++) {
    for (var x = 0; x < matrix[y].length; x++) {
      if (matrix[y][x] === number) {
        return {
          x: x,
          y: y
        };
      }
    }
  }
  return new Error("Проверь функцию findCoordBtn");
}
;// CONCATENATED MODULE: ./src/scripts/view/utils/chekForValidCoords.js
function findValidCoords(_ref) {
  var blankCoords = _ref.blankCoords,
    matrix = _ref.matrix,
    blockedCoords = _ref.blockedCoords;
  var validCoords = [];
  for (var y = 0; y < matrix.length; y++) {
    for (var x = 0; x < matrix[y].length; x++) {
      if (isValidForSwap({
        x: x,
        y: y
      }, blankCoords)) {
        if (!blockedCoords || !(blockedCoords.x == x && blockedCoords.y == y)) validCoords.push({
          x: x,
          y: y
        });
      }
    }
  }
  return validCoords;
}
function isValidForSwap(coords1, coords2) {
  var difX = Math.abs(coords1.x - coords2.x);
  var difY = Math.abs(coords1.y - coords2.y);
  return (difX === 1 || difY === 1) && (coords1.x === coords2.x || coords1.y === coords2.y);
}
;// CONCATENATED MODULE: ./src/scripts/view/utils/checkWinPosition.js
function chekingPositionForWin(matrix) {
  var winFlatArr = new Array(16).fill(0).map(function (_item, i) {
    return i + 1;
  });
  //сравниваем с первоначальным массивом
  var flatMatrix = matrix.flat(); // поднятие массива на один уровен без вложений
  for (var i = 0; i < winFlatArr.length; i++) {
    if (flatMatrix[i] !== winFlatArr[i]) {
      return false;
    }
  }
  return true;
}
;// CONCATENATED MODULE: ./src/scripts/controllers/addModal.js
function addmodal() {
  setTimeout(function () {
    document.getElementById("modal-container").classList.add("four");
    document.body.classList.add("modal-active");
  }, 500);
  document.getElementById("btn-remove").addEventListener("click", function () {
    document.getElementById("modal-container").classList.remove("four");
    document.body.classList.remove("modal-active");
  });
}
;// CONCATENATED MODULE: ./src/scripts/view/utils/swapingElem.js




var blockedCoords = null;
function randomSwap(matrix, blankNumber) {
  //matrix - двумерный массив в данном случае
  //blankCoord - позиция пустого квадрата относительно других блоков
  var blankCoords = findCoordBtn(blankNumber, matrix);
  var validCoords = findValidCoords({
    blankCoords: blankCoords,
    matrix: matrix,
    blockedCoords: blockedCoords
  });
  var finalCoords = validCoords[Math.floor(Math.random() * validCoords.length)];
  swap(blankCoords, finalCoords, matrix);
  blockedCoords = blankCoords;
}
function swap(coordsOne, coordsTwo, matrix) {
  var coordsOneNum = matrix[coordsOne.y][coordsOne.x];
  matrix[coordsOne.y][coordsOne.x] = matrix[coordsTwo.y][coordsTwo.x];
  matrix[coordsTwo.y][coordsTwo.x] = coordsOneNum;

  //всплывающее окно в случае победы
  if (chekingPositionForWin(matrix)) {
    addmodal();
  }
}
;// CONCATENATED MODULE: ./src/scripts/controllers/changeItemPos.js




function changeItemsPositions(container, matrix, blankNumber, items, shuffled) {
  container.addEventListener("click", function (e) {
    if (shuffled) return;
    var btn = e.target.closest("button");
    if (!btn) return;
    var buttonNumber = Number(btn.dataset.matrixId);
    var buttonCoords = findCoordBtn(buttonNumber, matrix);
    var blankCoords = findCoordBtn(blankNumber, matrix);
    var isValid = isValidForSwap(buttonCoords, blankCoords);
    if (isValid) {
      swap(buttonCoords, blankCoords, matrix);
      setPositionMatrix(matrix, items);
    }
  });
  makeArrowClick(matrix, blankNumber, items, shuffled);
}

//перемещение кубиков с помощью клавиатуры
function makeArrowClick(matrix, blankNumber, items, shuffled) {
  window.addEventListener("keydown", function (e) {
    if (shuffled) return;
    if (!e.key.includes("Arrow")) return;
    var blankCoords = findCoordBtn(blankNumber, matrix);
    var btnCoords = {
      x: blankCoords.x,
      y: blankCoords.y
    };
    var direction = e.key.split("Arrow")[1].toLowerCase();
    var maxIndexMatrix = matrix.length;
    switch (direction) {
      case "up":
        btnCoords.y += 1;
        break;
      case "down":
        btnCoords.y -= 1;
        break;
      case "left":
        btnCoords.x += 1;
        break;
      case "right":
        btnCoords.x -= 1;
        break;
      default:
        break;
    }
    if (btnCoords.y >= maxIndexMatrix || btnCoords.y < 0 || btnCoords.x >= maxIndexMatrix || btnCoords.x < 0) return;
    swap(blankCoords, btnCoords, matrix);
    setPositionMatrix(matrix, items);
  });
}
;// CONCATENATED MODULE: ./src/scripts/controllers/shuffleElements.js


function mixElements(matrix, blankNumber, items, shuffled) {
  var gameField = document.querySelector(".game-field");
  var mixCount = 0;
  var radioBtnsField = document.querySelector(".js-radio-btns");

  //количество перемешиваний
  radioBtnsField.addEventListener("click", function (e) {
    var btn = e.target.closest("input");
    if (btn == null) return;
    switch (btn.id) {
      case "first-btn":
        mixCount = 10;
        break;
      case "second-btn":
        mixCount = 25;
        break;
      case "third-btn":
        mixCount = 50;
        break;
      default:
        break;
    }
  });
  var timer;
  var shuffleClass = "gameShuffle";
  document.getElementById("js-button").addEventListener("click", function () {
    if (shuffled || mixCount == 0) return;
    var shuffleCount = 0;
    clearInterval(timer);
    gameField.classList.add(shuffleClass);
    shuffled = true;
    if (shuffleCount === 0) {
      timer = setInterval(function () {
        randomSwap(matrix, blankNumber);
        setPositionMatrix(matrix, items);
        shuffleCount += 1;
        if (shuffleCount >= mixCount) {
          clearInterval(timer);
          gameField.classList.remove(shuffleClass);
          shuffled = false;
        }
      }, 150);
    }
  });
}
;// CONCATENATED MODULE: ./src/scripts/controllers/createAppLogic.js




function createGameItems() {
  //основной контейнер с элементами
  var containerNode = document.getElementById("main-block");
  //список элементов
  var items = Array.from(containerNode.querySelectorAll(".items"));
  var countItems = 16;
  if (items.length !== 16) throw new Error("Need\n".concat(countItems, " HTML elements!"));

  //к последнему элементу применяется стиль
  items[countItems - 1].style.display = "none";

  //присваивается всем элементам дата атрибут
  var arrItems = items.map(function (item) {
    return Number(item.dataset.matrixId);
  });

  // создается матрица из элементов
  var matrix = getMatrix(arrItems);

  //выстраивается сетка элементов
  setPositionMatrix(matrix, items);
  var blankNumber = 16;
  var shuffled = false;
  changeItemsPositions(containerNode, matrix, blankNumber, items, shuffled);
  mixElements(matrix, blankNumber, items, shuffled);
}
;// CONCATENATED MODULE: ./src/scripts/view/components/modal.js

function createModal() {
  var container = el("div", {
    id: "modal-container"
  });
  var modalBg = el("div.modal-background");
  var modalBody = el("div.modal-content.js-modal");
  var title = el("div.modal-header.justify-content-center.mb-4", el("h5.modal-title.text-danger", "Congratulations, you are the winner!"));
  var imgInner = el("div.modal-body.img-fluid.modal-img.mb-4");
  var modalBtn = el("div.modal-footer.d-flex.justify-content-center", el("button.btn.btn-secondary", {
    id: "btn-remove",
    type: "button"
  }, "Try again?"));
  setChildren(modalBody, [title, imgInner, modalBtn]);
  setChildren(modalBg, modalBody);
  setChildren(container, modalBg);
  return container;
}
;// CONCATENATED MODULE: ./src/index.js





(function () {
  var main = document.getElementById("section-app");
  setChildren(main, [createMainField(), createModal()]);
  createGameItems();
})();

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ var __webpack_exports__ = (__webpack_exec__(81));
/******/ }
]);