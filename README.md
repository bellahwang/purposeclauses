This repository contains the scripts and files of purpose clauses that I generated from the Iliad.

"datafilter.py" contains the functions that I wrote to extract only purpose clauses from the Iliad, and "datafilter_README.md" describes how I went about writing this script.

"iliad_purposeclauses.xml" is the result of "datafilter.py" and only contains purpose clauses.

"dictMaker.py" takes in "iliad_purposeclauses.xml" and automatically creates JSON files for each sentence in the xml file. These JSON files can be found in "Iliad_JSON".

By using the files in "Iliad_JSON", I created visualizations of purpose clauses using d3.js through the "Tidy Tree" algorithm as can be seen here: https://observablehq.com/@bellahwang/tidy-tree.