// ==UserScript==
// @name         JIRA title copy button on issue link lists.
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add title copy button to issue list.
// @author       Yohei Kokubo
// @match        https://*.atlassian.net/browse/*
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  // ボタンのテンプレート定義
  const buttonTemplate = {
    tag: 'div',
    label: 'コピー',
    className: 'aui-button aui-button-primary',
    css: `
      position: absolute;
      top: 0px;
      right: 0px;
      font-size: 10px;
    `
  }

  /**
   * 課題一覧のコンテナを指定し コンテナ内の課題リンクにコピーボタンを配置する
   *
   * @param {Node} issueLinkContainer
   * @return {void}
   */
  function addCopyButtonToContainer(issueLinkContainer) {
    // 非同期でDOMが設定される
    // DOMが設定されるまで繰り返して待つ
    const loopId = setInterval(function() {
      const issueList = issueLinkContainer.querySelector('.issue-list');
      const issues = issueList.querySelectorAll('li');
      if (issues.length > 0) {
        clearInterval(loopId);
        addCopyButton(issues);
      }
    }, 3000);
  }

  /**
   * 課題リストの課題毎にコピーボタンを配置する
   *
   * @param {NodeList} issues
   * @return {void}
   */
  function addCopyButton(issues) {
    Array.prototype.forEach.call(issues, issue => {
      // 課題毎にボタンを作成する
      const buttonNode = createCopyButtonElement(
        buttonTemplate.tag,
        buttonTemplate.className,
        buttonTemplate.css,
        buttonTemplate.label
      );

      // ボタンにコピーボタンが押された時の処理を追加
      buttonNode.onclick = function(){
        // コピーする文字列を作成
        const title = issue.title;
        const key = issue.dataset.key;
        const copiedString = `${key}_${title}`;

        // コピー用のDOMを作り 選択状態にする
        const domForClipboard = document.createElement('div');
        domForClipboard.appendChild(document.createElement('pre')).textContent = copiedString;
        domForClipboard.style.cssText = `
          position: fixed;
          left: -100%;
        `;
        document.body.appendChild(domForClipboard);
        document.getSelection().selectAllChildren(domForClipboard);

        // 選択したコピー用のDOMをコピーする
        const result = document.execCommand('copy');

        // コピー用のDOMを削除
        document.body.removeChild(domForClipboard);

        return result;
      };
      issue.appendChild(buttonNode);
    });
  }

  /**
   * 指定のタグ、クラス、CSS、ラベルでボタンのNodeを作成する
   *
   * @param {string} tag
   * @param {string} className
   * @param {string} css
   * @param {string} label
   * @return {Node}
   */
  function createCopyButtonElement(tag, className, css, label) {
    const buttonNode = document.createElement(tag);
    buttonNode.className = className;
    buttonNode.style.cssText = css;
    buttonNode.innerHTML = label;
    return buttonNode;
  }

  /**
   * 初期化関数
   *
   * @return {void}
   */
  function initialize() {
    // 現在のURL
    let href = location.href;

    // 課題一覧のコンテナを取得する
    const issueLinkContainer = document.querySelector('.search-results');
    if (!issueLinkContainer) {
      return;
    }

    // 課題一覧の課題部分にコピーボタンを追加する
    addCopyButtonToContainer(issueLinkContainer);

    // リロードせずにURLが変わった場合の処理
    const observer = new MutationObserver(function(mutations) {
      if(href !== location.href) {
        // URLが変わったら 新しくコピーボタンを追加する
        href = location.href;
        addCopyButtonToContainer(issueLinkContainer);
      }
    });
    // DOMの変更を検知したら URLが変更されたと判定する
    observer.observe(document, { childList: true, subtree: true });
  }

  initialize();
})();