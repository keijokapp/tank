{ name = "tank"
, dependencies = [ "prelude", "maybe", "either", "psci-support", "integers", "promises", "refs", "ordered-collections", "foreign-object", "js-timers", "argonaut-core", "web-html", "math", "web-uievents"]
, packages = ./packages.dhall
, sources = [ "src/**/*.purs" ]
}
