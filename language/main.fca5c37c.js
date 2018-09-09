// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"src\\terminal.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

String.prototype.replaceAll = function (search, replacement) {
  var target = this;
  return target.split(search).join(replacement);
};

var colorList = ['bg1', 'bg2', 'color1', 'color2'];

var Terminal = exports.Terminal = function () {
  function Terminal(selector) {
    var _this = this;

    _classCallCheck(this, Terminal);

    this.buffer = [];
    this.insertHook = [];
    this.insertHook.push(this.render.bind(this));

    window.addEventListener('load', function () {
      document.body.classList.add('bg1');
      _this.container = document.querySelector(selector);
      _this.render.apply(_this);
    });
  }

  _createClass(Terminal, [{
    key: 'insert',
    value: function insert(line) {
      this.buffer.push(line);
      this.insertHook.forEach(function (item) {
        return item();
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var shadowEle = document.createElement('ul');
      shadowEle.classList.add('bg1');
      shadowEle.classList.add('terminalElement');

      this.buffer.forEach(function (item) {
        shadowEle.appendChild(item.render());
      });

      if (this.ele) {
        this.ele.remove();
      }
      this.container.appendChild(shadowEle);
      window.scrollTo(0, document.body.scrollHeight);
      this.ele = shadowEle;
    }
  }]);

  return Terminal;
}();

var Line = exports.Line = function () {
  function Line(str) {
    _classCallCheck(this, Line);

    this.str = str;
    this.ele = document.createElement('li');
  }

  _createClass(Line, [{
    key: 'render',
    value: function render() {
      var replacedStr = this.str;

      for (var i = 0; i < colorList.length; i++) {
        var color = colorList[i];
        replacedStr = replacedStr.replaceAll('<' + color + '>', '<i class="' + color + '">');
        replacedStr = replacedStr.replaceAll('</' + color + '>', '</i>');
      }

      this.ele.innerHTML = replacedStr;
      return this.ele;
    }
  }]);

  return Line;
}();

var inputInterval = exports.inputInterval = function (_Line) {
  _inherits(inputInterval, _Line);

  function inputInterval(PS1, text, fun) {
    _classCallCheck(this, inputInterval);

    var _this2 = _possibleConstructorReturn(this, (inputInterval.__proto__ || Object.getPrototypeOf(inputInterval)).call(this, ""));

    _this2.str = PS1 + " <color2>></color2> ";
    _this2.ele = document.createElement('li');

    _this2.clicked = false;

    _this2.ele.onclick = function () {
      _this2.clicked = true;
    };

    var counter = 0;
    var updateStr = function updateStr() {
      setTimeout(function () {
        if (_this2.clicked) {
          _this2.str = text;
          _this2.render();
          if (fun) {
            fun();
          }
        } else {
          if (counter >= text.length - 1) {
            _this2.str += text[counter++];
            _this2.render();
            if (fun) {
              fun();
            }
          } else {
            _this2.str += text[counter++];
            _this2.render();
            updateStr();
          }
        }
      }, 10);
    };
    updateStr();
    return _this2;
  }

  _createClass(inputInterval, [{
    key: 'render',
    value: function render() {
      window.scrollTo(0, document.body.scrollHeight);
      var replacedStr = this.str;
      for (var i = 0; i < colorList.length; i++) {
        var color = colorList[i];
        replacedStr = replacedStr.replaceAll('<' + color + '>', '<i class="' + color + '">');
        replacedStr = replacedStr.replaceAll('</' + color + '>', '</i>');
      }

      this.ele.innerHTML = replacedStr;
      return this.ele;
    }
  }]);

  return inputInterval;
}(Line);

var ASCIIArt = exports.ASCIIArt = function (_Line2) {
  _inherits(ASCIIArt, _Line2);

  function ASCIIArt(str) {
    _classCallCheck(this, ASCIIArt);

    var _this3 = _possibleConstructorReturn(this, (ASCIIArt.__proto__ || Object.getPrototypeOf(ASCIIArt)).call(this, "", {}));

    _this3.str = str;
    return _this3;
  }

  _createClass(ASCIIArt, [{
    key: 'render',
    value: function render() {
      window.scrollTo(0, document.body.scrollHeight);
      var ele = document.createElement('li');
      ele.innerHTML = this.str;
      return ele;
    }
  }]);

  return ASCIIArt;
}(Line);

var Choice = exports.Choice = function (_Line3) {
  _inherits(Choice, _Line3);

  function Choice(PS1, content) {
    _classCallCheck(this, Choice);

    var _this4 = _possibleConstructorReturn(this, (Choice.__proto__ || Object.getPrototypeOf(Choice)).call(this, "", {}));

    _this4.PS1 = PS1;
    _this4.content = content;

    _this4.ele = document.createElement('li');
    _this4.ele.style.display = "flex";

    var PS = document.createElement('i');
    PS.innerText = _this4.PS1;
    PS.classList.add('color1');

    var Arrow = document.createElement('i');
    Arrow.innerHTML = '&nbsp>&nbsp';
    Arrow.classList.add('color2');

    var choiceContainer = document.createElement('div');

    var _loop = function _loop(i) {
      var item = _this4.content[i];

      var choice = document.createElement('div');
      choice.innerHTML = item;
      choice.classList.add('color2');
      choice.classList.add('choice');
      choice.onmouseover = function () {
        choice.classList.add('bg2');
      };
      choice.onmouseleave = function () {
        choice.classList.remove('bg2');
      };
      choice.onclick = function () {
        choice.style.backgroundColor = "#4F5B66";
        _this4.onChoose(i);
      };
      choiceContainer.appendChild(choice);
    };

    for (var i = 0; i < _this4.content.length; i++) {
      _loop(i);
    }

    _this4.ele.appendChild(PS);
    _this4.ele.appendChild(Arrow);
    _this4.ele.appendChild(choiceContainer);
    return _this4;
  }

  _createClass(Choice, [{
    key: 'render',
    value: function render() {
      window.scrollTo(0, document.body.scrollHeight);

      return this.ele;
    }
  }]);

  return Choice;
}(Line);

var Wait = exports.Wait = function (_Line4) {
  _inherits(Wait, _Line4);

  function Wait(time, fun) {
    _classCallCheck(this, Wait);

    var _this5 = _possibleConstructorReturn(this, (Wait.__proto__ || Object.getPrototypeOf(Wait)).call(this));

    _this5.duration = time;
    var setPercent = function setPercent(i) {
      if (i === 100) {
        _this5.str = "";
        if (fun) {
          fun();
        }
      } else {
        _this5.str = i + '%';
        window.scrollTo(0, document.body.scrollHeight);
        setTimeout(setPercent.bind(_this5, i + 1), _this5.duration / 100);
      }
      _this5.render();
    };
    setPercent(0);
    _this5.ele = document.createElement('li');
    return _this5;
  }

  _createClass(Wait, [{
    key: 'render',
    value: function render() {
      this.ele.innerHTML = this.str;
      return this.ele;
    }
  }]);

  return Wait;
}(Line);
},{}],"src\\script.json":[function(require,module,exports) {
module.exports = [{
  "type": "ASCIIArt",
  "content": "<br>&nbsp&nbsp&nbsp&nbsp&nbsp#######&nbsp&nbsp&nbsp######&nbsp&nbsp&nbsp######&nbsp&nbsp&nbsp&nbsp&nbsp########&nbsp########&nbsp&nbsp######&nbsp&nbsp##&nbsp&nbsp&nbsp&nbsp&nbsp##<br>&nbsp&nbsp&nbsp&nbsp##&nbsp&nbsp&nbsp&nbsp&nbsp##&nbsp##&nbsp&nbsp&nbsp&nbsp##&nbsp##&nbsp&nbsp&nbsp&nbsp##&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp##&nbsp&nbsp&nbsp&nbsp##&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp##&nbsp&nbsp&nbsp&nbsp##&nbsp##&nbsp&nbsp&nbsp&nbsp&nbsp##<br>&nbsp&nbsp&nbsp&nbsp##&nbsp&nbsp&nbsp&nbsp&nbsp##&nbsp##&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp##&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp##&nbsp&nbsp&nbsp&nbsp##&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp##&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp##&nbsp&nbsp&nbsp&nbsp&nbsp##<br>&nbsp&nbsp&nbsp&nbsp##&nbsp&nbsp&nbsp&nbsp&nbsp##&nbsp&nbsp######&nbsp&nbsp##&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp##&nbsp&nbsp&nbsp&nbsp######&nbsp&nbsp&nbsp##&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp#########<br>&nbsp&nbsp&nbsp&nbsp##&nbsp&nbsp##&nbsp##&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp##&nbsp##&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp##&nbsp&nbsp&nbsp&nbsp##&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp##&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp##&nbsp&nbsp&nbsp&nbsp&nbsp##<br>&nbsp&nbsp&nbsp&nbsp##&nbsp&nbsp&nbsp&nbsp##&nbsp&nbsp##&nbsp&nbsp&nbsp&nbsp##&nbsp##&nbsp&nbsp&nbsp&nbsp##&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp##&nbsp&nbsp&nbsp&nbsp##&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp##&nbsp&nbsp&nbsp&nbsp##&nbsp##&nbsp&nbsp&nbsp&nbsp&nbsp##<br>&nbsp&nbsp&nbsp&nbsp&nbsp#####&nbsp##&nbsp&nbsp######&nbsp&nbsp&nbsp######&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp##&nbsp&nbsp&nbsp&nbsp########&nbsp&nbsp######&nbsp&nbsp##&nbsp&nbsp&nbsp&nbsp&nbsp##<br>&nbsp&nbsp&nbsp&nbsp"
}, {
  "type": "inputInterval",
  "content": "ll"
}, {
  "type": "ASCIIArt",
  "content": "Permissions&nbspSize&nbspUser&nbsp&nbsp&nbsp&nbsp&nbspDate&nbspModified&nbspName<br>d<i class=\"color3\">r</i><i class=\"color2\">w</i><i class=\"color4\">x</i><i class=\"color3\">r</i><i class=\"color2\">w</i><i class=\"color4\">x</i><i class=\"color3\">r</i><i class=\"color2\">w</i><i class=\"color4\">x</i>&nbsp&nbsp&nbsp&nbsp&nbsp-&nbspQSCTech&nbsp&nbsp&nbsp4&nbspSep&nbsp&nbsp1:33&nbsp&nbspdist<br>d<i class=\"color3\">r</i><i class=\"color2\">w</i><i class=\"color4\">x</i><i class=\"color3\">r</i><i class=\"color2\">w</i><i class=\"color4\">x</i><i class=\"color3\">r</i><i class=\"color2\">w</i><i class=\"color4\">x</i>&nbsp&nbsp&nbsp&nbsp&nbsp-&nbspQSCTech&nbsp&nbsp&nbsp4&nbspSep&nbsp&nbsp1:33&nbsp&nbspDocuments<br>.<i class=\"color3\">r</i><i class=\"color2\">w</i><i class=\"color4\">-</i><i class=\"color3\">r</i><i class=\"color2\">w</i><i class=\"color4\">-</i><i class=\"color3\">r</i><i class=\"color2\">w</i><i class=\"color4\">-</i>&nbsp&nbsp&nbsp&nbsp&nbsp∞&nbspQSCTech&nbsp&nbsp&nbsp4&nbspSep&nbsp&nbsp1:33&nbsp&nbspREADME<br>d<i class=\"color3\">r</i><i class=\"color2\">w</i><i class=\"color4\">x</i><i class=\"color3\">r</i><i class=\"color2\">w</i><i class=\"color4\">x</i><i class=\"color3\">r</i><i class=\"color2\">w</i><i class=\"color4\">x</i>&nbsp&nbsp&nbsp&nbsp&nbsp-&nbspQSCTech&nbsp&nbsp&nbsp4&nbspSep&nbsp&nbsp1:33&nbsp&nbspsrc<br>.<i class=\"color3\">r</i><i class=\"color2\">w</i><i class=\"color4\">x</i><i class=\"color3\">r</i><i class=\"color2\">w</i><i class=\"color4\">x</i><i class=\"color3\">r</i><i class=\"color2\">w</i><i class=\"color4\">x</i>&nbsp&nbsp&nbsp&nbsp&nbsp∞&nbspQSCTech&nbsp&nbsp&nbsp4&nbspSep&nbsp&nbsp1:33&nbsp&nbsptext"
}, {
  "type": "inputInterval",
  "content": "cat README"
}, {
  "type": "interval",
  "content": "**在管理者的命令下，此文档与目录下二进制文件已被列为QSC Tech最高机密。**<br><br># Plan 10<br><br>## Background<br><br>在试图通过Qbit量子计算机检验机械决定论的过程中，意外地发现了计算的世界与世界的计算之间的递归关系。当实验人员142号尝试使用*设备*模拟世界的时候，意识到*设备*也已存在于世界当中。实验成功的前提是这样的递归于有限次内结束。但各次递归之间是等价的，并无任何能使它停止递归的特殊之处。实验人员142号因这样的悖论而丧失理智，于1992年将计划泄漏于公众。为了避免恐慌，QSC Tech已通过████手段将原计划伪装为分布式操作系统。由于其背后蕴含着的奥秘的至今仍有人从中获得有关计算的启发。<br><br>一年后，144号实验人员意识到我们所处的并非计算的结果，而是计算的过程。以此为启发启动了原计划的延续——通过一系列试验将世界机器反编译，得到**真理程序**。<br><br>由于世界的因果律过于复杂，我们最终只能存储**真理程序**的一部分。并且**真理程序**的运行将不会结束，所以我们只能通过阻断它的运行来得到其过程中的信息。实验过程中我们开发了wdb（The World Debugger）用于获取世界片段的信息，144号实验人员将此程序泄漏于GNU组织。幸运的是144号实验人员取出的源码并不包含项目的关键部分，仅能起到对部分程序的阻断、查看过程信息的功能，对**真理程序**无能为力。<br><br>在对我们存储的那一部分**真理程序**进行窥视的实验后，我们发现有关编程语言的讨论尤为激烈。以此为契机实验者192号演算出人 与 编程语言之间的联系。Plan 10正是这一理论的实践产物。通过对人的假想通学测试得到一个人命中注定的编程语言。<br><br>## Documents<br><br>全部文档位于`Documents`目录下，在尝试运行任何二进制文件之前请***务必***阅读文档。<br><br>## Contribution<br><br>如果想要参与这一项目，可以打开<a href=\"https://joinus.zjuqsc.com/\" class=\"color5\" >https://joinus.zjuqsc.com/</a>填写报名表，经过`三位大人`的亲自筛选才能参与此项目。<br><br>"
}, {
  "type": "inputInterval",
  "content": "./test"
}, {
  "type": "wait",
  "content": 5000
}, {
  "type": "inputInterval",
  "content": "在一个阳光明媚的上午，你猛然惊醒，看看身边的手机发现离迟到仅有15分钟"
}, {
  "type": "choice",
  "content": ["哪怕迟到也要保持良好的习惯，叠好被子去上学", "开学第一节课就迟到可不妙，被子不叠了冲出去上课"],
  "event": [[{
    "type": "inputInterval",
    "content": "时间只剩10分钟了，你看着远处排着长队的小白和近处一辆破烂的共享单车，你会选择？"
  }, {
    "type": "choice",
    "content": ["小白既优雅又快速，就是等待需要花时间", "凭着我超人的车技骑着单车定能10分钟内感到，但是不知道它会不会坏掉？", "我觉得还是走路上学比较快"],
    "event": [[{
      "type": "inputInterval",
      "content": "你还在排队的时候就已经能隐隐听到远处上课铃声响起，你的反应是？"
    }, {
      "type": "choice",
      "content": ["我得更快去上课了，所以我应该先造出一架飞行器，然后我就可以高速前往教学区了", "唉，还能怎么办呢？乖乖等着吧", "这一定只是错觉，按照我的估计应该是能赶到的"],
      "event": [[{
        "type": "inputInterval",
        "content": "我应该造一台可重复利用的飞行器还是一台一次性的飞行器呢？"
      }, {
        "type": "choice",
        "content": ["一台一次性的飞行器造起来可容易了，我应当速战速决", "我应该造能重复利用的飞行器，这样我明天就可以再用上它了"],
        "event": [[{
          "type": "choice",
          "content": ["我应当花点功夫在这台飞行器的速度上，这样我就能更快到达教室", "无论怎样先造出一个来"],
          "event": [[{
            "type": "Final",
            "lang": "C++"
          }], [{
            "type": "inputInterval",
            "content": "由于你制造飞行器时的不用心，在飞行图中发生了一场惨烈的事故。你在事故中获得了一个危险的超能力。这个超能力使你能窥探世界的根源，但由于它的使用过于复杂，稍不注意可能危及你和他人的生命。这时M博士联系你说他有一根长满铁锈的锁链能够封印你的这种超能力"
          }, {
            "type": "choice",
            "content": ["我有信心能控制好这个超能力", "立马请M博士为我装上枷锁——我可不想死"],
            "event": [[{
              "type": "Final",
              "lang": "C"
            }], [{
              "type": "Final",
              "lang": "Rust"
            }]]
          }]]
        }], [{
          "type": "Final",
          "lang": "Java"
        }]]
      }], [{
        "type": "inputInterval",
        "content": "你在等着的时候，是否要预习预习？"
      }, {
        "type": "choice",
        "content": ["等车就应该专心等车", "那我预习马上就要上的微积分吧", "我要同时预习微积分、线性代数……"],
        "event": [[{
          "type": "Final",
          "lang": "Python"
        }], [{
          "type": "Final",
          "lang": "JavaScript"
        }], [{
          "type": "Final",
          "lang": "Go"
        }]]
      }], [{
        "type": "inputInterval",
        "content": "你的自信从来不是没有理由的，是时候告诉大家你是一个不可能迟到的人了"
      }, {
        "type": "choice",
        "content": ["你突然身轻如燕长出羽毛，扑腾着窜上了天，就像一只敏捷的雨燕", "你化身一个飞镖，飞向了教学区", "你变身成为一只大象。不要小看大象全力奔跑的速度。"],
        "event": [[{
          "type": "Final",
          "lang": "Swift"
        }], [{
          "type": "Final",
          "lang": "Dart"
        }], [{
          "type": "Final",
          "lang": "PHP"
        }]]
      }]]
    }], [{
      "type": "inputInterval",
      "content": "果然，骑到一半共享单车的防滑把手脱落了。"
    }, {
      "type": "choice",
      "content": ["直接套回去就好了", "使用饱受赞誉的精密防滑把手安装器", "盯着它看但不知道怎么办"],
      "event": [[{
        "type": "Final",
        "lang": "Java"
      }], [{
        "type": "Final",
        "lang": "JavaScript"
      }], [{
        "type": "Final",
        "lang": "Python"
      }]]
    }], [{
      "type": "Final",
      "lang": "C"
    }]]
  }], [{
    "type": "inputInterval",
    "content": "在路上你看到了成堆的美元，要不要带走几张？"
  }, {
    "type": "choice",
    "content": ["我最喜欢$了，当然要拿走", "金钱不能使我弯腰"],
    "event": [[{
      "type": "Final",
      "lang": "PHP"
    }], [{
      "type": "inputInterval",
      "content": "路上窜出来一条蟒蛇和一只蝴蝶（很可惜都不怎么漂亮），你会如何反映？"
    }, {
      "type": "choice",
      "content": ["抓走这只蟒蛇", "抓走这只蝴蝶", "太脏了马上躲开"],
      "event": [[{
        "type": "Final",
        "lang": "Python"
      }], [{
        "type": "Final",
        "lang": "Perl 6"
      }], [{
        "type": "inputInterval",
        "content": "你牺牲了很多，终于在上课前到达了教室旁。时间充裕还可以去麦斯威买一杯饮品上课喝"
      }, {
        "type": "choice",
        "content": ["咖啡", "布丁奶茶"],
        "event": [[{
          "type": "Final",
          "lang": "Java"
        }], [{
          "type": "choice",
          "content": ["正常糖", "无糖", "十倍糖"],
          "event": [[{
            "type": "Final",
            "lang": "JavaScript"
          }], [{
            "type": "Final",
            "lang": "Erlang"
          }], [{
            "type": "Final",
            "lang": "Ruby"
          }]]
        }]]
      }]]
    }]]
  }]]
}];
},{}],"src\\main.js":[function(require,module,exports) {
'use strict';

var _terminal = require('./terminal');

var _script = require('./script');

var _script2 = _interopRequireDefault(_script);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var script = _script2.default;

var term = new _terminal.Terminal('#terminal');

window.addEventListener("load", function () {
  var next = function next(i) {
    var now = script[i];
    if (now.type === 'inputInterval') {
      term.insert(new _terminal.inputInterval("<color1> QSC </color1>", now.content, function () {
        next(i + 1);
      }));
    } else if (now.type === 'ASCIIArt') {
      term.insert(new _terminal.ASCIIArt(now.content));
      next(i + 1);
    } else if (now.type === 'choice') {
      var choice = new _terminal.Choice(" QSC ", now.content);
      choice.onChoose = function (num) {
        choice.onChoose = function () {};
        if (now.event[num]) {
          script = now.event[num];
        } else {
          now.event.forEach(function (item) {
            script = item;
          });
        }
        next(0);
      };
      term.insert(choice);
    } else if (now.type === 'interval') {
      term.insert(new _terminal.inputInterval("", now.content, function () {
        next(i + 1);
      }));
    } else if (now.type === 'wait') {
      term.insert(new _terminal.Wait(now.content, function () {
        next(i + 1);
      }));
    } else if (now.type === 'Final') {
      term.insert(new _terminal.ASCIIArt('QSys version 4.19-rc2 (wcc version 7.3.0)'));
      term.insert(new _terminal.ASCIIArt('\ne820: BIOS-provided physical RAM map: <br>\n<i class="color3">BIOS-e820</i>: [mem 0x0000000000000000-0x0000000000000fff] reserved<br>\n<i class="color3">BIOS-e820</i>: [mem 0x0000000000001000-0x0000000000057fff] usable<br>\n<i class="color3">BIOS-e820</i>: [mem 0x0000000000058000-0x0000000000058fff] reserved<br>\n<i class="color3">BIOS-e820</i>: [mem 0x0000000000059000-0x000000000009cfff] usable<br>\n<i class="color3">BIOS-e820</i>: [mem 0x000000000009d000-0x000000000009ffff] reserved<br>\n<i class="color3">BIOS-e820</i>: [mem 0x0000000000100000-0x000000006659dfff] usable<br>\n<i class="color3">BIOS-e820</i>: [mem 0x000000006659e000-0x000000006659efff] ACPI NVS<br>\n<i class="color3">BIOS-e820</i>: [mem 0x000000006659f000-0x00000000665c8fff] reserved<br>\n<i class="color3">BIOS-e820</i>: [mem 0x00000000665c9000-0x0000000066624fff] usable<br>\n<i class="color3">BIOS-e820</i>: [mem 0x0000000066625000-0x0000000066e15fff] reserved<br>\n<i class="color3">BIOS-e820</i>: [mem 0x0000000066e16000-0x0000000077c82fff] usable<br>\n'));
      setTimeout(function () {
        term.insert(new _terminal.ASCIIArt('Security Framework initialized'));
        setTimeout(function () {
          term.insert(new _terminal.ASCIIArt('Trying to unpack rootfs image as initramfs...'));
          setTimeout(function () {
            term.insert(new _terminal.ASCIIArt('Calculator loaded'));
            setTimeout(function () {
              term.insert(new _terminal.ASCIIArt('ACPI: Power (Electronic) on'));
              setTimeout(function () {
                term.insert(new _terminal.ASCIIArt('ACPI: Switch to nuclear power'));
                setTimeout(function () {
                  term.insert(new _terminal.ASCIIArt('Initialise system trusted keyrings'));
                  setTimeout(function () {
                    term.insert(new _terminal.ASCIIArt('WELCOME TO PLAN 10 DEMO'));
                    setTimeout(function () {
                      term.insert(new _terminal.ASCIIArt('\n                        LANG=zh_CN.utf8 <br>\n                        LC_CTYPE=zh_CN.utf8 <br>\n                        LC_NUMERIC="zh_CN.utf8" <br>\n                        LC_TIME="zh_CN.utf8" <br>\n                        LC_COLLATE="zh_CN.utf8" <br>\n                        LC_MONETARY="zh_CN.utf8" <br>\n                        LC_MESSAGES="zh_CN.utf8" <br>\n                        LC_PAPER="zh_CN.utf8" <br>\n                        LC_NAME="zh_CN.utf8" <br>\n                        LC_ADDRESS="zh_CN.utf8" <br>\n                        LC_TELEPHONE="zh_CN.utf8" <br>\n                        LC_MEASUREMENT="zh_CN.utf8" <br>\n                        LC_IDENTIFICATION="zh_CN.utf8" <br>\n                        \u6B22\u8FCE\u4F7F\u7528 PLAN 10 \u6D4B\u8BD5\u7CFB\u7EDF <br>\n                      '));
                      setTimeout(function () {
                        term.insert(new _terminal.ASCIIArt('\n                          \u6B63\u5728\u6F14\u7B97\n                        '));
                        setTimeout(function () {
                          term.insert(new _terminal.ASCIIArt('\n                            <i class="color2">[WW]</i> QPU0: \u6E29\u5EA6\u8FC7\u9AD8\uFF0C\u9650\u5236\u9891\u7387 <br>\n                            <i class="color2">[WW]</i> QPU1: \u6E29\u5EA6\u8FC7\u9AD8\uFF0C\u9650\u5236\u9891\u7387 <br>\n                            <i class="color2">[WW]</i> QPU2: \u6E29\u5EA6\u8FC7\u9AD8\uFF0C\u9650\u5236\u9891\u7387 <br>\n                            <i class="color2">[WW]</i> QPU3: \u6E29\u5EA6\u8FC7\u9AD8\uFF0C\u9650\u5236\u9891\u7387 <br>\n                          '));
                          setTimeout(function () {
                            term.insert(new _terminal.ASCIIArt('\n                              [II] QPU0: \u6E29\u5EA6/\u9891\u7387\u6062\u590D\u6B63\u5E38 <br>\n                              [II] QPU1: \u6E29\u5EA6/\u9891\u7387\u6062\u590D\u6B63\u5E38 <br>\n                              [II] QPU2: \u6E29\u5EA6/\u9891\u7387\u6062\u590D\u6B63\u5E38 <br>\n                              [II] QPU3: \u6E29\u5EA6/\u9891\u7387\u6062\u590D\u6B63\u5E38 <br>\n                            '));
                            setTimeout(function () {
                              term.insert(new _terminal.ASCIIArt('\n                                <i class="color2">[WW]</i> QPU0: \u6E29\u5EA6\u8FC7\u9AD8\uFF0C\u9650\u5236\u9891\u7387 <br>\n                                <i class="color2">[WW]</i> QPU1: \u6E29\u5EA6\u8FC7\u9AD8\uFF0C\u9650\u5236\u9891\u7387 <br>\n                                <i class="color2">[WW]</i> QPU2: \u6E29\u5EA6\u8FC7\u9AD8\uFF0C\u9650\u5236\u9891\u7387 <br>\n                                <i class="color2">[WW]</i> QPU3: \u6E29\u5EA6\u8FC7\u9AD8\uFF0C\u9650\u5236\u9891\u7387 <br>\n                              '));
                              setTimeout(function () {
                                term.insert(new _terminal.ASCIIArt('\n                                  [II] QPU0: \u6E29\u5EA6/\u9891\u7387\u6062\u590D\u6B63\u5E38 <br>\n                                  [II] QPU1: \u6E29\u5EA6/\u9891\u7387\u6062\u590D\u6B63\u5E38 <br>\n                                  [II] QPU2: \u6E29\u5EA6/\u9891\u7387\u6062\u590D\u6B63\u5E38 <br>\n                                  [II] QPU3: \u6E29\u5EA6/\u9891\u7387\u6062\u590D\u6B63\u5E38 <br>\n                                '));
                                setTimeout(function () {
                                  console.log(now);
                                  term.insert(new _terminal.ASCIIArt('\n                                    \u5DF2\u5F97\u51FA\u8FD0\u7B97\u7ED3\u679C\uFF1A\u548C\u6211\u6700\u76F8\u50CF\u7684\u7F16\u7A0B\u8BED\u8A00\u662F: ' + now.lang + ' !\n                                  '));
                                  var termEle = document.getElementById('terminal');
                                  if (now.lang === 'C++') {
                                    termEle.innerHTML += '\n                                    <div class="final">\n                                      <div class="logoDiv">\n                                        <pre class="logo" >\n ######\n##    ##   ##     ##\n##         ##     ##\n##       ###### ######\n##         ##     ##\n##    ##   ##     ##\n ######</pre>\n </div>\n   <div class="info">\n   <div class="view-lines" role="presentation" aria-hidden="true" data-mprt="7" style="font-family: &quot;Droid Sans Mono&quot;, monospace, monospace, &quot;Droid Sans Fallback&quot;; font-weight: normal;line-height: 19px; letter-spacing: 0px;"><div style="top:0px;height:19px;" class="view-line"><span><span class="mtk8">#include</span><span class="mtk1">&nbsp;</span><span class="mtk8">&lt;</span><span class="mtk5">iostream</span><span class="mtk8">&gt;</span></span></div><div style="top: 19px; height: 19px;" class="view-line"><span><span class="mtk8">int</span><span class="mtk1">&nbsp;main</span><span class="mtk9">(){</span></span></div><div style="top: 38px; height: 19px;" class="view-line"><span><span class="mtk1">&nbsp;&nbsp;&nbsp;&nbsp;std::cout</span><span class="mtk9">&lt;&lt;</span><span class="mtk5">"Hello&nbsp;World!"</span><span class="mtk9">;</span></span></div><div style="top:57px;height:19px;" class="view-line"><span><span class="mtk1">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="mtk8">return</span><span class="mtk1">&nbsp;</span><span class="mtk6">0</span><span class="mtk9">;</span></span></div><div style="top:76px;height:19px;" class="view-line"><span><span class="mtk9">}</span></span></div></div>\n    <br>\n    <div class="intro">\n      <span class="introHead">Famous projects written in C++: </span>\n      <br>\n      <div class="itemContainer">\n        <span class="introItem">* MySQL</span>\n        <br>\n        <span class="introItem">* V8</span>\n        <br>\n        <span class="introItem">* OpenCV</span>\n      </div>\n    </div>\n    <div class="imageGallery">\n      <a class="image" href="https://joinus.zjuqsc.com" target="_blank"><img class="image" src="./qsc.png" /></a>\n      <div style="width: 5vw"></div>\n      <img class="image" src="./QRcode.png" />\n    </div>\n  </div>\n</div>';
                                  } else if (now.lang === 'C') {
                                    termEle.innerHTML += '\n                                    <div class="final">\n                                      <div class="logoDiv">\n                                        <pre class="logo" >\n ######\n##    ##\n##\n##\n##\n##    ##\n ######</pre>\n</div>\n  <div class="info">\n  <div class="view-lines" role="presentation" aria-hidden="true" data-mprt="7" style="font-family: &quot;Droid Sans Mono&quot;, monospace, monospace, &quot;Droid Sans Fallback&quot;; font-weight: normal; line-height: 19px; letter-spacing: 0px;"><div style="top:0px;height:19px;" class="view-line"><span><span class="mtk8">#include</span><span class="mtk1">&nbsp;</span><span class="mtk8">&lt;</span><span class="mtk5">stdio.h</span><span class="mtk8">&gt;</span></span></div><div style="top:19px;height:19px;" class="view-line"><span><span class="mtk8">int</span><span class="mtk1">&nbsp;main</span><span class="mtk9">(){</span></span></div><div style="top:38px;height:19px;" class="view-line"><span><span class="mtk1">&nbsp;&nbsp;printf</span><span class="mtk9">(</span><span class="mtk5">"Hello&nbsp;World!"</span><span class="mtk9">);</span></span></div><div style="top:57px;height:19px;" class="view-line"><span><span class="mtk1">&nbsp;&nbsp;</span><span class="mtk8">return</span><span class="mtk1">&nbsp;</span><span class="mtk6">0</span><span class="mtk9">;</span></span></div><div style="top:76px;height:19px;" class="view-line"><span><span class="mtk9">}</span></span></div></div>\n    <br>\n    <div class="intro">\n      <span class="introHead">Famous projects written in C: </span>\n      <br>\n      <div class="itemContainer">\n        <span class="introItem">* Linux</span>\n        <br>\n        <span class="introItem">* Nginx</span>\n        <br>\n        <span class="introItem">* Git</span>\n        <br>\n        <span class="introItem">* GTK</span>\n      </div>\n    </div>\n    <div class="imageGallery">\n      <a class="image" href="https://joinus.zjuqsc.com"><img class="image" src="./qsc.png" /></a>\n      <div style="width: 5vw"></div>\n      <img class="image" src="./QRcode.png" />\n    </div>\n  </div>\n</div>\n';
                                  } else if (now.lang === 'Rust') {
                                    termEle.innerHTML += '\n                                    <div class="final">\n                                      <div class="logoDiv">\n                                        <pre class="logo" >\n########  ##     ##  ######  ########\n##     ## ##     ## ##    ##    ##\n##     ## ##     ## ##          ##\n########  ##     ##  ######     ##\n##   ##   ##     ##       ##    ##\n##    ##  ##     ## ##    ##    ##\n##     ##  #######   ######     ##</pre>\n</div>\n  <div class="info">\n  <div class="view-lines" role="presentation" aria-hidden="true" data-mprt="7" style="font-size: 16px;font-family: &quot;Droid Sans Mono&quot;, monospace, monospace, &quot;Droid Sans Fallback&quot;; font-weight: normal;line-height: 19px; letter-spacing: 0px;"><div style="top:0px;height:19px;" class="view-line"><span><span class="mtk8">fn</span><span class="mtk1">&nbsp;main</span><span class="mtk9">(){</span></span></div><div style="top:19px;height:19px;" class="view-line"><span><span class="mtk1">&nbsp;&nbsp;</span><span class="mtk8">println!</span><span class="mtk9">(</span><span class="mtk5">"Hello&nbsp;World!"</span><span class="mtk9">)</span><span class="mtk1">;</span></span></div><div style="top:38px;height:19px;" class="view-line"><span><span class="mtk9">}</span></span></div></div>\n    <br>\n    <div class="intro">\n      <span class="introHead">Famous projects written in Rust: </span>\n      <br>\n      <div class="itemContainer">\n        <span class="introItem">* Servo</span>\n        <br>\n        <span class="introItem">* Redox</span>\n      </div>\n    </div>\n    <div class="imageGallery">\n      <a class="image" href="https://joinus.zjuqsc.com"><img class="image" src="./qsc.png" /></a>\n      <div style="width: 5vw"></div>\n      <img class="image" src="./QRcode.png" />\n    </div>\n  </div>\n</div>\n';
                                  } else if (now.lang === 'Java') {
                                    termEle.innerHTML += '\n                                    <div class="final">\n                                      <div class="logoDiv">\n                                        <pre class="logo" >\n      ##    ###    ##     ##    ###\n      ##   ## ##   ##     ##   ## ##\n      ##  ##   ##  ##     ##  ##   ##\n      ## ##     ## ##     ## ##     ##\n##    ## #########  ##   ##  #########\n##    ## ##     ##   ## ##   ##     ##\n ######  ##     ##    ###    ##     ##</pre>\n </div>\n   <div class="info">\n   <div class="view-lines" role="presentation" aria-hidden="true" data-mprt="7" style="font-size: 14px;font-family: &quot;Droid Sans Mono&quot;, monospace, monospace, &quot;Droid Sans Fallback&quot;; font-weight: normal;line-height: 19px; letter-spacing: 0px;"><div style="top:0px;height:19px;" class="view-line"><span><span class="mtk8">public</span><span class="mtk1">&nbsp;</span><span class="mtk8">class</span><span class="mtk1">&nbsp;QSCTech&nbsp;</span><span class="mtk9">{</span></span></div><div style="top:19px;height:19px;" class="view-line"><span><span class="mtk1">&nbsp;&nbsp;</span><span class="mtk8">public</span><span class="mtk1">&nbsp;</span><span class="mtk8">static</span><span class="mtk1">&nbsp;</span><span class="mtk8">void</span><span class="mtk1">&nbsp;main</span><span class="mtk9">(</span><span class="mtk1">String</span><span class="mtk9">[]</span><span class="mtk1">&nbsp;args</span><span class="mtk9">)&nbsp{</span></span></div><div style="top:38px;height:19px;" class="view-line"><span><span class="mtk1">&nbsp;&nbsp;&nbsp;&nbsp;System</span><span class="mtk9">.</span><span class="mtk1">out</span><span class="mtk9">.</span><span class="mtk1">println</span><span class="mtk9">(</span><span class="mtk5">"Hello&nbsp;World!"</span><span class="mtk9">);</span></span></div><div style="top:57px;height:19px;" class="view-line"><span><span class="mtk1">&nbsp;&nbsp;</span><span class="mtk9">}</span></span></div><div style="top:76px;height:19px;" class="view-line"><span><span class="mtk9">}</span></span></div></div>\n     <br>\n     <div class="intro">\n       <span class="introHead">Famous projects written in Java: </span>\n       <br>\n       <div class="itemContainer">\n         <span class="introItem">* Minecraft</span>\n         <br>\n         <span class="introItem">* JetBrains</span>\n         <br>\n         <span class="introItem">* Android Applications</span>\n       </div>\n     </div>\n     <div class="imageGallery">\n       <a class="image" href="https://joinus.zjuqsc.com"><img class="image" src="./qsc.png" /></a>\n       <div style="width: 5vw"></div>\n       <img class="image" src="./QRcode.png" />\n     </div>\n   </div>\n </div>\n';
                                  } else if (now.lang === 'Python') {
                                    termEle.innerHTML += '\n                                    <div class="final">\n                                      <div class="logoDiv">\n                                        <pre class="logo" style="font-size: 9px">\n########  ##    ## ######## ##     ##  #######  ##    ##\n##     ##  ##  ##     ##    ##     ## ##     ## ###   ##\n##     ##   ####      ##    ##     ## ##     ## ####  ##\n########     ##       ##    ######### ##     ## ## ## ##\n##           ##       ##    ##     ## ##     ## ##  ####\n##           ##       ##    ##     ## ##     ## ##   ###\n##           ##       ##    ##     ##  #######  ##    ##</pre>\n</div>\n  <div class="info">\n  <div class="view-lines" role="presentation" aria-hidden="true" data-mprt="7" style="font-family: &quot;Droid Sans Mono&quot;, monospace, monospace, &quot;Droid Sans Fallback&quot;; font-weight: normal;line-height: 19px; letter-spacing: 0px;"><div style="top:0px;height:19px;" class="view-line"><span><span class="mtk8">print</span><span class="mtk9">(</span><span class="mtk5">"Hello&nbsp;World!"</span><span class="mtk9">)</span></span></div></div>\n    <br>\n    <div class="intro">\n      <span class="introHead">Famous projects written in Python: </span>\n      <br>\n      <div class="itemContainer">\n        <span class="introItem">* YouTube</span>\n        <br>\n        <span class="introItem">* Instagram</span>\n        <br>\n        <span class="introItem">* BitTorrent</span>\n        <br>\n        <span class="introItem">* Reddit</span>\n      </div>\n    </div>\n    <div class="imageGallery">\n      <a class="image" href="https://joinus.zjuqsc.com"><img class="image" src="./qsc.png" /></a>\n      <div style="width: 5vw"></div>\n      <img class="image" src="./QRcode.png" />\n    </div>\n  </div>\n</div>\n';
                                  } else if (now.lang === 'JavaScript') {
                                    termEle.innerHTML += '\n                                    <div class="final">\n                                      <div class="logoDiv">\n                                      <pre class="logo" style="color: #FFF; font-size: 5.5px">\n      ##    ###    ##     ##    ###     ######   ######  ########  #### ########  ########\n      ##   ## ##   ##     ##   ## ##   ##    ## ##    ## ##     ##  ##  ##     ##    ##\n      ##  ##   ##  ##     ##  ##   ##  ##       ##       ##     ##  ##  ##     ##    ##\n      ## ##     ## ##     ## ##     ##  ######  ##       ########   ##  ########     ##\n##    ## #########  ##   ##  #########       ## ##       ##   ##    ##  ##           ##\n##    ## ##     ##   ## ##   ##     ## ##    ## ##    ## ##    ##   ##  ##           ##\n ######  ##     ##    ###    ##     ##  ######   ######  ##     ## #### ##           ##</pre>\n </div>\n   <div class="info">\n   <div class="view-lines" role="presentation" aria-hidden="true" data-mprt="7" style=" font-family: &quot;Droid Sans Mono&quot;, monospace, monospace, &quot;Droid Sans Fallback&quot;; font-weight: normal; line-height: 19px; letter-spacing: 0px;"><div style="top:0px;height:19px;" class="view-line"><span><span class="mtk1">console</span><span class="mtk9">.</span><span class="mtk1">log</span><span class="mtk9">(</span><span class="mtk5">"Hello&nbsp;World!"</span><span class="mtk9">)</span></span></div></div>\n     <br>\n     <div class="intro">\n       <span class="introHead">Famous projects written in Javascript: </span>\n       <br>\n       <div class="itemContainer">\n         <span class="introItem">* All Websites!</span>\n         <br>\n         <span class="introItem">* Electron</span>\n       </div>\n       <br>\n       <span class="introHead"># Any application that can be written in JavaScript, will enventually be written in JavaScript.   --Atwood\'s Law</span>\n     </div>\n     <div class="imageGallery">\n       <a class="image" href="https://joinus.zjuqsc.com"><img class="image" src="./qsc.png" /></a>\n       <div style="width: 5vw"></div>\n       <img class="image" src="./QRcode.png" />\n     </div>\n   </div>\n </div>\n';
                                  } else if (now.lang === 'Go') {
                                    termEle.innerHTML += '\n                                    <div class="final">\n                                      <div class="logoDiv">\n                                        <pre class="logo" style="color: #FFF">\n ######    #######\n##    ##  ##     ##\n##        ##     ##\n##   #### ##     ##\n##    ##  ##     ##\n##    ##  ##     ##\n ######    #######</pre>\n </div>\n   <div class="info">\n   <div class="view-lines" role="presentation" aria-hidden="true" data-mprt="7" style="font-size: 17px;font-family: &quot;Droid Sans Mono&quot;, monospace, monospace, &quot;Droid Sans Fallback&quot;; font-weight: normal;line-height: 19px; letter-spacing: 0px;"><div style="top:0px;height:19px;" class="view-line"><span><span class="mtk8">package</span><span class="mtk1">&nbsp;main&nbsp;</span></span></div><div style="top:19px;height:19px;" class="view-line"><span><span class="mtk8">import</span><span class="mtk1">&nbsp;</span><span class="mtk5">"fmt"</span></span></div><div style="top:38px;height:19px;" class="view-line"><span><span class="mtk8">func</span><span class="mtk1">&nbsp;main</span><span class="mtk9">(){</span></span></div><div style="top:57px;height:19px;" class="view-line"><span><span class="mtk1">&nbsp;&nbsp;fmt</span><span class="mtk9">.</span><span class="mtk1">Println</span><span class="mtk9">(</span><span class="mtk5">"Hello&nbsp;World!"</span><span class="mtk9">)</span></span></div><div style="top:76px;height:19px;" class="view-line"><span><span class="mtk9">}</span></span></div></div>\n     <br>\n     <div class="intro">\n       <span class="introHead">Famous projects written in Go: </span>\n       <br>\n       <div class="itemContainer">\n         <span class="introItem">* Tidb</span>\n         <br>\n         <span class="introItem">* Docker</span>\n       </div>\n     </div>\n     <div class="imageGallery">\n       <a class="image" href="https://joinus.zjuqsc.com"><img class="image" src="./qsc.png" /></a>\n       <div style="width: 5vw"></div>\n       <img class="image" src="./QRcode.png" />\n     </div>\n   </div>\n </div>\n';
                                  } else if (now.lang === 'Swift') {
                                    termEle.innerHTML += '\n                                    <div class="final">\n                                      <div class="logoDiv">\n                                        <pre class="logo" style="color: #FFF">\n ######  ##      ## #### ######## ########\n##    ## ##  ##  ##  ##  ##          ##\n##       ##  ##  ##  ##  ##          ##\n ######  ##  ##  ##  ##  ######      ##\n      ## ##  ##  ##  ##  ##          ##\n##    ## ##  ##  ##  ##  ##          ##\n ######   ###  ###  #### ##          ##</pre>\n </div>\n   <div class="info">\n   <div class="view-lines" role="presentation" aria-hidden="true" data-mprt="7" style="font-size:12px;font-family: &quot;Droid Sans Mono&quot;, monospace, monospace, &quot;Droid Sans Fallback&quot;; font-weight: normal;line-height: 19px; letter-spacing: 0px;"><div style="top:0px;height:19px;" class="view-line"><span><span class="mtk8">import</span><span class="mtk1">&nbsp;</span><span class="mtk22">Foundation</span></span></div><div style="top:19px;height:19px;" class="view-line"><span><span>&nbsp;</span></span></div><div style="top:38px;height:19px;" class="view-line"><span><span class="mtk1">print</span><span class="mtk9">(</span><span class="mtk5">"Hello&nbsp;World!"</span><span class="mtk9">)</span></span></div></div>\n     <br>\n     <div class="intro">\n       <span class="introHead">Famous projects written in Swift: </span>\n       <br>\n       <div class="itemContainer">\n         <span class="introItem">* iOS Applications</span>\n         <br>\n         <span class="introItem">* QSC Mobile</span>\n       </div>\n     </div>\n     <div class="imageGallery">\n       <a class="image" href="https://joinus.zjuqsc.com"><img class="image" src="./qsc.png" /></a>\n       <div style="width: 5vw"></div>\n       <img class="image" src="./QRcode.png" />\n     </div>\n   </div>\n </div>\n';
                                  } else if (now.lang === 'Dart') {
                                    termEle.innerHTML += '\n                                    <div class="final">\n                                      <div class="logoDiv">\n                                        <pre class="logo" style="color: #FFF">\n########     ###    ########  ########\n##     ##   ## ##   ##     ##    ##\n##     ##  ##   ##  ##     ##    ##\n##     ## ##     ## ########     ##\n##     ## ######### ##   ##      ##\n##     ## ##     ## ##    ##     ##\n########  ##     ## ##     ##    ##</pre>\n</div>\n  <div class="info">\n  <div class="view-lines" role="presentation" aria-hidden="true" data-mprt="7" style="font-family: &quot;Droid Sans Mono&quot;, monospace, monospace, &quot;Droid Sans Fallback&quot;; font-weight: normal; line-height: 19px; letter-spacing: 0px;"><div style="top:0px;height:19px;" class="view-line"><span><span class="mtk8">void</span><span class="mtk1">&nbsp;main</span><span class="mtk9">(){</span></span></div><div style="top:19px;height:19px;" class="view-line"><span><span class="mtk1">&nbsp;&nbsp;print</span><span class="mtk9">(</span><span class="mtk5">\'</span><span class="mtk1">Hello&nbsp;World</span><span class="mtk9">!</span><span class="mtk5">\'</span><span class="mtk9">);</span></span></div><div style="top:38px;height:19px;" class="view-line"><span><span class="mtk9">}</span></span></div></div>\n    <br>\n    <div class="intro">\n      <span class="introHead">Famous projects written in Dart: </span>\n      <br>\n      <div class="itemContainer">\n        <span class="introItem">* Flutter</span>\n        <br>\n        <span class="introItem">* AngularDart </span>\n      </div>\n    </div>\n    <div class="imageGallery">\n      <a class="image" href="https://joinus.zjuqsc.com"><img class="image" src="./qsc.png" /></a>\n      <div style="width: 5vw"></div>\n      <img class="image" src="./QRcode.png" />\n    </div>\n  </div>\n</div>\n';
                                  } else if (now.lang === 'PHP') {
                                    termEle.innerHTML += '\n                                    <div class="final">\n                                      <div class="logoDiv">\n                                        <pre class="logo" >\n  ########  ##     ## ########\n  ##     ## ##     ## ##     ##\n  ##     ## ##     ## ##     ##\n  ########  ######### ########\n  ##        ##     ## ##\n  ##        ##     ## ##\n  ##        ##     ## ##</pre>\n                                      </div>\n                                        <div class="info">\n                                          <div class="view-lines" role="presentation" aria-hidden="true" data-mprt="7" style="font-family: &quot;Droid Sans Mono&quot;, monospace, monospace, &quot;Droid Sans Fallback&quot;; font-weight: normal; line-height: 19px; letter-spacing: 0px;"><div style="top:0px;height:19px;" class="view-line"><span><span class="mtk14 mtkb">&lt;?php</span></span></div><div style="top:19px;height:19px;" class="view-line"><span><span class="mtk1">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="mtk8">echo</span><span class="mtk1">&nbsp;</span><span class="mtk5">"Hello&nbsp;World!"<span class="mtk1">;</span></span></span></div><div style="top:38px;height:19px;" class="view-line"><span><span class="mtk14 mtkb">?&gt;</span></span></div></div>\n                                          <br>\n                                          <div class="intro">\n                                            <span class="introHead">Famous projects written in PHP: </span>\n                                            <br>\n                                            <div class="itemContainer">\n                                              <span class="introItem">* FaceBook</span>\n                                              <br>\n                                              <span class="introItem">* Discuz!</span>\n                                              <br>\n                                              <span class="introItem">* WordPress</span>\n                                              <br>\n                                              <span class="introItem">* phpMyAdmin</span>\n                                            </div>\n                                          </div>\n                                          <div class="imageGallery">\n                                            <a class="image" href="https://joinus.zjuqsc.com"><img class="image" src="./qsc.png" /></a>\n                                            <div style="width: 5vw"></div>\n                                            <img class="image" src="./QRcode.png" />\n                                          </div>\n                                        </div>\n                                      </div>\n                                    ';
                                  } else if (now.lang === 'Perl 6') {
                                    termEle.innerHTML += '\n                                    <div class="final">\n                                      <div class="logoDiv">\n                                        <pre class="logo" style="color: #FFF; font-size:10px" >\n########  ######## ########  ##           #######\n##     ## ##       ##     ## ##          ##     ##\n##     ## ##       ##     ## ##          ##\n########  ######   ########  ##          ########\n##        ##       ##   ##   ##          ##     ##\n##        ##       ##    ##  ##          ##     ##\n##        ######## ##     ## ########     #######</pre>\n</div>\n  <div class="info">\n  <pre class="highlight" style="color: white;font-size: 10px"><span class="Statement">grammar</span> Parser {\n    <span class="Statement">rule</span>  TOP  {<span class="Constant"> I </span><span class="Special">&lt;</span>love<span class="Special">&gt;</span><span class="Constant"> </span><span class="Special">&lt;</span>lang<span class="Special">&gt;</span><span class="Constant"> </span>}\n    <span class="Statement">token</span> love {<span class="Constant"> </span><span class="Special">\'</span><span class="Constant">\u2665</span><span class="Special">\'</span><span class="Constant"> </span><span class="Special">|</span><span class="Constant"> love </span>}\n    <span class="Statement">token</span> lang {<span class="Constant"> </span><span class="Special">&lt; </span><span class="Constant">Perl Rust Go Python Ruby </span><span class="Special">&gt;</span><span class="Constant"> </span>}\n}\n\n<span class="Identifier">say</span> Parser<span class="Statement">.</span>parse<span class="Statement">:</span> <span class="Special">\'</span><span class="Constant">I \u2665 Perl</span><span class="Special">\'</span><span class="Statement">;</span>\n<span class="Comment"># OUTPUT: \uFF62I \u2665 Perl\uFF63 love =&gt; \uFF62\u2665\uFF63 lang =&gt; \uFF62Perl\uFF63</span>\n\n<span class="Identifier">say</span> Parser<span class="Statement">.</span>parse<span class="Statement">:</span> <span class="Special">\'</span><span class="Constant">I love Rust</span><span class="Special">\'</span><span class="Statement">;</span>\n<span class="Comment"># OUTPUT: \uFF62I love Rust\uFF63 love =&gt; \uFF62love\uFF63 lang =&gt; \uFF62Rust\uFF63</span></pre>\n    <br>\n    <div class="intro">\n      <br>\n    </div>\n    <div class="imageGallery">\n      <a class="image" href="https://joinus.zjuqsc.com"><img class="image" src="./qsc.png" /></a>\n      <div style="width: 5vw"></div>\n      <img class="image" src="./QRcode.png" />\n    </div>\n  </div>\n</div>\n';
                                  } else if (now.lang === 'Erlang') {
                                    termEle.innerHTML += '\n                                    <div class="final">\n                                      <div class="logoDiv">\n                                        <pre class="logo" style="color: #FFF; font-size: 9px">\n######## ########  ##          ###    ##    ##  ######\n##       ##     ## ##         ## ##   ###   ## ##    ##\n##       ##     ## ##        ##   ##  ####  ## ##\n######   ########  ##       ##     ## ## ## ## ##   ####\n##       ##   ##   ##       ######### ##  #### ##    ##\n##       ##    ##  ##       ##     ## ##   ### ##    ##\n######## ##     ## ######## ##     ## ##    ##  ######</pre>\n</div>\n  <div class="info">\n  <div class="view-lines" role="presentation" aria-hidden="true" data-mprt="7" style="font-size: 15px;font-family: &quot;Droid Sans Mono&quot;, monospace, monospace, &quot;Droid Sans Fallback&quot;; font-weight: normal;line-height: 19px; letter-spacing: 0px;"><div style="top:0px;height:19px;" class="view-line"><span><span class="mtk1">main</span><span class="mtk9">()</span><span class="mtk1">&nbsp;-&gt;</span></span></div><div style="top:19px;height:19px;" class="view-line"><span><span class="mtk1">&nbsp;&nbsp;&nbsp;&nbsp;io:</span><span class="mtk22">format</span><span class="mtk9">(</span><span class="mtk5">"Hello&nbsp;World!\n"</span><span class="mtk9">)</span><span class="mtk1">.</span></span></div></div>\n    <br>\n    <div class="intro">\n      <span class="introHead">Famous projects written in Erlang: </span>\n      <br>\n      <div class="itemContainer">\n        <span class="introItem">* RabbitMQ</span>\n        <br>\n        <span class="introItem">* SimpleDB</span>\n      </div>\n    </div>\n    <div class="imageGallery">\n      <a class="image" href="https://joinus.zjuqsc.com"><img class="image" src="./qsc.png" /></a>\n      <div style="width: 5vw"></div>\n      <img class="image" src="./QRcode.png" />\n    </div>\n  </div>\n</div>\n';
                                  } else if (now.lang === 'Ruby') {
                                    termEle.innerHTML += '\n                                    <div class="final">\n                                      <div class="logoDiv">\n                                        <pre class="logo" style="color: #FFF">\n########  ##     ## ########  ##    ##\n##     ## ##     ## ##     ##  ##  ##\n##     ## ##     ## ##     ##   ####\n########  ##     ## ########     ##\n##   ##   ##     ## ##     ##    ##\n##    ##  ##     ## ##     ##    ##\n##     ##  #######  ########     ##</pre>\n</div>\n  <div class="info">\n  <div class="view-line" style="font-family: monospace; font-size: 22px"><span><span class="mtk1">p&nbsp;</span><span class="mtk5">"Hello&nbsp;World"</span></span></div>\n    <br>\n    <div class="intro">\n      <span class="introHead">Famous projects written in Ruby: </span>\n      <br>\n      <div class="itemContainer">\n        <span class="introItem">* Rails</span>\n        <br>\n        <span class="introItem">* Gitlab</span>\n        <br>\n        <span class="introItem">* Sinatra</span>\n      </div>\n    </div>\n    <div class="imageGallery">\n      <a class="image" href="https://joinus.zjuqsc.com"><img class="image" src="./qsc.png" /></a>\n      <div style="width: 5vw"></div>\n      <img class="image" src="./QRcode.png" />\n    </div>\n  </div>\n</div>\n';
                                  }
                                  window.scrollTo(0, document.body.scrollHeight);
                                });
                              }, 1000);
                            }, 500);
                          }, 1000);
                        }, 500);
                      }, 500);
                    }, 500);
                  }, 500);
                });
              });
            });
          });
        });
      });
    }
  };
  next(0);
});
},{"./terminal":"src\\terminal.js","./script":"src\\script.json"}],"..\\..\\..\\AppData\\Roaming\\npm\\node_modules\\parcel\\src\\builtins\\hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';

var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };

  module.bundle.hotData = null;
}

module.bundle.Module = Module;

var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = '' || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '5544' + '/');
  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();

      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');

      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);

      removeErrorOverlay();

      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;

  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';

  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["..\\..\\..\\AppData\\Roaming\\npm\\node_modules\\parcel\\src\\builtins\\hmr-runtime.js","src\\main.js"], null)
//# sourceMappingURL=/main.fca5c37c.map