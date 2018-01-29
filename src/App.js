import {
  DiagramEngine,
  DiagramModel,
  DefaultNodeModel,
  LinkModel,
  DefaultPortModel,
  DiagramWidget
} from "storm-react-diagrams";
import * as React from "react";
import { distributeElements } from "./dagre-utils.js";
import './App.css';

const nodeData = [
  {
    name: "Node 1",
    color: "#b7eb8f"
  },
  {
    name: "Node 2",
    color: "#87e8de"
  },
  {
    name: "Node 3",
    color: "#91d5ff"
  },
  {
    name: "Node 4",
    color: "#d3adf7"
  },
  {
    name: "Node 5",
    color: "#ffadd2",
    selected: true
  },
  {
    name: "Node 6",
    color: "#D0D5FD"
  },
  {
    name: "Node 7",
    color: "#FD9AAC"
  },
  {
    name: "Node 8",
    color: "#7EA6FF"
  }
];

const linkData = [
  {
    source: "0",
    target: "2"
  },
  {
    source: "1",
    target: "2"
  },
  {
    source: "2",
    target: "4"
  },
  {
    source: "3",
    target: "4"
  },
  {
    source: "4",
    target: "5"
  },
  {
    source: "5",
    target: "7"
  },
  {
    source: "6",
    target: "7"
  },
  // {
  //   source: "7",
  //   target: "0"
  // }
];

let count = 0;
function linkNode(nodeFrom, nodeTo) {
  //just to get id-like structure
  count++;
  const portFrom = nodeFrom.addPort(new DefaultPortModel(false, `${count}`, "Out"));
  const portTo = nodeTo.addPort(new DefaultPortModel(true, `${count}`, "In"));
  let link = new LinkModel();
  link.setSourcePort(portFrom);
  link.setTargetPort(portTo);
  return link;
}

function createModel(nodeData, linkData) {
  let model = new DiagramModel();

  let nodes = nodeData.map(node => {
    let newNode = new DefaultNodeModel(node.name, node.color);
    //set selected state of current node
    node.selected && newNode.setSelected(true);
    return newNode;
  });

  let links = linkData.map(link => {
    return linkNode(nodes[link.source], nodes[link.target]);
  });

  nodes.forEach(node => {
    model.addNode(node);
  });

  links.forEach(link => {
    model.addLink(link);
  });

  return model;
}

//use dagre
function getDistributedModel(engine, model) {
  const serialized = model.serializeDiagram();
  const distributedSerializedDiagram = distributeElements(serialized);
  //deserialize the model
  let deSerializedModel = new DiagramModel();
  deSerializedModel.deSerializeDiagram(distributedSerializedDiagram, engine);
  return deSerializedModel;
}

export default () => {
  let engine = new DiagramEngine();
  engine.installDefaultFactories();

  let model = getDistributedModel(engine, createModel(nodeData, linkData));
  engine.setDiagramModel(model);

  //model.setLocked(true);

  return <DiagramWidget diagramEngine={engine} />;
};