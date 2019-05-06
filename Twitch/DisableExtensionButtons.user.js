// ==UserScript==
// @name         Disable extension buttons for the Twitch player
// @namespace    https://github.com/CompletelyUnbelievable
// @version      1.0
// @description  Attempts to disable the extensions on the twitch player automatically on Twitch.tv
// @author       CompletelyUnbelievable
// @match        https://www.twitch.tv/*
// @grant        none
// @require      https://raw.githubusercontent.com/melanke/Watch.JS/master/src/watch.js
// @updateURL    https://raw.githubusercontent.com/CompletelyUnbelievable/UserScripts/master/Twitch/DisableExtensionButtons.user.js
// @downloadURL  https://raw.githubusercontent.com/CompletelyUnbelievable/UserScripts/master/Twitch/DisableExtensionButtons.user.js
// ==/UserScript==

(function(){
    'use strict';
    let config={info:{name:'Disable extension buttons for the Twitch player',version:'1.0',debugMode:false}}
    if(config.info.debugMode)console.log(`${config.info.name} version ${config.info.version} has started.`);
    let element=[],extensionName=[],checkExist,timer=false;
    function disableButtons(){
            for(let button of document.querySelectorAll('.extension-taskbar .player-button')){
                if(button!==undefined){
                    element.push(button);
                    button.click();
                    if(document.getElementsByClassName('extension-menu-details__header')[0])extensionName.push(document.getElementsByClassName('extension-menu-details__header')[0].innerText);
                    if(document.getElementsByClassName('qa-toggle-label')[0]){
                        for(let label of document.getElementsByClassName('qa-toggle-label')){
                            if(label.innerText==='Visible'&&label.parentNode.parentNode.getElementsByClassName('qa-input-checkbox')[0].checked){
                                label.parentNode.parentNode.getElementsByClassName('pl-toggle__button')[0].click();
                            }
                        }
                    }
                    button.click();
                }
            }
    }
    function handler(propName,change,newValue,oldValue){
        if(change!==undefined&&config.info.debugMode)console.log(`Object value change triggered: ${propName}'s ${change} value changed from ${oldValue} to ${newValue}`);
        else if(change===undefined&&config.info.debugMode)console.log('Initialized');
        if(timer===false&&window.location.href.includes('twitch.tv')&&!window.location.href.includes('clips.twitch.tv')&&!window.location.href.endsWith('twitch.tv/')){
            timer=true;
            checkExist=setInterval(function(){
                if(document.querySelectorAll('.extension-taskbar .player-button').length){
                    timer=false;
                    if(config.info.debugMode)console.log("Exists!");
                    disableButtons();
                    clearInterval(checkExist);
                }
            },100);
        }
    }
    handler();
    if(window.watch)watch(window.location,['href'],handler);
    if(config.info.debugMode)console.log(`${config.info.name} version ${config.info.version} has finished loading.`);
})();
