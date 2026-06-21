import { z } from "zod";

/**
 * 解析 JSON 语法错误，返回更友好的位置信息。
 */
function parseJsonError(error: unknown): string {
  if (!(error instanceof SyntaxError)) {
    return "JSON 格式错误";
  }

  const message = error.message || "JSON 解析失败";

  // Chrome/V8: "Unexpected token ... in JSON at position 123"
  const positionMatch = message.match(/at position (\d+)/i);
  if (positionMatch) {
    const position = parseInt(positionMatch[1], 10);
    return `JSON 格式错误（位置：${position}）`;
  }

  // Firefox: "JSON.parse: unexpected character at line 1 column 23"
  const lineColumnMatch = message.match(/line (\d+) column (\d+)/i);
  if (lineColumnMatch) {
    const line = lineColumnMatch[1];
    const column = lineColumnMatch[2];
    return `JSON 格式错误：第 ${line} 行，第 ${column} 列`;
  }

  return `JSON 格式错误：${message}`;
}

/**
 * 通用的 JSON 配置文本校验：
 * - 非空
 * - 可解析且为对象（非数组）
 */
export const jsonConfigSchema = z
  .string()
  .min(1, "配置不能为空")
  .superRefine((value, ctx) => {
    try {
      const obj = JSON.parse(value);
      if (!obj || typeof obj !== "object" || Array.isArray(obj)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "需为单个对象配置",
        });
      }
    } catch (e) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: parseJsonError(e),
      });
    }
  });
