// ==UserScript==
// @name         Twitch Overlay Disable
// @namespace    https://github.com/CompletelyUnbelievable
// @updateURL    https://raw.githubusercontent.com/CompletelyUnbelievable/UserScripts/master/Twitch/TwitchOverlayDisable.user.js
// @version      1.3
// @description  Attempts to disable the overlay extensions on the twitch player automatically on Twitch.tv
// @author       CompletelyUnbelievable
// @match        https://www.twitch.tv/*
// @run-at       document-start
// @grant        none
// @require      https://raw.githubusercontent.com/melanke/Watch.JS/master/src/watch.js
// ==/UserScript==

var global=global||globalThis||window;

class TwitchOverlayDisable{

    static constructor(){
        this.template=this.parseHTML(`<template></template>`)[0];//Storage away form the document
        this.observerObj=this.defineObserver();
        this.styleSheet=this.parseHTML(`<style>.player-root .extensions-dock__layout{display:none!important;}</style>`)[0];
        this.playerButton=this.parseHTML(`<button class="TwitchOverlayDisable player-button" type="button"><span class="player-tip js-control-tip" data-tip="Click to Hide Extension Button(s)"></span><span class="pl-settings-icon"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 950 950" style="enable-background:new 0 0 487.7 487.7;display:block;top:calc(50% - 12.5px);left:calc(50% - 8.12px);" xml:space="preserve"><g><g><path d="M448.15,322.8c-9,8-21.8,4.5-21.8-11.1v-37.5c0-11.3-9.3-20.6-20.6-20.6h-26.3c3,6.1,4.6,12.7,4.6,19.3 c0,23.1-18,40.6-42.8,41.6h-0.8h-0.8c-24.8-1-42.8-18.5-42.8-41.6c0-6.7,1.6-13.3,4.6-19.3h-27.4h-0.1h-0.4 c-11.1,0-20.2,9-20.2,20.2v37.9c0,15.6-13,19-22,11.1c-14.9-13.1-37.6-6.1-38.6,17.8c1,23.9,23.7,30.9,38.5,17.8 c9-8,22.1-4.5,22.1,11.1v37.1c0,11.1,9,20.2,20.2,20.2h37.6c15.6,0,19,13.1,11.1,22.1c-13.1,14.9-6.1,37.8,17.8,38.8 c23.9-1,30.9-23.9,17.8-38.8c-8-9-4.5-22.2,11.1-22.2h37.4c11.1,0,20.2-9,20.2-20.2v-37.1c0-15.6,12.7-19,21.7-11.1 c14.7,13.1,37.4,6.1,38.4-17.7C485.65,316.7,463.05,309.7,448.15,322.8z"/></g></g><g><g><path d="M448.35,129.3c-9,8-22.2,4.5-22.2-11.1V81c0-11.1-9-20.2-20.2-20.2h-37.1c-15.6,0-19-12.7-11.1-21.7 c13.1-14.9,6.1-37.6-17.8-38.6c-23.9,1-30.9,23.6-17.8,38.5c8,9,4.5,21.8-11.1,21.8h-37.5c-11.3,0-20.6,9.3-20.6,20.6v26.3 c6.1-3,12.7-4.6,19.3-4.6c23.2,0,40.7,18,41.7,42.8v0.8v0.8c-1,24.8-18.5,42.8-41.6,42.8c-6.7,0-13.3-1.6-19.3-4.6v27.4v0.1v0.4 c0,11.1,9,20.2,20.2,20.2h37.9c15.6,0,19,13,11.1,22c-13.1,14.9-6.1,37.6,17.8,38.6c23.9-1,30.9-23.7,17.8-38.5 c-8-9-4.5-22.1,11.1-22.1h37.1c11.1,0,20.2-9,20.2-20.2V176c0-15.6,13.1-19,22.1-11.1c14.9,13.1,37.8,6.1,38.8-17.8 C486.15,123.2,463.25,116.2,448.35,129.3z"/></g></g><g><g><path d="M214.45,253.3h-37.9c-15.6,0-19-13-11.1-22c13.1-14.9,6.1-37.6-17.8-38.6c-23.9,1-30.9,23.7-17.8,38.5 c8,9,4.5,22.1-11.1,22.1h-37.1c-11.1,0-20.2,9-20.2,20.2v37.6c0,15.6-13.1,19-22.1,11.1c-14.9-13.1-37.8-6.1-38.8,17.8 c0.9,23.7,23.9,30.7,38.7,17.6c9-8,22.2-4.5,22.2,11.1v37.4c0,11.1,9,20.2,20.2,20.2h37.1c15.6,0,19,12.7,11.1,21.7 c-13.1,14.9-6.1,37.6,17.8,38.6c23.9-1,30.9-23.6,17.8-38.5c-8-9-4.5-21.8,11.1-21.8h37.5c11.3,0,20.6-9.3,20.6-20.6v-26.3 c-6.1,3-12.7,4.6-19.3,4.6c-23.1,0-40.6-18-41.6-42.8v-0.8v-0.8c1-24.8,18.5-42.8,41.6-42.8c6.7,0,13.3,1.6,19.3,4.6V274v-0.1 v-0.4C234.65,262.4,225.65,253.3,214.45,253.3z"/></g></g><g><g><path d="M256.45,129.2c-9,8-22.1,4.5-22.1-11.1v-37c0-11.1-9-20.2-20.2-20.2h-37.6c-15.6,0-19-13.1-11.1-22.1 c13.1-14.9,6.1-37.8-17.8-38.8c-23.9,1-30.9,23.9-17.8,38.8c8,9,4.5,22.2-11.1,22.2h-37.2c-11.1,0-20.2,9-20.2,20.2v37.1 c0,15.6-12.7,19-21.7,11.1c-14.9-13.1-37.6-6.1-38.6,17.8c1,23.7,23.6,30.7,38.5,17.6c9-8,21.8-4.5,21.8,11.1v37.5 c0,11.3,9.3,20.6,20.6,20.6h26.3c-3-6.1-4.6-12.7-4.6-19.3c0-23.1,18-40.6,42.8-41.6h0.8h0.8c24.8,1,42.8,18.5,42.8,41.6 c0,6.7-1.6,13.3-4.6,19.3h27.4h0.1h0.4c11.1,0,20.2-9,20.2-20.2v-37.9c0-15.6,13-19,22-11.1c14.9,13.1,37.6,6.1,38.6-17.8 C293.95,123.1,271.25,116.1,256.45,129.2z"/></g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg></span></button>`)[0];
        this.playerButton.addEventListener('click',function(){if(document.contains(this.styleSheet))this.template.prepend(this.styleSheet);else document.head.append(this.styleSheet);}.bind(this));
        this.config={debug:false,debugClick:false,observerDebug:false,href:global.location.href,timer:false,info:{name:'TwitchOverlayDisable',description:'Disable extension buttons for the Twitch player',version:'1.3'}}; //Temp settings.
    }

