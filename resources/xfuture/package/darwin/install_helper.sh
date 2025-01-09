#!/bin/sh

#  install_helper.sh
#  V2RayX
#
#  Copyright © 2016年 Cenmrev. All rights reserved.

driver_path="$1"
sudo mkdir -p "/Library/Application Support/maodou-helper/"
sudo cp "${driver_path}" "/Library/Application Support/maodou-helper/xsing-box-exec"
sudo chown root:admin "/Library/Application Support/maodou-helper/xsing-box-exec"
sudo chmod +s "/Library/Application Support/maodou-helper/xsing-box-exec"
echo done
