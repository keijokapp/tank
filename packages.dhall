let upstream = https://github.com/purescript/package-sets/releases/download/psc-0.13.6-20200423/packages.dhall sha256:c180a06bb5444fd950f8cbdd6605c644fd246deb397e62572b8f4a6b9dbcaf22

let overrides = {
  web-geometry = {
		repo = "https://github.com/keijokapp/purescript-web-geometry.git",
		version = "master",
		dependencies = [ ] : List Text
	},
  web-cssom-view = {
		repo = "https://github.com/keijokapp/purescript-web-cssom-view.git",
		version = "master",
		dependencies = [ "web-geometry", "web-events", "web-html" ]
	},
  web-pointerevents = {
		repo = "https://github.com/keijokapp/purescript-web-pointerevents.git",
		version = "master",
		dependencies = [ "web-uievents" ]
	}
}

in  upstream // overrides
