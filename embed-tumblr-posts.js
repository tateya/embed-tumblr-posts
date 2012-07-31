/**
 * Embed Tumblr Posts
 *
 * @author Tateya GUMI
 * @version 0.2.0
 * @license MIT License
 */
(function(global, Module, undefined) {
  'use strict';

  var namespace = 'jp.or.tateya.embed-tumblr-posts';
  var window = global.window;
  var module = new Module(namespace, global);

  /**
   * @const
   * @type {string}
   * @since 0.1.0
   */
  var XHTML_NAMESPACE = 'http://www.w3.org/1999/xhtml';

  var EmbedTumblrPosts = module.find('EmbedTumblrPosts') || (function() {
    /**
     * @constructor
     * @param {Element} targetElement
     * @param {Object} settings
     * @since 0.1.0
     */
    var EmbedTumblrPosts = function EmbedTumblrPosts(targetElement, settings) {
      settings = settings || {};
      this.settings = util.objectMerge(EmbedTumblrPosts.DEFAULT_SETTINGS, settings);
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

    module.install('EmbedTumblrPosts', EmbedTumblrPosts);
    return EmbedTumblrPosts;
  })();

  var preparation = module.find('preparation') || (function() {
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
     * @private
     * @since 0.1.0
     */
    preparation.addListener = function addListener() {
      var listener = preparation.listener;
      window.addEventListener('DOMContentLoaded', listener);
    };

    /**
     * @private
     * @param {HTMLElement} targetElement
     * @param {Object} settings
     * @return {Function} listener
     * @since 0.1.0
     */
    preparation.createListener = function createListener(targetElement, settings) {
      var etp = new EmbedTumblrPosts(targetElement, settings);
      return function listener(event) {
        etp.run(event);
      };
    };

    /**
     * @private
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
     * @private
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
     * @private
     * @param {HTMLScriptElement} scriptElement
     * @return {Object} settings
     * @since 0.1.0
     */
    preparation.parseEmbedSettingsText = function parseEmbedSettingsText(scriptElement) {
      var embedSettingsText = util.extractContentsFromCdataSection(scriptElement.textContent);
      embedSettingsText = embedSettingsText || '{}';
      var settings = JSON.parse(embedSettingsText);
      return settings;
    };

    module.install('preparation', preparation);

    return preparation;
  })();

  var util = module.find('util') || (function() {
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

    module.install('util', util);

    return util;
  })();

  /**
   * @private
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
    if (typeof(document.createElementNS(XHTML_NAMESPACE, 'div').textContent) !== 'string' && typeof(Object.defineProperty) === 'function') {
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

  if (window === global) {
    if (typeof(window.navigator) !== 'undefined' && /MSIE/.test(window.navigator.userAgent)) {
      supportInternetExplorer(window.document);
    }
    preparation(window.document);
  }
})(this, (function() {
  'use strict';

  /**
   * @constructor
   * @param {string} namespace
   * @since 0.2.0
   */
  var Module = function Module(namespace, path) {
    path = path || {};
    var properties = namespace.split('.');
    for (var i=0, len=properties.length, property; i<len; i++) {
      property = properties[i];
      path = path[property] = path[property] || {};
    }
    this.path = path;
  };

  /**
   * @param {string} name
   * @return {Object} object
   * @since 0.2.0
   */
  Module.prototype.find = function find(name) {
    var object = this.path[name];
    return (typeof(object) !== 'undefined') ? object : null;
  };

  /**
   * @param {string} name
   * @param {Object} object
   * @return {Object} object
   * @since 0.2.0
   */
  Module.prototype.install = function install(name, object) {
    this.path[name] = object;
    return object;
  };

  return Module;
})(), void 0);
