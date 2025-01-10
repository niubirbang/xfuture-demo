
let os = require("os");

class xParser {

    parse(uri){
        if (uri.startsWith("vmess://")) {
            return this.parseVMess(uri);
        }
        else if (uri.startsWith("vless://")) {
            return this.parseVless(uri);
        }
        else if (uri.startsWith("ss://")) {
            return this.parseSS(uri);
        }
        else if (uri.startsWith("trojan://")) {
            return this.parseTrojan(uri);
        }
        else if (uri.startsWith("niuniu://")) {
            return this.parseNiuniu(uri);
        }
        else if (uri.startsWith("ppx://")) {
          return this.parsePPx(uri);
      }
        return {};
    }

    parseNiuniu(url){
      url = url.substring(9);
      var raw = url;

      var info = raw.split("@");
      if (info.length < 2) {
          raw = this.decode(url);
          info = raw.split("@");
      }
      if (info.length < 2) return {};
      var config = info[1].split("?");
      if (config.length < 2) return {};

      var ipAddress = config[0].split(":");
      if (ipAddress.length < 2) return {};

      var address = ipAddress[0];
      var port = ipAddress[1];
      var suffix = config[1].split("#");
      if (suffix.length < 2) return {};

      var remark = suffix[1];

      var base = {};
      
      base.remark = remark;
      base.address = address;
      base.port = port * 1;

      return base;

    }

    parsePPx(urlString){
      urlString = urlString.replace("ppx://", "http://");
      const url = new URL(urlString);
      

      console.log(url)

      var hostname = url.hostname;
      var port = url.port;
      
      var base = {};
      base.remark = "ppx";
      base.address = hostname;
      base.port = port * 1;

      return base;

    }

    parseSS(url){
        url = url.substring(5);
        if (url.includes("@")) {
            var list = url.split("@");
            var prefix = list[0];
            var prefix = this.decode(prefix);
            url = prefix + "@" + list[1];
        }
        else {
            var list = url.split("#");
            var prefix = list[0];
            var prefix = this.decode(prefix);
            url = prefix + "#" + list[1];
        }

        var list = url.split("#");
        if (list.length != 2) return {};
        var remark = list[1];
        var userInfos =  list[0].split("@");
        if (userInfos.length != 2) return {};

        var userInfo = userInfos[0];
        var serverInfo = userInfos[1];

        var accountPasswords = userInfo.split(":");
        var ipPorts = serverInfo.split(":");
        if (accountPasswords.length != 2 || ipPorts.length != 2) {
            return {};
        }
        var address = ipPorts[0];
        var port = ipPorts[1] * 1

        var routing = {};
        var rules = this.getRules();
        if (!this.isGlobalMode) {
            routing.domainStrategy = "IPIfNonMatch";
        }
        else{
            routing.domainStrategy = "AsIs";
        }
        routing.rules = rules;
        var base = this.getBase();
        base.routing = routing;
        base.remark = remark;
        base.address = address;
        base.port = port * 1;
        return base;
    }

    decode(str) {
        var buffer = Buffer.from(str, 'base64');
        var raw = buffer.toString('utf-8');
        return raw;
    }

    parseVless(url){
        url = url.substring(8);
        var raw = url;

        var info = raw.split("@");
        if (info.length < 2) {
            raw = this.decode(url);
            info = raw.split("@");
        }
        if (info.length < 2) return {};
        var config = info[1].split("?");
        if (config.length < 2) return {};

        var ipAddress = config[0].split(":");
        if (ipAddress.length < 2) return {};

        var address = ipAddress[0];
        var port = ipAddress[1];
        var suffix = config[1].split("#");
        if (suffix.length < 2) return {};

        var remark = suffix[1];
        var routing = {};
        var rules = this.getRules();
        if (!this.isGlobalMode) {
            routing.domainStrategy = "IPIfNonMatch";
        }
        else{
            routing.domainStrategy = "AsIs";
        }
        routing.rules = rules;
        var base = this.getBase();
        base.routing = routing;
        base.remark = remark;
        base.address = address;
        base.port = port * 1;
        return base;
    }

    parseTrojan(url){
        url = url.substring(9);
        var info = url.split("@");
        if (info.length < 2) {
            return {};
        }

        var config = info[1].split("?");
        if (config.length < 2) {
            return {};
        }

        var ipAddress = config[0].split(":");
        if (ipAddress.length < 2) {
            return {};
        }
        var address = ipAddress[0];
        var port = ipAddress[1] * 1

        var suffix = config[1].split("#");
        if (suffix.length < 2) {
            return {};
        }

        var remark = suffix[1];
        var routing = {};
        var rules = this.getRules();
        if (!this.isGlobalMode) {
            routing.domainStrategy = "IPIfNonMatch";
        }
        else{
            routing.domainStrategy = "AsIs";
        }
        routing.rules = rules;
        var base = this.getBase();
        base.routing = routing;
        base.remark = remark;
        base.address = address;
        base.port = port * 1;
        return base;


    }

