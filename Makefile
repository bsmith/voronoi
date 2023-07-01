# Lets try writing a purely POSIX makefile with no GNUisms
.POSIX:

.PHONY: default
default: build

# TODO: build is relative to the cwd
# TODO: src is relative to this makefile
build=build
src=src
htdocs=$(build)/htdocs

TSC=pnpm exec tsc
ESBUILD=pnpm exec esbuild

.PHONY: serve
serve:
	python3 -m http.server -d $(htdocs) 3003

.PHONY: clean
clean:
	-rm -fr $(build)

.PHONY: build
build: check htdocs

.PHONY: check
check: build-dir $(build)/tsc/voronoi-demo.js

.PHONY: htdocs
htdocs: htdocs-dir $(htdocs)/index.html $(htdocs)/style.css $(htdocs)/voronoi-demo.js $(htdocs)/voronoi-demo.js.map

.PHONY: build-dir
build-dir:
	[ -d $(build) ] || mkdir $(build)

.PHONY: htdocs-dir
htdocs-dir: build-dir
	[ -d $(htdocs) ] || mkdir $(htdocs)
#	XXX path of symlink could be better, or copy
#	[ -e $(htdocs)/node_modules ] || ln -s ../../node_modules/ $(htdocs)/node_modules

$(htdocs)/index.html: $(src)/index.html
	cp $< $@

$(htdocs)/style.css: $(src)/style.css
	cp $< $@

$(htdocs)/voronoi-demo.js: $(build)/esbuild/voronoi-demo.js
	cp $< $@

$(htdocs)/voronoi-demo.js.map: $(build)/esbuild/voronoi-demo.js.map
	cp $< $@

$(build)/tsc/voronoi-demo.js \
$(build)/tsc/voronoi-demo.js.map: $(src)/voronoi-demo.ts
	$(TSC) -p tsconfig.voronoi-demo.json

$(build)/esbuild/voronoi-demo.js \
$(build)/esbuild/voronoi-demo.js.map: $(src)/voronoi-demo.ts
	$(ESBUILD) --bundle --format=esm --outdir=build/esbuild --sourcemap src/voronoi-demo.ts