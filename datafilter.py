# -*- coding: utf-8 -*-
import xml.etree.ElementTree as ET
import lxml.etree as et
import re

# change FILENAME to local path
FILENAME = "tlg0012.tlg001.perseus-grc1.tb.xml"

# new output file
NEWFILE = "iliad_purposeclauses_v3.xml"

def labelPurpClauses():
    tree = ET.parse(FILENAME)
    root = tree.getroot()

"""     for sentence in root.findall(".//sentence"):
    for word in sentence.findall("./word"):
        lemma = word.get('lemma')
        if (lemma == "ἵνα" or lemma == "ὅπως" or lemma == "ὡς" or lemma == "μή" or lemma == "ὄφρα" or lemma == "ἕως"):
            word.set('hasconj', 'T')
        else:
            word.set('hasconj', 'F')
tree.write(NEWFILE, encoding = "UTF-8") """

    for sentence in root.findall(".//sentence"):
        verbid = 1000001
        conjhead = 1000002
        for word in sentence.findall("./word"):
            lemma = word.get('lemma')
            if ('postag' in word.attrib):
                postag = word.get('postag')
                pos = postag[0]
                
                if (lemma == "ἵνα" or lemma == "ὅπως" or lemma == "ὡς" or lemma == "μή" or lemma == "ὄφρα" or lemma == "ἕως"):
                    conjhead = word.get('head')
                elif (pos == 'v'):
                    verbid = word.get('id')

                if (conjhead == verbid):
                    sentence.set('pclause', 'T')
        if ('pclause' not in sentence.attrib):
            sentence.set('pclause', 'F')

    tree.write(NEWFILE, encoding = "UTF-8")

def rmNonPurpClauses():
    root = et.parse(NEWFILE)

    for sentence in root.xpath(".//sentence[@pclause='F']"):
        sentence.getparent().remove(sentence)
    
    root.write(NEWFILE, pretty_print = True, encoding = "UTF-8", xml_declaration = True)

def rmLabel():
    with open(NEWFILE, 'r+', encoding = "UTF-8") as f:
        
        # remove labels
        content = f.read()
        content = re.sub(r' pclause="."', r'', content)
        f.seek(0)
        f.write(content)
        
        # add empty lemma attributes
        newcontent = f.read()
        newcontent = re.sub(r'(?<=insertion_id="....." )', r'lemma="" ', content)
        f.seek(0)
        f.write(newcontent)
        f.truncate()
    
labelPurpClauses()
rmNonPurpClauses()
rmLabel()