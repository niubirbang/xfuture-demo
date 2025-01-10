let os = require("os");
const { spawn } = require('child_process')
var isMac = os.platform() === "darwin";
// const ff = require('./xfuture_source');
const ff = require('../../resources/xfuture/package/darwin/xfuture_source');
import parser from './xfuture_parser'
parser.isGlobalMode = false;

class xFuture {
  init() {
    this.driver = "";
    this.isTunMode = true;
    this.shell_path = "";
    this.helper_path = "";
    this.driver = "";
  }

  SetPassword(password) {
    ff.SetPassword(password);
  }

  SetTunModeEnable(enable) {
    this.isTunMode = enable;
    parser.isTunMode = enable;
    ff.SetTunModeEnable(enable);
  }

  StartTunnel(url) {
    if (this.driver.length == 0) return false;
    var json = parser.parse(url);
    var xray_json = JSON.stringify(json);
    console.log("json:", json);
    var ok = ff.StartTunnel(xray_json, url, json.address);
    if (ok) {
      ok = this.StartProxy();
    }
    return ok;
  }

  StopTunnel() {
    ff.StopTunnel();
    this.StopProxy();
  }

  StartProxy() {
    if (isMac || this.isTunMode) return true;
    var ret = true;
    try {
      let process = spawn(this.driver, ["global", "socks=127.0.0.1:40008"])
      process.on('close', (code) => {
        console.info('[sysproxy open]:', code)
        this.invoke(2);
      });
    } catch (err) {
      console.warn('[sysproxy open] failed:', err)
      this.invoke(3);
      this.StopTunnel();
      ret = false;
    }
    return ret;
  }

  // App 进程退出时调用该接口，否则会导致电脑出现断网情况
  StopProxy() {
    if (!isMac) {
      try {
        let process = spawn(this.driver, ["off"])
        process.on('close', function (code) {
          console.info('[sysproxy stop]:', code)
        });
      } catch (err) {
        console.warn('[sysproxy stop] failed:', err)
      }
    }
    ff.StopProxy();
  }

  SetGlobalMode(isGlobalMode) {
    console.log("isGlobalMode:", isGlobalMode);
    parser.isGlobalMode = isGlobalMode;
    ff.SetGlobalMode(isGlobalMode);
  }

  // 1. Mac 请传 install_helper.sh 和 xfuture_helper 的绝对路径
  // 2. Windows 请传 "maodou" 固定字符串 和 sysproxy.exe 的绝对路径
  // 3. workingDir 传所有 geoip 和资源的目录绝对路径
  InstallDriver(shell_path, helper_path, workingDir, logDir) {
    this.driver = helper_path;
    this.workingDir = workingDir;
    this.shell_path = shell_path;
    parser.workingDir = workingDir;
    parser.driver = helper_path;
    parser.shell_path = shell_path;
    ff.InstallDriver(shell_path, helper_path, workingDir, logDir);
  }

  GetCurrentStatus() {
    return ff.GetCurrentStatus();
  }

  GetCurrentURI() {
    return ff.GetCurrentURI();
  }

  /**
   * 
   * @param {事件名称} name 
   * @param {函数回调} func 
   * 
   * K_IDEL = 0; K_Connecting = 1;K_Connected = 2; K_Disconnected = 3;
   * connectionStatusDidChange: function(status) {}
   * 
   * 
   */
  SetEventCallback(name, func) {
    ff.SetEventCallback(name, func);
  }

  GetSingBoxDuraion() {
    return ff.GetSingBoxDuraion();
  }

  GetXrayDuration() {
    return ff.GetXrayDuration();
  }

  GetStatistics() {
    return ff.GetStatistics();
  }

  invoke(status) {
    ff.invoke(status);
  }
}

const xFutureInstance = new xFuture;
xFutureInstance.init();
module.exports = xFutureInstance;
export default xFutureInstance;