    static onStart(){
        this.constructor();
        console.log(`[${this.config.info.name}] v${this.config.info.version} has started.`);

        if(this.config.debug){
            this.detectPageChange();
            global.TwitchOverlayDisable=TwitchOverlayDisable;//Make the class publicly accessable for testing purposes.
        }
        if(this.config.debugClick){
            this.clickEvent=function(e){console.log(e.target,[e])};
            document.body.addEventListener('click',this.clickEvent,true);
        }
        //console.log(`[${this.config.info.name}] version ${this.config.info.version} has finished loading.`);
    }

    static detectPageChange(){
        this.handler();//Call for the initial page.
        if(global.watch)global.watch(global.location,['href'],this.handler.bind(this));
    }

    static handler(propName,change,newValue,oldValue){
        if(change!==undefined)console.log(`[${this.config.info.name}] Object value change triggered: ${propName}'s ${change} value changed from ${oldValue} to ${newValue}.`); //Happens every time except the first.
        else console.log(`[${this.config.info.name}] Initialized.`);
    }

    static defineObserver(){
        this.removeObserver();
        var observer=new MutationObserver(function(mutations){
            mutations.forEach(function(mutation){
                if(!mutation.addedNodes||mutation.addedNodes.length===0)return;
                this.observer(mutation);
            }.bind(this));
        }.bind(this));
        observer.observe(document,{childList:true,subtree:true,attributes:false,characterData:false});
        return observer;
    }

    static removeObserver(){
        if(this.observerObj)this.observerObj.disconnect();
    }

    static observer({addedNodes}){
        if(addedNodes&&addedNodes[0]&&addedNodes[0] instanceof Element){
            let areExtensions=addedNodes[0].querySelector('.extensions-dock__dock img.tw-image');
            if(this.config.observerDebug)console.log(addedNodes[0]);
            if('https://www.twitch.tv/'!==global.location.href&&this.config.href!==global.location.href&&!areExtensions){
                this.config.href=global.location.href;
                this.template.append(this.playerButton);
                this.template.append(this.styleSheet);
            }
            if(areExtensions){
                let ele=document.querySelector(`.player-root .tw-c-text-overlay`);
                if(ele)this.findReactHandler(ele).children._owner.return.stateNode.context.setOverlayVisibility(false);
                document.querySelector(`.player-root .player-buttons-right`).prepend(this.playerButton);
            }
        }
    }

    static findReactComponent(el=undefined){
		if(el&&el instanceof Element&&Object.keys(el).length>0){
            let instance=Object.keys(el).filter((v)=>{if(v&&v.constructor===String&&v.toLowerCase().includes('__reactinternalinstance'))return v;})[0];
            if(instance){
                const fiberNode=el[instance];
                if((fiberNode&&fiberNode.return&&fiberNode.return.stateNode)instanceof Element)return this.findReactComponent(fiberNode&&fiberNode.return&&fiberNode.return.stateNode);
                else return fiberNode&&fiberNode.return&&fiberNode.return.stateNode;
            }
		}
		return null;
	}

