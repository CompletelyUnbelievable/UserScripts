// ==UserScript==
// @name         Disable extension buttons for the Twitch player
// @namespace    https://github.com/CompletelyUnbelievable
// @version      1.1
// @description  Attempts to disable the extensions on the twitch player automatically on Twitch.tv
// @author       CompletelyUnbelievable
// @match        https://www.twitch.tv/*
// @grant        none
// @require      https://raw.githubusercontent.com/melanke/Watch.JS/master/src/watch.js
// @updateURL    https://raw.githubusercontent.com/CompletelyUnbelievable/UserScripts/master/Twitch/DisableExtensionButtons.user.js
// @downloadURL  https://raw.githubusercontent.com/CompletelyUnbelievable/UserScripts/master/Twitch/DisableExtensionButtons.user.js
// ==/UserScript==
var global=global||globalThis||window;
class TwitchDisable{

    static onStart(){
        this.config={debug:false,timer:false,info:{name:'Disable extension buttons for the Twitch player',version:'1.1'}}; //Temp settings.
        if(this.config.debug)console.log(`${this.config.info.name} version ${this.config.info.version} has started.`);
        this.handler(); //Call for the initial page.
        if(window.watch)watch(window.location,['href'],this.handler.bind(this)); //Then call on every other page.
        if(this.config.debug){
            console.log(`${this.config.info.name} version ${this.config.info.version} has finished loading.`);
            global.TwitchDisable=TwitchDisable;//make the class publicly accessable for testing purposes.
        }
    }

    static disableButtons(){
        let element=[],extensionName=[];
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

    static handler(propName,change,newValue,oldValue){
        let checkExist;
        if(change!==undefined&&this.config.debug)console.log(`Object value change triggered: ${propName}'s ${change} value changed from ${oldValue} to ${newValue}`); //Happens every time except the first.
        else if(change===undefined&&this.config.debug)console.log('Initialized'); //First time only.
        if(!this.config.timer&&window.location.href.includes('twitch.tv')&&!window.location.href.includes('clips.twitch.tv')&&!window.location.href.endsWith('twitch.tv/')){
            this.config.timer=true;
            checkExist=setInterval(function(){
                if(document.querySelectorAll('.extension-taskbar .player-button').length){
                    this.config.timer=false;
                    if(this.config.debug)console.log("Exists!");
                    this.disableButtons();
                    clearInterval(checkExist);
                }
            }.bind(this),100);
        }
    }

}//End of class.

(function(){ //Invoke the class
    'use strict';
    TwitchDisable.onStart();
})();
