import React from "react";
let Forge = require('node-forge');

/**
 *
 */
class MD5Util extends React.Component {

    /**
     *
     * @param value
     * @returns {string}
     */
    static stringToMD5(value) {
        var md5 = Forge.md.md5.create();
        md5.update(value);
        return md5.digest().toHex();
    }
}

module.exports = MD5Util;