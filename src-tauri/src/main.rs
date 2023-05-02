// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod credential;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![save_credentials, load_credentials])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
#[allow(non_snake_case)]
fn save_credentials(
    userId: String,
    refreshToken: String,
    refreshTokenExpires: i32,
    userInitialized: bool,
    isAdmin: bool,
    appName: String,
    webApiUrl: String,
    countPerRequest: i32,
    workSpaceName: String,
) -> String {
    credential::save_credentials(
        userId,
        refreshToken,
        refreshTokenExpires,
        userInitialized,
        isAdmin,
        appName,
        webApiUrl,
        countPerRequest,
        workSpaceName,
    )
}

#[tauri::command]
fn load_credentials() -> String {
    credential::load_credentials()
}
