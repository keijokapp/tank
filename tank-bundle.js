(() => {
  // output/Control.Semigroupoid/index.js
  var semigroupoidFn = {
    compose: function(f) {
      return function(g) {
        return function(x) {
          return f(g(x));
        };
      };
    }
  };

  // output/Control.Category/index.js
  var identity = function(dict) {
    return dict.identity;
  };
  var categoryFn = {
    identity: function(x) {
      return x;
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
  var applyFlipped = function(x) {
    return function(f) {
      return f(x);
    };
  };

  // output/Data.Unit/foreign.js
  var unit = void 0;

  // output/Data.Functor/index.js
  var map = function(dict) {
    return dict.map;
  };

  // output/Control.Apply/index.js
  var apply = function(dict) {
    return dict.apply;
  };
  var lift2 = function(dictApply) {
    var apply1 = apply(dictApply);
    var map5 = map(dictApply.Functor0());
    return function(f) {
      return function(a) {
        return function(b) {
          return apply1(map5(f)(a))(b);
        };
      };
    };
  };

  // output/Control.Applicative/index.js
  var pure = function(dict) {
    return dict.pure;
  };
  var when = function(dictApplicative) {
    var pure12 = pure(dictApplicative);
    return function(v) {
      return function(v1) {
        if (v) {
          return v1;
        }
        ;
        if (!v) {
          return pure12(unit);
        }
        ;
        throw new Error("Failed pattern match at Control.Applicative (line 63, column 1 - line 63, column 63): " + [v.constructor.name, v1.constructor.name]);
      };
    };
  };
  var liftA1 = function(dictApplicative) {
    var apply2 = apply(dictApplicative.Apply0());
    var pure12 = pure(dictApplicative);
    return function(f) {
      return function(a) {
        return apply2(pure12(f))(a);
      };
    };
  };

  // output/Control.Bind/index.js
  var identity2 = /* @__PURE__ */ identity(categoryFn);
  var bind = function(dict) {
    return dict.bind;
  };
  var join = function(dictBind) {
    var bind12 = bind(dictBind);
    return function(m) {
      return bind12(m)(identity2);
    };
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
        return function(x) {
          return function(y) {
            return x < y ? lt : x === y ? eq2 : gt;
          };
        };
      };
    };
  };
  var ordIntImpl = unsafeCompareImpl;

  // output/Data.Eq/foreign.js
  var refEq = function(r1) {
    return function(r2) {
      return r1 === r2;
    };
  };
  var eqIntImpl = refEq;

  // output/Data.Eq/index.js
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

  // output/Data.Semigroup/index.js
  var semigroupUnit = {
    append: function(v) {
      return function(v1) {
        return unit;
      };
    }
  };
  var append = function(dict) {
    return dict.append;
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
  var identity3 = /* @__PURE__ */ identity(categoryFn);
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
  var functorMaybe = {
    map: function(v) {
      return function(v1) {
        if (v1 instanceof Just) {
          return new Just(v(v1.value0));
        }
        ;
        return Nothing.value;
      };
    }
  };
  var map2 = /* @__PURE__ */ map(functorMaybe);
  var fromMaybe = function(a) {
    return maybe(a)(identity3);
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
  var applyMaybe = {
    apply: function(v) {
      return function(v1) {
        if (v instanceof Just) {
          return map2(v.value0)(v1);
        }
        ;
        if (v instanceof Nothing) {
          return Nothing.value;
        }
        ;
        throw new Error("Failed pattern match at Data.Maybe (line 67, column 1 - line 69, column 30): " + [v.constructor.name, v1.constructor.name]);
      };
    },
    Functor0: function() {
      return functorMaybe;
    }
  };
  var bindMaybe = {
    bind: function(v) {
      return function(v1) {
        if (v instanceof Just) {
          return v1(v.value0);
        }
        ;
        if (v instanceof Nothing) {
          return Nothing.value;
        }
        ;
        throw new Error("Failed pattern match at Data.Maybe (line 125, column 1 - line 127, column 28): " + [v.constructor.name, v1.constructor.name]);
      };
    },
    Apply0: function() {
      return applyMaybe;
    }
  };
  var applicativeMaybe = /* @__PURE__ */ function() {
    return {
      pure: Just.create,
      Apply0: function() {
        return applyMaybe;
      }
    };
  }();

  // output/Data.Number/foreign.js
  var isFiniteImpl = isFinite;
  var atan2 = function(y) {
    return function(x) {
      return Math.atan2(y, x);
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
  var unsafeClamp = function(x) {
    if (!isFiniteImpl(x)) {
      return 0;
    }
    ;
    if (x >= toNumber(top2)) {
      return top2;
    }
    ;
    if (x <= toNumber(bottom2)) {
      return bottom2;
    }
    ;
    if (otherwise) {
      return fromMaybe(0)(fromNumber(x));
    }
    ;
    throw new Error("Failed pattern match at Data.Int (line 72, column 1 - line 72, column 29): " + [x.constructor.name]);
  };
  var round2 = function($37) {
    return unsafeClamp(round($37));
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

  // output/Control.Monad/index.js
  var ap = function(dictMonad) {
    var bind4 = bind(dictMonad.Bind1());
    var pure4 = pure(dictMonad.Applicative0());
    return function(f) {
      return function(a) {
        return bind4(f)(function(f$prime) {
          return bind4(a)(function(a$prime) {
            return pure4(f$prime(a$prime));
          });
        });
      };
    };
  };

  // output/Data.Monoid/index.js
  var monoidUnit = {
    mempty: unit,
    Semigroup0: function() {
      return semigroupUnit;
    }
  };
  var mempty = function(dict) {
    return dict.mempty;
  };

  // output/Effect/index.js
  var $runtime_lazy = function(name15, moduleName, init) {
    var state2 = 0;
    var val;
    return function(lineNumber) {
      if (state2 === 2)
        return val;
      if (state2 === 1)
        throw new ReferenceError(name15 + " was needed before it finished initializing (module " + moduleName + ", line " + lineNumber + ")", moduleName, lineNumber);
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
  var applyEffect = /* @__PURE__ */ $lazy_applyEffect(23);
  var lift22 = /* @__PURE__ */ lift2(applyEffect);
  var semigroupEffect = function(dictSemigroup) {
    return {
      append: lift22(append(dictSemigroup))
    };
  };
  var monoidEffect = function(dictMonoid) {
    var semigroupEffect1 = semigroupEffect(dictMonoid.Semigroup0());
    return {
      mempty: pureE(mempty(dictMonoid)),
      Semigroup0: function() {
        return semigroupEffect1;
      }
    };
  };

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
  var empty = {};
  function runST(f) {
    return f();
  }
  function _foldM(bind4) {
    return function(f) {
      return function(mz) {
        return function(m) {
          var acc = mz;
          function g(k2) {
            return function(z) {
              return f(z)(k2)(m[k2]);
            };
          }
          for (var k in m) {
            if (hasOwnProperty.call(m, k)) {
              acc = bind4(acc)(g(k));
            }
          }
          return acc;
        };
      };
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
  var keys = Object.keys || toArrayWithKey(function(k) {
    return function() {
      return k;
    };
  });

  // output/Data.Either/index.js
  var Left = /* @__PURE__ */ function() {
    function Left2(value0) {
      this.value0 = value0;
    }
    ;
    Left2.create = function(value0) {
      return new Left2(value0);
    };
    return Left2;
  }();
  var Right = /* @__PURE__ */ function() {
    function Right2(value0) {
      this.value0 = value0;
    }
    ;
    Right2.create = function(value0) {
      return new Right2(value0);
    };
    return Right2;
  }();

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
  var write = function(val) {
    return function(ref) {
      return function() {
        ref.value = val;
      };
    };
  };

  // output/Effect.Ref/index.js
  var $$new = _new;

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
      var x;
      var y;
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
        x = xs2[i];
        y = xs2[j];
        c = fromOrdering(compare2(x)(y));
        if (c > 0) {
          xs1[k++] = y;
          ++j;
        } else {
          xs1[k++] = x;
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
      var x;
      var y;
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
        x = xs2[i];
        y = xs2[j];
        c = fromOrdering(compare2(x)(y));
        if (c > 0) {
          xs1[k++] = y;
          ++j;
        } else {
          xs1[k++] = x;
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
  var unsafeCoerce2 = function(x) {
    return x;
  };

  // output/Data.Foldable/index.js
  var foldr = function(dict) {
    return dict.foldr;
  };
  var foldl = function(dict) {
    return dict.foldl;
  };
  var foldMap = function(dict) {
    return dict.foldMap;
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
      return function(map5) {
        return function(pure4) {
          return function(f) {
            return function(array) {
              function go2(bot, top3) {
                switch (top3 - bot) {
                  case 0:
                    return pure4([]);
                  case 1:
                    return map5(array1)(f(array[bot]));
                  case 2:
                    return apply2(map5(array2)(f(array[bot])))(f(array[bot + 1]));
                  case 3:
                    return apply2(apply2(map5(array3)(f(array[bot])))(f(array[bot + 1])))(f(array[bot + 2]));
                  default:
                    var pivot = bot + Math.floor((top3 - bot) / 4) * 2;
                    return apply2(map5(concat2)(go2(bot, pivot)))(go2(pivot, top3));
                }
              }
              return go2(0, array.length);
            };
          };
        };
      };
    };
  }();

  // output/Data.FoldableWithIndex/index.js
  var foldrWithIndex = function(dict) {
    return dict.foldrWithIndex;
  };
  var foldlWithIndex = function(dict) {
    return dict.foldlWithIndex;
  };
  var foldWithIndexM = function(dictFoldableWithIndex) {
    var foldlWithIndex1 = foldlWithIndex(dictFoldableWithIndex);
    return function(dictMonad) {
      var bind4 = bind(dictMonad.Bind1());
      var pure4 = pure(dictMonad.Applicative0());
      return function(f) {
        return function(a0) {
          return foldlWithIndex1(function(i) {
            return function(ma) {
              return function(b) {
                return bind4(ma)(flip(f(i))(b));
              };
            };
          })(pure4(a0));
        };
      };
    };
  };
  var foldMapWithIndex = function(dict) {
    return dict.foldMapWithIndex;
  };

  // output/Data.Function.Uncurried/foreign.js
  var mkFn2 = function(fn) {
    return function(a, b) {
      return fn(a)(b);
    };
  };
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
  var lookup = /* @__PURE__ */ function() {
    return runFn4(_lookup)(Nothing.value)(Just.create);
  }();
  var insert = function(k) {
    return function(v) {
      return mutate(poke2(k)(v));
    };
  };
  var fold2 = /* @__PURE__ */ _foldM(applyFlipped);

  // output/Capture/foreign.js
  var videoSubscribers = /* @__PURE__ */ new Set();
  var audioSubscribers = /* @__PURE__ */ new Set();
  var setFlashLightTimeout = false;
  var pendingFlashLight = false;
  var pendingFacingMode = "environment";
  var videoTrack;
  var audioTrack;
  function setFlashLightImpl() {
    videoTrack.applyConstraints({
      advanced: [{ torch: pendingFlashLight }]
    }).catch((e) => {
      if (e.message !== "Unsupported constraint(s)") {
        console.error(e);
      }
    });
  }
  function captureVideo() {
    if (videoTrack) {
      videoTrack.stop();
    }
    videoTrack = null;
    if (setFlashLightTimeout !== null) {
      clearTimeout(setFlashLightTimeout);
      setFlashLightTimeout = null;
    }
    const facingMode = pendingFacingMode;
    navigator.mediaDevices.getUserMedia({ video: { facingMode } }).then((stream2) => {
      const streamTracks = stream2.getTracks();
      if (facingMode !== pendingFacingMode) {
        streamTracks.forEach((track) => {
          track.stop();
        });
        captureVideo();
        return;
      }
      if (streamTracks.length !== 1 || streamTracks[0].kind !== "video") {
        throw new Error("Unexpected track(s)");
      }
      setFlashLightTimeout = setTimeout(() => {
        setFlashLightImpl();
        setFlashLightTimeout = null;
      }, 500);
      [videoTrack] = streamTracks;
      videoSubscribers.forEach(({ subscriber }) => {
        try {
          subscriber(videoTrack)();
        } catch (e) {
          console.error(e);
        }
      });
    });
  }
  function captureAudio() {
    if (audioTrack) {
      audioTrack.stop();
    }
    audioTrack = null;
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream2) => {
      const streamTracks = stream2.getTracks();
      if (streamTracks.length !== 1 || streamTracks[0].kind !== "audio") {
        throw new Error("Unexpected track(s)");
      }
      [audioTrack] = streamTracks;
      audioSubscribers.forEach(({ subscriber }) => {
        try {
          subscriber(audioTrack)();
        } catch (e) {
          console.error(e);
        }
      });
    });
  }
  var subscribeVideo = (subscriber) => () => {
    const subscriberObject = { subscriber };
    videoSubscribers.add(subscriberObject);
    if (videoTrack === void 0) {
      captureVideo();
    } else if (videoTrack !== null) {
      Promise.resolve().then(() => {
        if (videoTrack && videoSubscribers.has(subscriberObject)) {
          subscriber(videoTrack)();
        }
      });
    }
    return () => {
      videoSubscribers.delete(subscriberObject);
    };
  };
  var subscribeAudio = (subscriber) => () => {
    const subscriberObject = { subscriber };
    audioSubscribers.add(subscriberObject);
    if (audioTrack === void 0) {
      captureAudio();
    } else if (audioTrack !== null) {
      Promise.resolve().then(() => {
        if (audioTrack && audioSubscribers.has(subscriberObject)) {
          subscriber(audioTrack)();
        }
      });
    }
    return () => {
      audioSubscribers.delete(subscriberObject);
    };
  };

  // output/Data.Argonaut.Core/foreign.js
  function _caseJson(isNull, isBool, isNum, isStr, isArr, isObj, j) {
    if (j == null)
      return isNull();
    else if (typeof j === "boolean")
      return isBool(j);
    else if (typeof j === "number")
      return isNum(j);
    else if (typeof j === "string")
      return isStr(j);
    else if (Object.prototype.toString.call(j) === "[object Array]")
      return isArr(j);
    else
      return isObj(j);
  }

  // output/Data.Argonaut.Core/index.js
  var verbJsonType = function(def) {
    return function(f) {
      return function(g) {
        return g(def)(f);
      };
    };
  };
  var toJsonType = /* @__PURE__ */ function() {
    return verbJsonType(Nothing.value)(Just.create);
  }();
  var caseJsonObject = function(d) {
    return function(f) {
      return function(j) {
        return _caseJson($$const(d), $$const(d), $$const(d), $$const(d), $$const(d), f, j);
      };
    };
  };
  var toObject = /* @__PURE__ */ toJsonType(caseJsonObject);
  var caseJsonNumber = function(d) {
    return function(f) {
      return function(j) {
        return _caseJson($$const(d), $$const(d), f, $$const(d), $$const(d), $$const(d), j);
      };
    };
  };

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
  var lookup2 = function(dictOrd) {
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
  var insert2 = function(dictOrd) {
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
  var foldableMap = {
    foldr: function(f) {
      return function(z) {
        return function(m) {
          if (m instanceof Leaf) {
            return z;
          }
          ;
          if (m instanceof Two) {
            return foldr(foldableMap)(f)(f(m.value2)(foldr(foldableMap)(f)(z)(m.value3)))(m.value0);
          }
          ;
          if (m instanceof Three) {
            return foldr(foldableMap)(f)(f(m.value2)(foldr(foldableMap)(f)(f(m.value5)(foldr(foldableMap)(f)(z)(m.value6)))(m.value3)))(m.value0);
          }
          ;
          throw new Error("Failed pattern match at Data.Map.Internal (line 133, column 17 - line 136, column 85): " + [m.constructor.name]);
        };
      };
    },
    foldl: function(f) {
      return function(z) {
        return function(m) {
          if (m instanceof Leaf) {
            return z;
          }
          ;
          if (m instanceof Two) {
            return foldl(foldableMap)(f)(f(foldl(foldableMap)(f)(z)(m.value0))(m.value2))(m.value3);
          }
          ;
          if (m instanceof Three) {
            return foldl(foldableMap)(f)(f(foldl(foldableMap)(f)(f(foldl(foldableMap)(f)(z)(m.value0))(m.value2))(m.value3))(m.value5))(m.value6);
          }
          ;
          throw new Error("Failed pattern match at Data.Map.Internal (line 137, column 17 - line 140, column 85): " + [m.constructor.name]);
        };
      };
    },
    foldMap: function(dictMonoid) {
      var mempty3 = mempty(dictMonoid);
      var append2 = append(dictMonoid.Semigroup0());
      return function(f) {
        return function(m) {
          if (m instanceof Leaf) {
            return mempty3;
          }
          ;
          if (m instanceof Two) {
            return append2(foldMap(foldableMap)(dictMonoid)(f)(m.value0))(append2(f(m.value2))(foldMap(foldableMap)(dictMonoid)(f)(m.value3)));
          }
          ;
          if (m instanceof Three) {
            return append2(foldMap(foldableMap)(dictMonoid)(f)(m.value0))(append2(f(m.value2))(append2(foldMap(foldableMap)(dictMonoid)(f)(m.value3))(append2(f(m.value5))(foldMap(foldableMap)(dictMonoid)(f)(m.value6)))));
          }
          ;
          throw new Error("Failed pattern match at Data.Map.Internal (line 141, column 17 - line 144, column 93): " + [m.constructor.name]);
        };
      };
    }
  };
  var foldableWithIndexMap = {
    foldrWithIndex: function(f) {
      return function(z) {
        return function(m) {
          if (m instanceof Leaf) {
            return z;
          }
          ;
          if (m instanceof Two) {
            return foldrWithIndex(foldableWithIndexMap)(f)(f(m.value1)(m.value2)(foldrWithIndex(foldableWithIndexMap)(f)(z)(m.value3)))(m.value0);
          }
          ;
          if (m instanceof Three) {
            return foldrWithIndex(foldableWithIndexMap)(f)(f(m.value1)(m.value2)(foldrWithIndex(foldableWithIndexMap)(f)(f(m.value4)(m.value5)(foldrWithIndex(foldableWithIndexMap)(f)(z)(m.value6)))(m.value3)))(m.value0);
          }
          ;
          throw new Error("Failed pattern match at Data.Map.Internal (line 147, column 26 - line 150, column 120): " + [m.constructor.name]);
        };
      };
    },
    foldlWithIndex: function(f) {
      return function(z) {
        return function(m) {
          if (m instanceof Leaf) {
            return z;
          }
          ;
          if (m instanceof Two) {
            return foldlWithIndex(foldableWithIndexMap)(f)(f(m.value1)(foldlWithIndex(foldableWithIndexMap)(f)(z)(m.value0))(m.value2))(m.value3);
          }
          ;
          if (m instanceof Three) {
            return foldlWithIndex(foldableWithIndexMap)(f)(f(m.value4)(foldlWithIndex(foldableWithIndexMap)(f)(f(m.value1)(foldlWithIndex(foldableWithIndexMap)(f)(z)(m.value0))(m.value2))(m.value3))(m.value5))(m.value6);
          }
          ;
          throw new Error("Failed pattern match at Data.Map.Internal (line 151, column 26 - line 154, column 120): " + [m.constructor.name]);
        };
      };
    },
    foldMapWithIndex: function(dictMonoid) {
      var mempty3 = mempty(dictMonoid);
      var append2 = append(dictMonoid.Semigroup0());
      return function(f) {
        return function(m) {
          if (m instanceof Leaf) {
            return mempty3;
          }
          ;
          if (m instanceof Two) {
            return append2(foldMapWithIndex(foldableWithIndexMap)(dictMonoid)(f)(m.value0))(append2(f(m.value1)(m.value2))(foldMapWithIndex(foldableWithIndexMap)(dictMonoid)(f)(m.value3)));
          }
          ;
          if (m instanceof Three) {
            return append2(foldMapWithIndex(foldableWithIndexMap)(dictMonoid)(f)(m.value0))(append2(f(m.value1)(m.value2))(append2(foldMapWithIndex(foldableWithIndexMap)(dictMonoid)(f)(m.value3))(append2(f(m.value4)(m.value5))(foldMapWithIndex(foldableWithIndexMap)(dictMonoid)(f)(m.value6)))));
          }
          ;
          throw new Error("Failed pattern match at Data.Map.Internal (line 155, column 26 - line 158, column 128): " + [m.constructor.name]);
        };
      };
    },
    Foldable0: function() {
      return foldableMap;
    }
  };
  var empty3 = /* @__PURE__ */ function() {
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

  // output/Effect.Console/foreign.js
  var warn = function(s) {
    return function() {
      console.warn(s);
    };
  };

  // output/Effect.Promise/foreign.js
  function promiseToEffectImpl(promise3, onFulfilled, onRejected) {
    return function() {
      return promise3.then((a) => onFulfilled(a)(), (err) => onRejected(err)());
    };
  }
  function promiseImpl(callback) {
    return new Promise((resolve, reject) => {
      callback((a) => function() {
        resolve(a);
      }, (err) => function() {
        reject(err);
      })();
    });
  }

  // output/Effect.Promise.Unsafe/foreign.js
  function undeferImpl(f) {
    return f();
  }

  // output/Effect.Promise.Unsafe/index.js
  var undefer = undeferImpl;

  // output/Effect.Promise/index.js
  var runPromise = function(onSucc) {
    return function(onErr) {
      return function(p) {
        var p1 = p();
        return promiseToEffectImpl(undefer(function() {
          return p1;
        }), onSucc, onErr);
      };
    };
  };
  var promise = function() {
    return function(k) {
      return promiseImpl(mkFn2(k));
    };
  };

  // output/Peer/foreign.js
  function createPeerImpl({
    createDataChannel: createDataChannel2,
    addVideoTransceiver: addVideoTransceiver2,
    addAudioTransceiver: addAudioTransceiver2,
    subscribeVideoTrack: subscribeVideoTrack2,
    subscribeAudioTrack: subscribeAudioTrack2,
    subscribeClose: subscribeClose2
  }, setPlaybackVideo2, setPlaybackAudio2, subscribeVideo2, subscribeAudio2) {
    const requestSubscribers = /* @__PURE__ */ new Set();
    const messageSubscribers = /* @__PURE__ */ new Set();
    let pendingSendVideo = false;
    let pendingSendAudio = false;
    const audioTransceiver = addAudioTransceiver2(null, { direction: "sendonly" });
    const videoTransceiver = addVideoTransceiver2(null, { direction: "sendonly" });
    subscribeVideoTrack2(setPlaybackVideo2);
    subscribeAudioTrack2(setPlaybackAudio2);
    subscribeClose2(() => {
      requestSubscribers.clear();
      messageSubscribers.clear();
    });
    const controlChannel = createDataChannel2("control", { id: 0, negotiated: true });
    controlChannel.onmessage = ({ data }) => {
      const message2 = JSON.parse(data);
      if ("request" in message2) {
        let sent = false;
        requestSubscribers.forEach(({ subscriber }) => {
          subscriber(message2.data, (data2) => {
            if (!sent) {
              sent = true;
              controlChannel.send(JSON.stringify({ response: message2.request, data: data2 }));
            }
          });
        });
      } else if (!("response" in message2)) {
        messageSubscribers.forEach(({ subscriber }) => {
          subscriber(message2.data);
        });
      }
    };
    return {
      setSendVideo(sendVideo) {
        pendingSendVideo = sendVideo;
        if (videoTransceiver.sender.track) {
          videoTransceiver.sender.track.stop();
        }
        videoTransceiver.sender.replaceTrack(null);
        if (sendVideo) {
          subscribeVideo2((track) => {
            if (pendingSendVideo) {
              videoTransceiver.sender.replaceTrack(track);
            } else {
              track.stop();
            }
          });
        }
      },
      setSendAudio(sendAudio) {
        pendingSendAudio = sendAudio;
        if (audioTransceiver.sender.track) {
          audioTransceiver.sender.track.stop();
        }
        audioTransceiver.sender.replaceTrack(null);
        if (sendAudio) {
          subscribeAudio2((track) => {
            if (pendingSendAudio) {
              audioTransceiver.sender.replaceTrack(track);
            } else {
              track.stop();
            }
          });
        }
      },
      sendMessage(data) {
        if (controlChannel.readyState === "open") {
          controlChannel.send(JSON.stringify({ data }));
        } else {
          console.warn("Control channel is not open");
        }
      },
      subscribeMessage(subscriber) {
        const subscriberObject = { subscriber };
        messageSubscribers.add(subscriberObject);
        return () => {
          messageSubscribers.delete(subscriberObject);
        };
      },
      sendRequest(data) {
        if (controlChannel.readyState !== "open") {
          return Promise.reject(new Error("Control channel is not open"));
        }
        const transaction = Math.random().toString(36).substr(2, 9);
        controlChannel.send(JSON.stringify({ request: transaction, data }));
        return new Promise((resolve) => {
          controlChannel.addEventListener("message", function onmessage({ data: data2 }) {
            const message2 = JSON.parse(data2);
            if (message2.response === transaction) {
              controlChannel.removeEventListener("message", onmessage);
              resolve(message2.data);
            }
          });
        });
      },
      subscribeRequest(subscriber) {
        const subscriberObject = { subscriber };
        requestSubscribers.add(subscriberObject);
        return () => {
          requestSubscribers.delete(subscriberObject);
        };
      }
    };
  }
  var createPeer = (pc) => (setPlaybackVideo2) => (setPlaybackAudio2) => (subscribeVideo2) => (subscribeAudio2) => () => createPeerImpl(
    pc,
    (track) => {
      setPlaybackVideo2(track)();
    },
    (track) => {
      setPlaybackAudio2(track)();
    },
    (subscriber) => subscribeVideo2((track) => () => subscriber(track))(),
    (subscriber) => subscribeAudio2((track) => () => subscriber(track))()
  );
  var setSendVideo = (peer) => (sendVideo) => () => peer.setSendVideo(sendVideo);
  var setSendAudio = (peer) => (sendAudio) => () => peer.setSendAudio(sendAudio);
  var subscribeMessage = (peer) => (subscriber) => () => peer.subscribeMessage((data) => subscriber(data)());
  var subscribeRequest = (peer) => (subscriber) => () => peer.subscribeRequest(
    (data, respond) => subscriber(data)((data2) => () => respond(data2))()
  );

  // output/PeerConnection/foreign.js
  function createPeerConnectionImpl(offer, sendSdp2, sendIce2, subscribeSdp2, subscribeIce2) {
    const videoTrackSubscribers = /* @__PURE__ */ new Set();
    const audioTrackSubscribers = /* @__PURE__ */ new Set();
    const closeSubscribers = /* @__PURE__ */ new Set();
    let ignoreOffer = false;
    let isSettingRemoteAnswerPending = false;
    let makingOffer = false;
    const pc = new RTCPeerConnection({
      iceServers: [{
        urls: ["turns:turn.keijo.ee:3478"],
        username: "immutable_bricks",
        credential: "BEtwbSeUbApfjqj9"
      }]
    });
    pc.addEventListener("connectionstatechange", () => {
      console.log("Connection state: %s", pc.connectionState);
      if (pc.connectionState === "failed") {
        pc.close();
      }
      if (pc.connectionState === "disconnected") {
        unsubscribeSdp();
        unsubscribeIce();
        videoTrackSubscribers.clear();
        audioTrackSubscribers.clear();
        closeSubscribers.clear();
        setTimeout(() => window.location.reload(), 4e3);
      }
    });
    pc.addEventListener("signalingstatechange", () => {
      console.log("Signaling state: %s", pc.signalingState);
    });
    pc.addEventListener("iceconnectionstatechange", () => {
      console.log("ICE connection state: %s", pc.iceConnectionState);
    });
    pc.addEventListener("track", ({ track }) => {
      console.log("Got %s track", track.kind);
      track.addEventListener("ended", () => {
        console.log("%s track has been ended", track.kind);
      });
      if (track.kind === "video") {
        videoTrackSubscribers.forEach(({ subscriber }) => {
          subscriber(track.clone());
        });
      }
      if (track.kind === "audio") {
        audioTrackSubscribers.forEach(({ subscriber }) => {
          subscriber(track.clone());
        });
      }
      track.stop();
    });
    pc.addEventListener("icecandidate", ({ candidate }) => {
      if (candidate) {
        const {
          component,
          address,
          port: port2,
          priority,
          relatedAddress,
          relatedPort,
          type,
          protocol: protocol2
        } = candidate;
        console.log("ICE candidate: (%s %s) %s %s %s:%s %s:%s", component, priority, type, protocol2, address, port2, relatedAddress, relatedPort);
        sendIce2(candidate);
      }
    });
    pc.addEventListener("negotiationneeded", () => {
      makingOffer = true;
      pc.setLocalDescription().then(() => {
        sendSdp2(pc.localDescription);
      }).catch((e) => {
        console.error(e);
        pc.close();
      }).then(() => {
        makingOffer = false;
      });
    });
    const unsubscribeSdp = subscribeSdp2((description) => {
      const readyForOffer = !makingOffer && (pc.signalingState === "stable" || isSettingRemoteAnswerPending);
      const offerCollision = description.type === "offer" && !readyForOffer;
      ignoreOffer = offer && offerCollision;
      if (ignoreOffer) {
        return;
      }
      isSettingRemoteAnswerPending = description.type === "answer";
      pc.setRemoteDescription(description).then(() => {
        isSettingRemoteAnswerPending = false;
        if (description.type === "offer") {
          pc.setLocalDescription().then(() => {
            sendSdp2(pc.localDescription);
          });
        }
      });
    });
    const unsubscribeIce = subscribeIce2((ice) => {
      if (ignoreOffer) {
        console.warn("[%s] Ignoring ICE candidate", pc.signalingState);
      } else {
        console.log("[%s] Adding ICE candidate", pc.signalingState);
        pc.addIceCandidate(ice).catch(console.error);
      }
    });
    if (offer) {
      console.log("[%s] Have remote %s", pc.signalingState, offer.type);
      pc.setRemoteDescription(offer).then(() => pc.setLocalDescription()).then(() => {
        sendSdp2(pc.localDescription);
      });
    }
    return {
      addVideoTransceiver(track, options2) {
        console.log("Adding video track");
        return pc.addTransceiver(track || "video", options2);
      },
      addAudioTransceiver(track, options2) {
        console.log("Adding audio track");
        return pc.addTransceiver(track || "audio", options2);
      },
      subscribeVideoTrack(subscriber) {
        const subscriberObject = { subscriber };
        videoTrackSubscribers.add(subscriberObject);
        return () => {
          videoTrackSubscribers.delete(subscriberObject);
        };
      },
      subscribeAudioTrack(subscriber) {
        const subscriberObject = { subscriber };
        audioTrackSubscribers.add(subscriberObject);
        return () => {
          audioTrackSubscribers.delete(subscriberObject);
        };
      },
      subscribeClose(subscriber) {
        const subscriberObject = { subscriber };
        closeSubscribers.add(subscriberObject);
        return () => {
          closeSubscribers.delete(subscriberObject);
        };
      },
      createDataChannel(label4, options2) {
        console.log("Creating data channel: %s", label4);
        const channel = pc.createDataChannel(label4, options2);
        channel.addEventListener("open", () => {
          console.log("Data channel %s is open", channel.label);
        });
        channel.addEventListener("closing", () => {
          console.log("Data channel %s is closing", channel.label);
        });
        channel.addEventListener("close", () => {
          console.log("Data channel %s is closed", channel.label);
        });
        return channel;
      }
    };
  }
  var createPeerConnection = (offer) => (sendSdp2) => (sendIce2) => (subscribeSdp2) => (subscribeIce2) => () => createPeerConnectionImpl(
    offer.value0,
    (sdp) => sendSdp2(sdp)(),
    (ice) => sendIce2(ice)(),
    (subscriber) => subscribeSdp2((sdp) => () => subscriber(sdp))(),
    (subscriber) => subscribeIce2((ice) => () => subscriber(ice))()
  );

  // output/Playback/foreign.js
  var playback = document.getElementById("tankVideo");
  var playButton = document.getElementById("play-button");
  var stream = new MediaStream();
  if (playback) {
    playback.srcObject = stream;
    playButton.addEventListener("click", () => {
      playback.play();
    });
    playback.addEventListener("playing", () => {
      playButton.parentElement.removeChild(playButton);
    });
  }
  var setPlaybackVideo = (track) => () => {
    console.assert(!track || track.kind === "video");
    stream.getVideoTracks().forEach((track2) => {
      stream.removeTrack(track2);
    });
    if (track) {
      stream.addTrack(track);
    }
  };
  var setPlaybackAudio = (track) => () => {
    console.assert(!track || track.kind === "audio");
    stream.getAudioTracks().forEach((track2) => {
      stream.removeTrack(track2);
    });
    if (track) {
      stream.addTrack(track);
    }
  };

  // output/Signaling/foreign.js
  var peerSubscribers = /* @__PURE__ */ new Set();
  var sdpSubscribers = /* @__PURE__ */ new Set();
  var iceSubscribers = /* @__PURE__ */ new Set();
  var client = null;
  var closeTimeout = null;
  var reconnectTimeout = null;
  function create() {
    clearTimeout(reconnectTimeout);
    reconnectTimeout = null;
    const ws = new WebSocket(window.location.href.replace(/^http/, "ws"));
    const timeout = setTimeout(() => {
      console.error("Server connection initialization timeout");
      ws.close();
    }, 8e3);
    ws.onopen = () => {
      console.log("Server connection open");
      clearTimeout(timeout);
      client = ws;
      peerSubscribers.forEach(({
        peerType,
        peerId: peerId2
      }) => {
        client.send(JSON.stringify({
          source: peerId2,
          type: peerType
        }));
      });
    };
    ws.onclose = function() {
      console.error("Server connection closed");
      client = null;
      clearTimeout(timeout);
      if (!reconnectTimeout) {
        reconnectTimeout = setTimeout(create, 2e3);
      }
    };
    ws.onmessage = ({ data }) => {
      clearTimeout(closeTimeout);
      closeTimeout = setTimeout(() => {
        console.error("Didn't receive ping");
        ws.close();
      }, 32e3);
      if (data === "ping") {
        ws.send("pong");
        return;
      }
      const message2 = JSON.parse(data);
      if (typeof message2.source !== "string") {
        console.warn("Received message without source");
      }
      if ("type" in message2) {
        peerSubscribers.forEach(({
          peerType,
          peerId: peerId2,
          knownPeers,
          subscriber
        }) => {
          if (!("destination" in message2)) {
            client.send(JSON.stringify({
              source: peerId2,
              destination: message2.source,
              type: peerType
            }));
          }
          if (!knownPeers.has(peerId2) && (!("destination" in message2) || message2.destination === peerId2)) {
            try {
              subscriber(message2.type, message2.source);
            } catch (e) {
              console.error(e);
            }
          }
        });
      }
      if (typeof message2.destination === "string") {
        if ("sdp" in message2) {
          sdpSubscribers.forEach(({ localPeer, remotePeer, subscriber }) => {
            if (message2.destination === localPeer && message2.source === remotePeer) {
              Promise.resolve().then(() => {
                try {
                  subscriber(message2.sdp);
                } catch (e) {
                  console.error(e);
                }
              });
            }
          });
        }
        if ("ice" in message2) {
          iceSubscribers.forEach(({ localPeer, remotePeer, subscriber }) => {
            if (message2.destination === localPeer && message2.source === remotePeer) {
              Promise.resolve().then(() => {
                try {
                  subscriber(message2.ice);
                } catch (e) {
                  console.error(e);
                }
              });
            }
          });
        }
      }
    };
  }
  create();
  var subscribePeerImpl = (operatorConstructor) => (tankConstructor) => (peerType) => (peerId2) => (subscriber) => () => {
    const subscriberWrap = {
      peerType: peerType.constructor.name === "Tank" ? "tank" : "operator",
      peerId: peerId2,
      knownPeers: /* @__PURE__ */ new Set(),
      subscriber: (peerType2, peerId3) => subscriber(peerType2 === "tank" ? tankConstructor : operatorConstructor)(peerId3)()
    };
    peerSubscribers.add(subscriberWrap);
    return () => {
      peerSubscribers.delete(subscriberWrap);
    };
  };
  var subscribeSdp = (remotePeer) => (localPeer) => (subscriber) => () => {
    const subscriberWrap = {
      localPeer,
      remotePeer,
      subscriber: (sdp) => subscriber(sdp)()
    };
    sdpSubscribers.add(subscriberWrap);
    return () => {
      sdpSubscribers.delete(subscriberWrap);
    };
  };
  var subscribeIce = (remotePeer) => (localPeer) => (subscriber) => () => {
    const subscriberWrap = {
      localPeer,
      remotePeer,
      subscriber: (ice) => subscriber(ice)()
    };
    iceSubscribers.add(subscriberWrap);
    return () => {
      iceSubscribers.delete(subscriberWrap);
    };
  };
  var sendSdp = (source) => (destination) => (sdp) => () => {
    if (!client) {
      console.warn("Server connection is not active");
      return;
    }
    client.send(JSON.stringify({ source, destination, sdp }));
  };
  var sendIce = (source) => (destination) => (ice) => () => {
    if (!client) {
      console.warn("Server connection is not active");
      return;
    }
    client.send(JSON.stringify({ source, destination, ice }));
  };
  var peerId = (type) => {
    const key = `peer-id-${type.constructor.name.toLowerCase()}`;
    let peerId2 = localStorage.getItem(key);
    if (!peerId2) {
      peerId2 = `${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem(key, peerId2);
    }
    return peerId2;
  };

  // output/Signaling/index.js
  var Tank = /* @__PURE__ */ function() {
    function Tank2() {
    }
    ;
    Tank2.value = new Tank2();
    return Tank2;
  }();
  var Operator = /* @__PURE__ */ function() {
    function Operator2() {
    }
    ;
    Operator2.value = new Operator2();
    return Operator2;
  }();
  var subscribePeer = /* @__PURE__ */ function() {
    return subscribePeerImpl(Operator.value)(Tank.value);
  }();

  // output/Util/foreign.js
  var timestamp = () => Date.now();

  // output/PendingPeer/index.js
  var bind2 = /* @__PURE__ */ bind(bindEffect);
  var $$delete2 = /* @__PURE__ */ $$delete(ordInt);
  var lookup3 = /* @__PURE__ */ lookup2(ordInt);
  var mempty2 = /* @__PURE__ */ mempty(/* @__PURE__ */ monoidEffect(monoidUnit));
  var bind1 = /* @__PURE__ */ bind(bindMaybe);
  var pure2 = /* @__PURE__ */ pure(applicativeMaybe);
  var pure1 = /* @__PURE__ */ pure(applicativeEffect);
  var insert3 = /* @__PURE__ */ insert2(ordInt);
  var join2 = /* @__PURE__ */ join(bindEffect);
  var promise2 = /* @__PURE__ */ promise();
  var when2 = /* @__PURE__ */ when(applicativeEffect);
  var foldWithIndexM2 = /* @__PURE__ */ foldWithIndexM(foldableWithIndexMap)(monadEffect);
  var subscribeMessage2 = function(v) {
    return function(callback) {
      var unsubscribe = function(subscriberId) {
        return function __do() {
          var peer = read(v)();
          if (peer instanceof Left) {
            return write(new Left({
              sendVideo: peer.value0.sendVideo,
              sendAudio: peer.value0.sendAudio,
              requestSubscribers: peer.value0.requestSubscribers,
              messageSubscribers: $$delete2(subscriberId)(peer.value0.messageSubscribers)
            }))(v)();
          }
          ;
          if (peer instanceof Right) {
            (function() {
              var v1 = lookup3(subscriberId)(peer.value0.messageSubscribers);
              if (v1 instanceof Nothing) {
                return mempty2();
              }
              ;
              if (v1 instanceof Just) {
                return v1.value0();
              }
              ;
              throw new Error("Failed pattern match at PendingPeer (line 234, column 11 - line 236, column 48): " + [v1.constructor.name]);
            })();
            return write(new Right({
              peer: peer.value0.peer,
              requestSubscribers: peer.value0.requestSubscribers,
              messageSubscribers: $$delete2(subscriberId)(peer.value0.messageSubscribers)
            }))(v)();
          }
          ;
          throw new Error("Failed pattern match at PendingPeer (line 225, column 7 - line 241, column 25): " + [peer.constructor.name]);
        };
      };
      var decode = function(json) {
        return bind1(toObject(json))(function(object) {
          return pure2(fold2(function(a) {
            return function(key) {
              return function(value12) {
                return caseJsonNumber(a)(function(value$prime) {
                  return insert(key)(value$prime)(a);
                })(value12);
              };
            };
          })(empty)(object));
        });
      };
      var messageCallback = function(message2) {
        var v1 = decode(message2);
        if (v1 instanceof Nothing) {
          return pure1(unit);
        }
        ;
        if (v1 instanceof Just) {
          return callback(v1.value0);
        }
        ;
        throw new Error("Failed pattern match at PendingPeer (line 200, column 7 - line 202, column 43): " + [v1.constructor.name]);
      };
      var subscribe = function(subscriberId) {
        return function __do() {
          var peer = read(v)();
          if (peer instanceof Left) {
            return write(new Left({
              sendVideo: peer.value0.sendVideo,
              sendAudio: peer.value0.sendAudio,
              requestSubscribers: peer.value0.requestSubscribers,
              messageSubscribers: insert3(subscriberId)(messageCallback)(peer.value0.messageSubscribers)
            }))(v)();
          }
          ;
          if (peer instanceof Right) {
            var unsubscribeFn = subscribeMessage(peer.value0.peer)(messageCallback)();
            return write(new Right({
              peer: peer.value0.peer,
              requestSubscribers: peer.value0.requestSubscribers,
              messageSubscribers: insert3(subscriberId)(unsubscribeFn)(peer.value0.messageSubscribers)
            }))(v)();
          }
          ;
          throw new Error("Failed pattern match at PendingPeer (line 208, column 7 - line 222, column 25): " + [peer.constructor.name]);
        };
      };
      return function __do() {
        var subscriberId = timestamp();
        subscribe(subscriberId)();
        return unsubscribe(subscriberId);
      };
    };
  };
  var setSendVideo2 = function(v) {
    return function(sendVideo) {
      return function __do() {
        var v1 = read(v)();
        if (v1 instanceof Left) {
          return write(new Left({
            sendVideo,
            messageSubscribers: v1.value0.messageSubscribers,
            requestSubscribers: v1.value0.requestSubscribers,
            sendAudio: v1.value0.sendAudio
          }))(v)();
        }
        ;
        if (v1 instanceof Right) {
          return setSendVideo(v1.value0.peer)(sendVideo)();
        }
        ;
        throw new Error("Failed pattern match at PendingPeer (line 131, column 31 - line 133, column 58): " + [v1.constructor.name]);
      };
    };
  };
  var setSendAudio2 = function(v) {
    return function(sendAudio) {
      return function __do() {
        var v1 = read(v)();
        if (v1 instanceof Left) {
          return write(new Left({
            sendAudio,
            messageSubscribers: v1.value0.messageSubscribers,
            requestSubscribers: v1.value0.requestSubscribers,
            sendVideo: v1.value0.sendVideo
          }))(v)();
        }
        ;
        if (v1 instanceof Right) {
          return setSendAudio(v1.value0.peer)(sendAudio)();
        }
        ;
        throw new Error("Failed pattern match at PendingPeer (line 125, column 31 - line 127, column 58): " + [v1.constructor.name]);
      };
    };
  };
  var initConnection = function(peerType) {
    return function(localPeer) {
      return function(remotePeer) {
        return function() {
          var callback = function(v) {
            return function(v1) {
              return function(v2) {
                if (v instanceof Tank) {
                  return function __do() {
                    var unsubscribe = $$new(pure1(unit))();
                    var unsubscribeFn = subscribeSdp(remotePeer)(localPeer)(function(sdp) {
                      return function __do2() {
                        join2(read(unsubscribe))();
                        var pc = createPeerConnection(new Just(sdp))(sendSdp(localPeer)(remotePeer))(sendIce(localPeer)(remotePeer))(subscribeSdp(remotePeer)(localPeer))(subscribeIce(remotePeer)(localPeer))();
                        var peer = createPeer(pc)(setPlaybackVideo)(setPlaybackAudio)(subscribeVideo)(subscribeAudio)();
                        return v1(peer)();
                      };
                    })();
                    return write(unsubscribeFn)(unsubscribe)();
                  };
                }
                ;
                if (v instanceof Operator) {
                  return function __do() {
                    var pc = createPeerConnection(Nothing.value)(sendSdp(localPeer)(remotePeer))(sendIce(localPeer)(remotePeer))(subscribeSdp(remotePeer)(localPeer))(subscribeIce(remotePeer)(localPeer))();
                    var peer = createPeer(pc)(function(v3) {
                      return bind2(warn("Operator should not subscribe to video"))(pure1);
                    })(setPlaybackAudio)(subscribeVideo)(subscribeAudio)();
                    return v1(peer)();
                  };
                }
                ;
                throw new Error("Failed pattern match at PendingPeer (line 90, column 5 - line 107, column 42): " + [v.constructor.name, v1.constructor.name, v2.constructor.name]);
              };
            };
          };
          return promise2(callback(peerType));
        };
      };
    };
  };
  var waitForPeer = function(localPeerType) {
    return function() {
      var accept2 = function(v) {
        return function(v1) {
          if (v instanceof Tank && v1 instanceof Operator) {
            return true;
          }
          ;
          if (v instanceof Operator && v1 instanceof Tank) {
            return true;
          }
          ;
          return false;
        };
      };
      var onPeer = function(unsubscribe) {
        return function(resolve) {
          return function(reject) {
            return function(remotePeerType) {
              return function(remotePeerId) {
                return when2(accept2(localPeerType)(remotePeerType))(function __do() {
                  join2(read(unsubscribe))();
                  return runPromise(resolve)(reject)(initConnection(localPeerType)(peerId(localPeerType))(remotePeerId))();
                });
              };
            };
          };
        };
      };
      var callback = function(resolve) {
        return function(reject) {
          return function __do() {
            var unsubscribe = $$new(pure1(unit))();
            var unsubscribeFn = subscribePeer(localPeerType)(peerId(localPeerType))(onPeer(unsubscribe)(resolve)(reject))();
            return write(unsubscribeFn)(unsubscribe)();
          };
        };
      };
      return promise2(callback);
    };
  };
  var createPendingPeer = function(peerType) {
    var addRequestSubscriber = function(peer) {
      return function(id3) {
        return function(requestSubscribers) {
          return function(requestCallback) {
            return function __do() {
              var unsubscribe = subscribeRequest(peer)(requestCallback)();
              return insert3(id3)(unsubscribe)(requestSubscribers);
            };
          };
        };
      };
    };
    var addMessageSubscriber = function(peer) {
      return function(id3) {
        return function(messageSubscribers) {
          return function(messageCallback) {
            return function __do() {
              var unsubscribe = subscribeMessage(peer)(messageCallback)();
              return insert3(id3)(unsubscribe)(messageSubscribers);
            };
          };
        };
      };
    };
    var onPeer = function(v) {
      return function(peer) {
        return function __do() {
          var pendingPeer = read(v)();
          if (pendingPeer instanceof Left) {
            setSendVideo(peer)(pendingPeer.value0.sendVideo)();
            setSendAudio(peer)(pendingPeer.value0.sendAudio)();
            var requestSubscribers = foldWithIndexM2(addRequestSubscriber(peer))(empty3)(pendingPeer.value0.requestSubscribers)();
            var messageSubscribers = foldWithIndexM2(addMessageSubscriber(peer))(empty3)(pendingPeer.value0.messageSubscribers)();
            return write(new Right({
              peer,
              requestSubscribers,
              messageSubscribers
            }))(v)();
          }
          ;
          if (pendingPeer instanceof Right) {
            return mempty2();
          }
          ;
          throw new Error("Failed pattern match at PendingPeer (line 54, column 7 - line 61, column 26): " + [pendingPeer.constructor.name]);
        };
      };
    };
    return function __do() {
      var pendingPeer = $$new(new Left({
        requestSubscribers: empty3,
        messageSubscribers: empty3,
        sendAudio: false,
        sendVideo: false
      }))();
      runPromise(onPeer(pendingPeer))($$const(pure1(unit)))(waitForPeer(peerType))();
      return pendingPeer;
    };
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

  // output/Web.DOM.Element/foreign.js
  var getProp = function(name15) {
    return function(doctype) {
      return doctype[name15];
    };
  };
  var _namespaceURI = getProp("namespaceURI");
  var _prefix = getProp("prefix");
  var localName = getProp("localName");
  var tagName = getProp("tagName");
  function setAttribute(name15) {
    return function(value12) {
      return function(element) {
        return function() {
          element.setAttribute(name15, value12);
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
  var getEffProp = function(name15) {
    return function(node) {
      return function() {
        return node[name15];
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
  var map3 = /* @__PURE__ */ map(functorEffect);
  var querySelector = function(qs) {
    var $2 = map3(toMaybe);
    var $3 = _querySelector(qs);
    return function($4) {
      return $2($3($4));
    };
  };

  // output/Web.HTML/foreign.js
  var windowImpl = function() {
    return window;
  };

  // output/Web.HTML.HTMLDocument/index.js
  var toParentNode = unsafeCoerce2;

  // output/Web.HTML.Window/foreign.js
  function document2(window2) {
    return function() {
      return window2.document;
    };
  }

  // output/Tank/index.js
  var fromJust2 = /* @__PURE__ */ fromJust();
  var map4 = /* @__PURE__ */ map(functorEffect);
  var show2 = /* @__PURE__ */ show(showNumber);
  var bind3 = /* @__PURE__ */ bind(bindEffect);
  var pure3 = /* @__PURE__ */ pure(applicativeEffect);
  var unsafeFromJust = function(x) {
    return fromJust2(x);
  };
  var setControls2 = function(h) {
    return function(v) {
      var distance = h * h + v * v;
      var realDistance = function() {
        var $20 = distance > 1;
        if ($20) {
          return 1;
        }
        ;
        return distance;
      }();
      var angle = atan2(h)(v);
      var cl = cos(angle - pi / 4);
      var left = round2((-cl * realDistance + 1) * 8);
      var cr = cos(angle + pi / 4);
      var right = round2((-cr * realDistance + 1) * 8);
      var $$byte = (function() {
        var $21 = left > 15;
        if ($21) {
          return 15;
        }
        ;
        return left;
      }() * 16 | 0) + function() {
        var $22 = right > 15;
        if ($22) {
          return 15;
        }
        ;
        return right;
      }() | 0;
      return send($$byte);
    };
  };
  var querySelector2 = function(selector) {
    var $30 = map4(unsafeFromJust);
    var $31 = querySelector(selector);
    return function($32) {
      return $30($31($32));
    };
  };
  var initJoystick = /* @__PURE__ */ function() {
    var set = function(joystickElement) {
      return function(realX) {
        return function(realY) {
          var distance = realX * realX + realY * realY;
          var angle = atan2(realY)(realX);
          var x = function() {
            var $23 = distance > 1;
            if ($23) {
              return cos(angle);
            }
            ;
            return realX;
          }();
          var canvasX = x * 100 + 150;
          var y = function() {
            var $24 = distance > 1;
            if ($24) {
              return sin(angle);
            }
            ;
            return realY;
          }();
          var canvasY = 150 - y * 100;
          return function __do() {
            setAttribute("cx")(show2(canvasX))(joystickElement)();
            return setAttribute("cy")(show2(canvasY))(joystickElement)();
          };
        };
      };
    };
    return function __do() {
      var document3 = bind3(windowImpl)(document2)();
      var joystickElement = querySelector2("#joystick-position")(toParentNode(document3))();
      return set(joystickElement);
    };
  }();
  var main = /* @__PURE__ */ function() {
    var set$prime = function(v) {
      return function(v1) {
        return function(v2) {
          if (v1 instanceof Just && v2 instanceof Just) {
            return function __do() {
              v(v1.value0)(v2.value0)();
              return setControls2(v1.value0)(v2.value0)();
            };
          }
          ;
          return pure3(unit);
        };
      };
    };
    var set = function(setJoystick) {
      return function(message2) {
        return set$prime(setJoystick)(lookup("joystickH")(message2))(lookup("joystickV")(message2));
      };
    };
    return function __do() {
      var peer = createPendingPeer(Tank.value)();
      setSendAudio2(peer)(true)();
      setSendVideo2(peer)(true)();
      var setJoystick = initJoystick();
      subscribeMessage2(peer)(set(setJoystick))();
      return unit;
    };
  }();

  // <stdin>
  main();
})();
