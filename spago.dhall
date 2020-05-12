{ name = "tank"
, dependencies = [ "prelude", "maybe", "either", "psci-support", "integers", "promises", "refs", "ordered-collections"]
, packages = ./packages.dhall
, sources = [ "src/**/*.purs" ]
}
