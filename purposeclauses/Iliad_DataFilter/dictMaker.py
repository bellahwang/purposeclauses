# -*- coding: utf-8 -*-
import xml.etree.ElementTree as ET
import networkx as nx
import matplotlib.pyplot as plt
import os.path
import json
from networkx.readwrite import json_graph

# change FILENAME to local path
FILENAME = "iliad_purposeclauses.xml"
LOCALROOT = '/Users/bellahwang/Documents/GitHub'

def makeIdDict(givenSentID):
    tree = ET.parse(FILENAME)
    root = tree.getroot()
    IdDict = {}
    
    for sentence in root.findall(".//sentence"):
        loopingSentID = sentence.get('id')
        if (loopingSentID == givenSentID):
            for word in sentence.findall("./word"):
                form = word.get('form')
                wordID = word.get('id')
                newForm = form + '_' + wordID
                IdDict[wordID] = newForm
            
    return IdDict

def makeHeadDict(givenSentID):
    tree = ET.parse(FILENAME)
    root = tree.getroot()
    HeadDict = {}
    
    for sentence in root.findall(".//sentence"):
        loopingSentID = sentence.get('id')
        if (loopingSentID == givenSentID):
            for word in sentence.findall("./word"):
                form = word.get('form')
                wordID = word.get('id')
                newForm = form + '_' + wordID
                wordHead = word.get('head')
                HeadDict[newForm] = wordHead
    
    return HeadDict

def matchDicts(IdDict, HeadDict):
    
    IdFormList = returnIdFormList(IdDict)
    HeadFormList = returnHeadFormList(IdDict, HeadDict)
    MatchedDict = dict(zip(IdFormList, HeadFormList))

    return MatchedDict

def returnIdFormList(IdDict):
    IdFormList = []
    for x in IdDict:
        IdForm = IdDict[x]
        IdFormList.append(IdForm)
        IdForm = None
    return IdFormList

def returnHeadFormList(IdDict, HeadDict):
    HeadFormList = []
    for x in IdDict:
        IdForm = IdDict[x]
        head = HeadDict[IdForm]
        if(head != '0'):
            headForm = IdDict[head]
            HeadFormList.append(headForm)
            headForm = None
        elif(head == '0'):
            HeadFormList.append('ROOT')
    return HeadFormList

def nodeMaker(givenSentID):
    G = nx.MultiDiGraph()

    tree = ET.parse(FILENAME)
    root = tree.getroot()

    for sentence in root.findall(".//sentence"):
        loopingSentID = sentence.get('id')
        if (loopingSentID == givenSentID):
            for word in sentence.findall("./word"):
                wordID = word.get('id')
                wordForm = word.get('form')
                wordLemma = word.get('lemma')
                wordHead = word.get('head')
                wordRelation = word.get('relation')
                newForm = wordForm + '_' + wordID
                if ('postag' in word.attrib):
                    wordPostag = word.get('postag')
                    wordCite = word.get('cite')
                    G.add_node(newForm, wID = wordID, form = wordForm, lemma = wordLemma, postag = wordPostag, head = wordHead, relation = wordRelation, cite = wordCite)
                else:
                    G.add_node(newForm, wID = wordID, form = wordForm, head = wordHead, relation = wordRelation)
                
                wordID = None
                wordForm = None
                wordLemma = None
                wordHead = None
                wordRelation = None
                wordPostag = None
                wordCite = None
    G.add_node('ROOT', wID = '0')
    return G

def edgeMaker(G, MatchedDict, givenSentID):
    tree = ET.parse(FILENAME)
    root = tree.getroot()
    
    for sentence in root.findall(".//sentence"):
        loopingSentID = sentence.get('id')
        if (loopingSentID == givenSentID):
            for word in sentence.findall("./word"):
                wordForm = word.get('form')
                wordID = word.get('id')
                wordRelation = word.get('relation')
                newForm = wordForm + '_' + wordID
                if (newForm in MatchedDict):
                    isDependentOn = MatchedDict[newForm]
                    G.add_edge(isDependentOn, newForm, relation = wordRelation)
    return G

def makeDict(givenSentID):
    IdDict = makeIdDict(givenSentID)
    HeadDict = makeHeadDict(givenSentID)
    MatchedDict = matchDicts(IdDict, HeadDict)
    return MatchedDict

def makeNetwork(givenSentID):
    MatchedDict = makeDict(givenSentID)

    G = nodeMaker(givenSentID)
    H = edgeMaker(G, MatchedDict, givenSentID)
    return H

def createGraphML():
    tree = ET.parse(FILENAME)
    root = tree.getroot()
    
    
    save_path  = os.path.join(LOCALROOT, 'purposeclauses', 'Iliad_JSON')
    for sentence in root.findall(".//sentence"):
        sentID = sentence.get('id')
        G = makeNetwork(sentID)
        name_of_file = "Iliad" + sentID + "pc"
        completeName = os.path.join(save_path, name_of_file + ".graphml") 
        nx.write_graphml(G, completeName, encoding = 'UTF-8', prettyprint = True)

def createJSON():

    tree = ET.parse(FILENAME)
    root = tree.getroot()
    
    save_path  = os.path.join(LOCALROOT, 'purposeclauses', 'Iliad_JSON')
    for sentence in root.findall(".//sentence"):
        sentID = sentence.get('id')
        G = makeNetwork(sentID)
        name_of_file = "Iliad" + sentID + "pc"
        completeName = os.path.join(save_path, name_of_file + ".json") 
        data = json_graph.node_link_data(G)
        with open(completeName, 'w', encoding='utf8') as json_file:
            json.dump(data, json_file, ensure_ascii=False, indent = 4)
        completeName = None

def createJSONTree():
    
    tree = ET.parse(FILENAME)
    root = tree.getroot()
    
    save_path  = os.path.join(LOCALROOT, 'purposeclauses', 'Iliad_JSON')

    for sentence in root.findall(".//sentence"):
        sentID = sentence.get('id')
        G = makeNetwork(sentID)
        name_of_file = "Iliad" + sentID + "pc"
        completeName = os.path.join(save_path, name_of_file + ".json") 
        data = json_graph.tree_data(G, root='ROOT')
        with open(completeName, 'w', encoding='utf8') as json_file:
            json.dump(data, json_file, ensure_ascii=False, indent = 4)
        completeName = None

# H = makeNetwork('2274115')
# IdDict = makeIdDict('2274115')
# HeadDict = makeHeadDict('2274115')

createJSONTree()

#createGraphML()
#createJSON()
# createGraphMLs(MatchedDict)
# nx.draw(H)