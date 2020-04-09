{ name = "tank"
, dependencies =
  [ "argonaut-core"
  , "arrays"
  , "console"
  , "datetime"
  , "effect"
  , "either"
  , "exceptions"
  , "foldable-traversable"
  , "foreign-object"
  , "functions"
  , "integers"
  , "js-timers"
  , "maybe"
  , "numbers"
  , "ordered-collections"
  , "partial"
  , "prelude"
  , "refs"
  , "transformers"
  , "tuples"
  , "unfoldable"
  , "web-cssom-view"
  , "web-dom"
  , "web-events"
  , "web-geometry"
  , "web-html"
  , "web-pointerevents"
  ]
, packages = ./packages.dhall
, sources = [ "src/**/*.purs" ]
}
