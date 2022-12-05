<p>

In order to ensure that I was able to narrow down everything to sentences that would only contain purpose clauses, I wrote 4 scripts that saved the outputs to their own respective files. 

<br>

Each function made its own pass on the data, and each time, the revised data was saved to a new file. This way, I would be able to troubleshoot any unexpected issues that might come up.

</p>

<br>

<p>
<h3>

**First pass: Label all words that might be purpose clause conjunctions with a marker.**

</h3>
<br>
<ol>
<li>Using the ElementTree module, load in xml file of original data and set name of output file to save changes to.</li>

```python
import xml.etree.ElementTree as ET

# change FILENAME to local path 
FILENAME = "tlg0012.tlg001.perseus-grc1.tb.xml"

# new output file
NEWFILE = "iliad_purposeclauses_1stpass.xml"

tree = ET.parse(FILENAME)
root = tree.getroot()
```

<li>
Loop through each sentence.
</li>

```python
for sentence in root.findall(".//sentence"):
```

<li>

Loop through each word within each sentence. Create a variable `lemma` to store the word's lemma.

</li>

```python
for word in sentence.findall("./word"):
    lemma = word.get('lemma')
```

<li>
If the word’s lemma matches up with any of these lemmas (purpose clause conjunctions):
<ul>
<li> 

`lemma == "ἵνα"`

</li>
<li>

`lemma == "ὅπως"`

</li>
<li>

`lemma == "ὡς"`

</li>
<li>

`lemma == "μή"`

</li>
<li>

`lemma == "ὄφρα"`

</li>
<li>

`lemma == "ἕως"`

</li>
</ul>

Label it with an attribute that says `hasconj = T`. <br>
(`hasconj`: has conjunction)

```python
if (lemma == "ἵνα" or lemma == "ὅπως" or lemma == "ὡς" or lemma == "μή" or lemma == "ὄφρα" or lemma == "ἕως"):
    word.set('hasconj', 'T')
```

If not, label it with `hasconj = F`.

```python
else:
    word.set('hasconj', 'F')
```

</li>

