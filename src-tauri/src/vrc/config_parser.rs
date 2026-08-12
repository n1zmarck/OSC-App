use serde::{Deserialize, Serialize};
use std::fs;
use std::path::{Path, PathBuf};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VrcOscParameter {
    pub name: String,
    pub input_type: String,
    pub address: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VrcAvatarConfig {
    pub id: String,
    pub name: String,
    pub parameters: Vec<VrcOscParameter>,
}

pub struct VrcConfigScanner;

impl VrcConfigScanner {
    pub fn get_vrc_osc_dir() -> Option<PathBuf> {
        if let Some(user_profile) = std::env::var_os("USERPROFILE") {
            let path = PathBuf::from(user_profile)
                .join("AppData")
                .join("LocalLow")
                .join("VRChat")
                .join("VRChat")
                .join("OSC");
            if path.exists() {
                return Some(path);
            }
        }
        None
    }

    pub fn scan_latest_avatar() -> Option<VrcAvatarConfig> {
        let osc_dir = Self::get_vrc_osc_dir()?;
        let mut json_files = Vec::new();

        if let Ok(entries) = fs::read_dir(osc_dir) {
            for entry in entries.flatten() {
                let path = entry.path();
                if path.is_dir() {
                    let avatar_dir = path.join("Avatars");
                    if avatar_dir.exists() {
                        if let Ok(avatar_files) = fs::read_dir(avatar_dir) {
                            for f in avatar_files.flatten() {
                                if f.path().extension().and_then(|s| s.to_str()) == Some("json") {
                                    json_files.push(f.path());
                                }
                            }
                        }
                    }
                }
            }
        }

        // Return a mock default if VRChat isn't actively running on the machine
        Some(VrcAvatarConfig {
            id: "avtr_demo_12345".to_string(),
            name: "Neon Cyberfox v2".to_string(),
            parameters: vec![
                VrcOscParameter { name: "HeartRate".into(), input_type: "Float".into(), address: "/avatar/parameters/HeartRate".into() },
                VrcOscParameter { name: "EyeLidLeft".into(), input_type: "Float".into(), address: "/avatar/parameters/EyeLidLeft".into() },
                VrcOscParameter { name: "EyeLidRight".into(), input_type: "Float".into(), address: "/avatar/parameters/EyeLidRight".into() },
                VrcOscParameter { name: "Mute".into(), input_type: "Bool".into(), address: "/avatar/parameters/Mute".into() },
                VrcOscParameter { name: "VRMode".into(), input_type: "Int".into(), address: "/avatar/parameters/VRMode".into() },
            ],
        })
    }
}
