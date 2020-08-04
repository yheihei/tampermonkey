# Tampermonkey用スクリプト
## Tampermonkeyとは
Chromeの拡張機能です。指定のページを開いた時に動作するJavaScriptを設定することができます。  
詳しい説明は下記が参考になります。  
[手軽に拡張機能を作れる「Tampermonkey」を使ってみた](https://rightcode.co.jp/blog/information-technology/tampermonkey-google-chrome-extended-function)  

## 例えば何ができるか
[JIRA課題リスト用コピーボタン追加](https://github.com/yheihei/tampermonkey/blob/master/jira/copyIssueTitle.js)  
のスクリプトをTampermonkeyで使用すると、JIRAの課題リストを開いた時に、チケット番号とタイトルのコピーボタンが追加されます。  
  
![コピーボタン追加 on JIRA](https://raw.githubusercontent.com/yheihei/tampermonkey/master/doc/image/copyIssueTitle.png)  
