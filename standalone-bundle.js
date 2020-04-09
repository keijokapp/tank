(() => {
  // output/Control.Semigroupoid/index.js
  var semigroupoidFn = {
    compose: function(f) {
      return function(g) {
        return function(x2) {
          return f(g(x2));
        };
      };
    }
  };

  // output/Control.Category/index.js
  var identity = function(dict) {
    return dict.identity;
  };
  var categoryFn = {
    identity: function(x2) {
      return x2;
    },
    Semigroupoid0: function() {
      return semigroupoidFn;
    }
  };

  // output/Data.Boolean/index.js
  var otherwise = true;

  // output/Data.Function/index.js
  var flip = function(f) {
    return function(b) {
      return function(a) {
        return f(a)(b);
      };
    };
  };
  var $$const = function(a) {
    return function(v) {
      return a;
    };
  };

  // output/Data.Unit/foreign.js
  var unit = void 0;

  // output/Data.Functor/index.js
  var map = function(dict) {
    return dict.map;
  };
  var $$void = function(dictFunctor) {
    return map(dictFunctor)($$const(unit));
  };

  // output/Control.Apply/index.js
  var apply = function(dict) {
    return dict.apply;
  };

  // output/Control.Applicative/index.js
  var pure = function(dict) {
    return dict.pure;
  };
  var unless = function(dictApplicative) {
    var pure1 = pure(dictApplicative);
    return function(v) {
      return function(v1) {
        if (!v) {
          return v1;
        }
        ;
        if (v) {
          return pure1(unit);
        }
        ;
        throw new Error("Failed pattern match at Control.Applicative (line 68, column 1 - line 68, column 65): " + [v.constructor.name, v1.constructor.name]);
      };
    };
  };
  var when = function(dictApplicative) {
    var pure1 = pure(dictApplicative);
    return function(v) {
      return function(v1) {
        if (v) {
          return v1;
        }
        ;
        if (!v) {
          return pure1(unit);
        }
        ;
        throw new Error("Failed pattern match at Control.Applicative (line 63, column 1 - line 63, column 63): " + [v.constructor.name, v1.constructor.name]);
      };
    };
  };
  var liftA1 = function(dictApplicative) {
    var apply2 = apply(dictApplicative.Apply0());
    var pure1 = pure(dictApplicative);
    return function(f) {
      return function(a) {
        return apply2(pure1(f))(a);
      };
    };
  };

  // output/Control.Bind/index.js
  var bind = function(dict) {
    return dict.bind;
  };

  // output/Data.Int/foreign.js
  var fromNumberImpl = function(just) {
    return function(nothing) {
      return function(n) {
        return (n | 0) === n ? just(n) : nothing;
      };
    };
  };
  var toNumber = function(n) {
    return n;
  };

  // output/Data.Bounded/foreign.js
  var topInt = 2147483647;
  var bottomInt = -2147483648;
  var topChar = String.fromCharCode(65535);
  var bottomChar = String.fromCharCode(0);
  var topNumber = Number.POSITIVE_INFINITY;
  var bottomNumber = Number.NEGATIVE_INFINITY;

  // output/Data.Ord/foreign.js
  var unsafeCompareImpl = function(lt) {
    return function(eq2) {
      return function(gt) {
        return function(x2) {
          return function(y2) {
            return x2 < y2 ? lt : x2 === y2 ? eq2 : gt;
          };
        };
      };
    };
  };
  var ordIntImpl = unsafeCompareImpl;
  var ordStringImpl = unsafeCompareImpl;

  // output/Data.Eq/foreign.js
  var refEq = function(r1) {
    return function(r2) {
      return r1 === r2;
    };
  };
  var eqIntImpl = refEq;
  var eqStringImpl = refEq;

  // output/Data.Eq/index.js
  var eqString = {
    eq: eqStringImpl
  };
  var eqInt = {
    eq: eqIntImpl
  };

  // output/Data.Ordering/index.js
  var LT = /* @__PURE__ */ function() {
    function LT2() {
    }
    ;
    LT2.value = new LT2();
    return LT2;
  }();
  var GT = /* @__PURE__ */ function() {
    function GT2() {
    }
    ;
    GT2.value = new GT2();
    return GT2;
  }();
  var EQ = /* @__PURE__ */ function() {
    function EQ2() {
    }
    ;
    EQ2.value = new EQ2();
    return EQ2;
  }();

  // output/Data.Ord/index.js
  var ordString = /* @__PURE__ */ function() {
    return {
      compare: ordStringImpl(LT.value)(EQ.value)(GT.value),
      Eq0: function() {
        return eqString;
      }
    };
  }();
  var ordInt = /* @__PURE__ */ function() {
    return {
      compare: ordIntImpl(LT.value)(EQ.value)(GT.value),
      Eq0: function() {
        return eqInt;
      }
    };
  }();
  var compare = function(dict) {
    return dict.compare;
  };

  // output/Data.Bounded/index.js
  var top = function(dict) {
    return dict.top;
  };
  var boundedInt = {
    top: topInt,
    bottom: bottomInt,
    Ord0: function() {
      return ordInt;
    }
  };
  var bottom = function(dict) {
    return dict.bottom;
  };

  // output/Data.Show/foreign.js
  var showNumberImpl = function(n) {
    var str = n.toString();
    return isNaN(str + ".0") ? str : str + ".0";
  };

  // output/Data.Show/index.js
  var showNumber = {
    show: showNumberImpl
  };
  var show = function(dict) {
    return dict.show;
  };

  // output/Data.Maybe/index.js
  var identity2 = /* @__PURE__ */ identity(categoryFn);
  var Nothing = /* @__PURE__ */ function() {
    function Nothing2() {
    }
    ;
    Nothing2.value = new Nothing2();
    return Nothing2;
  }();
  var Just = /* @__PURE__ */ function() {
    function Just2(value0) {
      this.value0 = value0;
    }
    ;
    Just2.create = function(value0) {
      return new Just2(value0);
    };
    return Just2;
  }();
  var maybe = function(v) {
    return function(v1) {
      return function(v2) {
        if (v2 instanceof Nothing) {
          return v;
        }
        ;
        if (v2 instanceof Just) {
          return v1(v2.value0);
        }
        ;
        throw new Error("Failed pattern match at Data.Maybe (line 237, column 1 - line 237, column 51): " + [v.constructor.name, v1.constructor.name, v2.constructor.name]);
      };
    };
  };
  var isJust = /* @__PURE__ */ maybe(false)(/* @__PURE__ */ $$const(true));
  var fromMaybe = function(a) {
    return maybe(a)(identity2);
  };
  var fromJust = function() {
    return function(v) {
      if (v instanceof Just) {
        return v.value0;
      }
      ;
      throw new Error("Failed pattern match at Data.Maybe (line 288, column 1 - line 288, column 46): " + [v.constructor.name]);
    };
  };

  // output/Data.Number/foreign.js
  var isFiniteImpl = isFinite;
  var atan2 = function(y2) {
    return function(x2) {
      return Math.atan2(y2, x2);
    };
  };
  var cos = Math.cos;
  var round = Math.round;
  var sin = Math.sin;

  // output/Data.Number/index.js
  var pi = 3.141592653589793;

  // output/Data.Int/index.js
  var top2 = /* @__PURE__ */ top(boundedInt);
  var bottom2 = /* @__PURE__ */ bottom(boundedInt);
  var fromNumber = /* @__PURE__ */ function() {
    return fromNumberImpl(Just.create)(Nothing.value);
  }();
  var unsafeClamp = function(x2) {
    if (!isFiniteImpl(x2)) {
      return 0;
    }
    ;
    if (x2 >= toNumber(top2)) {
      return top2;
    }
    ;
    if (x2 <= toNumber(bottom2)) {
      return bottom2;
    }
    ;
    if (otherwise) {
      return fromMaybe(0)(fromNumber(x2));
    }
    ;
    throw new Error("Failed pattern match at Data.Int (line 72, column 1 - line 72, column 29): " + [x2.constructor.name]);
  };
  var round2 = function($37) {
    return unsafeClamp(round($37));
  };

  // output/Control.Monad/index.js
  var ap = function(dictMonad) {
    var bind3 = bind(dictMonad.Bind1());
    var pure3 = pure(dictMonad.Applicative0());
    return function(f) {
      return function(a) {
        return bind3(f)(function(f$prime) {
          return bind3(a)(function(a$prime) {
            return pure3(f$prime(a$prime));
          });
        });
      };
    };
  };

  // output/Effect/foreign.js
  var pureE = function(a) {
    return function() {
      return a;
    };
  };
  var bindE = function(a) {
    return function(f) {
      return function() {
        return f(a())();
      };
    };
  };

  // output/Effect/index.js
  var $runtime_lazy = function(name14, moduleName, init) {
    var state2 = 0;
    var val;
    return function(lineNumber) {
      if (state2 === 2)
        return val;
      if (state2 === 1)
        throw new ReferenceError(name14 + " was needed before it finished initializing (module " + moduleName + ", line " + lineNumber + ")", moduleName, lineNumber);
      state2 = 1;
      val = init();
      state2 = 2;
      return val;
    };
  };
  var monadEffect = {
    Applicative0: function() {
      return applicativeEffect;
    },
    Bind1: function() {
      return bindEffect;
    }
  };
  var bindEffect = {
    bind: bindE,
    Apply0: function() {
      return $lazy_applyEffect(0);
    }
  };
  var applicativeEffect = {
    pure: pureE,
    Apply0: function() {
      return $lazy_applyEffect(0);
    }
  };
  var $lazy_functorEffect = /* @__PURE__ */ $runtime_lazy("functorEffect", "Effect", function() {
    return {
      map: liftA1(applicativeEffect)
    };
  });
  var $lazy_applyEffect = /* @__PURE__ */ $runtime_lazy("applyEffect", "Effect", function() {
    return {
      apply: ap(monadEffect),
      Functor0: function() {
        return $lazy_functorEffect(0);
      }
    };
  });
  var functorEffect = /* @__PURE__ */ $lazy_functorEffect(20);

  // output/Effect.Ref/foreign.js
  var _new = function(val) {
    return function() {
      return { value: val };
    };
  };
  var read = function(ref) {
    return function() {
      return ref.value;
    };
  };
  var modifyImpl = function(f) {
    return function(ref) {
      return function() {
        var t = f(ref.value);
        ref.value = t.state;
        return t.value;
      };
    };
  };
  var write = function(val) {
    return function(ref) {
      return function() {
        ref.value = val;
      };
    };
  };

  // output/Effect.Ref/index.js
  var $$void2 = /* @__PURE__ */ $$void(functorEffect);
  var $$new = _new;
  var modify$prime = modifyImpl;
  var modify = function(f) {
    return modify$prime(function(s) {
      var s$prime = f(s);
      return {
        state: s$prime,
        value: s$prime
      };
    });
  };
  var modify_ = function(f) {
    return function(s) {
      return $$void2(modify(f)(s));
    };
  };

  // output/Data.Array/foreign.js
  var replicateFill = function(count) {
    return function(value12) {
      if (count < 1) {
        return [];
      }
      var result = new Array(count);
      return result.fill(value12);
    };
  };
  var replicatePolyfill = function(count) {
    return function(value12) {
      var result = [];
      var n = 0;
      for (var i = 0; i < count; i++) {
        result[n++] = value12;
      }
      return result;
    };
  };
  var replicate = typeof Array.prototype.fill === "function" ? replicateFill : replicatePolyfill;
  var fromFoldableImpl = function() {
    function Cons3(head2, tail) {
      this.head = head2;
      this.tail = tail;
    }
    var emptyList = {};
    function curryCons(head2) {
      return function(tail) {
        return new Cons3(head2, tail);
      };
    }
    function listToArray(list) {
      var result = [];
      var count = 0;
      var xs = list;
      while (xs !== emptyList) {
        result[count++] = xs.head;
        xs = xs.tail;
      }
      return result;
    }
    return function(foldr2) {
      return function(xs) {
        return listToArray(foldr2(curryCons)(emptyList)(xs));
      };
    };
  }();
  var sortByImpl = function() {
    function mergeFromTo(compare2, fromOrdering, xs1, xs2, from, to) {
      var mid;
      var i;
      var j;
      var k;
      var x2;
      var y2;
      var c;
      mid = from + (to - from >> 1);
      if (mid - from > 1)
        mergeFromTo(compare2, fromOrdering, xs2, xs1, from, mid);
      if (to - mid > 1)
        mergeFromTo(compare2, fromOrdering, xs2, xs1, mid, to);
      i = from;
      j = mid;
      k = from;
      while (i < mid && j < to) {
        x2 = xs2[i];
        y2 = xs2[j];
        c = fromOrdering(compare2(x2)(y2));
        if (c > 0) {
          xs1[k++] = y2;
          ++j;
        } else {
          xs1[k++] = x2;
          ++i;
        }
      }
      while (i < mid) {
        xs1[k++] = xs2[i++];
      }
      while (j < to) {
        xs1[k++] = xs2[j++];
      }
    }
    return function(compare2) {
      return function(fromOrdering) {
        return function(xs) {
          var out;
          if (xs.length < 2)
            return xs;
          out = xs.slice(0);
          mergeFromTo(compare2, fromOrdering, out, xs.slice(0), 0, xs.length);
          return out;
        };
      };
    };
  }();

  // output/Data.Array.ST/foreign.js
  var sortByImpl2 = function() {
    function mergeFromTo(compare2, fromOrdering, xs1, xs2, from, to) {
      var mid;
      var i;
      var j;
      var k;
      var x2;
      var y2;
      var c;
      mid = from + (to - from >> 1);
      if (mid - from > 1)
        mergeFromTo(compare2, fromOrdering, xs2, xs1, from, mid);
      if (to - mid > 1)
        mergeFromTo(compare2, fromOrdering, xs2, xs1, mid, to);
      i = from;
      j = mid;
      k = from;
      while (i < mid && j < to) {
        x2 = xs2[i];
        y2 = xs2[j];
        c = fromOrdering(compare2(x2)(y2));
        if (c > 0) {
          xs1[k++] = y2;
          ++j;
        } else {
          xs1[k++] = x2;
          ++i;
        }
      }
      while (i < mid) {
        xs1[k++] = xs2[i++];
      }
      while (j < to) {
        xs1[k++] = xs2[j++];
      }
    }
    return function(compare2) {
      return function(fromOrdering) {
        return function(xs) {
          return function() {
            if (xs.length < 2)
              return xs;
            mergeFromTo(compare2, fromOrdering, xs, xs.slice(0), 0, xs.length);
            return xs;
          };
        };
      };
    };
  }();

  // output/Data.Tuple/index.js
  var Tuple = /* @__PURE__ */ function() {
    function Tuple2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Tuple2.create = function(value0) {
      return function(value1) {
        return new Tuple2(value0, value1);
      };
    };
    return Tuple2;
  }();
  var snd = function(v) {
    return v.value1;
  };

  // output/Unsafe.Coerce/foreign.js
  var unsafeCoerce2 = function(x2) {
    return x2;
  };

  // output/Data.Traversable/foreign.js
  var traverseArrayImpl = function() {
    function array1(a) {
      return [a];
    }
    function array2(a) {
      return function(b) {
        return [a, b];
      };
    }
    function array3(a) {
      return function(b) {
        return function(c) {
          return [a, b, c];
        };
      };
    }
    function concat2(xs) {
      return function(ys) {
        return xs.concat(ys);
      };
    }
    return function(apply2) {
      return function(map4) {
        return function(pure3) {
          return function(f) {
            return function(array) {
              function go2(bot, top4) {
                switch (top4 - bot) {
                  case 0:
                    return pure3([]);
                  case 1:
                    return map4(array1)(f(array[bot]));
                  case 2:
                    return apply2(map4(array2)(f(array[bot])))(f(array[bot + 1]));
                  case 3:
                    return apply2(apply2(map4(array3)(f(array[bot])))(f(array[bot + 1])))(f(array[bot + 2]));
                  default:
                    var pivot = bot + Math.floor((top4 - bot) / 4) * 2;
                    return apply2(map4(concat2)(go2(bot, pivot)))(go2(pivot, top4));
                }
              }
              return go2(0, array.length);
            };
          };
        };
      };
    };
  }();

  // output/Data.List.Types/index.js
  var Nil = /* @__PURE__ */ function() {
    function Nil3() {
    }
    ;
    Nil3.value = new Nil3();
    return Nil3;
  }();
  var Cons = /* @__PURE__ */ function() {
    function Cons3(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Cons3.create = function(value0) {
      return function(value1) {
        return new Cons3(value0, value1);
      };
    };
    return Cons3;
  }();

  // output/Partial.Unsafe/foreign.js
  var _unsafePartial = function(f) {
    return f();
  };

  // output/Partial/foreign.js
  var _crashWith = function(msg) {
    throw new Error(msg);
  };

  // output/Partial/index.js
  var crashWith = function() {
    return _crashWith;
  };

  // output/Partial.Unsafe/index.js
  var crashWith2 = /* @__PURE__ */ crashWith();
  var unsafePartial = _unsafePartial;
  var unsafeCrashWith = function(msg) {
    return unsafePartial(function() {
      return crashWith2(msg);
    });
  };

  // output/Data.Map.Internal/index.js
  var Leaf = /* @__PURE__ */ function() {
    function Leaf2() {
    }
    ;
    Leaf2.value = new Leaf2();
    return Leaf2;
  }();
  var Two = /* @__PURE__ */ function() {
    function Two2(value0, value1, value22, value32) {
      this.value0 = value0;
      this.value1 = value1;
      this.value2 = value22;
      this.value3 = value32;
    }
    ;
    Two2.create = function(value0) {
      return function(value1) {
        return function(value22) {
          return function(value32) {
            return new Two2(value0, value1, value22, value32);
          };
        };
      };
    };
    return Two2;
  }();
  var Three = /* @__PURE__ */ function() {
    function Three2(value0, value1, value22, value32, value42, value52, value62) {
      this.value0 = value0;
      this.value1 = value1;
      this.value2 = value22;
      this.value3 = value32;
      this.value4 = value42;
      this.value5 = value52;
      this.value6 = value62;
    }
    ;
    Three2.create = function(value0) {
      return function(value1) {
        return function(value22) {
          return function(value32) {
            return function(value42) {
              return function(value52) {
                return function(value62) {
                  return new Three2(value0, value1, value22, value32, value42, value52, value62);
                };
              };
            };
          };
        };
      };
    };
    return Three2;
  }();
  var TwoLeft = /* @__PURE__ */ function() {
    function TwoLeft2(value0, value1, value22) {
      this.value0 = value0;
      this.value1 = value1;
      this.value2 = value22;
    }
    ;
    TwoLeft2.create = function(value0) {
      return function(value1) {
        return function(value22) {
          return new TwoLeft2(value0, value1, value22);
        };
      };
    };
    return TwoLeft2;
  }();
  var TwoRight = /* @__PURE__ */ function() {
    function TwoRight2(value0, value1, value22) {
      this.value0 = value0;
      this.value1 = value1;
      this.value2 = value22;
    }
    ;
    TwoRight2.create = function(value0) {
      return function(value1) {
        return function(value22) {
          return new TwoRight2(value0, value1, value22);
        };
      };
    };
    return TwoRight2;
  }();
  var ThreeLeft = /* @__PURE__ */ function() {
    function ThreeLeft2(value0, value1, value22, value32, value42, value52) {
      this.value0 = value0;
      this.value1 = value1;
      this.value2 = value22;
      this.value3 = value32;
      this.value4 = value42;
      this.value5 = value52;
    }
    ;
    ThreeLeft2.create = function(value0) {
      return function(value1) {
        return function(value22) {
          return function(value32) {
            return function(value42) {
              return function(value52) {
                return new ThreeLeft2(value0, value1, value22, value32, value42, value52);
              };
            };
          };
        };
      };
    };
    return ThreeLeft2;
  }();
  var ThreeMiddle = /* @__PURE__ */ function() {
    function ThreeMiddle2(value0, value1, value22, value32, value42, value52) {
      this.value0 = value0;
      this.value1 = value1;
      this.value2 = value22;
      this.value3 = value32;
      this.value4 = value42;
      this.value5 = value52;
    }
    ;
    ThreeMiddle2.create = function(value0) {
      return function(value1) {
        return function(value22) {
          return function(value32) {
            return function(value42) {
              return function(value52) {
                return new ThreeMiddle2(value0, value1, value22, value32, value42, value52);
              };
            };
          };
        };
      };
    };
    return ThreeMiddle2;
  }();
  var ThreeRight = /* @__PURE__ */ function() {
    function ThreeRight2(value0, value1, value22, value32, value42, value52) {
      this.value0 = value0;
      this.value1 = value1;
      this.value2 = value22;
      this.value3 = value32;
      this.value4 = value42;
      this.value5 = value52;
    }
    ;
    ThreeRight2.create = function(value0) {
      return function(value1) {
        return function(value22) {
          return function(value32) {
            return function(value42) {
              return function(value52) {
                return new ThreeRight2(value0, value1, value22, value32, value42, value52);
              };
            };
          };
        };
      };
    };
    return ThreeRight2;
  }();
  var KickUp = /* @__PURE__ */ function() {
    function KickUp2(value0, value1, value22, value32) {
      this.value0 = value0;
      this.value1 = value1;
      this.value2 = value22;
      this.value3 = value32;
    }
    ;
    KickUp2.create = function(value0) {
      return function(value1) {
        return function(value22) {
          return function(value32) {
            return new KickUp2(value0, value1, value22, value32);
          };
        };
      };
    };
    return KickUp2;
  }();
  var lookup = function(dictOrd) {
    var compare2 = compare(dictOrd);
    return function(k) {
      var go2 = function($copy_v) {
        var $tco_done = false;
        var $tco_result;
        function $tco_loop(v) {
          if (v instanceof Leaf) {
            $tco_done = true;
            return Nothing.value;
          }
          ;
          if (v instanceof Two) {
            var v2 = compare2(k)(v.value1);
            if (v2 instanceof EQ) {
              $tco_done = true;
              return new Just(v.value2);
            }
            ;
            if (v2 instanceof LT) {
              $copy_v = v.value0;
              return;
            }
            ;
            $copy_v = v.value3;
            return;
          }
          ;
          if (v instanceof Three) {
            var v3 = compare2(k)(v.value1);
            if (v3 instanceof EQ) {
              $tco_done = true;
              return new Just(v.value2);
            }
            ;
            var v4 = compare2(k)(v.value4);
            if (v4 instanceof EQ) {
              $tco_done = true;
              return new Just(v.value5);
            }
            ;
            if (v3 instanceof LT) {
              $copy_v = v.value0;
              return;
            }
            ;
            if (v4 instanceof GT) {
              $copy_v = v.value6;
              return;
            }
            ;
            $copy_v = v.value3;
            return;
          }
          ;
          throw new Error("Failed pattern match at Data.Map.Internal (line 241, column 5 - line 241, column 22): " + [v.constructor.name]);
        }
        ;
        while (!$tco_done) {
          $tco_result = $tco_loop($copy_v);
        }
        ;
        return $tco_result;
      };
      return go2;
    };
  };
  var member = function(dictOrd) {
    var lookup1 = lookup(dictOrd);
    return function(k) {
      return function(m) {
        return isJust(lookup1(k)(m));
      };
    };
  };
  var fromZipper = function($copy_dictOrd) {
    return function($copy_v) {
      return function($copy_v1) {
        var $tco_var_dictOrd = $copy_dictOrd;
        var $tco_var_v = $copy_v;
        var $tco_done = false;
        var $tco_result;
        function $tco_loop(dictOrd, v, v1) {
          if (v instanceof Nil) {
            $tco_done = true;
            return v1;
          }
          ;
          if (v instanceof Cons) {
            if (v.value0 instanceof TwoLeft) {
              $tco_var_dictOrd = dictOrd;
              $tco_var_v = v.value1;
              $copy_v1 = new Two(v1, v.value0.value0, v.value0.value1, v.value0.value2);
              return;
            }
            ;
            if (v.value0 instanceof TwoRight) {
              $tco_var_dictOrd = dictOrd;
              $tco_var_v = v.value1;
              $copy_v1 = new Two(v.value0.value0, v.value0.value1, v.value0.value2, v1);
              return;
            }
            ;
            if (v.value0 instanceof ThreeLeft) {
              $tco_var_dictOrd = dictOrd;
              $tco_var_v = v.value1;
              $copy_v1 = new Three(v1, v.value0.value0, v.value0.value1, v.value0.value2, v.value0.value3, v.value0.value4, v.value0.value5);
              return;
            }
            ;
            if (v.value0 instanceof ThreeMiddle) {
              $tco_var_dictOrd = dictOrd;
              $tco_var_v = v.value1;
              $copy_v1 = new Three(v.value0.value0, v.value0.value1, v.value0.value2, v1, v.value0.value3, v.value0.value4, v.value0.value5);
              return;
            }
            ;
            if (v.value0 instanceof ThreeRight) {
              $tco_var_dictOrd = dictOrd;
              $tco_var_v = v.value1;
              $copy_v1 = new Three(v.value0.value0, v.value0.value1, v.value0.value2, v.value0.value3, v.value0.value4, v.value0.value5, v1);
              return;
            }
            ;
            throw new Error("Failed pattern match at Data.Map.Internal (line 462, column 3 - line 467, column 88): " + [v.value0.constructor.name]);
          }
          ;
          throw new Error("Failed pattern match at Data.Map.Internal (line 459, column 1 - line 459, column 80): " + [v.constructor.name, v1.constructor.name]);
        }
        ;
        while (!$tco_done) {
          $tco_result = $tco_loop($tco_var_dictOrd, $tco_var_v, $copy_v1);
        }
        ;
        return $tco_result;
      };
    };
  };
  var insert = function(dictOrd) {
    var fromZipper1 = fromZipper(dictOrd);
    var compare2 = compare(dictOrd);
    return function(k) {
      return function(v) {
        var up = function($copy_v1) {
          return function($copy_v2) {
            var $tco_var_v1 = $copy_v1;
            var $tco_done = false;
            var $tco_result;
            function $tco_loop(v1, v2) {
              if (v1 instanceof Nil) {
                $tco_done = true;
                return new Two(v2.value0, v2.value1, v2.value2, v2.value3);
              }
              ;
              if (v1 instanceof Cons) {
                if (v1.value0 instanceof TwoLeft) {
                  $tco_done = true;
                  return fromZipper1(v1.value1)(new Three(v2.value0, v2.value1, v2.value2, v2.value3, v1.value0.value0, v1.value0.value1, v1.value0.value2));
                }
                ;
                if (v1.value0 instanceof TwoRight) {
                  $tco_done = true;
                  return fromZipper1(v1.value1)(new Three(v1.value0.value0, v1.value0.value1, v1.value0.value2, v2.value0, v2.value1, v2.value2, v2.value3));
                }
                ;
                if (v1.value0 instanceof ThreeLeft) {
                  $tco_var_v1 = v1.value1;
                  $copy_v2 = new KickUp(new Two(v2.value0, v2.value1, v2.value2, v2.value3), v1.value0.value0, v1.value0.value1, new Two(v1.value0.value2, v1.value0.value3, v1.value0.value4, v1.value0.value5));
                  return;
                }
                ;
                if (v1.value0 instanceof ThreeMiddle) {
                  $tco_var_v1 = v1.value1;
                  $copy_v2 = new KickUp(new Two(v1.value0.value0, v1.value0.value1, v1.value0.value2, v2.value0), v2.value1, v2.value2, new Two(v2.value3, v1.value0.value3, v1.value0.value4, v1.value0.value5));
                  return;
                }
                ;
                if (v1.value0 instanceof ThreeRight) {
                  $tco_var_v1 = v1.value1;
                  $copy_v2 = new KickUp(new Two(v1.value0.value0, v1.value0.value1, v1.value0.value2, v1.value0.value3), v1.value0.value4, v1.value0.value5, new Two(v2.value0, v2.value1, v2.value2, v2.value3));
                  return;
                }
                ;
                throw new Error("Failed pattern match at Data.Map.Internal (line 498, column 5 - line 503, column 108): " + [v1.value0.constructor.name, v2.constructor.name]);
              }
              ;
              throw new Error("Failed pattern match at Data.Map.Internal (line 495, column 3 - line 495, column 56): " + [v1.constructor.name, v2.constructor.name]);
            }
            ;
            while (!$tco_done) {
              $tco_result = $tco_loop($tco_var_v1, $copy_v2);
            }
            ;
            return $tco_result;
          };
        };
        var down = function($copy_v1) {
          return function($copy_v2) {
            var $tco_var_v1 = $copy_v1;
            var $tco_done1 = false;
            var $tco_result;
            function $tco_loop(v1, v2) {
              if (v2 instanceof Leaf) {
                $tco_done1 = true;
                return up(v1)(new KickUp(Leaf.value, k, v, Leaf.value));
              }
              ;
              if (v2 instanceof Two) {
                var v3 = compare2(k)(v2.value1);
                if (v3 instanceof EQ) {
                  $tco_done1 = true;
                  return fromZipper1(v1)(new Two(v2.value0, k, v, v2.value3));
                }
                ;
                if (v3 instanceof LT) {
                  $tco_var_v1 = new Cons(new TwoLeft(v2.value1, v2.value2, v2.value3), v1);
                  $copy_v2 = v2.value0;
                  return;
                }
                ;
                $tco_var_v1 = new Cons(new TwoRight(v2.value0, v2.value1, v2.value2), v1);
                $copy_v2 = v2.value3;
                return;
              }
              ;
              if (v2 instanceof Three) {
                var v3 = compare2(k)(v2.value1);
                if (v3 instanceof EQ) {
                  $tco_done1 = true;
                  return fromZipper1(v1)(new Three(v2.value0, k, v, v2.value3, v2.value4, v2.value5, v2.value6));
                }
                ;
                var v4 = compare2(k)(v2.value4);
                if (v4 instanceof EQ) {
                  $tco_done1 = true;
                  return fromZipper1(v1)(new Three(v2.value0, v2.value1, v2.value2, v2.value3, k, v, v2.value6));
                }
                ;
                if (v3 instanceof LT) {
                  $tco_var_v1 = new Cons(new ThreeLeft(v2.value1, v2.value2, v2.value3, v2.value4, v2.value5, v2.value6), v1);
                  $copy_v2 = v2.value0;
                  return;
                }
                ;
                if (v3 instanceof GT && v4 instanceof LT) {
                  $tco_var_v1 = new Cons(new ThreeMiddle(v2.value0, v2.value1, v2.value2, v2.value4, v2.value5, v2.value6), v1);
                  $copy_v2 = v2.value3;
                  return;
                }
                ;
                $tco_var_v1 = new Cons(new ThreeRight(v2.value0, v2.value1, v2.value2, v2.value3, v2.value4, v2.value5), v1);
                $copy_v2 = v2.value6;
                return;
              }
              ;
              throw new Error("Failed pattern match at Data.Map.Internal (line 478, column 3 - line 478, column 55): " + [v1.constructor.name, v2.constructor.name]);
            }
            ;
            while (!$tco_done1) {
              $tco_result = $tco_loop($tco_var_v1, $copy_v2);
            }
            ;
            return $tco_result;
          };
        };
        return down(Nil.value);
      };
    };
  };
  var pop = function(dictOrd) {
    var fromZipper1 = fromZipper(dictOrd);
    var compare2 = compare(dictOrd);
    return function(k) {
      var up = function($copy_ctxs) {
        return function($copy_tree) {
          var $tco_var_ctxs = $copy_ctxs;
          var $tco_done = false;
          var $tco_result;
          function $tco_loop(ctxs, tree) {
            if (ctxs instanceof Nil) {
              $tco_done = true;
              return tree;
            }
            ;
            if (ctxs instanceof Cons) {
              if (ctxs.value0 instanceof TwoLeft && (ctxs.value0.value2 instanceof Leaf && tree instanceof Leaf)) {
                $tco_done = true;
                return fromZipper1(ctxs.value1)(new Two(Leaf.value, ctxs.value0.value0, ctxs.value0.value1, Leaf.value));
              }
              ;
              if (ctxs.value0 instanceof TwoRight && (ctxs.value0.value0 instanceof Leaf && tree instanceof Leaf)) {
                $tco_done = true;
                return fromZipper1(ctxs.value1)(new Two(Leaf.value, ctxs.value0.value1, ctxs.value0.value2, Leaf.value));
              }
              ;
              if (ctxs.value0 instanceof TwoLeft && ctxs.value0.value2 instanceof Two) {
                $tco_var_ctxs = ctxs.value1;
                $copy_tree = new Three(tree, ctxs.value0.value0, ctxs.value0.value1, ctxs.value0.value2.value0, ctxs.value0.value2.value1, ctxs.value0.value2.value2, ctxs.value0.value2.value3);
                return;
              }
              ;
              if (ctxs.value0 instanceof TwoRight && ctxs.value0.value0 instanceof Two) {
                $tco_var_ctxs = ctxs.value1;
                $copy_tree = new Three(ctxs.value0.value0.value0, ctxs.value0.value0.value1, ctxs.value0.value0.value2, ctxs.value0.value0.value3, ctxs.value0.value1, ctxs.value0.value2, tree);
                return;
              }
              ;
              if (ctxs.value0 instanceof TwoLeft && ctxs.value0.value2 instanceof Three) {
                $tco_done = true;
                return fromZipper1(ctxs.value1)(new Two(new Two(tree, ctxs.value0.value0, ctxs.value0.value1, ctxs.value0.value2.value0), ctxs.value0.value2.value1, ctxs.value0.value2.value2, new Two(ctxs.value0.value2.value3, ctxs.value0.value2.value4, ctxs.value0.value2.value5, ctxs.value0.value2.value6)));
              }
              ;
              if (ctxs.value0 instanceof TwoRight && ctxs.value0.value0 instanceof Three) {
                $tco_done = true;
                return fromZipper1(ctxs.value1)(new Two(new Two(ctxs.value0.value0.value0, ctxs.value0.value0.value1, ctxs.value0.value0.value2, ctxs.value0.value0.value3), ctxs.value0.value0.value4, ctxs.value0.value0.value5, new Two(ctxs.value0.value0.value6, ctxs.value0.value1, ctxs.value0.value2, tree)));
              }
              ;
              if (ctxs.value0 instanceof ThreeLeft && (ctxs.value0.value2 instanceof Leaf && (ctxs.value0.value5 instanceof Leaf && tree instanceof Leaf))) {
                $tco_done = true;
                return fromZipper1(ctxs.value1)(new Three(Leaf.value, ctxs.value0.value0, ctxs.value0.value1, Leaf.value, ctxs.value0.value3, ctxs.value0.value4, Leaf.value));
              }
              ;
              if (ctxs.value0 instanceof ThreeMiddle && (ctxs.value0.value0 instanceof Leaf && (ctxs.value0.value5 instanceof Leaf && tree instanceof Leaf))) {
                $tco_done = true;
                return fromZipper1(ctxs.value1)(new Three(Leaf.value, ctxs.value0.value1, ctxs.value0.value2, Leaf.value, ctxs.value0.value3, ctxs.value0.value4, Leaf.value));
              }
              ;
              if (ctxs.value0 instanceof ThreeRight && (ctxs.value0.value0 instanceof Leaf && (ctxs.value0.value3 instanceof Leaf && tree instanceof Leaf))) {
                $tco_done = true;
                return fromZipper1(ctxs.value1)(new Three(Leaf.value, ctxs.value0.value1, ctxs.value0.value2, Leaf.value, ctxs.value0.value4, ctxs.value0.value5, Leaf.value));
              }
              ;
              if (ctxs.value0 instanceof ThreeLeft && ctxs.value0.value2 instanceof Two) {
                $tco_done = true;
                return fromZipper1(ctxs.value1)(new Two(new Three(tree, ctxs.value0.value0, ctxs.value0.value1, ctxs.value0.value2.value0, ctxs.value0.value2.value1, ctxs.value0.value2.value2, ctxs.value0.value2.value3), ctxs.value0.value3, ctxs.value0.value4, ctxs.value0.value5));
              }
              ;
              if (ctxs.value0 instanceof ThreeMiddle && ctxs.value0.value0 instanceof Two) {
                $tco_done = true;
                return fromZipper1(ctxs.value1)(new Two(new Three(ctxs.value0.value0.value0, ctxs.value0.value0.value1, ctxs.value0.value0.value2, ctxs.value0.value0.value3, ctxs.value0.value1, ctxs.value0.value2, tree), ctxs.value0.value3, ctxs.value0.value4, ctxs.value0.value5));
              }
              ;
              if (ctxs.value0 instanceof ThreeMiddle && ctxs.value0.value5 instanceof Two) {
                $tco_done = true;
                return fromZipper1(ctxs.value1)(new Two(ctxs.value0.value0, ctxs.value0.value1, ctxs.value0.value2, new Three(tree, ctxs.value0.value3, ctxs.value0.value4, ctxs.value0.value5.value0, ctxs.value0.value5.value1, ctxs.value0.value5.value2, ctxs.value0.value5.value3)));
              }
              ;
              if (ctxs.value0 instanceof ThreeRight && ctxs.value0.value3 instanceof Two) {
                $tco_done = true;
                return fromZipper1(ctxs.value1)(new Two(ctxs.value0.value0, ctxs.value0.value1, ctxs.value0.value2, new Three(ctxs.value0.value3.value0, ctxs.value0.value3.value1, ctxs.value0.value3.value2, ctxs.value0.value3.value3, ctxs.value0.value4, ctxs.value0.value5, tree)));
              }
              ;
              if (ctxs.value0 instanceof ThreeLeft && ctxs.value0.value2 instanceof Three) {
                $tco_done = true;
                return fromZipper1(ctxs.value1)(new Three(new Two(tree, ctxs.value0.value0, ctxs.value0.value1, ctxs.value0.value2.value0), ctxs.value0.value2.value1, ctxs.value0.value2.value2, new Two(ctxs.value0.value2.value3, ctxs.value0.value2.value4, ctxs.value0.value2.value5, ctxs.value0.value2.value6), ctxs.value0.value3, ctxs.value0.value4, ctxs.value0.value5));
              }
              ;
              if (ctxs.value0 instanceof ThreeMiddle && ctxs.value0.value0 instanceof Three) {
                $tco_done = true;
                return fromZipper1(ctxs.value1)(new Three(new Two(ctxs.value0.value0.value0, ctxs.value0.value0.value1, ctxs.value0.value0.value2, ctxs.value0.value0.value3), ctxs.value0.value0.value4, ctxs.value0.value0.value5, new Two(ctxs.value0.value0.value6, ctxs.value0.value1, ctxs.value0.value2, tree), ctxs.value0.value3, ctxs.value0.value4, ctxs.value0.value5));
              }
              ;
              if (ctxs.value0 instanceof ThreeMiddle && ctxs.value0.value5 instanceof Three) {
                $tco_done = true;
                return fromZipper1(ctxs.value1)(new Three(ctxs.value0.value0, ctxs.value0.value1, ctxs.value0.value2, new Two(tree, ctxs.value0.value3, ctxs.value0.value4, ctxs.value0.value5.value0), ctxs.value0.value5.value1, ctxs.value0.value5.value2, new Two(ctxs.value0.value5.value3, ctxs.value0.value5.value4, ctxs.value0.value5.value5, ctxs.value0.value5.value6)));
              }
              ;
              if (ctxs.value0 instanceof ThreeRight && ctxs.value0.value3 instanceof Three) {
                $tco_done = true;
                return fromZipper1(ctxs.value1)(new Three(ctxs.value0.value0, ctxs.value0.value1, ctxs.value0.value2, new Two(ctxs.value0.value3.value0, ctxs.value0.value3.value1, ctxs.value0.value3.value2, ctxs.value0.value3.value3), ctxs.value0.value3.value4, ctxs.value0.value3.value5, new Two(ctxs.value0.value3.value6, ctxs.value0.value4, ctxs.value0.value5, tree)));
              }
              ;
              $tco_done = true;
              return unsafeCrashWith("The impossible happened in partial function `up`.");
            }
            ;
            throw new Error("Failed pattern match at Data.Map.Internal (line 552, column 5 - line 573, column 86): " + [ctxs.constructor.name]);
          }
          ;
          while (!$tco_done) {
            $tco_result = $tco_loop($tco_var_ctxs, $copy_tree);
          }
          ;
          return $tco_result;
        };
      };
      var removeMaxNode = function($copy_ctx) {
        return function($copy_m) {
          var $tco_var_ctx = $copy_ctx;
          var $tco_done1 = false;
          var $tco_result;
          function $tco_loop(ctx, m) {
            if (m instanceof Two && (m.value0 instanceof Leaf && m.value3 instanceof Leaf)) {
              $tco_done1 = true;
              return up(ctx)(Leaf.value);
            }
            ;
            if (m instanceof Two) {
              $tco_var_ctx = new Cons(new TwoRight(m.value0, m.value1, m.value2), ctx);
              $copy_m = m.value3;
              return;
            }
            ;
            if (m instanceof Three && (m.value0 instanceof Leaf && (m.value3 instanceof Leaf && m.value6 instanceof Leaf))) {
              $tco_done1 = true;
              return up(new Cons(new TwoRight(Leaf.value, m.value1, m.value2), ctx))(Leaf.value);
            }
            ;
            if (m instanceof Three) {
              $tco_var_ctx = new Cons(new ThreeRight(m.value0, m.value1, m.value2, m.value3, m.value4, m.value5), ctx);
              $copy_m = m.value6;
              return;
            }
            ;
            $tco_done1 = true;
            return unsafeCrashWith("The impossible happened in partial function `removeMaxNode`.");
          }
          ;
          while (!$tco_done1) {
            $tco_result = $tco_loop($tco_var_ctx, $copy_m);
          }
          ;
          return $tco_result;
        };
      };
      var maxNode = function($copy_m) {
        var $tco_done2 = false;
        var $tco_result;
        function $tco_loop(m) {
          if (m instanceof Two && m.value3 instanceof Leaf) {
            $tco_done2 = true;
            return {
              key: m.value1,
              value: m.value2
            };
          }
          ;
          if (m instanceof Two) {
            $copy_m = m.value3;
            return;
          }
          ;
          if (m instanceof Three && m.value6 instanceof Leaf) {
            $tco_done2 = true;
            return {
              key: m.value4,
              value: m.value5
            };
          }
          ;
          if (m instanceof Three) {
            $copy_m = m.value6;
            return;
          }
          ;
          $tco_done2 = true;
          return unsafeCrashWith("The impossible happened in partial function `maxNode`.");
        }
        ;
        while (!$tco_done2) {
          $tco_result = $tco_loop($copy_m);
        }
        ;
        return $tco_result;
      };
      var down = function($copy_ctx) {
        return function($copy_m) {
          var $tco_var_ctx = $copy_ctx;
          var $tco_done3 = false;
          var $tco_result;
          function $tco_loop(ctx, m) {
            if (m instanceof Leaf) {
              $tco_done3 = true;
              return Nothing.value;
            }
            ;
            if (m instanceof Two) {
              var v = compare2(k)(m.value1);
              if (m.value3 instanceof Leaf && v instanceof EQ) {
                $tco_done3 = true;
                return new Just(new Tuple(m.value2, up(ctx)(Leaf.value)));
              }
              ;
              if (v instanceof EQ) {
                var max6 = maxNode(m.value0);
                $tco_done3 = true;
                return new Just(new Tuple(m.value2, removeMaxNode(new Cons(new TwoLeft(max6.key, max6.value, m.value3), ctx))(m.value0)));
              }
              ;
              if (v instanceof LT) {
                $tco_var_ctx = new Cons(new TwoLeft(m.value1, m.value2, m.value3), ctx);
                $copy_m = m.value0;
                return;
              }
              ;
              $tco_var_ctx = new Cons(new TwoRight(m.value0, m.value1, m.value2), ctx);
              $copy_m = m.value3;
              return;
            }
            ;
            if (m instanceof Three) {
              var leaves = function() {
                if (m.value0 instanceof Leaf && (m.value3 instanceof Leaf && m.value6 instanceof Leaf)) {
                  return true;
                }
                ;
                return false;
              }();
              var v = compare2(k)(m.value4);
              var v3 = compare2(k)(m.value1);
              if (leaves && v3 instanceof EQ) {
                $tco_done3 = true;
                return new Just(new Tuple(m.value2, fromZipper1(ctx)(new Two(Leaf.value, m.value4, m.value5, Leaf.value))));
              }
              ;
              if (leaves && v instanceof EQ) {
                $tco_done3 = true;
                return new Just(new Tuple(m.value5, fromZipper1(ctx)(new Two(Leaf.value, m.value1, m.value2, Leaf.value))));
              }
              ;
              if (v3 instanceof EQ) {
                var max6 = maxNode(m.value0);
                $tco_done3 = true;
                return new Just(new Tuple(m.value2, removeMaxNode(new Cons(new ThreeLeft(max6.key, max6.value, m.value3, m.value4, m.value5, m.value6), ctx))(m.value0)));
              }
              ;
              if (v instanceof EQ) {
                var max6 = maxNode(m.value3);
                $tco_done3 = true;
                return new Just(new Tuple(m.value5, removeMaxNode(new Cons(new ThreeMiddle(m.value0, m.value1, m.value2, max6.key, max6.value, m.value6), ctx))(m.value3)));
              }
              ;
              if (v3 instanceof LT) {
                $tco_var_ctx = new Cons(new ThreeLeft(m.value1, m.value2, m.value3, m.value4, m.value5, m.value6), ctx);
                $copy_m = m.value0;
                return;
              }
              ;
              if (v3 instanceof GT && v instanceof LT) {
                $tco_var_ctx = new Cons(new ThreeMiddle(m.value0, m.value1, m.value2, m.value4, m.value5, m.value6), ctx);
                $copy_m = m.value3;
                return;
              }
              ;
              $tco_var_ctx = new Cons(new ThreeRight(m.value0, m.value1, m.value2, m.value3, m.value4, m.value5), ctx);
              $copy_m = m.value6;
              return;
            }
            ;
            throw new Error("Failed pattern match at Data.Map.Internal (line 525, column 16 - line 548, column 80): " + [m.constructor.name]);
          }
          ;
          while (!$tco_done3) {
            $tco_result = $tco_loop($tco_var_ctx, $copy_m);
          }
          ;
          return $tco_result;
        };
      };
      return down(Nil.value);
    };
  };
  var empty2 = /* @__PURE__ */ function() {
    return Leaf.value;
  }();
  var $$delete = function(dictOrd) {
    var pop1 = pop(dictOrd);
    return function(k) {
      return function(m) {
        return maybe(m)(snd)(pop1(k)(m));
      };
    };
  };

  // output/Data.Set/index.js
  var member2 = function(dictOrd) {
    var member1 = member(dictOrd);
    return function(a) {
      return function(v) {
        return member1(a)(v);
      };
    };
  };
  var insert2 = function(dictOrd) {
    var insert1 = insert(dictOrd);
    return function(a) {
      return function(v) {
        return insert1(a)(unit)(v);
      };
    };
  };
  var empty3 = empty2;
  var $$delete2 = function(dictOrd) {
    var delete1 = $$delete(dictOrd);
    return function(a) {
      return function(v) {
        return delete1(a)(v);
      };
    };
  };

  // output/Effect.Timer/foreign.js
  function setTimeoutImpl(ms) {
    return function(fn) {
      return function() {
        return setTimeout(fn, ms);
      };
    };
  }
  function clearTimeoutImpl(id2) {
    return function() {
      clearTimeout(id2);
    };
  }

  // output/Effect.Timer/index.js
  var setTimeout2 = setTimeoutImpl;
  var clearTimeout2 = clearTimeoutImpl;

  // output/Foreign.Object/foreign.js
  function _copyST(m) {
    return function() {
      var r = {};
      for (var k in m) {
        if (hasOwnProperty.call(m, k)) {
          r[k] = m[k];
        }
      }
      return r;
    };
  }
  var empty4 = {};
  function runST(f) {
    return f();
  }
  function all3(f) {
    return function(m) {
      for (var k in m) {
        if (hasOwnProperty.call(m, k) && !f(k)(m[k]))
          return false;
      }
      return true;
    };
  }
  function _lookup(no, yes, k, m) {
    return k in m ? yes(m[k]) : no;
  }
  function toArrayWithKey(f) {
    return function(m) {
      var r = [];
      for (var k in m) {
        if (hasOwnProperty.call(m, k)) {
          r.push(f(k)(m[k]));
        }
      }
      return r;
    };
  }
  var keys2 = Object.keys || toArrayWithKey(function(k) {
    return function() {
      return k;
    };
  });

  // output/Data.Function.Uncurried/foreign.js
  var runFn4 = function(fn) {
    return function(a) {
      return function(b) {
        return function(c) {
          return function(d) {
            return fn(a, b, c, d);
          };
        };
      };
    };
  };

  // output/Foreign.Object.ST/foreign.js
  function poke2(k) {
    return function(v) {
      return function(m) {
        return function() {
          m[k] = v;
          return m;
        };
      };
    };
  }
  var deleteImpl = function(k) {
    return function(m) {
      return function() {
        delete m[k];
        return m;
      };
    };
  };

  // output/Foreign.Object/index.js
  var thawST = _copyST;
  var mutate = function(f) {
    return function(m) {
      return runST(function __do() {
        var s = thawST(m)();
        f(s)();
        return s;
      });
    };
  };
  var lookup2 = /* @__PURE__ */ function() {
    return runFn4(_lookup)(Nothing.value)(Just.create);
  }();
  var isEmpty2 = /* @__PURE__ */ all3(function(v) {
    return function(v1) {
      return false;
    };
  });
  var insert3 = function(k) {
    return function(v) {
      return mutate(poke2(k)(v));
    };
  };
  var $$delete3 = function(k) {
    return mutate(deleteImpl(k));
  };

  // output/Gamepad/foreign.js
  var accessors = navigator.userAgent.includes("Firefox") ? {
    Up(gamepad) {
      return gamepad.axes[7] < 0;
    },
    Down(gamepad) {
      return gamepad.axes[7] > 0;
    },
    Left(gamepad) {
      return gamepad.axes[6] < 0;
    },
    Right(gamepad) {
      return gamepad.axes[6] > 0;
    },
    LeftAxisH(gamepad) {
      return gamepad.axes[3];
    },
    LeftAxisV(gamepad) {
      return gamepad.axes[4];
    }
  } : {
    Up(gamepad) {
      return gamepad.buttons[12].value;
    },
    Down(gamepad) {
      return gamepad.buttons[13].value;
    },
    Left(gamepad) {
      return gamepad.buttons[14].value;
    },
    Right(gamepad) {
      return gamepad.buttons[15].value;
    },
    LeftAxisH(gamepad) {
      return gamepad.axes[2];
    },
    LeftAxisV(gamepad) {
      return gamepad.axes[3];
    }
  };
  var subscribers = /* @__PURE__ */ new Set();
  var looping = false;
  window.addEventListener("gamepadconnected", (e) => {
    const {
      index: index2,
      id: id2,
      buttons: buttons2,
      axes
    } = e.gamepad;
    console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.", index2, id2, buttons2.length, axes.length);
    if (!looping && subscribers.size !== 0) {
      looping = true;
      requestAnimationFrame(loop);
    }
  });
  window.addEventListener("gamepaddisconnected", () => {
    console.log("Gamepad disconnected");
  });
  function loop() {
    if (subscribers.size === 0) {
      looping = false;
      return;
    }
    const gamepads = navigator.getGamepads();
    subscribers.forEach((subscriberObject) => {
      let value12 = 0;
      for (const gamepad of gamepads) {
        if (gamepad && gamepad.connected) {
          const gamepadValue = subscriberObject.getter(gamepad);
          if (gamepadValue) {
            value12 = gamepadValue;
          }
        }
      }
      if (value12 !== subscriberObject.previousValue) {
        subscriberObject.previousValue = value12;
        subscriberObject.subscriber(value12)();
      }
    });
    if (gamepads.length === 0) {
      looping = false;
      return;
    }
    requestAnimationFrame(loop);
  }
  var subscribe = (control) => (subscriber) => () => {
    const subscriberObject = {
      subscriber,
      getter: accessors[control.constructor.name],
      previousValue: 0
    };
    subscribers.add(subscriberObject);
    if (!looping && navigator.getGamepads().length) {
      looping = true;
      requestAnimationFrame(loop);
    }
    return () => {
      subscribers.delete(subscriberObject);
    };
  };

  // output/Gamepad/index.js
  var Up = /* @__PURE__ */ function() {
    function Up2() {
    }
    ;
    Up2.value = new Up2();
    return Up2;
  }();
  var Down = /* @__PURE__ */ function() {
    function Down2() {
    }
    ;
    Down2.value = new Down2();
    return Down2;
  }();
  var Left2 = /* @__PURE__ */ function() {
    function Left3() {
    }
    ;
    Left3.value = new Left3();
    return Left3;
  }();
  var Right2 = /* @__PURE__ */ function() {
    function Right3() {
    }
    ;
    Right3.value = new Right3();
    return Right3;
  }();
  var LeftAxisH = /* @__PURE__ */ function() {
    function LeftAxisH2() {
    }
    ;
    LeftAxisH2.value = new LeftAxisH2();
    return LeftAxisH2;
  }();
  var LeftAxisV = /* @__PURE__ */ function() {
    function LeftAxisV2() {
    }
    ;
    LeftAxisV2.value = new LeftAxisV2();
    return LeftAxisV2;
  }();

  // output/Keyboard/foreign.js
  var keys3 = {};
  function update(key, isDown) {
    if (!(key in keys3)) {
      return false;
    }
    keys3[key].forEach((subscriber) => {
      if (subscriber.isDown !== isDown) {
        subscriber.isDown = isDown;
        try {
          subscriber.subscriber(isDown)();
        } catch (e) {
          console.error(e);
        }
      }
    });
    return true;
  }
  window.addEventListener("blur", () => {
    Object.keys(keys3).forEach((key) => {
      update(key, false);
    });
  });
  window.addEventListener("keydown", (e) => {
    if (update(e.code, true)) {
      e.preventDefault();
    }
  });
  window.addEventListener("keyup", (e) => {
    if (update(e.code, false)) {
      e.preventDefault();
    }
  });
  var subscribe2 = (key) => (subscriber) => () => {
    if (!(key in keys3)) {
      keys3[key] = /* @__PURE__ */ new Set();
    }
    const subscriberObject = { subscriber, isDown: false };
    keys3[key].add(subscriberObject);
    return () => {
      if (!(key in keys3)) {
        return;
      }
      keys3[key].delete(subscriberObject);
      if (keys3[key].size === 0) {
        delete keys3[key];
      }
    };
  };

  // output/PointerEvents/foreign.js
  var setPointerCapture = (pointerId2) => (element) => () => {
    element.setPointerCapture(pointerId2);
  };

  // output/USB/foreign.js
  var INTERFACE_NUMBER = 2;
  var ENDPOINT_OUT = 4;
  async function connect() {
    const filters = [
      { vendorId: 9025, productId: 32823 }
      // Arduino Micro
    ];
    const device2 = await navigator.usb.requestDevice({ filters });
    await device2.open();
    await device2.selectConfiguration(1);
    await device2.claimInterface(INTERFACE_NUMBER);
    await device2.selectAlternateInterface(INTERFACE_NUMBER, 0);
    await device2.controlTransferOut({
      requestType: "class",
      recipient: "interface",
      request: 34,
      value: 1,
      index: INTERFACE_NUMBER
    });
    return device2;
  }
  var device;
  var send = (byte) => () => {
    if (!device) {
      device = connect();
    }
    device.then((device2) => device2.transferOut(ENDPOINT_OUT, new Uint8Array([byte & 255]))).catch((e) => {
      console.error("Failed to send value via USB", e);
    });
  };

  // output/Util/foreign.js
  var nextTick = (callback) => () => {
    Promise.resolve().then(callback);
  };

  // output/Util/index.js
  var clearTimeoutRef = function(timeoutRef) {
    return function __do() {
      var timer = read(timeoutRef)();
      if (timer instanceof Just) {
        clearTimeout2(timer.value0)();
        return write(Nothing.value)(timeoutRef)();
      }
      ;
      if (timer instanceof Nothing) {
        return unit;
      }
      ;
      throw new Error("Failed pattern match at Util (line 15, column 3 - line 19, column 25): " + [timer.constructor.name]);
    };
  };

  // output/Web.CSSOMView.Element/foreign.js
  function getBoundingClientRect(element) {
    return function() {
      return element.getBoundingClientRect();
    };
  }
  function getter(property) {
    return function(element) {
      return function() {
        return element[property];
      };
    };
  }
  var scrollTop = getter("scrollTop");
  var scrollLeft = getter("scrollLeft");
  var scrollWidth = getter("scrollWidth");
  var scrollHeight = getter("scrollHeight");
  var clientTop = getter("clientTop");
  var clientLeft = getter("clientLeft");
  var clientWidth = getter("clientWidth");
  var clientHeight = getter("clientHeight");

  // output/Web.DOM.Element/foreign.js
  var getProp = function(name14) {
    return function(doctype) {
      return doctype[name14];
    };
  };
  var _namespaceURI = getProp("namespaceURI");
  var _prefix = getProp("prefix");
  var localName = getProp("localName");
  var tagName = getProp("tagName");
  function setAttribute(name14) {
    return function(value12) {
      return function(element) {
        return function() {
          element.setAttribute(name14, value12);
        };
      };
    };
  }

  // output/Data.Nullable/foreign.js
  function nullable(a, r, f) {
    return a == null ? r : f(a);
  }

  // output/Data.Nullable/index.js
  var toMaybe = function(n) {
    return nullable(n, Nothing.value, Just.create);
  };

  // output/Web.DOM.ParentNode/foreign.js
  var getEffProp = function(name14) {
    return function(node) {
      return function() {
        return node[name14];
      };
    };
  };
  var children = getEffProp("children");
  var _firstElementChild = getEffProp("firstElementChild");
  var _lastElementChild = getEffProp("lastElementChild");
  var childElementCount = getEffProp("childElementCount");
  function _querySelector(selector) {
    return function(node) {
      return function() {
        return node.querySelector(selector);
      };
    };
  }

  // output/Web.DOM.ParentNode/index.js
  var map2 = /* @__PURE__ */ map(functorEffect);
  var querySelector = function(qs) {
    var $2 = map2(toMaybe);
    var $3 = _querySelector(qs);
    return function($4) {
      return $2($3($4));
    };
  };

  // output/Web.Internal.FFI/foreign.js
  function _unsafeReadProtoTagged(nothing, just, name14, value12) {
    if (typeof window !== "undefined") {
      var ty = window[name14];
      if (ty != null && value12 instanceof ty) {
        return just(value12);
      }
    }
    var obj = value12;
    while (obj != null) {
      var proto = Object.getPrototypeOf(obj);
      var constructorName = proto.constructor.name;
      if (constructorName === name14) {
        return just(value12);
      } else if (constructorName === "Object") {
        return nothing;
      }
      obj = proto;
    }
    return nothing;
  }

  // output/Web.Internal.FFI/index.js
  var unsafeReadProtoTagged = function(name14) {
    return function(value12) {
      return _unsafeReadProtoTagged(Nothing.value, Just.create, name14, value12);
    };
  };

  // output/Web.DOM.Element/index.js
  var toEventTarget = unsafeCoerce2;

  // output/Web.Event.EventTarget/foreign.js
  function eventListener(fn) {
    return function() {
      return function(event) {
        return fn(event)();
      };
    };
  }
  function addEventListener(type) {
    return function(listener) {
      return function(useCapture) {
        return function(target5) {
          return function() {
            return target5.addEventListener(type, listener, useCapture);
          };
        };
      };
    };
  }

  // output/Web.Geometry.DOMRect/foreign.js
  function getter2(property) {
    return function(domRect) {
      return domRect[property];
    };
  }
  var x = getter2("x");
  var y = getter2("y");
  var width = getter2("width");
  var height = getter2("height");
  var top3 = getter2("top");
  var right = getter2("right");
  var bottom3 = getter2("bottom");
  var left = getter2("left");

  // output/Web.HTML/foreign.js
  var windowImpl = function() {
    return window;
  };

  // output/Web.HTML.HTMLDocument/index.js
  var toParentNode = unsafeCoerce2;

  // output/Web.HTML.Window/foreign.js
  function document(window2) {
    return function() {
      return window2.document;
    };
  }

  // output/Web.PointerEvents.PointerEvent/foreign.js
  function clientX(e) {
    return e.clientX;
  }
  function clientY(e) {
    return e.clientY;
  }
  function pointerId(e) {
    return e.pointerId;
  }

  // output/Web.PointerEvents.PointerEvent/index.js
  var fromEvent = /* @__PURE__ */ unsafeReadProtoTagged("PointerEvent");

  // output/Standalone/index.js
  var fromJust2 = /* @__PURE__ */ fromJust();
  var map3 = /* @__PURE__ */ map(functorEffect);
  var bind2 = /* @__PURE__ */ bind(bindEffect);
  var pure2 = /* @__PURE__ */ pure(applicativeEffect);
  var when2 = /* @__PURE__ */ when(applicativeEffect);
  var member3 = /* @__PURE__ */ member2(ordString);
  var unless2 = /* @__PURE__ */ unless(applicativeEffect);
  var insert4 = /* @__PURE__ */ insert2(ordString);
  var $$delete4 = /* @__PURE__ */ $$delete2(ordString);
  var show2 = /* @__PURE__ */ show(showNumber);
  var JoystickCoordinates = /* @__PURE__ */ function() {
    function JoystickCoordinates2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    JoystickCoordinates2.create = function(value0) {
      return function(value1) {
        return new JoystickCoordinates2(value0, value1);
      };
    };
    return JoystickCoordinates2;
  }();
  var unsafeFromJust = function(x2) {
    return fromJust2(x2);
  };
  var setControls2 = function(h) {
    return function(v) {
      var distance = h * h + v * v;
      var realDistance = function() {
        var $46 = distance > 1;
        if ($46) {
          return 1;
        }
        ;
        return distance;
      }();
      var angle = atan2(h)(v);
      var cl = cos(angle - pi / 4);
      var left2 = round2((-cl * realDistance + 1) * 8);
      var cr = cos(angle + pi / 4);
      var right2 = round2((-cr * realDistance + 1) * 8);
      var $$byte = (function() {
        var $47 = left2 > 15;
        if ($47) {
          return 15;
        }
        ;
        return left2;
      }() * 16 | 0) + function() {
        var $48 = right2 > 15;
        if ($48) {
          return 15;
        }
        ;
        return right2;
      }() | 0;
      return send($$byte);
    };
  };
  var querySelector2 = function(selector) {
    var $105 = map3(unsafeFromJust);
    var $106 = querySelector(selector);
    return function($107) {
      return $105($106($107));
    };
  };
  var initJoystickControl = function(up) {
    return function(down) {
      return function(left2) {
        return function(right2) {
          return function(axisH) {
            return function(axisV) {
              return function(set) {
                var setFromGamepad = function(gamepadStateRef) {
                  return function __do() {
                    var v = read(gamepadStateRef)();
                    return set(new JoystickCoordinates(v.value0, v.value1))();
                  };
                };
                var joystickCoordinatesFromEvent = function(joystick) {
                  return function(event) {
                    return function __do() {
                      var rect = getBoundingClientRect(joystick)();
                      var offsetY = toNumber(clientY(event)) - top3(rect);
                      var y2 = (150 - offsetY) / 100;
                      var offsetX = toNumber(clientX(event)) - left(rect);
                      var x2 = (offsetX - 150) / 100;
                      return new JoystickCoordinates(x2, y2);
                    };
                  };
                };
                var onPointerDown = function(joystick) {
                  return function(setByMouseRef) {
                    return function(event) {
                      return function __do() {
                        var v = joystickCoordinatesFromEvent(joystick)(event)();
                        return when2(v.value0 * v.value0 + v.value1 * v.value1 <= 2.1)(function __do2() {
                          setPointerCapture(pointerId(event))(joystick)();
                          set(new JoystickCoordinates(v.value0, v.value1))();
                          return write(true)(setByMouseRef)();
                        })();
                      };
                    };
                  };
                };
                var onPointerMove = function(joystick) {
                  return function(setByMouseRef) {
                    return function(event) {
                      return bind2(read(setByMouseRef))(flip(when2)(bind2(joystickCoordinatesFromEvent(joystick)(event))(set)));
                    };
                  };
                };
                var hasKeyboardInputs = function(keyboardState) {
                  return member3(up)(keyboardState) || (member3(down)(keyboardState) || (member3(left2)(keyboardState) || member3(right2)(keyboardState)));
                };
                var setFromGamepadDeferred = function(setByMouseRef) {
                  return function(keyboardStateRef) {
                    return function(gamepadStateRef) {
                      return function(gamepadDeferredRef) {
                        return function __do() {
                          var setByMouse = read(setByMouseRef)();
                          var keyboardState = read(keyboardStateRef)();
                          var gamepadDeferred = read(gamepadDeferredRef)();
                          return unless2(gamepadDeferred)(function __do2() {
                            write(true)(gamepadDeferredRef)();
                            return nextTick(function __do3() {
                              write(false)(gamepadDeferredRef)();
                              return when2(!setByMouse && !hasKeyboardInputs(keyboardState))(setFromGamepad(gamepadStateRef))();
                            })();
                          })();
                        };
                      };
                    };
                  };
                };
                var setFromKeyboard = function(keyboardStateRef) {
                  return function(gamepadStateRef) {
                    return function __do() {
                      var keyboardState = read(keyboardStateRef)();
                      var $55 = hasKeyboardInputs(keyboardState);
                      if ($55) {
                        var upDown = function() {
                          var $56 = member3(up)(keyboardState);
                          if ($56) {
                            return 1;
                          }
                          ;
                          return 0;
                        }();
                        var rightDown = function() {
                          var $57 = member3(right2)(keyboardState);
                          if ($57) {
                            return 1;
                          }
                          ;
                          return 0;
                        }();
                        var leftDown = function() {
                          var $58 = member3(left2)(keyboardState);
                          if ($58) {
                            return 1;
                          }
                          ;
                          return 0;
                        }();
                        var x2 = rightDown - leftDown;
                        var downDown = function() {
                          var $59 = member3(down)(keyboardState);
                          if ($59) {
                            return 1;
                          }
                          ;
                          return 0;
                        }();
                        var y2 = upDown - downDown;
                        return set(new JoystickCoordinates(x2, y2))();
                      }
                      ;
                      return setFromGamepad(gamepadStateRef)();
                    };
                  };
                };
                var onKeyChange = function(setByMouseRef) {
                  return function(keyboardStateRef) {
                    return function(gamepadStateRef) {
                      return function(key) {
                        return function(isDown) {
                          return function __do() {
                            var keyboardState = read(keyboardStateRef)();
                            if (isDown) {
                              return unless2(member3(key)(keyboardState))(function __do2() {
                                write(insert4(key)(keyboardState))(keyboardStateRef)();
                                var setByMouse = read(setByMouseRef)();
                                return unless2(setByMouse)(setFromKeyboard(keyboardStateRef)(gamepadStateRef))();
                              })();
                            }
                            ;
                            return when2(member3(key)(keyboardState))(function __do2() {
                              write($$delete4(key)(keyboardState))(keyboardStateRef)();
                              var setByMouse = read(setByMouseRef)();
                              return unless2(setByMouse)(setFromKeyboard(keyboardStateRef)(gamepadStateRef))();
                            })();
                          };
                        };
                      };
                    };
                  };
                };
                var resetMouseInput = function(setByMouseRef) {
                  return function(keyboardStateRef) {
                    return function(gamepadStateRef) {
                      return function __do() {
                        write(false)(setByMouseRef)();
                        return setFromKeyboard(keyboardStateRef)(gamepadStateRef)();
                      };
                    };
                  };
                };
                var onPointerUp = function(joystick) {
                  return function(setByMouseRef) {
                    return function(keyboardStateRef) {
                      return function(gamepadStateRef) {
                        return function(event) {
                          return bind2(read(setByMouseRef))(flip(when2)(resetMouseInput(setByMouseRef)(keyboardStateRef)(gamepadStateRef)));
                        };
                      };
                    };
                  };
                };
                var addPointerEventListener = function(eventName) {
                  return function(handler) {
                    return function(target5) {
                      return function __do() {
                        var listener = eventListener(function($108) {
                          return handler(unsafeFromJust(fromEvent($108)));
                        })();
                        return addEventListener(eventName)(listener)(false)(toEventTarget(target5))();
                      };
                    };
                  };
                };
                return function __do() {
                  var document2 = bind2(windowImpl)(document)();
                  var joystick = querySelector2("#joystick")(toParentNode(document2))();
                  var setByMouseRef = $$new(false)();
                  var keyboardStateRef = $$new(empty3)();
                  var gamepadDeferredRef = $$new(false)();
                  var gamepadStateRef = $$new(new Tuple(0, 0))();
                  addPointerEventListener("pointerdown")(onPointerDown(joystick)(setByMouseRef))(joystick)();
                  addPointerEventListener("pointermove")(onPointerMove(joystick)(setByMouseRef))(joystick)();
                  addPointerEventListener("pointerup")(onPointerUp(joystick)(setByMouseRef)(keyboardStateRef)(gamepadStateRef))(joystick)();
                  subscribe2(up)(onKeyChange(setByMouseRef)(keyboardStateRef)(gamepadStateRef)(up))();
                  subscribe2(down)(onKeyChange(setByMouseRef)(keyboardStateRef)(gamepadStateRef)(down))();
                  subscribe2(left2)(onKeyChange(setByMouseRef)(keyboardStateRef)(gamepadStateRef)(left2))();
                  subscribe2(right2)(onKeyChange(setByMouseRef)(keyboardStateRef)(gamepadStateRef)(right2))();
                  subscribe(axisH)(function(value12) {
                    return function __do2() {
                      var v = read(gamepadStateRef)();
                      write(new Tuple(value12, v.value1))(gamepadStateRef)();
                      return setFromGamepadDeferred(setByMouseRef)(keyboardStateRef)(gamepadStateRef)(gamepadDeferredRef)();
                    };
                  })();
                  subscribe(axisV)(function(value12) {
                    return function __do2() {
                      var v = read(gamepadStateRef)();
                      write(new Tuple(v.value0, -value12))(gamepadStateRef)();
                      return setFromGamepadDeferred(setByMouseRef)(keyboardStateRef)(gamepadStateRef)(gamepadDeferredRef)();
                    };
                  })();
                  return unit;
                };
              };
            };
          };
        };
      };
    };
  };
  var initJoystick = function(getControl$prime) {
    var setY = getControl$prime("joystickV");
    var setX = getControl$prime("joystickH");
    var set = function(joystickElement) {
      return function(zeroTimeoutRef) {
        return function(v) {
          var distance = v.value0 * v.value0 + v.value1 * v.value1;
          var v1 = function() {
            var $70 = distance < 0.1;
            if ($70) {
              return new JoystickCoordinates(0, 0);
            }
            ;
            var $71 = distance > 1;
            if ($71) {
              var angle = atan2(v.value1)(v.value0);
              return new JoystickCoordinates(cos(angle), sin(angle));
            }
            ;
            return v;
          }();
          var canvasY = 150 - v1.value1 * 100;
          var canvasX = v1.value0 * 100 + 150;
          return function __do() {
            setAttribute("cx")(show2(canvasX))(joystickElement)();
            setAttribute("cy")(show2(canvasY))(joystickElement)();
            setX(new Just(v1.value0))();
            setY(new Just(v1.value1))();
            clearTimeoutRef(zeroTimeoutRef)();
            return when2(v1.value0 <= 0 && v1.value1 <= 0)(function __do2() {
              var timeoutId = setTimeout2(1e3)(function __do3() {
                setX(Nothing.value)();
                return setY(Nothing.value)();
              })();
              return write(new Just(timeoutId))(zeroTimeoutRef)();
            })();
          };
        };
      };
    };
    return function __do() {
      var document2 = bind2(windowImpl)(document)();
      var joystickElement = querySelector2("#joystick-position")(toParentNode(document2))();
      var zeroTimeoutRef = $$new(Nothing.value)();
      return set(joystickElement)(zeroTimeoutRef);
    };
  };
  var initControls = function(sendMessage$prime) {
    var sendControls = function(timeoutRef) {
      return function(nextCommandRef) {
        return function __do() {
          clearTimeoutRef(timeoutRef)();
          var nextCommand = read(nextCommandRef)();
          return unless2(isEmpty2(nextCommand))(function __do2() {
            sendMessage$prime(nextCommand)();
            var timeoutId = setTimeout2(400)(sendControls(timeoutRef)(nextCommandRef))();
            return write(new Just(timeoutId))(timeoutRef)();
          })();
        };
      };
    };
    var setControl = function(v) {
      return function(v1) {
        return function(v2) {
          return function(v3) {
            return function(v4) {
              if (v4 instanceof Just) {
                return function __do() {
                  modify_(insert3(v3)(v4.value0))(v1)();
                  var needsSend = read(v2)();
                  return unless2(needsSend)(function __do2() {
                    write(true)(v2)();
                    return nextTick(function __do3() {
                      write(false)(v2)();
                      return sendControls(v)(v1)();
                    })();
                  })();
                };
              }
              ;
              if (v4 instanceof Nothing) {
                return modify_($$delete3(v3))(v1);
              }
              ;
              throw new Error("Failed pattern match at Standalone (line 75, column 5 - line 82, column 49): " + [v.constructor.name, v1.constructor.name, v2.constructor.name, v3.constructor.name, v4.constructor.name]);
            };
          };
        };
      };
    };
    return function __do() {
      var timeoutRef = $$new(Nothing.value)();
      var nextCommandRef = $$new(empty4)();
      var needsSendRef = $$new(false)();
      return setControl(timeoutRef)(nextCommandRef)(needsSendRef);
    };
  };
  var initActuatorControl = function(id2) {
    return function(up) {
      return function(down) {
        return function(gamepadUp) {
          return function(gamepadDown) {
            return function(set) {
              var setFromGamepad = function(gamepadStateRef) {
                return function __do() {
                  var v = read(gamepadStateRef)();
                  return set(v.value0 - v.value1)();
                };
              };
              var onPointerDown = function(target5) {
                return function(setByMouseRef) {
                  return function(value12) {
                    return function(event) {
                      return function __do() {
                        setPointerCapture(pointerId(event))(target5)();
                        set(value12)();
                        return write(true)(setByMouseRef)();
                      };
                    };
                  };
                };
              };
              var hasKeyboardInputs = function(keyboardState) {
                return member3(up)(keyboardState) || member3(down)(keyboardState);
              };
              var setFromGamepadDeferred = function(setByMouseRef) {
                return function(keyboardStateRef) {
                  return function(gamepadStateRef) {
                    return function(gamepadDeferredRef) {
                      return function __do() {
                        var setByMouse = read(setByMouseRef)();
                        var keyboardState = read(keyboardStateRef)();
                        var gamepadDeferred = read(gamepadDeferredRef)();
                        return unless2(gamepadDeferred)(function __do2() {
                          write(true)(gamepadDeferredRef)();
                          return nextTick(function __do3() {
                            write(false)(gamepadDeferredRef)();
                            return when2(!setByMouse && !hasKeyboardInputs(keyboardState))(setFromGamepad(gamepadStateRef))();
                          })();
                        })();
                      };
                    };
                  };
                };
              };
              var setFromKeyboard = function(keyboardStateRef) {
                return function(gamepadStateRef) {
                  return function __do() {
                    var keyboardState = read(keyboardStateRef)();
                    var $86 = hasKeyboardInputs(keyboardState);
                    if ($86) {
                      var upDown = function() {
                        var $87 = member3(up)(keyboardState);
                        if ($87) {
                          return 1;
                        }
                        ;
                        return 0;
                      }();
                      var downDown = function() {
                        var $88 = member3(down)(keyboardState);
                        if ($88) {
                          return 1;
                        }
                        ;
                        return 0;
                      }();
                      var value12 = upDown - downDown;
                      return set(value12)();
                    }
                    ;
                    return setFromGamepad(gamepadStateRef)();
                  };
                };
              };
              var onKeyChange = function(setByMouseRef) {
                return function(keyboardStateRef) {
                  return function(gamepadStateRef) {
                    return function(key) {
                      return function(isDown) {
                        return function __do() {
                          var keyboardState = read(keyboardStateRef)();
                          if (isDown) {
                            return unless2(member3(key)(keyboardState))(function __do2() {
                              write(insert4(key)(keyboardState))(keyboardStateRef)();
                              var setByMouse = read(setByMouseRef)();
                              return unless2(setByMouse)(setFromKeyboard(keyboardStateRef)(gamepadStateRef))();
                            })();
                          }
                          ;
                          return when2(member3(key)(keyboardState))(function __do2() {
                            write($$delete4(key)(keyboardState))(keyboardStateRef)();
                            var setByMouse = read(setByMouseRef)();
                            return unless2(setByMouse)(setFromKeyboard(keyboardStateRef)(gamepadStateRef))();
                          })();
                        };
                      };
                    };
                  };
                };
              };
              var resetMouseInput = function(setByMouseRef) {
                return function(keyboardStateRef) {
                  return function(gamepadStateRef) {
                    return function __do() {
                      write(false)(setByMouseRef)();
                      return setFromKeyboard(keyboardStateRef)(gamepadStateRef)();
                    };
                  };
                };
              };
              var onPointerUp = function(setByMouseRef) {
                return function(keyboardStateRef) {
                  return function(gamepadStateRef) {
                    return function(event) {
                      return bind2(read(setByMouseRef))(flip(when2)(resetMouseInput(setByMouseRef)(keyboardStateRef)(gamepadStateRef)));
                    };
                  };
                };
              };
              var addPointerEventListener = function(eventName) {
                return function(handler) {
                  return function(target5) {
                    return function __do() {
                      var listener = eventListener(function($109) {
                        return handler(unsafeFromJust(fromEvent($109)));
                      })();
                      return addEventListener(eventName)(listener)(false)(toEventTarget(target5))();
                    };
                  };
                };
              };
              return function __do() {
                var document2 = bind2(windowImpl)(document)();
                var actuatorUp = querySelector2("#" + (id2 + "-up"))(toParentNode(document2))();
                var actuatorDown = querySelector2("#" + (id2 + "-down"))(toParentNode(document2))();
                var setByMouseRef = $$new(false)();
                var keyboardStateRef = $$new(empty3)();
                var gamepadDeferredRef = $$new(false)();
                var gamepadStateRef = $$new(new Tuple(0, 0))();
                addPointerEventListener("pointerdown")(onPointerDown(actuatorUp)(setByMouseRef)(1))(actuatorUp)();
                addPointerEventListener("pointerdown")(onPointerDown(actuatorDown)(setByMouseRef)(-1))(actuatorDown)();
                addPointerEventListener("pointerup")(onPointerUp(setByMouseRef)(keyboardStateRef)(gamepadStateRef))(actuatorUp)();
                addPointerEventListener("pointerup")(onPointerUp(setByMouseRef)(keyboardStateRef)(gamepadStateRef))(actuatorDown)();
                subscribe2(up)(onKeyChange(setByMouseRef)(keyboardStateRef)(gamepadStateRef)(up))();
                subscribe2(down)(onKeyChange(setByMouseRef)(keyboardStateRef)(gamepadStateRef)(down))();
                subscribe(gamepadUp)(function(up1) {
                  return function __do2() {
                    var v = read(gamepadStateRef)();
                    write(new Tuple(up1, v.value1))(gamepadStateRef)();
                    return setFromGamepadDeferred(setByMouseRef)(keyboardStateRef)(gamepadStateRef)(gamepadDeferredRef)();
                  };
                })();
                subscribe(gamepadDown)(function(down1) {
                  return function __do2() {
                    var v = read(gamepadStateRef)();
                    write(new Tuple(v.value0, down1))(gamepadStateRef)();
                    return setFromGamepadDeferred(setByMouseRef)(keyboardStateRef)(gamepadStateRef)(gamepadDeferredRef)();
                  };
                })();
                return unit;
              };
            };
          };
        };
      };
    };
  };
  var initActuator = function(id2) {
    return function(getControl$prime) {
      var setActuator = getControl$prime(id2);
      var set = function(up) {
        return function(down) {
          return function(zeroTimeoutRef) {
            return function(value12) {
              return function __do() {
                clearTimeoutRef(zeroTimeoutRef)();
                setAttribute("fill")(function() {
                  var $96 = value12 > 0;
                  if ($96) {
                    return "orange";
                  }
                  ;
                  return "gray";
                }())(up)();
                setAttribute("fill")(function() {
                  var $97 = value12 < 0;
                  if ($97) {
                    return "orange";
                  }
                  ;
                  return "gray";
                }())(down)();
                setActuator(new Just(function() {
                  var $98 = value12 < 0;
                  if ($98) {
                    return -1;
                  }
                  ;
                  var $99 = value12 > 0;
                  if ($99) {
                    return 1;
                  }
                  ;
                  return 0;
                }()))();
                return when2(value12 === 0)(function __do2() {
                  var timeoutId = setTimeout2(1e3)(setActuator(Nothing.value))();
                  return write(new Just(timeoutId))(zeroTimeoutRef)();
                })();
              };
            };
          };
        };
      };
      return function __do() {
        var document2 = bind2(windowImpl)(document)();
        var up = querySelector2("#" + (id2 + "-up"))(toParentNode(document2))();
        var down = querySelector2("#" + (id2 + "-down"))(toParentNode(document2))();
        var zeroTimeoutRef = $$new(Nothing.value)();
        return set(up)(down)(zeroTimeoutRef);
      };
    };
  };
  var main = /* @__PURE__ */ function() {
    var set$prime = function(v) {
      return function(v1) {
        return function(v2) {
          if (v1 instanceof Just && v2 instanceof Just) {
            return v(v1.value0)(v2.value0);
          }
          ;
          return pure2(unit);
        };
      };
    };
    var set = function(setControls$prime) {
      return function(message) {
        return set$prime(setControls$prime)(lookup2("joystickH")(message))(lookup2("joystickV")(message));
      };
    };
    return function __do() {
      var setControl = initControls(set(setControls2))();
      var setJoystick = initJoystick(setControl)();
      var setPrimary = initActuator("primary")(setControl)();
      var setSecondary = initActuator("secondary")(setControl)();
      initJoystickControl("ArrowUp")("ArrowDown")("ArrowLeft")("ArrowRight")(LeftAxisH.value)(LeftAxisV.value)(setJoystick)();
      initActuatorControl("primary")("KeyW")("KeyS")(Up.value)(Down.value)(setPrimary)();
      initActuatorControl("secondary")("KeyA")("KeyD")(Left2.value)(Right2.value)(setSecondary)();
      return unit;
    };
  }();

  // <stdin>
  main();
})();
