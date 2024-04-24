/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

const fs = require('fs');
const path = require('path');

module.exports = async function (context, options) {
  const folders = fs
    .readdirSync(options.baseDir, {withFileTypes: true})
    .filter(
      (dirent) =>
        dirent.isDirectory() &&
        dirent.name !== 'lexical-website' &&
        fs.existsSync(path.resolve(options.baseDir, dirent.name, 'README.md')),
    )
    .map((dirent) => [
      dirent.name,
      path.resolve(options.baseDir, dirent.name, 'README.md'),
    ]);

  fs.mkdirSync(options.targetDir, {recursive: true});
  for (const [folderName, srcPath] of folders) {
    fs.copyFileSync(
      srcPath,
      path.resolve(options.targetDir, `${folderName}.md`),
    );
  }

  return {
    name: 'package-docs',
  };
};
