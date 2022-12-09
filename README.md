# Purpose Clauses in the Iliad - Creating Interactive Data Visualizations using d3.js

## Iliad_DataFilter
"datafilter.py" contains the functions that I wrote to extract only purpose clauses from the Iliad, and "datafilter_README.md" describes how I went about writing this script. "iliad_purposeclauses.xml" is the result of "datafilter.py" and only contains purpose clauses.

"dictMaker.py" takes in "iliad_purposeclauses.xml" and automatically creates JSON files for each sentence in the xml file. 

## Iliad_JSON
Contains the JSON files created by "dictMaker.py".

## Iliad_TidyTree

By using the files in "Iliad_JSON", I began to create visualizations of purpose clauses using d3.js through the "Tidy Tree" algorithm as can be seen here: https://observablehq.com/d/94f352c4c37b7809.

By working with d3.js locally, I created a collapsible version of the Tidy Tree algorithm that represented Iliad purpose clauses, which can be seen and interacted with in "tidytree-iliad.html".