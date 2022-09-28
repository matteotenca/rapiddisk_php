## rapiddisk_php

### Quick start

* Clone repo
* `cd` repo dir
* Start the `run_server.sh` script: it will run the `php` internal server, listening on port 9229 of 127.0.0.1
* Point your browser to http://127.0.0.1:9229

#### Tips
* If you are on a remote machine, use ssh to map local port to remote port such this:

  `ssh -L 9229:127.0.0.1:9229 <username>@<remotehost>`
