'use strict';

var findTarget = require('./finders').findTarget;
var t = require('babel-types');
var flowDoctrine = require('../flow_doctrine');

/**
 * Infers returns tags by using Flow return type annotations
 *
 * @name inferReturn
 * @param {Object} comment parsed comment
 * @returns {Object} comment with return tag inferred
 */
function inferReturn(comment) {
  if (
    Array.isArray(comment.returns) &&
    comment.returns.length &&
    comment.returns[0].type
  ) {
    return comment;
  }
  var path = findTarget(comment.context.ast);
  var fn = path && path.node;
  if (!fn) {
    return comment;
  }

  // In case of `/** */ var x = function () {}` findTarget returns
  // the declarator.
  if (t.isVariableDeclarator(fn)) {
    fn = fn.init;
  }

  if (t.isFunction(fn) && fn.returnType && fn.returnType.typeAnnotation) {
    var returnType = flowDoctrine(fn.returnType.typeAnnotation);
    if (comment.returns && comment.returns.length > 0) {
      comment.returns[0].type = returnType;
    } else {
      comment.returns = [
        {
          title: 'returns',
          type: returnType
        }
      ];
    }
  }
  return comment;
}

module.exports = inferReturn;
