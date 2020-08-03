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
  console.log('JIRA title copy button on issue link lists');
  const issueLinkContainers = document.querySelectorAll('.list-results-panel');
  if (!issueLinkContainers.length) {
      return;
  }
  
  Array.prototype.forEach.call(issueLinkContainers, issueLinkContainer => {
      console.log('container:');
      console.log(issueLinkContainer);

      const loopId = setInterval(function() {
          const issueList = issueLinkContainer.querySelector('.issue-list');
          const issues = issueList.querySelectorAll('li');
          if (issues.length > 0) {
              clearInterval(loopId);
              addCopyButton(issues);
          }
      }, 3000);
  });
  
  function addCopyButton(issues) {
      Array.prototype.forEach.call(issues, issue => {
          const buttonNode = document.createElement('div');
          buttonNode.classList.add('aui-button');
          buttonNode.classList.add('aui-button-primary');
          buttonNode.style.position = "absolute";
          buttonNode.style.top = "0";
          buttonNode.style.right = "0";
          buttonNode.style.fontSize = "10px";
          buttonNode.innerHTML = 'コピー';
          // buttonNode.setAttribute('onclick', execCopy);
          buttonNode.onclick = function(){
              console.log('コピー');
              const title = issue.title;
              const key = issue.dataset.key;
              const string = `${key}_${title}`;
              console.log(string);
  
              let temp = document.createElement('div');
      
              temp.appendChild(document.createElement('pre')).textContent = string;
      
              let s = temp.style;
              s.position = 'fixed';
              s.left = '-100%';
      
              document.body.appendChild(temp);
              document.getSelection().selectAllChildren(temp);
      
              let result = document.execCommand('copy');
      
              document.body.removeChild(temp);
              // true なら実行できている falseなら失敗か対応していないか
              return result;
          };
          issue.appendChild(buttonNode);
      });
  }
})();