// ==UserScript==
// @name         JIRA title copy button on board lists.
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add title copy button to issue list.
// @author       Yohei Kokubo
// @match        https://*.atlassian.net/secure/RapidBoard.jspa*
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  // ボタンのテンプレート定義
  const buttonTemplate = {
    name: 'copyButton',
    tag: 'div',
    label: 'コピー',
    className: 'aui-button aui-button-primary js-title-copy-button',
    css: `
      margin-top: 10px;
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
    // DOMが設定されるまで3回まで繰り返して待つ
    const loopMaxCount = 3;
    let currentCount = 0;
    const loopId = setInterval(function() {
      currentCount++;
      if (currentCount > loopMaxCount) {
        clearInterval(loopId);
        return;
      }
      const issues = issueLinkContainer.querySelectorAll('.js-issue');
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
      const buttonNode = createCopyButtonElement(buttonTemplate);

      // コピーボタン設置済みであればskip
      if (issue.querySelectorAll(`[data-name="${buttonNode.dataset.name}"]`).length > 0) {
        // コピーボタン設置済みであればskip
        return;
      }

      // タイトルとチケット番号を取得
      const title = issue.querySelector('.ghx-summary').dataset.tooltip;
      const key = issue.querySelector('.ghx-key').dataset.tooltip;

      // ボタンにコピーボタンが押された時の処理を追加
      buttonNode.onclick = function(){
        // コピーする文字列を作成
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
   * @param {object} buttonTemplate
   * @return {Node}
   */
  function createCopyButtonElement(buttonTemplate) {
    const buttonNode = document.createElement(buttonTemplate.tag);
    buttonNode.dataset.name = buttonTemplate.name;
    buttonNode.className = buttonTemplate.className;
    buttonNode.style.cssText = buttonTemplate.css;
    buttonNode.innerHTML = buttonTemplate.label;
    return buttonNode;
  }

  /**
   * 初期化関数
   *
   * @return {void}
   */
  function initialize() {
    const observer = new MutationObserver(function(mutations) {
      // 課題一覧のコンテナを取得する
      const issueLinkContainer = document.querySelector('.ghx-columns');
      if (!issueLinkContainer) {
        return;
      }
      addCopyButtonToContainer(issueLinkContainer);
      const copyButton = issueLinkContainer.querySelectorAll('.js-title-copy-button');
      if (copyButton.length > 0) {
        observer.disconnect(); // コピーボタンを追加できたら監視解除
      }
    });
    // DOMの変更を検知したら ロード
    observer.observe(document, { childList: true, subtree: true });
  }

  initialize();
})();