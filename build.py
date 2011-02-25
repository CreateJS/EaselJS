#!/usr/bin/env python

from os import path
from _tools.Closure import Closure
import glob

closure_path = path.join('closure','closure')

js_dirs = ['src']
deps_js_path = "deps.js"

Closure(
  closure_path = closure_path,
  application_js_path = None,
  closure_dependencies = js_dirs,
  deps_js_path = deps_js_path,
  compiled_js_path = None,
  extern_files = None
).do_makeDeps()
