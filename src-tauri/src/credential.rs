extern crate keyring;
use serde::{Deserialize, Serialize};
use serde_json;
use whoami;

const SERVICE_NAME: &str = "Viewer for Slack";

#[derive(Debug, Deserialize, Serialize)]
#[allow(non_snake_case)]
pub struct UserInformation {
    pub userId: String,
    pub refreshToken: String,
    pub refreshTokenExpires: i32,
    pub userInitialized: bool,
    pub isAdmin: bool,
    pub appName: String,
    pub webApiUrl: String,
    pub countPerRequest: i32,
    pub workSpaceName: String,
}

/**
 * クレデンシャルを保存する
 */
#[allow(non_snake_case)]
pub fn save_credentials(
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
    let user_information = UserInformation {
        userId,
        refreshToken,
        refreshTokenExpires,
        userInitialized,
        isAdmin,
        appName,
        webApiUrl,
        countPerRequest,
        workSpaceName,
    };

    // OSのユーザー名を取得する
    let user_name = whoami::username();

    // 保存用文字列を作成する
    let credentials = &serde_json::to_string(&user_information);
    let credentials = match credentials {
        Ok(credentials) => credentials,
        Err(_) => {
            return String::from("error");
        }
    };

    // 生成
    let entry = keyring::Entry::new(&SERVICE_NAME, &user_name);
    let entry = match entry {
        Ok(entry) => entry,
        Err(_) => {
            return String::from("error");
        }
    };

    // 保存
    let save = entry.set_password(&credentials);
    let save = match save {
        Ok(_) => "ok",
        Err(_) => "error",
    };

    save.to_string()
}

/**
 * クレデンシャルを読み込む
 */
#[allow(non_snake_case)]
pub fn load_credentials() -> String {
    // OSのユーザー名を取得する
    let user_name = whoami::username();

    // 生成
    let entry = keyring::Entry::new(&SERVICE_NAME, &user_name);
    let entry = match entry {
        Ok(entry) => entry,
        Err(_) => {
            return String::from("error");
        }
    };

    // 読み込み
    let credentials = entry.get_password();
    let credentials = match credentials {
        Ok(credentials) => credentials,
        Err(_) => {
            return String::from("error");
        }
    };

    credentials
}