    parseVMess(url){
        var url = url.substring(8);
        var vmess = this.decode(url);
        var info = JSON.parse(vmess);
        var address = info.add;
        var port = info.port;
        var remark = info.remark;
        if (remark == null || remark == undefined) {
            remark = info.ps;
        }
        var routing = {};
        var rules = this.getRules();
        if (!this.isGlobalMode) {
            routing.domainStrategy = "IPIfNonMatch";
        }
        else{
            routing.domainStrategy = "AsIs";
        }
        routing.rules = rules;
        var base = this.getBase();
        base.routing = routing;
        base.remark = remark;
        base.address = address;
        base.port = port * 1;
        return base;
    }

    getRules() {
        var rules = [];
        if (!this.isTunMode) {
          var ips_direct = [];
          var ips_block = [];
          var ips_proxy = [];

          var domains_direct = [];
          var domains_block = [];
          var domains_proxy = [];

          for (let index = 0; index < this.rules.length; index++) {
            const element = this.rules[index];
            if (element.type == "domain") {
              if (element.method == "block") {
                domains_block.push(element.content);
              }
              else if (element.method == "direct") {
                domains_direct.push(element.content);
              }
              else {
                domains_proxy.push(element.content);
              }
            }
            else {
              if (element.method == "block") {
                ips_block.push(element.content);
              }
              else if (element.method == "direct") {
                ips_direct.push(element.content);
              }
              else {
                ips_proxy.push(element.content);
              }
            }
          }

          if (ips_block.length > 0) {
            var x = {};
            x.type = "field";
            x.outboundTag = "block";
            x.ip = ips_block;
            rules.push(x);
          }

          if (ips_direct.length > 0) {
            var x = {};
            x.type = "field";
            x.outboundTag = "direct";
            x.ip = ips_direct;
            rules.push(x);
          }

          if (ips_proxy.length > 0) {
            var x = {};
            x.type = "field";
            x.outboundTag = "proxy";
            x.ip = ips_proxy;
            rules.push(x);
          }

          if (domains_block.length > 0) {
            var x = {};
            x.type = "field";
            x.outboundTag = "block";
            x.domain = domains_block;
            rules.push(x);
          }

          if (domains_direct.length > 0) {
            var x = {};
            x.type = "field";
            x.outboundTag = "direct";
            x.domain = domains_direct;
            rules.push(x);
          }

          if (domains_proxy.length > 0) {
            var x = {};
            x.type = "field";
            x.outboundTag = "proxy";
            x.domain = domains_proxy;
            rules.push(x);
          }
        }
        if (!this.isGlobalMode && !this.isTunMode) {
          var rules_geo = [
            {
                "type":"field",
                "domain":["geosite:cn"],
                "outboundTag":"direct"
            },
            {
                "type":"field",
                "ip":["geoip:private", "geoip:cn"],
                "outboundTag":"direct"
            },
            {
                "type":"field",
                "domain":["geosite:geolocation-!cn"],
                "outboundTag":"proxy"
            }
          ]
          rules = [...rules, ...rules_geo];
        }
        return rules;
    }

    getBase(){
        var base = {
            "remark": "Mao Dou",
            "log": {
                "loglevel": "info"
            },
            "stats":{},
            "policy":{
              "system": {
                "statsOutboundUplink": true,
                "statsOutboundDownlink": true
              },
            },
            "inbounds": [
                {
                    "settings": {
                    "userLevel": 8
                    },
                    "protocol": "http",
                    "port": 40009,
                    "tag": "http",
                    "listen": "127.0.0.1"
                },
                {
                    "settings": {
                        "udp": true,
                        "auth": "noauth"
                    },
                    "protocol": "socks",
                    "port": 40008,
                    "sniffing": {
                      "enabled": true,
                      "destOverride": [
                          "http",
                          "tls"
                      ]
                    },
                    "tag": "socks",
                    "listen": "127.0.0.1"
                }
            ],
            "outbounds":[
                {
                    "protocol": "freedom",
                    "tag": "proxy"
                },
                {
                    "protocol": "freedom",
                    "tag": "direct"
                },
                {
                    "settings": {
                        "response": {
                            "type": "http"
                        }
                    },
                    "protocol": "blackhole",
                    "tag": "block"
                }
            ],
            "dns": {
              "hosts": {
                "domain:googleapis.cn": "googleapis.com",
                "dns.google": "8.8.8.8",
              },
              "servers":["8.8.8.8", "8.8.4.4"]
            }
        }
        return base;
    }

    setRouterConfiguration(rules) {
      this.rules = rules;
    }
    
}

const xParserInstance = new xParser;
xParserInstance.isGlobalMode = false;
xParserInstance.isTunMode = false;
xParserInstance.workingDir = "";
xParserInstance.rules = [];
module.exports = xParserInstance;
export default xParserInstance;
