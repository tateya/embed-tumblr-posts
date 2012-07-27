
.PHONY: all minify checkout clean

all: checkout minify

minify: embed-tumblr-posts.min.js

checkout:
	make -C vendor

clean:
	$(RM) embed-tumblr-posts.min.js
	make -C vendor clean

embed-tumblr-posts.min.js: embed-tumblr-posts.js
	java -jar vendor/google-closure-compiler/build/compiler.jar --js $< > $@
