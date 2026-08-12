// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod osc;
mod engine;
mod vrc;

use std::sync::Mutex;
use tauri::State;
use engine::graph::{RustGraphRunner, RustGraphNode, RustGraphEdge};
use vrc::config_parser::{VrcConfigScanner, VrcAvatarConfig};

struct AppState {
    runner: Mutex<RustGraphRunner>,
}

#[tauri::command]
fn sync_graph(state: State<'_, AppState>, nodes: Vec<RustGraphNode>, edges: Vec<RustGraphEdge>) -> Result<String, String> {
    let mut runner = state.runner.lock().map_err(|e| e.to_string())?;
    runner.update_topology(nodes, edges);
    Ok("Graph synchronized to Rust low-latency engine".into())
}

#[tauri::command]
fn scan_vrchat_avatar() -> Result<VrcAvatarConfig, String> {
    VrcConfigScanner::scan_latest_avatar()
        .ok_or_else(|| "No VRChat avatar OSC config found".into())
}

#[tauri::command]
fn eval_custom_formula(formula: String, val: f64, time: f64) -> Result<f64, String> {
    engine::expression::CustomExpressionEngine::evaluate_expression(&formula, val, time)
}

fn main() {
    tauri::Builder::default()
        .manage(AppState {
            runner: Mutex::new(RustGraphRunner::new()),
        })
        .invoke_handler(tauri::generate_handler![
            sync_graph,
            scan_vrchat_avatar,
            eval_custom_formula
        ])
        .run(tauri::generate_context!())
        .expect("error while running VRC-Flow tauri application");
}
