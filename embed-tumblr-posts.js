/**
 * Embed Tumblr Posts
 *
 * @author Tateya GUMI
 * @version 0.1.0
 * @license MIT License
 */
(function(global, undefined) {
  'use strict';

  var window = global.window;

  /**
   * @const
   * @type {string}
   * @since 0.1.0
   */
  var XHTML_NAMESPACE = 'http://www.w3.org/1999/xhtml';

  var EmbedTumblrPosts = global.EmbedTumblrPosts || (function() {
    /**
     * @constructor
     * @param {Element} targetElement
     * @param {Object} settings
     * @since 0.1.0
     */
    var EmbedTumblrPosts = function EmbedTumblrPosts(targetElement, settings) {
      settings = settings || {};
      this.settings = util.objectMerge(EmbedTumblrPosts, settings);
      this.targetElement = targetElement;
      if (!(targetElement instanceof Element)) {
        throw new TypeError('This class is required argument targetElement.');
      }
      this.contextNode = targetElement.ownerDocument;
    };
    EmbedTumblrPosts.prototype.constructor = EmbedTumblrPosts;

    /**
     * @const
     * @type {Object.<string,number>}
     * @since 0.1.0
     */
    EmbedTumblrPosts.DEFAULT_SETTINGS = {
      api_key: null,
      'base-hostname': 'example.com',
      limit: 10,
      offset: 0
    };

    (function(proto) {
      /**
       * @param {Event} event
       * @since 0.1.0
       */
      proto.run = function run(event) {
      };
    })(EmbedTumblrPosts.prototype);

    global.EmbedTumblrPosts = EmbedTumblrPosts;
    return EmbedTumblrPosts;
  })();

  /**
   * @param {Document} document
   * @since 0.1.0
   */
  var preparation = function(document) {
    var currentScriptElement = preparation.getCurrentScriptElement(document);
    var settings = util.objectMerge.apply(util, [
      preparation.parseEmbedSettingsText(currentScriptElement),
      preparation.parseQueryString(currentScriptElement)
    ]);
    preparation.listener = preparation.createListener(currentScriptElement, settings);
    preparation.addListener();
  };

  /**
   * @param {Event} event
   * @since 0.1.0
   */
  preparation.listener = function listener(event) {
    return undefined;
  };

  /**
   * @since 0.1.0
   */
  preparation.addListener = function addListener() {
    var listener = preparation.listener;
    window.addEventListener('DOMContentLoaded', listener);
  };

  /**
   * @since 0.1.0
   * @return {function(Event)} listener
   */
  preparation.createListener = function createListener(targetElement, settings) {
    var etp = new EmbedTumblrPosts(targetElement, settings);
    return function listener(event) {
      etp.run(event);
    };
  };

  /**
   * @param {Document} document
   * @return {HTMLScriptElement} currentScriptElement
   * @since 0.1.0
   */
  preparation.getCurrentScriptElement = function getCurrentScriptElement(document) {
    var scriptElements = document.getElementsByTagNameNS(XHTML_NAMESPACE, 'script');
    var currentScriptElement = scriptElements[scriptElements.length-1];
    return currentScriptElement;
  };

  /**
   * @param {HTMLScriptElement} scriptElement
   * @return {Object} query
   * @since 0.1.0
   */
  preparation.parseQueryString = function parseQueryString(scriptElement) {
    var scriptUri = scriptElement.getAttribute('src');
    var queryString = (util.parseUri(scriptUri).search || '?').slice(1);
    var query = util.parseQueryString(queryString);
    return query;
  };

  /**
   * @param {HTMLScriptElement} scriptElement
   * @return {Object} settings
   * @since 0.1.0
   */
  preparation.parseEmbedSettingsText = function parseEmbedSettingsText(scriptElement) {
    var embedSettingsText = util.extractContentsFromCdataSection(scriptElement.textContent);
    var settings = JSON.parse(embedSettingsText);
    return settings;
  };

  /**
   * Utilty methods
   * @type {Object.<Function>}
   * @since 0.1.0
   */
  var util = {};

  /**
   * @param {...*} var_args
   * @return {Object}
   * @since 0.1.0
   */
  util.objectMerge = function objectMerge(var_args) {
    var objects = arguments;
    var newObject = {};
    for (var i=0, len=objects.length, object, objectKey; i<len; i++) {
      for (objectKey in object = objects[i]) {
        newObject[objectKey] = object[objectKey];
      }
    }
    return newObject;
  };

  /**
   * @param {string} uri
   * @return {Object} parsedUri
   * @since 0.1.0
   */
  util.parseUri = function parseUri(uri) {
    var parsedUri = document.createElementNS(XHTML_NAMESPACE, 'a');
    parsedUri.setAttribute('href', uri);
    return parsedUri;
  };

  /**
   * @param {string} queryString
   * @return {Object} query;
   * @since 0.1.0
   */
  util.parseQueryString = function parseQueryString(queryString) {
    var query = {};
    var splitQueryString = queryString.split(/[;&]/);
    for (var i=0, len=splitQueryString.length, keyAndValue; i<len; i++) {
      keyAndValue = splitQueryString[i].split('=');
      query[keyAndValue[0]] = keyAndValue[1] || true;
    }
    return query;
  };

  /**
   * @param {string} cdataSection
   * @return {string} content
   * @since 0.1.0
   */
  util.extractContentsFromCdataSection = function extractContentsFromCdataSection(cdataSection) {
    var contents = cdataSection;
    contents = contents.replace(/^<!\[CDATA\[/, '');
    contents = contents.replace(/\]\]>$/, '');
    return contents;
  };

  /**
   * @param {string} text
   * @return {string} extractedHtmlTagsText
   * @since 0.1.0
   */
  util.extractHtmlTags = function extractHtmlTags(text) {
    var extractedHtmlTagsText = text;
    extractedHtmlTagsText = extractedHtmlTagsText.replace(/<.+?>/g, '');
    return extractedHtmlTagsText;
  };

  /**
   * @param {string} text
   * @return {string} escapedText
   * @since 0.1.0
   */
  util.escapeHtmlTags = function escapeHtmlTags(text) {
    var escapedText = text;
    escapedText = escapedText.replace(/&/g, '&amp;');
    escapedText = escapedText.replace(/</g, '&lt;');
    escapedText = escapedText.replace(/>/g, '&gt;');
    return escapedText;
  };

  /**
   * @param {Document} document
   * @since 0.1.0
   */
  function supportInternetExplorer(document) {
    if (typeof(global.Window.prototype.addEventListener) !== 'function') {
      global.Window.prototype.addEventListener = function addEventListener(type, listener, useCapture) {
        var target = this;
        listener = function(event) {
          if (event.type === 'onreadystatechange' && this.readyState !== 'complate') {
            return;
          }
          listener.call(target, event);
        };
        if (type !== 'DOMContentLoaded') {
          document.attachEvent('onreadystatechange', listener);
        } else {
          this.attachEvent('on' + type, listener);
        }
      };
    }
    if (typeof(document.createElementNS) !== 'function') {
      document.createElementNS = function createElementNS(namespace, tagName) {
        return this.createElement(tagName);
      };
    }
    if (typeof(document.getElementsByTagNameNS) !== 'function') {
      document.getElementsByTagNameNS = function getElementsByTagNameNS(namespace, tagName) {
        return this.getElementsByTagName(tagName);
      };
    }
    if (typeof(document.createElementNS(XHTML_NAMESPACE, 'div').textContent) !== 'string') {
      Object.defineProperty(Element.prototype, 'textContent', {
        get: function getter() {
          return this.extractHtmlTags(this.innerHTML);
        },
        set: function setter(text) {
          return this.innerHTML = util.escapeHtmlTags(text);
        },
        configurable: true,
        enumerable: false
      });
    }
  };
  if (/MSIE/.test(window.navigator.userAgent)) {
    supportInternetExplorer(window.document);
  }

  if (window === global) {
    preparation(window.document);
  }
})(this, void 0);
