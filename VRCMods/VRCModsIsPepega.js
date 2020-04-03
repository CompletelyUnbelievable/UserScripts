// ==UserScript==
// @name         VRCMods Is Pepega
// @namespace    https://github.com/CompletelyUnbelievable
// @version      0.1
// @description  No effort needed, when they offer the solution to the issue as a function on the page. Probably best if you just disable your AdBlock for their website but if they make it this easy to bypass even I'm gonna bypass it.
// @author       CompletelyUnbelievable
// @match        https://www.vrcmods.com/item/*
// @match        http://www.vrcmods.com/item/*
// @match        https://www.vrcmods.com/download/*
// @match        http://www.vrcmods.com/download/*
// @grant        none
// @run-at       document-end
// ==/UserScript==
class vrc{static constructor(){this.dwnld=this.firstIndex(Array.from(document.querySelectorAll("a")).filter(t=>!!t&&/^download$/gi.test(t.innerText))),this.id=this.firstIndex(window.location.href.split("/").filter(t=>!!t&&/^[0-9]+$/g.test(t)))}static onStart(){this.constructor(),!this.dwnld&&window.allowDL&&window.fuck&&window.allowDL.constructor===Function&&window.fuck.constructor===Function?setTimeout(function(){window.allowDL()},250):this.dwnld&&this.id&&(vrc.dwnld.href=`${window.location.origin}/download/direct/${this.id}`)}static firstIndex(t){return!(!t||t.constructor!==Array||!t[0])&&t[0]}}!function(){"use strict";vrc.onStart()}();
