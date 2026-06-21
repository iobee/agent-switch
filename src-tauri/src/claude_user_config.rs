use serde_json::Value;
use std::fs;
use std::path::Path;

use crate::config::{atomic_write, get_claude_user_config_path};
use crate::error::AppError;

fn read_json_value(path: &Path) -> Result<Value, AppError> {
    if !path.exists() {
        return Ok(serde_json::json!({}));
    }

    let content = fs::read_to_string(path).map_err(|e| AppError::io(path, e))?;
    serde_json::from_str(&content).map_err(|e| AppError::json(path, e))
}

fn write_json_value(path: &Path, value: &Value) -> Result<(), AppError> {
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent).map_err(|e| AppError::io(parent, e))?;
    }

    let json =
        serde_json::to_string_pretty(value).map_err(|e| AppError::JsonSerialize { source: e })?;
    atomic_write(path, json.as_bytes())
}

/// 在 Claude Code 用户配置中写入 hasCompletedOnboarding=true。
pub fn set_has_completed_onboarding() -> Result<bool, AppError> {
    let path = get_claude_user_config_path();
    let mut root = read_json_value(&path)?;

    let obj = root
        .as_object_mut()
        .ok_or_else(|| AppError::Config("Claude 用户配置根必须是对象".into()))?;

    let already = obj
        .get("hasCompletedOnboarding")
        .and_then(|v| v.as_bool())
        .unwrap_or(false);
    if already {
        return Ok(false);
    }

    obj.insert("hasCompletedOnboarding".into(), Value::Bool(true));
    write_json_value(&path, &root)?;
    Ok(true)
}

/// 删除 Claude Code 用户配置中的 hasCompletedOnboarding 字段。
pub fn clear_has_completed_onboarding() -> Result<bool, AppError> {
    let path = get_claude_user_config_path();
    if !path.exists() {
        return Ok(false);
    }

    let mut root = read_json_value(&path)?;
    let obj = root
        .as_object_mut()
        .ok_or_else(|| AppError::Config("Claude 用户配置根必须是对象".into()))?;

    let existed = obj.remove("hasCompletedOnboarding").is_some();
    if !existed {
        return Ok(false);
    }

    write_json_value(&path, &root)?;
    Ok(true)
}
