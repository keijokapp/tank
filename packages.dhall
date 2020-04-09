let upstream =
      https://github.com/purescript/package-sets/releases/download/psc-0.15.7-20230216/packages.dhall
        sha256:b8d513f39bfc07e2198b4575334ba2d7e59d22f174d38568f1d86faee218947e

let overrides =
      { promises =
				{ repo = "https://github.com/thimoteus/purescript-promises.git"
				, version = "master"
				, dependencies = ["prelude", "aff", "exceptions", "transformers", "datetime", "console"]
				}
      , web-cssom-view =
        { repo =
            "https://github.com/purescript-web/purescript-web-cssom-view.git"
        , version = "master"
        , dependencies = [ "aff", "web-geometry", "web-events", "web-html" ]
        }
      , web-pointerevents =
        { repo = "https://github.com/keijokapp/purescript-web-pointerevents.git"
        , version = "master"
        , dependencies = [ "web-uievents" ]
        }
      }

in  upstream // overrides
