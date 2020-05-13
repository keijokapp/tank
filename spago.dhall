{ name = "tank"
, dependencies = [ "prelude", "maybe", "either", "psci-support", "integers", "promises", "refs", "ordered-collections", "foreign-object", "js-timers"]
, packages = ./packages.dhall
, sources = [ "src/**/*.purs" ]
}
