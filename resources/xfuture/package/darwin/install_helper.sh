#!/bin/sh

#  install_helper.sh
#  V2RayX
#
#  Copyright © 2016年 Cenmrev. All rights reserved.

driver_path="$1"
driver_dir=$(dirname "$driver_path")
package_dir=$(dirname "$driver_dir")
xfuture_dir=$(dirname "$package_dir")

sudo mkdir -p "/Library/Application Support/maodou-helper/"
sudo cp "${driver_path}" "/Library/Application Support/maodou-helper/xsing-box-exec"
sudo chown root:admin "/Library/Application Support/maodou-helper/xsing-box-exec"
sudo chmod +s "/Library/Application Support/maodou-helper/xsing-box-exec"
sudo chmod 777 "${xfuture_dir}/resources"
echo done
