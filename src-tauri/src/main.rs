// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod app_config;
mod credential;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            load_app_config,
            save_credentials,
            load_credentials
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn load_app_config() -> app_config::AppConfig {
    app_config::AppConfig::load()
}

#[tauri::command]
fn save_credentials(
    user_id: String,
    refresh_token: String,
    refresh_token_expires: i32,
    initialized: bool,
    is_admin: bool,
    service_name: String,
) {
    credential::save_credentials(
        user_id,
        refresh_token,
        refresh_token_expires,
        initialized,
        is_admin,
        service_name,
    )
}

#[tauri::command]
fn load_credentials(service_name: String) -> String {
    credential::load_credentials(service_name)
}
