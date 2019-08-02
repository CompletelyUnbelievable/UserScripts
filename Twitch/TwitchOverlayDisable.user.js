// ==UserScript==
// @name         Twitch Overlay Disable
// @namespace    https://github.com/CompletelyUnbelievable
// @updateURL    https://raw.githubusercontent.com/CompletelyUnbelievable/UserScripts/master/Twitch/TwitchOverlayDisable.user.js
// @version      1.2
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
        this.observerObj=this.defineObserver();
        this.config={debug:false,debugClick:false,timer:false,info:{name:'TwitchOverlayDisable',description:'Disable extension buttons for the Twitch player',version:'1.2'}}; //Temp settings.
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
            if(addedNodes[0].querySelector('.extensions-dock__dock img.tw-image')){
                let ele=document.querySelector(`.player-root .tw-c-text-overlay`);
                if(ele)this.findReactHandler(ele).children._owner.return.stateNode.context.setOverlayVisibility(false);
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
