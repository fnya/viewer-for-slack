import { Text } from '../types/Text';
import { TextType } from '../types/TextType';

/**
 * 投稿を分割する
 *
 * @param text 投稿
 * @returns 分割後の投稿
 */
export const splitPostText = (text: string): Text[] => {
  let result: Text[] = [];
  result = splitBackQuote(text);
  result = splitMention(result);
  result = fixMarkdownError(result);
  result = fixUrlError(result);

  return result;
};

/**
 * 投稿のコードブロックを分割する
 *
 * @param text 投稿
 * @returns 分割後の投稿
 */
export const splitBackQuote = (text: string): Text[] => {
  // BlockQuote を抽出する正規表現
  const regex = /(```([\w\s]|[ -/:-@[-`{-~]|[^\x01-\x7E\uFF61-\uFF9F])+?```)+/g;
  const matches = text.match(regex);
  const result: Text[] = [];

  if (matches) {
    let startIndex = 0;

    matches.forEach((r) => {
      const matchIndex = text.indexOf(r);

      // マッチ前の文字列がある場合は、配列に追加する
      if (matchIndex > 0) {
        result.push({
          text: text.substring(startIndex, matchIndex),
          textType: TextType.Normal,
        });
      }
      result.push({ text: r, textType: TextType.CodeBlock });

      startIndex = matchIndex + r.length;
    });

    // マッチ後に文字列が残っている場合は、配列に追加する
    if (startIndex < text.length) {
      result.push({
        text: text.substring(startIndex),
        textType: TextType.Normal,
      });
    }
  }

  return result;
};

/**
 * 投稿のメンションを分割する
 *
 * @param text 投稿
 * @returns 分割後の投稿
 */
export const splitMention = (text: Text[]): Text[] => {
  let result: Text[] = [];

  text.forEach((t) => {
    // コードブロックはそのまま追加する
    if (t.textType === TextType.CodeBlock) {
      console.log(t);
      result.push(t);

      return;
    }

    // コードブロック以外にメンション分割を行う
    const regex = /(<!here>|<!channel>|<@[\w\d]+>)/g;
    const matches = t.text.match(regex);

    if (matches) {
      let startIndex = 0;

      matches.forEach((r) => {
        const matchIndex = t.text.indexOf(r);

        // マッチ前の文字列がある場合は、配列に追加する
        if (matchIndex > 0) {
          result.push({
            text: t.text.substring(startIndex, matchIndex),
            textType: TextType.Normal,
          });
        }
        result.push({ text: r, textType: TextType.Mention });

        startIndex = matchIndex + r.length;
      });

      // マッチ後に文字列が残っている場合は、配列に追加する
      if (startIndex < t.text.length) {
        result.push({
          text: t.text.substring(startIndex),
          textType: TextType.Normal,
        });
      }
    } else {
      result.push(t);
    }
  });

  return result;
};

/**
 * 投稿のMarkdownエラーを修正する
 *
 * @param text 投稿
 * @returns エラー修正後の投稿
 */
export const fixMarkdownError = (text: Text[]): Text[] => {
  let result: Text[] = [];

  text.forEach((t) => {
    // Normal以外はそのまま追加する
    if (t.textType !== TextType.Normal) {
      result.push(t);
      return;
    }

    // === と --- は Markdown と判断されるため変換する
    t.text = t.text
      .replaceAll('===', '＝')
      .replaceAll('---', 'ー')
      .replaceAll('==', '＝')
      .replaceAll('--', 'ー');

    // 1. は Markdown と判断されるため変換する
    t.text = t.text.replace(/(\d\.)+/g, '_$1');

    result.push(t);
  });

  return result;
};

/**
 * URL が <https://..|https://..> は表示がおかしくなるので修正する
 *
 * @param text 投稿
 * @returns エラー修正後の投稿
 */
export const fixUrlError = (text: Text[]): Text[] => {
  let result: Text[] = [];

  text.forEach((t) => {
    // Normal以外はそのまま追加する
    if (t.textType !== TextType.Normal) {
      result.push(t);
      return;
    }

    // 問題のある URL を抽出
    let targetUrls = t.text.match(
      /<https?:\/\/([\w!\?/\+\-_~=;\.,\*&@#\$%\(\)'\[\]\|:])+>/g
    );

    let urlConverted = t.text;

    targetUrls?.forEach((url) => {
      // 必ず2件
      const urlMatches = url.match(
        /https?:\/\/([\w!\?/\+\-_~=;\.,\*&@#\$%\(\)'\[])+/g
      );

      // 問題のURLを置換
      urlConverted = urlConverted.replaceAll(url, urlMatches![0]);

      // リンクのURLを作成
      urlConverted = urlConverted.replace(
        urlMatches![0],
        `[${urlMatches![0]}](${urlMatches![0]})`
      );
    });

    result.push({ text: urlConverted, textType: t.textType });
  });

  return result;
};
