module.exports = {
  preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: 'node',
  transformIgnorePatterns: [
    'node_modules/(?!(vfile|trough|is-plain-obj|bail|unified|unist-util-visit|unist-util-is|mdast-util-to-string|mdast-util-from-markdown|micromark|parse-entities|character-entities|unist-util-stringify-position))'
  ]
}