<li>
Save output to new file (remember to use UTF-8 encoding so the Greek doesn't get scrambled).

```python
tree.write(NEWFILE, encoding = "UTF-8")
```
</li>
</ol>

<br>

****

<br>

*Final File*
```python
import xml.etree.ElementTree as ET

# change FILENAME to local path
FILENAME = "tlg0012.tlg001.perseus-grc1.tb.xml"

# new output file
NEWFILE = "iliad_purposeclauses_1stpass.xml"

tree = ET.parse(FILENAME)
root = tree.getroot()

for sentence in root.findall(".//sentence"):
    for word in sentence.findall("./word"):
        lemma = word.get('lemma')
        if (lemma == "ἵνα" or lemma == "ὅπως" or lemma == "ὡς" or lemma == "μή" or lemma == "ὄφρα" or lemma == "ἕως"):
            word.set('hasconj', 'T')
        else:
            word.set('hasconj', 'F')
tree.write(NEWFILE, encoding = "UTF-8")
```
</p>
<br>

<p>
<h3>

**Second pass: Label all sentences that have words marked as purpose clause conjunctions with a marker.**

</h3>
<ol>
<li>
Using the ElementTree module, load in xml file of data created from the first pass and set name of output file to save changes to.
</li>

```python
import xml.etree.ElementTree as ET

# change FILENAME to local path 
FILENAME = "iliad_purposeclauses_1stpass.xml"

# new output file
NEWFILE = "iliad_purposeclauses_2ndpass.xml"

tree = ET.parse(FILENAME)
root = tree.getroot()
```

<li>

Create a boolean variable `isthereconj` to store `True` or `False` values based on if the sentences contain purpose clause conjunctions. <br>
When creating it, assign it to `False` to ensure that a sentence isn't marked as having a purpose clause conjunction when it does not.

```python
isthereconj = False
```
</li>

<li>

Loop through each sentence. Remember to set `isthereconj = False` to ensure that the variable is reset for each new sentence.

```python
for sentence in root.findall(".//sentence"):
    isthereconj = False
```
</li>

<li>

Loop through each word within each sentence. Create a variable `hasconj` to store the value of the marker we created during the first pass.

```python
for word in sentence.findall("./word"):
    hasconj = word.get('hasconj')
```

</li>

<li>

If the word in the sentence is marked with `hasconj == 'T'`, set `isthereconj` to `True`. Then label the sentence as having a purpose clause conjunction.

```python
if (hasconj == 'T'):
    isthereconj = True
    sentence.set('hasconj', 'T')
```

</li>

<li>

After looping through all the words in the sentence, check to see if `isthereconj` is still set to `False`. If it is, label the sentence as not having a purpose clause conjunction.

```python
if (isthereconj == False):
    sentence.set('hasconj', 'F')
```

</li>

<li>

Save output to new file (remember to use UTF-8 encoding so the Greek doesn't get scrambled).

```python
tree.write(NEWFILE, encoding = "UTF-8")
```

</li>
</ol>

<br>

****

<br>

*Final File*
```python
import xml.etree.ElementTree as ET

# change FILENAME to local path
FILENAME = "iliad_purposeclauses_1stpass.xml"

# new output file
NEWFILE = "iliad_purposeclauses_2ndpass.xml"

tree = ET.parse(FILENAME)
root = tree.getroot()

isthereconj = False

for sentence in root.findall(".//sentence"):
    isthereconj = False
    for word in sentence.findall("./word"):
        hasconj = word.get('hasconj')
        if (hasconj == 'T'):
            isthereconj = True
            sentence.set('hasconj', 'T')
    if (isthereconj == False):
        sentence.set('hasconj', 'F')

tree.write(NEWFILE, encoding = "UTF-8")
```
</p>

<br>

<p>
<h3>

**Third pass: Remove all sentences that are not marked as containing purpose clause conjunctions.**

</h3>
<ol>
<li>

Using the lxml module, load in xml file of data created from the second pass and set name of output file to save changes to.

```python
import lxml.etree as et

# change FILENAME to local path
FILENAME = "iliad_purposeclauses_2ndpass.xml"

# new output file
NEWFILE = "iliad_purposeclauses_3rdpass.xml"

root = et.parse(FILENAME)
```

</li>
<li>

Loop through each sentence, specifically looking for sentences that contain the attribute marker `hasconj='F'`. Remove sentences that contain this marker.

```python
for sentence in root.xpath(".//sentence[@hasconj='F']"):
    sentence.getparent().remove(sentence)
```

</li>

<li>

Save output to new file. Remember to:
<ul>
<li>

use UTF-8 encoding so the Greek doesn't get scrambled

</li>
<li>

set `pretty_print = True` to preserve the indentations of the xml file

</li>
<li>

set `xml_declaration = True` to save the file as an xml file

</li>
</ul>

```python
root.write(NEWFILE, pretty_print = True, encoding = "UTF-8", xml_declaration = True)
```

</li>
</ol>

<br>

****

<br>

*Final File*
```python
import lxml.etree as et

# change FILENAME to local path
FILENAME = "iliad_purposeclauses_2ndpass.xml"

# new output file
NEWFILE = "iliad_purposeclauses_3rdpass.xml"

root = et.parse(FILENAME)

    for sentence in root.xpath(".//sentence[@hasconj='F']"):
        sentence.getparent().remove(sentence)
    
    root.write(NEWFILE, pretty_print = True, encoding = "UTF-8", xml_declaration = True)
```
</p>

<br>

<p>

<h3>

**Fourth pass: Remove all labels created through first and second passes.**

</h3>

<br>

<ol>
<li>

Import the regular expression module `re`. Load in xml file of data created from the third pass for reading (`'r'`) and load in output file for writing (`'w'`).

```python
import re

# change FILENAME to local path
FILENAME = "iliad_purposeclauses_3rdpass.xml"

# new output file
NEWFILE = "iliad_purposeclauses_4thpass.xml"

w = open(NEWFILE, "w")

with open(FILENAME, 'r', encoding = "UTF-8") as f:
```

</li>

<li>

Read in the file and save it to the variable `content`. 

```python
content = f.read()
```

</li>

<li>

Use a regular expression to remove all instances of `hasconj` within the file.

```python
content = re.sub('hasconj="." ', r'', content)
```

</li>

<li>

Set reference point to the beginning of the new file (this is what the `0` is referring to), and save the removed instances to the new file. Truncate the file.

```python
w.seek(0)
w.write(content)
w.truncate()
```

</li>

<li>

Close the file you wrote to.

```python
w.close()
```

</li>
</ol>

<br>

****

<br>

*Final File*
```python
import re

# change FILENAME to local path
FILENAME = "iliad_purposeclauses_3rdpass.xml"

# new output file
NEWFILE = "iliad_purposeclauses_4thpass.xml"

w = open(NEWFILE, "w")

with open(FILENAME, 'r', encoding = "UTF-8") as f:
    content = f.read()
    content = re.sub('hasconj="." ', r'', content)
    w.seek(0)
    w.write(content)
    w.truncate()

w.close()
```

</p>

<br>

<p>

<h3>

**Fifth pass: Add empty lemma labels for elliptic words for future steps (creation of a tree network with lemma labels).**

</h3>

<br>

<ol>
<li>

Import the regular expression module `re`. Load in xml file of data created from the fourth pass for reading (`'r'`) and load in output file for writing (`'w'`).

```python
import re

# change FILENAME to local path
FILENAME = "iliad_purposeclauses_4thpass.xml"

# new output file
NEWFILE = "iliad_purposeclauses_5thpass.xml"

w = open(NEWFILE, "w")

with open(FILENAME, 'r', encoding = "UTF-8") as f:
```

</li>

<li>

Read in the file and save it to the variable `content`. 

```python
content = f.read()
```

</li>

<li>

Use a regular expression to add an empty `lemma=""` value after every instance of `insertion_id`, an attribute only present in elliptic words.

```python
content = re.sub(r'(?<=insertion_id="....." )', r'lemma="" ', content))
```

</li>

<li>

Set reference point to the beginning of the new file (this is what the `0` is referring to), and save the added instances to the new file. Truncate the file.

```python
w.seek(0)
w.write(content)
w.truncate()
```

</li>

<li>

Close the file that you wrote to.


```python
w.close()
```
</li>
</ol>

<br>

****

<br>

*Final File*
```python
import re

# change FILENAME to local path
FILENAME = "iliad_purposeclauses_4thpass.xml"

# new output file
NEWFILE = "iliad_purposeclauses_5thpass.xml"

w = open(NEWFILE, "w")

with open(FILENAME, 'r', encoding = "UTF-8") as f:
    content = f.read()
    content = re.sub(r'(?<=insertion_id="....." )', r'lemma="" ', content))
    w.seek(0)
    w.write(content)
    w.truncate()

w.close()
```

</p>

<br>

<p>

After I was able to ensure that each pass was doing what it was supposed to do, I combined all of these scripts into functions within one main script.

</p>

<br>

<p>
Begin by importing all relevant packages and setting file names to read and write from.

```python
import xml.etree.ElementTree as ET
import lxml.etree as et
import re

# change FILENAME to local path
FILENAME = "tlg0012.tlg001.perseus-grc1.tb.xml"

# new output file
NEWFILE = "iliad_purposeclauses.xml"
```
</p>

<br>

<p>

**<h3>First pass: Label all words that might be purpose clause conjunctions with a marker.</h3>**

```python
def labelWord():
    tree = ET.parse(FILENAME)
    root = tree.getroot()
    
    for sentence in root.findall(".//sentence"):
        for word in sentence.findall("./word"):
            lemma = word.get('lemma')
            if (lemma == "ἵνα" or lemma == "ὅπως" or lemma == "ὡς" or lemma == "μή" or lemma == "ὄφρα" or lemma == "ἕως"):
                word.set('hasconj', 'T')
            else:
                word.set('hasconj', 'F')
    tree.write(NEWFILE, encoding = "UTF-8")
```
</p>

<br>

<p>

**<h3>Second pass: Label all sentences that have words marked as purpose clause conjunctions with a marker.</h3>**

<h5>

NOTE: `NEWFILE` is used to read from and write changes to, beginning from the second pass, instead of saving to new separate files.

</h5>

```python
def labelSent():
    tree = ET.parse(NEWFILE)
    root = tree.getroot()
    
    isthereconj = False

    for sentence in root.findall(".//sentence"):
        isthereconj = False
        for word in sentence.findall("./word"):
            hasconj = word.get('hasconj')
            if (hasconj == 'T'):
                isthereconj = True
                sentence.set('hasconj', 'T')
        if (isthereconj == False):
            sentence.set('hasconj', 'F')
    
    tree.write(NEWFILE, encoding = "UTF-8")
```
</p>

<br>

<p>
<h3>

**Third pass: Remove all sentences that are not marked as containing purpose clause conjunctions.**

</h3>

```python
def rmNonConj():
    root = et.parse(NEWFILE)

    for sentence in root.xpath(".//sentence[@hasconj='F']"):
        sentence.getparent().remove(sentence)
    
    root.write(NEWFILE, pretty_print = True, encoding = "UTF-8", xml_declaration = True)
```

</p>

<br>

<p>

<h3>

**Fourth + Fifth pass: Remove all labels created through first and second passes, and add empty lemma labels for elliptic words for future steps (creation of a tree network with lemma labels).**

</h3>

<h5>

NOTE: the 4th and 5th passes were combined, as a result of being able to read and write to the same file. `'r+'` is used to mark a file as available to read from and to write to.

</h5>

```python
def rmLabel():
    with open(NEWFILE, 'r+', encoding = "UTF-8") as f:

        # remove labels
        content = f.read()
        content = re.sub('hasconj="." ', r'', content)
        f.seek(0)
        f.write(content)
        
        # add empty lemma attributes
        newcontent = f.read()
        newcontent = re.sub(r'(?<=insertion_id="....." )', r'lemma="" ', content)
        f.seek(0)
        f.write(newcontent)
        f.truncate()
```
</p>

<br>

<p>
Call each function.

```python
labelWord()
labelSent()
rmNonConj()
rmLabel()
```
</p>

<br>

****

<br>

<p>

*Final File*

```python
# -*- coding: utf-8 -*-
import xml.etree.ElementTree as ET
import lxml.etree as et
import re

# change FILENAME to local path
FILENAME = "tlg0012.tlg001.perseus-grc1.tb.xml"

# new output file
NEWFILE = "iliad_purposeclauses.xml"

def labelWord():
    tree = ET.parse(FILENAME)
    root = tree.getroot()
    
    for sentence in root.findall(".//sentence"):
        for word in sentence.findall("./word"):
            lemma = word.get('lemma')
            if (lemma == "ἵνα" or lemma == "ὅπως" or lemma == "ὡς" or lemma == "μή" or lemma == "ὄφρα" or lemma == "ἕως"):
                word.set('hasconj', 'T')
            else:
                word.set('hasconj', 'F')
    tree.write(NEWFILE, encoding = "UTF-8")
    
def labelSent():
    tree = ET.parse(NEWFILE)
    root = tree.getroot()
    
    isthereconj = False

    for sentence in root.findall(".//sentence"):
        isthereconj = False
        for word in sentence.findall("./word"):
            hasconj = word.get('hasconj')
            if (hasconj == 'T'):
                isthereconj = True
                sentence.set('hasconj', 'T')
        if (isthereconj == False):
            sentence.set('hasconj', 'F')
    
    tree.write(NEWFILE, encoding = "UTF-8")

def rmNonConj():
    root = et.parse(NEWFILE)

    for sentence in root.xpath(".//sentence[@hasconj='F']"):
        sentence.getparent().remove(sentence)
    
    root.write(NEWFILE, pretty_print = True, encoding = "UTF-8", xml_declaration = True)

def rmLabel():
    with open(NEWFILE, 'r+', encoding = "UTF-8") as f:
        
        # remove labels
        content = f.read()
        content = re.sub('hasconj="." ', r'', content)
        f.seek(0)
        f.write(content)
        
        # add empty lemma attributes
        newcontent = f.read()
        newcontent = re.sub(r'(?<=insertion_id="....." )', r'lemma="" ', content)
        f.seek(0)
        f.write(newcontent)
        f.truncate()
    
labelWord()
labelSent()
rmNonConj()
rmLabel()
```