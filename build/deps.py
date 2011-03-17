#!/usr/bin/env python

import subprocess
import sys
import os
import glob

SRC_DIR = os.path.join('..','src','easeljs')

def getCommonArgs():
  command = ['python', 'calcdeps.py']
  command += ['--dep', os.path.join(SRC_DIR, 'base.js')]
  command += ["-o", "deps"]
  js_dirs = glob.glob(os.path.join(SRC_DIR, '*/'))
  for dir in js_dirs:
    command += ["-p", dir]
  return command

def generate_deps(path = SRC_DIR):
  command = getCommonArgs()

  if(path != SRC_DIR):
    command += ['-p', path]

  command += ["--output_file", os.path.join(path, 'deps.js')]

  subprocess.Popen(command, stdout=sys.stdout).communicate()

if __name__ == '__main__':
  generate_deps()

  game_dir = os.path.join('..','examples','game')
  generate_deps(game_dir)

