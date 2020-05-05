{ name = "tank"
, dependencies = [ "prelude", "maybe", "psci-support", "integers" ]
, packages = ./packages.dhall
, sources = [ "src/**/*.purs" ]
}
