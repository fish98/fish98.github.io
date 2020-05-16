// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
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
      localRequire.cache = {};

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

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
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
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"jquery.qrcode.min.js":[function(require,module,exports) {
(function (a) {
  a.fn.qrcode = function (k) {
    var v;

    function n(h) {
      this.mode = v;
      this.data = b(h);
    }

    function b(m) {
      var j, l, h, o;
      j = "";
      h = m.length;

      for (l = 0; l < h; l++) {
        o = m.charCodeAt(l);

        if (o >= 1 && o <= 127) {
          j += m.charAt(l);
        } else {
          if (o > 2047) {
            j += String.fromCharCode(224 | o >> 12 & 15);
            j += String.fromCharCode(128 | o >> 6 & 63);
            j += String.fromCharCode(128 | o >> 0 & 63);
          } else {
            j += String.fromCharCode(192 | o >> 6 & 31);
            j += String.fromCharCode(128 | o >> 0 & 63);
          }
        }
      }

      return j;
    }

    function e(h, j) {
      this.typeNumber = h;
      this.errorCorrectLevel = j;
      this.modules = null;
      this.moduleCount = 0;
      this.dataCache = null;
      this.dataList = [];
    }

    function c(j, m) {
      if (void 0 == j.length) {
        throw Error(j.length + "/" + m);
      }

      for (var l = 0; l < j.length && 0 == j[l];) {
        l++;
      }

      this.num = Array(j.length - l + m);

      for (var h = 0; h < j.length - l; h++) {
        this.num[h] = j[h + l];
      }
    }

    function d(h, j) {
      this.totalCount = h;
      this.dataCount = j;
    }

    function r() {
      this.buffer = [];
      this.length = 0;
    }

    n.prototype = {
      getLength: function getLength() {
        return this.data.length;
      },
      write: function write(h) {
        for (var j = 0; j < this.data.length; j++) {
          h.put(this.data.charCodeAt(j), 8);
        }
      }
    };
    e.prototype = {
      addData: function addData(h) {
        this.dataList.push(new n(h));
        this.dataCache = null;
      },
      isDark: function isDark(h, j) {
        if (0 > h || this.moduleCount <= h || 0 > j || this.moduleCount <= j) {
          throw Error(h + "," + j);
        }

        return this.modules[h][j];
      },
      getModuleCount: function getModuleCount() {
        return this.moduleCount;
      },
      make: function make() {
        if (1 > this.typeNumber) {
          for (var j = 1, j = 1; 40 > j; j++) {
            for (var o = d.getRSBlocks(j, this.errorCorrectLevel), m = new r(), h = 0, l = 0; l < o.length; l++) {
              h += o[l].dataCount;
            }

            for (l = 0; l < this.dataList.length; l++) {
              o = this.dataList[l], m.put(o.mode, 4), m.put(o.getLength(), i.getLengthInBits(o.mode, j)), o.write(m);
            }

            if (m.getLengthInBits() <= 8 * h) {
              break;
            }
          }

          this.typeNumber = j;
        }

        this.makeImpl(!1, this.getBestMaskPattern());
      },
      makeImpl: function makeImpl(j, m) {
        this.moduleCount = 4 * this.typeNumber + 17;
        this.modules = Array(this.moduleCount);

        for (var l = 0; l < this.moduleCount; l++) {
          this.modules[l] = Array(this.moduleCount);

          for (var h = 0; h < this.moduleCount; h++) {
            this.modules[l][h] = null;
          }
        }

        this.setupPositionProbePattern(0, 0);
        this.setupPositionProbePattern(this.moduleCount - 7, 0);
        this.setupPositionProbePattern(0, this.moduleCount - 7);
        this.setupPositionAdjustPattern();
        this.setupTimingPattern();
        this.setupTypeInfo(j, m);
        7 <= this.typeNumber && this.setupTypeNumber(j);
        null == this.dataCache && (this.dataCache = e.createData(this.typeNumber, this.errorCorrectLevel, this.dataList));
        this.mapData(this.dataCache, m);
      },
      setupPositionProbePattern: function setupPositionProbePattern(j, m) {
        for (var l = -1; 7 >= l; l++) {
          if (!(-1 >= j + l || this.moduleCount <= j + l)) {
            for (var h = -1; 7 >= h; h++) {
              -1 >= m + h || this.moduleCount <= m + h || (this.modules[j + l][m + h] = 0 <= l && 6 >= l && (0 == h || 6 == h) || 0 <= h && 6 >= h && (0 == l || 6 == l) || 2 <= l && 4 >= l && 2 <= h && 4 >= h ? !0 : !1);
            }
          }
        }
      },
      getBestMaskPattern: function getBestMaskPattern() {
        for (var j = 0, m = 0, l = 0; 8 > l; l++) {
          this.makeImpl(!0, l);
          var h = i.getLostPoint(this);

          if (0 == l || j > h) {
            j = h, m = l;
          }
        }

        return m;
      },
      createMovieClip: function createMovieClip(j, o, m) {
        j = j.createEmptyMovieClip(o, m);
        this.make();

        for (o = 0; o < this.modules.length; o++) {
          for (var m = 1 * o, h = 0; h < this.modules[o].length; h++) {
            var l = 1 * h;
            this.modules[o][h] && (j.beginFill(0, 100), j.moveTo(l, m), j.lineTo(l + 1, m), j.lineTo(l + 1, m + 1), j.lineTo(l, m + 1), j.endFill());
          }
        }

        return j;
      },
      setupTimingPattern: function setupTimingPattern() {
        for (var h = 8; h < this.moduleCount - 8; h++) {
          null == this.modules[h][6] && (this.modules[h][6] = 0 == h % 2);
        }

        for (h = 8; h < this.moduleCount - 8; h++) {
          null == this.modules[6][h] && (this.modules[6][h] = 0 == h % 2);
        }
      },
      setupPositionAdjustPattern: function setupPositionAdjustPattern() {
        for (var j = i.getPatternPosition(this.typeNumber), q = 0; q < j.length; q++) {
          for (var p = 0; p < j.length; p++) {
            var h = j[q],
                o = j[p];

            if (null == this.modules[h][o]) {
              for (var m = -2; 2 >= m; m++) {
                for (var l = -2; 2 >= l; l++) {
                  this.modules[h + m][o + l] = -2 == m || 2 == m || -2 == l || 2 == l || 0 == m && 0 == l ? !0 : !1;
                }
              }
            }
          }
        }
      },
      setupTypeNumber: function setupTypeNumber(j) {
        for (var m = i.getBCHTypeNumber(this.typeNumber), l = 0; 18 > l; l++) {
          var h = !j && 1 == (m >> l & 1);
          this.modules[Math.floor(l / 3)][l % 3 + this.moduleCount - 8 - 3] = h;
        }

        for (l = 0; 18 > l; l++) {
          h = !j && 1 == (m >> l & 1), this.modules[l % 3 + this.moduleCount - 8 - 3][Math.floor(l / 3)] = h;
        }
      },
      setupTypeInfo: function setupTypeInfo(j, o) {
        for (var m = i.getBCHTypeInfo(this.errorCorrectLevel << 3 | o), h = 0; 15 > h; h++) {
          var l = !j && 1 == (m >> h & 1);
          6 > h ? this.modules[h][8] = l : 8 > h ? this.modules[h + 1][8] = l : this.modules[this.moduleCount - 15 + h][8] = l;
        }

        for (h = 0; 15 > h; h++) {
          l = !j && 1 == (m >> h & 1), 8 > h ? this.modules[8][this.moduleCount - h - 1] = l : 9 > h ? this.modules[8][15 - h - 1 + 1] = l : this.modules[8][15 - h - 1] = l;
        }

        this.modules[this.moduleCount - 8][8] = !j;
      },
      mapData: function mapData(t, q) {
        for (var p = -1, s = this.moduleCount - 1, o = 7, m = 0, j = this.moduleCount - 1; 0 < j; j -= 2) {
          for (6 == j && j--;;) {
            for (var l = 0; 2 > l; l++) {
              if (null == this.modules[s][j - l]) {
                var h = !1;
                m < t.length && (h = 1 == (t[m] >>> o & 1));
                i.getMask(q, s, j - l) && (h = !h);
                this.modules[s][j - l] = h;
                o--;
                -1 == o && (m++, o = 7);
              }
            }

            s += p;

            if (0 > s || this.moduleCount <= s) {
              s -= p;
              p = -p;
              break;
            }
          }
        }
      }
    };
    e.PAD0 = 236;
    e.PAD1 = 17;

    e.createData = function (j, p, o) {
      for (var p = d.getRSBlocks(j, p), h = new r(), m = 0; m < o.length; m++) {
        var l = o[m];
        h.put(l.mode, 4);
        h.put(l.getLength(), i.getLengthInBits(l.mode, j));
        l.write(h);
      }

      for (m = j = 0; m < p.length; m++) {
        j += p[m].dataCount;
      }

      if (h.getLengthInBits() > 8 * j) {
        throw Error("code length overflow. (" + h.getLengthInBits() + ">" + 8 * j + ")");
      }

      for (h.getLengthInBits() + 4 <= 8 * j && h.put(0, 4); 0 != h.getLengthInBits() % 8;) {
        h.putBit(!1);
      }

      for (; !(h.getLengthInBits() >= 8 * j);) {
        h.put(e.PAD0, 8);

        if (h.getLengthInBits() >= 8 * j) {
          break;
        }

        h.put(e.PAD1, 8);
      }

      return e.createBytes(h, p);
    };

    e.createBytes = function (x, u) {
      for (var t = 0, w = 0, s = 0, q = Array(u.length), m = Array(u.length), p = 0; p < u.length; p++) {
        var j = u[p].dataCount,
            o = u[p].totalCount - j,
            w = Math.max(w, j),
            s = Math.max(s, o);
        q[p] = Array(j);

        for (var l = 0; l < q[p].length; l++) {
          q[p][l] = 255 & x.buffer[l + t];
        }

        t += j;
        l = i.getErrorCorrectPolynomial(o);
        j = new c(q[p], l.getLength() - 1).mod(l);
        m[p] = Array(l.getLength() - 1);

        for (l = 0; l < m[p].length; l++) {
          o = l + j.getLength() - m[p].length, m[p][l] = 0 <= o ? j.get(o) : 0;
        }
      }

      for (l = p = 0; l < u.length; l++) {
        p += u[l].totalCount;
      }

      t = Array(p);

      for (l = j = 0; l < w; l++) {
        for (p = 0; p < u.length; p++) {
          l < q[p].length && (t[j++] = q[p][l]);
        }
      }

      for (l = 0; l < s; l++) {
        for (p = 0; p < u.length; p++) {
          l < m[p].length && (t[j++] = m[p][l]);
        }
      }

      return t;
    };

    v = 4;

    for (var i = {
      PATTERN_POSITION_TABLE: [[], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34], [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50], [6, 30, 54], [6, 32, 58], [6, 34, 62], [6, 26, 46, 66], [6, 26, 48, 70], [6, 26, 50, 74], [6, 30, 54, 78], [6, 30, 56, 82], [6, 30, 58, 86], [6, 34, 62, 90], [6, 28, 50, 72, 94], [6, 26, 50, 74, 98], [6, 30, 54, 78, 102], [6, 28, 54, 80, 106], [6, 32, 58, 84, 110], [6, 30, 58, 86, 114], [6, 34, 62, 90, 118], [6, 26, 50, 74, 98, 122], [6, 30, 54, 78, 102, 126], [6, 26, 52, 78, 104, 130], [6, 30, 56, 82, 108, 134], [6, 34, 60, 86, 112, 138], [6, 30, 58, 86, 114, 142], [6, 34, 62, 90, 118, 146], [6, 30, 54, 78, 102, 126, 150], [6, 24, 50, 76, 102, 128, 154], [6, 28, 54, 80, 106, 132, 158], [6, 32, 58, 84, 110, 136, 162], [6, 26, 54, 82, 110, 138, 166], [6, 30, 58, 86, 114, 142, 170]],
      G15: 1335,
      G18: 7973,
      G15_MASK: 21522,
      getBCHTypeInfo: function getBCHTypeInfo(h) {
        for (var j = h << 10; 0 <= i.getBCHDigit(j) - i.getBCHDigit(i.G15);) {
          j ^= i.G15 << i.getBCHDigit(j) - i.getBCHDigit(i.G15);
        }

        return (h << 10 | j) ^ i.G15_MASK;
      },
      getBCHTypeNumber: function getBCHTypeNumber(h) {
        for (var j = h << 12; 0 <= i.getBCHDigit(j) - i.getBCHDigit(i.G18);) {
          j ^= i.G18 << i.getBCHDigit(j) - i.getBCHDigit(i.G18);
        }

        return h << 12 | j;
      },
      getBCHDigit: function getBCHDigit(h) {
        for (var j = 0; 0 != h;) {
          j++, h >>>= 1;
        }

        return j;
      },
      getPatternPosition: function getPatternPosition(h) {
        return i.PATTERN_POSITION_TABLE[h - 1];
      },
      getMask: function getMask(h, l, j) {
        switch (h) {
          case 0:
            return 0 == (l + j) % 2;

          case 1:
            return 0 == l % 2;

          case 2:
            return 0 == j % 3;

          case 3:
            return 0 == (l + j) % 3;

          case 4:
            return 0 == (Math.floor(l / 2) + Math.floor(j / 3)) % 2;

          case 5:
            return 0 == l * j % 2 + l * j % 3;

          case 6:
            return 0 == (l * j % 2 + l * j % 3) % 2;

          case 7:
            return 0 == (l * j % 3 + (l + j) % 2) % 2;

          default:
            throw Error("bad maskPattern:" + h);
        }
      },
      getErrorCorrectPolynomial: function getErrorCorrectPolynomial(h) {
        for (var l = new c([1], 0), j = 0; j < h; j++) {
          l = l.multiply(new c([1, g.gexp(j)], 0));
        }

        return l;
      },
      getLengthInBits: function getLengthInBits(h, j) {
        if (1 <= j && 10 > j) {
          switch (h) {
            case 1:
              return 10;

            case 2:
              return 9;

            case v:
              return 8;

            case 8:
              return 8;

            default:
              throw Error("mode:" + h);
          }
        } else {
          if (27 > j) {
            switch (h) {
              case 1:
                return 12;

              case 2:
                return 11;

              case v:
                return 16;

              case 8:
                return 10;

              default:
                throw Error("mode:" + h);
            }
          } else {
            if (41 > j) {
              switch (h) {
                case 1:
                  return 14;

                case 2:
                  return 13;

                case v:
                  return 16;

                case 8:
                  return 12;

                default:
                  throw Error("mode:" + h);
              }
            } else {
              throw Error("type:" + j);
            }
          }
        }
      },
      getLostPoint: function getLostPoint(u) {
        for (var s = u.getModuleCount(), q = 0, t = 0; t < s; t++) {
          for (var p = 0; p < s; p++) {
            for (var o = 0, j = u.isDark(t, p), m = -1; 1 >= m; m++) {
              if (!(0 > t + m || s <= t + m)) {
                for (var l = -1; 1 >= l; l++) {
                  0 > p + l || s <= p + l || 0 == m && 0 == l || j == u.isDark(t + m, p + l) && o++;
                }
              }
            }

            5 < o && (q += 3 + o - 5);
          }
        }

        for (t = 0; t < s - 1; t++) {
          for (p = 0; p < s - 1; p++) {
            if (o = 0, u.isDark(t, p) && o++, u.isDark(t + 1, p) && o++, u.isDark(t, p + 1) && o++, u.isDark(t + 1, p + 1) && o++, 0 == o || 4 == o) {
              q += 3;
            }
          }
        }

        for (t = 0; t < s; t++) {
          for (p = 0; p < s - 6; p++) {
            u.isDark(t, p) && !u.isDark(t, p + 1) && u.isDark(t, p + 2) && u.isDark(t, p + 3) && u.isDark(t, p + 4) && !u.isDark(t, p + 5) && u.isDark(t, p + 6) && (q += 40);
          }
        }

        for (p = 0; p < s; p++) {
          for (t = 0; t < s - 6; t++) {
            u.isDark(t, p) && !u.isDark(t + 1, p) && u.isDark(t + 2, p) && u.isDark(t + 3, p) && u.isDark(t + 4, p) && !u.isDark(t + 5, p) && u.isDark(t + 6, p) && (q += 40);
          }
        }

        for (p = o = 0; p < s; p++) {
          for (t = 0; t < s; t++) {
            u.isDark(t, p) && o++;
          }
        }

        u = Math.abs(100 * o / s / s - 50) / 5;
        return q + 10 * u;
      }
    }, g = {
      glog: function glog(h) {
        if (1 > h) {
          throw Error("glog(" + h + ")");
        }

        return g.LOG_TABLE[h];
      },
      gexp: function gexp(h) {
        for (; 0 > h;) {
          h += 255;
        }

        for (; 256 <= h;) {
          h -= 255;
        }

        return g.EXP_TABLE[h];
      },
      EXP_TABLE: Array(256),
      LOG_TABLE: Array(256)
    }, f = 0; 8 > f; f++) {
      g.EXP_TABLE[f] = 1 << f;
    }

    for (f = 8; 256 > f; f++) {
      g.EXP_TABLE[f] = g.EXP_TABLE[f - 4] ^ g.EXP_TABLE[f - 5] ^ g.EXP_TABLE[f - 6] ^ g.EXP_TABLE[f - 8];
    }

    for (f = 0; 255 > f; f++) {
      g.LOG_TABLE[g.EXP_TABLE[f]] = f;
    }

    c.prototype = {
      get: function get(h) {
        return this.num[h];
      },
      getLength: function getLength() {
        return this.num.length;
      },
      multiply: function multiply(j) {
        for (var m = Array(this.getLength() + j.getLength() - 1), l = 0; l < this.getLength(); l++) {
          for (var h = 0; h < j.getLength(); h++) {
            m[l + h] ^= g.gexp(g.glog(this.get(l)) + g.glog(j.get(h)));
          }
        }

        return new c(m, 0);
      },
      mod: function mod(j) {
        if (0 > this.getLength() - j.getLength()) {
          return this;
        }

        for (var m = g.glog(this.get(0)) - g.glog(j.get(0)), l = Array(this.getLength()), h = 0; h < this.getLength(); h++) {
          l[h] = this.get(h);
        }

        for (h = 0; h < j.getLength(); h++) {
          l[h] ^= g.gexp(g.glog(j.get(h)) + m);
        }

        return new c(l, 0).mod(j);
      }
    };
    d.RS_BLOCK_TABLE = [[1, 26, 19], [1, 26, 16], [1, 26, 13], [1, 26, 9], [1, 44, 34], [1, 44, 28], [1, 44, 22], [1, 44, 16], [1, 70, 55], [1, 70, 44], [2, 35, 17], [2, 35, 13], [1, 100, 80], [2, 50, 32], [2, 50, 24], [4, 25, 9], [1, 134, 108], [2, 67, 43], [2, 33, 15, 2, 34, 16], [2, 33, 11, 2, 34, 12], [2, 86, 68], [4, 43, 27], [4, 43, 19], [4, 43, 15], [2, 98, 78], [4, 49, 31], [2, 32, 14, 4, 33, 15], [4, 39, 13, 1, 40, 14], [2, 121, 97], [2, 60, 38, 2, 61, 39], [4, 40, 18, 2, 41, 19], [4, 40, 14, 2, 41, 15], [2, 146, 116], [3, 58, 36, 2, 59, 37], [4, 36, 16, 4, 37, 17], [4, 36, 12, 4, 37, 13], [2, 86, 68, 2, 87, 69], [4, 69, 43, 1, 70, 44], [6, 43, 19, 2, 44, 20], [6, 43, 15, 2, 44, 16], [4, 101, 81], [1, 80, 50, 4, 81, 51], [4, 50, 22, 4, 51, 23], [3, 36, 12, 8, 37, 13], [2, 116, 92, 2, 117, 93], [6, 58, 36, 2, 59, 37], [4, 46, 20, 6, 47, 21], [7, 42, 14, 4, 43, 15], [4, 133, 107], [8, 59, 37, 1, 60, 38], [8, 44, 20, 4, 45, 21], [12, 33, 11, 4, 34, 12], [3, 145, 115, 1, 146, 116], [4, 64, 40, 5, 65, 41], [11, 36, 16, 5, 37, 17], [11, 36, 12, 5, 37, 13], [5, 109, 87, 1, 110, 88], [5, 65, 41, 5, 66, 42], [5, 54, 24, 7, 55, 25], [11, 36, 12], [5, 122, 98, 1, 123, 99], [7, 73, 45, 3, 74, 46], [15, 43, 19, 2, 44, 20], [3, 45, 15, 13, 46, 16], [1, 135, 107, 5, 136, 108], [10, 74, 46, 1, 75, 47], [1, 50, 22, 15, 51, 23], [2, 42, 14, 17, 43, 15], [5, 150, 120, 1, 151, 121], [9, 69, 43, 4, 70, 44], [17, 50, 22, 1, 51, 23], [2, 42, 14, 19, 43, 15], [3, 141, 113, 4, 142, 114], [3, 70, 44, 11, 71, 45], [17, 47, 21, 4, 48, 22], [9, 39, 13, 16, 40, 14], [3, 135, 107, 5, 136, 108], [3, 67, 41, 13, 68, 42], [15, 54, 24, 5, 55, 25], [15, 43, 15, 10, 44, 16], [4, 144, 116, 4, 145, 117], [17, 68, 42], [17, 50, 22, 6, 51, 23], [19, 46, 16, 6, 47, 17], [2, 139, 111, 7, 140, 112], [17, 74, 46], [7, 54, 24, 16, 55, 25], [34, 37, 13], [4, 151, 121, 5, 152, 122], [4, 75, 47, 14, 76, 48], [11, 54, 24, 14, 55, 25], [16, 45, 15, 14, 46, 16], [6, 147, 117, 4, 148, 118], [6, 73, 45, 14, 74, 46], [11, 54, 24, 16, 55, 25], [30, 46, 16, 2, 47, 17], [8, 132, 106, 4, 133, 107], [8, 75, 47, 13, 76, 48], [7, 54, 24, 22, 55, 25], [22, 45, 15, 13, 46, 16], [10, 142, 114, 2, 143, 115], [19, 74, 46, 4, 75, 47], [28, 50, 22, 6, 51, 23], [33, 46, 16, 4, 47, 17], [8, 152, 122, 4, 153, 123], [22, 73, 45, 3, 74, 46], [8, 53, 23, 26, 54, 24], [12, 45, 15, 28, 46, 16], [3, 147, 117, 10, 148, 118], [3, 73, 45, 23, 74, 46], [4, 54, 24, 31, 55, 25], [11, 45, 15, 31, 46, 16], [7, 146, 116, 7, 147, 117], [21, 73, 45, 7, 74, 46], [1, 53, 23, 37, 54, 24], [19, 45, 15, 26, 46, 16], [5, 145, 115, 10, 146, 116], [19, 75, 47, 10, 76, 48], [15, 54, 24, 25, 55, 25], [23, 45, 15, 25, 46, 16], [13, 145, 115, 3, 146, 116], [2, 74, 46, 29, 75, 47], [42, 54, 24, 1, 55, 25], [23, 45, 15, 28, 46, 16], [17, 145, 115], [10, 74, 46, 23, 75, 47], [10, 54, 24, 35, 55, 25], [19, 45, 15, 35, 46, 16], [17, 145, 115, 1, 146, 116], [14, 74, 46, 21, 75, 47], [29, 54, 24, 19, 55, 25], [11, 45, 15, 46, 46, 16], [13, 145, 115, 6, 146, 116], [14, 74, 46, 23, 75, 47], [44, 54, 24, 7, 55, 25], [59, 46, 16, 1, 47, 17], [12, 151, 121, 7, 152, 122], [12, 75, 47, 26, 76, 48], [39, 54, 24, 14, 55, 25], [22, 45, 15, 41, 46, 16], [6, 151, 121, 14, 152, 122], [6, 75, 47, 34, 76, 48], [46, 54, 24, 10, 55, 25], [2, 45, 15, 64, 46, 16], [17, 152, 122, 4, 153, 123], [29, 74, 46, 14, 75, 47], [49, 54, 24, 10, 55, 25], [24, 45, 15, 46, 46, 16], [4, 152, 122, 18, 153, 123], [13, 74, 46, 32, 75, 47], [48, 54, 24, 14, 55, 25], [42, 45, 15, 32, 46, 16], [20, 147, 117, 4, 148, 118], [40, 75, 47, 7, 76, 48], [43, 54, 24, 22, 55, 25], [10, 45, 15, 67, 46, 16], [19, 148, 118, 6, 149, 119], [18, 75, 47, 31, 76, 48], [34, 54, 24, 34, 55, 25], [20, 45, 15, 61, 46, 16]];

    d.getRSBlocks = function (y, w) {
      var u = d.getRsBlockTable(y, w);

      if (void 0 == u) {
        throw Error("bad rs block @ typeNumber:" + y + "/errorCorrectLevel:" + w);
      }

      for (var x = u.length / 3, t = [], s = 0; s < x; s++) {
        for (var p = u[3 * s + 0], q = u[3 * s + 1], o = u[3 * s + 2], m = 0; m < p; m++) {
          t.push(new d(q, o));
        }
      }

      return t;
    };

    d.getRsBlockTable = function (h, j) {
      switch (j) {
        case 1:
          return d.RS_BLOCK_TABLE[4 * (h - 1) + 0];

        case 0:
          return d.RS_BLOCK_TABLE[4 * (h - 1) + 1];

        case 3:
          return d.RS_BLOCK_TABLE[4 * (h - 1) + 2];

        case 2:
          return d.RS_BLOCK_TABLE[4 * (h - 1) + 3];
      }
    };

    r.prototype = {
      get: function get(h) {
        return 1 == (this.buffer[Math.floor(h / 8)] >>> 7 - h % 8 & 1);
      },
      put: function put(h, l) {
        for (var j = 0; j < l; j++) {
          this.putBit(1 == (h >>> l - j - 1 & 1));
        }
      },
      getLengthInBits: function getLengthInBits() {
        return this.length;
      },
      putBit: function putBit(h) {
        var j = Math.floor(this.length / 8);
        this.buffer.length <= j && this.buffer.push(0);
        h && (this.buffer[j] |= 128 >>> this.length % 8);
        this.length++;
      }
    };
    "string" === typeof k && (k = {
      text: k
    });
    k = a.extend({}, {
      render: "canvas",
      width: 256,
      height: 256,
      typeNumber: -1,
      correctLevel: 2,
      background: "#ffffff",
      foreground: "#000000"
    }, k);
    return this.each(function () {
      var u;

      if ("canvas" == k.render) {
        u = new e(k.typeNumber, k.correctLevel);
        u.addData(k.text);
        u.make();
        var s = document.createElement("canvas");
        s.width = k.width;
        s.height = k.height;

        for (var q = s.getContext("2d"), t = k.width / u.getModuleCount(), p = k.height / u.getModuleCount(), o = 0; o < u.getModuleCount(); o++) {
          for (var l = 0; l < u.getModuleCount(); l++) {
            q.fillStyle = u.isDark(o, l) ? k.foreground : k.background;
            var m = Math.ceil((l + 1) * t) - Math.floor(l * t),
                h = Math.ceil((o + 1) * t) - Math.floor(o * t);
            q.fillRect(Math.round(l * t), Math.round(o * p), m, h);
          }
        }
      } else {
        u = new e(k.typeNumber, k.correctLevel);
        u.addData(k.text);
        u.make();
        s = a("<table></table>").css("width", k.width + "px").css("height", k.height + "px").css("border", "0px").css("border-collapse", "collapse").css("background-color", k.background);
        q = k.width / u.getModuleCount();
        t = k.height / u.getModuleCount();

        for (p = 0; p < u.getModuleCount(); p++) {
          o = a("<tr></tr>").css("height", t + "px").appendTo(s);

          for (l = 0; l < u.getModuleCount(); l++) {
            a("<td></td>").css("width", q + "px").css("background-color", u.isDark(p, l) ? k.foreground : k.background).appendTo(o);
          }
        }
      }

      u = s;
      jQuery(u).appendTo(this);
    });
  };
})(jQuery);
},{}],"../../../../../../usr/local/lib/node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "6926" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
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
  overlay.id = OVERLAY_ID; // html encode message and stack trace

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

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
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
}
},{}]},{},["../../../../../../usr/local/lib/node_modules/parcel/src/builtins/hmr-runtime.js","jquery.qrcode.min.js"], null)
//# sourceMappingURL=/jquery.qrcode.min.ea692736.js.map