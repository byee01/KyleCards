var Network = {
    
    test : function() {
        var transport = Network.getTransport();
        
        transport.open( "GET", "http://localhost/sol/index.html", true );
        // Assign callback function directly
        transport.onreadystatechange = Network.callback;
        transport.send(null);
    },
    
    callback : function() {
        Utility.debug("NetworkRequestCallback");
    },

    getTransport : function() {
        var ret = null;
        if(typeof XMLHttpRequest == "undefined") {
            // ie
            var MSXML_XMLHTTP_PROGIDS = [
                'MSXML2.XMLHTTP.5.0',
                'MSXML2.XMLHTTP.4.0',
                'MSXML2.XMLHTTP.3.0',
                'MSXML2.XMLHTTP',
                'Microsoft.XMLHTTP'
            ];

            var success = false;
            for (var i=0;i < MSXML_XMLHTTP_PROGIDS.length && !success; i++) {
                try {
                    ret = new ActiveXObject(MSXML_XMLHTTP_PROGIDS[i]);
                    success = true;
                } catch (e) {
                    /* Nothing */
                }
            }
        } else {
            ret = new XMLHttpRequest();
        }
        return ret;
    }
    
}
