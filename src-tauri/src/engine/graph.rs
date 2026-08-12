use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use super::expression::CustomExpressionEngine;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RustGraphNode {
    pub id: String,
    pub node_type: String,
    pub data: HashMap<String, serde_json::Value>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RustGraphEdge {
    pub id: String,
    pub source: String,
    pub source_handle: Option<String>,
    pub target: String,
    pub target_handle: Option<String>,
}

pub struct RustGraphRunner {
    nodes: HashMap<String, RustGraphNode>,
    edges: Vec<RustGraphEdge>,
}

impl RustGraphRunner {
    pub fn new() -> Self {
        Self {
            nodes: HashMap::new(),
            edges: Vec::new(),
        }
    }

    pub fn update_topology(&mut self, nodes: Vec<RustGraphNode>, edges: Vec<RustGraphEdge>) {
        self.nodes.clear();
        for node in nodes {
            self.nodes.insert(node.id.clone(), node);
        }
        self.edges = edges;
    }

    pub fn process_signal(&self, address: &str, in_val: f32, time_sec: f64) -> Vec<(String, String, u16, f32)> {
        let mut outputs = Vec::new();

        // 1. Find matching Receiver Input nodes
        for node in self.nodes.values() {
            if node.node_type == "inputNode" {
                if let Some(addr_val) = node.data.get("address") {
                    if addr_val.as_str() == Some(address) {
                        // Trace signals downstream through graph
                        self.trace_downstream(&node.id, in_val, time_sec, &mut outputs);
                    }
                }
            }
        }

        outputs
    }

    fn trace_downstream(&self, current_node_id: &str, current_val: f32, time_sec: f64, results: &mut Vec<(String, String, u16, f32)>) {
        // Find outgoing edges from current_node_id
        for edge in &self.edges {
            if edge.source == current_node_id {
                if let Some(target_node) = self.nodes.get(&edge.target) {
                    let computed_val = match target_node.node_type.as_str() {
                        "mathNode" => self.eval_math(target_node, current_val),
                        "expressionNode" => self.eval_expression(target_node, current_val, time_sec),
                        "logicNode" => self.eval_logic(target_node, current_val),
                        _ => current_val,
                    };

                    if target_node.node_type == "outputNode" {
                        let target_ip = target_node.data.get("targetIp")
                            .and_then(|v| v.as_str())
                            .unwrap_or("127.0.0.1")
                            .to_string();

                        let target_addr = target_node.data.get("address")
                            .and_then(|v| v.as_str())
                            .unwrap_or("/avatar/parameters/Output")
                            .to_string();

                        let target_port = target_node.data.get("port")
                            .and_then(|v| v.as_u64())
                            .unwrap_or(9000) as u16;

                        results.push((target_ip, target_addr, target_port, computed_val));
                    } else {
                        // Recursively propagate through middle nodes
                        self.trace_downstream(&target_node.id, computed_val, time_sec, results);
                    }
                }
            }
        }
    }

    fn eval_math(&self, node: &RustGraphNode, val: f32) -> f32 {
        let op = node.data.get("operation").and_then(|v| v.as_str()).unwrap_or("remap");
        match op {
            "remap" => {
                let in_min = node.data.get("inMin").and_then(|v| v.as_f64()).unwrap_or(0.0) as f32;
                let in_max = node.data.get("inMax").and_then(|v| v.as_f64()).unwrap_or(100.0) as f32;
                let out_min = node.data.get("outMin").and_then(|v| v.as_f64()).unwrap_or(0.0) as f32;
                let out_max = node.data.get("outMax").and_then(|v| v.as_f64()).unwrap_or(1.0) as f32;

                if (in_max - in_min).abs() < 0.00001 {
                    return out_min;
                }
                let norm = (val - in_min) / (in_max - in_min);
                let clamped = norm.clamp(0.0, 1.0);
                out_min + clamped * (out_max - out_min)
            }
            "multiply" => {
                let scale = node.data.get("inMax").and_then(|v| v.as_f64()).unwrap_or(1.0) as f32;
                val * scale
            }
            "clamp" => val.clamp(0.0, 1.0),
            _ => val,
        }
    }

    fn eval_expression(&self, node: &RustGraphNode, val: f32, time_sec: f64) -> f32 {
        let formula = node.data.get("formula")
            .and_then(|v| v.as_str())
            .unwrap_or("(in1 * 0.8) + (sin(time) * 0.2)");

        match CustomExpressionEngine::evaluate_expression(formula, val as f64, time_sec) {
            Ok(res) => res as f32,
            Err(_) => val,
        }
    }

    fn eval_logic(&self, node: &RustGraphNode, val: f32) -> f32 {
        let threshold = node.data.get("threshold").and_then(|v| v.as_f64()).unwrap_or(0.5) as f32;
        if val >= threshold { 1.0 } else { 0.0 }
    }
}
