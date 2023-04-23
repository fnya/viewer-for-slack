extern crate keyring;
use serde::{Deserialize, Serialize};
use serde_json;
use whoami;

#[derive(Debug, Deserialize, Serialize)]
#[allow(non_snake_case)]
pub struct UserInformation {
    pub userId: String,
    pub refreshToken: String,
    pub refreshTokenExpires: i32,
    pub initialized: bool,
    pub isAdmin: bool,
}

/**
 * クレデンシャルを保存する
 */
pub fn save_credentials(
    user_id: String,
    refresh_token: String,
    refresh_token_expires: i32,
    initialized: bool,
    is_admin: bool,
    service_name: String,
) {
    let user_information = UserInformation {
        userId: user_id,
        refreshToken: refresh_token,
        refreshTokenExpires: refresh_token_expires,
        initialized,
        isAdmin: is_admin,
    };

    let user_name = whoami::username(); // OSのユーザー名を取得する

    let credentials = &serde_json::to_string(&user_information).expect("error");

    // 生成
    let entry = keyring::Entry::new(&service_name, &user_name).expect("error");

    // 保存
    entry.set_password(&credentials).expect("error");
}

/**
 * クレデンシャルを読み込む
 */
pub fn load_credentials(service_name: String) -> String {
    let user_name = whoami::username(); // OSのユーザー名を取得する

    // 生成
    let entry = keyring::Entry::new(&service_name, &user_name).expect("error");

    // 読み込み
    let credentials = entry.get_password().expect("error");

    credentials
}
