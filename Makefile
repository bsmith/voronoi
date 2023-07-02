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
# check: build-dir $(build)/tsc/voronoi-demo.js
check: build-dir tsc-voronoi-demo

.PHONY: htdocs htdocs-copy
htdocs: htdocs-dir esbuild-voronoi-demo htdocs-copy
htdocs-copy: $(htdocs)/index.html $(htdocs)/style.css $(htdocs)/voronoi-demo.js $(htdocs)/voronoi-demo.js.map

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

# $(build)/tsc/voronoi-demo.js \
# $(build)/tsc/voronoi-demo.js.map: $(src)/voronoi-demo.ts
.PHONY: tsc-voronoi-demo
tsc-voronoi-demo:
	$(TSC) -p tsconfig.voronoi-demo.json

# $(build)/esbuild/voronoi-demo.js \
# $(build)/esbuild/voronoi-demo.js.map: $(src)/voronoi-demo.ts
.PHONY: esbuild-voronoi-demo
esbuild-voronoi-demo:
#	$(ESBUILD) --bundle --format=esm --outdir=build/esbuild --sourcemap src/voronoi-demo.ts
	$(ESBUILD) --bundle --format=esm --outfile=build/esbuild/voronoi-demo.js.tmp --sourcemap src/voronoi-demo.ts
	perl -i -plE's{sourceMappingURL=voronoi-demo.js.tmp.map}{sourceMappingURL=voronoi-demo.js.map}' build/esbuild/voronoi-demo.js.tmp
	cmp build/esbuild/voronoi-demo.js.tmp build/esbuild/voronoi-demo.js || \
		( cp build/esbuild/voronoi-demo.js.tmp build/esbuild/voronoi-demo.js; \
		cp build/esbuild/voronoi-demo.js.tmp.map build/esbuild/voronoi-demo.js.map )