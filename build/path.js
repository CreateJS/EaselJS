module.exports = {
    path: function(str) {
        return  str.substr(str.lastIndexOf("/")+1);
    }
}
