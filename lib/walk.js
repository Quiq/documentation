'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.walk = walk;

/**
 * Apply a function to all comments within a hierarchy: this iterates
 * through children in the 'members' property.
 *
 * @param {Array<Object>} comments an array of nested comments
 * @param {Function} fn a walker function
 * @param {Object} [options] options passed through to walker function
 * @returns {Array<Object>} comments
 */
function walk(comments, fn, options) {
  comments.forEach(function(comment) {
    fn(comment, options);
    for (var scope in comment.members) {
      walk(comment.members[scope], fn, options);
    }
  });
  return comments;
}
