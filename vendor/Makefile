
deps := google-closure-compiler

.PHONY: all build build-all clean

all: build

build: build-all $(deps)

build-all: google-closure-compiler/build/compiler.jar

clean:
	$(RM) -r $(deps)

google-closure-compiler:
	svn checkout http://closure-compiler.googlecode.com/svn/trunk/ $@

google-closure-compiler/build/compiler.jar: google-closure-compiler
	svn update google-closure-compiler
	ant -f google-closure-compiler/build.xml