    static findReactHandler(el=undefined){
        if(el&&el instanceof Element&&Object.keys(el).length>0){
            let instance=Object.keys(el).filter((v)=>{if(v&&v.constructor===String&&v.toLowerCase().includes('__reacteventhandlers'))return v;})[0];
            if(instance)return el[instance];
        }
        return null;
    }

    static WebModulesFind(filter){
        if(!global.window.webpackJsonp){
            console.log(`[${this.config.info.name}] Cannot find webpack modules (webpackJsonp) in relation to the window.`);
            return undefined;
        }
        const id="Test-WebModules";
        const req=typeof(global.window.webpackJsonp)=="function"?global.window.webpackJsonp([],{[id]:(module,exports,req)=>exports.default=req},[id]).default:global.window.webpackJsonp.push([[],{[id]:(module,exports,req)=>module.exports=req},[[id]]]);
        delete req.m[id];
        delete req.c[id];
        for(let m in req.c){
            if(req.c.hasOwnProperty(m)){
                var module=req.c[m].exports;
                if(module&&module.__esModule&&module.default&&filter(module.default))return module.default;
                if(module&&filter(module))return module;
            }
        }
    }

    static WebModulesFindByProperties(properties){
        if(!properties)return undefined;
        if(properties.constructor===String)properties=[properties];
        return this.WebModulesFind(module=>properties.every(prop=>module[prop]!==undefined));
    }

    static require(moduleName=undefined){
        if(moduleName&&moduleName.constructor===String){
            switch(moduleName.toLowerCase()){
                case'react':
                    return this.WebModulesFindByProperties('createElement','createClass','Component','PropTypes','Children');
                    break;
                case'reactdom':
                case'react-dom':
                case'domreact':
                case'dom-react':
                    return this.WebModulesFindByProperties('render','unmountComponentAtNode','findDOMNode','createPortal');
                    break;
            }
        }
        return undefined;
    }

    static HtmlCollectionToArray(context=document,selectors=[]){//Believe it or not, this seems to be up to 2x faster than jquery's .find() even when the returned array of elements is wrapped with jquery. More performance testing required.
        if(context&&selectors){
			if(selectors.constructor===String)selectors=[selectors];else if(selectors.constructor!==Array)selectors=[];//Cleanup selectors
			if(context.constructor===HTMLCollection||(NodeList&&context.constructor===NodeList))context=Array.from(context)/*.filter((ele)=>{if(ele instanceof Element)return ele;})*/;//If context is an html-collection/NodeList/jQuery-Collection then make context iterable and ensure it only contains elements.
			const isSelectorValid=function(s){try{document.createDocumentFragment().querySelector(s);return true;}catch(e){return false;}};//Check if css selector is valid, based off of: https://stackoverflow.com/a/42149818
			if(selectors.length===0){
				if(context.constructor===Array)return context;
			}else if(selectors.length===1){
				if(context.querySelector&&isSelectorValid(selectors[0]))return Array.from(context.querySelectorAll(selectors[0]));
			}else if(selectors.length>1){
				let arr=[];
				if(context.querySelector){
					for(let s of selectors){//Single parent element, grab child elements that match selectors.
						if(isSelectorValid(s))arr=arr.concat(Array.from(context.querySelectorAll(s)));//Seems to be the best way to turn into an array.
					}
				}else if(context.constructor===Array){
					for(let ele of context){//For each parent element, grab child elements that match selectors.
						for(let s of selectors){
							if(isSelectorValid(s))arr=arr.concat(Array.from(ele.querySelectorAll(s)));
						}
					}
				}
				if(arr.length>0)return arr/*[...new Set(arr)]*/;//Remove duplicates: https://stackoverflow.com/a/9229821
			}
        }
        return[];
    }

    static parseHTML(html=[]){
        if(html.constructor===String&&/(<[^<>]+>)/g.test(html)){
            var template=document.createElement('template');
            template.innerHTML=html.trim();
            return template.content.childNodes;
        }
        return null;
    }

    /*static disableButtons(){
        let int,eles=this.HtmlCollectionToArray(document.querySelectorAll('.extensions-dock__dock img.tw-image'));
        eles.forEach(function(el){
            el.click();
            int=setInterval(function(){
                if(document.getElementsByClassName('extensions-popover-view-layout')[0]){
                    let toggleButton=this.findReactHandler(document.querySelector(`input[label="visible"i]`)),closeFunc=this.findReactHandler(document.querySelector(`button[data-test-selector="popover-nav__close-button"]`));
                    if(toggleButton&&toggleButton.checked&&toggleButton.checked===true&&toggleButton.onChange&&toggleButton.onChange.constructor===Function)toggleButton.onChange();
                    if(closeFunc&&closeFunc.onClick&&closeFunc.onClick.constructor===Function)closeFunc.onClick();
                    console.log(toggleButton.checked,closeFunc&&closeFunc.constructor===Function)
                }else{
                    console.log(`Menu Closed. `,int);
                    clearInterval(int);
                }
            }.bind(this),200);
            //console.log([el,toggleButton,toggleButton.checked]);
        }.bind(this));
    }//*/

}//End of class.

(function(){ //Invoke the class
    'use strict';
    TwitchOverlayDisable.onStart();
})();
