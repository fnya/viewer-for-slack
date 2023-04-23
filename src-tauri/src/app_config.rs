use config::Config;
use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
#[allow(non_snake_case)]
#[serde(rename_all = "camelCase")]
pub struct AppConfig {
    pub name: String,
    pub url: String,
    pub countPerRequest: u32,
    pub workSpaceName: String,
}

impl AppConfig {
    // 設定ファイルを読み込む
    pub fn load() -> AppConfig {
        let config_file = "src/config/settings";

        Config::builder()
            .add_source(config::File::with_name(config_file))
            .build()
            .unwrap()
            .try_deserialize::<AppConfig>()
            .unwrap()
    }
}
